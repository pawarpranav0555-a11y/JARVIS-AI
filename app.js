'use strict';
const $ = id => document.getElementById(id);
const STORE = {notes:'jarvis_v1_notes',tasks:'jarvis_v1_tasks',reminders:'jarvis_v1_reminders'};
let lastReply = 'नमस्कार! मी JARVIS आहे.';
let recognition = null;
const read = key => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };
const write = (key,value) => localStorage.setItem(key,JSON.stringify(value));
function addMessage(text,who='bot'){const el=document.createElement('div');el.className='msg '+who;el.textContent=text;$('chat').append(el);$('chat').scrollTop=$('chat').scrollHeight;}
function speak(text){if(!('speechSynthesis' in window)){ $('voiceState').textContent='या browser मध्ये Text-to-Speech उपलब्ध नाही.';return;}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=/[\u0900-\u097F]/.test(text)?'mr-IN':'en-IN';u.rate=1.02;u.pitch=1.12;speechSynthesis.speak(u);}
function localReply(raw){
 const q=raw.trim().toLowerCase();
 if(!q)return 'कृपया काहीतरी विचार.';
 if(/^(hi|hello|नमस्कार|हॅलो|राम.?राम)/i.test(q))return 'नमस्कार! मी तयार आहे. आज काय करूया?';
 if(/तारीख|date|आज कोणता वार/.test(q))return 'आजची तारीख: '+new Date().toLocaleDateString('mr-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
 if(/वेळ|time|किती वाजले/.test(q))return 'आत्ताची वेळ: '+new Date().toLocaleTimeString('mr-IN');
 if(/माझ्या नोट्स|notes दाखव/.test(q)){const a=read(STORE.notes);return a.length?'तुझ्या नोट्स:\\n'+a.map((x,i)=>(i+1)+'. '+x.text).join('\\n'):'अजून नोट्स सेव्ह नाहीत.';}
 if(/माझी कामे|कामे दाखव|tasks/.test(q)){const a=read(STORE.tasks);return a.length?'तुझी कामे:\\n'+a.map((x,i)=>(i+1)+'. '+(x.done?'✓ ':'')+x.text).join('\\n'):'अजून कामे नाहीत.';}
 if(/मदत|help/.test(q))return 'मी आत्ता तारीख/वेळ सांगू शकतो, नोट्स व कामे सेव्ह करू शकतो आणि reminders सेट करू शकतो. प्रगत प्रश्नांसाठी Online AI जोडणी पुढील टप्प्यात करायची आहे.';
 if(/उदास|वाईट वाट|sad|tension|टेंशन|काळजी/.test(q))return 'अरे, काय झालं? निवांत सांग. मी ऐकतोय. तुला कशी मदत करू?';
 if(/धन्यवाद|thank you/.test(q))return 'काही हरकत नाही! मी मदतीसाठी आहे.';
 return 'तुझं म्हणणं समजलं. माझा स्थानिक AI सध्या प्राथमिक आहे. इंटरनेटवरील प्रगत AI मेंदू पुढील सुरक्षित integration मध्ये जोडू. तू मला अजून सांग, काय करायचं आहे?';
}
function reply(q){const answer=localReply(q);lastReply=answer;addMessage(answer);speak(answer);}
function send(){const v=$('message').value.trim();if(!v)return;addMessage(v,'user');$('message').value='';reply(v);}
$('send').addEventListener('click',send);
$('message').addEventListener('keydown',e=>{if(e.key==='Enter')send();});
$('speak').addEventListener('click',()=>speak(lastReply));
$('stop').addEventListener('click',()=>{if('speechSynthesis'in window)speechSynthesis.cancel();});
$('listen').addEventListener('click',()=>{
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
 if(!SR){$('voiceState').textContent='Speech recognition उपलब्ध नाही. Typing वापर.';return;}
 try{if(recognition)recognition.abort();recognition=new SR();recognition.lang='mr-IN';recognition.interimResults=false;recognition.maxAlternatives=1;
 recognition.onstart=()=>$('voiceState').textContent='● ऐकतोय...';
 recognition.onresult=e=>{const t=e.results?.[0]?.[0]?.transcript||'';if(t){addMessage(t,'user');reply(t);}};
 recognition.onerror=e=>$('voiceState').textContent='Mic/Speech error: '+e.error+'. Permission तपास.';
 recognition.onend=()=>$('voiceState').textContent='Voice ready.';
 recognition.start();}catch(err){$('voiceState').textContent='Voice सुरू झाले नाही. पुन्हा प्रयत्न कर.';}
});
$('notify').addEventListener('click',async()=>{if(!('Notification'in window)){addMessage('या browser मध्ये notifications नाहीत.');return;}try{const p=await Notification.requestPermission();addMessage(p==='granted'?'Notifications परवानगी मिळाली.':'Notifications परवानगी मिळाली नाही.');}catch{addMessage('Notifications सुरू करता आले नाहीत.');}});
document.querySelectorAll('[data-command]').forEach(b=>b.addEventListener('click',()=>{addMessage(b.dataset.command,'user');reply(b.dataset.command);}));
function renderNotes(){const root=$('notes');root.replaceChildren();read(STORE.notes).forEach((n,i)=>{const d=document.createElement('div');d.className='item';const s=document.createElement('span');s.textContent=n.text;const b=document.createElement('button');b.className='danger';b.textContent='×';b.setAttribute('aria-label','Delete note');b.onclick=()=>{const a=read(STORE.notes);a.splice(i,1);write(STORE.notes,a);renderNotes();};d.append(s,b);root.append(d);});}
$('saveNote').onclick=()=>{const v=$('noteText').value.trim();if(!v)return;const a=read(STORE.notes);a.unshift({text:v,createdAt:Date.now()});write(STORE.notes,a);$('noteText').value='';renderNotes();addMessage('ठीक आहे, नोट सेव्ह केली.');};
function renderTasks(){const root=$('tasks');root.replaceChildren();read(STORE.tasks).forEach((t,i)=>{const d=document.createElement('div');d.className='item';const c=document.createElement('input');c.type='checkbox';c.checked=!!t.done;c.style.flex='0 0 auto';c.onchange=()=>{const a=read(STORE.tasks);a[i].done=c.checked;write(STORE.tasks,a);renderTasks();};const s=document.createElement('span');s.textContent=t.text;if(t.done)s.style.textDecoration='line-through';const b=document.createElement('button');b.className='danger';b.textContent='×';b.onclick=()=>{const a=read(STORE.tasks);a.splice(i,1);write(STORE.tasks,a);renderTasks();};d.append(c,s,b);root.append(d);});}
$('addTask').onclick=()=>{const v=$('taskText').value.trim();if(!v)return;const a=read(STORE.tasks);a.push({text:v,done:false,createdAt:Date.now()});write(STORE.tasks,a);$('taskText').value='';renderTasks();};
function renderReminders(){const root=$('reminders');root.replaceChildren();read(STORE.reminders).forEach((r,i)=>{const d=document.createElement('div');d.className='item';const s=document.createElement('span');s.textContent=new Date(r.at).toLocaleString()+' · '+r.text;const b=document.createElement('button');b.className='danger';b.textContent='×';b.onclick=()=>{const a=read(STORE.reminders);a.splice(i,1);write(STORE.reminders,a);renderReminders();};d.append(s,b);root.append(d);});}
$('addReminder').onclick=()=>{const text=$('reminderText').value.trim(),at=$('reminderTime').value;if(!text||!at){addMessage('आठवण आणि वेळ दोन्ही भरणे आवश्यक आहे.');return;}const when=new Date(at).getTime();if(!Number.isFinite(when)||when<=Date.now()){addMessage('कृपया भविष्यातील वेळ निवड.');return;}const a=read(STORE.reminders);a.push({text,at:when,fired:false});write(STORE.reminders,a);$('reminderText').value='';renderReminders();addMessage('आठवण सेव्ह केली: '+text);};
function checkReminders(){const a=read(STORE.reminders);let changed=false;for(const r of a){if(!r.fired&&r.at<=Date.now()){r.fired=true;changed=true;const msg='आठवण! '+r.text;addMessage(msg);speak(msg);if('Notification'in window&&Notification.permission==='granted'){try{new Notification('JARVIS Reminder',{body:r.text});}catch{}}}}if(changed)write(STORE.reminders,a);}
function setStatus(){const online=navigator.onLine;$('status').textContent=online?'● READY · Online connection detected · Local commands active':'● OFFLINE · Local commands active';}
window.addEventListener('online',setStatus);window.addEventListener('offline',setStatus);setInterval(checkReminders,5000);setStatus();renderNotes();renderTasks();renderReminders();
if('serviceWorker'in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
