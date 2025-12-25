import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Package, ScanBarcode, History, BarChart3, Headphones, Settings, LogOut, DollarSign, Phone, Globe, Calculator } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Layout = ({ children, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    toast.success(`Idioma alterado para ${lng === 'pt' ? 'Português' : 'English'}`);
  };

  const menuItems = [
    { path: '/dashboard', icon: Home, label: t('dashboard'), testId: 'nav-dashboard' },
    { path: '/products', icon: Package, label: t('products'), testId: 'nav-products' },
    { path: '/scanner', icon: ScanBarcode, label: t('scanner'), testId: 'nav-scanner' },
    { path: '/currency', icon: DollarSign, label: 'Conversão de Moeda', testId: 'nav-currency' },
    { path: '/calculator', icon: Calculator, label: 'Calculadora', testId: 'nav-calculator' },
    { path: '/history', icon: History, label: t('history'), testId: 'nav-history' },
    { path: '/reports', icon: BarChart3, label: t('reports'), testId: 'nav-reports' },
    { path: '/support', icon: Headphones, label: t('support'), testId: 'nav-support' },
    { path: '/settings', icon: Settings, label: t('settings'), testId: 'nav-settings' },
  ];

  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
      navigate('/login');
      toast.success(t('logout'));
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-slate-200">
        {/* Top Contact Bar - Desktop */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
          <a href="tel:+258845234933" className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors">
            <Phone className="w-4 h-4" />
            <span className="font-medium">845234933</span>
          </a>
          <Select value={i18n.language} onValueChange={changeLanguage}>
            <SelectTrigger className="w-20 h-8 text-xs border-slate-300">
              <SelectValue>
                <span className="text-xs">
                  {i18n.language === 'pt-MZ' && '🇲🇿'}
                  {i18n.language === 'pt-BR' && '🇧🇷'}
                  {i18n.language === 'pt-PT' && '🇵🇹'}
                  {i18n.language === 'es' && '🇪🇸'}
                  {i18n.language === 'fr' && '🇫🇷'}
                  {i18n.language === 'zu' && '🇿🇦'}
                  {i18n.language === 'sn' && '🇿🇼'}
                  {i18n.language === 'sw' && '🇹🇿'}
                  {i18n.language === 'en-ZA' && '🇿🇦'}
                  {i18n.language === 'en-US' && '🇺🇸'}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt-MZ">🇲🇿 PT-MZ</SelectItem>
              <SelectItem value="pt-BR">🇧🇷 PT-BR</SelectItem>
              <SelectItem value="pt-PT">🇵🇹 PT-PT</SelectItem>
              <SelectItem value="es">🇪🇸 ES</SelectItem>
              <SelectItem value="fr">🇫🇷 FR</SelectItem>
              <SelectItem value="zu">🇿🇦 Zulu</SelectItem>
              <SelectItem value="sn">🇿🇼 Shona</SelectItem>
              <SelectItem value="sw">🇹🇿 Swahili</SelectItem>
              <SelectItem value="en-ZA">🇿🇦 EN-ZA</SelectItem>
              <SelectItem value="en-US">🇺🇸 EN-US</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <Package className="w-8 h-8 text-emerald-600" />
            <span className="ml-3 text-xl font-bold text-slate-900">{t('app_name')}</span>
          </div>
          <nav className="flex-1 px-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  data-testid={item.testId}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="flex-shrink-0 px-4 pt-4 border-t border-slate-200">
            <div className="flex items-center mb-4">
              <img
                src={user?.picture || 'https://via.placeholder.com/40'}
                alt={user?.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full"
              data-testid="logout-btn"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {t('logout')}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Package className="w-6 h-6 text-emerald-600" />
            <span className="ml-2 text-lg font-bold text-slate-900">{t('app_name')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Select value={i18n.language} onValueChange={changeLanguage}>
              <SelectTrigger className="w-16 h-8 text-xs border-slate-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-MZ">🇲🇿</SelectItem>
                <SelectItem value="pt-BR">🇧🇷</SelectItem>
                <SelectItem value="pt-PT">🇵🇹</SelectItem>
                <SelectItem value="es">🇪🇸</SelectItem>
                <SelectItem value="fr">🇫🇷</SelectItem>
                <SelectItem value="zu">Zu</SelectItem>
                <SelectItem value="sn">Sn</SelectItem>
                <SelectItem value="sw">Sw</SelectItem>
                <SelectItem value="en-ZA">🇿🇦</SelectItem>
                <SelectItem value="en-US">🇺🇸</SelectItem>
              </SelectContent>
            </Select>
            <a href="tel:+258845234933" className="text-slate-600 hover:text-emerald-600 transition-colors">
              <Phone className="w-5 h-5" />
            </a>
            <img
              src={user?.picture || 'https://via.placeholder.com/32'}
              alt={user?.name}
              className="w-8 h-8 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 pb-20 lg:pb-0">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 mobile-nav-shadow">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                data-testid={`mobile-${item.testId}`}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1 truncate w-full text-center">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;