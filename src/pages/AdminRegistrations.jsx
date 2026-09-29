import { useEffect, useMemo, useState } from 'react';
import { adminSignIn, adminSignOut, getAdminSession, hasAdminAccess, listRegistrations, updateRegistration, trashRegistration, permanentlyDeleteRegistration } from '../lib/supabase';

const EVENTS = { 'kruger-cup-2026': 'Kruger Cup', 'ubuntu-challenge-01': 'Ubuntu Series' };
const ENTRY_STATUSES = ['pending_review', 'approved', 'waitlisted', 'declined', 'cancelled'];
const PAYMENT_STATUSES = ['pending', 'proof_uploaded', 'paid', 'failed', 'refunded', 'waived'];
const label = (value) => value.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function AdminRegistrations() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showTrash, setShowTrash] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');

  async function refresh() {
    setLoading(true); setError('');
    try { setRows(await listRegistrations()); }
    catch (err) { setError(err.message || 'Unable to load registrations.'); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    (async () => {
      const active = await getAdminSession();
      setSession(active);
      if (active) {
        const allowed = await hasAdminAccess(); setIsAdmin(allowed);
        if (allowed) await refresh(); else setLoading(false);
      } else setLoading(false);
    })();
  }, []);

  async function signIn(event) {
    event.preventDefault(); setError(''); setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const auth = await adminSignIn(String(form.get('email')), String(form.get('password')));
      setSession(auth.session);
      const allowed = await hasAdminAccess(); setIsAdmin(allowed);
      if (allowed) await refresh(); else { setError('This account is not yet authorised for the Lowveld Padel registration dashboard.'); setLoading(false); }
    } catch (err) { setError(err.message || 'Sign-in failed.'); setLoading(false); }
  }

  async function signOut() { await adminSignOut(); setSession(null); setIsAdmin(false); setRows([]); }

  async function changeStatus(id, field, value) {
    setSavingId(id); setError('');
    try {
      await updateRegistration(id, { [field]: value });
      setRows((current) => current.map((row) => row.id === id ? { ...row, [field]: value } : row));
    } catch (err) { setError(err.message || 'Could not update registration.'); }
    finally { setSavingId(''); }
  }

  async function removeRegistration(row) {
    if (!row.deleted_at && !window.confirm(`Move registration ${row.reference} (${row.pair_name || row.primary_name}) to trash? You can restore it later.`)) return;
    setSavingId(row.id); setError('');
    try {
      const updated = await trashRegistration(row.id, !row.deleted_at);
      setRows((current) => current.map((entry) => entry.id === row.id ? {...entry, deleted_at: updated.deleted_at} : entry));
    } catch (err) { setError(err.message || 'Could not delete registration.'); }
    finally { setSavingId(''); }
  }

  const canPermanentlyDelete = isAdmin && session?.user?.email?.toLowerCase() === 'admin@lowveldpadel.co.za';

  async function permanentlyRemove(row) {
    if (!canPermanentlyDelete || !row.deleted_at) return;
    const confirmation = window.prompt(`Permanently delete ${row.reference}? This erases the entire registration and cannot be undone. Type the registration reference to confirm:`);
    if (confirmation !== row.reference) return;
    setSavingId(row.id); setError('');
    try {
      await permanentlyDeleteRegistration(row.id);
      setRows((current) => current.filter((entry) => entry.id !== row.id));
    } catch (err) { setError(err.message || 'Could not permanently delete registration.'); }
    finally { setSavingId(''); }
  }

  const activeRows = useMemo(() => rows.filter((row) => !row.deleted_at), [rows]);
  const shown = useMemo(() => rows.filter((row) => Boolean(row.deleted_at) === showTrash && (filter === 'all' || row.event_code === filter)), [rows, filter, showTrash]);
  const totals = useMemo(() => ({ all: activeRows.length, pending: activeRows.filter((r) => r.registration_status === 'pending_review').length, paid: activeRows.filter((r) => r.payment_status === 'paid').length }), [activeRows]);

  if (!session || !isAdmin) return <main className="page"><section className="card reg-admin-login"><span className="chip">Restricted · LP administrators</span><h1 className="display">Registration Admin</h1><p className="muted">Sign in using an authorised Lowveld Padel account. Access is checked against the private admin allowlist.</p>{!session && <form onSubmit={signIn}><label>Email address<input name="email" type="email" autoComplete="username" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label><button className="btn" disabled={loading}>{loading ? 'Checking…' : 'Sign in'}</button></form>}{session && <button className="btn secondary" onClick={signOut}>Sign out</button>}{error && <p className="reg-admin-error" role="alert">{error}</p>}<p className="muted reg-admin-help">First-time access must be enabled by Lowveld Padel. This page does not allow public account creation.</p></section><AdminStyles/></main>;

  return <main className="page"><header className="reg-admin-head"><div><span className="chip">Private dashboard</span><h1 className="display">Registrations</h1><p className="muted">Review entries and manually reconcile EFT payments.</p></div><div className="reg-admin-actions"><button className="btn secondary" onClick={refresh} disabled={loading}>Refresh</button><button className="btn secondary" onClick={signOut}>Sign out</button></div></header>
    <div className="reg-admin-metrics"><div className="card"><small>Total entries</small><b>{totals.all}</b></div><div className="card"><small>Awaiting review</small><b>{totals.pending}</b></div><div className="card"><small>Marked paid</small><b>{totals.paid}</b></div></div>
    <nav className="reg-admin-filters">{[['all','All events'],...Object.entries(EVENTS).map(([id,name])=>[id,name])].map(([id,name])=><button key={id} className={filter===id?'active':''} onClick={()=>setFilter(id)}>{name}</button>)}<button className={showTrash ? 'active' : ''} onClick={()=>setShowTrash(!showTrash)}>{showTrash ? 'Back to active entries' : 'View trash'}</button></nav>
    {error && <p className="reg-admin-error" role="alert">{error}</p>}
    {loading ? <div className="card reg-admin-empty">Loading registrations…</div> : shown.length === 0 ? <div className="card reg-admin-empty">No registrations to show yet.</div> : <section className="reg-admin-list">{shown.map((row)=><article className="card reg-admin-row" key={row.id}>
      <div className="reg-admin-reference"><b>{row.reference}</b><span>{EVENTS[row.event_code] || row.event_code}</span><small>{new Date(row.submitted_at).toLocaleString('en-ZA')}</small></div>
      <div className="reg-admin-player"><b>{row.pair_name || row.primary_name}</b>{(row.participants || []).map((person,index)=><span key={index}>{[person.name,person.surname].filter(Boolean).join(' ')} · {person.mobile}{person.email ? ` · ${person.email}` : ''}</span>)}</div>
      <div className="reg-admin-detail"><span>{row.division ? label(row.division) : row.is_minor ? 'Junior' : 'Individual'}</span><b>{row.payment_amount_cents ? `R${(row.payment_amount_cents / 100).toFixed(0)}` : 'No fee'}</b><small>Email: {label(row.confirmation_email_status || 'not_sent')}</small></div>
      <label>Entry status<select disabled={Boolean(savingId) || Boolean(row.deleted_at)} value={row.registration_status} onChange={(e)=>changeStatus(row.id,'registration_status',e.target.value)}>{ENTRY_STATUSES.map((v)=><option value={v} key={v}>{label(v)}</option>)}</select></label>
      <label>Payment status<select disabled={Boolean(savingId) || Boolean(row.deleted_at)} value={row.payment_status} onChange={(e)=>changeStatus(row.id,'payment_status',e.target.value)}>{PAYMENT_STATUSES.map((v)=><option value={v} key={v}>{label(v)}</option>)}</select></label>
      <div className="reg-admin-delete"><button type="button" disabled={Boolean(savingId)} onClick={()=>removeRegistration(row)} aria-label={`${row.deleted_at ? 'Restore' : 'Move to trash'} ${row.reference}`}>{savingId===row.id ? 'Saving…' : row.deleted_at ? 'Restore registration' : 'Move to trash'}</button>{row.deleted_at && canPermanentlyDelete && <button type="button" disabled={Boolean(savingId)} onClick={()=>permanentlyRemove(row)} aria-label={`Permanently delete ${row.reference}`}>Delete permanently</button>}</div>
    </article>)}</section>}
    <AdminStyles/></main>;
}

function AdminStyles() { return <style>{`.reg-admin-login{max-width:520px;margin:48px auto;padding:26px}.reg-admin-login h1{margin:16px 0 6px}.reg-admin-login form{display:grid;gap:15px;margin:22px 0}.reg-admin-login label,.reg-admin-row label{display:grid;gap:7px;font-weight:750;font-size:12px}.reg-admin-login input,.reg-admin-row select{box-sizing:border-box;width:100%;padding:11px 12px;border:1px solid var(--line);border-radius:9px;background:var(--card);color:inherit}.reg-admin-row select{color:#f7f9ff;color-scheme:dark}.reg-admin-row select option{color:#111827;background:#ffffff}.reg-admin-delete{grid-column:1/-1;display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}.reg-admin-delete button{padding:9px 13px;border:1px solid #b86464;border-radius:8px;background:#301e29;color:#ffd3d3;cursor:pointer}.reg-admin-delete button:disabled{opacity:.6;cursor:wait}.reg-admin-help{font-size:11px;line-height:1.5;margin-top:20px}.reg-admin-error{padding:12px;border:1px solid #9e4444;background:rgba(180,50,50,.15);color:#ffd3d3;border-radius:9px}.reg-admin-head{display:flex;justify-content:space-between;align-items:center;gap:20px}.reg-admin-head h1{margin:10px 0 4px}.reg-admin-actions{display:flex;gap:8px}.reg-admin-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:20px 0}.reg-admin-metrics .card{padding:15px;display:grid;gap:5px}.reg-admin-metrics small,.reg-admin-row small{color:var(--muted)}.reg-admin-metrics b{font:30px var(--display);color:var(--gold)}.reg-admin-filters{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}.reg-admin-filters button{padding:9px 13px;border:1px solid var(--line);border-radius:9px;background:var(--card);color:inherit;cursor:pointer}.reg-admin-filters button.active{border-color:var(--gold);color:var(--gold)}.reg-admin-list{display:grid;gap:10px}.reg-admin-row{padding:15px;display:grid;grid-template-columns:1.1fr 1.6fr 1fr 1fr 1fr;gap:14px;align-items:center}.reg-admin-reference,.reg-admin-player,.reg-admin-detail{display:grid;gap:5px;min-width:0}.reg-admin-reference>b{color:var(--gold);letter-spacing:.04em}.reg-admin-reference span,.reg-admin-player span,.reg-admin-detail span{font-size:12px}.reg-admin-player span,.reg-admin-reference small,.reg-admin-detail small{overflow-wrap:anywhere;color:var(--muted);font-size:11px}.reg-admin-empty{padding:36px;text-align:center;color:var(--muted)}@media(max-width:900px){.reg-admin-row{grid-template-columns:1fr 1fr}.reg-admin-player{grid-column:span 1}}@media(max-width:560px){.reg-admin-head{align-items:flex-start;display:grid}.reg-admin-row{grid-template-columns:1fr}.reg-admin-player{grid-column:auto}.reg-admin-metrics .card{padding:11px}.reg-admin-metrics b{font-size:24px}}`}</style>; }
