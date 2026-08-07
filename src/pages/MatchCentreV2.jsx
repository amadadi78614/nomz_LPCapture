import { useMemo, useState } from 'react';
import { FIXTURES } from '../data/seed';
import { ROUND5_FIXTURES } from '../data/franchiseRound5Update';
import { FixtureRow, LiveScoreCard, ResultCard } from '../components/ui';
import '../styles/match-centre-v2.css';

const mergeFixtures = () => {
  const merged = [...ROUND5_FIXTURES, ...FIXTURES];
  return merged.filter((fixture, index, list) => list.findIndex((item) => item.id === fixture.id) === index);
};

const stageLabel = (stage = '') => {
  const labels = {
    eliminator: 'Playoff Eliminator',
    qualifier: 'Final Qualifier',
    semifinal: 'Semi-final',
    'semi-final': 'Semi-final',
    final: 'Franchise League Final',
  };
  return labels[stage] || 'Playoffs';
};

export default function MatchCentreV2() {
  const fixturesData = useMemo(() => mergeFixtures(), []);

  const completedRounds = useMemo(
    () => [...new Set(
      fixturesData
        .filter((f) => f.status === 'final' && !f.stage)
        .map((f) => f.round),
    )].sort((a, b) => b - a),
    [fixturesData],
  );

  const scheduledRounds = useMemo(
    () => [...new Set(
      fixturesData
        .filter((f) => f.status === 'scheduled' && !f.stage)
        .map((f) => f.round),
    )].sort((a, b) => a - b),
    [fixturesData],
  );

  const playoffResults = useMemo(
    () => fixturesData
      .filter((f) => f.status === 'final' && f.stage)
      .slice()
      .sort((a, b) => new Date(b.start) - new Date(a.start)),
    [fixturesData],
  );

  const playoffFixtures = useMemo(
    () => fixturesData
      .filter((f) => f.status === 'scheduled' && f.stage)
      .slice()
      .sort((a, b) => new Date(a.start) - new Date(b.start)),
    [fixturesData],
  );

  const [tab, setTab] = useState('results');
  const [roundFilter, setRoundFilter] = useState(playoffResults.length ? 'playoffs' : String(completedRounds[0] || 'all'));

  const live = fixturesData.filter((f) => f.status === 'live');
  const allResults = fixturesData
    .filter((f) => f.status === 'final' && !f.stage)
    .slice()
    .sort((a, b) => new Date(b.start) - new Date(a.start));
  const allFixtures = fixturesData
    .filter((f) => f.status === 'scheduled' && !f.stage)
    .slice()
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  const selectTab = (nextTab) => {
    setTab(nextTab);
    if (nextTab === 'fixtures') {
      setRoundFilter(playoffFixtures.length ? 'playoffs' : (scheduledRounds.length ? String(scheduledRounds[0]) : 'all'));
    }
    if (nextTab === 'results') {
      setRoundFilter(playoffResults.length ? 'playoffs' : (completedRounds.length ? String(completedRounds[0]) : 'all'));
    }
  };

  const regularFiltered = (tab === 'fixtures' ? allFixtures : allResults).filter(
    (f) => roundFilter === 'all' || (roundFilter !== 'playoffs' && f.round === Number(roundFilter)),
  );

  const visiblePlayoffs = tab === 'fixtures' ? playoffFixtures : playoffResults;
  const showPlayoffs = roundFilter === 'all' || roundFilter === 'playoffs';
  const availableRounds = tab === 'fixtures' ? scheduledRounds : completedRounds;
  const latestRegularRound = completedRounds[0] || null;

  return (
    <div className="page mc2-page">
      <div className="mc2-head">
        <div>
          <span className="eyebrow">Season 3</span>
          <h1 className="display">Match Centre</h1>
          <p className="muted">Regular-season rounds and the Franchise League playoffs are shown separately.</p>
        </div>
        {live.length > 0 && <span className="chip mc2-live">● {live.length} Live</span>}
      </div>

      <div className="tabbar mt mc2-tabs">
        {live.length > 0 && <button className={tab === 'live' ? 'on' : ''} onClick={() => selectTab('live')}>● Live</button>}
        <button className={tab === 'results' ? 'on' : ''} onClick={() => selectTab('results')}>Results</button>
        <button className={tab === 'fixtures' ? 'on' : ''} onClick={() => selectTab('fixtures')}>Fixtures</button>
      </div>

      {(tab === 'results' || tab === 'fixtures') && (
        <div className="mc2-rounds" aria-label="Competition filter">
          <button className={`chip ${roundFilter === 'all' ? 'on' : ''}`} onClick={() => setRoundFilter('all')}>All</button>
          {((tab === 'results' && playoffResults.length) || (tab === 'fixtures' && playoffFixtures.length)) ? (
            <button className={`chip ${roundFilter === 'playoffs' ? 'on' : ''}`} onClick={() => setRoundFilter('playoffs')}>Playoffs</button>
          ) : null}
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
          <>
            {showPlayoffs && visiblePlayoffs.length > 0 && (
              <section className="mc2-round-section">
                <div className="mc2-round-heading">
                  <div>
                    <span className="eyebrow">Franchise League Playoffs</span>
                    <h2>Playoff results</h2>
                  </div>
                </div>
                <div className="mc2-grid">
                  {visiblePlayoffs.map((f) => (
                    <div key={f.id}>
                      <div className="muted" style={{ margin: '0 0 6px 4px', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em' }}>
                        {stageLabel(f.stage)} · {new Date(f.start).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <ResultCard fixture={f} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {roundFilter !== 'playoffs' && regularFiltered.length > 0 && availableRounds
              .filter((round) => roundFilter === 'all' || round === Number(roundFilter))
              .map((round) => {
                const roundResults = regularFiltered.filter((f) => f.round === round);
                if (!roundResults.length) return null;
                return (
                  <section key={round} className="mc2-round-section">
                    <div className="mc2-round-heading">
                      <div>
                        <span className="eyebrow">Round {round}</span>
                        <h2>{round === latestRegularRound ? 'Latest regular-season results' : `Round ${round} results`}</h2>
                      </div>
                      <span className="muted">{new Date(roundResults[0].start).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="mc2-grid">
                      {roundResults.map((f) => <ResultCard key={f.id} fixture={f} />)}
                    </div>
                  </section>
                );
              })}

            {roundFilter !== 'playoffs' && regularFiltered.length === 0 && !showPlayoffs && (
              <div className="card mc2-empty">No results for this round.</div>
            )}
          </>
        )}

        {tab === 'fixtures' && (
          <>
            {showPlayoffs && visiblePlayoffs.length > 0 && (
              <section className="mc2-round-section">
                <div className="mc2-round-heading"><h2>Upcoming playoffs</h2></div>
                <div className="mc2-fixtures">
                  {visiblePlayoffs.map((f) => (
                    <div key={f.id}>
                      <div className="muted" style={{ margin: '0 0 6px 4px', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em' }}>{stageLabel(f.stage)}</div>
                      <FixtureRow fixture={f} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {roundFilter !== 'playoffs' && regularFiltered.length > 0 && availableRounds
              .filter((round) => roundFilter === 'all' || round === Number(roundFilter))
              .map((round) => {
                const roundFixtures = regularFiltered.filter((f) => f.round === round);
                if (!roundFixtures.length) return null;
                return (
                  <section key={round} className="mc2-round-section">
                    <div className="mc2-round-heading"><h2>Round {round}</h2></div>
                    <div className="mc2-fixtures">{roundFixtures.map((f) => <FixtureRow key={f.id} fixture={f} />)}</div>
                  </section>
                );
              })}
          </>
        )}
      </div>
    </div>
  );
}
