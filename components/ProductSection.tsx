'use client';

import React, { useState, useEffect } from 'react';
import { Coffee, CupSoda, Croissant, ShoppingBag, Star } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { toast } from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  averageRating: number;
  totalReviews: number;
}

const categories = [
  { name: "all", icon: ShoppingBag, label: "All Items" },
  { name: "hot", icon: Coffee, label: "Hot Beverages" },
  { name: "cold", icon: CupSoda, label: "Cold Beverages" },
  { name: "food", icon: Croissant, label: "Food" }
];

const ProductSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeCategory !== 'all') params.append('category', activeCategory);
      if (searchTerm) params.append('search', searchTerm);

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div id="menu" className="section-padding bg-cream-50">
      <div className="container mx-auto container-padding">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-heading mb-4">Our Menu</h2>
          <p className="text-brown-700">
            From premium coffee to delectable pastries, our menu is crafted to elevate your experience.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
            aria-label="Search products"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`flex items-center px-5 py-3 rounded-full transition-all duration-300 ${
                  activeCategory === category.name
                    ? 'bg-brown-600 text-white'
                    : 'bg-cream-200 text-brown-700 hover:bg-cream-300'
                }`}
                aria-label={`Filter by ${category.label}`}
              >
                <Icon className="h-5 w-5 mr-2" />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brown-600 border-r-transparent"></div>
            <p className="mt-4 text-brown-700">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-brown-700">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div 
                key={product._id}
                className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl"
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoverIndex === index ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-cream-500 text-brown-800 text-sm font-medium">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.totalReviews > 0 && (
                      <div className="flex items-center bg-white/90 px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm ml-1 font-medium">{product.averageRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-heading font-medium mb-2">{product.name}</h3>
                  <p className="text-brown-700 text-sm mb-4">{product.description}</p>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full btn btn-outline text-sm"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSection;
