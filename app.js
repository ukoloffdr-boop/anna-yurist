const $=s=>document.querySelector(s),chat=$('#chat');
const tg=window.Telegram&&Telegram.WebApp;
function initTg(){const t=window.Telegram&&Telegram.WebApp;if(!t||!t.initData)return;t.ready();t.expand();const p=t.themeParams||{};
 if(p.bg_color)document.body.style.background=p.bg_color;if(p.text_color)document.body.style.color=p.text_color;}
window.addEventListener('load',initTg);
const CAT=Object.fromEntries(CATS.map(c=>[c.id,c]));
function listInto(el,cid){el.innerHTML='';KB.filter(k=>k.c===cid).forEach(k=>{const b=document.createElement('button');b.type='button';b.textContent=k.q;b.onclick=()=>{setMore(false);ask(k.q,k)};el.appendChild(b)})}
function pickW(cid){document.querySelectorAll('#wcats button').forEach(b=>b.classList.toggle('on',b.dataset.c===cid));$('#wqh').textContent=CAT[cid].t;listInto($('#wchips'),cid)}
function pickM(cid){document.querySelectorAll('#seg button').forEach(b=>{const on=b.dataset.c===cid;b.classList.toggle('on',on);if(on&&!$('#chips').hidden)b.scrollIntoView({block:'nearest',inline:'center'})});listInto($('#mq'),cid)}
CATS.forEach(c=>{const n=KB.filter(k=>k.c===c.id).length;
 const w=document.createElement('button');w.type='button';w.dataset.c=c.id;w.innerHTML='<b>'+c.t+'</b><span>'+c.d+'</span><em>'+n+' вопр.</em>';w.onclick=()=>{pickW(c.id);$('#wqh').scrollIntoView({behavior:'smooth',block:'start'})};$('#wcats').appendChild(w);
 const s=document.createElement('button');s.type='button';s.dataset.c=c.id;s.textContent=c.t;s.onclick=()=>pickM(c.id);$('#seg').appendChild(s)});
pickW('np');pickM('np');
function setMore(o){$('#chips').hidden=!o;if(o&&lastC)pickM(lastC);$('#tgl').textContent=o?'✕ Скрыть вопросы':'💬 Другие вопросы ▴'}
$('#tgl').onclick=()=>setMore($('#chips').hidden);
const norm=s=>s.toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9 ]/g,' ');
function find(q){const w=norm(q).split(/\s+/).filter(x=>x.length>2);let best=null,bs=0;
 const sc=hay=>{let s=0;w.forEach(x=>{const st=x.slice(0,Math.max(4,x.length-2));if(hay.includes(st))s+=1});return s};
 KB.forEach(k=>{const s=sc(norm(k.k+' '+k.q));if(s>bs){bs=s;best=k}});
 (window.NORMS||[]).forEach(n=>{const s=sc(norm(n.k+' '+n.sum+' '+n.act+' '+n.num));if(s>bs+1){bs=s;const o=KB.find(k=>k.n&&k.n.includes(n.id));best={c:o?o.c:'as',a:n.sum+'<br><br><i>Это пересказ нормы, а не юридическое заключение. Уточните применение в юридическом отделе Ассоциации: 8 (017) 322-03-53.</i>',s:['Официальный текст на pravo.by'],n:[n.id]}}});return bs?best:null}
function legal(k){if(!k.n||!window.NORMS)return'';const L=k.n.map(id=>NORMS.find(n=>n.id===id)).filter(Boolean);if(!L.length)return'';
 return '<div class="law"><b>⚖️ Правовая основа</b>'+L.map(n=>'<div class="ln"><a href="'+n.url+'" target="_blank" rel="noopener">'+esc(n.act)+' от '+n.date+' '+n.num+', '+n.art+'</a>'+(n.quote?'<q>'+esc(n.quote)+'</q>':'')+'<small>'+esc(n.ed)+'</small></div>').join('')+'</div>'}
function add(html,cls){const d=document.createElement('div');d.className='msg '+cls;d.innerHTML=html;chat.appendChild(d);d.scrollIntoView({behavior:'smooth',block:'start'});return d}
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let lastC=null;
function ask(q,k){$('#welcome')&&$('#welcome').remove();$('#more').hidden=false;add(esc(q),'me');k=k||find(q);if(k)lastC=k.c;
 setTimeout(()=>{let h;if(k){h='<span class="tag">'+CAT[k.c].t+'</span><br>'+k.a+legal(k)+'<div class="src">📄 Источник: '+k.s.join('; ')+'</div>'}
  else h='В бюллетенях и новостях Ассоциации я не нашла ответа на этот вопрос. Не хочу ничего выдумывать — лучше уточнить у специалистов Ассоциации.';
  h+='<div class="acts">'+(k&&k.form?'<button class="btn" data-open="form">📝 Подать предложение</button>':'')+'<button class="btn o" data-open="contact">Нужен юрист / Связаться с ассоциацией</button></div>';
  const m=add(h,'bot');const ad=document.createElement('div');ad.className='ad';ad.innerHTML='<em>Реклама</em><b>Партнёр Ассоциации</b> — здесь может быть предложение партнёра (пример размещения, макет).';m.after(ad);m.scrollIntoView({behavior:'smooth',block:'start'})},350)}
$('#ask').onsubmit=e=>{e.preventDefault();const v=$('#q').value.trim();if(v){ask(v);$('#q').value=''}};
document.addEventListener('click',e=>{const o=e.target.closest('[data-open]');if(o)$('#'+o.dataset.open).classList.add('on');
 if(e.target.closest('[data-close]')||e.target.classList.contains('sheet'))document.querySelectorAll('.sheet').forEach(s=>s.classList.remove('on'))});
$('#pf').onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));
 const body=`Предложение в Национальную платформу бизнеса Беларуси 2027–2029 гг.\n\nКомпания: ${f.company}\nУНП: ${f.unp||'—'}\nРегион: ${f.region}\n\nПроблема:\n${f.problem}\n\nПредложение:\n${f.proposal}\n\nКонтакт: ${f.contact||'—'}\n\n(отправлено через «Алеся-Юрист»)`;
 const url='mailto:bsp_prom@mail.ru?subject='+encodeURIComponent('Предложение в Нацплатформу бизнеса 2027–2029 — '+f.company)+'&body='+encodeURIComponent(body);
 if(tg&&tg.initData&&tg.openLink)tg.openLink(url);else location.href=url};
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
