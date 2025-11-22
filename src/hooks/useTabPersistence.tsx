import { useState, useEffect } from 'react';

export const useTabPersistence = (pageKey: string, defaultTab: string) => {
  const storageKey = `tab-${pageKey}`;
  
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      // Check URL hash first
      const hash = window.location.hash.slice(1);
      if (hash) return hash;
      
      // Then check localStorage
      const saved = localStorage.getItem(storageKey);
      if (saved) return saved;
    }
    return defaultTab;
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem(storageKey, activeTab);
    
    // Update URL hash
    if (window.location.hash.slice(1) !== activeTab) {
      window.history.replaceState(null, '', `#${activeTab}`);
    }
  }, [activeTab, storageKey]);

  // Listen for hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) setActiveTab(hash);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return [activeTab, setActiveTab] as const;
};
