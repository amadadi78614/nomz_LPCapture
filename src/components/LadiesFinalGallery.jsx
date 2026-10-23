import { Link } from "react-router-dom";
import '../styles/ladies-final-gallery.css';

const photo = n => `/ladies/final-2026/photo-${String(n).padStart(2,'0')}.webp`;
const captions = {
  13: 'Backhand Blossoms · Season 2 champions',
  14: 'Blossoms celebrate with the trophy',
  12: 'The champions together',
  10: 'Finals night team spirit',
  11: 'Together on court',
  15: 'Celebrating the title',
};
const order = [14,12,10,11,15,9,8,7,2,1,3,4,5,6,16,17,18,19,20,21,22,23,24,25];
function Photo({number}) {
  const caption=captions[number] || `Finals Night · Presentation photo ${number}`;
  return <figure><a href={photo(number)} target="_blank" rel="noreferrer" aria-label={`Open full photo: ${caption}`}><img src={photo(number)} alt={caption} loading="lazy" width="1280" height="853"/></a><figcaption>{caption}</figcaption></figure>;
}
export default function LadiesFinalGallery({ featuredOnly = false }) {
  return <section id="ladies-final-gallery" className="lf-gallery" aria-labelledby="lf-gallery-title">
    <div className="hv3-section-heading"><div><span className="hv3-kicker">22 OCTOBER 2026 · PLAY 360</span><h2 id="lf-gallery-title">Our champions. Their moment.</h2></div><p>Backhand Blossoms lift the trophy after a 7–6 Grand Final victory over Lunar Lillies.</p></div>
    <figure className="lf-champions"><a href={photo(13)} target="_blank" rel="noreferrer" aria-label="Open full Backhand Blossoms champions team photo"><img src={photo(13)} alt="Backhand Blossoms team celebrating with their trophy and medals after winning the Ladies Season 2 final" width="1280" height="853" loading="lazy"/></a><figcaption><span>SEASON 2 CHAMPIONS</span><h3>Backhand Blossoms</h3><p>Grit. Grace. Game. <strong>7–6</strong></p></figcaption></figure>
    {featuredOnly ? <Link className="btn gold" to="/gallery">View Finals Night photo gallery →</Link> : <><div className="lf-photo-grid">{order.map(number=><Photo key={number} number={number}/>)}</div><p className="muted">Select any photo to open the full image.</p></>}
  </section>;
}
