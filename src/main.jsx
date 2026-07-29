import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './data/fixturePresentation';
import './data/legacyRound2Update';
import './data/franchiseRound5Update';
import './data/round5SiteSync';
import './styles/global.css';
import './styles/career-table-mobile.css';
import './styles/home-premium.css';
import './styles/home-standings-mobile-fix.css';
import './styles/leagues-standings-fix.css';
import './styles/home-layout-final-fix.css';

// A stale service worker was caching old HTML/JS between deployments.
// That caused client-side navigation to occasionally render a blank screen
// until the browser was refreshed. Disable the old worker and clear its cache.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));

      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter((name) => name.startsWith('lp-shell-'))
            .map((name) => caches.delete(name)),
        );
      }
    } catch (error) {
      console.warn('Could not clear the legacy app cache:', error);
    }
  });
}

// Recover cleanly when a deployment replaces a hashed JavaScript chunk while
// somebody still has the previous version open.
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  window.location.reload();
});

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);