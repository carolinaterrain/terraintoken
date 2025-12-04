import { describe, it, expect, vi } from 'vitest';
import { render } from '@/test/test-utils';
import Index from '@/pages/Index';

// Mock heavy components to speed up tests
vi.mock('@/components/Hero', () => ({
  default: () => <div data-testid="hero-section">Hero Section</div>,
}));

vi.mock('@/components/TokenStats', () => ({
  default: () => <div data-testid="token-stats">Token Stats</div>,
}));

vi.mock('@/components/About', () => ({
  default: () => <div data-testid="about-section">About Section</div>,
}));

vi.mock('@/components/RealUtility', () => ({
  default: () => <div data-testid="real-utility">Real Utility</div>,
}));

vi.mock('@/components/Tokenomics', () => ({
  default: () => <div data-testid="tokenomics">Tokenomics</div>,
}));

vi.mock('@/components/HowToBuy', () => ({
  default: () => <div data-testid="how-to-buy">How To Buy</div>,
}));

vi.mock('@/components/Roadmap', () => ({
  default: () => <div data-testid="roadmap">Roadmap</div>,
}));

vi.mock('@/components/MascotLore', () => ({
  default: () => <div data-testid="mascot-lore">Mascot Lore</div>,
}));

vi.mock('@/components/FAQ', () => ({
  default: () => <div data-testid="faq">FAQ</div>,
}));

vi.mock('@/components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

describe('Index Page', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<Index />);
    expect(getByTestId('hero-section')).toBeInTheDocument();
  });

  it('renders all major sections', () => {
    const { getByTestId } = render(<Index />);
    
    expect(getByTestId('hero-section')).toBeInTheDocument();
    expect(getByTestId('token-stats')).toBeInTheDocument();
    expect(getByTestId('about-section')).toBeInTheDocument();
    expect(getByTestId('real-utility')).toBeInTheDocument();
    expect(getByTestId('tokenomics')).toBeInTheDocument();
    expect(getByTestId('how-to-buy')).toBeInTheDocument();
    expect(getByTestId('roadmap')).toBeInTheDocument();
    expect(getByTestId('faq')).toBeInTheDocument();
    expect(getByTestId('footer')).toBeInTheDocument();
  });

  it('has correct page structure for SEO', () => {
    render(<Index />);
    
    // Main content wrapper should exist
    const main = document.querySelector('main');
    expect(main).toBeInTheDocument();
  });
});
