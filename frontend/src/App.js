import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import '@/App.css';

import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Scanner from './pages/Scanner';
import CurrencyConverter from './pages/CurrencyConverter';
import Calculator from './pages/Calculator';
import History from './pages/History';
import Reports from './pages/Reports';
import Support from './pages/Support';
import Settings from './pages/Settings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import ProtectedRoute from './components/ProtectedRoute';

function AppRouter() {
  const location = useLocation();
  
  // Check URL fragment (not query params) for session_id
  // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }
  
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/scanner" element={<ProtectedRoute><Scanner /></ProtectedRoute>} />
      <Route path="/currency" element={<ProtectedRoute><CurrencyConverter /></ProtectedRoute>} />
      <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <AppRouter />
        <Toaster position="top-right" />
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;