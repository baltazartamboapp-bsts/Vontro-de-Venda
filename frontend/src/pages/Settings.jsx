import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Globe, DollarSign, RefreshCw } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const CURRENCIES = [
  'MZN', 'ZAR', 'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR', 'AUD', 'CAD',
  'CHF', 'SEK', 'NOK', 'DKK', 'BRL', 'MXN', 'ARS', 'KRW', 'RUB'
];

const Settings = ({ user }) => {
  const { t, i18n } = useTranslation();
  const [baseCurrency, setBaseCurrency] = useState('MZN');
  const [conversionAmount, setConversionAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('MZN');
  const [toCurrency, setToCurrency] = useState('USD');
  const [conversionResult, setConversionResult] = useState(null);
  const [converting, setConverting] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    toast.success(`Idioma alterado para ${lng === 'pt' ? 'Português' : 'English'}`);
  };

  const handleConvert = async () => {
    setConverting(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/currency/convert`,
        {
          amount: parseFloat(conversionAmount),
          from_currency: fromCurrency,
          to_currency: toCurrency
        },
        { withCredentials: true }
      );
      setConversionResult(response.data);
    } catch (error) {
      console.error('Failed to convert currency:', error);
      toast.error(t('error'));
    } finally {
      setConverting(false);
    }
  };

  return (
    <Layout user={user}>
      <div className="space-y-6 fade-in max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-slate-900" data-testid="settings-title">{t('settings')}</h1>
          <p className="text-slate-600 mt-1">Configurações da aplicação</p>
        </div>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {t('language')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Selecionar Idioma</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <Button
                    variant={i18n.language === 'pt' ? 'default' : 'outline'}
                    onClick={() => changeLanguage('pt')}
                    className="w-full"
                    data-testid="lang-pt-btn"
                  >
                    Português
                  </Button>
                  <Button
                    variant={i18n.language === 'en' ? 'default' : 'outline'}
                    onClick={() => changeLanguage('en')}
                    className="w-full"
                    data-testid="lang-en-btn"
                  >
                    English
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currency Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              {t('base_currency')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="base-currency">Moeda Padrão</Label>
                <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                  <SelectTrigger id="base-currency" data-testid="base-currency-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map(curr => (
                      <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => toast.success('Moeda base actualizada!')}
                className="bg-emerald-600 hover:bg-emerald-700"
                data-testid="save-currency-btn"
              >
                {t('save')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Currency Converter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              {t('convert_currency')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="amount">{t('amount')}</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={conversionAmount}
                    onChange={(e) => setConversionAmount(e.target.value)}
                    data-testid="conversion-amount-input"
                  />
                </div>
                <div>
                  <Label htmlFor="from-currency">{t('from')}</Label>
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger id="from-currency" data-testid="from-currency-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map(curr => (
                        <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="to-currency">{t('to')}</Label>
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger id="to-currency" data-testid="to-currency-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map(curr => (
                        <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleConvert}
                disabled={converting}
                className="w-full bg-blue-600 hover:bg-blue-700"
                data-testid="convert-btn"
              >
                {converting ? t('loading') : t('convert')}
              </Button>

              {conversionResult && (
                <Card className="bg-blue-50 border-blue-200" data-testid="conversion-result">
                  <CardContent className="pt-6 text-center">
                    <p className="text-sm text-slate-600 mb-2">
                      {conversionResult.amount} {conversionResult.from_currency}
                    </p>
                    <p className="text-3xl font-bold text-blue-600 mono mb-2">
                      {conversionResult.converted_amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-600">{conversionResult.to_currency}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      Taxa: {conversionResult.rate.toFixed(4)}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <img
                  src={user?.picture || 'https://via.placeholder.com/64'}
                  alt={user?.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="font-bold text-slate-900">{user?.name}</p>
                  <p className="text-sm text-slate-600">{user?.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;