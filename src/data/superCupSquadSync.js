export const LOWVELD_SUPER_CUP_SQUAD = [
  'Heinrich Coomans',
  'Duhan Swart',
  'Wiehann Mohlen',
  'Justin van Staden',
  'Schalk Schutte',
  'Cian Maritz',
  'Durell Pillay',
  'Yusuf Asvat',
  'Ahmed Mungalee',
  'Salman Mehtar',
];

const squadGrid = () => LOWVELD_SUPER_CUP_SQUAD.map((name, index) => `
  <div class="card" style="padding:12px;display:flex;gap:10px;align-items:center">
    <span class="chip" style="min-width:30px;text-align:center">${index + 1}</span>
    <b>${name}</b>
  </div>`).join('');

function updateSuperCupSquad() {
  const path = window.location.pathname;

  if ((path === '/' || path === '') && !document.querySelector('[data-supercup-home-squad]')) {
    const root = document.querySelector('.hv3');
    if (root) {
      const section = document.createElement('section');
      section.className = 'hv3-section';
      section.dataset.supercupHomeSquad = 'true';
      section.innerHTML = `
        <div class="hv3-heading">
          <div>
            <span class="hv3-kicker">360 SUPER CUP · OFFICIAL LOWVELD SQUAD</span>
            <h2>The ten selected to represent Lowveld Padel.</h2>
          </div>
          <a href="/360-super-cup">Open Super Cup centre →</a>
        </div>
        <div class="card" style="padding:18px;border-left:4px solid var(--gold);margin-bottom:12px">
          <p style="margin:0">Lowveld Padel has submitted its final 10-player squad for the 360 Super Cup. The team is now officially locked in for the national stage.</p>
        </div>
        <div class="grid cols-2">${squadGrid()}</div>`;
      const hero = root.querySelector('.hv3-hero');
      if (hero?.nextSibling) root.insertBefore(section, hero.nextSibling);
      else root.prepend(section);
    }
  }

  if (path === '/360-super-cup' && !document.querySelector('[data-supercup-official-squad]')) {
    const page = document.querySelector('.page');
    if (page) {
      const section = document.createElement('section');
      section.dataset.supercupOfficialSquad = 'true';
      section.className = 'card';
      section.style.cssText = 'padding:20px;margin:16px 0;border-top:3px solid var(--gold)';
      section.innerHTML = `
        <span class="eyebrow">LOWVELD PADEL · OFFICIAL SUBMISSION</span>
        <h2 class="display" style="margin:6px 0 8px">360 Super Cup Squad Confirmed</h2>
        <p class="muted" style="margin:0 0 14px">The final 10-player squad submitted to represent Lowveld Padel at the 360 Super Cup.</p>
        <div class="grid cols-2">${squadGrid()}</div>`;

      const firstHero = page.firstElementChild;
      if (firstHero?.nextSibling) page.insertBefore(section, firstHero.nextSibling);
      else page.prepend(section);

      // Replace stale placeholder language where present.
      page.querySelectorAll('h1,h2,h3,p,span,b,strong').forEach((node) => {
        const text = node.textContent?.trim();
        if (text === 'Squad Announcement') node.textContent = 'Official Lowveld Squad';
        if (text === 'The Lowveld squad will be revealed here.') node.textContent = 'The official 10-player Lowveld Padel squad has been confirmed above.';
      });
    }
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('load', updateSuperCupSquad);
  new MutationObserver(() => requestAnimationFrame(updateSuperCupSquad))
    .observe(document.documentElement, { childList: true, subtree: true });
}
