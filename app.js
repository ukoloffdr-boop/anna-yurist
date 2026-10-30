const $=s=>document.querySelector(s),chat=$('#chat');
const tg=window.Telegram&&Telegram.WebApp;
function initTg(){const t=window.Telegram&&Telegram.WebApp;if(!t||!t.initData)return;t.ready();t.expand();const p=t.themeParams||{};
 if(p.bg_color)document.body.style.background=p.bg_color;if(p.text_color)document.body.style.color=p.text_color;}
window.addEventListener('load',initTg);
const PRESET=KB.map(x=>x);
function chipsInto(el,cls){PRESET.forEach(k=>{const b=document.createElement('button');b.textContent=k.q;b.onclick=()=>ask(k.q,k);el.appendChild(b)})}
chipsInto($('#wchips'));chipsInto($('#chips'));
const norm=s=>s.toLowerCase().replace(/ё/g,'е').replace(/[^a-zа-я0-9 ]/g,' ');
function find(q){const w=norm(q).split(/\s+/).filter(x=>x.length>2);let best=null,bs=0;
 KB.forEach(k=>{const hay=norm(k.k+' '+k.q);let s=0;w.forEach(x=>{const st=x.slice(0,Math.max(4,x.length-2));if(hay.includes(st))s+=1});if(s>bs){bs=s;best=k}});return bs?best:null}
function add(html,cls){const d=document.createElement('div');d.className='msg '+cls;d.innerHTML=html;chat.appendChild(d);d.scrollIntoView({behavior:'smooth',block:'start'});return d}
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function ask(q,k){$('#welcome')&&$('#welcome').remove();$('#chips').hidden=false;add(esc(q),'me');k=k||find(q);
 setTimeout(()=>{let h;if(k){h=k.a+'<div class="src">📄 Источник: '+k.s.join('; ')+'</div>'}
  else h='В Информационном бюллетене №3 я не нашла ответа на этот вопрос. Не хочу ничего выдумывать — лучше уточнить у специалистов Ассоциации.';
  h+='<div class="acts">'+(k&&k.form?'<button class="btn" data-open="form">📝 Подать предложение</button>':'')+'<button class="btn o" data-open="contact">Нужен юрист / Связаться с ассоциацией</button></div>';
  const m=add(h,'bot');const ad=document.createElement('div');ad.className='ad';ad.innerHTML='<em>Реклама</em><b>Партнёр Ассоциации</b> — здесь может быть предложение партнёра (пример размещения, макет).';m.after(ad);m.scrollIntoView({behavior:'smooth',block:'start'})},350)}
$('#ask').onsubmit=e=>{e.preventDefault();const v=$('#q').value.trim();if(v){ask(v);$('#q').value=''}};
document.addEventListener('click',e=>{const o=e.target.closest('[data-open]');if(o)$('#'+o.dataset.open).classList.add('on');
 if(e.target.closest('[data-close]')||e.target.classList.contains('sheet'))document.querySelectorAll('.sheet').forEach(s=>s.classList.remove('on'))});
$('#pf').onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));
 const body=`Предложение в Национальную платформу бизнеса Беларуси 2027–2029 гг.\n\nКомпания: ${f.company}\nУНП: ${f.unp||'—'}\nРегион: ${f.region}\n\nПроблема:\n${f.problem}\n\nПредложение:\n${f.proposal}\n\nКонтакт: ${f.contact||'—'}\n\n(отправлено через «Анна-Юрист»)`;
 const url='mailto:bsp_prom@mail.ru?subject='+encodeURIComponent('Предложение в Нацплатформу бизнеса 2027–2029 — '+f.company)+'&body='+encodeURIComponent(body);
 if(tg&&tg.initData&&tg.openLink)tg.openLink(url);else location.href=url};
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
