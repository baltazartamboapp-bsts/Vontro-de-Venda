import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, CameraOff, Package, Plus, ArrowRight } from 'lucide-react';
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
  const [movementType, setMovementType] = useState('entrada');
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          handleScan(decodedText);
        },
        (errorMessage) => {
          // Ignore scan errors
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.error('Failed to start scanner:', err);
      toast.error('Falha ao iniciar câmera');
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.error('Failed to stop scanner:', err);
      }
    }
    setIsScanning(false);
  };

  const handleScan = async (barcode) => {
    setScannedCode(barcode);
    await stopScanner();

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
    if (!scannedCode) return;
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

  return (
    <Layout user={user}>
      <div className="space-y-6 fade-in">
        <div>
          <h1 className="text-3xl font-bold text-slate-900" data-testid="scanner-title">{t('scanner')}</h1>
          <p className="text-slate-600 mt-1">{t('scan_barcode')}</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {!isScanning ? (
                <div className="text-center py-8">
                  <Camera className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <Button
                    onClick={startScanner}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    data-testid="start-scan-btn"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Iniciar Scanner
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div id="qr-reader" className="w-full" data-testid="qr-reader"></div>
                  <Button
                    onClick={stopScanner}
                    variant="outline"
                    className="w-full"
                    data-testid="stop-scan-btn"
                  >
                    <CameraOff className="w-4 h-4 mr-2" />
                    Parar Scanner
                  </Button>
                </div>
              )}

              <div className="border-t border-slate-200 pt-4">
                <Label htmlFor="manual-code">Ou digite o código manualmente</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="manual-code"
                    placeholder="Digite o código de barras"
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    data-testid="manual-barcode-input"
                  />
                  <Button onClick={handleManualInput} data-testid="manual-search-btn">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Found Dialog */}
        <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
          <DialogContent data-testid="product-found-dialog">
            <DialogHeader>
              <DialogTitle>{t('product_details')}</DialogTitle>
            </DialogHeader>
            {product && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-sm text-slate-600 mono">{product.barcode}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('current_stock')}:</span>
                    <span className="font-bold mono">{product.current_stock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{t('sale_price')}:</span>
                    <span className="mono">{product.sale_price} {product.currency}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <Label htmlFor="quantity">{t('quantity')}</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-2"
                    data-testid="movement-quantity-input"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleAddMovement('entrada')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    data-testid="add-entry-btn"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('add_entry')}
                  </Button>
                  <Button
                    onClick={() => handleAddMovement('saida')}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    data-testid="add-exit-btn"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('add_exit')}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Product Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent data-testid="create-product-dialog">
            <DialogHeader>
              <DialogTitle>{t('create_new_product')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <Label htmlFor="new-name">{t('product_name')}</Label>
                <Input
                  id="new-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  data-testid="new-product-name-input"
                />
              </div>
              <div>
                <Label htmlFor="new-barcode">{t('barcode')}</Label>
                <Input
                  id="new-barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  required
                  data-testid="new-product-barcode-input"
                />
              </div>
              <div>
                <Label htmlFor="new-purchase">{t('purchase_price')}</Label>
                <Input
                  id="new-purchase"
                  type="number"
                  step="0.01"
                  value={formData.purchase_price}
                  onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                  required
                  data-testid="new-product-purchase-input"
                />
              </div>
              <div>
                <Label htmlFor="new-sale">{t('sale_price')}</Label>
                <Input
                  id="new-sale"
                  type="number"
                  step="0.01"
                  value={formData.sale_price}
                  onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                  required
                  data-testid="new-product-sale-input"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)} className="flex-1">
                  {t('cancel')}
                </Button>
                <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700" data-testid="create-product-btn">
                  {t('save')}
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