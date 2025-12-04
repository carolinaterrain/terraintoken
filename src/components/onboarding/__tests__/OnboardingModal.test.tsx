import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { OnboardingModal } from '../OnboardingModal';

// Mock useOnboarding hook
const mockNextStep = vi.fn();
const mockCompleteOnboarding = vi.fn();
const mockSkipOnboarding = vi.fn();

vi.mock('@/hooks/useOnboarding', () => ({
  useOnboarding: () => ({
    showOnboarding: true,
    currentStep: 0,
    nextStep: mockNextStep,
    completeOnboarding: mockCompleteOnboarding,
    skipOnboarding: mockSkipOnboarding,
    totalSteps: 4,
  }),
}));

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('OnboardingModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders first step correctly', () => {
    const { getByText } = render(<OnboardingModal />);

    expect(getByText(/welcome to terrain/i)).toBeInTheDocument();
  });

  it('renders step indicator', () => {
    const { getByText } = render(<OnboardingModal />);

    expect(getByText(/step 1 of 4/i)).toBeInTheDocument();
  });

  it('calls nextStep when clicking Next', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<OnboardingModal />);

    const nextButton = getByRole('button', { name: /next/i });
    await user.click(nextButton);

    expect(mockNextStep).toHaveBeenCalledTimes(1);
  });

  it('shows skip button', () => {
    const { getByText } = render(<OnboardingModal />);

    expect(getByText(/skip tour/i)).toBeInTheDocument();
  });

  it('calls skipOnboarding when clicking skip', async () => {
    const user = userEvent.setup();
    const { getByText } = render(<OnboardingModal />);

    const skipButton = getByText(/skip tour/i);
    await user.click(skipButton);

    expect(mockSkipOnboarding).toHaveBeenCalledTimes(1);
  });

  it('has skip icon button in header', async () => {
    const user = userEvent.setup();
    const { getByLabelText } = render(<OnboardingModal />);

    const skipIcon = getByLabelText(/skip onboarding/i);
    await user.click(skipIcon);

    expect(mockSkipOnboarding).toHaveBeenCalled();
  });
});
