import { describe, it, expect, vi } from 'vitest';
import { render } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { ErrorState } from '../ui/error-state';

describe('ErrorState', () => {
  it('renders with default title and message', () => {
    const { getByText } = render(<ErrorState />);

    expect(getByText('Something went wrong')).toBeInTheDocument();
    expect(getByText("We couldn't load this content. Please try again.")).toBeInTheDocument();
  });

  it('renders with custom title and message', () => {
    const { getByText } = render(
      <ErrorState 
        title="Network Error" 
        message="Please check your connection" 
      />
    );

    expect(getByText('Network Error')).toBeInTheDocument();
    expect(getByText('Please check your connection')).toBeInTheDocument();
  });

  it('renders retry button and handles click', async () => {
    const user = userEvent.setup();
    const handleRetry = vi.fn();
    const { getByRole } = render(
      <ErrorState onRetry={handleRetry} />
    );

    const button = getByRole('button', { name: /try again/i });
    await user.click(button);
    
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('renders without retry button when onRetry not provided', () => {
    const { queryByRole } = render(<ErrorState />);

    expect(queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders compact variant', () => {
    const { container, getByText } = render(
      <ErrorState 
        title="Load failed" 
        message="Try again later"
        compact 
      />
    );

    expect(container.querySelector('.flex.items-center')).toBeInTheDocument();
    expect(getByText('Load failed')).toBeInTheDocument();
  });
});
