// Lightweight sound effects using Web Audio API
// All sounds generated programmatically - no audio files needed

type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

// Global volume control (0-1)
let globalVolume = 0.3;

// Shared AudioContext instance (lazy initialization)
let audioContext: AudioContext | null = null;
let isAudioResumed = false;

export const setGlobalSoundVolume = (volume: number) => {
  globalVolume = Math.max(0, Math.min(1, volume));
};

// Check if user prefers reduced motion (also applies to sounds)
const prefersReducedMotion = () => {
  return typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Get or create AudioContext (lazy initialization)
const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined' || !window.AudioContext) {
    return null;
  }
  
  if (!audioContext) {
    try {
      audioContext = new AudioContext();
    } catch (error) {
      console.warn('Failed to create AudioContext:', error);
      return null;
    }
  }
  
  return audioContext;
};

// Resume AudioContext after user gesture
const resumeAudioContext = async (): Promise<boolean> => {
  const ctx = getAudioContext();
  if (!ctx) return false;
  
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
      isAudioResumed = true;
      return true;
    } catch (error) {
      console.warn('Failed to resume AudioContext:', error);
      return false;
    }
  }
  
  isAudioResumed = ctx.state === 'running';
  return isAudioResumed;
};

// Setup user interaction listeners to resume audio (runs once)
if (typeof document !== 'undefined') {
  const handleUserInteraction = () => {
    resumeAudioContext();
  };
  
  // Listen for first user interaction
  document.addEventListener('click', handleUserInteraction, { once: true, passive: true });
  document.addEventListener('touchstart', handleUserInteraction, { once: true, passive: true });
  document.addEventListener('keydown', handleUserInteraction, { once: true, passive: true });
}

// Create a simple tone
function createTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
  return () => {
    if (prefersReducedMotion()) return;
    
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;
    
    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      
      // Fade in/out to prevent clicks
      const volume = globalVolume * 0.15; // Keep sounds subtle
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
      
      // Clean up oscillator after it stops
      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    } catch (error) {
      console.warn('Sound effect failed:', error);
    }
  };
}

// Create a chord (multiple tones)
function createChord(frequencies: number[], duration: number) {
  return () => {
    frequencies.forEach(freq => {
      createTone(freq, duration)();
    });
  };
}

// Create a sequence (notes played in order)
function createSequence(frequencies: number[], noteDuration: number) {
  return () => {
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        createTone(freq, noteDuration)();
      }, index * noteDuration * 1000);
    });
  };
}

// Sound Effects Library
export const SoundEffects = {
  // UI Interactions
  buttonClick: createTone(880, 0.05, 'sine'),
  buttonHover: createTone(440, 0.03, 'sine'),
  
  // Navigation
  pageTransition: createTone(523, 0.15, 'triangle'),
  scrollSection: createTone(659, 0.08, 'sine'),
  pageWhoosh: createTone(440, 0.2, 'triangle'),
  
  // Token Interactions
  coinClink: createTone(1046, 0.1, 'triangle'),
  tokenEarn: createChord([523, 659, 784], 0.2),
  priceUpdate: createTone(987, 0.08, 'sine'),
  
  // Success/Error
  success: createChord([523, 659, 784], 0.3),
  error: createTone(220, 0.2, 'sawtooth'),
  formSuccess: createChord([659, 784, 988], 0.25),
  formError: createTone(185, 0.25, 'sawtooth'),
  
  // Easter Eggs
  secretFound: createChord([880, 1046, 1318], 0.4),
  achievement: createSequence([523, 659, 784, 1046], 0.1),
  vibeMode: createSequence([523, 659, 784, 1046, 1318], 0.08),
};

// Utility: Play sound with optional delay
export const playSound = (sound: () => void, delay = 0) => {
  if (delay > 0) {
    setTimeout(sound, delay);
  } else {
    sound();
  }
};

// Utility: Check if audio is ready
export const isAudioReady = (): boolean => {
  const ctx = getAudioContext();
  return ctx !== null && ctx.state === 'running';
};

// Utility: Manually resume audio (for UI controls)
export const tryResumeAudio = async (): Promise<boolean> => {
  return resumeAudioContext();
};
