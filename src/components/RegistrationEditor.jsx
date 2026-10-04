import { useState } from 'react';
import { updateRegistrationDetails } from '../lib/supabase';

export default function RegistrationEditor({row,onSaved,onCancel}) {
 const [busy,setBusy]=useState(false),[error,setError]=useState('');
 const pair=row.registration_type==='pair';
 async function save(event){
  event.preventDefault();const form=new FormData(event.currentTarget);setBusy(true);setError('');
  try{
   const participants=row.participants.map((person,i)=>{
    const updated={...person};
    for(const field of ['name','surname','mobile','email','level','dateOfBirth','gender','team']){
     if(form.has(`${i}-${field}`)) updated[field]=String(form.get(`${i}-${field}`)).trim();
    }
    updated.email=updated.email.toLowerCase();
    if(updated.name.length<(pair?3:2)||!/^\+?[\d()\s-]{8,20}$/.test(updated.mobile))throw new Error('Please enter a valid player name and mobile number.');
    return updated;
   });
   const first=participants[0];
   if(!pair && (!first.dateOfBirth || first.dateOfBirth>new Date().toISOString().slice(0,10)))throw new Error('Enter a valid date of birth in the past.');
   const changes={participants,primary_name:[first.name,first.surname].filter(Boolean).join(' '),primary_email:first.email,primary_mobile:first.mobile};
   if(!pair){const dob=new Date(first.dateOfBirth+'T00:00:00');const now=new Date();let age=now.getFullYear()-dob.getFullYear();if(now.getMonth()<dob.getMonth()||(now.getMonth()===dob.getMonth()&&now.getDate()<dob.getDate()))age--;changes.is_minor=age<18;}
   if(pair){changes.pair_name=String(form.get('pair_name')).trim()||null;changes.division=form.get('division');}
   const saved=await updateRegistrationDetails(row.id,changes,row.updated_at);
   onSaved(saved);
  }catch(err){setError(err.message||'Could not save changes.');}finally{setBusy(false);}
 }
 return <form className="reg-editor" onSubmit={save}><h3>Edit {row.reference}</h3><p>Correct the details below and save. The first player remains the primary contact. Saving does not send a new confirmation email.</p><fieldset disabled={busy}>
 {pair&&<div className="reg-editor-grid"><label>Pair / team name<input name="pair_name" maxLength="80" defaultValue={row.pair_name||''}/></label><label>Division<select name="division" required defaultValue={row.division||'unsure'}><option value="championship">Championship</option><option value="challenger">Challenger</option><option value="unsure">Unsure / placement needed</option></select></label></div>}
 {row.participants.map((person,i)=><section key={i}><h4>Player {i+1}</h4><div className="reg-editor-grid"><label>{pair?'Name and surname':'First name'}<input autoFocus={i===0} name={`${i}-name`} required minLength={pair?3:2} maxLength="120" defaultValue={person.name||''}/></label>{!pair&&<label>Surname<input name={`${i}-surname`} required minLength="2" maxLength="80" defaultValue={person.surname||''}/></label>}<label>Mobile number<input name={`${i}-mobile`} type="tel" required minLength="8" maxLength="20" defaultValue={person.mobile||''}/></label><label>Email address<input name={`${i}-email`} type="email" required maxLength="160" defaultValue={person.email||''}/></label>{pair?<label>Playing level<select name={`${i}-level`} required defaultValue={person.level||'Unranked / unsure'}>{[...new Set(['P1','P2','P3','Unranked / unsure',person.level].filter(Boolean))].map(v=><option key={v}>{v}</option>)}</select></label>:<><label>Date of birth<input name={`${i}-dateOfBirth`} type="date" required defaultValue={person.dateOfBirth||''}/></label><label>Gender<select name={`${i}-gender`} required defaultValue={person.gender||''}><option value="" disabled>Select</option><option>Male</option><option>Female</option></select></label><label>Team / division<input name={`${i}-team`} required maxLength="80" defaultValue={person.team||''}/></label></>}</div></section>)}
 </fieldset>{error&&<p className="reg-admin-error" role="alert">{error}</p>}<div className="reg-admin-actions"><button className="btn" disabled={busy}>{busy?'Saving…':'Save changes'}</button><button className="btn secondary" type="button" disabled={busy} onClick={onCancel}>Cancel</button></div></form>
}
