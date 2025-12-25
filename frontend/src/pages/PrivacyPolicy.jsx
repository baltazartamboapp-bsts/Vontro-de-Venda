import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, Eye, Phone, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <Card>
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-blue-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Shield className="w-6 h-6 text-emerald-600" />
              Política de Privacidade
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2">Última atualização: Dezembro 2024</p>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Informações Coletadas
              </h2>
              <div className="space-y-2 text-slate-700">
                <p>O aplicativo <strong>Controle de Venda</strong> coleta as seguintes informações:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Nome completo</li>
                  <li>Endereço de email</li>
                  <li>Número de telefone (quando fornecido)</li>
                  <li>Dados sobre produtos adicionados no sistema</li>
                  <li>Informações de idioma e país selecionados</li>
                  <li>Histórico de movimentos de stock</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Uso das Informações</h2>
              <div className="space-y-2 text-slate-700">
                <p>As informações coletadas são utilizadas para:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Funcionamento do aplicativo (login, registro de produtos, cálculos automáticos)</li>
                  <li>Fornecer suporte técnico e comunicação com o usuário</li>
                  <li>Melhorar a experiência do usuário</li>
                  <li>Análise de uso e performance do aplicativo</li>
                  <li>Personalização de idioma e configurações</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-600" />
                Compartilhamento de Dados
              </h2>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-slate-700 font-medium">
                  <strong>Nenhuma informação será compartilhada com terceiros</strong> sem autorização expressa do usuário.
                </p>
                <p className="text-slate-600 text-sm mt-2">
                  Seus dados são exclusivamente seus e permanecem sob seu controle total.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Segurança</h2>
              <div className="space-y-2 text-slate-700">
                <p>Implementamos medidas de segurança para proteger suas informações:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Criptografia de dados em trânsito (HTTPS/SSL)</li>
                  <li>Autenticação segura via Google OAuth</li>
                  <li>Armazenamento seguro em banco de dados protegido</li>
                  <li>Acesso restrito aos dados do usuário</li>
                  <li>Backup regular dos dados</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Seus Direitos</h2>
              <div className="space-y-2 text-slate-700">
                <p>Você tem o direito de:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Acessar seus dados pessoais a qualquer momento</li>
                  <li>Solicitar correção de informações incorretas</li>
                  <li>Solicitar exclusão de sua conta e dados</li>
                  <li>Exportar seus dados em formato legível</li>
                  <li>Revogar consentimento para processamento de dados</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Cookies e Armazenamento Local</h2>
              <div className="space-y-2 text-slate-700">
                <p>O aplicativo utiliza:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Cookies de sessão para manter você conectado</li>
                  <li>Armazenamento local para preferências de idioma</li>
                  <li>Nenhum cookie de rastreamento de terceiros</li>
                </ul>
              </div>
            </section>

            <section className="bg-slate-50 rounded-lg p-4">
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Phone className="w-5 h-5 text-emerald-600" />
                Contato
              </h2>
              <div className="space-y-2 text-slate-700">
                <p>Para questões sobre privacidade ou exercer seus direitos, entre em contato:</p>
                <div className="flex flex-col gap-2 mt-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span className="font-mono font-medium">845234933</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="font-mono text-sm">baltazartambo026@gmail.com</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Alterações na Política</h2>
              <p className="text-slate-700">
                Esta política pode ser atualizada periodicamente. Alterações significativas serão notificadas através do aplicativo. 
                A data da última atualização está sempre indicada no topo desta página.
              </p>
            </section>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-6">
              <p className="text-slate-700">
                <strong>Ao usar o aplicativo Controle de Venda, você concorda com esta Política de Privacidade.</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;