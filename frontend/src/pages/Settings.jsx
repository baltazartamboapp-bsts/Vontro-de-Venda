import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Globe, User, Info, Smartphone } from 'lucide-react';

const Settings = ({ user }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    toast.success(`Idioma alterado para ${lng === 'pt' ? 'Português' : 'English'}`);
  };

  return (
    <Layout user={user}>
      <div className="space-y-6 fade-in max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-slate-900" data-testid="settings-title">Configurações</h1>
          <p className="text-slate-600 mt-1">Definições da aplicação</p>
        </div>

        {/* User Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={user?.picture || 'https://via.placeholder.com/80'}
                  alt={user?.name}
                  className="w-20 h-20 rounded-full border-2 border-slate-200"
                />
                <div className="flex-1">
                  <p className="text-lg font-bold text-slate-900">{user?.name}</p>
                  <p className="text-sm text-slate-600">{user?.email}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Conta criada: {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-MZ') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Software Information */}
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Informações do Software
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-slate-600">Nome da Aplicação:</span>
                <span className="font-bold text-slate-900">Controle de Venda</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-slate-600">Versão:</span>
                <span className="font-mono font-medium text-slate-900">1.0.0</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-slate-600">Desenvolvedor:</span>
                <span className="font-medium text-slate-900">Baltazar Tambo</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-slate-600">Contacto:</span>
                <span className="font-mono font-medium text-slate-900">845234933</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-200">
                <span className="text-slate-600">Email:</span>
                <span className="font-mono text-xs text-slate-900">baltazartambo026@gmail.com</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600">Última Atualização:</span>
                <span className="font-medium text-slate-900">Dezembro 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Links Rápidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-14 justify-start"
                onClick={() => window.location.href = '/currency'}
              >
                💱 Conversão de Moeda
              </Button>
              <Button 
                variant="outline" 
                className="h-14 justify-start"
                onClick={() => window.location.href = '/support'}
              >
                📞 Suporte
              </Button>
              <Button 
                variant="outline" 
                className="h-14 justify-start"
                onClick={() => window.location.href = '/reports'}
              >
                📊 Relatórios
              </Button>
              <Button 
                variant="outline" 
                className="h-14 justify-start"
                onClick={() => window.location.href = '/scanner'}
              >
                📷 Scanner
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Features */}
        <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 border-emerald-200">
          <CardHeader>
            <CardTitle>Recursos da Aplicação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-white rounded-lg">
                <span className="text-2xl">📦</span>
                <p className="mt-1 font-medium">Gestão de Stock</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <span className="text-2xl">📊</span>
                <p className="mt-1 font-medium">Relatórios</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <span className="text-2xl">💱</span>
                <p className="mt-1 font-medium">Conversão de Moeda</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <span className="text-2xl">📷</span>
                <p className="mt-1 font-medium">Scanner QR/Barcode</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <span className="text-2xl">💰</span>
                <p className="mt-1 font-medium">Cálculo Automático</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <span className="text-2xl">🌍</span>
                <p className="mt-1 font-medium">Multi-Idioma</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
