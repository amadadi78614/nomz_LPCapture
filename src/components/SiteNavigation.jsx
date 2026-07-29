import { NavLink } from 'react-router-dom';
import { FIXTURES } from '../data/seed';

const DESKTOP_NAV = [
  ['/', 'Home'],
  ['/live', 'Match Centre'],
  ['/leagues', 'Leagues'],
  ['/cups', 'Cups'],
  ['/players', 'Players'],
  ['/all-time-rankings', 'All-Time'],
  ['/tv', 'Lowveld TV'],
  ['/news', 'News'],
  ['/sponsors', 'Sponsors'],
];

const MOBILE_NAV = [
  ['/', '⌂', 'Home'],
  ['/live', '●', 'Matches'],
  ['/leagues', '≡', 'Leagues'],
  ['/cups', '🏆', 'Cups'],
  ['/more', '⋯', 'More'],
];

function navClass({ isActive }) {
  return isActive ? 'active' : undefined;
}

export function TopBar() {
  return (
    <header style={{ background: 'rgba(7,10,19,0.97)', borderBottom: '1px solid var(--line)', backdropFilter: 'blur(12px)', position: 'sticky', top: 'var(--ticker-h)', zIndex: 40 }}>
      <div className="topbar">
        <NavLink to="/" end className="row" style={{ gap: 10 }}>
          <img src="/brand/lp-mark.png" alt="Lowveld Padel" style={{ borderRadius: '50%' }} />
          <span className="wordmark">Lowveld Padel</span>
        </NavLink>
        <nav>
          {DESKTOP_NAV.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={navClass}>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function BottomNav() {
  const liveCount = FIXTURES.filter((fixture) => fixture.status === 'live').length;
  return (
    <>
      {liveCount > 0 && (
        <NavLink to="/live" className="sticky-live" aria-label="Live matches">
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', animation: 'pulse 1.2s infinite' }} />
          {liveCount} Live
        </NavLink>
      )}
      <nav className="bottomnav" aria-label="Primary navigation">
        {MOBILE_NAV.map(([to, icon, label]) => (
          <NavLink key={to} to={to} end={to === '/'} className={navClass}>
            <span className="ico" aria-hidden="true">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
