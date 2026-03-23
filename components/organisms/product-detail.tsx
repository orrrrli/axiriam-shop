'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, ChevronLeft, ChevronRight,
  ShoppingBag, Minus, Plus, Star, Check,
  X, Send,
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils/helpers';
import { toast } from 'react-hot-toast';
import type { Product, Review } from '@/types/product';

// ─── Star display ─────────────────────────────────────────────────────────────

function Stars({ rating, size = 14 }: { rating: number; size?: number }): React.ReactElement {
  return (
    <div className="flex items-center gap-[0.2rem]">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.5}
          className={i <= Math.round(rating) ? 'fill-[#101010] text-[#101010]' : 'fill-[#e0e0e0] text-[#e0e0e0]'}
        />
      ))}
    </div>
  );
}

// ─── Interactive star picker ──────────────────────────────────────────────────

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }): React.ReactElement {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-[0.4rem]">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform duration-100 hover:scale-110"
        >
          <Star
            size={24}
            strokeWidth={1.5}
            className={i <= (hovered || value)
              ? 'fill-[#101010] text-[#101010]'
              : 'fill-[#e8e8e8] text-[#e8e8e8]'}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Image carousel ───────────────────────────────────────────────────────────

function ImageCarousel({ images }: { images: string[] }): React.ReactElement {
  const [active, setActive] = useState(0);

  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next]);

  return (
    <div className="flex flex-col gap-[1.6rem]">
      {/* Main image */}
      <div className="relative aspect-square bg-[#f7f7f7] rounded-[1.6rem] overflow-hidden group">
        <div
          className="flex w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {images.map((src, i) => (
            <div key={i} className="w-full h-full shrink-0 relative">
              <Image
                src={src}
                alt={`Producto foto ${i + 1}`}
                fill
                className="object-contain p-[3rem]"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-[1.2rem] top-1/2 -translate-y-1/2 w-[3.6rem] h-[3.6rem] rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#f5f5f5]"
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-[1.2rem] top-1/2 -translate-y-1/2 w-[3.6rem] h-[3.6rem] rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#f5f5f5]"
            >
              <ChevronRight size={18} strokeWidth={2} />
            </button>
          </>
        )}

        {/* Dot indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-[1.4rem] left-1/2 -translate-x-1/2 flex gap-[0.5rem]">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === active ? 'w-[2rem] h-[0.6rem] bg-[#101010]' : 'w-[0.6rem] h-[0.6rem] bg-[#101010]/25'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-[1rem] overflow-x-auto pb-[0.4rem]">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`shrink-0 w-[7.2rem] h-[7.2rem] rounded-[0.8rem] bg-[#f7f7f7] overflow-hidden border-2 transition-all duration-200
                ${i === active ? 'border-[#101010] shadow-[0_2px_8px_rgba(0,0,0,0.12)]' : 'border-transparent hover:border-[#d0d0d0]'}`}
            >
              <Image
                src={src}
                alt={`Miniatura ${i + 1}`}
                width={72}
                height={72}
                className="w-full h-full object-contain p-[0.8rem]"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Review card ──────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }): React.ReactElement {
  const date = new Date(review.createdAt).toLocaleDateString('es-MX', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
  return (
    <div className="py-[2.4rem] border-b border-[#f0f0f0] last:border-b-0">
      <div className="flex items-start justify-between mb-[1rem]">
        <div>
          <div className="flex items-center gap-[1rem]">
            <div className="w-[3.2rem] h-[3.2rem] rounded-full bg-[#101010] flex items-center justify-center text-white text-[1.2rem] font-bold [font-family:var(--font-inter)]">
              {review.userName.charAt(0)}
            </div>
            <div>
              <p className="text-[1.3rem] font-semibold text-[#101010] m-0 [font-family:var(--font-inter)]">
                {review.userName}
              </p>
              <p className="text-[1.1rem] text-[rgba(0,0,0,0.4)] m-0 [font-family:var(--font-inter)]">{date}</p>
            </div>
          </div>
        </div>
        <Stars rating={review.rating} size={13} />
      </div>
      <p className="text-[1.4rem] text-[rgba(0,0,0,0.7)] leading-relaxed m-0 [font-family:var(--font-source-sans)]">
        &ldquo;{review.comment}&rdquo;
      </p>
    </div>
  );
}

// ─── Review form ──────────────────────────────────────────────────────────────

interface ReviewFormProps {
  onClose: () => void;
  onSubmit: (review: Review) => void;
}

function ReviewForm({ onClose, onSubmit }: ReviewFormProps): React.ReactElement {
  const [rating, setRating]   = useState(0);
  const [name, setName]       = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0)        { toast.error('Selecciona una calificación'); return; }
    if (name.trim() === '')  { toast.error('Ingresa tu nombre'); return; }
    if (comment.trim() === '') { toast.error('Escribe tu reseña'); return; }

    setLoading(true);
    setTimeout(() => {
      onSubmit({ user: 'local', userName: name.trim(), rating, comment: comment.trim(), createdAt: new Date() });
      toast.success('¡Reseña publicada!');
      setLoading(false);
    }, 600);
  };

  return (
    <div className="bg-[#fafafa] rounded-[1.4rem] border border-[#f0f0f0] p-[2.4rem] mb-[2.4rem]">
      <div className="flex items-center justify-between mb-[2rem]">
        <h3 className="text-[1.6rem] font-semibold text-[#101010] m-0 [font-family:var(--font-inter)]">
          Escribe tu reseña
        </h3>
        <button type="button" onClick={onClose} className="w-[3rem] h-[3rem] rounded-full hover:bg-[#ebebeb] flex items-center justify-center transition-colors">
          <X size={15} strokeWidth={2} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[1.8rem]">
        {/* Rating picker */}
        <div>
          <label className="block text-[1.2rem] font-semibold text-[rgba(0,0,0,0.5)] uppercase tracking-wider mb-[0.8rem] [font-family:var(--font-inter)]">
            Calificación
          </label>
          <StarPicker value={rating} onChange={setRating} />
        </div>

        {/* Name */}
        <div>
          <label className="block text-[1.2rem] font-semibold text-[rgba(0,0,0,0.5)] uppercase tracking-wider mb-[0.8rem] [font-family:var(--font-inter)]">
            Tu nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Dra. Sofía M."
            maxLength={60}
            className="w-full px-[1.4rem] py-[1rem] rounded-[0.8rem] border border-[#e0e0e0] text-[1.4rem] text-[#101010] bg-white placeholder-[rgba(0,0,0,0.3)] focus:outline-none focus:border-[#101010] transition-colors [font-family:var(--font-source-sans)]"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-[1.2rem] font-semibold text-[rgba(0,0,0,0.5)] uppercase tracking-wider mb-[0.8rem] [font-family:var(--font-inter)]">
            Tu reseña
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Cuéntanos tu experiencia con el producto..."
            rows={4}
            maxLength={500}
            className="w-full px-[1.4rem] py-[1rem] rounded-[0.8rem] border border-[#e0e0e0] text-[1.4rem] text-[#101010] bg-white placeholder-[rgba(0,0,0,0.3)] focus:outline-none focus:border-[#101010] transition-colors resize-none [font-family:var(--font-source-sans)]"
          />
          <p className="text-right text-[1.1rem] text-[rgba(0,0,0,0.3)] mt-[0.4rem] [font-family:var(--font-inter)]">
            {comment.length}/500
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-[0.8rem] py-[1.2rem] rounded-[0.8rem] bg-[#101010] text-white text-[1.4rem] font-semibold hover:bg-[#222] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 [font-family:var(--font-inter)]"
        >
          <Send size={14} strokeWidth={2} />
          {loading ? 'Publicando...' : 'Publicar reseña'}
        </button>
      </form>
    </div>
  );
}

// ─── Main ProductDetail ───────────────────────────────────────────────────────

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps): React.ReactElement {
  const addItem    = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const items      = useCartStore((state) => state.items);

  const productId  = product._id || product.id || '';
  const isInCart   = items.some((i) => i.id === productId);
  const cartItem   = items.find((i) => i.id === productId);

  const [qty, setQty]                 = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [localReviews, setLocalReviews]     = useState<Review[]>(product.reviews ?? []);

  const images = product.images?.length ? product.images : [product.image];
  const avgRating = product.averageRating ?? 0;

  const handleAddToCart = () => {
    if (isInCart) {
      removeItem(productId);
      toast.success(`${product.name} eliminado del carrito`);
    } else {
      for (let i = 0; i < qty; i++) {
        addItem({ id: productId, name: product.name, price: product.price, image: product.image, category: product.category });
      }
      toast.success(`${qty > 1 ? `${qty}× ` : ''}${product.name} agregado al carrito`);
    }
  };

  const handleReviewSubmit = (review: Review) => {
    setLocalReviews((prev) => [review, ...prev]);
    setShowReviewForm(false);
  };

  return (
    <div className="w-full [font-family:var(--font-source-sans)]">

      {/* ── Breadcrumb ── */}
      <div className="px-[5rem] max-xs:px-[2rem] pt-[10rem] max-xs:pt-[8.5rem] pb-[3.2rem]">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-[0.6rem] text-[1.3rem] text-[rgba(0,0,0,0.45)] no-underline hover:text-[#101010] transition-colors duration-150 [font-family:var(--font-inter)]"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Catálogo
        </Link>
      </div>

      {/* ── Main section: carousel + info ── */}
      <div className="px-[5rem] max-xs:px-[2rem] grid grid-cols-1 lg:grid-cols-2 gap-[5rem] lg:gap-[7rem]">

        {/* Carousel */}
        <ImageCarousel images={images} />

        {/* Info panel */}
        <div className="flex flex-col">

          {/* Category + stock */}
          <div className="flex items-center justify-between mb-[1.6rem]">
            <span className="inline-block px-[1.2rem] py-[0.4rem] rounded-full bg-[#f5f5f5] text-[1.15rem] font-semibold uppercase tracking-[0.08em] text-[rgba(0,0,0,0.5)] [font-family:var(--font-inter)]">
              {product.category}
            </span>
            <span className={`text-[1.2rem] font-semibold flex items-center gap-[0.4rem] [font-family:var(--font-inter)] ${product.inStock !== false ? 'text-emerald-600' : 'text-red-500'}`}>
              {product.inStock !== false
                ? <><Check size={13} strokeWidth={2.5} /> En stock</>
                : 'Sin stock'}
            </span>
          </div>

          {/* Name */}
          <h1 className="text-[3rem] font-bold text-[#101010] m-0 leading-tight tracking-tight [font-family:var(--font-inter)]">
            {product.name}
          </h1>

          {/* Rating */}
          {avgRating > 0 && (
            <a href="#reviews" className="inline-flex items-center gap-[0.8rem] mt-[1.2rem] no-underline group">
              <Stars rating={avgRating} size={15} />
              <span className="text-[1.3rem] font-medium text-[rgba(0,0,0,0.5)] group-hover:text-[#101010] transition-colors [font-family:var(--font-inter)]">
                {avgRating.toFixed(1)} · {localReviews.length} reseña{localReviews.length !== 1 ? 's' : ''}
              </span>
            </a>
          )}

          {/* Price */}
          <p className="text-[3.2rem] font-bold text-[#101010] mt-[2rem] mb-0 [font-family:var(--font-inter)]">
            {formatPrice(product.price)}
          </p>
          {product.brand && (
            <p className="text-[1.3rem] text-[rgba(0,0,0,0.4)] mt-[0.4rem] [font-family:var(--font-karla)]">
              Material: {product.brand}
            </p>
          )}

          <div className="my-[2.8rem] h-px bg-[#f0f0f0]" />

          {/* Description */}
          {product.description && (
            <div className="mb-[2.8rem]">
              <p className="text-[1.2rem] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.4)] mb-[1rem] [font-family:var(--font-inter)]">
                Descripción
              </p>
              <p className="text-[1.45rem] leading-[1.8] text-[rgba(0,0,0,0.65)] m-0 [font-family:var(--font-source-sans)]">
                {product.description}
              </p>
            </div>
          )}

          <div className="mb-[2.8rem] h-px bg-[#f0f0f0]" />

          {/* Quantity stepper */}
          {!isInCart && (
            <div className="mb-[2rem]">
              <p className="text-[1.2rem] font-semibold uppercase tracking-wider text-[rgba(0,0,0,0.4)] mb-[1rem] [font-family:var(--font-inter)]">
                Cantidad
              </p>
              <div className="flex items-center gap-[0] rounded-full border border-[#e0e0e0] w-fit">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="w-[4rem] h-[4rem] flex items-center justify-center text-[#101010] hover:bg-[#f5f5f5] disabled:opacity-30 rounded-l-full transition-colors"
                >
                  <Minus size={14} strokeWidth={2.5} />
                </button>
                <span className="w-[4rem] text-center text-[1.5rem] font-semibold text-[#101010] [font-family:var(--font-inter)]">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="w-[4rem] h-[4rem] flex items-center justify-center text-[#101010] hover:bg-[#f5f5f5] rounded-r-full transition-colors"
                >
                  <Plus size={14} strokeWidth={2.5} />
                </button>
              </div>
              {qty > 1 && (
                <p className="text-[1.2rem] text-[rgba(0,0,0,0.4)] mt-[0.6rem] [font-family:var(--font-inter)]">
                  Total: {formatPrice(product.price * qty)}
                </p>
              )}
            </div>
          )}

          {/* CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.inStock === false}
            className={`
              w-fit flex items-center justify-center gap-[0.9rem]
              px-[3.2rem] py-[1.5rem] rounded-[1rem] text-[1.5rem] font-semibold
              transition-all duration-200 active:scale-[0.99]
              [font-family:var(--font-inter)]
              ${isInCart
                ? 'bg-[#f5f5f5] text-[#101010] hover:bg-[#ebebeb]'
                : 'bg-[#101010] text-white hover:bg-[#222] shadow-[0_4px_20px_rgba(0,0,0,0.18)] disabled:opacity-40'
              }
            `}
          >
            {isInCart
              ? <><Check size={16} strokeWidth={2.5} /> En carrito · Quitar</>
              : <><ShoppingBag size={16} strokeWidth={2} /> Agregar al carrito</>
            }
          </button>

          {isInCart && cartItem && (
            <p className="text-center text-[1.2rem] text-[rgba(0,0,0,0.4)] mt-[0.8rem] [font-family:var(--font-inter)]">
              {cartItem.quantity} unidad{cartItem.quantity !== 1 ? 'es' : ''} en tu carrito
            </p>
          )}

        </div>
      </div>

      {/* ── Reviews ── */}
      <div className="px-[5rem] max-xs:px-[2rem] mt-[6rem] pb-[8rem]">
        <div className="max-w-[72rem] mx-auto" id="reviews">
          {/* Reviews header */}
          <div className="flex items-center justify-between mb-[3.2rem]">
            <div>
              <h2 className="text-[1.1rem] font-semibold uppercase tracking-[0.1em] text-[rgba(0,0,0,0.35)] mb-[1rem] [font-family:var(--font-inter)]">
                Reseñas
              </h2>
              {localReviews.length > 0 ? (
                <div className="flex items-center gap-[1.4rem]">
                  <span className="text-[4rem] font-bold text-[#101010] leading-none [font-family:var(--font-inter)]">
                    {avgRating.toFixed(1)}
                  </span>
                  <div>
                    <Stars rating={avgRating} size={18} />
                    <p className="text-[1.3rem] text-[rgba(0,0,0,0.4)] mt-[0.3rem] m-0 [font-family:var(--font-inter)]">
                      {localReviews.length} reseña{localReviews.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-[1.4rem] text-[rgba(0,0,0,0.4)] m-0 [font-family:var(--font-inter)]">
                  Aún no hay reseñas
                </p>
              )}
            </div>

            {!showReviewForm && (
              <button
                type="button"
                onClick={() => setShowReviewForm(true)}
                className="flex items-center gap-[0.7rem] px-[1.8rem] py-[1rem] rounded-full border border-[#e0e0e0] text-[1.3rem] font-medium text-[#101010] hover:border-[#101010] hover:bg-[#fafafa] transition-all duration-150 [font-family:var(--font-inter)]"
              >
                <Star size={13} strokeWidth={2} />
                Escribir reseña
              </button>
            )}
          </div>

          {/* Review form */}
          {showReviewForm && (
            <ReviewForm onClose={() => setShowReviewForm(false)} onSubmit={handleReviewSubmit} />
          )}

          {/* Review list */}
          {localReviews.length > 0 ? (
            <div>
              {localReviews.map((review, i) => (
                <ReviewCard key={i} review={review} />
              ))}
            </div>
          ) : (
            <div className="py-[4rem] text-center">
              <p className="text-[1.4rem] text-[rgba(0,0,0,0.4)] [font-family:var(--font-inter)]">
                Sé el primero en dejar una reseña
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
