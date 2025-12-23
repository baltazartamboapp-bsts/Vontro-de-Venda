import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Dashboard = ({ user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/reports/summary`, {
        withCredentials: true
      });
      setSummary(response.data);
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900" data-testid="dashboard-title">{t('dashboard')}</h1>
            <p className="text-slate-600 mt-1">{t('welcome')}, {user?.name?.split(' ')[0]}!</p>
          </div>
          <Button
            onClick={() => navigate('/scanner')}
            className="bg-emerald-600 hover:bg-emerald-700"
            data-testid="quick-scan-btn"
          >
            {t('scan_barcode')}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-hover" data-testid="stat-total-products">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{t('total_products')}</CardTitle>
              <Package className="w-5 h-5 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 mono">{summary?.products_count || 0}</div>
            </CardContent>
          </Card>

          <Card className="card-hover" data-testid="stat-stock-value">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{t('total_stock_value')}</CardTitle>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 mono">
                {(summary?.total_stock_value || 0).toFixed(2)} MZN
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover" data-testid="stat-potential-revenue">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{t('potential_revenue')}</CardTitle>
              <Activity className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 mono">
                {(summary?.total_potential_revenue || 0).toFixed(2)} MZN
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover" data-testid="stat-low-stock">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{t('low_stock_alert')}</CardTitle>
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600 mono">{summary?.low_stock_count || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Products */}
        {summary?.low_stock_products && summary.low_stock_products.length > 0 && (
          <Card data-testid="low-stock-section">
            <CardHeader>
              <CardTitle className="text-lg">{t('low_stock_alert')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summary.low_stock_products.map((product) => (
                  <div
                    key={product.product_id}
                    className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
                    data-testid={`low-stock-item-${product.product_id}`}
                  >
                    <div>
                      <p className="font-medium text-slate-900">{product.name}</p>
                      <p className="text-sm text-slate-600">{product.barcode}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">{t('current_stock')}</p>
                      <p className="text-lg font-bold text-amber-600 mono">{product.current_stock}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-hover cursor-pointer" onClick={() => navigate('/products')} data-testid="quick-action-products">
            <CardContent className="pt-6">
              <Package className="w-10 h-10 text-emerald-600 mb-3" />
              <h3 className="font-bold text-slate-900">{t('products')}</h3>
              <p className="text-sm text-slate-600 mt-1">Gerir produtos e preços</p>
            </CardContent>
          </Card>

          <Card className="card-hover cursor-pointer" onClick={() => navigate('/history')} data-testid="quick-action-history">
            <CardContent className="pt-6">
              <Activity className="w-10 h-10 text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900">{t('history')}</h3>
              <p className="text-sm text-slate-600 mt-1">Ver movimentos de stock</p>
            </CardContent>
          </Card>

          <Card className="card-hover cursor-pointer" onClick={() => navigate('/reports')} data-testid="quick-action-reports">
            <CardContent className="pt-6">
              <TrendingUp className="w-10 h-10 text-purple-600 mb-3" />
              <h3 className="font-bold text-slate-900">{t('reports')}</h3>
              <p className="text-sm text-slate-600 mt-1">Análise e relatórios</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;