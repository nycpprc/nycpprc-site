const t=document.querySelector('.nav-toggle'),n=document.getElementById('nav');
t&&t.addEventListener('click',()=>{const o=n.classList.toggle('open');t.setAttribute('aria-expanded',o)});
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const TZ={timeZone:'America/New_York'};
const fmt=(d,o)=>new Intl.DateTimeFormat('en-US',{...TZ,...o}).format(d);
async function j(u){const r=await fetch(u,{cache:'no-cache'});if(!r.ok)throw r;return r.json()}
const evEl=document.getElementById('events');
if(evEl){let all=[],f='all',shown=8;const more=document.getElementById('more');
 const render=()=>{const list=all.filter(e=>f=='all'||(f=='online')==e.online);
  evEl.innerHTML=list.length?list.slice(0,shown).map(e=>{const d=new Date(e.start);return `<li class="event"><div class="date" aria-hidden="true"><span>${fmt(d,{month:'short'})}</span><b>${fmt(d,{day:'numeric'})}</b><span>${fmt(d,{weekday:'short'})}</span></div><div><h3><a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.title)}</a></h3><p class="meta"><span class="tag ${e.online?'on':''}">${e.online?'Online':'In person'}</span><time datetime="${e.start}">${fmt(d,{weekday:'long',month:'long',day:'numeric',hour:'numeric',minute:'2-digit'})} ET</time></p><p class="meta">${e.online?'':'📍 '+esc(e.venue)+' · '}${e.hosts.length?'Hosted by '+esc(e.hosts.join(', ')):''}${e.going!=null?' · '+e.going+' going':''}</p></div></li>`}).join(''):'<li class="muted">No upcoming events listed right now — check <a href="https://www.meetup.com/reading-philosophy/events/">Meetup</a>.</li>';
  more.hidden=list.length<=shown};
 more.onclick=()=>{shown+=8;render()};
 document.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{document.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===c));f=c.dataset.f;shown=8;render()});
 j('data/events.json').then(d=>{all=d.upcoming.filter(e=>new Date(e.end||e.start)>new Date());render();document.getElementById('events-meta').textContent='Updated from Meetup '+fmt(new Date(d.generated),{dateStyle:'medium',timeStyle:'short'})+' ET.'}).catch(()=>evEl.innerHTML='<li>See all events on <a href="https://www.meetup.com/reading-philosophy/events/">Meetup</a>.</li>');
 j('data/hosts.json').then(d=>{document.getElementById('hosts').innerHTML=d.hosts.map(h=>`<li class="host">${h.photo?`<img src="${esc(h.photo)}" alt="" loading="lazy" width="76" height="76">`:`<span class="ph" aria-hidden="true">${esc((h.name||'?').trim()[0])}</span>`}<a href="${esc(h.profileUrl)}" target="_blank" rel="noopener">${esc(h.name)}</a><small>${h.eventsHosted} event${h.eventsHosted>1?'s':''} · last ${fmt(new Date(h.lastHosted),{month:'short',day:'numeric'})}</small></li>`).join('');}).catch(()=>{});
 j('data/news.json').then(d=>{if(!d.items.length)return;document.getElementById('news-section').hidden=false;document.getElementById('news').innerHTML=d.items.map(i=>`<article><p class="muted small">${esc(i.date)}</p><h3>${i.url?`<a href="${esc(i.url)}">${esc(i.title)}</a>`:esc(i.title)}</h3><p>${esc(i.body)}</p></article>`).join('')}).catch(()=>{});
}
document.querySelectorAll('.nl-form[data-placeholder=true]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const m=f.parentElement.querySelector('#nl-msg');if(m)m.textContent='Newsletter signup is coming soon. In the meantime, join us on Meetup.'}));
