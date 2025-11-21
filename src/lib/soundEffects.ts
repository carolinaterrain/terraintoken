// Lightweight sound effects using Web Audio API
// All sounds generated programmatically - no audio files needed

type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

// Global volume control (0-1)
let globalVolume = 0.3;

export const setGlobalSoundVolume = (volume: number) => {
  globalVolume = Math.max(0, Math.min(1, volume));
};

// Check if user prefers reduced motion (also applies to sounds)
const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Create a simple tone
function createTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
  return () => {
    if (prefersReducedMotion() || !window.AudioContext) return;
    
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      
      // Fade in/out to prevent clicks
      const volume = globalVolume * 0.15; // Keep sounds subtle
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
      
      // Clean up
      setTimeout(() => {
        audioContext.close();
      }, (duration + 0.1) * 1000);
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
