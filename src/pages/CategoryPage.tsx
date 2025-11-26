import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  thumbnail: string | null;
  rating: number | null;
  published_at: string;
}

interface Category {
  name: string;
  description: string | null;
}

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [topArticles, setTopArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchCategoryAndArticles();
    }
  }, [slug]);

  const fetchCategoryAndArticles = async () => {
    try {
      // Fetch category info
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("name, description")
        .eq("slug", slug)
        .single();

      if (categoryError) throw categoryError;
      setCategory(categoryData);

      // Fetch category ID for articles
      const { data: catData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", slug)
        .single();

      if (!catData) return;

      // Fetch all articles in this category
      const { data: articlesData, error: articlesError } = await supabase
        .from("articles")
        .select("id, title, slug, excerpt, thumbnail, rating, published_at")
        .eq("category_id", catData.id)
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (articlesError) throw articlesError;
      setArticles(articlesData || []);

      // Get top 5 articles by rating for ranking
      const { data: topArticlesData } = await supabase
        .from("articles")
        .select("id, title, slug, excerpt, thumbnail, rating, published_at")
        .eq("category_id", catData.id)
        .eq("status", "published")
        .order("rating", { ascending: false })
        .order("published_at", { ascending: false })
        .limit(5);

      setTopArticles(topArticlesData || []);
    } catch (error) {
      console.error("Error fetching category:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="h-10 bg-muted rounded w-1/3 mb-4 animate-pulse" />
            <div className="h-6 bg-muted rounded w-2/3 mb-8 animate-pulse" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Categoria não encontrada</h1>
          <Link to="/categorias">
            <Button>Ver todas as categorias</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground mb-8">{category.description}</p>
          )}

          {/* Ranking Section */}
          {topArticles.length > 0 && (
            <Card className="mb-12 bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">🏆 Ranking Review Nexus - {category.name}</h2>
                <p className="text-muted-foreground mb-6">
                  Os melhores produtos desta categoria, ordenados por avaliação
                </p>
                <div className="space-y-4">
                  {topArticles.map((article, index) => (
                    <Link key={article.id} to={`/review/${article.slug}`}>
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-background hover:shadow-md transition-shadow">
                        <div className="text-3xl font-bold text-primary min-w-[50px]">
                          #{index + 1}
                        </div>
                        {article.thumbnail && (
                          <img
                            src={article.thumbnail}
                            alt={article.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{article.title}</h3>
                          {article.rating && (
                            <div className="flex items-center gap-2">
                              <span className="text-primary font-semibold">
                                ⭐ {article.rating.toFixed(1)}/5.0
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Articles */}
          <h2 className="text-2xl font-bold mb-6">Todos os Reviews</h2>
          {articles.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  Nenhum review nesta categoria ainda.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link key={article.id} to={`/review/${article.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    {article.thumbnail && (
                      <img
                        src={article.thumbnail}
                        alt={article.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      {article.rating && (
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary">
                            ⭐ {article.rating.toFixed(1)}
                          </Badge>
                        </div>
                      )}
                      {article.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}
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

export default CategoryPage;
