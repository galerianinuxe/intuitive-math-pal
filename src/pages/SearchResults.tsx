import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string;
  rating: number;
  categories: { name: string } | null;
}

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setArticles([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          slug,
          excerpt,
          thumbnail,
          rating,
          categories:category_id (name)
        `)
        .eq("status", "published")
        .or(`title.ilike.%${searchQuery}%,content_html.ilike.%${searchQuery}%`)
        .order("published_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Buscar Reviews</h1>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <Input
                type="search"
                placeholder="Busque por título, produto, categoria..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </div>
          </form>

          {loading ? (
            <div className="text-center py-12">
              <p>Buscando...</p>
            </div>
          ) : articles.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {query ? "Nenhum resultado encontrado." : "Digite algo para buscar."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground mb-4">
                {articles.length} {articles.length === 1 ? "resultado encontrado" : "resultados encontrados"}
              </p>

              {articles.map((article) => (
                <Link key={article.id} to={`/review/${article.slug}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        {article.thumbnail && (
                          <img
                            src={article.thumbnail}
                            alt={article.title}
                            className="w-24 h-24 object-cover rounded"
                            loading="lazy"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-xl font-semibold">{article.title}</h3>
                            {article.rating && (
                              <Badge variant="secondary">⭐ {article.rating}</Badge>
                            )}
                          </div>
                          {article.categories && (
                            <Badge variant="outline" className="mb-2">
                              {article.categories.name}
                            </Badge>
                          )}
                          {article.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {article.excerpt}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
