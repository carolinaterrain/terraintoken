import { useState, useEffect } from 'react';

export const LiveAnnouncer = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleAnnounce = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      setMessage(customEvent.detail.message);
      // Clear message after announcement
      setTimeout(() => setMessage(''), 1000);
    };

    window.addEventListener('announce', handleAnnounce);
    return () => window.removeEventListener('announce', handleAnnounce);
  }, []);

  if (!message) return null;

  return (
    <div 
      role="status" 
      aria-live="polite" 
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

/**
 * Helper function to announce messages to screen readers
 */
export const announce = (message: string) => {
  window.dispatchEvent(new CustomEvent('announce', { detail: { message } }));
};
