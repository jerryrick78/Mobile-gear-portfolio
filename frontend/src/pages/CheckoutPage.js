import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { mockProducts } from '../data/mockProducts';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [cartWithProducts, setCartWithProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadProducts();
  }, [user]);

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

  const calculateTotal = () => {
    return cartWithProducts.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cart.items,
        total: parseFloat(calculateTotal()),
        shipping_address: formData
      };

      await api.post('/orders', orderData);
      setOrderPlaced(true);
      toast.success('Order placed successfully!');
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-50 py-16" data-testid="order-success">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <CheckCircle className="w-20 h-20 mx-auto text-green-600 mb-6" />
            </motion.div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Order Placed Successfully!</h1>
            <p className="text-lg text-slate-600 mb-8">
              Thank you for your purchase. You will receive a confirmation email shortly.
            </p>
            <Button
              onClick={() => navigate('/')}
              size="lg"
              className="rounded-full bg-slate-900 hover:bg-indigo-600"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (cartWithProducts.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-8" data-testid="checkout-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Shipping Information</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="mt-2 h-12 rounded-lg"
                        data-testid="name-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="mt-2 h-12 rounded-lg"
                        data-testid="email-input"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="mt-2 h-12 rounded-lg"
                      data-testid="phone-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      className="mt-2 h-12 rounded-lg"
                      data-testid="address-input"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                        className="mt-2 h-12 rounded-lg"
                        data-testid="city-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        required
                        className="mt-2 h-12 rounded-lg"
                        data-testid="zipcode-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        required
                        className="mt-2 h-12 rounded-lg"
                        data-testid="country-input"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full rounded-full bg-slate-900 hover:bg-indigo-600 h-14"
                    data-testid="place-order-button"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </Button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-slate-200 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {cartWithProducts.map((item) => (
                    <div key={item.product_id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-slate-900 line-clamp-1">{item.product.name}</p>
                        <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-bold text-slate-900" data-testid="order-total">${calculateTotal()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}