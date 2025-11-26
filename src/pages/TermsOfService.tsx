import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Termos de Uso</h1>
          
          <Card>
            <CardContent className="p-8 prose prose-sm max-w-none">
              <p className="text-muted-foreground mb-6">
                <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
              </p>

              <h2>1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar o Review Nexus, você concorda em cumprir estes Termos de Uso. 
                Se você não concordar com qualquer parte destes termos, não utilize nosso site.
              </p>

              <h2>2. Descrição do Serviço</h2>
              <p>
                O Review Nexus é um site de reviews e análises de produtos que oferece:
              </p>
              <ul>
                <li>Reviews profissionais de produtos</li>
                <li>Análises detalhadas e comparações</li>
                <li>Links para compra de produtos avaliados</li>
                <li>Conteúdo informativo sobre diversos produtos</li>
              </ul>

              <h2>3. Conteúdo Gerado por IA</h2>
              <p>
                Parte do conteúdo do Review Nexus é gerado ou assistido por Inteligência Artificial. 
                Embora nos esforcemos para garantir precisão e qualidade:
              </p>
              <ul>
                <li>O conteúdo é fornecido "como está" para fins informativos</li>
                <li>Não garantimos 100% de precisão em todas as informações técnicas</li>
                <li>Recomendamos verificar especificações oficiais antes de compras importantes</li>
                <li>Todo conteúdo gerado passa por revisão editorial</li>
              </ul>

              <h2>4. Links de Afiliados e Comissões</h2>
              <h3>4.1 Transparência</h3>
              <p>
                O Review Nexus participa de programas de afiliados com Amazon, Mercado Livre, 
                Shopee e outros parceiros comerciais. Quando você clica em links de produtos e 
                realiza uma compra, podemos receber uma comissão.
              </p>

              <h3>4.2 Imparcialidade</h3>
              <p>
                Nossas avaliações e reviews são imparciais e baseadas em análises objetivas. 
                Os links de afiliados não influenciam nossas opiniões ou classificações.
              </p>

              <h3>4.3 Sem Custo Adicional</h3>
              <p>
                As comissões de afiliados não geram custos adicionais para você. Os preços são 
                os mesmos oferecidos diretamente pelos vendedores.
              </p>

              <h2>5. Direitos de Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo do Review Nexus, incluindo textos, imagens, logos e design, 
                é protegido por direitos autorais e outras leis de propriedade intelectual.
              </p>
              <p>Você não pode:</p>
              <ul>
                <li>Copiar, reproduzir ou distribuir nosso conteúdo sem autorização</li>
                <li>Usar nosso conteúdo para fins comerciais sem permissão</li>
                <li>Modificar ou criar trabalhos derivados do nosso conteúdo</li>
              </ul>

              <h2>6. Isenção de Responsabilidade</h2>
              <h3>6.1 Informações de Produtos</h3>
              <p>
                As informações sobre produtos são fornecidas para fins informativos. Preços, 
                disponibilidade e especificações podem mudar sem aviso prévio.
              </p>

              <h3>6.2 Decisões de Compra</h3>
              <p>
                Você é responsável por suas decisões de compra. Recomendamos:
              </p>
              <ul>
                <li>Verificar especificações oficiais do produto</li>
                <li>Ler avaliações de múltiplas fontes</li>
                <li>Considerar suas necessidades específicas</li>
                <li>Verificar políticas de devolução dos vendedores</li>
              </ul>

              <h2>7. Limitação de Responsabilidade</h2>
              <p>
                O Review Nexus não se responsabiliza por:
              </p>
              <ul>
                <li>Decisões de compra baseadas em nossos reviews</li>
                <li>Problemas com produtos adquiridos através de links de afiliados</li>
                <li>Mudanças de preço, disponibilidade ou especificações</li>
                <li>Experiências com vendedores terceiros</li>
                <li>Eventuais imprecisões no conteúdo gerado por IA</li>
              </ul>

              <h2>8. Uso Aceitável</h2>
              <p>Ao usar nosso site, você concorda em:</p>
              <ul>
                <li>Não usar o site para atividades ilegais</li>
                <li>Não tentar hackear ou comprometer a segurança do site</li>
                <li>Não coletar dados de outros usuários</li>
                <li>Não sobrecarregar nossos servidores com requisições excessivas</li>
              </ul>

              <h2>9. Modificações dos Termos</h2>
              <p>
                Reservamos o direito de modificar estes Termos de Uso a qualquer momento. 
                Alterações significativas serão comunicadas através do site. O uso continuado 
                após mudanças constitui aceitação dos novos termos.
              </p>

              <h2>10. Links para Sites Terceiros</h2>
              <p>
                Nosso site contém links para sites de terceiros. Não somos responsáveis pelo 
                conteúdo, políticas de privacidade ou práticas desses sites.
              </p>

              <h2>11. Privacidade</h2>
              <p>
                O uso do site também é regido por nossa Política de Privacidade. Por favor, 
                revise-a para entender como coletamos e usamos suas informações.
              </p>

              <h2>12. Lei Aplicável</h2>
              <p>
                Estes Termos de Uso são regidos pelas leis brasileiras. Quaisquer disputas 
                serão resolvidas nos tribunais competentes do Brasil.
              </p>

              <h2>13. Contato</h2>
              <p>
                Para questões sobre estes Termos de Uso, entre em contato através do nosso site.
              </p>

              <h2>14. Disposições Gerais</h2>
              <p>
                Se qualquer disposição destes termos for considerada inválida, as demais 
                disposições permanecerão em pleno vigor e efeito.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
