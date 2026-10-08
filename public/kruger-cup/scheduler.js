/* Kruger Cup fixture generator: published group times are drafts, knockout durations estimates */
(function(root){'use strict';
const fmt=n=>String(Math.floor(n/60)%24).padStart(2,'0')+':'+String(n%60).padStart(2,'0');
const key=(a,b)=>[a,b].sort().join('|');
function rounds(ids){const x=ids.slice();if(x.length%2)x.push(null);const o=[];for(let r=0;r<x.length-1;r++){const a=[];for(let i=0;i<x.length/2;i++){if(x[i]&&x[x.length-i-1])a.push([x[i],x[x.length-i-1]])}o.push(a);x.splice(1,0,x.pop())}return o}
function generate(teams,fixtures,options={}){
 const courts=Number(options.courts||3),full=Number(options.fullMatchMinutes||60),rest=Number(options.rest??10);
 if(courts<3||courts>8||full<60||full>180||rest<0||rest>60)throw Error('Invalid settings');
 const map=new Map(fixtures.map(x=>[key(x.a,x.b),x])),busy=Array.from({length:courts},()=>[]),previous=new Map(),list=[],warnings=[];
 function add(m,start,c,duration,extras={}){const x={...m,...extras,date:start>=1440?'2026-10-11':'2026-10-10',time:fmt(start),court:String(c+1),duration,start,end:start+duration};if(busy[c].some(o=>o.start<x.end&&x.start<o.end))throw Error('Court double-booked at '+fmt(start));if(x.phase==='group'){for(const p of [m.a,m.b]){if(start<(previous.get(p)??-100)+20)throw Error('Insufficient pair rest '+p);previous.set(p,x.end)}}busy[c].push(x);list.push(x);return x}
 const ids=(d,g)=>teams.filter(t=>t.division===d&&t.group===g).sort((a,b)=>a.id.localeCompare(b.id)).map(t=>t.id);
 for(let r=0;r<7;r++)for(const [g,offset] of [['A',0],['B',20]])rounds(ids('Challenger',g))[r].forEach(([a,b],i)=>{const m=map.get(key(a,b));if(!m)throw Error('Missing Challenger fixture');const delay=courts===3&&r===6&&g==='B'&&i===2;add(m,480+r*40+offset+(delay?20:0),delay?0:i,20,{phase:'group'})});
 const championship=[],champLast=new Map();
 for(let r=0;r<3;r++){const pending=[];for(const g of ['A','B','C'])for(const [a,b] of rounds(ids('Championship',g))[r])pending.push(map.get(key(a,b)));
 while(pending.length){let best=null;for(let i=0;i<pending.length;i++)for(let c=0;c<courts;c++){const m=pending[i];if(!m)throw Error('Missing Championship fixture');let start=Math.max(750,(champLast.get(m.a)??0)+20,(champLast.get(m.b)??0)+20);for(const o of [...busy[c]].sort((a,b)=>a.start-b.start)){if(start+30<=o.start)break;if(start<o.end&&o.start<start+30)start=o.end}if(!best||start<best.start||(start===best.start&&c<best.c))best={i,c,start}}const m=pending.splice(best.i,1)[0],x=add(m,best.start,best.c,30,{phase:'group'});championship.push(x);champLast.set(m.a,x.end);champLast.set(m.b,x.end)}}
 const groups=list.slice(),groupEnd=Math.max(...groups.map(x=>x.end));if(groups.length!==60||championship.length!==18)throw Error('Expected 60 fixtures');if(groupEnd>990)warnings.push('Group games extend after 16:30, confirm qualifiers first.');
 const defs=new Map(),placed=new Map(),knockouts=[];
 function def(d,p,n,a,b,deps=[]){const id='K-'+d+'-'+p+'-'+n;defs.set(id,{id,division:d==='H'?'Challenger':'Championship',phase:p==='Q'?'Quarterfinal':p==='S'?'Semifinal':'Final',group:'',aLabel:a,bLabel:b,depends:deps})}
 [['A1','B4'],['A2','B3'],['B1','A4'],['B2','A3']].forEach(([a,b],i)=>def('H','Q',i+1,a,b));
 [['Seed 1','Seed 8'],['Seed 4','Seed 5'],['Seed 2','Seed 7'],['Seed 3','Seed 6']].forEach(([a,b],i)=>def('P','Q',i+1,a,b));
 for(const d of ['H','P']){for(let i=1;i<=2;i++)def(d,'S',i,'Winner QF'+(2*i-1),'Winner QF'+(2*i),['K-'+d+'-Q-'+(2*i-1),'K-'+d+'-Q-'+(2*i)]);def(d,'F',1,'Winner SF1','Winner SF2',['K-'+d+'-S-1','K-'+d+'-S-2'])}
 function free(from,dur){let best=null;for(let c=0;c<courts;c++){let at=from;for(const o of [...busy[c]].sort((a,b)=>a.start-b.start)){if(at+dur<=o.start)break;if(at<o.end&&o.start<at+dur)at=o.end}if(!best||at<best.at||(at===best.at&&c<best.c))best={at,c}}return best}
 function put(id,start,c,dur){const d=defs.get(id);if(d.depends.some(k=>!placed.has(k)))throw Error('Missing prerequisite '+id);if(d.depends.some(k=>start<placed.get(k).end+rest))throw Error('Knockout recovery conflict '+id);const item=add(d,start,c,dur,{provisional:true});knockouts.push(item);placed.set(id,item)}
 const slots=[['H','Q',1,1,990],['H','Q',2,2,990],['H','Q',3,3,990],['H','Q',4,2,1050],['P','Q',3,1,1050],['P','Q',4,3,1050],['P','Q',1,1,1110],['P','Q',2,3,1110],['H','S',1,2,1110],['H','S',2,1,1170],['P','S',2,2,1170],['P','S',1,3,1180],['H','F',1,2,1240],['P','F',1,1,1250]];
 if(courts===3&&full===60&&rest===10&&Math.max(...championship.map(x=>x.end))<=990){for(const [d,p,n,c,t] of slots)put('K-'+d+'-'+p+'-'+n,t,c-1,60)}
 else{const order=['K-H-Q-1','K-H-Q-2','K-H-Q-3','K-H-Q-4','K-P-Q-1','K-P-Q-2','K-P-Q-3','K-P-Q-4','K-H-S-1','K-P-S-1','K-H-S-2','K-P-S-2','K-H-F-1','K-P-F-1'];for(const id of order){const defn=defs.get(id),dur=id.startsWith('K-H-Q')?60:full,minimum=Math.max(0,...defn.depends.map(k=>placed.get(k).end+rest)),from=id.startsWith('K-H-Q')?990:id.startsWith('K-P-Q')?Math.max(1050,...championship.map(x=>x.end)):990,slot=free(Math.max(minimum,from),dur);put(id,slot.at,slot.c,dur)}}
 const finish=Math.max(...knockouts.map(x=>x.end)),fit=finish<=1320;
 warnings.unshift(fit?'Estimated finish '+fmt(finish)+', no guarantee of 22:00 finish.':'Over 22:00 cutoff: projected '+fmt(finish)+'.');
 warnings.push('Full-set knockout durations are estimates; the official rules do not impose fixed 60-minute matches.');
 return{groups,knockouts,warnings,summary:{hardStop:'22:00',meetsHardStop:fit,overrunMinutes:Math.max(0,finish-1320),courts,fullMatchMinutes:full,rest,challengerStart:'08:00',championshipStart:'12:30',challengerQFStart:'16:30',championshipQFStart:fmt(Math.min(...knockouts.filter(x=>x.id.startsWith('K-P-Q')).map(x=>x.start))),lastGroupMatch:fmt(groupEnd),finalsEnd:fmt(finish),finalsNextDay:finish>=1440,totalGroupMatches:60,totalKnockouts:14}};
}
root.KrugerScheduler={generate,rounds};
})(typeof window==='undefined'?globalThis:window);