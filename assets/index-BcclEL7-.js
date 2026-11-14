const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/PcbPreview-DsKQssW6.js","assets/vendor-C9A_qoZ1.js","assets/StlPreview-DCDsWrqa.js","assets/three-BJECO8Vk.js","assets/js-yaml-DW8Bub87.js","assets/jszip-cZtdyB0p.js"])))=>i.map(i=>d[i]);
import{f as Ne,y as d,j as o,r as f,h as Ke,i as Ko,k as Rn,l as Nn,O as wt,p as Un,m as vr,n as jr,o as Wn,q as On,t as $r,v as io,w as Fn,L as Bn,x as Cr,z as zt,N as qo,A as Sr,B as Mn,e as Er,C as Pr}from"./vendor-C9A_qoZ1.js";import{j as pe}from"./js-yaml-DW8Bub87.js";import{J as Xe}from"./jszip-cZtdyB0p.js";import{_ as Tn}from"./three-BJECO8Vk.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function s(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(i){if(i.ep)return;i.ep=!0;const a=s(i);fetch(i.href,a)}})();const qe=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/ergogen.worker-D0KPj6kM.js",import.meta.url),{type:"module"})}catch(t){return console.error("Failed to create worker:",t),null}},so=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/jscad.worker-C8nLBdOi.js",import.meta.url),{type:"module"})}catch(t){return console.error("Failed to create JSCAD worker:",t),null}},Ir="0.19.2",yt={version:Ir},kt=t=>{const e=`v${Ne.version}`,s=Ne.version,r=Ne.repository,i=r.startsWith("github:")?r.replace("github:","https://github.com/"):r.replace(/^git\+/,"").replace(/\.git$/,"");if(!t)return{label:e,url:i,displayText:s,isCustom:!1,isHash:!1,isTag:!1};if(t.includes("@")){const x=t.split("@"),k=x[1]||t;return{label:t,url:t.startsWith("ergogen@")?`${i}/releases/tag/v${k}`:`https://www.npmjs.com/package/${x[0]}`,displayText:k,isCustom:!0,isHash:!1,isTag:!0}}const a=t.startsWith("github:")?t.slice(7):t,[l,p]=a.split("#"),m=l==="ergogen/ergogen",c=`https://github.com/${l}`;if(m){if(!p)return{label:"latest",url:c,displayText:s,isCustom:!1,isHash:!1,isTag:!1};const x=p.length===40&&/^[0-9a-fA-F]{40}$/.test(p),k=x?p.substring(0,7):p,u=x?`${c}/commit/${p}`:`${c}/tree/${p}`;return{label:p,url:u,displayText:k,isCustom:!0,isHash:x,isTag:!x}}if(!p)return{label:a,url:c,displayText:s,isCustom:!0,isHash:!1,isTag:!1};const h=p.length===40&&/^[0-9a-fA-F]{40}$/.test(p),b=h?p.substring(0,7):p,g=h?`${c}/commit/${p}`:`${c}/tree/${p}`;return{label:a,url:g,displayText:b,isCustom:!0,isHash:h,isTag:!h}},ao=t=>{if(t.includes("@")){const i=t.split("@"),a=i[1]||t,l=i[0];return`github:${l==="ergogen"?"ergogen/ergogen":l}#v${a}`}const e=t.startsWith("github:")?t.slice(7):t,[s,r]=e.split("#");return r?`github:${s}#${r}`:`github:${s}#v${Ne.version}`},Ee=t=>{const s=t.replace(/^v/,"").match(/^(\d+)\.(\d+)\.(\d+)/);return s?[Number(s[1]),Number(s[2]),Number(s[3])]:null},qt=(t,e)=>{for(let s=0;s<3;s++){if(t[s]>e[s])return!0;if(t[s]<e[s])return!1}return!0},Yo=t=>{const e=t.match(/(?:^|#|@|v)(\d+\.\d+\.\d+)/);return e?e[1]:null},Lr=t=>{const e=t.startsWith("github:")?t.slice(7):t,[s]=e.split("#");return!t.startsWith("github:")&&!t.includes("/")?!1:s!=="ergogen/ergogen"},Gn=()=>{if(typeof window>"u")return!1;const t=window.navigator;return typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches||t.standalone===!0},Hn=t=>{if(typeof window>"u")return!0;if(window.__FORCE_ANALYTICS__===!0||t.startsWith("G-TEST"))return!1;const e=window.location.hostname;return!!(e==="localhost"||e==="127.0.0.1"||e==="[::1]"||e.endsWith(".localhost"))},zr=()=>{if(typeof document>"u"||!document.cookie)return;const t=document.cookie.split(";");for(const e of t){const s=e.indexOf("="),r=(s>-1?e.substring(0,s):e).trim();if(r.startsWith("_ga")){document.cookie=`${r}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`;const a=window.location.hostname.split(".");for(;a.length>0;){const l=a.join(".");document.cookie=`${r}=; Path=/; Domain=.${l}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`,document.cookie=`${r}=; Path=/; Domain=${l}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`,a.shift()}}}},Dr=()=>{if(!(typeof indexedDB>"u"))try{indexedDB.deleteDatabase("workbox-background-sync")}catch{}},Vn=()=>typeof window>"u"||!window.location?void 0:`${window.location.origin&&window.location.origin!=="null"?window.location.origin:`${window.location.protocol||"https:"}//${window.location.hostname||"localhost"}`}${window.location.pathname||"/"}`,Jn="ergogen:consent:sendUsageMetrics",Ar="ergogen:config:sendUsageMetrics",Rr="ergogen:settings";let mt;const Xo=t=>{const e=localStorage.getItem(t);if(e!==null)try{const s=JSON.parse(e);return typeof s=="boolean"?s:void 0}catch{return}},Nr=()=>{const t=localStorage.getItem(Rr);if(t!==null)try{const e=JSON.parse(t);return e&&typeof e=="object"&&typeof e.sendUsageMetrics=="boolean"?e.sendUsageMetrics:void 0}catch{return}},_t=()=>{if(typeof window>"u")return!1;if(mt!==void 0)return mt;try{const t=Xo(Jn);if(t!==void 0)return t;if(Xo(Ar)===!1||Nr()===!1)return!1}catch{return!1}return!Gn()},Ur=t=>{try{localStorage.setItem(Jn,JSON.stringify(t)),mt=void 0}catch{mt=t}};let Te=!1;const Kn=()=>{var i;if(typeof window>"u")return;const t=_t(),e="G-46F2L343EK",s=Hn(e),r=document.getElementById("gtag-script");if(r||(Te=!1),t&&e&&!s){delete window["ga-disable-"+e];const a=window,l={send_page_view:!1,allow_google_signals:!1,allow_ad_personalization_signals:!1},p=()=>{var m;return(m=a.gtag)==null?void 0:m.call(a,"set",{page_location:Vn()})};if(r)Te&&(p(),(i=a.gtag)==null||i.call(a,"config",e,l),Te=!1);else{const m=document.createElement("script");m.async=!0,m.src=`https://www.googletagmanager.com/gtag/js?id=${e}`,m.id="gtag-script",document.head.appendChild(m);const c=a.dataLayer||[];a.dataLayer=c,a.gtag=function(){c.push(arguments)},a.gtag("js",new Date),p(),a.gtag("config",e,l),Te=!1}Hr()}else window["ga-disable-"+e]=!0,r&&(Te=!0),zr(),Dr(),Vr()},Wr=new Set(["yaml","yml","json","zip","ekb"]),Or=t=>{const e=t.lastIndexOf("."),s=e>=0?t.slice(e+1).toLowerCase():"";return Wr.has(s)?s:"other"},qn=100,Fr=/"[^"\n]*"|'[^'\n]*'|`[^`\n]*`/g,Br=/^at\s|^[^\s@]*@\S+:\d+:\d+$/,Mr=t=>t.split(`
`)[0].replace(Fr,e=>`${e[0]}*${e[0]}`).trim().slice(0,qn),Tr=t=>{const e=t.split(`
`).map(s=>s.trim()).filter(s=>Br.test(s));return e.length>0?e.join(" ").slice(0,qn):void 0},Gr=t=>{const e={...t};for(const s of["error_message","description"]){const r=e[s];typeof r=="string"&&(e[s]=Mr(r))}return typeof e.error_stack=="string"&&(e.error_stack=Tr(e.error_stack)),e},M=(t,e)=>{if(_t()&&!Hn("G-46F2L343EK")&&window.gtag){const r=Vn();window.gtag("set",{page_location:r}),window.gtag("event",t,{page_location:r,gui_version:yt.version,ergogen_version:ao("github:ceoloide/ergogen#v4.3.0"),is_pwa:Gn(),...Gr(e??{})})}},Ve=(t,e=!1,s)=>{const r=t instanceof Error?t.message:t,i=t instanceof Error?t.stack:void 0;M("exception",{description:s?`[${s}] ${r}`:r,fatal:e,error_stack:i})};let bt=!1;const Yn=t=>{Ve(t.error||t.message,!1,"unhandled_error")},Xn=t=>{Ve(t.reason||"Unhandled Promise Rejection",!1,"unhandled_rejection")},Hr=()=>{typeof window>"u"||bt||(window.addEventListener("error",Yn),window.addEventListener("unhandledrejection",Xn),bt=!0)},Vr=()=>{typeof window>"u"||bt&&(window.removeEventListener("error",Yn),window.removeEventListener("unhandledrejection",Xn),bt=!1)};function Jr(t){function e(c,h){return c>>>h|c<<32-h}const s=[],r=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],i=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],a=unescape(encodeURIComponent(t));for(let c=0;c<a.length;c++){const h=a.charCodeAt(c);s[c>>2]|=h<<24-c%4*8}const l=a.length;s[l>>2]|=128<<24-l%4*8;const p=(l+8>>6)+1;s[p*16-1]=l*8;for(let c=0;c<p;c++){const h=[];for(let L=0;L<16;L++)h[L]=s[c*16+L]||0;for(let L=16;L<64;L++){const S=e(h[L-15],7)^e(h[L-15],18)^h[L-15]>>>3,$=e(h[L-2],17)^e(h[L-2],19)^h[L-2]>>>10;h[L]=h[L-16]+S+h[L-7]+$|0}let b=r[0],g=r[1],x=r[2],k=r[3],u=r[4],y=r[5],j=r[6],E=r[7];for(let L=0;L<64;L++){const S=e(u,6)^e(u,11)^e(u,25),$=u&y^~u&j,D=E+S+$+i[L]+h[L]|0,z=e(b,2)^e(b,13)^e(b,22),v=b&g^b&x^g&x,w=z+v|0;E=j,j=y,y=u,u=k+D|0,k=x,x=g,g=b,b=D+w|0}r[0]=r[0]+b|0,r[1]=r[1]+g|0,r[2]=r[2]+x|0,r[3]=r[3]+k|0,r[4]=r[4]+u|0,r[5]=r[5]+y|0,r[6]=r[6]+j|0,r[7]=r[7]+E|0}let m="";for(let c=0;c<8;c++){const h=r[c];m+=(h>>>24&255).toString(16).padStart(2,"0"),m+=(h>>>16&255).toString(16).padStart(2,"0"),m+=(h>>>8&255).toString(16).padStart(2,"0"),m+=(h&255).toString(16).padStart(2,"0")}return m}function Yt(t,e){if(!t||typeof t!="object")return!1;const s=t;for(const r of e)if(s[r]===!0)return!0;for(const r of Object.keys(s))if(Yt(s[r],e))return!0;return!1}const Dt=t=>Math.round((t+Number.EPSILON)*100)/100,Zo=t=>{if(!t||typeof t!="object")return;const e=t.meta;if(!e||typeof e!="object")return;const s=e.zone;if(s){if(typeof s=="object"&&s!==null)return s.name;if(typeof s=="string")return s}};function Kr(t,e,s,r){const i=pe.load(t)||{},a=pe.load(e)||{},l=i.outlines||{},p=Object.keys(l),m=p.filter(X=>!X.startsWith("_")).length,c=p.length,h=Object.keys(i.pcbs||{}).length,b=Object.keys(i.cases||{}).length,g=Yt(i.pcbs,["reversible","reverse"]),x=Yt(i.points,["mirror"]),k=i.meta||{},u=k.name??"no_name",y=k.author??"no_author",j=i.points||{},E=Object.keys(j.zones||{}).length,L=j.zones||{},$=Object.keys(L).filter(X=>{const H=L[X];return H&&typeof H=="object"&&("columns"in H||"rows"in H)}),D=$.length,z=D>0;let v="",w="",P="",A=0;const R=Object.keys(a);if(z){const X=[...$].sort(),H=[],O=[],V=[];for(const _ of X){const N=L[_],T=Object.keys((N==null?void 0:N.columns)||{}),J=Object.keys((N==null?void 0:N.rows)||{}),G=(N==null?void 0:N.mirror)===!0||typeof(N==null?void 0:N.mirror)=="object"&&(N==null?void 0:N.mirror)!==null,re=j.mirror===!0||typeof j.mirror=="object"&&j.mirror!==null,te=G||re;let fe=R.filter(me=>{const ue=a[me];if(Zo(ue)!==_)return!1;if(ue&&typeof ue=="object"){const he=ue.meta;if(he&&typeof he=="object"&&he.mirrored===!0)return!1}return!me.startsWith("mirror_")}).length;te&&(fe*=2),H.push(T.length),O.push(J.length),V.push(fe),A+=fe}v=H.join(","),w=O.join(","),P=V.join(",")}const F=R.map(X=>{const H=a[X],O=Zo(H),_=(O?$.includes(O):!1)?"K":"A",N=Dt((H==null?void 0:H.x)??0),T=Dt((H==null?void 0:H.y)??0),J=Dt((H==null?void 0:H.r)??0);return{name:X,type:_,x:N,y:T,r:J}});F.sort((X,H)=>X.x!==H.x?X.x-H.x:X.y!==H.y?X.y-H.y:X.r!==H.r?X.r-H.r:X.name.localeCompare(H.name));const U=F.map(X=>`${X.type}${X.x.toString()};${X.y.toString()};${X.r.toString()}`).join("|"),B=`${u}|${y}|${U}`,Y=Jr(B).substring(0,12),ee=!x&&g?A*2:A;return{total_generation_time_ms:s,count_outlines:m,count_raw_outlines:c,count_pcbs:h,count_cases:b,is_reversible:g,is_mirrored:x,count_zones:E,matrix_zones:D,has_matrix:z,matrix_col_counts:v,matrix_row_counts:w,matrix_key_counts:P,matrix_keys:A,keyboard_keys:ee,config_id:Y,previous_config_id:r}}const n={colors:{accent:"#28a745",accentDark:"#1e8e1e",accentDarker:"#1e7e34",accentSecondary:"#239923",background:"#222222",backgroundLight:"#2a2a2a",backgroundLighter:"#333333",border:"#3f3f3f",text:"#ffffff",textDark:"#ccc",textDarker:"#aaa",textDarkest:"#666",error:"#ff6d6d",errorDark:"#a31111",warning:"hsl(45, 100%, 90%)",warningDark:"hsl(32, 79%, 40%)",info:"hsl(206, 94%, 92%)",infoDark:"hsl(206, 100%, 30%)",success:"hsl(120, 73%, 92%)",successDark:"hsl(120, 50%, 35%)",white:"#fff",buttonHover:"#3f3f3f"},fonts:{body:"'Roboto', sans-serif",code:"source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"},fontSizes:{xs:"0.4rem",sm:"0.8rem",base:"1rem",lg:"1.2rem",iconMedium:"16px",iconLarge:"24px",bodySmall:"13px",h1:"2.5rem",h2:"2rem",h3:"1.5rem"},fontWeights:{regular:400,semiBold:600,bold:700},buttonSizes:{large:{padding:"1rem 2rem",fontSize:"1rem"},medium:{padding:"0.7rem 1.4rem",fontSize:"1rem"},small:{padding:"8px 12px",fontSize:"0.8rem"},icon:{padding:"8px 12px",fontSize:"0.4rem"}}},vt=d.button`
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
`,de=({size:t,...e})=>{switch(t){case"icon":return o.jsx(Xr,{...e});case"sm":case"small":return o.jsx(Yr,{...e});case"md":case"medium":return o.jsx(qr,{...e});case"lg":case"large":default:return o.jsx(vt,{...e})}},Zr=t=>t.charAt(0).toUpperCase()+t.slice(1),jt=({injectionName:t,injectionType:e,onResolve:s,onCancel:r,"data-testid":i})=>{const[a,l]=f.useState(!1),p=Zr(e);return o.jsx(Qr,{"data-testid":i,children:o.jsxs(ei,{"data-testid":i&&`${i}-box`,children:[o.jsxs(ti,{children:[p," Conflict"]}),o.jsxs(oi,{children:["A ",e," with the name ",o.jsx("strong",{children:t})," ","already exists.",o.jsx("br",{}),"How would you like to resolve this conflict?"]}),o.jsxs(ni,{children:[o.jsx(ri,{type:"checkbox",id:"apply-to-all",checked:a,onChange:m=>l(m.target.checked),"data-testid":i&&`${i}-apply-to-all`,"aria-label":"Apply this choice to all conflicts"}),o.jsx(ii,{$checked:a,onClick:()=>l(!a),role:"checkbox","aria-checked":a}),o.jsx("label",{htmlFor:"apply-to-all",children:"Apply to all conflicts"})]}),o.jsxs(si,{children:[o.jsx(de,{onClick:()=>s("skip",a),size:"medium","data-testid":i&&`${i}-skip`,"aria-label":`Skip this ${e}`,children:"Skip"}),o.jsx(de,{onClick:()=>s("overwrite",a),size:"medium","data-testid":i&&`${i}-overwrite`,"aria-label":`Overwrite existing ${e}`,children:"Overwrite"}),o.jsx(de,{onClick:()=>s("keep-both",a),size:"medium","data-testid":i&&`${i}-keep-both`,"aria-label":`Keep both ${e}s`,children:"Keep Both"})]}),o.jsx(ai,{onClick:r,size:"small","data-testid":i&&`${i}-cancel`,"aria-label":"Cancel loading",children:"Cancel"})]})})},Qr=d.div`
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
`,Ue=t=>Array.isArray(t)&&t.length===3&&typeof t[0]=="string"&&typeof t[1]=="string"&&typeof t[2]=="string",Zn=(t,e,s)=>!s||s.length===0?{hasConflict:!1}:s.some(i=>Ue(i)&&i[0]===t&&i[1]===e)?{hasConflict:!0,conflictingName:e}:{hasConflict:!1},ci=(t,e)=>{if(!e||e.length===0)return[];const s=[];for(const r of t){if(!Ue(r))continue;const[i,a]=r,l=Zn(i,a,e);l.hasConflict&&s.push({injection:r,conflict:l})}return s},Qn=(t,e,s)=>{if(!s||s.length===0)return e;const r=new Set(s.filter(l=>Ue(l)&&l[0]===t).map(l=>l[1]));let i=1,a=`${e}_${i}`;for(;r.has(a);)i++,a=`${e}_${i}`;return a},At=(t,e,s)=>{const r=e?[...e]:[];for(const i of t){if(!Ue(i)){console.warn("[mergeInjectionArraysWithResolution] Skipping invalid injection format:",i);continue}const[a,l,p]=i;if(!Zn(a,l,r).hasConflict)r.push([a,l,p]);else{if(s==="skip")continue;if(s==="overwrite"){const c=r.findIndex(h=>Ue(h)&&h[0]===a&&h[1]===l);c!==-1&&(r[c]=[a,l,p])}else if(s==="keep-both"){const c=Qn(a,l,r);r.push([a,c,p])}}}return r},$t=t=>{const[e,s]=f.useState([]),r=e.length>0?e[0]:null,[i,a]=f.useState(null),[l,p]=f.useState(null),[m,c]=f.useState(null),h=f.useCallback(async(x,k,u=null,y)=>{var D,z,v;const j=y||t.getCurrentInjections();if(x.length===0){t.setInjectionInput(j),t.setConfigInput(k),await t.generateNow(k,j,{pointsonly:!1}),await((D=t.onComplete)==null?void 0:D.call(t,k,j));return}const E=x.filter(w=>Ue(w)?!0:(console.warn("[useInjectionConflictResolution] Skipping invalid injection format:",w),!1));if(E.length===0){t.setInjectionInput(j),t.setConfigInput(k),await t.generateNow(k,j,{pointsonly:!1}),await((z=t.onComplete)==null?void 0:z.call(t,k,j));return}const L=ci(E,j);if(L.length>0&&!u){const w=L.map(P=>({injection:P.injection,conflict:P.conflict}));M("conflict_encountered",{conflict_count:L.length}),s(w),a(E),p(k),c(j);return}const $=At(E,j,u||"skip");t.setInjectionInput($),t.setConfigInput(k),await t.generateNow(k,$,{pointsonly:!1}),await((v=t.onComplete)==null?void 0:v.call(t,k,$))},[t]),b=f.useCallback(async(x,k)=>{var u,y;if(!(!i||!l||e.length===0))if(k){M("conflict_resolved",{strategy:x,apply_to_all:!0,remaining_count:e.length});const j=At(i,m||t.getCurrentInjections(),x);t.setInjectionInput(j),t.setConfigInput(l),await t.generateNow(l,j,{pointsonly:!1}),await((u=t.onComplete)==null?void 0:u.call(t,l,j)),s([]),a(null),p(null),c(null)}else{M("conflict_resolved",{strategy:x,apply_to_all:!1,remaining_count:e.length});const j=e[0],[E,L]=j.injection,S=j.injection,$=e.slice(1);s($);let D=[...m||t.getCurrentInjections()],z=[...i||[]];if(x==="overwrite")D=D.filter(v=>!(v[0]===E&&v[1]===L));else if(x==="skip")z=z.filter(v=>!(v[0]===E&&v[1]===L&&v[2]===S[2]));else if(x==="keep-both"){const v=Qn(E,L,D),w=[E,v,S[2]];D=[...D,w],z=z.filter(P=>!(P[0]===E&&P[1]===L&&P[2]===S[2]))}if(c(D),a(z),$.length===0){const v=At(z,D,"skip");t.setInjectionInput(v),t.setConfigInput(l),await t.generateNow(l,v,{pointsonly:!1}),await((y=t.onComplete)==null?void 0:y.call(t,l,v)),a(null),p(null),c(null)}}},[i,l,m,e,t]),g=f.useCallback(()=>{var x;M("conflict_cancelled",{remaining_count:e.length}),s([]),a(null),p(null),c(null),(x=t.setError)==null||x.call(t,"Loading cancelled by user")},[t,e.length]);return{currentConflict:r?{name:r.injection[1],type:r.injection[0]}:null,processInjectionsWithConflictResolution:h,handleConflictResolution:b,handleConflictCancel:g}},li={templates:"4.3.0",outlines:"4.3.0"},ae=t=>{if(typeof window<"u"&&window.location)try{const m=new URLSearchParams(window.location.search).get(`ff_${t}`);if(m==="true")return!0;if(m==="false")return!1}catch(p){console.warn("[FeatureFlags] Failed to check URL query parameters:",p)}let e;if((t==="templates"||t==="outlines")&&(e=""),e==="true")return!0;if(e==="false")return!1;let r=kt("github:ceoloide/ergogen#v4.3.0").displayText;Ee(r)||(r=Ne.version);const i=li[t],a=Ee(r),l=Ee(i);return a&&l?qt(a,l):!1},di=50*1024*1024,ui=10*1024*1024,Rt=(t,e)=>{const s=`${e}/`;let r=t;return r.startsWith(s)&&(r=r.substring(s.length)),r=r.replace(/\.js$/,""),r},pi=t=>{let e=t.file("config.yaml")||t.file("config.yml");if(!e){const s=t.file(/^config\.(yaml|yml)$/i);s&&s.length>0&&(e=s[0])}if(!e)throw new Error("The archive is missing a config.yaml file in the root directory.");return e},Xt=(t,e)=>{if(e&&t>di)throw new Error(`File exceeds the maximum size limit of 50MB for archives (current size: ${(t/(1024*1024)).toFixed(1)}MB).`);if(!e&&t>ui)throw new Error(`File exceeds the maximum size limit of 10MB for text files (current size: ${(t/(1024*1024)).toFixed(1)}MB).`)},er=(t,e,s)=>{const r=[];return t.forEach(i=>r.push(["footprint",i.name,i.content])),e.forEach(i=>r.push(["outline",i.name,i.content])),s.forEach(i=>r.push(["template",i.name,i.content])),r},fi=async t=>{let e;try{e=await Xe.loadAsync(t)}catch{throw new Error("The file appears to be corrupted. Please verify the file and try again.")}const r=await pi(e).async("string"),i=[],a=[];return e.forEach((l,p)=>{if(!(p.dir||!l.endsWith(".js"))){if(l.startsWith("footprints/")){const m=p.async("string").then(c=>{const h=Rt(l,"footprints");i.push({type:"footprint",name:h,content:c})});a.push(m)}else if(l.startsWith("outlines/")&&ae("outlines")){const m=p.async("string").then(c=>{const h=Rt(l,"outlines");i.push({type:"outline",name:h,content:c})});a.push(m)}else if(l.startsWith("templates/")&&ae("templates")){const m=p.async("string").then(c=>{const h=Rt(l,"templates");i.push({type:"template",name:h,content:c})});a.push(m)}}}),await Promise.all(a),{config:r,injections:i}},Zt="ergogen:config",co="ergogen:multi-config",Qt="LOCAL_STORAGE_CONFIG",Qo=5e3,hi=40,gi=3;class ge extends Error{constructor(e){super(e),this.name="RateLimitError"}}class mi{constructor(){this.providers=[]}register(e){this.providers.push(e)}resolve(e){const s=e.trim();for(const r of this.providers)if(r.canHandle(s))return r;return/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(s)&&this.providers[0]||null}}const Ze=new mi,bi=t=>{const e=[],s=t.split(`
`);let r={};for(const i of s){const a=i.trim();if(a.startsWith("[submodule"))r.path&&r.url&&e.push({path:r.path,url:r.url}),r={};else{const l=a.indexOf("=");if(l!==-1){const p=a.substring(0,l).trim(),m=a.substring(l+1).trim();p==="path"?r.path=m:p==="url"&&(r.url=m)}}}return r.path&&r.url&&e.push({path:r.path,url:r.url}),e};class Qe{async fetchConfig(e){console.log(`[GitHub] Starting fetch from URL: ${e}`);const s=this.parseUrl(e),{owner:r,repo:i,branch:a,filePath:l,isRepoRoot:p}=s,m=s.host,c=[],h=[],b=[],g=async(k,u,y,j,E)=>{console.log("[GitHub] Checking for .gitmodules file");try{const L=await this.fetchFileContent(r,i,".gitmodules",u,m);console.log("[GitHub] .gitmodules found, parsing submodules");const S=bi(L);for(const $ of S)if($.path.includes(y)||$.path.includes(j)&&ae("outlines")||$.path.includes(E)&&ae("templates")){const D=$.path.includes(j),z=$.path.includes(E),v=D?j:z?E:y,w=D?h:z?b:c,P=$.path.substring($.path.indexOf(v)+v.length+1),A=Ze.resolve($.url);if(A instanceof Qe){const R=A.parseUrl($.url),F=R.host;let U=[];try{U=await A.fetchFootprintsFromDirectory(R.owner,R.repo,"","main",[".js"],F)}catch(Z){if(Z instanceof ge)throw Z;try{U=await A.fetchFootprintsFromDirectory(R.owner,R.repo,"","master",[".js"],F)}catch(Y){if(Y instanceof ge)throw Y;console.warn(`Failed to fetch submodule footprints from ${$.url}`)}}const B=U.map(Z=>({name:P?`${P}/${Z.name}`:Z.name,content:Z.content}));w.push(...B)}}}catch(L){if(L instanceof ge)throw L}};if(!p){if(!l)throw new Error("Invalid URL. File path not specified.");const k=await this.fetchFileContent(r,i,l,a,m);Xt(k.length,!1);const u=l.split("/").pop()||"";if(!(u==="config.yaml"||u==="config.yml"))return{config:k,footprints:[],outlines:[],templates:[],configPath:u};const j=l.substring(0,l.lastIndexOf("/")),E=j?`${j}/footprints`:"footprints",L=j?`${j}/outlines`:"outlines",S=j?`${j}/templates`:"templates";try{const $=await this.fetchFootprintsFromDirectory(r,i,E,a,[".js"],m);c.push(...$)}catch($){if($ instanceof ge)throw $}if(ae("outlines"))try{const $=await this.fetchFootprintsFromDirectory(r,i,L,a,[".js",".svg"],m);h.push(...$)}catch($){if($ instanceof ge)throw $}if(ae("templates"))try{const $=await this.fetchFootprintsFromDirectory(r,i,S,a,[".js"],m);b.push(...$)}catch($){if($ instanceof ge)throw $}return await g(j,a,E,L,S),{config:k,footprints:c,outlines:h,templates:b,configPath:u}}const x=async k=>{var $,D,z,v,w,P,A,R,F,U,B,Z;let u="",y="",j=!0;try{u=await this.fetchFileContent(r,i,"config.yaml",k,m),y=""}catch(Y){const ee=Y;if(($=ee.message)!=null&&$.includes("allowance")||(D=ee.message)!=null&&D.includes("limit exceeded")||(z=ee.message)!=null&&z.includes("rate limit"))throw ee;try{u=await this.fetchFileContent(r,i,"config.yml",k,m),y=""}catch(X){const H=X;if((v=H.message)!=null&&v.includes("allowance")||(w=H.message)!=null&&w.includes("limit exceeded")||(P=H.message)!=null&&P.includes("rate limit"))throw H;try{u=await this.fetchFileContent(r,i,"ergogen/config.yaml",k,m),y="ergogen"}catch(O){const V=O;if((A=V.message)!=null&&A.includes("allowance")||(R=V.message)!=null&&R.includes("limit exceeded")||(F=V.message)!=null&&F.includes("rate limit"))throw V;try{u=await this.fetchFileContent(r,i,"ergogen/config.yml",k,m),y="ergogen"}catch(_){const N=_;if((U=N.message)!=null&&U.includes("allowance")||(B=N.message)!=null&&B.includes("limit exceeded")||(Z=N.message)!=null&&Z.includes("rate limit"))throw N;const{configYamls:T,anyYamls:J}=await this.bfsForYamlFiles(r,i,k,m);if(T.length>0){const G=T[0];u=await this.fetchFileContent(r,i,G,k,m),y=G.includes("/")?G.substring(0,G.lastIndexOf("/")):""}else if(J.length>0){const G=J[0];u=await this.fetchFileContent(r,i,G,k,m),y=G.includes("/")?G.substring(0,G.lastIndexOf("/")):"",j=!1}else throw new Error("No YAML configuration files found in repository")}}}}if(Xt(u.length,!1),!j)return{config:u,footprints:[],outlines:[],templates:[],configPath:y};const E=y?`${y}/footprints`:"footprints",L=y?`${y}/outlines`:"outlines",S=y?`${y}/templates`:"templates";try{const Y=await this.fetchFootprintsFromDirectory(r,i,E,k,[".js"]);c.push(...Y)}catch(Y){if(Y instanceof ge)throw Y}if(ae("outlines"))try{const Y=await this.fetchFootprintsFromDirectory(r,i,L,k,[".js",".svg"]);h.push(...Y)}catch(Y){if(Y instanceof ge)throw Y}if(ae("templates"))try{const Y=await this.fetchFootprintsFromDirectory(r,i,S,k,[".js"]);b.push(...Y)}catch(Y){if(Y instanceof ge)throw Y}return await g(y,k,E,L,S),{config:u,footprints:c,outlines:h,templates:b,configPath:y}};if(a!=="main")return await x(a);try{return await x("main")}catch(k){if(k instanceof ge)throw k;return await x("master")}}async fetchFootprintsFromDirectory(e,s,r,i,a,l){const p=[],m=async c=>{try{const h=await this.listDirectory(e,s,c,i,l);for(const b of h){const g=b.path.startsWith(c)?b.path:c?`${c}/${b.path}`:b.path;if(b.type==="file"){if(a.some(k=>b.name.endsWith(k)))try{const k=await this.fetchFileContent(e,s,g,i,l),u=r?g.slice(r.length+1).replace(/\.[^/.]+$/,""):g.replace(/\.[^/.]+$/,"");console.log(`[GitHub] Loaded footprint: ${u}`),p.push({name:u,content:k})}catch(k){if(k instanceof ge)throw k;const u=k;console.warn(`Failed to fetch file content: ${g}`,u.stack||u)}}else b.type==="dir"&&await m(g)}}catch(h){if(h instanceof ge)throw h}};return await m(r),p}async bfsForYamlFiles(e,s,r,i){var h,b,g;const a=[],l=[],p=[{path:"",depth:0}],m=new Set;let c=0;for(;p.length>0&&c<hi;){const{path:x,depth:k}=p.shift();if(!m.has(x)){m.add(x);try{c++;const u=await this.listDirectory(e,s,x,r,i);for(const y of u)if(y.type==="file"){const j=y.name.toLowerCase();(j.endsWith(".yaml")||j.endsWith(".yml"))&&!j.startsWith(".")&&j.replace(/\.(yaml|yml)$/,"")!=="metadata"&&j.replace(/\.(yaml|yml)$/,"")!=="virtual_env"&&(y.name==="config.yaml"||y.name==="config.yml"?a.push(y.path):l.push(y.path))}else y.type==="dir"&&k<gi&&(y.name.startsWith(".")||p.push({path:y.path,depth:k+1}));if(a.length>0||l.length>0&&(p.length===0||p[0].depth>k))break}catch(u){const y=u;if((h=y.message)!=null&&h.includes("allowance")||(b=y.message)!=null&&b.includes("limit exceeded")||(g=y.message)!=null&&g.includes("rate limit"))throw y;continue}}}return{configYamls:a,anyYamls:l}}}const xi=(t,e)=>{var p,m,c,h;if(!t)return{isLimitExceeded:!1,error:null};if(e.includes("raw.githubusercontent.com"))return t.status===429?(console.warn("[GitHub] Raw content rate limit exceeded (429). Please wait 30 minutes and try again."),{isLimitExceeded:!0,error:"You've reached your hourly request allowance for loading content from GitHub. Please wait 30 minutes and try again."}):{isLimitExceeded:!1,error:null};const r=((p=t.headers)==null?void 0:p.get("X-RateLimit-Limit"))||"unknown",i=((m=t.headers)==null?void 0:m.get("X-RateLimit-Remaining"))||"unknown",a=((c=t.headers)==null?void 0:c.get("X-RateLimit-Used"))||"unknown",l=((h=t.headers)==null?void 0:h.get("X-RateLimit-Reset"))||"unknown";if(console.log(`[GitHub Rate Limit] Limit: ${r}, Remaining: ${i}, Used: ${a}, Reset: ${l}`),t.status===403&&i==="0")return console.warn("[GitHub] Rate limit exceeded. Please wait and try again in about an hour."),{isLimitExceeded:!0,error:"Cannot load from GitHub right now. You've used your hourly request allowance. Please wait about an hour and try again."};if(i!=="unknown"&&r!=="unknown"){const b=parseInt(r),g=parseInt(i),x=(b-g)/b*100;if(x>=80&&g>0)return console.warn(`[GitHub] Approaching rate limit: ${x.toFixed(1)}% used`),{isLimitExceeded:!1,error:"Loading from GitHub may become unavailable soon. You've used most of your hourly request allowance. This will reset within an hour."}}return{isLimitExceeded:!1,error:null}};class wi extends Qe{constructor(){super(...arguments),this.rateLimitWarning=null}canHandle(e){const s=e.trim();return s.includes("github.com")||/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(s)}parseUrl(e){const s=e.trim();let r="",i="",a="main",l,p=!0;const m=!s.includes("github.com");if(m){const c=s.split("/").filter(Boolean);if(c.length<2)throw new Error("Invalid GitHub repository format. Must contain owner and repository.");r=c[0],i=c[1],p=c.length===2||c.length===4&&c[2]==="tree",p?c.length===4&&(a=c[3]):c[2]==="blob"||c[2]==="tree"?(a=c[3],l=c.slice(4).join("/")):l=c.slice(2).join("/")}else{let c=s;c.match(/^(https?:\/\/)/i)||(c=`https://${c}`);const h=c.endsWith("/")?c.slice(0,-1):c,g=new URL(h).pathname.split("/").filter(Boolean);if(g.length<2)throw new Error("Invalid GitHub URL. Must contain owner and repository.");r=g[0],i=g[1],p=g.length===2||g.length===4&&g[2]==="tree",p?g.length===4&&(a=g[3]):g[2]==="blob"||g[2]==="tree"?(a=g[3],l=g.slice(4).join("/")):l=g.slice(2).join("/")}return i.endsWith(".git")&&(i=i.slice(0,-4)),{owner:r,repo:i,branch:a,filePath:l,isRepoRoot:p,baseUrl:m?`https://github.com/${r}/${i}`:s}}async fetchFileContent(e,s,r,i){const a=`https://raw.githubusercontent.com/${e}/${s}/${i}/${r}`,l=await fetch(a);if(this.checkRateLimits(l,a),!l.ok)throw new Error(`Failed to fetch file content from GitHub: ${l.status}`);return await l.text()}async listDirectory(e,s,r,i){const a=`https://api.github.com/repos/${e}/${s}/contents/${r}?ref=${i}`,l=await fetch(a);if(this.checkRateLimits(l,a),!l.ok)throw new Error(`Failed to list directory from GitHub: ${l.status}`);const p=await l.json();let m=[];if(Array.isArray(p))m=p;else if(p&&typeof p=="object"&&"tree"in p&&Array.isArray(p.tree))m=p.tree;else throw new Error("Target path is not a directory");return m.map(c=>({name:c.name||c.path.split("/").pop()||"",path:c.path,type:c.type==="tree"?"dir":c.type==="blob"?"file":c.type}))}checkRateLimits(e,s){const r=xi(e,s);if(r.error&&!this.rateLimitWarning&&(this.rateLimitWarning=r.error),r.isLimitExceeded)throw new ge(r.error||"Rate limit exceeded")}async fetchConfig(e){this.rateLimitWarning=null;const s=await super.fetchConfig(e);return this.rateLimitWarning&&(s.rateLimitWarning=this.rateLimitWarning),s}}Ze.register(new wi);const tr=async t=>{const e=Ze.resolve(t);if(!e)throw new Error(`Unsupported repository provider URL: ${t}`);return e.fetchConfig(t)};class yi extends Qe{canHandle(e){return e.includes("codeberg.org")}parseUrl(e){const s=e.trim();let r="",i="",a="main",l,p=!0;const m=!s.includes("codeberg.org");if(m){const c=s.split("/").filter(Boolean);if(c.length<2)throw new Error("Invalid Codeberg repository format. Must contain owner and repository.");r=c[0],i=c[1],p=c.length===2||c.length===5&&c[2]==="src"&&(c[3]==="branch"||c[3]==="commit"),p?c.length===5&&(a=c[4]):c.length>=5&&c[2]==="src"&&(c[3]==="branch"||c[3]==="commit")?(a=c[4],l=c.slice(5).join("/")):l=c.slice(2).join("/")}else{let c=s;c.match(/^(https?:\/\/)/i)||(c=`https://${c}`);const h=c.endsWith("/")?c.slice(0,-1):c,g=new URL(h).pathname.split("/").filter(Boolean);if(g.length<2)throw new Error("Invalid Codeberg URL. Must contain owner and repository name.");r=g[0],i=g[1],p=g.length===2||g.length===5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit"),p?g.length===5&&(a=g[4]):g.length>=5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit")?(a=g[4],l=g.slice(5).join("/")):l=g.slice(2).join("/")}return i.endsWith(".git")&&(i=i.slice(0,-4)),{owner:r,repo:i,branch:a,filePath:l,isRepoRoot:p,baseUrl:m?`https://codeberg.org/${r}/${i}`:s}}async fetchFileContent(e,s,r,i){const a=`https://codeberg.org/api/v1/repos/${e}/${s}/raw/${r}?ref=${i}`,l=await fetch(a);if(!l.ok)throw new Error(`Failed to fetch file content from Codeberg API: ${l.status}`);return await l.text()}async listDirectory(e,s,r,i){const a=r?`/${r}`:"",l=`https://codeberg.org/api/v1/repos/${e}/${s}/contents${a}?ref=${i}`,p=await fetch(l);if(!p.ok)throw new Error(`Failed to list directory from Codeberg API: ${p.status}`);const m=await p.json();if(!Array.isArray(m))throw new Error("Target path is not a directory");return m.map(c=>({name:c.name,path:c.path||c.name,type:c.type}))}}Ze.register(new yi);class ki extends Qe{canHandle(e){const s=e.trim();return s.match(/^(https?:\/\/)/i)?!s.includes("github.com")&&!s.includes("codeberg.org"):!1}parseUrl(e){const s=e.trim();let r="",i="",a="main",l,p=!0,m=s;m.match(/^(https?:\/\/)/i)||(m=`https://${m}`);const c=m.endsWith("/")?m.slice(0,-1):m,h=new URL(c),b=h.origin,g=h.pathname.split("/").filter(Boolean);if(g.length<2)throw new Error("Invalid Forgejo/Gitea URL. Must contain owner and repository name.");return r=g[0],i=g[1],p=g.length===2||g.length===5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit"),p?g.length===5&&(a=g[4]):g.length>=5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit")?(a=g[4],l=g.slice(5).join("/")):l=g.slice(2).join("/"),i.endsWith(".git")&&(i=i.slice(0,-4)),{owner:r,repo:i,branch:a,filePath:l,isRepoRoot:p,baseUrl:s,host:b}}async fetchFileContent(e,s,r,i,a){const p=`${a||"https://codeberg.org"}/api/v1/repos/${e}/${s}/raw/${r}?ref=${i}`,m=await fetch(p);if(!m.ok)throw new Error(`Failed to fetch file content from Gitea/Forgejo API: ${m.status}`);return await m.text()}async listDirectory(e,s,r,i,a){const l=a||"https://codeberg.org",p=r?`/${r}`:"",m=`${l}/api/v1/repos/${e}/${s}/contents${p}?ref=${i}`,c=await fetch(m);if(!c.ok)throw new Error(`Failed to list directory from Gitea/Forgejo API: ${c.status}`);const h=await c.json();if(!Array.isArray(h))throw new Error("Target path is not a directory");return h.map(b=>({name:b.name,path:b.path||b.name,type:b.type}))}}const _i=new ki;Ze.register(_i);const vi=({processInjectionsWithConflictResolution:t,setError:e})=>{const[s,r]=f.useState(!1),i=f.useRef(!1);return f.useEffect(()=>{const a=async()=>{const l=new URLSearchParams(window.location.search),p=l.get("github"),m=l.get("codeberg"),c=l.get("forgejo"),h=l.get("gitea");let b=p||m||c||h;if(b){m&&!m.includes("codeberg.org")?b=`https://codeberg.org/${m}`:p&&!p.includes("github.com")&&(b=`https://github.com/${p}`),r(!0),console.log("[useConfigLoader] Loading from URL parameter:",b);try{const g=await tr(b);console.log("[useConfigLoader] Fetch result:",{configLength:g.config.length,footprintsCount:g.footprints.length,outlinesCount:g.outlines.length,configPath:g.configPath,rateLimitWarning:g.rateLimitWarning}),g.rateLimitWarning&&e(g.rateLimitWarning);const x=er(g.footprints,g.outlines,g.templates);await t(x,g.config)}catch(g){console.error("[useConfigLoader] Failed to load from remote repository:",g),e(`Failed to load from remote repository: ${g instanceof Error?g.message:String(g)}`)}finally{r(!1)}}};i.current||(i.current=!0,a())},[t,e]),{isLoading:s}},Ye=(t,e)=>{const s=new Map;for(const r of e){const[i,a,l]=r;let p="footprints";i==="outline"?p="outlines":i==="template"&&(p="templates");const m=t.folder(p);if(m){const c=a.split("/"),h=c.pop();let b=m,g=p;for(const x of c){const k=`${g}/${x}`;let u=s.get(k);u||(u=b.folder(x)||b,s.set(k,u)),b=u,g=k}h&&b.file(`${h}.js`,l)}}},or=async(t,e,s,r,i)=>{var h;const a=new Xe;a.file("config.yaml",e);const l=a.folder("outputs");if(l){if((h=t.demo)!=null&&h.svg&&l.file("demo.svg",t.demo.svg),t.outlines){let b=null;for(const[g,x]of Object.entries(t.outlines))(r||!g.startsWith("_"))&&(x.dxf||x.svg)&&(b||(b=l.folder("outlines")),b&&(x.dxf&&b.file(`${g}.dxf`,x.dxf),x.svg&&b.file(`${g}.svg`,x.svg)))}if(t.pcbs&&Object.keys(t.pcbs).length>0){const b=l.folder("pcbs");if(b)for(const[g,x]of Object.entries(t.pcbs)){const k=g.endsWith(".kicad_pcb")?g:`${g}.kicad_pcb`;b.file(k,x)}}if(t.cases){let b=null;for(const[g,x]of Object.entries(t.cases)){const k=!!x.jscad,u=i&&!!x.stl;(k||u)&&(b||(b=l.folder("cases")),b&&(x.jscad&&b.file(`${g}.jscad`,x.jscad),i&&x.stl&&b.file(`${g}.stl`,x.stl)))}}if(r){const b=l.folder("debug");if(b){b.file("raw.txt",e);for(const[g,x]of Object.entries(t))["canonical","points","units"].includes(g)&&b.file(`${g}.yaml`,JSON.stringify(x,null,2))}}}s&&s.length>0&&Ye(a,s);const p=await a.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),c=`ergogen-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Ke.saveAs(p,c)},ji=(t,e)=>new Promise((s,r)=>{const i=qe();if(!i){r(new Error("Failed to create Ergogen worker"));return}const a=setTimeout(()=>{i.terminate(),r(new Error("Compilation timed out"))},15e3);i.onmessage=p=>{const m=p.data;m.type==="error"?(clearTimeout(a),r(new Error(m.error)),i.terminate()):m.type==="success"&&(clearTimeout(a),s(m.results),i.terminate())},i.onerror=p=>{clearTimeout(a),r(p),i.terminate()};let l;try{l=JSON.parse(t)}catch{try{l=pe.load(t)}catch{l=t}}i.postMessage({type:"generate",inputConfig:l,injectionInput:e,requestId:`export-compile-${Date.now()}`,options:{debug:!0,svg:!0}})}),$i=t=>new Promise(e=>{const s=so();if(!s){e(t);return}const r=setTimeout(()=>{s.terminate(),e(t)},15e3);s.onmessage=i=>{const a=i.data;a.type==="success"&&a.results?(clearTimeout(r),e(a.results)):(clearTimeout(r),e(t)),s.terminate()},s.onerror=()=>{clearTimeout(r),e(t),s.terminate()},s.postMessage({type:"batch_jscad_to_stl",results:t,configVersion:0})}),Ci=async(t,e,s,r)=>{var m;const i=new Xe;for(const c of t){const h=c.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled",b=i.folder(h);if(b)try{const g=await ji(c.config,e);let x=g;r&&g.cases&&Object.keys(g.cases).length>0&&(x=await $i(g)),b.file("config.yaml",c.config);const k=b.folder("outputs");if(k){if((m=x.demo)!=null&&m.svg&&k.file("demo.svg",x.demo.svg),x.outlines){let u=null;for(const[y,j]of Object.entries(x.outlines))(s||!y.startsWith("_"))&&(j.dxf||j.svg)&&(u||(u=k.folder("outlines")),u&&(j.dxf&&u.file(`${y}.dxf`,j.dxf),j.svg&&u.file(`${y}.svg`,j.svg)))}if(x.pcbs&&Object.keys(x.pcbs).length>0){const u=k.folder("pcbs");if(u)for(const[y,j]of Object.entries(x.pcbs)){const E=y.endsWith(".kicad_pcb")?y:`${y}.kicad_pcb`;u.file(E,j)}}if(x.cases){let u=null;for(const[y,j]of Object.entries(x.cases)){const E=!!j.jscad,L=r&&!!j.stl;(E||L)&&(u||(u=k.folder("cases")),u&&(j.jscad&&u.file(`${y}.jscad`,j.jscad),r&&j.stl&&u.file(`${y}.stl`,j.stl)))}}if(s){const u=k.folder("debug");if(u){u.file("raw.txt",c.config);for(const[y,j]of Object.entries(x))["canonical","points","units"].includes(y)&&u.file(`${y}.yaml`,JSON.stringify(j,null,2))}}}e&&e.length>0&&Ye(b,e)}catch(g){console.error(`Failed to compile config ${c.name}:`,g),b.file("config.yaml",c.config),b.file("error.txt",`Compilation failed: ${g instanceof Error?g.message:String(g)}`)}}const a=await i.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),p=`ergogen-export-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Ke.saveAs(a,p)},Si=async(t,e)=>{const s=new Xe,r=new Set;for(const p of t){const m=p.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled";let c=m,h=1;for(;r.has(c);)c=`${m}_${h}`,h++;r.add(c),s.file(`${c}.yaml`,p.config)}e&&e.length>0&&Ye(s,e);const i=await s.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),l=`ergogen-config-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Ke.saveAs(i,l)},Ei=async(t,e,s,r,i,a,l)=>{const p=new Xe,m=new Set;if(i){for(let g=0;g<t.length;g++){if(l())return;const x=t[g];a(g,t.length,x.name);const k=x.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled";let u=k,y=1;for(;m.has(u);)u=`${k}_${y}`,y++;m.add(u),p.file(`${u}.yaml`,x.config)}if(e&&e.length>0){if(l())return;Ye(p,e)}if(l())return;a(t.length,t.length,"Creating ZIP...");const c=await p.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),b=`ergogen-config-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;return Ke.saveAs(c,b),{succeededCount:t.length,failedCount:0}}else{const c=new Set,h=(E,L)=>new Promise((S,$)=>{if(l()){$(new Error("Aborted"));return}const D=qe();if(!D){$(new Error("Failed to create Ergogen worker"));return}c.add(D);const z=setTimeout(()=>{D.terminate(),c.delete(D),$(new Error("Compilation timed out"))},3e4);D.onmessage=w=>{const P=w.data;P.type==="error"?(clearTimeout(z),D.terminate(),c.delete(D),$(new Error(P.error))):P.type==="success"&&(clearTimeout(z),D.terminate(),c.delete(D),S(P.results))},D.onerror=w=>{clearTimeout(z),D.terminate(),c.delete(D),$(w)};let v;try{v=JSON.parse(E)}catch{try{v=pe.load(E)}catch{v=E}}D.postMessage({type:"generate",inputConfig:v,injectionInput:L,requestId:`export-compile-${Date.now()}`})}),b=E=>new Promise(L=>{if(l()||!E.cases||Object.keys(E.cases).length===0){L(E);return}const S=so();if(!S){L(E);return}c.add(S);const $=setTimeout(()=>{S.terminate(),c.delete(S),L(E)},3e4);S.onmessage=D=>{const z=D.data;z.type==="success"?(clearTimeout($),S.terminate(),c.delete(S),L(z.results)):z.type==="error"&&(clearTimeout($),S.terminate(),c.delete(S),L(E))},S.onerror=()=>{clearTimeout($),S.terminate(),c.delete(S),L(E)},S.postMessage({type:"batch_jscad_to_stl",results:E,configVersion:0})}),g=new Set;let x=0,k=0,u=0;const y=Math.min(4,navigator.hardwareConcurrency||2),j=async E=>{var $;if(l())return;g.add(E.name),a(x,t.length,Array.from(g).join(", "));const L=E.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled",S=p.folder(L);if(!S){g.delete(E.name),x++,a(x,t.length,Array.from(g).join(", "));return}try{const D=await h(E.config,e);let z=D;if(D.cases&&Object.keys(D.cases).length>0&&(z=await b(D)),l())return;S.file("config.yaml",E.config);const v=S.folder("outputs");if(v){if(($=z.demo)!=null&&$.svg&&v.file("demo.svg",z.demo.svg),z.outlines){let w=null;for(const[P,A]of Object.entries(z.outlines))(s||!P.startsWith("_"))&&(A.dxf||A.svg)&&(w||(w=v.folder("outlines")),w&&(A.dxf&&w.file(`${P}.dxf`,A.dxf),A.svg&&w.file(`${P}.svg`,A.svg)))}if(z.pcbs&&Object.keys(z.pcbs).length>0){const w=v.folder("pcbs");if(w)for(const[P,A]of Object.entries(z.pcbs)){const R=P.endsWith(".kicad_pcb")?P:`${P}.kicad_pcb`;w.file(R,A)}}if(z.cases){let w=null;for(const[P,A]of Object.entries(z.cases)){const R=!!A.jscad,F=!!A.stl;(R||F)&&(w||(w=v.folder("cases")),w&&(A.jscad&&w.file(`${P}.jscad`,A.jscad),A.stl&&w.file(`${P}.stl`,A.stl)))}}if(s){const w=v.folder("debug");if(w){w.file("raw.txt",E.config);for(const[P,A]of Object.entries(z))["canonical","points","units"].includes(P)&&w.file(`${P}.yaml`,JSON.stringify(A,null,2))}}}e&&e.length>0&&Ye(S,e),k++}catch(D){u++,console.error(`Failed to compile config ${E.name}:`,D),S.file("config.yaml",E.config),S.file("error.txt",`Compilation failed: ${D instanceof Error?D.message:String(D)}`)}finally{g.delete(E.name),x++,a(x,t.length,Array.from(g).join(", "))}};try{const E=[...t],L=[],S=async()=>{if(l()||E.length===0)return;const v=E.shift();await j(v),await S()};for(let v=0;v<Math.min(y,E.length);v++)L.push(S());if(await Promise.all(L),l()){c.forEach(v=>v.terminate()),c.clear();return}a(t.length,t.length,"Creating ZIP...");const $=await p.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),z=`ergogen-export-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;return Ke.saveAs($,z),{succeededCount:k,failedCount:u}}finally{c.forEach(E=>E.terminate()),c.clear()}}},Pi=t=>!t||!Array.isArray(t)?t:t.filter(e=>{if(!Array.isArray(e)||e.length!==3)return!0;const[s]=e;return!(s==="outline"&&!ae("outlines")||s==="template"&&!ae("templates"))}),Ii=t=>{if(!t||!Array.isArray(t))return null;const e=t.some(a=>Array.isArray(a)&&a[0]==="outline"),s=t.some(a=>Array.isArray(a)&&a[0]==="template"),r=e&&!ae("outlines"),i=s&&!ae("templates");if(r||i){const a=[];return r&&a.push("outlines"),i&&a.push("templates"),`Custom ${a.join(" and ")} were skipped because the respective feature flags are disabled in settings.`}return null},Li=t=>{if(!t||typeof t!="object")return null;const e=t;if(!e.pcbs||typeof e.pcbs!="object")return null;const s=e.pcbs;for(const r of Object.values(s))if(r&&typeof r=="object"&&(!r.template||r.template==="kicad5")){const i=r.footprints;if(i&&typeof i=="object"){for(const a of Object.values(i))if(a&&typeof a=="object"&&typeof a.what=="string"&&a.what.startsWith("ceoloide"))return'KiCad 5 is deprecated. Please add "template: kicad8" to your PCB definitions to avoid errors when opening PCB files with KiCad 8 or newer.'}}return null},zi=(t,e)=>{if(t&&typeof t=="object"){const s=t;return s.points&&e?{...s,pcbs:void 0,cases:void 0}:s}return t},Ge=(t,e)=>{if(typeof window>"u")return e;try{const s=localStorage.getItem(t);return s!==null?JSON.parse(s):e}catch{return e}},en=()=>({debug:Ge("ergogen:config:debug",!1),autoGen:Ge("ergogen:config:autoGen",!0),autoGen3D:Ge("ergogen:config:autoGen3D",!0),kicanvasPreview:Ge("ergogen:config:kicanvasPreview",!0),stlPreview:Ge("ergogen:config:stlPreview",!0),sendUsageMetrics:_t()}),nr=f.createContext(null),Ae=()=>typeof window<"u"&&window.crypto&&window.crypto.randomUUID?window.crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,t=>{const e=Math.random()*16|0;return(t==="x"?e:e&3|8).toString(16)}),st=(t,e)=>{let s=0;for(const r of t){const i=r.name.match(e);if(i){const a=parseInt(i[1],10);!isNaN(a)&&a>s&&(s=a)}}return s+1},xt="ergogen:deleted-config",Di=t=>{try{const e=localStorage.getItem(xt),s={version:1,configs:[]};if(e){const i=JSON.parse(e);i&&Array.isArray(i.configs)&&(s.configs=i.configs,i.version!==void 0&&(s.version=i.version))}const r={...t,deletedAt:new Date().toISOString()};s.configs.push(r),localStorage.setItem(xt,JSON.stringify(s))}catch(e){console.error("Failed to save deleted config to storage:",e)}},tn=()=>{try{const t=localStorage.getItem(xt);if(!t)return;const e=JSON.parse(t);if(!e||!Array.isArray(e.configs))return;let s=e.configs;const r=Date.now(),i=90*24*60*60*1e3;s=s.filter(l=>{const p=new Date(l.deletedAt).getTime();return r-p<=i}),s.length>100&&(s.sort((l,p)=>{const m=new Date(l.updatedAt).getTime(),c=new Date(p.updatedAt).getTime();return m-c}),s=s.slice(s.length-100));const a={version:e.version||1,configs:s};localStorage.setItem(xt,JSON.stringify(a))}catch(t){console.error("Failed to prune deleted configs:",t)}},on=t=>{if(!t)return;let e="";if(typeof t=="string")e=t;else if(Array.isArray(t))e=t.join("");else return;return e=e.replace(/width="[^"]+"/,'width="284px"').replace(/height="[^"]+"/,'height="134px"'),e=e.replace(/<svg/,'<svg style="background-color: rgb(51,51,51);"'),e=e.replaceAll(/stroke="#000"/g,'stroke="#AAA"'),e=e.replaceAll(/stroke:#000/g,"stroke:#AAA"),e},Ai=()=>{if(typeof window>"u")return{version:2,activeConfigId:null,configs:[]};const t=localStorage.getItem(co);if(t)try{const e=JSON.parse(t);if(e&&typeof e.version=="number"){const s=new Date().toISOString(),r=(e.configs||[]).map(i=>({...i,createdAt:i.createdAt||s,updatedAt:i.updatedAt||s}));return{...e,configs:r}}}catch(e){console.error("Failed to parse multi-config storage:",e)}return{version:2,activeConfigId:null,configs:[]}},le=(t,e,s=2)=>{if(typeof window>"u")return;const r={version:s,activeConfigId:e,configs:t};localStorage.setItem(co,JSON.stringify(r))},Ri=()=>{const t=Ai();if(typeof window>"u")return t;const e=localStorage.getItem(Qt),s=localStorage.getItem(Zt);let r="";if(e)try{r=JSON.parse(e)}catch{r=e}else if(s)try{r=JSON.parse(s)}catch{r=s}if(r&&r.trim()!==""){if(!t.configs.some(a=>a.name==="Legacy Config")){const a=Ae(),l={id:a,name:"Legacy Config",config:r,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};t.configs.push(l),t.activeConfigId=a,le(t.configs,a,2)}localStorage.removeItem(Qt),localStorage.removeItem(Zt)}return t},Ni=({initialInjectionInput:t,hashError:e,children:s})=>{const[r]=f.useState(()=>{if(typeof window>"u")return!1;const C=localStorage.getItem(Qt),I=localStorage.getItem(Zt);return!!(C||I)}),[i]=f.useState(()=>{if(typeof window>"u")return 2;const C=localStorage.getItem(co);if(C)try{const I=JSON.parse(C);if(I&&typeof I.version=="number")return I.version}catch(I){console.warn("Failed to parse loaded version:",I)}return 1}),[a]=f.useState(()=>Ri()),[l,p]=f.useState(()=>a.configs),[m,c]=f.useState(()=>a.activeConfigId),[h,b]=f.useState(!1),[g,x]=f.useState(null),[k,u]=f.useState(()=>{if(a.activeConfigId){const C=a.configs.find(I=>I.id===a.activeConfigId);return C?C.config:""}return""}),y=f.useRef(l),j=f.useRef(m),E=f.useRef(h),L=f.useRef(g),S=f.useRef(k);f.useEffect(()=>{y.current=l},[l]),f.useEffect(()=>{j.current=m},[m]),f.useEffect(()=>{E.current=h},[h]),f.useEffect(()=>{L.current=g},[g]),f.useEffect(()=>{S.current=k},[k]);const $=f.useRef(k);f.useEffect(()=>{$.current=k},[k]);const D=f.useCallback(C=>{$.current=C},[]),z=f.useCallback(()=>$.current,[]),v=f.useRef(void 0),w=f.useRef(null),P=f.useRef(null),A=f.useCallback(()=>{P.current&&(clearTimeout(P.current.timeoutId),P.current=null)},[]),R=f.useCallback(()=>{const C=P.current;C&&(A(),M(C.name,C.payload))},[A]),F=f.useCallback(()=>{if(R(),w.current){const{timeoutId:C,payload:I,configId:W}=w.current;clearTimeout(C),M("keyboard_generated",I),v.current=W,w.current=null}},[R]),U=f.useCallback(()=>{v.current=void 0,R(),w.current&&(clearTimeout(w.current.timeoutId),w.current=null)},[R]),[B,Z]=Ko("ergogen:injection",t),[Y,ee]=f.useState(null),[X,H]=f.useState(null),[O,V]=f.useState(null),[_,N]=f.useState(null),[T,J]=f.useState(null),[G,re]=f.useState(0),[te,We]=Ko("ergogen:settings",en()),fe=(te==null?void 0:te.debug)??!1,me=(te==null?void 0:te.autoGen)??!0,ue=(te==null?void 0:te.autoGen3D)??!0,Pe=(te==null?void 0:te.kicanvasPreview)??!0,he=(te==null?void 0:te.stlPreview)??!0,[je,gr]=f.useState(_t),St=f.useRef(te);St.current=te;const lo=f.useRef(me);lo.current=me;const Et=f.useRef(je);Et.current=je;const be=f.useCallback(C=>{const I=St.current||en(),W=C(I);St.current=W,We(W)},[We]),uo=f.useCallback(C=>{be(I=>{const W=typeof C=="function"?C(I.debug):C;return{...I,debug:W}})},[be]),po=f.useCallback(C=>{be(I=>{const W=typeof C=="function"?C(I.autoGen):C;return{...I,autoGen:W}})},[be]),fo=f.useCallback(C=>{be(I=>{const W=typeof C=="function"?C(I.autoGen3D):C;return{...I,autoGen3D:W}})},[be]),ho=f.useCallback(C=>{be(I=>{const W=typeof C=="function"?C(I.kicanvasPreview):C;return{...I,kicanvasPreview:W}})},[be]),go=f.useCallback(C=>{be(I=>{const W=typeof C=="function"?C(I.stlPreview):C;return{...I,stlPreview:W}})},[be]),Oe=f.useCallback((C,I,W)=>{if(A(),W||!lo.current){M(C,I);return}const q=setTimeout(()=>{P.current=null,M(C,I)},Qo);P.current={name:C,payload:I,timeoutId:q}},[A]),mo=f.useCallback(C=>{const I=typeof C=="function"?C(Et.current):C;Et.current=I,Ur(I),gr(I),be(W=>({...W,sendUsageMetrics:I}))},[be]);f.useEffect(()=>{Kn()},[je]);const[$e,bo]=f.useState(!1),[xo,mr]=f.useState(!1),[wo,yo]=f.useState(!1),[ko,_o]=f.useState(!0),[vo,jo]=f.useState(!0),[$o,xe]=f.useState(!1),[Co,et]=f.useState(!1),ie=f.useRef(null),we=f.useRef(null),tt=f.useRef(0),[So,ot]=f.useState(!1),Eo=f.useRef(!0),Pt=f.useRef(null);f.useEffect(()=>{tn()},[]),f.useEffect(()=>{e&&ee(e)},[e]);const Po=f.useCallback(()=>ee(null),[]),Io=f.useCallback(()=>H(null),[]),Lo=f.useCallback(()=>V(null),[]),zo=f.useCallback(()=>N(null),[]),nt=f.useCallback(C=>{var q,oe,K,ne,ce,ke;const I=C.data;if(I.requestId&&I.requestId.startsWith("background-preview-")){const Q=I.requestId.substring(19);if(I.type==="success"&&I.results){const _e=I.results,Le=((oe=(q=_e.outlines)==null?void 0:q.preview)==null?void 0:oe.svg)||((K=_e.demo)==null?void 0:K.svg),Fe=on(Le);Fe&&p(Be=>{const Me=Be.map(se=>se.id===Q?{...se,previewSvg:Fe}:se);return le(Me,j.current,2),Me})}else I.type==="error"&&console.warn(`Background generation failed for config ${Q}:`,I.error);return}const W=!!(I.requestId&&I.requestId.startsWith("ergogen-manual-"));if(I.type==="error"){console.error("--- Ergogen worker error:",I.error),ee(I.error),xe(!1),ot(!1),Oe("generation_failed",{error_message:I.error||"Unknown worker error",stored_configs_count:y.current.length,trigger:W?"manual":"auto"},W);return}if(I.type==="success")if(I.warnings&&I.warnings.length>0&&H(Q=>(Q?Q+`
`:"")+I.warnings.join(`
`)),I.results){const Q=I.results,_e=Pt.current?performance.now()-Pt.current:0;Oe("generation_completed",{duration_ms:Math.round(_e),points_count:Q.points?Object.keys(Q.points).length:0,pcbs_count:Q.pcbs?Object.keys(Q.pcbs).length:0,cases_count:Q.cases?Object.keys(Q.cases).length:0,has_outlines:!!Q.outlines,stored_configs_count:y.current.length,trigger:W?"manual":"auto"},W);try{const se=pe.dump(Q.canonical||{}),Ce=pe.dump(Q.points||{}),ve=Kr(se,Ce,Math.round(_e),v.current);if(ve.config_id!==v.current){w.current&&clearTimeout(w.current.timeoutId);const _r=setTimeout(()=>{M("keyboard_generated",ve),v.current=ve.config_id,w.current=null},Qo);w.current={timeoutId:_r,payload:ve,configId:ve.config_id}}}catch(se){console.error("Failed to generate keyboard configuration analytics:",se)}const Le=((ce=(ne=Q.outlines)==null?void 0:ne.preview)==null?void 0:ce.svg)||((ke=Q.demo)==null?void 0:ke.svg),Fe=on(Le),Be=j.current;Fe&&Be&&p(se=>{const Ce=se.map(ve=>ve.id===Be?{...ve,previewSvg:Fe}:ve);return le(Ce,Be,2),Ce});let Me=!1;if(he&&Q.cases&&Object.keys(Q.cases).length>0){for(const se of Object.keys(Q.cases)){const Ce=Q.cases[se];Ce!=null&&Ce.jscad&&(Q.cases[se].stl=void 0)}if(we.current){Me=!0,ot(!0);const se={type:"batch_jscad_to_stl",results:Q,configVersion:tt.current};we.current.postMessage(se)}}J(Q),re(se=>se+1),Me||xe(!1)}else xe(!1);else xe(!1)},[he,Oe]),Do=f.useCallback(C=>{const I=C.data;I.configVersion===tt.current&&(I.type==="error"?(console.error("--- JSCAD worker error:",I.error),ot(!1),xe(!1)):I.type==="success"&&I.results&&(J(I.results),re(W=>W+1),ot(!1),xe(!1)))},[]);f.useEffect(()=>(ie.current||(ie.current=qe(),ie.current?(ie.current.onmessage=nt,ie.current.onerror=C=>{console.error("Ergogen worker error:",C),Ve(C.message||"Worker crash",!1,"ergogen_worker")},et(!0)):console.warn("Failed to initialize Ergogen worker.")),we.current||(we.current=so(),we.current?(we.current.onmessage=Do,we.current.onerror=C=>{console.error("JSCAD worker error:",C),Ve(C.message||"Worker crash",!1,"jscad_worker")}):console.warn("Failed to initialize JSCAD worker.")),()=>{ie.current&&(ie.current.terminate(),ie.current=null,et(!1)),we.current&&(we.current.terminate(),we.current=null)}),[nt,Do]),f.useEffect(()=>{const C=()=>{document.visibilityState==="hidden"&&F()};return window.addEventListener("visibilitychange",C),window.addEventListener("pagehide",F),()=>{window.removeEventListener("visibilitychange",C),window.removeEventListener("pagehide",F),F()}},[F]);const It=f.useRef({debug:fe,autoGen:me,autoGen3D:ue,kicanvasPreview:Pe,stlPreview:he,sendUsageMetrics:je});f.useEffect(()=>{const C={debug:fe,autoGen:me,autoGen3D:ue,kicanvasPreview:Pe,stlPreview:he,sendUsageMetrics:je},{sendUsageMetrics:I,...W}=C;if(Eo.current)Eo.current=!1,It.current=C,M("settings_loaded",{...W});else{const q=It.current,oe=Object.keys(C).find(K=>C[K]!==q[K]);It.current=C,M("setting_changed",{...oe?{setting_name:oe,setting_value:C[oe]}:{},...W})}},[fe,me,ue,Pe,he,je]);const Ao=f.useCallback(C=>{let I="UNKNOWN",W=null;try{W=JSON.parse(C),I="json"}catch{}try{W=pe.load(C),I="yaml"}catch{}return[I,W]},[]),rt=f.useCallback(async(C,I,W={pointsonly:!0})=>{const q=C===void 0||C===S.current?$.current??S.current:C;if(!q)return;const oe=Pi(I),[,K]=Ao(q);ee(null),H(null),V(null),xe(!0),Pt.current=performance.now(),tt.current+=1;const ne=Li(K);ne&&H(ne);const ce=Ii(I);ce&&V(ce);const ke=zi(K,W.pointsonly)||q,Q=W.isManual?"ergogen-manual":"ergogen-generate";try{ie.current?ie.current.postMessage({type:"generate",inputConfig:ke,injectionInput:oe,requestId:`${Q}-${tt.current}-${Date.now()}`,options:{debug:fe,svg:!0}}):console.error("Worker not available for processing request.")}catch(_e){xe(!1);const Le=typeof _e=="string"?_e:String(_e);ee(Le),Oe("generation_failed",{error_message:Le,stored_configs_count:y.current.length,trigger:W.isManual?"manual":"auto"},!!W.isManual);return}},[Ao,ee,H,V,xe,fe,Oe]),Ie=f.useMemo(()=>Rn(rt,300),[rt]),Se=f.useCallback(async(C,I,W={pointsonly:!0})=>{Ie.cancel(),await rt(C,I,W)},[Ie,rt]),it=f.useCallback(C=>{const I=S.current,W=typeof C=="function"?C(I):C;if(W!==I)if(u(W),E.current){if(W!==L.current){const oe=`Shared Config ${st(y.current,/^Shared\s+Config\s+(\d+)$/)}`,K=Ae(),ne=new Date().toISOString(),ce={id:K,name:oe,config:W||"",createdAt:ne,updatedAt:ne},ke=[...y.current,ce];p(ke),c(K),b(!1),x(null),le(ke,K)}}else{const q=j.current;if(q){const oe=y.current.map(K=>K.id===q?{...K,config:W||"",updatedAt:new Date().toISOString()}:K);p(oe),le(oe,q)}else{const K=`Untitled ${st(y.current,/^Untitled\s+(\d+)$/)}`,ne=Ae(),ce=new Date().toISOString(),ke={id:ne,name:K,config:W||"",createdAt:ce,updatedAt:ce},Q=[...y.current,ke];p(Q),c(ne),le(Q,ne)}}},[]),Ro=f.useCallback(C=>{if(U(),J(null),C===null)c(null),j.current=null,b(!1),x(null),u(""),S.current="",le(y.current,null);else{const I=y.current.find(W=>W.id===C);I&&(c(C),j.current=C,b(!1),x(null),u(I.config),S.current=I.config,le(y.current,C),M("config_selected",{stored_configs_count:y.current.length}))}},[U]),No=f.useCallback((C,I)=>{U(),J(null);const W=st(y.current,/^Untitled\s+(\d+)$/),q=I||`Untitled ${W}`,oe=Ae(),K=new Date().toISOString(),ne={id:oe,name:q,config:C,createdAt:K,updatedAt:K},ce=[...y.current,ne];return p(ce),c(oe),b(!1),x(null),u(C),M("config_created",{stored_configs_count:ce.length}),y.current=ce,j.current=oe,S.current=C,le(ce,oe),oe},[U]),Uo=f.useCallback((C,I)=>{const W=I.trim();if(!W)return ee("Configuration name cannot be empty"),!1;const q=y.current.find(ne=>ne.id===C);if(!q)return!1;if(q.name===W)return!0;if(y.current.some(ne=>ne.id!==C&&ne.name.trim().toLowerCase()===W.toLowerCase()))return ee(`A configuration named "${W}" already exists.`),!1;const K=y.current.map(ne=>ne.id===C?{...ne,name:W,updatedAt:new Date().toISOString()}:ne);return p(K),y.current=K,le(K,j.current),M("config_renamed",{stored_configs_count:K.length}),!0},[ee]),Wo=f.useCallback(C=>{U(),J(null);const I=y.current.find(W=>W.id===C);if(I){const W=Ae(),q=new Date().toISOString(),oe={id:W,name:`${I.name} (Copy)`,config:I.config,createdAt:q,updatedAt:q},K=[...y.current,oe];p(K),c(W),b(!1),x(null),u(I.config),y.current=K,j.current=W,S.current=I.config,le(K,W),M("config_duplicated",{stored_configs_count:K.length})}},[U]),Oo=f.useCallback(C=>{U();const I=j.current,W=y.current.find(ne=>ne.id===C),q=y.current.filter(ne=>ne.id!==C);p(q),y.current=q;const oe=I===C;y.current.length<=1||oe?(J(null),c(null),j.current=null,u(""),S.current="",le(q,null)):le(q,I),W&&Di(W),M("config_deleted",{stored_configs_count:q.length})},[U]),Fo=f.useCallback(C=>{U(),J(null),b(!0),x(C),u(C)},[U]),Bo=f.useCallback(()=>{if(!E.current)return;const I=`Shared Config ${st(y.current,/^Shared\s+Config\s+(\d+)$/)}`,W=Ae(),q=new Date().toISOString(),oe={id:W,name:I,config:S.current||"",createdAt:q,updatedAt:q},K=[...y.current,oe];p(K),y.current=K,c(W),j.current=W,b(!1),x(null),le(K,W)},[]),Mo=f.useCallback(()=>{tn()},[]),To=f.useCallback(async()=>{await Ci(y.current,B,fe,he)},[B,fe,he]),Go=f.useCallback(async()=>{await Si(y.current,B)},[B]),Ho=f.useMemo(()=>{if(h)return"Shared Config";if(m){const C=l.find(I=>I.id===m);return C?C.name:""}return""},[h,m,l]),br=f.useMemo(()=>({setInjectionInput:Z,setConfigInput:it,generateNow:Se,getCurrentInjections:()=>B||[],setError:ee}),[B,Se,Z,it,ee]),{currentConflict:Lt,processInjectionsWithConflictResolution:xr,handleConflictResolution:wr,handleConflictCancel:yr}=$t(br),{isLoading:Vo}=vi({processInjectionsWithConflictResolution:xr,setError:ee});f.useEffect(()=>{if(e||Vo)return;!new URLSearchParams(window.location.search).get("github")&&k&&Se(k,B,{pointsonly:!1})},[Vo]);const Jo=f.useRef($e);f.useEffect(()=>{Jo.current&&!$e&&(console.log("Settings panel closed. Restarting Ergogen worker to clear stale custom libraries..."),ie.current&&(ie.current.terminate(),ie.current=null,et(!1),console.log("Ergogen worker terminated.")),console.log("Initializing fresh Ergogen worker..."),ie.current=qe(),ie.current?(ie.current.onmessage=nt,ie.current.onerror=C=>{console.error("Ergogen worker error:",C),Ve(C.message||"Worker crash",!1,"ergogen_worker")},et(!0),console.log("Ergogen worker initialized.")):console.warn("Failed to initialize Ergogen worker."),k&&Se(k,B,{pointsonly:!ue})),Jo.current=$e},[$e,k,B,ue,Se,nt]),f.useEffect(()=>{localStorage.setItem("ergogen:injection",JSON.stringify(B)),me&&!$e&&Ie(k,B,{pointsonly:!ue})},[k,B,me,ue,$e,Ie]),f.useEffect(()=>{Co&&(i===1||r)&&(console.log("Version 1 or legacy configuration detected on load. Triggering background preview generation for all configs missing a preview SVG..."),le(y.current,j.current,2),y.current.forEach(C=>{var I;C.previewSvg||(console.log(`Triggering background preview generation for: ${C.name}`),(I=ie.current)==null||I.postMessage({type:"generate",inputConfig:C.config,requestId:`background-preview-${C.id}`,options:{debug:!0,svg:!0}}))}))},[Co,i,r]);const kr=f.useMemo(()=>({configInput:k,getRealtimeConfigInput:z,updateRealtimeConfigInput:D,setConfigInput:it,configs:l,activeConfigId:m,activeConfigName:Ho,isPreview:h,selectConfig:Ro,createNewConfig:No,renameConfig:Uo,duplicateConfig:Wo,deleteConfig:Oo,exportAllConfigs:To,downloadAllConfigs:Go,loadPreview:Fo,savePreviewConfig:Bo,pruneDeletedConfigs:Mo,injectionInput:B,setInjectionInput:Z,processInput:Ie,generateNow:Se,error:Y,setError:ee,clearError:Po,deprecationWarning:X,clearWarning:Io,skippedWarning:O,clearSkippedWarning:Lo,info:_,setInfo:N,clearInfo:zo,results:T,resultsVersion:G,setResultsVersion:re,showSettings:$e,setShowSettings:bo,isBulkDownloadOpen:xo,setIsBulkDownloadOpen:mr,showSideNav:wo,setShowSideNav:yo,showConfig:ko,setShowConfig:_o,showDownloads:vo,setShowDownloads:jo,debug:fe,setDebug:uo,autoGen:me,setAutoGen:po,autoGen3D:ue,setAutoGen3D:fo,kicanvasPreview:Pe,setKicanvasPreview:ho,stlPreview:he,setStlPreview:go,sendUsageMetrics:je,setSendUsageMetrics:mo,isGenerating:$o,setIsGenerating:xe,isJscadConverting:So}),[k,z,D,it,l,m,Ho,h,Ro,No,Uo,Wo,Oo,To,Go,xo,Fo,Bo,Mo,B,Z,Ie,Se,Y,ee,Po,X,Io,O,Lo,_,N,zo,T,G,re,$e,bo,wo,yo,ko,_o,vo,jo,fe,uo,me,po,ue,fo,Pe,ho,he,go,je,mo,$o,xe,So]);return o.jsxs(nr.Provider,{value:kr,children:[s,Lt&&o.jsx(jt,{injectionName:Lt.name,injectionType:Lt.type,onResolve:wr,onCancel:yr,"data-testid":"conflict-resolution-dialog"})]})},ye=()=>f.useContext(nr),Ui=({className:t,options:e,"data-testid":s,"aria-label":r})=>{const i=ye(),a=f.useRef(null),l={configInput:void 0,setConfigInput:y=>{},updateRealtimeConfigInput:y=>{},injectionInput:void 0,generateNow:async()=>{},activeConfigId:null},{configInput:p,updateRealtimeConfigInput:m,setConfigInput:c,injectionInput:h,generateNow:b,activeConfigId:g}=i??l,x=f.useRef(Rn(y=>{c(y)},500)).current;f.useEffect(()=>()=>{x.cancel()},[x]),f.useEffect(()=>{if(a.current){if(a.current.hasTextFocus())return;const y=a.current.getValue();p!==void 0&&p!==y&&a.current.setValue(p)}},[p]);const k=f.useCallback(y=>{y!==void 0&&(m(y),x(y))},[x,m]),u=(y,j)=>{a.current=y,y.onDidBlurEditorText(()=>{x.flush()}),y.addAction({id:"generate-config",label:"Generate",keybindings:[j.KeyMod.CtrlCmd|j.KeyCode.Enter],run:()=>{const E=y.getValue();x.cancel(),m(E),c(E),b(E,h,{pointsonly:!1,isManual:!0})}})};return i?o.jsx("div",{className:t,"data-testid":s,"aria-label":r,children:o.jsx(Nn,{height:"100%",defaultLanguage:"yaml",language:"yaml",onChange:k,onMount:u,defaultValue:p,theme:"ergogen-theme",options:e||void 0},g||"preview")}):null},Wi=({className:t,options:e,injection:s,setInjection:r,"data-testid":i,"aria-label":a})=>{const l=ye(),p=async m=>{if(!m)return null;const c={...s,content:m};r(c)};return l?o.jsx(Oi,{className:t,"data-testid":i,"aria-label":a,children:o.jsx(Nn,{height:"100%",defaultLanguage:"javascript",language:"javascript",onChange:p,value:s.content,theme:"ergogen-theme",options:e||void 0})}):null},Oi=d.div`
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
`,Vi=({fileName:t,extension:e,content:s,preview:r,setPreview:i,previewKey:a,"data-testid":l})=>{const p=e==="stl"&&!s||e==="kicad_pcb"&&!r,m=e==="stl"&&!s,c=()=>{if(m)return;M("download_button_clicked",{download_type:e,source:"downloads_panel"});const g=document.createElement("a"),x=new Blob([s],{type:"octet/stream"});g.href=URL.createObjectURL(x),g.download=`${t}.${e}`,document.body.appendChild(g),g.click()},h=()=>{r&&!p&&i(r)},b=l?`${l}-${e}`:void 0;return o.jsxs(Bi,{"data-testid":b,children:[o.jsxs(Mi,{$active:a===(r==null?void 0:r.key),$hasPreview:!!r,$disabled:p,onClick:h,"data-testid":b&&`${b}-preview`,children:[t,".",e]}),o.jsx(Ti,{children:m?o.jsx(Hi,{"aria-label":`Generating ${t}.${e}`,"data-testid":b&&`${b}-loading`,children:o.jsx("span",{className:"material-symbols-outlined",children:"progress_activity"})}):o.jsx(Gi,{onClick:c,"aria-label":`Download ${t}.${e}`,"data-testid":b&&`${b}-download`,children:o.jsx("span",{className:"material-symbols-outlined",children:"download"})})})]})},Ji=d.h3`
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
`,Yi=({setPreview:t,previewKey:e,"data-testid":s})=>{var m,c;const r=[],i=ye();if(!i)return null;const{configInput:a,results:l}=i;if(l!=null&&l.demo&&r.push({fileName:"raw",extension:"txt",content:a??"",previewKey:"raw",preview:{key:"raw",extension:"txt",content:a??""}},{fileName:"canonical",extension:"yaml",content:pe.dump(l.canonical),previewKey:"canonical",preview:{key:"canonical",extension:"yaml",content:pe.dump(l.canonical)}},{fileName:"demo",extension:"dxf",content:((m=l.demo)==null?void 0:m.dxf)??"",previewKey:"demo.svg",preview:{key:"demo.svg",extension:"svg",content:((c=l.demo)==null?void 0:c.svg)??""}},{fileName:"points",extension:"yaml",content:pe.dump(l.points),previewKey:"points",preview:{key:"points",extension:"yaml",content:pe.dump(l.points)}},{fileName:"units",extension:"yaml",content:pe.dump(l.units),previewKey:"units",preview:{key:"units",extension:"yaml",content:pe.dump(l.units)}}),l!=null&&l.outlines)for(const[h,b]of Object.entries(l.outlines))r.push({fileName:h,extension:"dxf",content:b.dxf??"",previewKey:`outlines.${h}.svg`,preview:{key:`outlines.${h}.svg`,extension:"svg",content:b.svg??""}});if(l!=null&&l.cases){for(const[h,b]of Object.entries(l.cases))if(r.push({fileName:h,extension:"jscad",content:b.jscad??"",previewKey:`cases.${h}`,preview:{key:`cases.${h}`,extension:"jscad",content:b.jscad??""}}),i.stlPreview&&b.jscad){const g=!!b.stl;r.push({fileName:h,extension:"stl",content:b.stl??"",previewKey:g?`cases.${h}.stl`:"",preview:g?{key:`cases.${h}.stl`,extension:"stl",content:b.stl??""}:void 0})}}if(l!=null&&l.pcbs)for(const[h,b]of Object.entries(l.pcbs)){const x=String(b).match(/version "?([0-9]+)"?/),k=x&&x.length>1?Number(x[1]):-1;r.push({fileName:h,extension:"kicad_pcb",content:b,previewKey:i.kicanvasPreview&&k>20240101?`pcbs.${h}`:"",preview:i.kicanvasPreview&&k>20240101?{key:`pcbs.${h}`,extension:"kicad_pcb",content:b}:void 0})}const p=r.filter(h=>!(!i.debug&&(h.fileName.startsWith("_")||{units:"yaml",points:"yaml",canonical:"yaml",raw:"txt"}[h.fileName]===h.extension||i.stlPreview&&h.extension==="jscad")));return o.jsxs(Ki,{"data-testid":s,children:[o.jsx(Ji,{children:"Outputs"}),p.length>0?p.map((h,b)=>o.jsx(Vi,{...h,setPreview:t,previewKey:e,"data-testid":s&&`${s}-${h.fileName}`},b)):o.jsx(qi,{children:"No outputs"})]})},Xi=d.div`
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
`,rn=t=>{const r=new DOMParser().parseFromString(t,"image/svg+xml").querySelectorAll("path"),i=[];return r.forEach(a=>{const l=a.getAttribute("d");if(l&&l.trim()){const p=l.replace(/\\/g,"\\\\").replace(/"/g,'\\"');i.push(`        "${p}"`)}}),`const u = require('../utils');

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
`,Wt=d.button`
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
`,ns=({setInjectionToEdit:t,deleteInjection:e,injectionToEdit:s,onInjectionSelect:r,"data-testid":i})=>{const a=[],l=[],p=[],m=f.useRef(null),c=f.useRef(null),h=ye(),[b,g]=f.useState("footprint"),[x,k]=f.useState("footprints"),{currentConflict:u,processInjectionsWithConflictResolution:y,handleConflictResolution:j,handleConflictCancel:E}=$t({setInjectionInput:w=>h==null?void 0:h.setInjectionInput(w),setConfigInput:w=>h==null?void 0:h.setConfigInput(w),generateNow:async(w,P,A)=>{await(h==null?void 0:h.generateNow(w,P,A))},getCurrentInjections:()=>(h==null?void 0:h.injectionInput)||[],setError:w=>h==null?void 0:h.setError(w)});if(!h)return null;const{injectionInput:L}=h;if(L&&Array.isArray(L)&&L.length>0)for(let w=0;w<L.length;w++){const P=L[w];if(P.length===3){let A=p;P[0]==="footprint"?A=a:P[0]==="outline"?A=l:P[0]==="template"&&(A=p),A.push({key:w,type:P[0],name:P[1],content:P[2]})}}const S=()=>{var A;const w=((A=h==null?void 0:h.injectionInput)==null?void 0:A.length)||0,P={key:w,type:"footprint",name:`custom_footprint_${w+1}`,content:`module.exports = {
  params: {
    designator: '',
  },
  body: p => \`\`
}`};M("injection_created",{injection_type:"footprint"}),t(P),r&&r()},$=()=>{var A;const w=((A=h==null?void 0:h.injectionInput)==null?void 0:A.length)||0,P={key:w,type:"outline",name:`custom_outline_${w+1}`,content:`const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
        ""  // Add your SVG path(s) here
    ];
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
};`};M("injection_created",{injection_type:"outline"}),t(P),r&&r()},D=()=>{var A;const w=((A=h==null?void 0:h.injectionInput)==null?void 0:A.length)||0,P={key:w,type:"template",name:`custom_template_${w+1}`,content:`const m = require('makerjs')
const version = require('../../package.json').version

module.exports = {
    convert_outline: (model, layer) => {
        return \`\`;  // Return your converted outlines
    },
    body: params => {
        return \`\`;  // Add your template text here
    }
}`};M("injection_created",{injection_type:"template"}),t(P),r&&r()},z=async w=>{const P=w.target.files;if(!P||P.length===0)return;const A=[];for(let R=0;R<P.length;R++){const F=P[R];if(F.name.endsWith(".js")){const U=await F.text(),B=F.name.replace(/\.js$/,"");A.push([b,B,U])}else if(b==="outline"&&F.name.endsWith(".svg")){const U=await F.text(),B=rn(U),Z=F.name.replace(/\.svg$/,"");A.push([b,Z,B])}}A.length>0&&(M("injection_uploaded",{injection_type:b,source:"file",file_count:A.length}),await y(A,h.configInput||"")),w.target.value=""},v=async w=>{const P=w.target.files;if(!P||P.length===0)return;const A=[];for(let R=0;R<P.length;R++){const F=P[R];if(F.name.endsWith(".js")){const U=await F.text(),B=F.webkitRelativePath.split("/");B.shift();const Z=B.join("/").replace(/\.js$/,"");A.push([b,Z,U])}else if(b==="outline"&&F.name.endsWith(".svg")){const U=await F.text(),B=F.webkitRelativePath.split("/");B.shift();const Z=B.join("/").replace(/\.svg$/,""),Y=rn(U);A.push([b,Z,Y])}}A.length>0&&(M("injection_uploaded",{injection_type:b,source:"folder",file_count:A.length}),await y(A,h.configInput||"")),w.target.value=""};return o.jsxs(ts,{"data-testid":i,children:[u&&o.jsx(jt,{injectionName:u.name,injectionType:u.type,onResolve:j,onCancel:E,"data-testid":"conflict-resolution-dialog"}),o.jsx(gt,{children:"Custom Libraries"}),o.jsxs(os,{children:[o.jsx(Wt,{$active:x==="footprints",onClick:()=>{k("footprints"),g("footprint")},"data-testid":"tab-footprints",children:"Footprints"}),ae("outlines")&&o.jsx(Wt,{$active:x==="outlines",onClick:()=>{k("outlines"),g("outline")},"data-testid":"tab-outlines",children:"Outlines"}),ae("templates")&&o.jsx(Wt,{$active:x==="templates",onClick:()=>{k("templates"),g("template")},"data-testid":"tab-templates",children:"Templates"})]}),x==="footprints"&&o.jsxs(o.Fragment,{children:[a.map(w=>o.jsx(Nt,{injection:w,setInjectionToEdit:P=>{M("injection_editor_opened",{injection_type:P.type}),t(P),r&&r()},deleteInjection:e,previewKey:s.name,"data-testid":i&&`${i}-${w.name}`},w.key)),o.jsxs(Ut,{children:[o.jsx(Je,{onClick:S,"data-testid":"add-footprint","aria-label":"Add new custom footprint",title:"Add footprint",children:o.jsx("span",{className:"material-symbols-outlined",children:"add"})}),o.jsx(ze,{onClick:()=>{g("footprint"),setTimeout(()=>{var w;return(w=m.current)==null?void 0:w.click()},0)},"data-testid":"load-footprint-files","aria-label":"Load custom footprint files",title:"Load footprint files",children:o.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),o.jsx(ze,{onClick:()=>{g("footprint"),setTimeout(()=>{var w;return(w=c.current)==null?void 0:w.click()},0)},"data-testid":"load-footprint-folder","aria-label":"Load custom footprint folder",title:"Load footprint folder",children:o.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),x==="outlines"&&ae("outlines")&&o.jsxs(o.Fragment,{children:[l.map(w=>o.jsx(Nt,{injection:w,setInjectionToEdit:P=>{M("injection_editor_opened",{injection_type:P.type}),t(P),r&&r()},deleteInjection:e,previewKey:s.name,"data-testid":i&&`${i}-${w.name}`},w.key)),o.jsxs(Ut,{children:[o.jsx(Je,{onClick:$,"data-testid":"add-outline","aria-label":"Add new custom outline",title:"Add outline",children:o.jsx("span",{className:"material-symbols-outlined",children:"add"})}),o.jsx(ze,{onClick:()=>{g("outline"),setTimeout(()=>{var w;return(w=m.current)==null?void 0:w.click()},0)},"data-testid":"load-outline-files","aria-label":"Load custom outline files",title:"Load outline files",children:o.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),o.jsx(ze,{onClick:()=>{g("outline"),setTimeout(()=>{var w;return(w=c.current)==null?void 0:w.click()},0)},"data-testid":"load-outline-folder","aria-label":"Load custom outline folder",title:"Load outline folder",children:o.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),x==="templates"&&ae("templates")&&o.jsxs(o.Fragment,{children:[p.map(w=>o.jsx(Nt,{injection:w,setInjectionToEdit:P=>{M("injection_editor_opened",{injection_type:P.type}),t(P),r&&r()},deleteInjection:e,previewKey:s.name,"data-testid":i&&`${i}-${w.name}`},w.key)),o.jsxs(Ut,{children:[o.jsx(Je,{onClick:D,"data-testid":"add-template","aria-label":"Add new custom template",title:"Add template",children:o.jsx("span",{className:"material-symbols-outlined",children:"add"})}),o.jsx(ze,{onClick:()=>{g("template"),setTimeout(()=>{var w;return(w=m.current)==null?void 0:w.click()},0)},"data-testid":"load-template-files","aria-label":"Load custom template files",title:"Load template files",children:o.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),o.jsx(ze,{onClick:()=>{g("template"),setTimeout(()=>{var w;return(w=c.current)==null?void 0:w.click()},0)},"data-testid":"load-template-folder","aria-label":"Load custom template folder",title:"Load template folder",children:o.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),o.jsx("input",{type:"file",ref:m,onChange:z,accept:b==="outline"?".js,.svg":".js",multiple:!0,style:{display:"none"}}),o.jsx("input",{type:"file",ref:c,onChange:v,accept:b==="outline"?".js,.svg":".js",style:{display:"none"},webkitdirectory:"",directory:""})]})},rs=d.img`
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
`,ss=({svg:t,width:e,height:s,"aria-label":r,"data-testid":i})=>o.jsx(is,{enableBoundingBox:!0,minZoom:.8,maxZoom:5,"aria-label":r,"data-testid":i,children:o.jsx(rs,{width:e||"100%",height:s||"100%",src:`data:image/svg+xml;utf8,${encodeURIComponent(t)}`,alt:"Ergogen SVG Output preview",draggable:"false"})}),Ot=({content:t,language:e,className:s,height:r,options:i,"aria-label":a,"data-testid":l})=>o.jsx("div",{className:s,"aria-label":a,"data-testid":l,children:o.jsx(jr,{height:r||"80vh",language:e,value:t,theme:"ergogen-theme",options:i||{readOnly:!0}})}),as=f.lazy(()=>Tn(()=>import("./PcbPreview-DsKQssW6.js"),__vite__mapDeps([0,1]))),cs=f.lazy(()=>Tn(()=>import("./StlPreview-DCDsWrqa.js"),__vite__mapDeps([2,1,3,4,5]))),ir=d.div`
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
`,ls=d.span`
  color: ${n.colors.textDarkest};
  font-size: ${n.fontSizes.sm};
  margin-top: 1rem;
  font-family: ${n.fonts.body};
  user-select: none;
`,sn=()=>o.jsxs(ir,{children:[o.jsx(sr,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"}),o.jsx(ls,{children:"Loading preview..."})]}),ds=({previewExtension:t,previewContent:e,previewKey:s,width:r="100%",height:i="100%",className:a,"data-testid":l,"aria-label":p})=>{if(!e||typeof e=="string"&&e===""||e instanceof ArrayBuffer&&e.byteLength===0||ArrayBuffer.isView(e)&&e.byteLength===0)return o.jsx(ir,{className:a,"data-testid":l,"aria-label":p,children:o.jsx(sr,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"})});const c=h=>{switch(h){case"svg":return o.jsx(ss,{svg:e,width:r,height:i,"aria-label":p||`SVG preview for ${s}`,"data-testid":l&&`${l}-svg`});case"yaml":return o.jsx(Ot,{language:"yaml",content:e,"aria-label":p||`YAML preview for ${s}`,"data-testid":l&&`${l}-yaml`});case"txt":return o.jsx(Ot,{language:"text",content:e,"aria-label":p||`Text preview for ${s}`,"data-testid":l&&`${l}-txt`});case"jscad":return o.jsx(Ot,{language:"javascript",content:e,"aria-label":p||`JSCAD code preview for ${s}`,"data-testid":l&&`${l}-jscad-text`});case"kicad_pcb":return o.jsx(f.Suspense,{fallback:o.jsx(sn,{}),children:o.jsx(as,{pcb:e,previewKey:s,"aria-label":p||`PCB preview for ${s}`,"data-testid":l&&`${l}-pcb`},s)});case"stl":return o.jsx(f.Suspense,{fallback:o.jsx(sn,{}),children:o.jsx(cs,{stl:e,"aria-label":p||`STL preview for ${s}`,"data-testid":l&&`${l}-stl`})});default:return"No preview available"}};return o.jsx("div",{className:a,"data-testid":l,"aria-label":p,children:c(t)})},Ft=({children:t,initialWidth:e=300,minWidth:s=10,maxWidth:r="100%",side:i="left",style:a,"data-testid":l})=>{const[p,m]=f.useState(e),c=f.useRef(!1),h=f.useRef(0),b=f.useRef(e),g=f.useRef(null),x=u=>{if(typeof u=="string"&&u.includes("%")){const y=parseFloat(u)/100;return window.innerWidth*y}else return typeof u=="string"&&u.includes("px")?parseFloat(u):typeof u=="number"?u:1/0};f.useEffect(()=>{const u=L=>{if(!c.current)return;const S=i==="left"?L.clientX-h.current:h.current-L.clientX,$=b.current+S,D=x(r),z=Math.max(s,Math.min($,D));m(z)},y=()=>{c.current&&(c.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},j=L=>{if(!c.current)return;L.preventDefault();const S=L.touches[0],$=i==="left"?S.clientX-h.current:h.current-S.clientX,D=b.current+$,z=x(r),v=Math.max(s,Math.min(D,z));m(v)},E=()=>{c.current&&(c.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",u),window.addEventListener("mouseup",y),window.addEventListener("touchmove",j,{passive:!1}),window.addEventListener("touchend",E),()=>{window.removeEventListener("mousemove",u),window.removeEventListener("mouseup",y),window.removeEventListener("touchmove",j),window.removeEventListener("touchend",E)}},[s,r,i]);const k=u=>{u.preventDefault(),u.stopPropagation(),c.current=!0,b.current=p,"touches"in u?h.current=u.touches[0].clientX:h.current=u.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};return o.jsxs(us,{ref:g,$side:i,style:{width:`${p}px`,...a},"data-testid":l,children:[t,o.jsx(ps,{$side:i,onMouseDown:k,onTouchStart:k,"data-testid":l&&`${l}-resize-handle`})]})},us=d.div`
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
  cursor: pointer;
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
  cursor: pointer;
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
`,De=({optionId:t,label:e,description:s,setSelected:r,checked:i,"aria-label":a})=>o.jsxs(hs,{children:[o.jsxs(gs,{htmlFor:t,children:[o.jsx(ms,{children:e}),s&&o.jsx(bs,{children:s})]}),o.jsx(xs,{children:o.jsxs(ws,{$checked:i,htmlFor:t,children:[o.jsx(ys,{type:"checkbox",id:t,checked:i,onChange:l=>r(l.target.checked),"data-testid":`option-${t}`,"aria-label":a}),o.jsx(ks,{$checked:i}),o.jsx(_s,{$checked:i})]})})]}),Re=d.button`
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
`,Es=({isAvailable:t,isInstalled:e,isInstalling:s,onInstall:r})=>{let i,a;return e?(i=o.jsx(to,{children:"The application is installed and available offline."}),a=o.jsx(de,{size:"sm",disabled:!0,"data-testid":"pwa-installed-button",children:"Installed"})):t?(i=o.jsx(to,{children:"Install the app locally to access it offline without network connectivity."}),s?a=o.jsx(de,{size:"sm",disabled:!0,"data-testid":"pwa-installing-button",children:"Installing..."}):a=o.jsx(de,{size:"sm",onClick:r,"data-testid":"pwa-install-button",children:"Install App"})):(i=o.jsx(Cs,{children:"PWA installation is not supported by your browser or environment."}),a=o.jsx(de,{size:"sm",disabled:!0,"data-testid":"pwa-unavailable-button",children:"Unavailable"})),o.jsxs(vs,{children:[o.jsxs(js,{children:[o.jsx($s,{children:"Offline App"}),i]}),o.jsx(Ss,{children:a})]})},Ps=(t,e,s,r)=>{const i={config:t,...e&&e.length>0?{injections:e}:{},guiVersion:yt.version,ergogenVersion:ao("github:ceoloide/ergogen#v4.3.0")},a=JSON.stringify(i);return Wn.compressToEncodedURIComponent(a)},Is=()=>new URLSearchParams(window.location.search).get("debug")!==null,Ls=t=>{var s;const e=Is();try{const r=Wn.decompressFromEncodedURIComponent(t);if(!r)return console.error("[Share] DECODE_ERROR: Failed to decompress encoded string"),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The encoded data could not be decompressed."};let i;try{i=JSON.parse(r)}catch(l){return console.error("[Share] DECODE_ERROR: Failed to parse decompressed JSON",{parseError:l,decompressedLength:r.length,decompressedPreview:r.substring(0,100)}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The decompressed data is not valid JSON."}}if(!i||typeof i!="object"||!("config"in i)||typeof i.config!="string")return console.error("[Share] VALIDATION_ERROR: Invalid object structure",{parsed:i,hasConfig:i&&typeof i=="object"&&"config"in i,configType:i&&typeof i=="object"&&"config"in i?typeof i.config:"N/A"}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link does not contain a valid configuration. The decoded data is missing required fields or has an invalid structure."};const a=i;return(!a.guiVersion||typeof a.guiVersion!="string")&&(a.guiVersion="0.9.0"),(!a.ergogenVersion||typeof a.ergogenVersion!="string")&&(a.ergogenVersion="github:ergogen/ergogen#v4.2.1"),"injections"in a&&a.injections!==void 0&&(!Array.isArray(a.injections)||!a.injections.every(l=>Array.isArray(l)&&l.length===3&&typeof l[0]=="string"&&typeof l[1]=="string"&&typeof l[2]=="string"))?(console.error("[Share] VALIDATION_ERROR: Invalid injections structure",{injections:a.injections,isArray:Array.isArray(a.injections)}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link contains invalid injections data. Injections must be an array of [type, name, content] tuples."}):(e&&console.log("[Share] DEBUG: Decoded configuration object",{configLength:a.config.length,hasInjections:a.injections!==void 0,injectionsCount:((s=a.injections)==null?void 0:s.length)??0,fullObject:a}),{success:!0,config:a})}catch(r){return console.error("[Share] DECODE_ERROR: Unexpected error during decoding",{error:r,errorMessage:r instanceof Error?r.message:String(r),errorStack:r instanceof Error?r.stack:void 0}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. An unexpected error occurred while decoding."}}},zs=t=>{const{config:e,injections:s,canonical:r}=t;let i=s;if(r&&s&&s.length>0){const m=lr(r);i=Ds(s,m)}const a=i&&i.length>0?i:void 0,l=Ps(e,a);return`${window.location.origin+window.location.pathname}#${l}`},cr=()=>{const t=window.location.hash;if(!t||t.length<=1)return null;const e=t.substring(1);return Ls(e)},lr=t=>{const e=new Set,s=new Set,r=new Set;if(!t||typeof t!="object")return{footprints:e,templates:s,outlines:r};const i=t;if(i.pcbs&&typeof i.pcbs=="object"){for(const a of Object.values(i.pcbs))if(!(!a||typeof a!="object")&&(typeof a.template=="string"&&s.add(a.template),a.footprints&&typeof a.footprints=="object"))for(const l of Object.values(a.footprints))l&&typeof l.what=="string"&&e.add(l.what)}if(i.outlines&&typeof i.outlines=="object")for(const a of Object.values(i.outlines)){if(!a||typeof a!="object")continue;const l=Array.isArray(a)?a:Object.values(a);for(const p of l){const m=p;m&&typeof m.what=="string"&&r.add(m.what)}}return{footprints:e,templates:s,outlines:r}},Ds=(t,e)=>!t||t.length===0?[]:t.filter(s=>{const[r,i]=s;return r==="footprint"?e.footprints.has(i):r==="template"?e.templates.has(i):r==="outline"?e.outlines.has(i):!0}),an=async(t,e,s,r)=>{try{await navigator.clipboard.writeText(t),e(!0),r==null||r(),s.current&&clearTimeout(s.current),s.current=setTimeout(()=>{e(!1)},2500)}catch(i){console.error("Failed to copy shareable URI to clipboard:",i);try{const a=document.createElement("textarea");a.value=t,a.style.position="fixed",a.style.opacity="0",document.body.appendChild(a),a.select();const l=document.execCommand("copy");if(document.body.removeChild(a),!l){console.error("Fallback copy method was rejected by the browser.");return}e(!0),r==null||r(),s.current&&clearTimeout(s.current),s.current=setTimeout(()=>{e(!1)},2500)}catch(a){console.error("Fallback copy method also failed:",a)}}},dr=({config:t,injections:e,onClose:s,"data-testid":r})=>{const i=On.useMemo(()=>e||[],[e]),[a,l]=f.useState(1),[p,m]=f.useState(!0),[c,h]=f.useState(!1),[b,g]=f.useState(null),[x,k]=f.useState(""),[u,y]=f.useState([]),[j,E]=f.useState(!1),[L,S]=f.useState(!1),$=f.useRef(null),D=f.useRef(null);f.useEffect(()=>{if(!p||j||i.length===0||a!==1)return;let R=!0;h(!0),g(null);const F=qe();if(!F){g("Could not initialize background worker."),h(!1);return}return F.onmessage=U=>{var Z;if(!R)return;const B=U.data;if(B.type==="success"){const Y=(Z=B.results)==null?void 0:Z.canonical,{footprints:ee,templates:X,outlines:H}=lr(Y),O=i.map(([V,_,N])=>{let T;return V==="footprint"?T=ee.has(_):V==="template"?T=X.has(_):V==="outline"?T=H.has(_):T=!0,{type:V,name:_,content:N,checked:T,isEligible:T}}).filter(V=>V.isEligible).map(({type:V,name:_,content:N,checked:T})=>({type:V,name:_,content:N,checked:T}));y(O),E(!0)}else B.type==="error"&&g(B.error||"Failed to analyze configuration.");h(!1),F.terminate()},F.onerror=()=>{R&&(g("Worker encountered an error during analysis."),h(!1),F.terminate())},F.postMessage({type:"generate",inputConfig:t,injectionInput:i,requestId:`share-analysis-${Date.now()}`,options:{debug:!0}}),()=>{R=!1,F.terminate()}},[p,j,i,t,a]);const z=f.useRef(0);z.current=p?u.filter(R=>R.checked).length:0;const v=f.useCallback(R=>{M("share_link_copied",{has_injections:z.current>0,injections_count:z.current,source:R})},[]);f.useEffect(()=>{a===2&&x&&an(x,S,D,()=>{v("auto")})},[x,a,v]),f.useEffect(()=>{const R=F=>{F.key==="Escape"&&s()};return window.addEventListener("keydown",R),()=>{window.removeEventListener("keydown",R)}},[s]),f.useEffect(()=>{a===2&&$.current&&($.current.focus(),$.current.select())},[a]),f.useEffect(()=>{const R=D;return()=>{R.current&&clearTimeout(R.current)}},[]);const w=R=>{y(F=>F.map((U,B)=>B===R?{...U,checked:!U.checked}:U))},P=()=>{const R=p?u.filter(B=>B.checked):[],F=R.length>0?R.map(B=>[B.type,B.name,B.content]):void 0,U=zs({config:t,injections:F});k(U),l(2)},A=()=>{an(x,S,D,()=>{v("button")})};return o.jsx(As,{"data-testid":r,onClick:R=>{R.target===R.currentTarget&&s()},children:o.jsxs(Rs,{"data-testid":r&&`${r}-box`,onClick:R=>R.stopPropagation(),children:[o.jsx(Ns,{onClick:s,"data-testid":r&&`${r}-close`,"aria-label":"Close dialog",children:o.jsx("span",{className:"material-symbols-outlined",children:"close"})}),a===1?o.jsxs(o.Fragment,{children:[o.jsx(cn,{children:"Share Configuration"}),o.jsx(ln,{children:"Configure what content should be included when sharing your keyboard design."}),o.jsx(Us,{children:o.jsxs(Ws,{htmlFor:"include-libraries-toggle",children:[o.jsx(Os,{id:"include-libraries-toggle",type:"checkbox",checked:p,onChange:R=>{const F=R.target.checked;m(F),F||(h(!1),g(null))},"aria-label":"Include custom libraries"}),o.jsx(Fs,{$checked:p}),o.jsx("span",{children:"Include custom libraries"})]})}),p&&o.jsxs(o.Fragment,{children:[c&&o.jsxs(Bs,{children:[o.jsx(Ms,{}),o.jsx("span",{children:"Analyzing configuration..."})]}),b&&o.jsx(Ts,{children:b}),!c&&!b&&i.length===0&&o.jsx(dn,{children:"No custom libraries loaded."}),!c&&!b&&i.length>0&&u.length===0&&o.jsx(dn,{children:"No custom footprints or libraries are used in this configuration."}),!c&&!b&&u.length>0&&o.jsx(Gs,{children:u.map((R,F)=>o.jsxs(Hs,{children:[o.jsx(Vs,{id:`injection-${R.name}`,type:"checkbox",checked:R.checked,onChange:()=>w(F),"aria-label":R.name}),o.jsx(Ks,{$type:R.type,children:R.type}),o.jsx(Js,{htmlFor:`injection-${R.name}`,children:R.name})]},`${R.type}-${R.name}`))})]}),o.jsx(un,{children:o.jsx(qs,{onClick:P,disabled:c,children:"Share"})})]}):o.jsxs(o.Fragment,{children:[o.jsx(cn,{children:"Shareable Configuration Link"}),o.jsx(ln,{children:"Share this link with others to let them view and use your keyboard configuration, including all of your custom footprints."}),o.jsxs(Ys,{children:[o.jsx(Xs,{ref:$,type:"text",value:x,readOnly:!0,"data-testid":r&&`${r}-input`,"aria-label":"Share link"}),o.jsx(un,{children:o.jsxs(Zs,{onClick:A,"data-testid":r&&`${r}-copy`,"aria-label":L?"Link copied":"Copy link",children:[o.jsx("span",{className:"material-symbols-outlined",children:L?"check":"content_copy"}),L?"Link copied":"Copy link"]})})]})]})]})})},As=d.div`
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
`,cn=d.h2`
  margin: 0 0 1rem 0;
  font-size: ${n.fontSizes.h3};
  color: ${n.colors.text};
  padding-right: 3rem;
`,ln=d.p`
  margin: 0 0 1.5rem 0;
  font-size: ${n.fontSizes.base};
  color: ${n.colors.textDark};
  line-height: 1.5;
`,Us=d.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`,Ws=d.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  font-family: ${n.fonts.body};
  font-size: ${n.fontSizes.base};
  color: ${n.colors.text};
`,Os=d.input`
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
`,ca=d.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`,la=d.div`
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
`,fa=({pwaState:t})=>{const e=()=>Math.max(200,window.innerWidth*.33),s=()=>Math.max(150,window.innerWidth*.15),r=()=>Math.max(350,window.innerWidth*.15),[i,a]=f.useState({key:"demo.svg",extension:"svg",content:""}),[l,p]=f.useState(!1),m=v=>{a(v),u!=null&&u.showConfig||u==null||u.setShowDownloads(!1)},[c,h]=f.useState({key:-1,type:"",name:"",content:""}),[b,g]=f.useState(!1),[x,k]=f.useState(window.innerWidth<=639),u=ye();f.useEffect(()=>{const v=()=>{k(window.innerWidth<=639)};return window.addEventListener("resize",v),()=>window.removeEventListener("resize",v)},[]),$r(ar()?"meta+enter":"ctrl+enter",()=>{u&&(M("shortcut_used",{action:"generate"}),u.generateNow(u.configInput,u.injectionInput,{pointsonly:!1,isManual:!0}))},{enableOnFormTags:!0,preventDefault:!0}),f.useEffect(()=>{if(c.key===-1||c.name===""||c.content==="")return;const v=[c.type,c.name,c.content];let w=[];Array.isArray(u==null?void 0:u.injectionInput)&&(w=[...u.injectionInput]);const P=w.length;if(P===0||P===c.key)w.push(v),h({...c,key:P});else{const A=w[c.key];if(A[0]===c.type&&A[1]===c.name&&A[2]===c.content)return;w=w.map((R,F)=>F===c.key?v:R)}u==null||u.setInjectionInput(w)},[u,c]);const y=f.useRef(null),j=!!(u!=null&&u.results);if(f.useEffect(()=>{if(!j){y.current=null;return}if(!i.key||!i.extension)return;const v=`${i.key}|${i.extension}`;y.current!==v&&(y.current=v,M("preview_loaded",{preview_type:i.extension,preview_key:i.key}))},[i.key,i.extension,j]),!u)return null;let E=null;switch(u.results&&(E=eo(i.key,u.results),E===void 0&&i.key!=="demo.svg"&&(i.key="demo.svg",i.extension="svg",E=eo(i.key,u.results))),i.extension){case"svg":case"kicad_pcb":i.content=typeof E=="string"?E:"";break;case"stl":i.content=typeof E=="string"||E instanceof ArrayBuffer||ArrayBuffer.isView(E)?E:"";break;case"jscad":i.content=typeof(E==null?void 0:E.jscad)=="string"?E.jscad:"";break;case"yaml":i.content=pe.dump(E);break;case"txt":i.content=u.configInput||"";break;default:i.content=""}const L=v=>{const w={...c,name:v.target.value};h(w)},S=v=>{if(!Array.isArray(u==null?void 0:u.injectionInput))return;M("injection_deleted",{injection_type:v.type});const w=[...u.injectionInput].filter((P,A)=>A!==v.key);if(u.setInjectionInput(w),c.key===v.key)h({key:-1,type:"",name:"",content:""});else if(c.key>=v.key){const P={...c,key:c.key-1};h(P)}},$=()=>{var A;const v=((A=u.getRealtimeConfigInput)==null?void 0:A.call(u))??u.configInput;if(v===void 0)return;M("download_button_clicked",{download_type:"yaml",source:"editor"});const w=document.createElement("a"),P=new Blob([v],{type:"text/yaml"});w.href=URL.createObjectURL(P),w.download="config.yaml",document.body.appendChild(w),w.click(),URL.revokeObjectURL(w.href),document.body.removeChild(w)},D=()=>{var v,w;u.configInput&&(M("share_button_clicked",{has_injections:!!((v=u.injectionInput)!=null&&v.length),injections_count:((w=u.injectionInput)==null?void 0:w.length)||0,source:"subheader"}),p(!0))},z=()=>{var v,w,P;!u.results||!u.configInput||u.isGenerating||u.isJscadConverting||(M("archive_single_downloaded",{has_injections:!!((v=u.injectionInput)!=null&&v.length),injections_count:((w=u.injectionInput)==null?void 0:w.length)||0,stored_configs_count:((P=u.configs)==null?void 0:P.length)||0,source:"subheader"}),or(u.results,u.configInput,u.injectionInput,u.debug,u.stlPreview))};return o.jsxs(o.Fragment,{children:[l&&o.jsx(dr,{config:u.configInput||"",injections:u.injectionInput||[],onClose:()=>p(!1)}),o.jsxs(ia,{children:[!u.showSettings&&o.jsxs(ta,{children:[o.jsx(Re,{className:u.showConfig?"active":"",onClick:()=>u.setShowConfig(!0),"aria-label":"Show configuration panel","data-testid":"mobile-config-button",children:"Config"}),o.jsx(Re,{className:u.showConfig?"":"active",onClick:()=>u.setShowConfig(!1),"aria-label":"Show outputs panel","data-testid":"mobile-outputs-button",children:"Outputs"}),o.jsx(oa,{}),u.showConfig&&o.jsxs(o.Fragment,{children:[o.jsx(na,{onClick:()=>u.generateNow(u.configInput,u.injectionInput,{pointsonly:!1,isManual:!0}),"aria-label":"Generate configuration","data-testid":"mobile-generate-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"refresh"})}),o.jsx(pn,{onClick:D,disabled:!u.configInput,"aria-label":"Share configuration","data-testid":"mobile-share-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"share"})}),o.jsx(Re,{onClick:$,"aria-label":"Download configuration","data-testid":"mobile-download-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"download"})})]}),!u.showConfig&&o.jsxs(o.Fragment,{children:[o.jsx(pn,{onClick:z,disabled:u.isGenerating||u.isJscadConverting,"aria-label":"Download archive of all generated files","data-testid":"mobile-download-outputs-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),o.jsx(Re,{onClick:()=>u.setShowDownloads(!u.showDownloads),"aria-label":u.showDownloads?"Hide downloads panel":"Show downloads panel","data-testid":"mobile-downloads-toggle-button",children:o.jsx("span",{className:"material-symbols-outlined",children:u.showDownloads?"expand_content":"collapse_content"})})]})]}),o.jsx(pa,{children:u.showSettings?o.jsxs(o.Fragment,{children:[o.jsx(Ft,{initialWidth:r(),minWidth:150,maxWidth:"70%",side:"left","data-testid":"settings-panel",style:{display:b&&x?"none":void 0},children:o.jsxs(la,{children:[o.jsxs(ca,{children:[o.jsx(at,{children:"General"}),o.jsxs(ct,{children:[o.jsx(De,{optionId:"autogen",label:"Auto-generate",description:"Automatically generate new outputs and update previews on changes.",setSelected:u.setAutoGen,checked:u.autoGen,"aria-label":"Enable auto-generate"}),o.jsx(De,{optionId:"autogen3d",label:"Auto-generate PCB & 3D",description:"Build 3D models and PCB files during generation (can be slow).",setSelected:u.setAutoGen3D,checked:u.autoGen3D,"aria-label":"Enable auto-generate PCB and 3D (slow)"}),o.jsx(De,{optionId:"debug",label:"Debug",description:"Include debug files in the outputs.",setSelected:u.setDebug,checked:u.debug,"aria-label":"Enable debug mode"})]}),o.jsx(at,{children:"Previews (Experimental)"}),o.jsxs(ct,{children:[o.jsx(De,{optionId:"kicanvasPreview",label:"KiCad Preview",description:"Render interactive PCB layouts using KiCanvas.",setSelected:u.setKicanvasPreview,checked:u.kicanvasPreview,"aria-label":"Enable KiCad preview (experimental)"}),o.jsx(De,{optionId:"stlPreview",label:"STL Preview",description:"Render 3D preview of generated cases.",setSelected:u.setStlPreview,checked:u.stlPreview,"aria-label":"Enable STL preview (experimental)"})]}),o.jsx(at,{children:"Privacy"}),o.jsx(ct,{children:o.jsx(De,{optionId:"sendUsageMetrics",label:"Send Usage Metrics",description:"Help improve Ergogen Web UI by sharing anonymous usage statistics.",setSelected:u.setSendUsageMetrics,checked:u.sendUsageMetrics,"aria-label":"Send usage metrics"})}),t&&o.jsxs(o.Fragment,{children:[o.jsx(at,{children:"Offline"}),o.jsx(ct,{children:o.jsx(Es,{isAvailable:t.isAvailable,isInstalled:t.isInstalled,isInstalling:t.isInstalling,onInstall:t.onInstall})})]})]}),o.jsx(ns,{setInjectionToEdit:h,deleteInjection:S,injectionToEdit:c,onInjectionSelect:()=>g(!0),"data-testid":"injections-container"})]})}),o.jsx(gn,{$fullWidth:b&&x,children:o.jsxs(fn,{children:[x&&o.jsxs(da,{children:[o.jsxs(gt,{as:"h4",style:{marginTop:0},children:[c.type?c.type.charAt(0).toUpperCase()+c.type.slice(1):"Footprint"," ","name"]}),o.jsx(ua,{onClick:()=>{g(!1),h({key:-1,type:"",name:"",content:""})},"aria-label":"Close editor","data-testid":"mobile-editor-close",children:o.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),!x&&o.jsxs(gt,{as:"h4",children:[c.type?c.type.charAt(0).toUpperCase()+c.type.slice(1):"Footprint"," ","name"]}),o.jsx(fs,{value:c.name,onChange:L,disabled:c.key===-1,"aria-label":`${c.type?c.type.charAt(0).toUpperCase()+c.type.slice(1):"Footprint"} name`,"data-testid":"footprint-name-input"}),o.jsxs(gt,{as:"h4",children:[c.type?c.type.charAt(0).toUpperCase()+c.type.slice(1):"Footprint"," ","code"]}),o.jsx(Wi,{injection:c,setInjection:h,options:{readOnly:c.key===-1}})]})})]}):o.jsxs(o.Fragment,{children:[u.showConfig&&o.jsx(Ft,{initialWidth:e(),minWidth:250,maxWidth:"60%",side:"left","data-testid":"config-panel",children:o.jsxs(fn,{children:[o.jsx(aa,{"data-testid":"config-editor"}),o.jsxs(ra,{children:[o.jsx(Je,{onClick:()=>u.generateNow(u.configInput,u.injectionInput,{pointsonly:!1,isManual:!0}),"aria-label":"Generate configuration","data-testid":"generate-button",children:o.jsxs("span",{style:{display:"flex",alignItems:"center",width:"100%",justifyContent:"center"},children:[o.jsx("span",{children:"Generate"}),o.jsx(Qs,{children:ea()})]})}),o.jsx(Re,{onClick:$,"aria-label":"Download configuration","data-testid":"download-config-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"download"})})]})]})}),o.jsx(gn,{$fullWidth:!u.showConfig,children:u.showDownloads?o.jsxs(o.Fragment,{children:[o.jsx(mn,{children:o.jsx(hn,{"data-testid":`${i.key}-file-preview`,previewExtension:i.extension,previewKey:`${i.key}-${u.resultsVersion}`,previewContent:i.content})}),o.jsx(Ft,{initialWidth:s(),minWidth:105,maxWidth:"30%",side:"right","data-testid":"downloads-panel",children:o.jsx(sa,{children:o.jsx(Yi,{setPreview:m,previewKey:i.key,"data-testid":"downloads-container"})})})]}):o.jsx(mn,{children:o.jsx(hn,{"data-testid":`${i.key}-file-preview`,previewExtension:i.extension,previewKey:`${i.key}-${u.resultsVersion}`,previewContent:i.content})})})]})})]})]})},ha={label:"Absolem",author:"MrZealot",value:`meta:
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
`},$a=[oo],Ca=[ha,ga],Sa=[ma,ba,wa,ya,ka],Ea=[xa,_a,va,ja],Pa=[{label:"Empty configurations",options:$a},{label:"Simple (points only)",options:Ca},{label:"Complete (with pcb)",options:Sa},{label:"Miscellaneous",options:Ea}],Ia=async t=>new Promise((e,s)=>{const r=new FileReader;r.onload=i=>{var a;(a=i.target)!=null&&a.result&&typeof i.target.result=="string"?e(i.target.result):s(new Error("Failed to read file as text"))},r.onerror=()=>s(new Error("Failed to read file")),r.readAsText(t)}),La=async t=>{const s=t.name.toLowerCase().split(".").pop(),r=s==="zip"||s==="ekb";if(Xt(t.size,r),s==="yaml"||s==="yml"||s==="json")return{config:await Ia(t),footprints:[],outlines:[],templates:[]};if(r){const i=await t.arrayBuffer(),a=await fi(i),l=a.injections.filter(c=>c.type==="footprint").map(c=>({name:c.name,content:c.content})),p=a.injections.filter(c=>c.type==="outline").map(c=>({name:c.name,content:c.content})),m=a.injections.filter(c=>c.type==="template").map(c=>({name:c.name,content:c.content}));return{config:a.config,footprints:l,outlines:p,templates:m}}else throw new Error("Unsupported file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")},no=()=>o.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-github",viewBox:"0 0 98 96",children:o.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z",fill:"currentColor"})}),bn=()=>o.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 4.2333332 4.2333335",version:"1.1",fill:"currentColor",children:[o.jsxs("defs",{children:[o.jsxs("linearGradient",{id:"linearGradient6924-6",children:[o.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:0},offset:"0"}),o.jsx("stop",{offset:"0.49517274",style:{stopColor:"#ffffff",stopOpacity:.3}}),o.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:.3},offset:"1"})]}),o.jsx("linearGradient",{id:"linearGradient6918-3",x1:"42519.285",y1:"-7078.7891",x2:"42575.336",y2:"-6966.9307",gradientUnits:"userSpaceOnUse",href:"#linearGradient6924-6"})]}),o.jsxs("g",{transform:"matrix(0.06551432,0,0,0.06551432,-2.232417,-1.431776)",children:[o.jsx("path",{id:"path6733-5",style:{fontVariationSettings:"normal",opacity:1,vectorEffect:"none",fill:"url(#linearGradient6918-3)",fillOpacity:1,stroke:"none",strokeWidth:3.67846,strokeLinecap:"butt",strokeLinejoin:"miter",strokeMiterlimit:2,strokeDashoffset:0,strokeOpacity:1,paintOrder:"stroke markers fill",stopColor:"#000000",stopOpacity:1},d:"m 42519.285,-7078.7891 a 0.76086879,0.56791688 0 0 0 -0.738,0.6739 l 33.586,125.8886 a 87.182358,87.182358 0 0 0 39.381,-33.7636 l -71.565,-92.5196 a 0.76086879,0.56791688 0 0 0 -0.664,-0.2793 z",transform:"matrix(0.37058478,0,0,0.37058478,-15690.065,2662.0533)"}),o.jsx("path",{id:"path360787",style:{opacity:1,fill:"#ffffff",fillOpacity:1,strokeWidth:17.0055,paintOrder:"markers fill stroke",stopColor:"#000000"},d:"m 11249.461,-1883.6961 c -12.74,0 -23.067,10.3275 -23.067,23.0671 0,4.3335 1.22,8.5795 3.522,12.2514 l 19.232,-24.8636 c 0.138,-0.1796 0.486,-0.1796 0.624,0 l 19.233,24.8646 c 2.302,-3.6721 3.523,-7.9185 3.523,-12.2524 0,-12.7396 -10.327,-23.0671 -23.067,-23.0671 z",transform:"matrix(1.4006354,0,0,1.4006354,-15690.065,2662.0533)"})]})]}),xn=()=>o.jsx("svg",{width:"16",height:"16",viewBox:"0 0 212 212",fill:"none",stroke:"currentColor",children:o.jsxs("g",{transform:"translate(6,6)",children:[o.jsx("path",{d:"M58 168 v-98 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),o.jsx("path",{d:"M58 168 v-30 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),o.jsx("circle",{cx:"142",cy:"20",r:"18",strokeWidth:"15"}),o.jsx("circle",{cx:"142",cy:"88",r:"18",strokeWidth:"15"}),o.jsx("circle",{cx:"58",cy:"180",r:"18",strokeWidth:"15"})]})}),ro=d.div`
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
`,Wa=d.div`
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
`,Oa=d.div`
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
`,_n=Pa.flatMap(t=>t.options).filter(t=>t.label!=="Empty YAML configuration"),Xa=()=>{const t=io(),e=ye(),[s,r]=f.useState(""),[i,a]=f.useState("github"),[l,p]=f.useState(!1),[m,c]=f.useState(!1),h=l||m,[b,g]=f.useState(!1),x=f.useRef(null),[k,u]=f.useState(!1);f.useEffect(()=>{const _=N=>{x.current&&!x.current.contains(N.target)&&u(!1)};return document.addEventListener("mousedown",_),()=>document.removeEventListener("mousedown",_)},[]);const[y,j]=f.useState(!1),E=_=>{r(_),_.includes("github.com/")?a("github"):_.includes("codeberg.org/")?a("codeberg"):(_.startsWith("http://")||_.startsWith("https://")||_.includes("/")&&!_.includes("github.com/")&&!_.includes("codeberg.org/")&&_.split("/")[0].includes("."))&&a("forgejo")},{currentConflict:L,processInjectionsWithConflictResolution:S,handleConflictResolution:$,handleConflictCancel:D}=$t({setInjectionInput:_=>e==null?void 0:e.setInjectionInput(_),setConfigInput:_=>e==null?void 0:e.setConfigInput(_),generateNow:async(_,N,T)=>{e&&await e.generateNow(_,N,T)},getCurrentInjections:()=>(e==null?void 0:e.injectionInput)||[],onComplete:async()=>{g(!0)},setError:_=>e==null?void 0:e.setError(_)});f.useEffect(()=>{const _=new URLSearchParams(window.location.search),N=_.has("github")||_.has("codeberg")||_.has("forgejo")||_.has("gitea");(b||N)&&(e!=null&&e.configInput)&&(t("/"),g(!1))},[b,e==null?void 0:e.configInput,t]),f.useEffect(()=>{var _;(_=e==null?void 0:e.pruneDeletedConfigs)==null||_.call(e)},[e]);const z=async _=>{if(e){const N=_===oo.value;let T="unknown";if(N)T="empty_configuration";else{const J=_n.find(G=>G.value===_);J&&(T=J.label.toLowerCase().replace(/\s+/g,"_"))}M("example_loaded",{example_name:T,is_empty:N}),e.createNewConfig(_),await e.generateNow(_,e.injectionInput,{pointsonly:!1}),g(!0)}},v=async _=>{if(e){const N=e.configs.find(T=>T.id===_);N&&(e.selectConfig(_),M("saved_config_loaded",{stored_configs_count:e.configs.length}),await e.generateNow(N.config,e.injectionInput,{pointsonly:!1}),g(!0))}},P=[...(e==null?void 0:e.configs)||[]].sort((_,N)=>new Date(N.updatedAt).getTime()-new Date(_.updatedAt).getTime()).slice(0,4),A=async(_,N,T,J,G=null,re)=>{if(!e)throw new Error("Configuration context not available");const te=er(_,N,T);await S(te,J,G,re)},R=async(_,N)=>{await $(_,N)},F=()=>{D(),p(!1),c(!1),e==null||e.setIsGenerating(!1)},U=()=>{if(!s||!e)return;const{setError:_,clearError:N,setIsGenerating:T}=e;c(!0),T(!0),N(),M("repo_loaded",{provider:i});let J=s.trim();if(!J.includes("://")&&!J.includes("github.com")&&!J.includes("codeberg.org"))if(i==="codeberg")J=`https://codeberg.org/${J}`;else if(i==="forgejo"){const G=J.split("/");if(G.length>=2&&G[0].includes("."))J=`https://${J}`;else{_("Forgejo/Gitea requires a URL including the host (e.g., host/owner/repo)"),c(!1),T(!1);return}}else J=`https://github.com/${J}`;tr(J).then(async G=>{if(e){G.rateLimitWarning&&_(G.rateLimitWarning);try{e.createNewConfig(G.config),await A(G.footprints,G.outlines,G.templates||[],G.config)}catch(re){throw new Error(`Failed to process footprints: ${re instanceof Error?re.message:"Unknown error"}`)}}}).catch(G=>{_(`Failed to load from ${i==="github"?"GitHub":i==="codeberg"?"Codeberg":"Forgejo/Gitea"} repository: ${G.message}`),e==null||e.setInfo(null),c(!1),T(!1)}).finally(()=>{c(!1)})},B=f.useRef(null),Z=()=>{var _;(_=B.current)==null||_.click()},Y=async _=>{if(!e)return;const{setError:N,clearError:T,setIsGenerating:J}=e;p(!0),J(!0),T(),M("local_file_loaded",{file_type:Or(_.name),file_size:_.size});try{const G=await La(_);e.createNewConfig(G.config),await A(G.footprints,G.outlines,G.templates||[],G.config)}catch(G){N(`Failed to load local file: ${G instanceof Error?G.message:"Unknown error"}`),e.setInfo(null),p(!1),J(!1)}finally{p(!1)}},ee=async _=>{var T;const N=(T=_.target.files)==null?void 0:T[0];N&&(_.target.value="",await Y(N))},X=_=>{_.preventDefault(),_.stopPropagation(),!h&&j(!0)},H=_=>{_.preventDefault(),_.stopPropagation()},O=_=>{if(_.preventDefault(),_.stopPropagation(),h)return;const N=_.currentTarget,T=_.relatedTarget;(!T||!N.contains(T))&&j(!1)},V=async _=>{if(_.preventDefault(),_.stopPropagation(),h)return;j(!1);const N=Array.from(_.dataTransfer.files),T=[".yaml",".yml",".json",".zip",".ekb"],J=N.find(G=>{const re=G.name.toLowerCase();return T.some(te=>re.endsWith(te))});J?await Y(J):N.length>0&&e&&e.setError("Invalid file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")};return o.jsxs(za,{$isDragging:y,onDragEnter:X,onDragOver:H,onDragLeave:O,onDrop:V,"data-testid":"welcome-page-wrapper",children:[o.jsx(Da,{$isVisible:y,children:o.jsx(Aa,{children:"Drop file here to load configuration"})}),L&&o.jsx(jt,{injectionName:L.name,injectionType:L.type,onResolve:R,onCancel:F,"data-testid":"conflict-dialog"}),o.jsxs(Ra,{children:[o.jsx(Na,{children:"Ergogen Web UI"}),o.jsxs(Ua,{children:["A web-based interface for Ergogen, the ergonomic keyboard generator.",o.jsx("br",{}),"Start a new design below."]}),o.jsxs(Wa,{children:[o.jsxs(Bt,{children:[o.jsx("h2",{children:"Start Fresh"}),o.jsx("p",{children:"Begin with a completely blank slate."}),o.jsx(de,{onClick:()=>z(oo.value),"aria-label":"Start with empty configuration","data-testid":"empty-config-button",children:"Empty Configuration"})]}),o.jsxs(Bt,{children:[o.jsx("h2",{children:"From Local File"}),o.jsx("p",{children:"Load a configuration from your computer. Supports *.yaml, *.json, *.zip, and *.ekb files."}),o.jsx(Ja,{ref:B,type:"file",accept:".yaml,.yml,.json,.zip,.ekb",onChange:ee,disabled:h,"aria-label":"Select local file to load","data-testid":"local-file-input"}),o.jsx(de,{onClick:Z,disabled:h,"aria-label":"Select local file to load","data-testid":"local-file-button",children:l?o.jsxs(o.Fragment,{children:[o.jsx(ro,{})," Loading..."]}):"Choose File"})]}),o.jsxs(Bt,{children:[o.jsx("h2",{children:"From Repo"}),o.jsx("p",{children:'Link to a YAML config file on a Git provider (e.g. GitHub, Codeberg, Forgejo), or simply a repository name like "user/repo".'}),o.jsx(Oa,{children:o.jsxs(Fa,{children:[o.jsxs(Ba,{ref:x,children:[o.jsxs(Ma,{type:"button",onClick:()=>u(!k),disabled:h,"aria-label":"Repository provider source","data-testid":"repo-provider-trigger",children:[i==="github"?o.jsx(no,{}):i==="codeberg"?o.jsx(bn,{}):o.jsx(xn,{}),o.jsx("span",{className:"material-symbols-outlined",children:"arrow_drop_down"})]}),k&&o.jsxs(Ha,{children:[o.jsxs(Mt,{$active:i==="github",onClick:()=>{a("github"),u(!1)},children:[o.jsx(no,{}),"GitHub"]}),o.jsxs(Mt,{$active:i==="codeberg",onClick:()=>{a("codeberg"),u(!1)},children:[o.jsx(bn,{}),"Codeberg"]}),o.jsxs(Mt,{$active:i==="forgejo",onClick:()=>{a("forgejo"),u(!1)},children:[o.jsx(xn,{}),"Forgejo"]})]})]}),o.jsx(Ta,{}),o.jsx(Ga,{placeholder:i==="forgejo"?"host/user/repo":"user/repo",value:s,onChange:_=>E(_.target.value),onKeyDown:_=>{_.key==="Enter"&&!h&&s.trim()!==""&&(_.preventDefault(),U())},disabled:h,"aria-label":"Repository URL or path","data-testid":"repo-input"}),o.jsx(Va,{onClick:U,disabled:h||!s,"aria-label":"Load configuration from repository","data-testid":"repo-load-button",children:m?o.jsx(ro,{}):o.jsx("span",{className:"material-symbols-outlined",style:{display:"block"},children:"cloud_download"})})]})})]})]}),P.length>0&&o.jsxs(o.Fragment,{children:[o.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:n.fontSizes.h2},children:"Pick up where you left"}),o.jsx(wn,{style:{marginBottom:"3rem"},children:P.map(_=>o.jsxs(yn,{onClick:()=>v(_.id),"aria-label":`Load ${_.name} configuration`,"data-testid":`saved-config-${_.name.toLowerCase().replace(/\s+/g,"-")}`,children:[_.previewSvg?o.jsx(qa,{dangerouslySetInnerHTML:{__html:_.previewSvg}}):o.jsx(Ya,{children:o.jsx("span",{className:"material-symbols-outlined",children:"keyboard_off"})}),o.jsx(kn,{children:_.name})]},_.id))})]}),o.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:n.fontSizes.h2},children:"Or start from an example"}),o.jsx(wn,{children:_n.map(_=>o.jsxs(yn,{onClick:()=>z(_.value),"aria-label":`Load ${_.label} example`,"data-testid":`example-${_.label.toLowerCase().replace(/\s+/g,"-")}`,children:[o.jsx(Ka,{src:`/images/previews/${_.label.toLowerCase().replace(/[\s()]/g,"_")}.svg`,alt:`${_.label} preview`}),o.jsx(kn,{children:_.label})]},_.label))})]})]})},ur=({versionInfo:t,"data-testid":e})=>{const[s,r]=f.useState(!1),i=f.useRef(null),a=()=>{i.current&&clearTimeout(i.current),r(!0)},l=()=>{i.current=setTimeout(()=>{r(!1)},250)},p=()=>{i.current&&clearTimeout(i.current)},m=()=>{i.current=setTimeout(()=>{r(!1)},250)},c=h=>{h.stopPropagation(),r(b=>!b)};return f.useEffect(()=>{if(!s)return;const h=()=>{r(!1)};return window.addEventListener("click",h),()=>{window.removeEventListener("click",h)}},[s]),f.useEffect(()=>()=>{i.current&&clearTimeout(i.current)},[]),o.jsxs(Za,{onMouseEnter:a,onMouseLeave:l,"data-testid":e,children:[o.jsx(Qa,{onClick:c,"data-testid":e&&`${e}-badge`,"aria-label":"Custom Ergogen version indicator",children:o.jsx("span",{className:"material-symbols-outlined",children:"science"})}),s&&o.jsxs(ec,{onMouseEnter:p,onMouseLeave:m,onClick:h=>h.stopPropagation(),"data-testid":e&&`${e}-popover`,children:[o.jsx(tc,{children:"Custom Ergogen Version"}),o.jsx(oc,{children:"This website is running a custom version of Ergogen for development and preview purposes."}),o.jsxs(nc,{href:t.url,target:"_blank",rel:"noopener noreferrer","data-testid":e&&`${e}-link`,children:[o.jsx("span",{children:t.label}),o.jsx("span",{className:"material-symbols-outlined open-icon",children:"open_in_new"})]})]})]})},Za=d.span`
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
`,ec=d.div`
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
`,tc=d.div`
  font-size: 12px;
  font-weight: ${n.fontWeights.semiBold};
  color: ${n.colors.white};
`,oc=d.div`
  font-size: 11px;
  color: ${n.colors.textDark};
  line-height: 1.4;
`,nc=d.a`
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
`,rc=wt`
  0%   { box-shadow: 0 0 0 0   ${n.colors.accent}99; }
  70%  { box-shadow: 0 0 0 6px ${n.colors.accent}00; }
  100% { box-shadow: 0 0 0 0   ${n.colors.accent}00; }
`,ic=wt`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`,sc=d.button`
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
  animation: ${rc} ${t=>t.$isUpdating?"0.6s":"2s"}
    ease-out infinite;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  .material-symbols-outlined {
    font-size: 14px !important;
    ${t=>t.$isUpdating&&Un`
        animation: ${ic} 1s linear infinite;
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
`,ac=({onClick:t,"data-testid":e})=>{const[s,r]=f.useState(!1),i=()=>{r(!0),t()};return o.jsxs(sc,{onClick:i,disabled:s,$isUpdating:s,"aria-label":s?"Updating version...":"Update available — click to reload and apply","data-testid":e??"update-chip",children:[o.jsx("span",{className:"material-symbols-outlined","aria-hidden":"true",children:s?"sync":"update"}),s?"Updating version...":"Update Available"]})},cc=d.header`
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
`,lc=d.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: row;
  flex-grow: 1;
  min-width: 0;
  width: 100%;
`,dc=d.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,uc=d.div`
  display: flex;
  align-items: center;
  gap: 6px;
`,pc=d.div`
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
`,fc=d(Ct)`
  flex-shrink: 0;
`,hc=d(Ct)`
  background-color: ${n.colors.accent};
  border-color: ${n.colors.accent};

  &:hover {
    background-color: ${n.colors.accentDark};
    border-color: ${n.colors.accentDarker};
  }

  @media (max-width: 375px) {
    display: none;
  }
`,gc=d.span`
  @media (max-width: 510px) {
    display: none;
  }
`,vn=d(Ct)`
  @media (max-width: 475px) {
    display: none;
  }
`,mc=d(Bn)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,bc=d.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,xc=({onUpdate:t})=>{const e=ye(),s=io(),r=Fn(),{activeConfigId:i,activeConfigName:a,configs:l,isPreview:p,renameConfig:m,duplicateConfig:c,deleteConfig:h,savePreviewConfig:b}=e||{},[g,x]=f.useState(!1),[k,u]=f.useState(!1),[y,j]=f.useState(""),E=()=>{a&&i&&(j(a),u(!0))},L=U=>{U&&U.stopPropagation(),!(m&&i&&y.trim()&&!m(i,y.trim()))&&u(!1)},S=U=>{U&&U.stopPropagation(),u(!1)},$=U=>{U.key==="Enter"?L():U.key==="Escape"&&u(!1)},D=U=>{U.stopPropagation(),c&&i&&c(i)},z=U=>{U.stopPropagation(),i&&a&&h&&window.confirm(`Are you sure you want to delete "${a}"?`)&&(h(i),(l&&l.length<=1||i)&&s("/new"))},v=()=>{e==null||e.setShowSettings(!(e!=null&&e.showSettings))},w=()=>{e==null||e.setShowSettings(!1),e==null||e.selectConfig(null),s("/new")},P=()=>{var U,B,Z;!(e!=null&&e.results)||!(e!=null&&e.configInput)||e!=null&&e.isGenerating||e!=null&&e.isJscadConverting||(M("archive_single_downloaded",{has_injections:!!((U=e.injectionInput)!=null&&U.length),injections_count:((B=e.injectionInput)==null?void 0:B.length)||0,stored_configs_count:((Z=e.configs)==null?void 0:Z.length)||0,source:"header"}),or(e.results,e.configInput,e.injectionInput,e.debug,e.stlPreview))},A=()=>{var U,B;e!=null&&e.configInput&&(M("share_button_clicked",{has_injections:!!((U=e.injectionInput)!=null&&U.length),injections_count:((B=e.injectionInput)==null?void 0:B.length)||0,source:"header"}),x(!0))},R=()=>{e==null||e.setShowSideNav(!(e!=null&&e.showSideNav))},F=f.useMemo(()=>kt("github:ceoloide/ergogen#v4.3.0"),[]);return o.jsxs(o.Fragment,{children:[g&&o.jsx(dr,{config:(e==null?void 0:e.configInput)||"",injections:(e==null?void 0:e.injectionInput)||[],onClose:()=>x(!1),"data-testid":"share-dialog"}),o.jsxs(cc,{children:[o.jsxs(lc,{children:[o.jsx(fc,{onClick:R,"aria-label":e!=null&&e.showSideNav?"Hide navigation panel":"Show navigation panel","data-testid":"side-nav-toggle-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"side_navigation"})}),o.jsxs(uc,{children:[o.jsx(mc,{to:"/","aria-label":"Go to home page","data-testid":"logo-button",children:o.jsx(bc,{src:"/ergogen.png",alt:"Ergogen logo"})}),o.jsxs(pc,{children:["Ergogen",F.isCustom&&o.jsx(ur,{versionInfo:F,"data-testid":"header-dev-chip"})]})]}),a&&o.jsxs(o.Fragment,{children:[o.jsx(yc,{children:"/"}),o.jsxs(wc,{"data-testid":"header-active-config-name",$isEditing:k,onClick:!k&&!p?E:void 0,children:[p&&o.jsx(_c,{"data-testid":"header-shared-icon",children:o.jsx("span",{className:"material-symbols-outlined",children:"link"})}),k?o.jsxs(o.Fragment,{children:[o.jsx(kc,{type:"text",value:y,onChange:U=>j(U.target.value),onBlur:L,onKeyDown:$,autoFocus:!0,"data-testid":"header-config-name-input","aria-label":"Edit configuration name"}),o.jsxs(Tt,{className:"header-actions-always-visible",children:[o.jsx(He,{onMouseDown:U=>{U.preventDefault()},onClick:L,"aria-label":"Confirm rename","data-testid":"header-confirm-rename-btn",children:o.jsx("span",{className:"material-symbols-outlined",children:"check"})}),o.jsx(He,{onMouseDown:U=>{U.preventDefault()},onClick:S,"aria-label":"Cancel rename","data-testid":"header-cancel-rename-btn",children:o.jsx("span",{className:"material-symbols-outlined",children:"close"})})]})]}):p?o.jsxs(o.Fragment,{children:[o.jsx($n,{"data-testid":"header-config-name-text",children:a}),o.jsx(Tt,{className:"header-actions-always-visible",children:o.jsx(He,{onClick:U=>{U.stopPropagation(),b==null||b()},"aria-label":"Save preview configuration","data-testid":"header-save-preview-btn",children:o.jsx("span",{className:"material-symbols-outlined",children:"save"})})})]}):o.jsxs(o.Fragment,{children:[o.jsx($n,{title:"Click to rename","data-testid":"header-config-name-text",children:a}),o.jsxs(Tt,{className:"header-actions-hover",children:[o.jsx(He,{onClick:E,"aria-label":"Rename configuration","data-testid":"header-rename-btn",children:o.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),o.jsx(jn,{onClick:D,"aria-label":"Duplicate configuration","data-testid":"header-duplicate-btn",children:o.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),o.jsx(jn,{onClick:z,"aria-label":"Delete configuration","data-testid":"header-delete-btn",children:o.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})]})]})]}),o.jsxs(dc,{children:[t&&o.jsx(ac,{onClick:t,"data-testid":"header-update-chip"}),r.pathname==="/"&&o.jsxs(o.Fragment,{children:[o.jsxs(hc,{onClick:w,"aria-label":"Start new configuration","data-testid":"new-config-button",children:[o.jsx("span",{className:"material-symbols-outlined",children:"add_2"}),o.jsx(gc,{children:"New"})]}),o.jsx(vn,{onClick:P,disabled:(e==null?void 0:e.isGenerating)||(e==null?void 0:e.isJscadConverting),"aria-label":"Download archive of all generated files","data-testid":"header-download-outputs-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),o.jsx(vn,{onClick:A,disabled:!(e!=null&&e.configInput),"aria-label":"Share configuration","data-testid":"header-share-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"share"})})]}),r.pathname!=="/new"&&o.jsx(Ct,{onClick:v,"aria-label":e!=null&&e.showSettings?"Hide settings panel":"Show settings panel","data-testid":"settings-button",children:o.jsx("span",{className:"material-symbols-outlined",children:e!=null&&e.showSettings?"keyboard_alt":"settings"})})]})]})]})},wc=d.div`
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
`,yc=d.span`
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
`,kc=d.input`
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
`,_c=d.div`
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
`,vc=wt`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
`,jc=d.div`
  position: fixed;
  top: 45px;
  left: 0;
  right: 0;
  width: 100%;
  height: 3px;
  background-color: transparent;
  overflow: hidden;
  z-index: 1000;
`,$c=d.div`
  height: 100%;
  width: 25%;
  background-color: ${n.colors.accent};
  animation: ${vc} 1.5s ease-in-out infinite;
`,Cc=({visible:t,"data-testid":e})=>t?o.jsx(jc,{"data-testid":e,children:o.jsx($c,{})}):null,lt={info:{background:n.colors.info,text:n.colors.infoDark},warning:{background:n.colors.warning,text:n.colors.warningDark},error:{background:n.colors.error,text:n.colors.errorDark},success:{background:n.colors.success,text:n.colors.successDark}},dt=d.span.attrs({className:"material-symbols-outlined"})`
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
  color: ${({type:t})=>lt[t].text};
  background-color: ${({type:t})=>lt[t].background};
  border: 1px solid ${({type:t})=>lt[t].text};

  .material-symbols-outlined {
    color: ${({type:t})=>lt[t].text};
  }
`,Sc=d.div`
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
`,Ec=()=>{const t=ye();if(!t)return null;const{error:e,deprecationWarning:s,skippedWarning:r,info:i,clearError:a,clearWarning:l,clearSkippedWarning:p,clearInfo:m}=t;return o.jsxs(Sc,{"data-testid":"banners-container",children:[i&&o.jsxs(ft,{type:"info","data-testid":"info-banner",children:[o.jsxs(ut,{children:[o.jsx(dt,{children:"info"}),o.jsx(pt,{children:i})]}),o.jsx(ht,{onClick:m,"aria-label":"Close info message","data-testid":"close-info-banner",children:"×"})]}),s&&o.jsxs(ft,{type:"warning","data-testid":"warning-banner",children:[o.jsxs(ut,{children:[o.jsx(dt,{children:"warning"}),o.jsx(pt,{children:s})]}),o.jsx(ht,{onClick:l,"aria-label":"Close warning message","data-testid":"close-warning-banner",children:"×"})]}),r&&o.jsxs(ft,{type:"warning","data-testid":"skipped-injections-banner",children:[o.jsxs(ut,{children:[o.jsx(dt,{children:"warning"}),o.jsx(pt,{children:r})]}),o.jsx(ht,{onClick:p,"aria-label":"Close feature warning message","data-testid":"close-skipped-banner",children:"×"})]}),e&&o.jsxs(ft,{type:"error","data-testid":"error-banner",children:[o.jsxs(ut,{children:[o.jsx(dt,{children:"error"}),o.jsx(pt,{children:e})]}),o.jsx(ht,{onClick:a,"aria-label":"Close error message","data-testid":"close-error-banner",children:"×"})]})]})},Pc=()=>o.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-discord",viewBox:"0 0 16 16",children:o.jsx("path",{d:"M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"})}),Cn=({label:t,version:e,url:s,isCustom:r=!1,"data-testid":i,devBadgeTestId:a})=>{const l=()=>{window.open(s,"_blank","noopener,noreferrer")};return o.jsxs(Ic,{onClick:l,$hasDevBadge:r,"aria-label":`View ${t==="Ergogen"?"Ergogen":`Ergogen ${t}`} ${e} on GitHub`,"data-testid":i,children:[o.jsx(no,{}),o.jsxs(Lc,{children:[o.jsx(zc,{children:t}),o.jsx(Dc,{$isCustom:r,children:e})]}),r&&o.jsx(Ac,{"data-testid":a,children:o.jsx(Rc,{children:"DEV"})})]})},Ic=d.button`
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
`,Lc=d.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  line-height: 1.1;
  min-width: 0;
`,zc=d.span`
  font-size: 10px;
  font-weight: ${n.fontWeights.bold};
  color: ${n.colors.white};
  white-space: nowrap;
`,Dc=d.span`
  font-size: 8px;
  color: ${t=>t.$isCustom?n.colors.accent:n.colors.textDark};
  white-space: nowrap;
`,Ac=d.div`
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
`,Rc=d.span`
  font-size: 8px;
  font-weight: ${n.fontWeights.bold};
  color: ${n.colors.accent};
  transform: rotate(-90deg);
  white-space: nowrap;
  line-height: 1;
`,Nc=({isOpen:t,onClose:e,"data-testid":s})=>{const r=f.useRef(t),[i,a]=f.useState(t),[l,p]=f.useState(360),m=f.useRef(!1),c=f.useRef(0),h=f.useRef(360),b=ye(),g=io(),x=yt.version,{configs:k,activeConfigId:u,selectConfig:y,renameConfig:j,duplicateConfig:E,deleteConfig:L,setIsBulkDownloadOpen:S}=b||{},[$,D]=f.useState(""),[z,v]=f.useState(null),[w,P]=f.useState(""),A=f.useMemo(()=>{if(!k)return[];let O=k;if($.trim()){const V=$.toLowerCase().split(/\s+/).filter(Boolean);V.length>0&&(O=k.filter(_=>{const N=_.name.toLowerCase();return V.some(T=>N.includes(T))}))}return[...O].sort((V,_)=>{const N=V.updatedAt?new Date(V.updatedAt).getTime():0,T=_.updatedAt?new Date(_.updatedAt).getTime():0;if(N!==T)return T-N;const J=V.createdAt?new Date(V.createdAt).getTime():0,G=_.createdAt?new Date(_.createdAt).getTime():0;return J!==G?G-J:V.name.localeCompare(_.name)})},[k,$]),R=()=>{y&&y(null),g("/new"),e()},F=()=>{M("bulk_download_dialog_opened",{stored_configs_count:(k==null?void 0:k.length)||0}),S&&S(!0),e()},U=O=>{y&&(y(O),g("/"),e())},B=(O,V)=>{v(O),P(V)},Z=O=>{j&&w.trim()&&!j(O,w.trim())||v(null)},Y=O=>{E&&E(O)},ee=(O,V)=>{if(window.confirm(`Are you sure you want to delete "${V}"?`)&&L){L(O);const _=u===O,N=k&&k.length<=1;(_||N)&&(g("/new"),e())}};f.useEffect(()=>{const O=r.current;t&&!O?a(!0):!t&&O&&a(!1),t||v(null),r.current=t},[t]),f.useEffect(()=>{if(!$.trim())return;const O=setTimeout(()=>{M("search_performed",{query_length:$.trim().length})},1e3);return()=>clearTimeout(O)},[$]),f.useEffect(()=>{const O=T=>{if(!m.current)return;const J=T.clientX-c.current,G=h.current+J,re=Math.min(600,window.innerWidth*.9),te=Math.max(360,Math.min(G,re));p(te)},V=()=>{m.current&&(m.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},_=T=>{if(!m.current)return;T.preventDefault();const G=T.touches[0].clientX-c.current,re=h.current+G,te=Math.min(600,window.innerWidth*.9),We=Math.max(360,Math.min(re,te));p(We)},N=()=>{m.current&&(m.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",O),window.addEventListener("mouseup",V),window.addEventListener("touchmove",_,{passive:!1}),window.addEventListener("touchend",N),()=>{window.removeEventListener("mousemove",O),window.removeEventListener("mouseup",V),window.removeEventListener("touchmove",_),window.removeEventListener("touchend",N)}},[]);const X=O=>{O.preventDefault(),O.stopPropagation(),m.current=!0,h.current=l,"touches"in O?c.current=O.touches[0].clientX:c.current=O.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};f.useEffect(()=>{if(!t)return;const O=V=>{V.key==="Escape"&&e()};return window.addEventListener("keydown",O),()=>{window.removeEventListener("keydown",O)}},[t,e]);const H=f.useMemo(()=>kt("github:ceoloide/ergogen#v4.3.0"),[]);return f.useEffect(()=>(t?document.body.style.overflow="hidden":document.body.style.overflow="",()=>{document.body.style.overflow=""}),[t]),o.jsxs(o.Fragment,{children:[o.jsx(Uc,{"data-testid":s,onClick:e,$isOpen:t,$isOpening:i}),o.jsxs(Wc,{"data-testid":s&&`${s}-panel`,$isOpen:t,$isOpening:i,$width:l,onClick:O=>O.stopPropagation(),children:[o.jsx(ll,{onMouseDown:X,onTouchStart:X,"data-testid":s&&`${s}-resize-handle`}),o.jsxs(Oc,{children:[o.jsxs(Fc,{children:[o.jsx(Bc,{to:"/",onClick:e,"aria-label":"Go to home page","data-testid":"side-nav-logo-button",children:o.jsx(Mc,{src:"/ergogen.png",alt:"Ergogen logo"})}),o.jsxs(Tc,{onClick:e,children:["Ergogen",H.isCustom&&o.jsx(ur,{versionInfo:H,"data-testid":"sidebar-dev-chip"})]})]}),o.jsx(Gc,{onClick:e,"data-testid":s&&`${s}-close`,"aria-label":"Close navigation panel",children:o.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),o.jsxs(Hc,{children:[o.jsxs(Vc,{children:[o.jsxs(Jc,{onClick:R,"aria-label":"New","data-testid":"side-nav-new-config-button",children:[o.jsx("span",{className:"material-symbols-outlined",children:"add"}),o.jsx("span",{children:"New"})]}),k&&k.length>0&&o.jsxs(Kc,{onClick:F,"aria-label":"Download All","data-testid":"side-nav-download-all-button",children:[o.jsx("span",{className:"material-symbols-outlined",children:"download"}),o.jsx("span",{children:"Download All"})]})]}),o.jsxs(qc,{children:[o.jsx("span",{className:"material-symbols-outlined search-icon",children:"search"}),o.jsx(Yc,{type:"text",placeholder:"Search configurations...",value:$,onChange:O=>D(O.target.value),"aria-label":"Search configurations"}),$&&o.jsx(Xc,{onClick:()=>D(""),children:o.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),o.jsxs(Zc,{children:[o.jsx("span",{children:"Saved Configurations"}),o.jsx(Qc,{children:A.length})]}),o.jsxs(el,{children:[A.map(O=>{const V=O.id===u,_=z===O.id;return o.jsx(tl,{$isActive:V,"data-testid":`config-item-${O.id}`,children:_?o.jsxs(rl,{onSubmit:N=>{N.preventDefault(),Z(O.id)},children:[o.jsx(il,{type:"text",value:w,onChange:N=>P(N.target.value),autoFocus:!0,"aria-label":"Rename input"}),o.jsx(Sn,{type:"submit","aria-label":"Save name",children:o.jsx("span",{className:"material-symbols-outlined",children:"check"})}),o.jsx(Sn,{type:"button",onClick:()=>v(null),"aria-label":"Cancel rename",children:o.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}):o.jsxs(o.Fragment,{children:[o.jsxs(ol,{onClick:()=>U(O.id),$isActive:V,title:O.name,children:[o.jsx("span",{className:"material-symbols-outlined",children:"description"}),o.jsx("span",{className:"config-title-text",children:O.name})]}),o.jsxs(nl,{$isActive:V,children:[o.jsx(Gt,{onClick:()=>B(O.id,O.name),"aria-label":`Rename configuration ${O.name}`,children:o.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),o.jsx(Gt,{onClick:()=>Y(O.id),"aria-label":`Duplicate configuration ${O.name}`,children:o.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),o.jsx(Gt,{onClick:()=>ee(O.id,O.name),"aria-label":`Delete configuration ${O.name}`,children:o.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})},O.id)}),A.length===0&&o.jsx(sl,{children:"No configurations found"})]})]}),o.jsx(al,{children:o.jsxs(cl,{children:[o.jsxs(En,{onClick:()=>{window.open("https://docs.ergogen.xyz/","_blank","noopener,noreferrer")},"aria-label":"Open documentation","data-testid":"side-nav-docs-button",children:[o.jsx("span",{className:"material-symbols-outlined",children:"description"}),o.jsx("span",{children:"Docs"})]}),o.jsx(En,{onClick:()=>{window.open("https://discord.ergogen.xyz","_blank","noopener,noreferrer")},"aria-label":"Join the Discord community","data-testid":"side-nav-discord-button",children:o.jsx(Pc,{})}),o.jsx(Cn,{label:"Web UI",version:x,url:"https://github.com/ceoloide/ergogen-gui","data-testid":"side-nav-gui-version-button"}),o.jsx(Cn,{label:"Ergogen",version:H.displayText,url:H.url,isCustom:H.isCustom,"data-testid":"side-nav-ergogen-version-button",devBadgeTestId:"side-nav-ergogen-dev-badge"})]})})]})]})},Uc=d.div`
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
`,Wc=d.div`
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
`,Oc=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 3em;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
`,Fc=d.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`,Bc=d(Bn)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,Mc=d.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,Tc=d.div`
  font-size: ${n.fontSizes.base};
  font-weight: ${n.fontWeights.semiBold};
  color: ${n.colors.white};
  cursor: pointer;
  display: flex;
  align-items: center;
`,Gc=d.button`
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
`,Hc=d.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`,Vc=d.div`
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
  flex-shrink: 0;
`,Jc=d.button`
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
`,Kc=d.button`
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
`,qc=d.div`
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
`,Yc=d.input`
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
`,Xc=d.button`
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
`,Zc=d.div`
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
`,Qc=d.span`
  background-color: ${n.colors.border};
  color: ${n.colors.white};
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: ${n.fontWeights.semiBold};
`,el=d.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  flex: 1;
`,tl=d.div`
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
`,ol=d.button`
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
`,nl=d.div.attrs({className:"item-actions-hover"})`
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
`,rl=d.form`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 100%;
`,il=d.input`
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
`,sl=d.div`
  text-align: center;
  color: ${n.colors.textDark};
  font-size: ${n.fontSizes.bodySmall};
  margin-top: 2rem;
  font-style: italic;
`,al=d.div`
  padding: 8px 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`,cl=d.div`
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
`,ll=d.div`
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
`,dl=({isOpen:t,configs:e,injections:s,debug:r,stlPreview:i,onClose:a,"data-testid":l})=>{const[p,m]=f.useState(new Set),[c,h]=f.useState(!0),[b,g]=f.useState(!1),[x,k]=f.useState(0),[u,y]=f.useState(""),j=f.useRef(!1);if(f.useEffect(()=>{t&&(m(new Set(e.map(z=>z.id))),g(!1),k(0),y(""),j.current=!1)},[t,e]),!t)return null;const E=z=>{m(z?new Set(e.map(v=>v.id)):new Set)},L=(z,v)=>{const w=new Set(p);v?w.add(z):w.delete(z),m(w)},S=async()=>{if(p.size===0)return;g(!0),k(0),y(""),j.current=!1;const z=e.filter(v=>p.has(v.id));M("bulk_download_started",{selected_configs_count:p.size,only_configs:c});try{const v=await Ei(z,s,r,i,c,(w,P,A)=>{k(w),y(A)},()=>j.current);j.current||(v&&v.succeededCount===0&&v.failedCount>0?M("bulk_download_failed",{selected_configs_count:p.size,failed_configs_count:v.failedCount,only_configs:c,error_message:`All ${v.failedCount} selected configuration(s) failed to compile`}):v&&v.failedCount>0?M("bulk_download_partial",{selected_configs_count:p.size,failed_configs_count:v.failedCount,only_configs:c}):M("bulk_download_completed",{selected_configs_count:p.size,only_configs:c}))}catch(v){console.error("Error during bulk download:",v),M("bulk_download_failed",{selected_configs_count:p.size,only_configs:c,error_message:v instanceof Error?v.message:String(v)})}finally{j.current||a()}},$=()=>{b&&!j.current&&M("bulk_download_cancelled",{selected_configs_count:p.size,completed_configs_count:x,only_configs:c}),j.current=!0,a()},D=p.size>0?x/p.size*100:0;return o.jsx(ul,{"data-testid":l,children:o.jsxs(pl,{"data-testid":l&&`${l}-box`,children:[o.jsx(fl,{children:"Download Configurations"}),b?o.jsxs(o.Fragment,{children:[o.jsxs(Sl,{children:[o.jsx(El,{children:o.jsx(Pl,{style:{width:`${D}%`}})}),o.jsxs(Il,{children:[o.jsx(Ll,{children:u?u.includes(", ")?o.jsxs("div",{children:["Generating:",o.jsx(zl,{children:u.split(", ").map(z=>o.jsx("li",{children:z},z))})]}):o.jsxs(Ln,{children:["Generating ",u]}):o.jsx(Ln,{children:"Preparing..."})}),o.jsxs(Dl,{children:[x," / ",p.size]})]})]}),o.jsx(In,{children:o.jsx(Al,{onClick:$,size:"medium",children:"Cancel"})})]}):o.jsxs(o.Fragment,{children:[o.jsx(gl,{children:e.map(z=>{const v=p.has(z.id);return o.jsx(ml,{children:o.jsxs(pr,{htmlFor:`bulk-check-${z.id}`,children:[o.jsx(xl,{id:`bulk-check-${z.id}`,checked:v,onChange:w=>L(z.id,w.target.checked)}),o.jsx(wl,{$checked:v}),o.jsx(bl,{children:z.name})]})},z.id)})}),o.jsxs(hl,{children:[o.jsx(Pn,{onClick:()=>E(!0),children:"Select All"}),o.jsx(Pn,{onClick:()=>E(!1),children:"Deselect All"})]}),o.jsxs(yl,{children:[o.jsx(kl,{children:"Only download configs"}),o.jsxs(_l,{$checked:c,htmlFor:"only-configs-switch",children:[o.jsx(vl,{type:"checkbox",id:"only-configs-switch",checked:c,onChange:z=>h(z.target.checked)}),o.jsx(jl,{$checked:c}),o.jsx($l,{$checked:c})]})]}),!c&&o.jsxs(Cl,{children:[o.jsx("span",{className:"material-symbols-outlined",children:"warning"}),o.jsx("span",{children:"Warning: Exporting generated outputs for multiple configurations may take a long time depending on the number of selected configurations, their complexity, and CPU speed."})]}),o.jsxs(In,{children:[o.jsx(fr,{onClick:$,size:"medium",children:"Cancel"}),o.jsxs(de,{onClick:S,disabled:p.size===0,size:"medium",children:["Download (",p.size,")"]})]})]})]})})},ul=d.div`
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
`,pl=d.div`
  background-color: ${n.colors.backgroundLight};
  border: 1px solid ${n.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,fl=d.h2`
  margin: 0 0 1rem 0;
  font-size: ${n.fontSizes.h3};
  color: ${n.colors.text};
`,hl=d.div`
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
`,gl=d.div`
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
`,ml=d.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,bl=d.span`
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
`,xl=d.input.attrs({type:"checkbox"})`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`,wl=d.div`
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
`,yl=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
`,kl=d.span`
  color: ${n.colors.text};
  font-size: ${n.fontSizes.base};
  user-select: none;
`,_l=d.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: pointer;
`,vl=d.input`
  opacity: 0;
  width: 0;
  height: 0;
`,jl=d.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${t=>t.$checked?n.colors.accent:n.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`,$l=d.span`
  position: absolute;
  top: 2px;
  left: ${t=>t.$checked?"18px":"2px"};
  width: 16px;
  height: 16px;
  background-color: ${n.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,Cl=d.div`
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
`,Sl=d.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`,El=d.div`
  background-color: ${n.colors.border};
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  width: 100%;
`,Pl=d.div`
  background-color: ${n.colors.accent};
  height: 100%;
  transition: width 0.15s ease-out;
`,Il=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`,Ll=d.div`
  color: ${n.colors.text};
  max-width: 80%;
`,Ln=d.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,zl=d.ul`
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
`,Dl=d.span`
  color: ${n.colors.textDark};
  font-weight: ${n.fontWeights.semiBold};
`,fr=d(de)`
  background-color: ${n.colors.backgroundLighter};
  color: ${n.colors.textDark};

  &:hover {
    background-color: ${n.colors.buttonHover};
  }
`,Al=d(fr)`
  width: 100%;
`;function Rl(){return!!(window.location.hostname==="localhost"||window.location.hostname==="[::1]"||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))}function Nl(t,e,s){t.addEventListener("statechange",()=>{var r,i;t.state==="installed"&&(navigator.serviceWorker.controller?(console.log("[SW] New content is available. Will be used when all existing tabs are closed or you reload."),(r=s==null?void 0:s.onUpdate)==null||r.call(s,e)):(console.log("[SW] Content is cached for offline use."),(i=s==null?void 0:s.onSuccess)==null||i.call(s,e)))})}async function hr(t,e){try{const s=await navigator.serviceWorker.register(t);s.addEventListener("updatefound",()=>{const r=s.installing;r!==null&&Nl(r,s,e)})}catch(s){console.error("[SW] Error during service worker registration:",s)}}async function Ul(t,e){try{const s=await fetch(t,{headers:{"Service-Worker":"script"}}),r=s.headers.get("content-type");s.status===404||r!==null&&r.indexOf("javascript")===-1?(await(await navigator.serviceWorker.ready).unregister(),window.location.reload()):await hr(t,e)}catch{console.log("[SW] No internet connection found. App is running in offline mode.")}}function Wl(t){!("serviceWorker"in navigator)||new URL("/",window.location.href).origin!==window.location.origin||window.addEventListener("load",()=>{const s="/service-worker.js";Rl()?(Ul(s,t),navigator.serviceWorker.ready.then(()=>{console.log("[SW] This web app is being served cache-first by a service worker. See https://cra.link/PWA for more details.")})):hr(s,t)})}const Ol=({report:t,onAccept:e,onCancel:s,"data-testid":r})=>o.jsx(Fl,{"data-testid":r,children:o.jsxs(Bl,{"data-testid":r&&`${r}-box`,children:[o.jsx(Ml,{children:"Version Compatibility Warning"}),o.jsx(Tl,{children:"The shared link was created under a different environment. You may experience compatibility issues."}),o.jsxs(Gl,{children:[t.guiWarning&&o.jsxs(Ht,{"data-testid":r&&`${r}-gui-warning`,children:[o.jsxs(Vt,{children:["GUI Version Mismatch",o.jsx(Jt,{"data-testid":"gui-mismatch-badge",children:"Mismatch"})]}),o.jsxs(Kt,{children:["The shared link was created with a newer version of the GUI (",o.jsxs("strong",{children:["v",t.guiWarning.shared]}),") than your current version (",o.jsxs("strong",{children:["v",t.guiWarning.current]}),"). Some interface options or features may not function as expected."]})]}),t.ergogenWarning&&o.jsxs(Ht,{"data-testid":r&&`${r}-ergogen-warning`,children:[o.jsxs(Vt,{children:["Ergogen Version Mismatch",o.jsx(Jt,{"data-testid":"ergogen-mismatch-badge",children:"Mismatch"})]}),o.jsxs(Kt,{children:["The shared link was created with a newer version of Ergogen (",o.jsx("strong",{children:t.ergogenWarning.shared}),") than your current version (",o.jsx("strong",{children:t.ergogenWarning.current}),"). Some features or syntax might not be supported."]})]}),t.customErgogenWarning&&o.jsxs(Ht,{"data-testid":r&&`${r}-custom-ergogen-warning`,children:[o.jsxs(Vt,{children:["Custom Ergogen Version Used",o.jsx(Jt,{"data-testid":"custom-version-badge",children:"Custom"})]}),o.jsxs(Kt,{children:["The shared link was created using a custom version of Ergogen:"," ",o.jsx("strong",{children:t.customErgogenWarning.shared}),".",o.jsx("br",{}),"You can investigate the repository used here:",o.jsx("br",{}),o.jsx(Hl,{href:t.customErgogenWarning.url,target:"_blank",rel:"noopener noreferrer","data-testid":r&&`${r}-custom-repo-link`,children:t.customErgogenWarning.label})]})]})]}),o.jsxs(Vl,{children:[o.jsx(Kl,{onClick:s,size:"medium","data-testid":r&&`${r}-cancel`,"aria-label":"Cancel configuration loading",children:"Cancel"}),o.jsx(Jl,{onClick:e,size:"medium","data-testid":r&&`${r}-accept`,"aria-label":"Accept and load configuration",children:"Accept and Load"})]})]})}),Fl=d.div`
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
`,Bl=d.div`
  background-color: ${n.colors.backgroundLight};
  border: 1px solid ${n.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 550px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,Ml=d.h2`
  margin: 0 0 0.5rem 0;
  font-size: ${n.fontSizes.h3};
  color: ${n.colors.error};
`,Tl=d.p`
  margin: 0 0 1.5rem 0;
  font-size: ${n.fontSizes.base};
  color: ${n.colors.textDarker};
  line-height: 1.4;
`,Gl=d.div`
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
`,Hl=d.a`
  display: inline-block;
  margin-top: 0.5rem;
  color: ${n.colors.accent};
  text-decoration: underline;
  word-break: break-all;

  &:hover {
    color: ${n.colors.accentSecondary};
  }
`,Vl=d.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`,Jl=d(de)`
  background-color: ${n.colors.accent};
  color: ${n.colors.white};

  &:hover {
    background-color: ${n.colors.accentDark};
  }
`,Kl=d(de)`
  background-color: ${n.colors.backgroundLighter};
  color: ${n.colors.textDark};

  &:hover {
    background-color: ${n.colors.buttonHover};
  }
`;let zn=null,Dn=!1;const ql=()=>{Dn||(zn=cr(),Dn=!0);const t=zn,e=[];let s=null;const r=f.useRef(null);if(t)if(t.success){const l=t.config;r.current===null&&(r.current={config:l.config,injections:l.injections,guiVersion:l.guiVersion,ergogenVersion:l.ergogenVersion}),window.history.replaceState(null,"",window.location.pathname+window.location.search)}else s=t.message,console.error("[App] Failed to load shared configuration from hash",{error:t.error,message:t.message,hashLength:window.location.hash.length}),window.history.replaceState(null,"",window.location.pathname+window.location.search);const[i,a]=f.useState(null);return f.useEffect(()=>{r.current&&a(r.current)},[]),o.jsx(Ni,{initialInjectionInput:e,hashError:s,children:o.jsx(Zl,{pendingSharedConfig:i})})};function Yl(){const[t,e]=f.useState(null),s=new URLSearchParams(window.location.search).has("force_update");if(f.useEffect(()=>{Wl({onUpdate:r=>{e(r)}})},[]),s)return()=>{console.log("[SW] Force-update triggered via ?force_update URL parameter."),window.location.reload()};if(t)return()=>{let r;if("serviceWorker"in navigator){let a=!1;navigator.serviceWorker.addEventListener("controllerchange",()=>{a||(a=!0,r&&clearTimeout(r),window.location.reload())})}const i=t.waiting;i?(i.postMessage({type:"SKIP_WAITING"}),r=setTimeout(()=>{window.location.reload()},1e3)):window.location.reload()}}function Xl(){const[t,e]=f.useState(null),[s,r]=f.useState(!1),[i,a]=f.useState(!1),l=new URLSearchParams(window.location.search).has("force_install");return f.useEffect(()=>{(()=>{const g=typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches,x=window.navigator.standalone===!0;a(g||x)})();const h=g=>{g.preventDefault(),e(g),console.log("[PWA] beforeinstallprompt event fired and captured.")},b=()=>{console.log("[PWA] appinstalled event fired."),a(!0),r(!1)};return window.addEventListener("beforeinstallprompt",h),window.addEventListener("appinstalled",b),()=>{window.removeEventListener("beforeinstallprompt",h),window.removeEventListener("appinstalled",b)}},[]),{onInstall:()=>{M("pwa_install_click"),r(!0),t?(t.prompt(),t.userChoice.then(c=>{c.outcome==="accepted"?(console.log("[PWA] User accepted the install prompt"),M("pwa_install_accepted"),a(!0)):(console.log("[PWA] User dismissed the install prompt"),M("pwa_install_dismissed")),r(!1),e(null)})):(console.log("[PWA] Install prompt triggered (deferredPrompt is not available on this device/browser)"),alert('PWA installation is not supported by this browser or is restricted on this device. If you are on iOS/iPadOS, please open this site in Safari and select "Add to Home Screen" from the Share menu.'),r(!1))},isAvailable:!!t||l,isInstalled:i,isInstalling:s}}const Zl=({pendingSharedConfig:t})=>{var L;const e=ye(),s=e==null?void 0:e.configInput,r=Fn(),i=Yl(),a=Xl(),l=f.useRef(0);l.current=((L=e==null?void 0:e.configs)==null?void 0:L.length)||0,f.useEffect(()=>{M("page_view",{page_path:r.pathname,stored_configs_count:l.current})},[r.pathname]);const p=f.useRef(!1),m=f.useRef(t);t!==m.current&&(m.current=t);const{currentConflict:c,processInjectionsWithConflictResolution:h,handleConflictResolution:b,handleConflictCancel:g}=$t({setInjectionInput:S=>e==null?void 0:e.setInjectionInput(S),setConfigInput:S=>e==null?void 0:e.loadPreview(S),generateNow:async(S,$,D)=>{e&&await e.generateNow(S,$,D)},getCurrentInjections:()=>(e==null?void 0:e.injectionInput)||[],onComplete:async(S,$)=>{localStorage.setItem("ergogen:injection",JSON.stringify($)),e==null||e.loadPreview(S)},setError:S=>e==null?void 0:e.setError(S)}),[x,k]=f.useState(null),u=(S,$)=>{const D=yt.version,z=ao("github:ceoloide/ergogen#v4.3.0");let v=!0,w,P,A;if(S){const R=Ee(D),F=Ee(S);R&&F&&!qt(R,F)&&(v=!1,w={current:D,shared:S})}if($){if(Lr($)&&$!==z){v=!1;const U=kt($);A={shared:$,url:U.url,label:U.label}}const R=Yo(z)||Ne.version,F=Yo($);if(F){const U=Ee(R),B=Ee(F);U&&B&&!qt(U,B)&&(v=!1,P={current:R,shared:F})}}return{isCompatible:v,guiWarning:w,ergogenWarning:P,customErgogenWarning:A}},y=f.useCallback((S,$)=>{e&&($!==void 0&&$.length>0?h($,S).catch(D=>{console.error("[App] Error processing injections:",D),e.setError(`Failed to process injections: ${D instanceof Error?D.message:"Unknown error"}`)}):(e.loadPreview(S),e.generateNow(S,e.injectionInput,{pointsonly:!1})))},[e,h]),j=()=>{var S;x&&(M("shared_config_accepted",{has_injections:!!(x.injections&&x.injections.length>0),injections_count:((S=x.injections)==null?void 0:S.length)||0}),y(x.config,x.injections),k(null))},E=()=>{var S;x&&M("shared_config_declined",{has_injections:!!(x.injections&&x.injections.length>0),injections_count:((S=x.injections)==null?void 0:S.length)||0}),k(null)};return f.useEffect(()=>{if(!e||!t||p.current)return;p.current=!0;const S=u(t.guiVersion,t.ergogenVersion);S.isCompatible?y(t.config,t.injections):k({config:t.config,injections:t.injections,report:S})},[e,t,y]),f.useEffect(()=>{if(!e)return;const S=()=>{const $=cr();if($)if($.success){const D=$.config,z=u(D.guiVersion,D.ergogenVersion);z.isCompatible?y(D.config,D.injections):k({config:D.config,injections:D.injections,report:z}),window.history.replaceState(null,"",window.location.pathname+window.location.search)}else console.error("[App] Failed to load shared configuration from hash (hashchange)",{error:$.error,message:$.message,hashLength:window.location.hash.length}),e.setError($.message),window.history.replaceState(null,"",window.location.pathname+window.location.search)};return window.addEventListener("hashchange",S),()=>{window.removeEventListener("hashchange",S)}},[e,y]),o.jsxs(o.Fragment,{children:[x&&o.jsx(Ol,{report:x.report,onAccept:j,onCancel:E,"data-testid":"share-compatibility-dialog"}),c&&o.jsx(jt,{injectionName:c.name,injectionType:c.type,onResolve:b,onCancel:g,"data-testid":"conflict-dialog"}),(e==null?void 0:e.isBulkDownloadOpen)&&o.jsx(dl,{isOpen:e.isBulkDownloadOpen,configs:e.configs,injections:e.injectionInput,debug:e.debug,stlPreview:e.stlPreview,onClose:()=>e.setIsBulkDownloadOpen(!1),"data-testid":"bulk-download-dialog"}),o.jsx(xc,{onUpdate:i}),o.jsx(Cc,{visible:(e==null?void 0:e.isGenerating)??!1,"data-testid":"loading-bar"}),o.jsx(Ec,{}),o.jsx(Nc,{isOpen:(e==null?void 0:e.showSideNav)??!1,onClose:()=>e==null?void 0:e.setShowSideNav(!1),"data-testid":"side-navigation"}),o.jsx(Ql,{children:o.jsxs(Cr,{children:[o.jsx(zt,{path:"/",element:s?o.jsx(fa,{pwaState:a}):o.jsx(qo,{to:{pathname:"/new",search:r.search},replace:!0})}),o.jsx(zt,{path:"/new",element:o.jsx(Xa,{})}),o.jsx(zt,{path:"*",element:o.jsx(qo,{to:"/",replace:!0})})]})})]})},Ql=d.div`
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
`;Mn.config({paths:{vs:"/monaco/vs"}});Mn.init().then(t=>{ed(t);const e=document.getElementById("root");Er(e).render(o.jsx(On.StrictMode,{children:o.jsx(Pr,{basename:("/".startsWith("."),"/"),children:o.jsxs(td,{children:[o.jsx(od,{}),o.jsx(ql,{})]})})}))});export{Ve as a,n as t};
