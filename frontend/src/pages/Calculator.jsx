import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator as CalcIcon, TrendingUp, Percent, DollarSign } from 'lucide-react';

const Calculator = ({ user }) => {
  const { t } = useTranslation();
  const [purchasePrice, setPurchasePrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [desiredMargin, setDesiredMargin] = useState('');
  const [desiredMarkup, setDesiredMarkup] = useState('');

  const calculateProfit = () => {
    if (!purchasePrice || !salePrice) return 0;
    return (parseFloat(salePrice) - parseFloat(purchasePrice)).toFixed(2);
  };

  const calculateMargin = () => {
    if (!purchasePrice || !salePrice || parseFloat(salePrice) === 0) return 0;
    return (((parseFloat(salePrice) - parseFloat(purchasePrice)) / parseFloat(salePrice)) * 100).toFixed(2);
  };

  const calculateMarkup = () => {
    if (!purchasePrice || !salePrice || parseFloat(purchasePrice) === 0) return 0;
    return (((parseFloat(salePrice) - parseFloat(purchasePrice)) / parseFloat(purchasePrice)) * 100).toFixed(2);
  };

  const calculateSalePriceFromMargin = () => {
    if (!purchasePrice || !desiredMargin) return;
    const margin = parseFloat(desiredMargin) / 100;
    const calculatedPrice = parseFloat(purchasePrice) / (1 - margin);
    setSalePrice(calculatedPrice.toFixed(2));
  };

  const calculateSalePriceFromMarkup = () => {
    if (!purchasePrice || !desiredMarkup) return;
    const markup = parseFloat(desiredMarkup) / 100;
    const calculatedPrice = parseFloat(purchasePrice) * (1 + markup);
    setSalePrice(calculatedPrice.toFixed(2));
  };

  const clearAll = () => {
    setPurchasePrice('');
    setSalePrice('');
    setDesiredMargin('');
    setDesiredMarkup('');
  };

  return (
    <Layout user={user}>
      <div className="space-y-6 fade-in max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-slate-900" data-testid="calculator-title">Calculadora Comercial</h1>
          <p className="text-slate-600 mt-1">Calcule lucro, margem e markup automaticamente</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cálculo Básico */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50">
              <CardTitle className="flex items-center gap-2">
                <CalcIcon className="w-5 h-5 text-emerald-600" />
                Cálculo Básico
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="purchase">Preço de Compra (MZN)</Label>
                <Input
                  id="purchase"
                  type="number"
                  placeholder="0.00"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="text-lg h-12"
                  data-testid="purchase-price-input"
                />
              </div>

              <div>
                <Label htmlFor="sale">Preço de Venda (MZN)</Label>
                <Input
                  id="sale"
                  type="number"
                  placeholder="0.00"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  className="text-lg h-12"
                  data-testid="sale-price-input"
                />
              </div>

              <Button onClick={clearAll} variant="outline" className="w-full">
                Limpar Tudo
              </Button>

              {/* Results */}
              {purchasePrice && salePrice && (
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Lucro:</span>
                      <span className="text-2xl font-bold text-emerald-600 mono" data-testid="profit-result">
                        {calculateProfit()} MZN
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Margem:</span>
                      <span className="text-2xl font-bold text-blue-600 mono" data-testid="margin-result">
                        {calculateMargin()}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Markup:</span>
                      <span className="text-2xl font-bold text-purple-600 mono" data-testid="markup-result">
                        {calculateMarkup()}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cálculo por Margem/Markup */}
          <Card>
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
              <CardTitle className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-purple-600" />
                Calcular Preço de Venda
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-slate-700">
                <strong>Dica:</strong> Defina o preço de compra acima, depois escolha calcular por margem ou markup.
              </div>

              {/* Por Margem */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Calcular por Margem
                </h3>
                <div>
                  <Label htmlFor="margin">Margem Desejada (%)</Label>
                  <Input
                    id="margin"
                    type="number"
                    placeholder="Ex: 30"
                    value={desiredMargin}
                    onChange={(e) => setDesiredMargin(e.target.value)}
                    className="h-12"
                    data-testid="desired-margin-input"
                  />
                </div>
                <Button
                  onClick={calculateSalePriceFromMargin}
                  disabled={!purchasePrice || !desiredMargin}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  data-testid="calc-from-margin-btn"
                >
                  Calcular Preço de Venda
                </Button>
                <div className="text-xs text-slate-500">
                  <strong>Margem:</strong> Percentual do lucro sobre o preço de venda<br/>
                  Fórmula: Preço Venda = Preço Compra / (1 - Margem%)
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4"></div>

              {/* Por Markup */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                  Calcular por Markup
                </h3>
                <div>
                  <Label htmlFor="markup">Markup Desejado (%)</Label>
                  <Input
                    id="markup"
                    type="number"
                    placeholder="Ex: 50"
                    value={desiredMarkup}
                    onChange={(e) => setDesiredMarkup(e.target.value)}
                    className="h-12"
                    data-testid="desired-markup-input"
                  />
                </div>
                <Button
                  onClick={calculateSalePriceFromMarkup}
                  disabled={!purchasePrice || !desiredMarkup}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  data-testid="calc-from-markup-btn"
                >
                  Calcular Preço de Venda
                </Button>
                <div className="text-xs text-slate-500">
                  <strong>Markup:</strong> Percentual adicionado sobre o preço de compra<br/>
                  Fórmula: Preço Venda = Preço Compra × (1 + Markup%)
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guia Rápido */}
        <Card>
          <CardHeader>
            <CardTitle>Guia Rápido: Diferença entre Margem e Markup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">📊 Margem de Lucro</h3>
                <p className="text-sm text-slate-700 mb-2">
                  Percentual do lucro em relação ao <strong>preço de venda</strong>.
                </p>
                <div className="bg-white rounded p-3 text-sm font-mono">
                  Margem = (Venda - Compra) / Venda × 100
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Exemplo: Compra 100, Venda 150<br/>
                  Margem = (150-100)/150 = <strong>33.33%</strong>
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-bold text-purple-900 mb-2">💰 Markup</h3>
                <p className="text-sm text-slate-700 mb-2">
                  Percentual adicionado sobre o <strong>preço de compra</strong>.
                </p>
                <div className="bg-white rounded p-3 text-sm font-mono">
                  Markup = (Venda - Compra) / Compra × 100
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Exemplo: Compra 100, Venda 150<br/>
                  Markup = (150-100)/100 = <strong>50%</strong>
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-slate-700">
                <strong>⚠️ Importante:</strong> Margem é sempre menor que Markup para o mesmo lucro. 
                Use margem para entender quanto do preço de venda é lucro. Use markup para definir quanto adicionar ao custo.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Calculator;
