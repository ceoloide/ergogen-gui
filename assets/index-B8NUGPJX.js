const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/PcbPreview-BI1R2Mfv.js","assets/vendor-DNe9Y6n2.js","assets/StlPreview-1nxo5Cih.js","assets/three-Dk8hj5rH.js","assets/js-yaml-DW8Bub87.js","assets/jszip-CyTxqeGV.js"])))=>i.map(i=>d[i]);
import{f as Ke,y as u,j as n,r as p,h as eo,i as Go,k as Vo,O as bt,p as Ho,l as Ar,m as Nr,n as Ko,o as qo,q as Ur,t as Wr,v as an,w as Jo,L as Xo,x as Or,z as Pt,N as to,A as Fr,B as Yo,e as Mr,C as Br}from"./vendor-DNe9Y6n2.js";import{j as fe}from"./js-yaml-DW8Bub87.js";import{J as ln}from"./jszip-CyTxqeGV.js";import{_ as Zo}from"./three-Dk8hj5rH.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function i(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(s){if(s.ep)return;s.ep=!0;const a=i(s);fetch(s.href,a)}})();const cn=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/ergogen.worker-yOrnwBol.js",import.meta.url),{type:"module"})}catch(e){return console.error("Failed to create worker:",e),null}},Qo=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/jscad.worker-C8nLBdOi.js",import.meta.url),{type:"module"})}catch(e){return console.error("Failed to create JSCAD worker:",e),null}},Tr="0.19.3",wt={version:Tr},dn=e=>{const t=`v${Ke.version}`,i=Ke.version,o=Ke.repository,s=o.startsWith("github:")?o.replace("github:","https://github.com/"):o.replace(/^git\+/,"").replace(/\.git$/,"");if(!e)return{label:t,url:s,displayText:i,isCustom:!1,isHash:!1,isTag:!1};if(e.includes("@")){const j=e.split("@"),x=j[1]||e;return{label:e,url:e.startsWith("ergogen@")?`${s}/releases/tag/v${x}`:`https://www.npmjs.com/package/${j[0]}`,displayText:x,isCustom:!0,isHash:!1,isTag:!0}}const a=e.startsWith("github:")?e.slice(7):e,[l,d]=a.split("#"),h=l==="ergogen/ergogen",c=`https://github.com/${l}`;if(h){if(!d)return{label:"latest",url:c,displayText:i,isCustom:!1,isHash:!1,isTag:!1};const j=d.length===40&&/^[0-9a-fA-F]{40}$/.test(d),x=j?t:d,f=j?`${c}/commit/${d}`:`${c}/tree/${d}`;return{label:d,url:f,displayText:x,isCustom:!0,isHash:j,isTag:!j}}if(!d)return{label:a,url:c,displayText:i,isCustom:!0,isHash:!1,isTag:!1};const g=d.length===40&&/^[0-9a-fA-F]{40}$/.test(d),b=g?t:d,m=g?`${c}/commit/${d}`:`${c}/tree/${d}`;return{label:a,url:m,displayText:b,isCustom:!0,isHash:g,isTag:!g}},un=e=>{if(e.includes("@")){const s=e.split("@"),a=s[1]||e,l=s[0];return`github:${l==="ergogen"?"ergogen/ergogen":l}#v${a}`}const t=e.startsWith("github:")?e.slice(7):e,[i,o]=t.split("#");return o?`github:${i}#${o}`:`github:${i}#v${Ke.version}`},Ue=e=>{const i=e.replace(/^v/,"").match(/^(\d+)\.(\d+)\.(\d+)/);return i?[Number(i[1]),Number(i[2]),Number(i[3])]:null},Kt=(e,t)=>{for(let i=0;i<3;i++){if(e[i]>t[i])return!0;if(e[i]<t[i])return!1}return!0},no=e=>{const t=e.match(/(?:^|#|@|v)(\d+\.\d+\.\d+)/);return t?t[1]:null},Gr=e=>{const t=e.startsWith("github:")?e.slice(7):e,[i]=t.split("#");return!e.startsWith("github:")&&!e.includes("/")?!1:i!=="ergogen/ergogen"},er=()=>{if(typeof window>"u")return!1;const e=window.navigator;return typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches||e.standalone===!0},tr=e=>{if(typeof window>"u")return!0;if(window.__FORCE_ANALYTICS__===!0||e.startsWith("G-TEST"))return!1;const t=window.location.hostname;return!!(t==="localhost"||t==="127.0.0.1"||t==="[::1]"||t.endsWith(".localhost"))},Vr=()=>{if(typeof document>"u"||!document.cookie)return;const e=document.cookie.split(";");for(const t of e){const i=t.indexOf("="),o=(i>-1?t.substring(0,i):t).trim();if(o.startsWith("_ga")){document.cookie=`${o}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`;const a=window.location.hostname.split(".");for(;a.length>0;){const l=a.join(".");document.cookie=`${o}=; Path=/; Domain=.${l}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`,document.cookie=`${o}=; Path=/; Domain=${l}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`,a.shift()}}}},Hr=()=>{if(!(typeof indexedDB>"u"))try{indexedDB.deleteDatabase("workbox-background-sync")}catch{}},nr=()=>typeof window>"u"||!window.location?void 0:`${window.location.origin&&window.location.origin!=="null"?window.location.origin:`${window.location.protocol||"https:"}//${window.location.hostname||"localhost"}`}${window.location.pathname||"/"}`,or="ergogen:consent:sendUsageMetrics",Kr="ergogen:config:sendUsageMetrics",qr="ergogen:settings";let ft;const oo=e=>{const t=localStorage.getItem(e);if(t!==null)try{const i=JSON.parse(t);return typeof i=="boolean"?i:void 0}catch{return}},Jr=()=>{const e=localStorage.getItem(qr);if(e!==null)try{const t=JSON.parse(e);return t&&typeof t=="object"&&typeof t.sendUsageMetrics=="boolean"?t.sendUsageMetrics:void 0}catch{return}},xt=()=>{if(typeof window>"u")return!1;if(ft!==void 0)return ft;try{const e=oo(or);if(e!==void 0)return e;if(oo(Kr)===!1||Jr()===!1)return!1}catch{return!1}return!er()},Xr=e=>{try{localStorage.setItem(or,JSON.stringify(e)),ft=void 0}catch{ft=e}};let Ge=!1;const rr=()=>{var s;if(typeof window>"u")return;const e=xt(),t="G-46F2L343EK",i=tr(t),o=document.getElementById("gtag-script");if(o||(Ge=!1),e&&t&&!i){delete window["ga-disable-"+t];const a=window,l={send_page_view:!1,allow_google_signals:!1,allow_ad_personalization_signals:!1},d=()=>{var h;return(h=a.gtag)==null?void 0:h.call(a,"set",{page_location:nr()})};if(o)Ge&&(d(),(s=a.gtag)==null||s.call(a,"config",t,l),Ge=!1);else{const h=document.createElement("script");h.async=!0,h.src=`https://www.googletagmanager.com/gtag/js?id=${t}`,h.id="gtag-script",document.head.appendChild(h);const c=a.dataLayer||[];a.dataLayer=c,a.gtag=function(){c.push(arguments)},a.gtag("js",new Date),d(),a.gtag("config",t,l),Ge=!1}ri()}else window["ga-disable-"+t]=!0,o&&(Ge=!0),Vr(),Hr(),ii()},Yr=new Set(["yaml","yml","json","zip","ekb"]),Zr=e=>{const t=e.lastIndexOf("."),i=t>=0?e.slice(t+1).toLowerCase():"";return Yr.has(i)?i:"other"},ir=100,Qr=/"[^"\n]*"|'[^'\n]*'|`[^`\n]*`/g,ei=/^at\s|^[^\s@]*@\S+:\d+:\d+$/,ti=e=>e.split(`
`)[0].replace(Qr,t=>`${t[0]}*${t[0]}`).trim().slice(0,ir),ni=e=>{const t=e.split(`
`).map(i=>i.trim()).filter(i=>ei.test(i));return t.length>0?t.join(" ").slice(0,ir):void 0},oi=e=>{const t={...e};for(const i of["error_message","description"]){const o=t[i];typeof o=="string"&&(t[i]=ti(o))}return typeof t.error_stack=="string"&&(t.error_stack=ni(t.error_stack)),t},F=(e,t)=>{if(xt()&&!tr("G-46F2L343EK")&&window.gtag){const o=nr();window.gtag("set",{page_location:o}),window.gtag("event",e,{page_location:o,gui_version:wt.version,ergogen_version:un("github:ceoloide/ergogen#v4.3.0"),is_pwa:er(),...oi(t??{})})}},ht=(e,t=!1,i)=>{const o=e instanceof Error?e.message:e,s=e instanceof Error?e.stack:void 0;F("exception",{description:i?`[${i}] ${o}`:o,fatal:t,error_stack:s})};let gt=!1;const sr=e=>{ht(e.error||e.message,!1,"unhandled_error")},ar=e=>{ht(e.reason||"Unhandled Promise Rejection",!1,"unhandled_rejection")},ri=()=>{typeof window>"u"||gt||(window.addEventListener("error",sr),window.addEventListener("unhandledrejection",ar),gt=!0)},ii=()=>{typeof window>"u"||gt&&(window.removeEventListener("error",sr),window.removeEventListener("unhandledrejection",ar),gt=!1)};function si(e){function t(c,g){return c>>>g|c<<32-g}const i=[],o=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],s=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],a=unescape(encodeURIComponent(e));for(let c=0;c<a.length;c++){const g=a.charCodeAt(c);i[c>>2]|=g<<24-c%4*8}const l=a.length;i[l>>2]|=128<<24-l%4*8;const d=(l+8>>6)+1;i[d*16-1]=l*8;for(let c=0;c<d;c++){const g=[];for(let E=0;E<16;E++)g[E]=i[c*16+E]||0;for(let E=16;E<64;E++){const I=t(g[E-15],7)^t(g[E-15],18)^g[E-15]>>>3,S=t(g[E-2],17)^t(g[E-2],19)^g[E-2]>>>10;g[E]=g[E-16]+I+g[E-7]+S|0}let b=o[0],m=o[1],j=o[2],x=o[3],f=o[4],w=o[5],k=o[6],L=o[7];for(let E=0;E<64;E++){const I=t(f,6)^t(f,11)^t(f,25),S=f&w^~f&k,U=L+I+S+s[E]+g[E]|0,A=t(b,2)^t(b,13)^t(b,22),R=b&m^b&j^m&j,M=A+R|0;L=k,k=w,w=f,f=x+U|0,x=j,j=m,m=b,b=U+M|0}o[0]=o[0]+b|0,o[1]=o[1]+m|0,o[2]=o[2]+j|0,o[3]=o[3]+x|0,o[4]=o[4]+f|0,o[5]=o[5]+w|0,o[6]=o[6]+k|0,o[7]=o[7]+L|0}let h="";for(let c=0;c<8;c++){const g=o[c];h+=(g>>>24&255).toString(16).padStart(2,"0"),h+=(g>>>16&255).toString(16).padStart(2,"0"),h+=(g>>>8&255).toString(16).padStart(2,"0"),h+=(g&255).toString(16).padStart(2,"0")}return h}function qt(e,t){if(!e||typeof e!="object")return!1;const i=e;for(const o of t)if(i[o]===!0)return!0;for(const o of Object.keys(i))if(qt(i[o],t))return!0;return!1}const It=e=>Math.round((e+Number.EPSILON)*100)/100,ro=e=>{if(!e||typeof e!="object")return;const t=e.meta;if(!t||typeof t!="object")return;const i=t.zone;if(i){if(typeof i=="object"&&i!==null)return i.name;if(typeof i=="string")return i}};function ai(e,t,i,o){const s=fe.load(e)||{},a=fe.load(t)||{},l=s.outlines||{},d=Object.keys(l),h=d.filter(Z=>!Z.startsWith("_")).length,c=d.length,g=Object.keys(s.pcbs||{}).length,b=Object.keys(s.cases||{}).length,m=qt(s.pcbs,["reversible","reverse"]),j=qt(s.points,["mirror"]),x=s.meta||{},f=x.name??"no_name",w=x.author??"no_author",k=s.points||{},L=Object.keys(k.zones||{}).length,E=k.zones||{},S=Object.keys(E).filter(Z=>{const B=E[Z];return B&&typeof B=="object"&&("columns"in B||"rows"in B)}),U=S.length,A=U>0;let R="",M="",y="",P=0;const $=Object.keys(a);if(A){const Z=[...S].sort(),B=[],N=[],T=[];for(const Q of Z){const G=E[Q],_=Object.keys((G==null?void 0:G.columns)||{}),V=Object.keys((G==null?void 0:G.rows)||{}),H=(G==null?void 0:G.mirror)===!0||typeof(G==null?void 0:G.mirror)=="object"&&(G==null?void 0:G.mirror)!==null,ee=k.mirror===!0||typeof k.mirror=="object"&&k.mirror!==null,K=H||ee;let ie=$.filter(Oe=>{const he=a[Oe];if(ro(he)!==Q)return!1;if(he&&typeof he=="object"){const ge=he.meta;if(ge&&typeof ge=="object"&&ge.mirrored===!0)return!1}return!Oe.startsWith("mirror_")}).length;K&&(ie*=2),B.push(_.length),N.push(V.length),T.push(ie),P+=ie}R=B.join(","),M=N.join(","),y=T.join(",")}const W=$.map(Z=>{const B=a[Z],N=ro(B),Q=(N?S.includes(N):!1)?"K":"A",G=It((B==null?void 0:B.x)??0),_=It((B==null?void 0:B.y)??0),V=It((B==null?void 0:B.r)??0);return{name:Z,type:Q,x:G,y:_,r:V}});W.sort((Z,B)=>Z.x!==B.x?Z.x-B.x:Z.y!==B.y?Z.y-B.y:Z.r!==B.r?Z.r-B.r:Z.name.localeCompare(B.name));const O=W.map(Z=>`${Z.type}${Z.x.toString()};${Z.y.toString()};${Z.r.toString()}`).join("|"),D=`${f}|${w}|${O}`,J=si(D).substring(0,12),ne=!j&&m?P*2:P;return{total_generation_time_ms:i,count_outlines:h,count_raw_outlines:c,count_pcbs:g,count_cases:b,is_reversible:m,is_mirrored:j,count_zones:L,matrix_zones:U,has_matrix:A,matrix_col_counts:R,matrix_row_counts:M,matrix_key_counts:y,matrix_keys:P,keyboard_keys:ne,config_id:J,previous_config_id:o}}const r={colors:{accent:"#28a745",accentDark:"#1e8e1e",accentDarker:"#1e7e34",accentSecondary:"#239923",background:"#222222",backgroundLight:"#2a2a2a",backgroundLighter:"#333333",border:"#3f3f3f",text:"#ffffff",textDark:"#ccc",textDarker:"#aaa",textDarkest:"#666",error:"#ff6d6d",errorDark:"#a31111",warning:"hsl(45, 100%, 90%)",warningDark:"hsl(32, 79%, 40%)",info:"hsl(206, 94%, 92%)",infoDark:"hsl(206, 100%, 30%)",success:"hsl(120, 73%, 92%)",successDark:"hsl(120, 50%, 35%)",white:"#fff",buttonHover:"#3f3f3f"},fonts:{body:"'Roboto', sans-serif",code:"source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"},fontSizes:{xs:"0.4rem",sm:"0.8rem",base:"1rem",lg:"1.2rem",iconMedium:"16px",iconLarge:"24px",bodySmall:"13px",h1:"2.5rem",h2:"2rem",h3:"1.5rem"},fontWeights:{regular:400,semiBold:600,bold:700},buttonSizes:{large:{padding:"1rem 2rem",fontSize:"1rem"},medium:{padding:"0.7rem 1.4rem",fontSize:"1rem"},small:{padding:"8px 12px",fontSize:"0.8rem"},icon:{padding:"8px 12px",fontSize:"0.4rem"}}},yt=u.button`
  display: inline-block;
  border: none;
  padding: ${r.buttonSizes.large.padding};
  margin: 0;
  text-decoration: none;
  background-color: ${r.colors.accent};
  border-radius: 0.25rem;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  color: ${r.colors.white};
  font-family: ${r.fonts.body};
  font-size: ${r.buttonSizes.large.fontSize};
  cursor: pointer;
  text-align: center;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:hover {
    background-color: ${r.colors.accentDark};
    border-color: ${r.colors.accentDarker};
  }

  &:active {
    transform: scale(0.98);
    outline: 2px solid ${r.colors.white};
    outline-offset: -5px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,li=u(yt)`
  padding: ${r.buttonSizes.medium.padding};
  font-size: ${r.buttonSizes.medium.fontSize};
`,ci=u(yt)`
  padding: ${r.buttonSizes.small.padding};
  font-size: ${r.buttonSizes.small.fontSize};
`,di=u(yt)`
  padding: ${r.buttonSizes.icon.padding};
  font-size: ${r.buttonSizes.icon.fontSize};
`,pe=({size:e,...t})=>{switch(e){case"icon":return n.jsx(di,{...t});case"sm":case"small":return n.jsx(ci,{...t});case"md":case"medium":return n.jsx(li,{...t});case"lg":case"large":default:return n.jsx(yt,{...t})}},ui=e=>e.charAt(0).toUpperCase()+e.slice(1),kt=({injectionName:e,injectionType:t,onResolve:i,onCancel:o,"data-testid":s})=>{const[a,l]=p.useState(!1),d=ui(t);return n.jsx(pi,{"data-testid":s,children:n.jsxs(fi,{"data-testid":s&&`${s}-box`,children:[n.jsxs(hi,{children:[d," Conflict"]}),n.jsxs(gi,{children:["A ",t," with the name ",n.jsx("strong",{children:e})," ","already exists.",n.jsx("br",{}),"How would you like to resolve this conflict?"]}),n.jsxs(mi,{children:[n.jsx(bi,{type:"checkbox",id:"apply-to-all",checked:a,onChange:h=>l(h.target.checked),"data-testid":s&&`${s}-apply-to-all`,"aria-label":"Apply this choice to all conflicts"}),n.jsx(wi,{$checked:a,onClick:()=>l(!a),role:"checkbox","aria-checked":a}),n.jsx("label",{htmlFor:"apply-to-all",children:"Apply to all conflicts"})]}),n.jsxs(xi,{children:[n.jsx(pe,{onClick:()=>i("skip",a),size:"medium","data-testid":s&&`${s}-skip`,"aria-label":`Skip this ${t}`,children:"Skip"}),n.jsx(pe,{onClick:()=>i("overwrite",a),size:"medium","data-testid":s&&`${s}-overwrite`,"aria-label":`Overwrite existing ${t}`,children:"Overwrite"}),n.jsx(pe,{onClick:()=>i("keep-both",a),size:"medium","data-testid":s&&`${s}-keep-both`,"aria-label":`Keep both ${t}s`,children:"Keep Both"})]}),n.jsx(yi,{onClick:o,size:"small","data-testid":s&&`${s}-cancel`,"aria-label":"Cancel loading",children:"Cancel"})]})})},pi=u.div`
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
`,fi=u.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`,hi=u.h2`
  margin: 0 0 1rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
`,gi=u.p`
  margin: 0 0 1.5rem 0;
  font-size: ${r.fontSizes.base};
  color: ${r.colors.textDark};
  line-height: 1.5;

  strong {
    color: ${r.colors.accent};
  }
`,mi=u.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 0.75rem;

  label {
    cursor: pointer;
    font-size: ${r.fontSizes.base};
    color: ${r.colors.textDark};
    user-select: none;
  }
`,bi=u.input`
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
`,wi=u.div`
  position: relative;
  width: 44px;
  height: 22px;
  background-color: ${e=>e.$checked?r.colors.accent:r.colors.backgroundLighter};
  border: 1px solid ${r.colors.border};
  border-radius: 11px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${e=>e.$checked?"24px":"2px"};
    width: 16px;
    height: 16px;
    background-color: ${r.colors.text};
    border-radius: 50%;
    transition: left 0.2s ease-in-out;
  }
`,xi=u.div`
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  margin-bottom: 1rem;
`,yi=u(pe)`
  width: 100%;
  background-color: ${r.colors.backgroundLighter};
  color: ${r.colors.textDark};

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`,We=e=>Array.isArray(e)&&e.length===3&&typeof e[0]=="string"&&typeof e[1]=="string"&&typeof e[2]=="string",lr=(e,t,i)=>!i||i.length===0?{hasConflict:!1}:i.some(s=>We(s)&&s[0]===e&&s[1]===t)?{hasConflict:!0,conflictingName:t}:{hasConflict:!1},ki=(e,t)=>{if(!t||t.length===0)return[];const i=[];for(const o of e){if(!We(o))continue;const[s,a]=o,l=lr(s,a,t);l.hasConflict&&i.push({injection:o,conflict:l})}return i},cr=(e,t,i)=>{if(!i||i.length===0)return t;const o=new Set(i.filter(l=>We(l)&&l[0]===e).map(l=>l[1]));let s=1,a=`${t}_${s}`;for(;o.has(a);)s++,a=`${t}_${s}`;return a},Lt=(e,t,i)=>{const o=t?[...t]:[];for(const s of e){if(!We(s)){console.warn("[mergeInjectionArraysWithResolution] Skipping invalid injection format:",s);continue}const[a,l,d]=s;if(!lr(a,l,o).hasConflict)o.push([a,l,d]);else{if(i==="skip")continue;if(i==="overwrite"){const c=o.findIndex(g=>We(g)&&g[0]===a&&g[1]===l);c!==-1&&(o[c]=[a,l,d])}else if(i==="keep-both"){const c=cr(a,l,o);o.push([a,c,d])}}}return o},_t=e=>{const[t,i]=p.useState([]),o=t.length>0?t[0]:null,[s,a]=p.useState(null),[l,d]=p.useState(null),[h,c]=p.useState(null),g=p.useCallback(async(j,x,f=null,w)=>{var U,A,R;const k=w||e.getCurrentInjections();if(j.length===0){e.setInjectionInput(k),e.setConfigInput(x),await e.generateNow(x,k,{pointsonly:!1}),await((U=e.onComplete)==null?void 0:U.call(e,x,k));return}const L=j.filter(M=>We(M)?!0:(console.warn("[useInjectionConflictResolution] Skipping invalid injection format:",M),!1));if(L.length===0){e.setInjectionInput(k),e.setConfigInput(x),await e.generateNow(x,k,{pointsonly:!1}),await((A=e.onComplete)==null?void 0:A.call(e,x,k));return}const E=ki(L,k);if(E.length>0&&!f){const M=E.map(y=>({injection:y.injection,conflict:y.conflict}));F("conflict_encountered",{conflict_count:E.length}),i(M),a(L),d(x),c(k);return}const S=Lt(L,k,f||"skip");e.setInjectionInput(S),e.setConfigInput(x),await e.generateNow(x,S,{pointsonly:!1}),await((R=e.onComplete)==null?void 0:R.call(e,x,S))},[e]),b=p.useCallback(async(j,x)=>{var f,w;if(!(!s||!l||t.length===0))if(x){F("conflict_resolved",{strategy:j,apply_to_all:!0,remaining_count:t.length});const k=Lt(s,h||e.getCurrentInjections(),j);e.setInjectionInput(k),e.setConfigInput(l),await e.generateNow(l,k,{pointsonly:!1}),await((f=e.onComplete)==null?void 0:f.call(e,l,k)),i([]),a(null),d(null),c(null)}else{F("conflict_resolved",{strategy:j,apply_to_all:!1,remaining_count:t.length});const k=t[0],[L,E]=k.injection,I=k.injection,S=t.slice(1);i(S);let U=[...h||e.getCurrentInjections()],A=[...s||[]];if(j==="overwrite")U=U.filter(R=>!(R[0]===L&&R[1]===E));else if(j==="skip")A=A.filter(R=>!(R[0]===L&&R[1]===E&&R[2]===I[2]));else if(j==="keep-both"){const R=cr(L,E,U),M=[L,R,I[2]];U=[...U,M],A=A.filter(y=>!(y[0]===L&&y[1]===E&&y[2]===I[2]))}if(c(U),a(A),S.length===0){const R=Lt(A,U,"skip");e.setInjectionInput(R),e.setConfigInput(l),await e.generateNow(l,R,{pointsonly:!1}),await((w=e.onComplete)==null?void 0:w.call(e,l,R)),a(null),d(null),c(null)}}},[s,l,h,t,e]),m=p.useCallback(()=>{var j;F("conflict_cancelled",{remaining_count:t.length}),i([]),a(null),d(null),c(null),(j=e.setError)==null||j.call(e,"Loading cancelled by user")},[e,t.length]);return{currentConflict:o?{name:o.injection[1],type:o.injection[0]}:null,processInjectionsWithConflictResolution:g,handleConflictResolution:b,handleConflictCancel:m}},_i={templates:"4.3.0",outlines:"4.3.0"},Je=()=>Ke.version,io=e=>{const t=e.split("-")[0].replace(/^v/,"").split(".");for(;t.length<3;)t.push("0");return t.length>3||!t.every(i=>/^\d+$/.test(i))?null:[Number(t[0]),Number(t[1]),Number(t[2])]},vi=(e,t)=>{const i=io(e),o=io(t);if(!i||!o)return!1;const[s,a,l]=i,[d,h,c]=o;return s===d&&(a>h||a===h&&l>=c)},ji=(e,t)=>{const i=Ue(t),o=Ue(_i[e]);return i!==null&&o!==null?Kt(i,o):!1},$i=()=>({templates:"",outlines:""}),ce=e=>{if(typeof window<"u"&&window.location)try{const o=new URLSearchParams(window.location.search).get(`ff_${e}`);if(o==="true")return!0;if(o==="false")return!1}catch(i){console.warn("[FeatureFlags] Failed to check URL query parameters:",i)}const t=$i()[e];return t==="true"?!0:t==="false"?!1:ji(e,Je())},Ci=50*1024*1024,Si=10*1024*1024,zt=(e,t)=>{const i=`${t}/`;let o=e;return o.startsWith(i)&&(o=o.substring(i.length)),o=o.replace(/\.js$/,""),o},Ei=e=>{let t=e.file("config.yaml")||e.file("config.yml");if(!t){const i=e.file(/^config\.(yaml|yml)$/i);i&&i.length>0&&(t=i[0])}if(!t)throw new Error("The archive is missing a config.yaml file in the root directory.");return t},Jt=(e,t)=>{if(t&&e>Ci)throw new Error(`File exceeds the maximum size limit of 50MB for archives (current size: ${(e/(1024*1024)).toFixed(1)}MB).`);if(!t&&e>Si)throw new Error(`File exceeds the maximum size limit of 10MB for text files (current size: ${(e/(1024*1024)).toFixed(1)}MB).`)},dr=(e,t,i)=>{const o=[];return e.forEach(s=>o.push(["footprint",s.name,s.content])),t.forEach(s=>o.push(["outline",s.name,s.content])),i.forEach(s=>o.push(["template",s.name,s.content])),o},Pi=async e=>{let t;try{t=await ln.loadAsync(e)}catch{throw new Error("The file appears to be corrupted. Please verify the file and try again.")}const o=await Ei(t).async("string"),s=[],a=[];return t.forEach((l,d)=>{if(!(d.dir||!l.endsWith(".js"))){if(l.startsWith("footprints/")){const h=d.async("string").then(c=>{const g=zt(l,"footprints");s.push({type:"footprint",name:g,content:c})});a.push(h)}else if(l.startsWith("outlines/")&&ce("outlines")){const h=d.async("string").then(c=>{const g=zt(l,"outlines");s.push({type:"outline",name:g,content:c})});a.push(h)}else if(l.startsWith("templates/")&&ce("templates")){const h=d.async("string").then(c=>{const g=zt(l,"templates");s.push({type:"template",name:g,content:c})});a.push(h)}}}),await Promise.all(a),{config:o,injections:s}},Xt="ergogen:config",pn="ergogen:multi-config",Yt="LOCAL_STORAGE_CONFIG",so=5e3,Ii=40,Li=3;class me extends Error{constructor(t){super(t),this.name="RateLimitError"}}class zi{constructor(){this.providers=[]}register(t){this.providers.push(t)}resolve(t){const i=t.trim();for(const o of this.providers)if(o.canHandle(i))return o;return/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(i)&&this.providers[0]||null}}const Xe=new zi,Ri=e=>{const t=[],i=e.split(`
`);let o={};for(const s of i){const a=s.trim();if(a.startsWith("[submodule"))o.path&&o.url&&t.push({path:o.path,url:o.url}),o={};else{const l=a.indexOf("=");if(l!==-1){const d=a.substring(0,l).trim(),h=a.substring(l+1).trim();d==="path"?o.path=h:d==="url"&&(o.url=h)}}}return o.path&&o.url&&t.push({path:o.path,url:o.url}),t};class Ye{async fetchConfig(t){console.log(`[GitHub] Starting fetch from URL: ${t}`);const i=this.parseUrl(t),{owner:o,repo:s,branch:a,filePath:l,isRepoRoot:d}=i,h=i.host,c=[],g=[],b=[],m=async(x,f,w,k,L)=>{console.log("[GitHub] Checking for .gitmodules file");try{const E=await this.fetchFileContent(o,s,".gitmodules",f,h);console.log("[GitHub] .gitmodules found, parsing submodules");const I=Ri(E);for(const S of I)if(S.path.includes(w)||S.path.includes(k)&&ce("outlines")||S.path.includes(L)&&ce("templates")){const U=S.path.includes(k),A=S.path.includes(L),R=U?k:A?L:w,M=U?g:A?b:c,y=S.path.substring(S.path.indexOf(R)+R.length+1),P=Xe.resolve(S.url);if(P instanceof Ye){const $=P.parseUrl(S.url),W=$.host;let O=[];try{O=await P.fetchFootprintsFromDirectory($.owner,$.repo,"","main",[".js"],W)}catch(q){if(q instanceof me)throw q;try{O=await P.fetchFootprintsFromDirectory($.owner,$.repo,"","master",[".js"],W)}catch(J){if(J instanceof me)throw J;console.warn(`Failed to fetch submodule footprints from ${S.url}`)}}const D=O.map(q=>({name:y?`${y}/${q.name}`:q.name,content:q.content}));M.push(...D)}}}catch(E){if(E instanceof me)throw E}};if(!d){if(!l)throw new Error("Invalid URL. File path not specified.");const x=await this.fetchFileContent(o,s,l,a,h);Jt(x.length,!1);const f=l.split("/").pop()||"";if(!(f==="config.yaml"||f==="config.yml"))return{config:x,footprints:[],outlines:[],templates:[],configPath:f};const k=l.substring(0,l.lastIndexOf("/")),L=k?`${k}/footprints`:"footprints",E=k?`${k}/outlines`:"outlines",I=k?`${k}/templates`:"templates";try{const S=await this.fetchFootprintsFromDirectory(o,s,L,a,[".js"],h);c.push(...S)}catch(S){if(S instanceof me)throw S}if(ce("outlines"))try{const S=await this.fetchFootprintsFromDirectory(o,s,E,a,[".js",".svg"],h);g.push(...S)}catch(S){if(S instanceof me)throw S}if(ce("templates"))try{const S=await this.fetchFootprintsFromDirectory(o,s,I,a,[".js"],h);b.push(...S)}catch(S){if(S instanceof me)throw S}return await m(k,a,L,E,I),{config:x,footprints:c,outlines:g,templates:b,configPath:f}}const j=async x=>{var S,U,A,R,M,y,P,$,W,O,D,q;let f="",w="",k=!0;try{f=await this.fetchFileContent(o,s,"config.yaml",x,h),w=""}catch(J){const ne=J;if((S=ne.message)!=null&&S.includes("allowance")||(U=ne.message)!=null&&U.includes("limit exceeded")||(A=ne.message)!=null&&A.includes("rate limit"))throw ne;try{f=await this.fetchFileContent(o,s,"config.yml",x,h),w=""}catch(Z){const B=Z;if((R=B.message)!=null&&R.includes("allowance")||(M=B.message)!=null&&M.includes("limit exceeded")||(y=B.message)!=null&&y.includes("rate limit"))throw B;try{f=await this.fetchFileContent(o,s,"ergogen/config.yaml",x,h),w="ergogen"}catch(N){const T=N;if((P=T.message)!=null&&P.includes("allowance")||($=T.message)!=null&&$.includes("limit exceeded")||(W=T.message)!=null&&W.includes("rate limit"))throw T;try{f=await this.fetchFileContent(o,s,"ergogen/config.yml",x,h),w="ergogen"}catch(Q){const G=Q;if((O=G.message)!=null&&O.includes("allowance")||(D=G.message)!=null&&D.includes("limit exceeded")||(q=G.message)!=null&&q.includes("rate limit"))throw G;const{configYamls:_,anyYamls:V}=await this.bfsForYamlFiles(o,s,x,h);if(_.length>0){const H=_[0];f=await this.fetchFileContent(o,s,H,x,h),w=H.includes("/")?H.substring(0,H.lastIndexOf("/")):""}else if(V.length>0){const H=V[0];f=await this.fetchFileContent(o,s,H,x,h),w=H.includes("/")?H.substring(0,H.lastIndexOf("/")):"",k=!1}else throw new Error("No YAML configuration files found in repository")}}}}if(Jt(f.length,!1),!k)return{config:f,footprints:[],outlines:[],templates:[],configPath:w};const L=w?`${w}/footprints`:"footprints",E=w?`${w}/outlines`:"outlines",I=w?`${w}/templates`:"templates";try{const J=await this.fetchFootprintsFromDirectory(o,s,L,x,[".js"]);c.push(...J)}catch(J){if(J instanceof me)throw J}if(ce("outlines"))try{const J=await this.fetchFootprintsFromDirectory(o,s,E,x,[".js",".svg"]);g.push(...J)}catch(J){if(J instanceof me)throw J}if(ce("templates"))try{const J=await this.fetchFootprintsFromDirectory(o,s,I,x,[".js"]);b.push(...J)}catch(J){if(J instanceof me)throw J}return await m(w,x,L,E,I),{config:f,footprints:c,outlines:g,templates:b,configPath:w}};if(a!=="main")return await j(a);try{return await j("main")}catch(x){if(x instanceof me)throw x;return await j("master")}}async fetchFootprintsFromDirectory(t,i,o,s,a,l){const d=[],h=async c=>{try{const g=await this.listDirectory(t,i,c,s,l);for(const b of g){const m=b.path.startsWith(c)?b.path:c?`${c}/${b.path}`:b.path;if(b.type==="file"){if(a.some(x=>b.name.endsWith(x)))try{const x=await this.fetchFileContent(t,i,m,s,l),f=o?m.slice(o.length+1).replace(/\.[^/.]+$/,""):m.replace(/\.[^/.]+$/,"");console.log(`[GitHub] Loaded footprint: ${f}`),d.push({name:f,content:x})}catch(x){if(x instanceof me)throw x;const f=x;console.warn(`Failed to fetch file content: ${m}`,f.stack||f)}}else b.type==="dir"&&await h(m)}}catch(g){if(g instanceof me)throw g}};return await h(o),d}async bfsForYamlFiles(t,i,o,s){var g,b,m;const a=[],l=[],d=[{path:"",depth:0}],h=new Set;let c=0;for(;d.length>0&&c<Ii;){const{path:j,depth:x}=d.shift();if(!h.has(j)){h.add(j);try{c++;const f=await this.listDirectory(t,i,j,o,s);for(const w of f)if(w.type==="file"){const k=w.name.toLowerCase();(k.endsWith(".yaml")||k.endsWith(".yml"))&&!k.startsWith(".")&&k.replace(/\.(yaml|yml)$/,"")!=="metadata"&&k.replace(/\.(yaml|yml)$/,"")!=="virtual_env"&&(w.name==="config.yaml"||w.name==="config.yml"?a.push(w.path):l.push(w.path))}else w.type==="dir"&&x<Li&&(w.name.startsWith(".")||d.push({path:w.path,depth:x+1}));if(a.length>0||l.length>0&&(d.length===0||d[0].depth>x))break}catch(f){const w=f;if((g=w.message)!=null&&g.includes("allowance")||(b=w.message)!=null&&b.includes("limit exceeded")||(m=w.message)!=null&&m.includes("rate limit"))throw w;continue}}}return{configYamls:a,anyYamls:l}}}const Di=(e,t)=>{var d,h,c,g;if(!e)return{isLimitExceeded:!1,error:null};if(t.includes("raw.githubusercontent.com"))return e.status===429?(console.warn("[GitHub] Raw content rate limit exceeded (429). Please wait 30 minutes and try again."),{isLimitExceeded:!0,error:"You've reached your hourly request allowance for loading content from GitHub. Please wait 30 minutes and try again."}):{isLimitExceeded:!1,error:null};const o=((d=e.headers)==null?void 0:d.get("X-RateLimit-Limit"))||"unknown",s=((h=e.headers)==null?void 0:h.get("X-RateLimit-Remaining"))||"unknown",a=((c=e.headers)==null?void 0:c.get("X-RateLimit-Used"))||"unknown",l=((g=e.headers)==null?void 0:g.get("X-RateLimit-Reset"))||"unknown";if(console.log(`[GitHub Rate Limit] Limit: ${o}, Remaining: ${s}, Used: ${a}, Reset: ${l}`),e.status===403&&s==="0")return console.warn("[GitHub] Rate limit exceeded. Please wait and try again in about an hour."),{isLimitExceeded:!0,error:"Cannot load from GitHub right now. You've used your hourly request allowance. Please wait about an hour and try again."};if(s!=="unknown"&&o!=="unknown"){const b=parseInt(o),m=parseInt(s),j=(b-m)/b*100;if(j>=80&&m>0)return console.warn(`[GitHub] Approaching rate limit: ${j.toFixed(1)}% used`),{isLimitExceeded:!1,error:"Loading from GitHub may become unavailable soon. You've used most of your hourly request allowance. This will reset within an hour."}}return{isLimitExceeded:!1,error:null}};class Ai extends Ye{constructor(){super(...arguments),this.rateLimitWarning=null}canHandle(t){const i=t.trim();return i.includes("github.com")||/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(i)}parseUrl(t){const i=t.trim();let o="",s="",a="main",l,d=!0;const h=!i.includes("github.com");if(h){const c=i.split("/").filter(Boolean);if(c.length<2)throw new Error("Invalid GitHub repository format. Must contain owner and repository.");o=c[0],s=c[1],d=c.length===2||c.length===4&&c[2]==="tree",d?c.length===4&&(a=c[3]):c[2]==="blob"||c[2]==="tree"?(a=c[3],l=c.slice(4).join("/")):l=c.slice(2).join("/")}else{let c=i;c.match(/^(https?:\/\/)/i)||(c=`https://${c}`);const g=c.endsWith("/")?c.slice(0,-1):c,m=new URL(g).pathname.split("/").filter(Boolean);if(m.length<2)throw new Error("Invalid GitHub URL. Must contain owner and repository.");o=m[0],s=m[1],d=m.length===2||m.length===4&&m[2]==="tree",d?m.length===4&&(a=m[3]):m[2]==="blob"||m[2]==="tree"?(a=m[3],l=m.slice(4).join("/")):l=m.slice(2).join("/")}return s.endsWith(".git")&&(s=s.slice(0,-4)),{owner:o,repo:s,branch:a,filePath:l,isRepoRoot:d,baseUrl:h?`https://github.com/${o}/${s}`:i}}async fetchFileContent(t,i,o,s){const a=`https://raw.githubusercontent.com/${t}/${i}/${s}/${o}`,l=await fetch(a);if(this.checkRateLimits(l,a),!l.ok)throw new Error(`Failed to fetch file content from GitHub: ${l.status}`);return await l.text()}async listDirectory(t,i,o,s){const a=`https://api.github.com/repos/${t}/${i}/contents/${o}?ref=${s}`,l=await fetch(a);if(this.checkRateLimits(l,a),!l.ok)throw new Error(`Failed to list directory from GitHub: ${l.status}`);const d=await l.json();let h=[];if(Array.isArray(d))h=d;else if(d&&typeof d=="object"&&"tree"in d&&Array.isArray(d.tree))h=d.tree;else throw new Error("Target path is not a directory");return h.map(c=>({name:c.name||c.path.split("/").pop()||"",path:c.path,type:c.type==="tree"?"dir":c.type==="blob"?"file":c.type}))}checkRateLimits(t,i){const o=Di(t,i);if(o.error&&!this.rateLimitWarning&&(this.rateLimitWarning=o.error),o.isLimitExceeded)throw new me(o.error||"Rate limit exceeded")}async fetchConfig(t){this.rateLimitWarning=null;const i=await super.fetchConfig(t);return this.rateLimitWarning&&(i.rateLimitWarning=this.rateLimitWarning),i}}Xe.register(new Ai);const ur=async e=>{const t=Xe.resolve(e);if(!t)throw new Error(`Unsupported repository provider URL: ${e}`);return t.fetchConfig(e)};class Ni extends Ye{canHandle(t){return t.includes("codeberg.org")}parseUrl(t){const i=t.trim();let o="",s="",a="main",l,d=!0;const h=!i.includes("codeberg.org");if(h){const c=i.split("/").filter(Boolean);if(c.length<2)throw new Error("Invalid Codeberg repository format. Must contain owner and repository.");o=c[0],s=c[1],d=c.length===2||c.length===5&&c[2]==="src"&&(c[3]==="branch"||c[3]==="commit"),d?c.length===5&&(a=c[4]):c.length>=5&&c[2]==="src"&&(c[3]==="branch"||c[3]==="commit")?(a=c[4],l=c.slice(5).join("/")):l=c.slice(2).join("/")}else{let c=i;c.match(/^(https?:\/\/)/i)||(c=`https://${c}`);const g=c.endsWith("/")?c.slice(0,-1):c,m=new URL(g).pathname.split("/").filter(Boolean);if(m.length<2)throw new Error("Invalid Codeberg URL. Must contain owner and repository name.");o=m[0],s=m[1],d=m.length===2||m.length===5&&m[2]==="src"&&(m[3]==="branch"||m[3]==="commit"),d?m.length===5&&(a=m[4]):m.length>=5&&m[2]==="src"&&(m[3]==="branch"||m[3]==="commit")?(a=m[4],l=m.slice(5).join("/")):l=m.slice(2).join("/")}return s.endsWith(".git")&&(s=s.slice(0,-4)),{owner:o,repo:s,branch:a,filePath:l,isRepoRoot:d,baseUrl:h?`https://codeberg.org/${o}/${s}`:i}}async fetchFileContent(t,i,o,s){const a=`https://codeberg.org/api/v1/repos/${t}/${i}/raw/${o}?ref=${s}`,l=await fetch(a);if(!l.ok)throw new Error(`Failed to fetch file content from Codeberg API: ${l.status}`);return await l.text()}async listDirectory(t,i,o,s){const a=o?`/${o}`:"",l=`https://codeberg.org/api/v1/repos/${t}/${i}/contents${a}?ref=${s}`,d=await fetch(l);if(!d.ok)throw new Error(`Failed to list directory from Codeberg API: ${d.status}`);const h=await d.json();if(!Array.isArray(h))throw new Error("Target path is not a directory");return h.map(c=>({name:c.name,path:c.path||c.name,type:c.type}))}}Xe.register(new Ni);class Ui extends Ye{canHandle(t){const i=t.trim();return i.match(/^(https?:\/\/)/i)?!i.includes("github.com")&&!i.includes("codeberg.org"):!1}parseUrl(t){const i=t.trim();let o="",s="",a="main",l,d=!0,h=i;h.match(/^(https?:\/\/)/i)||(h=`https://${h}`);const c=h.endsWith("/")?h.slice(0,-1):h,g=new URL(c),b=g.origin,m=g.pathname.split("/").filter(Boolean);if(m.length<2)throw new Error("Invalid Forgejo/Gitea URL. Must contain owner and repository name.");return o=m[0],s=m[1],d=m.length===2||m.length===5&&m[2]==="src"&&(m[3]==="branch"||m[3]==="commit"),d?m.length===5&&(a=m[4]):m.length>=5&&m[2]==="src"&&(m[3]==="branch"||m[3]==="commit")?(a=m[4],l=m.slice(5).join("/")):l=m.slice(2).join("/"),s.endsWith(".git")&&(s=s.slice(0,-4)),{owner:o,repo:s,branch:a,filePath:l,isRepoRoot:d,baseUrl:i,host:b}}async fetchFileContent(t,i,o,s,a){const d=`${a||"https://codeberg.org"}/api/v1/repos/${t}/${i}/raw/${o}?ref=${s}`,h=await fetch(d);if(!h.ok)throw new Error(`Failed to fetch file content from Gitea/Forgejo API: ${h.status}`);return await h.text()}async listDirectory(t,i,o,s,a){const l=a||"https://codeberg.org",d=o?`/${o}`:"",h=`${l}/api/v1/repos/${t}/${i}/contents${d}?ref=${s}`,c=await fetch(h);if(!c.ok)throw new Error(`Failed to list directory from Gitea/Forgejo API: ${c.status}`);const g=await c.json();if(!Array.isArray(g))throw new Error("Target path is not a directory");return g.map(b=>({name:b.name,path:b.path||b.name,type:b.type}))}}const Wi=new Ui;Xe.register(Wi);const Oi=({processInjectionsWithConflictResolution:e,setError:t})=>{const[i,o]=p.useState(!1),s=p.useRef(!1);return p.useEffect(()=>{const a=async()=>{const l=new URLSearchParams(window.location.search),d=l.get("github"),h=l.get("codeberg"),c=l.get("forgejo"),g=l.get("gitea");let b=d||h||c||g;if(b){h&&!h.includes("codeberg.org")?b=`https://codeberg.org/${h}`:d&&!d.includes("github.com")&&(b=`https://github.com/${d}`),o(!0),console.log("[useConfigLoader] Loading from URL parameter:",b);try{const m=await ur(b);console.log("[useConfigLoader] Fetch result:",{configLength:m.config.length,footprintsCount:m.footprints.length,outlinesCount:m.outlines.length,configPath:m.configPath,rateLimitWarning:m.rateLimitWarning}),m.rateLimitWarning&&t(m.rateLimitWarning);const j=dr(m.footprints,m.outlines,m.templates);await e(j,m.config)}catch(m){console.error("[useConfigLoader] Failed to load from remote repository:",m),t(`Failed to load from remote repository: ${m instanceof Error?m.message:String(m)}`)}finally{o(!1)}}};s.current||(s.current=!0,a())},[e,t]),{isLoading:i}},ao="background-preview-",Fi=()=>({version:0,active:null,settledVersion:null,settledRequestKey:null}),Mi=e=>!e||!e.startsWith(ao)?null:e.slice(ao.length),Bi=(e,t,i,o)=>JSON.stringify([e,t,i,o]),Ti=(e,t,i)=>{var s;return i?(((s=e.active)==null?void 0:s.requestKey)??e.settledRequestKey)===t:!1},Gi=(e,t)=>{e.version+=1;const o={requestId:`${t.isManual?"ergogen-manual":"ergogen-generate"}-${e.version}-${t.now??Date.now()}`,version:e.version,targetConfigId:t.targetConfigId,requestKey:t.requestKey,isManual:t.isManual};return e.active=o,e.settledVersion=null,e.settledRequestKey=null,o},Vi=(e,t)=>{const i=Mi(t.requestId);if(i!==null)return{kind:"background-preview",configId:i};if(!e.active||t.requestId!==e.active.requestId)return{kind:"stale"};const o=e.active;return e.active=null,t.type==="error"?(e.settledVersion=null,e.settledRequestKey=null,{kind:"active-error",isManual:o.isManual}):t.type==="success"?(e.settledVersion=o.version,e.settledRequestKey=o.requestKey,{kind:"active-success",version:o.version,targetConfigId:o.targetConfigId,isManual:o.isManual}):(e.settledVersion=null,e.settledRequestKey=null,{kind:"active-unknown",isManual:o.isManual})},Hi=(e,t)=>e.active===null&&e.settledVersion!==null&&t===e.settledVersion,Rt=e=>{e.active=null,e.settledVersion=null,e.settledRequestKey=null},lo=e=>{e.version+=1,e.active=null,e.settledVersion=null,e.settledRequestKey=null},Ki=e=>!e||!Array.isArray(e)?e:e.filter(t=>{if(!Array.isArray(t)||t.length!==3)return!0;const[i]=t;return!(i==="outline"&&!ce("outlines")||i==="template"&&!ce("templates"))}),qi=e=>{if(!e||!Array.isArray(e))return null;const t=e.some(a=>Array.isArray(a)&&a[0]==="outline"),i=e.some(a=>Array.isArray(a)&&a[0]==="template"),o=t&&!ce("outlines"),s=i&&!ce("templates");if(o||s){const a=[];return o&&a.push("outlines"),s&&a.push("templates"),`Custom ${a.join(" and ")} were skipped because the respective feature flags are disabled in settings.`}return null},Ji=e=>{if(!e||typeof e!="object")return null;const t=e;if(!t.pcbs||typeof t.pcbs!="object")return null;const i=t.pcbs;for(const o of Object.values(i))if(o&&typeof o=="object"&&(!o.template||o.template==="kicad5")){const s=o.footprints;if(s&&typeof s=="object"){for(const a of Object.values(s))if(a&&typeof a=="object"&&typeof a.what=="string"&&a.what.startsWith("ceoloide"))return'KiCad 5 is deprecated. Please add "template: kicad8" to your PCB definitions to avoid errors when opening PCB files with KiCad 8 or newer.'}}return null},Xi=(e,t)=>{if(e&&typeof e=="object"){const i=e;return i.points&&t?{...i,pcbs:void 0,cases:void 0}:i}return e},Zt=e=>{var t;return((t=e==null?void 0:e.getRealtimeConfigInput)==null?void 0:t.call(e))??(e==null?void 0:e.configInput)??""},Ve=(e,t)=>{if(typeof window>"u")return t;try{const i=localStorage.getItem(e);return i!==null?JSON.parse(i):t}catch{return t}},co=()=>({debug:Ve("ergogen:config:debug",!1),autoGen:Ve("ergogen:config:autoGen",!0),autoGen3D:Ve("ergogen:config:autoGen3D",!0),kicanvasPreview:Ve("ergogen:config:kicanvasPreview",!0),stlPreview:Ve("ergogen:config:stlPreview",!0),sendUsageMetrics:xt()}),pr=p.createContext(null),Ae=()=>typeof window<"u"&&window.crypto&&window.crypto.randomUUID?window.crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,e=>{const t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)}),ot=(e,t)=>{let i=0;for(const o of e){const s=o.name.match(t);if(s){const a=parseInt(s[1],10);!isNaN(a)&&a>i&&(i=a)}}return i+1},mt="ergogen:deleted-config",Yi=e=>{try{const t=localStorage.getItem(mt),i={version:1,configs:[]};if(t){const s=JSON.parse(t);s&&Array.isArray(s.configs)&&(i.configs=s.configs,s.version!==void 0&&(i.version=s.version))}const o={...e,deletedAt:new Date().toISOString()};i.configs.push(o),localStorage.setItem(mt,JSON.stringify(i))}catch(t){console.error("Failed to save deleted config to storage:",t)}},uo=()=>{try{const e=localStorage.getItem(mt);if(!e)return;const t=JSON.parse(e);if(!t||!Array.isArray(t.configs))return;let i=t.configs;const o=Date.now(),s=90*24*60*60*1e3;i=i.filter(l=>{const d=new Date(l.deletedAt).getTime();return o-d<=s}),i.length>100&&(i.sort((l,d)=>{const h=new Date(l.updatedAt).getTime(),c=new Date(d.updatedAt).getTime();return h-c}),i=i.slice(i.length-100));const a={version:t.version||1,configs:i};localStorage.setItem(mt,JSON.stringify(a))}catch(e){console.error("Failed to prune deleted configs:",e)}},po=e=>{if(!e)return;let t="";if(typeof e=="string")t=e;else if(Array.isArray(e))t=e.join("");else return;return t=t.replace(/width="[^"]+"/,'width="284px"').replace(/height="[^"]+"/,'height="134px"'),t=t.replace(/<svg/,'<svg style="background-color: rgb(51,51,51);"'),t=t.replaceAll(/stroke="#000"/g,'stroke="#AAA"'),t=t.replaceAll(/stroke:#000/g,"stroke:#AAA"),t},Zi=()=>{if(typeof window>"u")return{version:2,activeConfigId:null,configs:[]};const e=localStorage.getItem(pn);if(e)try{const t=JSON.parse(e);if(t&&typeof t.version=="number"){const i=new Date().toISOString(),o=(t.configs||[]).map(s=>({...s,createdAt:s.createdAt||i,updatedAt:s.updatedAt||i}));return{...t,configs:o}}}catch(t){console.error("Failed to parse multi-config storage:",t)}return{version:2,activeConfigId:null,configs:[]}},ue=(e,t,i=2)=>{if(typeof window>"u")return;const o={version:i,activeConfigId:t,configs:e};localStorage.setItem(pn,JSON.stringify(o))},Qi=()=>{const e=Zi();if(typeof window>"u")return e;const t=localStorage.getItem(Yt),i=localStorage.getItem(Xt);let o="";if(t)try{o=JSON.parse(t)}catch{o=t}else if(i)try{o=JSON.parse(i)}catch{o=i}if(o&&o.trim()!==""){if(!e.configs.some(a=>a.name==="Legacy Config")){const a=Ae(),l={id:a,name:"Legacy Config",config:o,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};e.configs.push(l),e.activeConfigId=a,ue(e.configs,a,2)}localStorage.removeItem(Yt),localStorage.removeItem(Xt)}return e},es=({initialInjectionInput:e,hashError:t,children:i})=>{const[o]=p.useState(()=>{if(typeof window>"u")return!1;const v=localStorage.getItem(Yt),C=localStorage.getItem(Xt);return!!(v||C)}),[s]=p.useState(()=>{if(typeof window>"u")return 2;const v=localStorage.getItem(pn);if(v)try{const C=JSON.parse(v);if(C&&typeof C.version=="number")return C.version}catch(C){console.warn("Failed to parse loaded version:",C)}return 1}),[a]=p.useState(()=>Qi()),[l,d]=p.useState(()=>a.configs),[h,c]=p.useState(()=>a.activeConfigId),[g,b]=p.useState(!1),[m,j]=p.useState(null),[x,f]=p.useState(()=>{if(a.activeConfigId){const v=a.configs.find(C=>C.id===a.activeConfigId);return v?v.config:""}return""}),w=p.useRef(l),k=p.useRef(h),L=p.useRef(g),E=p.useRef(m),I=p.useRef(x);p.useEffect(()=>{w.current=l},[l]),p.useEffect(()=>{k.current=h},[h]),p.useEffect(()=>{L.current=g},[g]),p.useEffect(()=>{E.current=m},[m]),p.useEffect(()=>{I.current=x},[x]);const S=p.useRef(x);p.useEffect(()=>{S.current=x},[x]);const U=p.useCallback(v=>{S.current=v},[]),A=p.useCallback(()=>S.current,[]),R=p.useRef(void 0),M=p.useRef(null),y=p.useRef(null),P=p.useCallback(()=>{y.current&&(clearTimeout(y.current.timeoutId),y.current=null)},[]),$=p.useCallback(()=>{const v=y.current;v&&(P(),F(v.name,v.payload))},[P]),W=p.useCallback(()=>{if($(),M.current){const{timeoutId:v,payload:C,configId:z}=M.current;clearTimeout(v),F("keyboard_generated",C),R.current=z,M.current=null}},[$]),O=p.useCallback(()=>{R.current=void 0,$(),M.current&&(clearTimeout(M.current.timeoutId),M.current=null)},[$]),[D,q]=eo("ergogen:injection",e),[J,ne]=p.useState(null),[Z,B]=p.useState(null),[N,T]=p.useState(null),[Q,G]=p.useState(null),[_,V]=p.useState(null),[H,ee]=p.useState(0),K=p.useRef(Fi()),se=p.useCallback(()=>{lo(K.current),V(null),ae(!1),xe(!1)},[]),[ie,Oe]=eo("ergogen:settings",co()),he=(ie==null?void 0:ie.debug)??!1,ke=(ie==null?void 0:ie.autoGen)??!0,ge=(ie==null?void 0:ie.autoGen3D)??!0,Fe=(ie==null?void 0:ie.kicanvasPreview)??!0,Ee=(ie==null?void 0:ie.stlPreview)??!0,fn=p.useRef(Ee);fn.current=Ee;const[$e,Sr]=p.useState(xt),jt=p.useRef(ie);jt.current=ie;const hn=p.useRef(ke);hn.current=ke;const $t=p.useRef($e);$t.current=$e;const be=p.useCallback(v=>{const C=jt.current||co(),z=v(C);jt.current=z,Oe(z)},[Oe]),gn=p.useCallback(v=>{be(C=>{const z=typeof v=="function"?v(C.debug):v;return{...C,debug:z}})},[be]),mn=p.useCallback(v=>{be(C=>{const z=typeof v=="function"?v(C.autoGen):v;return{...C,autoGen:z}})},[be]),bn=p.useCallback(v=>{be(C=>{const z=typeof v=="function"?v(C.autoGen3D):v;return{...C,autoGen3D:z}})},[be]),wn=p.useCallback(v=>{be(C=>{const z=typeof v=="function"?v(C.kicanvasPreview):v;return{...C,kicanvasPreview:z}})},[be]),xn=p.useCallback(v=>{be(C=>{const z=typeof v=="function"?v(C.stlPreview):v;return{...C,stlPreview:z}})},[be]),Me=p.useCallback((v,C,z)=>{if(P(),z||!hn.current){F(v,C);return}const X=setTimeout(()=>{y.current=null,F(v,C)},so);y.current={name:v,payload:C,timeoutId:X}},[P]),yn=p.useCallback(v=>{const C=typeof v=="function"?v($t.current):v;$t.current=C,Xr(C),Sr(C),be(z=>({...z,sendUsageMetrics:C}))},[be]);p.useEffect(()=>{rr()},[$e]);const[Ce,kn]=p.useState(!1),[_n,Er]=p.useState(!1),[vn,jn]=p.useState(!1),[$n,Cn]=p.useState(!0),[Sn,En]=p.useState(!0),[Pn,ae]=p.useState(!1),[In,Ze]=p.useState(!1),we=p.useRef(null),Pe=p.useRef(null),[Ln,xe]=p.useState(!1),zn=p.useRef(!0),Ct=p.useRef(null);p.useEffect(()=>{uo()},[]),p.useEffect(()=>{t&&ne(t)},[t]);const Rn=p.useCallback(()=>ne(null),[]),Dn=p.useCallback(()=>B(null),[]),An=p.useCallback(()=>T(null),[]),Nn=p.useCallback(()=>G(null),[]),Un=p.useCallback(v=>{var X,oe,Y,re,de,_e;const C=v.data,z=Vi(K.current,C);if(z.kind==="background-preview"){const te=z.configId;if(C.type==="success"&&C.results){const ye=C.results,ze=((oe=(X=ye.outlines)==null?void 0:X.preview)==null?void 0:oe.svg)||((Y=ye.demo)==null?void 0:Y.svg),Be=po(ze);Be&&d(nt=>{const Te=nt.map(le=>le.id===te?{...le,previewSvg:Be}:le);return ue(Te,k.current,2),Te})}else C.type==="error"&&console.warn(`Background generation failed for config ${te}:`,C.error);return}if(z.kind!=="stale"){if(z.kind==="active-error"){const te=C.type==="error"&&C.error||"Unknown worker error";console.error("--- Ergogen worker error:",te),ne(te),ae(!1),xe(!1),Me("generation_failed",{error_message:te,stored_configs_count:w.current.length,trigger:z.isManual?"manual":"auto"},z.isManual);return}if(z.kind==="active-success")if(C.type==="success"&&C.warnings&&C.warnings.length>0&&B(te=>(te?te+`
`:"")+C.warnings.join(`
`)),C.type==="success"&&C.results){const te=C.results,ye=Ct.current?performance.now()-Ct.current:0;Me("generation_completed",{duration_ms:Math.round(ye),points_count:te.points?Object.keys(te.points).length:0,pcbs_count:te.pcbs?Object.keys(te.pcbs).length:0,cases_count:te.cases?Object.keys(te.cases).length:0,has_outlines:!!te.outlines,stored_configs_count:w.current.length,trigger:z.isManual?"manual":"auto"},z.isManual);try{const le=fe.dump(te.canonical||{}),Se=fe.dump(te.points||{}),je=ai(le,Se,Math.round(ye),R.current);if(je.config_id!==R.current){M.current&&clearTimeout(M.current.timeoutId);const Dr=setTimeout(()=>{F("keyboard_generated",je),R.current=je.config_id,M.current=null},so);M.current={timeoutId:Dr,payload:je,configId:je.config_id}}}catch(le){console.error("Failed to generate keyboard configuration analytics:",le)}const ze=((de=(re=te.outlines)==null?void 0:re.preview)==null?void 0:de.svg)||((_e=te.demo)==null?void 0:_e.svg),Be=po(ze),nt=z.targetConfigId;Be&&nt&&d(le=>{const Se=le.map(je=>je.id===nt?{...je,previewSvg:Be}:je);return ue(Se,k.current,2),Se});let Te=!1;if(fn.current&&te.cases&&Object.keys(te.cases).length>0){for(const le of Object.keys(te.cases)){const Se=te.cases[le];Se!=null&&Se.jscad&&(te.cases[le].stl=void 0)}if(Pe.current){Te=!0,xe(!0);const le={type:"batch_jscad_to_stl",results:te,configVersion:z.version};Pe.current.postMessage(le)}}V(te),ee(le=>le+1),Te||ae(!1)}else ae(!1);else ae(!1),xe(!1)}},[Me]),Wn=p.useRef(Un);Wn.current=Un;const On=p.useCallback(v=>{const C=v.data;Hi(K.current,C.configVersion)&&(C.type==="error"?(console.error("--- JSCAD worker error:",C.error),xe(!1),ae(!1)):C.type==="success"&&C.results&&(V(C.results),ee(z=>z+1),xe(!1),ae(!1)))},[]),Fn=p.useRef(On);Fn.current=On;const Qe=p.useCallback(()=>{we.current&&(we.current.terminate(),we.current=null,Ze(!1));const v=cn();return v?(v.onmessage=C=>Wn.current(C),v.onerror=C=>{console.error("Ergogen worker error:",C);const z=C.message||"Ergogen worker error";Rt(K.current),ne(z),ae(!1),xe(!1),ht(C.message||"Worker crash",!1,"ergogen_worker")},we.current=v,Ze(!0)):(Ze(!1),console.warn("Failed to initialize Ergogen worker.")),v},[]);p.useEffect(()=>{if(we.current||Qe(),!Pe.current){const v=Qo();v?(v.onmessage=C=>Fn.current(C),v.onerror=C=>{console.error("JSCAD worker error:",C),xe(!1),ae(!1),ht(C.message||"Worker crash",!1,"jscad_worker")},Pe.current=v):console.warn("Failed to initialize JSCAD worker.")}return()=>{we.current&&(we.current.terminate(),we.current=null,Ze(!1)),Pe.current&&(Pe.current.terminate(),Pe.current=null)}},[Qe]),p.useEffect(()=>{const v=()=>{document.visibilityState==="hidden"&&W()};return window.addEventListener("visibilitychange",v),window.addEventListener("pagehide",W),()=>{window.removeEventListener("visibilitychange",v),window.removeEventListener("pagehide",W),W()}},[W]);const St=p.useRef({debug:he,autoGen:ke,autoGen3D:ge,kicanvasPreview:Fe,stlPreview:Ee,sendUsageMetrics:$e});p.useEffect(()=>{const v={debug:he,autoGen:ke,autoGen3D:ge,kicanvasPreview:Fe,stlPreview:Ee,sendUsageMetrics:$e},{sendUsageMetrics:C,...z}=v;if(zn.current)zn.current=!1,St.current=v,F("settings_loaded",{...z});else{const X=St.current,oe=Object.keys(v).find(Y=>v[Y]!==X[Y]);St.current=v,F("setting_changed",{...oe?{setting_name:oe,setting_value:v[oe]}:{},...z})}},[he,ke,ge,Fe,Ee,$e]);const Mn=p.useCallback(v=>{let C="UNKNOWN",z=null;try{z=JSON.parse(v),C="json"}catch{}try{z=fe.load(v),C="yaml"}catch{}return[C,z]},[]),et=p.useCallback(async(v,C,z={pointsonly:!0})=>{const X=v===void 0||v===I.current?S.current??I.current:v;if(!X)return;const oe=Ki(C),Y=Bi(X,oe,!!z.pointsonly,he);if(Ti(K.current,Y,z.skipIfCurrent))return;const[,re]=Mn(X);ne(null),B(null),T(null),ae(!0),Ct.current=performance.now();const de=Ji(re);de&&B(de);const _e=qi(C);_e&&T(_e);const te=Xi(re,z.pointsonly)||X;try{if(!we.current){console.error("Worker not available for processing request."),Rt(K.current),ae(!1),xe(!1),ne("Worker not available for processing request.");return}const ye=Gi(K.current,{requestKey:Y,targetConfigId:k.current,isManual:!!z.isManual});we.current.postMessage({type:"generate",inputConfig:te,injectionInput:oe,requestId:ye.requestId,options:{debug:he,svg:!0}})}catch(ye){Rt(K.current),ae(!1),xe(!1);const ze=typeof ye=="string"?ye:String(ye);ne(ze),Me("generation_failed",{error_message:ze,stored_configs_count:w.current.length,trigger:z.isManual?"manual":"auto"},!!z.isManual);return}},[Mn,ne,B,T,ae,he,Me]),Le=p.useMemo(()=>Go((v,C,z={pointsonly:!0})=>et(v,C,{...z,skipIfCurrent:!0}),300),[et]),Ie=p.useCallback(async(v,C,z={pointsonly:!0})=>{Le.cancel(),await et(v,C,z)},[Le,et]),tt=p.useCallback(v=>{const C=I.current,z=typeof v=="function"?v(C):v;if(z!==C)if(f(z),L.current){if(z!==E.current){const oe=`Shared Config ${ot(w.current,/^Shared\s+Config\s+(\d+)$/)}`,Y=Ae(),re=new Date().toISOString(),de={id:Y,name:oe,config:z||"",createdAt:re,updatedAt:re},_e=[...w.current,de];d(_e),c(Y),b(!1),j(null),ue(_e,Y)}}else{const X=k.current;if(X){const oe=w.current.map(Y=>Y.id===X?{...Y,config:z||"",updatedAt:new Date().toISOString()}:Y);d(oe),ue(oe,X)}else{const Y=`Untitled ${ot(w.current,/^Untitled\s+(\d+)$/)}`,re=Ae(),de=new Date().toISOString(),_e={id:re,name:Y,config:z||"",createdAt:de,updatedAt:de},te=[...w.current,_e];d(te),c(re),ue(te,re)}}},[]),Bn=p.useCallback(v=>{if(O(),se(),v===null)c(null),k.current=null,b(!1),j(null),f(""),I.current="",ue(w.current,null);else{const C=w.current.find(z=>z.id===v);C&&(c(v),k.current=v,b(!1),j(null),f(C.config),I.current=C.config,ue(w.current,v),F("config_selected",{stored_configs_count:w.current.length}))}},[O,se]),Tn=p.useCallback((v,C)=>{O(),se();const z=ot(w.current,/^Untitled\s+(\d+)$/),X=C||`Untitled ${z}`,oe=Ae(),Y=new Date().toISOString(),re={id:oe,name:X,config:v,createdAt:Y,updatedAt:Y},de=[...w.current,re];return d(de),c(oe),b(!1),j(null),f(v),F("config_created",{stored_configs_count:de.length}),w.current=de,k.current=oe,I.current=v,ue(de,oe),oe},[O,se]),Gn=p.useCallback((v,C)=>{const z=C.trim();if(!z)return ne("Configuration name cannot be empty"),!1;const X=w.current.find(re=>re.id===v);if(!X)return!1;if(X.name===z)return!0;if(w.current.some(re=>re.id!==v&&re.name.trim().toLowerCase()===z.toLowerCase()))return ne(`A configuration named "${z}" already exists.`),!1;const Y=w.current.map(re=>re.id===v?{...re,name:z,updatedAt:new Date().toISOString()}:re);return d(Y),w.current=Y,ue(Y,k.current),F("config_renamed",{stored_configs_count:Y.length}),!0},[ne]),Vn=p.useCallback(v=>{O(),se();const C=w.current.find(z=>z.id===v);if(C){const z=Ae(),X=new Date().toISOString(),oe={id:z,name:`${C.name} (Copy)`,config:C.config,createdAt:X,updatedAt:X},Y=[...w.current,oe];d(Y),c(z),b(!1),j(null),f(C.config),w.current=Y,k.current=z,I.current=C.config,ue(Y,z),F("config_duplicated",{stored_configs_count:Y.length})}},[O,se]),Hn=p.useCallback(v=>{O();const C=k.current,z=w.current.find(re=>re.id===v),X=w.current.filter(re=>re.id!==v);d(X),w.current=X;const oe=C===v;X.length===0||oe?(se(),c(null),k.current=null,f(""),I.current="",ue(X,null)):ue(X,C),z&&Yi(z),F("config_deleted",{stored_configs_count:X.length})},[O,se]),Kn=p.useCallback(v=>{O(),se(),b(!0),j(v),f(v)},[O,se]),qn=p.useCallback(()=>{if(!L.current)return;const C=`Shared Config ${ot(w.current,/^Shared\s+Config\s+(\d+)$/)}`,z=Ae(),X=new Date().toISOString(),oe={id:z,name:C,config:I.current||"",createdAt:X,updatedAt:X},Y=[...w.current,oe];d(Y),w.current=Y,c(z),k.current=z,b(!1),j(null),ue(Y,z)},[]),Jn=p.useCallback(()=>{uo()},[]),Xn=p.useMemo(()=>{if(g)return"Shared Config";if(h){const v=l.find(C=>C.id===h);return v?v.name:""}return""},[g,h,l]),Pr=p.useMemo(()=>({setInjectionInput:q,setConfigInput:tt,generateNow:Ie,getCurrentInjections:()=>D||[],setError:ne}),[D,Ie,q,tt,ne]),{currentConflict:Et,processInjectionsWithConflictResolution:Ir,handleConflictResolution:Lr,handleConflictCancel:zr}=_t(Pr),{isLoading:Yn}=Oi({processInjectionsWithConflictResolution:Ir,setError:ne}),Zn=p.useRef(null);p.useEffect(()=>{if(t||Yn)return;!new URLSearchParams(window.location.search).get("github")&&x&&(Zn.current=k.current,Ie(x,D,{pointsonly:!1}))},[Yn]);const Qn=p.useRef(Ce);p.useEffect(()=>{Qn.current&&!Ce&&(lo(K.current),ae(!1),xe(!1),Qe(),x&&Ie(x,D,{pointsonly:!ge})),Qn.current=Ce},[Ce,x,D,ge,Ie,Qe]),p.useEffect(()=>{localStorage.setItem("ergogen:injection",JSON.stringify(D)),ke&&!Ce&&Le(x,D,{pointsonly:!ge})},[x,D,ke,ge,Ce,Le]),p.useEffect(()=>{In&&(s===1||o)&&(console.log("Version 1 or legacy configuration detected on load. Triggering background preview generation for all configs missing a preview SVG..."),ue(w.current,k.current,2),w.current.forEach(v=>{var C;!v.previewSvg&&v.id!==Zn.current&&(console.log(`Triggering background preview generation for: ${v.name}`),(C=we.current)==null||C.postMessage({type:"generate",inputConfig:v.config,requestId:`background-preview-${v.id}`,options:{debug:!0,svg:!0}}))}))},[In,s,o]);const Rr=p.useMemo(()=>({configInput:x,getRealtimeConfigInput:A,updateRealtimeConfigInput:U,setConfigInput:tt,configs:l,activeConfigId:h,activeConfigName:Xn,isPreview:g,selectConfig:Bn,createNewConfig:Tn,renameConfig:Gn,duplicateConfig:Vn,deleteConfig:Hn,loadPreview:Kn,savePreviewConfig:qn,pruneDeletedConfigs:Jn,injectionInput:D,setInjectionInput:q,processInput:Le,generateNow:Ie,error:J,setError:ne,clearError:Rn,deprecationWarning:Z,clearWarning:Dn,skippedWarning:N,clearSkippedWarning:An,info:Q,setInfo:G,clearInfo:Nn,results:_,resultsVersion:H,setResultsVersion:ee,showSettings:Ce,setShowSettings:kn,isBulkDownloadOpen:_n,setIsBulkDownloadOpen:Er,showSideNav:vn,setShowSideNav:jn,showConfig:$n,setShowConfig:Cn,showDownloads:Sn,setShowDownloads:En,debug:he,setDebug:gn,autoGen:ke,setAutoGen:mn,autoGen3D:ge,setAutoGen3D:bn,kicanvasPreview:Fe,setKicanvasPreview:wn,stlPreview:Ee,setStlPreview:xn,sendUsageMetrics:$e,setSendUsageMetrics:yn,isGenerating:Pn,setIsGenerating:ae,isJscadConverting:Ln}),[x,A,U,tt,l,h,Xn,g,Bn,Tn,Gn,Vn,Hn,_n,Kn,qn,Jn,D,q,Le,Ie,J,ne,Rn,Z,Dn,N,An,Q,G,Nn,_,H,ee,Ce,kn,vn,jn,$n,Cn,Sn,En,he,gn,ke,mn,ge,bn,Fe,wn,Ee,xn,$e,yn,Pn,ae,Ln]);return n.jsxs(pr.Provider,{value:Rr,children:[i,Et&&n.jsx(kt,{injectionName:Et.name,injectionType:Et.type,onResolve:Lr,onCancel:zr,"data-testid":"conflict-resolution-dialog"})]})},ve=()=>p.useContext(pr),ts=({className:e,options:t,"data-testid":i,"aria-label":o})=>{const s=ve(),a=p.useRef(null),l={configInput:void 0,setConfigInput:k=>{},updateRealtimeConfigInput:k=>{},injectionInput:void 0,generateNow:async()=>{},activeConfigId:null},{configInput:d,updateRealtimeConfigInput:h,setConfigInput:c,injectionInput:g,generateNow:b,activeConfigId:m}=s??l,j=p.useRef({updateRealtimeConfigInput:h,setConfigInput:c,injectionInput:g,generateNow:b});j.current={updateRealtimeConfigInput:h,setConfigInput:c,injectionInput:g,generateNow:b};const x=p.useRef(Go(k=>{c(k)},500)).current;p.useEffect(()=>()=>{x.cancel()},[x]),p.useEffect(()=>{if(a.current){if(a.current.hasTextFocus())return;const k=a.current.getValue();d!==void 0&&d!==k&&a.current.setValue(d)}},[d]);const f=p.useCallback(k=>{k!==void 0&&(h(k),x(k))},[x,h]),w=(k,L)=>{a.current=k,k.onDidBlurEditorText(()=>{x.flush()}),k.addAction({id:"generate-config",label:"Generate",keybindings:[L.KeyMod.CtrlCmd|L.KeyCode.Enter],run:()=>{const{updateRealtimeConfigInput:E,setConfigInput:I,injectionInput:S,generateNow:U}=j.current,A=k.getValue();x.cancel(),E(A),I(A),F("shortcut_used",{action:"generate"}),U(A,S,{pointsonly:!1,isManual:!0})}})};return s?n.jsx("div",{className:e,"data-testid":i,"aria-label":o,children:n.jsx(Vo,{height:"100%",defaultLanguage:"yaml",language:"yaml",onChange:f,onMount:w,defaultValue:d,theme:"ergogen-theme",options:t||void 0},m||"preview")}):null},ns=({className:e,options:t,injection:i,setInjection:o,"data-testid":s,"aria-label":a})=>{const l=ve(),d=async h=>{if(!h)return null;const c={...i,content:h};o(c)};return l?n.jsx(os,{className:e,"data-testid":s,"aria-label":a,children:n.jsx(Vo,{height:"100%",defaultLanguage:"javascript",language:"javascript",onChange:d,value:i.content,theme:"ergogen-theme",options:t||void 0})}):null},os=u.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: 0.5rem;
`,rs=bt`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,is=u.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;

  @media (max-width: 639px) {
    padding-bottom: 0.75rem;
  }
`,ss=u.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${r.fontSizes.bodySmall};
  cursor: ${e=>e.$hasPreview?"pointer":"default"};
  border-bottom: ${e=>e.$active?`2px solid ${r.colors.accent}`:"2px solid transparent"};
  border-top: 2px solid transparent;
  opacity: ${e=>e.$disabled?.5:1};
  color: ${e=>e.$disabled?r.colors.textDarker:r.colors.white};
`,as=u.div`
  white-space: nowrap;
  display: flex;
  gap: 10px;
  align-items: center;
`,ls=u.a`
  background-color: ${r.colors.background};
  border: none;
  border-radius: 6px;
  color: ${r.colors.white};
  display: flex;
  align-items: center;
  padding: 4px 6px;
  text-decoration: none;
  cursor: pointer;
  font-size: ${r.fontSizes.bodySmall};
  line-height: 16px;
  height: 28px;

  .material-symbols-outlined {
    font-size: ${r.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`,cs=u.a`
  background-color: ${r.colors.background};
  border: none;
  border-radius: 6px;
  color: ${r.colors.white};
  display: flex;
  align-items: center;
  padding: 4px 6px;
  text-decoration: none;
  cursor: not-allowed;
  font-size: ${r.fontSizes.bodySmall};
  line-height: 16px;
  height: 28px;
  opacity: 0.5;

  .material-symbols-outlined {
    font-size: ${r.fontSizes.iconMedium} !important;
    animation: ${rs} 1s linear infinite;
  }
`,ds=({fileName:e,extension:t,content:i,preview:o,setPreview:s,previewKey:a,"data-testid":l})=>{const d=t==="stl"&&!i||t==="kicad_pcb"&&!o,h=t==="stl"&&!i,c=()=>{if(h)return;F("download_button_clicked",{download_type:t,source:"downloads_panel"});const m=document.createElement("a"),j=new Blob([i],{type:"octet/stream"}),x=URL.createObjectURL(j);m.href=x,m.download=`${e}.${t}`,document.body.appendChild(m);try{m.click()}finally{document.body.removeChild(m),URL.revokeObjectURL(x)}},g=()=>{o&&!d&&s(o)},b=l?`${l}-${t}`:void 0;return n.jsxs(is,{"data-testid":b,children:[n.jsxs(ss,{$active:a===(o==null?void 0:o.key),$hasPreview:!!o,$disabled:d,onClick:g,"data-testid":b&&`${b}-preview`,children:[e,".",t]}),n.jsx(as,{children:h?n.jsx(cs,{"aria-label":`Generating ${e}.${t}`,"data-testid":b&&`${b}-loading`,children:n.jsx("span",{className:"material-symbols-outlined",children:"progress_activity"})}):n.jsx(ls,{onClick:c,"aria-label":`Download ${e}.${t}`,"data-testid":b&&`${b}-download`,children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})})]})},us=u.h3`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  margin: 0 0 1rem;

  @media (max-width: 639px) {
    display: none;
  }
`,ps=u.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;

  @media (max-width: 639px) {
    padding: 0.5rem;
  }
`,fs=u.div`
  font-size: ${r.fontSizes.sm};
  color: ${r.colors.textDarkest};
  font-style: italic;
  padding: 0.5rem 0;
`,hs=({setPreview:e,previewKey:t,"data-testid":i})=>{var h,c;const o=[],s=ve();if(!s)return null;const{configInput:a,results:l}=s;if(l!=null&&l.demo&&o.push({fileName:"raw",extension:"txt",content:a??"",previewKey:"raw",preview:{key:"raw",extension:"txt",content:a??""}},{fileName:"canonical",extension:"yaml",content:fe.dump(l.canonical),previewKey:"canonical",preview:{key:"canonical",extension:"yaml",content:fe.dump(l.canonical)}},{fileName:"demo",extension:"dxf",content:((h=l.demo)==null?void 0:h.dxf)??"",previewKey:"demo.svg",preview:{key:"demo.svg",extension:"svg",content:((c=l.demo)==null?void 0:c.svg)??""}},{fileName:"points",extension:"yaml",content:fe.dump(l.points),previewKey:"points",preview:{key:"points",extension:"yaml",content:fe.dump(l.points)}},{fileName:"units",extension:"yaml",content:fe.dump(l.units),previewKey:"units",preview:{key:"units",extension:"yaml",content:fe.dump(l.units)}}),l!=null&&l.outlines)for(const[g,b]of Object.entries(l.outlines))o.push({fileName:g,extension:"dxf",content:b.dxf??"",previewKey:`outlines.${g}.svg`,preview:{key:`outlines.${g}.svg`,extension:"svg",content:b.svg??""}});if(l!=null&&l.cases){for(const[g,b]of Object.entries(l.cases))if(o.push({fileName:g,extension:"jscad",content:b.jscad??"",previewKey:`cases.${g}`,preview:{key:`cases.${g}`,extension:"jscad",content:b.jscad??""}}),s.stlPreview&&b.jscad){const m=!!b.stl;o.push({fileName:g,extension:"stl",content:b.stl??"",previewKey:m?`cases.${g}.stl`:"",preview:m?{key:`cases.${g}.stl`,extension:"stl",content:b.stl??""}:void 0})}}if(l!=null&&l.pcbs)for(const[g,b]of Object.entries(l.pcbs)){const j=String(b).match(/version "?([0-9]+)"?/),x=j&&j.length>1?Number(j[1]):-1;o.push({fileName:g,extension:"kicad_pcb",content:b,previewKey:s.kicanvasPreview&&x>20240101?`pcbs.${g}`:"",preview:s.kicanvasPreview&&x>20240101?{key:`pcbs.${g}`,extension:"kicad_pcb",content:b}:void 0})}const d=o.filter(g=>!(!s.debug&&(g.fileName.startsWith("_")||{units:"yaml",points:"yaml",canonical:"yaml",raw:"txt"}[g.fileName]===g.extension||s.stlPreview&&g.extension==="jscad")));return n.jsxs(ps,{"data-testid":i,children:[n.jsx(us,{children:"Outputs"}),d.length>0?d.map((g,b)=>n.jsx(ds,{...g,setPreview:e,previewKey:t,"data-testid":i&&`${i}-${g.fileName}`},b)):n.jsx(fs,{children:"No outputs"})]})},gs=u.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
`,ms=u.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${r.fontSizes.bodySmall};
  cursor: pointer;
  border-bottom: ${e=>e.$active?`2px solid ${r.colors.accent}`:"2px solid transparent"};
  border-top: 2px solid transparent;
`,bs=u.div`
  white-space: nowrap;
  display: flex;
  gap: 6px;
  align-items: center;
`,fr=Ho`
  background-color: ${r.colors.background};
  border: none;
  border-radius: 6px;
  color: ${r.colors.white};
  display: flex;
  align-items: center;
  padding: 4px 6px;
  text-decoration: none;
  cursor: pointer;
  font-size: ${r.fontSizes.bodySmall};
  line-height: 16px;
  gap: 6px;

  .material-symbols-outlined {
    font-size: ${r.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`,fo=u.a`
  ${fr}
`,ws=u.a`
  ${fr}

  @media (min-width: 640px) {
    display: none;
  }
`,Dt=({injection:e,setInjectionToEdit:t,deleteInjection:i,previewKey:o,"data-testid":s})=>{const[a,l]=p.useState("");return p.useEffect(()=>{const d=window.URL.createObjectURL(new Blob([e.content],{type:"octet/stream"}));return l(d),()=>{window.URL.revokeObjectURL(d)}},[e.content]),n.jsxs(gs,{"data-testid":s,children:[n.jsx(ms,{"data-testid":s&&`${s}-name`,$active:o===e.name,onClick:()=>t(e),children:e.name}),n.jsxs(bs,{children:[n.jsx(ws,{href:"#",onClick:d=>{d.preventDefault(),t(e)},"aria-label":`edit injection ${e.name}`,"data-testid":s&&`${s}-edit`,children:n.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),n.jsx(fo,{href:"#",onClick:d=>{d.preventDefault(),i(e)},"aria-label":`delete injection ${e.name}`,"data-testid":s&&`${s}-delete`,children:n.jsx("span",{className:"material-symbols-outlined",children:"delete"})}),n.jsx(fo,{target:"_blank",rel:"noopener noreferrer",download:`${e.name.split("/").reverse()[0]}.js`,href:a||void 0,"aria-label":`download injection ${e.name}`,"data-testid":s&&`${s}-download`,children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})]})]})},qe=u.button`
  background-color: ${r.colors.accentSecondary};
  transition: background-color 0.15s ease-in-out;
  border: none;
  border-radius: 6px;
  color: ${r.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  height: 34px;
  font-family: ${r.fonts.body};
  flex-grow: 1;

  .material-symbols-outlined {
    font-size: ${r.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${r.colors.accentDark};
  }
`,pt=u.h3`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  margin: 1.5rem 0.5rem 1rem 0.5rem;
`,ho=e=>{const o=new DOMParser().parseFromString(e,"image/svg+xml").querySelectorAll("path"),s=[];return o.forEach(a=>{const l=a.getAttribute("d");if(l&&l.trim()){const d=l.replace(/\\/g,"\\\\").replace(/"/g,'\\"');s.push(`        "${d}"`)}}),`const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
${s.join(`,
`)}
    ];
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
};`},At=u.div`
  display: flex;
  margin-left: 0.5rem;
  margin-left: 0.5rem;
  gap: 8px;
  margin-top: 0.5rem;
`,Re=u(qe)`
  flex-grow: 0;
  width: 34px;
  padding: 0;
`,xs=u.div`
  display: flex;
  margin-left: 0.5rem;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.5rem;
`,ys=u.div`
  display: flex;
  margin-left: 0.5rem;
  border-bottom: 1px solid ${r.colors.border};
  margin-left: 0.5rem;
  gap: 16px;
`,Nt=u.button`
  background: none;
  border: none;
  color: ${e=>e.$active?r.colors.text:r.colors.textDark};
  padding: 0.75rem 0;
  cursor: pointer;
  font-size: ${r.fontSizes.bodySmall};
  font-weight: ${r.fontWeights.semiBold};
  border-bottom: 2px solid
    ${e=>e.$active?r.colors.accent:"transparent"};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${r.colors.text};
  }
`,ks=({setInjectionToEdit:e,deleteInjection:t,injectionToEdit:i,onInjectionSelect:o,"data-testid":s})=>{const a=[],l=[],d=[],h=p.useRef(null),c=p.useRef(null),g=p.useCallback(y=>{c.current=y,y&&(y.setAttribute("webkitdirectory",""),y.setAttribute("directory",""))},[]),b=ve(),[m,j]=p.useState("footprint"),[x,f]=p.useState("footprints"),{currentConflict:w,processInjectionsWithConflictResolution:k,handleConflictResolution:L,handleConflictCancel:E}=_t({setInjectionInput:y=>b==null?void 0:b.setInjectionInput(y),setConfigInput:y=>b==null?void 0:b.setConfigInput(y),generateNow:async(y,P,$)=>{await(b==null?void 0:b.generateNow(y,P,$))},getCurrentInjections:()=>(b==null?void 0:b.injectionInput)||[],setError:y=>b==null?void 0:b.setError(y)});if(!b)return null;const{injectionInput:I}=b;if(I&&Array.isArray(I)&&I.length>0)for(let y=0;y<I.length;y++){const P=I[y];if(P.length===3){let $=d;P[0]==="footprint"?$=a:P[0]==="outline"?$=l:P[0]==="template"&&($=d),$.push({key:y,type:P[0],name:P[1],content:P[2]})}}const S=()=>{var $;const y=(($=b==null?void 0:b.injectionInput)==null?void 0:$.length)||0,P={key:y,type:"footprint",name:`custom_footprint_${y+1}`,content:`module.exports = {
  params: {
    designator: '',
  },
  body: p => \`\`
}`};F("injection_created",{injection_type:"footprint"}),e(P),o&&o()},U=()=>{var $;const y=(($=b==null?void 0:b.injectionInput)==null?void 0:$.length)||0,P={key:y,type:"outline",name:`custom_outline_${y+1}`,content:`const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
        ""  // Add your SVG path(s) here
    ];
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
};`};F("injection_created",{injection_type:"outline"}),e(P),o&&o()},A=()=>{var $;const y=(($=b==null?void 0:b.injectionInput)==null?void 0:$.length)||0,P={key:y,type:"template",name:`custom_template_${y+1}`,content:`const m = require('makerjs')
const version = require('../../package.json').version

module.exports = {
    convert_outline: (model, layer) => {
        return \`\`;  // Return your converted outlines
    },
    body: params => {
        return \`\`;  // Add your template text here
    }
}`};F("injection_created",{injection_type:"template"}),e(P),o&&o()},R=async y=>{const P=y.target.files;if(!P||P.length===0)return;const $=[];for(let W=0;W<P.length;W++){const O=P[W];if(O.name.endsWith(".js")){const D=await O.text(),q=O.name.replace(/\.js$/,"");$.push([m,q,D])}else if(m==="outline"&&O.name.endsWith(".svg")){const D=await O.text(),q=ho(D),J=O.name.replace(/\.svg$/,"");$.push([m,J,q])}}$.length>0&&(F("injection_uploaded",{injection_type:m,source:"file",file_count:$.length}),await k($,b.configInput||"")),y.target.value=""},M=async y=>{const P=y.target.files;if(!P||P.length===0)return;const $=[];for(let W=0;W<P.length;W++){const O=P[W];if(O.name.endsWith(".js")){const D=await O.text(),q=O.webkitRelativePath.split("/");q.shift();const J=q.join("/").replace(/\.js$/,"");$.push([m,J,D])}else if(m==="outline"&&O.name.endsWith(".svg")){const D=await O.text(),q=O.webkitRelativePath.split("/");q.shift();const J=q.join("/").replace(/\.svg$/,""),ne=ho(D);$.push([m,J,ne])}}$.length>0&&(F("injection_uploaded",{injection_type:m,source:"folder",file_count:$.length}),await k($,b.configInput||"")),y.target.value=""};return n.jsxs(xs,{"data-testid":s,children:[w&&n.jsx(kt,{injectionName:w.name,injectionType:w.type,onResolve:L,onCancel:E,"data-testid":"conflict-resolution-dialog"}),n.jsx(pt,{children:"Custom Libraries"}),n.jsxs(ys,{children:[n.jsx(Nt,{$active:x==="footprints",onClick:()=>{f("footprints"),j("footprint")},"data-testid":"tab-footprints",children:"Footprints"}),ce("outlines")&&n.jsx(Nt,{$active:x==="outlines",onClick:()=>{f("outlines"),j("outline")},"data-testid":"tab-outlines",children:"Outlines"}),ce("templates")&&n.jsx(Nt,{$active:x==="templates",onClick:()=>{f("templates"),j("template")},"data-testid":"tab-templates",children:"Templates"})]}),x==="footprints"&&n.jsxs(n.Fragment,{children:[a.map(y=>n.jsx(Dt,{injection:y,setInjectionToEdit:P=>{F("injection_editor_opened",{injection_type:P.type}),e(P),o&&o()},deleteInjection:t,previewKey:i.name,"data-testid":s&&`${s}-${y.name}`},y.key)),n.jsxs(At,{children:[n.jsx(qe,{onClick:S,"data-testid":"add-footprint","aria-label":"Add new custom footprint",title:"Add footprint",children:n.jsx("span",{className:"material-symbols-outlined",children:"add"})}),n.jsx(Re,{onClick:()=>{j("footprint"),setTimeout(()=>{var y;return(y=h.current)==null?void 0:y.click()},0)},"data-testid":"load-footprint-files","aria-label":"Load custom footprint files",title:"Load footprint files",children:n.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),n.jsx(Re,{onClick:()=>{j("footprint"),setTimeout(()=>{var y;return(y=c.current)==null?void 0:y.click()},0)},"data-testid":"load-footprint-folder","aria-label":"Load custom footprint folder",title:"Load footprint folder",children:n.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),x==="outlines"&&ce("outlines")&&n.jsxs(n.Fragment,{children:[l.map(y=>n.jsx(Dt,{injection:y,setInjectionToEdit:P=>{F("injection_editor_opened",{injection_type:P.type}),e(P),o&&o()},deleteInjection:t,previewKey:i.name,"data-testid":s&&`${s}-${y.name}`},y.key)),n.jsxs(At,{children:[n.jsx(qe,{onClick:U,"data-testid":"add-outline","aria-label":"Add new custom outline",title:"Add outline",children:n.jsx("span",{className:"material-symbols-outlined",children:"add"})}),n.jsx(Re,{onClick:()=>{j("outline"),setTimeout(()=>{var y;return(y=h.current)==null?void 0:y.click()},0)},"data-testid":"load-outline-files","aria-label":"Load custom outline files",title:"Load outline files",children:n.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),n.jsx(Re,{onClick:()=>{j("outline"),setTimeout(()=>{var y;return(y=c.current)==null?void 0:y.click()},0)},"data-testid":"load-outline-folder","aria-label":"Load custom outline folder",title:"Load outline folder",children:n.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),x==="templates"&&ce("templates")&&n.jsxs(n.Fragment,{children:[d.map(y=>n.jsx(Dt,{injection:y,setInjectionToEdit:P=>{F("injection_editor_opened",{injection_type:P.type}),e(P),o&&o()},deleteInjection:t,previewKey:i.name,"data-testid":s&&`${s}-${y.name}`},y.key)),n.jsxs(At,{children:[n.jsx(qe,{onClick:A,"data-testid":"add-template","aria-label":"Add new custom template",title:"Add template",children:n.jsx("span",{className:"material-symbols-outlined",children:"add"})}),n.jsx(Re,{onClick:()=>{j("template"),setTimeout(()=>{var y;return(y=h.current)==null?void 0:y.click()},0)},"data-testid":"load-template-files","aria-label":"Load custom template files",title:"Load template files",children:n.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),n.jsx(Re,{onClick:()=>{j("template"),setTimeout(()=>{var y;return(y=c.current)==null?void 0:y.click()},0)},"data-testid":"load-template-folder","aria-label":"Load custom template folder",title:"Load template folder",children:n.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),n.jsx("input",{type:"file",ref:h,onChange:R,accept:m==="outline"?".js,.svg":".js",multiple:!0,style:{display:"none"}}),n.jsx("input",{type:"file",ref:g,onChange:M,accept:m==="outline"?".js,.svg":".js",style:{display:"none"}})]})},_s=u.img`
  filter: invert();
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
`,vs=u(Ar.PanZoom)`
  overflow: hidden;
  height: 100%;

  &:focus-visible {
    outline: none;
  }
`,js=({svg:e,width:t,height:i,"aria-label":o,"data-testid":s})=>n.jsx(vs,{enableBoundingBox:!0,minZoom:.8,maxZoom:5,"aria-label":o,"data-testid":s,children:n.jsx(_s,{width:t||"100%",height:i||"100%",src:`data:image/svg+xml;utf8,${encodeURIComponent(e)}`,alt:"Ergogen SVG Output preview",draggable:"false"})}),Ut=({content:e,language:t,className:i,height:o,options:s,"aria-label":a,"data-testid":l})=>n.jsx("div",{className:i,"aria-label":a,"data-testid":l,children:n.jsx(Nr,{height:o||"80vh",language:t,value:e,theme:"ergogen-theme",options:s||{readOnly:!0}})}),$s=p.lazy(()=>Zo(()=>import("./PcbPreview-BI1R2Mfv.js"),__vite__mapDeps([0,1]))),Cs=p.lazy(()=>Zo(()=>import("./StlPreview-1nxo5Cih.js"),__vite__mapDeps([2,1,3,4,5]))),hr=u.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: ${r.colors.background};
`,gr=u.img`
  width: 96px;
  height: 96px;
  opacity: 0.12;
  filter: grayscale(100%);
  -webkit-user-drag: none;
  user-drag: none;
`,Ss=u.span`
  color: ${r.colors.textDarkest};
  font-size: ${r.fontSizes.sm};
  margin-top: 1rem;
  font-family: ${r.fonts.body};
  user-select: none;
`,go=()=>n.jsxs(hr,{children:[n.jsx(gr,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"}),n.jsx(Ss,{children:"Loading preview..."})]}),Es=({previewExtension:e,previewContent:t,previewKey:i,width:o="100%",height:s="100%",className:a,"data-testid":l,"aria-label":d})=>{if(!t||typeof t=="string"&&t===""||t instanceof ArrayBuffer&&t.byteLength===0||ArrayBuffer.isView(t)&&t.byteLength===0)return n.jsx(hr,{className:a,"data-testid":l,"aria-label":d,children:n.jsx(gr,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"})});const c=g=>{switch(g){case"svg":return n.jsx(js,{svg:t,width:o,height:s,"aria-label":d||`SVG preview for ${i}`,"data-testid":l&&`${l}-svg`});case"yaml":return n.jsx(Ut,{language:"yaml",content:t,"aria-label":d||`YAML preview for ${i}`,"data-testid":l&&`${l}-yaml`});case"txt":return n.jsx(Ut,{language:"text",content:t,"aria-label":d||`Text preview for ${i}`,"data-testid":l&&`${l}-txt`});case"jscad":return n.jsx(Ut,{language:"javascript",content:t,"aria-label":d||`JSCAD code preview for ${i}`,"data-testid":l&&`${l}-jscad-text`});case"kicad_pcb":return n.jsx(p.Suspense,{fallback:n.jsx(go,{}),children:n.jsx($s,{pcb:t,previewKey:i,"aria-label":d||`PCB preview for ${i}`,"data-testid":l&&`${l}-pcb`},i)});case"stl":return n.jsx(p.Suspense,{fallback:n.jsx(go,{}),children:n.jsx(Cs,{stl:t,"aria-label":d||`STL preview for ${i}`,"data-testid":l&&`${l}-stl`})});default:return"No preview available"}};return n.jsx("div",{className:a,"data-testid":l,"aria-label":d,children:c(e)})},Wt=({children:e,initialWidth:t=300,minWidth:i=10,maxWidth:o="100%",side:s="left",style:a,"data-testid":l})=>{const[d,h]=p.useState(t),c=p.useRef(!1),g=p.useRef(0),b=p.useRef(t),m=p.useRef(null),j=f=>{if(typeof f=="string"&&f.includes("%")){const w=parseFloat(f)/100;return window.innerWidth*w}else return typeof f=="string"&&f.includes("px")?parseFloat(f):typeof f=="number"?f:1/0};p.useEffect(()=>{const f=E=>{if(!c.current)return;const I=s==="left"?E.clientX-g.current:g.current-E.clientX,S=b.current+I,U=j(o),A=Math.max(i,Math.min(S,U));h(A)},w=()=>{c.current&&(c.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},k=E=>{if(!c.current)return;E.preventDefault();const I=E.touches[0],S=s==="left"?I.clientX-g.current:g.current-I.clientX,U=b.current+S,A=j(o),R=Math.max(i,Math.min(U,A));h(R)},L=()=>{c.current&&(c.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",f),window.addEventListener("mouseup",w),window.addEventListener("touchmove",k,{passive:!1}),window.addEventListener("touchend",L),()=>{window.removeEventListener("mousemove",f),window.removeEventListener("mouseup",w),window.removeEventListener("touchmove",k),window.removeEventListener("touchend",L)}},[i,o,s]);const x=f=>{f.preventDefault(),f.stopPropagation(),c.current=!0,b.current=d,"touches"in f?g.current=f.touches[0].clientX:g.current=f.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};return n.jsxs(Ps,{ref:m,$side:s,style:{width:`${d}px`,...a},"data-testid":l,children:[e,n.jsx(Is,{$side:s,onMouseDown:x,onTouchStart:x,"data-testid":l&&`${l}-resize-handle`})]})},Ps=u.div`
  position: relative;
  flex-shrink: 0;
  flex-grow: 0;
  height: 100%;
  overflow: visible;
  border-right: ${e=>e.$side==="left"?`1px solid ${r.colors.border}`:"none"};
  border-left: ${e=>e.$side==="right"?`1px solid ${r.colors.border}`:"none"};

  @media (max-width: 639px) {
    width: 100% !important;
    border-right: none;
    border-left: none;
  }
`,Is=u.div`
  position: absolute;
  top: 0;
  ${e=>e.$side==="left"?"right: -4px;":"left: -4px;"}
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
  --active-color: ${r.colors.accent};
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
      0 -8px 0 0 ${r.colors.backgroundLight},
      0 8px 0 0 ${r.colors.backgroundLight};
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
`,Qt=(e,t)=>{if(t===null)return null;if(e==="")return t;if(typeof t!="object")return;const i=e.split("."),o=i[0],s=i.slice(1).join(".");return Object.prototype.hasOwnProperty.call(t,o)?Qt(s,t[o]):void 0},Ls=(e,t,i,o="")=>{let s=t,a=i,l=null;e&&(l=Qt(s,e),l===void 0&&s!=="demo.svg"&&(s="demo.svg",a="svg",l=Qt(s,e)));let d="";switch(a){case"svg":case"kicad_pcb":d=typeof l=="string"?l:"";break;case"stl":d=typeof l=="string"||l instanceof ArrayBuffer||ArrayBuffer.isView(l)?l:"";break;case"jscad":d=typeof(l==null?void 0:l.jscad)=="string"?l.jscad:"";break;case"yaml":d=fe.dump(l);break;case"txt":d=o;break;default:d=""}return{key:s,extension:a,content:d}};function mr(){if(typeof navigator<"u"){if("userAgentData"in navigator&&navigator.userAgentData){const e=navigator.userAgentData;if(e.platform&&/mac/i.test(e.platform))return!0}if(/Mac|iPhone|iPad|iPod/i.test(navigator.userAgent))return!0}return!1}const zs=u.input.attrs(e=>({type:"text",$size:e.$size||"0.5em"}))`
  font-size: ${r.fontSizes.base};
  background-color: ${r.colors.backgroundLighter};
  border: 1px solid ${r.colors.border};
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: ${r.colors.text};
  font-family: ${r.fonts.body};
  outline: none;
  transition: border-color 0.15s ease-in-out;
  /* here we use the dynamically computed prop */
  margin: ${e=>e.$size};

  &:focus {
    border-color: ${r.colors.accent};
  }

  &::selection {
    background-color: ${r.colors.accent};
    color: ${r.colors.white};
  }
`,Rs=u.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`,Ds=u.label`
  display: flex;
  flex-direction: column;
  flex: 1;
  cursor: ${e=>e.$disabled?"not-allowed":"pointer"};
  user-select: none;
  text-align: left;
`,As=u.span`
  color: ${r.colors.text};
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
`,Ns=u.span`
  color: ${r.colors.textDarker};
  font-size: ${r.fontSizes.sm};
  margin-top: 0.25rem;
  line-height: 1.4;
`,Us=u.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`,Ws=u.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: ${e=>e.$disabled?"not-allowed":"pointer"};
  opacity: ${e=>e.$disabled?.5:1};
`,Os=u.input`
  opacity: 0;
  width: 0;
  height: 0;
`,Fs=u.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${e=>e.$checked?r.colors.accent:r.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`,Ms=u.span`
  position: absolute;
  top: 2px;
  left: ${e=>e.$checked?"18px":"2px"};
  width: 16px;
  height: 16px;
  background-color: ${r.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,De=({optionId:e,label:t,description:i,setSelected:o,checked:s,disabled:a=!1,"aria-label":l})=>n.jsxs(Rs,{children:[n.jsxs(Ds,{htmlFor:e,$disabled:a,children:[n.jsx(As,{children:t}),i&&n.jsx(Ns,{children:i})]}),n.jsx(Us,{children:n.jsxs(Ws,{$disabled:a,htmlFor:e,children:[n.jsx(Os,{type:"checkbox",id:e,checked:s,disabled:a,onChange:d=>o(d.target.checked),"data-testid":`option-${e}`,"aria-label":l}),n.jsx(Fs,{$checked:s}),n.jsx(Ms,{$checked:s})]})})]}),Ne=u.button`
  background-color: transparent;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  border: 1px solid ${r.colors.border};
  border-radius: 6px;
  color: ${r.colors.white};
  display: flex;
  align-items: center;
  padding: 8px 12px;
  text-decoration: none;
  cursor: pointer;
  font-size: ${r.fontSizes.bodySmall};
  line-height: 16px;
  gap: 6px;
  height: 34px;
  font-family: ${r.fonts.body};

  .material-symbols-outlined {
    font-size: ${r.fontSizes.iconMedium} !important;
  }

  &:hover,
  &.active {
    background-color: ${r.colors.buttonHover};
  }
`,rt=u.h4`
  font-size: ${r.fontSizes.sm};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.textDarker};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 1.5rem 0.5rem 0.5rem 0.5rem;

  &:first-of-type {
    margin-top: 0.5rem;
  }
`,it=u.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 1rem;
  width: 100%;

  & > div {
    border-bottom: 1px solid ${r.colors.border};
    &:last-child {
      border-bottom: none;
    }
  }
`,Bs=u.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`,Ts=u.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  user-select: none;
  text-align: left;
`,Gs=u.span`
  color: ${r.colors.text};
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
`,en=u.span`
  color: ${r.colors.textDarker};
  font-size: ${r.fontSizes.sm};
  margin-top: 0.25rem;
  line-height: 1.4;
`,Vs=u(en)`
  color: ${r.colors.warningDark};
`,Hs=u.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`,Ks=({isAvailable:e,isInstalled:t,isInstalling:i,onInstall:o})=>{let s,a;return t?(s=n.jsx(en,{children:"The application is installed and available offline."}),a=n.jsx(pe,{size:"sm",disabled:!0,"data-testid":"pwa-installed-button",children:"Installed"})):e?(s=n.jsx(en,{children:"Install the app locally to access it offline without network connectivity."}),i?a=n.jsx(pe,{size:"sm",disabled:!0,"data-testid":"pwa-installing-button",children:"Installing..."}):a=n.jsx(pe,{size:"sm",onClick:o,"data-testid":"pwa-install-button",children:"Install App"})):(s=n.jsx(Vs,{children:"PWA installation is not supported by your browser or environment."}),a=n.jsx(pe,{size:"sm",disabled:!0,"data-testid":"pwa-unavailable-button",children:"Unavailable"})),n.jsxs(Bs,{children:[n.jsxs(Ts,{children:[n.jsx(Gs,{children:"Offline App"}),s]}),n.jsx(Hs,{children:a})]})},qs=(e,t,i,o)=>{const s={config:e,...t&&t.length>0?{injections:t}:{},guiVersion:wt.version,ergogenVersion:un("github:ceoloide/ergogen#v4.3.0")},a=JSON.stringify(s);return Ko.compressToEncodedURIComponent(a)},Js=()=>new URLSearchParams(window.location.search).get("debug")!==null,Xs=e=>{var i;const t=Js();try{const o=Ko.decompressFromEncodedURIComponent(e);if(!o)return console.error("[Share] DECODE_ERROR: Failed to decompress encoded string"),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The encoded data could not be decompressed."};let s;try{s=JSON.parse(o)}catch(l){return console.error("[Share] DECODE_ERROR: Failed to parse decompressed JSON",{parseError:l,decompressedLength:o.length,decompressedPreview:o.substring(0,100)}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The decompressed data is not valid JSON."}}if(!s||typeof s!="object"||!("config"in s)||typeof s.config!="string")return console.error("[Share] VALIDATION_ERROR: Invalid object structure",{parsed:s,hasConfig:s&&typeof s=="object"&&"config"in s,configType:s&&typeof s=="object"&&"config"in s?typeof s.config:"N/A"}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link does not contain a valid configuration. The decoded data is missing required fields or has an invalid structure."};const a=s;return(!a.guiVersion||typeof a.guiVersion!="string")&&(a.guiVersion="0.9.0"),(!a.ergogenVersion||typeof a.ergogenVersion!="string")&&(a.ergogenVersion="github:ergogen/ergogen#v4.2.1"),"injections"in a&&a.injections!==void 0&&(!Array.isArray(a.injections)||!a.injections.every(l=>Array.isArray(l)&&l.length===3&&typeof l[0]=="string"&&typeof l[1]=="string"&&typeof l[2]=="string"))?(console.error("[Share] VALIDATION_ERROR: Invalid injections structure",{injections:a.injections,isArray:Array.isArray(a.injections)}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link contains invalid injections data. Injections must be an array of [type, name, content] tuples."}):(t&&console.log("[Share] DEBUG: Decoded configuration object",{configLength:a.config.length,hasInjections:a.injections!==void 0,injectionsCount:((i=a.injections)==null?void 0:i.length)??0,fullObject:a}),{success:!0,config:a})}catch(o){return console.error("[Share] DECODE_ERROR: Unexpected error during decoding",{error:o,errorMessage:o instanceof Error?o.message:String(o),errorStack:o instanceof Error?o.stack:void 0}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. An unexpected error occurred while decoding."}}},Ys=e=>{const{config:t,injections:i,canonical:o}=e;let s=i;if(o&&i&&i.length>0){const h=wr(o);s=Zs(i,h)}const a=s&&s.length>0?s:void 0,l=qs(t,a);return`${window.location.origin+window.location.pathname}#${l}`},br=()=>{const e=window.location.hash;if(!e||e.length<=1)return null;const t=e.substring(1);return Xs(t)},wr=e=>{const t=new Set,i=new Set,o=new Set;if(!e||typeof e!="object")return{footprints:t,templates:i,outlines:o};const s=e;if(s.pcbs&&typeof s.pcbs=="object"){for(const a of Object.values(s.pcbs))if(!(!a||typeof a!="object")&&(typeof a.template=="string"&&i.add(a.template),a.footprints&&typeof a.footprints=="object"))for(const l of Object.values(a.footprints))l&&typeof l.what=="string"&&t.add(l.what)}if(s.outlines&&typeof s.outlines=="object")for(const a of Object.values(s.outlines)){if(!a||typeof a!="object")continue;const l=Array.isArray(a)?a:Object.values(a);for(const d of l){const h=d;h&&typeof h.what=="string"&&o.add(h.what)}}return{footprints:t,templates:i,outlines:o}},Zs=(e,t)=>!e||e.length===0?[]:e.filter(i=>{const[o,s]=i;return o==="footprint"?t.footprints.has(s):o==="template"?t.templates.has(s):o==="outline"?t.outlines.has(s):!0}),mo=async(e,t,i,o)=>{try{await navigator.clipboard.writeText(e),t(!0),o==null||o(),i.current&&clearTimeout(i.current),i.current=setTimeout(()=>{t(!1)},2500)}catch(s){console.error("Failed to copy shareable URI to clipboard:",s);try{const a=document.createElement("textarea");a.value=e,a.style.position="fixed",a.style.opacity="0",document.body.appendChild(a),a.select();const l=document.execCommand("copy");if(document.body.removeChild(a),!l){console.error("Fallback copy method was rejected by the browser.");return}t(!0),o==null||o(),i.current&&clearTimeout(i.current),i.current=setTimeout(()=>{t(!1)},2500)}catch(a){console.error("Fallback copy method also failed:",a)}}},xr=({config:e,injections:t,onClose:i,"data-testid":o})=>{const s=qo.useMemo(()=>t||[],[t]),[a,l]=p.useState(1),[d,h]=p.useState(!0),[c,g]=p.useState(!1),[b,m]=p.useState(null),[j,x]=p.useState(""),[f,w]=p.useState([]),[k,L]=p.useState(!1),[E,I]=p.useState(!1),S=p.useRef(null),U=p.useRef(null);p.useEffect(()=>{if(!d||k||s.length===0||a!==1)return;let $=!0;g(!0),m(null);const W=cn();if(!W){m("Could not initialize background worker."),g(!1);return}return W.onmessage=O=>{var q;if(!$)return;const D=O.data;if(D.type==="success"){const J=(q=D.results)==null?void 0:q.canonical,{footprints:ne,templates:Z,outlines:B}=wr(J),N=s.map(([T,Q,G])=>{let _;return T==="footprint"?_=ne.has(Q):T==="template"?_=Z.has(Q):T==="outline"?_=B.has(Q):_=!0,{type:T,name:Q,content:G,checked:_,isEligible:_}}).filter(T=>T.isEligible).map(({type:T,name:Q,content:G,checked:_})=>({type:T,name:Q,content:G,checked:_}));w(N),L(!0)}else D.type==="error"&&m(D.error||"Failed to analyze configuration.");g(!1),W.terminate()},W.onerror=()=>{$&&(m("Worker encountered an error during analysis."),g(!1),W.terminate())},W.postMessage({type:"generate",inputConfig:e,injectionInput:s,requestId:`share-analysis-${Date.now()}`,options:{debug:!0}}),()=>{$=!1,W.terminate()}},[d,k,s,e,a]);const A=p.useRef(0);A.current=d?f.filter($=>$.checked).length:0;const R=p.useCallback($=>{F("share_link_copied",{has_injections:A.current>0,injections_count:A.current,source:$})},[]);p.useEffect(()=>{a===2&&j&&mo(j,I,U,()=>{R("auto")})},[j,a,R]),p.useEffect(()=>{const $=W=>{W.key==="Escape"&&i()};return window.addEventListener("keydown",$),()=>{window.removeEventListener("keydown",$)}},[i]),p.useEffect(()=>{a===2&&S.current&&(S.current.focus(),S.current.select())},[a]),p.useEffect(()=>{const $=U;return()=>{$.current&&clearTimeout($.current)}},[]);const M=$=>{w(W=>W.map((O,D)=>D===$?{...O,checked:!O.checked}:O))},y=()=>{const $=d?f.filter(D=>D.checked):[],W=$.length>0?$.map(D=>[D.type,D.name,D.content]):void 0,O=Ys({config:e,injections:W});x(O),l(2)},P=()=>{mo(j,I,U,()=>{R("button")})};return n.jsx(Qs,{"data-testid":o,onClick:$=>{$.target===$.currentTarget&&i()},children:n.jsxs(ea,{"data-testid":o&&`${o}-box`,onClick:$=>$.stopPropagation(),children:[n.jsx(ta,{onClick:i,"data-testid":o&&`${o}-close`,"aria-label":"Close dialog",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})}),a===1?n.jsxs(n.Fragment,{children:[n.jsx(bo,{children:"Share Configuration"}),n.jsx(wo,{children:"Configure what content should be included when sharing your keyboard design."}),n.jsx(na,{children:n.jsxs(oa,{htmlFor:"include-libraries-toggle",children:[n.jsx(ra,{id:"include-libraries-toggle",type:"checkbox",checked:d,onChange:$=>{const W=$.target.checked;h(W),W||(g(!1),m(null))},"aria-label":"Include custom libraries"}),n.jsx(ia,{$checked:d}),n.jsx("span",{children:"Include custom libraries"})]})}),d&&n.jsxs(n.Fragment,{children:[c&&n.jsxs(sa,{children:[n.jsx(aa,{}),n.jsx("span",{children:"Analyzing configuration..."})]}),b&&n.jsx(la,{children:b}),!c&&!b&&s.length===0&&n.jsx(xo,{children:"No custom libraries loaded."}),!c&&!b&&s.length>0&&f.length===0&&n.jsx(xo,{children:"No custom footprints or libraries are used in this configuration."}),!c&&!b&&f.length>0&&n.jsx(ca,{children:f.map(($,W)=>n.jsxs(da,{children:[n.jsx(ua,{id:`injection-${$.name}`,type:"checkbox",checked:$.checked,onChange:()=>M(W),"aria-label":$.name}),n.jsx(fa,{$type:$.type,children:$.type}),n.jsx(pa,{htmlFor:`injection-${$.name}`,children:$.name})]},`${$.type}-${$.name}`))})]}),n.jsx(yo,{children:n.jsx(ha,{onClick:y,disabled:c,children:"Share"})})]}):n.jsxs(n.Fragment,{children:[n.jsx(bo,{children:"Shareable Configuration Link"}),n.jsx(wo,{children:"Share this link with others to let them view and use your keyboard configuration, including all of your custom footprints."}),n.jsxs(ga,{children:[n.jsx(ma,{ref:S,type:"text",value:j,readOnly:!0,"data-testid":o&&`${o}-input`,"aria-label":"Share link"}),n.jsx(yo,{children:n.jsxs(ba,{onClick:P,"data-testid":o&&`${o}-copy`,"aria-label":E?"Link copied":"Copy link",children:[n.jsx("span",{className:"material-symbols-outlined",children:E?"check":"content_copy"}),E?"Link copied":"Copy link"]})})]})]})]})})},Qs=u.div`
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
`,ea=u.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: relative;
`,ta=u.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${r.colors.textDark};
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
    font-size: ${r.fontSizes.iconLarge};
  }

  &:hover {
    background-color: ${r.colors.buttonHover};
    color: ${r.colors.text};
  }
`,bo=u.h2`
  margin: 0 0 1rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
  padding-right: 3rem;
`,wo=u.p`
  margin: 0 0 1.5rem 0;
  font-size: ${r.fontSizes.base};
  color: ${r.colors.textDark};
  line-height: 1.5;
`,na=u.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`,oa=u.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  font-family: ${r.fonts.body};
  font-size: ${r.fontSizes.base};
  color: ${r.colors.text};
`,ra=u.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`,ia=u.span`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 22px;
  background-color: ${e=>e.$checked?r.colors.accent:r.colors.backgroundLighter};
  border: 1px solid ${r.colors.border};
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
    background-color: ${r.colors.white};
    border-radius: 50%;
    transition: transform 0.2s ease;
    transform: ${e=>e.$checked?"translateX(22px)":"translateX(0)"};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }
`,sa=u.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.5rem 0;
  color: ${r.colors.textDark};
`,aa=u.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${r.colors.border};
  border-top: 2px solid ${r.colors.accent};
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
`,la=u.p`
  color: ${r.colors.error};
  font-size: ${r.fontSizes.sm};
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: ${r.colors.errorDark}22;
  border: 1px solid ${r.colors.error};
  border-radius: 6px;
`,xo=u.p`
  color: ${r.colors.textDarker};
  font-size: ${r.fontSizes.sm};
  margin: 1rem 0;
  font-style: italic;
`,ca=u.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${r.colors.border};
  border-radius: 6px;
  background-color: ${r.colors.backgroundLighter};
  margin: 1rem 0 1.5rem 0;
  padding: 0.5rem;
`,da=u.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${r.colors.backgroundLight};
  }
`,ua=u.input`
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: ${r.colors.accent};
`,pa=u.label`
  cursor: pointer;
  flex: 1;
  color: ${r.colors.text};
  font-size: ${r.fontSizes.sm};
  user-select: none;
`,fa=u.span`
  font-size: ${r.fontSizes.xs};
  font-weight: ${r.fontWeights.bold};
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  color: ${r.colors.white};
  background-color: ${e=>{switch(e.$type){case"footprint":return"#007bff";case"outline":return"#e83e8c";case"template":return"#fd7e14";default:return r.colors.border}}};
`,ha=u.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: ${r.colors.accent};
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  color: ${r.colors.white};
  font-family: ${r.fonts.body};
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  cursor: pointer;
  transition:
    background-color 0.15s ease-in-out,
    transform 0.15s ease-in-out;
  margin-top: 1rem;

  &:hover {
    background-color: ${r.colors.accentDark};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,ga=u.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: stretch;
`,yo=u.div`
  display: flex;
  justify-content: center;
  width: 100%;

  @media (min-width: 500px) {
    width: auto;
  }
`,ma=u.input`
  flex: 1;
  background-color: ${r.colors.backgroundLighter};
  border: 1px solid ${r.colors.border};
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: ${r.colors.text};
  font-family: ${r.fonts.body};
  font-size: ${r.fontSizes.base};
  outline: none;
  transition: border-color 0.15s ease-in-out;

  &:focus {
    border-color: ${r.colors.accent};
  }

  &::selection {
    background-color: ${r.colors.accent};
    color: ${r.colors.white};
  }
`,ba=u.button`
  white-space: nowrap;
  flex-shrink: 0;
  width: 125px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: ${r.colors.accent};
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: ${r.colors.white};
  font-family: ${r.fonts.body};
  font-size: ${r.fontSizes.base};
  cursor: pointer;
  transition:
    background-color 0.15s ease-in-out,
    transform 0.15s ease-in-out;

  .material-symbols-outlined {
    font-size: ${r.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${r.colors.accentDark};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,yr=3e4,ko=e=>e.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled",wa=e=>{try{return JSON.parse(e)}catch{try{return fe.load(e)}catch{return e}}},tn=(e,t)=>{const i=new Map;for(const o of t){const[s,a,l]=o;let d="footprints";s==="outline"?d="outlines":s==="template"&&(d="templates");const h=e.folder(d);if(h){const c=a.split("/"),g=c.pop();let b=h,m=d;for(const j of c){const x=`${m}/${j}`;let f=i.get(x);f||(f=b.folder(j)||b,i.set(x,f)),b=f,m=x}g&&b.file(`${g}.js`,l)}}},kr=(e,t,i,o,s)=>{var a;if((a=i.demo)!=null&&a.svg&&e.file("demo.svg",i.demo.svg),i.outlines){let l=null;for(const[d,h]of Object.entries(i.outlines))(o||!d.startsWith("_"))&&(h.dxf||h.svg)&&(l||(l=e.folder("outlines")),l&&(h.dxf&&l.file(`${d}.dxf`,h.dxf),h.svg&&l.file(`${d}.svg`,h.svg)))}if(i.pcbs&&Object.keys(i.pcbs).length>0){const l=e.folder("pcbs");if(l)for(const[d,h]of Object.entries(i.pcbs)){const c=d.endsWith(".kicad_pcb")?d:`${d}.kicad_pcb`;l.file(c,h)}}if(i.cases){let l=null;for(const[d,h]of Object.entries(i.cases)){const c=!!h.jscad,g=s&&!!h.stl;(c||g)&&(l||(l=e.folder("cases")),l&&(h.jscad&&l.file(`${d}.jscad`,h.jscad),g&&h.stl&&l.file(`${d}.stl`,h.stl)))}}if(o){const l=e.folder("debug");if(l){l.file("raw.txt",t);for(const[d,h]of Object.entries(i))["canonical","points","units"].includes(d)&&l.file(`${d}.yaml`,JSON.stringify(h,null,2))}}},nn=async(e,t)=>{const i=await e.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),o=new Date().toISOString().replace(/[:.]/g,"-").split("T")[0];Ur.saveAs(i,`${t}-${o}.zip`)},xa=(e,t,i,o)=>new Promise((s,a)=>{if(o()){a(new Error("Aborted"));return}const l=cn();if(!l){a(new Error("Failed to create Ergogen worker"));return}i.add(l);const d=()=>{clearTimeout(h),l.terminate(),i.delete(l)},h=setTimeout(()=>{d(),a(new Error("Compilation timed out"))},yr);l.onmessage=c=>{const g=c.data;g.type==="error"?(d(),a(new Error(g.error))):g.type==="success"&&(d(),s(g.results))},l.onerror=c=>{d(),a(c)},l.postMessage({type:"generate",inputConfig:wa(e),injectionInput:t,requestId:`export-compile-${Date.now()}`})}),ya=(e,t,i)=>new Promise(o=>{if(i()||!e.cases||Object.keys(e.cases).length===0){o(e);return}const s=Qo();if(!s){o(e);return}t.add(s);const a=()=>{clearTimeout(l),s.terminate(),t.delete(s)},l=setTimeout(()=>{a(),o(e)},yr);s.onmessage=d=>{const h=d.data;h.type==="success"?(a(),o(h.results)):h.type==="error"&&(a(),o(e))},s.onerror=()=>{a(),o(e)},s.postMessage({type:"batch_jscad_to_stl",results:e,configVersion:0})}),_r=async(e,t,i,o,s)=>{const a=new ln;a.file("config.yaml",t);const l=a.folder("outputs");l&&kr(l,t,e,o,s),i&&i.length>0&&tn(a,i),await nn(a,"ergogen")},ka=async(e,t,i,o,s,a,l)=>{const d=new ln,h=new Set;if(s){for(let w=0;w<e.length;w++){if(l())return;const k=e[w];a(w,e.length,k.name);const L=ko(k.name);let E=L,I=1;for(;h.has(E);)E=`${L}_${I}`,I++;h.add(E),d.file(`${E}.yaml`,k.config)}if(t&&t.length>0){if(l())return;tn(d,t)}return l()?void 0:(a(e.length,e.length,"Creating ZIP..."),await nn(d,"ergogen-config-all"),{succeededCount:e.length,failedCount:0})}const c=new Set,g=new Set;let b=0,m=0,j=0;const x=Math.min(4,navigator.hardwareConcurrency||2),f=async w=>{if(l())return;g.add(w.name),a(b,e.length,Array.from(g).join(", "));const k=ko(w.name),L=d.folder(k);if(!L){g.delete(w.name),b++,a(b,e.length,Array.from(g).join(", "));return}try{const E=await xa(w.config,t,c,l);let I=E;if(E.cases&&Object.keys(E.cases).length>0&&(I=await ya(E,c,l)),l())return;L.file("config.yaml",w.config);const S=L.folder("outputs");S&&kr(S,w.config,I,i,!0),t&&t.length>0&&tn(L,t),m++}catch(E){j++,console.error(`Failed to compile config ${w.name}:`,E),L.file("config.yaml",w.config),L.file("error.txt",`Compilation failed: ${E instanceof Error?E.message:String(E)}`)}finally{g.delete(w.name),b++,a(b,e.length,Array.from(g).join(", "))}};try{const w=[...e],k=[],L=async()=>{if(l()||w.length===0)return;const E=w.shift();await f(E),await L()};for(let E=0;E<Math.min(x,w.length);E++)k.push(L());if(await Promise.all(k),l()){c.forEach(E=>E.terminate()),c.clear();return}return a(e.length,e.length,"Creating ZIP..."),await nn(d,"ergogen-export-all"),{succeededCount:m,failedCount:j}}finally{c.forEach(w=>w.terminate()),c.clear()}},_a=u.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${r.colors.accentSecondary};
  border-radius: 6px;
  padding: 0 0.5em;
  margin-left: 1em;
  font-family: ${r.fonts.body};
  font-size: ${r.fontSizes.bodySmall};
  height: 1.7em;
  min-width: 2.2em;
  color: ${r.colors.white};
  box-sizing: border-box;
  user-select: none;
`;function va(){return n.jsx(n.Fragment,{children:n.jsxs("span",{children:[mr()?"⌘":"Ctrl"," ⏎"]})})}const ja=u.div`
  width: 100%;
  height: 3em;
  display: none;
  align-items: center;
  border-bottom: 1px solid ${r.colors.border};
  flex-direction: row;
  gap: 10px;
  padding: 0 1rem;
  flex-shrink: 0;

  @media (max-width: 639px) {
    display: flex;
    padding: 0 0.5rem;
  }
`,$a=u.div`
  flex-grow: 1;
`,_o=u(Ne)`
  display: none;

  @media (max-width: 475px) {
    display: flex;
  }
`,Ca=u.button`
  background-color: ${r.colors.accentSecondary};
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
  font-family: ${r.fonts.body};
  padding: 8px 12px !important;

  .material-symbols-outlined {
    font-size: ${r.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${r.colors.accentDark};
  }
`,vo=u.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
`,Sa=u.div`
  display: flex;
  gap: 10px;
  align-items: stretch;
  padding: 10px;

  @media (max-width: 639px) {
    display: none;
  }
`,Ea=u.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
  padding: 0;
`,jo=u(Es)`
  height: 100%;
`,Pa=u.div`
  height: 100%;
  overflow-y: auto;
`,Ia=u(ts)`
  position: relative;
  flex-grow: 1;
  min-height: 0;
`,La=u.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`,za=u.div`
  height: 100%;
  overflow-y: auto;
  padding: 0.5rem;

  @media (min-width: 640px) {
    padding: 1rem;
  }
`,Ra=u.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 640px) {
    display: none;
  }
`,Da=u.button`
  background: none;
  border: none;
  color: ${r.colors.textDark};
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
    font-size: ${r.fontSizes.iconLarge};
  }

  &:hover {
    background-color: ${r.colors.buttonHover};
    color: ${r.colors.text};
  }

  @media (min-width: 640px) {
    display: none;
  }
`,$o=u.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: row;

  @media (max-width: 639px) {
    width: ${e=>e.$fullWidth?"100%":"auto"};
  }
`,Co=u.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
`,Aa=u.div`
  display: flex;
  height: 100%;
  width: 100%;
`,Na=({pwaState:e})=>{const t=()=>Math.max(200,window.innerWidth*.33),i=()=>Math.max(150,window.innerWidth*.15),o=()=>Math.max(350,window.innerWidth*.15),[s,a]=p.useState({key:"demo.svg",extension:"svg",content:""}),[l,d]=p.useState(!1),h=y=>{a(y),f!=null&&f.showConfig||f==null||f.setShowDownloads(!1)},[c,g]=p.useState({key:-1,type:"",name:"",content:""}),[b,m]=p.useState(!1),[j,x]=p.useState(window.innerWidth<=639),f=ve(),w=!0;p.useEffect(()=>{const y=()=>{x(window.innerWidth<=639)};return window.addEventListener("resize",y),()=>window.removeEventListener("resize",y)},[]),Wr(mr()?"meta+enter":"ctrl+enter",y=>{var P,$;($=(P=y==null?void 0:y.target)==null?void 0:P.closest)!=null&&$.call(P,".monaco-editor")||f&&(F("shortcut_used",{action:"generate"}),f.generateNow(Zt(f),f.injectionInput,{pointsonly:!1,isManual:!0}))},{enableOnFormTags:!0,preventDefault:!0,ignoreEventWhen:y=>{var P,$;return!!(($=(P=y.target)==null?void 0:P.closest)!=null&&$.call(P,".monaco-editor"))}}),p.useEffect(()=>{if(c.key===-1||c.name===""||c.content==="")return;const y=[c.type,c.name,c.content];let P=[];Array.isArray(f==null?void 0:f.injectionInput)&&(P=[...f.injectionInput]);const $=P.length;if($===0||$===c.key)P.push(y),g({...c,key:$});else{const W=P[c.key];if(W[0]===c.type&&W[1]===c.name&&W[2]===c.content)return;P=P.map((O,D)=>D===c.key?y:O)}f==null||f.setInjectionInput(P)},[f,c]);const k=Zt(f),L=Ls(f==null?void 0:f.results,s.key,s.extension,k),E=p.useRef(null),I=!!(f!=null&&f.results);if(p.useEffect(()=>{if(!I){E.current=null;return}if(!L.key||!L.extension)return;const y=`${L.key}|${L.extension}`;E.current!==y&&(E.current=y,F("preview_loaded",{preview_type:L.extension,preview_key:L.key}))},[L.key,L.extension,I]),!f)return null;const S=y=>{const P={...c,name:y.target.value};g(P)},U=y=>{if(!Array.isArray(f==null?void 0:f.injectionInput))return;F("injection_deleted",{injection_type:y.type});const P=[...f.injectionInput].filter(($,W)=>W!==y.key);if(f.setInjectionInput(P),c.key===y.key)g({key:-1,type:"",name:"",content:""});else if(c.key>=y.key){const $={...c,key:c.key-1};g($)}},A=()=>{var W;const y=((W=f.getRealtimeConfigInput)==null?void 0:W.call(f))??f.configInput;if(y===void 0)return;F("download_button_clicked",{download_type:"yaml",source:"editor"});const P=document.createElement("a"),$=new Blob([y],{type:"text/yaml"});P.href=URL.createObjectURL($),P.download="config.yaml",document.body.appendChild(P),P.click(),URL.revokeObjectURL(P.href),document.body.removeChild(P)},R=()=>{var y,P;k&&(F("share_button_clicked",{has_injections:!!((y=f.injectionInput)!=null&&y.length),injections_count:((P=f.injectionInput)==null?void 0:P.length)||0,source:"subheader"}),d(!0))},M=()=>{var y,P,$;!f.results||!k||f.isGenerating||f.isJscadConverting||(F("archive_single_downloaded",{has_injections:!!((y=f.injectionInput)!=null&&y.length),injections_count:((P=f.injectionInput)==null?void 0:P.length)||0,stored_configs_count:(($=f.configs)==null?void 0:$.length)||0,source:"subheader"}),_r(f.results,k,f.injectionInput,f.debug,f.stlPreview))};return n.jsxs(n.Fragment,{children:[l&&n.jsx(xr,{config:k,injections:f.injectionInput||[],onClose:()=>d(!1)}),n.jsxs(Ea,{children:[!f.showSettings&&n.jsxs(ja,{children:[n.jsx(Ne,{className:f.showConfig?"active":"",onClick:()=>f.setShowConfig(!0),"aria-label":"Show configuration panel","data-testid":"mobile-config-button",children:"Config"}),n.jsx(Ne,{className:f.showConfig?"":"active",onClick:()=>f.setShowConfig(!1),"aria-label":"Show outputs panel","data-testid":"mobile-outputs-button",children:"Outputs"}),n.jsx($a,{}),f.showConfig&&n.jsxs(n.Fragment,{children:[n.jsx(Ca,{onClick:()=>f.generateNow(k,f.injectionInput,{pointsonly:!1,isManual:!0}),"aria-label":"Generate configuration","data-testid":"mobile-generate-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"refresh"})}),n.jsx(_o,{onClick:R,disabled:!k,"aria-label":"Share configuration","data-testid":"mobile-share-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"share"})}),n.jsx(Ne,{onClick:A,"aria-label":"Download configuration","data-testid":"mobile-download-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})]}),!f.showConfig&&n.jsxs(n.Fragment,{children:[n.jsx(_o,{onClick:M,disabled:f.isGenerating||f.isJscadConverting,"aria-label":"Download archive of all generated files","data-testid":"mobile-download-outputs-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),n.jsx(Ne,{onClick:()=>f.setShowDownloads(!f.showDownloads),"aria-label":f.showDownloads?"Hide downloads panel":"Show downloads panel","data-testid":"mobile-downloads-toggle-button",children:n.jsx("span",{className:"material-symbols-outlined",children:f.showDownloads?"expand_content":"collapse_content"})})]})]}),n.jsx(Aa,{children:f.showSettings?n.jsxs(n.Fragment,{children:[n.jsx(Wt,{initialWidth:o(),minWidth:150,maxWidth:"70%",side:"left","data-testid":"settings-panel",style:{display:b&&j?"none":void 0},children:n.jsxs(za,{children:[n.jsxs(La,{children:[n.jsx(rt,{children:"General"}),n.jsxs(it,{children:[n.jsx(De,{optionId:"autogen",label:"Auto-generate",description:"Automatically generate new outputs and update previews on changes.",setSelected:f.setAutoGen,checked:f.autoGen,"aria-label":"Enable auto-generate"}),n.jsx(De,{optionId:"autogen3d",label:"Auto-generate PCB & 3D",description:"Build 3D models and PCB files during generation (can be slow).",setSelected:f.setAutoGen3D,checked:f.autoGen3D,"aria-label":"Enable auto-generate PCB and 3D (slow)"}),n.jsx(De,{optionId:"debug",label:"Debug",description:"Include debug files in the outputs.",setSelected:f.setDebug,checked:f.debug,"aria-label":"Enable debug mode"})]}),n.jsx(rt,{children:"Previews (Experimental)"}),n.jsxs(it,{children:[n.jsx(De,{optionId:"kicanvasPreview",label:"KiCad Preview",description:"Render interactive PCB layouts using KiCanvas.",setSelected:f.setKicanvasPreview,checked:f.kicanvasPreview,"aria-label":"Enable KiCad preview (experimental)"}),n.jsx(De,{optionId:"stlPreview",label:"STL Preview",description:"Render 3D preview of generated cases.",setSelected:f.setStlPreview,checked:f.stlPreview,"aria-label":"Enable STL preview (experimental)"})]}),n.jsx(rt,{children:"Privacy"}),n.jsx(it,{children:n.jsx(De,{optionId:"sendUsageMetrics",label:"Send Usage Metrics",description:w?"Help improve Ergogen Web UI by sharing anonymous usage statistics.":"Unavailable: this copy of Ergogen Web UI was built without an analytics tag ID, so no usage statistics are sent.",setSelected:f.setSendUsageMetrics,checked:w&&f.sendUsageMetrics,disabled:!w,"aria-label":"Send usage metrics"})}),e&&n.jsxs(n.Fragment,{children:[n.jsx(rt,{children:"Offline"}),n.jsx(it,{children:n.jsx(Ks,{isAvailable:e.isAvailable,isInstalled:e.isInstalled,isInstalling:e.isInstalling,onInstall:e.onInstall})})]})]}),n.jsx(ks,{setInjectionToEdit:g,deleteInjection:U,injectionToEdit:c,onInjectionSelect:()=>m(!0),"data-testid":"injections-container"})]})}),n.jsx($o,{$fullWidth:b&&j,children:n.jsxs(vo,{children:[j&&n.jsxs(Ra,{children:[n.jsxs(pt,{as:"h4",style:{marginTop:0},children:[c.type?c.type.charAt(0).toUpperCase()+c.type.slice(1):"Footprint"," ","name"]}),n.jsx(Da,{onClick:()=>{m(!1),g({key:-1,type:"",name:"",content:""})},"aria-label":"Close editor","data-testid":"mobile-editor-close",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),!j&&n.jsxs(pt,{as:"h4",children:[c.type?c.type.charAt(0).toUpperCase()+c.type.slice(1):"Footprint"," ","name"]}),n.jsx(zs,{value:c.name,onChange:S,disabled:c.key===-1,"aria-label":`${c.type?c.type.charAt(0).toUpperCase()+c.type.slice(1):"Footprint"} name`,"data-testid":"footprint-name-input"}),n.jsxs(pt,{as:"h4",children:[c.type?c.type.charAt(0).toUpperCase()+c.type.slice(1):"Footprint"," ","code"]}),n.jsx(ns,{injection:c,setInjection:g,options:{readOnly:c.key===-1}})]})})]}):n.jsxs(n.Fragment,{children:[f.showConfig&&n.jsx(Wt,{initialWidth:t(),minWidth:250,maxWidth:"60%",side:"left","data-testid":"config-panel",children:n.jsxs(vo,{children:[n.jsx(Ia,{"data-testid":"config-editor"}),n.jsxs(Sa,{children:[n.jsx(qe,{onClick:()=>f.generateNow(k,f.injectionInput,{pointsonly:!1,isManual:!0}),"aria-label":"Generate configuration","data-testid":"generate-button",children:n.jsxs("span",{style:{display:"flex",alignItems:"center",width:"100%",justifyContent:"center"},children:[n.jsx("span",{children:"Generate"}),n.jsx(_a,{children:va()})]})}),n.jsx(Ne,{onClick:A,"aria-label":"Download configuration","data-testid":"download-config-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})]})]})}),n.jsx($o,{$fullWidth:!f.showConfig,children:f.showDownloads?n.jsxs(n.Fragment,{children:[n.jsx(Co,{children:n.jsx(jo,{"data-testid":`${L.key}-file-preview`,previewExtension:L.extension,previewKey:`${L.key}-${f.resultsVersion}`,previewContent:L.content})}),n.jsx(Wt,{initialWidth:i(),minWidth:105,maxWidth:"30%",side:"right","data-testid":"downloads-panel",children:n.jsx(Pa,{children:n.jsx(hs,{setPreview:h,previewKey:L.key,"data-testid":"downloads-container"})})})]}):n.jsx(Co,{children:n.jsx(jo,{"data-testid":`${L.key}-file-preview`,previewExtension:L.extension,previewKey:`${L.key}-${f.resultsVersion}`,previewContent:L.content})})})]})})]})]})},Ua={label:"Absolem",author:"MrZealot",value:`meta:
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
    distance: 223.7529778`},Wa={label:"Atreus",author:"MrZealot",value:`points:
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
`},Oa={label:"A. Dux",author:"tapioki",value:`meta:
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
`},Fa={label:"Corney Island",author:"ceoloide",value:`points:
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
          rotate: 90`},on={label:"Empty YAML configuration",author:"ceoloide",value:`meta:
  engine: 4.1.0
units:
points:
  zones:
    matrix:
outlines:
pcbs:
cases:
`},Ma={label:"Wubbo",author:"cache.works",value:`meta:
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
`},Ba={label:"Sweep-like",author:"jcmkk3",value:`meta:
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
`},Ta={label:"Reviung41",author:"jcmkk3",value:`meta:
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
          row_net: P21
          mirror.row_net: P18
        home:
          row_net: P20
          mirror.row_net: P15
        top:
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
`},Ga={label:"Tiny20",author:"enzocoralc",value:`meta:
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
`},Va={label:"Alpha",author:"jcmkk3",value:`points:
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
`},Ha={label:"Plank",author:"cache.works",value:`meta:
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
`},Ka={label:"Curly-45",author:"peterjc",value:`meta:
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
`},qa={label:"Briefs 56",author:"ceoloide",value:`# Inspired by the Dygma Sonsei
meta:
  name: Briefs 56
  author: ceoloide
  engine: 4.3.0
  version: 1.0.0
units:
  keycap: 18
points:
  mirror: 0
  zones:
    matrix:
      anchor:
        shift: [-6.85u, -3.85u]
        rotate: -13
      columns:
        outer:
        pinky:
        ring:
          key.stagger: 0.45u
        middle:
          key.stagger: 0.15u
        index:
          key.stagger: -0.25u
        inner:
          key.stagger: 0.05u
      rows:
        bottom:
        home:
        top:
        number:
    thumbs:
      anchor:
        ref: matrix_middle_bottom
        shift: [0.3u, -1.25u]
      columns:
        outer:
        middle:
        inner:
          key:
            spread: 1.15u
            stagger: -0.19u
            splay: -19
        tip:
          key:
            spread: 1.1u
            stagger: -0.115u
            splay: -12
      rows:
        thumb:
outlines:
  keys:
    - what: rectangle
      where: true
      size: keycap
      corner: 1.5
  body:
    - what: polygon
      points:
        - shift: [-7.8u, 0]
        - shift: [15.6u, 0]
        - shift: [0, -5u]
        - shift: [-5.35u, -1.1u]
        - shift: [-1.55u, -1.2u]
        - shift: [-1.8u, 0]
        - shift: [-1.55u, 1.2u]
        - shift: [-5.35u, 1.1u]
      fillet: 5
  center:
    - what: polygon
      points:
        - shift: [-0.5u, -1.3u]
        - shift: [0.5u, -0.1u]
        - shift: [0.5u, 0.1u]
        - shift: [0.85u, -4u]
        - shift: [-1.35u, -1.15u]
        - shift: [-1.35u, 1.15u]
      fillet: 2
  preview:
    - what: outline
      name: body
    - what: outline
      name: center
      operation: stack
    - what: outline
      name: keys
      operation: stack
`},Ja={label:"Willy 50",author:"ceoloide",value:`# Inspired by the Keychron Orca Echo
meta:
  name: Willy 50
  author: ceoloide
  engine: 4.3.0
  version: 1.0.0
units:
  keycap: 18
  wheel_width: 0.75u
  wheel_height: u
points:
  zones:
    matrix:
      columns:
        outer:
        pinky:
        ring:
          key.stagger: 0.25u
        middle:
          key.stagger: 0.15u
        index:
          key.stagger: -0.15u
        inner:
          key.stagger: -0.1u
          rows.mod.skip: true
      rows:
        mod:
        bottom:
        home:
        top:
    extra:
      anchor:
        ref: matrix_inner_bottom
        shift: [u, -0.1u]
      columns:
        inner:
      rows:
        key:
    thumb:
      anchor:
        ref: matrix_index_mod
        shift: [1.15u, -0.35u]
        rotate: -24
      columns:
        inner:
      rows:
        key:
    wheel:
      anchor:
        ref: thumb_inner_key
        shift: [0.95u, 0]
      key:
        width: wheel_width
        height: wheel_height
      columns:
        scroll:
      rows:
        key:
outlines:
  keys:
    - what: rectangle
      where: -wheel_scroll_key
      size: keycap
      corner: 1.5
  # Use wheel_scroll_key as the anchor for a future scroll-wheel footprint.
  wheel:
    - what: rectangle
      where: wheel_scroll_key
      size: [wheel_width, wheel_height]
      corner: 1
    # Grip ribs distinguish the scroll wheel from a keycap.
    - what: rectangle
      operation: stack
      where:
        ref: wheel_scroll_key
        shift: [-0.3u, 0]
      size: [0.025u, 0.85u]
    - what: rectangle
      operation: stack
      where:
        ref: wheel_scroll_key
        shift: [-0.15u, 0]
      size: [0.025u, 0.85u]
    - what: rectangle
      operation: stack
      where:
        ref: wheel_scroll_key
        shift: [0u, 0]
      size: [0.025u, 0.85u]
    - what: rectangle
      operation: stack
      where:
        ref: wheel_scroll_key
        shift: [0.15u, 0]
      size: [0.025u, 0.85u]
    - what: rectangle
      operation: stack
      where:
        ref: wheel_scroll_key
        shift: [0.3u, 0]
      size: [0.025u, 0.85u]
  body:
    - what: polygon
      where: matrix_outer_mod
      points:
        - shift: [-0.75u, -0.75u]
        - shift: [2.4u, 0]
        - shift: [0.2u, 0.25u]
        - shift: [2.35u, 0]
        - shift: [1.85u, -0.8u]
        - shift: [0.75u, 1.7u]
        - shift: [0, 3.5u]
        - shift: [-2.05u, 0]
        - shift: [-0.35u, 0.15u]
        - shift: [-0.9u, 0]
        - shift: [-0.2u, 0.1u]
        - shift: [-0.9u, 0]
        - shift: [-0.25u, -0.15u]
        - shift: [-0.9u, 0]
        - shift: [-0.15u, -0.25u]
        - shift: [-1.85u, 0]
      fillet: 1
  preview:
    - what: outline
      name: body
    - what: outline
      name: keys
      operation: stack
    - what: outline
      name: wheel
      operation: stack
`},Xa=[on],Ya=[Ua,Wa],Za=[Oa,Fa,Ba,Ta,Ga],Qa=[Ma,Va,Ha,Ka,qa,Ja],el=[{label:"Empty configurations",options:Xa},{label:"Simple (points only)",options:Ya},{label:"Complete (with pcb)",options:Za},{label:"Miscellaneous",options:Qa}],tl=e=>{var o;const t=fe.load(e.value),i=((o=t==null?void 0:t.meta)==null?void 0:o.engine)??(t==null?void 0:t["meta.engine"]);return i===null?void 0:i},nl=(e,t=Je())=>{const i=tl(e);return i===void 0?!0:typeof i=="string"&&vi(t,i)},ol=(e=Je())=>el.map(t=>({...t,options:t.options.filter(i=>nl(i,e))})).filter(t=>t.options.length>0),rl=async e=>new Promise((t,i)=>{const o=new FileReader;o.onload=s=>{var a;(a=s.target)!=null&&a.result&&typeof s.target.result=="string"?t(s.target.result):i(new Error("Failed to read file as text"))},o.onerror=()=>i(new Error("Failed to read file")),o.readAsText(e)}),il=async e=>{const i=e.name.toLowerCase().split(".").pop(),o=i==="zip"||i==="ekb";if(Jt(e.size,o),i==="yaml"||i==="yml"||i==="json")return{config:await rl(e),footprints:[],outlines:[],templates:[]};if(o){const s=await e.arrayBuffer(),a=await Pi(s),l=a.injections.filter(c=>c.type==="footprint").map(c=>({name:c.name,content:c.content})),d=a.injections.filter(c=>c.type==="outline").map(c=>({name:c.name,content:c.content})),h=a.injections.filter(c=>c.type==="template").map(c=>({name:c.name,content:c.content}));return{config:a.config,footprints:l,outlines:d,templates:h}}else throw new Error("Unsupported file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")},rn=()=>n.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-github",viewBox:"0 0 98 96",children:n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z",fill:"currentColor"})}),So=()=>n.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 4.2333332 4.2333335",version:"1.1",fill:"currentColor",children:[n.jsxs("defs",{children:[n.jsxs("linearGradient",{id:"linearGradient6924-6",children:[n.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:0},offset:"0"}),n.jsx("stop",{offset:"0.49517274",style:{stopColor:"#ffffff",stopOpacity:.3}}),n.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:.3},offset:"1"})]}),n.jsx("linearGradient",{id:"linearGradient6918-3",x1:"42519.285",y1:"-7078.7891",x2:"42575.336",y2:"-6966.9307",gradientUnits:"userSpaceOnUse",href:"#linearGradient6924-6"})]}),n.jsxs("g",{transform:"matrix(0.06551432,0,0,0.06551432,-2.232417,-1.431776)",children:[n.jsx("path",{id:"path6733-5",style:{fontVariationSettings:"normal",opacity:1,vectorEffect:"none",fill:"url(#linearGradient6918-3)",fillOpacity:1,stroke:"none",strokeWidth:3.67846,strokeLinecap:"butt",strokeLinejoin:"miter",strokeMiterlimit:2,strokeDashoffset:0,strokeOpacity:1,paintOrder:"stroke markers fill",stopColor:"#000000",stopOpacity:1},d:"m 42519.285,-7078.7891 a 0.76086879,0.56791688 0 0 0 -0.738,0.6739 l 33.586,125.8886 a 87.182358,87.182358 0 0 0 39.381,-33.7636 l -71.565,-92.5196 a 0.76086879,0.56791688 0 0 0 -0.664,-0.2793 z",transform:"matrix(0.37058478,0,0,0.37058478,-15690.065,2662.0533)"}),n.jsx("path",{id:"path360787",style:{opacity:1,fill:"#ffffff",fillOpacity:1,strokeWidth:17.0055,paintOrder:"markers fill stroke",stopColor:"#000000"},d:"m 11249.461,-1883.6961 c -12.74,0 -23.067,10.3275 -23.067,23.0671 0,4.3335 1.22,8.5795 3.522,12.2514 l 19.232,-24.8636 c 0.138,-0.1796 0.486,-0.1796 0.624,0 l 19.233,24.8646 c 2.302,-3.6721 3.523,-7.9185 3.523,-12.2524 0,-12.7396 -10.327,-23.0671 -23.067,-23.0671 z",transform:"matrix(1.4006354,0,0,1.4006354,-15690.065,2662.0533)"})]})]}),Eo=()=>n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 212 212",fill:"none",stroke:"currentColor",children:n.jsxs("g",{transform:"translate(6,6)",children:[n.jsx("path",{d:"M58 168 v-98 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),n.jsx("path",{d:"M58 168 v-30 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),n.jsx("circle",{cx:"142",cy:"20",r:"18",strokeWidth:"15"}),n.jsx("circle",{cx:"142",cy:"88",r:"18",strokeWidth:"15"}),n.jsx("circle",{cx:"58",cy:"180",r:"18",strokeWidth:"15"})]})}),sn=u.div`
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid ${r.colors.accent};
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
`,sl=u.div`
  background-color: ${r.colors.background};
  color: ${r.colors.white};
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: border-color 0.2s ease;

  ${e=>e.$isDragging&&`
    border: 3px dashed ${r.colors.accent};
    border-radius: 8px;
  `}
`,al=u.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${e=>e.$isVisible?"flex":"none"};
  align-items: center;
  justify-content: center;
  z-index: 999;
  pointer-events: none;
`,ll=u.div`
  background-color: ${r.colors.backgroundLight};
  border: 3px dashed ${r.colors.accent};
  border-radius: 8px;
  padding: 2rem;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
  text-align: center;
`,cl=u.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 640px) {
    padding: 1rem 0.5rem;
  }
`,dl=u.h1`
  font-size: ${r.fontSizes.h1};
  text-align: center;
  margin-bottom: 1rem;
`,ul=u.p`
  font-size: ${r.fontSizes.lg};
  text-align: center;
  margin-bottom: 3rem;
  color: ${r.colors.textDark};
`,pl=u.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`,Ot=u.div`
  background-color: ${r.colors.backgroundLight};
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid ${r.colors.border};
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
    color: ${r.colors.textDarker};
    margin-bottom: 1.5rem;
    flex-grow: 1;
  }
`,fl=u.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;

  button {
    flex-shrink: 0;
  }
`,hl=u.div`
  display: flex;
  align-items: stretch;
  flex: 1;
  min-width: 0;
  background-color: ${r.colors.backgroundLighter};
  border: 1px solid ${r.colors.border};
  border-radius: 6px;
  box-sizing: border-box;
  transition: border-color 0.15s ease-in-out;

  &:focus-within {
    border-color: ${r.colors.accent};
  }
`,gl=u.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  user-select: none;
`,ml=u.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: transparent;
  border: none;
  padding: 0 0.5rem 0 0.75rem;
  cursor: pointer;
  height: 100%;
  color: ${r.colors.white};

  transition: background-color 0.15s ease-in-out;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;

  &:hover {
    background-color: ${r.colors.buttonHover};
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
    color: ${r.colors.textDarker};
    display: block;
    margin-right: -0.15rem;
  }
`,bl=u.div`
  width: 1px;
  background-color: ${r.colors.border};
  margin: 0.75rem 0;
  flex-shrink: 0;
`,wl=u.input`
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  padding: 1rem 1rem 1rem 0.5rem;
  color: ${r.colors.text};
  font-family: ${r.fonts.body};
  font-size: ${r.fontSizes.base};
  outline: none;

  &::selection {
    background-color: ${r.colors.accent};
    color: ${r.colors.white};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`,xl=u.div`
  position: absolute;
  top: 105%;
  left: 0;
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 6px;
  padding: 0.25rem 0;
  min-width: 130px;
  z-index: 105;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
`,Ft=u.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  font-size: ${r.fontSizes.bodySmall};
  color: ${({$active:e})=>e?r.colors.white:r.colors.textDark};
  background-color: ${({$active:e})=>e?r.colors.accent:"transparent"};
  cursor: pointer;

  &:hover {
    background-color: ${({$active:e})=>e?r.colors.accent:r.colors.backgroundLighter};
    color: ${r.colors.white};
  }

  svg {
    width: 16px;
    height: 16px;
    color: currentColor;
    display: block;
  }
`,yl=u(pe)`
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

  ${sn} {
    margin-right: 0;
  }
`,kl=u.input`
  display: none;
`,Po=u.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`,Io=u.div`
  background-color: ${r.colors.backgroundLight};
  border-radius: 8px;
  border: 1px solid ${r.colors.border};
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
`,_l=u.img`
  width: 100%;
  height: 150px;
  object-fit: contain;
  padding: 8px;
  box-sizing: border-box;
  background-color: ${r.colors.backgroundLighter};
`,Lo=u.div`
  padding: 1rem;
  font-weight: ${r.fontWeights.semiBold};
  text-align: center;
`,vl=u.div`
  width: 100%;
  height: 150px;
  padding: 8px;
  box-sizing: border-box;
  background-color: ${r.colors.backgroundLighter};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`,jl=u.div`
  width: 100%;
  height: 150px;
  box-sizing: border-box;
  background-color: ${r.colors.backgroundLighter};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${r.colors.textDarker};

  .material-symbols-outlined {
    font-size: 4rem;
  }
`,$l=()=>{const e=Je(),t=p.useMemo(()=>ol(e).flatMap(_=>_.options).filter(_=>_.label!=="Empty YAML configuration"),[e]),i=an(),o=ve(),[s,a]=p.useState(""),[l,d]=p.useState("github"),[h,c]=p.useState(!1),[g,b]=p.useState(!1),m=h||g,[j,x]=p.useState(!1),f=p.useRef(null),[w,k]=p.useState(!1);p.useEffect(()=>{const _=V=>{f.current&&!f.current.contains(V.target)&&k(!1)};return document.addEventListener("mousedown",_),()=>document.removeEventListener("mousedown",_)},[]);const[L,E]=p.useState(!1),I=_=>{a(_),_.includes("github.com/")?d("github"):_.includes("codeberg.org/")?d("codeberg"):(_.startsWith("http://")||_.startsWith("https://")||_.includes("/")&&!_.includes("github.com/")&&!_.includes("codeberg.org/")&&_.split("/")[0].includes("."))&&d("forgejo")},{currentConflict:S,processInjectionsWithConflictResolution:U,handleConflictResolution:A,handleConflictCancel:R}=_t({setInjectionInput:_=>o==null?void 0:o.setInjectionInput(_),setConfigInput:_=>o==null?void 0:o.setConfigInput(_),generateNow:async(_,V,H)=>{o&&await o.generateNow(_,V,H)},getCurrentInjections:()=>(o==null?void 0:o.injectionInput)||[],onComplete:async()=>{x(!0)},setError:_=>o==null?void 0:o.setError(_)});p.useEffect(()=>{const _=new URLSearchParams(window.location.search),V=_.has("github")||_.has("codeberg")||_.has("forgejo")||_.has("gitea");(j||V)&&(o!=null&&o.configInput)&&(i("/"),x(!1))},[j,o==null?void 0:o.configInput,i]),p.useEffect(()=>{var _;(_=o==null?void 0:o.pruneDeletedConfigs)==null||_.call(o)},[o]);const M=async _=>{if(o){const V=_===on.value;let H="unknown";if(V)H="empty_configuration";else{const ee=t.find(K=>K.value===_);ee&&(H=ee.label.toLowerCase().replace(/\s+/g,"_"))}F("example_loaded",{example_name:H,is_empty:V}),o.createNewConfig(_),await o.generateNow(_,o.injectionInput,{pointsonly:!1}),x(!0)}},y=async _=>{if(o){const V=o.configs.find(H=>H.id===_);V&&(o.selectConfig(_),F("saved_config_loaded",{stored_configs_count:o.configs.length}),await o.generateNow(V.config,o.injectionInput,{pointsonly:!1}),x(!0))}},$=[...(o==null?void 0:o.configs)||[]].sort((_,V)=>new Date(V.updatedAt).getTime()-new Date(_.updatedAt).getTime()).slice(0,4),W=async(_,V,H,ee,K=null,se)=>{if(!o)throw new Error("Configuration context not available");const ie=dr(_,V,H);await U(ie,ee,K,se)},O=async(_,V)=>{await A(_,V)},D=()=>{R(),c(!1),b(!1),o==null||o.setIsGenerating(!1)},q=()=>{if(!s||!o)return;const{setError:_,clearError:V,setIsGenerating:H}=o;b(!0),H(!0),V(),F("repo_loaded",{provider:l});let ee=s.trim();if(!ee.includes("://")&&!ee.includes("github.com")&&!ee.includes("codeberg.org"))if(l==="codeberg")ee=`https://codeberg.org/${ee}`;else if(l==="forgejo"){const K=ee.split("/");if(K.length>=2&&K[0].includes("."))ee=`https://${ee}`;else{_("Forgejo/Gitea requires a URL including the host (e.g., host/owner/repo)"),b(!1),H(!1);return}}else ee=`https://github.com/${ee}`;ur(ee).then(async K=>{if(o){K.rateLimitWarning&&_(K.rateLimitWarning);try{o.createNewConfig(K.config),await W(K.footprints,K.outlines,K.templates||[],K.config)}catch(se){throw new Error(`Failed to process footprints: ${se instanceof Error?se.message:"Unknown error"}`)}}}).catch(K=>{_(`Failed to load from ${l==="github"?"GitHub":l==="codeberg"?"Codeberg":"Forgejo/Gitea"} repository: ${K.message}`),o==null||o.setInfo(null),b(!1),H(!1)}).finally(()=>{b(!1)})},J=p.useRef(null),ne=()=>{var _;(_=J.current)==null||_.click()},Z=async _=>{if(!o)return;const{setError:V,clearError:H,setIsGenerating:ee}=o;c(!0),ee(!0),H(),F("local_file_loaded",{file_type:Zr(_.name),file_size:_.size});try{const K=await il(_);o.createNewConfig(K.config),await W(K.footprints,K.outlines,K.templates||[],K.config)}catch(K){V(`Failed to load local file: ${K instanceof Error?K.message:"Unknown error"}`),o.setInfo(null),c(!1),ee(!1)}finally{c(!1)}},B=async _=>{var H;const V=(H=_.target.files)==null?void 0:H[0];V&&(_.target.value="",await Z(V))},N=_=>{_.preventDefault(),_.stopPropagation(),!m&&E(!0)},T=_=>{_.preventDefault(),_.stopPropagation()},Q=_=>{if(_.preventDefault(),_.stopPropagation(),m)return;const V=_.currentTarget,H=_.relatedTarget;(!H||!V.contains(H))&&E(!1)},G=async _=>{if(_.preventDefault(),_.stopPropagation(),m)return;E(!1);const V=Array.from(_.dataTransfer.files),H=[".yaml",".yml",".json",".zip",".ekb"],ee=V.find(K=>{const se=K.name.toLowerCase();return H.some(ie=>se.endsWith(ie))});ee?await Z(ee):V.length>0&&o&&o.setError("Invalid file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")};return n.jsxs(sl,{$isDragging:L,onDragEnter:N,onDragOver:T,onDragLeave:Q,onDrop:G,"data-testid":"welcome-page-wrapper",children:[n.jsx(al,{$isVisible:L,children:n.jsx(ll,{children:"Drop file here to load configuration"})}),S&&n.jsx(kt,{injectionName:S.name,injectionType:S.type,onResolve:O,onCancel:D,"data-testid":"conflict-dialog"}),n.jsxs(cl,{children:[n.jsx(dl,{children:"Ergogen Web UI"}),n.jsxs(ul,{children:["A web-based interface for Ergogen, the ergonomic keyboard generator.",n.jsx("br",{}),"Start a new design below."]}),n.jsxs(pl,{children:[n.jsxs(Ot,{children:[n.jsx("h2",{children:"Start Fresh"}),n.jsx("p",{children:"Begin with a completely blank slate."}),n.jsx(pe,{onClick:()=>M(on.value),"aria-label":"Start with empty configuration","data-testid":"empty-config-button",children:"Empty Configuration"})]}),n.jsxs(Ot,{children:[n.jsx("h2",{children:"From Local File"}),n.jsx("p",{children:"Load a configuration from your computer. Supports *.yaml, *.json, *.zip, and *.ekb files."}),n.jsx(kl,{ref:J,type:"file",accept:".yaml,.yml,.json,.zip,.ekb",onChange:B,disabled:m,"aria-label":"Select local file to load","data-testid":"local-file-input"}),n.jsx(pe,{onClick:ne,disabled:m,"aria-label":"Select local file to load","data-testid":"local-file-button",children:h?n.jsxs(n.Fragment,{children:[n.jsx(sn,{})," Loading..."]}):"Choose File"})]}),n.jsxs(Ot,{children:[n.jsx("h2",{children:"From Repo"}),n.jsx("p",{children:'Link to a YAML config file on a Git provider (e.g. GitHub, Codeberg, Forgejo), or simply a repository name like "user/repo".'}),n.jsx(fl,{children:n.jsxs(hl,{children:[n.jsxs(gl,{ref:f,children:[n.jsxs(ml,{type:"button",onClick:()=>k(!w),disabled:m,"aria-label":"Repository provider source","data-testid":"repo-provider-trigger",children:[l==="github"?n.jsx(rn,{}):l==="codeberg"?n.jsx(So,{}):n.jsx(Eo,{}),n.jsx("span",{className:"material-symbols-outlined",children:"arrow_drop_down"})]}),w&&n.jsxs(xl,{children:[n.jsxs(Ft,{$active:l==="github",onClick:()=>{d("github"),k(!1)},children:[n.jsx(rn,{}),"GitHub"]}),n.jsxs(Ft,{$active:l==="codeberg",onClick:()=>{d("codeberg"),k(!1)},children:[n.jsx(So,{}),"Codeberg"]}),n.jsxs(Ft,{$active:l==="forgejo",onClick:()=>{d("forgejo"),k(!1)},children:[n.jsx(Eo,{}),"Forgejo"]})]})]}),n.jsx(bl,{}),n.jsx(wl,{placeholder:l==="forgejo"?"host/user/repo":"user/repo",value:s,onChange:_=>I(_.target.value),onKeyDown:_=>{_.key==="Enter"&&!m&&s.trim()!==""&&(_.preventDefault(),q())},disabled:m,"aria-label":"Repository URL or path","data-testid":"repo-input"}),n.jsx(yl,{onClick:q,disabled:m||!s,"aria-label":"Load configuration from repository","data-testid":"repo-load-button",children:g?n.jsx(sn,{}):n.jsx("span",{className:"material-symbols-outlined",style:{display:"block"},children:"cloud_download"})})]})})]})]}),$.length>0&&n.jsxs(n.Fragment,{children:[n.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:r.fontSizes.h2},children:"Pick up where you left"}),n.jsx(Po,{style:{marginBottom:"3rem"},children:$.map(_=>n.jsxs(Io,{onClick:()=>y(_.id),"aria-label":`Load ${_.name} configuration`,"data-testid":`saved-config-${_.name.toLowerCase().replace(/\s+/g,"-")}`,children:[_.previewSvg?n.jsx(vl,{dangerouslySetInnerHTML:{__html:_.previewSvg}}):n.jsx(jl,{children:n.jsx("span",{className:"material-symbols-outlined",children:"keyboard_off"})}),n.jsx(Lo,{children:_.name})]},_.id))})]}),n.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:r.fontSizes.h2},children:"Or start from an example"}),n.jsx(Po,{children:t.map(_=>n.jsxs(Io,{onClick:()=>M(_.value),"aria-label":`Load ${_.label} example`,"data-testid":`example-${_.label.toLowerCase().replace(/\s+/g,"-")}`,children:[n.jsx(_l,{src:`/images/previews/${_.label.toLowerCase().replace(/[\s()]/g,"_")}.svg`,alt:`${_.label} preview`}),n.jsx(Lo,{children:_.label})]},_.label))})]})]})},vr=({versionInfo:e,"data-testid":t})=>{const[i,o]=p.useState(!1),s=p.useRef(null),a=()=>{s.current&&clearTimeout(s.current),o(!0)},l=()=>{s.current=setTimeout(()=>{o(!1)},250)},d=()=>{s.current&&clearTimeout(s.current)},h=()=>{s.current=setTimeout(()=>{o(!1)},250)},c=g=>{g.stopPropagation(),o(b=>!b)};return p.useEffect(()=>{if(!i)return;const g=()=>{o(!1)};return window.addEventListener("click",g),()=>{window.removeEventListener("click",g)}},[i]),p.useEffect(()=>()=>{s.current&&clearTimeout(s.current)},[]),n.jsxs(Cl,{onMouseEnter:a,onMouseLeave:l,"data-testid":t,children:[n.jsx(Sl,{onClick:c,"data-testid":t&&`${t}-badge`,"aria-label":"Custom Ergogen version indicator",children:n.jsx("span",{className:"material-symbols-outlined",children:"science"})}),i&&n.jsxs(El,{onMouseEnter:d,onMouseLeave:h,onClick:g=>g.stopPropagation(),"data-testid":t&&`${t}-popover`,children:[n.jsx(Pl,{children:"Custom Ergogen Version"}),n.jsx(Il,{children:"This website is running a custom version of Ergogen for development and preview purposes."}),n.jsxs(Ll,{href:e.url,target:"_blank",rel:"noopener noreferrer","data-testid":t&&`${t}-link`,children:[n.jsx("span",{children:e.label}),n.jsx("span",{className:"material-symbols-outlined open-icon",children:"open_in_new"})]})]})]})},Cl=u.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  transform: translateY(-5px);
`,Sl=u.span`
  background-color: ${r.colors.accent};
  color: ${r.colors.white};
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
    background-color: ${r.colors.accentDark};
  }
`,El=u.div`
  position: absolute;
  top: 100%;
  left: 4px;
  margin-top: 6px;
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
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
`,Pl=u.div`
  font-size: 12px;
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
`,Il=u.div`
  font-size: 11px;
  color: ${r.colors.textDark};
  line-height: 1.4;
`,Ll=u.a`
  font-size: 11px;
  color: ${r.colors.accent};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
  font-weight: ${r.fontWeights.semiBold};
  align-self: flex-start;
  word-break: break-all;

  .open-icon {
    font-size: 11px !important;
  }

  &:hover {
    color: ${r.colors.accentDark};
    text-decoration: underline;
  }
`,zl=bt`
  0%   { box-shadow: 0 0 0 0   ${r.colors.accent}99; }
  70%  { box-shadow: 0 0 0 6px ${r.colors.accent}00; }
  100% { box-shadow: 0 0 0 0   ${r.colors.accent}00; }
`,Rl=bt`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`,Dl=u.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  height: 28px;
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 6px;
  color: ${r.colors.white};
  font-size: 11px;
  font-weight: ${r.fontWeights.semiBold};
  cursor: pointer;
  white-space: nowrap;
  animation: ${zl} ${e=>e.$isUpdating?"0.6s":"2s"}
    ease-out infinite;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  .material-symbols-outlined {
    font-size: 14px !important;
    ${e=>e.$isUpdating&&Ho`
        animation: ${Rl} 1s linear infinite;
      `}
  }

  &:hover {
    background-color: ${r.colors.backgroundLighter};
  }

  &:disabled {
    cursor: default;
    background-color: ${r.colors.backgroundLight};
    opacity: 0.95;
  }
`,Al=({onClick:e,"data-testid":t})=>{const[i,o]=p.useState(!1),s=()=>{o(!0),e()};return n.jsxs(Dl,{onClick:s,disabled:i,$isUpdating:i,"aria-label":i?"Updating version...":"Update available — click to reload and apply","data-testid":t??"update-chip",children:[n.jsx("span",{className:"material-symbols-outlined","aria-hidden":"true",children:i?"sync":"update"}),i?"Updating version...":"Update Available"]})},Nl=u.header`
  width: 100%;
  height: 3em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  background-color: ${r.colors.background};
  flex-shrink: 0;
  position: relative;
  z-index: 100;
  border-bottom: 1px solid ${r.colors.border};

  @media (max-width: 639px) {
    padding: 0 0.5rem;
    border-bottom: none;
  }
`,Ul=u.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: row;
  flex-grow: 1;
  min-width: 0;
  width: 100%;
`,Wl=u.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,Ol=u.div`
  display: flex;
  align-items: center;
  gap: 6px;
`,Fl=u.div`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  display: flex;
  align-items: center;
  @media (max-width: 639px) {
    display: none;
  }
`,vt=u.button`
  background-color: transparent;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  border: 1px solid ${r.colors.border};
  border-radius: 6px;
  color: ${r.colors.white};
  display: flex;
  align-items: center;
  padding: 8px 12px;
  text-decoration: none;
  cursor: pointer;
  font-size: ${r.fontSizes.bodySmall};
  line-height: 16px;
  gap: 6px;
  height: 34px;

  .material-symbols-outlined {
    font-size: ${r.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`,Ml=u(vt)`
  flex-shrink: 0;
`,Bl=u(vt)`
  background-color: ${r.colors.accent};
  border-color: ${r.colors.accent};

  &:hover {
    background-color: ${r.colors.accentDark};
    border-color: ${r.colors.accentDarker};
  }

  @media (max-width: 375px) {
    display: none;
  }
`,Tl=u.span`
  @media (max-width: 510px) {
    display: none;
  }
`,zo=u(vt)`
  @media (max-width: 475px) {
    display: none;
  }
`,Gl=u(Xo)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,Vl=u.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,Hl=({onUpdate:e})=>{const t=ve(),i=an(),o=Jo(),{activeConfigId:s,activeConfigName:a,configs:l,isPreview:d,renameConfig:h,duplicateConfig:c,deleteConfig:g,savePreviewConfig:b}=t||{},[m,j]=p.useState(!1),[x,f]=p.useState(!1),[w,k]=p.useState(""),L=()=>{a&&s&&(k(a),f(!0))},E=D=>{D&&D.stopPropagation(),!(h&&s&&w.trim()&&!h(s,w.trim()))&&f(!1)},I=D=>{D&&D.stopPropagation(),f(!1)},S=D=>{D.key==="Enter"?E():D.key==="Escape"&&f(!1)},U=D=>{D.stopPropagation(),c&&s&&c(s)},A=D=>{D.stopPropagation(),s&&a&&g&&window.confirm(`Are you sure you want to delete "${a}"?`)&&(g(s),(l&&l.length<=1||s)&&i("/new"))},R=()=>{t==null||t.setShowSettings(!(t!=null&&t.showSettings))},M=()=>{t==null||t.setShowSettings(!1),t==null||t.selectConfig(null),i("/new")},y=Zt(t),P=()=>{var D,q,J;!(t!=null&&t.results)||!y||t!=null&&t.isGenerating||t!=null&&t.isJscadConverting||(F("archive_single_downloaded",{has_injections:!!((D=t.injectionInput)!=null&&D.length),injections_count:((q=t.injectionInput)==null?void 0:q.length)||0,stored_configs_count:((J=t.configs)==null?void 0:J.length)||0,source:"header"}),_r(t.results,y,t.injectionInput,t.debug,t.stlPreview))},$=()=>{var D,q;!t||!y||(F("share_button_clicked",{has_injections:!!((D=t.injectionInput)!=null&&D.length),injections_count:((q=t.injectionInput)==null?void 0:q.length)||0,source:"header"}),j(!0))},W=()=>{t==null||t.setShowSideNav(!(t!=null&&t.showSideNav))},O=p.useMemo(()=>dn("github:ceoloide/ergogen#v4.3.0"),[]);return n.jsxs(n.Fragment,{children:[m&&n.jsx(xr,{config:y,injections:(t==null?void 0:t.injectionInput)||[],onClose:()=>j(!1),"data-testid":"share-dialog"}),n.jsxs(Nl,{children:[n.jsxs(Ul,{children:[n.jsx(Ml,{onClick:W,"aria-label":t!=null&&t.showSideNav?"Hide navigation panel":"Show navigation panel","data-testid":"side-nav-toggle-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"side_navigation"})}),n.jsxs(Ol,{children:[n.jsx(Gl,{to:"/","aria-label":"Go to home page","data-testid":"logo-button",children:n.jsx(Vl,{src:"/ergogen.png",alt:"Ergogen logo"})}),n.jsxs(Fl,{children:["Ergogen",O.isCustom&&n.jsx(vr,{versionInfo:O,"data-testid":"header-dev-chip"})]})]}),a&&n.jsxs(n.Fragment,{children:[n.jsx(ql,{children:"/"}),n.jsxs(Kl,{"data-testid":"header-active-config-name",$isEditing:x,onClick:!x&&!d?L:void 0,children:[d&&n.jsx(Xl,{"data-testid":"header-shared-icon",children:n.jsx("span",{className:"material-symbols-outlined",children:"link"})}),x?n.jsxs(n.Fragment,{children:[n.jsx(Jl,{type:"text",value:w,onChange:D=>k(D.target.value),onBlur:E,onKeyDown:S,autoFocus:!0,"data-testid":"header-config-name-input","aria-label":"Edit configuration name"}),n.jsxs(Mt,{className:"header-actions-always-visible",children:[n.jsx(He,{onMouseDown:D=>{D.preventDefault()},onClick:E,"aria-label":"Confirm rename","data-testid":"header-confirm-rename-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"check"})}),n.jsx(He,{onMouseDown:D=>{D.preventDefault()},onClick:I,"aria-label":"Cancel rename","data-testid":"header-cancel-rename-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]})]}):d?n.jsxs(n.Fragment,{children:[n.jsx(Do,{"data-testid":"header-config-name-text",children:a}),n.jsx(Mt,{className:"header-actions-always-visible",children:n.jsx(He,{onClick:D=>{D.stopPropagation(),b==null||b()},"aria-label":"Save preview configuration","data-testid":"header-save-preview-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"save"})})})]}):n.jsxs(n.Fragment,{children:[n.jsx(Do,{title:"Click to rename","data-testid":"header-config-name-text",children:a}),n.jsxs(Mt,{className:"header-actions-hover",children:[n.jsx(He,{onClick:L,"aria-label":"Rename configuration","data-testid":"header-rename-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),n.jsx(Ro,{onClick:U,"aria-label":"Duplicate configuration","data-testid":"header-duplicate-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),n.jsx(Ro,{onClick:A,"aria-label":"Delete configuration","data-testid":"header-delete-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})]})]})]}),n.jsxs(Wl,{children:[e&&n.jsx(Al,{onClick:e,"data-testid":"header-update-chip"}),o.pathname==="/"&&n.jsxs(n.Fragment,{children:[n.jsxs(Bl,{onClick:M,"aria-label":"Start new configuration","data-testid":"new-config-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"add_2"}),n.jsx(Tl,{children:"New"})]}),n.jsx(zo,{onClick:P,disabled:(t==null?void 0:t.isGenerating)||(t==null?void 0:t.isJscadConverting),"aria-label":"Download archive of all generated files","data-testid":"header-download-outputs-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),n.jsx(zo,{onClick:$,disabled:!(t!=null&&t.configInput),"aria-label":"Share configuration","data-testid":"header-share-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"share"})})]}),o.pathname!=="/new"&&n.jsx(vt,{onClick:R,"aria-label":t!=null&&t.showSettings?"Hide settings panel":"Show settings panel","data-testid":"settings-button",children:n.jsx("span",{className:"material-symbols-outlined",children:t!=null&&t.showSettings?"keyboard_alt":"settings"})})]})]})]})},Kl=u.div`
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
  cursor: ${e=>e.$isEditing?"default":"pointer"};
  border: 1px solid
    ${e=>e.$isEditing?r.colors.accent:"transparent"};
  background-color: ${e=>e.$isEditing?r.colors.backgroundLight:"transparent"};
  width: 220px;
  box-sizing: border-box;

  &:hover {
    background-color: ${e=>e.$isEditing?r.colors.backgroundLight:r.colors.buttonHover};
    .header-actions-hover {
      opacity: 1;
    }
  }

  @media (max-width: 767px) {
    width: 160px;
    border-color: ${e=>e.$isEditing?r.colors.accent:r.colors.border};
  }
`,Mt=u.div`
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
`,He=u.button`
  background: none;
  border: none;
  color: ${r.colors.textDark};
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
    background-color: ${r.colors.buttonHover};
    color: ${r.colors.white};
  }
`,Ro=u(He)`
  @media (max-width: 767px) {
    display: none;
  }
`,ql=u.span`
  color: ${r.colors.textDark};
  font-size: ${r.fontSizes.sm};
  font-weight: ${r.fontWeights.semiBold};
  user-select: none;
  @media (max-width: 639px) {
    display: none;
  }
`,Do=u.span`
  font-size: ${r.fontSizes.bodySmall};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  user-select: none;
`,Jl=u.input`
  background: transparent;
  border: none;
  color: ${r.colors.white};
  font-size: ${r.fontSizes.bodySmall};
  font-weight: ${r.fontWeights.semiBold};
  padding: 0;
  flex: 1;
  outline: none;
  height: 100%;
  min-width: 0;
`,Xl=u.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${r.colors.accent};
  color: ${r.colors.white};
  padding: 4px;
  border-radius: 4px;
  flex-shrink: 0;
  user-select: none;

  .material-symbols-outlined {
    font-size: 16px !important;
  }
`,Yl=bt`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
`,Zl=u.div`
  position: fixed;
  top: 45px;
  left: 0;
  right: 0;
  width: 100%;
  height: 3px;
  background-color: transparent;
  overflow: hidden;
  z-index: 1000;
`,Ql=u.div`
  height: 100%;
  width: 25%;
  background-color: ${r.colors.accent};
  animation: ${Yl} 1.5s ease-in-out infinite;
`,ec=({visible:e,"data-testid":t})=>e?n.jsx(Zl,{"data-testid":t,children:n.jsx(Ql,{})}):null,st={info:{background:r.colors.info,text:r.colors.infoDark},warning:{background:r.colors.warning,text:r.colors.warningDark},error:{background:r.colors.error,text:r.colors.errorDark},success:{background:r.colors.success,text:r.colors.successDark}},at=u.span.attrs({className:"material-symbols-outlined"})`
  font-size: ${r.fontSizes.iconLarge};
  margin-right: 1rem;
`,lt=u.div`
  display: flex;
  align-items: center;
`,ct=u.p`
  margin: 0;
`,dt=u.div`
  padding: 1rem 1.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: ${({type:e})=>st[e].text};
  background-color: ${({type:e})=>st[e].background};
  border: 1px solid ${({type:e})=>st[e].text};

  .material-symbols-outlined {
    color: ${({type:e})=>st[e].text};
  }
`,tc=u.div`
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
`,ut=u.button`
  background: none;
  border: none;
  color: inherit;
  font-size: ${r.fontSizes.h3};
  cursor: pointer;
  padding: 0;
  line-height: 1;
  margin-left: auto;
  padding-left: 1rem;
`,nc=()=>{const e=ve();if(!e)return null;const{error:t,deprecationWarning:i,skippedWarning:o,info:s,clearError:a,clearWarning:l,clearSkippedWarning:d,clearInfo:h}=e;return n.jsxs(tc,{"data-testid":"banners-container",children:[s&&n.jsxs(dt,{type:"info","data-testid":"info-banner",children:[n.jsxs(lt,{children:[n.jsx(at,{children:"info"}),n.jsx(ct,{children:s})]}),n.jsx(ut,{onClick:h,"aria-label":"Close info message","data-testid":"close-info-banner",children:"×"})]}),i&&n.jsxs(dt,{type:"warning","data-testid":"warning-banner",children:[n.jsxs(lt,{children:[n.jsx(at,{children:"warning"}),n.jsx(ct,{children:i})]}),n.jsx(ut,{onClick:l,"aria-label":"Close warning message","data-testid":"close-warning-banner",children:"×"})]}),o&&n.jsxs(dt,{type:"warning","data-testid":"skipped-injections-banner",children:[n.jsxs(lt,{children:[n.jsx(at,{children:"warning"}),n.jsx(ct,{children:o})]}),n.jsx(ut,{onClick:d,"aria-label":"Close feature warning message","data-testid":"close-skipped-banner",children:"×"})]}),t&&n.jsxs(dt,{type:"error","data-testid":"error-banner",children:[n.jsxs(lt,{children:[n.jsx(at,{children:"error"}),n.jsx(ct,{children:t})]}),n.jsx(ut,{onClick:a,"aria-label":"Close error message","data-testid":"close-error-banner",children:"×"})]})]})},oc=()=>n.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-discord",viewBox:"0 0 16 16",children:n.jsx("path",{d:"M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"})}),Ao=({label:e,version:t,url:i,isCustom:o=!1,"data-testid":s,devBadgeTestId:a})=>{const l=()=>{window.open(i,"_blank","noopener,noreferrer")};return n.jsxs(rc,{onClick:l,$hasDevBadge:o,"aria-label":`View ${e==="Ergogen"?"Ergogen":`Ergogen ${e}`} ${t} on GitHub`,"data-testid":s,children:[n.jsx(rn,{}),n.jsxs(ic,{children:[n.jsx(sc,{children:e}),n.jsx(ac,{$isCustom:o,children:t})]}),o&&n.jsx(lc,{"data-testid":a,children:n.jsx(cc,{children:"DEV"})})]})},rc=u.button`
  background-color: transparent;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  border: 1px solid ${r.colors.border};
  border-radius: 6px;
  color: ${r.colors.white};
  display: flex;
  align-items: center;
  padding: 8px ${e=>e.$hasDevBadge?"22px":"10px"} 8px 10px;
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
    background-color: ${r.colors.buttonHover};
  }
`,ic=u.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  line-height: 1.1;
  min-width: 0;
`,sc=u.span`
  font-size: 10px;
  font-weight: ${r.fontWeights.bold};
  color: ${r.colors.white};
  white-space: nowrap;
`,ac=u.span`
  font-size: 8px;
  color: ${e=>e.$isCustom?r.colors.accent:r.colors.textDark};
  white-space: nowrap;
`,lc=u.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 16px;
  background-color: ${r.colors.backgroundLighter};
  border-left: 1px solid ${r.colors.border};
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
`,cc=u.span`
  font-size: 8px;
  font-weight: ${r.fontWeights.bold};
  color: ${r.colors.accent};
  transform: rotate(-90deg);
  white-space: nowrap;
  line-height: 1;
`,dc=({isOpen:e,onClose:t,"data-testid":i})=>{const o=p.useRef(e),[s,a]=p.useState(e),[l,d]=p.useState(360),h=p.useRef(!1),c=p.useRef(0),g=p.useRef(360),b=ve(),m=an(),j=wt.version,{configs:x,activeConfigId:f,selectConfig:w,renameConfig:k,duplicateConfig:L,deleteConfig:E,setIsBulkDownloadOpen:I}=b||{},[S,U]=p.useState(""),[A,R]=p.useState(null),[M,y]=p.useState(""),P=p.useMemo(()=>{if(!x)return[];let N=x;if(S.trim()){const T=S.toLowerCase().split(/\s+/).filter(Boolean);T.length>0&&(N=x.filter(Q=>{const G=Q.name.toLowerCase();return T.some(_=>G.includes(_))}))}return[...N].sort((T,Q)=>{const G=T.updatedAt?new Date(T.updatedAt).getTime():0,_=Q.updatedAt?new Date(Q.updatedAt).getTime():0;if(G!==_)return _-G;const V=T.createdAt?new Date(T.createdAt).getTime():0,H=Q.createdAt?new Date(Q.createdAt).getTime():0;return V!==H?H-V:T.name.localeCompare(Q.name)})},[x,S]),$=()=>{w&&w(null),m("/new"),t()},W=()=>{F("bulk_download_dialog_opened",{stored_configs_count:(x==null?void 0:x.length)||0}),I&&I(!0),t()},O=N=>{w&&(w(N),m("/"),t())},D=(N,T)=>{R(N),y(T)},q=N=>{k&&M.trim()&&!k(N,M.trim())||R(null)},J=N=>{L&&L(N)},ne=(N,T)=>{if(window.confirm(`Are you sure you want to delete "${T}"?`)&&E){E(N);const Q=f===N,G=x&&x.length<=1;(Q||G)&&(m("/new"),t())}};p.useEffect(()=>{const N=o.current;e&&!N?a(!0):!e&&N&&a(!1),e||R(null),o.current=e},[e]),p.useEffect(()=>{if(!S.trim())return;const N=setTimeout(()=>{F("search_performed",{query_length:S.trim().length})},1e3);return()=>clearTimeout(N)},[S]),p.useEffect(()=>{const N=_=>{if(!h.current)return;const V=_.clientX-c.current,H=g.current+V,ee=Math.min(600,window.innerWidth*.9),K=Math.max(360,Math.min(H,ee));d(K)},T=()=>{h.current&&(h.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},Q=_=>{if(!h.current)return;_.preventDefault();const H=_.touches[0].clientX-c.current,ee=g.current+H,K=Math.min(600,window.innerWidth*.9),se=Math.max(360,Math.min(ee,K));d(se)},G=()=>{h.current&&(h.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",N),window.addEventListener("mouseup",T),window.addEventListener("touchmove",Q,{passive:!1}),window.addEventListener("touchend",G),()=>{window.removeEventListener("mousemove",N),window.removeEventListener("mouseup",T),window.removeEventListener("touchmove",Q),window.removeEventListener("touchend",G)}},[]);const Z=N=>{N.preventDefault(),N.stopPropagation(),h.current=!0,g.current=l,"touches"in N?c.current=N.touches[0].clientX:c.current=N.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};p.useEffect(()=>{if(!e)return;const N=T=>{T.key==="Escape"&&t()};return window.addEventListener("keydown",N),()=>{window.removeEventListener("keydown",N)}},[e,t]);const B=p.useMemo(()=>dn("github:ceoloide/ergogen#v4.3.0"),[]);return p.useEffect(()=>(e?document.body.style.overflow="hidden":document.body.style.overflow="",()=>{document.body.style.overflow=""}),[e]),n.jsxs(n.Fragment,{children:[n.jsx(uc,{"data-testid":i,onClick:t,$isOpen:e,$isOpening:s}),n.jsxs(pc,{"data-testid":i&&`${i}-panel`,$isOpen:e,$isOpening:s,$width:l,onClick:N=>N.stopPropagation(),children:[n.jsx(Uc,{onMouseDown:Z,onTouchStart:Z,"data-testid":i&&`${i}-resize-handle`}),n.jsxs(fc,{children:[n.jsxs(hc,{children:[n.jsx(gc,{to:"/",onClick:t,"aria-label":"Go to home page","data-testid":"side-nav-logo-button",children:n.jsx(mc,{src:"/ergogen.png",alt:"Ergogen logo"})}),n.jsxs(bc,{onClick:t,children:["Ergogen",B.isCustom&&n.jsx(vr,{versionInfo:B,"data-testid":"sidebar-dev-chip"})]})]}),n.jsx(wc,{onClick:t,"data-testid":i&&`${i}-close`,"aria-label":"Close navigation panel",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),n.jsxs(xc,{children:[n.jsxs(yc,{children:[n.jsxs(kc,{onClick:$,"aria-label":"New","data-testid":"side-nav-new-config-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"add"}),n.jsx("span",{children:"New"})]}),x&&x.length>0&&n.jsxs(_c,{onClick:W,"aria-label":"Download All","data-testid":"side-nav-download-all-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"download"}),n.jsx("span",{children:"Download All"})]})]}),n.jsxs(vc,{children:[n.jsx("span",{className:"material-symbols-outlined search-icon",children:"search"}),n.jsx(jc,{type:"text",placeholder:"Search configurations...",value:S,onChange:N=>U(N.target.value),"aria-label":"Search configurations"}),S&&n.jsx($c,{onClick:()=>U(""),children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),n.jsxs(Cc,{children:[n.jsx("span",{children:"Saved Configurations"}),n.jsx(Sc,{children:P.length})]}),n.jsxs(Ec,{children:[P.map(N=>{const T=N.id===f,Q=A===N.id;return n.jsx(Pc,{$isActive:T,"data-testid":`config-item-${N.id}`,children:Q?n.jsxs(zc,{onSubmit:G=>{G.preventDefault(),q(N.id)},children:[n.jsx(Rc,{type:"text",value:M,onChange:G=>y(G.target.value),autoFocus:!0,"aria-label":"Rename input"}),n.jsx(No,{type:"submit","aria-label":"Save name",children:n.jsx("span",{className:"material-symbols-outlined",children:"check"})}),n.jsx(No,{type:"button",onClick:()=>R(null),"aria-label":"Cancel rename",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}):n.jsxs(n.Fragment,{children:[n.jsxs(Ic,{onClick:()=>O(N.id),$isActive:T,title:N.name,children:[n.jsx("span",{className:"material-symbols-outlined",children:"description"}),n.jsx("span",{className:"config-title-text",children:N.name})]}),n.jsxs(Lc,{$isActive:T,children:[n.jsx(Bt,{onClick:()=>D(N.id,N.name),"aria-label":`Rename configuration ${N.name}`,children:n.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),n.jsx(Bt,{onClick:()=>J(N.id),"aria-label":`Duplicate configuration ${N.name}`,children:n.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),n.jsx(Bt,{onClick:()=>ne(N.id,N.name),"aria-label":`Delete configuration ${N.name}`,children:n.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})},N.id)}),P.length===0&&n.jsx(Dc,{children:"No configurations found"})]})]}),n.jsx(Ac,{children:n.jsxs(Nc,{children:[n.jsxs(Uo,{onClick:()=>{window.open("https://docs.ergogen.xyz/","_blank","noopener,noreferrer")},"aria-label":"Open documentation","data-testid":"side-nav-docs-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"description"}),n.jsx("span",{children:"Docs"})]}),n.jsx(Uo,{onClick:()=>{window.open("https://discord.ergogen.xyz","_blank","noopener,noreferrer")},"aria-label":"Join the Discord community","data-testid":"side-nav-discord-button",children:n.jsx(oc,{})}),n.jsx(Ao,{label:"Web UI",version:j,url:"https://github.com/ceoloide/ergogen-gui","data-testid":"side-nav-gui-version-button"}),n.jsx(Ao,{label:"Ergogen",version:B.displayText,url:B.url,isCustom:B.isCustom,"data-testid":"side-nav-ergogen-version-button",devBadgeTestId:"side-nav-ergogen-dev-badge"})]})})]})]})},uc=u.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
  opacity: ${e=>e.$isOpen?1:0};
  transition: opacity ${e=>e.$isOpening?"0.2s":"0.1s"}
    ease-in-out;
  pointer-events: ${e=>e.$isOpen?"auto":"none"};
`,pc=u.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: ${e=>e.$width}px;
  max-width: min(600px, 90vw);
  background-color: ${r.colors.backgroundLight};
  border-right: 1px solid ${r.colors.border};
  box-shadow: ${e=>e.$isOpen?"4px 0 20px rgba(0, 0, 0, 0.5)":"none"};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transform: translateX(${e=>e.$isOpen?"0":"-100%"});
  transition:
    transform ${e=>e.$isOpening?"0.2s":"0.1s"} ease-in-out,
    box-shadow ${e=>e.$isOpening?"0.2s":"0.1s"} ease-in-out;

  @media (max-width: 639px) {
    width: 100%;
    max-width: 100%;
  }
`,fc=u.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 3em;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
`,hc=u.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`,gc=u(Xo)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,mc=u.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,bc=u.div`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  cursor: pointer;
  display: flex;
  align-items: center;
`,wc=u.button`
  background: none;
  border: none;
  color: ${r.colors.textDark};
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
    font-size: ${r.fontSizes.iconLarge};
  }

  &:hover {
    background-color: ${r.colors.buttonHover};
    color: ${r.colors.text};
  }
`,xc=u.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`,yc=u.div`
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
  flex-shrink: 0;
`,kc=u.button`
  flex: 1;
  background-color: ${r.colors.accent};
  color: ${r.colors.white};
  border: none;
  border-radius: 6px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: ${r.fontSizes.bodySmall};
  font-weight: ${r.fontWeights.regular};
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
  padding: 0 6px;

  .material-symbols-outlined {
    font-size: 20px;
  }

  &:hover {
    background-color: ${r.colors.accentDark};
  }
`,_c=u.button`
  flex: 1;
  background-color: transparent;
  color: ${r.colors.white};
  border: 1px solid ${r.colors.border};
  border-radius: 6px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: ${r.fontSizes.bodySmall};
  font-weight: ${r.fontWeights.regular};
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
  padding: 0 6px;

  .material-symbols-outlined {
    font-size: 20px;
  }

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`,vc=u.div`
  position: relative;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  .search-icon {
    position: absolute;
    left: 8px;
    color: ${r.colors.textDark};
    pointer-events: none;
    font-size: 18px;
  }
`,jc=u.input`
  width: 100%;
  background-color: ${r.colors.backgroundLighter};
  border: 1px solid ${r.colors.border};
  border-radius: 6px;
  height: 36px;
  padding: 0 34px;
  color: ${r.colors.white};
  font-size: ${r.fontSizes.bodySmall};

  &:focus {
    outline: none;
    border-color: ${r.colors.accent};
  }
`,$c=u.button`
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: ${r.colors.textDark};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;

  .material-symbols-outlined {
    font-size: 16px;
  }

  &:hover {
    color: ${r.colors.white};
  }
`,Cc=u.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: ${r.fontSizes.bodySmall};
  color: ${r.colors.textDark};
  font-weight: ${r.fontWeights.semiBold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
`,Sc=u.span`
  background-color: ${r.colors.border};
  color: ${r.colors.white};
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: ${r.fontWeights.semiBold};
`,Ec=u.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  flex: 1;
`,Pc=u.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  background-color: transparent;
  border: 1px solid
    ${e=>e.$isActive?r.colors.accent:"transparent"};
  padding: 2px 6px;
  height: 38px;
  min-width: 0;
  flex-shrink: 0;

  &:hover {
    background-color: ${r.colors.buttonHover};

    /* Show action buttons on hover */
    .item-actions-hover {
      opacity: 1;
    }
  }
`,Ic=u.button`
  flex: 1;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${e=>e.$isActive?r.colors.white:r.colors.textDark};
  font-weight: ${e=>e.$isActive?r.fontWeights.semiBold:r.fontWeights.regular};
  font-size: ${r.fontSizes.bodySmall};
  text-align: left;
  cursor: pointer;
  min-width: 0;
  padding: 0;
  height: 100%;

  .material-symbols-outlined {
    font-size: 18px;
    color: ${e=>e.$isActive?r.colors.accent:r.colors.textDark};
  }

  .config-title-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    color: ${r.colors.white};
  }
`,Lc=u.div.attrs({className:"item-actions-hover"})`
  display: flex;
  gap: 4px;
  opacity: ${e=>e.$isActive?1:0};
  transition: opacity 0.15s ease-in-out;

  @media (max-width: 1023px) {
    opacity: 1;
  }
`,Bt=u.button`
  background: none;
  border: none;
  color: ${r.colors.textDark};
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
    background-color: ${r.colors.border};
    color: ${r.colors.white};
  }
`,zc=u.form`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 100%;
`,Rc=u.input`
  flex: 1;
  background: transparent;
  border: none;
  height: 100%;
  padding: 0;
  color: ${r.colors.white};
  font-size: ${r.fontSizes.bodySmall};
  font-weight: ${r.fontWeights.semiBold};

  &:focus {
    outline: none;
  }
`,No=u.button`
  background: none;
  border: none;
  color: ${r.colors.textDark};
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
    color: ${r.colors.white};
  }
`,Dc=u.div`
  text-align: center;
  color: ${r.colors.textDark};
  font-size: ${r.fontSizes.bodySmall};
  margin-top: 2rem;
  font-style: italic;
`,Ac=u.div`
  padding: 8px 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`,Nc=u.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  width: 100%;
`,Uo=u.button`
  background-color: transparent;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  border: 1px solid ${r.colors.border};
  border-radius: 6px;
  color: ${r.colors.white};
  display: flex;
  align-items: center;
  padding: 8px 12px;
  text-decoration: none;
  cursor: pointer;
  font-size: ${r.fontSizes.bodySmall};
  line-height: 16px;
  gap: 6px;
  height: 34px;

  .material-symbols-outlined {
    font-size: ${r.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`,Uc=u.div`
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
    background-color: ${r.colors.accent};
  }

  @media (max-width: 639px) {
    display: none;
  }
`,Wc=({isOpen:e,configs:t,injections:i,debug:o,stlPreview:s,onClose:a,"data-testid":l})=>{const[d,h]=p.useState(new Set),[c,g]=p.useState(!0),[b,m]=p.useState(!1),[j,x]=p.useState(0),[f,w]=p.useState(""),k=p.useRef(!1);if(p.useEffect(()=>{e&&(h(new Set(t.map(A=>A.id))),m(!1),x(0),w(""),k.current=!1)},[e,t]),!e)return null;const L=A=>{h(A?new Set(t.map(R=>R.id)):new Set)},E=(A,R)=>{const M=new Set(d);R?M.add(A):M.delete(A),h(M)},I=async()=>{if(d.size===0)return;m(!0),x(0),w(""),k.current=!1;const A=t.filter(R=>d.has(R.id));F("bulk_download_started",{selected_configs_count:d.size,only_configs:c});try{const R=await ka(A,i,o,s,c,(M,y,P)=>{x(M),w(P)},()=>k.current);k.current||(R&&R.succeededCount===0&&R.failedCount>0?F("bulk_download_failed",{selected_configs_count:d.size,failed_configs_count:R.failedCount,only_configs:c,error_message:`All ${R.failedCount} selected configuration(s) failed to compile`}):R&&R.failedCount>0?F("bulk_download_partial",{selected_configs_count:d.size,failed_configs_count:R.failedCount,only_configs:c}):F("bulk_download_completed",{selected_configs_count:d.size,only_configs:c}))}catch(R){console.error("Error during bulk download:",R),F("bulk_download_failed",{selected_configs_count:d.size,only_configs:c,error_message:R instanceof Error?R.message:String(R)})}finally{k.current||a()}},S=()=>{b&&!k.current&&F("bulk_download_cancelled",{selected_configs_count:d.size,completed_configs_count:j,only_configs:c}),k.current=!0,a()},U=d.size>0?j/d.size*100:0;return n.jsx(Oc,{"data-testid":l,children:n.jsxs(Fc,{"data-testid":l&&`${l}-box`,children:[n.jsx(Mc,{children:"Download Configurations"}),b?n.jsxs(n.Fragment,{children:[n.jsxs(td,{children:[n.jsx(nd,{children:n.jsx(od,{style:{width:`${U}%`}})}),n.jsxs(rd,{children:[n.jsx(id,{children:f?f.includes(", ")?n.jsxs("div",{children:["Generating:",n.jsx(sd,{children:f.split(", ").map(A=>n.jsx("li",{children:A},A))})]}):n.jsxs(Fo,{children:["Generating ",f]}):n.jsx(Fo,{children:"Preparing..."})}),n.jsxs(ad,{children:[j," / ",d.size]})]})]}),n.jsx(Oo,{children:n.jsx(ld,{onClick:S,size:"medium",children:"Cancel"})})]}):n.jsxs(n.Fragment,{children:[n.jsx(Tc,{children:t.map(A=>{const R=d.has(A.id);return n.jsx(Gc,{children:n.jsxs(jr,{htmlFor:`bulk-check-${A.id}`,children:[n.jsx(Hc,{id:`bulk-check-${A.id}`,checked:R,onChange:M=>E(A.id,M.target.checked)}),n.jsx(Kc,{$checked:R}),n.jsx(Vc,{children:A.name})]})},A.id)})}),n.jsxs(Bc,{children:[n.jsx(Wo,{onClick:()=>L(!0),children:"Select All"}),n.jsx(Wo,{onClick:()=>L(!1),children:"Deselect All"})]}),n.jsxs(qc,{children:[n.jsx(Jc,{children:"Only download configs"}),n.jsxs(Xc,{$checked:c,htmlFor:"only-configs-switch",children:[n.jsx(Yc,{type:"checkbox",id:"only-configs-switch",checked:c,onChange:A=>g(A.target.checked)}),n.jsx(Zc,{$checked:c}),n.jsx(Qc,{$checked:c})]})]}),!c&&n.jsxs(ed,{children:[n.jsx("span",{className:"material-symbols-outlined",children:"warning"}),n.jsx("span",{children:"Warning: Exporting generated outputs for multiple configurations may take a long time depending on the number of selected configurations, their complexity, and CPU speed."})]}),n.jsxs(Oo,{children:[n.jsx($r,{onClick:S,size:"medium",children:"Cancel"}),n.jsxs(pe,{onClick:I,disabled:d.size===0,size:"medium",children:["Download (",d.size,")"]})]})]})]})})},Oc=u.div`
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
`,Fc=u.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,Mc=u.h2`
  margin: 0 0 1rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
`,Bc=u.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 1.5rem;
`,Wo=u.button`
  background: none;
  border: none;
  color: ${r.colors.textDark};
  font-size: 11px;
  font-weight: ${r.fontWeights.regular};
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${r.colors.border};
    color: ${r.colors.white};
  }
`,Tc=u.div`
  border: 1px solid ${r.colors.border};
  background-color: ${r.colors.background};
  border-radius: 6px;
  padding: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
`,Gc=u.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,Vc=u.span`
  color: ${r.colors.text};
  font-size: 13px;
  user-select: none;
`,jr=u.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  padding: 4px 0;
`,Hc=u.input.attrs({type:"checkbox"})`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`,Kc=u.div`
  width: 16px;
  height: 16px;
  background-color: ${e=>e.$checked?r.colors.accent:"transparent"};
  border: 2px solid
    ${e=>e.$checked?r.colors.accent:r.colors.border};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  flex-shrink: 0;

  &::after {
    content: '';
    display: ${e=>e.$checked?"block":"none"};
    width: 3px;
    height: 6px;
    border: solid ${r.colors.white};
    border-width: 0 2px 2px 0;
    transform: rotate(45deg) translate(-0.5px, -1px);
  }

  ${jr}:hover & {
    border-color: ${r.colors.accent};
  }
`,qc=u.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
`,Jc=u.span`
  color: ${r.colors.text};
  font-size: ${r.fontSizes.base};
  user-select: none;
`,Xc=u.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: pointer;
`,Yc=u.input`
  opacity: 0;
  width: 0;
  height: 0;
`,Zc=u.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${e=>e.$checked?r.colors.accent:r.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`,Qc=u.span`
  position: absolute;
  top: 2px;
  left: ${e=>e.$checked?"18px":"2px"};
  width: 16px;
  height: 16px;
  background-color: ${r.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,ed=u.div`
  background-color: ${r.colors.warning};
  border: 1px solid ${r.colors.warningDark};
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: ${r.colors.warningDark};
  font-size: 13px;
  line-height: 1.4;

  .material-symbols-outlined {
    font-size: 18px;
    flex-shrink: 0;
    margin-top: 1px;
    color: ${r.colors.warningDark};
  }
`,Oo=u.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: auto;
`,td=u.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`,nd=u.div`
  background-color: ${r.colors.border};
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  width: 100%;
`,od=u.div`
  background-color: ${r.colors.accent};
  height: 100%;
  transition: width 0.15s ease-out;
`,rd=u.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`,id=u.div`
  color: ${r.colors.text};
  max-width: 80%;
`,Fo=u.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,sd=u.ul`
  margin: 4px 0 0 16px;
  padding: 0;
  list-style-type: disc;
  color: ${r.colors.textDark};
  font-size: 13px;
  text-align: left;
  max-height: 80px;
  overflow-y: auto;

  li {
    margin-bottom: 2px;
  }
`,ad=u.span`
  color: ${r.colors.textDark};
  font-weight: ${r.fontWeights.semiBold};
`,$r=u(pe)`
  background-color: ${r.colors.backgroundLighter};
  color: ${r.colors.textDark};

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`,ld=u($r)`
  width: 100%;
`;function cd(){return!!(window.location.hostname==="localhost"||window.location.hostname==="[::1]"||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))}function dd(e,t,i){e.addEventListener("statechange",()=>{var o,s;e.state==="installed"&&(navigator.serviceWorker.controller?(console.log("[SW] New content is available. Will be used when all existing tabs are closed or you reload."),(o=i==null?void 0:i.onUpdate)==null||o.call(i,t)):(console.log("[SW] Content is cached for offline use."),(s=i==null?void 0:i.onSuccess)==null||s.call(i,t)))})}async function Cr(e,t){var i;try{const o=await navigator.serviceWorker.register(e);let s=null;const a=l=>{l===null||l===s||(s=l,dd(l,o,t))};o.addEventListener("updatefound",()=>a(o.installing)),o.waiting&&navigator.serviceWorker.controller?(i=t==null?void 0:t.onUpdate)==null||i.call(t,o):a(o.installing)}catch(o){console.error("[SW] Error during service worker registration:",o)}}async function ud(e,t){try{const i=await fetch(e,{headers:{"Service-Worker":"script"}}),o=i.headers.get("content-type");i.status===404||o!==null&&o.indexOf("javascript")===-1?(await(await navigator.serviceWorker.ready).unregister(),window.location.reload()):await Cr(e,t)}catch{console.log("[SW] No internet connection found. App is running in offline mode.")}}function pd(e){!("serviceWorker"in navigator)||new URL("/",window.location.href).origin!==window.location.origin||window.addEventListener("load",()=>{const i="/service-worker.js";cd()?(ud(i,e),navigator.serviceWorker.ready.then(()=>{console.log("[SW] This web app is being served cache-first by a service worker. See https://cra.link/PWA for more details.")})):Cr(i,e)})}const fd=({report:e,onAccept:t,onCancel:i,"data-testid":o})=>n.jsx(hd,{"data-testid":o,children:n.jsxs(gd,{"data-testid":o&&`${o}-box`,children:[n.jsx(md,{children:"Version Compatibility Warning"}),n.jsx(bd,{children:"The shared link was created under a different environment. You may experience compatibility issues."}),n.jsxs(wd,{children:[e.guiWarning&&n.jsxs(Tt,{"data-testid":o&&`${o}-gui-warning`,children:[n.jsxs(Gt,{children:["GUI Version Mismatch",n.jsx(Vt,{"data-testid":"gui-mismatch-badge",children:"Mismatch"})]}),n.jsxs(Ht,{children:["The shared link was created with a newer version of the GUI (",n.jsxs("strong",{children:["v",e.guiWarning.shared]}),") than your current version (",n.jsxs("strong",{children:["v",e.guiWarning.current]}),"). Some interface options or features may not function as expected."]})]}),e.ergogenWarning&&n.jsxs(Tt,{"data-testid":o&&`${o}-ergogen-warning`,children:[n.jsxs(Gt,{children:["Ergogen Version Mismatch",n.jsx(Vt,{"data-testid":"ergogen-mismatch-badge",children:"Mismatch"})]}),n.jsxs(Ht,{children:["The shared link was created with a newer version of Ergogen (",n.jsx("strong",{children:e.ergogenWarning.shared}),") than your current version (",n.jsx("strong",{children:e.ergogenWarning.current}),"). Some features or syntax might not be supported."]})]}),e.customErgogenWarning&&n.jsxs(Tt,{"data-testid":o&&`${o}-custom-ergogen-warning`,children:[n.jsxs(Gt,{children:["Custom Ergogen Version Used",n.jsx(Vt,{"data-testid":"custom-version-badge",children:"Custom"})]}),n.jsxs(Ht,{children:["The shared link was created using a custom version of Ergogen:"," ",n.jsx("strong",{children:e.customErgogenWarning.shared}),".",n.jsx("br",{}),"You can investigate the repository used here:",n.jsx("br",{}),n.jsx(xd,{href:e.customErgogenWarning.url,target:"_blank",rel:"noopener noreferrer","data-testid":o&&`${o}-custom-repo-link`,children:e.customErgogenWarning.label})]})]})]}),n.jsxs(yd,{children:[n.jsx(_d,{onClick:i,size:"medium","data-testid":o&&`${o}-cancel`,"aria-label":"Cancel configuration loading",children:"Cancel"}),n.jsx(kd,{onClick:t,size:"medium","data-testid":o&&`${o}-accept`,"aria-label":"Accept and load configuration",children:"Accept and Load"})]})]})}),hd=u.div`
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
`,gd=u.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 550px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,md=u.h2`
  margin: 0 0 0.5rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.error};
`,bd=u.p`
  margin: 0 0 1.5rem 0;
  font-size: ${r.fontSizes.base};
  color: ${r.colors.textDarker};
  line-height: 1.4;
`,wd=u.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`,Tt=u.div`
  background-color: ${r.colors.backgroundLighter};
  border-left: 4px solid ${r.colors.warningDark};
  padding: 1rem;
  border-radius: 4px;
`,Gt=u.div`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.bold};
  color: ${r.colors.warningDark};
  margin-bottom: 0.25rem;
`,Vt=u.span`
  background-color: ${r.colors.warningDark};
  color: ${r.colors.white};
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
  font-weight: ${r.fontWeights.semiBold};
  text-transform: uppercase;
  display: inline-block;
  vertical-align: middle;
`,Ht=u.div`
  font-size: ${r.fontSizes.bodySmall};
  color: ${r.colors.textDark};
  line-height: 1.5;

  strong {
    color: ${r.colors.text};
  }
`,xd=u.a`
  display: inline-block;
  margin-top: 0.5rem;
  color: ${r.colors.accent};
  text-decoration: underline;
  word-break: break-all;

  &:hover {
    color: ${r.colors.accentSecondary};
  }
`,yd=u.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`,kd=u(pe)`
  background-color: ${r.colors.accent};
  color: ${r.colors.white};

  &:hover {
    background-color: ${r.colors.accentDark};
  }
`,_d=u(pe)`
  background-color: ${r.colors.backgroundLighter};
  color: ${r.colors.textDark};

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`;let Mo=null,Bo=!1;const vd=()=>{Bo||(Mo=br(),Bo=!0);const e=Mo,t=[];let i=null;const o=p.useRef(null);if(e)if(e.success){const l=e.config;o.current===null&&(o.current={config:l.config,injections:l.injections,guiVersion:l.guiVersion,ergogenVersion:l.ergogenVersion}),window.history.replaceState(null,"",window.location.pathname+window.location.search)}else i=e.message,console.error("[App] Failed to load shared configuration from hash",{error:e.error,message:e.message,hashLength:window.location.hash.length}),window.history.replaceState(null,"",window.location.pathname+window.location.search);const[s,a]=p.useState(null);return p.useEffect(()=>{o.current&&a(o.current)},[]),n.jsx(es,{initialInjectionInput:t,hashError:i,children:n.jsx(Cd,{pendingSharedConfig:s})})};function jd(){const[e,t]=p.useState(null),i=new URLSearchParams(window.location.search).has("force_update");if(p.useEffect(()=>{pd({onUpdate:o=>{t(o)}})},[]),i)return()=>{console.log("[SW] Force-update triggered via ?force_update URL parameter."),window.location.reload()};if(e)return()=>{let o;if("serviceWorker"in navigator){let a=!1;navigator.serviceWorker.addEventListener("controllerchange",()=>{a||(a=!0,o&&clearTimeout(o),window.location.reload())})}const s=e.waiting;s?(s.postMessage({type:"SKIP_WAITING"}),o=setTimeout(()=>{window.location.reload()},1e3)):window.location.reload()}}function $d(){const[e,t]=p.useState(null),[i,o]=p.useState(!1),[s,a]=p.useState(!1),l=new URLSearchParams(window.location.search).has("force_install");return p.useEffect(()=>{(()=>{const m=typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches,j=window.navigator.standalone===!0;a(m||j)})();const g=m=>{m.preventDefault(),t(m),console.log("[PWA] beforeinstallprompt event fired and captured.")},b=()=>{console.log("[PWA] appinstalled event fired."),a(!0),o(!1)};return window.addEventListener("beforeinstallprompt",g),window.addEventListener("appinstalled",b),()=>{window.removeEventListener("beforeinstallprompt",g),window.removeEventListener("appinstalled",b)}},[]),{onInstall:()=>{F("pwa_install_click"),o(!0),e?(e.prompt(),e.userChoice.then(c=>{c.outcome==="accepted"?(console.log("[PWA] User accepted the install prompt"),F("pwa_install_accepted"),a(!0)):(console.log("[PWA] User dismissed the install prompt"),F("pwa_install_dismissed")),o(!1),t(null)})):(console.log("[PWA] Install prompt triggered (deferredPrompt is not available on this device/browser)"),alert('PWA installation is not supported by this browser or is restricted on this device. If you are on iOS/iPadOS, please open this site in Safari and select "Add to Home Screen" from the Share menu.'),o(!1))},isAvailable:!!e||l,isInstalled:s,isInstalling:i}}const Cd=({pendingSharedConfig:e})=>{var E;const t=ve(),i=t==null?void 0:t.configInput,o=Jo(),s=jd(),a=$d(),l=p.useRef(0);l.current=((E=t==null?void 0:t.configs)==null?void 0:E.length)||0,p.useEffect(()=>{F("page_view",{page_path:o.pathname,stored_configs_count:l.current})},[o.pathname]);const d=p.useRef(!1),h=p.useRef(e);e!==h.current&&(h.current=e);const{currentConflict:c,processInjectionsWithConflictResolution:g,handleConflictResolution:b,handleConflictCancel:m}=_t({setInjectionInput:I=>t==null?void 0:t.setInjectionInput(I),setConfigInput:I=>t==null?void 0:t.loadPreview(I),generateNow:async(I,S,U)=>{t&&await t.generateNow(I,S,U)},getCurrentInjections:()=>(t==null?void 0:t.injectionInput)||[],onComplete:async(I,S)=>{localStorage.setItem("ergogen:injection",JSON.stringify(S)),t==null||t.loadPreview(I)},setError:I=>t==null?void 0:t.setError(I)}),[j,x]=p.useState(null),f=(I,S)=>{const U=wt.version,A=un("github:ceoloide/ergogen#v4.3.0");let R=!0,M,y,P;if(I){const $=Ue(U),W=Ue(I);$&&W&&!Kt($,W)&&(R=!1,M={current:U,shared:I})}if(S){if(Gr(S)&&S!==A){R=!1;const O=dn(S);P={shared:S,url:O.url,label:O.label}}const $=no(A)||Je(),W=no(S);if(W){const O=Ue($),D=Ue(W);O&&D&&!Kt(O,D)&&(R=!1,y={current:$,shared:W})}}return{isCompatible:R,guiWarning:M,ergogenWarning:y,customErgogenWarning:P}},w=p.useCallback((I,S)=>{t&&(S!==void 0&&S.length>0?g(S,I).catch(U=>{console.error("[App] Error processing injections:",U),t.setError(`Failed to process injections: ${U instanceof Error?U.message:"Unknown error"}`)}):(t.loadPreview(I),t.generateNow(I,t.injectionInput,{pointsonly:!1})))},[t,g]),k=()=>{var I;j&&(F("shared_config_accepted",{has_injections:!!(j.injections&&j.injections.length>0),injections_count:((I=j.injections)==null?void 0:I.length)||0}),w(j.config,j.injections),x(null))},L=()=>{var I;j&&F("shared_config_declined",{has_injections:!!(j.injections&&j.injections.length>0),injections_count:((I=j.injections)==null?void 0:I.length)||0}),x(null)};return p.useEffect(()=>{if(!t||!e||d.current)return;d.current=!0;const I=f(e.guiVersion,e.ergogenVersion);I.isCompatible?w(e.config,e.injections):x({config:e.config,injections:e.injections,report:I})},[t,e,w]),p.useEffect(()=>{if(!t)return;const I=()=>{const S=br();if(S)if(S.success){const U=S.config,A=f(U.guiVersion,U.ergogenVersion);A.isCompatible?w(U.config,U.injections):x({config:U.config,injections:U.injections,report:A}),window.history.replaceState(null,"",window.location.pathname+window.location.search)}else console.error("[App] Failed to load shared configuration from hash (hashchange)",{error:S.error,message:S.message,hashLength:window.location.hash.length}),t.setError(S.message),window.history.replaceState(null,"",window.location.pathname+window.location.search)};return window.addEventListener("hashchange",I),()=>{window.removeEventListener("hashchange",I)}},[t,w]),n.jsxs(n.Fragment,{children:[j&&n.jsx(fd,{report:j.report,onAccept:k,onCancel:L,"data-testid":"share-compatibility-dialog"}),c&&n.jsx(kt,{injectionName:c.name,injectionType:c.type,onResolve:b,onCancel:m,"data-testid":"conflict-dialog"}),(t==null?void 0:t.isBulkDownloadOpen)&&n.jsx(Wc,{isOpen:t.isBulkDownloadOpen,configs:t.configs,injections:t.injectionInput,debug:t.debug,stlPreview:t.stlPreview,onClose:()=>t.setIsBulkDownloadOpen(!1),"data-testid":"bulk-download-dialog"}),n.jsx(Hl,{onUpdate:s}),n.jsx(ec,{visible:(t==null?void 0:t.isGenerating)??!1,"data-testid":"loading-bar"}),n.jsx(nc,{}),n.jsx(dc,{isOpen:(t==null?void 0:t.showSideNav)??!1,onClose:()=>t==null?void 0:t.setShowSideNav(!1),"data-testid":"side-navigation"}),n.jsx(Sd,{children:n.jsxs(Or,{children:[n.jsx(Pt,{path:"/",element:i?n.jsx(Na,{pwaState:a}):n.jsx(to,{to:{pathname:"/new",search:o.search},replace:!0})}),n.jsx(Pt,{path:"/new",element:n.jsx($l,{})}),n.jsx(Pt,{path:"*",element:n.jsx(to,{to:"/",replace:!0})})]})})]})},Sd=u.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;let To=!1;const Ed=e=>{To||(e.editor.defineTheme("ergogen-theme",{base:"vs-dark",inherit:!0,rules:[],colors:{"editor.background":r.colors.backgroundLight}}),To=!0)};rr();const Pd=u.div`
  display: flex;
  flex-direction: column;
  color: #ffffff;
  height: 100%;
  width: 100%;
  font-family: 'Roboto', sans-serif;
`,Id=Fr`
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
    font-family: ${r.fonts.body};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: ${r.colors.text};
  }

  code {
    font-family: ${r.fonts.code};
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
`;Yo.config({paths:{vs:"/monaco/vs"}});Yo.init().then(e=>{Ed(e);const t=document.getElementById("root");Mr(t).render(n.jsx(qo.StrictMode,{children:n.jsx(Br,{basename:("/".startsWith("."),"/"),children:n.jsxs(Pd,{children:[n.jsx(Id,{}),n.jsx(vd,{})]})})}))});export{ht as a,r as t};
