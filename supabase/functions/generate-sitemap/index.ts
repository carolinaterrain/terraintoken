import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // API Key validation for cron job security
    const apiKey = req.headers.get('x-api-key');
    const validApiKey = Deno.env.get('CRON_API_KEY');
    
    if (apiKey !== validApiKey) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - API key required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const baseUrl = 'https://terraintoken.com'; // Update with your actual domain
    
    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/earn', priority: '0.9', changefreq: 'daily' },
      { url: '/transparency', priority: '0.8', changefreq: 'weekly' },
      { url: '/team', priority: '0.7', changefreq: 'monthly' },
      { url: '/whitepaper', priority: '0.8', changefreq: 'monthly' },
      { url: '/updates', priority: '0.8', changefreq: 'weekly' },
      { url: '/video-updates', priority: '0.7', changefreq: 'weekly' },
      { url: '/press-kit', priority: '0.6', changefreq: 'monthly' },
    ];

    // Blog posts
    const blogPosts = [
      { url: '/blog/how-terrain-token-started', priority: '0.7', changefreq: 'monthly' },
      { url: '/blog/why-meme-coins-need-real-world-backing', priority: '0.7', changefreq: 'monthly' },
      { url: '/blog/transparency-report-november-2025', priority: '0.7', changefreq: 'monthly' },
      { url: '/blog/ai-powered-drainage-analysis-future', priority: '0.7', changefreq: 'monthly' },
    ];

    const allPages = [...staticPages, ...blogPosts];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('Error generating sitemap:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

serve(handler);
