import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { TopBar, LiveTicker, BottomNav } from './components/ui';
import {
  Home, MatchCentre, MatchPage, Standings, Players, PlayerProfile,
  Franchises, FranchiseHub, Rankings, NewsCentre, SponsorCentre, More,
} from './pages/public';
import { Registration } from './pages/Registration';
import {
  AdminDashboard, CaptainDashboard, CommissionerDashboard, SponsorAnalytics,
} from './pages/dashboards';
import LowveldTV from './pages/tv';
import {
  Rivalries, RivalryPage, HallOfFame, DraftHistory, Dynasty, FanZone,
} from './pages/community';
import {
  RoadTo360, LegacyLeague, LegacyFranchise, Predictor, Community, SportsHub,
} from './pages/leagues';
import UnityCup from './pages/UnityCup';
import { Leagues } from './pages/leagues';
import { AllTimeRankings } from './pages/AllTimeRankings';
import { Cups } from './pages/Cups';

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
          <Route path="/tv" element={<LowveldTV />} />
          <Route path="/rivalries" element={<Rivalries />} />
          <Route path="/rivalry/:id" element={<RivalryPage />} />
          <Route path="/hall-of-fame" element={<HallOfFame />} />
          <Route path="/draft" element={<DraftHistory />} />
          <Route path="/dynasty" element={<Dynasty />} />
          <Route path="/fan-zone" element={<FanZone />} />
          <Route path="/road-to-360" element={<RoadTo360 />} />
          <Route path="/road-to-360-super-cup" element={<RoadTo360 />} />
          <Route path="/legacy-league" element={<LegacyLeague />} />
          <Route path="/legacy-franchise/:id" element={<LegacyFranchise />} />
          <Route path="/predictor" element={<Predictor />} />
          <Route path="/community" element={<Community />} />
          <Route path="/sports-hub" element={<SportsHub />} />
          <Route path="/news" element={<NewsCentre />} />
          <Route path="/sponsors" element={<SponsorCentre />} />
          <Route path="/more" element={<More />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/captain" element={<CaptainDashboard />} />
          <Route path="/commissioner" element={<CommissionerDashboard />} />
          <Route path="/sponsor-analytics" element={<SponsorAnalytics />} />
          <Route path="/unity-cup" element={<UnityCup />} />
          <Route path="/leagues" element={<Leagues />} />
          <Route path="/all-time-rankings" element={<AllTimeRankings />} />
          <Route path="/cups" element={<Cups />} />
          <Route path="/register" element={<Registration />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
