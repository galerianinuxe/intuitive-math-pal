import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  thumbnail: string | null;
  rating: number;
  published_at: string;
  categories: { name: string; slug: string } | null;
}

const Home = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          slug,
          excerpt,
          cover_image,
          thumbnail,
          rating,
          published_at,
          categories:category_id (name, slug)
        `)
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(12);

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-hero-bg text-hero-text py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Reviews Profissionais
          </h1>
          <p className="text-xl md:text-2xl text-hero-text/80 mb-8 max-w-2xl mx-auto">
            Análises detalhadas e honestas dos melhores produtos do mercado
          </p>
          <Button size="lg" className="text-lg">
            Explorar Reviews
          </Button>
        </div>
      </section>

      {/* Articles Grid */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Últimos Reviews</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted" />
                <CardHeader>
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Nenhum review publicado ainda. Volte em breve!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link key={article.id} to={`/review/${article.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                  {(article.thumbnail || article.cover_image) && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.thumbnail || article.cover_image}
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {article.categories && (
                        <Badge variant="secondary">{article.categories.name}</Badge>
                      )}
                      {article.rating && (
                        <span className="text-sm font-semibold text-primary">
                          ⭐ {article.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;