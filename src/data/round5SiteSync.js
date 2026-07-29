import { FIXTURES } from './seed';
import { ROUND5_FIXTURES } from './franchiseRound5Update';

// Keep the public match URLs already used by the homepage while replacing
// every stale scheduled Round 5 object with the official completed result.
const canonicalIds = new Map([
  ['globo-boomerangs|ice-breakers', 'fx-w5-1'],
  ['sahara-lions|avalanche-aces', 'fx-w5-2'],
  ['sahara-lions|samurai-kicksmashers', 'fx-w5-3'],
  ['desert-falcons|sonic-viboras', 'fx-w5-4'],
]);

ROUND5_FIXTURES.forEach((fixture) => {
  const key = `${fixture.home}|${fixture.away}`;
  const canonicalId = canonicalIds.get(key);
  if (canonicalId) fixture.id = canonicalId;
});

const officialByMatchup = new Map(
  ROUND5_FIXTURES.map((fixture) => [`${fixture.home}|${fixture.away}`, fixture]),
);

// Remove all stale Round 5 schedule entries, including reversed home/away
// presentation copies, then insert only the four official final fixtures.
for (let index = FIXTURES.length - 1; index >= 0; index -= 1) {
  const fixture = FIXTURES[index];
  if (fixture.league !== 'mens' || fixture.round !== 5) continue;

  const direct = `${fixture.home}|${fixture.away}`;
  const reverse = `${fixture.away}|${fixture.home}`;
  if (officialByMatchup.has(direct) || officialByMatchup.has(reverse)) {
    FIXTURES.splice(index, 1);
  }
}

ROUND5_FIXTURES.forEach((fixture) => FIXTURES.push(fixture));

// Keep chronological ordering stable for ticker, franchise pages and results.
FIXTURES.sort((a, b) => new Date(a.start) - new Date(b.start));
