import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category_id: "",
    rating: "",
    affiliate_links: "",
    thumbnail: "",
    status: "draft" as "draft" | "published" | "archived",
  });

  useEffect(() => {
    checkAuth();
    fetchCategories();
    fetchArticle();
  }, [id]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");
    
    if (data) setCategories(data);
  };

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title || "",
        content: data.content_html || "",
        category_id: data.category_id || "",
        rating: data.rating?.toString() || "",
        affiliate_links: JSON.stringify(data.affiliate_links || [], null, 2),
        thumbnail: data.thumbnail || "",
        status: data.status || "draft",
      });
    } catch (error: any) {
      console.error("Error fetching article:", error);
      toast.error("Erro ao carregar artigo");
      navigate("/admin/articles");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateWithAI = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Título e conteúdo são necessários para regenerar");
      return;
    }

    setRegenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-article", {
        body: {
          title: formData.title,
          content: formData.content,
          category: categories.find(c => c.id === formData.category_id)?.name || "",
        },
      });

      if (error) throw error;

      setFormData(prev => ({
        ...prev,
        content: data.content || prev.content,
        thumbnail: data.thumbnail || prev.thumbnail,
      }));

      toast.success("Conteúdo regenerado com IA!");
    } catch (error: any) {
      console.error("Error regenerating:", error);
      toast.error(error.message || "Erro ao regenerar conteúdo");
    } finally {
      setRegenerating(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Título e conteúdo são obrigatórios");
      return;
    }

    setSaving(true);
    try {
      let affiliateLinks = [];
      if (formData.affiliate_links.trim()) {
        try {
          affiliateLinks = JSON.parse(formData.affiliate_links);
        } catch {
          toast.error("Links de afiliado devem ser um JSON válido");
          setSaving(false);
          return;
        }
      }

      const slug = formData.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const updateData: any = {
        title: formData.title,
        slug,
        content_html: formData.content,
        category_id: formData.category_id || null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        affiliate_links: affiliateLinks,
        thumbnail: formData.thumbnail || null,
        status: formData.status,
        updated_at: new Date().toISOString(),
      };

      if (formData.status === "published" && !formData.thumbnail) {
        updateData.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("articles")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast.success("Artigo atualizado com sucesso!");
      navigate("/admin/articles");
    } catch (error: any) {
      console.error("Error updating article:", error);
      toast.error(error.message || "Erro ao atualizar artigo");
    } finally {
      setSaving(false);
    }
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
          <h1 className="text-2xl font-bold">Editar Artigo</h1>
          <div className="flex gap-2">
            <Link to="/admin/articles">
              <Button variant="outline">Cancelar</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-6 space-y-6">
          <div>
            <Label htmlFor="title">Título do Produto/Review *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: iPhone 15 Pro Max"
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData({ ...formData, category_id: value })}
            >
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

          <div>
            <Label htmlFor="rating">Avaliação (0-5)</Label>
            <Input
              id="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              placeholder="4.5"
            />
          </div>

          <div>
            <Label htmlFor="content">Conteúdo HTML *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="min-h-[300px] font-mono text-sm"
              placeholder="<div>...</div>"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={handleRegenerateWithAI}
              disabled={regenerating}
            >
              {regenerating ? "Regenerando..." : "🤖 Regenerar com IA"}
            </Button>
          </div>

          <div>
            <Label htmlFor="thumbnail">URL da Thumbnail</Label>
            <Input
              id="thumbnail"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="https://... ou data:image/..."
            />
          </div>

          <div>
            <Label htmlFor="affiliate_links">Links de Afiliado (JSON)</Label>
            <Textarea
              id="affiliate_links"
              value={formData.affiliate_links}
              onChange={(e) => setFormData({ ...formData, affiliate_links: e.target.value })}
              className="font-mono text-sm"
              placeholder='[{"name": "Amazon", "url": "https://..."}]'
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "draft" | "published" | "archived") =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
            <Link to="/admin/articles" className="flex-1">
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default EditArticle;
