import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Headphones, Mail, MessageCircle, Send } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Support = ({ user }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${BACKEND_URL}/api/support/contact`,
        formData,
        { withCredentials: true }
      );

      toast.success('Mensagem enviada com sucesso!');
      setFormData({ subject: '', message: '' });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/258840000000?text=Olá,%20preciso%20de%20ajuda%20com%20o%20Controle%20de%20Venda', '_blank');
  };

  return (
    <Layout user={user}>
      <div className="space-y-6 fade-in max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-slate-900" data-testid="support-title">{t('support')}</h1>
          <p className="text-slate-600 mt-1">Como podemos ajudar?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-hover cursor-pointer" onClick={handleWhatsApp} data-testid="whatsapp-support-btn">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900">WhatsApp</h3>
              <p className="text-sm text-slate-600 mt-1">Suporte rápido</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900">Email</h3>
              <p className="text-sm text-slate-600 mt-1">suporte@exemplo.com</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Headphones className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-900">Telefone</h3>
              <p className="text-sm text-slate-600 mt-1">+258 84 000 0000</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('contact_support')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="subject">{t('subject')}</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  data-testid="support-subject-input"
                />
              </div>
              <div>
                <Label htmlFor="message">{t('message')}</Label>
                <Textarea
                  id="message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  data-testid="support-message-input"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                data-testid="send-support-btn"
              >
                {loading ? (
                  <span>{t('please_wait')}</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    {t('send')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Como adicionar um produto?</h3>
                <p className="text-sm text-slate-600">Vá para a página de Produtos e clique no botão "Adicionar Produto". Preencha as informações e salve.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Como usar o scanner?</h3>
                <p className="text-sm text-slate-600">Acesse a página Scanner, clique em "Iniciar Scanner" e aponte a câmera para o código de barras.</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Como registrar saída de stock?</h3>
                <p className="text-sm text-slate-600">Use o scanner ou vá para a página de Histórico e adicione um movimento de saída.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Support;