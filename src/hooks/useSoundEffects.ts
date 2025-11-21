import { useCallback, useState, useEffect } from "react";
import { setGlobalSoundVolume } from "@/lib/soundEffects";

export const useSoundEffects = () => {
  const [enabled, setEnabled] = useState(() => {
    const saved = localStorage.getItem('trn-sound-effects-enabled');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return saved !== 'false' && !prefersReduced;
  });
  
  const [volume, setVolume] = useState(() => {
    return parseInt(localStorage.getItem('trn-sound-effects-volume') || '50');
  });

  // Update global volume when volume changes
  useEffect(() => {
    setGlobalSoundVolume(volume / 100);
  }, [volume]);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem('trn-sound-effects-enabled', String(enabled));
  }, [enabled]);

  useEffect(() => {
    localStorage.setItem('trn-sound-effects-volume', String(volume));
  }, [volume]);
  
  const play = useCallback((sound: () => void) => {
    if (!enabled) return;
    
    try {
      sound();
    } catch (error) {
      console.warn('Sound effect failed:', error);
    }
  }, [enabled]);
  
  const toggleEnabled = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);

  const adjustVolume = useCallback((newVolume: number) => {
    setVolume(Math.max(0, Math.min(100, newVolume)));
  }, []);
  
  return {
    enabled,
    setEnabled,
    toggleEnabled,
    volume,
    setVolume: adjustVolume,
    play,
  };
};
