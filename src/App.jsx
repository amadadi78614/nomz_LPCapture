import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { TopBar, LiveTicker, BottomNav } from './components/ui';
import {
  Home, MatchCentre, MatchPage, Standings, Players, PlayerProfile,
  Franchises, FranchiseHub, Rankings, NewsCentre, SponsorCentre, More,
} from './pages/public';
import {
  AdminDashboard, CaptainDashboard, CommissionerDashboard, SponsorAnalytics,
} from './pages/dashboards';

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollTop />
      <div className="shell">
        <LiveTicker />
        <TopBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live" element={<MatchCentre />} />
          <Route path="/match/:id" element={<MatchPage />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/players" element={<Players />} />
          <Route path="/player/:id" element={<PlayerProfile />} />
          <Route path="/franchises" element={<Franchises />} />
          <Route path="/franchise/:id" element={<FranchiseHub />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/news" element={<NewsCentre />} />
          <Route path="/sponsors" element={<SponsorCentre />} />
          <Route path="/more" element={<More />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/captain" element={<CaptainDashboard />} />
          <Route path="/commissioner" element={<CommissionerDashboard />} />
          <Route path="/sponsor-analytics" element={<SponsorAnalytics />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
