import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History as HistoryIcon, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { format } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const History = ({ user }) => {
  const { t } = useTranslation();
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovements();
  }, []);

  const fetchMovements = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/movements`, {
        withCredentials: true
      });
      setMovements(response.data);
    } catch (error) {
      console.error('Failed to fetch movements:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout user={user}>
      <div className="space-y-6 fade-in">
        <div>
          <h1 className="text-3xl font-bold text-slate-900" data-testid="history-title">{t('history')}</h1>
          <p className="text-slate-600 mt-1">Movimentos de stock</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          </div>
        ) : movements.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <HistoryIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">{t('no_movements')}</p>
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
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <ArrowUpCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                          <ArrowDownCircle className="w-5 h-5 text-red-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant={movement.type === 'entrada' ? 'default' : 'destructive'}>
                            {t(movement.type)}
                          </Badge>
                          <span className="text-sm text-slate-500">
                            {format(new Date(movement.date), 'dd/MM/yyyy HH:mm')}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1 truncate">{movement.product_id}</p>
                        {movement.note && (
                          <p className="text-xs text-slate-500 mt-1">{movement.note}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold mono">{movement.quantity}</p>
                      <p className="text-xs text-slate-500">{t('quantity')}</p>
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