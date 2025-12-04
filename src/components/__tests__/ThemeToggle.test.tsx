import { describe, it, expect, vi } from 'vitest';
import { render } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '../ThemeToggle';
import { TooltipProvider } from '@/components/ui/tooltip';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'dark',
    setTheme: vi.fn(),
    resolvedTheme: 'dark',
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('ThemeToggle', () => {
  it('renders theme toggle button', async () => {
    const { getByRole } = render(
      <TooltipProvider>
        <ThemeToggle />
      </TooltipProvider>
    );
    
    // Wait for mount
    await vi.waitFor(() => {
      const button = getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  it('has proper accessibility label', async () => {
    const { getByLabelText } = render(
      <TooltipProvider>
        <ThemeToggle />
      </TooltipProvider>
    );
    
    await vi.waitFor(() => {
      const button = getByLabelText(/switch to/i);
      expect(button).toBeInTheDocument();
    });
  });
});
