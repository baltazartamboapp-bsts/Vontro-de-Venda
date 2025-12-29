import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, CameraOff, Package, Plus, ArrowRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Scanner = ({ user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [scannedCode, setScannedCode] = useState('');
  const [product, setProduct] = useState(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    purchase_price: '',
    sale_price: '',
    currency: 'MZN'
  });
  const [quantity, setQuantity] = useState('1');
  const fileInputRef = useRef(null);

  const handleScan = async (barcode) => {
    setScannedCode(barcode);

    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/products/barcode/${barcode}`,
        { withCredentials: true }
      );

      if (response.data.found) {
        setProduct(response.data.product);
        setShowProductDialog(true);
      } else {
        setFormData({ ...formData, barcode });
        setShowCreateDialog(true);
      }
    } catch (error) {
      console.error('Failed to check product:', error);
      toast.error(t('error'));
    }
  };

  const handleManualInput = async () => {
    if (!scannedCode) {
      toast.error('Digite um código');
      return;
    }
    handleScan(scannedCode);
  };

  const handleAddMovement = async (type) => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/movements`,
        {
          product_id: product.product_id,
          type,
          quantity: parseInt(quantity)
        },
        { withCredentials: true }
      );

      toast.success(t('movement_created'));
      setShowProductDialog(false);
      setProduct(null);
      setQuantity('1');
    } catch (error) {
      console.error('Failed to add movement:', error);
      toast.error(error.response?.data?.detail || t('error'));
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${BACKEND_URL}/api/products`,
        formData,
        { withCredentials: true }
      );

      toast.success(t('product_created'));
      setShowCreateDialog(false);
      setFormData({
        name: '',
        barcode: '',
        purchase_price: '',
        sale_price: '',
        currency: 'MZN'
      });
    } catch (error) {
      console.error('Failed to create product:', error);
      toast.error(error.response?.data?.detail || t('error'));
    }
  };

  // Função para abrir câmera nativa
  const openNativeCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Processar imagem capturada
  const handleImageCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    toast.info('Processando imagem...');
    
    // Aqui você usaria uma API de leitura de código de barras
    // Por enquanto, vou simular pedindo ao usuário para digitar
    toast.info('Por favor, digite o código manualmente abaixo');
  };

  return (
    <Layout user={user}>
      <div className="space-y-6 fade-in">
        <div>
          <h1 className="text-3xl font-bold text-slate-900" data-testid="scanner-title">Scanner</h1>
          <p className="text-slate-600 mt-1">Escanear código de barras</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Botão para abrir câmera */}
              <div className="text-center py-8">
                <Camera className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageCapture}
                  className="hidden"
                />
                <Button
                  onClick={openNativeCamera}
                  className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
                  data-testid="start-scan-btn"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Abrir Câmera para Escanear
                </Button>
                <p className="text-xs text-slate-500 mt-2">
                  Tire uma foto do código de barras
                </p>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <Label htmlFor="manual-code" className="text-base font-semibold">Digite o Código Manualmente</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="manual-code"
                    placeholder="Digite o código de barras"
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    className="h-12 text-lg"
                    data-testid="manual-barcode-input"
                  />
                  <Button 
                    onClick={handleManualInput}
                    className="bg-emerald-600 hover:bg-emerald-700 h-12 px-6"
                    data-testid="manual-search-btn"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  ✅ Forma mais confiável: digite o código que vê no produto
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-bold text-blue-900 mb-2">📱 Como Usar no Telemóvel:</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Clique em "Abrir Câmera para Escanear"</li>
              <li>Tire uma foto do código de barras</li>
              <li>OU digite o código manualmente (mais rápido!)</li>
              <li>O sistema irá buscar o produto automaticamente</li>
            </ol>
          </CardContent>
        </Card>

        {/* Product Found Dialog */}
        <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
          <DialogContent data-testid="product-found-dialog">
            <DialogHeader>
              <DialogTitle>Produto Encontrado</DialogTitle>
            </DialogHeader>
            {product && (
              <div className="space-y-4">
                {product.image && (
                  <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded" />
                )}
                <div>
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-sm text-slate-600 mono">{product.barcode}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Stock:</span>
                    <span className="font-bold mono">{product.current_stock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Preço:</span>
                    <span className="mono">{product.sale_price} {product.currency}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-2 h-12 text-lg"
                    data-testid="movement-quantity-input"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddMovement('entrada')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-12"
                    data-testid="add-entry-btn"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Entrada
                  </Button>
                  <Button
                    onClick={() => handleAddMovement('saida')}
                    className="flex-1 bg-red-600 hover:bg-red-700 h-12"
                    data-testid="add-exit-btn"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Saída
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Product Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent data-testid="create-product-dialog" className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Produto</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <Label htmlFor="new-name">Nome do Produto</Label>
                <Input
                  id="new-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12"
                  data-testid="new-product-name-input"
                />
              </div>
              <div>
                <Label htmlFor="new-barcode">Código de Barras</Label>
                <Input
                  id="new-barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  required
                  className="h-12"
                  data-testid="new-product-barcode-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="new-purchase">Preço Compra</Label>
                  <Input
                    id="new-purchase"
                    type="number"
                    step="0.01"
                    value={formData.purchase_price}
                    onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                    required
                    className="h-12"
                    data-testid="new-product-purchase-input"
                  />
                </div>
                <div>
                  <Label htmlFor="new-sale">Preço Venda</Label>
                  <Input
                    id="new-sale"
                    type="number"
                    step="0.01"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                    required
                    className="h-12"
                    data-testid="new-product-sale-input"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1 h-12">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 h-12" data-testid="create-product-btn">
                  Criar Produto
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Scanner;
