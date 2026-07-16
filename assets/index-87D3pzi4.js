const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/PcbPreview-DsKQssW6.js","assets/vendor-C9A_qoZ1.js","assets/StlPreview-BUXAkDNv.js","assets/three-BJECO8Vk.js","assets/js-yaml-DW8Bub87.js","assets/jszip-cZtdyB0p.js"])))=>i.map(i=>d[i]);
import{f as Re,y as d,j as e,r as h,h as Ve,i as Uo,k as vn,l as _n,O as wt,p as jn,m as or,n as nr,o as $n,q as Cn,t as rr,v as no,w as Sn,L as Pn,x as ir,z as It,N as Oo,A as sr,B as ar,e as lr,C as cr}from"./vendor-C9A_qoZ1.js";import{j as pe}from"./js-yaml-DW8Bub87.js";import{J as Ke}from"./jszip-cZtdyB0p.js";import{_ as En}from"./three-BJECO8Vk.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function s(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(r){if(r.ep)return;r.ep=!0;const a=s(r);fetch(r.href,a)}})();const Je=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/ergogen.worker-B5sWI4uD.js",import.meta.url),{type:"module"})}catch(o){return console.error("Failed to create worker:",o),null}},ro=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/jscad.worker-C8nLBdOi.js",import.meta.url),{type:"module"})}catch(o){return console.error("Failed to create JSCAD worker:",o),null}},dr="0.19.1",yt={version:dr},kt=o=>{const t=`v${Re.version}`,s=Re.version,i=Re.repository,r=i.startsWith("github:")?i.replace("github:","https://github.com/"):i.replace(/^git\+/,"").replace(/\.git$/,"");if(!o)return{label:t,url:r,displayText:s,isCustom:!1,isHash:!1,isTag:!1};if(o.includes("@")){const y=o.split("@"),k=y[1]||o;return{label:o,url:o.startsWith("ergogen@")?`${r}/releases/tag/v${k}`:`https://www.npmjs.com/package/${y[0]}`,displayText:k,isCustom:!0,isHash:!1,isTag:!0}}const a=o.startsWith("github:")?o.slice(7):o,[c,p]=a.split("#"),b=c==="ergogen/ergogen",l=`https://github.com/${c}`;if(b){if(!p)return{label:"latest",url:l,displayText:s,isCustom:!1,isHash:!1,isTag:!1};const y=p.length===40&&/^[0-9a-fA-F]{40}$/.test(p),k=y?p.substring(0,7):p,u=y?`${l}/commit/${p}`:`${l}/tree/${p}`;return{label:p,url:u,displayText:k,isCustom:!0,isHash:y,isTag:!y}}if(!p)return{label:a,url:l,displayText:s,isCustom:!0,isHash:!1,isTag:!1};const f=p.length===40&&/^[0-9a-fA-F]{40}$/.test(p),x=f?p.substring(0,7):p,m=f?`${l}/commit/${p}`:`${l}/tree/${p}`;return{label:a,url:m,displayText:x,isCustom:!0,isHash:f,isTag:!f}},io=o=>{if(o.includes("@")){const r=o.split("@"),a=r[1]||o,c=r[0];return`github:${c==="ergogen"?"ergogen/ergogen":c}#v${a}`}const t=o.startsWith("github:")?o.slice(7):o,[s,i]=t.split("#");return i?`github:${s}#${i}`:`github:${s}#v${Re.version}`},Ce=o=>{const s=o.replace(/^v/,"").match(/^(\d+)\.(\d+)\.(\d+)/);return s?[Number(s[1]),Number(s[2]),Number(s[3])]:null},Jt=(o,t)=>{for(let s=0;s<3;s++){if(o[s]>t[s])return!0;if(o[s]<t[s])return!1}return!0},Fo=o=>{const t=o.match(/(?:^|#|@|v)(\d+\.\d+\.\d+)/);return t?t[1]:null},ur=o=>{const t=o.startsWith("github:")?o.slice(7):o,[s]=t.split("#");return!o.startsWith("github:")&&!o.includes("/")?!1:s!=="ergogen/ergogen"},In=()=>{if(typeof window>"u")return!1;const o=window.navigator;return typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches||o.standalone===!0},so=()=>{if(typeof window>"u")return!1;const o=In(),t=localStorage.getItem("ergogen:config:sendUsageMetrics");if(t!==null)try{return JSON.parse(t)}catch{return!o}return!o},pr=()=>{if(typeof window>"u")return;const o=so(),t="G-46F2L343EK";if(o&&t){if(!document.getElementById("gtag-script")){const s=document.createElement("script");s.async=!0,s.src=`https://www.googletagmanager.com/gtag/js?id=${t}`,s.id="gtag-script",document.head.appendChild(s);const i=window,r=i.dataLayer||[];i.dataLayer=r,i.gtag=function(){r.push(arguments)},i.gtag("js",new Date),i.gtag("config",t),fr()}}else{const s=document.getElementById("gtag-script");s&&s.remove();const i=window;delete i.gtag,delete i.dataLayer,hr()}},V=(o,t)=>{so()&&window.gtag&&window.gtag("event",o,{event_category:"user_action",gui_version:yt.version,ergogen_version:io("github:ceoloide/ergogen#v4.3.0"),is_pwa:In(),...t})},Ge=(o,t=!1,s)=>{const i=o instanceof Error?o.message:o,r=o instanceof Error?o.stack:void 0;V("exception",{description:s?`[${s}] ${i}`:i,fatal:t,error_stack:(r==null?void 0:r.substring(0,250))||void 0})};let bt=!1;const zn=o=>{Ge(o.error||o.message,!1,"unhandled_error")},Ln=o=>{Ge(o.reason||"Unhandled Promise Rejection",!1,"unhandled_rejection")},fr=()=>{typeof window>"u"||bt||(window.addEventListener("error",zn),window.addEventListener("unhandledrejection",Ln),bt=!0)},hr=()=>{typeof window>"u"||bt&&(window.removeEventListener("error",zn),window.removeEventListener("unhandledrejection",Ln),bt=!1)};function gr(o){function t(l,f){return l>>>f|l<<32-f}const s=[],i=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],r=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],a=unescape(encodeURIComponent(o));for(let l=0;l<a.length;l++){const f=a.charCodeAt(l);s[l>>2]|=f<<24-l%4*8}const c=a.length;s[c>>2]|=128<<24-c%4*8;const p=(c+8>>6)+1;s[p*16-1]=c*8;for(let l=0;l<p;l++){const f=[];for(let P=0;P<16;P++)f[P]=s[l*16+P]||0;for(let P=16;P<64;P++){const E=t(f[P-15],7)^t(f[P-15],18)^f[P-15]>>>3,j=t(f[P-2],17)^t(f[P-2],19)^f[P-2]>>>10;f[P]=f[P-16]+E+f[P-7]+j|0}let x=i[0],m=i[1],y=i[2],k=i[3],u=i[4],g=i[5],_=i[6],L=i[7];for(let P=0;P<64;P++){const E=t(u,6)^t(u,11)^t(u,25),j=u&g^~u&_,S=L+E+j+r[P]+f[P]|0,$=t(x,2)^t(x,13)^t(x,22),I=x&m^x&y^m&y,v=$+I|0;L=_,_=g,g=u,u=k+S|0,k=y,y=m,m=x,x=S+v|0}i[0]=i[0]+x|0,i[1]=i[1]+m|0,i[2]=i[2]+y|0,i[3]=i[3]+k|0,i[4]=i[4]+u|0,i[5]=i[5]+g|0,i[6]=i[6]+_|0,i[7]=i[7]+L|0}let b="";for(let l=0;l<8;l++){const f=i[l];b+=(f>>>24&255).toString(16).padStart(2,"0"),b+=(f>>>16&255).toString(16).padStart(2,"0"),b+=(f>>>8&255).toString(16).padStart(2,"0"),b+=(f&255).toString(16).padStart(2,"0")}return b}function qt(o,t){if(!o||typeof o!="object")return!1;const s=o;for(const i of t)if(s[i]===!0)return!0;for(const i of Object.keys(s))if(qt(s[i],t))return!0;return!1}const zt=o=>Math.round((o+Number.EPSILON)*100)/100,Bo=o=>{if(!o||typeof o!="object")return;const t=o.meta;if(!t||typeof t!="object")return;const s=t.zone;if(s){if(typeof s=="object"&&s!==null)return s.name;if(typeof s=="string")return s}};function mr(o,t,s,i){const r=pe.load(o)||{},a=pe.load(t)||{},c=r.outlines||{},p=Object.keys(c),b=p.filter(F=>!F.startsWith("_")).length,l=p.length,f=Object.keys(r.pcbs||{}).length,x=Object.keys(r.cases||{}).length,m=qt(r.pcbs,["reversible","reverse"]),y=qt(r.points,["mirror"]),k=r.meta||{},u=k.name??"no_name",g=k.author??"no_author",_=r.points||{},L=Object.keys(_.zones||{}).length,P=_.zones||{},j=Object.keys(P).filter(F=>{const w=P[F];return w&&typeof w=="object"&&("columns"in w||"rows"in w)}),S=j.length,$=S>0;let I="",v="",C="",A="",M="",T="",W=0;const G=Object.keys(a);if($){const F=[...j].sort(),w=[],O=[],H=[],B=[],U=[],te=[];for(const ne of F){const Z=P[ne],he=[...Object.keys((Z==null?void 0:Z.columns)||{})].sort(),We=[...Object.keys((Z==null?void 0:Z.rows)||{})].sort(),Ze=(Z==null?void 0:Z.mirror)===!0||typeof(Z==null?void 0:Z.mirror)=="object"&&(Z==null?void 0:Z.mirror)!==null,Qe=_.mirror===!0||typeof _.mirror=="object"&&_.mirror!==null,et=Ze||Qe;let Pe=G.filter(me=>{const _e=a[me];if(Bo(_e)!==ne)return!1;if(_e&&typeof _e=="object"){const Ue=_e.meta;if(Ue&&typeof Ue=="object"&&Ue.mirrored===!0)return!1}return!me.startsWith("mirror_")}).length;et&&(Pe*=2),w.push(ne),O.push(he.length),H.push(We.length),B.push(Pe),U.push(he.join(",")),te.push(We.join(",")),W+=Pe}I=w.join(","),v=O.join(","),C=H.join(","),A=B.join(","),M=U.join("|"),T=te.join("|")}const Y=G.map(F=>{const w=a[F],O=Bo(w),B=(O?j.includes(O):!1)?"K":"A",U=zt((w==null?void 0:w.x)??0),te=zt((w==null?void 0:w.y)??0),ne=zt((w==null?void 0:w.r)??0);return{name:F,type:B,x:U,y:te,r:ne}});Y.sort((F,w)=>F.x!==w.x?F.x-w.x:F.y!==w.y?F.y-w.y:F.r!==w.r?F.r-w.r:F.name.localeCompare(w.name));const q=Y.map(F=>`${F.type}${F.x.toString()};${F.y.toString()};${F.r.toString()}`).join("|"),ae=`${u}|${g}|${q}`,ee=gr(ae).substring(0,12),R=!y&&m?W*2:W;return{total_generation_time_ms:s,count_outlines:b,count_raw_outlines:l,count_pcbs:f,count_cases:x,is_reversible:m,is_mirrored:y,config_name:u,config_author:g,count_zones:L,matrix_zones:S,has_matrix:$,matrix_zone_names:I,matrix_col_counts:v,matrix_row_counts:C,matrix_key_counts:A,matrix_col_names:M,matrix_row_names:T,matrix_keys:W,keyboard_keys:R,config_id:ee,previous_config_id:i}}const n={colors:{accent:"#28a745",accentDark:"#1e8e1e",accentDarker:"#1e7e34",accentSecondary:"#239923",background:"#222222",backgroundLight:"#2a2a2a",backgroundLighter:"#333333",border:"#3f3f3f",text:"#ffffff",textDark:"#ccc",textDarker:"#aaa",textDarkest:"#666",error:"#ff6d6d",errorDark:"#a31111",warning:"hsl(45, 100%, 90%)",warningDark:"hsl(32, 79%, 40%)",info:"hsl(206, 94%, 92%)",infoDark:"hsl(206, 100%, 30%)",success:"hsl(120, 73%, 92%)",successDark:"hsl(120, 50%, 35%)",white:"#fff",buttonHover:"#3f3f3f"},fonts:{body:"'Roboto', sans-serif",code:"source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"},fontSizes:{xs:"0.4rem",sm:"0.8rem",base:"1rem",lg:"1.2rem",iconMedium:"16px",iconLarge:"24px",bodySmall:"13px",h1:"2.5rem",h2:"2rem",h3:"1.5rem"},fontWeights:{regular:400,semiBold:600,bold:700},buttonSizes:{large:{padding:"1rem 2rem",fontSize:"1rem"},medium:{padding:"0.7rem 1.4rem",fontSize:"1rem"},small:{padding:"8px 12px",fontSize:"0.8rem"},icon:{padding:"8px 12px",fontSize:"0.4rem"}}},vt=d.button`
  display: inline-block;
  border: none;
  padding: ${n.buttonSizes.large.padding};
  margin: 0;
  text-decoration: none;
  background-color: ${n.colors.accent};
  border-radius: 0.25rem;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  color: ${n.colors.white};
  font-family: ${n.fonts.body};
  font-size: ${n.buttonSizes.large.fontSize};
  cursor: pointer;
  text-align: center;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:hover {
    background-color: ${n.colors.accentDark};
    border-color: ${n.colors.accentDarker};
  }

  &:active {
    transform: scale(0.98);
    outline: 2px solid ${n.colors.white};
    outline-offset: -5px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,br=d(vt)`
  padding: ${n.buttonSizes.medium.padding};
  font-size: ${n.buttonSizes.medium.fontSize};
`,xr=d(vt)`
  padding: ${n.buttonSizes.small.padding};
  font-size: ${n.buttonSizes.small.fontSize};
`,wr=d(vt)`
  padding: ${n.buttonSizes.icon.padding};
  font-size: ${n.buttonSizes.icon.fontSize};
`,de=({size:o,...t})=>{switch(o){case"icon":return e.jsx(wr,{...t});case"sm":case"small":return e.jsx(xr,{...t});case"md":case"medium":return e.jsx(br,{...t});case"lg":case"large":default:return e.jsx(vt,{...t})}},yr=o=>o.charAt(0).toUpperCase()+o.slice(1),_t=({injectionName:o,injectionType:t,onResolve:s,onCancel:i,"data-testid":r})=>{const[a,c]=h.useState(!1),p=yr(t);return e.jsx(kr,{"data-testid":r,children:e.jsxs(vr,{"data-testid":r&&`${r}-box`,children:[e.jsxs(_r,{children:[p," Conflict"]}),e.jsxs(jr,{children:["A ",t," with the name ",e.jsx("strong",{children:o})," ","already exists.",e.jsx("br",{}),"How would you like to resolve this conflict?"]}),e.jsxs($r,{children:[e.jsx(Cr,{type:"checkbox",id:"apply-to-all",checked:a,onChange:b=>c(b.target.checked),"data-testid":r&&`${r}-apply-to-all`,"aria-label":"Apply this choice to all conflicts"}),e.jsx(Sr,{$checked:a,onClick:()=>c(!a),role:"checkbox","aria-checked":a}),e.jsx("label",{htmlFor:"apply-to-all",children:"Apply to all conflicts"})]}),e.jsxs(Pr,{children:[e.jsx(de,{onClick:()=>s("skip",a),size:"medium","data-testid":r&&`${r}-skip`,"aria-label":`Skip this ${t}`,children:"Skip"}),e.jsx(de,{onClick:()=>s("overwrite",a),size:"medium","data-testid":r&&`${r}-overwrite`,"aria-label":`Overwrite existing ${t}`,children:"Overwrite"}),e.jsx(de,{onClick:()=>s("keep-both",a),size:"medium","data-testid":r&&`${r}-keep-both`,"aria-label":`Keep both ${t}s`,children:"Keep Both"})]}),e.jsx(Er,{onClick:i,size:"small","data-testid":r&&`${r}-cancel`,"aria-label":"Cancel loading",children:"Cancel"})]})})},kr=d.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`,vr=d.div`
  background-color: ${n.colors.backgroundLight};
  border: 1px solid ${n.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`,_r=d.h2`
  margin: 0 0 1rem 0;
  font-size: ${n.fontSizes.h3};
  color: ${n.colors.text};
`,jr=d.p`
  margin: 0 0 1.5rem 0;
  font-size: ${n.fontSizes.base};
  color: ${n.colors.textDark};
  line-height: 1.5;

  strong {
    color: ${n.colors.accent};
  }
`,$r=d.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 0.75rem;

  label {
    cursor: pointer;
    font-size: ${n.fontSizes.base};
    color: ${n.colors.textDark};
    user-select: none;
  }
`,Cr=d.input`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`,Sr=d.div`
  position: relative;
  width: 44px;
  height: 22px;
  background-color: ${o=>o.$checked?n.colors.accent:n.colors.backgroundLighter};
  border: 1px solid ${n.colors.border};
  border-radius: 11px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${o=>o.$checked?"24px":"2px"};
    width: 16px;
    height: 16px;
    background-color: ${n.colors.text};
    border-radius: 50%;
    transition: left 0.2s ease-in-out;
  }
`,Pr=d.div`
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  margin-bottom: 1rem;
`,Er=d(de)`
  width: 100%;
  background-color: ${n.colors.backgroundLighter};
  color: ${n.colors.textDark};

  &:hover {
    background-color: ${n.colors.buttonHover};
  }
`,Ne=o=>Array.isArray(o)&&o.length===3&&typeof o[0]=="string"&&typeof o[1]=="string"&&typeof o[2]=="string",Dn=(o,t,s)=>!s||s.length===0?{hasConflict:!1}:s.some(r=>Ne(r)&&r[0]===o&&r[1]===t)?{hasConflict:!0,conflictingName:t}:{hasConflict:!1},Ir=(o,t)=>{if(!t||t.length===0)return[];const s=[];for(const i of o){if(!Ne(i))continue;const[r,a]=i,c=Dn(r,a,t);c.hasConflict&&s.push({injection:i,conflict:c})}return s},An=(o,t,s)=>{if(!s||s.length===0)return t;const i=new Set(s.filter(c=>Ne(c)&&c[0]===o).map(c=>c[1]));let r=1,a=`${t}_${r}`;for(;i.has(a);)r++,a=`${t}_${r}`;return a},Lt=(o,t,s)=>{const i=t?[...t]:[];for(const r of o){if(!Ne(r)){console.warn("[mergeInjectionArraysWithResolution] Skipping invalid injection format:",r);continue}const[a,c,p]=r;if(!Dn(a,c,i).hasConflict)i.push([a,c,p]);else{if(s==="skip")continue;if(s==="overwrite"){const l=i.findIndex(f=>Ne(f)&&f[0]===a&&f[1]===c);l!==-1&&(i[l]=[a,c,p])}else if(s==="keep-both"){const l=An(a,c,i);i.push([a,l,p])}}}return i},jt=o=>{const[t,s]=h.useState([]),i=t.length>0?t[0]:null,[r,a]=h.useState(null),[c,p]=h.useState(null),[b,l]=h.useState(null),f=h.useCallback(async(y,k,u=null,g)=>{var S,$,I;const _=g||o.getCurrentInjections();if(y.length===0){o.setInjectionInput(_),o.setConfigInput(k),await o.generateNow(k,_,{pointsonly:!1}),await((S=o.onComplete)==null?void 0:S.call(o,k,_));return}const L=y.filter(v=>Ne(v)?!0:(console.warn("[useInjectionConflictResolution] Skipping invalid injection format:",v),!1));if(L.length===0){o.setInjectionInput(_),o.setConfigInput(k),await o.generateNow(k,_,{pointsonly:!1}),await(($=o.onComplete)==null?void 0:$.call(o,k,_));return}const P=Ir(L,_);if(P.length>0&&!u){const v=P.map(C=>({injection:C.injection,conflict:C.conflict}));V("conflict_encountered",{conflict_count:P.length}),s(v),a(L),p(k),l(_);return}const j=Lt(L,_,u||"skip");o.setInjectionInput(j),o.setConfigInput(k),await o.generateNow(k,j,{pointsonly:!1}),await((I=o.onComplete)==null?void 0:I.call(o,k,j))},[o]),x=h.useCallback(async(y,k)=>{var u,g;if(!(!r||!c||t.length===0))if(k){V("conflict_resolved",{strategy:y,apply_to_all:!0,remaining_count:t.length});const _=Lt(r,b||o.getCurrentInjections(),y);o.setInjectionInput(_),o.setConfigInput(c),await o.generateNow(c,_,{pointsonly:!1}),await((u=o.onComplete)==null?void 0:u.call(o,c,_)),s([]),a(null),p(null),l(null)}else{V("conflict_resolved",{strategy:y,apply_to_all:!1,remaining_count:t.length});const _=t[0],[L,P]=_.injection,E=_.injection,j=t.slice(1);s(j);let S=[...b||o.getCurrentInjections()],$=[...r||[]];if(y==="overwrite")S=S.filter(I=>!(I[0]===L&&I[1]===P));else if(y==="skip")$=$.filter(I=>!(I[0]===L&&I[1]===P&&I[2]===E[2]));else if(y==="keep-both"){const I=An(L,P,S),v=[L,I,E[2]];S=[...S,v],$=$.filter(C=>!(C[0]===L&&C[1]===P&&C[2]===E[2]))}if(l(S),a($),j.length===0){const I=Lt($,S,"skip");o.setInjectionInput(I),o.setConfigInput(c),await o.generateNow(c,I,{pointsonly:!1}),await((g=o.onComplete)==null?void 0:g.call(o,c,I)),a(null),p(null),l(null)}}},[r,c,b,t,o]),m=h.useCallback(()=>{var y;V("conflict_cancelled",{remaining_count:t.length}),s([]),a(null),p(null),l(null),(y=o.setError)==null||y.call(o,"Loading cancelled by user")},[o,t.length]);return{currentConflict:i?{name:i.injection[1],type:i.injection[0]}:null,processInjectionsWithConflictResolution:f,handleConflictResolution:x,handleConflictCancel:m}},zr={templates:"4.3.0",outlines:"4.3.0"},se=o=>{if(typeof window<"u"&&window.location)try{const b=new URLSearchParams(window.location.search).get(`ff_${o}`);if(b==="true")return!0;if(b==="false")return!1}catch(p){console.warn("[FeatureFlags] Failed to check URL query parameters:",p)}let t;if((o==="templates"||o==="outlines")&&(t=""),t==="true")return!0;if(t==="false")return!1;let i=kt("github:ceoloide/ergogen#v4.3.0").displayText;Ce(i)||(i=Re.version);const r=zr[o],a=Ce(i),c=Ce(r);return a&&c?Jt(a,c):!1},Lr=50*1024*1024,Dr=10*1024*1024,Dt=(o,t)=>{const s=`${t}/`;let i=o;return i.startsWith(s)&&(i=i.substring(s.length)),i=i.replace(/\.js$/,""),i},Ar=o=>{let t=o.file("config.yaml")||o.file("config.yml");if(!t){const s=o.file(/^config\.(yaml|yml)$/i);s&&s.length>0&&(t=s[0])}if(!t)throw new Error("The archive is missing a config.yaml file in the root directory.");return t},Kt=(o,t)=>{if(t&&o>Lr)throw new Error(`File exceeds the maximum size limit of 50MB for archives (current size: ${(o/(1024*1024)).toFixed(1)}MB).`);if(!t&&o>Dr)throw new Error(`File exceeds the maximum size limit of 10MB for text files (current size: ${(o/(1024*1024)).toFixed(1)}MB).`)},Rn=(o,t,s)=>{const i=[];return o.forEach(r=>i.push(["footprint",r.name,r.content])),t.forEach(r=>i.push(["outline",r.name,r.content])),s.forEach(r=>i.push(["template",r.name,r.content])),i},Rr=async o=>{let t;try{t=await Ke.loadAsync(o)}catch{throw new Error("The file appears to be corrupted. Please verify the file and try again.")}const i=await Ar(t).async("string"),r=[],a=[];return t.forEach((c,p)=>{if(!(p.dir||!c.endsWith(".js"))){if(c.startsWith("footprints/")){const b=p.async("string").then(l=>{const f=Dt(c,"footprints");r.push({type:"footprint",name:f,content:l})});a.push(b)}else if(c.startsWith("outlines/")&&se("outlines")){const b=p.async("string").then(l=>{const f=Dt(c,"outlines");r.push({type:"outline",name:f,content:l})});a.push(b)}else if(c.startsWith("templates/")&&se("templates")){const b=p.async("string").then(l=>{const f=Dt(c,"templates");r.push({type:"template",name:f,content:l})});a.push(b)}}}),await Promise.all(a),{config:i,injections:r}},Xt="ergogen:config",ao="ergogen:multi-config",Yt="LOCAL_STORAGE_CONFIG",Nr=5e3,Wr=40,Ur=3;class fe extends Error{constructor(t){super(t),this.name="RateLimitError"}}class Or{constructor(){this.providers=[]}register(t){this.providers.push(t)}resolve(t){const s=t.trim();for(const i of this.providers)if(i.canHandle(s))return i;return/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(s)&&this.providers[0]||null}}const Xe=new Or,Fr=o=>{const t=[],s=o.split(`
`);let i={};for(const r of s){const a=r.trim();if(a.startsWith("[submodule"))i.path&&i.url&&t.push({path:i.path,url:i.url}),i={};else{const c=a.indexOf("=");if(c!==-1){const p=a.substring(0,c).trim(),b=a.substring(c+1).trim();p==="path"?i.path=b:p==="url"&&(i.url=b)}}}return i.path&&i.url&&t.push({path:i.path,url:i.url}),t};class Ye{async fetchConfig(t){console.log(`[GitHub] Starting fetch from URL: ${t}`);const s=this.parseUrl(t),{owner:i,repo:r,branch:a,filePath:c,isRepoRoot:p}=s,b=s.host,l=[],f=[],x=[],m=async(k,u,g,_,L)=>{console.log("[GitHub] Checking for .gitmodules file");try{const P=await this.fetchFileContent(i,r,".gitmodules",u,b);console.log("[GitHub] .gitmodules found, parsing submodules");const E=Fr(P);for(const j of E)if(j.path.includes(g)||j.path.includes(_)&&se("outlines")||j.path.includes(L)&&se("templates")){const S=j.path.includes(_),$=j.path.includes(L),I=S?_:$?L:g,v=S?f:$?x:l,C=j.path.substring(j.path.indexOf(I)+I.length+1),A=Xe.resolve(j.url);if(A instanceof Ye){const M=A.parseUrl(j.url),T=M.host;let W=[];try{W=await A.fetchFootprintsFromDirectory(M.owner,M.repo,"","main",[".js"],T)}catch(Y){if(Y instanceof fe)throw Y;try{W=await A.fetchFootprintsFromDirectory(M.owner,M.repo,"","master",[".js"],T)}catch(q){if(q instanceof fe)throw q;console.warn(`Failed to fetch submodule footprints from ${j.url}`)}}const G=W.map(Y=>({name:C?`${C}/${Y.name}`:Y.name,content:Y.content}));v.push(...G)}}}catch(P){if(P instanceof fe)throw P}};if(!p){if(!c)throw new Error("Invalid URL. File path not specified.");const k=await this.fetchFileContent(i,r,c,a,b);Kt(k.length,!1);const u=c.split("/").pop()||"";if(!(u==="config.yaml"||u==="config.yml"))return{config:k,footprints:[],outlines:[],templates:[],configPath:u};const _=c.substring(0,c.lastIndexOf("/")),L=_?`${_}/footprints`:"footprints",P=_?`${_}/outlines`:"outlines",E=_?`${_}/templates`:"templates";try{const j=await this.fetchFootprintsFromDirectory(i,r,L,a,[".js"],b);l.push(...j)}catch(j){if(j instanceof fe)throw j}if(se("outlines"))try{const j=await this.fetchFootprintsFromDirectory(i,r,P,a,[".js",".svg"],b);f.push(...j)}catch(j){if(j instanceof fe)throw j}if(se("templates"))try{const j=await this.fetchFootprintsFromDirectory(i,r,E,a,[".js"],b);x.push(...j)}catch(j){if(j instanceof fe)throw j}return await m(_,a,L,P,E),{config:k,footprints:l,outlines:f,templates:x,configPath:u}}const y=async k=>{var j,S,$,I,v,C,A,M,T,W,G,Y;let u="",g="",_=!0;try{u=await this.fetchFileContent(i,r,"config.yaml",k,b),g=""}catch(q){const ae=q;if((j=ae.message)!=null&&j.includes("allowance")||(S=ae.message)!=null&&S.includes("limit exceeded")||($=ae.message)!=null&&$.includes("rate limit"))throw ae;try{u=await this.fetchFileContent(i,r,"config.yml",k,b),g=""}catch(ue){const ee=ue;if((I=ee.message)!=null&&I.includes("allowance")||(v=ee.message)!=null&&v.includes("limit exceeded")||(C=ee.message)!=null&&C.includes("rate limit"))throw ee;try{u=await this.fetchFileContent(i,r,"ergogen/config.yaml",k,b),g="ergogen"}catch(R){const F=R;if((A=F.message)!=null&&A.includes("allowance")||(M=F.message)!=null&&M.includes("limit exceeded")||(T=F.message)!=null&&T.includes("rate limit"))throw F;try{u=await this.fetchFileContent(i,r,"ergogen/config.yml",k,b),g="ergogen"}catch(w){const O=w;if((W=O.message)!=null&&W.includes("allowance")||(G=O.message)!=null&&G.includes("limit exceeded")||(Y=O.message)!=null&&Y.includes("rate limit"))throw O;const{configYamls:H,anyYamls:B}=await this.bfsForYamlFiles(i,r,k,b);if(H.length>0){const U=H[0];u=await this.fetchFileContent(i,r,U,k,b),g=U.includes("/")?U.substring(0,U.lastIndexOf("/")):""}else if(B.length>0){const U=B[0];u=await this.fetchFileContent(i,r,U,k,b),g=U.includes("/")?U.substring(0,U.lastIndexOf("/")):"",_=!1}else throw new Error("No YAML configuration files found in repository")}}}}if(Kt(u.length,!1),!_)return{config:u,footprints:[],outlines:[],templates:[],configPath:g};const L=g?`${g}/footprints`:"footprints",P=g?`${g}/outlines`:"outlines",E=g?`${g}/templates`:"templates";try{const q=await this.fetchFootprintsFromDirectory(i,r,L,k,[".js"]);l.push(...q)}catch(q){if(q instanceof fe)throw q}if(se("outlines"))try{const q=await this.fetchFootprintsFromDirectory(i,r,P,k,[".js",".svg"]);f.push(...q)}catch(q){if(q instanceof fe)throw q}if(se("templates"))try{const q=await this.fetchFootprintsFromDirectory(i,r,E,k,[".js"]);x.push(...q)}catch(q){if(q instanceof fe)throw q}return await m(g,k,L,P,E),{config:u,footprints:l,outlines:f,templates:x,configPath:g}};if(a!=="main")return await y(a);try{return await y("main")}catch(k){if(k instanceof fe)throw k;return await y("master")}}async fetchFootprintsFromDirectory(t,s,i,r,a,c){const p=[],b=async l=>{try{const f=await this.listDirectory(t,s,l,r,c);for(const x of f){const m=x.path.startsWith(l)?x.path:l?`${l}/${x.path}`:x.path;if(x.type==="file"){if(a.some(k=>x.name.endsWith(k)))try{const k=await this.fetchFileContent(t,s,m,r,c),u=i?m.slice(i.length+1).replace(/\.[^/.]+$/,""):m.replace(/\.[^/.]+$/,"");console.log(`[GitHub] Loaded footprint: ${u}`),p.push({name:u,content:k})}catch(k){if(k instanceof fe)throw k;const u=k;console.warn(`Failed to fetch file content: ${m}`,u.stack||u)}}else x.type==="dir"&&await b(m)}}catch(f){if(f instanceof fe)throw f}};return await b(i),p}async bfsForYamlFiles(t,s,i,r){var f,x,m;const a=[],c=[],p=[{path:"",depth:0}],b=new Set;let l=0;for(;p.length>0&&l<Wr;){const{path:y,depth:k}=p.shift();if(!b.has(y)){b.add(y);try{l++;const u=await this.listDirectory(t,s,y,i,r);for(const g of u)if(g.type==="file"){const _=g.name.toLowerCase();(_.endsWith(".yaml")||_.endsWith(".yml"))&&!_.startsWith(".")&&_.replace(/\.(yaml|yml)$/,"")!=="metadata"&&_.replace(/\.(yaml|yml)$/,"")!=="virtual_env"&&(g.name==="config.yaml"||g.name==="config.yml"?a.push(g.path):c.push(g.path))}else g.type==="dir"&&k<Ur&&(g.name.startsWith(".")||p.push({path:g.path,depth:k+1}));if(a.length>0||c.length>0&&(p.length===0||p[0].depth>k))break}catch(u){const g=u;if((f=g.message)!=null&&f.includes("allowance")||(x=g.message)!=null&&x.includes("limit exceeded")||(m=g.message)!=null&&m.includes("rate limit"))throw g;continue}}}return{configYamls:a,anyYamls:c}}}const Br=(o,t)=>{var p,b,l,f;if(!o)return{isLimitExceeded:!1,error:null};if(t.includes("raw.githubusercontent.com"))return o.status===429?(console.warn("[GitHub] Raw content rate limit exceeded (429). Please wait 30 minutes and try again."),{isLimitExceeded:!0,error:"You've reached your hourly request allowance for loading content from GitHub. Please wait 30 minutes and try again."}):{isLimitExceeded:!1,error:null};const i=((p=o.headers)==null?void 0:p.get("X-RateLimit-Limit"))||"unknown",r=((b=o.headers)==null?void 0:b.get("X-RateLimit-Remaining"))||"unknown",a=((l=o.headers)==null?void 0:l.get("X-RateLimit-Used"))||"unknown",c=((f=o.headers)==null?void 0:f.get("X-RateLimit-Reset"))||"unknown";if(console.log(`[GitHub Rate Limit] Limit: ${i}, Remaining: ${r}, Used: ${a}, Reset: ${c}`),o.status===403&&r==="0")return console.warn("[GitHub] Rate limit exceeded. Please wait and try again in about an hour."),{isLimitExceeded:!0,error:"Cannot load from GitHub right now. You've used your hourly request allowance. Please wait about an hour and try again."};if(r!=="unknown"&&i!=="unknown"){const x=parseInt(i),m=parseInt(r),y=(x-m)/x*100;if(y>=80&&m>0)return console.warn(`[GitHub] Approaching rate limit: ${y.toFixed(1)}% used`),{isLimitExceeded:!1,error:"Loading from GitHub may become unavailable soon. You've used most of your hourly request allowance. This will reset within an hour."}}return{isLimitExceeded:!1,error:null}};class Mr extends Ye{constructor(){super(...arguments),this.rateLimitWarning=null}canHandle(t){const s=t.trim();return s.includes("github.com")||/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(s)}parseUrl(t){const s=t.trim();let i="",r="",a="main",c,p=!0;const b=!s.includes("github.com");if(b){const l=s.split("/").filter(Boolean);if(l.length<2)throw new Error("Invalid GitHub repository format. Must contain owner and repository.");i=l[0],r=l[1],p=l.length===2||l.length===4&&l[2]==="tree",p?l.length===4&&(a=l[3]):l[2]==="blob"||l[2]==="tree"?(a=l[3],c=l.slice(4).join("/")):c=l.slice(2).join("/")}else{let l=s;l.match(/^(https?:\/\/)/i)||(l=`https://${l}`);const f=l.endsWith("/")?l.slice(0,-1):l,m=new URL(f).pathname.split("/").filter(Boolean);if(m.length<2)throw new Error("Invalid GitHub URL. Must contain owner and repository.");i=m[0],r=m[1],p=m.length===2||m.length===4&&m[2]==="tree",p?m.length===4&&(a=m[3]):m[2]==="blob"||m[2]==="tree"?(a=m[3],c=m.slice(4).join("/")):c=m.slice(2).join("/")}return r.endsWith(".git")&&(r=r.slice(0,-4)),{owner:i,repo:r,branch:a,filePath:c,isRepoRoot:p,baseUrl:b?`https://github.com/${i}/${r}`:s}}async fetchFileContent(t,s,i,r){const a=`https://raw.githubusercontent.com/${t}/${s}/${r}/${i}`,c=await fetch(a);if(this.checkRateLimits(c,a),!c.ok)throw new Error(`Failed to fetch file content from GitHub: ${c.status}`);return await c.text()}async listDirectory(t,s,i,r){const a=`https://api.github.com/repos/${t}/${s}/contents/${i}?ref=${r}`,c=await fetch(a);if(this.checkRateLimits(c,a),!c.ok)throw new Error(`Failed to list directory from GitHub: ${c.status}`);const p=await c.json();let b=[];if(Array.isArray(p))b=p;else if(p&&typeof p=="object"&&"tree"in p&&Array.isArray(p.tree))b=p.tree;else throw new Error("Target path is not a directory");return b.map(l=>({name:l.name||l.path.split("/").pop()||"",path:l.path,type:l.type==="tree"?"dir":l.type==="blob"?"file":l.type}))}checkRateLimits(t,s){const i=Br(t,s);if(i.error&&!this.rateLimitWarning&&(this.rateLimitWarning=i.error),i.isLimitExceeded)throw new fe(i.error||"Rate limit exceeded")}async fetchConfig(t){this.rateLimitWarning=null;const s=await super.fetchConfig(t);return this.rateLimitWarning&&(s.rateLimitWarning=this.rateLimitWarning),s}}Xe.register(new Mr);const Nn=async o=>{const t=Xe.resolve(o);if(!t)throw new Error(`Unsupported repository provider URL: ${o}`);return t.fetchConfig(o)};class Tr extends Ye{canHandle(t){return t.includes("codeberg.org")}parseUrl(t){const s=t.trim();let i="",r="",a="main",c,p=!0;const b=!s.includes("codeberg.org");if(b){const l=s.split("/").filter(Boolean);if(l.length<2)throw new Error("Invalid Codeberg repository format. Must contain owner and repository.");i=l[0],r=l[1],p=l.length===2||l.length===5&&l[2]==="src"&&(l[3]==="branch"||l[3]==="commit"),p?l.length===5&&(a=l[4]):l.length>=5&&l[2]==="src"&&(l[3]==="branch"||l[3]==="commit")?(a=l[4],c=l.slice(5).join("/")):c=l.slice(2).join("/")}else{let l=s;l.match(/^(https?:\/\/)/i)||(l=`https://${l}`);const f=l.endsWith("/")?l.slice(0,-1):l,m=new URL(f).pathname.split("/").filter(Boolean);if(m.length<2)throw new Error("Invalid Codeberg URL. Must contain owner and repository name.");i=m[0],r=m[1],p=m.length===2||m.length===5&&m[2]==="src"&&(m[3]==="branch"||m[3]==="commit"),p?m.length===5&&(a=m[4]):m.length>=5&&m[2]==="src"&&(m[3]==="branch"||m[3]==="commit")?(a=m[4],c=m.slice(5).join("/")):c=m.slice(2).join("/")}return r.endsWith(".git")&&(r=r.slice(0,-4)),{owner:i,repo:r,branch:a,filePath:c,isRepoRoot:p,baseUrl:b?`https://codeberg.org/${i}/${r}`:s}}async fetchFileContent(t,s,i,r){const a=`https://codeberg.org/api/v1/repos/${t}/${s}/raw/${i}?ref=${r}`,c=await fetch(a);if(!c.ok)throw new Error(`Failed to fetch file content from Codeberg API: ${c.status}`);return await c.text()}async listDirectory(t,s,i,r){const a=i?`/${i}`:"",c=`https://codeberg.org/api/v1/repos/${t}/${s}/contents${a}?ref=${r}`,p=await fetch(c);if(!p.ok)throw new Error(`Failed to list directory from Codeberg API: ${p.status}`);const b=await p.json();if(!Array.isArray(b))throw new Error("Target path is not a directory");return b.map(l=>({name:l.name,path:l.path||l.name,type:l.type}))}}Xe.register(new Tr);class Gr extends Ye{canHandle(t){const s=t.trim();return s.match(/^(https?:\/\/)/i)?!s.includes("github.com")&&!s.includes("codeberg.org"):!1}parseUrl(t){const s=t.trim();let i="",r="",a="main",c,p=!0,b=s;b.match(/^(https?:\/\/)/i)||(b=`https://${b}`);const l=b.endsWith("/")?b.slice(0,-1):b,f=new URL(l),x=f.origin,m=f.pathname.split("/").filter(Boolean);if(m.length<2)throw new Error("Invalid Forgejo/Gitea URL. Must contain owner and repository name.");return i=m[0],r=m[1],p=m.length===2||m.length===5&&m[2]==="src"&&(m[3]==="branch"||m[3]==="commit"),p?m.length===5&&(a=m[4]):m.length>=5&&m[2]==="src"&&(m[3]==="branch"||m[3]==="commit")?(a=m[4],c=m.slice(5).join("/")):c=m.slice(2).join("/"),r.endsWith(".git")&&(r=r.slice(0,-4)),{owner:i,repo:r,branch:a,filePath:c,isRepoRoot:p,baseUrl:s,host:x}}async fetchFileContent(t,s,i,r,a){const p=`${a||"https://codeberg.org"}/api/v1/repos/${t}/${s}/raw/${i}?ref=${r}`,b=await fetch(p);if(!b.ok)throw new Error(`Failed to fetch file content from Gitea/Forgejo API: ${b.status}`);return await b.text()}async listDirectory(t,s,i,r,a){const c=a||"https://codeberg.org",p=i?`/${i}`:"",b=`${c}/api/v1/repos/${t}/${s}/contents${p}?ref=${r}`,l=await fetch(b);if(!l.ok)throw new Error(`Failed to list directory from Gitea/Forgejo API: ${l.status}`);const f=await l.json();if(!Array.isArray(f))throw new Error("Target path is not a directory");return f.map(x=>({name:x.name,path:x.path||x.name,type:x.type}))}}const Hr=new Gr;Xe.register(Hr);const Vr=({processInjectionsWithConflictResolution:o,setError:t})=>{const[s,i]=h.useState(!1),r=h.useRef(!1);return h.useEffect(()=>{const a=async()=>{const c=new URLSearchParams(window.location.search),p=c.get("github"),b=c.get("codeberg"),l=c.get("forgejo"),f=c.get("gitea");let x=p||b||l||f;if(x){b&&!b.includes("codeberg.org")?x=`https://codeberg.org/${b}`:p&&!p.includes("github.com")&&(x=`https://github.com/${p}`),i(!0),console.log("[useConfigLoader] Loading from URL parameter:",x);try{const m=await Nn(x);console.log("[useConfigLoader] Fetch result:",{configLength:m.config.length,footprintsCount:m.footprints.length,outlinesCount:m.outlines.length,configPath:m.configPath,rateLimitWarning:m.rateLimitWarning}),m.rateLimitWarning&&t(m.rateLimitWarning);const y=Rn(m.footprints,m.outlines,m.templates);await o(y,m.config)}catch(m){console.error("[useConfigLoader] Failed to load from remote repository:",m),t(`Failed to load from remote repository: ${m instanceof Error?m.message:String(m)}`)}finally{i(!1)}}};r.current||(r.current=!0,a())},[o,t]),{isLoading:s}},qe=(o,t)=>{const s=new Map;for(const i of t){const[r,a,c]=i;let p="footprints";r==="outline"?p="outlines":r==="template"&&(p="templates");const b=o.folder(p);if(b){const l=a.split("/"),f=l.pop();let x=b,m=p;for(const y of l){const k=`${m}/${y}`;let u=s.get(k);u||(u=x.folder(y)||x,s.set(k,u)),x=u,m=k}f&&x.file(`${f}.js`,c)}}},Wn=async(o,t,s,i,r)=>{var f;const a=new Ke;a.file("config.yaml",t);const c=a.folder("outputs");if(c){if((f=o.demo)!=null&&f.svg&&c.file("demo.svg",o.demo.svg),o.outlines){let x=null;for(const[m,y]of Object.entries(o.outlines))(i||!m.startsWith("_"))&&(y.dxf||y.svg)&&(x||(x=c.folder("outlines")),x&&(y.dxf&&x.file(`${m}.dxf`,y.dxf),y.svg&&x.file(`${m}.svg`,y.svg)))}if(o.pcbs&&Object.keys(o.pcbs).length>0){const x=c.folder("pcbs");if(x)for(const[m,y]of Object.entries(o.pcbs)){const k=m.endsWith(".kicad_pcb")?m:`${m}.kicad_pcb`;x.file(k,y)}}if(o.cases){let x=null;for(const[m,y]of Object.entries(o.cases)){const k=!!y.jscad,u=r&&!!y.stl;(k||u)&&(x||(x=c.folder("cases")),x&&(y.jscad&&x.file(`${m}.jscad`,y.jscad),r&&y.stl&&x.file(`${m}.stl`,y.stl)))}}if(i){const x=c.folder("debug");if(x){x.file("raw.txt",t);for(const[m,y]of Object.entries(o))["canonical","points","units"].includes(m)&&x.file(`${m}.yaml`,JSON.stringify(y,null,2))}}}s&&s.length>0&&qe(a,s);const p=await a.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),l=`ergogen-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Ve.saveAs(p,l)},Jr=(o,t)=>new Promise((s,i)=>{const r=Je();if(!r){i(new Error("Failed to create Ergogen worker"));return}const a=setTimeout(()=>{r.terminate(),i(new Error("Compilation timed out"))},15e3);r.onmessage=p=>{const b=p.data;b.type==="error"?(clearTimeout(a),i(new Error(b.error)),r.terminate()):b.type==="success"&&(clearTimeout(a),s(b.results),r.terminate())},r.onerror=p=>{clearTimeout(a),i(p),r.terminate()};let c;try{c=JSON.parse(o)}catch{try{c=pe.load(o)}catch{c=o}}r.postMessage({type:"generate",inputConfig:c,injectionInput:t,requestId:`export-compile-${Date.now()}`,options:{debug:!0,svg:!0}})}),qr=o=>new Promise(t=>{const s=ro();if(!s){t(o);return}const i=setTimeout(()=>{s.terminate(),t(o)},15e3);s.onmessage=r=>{const a=r.data;a.type==="success"&&a.results?(clearTimeout(i),t(a.results)):(clearTimeout(i),t(o)),s.terminate()},s.onerror=()=>{clearTimeout(i),t(o),s.terminate()},s.postMessage({type:"batch_jscad_to_stl",results:o,configVersion:0})}),Kr=async(o,t,s,i)=>{var b;const r=new Ke;for(const l of o){const f=l.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled",x=r.folder(f);if(x)try{const m=await Jr(l.config,t);let y=m;i&&m.cases&&Object.keys(m.cases).length>0&&(y=await qr(m)),x.file("config.yaml",l.config);const k=x.folder("outputs");if(k){if((b=y.demo)!=null&&b.svg&&k.file("demo.svg",y.demo.svg),y.outlines){let u=null;for(const[g,_]of Object.entries(y.outlines))(s||!g.startsWith("_"))&&(_.dxf||_.svg)&&(u||(u=k.folder("outlines")),u&&(_.dxf&&u.file(`${g}.dxf`,_.dxf),_.svg&&u.file(`${g}.svg`,_.svg)))}if(y.pcbs&&Object.keys(y.pcbs).length>0){const u=k.folder("pcbs");if(u)for(const[g,_]of Object.entries(y.pcbs)){const L=g.endsWith(".kicad_pcb")?g:`${g}.kicad_pcb`;u.file(L,_)}}if(y.cases){let u=null;for(const[g,_]of Object.entries(y.cases)){const L=!!_.jscad,P=i&&!!_.stl;(L||P)&&(u||(u=k.folder("cases")),u&&(_.jscad&&u.file(`${g}.jscad`,_.jscad),i&&_.stl&&u.file(`${g}.stl`,_.stl)))}}if(s){const u=k.folder("debug");if(u){u.file("raw.txt",l.config);for(const[g,_]of Object.entries(y))["canonical","points","units"].includes(g)&&u.file(`${g}.yaml`,JSON.stringify(_,null,2))}}}t&&t.length>0&&qe(x,t)}catch(m){console.error(`Failed to compile config ${l.name}:`,m),x.file("config.yaml",l.config),x.file("error.txt",`Compilation failed: ${m instanceof Error?m.message:String(m)}`)}}const a=await r.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),p=`ergogen-export-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Ve.saveAs(a,p)},Xr=async(o,t)=>{const s=new Ke,i=new Set;for(const p of o){const b=p.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled";let l=b,f=1;for(;i.has(l);)l=`${b}_${f}`,f++;i.add(l),s.file(`${l}.yaml`,p.config)}t&&t.length>0&&qe(s,t);const r=await s.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),c=`ergogen-config-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Ve.saveAs(r,c)},Yr=async(o,t,s,i,r,a,c)=>{const p=new Ke,b=new Set;if(r){for(let m=0;m<o.length;m++){if(c())return;const y=o[m];a(m,o.length,y.name);const k=y.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled";let u=k,g=1;for(;b.has(u);)u=`${k}_${g}`,g++;b.add(u),p.file(`${u}.yaml`,y.config)}if(t&&t.length>0){if(c())return;qe(p,t)}if(c())return;a(o.length,o.length,"Creating ZIP...");const l=await p.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),x=`ergogen-config-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Ve.saveAs(l,x)}else{const l=new Set,f=(g,_)=>new Promise((L,P)=>{if(c()){P(new Error("Aborted"));return}const E=Je();if(!E){P(new Error("Failed to create Ergogen worker"));return}l.add(E);const j=setTimeout(()=>{E.terminate(),l.delete(E),P(new Error("Compilation timed out"))},3e4);E.onmessage=$=>{const I=$.data;I.type==="error"?(clearTimeout(j),E.terminate(),l.delete(E),P(new Error(I.error))):I.type==="success"&&(clearTimeout(j),E.terminate(),l.delete(E),L(I.results))},E.onerror=$=>{clearTimeout(j),E.terminate(),l.delete(E),P($)};let S;try{S=JSON.parse(g)}catch{try{S=pe.load(g)}catch{S=g}}E.postMessage({type:"generate",inputConfig:S,injectionInput:_,requestId:`export-compile-${Date.now()}`})}),x=g=>new Promise(_=>{if(c()||!g.cases||Object.keys(g.cases).length===0){_(g);return}const L=ro();if(!L){_(g);return}l.add(L);const P=setTimeout(()=>{L.terminate(),l.delete(L),_(g)},3e4);L.onmessage=E=>{const j=E.data;j.type==="success"?(clearTimeout(P),L.terminate(),l.delete(L),_(j.results)):j.type==="error"&&(clearTimeout(P),L.terminate(),l.delete(L),_(g))},L.onerror=()=>{clearTimeout(P),L.terminate(),l.delete(L),_(g)},L.postMessage({type:"batch_jscad_to_stl",results:g,configVersion:0})}),m=new Set;let y=0;const k=Math.min(4,navigator.hardwareConcurrency||2),u=async g=>{var P;if(c())return;m.add(g.name),a(y,o.length,Array.from(m).join(", "));const _=g.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled",L=p.folder(_);if(!L){m.delete(g.name),y++,a(y,o.length,Array.from(m).join(", "));return}try{const E=await f(g.config,t);let j=E;if(E.cases&&Object.keys(E.cases).length>0&&(j=await x(E)),c())return;L.file("config.yaml",g.config);const S=L.folder("outputs");if(S){if((P=j.demo)!=null&&P.svg&&S.file("demo.svg",j.demo.svg),j.outlines){let $=null;for(const[I,v]of Object.entries(j.outlines))(s||!I.startsWith("_"))&&(v.dxf||v.svg)&&($||($=S.folder("outlines")),$&&(v.dxf&&$.file(`${I}.dxf`,v.dxf),v.svg&&$.file(`${I}.svg`,v.svg)))}if(j.pcbs&&Object.keys(j.pcbs).length>0){const $=S.folder("pcbs");if($)for(const[I,v]of Object.entries(j.pcbs)){const C=I.endsWith(".kicad_pcb")?I:`${I}.kicad_pcb`;$.file(C,v)}}if(j.cases){let $=null;for(const[I,v]of Object.entries(j.cases)){const C=!!v.jscad,A=!!v.stl;(C||A)&&($||($=S.folder("cases")),$&&(v.jscad&&$.file(`${I}.jscad`,v.jscad),v.stl&&$.file(`${I}.stl`,v.stl)))}}if(s){const $=S.folder("debug");if($){$.file("raw.txt",g.config);for(const[I,v]of Object.entries(j))["canonical","points","units"].includes(I)&&$.file(`${I}.yaml`,JSON.stringify(v,null,2))}}}t&&t.length>0&&qe(L,t)}catch(E){console.error(`Failed to compile config ${g.name}:`,E),L.file("config.yaml",g.config),L.file("error.txt",`Compilation failed: ${E instanceof Error?E.message:String(E)}`)}finally{m.delete(g.name),y++,a(y,o.length,Array.from(m).join(", "))}};try{const g=[...o],_=[],L=async()=>{if(c()||g.length===0)return;const S=g.shift();await u(S),await L()};for(let S=0;S<Math.min(k,g.length);S++)_.push(L());if(await Promise.all(_),c()){l.forEach(S=>S.terminate()),l.clear();return}a(o.length,o.length,"Creating ZIP...");const P=await p.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),j=`ergogen-export-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Ve.saveAs(P,j)}finally{l.forEach(g=>g.terminate()),l.clear()}}},Zr=o=>!o||!Array.isArray(o)?o:o.filter(t=>{if(!Array.isArray(t)||t.length!==3)return!0;const[s]=t;return!(s==="outline"&&!se("outlines")||s==="template"&&!se("templates"))}),Qr=o=>{if(!o||!Array.isArray(o))return null;const t=o.some(a=>Array.isArray(a)&&a[0]==="outline"),s=o.some(a=>Array.isArray(a)&&a[0]==="template"),i=t&&!se("outlines"),r=s&&!se("templates");if(i||r){const a=[];return i&&a.push("outlines"),r&&a.push("templates"),`Custom ${a.join(" and ")} were skipped because the respective feature flags are disabled in settings.`}return null},ei=o=>{if(!o||typeof o!="object")return null;const t=o;if(!t.pcbs||typeof t.pcbs!="object")return null;const s=t.pcbs;for(const i of Object.values(s))if(i&&typeof i=="object"&&(!i.template||i.template==="kicad5")){const r=i.footprints;if(r&&typeof r=="object"){for(const a of Object.values(r))if(a&&typeof a=="object"&&typeof a.what=="string"&&a.what.startsWith("ceoloide"))return'KiCad 5 is deprecated. Please add "template: kicad8" to your PCB definitions to avoid errors when opening PCB files with KiCad 8 or newer.'}}return null},ti=(o,t)=>{if(o&&typeof o=="object"){const s=o;return s.points&&t?{...s,pcbs:void 0,cases:void 0}:s}return o},Me=(o,t)=>{if(typeof window>"u")return t;try{const s=localStorage.getItem(o);return s!==null?JSON.parse(s):t}catch{return t}},$e=()=>({debug:Me("ergogen:config:debug",!1),autoGen:Me("ergogen:config:autoGen",!0),autoGen3D:Me("ergogen:config:autoGen3D",!0),kicanvasPreview:Me("ergogen:config:kicanvasPreview",!0),stlPreview:Me("ergogen:config:stlPreview",!0),sendUsageMetrics:so()}),Un=h.createContext(null),De=()=>typeof window<"u"&&window.crypto&&window.crypto.randomUUID?window.crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,o=>{const t=Math.random()*16|0;return(o==="x"?t:t&3|8).toString(16)}),at=(o,t)=>{let s=0;for(const i of o){const r=i.name.match(t);if(r){const a=parseInt(r[1],10);!isNaN(a)&&a>s&&(s=a)}}return s+1},xt="ergogen:deleted-config",oi=o=>{try{const t=localStorage.getItem(xt),s={version:1,configs:[]};if(t){const r=JSON.parse(t);r&&Array.isArray(r.configs)&&(s.configs=r.configs,r.version!==void 0&&(s.version=r.version))}const i={...o,deletedAt:new Date().toISOString()};s.configs.push(i),localStorage.setItem(xt,JSON.stringify(s))}catch(t){console.error("Failed to save deleted config to storage:",t)}},Mo=()=>{try{const o=localStorage.getItem(xt);if(!o)return;const t=JSON.parse(o);if(!t||!Array.isArray(t.configs))return;let s=t.configs;const i=Date.now(),r=90*24*60*60*1e3;s=s.filter(c=>{const p=new Date(c.deletedAt).getTime();return i-p<=r}),s.length>100&&(s.sort((c,p)=>{const b=new Date(c.updatedAt).getTime(),l=new Date(p.updatedAt).getTime();return b-l}),s=s.slice(s.length-100));const a={version:t.version||1,configs:s};localStorage.setItem(xt,JSON.stringify(a))}catch(o){console.error("Failed to prune deleted configs:",o)}},To=o=>{if(!o)return;let t="";if(typeof o=="string")t=o;else if(Array.isArray(o))t=o.join("");else return;return t=t.replace(/width="[^"]+"/,'width="284px"').replace(/height="[^"]+"/,'height="134px"'),t=t.replace(/<svg/,'<svg style="background-color: rgb(51,51,51);"'),t=t.replaceAll(/stroke="#000"/g,'stroke="#AAA"'),t=t.replaceAll(/stroke:#000/g,"stroke:#AAA"),t},ni=()=>{if(typeof window>"u")return{version:2,activeConfigId:null,configs:[]};const o=localStorage.getItem(ao);if(o)try{const t=JSON.parse(o);if(t&&typeof t.version=="number"){const s=new Date().toISOString(),i=(t.configs||[]).map(r=>({...r,createdAt:r.createdAt||s,updatedAt:r.updatedAt||s}));return{...t,configs:i}}}catch(t){console.error("Failed to parse multi-config storage:",t)}return{version:2,activeConfigId:null,configs:[]}},ce=(o,t,s=2)=>{if(typeof window>"u")return;const i={version:s,activeConfigId:t,configs:o};localStorage.setItem(ao,JSON.stringify(i))},ri=()=>{const o=ni();if(typeof window>"u")return o;const t=localStorage.getItem(Yt),s=localStorage.getItem(Xt);let i="";if(t)try{i=JSON.parse(t)}catch{i=t}else if(s)try{i=JSON.parse(s)}catch{i=s}if(i&&i.trim()!==""){if(!o.configs.some(a=>a.name==="Legacy Config")){const a=De(),c={id:a,name:"Legacy Config",config:i,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};o.configs.push(c),o.activeConfigId=a,ce(o.configs,a,2)}localStorage.removeItem(Yt),localStorage.removeItem(Xt)}return o},ii=({initialInjectionInput:o,hashError:t,children:s})=>{const[i]=h.useState(()=>{if(typeof window>"u")return!1;const z=localStorage.getItem(Yt),D=localStorage.getItem(Xt);return!!(z||D)}),[r]=h.useState(()=>{if(typeof window>"u")return 2;const z=localStorage.getItem(ao);if(z)try{const D=JSON.parse(z);if(D&&typeof D.version=="number")return D.version}catch(D){console.warn("Failed to parse loaded version:",D)}return 1}),[a]=h.useState(()=>ri()),[c,p]=h.useState(()=>a.configs),[b,l]=h.useState(()=>a.activeConfigId),[f,x]=h.useState(!1),[m,y]=h.useState(null),[k,u]=h.useState(()=>{if(a.activeConfigId){const z=a.configs.find(D=>D.id===a.activeConfigId);return z?z.config:""}return""}),g=h.useRef(c),_=h.useRef(b),L=h.useRef(f),P=h.useRef(m),E=h.useRef(k);h.useEffect(()=>{g.current=c},[c]),h.useEffect(()=>{_.current=b},[b]),h.useEffect(()=>{L.current=f},[f]),h.useEffect(()=>{P.current=m},[m]),h.useEffect(()=>{E.current=k},[k]);const j=h.useRef(k);h.useEffect(()=>{j.current=k},[k]);const S=h.useCallback(z=>{j.current=z},[]),$=h.useCallback(()=>j.current,[]),I=h.useRef(void 0),v=h.useRef(null),C=h.useCallback(()=>{if(v.current){const{timeoutId:z,payload:D,configId:N}=v.current;clearTimeout(z),V("keyboard_generated",D),I.current=N,v.current=null}},[]),A=h.useCallback(()=>{I.current=void 0,v.current&&(clearTimeout(v.current.timeoutId),v.current=null)},[]),[M,T]=Uo("ergogen:injection",o),[W,G]=h.useState(null),[Y,q]=h.useState(null),[ae,ue]=h.useState(null),[ee,R]=h.useState(null),[F,w]=h.useState(null),[O,H]=h.useState(0),[B,U]=Uo("ergogen:settings",$e()),te=(B==null?void 0:B.debug)??!1,ne=(B==null?void 0:B.autoGen)??!0,Z=(B==null?void 0:B.autoGen3D)??!0,Se=(B==null?void 0:B.kicanvasPreview)??!0,he=(B==null?void 0:B.stlPreview)??!0,ve=(B==null?void 0:B.sendUsageMetrics)??!0,We=h.useCallback(z=>{U(D=>{const N=D||$e(),J=typeof z=="function"?z(N.debug):z;return{...N,debug:J}})},[U]),Ze=h.useCallback(z=>{U(D=>{const N=D||$e(),J=typeof z=="function"?z(N.autoGen):z;return{...N,autoGen:J}})},[U]),Qe=h.useCallback(z=>{U(D=>{const N=D||$e(),J=typeof z=="function"?z(N.autoGen3D):z;return{...N,autoGen3D:J}})},[U]),et=h.useCallback(z=>{U(D=>{const N=D||$e(),J=typeof z=="function"?z(N.kicanvasPreview):z;return{...N,kicanvasPreview:J}})},[U]),Ct=h.useCallback(z=>{U(D=>{const N=D||$e(),J=typeof z=="function"?z(N.stlPreview):z;return{...N,stlPreview:J}})},[U]),Pe=h.useCallback(z=>{U(D=>{const N=D||$e(),J=typeof z=="function"?z(N.sendUsageMetrics):z;return{...N,sendUsageMetrics:J}})},[U]);h.useEffect(()=>{pr()},[ve]);const[me,_e]=h.useState(!1),[St,Ue]=h.useState(!1),[lo,co]=h.useState(!1),[uo,po]=h.useState(!0),[fo,ho]=h.useState(!0),[go,be]=h.useState(!1),[mo,tt]=h.useState(!1),re=h.useRef(null),xe=h.useRef(null),ot=h.useRef(0),[bo,nt]=h.useState(!1),xo=h.useRef(!0),Pt=h.useRef(null);h.useEffect(()=>{Mo()},[]),h.useEffect(()=>{t&&G(t)},[t]);const wo=h.useCallback(()=>G(null),[]),yo=h.useCallback(()=>q(null),[]),ko=h.useCallback(()=>ue(null),[]),vo=h.useCallback(()=>R(null),[]),rt=h.useCallback(z=>{var N,J,oe,K,Q,le;const D=z.data;if(D.requestId&&D.requestId.startsWith("background-preview-")){const X=D.requestId.substring(19);if(D.type==="success"&&D.results){const ge=D.results,Ie=((J=(N=ge.outlines)==null?void 0:N.preview)==null?void 0:J.svg)||((oe=ge.demo)==null?void 0:oe.svg),Oe=To(Ie);Oe&&p(Fe=>{const Be=Fe.map(ie=>ie.id===X?{...ie,previewSvg:Oe}:ie);return ce(Be,_.current,2),Be})}else D.type==="error"&&console.warn(`Background generation failed for config ${X}:`,D.error);return}if(D.type==="error"){console.error("--- Ergogen worker error:",D.error),G(D.error),be(!1),nt(!1),V("generation_failed",{error_message:D.error||"Unknown worker error",stored_configs_count:g.current.length});return}if(D.type==="success")if(D.warnings&&D.warnings.length>0&&q(X=>(X?X+`
`:"")+D.warnings.join(`
`)),D.results){const X=D.results,ge=Pt.current?performance.now()-Pt.current:0;V("generation_completed",{duration_ms:Math.round(ge),points_count:X.points?Object.keys(X.points).length:0,pcbs_count:X.pcbs?Object.keys(X.pcbs).length:0,cases_count:X.cases?Object.keys(X.cases).length:0,has_outlines:!!X.outlines,stored_configs_count:g.current.length});try{const ie=pe.dump(X.canonical||{}),ke=pe.dump(X.points||{}),ye=mr(ie,ke,Math.round(ge),I.current);if(ye.config_id!==I.current){v.current&&clearTimeout(v.current.timeoutId);const tr=setTimeout(()=>{V("keyboard_generated",ye),I.current=ye.config_id,v.current=null},Nr);v.current={timeoutId:tr,payload:ye,configId:ye.config_id}}}catch(ie){console.error("Failed to generate keyboard configuration analytics:",ie)}const Ie=((Q=(K=X.outlines)==null?void 0:K.preview)==null?void 0:Q.svg)||((le=X.demo)==null?void 0:le.svg),Oe=To(Ie),Fe=_.current;Oe&&Fe&&p(ie=>{const ke=ie.map(ye=>ye.id===Fe?{...ye,previewSvg:Oe}:ye);return ce(ke,Fe,2),ke});let Be=!1;if(he&&X.cases&&Object.keys(X.cases).length>0){for(const ie of Object.keys(X.cases)){const ke=X.cases[ie];ke!=null&&ke.jscad&&(X.cases[ie].stl=void 0)}if(xe.current){Be=!0,nt(!0);const ie={type:"batch_jscad_to_stl",results:X,configVersion:ot.current};xe.current.postMessage(ie)}}w(X),H(ie=>ie+1),Be||be(!1)}else be(!1);else be(!1)},[he]),_o=h.useCallback(z=>{const D=z.data;D.configVersion===ot.current&&(D.type==="error"?(console.error("--- JSCAD worker error:",D.error),nt(!1),be(!1)):D.type==="success"&&D.results&&(w(D.results),H(N=>N+1),nt(!1),be(!1)))},[]);h.useEffect(()=>(re.current||(re.current=Je(),re.current?(re.current.onmessage=rt,re.current.onerror=z=>{console.error("Ergogen worker error:",z),Ge(z.message||"Worker crash",!1,"ergogen_worker")},tt(!0)):console.warn("Failed to initialize Ergogen worker.")),xe.current||(xe.current=ro(),xe.current?(xe.current.onmessage=_o,xe.current.onerror=z=>{console.error("JSCAD worker error:",z),Ge(z.message||"Worker crash",!1,"jscad_worker")}):console.warn("Failed to initialize JSCAD worker.")),()=>{re.current&&(re.current.terminate(),re.current=null,tt(!1)),xe.current&&(xe.current.terminate(),xe.current=null)}),[rt,_o]),h.useEffect(()=>{const z=()=>{document.visibilityState==="hidden"&&C()};return window.addEventListener("visibilitychange",z),window.addEventListener("pagehide",C),()=>{window.removeEventListener("visibilitychange",z),window.removeEventListener("pagehide",C),C()}},[C]),h.useEffect(()=>{V("settings_loaded",{debug:te,autoGen:ne,autoGen3D:Z,kicanvasPreview:Se,stlPreview:he,sendUsageMetrics:ve}),xo.current?xo.current=!1:V("setting_changed",{debug:te,autoGen:ne,autoGen3D:Z,kicanvasPreview:Se,stlPreview:he,sendUsageMetrics:ve})},[te,ne,Z,Se,he,ve]);const jo=h.useCallback(z=>{let D="UNKNOWN",N=null;try{N=JSON.parse(z),D="json"}catch{}try{N=pe.load(z),D="yaml"}catch{}return[D,N]},[]),it=h.useCallback(async(z,D,N={pointsonly:!0})=>{const J=z===void 0||z===E.current?j.current??E.current:z;if(!J)return;const oe=Zr(D),[,K]=jo(J);G(null),q(null),ue(null),be(!0),Pt.current=performance.now(),ot.current+=1;const Q=ei(K);Q&&q(Q);const le=Qr(D);le&&ue(le);const X=ti(K,N.pointsonly)||J;try{re.current?re.current.postMessage({type:"generate",inputConfig:X,injectionInput:oe,requestId:`ergogen-generate-${ot.current}-${Date.now()}`,options:{debug:te,svg:!0}}):console.error("Worker not available for processing request.")}catch(ge){be(!1);const Ie=typeof ge=="string"?ge:String(ge);G(Ie),V("generation_failed",{error_message:Ie,stored_configs_count:g.current.length});return}},[jo,G,q,ue,be,te]),Ee=h.useMemo(()=>vn(it,300),[it]),je=h.useCallback(async(z,D,N={pointsonly:!0})=>{Ee.cancel(),await it(z,D,N)},[Ee,it]),st=h.useCallback(z=>{const D=E.current,N=typeof z=="function"?z(D):z;if(N!==D)if(u(N),L.current){if(N!==P.current){const oe=`Shared Config ${at(g.current,/^Shared\s+Config\s+(\d+)$/)}`,K=De(),Q=new Date().toISOString(),le={id:K,name:oe,config:N||"",createdAt:Q,updatedAt:Q},X=[...g.current,le];p(X),l(K),x(!1),y(null),ce(X,K)}}else{const J=_.current;if(J){const oe=g.current.map(K=>K.id===J?{...K,config:N||"",updatedAt:new Date().toISOString()}:K);p(oe),ce(oe,J)}else{const K=`Untitled ${at(g.current,/^Untitled\s+(\d+)$/)}`,Q=De(),le=new Date().toISOString(),X={id:Q,name:K,config:N||"",createdAt:le,updatedAt:le},ge=[...g.current,X];p(ge),l(Q),ce(ge,Q)}}},[]),$o=h.useCallback(z=>{if(A(),w(null),z===null)l(null),_.current=null,x(!1),y(null),u(""),E.current="",ce(g.current,null);else{const D=g.current.find(N=>N.id===z);D&&(l(z),_.current=z,x(!1),y(null),u(D.config),E.current=D.config,ce(g.current,z),V("config_selected",{stored_configs_count:g.current.length}))}},[A]),Co=h.useCallback((z,D)=>{A(),w(null);const N=at(g.current,/^Untitled\s+(\d+)$/),J=D||`Untitled ${N}`,oe=De(),K=new Date().toISOString(),Q={id:oe,name:J,config:z,createdAt:K,updatedAt:K},le=[...g.current,Q];return p(le),l(oe),x(!1),y(null),u(z),V("config_created",{stored_configs_count:le.length}),g.current=le,_.current=oe,E.current=z,ce(le,oe),oe},[A]),So=h.useCallback((z,D)=>{const N=D.trim();if(!N)return G("Configuration name cannot be empty"),!1;const J=g.current.find(Q=>Q.id===z);if(!J)return!1;if(J.name===N)return!0;if(g.current.some(Q=>Q.id!==z&&Q.name.trim().toLowerCase()===N.toLowerCase()))return G(`A configuration named "${N}" already exists.`),!1;const K=g.current.map(Q=>Q.id===z?{...Q,name:N,updatedAt:new Date().toISOString()}:Q);return p(K),g.current=K,ce(K,_.current),V("config_renamed",{stored_configs_count:K.length}),!0},[G]),Po=h.useCallback(z=>{A(),w(null);const D=g.current.find(N=>N.id===z);if(D){const N=De(),J=new Date().toISOString(),oe={id:N,name:`${D.name} (Copy)`,config:D.config,createdAt:J,updatedAt:J},K=[...g.current,oe];p(K),l(N),x(!1),y(null),u(D.config),g.current=K,_.current=N,E.current=D.config,ce(K,N),V("config_duplicated",{stored_configs_count:K.length})}},[A]),Eo=h.useCallback(z=>{A();const D=_.current,N=g.current.find(Q=>Q.id===z),J=g.current.filter(Q=>Q.id!==z);p(J),g.current=J;const oe=D===z;g.current.length<=1||oe?(w(null),l(null),_.current=null,u(""),E.current="",ce(J,null)):ce(J,D),N&&oi(N),V("config_deleted",{stored_configs_count:J.length})},[A]),Io=h.useCallback(z=>{A(),w(null),x(!0),y(z),u(z)},[A]),zo=h.useCallback(()=>{if(!L.current)return;const D=`Shared Config ${at(g.current,/^Shared\s+Config\s+(\d+)$/)}`,N=De(),J=new Date().toISOString(),oe={id:N,name:D,config:E.current||"",createdAt:J,updatedAt:J},K=[...g.current,oe];p(K),g.current=K,l(N),_.current=N,x(!1),y(null),ce(K,N)},[]),Lo=h.useCallback(()=>{Mo()},[]),Do=h.useCallback(async()=>{await Kr(g.current,M,te,he)},[M,te,he]),Ao=h.useCallback(async()=>{await Xr(g.current,M)},[M]),Ro=h.useMemo(()=>{if(f)return"Shared Config";if(b){const z=c.find(D=>D.id===b);return z?z.name:""}return""},[f,b,c]),Xn=h.useMemo(()=>({setInjectionInput:T,setConfigInput:st,generateNow:je,getCurrentInjections:()=>M||[],setError:G}),[M,je,T,st,G]),{currentConflict:Et,processInjectionsWithConflictResolution:Yn,handleConflictResolution:Zn,handleConflictCancel:Qn}=jt(Xn),{isLoading:No}=Vr({processInjectionsWithConflictResolution:Yn,setError:G});h.useEffect(()=>{if(t||No)return;!new URLSearchParams(window.location.search).get("github")&&k&&je(k,M,{pointsonly:!1})},[No]);const Wo=h.useRef(me);h.useEffect(()=>{Wo.current&&!me&&(console.log("Settings panel closed. Restarting Ergogen worker to clear stale custom libraries..."),re.current&&(re.current.terminate(),re.current=null,tt(!1),console.log("Ergogen worker terminated.")),console.log("Initializing fresh Ergogen worker..."),re.current=Je(),re.current?(re.current.onmessage=rt,re.current.onerror=z=>{console.error("Ergogen worker error:",z),Ge(z.message||"Worker crash",!1,"ergogen_worker")},tt(!0),console.log("Ergogen worker initialized.")):console.warn("Failed to initialize Ergogen worker."),k&&je(k,M,{pointsonly:!Z})),Wo.current=me},[me,k,M,Z,je,rt]),h.useEffect(()=>{localStorage.setItem("ergogen:injection",JSON.stringify(M)),ne&&!me&&Ee(k,M,{pointsonly:!Z})},[k,M,ne,Z,me,Ee]),h.useEffect(()=>{mo&&(r===1||i)&&(console.log("Version 1 or legacy configuration detected on load. Triggering background preview generation for all configs missing a preview SVG..."),ce(g.current,_.current,2),g.current.forEach(z=>{var D;z.previewSvg||(console.log(`Triggering background preview generation for: ${z.name}`),(D=re.current)==null||D.postMessage({type:"generate",inputConfig:z.config,requestId:`background-preview-${z.id}`,options:{debug:!0,svg:!0}}))}))},[mo,r,i]);const er=h.useMemo(()=>({configInput:k,getRealtimeConfigInput:$,updateRealtimeConfigInput:S,setConfigInput:st,configs:c,activeConfigId:b,activeConfigName:Ro,isPreview:f,selectConfig:$o,createNewConfig:Co,renameConfig:So,duplicateConfig:Po,deleteConfig:Eo,exportAllConfigs:Do,downloadAllConfigs:Ao,loadPreview:Io,savePreviewConfig:zo,pruneDeletedConfigs:Lo,injectionInput:M,setInjectionInput:T,processInput:Ee,generateNow:je,error:W,setError:G,clearError:wo,deprecationWarning:Y,clearWarning:yo,skippedWarning:ae,clearSkippedWarning:ko,info:ee,setInfo:R,clearInfo:vo,results:F,resultsVersion:O,setResultsVersion:H,showSettings:me,setShowSettings:_e,isBulkDownloadOpen:St,setIsBulkDownloadOpen:Ue,showSideNav:lo,setShowSideNav:co,showConfig:uo,setShowConfig:po,showDownloads:fo,setShowDownloads:ho,debug:te,setDebug:We,autoGen:ne,setAutoGen:Ze,autoGen3D:Z,setAutoGen3D:Qe,kicanvasPreview:Se,setKicanvasPreview:et,stlPreview:he,setStlPreview:Ct,sendUsageMetrics:ve,setSendUsageMetrics:Pe,isGenerating:go,setIsGenerating:be,isJscadConverting:bo}),[k,$,S,st,c,b,Ro,f,$o,Co,So,Po,Eo,Do,Ao,St,Io,zo,Lo,M,T,Ee,je,W,G,wo,Y,yo,ae,ko,ee,R,vo,F,O,H,me,_e,lo,co,uo,po,fo,ho,te,We,ne,Ze,Z,Qe,Se,et,he,Ct,ve,Pe,go,be,bo]);return e.jsxs(Un.Provider,{value:er,children:[s,Et&&e.jsx(_t,{injectionName:Et.name,injectionType:Et.type,onResolve:Zn,onCancel:Qn,"data-testid":"conflict-resolution-dialog"})]})},we=()=>h.useContext(Un),si=({className:o,options:t,"data-testid":s,"aria-label":i})=>{const r=we(),a=h.useRef(null),c={configInput:void 0,setConfigInput:g=>{},updateRealtimeConfigInput:g=>{},injectionInput:void 0,generateNow:async()=>{},activeConfigId:null},{configInput:p,updateRealtimeConfigInput:b,setConfigInput:l,injectionInput:f,generateNow:x,activeConfigId:m}=r??c,y=h.useRef(vn(g=>{l(g)},500)).current;h.useEffect(()=>()=>{y.cancel()},[y]),h.useEffect(()=>{if(a.current){if(a.current.hasTextFocus())return;const g=a.current.getValue();p!==void 0&&p!==g&&a.current.setValue(p)}},[p]);const k=h.useCallback(g=>{g!==void 0&&(b(g),y(g))},[y,b]),u=(g,_)=>{a.current=g,g.onDidBlurEditorText(()=>{y.flush()}),g.addAction({id:"generate-config",label:"Generate",keybindings:[_.KeyMod.CtrlCmd|_.KeyCode.Enter],run:()=>{const L=g.getValue();y.cancel(),b(L),l(L),x(L,f,{pointsonly:!1})}})};return r?e.jsx("div",{className:o,"data-testid":s,"aria-label":i,children:e.jsx(_n,{height:"100%",defaultLanguage:"yaml",language:"yaml",onChange:k,onMount:u,defaultValue:p,theme:"ergogen-theme",options:t||void 0},m||"preview")}):null},ai=({className:o,options:t,injection:s,setInjection:i,"data-testid":r,"aria-label":a})=>{const c=we(),p=async b=>{if(!b)return null;const l={...s,content:b};i(l)};return c?e.jsx(li,{className:o,"data-testid":r,"aria-label":a,children:e.jsx(_n,{height:"100%",defaultLanguage:"javascript",language:"javascript",onChange:p,value:s.content,theme:"ergogen-theme",options:t||void 0})}):null},li=d.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: 0.5rem;
`,ci=wt`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,di=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;

  @media (max-width: 639px) {
    padding-bottom: 0.75rem;
  }
`,ui=d.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${n.fontSizes.bodySmall};
  cursor: ${o=>o.$hasPreview?"pointer":"default"};
  border-bottom: ${o=>o.$active?`2px solid ${n.colors.accent}`:"2px solid transparent"};
  border-top: 2px solid transparent;
  opacity: ${o=>o.$disabled?.5:1};
  color: ${o=>o.$disabled?n.colors.textDarker:n.colors.white};
`,pi=d.div`
  white-space: nowrap;
  display: flex;
  gap: 10px;
  align-items: center;
`,fi=d.a`
  background-color: ${n.colors.background};
  border: none;
  border-radius: 6px;
  color: ${n.colors.white};
  display: flex;
  align-items: center;
  padding: 4px 6px;
  text-decoration: none;
  cursor: pointer;
  font-size: ${n.fontSizes.bodySmall};
  line-height: 16px;
  height: 28px;

  .material-symbols-outlined {
    font-size: ${n.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${n.colors.buttonHover};
  }
`,hi=d.a`
  background-color: ${n.colors.background};
  border: none;
  border-radius: 6px;
  color: ${n.colors.white};
  display: flex;
  align-items: center;
  padding: 4px 6px;
  text-decoration: none;
  cursor: not-allowed;
  font-size: ${n.fontSizes.bodySmall};
  line-height: 16px;
  height: 28px;
  opacity: 0.5;

  .material-symbols-outlined {
    font-size: ${n.fontSizes.iconMedium} !important;
    animation: ${ci} 1s linear infinite;
  }
`,gi=({fileName:o,extension:t,content:s,preview:i,setPreview:r,previewKey:a,"data-testid":c})=>{const p=t==="stl"&&!s||t==="kicad_pcb"&&!i,b=t==="stl"&&!s,l=()=>{if(b)return;V("download_button_clicked",{download_type:t,file_name:o});const m=document.createElement("a"),y=new Blob([s],{type:"octet/stream"});m.href=URL.createObjectURL(y),m.download=`${o}.${t}`,document.body.appendChild(m),m.click()},f=()=>{i&&!p&&r(i)},x=c?`${c}-${t}`:void 0;return e.jsxs(di,{"data-testid":x,children:[e.jsxs(ui,{$active:a===(i==null?void 0:i.key),$hasPreview:!!i,$disabled:p,onClick:f,"data-testid":x&&`${x}-preview`,children:[o,".",t]}),e.jsx(pi,{children:b?e.jsx(hi,{"aria-label":`Generating ${o}.${t}`,"data-testid":x&&`${x}-loading`,children:e.jsx("span",{className:"material-symbols-outlined",children:"progress_activity"})}):e.jsx(fi,{onClick:l,"aria-label":`Download ${o}.${t}`,"data-testid":x&&`${x}-download`,children:e.jsx("span",{className:"material-symbols-outlined",children:"download"})})})]})},mi=d.h3`
  font-size: ${n.fontSizes.base};
  font-weight: ${n.fontWeights.semiBold};
  color: ${n.colors.white};
  margin: 0 0 1rem;

  @media (max-width: 639px) {
    display: none;
  }
`,bi=d.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;

  @media (max-width: 639px) {
    padding: 0.5rem;
  }
`,xi=d.div`
  font-size: ${n.fontSizes.sm};
  color: ${n.colors.textDarkest};
  font-style: italic;
  padding: 0.5rem 0;
`,wi=({setPreview:o,previewKey:t,"data-testid":s})=>{var b,l;const i=[],r=we();if(!r)return null;const{configInput:a,results:c}=r;if(c!=null&&c.demo&&i.push({fileName:"raw",extension:"txt",content:a??"",previewKey:"raw",preview:{key:"raw",extension:"txt",content:a??""}},{fileName:"canonical",extension:"yaml",content:pe.dump(c.canonical),previewKey:"canonical",preview:{key:"canonical",extension:"yaml",content:pe.dump(c.canonical)}},{fileName:"demo",extension:"dxf",content:((b=c.demo)==null?void 0:b.dxf)??"",previewKey:"demo.svg",preview:{key:"demo.svg",extension:"svg",content:((l=c.demo)==null?void 0:l.svg)??""}},{fileName:"points",extension:"yaml",content:pe.dump(c.points),previewKey:"points",preview:{key:"points",extension:"yaml",content:pe.dump(c.points)}},{fileName:"units",extension:"yaml",content:pe.dump(c.units),previewKey:"units",preview:{key:"units",extension:"yaml",content:pe.dump(c.units)}}),c!=null&&c.outlines)for(const[f,x]of Object.entries(c.outlines))i.push({fileName:f,extension:"dxf",content:x.dxf??"",previewKey:`outlines.${f}.svg`,preview:{key:`outlines.${f}.svg`,extension:"svg",content:x.svg??""}});if(c!=null&&c.cases){for(const[f,x]of Object.entries(c.cases))if(i.push({fileName:f,extension:"jscad",content:x.jscad??"",previewKey:`cases.${f}`,preview:{key:`cases.${f}`,extension:"jscad",content:x.jscad??""}}),r.stlPreview&&x.jscad){const m=!!x.stl;i.push({fileName:f,extension:"stl",content:x.stl??"",previewKey:m?`cases.${f}.stl`:"",preview:m?{key:`cases.${f}.stl`,extension:"stl",content:x.stl??""}:void 0})}}if(c!=null&&c.pcbs)for(const[f,x]of Object.entries(c.pcbs)){const y=String(x).match(/version "?([0-9]+)"?/),k=y&&y.length>1?Number(y[1]):-1;i.push({fileName:f,extension:"kicad_pcb",content:x,previewKey:r.kicanvasPreview&&k>20240101?`pcbs.${f}`:"",preview:r.kicanvasPreview&&k>20240101?{key:`pcbs.${f}`,extension:"kicad_pcb",content:x}:void 0})}const p=i.filter(f=>!(!r.debug&&(f.fileName.startsWith("_")||{units:"yaml",points:"yaml",canonical:"yaml",raw:"txt"}[f.fileName]===f.extension||r.stlPreview&&f.extension==="jscad")));return e.jsxs(bi,{"data-testid":s,children:[e.jsx(mi,{children:"Outputs"}),p.length>0?p.map((f,x)=>e.jsx(gi,{...f,setPreview:o,previewKey:t,"data-testid":s&&`${s}-${f.fileName}`},x)):e.jsx(xi,{children:"No outputs"})]})},yi=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
`,ki=d.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${n.fontSizes.bodySmall};
  cursor: pointer;
  border-bottom: ${o=>o.$active?`2px solid ${n.colors.accent}`:"2px solid transparent"};
  border-top: 2px solid transparent;
`,vi=d.div`
  white-space: nowrap;
  display: flex;
  gap: 6px;
  align-items: center;
`,On=jn`
  background-color: ${n.colors.background};
  border: none;
  border-radius: 6px;
  color: ${n.colors.white};
  display: flex;
  align-items: center;
  padding: 4px 6px;
  text-decoration: none;
  cursor: pointer;
  font-size: ${n.fontSizes.bodySmall};
  line-height: 16px;
  gap: 6px;

  .material-symbols-outlined {
    font-size: ${n.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${n.colors.buttonHover};
  }
`,Go=d.a`
  ${On}
`,_i=d.a`
  ${On}

  @media (min-width: 640px) {
    display: none;
  }
`,At=({injection:o,setInjectionToEdit:t,deleteInjection:s,previewKey:i,"data-testid":r})=>e.jsxs(yi,{"data-testid":r,children:[e.jsx(ki,{"data-testid":r&&`${r}-name`,$active:i===o.name,onClick:()=>t(o),children:o.name}),e.jsxs(vi,{children:[e.jsx(_i,{href:"#",onClick:a=>{a.preventDefault(),t(o)},"aria-label":`edit injection ${o.name}`,"data-testid":r&&`${r}-edit`,children:e.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),e.jsx(Go,{href:"#",onClick:a=>{a.preventDefault(),s(o)},"aria-label":`delete injection ${o.name}`,"data-testid":r&&`${r}-delete`,children:e.jsx("span",{className:"material-symbols-outlined",children:"delete"})}),e.jsx(Go,{target:"_blank",rel:"noopener noreferrer",download:`${o.name.split("/").reverse()[0]}.js`,href:window.URL.createObjectURL(new Blob([o.content],{type:"octet/stream"})),"aria-label":`download injection ${o.name}`,"data-testid":r&&`${r}-download`,children:e.jsx("span",{className:"material-symbols-outlined",children:"download"})})]})]}),He=d.button`
  background-color: ${n.colors.accentSecondary};
  transition: background-color 0.15s ease-in-out;
  border: none;
  border-radius: 6px;
  color: ${n.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  height: 34px;
  font-family: ${n.fonts.body};
  flex-grow: 1;

  .material-symbols-outlined {
    font-size: ${n.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${n.colors.accentDark};
  }
`,mt=d.h3`
  font-size: ${n.fontSizes.base};
  font-weight: ${n.fontWeights.semiBold};
  color: ${n.colors.white};
  margin: 1.5rem 0.5rem 1rem 0.5rem;
`,Ho=o=>{const i=new DOMParser().parseFromString(o,"image/svg+xml").querySelectorAll("path"),r=[];return i.forEach(a=>{const c=a.getAttribute("d");if(c&&c.trim()){const p=c.replace(/\\/g,"\\\\").replace(/"/g,'\\"');r.push(`        "${p}"`)}}),`const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
${r.join(`,
`)}
    ];
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
};`},Rt=d.div`
  display: flex;
  margin-left: 0.5rem;
  margin-left: 0.5rem;
  gap: 8px;
  margin-top: 0.5rem;
`,ze=d(He)`
  flex-grow: 0;
  width: 34px;
  padding: 0;
`,ji=d.div`
  display: flex;
  margin-left: 0.5rem;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.5rem;
`,$i=d.div`
  display: flex;
  margin-left: 0.5rem;
  border-bottom: 1px solid ${n.colors.border};
  margin-left: 0.5rem;
  gap: 16px;
`,Nt=d.button`
  background: none;
  border: none;
  color: ${o=>o.$active?n.colors.text:n.colors.textDark};
  padding: 0.75rem 0;
  cursor: pointer;
  font-size: ${n.fontSizes.bodySmall};
  font-weight: ${n.fontWeights.semiBold};
  border-bottom: 2px solid
    ${o=>o.$active?n.colors.accent:"transparent"};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${n.colors.text};
  }
`,Ci=({setInjectionToEdit:o,deleteInjection:t,injectionToEdit:s,onInjectionSelect:i,"data-testid":r})=>{const a=[],c=[],p=[],b=h.useRef(null),l=h.useRef(null),f=we(),[x,m]=h.useState("footprint"),[y,k]=h.useState("footprints"),{currentConflict:u,processInjectionsWithConflictResolution:g,handleConflictResolution:_,handleConflictCancel:L}=jt({setInjectionInput:v=>f==null?void 0:f.setInjectionInput(v),setConfigInput:v=>f==null?void 0:f.setConfigInput(v),generateNow:async(v,C,A)=>{await(f==null?void 0:f.generateNow(v,C,A))},getCurrentInjections:()=>(f==null?void 0:f.injectionInput)||[],setError:v=>f==null?void 0:f.setError(v)});if(!f)return null;const{injectionInput:P}=f;if(P&&Array.isArray(P)&&P.length>0)for(let v=0;v<P.length;v++){const C=P[v];if(C.length===3){let A=p;C[0]==="footprint"?A=a:C[0]==="outline"?A=c:C[0]==="template"&&(A=p),A.push({key:v,type:C[0],name:C[1],content:C[2]})}}const E=()=>{var A;const v=((A=f==null?void 0:f.injectionInput)==null?void 0:A.length)||0,C={key:v,type:"footprint",name:`custom_footprint_${v+1}`,content:`module.exports = {
  params: {
    designator: '',
  },
  body: p => \`\`
}`};V("injection_created",{injection_type:"footprint"}),o(C),i&&i()},j=()=>{var A;const v=((A=f==null?void 0:f.injectionInput)==null?void 0:A.length)||0,C={key:v,type:"outline",name:`custom_outline_${v+1}`,content:`const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
        ""  // Add your SVG path(s) here
    ];
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
};`};V("injection_created",{injection_type:"outline"}),o(C),i&&i()},S=()=>{var A;const v=((A=f==null?void 0:f.injectionInput)==null?void 0:A.length)||0,C={key:v,type:"template",name:`custom_template_${v+1}`,content:`const m = require('makerjs')
const version = require('../../package.json').version

module.exports = {
    convert_outline: (model, layer) => {
        return \`\`;  // Return your converted outlines
    },
    body: params => {
        return \`\`;  // Add your template text here
    }
}`};V("injection_created",{injection_type:"template"}),o(C),i&&i()},$=async v=>{const C=v.target.files;if(!C||C.length===0)return;const A=[];for(let M=0;M<C.length;M++){const T=C[M];if(T.name.endsWith(".js")){const W=await T.text(),G=T.name.replace(/\.js$/,"");A.push([x,G,W])}else if(x==="outline"&&T.name.endsWith(".svg")){const W=await T.text(),G=Ho(W),Y=T.name.replace(/\.svg$/,"");A.push([x,Y,G])}}A.length>0&&(V("injection_uploaded",{injection_type:x,source:"file",file_count:A.length}),await g(A,f.configInput||"")),v.target.value=""},I=async v=>{const C=v.target.files;if(!C||C.length===0)return;const A=[];for(let M=0;M<C.length;M++){const T=C[M];if(T.name.endsWith(".js")){const W=await T.text(),G=T.webkitRelativePath.split("/");G.shift();const Y=G.join("/").replace(/\.js$/,"");A.push([x,Y,W])}else if(x==="outline"&&T.name.endsWith(".svg")){const W=await T.text(),G=T.webkitRelativePath.split("/");G.shift();const Y=G.join("/").replace(/\.svg$/,""),q=Ho(W);A.push([x,Y,q])}}A.length>0&&(V("injection_uploaded",{injection_type:x,source:"folder",file_count:A.length}),await g(A,f.configInput||"")),v.target.value=""};return e.jsxs(ji,{"data-testid":r,children:[u&&e.jsx(_t,{injectionName:u.name,injectionType:u.type,onResolve:_,onCancel:L,"data-testid":"conflict-resolution-dialog"}),e.jsx(mt,{children:"Custom Libraries"}),e.jsxs($i,{children:[e.jsx(Nt,{$active:y==="footprints",onClick:()=>{k("footprints"),m("footprint")},"data-testid":"tab-footprints",children:"Footprints"}),se("outlines")&&e.jsx(Nt,{$active:y==="outlines",onClick:()=>{k("outlines"),m("outline")},"data-testid":"tab-outlines",children:"Outlines"}),se("templates")&&e.jsx(Nt,{$active:y==="templates",onClick:()=>{k("templates"),m("template")},"data-testid":"tab-templates",children:"Templates"})]}),y==="footprints"&&e.jsxs(e.Fragment,{children:[a.map(v=>e.jsx(At,{injection:v,setInjectionToEdit:C=>{V("injection_editor_opened",{injection_type:C.type}),o(C),i&&i()},deleteInjection:t,previewKey:s.name,"data-testid":r&&`${r}-${v.name}`},v.key)),e.jsxs(Rt,{children:[e.jsx(He,{onClick:E,"data-testid":"add-footprint","aria-label":"Add new custom footprint",title:"Add footprint",children:e.jsx("span",{className:"material-symbols-outlined",children:"add"})}),e.jsx(ze,{onClick:()=>{m("footprint"),setTimeout(()=>{var v;return(v=b.current)==null?void 0:v.click()},0)},"data-testid":"load-footprint-files","aria-label":"Load custom footprint files",title:"Load footprint files",children:e.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),e.jsx(ze,{onClick:()=>{m("footprint"),setTimeout(()=>{var v;return(v=l.current)==null?void 0:v.click()},0)},"data-testid":"load-footprint-folder","aria-label":"Load custom footprint folder",title:"Load footprint folder",children:e.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),y==="outlines"&&se("outlines")&&e.jsxs(e.Fragment,{children:[c.map(v=>e.jsx(At,{injection:v,setInjectionToEdit:C=>{V("injection_editor_opened",{injection_type:C.type}),o(C),i&&i()},deleteInjection:t,previewKey:s.name,"data-testid":r&&`${r}-${v.name}`},v.key)),e.jsxs(Rt,{children:[e.jsx(He,{onClick:j,"data-testid":"add-outline","aria-label":"Add new custom outline",title:"Add outline",children:e.jsx("span",{className:"material-symbols-outlined",children:"add"})}),e.jsx(ze,{onClick:()=>{m("outline"),setTimeout(()=>{var v;return(v=b.current)==null?void 0:v.click()},0)},"data-testid":"load-outline-files","aria-label":"Load custom outline files",title:"Load outline files",children:e.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),e.jsx(ze,{onClick:()=>{m("outline"),setTimeout(()=>{var v;return(v=l.current)==null?void 0:v.click()},0)},"data-testid":"load-outline-folder","aria-label":"Load custom outline folder",title:"Load outline folder",children:e.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),y==="templates"&&se("templates")&&e.jsxs(e.Fragment,{children:[p.map(v=>e.jsx(At,{injection:v,setInjectionToEdit:C=>{V("injection_editor_opened",{injection_type:C.type}),o(C),i&&i()},deleteInjection:t,previewKey:s.name,"data-testid":r&&`${r}-${v.name}`},v.key)),e.jsxs(Rt,{children:[e.jsx(He,{onClick:S,"data-testid":"add-template","aria-label":"Add new custom template",title:"Add template",children:e.jsx("span",{className:"material-symbols-outlined",children:"add"})}),e.jsx(ze,{onClick:()=>{m("template"),setTimeout(()=>{var v;return(v=b.current)==null?void 0:v.click()},0)},"data-testid":"load-template-files","aria-label":"Load custom template files",title:"Load template files",children:e.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),e.jsx(ze,{onClick:()=>{m("template"),setTimeout(()=>{var v;return(v=l.current)==null?void 0:v.click()},0)},"data-testid":"load-template-folder","aria-label":"Load custom template folder",title:"Load template folder",children:e.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),e.jsx("input",{type:"file",ref:b,onChange:$,accept:x==="outline"?".js,.svg":".js",multiple:!0,style:{display:"none"}}),e.jsx("input",{type:"file",ref:l,onChange:I,accept:x==="outline"?".js,.svg":".js",style:{display:"none"},webkitdirectory:"",directory:""})]})},Si=d.img`
  filter: invert();
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
`,Pi=d(or.PanZoom)`
  overflow: hidden;
  height: 100%;

  &:focus-visible {
    outline: none;
  }
`,Ei=({svg:o,width:t,height:s,"aria-label":i,"data-testid":r})=>e.jsx(Pi,{enableBoundingBox:!0,minZoom:.8,maxZoom:5,"aria-label":i,"data-testid":r,children:e.jsx(Si,{width:t||"100%",height:s||"100%",src:`data:image/svg+xml;utf8,${encodeURIComponent(o)}`,alt:"Ergogen SVG Output preview",draggable:"false"})}),Wt=({content:o,language:t,className:s,height:i,options:r,"aria-label":a,"data-testid":c})=>e.jsx("div",{className:s,"aria-label":a,"data-testid":c,children:e.jsx(nr,{height:i||"80vh",language:t,value:o,theme:"ergogen-theme",options:r||{readOnly:!0}})}),Ii=h.lazy(()=>En(()=>import("./PcbPreview-DsKQssW6.js"),__vite__mapDeps([0,1]))),zi=h.lazy(()=>En(()=>import("./StlPreview-BUXAkDNv.js"),__vite__mapDeps([2,1,3,4,5]))),Fn=d.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: ${n.colors.background};
`,Bn=d.img`
  width: 96px;
  height: 96px;
  opacity: 0.12;
  filter: grayscale(100%);
  -webkit-user-drag: none;
  user-drag: none;
`,Li=d.span`
  color: ${n.colors.textDarkest};
  font-size: ${n.fontSizes.sm};
  margin-top: 1rem;
  font-family: ${n.fonts.body};
  user-select: none;
`,Vo=()=>e.jsxs(Fn,{children:[e.jsx(Bn,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"}),e.jsx(Li,{children:"Loading preview..."})]}),Di=({previewExtension:o,previewContent:t,previewKey:s,width:i="100%",height:r="100%",className:a,"data-testid":c,"aria-label":p})=>{if(!t||typeof t=="string"&&t===""||t instanceof ArrayBuffer&&t.byteLength===0||ArrayBuffer.isView(t)&&t.byteLength===0)return e.jsx(Fn,{className:a,"data-testid":c,"aria-label":p,children:e.jsx(Bn,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"})});const l=f=>{switch(f){case"svg":return e.jsx(Ei,{svg:t,width:i,height:r,"aria-label":p||`SVG preview for ${s}`,"data-testid":c&&`${c}-svg`});case"yaml":return e.jsx(Wt,{language:"yaml",content:t,"aria-label":p||`YAML preview for ${s}`,"data-testid":c&&`${c}-yaml`});case"txt":return e.jsx(Wt,{language:"text",content:t,"aria-label":p||`Text preview for ${s}`,"data-testid":c&&`${c}-txt`});case"jscad":return e.jsx(Wt,{language:"javascript",content:t,"aria-label":p||`JSCAD code preview for ${s}`,"data-testid":c&&`${c}-jscad-text`});case"kicad_pcb":return e.jsx(h.Suspense,{fallback:e.jsx(Vo,{}),children:e.jsx(Ii,{pcb:t,previewKey:s,"aria-label":p||`PCB preview for ${s}`,"data-testid":c&&`${c}-pcb`},s)});case"stl":return e.jsx(h.Suspense,{fallback:e.jsx(Vo,{}),children:e.jsx(zi,{stl:t,"aria-label":p||`STL preview for ${s}`,"data-testid":c&&`${c}-stl`})});default:return"No preview available"}};return e.jsx("div",{className:a,"data-testid":c,"aria-label":p,children:l(o)})},Ut=({children:o,initialWidth:t=300,minWidth:s=10,maxWidth:i="100%",side:r="left",style:a,"data-testid":c})=>{const[p,b]=h.useState(t),l=h.useRef(!1),f=h.useRef(0),x=h.useRef(t),m=h.useRef(null),y=u=>{if(typeof u=="string"&&u.includes("%")){const g=parseFloat(u)/100;return window.innerWidth*g}else return typeof u=="string"&&u.includes("px")?parseFloat(u):typeof u=="number"?u:1/0};h.useEffect(()=>{const u=P=>{if(!l.current)return;const E=r==="left"?P.clientX-f.current:f.current-P.clientX,j=x.current+E,S=y(i),$=Math.max(s,Math.min(j,S));b($)},g=()=>{l.current&&(l.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},_=P=>{if(!l.current)return;P.preventDefault();const E=P.touches[0],j=r==="left"?E.clientX-f.current:f.current-E.clientX,S=x.current+j,$=y(i),I=Math.max(s,Math.min(S,$));b(I)},L=()=>{l.current&&(l.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",u),window.addEventListener("mouseup",g),window.addEventListener("touchmove",_,{passive:!1}),window.addEventListener("touchend",L),()=>{window.removeEventListener("mousemove",u),window.removeEventListener("mouseup",g),window.removeEventListener("touchmove",_),window.removeEventListener("touchend",L)}},[s,i,r]);const k=u=>{u.preventDefault(),u.stopPropagation(),l.current=!0,x.current=p,"touches"in u?f.current=u.touches[0].clientX:f.current=u.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};return e.jsxs(Ai,{ref:m,$side:r,style:{width:`${p}px`,...a},"data-testid":c,children:[o,e.jsx(Ri,{$side:r,onMouseDown:k,onTouchStart:k,"data-testid":c&&`${c}-resize-handle`})]})},Ai=d.div`
  position: relative;
  flex-shrink: 0;
  flex-grow: 0;
  height: 100%;
  overflow: visible;
  border-right: ${o=>o.$side==="left"?`1px solid ${n.colors.border}`:"none"};
  border-left: ${o=>o.$side==="right"?`1px solid ${n.colors.border}`:"none"};

  @media (max-width: 639px) {
    width: 100% !important;
    border-right: none;
    border-left: none;
  }
`,Ri=d.div`
  position: absolute;
  top: 0;
  ${o=>o.$side==="left"?"right: -4px;":"left: -4px;"}
  width: 8px;
  height: 100%;
  cursor: col-resize;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  transition:
    height 0.2s cubic-bezier(0.2, 1.7, 0.3, 1) var(--transition-delay),
    background-color 0.2s ease var(--transition-delay);
  --active-color: ${n.colors.accent};
  --transition-delay: 0s;

  &:hover {
    --transition-delay: 0.05s;
  }

  &:hover::before,
  &:hover::after {
    background-color: var(--active-color);
  }

  &:hover::after {
    height: 64px;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 3px;
    height: 48px;
    background-color: color-mix(in srgb, #e6e1ff 10%, transparent);
    transition:
      height 0.2s cubic-bezier(0.2, 1.7, 0.3, 1) var(--transition-delay),
      background-color 0.2s ease var(--transition-delay);
    pointer-events: none;
    box-shadow:
      0 -8px 0 0 ${n.colors.backgroundLight},
      0 8px 0 0 ${n.colors.backgroundLight};
    opacity: 1;
    border-radius: 99px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    width: 1px;
    height: 100%;
    background-color: transparent;
    transform: translateX(-50%);
    transition: background-color 0.2s ease var(--transition-delay);
    pointer-events: none;
  }

  @media (max-width: 639px) {
    display: none;
  }
`,Zt=(o,t)=>{if(t===null)return null;if(o==="")return t;if(typeof t!="object")return;const s=o.split("."),i=s[0],r=s.slice(1).join(".");return Object.prototype.hasOwnProperty.call(t,i)?Zt(r,t[i]):void 0};function Mn(){if(typeof navigator<"u"){if("userAgentData"in navigator&&navigator.userAgentData){const o=navigator.userAgentData;if(o.platform&&/mac/i.test(o.platform))return!0}if(/Mac|iPhone|iPad|iPod/i.test(navigator.userAgent))return!0}return!1}const Ni=d.input.attrs(o=>({type:"text",$size:o.$size||"0.5em"}))`
  font-size: ${n.fontSizes.base};
  background-color: ${n.colors.backgroundLighter};
  border: 1px solid ${n.colors.border};
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: ${n.colors.text};
  font-family: ${n.fonts.body};
  outline: none;
  transition: border-color 0.15s ease-in-out;
  /* here we use the dynamically computed prop */
  margin: ${o=>o.$size};

  &:focus {
    border-color: ${n.colors.accent};
  }

  &::selection {
    background-color: ${n.colors.accent};
    color: ${n.colors.white};
  }
`,Wi=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`,Ui=d.label`
  display: flex;
  flex-direction: column;
  flex: 1;
  cursor: pointer;
  user-select: none;
  text-align: left;
`,Oi=d.span`
  color: ${n.colors.text};
  font-size: ${n.fontSizes.base};
  font-weight: ${n.fontWeights.semiBold};
`,Fi=d.span`
  color: ${n.colors.textDarker};
  font-size: ${n.fontSizes.sm};
  margin-top: 0.25rem;
  line-height: 1.4;
`,Bi=d.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`,Mi=d.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: pointer;
`,Ti=d.input`
  opacity: 0;
  width: 0;
  height: 0;
`,Gi=d.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${o=>o.$checked?n.colors.accent:n.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`,Hi=d.span`
  position: absolute;
  top: 2px;
  left: ${o=>o.$checked?"18px":"2px"};
  width: 16px;
  height: 16px;
  background-color: ${n.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,Le=({optionId:o,label:t,description:s,setSelected:i,checked:r,"aria-label":a})=>e.jsxs(Wi,{children:[e.jsxs(Ui,{htmlFor:o,children:[e.jsx(Oi,{children:t}),s&&e.jsx(Fi,{children:s})]}),e.jsx(Bi,{children:e.jsxs(Mi,{$checked:r,htmlFor:o,children:[e.jsx(Ti,{type:"checkbox",id:o,checked:r,onChange:c=>i(c.target.checked),"data-testid":`option-${o}`,"aria-label":a}),e.jsx(Gi,{$checked:r}),e.jsx(Hi,{$checked:r})]})})]}),Ae=d.button`
  background-color: transparent;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  border: 1px solid ${n.colors.border};
  border-radius: 6px;
  color: ${n.colors.white};
  display: flex;
  align-items: center;
  padding: 8px 12px;
  text-decoration: none;
  cursor: pointer;
  font-size: ${n.fontSizes.bodySmall};
  line-height: 16px;
  gap: 6px;
  height: 34px;
  font-family: ${n.fonts.body};

  .material-symbols-outlined {
    font-size: ${n.fontSizes.iconMedium} !important;
  }

  &:hover,
  &.active {
    background-color: ${n.colors.buttonHover};
  }
`,lt=d.h4`
  font-size: ${n.fontSizes.sm};
  font-weight: ${n.fontWeights.semiBold};
  color: ${n.colors.textDarker};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 1.5rem 0.5rem 0.5rem 0.5rem;

  &:first-of-type {
    margin-top: 0.5rem;
  }
`,ct=d.div`
  background-color: ${n.colors.backgroundLight};
  border: 1px solid ${n.colors.border};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 1rem;
  width: 100%;

  & > div {
    border-bottom: 1px solid ${n.colors.border};
    &:last-child {
      border-bottom: none;
    }
  }
`,Vi=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`,Ji=d.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  user-select: none;
  text-align: left;
`,qi=d.span`
  color: ${n.colors.text};
  font-size: ${n.fontSizes.base};
  font-weight: ${n.fontWeights.semiBold};
`,Qt=d.span`
  color: ${n.colors.textDarker};
  font-size: ${n.fontSizes.sm};
  margin-top: 0.25rem;
  line-height: 1.4;
`,Ki=d(Qt)`
  color: ${n.colors.warningDark};
`,Xi=d.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`,Yi=({isAvailable:o,isInstalled:t,isInstalling:s,onInstall:i})=>{let r,a;return t?(r=e.jsx(Qt,{children:"The application is installed and available offline."}),a=e.jsx(de,{size:"sm",disabled:!0,"data-testid":"pwa-installed-button",children:"Installed"})):o?(r=e.jsx(Qt,{children:"Install the app locally to access it offline without network connectivity."}),s?a=e.jsx(de,{size:"sm",disabled:!0,"data-testid":"pwa-installing-button",children:"Installing..."}):a=e.jsx(de,{size:"sm",onClick:i,"data-testid":"pwa-install-button",children:"Install App"})):(r=e.jsx(Ki,{children:"PWA installation is not supported by your browser or environment."}),a=e.jsx(de,{size:"sm",disabled:!0,"data-testid":"pwa-unavailable-button",children:"Unavailable"})),e.jsxs(Vi,{children:[e.jsxs(Ji,{children:[e.jsx(qi,{children:"Offline App"}),r]}),e.jsx(Xi,{children:a})]})},Zi=(o,t,s,i)=>{const r={config:o,...t&&t.length>0?{injections:t}:{},guiVersion:yt.version,ergogenVersion:io("github:ceoloide/ergogen#v4.3.0")},a=JSON.stringify(r);return $n.compressToEncodedURIComponent(a)},Qi=()=>new URLSearchParams(window.location.search).get("debug")!==null,es=o=>{var s;const t=Qi();try{const i=$n.decompressFromEncodedURIComponent(o);if(!i)return console.error("[Share] DECODE_ERROR: Failed to decompress encoded string"),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The encoded data could not be decompressed."};let r;try{r=JSON.parse(i)}catch(c){return console.error("[Share] DECODE_ERROR: Failed to parse decompressed JSON",{parseError:c,decompressedLength:i.length,decompressedPreview:i.substring(0,100)}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The decompressed data is not valid JSON."}}if(!r||typeof r!="object"||!("config"in r)||typeof r.config!="string")return console.error("[Share] VALIDATION_ERROR: Invalid object structure",{parsed:r,hasConfig:r&&typeof r=="object"&&"config"in r,configType:r&&typeof r=="object"&&"config"in r?typeof r.config:"N/A"}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link does not contain a valid configuration. The decoded data is missing required fields or has an invalid structure."};const a=r;return(!a.guiVersion||typeof a.guiVersion!="string")&&(a.guiVersion="0.9.0"),(!a.ergogenVersion||typeof a.ergogenVersion!="string")&&(a.ergogenVersion="github:ergogen/ergogen#v4.2.1"),"injections"in a&&a.injections!==void 0&&(!Array.isArray(a.injections)||!a.injections.every(c=>Array.isArray(c)&&c.length===3&&typeof c[0]=="string"&&typeof c[1]=="string"&&typeof c[2]=="string"))?(console.error("[Share] VALIDATION_ERROR: Invalid injections structure",{injections:a.injections,isArray:Array.isArray(a.injections)}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link contains invalid injections data. Injections must be an array of [type, name, content] tuples."}):(t&&console.log("[Share] DEBUG: Decoded configuration object",{configLength:a.config.length,hasInjections:a.injections!==void 0,injectionsCount:((s=a.injections)==null?void 0:s.length)??0,fullObject:a}),{success:!0,config:a})}catch(i){return console.error("[Share] DECODE_ERROR: Unexpected error during decoding",{error:i,errorMessage:i instanceof Error?i.message:String(i),errorStack:i instanceof Error?i.stack:void 0}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. An unexpected error occurred while decoding."}}},ts=o=>{const{config:t,injections:s,canonical:i}=o;let r=s;if(i&&s&&s.length>0){const b=Gn(i);r=os(s,b)}const a=r&&r.length>0?r:void 0,c=Zi(t,a);return`${window.location.origin+window.location.pathname}#${c}`},Tn=()=>{const o=window.location.hash;if(!o||o.length<=1)return null;const t=o.substring(1);return es(t)},Gn=o=>{const t=new Set,s=new Set,i=new Set;if(!o||typeof o!="object")return{footprints:t,templates:s,outlines:i};const r=o;if(r.pcbs&&typeof r.pcbs=="object"){for(const a of Object.values(r.pcbs))if(!(!a||typeof a!="object")&&(typeof a.template=="string"&&s.add(a.template),a.footprints&&typeof a.footprints=="object"))for(const c of Object.values(a.footprints))c&&typeof c.what=="string"&&t.add(c.what)}if(r.outlines&&typeof r.outlines=="object")for(const a of Object.values(r.outlines)){if(!a||typeof a!="object")continue;const c=Array.isArray(a)?a:Object.values(a);for(const p of c){const b=p;b&&typeof b.what=="string"&&i.add(b.what)}}return{footprints:t,templates:s,outlines:i}},os=(o,t)=>!o||o.length===0?[]:o.filter(s=>{const[i,r]=s;return i==="footprint"?t.footprints.has(r):i==="template"?t.templates.has(r):i==="outline"?t.outlines.has(r):!0}),Jo=async(o,t,s)=>{try{await navigator.clipboard.writeText(o),t(!0),s.current&&clearTimeout(s.current),s.current=setTimeout(()=>{t(!1)},2500)}catch(i){console.error("Failed to copy shareable URI to clipboard:",i);try{const r=document.createElement("textarea");r.value=o,r.style.position="fixed",r.style.opacity="0",document.body.appendChild(r),r.select(),document.execCommand("copy"),document.body.removeChild(r),t(!0),s.current&&clearTimeout(s.current),s.current=setTimeout(()=>{t(!1)},2500)}catch(r){console.error("Fallback copy method also failed:",r)}}},Hn=({config:o,injections:t,onClose:s,"data-testid":i})=>{const r=Cn.useMemo(()=>t||[],[t]),[a,c]=h.useState(1),[p,b]=h.useState(!0),[l,f]=h.useState(!1),[x,m]=h.useState(null),[y,k]=h.useState(""),[u,g]=h.useState([]),[_,L]=h.useState(!1),[P,E]=h.useState(!1),j=h.useRef(null),S=h.useRef(null);h.useEffect(()=>{if(!p||_||r.length===0||a!==1)return;let C=!0;f(!0),m(null);const A=Je();if(!A){m("Could not initialize background worker."),f(!1);return}return A.onmessage=M=>{var W;if(!C)return;const T=M.data;if(T.type==="success"){const G=(W=T.results)==null?void 0:W.canonical,{footprints:Y,templates:q,outlines:ae}=Gn(G),ue=r.map(([ee,R,F])=>{let w;return ee==="footprint"?w=Y.has(R):ee==="template"?w=q.has(R):ee==="outline"?w=ae.has(R):w=!0,{type:ee,name:R,content:F,checked:w,isEligible:w}}).filter(ee=>ee.isEligible).map(({type:ee,name:R,content:F,checked:w})=>({type:ee,name:R,content:F,checked:w}));g(ue),L(!0)}else T.type==="error"&&m(T.error||"Failed to analyze configuration.");f(!1),A.terminate()},A.onerror=()=>{C&&(m("Worker encountered an error during analysis."),f(!1),A.terminate())},A.postMessage({type:"generate",inputConfig:o,injectionInput:r,requestId:`share-analysis-${Date.now()}`,options:{debug:!0}}),()=>{C=!1,A.terminate()}},[p,_,r,o,a]),h.useEffect(()=>{a===2&&y&&Jo(y,E,S)},[y,a]),h.useEffect(()=>{const C=A=>{A.key==="Escape"&&s()};return window.addEventListener("keydown",C),()=>{window.removeEventListener("keydown",C)}},[s]),h.useEffect(()=>{a===2&&j.current&&(j.current.focus(),j.current.select())},[a]),h.useEffect(()=>{const C=S;return()=>{C.current&&clearTimeout(C.current)}},[]);const $=C=>{g(A=>A.map((M,T)=>T===C?{...M,checked:!M.checked}:M))},I=()=>{const C=p?u.filter(T=>T.checked):[],A=C.length>0?C.map(T=>[T.type,T.name,T.content]):void 0,M=ts({config:o,injections:A});k(M),c(2)},v=()=>{Jo(y,E,S)};return e.jsx(ns,{"data-testid":i,onClick:C=>{C.target===C.currentTarget&&s()},children:e.jsxs(rs,{"data-testid":i&&`${i}-box`,onClick:C=>C.stopPropagation(),children:[e.jsx(is,{onClick:s,"data-testid":i&&`${i}-close`,"aria-label":"Close dialog",children:e.jsx("span",{className:"material-symbols-outlined",children:"close"})}),a===1?e.jsxs(e.Fragment,{children:[e.jsx(qo,{children:"Share Configuration"}),e.jsx(Ko,{children:"Configure what content should be included when sharing your keyboard design."}),e.jsx(ss,{children:e.jsxs(as,{htmlFor:"include-libraries-toggle",children:[e.jsx(ls,{id:"include-libraries-toggle",type:"checkbox",checked:p,onChange:C=>{const A=C.target.checked;b(A),A||(f(!1),m(null))},"aria-label":"Include custom libraries"}),e.jsx(cs,{$checked:p}),e.jsx("span",{children:"Include custom libraries"})]})}),p&&e.jsxs(e.Fragment,{children:[l&&e.jsxs(ds,{children:[e.jsx(us,{}),e.jsx("span",{children:"Analyzing configuration..."})]}),x&&e.jsx(ps,{children:x}),!l&&!x&&r.length===0&&e.jsx(Xo,{children:"No custom libraries loaded."}),!l&&!x&&r.length>0&&u.length===0&&e.jsx(Xo,{children:"No custom footprints or libraries are used in this configuration."}),!l&&!x&&u.length>0&&e.jsx(fs,{children:u.map((C,A)=>e.jsxs(hs,{children:[e.jsx(gs,{id:`injection-${C.name}`,type:"checkbox",checked:C.checked,onChange:()=>$(A),"aria-label":C.name}),e.jsx(bs,{$type:C.type,children:C.type}),e.jsx(ms,{htmlFor:`injection-${C.name}`,children:C.name})]},`${C.type}-${C.name}`))})]}),e.jsx(Yo,{children:e.jsx(xs,{onClick:I,disabled:l,children:"Share"})})]}):e.jsxs(e.Fragment,{children:[e.jsx(qo,{children:"Shareable Configuration Link"}),e.jsx(Ko,{children:"Share this link with others to let them view and use your keyboard configuration, including all of your custom footprints."}),e.jsxs(ws,{children:[e.jsx(ys,{ref:j,type:"text",value:y,readOnly:!0,"data-testid":i&&`${i}-input`,"aria-label":"Share link"}),e.jsx(Yo,{children:e.jsxs(ks,{onClick:v,"data-testid":i&&`${i}-copy`,"aria-label":P?"Link copied":"Copy link",children:[e.jsx("span",{className:"material-symbols-outlined",children:P?"check":"content_copy"}),P?"Link copied":"Copy link"]})})]})]})]})})},ns=d.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`,rs=d.div`
  background-color: ${n.colors.backgroundLight};
  border: 1px solid ${n.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: relative;
`,is=d.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${n.colors.textDark};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition:
    background-color 0.15s ease-in-out,
    color 0.15s ease-in-out;

  .material-symbols-outlined {
    font-size: ${n.fontSizes.iconLarge};
  }

  &:hover {
    background-color: ${n.colors.buttonHover};
    color: ${n.colors.text};
  }
`,qo=d.h2`
  margin: 0 0 1rem 0;
  font-size: ${n.fontSizes.h3};
  color: ${n.colors.text};
  padding-right: 3rem;
`,Ko=d.p`
  margin: 0 0 1.5rem 0;
  font-size: ${n.fontSizes.base};
  color: ${n.colors.textDark};
  line-height: 1.5;
`,ss=d.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`,as=d.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  font-family: ${n.fonts.body};
  font-size: ${n.fontSizes.base};
  color: ${n.colors.text};
`,ls=d.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`,cs=d.span`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 22px;
  background-color: ${o=>o.$checked?n.colors.accent:n.colors.backgroundLighter};
  border: 1px solid ${n.colors.border};
  border-radius: 22px;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: ${n.colors.white};
    border-radius: 50%;
    transition: transform 0.2s ease;
    transform: ${o=>o.$checked?"translateX(22px)":"translateX(0)"};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }
`,ds=d.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.5rem 0;
  color: ${n.colors.textDark};
`,us=d.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${n.colors.border};
  border-top: 2px solid ${n.colors.accent};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`,ps=d.p`
  color: ${n.colors.error};
  font-size: ${n.fontSizes.sm};
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: ${n.colors.errorDark}22;
  border: 1px solid ${n.colors.error};
  border-radius: 6px;
`,Xo=d.p`
  color: ${n.colors.textDarker};
  font-size: ${n.fontSizes.sm};
  margin: 1rem 0;
  font-style: italic;
`,fs=d.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${n.colors.border};
  border-radius: 6px;
  background-color: ${n.colors.backgroundLighter};
  margin: 1rem 0 1.5rem 0;
  padding: 0.5rem;
`,hs=d.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${n.colors.backgroundLight};
  }
`,gs=d.input`
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: ${n.colors.accent};
`,ms=d.label`
  cursor: pointer;
  flex: 1;
  color: ${n.colors.text};
  font-size: ${n.fontSizes.sm};
  user-select: none;
`,bs=d.span`
  font-size: ${n.fontSizes.xs};
  font-weight: ${n.fontWeights.bold};
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  color: ${n.colors.white};
  background-color: ${o=>{switch(o.$type){case"footprint":return"#007bff";case"outline":return"#e83e8c";case"template":return"#fd7e14";default:return n.colors.border}}};
`,xs=d.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: ${n.colors.accent};
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  color: ${n.colors.white};
  font-family: ${n.fonts.body};
  font-size: ${n.fontSizes.base};
  font-weight: ${n.fontWeights.semiBold};
  cursor: pointer;
  transition:
    background-color 0.15s ease-in-out,
    transform 0.15s ease-in-out;
  margin-top: 1rem;

  &:hover {
    background-color: ${n.colors.accentDark};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,ws=d.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: stretch;
`,Yo=d.div`
  display: flex;
  justify-content: center;
  width: 100%;

  @media (min-width: 500px) {
    width: auto;
  }
`,ys=d.input`
  flex: 1;
  background-color: ${n.colors.backgroundLighter};
  border: 1px solid ${n.colors.border};
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: ${n.colors.text};
  font-family: ${n.fonts.body};
  font-size: ${n.fontSizes.base};
  outline: none;
  transition: border-color 0.15s ease-in-out;

  &:focus {
    border-color: ${n.colors.accent};
  }

  &::selection {
    background-color: ${n.colors.accent};
    color: ${n.colors.white};
  }
`,ks=d.button`
  white-space: nowrap;
  flex-shrink: 0;
  width: 125px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: ${n.colors.accent};
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: ${n.colors.white};
  font-family: ${n.fonts.body};
  font-size: ${n.fontSizes.base};
  cursor: pointer;
  transition:
    background-color 0.15s ease-in-out,
    transform 0.15s ease-in-out;

  .material-symbols-outlined {
    font-size: ${n.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${n.colors.accentDark};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,vs=d.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${n.colors.accentSecondary};
  border-radius: 6px;
  padding: 0 0.5em;
  margin-left: 1em;
  font-family: ${n.fonts.body};
  font-size: ${n.fontSizes.bodySmall};
  height: 1.7em;
  min-width: 2.2em;
  color: ${n.colors.white};
  box-sizing: border-box;
  user-select: none;
`;function _s(){return e.jsx(e.Fragment,{children:e.jsxs("span",{children:[Mn()?"⌘":"Ctrl"," ⏎"]})})}const js=d.div`
  width: 100%;
  height: 3em;
  display: none;
  align-items: center;
  border-bottom: 1px solid ${n.colors.border};
  flex-direction: row;
  gap: 10px;
  padding: 0 1rem;
  flex-shrink: 0;

  @media (max-width: 639px) {
    display: flex;
    padding: 0 0.5rem;
  }
`,$s=d.div`
  flex-grow: 1;
`,Zo=d(Ae)`
  display: none;

  @media (max-width: 475px) {
    display: flex;
  }
`,Cs=d.button`
  background-color: ${n.colors.accentSecondary};
  transition: background-color 0.15s ease-in-out;
  border: none;
  border-radius: 6px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  height: 34px;
  font-family: ${n.fonts.body};
  padding: 8px 12px !important;

  .material-symbols-outlined {
    font-size: ${n.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${n.colors.accentDark};
  }
`,Qo=d.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
`,Ss=d.div`
  display: flex;
  gap: 10px;
  align-items: stretch;
  padding: 10px;

  @media (max-width: 639px) {
    display: none;
  }
`,Ps=d.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
  padding: 0;
`,en=d(Di)`
  height: 100%;
`,Es=d.div`
  height: 100%;
  overflow-y: auto;
`,Is=d(si)`
  position: relative;
  flex-grow: 1;
  min-height: 0;
`,zs=d.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`,Ls=d.div`
  height: 100%;
  overflow-y: auto;
  padding: 0.5rem;

  @media (min-width: 640px) {
    padding: 1rem;
  }
`,Ds=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 640px) {
    display: none;
  }
`,As=d.button`
  background: none;
  border: none;
  color: ${n.colors.textDark};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition:
    background-color 0.15s ease-in-out,
    color 0.15s ease-in-out;

  .material-symbols-outlined {
    font-size: ${n.fontSizes.iconLarge};
  }

  &:hover {
    background-color: ${n.colors.buttonHover};
    color: ${n.colors.text};
  }

  @media (min-width: 640px) {
    display: none;
  }
`,tn=d.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: row;

  @media (max-width: 639px) {
    width: ${o=>o.$fullWidth?"100%":"auto"};
  }
`,on=d.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
`,Rs=d.div`
  display: flex;
  height: 100%;
  width: 100%;
`,Ns=({pwaState:o})=>{const t=()=>Math.max(200,window.innerWidth*.33),s=()=>Math.max(150,window.innerWidth*.15),i=()=>Math.max(350,window.innerWidth*.15),[r,a]=h.useState({key:"demo.svg",extension:"svg",content:""}),[c,p]=h.useState(!1),b=S=>{a(S),u!=null&&u.showConfig||u==null||u.setShowDownloads(!1)},[l,f]=h.useState({key:-1,type:"",name:"",content:""}),[x,m]=h.useState(!1),[y,k]=h.useState(window.innerWidth<=639),u=we();if(h.useEffect(()=>{const S=()=>{k(window.innerWidth<=639)};return window.addEventListener("resize",S),()=>window.removeEventListener("resize",S)},[]),rr(Mn()?"meta+enter":"ctrl+enter",()=>{u&&(V("shortcut_used",{action:"generate"}),u.generateNow(u.configInput,u.injectionInput,{pointsonly:!1}))},{enableOnFormTags:!0,preventDefault:!0}),h.useEffect(()=>{if(l.key===-1||l.name===""||l.content==="")return;const S=[l.type,l.name,l.content];let $=[];Array.isArray(u==null?void 0:u.injectionInput)&&($=[...u.injectionInput]);const I=$.length;if(I===0||I===l.key)$.push(S),f({...l,key:I});else{const v=$[l.key];if(v[0]===l.type&&v[1]===l.name&&v[2]===l.content)return;$=$.map((C,A)=>A===l.key?S:C)}u==null||u.setInjectionInput($)},[u,l]),h.useEffect(()=>{u!=null&&u.results&&r.key&&r.extension&&V("preview_loaded",{preview_type:r.extension,preview_key:r.key})},[r.key,r.extension,u==null?void 0:u.results]),!u)return null;let g=null;switch(u.results&&(g=Zt(r.key,u.results),g===void 0&&r.key!=="demo.svg"&&(r.key="demo.svg",r.extension="svg",g=Zt(r.key,u.results))),r.extension){case"svg":case"kicad_pcb":r.content=typeof g=="string"?g:"";break;case"stl":r.content=typeof g=="string"||g instanceof ArrayBuffer||ArrayBuffer.isView(g)?g:"";break;case"jscad":r.content=typeof(g==null?void 0:g.jscad)=="string"?g.jscad:"";break;case"yaml":r.content=pe.dump(g);break;case"txt":r.content=u.configInput||"";break;default:r.content=""}const _=S=>{const $={...l,name:S.target.value};f($)},L=S=>{if(!Array.isArray(u==null?void 0:u.injectionInput))return;V("injection_deleted",{injection_type:S.type});const $=[...u.injectionInput].filter((I,v)=>v!==S.key);if(u.setInjectionInput($),l.key===S.key)f({key:-1,type:"",name:"",content:""});else if(l.key>=S.key){const I={...l,key:l.key-1};f(I)}},P=()=>{var v;const S=((v=u.getRealtimeConfigInput)==null?void 0:v.call(u))??u.configInput;if(S===void 0)return;V("download_button_clicked",{download_type:"yaml",file_name:"config.yaml"});const $=document.createElement("a"),I=new Blob([S],{type:"text/yaml"});$.href=URL.createObjectURL(I),$.download="config.yaml",document.body.appendChild($),$.click(),URL.revokeObjectURL($.href),document.body.removeChild($)},E=()=>{var S,$;u.configInput&&(V("share_button_clicked",{has_injections:!!((S=u.injectionInput)!=null&&S.length),injections_count:(($=u.injectionInput)==null?void 0:$.length)||0,source:"subheader"}),p(!0))},j=()=>{var S,$,I;!u.results||!u.configInput||u.isGenerating||u.isJscadConverting||(V("archive_single_downloaded",{has_injections:!!((S=u.injectionInput)!=null&&S.length),injections_count:(($=u.injectionInput)==null?void 0:$.length)||0,stored_configs_count:((I=u.configs)==null?void 0:I.length)||0,source:"subheader"}),Wn(u.results,u.configInput,u.injectionInput,u.debug,u.stlPreview))};return e.jsxs(e.Fragment,{children:[c&&e.jsx(Hn,{config:u.configInput||"",injections:u.injectionInput||[],onClose:()=>p(!1)}),e.jsxs(Ps,{children:[!u.showSettings&&e.jsxs(js,{children:[e.jsx(Ae,{className:u.showConfig?"active":"",onClick:()=>u.setShowConfig(!0),"aria-label":"Show configuration panel","data-testid":"mobile-config-button",children:"Config"}),e.jsx(Ae,{className:u.showConfig?"":"active",onClick:()=>u.setShowConfig(!1),"aria-label":"Show outputs panel","data-testid":"mobile-outputs-button",children:"Outputs"}),e.jsx($s,{}),u.showConfig&&e.jsxs(e.Fragment,{children:[e.jsx(Cs,{onClick:()=>u.generateNow(u.configInput,u.injectionInput,{pointsonly:!1}),"aria-label":"Generate configuration","data-testid":"mobile-generate-button",children:e.jsx("span",{className:"material-symbols-outlined",children:"refresh"})}),e.jsx(Zo,{onClick:E,disabled:!u.configInput,"aria-label":"Share configuration","data-testid":"mobile-share-button",children:e.jsx("span",{className:"material-symbols-outlined",children:"share"})}),e.jsx(Ae,{onClick:P,"aria-label":"Download configuration","data-testid":"mobile-download-button",children:e.jsx("span",{className:"material-symbols-outlined",children:"download"})})]}),!u.showConfig&&e.jsxs(e.Fragment,{children:[e.jsx(Zo,{onClick:j,disabled:u.isGenerating||u.isJscadConverting,"aria-label":"Download archive of all generated files","data-testid":"mobile-download-outputs-button",children:e.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),e.jsx(Ae,{onClick:()=>u.setShowDownloads(!u.showDownloads),"aria-label":u.showDownloads?"Hide downloads panel":"Show downloads panel","data-testid":"mobile-downloads-toggle-button",children:e.jsx("span",{className:"material-symbols-outlined",children:u.showDownloads?"expand_content":"collapse_content"})})]})]}),e.jsx(Rs,{children:u.showSettings?e.jsxs(e.Fragment,{children:[e.jsx(Ut,{initialWidth:i(),minWidth:150,maxWidth:"70%",side:"left","data-testid":"settings-panel",style:{display:x&&y?"none":void 0},children:e.jsxs(Ls,{children:[e.jsxs(zs,{children:[e.jsx(lt,{children:"General"}),e.jsxs(ct,{children:[e.jsx(Le,{optionId:"autogen",label:"Auto-generate",description:"Automatically generate new outputs and update previews on changes.",setSelected:u.setAutoGen,checked:u.autoGen,"aria-label":"Enable auto-generate"}),e.jsx(Le,{optionId:"autogen3d",label:"Auto-generate PCB & 3D",description:"Build 3D models and PCB files during generation (can be slow).",setSelected:u.setAutoGen3D,checked:u.autoGen3D,"aria-label":"Enable auto-generate PCB and 3D (slow)"}),e.jsx(Le,{optionId:"debug",label:"Debug",description:"Include debug files in the outputs.",setSelected:u.setDebug,checked:u.debug,"aria-label":"Enable debug mode"})]}),e.jsx(lt,{children:"Previews (Experimental)"}),e.jsxs(ct,{children:[e.jsx(Le,{optionId:"kicanvasPreview",label:"KiCad Preview",description:"Render interactive PCB layouts using KiCanvas.",setSelected:u.setKicanvasPreview,checked:u.kicanvasPreview,"aria-label":"Enable KiCad preview (experimental)"}),e.jsx(Le,{optionId:"stlPreview",label:"STL Preview",description:"Render 3D preview of generated cases.",setSelected:u.setStlPreview,checked:u.stlPreview,"aria-label":"Enable STL preview (experimental)"})]}),e.jsx(lt,{children:"Privacy"}),e.jsx(ct,{children:e.jsx(Le,{optionId:"sendUsageMetrics",label:"Send Usage Metrics",description:"Help improve Ergogen Web UI by sharing anonymous usage statistics.",setSelected:u.setSendUsageMetrics,checked:u.sendUsageMetrics,"aria-label":"Send usage metrics"})}),o&&e.jsxs(e.Fragment,{children:[e.jsx(lt,{children:"Offline"}),e.jsx(ct,{children:e.jsx(Yi,{isAvailable:o.isAvailable,isInstalled:o.isInstalled,isInstalling:o.isInstalling,onInstall:o.onInstall})})]})]}),e.jsx(Ci,{setInjectionToEdit:f,deleteInjection:L,injectionToEdit:l,onInjectionSelect:()=>m(!0),"data-testid":"injections-container"})]})}),e.jsx(tn,{$fullWidth:x&&y,children:e.jsxs(Qo,{children:[y&&e.jsxs(Ds,{children:[e.jsxs(mt,{as:"h4",style:{marginTop:0},children:[l.type?l.type.charAt(0).toUpperCase()+l.type.slice(1):"Footprint"," ","name"]}),e.jsx(As,{onClick:()=>{m(!1),f({key:-1,type:"",name:"",content:""})},"aria-label":"Close editor","data-testid":"mobile-editor-close",children:e.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),!y&&e.jsxs(mt,{as:"h4",children:[l.type?l.type.charAt(0).toUpperCase()+l.type.slice(1):"Footprint"," ","name"]}),e.jsx(Ni,{value:l.name,onChange:_,disabled:l.key===-1,"aria-label":`${l.type?l.type.charAt(0).toUpperCase()+l.type.slice(1):"Footprint"} name`,"data-testid":"footprint-name-input"}),e.jsxs(mt,{as:"h4",children:[l.type?l.type.charAt(0).toUpperCase()+l.type.slice(1):"Footprint"," ","code"]}),e.jsx(ai,{injection:l,setInjection:f,options:{readOnly:l.key===-1}})]})})]}):e.jsxs(e.Fragment,{children:[u.showConfig&&e.jsx(Ut,{initialWidth:t(),minWidth:250,maxWidth:"60%",side:"left","data-testid":"config-panel",children:e.jsxs(Qo,{children:[e.jsx(Is,{"data-testid":"config-editor"}),e.jsxs(Ss,{children:[e.jsx(He,{onClick:()=>u.generateNow(u.configInput,u.injectionInput,{pointsonly:!1}),"aria-label":"Generate configuration","data-testid":"generate-button",children:e.jsxs("span",{style:{display:"flex",alignItems:"center",width:"100%",justifyContent:"center"},children:[e.jsx("span",{children:"Generate"}),e.jsx(vs,{children:_s()})]})}),e.jsx(Ae,{onClick:P,"aria-label":"Download configuration","data-testid":"download-config-button",children:e.jsx("span",{className:"material-symbols-outlined",children:"download"})})]})]})}),e.jsx(tn,{$fullWidth:!u.showConfig,children:u.showDownloads?e.jsxs(e.Fragment,{children:[e.jsx(on,{children:e.jsx(en,{"data-testid":`${r.key}-file-preview`,previewExtension:r.extension,previewKey:`${r.key}-${u.resultsVersion}`,previewContent:r.content})}),e.jsx(Ut,{initialWidth:s(),minWidth:105,maxWidth:"30%",side:"right","data-testid":"downloads-panel",children:e.jsx(Es,{children:e.jsx(wi,{setPreview:b,previewKey:r.key,"data-testid":"downloads-container"})})})]}):e.jsx(on,{children:e.jsx(en,{"data-testid":`${r.key}-file-preview`,previewExtension:r.extension,previewKey:`${r.key}-${u.resultsVersion}`,previewContent:r.content})})})]})})]})]})},Ws={label:"Absolem",author:"MrZealot",value:`meta:
  engine: 4.1.0
points:
  zones:
    matrix:
      anchor:
        rotate: 5
      columns:
        pinky:
        ring:
          key.splay: -5
          key.origin: [-12, -19]
          key.stagger: 12
        middle:
          key.stagger: 5
        index:
          key.stagger: -6
        inner:
          key.stagger: -2
      rows:
        bottom:
        home:
        top:
    thumbfan:
      anchor:
        ref: matrix_inner_bottom
        shift: [-7, -19]
      columns:
        near:
        home:
          key.spread: 21.25
          key.splay: -28
          key.origin: [-11.75, -9]
        far:
          key.spread: 21.25
          key.splay: -28
          key.origin: [-9.5, -9]
      rows:
        thumb:
  rotate: -20
  mirror:
    ref: matrix_pinky_home
    distance: 223.7529778`},Us={label:"Atreus",author:"MrZealot",value:`points:
  zones:
    matrix:
      columns:
        pinky:
        ring:
          key.stagger: 3
        middle:
          key.stagger: 5
        index:
          key.stagger: -5
        inner:
          key.stagger: -6
        thumb:
          key.skip: true
          key.stagger: 10
          rows:
            home.skip: false
      rows:
        bottom:
        home:
        top:
        num:
  rotate: -10
  mirror:
    ref: matrix_thumb_home
    distance: 22
`},Os={label:"A. Dux",author:"tapioki",value:`meta:
  engine: 4.1.0
points:
  zones:
    matrix:
      anchor.shift: [50,-100] # Fix KiCad placement
      columns:
        pinky:
          key:
            spread: 18
            splay: 15
            origin: [0, -17]
          rows:
            bottom:
              bind: [5, 0, 0, 0]
              column_net: P7
            home:
              bind: [0, 12, 0, 0]
              column_net: P6
            top:
              bind: [0, 8, 5, 0]
              column_net: P5 
        ring:
          key:
            spread: 18
            stagger: 17
            splay: -10
            origin: [0, -17]
          rows:
            bottom:
              bind: [0, 0, 2, 10]
              column_net: P4
            home:
              bind: [5, 0, 5, 0]
              column_net: P3
            top:
              bind: [0, 6, 0, 0]
              column_net: P0
        middle:
          key:
            shift: [0.2, 0]
            spread: 18
            stagger: 17/3
            splay: -5
            origin: [0, -17]
          rows:
            bottom:
              bind: [0, 10, 0, 5]
              column_net: P1
            home:
              bind: 5
              column_net: P19
            top:
              bind: [0, 0, 0, 0]
              column_net: P18
        index:
          key:
            spread: 18
            stagger: -17/3
            splay: -5
            origin: [0, -17]
          rows:
            bottom:
              bind: [0, 5, 0, 0]
              column_net: P15
            home:
              bind: [5, 0, 5, 0]
              column_net: P14
            top:
              bind: [0, 0, 0, 6]
              column_net: P16
        inner:
          key:
            spread: 18
            stagger: -17/6
            origin: [0, -17]
          rows: 
            bottom:
              bind: [5, 19, 20, 2]
              column_net: P10
            home:
              bind: [0, 27, 0, 5]
              column_net: P20
            top:
              bind: [0, 0, 5, 5]
              column_net: P21
      rows:
        bottom:
          padding: 17
        home:
          padding: 17
        top:
    thumb:
      anchor:
        ref: matrix_inner_bottom
        shift: [0,-24]
      columns:
        first:
          key:
            splay: -15
          rows:
            only:
              column_net: P8
              bind: [10, 1, 0, 70]
        second:
          key:
            spread: 18
            splay: -10
            origin: [-9, -9.5]
          rows:
            only:
              column_net: P9
              bind: [0, 0, 0, 5]
      rows:
        only:
          padding: 17
      key:
        footprints:
outlines:
  _raw:
    - what: rectangle
      where: true
      bound: true
      asym: left
      size: [18,17]
      corner: 1
  _first:
    - what: outline
      name: _raw
      fillet: 3
  _second:
    - what: outline
      name: _first
      fillet: 2
  _third:
    - what: outline
      name: _second
      fillet: 1
  bottom:
    - what: outline
      name: _third
      fillet: 0.5
  _key_slot_negative:
    - what: rectangle
      where: true
      size: 13.8
  _key_snap:
    - what: outline
      name: _key_slot_negative
      expand: 1.2
    - what: outline
      name: _key_slot_negative
      operation: subtract
  _prototype_plate:
    - what: outline
      name: bottom
    - what: outline
      name: _key_slot_negative
      operation: subtract
  _mounting_plate:
    - what: hull
      points: 
        - matrix_pinky_bottom
        - matrix_pinky_home
        - matrix_pinky_top
        - matrix_ring_bottom
        - matrix_ring_home
        - matrix_ring_top
        - matrix_middle_bottom
        - matrix_middle_home
        - matrix_middle_top
        - matrix_index_bottom
        - matrix_index_home
        - matrix_index_top
        - matrix_inner_bottom
        - matrix_inner_home
        - matrix_inner_top
        - thumb_first_only
        - thumb_second_only
      concavity: 50
      expand: -0.5
    - what: outline
      name: bottom
      operation: intersect
      fillet: 5
    - what: outline
      name: _key_slot_negative
      operation: subtract
pcbs:
  architeuthis_dux:
    template: kicad8
    outlines:
      main:
        outline: bottom
    footprints:
      choc_hotswap:
        what: ceoloide/switch_choc_v1_v2
        where: true
        params:
          from: =column_net
          to: GND
          include_corner_marks: true
          include_keycap: true
          keycap_height: 16.5
          keycap_width: 17.5
          reversible: true
          solder: true
          hotswap: true
          choc_v2_support: false
          outer_pad_width_front: 2.0
          outer_pad_width_back: 2.0
      mcu:
        what: ceoloide/mcu_nice_nano
        where:
          ref: matrix_inner_home
        params:
          reverse_mount: true
          reversible: true
          only_required_jumpers: true
        adjust:
          shift: [19, -8.5]
      trrs:
        what: ceoloide/trrs_pj320a
        where:
          ref: matrix_inner_home
          shift: [32, 6.5]
        params:
          SL: GND
          R2: P2
          TP: VCC # Tip and Ring 1 are joined together
          reversible: true
          symmetric: true
      jlcpcb_order_number_text:
        what: ceoloide/utility_text
        where: matrix_inner_bottom
        params:
          text: JLCJLCJLCJLC
          reversible: true
        adjust:
          shift: [0,-u/2 - 1.5]
      ergogen_logo:
        what: ceoloide/utility_ergogen_logo
        where: matrix_middle_bottom
        params:
          scale: 2.5
          reversible: true
        adjust:
          shift: [0,-1u]  
cases:
  prototype:
    - what: outline
      name: _prototype_plate
      extrude: 1.6
    - what: outline
      name: _key_snap
      extrude: 1.6 + 5
  mounting_plate:
    - what: outline
      name: _mounting_plate
      extrude: 1.2
`},Fs={label:"Corney Island",author:"ceoloide",value:`points:
  key.tags: 
    - key
  zones:
    matrix:
      anchor:
        shift: [150, -150] # Fix KiCad placement
      columns:
        c1:
        c2:
        c3.key.stagger: u/4
        c4.key.stagger: u/8
        c5.key.stagger: -u/8
        c6.key.stagger: -u/8
      rows:
        r3:
        r2:
        r1:
    thumbfan:
      anchor:
        - ref: matrix_c4_r3
          shift: [9.5,-22]
      columns:
        c4:
        c5.key:
          splay: -15
          stagger: -2.7
          spread: u + 2
        c6.key:
          splay: 75
          stagger: 2
          spread: u + 3.5
          tags:
            - key_1_5u
      rows:
        r0:
    mcu:
      key.tags:
        - helper
      anchor:
        - ref: matrix_c6_r1
          shift: [u/2+18/2+1.6,u/2-33/2]
    display:
      key.tags:
        - helper
      anchor:
        - ref: mcu
          shift: [0,-3.5]
    corne_screw_1:
      key.tags:
        - helper
        - corne_screw
      anchor: 
        aggregate.parts:
          - ref: matrix_c1_r1
          - ref: matrix_c2_r1
          - ref: matrix_c1_r2
          - ref: matrix_c2_r2
    corne_screw_2:
      key.tags:
        - helper
        - corne_screw
      anchor: 
        aggregate.parts:
          - ref: matrix_c5_r1
          - ref: matrix_c5_r2
          - ref: matrix_c6_r1
          - ref: matrix_c6_r2
    corne_screw_3:
      key.tags:
        - helper
        - corne_screw
      anchor: 
        aggregate.parts:
          - ref: matrix_c1_r2
          - ref: matrix_c1_r3
          - ref: matrix_c2_r2
          - ref: matrix_c2_r3
    corne_screw_4:
      key.tags:
        - helper
        - corne_screw
      anchor: 
        aggregate.parts:
          - ref: matrix_c3_r3
          - ref: thumbfan_c4_r0
        shift: [0.4,-2.675]
    corne_screw_5:
      key.tags:
        - helper
        - corne_screw
      anchor:
        ref: thumbfan_c6_r0
        shift: [0,12]
outlines:
  _keycaps:
    - what: rectangle
      where: [key]
      size: 18
      fillet: 3
    - what: rectangle
      where: [key_1_5u]
      size: [18*1.5,18]
      fillet: 3
  _mcu:
    - what: rectangle
      where: [mcu]
      size: [17.78,33]
      fillet: 1
    - what: rectangle
      where: [mcu]
      size: [8.94,7.35]
      fillet: 0.1
      operation: stack
      adjust:
        shift: [0,33/2-7.35/2+0.7]
  _display:
    - what: rectangle
      where: [display]
      size: [14,36]
      fillet: 0.5
    - what: rectangle
      where: [display]
      size: [12.82,2.66]
      operation: stack
      fillet: 0.1
      adjust:
        shift: [0,-16.7]
    - what: rectangle
      where: [display]
      size: [10.8,24.6]
      operation: stack
      adjust:
        shift: [0,-0.75]
  _mcu_cluster:
    - what: outline
      name: _mcu
      operation: stack
    - what: outline
      name: _display
      operation: stack
  _keys:
    - what: rectangle
      where: /matrix/
      size: u
    - what: polygon
      points:
        - ref: matrix_c3_r1
          shift: [u/2,-u/2]
        - ref: thumbfan_c4_r0
          shift: [-u/2,u/2]
          affect: [x]
        - ref: thumbfan_c4_r0
          shift: [-u/2,u/2]
          affect: [y]
        - ref: thumbfan_c5_r0
          shift: [u/2,u/2]
          affect: [x,y]
        - ref: matrix_c6_r3
          shift: [u/2,-u]
        - ref: matrix_c6_r3
          shift: [u/2,-u/2]
  _corne_screw_heads:
    - what: circle
      where: [corne_screw]
      radius: 4.3/2
  corne:
    - what: rectangle
      where: [key]
      size: u
    - what: rectangle
      where: [matrix_c6_r1]
      size: [1.6,3u]
      adjust:
        shift: [u/2+1.6/2,-u]
    - what: rectangle
      where: [mcu]
      size: [18,33]
    - what: rectangle
      where: [display]
      size: [18,36]
    - what: polygon
      points:
        - ref: matrix_c2_r3
          shift: [u/2,-u/2]
        - ref: matrix_c3_r3
          shift: [u/2,-u/2-u/4]
        - ref: thumbfan_c4_r0
          shift: [-u/2,-u/2]
          affect: [x,y]
        - ref: thumbfan_c5_r0
          shift: [u/2,-u/2]
          affect: [x,y]
        - ref: thumbfan_c6_r0
          shift: [-1.5u/2,-u/2]
          affect: [x,y]
        - ref: thumbfan_c6_r0
          shift: [1.5u/2,-u/2]
          affect: [x,y]
        - ref: mcu
          shift: [0,33/2]
          affect: [y]
        - ref: matrix_c6_r2
          shift: [-u/2,0]
          affect: [x]
        - ref: matrix_c2_r2
          shift: [u/2,u/2]
          affect: [x,y]
  preview:
    - what: outline
      name: corne
    - what: outline
      name: _keycaps
      operation: stack
    - what: outline
      name: _mcu_cluster
      operation: stack
    - what: outline
      name: _corne_screw_heads
      operation: stack
pcbs:
  corne_pcb:
    template: kicad8
    outlines:
      board:
        outline: corne
    footprints:
      m2_screws:
        what: ceoloide/mounting_hole_npth
        where: /corne_screw/
        params:
          hole_size: 4.6
          hole_drill: 2.2
      inner_switches:
        what: ceoloide/switch_choc_v1_v2
        where:
          - /matrix_c[2-6]_r[0-4]/
          - /thumbfan_c[4-5]_r0/
        params:  &switches
          from: "{{colrow}}"
          to: "{{col.name}}"
          choc_v1_support: false
          include_plated_holes: false
          hotswap: true
          reversible: true
          include_stabilizer_pad: false
        adjust:
          rotate: 180
      outer_switches_left:
        what: ceoloide/switch_choc_v1_v2
        where:
          - /matrix_c1_r[0-4]/
        params: 
          <<: *switches
          outer_pad_width_back: 2
        adjust:
          rotate: 180
      outer_switches_right:
        what: ceoloide/switch_choc_v1_v2
        where:
          - thumbfan_c6_r0
        params: 
          <<: *switches
          outer_pad_width_front: 2
        adjust:
          rotate: 180
      diodes:
        what: ceoloide/diode_tht_sod123
        where: /key/
        params:
          from: "{{colrow}}"
          to: "{{row}}"
          reversible: true
        adjust:
          shift: [5.7,0]
          rotate: 180
      mcu:
        what: ceoloide/mcu_supermini_nrf52840
        where: mcu
        params:
          reversible: true
          only_required_jumpers: true
          P10: "r0"
          P3: "r1"
          P4: "r2"
          P5: "r3"
          P2: "c1"
          P15: "c2"
          P18: "c3"
          P16: "c4"
          P8: "c5"
          P9: "c6"
          P6: "DA"
          P7: "CL"
          P14: "CS"
          P19_label: " "
          P20_label: " "
          P21_label: " "
          use_rectangular_jumpers: false
      display:
        what: ceoloide/display_nice_view
        where: display
        params:
          reversible: true
          invert_jumpers_position: true
          MOSI: "DA"
          SCK: "CL"
      battery_connector:
        what: ceoloide/battery_connector_jst_ph_2
        where: display
        params:
          reversible: true
        adjust:
          shift: [-6,-25]
          rotate: 90
      on_off_switch:
        what: ceoloide/power_switch_smd_side
        where: matrix_c6_r1
        params:
          from: BAT_P
          to: RAW
          reversible: true
        adjust:
          shift: [-1.5,u/2 - 1.75]
          rotate: 90
      reset_switch:
        what: ceoloide/reset_switch_tht_top
        where: display
        params:
          reversible: true
        adjust:
          shift: [6.75,-25]
          rotate: 90`},eo={label:"Empty YAML configuration",author:"ceoloide",value:`meta:
  engine: 4.1.0
units:
points:
  zones:
    matrix:
outlines:
pcbs:
cases:
`},Bs={label:"Wubbo",author:"cache.works",value:`meta:
  engine: 4.1.0
units:
  # Parameters
  row_spacing: 1cy

  pinky_rotation: 5 # degrees rotation relative to zone rotation
  pinky_stagger: 0 # mm, relative to previous column
  pinky_spread: 1cx # mm, relative to previous column

  ring_rotation: 3
  ring_stagger: 0.45cy
  ring_spread: 1.05cx

  middle_rotation: 0
  middle_stagger: 1
  middle_spread: 1.1cx

  index_rotation: -1
  index_stagger: -3
  index_spread: 1cx

  inner_rotation: -2
  inner_stagger: -5
  inner_spread: 1cx

  usb_cutout_x:  51.64
  usb_cutout_y: 2.10
  usb_cutout_r: -15.5

  # Constants
  choc_cap_x: 17.5
  choc_cap_y: 16.5

  choc_plate_thickness: 1.2
  mx_plate_thickness: 1.5

points:
  rotate: 0
  key: # each key across all zones will have these properties
    bind: 5
    width: choc_cap_x
    height: choc_cap_y
    tags:
      1u: true
    footprints: # These footprints will be added for each of the points
      choc_hotswap:
        type: choc
        nets:
          to: "{{key_net}}"
          from: GND
        params:
          reverse: false
          hotswap: true
          # Don't show a model for this since 'choc' already loads the model
          model: false
          keycaps: false
      choc:
        type: choc
        anchor:
          rotate: 180
        nets:
          to: "{{key_net}}"
          from: GND
        params:
          keycaps: true
          reverse: false
  zones:
    alphas:
      rows:
        bottom.padding: row_spacing
        home.padding: row_spacing
        top.padding: row_spacing
      columns:
        pinkycluster:
          key:
            splay: pinky_rotation
          rows:
            bottom.skip: true
            home.key_net: P106
            top.skip: true
        pinky:
          key:
            splay: pinky_rotation - pinky_rotation
            stagger: pinky_stagger
            spread: pinky_spread
          rows:
            bottom.key_net: P104
            home.key_net: P102
            top.skip: true
        ring:
          key:
            splay: ring_rotation - pinky_rotation
            stagger: ring_stagger
            spread: ring_spread
          rows:
            bottom.key_net: P101
            home.key_net: P103
            top.key_net: P100
        middle:
          key:
            splay: middle_rotation - ring_rotation
            stagger: middle_stagger
            spread: middle_spread
          rows:
            bottom.key_net: P022
            home.key_net: P029
            top.key_net: P030
        index:
          key:
            splay: index_rotation - middle_rotation
            stagger: index_stagger
            spread: index_spread
          rows:
            bottom.key_net: P031
            home.key_net: P004
            top.key_net: P005
        inner:
          key:
            splay: inner_rotation - index_rotation
            stagger: inner_stagger
            spread: inner_spread
          rows:
            bottom.key_net: P007
            home.key_net: P109
            top.key_net: P012
    thumbkeys:
      anchor:
        ref: alphas_index_bottom
        shift: [ 0.5cx, -1cy - 2]
      columns:
        near:
          key:
            splay: -10
            stagger: -5
            origin: [ 0, -0.5cy ]
            key_net: P009
        home:
          key:
            spread: 19
            stagger: 0.25cy # Move up by 0.25cy so a 1.5cy keycap lines up with the bottom
            splay: -15 # -25 degrees cumulative
            origin: [-0.5choc_cap_y, -0.75choc_cap_x] # Pivot at the lower left corner of a 1.5u choc key
            height: choc_cap_x
            width: 1.5choc_cap_y
            rotate: 90
            tags:
              15u: true
              1u: false
            key_net: P010
      rows:
        thumb:
          padding: 0
outlines:
  _bottom_arch_circle:
    - what: circle
      radius: 500
      where:
        ref: alphas_middle_bottom
        shift: [-95, -525]
  _top_arch_circle:
    - what: circle
      radius: 200
      where:
        ref: alphas_middle_bottom
        shift: [0, -155]
  _main_body_circle:
    - what: circle
      radius: 70
      where:
        ref: alphas_middle_bottom
        shift: [0, 0]
  _usb_c_cutout:
    - what: rectangle
      size: [9.28, 6.67]
      where: &usbanchor
        ref: alphas_middle_top
        shift: [ usb_cutout_x, usb_cutout_y ]
        rotate: usb_cutout_r
  # Make a crescent by overlapping two circles then cut the main body with a third circle
  _main: [
      +_top_arch_circle,
      -_bottom_arch_circle,
      ~_main_body_circle
  ]
  _fillet:
    - what: outline
      name: _main
      fillet: 6
  combined: [
      _fillet,
      -_usb_c_cutout
  ]
  _switch_cutouts:
    - what: rectangle
      where: true
      asym: source
      size: 14 # Plate cutouts are 14mm * 14mm for both MX and Choc
      bound: false
  switch_plate:
    [ combined, -_switch_cutouts]
cases:
  switchplate:
    - what: outline
      name: switch_plate
      extrude: choc_plate_thickness
  bottom:
    - what: outline
      name: combined
      extrude: choc_plate_thickness
`},Ms={label:"Sweep-like",author:"jcmkk3",value:`meta:
  engine: 4.1.0
# U is a predefined unit of measure that means 19.05mm, which is MX spacing (u is 19.00mm)
points:
  zones:
    matrix:
      anchor.shift: [50,-100] # Fix KiCad placement
      columns:
        pinky:
        ring.key.stagger: 0.66U
        middle.key.stagger: 0.25U
        index.key.stagger: -0.25U
        inner.key.stagger: -0.15U
      rows:
        bottom.padding: U
        home.padding: U
        top.padding: U
    thumb:
      anchor:
        ref: matrix_index_bottom
        shift: [0.66U, -1.25U]
        rotate: -10
      columns:
        tucky:
          key.name: thumb_tucky
        reachy:
          key.spread: U
          key.splay: -15
          key.origin: [-0.5U, -0.5U]
          key.name: thumb_reachy
pcbs:
  simple_split:
    template: kicad8
    footprints:
      keys:
        what: ceoloide/switch_mx
        where: true
        params:
          from: GND
          to: "{{name}}"
          reversible: true
          solder: true
          include_keycap: true
      mcu:
        what: ceoloide/mcu_nice_nano
        where:
          - ref: matrix_inner_home
            shift: [1U, 0.5U]
        params:
          reversible: true
          only_required_jumpers: true
          P7: matrix_pinky_top
          P7_label: P7
          P18: matrix_ring_top
          P18_label: P18
          P19: matrix_middle_top
          P19_label: P19
          P20: matrix_index_top
          P20_label: P20
          P21: matrix_inner_top
          P21_label: P21
          P15: matrix_pinky_home
          P15_label: P15
          P14: matrix_ring_home
          P14_label: P14
          P16: matrix_middle_home
          P16_label: P16
          P10: matrix_index_home
          P10_label: P10
          P1: matrix_inner_home
          P1_label: P1
          P2: matrix_pinky_bottom
          P2_label: P2
          P3: matrix_ring_bottom
          P3_label: P3
          P4: matrix_middle_bottom
          P4_label: P4
          P5: matrix_index_bottom
          P5_label: P5
          P6: matrix_inner_bottom
          P6_label: P6
          P8: thumb_tucky
          P8_label: P8
          P9: thumb_reachy
          P9_label: P9
`},Ts={label:"Reviung41",author:"jcmkk3",value:`meta:
  engine: 4.1.0
units:
  # U is a predefined unit of measure that means 19.05mm, which is MX spacing (u is 19.00mm)
  angle: -8
points:
  zones:
    matrix:
      anchor.shift: [50,-100] # Fix KiCad placement
      rotate: angle
      mirror: &mirror
        ref: matrix_inner_bottom
        shift: [0, -U]
        distance: 2.25U
      columns:
        outer:
          key:
            column_net: P4
            mirror.column_net: P9
        pinky:
          key:
            stagger: 0.25U
            column_net: P5
            mirror.column_net: P8
        ring:
          key:
            stagger: 0.25U
            column_net: P6
            mirror.column_net: P7
        middle:
          key:
            stagger: 0.25U
            column_net: P7
            mirror.column_net: P6
        index:
          key:
            stagger: -0.25U
            column_net: P8
            mirror.column_net: P5
        inner:
          key:
            stagger: -0.25U
            column_net: P9
            mirror.column_net: P4
      rows:
        bottom:
          key:
            padding: U
          row_net: P21
          mirror.row_net: P18
        home:
          key:
            padding: U
          row_net: P20
          mirror.row_net: P15
        top:
          key:
            padding: U
          row_net: P19
          mirror.row_net: P14
    thumb_middle:
      anchor:
        aggregate.parts:
          - ref: matrix_inner_bottom
          - ref: mirror_matrix_inner_bottom
        shift: [0, -1.15U]
      key:
        name: thumb_middle
        width: 2.25U
        row_net: P16
        column_net: P6
    thumb_reachy:
      mirror: *mirror
      anchor:
        ref: thumb_middle
        shift: [-3.5U / 2 - 2 , 0.12U]
        rotate: angle
      key:
        name: thumb_reachy
        width: 1.25U
        row_net: P16
        column_net: P20
        mirror.column_net: P15
    thumb_tucky:
      mirror: *mirror
      anchor:
        ref: thumb_reachy
        shift: [-1.25U - 2, 0.4U]
        rotate: -angle
      key:
        name: thumb_tucky
        width: 1.25U
        row_net: P16
        column_net: P21
        mirror.column_net: P14
pcbs:
  simple_reviung41:
    template: kicad8
    footprints:
      keys:
        what: ceoloide/switch_mx
        where: true
        params:
          to: "{{column_net}}"
          from: "{{colrow}}"
          include_keycap: true
          hotswap: true
      diodes:
        what: ceoloide/diode_tht_sod123
        where: true
        adjust:
          shift: [0, -4.7]
          rotate: 180
        params:
          from: "{{colrow}}"
          to: "{{row_net}}"
      mcu:
        what: ceoloide/mcu_nice_nano
        where:
          aggregate.parts:
            - ref: matrix_inner_top
            - ref: mirror_matrix_inner_top
          shift: [0, 22]
          rotate: angle + 90  
`},Gs={label:"Tiny20",author:"enzocoralc",value:`meta:
  engine: 4.1.0
points:
  zones:
    matrix:
      anchor:
        rotate: 5
        shift: [50,-75] # Fix KiCad placement
      columns:
        pinky:
          key:
            spread: 18
          rows:
            bottom:
              column_net: P21
            home:
              column_net: P20
        ring:
          key:
            spread: 18
            splay: -5
            origin: [-12, -19]
            stagger: 16
          rows:
            bottom:
              column_net: P19
            home:
              column_net: P18
        middle:
          key:
            spread: 18
            stagger: 5
          rows:
            bottom:
              column_net: P15
            home:
              column_net: P14
        index:
          key:
            spread: 18
            stagger: -6
          rows:
            bottom:
              column_net: P26
            home:
              column_net: P10
      rows:
        bottom:
          padding: 17
        home:
          padding: 17
    thumb:
      anchor:
        ref: matrix_index_bottom
        shift: [2, -20]
        rotate: 90
      columns:
        near:
          key:
            splay: -90
            origin: [0,0]
          rows:
            home:
              rotate: -90
              column_net: P8
        home:
          key:
            spread: 17
            rotate: 90
            origin: [0,0]
          rows:
            home:
              column_net: P9

outlines:
  plate:
    - what: rectangle
      where: true
      asym: source
      size: 18
      corner: 3
    - what: rectangle
      where: true
      asym: source
      size: 14
      bound: false
      operation: subtract
  _pcb_perimeter_raw:
    - what: rectangle
      where: true
      asym: source
      size: 18
      corner: 1
  _polygon:
    - what: polygon # all borders
      operation: stack
      points:
        - ref: matrix_pinky_bottom
          shift: [-9,-9]
        - ref: matrix_pinky_home
          shift: [-9,1.3u]
        - ref: matrix_middle_home
          shift: [-9,9]
        - ref: matrix_middle_home
          shift: [9,9]
        - ref: matrix_index_home
          shift: [1.45u,9]
        - ref: thumb_home_home
          shift: [8,-9]
        - ref: thumb_near_home
          shift: [9,-9]
  pcb_perimeter:
    - what: outline # keys
      name: _pcb_perimeter_raw
    - what: outline
      name: _polygon
      operation: add

pcbs:
  tiny20:
    template: kicad8
    outlines:
      main:
        outline: pcb_perimeter
    footprints:
      keys:
        what: ceoloide/switch_choc_v1_v2
        where: true
        params:
          from: GND
          to: "{{column_net}}"
          include_keycap: true
          keycap_width: 17.5
          keycap_height: 16.5
          reversible: true
          hotswap: false
          solder: true
          choc_v2_support: false
      promicro:
        what: ceoloide/mcu_nice_nano
        where: matrix_index_home
        params:
          reverse_mount: true
          reversible: true
          only_required_jumpers: true
        adjust.shift: [0.95u, -0.5u]
      trrs:
        what: ceoloide/trrs_pj320a
        where:
          ref: matrix_pinky_home
          shift: [0, 1.2u]
          rotate: 0
        params:
          SL: GND
          R2: P1
          TP: VCC # Tip and Ring 1 are joined togetherue
          symmetric: true
          reversible: true
      reset:
        what: ceoloide/reset_switch_tht_top
        where: matrix_ring_home
        params:
          from: RST
          to: GND
          reversible: true
        adjust:
          shift: [-0.7u, 0]
          rotate: 90
      jlcpcb_order_number_text:
        what: ceoloide/utility_text
        where: matrix_middle_bottom
        params:
          text: JLCJLCJLCJLC
          reversible: true
        adjust:
          shift: [0,-u/2]
      ergogen_logo:
        what: ceoloide/utility_ergogen_logo
        where: matrix_middle_bottom
        params:
          scale: 2.5
          reversible: true
        adjust:
          shift: [0,-1.25u]
`},Hs={label:"Alpha",author:"jcmkk3",value:`points:
  mirror:
    ref: ortho_inner_home
    distance: 1U
  zones:
    ortho:
      columns:
        pinky:
        ring:
        middle:
        index:
        inner:
      rows:
        home.padding: 1U
        top.padding: 1U
    stagger:
      anchor:
        ref: ortho_pinky_home
        shift: [0.5U, -1U]
      columns:
        pinky:
        ring:
        middle:
        index:
          key.asym: left
        space:
          key:
            spread: 0.5U
            asym: right
            width: 2*(u-1)
      rows:
        bottom.padding: 1U
`},Vs={label:"Plank",author:"cache.works",value:`meta:
  engine: 4.1.0
units:
  visual_x: 17.5
  visual_y: 16.5
points:
  zones:
    matrix:
      anchor:
        shift: [50, -100] # Fix KiCad placement
      columns:
        one:
          key:
            column_net: P1
            column_mark: 1
        two:
          key:
            spread: 1cx
            column_net: P0
            column_mark: 2
        three:
          key:
            spread: 1cx
            column_net: P14
            column_mark: 3
        four:
          key:
            spread: 1cx
            column_net: P20
            column_mark: 4
        five:
          key:
            spread:  1cx
            column_net: P2
            column_mark: 5
        six:
          key:
            spread:  1cx
            column_net: P3
            column_mark: 6
        seven:
          key:
            spread:  1cx
            column_net: P4
            column_mark: 7
          rows:
            2uspacebar:
              skip: false
              shift: [-0.5cx, 1cy]
              rotate: 180
            modrow:
              shift: [-0.5cx, -1cy]
              rotate: 180
        eight:
          key:
            spread:  1cx
            column_net: P5
            column_mark: 8
        nine:
          key:
            spread:  1cx
            column_net: P6
            column_mark: 9
        ten:
          key:
            spread:  1cx
            column_net: P7
            column_mark: 10
        eleven:
          key:
            spread:  1cx
            column_net: P8
            column_mark: 11
        twelve:
          key:
            spread:  1cx
            column_net: P9
            column_mark: 12
      rows:
        2uspacebar:
          padding: 1cy
          row_net: P19
          skip: true
        modrow:
          padding: 1cy
          row_net: P19
        bottom:
          padding: 1cy
          row_net: P18
        home:
          padding: 1cy
          row_net: P15
        top:
          padding: 1cy
          row_net: P21
  key:
    bind: 2
outlines:
  _raw:
    - what: rectangle
      where: true
      asym: left
      size: [1cx,1cy]
  panel:
    - what: outline
      name: _raw
      expand: 1.6
  _switch_cutouts:
    - what: rectangle
      where: true
      asym: left
      size: 14
      bound: false
  switch_plate:
    main:
      what: outline
      name: panel
    keyholes:
      what: outline
      name: _switch_cutouts
      operation: subtract
pcbs:
  plank:
    template: kicad8
    outlines:
      main:
        outline: panel
    footprints:
      choc:
        what: ceoloide/switch_choc_v1_v2
        where: true
        params:
          from: "{{colrow}}"
          to: "{{column_net}}"
          include_keycap: true
          keycap_width: 17.5
          keycap_height: 16.5
          choc_v2_support: false
          solder: true
          hotswap: false
      diode:
        what: ceoloide/diode_tht_sod123
        where: true
        adjust:
          rotate: 0
          shift: [ 0, -4.5 ]
        params:
          from: "{{colrow}}"
          to: "{{row_net}}"
      promicro:
        what: ceoloide/mcu_nice_nano
        where:
          ref: matrix_seven_top
          shift: [-0.5cx, 1]
          rotate: 90
        params:
          reverse_mount: true
      powerswitch:
        what: ceoloide/power_switch_smd_side
        where:
          ref: matrix_four_top
          shift: [0.5cx+2, cy/2 - 1.8 + 1.6]
          rotate: 90
        params:
          from: RAW
          to: BAT_P
          side: B
      jstph:
        what: ceoloide/battery_connector_jst_ph_2
        where:
          ref: matrix_four_top
          shift: [0.5cx, -1.5cy]
          rotate: 180
        params:
          BAT_P: BAT
          BAT_N: GND
          side: B
      jlcpcb_order_number_text:
        what: ceoloide/utility_text
        where: matrix_seven_2uspacebar
        params:
          text: JLCJLCJLCJLC
          reversible: true
        adjust:
          shift: [0,-u/2]
      ergogen_logo:
        what: ceoloide/utility_ergogen_logo
        where: matrix_seven_2uspacebar
        params:
          scale: 1.75
          reversible: true
        adjust:
          shift: [0,-1.5cy-2]
`},Js={label:"Curly-45",author:"peterjc",value:`meta:
  engine: 4.2.1
  version: 1.0.0
  author: peterjc
points:
  mirror:
    ref: top_inner_sole
    distance: 2U
  # Using one zone per row, and starting from the inner column
  # (negative spread, so right to left unlike the default).
  zones:
    top:
      key:
        splay: 5.5
        origin: [0.5*U,-0.5*U]
        spread: -U
      columns:
        inner:
          key:
           splay: -22
        index:
        middle:
        ring:
        pinky:
        outer:
          # Backtick on left, open bracket on right
          key:
           splay: 0
        outer2:
          # Escape on left, close bracket on right
          key:
           splay: 0
        backspace:
          key:
           asym: right
           splay: 0
      rows:
        sole.padding: 1U
    middle:
      anchor:
        ref: top_inner_sole
        shift: [0, -U]
      key:
        splay: 6
        origin: [0.5*U,-0.5*U]
        spread: -U
      columns:
        inner:
          key:
           splay: 0
        index:
          key:
           splay: 6.5
        middle:
        ring:
        pinky:
          key:
           splay: 3.5
        tab:
          # Tab (or maybe ctrl) on left (1.5U)
          key:
            asym: left
            splay: 0
            width: 1.5*u
            # Adjust as wide key:
            spread: -1.27*U
        quote:
          # Quote on right
          key:
           asym: right
           splay: 0
           # avoid dead space from ghost tab
           spread: 0.27*U
        enter:
          # Enter (or maybe backslash/pipe) on right (1.5U)
          key:
           asym: right
           splay: 0
           width: 1.5*u
           spread: -1.27*U
      rows:
        sole.padding: 1U
    bottom:
      anchor:
        ref: middle_inner_sole
        shift: [0, -U]
      key:
        splay: 7
        origin: [0.5*U,-0.5*U]
        spread: -U
      columns:
        inner:
          key:
           splay: 0
        index:
          key:
           splay: 7
        middle:
        ring:
        pinky:
          key:
           splay: 1
        outer:
          # ISO style ackslash/pipe or shift on left, maybe hyhen or shift on right?
          key:
           splay: 0
        outer2:
          # Maybe equals or layer on right?
          key:
           asym: right
           splay: 0
      rows:
        sole.padding: 1U
    thumbs:
      anchor:
        ref: bottom_inner_sole
        shift: [0.5*U, -U]
      columns:
        splayed:
          key:
           splay: -2
        tucked:
          key:
           splay: 7
           origin: [0.5*U,-0.5*U]
           spread: -U
      rows:
        sole.padding: 1U
`},qs=[eo],Ks=[Ws,Us],Xs=[Os,Fs,Ms,Ts,Gs],Ys=[Bs,Hs,Vs,Js],Zs=[{label:"Empty configurations",options:qs},{label:"Simple (points only)",options:Ks},{label:"Complete (with pcb)",options:Xs},{label:"Miscellaneous",options:Ys}],Qs=async o=>new Promise((t,s)=>{const i=new FileReader;i.onload=r=>{var a;(a=r.target)!=null&&a.result&&typeof r.target.result=="string"?t(r.target.result):s(new Error("Failed to read file as text"))},i.onerror=()=>s(new Error("Failed to read file")),i.readAsText(o)}),ea=async o=>{const s=o.name.toLowerCase().split(".").pop(),i=s==="zip"||s==="ekb";if(Kt(o.size,i),s==="yaml"||s==="yml"||s==="json")return{config:await Qs(o),footprints:[],outlines:[],templates:[]};if(i){const r=await o.arrayBuffer(),a=await Rr(r),c=a.injections.filter(l=>l.type==="footprint").map(l=>({name:l.name,content:l.content})),p=a.injections.filter(l=>l.type==="outline").map(l=>({name:l.name,content:l.content})),b=a.injections.filter(l=>l.type==="template").map(l=>({name:l.name,content:l.content}));return{config:a.config,footprints:c,outlines:p,templates:b}}else throw new Error("Unsupported file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")},to=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-github",viewBox:"0 0 98 96",children:e.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z",fill:"currentColor"})}),nn=()=>e.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 4.2333332 4.2333335",version:"1.1",fill:"currentColor",children:[e.jsxs("defs",{children:[e.jsxs("linearGradient",{id:"linearGradient6924-6",children:[e.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:0},offset:"0"}),e.jsx("stop",{offset:"0.49517274",style:{stopColor:"#ffffff",stopOpacity:.3}}),e.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:.3},offset:"1"})]}),e.jsx("linearGradient",{id:"linearGradient6918-3",x1:"42519.285",y1:"-7078.7891",x2:"42575.336",y2:"-6966.9307",gradientUnits:"userSpaceOnUse",href:"#linearGradient6924-6"})]}),e.jsxs("g",{transform:"matrix(0.06551432,0,0,0.06551432,-2.232417,-1.431776)",children:[e.jsx("path",{id:"path6733-5",style:{fontVariationSettings:"normal",opacity:1,vectorEffect:"none",fill:"url(#linearGradient6918-3)",fillOpacity:1,stroke:"none",strokeWidth:3.67846,strokeLinecap:"butt",strokeLinejoin:"miter",strokeMiterlimit:2,strokeDashoffset:0,strokeOpacity:1,paintOrder:"stroke markers fill",stopColor:"#000000",stopOpacity:1},d:"m 42519.285,-7078.7891 a 0.76086879,0.56791688 0 0 0 -0.738,0.6739 l 33.586,125.8886 a 87.182358,87.182358 0 0 0 39.381,-33.7636 l -71.565,-92.5196 a 0.76086879,0.56791688 0 0 0 -0.664,-0.2793 z",transform:"matrix(0.37058478,0,0,0.37058478,-15690.065,2662.0533)"}),e.jsx("path",{id:"path360787",style:{opacity:1,fill:"#ffffff",fillOpacity:1,strokeWidth:17.0055,paintOrder:"markers fill stroke",stopColor:"#000000"},d:"m 11249.461,-1883.6961 c -12.74,0 -23.067,10.3275 -23.067,23.0671 0,4.3335 1.22,8.5795 3.522,12.2514 l 19.232,-24.8636 c 0.138,-0.1796 0.486,-0.1796 0.624,0 l 19.233,24.8646 c 2.302,-3.6721 3.523,-7.9185 3.523,-12.2524 0,-12.7396 -10.327,-23.0671 -23.067,-23.0671 z",transform:"matrix(1.4006354,0,0,1.4006354,-15690.065,2662.0533)"})]})]}),rn=()=>e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 212 212",fill:"none",stroke:"currentColor",children:e.jsxs("g",{transform:"translate(6,6)",children:[e.jsx("path",{d:"M58 168 v-98 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),e.jsx("path",{d:"M58 168 v-30 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),e.jsx("circle",{cx:"142",cy:"20",r:"18",strokeWidth:"15"}),e.jsx("circle",{cx:"142",cy:"88",r:"18",strokeWidth:"15"}),e.jsx("circle",{cx:"58",cy:"180",r:"18",strokeWidth:"15"})]})}),oo=d.div`
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid ${n.colors.accent};
  width: 1.2rem;
  height: 1.2rem;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.5rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`,ta=d.div`
  background-color: ${n.colors.background};
  color: ${n.colors.white};
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: border-color 0.2s ease;

  ${o=>o.$isDragging&&`
    border: 3px dashed ${n.colors.accent};
    border-radius: 8px;
  `}
`,oa=d.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${o=>o.$isVisible?"flex":"none"};
  align-items: center;
  justify-content: center;
  z-index: 999;
  pointer-events: none;
`,na=d.div`
  background-color: ${n.colors.backgroundLight};
  border: 3px dashed ${n.colors.accent};
  border-radius: 8px;
  padding: 2rem;
  font-size: ${n.fontSizes.h3};
  color: ${n.colors.text};
  text-align: center;
`,ra=d.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 640px) {
    padding: 1rem 0.5rem;
  }
`,ia=d.h1`
  font-size: ${n.fontSizes.h1};
  text-align: center;
  margin-bottom: 1rem;
`,sa=d.p`
  font-size: ${n.fontSizes.lg};
  text-align: center;
  margin-bottom: 3rem;
  color: ${n.colors.textDark};
`,aa=d.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`,Ot=d.div`
  background-color: ${n.colors.backgroundLight};
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid ${n.colors.border};
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (max-width: 900px) {
    width: 100%;
    padding: 1.5rem 1rem;
  }

  @media (min-width: 901px) {
    max-width: 350px;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 1rem;
  }

  p {
    color: ${n.colors.textDarker};
    margin-bottom: 1.5rem;
    flex-grow: 1;
  }
`,la=d.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;

  button {
    flex-shrink: 0;
  }
`,ca=d.div`
  display: flex;
  align-items: stretch;
  flex: 1;
  min-width: 0;
  background-color: ${n.colors.backgroundLighter};
  border: 1px solid ${n.colors.border};
  border-radius: 6px;
  box-sizing: border-box;
  transition: border-color 0.15s ease-in-out;

  &:focus-within {
    border-color: ${n.colors.accent};
  }
`,da=d.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  user-select: none;
`,ua=d.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: transparent;
  border: none;
  padding: 0 0.5rem 0 0.75rem;
  cursor: pointer;
  height: 100%;
  color: ${n.colors.white};

  transition: background-color 0.15s ease-in-out;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;

  &:hover {
    background-color: ${n.colors.buttonHover};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  svg {
    width: 18px;
    height: 18px;
    display: block;
  }

  .material-symbols-outlined {
    font-size: 18px;
    color: ${n.colors.textDarker};
    display: block;
    margin-right: -0.15rem;
  }
`,pa=d.div`
  width: 1px;
  background-color: ${n.colors.border};
  margin: 0.75rem 0;
  flex-shrink: 0;
`,fa=d.input`
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  padding: 1rem 1rem 1rem 0.5rem;
  color: ${n.colors.text};
  font-family: ${n.fonts.body};
  font-size: ${n.fontSizes.base};
  outline: none;

  &::selection {
    background-color: ${n.colors.accent};
    color: ${n.colors.white};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`,ha=d.div`
  position: absolute;
  top: 105%;
  left: 0;
  background-color: ${n.colors.backgroundLight};
  border: 1px solid ${n.colors.border};
  border-radius: 6px;
  padding: 0.25rem 0;
  min-width: 130px;
  z-index: 105;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
`,Ft=d.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  font-size: ${n.fontSizes.bodySmall};
  color: ${({$active:o})=>o?n.colors.white:n.colors.textDark};
  background-color: ${({$active:o})=>o?n.colors.accent:"transparent"};
  cursor: pointer;

  &:hover {
    background-color: ${({$active:o})=>o?n.colors.accent:n.colors.backgroundLighter};
    color: ${n.colors.white};
  }

  svg {
    width: 16px;
    height: 16px;
    color: currentColor;
    display: block;
  }
`,ga=d(de)`
  aspect-ratio: 1 / 1;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 0 5px 5px 0;
  height: 100%;

  &:active {
    transform: none;
    outline: none;
  }

  svg,
  .material-symbols-outlined {
    display: block;
    font-size: 18px;
  }

  ${oo} {
    margin-right: 0;
  }
`,ma=d.input`
  display: none;
`,sn=d.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`,an=d.div`
  background-color: ${n.colors.backgroundLight};
  border-radius: 8px;
  border: 1px solid ${n.colors.border};
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
`,ba=d.img`
  width: 100%;
  height: 150px;
  object-fit: contain;
  padding: 8px;
  box-sizing: border-box;
  background-color: ${n.colors.backgroundLighter};
`,ln=d.div`
  padding: 1rem;
  font-weight: ${n.fontWeights.semiBold};
  text-align: center;
`,xa=d.div`
  width: 100%;
  height: 150px;
  padding: 8px;
  box-sizing: border-box;
  background-color: ${n.colors.backgroundLighter};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`,wa=d.div`
  width: 100%;
  height: 150px;
  box-sizing: border-box;
  background-color: ${n.colors.backgroundLighter};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${n.colors.textDarker};

  .material-symbols-outlined {
    font-size: 4rem;
  }
`,cn=Zs.flatMap(o=>o.options).filter(o=>o.label!=="Empty YAML configuration"),ya=()=>{const o=no(),t=we(),[s,i]=h.useState(""),[r,a]=h.useState("github"),[c,p]=h.useState(!1),[b,l]=h.useState(!1),f=c||b,[x,m]=h.useState(!1),y=h.useRef(null),[k,u]=h.useState(!1);h.useEffect(()=>{const w=O=>{y.current&&!y.current.contains(O.target)&&u(!1)};return document.addEventListener("mousedown",w),()=>document.removeEventListener("mousedown",w)},[]);const[g,_]=h.useState(!1),L=w=>{i(w),w.includes("github.com/")?a("github"):w.includes("codeberg.org/")?a("codeberg"):(w.startsWith("http://")||w.startsWith("https://")||w.includes("/")&&!w.includes("github.com/")&&!w.includes("codeberg.org/")&&w.split("/")[0].includes("."))&&a("forgejo")},{currentConflict:P,processInjectionsWithConflictResolution:E,handleConflictResolution:j,handleConflictCancel:S}=jt({setInjectionInput:w=>t==null?void 0:t.setInjectionInput(w),setConfigInput:w=>t==null?void 0:t.setConfigInput(w),generateNow:async(w,O,H)=>{t&&await t.generateNow(w,O,H)},getCurrentInjections:()=>(t==null?void 0:t.injectionInput)||[],onComplete:async()=>{m(!0)},setError:w=>t==null?void 0:t.setError(w)});h.useEffect(()=>{const w=new URLSearchParams(window.location.search),O=w.has("github")||w.has("codeberg")||w.has("forgejo")||w.has("gitea");(x||O)&&(t!=null&&t.configInput)&&(o("/"),m(!1))},[x,t==null?void 0:t.configInput,o]),h.useEffect(()=>{var w;(w=t==null?void 0:t.pruneDeletedConfigs)==null||w.call(t)},[t]);const $=async w=>{if(t){const O=w===eo.value;let H="unknown";if(O)H="empty_configuration";else{const B=cn.find(U=>U.value===w);B&&(H=B.label.toLowerCase().replace(/\s+/g,"_"))}V("example_loaded",{example_name:H,is_empty:O}),t.createNewConfig(w),await t.generateNow(w,t.injectionInput,{pointsonly:!1}),m(!0)}},I=async w=>{if(t){const O=t.configs.find(H=>H.id===w);O&&(t.selectConfig(w),V("saved_config_loaded",{config_name:O.name,config_id:O.id}),await t.generateNow(O.config,t.injectionInput,{pointsonly:!1}),m(!0))}},C=[...(t==null?void 0:t.configs)||[]].sort((w,O)=>new Date(O.updatedAt).getTime()-new Date(w.updatedAt).getTime()).slice(0,4),A=async(w,O,H,B,U=null,te)=>{if(!t)throw new Error("Configuration context not available");const ne=Rn(w,O,H);await E(ne,B,U,te)},M=async(w,O)=>{await j(w,O)},T=()=>{S(),p(!1),l(!1),t==null||t.setIsGenerating(!1)},W=()=>{if(!s||!t)return;const{setError:w,clearError:O,setIsGenerating:H}=t;l(!0),H(!0),O(),V("repo_loaded",{repo_url:s,provider:r});let B=s.trim();if(!B.includes("://")&&!B.includes("github.com")&&!B.includes("codeberg.org"))if(r==="codeberg")B=`https://codeberg.org/${B}`;else if(r==="forgejo"){const U=B.split("/");if(U.length>=2&&U[0].includes("."))B=`https://${B}`;else{w("Forgejo/Gitea requires a URL including the host (e.g., host/owner/repo)"),l(!1),H(!1);return}}else B=`https://github.com/${B}`;Nn(B).then(async U=>{if(t){U.rateLimitWarning&&w(U.rateLimitWarning);try{t.createNewConfig(U.config),await A(U.footprints,U.outlines,U.templates||[],U.config)}catch(te){throw new Error(`Failed to process footprints: ${te instanceof Error?te.message:"Unknown error"}`)}}}).catch(U=>{w(`Failed to load from ${r==="github"?"GitHub":r==="codeberg"?"Codeberg":"Forgejo/Gitea"} repository: ${U.message}`),t==null||t.setInfo(null),l(!1),H(!1)}).finally(()=>{l(!1)})},G=h.useRef(null),Y=()=>{var w;(w=G.current)==null||w.click()},q=async w=>{if(!t)return;const{setError:O,clearError:H,setIsGenerating:B}=t;p(!0),B(!0),H(),V("local_file_loaded",{file_name:w.name,file_type:w.type||"unknown",file_size:w.size});try{const U=await ea(w);t.createNewConfig(U.config),await A(U.footprints,U.outlines,U.templates||[],U.config)}catch(U){O(`Failed to load local file: ${U instanceof Error?U.message:"Unknown error"}`),t.setInfo(null),p(!1),B(!1)}finally{p(!1)}},ae=async w=>{var H;const O=(H=w.target.files)==null?void 0:H[0];O&&(w.target.value="",await q(O))},ue=w=>{w.preventDefault(),w.stopPropagation(),!f&&_(!0)},ee=w=>{w.preventDefault(),w.stopPropagation()},R=w=>{if(w.preventDefault(),w.stopPropagation(),f)return;const O=w.currentTarget,H=w.relatedTarget;(!H||!O.contains(H))&&_(!1)},F=async w=>{if(w.preventDefault(),w.stopPropagation(),f)return;_(!1);const O=Array.from(w.dataTransfer.files),H=[".yaml",".yml",".json",".zip",".ekb"],B=O.find(U=>{const te=U.name.toLowerCase();return H.some(ne=>te.endsWith(ne))});B?await q(B):O.length>0&&t&&t.setError("Invalid file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")};return e.jsxs(ta,{$isDragging:g,onDragEnter:ue,onDragOver:ee,onDragLeave:R,onDrop:F,"data-testid":"welcome-page-wrapper",children:[e.jsx(oa,{$isVisible:g,children:e.jsx(na,{children:"Drop file here to load configuration"})}),P&&e.jsx(_t,{injectionName:P.name,injectionType:P.type,onResolve:M,onCancel:T,"data-testid":"conflict-dialog"}),e.jsxs(ra,{children:[e.jsx(ia,{children:"Ergogen Web UI"}),e.jsxs(sa,{children:["A web-based interface for Ergogen, the ergonomic keyboard generator.",e.jsx("br",{}),"Start a new design below."]}),e.jsxs(aa,{children:[e.jsxs(Ot,{children:[e.jsx("h2",{children:"Start Fresh"}),e.jsx("p",{children:"Begin with a completely blank slate."}),e.jsx(de,{onClick:()=>$(eo.value),"aria-label":"Start with empty configuration","data-testid":"empty-config-button",children:"Empty Configuration"})]}),e.jsxs(Ot,{children:[e.jsx("h2",{children:"From Local File"}),e.jsx("p",{children:"Load a configuration from your computer. Supports *.yaml, *.json, *.zip, and *.ekb files."}),e.jsx(ma,{ref:G,type:"file",accept:".yaml,.yml,.json,.zip,.ekb",onChange:ae,disabled:f,"aria-label":"Select local file to load","data-testid":"local-file-input"}),e.jsx(de,{onClick:Y,disabled:f,"aria-label":"Select local file to load","data-testid":"local-file-button",children:c?e.jsxs(e.Fragment,{children:[e.jsx(oo,{})," Loading..."]}):"Choose File"})]}),e.jsxs(Ot,{children:[e.jsx("h2",{children:"From Repo"}),e.jsx("p",{children:'Link to a YAML config file on a Git provider (e.g. GitHub, Codeberg, Forgejo), or simply a repository name like "user/repo".'}),e.jsx(la,{children:e.jsxs(ca,{children:[e.jsxs(da,{ref:y,children:[e.jsxs(ua,{type:"button",onClick:()=>u(!k),disabled:f,"aria-label":"Repository provider source","data-testid":"repo-provider-trigger",children:[r==="github"?e.jsx(to,{}):r==="codeberg"?e.jsx(nn,{}):e.jsx(rn,{}),e.jsx("span",{className:"material-symbols-outlined",children:"arrow_drop_down"})]}),k&&e.jsxs(ha,{children:[e.jsxs(Ft,{$active:r==="github",onClick:()=>{a("github"),u(!1)},children:[e.jsx(to,{}),"GitHub"]}),e.jsxs(Ft,{$active:r==="codeberg",onClick:()=>{a("codeberg"),u(!1)},children:[e.jsx(nn,{}),"Codeberg"]}),e.jsxs(Ft,{$active:r==="forgejo",onClick:()=>{a("forgejo"),u(!1)},children:[e.jsx(rn,{}),"Forgejo"]})]})]}),e.jsx(pa,{}),e.jsx(fa,{placeholder:r==="forgejo"?"host/user/repo":"user/repo",value:s,onChange:w=>L(w.target.value),onKeyDown:w=>{w.key==="Enter"&&!f&&s.trim()!==""&&(w.preventDefault(),W())},disabled:f,"aria-label":"Repository URL or path","data-testid":"repo-input"}),e.jsx(ga,{onClick:W,disabled:f||!s,"aria-label":"Load configuration from repository","data-testid":"repo-load-button",children:b?e.jsx(oo,{}):e.jsx("span",{className:"material-symbols-outlined",style:{display:"block"},children:"cloud_download"})})]})})]})]}),C.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:n.fontSizes.h2},children:"Pick up where you left"}),e.jsx(sn,{style:{marginBottom:"3rem"},children:C.map(w=>e.jsxs(an,{onClick:()=>I(w.id),"aria-label":`Load ${w.name} configuration`,"data-testid":`saved-config-${w.name.toLowerCase().replace(/\s+/g,"-")}`,children:[w.previewSvg?e.jsx(xa,{dangerouslySetInnerHTML:{__html:w.previewSvg}}):e.jsx(wa,{children:e.jsx("span",{className:"material-symbols-outlined",children:"keyboard_off"})}),e.jsx(ln,{children:w.name})]},w.id))})]}),e.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:n.fontSizes.h2},children:"Or start from an example"}),e.jsx(sn,{children:cn.map(w=>e.jsxs(an,{onClick:()=>$(w.value),"aria-label":`Load ${w.label} example`,"data-testid":`example-${w.label.toLowerCase().replace(/\s+/g,"-")}`,children:[e.jsx(ba,{src:`/images/previews/${w.label.toLowerCase().replace(/[\s()]/g,"_")}.svg`,alt:`${w.label} preview`}),e.jsx(ln,{children:w.label})]},w.label))})]})]})},Vn=({versionInfo:o,"data-testid":t})=>{const[s,i]=h.useState(!1),r=h.useRef(null),a=()=>{r.current&&clearTimeout(r.current),i(!0)},c=()=>{r.current=setTimeout(()=>{i(!1)},250)},p=()=>{r.current&&clearTimeout(r.current)},b=()=>{r.current=setTimeout(()=>{i(!1)},250)},l=f=>{f.stopPropagation(),i(x=>!x)};return h.useEffect(()=>{if(!s)return;const f=()=>{i(!1)};return window.addEventListener("click",f),()=>{window.removeEventListener("click",f)}},[s]),h.useEffect(()=>()=>{r.current&&clearTimeout(r.current)},[]),e.jsxs(ka,{onMouseEnter:a,onMouseLeave:c,"data-testid":t,children:[e.jsx(va,{onClick:l,"data-testid":t&&`${t}-badge`,"aria-label":"Custom Ergogen version indicator",children:e.jsx("span",{className:"material-symbols-outlined",children:"science"})}),s&&e.jsxs(_a,{onMouseEnter:p,onMouseLeave:b,onClick:f=>f.stopPropagation(),"data-testid":t&&`${t}-popover`,children:[e.jsx(ja,{children:"Custom Ergogen Version"}),e.jsx($a,{children:"This website is running a custom version of Ergogen for development and preview purposes."}),e.jsxs(Ca,{href:o.url,target:"_blank",rel:"noopener noreferrer","data-testid":t&&`${t}-link`,children:[e.jsx("span",{children:o.label}),e.jsx("span",{className:"material-symbols-outlined open-icon",children:"open_in_new"})]})]})]})},ka=d.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  transform: translateY(-5px);
`,va=d.span`
  background-color: ${n.colors.accent};
  color: ${n.colors.white};
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  margin-left: 4px;
  width: 16px;
  height: 16px;
  line-height: 1;

  .material-symbols-outlined {
    font-size: 11px !important;
  }

  &:hover {
    background-color: ${n.colors.accentDark};
  }
`,_a=d.div`
  position: absolute;
  top: 100%;
  left: 4px;
  margin-top: 6px;
  background-color: ${n.colors.backgroundLight};
  border: 1px solid ${n.colors.border};
  border-radius: 6px;
  padding: 10px 12px;
  width: 240px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: default;
  text-align: left;
`,ja=d.div`
  font-size: 12px;
  font-weight: ${n.fontWeights.semiBold};
  color: ${n.colors.white};
`,$a=d.div`
  font-size: 11px;
  color: ${n.colors.textDark};
  line-height: 1.4;
`,Ca=d.a`
  font-size: 11px;
  color: ${n.colors.accent};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
  font-weight: ${n.fontWeights.semiBold};
  align-self: flex-start;
  word-break: break-all;

  .open-icon {
    font-size: 11px !important;
  }

  &:hover {
    color: ${n.colors.accentDark};
    text-decoration: underline;
  }
`,Sa=wt`
  0%   { box-shadow: 0 0 0 0   ${n.colors.accent}99; }
  70%  { box-shadow: 0 0 0 6px ${n.colors.accent}00; }
  100% { box-shadow: 0 0 0 0   ${n.colors.accent}00; }
`,Pa=wt`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`,Ea=d.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  height: 28px;
  background-color: ${n.colors.backgroundLight};
  border: 1px solid ${n.colors.border};
  border-radius: 6px;
  color: ${n.colors.white};
  font-size: 11px;
  font-weight: ${n.fontWeights.semiBold};
  cursor: pointer;
  white-space: nowrap;
  animation: ${Sa} ${o=>o.$isUpdating?"0.6s":"2s"}
    ease-out infinite;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  .material-symbols-outlined {
    font-size: 14px !important;
    ${o=>o.$isUpdating&&jn`
        animation: ${Pa} 1s linear infinite;
      `}
  }

  &:hover {
    background-color: ${n.colors.backgroundLighter};
  }

  &:disabled {
    cursor: default;
    background-color: ${n.colors.backgroundLight};
    opacity: 0.95;
  }
`,Ia=({onClick:o,"data-testid":t})=>{const[s,i]=h.useState(!1),r=()=>{i(!0),o()};return e.jsxs(Ea,{onClick:r,disabled:s,$isUpdating:s,"aria-label":s?"Updating version...":"Update available — click to reload and apply","data-testid":t??"update-chip",children:[e.jsx("span",{className:"material-symbols-outlined","aria-hidden":"true",children:s?"sync":"update"}),s?"Updating version...":"Update Available"]})},za=d.header`
  width: 100%;
  height: 3em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  background-color: ${n.colors.background};
  flex-shrink: 0;
  position: relative;
  z-index: 100;
  border-bottom: 1px solid ${n.colors.border};

  @media (max-width: 639px) {
    padding: 0 0.5rem;
    border-bottom: none;
  }
`,La=d.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: row;
  flex-grow: 1;
  min-width: 0;
  width: 100%;
`,Da=d.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,Aa=d.div`
  display: flex;
  align-items: center;
  gap: 6px;
`,Ra=d.div`
  font-size: ${n.fontSizes.base};
  font-weight: ${n.fontWeights.semiBold};
  color: ${n.colors.white};
  display: flex;
  align-items: center;
  @media (max-width: 639px) {
    display: none;
  }
`,$t=d.button`
  background-color: transparent;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  border: 1px solid ${n.colors.border};
  border-radius: 6px;
  color: ${n.colors.white};
  display: flex;
  align-items: center;
  padding: 8px 12px;
  text-decoration: none;
  cursor: pointer;
  font-size: ${n.fontSizes.bodySmall};
  line-height: 16px;
  gap: 6px;
  height: 34px;

  .material-symbols-outlined {
    font-size: ${n.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${n.colors.buttonHover};
  }
`,Na=d($t)`
  flex-shrink: 0;
`,Wa=d($t)`
  background-color: ${n.colors.accent};
  border-color: ${n.colors.accent};

  &:hover {
    background-color: ${n.colors.accentDark};
    border-color: ${n.colors.accentDarker};
  }

  @media (max-width: 375px) {
    display: none;
  }
`,Ua=d.span`
  @media (max-width: 510px) {
    display: none;
  }
`,dn=d($t)`
  @media (max-width: 475px) {
    display: none;
  }
`,Oa=d(Pn)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,Fa=d.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,Ba=({onUpdate:o})=>{const t=we(),s=no(),i=Sn(),{activeConfigId:r,activeConfigName:a,configs:c,isPreview:p,renameConfig:b,duplicateConfig:l,deleteConfig:f,savePreviewConfig:x}=t||{},[m,y]=h.useState(!1),[k,u]=h.useState(!1),[g,_]=h.useState(""),L=()=>{a&&r&&(_(a),u(!0))},P=W=>{W&&W.stopPropagation(),!(b&&r&&g.trim()&&!b(r,g.trim()))&&u(!1)},E=W=>{W&&W.stopPropagation(),u(!1)},j=W=>{W.key==="Enter"?P():W.key==="Escape"&&u(!1)},S=W=>{W.stopPropagation(),l&&r&&l(r)},$=W=>{W.stopPropagation(),r&&a&&f&&window.confirm(`Are you sure you want to delete "${a}"?`)&&(f(r),(c&&c.length<=1||r)&&s("/new"))},I=()=>{t==null||t.setShowSettings(!(t!=null&&t.showSettings))},v=()=>{t==null||t.setShowSettings(!1),t==null||t.selectConfig(null),s("/new")},C=()=>{var W,G,Y;!(t!=null&&t.results)||!(t!=null&&t.configInput)||t!=null&&t.isGenerating||t!=null&&t.isJscadConverting||(V("archive_single_downloaded",{has_injections:!!((W=t.injectionInput)!=null&&W.length),injections_count:((G=t.injectionInput)==null?void 0:G.length)||0,stored_configs_count:((Y=t.configs)==null?void 0:Y.length)||0}),Wn(t.results,t.configInput,t.injectionInput,t.debug,t.stlPreview))},A=()=>{var W,G;t!=null&&t.configInput&&(V("share_button_clicked",{has_injections:!!((W=t.injectionInput)!=null&&W.length),injections_count:((G=t.injectionInput)==null?void 0:G.length)||0}),y(!0))},M=()=>{t==null||t.setShowSideNav(!(t!=null&&t.showSideNav))},T=h.useMemo(()=>kt("github:ceoloide/ergogen#v4.3.0"),[]);return e.jsxs(e.Fragment,{children:[m&&e.jsx(Hn,{config:(t==null?void 0:t.configInput)||"",injections:(t==null?void 0:t.injectionInput)||[],onClose:()=>y(!1),"data-testid":"share-dialog"}),e.jsxs(za,{children:[e.jsxs(La,{children:[e.jsx(Na,{onClick:M,"aria-label":t!=null&&t.showSideNav?"Hide navigation panel":"Show navigation panel","data-testid":"side-nav-toggle-button",children:e.jsx("span",{className:"material-symbols-outlined",children:"side_navigation"})}),e.jsxs(Aa,{children:[e.jsx(Oa,{to:"/","aria-label":"Go to home page","data-testid":"logo-button",children:e.jsx(Fa,{src:"/ergogen.png",alt:"Ergogen logo"})}),e.jsxs(Ra,{children:["Ergogen",T.isCustom&&e.jsx(Vn,{versionInfo:T,"data-testid":"header-dev-chip"})]})]}),a&&e.jsxs(e.Fragment,{children:[e.jsx(Ta,{children:"/"}),e.jsxs(Ma,{"data-testid":"header-active-config-name",$isEditing:k,onClick:!k&&!p?L:void 0,children:[p&&e.jsx(Ha,{"data-testid":"header-shared-icon",children:e.jsx("span",{className:"material-symbols-outlined",children:"link"})}),k?e.jsxs(e.Fragment,{children:[e.jsx(Ga,{type:"text",value:g,onChange:W=>_(W.target.value),onBlur:P,onKeyDown:j,autoFocus:!0,"data-testid":"header-config-name-input","aria-label":"Edit configuration name"}),e.jsxs(Bt,{className:"header-actions-always-visible",children:[e.jsx(Te,{onMouseDown:W=>{W.preventDefault()},onClick:P,"aria-label":"Confirm rename","data-testid":"header-confirm-rename-btn",children:e.jsx("span",{className:"material-symbols-outlined",children:"check"})}),e.jsx(Te,{onMouseDown:W=>{W.preventDefault()},onClick:E,"aria-label":"Cancel rename","data-testid":"header-cancel-rename-btn",children:e.jsx("span",{className:"material-symbols-outlined",children:"close"})})]})]}):p?e.jsxs(e.Fragment,{children:[e.jsx(pn,{"data-testid":"header-config-name-text",children:a}),e.jsx(Bt,{className:"header-actions-always-visible",children:e.jsx(Te,{onClick:W=>{W.stopPropagation(),x==null||x()},"aria-label":"Save preview configuration","data-testid":"header-save-preview-btn",children:e.jsx("span",{className:"material-symbols-outlined",children:"save"})})})]}):e.jsxs(e.Fragment,{children:[e.jsx(pn,{title:"Click to rename","data-testid":"header-config-name-text",children:a}),e.jsxs(Bt,{className:"header-actions-hover",children:[e.jsx(Te,{onClick:L,"aria-label":"Rename configuration","data-testid":"header-rename-btn",children:e.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),e.jsx(un,{onClick:S,"aria-label":"Duplicate configuration","data-testid":"header-duplicate-btn",children:e.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),e.jsx(un,{onClick:$,"aria-label":"Delete configuration","data-testid":"header-delete-btn",children:e.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})]})]})]}),e.jsxs(Da,{children:[o&&e.jsx(Ia,{onClick:o,"data-testid":"header-update-chip"}),i.pathname==="/"&&e.jsxs(e.Fragment,{children:[e.jsxs(Wa,{onClick:v,"aria-label":"Start new configuration","data-testid":"new-config-button",children:[e.jsx("span",{className:"material-symbols-outlined",children:"add_2"}),e.jsx(Ua,{children:"New"})]}),e.jsx(dn,{onClick:C,disabled:(t==null?void 0:t.isGenerating)||(t==null?void 0:t.isJscadConverting),"aria-label":"Download archive of all generated files","data-testid":"header-download-outputs-button",children:e.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),e.jsx(dn,{onClick:A,disabled:!(t!=null&&t.configInput),"aria-label":"Share configuration","data-testid":"header-share-button",children:e.jsx("span",{className:"material-symbols-outlined",children:"share"})})]}),i.pathname!=="/new"&&e.jsx($t,{onClick:I,"aria-label":t!=null&&t.showSettings?"Hide settings panel":"Show settings panel","data-testid":"settings-button",children:e.jsx("span",{className:"material-symbols-outlined",children:t!=null&&t.showSettings?"keyboard_alt":"settings"})})]})]})]})},Ma=d.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
  height: 34px;
  border-radius: 6px;
  padding: 0 8px;
  transition:
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out;
  cursor: ${o=>o.$isEditing?"default":"pointer"};
  border: 1px solid
    ${o=>o.$isEditing?n.colors.accent:"transparent"};
  background-color: ${o=>o.$isEditing?n.colors.backgroundLight:"transparent"};
  width: 220px;
  box-sizing: border-box;

  &:hover {
    background-color: ${o=>o.$isEditing?n.colors.backgroundLight:n.colors.buttonHover};
    .header-actions-hover {
      opacity: 1;
    }
  }

  @media (max-width: 767px) {
    width: 160px;
    border-color: ${o=>o.$isEditing?n.colors.accent:n.colors.border};
  }
`,Bt=d.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s ease-in-out;
  margin-left: 4px;

  &.header-actions-always-visible {
    opacity: 1;
  }

  @media (max-width: 1023px) {
    opacity: 1;
  }
`,Te=d.button`
  background: none;
  border: none;
  color: ${n.colors.textDark};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  .material-symbols-outlined {
    font-size: 16px !important;
  }

  &:hover {
    background-color: ${n.colors.buttonHover};
    color: ${n.colors.white};
  }
`,un=d(Te)`
  @media (max-width: 767px) {
    display: none;
  }
`,Ta=d.span`
  color: ${n.colors.textDark};
  font-size: ${n.fontSizes.sm};
  font-weight: ${n.fontWeights.semiBold};
  user-select: none;
  @media (max-width: 639px) {
    display: none;
  }
`,pn=d.span`
  font-size: ${n.fontSizes.bodySmall};
  font-weight: ${n.fontWeights.semiBold};
  color: ${n.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  user-select: none;
`,Ga=d.input`
  background: transparent;
  border: none;
  color: ${n.colors.white};
  font-size: ${n.fontSizes.bodySmall};
  font-weight: ${n.fontWeights.semiBold};
  padding: 0;
  flex: 1;
  outline: none;
  height: 100%;
  min-width: 0;
`,Ha=d.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${n.colors.accent};
  color: ${n.colors.white};
  padding: 4px;
  border-radius: 4px;
  flex-shrink: 0;
  user-select: none;

  .material-symbols-outlined {
    font-size: 16px !important;
  }
`,Va=wt`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
`,Ja=d.div`
  position: fixed;
  top: 45px;
  left: 0;
  right: 0;
  width: 100%;
  height: 3px;
  background-color: transparent;
  overflow: hidden;
  z-index: 1000;
`,qa=d.div`
  height: 100%;
  width: 25%;
  background-color: ${n.colors.accent};
  animation: ${Va} 1.5s ease-in-out infinite;
`,Ka=({visible:o,"data-testid":t})=>o?e.jsx(Ja,{"data-testid":t,children:e.jsx(qa,{})}):null,dt={info:{background:n.colors.info,text:n.colors.infoDark},warning:{background:n.colors.warning,text:n.colors.warningDark},error:{background:n.colors.error,text:n.colors.errorDark},success:{background:n.colors.success,text:n.colors.successDark}},ut=d.span.attrs({className:"material-symbols-outlined"})`
  font-size: ${n.fontSizes.iconLarge};
  margin-right: 1rem;
`,pt=d.div`
  display: flex;
  align-items: center;
`,ft=d.p`
  margin: 0;
`,ht=d.div`
  padding: 1rem 1.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: ${({type:o})=>dt[o].text};
  background-color: ${({type:o})=>dt[o].background};
  border: 1px solid ${({type:o})=>dt[o].text};

  .material-symbols-outlined {
    color: ${({type:o})=>dt[o].text};
  }
`,Xa=d.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 800px;
  padding: 0 1rem;
`,gt=d.button`
  background: none;
  border: none;
  color: inherit;
  font-size: ${n.fontSizes.h3};
  cursor: pointer;
  padding: 0;
  line-height: 1;
  margin-left: auto;
  padding-left: 1rem;
`,Ya=()=>{const o=we();if(!o)return null;const{error:t,deprecationWarning:s,skippedWarning:i,info:r,clearError:a,clearWarning:c,clearSkippedWarning:p,clearInfo:b}=o;return e.jsxs(Xa,{"data-testid":"banners-container",children:[r&&e.jsxs(ht,{type:"info","data-testid":"info-banner",children:[e.jsxs(pt,{children:[e.jsx(ut,{children:"info"}),e.jsx(ft,{children:r})]}),e.jsx(gt,{onClick:b,"aria-label":"Close info message","data-testid":"close-info-banner",children:"×"})]}),s&&e.jsxs(ht,{type:"warning","data-testid":"warning-banner",children:[e.jsxs(pt,{children:[e.jsx(ut,{children:"warning"}),e.jsx(ft,{children:s})]}),e.jsx(gt,{onClick:c,"aria-label":"Close warning message","data-testid":"close-warning-banner",children:"×"})]}),i&&e.jsxs(ht,{type:"warning","data-testid":"skipped-injections-banner",children:[e.jsxs(pt,{children:[e.jsx(ut,{children:"warning"}),e.jsx(ft,{children:i})]}),e.jsx(gt,{onClick:p,"aria-label":"Close feature warning message","data-testid":"close-skipped-banner",children:"×"})]}),t&&e.jsxs(ht,{type:"error","data-testid":"error-banner",children:[e.jsxs(pt,{children:[e.jsx(ut,{children:"error"}),e.jsx(ft,{children:t})]}),e.jsx(gt,{onClick:a,"aria-label":"Close error message","data-testid":"close-error-banner",children:"×"})]})]})},Za=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-discord",viewBox:"0 0 16 16",children:e.jsx("path",{d:"M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"})}),fn=({label:o,version:t,url:s,isCustom:i=!1,"data-testid":r,devBadgeTestId:a})=>{const c=()=>{window.open(s,"_blank","noopener,noreferrer")};return e.jsxs(Qa,{onClick:c,$hasDevBadge:i,"aria-label":`View ${o==="Ergogen"?"Ergogen":`Ergogen ${o}`} ${t} on GitHub`,"data-testid":r,children:[e.jsx(to,{}),e.jsxs(el,{children:[e.jsx(tl,{children:o}),e.jsx(ol,{$isCustom:i,children:t})]}),i&&e.jsx(nl,{"data-testid":a,children:e.jsx(rl,{children:"DEV"})})]})},Qa=d.button`
  background-color: transparent;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  border: 1px solid ${n.colors.border};
  border-radius: 6px;
  color: ${n.colors.white};
  display: flex;
  align-items: center;
  padding: 8px ${o=>o.$hasDevBadge?"22px":"10px"} 8px 10px;
  text-decoration: none;
  cursor: pointer;
  height: 34px;
  position: relative;
  flex: 0 0 auto;
  gap: 6px;

  svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }

  &:hover {
    background-color: ${n.colors.buttonHover};
  }
`,el=d.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  line-height: 1.1;
  min-width: 0;
`,tl=d.span`
  font-size: 10px;
  font-weight: ${n.fontWeights.bold};
  color: ${n.colors.white};
  white-space: nowrap;
`,ol=d.span`
  font-size: 8px;
  color: ${o=>o.$isCustom?n.colors.accent:n.colors.textDark};
  white-space: nowrap;
`,nl=d.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 16px;
  background-color: ${n.colors.backgroundLighter};
  border-left: 1px solid ${n.colors.border};
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
`,rl=d.span`
  font-size: 8px;
  font-weight: ${n.fontWeights.bold};
  color: ${n.colors.accent};
  transform: rotate(-90deg);
  white-space: nowrap;
  line-height: 1;
`,il=({isOpen:o,onClose:t,"data-testid":s})=>{const i=h.useRef(o),[r,a]=h.useState(o),[c,p]=h.useState(360),b=h.useRef(!1),l=h.useRef(0),f=h.useRef(360),x=we(),m=no(),y=yt.version,{configs:k,activeConfigId:u,selectConfig:g,renameConfig:_,duplicateConfig:L,deleteConfig:P,setIsBulkDownloadOpen:E}=x||{},[j,S]=h.useState(""),[$,I]=h.useState(null),[v,C]=h.useState(""),A=h.useMemo(()=>{if(!k)return[];let R=k;if(j.trim()){const F=j.toLowerCase().split(/\s+/).filter(Boolean);F.length>0&&(R=k.filter(w=>{const O=w.name.toLowerCase();return F.some(H=>O.includes(H))}))}return[...R].sort((F,w)=>{const O=F.updatedAt?new Date(F.updatedAt).getTime():0,H=w.updatedAt?new Date(w.updatedAt).getTime():0;if(O!==H)return H-O;const B=F.createdAt?new Date(F.createdAt).getTime():0,U=w.createdAt?new Date(w.createdAt).getTime():0;return B!==U?U-B:F.name.localeCompare(w.name)})},[k,j]),M=()=>{g&&g(null),m("/new"),t()},T=()=>{V("bulk_download_dialog_opened",{stored_configs_count:(k==null?void 0:k.length)||0}),E&&E(!0),t()},W=R=>{g&&(g(R),m("/"),t())},G=(R,F)=>{I(R),C(F)},Y=R=>{_&&v.trim()&&!_(R,v.trim())||I(null)},q=R=>{L&&L(R)},ae=(R,F)=>{if(window.confirm(`Are you sure you want to delete "${F}"?`)&&P){P(R);const w=u===R,O=k&&k.length<=1;(w||O)&&(m("/new"),t())}};h.useEffect(()=>{const R=i.current;o&&!R?a(!0):!o&&R&&a(!1),o||I(null),i.current=o},[o]),h.useEffect(()=>{if(!j.trim())return;const R=setTimeout(()=>{V("search_performed",{query_length:j.trim().length})},1e3);return()=>clearTimeout(R)},[j]),h.useEffect(()=>{const R=H=>{if(!b.current)return;const B=H.clientX-l.current,U=f.current+B,te=Math.min(600,window.innerWidth*.9),ne=Math.max(360,Math.min(U,te));p(ne)},F=()=>{b.current&&(b.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},w=H=>{if(!b.current)return;H.preventDefault();const U=H.touches[0].clientX-l.current,te=f.current+U,ne=Math.min(600,window.innerWidth*.9),Z=Math.max(360,Math.min(te,ne));p(Z)},O=()=>{b.current&&(b.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",R),window.addEventListener("mouseup",F),window.addEventListener("touchmove",w,{passive:!1}),window.addEventListener("touchend",O),()=>{window.removeEventListener("mousemove",R),window.removeEventListener("mouseup",F),window.removeEventListener("touchmove",w),window.removeEventListener("touchend",O)}},[]);const ue=R=>{R.preventDefault(),R.stopPropagation(),b.current=!0,f.current=c,"touches"in R?l.current=R.touches[0].clientX:l.current=R.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};h.useEffect(()=>{if(!o)return;const R=F=>{F.key==="Escape"&&t()};return window.addEventListener("keydown",R),()=>{window.removeEventListener("keydown",R)}},[o,t]);const ee=h.useMemo(()=>kt("github:ceoloide/ergogen#v4.3.0"),[]);return h.useEffect(()=>(o?document.body.style.overflow="hidden":document.body.style.overflow="",()=>{document.body.style.overflow=""}),[o]),e.jsxs(e.Fragment,{children:[e.jsx(sl,{"data-testid":s,onClick:t,$isOpen:o,$isOpening:r}),e.jsxs(al,{"data-testid":s&&`${s}-panel`,$isOpen:o,$isOpening:r,$width:c,onClick:R=>R.stopPropagation(),children:[e.jsx(Ll,{onMouseDown:ue,onTouchStart:ue,"data-testid":s&&`${s}-resize-handle`}),e.jsxs(ll,{children:[e.jsxs(cl,{children:[e.jsx(dl,{to:"/",onClick:t,"aria-label":"Go to home page","data-testid":"side-nav-logo-button",children:e.jsx(ul,{src:"/ergogen.png",alt:"Ergogen logo"})}),e.jsxs(pl,{onClick:t,children:["Ergogen",ee.isCustom&&e.jsx(Vn,{versionInfo:ee,"data-testid":"sidebar-dev-chip"})]})]}),e.jsx(fl,{onClick:t,"data-testid":s&&`${s}-close`,"aria-label":"Close navigation panel",children:e.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),e.jsxs(hl,{children:[e.jsxs(gl,{children:[e.jsxs(ml,{onClick:M,"aria-label":"New","data-testid":"side-nav-new-config-button",children:[e.jsx("span",{className:"material-symbols-outlined",children:"add"}),e.jsx("span",{children:"New"})]}),k&&k.length>0&&e.jsxs(bl,{onClick:T,"aria-label":"Download All","data-testid":"side-nav-download-all-button",children:[e.jsx("span",{className:"material-symbols-outlined",children:"download"}),e.jsx("span",{children:"Download All"})]})]}),e.jsxs(xl,{children:[e.jsx("span",{className:"material-symbols-outlined search-icon",children:"search"}),e.jsx(wl,{type:"text",placeholder:"Search configurations...",value:j,onChange:R=>S(R.target.value),"aria-label":"Search configurations"}),j&&e.jsx(yl,{onClick:()=>S(""),children:e.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),e.jsxs(kl,{children:[e.jsx("span",{children:"Saved Configurations"}),e.jsx(vl,{children:A.length})]}),e.jsxs(_l,{children:[A.map(R=>{const F=R.id===u,w=$===R.id;return e.jsx(jl,{$isActive:F,"data-testid":`config-item-${R.id}`,children:w?e.jsxs(Sl,{onSubmit:O=>{O.preventDefault(),Y(R.id)},children:[e.jsx(Pl,{type:"text",value:v,onChange:O=>C(O.target.value),autoFocus:!0,"aria-label":"Rename input"}),e.jsx(hn,{type:"submit","aria-label":"Save name",children:e.jsx("span",{className:"material-symbols-outlined",children:"check"})}),e.jsx(hn,{type:"button",onClick:()=>I(null),"aria-label":"Cancel rename",children:e.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}):e.jsxs(e.Fragment,{children:[e.jsxs($l,{onClick:()=>W(R.id),$isActive:F,title:R.name,children:[e.jsx("span",{className:"material-symbols-outlined",children:"description"}),e.jsx("span",{className:"config-title-text",children:R.name})]}),e.jsxs(Cl,{$isActive:F,children:[e.jsx(Mt,{onClick:()=>G(R.id,R.name),"aria-label":`Rename configuration ${R.name}`,children:e.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),e.jsx(Mt,{onClick:()=>q(R.id),"aria-label":`Duplicate configuration ${R.name}`,children:e.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),e.jsx(Mt,{onClick:()=>ae(R.id,R.name),"aria-label":`Delete configuration ${R.name}`,children:e.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})},R.id)}),A.length===0&&e.jsx(El,{children:"No configurations found"})]})]}),e.jsx(Il,{children:e.jsxs(zl,{children:[e.jsxs(gn,{onClick:()=>{window.open("https://docs.ergogen.xyz/","_blank","noopener,noreferrer")},"aria-label":"Open documentation","data-testid":"side-nav-docs-button",children:[e.jsx("span",{className:"material-symbols-outlined",children:"description"}),e.jsx("span",{children:"Docs"})]}),e.jsx(gn,{onClick:()=>{window.open("https://discord.ergogen.xyz","_blank","noopener,noreferrer")},"aria-label":"Join the Discord community","data-testid":"side-nav-discord-button",children:e.jsx(Za,{})}),e.jsx(fn,{label:"Web UI",version:y,url:"https://github.com/ceoloide/ergogen-gui","data-testid":"side-nav-gui-version-button"}),e.jsx(fn,{label:"Ergogen",version:ee.displayText,url:ee.url,isCustom:ee.isCustom,"data-testid":"side-nav-ergogen-version-button",devBadgeTestId:"side-nav-ergogen-dev-badge"})]})})]})]})},sl=d.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
  opacity: ${o=>o.$isOpen?1:0};
  transition: opacity ${o=>o.$isOpening?"0.2s":"0.1s"}
    ease-in-out;
  pointer-events: ${o=>o.$isOpen?"auto":"none"};
`,al=d.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: ${o=>o.$width}px;
  max-width: min(600px, 90vw);
  background-color: ${n.colors.backgroundLight};
  border-right: 1px solid ${n.colors.border};
  box-shadow: ${o=>o.$isOpen?"4px 0 20px rgba(0, 0, 0, 0.5)":"none"};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transform: translateX(${o=>o.$isOpen?"0":"-100%"});
  transition:
    transform ${o=>o.$isOpening?"0.2s":"0.1s"} ease-in-out,
    box-shadow ${o=>o.$isOpening?"0.2s":"0.1s"} ease-in-out;

  @media (max-width: 639px) {
    width: 100%;
    max-width: 100%;
  }
`,ll=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 3em;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
`,cl=d.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`,dl=d(Pn)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,ul=d.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,pl=d.div`
  font-size: ${n.fontSizes.base};
  font-weight: ${n.fontWeights.semiBold};
  color: ${n.colors.white};
  cursor: pointer;
  display: flex;
  align-items: center;
`,fl=d.button`
  background: none;
  border: none;
  color: ${n.colors.textDark};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition:
    background-color 0.15s ease-in-out,
    color 0.15s ease-in-out;
  flex-shrink: 0;

  .material-symbols-outlined {
    font-size: ${n.fontSizes.iconLarge};
  }

  &:hover {
    background-color: ${n.colors.buttonHover};
    color: ${n.colors.text};
  }
`,hl=d.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`,gl=d.div`
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
  flex-shrink: 0;
`,ml=d.button`
  flex: 1;
  background-color: ${n.colors.accent};
  color: ${n.colors.white};
  border: none;
  border-radius: 6px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: ${n.fontSizes.bodySmall};
  font-weight: ${n.fontWeights.regular};
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
  padding: 0 6px;

  .material-symbols-outlined {
    font-size: 20px;
  }

  &:hover {
    background-color: ${n.colors.accentDark};
  }
`,bl=d.button`
  flex: 1;
  background-color: transparent;
  color: ${n.colors.white};
  border: 1px solid ${n.colors.border};
  border-radius: 6px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: ${n.fontSizes.bodySmall};
  font-weight: ${n.fontWeights.regular};
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
  padding: 0 6px;

  .material-symbols-outlined {
    font-size: 20px;
  }

  &:hover {
    background-color: ${n.colors.buttonHover};
  }
`,xl=d.div`
  position: relative;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  .search-icon {
    position: absolute;
    left: 8px;
    color: ${n.colors.textDark};
    pointer-events: none;
    font-size: 18px;
  }
`,wl=d.input`
  width: 100%;
  background-color: ${n.colors.backgroundLighter};
  border: 1px solid ${n.colors.border};
  border-radius: 6px;
  height: 36px;
  padding: 0 34px;
  color: ${n.colors.white};
  font-size: ${n.fontSizes.bodySmall};

  &:focus {
    outline: none;
    border-color: ${n.colors.accent};
  }
`,yl=d.button`
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: ${n.colors.textDark};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;

  .material-symbols-outlined {
    font-size: 16px;
  }

  &:hover {
    color: ${n.colors.white};
  }
`,kl=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: ${n.fontSizes.bodySmall};
  color: ${n.colors.textDark};
  font-weight: ${n.fontWeights.semiBold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
`,vl=d.span`
  background-color: ${n.colors.border};
  color: ${n.colors.white};
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: ${n.fontWeights.semiBold};
`,_l=d.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  flex: 1;
`,jl=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  background-color: transparent;
  border: 1px solid
    ${o=>o.$isActive?n.colors.accent:"transparent"};
  padding: 2px 6px;
  height: 38px;
  min-width: 0;
  flex-shrink: 0;

  &:hover {
    background-color: ${n.colors.buttonHover};

    /* Show action buttons on hover */
    .item-actions-hover {
      opacity: 1;
    }
  }
`,$l=d.button`
  flex: 1;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${o=>o.$isActive?n.colors.white:n.colors.textDark};
  font-weight: ${o=>o.$isActive?n.fontWeights.semiBold:n.fontWeights.regular};
  font-size: ${n.fontSizes.bodySmall};
  text-align: left;
  cursor: pointer;
  min-width: 0;
  padding: 0;
  height: 100%;

  .material-symbols-outlined {
    font-size: 18px;
    color: ${o=>o.$isActive?n.colors.accent:n.colors.textDark};
  }

  .config-title-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    color: ${n.colors.white};
  }
`,Cl=d.div.attrs({className:"item-actions-hover"})`
  display: flex;
  gap: 4px;
  opacity: ${o=>o.$isActive?1:0};
  transition: opacity 0.15s ease-in-out;

  @media (max-width: 1023px) {
    opacity: 1;
  }
`,Mt=d.button`
  background: none;
  border: none;
  color: ${n.colors.textDark};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  .material-symbols-outlined {
    font-size: 16px;
  }

  &:hover {
    background-color: ${n.colors.border};
    color: ${n.colors.white};
  }
`,Sl=d.form`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 100%;
`,Pl=d.input`
  flex: 1;
  background: transparent;
  border: none;
  height: 100%;
  padding: 0;
  color: ${n.colors.white};
  font-size: ${n.fontSizes.bodySmall};
  font-weight: ${n.fontWeights.semiBold};

  &:focus {
    outline: none;
  }
`,hn=d.button`
  background: none;
  border: none;
  color: ${n.colors.textDark};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  .material-symbols-outlined {
    font-size: 18px;
  }

  &:hover {
    color: ${n.colors.white};
  }
`,El=d.div`
  text-align: center;
  color: ${n.colors.textDark};
  font-size: ${n.fontSizes.bodySmall};
  margin-top: 2rem;
  font-style: italic;
`,Il=d.div`
  padding: 8px 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`,zl=d.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  width: 100%;
`,gn=d.button`
  background-color: transparent;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  border: 1px solid ${n.colors.border};
  border-radius: 6px;
  color: ${n.colors.white};
  display: flex;
  align-items: center;
  padding: 8px 12px;
  text-decoration: none;
  cursor: pointer;
  font-size: ${n.fontSizes.bodySmall};
  line-height: 16px;
  gap: 6px;
  height: 34px;

  .material-symbols-outlined {
    font-size: ${n.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${n.colors.buttonHover};
  }
`,Ll=d.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 4px;
  height: 100%;
  cursor: col-resize;
  z-index: 1001;
  background-color: transparent;
  transition: background-color 0.15s ease-in-out;

  &:hover {
    background-color: ${n.colors.accent};
  }

  @media (max-width: 639px) {
    display: none;
  }
`,Dl=({isOpen:o,configs:t,injections:s,debug:i,stlPreview:r,onClose:a,"data-testid":c})=>{const[p,b]=h.useState(new Set),[l,f]=h.useState(!0),[x,m]=h.useState(!1),[y,k]=h.useState(0),[u,g]=h.useState(""),_=h.useRef(!1);if(h.useEffect(()=>{o&&(b(new Set(t.map($=>$.id))),m(!1),k(0),g(""),_.current=!1)},[o,t]),!o)return null;const L=$=>{b($?new Set(t.map(I=>I.id)):new Set)},P=($,I)=>{const v=new Set(p);I?v.add($):v.delete($),b(v)},E=async()=>{if(p.size===0)return;m(!0),k(0),g(""),_.current=!1;const $=t.filter(I=>p.has(I.id));V("bulk_download_started",{selected_configs_count:p.size,only_configs:l});try{await Yr($,s,i,r,l,(I,v,C)=>{k(I),g(C)},()=>_.current)}catch(I){console.error("Error during bulk download:",I)}finally{_.current||a()}},j=()=>{_.current=!0,a()},S=p.size>0?y/p.size*100:0;return e.jsx(Al,{"data-testid":c,children:e.jsxs(Rl,{"data-testid":c&&`${c}-box`,children:[e.jsx(Nl,{children:"Download Configurations"}),x?e.jsxs(e.Fragment,{children:[e.jsxs(Xl,{children:[e.jsx(Yl,{children:e.jsx(Zl,{style:{width:`${S}%`}})}),e.jsxs(Ql,{children:[e.jsx(ec,{children:u?u.includes(", ")?e.jsxs("div",{children:["Generating:",e.jsx(tc,{children:u.split(", ").map($=>e.jsx("li",{children:$},$))})]}):e.jsxs(xn,{children:["Generating ",u]}):e.jsx(xn,{children:"Preparing..."})}),e.jsxs(oc,{children:[y," / ",p.size]})]})]}),e.jsx(bn,{children:e.jsx(nc,{onClick:j,size:"medium",children:"Cancel"})})]}):e.jsxs(e.Fragment,{children:[e.jsx(Ul,{children:t.map($=>{const I=p.has($.id);return e.jsx(Ol,{children:e.jsxs(Jn,{htmlFor:`bulk-check-${$.id}`,children:[e.jsx(Bl,{id:`bulk-check-${$.id}`,checked:I,onChange:v=>P($.id,v.target.checked)}),e.jsx(Ml,{$checked:I}),e.jsx(Fl,{children:$.name})]})},$.id)})}),e.jsxs(Wl,{children:[e.jsx(mn,{onClick:()=>L(!0),children:"Select All"}),e.jsx(mn,{onClick:()=>L(!1),children:"Deselect All"})]}),e.jsxs(Tl,{children:[e.jsx(Gl,{children:"Only download configs"}),e.jsxs(Hl,{$checked:l,htmlFor:"only-configs-switch",children:[e.jsx(Vl,{type:"checkbox",id:"only-configs-switch",checked:l,onChange:$=>f($.target.checked)}),e.jsx(Jl,{$checked:l}),e.jsx(ql,{$checked:l})]})]}),!l&&e.jsxs(Kl,{children:[e.jsx("span",{className:"material-symbols-outlined",children:"warning"}),e.jsx("span",{children:"Warning: Exporting generated outputs for multiple configurations may take a long time depending on the number of selected configurations, their complexity, and CPU speed."})]}),e.jsxs(bn,{children:[e.jsx(qn,{onClick:j,size:"medium",children:"Cancel"}),e.jsxs(de,{onClick:E,disabled:p.size===0,size:"medium",children:["Download (",p.size,")"]})]})]})]})})},Al=d.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`,Rl=d.div`
  background-color: ${n.colors.backgroundLight};
  border: 1px solid ${n.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,Nl=d.h2`
  margin: 0 0 1rem 0;
  font-size: ${n.fontSizes.h3};
  color: ${n.colors.text};
`,Wl=d.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 1.5rem;
`,mn=d.button`
  background: none;
  border: none;
  color: ${n.colors.textDark};
  font-size: 11px;
  font-weight: ${n.fontWeights.regular};
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${n.colors.border};
    color: ${n.colors.white};
  }
`,Ul=d.div`
  border: 1px solid ${n.colors.border};
  background-color: ${n.colors.background};
  border-radius: 6px;
  padding: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
`,Ol=d.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,Fl=d.span`
  color: ${n.colors.text};
  font-size: 13px;
  user-select: none;
`,Jn=d.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  padding: 4px 0;
`,Bl=d.input.attrs({type:"checkbox"})`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`,Ml=d.div`
  width: 16px;
  height: 16px;
  background-color: ${o=>o.$checked?n.colors.accent:"transparent"};
  border: 2px solid
    ${o=>o.$checked?n.colors.accent:n.colors.border};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  flex-shrink: 0;

  &::after {
    content: '';
    display: ${o=>o.$checked?"block":"none"};
    width: 3px;
    height: 6px;
    border: solid ${n.colors.white};
    border-width: 0 2px 2px 0;
    transform: rotate(45deg) translate(-0.5px, -1px);
  }

  ${Jn}:hover & {
    border-color: ${n.colors.accent};
  }
`,Tl=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
`,Gl=d.span`
  color: ${n.colors.text};
  font-size: ${n.fontSizes.base};
  user-select: none;
`,Hl=d.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: pointer;
`,Vl=d.input`
  opacity: 0;
  width: 0;
  height: 0;
`,Jl=d.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${o=>o.$checked?n.colors.accent:n.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`,ql=d.span`
  position: absolute;
  top: 2px;
  left: ${o=>o.$checked?"18px":"2px"};
  width: 16px;
  height: 16px;
  background-color: ${n.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,Kl=d.div`
  background-color: ${n.colors.warning};
  border: 1px solid ${n.colors.warningDark};
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: ${n.colors.warningDark};
  font-size: 13px;
  line-height: 1.4;

  .material-symbols-outlined {
    font-size: 18px;
    flex-shrink: 0;
    margin-top: 1px;
    color: ${n.colors.warningDark};
  }
`,bn=d.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: auto;
`,Xl=d.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`,Yl=d.div`
  background-color: ${n.colors.border};
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  width: 100%;
`,Zl=d.div`
  background-color: ${n.colors.accent};
  height: 100%;
  transition: width 0.15s ease-out;
`,Ql=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`,ec=d.div`
  color: ${n.colors.text};
  max-width: 80%;
`,xn=d.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,tc=d.ul`
  margin: 4px 0 0 16px;
  padding: 0;
  list-style-type: disc;
  color: ${n.colors.textDark};
  font-size: 13px;
  text-align: left;
  max-height: 80px;
  overflow-y: auto;

  li {
    margin-bottom: 2px;
  }
`,oc=d.span`
  color: ${n.colors.textDark};
  font-weight: ${n.fontWeights.semiBold};
`,qn=d(de)`
  background-color: ${n.colors.backgroundLighter};
  color: ${n.colors.textDark};

  &:hover {
    background-color: ${n.colors.buttonHover};
  }
`,nc=d(qn)`
  width: 100%;
`;function rc(){return!!(window.location.hostname==="localhost"||window.location.hostname==="[::1]"||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))}function ic(o,t,s){o.addEventListener("statechange",()=>{var i,r;o.state==="installed"&&(navigator.serviceWorker.controller?(console.log("[SW] New content is available. Will be used when all existing tabs are closed or you reload."),(i=s==null?void 0:s.onUpdate)==null||i.call(s,t)):(console.log("[SW] Content is cached for offline use."),(r=s==null?void 0:s.onSuccess)==null||r.call(s,t)))})}async function Kn(o,t){try{const s=await navigator.serviceWorker.register(o);s.addEventListener("updatefound",()=>{const i=s.installing;i!==null&&ic(i,s,t)})}catch(s){console.error("[SW] Error during service worker registration:",s)}}async function sc(o,t){try{const s=await fetch(o,{headers:{"Service-Worker":"script"}}),i=s.headers.get("content-type");s.status===404||i!==null&&i.indexOf("javascript")===-1?(await(await navigator.serviceWorker.ready).unregister(),window.location.reload()):await Kn(o,t)}catch{console.log("[SW] No internet connection found. App is running in offline mode.")}}function ac(o){!("serviceWorker"in navigator)||new URL("/",window.location.href).origin!==window.location.origin||window.addEventListener("load",()=>{const s="/service-worker.js";rc()?(sc(s,o),navigator.serviceWorker.ready.then(()=>{console.log("[SW] This web app is being served cache-first by a service worker. See https://cra.link/PWA for more details.")})):Kn(s,o)})}const lc=({report:o,onAccept:t,onCancel:s,"data-testid":i})=>e.jsx(cc,{"data-testid":i,children:e.jsxs(dc,{"data-testid":i&&`${i}-box`,children:[e.jsx(uc,{children:"Version Compatibility Warning"}),e.jsx(pc,{children:"The shared link was created under a different environment. You may experience compatibility issues."}),e.jsxs(fc,{children:[o.guiWarning&&e.jsxs(Tt,{"data-testid":i&&`${i}-gui-warning`,children:[e.jsxs(Gt,{children:["GUI Version Mismatch",e.jsx(Ht,{"data-testid":"gui-mismatch-badge",children:"Mismatch"})]}),e.jsxs(Vt,{children:["The shared link was created with a newer version of the GUI (",e.jsxs("strong",{children:["v",o.guiWarning.shared]}),") than your current version (",e.jsxs("strong",{children:["v",o.guiWarning.current]}),"). Some interface options or features may not function as expected."]})]}),o.ergogenWarning&&e.jsxs(Tt,{"data-testid":i&&`${i}-ergogen-warning`,children:[e.jsxs(Gt,{children:["Ergogen Version Mismatch",e.jsx(Ht,{"data-testid":"ergogen-mismatch-badge",children:"Mismatch"})]}),e.jsxs(Vt,{children:["The shared link was created with a newer version of Ergogen (",e.jsx("strong",{children:o.ergogenWarning.shared}),") than your current version (",e.jsx("strong",{children:o.ergogenWarning.current}),"). Some features or syntax might not be supported."]})]}),o.customErgogenWarning&&e.jsxs(Tt,{"data-testid":i&&`${i}-custom-ergogen-warning`,children:[e.jsxs(Gt,{children:["Custom Ergogen Version Used",e.jsx(Ht,{"data-testid":"custom-version-badge",children:"Custom"})]}),e.jsxs(Vt,{children:["The shared link was created using a custom version of Ergogen:"," ",e.jsx("strong",{children:o.customErgogenWarning.shared}),".",e.jsx("br",{}),"You can investigate the repository used here:",e.jsx("br",{}),e.jsx(hc,{href:o.customErgogenWarning.url,target:"_blank",rel:"noopener noreferrer","data-testid":i&&`${i}-custom-repo-link`,children:o.customErgogenWarning.label})]})]})]}),e.jsxs(gc,{children:[e.jsx(bc,{onClick:s,size:"medium","data-testid":i&&`${i}-cancel`,"aria-label":"Cancel configuration loading",children:"Cancel"}),e.jsx(mc,{onClick:t,size:"medium","data-testid":i&&`${i}-accept`,"aria-label":"Accept and load configuration",children:"Accept and Load"})]})]})}),cc=d.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`,dc=d.div`
  background-color: ${n.colors.backgroundLight};
  border: 1px solid ${n.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 550px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,uc=d.h2`
  margin: 0 0 0.5rem 0;
  font-size: ${n.fontSizes.h3};
  color: ${n.colors.error};
`,pc=d.p`
  margin: 0 0 1.5rem 0;
  font-size: ${n.fontSizes.base};
  color: ${n.colors.textDarker};
  line-height: 1.4;
`,fc=d.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`,Tt=d.div`
  background-color: ${n.colors.backgroundLighter};
  border-left: 4px solid ${n.colors.warningDark};
  padding: 1rem;
  border-radius: 4px;
`,Gt=d.div`
  font-size: ${n.fontSizes.base};
  font-weight: ${n.fontWeights.bold};
  color: ${n.colors.warningDark};
  margin-bottom: 0.25rem;
`,Ht=d.span`
  background-color: ${n.colors.warningDark};
  color: ${n.colors.white};
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
  font-weight: ${n.fontWeights.semiBold};
  text-transform: uppercase;
  display: inline-block;
  vertical-align: middle;
`,Vt=d.div`
  font-size: ${n.fontSizes.bodySmall};
  color: ${n.colors.textDark};
  line-height: 1.5;

  strong {
    color: ${n.colors.text};
  }
`,hc=d.a`
  display: inline-block;
  margin-top: 0.5rem;
  color: ${n.colors.accent};
  text-decoration: underline;
  word-break: break-all;

  &:hover {
    color: ${n.colors.accentSecondary};
  }
`,gc=d.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`,mc=d(de)`
  background-color: ${n.colors.accent};
  color: ${n.colors.white};

  &:hover {
    background-color: ${n.colors.accentDark};
  }
`,bc=d(de)`
  background-color: ${n.colors.backgroundLighter};
  color: ${n.colors.textDark};

  &:hover {
    background-color: ${n.colors.buttonHover};
  }
`;let wn=null,yn=!1;const xc=()=>{yn||(wn=Tn(),yn=!0);const o=wn,t=[];let s=null;const i=h.useRef(null);if(o)if(o.success){const c=o.config;i.current===null&&(i.current={config:c.config,injections:c.injections,guiVersion:c.guiVersion,ergogenVersion:c.ergogenVersion}),window.history.replaceState(null,"",window.location.pathname+window.location.search)}else s=o.message,console.error("[App] Failed to load shared configuration from hash",{error:o.error,message:o.message,hashLength:window.location.hash.length}),window.history.replaceState(null,"",window.location.pathname+window.location.search);const[r,a]=h.useState(null);return h.useEffect(()=>{i.current&&a(i.current)},[]),e.jsx(ii,{initialInjectionInput:t,hashError:s,children:e.jsx(kc,{pendingSharedConfig:r})})};function wc(){const[o,t]=h.useState(null),s=new URLSearchParams(window.location.search).has("force_update");if(h.useEffect(()=>{ac({onUpdate:i=>{t(i)}})},[]),s)return()=>{console.log("[SW] Force-update triggered via ?force_update URL parameter."),window.location.reload()};if(o)return()=>{let i;if("serviceWorker"in navigator){let a=!1;navigator.serviceWorker.addEventListener("controllerchange",()=>{a||(a=!0,i&&clearTimeout(i),window.location.reload())})}const r=o.waiting;r?(r.postMessage({type:"SKIP_WAITING"}),i=setTimeout(()=>{window.location.reload()},1e3)):window.location.reload()}}function yc(){const[o,t]=h.useState(null),[s,i]=h.useState(!1),[r,a]=h.useState(!1),c=new URLSearchParams(window.location.search).has("force_install");return h.useEffect(()=>{(()=>{const m=typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches,y=window.navigator.standalone===!0;a(m||y)})();const f=m=>{m.preventDefault(),t(m),console.log("[PWA] beforeinstallprompt event fired and captured.")},x=()=>{console.log("[PWA] appinstalled event fired."),a(!0),i(!1)};return window.addEventListener("beforeinstallprompt",f),window.addEventListener("appinstalled",x),()=>{window.removeEventListener("beforeinstallprompt",f),window.removeEventListener("appinstalled",x)}},[]),{onInstall:()=>{V("pwa_install_click"),i(!0),o?(o.prompt(),o.userChoice.then(l=>{l.outcome==="accepted"?(console.log("[PWA] User accepted the install prompt"),V("pwa_install_accepted"),a(!0)):(console.log("[PWA] User dismissed the install prompt"),V("pwa_install_dismissed")),i(!1),t(null)})):(console.log("[PWA] Install prompt triggered (deferredPrompt is not available on this device/browser)"),alert('PWA installation is not supported by this browser or is restricted on this device. If you are on iOS/iPadOS, please open this site in Safari and select "Add to Home Screen" from the Share menu.'),i(!1))},isAvailable:!!o||c,isInstalled:r,isInstalling:s}}const kc=({pendingSharedConfig:o})=>{var P;const t=we(),s=t==null?void 0:t.configInput,i=Sn(),r=wc(),a=yc(),c=h.useRef(0);c.current=((P=t==null?void 0:t.configs)==null?void 0:P.length)||0,h.useEffect(()=>{V("page_view",{page_path:i.pathname+i.search,stored_configs_count:c.current})},[i.pathname,i.search]);const p=h.useRef(!1),b=h.useRef(o);o!==b.current&&(b.current=o);const{currentConflict:l,processInjectionsWithConflictResolution:f,handleConflictResolution:x,handleConflictCancel:m}=jt({setInjectionInput:E=>t==null?void 0:t.setInjectionInput(E),setConfigInput:E=>t==null?void 0:t.loadPreview(E),generateNow:async(E,j,S)=>{t&&await t.generateNow(E,j,S)},getCurrentInjections:()=>(t==null?void 0:t.injectionInput)||[],onComplete:async(E,j)=>{localStorage.setItem("ergogen:injection",JSON.stringify(j)),t==null||t.loadPreview(E)},setError:E=>t==null?void 0:t.setError(E)}),[y,k]=h.useState(null),u=(E,j)=>{const S=yt.version,$=io("github:ceoloide/ergogen#v4.3.0");let I=!0,v,C,A;if(E){const M=Ce(S),T=Ce(E);M&&T&&!Jt(M,T)&&(I=!1,v={current:S,shared:E})}if(j){if(ur(j)&&j!==$){I=!1;const W=kt(j);A={shared:j,url:W.url,label:W.label}}const M=Fo($)||Re.version,T=Fo(j);if(T){const W=Ce(M),G=Ce(T);W&&G&&!Jt(W,G)&&(I=!1,C={current:M,shared:T})}}return{isCompatible:I,guiWarning:v,ergogenWarning:C,customErgogenWarning:A}},g=h.useCallback((E,j)=>{t&&(j!==void 0&&j.length>0?f(j,E).catch(S=>{console.error("[App] Error processing injections:",S),t.setError(`Failed to process injections: ${S instanceof Error?S.message:"Unknown error"}`)}):(t.loadPreview(E),t.generateNow(E,t.injectionInput,{pointsonly:!1})))},[t,f]),_=()=>{y&&(g(y.config,y.injections),k(null))},L=()=>{k(null)};return h.useEffect(()=>{if(!t||!o||p.current)return;p.current=!0;const E=u(o.guiVersion,o.ergogenVersion);E.isCompatible?g(o.config,o.injections):k({config:o.config,injections:o.injections,report:E})},[t,o,g]),h.useEffect(()=>{if(!t)return;const E=()=>{const j=Tn();if(j)if(j.success){const S=j.config,$=u(S.guiVersion,S.ergogenVersion);$.isCompatible?g(S.config,S.injections):k({config:S.config,injections:S.injections,report:$}),window.history.replaceState(null,"",window.location.pathname+window.location.search)}else console.error("[App] Failed to load shared configuration from hash (hashchange)",{error:j.error,message:j.message,hashLength:window.location.hash.length}),t.setError(j.message),window.history.replaceState(null,"",window.location.pathname+window.location.search)};return window.addEventListener("hashchange",E),()=>{window.removeEventListener("hashchange",E)}},[t,g]),e.jsxs(e.Fragment,{children:[y&&e.jsx(lc,{report:y.report,onAccept:_,onCancel:L,"data-testid":"share-compatibility-dialog"}),l&&e.jsx(_t,{injectionName:l.name,injectionType:l.type,onResolve:x,onCancel:m,"data-testid":"conflict-dialog"}),(t==null?void 0:t.isBulkDownloadOpen)&&e.jsx(Dl,{isOpen:t.isBulkDownloadOpen,configs:t.configs,injections:t.injectionInput,debug:t.debug,stlPreview:t.stlPreview,onClose:()=>t.setIsBulkDownloadOpen(!1),"data-testid":"bulk-download-dialog"}),e.jsx(Ba,{onUpdate:r}),e.jsx(Ka,{visible:(t==null?void 0:t.isGenerating)??!1,"data-testid":"loading-bar"}),e.jsx(Ya,{}),e.jsx(il,{isOpen:(t==null?void 0:t.showSideNav)??!1,onClose:()=>t==null?void 0:t.setShowSideNav(!1),"data-testid":"side-navigation"}),e.jsx(vc,{children:e.jsxs(ir,{children:[e.jsx(It,{path:"/",element:s?e.jsx(Ns,{pwaState:a}):e.jsx(Oo,{to:"/new",replace:!0})}),e.jsx(It,{path:"/new",element:e.jsx(ya,{})}),e.jsx(It,{path:"*",element:e.jsx(Oo,{to:"/",replace:!0})})]})})]})},vc=d.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;let kn=!1;const _c=o=>{kn||(o.editor.defineTheme("ergogen-theme",{base:"vs-dark",inherit:!0,rules:[],colors:{"editor.background":n.colors.backgroundLight}}),kn=!0)},jc=d.div`
  display: flex;
  flex-direction: column;
  color: #ffffff;
  height: 100%;
  width: 100%;
  font-family: 'Roboto', sans-serif;
`,$c=sr`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    height: 100%;
    width: 100%;
    display: flex;
  }

  body {
    margin: 0;
    font-family: ${n.fonts.body};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: ${n.colors.text};
  }

  code {
    font-family: ${n.fonts.code};
  }

  @media (max-width: 639px) {
    .show-config > .gutter,
    .show-config > div:last-of-type {
      display: none;
    }

    .show-config > div:first-of-type {
      width: 100% !important;
      padding-right: 0 !important;
    }

    .show-outputs > .gutter,
    .show-outputs > div:first-of-type {
      display: none;
    }

    .show-outputs > div:last-of-type {
      width: 100% !important;
      padding-left: 0 !important;
    }
  }
`;ar.init().then(o=>{_c(o);const t=document.getElementById("root");lr(t).render(e.jsx(Cn.StrictMode,{children:e.jsx(cr,{basename:("/".startsWith("."),"/"),children:e.jsxs(jc,{children:[e.jsx($c,{}),e.jsx(xc,{})]})})}))});export{Ge as a,n as t};
