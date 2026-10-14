// Offline pricing preparation. Never ship supplier costs or markup bands to the browser.
// Each band applies its percentage to the whole unit cost (not marginal portions).
export function calculateRetailCents(costCents, bands) {
  if (!Number.isSafeInteger(costCents) || costCents <= 0) throw new Error('Unit cost must be positive integer cents.');
  if (!Array.isArray(bands) || !bands.length) throw new Error('Configure approved markup bands first.');
  let previous = 0;
  for (const [index, band] of bands.entries()) {
    const max = band.maxCostCents;
    if (!(max === null && index === bands.length - 1) && (!Number.isSafeInteger(max) || max <= previous)) throw new Error('Band limits must increase; only the final limit may be null.');
    if (!Number.isFinite(band.markupPercent) || band.markupPercent < 0) throw new Error('Markup must be a non-negative percentage.');
    previous = max;
  }
  const band = bands.find(band => band.maxCostCents === null || costCents <= band.maxCostCents);
  if (!band) throw new Error('No approved band covers this cost.');
  const price = Math.round(costCents * (1 + band.markupPercent / 100));
  if (!Number.isSafeInteger(price)) throw new Error('Calculated price is out of range.');
  return price;
}
