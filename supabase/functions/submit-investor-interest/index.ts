import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.83.0';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validation schema
const investorInterestSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address').max(255),
  wallet_address: z.string().optional(),
  investment_tier: z.enum(['supporter', 'partner', 'strategic']),
  investment_range: z.string().min(1),
  reason: z.array(z.string()).default([]),
  is_accredited: z.boolean().default(false),
  nda_accepted: z.boolean(),
  discord_handle: z.string().optional(),
  additional_notes: z.string().max(1000).optional(),
  utm_source: z.string().optional(),
  utm_campaign: z.string().optional(),
});

// Rate limiting helper
async function checkRateLimit(
  supabase: any,
  identifier: string
): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  
  const { count } = await supabase
    .from('investor_interests')
    .select('*', { count: 'exact', head: true })
    .eq('email', identifier)
    .gte('created_at', oneHourAgo);

  return (count || 0) < 3; // Max 3 submissions per hour per email
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse and validate request
    const body = await req.json();
    const validationResult = investorInterestSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed', 
          details: validationResult.error.errors 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = validationResult.data;

    // Check rate limit
    const isAllowed = await checkRateLimit(supabase, data.email);
    if (!isAllowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Strategic tier requires NDA acceptance
    if (data.investment_tier === 'strategic' && !data.nda_accepted) {
      return new Response(
        JSON.stringify({ error: 'Strategic tier requires NDA acceptance' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert into database
    const { data: insertedData, error: insertError } = await supabase
      .from('investor_interests')
      .insert({
        name: data.name,
        email: data.email,
        wallet_address: data.wallet_address,
        investment_tier: data.investment_tier,
        investment_range: data.investment_range,
        reason: data.reason,
        is_accredited: data.is_accredited,
        nda_accepted: data.nda_accepted,
        discord_handle: data.discord_handle,
        additional_notes: data.additional_notes,
        utm_source: data.utm_source,
        utm_campaign: data.utm_campaign,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      
      // Handle duplicate email for same tier
      if (insertError.code === '23505') {
        return new Response(
          JSON.stringify({ error: 'You have already submitted interest for this tier' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw insertError;
    }

    // Send confirmation email
    try {
      await supabase.functions.invoke('send-email', {
        body: {
          to: data.email,
          template: 'investor-confirmation',
          data: {
            name: data.name,
            tier: data.investment_tier,
            range: data.investment_range,
          },
        },
      });
    } catch (emailError) {
      console.error('Email error (non-critical):', emailError);
      // Don't fail the request if email fails
    }

    // Notify admin for strategic tier
    if (data.investment_tier === 'strategic') {
      try {
        await supabase.functions.invoke('send-email', {
          body: {
            to: Deno.env.get('RESEND_FROM_EMAIL'),
            subject: `🚨 Strategic Investor Interest: ${data.name}`,
            template: 'admin-notification',
            data: {
              type: 'strategic_investor',
              name: data.name,
              email: data.email,
              tier: data.investment_tier,
              range: data.investment_range,
              accredited: data.is_accredited,
              wallet: data.wallet_address,
            },
          },
        });
      } catch (notifyError) {
        console.error('Admin notification error (non-critical):', notifyError);
      }
    }

    // Track analytics
    try {
      await supabase.from('analytics_events').insert({
        session_id: crypto.randomUUID(),
        event_name: 'investor_interest_submitted',
        event_properties: {
          tier: data.investment_tier,
          range: data.investment_range,
          is_accredited: data.is_accredited,
        },
      });
    } catch (analyticsError) {
      console.error('Analytics error (non-critical):', analyticsError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Interest submitted successfully',
        data: { id: insertedData.id }
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});