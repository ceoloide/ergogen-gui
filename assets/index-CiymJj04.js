const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/PcbPreview-DsKQssW6.js","assets/vendor-C9A_qoZ1.js","assets/StlPreview-DDbJYdgp.js","assets/three-BJECO8Vk.js","assets/js-yaml-DW8Bub87.js","assets/jszip-cZtdyB0p.js"])))=>i.map(i=>d[i]);
import{f as Ne,y as d,j as o,r as f,h as Ke,i as Ko,k as Rn,l as Nn,O as wt,p as Un,m as vr,n as jr,o as On,q as Wn,t as $r,v as io,w as Fn,L as Bn,x as Cr,z as zt,N as qo,A as Sr,B as Mn,e as Er,C as Pr}from"./vendor-C9A_qoZ1.js";import{j as pe}from"./js-yaml-DW8Bub87.js";import{J as Xe}from"./jszip-cZtdyB0p.js";import{_ as Tn}from"./three-BJECO8Vk.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function s(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(i){if(i.ep)return;i.ep=!0;const a=s(i);fetch(i.href,a)}})();const qe=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/ergogen.worker-D0KPj6kM.js",import.meta.url),{type:"module"})}catch(t){return console.error("Failed to create worker:",t),null}},so=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/jscad.worker-C8nLBdOi.js",import.meta.url),{type:"module"})}catch(t){return console.error("Failed to create JSCAD worker:",t),null}},Ir="0.19.2",yt={version:Ir},kt=t=>{const e=`v${Ne.version}`,s=Ne.version,r=Ne.repository,i=r.startsWith("github:")?r.replace("github:","https://github.com/"):r.replace(/^git\+/,"").replace(/\.git$/,"");if(!t)return{label:e,url:i,displayText:s,isCustom:!1,isHash:!1,isTag:!1};if(t.includes("@")){const x=t.split("@"),k=x[1]||t;return{label:t,url:t.startsWith("ergogen@")?`${i}/releases/tag/v${k}`:`https://www.npmjs.com/package/${x[0]}`,displayText:k,isCustom:!0,isHash:!1,isTag:!0}}const a=t.startsWith("github:")?t.slice(7):t,[c,p]=a.split("#"),m=c==="ergogen/ergogen",l=`https://github.com/${c}`;if(m){if(!p)return{label:"latest",url:l,displayText:s,isCustom:!1,isHash:!1,isTag:!1};const x=p.length===40&&/^[0-9a-fA-F]{40}$/.test(p),k=x?p.substring(0,7):p,u=x?`${l}/commit/${p}`:`${l}/tree/${p}`;return{label:p,url:u,displayText:k,isCustom:!0,isHash:x,isTag:!x}}if(!p)return{label:a,url:l,displayText:s,isCustom:!0,isHash:!1,isTag:!1};const h=p.length===40&&/^[0-9a-fA-F]{40}$/.test(p),b=h?p.substring(0,7):p,g=h?`${l}/commit/${p}`:`${l}/tree/${p}`;return{label:a,url:g,displayText:b,isCustom:!0,isHash:h,isTag:!h}},ao=t=>{if(t.includes("@")){const i=t.split("@"),a=i[1]||t,c=i[0];return`github:${c==="ergogen"?"ergogen/ergogen":c}#v${a}`}const e=t.startsWith("github:")?t.slice(7):t,[s,r]=e.split("#");return r?`github:${s}#${r}`:`github:${s}#v${Ne.version}`},Ee=t=>{const s=t.replace(/^v/,"").match(/^(\d+)\.(\d+)\.(\d+)/);return s?[Number(s[1]),Number(s[2]),Number(s[3])]:null},qt=(t,e)=>{for(let s=0;s<3;s++){if(t[s]>e[s])return!0;if(t[s]<e[s])return!1}return!0},Yo=t=>{const e=t.match(/(?:^|#|@|v)(\d+\.\d+\.\d+)/);return e?e[1]:null},Lr=t=>{const e=t.startsWith("github:")?t.slice(7):t,[s]=e.split("#");return!t.startsWith("github:")&&!t.includes("/")?!1:s!=="ergogen/ergogen"},Gn=()=>{if(typeof window>"u")return!1;const t=window.navigator;return typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches||t.standalone===!0},Hn=t=>{if(typeof window>"u")return!0;if(window.__FORCE_ANALYTICS__===!0||t.startsWith("G-TEST"))return!1;const e=window.location.hostname;return!!(e==="localhost"||e==="127.0.0.1"||e==="[::1]"||e.endsWith(".localhost"))},zr=()=>{if(typeof document>"u"||!document.cookie)return;const t=document.cookie.split(";");for(const e of t){const s=e.indexOf("="),r=(s>-1?e.substring(0,s):e).trim();if(r.startsWith("_ga")){document.cookie=`${r}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`;const a=window.location.hostname.split(".");for(;a.length>0;){const c=a.join(".");document.cookie=`${r}=; Path=/; Domain=.${c}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`,document.cookie=`${r}=; Path=/; Domain=${c}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`,a.shift()}}}},Dr=()=>{if(!(typeof indexedDB>"u"))try{indexedDB.deleteDatabase("workbox-background-sync")}catch{}},Vn=()=>typeof window>"u"||!window.location?void 0:`${window.location.origin&&window.location.origin!=="null"?window.location.origin:`${window.location.protocol||"https:"}//${window.location.hostname||"localhost"}`}${window.location.pathname||"/"}`,Jn="ergogen:consent:sendUsageMetrics",Ar="ergogen:config:sendUsageMetrics",Rr="ergogen:settings";let mt;const Xo=t=>{const e=localStorage.getItem(t);if(e!==null)try{const s=JSON.parse(e);return typeof s=="boolean"?s:void 0}catch{return}},Nr=()=>{const t=localStorage.getItem(Rr);if(t!==null)try{const e=JSON.parse(t);return e&&typeof e=="object"&&typeof e.sendUsageMetrics=="boolean"?e.sendUsageMetrics:void 0}catch{return}},_t=()=>{if(typeof window>"u")return!1;if(mt!==void 0)return mt;try{const t=Xo(Jn);if(t!==void 0)return t;if(Xo(Ar)===!1||Nr()===!1)return!1}catch{return!1}return!Gn()},Ur=t=>{try{localStorage.setItem(Jn,JSON.stringify(t)),mt=void 0}catch{mt=t}};let Te=!1;const Kn=()=>{var i;if(typeof window>"u")return;const t=_t(),e="G-46F2L343EK",s=Hn(e),r=document.getElementById("gtag-script");if(r||(Te=!1),t&&e&&!s){delete window["ga-disable-"+e];const a=window,c={send_page_view:!1,allow_google_signals:!1,allow_ad_personalization_signals:!1},p=()=>{var m;return(m=a.gtag)==null?void 0:m.call(a,"set",{page_location:Vn()})};if(r)Te&&(p(),(i=a.gtag)==null||i.call(a,"config",e,c),Te=!1);else{const m=document.createElement("script");m.async=!0,m.src=`https://www.googletagmanager.com/gtag/js?id=${e}`,m.id="gtag-script",document.head.appendChild(m);const l=a.dataLayer||[];a.dataLayer=l,a.gtag=function(){l.push(arguments)},a.gtag("js",new Date),p(),a.gtag("config",e,c),Te=!1}Hr()}else window["ga-disable-"+e]=!0,r&&(Te=!0),zr(),Dr(),Vr()},Or=new Set(["yaml","yml","json","zip","ekb"]),Wr=t=>{const e=t.lastIndexOf("."),s=e>=0?t.slice(e+1).toLowerCase():"";return Or.has(s)?s:"other"},qn=100,Fr=/"[^"\n]*"|'[^'\n]*'|`[^`\n]*`/g,Br=/^at\s|^[^\s@]*@\S+:\d+:\d+$/,Mr=t=>t.split(`
`)[0].replace(Fr,e=>`${e[0]}*${e[0]}`).trim().slice(0,qn),Tr=t=>{const e=t.split(`
`).map(s=>s.trim()).filter(s=>Br.test(s));return e.length>0?e.join(" ").slice(0,qn):void 0},Gr=t=>{const e={...t};for(const s of["error_message","description"]){const r=e[s];typeof r=="string"&&(e[s]=Mr(r))}return typeof e.error_stack=="string"&&(e.error_stack=Tr(e.error_stack)),e},M=(t,e)=>{if(_t()&&!Hn("G-46F2L343EK")&&window.gtag){const r=Vn();window.gtag("set",{page_location:r}),window.gtag("event",t,{page_location:r,gui_version:yt.version,ergogen_version:ao("github:ceoloide/ergogen#v4.3.0"),is_pwa:Gn(),...Gr(e??{})})}},Ve=(t,e=!1,s)=>{const r=t instanceof Error?t.message:t,i=t instanceof Error?t.stack:void 0;M("exception",{description:s?`[${s}] ${r}`:r,fatal:e,error_stack:i})};let bt=!1;const Yn=t=>{Ve(t.error||t.message,!1,"unhandled_error")},Xn=t=>{Ve(t.reason||"Unhandled Promise Rejection",!1,"unhandled_rejection")},Hr=()=>{typeof window>"u"||bt||(window.addEventListener("error",Yn),window.addEventListener("unhandledrejection",Xn),bt=!0)},Vr=()=>{typeof window>"u"||bt&&(window.removeEventListener("error",Yn),window.removeEventListener("unhandledrejection",Xn),bt=!1)};function Jr(t){function e(l,h){return l>>>h|l<<32-h}const s=[],r=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],i=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],a=unescape(encodeURIComponent(t));for(let l=0;l<a.length;l++){const h=a.charCodeAt(l);s[l>>2]|=h<<24-l%4*8}const c=a.length;s[c>>2]|=128<<24-c%4*8;const p=(c+8>>6)+1;s[p*16-1]=c*8;for(let l=0;l<p;l++){const h=[];for(let S=0;S<16;S++)h[S]=s[l*16+S]||0;for(let S=16;S<64;S++){const E=e(h[S-15],7)^e(h[S-15],18)^h[S-15]>>>3,$=e(h[S-2],17)^e(h[S-2],19)^h[S-2]>>>10;h[S]=h[S-16]+E+h[S-7]+$|0}let b=r[0],g=r[1],x=r[2],k=r[3],u=r[4],y=r[5],v=r[6],z=r[7];for(let S=0;S<64;S++){const E=e(u,6)^e(u,11)^e(u,25),$=u&y^~u&v,A=z+E+$+i[S]+h[S]|0,D=e(b,2)^e(b,13)^e(b,22),I=b&g^b&x^g&x,w=D+I|0;z=v,v=y,y=u,u=k+A|0,k=x,x=g,g=b,b=A+w|0}r[0]=r[0]+b|0,r[1]=r[1]+g|0,r[2]=r[2]+x|0,r[3]=r[3]+k|0,r[4]=r[4]+u|0,r[5]=r[5]+y|0,r[6]=r[6]+v|0,r[7]=r[7]+z|0}let m="";for(let l=0;l<8;l++){const h=r[l];m+=(h>>>24&255).toString(16).padStart(2,"0"),m+=(h>>>16&255).toString(16).padStart(2,"0"),m+=(h>>>8&255).toString(16).padStart(2,"0"),m+=(h&255).toString(16).padStart(2,"0")}return m}function Yt(t,e){if(!t||typeof t!="object")return!1;const s=t;for(const r of e)if(s[r]===!0)return!0;for(const r of Object.keys(s))if(Yt(s[r],e))return!0;return!1}const Dt=t=>Math.round((t+Number.EPSILON)*100)/100,Zo=t=>{if(!t||typeof t!="object")return;const e=t.meta;if(!e||typeof e!="object")return;const s=e.zone;if(s){if(typeof s=="object"&&s!==null)return s.name;if(typeof s=="string")return s}};function Kr(t,e,s,r){const i=pe.load(t)||{},a=pe.load(e)||{},c=i.outlines||{},p=Object.keys(c),m=p.filter(X=>!X.startsWith("_")).length,l=p.length,h=Object.keys(i.pcbs||{}).length,b=Object.keys(i.cases||{}).length,g=Yt(i.pcbs,["reversible","reverse"]),x=Yt(i.points,["mirror"]),k=i.meta||{},u=k.name??"no_name",y=k.author??"no_author",v=i.points||{},z=Object.keys(v.zones||{}).length,S=v.zones||{},$=Object.keys(S).filter(X=>{const H=S[X];return H&&typeof H=="object"&&("columns"in H||"rows"in H)}),A=$.length,D=A>0;let I="",w="",j="",L=0;const R=Object.keys(a);if(D){const X=[...$].sort(),H=[],W=[],V=[];for(const _ of X){const U=S[_],T=Object.keys((U==null?void 0:U.columns)||{}),J=Object.keys((U==null?void 0:U.rows)||{}),G=(U==null?void 0:U.mirror)===!0||typeof(U==null?void 0:U.mirror)=="object"&&(U==null?void 0:U.mirror)!==null,re=v.mirror===!0||typeof v.mirror=="object"&&v.mirror!==null,te=G||re;let fe=R.filter(me=>{const ue=a[me];if(Zo(ue)!==_)return!1;if(ue&&typeof ue=="object"){const he=ue.meta;if(he&&typeof he=="object"&&he.mirrored===!0)return!1}return!me.startsWith("mirror_")}).length;te&&(fe*=2),H.push(T.length),W.push(J.length),V.push(fe),L+=fe}I=H.join(","),w=W.join(","),j=V.join(",")}const F=R.map(X=>{const H=a[X],W=Zo(H),_=(W?$.includes(W):!1)?"K":"A",U=Dt((H==null?void 0:H.x)??0),T=Dt((H==null?void 0:H.y)??0),J=Dt((H==null?void 0:H.r)??0);return{name:X,type:_,x:U,y:T,r:J}});F.sort((X,H)=>X.x!==H.x?X.x-H.x:X.y!==H.y?X.y-H.y:X.r!==H.r?X.r-H.r:X.name.localeCompare(H.name));const N=F.map(X=>`${X.type}${X.x.toString()};${X.y.toString()};${X.r.toString()}`).join("|"),B=`${u}|${y}|${N}`,Y=Jr(B).substring(0,12),ee=!x&&g?L*2:L;return{total_generation_time_ms:s,count_outlines:m,count_raw_outlines:l,count_pcbs:h,count_cases:b,is_reversible:g,is_mirrored:x,count_zones:z,matrix_zones:A,has_matrix:D,matrix_col_counts:I,matrix_row_counts:w,matrix_key_counts:j,matrix_keys:L,keyboard_keys:ee,config_id:Y,previous_config_id:r}}const n={colors:{accent:"#28a745",accentDark:"#1e8e1e",accentDarker:"#1e7e34",accentSecondary:"#239923",background:"#222222",backgroundLight:"#2a2a2a",backgroundLighter:"#333333",border:"#3f3f3f",text:"#ffffff",textDark:"#ccc",textDarker:"#aaa",textDarkest:"#666",error:"#ff6d6d",errorDark:"#a31111",warning:"hsl(45, 100%, 90%)",warningDark:"hsl(32, 79%, 40%)",info:"hsl(206, 94%, 92%)",infoDark:"hsl(206, 100%, 30%)",success:"hsl(120, 73%, 92%)",successDark:"hsl(120, 50%, 35%)",white:"#fff",buttonHover:"#3f3f3f"},fonts:{body:"'Roboto', sans-serif",code:"source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"},fontSizes:{xs:"0.4rem",sm:"0.8rem",base:"1rem",lg:"1.2rem",iconMedium:"16px",iconLarge:"24px",bodySmall:"13px",h1:"2.5rem",h2:"2rem",h3:"1.5rem"},fontWeights:{regular:400,semiBold:600,bold:700},buttonSizes:{large:{padding:"1rem 2rem",fontSize:"1rem"},medium:{padding:"0.7rem 1.4rem",fontSize:"1rem"},small:{padding:"8px 12px",fontSize:"0.8rem"},icon:{padding:"8px 12px",fontSize:"0.4rem"}}},vt=d.button`
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
`,qr=d(vt)`
  padding: ${n.buttonSizes.medium.padding};
  font-size: ${n.buttonSizes.medium.fontSize};
`,Yr=d(vt)`
  padding: ${n.buttonSizes.small.padding};
  font-size: ${n.buttonSizes.small.fontSize};
`,Xr=d(vt)`
  padding: ${n.buttonSizes.icon.padding};
  font-size: ${n.buttonSizes.icon.fontSize};
`,de=({size:t,...e})=>{switch(t){case"icon":return o.jsx(Xr,{...e});case"sm":case"small":return o.jsx(Yr,{...e});case"md":case"medium":return o.jsx(qr,{...e});case"lg":case"large":default:return o.jsx(vt,{...e})}},Zr=t=>t.charAt(0).toUpperCase()+t.slice(1),jt=({injectionName:t,injectionType:e,onResolve:s,onCancel:r,"data-testid":i})=>{const[a,c]=f.useState(!1),p=Zr(e);return o.jsx(Qr,{"data-testid":i,children:o.jsxs(ei,{"data-testid":i&&`${i}-box`,children:[o.jsxs(ti,{children:[p," Conflict"]}),o.jsxs(oi,{children:["A ",e," with the name ",o.jsx("strong",{children:t})," ","already exists.",o.jsx("br",{}),"How would you like to resolve this conflict?"]}),o.jsxs(ni,{children:[o.jsx(ri,{type:"checkbox",id:"apply-to-all",checked:a,onChange:m=>c(m.target.checked),"data-testid":i&&`${i}-apply-to-all`,"aria-label":"Apply this choice to all conflicts"}),o.jsx(ii,{$checked:a,onClick:()=>c(!a),role:"checkbox","aria-checked":a}),o.jsx("label",{htmlFor:"apply-to-all",children:"Apply to all conflicts"})]}),o.jsxs(si,{children:[o.jsx(de,{onClick:()=>s("skip",a),size:"medium","data-testid":i&&`${i}-skip`,"aria-label":`Skip this ${e}`,children:"Skip"}),o.jsx(de,{onClick:()=>s("overwrite",a),size:"medium","data-testid":i&&`${i}-overwrite`,"aria-label":`Overwrite existing ${e}`,children:"Overwrite"}),o.jsx(de,{onClick:()=>s("keep-both",a),size:"medium","data-testid":i&&`${i}-keep-both`,"aria-label":`Keep both ${e}s`,children:"Keep Both"})]}),o.jsx(ai,{onClick:r,size:"small","data-testid":i&&`${i}-cancel`,"aria-label":"Cancel loading",children:"Cancel"})]})})},Qr=d.div`
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
`,ei=d.div`
  background-color: ${n.colors.backgroundLight};
  border: 1px solid ${n.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`,ti=d.h2`
  margin: 0 0 1rem 0;
  font-size: ${n.fontSizes.h3};
  color: ${n.colors.text};
`,oi=d.p`
  margin: 0 0 1.5rem 0;
  font-size: ${n.fontSizes.base};
  color: ${n.colors.textDark};
  line-height: 1.5;

  strong {
    color: ${n.colors.accent};
  }
`,ni=d.div`
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
`,ri=d.input`
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
`,ii=d.div`
  position: relative;
  width: 44px;
  height: 22px;
  background-color: ${t=>t.$checked?n.colors.accent:n.colors.backgroundLighter};
  border: 1px solid ${n.colors.border};
  border-radius: 11px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${t=>t.$checked?"24px":"2px"};
    width: 16px;
    height: 16px;
    background-color: ${n.colors.text};
    border-radius: 50%;
    transition: left 0.2s ease-in-out;
  }
`,si=d.div`
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  margin-bottom: 1rem;
`,ai=d(de)`
  width: 100%;
  background-color: ${n.colors.backgroundLighter};
  color: ${n.colors.textDark};

  &:hover {
    background-color: ${n.colors.buttonHover};
  }
`,Ue=t=>Array.isArray(t)&&t.length===3&&typeof t[0]=="string"&&typeof t[1]=="string"&&typeof t[2]=="string",Zn=(t,e,s)=>!s||s.length===0?{hasConflict:!1}:s.some(i=>Ue(i)&&i[0]===t&&i[1]===e)?{hasConflict:!0,conflictingName:e}:{hasConflict:!1},li=(t,e)=>{if(!e||e.length===0)return[];const s=[];for(const r of t){if(!Ue(r))continue;const[i,a]=r,c=Zn(i,a,e);c.hasConflict&&s.push({injection:r,conflict:c})}return s},Qn=(t,e,s)=>{if(!s||s.length===0)return e;const r=new Set(s.filter(c=>Ue(c)&&c[0]===t).map(c=>c[1]));let i=1,a=`${e}_${i}`;for(;r.has(a);)i++,a=`${e}_${i}`;return a},At=(t,e,s)=>{const r=e?[...e]:[];for(const i of t){if(!Ue(i)){console.warn("[mergeInjectionArraysWithResolution] Skipping invalid injection format:",i);continue}const[a,c,p]=i;if(!Zn(a,c,r).hasConflict)r.push([a,c,p]);else{if(s==="skip")continue;if(s==="overwrite"){const l=r.findIndex(h=>Ue(h)&&h[0]===a&&h[1]===c);l!==-1&&(r[l]=[a,c,p])}else if(s==="keep-both"){const l=Qn(a,c,r);r.push([a,l,p])}}}return r},$t=t=>{const[e,s]=f.useState([]),r=e.length>0?e[0]:null,[i,a]=f.useState(null),[c,p]=f.useState(null),[m,l]=f.useState(null),h=f.useCallback(async(x,k,u=null,y)=>{var A,D,I;const v=y||t.getCurrentInjections();if(x.length===0){t.setInjectionInput(v),t.setConfigInput(k),await t.generateNow(k,v,{pointsonly:!1}),await((A=t.onComplete)==null?void 0:A.call(t,k,v));return}const z=x.filter(w=>Ue(w)?!0:(console.warn("[useInjectionConflictResolution] Skipping invalid injection format:",w),!1));if(z.length===0){t.setInjectionInput(v),t.setConfigInput(k),await t.generateNow(k,v,{pointsonly:!1}),await((D=t.onComplete)==null?void 0:D.call(t,k,v));return}const S=li(z,v);if(S.length>0&&!u){const w=S.map(j=>({injection:j.injection,conflict:j.conflict}));M("conflict_encountered",{conflict_count:S.length}),s(w),a(z),p(k),l(v);return}const $=At(z,v,u||"skip");t.setInjectionInput($),t.setConfigInput(k),await t.generateNow(k,$,{pointsonly:!1}),await((I=t.onComplete)==null?void 0:I.call(t,k,$))},[t]),b=f.useCallback(async(x,k)=>{var u,y;if(!(!i||!c||e.length===0))if(k){M("conflict_resolved",{strategy:x,apply_to_all:!0,remaining_count:e.length});const v=At(i,m||t.getCurrentInjections(),x);t.setInjectionInput(v),t.setConfigInput(c),await t.generateNow(c,v,{pointsonly:!1}),await((u=t.onComplete)==null?void 0:u.call(t,c,v)),s([]),a(null),p(null),l(null)}else{M("conflict_resolved",{strategy:x,apply_to_all:!1,remaining_count:e.length});const v=e[0],[z,S]=v.injection,E=v.injection,$=e.slice(1);s($);let A=[...m||t.getCurrentInjections()],D=[...i||[]];if(x==="overwrite")A=A.filter(I=>!(I[0]===z&&I[1]===S));else if(x==="skip")D=D.filter(I=>!(I[0]===z&&I[1]===S&&I[2]===E[2]));else if(x==="keep-both"){const I=Qn(z,S,A),w=[z,I,E[2]];A=[...A,w],D=D.filter(j=>!(j[0]===z&&j[1]===S&&j[2]===E[2]))}if(l(A),a(D),$.length===0){const I=At(D,A,"skip");t.setInjectionInput(I),t.setConfigInput(c),await t.generateNow(c,I,{pointsonly:!1}),await((y=t.onComplete)==null?void 0:y.call(t,c,I)),a(null),p(null),l(null)}}},[i,c,m,e,t]),g=f.useCallback(()=>{var x;M("conflict_cancelled",{remaining_count:e.length}),s([]),a(null),p(null),l(null),(x=t.setError)==null||x.call(t,"Loading cancelled by user")},[t,e.length]);return{currentConflict:r?{name:r.injection[1],type:r.injection[0]}:null,processInjectionsWithConflictResolution:h,handleConflictResolution:b,handleConflictCancel:g}},ci={templates:"4.3.0",outlines:"4.3.0"},ae=t=>{if(typeof window<"u"&&window.location)try{const m=new URLSearchParams(window.location.search).get(`ff_${t}`);if(m==="true")return!0;if(m==="false")return!1}catch(p){console.warn("[FeatureFlags] Failed to check URL query parameters:",p)}let e;if((t==="templates"||t==="outlines")&&(e=""),e==="true")return!0;if(e==="false")return!1;let r=kt("github:ceoloide/ergogen#v4.3.0").displayText;Ee(r)||(r=Ne.version);const i=ci[t],a=Ee(r),c=Ee(i);return a&&c?qt(a,c):!1},di=50*1024*1024,ui=10*1024*1024,Rt=(t,e)=>{const s=`${e}/`;let r=t;return r.startsWith(s)&&(r=r.substring(s.length)),r=r.replace(/\.js$/,""),r},pi=t=>{let e=t.file("config.yaml")||t.file("config.yml");if(!e){const s=t.file(/^config\.(yaml|yml)$/i);s&&s.length>0&&(e=s[0])}if(!e)throw new Error("The archive is missing a config.yaml file in the root directory.");return e},Xt=(t,e)=>{if(e&&t>di)throw new Error(`File exceeds the maximum size limit of 50MB for archives (current size: ${(t/(1024*1024)).toFixed(1)}MB).`);if(!e&&t>ui)throw new Error(`File exceeds the maximum size limit of 10MB for text files (current size: ${(t/(1024*1024)).toFixed(1)}MB).`)},er=(t,e,s)=>{const r=[];return t.forEach(i=>r.push(["footprint",i.name,i.content])),e.forEach(i=>r.push(["outline",i.name,i.content])),s.forEach(i=>r.push(["template",i.name,i.content])),r},fi=async t=>{let e;try{e=await Xe.loadAsync(t)}catch{throw new Error("The file appears to be corrupted. Please verify the file and try again.")}const r=await pi(e).async("string"),i=[],a=[];return e.forEach((c,p)=>{if(!(p.dir||!c.endsWith(".js"))){if(c.startsWith("footprints/")){const m=p.async("string").then(l=>{const h=Rt(c,"footprints");i.push({type:"footprint",name:h,content:l})});a.push(m)}else if(c.startsWith("outlines/")&&ae("outlines")){const m=p.async("string").then(l=>{const h=Rt(c,"outlines");i.push({type:"outline",name:h,content:l})});a.push(m)}else if(c.startsWith("templates/")&&ae("templates")){const m=p.async("string").then(l=>{const h=Rt(c,"templates");i.push({type:"template",name:h,content:l})});a.push(m)}}}),await Promise.all(a),{config:r,injections:i}},Zt="ergogen:config",lo="ergogen:multi-config",Qt="LOCAL_STORAGE_CONFIG",Qo=5e3,hi=40,gi=3;class ge extends Error{constructor(e){super(e),this.name="RateLimitError"}}class mi{constructor(){this.providers=[]}register(e){this.providers.push(e)}resolve(e){const s=e.trim();for(const r of this.providers)if(r.canHandle(s))return r;return/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(s)&&this.providers[0]||null}}const Ze=new mi,bi=t=>{const e=[],s=t.split(`
`);let r={};for(const i of s){const a=i.trim();if(a.startsWith("[submodule"))r.path&&r.url&&e.push({path:r.path,url:r.url}),r={};else{const c=a.indexOf("=");if(c!==-1){const p=a.substring(0,c).trim(),m=a.substring(c+1).trim();p==="path"?r.path=m:p==="url"&&(r.url=m)}}}return r.path&&r.url&&e.push({path:r.path,url:r.url}),e};class Qe{async fetchConfig(e){console.log(`[GitHub] Starting fetch from URL: ${e}`);const s=this.parseUrl(e),{owner:r,repo:i,branch:a,filePath:c,isRepoRoot:p}=s,m=s.host,l=[],h=[],b=[],g=async(k,u,y,v,z)=>{console.log("[GitHub] Checking for .gitmodules file");try{const S=await this.fetchFileContent(r,i,".gitmodules",u,m);console.log("[GitHub] .gitmodules found, parsing submodules");const E=bi(S);for(const $ of E)if($.path.includes(y)||$.path.includes(v)&&ae("outlines")||$.path.includes(z)&&ae("templates")){const A=$.path.includes(v),D=$.path.includes(z),I=A?v:D?z:y,w=A?h:D?b:l,j=$.path.substring($.path.indexOf(I)+I.length+1),L=Ze.resolve($.url);if(L instanceof Qe){const R=L.parseUrl($.url),F=R.host;let N=[];try{N=await L.fetchFootprintsFromDirectory(R.owner,R.repo,"","main",[".js"],F)}catch(Z){if(Z instanceof ge)throw Z;try{N=await L.fetchFootprintsFromDirectory(R.owner,R.repo,"","master",[".js"],F)}catch(Y){if(Y instanceof ge)throw Y;console.warn(`Failed to fetch submodule footprints from ${$.url}`)}}const B=N.map(Z=>({name:j?`${j}/${Z.name}`:Z.name,content:Z.content}));w.push(...B)}}}catch(S){if(S instanceof ge)throw S}};if(!p){if(!c)throw new Error("Invalid URL. File path not specified.");const k=await this.fetchFileContent(r,i,c,a,m);Xt(k.length,!1);const u=c.split("/").pop()||"";if(!(u==="config.yaml"||u==="config.yml"))return{config:k,footprints:[],outlines:[],templates:[],configPath:u};const v=c.substring(0,c.lastIndexOf("/")),z=v?`${v}/footprints`:"footprints",S=v?`${v}/outlines`:"outlines",E=v?`${v}/templates`:"templates";try{const $=await this.fetchFootprintsFromDirectory(r,i,z,a,[".js"],m);l.push(...$)}catch($){if($ instanceof ge)throw $}if(ae("outlines"))try{const $=await this.fetchFootprintsFromDirectory(r,i,S,a,[".js",".svg"],m);h.push(...$)}catch($){if($ instanceof ge)throw $}if(ae("templates"))try{const $=await this.fetchFootprintsFromDirectory(r,i,E,a,[".js"],m);b.push(...$)}catch($){if($ instanceof ge)throw $}return await g(v,a,z,S,E),{config:k,footprints:l,outlines:h,templates:b,configPath:u}}const x=async k=>{var $,A,D,I,w,j,L,R,F,N,B,Z;let u="",y="",v=!0;try{u=await this.fetchFileContent(r,i,"config.yaml",k,m),y=""}catch(Y){const ee=Y;if(($=ee.message)!=null&&$.includes("allowance")||(A=ee.message)!=null&&A.includes("limit exceeded")||(D=ee.message)!=null&&D.includes("rate limit"))throw ee;try{u=await this.fetchFileContent(r,i,"config.yml",k,m),y=""}catch(X){const H=X;if((I=H.message)!=null&&I.includes("allowance")||(w=H.message)!=null&&w.includes("limit exceeded")||(j=H.message)!=null&&j.includes("rate limit"))throw H;try{u=await this.fetchFileContent(r,i,"ergogen/config.yaml",k,m),y="ergogen"}catch(W){const V=W;if((L=V.message)!=null&&L.includes("allowance")||(R=V.message)!=null&&R.includes("limit exceeded")||(F=V.message)!=null&&F.includes("rate limit"))throw V;try{u=await this.fetchFileContent(r,i,"ergogen/config.yml",k,m),y="ergogen"}catch(_){const U=_;if((N=U.message)!=null&&N.includes("allowance")||(B=U.message)!=null&&B.includes("limit exceeded")||(Z=U.message)!=null&&Z.includes("rate limit"))throw U;const{configYamls:T,anyYamls:J}=await this.bfsForYamlFiles(r,i,k,m);if(T.length>0){const G=T[0];u=await this.fetchFileContent(r,i,G,k,m),y=G.includes("/")?G.substring(0,G.lastIndexOf("/")):""}else if(J.length>0){const G=J[0];u=await this.fetchFileContent(r,i,G,k,m),y=G.includes("/")?G.substring(0,G.lastIndexOf("/")):"",v=!1}else throw new Error("No YAML configuration files found in repository")}}}}if(Xt(u.length,!1),!v)return{config:u,footprints:[],outlines:[],templates:[],configPath:y};const z=y?`${y}/footprints`:"footprints",S=y?`${y}/outlines`:"outlines",E=y?`${y}/templates`:"templates";try{const Y=await this.fetchFootprintsFromDirectory(r,i,z,k,[".js"]);l.push(...Y)}catch(Y){if(Y instanceof ge)throw Y}if(ae("outlines"))try{const Y=await this.fetchFootprintsFromDirectory(r,i,S,k,[".js",".svg"]);h.push(...Y)}catch(Y){if(Y instanceof ge)throw Y}if(ae("templates"))try{const Y=await this.fetchFootprintsFromDirectory(r,i,E,k,[".js"]);b.push(...Y)}catch(Y){if(Y instanceof ge)throw Y}return await g(y,k,z,S,E),{config:u,footprints:l,outlines:h,templates:b,configPath:y}};if(a!=="main")return await x(a);try{return await x("main")}catch(k){if(k instanceof ge)throw k;return await x("master")}}async fetchFootprintsFromDirectory(e,s,r,i,a,c){const p=[],m=async l=>{try{const h=await this.listDirectory(e,s,l,i,c);for(const b of h){const g=b.path.startsWith(l)?b.path:l?`${l}/${b.path}`:b.path;if(b.type==="file"){if(a.some(k=>b.name.endsWith(k)))try{const k=await this.fetchFileContent(e,s,g,i,c),u=r?g.slice(r.length+1).replace(/\.[^/.]+$/,""):g.replace(/\.[^/.]+$/,"");console.log(`[GitHub] Loaded footprint: ${u}`),p.push({name:u,content:k})}catch(k){if(k instanceof ge)throw k;const u=k;console.warn(`Failed to fetch file content: ${g}`,u.stack||u)}}else b.type==="dir"&&await m(g)}}catch(h){if(h instanceof ge)throw h}};return await m(r),p}async bfsForYamlFiles(e,s,r,i){var h,b,g;const a=[],c=[],p=[{path:"",depth:0}],m=new Set;let l=0;for(;p.length>0&&l<hi;){const{path:x,depth:k}=p.shift();if(!m.has(x)){m.add(x);try{l++;const u=await this.listDirectory(e,s,x,r,i);for(const y of u)if(y.type==="file"){const v=y.name.toLowerCase();(v.endsWith(".yaml")||v.endsWith(".yml"))&&!v.startsWith(".")&&v.replace(/\.(yaml|yml)$/,"")!=="metadata"&&v.replace(/\.(yaml|yml)$/,"")!=="virtual_env"&&(y.name==="config.yaml"||y.name==="config.yml"?a.push(y.path):c.push(y.path))}else y.type==="dir"&&k<gi&&(y.name.startsWith(".")||p.push({path:y.path,depth:k+1}));if(a.length>0||c.length>0&&(p.length===0||p[0].depth>k))break}catch(u){const y=u;if((h=y.message)!=null&&h.includes("allowance")||(b=y.message)!=null&&b.includes("limit exceeded")||(g=y.message)!=null&&g.includes("rate limit"))throw y;continue}}}return{configYamls:a,anyYamls:c}}}const xi=(t,e)=>{var p,m,l,h;if(!t)return{isLimitExceeded:!1,error:null};if(e.includes("raw.githubusercontent.com"))return t.status===429?(console.warn("[GitHub] Raw content rate limit exceeded (429). Please wait 30 minutes and try again."),{isLimitExceeded:!0,error:"You've reached your hourly request allowance for loading content from GitHub. Please wait 30 minutes and try again."}):{isLimitExceeded:!1,error:null};const r=((p=t.headers)==null?void 0:p.get("X-RateLimit-Limit"))||"unknown",i=((m=t.headers)==null?void 0:m.get("X-RateLimit-Remaining"))||"unknown",a=((l=t.headers)==null?void 0:l.get("X-RateLimit-Used"))||"unknown",c=((h=t.headers)==null?void 0:h.get("X-RateLimit-Reset"))||"unknown";if(console.log(`[GitHub Rate Limit] Limit: ${r}, Remaining: ${i}, Used: ${a}, Reset: ${c}`),t.status===403&&i==="0")return console.warn("[GitHub] Rate limit exceeded. Please wait and try again in about an hour."),{isLimitExceeded:!0,error:"Cannot load from GitHub right now. You've used your hourly request allowance. Please wait about an hour and try again."};if(i!=="unknown"&&r!=="unknown"){const b=parseInt(r),g=parseInt(i),x=(b-g)/b*100;if(x>=80&&g>0)return console.warn(`[GitHub] Approaching rate limit: ${x.toFixed(1)}% used`),{isLimitExceeded:!1,error:"Loading from GitHub may become unavailable soon. You've used most of your hourly request allowance. This will reset within an hour."}}return{isLimitExceeded:!1,error:null}};class wi extends Qe{constructor(){super(...arguments),this.rateLimitWarning=null}canHandle(e){const s=e.trim();return s.includes("github.com")||/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(s)}parseUrl(e){const s=e.trim();let r="",i="",a="main",c,p=!0;const m=!s.includes("github.com");if(m){const l=s.split("/").filter(Boolean);if(l.length<2)throw new Error("Invalid GitHub repository format. Must contain owner and repository.");r=l[0],i=l[1],p=l.length===2||l.length===4&&l[2]==="tree",p?l.length===4&&(a=l[3]):l[2]==="blob"||l[2]==="tree"?(a=l[3],c=l.slice(4).join("/")):c=l.slice(2).join("/")}else{let l=s;l.match(/^(https?:\/\/)/i)||(l=`https://${l}`);const h=l.endsWith("/")?l.slice(0,-1):l,g=new URL(h).pathname.split("/").filter(Boolean);if(g.length<2)throw new Error("Invalid GitHub URL. Must contain owner and repository.");r=g[0],i=g[1],p=g.length===2||g.length===4&&g[2]==="tree",p?g.length===4&&(a=g[3]):g[2]==="blob"||g[2]==="tree"?(a=g[3],c=g.slice(4).join("/")):c=g.slice(2).join("/")}return i.endsWith(".git")&&(i=i.slice(0,-4)),{owner:r,repo:i,branch:a,filePath:c,isRepoRoot:p,baseUrl:m?`https://github.com/${r}/${i}`:s}}async fetchFileContent(e,s,r,i){const a=`https://raw.githubusercontent.com/${e}/${s}/${i}/${r}`,c=await fetch(a);if(this.checkRateLimits(c,a),!c.ok)throw new Error(`Failed to fetch file content from GitHub: ${c.status}`);return await c.text()}async listDirectory(e,s,r,i){const a=`https://api.github.com/repos/${e}/${s}/contents/${r}?ref=${i}`,c=await fetch(a);if(this.checkRateLimits(c,a),!c.ok)throw new Error(`Failed to list directory from GitHub: ${c.status}`);const p=await c.json();let m=[];if(Array.isArray(p))m=p;else if(p&&typeof p=="object"&&"tree"in p&&Array.isArray(p.tree))m=p.tree;else throw new Error("Target path is not a directory");return m.map(l=>({name:l.name||l.path.split("/").pop()||"",path:l.path,type:l.type==="tree"?"dir":l.type==="blob"?"file":l.type}))}checkRateLimits(e,s){const r=xi(e,s);if(r.error&&!this.rateLimitWarning&&(this.rateLimitWarning=r.error),r.isLimitExceeded)throw new ge(r.error||"Rate limit exceeded")}async fetchConfig(e){this.rateLimitWarning=null;const s=await super.fetchConfig(e);return this.rateLimitWarning&&(s.rateLimitWarning=this.rateLimitWarning),s}}Ze.register(new wi);const tr=async t=>{const e=Ze.resolve(t);if(!e)throw new Error(`Unsupported repository provider URL: ${t}`);return e.fetchConfig(t)};class yi extends Qe{canHandle(e){return e.includes("codeberg.org")}parseUrl(e){const s=e.trim();let r="",i="",a="main",c,p=!0;const m=!s.includes("codeberg.org");if(m){const l=s.split("/").filter(Boolean);if(l.length<2)throw new Error("Invalid Codeberg repository format. Must contain owner and repository.");r=l[0],i=l[1],p=l.length===2||l.length===5&&l[2]==="src"&&(l[3]==="branch"||l[3]==="commit"),p?l.length===5&&(a=l[4]):l.length>=5&&l[2]==="src"&&(l[3]==="branch"||l[3]==="commit")?(a=l[4],c=l.slice(5).join("/")):c=l.slice(2).join("/")}else{let l=s;l.match(/^(https?:\/\/)/i)||(l=`https://${l}`);const h=l.endsWith("/")?l.slice(0,-1):l,g=new URL(h).pathname.split("/").filter(Boolean);if(g.length<2)throw new Error("Invalid Codeberg URL. Must contain owner and repository name.");r=g[0],i=g[1],p=g.length===2||g.length===5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit"),p?g.length===5&&(a=g[4]):g.length>=5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit")?(a=g[4],c=g.slice(5).join("/")):c=g.slice(2).join("/")}return i.endsWith(".git")&&(i=i.slice(0,-4)),{owner:r,repo:i,branch:a,filePath:c,isRepoRoot:p,baseUrl:m?`https://codeberg.org/${r}/${i}`:s}}async fetchFileContent(e,s,r,i){const a=`https://codeberg.org/api/v1/repos/${e}/${s}/raw/${r}?ref=${i}`,c=await fetch(a);if(!c.ok)throw new Error(`Failed to fetch file content from Codeberg API: ${c.status}`);return await c.text()}async listDirectory(e,s,r,i){const a=r?`/${r}`:"",c=`https://codeberg.org/api/v1/repos/${e}/${s}/contents${a}?ref=${i}`,p=await fetch(c);if(!p.ok)throw new Error(`Failed to list directory from Codeberg API: ${p.status}`);const m=await p.json();if(!Array.isArray(m))throw new Error("Target path is not a directory");return m.map(l=>({name:l.name,path:l.path||l.name,type:l.type}))}}Ze.register(new yi);class ki extends Qe{canHandle(e){const s=e.trim();return s.match(/^(https?:\/\/)/i)?!s.includes("github.com")&&!s.includes("codeberg.org"):!1}parseUrl(e){const s=e.trim();let r="",i="",a="main",c,p=!0,m=s;m.match(/^(https?:\/\/)/i)||(m=`https://${m}`);const l=m.endsWith("/")?m.slice(0,-1):m,h=new URL(l),b=h.origin,g=h.pathname.split("/").filter(Boolean);if(g.length<2)throw new Error("Invalid Forgejo/Gitea URL. Must contain owner and repository name.");return r=g[0],i=g[1],p=g.length===2||g.length===5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit"),p?g.length===5&&(a=g[4]):g.length>=5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit")?(a=g[4],c=g.slice(5).join("/")):c=g.slice(2).join("/"),i.endsWith(".git")&&(i=i.slice(0,-4)),{owner:r,repo:i,branch:a,filePath:c,isRepoRoot:p,baseUrl:s,host:b}}async fetchFileContent(e,s,r,i,a){const p=`${a||"https://codeberg.org"}/api/v1/repos/${e}/${s}/raw/${r}?ref=${i}`,m=await fetch(p);if(!m.ok)throw new Error(`Failed to fetch file content from Gitea/Forgejo API: ${m.status}`);return await m.text()}async listDirectory(e,s,r,i,a){const c=a||"https://codeberg.org",p=r?`/${r}`:"",m=`${c}/api/v1/repos/${e}/${s}/contents${p}?ref=${i}`,l=await fetch(m);if(!l.ok)throw new Error(`Failed to list directory from Gitea/Forgejo API: ${l.status}`);const h=await l.json();if(!Array.isArray(h))throw new Error("Target path is not a directory");return h.map(b=>({name:b.name,path:b.path||b.name,type:b.type}))}}const _i=new ki;Ze.register(_i);const vi=({processInjectionsWithConflictResolution:t,setError:e})=>{const[s,r]=f.useState(!1),i=f.useRef(!1);return f.useEffect(()=>{const a=async()=>{const c=new URLSearchParams(window.location.search),p=c.get("github"),m=c.get("codeberg"),l=c.get("forgejo"),h=c.get("gitea");let b=p||m||l||h;if(b){m&&!m.includes("codeberg.org")?b=`https://codeberg.org/${m}`:p&&!p.includes("github.com")&&(b=`https://github.com/${p}`),r(!0),console.log("[useConfigLoader] Loading from URL parameter:",b);try{const g=await tr(b);console.log("[useConfigLoader] Fetch result:",{configLength:g.config.length,footprintsCount:g.footprints.length,outlinesCount:g.outlines.length,configPath:g.configPath,rateLimitWarning:g.rateLimitWarning}),g.rateLimitWarning&&e(g.rateLimitWarning);const x=er(g.footprints,g.outlines,g.templates);await t(x,g.config)}catch(g){console.error("[useConfigLoader] Failed to load from remote repository:",g),e(`Failed to load from remote repository: ${g instanceof Error?g.message:String(g)}`)}finally{r(!1)}}};i.current||(i.current=!0,a())},[t,e]),{isLoading:s}},Ye=(t,e)=>{const s=new Map;for(const r of e){const[i,a,c]=r;let p="footprints";i==="outline"?p="outlines":i==="template"&&(p="templates");const m=t.folder(p);if(m){const l=a.split("/"),h=l.pop();let b=m,g=p;for(const x of l){const k=`${g}/${x}`;let u=s.get(k);u||(u=b.folder(x)||b,s.set(k,u)),b=u,g=k}h&&b.file(`${h}.js`,c)}}},or=async(t,e,s,r,i)=>{var h;const a=new Xe;a.file("config.yaml",e);const c=a.folder("outputs");if(c){if((h=t.demo)!=null&&h.svg&&c.file("demo.svg",t.demo.svg),t.outlines){let b=null;for(const[g,x]of Object.entries(t.outlines))(r||!g.startsWith("_"))&&(x.dxf||x.svg)&&(b||(b=c.folder("outlines")),b&&(x.dxf&&b.file(`${g}.dxf`,x.dxf),x.svg&&b.file(`${g}.svg`,x.svg)))}if(t.pcbs&&Object.keys(t.pcbs).length>0){const b=c.folder("pcbs");if(b)for(const[g,x]of Object.entries(t.pcbs)){const k=g.endsWith(".kicad_pcb")?g:`${g}.kicad_pcb`;b.file(k,x)}}if(t.cases){let b=null;for(const[g,x]of Object.entries(t.cases)){const k=!!x.jscad,u=i&&!!x.stl;(k||u)&&(b||(b=c.folder("cases")),b&&(x.jscad&&b.file(`${g}.jscad`,x.jscad),i&&x.stl&&b.file(`${g}.stl`,x.stl)))}}if(r){const b=c.folder("debug");if(b){b.file("raw.txt",e);for(const[g,x]of Object.entries(t))["canonical","points","units"].includes(g)&&b.file(`${g}.yaml`,JSON.stringify(x,null,2))}}}s&&s.length>0&&Ye(a,s);const p=await a.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),l=`ergogen-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Ke.saveAs(p,l)},ji=(t,e)=>new Promise((s,r)=>{const i=qe();if(!i){r(new Error("Failed to create Ergogen worker"));return}const a=setTimeout(()=>{i.terminate(),r(new Error("Compilation timed out"))},15e3);i.onmessage=p=>{const m=p.data;m.type==="error"?(clearTimeout(a),r(new Error(m.error)),i.terminate()):m.type==="success"&&(clearTimeout(a),s(m.results),i.terminate())},i.onerror=p=>{clearTimeout(a),r(p),i.terminate()};let c;try{c=JSON.parse(t)}catch{try{c=pe.load(t)}catch{c=t}}i.postMessage({type:"generate",inputConfig:c,injectionInput:e,requestId:`export-compile-${Date.now()}`,options:{debug:!0,svg:!0}})}),$i=t=>new Promise(e=>{const s=so();if(!s){e(t);return}const r=setTimeout(()=>{s.terminate(),e(t)},15e3);s.onmessage=i=>{const a=i.data;a.type==="success"&&a.results?(clearTimeout(r),e(a.results)):(clearTimeout(r),e(t)),s.terminate()},s.onerror=()=>{clearTimeout(r),e(t),s.terminate()},s.postMessage({type:"batch_jscad_to_stl",results:t,configVersion:0})}),Ci=async(t,e,s,r)=>{var m;const i=new Xe;for(const l of t){const h=l.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled",b=i.folder(h);if(b)try{const g=await ji(l.config,e);let x=g;r&&g.cases&&Object.keys(g.cases).length>0&&(x=await $i(g)),b.file("config.yaml",l.config);const k=b.folder("outputs");if(k){if((m=x.demo)!=null&&m.svg&&k.file("demo.svg",x.demo.svg),x.outlines){let u=null;for(const[y,v]of Object.entries(x.outlines))(s||!y.startsWith("_"))&&(v.dxf||v.svg)&&(u||(u=k.folder("outlines")),u&&(v.dxf&&u.file(`${y}.dxf`,v.dxf),v.svg&&u.file(`${y}.svg`,v.svg)))}if(x.pcbs&&Object.keys(x.pcbs).length>0){const u=k.folder("pcbs");if(u)for(const[y,v]of Object.entries(x.pcbs)){const z=y.endsWith(".kicad_pcb")?y:`${y}.kicad_pcb`;u.file(z,v)}}if(x.cases){let u=null;for(const[y,v]of Object.entries(x.cases)){const z=!!v.jscad,S=r&&!!v.stl;(z||S)&&(u||(u=k.folder("cases")),u&&(v.jscad&&u.file(`${y}.jscad`,v.jscad),r&&v.stl&&u.file(`${y}.stl`,v.stl)))}}if(s){const u=k.folder("debug");if(u){u.file("raw.txt",l.config);for(const[y,v]of Object.entries(x))["canonical","points","units"].includes(y)&&u.file(`${y}.yaml`,JSON.stringify(v,null,2))}}}e&&e.length>0&&Ye(b,e)}catch(g){console.error(`Failed to compile config ${l.name}:`,g),b.file("config.yaml",l.config),b.file("error.txt",`Compilation failed: ${g instanceof Error?g.message:String(g)}`)}}const a=await i.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),p=`ergogen-export-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Ke.saveAs(a,p)},Si=async(t,e)=>{const s=new Xe,r=new Set;for(const p of t){const m=p.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled";let l=m,h=1;for(;r.has(l);)l=`${m}_${h}`,h++;r.add(l),s.file(`${l}.yaml`,p.config)}e&&e.length>0&&Ye(s,e);const i=await s.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),c=`ergogen-config-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Ke.saveAs(i,c)},Ei=async(t,e,s,r,i,a,c)=>{const p=new Xe,m=new Set;if(i){for(let g=0;g<t.length;g++){if(c())return;const x=t[g];a(g,t.length,x.name);const k=x.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled";let u=k,y=1;for(;m.has(u);)u=`${k}_${y}`,y++;m.add(u),p.file(`${u}.yaml`,x.config)}if(e&&e.length>0){if(c())return;Ye(p,e)}if(c())return;a(t.length,t.length,"Creating ZIP...");const l=await p.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),b=`ergogen-config-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;return Ke.saveAs(l,b),{succeededCount:t.length,failedCount:0}}else{const l=new Set,h=(z,S)=>new Promise((E,$)=>{if(c()){$(new Error("Aborted"));return}const A=qe();if(!A){$(new Error("Failed to create Ergogen worker"));return}l.add(A);const D=setTimeout(()=>{A.terminate(),l.delete(A),$(new Error("Compilation timed out"))},3e4);A.onmessage=w=>{const j=w.data;j.type==="error"?(clearTimeout(D),A.terminate(),l.delete(A),$(new Error(j.error))):j.type==="success"&&(clearTimeout(D),A.terminate(),l.delete(A),E(j.results))},A.onerror=w=>{clearTimeout(D),A.terminate(),l.delete(A),$(w)};let I;try{I=JSON.parse(z)}catch{try{I=pe.load(z)}catch{I=z}}A.postMessage({type:"generate",inputConfig:I,injectionInput:S,requestId:`export-compile-${Date.now()}`})}),b=z=>new Promise(S=>{if(c()||!z.cases||Object.keys(z.cases).length===0){S(z);return}const E=so();if(!E){S(z);return}l.add(E);const $=setTimeout(()=>{E.terminate(),l.delete(E),S(z)},3e4);E.onmessage=A=>{const D=A.data;D.type==="success"?(clearTimeout($),E.terminate(),l.delete(E),S(D.results)):D.type==="error"&&(clearTimeout($),E.terminate(),l.delete(E),S(z))},E.onerror=()=>{clearTimeout($),E.terminate(),l.delete(E),S(z)},E.postMessage({type:"batch_jscad_to_stl",results:z,configVersion:0})}),g=new Set;let x=0,k=0,u=0;const y=Math.min(4,navigator.hardwareConcurrency||2),v=async z=>{var $;if(c())return;g.add(z.name),a(x,t.length,Array.from(g).join(", "));const S=z.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled",E=p.folder(S);if(!E){g.delete(z.name),x++,a(x,t.length,Array.from(g).join(", "));return}try{const A=await h(z.config,e);let D=A;if(A.cases&&Object.keys(A.cases).length>0&&(D=await b(A)),c())return;E.file("config.yaml",z.config);const I=E.folder("outputs");if(I){if(($=D.demo)!=null&&$.svg&&I.file("demo.svg",D.demo.svg),D.outlines){let w=null;for(const[j,L]of Object.entries(D.outlines))(s||!j.startsWith("_"))&&(L.dxf||L.svg)&&(w||(w=I.folder("outlines")),w&&(L.dxf&&w.file(`${j}.dxf`,L.dxf),L.svg&&w.file(`${j}.svg`,L.svg)))}if(D.pcbs&&Object.keys(D.pcbs).length>0){const w=I.folder("pcbs");if(w)for(const[j,L]of Object.entries(D.pcbs)){const R=j.endsWith(".kicad_pcb")?j:`${j}.kicad_pcb`;w.file(R,L)}}if(D.cases){let w=null;for(const[j,L]of Object.entries(D.cases)){const R=!!L.jscad,F=!!L.stl;(R||F)&&(w||(w=I.folder("cases")),w&&(L.jscad&&w.file(`${j}.jscad`,L.jscad),L.stl&&w.file(`${j}.stl`,L.stl)))}}if(s){const w=I.folder("debug");if(w){w.file("raw.txt",z.config);for(const[j,L]of Object.entries(D))["canonical","points","units"].includes(j)&&w.file(`${j}.yaml`,JSON.stringify(L,null,2))}}}e&&e.length>0&&Ye(E,e),k++}catch(A){u++,console.error(`Failed to compile config ${z.name}:`,A),E.file("config.yaml",z.config),E.file("error.txt",`Compilation failed: ${A instanceof Error?A.message:String(A)}`)}finally{g.delete(z.name),x++,a(x,t.length,Array.from(g).join(", "))}};try{const z=[...t],S=[],E=async()=>{if(c()||z.length===0)return;const I=z.shift();await v(I),await E()};for(let I=0;I<Math.min(y,z.length);I++)S.push(E());if(await Promise.all(S),c()){l.forEach(I=>I.terminate()),l.clear();return}a(t.length,t.length,"Creating ZIP...");const $=await p.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),D=`ergogen-export-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;return Ke.saveAs($,D),{succeededCount:k,failedCount:u}}finally{l.forEach(z=>z.terminate()),l.clear()}}},Pi=t=>!t||!Array.isArray(t)?t:t.filter(e=>{if(!Array.isArray(e)||e.length!==3)return!0;const[s]=e;return!(s==="outline"&&!ae("outlines")||s==="template"&&!ae("templates"))}),Ii=t=>{if(!t||!Array.isArray(t))return null;const e=t.some(a=>Array.isArray(a)&&a[0]==="outline"),s=t.some(a=>Array.isArray(a)&&a[0]==="template"),r=e&&!ae("outlines"),i=s&&!ae("templates");if(r||i){const a=[];return r&&a.push("outlines"),i&&a.push("templates"),`Custom ${a.join(" and ")} were skipped because the respective feature flags are disabled in settings.`}return null},Li=t=>{if(!t||typeof t!="object")return null;const e=t;if(!e.pcbs||typeof e.pcbs!="object")return null;const s=e.pcbs;for(const r of Object.values(s))if(r&&typeof r=="object"&&(!r.template||r.template==="kicad5")){const i=r.footprints;if(i&&typeof i=="object"){for(const a of Object.values(i))if(a&&typeof a=="object"&&typeof a.what=="string"&&a.what.startsWith("ceoloide"))return'KiCad 5 is deprecated. Please add "template: kicad8" to your PCB definitions to avoid errors when opening PCB files with KiCad 8 or newer.'}}return null},zi=(t,e)=>{if(t&&typeof t=="object"){const s=t;return s.points&&e?{...s,pcbs:void 0,cases:void 0}:s}return t},Ge=(t,e)=>{if(typeof window>"u")return e;try{const s=localStorage.getItem(t);return s!==null?JSON.parse(s):e}catch{return e}},en=()=>({debug:Ge("ergogen:config:debug",!1),autoGen:Ge("ergogen:config:autoGen",!0),autoGen3D:Ge("ergogen:config:autoGen3D",!0),kicanvasPreview:Ge("ergogen:config:kicanvasPreview",!0),stlPreview:Ge("ergogen:config:stlPreview",!0),sendUsageMetrics:_t()}),nr=f.createContext(null),Ae=()=>typeof window<"u"&&window.crypto&&window.crypto.randomUUID?window.crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,t=>{const e=Math.random()*16|0;return(t==="x"?e:e&3|8).toString(16)}),st=(t,e)=>{let s=0;for(const r of t){const i=r.name.match(e);if(i){const a=parseInt(i[1],10);!isNaN(a)&&a>s&&(s=a)}}return s+1},xt="ergogen:deleted-config",Di=t=>{try{const e=localStorage.getItem(xt),s={version:1,configs:[]};if(e){const i=JSON.parse(e);i&&Array.isArray(i.configs)&&(s.configs=i.configs,i.version!==void 0&&(s.version=i.version))}const r={...t,deletedAt:new Date().toISOString()};s.configs.push(r),localStorage.setItem(xt,JSON.stringify(s))}catch(e){console.error("Failed to save deleted config to storage:",e)}},tn=()=>{try{const t=localStorage.getItem(xt);if(!t)return;const e=JSON.parse(t);if(!e||!Array.isArray(e.configs))return;let s=e.configs;const r=Date.now(),i=90*24*60*60*1e3;s=s.filter(c=>{const p=new Date(c.deletedAt).getTime();return r-p<=i}),s.length>100&&(s.sort((c,p)=>{const m=new Date(c.updatedAt).getTime(),l=new Date(p.updatedAt).getTime();return m-l}),s=s.slice(s.length-100));const a={version:e.version||1,configs:s};localStorage.setItem(xt,JSON.stringify(a))}catch(t){console.error("Failed to prune deleted configs:",t)}},on=t=>{if(!t)return;let e="";if(typeof t=="string")e=t;else if(Array.isArray(t))e=t.join("");else return;return e=e.replace(/width="[^"]+"/,'width="284px"').replace(/height="[^"]+"/,'height="134px"'),e=e.replace(/<svg/,'<svg style="background-color: rgb(51,51,51);"'),e=e.replaceAll(/stroke="#000"/g,'stroke="#AAA"'),e=e.replaceAll(/stroke:#000/g,"stroke:#AAA"),e},Ai=()=>{if(typeof window>"u")return{version:2,activeConfigId:null,configs:[]};const t=localStorage.getItem(lo);if(t)try{const e=JSON.parse(t);if(e&&typeof e.version=="number"){const s=new Date().toISOString(),r=(e.configs||[]).map(i=>({...i,createdAt:i.createdAt||s,updatedAt:i.updatedAt||s}));return{...e,configs:r}}}catch(e){console.error("Failed to parse multi-config storage:",e)}return{version:2,activeConfigId:null,configs:[]}},ce=(t,e,s=2)=>{if(typeof window>"u")return;const r={version:s,activeConfigId:e,configs:t};localStorage.setItem(lo,JSON.stringify(r))},Ri=()=>{const t=Ai();if(typeof window>"u")return t;const e=localStorage.getItem(Qt),s=localStorage.getItem(Zt);let r="";if(e)try{r=JSON.parse(e)}catch{r=e}else if(s)try{r=JSON.parse(s)}catch{r=s}if(r&&r.trim()!==""){if(!t.configs.some(a=>a.name==="Legacy Config")){const a=Ae(),c={id:a,name:"Legacy Config",config:r,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};t.configs.push(c),t.activeConfigId=a,ce(t.configs,a,2)}localStorage.removeItem(Qt),localStorage.removeItem(Zt)}return t},Ni=({initialInjectionInput:t,hashError:e,children:s})=>{const[r]=f.useState(()=>{if(typeof window>"u")return!1;const C=localStorage.getItem(Qt),P=localStorage.getItem(Zt);return!!(C||P)}),[i]=f.useState(()=>{if(typeof window>"u")return 2;const C=localStorage.getItem(lo);if(C)try{const P=JSON.parse(C);if(P&&typeof P.version=="number")return P.version}catch(P){console.warn("Failed to parse loaded version:",P)}return 1}),[a]=f.useState(()=>Ri()),[c,p]=f.useState(()=>a.configs),[m,l]=f.useState(()=>a.activeConfigId),[h,b]=f.useState(!1),[g,x]=f.useState(null),[k,u]=f.useState(()=>{if(a.activeConfigId){const C=a.configs.find(P=>P.id===a.activeConfigId);return C?C.config:""}return""}),y=f.useRef(c),v=f.useRef(m),z=f.useRef(h),S=f.useRef(g),E=f.useRef(k);f.useEffect(()=>{y.current=c},[c]),f.useEffect(()=>{v.current=m},[m]),f.useEffect(()=>{z.current=h},[h]),f.useEffect(()=>{S.current=g},[g]),f.useEffect(()=>{E.current=k},[k]);const $=f.useRef(k);f.useEffect(()=>{$.current=k},[k]);const A=f.useCallback(C=>{$.current=C},[]),D=f.useCallback(()=>$.current,[]),I=f.useRef(void 0),w=f.useRef(null),j=f.useRef(null),L=f.useCallback(()=>{j.current&&(clearTimeout(j.current.timeoutId),j.current=null)},[]),R=f.useCallback(()=>{const C=j.current;C&&(L(),M(C.name,C.payload))},[L]),F=f.useCallback(()=>{if(R(),w.current){const{timeoutId:C,payload:P,configId:O}=w.current;clearTimeout(C),M("keyboard_generated",P),I.current=O,w.current=null}},[R]),N=f.useCallback(()=>{I.current=void 0,R(),w.current&&(clearTimeout(w.current.timeoutId),w.current=null)},[R]),[B,Z]=Ko("ergogen:injection",t),[Y,ee]=f.useState(null),[X,H]=f.useState(null),[W,V]=f.useState(null),[_,U]=f.useState(null),[T,J]=f.useState(null),[G,re]=f.useState(0),[te,Oe]=Ko("ergogen:settings",en()),fe=(te==null?void 0:te.debug)??!1,me=(te==null?void 0:te.autoGen)??!0,ue=(te==null?void 0:te.autoGen3D)??!0,Pe=(te==null?void 0:te.kicanvasPreview)??!0,he=(te==null?void 0:te.stlPreview)??!0,[je,gr]=f.useState(_t),St=f.useRef(te);St.current=te;const co=f.useRef(me);co.current=me;const Et=f.useRef(je);Et.current=je;const be=f.useCallback(C=>{const P=St.current||en(),O=C(P);St.current=O,Oe(O)},[Oe]),uo=f.useCallback(C=>{be(P=>{const O=typeof C=="function"?C(P.debug):C;return{...P,debug:O}})},[be]),po=f.useCallback(C=>{be(P=>{const O=typeof C=="function"?C(P.autoGen):C;return{...P,autoGen:O}})},[be]),fo=f.useCallback(C=>{be(P=>{const O=typeof C=="function"?C(P.autoGen3D):C;return{...P,autoGen3D:O}})},[be]),ho=f.useCallback(C=>{be(P=>{const O=typeof C=="function"?C(P.kicanvasPreview):C;return{...P,kicanvasPreview:O}})},[be]),go=f.useCallback(C=>{be(P=>{const O=typeof C=="function"?C(P.stlPreview):C;return{...P,stlPreview:O}})},[be]),We=f.useCallback((C,P,O)=>{if(L(),O||!co.current){M(C,P);return}const q=setTimeout(()=>{j.current=null,M(C,P)},Qo);j.current={name:C,payload:P,timeoutId:q}},[L]),mo=f.useCallback(C=>{const P=typeof C=="function"?C(Et.current):C;Et.current=P,Ur(P),gr(P),be(O=>({...O,sendUsageMetrics:P}))},[be]);f.useEffect(()=>{Kn()},[je]);const[$e,bo]=f.useState(!1),[xo,mr]=f.useState(!1),[wo,yo]=f.useState(!1),[ko,_o]=f.useState(!0),[vo,jo]=f.useState(!0),[$o,xe]=f.useState(!1),[Co,et]=f.useState(!1),ie=f.useRef(null),we=f.useRef(null),tt=f.useRef(0),[So,ot]=f.useState(!1),Eo=f.useRef(!0),Pt=f.useRef(null);f.useEffect(()=>{tn()},[]),f.useEffect(()=>{e&&ee(e)},[e]);const Po=f.useCallback(()=>ee(null),[]),Io=f.useCallback(()=>H(null),[]),Lo=f.useCallback(()=>V(null),[]),zo=f.useCallback(()=>U(null),[]),nt=f.useCallback(C=>{var q,oe,K,ne,le,ke;const P=C.data;if(P.requestId&&P.requestId.startsWith("background-preview-")){const Q=P.requestId.substring(19);if(P.type==="success"&&P.results){const _e=P.results,Le=((oe=(q=_e.outlines)==null?void 0:q.preview)==null?void 0:oe.svg)||((K=_e.demo)==null?void 0:K.svg),Fe=on(Le);Fe&&p(Be=>{const Me=Be.map(se=>se.id===Q?{...se,previewSvg:Fe}:se);return ce(Me,v.current,2),Me})}else P.type==="error"&&console.warn(`Background generation failed for config ${Q}:`,P.error);return}const O=!!(P.requestId&&P.requestId.startsWith("ergogen-manual-"));if(P.type==="error"){console.error("--- Ergogen worker error:",P.error),ee(P.error),xe(!1),ot(!1),We("generation_failed",{error_message:P.error||"Unknown worker error",stored_configs_count:y.current.length,trigger:O?"manual":"auto"},O);return}if(P.type==="success")if(P.warnings&&P.warnings.length>0&&H(Q=>(Q?Q+`
`:"")+P.warnings.join(`
`)),P.results){const Q=P.results,_e=Pt.current?performance.now()-Pt.current:0;We("generation_completed",{duration_ms:Math.round(_e),points_count:Q.points?Object.keys(Q.points).length:0,pcbs_count:Q.pcbs?Object.keys(Q.pcbs).length:0,cases_count:Q.cases?Object.keys(Q.cases).length:0,has_outlines:!!Q.outlines,stored_configs_count:y.current.length,trigger:O?"manual":"auto"},O);try{const se=pe.dump(Q.canonical||{}),Ce=pe.dump(Q.points||{}),ve=Kr(se,Ce,Math.round(_e),I.current);if(ve.config_id!==I.current){w.current&&clearTimeout(w.current.timeoutId);const _r=setTimeout(()=>{M("keyboard_generated",ve),I.current=ve.config_id,w.current=null},Qo);w.current={timeoutId:_r,payload:ve,configId:ve.config_id}}}catch(se){console.error("Failed to generate keyboard configuration analytics:",se)}const Le=((le=(ne=Q.outlines)==null?void 0:ne.preview)==null?void 0:le.svg)||((ke=Q.demo)==null?void 0:ke.svg),Fe=on(Le),Be=v.current;Fe&&Be&&p(se=>{const Ce=se.map(ve=>ve.id===Be?{...ve,previewSvg:Fe}:ve);return ce(Ce,Be,2),Ce});let Me=!1;if(he&&Q.cases&&Object.keys(Q.cases).length>0){for(const se of Object.keys(Q.cases)){const Ce=Q.cases[se];Ce!=null&&Ce.jscad&&(Q.cases[se].stl=void 0)}if(we.current){Me=!0,ot(!0);const se={type:"batch_jscad_to_stl",results:Q,configVersion:tt.current};we.current.postMessage(se)}}J(Q),re(se=>se+1),Me||xe(!1)}else xe(!1);else xe(!1)},[he,We]),Do=f.useCallback(C=>{const P=C.data;P.configVersion===tt.current&&(P.type==="error"?(console.error("--- JSCAD worker error:",P.error),ot(!1),xe(!1)):P.type==="success"&&P.results&&(J(P.results),re(O=>O+1),ot(!1),xe(!1)))},[]);f.useEffect(()=>(ie.current||(ie.current=qe(),ie.current?(ie.current.onmessage=nt,ie.current.onerror=C=>{console.error("Ergogen worker error:",C),Ve(C.message||"Worker crash",!1,"ergogen_worker")},et(!0)):console.warn("Failed to initialize Ergogen worker.")),we.current||(we.current=so(),we.current?(we.current.onmessage=Do,we.current.onerror=C=>{console.error("JSCAD worker error:",C),Ve(C.message||"Worker crash",!1,"jscad_worker")}):console.warn("Failed to initialize JSCAD worker.")),()=>{ie.current&&(ie.current.terminate(),ie.current=null,et(!1)),we.current&&(we.current.terminate(),we.current=null)}),[nt,Do]),f.useEffect(()=>{const C=()=>{document.visibilityState==="hidden"&&F()};return window.addEventListener("visibilitychange",C),window.addEventListener("pagehide",F),()=>{window.removeEventListener("visibilitychange",C),window.removeEventListener("pagehide",F),F()}},[F]);const It=f.useRef({debug:fe,autoGen:me,autoGen3D:ue,kicanvasPreview:Pe,stlPreview:he,sendUsageMetrics:je});f.useEffect(()=>{const C={debug:fe,autoGen:me,autoGen3D:ue,kicanvasPreview:Pe,stlPreview:he,sendUsageMetrics:je},{sendUsageMetrics:P,...O}=C;if(Eo.current)Eo.current=!1,It.current=C,M("settings_loaded",{...O});else{const q=It.current,oe=Object.keys(C).find(K=>C[K]!==q[K]);It.current=C,M("setting_changed",{...oe?{setting_name:oe,setting_value:C[oe]}:{},...O})}},[fe,me,ue,Pe,he,je]);const Ao=f.useCallback(C=>{let P="UNKNOWN",O=null;try{O=JSON.parse(C),P="json"}catch{}try{O=pe.load(C),P="yaml"}catch{}return[P,O]},[]),rt=f.useCallback(async(C,P,O={pointsonly:!0})=>{const q=C===void 0||C===E.current?$.current??E.current:C;if(!q)return;const oe=Pi(P),[,K]=Ao(q);ee(null),H(null),V(null),xe(!0),Pt.current=performance.now(),tt.current+=1;const ne=Li(K);ne&&H(ne);const le=Ii(P);le&&V(le);const ke=zi(K,O.pointsonly)||q,Q=O.isManual?"ergogen-manual":"ergogen-generate";try{ie.current?ie.current.postMessage({type:"generate",inputConfig:ke,injectionInput:oe,requestId:`${Q}-${tt.current}-${Date.now()}`,options:{debug:fe,svg:!0}}):console.error("Worker not available for processing request.")}catch(_e){xe(!1);const Le=typeof _e=="string"?_e:String(_e);ee(Le),We("generation_failed",{error_message:Le,stored_configs_count:y.current.length,trigger:O.isManual?"manual":"auto"},!!O.isManual);return}},[Ao,ee,H,V,xe,fe,We]),Ie=f.useMemo(()=>Rn(rt,300),[rt]),Se=f.useCallback(async(C,P,O={pointsonly:!0})=>{Ie.cancel(),await rt(C,P,O)},[Ie,rt]),it=f.useCallback(C=>{const P=E.current,O=typeof C=="function"?C(P):C;if(O!==P)if(u(O),z.current){if(O!==S.current){const oe=`Shared Config ${st(y.current,/^Shared\s+Config\s+(\d+)$/)}`,K=Ae(),ne=new Date().toISOString(),le={id:K,name:oe,config:O||"",createdAt:ne,updatedAt:ne},ke=[...y.current,le];p(ke),l(K),b(!1),x(null),ce(ke,K)}}else{const q=v.current;if(q){const oe=y.current.map(K=>K.id===q?{...K,config:O||"",updatedAt:new Date().toISOString()}:K);p(oe),ce(oe,q)}else{const K=`Untitled ${st(y.current,/^Untitled\s+(\d+)$/)}`,ne=Ae(),le=new Date().toISOString(),ke={id:ne,name:K,config:O||"",createdAt:le,updatedAt:le},Q=[...y.current,ke];p(Q),l(ne),ce(Q,ne)}}},[]),Ro=f.useCallback(C=>{if(N(),J(null),C===null)l(null),v.current=null,b(!1),x(null),u(""),E.current="",ce(y.current,null);else{const P=y.current.find(O=>O.id===C);P&&(l(C),v.current=C,b(!1),x(null),u(P.config),E.current=P.config,ce(y.current,C),M("config_selected",{stored_configs_count:y.current.length}))}},[N]),No=f.useCallback((C,P)=>{N(),J(null);const O=st(y.current,/^Untitled\s+(\d+)$/),q=P||`Untitled ${O}`,oe=Ae(),K=new Date().toISOString(),ne={id:oe,name:q,config:C,createdAt:K,updatedAt:K},le=[...y.current,ne];return p(le),l(oe),b(!1),x(null),u(C),M("config_created",{stored_configs_count:le.length}),y.current=le,v.current=oe,E.current=C,ce(le,oe),oe},[N]),Uo=f.useCallback((C,P)=>{const O=P.trim();if(!O)return ee("Configuration name cannot be empty"),!1;const q=y.current.find(ne=>ne.id===C);if(!q)return!1;if(q.name===O)return!0;if(y.current.some(ne=>ne.id!==C&&ne.name.trim().toLowerCase()===O.toLowerCase()))return ee(`A configuration named "${O}" already exists.`),!1;const K=y.current.map(ne=>ne.id===C?{...ne,name:O,updatedAt:new Date().toISOString()}:ne);return p(K),y.current=K,ce(K,v.current),M("config_renamed",{stored_configs_count:K.length}),!0},[ee]),Oo=f.useCallback(C=>{N(),J(null);const P=y.current.find(O=>O.id===C);if(P){const O=Ae(),q=new Date().toISOString(),oe={id:O,name:`${P.name} (Copy)`,config:P.config,createdAt:q,updatedAt:q},K=[...y.current,oe];p(K),l(O),b(!1),x(null),u(P.config),y.current=K,v.current=O,E.current=P.config,ce(K,O),M("config_duplicated",{stored_configs_count:K.length})}},[N]),Wo=f.useCallback(C=>{N();const P=v.current,O=y.current.find(ne=>ne.id===C),q=y.current.filter(ne=>ne.id!==C);p(q),y.current=q;const oe=P===C;y.current.length<=1||oe?(J(null),l(null),v.current=null,u(""),E.current="",ce(q,null)):ce(q,P),O&&Di(O),M("config_deleted",{stored_configs_count:q.length})},[N]),Fo=f.useCallback(C=>{N(),J(null),b(!0),x(C),u(C)},[N]),Bo=f.useCallback(()=>{if(!z.current)return;const P=`Shared Config ${st(y.current,/^Shared\s+Config\s+(\d+)$/)}`,O=Ae(),q=new Date().toISOString(),oe={id:O,name:P,config:E.current||"",createdAt:q,updatedAt:q},K=[...y.current,oe];p(K),y.current=K,l(O),v.current=O,b(!1),x(null),ce(K,O)},[]),Mo=f.useCallback(()=>{tn()},[]),To=f.useCallback(async()=>{await Ci(y.current,B,fe,he)},[B,fe,he]),Go=f.useCallback(async()=>{await Si(y.current,B)},[B]),Ho=f.useMemo(()=>{if(h)return"Shared Config";if(m){const C=c.find(P=>P.id===m);return C?C.name:""}return""},[h,m,c]),br=f.useMemo(()=>({setInjectionInput:Z,setConfigInput:it,generateNow:Se,getCurrentInjections:()=>B||[],setError:ee}),[B,Se,Z,it,ee]),{currentConflict:Lt,processInjectionsWithConflictResolution:xr,handleConflictResolution:wr,handleConflictCancel:yr}=$t(br),{isLoading:Vo}=vi({processInjectionsWithConflictResolution:xr,setError:ee});f.useEffect(()=>{if(e||Vo)return;!new URLSearchParams(window.location.search).get("github")&&k&&Se(k,B,{pointsonly:!1})},[Vo]);const Jo=f.useRef($e);f.useEffect(()=>{Jo.current&&!$e&&(console.log("Settings panel closed. Restarting Ergogen worker to clear stale custom libraries..."),ie.current&&(ie.current.terminate(),ie.current=null,et(!1),console.log("Ergogen worker terminated.")),console.log("Initializing fresh Ergogen worker..."),ie.current=qe(),ie.current?(ie.current.onmessage=nt,ie.current.onerror=C=>{console.error("Ergogen worker error:",C),Ve(C.message||"Worker crash",!1,"ergogen_worker")},et(!0),console.log("Ergogen worker initialized.")):console.warn("Failed to initialize Ergogen worker."),k&&Se(k,B,{pointsonly:!ue})),Jo.current=$e},[$e,k,B,ue,Se,nt]),f.useEffect(()=>{localStorage.setItem("ergogen:injection",JSON.stringify(B)),me&&!$e&&Ie(k,B,{pointsonly:!ue})},[k,B,me,ue,$e,Ie]),f.useEffect(()=>{Co&&(i===1||r)&&(console.log("Version 1 or legacy configuration detected on load. Triggering background preview generation for all configs missing a preview SVG..."),ce(y.current,v.current,2),y.current.forEach(C=>{var P;C.previewSvg||(console.log(`Triggering background preview generation for: ${C.name}`),(P=ie.current)==null||P.postMessage({type:"generate",inputConfig:C.config,requestId:`background-preview-${C.id}`,options:{debug:!0,svg:!0}}))}))},[Co,i,r]);const kr=f.useMemo(()=>({configInput:k,getRealtimeConfigInput:D,updateRealtimeConfigInput:A,setConfigInput:it,configs:c,activeConfigId:m,activeConfigName:Ho,isPreview:h,selectConfig:Ro,createNewConfig:No,renameConfig:Uo,duplicateConfig:Oo,deleteConfig:Wo,exportAllConfigs:To,downloadAllConfigs:Go,loadPreview:Fo,savePreviewConfig:Bo,pruneDeletedConfigs:Mo,injectionInput:B,setInjectionInput:Z,processInput:Ie,generateNow:Se,error:Y,setError:ee,clearError:Po,deprecationWarning:X,clearWarning:Io,skippedWarning:W,clearSkippedWarning:Lo,info:_,setInfo:U,clearInfo:zo,results:T,resultsVersion:G,setResultsVersion:re,showSettings:$e,setShowSettings:bo,isBulkDownloadOpen:xo,setIsBulkDownloadOpen:mr,showSideNav:wo,setShowSideNav:yo,showConfig:ko,setShowConfig:_o,showDownloads:vo,setShowDownloads:jo,debug:fe,setDebug:uo,autoGen:me,setAutoGen:po,autoGen3D:ue,setAutoGen3D:fo,kicanvasPreview:Pe,setKicanvasPreview:ho,stlPreview:he,setStlPreview:go,sendUsageMetrics:je,setSendUsageMetrics:mo,isGenerating:$o,setIsGenerating:xe,isJscadConverting:So}),[k,D,A,it,c,m,Ho,h,Ro,No,Uo,Oo,Wo,To,Go,xo,Fo,Bo,Mo,B,Z,Ie,Se,Y,ee,Po,X,Io,W,Lo,_,U,zo,T,G,re,$e,bo,wo,yo,ko,_o,vo,jo,fe,uo,me,po,ue,fo,Pe,ho,he,go,je,mo,$o,xe,So]);return o.jsxs(nr.Provider,{value:kr,children:[s,Lt&&o.jsx(jt,{injectionName:Lt.name,injectionType:Lt.type,onResolve:wr,onCancel:yr,"data-testid":"conflict-resolution-dialog"})]})},ye=()=>f.useContext(nr),Ui=({className:t,options:e,"data-testid":s,"aria-label":r})=>{const i=ye(),a=f.useRef(null),c={configInput:void 0,setConfigInput:y=>{},updateRealtimeConfigInput:y=>{},injectionInput:void 0,generateNow:async()=>{},activeConfigId:null},{configInput:p,updateRealtimeConfigInput:m,setConfigInput:l,injectionInput:h,generateNow:b,activeConfigId:g}=i??c,x=f.useRef(Rn(y=>{l(y)},500)).current;f.useEffect(()=>()=>{x.cancel()},[x]),f.useEffect(()=>{if(a.current){if(a.current.hasTextFocus())return;const y=a.current.getValue();p!==void 0&&p!==y&&a.current.setValue(p)}},[p]);const k=f.useCallback(y=>{y!==void 0&&(m(y),x(y))},[x,m]),u=(y,v)=>{a.current=y,y.onDidBlurEditorText(()=>{x.flush()}),y.addAction({id:"generate-config",label:"Generate",keybindings:[v.KeyMod.CtrlCmd|v.KeyCode.Enter],run:()=>{const z=y.getValue();x.cancel(),m(z),l(z),b(z,h,{pointsonly:!1,isManual:!0})}})};return i?o.jsx("div",{className:t,"data-testid":s,"aria-label":r,children:o.jsx(Nn,{height:"100%",defaultLanguage:"yaml",language:"yaml",onChange:k,onMount:u,defaultValue:p,theme:"ergogen-theme",options:e||void 0},g||"preview")}):null},Oi=({className:t,options:e,injection:s,setInjection:r,"data-testid":i,"aria-label":a})=>{const c=ye(),p=async m=>{if(!m)return null;const l={...s,content:m};r(l)};return c?o.jsx(Wi,{className:t,"data-testid":i,"aria-label":a,children:o.jsx(Nn,{height:"100%",defaultLanguage:"javascript",language:"javascript",onChange:p,value:s.content,theme:"ergogen-theme",options:e||void 0})}):null},Wi=d.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: 0.5rem;
`,Fi=wt`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Bi=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;

  @media (max-width: 639px) {
    padding-bottom: 0.75rem;
  }
`,Mi=d.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${n.fontSizes.bodySmall};
  cursor: ${t=>t.$hasPreview?"pointer":"default"};
  border-bottom: ${t=>t.$active?`2px solid ${n.colors.accent}`:"2px solid transparent"};
  border-top: 2px solid transparent;
  opacity: ${t=>t.$disabled?.5:1};
  color: ${t=>t.$disabled?n.colors.textDarker:n.colors.white};
`,Ti=d.div`
  white-space: nowrap;
  display: flex;
  gap: 10px;
  align-items: center;
`,Gi=d.a`
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
`,Hi=d.a`
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
    animation: ${Fi} 1s linear infinite;
  }
`,Vi=({fileName:t,extension:e,content:s,preview:r,setPreview:i,previewKey:a,"data-testid":c})=>{const p=e==="stl"&&!s||e==="kicad_pcb"&&!r,m=e==="stl"&&!s,l=()=>{if(m)return;M("download_button_clicked",{download_type:e,source:"downloads_panel"});const g=document.createElement("a"),x=new Blob([s],{type:"octet/stream"});g.href=URL.createObjectURL(x),g.download=`${t}.${e}`,document.body.appendChild(g),g.click()},h=()=>{r&&!p&&i(r)},b=c?`${c}-${e}`:void 0;return o.jsxs(Bi,{"data-testid":b,children:[o.jsxs(Mi,{$active:a===(r==null?void 0:r.key),$hasPreview:!!r,$disabled:p,onClick:h,"data-testid":b&&`${b}-preview`,children:[t,".",e]}),o.jsx(Ti,{children:m?o.jsx(Hi,{"aria-label":`Generating ${t}.${e}`,"data-testid":b&&`${b}-loading`,children:o.jsx("span",{className:"material-symbols-outlined",children:"progress_activity"})}):o.jsx(Gi,{onClick:l,"aria-label":`Download ${t}.${e}`,"data-testid":b&&`${b}-download`,children:o.jsx("span",{className:"material-symbols-outlined",children:"download"})})})]})},Ji=d.h3`
  font-size: ${n.fontSizes.base};
  font-weight: ${n.fontWeights.semiBold};
  color: ${n.colors.white};
  margin: 0 0 1rem;

  @media (max-width: 639px) {
    display: none;
  }
`,Ki=d.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;

  @media (max-width: 639px) {
    padding: 0.5rem;
  }
`,qi=d.div`
  font-size: ${n.fontSizes.sm};
  color: ${n.colors.textDarkest};
  font-style: italic;
  padding: 0.5rem 0;
`,Yi=({setPreview:t,previewKey:e,"data-testid":s})=>{var m,l;const r=[],i=ye();if(!i)return null;const{configInput:a,results:c}=i;if(c!=null&&c.demo&&r.push({fileName:"raw",extension:"txt",content:a??"",previewKey:"raw",preview:{key:"raw",extension:"txt",content:a??""}},{fileName:"canonical",extension:"yaml",content:pe.dump(c.canonical),previewKey:"canonical",preview:{key:"canonical",extension:"yaml",content:pe.dump(c.canonical)}},{fileName:"demo",extension:"dxf",content:((m=c.demo)==null?void 0:m.dxf)??"",previewKey:"demo.svg",preview:{key:"demo.svg",extension:"svg",content:((l=c.demo)==null?void 0:l.svg)??""}},{fileName:"points",extension:"yaml",content:pe.dump(c.points),previewKey:"points",preview:{key:"points",extension:"yaml",content:pe.dump(c.points)}},{fileName:"units",extension:"yaml",content:pe.dump(c.units),previewKey:"units",preview:{key:"units",extension:"yaml",content:pe.dump(c.units)}}),c!=null&&c.outlines)for(const[h,b]of Object.entries(c.outlines))r.push({fileName:h,extension:"dxf",content:b.dxf??"",previewKey:`outlines.${h}.svg`,preview:{key:`outlines.${h}.svg`,extension:"svg",content:b.svg??""}});if(c!=null&&c.cases){for(const[h,b]of Object.entries(c.cases))if(r.push({fileName:h,extension:"jscad",content:b.jscad??"",previewKey:`cases.${h}`,preview:{key:`cases.${h}`,extension:"jscad",content:b.jscad??""}}),i.stlPreview&&b.jscad){const g=!!b.stl;r.push({fileName:h,extension:"stl",content:b.stl??"",previewKey:g?`cases.${h}.stl`:"",preview:g?{key:`cases.${h}.stl`,extension:"stl",content:b.stl??""}:void 0})}}if(c!=null&&c.pcbs)for(const[h,b]of Object.entries(c.pcbs)){const x=String(b).match(/version "?([0-9]+)"?/),k=x&&x.length>1?Number(x[1]):-1;r.push({fileName:h,extension:"kicad_pcb",content:b,previewKey:i.kicanvasPreview&&k>20240101?`pcbs.${h}`:"",preview:i.kicanvasPreview&&k>20240101?{key:`pcbs.${h}`,extension:"kicad_pcb",content:b}:void 0})}const p=r.filter(h=>!(!i.debug&&(h.fileName.startsWith("_")||{units:"yaml",points:"yaml",canonical:"yaml",raw:"txt"}[h.fileName]===h.extension||i.stlPreview&&h.extension==="jscad")));return o.jsxs(Ki,{"data-testid":s,children:[o.jsx(Ji,{children:"Outputs"}),p.length>0?p.map((h,b)=>o.jsx(Vi,{...h,setPreview:t,previewKey:e,"data-testid":s&&`${s}-${h.fileName}`},b)):o.jsx(qi,{children:"No outputs"})]})},Xi=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
`,Zi=d.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${n.fontSizes.bodySmall};
  cursor: pointer;
  border-bottom: ${t=>t.$active?`2px solid ${n.colors.accent}`:"2px solid transparent"};
  border-top: 2px solid transparent;
`,Qi=d.div`
  white-space: nowrap;
  display: flex;
  gap: 6px;
  align-items: center;
`,rr=Un`
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
`,nn=d.a`
  ${rr}
`,es=d.a`
  ${rr}

  @media (min-width: 640px) {
    display: none;
  }
`,Nt=({injection:t,setInjectionToEdit:e,deleteInjection:s,previewKey:r,"data-testid":i})=>o.jsxs(Xi,{"data-testid":i,children:[o.jsx(Zi,{"data-testid":i&&`${i}-name`,$active:r===t.name,onClick:()=>e(t),children:t.name}),o.jsxs(Qi,{children:[o.jsx(es,{href:"#",onClick:a=>{a.preventDefault(),e(t)},"aria-label":`edit injection ${t.name}`,"data-testid":i&&`${i}-edit`,children:o.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),o.jsx(nn,{href:"#",onClick:a=>{a.preventDefault(),s(t)},"aria-label":`delete injection ${t.name}`,"data-testid":i&&`${i}-delete`,children:o.jsx("span",{className:"material-symbols-outlined",children:"delete"})}),o.jsx(nn,{target:"_blank",rel:"noopener noreferrer",download:`${t.name.split("/").reverse()[0]}.js`,href:window.URL.createObjectURL(new Blob([t.content],{type:"octet/stream"})),"aria-label":`download injection ${t.name}`,"data-testid":i&&`${i}-download`,children:o.jsx("span",{className:"material-symbols-outlined",children:"download"})})]})]}),Je=d.button`
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
`,gt=d.h3`
  font-size: ${n.fontSizes.base};
  font-weight: ${n.fontWeights.semiBold};
  color: ${n.colors.white};
  margin: 1.5rem 0.5rem 1rem 0.5rem;
`,rn=t=>{const r=new DOMParser().parseFromString(t,"image/svg+xml").querySelectorAll("path"),i=[];return r.forEach(a=>{const c=a.getAttribute("d");if(c&&c.trim()){const p=c.replace(/\\/g,"\\\\").replace(/"/g,'\\"');i.push(`        "${p}"`)}}),`const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
${i.join(`,
`)}
    ];
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
};`},Ut=d.div`
  display: flex;
  margin-left: 0.5rem;
  margin-left: 0.5rem;
  gap: 8px;
  margin-top: 0.5rem;
`,ze=d(Je)`
  flex-grow: 0;
  width: 34px;
  padding: 0;
`,ts=d.div`
  display: flex;
  margin-left: 0.5rem;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.5rem;
`,os=d.div`
  display: flex;
  margin-left: 0.5rem;
  border-bottom: 1px solid ${n.colors.border};
  margin-left: 0.5rem;
  gap: 16px;
`,Ot=d.button`
  background: none;
  border: none;
  color: ${t=>t.$active?n.colors.text:n.colors.textDark};
  padding: 0.75rem 0;
  cursor: pointer;
  font-size: ${n.fontSizes.bodySmall};
  font-weight: ${n.fontWeights.semiBold};
  border-bottom: 2px solid
    ${t=>t.$active?n.colors.accent:"transparent"};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${n.colors.text};
  }
`,ns=({setInjectionToEdit:t,deleteInjection:e,injectionToEdit:s,onInjectionSelect:r,"data-testid":i})=>{const a=[],c=[],p=[],m=f.useRef(null),l=f.useRef(null),h=ye(),[b,g]=f.useState("footprint"),[x,k]=f.useState("footprints"),{currentConflict:u,processInjectionsWithConflictResolution:y,handleConflictResolution:v,handleConflictCancel:z}=$t({setInjectionInput:w=>h==null?void 0:h.setInjectionInput(w),setConfigInput:w=>h==null?void 0:h.setConfigInput(w),generateNow:async(w,j,L)=>{await(h==null?void 0:h.generateNow(w,j,L))},getCurrentInjections:()=>(h==null?void 0:h.injectionInput)||[],setError:w=>h==null?void 0:h.setError(w)});if(!h)return null;const{injectionInput:S}=h;if(S&&Array.isArray(S)&&S.length>0)for(let w=0;w<S.length;w++){const j=S[w];if(j.length===3){let L=p;j[0]==="footprint"?L=a:j[0]==="outline"?L=c:j[0]==="template"&&(L=p),L.push({key:w,type:j[0],name:j[1],content:j[2]})}}const E=()=>{var L;const w=((L=h==null?void 0:h.injectionInput)==null?void 0:L.length)||0,j={key:w,type:"footprint",name:`custom_footprint_${w+1}`,content:`module.exports = {
  params: {
    designator: '',
  },
  body: p => \`\`
}`};M("injection_created",{injection_type:"footprint"}),t(j),r&&r()},$=()=>{var L;const w=((L=h==null?void 0:h.injectionInput)==null?void 0:L.length)||0,j={key:w,type:"outline",name:`custom_outline_${w+1}`,content:`const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
        ""  // Add your SVG path(s) here
    ];
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
};`};M("injection_created",{injection_type:"outline"}),t(j),r&&r()},A=()=>{var L;const w=((L=h==null?void 0:h.injectionInput)==null?void 0:L.length)||0,j={key:w,type:"template",name:`custom_template_${w+1}`,content:`const m = require('makerjs')
const version = require('../../package.json').version

module.exports = {
    convert_outline: (model, layer) => {
        return \`\`;  // Return your converted outlines
    },
    body: params => {
        return \`\`;  // Add your template text here
    }
}`};M("injection_created",{injection_type:"template"}),t(j),r&&r()},D=async w=>{const j=w.target.files;if(!j||j.length===0)return;const L=[];for(let R=0;R<j.length;R++){const F=j[R];if(F.name.endsWith(".js")){const N=await F.text(),B=F.name.replace(/\.js$/,"");L.push([b,B,N])}else if(b==="outline"&&F.name.endsWith(".svg")){const N=await F.text(),B=rn(N),Z=F.name.replace(/\.svg$/,"");L.push([b,Z,B])}}L.length>0&&(M("injection_uploaded",{injection_type:b,source:"file",file_count:L.length}),await y(L,h.configInput||"")),w.target.value=""},I=async w=>{const j=w.target.files;if(!j||j.length===0)return;const L=[];for(let R=0;R<j.length;R++){const F=j[R];if(F.name.endsWith(".js")){const N=await F.text(),B=F.webkitRelativePath.split("/");B.shift();const Z=B.join("/").replace(/\.js$/,"");L.push([b,Z,N])}else if(b==="outline"&&F.name.endsWith(".svg")){const N=await F.text(),B=F.webkitRelativePath.split("/");B.shift();const Z=B.join("/").replace(/\.svg$/,""),Y=rn(N);L.push([b,Z,Y])}}L.length>0&&(M("injection_uploaded",{injection_type:b,source:"folder",file_count:L.length}),await y(L,h.configInput||"")),w.target.value=""};return o.jsxs(ts,{"data-testid":i,children:[u&&o.jsx(jt,{injectionName:u.name,injectionType:u.type,onResolve:v,onCancel:z,"data-testid":"conflict-resolution-dialog"}),o.jsx(gt,{children:"Custom Libraries"}),o.jsxs(os,{children:[o.jsx(Ot,{$active:x==="footprints",onClick:()=>{k("footprints"),g("footprint")},"data-testid":"tab-footprints",children:"Footprints"}),ae("outlines")&&o.jsx(Ot,{$active:x==="outlines",onClick:()=>{k("outlines"),g("outline")},"data-testid":"tab-outlines",children:"Outlines"}),ae("templates")&&o.jsx(Ot,{$active:x==="templates",onClick:()=>{k("templates"),g("template")},"data-testid":"tab-templates",children:"Templates"})]}),x==="footprints"&&o.jsxs(o.Fragment,{children:[a.map(w=>o.jsx(Nt,{injection:w,setInjectionToEdit:j=>{M("injection_editor_opened",{injection_type:j.type}),t(j),r&&r()},deleteInjection:e,previewKey:s.name,"data-testid":i&&`${i}-${w.name}`},w.key)),o.jsxs(Ut,{children:[o.jsx(Je,{onClick:E,"data-testid":"add-footprint","aria-label":"Add new custom footprint",title:"Add footprint",children:o.jsx("span",{className:"material-symbols-outlined",children:"add"})}),o.jsx(ze,{onClick:()=>{g("footprint"),setTimeout(()=>{var w;return(w=m.current)==null?void 0:w.click()},0)},"data-testid":"load-footprint-files","aria-label":"Load custom footprint files",title:"Load footprint files",children:o.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),o.jsx(ze,{onClick:()=>{g("footprint"),setTimeout(()=>{var w;return(w=l.current)==null?void 0:w.click()},0)},"data-testid":"load-footprint-folder","aria-label":"Load custom footprint folder",title:"Load footprint folder",children:o.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),x==="outlines"&&ae("outlines")&&o.jsxs(o.Fragment,{children:[c.map(w=>o.jsx(Nt,{injection:w,setInjectionToEdit:j=>{M("injection_editor_opened",{injection_type:j.type}),t(j),r&&r()},deleteInjection:e,previewKey:s.name,"data-testid":i&&`${i}-${w.name}`},w.key)),o.jsxs(Ut,{children:[o.jsx(Je,{onClick:$,"data-testid":"add-outline","aria-label":"Add new custom outline",title:"Add outline",children:o.jsx("span",{className:"material-symbols-outlined",children:"add"})}),o.jsx(ze,{onClick:()=>{g("outline"),setTimeout(()=>{var w;return(w=m.current)==null?void 0:w.click()},0)},"data-testid":"load-outline-files","aria-label":"Load custom outline files",title:"Load outline files",children:o.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),o.jsx(ze,{onClick:()=>{g("outline"),setTimeout(()=>{var w;return(w=l.current)==null?void 0:w.click()},0)},"data-testid":"load-outline-folder","aria-label":"Load custom outline folder",title:"Load outline folder",children:o.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),x==="templates"&&ae("templates")&&o.jsxs(o.Fragment,{children:[p.map(w=>o.jsx(Nt,{injection:w,setInjectionToEdit:j=>{M("injection_editor_opened",{injection_type:j.type}),t(j),r&&r()},deleteInjection:e,previewKey:s.name,"data-testid":i&&`${i}-${w.name}`},w.key)),o.jsxs(Ut,{children:[o.jsx(Je,{onClick:A,"data-testid":"add-template","aria-label":"Add new custom template",title:"Add template",children:o.jsx("span",{className:"material-symbols-outlined",children:"add"})}),o.jsx(ze,{onClick:()=>{g("template"),setTimeout(()=>{var w;return(w=m.current)==null?void 0:w.click()},0)},"data-testid":"load-template-files","aria-label":"Load custom template files",title:"Load template files",children:o.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),o.jsx(ze,{onClick:()=>{g("template"),setTimeout(()=>{var w;return(w=l.current)==null?void 0:w.click()},0)},"data-testid":"load-template-folder","aria-label":"Load custom template folder",title:"Load template folder",children:o.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),o.jsx("input",{type:"file",ref:m,onChange:D,accept:b==="outline"?".js,.svg":".js",multiple:!0,style:{display:"none"}}),o.jsx("input",{type:"file",ref:l,onChange:I,accept:b==="outline"?".js,.svg":".js",style:{display:"none"},webkitdirectory:"",directory:""})]})},rs=d.img`
  filter: invert();
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
`,is=d(vr.PanZoom)`
  overflow: hidden;
  height: 100%;

  &:focus-visible {
    outline: none;
  }
`,ss=({svg:t,width:e,height:s,"aria-label":r,"data-testid":i})=>o.jsx(is,{enableBoundingBox:!0,minZoom:.8,maxZoom:5,"aria-label":r,"data-testid":i,children:o.jsx(rs,{width:e||"100%",height:s||"100%",src:`data:image/svg+xml;utf8,${encodeURIComponent(t)}`,alt:"Ergogen SVG Output preview",draggable:"false"})}),Wt=({content:t,language:e,className:s,height:r,options:i,"aria-label":a,"data-testid":c})=>o.jsx("div",{className:s,"aria-label":a,"data-testid":c,children:o.jsx(jr,{height:r||"80vh",language:e,value:t,theme:"ergogen-theme",options:i||{readOnly:!0}})}),as=f.lazy(()=>Tn(()=>import("./PcbPreview-DsKQssW6.js"),__vite__mapDeps([0,1]))),ls=f.lazy(()=>Tn(()=>import("./StlPreview-DDbJYdgp.js"),__vite__mapDeps([2,1,3,4,5]))),ir=d.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: ${n.colors.background};
`,sr=d.img`
  width: 96px;
  height: 96px;
  opacity: 0.12;
  filter: grayscale(100%);
  -webkit-user-drag: none;
  user-drag: none;
`,cs=d.span`
  color: ${n.colors.textDarkest};
  font-size: ${n.fontSizes.sm};
  margin-top: 1rem;
  font-family: ${n.fonts.body};
  user-select: none;
`,sn=()=>o.jsxs(ir,{children:[o.jsx(sr,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"}),o.jsx(cs,{children:"Loading preview..."})]}),ds=({previewExtension:t,previewContent:e,previewKey:s,width:r="100%",height:i="100%",className:a,"data-testid":c,"aria-label":p})=>{if(!e||typeof e=="string"&&e===""||e instanceof ArrayBuffer&&e.byteLength===0||ArrayBuffer.isView(e)&&e.byteLength===0)return o.jsx(ir,{className:a,"data-testid":c,"aria-label":p,children:o.jsx(sr,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"})});const l=h=>{switch(h){case"svg":return o.jsx(ss,{svg:e,width:r,height:i,"aria-label":p||`SVG preview for ${s}`,"data-testid":c&&`${c}-svg`});case"yaml":return o.jsx(Wt,{language:"yaml",content:e,"aria-label":p||`YAML preview for ${s}`,"data-testid":c&&`${c}-yaml`});case"txt":return o.jsx(Wt,{language:"text",content:e,"aria-label":p||`Text preview for ${s}`,"data-testid":c&&`${c}-txt`});case"jscad":return o.jsx(Wt,{language:"javascript",content:e,"aria-label":p||`JSCAD code preview for ${s}`,"data-testid":c&&`${c}-jscad-text`});case"kicad_pcb":return o.jsx(f.Suspense,{fallback:o.jsx(sn,{}),children:o.jsx(as,{pcb:e,previewKey:s,"aria-label":p||`PCB preview for ${s}`,"data-testid":c&&`${c}-pcb`},s)});case"stl":return o.jsx(f.Suspense,{fallback:o.jsx(sn,{}),children:o.jsx(ls,{stl:e,"aria-label":p||`STL preview for ${s}`,"data-testid":c&&`${c}-stl`})});default:return"No preview available"}};return o.jsx("div",{className:a,"data-testid":c,"aria-label":p,children:l(t)})},Ft=({children:t,initialWidth:e=300,minWidth:s=10,maxWidth:r="100%",side:i="left",style:a,"data-testid":c})=>{const[p,m]=f.useState(e),l=f.useRef(!1),h=f.useRef(0),b=f.useRef(e),g=f.useRef(null),x=u=>{if(typeof u=="string"&&u.includes("%")){const y=parseFloat(u)/100;return window.innerWidth*y}else return typeof u=="string"&&u.includes("px")?parseFloat(u):typeof u=="number"?u:1/0};f.useEffect(()=>{const u=S=>{if(!l.current)return;const E=i==="left"?S.clientX-h.current:h.current-S.clientX,$=b.current+E,A=x(r),D=Math.max(s,Math.min($,A));m(D)},y=()=>{l.current&&(l.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},v=S=>{if(!l.current)return;S.preventDefault();const E=S.touches[0],$=i==="left"?E.clientX-h.current:h.current-E.clientX,A=b.current+$,D=x(r),I=Math.max(s,Math.min(A,D));m(I)},z=()=>{l.current&&(l.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",u),window.addEventListener("mouseup",y),window.addEventListener("touchmove",v,{passive:!1}),window.addEventListener("touchend",z),()=>{window.removeEventListener("mousemove",u),window.removeEventListener("mouseup",y),window.removeEventListener("touchmove",v),window.removeEventListener("touchend",z)}},[s,r,i]);const k=u=>{u.preventDefault(),u.stopPropagation(),l.current=!0,b.current=p,"touches"in u?h.current=u.touches[0].clientX:h.current=u.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};return o.jsxs(us,{ref:g,$side:i,style:{width:`${p}px`,...a},"data-testid":c,children:[t,o.jsx(ps,{$side:i,onMouseDown:k,onTouchStart:k,"data-testid":c&&`${c}-resize-handle`})]})},us=d.div`
  position: relative;
  flex-shrink: 0;
  flex-grow: 0;
  height: 100%;
  overflow: visible;
  border-right: ${t=>t.$side==="left"?`1px solid ${n.colors.border}`:"none"};
  border-left: ${t=>t.$side==="right"?`1px solid ${n.colors.border}`:"none"};

  @media (max-width: 639px) {
    width: 100% !important;
    border-right: none;
    border-left: none;
  }
`,ps=d.div`
  position: absolute;
  top: 0;
  ${t=>t.$side==="left"?"right: -4px;":"left: -4px;"}
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
`,eo=(t,e)=>{if(e===null)return null;if(t==="")return e;if(typeof e!="object")return;const s=t.split("."),r=s[0],i=s.slice(1).join(".");return Object.prototype.hasOwnProperty.call(e,r)?eo(i,e[r]):void 0};function ar(){if(typeof navigator<"u"){if("userAgentData"in navigator&&navigator.userAgentData){const t=navigator.userAgentData;if(t.platform&&/mac/i.test(t.platform))return!0}if(/Mac|iPhone|iPad|iPod/i.test(navigator.userAgent))return!0}return!1}const fs=d.input.attrs(t=>({type:"text",$size:t.$size||"0.5em"}))`
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
  margin: ${t=>t.$size};

  &:focus {
    border-color: ${n.colors.accent};
  }

  &::selection {
    background-color: ${n.colors.accent};
    color: ${n.colors.white};
  }
`,hs=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`,gs=d.label`
  display: flex;
  flex-direction: column;
  flex: 1;
  cursor: ${t=>t.$disabled?"not-allowed":"pointer"};
  user-select: none;
  text-align: left;
`,ms=d.span`
  color: ${n.colors.text};
  font-size: ${n.fontSizes.base};
  font-weight: ${n.fontWeights.semiBold};
`,bs=d.span`
  color: ${n.colors.textDarker};
  font-size: ${n.fontSizes.sm};
  margin-top: 0.25rem;
  line-height: 1.4;
`,xs=d.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`,ws=d.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: ${t=>t.$disabled?"not-allowed":"pointer"};
  opacity: ${t=>t.$disabled?.5:1};
`,ys=d.input`
  opacity: 0;
  width: 0;
  height: 0;
`,ks=d.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${t=>t.$checked?n.colors.accent:n.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`,_s=d.span`
  position: absolute;
  top: 2px;
  left: ${t=>t.$checked?"18px":"2px"};
  width: 16px;
  height: 16px;
  background-color: ${n.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,De=({optionId:t,label:e,description:s,setSelected:r,checked:i,disabled:a=!1,"aria-label":c})=>o.jsxs(hs,{children:[o.jsxs(gs,{htmlFor:t,$disabled:a,children:[o.jsx(ms,{children:e}),s&&o.jsx(bs,{children:s})]}),o.jsx(xs,{children:o.jsxs(ws,{$disabled:a,htmlFor:t,children:[o.jsx(ys,{type:"checkbox",id:t,checked:i,disabled:a,onChange:p=>r(p.target.checked),"data-testid":`option-${t}`,"aria-label":c}),o.jsx(ks,{$checked:i}),o.jsx(_s,{$checked:i})]})})]}),Re=d.button`
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
`,at=d.h4`
  font-size: ${n.fontSizes.sm};
  font-weight: ${n.fontWeights.semiBold};
  color: ${n.colors.textDarker};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 1.5rem 0.5rem 0.5rem 0.5rem;

  &:first-of-type {
    margin-top: 0.5rem;
  }
`,lt=d.div`
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
`,vs=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`,js=d.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  user-select: none;
  text-align: left;
`,$s=d.span`
  color: ${n.colors.text};
  font-size: ${n.fontSizes.base};
  font-weight: ${n.fontWeights.semiBold};
`,to=d.span`
  color: ${n.colors.textDarker};
  font-size: ${n.fontSizes.sm};
  margin-top: 0.25rem;
  line-height: 1.4;
`,Cs=d(to)`
  color: ${n.colors.warningDark};
`,Ss=d.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`,Es=({isAvailable:t,isInstalled:e,isInstalling:s,onInstall:r})=>{let i,a;return e?(i=o.jsx(to,{children:"The application is installed and available offline."}),a=o.jsx(de,{size:"sm",disabled:!0,"data-testid":"pwa-installed-button",children:"Installed"})):t?(i=o.jsx(to,{children:"Install the app locally to access it offline without network connectivity."}),s?a=o.jsx(de,{size:"sm",disabled:!0,"data-testid":"pwa-installing-button",children:"Installing..."}):a=o.jsx(de,{size:"sm",onClick:r,"data-testid":"pwa-install-button",children:"Install App"})):(i=o.jsx(Cs,{children:"PWA installation is not supported by your browser or environment."}),a=o.jsx(de,{size:"sm",disabled:!0,"data-testid":"pwa-unavailable-button",children:"Unavailable"})),o.jsxs(vs,{children:[o.jsxs(js,{children:[o.jsx($s,{children:"Offline App"}),i]}),o.jsx(Ss,{children:a})]})},Ps=(t,e,s,r)=>{const i={config:t,...e&&e.length>0?{injections:e}:{},guiVersion:yt.version,ergogenVersion:ao("github:ceoloide/ergogen#v4.3.0")},a=JSON.stringify(i);return On.compressToEncodedURIComponent(a)},Is=()=>new URLSearchParams(window.location.search).get("debug")!==null,Ls=t=>{var s;const e=Is();try{const r=On.decompressFromEncodedURIComponent(t);if(!r)return console.error("[Share] DECODE_ERROR: Failed to decompress encoded string"),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The encoded data could not be decompressed."};let i;try{i=JSON.parse(r)}catch(c){return console.error("[Share] DECODE_ERROR: Failed to parse decompressed JSON",{parseError:c,decompressedLength:r.length,decompressedPreview:r.substring(0,100)}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The decompressed data is not valid JSON."}}if(!i||typeof i!="object"||!("config"in i)||typeof i.config!="string")return console.error("[Share] VALIDATION_ERROR: Invalid object structure",{parsed:i,hasConfig:i&&typeof i=="object"&&"config"in i,configType:i&&typeof i=="object"&&"config"in i?typeof i.config:"N/A"}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link does not contain a valid configuration. The decoded data is missing required fields or has an invalid structure."};const a=i;return(!a.guiVersion||typeof a.guiVersion!="string")&&(a.guiVersion="0.9.0"),(!a.ergogenVersion||typeof a.ergogenVersion!="string")&&(a.ergogenVersion="github:ergogen/ergogen#v4.2.1"),"injections"in a&&a.injections!==void 0&&(!Array.isArray(a.injections)||!a.injections.every(c=>Array.isArray(c)&&c.length===3&&typeof c[0]=="string"&&typeof c[1]=="string"&&typeof c[2]=="string"))?(console.error("[Share] VALIDATION_ERROR: Invalid injections structure",{injections:a.injections,isArray:Array.isArray(a.injections)}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link contains invalid injections data. Injections must be an array of [type, name, content] tuples."}):(e&&console.log("[Share] DEBUG: Decoded configuration object",{configLength:a.config.length,hasInjections:a.injections!==void 0,injectionsCount:((s=a.injections)==null?void 0:s.length)??0,fullObject:a}),{success:!0,config:a})}catch(r){return console.error("[Share] DECODE_ERROR: Unexpected error during decoding",{error:r,errorMessage:r instanceof Error?r.message:String(r),errorStack:r instanceof Error?r.stack:void 0}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. An unexpected error occurred while decoding."}}},zs=t=>{const{config:e,injections:s,canonical:r}=t;let i=s;if(r&&s&&s.length>0){const m=cr(r);i=Ds(s,m)}const a=i&&i.length>0?i:void 0,c=Ps(e,a);return`${window.location.origin+window.location.pathname}#${c}`},lr=()=>{const t=window.location.hash;if(!t||t.length<=1)return null;const e=t.substring(1);return Ls(e)},cr=t=>{const e=new Set,s=new Set,r=new Set;if(!t||typeof t!="object")return{footprints:e,templates:s,outlines:r};const i=t;if(i.pcbs&&typeof i.pcbs=="object"){for(const a of Object.values(i.pcbs))if(!(!a||typeof a!="object")&&(typeof a.template=="string"&&s.add(a.template),a.footprints&&typeof a.footprints=="object"))for(const c of Object.values(a.footprints))c&&typeof c.what=="string"&&e.add(c.what)}if(i.outlines&&typeof i.outlines=="object")for(const a of Object.values(i.outlines)){if(!a||typeof a!="object")continue;const c=Array.isArray(a)?a:Object.values(a);for(const p of c){const m=p;m&&typeof m.what=="string"&&r.add(m.what)}}return{footprints:e,templates:s,outlines:r}},Ds=(t,e)=>!t||t.length===0?[]:t.filter(s=>{const[r,i]=s;return r==="footprint"?e.footprints.has(i):r==="template"?e.templates.has(i):r==="outline"?e.outlines.has(i):!0}),an=async(t,e,s,r)=>{try{await navigator.clipboard.writeText(t),e(!0),r==null||r(),s.current&&clearTimeout(s.current),s.current=setTimeout(()=>{e(!1)},2500)}catch(i){console.error("Failed to copy shareable URI to clipboard:",i);try{const a=document.createElement("textarea");a.value=t,a.style.position="fixed",a.style.opacity="0",document.body.appendChild(a),a.select();const c=document.execCommand("copy");if(document.body.removeChild(a),!c){console.error("Fallback copy method was rejected by the browser.");return}e(!0),r==null||r(),s.current&&clearTimeout(s.current),s.current=setTimeout(()=>{e(!1)},2500)}catch(a){console.error("Fallback copy method also failed:",a)}}},dr=({config:t,injections:e,onClose:s,"data-testid":r})=>{const i=Wn.useMemo(()=>e||[],[e]),[a,c]=f.useState(1),[p,m]=f.useState(!0),[l,h]=f.useState(!1),[b,g]=f.useState(null),[x,k]=f.useState(""),[u,y]=f.useState([]),[v,z]=f.useState(!1),[S,E]=f.useState(!1),$=f.useRef(null),A=f.useRef(null);f.useEffect(()=>{if(!p||v||i.length===0||a!==1)return;let R=!0;h(!0),g(null);const F=qe();if(!F){g("Could not initialize background worker."),h(!1);return}return F.onmessage=N=>{var Z;if(!R)return;const B=N.data;if(B.type==="success"){const Y=(Z=B.results)==null?void 0:Z.canonical,{footprints:ee,templates:X,outlines:H}=cr(Y),W=i.map(([V,_,U])=>{let T;return V==="footprint"?T=ee.has(_):V==="template"?T=X.has(_):V==="outline"?T=H.has(_):T=!0,{type:V,name:_,content:U,checked:T,isEligible:T}}).filter(V=>V.isEligible).map(({type:V,name:_,content:U,checked:T})=>({type:V,name:_,content:U,checked:T}));y(W),z(!0)}else B.type==="error"&&g(B.error||"Failed to analyze configuration.");h(!1),F.terminate()},F.onerror=()=>{R&&(g("Worker encountered an error during analysis."),h(!1),F.terminate())},F.postMessage({type:"generate",inputConfig:t,injectionInput:i,requestId:`share-analysis-${Date.now()}`,options:{debug:!0}}),()=>{R=!1,F.terminate()}},[p,v,i,t,a]);const D=f.useRef(0);D.current=p?u.filter(R=>R.checked).length:0;const I=f.useCallback(R=>{M("share_link_copied",{has_injections:D.current>0,injections_count:D.current,source:R})},[]);f.useEffect(()=>{a===2&&x&&an(x,E,A,()=>{I("auto")})},[x,a,I]),f.useEffect(()=>{const R=F=>{F.key==="Escape"&&s()};return window.addEventListener("keydown",R),()=>{window.removeEventListener("keydown",R)}},[s]),f.useEffect(()=>{a===2&&$.current&&($.current.focus(),$.current.select())},[a]),f.useEffect(()=>{const R=A;return()=>{R.current&&clearTimeout(R.current)}},[]);const w=R=>{y(F=>F.map((N,B)=>B===R?{...N,checked:!N.checked}:N))},j=()=>{const R=p?u.filter(B=>B.checked):[],F=R.length>0?R.map(B=>[B.type,B.name,B.content]):void 0,N=zs({config:t,injections:F});k(N),c(2)},L=()=>{an(x,E,A,()=>{I("button")})};return o.jsx(As,{"data-testid":r,onClick:R=>{R.target===R.currentTarget&&s()},children:o.jsxs(Rs,{"data-testid":r&&`${r}-box`,onClick:R=>R.stopPropagation(),children:[o.jsx(Ns,{onClick:s,"data-testid":r&&`${r}-close`,"aria-label":"Close dialog",children:o.jsx("span",{className:"material-symbols-outlined",children:"close"})}),a===1?o.jsxs(o.Fragment,{children:[o.jsx(ln,{children:"Share Configuration"}),o.jsx(cn,{children:"Configure what content should be included when sharing your keyboard design."}),o.jsx(Us,{children:o.jsxs(Os,{htmlFor:"include-libraries-toggle",children:[o.jsx(Ws,{id:"include-libraries-toggle",type:"checkbox",checked:p,onChange:R=>{const F=R.target.checked;m(F),F||(h(!1),g(null))},"aria-label":"Include custom libraries"}),o.jsx(Fs,{$checked:p}),o.jsx("span",{children:"Include custom libraries"})]})}),p&&o.jsxs(o.Fragment,{children:[l&&o.jsxs(Bs,{children:[o.jsx(Ms,{}),o.jsx("span",{children:"Analyzing configuration..."})]}),b&&o.jsx(Ts,{children:b}),!l&&!b&&i.length===0&&o.jsx(dn,{children:"No custom libraries loaded."}),!l&&!b&&i.length>0&&u.length===0&&o.jsx(dn,{children:"No custom footprints or libraries are used in this configuration."}),!l&&!b&&u.length>0&&o.jsx(Gs,{children:u.map((R,F)=>o.jsxs(Hs,{children:[o.jsx(Vs,{id:`injection-${R.name}`,type:"checkbox",checked:R.checked,onChange:()=>w(F),"aria-label":R.name}),o.jsx(Ks,{$type:R.type,children:R.type}),o.jsx(Js,{htmlFor:`injection-${R.name}`,children:R.name})]},`${R.type}-${R.name}`))})]}),o.jsx(un,{children:o.jsx(qs,{onClick:j,disabled:l,children:"Share"})})]}):o.jsxs(o.Fragment,{children:[o.jsx(ln,{children:"Shareable Configuration Link"}),o.jsx(cn,{children:"Share this link with others to let them view and use your keyboard configuration, including all of your custom footprints."}),o.jsxs(Ys,{children:[o.jsx(Xs,{ref:$,type:"text",value:x,readOnly:!0,"data-testid":r&&`${r}-input`,"aria-label":"Share link"}),o.jsx(un,{children:o.jsxs(Zs,{onClick:L,"data-testid":r&&`${r}-copy`,"aria-label":S?"Link copied":"Copy link",children:[o.jsx("span",{className:"material-symbols-outlined",children:S?"check":"content_copy"}),S?"Link copied":"Copy link"]})})]})]})]})})},As=d.div`
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
`,Rs=d.div`
  background-color: ${n.colors.backgroundLight};
  border: 1px solid ${n.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: relative;
`,Ns=d.button`
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
`,ln=d.h2`
  margin: 0 0 1rem 0;
  font-size: ${n.fontSizes.h3};
  color: ${n.colors.text};
  padding-right: 3rem;
`,cn=d.p`
  margin: 0 0 1.5rem 0;
  font-size: ${n.fontSizes.base};
  color: ${n.colors.textDark};
  line-height: 1.5;
`,Us=d.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`,Os=d.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  font-family: ${n.fonts.body};
  font-size: ${n.fontSizes.base};
  color: ${n.colors.text};
`,Ws=d.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`,Fs=d.span`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 22px;
  background-color: ${t=>t.$checked?n.colors.accent:n.colors.backgroundLighter};
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
    transform: ${t=>t.$checked?"translateX(22px)":"translateX(0)"};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }
`,Bs=d.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.5rem 0;
  color: ${n.colors.textDark};
`,Ms=d.div`
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
`,Ts=d.p`
  color: ${n.colors.error};
  font-size: ${n.fontSizes.sm};
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: ${n.colors.errorDark}22;
  border: 1px solid ${n.colors.error};
  border-radius: 6px;
`,dn=d.p`
  color: ${n.colors.textDarker};
  font-size: ${n.fontSizes.sm};
  margin: 1rem 0;
  font-style: italic;
`,Gs=d.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${n.colors.border};
  border-radius: 6px;
  background-color: ${n.colors.backgroundLighter};
  margin: 1rem 0 1.5rem 0;
  padding: 0.5rem;
`,Hs=d.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${n.colors.backgroundLight};
  }
`,Vs=d.input`
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: ${n.colors.accent};
`,Js=d.label`
  cursor: pointer;
  flex: 1;
  color: ${n.colors.text};
  font-size: ${n.fontSizes.sm};
  user-select: none;
`,Ks=d.span`
  font-size: ${n.fontSizes.xs};
  font-weight: ${n.fontWeights.bold};
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  color: ${n.colors.white};
  background-color: ${t=>{switch(t.$type){case"footprint":return"#007bff";case"outline":return"#e83e8c";case"template":return"#fd7e14";default:return n.colors.border}}};
`,qs=d.button`
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
`,Ys=d.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: stretch;
`,un=d.div`
  display: flex;
  justify-content: center;
  width: 100%;

  @media (min-width: 500px) {
    width: auto;
  }
`,Xs=d.input`
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
`,Zs=d.button`
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
`,Qs=d.span`
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
`;function ea(){return o.jsx(o.Fragment,{children:o.jsxs("span",{children:[ar()?"⌘":"Ctrl"," ⏎"]})})}const ta=d.div`
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
`,oa=d.div`
  flex-grow: 1;
`,pn=d(Re)`
  display: none;

  @media (max-width: 475px) {
    display: flex;
  }
`,na=d.button`
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
`,fn=d.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
`,ra=d.div`
  display: flex;
  gap: 10px;
  align-items: stretch;
  padding: 10px;

  @media (max-width: 639px) {
    display: none;
  }
`,ia=d.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
  padding: 0;
`,hn=d(ds)`
  height: 100%;
`,sa=d.div`
  height: 100%;
  overflow-y: auto;
`,aa=d(Ui)`
  position: relative;
  flex-grow: 1;
  min-height: 0;
`,la=d.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`,ca=d.div`
  height: 100%;
  overflow-y: auto;
  padding: 0.5rem;

  @media (min-width: 640px) {
    padding: 1rem;
  }
`,da=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 640px) {
    display: none;
  }
`,ua=d.button`
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
`,gn=d.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: row;

  @media (max-width: 639px) {
    width: ${t=>t.$fullWidth?"100%":"auto"};
  }
`,mn=d.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
`,pa=d.div`
  display: flex;
  height: 100%;
  width: 100%;
`,fa=({pwaState:t})=>{const e=()=>Math.max(200,window.innerWidth*.33),s=()=>Math.max(150,window.innerWidth*.15),r=()=>Math.max(350,window.innerWidth*.15),[i,a]=f.useState({key:"demo.svg",extension:"svg",content:""}),[c,p]=f.useState(!1),m=w=>{a(w),u!=null&&u.showConfig||u==null||u.setShowDownloads(!1)},[l,h]=f.useState({key:-1,type:"",name:"",content:""}),[b,g]=f.useState(!1),[x,k]=f.useState(window.innerWidth<=639),u=ye(),y=!0;f.useEffect(()=>{const w=()=>{k(window.innerWidth<=639)};return window.addEventListener("resize",w),()=>window.removeEventListener("resize",w)},[]),$r(ar()?"meta+enter":"ctrl+enter",()=>{u&&(M("shortcut_used",{action:"generate"}),u.generateNow(u.configInput,u.injectionInput,{pointsonly:!1,isManual:!0}))},{enableOnFormTags:!0,preventDefault:!0}),f.useEffect(()=>{if(l.key===-1||l.name===""||l.content==="")return;const w=[l.type,l.name,l.content];let j=[];Array.isArray(u==null?void 0:u.injectionInput)&&(j=[...u.injectionInput]);const L=j.length;if(L===0||L===l.key)j.push(w),h({...l,key:L});else{const R=j[l.key];if(R[0]===l.type&&R[1]===l.name&&R[2]===l.content)return;j=j.map((F,N)=>N===l.key?w:F)}u==null||u.setInjectionInput(j)},[u,l]);const v=f.useRef(null),z=!!(u!=null&&u.results);if(f.useEffect(()=>{if(!z){v.current=null;return}if(!i.key||!i.extension)return;const w=`${i.key}|${i.extension}`;v.current!==w&&(v.current=w,M("preview_loaded",{preview_type:i.extension,preview_key:i.key}))},[i.key,i.extension,z]),!u)return null;let S=null;switch(u.results&&(S=eo(i.key,u.results),S===void 0&&i.key!=="demo.svg"&&(i.key="demo.svg",i.extension="svg",S=eo(i.key,u.results))),i.extension){case"svg":case"kicad_pcb":i.content=typeof S=="string"?S:"";break;case"stl":i.content=typeof S=="string"||S instanceof ArrayBuffer||ArrayBuffer.isView(S)?S:"";break;case"jscad":i.content=typeof(S==null?void 0:S.jscad)=="string"?S.jscad:"";break;case"yaml":i.content=pe.dump(S);break;case"txt":i.content=u.configInput||"";break;default:i.content=""}const E=w=>{const j={...l,name:w.target.value};h(j)},$=w=>{if(!Array.isArray(u==null?void 0:u.injectionInput))return;M("injection_deleted",{injection_type:w.type});const j=[...u.injectionInput].filter((L,R)=>R!==w.key);if(u.setInjectionInput(j),l.key===w.key)h({key:-1,type:"",name:"",content:""});else if(l.key>=w.key){const L={...l,key:l.key-1};h(L)}},A=()=>{var R;const w=((R=u.getRealtimeConfigInput)==null?void 0:R.call(u))??u.configInput;if(w===void 0)return;M("download_button_clicked",{download_type:"yaml",source:"editor"});const j=document.createElement("a"),L=new Blob([w],{type:"text/yaml"});j.href=URL.createObjectURL(L),j.download="config.yaml",document.body.appendChild(j),j.click(),URL.revokeObjectURL(j.href),document.body.removeChild(j)},D=()=>{var w,j;u.configInput&&(M("share_button_clicked",{has_injections:!!((w=u.injectionInput)!=null&&w.length),injections_count:((j=u.injectionInput)==null?void 0:j.length)||0,source:"subheader"}),p(!0))},I=()=>{var w,j,L;!u.results||!u.configInput||u.isGenerating||u.isJscadConverting||(M("archive_single_downloaded",{has_injections:!!((w=u.injectionInput)!=null&&w.length),injections_count:((j=u.injectionInput)==null?void 0:j.length)||0,stored_configs_count:((L=u.configs)==null?void 0:L.length)||0,source:"subheader"}),or(u.results,u.configInput,u.injectionInput,u.debug,u.stlPreview))};return o.jsxs(o.Fragment,{children:[c&&o.jsx(dr,{config:u.configInput||"",injections:u.injectionInput||[],onClose:()=>p(!1)}),o.jsxs(ia,{children:[!u.showSettings&&o.jsxs(ta,{children:[o.jsx(Re,{className:u.showConfig?"active":"",onClick:()=>u.setShowConfig(!0),"aria-label":"Show configuration panel","data-testid":"mobile-config-button",children:"Config"}),o.jsx(Re,{className:u.showConfig?"":"active",onClick:()=>u.setShowConfig(!1),"aria-label":"Show outputs panel","data-testid":"mobile-outputs-button",children:"Outputs"}),o.jsx(oa,{}),u.showConfig&&o.jsxs(o.Fragment,{children:[o.jsx(na,{onClick:()=>u.generateNow(u.configInput,u.injectionInput,{pointsonly:!1,isManual:!0}),"aria-label":"Generate configuration","data-testid":"mobile-generate-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"refresh"})}),o.jsx(pn,{onClick:D,disabled:!u.configInput,"aria-label":"Share configuration","data-testid":"mobile-share-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"share"})}),o.jsx(Re,{onClick:A,"aria-label":"Download configuration","data-testid":"mobile-download-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"download"})})]}),!u.showConfig&&o.jsxs(o.Fragment,{children:[o.jsx(pn,{onClick:I,disabled:u.isGenerating||u.isJscadConverting,"aria-label":"Download archive of all generated files","data-testid":"mobile-download-outputs-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),o.jsx(Re,{onClick:()=>u.setShowDownloads(!u.showDownloads),"aria-label":u.showDownloads?"Hide downloads panel":"Show downloads panel","data-testid":"mobile-downloads-toggle-button",children:o.jsx("span",{className:"material-symbols-outlined",children:u.showDownloads?"expand_content":"collapse_content"})})]})]}),o.jsx(pa,{children:u.showSettings?o.jsxs(o.Fragment,{children:[o.jsx(Ft,{initialWidth:r(),minWidth:150,maxWidth:"70%",side:"left","data-testid":"settings-panel",style:{display:b&&x?"none":void 0},children:o.jsxs(ca,{children:[o.jsxs(la,{children:[o.jsx(at,{children:"General"}),o.jsxs(lt,{children:[o.jsx(De,{optionId:"autogen",label:"Auto-generate",description:"Automatically generate new outputs and update previews on changes.",setSelected:u.setAutoGen,checked:u.autoGen,"aria-label":"Enable auto-generate"}),o.jsx(De,{optionId:"autogen3d",label:"Auto-generate PCB & 3D",description:"Build 3D models and PCB files during generation (can be slow).",setSelected:u.setAutoGen3D,checked:u.autoGen3D,"aria-label":"Enable auto-generate PCB and 3D (slow)"}),o.jsx(De,{optionId:"debug",label:"Debug",description:"Include debug files in the outputs.",setSelected:u.setDebug,checked:u.debug,"aria-label":"Enable debug mode"})]}),o.jsx(at,{children:"Previews (Experimental)"}),o.jsxs(lt,{children:[o.jsx(De,{optionId:"kicanvasPreview",label:"KiCad Preview",description:"Render interactive PCB layouts using KiCanvas.",setSelected:u.setKicanvasPreview,checked:u.kicanvasPreview,"aria-label":"Enable KiCad preview (experimental)"}),o.jsx(De,{optionId:"stlPreview",label:"STL Preview",description:"Render 3D preview of generated cases.",setSelected:u.setStlPreview,checked:u.stlPreview,"aria-label":"Enable STL preview (experimental)"})]}),o.jsx(at,{children:"Privacy"}),o.jsx(lt,{children:o.jsx(De,{optionId:"sendUsageMetrics",label:"Send Usage Metrics",description:y?"Help improve Ergogen Web UI by sharing anonymous usage statistics.":"Unavailable: this copy of Ergogen Web UI was built without an analytics tag ID, so no usage statistics are sent.",setSelected:u.setSendUsageMetrics,checked:y&&u.sendUsageMetrics,disabled:!y,"aria-label":"Send usage metrics"})}),t&&o.jsxs(o.Fragment,{children:[o.jsx(at,{children:"Offline"}),o.jsx(lt,{children:o.jsx(Es,{isAvailable:t.isAvailable,isInstalled:t.isInstalled,isInstalling:t.isInstalling,onInstall:t.onInstall})})]})]}),o.jsx(ns,{setInjectionToEdit:h,deleteInjection:$,injectionToEdit:l,onInjectionSelect:()=>g(!0),"data-testid":"injections-container"})]})}),o.jsx(gn,{$fullWidth:b&&x,children:o.jsxs(fn,{children:[x&&o.jsxs(da,{children:[o.jsxs(gt,{as:"h4",style:{marginTop:0},children:[l.type?l.type.charAt(0).toUpperCase()+l.type.slice(1):"Footprint"," ","name"]}),o.jsx(ua,{onClick:()=>{g(!1),h({key:-1,type:"",name:"",content:""})},"aria-label":"Close editor","data-testid":"mobile-editor-close",children:o.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),!x&&o.jsxs(gt,{as:"h4",children:[l.type?l.type.charAt(0).toUpperCase()+l.type.slice(1):"Footprint"," ","name"]}),o.jsx(fs,{value:l.name,onChange:E,disabled:l.key===-1,"aria-label":`${l.type?l.type.charAt(0).toUpperCase()+l.type.slice(1):"Footprint"} name`,"data-testid":"footprint-name-input"}),o.jsxs(gt,{as:"h4",children:[l.type?l.type.charAt(0).toUpperCase()+l.type.slice(1):"Footprint"," ","code"]}),o.jsx(Oi,{injection:l,setInjection:h,options:{readOnly:l.key===-1}})]})})]}):o.jsxs(o.Fragment,{children:[u.showConfig&&o.jsx(Ft,{initialWidth:e(),minWidth:250,maxWidth:"60%",side:"left","data-testid":"config-panel",children:o.jsxs(fn,{children:[o.jsx(aa,{"data-testid":"config-editor"}),o.jsxs(ra,{children:[o.jsx(Je,{onClick:()=>u.generateNow(u.configInput,u.injectionInput,{pointsonly:!1,isManual:!0}),"aria-label":"Generate configuration","data-testid":"generate-button",children:o.jsxs("span",{style:{display:"flex",alignItems:"center",width:"100%",justifyContent:"center"},children:[o.jsx("span",{children:"Generate"}),o.jsx(Qs,{children:ea()})]})}),o.jsx(Re,{onClick:A,"aria-label":"Download configuration","data-testid":"download-config-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"download"})})]})]})}),o.jsx(gn,{$fullWidth:!u.showConfig,children:u.showDownloads?o.jsxs(o.Fragment,{children:[o.jsx(mn,{children:o.jsx(hn,{"data-testid":`${i.key}-file-preview`,previewExtension:i.extension,previewKey:`${i.key}-${u.resultsVersion}`,previewContent:i.content})}),o.jsx(Ft,{initialWidth:s(),minWidth:105,maxWidth:"30%",side:"right","data-testid":"downloads-panel",children:o.jsx(sa,{children:o.jsx(Yi,{setPreview:m,previewKey:i.key,"data-testid":"downloads-container"})})})]}):o.jsx(mn,{children:o.jsx(hn,{"data-testid":`${i.key}-file-preview`,previewExtension:i.extension,previewKey:`${i.key}-${u.resultsVersion}`,previewContent:i.content})})})]})})]})]})},ha={label:"Absolem",author:"MrZealot",value:`meta:
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
    distance: 223.7529778`},ga={label:"Atreus",author:"MrZealot",value:`points:
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
`},ma={label:"A. Dux",author:"tapioki",value:`meta:
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
`},ba={label:"Corney Island",author:"ceoloide",value:`points:
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
          rotate: 90`},oo={label:"Empty YAML configuration",author:"ceoloide",value:`meta:
  engine: 4.1.0
units:
points:
  zones:
    matrix:
outlines:
pcbs:
cases:
`},xa={label:"Wubbo",author:"cache.works",value:`meta:
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
`},wa={label:"Sweep-like",author:"jcmkk3",value:`meta:
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
`},ya={label:"Reviung41",author:"jcmkk3",value:`meta:
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
`},ka={label:"Tiny20",author:"enzocoralc",value:`meta:
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
`},_a={label:"Alpha",author:"jcmkk3",value:`points:
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
`},va={label:"Plank",author:"cache.works",value:`meta:
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
`},ja={label:"Curly-45",author:"peterjc",value:`meta:
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
`},$a=[oo],Ca=[ha,ga],Sa=[ma,ba,wa,ya,ka],Ea=[xa,_a,va,ja],Pa=[{label:"Empty configurations",options:$a},{label:"Simple (points only)",options:Ca},{label:"Complete (with pcb)",options:Sa},{label:"Miscellaneous",options:Ea}],Ia=async t=>new Promise((e,s)=>{const r=new FileReader;r.onload=i=>{var a;(a=i.target)!=null&&a.result&&typeof i.target.result=="string"?e(i.target.result):s(new Error("Failed to read file as text"))},r.onerror=()=>s(new Error("Failed to read file")),r.readAsText(t)}),La=async t=>{const s=t.name.toLowerCase().split(".").pop(),r=s==="zip"||s==="ekb";if(Xt(t.size,r),s==="yaml"||s==="yml"||s==="json")return{config:await Ia(t),footprints:[],outlines:[],templates:[]};if(r){const i=await t.arrayBuffer(),a=await fi(i),c=a.injections.filter(l=>l.type==="footprint").map(l=>({name:l.name,content:l.content})),p=a.injections.filter(l=>l.type==="outline").map(l=>({name:l.name,content:l.content})),m=a.injections.filter(l=>l.type==="template").map(l=>({name:l.name,content:l.content}));return{config:a.config,footprints:c,outlines:p,templates:m}}else throw new Error("Unsupported file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")},no=()=>o.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-github",viewBox:"0 0 98 96",children:o.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z",fill:"currentColor"})}),bn=()=>o.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 4.2333332 4.2333335",version:"1.1",fill:"currentColor",children:[o.jsxs("defs",{children:[o.jsxs("linearGradient",{id:"linearGradient6924-6",children:[o.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:0},offset:"0"}),o.jsx("stop",{offset:"0.49517274",style:{stopColor:"#ffffff",stopOpacity:.3}}),o.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:.3},offset:"1"})]}),o.jsx("linearGradient",{id:"linearGradient6918-3",x1:"42519.285",y1:"-7078.7891",x2:"42575.336",y2:"-6966.9307",gradientUnits:"userSpaceOnUse",href:"#linearGradient6924-6"})]}),o.jsxs("g",{transform:"matrix(0.06551432,0,0,0.06551432,-2.232417,-1.431776)",children:[o.jsx("path",{id:"path6733-5",style:{fontVariationSettings:"normal",opacity:1,vectorEffect:"none",fill:"url(#linearGradient6918-3)",fillOpacity:1,stroke:"none",strokeWidth:3.67846,strokeLinecap:"butt",strokeLinejoin:"miter",strokeMiterlimit:2,strokeDashoffset:0,strokeOpacity:1,paintOrder:"stroke markers fill",stopColor:"#000000",stopOpacity:1},d:"m 42519.285,-7078.7891 a 0.76086879,0.56791688 0 0 0 -0.738,0.6739 l 33.586,125.8886 a 87.182358,87.182358 0 0 0 39.381,-33.7636 l -71.565,-92.5196 a 0.76086879,0.56791688 0 0 0 -0.664,-0.2793 z",transform:"matrix(0.37058478,0,0,0.37058478,-15690.065,2662.0533)"}),o.jsx("path",{id:"path360787",style:{opacity:1,fill:"#ffffff",fillOpacity:1,strokeWidth:17.0055,paintOrder:"markers fill stroke",stopColor:"#000000"},d:"m 11249.461,-1883.6961 c -12.74,0 -23.067,10.3275 -23.067,23.0671 0,4.3335 1.22,8.5795 3.522,12.2514 l 19.232,-24.8636 c 0.138,-0.1796 0.486,-0.1796 0.624,0 l 19.233,24.8646 c 2.302,-3.6721 3.523,-7.9185 3.523,-12.2524 0,-12.7396 -10.327,-23.0671 -23.067,-23.0671 z",transform:"matrix(1.4006354,0,0,1.4006354,-15690.065,2662.0533)"})]})]}),xn=()=>o.jsx("svg",{width:"16",height:"16",viewBox:"0 0 212 212",fill:"none",stroke:"currentColor",children:o.jsxs("g",{transform:"translate(6,6)",children:[o.jsx("path",{d:"M58 168 v-98 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),o.jsx("path",{d:"M58 168 v-30 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),o.jsx("circle",{cx:"142",cy:"20",r:"18",strokeWidth:"15"}),o.jsx("circle",{cx:"142",cy:"88",r:"18",strokeWidth:"15"}),o.jsx("circle",{cx:"58",cy:"180",r:"18",strokeWidth:"15"})]})}),ro=d.div`
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
`,za=d.div`
  background-color: ${n.colors.background};
  color: ${n.colors.white};
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: border-color 0.2s ease;

  ${t=>t.$isDragging&&`
    border: 3px dashed ${n.colors.accent};
    border-radius: 8px;
  `}
`,Da=d.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${t=>t.$isVisible?"flex":"none"};
  align-items: center;
  justify-content: center;
  z-index: 999;
  pointer-events: none;
`,Aa=d.div`
  background-color: ${n.colors.backgroundLight};
  border: 3px dashed ${n.colors.accent};
  border-radius: 8px;
  padding: 2rem;
  font-size: ${n.fontSizes.h3};
  color: ${n.colors.text};
  text-align: center;
`,Ra=d.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 640px) {
    padding: 1rem 0.5rem;
  }
`,Na=d.h1`
  font-size: ${n.fontSizes.h1};
  text-align: center;
  margin-bottom: 1rem;
`,Ua=d.p`
  font-size: ${n.fontSizes.lg};
  text-align: center;
  margin-bottom: 3rem;
  color: ${n.colors.textDark};
`,Oa=d.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`,Bt=d.div`
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
`,Wa=d.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;

  button {
    flex-shrink: 0;
  }
`,Fa=d.div`
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
`,Ba=d.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  user-select: none;
`,Ma=d.button`
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
`,Ta=d.div`
  width: 1px;
  background-color: ${n.colors.border};
  margin: 0.75rem 0;
  flex-shrink: 0;
`,Ga=d.input`
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
`,Ha=d.div`
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
`,Mt=d.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  font-size: ${n.fontSizes.bodySmall};
  color: ${({$active:t})=>t?n.colors.white:n.colors.textDark};
  background-color: ${({$active:t})=>t?n.colors.accent:"transparent"};
  cursor: pointer;

  &:hover {
    background-color: ${({$active:t})=>t?n.colors.accent:n.colors.backgroundLighter};
    color: ${n.colors.white};
  }

  svg {
    width: 16px;
    height: 16px;
    color: currentColor;
    display: block;
  }
`,Va=d(de)`
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

  ${ro} {
    margin-right: 0;
  }
`,Ja=d.input`
  display: none;
`,wn=d.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`,yn=d.div`
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
`,Ka=d.img`
  width: 100%;
  height: 150px;
  object-fit: contain;
  padding: 8px;
  box-sizing: border-box;
  background-color: ${n.colors.backgroundLighter};
`,kn=d.div`
  padding: 1rem;
  font-weight: ${n.fontWeights.semiBold};
  text-align: center;
`,qa=d.div`
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
`,Ya=d.div`
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
`,_n=Pa.flatMap(t=>t.options).filter(t=>t.label!=="Empty YAML configuration"),Xa=()=>{const t=io(),e=ye(),[s,r]=f.useState(""),[i,a]=f.useState("github"),[c,p]=f.useState(!1),[m,l]=f.useState(!1),h=c||m,[b,g]=f.useState(!1),x=f.useRef(null),[k,u]=f.useState(!1);f.useEffect(()=>{const _=U=>{x.current&&!x.current.contains(U.target)&&u(!1)};return document.addEventListener("mousedown",_),()=>document.removeEventListener("mousedown",_)},[]);const[y,v]=f.useState(!1),z=_=>{r(_),_.includes("github.com/")?a("github"):_.includes("codeberg.org/")?a("codeberg"):(_.startsWith("http://")||_.startsWith("https://")||_.includes("/")&&!_.includes("github.com/")&&!_.includes("codeberg.org/")&&_.split("/")[0].includes("."))&&a("forgejo")},{currentConflict:S,processInjectionsWithConflictResolution:E,handleConflictResolution:$,handleConflictCancel:A}=$t({setInjectionInput:_=>e==null?void 0:e.setInjectionInput(_),setConfigInput:_=>e==null?void 0:e.setConfigInput(_),generateNow:async(_,U,T)=>{e&&await e.generateNow(_,U,T)},getCurrentInjections:()=>(e==null?void 0:e.injectionInput)||[],onComplete:async()=>{g(!0)},setError:_=>e==null?void 0:e.setError(_)});f.useEffect(()=>{const _=new URLSearchParams(window.location.search),U=_.has("github")||_.has("codeberg")||_.has("forgejo")||_.has("gitea");(b||U)&&(e!=null&&e.configInput)&&(t("/"),g(!1))},[b,e==null?void 0:e.configInput,t]),f.useEffect(()=>{var _;(_=e==null?void 0:e.pruneDeletedConfigs)==null||_.call(e)},[e]);const D=async _=>{if(e){const U=_===oo.value;let T="unknown";if(U)T="empty_configuration";else{const J=_n.find(G=>G.value===_);J&&(T=J.label.toLowerCase().replace(/\s+/g,"_"))}M("example_loaded",{example_name:T,is_empty:U}),e.createNewConfig(_),await e.generateNow(_,e.injectionInput,{pointsonly:!1}),g(!0)}},I=async _=>{if(e){const U=e.configs.find(T=>T.id===_);U&&(e.selectConfig(_),M("saved_config_loaded",{stored_configs_count:e.configs.length}),await e.generateNow(U.config,e.injectionInput,{pointsonly:!1}),g(!0))}},j=[...(e==null?void 0:e.configs)||[]].sort((_,U)=>new Date(U.updatedAt).getTime()-new Date(_.updatedAt).getTime()).slice(0,4),L=async(_,U,T,J,G=null,re)=>{if(!e)throw new Error("Configuration context not available");const te=er(_,U,T);await E(te,J,G,re)},R=async(_,U)=>{await $(_,U)},F=()=>{A(),p(!1),l(!1),e==null||e.setIsGenerating(!1)},N=()=>{if(!s||!e)return;const{setError:_,clearError:U,setIsGenerating:T}=e;l(!0),T(!0),U(),M("repo_loaded",{provider:i});let J=s.trim();if(!J.includes("://")&&!J.includes("github.com")&&!J.includes("codeberg.org"))if(i==="codeberg")J=`https://codeberg.org/${J}`;else if(i==="forgejo"){const G=J.split("/");if(G.length>=2&&G[0].includes("."))J=`https://${J}`;else{_("Forgejo/Gitea requires a URL including the host (e.g., host/owner/repo)"),l(!1),T(!1);return}}else J=`https://github.com/${J}`;tr(J).then(async G=>{if(e){G.rateLimitWarning&&_(G.rateLimitWarning);try{e.createNewConfig(G.config),await L(G.footprints,G.outlines,G.templates||[],G.config)}catch(re){throw new Error(`Failed to process footprints: ${re instanceof Error?re.message:"Unknown error"}`)}}}).catch(G=>{_(`Failed to load from ${i==="github"?"GitHub":i==="codeberg"?"Codeberg":"Forgejo/Gitea"} repository: ${G.message}`),e==null||e.setInfo(null),l(!1),T(!1)}).finally(()=>{l(!1)})},B=f.useRef(null),Z=()=>{var _;(_=B.current)==null||_.click()},Y=async _=>{if(!e)return;const{setError:U,clearError:T,setIsGenerating:J}=e;p(!0),J(!0),T(),M("local_file_loaded",{file_type:Wr(_.name),file_size:_.size});try{const G=await La(_);e.createNewConfig(G.config),await L(G.footprints,G.outlines,G.templates||[],G.config)}catch(G){U(`Failed to load local file: ${G instanceof Error?G.message:"Unknown error"}`),e.setInfo(null),p(!1),J(!1)}finally{p(!1)}},ee=async _=>{var T;const U=(T=_.target.files)==null?void 0:T[0];U&&(_.target.value="",await Y(U))},X=_=>{_.preventDefault(),_.stopPropagation(),!h&&v(!0)},H=_=>{_.preventDefault(),_.stopPropagation()},W=_=>{if(_.preventDefault(),_.stopPropagation(),h)return;const U=_.currentTarget,T=_.relatedTarget;(!T||!U.contains(T))&&v(!1)},V=async _=>{if(_.preventDefault(),_.stopPropagation(),h)return;v(!1);const U=Array.from(_.dataTransfer.files),T=[".yaml",".yml",".json",".zip",".ekb"],J=U.find(G=>{const re=G.name.toLowerCase();return T.some(te=>re.endsWith(te))});J?await Y(J):U.length>0&&e&&e.setError("Invalid file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")};return o.jsxs(za,{$isDragging:y,onDragEnter:X,onDragOver:H,onDragLeave:W,onDrop:V,"data-testid":"welcome-page-wrapper",children:[o.jsx(Da,{$isVisible:y,children:o.jsx(Aa,{children:"Drop file here to load configuration"})}),S&&o.jsx(jt,{injectionName:S.name,injectionType:S.type,onResolve:R,onCancel:F,"data-testid":"conflict-dialog"}),o.jsxs(Ra,{children:[o.jsx(Na,{children:"Ergogen Web UI"}),o.jsxs(Ua,{children:["A web-based interface for Ergogen, the ergonomic keyboard generator.",o.jsx("br",{}),"Start a new design below."]}),o.jsxs(Oa,{children:[o.jsxs(Bt,{children:[o.jsx("h2",{children:"Start Fresh"}),o.jsx("p",{children:"Begin with a completely blank slate."}),o.jsx(de,{onClick:()=>D(oo.value),"aria-label":"Start with empty configuration","data-testid":"empty-config-button",children:"Empty Configuration"})]}),o.jsxs(Bt,{children:[o.jsx("h2",{children:"From Local File"}),o.jsx("p",{children:"Load a configuration from your computer. Supports *.yaml, *.json, *.zip, and *.ekb files."}),o.jsx(Ja,{ref:B,type:"file",accept:".yaml,.yml,.json,.zip,.ekb",onChange:ee,disabled:h,"aria-label":"Select local file to load","data-testid":"local-file-input"}),o.jsx(de,{onClick:Z,disabled:h,"aria-label":"Select local file to load","data-testid":"local-file-button",children:c?o.jsxs(o.Fragment,{children:[o.jsx(ro,{})," Loading..."]}):"Choose File"})]}),o.jsxs(Bt,{children:[o.jsx("h2",{children:"From Repo"}),o.jsx("p",{children:'Link to a YAML config file on a Git provider (e.g. GitHub, Codeberg, Forgejo), or simply a repository name like "user/repo".'}),o.jsx(Wa,{children:o.jsxs(Fa,{children:[o.jsxs(Ba,{ref:x,children:[o.jsxs(Ma,{type:"button",onClick:()=>u(!k),disabled:h,"aria-label":"Repository provider source","data-testid":"repo-provider-trigger",children:[i==="github"?o.jsx(no,{}):i==="codeberg"?o.jsx(bn,{}):o.jsx(xn,{}),o.jsx("span",{className:"material-symbols-outlined",children:"arrow_drop_down"})]}),k&&o.jsxs(Ha,{children:[o.jsxs(Mt,{$active:i==="github",onClick:()=>{a("github"),u(!1)},children:[o.jsx(no,{}),"GitHub"]}),o.jsxs(Mt,{$active:i==="codeberg",onClick:()=>{a("codeberg"),u(!1)},children:[o.jsx(bn,{}),"Codeberg"]}),o.jsxs(Mt,{$active:i==="forgejo",onClick:()=>{a("forgejo"),u(!1)},children:[o.jsx(xn,{}),"Forgejo"]})]})]}),o.jsx(Ta,{}),o.jsx(Ga,{placeholder:i==="forgejo"?"host/user/repo":"user/repo",value:s,onChange:_=>z(_.target.value),onKeyDown:_=>{_.key==="Enter"&&!h&&s.trim()!==""&&(_.preventDefault(),N())},disabled:h,"aria-label":"Repository URL or path","data-testid":"repo-input"}),o.jsx(Va,{onClick:N,disabled:h||!s,"aria-label":"Load configuration from repository","data-testid":"repo-load-button",children:m?o.jsx(ro,{}):o.jsx("span",{className:"material-symbols-outlined",style:{display:"block"},children:"cloud_download"})})]})})]})]}),j.length>0&&o.jsxs(o.Fragment,{children:[o.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:n.fontSizes.h2},children:"Pick up where you left"}),o.jsx(wn,{style:{marginBottom:"3rem"},children:j.map(_=>o.jsxs(yn,{onClick:()=>I(_.id),"aria-label":`Load ${_.name} configuration`,"data-testid":`saved-config-${_.name.toLowerCase().replace(/\s+/g,"-")}`,children:[_.previewSvg?o.jsx(qa,{dangerouslySetInnerHTML:{__html:_.previewSvg}}):o.jsx(Ya,{children:o.jsx("span",{className:"material-symbols-outlined",children:"keyboard_off"})}),o.jsx(kn,{children:_.name})]},_.id))})]}),o.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:n.fontSizes.h2},children:"Or start from an example"}),o.jsx(wn,{children:_n.map(_=>o.jsxs(yn,{onClick:()=>D(_.value),"aria-label":`Load ${_.label} example`,"data-testid":`example-${_.label.toLowerCase().replace(/\s+/g,"-")}`,children:[o.jsx(Ka,{src:`/images/previews/${_.label.toLowerCase().replace(/[\s()]/g,"_")}.svg`,alt:`${_.label} preview`}),o.jsx(kn,{children:_.label})]},_.label))})]})]})},ur=({versionInfo:t,"data-testid":e})=>{const[s,r]=f.useState(!1),i=f.useRef(null),a=()=>{i.current&&clearTimeout(i.current),r(!0)},c=()=>{i.current=setTimeout(()=>{r(!1)},250)},p=()=>{i.current&&clearTimeout(i.current)},m=()=>{i.current=setTimeout(()=>{r(!1)},250)},l=h=>{h.stopPropagation(),r(b=>!b)};return f.useEffect(()=>{if(!s)return;const h=()=>{r(!1)};return window.addEventListener("click",h),()=>{window.removeEventListener("click",h)}},[s]),f.useEffect(()=>()=>{i.current&&clearTimeout(i.current)},[]),o.jsxs(Za,{onMouseEnter:a,onMouseLeave:c,"data-testid":e,children:[o.jsx(Qa,{onClick:l,"data-testid":e&&`${e}-badge`,"aria-label":"Custom Ergogen version indicator",children:o.jsx("span",{className:"material-symbols-outlined",children:"science"})}),s&&o.jsxs(el,{onMouseEnter:p,onMouseLeave:m,onClick:h=>h.stopPropagation(),"data-testid":e&&`${e}-popover`,children:[o.jsx(tl,{children:"Custom Ergogen Version"}),o.jsx(ol,{children:"This website is running a custom version of Ergogen for development and preview purposes."}),o.jsxs(nl,{href:t.url,target:"_blank",rel:"noopener noreferrer","data-testid":e&&`${e}-link`,children:[o.jsx("span",{children:t.label}),o.jsx("span",{className:"material-symbols-outlined open-icon",children:"open_in_new"})]})]})]})},Za=d.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  transform: translateY(-5px);
`,Qa=d.span`
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
`,el=d.div`
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
`,tl=d.div`
  font-size: 12px;
  font-weight: ${n.fontWeights.semiBold};
  color: ${n.colors.white};
`,ol=d.div`
  font-size: 11px;
  color: ${n.colors.textDark};
  line-height: 1.4;
`,nl=d.a`
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
`,rl=wt`
  0%   { box-shadow: 0 0 0 0   ${n.colors.accent}99; }
  70%  { box-shadow: 0 0 0 6px ${n.colors.accent}00; }
  100% { box-shadow: 0 0 0 0   ${n.colors.accent}00; }
`,il=wt`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`,sl=d.button`
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
  animation: ${rl} ${t=>t.$isUpdating?"0.6s":"2s"}
    ease-out infinite;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  .material-symbols-outlined {
    font-size: 14px !important;
    ${t=>t.$isUpdating&&Un`
        animation: ${il} 1s linear infinite;
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
`,al=({onClick:t,"data-testid":e})=>{const[s,r]=f.useState(!1),i=()=>{r(!0),t()};return o.jsxs(sl,{onClick:i,disabled:s,$isUpdating:s,"aria-label":s?"Updating version...":"Update available — click to reload and apply","data-testid":e??"update-chip",children:[o.jsx("span",{className:"material-symbols-outlined","aria-hidden":"true",children:s?"sync":"update"}),s?"Updating version...":"Update Available"]})},ll=d.header`
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
`,cl=d.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: row;
  flex-grow: 1;
  min-width: 0;
  width: 100%;
`,dl=d.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,ul=d.div`
  display: flex;
  align-items: center;
  gap: 6px;
`,pl=d.div`
  font-size: ${n.fontSizes.base};
  font-weight: ${n.fontWeights.semiBold};
  color: ${n.colors.white};
  display: flex;
  align-items: center;
  @media (max-width: 639px) {
    display: none;
  }
`,Ct=d.button`
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
`,fl=d(Ct)`
  flex-shrink: 0;
`,hl=d(Ct)`
  background-color: ${n.colors.accent};
  border-color: ${n.colors.accent};

  &:hover {
    background-color: ${n.colors.accentDark};
    border-color: ${n.colors.accentDarker};
  }

  @media (max-width: 375px) {
    display: none;
  }
`,gl=d.span`
  @media (max-width: 510px) {
    display: none;
  }
`,vn=d(Ct)`
  @media (max-width: 475px) {
    display: none;
  }
`,ml=d(Bn)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,bl=d.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,xl=({onUpdate:t})=>{const e=ye(),s=io(),r=Fn(),{activeConfigId:i,activeConfigName:a,configs:c,isPreview:p,renameConfig:m,duplicateConfig:l,deleteConfig:h,savePreviewConfig:b}=e||{},[g,x]=f.useState(!1),[k,u]=f.useState(!1),[y,v]=f.useState(""),z=()=>{a&&i&&(v(a),u(!0))},S=N=>{N&&N.stopPropagation(),!(m&&i&&y.trim()&&!m(i,y.trim()))&&u(!1)},E=N=>{N&&N.stopPropagation(),u(!1)},$=N=>{N.key==="Enter"?S():N.key==="Escape"&&u(!1)},A=N=>{N.stopPropagation(),l&&i&&l(i)},D=N=>{N.stopPropagation(),i&&a&&h&&window.confirm(`Are you sure you want to delete "${a}"?`)&&(h(i),(c&&c.length<=1||i)&&s("/new"))},I=()=>{e==null||e.setShowSettings(!(e!=null&&e.showSettings))},w=()=>{e==null||e.setShowSettings(!1),e==null||e.selectConfig(null),s("/new")},j=()=>{var N,B,Z;!(e!=null&&e.results)||!(e!=null&&e.configInput)||e!=null&&e.isGenerating||e!=null&&e.isJscadConverting||(M("archive_single_downloaded",{has_injections:!!((N=e.injectionInput)!=null&&N.length),injections_count:((B=e.injectionInput)==null?void 0:B.length)||0,stored_configs_count:((Z=e.configs)==null?void 0:Z.length)||0,source:"header"}),or(e.results,e.configInput,e.injectionInput,e.debug,e.stlPreview))},L=()=>{var N,B;e!=null&&e.configInput&&(M("share_button_clicked",{has_injections:!!((N=e.injectionInput)!=null&&N.length),injections_count:((B=e.injectionInput)==null?void 0:B.length)||0,source:"header"}),x(!0))},R=()=>{e==null||e.setShowSideNav(!(e!=null&&e.showSideNav))},F=f.useMemo(()=>kt("github:ceoloide/ergogen#v4.3.0"),[]);return o.jsxs(o.Fragment,{children:[g&&o.jsx(dr,{config:(e==null?void 0:e.configInput)||"",injections:(e==null?void 0:e.injectionInput)||[],onClose:()=>x(!1),"data-testid":"share-dialog"}),o.jsxs(ll,{children:[o.jsxs(cl,{children:[o.jsx(fl,{onClick:R,"aria-label":e!=null&&e.showSideNav?"Hide navigation panel":"Show navigation panel","data-testid":"side-nav-toggle-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"side_navigation"})}),o.jsxs(ul,{children:[o.jsx(ml,{to:"/","aria-label":"Go to home page","data-testid":"logo-button",children:o.jsx(bl,{src:"/ergogen.png",alt:"Ergogen logo"})}),o.jsxs(pl,{children:["Ergogen",F.isCustom&&o.jsx(ur,{versionInfo:F,"data-testid":"header-dev-chip"})]})]}),a&&o.jsxs(o.Fragment,{children:[o.jsx(yl,{children:"/"}),o.jsxs(wl,{"data-testid":"header-active-config-name",$isEditing:k,onClick:!k&&!p?z:void 0,children:[p&&o.jsx(_l,{"data-testid":"header-shared-icon",children:o.jsx("span",{className:"material-symbols-outlined",children:"link"})}),k?o.jsxs(o.Fragment,{children:[o.jsx(kl,{type:"text",value:y,onChange:N=>v(N.target.value),onBlur:S,onKeyDown:$,autoFocus:!0,"data-testid":"header-config-name-input","aria-label":"Edit configuration name"}),o.jsxs(Tt,{className:"header-actions-always-visible",children:[o.jsx(He,{onMouseDown:N=>{N.preventDefault()},onClick:S,"aria-label":"Confirm rename","data-testid":"header-confirm-rename-btn",children:o.jsx("span",{className:"material-symbols-outlined",children:"check"})}),o.jsx(He,{onMouseDown:N=>{N.preventDefault()},onClick:E,"aria-label":"Cancel rename","data-testid":"header-cancel-rename-btn",children:o.jsx("span",{className:"material-symbols-outlined",children:"close"})})]})]}):p?o.jsxs(o.Fragment,{children:[o.jsx($n,{"data-testid":"header-config-name-text",children:a}),o.jsx(Tt,{className:"header-actions-always-visible",children:o.jsx(He,{onClick:N=>{N.stopPropagation(),b==null||b()},"aria-label":"Save preview configuration","data-testid":"header-save-preview-btn",children:o.jsx("span",{className:"material-symbols-outlined",children:"save"})})})]}):o.jsxs(o.Fragment,{children:[o.jsx($n,{title:"Click to rename","data-testid":"header-config-name-text",children:a}),o.jsxs(Tt,{className:"header-actions-hover",children:[o.jsx(He,{onClick:z,"aria-label":"Rename configuration","data-testid":"header-rename-btn",children:o.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),o.jsx(jn,{onClick:A,"aria-label":"Duplicate configuration","data-testid":"header-duplicate-btn",children:o.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),o.jsx(jn,{onClick:D,"aria-label":"Delete configuration","data-testid":"header-delete-btn",children:o.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})]})]})]}),o.jsxs(dl,{children:[t&&o.jsx(al,{onClick:t,"data-testid":"header-update-chip"}),r.pathname==="/"&&o.jsxs(o.Fragment,{children:[o.jsxs(hl,{onClick:w,"aria-label":"Start new configuration","data-testid":"new-config-button",children:[o.jsx("span",{className:"material-symbols-outlined",children:"add_2"}),o.jsx(gl,{children:"New"})]}),o.jsx(vn,{onClick:j,disabled:(e==null?void 0:e.isGenerating)||(e==null?void 0:e.isJscadConverting),"aria-label":"Download archive of all generated files","data-testid":"header-download-outputs-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),o.jsx(vn,{onClick:L,disabled:!(e!=null&&e.configInput),"aria-label":"Share configuration","data-testid":"header-share-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"share"})})]}),r.pathname!=="/new"&&o.jsx(Ct,{onClick:I,"aria-label":e!=null&&e.showSettings?"Hide settings panel":"Show settings panel","data-testid":"settings-button",children:o.jsx("span",{className:"material-symbols-outlined",children:e!=null&&e.showSettings?"keyboard_alt":"settings"})})]})]})]})},wl=d.div`
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
  cursor: ${t=>t.$isEditing?"default":"pointer"};
  border: 1px solid
    ${t=>t.$isEditing?n.colors.accent:"transparent"};
  background-color: ${t=>t.$isEditing?n.colors.backgroundLight:"transparent"};
  width: 220px;
  box-sizing: border-box;

  &:hover {
    background-color: ${t=>t.$isEditing?n.colors.backgroundLight:n.colors.buttonHover};
    .header-actions-hover {
      opacity: 1;
    }
  }

  @media (max-width: 767px) {
    width: 160px;
    border-color: ${t=>t.$isEditing?n.colors.accent:n.colors.border};
  }
`,Tt=d.div`
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
`,He=d.button`
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
`,jn=d(He)`
  @media (max-width: 767px) {
    display: none;
  }
`,yl=d.span`
  color: ${n.colors.textDark};
  font-size: ${n.fontSizes.sm};
  font-weight: ${n.fontWeights.semiBold};
  user-select: none;
  @media (max-width: 639px) {
    display: none;
  }
`,$n=d.span`
  font-size: ${n.fontSizes.bodySmall};
  font-weight: ${n.fontWeights.semiBold};
  color: ${n.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  user-select: none;
`,kl=d.input`
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
`,_l=d.div`
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
`,vl=wt`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
`,jl=d.div`
  position: fixed;
  top: 45px;
  left: 0;
  right: 0;
  width: 100%;
  height: 3px;
  background-color: transparent;
  overflow: hidden;
  z-index: 1000;
`,$l=d.div`
  height: 100%;
  width: 25%;
  background-color: ${n.colors.accent};
  animation: ${vl} 1.5s ease-in-out infinite;
`,Cl=({visible:t,"data-testid":e})=>t?o.jsx(jl,{"data-testid":e,children:o.jsx($l,{})}):null,ct={info:{background:n.colors.info,text:n.colors.infoDark},warning:{background:n.colors.warning,text:n.colors.warningDark},error:{background:n.colors.error,text:n.colors.errorDark},success:{background:n.colors.success,text:n.colors.successDark}},dt=d.span.attrs({className:"material-symbols-outlined"})`
  font-size: ${n.fontSizes.iconLarge};
  margin-right: 1rem;
`,ut=d.div`
  display: flex;
  align-items: center;
`,pt=d.p`
  margin: 0;
`,ft=d.div`
  padding: 1rem 1.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: ${({type:t})=>ct[t].text};
  background-color: ${({type:t})=>ct[t].background};
  border: 1px solid ${({type:t})=>ct[t].text};

  .material-symbols-outlined {
    color: ${({type:t})=>ct[t].text};
  }
`,Sl=d.div`
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
`,ht=d.button`
  background: none;
  border: none;
  color: inherit;
  font-size: ${n.fontSizes.h3};
  cursor: pointer;
  padding: 0;
  line-height: 1;
  margin-left: auto;
  padding-left: 1rem;
`,El=()=>{const t=ye();if(!t)return null;const{error:e,deprecationWarning:s,skippedWarning:r,info:i,clearError:a,clearWarning:c,clearSkippedWarning:p,clearInfo:m}=t;return o.jsxs(Sl,{"data-testid":"banners-container",children:[i&&o.jsxs(ft,{type:"info","data-testid":"info-banner",children:[o.jsxs(ut,{children:[o.jsx(dt,{children:"info"}),o.jsx(pt,{children:i})]}),o.jsx(ht,{onClick:m,"aria-label":"Close info message","data-testid":"close-info-banner",children:"×"})]}),s&&o.jsxs(ft,{type:"warning","data-testid":"warning-banner",children:[o.jsxs(ut,{children:[o.jsx(dt,{children:"warning"}),o.jsx(pt,{children:s})]}),o.jsx(ht,{onClick:c,"aria-label":"Close warning message","data-testid":"close-warning-banner",children:"×"})]}),r&&o.jsxs(ft,{type:"warning","data-testid":"skipped-injections-banner",children:[o.jsxs(ut,{children:[o.jsx(dt,{children:"warning"}),o.jsx(pt,{children:r})]}),o.jsx(ht,{onClick:p,"aria-label":"Close feature warning message","data-testid":"close-skipped-banner",children:"×"})]}),e&&o.jsxs(ft,{type:"error","data-testid":"error-banner",children:[o.jsxs(ut,{children:[o.jsx(dt,{children:"error"}),o.jsx(pt,{children:e})]}),o.jsx(ht,{onClick:a,"aria-label":"Close error message","data-testid":"close-error-banner",children:"×"})]})]})},Pl=()=>o.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-discord",viewBox:"0 0 16 16",children:o.jsx("path",{d:"M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"})}),Cn=({label:t,version:e,url:s,isCustom:r=!1,"data-testid":i,devBadgeTestId:a})=>{const c=()=>{window.open(s,"_blank","noopener,noreferrer")};return o.jsxs(Il,{onClick:c,$hasDevBadge:r,"aria-label":`View ${t==="Ergogen"?"Ergogen":`Ergogen ${t}`} ${e} on GitHub`,"data-testid":i,children:[o.jsx(no,{}),o.jsxs(Ll,{children:[o.jsx(zl,{children:t}),o.jsx(Dl,{$isCustom:r,children:e})]}),r&&o.jsx(Al,{"data-testid":a,children:o.jsx(Rl,{children:"DEV"})})]})},Il=d.button`
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
  padding: 8px ${t=>t.$hasDevBadge?"22px":"10px"} 8px 10px;
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
`,Ll=d.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  line-height: 1.1;
  min-width: 0;
`,zl=d.span`
  font-size: 10px;
  font-weight: ${n.fontWeights.bold};
  color: ${n.colors.white};
  white-space: nowrap;
`,Dl=d.span`
  font-size: 8px;
  color: ${t=>t.$isCustom?n.colors.accent:n.colors.textDark};
  white-space: nowrap;
`,Al=d.div`
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
`,Rl=d.span`
  font-size: 8px;
  font-weight: ${n.fontWeights.bold};
  color: ${n.colors.accent};
  transform: rotate(-90deg);
  white-space: nowrap;
  line-height: 1;
`,Nl=({isOpen:t,onClose:e,"data-testid":s})=>{const r=f.useRef(t),[i,a]=f.useState(t),[c,p]=f.useState(360),m=f.useRef(!1),l=f.useRef(0),h=f.useRef(360),b=ye(),g=io(),x=yt.version,{configs:k,activeConfigId:u,selectConfig:y,renameConfig:v,duplicateConfig:z,deleteConfig:S,setIsBulkDownloadOpen:E}=b||{},[$,A]=f.useState(""),[D,I]=f.useState(null),[w,j]=f.useState(""),L=f.useMemo(()=>{if(!k)return[];let W=k;if($.trim()){const V=$.toLowerCase().split(/\s+/).filter(Boolean);V.length>0&&(W=k.filter(_=>{const U=_.name.toLowerCase();return V.some(T=>U.includes(T))}))}return[...W].sort((V,_)=>{const U=V.updatedAt?new Date(V.updatedAt).getTime():0,T=_.updatedAt?new Date(_.updatedAt).getTime():0;if(U!==T)return T-U;const J=V.createdAt?new Date(V.createdAt).getTime():0,G=_.createdAt?new Date(_.createdAt).getTime():0;return J!==G?G-J:V.name.localeCompare(_.name)})},[k,$]),R=()=>{y&&y(null),g("/new"),e()},F=()=>{M("bulk_download_dialog_opened",{stored_configs_count:(k==null?void 0:k.length)||0}),E&&E(!0),e()},N=W=>{y&&(y(W),g("/"),e())},B=(W,V)=>{I(W),j(V)},Z=W=>{v&&w.trim()&&!v(W,w.trim())||I(null)},Y=W=>{z&&z(W)},ee=(W,V)=>{if(window.confirm(`Are you sure you want to delete "${V}"?`)&&S){S(W);const _=u===W,U=k&&k.length<=1;(_||U)&&(g("/new"),e())}};f.useEffect(()=>{const W=r.current;t&&!W?a(!0):!t&&W&&a(!1),t||I(null),r.current=t},[t]),f.useEffect(()=>{if(!$.trim())return;const W=setTimeout(()=>{M("search_performed",{query_length:$.trim().length})},1e3);return()=>clearTimeout(W)},[$]),f.useEffect(()=>{const W=T=>{if(!m.current)return;const J=T.clientX-l.current,G=h.current+J,re=Math.min(600,window.innerWidth*.9),te=Math.max(360,Math.min(G,re));p(te)},V=()=>{m.current&&(m.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},_=T=>{if(!m.current)return;T.preventDefault();const G=T.touches[0].clientX-l.current,re=h.current+G,te=Math.min(600,window.innerWidth*.9),Oe=Math.max(360,Math.min(re,te));p(Oe)},U=()=>{m.current&&(m.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",W),window.addEventListener("mouseup",V),window.addEventListener("touchmove",_,{passive:!1}),window.addEventListener("touchend",U),()=>{window.removeEventListener("mousemove",W),window.removeEventListener("mouseup",V),window.removeEventListener("touchmove",_),window.removeEventListener("touchend",U)}},[]);const X=W=>{W.preventDefault(),W.stopPropagation(),m.current=!0,h.current=c,"touches"in W?l.current=W.touches[0].clientX:l.current=W.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};f.useEffect(()=>{if(!t)return;const W=V=>{V.key==="Escape"&&e()};return window.addEventListener("keydown",W),()=>{window.removeEventListener("keydown",W)}},[t,e]);const H=f.useMemo(()=>kt("github:ceoloide/ergogen#v4.3.0"),[]);return f.useEffect(()=>(t?document.body.style.overflow="hidden":document.body.style.overflow="",()=>{document.body.style.overflow=""}),[t]),o.jsxs(o.Fragment,{children:[o.jsx(Ul,{"data-testid":s,onClick:e,$isOpen:t,$isOpening:i}),o.jsxs(Ol,{"data-testid":s&&`${s}-panel`,$isOpen:t,$isOpening:i,$width:c,onClick:W=>W.stopPropagation(),children:[o.jsx(cc,{onMouseDown:X,onTouchStart:X,"data-testid":s&&`${s}-resize-handle`}),o.jsxs(Wl,{children:[o.jsxs(Fl,{children:[o.jsx(Bl,{to:"/",onClick:e,"aria-label":"Go to home page","data-testid":"side-nav-logo-button",children:o.jsx(Ml,{src:"/ergogen.png",alt:"Ergogen logo"})}),o.jsxs(Tl,{onClick:e,children:["Ergogen",H.isCustom&&o.jsx(ur,{versionInfo:H,"data-testid":"sidebar-dev-chip"})]})]}),o.jsx(Gl,{onClick:e,"data-testid":s&&`${s}-close`,"aria-label":"Close navigation panel",children:o.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),o.jsxs(Hl,{children:[o.jsxs(Vl,{children:[o.jsxs(Jl,{onClick:R,"aria-label":"New","data-testid":"side-nav-new-config-button",children:[o.jsx("span",{className:"material-symbols-outlined",children:"add"}),o.jsx("span",{children:"New"})]}),k&&k.length>0&&o.jsxs(Kl,{onClick:F,"aria-label":"Download All","data-testid":"side-nav-download-all-button",children:[o.jsx("span",{className:"material-symbols-outlined",children:"download"}),o.jsx("span",{children:"Download All"})]})]}),o.jsxs(ql,{children:[o.jsx("span",{className:"material-symbols-outlined search-icon",children:"search"}),o.jsx(Yl,{type:"text",placeholder:"Search configurations...",value:$,onChange:W=>A(W.target.value),"aria-label":"Search configurations"}),$&&o.jsx(Xl,{onClick:()=>A(""),children:o.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),o.jsxs(Zl,{children:[o.jsx("span",{children:"Saved Configurations"}),o.jsx(Ql,{children:L.length})]}),o.jsxs(ec,{children:[L.map(W=>{const V=W.id===u,_=D===W.id;return o.jsx(tc,{$isActive:V,"data-testid":`config-item-${W.id}`,children:_?o.jsxs(rc,{onSubmit:U=>{U.preventDefault(),Z(W.id)},children:[o.jsx(ic,{type:"text",value:w,onChange:U=>j(U.target.value),autoFocus:!0,"aria-label":"Rename input"}),o.jsx(Sn,{type:"submit","aria-label":"Save name",children:o.jsx("span",{className:"material-symbols-outlined",children:"check"})}),o.jsx(Sn,{type:"button",onClick:()=>I(null),"aria-label":"Cancel rename",children:o.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}):o.jsxs(o.Fragment,{children:[o.jsxs(oc,{onClick:()=>N(W.id),$isActive:V,title:W.name,children:[o.jsx("span",{className:"material-symbols-outlined",children:"description"}),o.jsx("span",{className:"config-title-text",children:W.name})]}),o.jsxs(nc,{$isActive:V,children:[o.jsx(Gt,{onClick:()=>B(W.id,W.name),"aria-label":`Rename configuration ${W.name}`,children:o.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),o.jsx(Gt,{onClick:()=>Y(W.id),"aria-label":`Duplicate configuration ${W.name}`,children:o.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),o.jsx(Gt,{onClick:()=>ee(W.id,W.name),"aria-label":`Delete configuration ${W.name}`,children:o.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})},W.id)}),L.length===0&&o.jsx(sc,{children:"No configurations found"})]})]}),o.jsx(ac,{children:o.jsxs(lc,{children:[o.jsxs(En,{onClick:()=>{window.open("https://docs.ergogen.xyz/","_blank","noopener,noreferrer")},"aria-label":"Open documentation","data-testid":"side-nav-docs-button",children:[o.jsx("span",{className:"material-symbols-outlined",children:"description"}),o.jsx("span",{children:"Docs"})]}),o.jsx(En,{onClick:()=>{window.open("https://discord.ergogen.xyz","_blank","noopener,noreferrer")},"aria-label":"Join the Discord community","data-testid":"side-nav-discord-button",children:o.jsx(Pl,{})}),o.jsx(Cn,{label:"Web UI",version:x,url:"https://github.com/ceoloide/ergogen-gui","data-testid":"side-nav-gui-version-button"}),o.jsx(Cn,{label:"Ergogen",version:H.displayText,url:H.url,isCustom:H.isCustom,"data-testid":"side-nav-ergogen-version-button",devBadgeTestId:"side-nav-ergogen-dev-badge"})]})})]})]})},Ul=d.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
  opacity: ${t=>t.$isOpen?1:0};
  transition: opacity ${t=>t.$isOpening?"0.2s":"0.1s"}
    ease-in-out;
  pointer-events: ${t=>t.$isOpen?"auto":"none"};
`,Ol=d.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: ${t=>t.$width}px;
  max-width: min(600px, 90vw);
  background-color: ${n.colors.backgroundLight};
  border-right: 1px solid ${n.colors.border};
  box-shadow: ${t=>t.$isOpen?"4px 0 20px rgba(0, 0, 0, 0.5)":"none"};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transform: translateX(${t=>t.$isOpen?"0":"-100%"});
  transition:
    transform ${t=>t.$isOpening?"0.2s":"0.1s"} ease-in-out,
    box-shadow ${t=>t.$isOpening?"0.2s":"0.1s"} ease-in-out;

  @media (max-width: 639px) {
    width: 100%;
    max-width: 100%;
  }
`,Wl=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 3em;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
`,Fl=d.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`,Bl=d(Bn)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,Ml=d.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,Tl=d.div`
  font-size: ${n.fontSizes.base};
  font-weight: ${n.fontWeights.semiBold};
  color: ${n.colors.white};
  cursor: pointer;
  display: flex;
  align-items: center;
`,Gl=d.button`
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
`,Hl=d.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`,Vl=d.div`
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
  flex-shrink: 0;
`,Jl=d.button`
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
`,Kl=d.button`
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
`,ql=d.div`
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
`,Yl=d.input`
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
`,Xl=d.button`
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
`,Zl=d.div`
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
`,Ql=d.span`
  background-color: ${n.colors.border};
  color: ${n.colors.white};
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: ${n.fontWeights.semiBold};
`,ec=d.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  flex: 1;
`,tc=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  background-color: transparent;
  border: 1px solid
    ${t=>t.$isActive?n.colors.accent:"transparent"};
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
`,oc=d.button`
  flex: 1;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${t=>t.$isActive?n.colors.white:n.colors.textDark};
  font-weight: ${t=>t.$isActive?n.fontWeights.semiBold:n.fontWeights.regular};
  font-size: ${n.fontSizes.bodySmall};
  text-align: left;
  cursor: pointer;
  min-width: 0;
  padding: 0;
  height: 100%;

  .material-symbols-outlined {
    font-size: 18px;
    color: ${t=>t.$isActive?n.colors.accent:n.colors.textDark};
  }

  .config-title-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    color: ${n.colors.white};
  }
`,nc=d.div.attrs({className:"item-actions-hover"})`
  display: flex;
  gap: 4px;
  opacity: ${t=>t.$isActive?1:0};
  transition: opacity 0.15s ease-in-out;

  @media (max-width: 1023px) {
    opacity: 1;
  }
`,Gt=d.button`
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
`,rc=d.form`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 100%;
`,ic=d.input`
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
`,Sn=d.button`
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
`,sc=d.div`
  text-align: center;
  color: ${n.colors.textDark};
  font-size: ${n.fontSizes.bodySmall};
  margin-top: 2rem;
  font-style: italic;
`,ac=d.div`
  padding: 8px 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`,lc=d.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  width: 100%;
`,En=d.button`
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
`,cc=d.div`
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
`,dc=({isOpen:t,configs:e,injections:s,debug:r,stlPreview:i,onClose:a,"data-testid":c})=>{const[p,m]=f.useState(new Set),[l,h]=f.useState(!0),[b,g]=f.useState(!1),[x,k]=f.useState(0),[u,y]=f.useState(""),v=f.useRef(!1);if(f.useEffect(()=>{t&&(m(new Set(e.map(D=>D.id))),g(!1),k(0),y(""),v.current=!1)},[t,e]),!t)return null;const z=D=>{m(D?new Set(e.map(I=>I.id)):new Set)},S=(D,I)=>{const w=new Set(p);I?w.add(D):w.delete(D),m(w)},E=async()=>{if(p.size===0)return;g(!0),k(0),y(""),v.current=!1;const D=e.filter(I=>p.has(I.id));M("bulk_download_started",{selected_configs_count:p.size,only_configs:l});try{const I=await Ei(D,s,r,i,l,(w,j,L)=>{k(w),y(L)},()=>v.current);v.current||(I&&I.succeededCount===0&&I.failedCount>0?M("bulk_download_failed",{selected_configs_count:p.size,failed_configs_count:I.failedCount,only_configs:l,error_message:`All ${I.failedCount} selected configuration(s) failed to compile`}):I&&I.failedCount>0?M("bulk_download_partial",{selected_configs_count:p.size,failed_configs_count:I.failedCount,only_configs:l}):M("bulk_download_completed",{selected_configs_count:p.size,only_configs:l}))}catch(I){console.error("Error during bulk download:",I),M("bulk_download_failed",{selected_configs_count:p.size,only_configs:l,error_message:I instanceof Error?I.message:String(I)})}finally{v.current||a()}},$=()=>{b&&!v.current&&M("bulk_download_cancelled",{selected_configs_count:p.size,completed_configs_count:x,only_configs:l}),v.current=!0,a()},A=p.size>0?x/p.size*100:0;return o.jsx(uc,{"data-testid":c,children:o.jsxs(pc,{"data-testid":c&&`${c}-box`,children:[o.jsx(fc,{children:"Download Configurations"}),b?o.jsxs(o.Fragment,{children:[o.jsxs(Sc,{children:[o.jsx(Ec,{children:o.jsx(Pc,{style:{width:`${A}%`}})}),o.jsxs(Ic,{children:[o.jsx(Lc,{children:u?u.includes(", ")?o.jsxs("div",{children:["Generating:",o.jsx(zc,{children:u.split(", ").map(D=>o.jsx("li",{children:D},D))})]}):o.jsxs(Ln,{children:["Generating ",u]}):o.jsx(Ln,{children:"Preparing..."})}),o.jsxs(Dc,{children:[x," / ",p.size]})]})]}),o.jsx(In,{children:o.jsx(Ac,{onClick:$,size:"medium",children:"Cancel"})})]}):o.jsxs(o.Fragment,{children:[o.jsx(gc,{children:e.map(D=>{const I=p.has(D.id);return o.jsx(mc,{children:o.jsxs(pr,{htmlFor:`bulk-check-${D.id}`,children:[o.jsx(xc,{id:`bulk-check-${D.id}`,checked:I,onChange:w=>S(D.id,w.target.checked)}),o.jsx(wc,{$checked:I}),o.jsx(bc,{children:D.name})]})},D.id)})}),o.jsxs(hc,{children:[o.jsx(Pn,{onClick:()=>z(!0),children:"Select All"}),o.jsx(Pn,{onClick:()=>z(!1),children:"Deselect All"})]}),o.jsxs(yc,{children:[o.jsx(kc,{children:"Only download configs"}),o.jsxs(_c,{$checked:l,htmlFor:"only-configs-switch",children:[o.jsx(vc,{type:"checkbox",id:"only-configs-switch",checked:l,onChange:D=>h(D.target.checked)}),o.jsx(jc,{$checked:l}),o.jsx($c,{$checked:l})]})]}),!l&&o.jsxs(Cc,{children:[o.jsx("span",{className:"material-symbols-outlined",children:"warning"}),o.jsx("span",{children:"Warning: Exporting generated outputs for multiple configurations may take a long time depending on the number of selected configurations, their complexity, and CPU speed."})]}),o.jsxs(In,{children:[o.jsx(fr,{onClick:$,size:"medium",children:"Cancel"}),o.jsxs(de,{onClick:E,disabled:p.size===0,size:"medium",children:["Download (",p.size,")"]})]})]})]})})},uc=d.div`
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
`,pc=d.div`
  background-color: ${n.colors.backgroundLight};
  border: 1px solid ${n.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,fc=d.h2`
  margin: 0 0 1rem 0;
  font-size: ${n.fontSizes.h3};
  color: ${n.colors.text};
`,hc=d.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 1.5rem;
`,Pn=d.button`
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
`,gc=d.div`
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
`,mc=d.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,bc=d.span`
  color: ${n.colors.text};
  font-size: 13px;
  user-select: none;
`,pr=d.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  padding: 4px 0;
`,xc=d.input.attrs({type:"checkbox"})`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`,wc=d.div`
  width: 16px;
  height: 16px;
  background-color: ${t=>t.$checked?n.colors.accent:"transparent"};
  border: 2px solid
    ${t=>t.$checked?n.colors.accent:n.colors.border};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  flex-shrink: 0;

  &::after {
    content: '';
    display: ${t=>t.$checked?"block":"none"};
    width: 3px;
    height: 6px;
    border: solid ${n.colors.white};
    border-width: 0 2px 2px 0;
    transform: rotate(45deg) translate(-0.5px, -1px);
  }

  ${pr}:hover & {
    border-color: ${n.colors.accent};
  }
`,yc=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
`,kc=d.span`
  color: ${n.colors.text};
  font-size: ${n.fontSizes.base};
  user-select: none;
`,_c=d.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: pointer;
`,vc=d.input`
  opacity: 0;
  width: 0;
  height: 0;
`,jc=d.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${t=>t.$checked?n.colors.accent:n.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`,$c=d.span`
  position: absolute;
  top: 2px;
  left: ${t=>t.$checked?"18px":"2px"};
  width: 16px;
  height: 16px;
  background-color: ${n.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,Cc=d.div`
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
`,In=d.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: auto;
`,Sc=d.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`,Ec=d.div`
  background-color: ${n.colors.border};
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  width: 100%;
`,Pc=d.div`
  background-color: ${n.colors.accent};
  height: 100%;
  transition: width 0.15s ease-out;
`,Ic=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`,Lc=d.div`
  color: ${n.colors.text};
  max-width: 80%;
`,Ln=d.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,zc=d.ul`
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
`,Dc=d.span`
  color: ${n.colors.textDark};
  font-weight: ${n.fontWeights.semiBold};
`,fr=d(de)`
  background-color: ${n.colors.backgroundLighter};
  color: ${n.colors.textDark};

  &:hover {
    background-color: ${n.colors.buttonHover};
  }
`,Ac=d(fr)`
  width: 100%;
`;function Rc(){return!!(window.location.hostname==="localhost"||window.location.hostname==="[::1]"||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))}function Nc(t,e,s){t.addEventListener("statechange",()=>{var r,i;t.state==="installed"&&(navigator.serviceWorker.controller?(console.log("[SW] New content is available. Will be used when all existing tabs are closed or you reload."),(r=s==null?void 0:s.onUpdate)==null||r.call(s,e)):(console.log("[SW] Content is cached for offline use."),(i=s==null?void 0:s.onSuccess)==null||i.call(s,e)))})}async function hr(t,e){var s;try{const r=await navigator.serviceWorker.register(t);let i=null;const a=c=>{c===null||c===i||(i=c,Nc(c,r,e))};r.addEventListener("updatefound",()=>a(r.installing)),r.waiting&&navigator.serviceWorker.controller?(s=e==null?void 0:e.onUpdate)==null||s.call(e,r):a(r.installing)}catch(r){console.error("[SW] Error during service worker registration:",r)}}async function Uc(t,e){try{const s=await fetch(t,{headers:{"Service-Worker":"script"}}),r=s.headers.get("content-type");s.status===404||r!==null&&r.indexOf("javascript")===-1?(await(await navigator.serviceWorker.ready).unregister(),window.location.reload()):await hr(t,e)}catch{console.log("[SW] No internet connection found. App is running in offline mode.")}}function Oc(t){!("serviceWorker"in navigator)||new URL("/",window.location.href).origin!==window.location.origin||window.addEventListener("load",()=>{const s="/service-worker.js";Rc()?(Uc(s,t),navigator.serviceWorker.ready.then(()=>{console.log("[SW] This web app is being served cache-first by a service worker. See https://cra.link/PWA for more details.")})):hr(s,t)})}const Wc=({report:t,onAccept:e,onCancel:s,"data-testid":r})=>o.jsx(Fc,{"data-testid":r,children:o.jsxs(Bc,{"data-testid":r&&`${r}-box`,children:[o.jsx(Mc,{children:"Version Compatibility Warning"}),o.jsx(Tc,{children:"The shared link was created under a different environment. You may experience compatibility issues."}),o.jsxs(Gc,{children:[t.guiWarning&&o.jsxs(Ht,{"data-testid":r&&`${r}-gui-warning`,children:[o.jsxs(Vt,{children:["GUI Version Mismatch",o.jsx(Jt,{"data-testid":"gui-mismatch-badge",children:"Mismatch"})]}),o.jsxs(Kt,{children:["The shared link was created with a newer version of the GUI (",o.jsxs("strong",{children:["v",t.guiWarning.shared]}),") than your current version (",o.jsxs("strong",{children:["v",t.guiWarning.current]}),"). Some interface options or features may not function as expected."]})]}),t.ergogenWarning&&o.jsxs(Ht,{"data-testid":r&&`${r}-ergogen-warning`,children:[o.jsxs(Vt,{children:["Ergogen Version Mismatch",o.jsx(Jt,{"data-testid":"ergogen-mismatch-badge",children:"Mismatch"})]}),o.jsxs(Kt,{children:["The shared link was created with a newer version of Ergogen (",o.jsx("strong",{children:t.ergogenWarning.shared}),") than your current version (",o.jsx("strong",{children:t.ergogenWarning.current}),"). Some features or syntax might not be supported."]})]}),t.customErgogenWarning&&o.jsxs(Ht,{"data-testid":r&&`${r}-custom-ergogen-warning`,children:[o.jsxs(Vt,{children:["Custom Ergogen Version Used",o.jsx(Jt,{"data-testid":"custom-version-badge",children:"Custom"})]}),o.jsxs(Kt,{children:["The shared link was created using a custom version of Ergogen:"," ",o.jsx("strong",{children:t.customErgogenWarning.shared}),".",o.jsx("br",{}),"You can investigate the repository used here:",o.jsx("br",{}),o.jsx(Hc,{href:t.customErgogenWarning.url,target:"_blank",rel:"noopener noreferrer","data-testid":r&&`${r}-custom-repo-link`,children:t.customErgogenWarning.label})]})]})]}),o.jsxs(Vc,{children:[o.jsx(Kc,{onClick:s,size:"medium","data-testid":r&&`${r}-cancel`,"aria-label":"Cancel configuration loading",children:"Cancel"}),o.jsx(Jc,{onClick:e,size:"medium","data-testid":r&&`${r}-accept`,"aria-label":"Accept and load configuration",children:"Accept and Load"})]})]})}),Fc=d.div`
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
`,Bc=d.div`
  background-color: ${n.colors.backgroundLight};
  border: 1px solid ${n.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 550px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,Mc=d.h2`
  margin: 0 0 0.5rem 0;
  font-size: ${n.fontSizes.h3};
  color: ${n.colors.error};
`,Tc=d.p`
  margin: 0 0 1.5rem 0;
  font-size: ${n.fontSizes.base};
  color: ${n.colors.textDarker};
  line-height: 1.4;
`,Gc=d.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`,Ht=d.div`
  background-color: ${n.colors.backgroundLighter};
  border-left: 4px solid ${n.colors.warningDark};
  padding: 1rem;
  border-radius: 4px;
`,Vt=d.div`
  font-size: ${n.fontSizes.base};
  font-weight: ${n.fontWeights.bold};
  color: ${n.colors.warningDark};
  margin-bottom: 0.25rem;
`,Jt=d.span`
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
`,Kt=d.div`
  font-size: ${n.fontSizes.bodySmall};
  color: ${n.colors.textDark};
  line-height: 1.5;

  strong {
    color: ${n.colors.text};
  }
`,Hc=d.a`
  display: inline-block;
  margin-top: 0.5rem;
  color: ${n.colors.accent};
  text-decoration: underline;
  word-break: break-all;

  &:hover {
    color: ${n.colors.accentSecondary};
  }
`,Vc=d.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`,Jc=d(de)`
  background-color: ${n.colors.accent};
  color: ${n.colors.white};

  &:hover {
    background-color: ${n.colors.accentDark};
  }
`,Kc=d(de)`
  background-color: ${n.colors.backgroundLighter};
  color: ${n.colors.textDark};

  &:hover {
    background-color: ${n.colors.buttonHover};
  }
`;let zn=null,Dn=!1;const qc=()=>{Dn||(zn=lr(),Dn=!0);const t=zn,e=[];let s=null;const r=f.useRef(null);if(t)if(t.success){const c=t.config;r.current===null&&(r.current={config:c.config,injections:c.injections,guiVersion:c.guiVersion,ergogenVersion:c.ergogenVersion}),window.history.replaceState(null,"",window.location.pathname+window.location.search)}else s=t.message,console.error("[App] Failed to load shared configuration from hash",{error:t.error,message:t.message,hashLength:window.location.hash.length}),window.history.replaceState(null,"",window.location.pathname+window.location.search);const[i,a]=f.useState(null);return f.useEffect(()=>{r.current&&a(r.current)},[]),o.jsx(Ni,{initialInjectionInput:e,hashError:s,children:o.jsx(Zc,{pendingSharedConfig:i})})};function Yc(){const[t,e]=f.useState(null),s=new URLSearchParams(window.location.search).has("force_update");if(f.useEffect(()=>{Oc({onUpdate:r=>{e(r)}})},[]),s)return()=>{console.log("[SW] Force-update triggered via ?force_update URL parameter."),window.location.reload()};if(t)return()=>{let r;if("serviceWorker"in navigator){let a=!1;navigator.serviceWorker.addEventListener("controllerchange",()=>{a||(a=!0,r&&clearTimeout(r),window.location.reload())})}const i=t.waiting;i?(i.postMessage({type:"SKIP_WAITING"}),r=setTimeout(()=>{window.location.reload()},1e3)):window.location.reload()}}function Xc(){const[t,e]=f.useState(null),[s,r]=f.useState(!1),[i,a]=f.useState(!1),c=new URLSearchParams(window.location.search).has("force_install");return f.useEffect(()=>{(()=>{const g=typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches,x=window.navigator.standalone===!0;a(g||x)})();const h=g=>{g.preventDefault(),e(g),console.log("[PWA] beforeinstallprompt event fired and captured.")},b=()=>{console.log("[PWA] appinstalled event fired."),a(!0),r(!1)};return window.addEventListener("beforeinstallprompt",h),window.addEventListener("appinstalled",b),()=>{window.removeEventListener("beforeinstallprompt",h),window.removeEventListener("appinstalled",b)}},[]),{onInstall:()=>{M("pwa_install_click"),r(!0),t?(t.prompt(),t.userChoice.then(l=>{l.outcome==="accepted"?(console.log("[PWA] User accepted the install prompt"),M("pwa_install_accepted"),a(!0)):(console.log("[PWA] User dismissed the install prompt"),M("pwa_install_dismissed")),r(!1),e(null)})):(console.log("[PWA] Install prompt triggered (deferredPrompt is not available on this device/browser)"),alert('PWA installation is not supported by this browser or is restricted on this device. If you are on iOS/iPadOS, please open this site in Safari and select "Add to Home Screen" from the Share menu.'),r(!1))},isAvailable:!!t||c,isInstalled:i,isInstalling:s}}const Zc=({pendingSharedConfig:t})=>{var S;const e=ye(),s=e==null?void 0:e.configInput,r=Fn(),i=Yc(),a=Xc(),c=f.useRef(0);c.current=((S=e==null?void 0:e.configs)==null?void 0:S.length)||0,f.useEffect(()=>{M("page_view",{page_path:r.pathname,stored_configs_count:c.current})},[r.pathname]);const p=f.useRef(!1),m=f.useRef(t);t!==m.current&&(m.current=t);const{currentConflict:l,processInjectionsWithConflictResolution:h,handleConflictResolution:b,handleConflictCancel:g}=$t({setInjectionInput:E=>e==null?void 0:e.setInjectionInput(E),setConfigInput:E=>e==null?void 0:e.loadPreview(E),generateNow:async(E,$,A)=>{e&&await e.generateNow(E,$,A)},getCurrentInjections:()=>(e==null?void 0:e.injectionInput)||[],onComplete:async(E,$)=>{localStorage.setItem("ergogen:injection",JSON.stringify($)),e==null||e.loadPreview(E)},setError:E=>e==null?void 0:e.setError(E)}),[x,k]=f.useState(null),u=(E,$)=>{const A=yt.version,D=ao("github:ceoloide/ergogen#v4.3.0");let I=!0,w,j,L;if(E){const R=Ee(A),F=Ee(E);R&&F&&!qt(R,F)&&(I=!1,w={current:A,shared:E})}if($){if(Lr($)&&$!==D){I=!1;const N=kt($);L={shared:$,url:N.url,label:N.label}}const R=Yo(D)||Ne.version,F=Yo($);if(F){const N=Ee(R),B=Ee(F);N&&B&&!qt(N,B)&&(I=!1,j={current:R,shared:F})}}return{isCompatible:I,guiWarning:w,ergogenWarning:j,customErgogenWarning:L}},y=f.useCallback((E,$)=>{e&&($!==void 0&&$.length>0?h($,E).catch(A=>{console.error("[App] Error processing injections:",A),e.setError(`Failed to process injections: ${A instanceof Error?A.message:"Unknown error"}`)}):(e.loadPreview(E),e.generateNow(E,e.injectionInput,{pointsonly:!1})))},[e,h]),v=()=>{var E;x&&(M("shared_config_accepted",{has_injections:!!(x.injections&&x.injections.length>0),injections_count:((E=x.injections)==null?void 0:E.length)||0}),y(x.config,x.injections),k(null))},z=()=>{var E;x&&M("shared_config_declined",{has_injections:!!(x.injections&&x.injections.length>0),injections_count:((E=x.injections)==null?void 0:E.length)||0}),k(null)};return f.useEffect(()=>{if(!e||!t||p.current)return;p.current=!0;const E=u(t.guiVersion,t.ergogenVersion);E.isCompatible?y(t.config,t.injections):k({config:t.config,injections:t.injections,report:E})},[e,t,y]),f.useEffect(()=>{if(!e)return;const E=()=>{const $=lr();if($)if($.success){const A=$.config,D=u(A.guiVersion,A.ergogenVersion);D.isCompatible?y(A.config,A.injections):k({config:A.config,injections:A.injections,report:D}),window.history.replaceState(null,"",window.location.pathname+window.location.search)}else console.error("[App] Failed to load shared configuration from hash (hashchange)",{error:$.error,message:$.message,hashLength:window.location.hash.length}),e.setError($.message),window.history.replaceState(null,"",window.location.pathname+window.location.search)};return window.addEventListener("hashchange",E),()=>{window.removeEventListener("hashchange",E)}},[e,y]),o.jsxs(o.Fragment,{children:[x&&o.jsx(Wc,{report:x.report,onAccept:v,onCancel:z,"data-testid":"share-compatibility-dialog"}),l&&o.jsx(jt,{injectionName:l.name,injectionType:l.type,onResolve:b,onCancel:g,"data-testid":"conflict-dialog"}),(e==null?void 0:e.isBulkDownloadOpen)&&o.jsx(dc,{isOpen:e.isBulkDownloadOpen,configs:e.configs,injections:e.injectionInput,debug:e.debug,stlPreview:e.stlPreview,onClose:()=>e.setIsBulkDownloadOpen(!1),"data-testid":"bulk-download-dialog"}),o.jsx(xl,{onUpdate:i}),o.jsx(Cl,{visible:(e==null?void 0:e.isGenerating)??!1,"data-testid":"loading-bar"}),o.jsx(El,{}),o.jsx(Nl,{isOpen:(e==null?void 0:e.showSideNav)??!1,onClose:()=>e==null?void 0:e.setShowSideNav(!1),"data-testid":"side-navigation"}),o.jsx(Qc,{children:o.jsxs(Cr,{children:[o.jsx(zt,{path:"/",element:s?o.jsx(fa,{pwaState:a}):o.jsx(qo,{to:{pathname:"/new",search:r.search},replace:!0})}),o.jsx(zt,{path:"/new",element:o.jsx(Xa,{})}),o.jsx(zt,{path:"*",element:o.jsx(qo,{to:"/",replace:!0})})]})})]})},Qc=d.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;let An=!1;const ed=t=>{An||(t.editor.defineTheme("ergogen-theme",{base:"vs-dark",inherit:!0,rules:[],colors:{"editor.background":n.colors.backgroundLight}}),An=!0)};Kn();const td=d.div`
  display: flex;
  flex-direction: column;
  color: #ffffff;
  height: 100%;
  width: 100%;
  font-family: 'Roboto', sans-serif;
`,od=Sr`
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
`;Mn.config({paths:{vs:"/monaco/vs"}});Mn.init().then(t=>{ed(t);const e=document.getElementById("root");Er(e).render(o.jsx(Wn.StrictMode,{children:o.jsx(Pr,{basename:("/".startsWith("."),"/"),children:o.jsxs(td,{children:[o.jsx(od,{}),o.jsx(qc,{})]})})}))});export{Ve as a,n as t};
