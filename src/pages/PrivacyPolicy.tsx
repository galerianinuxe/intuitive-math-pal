import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Política de Privacidade</h1>
          
          <Card>
            <CardContent className="p-8 prose prose-sm max-w-none">
              <p className="text-muted-foreground mb-6">
                <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
              </p>

              <h2>1. Introdução</h2>
              <p>
                Bem-vindo ao Review Nexus. Esta Política de Privacidade descreve como coletamos, 
                usamos e protegemos suas informações pessoais quando você visita nosso site.
              </p>

              <h2>2. Informações que Coletamos</h2>
              <h3>2.1 Informações de Navegação</h3>
              <p>
                Coletamos automaticamente certas informações quando você visita nosso site, incluindo:
              </p>
              <ul>
                <li>Endereço IP</li>
                <li>Tipo de navegador e sistema operacional</li>
                <li>Páginas visitadas e tempo de permanência</li>
                <li>Data e hora de acesso</li>
              </ul>

              <h3>2.2 Cookies e Tecnologias Similares</h3>
              <p>
                Utilizamos cookies para melhorar sua experiência de navegação, analisar o tráfego 
                do site e personalizar conteúdo. Você pode configurar seu navegador para recusar 
                cookies, mas isso pode afetar algumas funcionalidades do site.
              </p>

              <h2>3. Como Usamos Suas Informações</h2>
              <p>Usamos as informações coletadas para:</p>
              <ul>
                <li>Melhorar a experiência do usuário</li>
                <li>Analisar padrões de uso e otimizar o conteúdo</li>
                <li>Gerar estatísticas de visualização anônimas</li>
                <li>Cumprir obrigações legais</li>
              </ul>

              <h2>4. Links de Afiliados</h2>
              <p>
                Nosso site contém links de afiliados para plataformas como Amazon, Mercado Livre, 
                Shopee e outros parceiros comerciais. Quando você clica nesses links e realiza uma 
                compra, podemos receber uma comissão sem custo adicional para você.
              </p>
              <p>
                As informações que você compartilha com essas plataformas estão sujeitas às suas 
                próprias políticas de privacidade.
              </p>

              <h2>5. Conteúdo Gerado por Inteligência Artificial</h2>
              <p>
                Alguns reviews e artigos em nosso site são gerados ou assistidos por Inteligência 
                Artificial. Nosso objetivo é fornecer análises profissionais, objetivas e úteis. 
                Todo conteúdo gerado por IA é revisado para garantir qualidade e precisão.
              </p>

              <h2>6. Compartilhamento de Informações</h2>
              <p>
                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
                exceto quando:
              </p>
              <ul>
                <li>Exigido por lei ou ordem judicial</li>
                <li>Necessário para proteger nossos direitos legais</li>
                <li>Com seu consentimento explícito</li>
              </ul>

              <h2>7. Segurança dos Dados</h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas 
                informações contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>

              <h2>8. Seus Direitos (LGPD)</h2>
              <p>
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
              </p>
              <ul>
                <li>Confirmar a existência de tratamento de dados</li>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li>Solicitar a anonimização, bloqueio ou eliminação de dados</li>
                <li>Revogar o consentimento</li>
              </ul>

              <h2>9. Analytics e Métricas</h2>
              <p>
                Coletamos dados agregados e anônimos sobre visualizações de artigos e tempo de 
                permanência para fins analíticos e de melhoria do conteúdo. Essas informações não 
                são associadas a usuários individuais identificáveis.
              </p>

              <h2>10. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Recomendamos revisar 
                esta página regularmente para se manter informado sobre como protegemos suas informações.
              </p>

              <h2>11. Contato</h2>
              <p>
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre o tratamento de 
                suas informações pessoais, entre em contato conosco através do nosso site.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
