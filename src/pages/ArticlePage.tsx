import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface AffiliateLink {
  store_name: string;
  url: string;
}

interface Article {
  id: string;
  title: string;
  content_html: string;
  rating: number;
  published_at: string;
  meta_title: string;
  meta_description: string;
  thumbnail: string | null;
  affiliate_links: AffiliateLink[];
  categories: { name: string; slug: string } | null;
  category_id: string | null;
}

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  rating: number | null;
  thumbnail: string | null;
}

const detectPlatform = (url: string): { name: string; icon: string } => {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('amazon')) {
    return { name: 'Amazon', icon: '🛒' };
  } else if (lowerUrl.includes('mercadolivre') || lowerUrl.includes('mercadolibre')) {
    return { name: 'Mercado Livre', icon: '🛍️' };
  } else if (lowerUrl.includes('shopee')) {
    return { name: 'Shopee', icon: '🛒' };
  } else if (lowerUrl.includes('aliexpress')) {
    return { name: 'AliExpress', icon: '🛒' };
  } else if (lowerUrl.includes('magazineluiza') || lowerUrl.includes('magalu')) {
    return { name: 'Magazine Luiza', icon: '🏪' };
  } else if (lowerUrl.includes('americanas')) {
    return { name: 'Americanas', icon: '🛒' };
  } else if (lowerUrl.includes('casasbahia')) {
    return { name: 'Casas Bahia', icon: '🏠' };
  }
  
  return { name: 'Comprar Agora', icon: '🛒' };
};

const ArticlePage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          id,
          title,
          content_html,
          rating,
          published_at,
          meta_title,
          meta_description,
          thumbnail,
          affiliate_links,
          category_id,
          categories:category_id (name, slug)
        `)
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) throw error;
      
      // Cast affiliate_links from Json to AffiliateLink[]
      const article = {
        ...data,
        affiliate_links: (data.affiliate_links || []) as unknown as AffiliateLink[]
      };
      
      setArticle(article);

      // Fetch related articles from the same category
      if (data.category_id) {
        const { data: related } = await supabase
          .from("articles")
          .select("id, title, slug, rating, thumbnail")
          .eq("category_id", data.category_id)
          .eq("status", "published")
          .neq("id", data.id)
          .order("rating", { ascending: false })
          .limit(5);

        if (related) {
          setRelatedArticles(related);
        }
      }
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 bg-muted rounded w-3/4 mb-4 animate-pulse" />
            <div className="h-6 bg-muted rounded w-1/2 mb-8 animate-pulse" />
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Review não encontrado</h1>
          <p className="text-muted-foreground mb-8">
            O artigo que você está procurando não existe ou foi removido.
          </p>
          <Link to="/">
            <Button>Voltar para Home</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const affiliateLinks = (article.affiliate_links as AffiliateLink[]) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <article className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            {article.categories && (
              <Badge variant="secondary" className="mb-4">
                {article.categories.name}
              </Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {article.title}
            </h1>
            {article.rating && (
              <div className="flex items-center gap-2 text-lg">
                <span className="font-semibold text-primary">
                  ⭐ {article.rating.toFixed(1)}/5.0
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  {new Date(article.published_at).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>

          {article.thumbnail && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={article.thumbnail} 
                alt={article.title}
                className="w-full h-auto"
              />
            </div>
          )}

          <div 
            className="review-article prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: article.content_html }}
          />

          {affiliateLinks.length > 0 && (
            <div className="mt-12 p-8 bg-muted/50 rounded-lg border-2 border-primary/20">
              <h3 className="text-2xl font-bold mb-4 text-center">Onde Comprar com Segurança</h3>
              <p className="text-center text-muted-foreground mb-6">
                Links verificados e confiáveis para sua compra
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {affiliateLinks.map((link, index) => (
                  <Button
                    key={index}
                    asChild
                    size="lg"
                    className="min-w-[200px]"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <span>🛒</span>
                      <span>Comprar na {link.store_name}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {relatedArticles.length > 0 && (
            <div className="mt-12 p-8 bg-primary/5 rounded-lg border-2 border-primary/20">
              <h3 className="text-2xl font-bold mb-4">Compare com outros produtos da mesma categoria</h3>
              <p className="text-muted-foreground mb-6">
                Veja outros reviews da categoria {article.categories?.name}
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedArticles.map((related) => (
                  <Link key={related.id} to={`/review/${related.slug}`}>
                    <div className="p-4 bg-background rounded-lg hover:shadow-md transition-shadow">
                      {related.thumbnail && (
                        <img
                          src={related.thumbnail}
                          alt={related.title}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                      )}
                      <h4 className="font-semibold mb-2 line-clamp-2">{related.title}</h4>
                      {related.rating && (
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            ⭐ {related.rating.toFixed(1)}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ArticlePage;
