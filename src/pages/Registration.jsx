import { useState } from 'react';
import { Link } from 'react-router-dom';

const LADIES_TEAMS = [
  'Desert Roses', 'Arctic Angels', 'Phoenix Flames',
  'Backhand Blossoms', 'Net Novas', 'Lunar Lillies', 'First time',
];

const SHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const HANDED = ['Right', 'Left'];
const PREFERRED_SIDE = ['Right (Drive)', 'Left (Backhand)', 'No Preference'];

const TABS = [
  { id: 'ladies', label: "Ladies League" },
  { id: 'youth', label: "Youth Championship" },
  { id: 'lpcup', label: "LP Cup" },
];

const LADIES_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwF4Oj6sv4TePs4lvlPlQbbm3HcTw8_2ThkrU1Y1Y20jTw4iF5Y7DcNy51asFTtLg/exec';

function LadiesForm() {
  const [form, setForm] = useState({
    email: '', firstName: '', surname: '', dob: '', mobile: '',
    season1Team: '', playtomicName: '', playtomicRating: '',
    handed: '', preferredSide: '', shirtSize: '',
    acceptedTerms: false, popiaConsent: false, photoUrl: '',
  });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.email || !form.firstName || !form.surname || !form.mobile ||
        !form.dob || !form.season1Team || !form.playtomicName || !form.playtomicRating ||
        !form.handed || !form.preferredSide || !form.shirtSize) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!form.acceptedTerms || !form.popiaConsent) {
      alert('Please accept the Terms and POPIA Consent to continue.');
      return;
    }
    setStatus('submitting');
    try {
      await fetch(LADIES_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, photoFile: form.photoFile || '', photoUrl: '', submittedAt: new Date().toISOString() }),
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') return (
    <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
      <h2 className="display" style={{ textTransform: 'uppercase', fontSize: 22 }}>Registration Received!</h2>
      <p className="muted" style={{ margin: '8px 0 20px' }}>
        Thank you {form.firstName} — we'll be in touch soon with Ladies League details.
      </p>
      <button className="btn gold" onClick={() => { setStatus('idle'); setForm({ email:'',firstName:'',surname:'',dob:'',mobile:'',season1Team:'',playtomicName:'',playtomicRating:'',handed:'',preferredSide:'',shirtSize:'',acceptedTerms:false,popiaConsent:false,photoFile:null,photoFileName:'' }); }}>
        Register Another
      </button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      <div className="reg-section-label">Personal Details</div>

      <div className="reg-row">
        <div className="reg-field">
          <label className="reg-label">First Name <span className="reg-req">*</span></label>
          <input className="reg-input" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} placeholder="First name" />
        </div>
        <div className="reg-field">
          <label className="reg-label">Surname <span className="reg-req">*</span></label>
          <input className="reg-input" value={form.surname} onChange={(e) => set('surname', e.target.value)} placeholder="Surname" />
        </div>
      </div>

      <div className="reg-row">
        <div className="reg-field">
          <label className="reg-label">Email <span className="reg-req">*</span></label>
          <input className="reg-input" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="your@email.com" />
        </div>
        <div className="reg-field">
          <label className="reg-label">Mobile <span className="reg-req">*</span></label>
          <input className="reg-input" type="tel" value={form.mobile} onChange={(e) => set('mobile', e.target.value)} placeholder="082 000 0000" />
        </div>
      </div>

      <div className="reg-field" style={{ maxWidth: 220 }}>
        <label className="reg-label">Date of Birth <span className="reg-req">*</span></label>
        <input className="reg-input" type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)} />
      </div>

      <div className="reg-section-label" style={{ marginTop: 6 }}>Padel Profile</div>

      <div className="reg-row">
        <div className="reg-field">
          <label className="reg-label">Playtomic Name <span className="reg-req">*</span></label>
          <input className="reg-input" value={form.playtomicName} onChange={(e) => set('playtomicName', e.target.value)} placeholder="Playtomic username" />
        </div>
        <div className="reg-field">
          <label className="reg-label">Playtomic Rating <span className="reg-req">*</span></label>
          <input className="reg-input" value={form.playtomicRating} onChange={(e) => set('playtomicRating', e.target.value)} placeholder="e.g. 4.5" />
        </div>
      </div>

      <div className="reg-row">
        <div className="reg-field">
          <label className="reg-label">Handed <span className="reg-req">*</span></label>
          <select className="reg-input" value={form.handed} onChange={(e) => set('handed', e.target.value)}>
            <option value="">Select...</option>
            {HANDED.map((h) => <option key={h}>{h}</option>)}
          </select>
        </div>
        <div className="reg-field">
          <label className="reg-label">Preferred Side <span className="reg-req">*</span></label>
          <select className="reg-input" value={form.preferredSide} onChange={(e) => set('preferredSide', e.target.value)}>
            <option value="">Select...</option>
            {PREFERRED_SIDE.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="reg-row">
        <div className="reg-field">
          <label className="reg-label">Season 1 Team <span className="reg-req">*</span></label>
          <select className="reg-input" value={form.season1Team} onChange={(e) => set('season1Team', e.target.value)}>
            <option value="">Select team...</option>
            {LADIES_TEAMS.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="reg-field">
          <label className="reg-label">Shirt Size <span className="reg-req">*</span></label>
          <select className="reg-input" value={form.shirtSize} onChange={(e) => set('shirtSize', e.target.value)}>
            <option value="">Select size...</option>
            {SHIRT_SIZES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="reg-field">
        <label className="reg-label">Profile Photo <span className="reg-hint">(optional — JPG or PNG)</span></label>
        <input
          type="file" accept="image/jpeg,image/png,image/webp"
          className="reg-input" style={{ padding: '8px 13px', cursor: 'pointer' }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            set('photoFileName', file.name);
            const reader = new FileReader();
            reader.onload = () => set('photoFile', reader.result);
            reader.readAsDataURL(file);
          }}
        />
        {form.photoFileName && <span className="reg-hint" style={{ marginTop: 2 }}>Selected: {form.photoFileName}</span>}
      </div>

      <div className="reg-section-label" style={{ marginTop: 6 }}>Consent</div>

      <label className="reg-check">
        <input type="checkbox" checked={form.acceptedTerms} onChange={(e) => set('acceptedTerms', e.target.checked)} />
        <span>I accept the Lowveld Padel <span style={{ color: 'var(--gold)' }}>Terms & Conditions</span> and league rules. <span className="reg-req">*</span></span>
      </label>

      <label className="reg-check">
        <input type="checkbox" checked={form.popiaConsent} onChange={(e) => set('popiaConsent', e.target.checked)} />
        <span>I consent to my personal information being processed in accordance with POPIA for league administration purposes. <span className="reg-req">*</span></span>
      </label>

      <button
        className="btn gold"
        style={{ marginTop: 8, opacity: status === 'submitting' ? .6 : 1 }}
        onClick={handleSubmit}
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit Registration'}
      </button>

      {status === 'error' && (
        <p style={{ color: 'var(--loss)', fontSize: 13, textAlign: 'center' }}>
          Something went wrong — please try again or contact us directly.
        </p>
      )}
    </div>
  );
}

function ComingSoonTab({ name }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 20, marginBottom: 8 }}>{name}</div>
      <p className="muted" style={{ margin: '0 0 14px' }}>Registration opens soon — watch this space.</p>
      <span className="chip">Coming Soon</span>
    </div>
  );
}

export function Registration() {
  const [tab, setTab] = useState('ladies');
  return (
    <div className="page">
      <RegStyles />
      <h1 className="display">Registration</h1>
      <p className="muted" style={{ fontSize: 13 }}>Register for Lowveld Padel competitions. All fields marked <span style={{ color: 'var(--live)' }}>*</span> are required.</p>

      <div className="tabbar mt">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        {tab === 'ladies' && (
          <>
            <div className="card" style={{ borderLeft: '3px solid var(--live)', paddingLeft: 14, marginBottom: 16 }}>
              <b style={{ fontFamily: 'var(--display)', textTransform: 'uppercase', fontSize: 14 }}>Ladies League — Season 2</b>
              <p className="muted" style={{ margin: '4px 0 0', fontSize: 12 }}>Open to all ladies. Registration closes when spots fill up.</p>
            </div>
            <LadiesForm />
          </>
        )}
        {tab === 'youth' && <ComingSoonTab name="Youth Championship Cup" />}
        {tab === 'lpcup' && <ComingSoonTab name="LP Cup" />}
      </div>
    </div>
  );
}

function RegStyles() {
  return (
    <style>{`
      .reg-section-label { font-size: 10px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); border-bottom: 1px solid var(--line); padding-bottom: 6px; }
      .reg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .reg-field { display: flex; flex-direction: column; gap: 5px; }
      .reg-label { font-size: 12px; font-weight: 600; color: var(--text); }
      .reg-hint { font-size: 11px; color: var(--muted); font-weight: 400; }
      .reg-req { color: var(--live); }
      .reg-input {
        padding: 11px 13px; border-radius: 8px; border: 1px solid var(--line);
        background: var(--surface); color: var(--text); font: inherit; font-size: 14px;
        outline: none; transition: border .15s;
      }
      .reg-input:focus { border-color: var(--gold); }
      .reg-check { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; color: var(--muted); cursor: pointer; line-height: 1.4; }
      .reg-check input { margin-top: 2px; flex-shrink: 0; accent-color: var(--gold); width: 16px; height: 16px; }
      @media (max-width: 500px) { .reg-row { grid-template-columns: 1fr; } }
    `}</style>
  );
}
