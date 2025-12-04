import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render } from '@/test/test-utils';
import { ChartErrorBoundary } from '@/components/charts/ChartErrorBoundary';

// Component that throws an error
const ThrowError = () => {
  throw new Error('Chart error');
};

describe('ChartErrorBoundary', () => {
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
      <ChartErrorBoundary>
        <div>Chart content</div>
      </ChartErrorBoundary>
    );

    expect(getByText('Chart content')).toBeInTheDocument();
  });

  it('renders error UI when chart fails', () => {
    const { getByText } = render(
      <ChartErrorBoundary chartName="Test Chart">
        <ThrowError />
      </ChartErrorBoundary>
    );

    expect(getByText(/chart failed to load/i)).toBeInTheDocument();
  });

  it('shows chart name in error message', () => {
    const { getByText } = render(
      <ChartErrorBoundary chartName="Revenue Chart">
        <ThrowError />
      </ChartErrorBoundary>
    );

    expect(getByText(/revenue chart/i)).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const { getByText } = render(
      <ChartErrorBoundary fallback={<div>Custom chart error</div>}>
        <ThrowError />
      </ChartErrorBoundary>
    );

    expect(getByText('Custom chart error')).toBeInTheDocument();
  });

  it('shows refresh button', () => {
    const { getByRole } = render(
      <ChartErrorBoundary>
        <ThrowError />
      </ChartErrorBoundary>
    );

    expect(getByRole('button', { name: /refresh/i })).toBeInTheDocument();
  });
});
