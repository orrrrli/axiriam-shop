import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductSection from '@/components/ProductSection';
import AboutSection from '@/components/AboutSection';
import LocationsSection from '@/components/LocationsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <div id="hero"><Hero /></div>
      <div id="menu"><ProductSection /></div>
      <div id="story"><AboutSection /></div>
      <div id="locations"><LocationsSection /></div>
      <div id="contact"><ContactSection /></div>
      <Footer />
    </div>
  );
}
