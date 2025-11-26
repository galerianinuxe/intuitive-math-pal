import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t bg-card mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Review Nexus</h3>
            <p className="text-sm text-muted-foreground">
              Reviews profissionais e confiáveis de produtos para você fazer a melhor escolha.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
              <li><Link to="/categorias" className="text-muted-foreground hover:text-primary">Categorias</Link></li>
              <li><Link to="/sobre" className="text-muted-foreground hover:text-primary">Sobre</Link></li>
              <li><Link to="/buscar" className="text-muted-foreground hover:text-primary">Buscar</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacidade" className="text-muted-foreground hover:text-primary">Política de Privacidade</Link></li>
              <li><Link to="/termos" className="text-muted-foreground hover:text-primary">Termos de Uso</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <p className="text-sm text-muted-foreground">
              contato@reviewnexus.online
            </p>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Review Nexus. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};