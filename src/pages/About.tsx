import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Sobre o Review Nexus</h1>
          
          <Card className="mb-8">
            <CardContent className="p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Quem Somos</h2>
                <p className="text-muted-foreground leading-relaxed">
                  O Review Nexus é uma plataforma dedicada a fornecer reviews profissionais, 
                  honestos e independentes de produtos e serviços. Nossa missão é ajudar você 
                  a tomar decisões de compra informadas, oferecendo análises detalhadas e 
                  imparciais baseadas em pesquisa aprofundada e experiência real.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Nossa Abordagem</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Utilizamos tecnologia avançada e inteligência artificial para organizar, 
                  estruturar e apresentar informações de forma clara e acessível. No entanto, 
                  nosso foco permanece sempre no benefício real para você, o usuário. Cada 
                  review é cuidadosamente elaborado seguindo critérios rigorosos de qualidade.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">O Que Oferecemos</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Reviews detalhados com análise de prós e contras</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Fichas técnicas completas e comparações com concorrentes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Sistema de avaliação transparente e consistente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Rankings por categoria para facilitar sua escolha</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Links verificados para compra segura em lojas confiáveis</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Nosso Compromisso</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Estamos comprometidos com a transparência e a honestidade. Nossos reviews 
                  são independentes e imparciais. Quando incluímos links de afiliados em 
                  nossos artigos, isso nos ajuda a manter a plataforma funcionando, mas 
                  nunca influencia nossas avaliações ou recomendações.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Categorias Cobertas</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Cobrimos uma ampla gama de categorias de produtos, incluindo:
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-primary">•</span>
                    <span>Eletrônicos e Tecnologia</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-primary">•</span>
                    <span>Hardware e Componentes</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-primary">•</span>
                    <span>Smartphones e Tablets</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-primary">•</span>
                    <span>Periféricos e Acessórios</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-primary">•</span>
                    <span>Casa e Eletrodomésticos</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-primary">•</span>
                    <span>E muito mais...</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <p className="text-center text-muted-foreground">
                  Obrigado por confiar no Review Nexus para suas decisões de compra!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
