import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export const Header = () => {
  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-primary">Review Nexus</div>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/categorias" className="text-sm font-medium hover:text-primary transition-colors">
            Categorias
          </Link>
          <Link to="/sobre" className="text-sm font-medium hover:text-primary transition-colors">
            Sobre
          </Link>
          <Link to="/buscar" className="text-sm font-medium hover:text-primary transition-colors">
            Buscar
          </Link>
        </nav>
      </div>
    </header>
  );
};