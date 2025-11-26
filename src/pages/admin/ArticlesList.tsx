import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string;
  published_at: string;
  categories: { name: string } | null;
}

const ArticlesList = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchArticles();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          slug,
          status,
          published_at,
          categories:category_id (name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
      toast.error("Erro ao carregar artigos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir "${title}"?`)) return;

    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Artigo excluído com sucesso!");
      fetchArticles();
    } catch (error: any) {
      console.error("Error deleting article:", error);
      toast.error(error.message || "Erro ao excluir artigo");
    }
  };

  return (
    <div className="min-h-screen bg-muted/50">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gerenciar Artigos</h1>
          <div className="flex gap-2">
            <Link to="/admin/create">
              <Button>Criar Novo</Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p>Carregando artigos...</p>
          </div>
        ) : articles.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              Nenhum artigo criado ainda
            </p>
            <Link to="/admin/create">
              <Button>Criar Primeiro Artigo</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <Card key={article.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold">{article.title}</h3>
                      <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                        {article.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </Badge>
                      {article.categories && (
                        <Badge variant="outline">{article.categories.name}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Slug: {article.slug}
                    </p>
                    {article.published_at && (
                      <p className="text-sm text-muted-foreground">
                        Publicado em: {new Date(article.published_at).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Link to={`/admin/edit/${article.id}`}>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </Link>
                    {article.status === 'published' && (
                      <Link to={`/review/${article.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                          Ver no Site
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(article.id, article.title)}
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ArticlesList;