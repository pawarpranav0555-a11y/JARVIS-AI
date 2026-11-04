const $=id=>document.getElementById(id),log=$("chatLog"),input=$("messageInput");
const STORE="jarvis-chat-v16";
function readMessages(){try{const v=JSON.parse(localStorage.getItem(STORE)||"[]");return Array.isArray(v)?v.slice(-100):[]}catch{return []}}
let messages=readMessages();
function saveMessages(){try{localStorage.setItem(STORE,JSON.stringify(messages.slice(-100)))}catch{}}

function render(){log.innerHTML="";if(!messages.length){let d=document.createElement("div");d.className="assistant-msg";d.textContent="मी तयार आहे. खाली मेसेज लिहा किंवा माइक वापरा.";log.append(d);return}messages.forEach(m=>{let d=document.createElement("div");d.className=m.role==="user"?"user-msg":"assistant-msg";d.textContent=m.text;log.append(d)});log.scrollTop=log.scrollHeight}
function reply(t){let s=t.toLowerCase();if(/नमस्कार|hello|hi|नमस्ते/.test(s))return"नमस्कार! मी JARVIS prototype आहे. तुम्हाला कशात मदत करू?";if(/वेळ|time/.test(s))return"तुमच्या फोनवरील वेळ: "+new Date().toLocaleTimeString();if(/तारीख|date/.test(s))return"आजची तारीख: "+new Date().toLocaleDateString();return"तुमचा मेसेज मिळाला: “"+t+"”. सध्या local prototype mode सुरू आहे. पूर्ण AI उत्तरांसाठी सुरक्षित AI backend जोडणे बाकी आहे."}
function send(t){t=(t??input.value).trim();if(!t)return;messages.push({role:"user",text:t});messages.push({role:"assistant",text:reply(t)});messages=messages.slice(-100);saveMessages();render();input.value="";input.style.height="auto"}
$("sendBtn").onclick=()=>send();input.onkeydown=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}};render();
const drawer=$("drawer"),scrim=$("scrim");function close(){drawer.classList.remove("open");scrim.classList.remove("show");drawer.setAttribute("aria-hidden","true")}$("menuBtn").onclick=()=>{drawer.classList.add("open");scrim.classList.add("show");drawer.setAttribute("aria-hidden","false")};$("closeMenu").onclick=close;scrim.onclick=close;
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>{document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));$(b.dataset.panel+"Panel").classList.add("active");document.querySelectorAll(".nav-item").forEach(x=>x.classList.toggle("active",x===b));close()});
$("accountBtn").onclick=$("googleBtn").onclick=()=>alert("Google sign-in साठी सुरक्षित backend आणि OAuth configuration आवश्यक आहे.");
$("clearChat").onclick=()=>{if(confirm("या device वरील local chat delete करायची?")){messages=[];try{localStorage.removeItem(STORE)}catch{}render()}};
let voices=[];function loadVoices(){if(!("speechSynthesis"in window))return;voices=speechSynthesis.getVoices();refreshVoiceOptions()}function refreshVoiceOptions(){let lang=$("languageSelect").value,sel=$("voiceSelect"),old=sel.value;sel.innerHTML='<option value="">Automatic best available</option>';if(lang==="auto")lang="mr-IN";voices.filter(v=>v.lang.toLowerCase().startsWith(lang.slice(0,2).toLowerCase())).forEach(v=>{let o=document.createElement("option");o.value=voices.indexOf(v);o.textContent=v.name+" · "+v.lang;sel.append(o)});if(old&&[...sel.options].some(o=>o.value===old))sel.value=old;if(sel.options.length===1){let o=document.createElement("option");o.disabled=true;o.textContent="या भाषेचा installed voice उपलब्ध नाही";sel.append(o)}}
if("speechSynthesis"in window){loadVoices();speechSynthesis.onvoiceschanged=loadVoices}
$("languageSelect").onchange=()=>refreshVoiceOptions();
function say(text,lang){if(!("speechSynthesis"in window))return; speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(text),v=$("voiceSelect").value;if(v!=="")u.voice=voices[Number(v)];u.lang=lang==="auto"?"mr-IN":lang;u.rate=Number($("rateSlider").value);u.pitch=.92;u.volume=1;u.onstart=()=>state("SPEAKING");u.onend=()=>state("READY");speechSynthesis.speak(u)}
$("testVoice").onclick=()=>{let l=$("languageSelect").value;let sample=l==="mr-IN"?"नमस्कार. मी JARVIS आहे.":l==="hi-IN"?"नमस्ते। मैं JARVIS हूँ।":l.startsWith("en-")?"Hello. I am JARVIS. How can I help you?":"नमस्कार. मी JARVIS आहे. तुमची निवडलेली भाषा उपलब्ध असल्यास मी त्या भाषेत बोलेन.";say(sample,l)};
$("rateSlider").oninput=e=>$("rateValue").textContent=Number(e.target.value).toFixed(2)+"×";
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;let recognition=null;function transcript(t){$("voiceTranscript").textContent=t}function state(s){$("orbState").textContent=s;mode=s.toLowerCase()}
function listen(targetInput){if(!SR){transcript("या ब्राउझरमध्ये speech recognition उपलब्ध नाही. Chrome मध्ये microphone permission तपासा.");return}let lang=$("languageSelect").value;if(lang==="auto"){transcript("Auto detect साठी AI voice backend आवश्यक आहे. सध्या मराठी, हिंदी किंवा English निवडा.");return}recognition=new SR();recognition.lang=lang;recognition.interimResults=true;recognition.continuous=false;recognition.onstart=()=>{state("LISTENING");$("voiceStart").disabled=true;$("voiceStop").disabled=false;transcript("ऐकत आहे... बोला.")};recognition.onresult=e=>{let f="",i="";for(let n=e.resultIndex;n<e.results.length;n++){if(e.results[n].isFinal)f+=e.results[n][0].transcript;else i+=e.results[n][0].transcript}if(targetInput){$("translateInput").value=f||i}else{transcript(f||i);if(f){send(f);transcript("तुम्ही: "+f)}}};recognition.onerror=e=>transcript("Voice input error: "+e.error);recognition.onend=()=>{$("voiceStart").disabled=false;$("voiceStop").disabled=true;if(mode==="listening")state("READY")};try{recognition.start()}catch(e){transcript("माइक सुरू करता आला नाही. पुन्हा प्रयत्न करा.")}}
$("voiceStart").onclick=()=>listen(false);$("voiceStop").onclick=()=>recognition?.stop();$("micBtn").onclick=()=>{document.querySelector('[data-panel="voice"]').click();listen(false)};$("translateMic").onclick=()=>listen(true);
$("swapLang").onclick=()=>{let a=$("sourceLang"),b=$("targetLang");if(a.value==="auto")a.value="mr-IN";let t=a.value;a.value=b.value;b.value=t};
$("translateBtn").onclick=()=>{let t=$("translateInput").value.trim();if(!t){$("translationResult").textContent="कृपया भाषांतरासाठी मजकूर लिहा किंवा बोला.";return}$("translationResult").textContent="भाषांतर सेवा जोडणे बाकी आहे. हा prototype तुमचा मजकूर सुरक्षित ठेवतो, पण चुकीचे किंवा बनावट भाषांतर दाखवत नाही. पुढील backend टप्प्यात निवडलेल्या भाषा-जोडीसाठी भाषांतर जोडले जाईल."};
$("speakTranslation").onclick=()=>{let t=$("translationResult").textContent;if(t&&t!=="भाषांतर येथे दिसेल.")say(t,$("targetLang").value)};
const canvas=$("orbCanvas"),ctx=canvas.getContext("2d",{alpha:true,desynchronized:true});let mode="ready",last=0,phase=0,raf=0;
function resize(){let r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);ctx.setTransform(d,0,0,d,0,0)}
if("ResizeObserver"in window)new ResizeObserver(resize).observe(canvas);else addEventListener("resize",resize,{passive:true});resize();
function draw(now){if(document.hidden){raf=0;return}let p=$("performance").value,f=$("fps").value;let cap=p==="battery"?24:f==="60"?60:f==="90"?90:f==="auto"?Math.min(60,screen.orientation?60:60):60;if(now-last>=1000/cap){last=now;let w=canvas.clientWidth,h=canvas.clientHeight,x=w/2,y=h/2,r=Math.min(w,h)*.27;phase+=mode==="speaking"?.075:mode==="listening"?.045:.018;ctx.clearRect(0,0,w,h);let g=ctx.createRadialGradient(x-r*.2,y-r*.35,2,x,y,r*1.7);g.addColorStop(0,"#e4fbff");g.addColorStop(.18,"#65dfff");g.addColorStop(.48,"#3978e9");g.addColorStop(.78,"#5739a8");g.addColorStop(1,"#101b42");ctx.save();ctx.shadowBlur=p==="battery"?12:36;ctx.shadowColor="#45cfff";ctx.beginPath();ctx.arc(x,y,r*(1+Math.sin(phase*2)*.025),0,Math.PI*2);ctx.fillStyle=g;ctx.fill();ctx.restore();for(let n=0;n<3;n++){ctx.beginPath();ctx.ellipse(x,y,r*(1.35+n*.19),r*(.42+n*.06),phase*(n%2?-.2:.2),0,Math.PI*2);ctx.strokeStyle=`rgba(90,190,255,${.38-n*.08})`;ctx.stroke()}for(let n=0;n<(p==="battery"?12:24);n++){let a=n*Math.PI*2/(p==="battery"?12:24)+phase*.5,rr=r*(1.48+.09*Math.sin(phase*2+n));ctx.beginPath();ctx.arc(x+Math.cos(a)*rr,y+Math.sin(a)*rr*.75,1.4,0,Math.PI*2);ctx.fillStyle=n%2?"#75eaff":"#b7a1ff";ctx.fill()}}raf=requestAnimationFrame(draw)}
function startAnimation(){if(!document.hidden&&!raf)raf=requestAnimationFrame(draw)}
document.addEventListener("visibilitychange",()=>{if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0}else startAnimation()});startAnimation();
input.addEventListener("input",()=>{input.style.height="auto";input.style.height=Math.min(input.scrollHeight,130)+"px"},{passive:true});
if("serviceWorker"in navigator&&location.protocol.startsWith("http"))addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
// v1.7 appearance preferences: local-only, instant, and free.
(()=>{
 const root=document.documentElement,body=document.body;
 const defaults={style:"aura",color:"cyan",motion:"smooth",size:100,glow:70};
 const colors={cyan:["#55d9ff","#a17aff"],violet:["#a78bfa","#ec83d8"],emerald:["#45e0b0","#55a7ff"],amber:["#ffc66d","#ff7d91"],rose:["#ff7ab6","#9b8cff"]};
 let prefs={...defaults};try{prefs={...prefs,...JSON.parse(localStorage.getItem("jarvis-appearance-v17")||"{}")}}catch{}
 const el=id=>document.getElementById(id);
 function apply(){
  const pair=colors[prefs.color]||colors.cyan;
  root.style.setProperty("--accent",pair[0]);root.style.setProperty("--accent2",pair[1]);
  root.style.setProperty("--orb-scale",String(Number(prefs.size)/100));
  root.style.setProperty("--orb-glow",String(Number(prefs.glow)/100));
  body.dataset.orb=prefs.style;body.dataset.motion=prefs.motion;
  ["orbStyle","accentColor","orbMotion","orbSize","glowLevel"].forEach((id,i)=>{if(el(id))el(id).value=[prefs.style,prefs.color,prefs.motion,prefs.size,prefs.glow][i]});
  if(el("orbSizeValue"))el("orbSizeValue").textContent=prefs.size+"%";
  if(el("glowValue"))el("glowValue").textContent=prefs.glow+"%";
 }
 function save(){try{localStorage.setItem("jarvis-appearance-v17",JSON.stringify(prefs))}catch{}apply()}
 [["orbStyle","style"],["accentColor","color"],["orbMotion","motion"],["orbSize","size"],["glowLevel","glow"]].forEach(([id,key])=>{
  if(el(id))el(id).addEventListener("input",e=>{prefs[key]=["size","glow"].includes(key)?Number(e.target.value):e.target.value;save()});
  if(el(id))el(id).addEventListener("change",e=>{prefs[key]=["size","glow"].includes(key)?Number(e.target.value):e.target.value;save()});
 });
 if(el("resetAppearance"))el("resetAppearance").onclick=()=>{prefs={...defaults};save()};
 apply();
})();
