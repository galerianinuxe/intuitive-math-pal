import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
}

const CreateArticle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sourceContent, setSourceContent] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedThumbnail, setGeneratedThumbnail] = useState("");
  const [rating, setRating] = useState("4.5");
  const [affiliateLinks, setAffiliateLinks] = useState<{ store_name: string; url: string }[]>([]);

  useEffect(() => {
    checkAuth();
    fetchCategories();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    
    if (data) setCategories(data);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error("Por favor, insira um título");
      return;
    }

    setGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-article", {
        body: {
          title,
          content: sourceContent,
          category: categories.find(c => c.id === categoryId)?.name || "",
          sourceUrl,
        },
      });

      if (error) throw error;

      setGeneratedContent(data.content);
      if (data.thumbnail) {
        setGeneratedThumbnail(data.thumbnail);
      }
      if (data.suggestedCategory && !categoryId) {
        toast.info(`Categoria sugerida: ${data.suggestedCategory}`);
      }
      toast.success("Artigo e thumbnail gerados com sucesso!");
    } catch (error: any) {
      console.error("Error generating article:", error);
      toast.error(error.message || "Erro ao gerar artigo");
    } finally {
      setGenerating(false);
    }
  };

  const handlePreview = () => {
    if (!generatedContent) {
      toast.error("Gere o artigo primeiro");
      return;
    }

    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Preview - ${title}</title>
            <style>
              body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 20px; }
              h1 { font-size: 2.5rem; margin-bottom: 1rem; }
              h2 { font-size: 1.8rem; margin-top: 2rem; margin-bottom: 1rem; }
              h3 { font-size: 1.3rem; margin-top: 1.5rem; }
              p { line-height: 1.6; margin-bottom: 1rem; }
              ul { margin-left: 2rem; }
            </style>
          </head>
          <body>
            ${generatedContent}
          </body>
        </html>
      `);
      previewWindow.document.close();
    }
  };

  const handlePublish = async () => {
    if (!title || !generatedContent) {
      toast.error("Título e conteúdo são obrigatórios");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Usuário não autenticado");

      const slug = generateSlug(title);
      const excerpt = generatedContent.substring(0, 200).replace(/<[^>]*>/g, '') + '...';

      const { error } = await supabase.from("articles").insert({
        title,
        slug,
        category_id: categoryId || null,
        content_html: generatedContent,
        excerpt,
        rating: parseFloat(rating),
        status: "published",
        author_id: user.id,
        published_at: new Date().toISOString(),
        meta_title: title,
        meta_description: excerpt,
        thumbnail: generatedThumbnail || null,
        affiliate_links: affiliateLinks.filter(link => link.store_name.trim() !== '' && link.url.trim() !== ''),
      });

      if (error) throw error;

      toast.success("Artigo publicado com sucesso!");
      navigate("/admin");
    } catch (error: any) {
      console.error("Error publishing article:", error);
      toast.error(error.message || "Erro ao publicar artigo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/50">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Criar Novo Artigo</h1>
          <Link to="/admin">
            <Button variant="outline">Voltar ao Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações do Artigo</CardTitle>
            <CardDescription>
              Preencha os campos abaixo e clique em "Gerar Artigo com IA"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Produto/Review *</Label>
              <Input
                id="title"
                placeholder="Ex: iPhone 15 Pro Max - Review Completo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sourceUrl">URL de Referência (opcional)</Label>
              <Input
                id="sourceUrl"
                type="url"
                placeholder="https://exemplo.com/artigo-original"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sourceContent">Conteúdo Base (opcional)</Label>
              <Textarea
                id="sourceContent"
                placeholder="Cole aqui textos longos como transcrições de vídeo, artigos, análises técnicas, etc. Este conteúdo será usado apenas como referência - a IA irá reescrever tudo do zero no padrão Review Nexus."
                rows={12}
                value={sourceContent}
                onChange={(e) => setSourceContent(e.target.value)}
                className="min-h-[300px]"
              />
              <p className="text-xs text-muted-foreground">
                ⚠️ Este texto é APENAS REFERÊNCIA. A IA criará um artigo completamente novo seguindo o modelo Review Nexus.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Avaliação (0-5)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Links de Afiliado deste Artigo</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAffiliateLinks([...affiliateLinks, { store_name: "", url: "" }])}
                >
                  + Adicionar Link de Afiliado
                </Button>
              </div>
              
              <div className="space-y-3">
                {affiliateLinks.map((link, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <div className="flex-1 space-y-2">
                            <Label htmlFor={`store-${index}`}>Nome da Loja</Label>
                            <Input
                              id={`store-${index}`}
                              placeholder="Ex: Amazon, Mercado Livre, Shopee, Kabum"
                              value={link.store_name}
                              onChange={(e) => {
                                const newLinks = [...affiliateLinks];
                                newLinks[index].store_name = e.target.value;
                                setAffiliateLinks(newLinks);
                              }}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="mt-8"
                            onClick={() => {
                              const newLinks = affiliateLinks.filter((_, i) => i !== index);
                              setAffiliateLinks(newLinks);
                            }}
                          >
                            ×
                          </Button>
                        </div>
                        <div>
                          <Label htmlFor={`url-${index}`}>URL de Afiliado da Loja</Label>
                          <Input
                            id={`url-${index}`}
                            type="url"
                            placeholder="https://exemplo.com/produto?tag=seu-id"
                            value={link.url}
                            onChange={(e) => {
                              const newLinks = [...affiliateLinks];
                              newLinks[index].url = e.target.value;
                              setAffiliateLinks(newLinks);
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {affiliateLinks.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhum link adicionado. Clique em "Adicionar Link de Afiliado" para incluir links de diferentes lojas (Amazon, Mercado Livre, Shopee, Kabum, etc.)
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleGenerate}
                disabled={generating || !title}
                className="flex-1"
              >
                {generating ? "Gerando..." : "🤖 Gerar Artigo com IA"}
              </Button>
              
              {generatedContent && (
                <>
                  <Button
                    variant="outline"
                    onClick={handlePreview}
                  >
                    👁️ Preview
                  </Button>
                  <Button
                    onClick={handlePublish}
                    disabled={loading}
                    variant="default"
                  >
                    {loading ? "Publicando..." : "✅ Publicar"}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {generatedContent && (
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo Gerado</CardTitle>
              <CardDescription>
                Revise o conteúdo gerado pela IA antes de publicar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="review-article bg-background p-6 rounded-lg border"
                dangerouslySetInnerHTML={{ __html: generatedContent }}
              />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default CreateArticle;