import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Slider } from '../components/ui/slider';
import { Search, SlidersHorizontal } from 'lucide-react';
import api from '../lib/api';
import { mockProducts } from '../data/mockProducts';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const categories = [
  'All',
  'Cases & Covers',
  'Chargers & Cables',
  'Screen Protectors',
  'Headphones & Earbuds',
  'Power Banks'
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [products, selectedCategory, searchQuery, priceRange]);

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      if (response.data.length > 0) {
        setProducts(response.data);
      } else {
        setProducts(mockProducts);
      }
    } catch (error) {
      setProducts(mockProducts);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    setFilteredProducts(filtered);
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
      <div className="bg-slate-50 min-h-screen py-8" data-testid="products-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">All Products</h1>
            <p className="text-lg text-slate-600">Discover our complete collection of mobile accessories</p>
          </div>

          {/* Search & Filters */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 rounded-lg bg-slate-50"
                    data-testid="search-input"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="lg:w-64">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={500}
                  step={10}
                  className="w-full"
                  data-testid="price-slider"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    className={`rounded-full ${selectedCategory === category ? 'bg-slate-900 hover:bg-indigo-600' : ''}`}
                    size="sm"
                    data-testid={`category-filter-${category}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="mb-4">
            <p className="text-slate-600" data-testid="product-count">
              Showing {filteredProducts.length} products
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-600 text-lg">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}