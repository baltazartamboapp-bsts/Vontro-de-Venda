import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, AlertTriangle, CheckCircle, Phone, Mail } from 'lucide-react';

const TermsOfService = () => {
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
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileText className="w-6 h-6 text-blue-600" />
              Termos de Uso
            </CardTitle>
            <p className="text-sm text-slate-600 mt-2">Última atualização: Dezembro 2024</p>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Aceitação dos Termos
              </h2>
              <p className="text-slate-700">
                Ao acessar e usar o aplicativo <strong>Controle de Venda</strong>, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
                <p className="text-slate-700">
                  <strong>Se você não concorda com algum destes termos, não use o aplicativo.</strong>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Uso do Aplicativo</h2>
              <div className="space-y-2 text-slate-700">
                <p>O aplicativo deve ser usado exclusivamente para:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Gerenciar produtos e controle de estoque</li>
                  <li>Registrar movimentos de entrada e saída</li>
                  <li>Realizar cálculos comerciais (lucro, margem, markup)</li>
                  <li>Converter moedas para fins comerciais legítimos</li>
                  <li>Gerar relatórios de vendas e análises</li>
                </ul>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-3">
                  <p className="text-slate-700 font-medium">
                    <strong>É proibido usar o aplicativo para atividades ilegais ou não autorizadas.</strong>
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Responsabilidades do Usuário</h2>
              <div className="space-y-2 text-slate-700">
                <p>Como usuário do aplicativo, você concorda em:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Fornecer informações precisas e atualizadas durante o registro</li>
                  <li>Manter suas credenciais de login seguras e confidenciais</li>
                  <li>Não compartilhar sua conta com terceiros</li>
                  <li>Notificar imediatamente sobre qualquer uso não autorizado</li>
                  <li>Usar o aplicativo de forma ética e legal</li>
                  <li>Não tentar hackear, modificar ou comprometer o sistema</li>
                  <li>Respeitar os direitos de propriedade intelectual</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Licença de Uso</h2>
              <p className="text-slate-700">
                O <strong>Controle de Venda</strong> concede a você uma licença limitada, não exclusiva, não transferível e revogável para usar o aplicativo para fins pessoais ou comerciais legítimos.
              </p>
              <div className="bg-slate-50 rounded-lg p-4 mt-3">
                <p className="text-slate-700 text-sm">
                  Esta licença não inclui o direito de revender, redistribuir ou criar obras derivadas do aplicativo.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Propriedade dos Dados</h2>
              <div className="space-y-2 text-slate-700">
                <p><strong>Seus dados pertencem a você.</strong> O aplicativo serve apenas como ferramenta para:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Armazenar seus dados de produtos e movimentos</li>
                  <li>Processar cálculos e gerar relatórios</li>
                  <li>Fornecer funcionalidades de gestão</li>
                </ul>
                <p className="mt-2">
                  Você mantém todos os direitos, títulos e interesses sobre seus dados e pode exportá-los ou excluí-los a qualquer momento.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Limitação de Responsabilidade
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="space-y-2 text-slate-700">
                  <p><strong>O desenvolvedor não se responsabiliza por:</strong></p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Perdas financeiras decorrentes do uso incorreto do aplicativo</li>
                    <li>Erros de cálculo causados por dados incorretos inseridos pelo usuário</li>
                    <li>Perda de dados devido a falhas técnicas (recomenda-se backup regular)</li>
                    <li>Danos indiretos, incidentais ou consequenciais</li>
                    <li>Interrupções temporárias do serviço para manutenção</li>
                  </ul>
                  <p className="mt-2 font-medium">
                    O aplicativo é fornecido "COMO ESTÁ", sem garantias de qualquer tipo, expressas ou implícitas.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Suporte e Assistência</h2>
              <div className="space-y-2 text-slate-700">
                <p>Para suporte técnico, dúvidas ou problemas:</p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-3">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span>Telefone/WhatsApp: <strong className="font-mono">845234933</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span>Email: <strong className="font-mono text-sm">baltazartambo026@gmail.com</strong></span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-3">
                    Horário de atendimento: Segunda a Sexta, 08:00 - 18:00 (Hora de Moçambique)
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Atualizações do Aplicativo</h2>
              <p className="text-slate-700">
                O aplicativo pode ser atualizado periodicamente para:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-slate-700 mt-2">
                <li>Corrigir erros e bugs</li>
                <li>Adicionar novas funcionalidades</li>
                <li>Melhorar a segurança e performance</li>
                <li>Atualizar compatibilidade com sistemas operacionais</li>
              </ul>
              <p className="text-slate-700 mt-2">
                Você será notificado sobre atualizações importantes que possam afetar seu uso.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Rescisão</h2>
              <div className="space-y-2 text-slate-700">
                <p>Você pode encerrar sua conta a qualquer momento através das configurações do aplicativo ou entrando em contato com o suporte.</p>
                <p>O desenvolvedor reserva-se o direito de suspender ou encerrar contas que violem estes termos de uso.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Lei Aplicável</h2>
              <p className="text-slate-700">
                Estes termos são regidos pelas leis de <strong>Moçambique</strong>. Qualquer disputa será resolvida nos tribunais competentes de Moçambique.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Alterações nos Termos</h2>
              <p className="text-slate-700">
                Estes termos podem ser atualizados ocasionalmente. Alterações significativas serão comunicadas através do aplicativo. 
                O uso continuado após alterações constitui aceitação dos novos termos.
              </p>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-slate-700">
                <strong>Ao usar o aplicativo Controle de Venda, você reconhece ter lido, compreendido e concordado com estes Termos de Uso.</strong>
              </p>
            </div>

            <div className="text-center mt-8 text-sm text-slate-500">
              <p>Controle de Venda v1.0.0</p>
              <p>© 2024 Baltazar Tambo. Todos os direitos reservados.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;