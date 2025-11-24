import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { checkRateLimit, getClientIP } from '../_shared/rate-limit.ts';

// Helius API response validation
const heliusResponseSchema = z.object({
  result: z.array(z.object({
    owner: z.string(),
    amount: z.number(),
  }))
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    // Rate limiting
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const clientIP = getClientIP(req);
    
    const rateLimitResult = await checkRateLimit(clientIP, {
      endpoint: 'fetch-holder-data',
      windowMs: 3600000, // 1 hour
      maxRequests: 60
    }, SUPABASE_URL, SUPABASE_KEY);
    
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter 
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': rateLimitResult.retryAfter?.toString() || '3600'
          } 
        }
      );
    }

    const HELIUS_API_KEY = Deno.env.get('HELIUS_API_KEY');
    const TRN_MINT_ADDRESS = 'GwXzGeZFF4jK1PqzVd17MHioY7pqSET7r6UY7RS1pump';

    console.log('Fetching TRN holder data from Helius...');

    const response = await fetch(
      `https://api.helius.xyz/v0/addresses/${TRN_MINT_ADDRESS}/holders`,
      {
        headers: {
          'Authorization': `Bearer ${HELIUS_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Helius API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Validate response structure
    const validation = heliusResponseSchema.safeParse(data);
    if (!validation.success) {
      console.error('Invalid Helius API response:', validation.error);
      throw new Error('Invalid API response format');
    }
    
    const holderData = validation.data.result || [];

    const holders = holderData
      .filter((h: any) => h.amount >= 1)
      .map((h: any) => ({
        address: h.owner,
        balance: h.amount,
      }));

    console.log(`Successfully fetched ${holders.length} holders`);

    // Calculate distribution
    const tiers = {
      shrimp: 0,
      crab: 0,
      fish: 0,
      dolphin: 0,
      shark: 0,
      whale: 0,
      humpback: 0,
    };

    holders.forEach((holder: any) => {
      const balance = holder.balance;
      if (balance < 10000) tiers.shrimp++;
      else if (balance < 100000) tiers.crab++;
      else if (balance < 500000) tiers.fish++;
      else if (balance < 1000000) tiers.dolphin++;
      else if (balance < 5000000) tiers.shark++;
      else if (balance < 10000000) tiers.whale++;
      else tiers.humpback++;
    });

    const totalSupply = holders.reduce((sum: number, h: any) => sum + h.balance, 0);
    const sortedHolders = [...holders].sort((a: any, b: any) => b.balance - a.balance);
    const top10Sum = sortedHolders.slice(0, 10).reduce((sum: number, h: any) => sum + h.balance, 0);
    const top10Percentage = (top10Sum / totalSupply) * 100;

    return new Response(
      JSON.stringify({
        totalHolders: holders.length,
        tiers,
        top10Percentage,
        holders: holders.slice(0, 50), // Return top 50 for debugging
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching holder data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Return fallback data
    return new Response(
      JSON.stringify({
        totalHolders: 1137,
        tiers: {
          shrimp: 450,
          crab: 320,
          fish: 200,
          dolphin: 100,
          shark: 45,
          whale: 18,
          humpback: 4,
        },
        top10Percentage: 32.5,
        error: errorMessage,
        fallback: true,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
