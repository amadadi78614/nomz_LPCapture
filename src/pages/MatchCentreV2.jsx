import { useMemo, useState } from 'react';
import { FIXTURES } from '../data/seed';
import { FixtureRow, LiveScoreCard, ResultCard } from '../components/ui';
import '../styles/match-centre-v2.css';

export default function MatchCentreV2() {
  const completedRounds = useMemo(
    () => [...new Set(FIXTURES.filter((f) => f.status === 'final').map((f) => f.round))].sort((a, b) => b - a),
    [],
  );
  const scheduledRounds = useMemo(
    () => [...new Set(FIXTURES.filter((f) => f.status === 'scheduled').map((f) => f.round))].sort((a, b) => a - b),
    [],
  );
  const latestRound = completedRounds[0] || 'all';
  const [tab, setTab] = useState('results');
  const [roundFilter, setRoundFilter] = useState(String(latestRound));

  const live = FIXTURES.filter((f) => f.status === 'live');
  const allResults = FIXTURES
    .filter((f) => f.status === 'final')
    .slice()
    .sort((a, b) => new Date(b.start) - new Date(a.start));
  const allFixtures = FIXTURES
    .filter((f) => f.status === 'scheduled')
    .slice()
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  const availableRounds = tab === 'fixtures' ? scheduledRounds : completedRounds;
  const filtered = (tab === 'fixtures' ? allFixtures : allResults).filter(
    (f) => roundFilter === 'all' || f.round === Number(roundFilter),
  );

  const selectTab = (nextTab) => {
    setTab(nextTab);
    if (nextTab === 'fixtures') setRoundFilter(scheduledRounds.length ? String(scheduledRounds[0]) : 'all');
    if (nextTab === 'results') setRoundFilter(completedRounds.length ? String(completedRounds[0]) : 'all');
  };

  return (
    <div className="page mc2-page">
      <div className="mc2-head">
        <div>
          <span className="eyebrow">Season 3</span>
          <h1 className="display">Match Centre</h1>
          <p className="muted">Round 5 results are now live with the complete rubber breakdown.</p>
        </div>
        {live.length > 0 && <span className="chip mc2-live">● {live.length} Live</span>}
      </div>

      <div className="tabbar mt mc2-tabs">
        {live.length > 0 && <button className={tab === 'live' ? 'on' : ''} onClick={() => selectTab('live')}>● Live</button>}
        <button className={tab === 'results' ? 'on' : ''} onClick={() => selectTab('results')}>Results</button>
        <button className={tab === 'fixtures' ? 'on' : ''} onClick={() => selectTab('fixtures')}>Fixtures</button>
      </div>

      {(tab === 'results' || tab === 'fixtures') && (
        <div className="mc2-rounds" aria-label="Round filter">
          <button className={`chip ${roundFilter === 'all' ? 'on' : ''}`} onClick={() => setRoundFilter('all')}>All rounds</button>
          {availableRounds.map((round) => (
            <button key={round} className={`chip ${roundFilter === String(round) ? 'on' : ''}`} onClick={() => setRoundFilter(String(round))}>
              Round {round}
            </button>
          ))}
        </div>
      )}

      <div className="mc2-content">
        {tab === 'live' && (
          <div className="mc2-grid">
            {live.length ? live.map((f) => <LiveScoreCard key={f.id} fixture={f} />) : <p className="muted">No matches live right now.</p>}
          </div>
        )}

        {tab === 'results' && (
          filtered.length ? (
            availableRounds
              .filter((round) => roundFilter === 'all' || round === Number(roundFilter))
              .map((round) => {
                const roundResults = filtered.filter((f) => f.round === round);
                if (!roundResults.length) return null;
                return (
                  <section key={round} className="mc2-round-section">
                    <div className="mc2-round-heading">
                      <div>
                        <span className="eyebrow">Round {round}</span>
                        <h2>{round === latestRound ? 'Latest results' : `Round ${round} results`}</h2>
                      </div>
                      <span className="muted">{new Date(roundResults[0].start).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="mc2-grid">
                      {roundResults.map((f) => <ResultCard key={f.id} fixture={f} />)}
                    </div>
                  </section>
                );
              })
          ) : <div className="card mc2-empty">No results for this round.</div>
        )}

        {tab === 'fixtures' && (
          filtered.length ? (
            availableRounds
              .filter((round) => roundFilter === 'all' || round === Number(roundFilter))
              .map((round) => {
                const roundFixtures = filtered.filter((f) => f.round === round);
                if (!roundFixtures.length) return null;
                return (
                  <section key={round} className="mc2-round-section">
                    <div className="mc2-round-heading"><h2>Round {round}</h2></div>
                    <div className="mc2-fixtures">{roundFixtures.map((f) => <FixtureRow key={f.id} fixture={f} />)}</div>
                  </section>
                );
              })
          ) : <div className="card mc2-empty">No upcoming fixtures scheduled.</div>
        )}
      </div>
    </div>
  );
}
