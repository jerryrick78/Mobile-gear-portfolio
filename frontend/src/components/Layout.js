import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

export const Header = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200"
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">MobileGear</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium" data-testid="products-nav-link">
              Products
            </Link>
            <Link to="/categories" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium" data-testid="categories-nav-link">
              Categories
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative" data-testid="cart-link">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center" data-testid="cart-count">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/admin" data-testid="admin-link">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    Admin
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="ghost" size="icon" className="rounded-full hover:bg-slate-100" data-testid="logout-button">
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <Link to="/login" data-testid="login-link">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-20" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <h3 className="text-lg font-bold text-slate-900 mb-4">MobileGear</h3>
            <p className="text-slate-600 text-sm">Premium mobile accessories for your digital lifestyle.</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/products?category=Cases & Covers" className="hover:text-indigo-600 transition-colors">Cases & Covers</Link></li>
              <li><Link to="/products?category=Chargers & Cables" className="hover:text-indigo-600 transition-colors">Chargers</Link></li>
              <li><Link to="/products?category=Headphones & Earbuds" className="hover:text-indigo-600 transition-colors">Audio</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Returns</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-200 text-center text-sm text-slate-600">
          <p>© 2025 MobileGear. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};