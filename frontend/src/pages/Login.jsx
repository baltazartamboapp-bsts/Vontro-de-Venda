import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Package, BarChart3, Scan, TrendingUp, Phone } from 'lucide-react';

const Login = () => {
  const { t } = useTranslation();

  const handleGoogleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Top Contact Bar - Mobile/Desktop */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-emerald-600" />
          <span className="font-bold text-slate-900">{t('app_name')}</span>
        </div>
        <a 
          href="tel:+258845234933" 
          className="flex items-center gap-2 text-slate-700 hover:text-emerald-600 transition-colors"
        >
          <Phone className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">845234933</span>
        </a>
      </div>

      {/* Left Side - Hero Image */}
      <div 
        className="hidden lg:block lg:w-1/2 bg-cover bg-center relative mt-16"
        style={{ backgroundImage: 'url(https://images.pexels.com/photos/4484072/pexels-photo-4484072.jpeg)' }}
      >
        <div className="absolute inset-0 bg-slate-900 bg-opacity-60 flex items-center justify-center">
          <div className="text-white text-center p-8">
            <h1 className="text-5xl font-bold mb-4">{t('app_name')}</h1>
            <p className="text-xl text-slate-200">Gestão profissional de stock e vendas</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 mt-16">
        <Card className="w-full max-w-md p-8 shadow-lg border-slate-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <Package className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('welcome')}</h2>
            <p className="text-slate-600">{t('app_name')}</p>
          </div>

          <div className="space-y-6">
            <Button 
              onClick={handleGoogleLogin}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 text-lg"
              data-testid="google-login-btn"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('login_with_google')}
            </Button>

            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <Scan className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-600">Scanner de Códigos</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-600">Relatórios Completos</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-600">Análise de Lucro</p>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <Package className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-600">Gestão de Stock</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
