-- Corrigir a view para não ser SECURITY DEFINER
DROP VIEW IF EXISTS public.public_articles;

-- Recriar view sem SECURITY DEFINER (comportamento padrão SECURITY INVOKER)
CREATE VIEW public.public_articles AS
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

-- Dar permissão pública para ler a view
GRANT SELECT ON public.public_articles TO anon, authenticated;