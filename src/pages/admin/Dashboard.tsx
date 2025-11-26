import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
    fetchStats();
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("status");

      if (error) throw error;

      const total = data?.length || 0;
      const published = data?.filter(a => a.status === 'published').length || 0;
      const draft = data?.filter(a => a.status === 'draft').length || 0;

      setStats({
        totalArticles: total,
        publishedArticles: published,
        draftArticles: draft,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
    toast.success("Logout realizado com sucesso!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Painel Admin</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/">
              <Button variant="outline">Ver Site</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total de Artigos</CardDescription>
              <CardTitle className="text-4xl">{stats.totalArticles}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Publicados</CardDescription>
              <CardTitle className="text-4xl text-primary">{stats.publishedArticles}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Rascunhos</CardDescription>
              <CardTitle className="text-4xl text-muted-foreground">{stats.draftArticles}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Artigo</CardTitle>
              <CardDescription>
                Use a IA para gerar reviews profissionais automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/create">
                <Button className="w-full" size="lg">
                  🤖 Criar Artigo com IA
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Artigos</CardTitle>
              <CardDescription>
                Visualizar, editar e excluir artigos existentes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/articles">
                <Button variant="outline" className="w-full" size="lg">
                  📝 Ver Todos os Artigos
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categorias</CardTitle>
              <CardDescription>
                Criar e gerenciar categorias de reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/categories">
                <Button variant="outline" className="w-full" size="lg">
                  🏷️ Gerenciar Categorias
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>
                Personalizar título, descrição e logo do site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/settings">
                <Button variant="outline" className="w-full" size="lg">
                  ⚙️ Configurações
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;