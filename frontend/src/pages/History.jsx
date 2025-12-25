import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { History as HistoryIcon, ArrowUpCircle, ArrowDownCircle, Plus, Package } from 'lucide-react';
import { format } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const History = ({ user }) => {
  const { t } = useTranslation();
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    type: 'entrada',
    quantity: '1',
    color: '',
    note: ''
  });
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [movementsRes, productsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/movements`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/products`, { withCredentials: true })
      ]);
      setMovements(movementsRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(
        `${BACKEND_URL}/api/movements`,
        {
          product_id: formData.product_id,
          type: formData.type,
          quantity: parseInt(formData.quantity),
          note: formData.note
        },
        { withCredentials: true }
      );

      toast.success(
        formData.type === 'entrada' 
          ? 'Entrada registrada com sucesso!' 
          : 'Saída registrada com sucesso!'
      );
      setIsDialogOpen(false);
      setFormData({
        product_id: '',
        type: 'entrada',
        quantity: '1',
        note: ''
      });
      fetchData();
    } catch (error) {
      console.error('Failed to add movement:', error);
      toast.error(error.response?.data?.detail || 'Erro ao adicionar movimento');
    }
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.product_id === productId);
    return product ? product.name : productId;
  };

  return (
    <Layout user={user}>
      <div className="space-y-6 fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900" data-testid="history-title">Histórico de Movimentos</h1>
            <p className="text-slate-600 mt-1">Entradas e saídas de stock</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700" data-testid="add-movement-btn">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Movimento
              </Button>
            </DialogTrigger>
            <DialogContent data-testid="movement-dialog">
              <DialogHeader>
                <DialogTitle>Registrar Movimento de Stock</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="product">Produto *</Label>
                  <Select 
                    value={formData.product_id} 
                    onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                    required
                  >
                    <SelectTrigger data-testid="movement-product-select">
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.product_id} value={product.product_id}>
                          {product.name} (Stock: {product.current_stock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="type">Tipo de Movimento *</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger data-testid="movement-type-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">
                        <span className="flex items-center gap-2">
                          <ArrowUpCircle className="w-4 h-4 text-emerald-600" />
                          Entrada (Adicionar Stock)
                        </span>
                      </SelectItem>
                      <SelectItem value="saida">
                        <span className="flex items-center gap-2">
                          <ArrowDownCircle className="w-4 h-4 text-red-600" />
                          Saída (Remover Stock)
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantity">Quantidade *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    data-testid="movement-quantity-input"
                  />
                </div>

                <div>
                  <Label htmlFor="note">Nota (Opcional)</Label>
                  <Textarea
                    id="note"
                    rows={3}
                    placeholder="Ex: Venda para cliente X, Reposição de fornecedor..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    data-testid="movement-note-input"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)} 
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    data-testid="save-movement-btn"
                  >
                    Registrar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                  <ArrowUpCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Entradas</p>
                  <p className="text-2xl font-bold text-emerald-600 mono">
                    {movements.filter(m => m.type === 'entrada').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <ArrowDownCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Saídas</p>
                  <p className="text-2xl font-bold text-red-600 mono">
                    {movements.filter(m => m.type === 'saida').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Produtos</p>
                  <p className="text-2xl font-bold text-blue-600 mono">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          </div>
        ) : movements.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <HistoryIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">Nenhum movimento registrado</p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Movimento
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {movements.map((movement) => (
              <Card key={movement.movement_id} className="card-hover" data-testid={`movement-${movement.movement_id}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {movement.type === 'entrada' ? (
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                          <ArrowUpCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                          <ArrowDownCircle className="w-6 h-6 text-red-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge 
                            variant={movement.type === 'entrada' ? 'default' : 'destructive'}
                            className={movement.type === 'entrada' ? 'bg-emerald-600' : ''}
                          >
                            {movement.type === 'entrada' ? 'ENTRADA' : 'SAÍDA'}
                          </Badge>
                          <span className="text-sm text-slate-500">
                            {format(new Date(movement.date), 'dd/MM/yyyy HH:mm')}
                          </span>
                        </div>
                        <p className="font-bold text-slate-900 mt-1">{getProductName(movement.product_id)}</p>
                        {movement.note && (
                          <p className="text-xs text-slate-500 mt-1 italic">"{movement.note}"</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-2xl font-bold mono text-slate-900">{movement.quantity}</p>
                      <p className="text-xs text-slate-500">unidades</p>
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

export default History;