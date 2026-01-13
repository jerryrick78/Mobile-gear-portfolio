import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { CategoryCard, ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import api from '../lib/api';
import { mockProducts } from '../data/mockProducts';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const categories = [
  { name: 'Cases & Covers', image: 'https://images.unsplash.com/photo-1760443728294-81b19787ec4c?w=800&q=80', count: 120 },
  { name: 'Headphones & Earbuds', image: 'https://images.unsplash.com/photo-1637868796503-9191d8ae78be?w=800&q=80', count: 85 },
  { name: 'Power Banks', image: 'https://images.unsplash.com/photo-1760462788394-80bdaa1fa2bd?w=800&q=80', count: 64 },
  { name: 'Chargers & Cables', image: 'https://images.unsplash.com/photo-1591290619762-9663a28d7532?w=800&q=80', count: 95 },
  { name: 'Screen Protectors', image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80', count: 78 },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      if (response.data.length > 0) {
        setFeaturedProducts(response.data.slice(0, 8));
      } else {
        setFeaturedProducts(mockProducts.slice(0, 8));
      }
    } catch (error) {
      setFeaturedProducts(mockProducts.slice(0, 8));
    }
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-b from-slate-50 to-white" data-testid="home-page">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24" data-testid="hero-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-full mb-6">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-600">New Arrivals Available</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                  Premium Mobile
                  <span className="block text-indigo-600">Accessories</span>
                </h1>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Elevate your mobile experience with our curated collection of high-quality cases, chargers, and audio accessories.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/products">
                    <Button size="lg" className="rounded-full bg-slate-900 hover:bg-indigo-600 text-white px-8" data-testid="shop-now-button">
                      Shop Now
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/categories">
                    <Button size="lg" variant="outline" className="rounded-full border-2 border-slate-900 hover:bg-slate-900 hover:text-white">
                      Browse Categories
                    </Button>
                  </Link>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1764855310912-15dee3625bf2?w=800&q=80"
                    alt="Premium smartphone lifestyle"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-600 rounded-full opacity-20 blur-3xl" />
                <div className="absolute -top-6 -right-6 w-40 h-40 bg-purple-600 rounded-full opacity-20 blur-3xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-white" data-testid="categories-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Shop by Category</h2>
              <p className="text-lg text-slate-600">Find the perfect accessories for your device</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CategoryCard {...category} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16" data-testid="featured-products-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Featured Products</h2>
              <p className="text-lg text-slate-600">Handpicked essentials for your mobile lifestyle</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/products">
                <Button size="lg" variant="outline" className="rounded-full border-2" data-testid="view-all-products-button">
                  View All Products
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-8 rounded-xl border border-slate-200"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Premium Quality</h3>
                <p className="text-slate-600">All products undergo rigorous quality testing to ensure durability.</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-8 rounded-xl border border-slate-200"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Fast Shipping</h3>
                <p className="text-slate-600">Get your orders delivered quickly with our express shipping options.</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-8 rounded-xl border border-slate-200"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Secure Shopping</h3>
                <p className="text-slate-600">Shop with confidence using our secure payment gateway.</p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}