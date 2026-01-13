import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Cases & Covers',
    image: '',
    stock: '100'
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadProducts();
  }, [user]);

  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to load products');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Cases & Covers',
      image: '',
      stock: '100'
    });
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      stock: product.stock.toString()
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, data);
        toast.success('Product updated successfully');
      } else {
        await api.post('/admin/products', data);
        toast.success('Product created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      loadProducts();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await api.delete(`/admin/products/${productId}`);
      toast.success('Product deleted successfully');
      loadProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-8" data-testid="admin-page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
              <p className="text-slate-600">Manage your product catalog</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="rounded-full bg-slate-900 hover:bg-indigo-600" data-testid="add-product-button">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="mt-2"
                      data-testid="product-name-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      className="mt-2"
                      data-testid="product-description-input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                        className="mt-2"
                        data-testid="product-price-input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                        className="mt-2"
                        data-testid="product-stock-input"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full mt-2 h-10 px-3 rounded-lg border border-slate-200 bg-white"
                      data-testid="product-category-select"
                    >
                      <option>Cases & Covers</option>
                      <option>Chargers & Cables</option>
                      <option>Screen Protectors</option>
                      <option>Headphones & Earbuds</option>
                      <option>Power Banks</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      required
                      placeholder="https://example.com/image.jpg"
                      className="mt-2"
                      data-testid="product-image-input"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1 rounded-full bg-slate-900 hover:bg-indigo-600" data-testid="save-product-button">
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        resetForm();
                      }}
                      className="flex-1 rounded-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left p-4 font-semibold text-slate-900">Image</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Name</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Category</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Price</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Stock</th>
                    <th className="text-left p-4 font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-slate-100 hover:bg-slate-50"
                      data-testid={`product-row-${product.id}`}
                    >
                      <td className="p-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-slate-900">{product.name}</p>
                        <p className="text-sm text-slate-600 line-clamp-1">{product.description}</p>
                      </td>
                      <td className="p-4 text-slate-700">{product.category}</td>
                      <td className="p-4 font-semibold text-slate-900">${product.price}</td>
                      <td className="p-4 text-slate-700">{product.stock}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEdit(product)}
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-indigo-50"
                            data-testid={`edit-product-${product.id}`}
                          >
                            <Pencil className="w-4 h-4 text-indigo-600" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(product.id)}
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-red-50"
                            data-testid={`delete-product-${product.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}