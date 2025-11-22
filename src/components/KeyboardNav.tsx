import { useEffect } from 'react';
import { isInputFocused } from '@/lib/performanceUtils';

export const KeyboardNav = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input
      if (isInputFocused()) return;

      // Quick search with '/'
      if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('search');
        searchInput?.focus();
      }
      
      // Navigate to sections with Alt + 1-9
      if (e.altKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const sectionIndex = parseInt(e.key) - 1;
        const sections = document.querySelectorAll('section[id]');
        const section = sections[sectionIndex];
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Announce to screen readers
          window.dispatchEvent(
            new CustomEvent('announce', { 
              detail: { message: `Navigated to ${section.getAttribute('aria-label') || 'section ' + (sectionIndex + 1)}` }
            })
          );
        }
      }

      // Escape to close modals or return to top
      if (e.key === 'Escape') {
        const openDialog = document.querySelector('[role="dialog"][data-state="open"]');
        if (!openDialog) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return null;
};
