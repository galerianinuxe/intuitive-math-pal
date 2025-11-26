-- 1. Criar tabela de visualizações para analytics
CREATE TABLE IF NOT EXISTS public.article_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  viewed_at timestamp with time zone NOT NULL DEFAULT now(),
  session_id text,
  time_on_page integer DEFAULT 0
);

-- Index para performance
CREATE INDEX IF NOT EXISTS idx_article_views_article_id ON public.article_views(article_id);
CREATE INDEX IF NOT EXISTS idx_article_views_viewed_at ON public.article_views(viewed_at);

-- RLS: Qualquer um pode inserir views (anônimos), apenas admin pode ver
ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert article views"
ON public.article_views
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only authenticated users can view article views"
ON public.article_views
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- 2. Corrigir RLS de categorias - apenas admin pode modificar
-- Remover políticas antigas que permitiam qualquer autenticado
DROP POLICY IF EXISTS "Authenticated users can create categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON public.categories;

-- Novas políticas: apenas admin pode criar/atualizar/deletar
CREATE POLICY "Only admins can create categories"
ON public.categories
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can update categories"
ON public.categories
FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can delete categories"
ON public.categories
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- 3. Modificar RLS de artigos para não expor author_id
-- Criar view pública que não expõe author_id
CREATE OR REPLACE VIEW public.public_articles AS
SELECT 
  id,
  title,
  slug,
  content_html,
  excerpt,
  cover_image,
  thumbnail,
  rating,
  category_id,
  status,
  published_at,
  created_at,
  updated_at,
  meta_title,
  meta_description,
  affiliate_links
FROM public.articles
WHERE status = 'published';

-- 4. Adicionar trigger para updated_at em article_views se necessário
CREATE TRIGGER update_article_views_updated_at
BEFORE UPDATE ON public.article_views
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();