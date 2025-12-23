import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const CURRENCIES = ['MZN', 'ZAR', 'USD', 'EUR', 'GBP'];

const Products = ({ user }) => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    purchase_price: '',
    sale_price: '',
    currency: 'MZN'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/products`, {
        withCredentials: true
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        await axios.put(
          `${BACKEND_URL}/api/products/${editingProduct.product_id}`,
          formData,
          { withCredentials: true }
        );
        toast.success(t('product_updated'));
      } else {
        await axios.post(
          `${BACKEND_URL}/api/products`,
          formData,
          { withCredentials: true }
        );
        toast.success(t('product_created'));
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error(error.response?.data?.detail || t('error'));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      barcode: product.barcode,
      purchase_price: product.purchase_price.toString(),
      sale_price: product.sale_price.toString(),
      currency: product.currency
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Tem certeza que deseja eliminar este produto?')) return;
    
    try {
      await axios.delete(`${BACKEND_URL}/api/products/${productId}`, {
        withCredentials: true
      });
      toast.success(t('product_deleted'));
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error(t('error'));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      barcode: '',
      purchase_price: '',
      sale_price: '',
      currency: 'MZN'
    });
    setEditingProduct(null);
  };

  const calculateProfit = (salePrice, purchasePrice) => {
    return (salePrice - purchasePrice).toFixed(2);
  };

  const calculateMargin = (salePrice, purchasePrice) => {
    if (salePrice === 0) return 0;
    return (((salePrice - purchasePrice) / salePrice) * 100).toFixed(1);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  );

  return (
    <Layout user={user}>
      <div className="space-y-6 fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900" data-testid="products-title">{t('products')}</h1>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700" data-testid="add-product-btn">
                <Plus className="w-4 h-4 mr-2" />
                {t('add_product')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md" data-testid="product-dialog" aria-describedby="product-dialog-description">
              <DialogHeader>
                <DialogTitle>{editingProduct ? t('edit_product') : t('add_product')}</DialogTitle>
                <p id="product-dialog-description" className="sr-only">
                  {editingProduct ? 'Edit product details' : 'Add a new product to inventory'}
                </p>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('product_name')}</Label>
                  <Input
                    id="name"
                    data-testid="product-name-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="barcode">{t('barcode')}</Label>
                  <Input
                    id="barcode"
                    data-testid="product-barcode-input"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="purchase_price">{t('purchase_price')}</Label>
                  <Input
                    id="purchase_price"
                    type="number"
                    step="0.01"
                    data-testid="product-purchase-price-input"
                    value={formData.purchase_price}
                    onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sale_price">{t('sale_price')}</Label>
                  <Input
                    id="sale_price"
                    type="number"
                    step="0.01"
                    data-testid="product-sale-price-input"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currency">{t('currency')}</Label>
                  <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                    <SelectTrigger data-testid="product-currency-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map(curr => (
                        <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                    {t('cancel')}
                  </Button>
                  <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700" data-testid="product-save-btn">
                    {t('save')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder={t('search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="search-products-input"
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">{t('no_products')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.product_id} className="card-hover" data-testid={`product-card-${product.product_id}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-slate-500 mono">{product.barcode}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(product)}
                        data-testid={`edit-product-${product.product_id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(product.product_id)}
                        data-testid={`delete-product-${product.product_id}`}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">{t('current_stock')}:</span>
                      <span className="font-bold mono">{product.current_stock}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">{t('purchase_price')}:</span>
                      <span className="mono">{product.purchase_price} {product.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">{t('sale_price')}:</span>
                      <span className="mono">{product.sale_price} {product.currency}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200">
                      <span className="text-slate-600">{t('profit')}:</span>
                      <span className="font-bold text-emerald-600 mono">
                        {calculateProfit(product.sale_price, product.purchase_price)} {product.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">{t('margin')}:</span>
                      <span className="font-bold text-blue-600 mono">
                        {calculateMargin(product.sale_price, product.purchase_price)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Products;