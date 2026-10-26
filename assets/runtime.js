;
const $=id=>document.getElementById(id);
const I={es:{title:'Las voces escondidas de la selva',subtitle:'Escucha, separa y vuelve a reunir el coro vivo de la Reserva Narupa',intro:'En Narupa, muchos cantos suceden al mismo tiempo. Aquí puedes abrir el paisaje sonoro, seguir cada voz por separado,<br class="intro-break"> y descubrir cómo la selva se compone a sí misma.',play:'Reproducir',pause:'Pausar',original:'Mezcla original',clear:'Limpiar',birdmix:'Canales BirdMixIT',help:'Activa o desactiva especies para probar mezclas de escucha. Las pistas candidatas proceden de BirdMixIT y del TXT experto: su identidad aún requiere validación.',now:'Sonando ahora',nowDesc:'Cada especie aparece un poco antes y permanece un instante después de su vocalización.',selector:'Elige las voces que quieres escuchar. Puedes combinarlas libremente:',preview:'MAQUETA FUNCIONAL',previewDesc:'Audio original y pistas de demostración filtradas mediante etiquetas expertas. Aún no incluye fuentes BirdMixIT.',defaultMode:'Modo: selva completa',timeline:'Posición en la grabación',speciesSection:'Especies de esta experiencia',speciesIntro:'Conoce las especies que puedes escuchar en este paisaje sonoro de la Reserva Narupa.',creditsTitle:'Acerca de esta experiencia',descriptionTitle:'Descripción',description:'“Las voces escondidas de la selva” es un explorador bioacústico interactivo de la Reserva Narupa. Permite escuchar la grabación original, aislar y combinar voces candidatas de seis especies y seguir su energía real sobre el espectrograma. BirdMixIT separa el sonido mediante modelos independientes de cuatro y ocho fuentes; las anotaciones expertas guían, evento por evento, la selección y optimización de hasta tres canales dentro de un mismo modelo. También puedes escuchar los doce canales acústicos por separado o combinarlos, comparar el resultado optimizado con la referencia histórica y explorar sus componentes armónicas. Es un ensayo de separación de fuentes asistido por inteligencia artificial y supervisión experta, no un identificador automático de especies.',credits:'Créditos',concept:'Concepto, dirección científica, diseño y desarrollo del visualizador interactivo:',train:'Entrenamiento de modelos de IA:',data:'Datos bioacústicos:',dataText:'Registros de audio de la Reserva Narupa, Fundación de Conservación Jocotoco',curation:'Curaduría bioacústica:',visual:'Procesamiento visual:',visualText:'Espectrograma interactivo generado a partir del audio y etiquetas acústicas por especie.',experiment:'Experimento de separación:',experimentText:'Exploración experimental de separación de fuentes con BirdMixIT (Google Research). Las pistas candidatas se generan a partir de salidas reales de BirdMixIT y etiquetas expertas. No representan identificación automática ni aislamiento garantizado.',citation:'Maqueta de revisión UX, no resultado científico. Las pistas de demostración son filtrados guiados por las anotaciones existentes. Las imágenes conservan sus autores y licencias individuales.',silence:'Por ahora, ninguna anotación coincide con este instante.',live:'especies alrededor de este instante',selPrefix:'Escuchando',sources:'pistas de prueba',events:'eventos',duration:'s acumulados',photo:'Foto',source:'Ver fuente',noSources:'Las salidas de BirdMixIT aún no están cargadas. Los canales experimentales se habilitarán en el HTML generado por el proyecto después de ejecutar y validar la inferencia.',nothing:'Sin voces seleccionadas'},en:{title:'Hidden voices of the rainforest',subtitle:'Listen, separate and bring back together the living chorus of Narupa Reserve',intro:'In Narupa, many birds sing at the same time. Here you can open up the soundscape, follow individual voices, and discover how the forest composes itself.',play:'Play',pause:'Pause',original:'Original mix',clear:'Clear',birdmix:'BirdMixIT channels',help:'Toggle species to preview custom listening mixes. These candidate tracks use BirdMixIT outputs guided by expert annotations; species attribution requires validation.',now:'Around this moment',nowDesc:'Each species appears shortly before and remains for a moment after its vocalization.',selector:'Choose the voices you want to hear. Combine them freely:',preview:'INTERACTIVE MOCKUP',previewDesc:'Original recording plus demonstration tracks filtered using expert annotations. BirdMixIT output is not included yet.',defaultMode:'Mode: original soundscape',timeline:'Recording position',speciesSection:'Species in this experience',speciesIntro:'Meet the six birds featured in this Narupa soundscape. Photos and attributions are preserved from the original experience.',creditsTitle:'About this experience',descriptionTitle:'Description',description:'“The hidden voices of the forest” is an interactive bioacoustic explorer of Narupa Reserve. Listen to the original recording, isolate and combine candidate vocalizations from six species, and follow their measured energy on the spectrogram. BirdMixIT processes the audio with independent four- and eight-source models; expert annotations guide event-by-event selection and optimization of up to three channels within the same model. You can also listen to or combine the twelve acoustic channels and compare optimized tracks with the historical baseline, while exploring harmonic content. This is an AI-assisted, expert-guided source separation experiment, not automatic species identification.',credits:'Credits',concept:'Concept, scientific direction, design and development of the interactive visualizer:',train:'AI model training:',data:'Bioacoustic data:',dataText:'Narupa Reserve field recordings, Fundación de Conservación Jocotoco',curation:'Bioacoustic curation:',visual:'Visual processing:',visualText:'Interactive spectrogram based on the original recording and expert audio annotations.',experiment:'Source separation experiment:',experimentText:'BirdMixIT (Google Research, original source-separation model). This interface contains real BirdMixIT separation outputs. Species-named tracks are annotation-guided candidates, not confirmed identifications.',citation:'UX review mockup, not a scientific result. Demonstration tracks are filtered using existing expert annotations. Individual photos retain their author and license information.',silence:'No annotated species near this moment.',live:'species near the playhead',selPrefix:'Listening to',sources:'demonstration tracks',events:'events',duration:'s annotated',photo:'Photo',source:'View source',noSources:'BirdMixIT output has not been loaded. Experimental channels will be available in the generated project HTML only after running and validating inference.',nothing:'No voices selected'}};
let lang='es',mode='original',selected=new Set(),playing=false,seekSec=0,raf=null,audioError=false;
const timeDur=MODEL.duration;
const originalAudio=new Audio(MODEL.originalAudio);originalAudio.preload='auto';
const demoAudios={};for(const sp of MODEL.species){const a=new Audio(MODEL.demoAudios[sp]);a.preload='metadata';demoAudios[sp]=a;}
const rawAudios={};for(const [k,uri] of Object.entries(MODEL.birdmixitChannels)){const a=new Audio(uri);a.preload='metadata';rawAudios[k]=a;}
const rawSelected=new Set();
const audioSet=[originalAudio,...Object.values(demoAudios),...Object.values(rawAudios)];
const COLORS=MODEL.colors;
const jocotocoLogo=$('logo');jocotocoLogo.src=MODEL.logo;$('forest').style.backgroundImage='url("'+MODEL.forest+'")';$('specImg').src=MODEL.spectrogram;
const format=t=>`${Math.floor(t/60)}:${(t%60).toFixed(1).padStart(4,'0')}`;
$('total').textContent=format(timeDur);
function modeTracks(){return mode==='original'?[originalAudio]:(mode==='raw'?[...rawSelected].map(s=>rawAudios[s]):[...selected].map(s=>demoAudios[s]));}
function currentLead(){const tracks=modeTracks();return tracks[0]||null;}
function currentTime(){const lead=currentLead();return playing&&lead?Math.min(timeDur,lead.currentTime):seekSec;}
function softPause(){for(const a of audioSet)a.pause();playing=false;setPlayState();}
function setPlayState(){$('playSymbol').textContent=playing?'Ⅱ':'▶';document.querySelector('#playBtn [data-i]').textContent=I[lang][playing?'pause':'play'];}
function syncTracks(shouldPlay=false){for(const a of audioSet){a.pause();try{a.currentTime=Math.min(Math.max(0,seekSec),timeDur-.04);}catch(_){}}
 if(shouldPlay){const tracks=modeTracks();if(!tracks.length){playing=false;setPlayState();return}playing=true;setPlayState();for(const a of tracks){a.volume=tracks.length>1?Math.max(.30,1/Math.sqrt(tracks.length)):.95;a.play().catch(()=>{audioError=true;softPause()});}}}
function seek(t){seekSec=Math.max(0,Math.min(timeDur-.02,t));syncTracks(playing);drawTime(true)}
function setMode(next){seekSec=currentTime();const was=playing;softPause();mode=next;syncTracks(was);$('originalBtn').setAttribute('aria-pressed',String(mode==='original'));rebuildSelectors();renderOverlay();renderNow();updateSummary();}
function toggle(sp){seekSec=currentTime();const was=playing;softPause();if(mode!=='demo'){mode='demo';selected.clear();rawSelected.clear()}if(selected.has(sp))selected.delete(sp);else selected.add(sp);syncTracks(was&&selected.size>0);$('originalBtn').setAttribute('aria-pressed',String(mode==='original'));rebuildSelectors();renderOverlay();renderNow();updateSummary();}
$('playBtn').addEventListener('click',()=>{if(playing)softPause();else{seekSec=currentTime();syncTracks(true)}setPlayState()});
$('originalBtn').addEventListener('click',()=>{setMode('original')});
$('clearBtn').addEventListener('click',()=>{seekSec=currentTime();softPause();selected.clear();rawSelected.clear();mode='demo';rebuildSelectors();renderOverlay();renderNow();updateSummary();$('originalBtn').setAttribute('aria-pressed','false');});
$('techBtn').addEventListener('click',()=>{
  let d=document.getElementById('birdmixRawDialog');
  if(!d){d=document.createElement('dialog');d.id='birdmixRawDialog';d.style.cssText='border:1px solid #cde3d8;border-radius:22px;padding:20px;max-width:min(94vw,540px);width:100%;box-shadow:0 20px 80px #0a382644;color:#11213a;background:#fff;';
    d.innerHTML='<h2 style="margin:0 0 8px;font-size:19px">Canales acústicos BirdMixIT</h2><p style="font-size:13px;line-height:1.5;color:#52667c">Fuentes sin identificar: cada canal puede contener varias aves y cada especie aparecer en más de un canal.</p><div id="birdmixRawChoices" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:16px 0"></div><button type="button" id="birdmixCloseDialog" style="padding:10px 20px;background:#087b61;color:#fff;border:0;border-radius:20px;cursor:pointer">Cerrar / Close</button>';
    document.body.appendChild(d);
    d.querySelector('#birdmixCloseDialog').onclick=()=>d.close();
  }
  const choices=d.querySelector('#birdmixRawChoices');choices.innerHTML='';
  Object.keys(rawAudios).forEach(ch=>{const b=document.createElement('button');b.type='button';b.textContent=(rawSelected.has(ch)?'☑ ':'☐ ')+(lang==='es'?'Fuente ':'Source ')+ch;
  b.style.cssText='border:1px solid #bdd9cd;border-radius:12px;padding:12px;background:'+(rawSelected.has(ch)?'#e0f8eb':'#fff')+';font-weight:750;cursor:pointer;color:#163247';
  b.style.borderLeft='5px solid '+(MODEL.rawChannelColors?.[ch]||'#bdd9cd');
  b.onclick=()=>{seekSec=currentTime();const was=playing;softPause();mode='raw';selected.clear();if(rawSelected.has(ch))rawSelected.delete(ch);else rawSelected.add(ch);syncTracks(was&&rawSelected.size>0);$('originalBtn').setAttribute('aria-pressed','false');rebuildSelectors();renderOverlay();renderNow();updateSummary();b.textContent=(rawSelected.has(ch)?'☑ ':'☐ ')+(lang==='es'?'Fuente ':'Source ')+ch;b.style.background=rawSelected.has(ch)?'#e0f8eb':'#fff';};choices.appendChild(b)});
  if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','');
});
$('timeline').max=String(timeDur);
$('timeline').addEventListener('input',e=>{const was=playing;seekSec=Number(e.target.value);for(const a of modeTracks()){try{a.currentTime=seekSec}catch(_){}};drawTime(true)});
$('timeline').addEventListener('change',()=>{if(playing)syncTracks(true)});
function buildFreq(){const fa=$('freqAxis');fa.innerHTML='';for(const k of [8,6,4,2,0]){const b=document.createElement('div');b.className='freq-item';b.style.bottom=(k/8*100)+'%';b.textContent=k+' kHz';fa.appendChild(b)}}
function getStageWidth(){return Math.max(3650,Math.round(timeDur*33));}
const stageWidth=getStageWidth();$('specContent').style.width=stageWidth+'px';$('timeTicks').style.width=stageWidth+'px';
function makeTicks(){
 const p=$('timeTicks'),stage=$('specContent');p.style.width=stageWidth+'px';p.innerHTML='';
 stage.querySelectorAll('.spec-time-guide').forEach(x=>x.remove());
 for(let t=0;t<timeDur+.01;t+=5){
  const major=(t%10===0);let d=document.createElement('span');d.className='time-tick '+(major?'birdmix-major':'birdmix-minor');
  d.textContent=format(t);d.style.left=(t/timeDur*100)+'%';p.appendChild(d);
  if(t>0){const g=document.createElement('div');g.className='spec-time-guide '+(major?'birdmix-major':'birdmix-minor');
   g.style.left=(t/timeDur*100)+'%';stage.insertBefore(g,$('specHead'));}
 }
}

const measuredImages={};
if(MODEL.measuredOverlays){for(const [sp,uri] of Object.entries(MODEL.measuredOverlays)){
  const im=new Image();im.onload=()=>{renderOverlay();birdmixCheckReady();};im.src=uri;measuredImages[sp]=im;
}}
const rawMeasuredImages={};
if(MODEL.rawChannelOverlays){for(const [ch,uri] of Object.entries(MODEL.rawChannelOverlays)){
  const im=new Image();im.onload=()=>{renderOverlay();birdmixCheckReady();};im.src=uri;rawMeasuredImages[ch]=im;
}}
function renderOverlay(){
 const c=$('specOverlay');const ratio=window.devicePixelRatio>1?1.5:1;
 c.width=Math.round(stageWidth*ratio);c.height=Math.round(600*ratio);
 const ctx=c.getContext('2d');ctx.scale(ratio,ratio);ctx.clearRect(0,0,stageWidth,600);
 if(mode==='raw'){
   for(const ch of rawSelected){const im=rawMeasuredImages[ch];
      if(im&&im.complete&&im.naturalWidth)ctx.drawImage(im,0,0,stageWidth,600);
   }
   return;
 }
 const visible=mode==='original'?MODEL.species:[...selected];
 for(const sp of visible){const im=measuredImages[sp];if(im&&im.complete&&im.naturalWidth)ctx.drawImage(im,0,0,stageWidth,600);}
}
function renderNow(){const t=currentTime();const eligible=MODEL.species.filter(sp=>MODEL.labels.some(x=>x.species===sp&&t>=x.start-1.1&&t<=x.end+1.5));const holder=$('nowList');const visible=eligible.filter(sp=>mode==='original'||selected.has(sp));
 const key=visible.join('|');if(holder.dataset.key===key)return;holder.dataset.key=key;holder.innerHTML='';
 if(!visible.length){const placeholder=document.createElement('div');placeholder.className='now-placeholder';placeholder.textContent=I[lang].silence;holder.appendChild(placeholder)}
 else for(const sp of visible){const card=document.createElement('div');card.className='now-species';card.style.setProperty('--sp',COLORS[sp]);const [genus,...epithet]=sp.split(' ');card.innerHTML=`<img alt="${sp}" src="${MODEL.photos[sp]}"><div class="now-text"><span class="now-genus">${genus}</span><span class="now-epithet">${epithet.join(' ')}</span></div>`;holder.appendChild(card)}

}
function rebuildSelectors(){const g=$('selectorGrid');g.innerHTML='';for(const sp of MODEL.species){const active=mode==='demo'&&selected.has(sp);const btn=document.createElement('button');btn.type='button';btn.className='selector-item'+(active?' active':'');btn.style.setProperty('--sp',COLORS[sp]);btn.setAttribute('aria-pressed',String(active));btn.setAttribute('aria-label',sp+' '+(active?'✓':''));btn.innerHTML=`<img alt="" src="${MODEL.photos[sp]}"><span class="selector-text"><span class="selector-name"><span class="s-dot"></span>${sp}</span><span class="selector-common" style="display:block">${lang==='es'?MODEL.commonES[sp]:MODEL.commonEN[sp]}</span></span><span class="check">${active?'✓':''}</span>`;btn.addEventListener('click',()=>toggle(sp));g.appendChild(btn)}}
function renderInfo(){const grid=$('infoGrid');grid.innerHTML='';for(const sp of MODEL.species){const l=MODEL.licenseInfo[sp],st=MODEL.stats[sp];const card=document.createElement('article');card.className='cc-species-card';card.style.setProperty('--c',COLORS[sp]);const name=lang==='es'?MODEL.commonES[sp]:MODEL.commonEN[sp];card.innerHTML=`<div class="cc-photo-wrap"><img alt="${sp}" src="${MODEL.photos[sp]}"></div><div class="cc-species-body"><h3 class="cc-species-title">${sp}</h3><div class="cc-common">${name}</div><div class="cc-badges"><span class="cc-badge">${st.n} ${I[lang].events}</span><span class="cc-badge">${st.total.toFixed(1)} ${I[lang].duration}</span><span class="cc-badge">${format(st.first)}–${format(st.last)}</span></div><div class="cc-license">${I[lang].photo}: ${l.author}. ${lang==='es'?'Licencia':'License'}: <b>${l.license}</b>. <a href="${l.url}" target="_blank" rel="noopener noreferrer">${I[lang].source}</a>.</div></div>`;card.addEventListener('click',e=>{if(e.target.closest('a'))return;const first=MODEL.labels.find(x=>x.species===sp);if(first)seek(first.start);});grid.appendChild(card)}}
function updateSummary(){}
function setLang(next){lang=next;document.documentElement.lang=lang;for(const el of document.querySelectorAll('[data-i]')){const key=el.dataset.i;if(key&&I[lang][key]){if(key==='intro')el.innerHTML=I[lang][key];else el.textContent=I[lang][key]}}for(const b of document.querySelectorAll('[data-lang]'))b.setAttribute('aria-pressed',String(b.dataset.lang===lang));setPlayState();rebuildSelectors();renderInfo();$('nowList').dataset.key='';renderNow();updateSummary()}
for(const b of document.querySelectorAll('[data-lang]'))b.addEventListener('click',()=>setLang(b.dataset.lang));
function drawTime(follow){const now=currentTime();$('current').textContent=format(now);$('timeline').value=String(now);$('timeline').style.setProperty('--p',((now/timeDur)*100).toFixed(2)+'%');$('specHead').style.left=(now/timeDur*stageWidth)+'px';
 const vp=$('specScroll');if(follow){const target=now/timeDur*stageWidth-vp.clientWidth*.4;if(Math.abs(vp.scrollLeft-target)>2)vp.scrollLeft=Math.max(0,Math.min(vp.scrollWidth-vp.clientWidth,target))}
 $('timeTicks').style.transform='translateX(-'+$('specScroll').scrollLeft+'px)';renderNow();}
function frame(){if(playing){const a=currentLead();if(a){seekSec=Math.min(timeDur,a.currentTime);if(a.ended||seekSec>=timeDur-.1){softPause();seekSec=0;syncTracks(false)}}}drawTime(playing);raf=requestAnimationFrame(frame)}
$('specScroll').addEventListener('scroll',()=>{$('timeTicks').style.transform='translateX(-'+$('specScroll').scrollLeft+'px)'},{passive:true});
$('specScroll').addEventListener('click',e=>{const rect=$('specContent').getBoundingClientRect();const t=(e.clientX-rect.left)/rect.width*timeDur;seek(t)});
$('specScroll').addEventListener('wheel',e=>{if(e.deltaY&&Math.abs(e.deltaY)>Math.abs(e.deltaX)){e.preventDefault();$('specScroll').scrollLeft+=e.deltaY;}},{passive:false});
$('specScroll').addEventListener('scroll',()=>{$('timeTicks').style.transform='translate3d('+(-$('specScroll').scrollLeft)+'px,0,0)';},{passive:true});window.addEventListener('resize',()=>{drawTime(false)});
for(const a of audioSet)a.addEventListener('error',()=>{console.warn('Preview audio failed',a.error)});
// Crecimiento iniciado desde la cabecera visible, antes de los datos pesados.
let birdmixDecodeStarted=false;
// Una única portada: el logo CC y la carga transcurren en paralelo;
// no hay iframe, mensajes entre páginas ni temporizador para revelar.
function birdmixAudioReady(){
 // data:URI completa disponible; cargar metadatos sin iniciar reproducción.
 return typeof audioSet!=='undefined' && audioSet.length>0 &&
   audioSet.every(a=>a.readyState>=HTMLMediaElement.HAVE_METADATA && Number.isFinite(a.duration) && a.duration>0);
}
function birdmixCheckReady(){
 if(document.documentElement.classList.contains('birdmix-ready')||birdmixDecodeStarted)return;
 if(!birdmixAudioReady())return;
 const base=$('specImg');
 const species=Object.keys(MODEL.measuredOverlays||{});
 const channels=Object.keys(MODEL.rawChannelOverlays||{});
 const specImages=species.map(sp=>(typeof measuredImages==='undefined'?null:measuredImages[sp]));
 const channelImages=channels.map(ch=>(typeof rawMeasuredImages==='undefined'?null:rawMeasuredImages[ch]));
 const shownImages=Array.from(document.images).filter(im=>im.id!=='birdmixCcLogo'&&im.getAttribute('src'));
 const all=[base,...specImages,...channelImages,...shownImages];
 if(all.some(im=>!im||!im.complete||im.naturalWidth<=0))return;
 birdmixDecodeStarted=true;
 Promise.all([
  ...all.map(im=>(typeof im.decode==='function'?im.decode():Promise.resolve())),
  document.fonts ? document.fonts.ready : Promise.resolve()
 ]).then(()=>{
  renderOverlay();
  // v0.3.10: el segundo mínimo se cuenta desde el PRIMER PINTADO visible,
  // no desde DOMContentLoaded ni desde la descarga de los MP3.
  function finishWhenVisibleLongEnough(){
   const started=window.birdmixSplashVisibleAt;
   if(!Number.isFinite(started)){
    requestAnimationFrame(finishWhenVisibleLongEnough);
    return;
   }
   const remaining=1000-(performance.now()-started);
   if(remaining>0){setTimeout(finishWhenVisibleLongEnough,Math.min(80,remaining));return;}
   requestAnimationFrame(()=>requestAnimationFrame(()=>{
    document.documentElement.classList.add('birdmix-ready');
   }));
  }
  finishWhenVisibleLongEnough();
 }).catch(()=>{birdmixDecodeStarted=false;birdmixLoadFailed();});
}
function birdmixLoadFailed(){
 const m=document.getElementById('birdmixLoadError');if(m)m.hidden=false;
}
$('specImg').addEventListener('load',birdmixCheckReady);
$('specImg').addEventListener('error',birdmixLoadFailed);
document.addEventListener('load',e=>{if(e.target instanceof HTMLImageElement)birdmixCheckReady()},true);
document.addEventListener('error',e=>{if(e.target instanceof HTMLImageElement&&e.target.id!=='birdmixCcLogo')birdmixLoadFailed()},true);
for(const a of audioSet){
 a.addEventListener('loadedmetadata',birdmixCheckReady);
 a.addEventListener('error',birdmixLoadFailed);
 // Algunos navegadores no inician la precarga de pistas no seleccionadas sin load().
 if(a.readyState<HTMLMediaElement.HAVE_METADATA)try{a.load()}catch(_){birdmixLoadFailed()}
}
window.addEventListener('load',birdmixCheckReady);

buildFreq();makeTicks();rebuildSelectors();renderInfo();updateSummary();renderOverlay();drawTime(false);frame();birdmixCheckReady();
