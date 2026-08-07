import { Link } from 'react-router-dom';

export function SeasonAwards({ compact = false }) {
  return (
    <section className={`season-awards ${compact ? 'season-awards-compact' : ''}`} aria-label="Current Season 3 award leaders">
      <article className="season-award-card season-award-mvp">
        <span className="eyebrow">Current MVP race</span>
        <h2>Uwais Patel & Yusuf Patel</h2>
        <p>
          The Desert Falcons P1 partners are joint leaders. They played together throughout the campaign,
          shared the same results and cannot fairly be separated on the evidence currently available.
        </p>
        <div className="season-award-tags">
          <span>Joint leaders</span>
          <span>Desert Falcons</span>
          <span>P1</span>
        </div>
      </article>

      <article className="season-award-card season-award-youth">
        <span className="eyebrow">Young Player of the Tournament</span>
        <h2>Jude van den Berg leads</h2>
        <p>
          Jude currently heads the youth award race after another composed winning performance against adult opposition.
          Aadam Nomani, Yusuf Packery and Joshua Hoffman remain part of an outstanding junior breakthrough story.
        </p>
        <div className="season-award-tags">
          <span>Current leader</span>
          <span>12 years old</span>
          <span>Desert Falcons</span>
        </div>
      </article>

      {!compact && (
        <div className="season-award-footer">
          <span>Current position before the Franchise League final is completed.</span>
          <Link to="/rankings">View full statistical rankings →</Link>
        </div>
      )}
    </section>
  );
}

export default function RankingsWithAwards({ RankingsComponent }) {
  return (
    <>
      <div className="page awards-page-lead">
        <SeasonAwards />
      </div>
      <RankingsComponent />
    </>
  );
}
