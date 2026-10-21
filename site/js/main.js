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
/* Inline Mailchimp signup via JSONP (/subscribe/post + &c=callback; /subscribe/post-json currently 404s). Without JS, forms fall back to a normal POST. */
(function(){
  function clean(s){var d=document.createElement('div');d.innerHTML=String(s||'');return (d.textContent||'').replace(/^\s*\d+\s*-\s*/,'').trim();}
  function nice(m){
    if(/already subscribed/i.test(m))return "You're already subscribed. Thanks!";
    if(/too many/i.test(m))return 'Too many attempts with this address. Please try again later.';
    return m||'Something went wrong. Please try again.';
  }
  document.querySelectorAll('form[action*="list-manage.com/subscribe/post"]').forEach(function(f){
    f.removeAttribute('target');
    var st=document.createElement('p');st.className='mc-status';st.setAttribute('role','status');st.setAttribute('aria-live','polite');
    f.parentNode.insertBefore(st,f.nextSibling);
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var btn=f.querySelector('[type=submit]');if(btn&&btn.disabled)return;
      var cb='mcCb'+Date.now()+Math.floor(Math.random()*1e4);
      var url=f.action+'&c='+cb+'&'+new URLSearchParams(new FormData(f)).toString();
      var s=document.createElement('script'),done=false;
      function end(ok,msg){if(done)return;done=true;try{delete window[cb];}catch(x){window[cb]=undefined;}s.remove();clearTimeout(t);
        if(btn)btn.disabled=false;st.textContent=msg;st.className='mc-status '+(ok?'mc-ok':'mc-err');if(ok)f.reset();}
      window[cb]=function(r){r=r||{};end(r.result==='success',r.result==='success'?"Thanks, you're subscribed.":nice(clean(r.msg)));};
      var t=setTimeout(function(){end(false,'Could not reach the signup service. Please try again.');},12000);
      s.onerror=function(){end(false,'Could not reach the signup service. Please try again.');};
      if(btn)btn.disabled=true;st.className='mc-status';st.textContent='Subscribing…';
      s.src=url;document.body.appendChild(s);
    });
  });
})();
/* Native forms posting to Google Forms' public formResponse endpoint (no-cors, opaque response), with optional Mailchimp opt-in via the same JSONP endpoint. */
(function(){
  var MC='https://art.us13.list-manage.com/subscribe/post?u=26b814ae42c6bb5b260c0ebf5&id=24033953d1';
  function mcSubscribe(email,tag){return new Promise(function(res){
    var cb='mcCb'+Date.now()+Math.floor(Math.random()*1e4),s=document.createElement('script');
    var q=new URLSearchParams({EMAIL:email,tags:tag,b_26b814ae42c6bb5b260c0ebf5_24033953d1:''});
    var t=setTimeout(function(){fin(null)},12000);
    function fin(r){clearTimeout(t);try{delete window[cb]}catch(x){window[cb]=undefined}s.remove();res(r)}
    window[cb]=fin;s.onerror=function(){fin(null)};s.src=MC+'&c='+cb+'&'+q.toString();document.body.appendChild(s);});}
  document.querySelectorAll('form.gform').forEach(function(f){
    var opt=f.querySelector('[data-mc-optin]'),st=f.querySelector('.gf-status'),btn=f.querySelector('[type=submit]');
    f.addEventListener('submit',function(e){
      e.preventDefault();if(btn.disabled)return;
      var fd=new FormData(f),body=new URLSearchParams();
      fd.forEach(function(v,k){if(/^entry\.\d+(\.other_option_response)?$/.test(k))body.append(k,v);});
      var emEl=f.querySelector('[data-mc-email]'),email=emEl&&emEl.value.trim();
      if(opt&&opt.checked&&!(email&&emEl.checkValidity())){st.className='gf-status mc-err';st.textContent='Please enter a valid email address to get the newsletter.';emEl&&emEl.focus();return;}
      btn.disabled=true;st.className='gf-status';st.textContent='Sending…';
      fetch(f.action,{method:'POST',mode:'no-cors',body:body}).then(function(){
        var mc=opt&&opt.checked?mcSubscribe(email,f.dataset.mcTag):Promise.resolve(false);
        return mc.then(function(r){
          var th=f.parentNode.querySelector('.gf-thanks');
          if(r!==false){var p=document.createElement('p');p.className='mc-status '+(r&&(r.result==='success'||/already subscribed/i.test(r.msg))?'mc-ok':'mc-err');
            p.textContent=r&&r.result==='success'?'Almost done: check your inbox to confirm your newsletter subscription.':r&&/already subscribed/i.test(r.msg)?"You're already on the newsletter list.":'We couldn’t sign you up for the newsletter just now; you can try again from the form at the bottom of the page.';th.appendChild(p);}
          f.hidden=true;th.hidden=false;th.focus();
        });
      }).catch(function(){btn.disabled=false;st.className='gf-status mc-err';st.textContent='Could not send your response. Please try again, or use the Google Form link below.';});
    });
  });
})();
