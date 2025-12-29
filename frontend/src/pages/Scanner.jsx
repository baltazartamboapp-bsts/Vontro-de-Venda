import React, { useState, useEffect } from 'react';
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
import { Camera, CameraOff, ArrowRight, Plus } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Scanner = ({ user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
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
  const [html5QrCode, setHtml5QrCode] = useState(null);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      const scanner = new Html5Qrcode("reader");
      setHtml5QrCode(scanner);

      await scanner.start(
        { facingMode: "environment" }, // Câmera traseira
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText, decodedResult) => {
          // Sucesso ao ler código
          handleScan(decodedText);
          stopScanner();
        },
        (errorMessage) => {
          // Erro durante scan (ignorar, é normal)
        }
      );

      setIsScanning(true);
      toast.success('Câmera aberta! Aponte para o código de barras');
    } catch (err) {
      console.error('Erro ao iniciar scanner:', err);
      toast.error('Erro ao abrir câmera. Verifique as permissões.');
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCode) {
      try {
        if (html5QrCode.isScanning) {
          await html5QrCode.stop();
        }
        html5QrCode.clear();
      } catch (err) {
        console.error('Erro ao parar scanner:', err);
      }
    }
    setIsScanning(false);
  };

  const handleScan = async (barcode) => {
    setScannedCode(barcode);
    toast.success(`Código detectado: ${barcode}`);

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
      toast.error('Erro ao buscar produto');
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

      toast.success(type === 'entrada' ? 'Entrada registrada!' : 'Saída registrada!');
      setShowProductDialog(false);
      setProduct(null);
      setQuantity('1');
    } catch (error) {
      console.error('Failed to add movement:', error);
      toast.error(error.response?.data?.detail || 'Erro ao registrar movimento');
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

      toast.success('Produto criado com sucesso!');
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
      toast.error(error.response?.data?.detail || 'Erro ao criar produto');
    }
  };

  return (
    <Layout user={user}>
      <div className="space-y-6 fade-in">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Scanner</h1>
          <p className="text-slate-600 mt-1">Escanear código de barras com câmera</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {!isScanning ? (
              <div className="text-center py-8">
                <Camera className="w-20 h-20 text-emerald-600 mx-auto mb-4" />
                <Button
                  onClick={startScanner}
                  className="bg-emerald-600 hover:bg-emerald-700 h-14 text-lg px-8"
                  data-testid="start-scan-btn"
                >
                  <Camera className="w-6 h-6 mr-2" />
                  Abrir Câmera
                </Button>
                <p className="text-sm text-slate-500 mt-4">
                  Aponte a câmera para o código de barras
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div 
                  id="reader" 
                  className="w-full rounded-lg overflow-hidden border-4 border-emerald-500"
                  style={{ minHeight: '300px' }}
                />
                <Button
                  onClick={stopScanner}
                  variant="destructive"
                  className="w-full h-12"
                  data-testid="stop-scan-btn"
                >
                  <CameraOff className="w-5 h-5 mr-2" />
                  Parar Scanner
                </Button>
              </div>
            )}

            <div className="border-t border-slate-200 pt-4 mt-6">
              <Label htmlFor="manual-code" className="text-base font-semibold">
                Ou Digite o Código Manualmente
              </Label>
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
            </div>
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-bold text-blue-900 mb-3">📱 Como Usar:</h3>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>Clique em "Abrir Câmera"</li>
              <li>Permita o acesso à câmera quando solicitado</li>
              <li>Aponte para o código de barras</li>
              <li>O scanner detecta automaticamente!</li>
              <li>Ou digite o código manualmente se preferir</li>
            </ol>
          </CardContent>
        </Card>

        {/* Product Found Dialog */}
        <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>✅ Produto Encontrado</DialogTitle>
            </DialogHeader>
            {product && (
              <div className="space-y-4">
                {product.image && (
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
                )}
                <div>
                  <h3 className="font-bold text-xl">{product.name}</h3>
                  <p className="text-sm text-slate-600 mono mt-1">{product.barcode}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Stock Atual:</span>
                    <span className="font-bold text-lg">{product.current_stock}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Preço de Venda:</span>
                    <span className="font-bold">{product.sale_price} {product.currency}</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="quantity" className="text-base">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-2 h-12 text-lg text-center font-bold"
                    data-testid="movement-quantity-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button
                    onClick={() => handleAddMovement('entrada')}
                    className="h-14 bg-emerald-600 hover:bg-emerald-700"
                    data-testid="add-entry-btn"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Entrada
                  </Button>
                  <Button
                    onClick={() => handleAddMovement('saida')}
                    className="h-14 bg-red-600 hover:bg-red-700"
                    data-testid="add-exit-btn"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Saída
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Product Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>❌ Produto Não Encontrado - Criar Novo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                <strong>Código:</strong> {formData.barcode}
              </div>
              <div>
                <Label htmlFor="new-name">Nome do Produto *</Label>
                <Input
                  id="new-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12"
                  placeholder="Ex: Camisa Azul"
                  data-testid="new-product-name-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="new-purchase">Preço Compra *</Label>
                  <Input
                    id="new-purchase"
                    type="number"
                    step="0.01"
                    value={formData.purchase_price}
                    onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                    required
                    className="h-12"
                    placeholder="0.00"
                    data-testid="new-product-purchase-input"
                  />
                </div>
                <div>
                  <Label htmlFor="new-sale">Preço Venda *</Label>
                  <Input
                    id="new-sale"
                    type="number"
                    step="0.01"
                    value={formData.sale_price}
                    onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                    required
                    className="h-12"
                    placeholder="0.00"
                    data-testid="new-product-sale-input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateDialog(false)} 
                  className="h-12"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="h-12 bg-emerald-600 hover:bg-emerald-700" 
                  data-testid="create-product-btn"
                >
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
