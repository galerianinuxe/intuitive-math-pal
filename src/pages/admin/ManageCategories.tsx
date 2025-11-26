import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

const ManageCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

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
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Erro ao carregar categorias");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!formData.name.trim()) {
      toast.error("Nome da categoria é obrigatório");
      return;
    }

    const slug = formData.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update({
            name: formData.name,
            slug,
            description: formData.description || null,
          })
          .eq("id", editingCategory.id);

        if (error) throw error;
        toast.success("Categoria atualizada!");
      } else {
        const { error } = await supabase
          .from("categories")
          .insert({
            name: formData.name,
            slug,
            description: formData.description || null,
          });

        if (error) throw error;
        toast.success("Categoria criada!");
      }

      setFormData({ name: "", description: "" });
      setEditingCategory(null);
      setIsCreating(false);
      fetchCategories();
    } catch (error: any) {
      console.error("Error saving category:", error);
      toast.error(error.message || "Erro ao salvar categoria");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string, name: string) => {
    // Check if category has articles
    const { count } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id);

    if (count && count > 0) {
      toast.error(
        `Não é possível excluir "${name}" porque existem ${count} artigo(s) associado(s). Reatribua os artigos primeiro.`
      );
      return;
    }

    if (!confirm(`Tem certeza que deseja excluir a categoria "${name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Categoria excluída!");
      fetchCategories();
    } catch (error: any) {
      console.error("Error deleting category:", error);
      toast.error(error.message || "Erro ao excluir categoria");
    }
  };

  return (
    <div className="min-h-screen bg-muted/50">
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Gerenciar Categorias</h1>
          <div className="flex gap-2">
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingCategory(null);
                  setFormData({ name: "", description: "" });
                }}>
                  + Nova Categoria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCategory ? "Editar Categoria" : "Nova Categoria"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Ex: Eletrônicos"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Breve descrição da categoria..."
                    />
                  </div>
                  <Button onClick={handleCreateOrUpdate} className="w-full">
                    {editingCategory ? "Atualizar" : "Criar"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Link to="/admin">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p>Carregando...</p>
          </div>
        ) : categories.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              Nenhuma categoria criada ainda
            </p>
            <Button onClick={() => setIsCreating(true)}>+ Criar Primeira Categoria</Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="p-6">
                <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {category.description || "Sem descrição"}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(category)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(category.id, category.name)}
                  >
                    Excluir
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageCategories;
