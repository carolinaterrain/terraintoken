import { supabase } from "@/integrations/supabase/client";

type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

interface ErrorContext {
  componentName?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

interface UserContext {
  userId?: string;
  email?: string;
  walletAddress?: string;
}

// Store user context for error reporting
let userContext: UserContext = {};

// Generate a fingerprint for grouping similar errors
function generateFingerprint(error: Error): string {
  const message = error.message.slice(0, 100);
  const stack = error.stack?.split('\n')[1]?.trim() || '';
  return btoa(`${message}:${stack}`).slice(0, 32);
}

// Get or create session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('error_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('error_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Set user context for error reporting
 */
export function setUserContext(context: UserContext): void {
  userContext = { ...userContext, ...context };
}

/**
 * Clear user context (on logout)
 */
export function clearUserContext(): void {
  userContext = {};
}

/**
 * Report an error to the database
 */
export async function reportError(
  error: Error,
  context?: ErrorContext,
  severity: ErrorSeverity = 'error'
): Promise<void> {
  // Don't report in development unless it's critical
  if (import.meta.env.DEV && severity !== 'critical') {
    console.error('[Dev Error]', error, context);
    return;
  }

  try {
    const errorData = {
      error_message: error.message,
      stack_trace: error.stack,
      error_fingerprint: generateFingerprint(error),
      user_agent: navigator.userAgent,
      page_url: window.location.href,
      user_id: userContext.userId || context?.userId || null,
      session_id: context?.sessionId || getSessionId(),
      severity,
      metadata: {
        componentName: context?.componentName,
        action: context?.action,
        walletAddress: userContext.walletAddress,
        ...context?.metadata,
        timestamp: new Date().toISOString(),
        errorName: error.name,
      },
    };

    const { error: dbError } = await supabase
      .from('error_logs')
      .insert(errorData);

    if (dbError) {
      console.error('Failed to report error to database:', dbError);
    }

    // For critical errors, also log to console
    if (severity === 'critical') {
      console.error('[CRITICAL ERROR]', error, context);
    }
  } catch (e) {
    // Silently fail - don't create infinite error loops
    console.error('Error reporting failed:', e);
  }
}

/**
 * Report a warning
 */
export async function reportWarning(
  message: string,
  context?: ErrorContext
): Promise<void> {
  const error = new Error(message);
  await reportError(error, context, 'warning');
}

/**
 * Report an info event
 */
export async function reportInfo(
  message: string,
  context?: ErrorContext
): Promise<void> {
  const error = new Error(message);
  await reportError(error, context, 'info');
}

/**
 * Wrap an async function with error reporting
 */
export function withErrorReporting<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context?: Omit<ErrorContext, 'action'>
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof Error) {
        await reportError(error, {
          ...context,
          action: fn.name || 'anonymous function',
        });
      }
      throw error;
    }
  }) as T;
}
