import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './data/fixturePresentation';
import './data/legacyRound2Update';
import './data/legacyRound3Update';
import './data/franchiseRound5Update';
import './data/round5SiteSync';
import './data/franchiseFinalsRunUpdate';
import './data/regularSeasonSixRoundFix';
import './data/mvpPairIntegrity';
import './data/rankingRubberCorrections';
import './data/verifiedSeason3PlayerStats';
import './data/grandFinalUpdate';
import './data/ladiesSeason2Data';
import './data/ladiesSeason2HomeSync';
import './data/ladiesSeason2LeagueSync';
import './data/ladiesSeason2Round1Update';
import './data/ladiesSeason2RankingsSync';
import './data/superCupSquadSync';
import './data/legacyDetailedTableSync';
import './styles/global.css';
import './styles/career-table-mobile.css';
import './styles/home-premium.css';
import './styles/home-standings-mobile-fix.css';
import './styles/leagues-standings-fix.css';
import './styles/home-layout-final-fix.css';
import './styles/season-awards.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.filter((name) => name.startsWith('lp-shell-')).map((name) => caches.delete(name)));
      }
    } catch (error) {
      console.warn('Could not clear the legacy app cache:', error);
    }
  });
}

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  window.location.reload();
});

createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>,
);
