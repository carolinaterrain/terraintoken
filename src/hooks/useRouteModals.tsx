import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useModalQueue } from './useModalQueue';

export const useRouteModals = () => {
  const location = useLocation();
  const { requestModal } = useModalQueue();

  useEffect(() => {
    // Only trigger on specific routes, not homepage
    const route = location.pathname;

    // Transparency page: Show after 2 minutes of engagement
    if (route === '/transparency') {
      const alreadyShown = sessionStorage.getItem('waitlist_shown_transparency');
      if (alreadyShown) return;

      const timer = setTimeout(() => {
        requestModal('waitlist-transparency');
        sessionStorage.setItem('waitlist_shown_transparency', 'true');
      }, 120000); // 2 minutes

      return () => clearTimeout(timer);
    }

    // Earn TRN page: Show after 90 seconds
    if (route === '/earn-trn') {
      const alreadyShown = sessionStorage.getItem('waitlist_shown_earn');
      if (alreadyShown) return;

      const timer = setTimeout(() => {
        requestModal('waitlist-earn');
        sessionStorage.setItem('waitlist_shown_earn', 'true');
      }, 90000); // 1.5 minutes

      return () => clearTimeout(timer);
    }

    // Team page: Show after 90 seconds
    if (route === '/team') {
      const alreadyShown = sessionStorage.getItem('waitlist_shown_team');
      if (alreadyShown) return;

      const timer = setTimeout(() => {
        requestModal('waitlist-team');
        sessionStorage.setItem('waitlist_shown_team', 'true');
      }, 90000); // 1.5 minutes

      return () => clearTimeout(timer);
    }
  }, [location.pathname, requestModal]);
};
