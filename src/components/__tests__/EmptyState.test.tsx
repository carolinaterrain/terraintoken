import { describe, it, expect, vi } from 'vitest';
import { render } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '../ui/empty-state';
import { FileText } from 'lucide-react';

describe('EmptyState', () => {
  it('renders with title', () => {
    const { getByText } = render(
      <EmptyState title="No items found" />
    );

    expect(getByText('No items found')).toBeInTheDocument();
  });

  it('renders with description', () => {
    const { getByText } = render(
      <EmptyState 
        title="No items" 
        description="Try adding some items to get started" 
      />
    );

    expect(getByText('Try adding some items to get started')).toBeInTheDocument();
  });

  it('renders with custom icon', () => {
    const { container } = render(
      <EmptyState title="No documents" icon={FileText} />
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders action button and handles click', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const { getByRole } = render(
      <EmptyState 
        title="No items" 
        action={{ label: 'Add Item', onClick: handleClick }} 
      />
    );

    const button = getByRole('button', { name: 'Add Item' });
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders compact variant', () => {
    const { container } = render(
      <EmptyState title="No items" compact />
    );

    expect(container.querySelector('.flex.items-center')).toBeInTheDocument();
  });
});
