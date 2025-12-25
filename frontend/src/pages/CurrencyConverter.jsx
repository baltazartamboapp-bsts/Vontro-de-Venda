import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeftRight, TrendingUp } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const CURRENCIES = [
  { code: 'MZN', name: 'Metical Moçambicano', flag: '🇲🇿' },
  { code: 'ZAR', name: 'Rand Sul-Africano', flag: '🇿🇦' },
  { code: 'USD', name: 'Dólar Americano', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'Libra Esterlina', flag: '🇬🇧' },
  { code: 'BRL', name: 'Real Brasileiro', flag: '🇧🇷' },
  { code: 'JPY', name: 'Iene Japonês', flag: '🇯🇵' },
  { code: 'CNY', name: 'Yuan Chinês', flag: '🇨🇳' },
  { code: 'INR', name: 'Rupia Indiana', flag: '🇮🇳' },
  { code: 'AUD', name: 'Dólar Australiano', flag: '🇦🇺' },
  { code: 'CAD', name: 'Dólar Canadense', flag: '🇨🇦' },
  { code: 'CHF', name: 'Franco Suíço', flag: '🇨🇭' },
  { code: 'SEK', name: 'Coroa Sueca', flag: '🇸🇪' },
  { code: 'NOK', name: 'Coroa Norueguesa', flag: '🇳🇴' },
  { code: 'DKK', name: 'Coroa Dinamarquesa', flag: '🇩🇰' },
  { code: 'MXN', name: 'Peso Mexicano', flag: '🇲🇽' },
  { code: 'ARS', name: 'Peso Argentino', flag: '🇦🇷' },
  { code: 'KRW', name: 'Won Sul-Coreano', flag: '🇰🇷' },
  { code: 'RUB', name: 'Rublo Russo', flag: '🇷🇺' }
];

const CurrencyConverter = ({ user }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('MZN');
  const [toCurrency, setToCurrency] = useState('USD');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Por favor, insira um valor válido');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/currency/convert`,
        {
          amount: parseFloat(amount),
          from_currency: fromCurrency,
          to_currency: toCurrency
        },
        { withCredentials: true }
      );
      setResult(response.data);
      toast.success('Conversão realizada!');
    } catch (error) {
      console.error('Failed to convert currency:', error);
      toast.error('Erro ao converter moeda. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setResult(null);
  };

  const getFromCurrency = () => CURRENCIES.find(c => c.code === fromCurrency);
  const getToCurrency = () => CURRENCIES.find(c => c.code === toCurrency);

  return (
    <Layout user={user}>
      <div className="space-y-6 fade-in max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-slate-900" data-testid="currency-title">Conversão de Moeda</h1>
          <p className="text-slate-600 mt-1">Converta entre mais de 30 moedas em tempo real</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50">
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <TrendingUp className="w-6 h-6" />
              Conversor de Moedas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* From Currency */}
              <div>
                <Label htmlFor="amount" className="text-base font-medium">Valor a Converter</Label>
                <div className="mt-2 space-y-3">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Digite o valor"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-2xl h-14 text-center font-bold"
                    data-testid="amount-input"
                  />
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className="h-14" data-testid="from-currency-select">
                      <SelectValue>
                        <span className="text-lg">
                          {getFromCurrency()?.flag} {getFromCurrency()?.code} - {getFromCurrency()?.name}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map(curr => (
                        <SelectItem key={curr.code} value={curr.code}>
                          <span className="flex items-center gap-2">
                            <span className="text-xl">{curr.flag}</span>
                            <span>{curr.code} - {curr.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  onClick={swapCurrencies}
                  variant="outline"
                  size="lg"
                  className="rounded-full w-14 h-14"
                  data-testid="swap-currencies-btn"
                >
                  <ArrowLeftRight className="w-6 h-6" />
                </Button>
              </div>

              {/* To Currency */}
              <div>
                <Label htmlFor="to-currency" className="text-base font-medium">Para</Label>
                <div className="mt-2">
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger className="h-14" data-testid="to-currency-select">
                      <SelectValue>
                        <span className="text-lg">
                          {getToCurrency()?.flag} {getToCurrency()?.code} - {getToCurrency()?.name}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map(curr => (
                        <SelectItem key={curr.code} value={curr.code}>
                          <span className="flex items-center gap-2">
                            <span className="text-xl">{curr.flag}</span>
                            <span>{curr.code} - {curr.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Convert Button */}
              <Button
                onClick={handleConvert}
                disabled={loading}
                className="w-full h-14 text-lg bg-emerald-600 hover:bg-emerald-700"
                data-testid="convert-btn"
              >
                {loading ? 'Convertendo...' : 'Converter Agora'}
              </Button>

              {/* Result */}
              {result && (
                <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-200" data-testid="conversion-result">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-3">
                      <p className="text-sm text-slate-600">
                        {result.amount} {result.from_currency}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-4xl font-bold text-emerald-600 mono">
                          {result.converted_amount.toFixed(2)}
                        </span>
                        <span className="text-2xl font-bold text-emerald-600">
                          {result.to_currency}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Taxa: 1 {result.from_currency} = {result.rate.toFixed(4)} {result.to_currency}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Conversions */}
        <Card>
          <CardHeader>
            <CardTitle>Conversões Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[10, 50, 100, 500, 1000, 5000].map(val => (
                <Button
                  key={val}
                  variant="outline"
                  onClick={() => setAmount(val.toString())}
                  className="h-12"
                >
                  {val}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CurrencyConverter;