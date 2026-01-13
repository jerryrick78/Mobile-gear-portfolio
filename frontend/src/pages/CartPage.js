import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { mockProducts } from '../data/mockProducts';
import { toast } from 'sonner';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, loadCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cartWithProducts, setCartWithProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0 && cart.items) {
      const enriched = cart.items.map(item => {
        const product = products.find(p => p.id === item.product_id);
        return { ...item, product };
      }).filter(item => item.product);
      setCartWithProducts(enriched);
    }
  }, [cart, products]);

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

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success('Cart cleared');
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };

  const calculateTotal = () => {
    return cartWithProducts.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0).toFixed(2);
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Please Login</h2>
            <p className="text-slate-600 mb-8">You need to login to view your cart</p>
            <Link to="/login">
              <Button size="lg" className="rounded-full bg-slate-900 hover:bg-indigo-600">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (cartWithProducts.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 py-16" data-testid="empty-cart">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
            <p className="text-slate-600 mb-8">Start adding some products to your cart!</p>
            <Link to="/products">
              <Button size="lg" className="rounded-full bg-slate-900 hover:bg-indigo-600" data-testid="continue-shopping-button">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-8" data-testid="cart-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Shopping Cart</h1>
            <p className="text-slate-600">{cartWithProducts.length} items in your cart</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartWithProducts.map((item) => (
                <motion.div
                  key={item.product_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-slate-200 p-6"
                  data-testid={`cart-item-${item.product_id}`}
                >
                  <div className="flex gap-6">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">{item.product.name}</h3>
                          <p className="text-sm text-slate-600">{item.product.category}</p>
                        </div>
                        <Button
                          onClick={() => handleRemove(item.product_id)}
                          variant="ghost"
                          size="icon"
                          className="rounded-full text-red-600 hover:bg-red-50"
                          data-testid={`remove-item-${item.product_id}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-slate-600">Qty:</span>
                          <span className="font-medium" data-testid={`item-quantity-${item.product_id}`}>{item.quantity}</span>
                        </div>
                        <span className="text-xl font-bold text-slate-900" data-testid={`item-total-${item.product_id}`}>
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <Button
                onClick={handleClearCart}
                variant="outline"
                className="w-full rounded-full border-red-200 text-red-600 hover:bg-red-50"
                data-testid="clear-cart-button"
              >
                Clear Cart
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold" data-testid="subtotal">${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-slate-900">Total</span>
                      <span className="text-2xl font-bold text-slate-900" data-testid="total">${calculateTotal()}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/checkout')}
                  size="lg"
                  className="w-full rounded-full bg-slate-900 hover:bg-indigo-600 h-14"
                  data-testid="checkout-button"
                >
                  Proceed to Checkout
                </Button>
                <Link to="/products">
                  <Button variant="ghost" className="w-full mt-3 rounded-full" data-testid="continue-shopping-link">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}