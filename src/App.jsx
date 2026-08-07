import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LiveTicker } from './components/ui';
import { TopBar, BottomNav } from './components/SiteNavigation';
import { HardNavigationGuard, SiteErrorBoundary } from './components/SiteReliability';
import {
  MatchPage, Players, PlayerProfile,
  Franchises, FranchiseHub, NewsCentre, SponsorCentre, More,
} from './pages/public';
import HomeV3 from './pages/HomeV3';
import MatchCentreV2 from './pages/MatchCentreV2';
import StandingsV2 from './pages/StandingsV2';
import RankingsV2 from './pages/RankingsV2';
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
import { SuperCup360 } from './pages/leagues';
import { Leagues } from './pages/leagues_new';
import { AllTimeSeason1 } from './pages/AllTimeSeason1';
import { LadiesSeason2Franchise } from './pages/LadiesSeason2';
import { NotFound } from './pages/public';
import { Cups } from './pages/Cups';

function ScrollTop() {
  const { pathname, search } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname, search]);
  return null;
}

function SiteRoutes() {
  return (
    <div className="shell">
      <LiveTicker />
      <TopBar />
      <Routes>
        <Route path="/" element={<HomeV3 />} />
        <Route path="/live" element={<MatchCentreV2 />} />
        <Route path="/match/:id" element={<MatchPage />} />
        <Route path="/standings" element={<StandingsV2 />} />
        <Route path="/players" element={<Players />} />
        <Route path="/player/:id" element={<PlayerProfile />} />
        <Route path="/franchises" element={<Franchises />} />
        <Route path="/franchise/:id" element={<FranchiseHub />} />
        <Route path="/ladies-franchise/:id" element={<LadiesSeason2Franchise />} />
        <Route path="/rankings" element={<RankingsV2 />} />
        <Route path="/tv" element={<LowveldTV />} />
        <Route path="/rivalries" element={<Rivalries />} />
        <Route path="/rivalry/:id" element={<RivalryPage />} />
        <Route path="/hall-of-fame" element={<HallOfFame />} />
        <Route path="/draft" element={<DraftHistory />} />
        <Route path="/dynasty" element={<Dynasty />} />
        <Route path="/fan-zone" element={<FanZone />} />
        <Route path="/360-super-cup" element={<SuperCup360 />} />
        <Route path="/road-to-360" element={<Navigate to="/360-super-cup" replace />} />
        <Route path="/road-to-360-super-cup" element={<Navigate to="/360-super-cup" replace />} />
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
        <Route path="/all-time-rankings" element={<AllTimeSeason1 />} />
        <Route path="/cups" element={<Cups />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollTop />
      <HardNavigationGuard />
      <SiteErrorBoundary>
        <SiteRoutes />
      </SiteErrorBoundary>
    </BrowserRouter>
  );
}
