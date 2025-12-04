import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render } from '@/test/test-utils';
import ErrorBoundary from '@/components/ErrorBoundary';

// Mock the error reporting module
vi.mock('@/lib/errorReporting', () => ({
  reportError: vi.fn(),
}));

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console.error for cleaner test output
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>Test content</div>
      </ErrorBoundary>
    );

    expect(getByText('Test content')).toBeInTheDocument();
  });

  it('renders error UI when error occurs', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const { getByText } = render(
      <ErrorBoundary fallback={<div>Custom error UI</div>}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Custom error UI')).toBeInTheDocument();
  });

  it('shows Try Again button', () => {
    const { getByRole } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('shows Go Home button', () => {
    const { getByRole } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByRole('button', { name: /go home/i })).toBeInTheDocument();
  });
});
