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
import { Phone, MessageCircle, Mail, Send, HelpCircle, FileText } from 'lucide-react';

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
      toast.error('Erro ao enviar mensagem');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/258845234933?text=Olá,%20preciso%20de%20ajuda%20com%20o%20Controle%20de%20Venda', '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+258845234933';
  };

  const handleEmail = () => {
    window.location.href = 'mailto:baltazartambo026@gmail.com';
  };

  return (
    <Layout user={user}>
      <div className="space-y-6 fade-in max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-slate-900" data-testid="support-title">{t('support')}</h1>
          <p className="text-slate-600 mt-1">Como podemos ajudar você?</p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className="card-hover cursor-pointer hover:border-emerald-300 transition-all" 
            onClick={handleWhatsApp}
            data-testid="whatsapp-support-btn"
          >
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">WhatsApp</h3>
              <p className="text-sm text-slate-600">845234933</p>
              <p className="text-xs text-emerald-600 mt-2">Resposta rápida</p>
            </CardContent>
          </Card>

          <Card 
            className="card-hover cursor-pointer hover:border-blue-300 transition-all"
            onClick={handleCall}
            data-testid="phone-support-btn"
          >
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Telefone</h3>
              <p className="text-sm text-slate-600">845234933</p>
              <p className="text-xs text-blue-600 mt-2">Ligue agora</p>
            </CardContent>
          </Card>

          <Card 
            className="card-hover cursor-pointer hover:border-purple-300 transition-all"
            onClick={handleEmail}
            data-testid="email-support-btn"
          >
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Email</h3>
              <p className="text-sm text-slate-600 break-all px-2">baltazartambo026@gmail.com</p>
              <p className="text-xs text-purple-600 mt-2">Enviar email</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Enviar Mensagem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="subject">Assunto *</Label>
                <Input
                  id="subject"
                  placeholder="Ex: Problema com o scanner"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  data-testid="support-subject-input"
                />
              </div>
              <div>
                <Label htmlFor="message">Mensagem *</Label>
                <Textarea
                  id="message"
                  rows={6}
                  placeholder="Descreva seu problema ou dúvida em detalhes..."
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
                {loading ? 'Enviando...' : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Perguntas Frequentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-emerald-500 pl-4 py-2">
                <h3 className="font-bold text-slate-900 mb-2">Como adicionar um produto?</h3>
                <p className="text-sm text-slate-600">Vá para a página de Produtos e clique no botão "Adicionar Produto". Preencha as informações necessárias e clique em Guardar.</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h3 className="font-bold text-slate-900 mb-2">Como usar o scanner de código de barras?</h3>
                <p className="text-sm text-slate-600">Acesse a página Scanner, clique em "Iniciar Scanner" e aponte a câmera do seu dispositivo para o código de barras do produto.</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h3 className="font-bold text-slate-900 mb-2">Como registrar saída de stock?</h3>
                <p className="text-sm text-slate-600">Use o scanner para encontrar o produto ou busque manualmente. Depois selecione "Adicionar Saída" e informe a quantidade.</p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4 py-2">
                <h3 className="font-bold text-slate-900 mb-2">Como converter moedas?</h3>
                <p className="text-sm text-slate-600">Acesse "Conversão de Moeda" no menu principal. Digite o valor, selecione as moedas de origem e destino, e clique em "Converter Agora".</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developer Info */}
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Informações do Desenvolvedor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700">Telefone:</span>
                <span className="font-mono font-medium">845234933</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700">WhatsApp:</span>
                <span className="font-mono font-medium">845234933</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700">Email:</span>
                <span className="font-mono font-medium text-xs">baltazartambo026@gmail.com</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Support;