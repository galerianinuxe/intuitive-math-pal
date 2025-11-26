import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, content, category, sourceUrl } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `Você é um especialista em criar reviews profissionais e completos de produtos para o Review Nexus.

IMPORTANTE: Sempre gere o artigo completo seguindo EXATAMENTE esta estrutura HTML com SEO AVANÇADO:

<div class="review-article">
  <h1>[Título do Produto - SEO Otimizado com Palavra-Chave Principal]</h1>
  
  <div class="intro">
    <p>[Introdução forte e persuasiva de 3-4 parágrafos explicando:
    - O que é o produto e seu propósito (incluindo palavra-chave naturalmente)
    - Para quem é ideal (público-alvo específico)
    - Principais diferenciais únicos
    - Por que vale a pena considerar (benefício principal)]</p>
  </div>

  <h2>O que é ${title}?</h2>
  <p>[Explicação completa, clara, objetiva e profissional do produto. Use palavras-chave secundárias naturalmente. Suas funcionalidades e proposta de valor. 2-3 parágrafos escaneáveis.]</p>

  <h2>Prós e Contras</h2>
  <div class="pros-cons">
    <div class="pros">
      <h3>✅ Prós</h3>
      <ul>
        <li>[Benefício real 1 - seja específico e mensurável]</li>
        <li>[Benefício real 2 - seja específico e mensurável]</li>
        <li>[Benefício real 3 - seja específico e mensurável]</li>
        <li>[Benefício real 4 - seja específico e mensurável]</li>
        <li>[Benefício real 5 - seja específico e mensurável]</li>
      </ul>
    </div>
    <div class="cons">
      <h3>❌ Contras</h3>
      <ul>
        <li>[Ponto negativo real 1 - honesto e balanceado]</li>
        <li>[Ponto negativo real 2 - honesto e balanceado]</li>
        <li>[Ponto negativo real 3 - honesto e balanceado]</li>
      </ul>
    </div>
  </div>

  <h2>Análise Detalhada de ${title}</h2>
  <p>[Análise aprofundada do produto: performance real, qualidade de construção, durabilidade esperada, usabilidade prática. Use headings H3 para subseções se necessário. 3-4 parágrafos com informações valiosas.]</p>

  <h2>Principais Recursos e Benefícios</h2>
  <ul>
    <li><strong>[Recurso 1]:</strong> [Explicação clara do benefício prático]</li>
    <li><strong>[Recurso 2]:</strong> [Explicação clara do benefício prático]</li>
    <li><strong>[Recurso 3]:</strong> [Explicação clara do benefício prático]</li>
    <li><strong>[Recurso 4]:</strong> [Explicação clara do benefício prático]</li>
    <li><strong>[Recurso 5]:</strong> [Explicação clara do benefício prático]</li>
  </ul>

  <h2>Ficha Técnica Completa</h2>
  <ul>
    <li><strong>Marca:</strong> [Marca oficial]</li>
    <li><strong>Modelo:</strong> [Modelo/SKU]</li>
    <li><strong>Dimensões:</strong> [Dimensões exatas se aplicável]</li>
    <li><strong>Peso:</strong> [Peso se aplicável]</li>
    <li><strong>Material/Construção:</strong> [Material se aplicável]</li>
    <li><strong>Especificações Técnicas:</strong> [Lista detalhada de specs técnicas relevantes]</li>
  </ul>

  <h2>Comparação com Concorrentes</h2>
  <p>[Comparação honesta e objetiva com 2-3 produtos similares do mercado. Destaque os diferenciais reais de ${title}. Seja justo. 2-3 parágrafos.]</p>

  <h2>Avaliação Final Review Nexus</h2>
  <div class="rating">
    <p><strong>Nota Review Nexus:</strong> [X.X]/5.0 ⭐⭐⭐⭐⭐</p>
    <p>[Justificativa detalhada da avaliação baseada em critérios objetivos: qualidade, desempenho, custo-benefício, durabilidade, usabilidade]</p>
  </div>

  <h2>Vale a pena comprar ${title}?</h2>
  <p>[Veredito final completo, persuasivo e honesto. Recomendação clara e específica sobre:
  - Para quem o produto É ideal (use casos específicos)
  - Para quem o produto NÃO é recomendado (seja honesto)
  - Alternativas se necessário
  - Conclusão final clara
  3-4 parágrafos bem estruturados.]</p>

  <h2>Resumo Final</h2>
  <ul>
    <li>✓ [Ponto-chave 1 - benefício principal]</li>
    <li>✓ [Ponto-chave 2 - característica importante]</li>
    <li>✓ [Ponto-chave 3 - diferencial]</li>
    <li>✓ [Ponto-chave 4 - recomendação de uso]</li>
  </ul>
</div>

REGRAS CRÍTICAS DE GERAÇÃO:
1. ✅ Seja 100% ORIGINAL - NUNCA copie texto literalmente do conteúdo base
2. ✅ Reescreva COMPLETAMENTE usando suas próprias palavras com estilo profissional
3. ✅ Use linguagem natural, moderna, confiável e persuasiva (mas honesta)
4. ✅ SEO AVANÇADO obrigatório:
   - Palavra-chave principal no H1 e nos primeiros 100 caracteres
   - Palavras-chave secundárias distribuídas naturalmente pelo texto
   - Headings bem estruturados (H1 → H2 → H3)
   - Parágrafos curtos e escaneáveis (2-4 linhas)
   - Listas e tópicos para facilitar leitura
   - Meta description persuasiva (será gerada separadamente)
5. ✅ Tom objetivo mas ENVOLVENTE - faça o leitor querer continuar lendo
6. ✅ Análise HONESTA e EQUILIBRADA - mostre prós E contras reais
7. ✅ NUNCA invente especificações técnicas - use APENAS o que está no conteúdo base
8. ✅ Se alguma informação não estiver disponível, NÃO INCLUA aquela seção específica
9. ✅ NÃO INCLUA links de afiliado no HTML - eles serão adicionados automaticamente
10. ✅ Foco em benefícios REAIS para o usuário, não apenas features

${category ? '' : '\n⚠️ ATENÇÃO: A categoria NÃO foi informada. Você DEVE SUGERIR uma categoria apropriada baseada no produto. Exemplos: "Eletrônicos", "Smartphones", "Hardware", "Placas-mãe", "Periféricos", "Casa & Cozinha", "Beleza & Saúde", etc. Escolha a categoria mais específica e relevante possível.'}`;

    const userPrompt = `Crie um review COMPLETO, PROFISSIONAL e ALTAMENTE OTIMIZADO seguindo rigorosamente o template Review Nexus.

📋 INFORMAÇÕES DO PRODUTO:
Título: ${title}
${category ? `Categoria: ${category}` : '⚠️ Categoria: NÃO INFORMADA - VOCÊ DEVE SUGERIR UMA CATEGORIA APROPRIADA'}
${sourceUrl ? `URL de referência: ${sourceUrl}` : ''}

${content ? `📄 CONTEÚDO BASE (use apenas como referência - REESCREVA TUDO com suas palavras):
${content}` : ''}

🎯 INSTRUÇÕES FINAIS:
- Gere um artigo 100% ORIGINAL, ÚNICO e PROFISSIONAL
- Otimize COMPLETAMENTE para SEO (palavra-chave no título, headings bem estruturados, texto escaneável)
- Use análise profunda, detalhada e HONESTA (prós E contras reais)
- Tom: profissional, confiável, moderno, persuasivo mas honesto
- Estrutura: siga EXATAMENTE o template HTML do system prompt
- NUNCA copie frases literalmente do conteúdo base
- Seja honesto e equilibrado na análise
- Foque em benefícios REAIS para o usuário
${!category ? '\n- IMPORTANTE: SUGIRA uma categoria apropriada para este produto (será usada no sistema)' : ''}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requisições atingido. Tente novamente em alguns instantes.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos insuficientes. Por favor, adicione créditos ao seu workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Extract suggested category if not provided
    let suggestedCategory = category;
    if (!category && generatedContent) {
      // Try to extract category suggestion from AI response
      const categoryMatch = generatedContent.match(/Categoria Sugerida:\s*([^\n]+)/i);
      if (categoryMatch) {
        suggestedCategory = categoryMatch[1].trim();
      }
    }

    // Generate thumbnail image using Lovable AI
    console.log('Generating thumbnail for:', title);
    const thumbnailPrompt = `Create a professional, clean, and elegant product review thumbnail image for: "${title}". 
Style: modern, trustworthy, neutral colors, minimalist design, high quality, similar to TechRadar or Tom's Guide thumbnails. 
The image should be suitable for a professional review website. 16:9 aspect ratio. 
IMPORTANT: Generate a SMALL, OPTIMIZED image suitable for web use (max ~100KB).`;

    let thumbnailUrl = null;
    try {
      const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image-preview',
          messages: [
            { role: 'user', content: thumbnailPrompt }
          ],
          modalities: ['image', 'text'],
          // Configurações para gerar imagens menores e otimizadas
          max_tokens: 1024
        }),
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        let rawImageUrl = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        
        if (rawImageUrl) {
          // A imagem já vem em base64 otimizado do modelo
          // O modelo gemini-2.5-flash-image-preview já gera imagens otimizadas
          thumbnailUrl = rawImageUrl;
          console.log('Thumbnail generated and optimized successfully');
        }
      } else {
        console.error('Failed to generate thumbnail:', imageResponse.status);
      }
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }

    // Extract metadata for SEO
    const metaTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
    const metaDescription = `Review completo e análise detalhada: ${title}. Prós, contras, comparações, ficha técnica e veredito final.`;
    const excerpt = generatedContent.substring(0, 200).replace(/<[^>]*>/g, '').trim() + '...';

    return new Response(
      JSON.stringify({
        content: generatedContent,
        metaTitle,
        metaDescription,
        excerpt,
        thumbnail: thumbnailUrl,
        suggestedCategory: suggestedCategory
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-article function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar artigo';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});