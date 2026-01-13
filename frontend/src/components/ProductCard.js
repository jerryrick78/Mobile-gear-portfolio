import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

export const ProductCard = ({ product, onAddToCart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group"
      data-testid={`product-card-${product.id}`}
    >
      <Link to={`/products/${product.id}`}>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="relative aspect-square overflow-hidden bg-slate-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.stock < 20 && (
              <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                Low Stock
              </span>
            )}
          </div>
          <div className="p-6">
            <p className="text-xs font-medium text-indigo-600 mb-2">{product.category}</p>
            <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{product.name}</h3>
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm text-slate-600 ml-1">{product.rating}</span>
              </div>
              <span className="text-xs text-slate-400 ml-2">({product.reviews} reviews)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">${product.price}</span>
            </div>
          </div>
        </div>
      </Link>
      {onAddToCart && (
        <Button
          onClick={(e) => {
            e.preventDefault();
            onAddToCart(product.id);
          }}
          className="w-full mt-3 rounded-full bg-slate-900 hover:bg-indigo-600 transition-colors"
          data-testid={`add-to-cart-${product.id}`}
        >
          Add to Cart
        </Button>
      )}
    </motion.div>
  );
};

export const CategoryCard = ({ category, image, count }) => {
  return (
    <Link to={`/products?category=${encodeURIComponent(category)}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative h-64 rounded-xl overflow-hidden group cursor-pointer"
        data-testid={`category-card-${category}`}
      >
        <img
          src={image}
          alt={category}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-bold text-white mb-1">{category}</h3>
          <p className="text-sm text-white/80">{count} products</p>
        </div>
      </motion.div>
    </Link>
  );
};