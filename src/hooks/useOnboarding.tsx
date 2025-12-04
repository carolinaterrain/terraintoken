import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ONBOARDING_KEY = 'terrain_onboarding_complete';
const SESSION_KEY = 'terrain_session_id';

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

export const useOnboarding = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        // Check localStorage first for quick response
        const localComplete = localStorage.getItem(ONBOARDING_KEY);
        if (localComplete === 'true') {
          setShowOnboarding(false);
          setIsLoading(false);
          return;
        }

        // Check database for existing progress
        const sessionId = getSessionId();
        const { data } = await supabase
          .from('onboarding_progress')
          .select('completed, current_step')
          .eq('session_id', sessionId)
          .maybeSingle();

        if (data?.completed) {
          localStorage.setItem(ONBOARDING_KEY, 'true');
          setShowOnboarding(false);
        } else if (data) {
          setCurrentStep(data.current_step || 0);
          setShowOnboarding(true);
        } else {
          // New visitor - show onboarding after delay
          setTimeout(() => setShowOnboarding(true), 3000);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // On error, check localStorage only
        const localComplete = localStorage.getItem(ONBOARDING_KEY);
        setShowOnboarding(localComplete !== 'true');
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  const startOnboarding = useCallback(async () => {
    const sessionId = getSessionId();
    try {
      await supabase.from('onboarding_progress').upsert({
        session_id: sessionId,
        current_step: 0,
        completed: false,
        completed_steps: [],
        started_at: new Date().toISOString(),
      }, { onConflict: 'session_id' });
    } catch (error) {
      console.error('Error starting onboarding:', error);
    }
    setCurrentStep(0);
    setShowOnboarding(true);
  }, []);

  const nextStep = useCallback(async () => {
    const newStep = currentStep + 1;
    const sessionId = getSessionId();
    
    try {
      await supabase.from('onboarding_progress').upsert({
        session_id: sessionId,
        current_step: newStep,
        completed_steps: Array.from({ length: newStep }, (_, i) => i),
      }, { onConflict: 'session_id' });
    } catch (error) {
      console.error('Error updating onboarding step:', error);
    }
    
    setCurrentStep(newStep);
  }, [currentStep]);

  const completeOnboarding = useCallback(async () => {
    const sessionId = getSessionId();
    
    try {
      await supabase.from('onboarding_progress').upsert({
        session_id: sessionId,
        completed: true,
        completed_at: new Date().toISOString(),
        current_step: 4,
        completed_steps: [0, 1, 2, 3],
      }, { onConflict: 'session_id' });
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
    
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  }, []);

  const skipOnboarding = useCallback(async () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  }, []);

  const resetOnboarding = useCallback(() => {
    localStorage.removeItem(ONBOARDING_KEY);
    setCurrentStep(0);
    setShowOnboarding(true);
  }, []);

  return {
    showOnboarding,
    currentStep,
    isLoading,
    startOnboarding,
    nextStep,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
    totalSteps: 4,
  };
};
