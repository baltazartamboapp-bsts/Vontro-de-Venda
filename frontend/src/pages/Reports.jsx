import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Package, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

const Reports = ({ user }) => {
  const { t } = useTranslation();
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, productsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/reports/summary`, { withCredentials: true }),
        axios.get(`${BACKEND_URL}/api/products`, { withCredentials: true })
      ]);
      setSummary(summaryRes.data);
      setProducts(productsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const topProducts = products
    .slice(0, 5)
    .map(p => ({
      name: p.name,
      value: p.current_stock * p.sale_price,
      stock: p.current_stock
    }));

  const profitData = products
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      lucro: (p.sale_price - p.purchase_price).toFixed(2),
      margem: (((p.sale_price - p.purchase_price) / p.sale_price) * 100).toFixed(1)
    }));

  if (loading) {
    return (
      <Layout user={user}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div className="space-y-6 fade-in">
        <div>
          <h1 className="text-3xl font-bold text-slate-900" data-testid="reports-title">{t('reports')}</h1>
          <p className="text-slate-600 mt-1">Análise e estatísticas</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{t('total_products')}</CardTitle>
              <Package className="w-5 h-5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 mono">{summary?.products_count || 0}</div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Entradas</CardTitle>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600 mono">{summary?.total_entries || 0}</div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Saídas</CardTitle>
              <BarChart3 className="w-5 h-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 mono">{summary?.total_exits || 0}</div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{t('potential_revenue')}</CardTitle>
              <DollarSign className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mono">
                {(summary?.total_potential_revenue || 0).toFixed(0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Lucro por Produto (Top 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="lucro" fill="#10B981" name="Lucro (MZN)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Valor em Stock (Top 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={topProducts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Product Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Performance dos Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">Produto</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-600">Stock</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-600">Preço Compra</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-600">Preço Venda</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-600">Lucro Unitário</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-600">Margem %</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 10).map((product) => (
                    <tr key={product.product_id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="text-right py-3 px-4 mono">{product.current_stock}</td>
                      <td className="text-right py-3 px-4 mono">{product.purchase_price.toFixed(2)}</td>
                      <td className="text-right py-3 px-4 mono">{product.sale_price.toFixed(2)}</td>
                      <td className="text-right py-3 px-4 mono text-emerald-600 font-medium">
                        {(product.sale_price - product.purchase_price).toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-4 mono text-blue-600 font-medium">
                        {(((product.sale_price - product.purchase_price) / product.sale_price) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;