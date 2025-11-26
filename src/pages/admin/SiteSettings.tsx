import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const SiteSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    site_name: "",
    site_description: "",
    site_logo: "",
  });

  useEffect(() => {
    checkAuth();
    fetchSettings();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setSettings({
          site_name: data.site_name || "",
          site_description: data.site_description || "",
          site_logo: data.site_logo || "",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from("settings")
        .select("id")
        .limit(1)
        .single();

      if (existing) {
        const { error } = await supabase
          .from("settings")
          .update(settings)
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("settings")
          .insert(settings);

        if (error) throw error;
      }

      toast.success("Configurações salvas com sucesso!");
    } catch (error: any) {
      console.error("Error saving settings:", error);
      toast.error(error.message || "Erro ao salvar configurações");
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
          <h1 className="text-2xl font-bold">Configurações do Site</h1>
          <Link to="/admin">
            <Button variant="outline">Voltar ao Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="site_name">Nome do Site</Label>
              <Input
                id="site_name"
                value={settings.site_name}
                onChange={(e) =>
                  setSettings({ ...settings, site_name: e.target.value })
                }
                placeholder="Review Nexus"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Usado no título global e no logo textual
              </p>
            </div>

            <div>
              <Label htmlFor="site_description">Descrição do Site</Label>
              <Textarea
                id="site_description"
                value={settings.site_description}
                onChange={(e) =>
                  setSettings({ ...settings, site_description: e.target.value })
                }
                placeholder="Reviews profissionais e confiáveis de produtos..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Usado no SEO global (meta description)
              </p>
            </div>

            <div>
              <Label htmlFor="site_logo">URL do Logotipo</Label>
              <Input
                id="site_logo"
                value={settings.site_logo}
                onChange={(e) =>
                  setSettings({ ...settings, site_logo: e.target.value })
                }
                placeholder="https://... ou data:image/..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Logotipo exibido no header (deixe vazio para usar texto)
              </p>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SiteSettings;
