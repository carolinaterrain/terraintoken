import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

interface ErrorContext {
  functionName: string;
  action?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log an error to the error_logs table
 */
export async function logError(
  context: ErrorContext,
  error: Error | string,
  severity: ErrorSeverity = 'error'
): Promise<void> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials for error logging');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const errorMessage = error instanceof Error ? error.message : error;
  const stackTrace = error instanceof Error ? error.stack : undefined;

  try {
    await supabase.from('error_logs').insert({
      error_message: errorMessage,
      stack_trace: stackTrace,
      error_fingerprint: generateFingerprint(errorMessage, context.functionName),
      severity,
      metadata: {
        functionName: context.functionName,
        action: context.action,
        userId: context.userId,
        ...context.metadata,
        source: 'edge_function',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (e) {
    console.error('Failed to log error to database:', e);
  }
}

/**
 * Generate a simple fingerprint for grouping errors
 */
function generateFingerprint(message: string, functionName: string): string {
  const combined = `${functionName}:${message.slice(0, 50)}`;
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).slice(0, 16);
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  error: Error | string,
  statusCode: number = 500,
  corsHeaders: Record<string, string> = {}
): Response {
  const message = error instanceof Error ? error.message : error;
  
  return new Response(
    JSON.stringify({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    }),
    {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    }
  );
}

/**
 * Wrap an edge function handler with error logging
 */
export function withErrorHandler(
  functionName: string,
  handler: (req: Request) => Promise<Response>,
  corsHeaders: Record<string, string> = {}
): (req: Request) => Promise<Response> {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      
      // Log the error
      await logError(
        { functionName, action: 'handler' },
        err,
        'error'
      );

      // Return error response
      return createErrorResponse(err, 500, corsHeaders);
    }
  };
}
