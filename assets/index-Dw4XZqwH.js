const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/PcbPreview-DsKQssW6.js","assets/vendor-C9A_qoZ1.js","assets/StlPreview-CtZa10ge.js","assets/three-BJECO8Vk.js","assets/js-yaml-DW8Bub87.js","assets/jszip-cZtdyB0p.js"])))=>i.map(i=>d[i]);
import{f as qe,y as d,j as n,r as p,h as Je,i as oo,k as Ho,l as qo,O as yt,p as Ko,m as Rr,n as Ar,o as Jo,q as Xo,t as Nr,v as cn,w as Yo,L as Zo,x as Ur,z as Dt,N as ro,A as Wr,B as Qo,e as Or,C as Fr}from"./vendor-C9A_qoZ1.js";import{j as fe}from"./js-yaml-DW8Bub87.js";import{J as Ye}from"./jszip-cZtdyB0p.js";import{_ as er}from"./three-BJECO8Vk.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function i(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(s){if(s.ep)return;s.ep=!0;const a=i(s);fetch(s.href,a)}})();const kt=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/ergogen.worker-yOrnwBol.js",import.meta.url),{type:"module"})}catch(e){return console.error("Failed to create worker:",e),null}},dn=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/jscad.worker-C8nLBdOi.js",import.meta.url),{type:"module"})}catch(e){return console.error("Failed to create JSCAD worker:",e),null}},Mr="0.19.3",vt={version:Mr},un=e=>{const t=`v${qe.version}`,i=qe.version,o=qe.repository,s=o.startsWith("github:")?o.replace("github:","https://github.com/"):o.replace(/^git\+/,"").replace(/\.git$/,"");if(!e)return{label:t,url:s,displayText:i,isCustom:!1,isHash:!1,isTag:!1};if(e.includes("@")){const w=e.split("@"),x=w[1]||e;return{label:e,url:e.startsWith("ergogen@")?`${s}/releases/tag/v${x}`:`https://www.npmjs.com/package/${w[0]}`,displayText:x,isCustom:!0,isHash:!1,isTag:!0}}const a=e.startsWith("github:")?e.slice(7):e,[l,u]=a.split("#"),m=l==="ergogen/ergogen",c=`https://github.com/${l}`;if(m){if(!u)return{label:"latest",url:c,displayText:i,isCustom:!1,isHash:!1,isTag:!1};const w=u.length===40&&/^[0-9a-fA-F]{40}$/.test(u),x=w?t:u,f=w?`${c}/commit/${u}`:`${c}/tree/${u}`;return{label:u,url:f,displayText:x,isCustom:!0,isHash:w,isTag:!w}}if(!u)return{label:a,url:c,displayText:i,isCustom:!0,isHash:!1,isTag:!1};const h=u.length===40&&/^[0-9a-fA-F]{40}$/.test(u),b=h?t:u,g=h?`${c}/commit/${u}`:`${c}/tree/${u}`;return{label:a,url:g,displayText:b,isCustom:!0,isHash:h,isTag:!h}},pn=e=>{if(e.includes("@")){const s=e.split("@"),a=s[1]||e,l=s[0];return`github:${l==="ergogen"?"ergogen/ergogen":l}#v${a}`}const t=e.startsWith("github:")?e.slice(7):e,[i,o]=t.split("#");return o?`github:${i}#${o}`:`github:${i}#v${qe.version}`},Ue=e=>{const i=e.replace(/^v/,"").match(/^(\d+)\.(\d+)\.(\d+)/);return i?[Number(i[1]),Number(i[2]),Number(i[3])]:null},Yt=(e,t)=>{for(let i=0;i<3;i++){if(e[i]>t[i])return!0;if(e[i]<t[i])return!1}return!0},io=e=>{const t=e.match(/(?:^|#|@|v)(\d+\.\d+\.\d+)/);return t?t[1]:null},Br=e=>{const t=e.startsWith("github:")?e.slice(7):e,[i]=t.split("#");return!e.startsWith("github:")&&!e.includes("/")?!1:i!=="ergogen/ergogen"},tr=()=>{if(typeof window>"u")return!1;const e=window.navigator;return typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches||e.standalone===!0},nr=e=>{if(typeof window>"u")return!0;if(window.__FORCE_ANALYTICS__===!0||e.startsWith("G-TEST"))return!1;const t=window.location.hostname;return!!(t==="localhost"||t==="127.0.0.1"||t==="[::1]"||t.endsWith(".localhost"))},Tr=()=>{if(typeof document>"u"||!document.cookie)return;const e=document.cookie.split(";");for(const t of e){const i=t.indexOf("="),o=(i>-1?t.substring(0,i):t).trim();if(o.startsWith("_ga")){document.cookie=`${o}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`;const a=window.location.hostname.split(".");for(;a.length>0;){const l=a.join(".");document.cookie=`${o}=; Path=/; Domain=.${l}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`,document.cookie=`${o}=; Path=/; Domain=${l}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`,a.shift()}}}},Gr=()=>{if(!(typeof indexedDB>"u"))try{indexedDB.deleteDatabase("workbox-background-sync")}catch{}},or=()=>typeof window>"u"||!window.location?void 0:`${window.location.origin&&window.location.origin!=="null"?window.location.origin:`${window.location.protocol||"https:"}//${window.location.hostname||"localhost"}`}${window.location.pathname||"/"}`,rr="ergogen:consent:sendUsageMetrics",Vr="ergogen:config:sendUsageMetrics",Hr="ergogen:settings";let mt;const so=e=>{const t=localStorage.getItem(e);if(t!==null)try{const i=JSON.parse(t);return typeof i=="boolean"?i:void 0}catch{return}},qr=()=>{const e=localStorage.getItem(Hr);if(e!==null)try{const t=JSON.parse(e);return t&&typeof t=="object"&&typeof t.sendUsageMetrics=="boolean"?t.sendUsageMetrics:void 0}catch{return}},_t=()=>{if(typeof window>"u")return!1;if(mt!==void 0)return mt;try{const e=so(rr);if(e!==void 0)return e;if(so(Vr)===!1||qr()===!1)return!1}catch{return!1}return!tr()},Kr=e=>{try{localStorage.setItem(rr,JSON.stringify(e)),mt=void 0}catch{mt=e}};let Ge=!1;const ir=()=>{var s;if(typeof window>"u")return;const e=_t(),t="G-46F2L343EK",i=nr(t),o=document.getElementById("gtag-script");if(o||(Ge=!1),e&&t&&!i){delete window["ga-disable-"+t];const a=window,l={send_page_view:!1,allow_google_signals:!1,allow_ad_personalization_signals:!1},u=()=>{var m;return(m=a.gtag)==null?void 0:m.call(a,"set",{page_location:or()})};if(o)Ge&&(u(),(s=a.gtag)==null||s.call(a,"config",t,l),Ge=!1);else{const m=document.createElement("script");m.async=!0,m.src=`https://www.googletagmanager.com/gtag/js?id=${t}`,m.id="gtag-script",document.head.appendChild(m);const c=a.dataLayer||[];a.dataLayer=c,a.gtag=function(){c.push(arguments)},a.gtag("js",new Date),u(),a.gtag("config",t,l),Ge=!1}ni()}else window["ga-disable-"+t]=!0,o&&(Ge=!0),Tr(),Gr(),oi()},Jr=new Set(["yaml","yml","json","zip","ekb"]),Xr=e=>{const t=e.lastIndexOf("."),i=t>=0?e.slice(t+1).toLowerCase():"";return Jr.has(i)?i:"other"},sr=100,Yr=/"[^"\n]*"|'[^'\n]*'|`[^`\n]*`/g,Zr=/^at\s|^[^\s@]*@\S+:\d+:\d+$/,Qr=e=>e.split(`
`)[0].replace(Yr,t=>`${t[0]}*${t[0]}`).trim().slice(0,sr),ei=e=>{const t=e.split(`
`).map(i=>i.trim()).filter(i=>Zr.test(i));return t.length>0?t.join(" ").slice(0,sr):void 0},ti=e=>{const t={...e};for(const i of["error_message","description"]){const o=t[i];typeof o=="string"&&(t[i]=Qr(o))}return typeof t.error_stack=="string"&&(t.error_stack=ei(t.error_stack)),t},F=(e,t)=>{if(_t()&&!nr("G-46F2L343EK")&&window.gtag){const o=or();window.gtag("set",{page_location:o}),window.gtag("event",e,{page_location:o,gui_version:vt.version,ergogen_version:pn("github:ceoloide/ergogen#v4.3.0"),is_pwa:tr(),...ti(t??{})})}},bt=(e,t=!1,i)=>{const o=e instanceof Error?e.message:e,s=e instanceof Error?e.stack:void 0;F("exception",{description:i?`[${i}] ${o}`:o,fatal:t,error_stack:s})};let wt=!1;const ar=e=>{bt(e.error||e.message,!1,"unhandled_error")},lr=e=>{bt(e.reason||"Unhandled Promise Rejection",!1,"unhandled_rejection")},ni=()=>{typeof window>"u"||wt||(window.addEventListener("error",ar),window.addEventListener("unhandledrejection",lr),wt=!0)},oi=()=>{typeof window>"u"||wt&&(window.removeEventListener("error",ar),window.removeEventListener("unhandledrejection",lr),wt=!1)};function ri(e){function t(c,h){return c>>>h|c<<32-h}const i=[],o=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],s=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],a=unescape(encodeURIComponent(e));for(let c=0;c<a.length;c++){const h=a.charCodeAt(c);i[c>>2]|=h<<24-c%4*8}const l=a.length;i[l>>2]|=128<<24-l%4*8;const u=(l+8>>6)+1;i[u*16-1]=l*8;for(let c=0;c<u;c++){const h=[];for(let L=0;L<16;L++)h[L]=i[c*16+L]||0;for(let L=16;L<64;L++){const P=t(h[L-15],7)^t(h[L-15],18)^h[L-15]>>>3,C=t(h[L-2],17)^t(h[L-2],19)^h[L-2]>>>10;h[L]=h[L-16]+P+h[L-7]+C|0}let b=o[0],g=o[1],w=o[2],x=o[3],f=o[4],y=o[5],k=o[6],I=o[7];for(let L=0;L<64;L++){const P=t(f,6)^t(f,11)^t(f,25),C=f&y^~f&k,A=I+P+C+s[L]+h[L]|0,R=t(b,2)^t(b,13)^t(b,22),z=b&g^b&w^g&w,v=R+z|0;I=k,k=y,y=f,f=x+A|0,x=w,w=g,g=b,b=A+v|0}o[0]=o[0]+b|0,o[1]=o[1]+g|0,o[2]=o[2]+w|0,o[3]=o[3]+x|0,o[4]=o[4]+f|0,o[5]=o[5]+y|0,o[6]=o[6]+k|0,o[7]=o[7]+I|0}let m="";for(let c=0;c<8;c++){const h=o[c];m+=(h>>>24&255).toString(16).padStart(2,"0"),m+=(h>>>16&255).toString(16).padStart(2,"0"),m+=(h>>>8&255).toString(16).padStart(2,"0"),m+=(h&255).toString(16).padStart(2,"0")}return m}function Zt(e,t){if(!e||typeof e!="object")return!1;const i=e;for(const o of t)if(i[o]===!0)return!0;for(const o of Object.keys(i))if(Zt(i[o],t))return!0;return!1}const Rt=e=>Math.round((e+Number.EPSILON)*100)/100,ao=e=>{if(!e||typeof e!="object")return;const t=e.meta;if(!t||typeof t!="object")return;const i=t.zone;if(i){if(typeof i=="object"&&i!==null)return i.name;if(typeof i=="string")return i}};function ii(e,t,i,o){const s=fe.load(e)||{},a=fe.load(t)||{},l=s.outlines||{},u=Object.keys(l),m=u.filter(Z=>!Z.startsWith("_")).length,c=u.length,h=Object.keys(s.pcbs||{}).length,b=Object.keys(s.cases||{}).length,g=Zt(s.pcbs,["reversible","reverse"]),w=Zt(s.points,["mirror"]),x=s.meta||{},f=x.name??"no_name",y=x.author??"no_author",k=s.points||{},I=Object.keys(k.zones||{}).length,L=k.zones||{},C=Object.keys(L).filter(Z=>{const B=L[Z];return B&&typeof B=="object"&&("columns"in B||"rows"in B)}),A=C.length,R=A>0;let z="",v="",_="",S=0;const D=Object.keys(a);if(R){const Z=[...C].sort(),B=[],O=[],T=[];for(const Q of Z){const G=L[Q],j=Object.keys((G==null?void 0:G.columns)||{}),V=Object.keys((G==null?void 0:G.rows)||{}),H=(G==null?void 0:G.mirror)===!0||typeof(G==null?void 0:G.mirror)=="object"&&(G==null?void 0:G.mirror)!==null,ee=k.mirror===!0||typeof k.mirror=="object"&&k.mirror!==null,q=H||ee;let ie=D.filter(Oe=>{const de=a[Oe];if(ao(de)!==Q)return!1;if(de&&typeof de=="object"){const ge=de.meta;if(ge&&typeof ge=="object"&&ge.mirrored===!0)return!1}return!Oe.startsWith("mirror_")}).length;q&&(ie*=2),B.push(j.length),O.push(V.length),T.push(ie),S+=ie}z=B.join(","),v=O.join(","),_=T.join(",")}const W=D.map(Z=>{const B=a[Z],O=ao(B),Q=(O?C.includes(O):!1)?"K":"A",G=Rt((B==null?void 0:B.x)??0),j=Rt((B==null?void 0:B.y)??0),V=Rt((B==null?void 0:B.r)??0);return{name:Z,type:Q,x:G,y:j,r:V}});W.sort((Z,B)=>Z.x!==B.x?Z.x-B.x:Z.y!==B.y?Z.y-B.y:Z.r!==B.r?Z.r-B.r:Z.name.localeCompare(B.name));const M=W.map(Z=>`${Z.type}${Z.x.toString()};${Z.y.toString()};${Z.r.toString()}`).join("|"),U=`${f}|${y}|${M}`,J=ri(U).substring(0,12),ne=!w&&g?S*2:S;return{total_generation_time_ms:i,count_outlines:m,count_raw_outlines:c,count_pcbs:h,count_cases:b,is_reversible:g,is_mirrored:w,count_zones:I,matrix_zones:A,has_matrix:R,matrix_col_counts:z,matrix_row_counts:v,matrix_key_counts:_,matrix_keys:S,keyboard_keys:ne,config_id:J,previous_config_id:o}}const r={colors:{accent:"#28a745",accentDark:"#1e8e1e",accentDarker:"#1e7e34",accentSecondary:"#239923",background:"#222222",backgroundLight:"#2a2a2a",backgroundLighter:"#333333",border:"#3f3f3f",text:"#ffffff",textDark:"#ccc",textDarker:"#aaa",textDarkest:"#666",error:"#ff6d6d",errorDark:"#a31111",warning:"hsl(45, 100%, 90%)",warningDark:"hsl(32, 79%, 40%)",info:"hsl(206, 94%, 92%)",infoDark:"hsl(206, 100%, 30%)",success:"hsl(120, 73%, 92%)",successDark:"hsl(120, 50%, 35%)",white:"#fff",buttonHover:"#3f3f3f"},fonts:{body:"'Roboto', sans-serif",code:"source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"},fontSizes:{xs:"0.4rem",sm:"0.8rem",base:"1rem",lg:"1.2rem",iconMedium:"16px",iconLarge:"24px",bodySmall:"13px",h1:"2.5rem",h2:"2rem",h3:"1.5rem"},fontWeights:{regular:400,semiBold:600,bold:700},buttonSizes:{large:{padding:"1rem 2rem",fontSize:"1rem"},medium:{padding:"0.7rem 1.4rem",fontSize:"1rem"},small:{padding:"8px 12px",fontSize:"0.8rem"},icon:{padding:"8px 12px",fontSize:"0.4rem"}}},jt=d.button`
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
`,si=d(jt)`
  padding: ${r.buttonSizes.medium.padding};
  font-size: ${r.buttonSizes.medium.fontSize};
`,ai=d(jt)`
  padding: ${r.buttonSizes.small.padding};
  font-size: ${r.buttonSizes.small.fontSize};
`,li=d(jt)`
  padding: ${r.buttonSizes.icon.padding};
  font-size: ${r.buttonSizes.icon.fontSize};
`,he=({size:e,...t})=>{switch(e){case"icon":return n.jsx(li,{...t});case"sm":case"small":return n.jsx(ai,{...t});case"md":case"medium":return n.jsx(si,{...t});case"lg":case"large":default:return n.jsx(jt,{...t})}},ci=e=>e.charAt(0).toUpperCase()+e.slice(1),$t=({injectionName:e,injectionType:t,onResolve:i,onCancel:o,"data-testid":s})=>{const[a,l]=p.useState(!1),u=ci(t);return n.jsx(di,{"data-testid":s,children:n.jsxs(ui,{"data-testid":s&&`${s}-box`,children:[n.jsxs(pi,{children:[u," Conflict"]}),n.jsxs(fi,{children:["A ",t," with the name ",n.jsx("strong",{children:e})," ","already exists.",n.jsx("br",{}),"How would you like to resolve this conflict?"]}),n.jsxs(hi,{children:[n.jsx(gi,{type:"checkbox",id:"apply-to-all",checked:a,onChange:m=>l(m.target.checked),"data-testid":s&&`${s}-apply-to-all`,"aria-label":"Apply this choice to all conflicts"}),n.jsx(mi,{$checked:a,onClick:()=>l(!a),role:"checkbox","aria-checked":a}),n.jsx("label",{htmlFor:"apply-to-all",children:"Apply to all conflicts"})]}),n.jsxs(bi,{children:[n.jsx(he,{onClick:()=>i("skip",a),size:"medium","data-testid":s&&`${s}-skip`,"aria-label":`Skip this ${t}`,children:"Skip"}),n.jsx(he,{onClick:()=>i("overwrite",a),size:"medium","data-testid":s&&`${s}-overwrite`,"aria-label":`Overwrite existing ${t}`,children:"Overwrite"}),n.jsx(he,{onClick:()=>i("keep-both",a),size:"medium","data-testid":s&&`${s}-keep-both`,"aria-label":`Keep both ${t}s`,children:"Keep Both"})]}),n.jsx(wi,{onClick:o,size:"small","data-testid":s&&`${s}-cancel`,"aria-label":"Cancel loading",children:"Cancel"})]})})},di=d.div`
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
`,ui=d.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`,pi=d.h2`
  margin: 0 0 1rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
`,fi=d.p`
  margin: 0 0 1.5rem 0;
  font-size: ${r.fontSizes.base};
  color: ${r.colors.textDark};
  line-height: 1.5;

  strong {
    color: ${r.colors.accent};
  }
`,hi=d.div`
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
`,gi=d.input`
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
`,mi=d.div`
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
`,bi=d.div`
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  margin-bottom: 1rem;
`,wi=d(he)`
  width: 100%;
  background-color: ${r.colors.backgroundLighter};
  color: ${r.colors.textDark};

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`,We=e=>Array.isArray(e)&&e.length===3&&typeof e[0]=="string"&&typeof e[1]=="string"&&typeof e[2]=="string",cr=(e,t,i)=>!i||i.length===0?{hasConflict:!1}:i.some(s=>We(s)&&s[0]===e&&s[1]===t)?{hasConflict:!0,conflictingName:t}:{hasConflict:!1},xi=(e,t)=>{if(!t||t.length===0)return[];const i=[];for(const o of e){if(!We(o))continue;const[s,a]=o,l=cr(s,a,t);l.hasConflict&&i.push({injection:o,conflict:l})}return i},dr=(e,t,i)=>{if(!i||i.length===0)return t;const o=new Set(i.filter(l=>We(l)&&l[0]===e).map(l=>l[1]));let s=1,a=`${t}_${s}`;for(;o.has(a);)s++,a=`${t}_${s}`;return a},At=(e,t,i)=>{const o=t?[...t]:[];for(const s of e){if(!We(s)){console.warn("[mergeInjectionArraysWithResolution] Skipping invalid injection format:",s);continue}const[a,l,u]=s;if(!cr(a,l,o).hasConflict)o.push([a,l,u]);else{if(i==="skip")continue;if(i==="overwrite"){const c=o.findIndex(h=>We(h)&&h[0]===a&&h[1]===l);c!==-1&&(o[c]=[a,l,u])}else if(i==="keep-both"){const c=dr(a,l,o);o.push([a,c,u])}}}return o},Ct=e=>{const[t,i]=p.useState([]),o=t.length>0?t[0]:null,[s,a]=p.useState(null),[l,u]=p.useState(null),[m,c]=p.useState(null),h=p.useCallback(async(w,x,f=null,y)=>{var A,R,z;const k=y||e.getCurrentInjections();if(w.length===0){e.setInjectionInput(k),e.setConfigInput(x),await e.generateNow(x,k,{pointsonly:!1}),await((A=e.onComplete)==null?void 0:A.call(e,x,k));return}const I=w.filter(v=>We(v)?!0:(console.warn("[useInjectionConflictResolution] Skipping invalid injection format:",v),!1));if(I.length===0){e.setInjectionInput(k),e.setConfigInput(x),await e.generateNow(x,k,{pointsonly:!1}),await((R=e.onComplete)==null?void 0:R.call(e,x,k));return}const L=xi(I,k);if(L.length>0&&!f){const v=L.map(_=>({injection:_.injection,conflict:_.conflict}));F("conflict_encountered",{conflict_count:L.length}),i(v),a(I),u(x),c(k);return}const C=At(I,k,f||"skip");e.setInjectionInput(C),e.setConfigInput(x),await e.generateNow(x,C,{pointsonly:!1}),await((z=e.onComplete)==null?void 0:z.call(e,x,C))},[e]),b=p.useCallback(async(w,x)=>{var f,y;if(!(!s||!l||t.length===0))if(x){F("conflict_resolved",{strategy:w,apply_to_all:!0,remaining_count:t.length});const k=At(s,m||e.getCurrentInjections(),w);e.setInjectionInput(k),e.setConfigInput(l),await e.generateNow(l,k,{pointsonly:!1}),await((f=e.onComplete)==null?void 0:f.call(e,l,k)),i([]),a(null),u(null),c(null)}else{F("conflict_resolved",{strategy:w,apply_to_all:!1,remaining_count:t.length});const k=t[0],[I,L]=k.injection,P=k.injection,C=t.slice(1);i(C);let A=[...m||e.getCurrentInjections()],R=[...s||[]];if(w==="overwrite")A=A.filter(z=>!(z[0]===I&&z[1]===L));else if(w==="skip")R=R.filter(z=>!(z[0]===I&&z[1]===L&&z[2]===P[2]));else if(w==="keep-both"){const z=dr(I,L,A),v=[I,z,P[2]];A=[...A,v],R=R.filter(_=>!(_[0]===I&&_[1]===L&&_[2]===P[2]))}if(c(A),a(R),C.length===0){const z=At(R,A,"skip");e.setInjectionInput(z),e.setConfigInput(l),await e.generateNow(l,z,{pointsonly:!1}),await((y=e.onComplete)==null?void 0:y.call(e,l,z)),a(null),u(null),c(null)}}},[s,l,m,t,e]),g=p.useCallback(()=>{var w;F("conflict_cancelled",{remaining_count:t.length}),i([]),a(null),u(null),c(null),(w=e.setError)==null||w.call(e,"Loading cancelled by user")},[e,t.length]);return{currentConflict:o?{name:o.injection[1],type:o.injection[0]}:null,processInjectionsWithConflictResolution:h,handleConflictResolution:b,handleConflictCancel:g}},yi={templates:"4.3.0",outlines:"4.3.0"},Ze=()=>qe.version,lo=e=>{const t=e.split("-")[0].replace(/^v/,"").split(".");for(;t.length<3;)t.push("0");return t.length>3||!t.every(i=>/^\d+$/.test(i))?null:[Number(t[0]),Number(t[1]),Number(t[2])]},ki=(e,t)=>{const i=lo(e),o=lo(t);if(!i||!o)return!1;const[s,a,l]=i,[u,m,c]=o;return s===u&&(a>m||a===m&&l>=c)},vi=(e,t)=>{const i=Ue(t),o=Ue(yi[e]);return i!==null&&o!==null?Yt(i,o):!1},_i=()=>({templates:"",outlines:""}),ce=e=>{if(typeof window<"u"&&window.location)try{const o=new URLSearchParams(window.location.search).get(`ff_${e}`);if(o==="true")return!0;if(o==="false")return!1}catch(i){console.warn("[FeatureFlags] Failed to check URL query parameters:",i)}const t=_i()[e];return t==="true"?!0:t==="false"?!1:vi(e,Ze())},ji=50*1024*1024,$i=10*1024*1024,Nt=(e,t)=>{const i=`${t}/`;let o=e;return o.startsWith(i)&&(o=o.substring(i.length)),o=o.replace(/\.js$/,""),o},Ci=e=>{let t=e.file("config.yaml")||e.file("config.yml");if(!t){const i=e.file(/^config\.(yaml|yml)$/i);i&&i.length>0&&(t=i[0])}if(!t)throw new Error("The archive is missing a config.yaml file in the root directory.");return t},Qt=(e,t)=>{if(t&&e>ji)throw new Error(`File exceeds the maximum size limit of 50MB for archives (current size: ${(e/(1024*1024)).toFixed(1)}MB).`);if(!t&&e>$i)throw new Error(`File exceeds the maximum size limit of 10MB for text files (current size: ${(e/(1024*1024)).toFixed(1)}MB).`)},ur=(e,t,i)=>{const o=[];return e.forEach(s=>o.push(["footprint",s.name,s.content])),t.forEach(s=>o.push(["outline",s.name,s.content])),i.forEach(s=>o.push(["template",s.name,s.content])),o},Si=async e=>{let t;try{t=await Ye.loadAsync(e)}catch{throw new Error("The file appears to be corrupted. Please verify the file and try again.")}const o=await Ci(t).async("string"),s=[],a=[];return t.forEach((l,u)=>{if(!(u.dir||!l.endsWith(".js"))){if(l.startsWith("footprints/")){const m=u.async("string").then(c=>{const h=Nt(l,"footprints");s.push({type:"footprint",name:h,content:c})});a.push(m)}else if(l.startsWith("outlines/")&&ce("outlines")){const m=u.async("string").then(c=>{const h=Nt(l,"outlines");s.push({type:"outline",name:h,content:c})});a.push(m)}else if(l.startsWith("templates/")&&ce("templates")){const m=u.async("string").then(c=>{const h=Nt(l,"templates");s.push({type:"template",name:h,content:c})});a.push(m)}}}),await Promise.all(a),{config:o,injections:s}},en="ergogen:config",fn="ergogen:multi-config",tn="LOCAL_STORAGE_CONFIG",co=5e3,Ei=40,Pi=3;class me extends Error{constructor(t){super(t),this.name="RateLimitError"}}class Ii{constructor(){this.providers=[]}register(t){this.providers.push(t)}resolve(t){const i=t.trim();for(const o of this.providers)if(o.canHandle(i))return o;return/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(i)&&this.providers[0]||null}}const Qe=new Ii,Li=e=>{const t=[],i=e.split(`
`);let o={};for(const s of i){const a=s.trim();if(a.startsWith("[submodule"))o.path&&o.url&&t.push({path:o.path,url:o.url}),o={};else{const l=a.indexOf("=");if(l!==-1){const u=a.substring(0,l).trim(),m=a.substring(l+1).trim();u==="path"?o.path=m:u==="url"&&(o.url=m)}}}return o.path&&o.url&&t.push({path:o.path,url:o.url}),t};class et{async fetchConfig(t){console.log(`[GitHub] Starting fetch from URL: ${t}`);const i=this.parseUrl(t),{owner:o,repo:s,branch:a,filePath:l,isRepoRoot:u}=i,m=i.host,c=[],h=[],b=[],g=async(x,f,y,k,I)=>{console.log("[GitHub] Checking for .gitmodules file");try{const L=await this.fetchFileContent(o,s,".gitmodules",f,m);console.log("[GitHub] .gitmodules found, parsing submodules");const P=Li(L);for(const C of P)if(C.path.includes(y)||C.path.includes(k)&&ce("outlines")||C.path.includes(I)&&ce("templates")){const A=C.path.includes(k),R=C.path.includes(I),z=A?k:R?I:y,v=A?h:R?b:c,_=C.path.substring(C.path.indexOf(z)+z.length+1),S=Qe.resolve(C.url);if(S instanceof et){const D=S.parseUrl(C.url),W=D.host;let M=[];try{M=await S.fetchFootprintsFromDirectory(D.owner,D.repo,"","main",[".js"],W)}catch(K){if(K instanceof me)throw K;try{M=await S.fetchFootprintsFromDirectory(D.owner,D.repo,"","master",[".js"],W)}catch(J){if(J instanceof me)throw J;console.warn(`Failed to fetch submodule footprints from ${C.url}`)}}const U=M.map(K=>({name:_?`${_}/${K.name}`:K.name,content:K.content}));v.push(...U)}}}catch(L){if(L instanceof me)throw L}};if(!u){if(!l)throw new Error("Invalid URL. File path not specified.");const x=await this.fetchFileContent(o,s,l,a,m);Qt(x.length,!1);const f=l.split("/").pop()||"";if(!(f==="config.yaml"||f==="config.yml"))return{config:x,footprints:[],outlines:[],templates:[],configPath:f};const k=l.substring(0,l.lastIndexOf("/")),I=k?`${k}/footprints`:"footprints",L=k?`${k}/outlines`:"outlines",P=k?`${k}/templates`:"templates";try{const C=await this.fetchFootprintsFromDirectory(o,s,I,a,[".js"],m);c.push(...C)}catch(C){if(C instanceof me)throw C}if(ce("outlines"))try{const C=await this.fetchFootprintsFromDirectory(o,s,L,a,[".js",".svg"],m);h.push(...C)}catch(C){if(C instanceof me)throw C}if(ce("templates"))try{const C=await this.fetchFootprintsFromDirectory(o,s,P,a,[".js"],m);b.push(...C)}catch(C){if(C instanceof me)throw C}return await g(k,a,I,L,P),{config:x,footprints:c,outlines:h,templates:b,configPath:f}}const w=async x=>{var C,A,R,z,v,_,S,D,W,M,U,K;let f="",y="",k=!0;try{f=await this.fetchFileContent(o,s,"config.yaml",x,m),y=""}catch(J){const ne=J;if((C=ne.message)!=null&&C.includes("allowance")||(A=ne.message)!=null&&A.includes("limit exceeded")||(R=ne.message)!=null&&R.includes("rate limit"))throw ne;try{f=await this.fetchFileContent(o,s,"config.yml",x,m),y=""}catch(Z){const B=Z;if((z=B.message)!=null&&z.includes("allowance")||(v=B.message)!=null&&v.includes("limit exceeded")||(_=B.message)!=null&&_.includes("rate limit"))throw B;try{f=await this.fetchFileContent(o,s,"ergogen/config.yaml",x,m),y="ergogen"}catch(O){const T=O;if((S=T.message)!=null&&S.includes("allowance")||(D=T.message)!=null&&D.includes("limit exceeded")||(W=T.message)!=null&&W.includes("rate limit"))throw T;try{f=await this.fetchFileContent(o,s,"ergogen/config.yml",x,m),y="ergogen"}catch(Q){const G=Q;if((M=G.message)!=null&&M.includes("allowance")||(U=G.message)!=null&&U.includes("limit exceeded")||(K=G.message)!=null&&K.includes("rate limit"))throw G;const{configYamls:j,anyYamls:V}=await this.bfsForYamlFiles(o,s,x,m);if(j.length>0){const H=j[0];f=await this.fetchFileContent(o,s,H,x,m),y=H.includes("/")?H.substring(0,H.lastIndexOf("/")):""}else if(V.length>0){const H=V[0];f=await this.fetchFileContent(o,s,H,x,m),y=H.includes("/")?H.substring(0,H.lastIndexOf("/")):"",k=!1}else throw new Error("No YAML configuration files found in repository")}}}}if(Qt(f.length,!1),!k)return{config:f,footprints:[],outlines:[],templates:[],configPath:y};const I=y?`${y}/footprints`:"footprints",L=y?`${y}/outlines`:"outlines",P=y?`${y}/templates`:"templates";try{const J=await this.fetchFootprintsFromDirectory(o,s,I,x,[".js"]);c.push(...J)}catch(J){if(J instanceof me)throw J}if(ce("outlines"))try{const J=await this.fetchFootprintsFromDirectory(o,s,L,x,[".js",".svg"]);h.push(...J)}catch(J){if(J instanceof me)throw J}if(ce("templates"))try{const J=await this.fetchFootprintsFromDirectory(o,s,P,x,[".js"]);b.push(...J)}catch(J){if(J instanceof me)throw J}return await g(y,x,I,L,P),{config:f,footprints:c,outlines:h,templates:b,configPath:y}};if(a!=="main")return await w(a);try{return await w("main")}catch(x){if(x instanceof me)throw x;return await w("master")}}async fetchFootprintsFromDirectory(t,i,o,s,a,l){const u=[],m=async c=>{try{const h=await this.listDirectory(t,i,c,s,l);for(const b of h){const g=b.path.startsWith(c)?b.path:c?`${c}/${b.path}`:b.path;if(b.type==="file"){if(a.some(x=>b.name.endsWith(x)))try{const x=await this.fetchFileContent(t,i,g,s,l),f=o?g.slice(o.length+1).replace(/\.[^/.]+$/,""):g.replace(/\.[^/.]+$/,"");console.log(`[GitHub] Loaded footprint: ${f}`),u.push({name:f,content:x})}catch(x){if(x instanceof me)throw x;const f=x;console.warn(`Failed to fetch file content: ${g}`,f.stack||f)}}else b.type==="dir"&&await m(g)}}catch(h){if(h instanceof me)throw h}};return await m(o),u}async bfsForYamlFiles(t,i,o,s){var h,b,g;const a=[],l=[],u=[{path:"",depth:0}],m=new Set;let c=0;for(;u.length>0&&c<Ei;){const{path:w,depth:x}=u.shift();if(!m.has(w)){m.add(w);try{c++;const f=await this.listDirectory(t,i,w,o,s);for(const y of f)if(y.type==="file"){const k=y.name.toLowerCase();(k.endsWith(".yaml")||k.endsWith(".yml"))&&!k.startsWith(".")&&k.replace(/\.(yaml|yml)$/,"")!=="metadata"&&k.replace(/\.(yaml|yml)$/,"")!=="virtual_env"&&(y.name==="config.yaml"||y.name==="config.yml"?a.push(y.path):l.push(y.path))}else y.type==="dir"&&x<Pi&&(y.name.startsWith(".")||u.push({path:y.path,depth:x+1}));if(a.length>0||l.length>0&&(u.length===0||u[0].depth>x))break}catch(f){const y=f;if((h=y.message)!=null&&h.includes("allowance")||(b=y.message)!=null&&b.includes("limit exceeded")||(g=y.message)!=null&&g.includes("rate limit"))throw y;continue}}}return{configYamls:a,anyYamls:l}}}const zi=(e,t)=>{var u,m,c,h;if(!e)return{isLimitExceeded:!1,error:null};if(t.includes("raw.githubusercontent.com"))return e.status===429?(console.warn("[GitHub] Raw content rate limit exceeded (429). Please wait 30 minutes and try again."),{isLimitExceeded:!0,error:"You've reached your hourly request allowance for loading content from GitHub. Please wait 30 minutes and try again."}):{isLimitExceeded:!1,error:null};const o=((u=e.headers)==null?void 0:u.get("X-RateLimit-Limit"))||"unknown",s=((m=e.headers)==null?void 0:m.get("X-RateLimit-Remaining"))||"unknown",a=((c=e.headers)==null?void 0:c.get("X-RateLimit-Used"))||"unknown",l=((h=e.headers)==null?void 0:h.get("X-RateLimit-Reset"))||"unknown";if(console.log(`[GitHub Rate Limit] Limit: ${o}, Remaining: ${s}, Used: ${a}, Reset: ${l}`),e.status===403&&s==="0")return console.warn("[GitHub] Rate limit exceeded. Please wait and try again in about an hour."),{isLimitExceeded:!0,error:"Cannot load from GitHub right now. You've used your hourly request allowance. Please wait about an hour and try again."};if(s!=="unknown"&&o!=="unknown"){const b=parseInt(o),g=parseInt(s),w=(b-g)/b*100;if(w>=80&&g>0)return console.warn(`[GitHub] Approaching rate limit: ${w.toFixed(1)}% used`),{isLimitExceeded:!1,error:"Loading from GitHub may become unavailable soon. You've used most of your hourly request allowance. This will reset within an hour."}}return{isLimitExceeded:!1,error:null}};class Di extends et{constructor(){super(...arguments),this.rateLimitWarning=null}canHandle(t){const i=t.trim();return i.includes("github.com")||/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(i)}parseUrl(t){const i=t.trim();let o="",s="",a="main",l,u=!0;const m=!i.includes("github.com");if(m){const c=i.split("/").filter(Boolean);if(c.length<2)throw new Error("Invalid GitHub repository format. Must contain owner and repository.");o=c[0],s=c[1],u=c.length===2||c.length===4&&c[2]==="tree",u?c.length===4&&(a=c[3]):c[2]==="blob"||c[2]==="tree"?(a=c[3],l=c.slice(4).join("/")):l=c.slice(2).join("/")}else{let c=i;c.match(/^(https?:\/\/)/i)||(c=`https://${c}`);const h=c.endsWith("/")?c.slice(0,-1):c,g=new URL(h).pathname.split("/").filter(Boolean);if(g.length<2)throw new Error("Invalid GitHub URL. Must contain owner and repository.");o=g[0],s=g[1],u=g.length===2||g.length===4&&g[2]==="tree",u?g.length===4&&(a=g[3]):g[2]==="blob"||g[2]==="tree"?(a=g[3],l=g.slice(4).join("/")):l=g.slice(2).join("/")}return s.endsWith(".git")&&(s=s.slice(0,-4)),{owner:o,repo:s,branch:a,filePath:l,isRepoRoot:u,baseUrl:m?`https://github.com/${o}/${s}`:i}}async fetchFileContent(t,i,o,s){const a=`https://raw.githubusercontent.com/${t}/${i}/${s}/${o}`,l=await fetch(a);if(this.checkRateLimits(l,a),!l.ok)throw new Error(`Failed to fetch file content from GitHub: ${l.status}`);return await l.text()}async listDirectory(t,i,o,s){const a=`https://api.github.com/repos/${t}/${i}/contents/${o}?ref=${s}`,l=await fetch(a);if(this.checkRateLimits(l,a),!l.ok)throw new Error(`Failed to list directory from GitHub: ${l.status}`);const u=await l.json();let m=[];if(Array.isArray(u))m=u;else if(u&&typeof u=="object"&&"tree"in u&&Array.isArray(u.tree))m=u.tree;else throw new Error("Target path is not a directory");return m.map(c=>({name:c.name||c.path.split("/").pop()||"",path:c.path,type:c.type==="tree"?"dir":c.type==="blob"?"file":c.type}))}checkRateLimits(t,i){const o=zi(t,i);if(o.error&&!this.rateLimitWarning&&(this.rateLimitWarning=o.error),o.isLimitExceeded)throw new me(o.error||"Rate limit exceeded")}async fetchConfig(t){this.rateLimitWarning=null;const i=await super.fetchConfig(t);return this.rateLimitWarning&&(i.rateLimitWarning=this.rateLimitWarning),i}}Qe.register(new Di);const pr=async e=>{const t=Qe.resolve(e);if(!t)throw new Error(`Unsupported repository provider URL: ${e}`);return t.fetchConfig(e)};class Ri extends et{canHandle(t){return t.includes("codeberg.org")}parseUrl(t){const i=t.trim();let o="",s="",a="main",l,u=!0;const m=!i.includes("codeberg.org");if(m){const c=i.split("/").filter(Boolean);if(c.length<2)throw new Error("Invalid Codeberg repository format. Must contain owner and repository.");o=c[0],s=c[1],u=c.length===2||c.length===5&&c[2]==="src"&&(c[3]==="branch"||c[3]==="commit"),u?c.length===5&&(a=c[4]):c.length>=5&&c[2]==="src"&&(c[3]==="branch"||c[3]==="commit")?(a=c[4],l=c.slice(5).join("/")):l=c.slice(2).join("/")}else{let c=i;c.match(/^(https?:\/\/)/i)||(c=`https://${c}`);const h=c.endsWith("/")?c.slice(0,-1):c,g=new URL(h).pathname.split("/").filter(Boolean);if(g.length<2)throw new Error("Invalid Codeberg URL. Must contain owner and repository name.");o=g[0],s=g[1],u=g.length===2||g.length===5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit"),u?g.length===5&&(a=g[4]):g.length>=5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit")?(a=g[4],l=g.slice(5).join("/")):l=g.slice(2).join("/")}return s.endsWith(".git")&&(s=s.slice(0,-4)),{owner:o,repo:s,branch:a,filePath:l,isRepoRoot:u,baseUrl:m?`https://codeberg.org/${o}/${s}`:i}}async fetchFileContent(t,i,o,s){const a=`https://codeberg.org/api/v1/repos/${t}/${i}/raw/${o}?ref=${s}`,l=await fetch(a);if(!l.ok)throw new Error(`Failed to fetch file content from Codeberg API: ${l.status}`);return await l.text()}async listDirectory(t,i,o,s){const a=o?`/${o}`:"",l=`https://codeberg.org/api/v1/repos/${t}/${i}/contents${a}?ref=${s}`,u=await fetch(l);if(!u.ok)throw new Error(`Failed to list directory from Codeberg API: ${u.status}`);const m=await u.json();if(!Array.isArray(m))throw new Error("Target path is not a directory");return m.map(c=>({name:c.name,path:c.path||c.name,type:c.type}))}}Qe.register(new Ri);class Ai extends et{canHandle(t){const i=t.trim();return i.match(/^(https?:\/\/)/i)?!i.includes("github.com")&&!i.includes("codeberg.org"):!1}parseUrl(t){const i=t.trim();let o="",s="",a="main",l,u=!0,m=i;m.match(/^(https?:\/\/)/i)||(m=`https://${m}`);const c=m.endsWith("/")?m.slice(0,-1):m,h=new URL(c),b=h.origin,g=h.pathname.split("/").filter(Boolean);if(g.length<2)throw new Error("Invalid Forgejo/Gitea URL. Must contain owner and repository name.");return o=g[0],s=g[1],u=g.length===2||g.length===5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit"),u?g.length===5&&(a=g[4]):g.length>=5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit")?(a=g[4],l=g.slice(5).join("/")):l=g.slice(2).join("/"),s.endsWith(".git")&&(s=s.slice(0,-4)),{owner:o,repo:s,branch:a,filePath:l,isRepoRoot:u,baseUrl:i,host:b}}async fetchFileContent(t,i,o,s,a){const u=`${a||"https://codeberg.org"}/api/v1/repos/${t}/${i}/raw/${o}?ref=${s}`,m=await fetch(u);if(!m.ok)throw new Error(`Failed to fetch file content from Gitea/Forgejo API: ${m.status}`);return await m.text()}async listDirectory(t,i,o,s,a){const l=a||"https://codeberg.org",u=o?`/${o}`:"",m=`${l}/api/v1/repos/${t}/${i}/contents${u}?ref=${s}`,c=await fetch(m);if(!c.ok)throw new Error(`Failed to list directory from Gitea/Forgejo API: ${c.status}`);const h=await c.json();if(!Array.isArray(h))throw new Error("Target path is not a directory");return h.map(b=>({name:b.name,path:b.path||b.name,type:b.type}))}}const Ni=new Ai;Qe.register(Ni);const Ui=({processInjectionsWithConflictResolution:e,setError:t})=>{const[i,o]=p.useState(!1),s=p.useRef(!1);return p.useEffect(()=>{const a=async()=>{const l=new URLSearchParams(window.location.search),u=l.get("github"),m=l.get("codeberg"),c=l.get("forgejo"),h=l.get("gitea");let b=u||m||c||h;if(b){m&&!m.includes("codeberg.org")?b=`https://codeberg.org/${m}`:u&&!u.includes("github.com")&&(b=`https://github.com/${u}`),o(!0),console.log("[useConfigLoader] Loading from URL parameter:",b);try{const g=await pr(b);console.log("[useConfigLoader] Fetch result:",{configLength:g.config.length,footprintsCount:g.footprints.length,outlinesCount:g.outlines.length,configPath:g.configPath,rateLimitWarning:g.rateLimitWarning}),g.rateLimitWarning&&t(g.rateLimitWarning);const w=ur(g.footprints,g.outlines,g.templates);await e(w,g.config)}catch(g){console.error("[useConfigLoader] Failed to load from remote repository:",g),t(`Failed to load from remote repository: ${g instanceof Error?g.message:String(g)}`)}finally{o(!1)}}};s.current||(s.current=!0,a())},[e,t]),{isLoading:i}},uo="background-preview-",Wi=()=>({version:0,active:null,settledVersion:null,settledRequestKey:null}),Oi=e=>!e||!e.startsWith(uo)?null:e.slice(uo.length),Fi=(e,t,i,o)=>JSON.stringify([e,t,i,o]),Mi=(e,t,i)=>{var s;return i?(((s=e.active)==null?void 0:s.requestKey)??e.settledRequestKey)===t:!1},Bi=(e,t)=>{e.version+=1;const o={requestId:`${t.isManual?"ergogen-manual":"ergogen-generate"}-${e.version}-${t.now??Date.now()}`,version:e.version,targetConfigId:t.targetConfigId,requestKey:t.requestKey,isManual:t.isManual};return e.active=o,e.settledVersion=null,e.settledRequestKey=null,o},Ti=(e,t)=>{const i=Oi(t.requestId);if(i!==null)return{kind:"background-preview",configId:i};if(!e.active||t.requestId!==e.active.requestId)return{kind:"stale"};const o=e.active;return e.active=null,t.type==="error"?(e.settledVersion=null,e.settledRequestKey=null,{kind:"active-error",isManual:o.isManual}):t.type==="success"?(e.settledVersion=o.version,e.settledRequestKey=o.requestKey,{kind:"active-success",version:o.version,targetConfigId:o.targetConfigId,isManual:o.isManual}):(e.settledVersion=null,e.settledRequestKey=null,{kind:"active-unknown",isManual:o.isManual})},Gi=(e,t)=>e.active===null&&e.settledVersion!==null&&t===e.settledVersion,Ut=e=>{e.active=null,e.settledVersion=null,e.settledRequestKey=null},po=e=>{e.version+=1,e.active=null,e.settledVersion=null,e.settledRequestKey=null},Xe=(e,t)=>{const i=new Map;for(const o of t){const[s,a,l]=o;let u="footprints";s==="outline"?u="outlines":s==="template"&&(u="templates");const m=e.folder(u);if(m){const c=a.split("/"),h=c.pop();let b=m,g=u;for(const w of c){const x=`${g}/${w}`;let f=i.get(x);f||(f=b.folder(w)||b,i.set(x,f)),b=f,g=x}h&&b.file(`${h}.js`,l)}}},fr=async(e,t,i,o,s)=>{var h;const a=new Ye;a.file("config.yaml",t);const l=a.folder("outputs");if(l){if((h=e.demo)!=null&&h.svg&&l.file("demo.svg",e.demo.svg),e.outlines){let b=null;for(const[g,w]of Object.entries(e.outlines))(o||!g.startsWith("_"))&&(w.dxf||w.svg)&&(b||(b=l.folder("outlines")),b&&(w.dxf&&b.file(`${g}.dxf`,w.dxf),w.svg&&b.file(`${g}.svg`,w.svg)))}if(e.pcbs&&Object.keys(e.pcbs).length>0){const b=l.folder("pcbs");if(b)for(const[g,w]of Object.entries(e.pcbs)){const x=g.endsWith(".kicad_pcb")?g:`${g}.kicad_pcb`;b.file(x,w)}}if(e.cases){let b=null;for(const[g,w]of Object.entries(e.cases)){const x=!!w.jscad,f=s&&!!w.stl;(x||f)&&(b||(b=l.folder("cases")),b&&(w.jscad&&b.file(`${g}.jscad`,w.jscad),s&&w.stl&&b.file(`${g}.stl`,w.stl)))}}if(o){const b=l.folder("debug");if(b){b.file("raw.txt",t);for(const[g,w]of Object.entries(e))["canonical","points","units"].includes(g)&&b.file(`${g}.yaml`,JSON.stringify(w,null,2))}}}i&&i.length>0&&Xe(a,i);const u=await a.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),c=`ergogen-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Je.saveAs(u,c)},Vi=(e,t)=>new Promise((i,o)=>{const s=kt();if(!s){o(new Error("Failed to create Ergogen worker"));return}const a=setTimeout(()=>{s.terminate(),o(new Error("Compilation timed out"))},15e3);s.onmessage=u=>{const m=u.data;m.type==="error"?(clearTimeout(a),o(new Error(m.error)),s.terminate()):m.type==="success"&&(clearTimeout(a),i(m.results),s.terminate())},s.onerror=u=>{clearTimeout(a),o(u),s.terminate()};let l;try{l=JSON.parse(e)}catch{try{l=fe.load(e)}catch{l=e}}s.postMessage({type:"generate",inputConfig:l,injectionInput:t,requestId:`export-compile-${Date.now()}`,options:{debug:!0,svg:!0}})}),Hi=e=>new Promise(t=>{const i=dn();if(!i){t(e);return}const o=setTimeout(()=>{i.terminate(),t(e)},15e3);i.onmessage=s=>{const a=s.data;a.type==="success"&&a.results?(clearTimeout(o),t(a.results)):(clearTimeout(o),t(e)),i.terminate()},i.onerror=()=>{clearTimeout(o),t(e),i.terminate()},i.postMessage({type:"batch_jscad_to_stl",results:e,configVersion:0})}),qi=async(e,t,i,o)=>{var m;const s=new Ye;for(const c of e){const h=c.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled",b=s.folder(h);if(b)try{const g=await Vi(c.config,t);let w=g;o&&g.cases&&Object.keys(g.cases).length>0&&(w=await Hi(g)),b.file("config.yaml",c.config);const x=b.folder("outputs");if(x){if((m=w.demo)!=null&&m.svg&&x.file("demo.svg",w.demo.svg),w.outlines){let f=null;for(const[y,k]of Object.entries(w.outlines))(i||!y.startsWith("_"))&&(k.dxf||k.svg)&&(f||(f=x.folder("outlines")),f&&(k.dxf&&f.file(`${y}.dxf`,k.dxf),k.svg&&f.file(`${y}.svg`,k.svg)))}if(w.pcbs&&Object.keys(w.pcbs).length>0){const f=x.folder("pcbs");if(f)for(const[y,k]of Object.entries(w.pcbs)){const I=y.endsWith(".kicad_pcb")?y:`${y}.kicad_pcb`;f.file(I,k)}}if(w.cases){let f=null;for(const[y,k]of Object.entries(w.cases)){const I=!!k.jscad,L=o&&!!k.stl;(I||L)&&(f||(f=x.folder("cases")),f&&(k.jscad&&f.file(`${y}.jscad`,k.jscad),o&&k.stl&&f.file(`${y}.stl`,k.stl)))}}if(i){const f=x.folder("debug");if(f){f.file("raw.txt",c.config);for(const[y,k]of Object.entries(w))["canonical","points","units"].includes(y)&&f.file(`${y}.yaml`,JSON.stringify(k,null,2))}}}t&&t.length>0&&Xe(b,t)}catch(g){console.error(`Failed to compile config ${c.name}:`,g),b.file("config.yaml",c.config),b.file("error.txt",`Compilation failed: ${g instanceof Error?g.message:String(g)}`)}}const a=await s.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),u=`ergogen-export-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Je.saveAs(a,u)},Ki=async(e,t)=>{const i=new Ye,o=new Set;for(const u of e){const m=u.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled";let c=m,h=1;for(;o.has(c);)c=`${m}_${h}`,h++;o.add(c),i.file(`${c}.yaml`,u.config)}t&&t.length>0&&Xe(i,t);const s=await i.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),l=`ergogen-config-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Je.saveAs(s,l)},Ji=async(e,t,i,o,s,a,l)=>{const u=new Ye,m=new Set;if(s){for(let g=0;g<e.length;g++){if(l())return;const w=e[g];a(g,e.length,w.name);const x=w.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled";let f=x,y=1;for(;m.has(f);)f=`${x}_${y}`,y++;m.add(f),u.file(`${f}.yaml`,w.config)}if(t&&t.length>0){if(l())return;Xe(u,t)}if(l())return;a(e.length,e.length,"Creating ZIP...");const c=await u.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),b=`ergogen-config-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;return Je.saveAs(c,b),{succeededCount:e.length,failedCount:0}}else{const c=new Set,h=(I,L)=>new Promise((P,C)=>{if(l()){C(new Error("Aborted"));return}const A=kt();if(!A){C(new Error("Failed to create Ergogen worker"));return}c.add(A);const R=setTimeout(()=>{A.terminate(),c.delete(A),C(new Error("Compilation timed out"))},3e4);A.onmessage=v=>{const _=v.data;_.type==="error"?(clearTimeout(R),A.terminate(),c.delete(A),C(new Error(_.error))):_.type==="success"&&(clearTimeout(R),A.terminate(),c.delete(A),P(_.results))},A.onerror=v=>{clearTimeout(R),A.terminate(),c.delete(A),C(v)};let z;try{z=JSON.parse(I)}catch{try{z=fe.load(I)}catch{z=I}}A.postMessage({type:"generate",inputConfig:z,injectionInput:L,requestId:`export-compile-${Date.now()}`})}),b=I=>new Promise(L=>{if(l()||!I.cases||Object.keys(I.cases).length===0){L(I);return}const P=dn();if(!P){L(I);return}c.add(P);const C=setTimeout(()=>{P.terminate(),c.delete(P),L(I)},3e4);P.onmessage=A=>{const R=A.data;R.type==="success"?(clearTimeout(C),P.terminate(),c.delete(P),L(R.results)):R.type==="error"&&(clearTimeout(C),P.terminate(),c.delete(P),L(I))},P.onerror=()=>{clearTimeout(C),P.terminate(),c.delete(P),L(I)},P.postMessage({type:"batch_jscad_to_stl",results:I,configVersion:0})}),g=new Set;let w=0,x=0,f=0;const y=Math.min(4,navigator.hardwareConcurrency||2),k=async I=>{var C;if(l())return;g.add(I.name),a(w,e.length,Array.from(g).join(", "));const L=I.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled",P=u.folder(L);if(!P){g.delete(I.name),w++,a(w,e.length,Array.from(g).join(", "));return}try{const A=await h(I.config,t);let R=A;if(A.cases&&Object.keys(A.cases).length>0&&(R=await b(A)),l())return;P.file("config.yaml",I.config);const z=P.folder("outputs");if(z){if((C=R.demo)!=null&&C.svg&&z.file("demo.svg",R.demo.svg),R.outlines){let v=null;for(const[_,S]of Object.entries(R.outlines))(i||!_.startsWith("_"))&&(S.dxf||S.svg)&&(v||(v=z.folder("outlines")),v&&(S.dxf&&v.file(`${_}.dxf`,S.dxf),S.svg&&v.file(`${_}.svg`,S.svg)))}if(R.pcbs&&Object.keys(R.pcbs).length>0){const v=z.folder("pcbs");if(v)for(const[_,S]of Object.entries(R.pcbs)){const D=_.endsWith(".kicad_pcb")?_:`${_}.kicad_pcb`;v.file(D,S)}}if(R.cases){let v=null;for(const[_,S]of Object.entries(R.cases)){const D=!!S.jscad,W=!!S.stl;(D||W)&&(v||(v=z.folder("cases")),v&&(S.jscad&&v.file(`${_}.jscad`,S.jscad),S.stl&&v.file(`${_}.stl`,S.stl)))}}if(i){const v=z.folder("debug");if(v){v.file("raw.txt",I.config);for(const[_,S]of Object.entries(R))["canonical","points","units"].includes(_)&&v.file(`${_}.yaml`,JSON.stringify(S,null,2))}}}t&&t.length>0&&Xe(P,t),x++}catch(A){f++,console.error(`Failed to compile config ${I.name}:`,A),P.file("config.yaml",I.config),P.file("error.txt",`Compilation failed: ${A instanceof Error?A.message:String(A)}`)}finally{g.delete(I.name),w++,a(w,e.length,Array.from(g).join(", "))}};try{const I=[...e],L=[],P=async()=>{if(l()||I.length===0)return;const z=I.shift();await k(z),await P()};for(let z=0;z<Math.min(y,I.length);z++)L.push(P());if(await Promise.all(L),l()){c.forEach(z=>z.terminate()),c.clear();return}a(e.length,e.length,"Creating ZIP...");const C=await u.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),R=`ergogen-export-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;return Je.saveAs(C,R),{succeededCount:x,failedCount:f}}finally{c.forEach(I=>I.terminate()),c.clear()}}},Xi=e=>!e||!Array.isArray(e)?e:e.filter(t=>{if(!Array.isArray(t)||t.length!==3)return!0;const[i]=t;return!(i==="outline"&&!ce("outlines")||i==="template"&&!ce("templates"))}),Yi=e=>{if(!e||!Array.isArray(e))return null;const t=e.some(a=>Array.isArray(a)&&a[0]==="outline"),i=e.some(a=>Array.isArray(a)&&a[0]==="template"),o=t&&!ce("outlines"),s=i&&!ce("templates");if(o||s){const a=[];return o&&a.push("outlines"),s&&a.push("templates"),`Custom ${a.join(" and ")} were skipped because the respective feature flags are disabled in settings.`}return null},Zi=e=>{if(!e||typeof e!="object")return null;const t=e;if(!t.pcbs||typeof t.pcbs!="object")return null;const i=t.pcbs;for(const o of Object.values(i))if(o&&typeof o=="object"&&(!o.template||o.template==="kicad5")){const s=o.footprints;if(s&&typeof s=="object"){for(const a of Object.values(s))if(a&&typeof a=="object"&&typeof a.what=="string"&&a.what.startsWith("ceoloide"))return'KiCad 5 is deprecated. Please add "template: kicad8" to your PCB definitions to avoid errors when opening PCB files with KiCad 8 or newer.'}}return null},Qi=(e,t)=>{if(e&&typeof e=="object"){const i=e;return i.points&&t?{...i,pcbs:void 0,cases:void 0}:i}return e},nn=e=>{var t;return((t=e==null?void 0:e.getRealtimeConfigInput)==null?void 0:t.call(e))??(e==null?void 0:e.configInput)??""},Ve=(e,t)=>{if(typeof window>"u")return t;try{const i=localStorage.getItem(e);return i!==null?JSON.parse(i):t}catch{return t}},fo=()=>({debug:Ve("ergogen:config:debug",!1),autoGen:Ve("ergogen:config:autoGen",!0),autoGen3D:Ve("ergogen:config:autoGen3D",!0),kicanvasPreview:Ve("ergogen:config:kicanvasPreview",!0),stlPreview:Ve("ergogen:config:stlPreview",!0),sendUsageMetrics:_t()}),hr=p.createContext(null),Ae=()=>typeof window<"u"&&window.crypto&&window.crypto.randomUUID?window.crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,e=>{const t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)}),st=(e,t)=>{let i=0;for(const o of e){const s=o.name.match(t);if(s){const a=parseInt(s[1],10);!isNaN(a)&&a>i&&(i=a)}}return i+1},xt="ergogen:deleted-config",es=e=>{try{const t=localStorage.getItem(xt),i={version:1,configs:[]};if(t){const s=JSON.parse(t);s&&Array.isArray(s.configs)&&(i.configs=s.configs,s.version!==void 0&&(i.version=s.version))}const o={...e,deletedAt:new Date().toISOString()};i.configs.push(o),localStorage.setItem(xt,JSON.stringify(i))}catch(t){console.error("Failed to save deleted config to storage:",t)}},ho=()=>{try{const e=localStorage.getItem(xt);if(!e)return;const t=JSON.parse(e);if(!t||!Array.isArray(t.configs))return;let i=t.configs;const o=Date.now(),s=90*24*60*60*1e3;i=i.filter(l=>{const u=new Date(l.deletedAt).getTime();return o-u<=s}),i.length>100&&(i.sort((l,u)=>{const m=new Date(l.updatedAt).getTime(),c=new Date(u.updatedAt).getTime();return m-c}),i=i.slice(i.length-100));const a={version:t.version||1,configs:i};localStorage.setItem(xt,JSON.stringify(a))}catch(e){console.error("Failed to prune deleted configs:",e)}},go=e=>{if(!e)return;let t="";if(typeof e=="string")t=e;else if(Array.isArray(e))t=e.join("");else return;return t=t.replace(/width="[^"]+"/,'width="284px"').replace(/height="[^"]+"/,'height="134px"'),t=t.replace(/<svg/,'<svg style="background-color: rgb(51,51,51);"'),t=t.replaceAll(/stroke="#000"/g,'stroke="#AAA"'),t=t.replaceAll(/stroke:#000/g,"stroke:#AAA"),t},ts=()=>{if(typeof window>"u")return{version:2,activeConfigId:null,configs:[]};const e=localStorage.getItem(fn);if(e)try{const t=JSON.parse(e);if(t&&typeof t.version=="number"){const i=new Date().toISOString(),o=(t.configs||[]).map(s=>({...s,createdAt:s.createdAt||i,updatedAt:s.updatedAt||i}));return{...t,configs:o}}}catch(t){console.error("Failed to parse multi-config storage:",t)}return{version:2,activeConfigId:null,configs:[]}},pe=(e,t,i=2)=>{if(typeof window>"u")return;const o={version:i,activeConfigId:t,configs:e};localStorage.setItem(fn,JSON.stringify(o))},ns=()=>{const e=ts();if(typeof window>"u")return e;const t=localStorage.getItem(tn),i=localStorage.getItem(en);let o="";if(t)try{o=JSON.parse(t)}catch{o=t}else if(i)try{o=JSON.parse(i)}catch{o=i}if(o&&o.trim()!==""){if(!e.configs.some(a=>a.name==="Legacy Config")){const a=Ae(),l={id:a,name:"Legacy Config",config:o,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};e.configs.push(l),e.activeConfigId=a,pe(e.configs,a,2)}localStorage.removeItem(tn),localStorage.removeItem(en)}return e},os=({initialInjectionInput:e,hashError:t,children:i})=>{const[o]=p.useState(()=>{if(typeof window>"u")return!1;const $=localStorage.getItem(tn),E=localStorage.getItem(en);return!!($||E)}),[s]=p.useState(()=>{if(typeof window>"u")return 2;const $=localStorage.getItem(fn);if($)try{const E=JSON.parse($);if(E&&typeof E.version=="number")return E.version}catch(E){console.warn("Failed to parse loaded version:",E)}return 1}),[a]=p.useState(()=>ns()),[l,u]=p.useState(()=>a.configs),[m,c]=p.useState(()=>a.activeConfigId),[h,b]=p.useState(!1),[g,w]=p.useState(null),[x,f]=p.useState(()=>{if(a.activeConfigId){const $=a.configs.find(E=>E.id===a.activeConfigId);return $?$.config:""}return""}),y=p.useRef(l),k=p.useRef(m),I=p.useRef(h),L=p.useRef(g),P=p.useRef(x);p.useEffect(()=>{y.current=l},[l]),p.useEffect(()=>{k.current=m},[m]),p.useEffect(()=>{I.current=h},[h]),p.useEffect(()=>{L.current=g},[g]),p.useEffect(()=>{P.current=x},[x]);const C=p.useRef(x);p.useEffect(()=>{C.current=x},[x]);const A=p.useCallback($=>{C.current=$},[]),R=p.useCallback(()=>C.current,[]),z=p.useRef(void 0),v=p.useRef(null),_=p.useRef(null),S=p.useCallback(()=>{_.current&&(clearTimeout(_.current.timeoutId),_.current=null)},[]),D=p.useCallback(()=>{const $=_.current;$&&(S(),F($.name,$.payload))},[S]),W=p.useCallback(()=>{if(D(),v.current){const{timeoutId:$,payload:E,configId:N}=v.current;clearTimeout($),F("keyboard_generated",E),z.current=N,v.current=null}},[D]),M=p.useCallback(()=>{z.current=void 0,D(),v.current&&(clearTimeout(v.current.timeoutId),v.current=null)},[D]),[U,K]=oo("ergogen:injection",e),[J,ne]=p.useState(null),[Z,B]=p.useState(null),[O,T]=p.useState(null),[Q,G]=p.useState(null),[j,V]=p.useState(null),[H,ee]=p.useState(0),q=p.useRef(Wi()),se=p.useCallback(()=>{po(q.current),V(null),ae(!1),xe(!1)},[]),[ie,Oe]=oo("ergogen:settings",fo()),de=(ie==null?void 0:ie.debug)??!1,ke=(ie==null?void 0:ie.autoGen)??!0,ge=(ie==null?void 0:ie.autoGen3D)??!0,Fe=(ie==null?void 0:ie.kicanvasPreview)??!0,je=(ie==null?void 0:ie.stlPreview)??!0,hn=p.useRef(je);hn.current=je;const[Ce,Cr]=p.useState(_t),Et=p.useRef(ie);Et.current=ie;const gn=p.useRef(ke);gn.current=ke;const Pt=p.useRef(Ce);Pt.current=Ce;const be=p.useCallback($=>{const E=Et.current||fo(),N=$(E);Et.current=N,Oe(N)},[Oe]),mn=p.useCallback($=>{be(E=>{const N=typeof $=="function"?$(E.debug):$;return{...E,debug:N}})},[be]),bn=p.useCallback($=>{be(E=>{const N=typeof $=="function"?$(E.autoGen):$;return{...E,autoGen:N}})},[be]),wn=p.useCallback($=>{be(E=>{const N=typeof $=="function"?$(E.autoGen3D):$;return{...E,autoGen3D:N}})},[be]),xn=p.useCallback($=>{be(E=>{const N=typeof $=="function"?$(E.kicanvasPreview):$;return{...E,kicanvasPreview:N}})},[be]),yn=p.useCallback($=>{be(E=>{const N=typeof $=="function"?$(E.stlPreview):$;return{...E,stlPreview:N}})},[be]),Me=p.useCallback(($,E,N)=>{if(S(),N||!gn.current){F($,E);return}const X=setTimeout(()=>{_.current=null,F($,E)},co);_.current={name:$,payload:E,timeoutId:X}},[S]),kn=p.useCallback($=>{const E=typeof $=="function"?$(Pt.current):$;Pt.current=E,Kr(E),Cr(E),be(N=>({...N,sendUsageMetrics:E}))},[be]);p.useEffect(()=>{ir()},[Ce]);const[Se,vn]=p.useState(!1),[_n,Sr]=p.useState(!1),[jn,$n]=p.useState(!1),[Cn,Sn]=p.useState(!0),[En,Pn]=p.useState(!0),[In,ae]=p.useState(!1),[Ln,tt]=p.useState(!1),we=p.useRef(null),Pe=p.useRef(null),[zn,xe]=p.useState(!1),Dn=p.useRef(!0),It=p.useRef(null);p.useEffect(()=>{ho()},[]),p.useEffect(()=>{t&&ne(t)},[t]);const Rn=p.useCallback(()=>ne(null),[]),An=p.useCallback(()=>B(null),[]),Nn=p.useCallback(()=>T(null),[]),Un=p.useCallback(()=>G(null),[]),Wn=p.useCallback($=>{var X,oe,Y,re,ue,ve;const E=$.data,N=Ti(q.current,E);if(N.kind==="background-preview"){const te=N.configId;if(E.type==="success"&&E.results){const ye=E.results,ze=((oe=(X=ye.outlines)==null?void 0:X.preview)==null?void 0:oe.svg)||((Y=ye.demo)==null?void 0:Y.svg),Be=go(ze);Be&&u(it=>{const Te=it.map(le=>le.id===te?{...le,previewSvg:Be}:le);return pe(Te,k.current,2),Te})}else E.type==="error"&&console.warn(`Background generation failed for config ${te}:`,E.error);return}if(N.kind!=="stale"){if(N.kind==="active-error"){const te=E.type==="error"&&E.error||"Unknown worker error";console.error("--- Ergogen worker error:",te),ne(te),ae(!1),xe(!1),Me("generation_failed",{error_message:te,stored_configs_count:y.current.length,trigger:N.isManual?"manual":"auto"},N.isManual);return}if(N.kind==="active-success")if(E.type==="success"&&E.warnings&&E.warnings.length>0&&B(te=>(te?te+`
`:"")+E.warnings.join(`
`)),E.type==="success"&&E.results){const te=E.results,ye=It.current?performance.now()-It.current:0;Me("generation_completed",{duration_ms:Math.round(ye),points_count:te.points?Object.keys(te.points).length:0,pcbs_count:te.pcbs?Object.keys(te.pcbs).length:0,cases_count:te.cases?Object.keys(te.cases).length:0,has_outlines:!!te.outlines,stored_configs_count:y.current.length,trigger:N.isManual?"manual":"auto"},N.isManual);try{const le=fe.dump(te.canonical||{}),Ee=fe.dump(te.points||{}),$e=ii(le,Ee,Math.round(ye),z.current);if($e.config_id!==z.current){v.current&&clearTimeout(v.current.timeoutId);const Dr=setTimeout(()=>{F("keyboard_generated",$e),z.current=$e.config_id,v.current=null},co);v.current={timeoutId:Dr,payload:$e,configId:$e.config_id}}}catch(le){console.error("Failed to generate keyboard configuration analytics:",le)}const ze=((ue=(re=te.outlines)==null?void 0:re.preview)==null?void 0:ue.svg)||((ve=te.demo)==null?void 0:ve.svg),Be=go(ze),it=N.targetConfigId;Be&&it&&u(le=>{const Ee=le.map($e=>$e.id===it?{...$e,previewSvg:Be}:$e);return pe(Ee,k.current,2),Ee});let Te=!1;if(hn.current&&te.cases&&Object.keys(te.cases).length>0){for(const le of Object.keys(te.cases)){const Ee=te.cases[le];Ee!=null&&Ee.jscad&&(te.cases[le].stl=void 0)}if(Pe.current){Te=!0,xe(!0);const le={type:"batch_jscad_to_stl",results:te,configVersion:N.version};Pe.current.postMessage(le)}}V(te),ee(le=>le+1),Te||ae(!1)}else ae(!1);else ae(!1),xe(!1)}},[Me]),On=p.useRef(Wn);On.current=Wn;const Fn=p.useCallback($=>{const E=$.data;Gi(q.current,E.configVersion)&&(E.type==="error"?(console.error("--- JSCAD worker error:",E.error),xe(!1),ae(!1)):E.type==="success"&&E.results&&(V(E.results),ee(N=>N+1),xe(!1),ae(!1)))},[]),Mn=p.useRef(Fn);Mn.current=Fn;const nt=p.useCallback(()=>{we.current&&(we.current.terminate(),we.current=null,tt(!1));const $=kt();return $?($.onmessage=E=>On.current(E),$.onerror=E=>{console.error("Ergogen worker error:",E);const N=E.message||"Ergogen worker error";Ut(q.current),ne(N),ae(!1),xe(!1),bt(E.message||"Worker crash",!1,"ergogen_worker")},we.current=$,tt(!0)):(tt(!1),console.warn("Failed to initialize Ergogen worker.")),$},[]);p.useEffect(()=>{if(we.current||nt(),!Pe.current){const $=dn();$?($.onmessage=E=>Mn.current(E),$.onerror=E=>{console.error("JSCAD worker error:",E),xe(!1),ae(!1),bt(E.message||"Worker crash",!1,"jscad_worker")},Pe.current=$):console.warn("Failed to initialize JSCAD worker.")}return()=>{we.current&&(we.current.terminate(),we.current=null,tt(!1)),Pe.current&&(Pe.current.terminate(),Pe.current=null)}},[nt]),p.useEffect(()=>{const $=()=>{document.visibilityState==="hidden"&&W()};return window.addEventListener("visibilitychange",$),window.addEventListener("pagehide",W),()=>{window.removeEventListener("visibilitychange",$),window.removeEventListener("pagehide",W),W()}},[W]);const Lt=p.useRef({debug:de,autoGen:ke,autoGen3D:ge,kicanvasPreview:Fe,stlPreview:je,sendUsageMetrics:Ce});p.useEffect(()=>{const $={debug:de,autoGen:ke,autoGen3D:ge,kicanvasPreview:Fe,stlPreview:je,sendUsageMetrics:Ce},{sendUsageMetrics:E,...N}=$;if(Dn.current)Dn.current=!1,Lt.current=$,F("settings_loaded",{...N});else{const X=Lt.current,oe=Object.keys($).find(Y=>$[Y]!==X[Y]);Lt.current=$,F("setting_changed",{...oe?{setting_name:oe,setting_value:$[oe]}:{},...N})}},[de,ke,ge,Fe,je,Ce]);const Bn=p.useCallback($=>{let E="UNKNOWN",N=null;try{N=JSON.parse($),E="json"}catch{}try{N=fe.load($),E="yaml"}catch{}return[E,N]},[]),ot=p.useCallback(async($,E,N={pointsonly:!0})=>{const X=$===void 0||$===P.current?C.current??P.current:$;if(!X)return;const oe=Xi(E),Y=Fi(X,oe,!!N.pointsonly,de);if(Mi(q.current,Y,N.skipIfCurrent))return;const[,re]=Bn(X);ne(null),B(null),T(null),ae(!0),It.current=performance.now();const ue=Zi(re);ue&&B(ue);const ve=Yi(E);ve&&T(ve);const te=Qi(re,N.pointsonly)||X;try{if(!we.current){console.error("Worker not available for processing request."),Ut(q.current),ae(!1),xe(!1),ne("Worker not available for processing request.");return}const ye=Bi(q.current,{requestKey:Y,targetConfigId:k.current,isManual:!!N.isManual});we.current.postMessage({type:"generate",inputConfig:te,injectionInput:oe,requestId:ye.requestId,options:{debug:de,svg:!0}})}catch(ye){Ut(q.current),ae(!1),xe(!1);const ze=typeof ye=="string"?ye:String(ye);ne(ze),Me("generation_failed",{error_message:ze,stored_configs_count:y.current.length,trigger:N.isManual?"manual":"auto"},!!N.isManual);return}},[Bn,ne,B,T,ae,de,Me]),Le=p.useMemo(()=>Ho(($,E,N={pointsonly:!0})=>ot($,E,{...N,skipIfCurrent:!0}),300),[ot]),Ie=p.useCallback(async($,E,N={pointsonly:!0})=>{Le.cancel(),await ot($,E,N)},[Le,ot]),rt=p.useCallback($=>{const E=P.current,N=typeof $=="function"?$(E):$;if(N!==E)if(f(N),I.current){if(N!==L.current){const oe=`Shared Config ${st(y.current,/^Shared\s+Config\s+(\d+)$/)}`,Y=Ae(),re=new Date().toISOString(),ue={id:Y,name:oe,config:N||"",createdAt:re,updatedAt:re},ve=[...y.current,ue];u(ve),c(Y),b(!1),w(null),pe(ve,Y)}}else{const X=k.current;if(X){const oe=y.current.map(Y=>Y.id===X?{...Y,config:N||"",updatedAt:new Date().toISOString()}:Y);u(oe),pe(oe,X)}else{const Y=`Untitled ${st(y.current,/^Untitled\s+(\d+)$/)}`,re=Ae(),ue=new Date().toISOString(),ve={id:re,name:Y,config:N||"",createdAt:ue,updatedAt:ue},te=[...y.current,ve];u(te),c(re),pe(te,re)}}},[]),Tn=p.useCallback($=>{if(M(),se(),$===null)c(null),k.current=null,b(!1),w(null),f(""),P.current="",pe(y.current,null);else{const E=y.current.find(N=>N.id===$);E&&(c($),k.current=$,b(!1),w(null),f(E.config),P.current=E.config,pe(y.current,$),F("config_selected",{stored_configs_count:y.current.length}))}},[M,se]),Gn=p.useCallback(($,E)=>{M(),se();const N=st(y.current,/^Untitled\s+(\d+)$/),X=E||`Untitled ${N}`,oe=Ae(),Y=new Date().toISOString(),re={id:oe,name:X,config:$,createdAt:Y,updatedAt:Y},ue=[...y.current,re];return u(ue),c(oe),b(!1),w(null),f($),F("config_created",{stored_configs_count:ue.length}),y.current=ue,k.current=oe,P.current=$,pe(ue,oe),oe},[M,se]),Vn=p.useCallback(($,E)=>{const N=E.trim();if(!N)return ne("Configuration name cannot be empty"),!1;const X=y.current.find(re=>re.id===$);if(!X)return!1;if(X.name===N)return!0;if(y.current.some(re=>re.id!==$&&re.name.trim().toLowerCase()===N.toLowerCase()))return ne(`A configuration named "${N}" already exists.`),!1;const Y=y.current.map(re=>re.id===$?{...re,name:N,updatedAt:new Date().toISOString()}:re);return u(Y),y.current=Y,pe(Y,k.current),F("config_renamed",{stored_configs_count:Y.length}),!0},[ne]),Hn=p.useCallback($=>{M(),se();const E=y.current.find(N=>N.id===$);if(E){const N=Ae(),X=new Date().toISOString(),oe={id:N,name:`${E.name} (Copy)`,config:E.config,createdAt:X,updatedAt:X},Y=[...y.current,oe];u(Y),c(N),b(!1),w(null),f(E.config),y.current=Y,k.current=N,P.current=E.config,pe(Y,N),F("config_duplicated",{stored_configs_count:Y.length})}},[M,se]),qn=p.useCallback($=>{M();const E=k.current,N=y.current.find(re=>re.id===$),X=y.current.filter(re=>re.id!==$);u(X),y.current=X;const oe=E===$;X.length===0||oe?(se(),c(null),k.current=null,f(""),P.current="",pe(X,null)):pe(X,E),N&&es(N),F("config_deleted",{stored_configs_count:X.length})},[M,se]),Kn=p.useCallback($=>{M(),se(),b(!0),w($),f($)},[M,se]),Jn=p.useCallback(()=>{if(!I.current)return;const E=`Shared Config ${st(y.current,/^Shared\s+Config\s+(\d+)$/)}`,N=Ae(),X=new Date().toISOString(),oe={id:N,name:E,config:P.current||"",createdAt:X,updatedAt:X},Y=[...y.current,oe];u(Y),y.current=Y,c(N),k.current=N,b(!1),w(null),pe(Y,N)},[]),Xn=p.useCallback(()=>{ho()},[]),Yn=p.useCallback(async()=>{await qi(y.current,U,de,je)},[U,de,je]),Zn=p.useCallback(async()=>{await Ki(y.current,U)},[U]),Qn=p.useMemo(()=>{if(h)return"Shared Config";if(m){const $=l.find(E=>E.id===m);return $?$.name:""}return""},[h,m,l]),Er=p.useMemo(()=>({setInjectionInput:K,setConfigInput:rt,generateNow:Ie,getCurrentInjections:()=>U||[],setError:ne}),[U,Ie,K,rt,ne]),{currentConflict:zt,processInjectionsWithConflictResolution:Pr,handleConflictResolution:Ir,handleConflictCancel:Lr}=Ct(Er),{isLoading:eo}=Ui({processInjectionsWithConflictResolution:Pr,setError:ne}),to=p.useRef(null);p.useEffect(()=>{if(t||eo)return;!new URLSearchParams(window.location.search).get("github")&&x&&(to.current=k.current,Ie(x,U,{pointsonly:!1}))},[eo]);const no=p.useRef(Se);p.useEffect(()=>{no.current&&!Se&&(po(q.current),ae(!1),xe(!1),nt(),x&&Ie(x,U,{pointsonly:!ge})),no.current=Se},[Se,x,U,ge,Ie,nt]),p.useEffect(()=>{localStorage.setItem("ergogen:injection",JSON.stringify(U)),ke&&!Se&&Le(x,U,{pointsonly:!ge})},[x,U,ke,ge,Se,Le]),p.useEffect(()=>{Ln&&(s===1||o)&&(console.log("Version 1 or legacy configuration detected on load. Triggering background preview generation for all configs missing a preview SVG..."),pe(y.current,k.current,2),y.current.forEach($=>{var E;!$.previewSvg&&$.id!==to.current&&(console.log(`Triggering background preview generation for: ${$.name}`),(E=we.current)==null||E.postMessage({type:"generate",inputConfig:$.config,requestId:`background-preview-${$.id}`,options:{debug:!0,svg:!0}}))}))},[Ln,s,o]);const zr=p.useMemo(()=>({configInput:x,getRealtimeConfigInput:R,updateRealtimeConfigInput:A,setConfigInput:rt,configs:l,activeConfigId:m,activeConfigName:Qn,isPreview:h,selectConfig:Tn,createNewConfig:Gn,renameConfig:Vn,duplicateConfig:Hn,deleteConfig:qn,exportAllConfigs:Yn,downloadAllConfigs:Zn,loadPreview:Kn,savePreviewConfig:Jn,pruneDeletedConfigs:Xn,injectionInput:U,setInjectionInput:K,processInput:Le,generateNow:Ie,error:J,setError:ne,clearError:Rn,deprecationWarning:Z,clearWarning:An,skippedWarning:O,clearSkippedWarning:Nn,info:Q,setInfo:G,clearInfo:Un,results:j,resultsVersion:H,setResultsVersion:ee,showSettings:Se,setShowSettings:vn,isBulkDownloadOpen:_n,setIsBulkDownloadOpen:Sr,showSideNav:jn,setShowSideNav:$n,showConfig:Cn,setShowConfig:Sn,showDownloads:En,setShowDownloads:Pn,debug:de,setDebug:mn,autoGen:ke,setAutoGen:bn,autoGen3D:ge,setAutoGen3D:wn,kicanvasPreview:Fe,setKicanvasPreview:xn,stlPreview:je,setStlPreview:yn,sendUsageMetrics:Ce,setSendUsageMetrics:kn,isGenerating:In,setIsGenerating:ae,isJscadConverting:zn}),[x,R,A,rt,l,m,Qn,h,Tn,Gn,Vn,Hn,qn,Yn,Zn,_n,Kn,Jn,Xn,U,K,Le,Ie,J,ne,Rn,Z,An,O,Nn,Q,G,Un,j,H,ee,Se,vn,jn,$n,Cn,Sn,En,Pn,de,mn,ke,bn,ge,wn,Fe,xn,je,yn,Ce,kn,In,ae,zn]);return n.jsxs(hr.Provider,{value:zr,children:[i,zt&&n.jsx($t,{injectionName:zt.name,injectionType:zt.type,onResolve:Ir,onCancel:Lr,"data-testid":"conflict-resolution-dialog"})]})},_e=()=>p.useContext(hr),rs=({className:e,options:t,"data-testid":i,"aria-label":o})=>{const s=_e(),a=p.useRef(null),l={configInput:void 0,setConfigInput:k=>{},updateRealtimeConfigInput:k=>{},injectionInput:void 0,generateNow:async()=>{},activeConfigId:null},{configInput:u,updateRealtimeConfigInput:m,setConfigInput:c,injectionInput:h,generateNow:b,activeConfigId:g}=s??l,w=p.useRef({updateRealtimeConfigInput:m,setConfigInput:c,injectionInput:h,generateNow:b});w.current={updateRealtimeConfigInput:m,setConfigInput:c,injectionInput:h,generateNow:b};const x=p.useRef(Ho(k=>{c(k)},500)).current;p.useEffect(()=>()=>{x.cancel()},[x]),p.useEffect(()=>{if(a.current){if(a.current.hasTextFocus())return;const k=a.current.getValue();u!==void 0&&u!==k&&a.current.setValue(u)}},[u]);const f=p.useCallback(k=>{k!==void 0&&(m(k),x(k))},[x,m]),y=(k,I)=>{a.current=k,k.onDidBlurEditorText(()=>{x.flush()}),k.addAction({id:"generate-config",label:"Generate",keybindings:[I.KeyMod.CtrlCmd|I.KeyCode.Enter],run:()=>{const{updateRealtimeConfigInput:L,setConfigInput:P,injectionInput:C,generateNow:A}=w.current,R=k.getValue();x.cancel(),L(R),P(R),F("shortcut_used",{action:"generate"}),A(R,C,{pointsonly:!1,isManual:!0})}})};return s?n.jsx("div",{className:e,"data-testid":i,"aria-label":o,children:n.jsx(qo,{height:"100%",defaultLanguage:"yaml",language:"yaml",onChange:f,onMount:y,defaultValue:u,theme:"ergogen-theme",options:t||void 0},g||"preview")}):null},is=({className:e,options:t,injection:i,setInjection:o,"data-testid":s,"aria-label":a})=>{const l=_e(),u=async m=>{if(!m)return null;const c={...i,content:m};o(c)};return l?n.jsx(ss,{className:e,"data-testid":s,"aria-label":a,children:n.jsx(qo,{height:"100%",defaultLanguage:"javascript",language:"javascript",onChange:u,value:i.content,theme:"ergogen-theme",options:t||void 0})}):null},ss=d.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: 0.5rem;
`,as=yt`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,ls=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;

  @media (max-width: 639px) {
    padding-bottom: 0.75rem;
  }
`,cs=d.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${r.fontSizes.bodySmall};
  cursor: ${e=>e.$hasPreview?"pointer":"default"};
  border-bottom: ${e=>e.$active?`2px solid ${r.colors.accent}`:"2px solid transparent"};
  border-top: 2px solid transparent;
  opacity: ${e=>e.$disabled?.5:1};
  color: ${e=>e.$disabled?r.colors.textDarker:r.colors.white};
`,ds=d.div`
  white-space: nowrap;
  display: flex;
  gap: 10px;
  align-items: center;
`,us=d.a`
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
`,ps=d.a`
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
    animation: ${as} 1s linear infinite;
  }
`,fs=({fileName:e,extension:t,content:i,preview:o,setPreview:s,previewKey:a,"data-testid":l})=>{const u=t==="stl"&&!i||t==="kicad_pcb"&&!o,m=t==="stl"&&!i,c=()=>{if(m)return;F("download_button_clicked",{download_type:t,source:"downloads_panel"});const g=document.createElement("a"),w=new Blob([i],{type:"octet/stream"}),x=URL.createObjectURL(w);g.href=x,g.download=`${e}.${t}`,document.body.appendChild(g);try{g.click()}finally{document.body.removeChild(g),URL.revokeObjectURL(x)}},h=()=>{o&&!u&&s(o)},b=l?`${l}-${t}`:void 0;return n.jsxs(ls,{"data-testid":b,children:[n.jsxs(cs,{$active:a===(o==null?void 0:o.key),$hasPreview:!!o,$disabled:u,onClick:h,"data-testid":b&&`${b}-preview`,children:[e,".",t]}),n.jsx(ds,{children:m?n.jsx(ps,{"aria-label":`Generating ${e}.${t}`,"data-testid":b&&`${b}-loading`,children:n.jsx("span",{className:"material-symbols-outlined",children:"progress_activity"})}):n.jsx(us,{onClick:c,"aria-label":`Download ${e}.${t}`,"data-testid":b&&`${b}-download`,children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})})]})},hs=d.h3`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  margin: 0 0 1rem;

  @media (max-width: 639px) {
    display: none;
  }
`,gs=d.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;

  @media (max-width: 639px) {
    padding: 0.5rem;
  }
`,ms=d.div`
  font-size: ${r.fontSizes.sm};
  color: ${r.colors.textDarkest};
  font-style: italic;
  padding: 0.5rem 0;
`,bs=({setPreview:e,previewKey:t,"data-testid":i})=>{var m,c;const o=[],s=_e();if(!s)return null;const{configInput:a,results:l}=s;if(l!=null&&l.demo&&o.push({fileName:"raw",extension:"txt",content:a??"",previewKey:"raw",preview:{key:"raw",extension:"txt",content:a??""}},{fileName:"canonical",extension:"yaml",content:fe.dump(l.canonical),previewKey:"canonical",preview:{key:"canonical",extension:"yaml",content:fe.dump(l.canonical)}},{fileName:"demo",extension:"dxf",content:((m=l.demo)==null?void 0:m.dxf)??"",previewKey:"demo.svg",preview:{key:"demo.svg",extension:"svg",content:((c=l.demo)==null?void 0:c.svg)??""}},{fileName:"points",extension:"yaml",content:fe.dump(l.points),previewKey:"points",preview:{key:"points",extension:"yaml",content:fe.dump(l.points)}},{fileName:"units",extension:"yaml",content:fe.dump(l.units),previewKey:"units",preview:{key:"units",extension:"yaml",content:fe.dump(l.units)}}),l!=null&&l.outlines)for(const[h,b]of Object.entries(l.outlines))o.push({fileName:h,extension:"dxf",content:b.dxf??"",previewKey:`outlines.${h}.svg`,preview:{key:`outlines.${h}.svg`,extension:"svg",content:b.svg??""}});if(l!=null&&l.cases){for(const[h,b]of Object.entries(l.cases))if(o.push({fileName:h,extension:"jscad",content:b.jscad??"",previewKey:`cases.${h}`,preview:{key:`cases.${h}`,extension:"jscad",content:b.jscad??""}}),s.stlPreview&&b.jscad){const g=!!b.stl;o.push({fileName:h,extension:"stl",content:b.stl??"",previewKey:g?`cases.${h}.stl`:"",preview:g?{key:`cases.${h}.stl`,extension:"stl",content:b.stl??""}:void 0})}}if(l!=null&&l.pcbs)for(const[h,b]of Object.entries(l.pcbs)){const w=String(b).match(/version "?([0-9]+)"?/),x=w&&w.length>1?Number(w[1]):-1;o.push({fileName:h,extension:"kicad_pcb",content:b,previewKey:s.kicanvasPreview&&x>20240101?`pcbs.${h}`:"",preview:s.kicanvasPreview&&x>20240101?{key:`pcbs.${h}`,extension:"kicad_pcb",content:b}:void 0})}const u=o.filter(h=>!(!s.debug&&(h.fileName.startsWith("_")||{units:"yaml",points:"yaml",canonical:"yaml",raw:"txt"}[h.fileName]===h.extension||s.stlPreview&&h.extension==="jscad")));return n.jsxs(gs,{"data-testid":i,children:[n.jsx(hs,{children:"Outputs"}),u.length>0?u.map((h,b)=>n.jsx(fs,{...h,setPreview:e,previewKey:t,"data-testid":i&&`${i}-${h.fileName}`},b)):n.jsx(ms,{children:"No outputs"})]})},ws=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
`,xs=d.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${r.fontSizes.bodySmall};
  cursor: pointer;
  border-bottom: ${e=>e.$active?`2px solid ${r.colors.accent}`:"2px solid transparent"};
  border-top: 2px solid transparent;
`,ys=d.div`
  white-space: nowrap;
  display: flex;
  gap: 6px;
  align-items: center;
`,gr=Ko`
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
`,mo=d.a`
  ${gr}
`,ks=d.a`
  ${gr}

  @media (min-width: 640px) {
    display: none;
  }
`,Wt=({injection:e,setInjectionToEdit:t,deleteInjection:i,previewKey:o,"data-testid":s})=>{const[a,l]=p.useState("");return p.useEffect(()=>{const u=window.URL.createObjectURL(new Blob([e.content],{type:"octet/stream"}));return l(u),()=>{window.URL.revokeObjectURL(u)}},[e.content]),n.jsxs(ws,{"data-testid":s,children:[n.jsx(xs,{"data-testid":s&&`${s}-name`,$active:o===e.name,onClick:()=>t(e),children:e.name}),n.jsxs(ys,{children:[n.jsx(ks,{href:"#",onClick:u=>{u.preventDefault(),t(e)},"aria-label":`edit injection ${e.name}`,"data-testid":s&&`${s}-edit`,children:n.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),n.jsx(mo,{href:"#",onClick:u=>{u.preventDefault(),i(e)},"aria-label":`delete injection ${e.name}`,"data-testid":s&&`${s}-delete`,children:n.jsx("span",{className:"material-symbols-outlined",children:"delete"})}),n.jsx(mo,{target:"_blank",rel:"noopener noreferrer",download:`${e.name.split("/").reverse()[0]}.js`,href:a||void 0,"aria-label":`download injection ${e.name}`,"data-testid":s&&`${s}-download`,children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})]})]})},Ke=d.button`
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
`,gt=d.h3`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  margin: 1.5rem 0.5rem 1rem 0.5rem;
`,bo=e=>{const o=new DOMParser().parseFromString(e,"image/svg+xml").querySelectorAll("path"),s=[];return o.forEach(a=>{const l=a.getAttribute("d");if(l&&l.trim()){const u=l.replace(/\\/g,"\\\\").replace(/"/g,'\\"');s.push(`        "${u}"`)}}),`const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
${s.join(`,
`)}
    ];
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
};`},Ot=d.div`
  display: flex;
  margin-left: 0.5rem;
  margin-left: 0.5rem;
  gap: 8px;
  margin-top: 0.5rem;
`,De=d(Ke)`
  flex-grow: 0;
  width: 34px;
  padding: 0;
`,vs=d.div`
  display: flex;
  margin-left: 0.5rem;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.5rem;
`,_s=d.div`
  display: flex;
  margin-left: 0.5rem;
  border-bottom: 1px solid ${r.colors.border};
  margin-left: 0.5rem;
  gap: 16px;
`,Ft=d.button`
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
`,js=({setInjectionToEdit:e,deleteInjection:t,injectionToEdit:i,onInjectionSelect:o,"data-testid":s})=>{const a=[],l=[],u=[],m=p.useRef(null),c=p.useRef(null),h=_e(),[b,g]=p.useState("footprint"),[w,x]=p.useState("footprints"),{currentConflict:f,processInjectionsWithConflictResolution:y,handleConflictResolution:k,handleConflictCancel:I}=Ct({setInjectionInput:v=>h==null?void 0:h.setInjectionInput(v),setConfigInput:v=>h==null?void 0:h.setConfigInput(v),generateNow:async(v,_,S)=>{await(h==null?void 0:h.generateNow(v,_,S))},getCurrentInjections:()=>(h==null?void 0:h.injectionInput)||[],setError:v=>h==null?void 0:h.setError(v)});if(!h)return null;const{injectionInput:L}=h;if(L&&Array.isArray(L)&&L.length>0)for(let v=0;v<L.length;v++){const _=L[v];if(_.length===3){let S=u;_[0]==="footprint"?S=a:_[0]==="outline"?S=l:_[0]==="template"&&(S=u),S.push({key:v,type:_[0],name:_[1],content:_[2]})}}const P=()=>{var S;const v=((S=h==null?void 0:h.injectionInput)==null?void 0:S.length)||0,_={key:v,type:"footprint",name:`custom_footprint_${v+1}`,content:`module.exports = {
  params: {
    designator: '',
  },
  body: p => \`\`
}`};F("injection_created",{injection_type:"footprint"}),e(_),o&&o()},C=()=>{var S;const v=((S=h==null?void 0:h.injectionInput)==null?void 0:S.length)||0,_={key:v,type:"outline",name:`custom_outline_${v+1}`,content:`const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
        ""  // Add your SVG path(s) here
    ];
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
};`};F("injection_created",{injection_type:"outline"}),e(_),o&&o()},A=()=>{var S;const v=((S=h==null?void 0:h.injectionInput)==null?void 0:S.length)||0,_={key:v,type:"template",name:`custom_template_${v+1}`,content:`const m = require('makerjs')
const version = require('../../package.json').version

module.exports = {
    convert_outline: (model, layer) => {
        return \`\`;  // Return your converted outlines
    },
    body: params => {
        return \`\`;  // Add your template text here
    }
}`};F("injection_created",{injection_type:"template"}),e(_),o&&o()},R=async v=>{const _=v.target.files;if(!_||_.length===0)return;const S=[];for(let D=0;D<_.length;D++){const W=_[D];if(W.name.endsWith(".js")){const M=await W.text(),U=W.name.replace(/\.js$/,"");S.push([b,U,M])}else if(b==="outline"&&W.name.endsWith(".svg")){const M=await W.text(),U=bo(M),K=W.name.replace(/\.svg$/,"");S.push([b,K,U])}}S.length>0&&(F("injection_uploaded",{injection_type:b,source:"file",file_count:S.length}),await y(S,h.configInput||"")),v.target.value=""},z=async v=>{const _=v.target.files;if(!_||_.length===0)return;const S=[];for(let D=0;D<_.length;D++){const W=_[D];if(W.name.endsWith(".js")){const M=await W.text(),U=W.webkitRelativePath.split("/");U.shift();const K=U.join("/").replace(/\.js$/,"");S.push([b,K,M])}else if(b==="outline"&&W.name.endsWith(".svg")){const M=await W.text(),U=W.webkitRelativePath.split("/");U.shift();const K=U.join("/").replace(/\.svg$/,""),J=bo(M);S.push([b,K,J])}}S.length>0&&(F("injection_uploaded",{injection_type:b,source:"folder",file_count:S.length}),await y(S,h.configInput||"")),v.target.value=""};return n.jsxs(vs,{"data-testid":s,children:[f&&n.jsx($t,{injectionName:f.name,injectionType:f.type,onResolve:k,onCancel:I,"data-testid":"conflict-resolution-dialog"}),n.jsx(gt,{children:"Custom Libraries"}),n.jsxs(_s,{children:[n.jsx(Ft,{$active:w==="footprints",onClick:()=>{x("footprints"),g("footprint")},"data-testid":"tab-footprints",children:"Footprints"}),ce("outlines")&&n.jsx(Ft,{$active:w==="outlines",onClick:()=>{x("outlines"),g("outline")},"data-testid":"tab-outlines",children:"Outlines"}),ce("templates")&&n.jsx(Ft,{$active:w==="templates",onClick:()=>{x("templates"),g("template")},"data-testid":"tab-templates",children:"Templates"})]}),w==="footprints"&&n.jsxs(n.Fragment,{children:[a.map(v=>n.jsx(Wt,{injection:v,setInjectionToEdit:_=>{F("injection_editor_opened",{injection_type:_.type}),e(_),o&&o()},deleteInjection:t,previewKey:i.name,"data-testid":s&&`${s}-${v.name}`},v.key)),n.jsxs(Ot,{children:[n.jsx(Ke,{onClick:P,"data-testid":"add-footprint","aria-label":"Add new custom footprint",title:"Add footprint",children:n.jsx("span",{className:"material-symbols-outlined",children:"add"})}),n.jsx(De,{onClick:()=>{g("footprint"),setTimeout(()=>{var v;return(v=m.current)==null?void 0:v.click()},0)},"data-testid":"load-footprint-files","aria-label":"Load custom footprint files",title:"Load footprint files",children:n.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),n.jsx(De,{onClick:()=>{g("footprint"),setTimeout(()=>{var v;return(v=c.current)==null?void 0:v.click()},0)},"data-testid":"load-footprint-folder","aria-label":"Load custom footprint folder",title:"Load footprint folder",children:n.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),w==="outlines"&&ce("outlines")&&n.jsxs(n.Fragment,{children:[l.map(v=>n.jsx(Wt,{injection:v,setInjectionToEdit:_=>{F("injection_editor_opened",{injection_type:_.type}),e(_),o&&o()},deleteInjection:t,previewKey:i.name,"data-testid":s&&`${s}-${v.name}`},v.key)),n.jsxs(Ot,{children:[n.jsx(Ke,{onClick:C,"data-testid":"add-outline","aria-label":"Add new custom outline",title:"Add outline",children:n.jsx("span",{className:"material-symbols-outlined",children:"add"})}),n.jsx(De,{onClick:()=>{g("outline"),setTimeout(()=>{var v;return(v=m.current)==null?void 0:v.click()},0)},"data-testid":"load-outline-files","aria-label":"Load custom outline files",title:"Load outline files",children:n.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),n.jsx(De,{onClick:()=>{g("outline"),setTimeout(()=>{var v;return(v=c.current)==null?void 0:v.click()},0)},"data-testid":"load-outline-folder","aria-label":"Load custom outline folder",title:"Load outline folder",children:n.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),w==="templates"&&ce("templates")&&n.jsxs(n.Fragment,{children:[u.map(v=>n.jsx(Wt,{injection:v,setInjectionToEdit:_=>{F("injection_editor_opened",{injection_type:_.type}),e(_),o&&o()},deleteInjection:t,previewKey:i.name,"data-testid":s&&`${s}-${v.name}`},v.key)),n.jsxs(Ot,{children:[n.jsx(Ke,{onClick:A,"data-testid":"add-template","aria-label":"Add new custom template",title:"Add template",children:n.jsx("span",{className:"material-symbols-outlined",children:"add"})}),n.jsx(De,{onClick:()=>{g("template"),setTimeout(()=>{var v;return(v=m.current)==null?void 0:v.click()},0)},"data-testid":"load-template-files","aria-label":"Load custom template files",title:"Load template files",children:n.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),n.jsx(De,{onClick:()=>{g("template"),setTimeout(()=>{var v;return(v=c.current)==null?void 0:v.click()},0)},"data-testid":"load-template-folder","aria-label":"Load custom template folder",title:"Load template folder",children:n.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),n.jsx("input",{type:"file",ref:m,onChange:R,accept:b==="outline"?".js,.svg":".js",multiple:!0,style:{display:"none"}}),n.jsx("input",{type:"file",ref:c,onChange:z,accept:b==="outline"?".js,.svg":".js",style:{display:"none"},webkitdirectory:"",directory:""})]})},$s=d.img`
  filter: invert();
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
`,Cs=d(Rr.PanZoom)`
  overflow: hidden;
  height: 100%;

  &:focus-visible {
    outline: none;
  }
`,Ss=({svg:e,width:t,height:i,"aria-label":o,"data-testid":s})=>n.jsx(Cs,{enableBoundingBox:!0,minZoom:.8,maxZoom:5,"aria-label":o,"data-testid":s,children:n.jsx($s,{width:t||"100%",height:i||"100%",src:`data:image/svg+xml;utf8,${encodeURIComponent(e)}`,alt:"Ergogen SVG Output preview",draggable:"false"})}),Mt=({content:e,language:t,className:i,height:o,options:s,"aria-label":a,"data-testid":l})=>n.jsx("div",{className:i,"aria-label":a,"data-testid":l,children:n.jsx(Ar,{height:o||"80vh",language:t,value:e,theme:"ergogen-theme",options:s||{readOnly:!0}})}),Es=p.lazy(()=>er(()=>import("./PcbPreview-DsKQssW6.js"),__vite__mapDeps([0,1]))),Ps=p.lazy(()=>er(()=>import("./StlPreview-CtZa10ge.js"),__vite__mapDeps([2,1,3,4,5]))),mr=d.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: ${r.colors.background};
`,br=d.img`
  width: 96px;
  height: 96px;
  opacity: 0.12;
  filter: grayscale(100%);
  -webkit-user-drag: none;
  user-drag: none;
`,Is=d.span`
  color: ${r.colors.textDarkest};
  font-size: ${r.fontSizes.sm};
  margin-top: 1rem;
  font-family: ${r.fonts.body};
  user-select: none;
`,wo=()=>n.jsxs(mr,{children:[n.jsx(br,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"}),n.jsx(Is,{children:"Loading preview..."})]}),Ls=({previewExtension:e,previewContent:t,previewKey:i,width:o="100%",height:s="100%",className:a,"data-testid":l,"aria-label":u})=>{if(!t||typeof t=="string"&&t===""||t instanceof ArrayBuffer&&t.byteLength===0||ArrayBuffer.isView(t)&&t.byteLength===0)return n.jsx(mr,{className:a,"data-testid":l,"aria-label":u,children:n.jsx(br,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"})});const c=h=>{switch(h){case"svg":return n.jsx(Ss,{svg:t,width:o,height:s,"aria-label":u||`SVG preview for ${i}`,"data-testid":l&&`${l}-svg`});case"yaml":return n.jsx(Mt,{language:"yaml",content:t,"aria-label":u||`YAML preview for ${i}`,"data-testid":l&&`${l}-yaml`});case"txt":return n.jsx(Mt,{language:"text",content:t,"aria-label":u||`Text preview for ${i}`,"data-testid":l&&`${l}-txt`});case"jscad":return n.jsx(Mt,{language:"javascript",content:t,"aria-label":u||`JSCAD code preview for ${i}`,"data-testid":l&&`${l}-jscad-text`});case"kicad_pcb":return n.jsx(p.Suspense,{fallback:n.jsx(wo,{}),children:n.jsx(Es,{pcb:t,previewKey:i,"aria-label":u||`PCB preview for ${i}`,"data-testid":l&&`${l}-pcb`},i)});case"stl":return n.jsx(p.Suspense,{fallback:n.jsx(wo,{}),children:n.jsx(Ps,{stl:t,"aria-label":u||`STL preview for ${i}`,"data-testid":l&&`${l}-stl`})});default:return"No preview available"}};return n.jsx("div",{className:a,"data-testid":l,"aria-label":u,children:c(e)})},Bt=({children:e,initialWidth:t=300,minWidth:i=10,maxWidth:o="100%",side:s="left",style:a,"data-testid":l})=>{const[u,m]=p.useState(t),c=p.useRef(!1),h=p.useRef(0),b=p.useRef(t),g=p.useRef(null),w=f=>{if(typeof f=="string"&&f.includes("%")){const y=parseFloat(f)/100;return window.innerWidth*y}else return typeof f=="string"&&f.includes("px")?parseFloat(f):typeof f=="number"?f:1/0};p.useEffect(()=>{const f=L=>{if(!c.current)return;const P=s==="left"?L.clientX-h.current:h.current-L.clientX,C=b.current+P,A=w(o),R=Math.max(i,Math.min(C,A));m(R)},y=()=>{c.current&&(c.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},k=L=>{if(!c.current)return;L.preventDefault();const P=L.touches[0],C=s==="left"?P.clientX-h.current:h.current-P.clientX,A=b.current+C,R=w(o),z=Math.max(i,Math.min(A,R));m(z)},I=()=>{c.current&&(c.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",f),window.addEventListener("mouseup",y),window.addEventListener("touchmove",k,{passive:!1}),window.addEventListener("touchend",I),()=>{window.removeEventListener("mousemove",f),window.removeEventListener("mouseup",y),window.removeEventListener("touchmove",k),window.removeEventListener("touchend",I)}},[i,o,s]);const x=f=>{f.preventDefault(),f.stopPropagation(),c.current=!0,b.current=u,"touches"in f?h.current=f.touches[0].clientX:h.current=f.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};return n.jsxs(zs,{ref:g,$side:s,style:{width:`${u}px`,...a},"data-testid":l,children:[e,n.jsx(Ds,{$side:s,onMouseDown:x,onTouchStart:x,"data-testid":l&&`${l}-resize-handle`})]})},zs=d.div`
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
`,Ds=d.div`
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
`,on=(e,t)=>{if(t===null)return null;if(e==="")return t;if(typeof t!="object")return;const i=e.split("."),o=i[0],s=i.slice(1).join(".");return Object.prototype.hasOwnProperty.call(t,o)?on(s,t[o]):void 0},Rs=(e,t,i,o="")=>{let s=t,a=i,l=null;e&&(l=on(s,e),l===void 0&&s!=="demo.svg"&&(s="demo.svg",a="svg",l=on(s,e)));let u="";switch(a){case"svg":case"kicad_pcb":u=typeof l=="string"?l:"";break;case"stl":u=typeof l=="string"||l instanceof ArrayBuffer||ArrayBuffer.isView(l)?l:"";break;case"jscad":u=typeof(l==null?void 0:l.jscad)=="string"?l.jscad:"";break;case"yaml":u=fe.dump(l);break;case"txt":u=o;break;default:u=""}return{key:s,extension:a,content:u}};function wr(){if(typeof navigator<"u"){if("userAgentData"in navigator&&navigator.userAgentData){const e=navigator.userAgentData;if(e.platform&&/mac/i.test(e.platform))return!0}if(/Mac|iPhone|iPad|iPod/i.test(navigator.userAgent))return!0}return!1}const As=d.input.attrs(e=>({type:"text",$size:e.$size||"0.5em"}))`
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
`,Ns=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`,Us=d.label`
  display: flex;
  flex-direction: column;
  flex: 1;
  cursor: ${e=>e.$disabled?"not-allowed":"pointer"};
  user-select: none;
  text-align: left;
`,Ws=d.span`
  color: ${r.colors.text};
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
`,Os=d.span`
  color: ${r.colors.textDarker};
  font-size: ${r.fontSizes.sm};
  margin-top: 0.25rem;
  line-height: 1.4;
`,Fs=d.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`,Ms=d.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: ${e=>e.$disabled?"not-allowed":"pointer"};
  opacity: ${e=>e.$disabled?.5:1};
`,Bs=d.input`
  opacity: 0;
  width: 0;
  height: 0;
`,Ts=d.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${e=>e.$checked?r.colors.accent:r.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`,Gs=d.span`
  position: absolute;
  top: 2px;
  left: ${e=>e.$checked?"18px":"2px"};
  width: 16px;
  height: 16px;
  background-color: ${r.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,Re=({optionId:e,label:t,description:i,setSelected:o,checked:s,disabled:a=!1,"aria-label":l})=>n.jsxs(Ns,{children:[n.jsxs(Us,{htmlFor:e,$disabled:a,children:[n.jsx(Ws,{children:t}),i&&n.jsx(Os,{children:i})]}),n.jsx(Fs,{children:n.jsxs(Ms,{$disabled:a,htmlFor:e,children:[n.jsx(Bs,{type:"checkbox",id:e,checked:s,disabled:a,onChange:u=>o(u.target.checked),"data-testid":`option-${e}`,"aria-label":l}),n.jsx(Ts,{$checked:s}),n.jsx(Gs,{$checked:s})]})})]}),Ne=d.button`
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
`,at=d.h4`
  font-size: ${r.fontSizes.sm};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.textDarker};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 1.5rem 0.5rem 0.5rem 0.5rem;

  &:first-of-type {
    margin-top: 0.5rem;
  }
`,lt=d.div`
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
`,Vs=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`,Hs=d.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  user-select: none;
  text-align: left;
`,qs=d.span`
  color: ${r.colors.text};
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
`,rn=d.span`
  color: ${r.colors.textDarker};
  font-size: ${r.fontSizes.sm};
  margin-top: 0.25rem;
  line-height: 1.4;
`,Ks=d(rn)`
  color: ${r.colors.warningDark};
`,Js=d.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`,Xs=({isAvailable:e,isInstalled:t,isInstalling:i,onInstall:o})=>{let s,a;return t?(s=n.jsx(rn,{children:"The application is installed and available offline."}),a=n.jsx(he,{size:"sm",disabled:!0,"data-testid":"pwa-installed-button",children:"Installed"})):e?(s=n.jsx(rn,{children:"Install the app locally to access it offline without network connectivity."}),i?a=n.jsx(he,{size:"sm",disabled:!0,"data-testid":"pwa-installing-button",children:"Installing..."}):a=n.jsx(he,{size:"sm",onClick:o,"data-testid":"pwa-install-button",children:"Install App"})):(s=n.jsx(Ks,{children:"PWA installation is not supported by your browser or environment."}),a=n.jsx(he,{size:"sm",disabled:!0,"data-testid":"pwa-unavailable-button",children:"Unavailable"})),n.jsxs(Vs,{children:[n.jsxs(Hs,{children:[n.jsx(qs,{children:"Offline App"}),s]}),n.jsx(Js,{children:a})]})},Ys=(e,t,i,o)=>{const s={config:e,...t&&t.length>0?{injections:t}:{},guiVersion:vt.version,ergogenVersion:pn("github:ceoloide/ergogen#v4.3.0")},a=JSON.stringify(s);return Jo.compressToEncodedURIComponent(a)},Zs=()=>new URLSearchParams(window.location.search).get("debug")!==null,Qs=e=>{var i;const t=Zs();try{const o=Jo.decompressFromEncodedURIComponent(e);if(!o)return console.error("[Share] DECODE_ERROR: Failed to decompress encoded string"),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The encoded data could not be decompressed."};let s;try{s=JSON.parse(o)}catch(l){return console.error("[Share] DECODE_ERROR: Failed to parse decompressed JSON",{parseError:l,decompressedLength:o.length,decompressedPreview:o.substring(0,100)}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The decompressed data is not valid JSON."}}if(!s||typeof s!="object"||!("config"in s)||typeof s.config!="string")return console.error("[Share] VALIDATION_ERROR: Invalid object structure",{parsed:s,hasConfig:s&&typeof s=="object"&&"config"in s,configType:s&&typeof s=="object"&&"config"in s?typeof s.config:"N/A"}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link does not contain a valid configuration. The decoded data is missing required fields or has an invalid structure."};const a=s;return(!a.guiVersion||typeof a.guiVersion!="string")&&(a.guiVersion="0.9.0"),(!a.ergogenVersion||typeof a.ergogenVersion!="string")&&(a.ergogenVersion="github:ergogen/ergogen#v4.2.1"),"injections"in a&&a.injections!==void 0&&(!Array.isArray(a.injections)||!a.injections.every(l=>Array.isArray(l)&&l.length===3&&typeof l[0]=="string"&&typeof l[1]=="string"&&typeof l[2]=="string"))?(console.error("[Share] VALIDATION_ERROR: Invalid injections structure",{injections:a.injections,isArray:Array.isArray(a.injections)}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link contains invalid injections data. Injections must be an array of [type, name, content] tuples."}):(t&&console.log("[Share] DEBUG: Decoded configuration object",{configLength:a.config.length,hasInjections:a.injections!==void 0,injectionsCount:((i=a.injections)==null?void 0:i.length)??0,fullObject:a}),{success:!0,config:a})}catch(o){return console.error("[Share] DECODE_ERROR: Unexpected error during decoding",{error:o,errorMessage:o instanceof Error?o.message:String(o),errorStack:o instanceof Error?o.stack:void 0}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. An unexpected error occurred while decoding."}}},ea=e=>{const{config:t,injections:i,canonical:o}=e;let s=i;if(o&&i&&i.length>0){const m=yr(o);s=ta(i,m)}const a=s&&s.length>0?s:void 0,l=Ys(t,a);return`${window.location.origin+window.location.pathname}#${l}`},xr=()=>{const e=window.location.hash;if(!e||e.length<=1)return null;const t=e.substring(1);return Qs(t)},yr=e=>{const t=new Set,i=new Set,o=new Set;if(!e||typeof e!="object")return{footprints:t,templates:i,outlines:o};const s=e;if(s.pcbs&&typeof s.pcbs=="object"){for(const a of Object.values(s.pcbs))if(!(!a||typeof a!="object")&&(typeof a.template=="string"&&i.add(a.template),a.footprints&&typeof a.footprints=="object"))for(const l of Object.values(a.footprints))l&&typeof l.what=="string"&&t.add(l.what)}if(s.outlines&&typeof s.outlines=="object")for(const a of Object.values(s.outlines)){if(!a||typeof a!="object")continue;const l=Array.isArray(a)?a:Object.values(a);for(const u of l){const m=u;m&&typeof m.what=="string"&&o.add(m.what)}}return{footprints:t,templates:i,outlines:o}},ta=(e,t)=>!e||e.length===0?[]:e.filter(i=>{const[o,s]=i;return o==="footprint"?t.footprints.has(s):o==="template"?t.templates.has(s):o==="outline"?t.outlines.has(s):!0}),xo=async(e,t,i,o)=>{try{await navigator.clipboard.writeText(e),t(!0),o==null||o(),i.current&&clearTimeout(i.current),i.current=setTimeout(()=>{t(!1)},2500)}catch(s){console.error("Failed to copy shareable URI to clipboard:",s);try{const a=document.createElement("textarea");a.value=e,a.style.position="fixed",a.style.opacity="0",document.body.appendChild(a),a.select();const l=document.execCommand("copy");if(document.body.removeChild(a),!l){console.error("Fallback copy method was rejected by the browser.");return}t(!0),o==null||o(),i.current&&clearTimeout(i.current),i.current=setTimeout(()=>{t(!1)},2500)}catch(a){console.error("Fallback copy method also failed:",a)}}},kr=({config:e,injections:t,onClose:i,"data-testid":o})=>{const s=Xo.useMemo(()=>t||[],[t]),[a,l]=p.useState(1),[u,m]=p.useState(!0),[c,h]=p.useState(!1),[b,g]=p.useState(null),[w,x]=p.useState(""),[f,y]=p.useState([]),[k,I]=p.useState(!1),[L,P]=p.useState(!1),C=p.useRef(null),A=p.useRef(null);p.useEffect(()=>{if(!u||k||s.length===0||a!==1)return;let D=!0;h(!0),g(null);const W=kt();if(!W){g("Could not initialize background worker."),h(!1);return}return W.onmessage=M=>{var K;if(!D)return;const U=M.data;if(U.type==="success"){const J=(K=U.results)==null?void 0:K.canonical,{footprints:ne,templates:Z,outlines:B}=yr(J),O=s.map(([T,Q,G])=>{let j;return T==="footprint"?j=ne.has(Q):T==="template"?j=Z.has(Q):T==="outline"?j=B.has(Q):j=!0,{type:T,name:Q,content:G,checked:j,isEligible:j}}).filter(T=>T.isEligible).map(({type:T,name:Q,content:G,checked:j})=>({type:T,name:Q,content:G,checked:j}));y(O),I(!0)}else U.type==="error"&&g(U.error||"Failed to analyze configuration.");h(!1),W.terminate()},W.onerror=()=>{D&&(g("Worker encountered an error during analysis."),h(!1),W.terminate())},W.postMessage({type:"generate",inputConfig:e,injectionInput:s,requestId:`share-analysis-${Date.now()}`,options:{debug:!0}}),()=>{D=!1,W.terminate()}},[u,k,s,e,a]);const R=p.useRef(0);R.current=u?f.filter(D=>D.checked).length:0;const z=p.useCallback(D=>{F("share_link_copied",{has_injections:R.current>0,injections_count:R.current,source:D})},[]);p.useEffect(()=>{a===2&&w&&xo(w,P,A,()=>{z("auto")})},[w,a,z]),p.useEffect(()=>{const D=W=>{W.key==="Escape"&&i()};return window.addEventListener("keydown",D),()=>{window.removeEventListener("keydown",D)}},[i]),p.useEffect(()=>{a===2&&C.current&&(C.current.focus(),C.current.select())},[a]),p.useEffect(()=>{const D=A;return()=>{D.current&&clearTimeout(D.current)}},[]);const v=D=>{y(W=>W.map((M,U)=>U===D?{...M,checked:!M.checked}:M))},_=()=>{const D=u?f.filter(U=>U.checked):[],W=D.length>0?D.map(U=>[U.type,U.name,U.content]):void 0,M=ea({config:e,injections:W});x(M),l(2)},S=()=>{xo(w,P,A,()=>{z("button")})};return n.jsx(na,{"data-testid":o,onClick:D=>{D.target===D.currentTarget&&i()},children:n.jsxs(oa,{"data-testid":o&&`${o}-box`,onClick:D=>D.stopPropagation(),children:[n.jsx(ra,{onClick:i,"data-testid":o&&`${o}-close`,"aria-label":"Close dialog",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})}),a===1?n.jsxs(n.Fragment,{children:[n.jsx(yo,{children:"Share Configuration"}),n.jsx(ko,{children:"Configure what content should be included when sharing your keyboard design."}),n.jsx(ia,{children:n.jsxs(sa,{htmlFor:"include-libraries-toggle",children:[n.jsx(aa,{id:"include-libraries-toggle",type:"checkbox",checked:u,onChange:D=>{const W=D.target.checked;m(W),W||(h(!1),g(null))},"aria-label":"Include custom libraries"}),n.jsx(la,{$checked:u}),n.jsx("span",{children:"Include custom libraries"})]})}),u&&n.jsxs(n.Fragment,{children:[c&&n.jsxs(ca,{children:[n.jsx(da,{}),n.jsx("span",{children:"Analyzing configuration..."})]}),b&&n.jsx(ua,{children:b}),!c&&!b&&s.length===0&&n.jsx(vo,{children:"No custom libraries loaded."}),!c&&!b&&s.length>0&&f.length===0&&n.jsx(vo,{children:"No custom footprints or libraries are used in this configuration."}),!c&&!b&&f.length>0&&n.jsx(pa,{children:f.map((D,W)=>n.jsxs(fa,{children:[n.jsx(ha,{id:`injection-${D.name}`,type:"checkbox",checked:D.checked,onChange:()=>v(W),"aria-label":D.name}),n.jsx(ma,{$type:D.type,children:D.type}),n.jsx(ga,{htmlFor:`injection-${D.name}`,children:D.name})]},`${D.type}-${D.name}`))})]}),n.jsx(_o,{children:n.jsx(ba,{onClick:_,disabled:c,children:"Share"})})]}):n.jsxs(n.Fragment,{children:[n.jsx(yo,{children:"Shareable Configuration Link"}),n.jsx(ko,{children:"Share this link with others to let them view and use your keyboard configuration, including all of your custom footprints."}),n.jsxs(wa,{children:[n.jsx(xa,{ref:C,type:"text",value:w,readOnly:!0,"data-testid":o&&`${o}-input`,"aria-label":"Share link"}),n.jsx(_o,{children:n.jsxs(ya,{onClick:S,"data-testid":o&&`${o}-copy`,"aria-label":L?"Link copied":"Copy link",children:[n.jsx("span",{className:"material-symbols-outlined",children:L?"check":"content_copy"}),L?"Link copied":"Copy link"]})})]})]})]})})},na=d.div`
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
`,oa=d.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: relative;
`,ra=d.button`
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
`,yo=d.h2`
  margin: 0 0 1rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
  padding-right: 3rem;
`,ko=d.p`
  margin: 0 0 1.5rem 0;
  font-size: ${r.fontSizes.base};
  color: ${r.colors.textDark};
  line-height: 1.5;
`,ia=d.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`,sa=d.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  font-family: ${r.fonts.body};
  font-size: ${r.fontSizes.base};
  color: ${r.colors.text};
`,aa=d.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`,la=d.span`
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
`,ca=d.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.5rem 0;
  color: ${r.colors.textDark};
`,da=d.div`
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
`,ua=d.p`
  color: ${r.colors.error};
  font-size: ${r.fontSizes.sm};
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: ${r.colors.errorDark}22;
  border: 1px solid ${r.colors.error};
  border-radius: 6px;
`,vo=d.p`
  color: ${r.colors.textDarker};
  font-size: ${r.fontSizes.sm};
  margin: 1rem 0;
  font-style: italic;
`,pa=d.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${r.colors.border};
  border-radius: 6px;
  background-color: ${r.colors.backgroundLighter};
  margin: 1rem 0 1.5rem 0;
  padding: 0.5rem;
`,fa=d.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${r.colors.backgroundLight};
  }
`,ha=d.input`
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: ${r.colors.accent};
`,ga=d.label`
  cursor: pointer;
  flex: 1;
  color: ${r.colors.text};
  font-size: ${r.fontSizes.sm};
  user-select: none;
`,ma=d.span`
  font-size: ${r.fontSizes.xs};
  font-weight: ${r.fontWeights.bold};
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  color: ${r.colors.white};
  background-color: ${e=>{switch(e.$type){case"footprint":return"#007bff";case"outline":return"#e83e8c";case"template":return"#fd7e14";default:return r.colors.border}}};
`,ba=d.button`
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
`,wa=d.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: stretch;
`,_o=d.div`
  display: flex;
  justify-content: center;
  width: 100%;

  @media (min-width: 500px) {
    width: auto;
  }
`,xa=d.input`
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
`,ya=d.button`
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
`,ka=d.span`
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
`;function va(){return n.jsx(n.Fragment,{children:n.jsxs("span",{children:[wr()?"⌘":"Ctrl"," ⏎"]})})}const _a=d.div`
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
`,ja=d.div`
  flex-grow: 1;
`,jo=d(Ne)`
  display: none;

  @media (max-width: 475px) {
    display: flex;
  }
`,$a=d.button`
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
`,$o=d.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
`,Ca=d.div`
  display: flex;
  gap: 10px;
  align-items: stretch;
  padding: 10px;

  @media (max-width: 639px) {
    display: none;
  }
`,Sa=d.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
  padding: 0;
`,Co=d(Ls)`
  height: 100%;
`,Ea=d.div`
  height: 100%;
  overflow-y: auto;
`,Pa=d(rs)`
  position: relative;
  flex-grow: 1;
  min-height: 0;
`,Ia=d.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`,La=d.div`
  height: 100%;
  overflow-y: auto;
  padding: 0.5rem;

  @media (min-width: 640px) {
    padding: 1rem;
  }
`,za=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 640px) {
    display: none;
  }
`,Da=d.button`
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
`,So=d.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: row;

  @media (max-width: 639px) {
    width: ${e=>e.$fullWidth?"100%":"auto"};
  }
`,Eo=d.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
`,Ra=d.div`
  display: flex;
  height: 100%;
  width: 100%;
`,Aa=({pwaState:e})=>{const t=()=>Math.max(200,window.innerWidth*.33),i=()=>Math.max(150,window.innerWidth*.15),o=()=>Math.max(350,window.innerWidth*.15),[s,a]=p.useState({key:"demo.svg",extension:"svg",content:""}),[l,u]=p.useState(!1),m=_=>{a(_),f!=null&&f.showConfig||f==null||f.setShowDownloads(!1)},[c,h]=p.useState({key:-1,type:"",name:"",content:""}),[b,g]=p.useState(!1),[w,x]=p.useState(window.innerWidth<=639),f=_e(),y=!0;p.useEffect(()=>{const _=()=>{x(window.innerWidth<=639)};return window.addEventListener("resize",_),()=>window.removeEventListener("resize",_)},[]),Nr(wr()?"meta+enter":"ctrl+enter",_=>{var S,D;(D=(S=_==null?void 0:_.target)==null?void 0:S.closest)!=null&&D.call(S,".monaco-editor")||f&&(F("shortcut_used",{action:"generate"}),f.generateNow(nn(f),f.injectionInput,{pointsonly:!1,isManual:!0}))},{enableOnFormTags:!0,preventDefault:!0,ignoreEventWhen:_=>{var S,D;return!!((D=(S=_.target)==null?void 0:S.closest)!=null&&D.call(S,".monaco-editor"))}}),p.useEffect(()=>{if(c.key===-1||c.name===""||c.content==="")return;const _=[c.type,c.name,c.content];let S=[];Array.isArray(f==null?void 0:f.injectionInput)&&(S=[...f.injectionInput]);const D=S.length;if(D===0||D===c.key)S.push(_),h({...c,key:D});else{const W=S[c.key];if(W[0]===c.type&&W[1]===c.name&&W[2]===c.content)return;S=S.map((M,U)=>U===c.key?_:M)}f==null||f.setInjectionInput(S)},[f,c]);const k=nn(f),I=Rs(f==null?void 0:f.results,s.key,s.extension,k),L=p.useRef(null),P=!!(f!=null&&f.results);if(p.useEffect(()=>{if(!P){L.current=null;return}if(!I.key||!I.extension)return;const _=`${I.key}|${I.extension}`;L.current!==_&&(L.current=_,F("preview_loaded",{preview_type:I.extension,preview_key:I.key}))},[I.key,I.extension,P]),!f)return null;const C=_=>{const S={...c,name:_.target.value};h(S)},A=_=>{if(!Array.isArray(f==null?void 0:f.injectionInput))return;F("injection_deleted",{injection_type:_.type});const S=[...f.injectionInput].filter((D,W)=>W!==_.key);if(f.setInjectionInput(S),c.key===_.key)h({key:-1,type:"",name:"",content:""});else if(c.key>=_.key){const D={...c,key:c.key-1};h(D)}},R=()=>{var W;const _=((W=f.getRealtimeConfigInput)==null?void 0:W.call(f))??f.configInput;if(_===void 0)return;F("download_button_clicked",{download_type:"yaml",source:"editor"});const S=document.createElement("a"),D=new Blob([_],{type:"text/yaml"});S.href=URL.createObjectURL(D),S.download="config.yaml",document.body.appendChild(S),S.click(),URL.revokeObjectURL(S.href),document.body.removeChild(S)},z=()=>{var _,S;k&&(F("share_button_clicked",{has_injections:!!((_=f.injectionInput)!=null&&_.length),injections_count:((S=f.injectionInput)==null?void 0:S.length)||0,source:"subheader"}),u(!0))},v=()=>{var _,S,D;!f.results||!k||f.isGenerating||f.isJscadConverting||(F("archive_single_downloaded",{has_injections:!!((_=f.injectionInput)!=null&&_.length),injections_count:((S=f.injectionInput)==null?void 0:S.length)||0,stored_configs_count:((D=f.configs)==null?void 0:D.length)||0,source:"subheader"}),fr(f.results,k,f.injectionInput,f.debug,f.stlPreview))};return n.jsxs(n.Fragment,{children:[l&&n.jsx(kr,{config:k,injections:f.injectionInput||[],onClose:()=>u(!1)}),n.jsxs(Sa,{children:[!f.showSettings&&n.jsxs(_a,{children:[n.jsx(Ne,{className:f.showConfig?"active":"",onClick:()=>f.setShowConfig(!0),"aria-label":"Show configuration panel","data-testid":"mobile-config-button",children:"Config"}),n.jsx(Ne,{className:f.showConfig?"":"active",onClick:()=>f.setShowConfig(!1),"aria-label":"Show outputs panel","data-testid":"mobile-outputs-button",children:"Outputs"}),n.jsx(ja,{}),f.showConfig&&n.jsxs(n.Fragment,{children:[n.jsx($a,{onClick:()=>f.generateNow(k,f.injectionInput,{pointsonly:!1,isManual:!0}),"aria-label":"Generate configuration","data-testid":"mobile-generate-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"refresh"})}),n.jsx(jo,{onClick:z,disabled:!k,"aria-label":"Share configuration","data-testid":"mobile-share-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"share"})}),n.jsx(Ne,{onClick:R,"aria-label":"Download configuration","data-testid":"mobile-download-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})]}),!f.showConfig&&n.jsxs(n.Fragment,{children:[n.jsx(jo,{onClick:v,disabled:f.isGenerating||f.isJscadConverting,"aria-label":"Download archive of all generated files","data-testid":"mobile-download-outputs-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),n.jsx(Ne,{onClick:()=>f.setShowDownloads(!f.showDownloads),"aria-label":f.showDownloads?"Hide downloads panel":"Show downloads panel","data-testid":"mobile-downloads-toggle-button",children:n.jsx("span",{className:"material-symbols-outlined",children:f.showDownloads?"expand_content":"collapse_content"})})]})]}),n.jsx(Ra,{children:f.showSettings?n.jsxs(n.Fragment,{children:[n.jsx(Bt,{initialWidth:o(),minWidth:150,maxWidth:"70%",side:"left","data-testid":"settings-panel",style:{display:b&&w?"none":void 0},children:n.jsxs(La,{children:[n.jsxs(Ia,{children:[n.jsx(at,{children:"General"}),n.jsxs(lt,{children:[n.jsx(Re,{optionId:"autogen",label:"Auto-generate",description:"Automatically generate new outputs and update previews on changes.",setSelected:f.setAutoGen,checked:f.autoGen,"aria-label":"Enable auto-generate"}),n.jsx(Re,{optionId:"autogen3d",label:"Auto-generate PCB & 3D",description:"Build 3D models and PCB files during generation (can be slow).",setSelected:f.setAutoGen3D,checked:f.autoGen3D,"aria-label":"Enable auto-generate PCB and 3D (slow)"}),n.jsx(Re,{optionId:"debug",label:"Debug",description:"Include debug files in the outputs.",setSelected:f.setDebug,checked:f.debug,"aria-label":"Enable debug mode"})]}),n.jsx(at,{children:"Previews (Experimental)"}),n.jsxs(lt,{children:[n.jsx(Re,{optionId:"kicanvasPreview",label:"KiCad Preview",description:"Render interactive PCB layouts using KiCanvas.",setSelected:f.setKicanvasPreview,checked:f.kicanvasPreview,"aria-label":"Enable KiCad preview (experimental)"}),n.jsx(Re,{optionId:"stlPreview",label:"STL Preview",description:"Render 3D preview of generated cases.",setSelected:f.setStlPreview,checked:f.stlPreview,"aria-label":"Enable STL preview (experimental)"})]}),n.jsx(at,{children:"Privacy"}),n.jsx(lt,{children:n.jsx(Re,{optionId:"sendUsageMetrics",label:"Send Usage Metrics",description:y?"Help improve Ergogen Web UI by sharing anonymous usage statistics.":"Unavailable: this copy of Ergogen Web UI was built without an analytics tag ID, so no usage statistics are sent.",setSelected:f.setSendUsageMetrics,checked:y&&f.sendUsageMetrics,disabled:!y,"aria-label":"Send usage metrics"})}),e&&n.jsxs(n.Fragment,{children:[n.jsx(at,{children:"Offline"}),n.jsx(lt,{children:n.jsx(Xs,{isAvailable:e.isAvailable,isInstalled:e.isInstalled,isInstalling:e.isInstalling,onInstall:e.onInstall})})]})]}),n.jsx(js,{setInjectionToEdit:h,deleteInjection:A,injectionToEdit:c,onInjectionSelect:()=>g(!0),"data-testid":"injections-container"})]})}),n.jsx(So,{$fullWidth:b&&w,children:n.jsxs($o,{children:[w&&n.jsxs(za,{children:[n.jsxs(gt,{as:"h4",style:{marginTop:0},children:[c.type?c.type.charAt(0).toUpperCase()+c.type.slice(1):"Footprint"," ","name"]}),n.jsx(Da,{onClick:()=>{g(!1),h({key:-1,type:"",name:"",content:""})},"aria-label":"Close editor","data-testid":"mobile-editor-close",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),!w&&n.jsxs(gt,{as:"h4",children:[c.type?c.type.charAt(0).toUpperCase()+c.type.slice(1):"Footprint"," ","name"]}),n.jsx(As,{value:c.name,onChange:C,disabled:c.key===-1,"aria-label":`${c.type?c.type.charAt(0).toUpperCase()+c.type.slice(1):"Footprint"} name`,"data-testid":"footprint-name-input"}),n.jsxs(gt,{as:"h4",children:[c.type?c.type.charAt(0).toUpperCase()+c.type.slice(1):"Footprint"," ","code"]}),n.jsx(is,{injection:c,setInjection:h,options:{readOnly:c.key===-1}})]})})]}):n.jsxs(n.Fragment,{children:[f.showConfig&&n.jsx(Bt,{initialWidth:t(),minWidth:250,maxWidth:"60%",side:"left","data-testid":"config-panel",children:n.jsxs($o,{children:[n.jsx(Pa,{"data-testid":"config-editor"}),n.jsxs(Ca,{children:[n.jsx(Ke,{onClick:()=>f.generateNow(k,f.injectionInput,{pointsonly:!1,isManual:!0}),"aria-label":"Generate configuration","data-testid":"generate-button",children:n.jsxs("span",{style:{display:"flex",alignItems:"center",width:"100%",justifyContent:"center"},children:[n.jsx("span",{children:"Generate"}),n.jsx(ka,{children:va()})]})}),n.jsx(Ne,{onClick:R,"aria-label":"Download configuration","data-testid":"download-config-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})]})]})}),n.jsx(So,{$fullWidth:!f.showConfig,children:f.showDownloads?n.jsxs(n.Fragment,{children:[n.jsx(Eo,{children:n.jsx(Co,{"data-testid":`${I.key}-file-preview`,previewExtension:I.extension,previewKey:`${I.key}-${f.resultsVersion}`,previewContent:I.content})}),n.jsx(Bt,{initialWidth:i(),minWidth:105,maxWidth:"30%",side:"right","data-testid":"downloads-panel",children:n.jsx(Ea,{children:n.jsx(bs,{setPreview:m,previewKey:I.key,"data-testid":"downloads-container"})})})]}):n.jsx(Eo,{children:n.jsx(Co,{"data-testid":`${I.key}-file-preview`,previewExtension:I.extension,previewKey:`${I.key}-${f.resultsVersion}`,previewContent:I.content})})})]})})]})]})},Na={label:"Absolem",author:"MrZealot",value:`meta:
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
    distance: 223.7529778`},Ua={label:"Atreus",author:"MrZealot",value:`points:
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
`},Wa={label:"A. Dux",author:"tapioki",value:`meta:
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
`},Oa={label:"Corney Island",author:"ceoloide",value:`points:
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
          rotate: 90`},sn={label:"Empty YAML configuration",author:"ceoloide",value:`meta:
  engine: 4.1.0
units:
points:
  zones:
    matrix:
outlines:
pcbs:
cases:
`},Fa={label:"Wubbo",author:"cache.works",value:`meta:
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
`},Ma={label:"Sweep-like",author:"jcmkk3",value:`meta:
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
`},Ba={label:"Reviung41",author:"jcmkk3",value:`meta:
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
`},Ta={label:"Tiny20",author:"enzocoralc",value:`meta:
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
`},Ga={label:"Alpha",author:"jcmkk3",value:`points:
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
`},Va={label:"Plank",author:"cache.works",value:`meta:
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
`},Ha={label:"Curly-45",author:"peterjc",value:`meta:
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
`},Ka={label:"Willy 50",author:"ceoloide",value:`# Inspired by the Keychron Orca Echo
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
`},Ja=[sn],Xa=[Na,Ua],Ya=[Wa,Oa,Ma,Ba,Ta],Za=[Fa,Ga,Va,Ha,qa,Ka],Qa=[{label:"Empty configurations",options:Ja},{label:"Simple (points only)",options:Xa},{label:"Complete (with pcb)",options:Ya},{label:"Miscellaneous",options:Za}],el=e=>{var o;const t=fe.load(e.value),i=((o=t==null?void 0:t.meta)==null?void 0:o.engine)??(t==null?void 0:t["meta.engine"]);return i===null?void 0:i},tl=(e,t=Ze())=>{const i=el(e);return i===void 0?!0:typeof i=="string"&&ki(t,i)},nl=(e=Ze())=>Qa.map(t=>({...t,options:t.options.filter(i=>tl(i,e))})).filter(t=>t.options.length>0),ol=async e=>new Promise((t,i)=>{const o=new FileReader;o.onload=s=>{var a;(a=s.target)!=null&&a.result&&typeof s.target.result=="string"?t(s.target.result):i(new Error("Failed to read file as text"))},o.onerror=()=>i(new Error("Failed to read file")),o.readAsText(e)}),rl=async e=>{const i=e.name.toLowerCase().split(".").pop(),o=i==="zip"||i==="ekb";if(Qt(e.size,o),i==="yaml"||i==="yml"||i==="json")return{config:await ol(e),footprints:[],outlines:[],templates:[]};if(o){const s=await e.arrayBuffer(),a=await Si(s),l=a.injections.filter(c=>c.type==="footprint").map(c=>({name:c.name,content:c.content})),u=a.injections.filter(c=>c.type==="outline").map(c=>({name:c.name,content:c.content})),m=a.injections.filter(c=>c.type==="template").map(c=>({name:c.name,content:c.content}));return{config:a.config,footprints:l,outlines:u,templates:m}}else throw new Error("Unsupported file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")},an=()=>n.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-github",viewBox:"0 0 98 96",children:n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z",fill:"currentColor"})}),Po=()=>n.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 4.2333332 4.2333335",version:"1.1",fill:"currentColor",children:[n.jsxs("defs",{children:[n.jsxs("linearGradient",{id:"linearGradient6924-6",children:[n.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:0},offset:"0"}),n.jsx("stop",{offset:"0.49517274",style:{stopColor:"#ffffff",stopOpacity:.3}}),n.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:.3},offset:"1"})]}),n.jsx("linearGradient",{id:"linearGradient6918-3",x1:"42519.285",y1:"-7078.7891",x2:"42575.336",y2:"-6966.9307",gradientUnits:"userSpaceOnUse",href:"#linearGradient6924-6"})]}),n.jsxs("g",{transform:"matrix(0.06551432,0,0,0.06551432,-2.232417,-1.431776)",children:[n.jsx("path",{id:"path6733-5",style:{fontVariationSettings:"normal",opacity:1,vectorEffect:"none",fill:"url(#linearGradient6918-3)",fillOpacity:1,stroke:"none",strokeWidth:3.67846,strokeLinecap:"butt",strokeLinejoin:"miter",strokeMiterlimit:2,strokeDashoffset:0,strokeOpacity:1,paintOrder:"stroke markers fill",stopColor:"#000000",stopOpacity:1},d:"m 42519.285,-7078.7891 a 0.76086879,0.56791688 0 0 0 -0.738,0.6739 l 33.586,125.8886 a 87.182358,87.182358 0 0 0 39.381,-33.7636 l -71.565,-92.5196 a 0.76086879,0.56791688 0 0 0 -0.664,-0.2793 z",transform:"matrix(0.37058478,0,0,0.37058478,-15690.065,2662.0533)"}),n.jsx("path",{id:"path360787",style:{opacity:1,fill:"#ffffff",fillOpacity:1,strokeWidth:17.0055,paintOrder:"markers fill stroke",stopColor:"#000000"},d:"m 11249.461,-1883.6961 c -12.74,0 -23.067,10.3275 -23.067,23.0671 0,4.3335 1.22,8.5795 3.522,12.2514 l 19.232,-24.8636 c 0.138,-0.1796 0.486,-0.1796 0.624,0 l 19.233,24.8646 c 2.302,-3.6721 3.523,-7.9185 3.523,-12.2524 0,-12.7396 -10.327,-23.0671 -23.067,-23.0671 z",transform:"matrix(1.4006354,0,0,1.4006354,-15690.065,2662.0533)"})]})]}),Io=()=>n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 212 212",fill:"none",stroke:"currentColor",children:n.jsxs("g",{transform:"translate(6,6)",children:[n.jsx("path",{d:"M58 168 v-98 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),n.jsx("path",{d:"M58 168 v-30 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),n.jsx("circle",{cx:"142",cy:"20",r:"18",strokeWidth:"15"}),n.jsx("circle",{cx:"142",cy:"88",r:"18",strokeWidth:"15"}),n.jsx("circle",{cx:"58",cy:"180",r:"18",strokeWidth:"15"})]})}),ln=d.div`
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
`,il=d.div`
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
`,sl=d.div`
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
`,al=d.div`
  background-color: ${r.colors.backgroundLight};
  border: 3px dashed ${r.colors.accent};
  border-radius: 8px;
  padding: 2rem;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
  text-align: center;
`,ll=d.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 640px) {
    padding: 1rem 0.5rem;
  }
`,cl=d.h1`
  font-size: ${r.fontSizes.h1};
  text-align: center;
  margin-bottom: 1rem;
`,dl=d.p`
  font-size: ${r.fontSizes.lg};
  text-align: center;
  margin-bottom: 3rem;
  color: ${r.colors.textDark};
`,ul=d.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`,Tt=d.div`
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
`,pl=d.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;

  button {
    flex-shrink: 0;
  }
`,fl=d.div`
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
`,hl=d.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  user-select: none;
`,gl=d.button`
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
`,ml=d.div`
  width: 1px;
  background-color: ${r.colors.border};
  margin: 0.75rem 0;
  flex-shrink: 0;
`,bl=d.input`
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
`,wl=d.div`
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
`,Gt=d.div`
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
`,xl=d(he)`
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

  ${ln} {
    margin-right: 0;
  }
`,yl=d.input`
  display: none;
`,Lo=d.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`,zo=d.div`
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
`,kl=d.img`
  width: 100%;
  height: 150px;
  object-fit: contain;
  padding: 8px;
  box-sizing: border-box;
  background-color: ${r.colors.backgroundLighter};
`,Do=d.div`
  padding: 1rem;
  font-weight: ${r.fontWeights.semiBold};
  text-align: center;
`,vl=d.div`
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
`,_l=d.div`
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
`,jl=()=>{const e=Ze(),t=p.useMemo(()=>nl(e).flatMap(j=>j.options).filter(j=>j.label!=="Empty YAML configuration"),[e]),i=cn(),o=_e(),[s,a]=p.useState(""),[l,u]=p.useState("github"),[m,c]=p.useState(!1),[h,b]=p.useState(!1),g=m||h,[w,x]=p.useState(!1),f=p.useRef(null),[y,k]=p.useState(!1);p.useEffect(()=>{const j=V=>{f.current&&!f.current.contains(V.target)&&k(!1)};return document.addEventListener("mousedown",j),()=>document.removeEventListener("mousedown",j)},[]);const[I,L]=p.useState(!1),P=j=>{a(j),j.includes("github.com/")?u("github"):j.includes("codeberg.org/")?u("codeberg"):(j.startsWith("http://")||j.startsWith("https://")||j.includes("/")&&!j.includes("github.com/")&&!j.includes("codeberg.org/")&&j.split("/")[0].includes("."))&&u("forgejo")},{currentConflict:C,processInjectionsWithConflictResolution:A,handleConflictResolution:R,handleConflictCancel:z}=Ct({setInjectionInput:j=>o==null?void 0:o.setInjectionInput(j),setConfigInput:j=>o==null?void 0:o.setConfigInput(j),generateNow:async(j,V,H)=>{o&&await o.generateNow(j,V,H)},getCurrentInjections:()=>(o==null?void 0:o.injectionInput)||[],onComplete:async()=>{x(!0)},setError:j=>o==null?void 0:o.setError(j)});p.useEffect(()=>{const j=new URLSearchParams(window.location.search),V=j.has("github")||j.has("codeberg")||j.has("forgejo")||j.has("gitea");(w||V)&&(o!=null&&o.configInput)&&(i("/"),x(!1))},[w,o==null?void 0:o.configInput,i]),p.useEffect(()=>{var j;(j=o==null?void 0:o.pruneDeletedConfigs)==null||j.call(o)},[o]);const v=async j=>{if(o){const V=j===sn.value;let H="unknown";if(V)H="empty_configuration";else{const ee=t.find(q=>q.value===j);ee&&(H=ee.label.toLowerCase().replace(/\s+/g,"_"))}F("example_loaded",{example_name:H,is_empty:V}),o.createNewConfig(j),await o.generateNow(j,o.injectionInput,{pointsonly:!1}),x(!0)}},_=async j=>{if(o){const V=o.configs.find(H=>H.id===j);V&&(o.selectConfig(j),F("saved_config_loaded",{stored_configs_count:o.configs.length}),await o.generateNow(V.config,o.injectionInput,{pointsonly:!1}),x(!0))}},D=[...(o==null?void 0:o.configs)||[]].sort((j,V)=>new Date(V.updatedAt).getTime()-new Date(j.updatedAt).getTime()).slice(0,4),W=async(j,V,H,ee,q=null,se)=>{if(!o)throw new Error("Configuration context not available");const ie=ur(j,V,H);await A(ie,ee,q,se)},M=async(j,V)=>{await R(j,V)},U=()=>{z(),c(!1),b(!1),o==null||o.setIsGenerating(!1)},K=()=>{if(!s||!o)return;const{setError:j,clearError:V,setIsGenerating:H}=o;b(!0),H(!0),V(),F("repo_loaded",{provider:l});let ee=s.trim();if(!ee.includes("://")&&!ee.includes("github.com")&&!ee.includes("codeberg.org"))if(l==="codeberg")ee=`https://codeberg.org/${ee}`;else if(l==="forgejo"){const q=ee.split("/");if(q.length>=2&&q[0].includes("."))ee=`https://${ee}`;else{j("Forgejo/Gitea requires a URL including the host (e.g., host/owner/repo)"),b(!1),H(!1);return}}else ee=`https://github.com/${ee}`;pr(ee).then(async q=>{if(o){q.rateLimitWarning&&j(q.rateLimitWarning);try{o.createNewConfig(q.config),await W(q.footprints,q.outlines,q.templates||[],q.config)}catch(se){throw new Error(`Failed to process footprints: ${se instanceof Error?se.message:"Unknown error"}`)}}}).catch(q=>{j(`Failed to load from ${l==="github"?"GitHub":l==="codeberg"?"Codeberg":"Forgejo/Gitea"} repository: ${q.message}`),o==null||o.setInfo(null),b(!1),H(!1)}).finally(()=>{b(!1)})},J=p.useRef(null),ne=()=>{var j;(j=J.current)==null||j.click()},Z=async j=>{if(!o)return;const{setError:V,clearError:H,setIsGenerating:ee}=o;c(!0),ee(!0),H(),F("local_file_loaded",{file_type:Xr(j.name),file_size:j.size});try{const q=await rl(j);o.createNewConfig(q.config),await W(q.footprints,q.outlines,q.templates||[],q.config)}catch(q){V(`Failed to load local file: ${q instanceof Error?q.message:"Unknown error"}`),o.setInfo(null),c(!1),ee(!1)}finally{c(!1)}},B=async j=>{var H;const V=(H=j.target.files)==null?void 0:H[0];V&&(j.target.value="",await Z(V))},O=j=>{j.preventDefault(),j.stopPropagation(),!g&&L(!0)},T=j=>{j.preventDefault(),j.stopPropagation()},Q=j=>{if(j.preventDefault(),j.stopPropagation(),g)return;const V=j.currentTarget,H=j.relatedTarget;(!H||!V.contains(H))&&L(!1)},G=async j=>{if(j.preventDefault(),j.stopPropagation(),g)return;L(!1);const V=Array.from(j.dataTransfer.files),H=[".yaml",".yml",".json",".zip",".ekb"],ee=V.find(q=>{const se=q.name.toLowerCase();return H.some(ie=>se.endsWith(ie))});ee?await Z(ee):V.length>0&&o&&o.setError("Invalid file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")};return n.jsxs(il,{$isDragging:I,onDragEnter:O,onDragOver:T,onDragLeave:Q,onDrop:G,"data-testid":"welcome-page-wrapper",children:[n.jsx(sl,{$isVisible:I,children:n.jsx(al,{children:"Drop file here to load configuration"})}),C&&n.jsx($t,{injectionName:C.name,injectionType:C.type,onResolve:M,onCancel:U,"data-testid":"conflict-dialog"}),n.jsxs(ll,{children:[n.jsx(cl,{children:"Ergogen Web UI"}),n.jsxs(dl,{children:["A web-based interface for Ergogen, the ergonomic keyboard generator.",n.jsx("br",{}),"Start a new design below."]}),n.jsxs(ul,{children:[n.jsxs(Tt,{children:[n.jsx("h2",{children:"Start Fresh"}),n.jsx("p",{children:"Begin with a completely blank slate."}),n.jsx(he,{onClick:()=>v(sn.value),"aria-label":"Start with empty configuration","data-testid":"empty-config-button",children:"Empty Configuration"})]}),n.jsxs(Tt,{children:[n.jsx("h2",{children:"From Local File"}),n.jsx("p",{children:"Load a configuration from your computer. Supports *.yaml, *.json, *.zip, and *.ekb files."}),n.jsx(yl,{ref:J,type:"file",accept:".yaml,.yml,.json,.zip,.ekb",onChange:B,disabled:g,"aria-label":"Select local file to load","data-testid":"local-file-input"}),n.jsx(he,{onClick:ne,disabled:g,"aria-label":"Select local file to load","data-testid":"local-file-button",children:m?n.jsxs(n.Fragment,{children:[n.jsx(ln,{})," Loading..."]}):"Choose File"})]}),n.jsxs(Tt,{children:[n.jsx("h2",{children:"From Repo"}),n.jsx("p",{children:'Link to a YAML config file on a Git provider (e.g. GitHub, Codeberg, Forgejo), or simply a repository name like "user/repo".'}),n.jsx(pl,{children:n.jsxs(fl,{children:[n.jsxs(hl,{ref:f,children:[n.jsxs(gl,{type:"button",onClick:()=>k(!y),disabled:g,"aria-label":"Repository provider source","data-testid":"repo-provider-trigger",children:[l==="github"?n.jsx(an,{}):l==="codeberg"?n.jsx(Po,{}):n.jsx(Io,{}),n.jsx("span",{className:"material-symbols-outlined",children:"arrow_drop_down"})]}),y&&n.jsxs(wl,{children:[n.jsxs(Gt,{$active:l==="github",onClick:()=>{u("github"),k(!1)},children:[n.jsx(an,{}),"GitHub"]}),n.jsxs(Gt,{$active:l==="codeberg",onClick:()=>{u("codeberg"),k(!1)},children:[n.jsx(Po,{}),"Codeberg"]}),n.jsxs(Gt,{$active:l==="forgejo",onClick:()=>{u("forgejo"),k(!1)},children:[n.jsx(Io,{}),"Forgejo"]})]})]}),n.jsx(ml,{}),n.jsx(bl,{placeholder:l==="forgejo"?"host/user/repo":"user/repo",value:s,onChange:j=>P(j.target.value),onKeyDown:j=>{j.key==="Enter"&&!g&&s.trim()!==""&&(j.preventDefault(),K())},disabled:g,"aria-label":"Repository URL or path","data-testid":"repo-input"}),n.jsx(xl,{onClick:K,disabled:g||!s,"aria-label":"Load configuration from repository","data-testid":"repo-load-button",children:h?n.jsx(ln,{}):n.jsx("span",{className:"material-symbols-outlined",style:{display:"block"},children:"cloud_download"})})]})})]})]}),D.length>0&&n.jsxs(n.Fragment,{children:[n.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:r.fontSizes.h2},children:"Pick up where you left"}),n.jsx(Lo,{style:{marginBottom:"3rem"},children:D.map(j=>n.jsxs(zo,{onClick:()=>_(j.id),"aria-label":`Load ${j.name} configuration`,"data-testid":`saved-config-${j.name.toLowerCase().replace(/\s+/g,"-")}`,children:[j.previewSvg?n.jsx(vl,{dangerouslySetInnerHTML:{__html:j.previewSvg}}):n.jsx(_l,{children:n.jsx("span",{className:"material-symbols-outlined",children:"keyboard_off"})}),n.jsx(Do,{children:j.name})]},j.id))})]}),n.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:r.fontSizes.h2},children:"Or start from an example"}),n.jsx(Lo,{children:t.map(j=>n.jsxs(zo,{onClick:()=>v(j.value),"aria-label":`Load ${j.label} example`,"data-testid":`example-${j.label.toLowerCase().replace(/\s+/g,"-")}`,children:[n.jsx(kl,{src:`/images/previews/${j.label.toLowerCase().replace(/[\s()]/g,"_")}.svg`,alt:`${j.label} preview`}),n.jsx(Do,{children:j.label})]},j.label))})]})]})},vr=({versionInfo:e,"data-testid":t})=>{const[i,o]=p.useState(!1),s=p.useRef(null),a=()=>{s.current&&clearTimeout(s.current),o(!0)},l=()=>{s.current=setTimeout(()=>{o(!1)},250)},u=()=>{s.current&&clearTimeout(s.current)},m=()=>{s.current=setTimeout(()=>{o(!1)},250)},c=h=>{h.stopPropagation(),o(b=>!b)};return p.useEffect(()=>{if(!i)return;const h=()=>{o(!1)};return window.addEventListener("click",h),()=>{window.removeEventListener("click",h)}},[i]),p.useEffect(()=>()=>{s.current&&clearTimeout(s.current)},[]),n.jsxs($l,{onMouseEnter:a,onMouseLeave:l,"data-testid":t,children:[n.jsx(Cl,{onClick:c,"data-testid":t&&`${t}-badge`,"aria-label":"Custom Ergogen version indicator",children:n.jsx("span",{className:"material-symbols-outlined",children:"science"})}),i&&n.jsxs(Sl,{onMouseEnter:u,onMouseLeave:m,onClick:h=>h.stopPropagation(),"data-testid":t&&`${t}-popover`,children:[n.jsx(El,{children:"Custom Ergogen Version"}),n.jsx(Pl,{children:"This website is running a custom version of Ergogen for development and preview purposes."}),n.jsxs(Il,{href:e.url,target:"_blank",rel:"noopener noreferrer","data-testid":t&&`${t}-link`,children:[n.jsx("span",{children:e.label}),n.jsx("span",{className:"material-symbols-outlined open-icon",children:"open_in_new"})]})]})]})},$l=d.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  transform: translateY(-5px);
`,Cl=d.span`
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
`,Sl=d.div`
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
`,El=d.div`
  font-size: 12px;
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
`,Pl=d.div`
  font-size: 11px;
  color: ${r.colors.textDark};
  line-height: 1.4;
`,Il=d.a`
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
`,Ll=yt`
  0%   { box-shadow: 0 0 0 0   ${r.colors.accent}99; }
  70%  { box-shadow: 0 0 0 6px ${r.colors.accent}00; }
  100% { box-shadow: 0 0 0 0   ${r.colors.accent}00; }
`,zl=yt`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`,Dl=d.button`
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
  animation: ${Ll} ${e=>e.$isUpdating?"0.6s":"2s"}
    ease-out infinite;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  .material-symbols-outlined {
    font-size: 14px !important;
    ${e=>e.$isUpdating&&Ko`
        animation: ${zl} 1s linear infinite;
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
`,Rl=({onClick:e,"data-testid":t})=>{const[i,o]=p.useState(!1),s=()=>{o(!0),e()};return n.jsxs(Dl,{onClick:s,disabled:i,$isUpdating:i,"aria-label":i?"Updating version...":"Update available — click to reload and apply","data-testid":t??"update-chip",children:[n.jsx("span",{className:"material-symbols-outlined","aria-hidden":"true",children:i?"sync":"update"}),i?"Updating version...":"Update Available"]})},Al=d.header`
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
`,Nl=d.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: row;
  flex-grow: 1;
  min-width: 0;
  width: 100%;
`,Ul=d.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,Wl=d.div`
  display: flex;
  align-items: center;
  gap: 6px;
`,Ol=d.div`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  display: flex;
  align-items: center;
  @media (max-width: 639px) {
    display: none;
  }
`,St=d.button`
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
`,Fl=d(St)`
  flex-shrink: 0;
`,Ml=d(St)`
  background-color: ${r.colors.accent};
  border-color: ${r.colors.accent};

  &:hover {
    background-color: ${r.colors.accentDark};
    border-color: ${r.colors.accentDarker};
  }

  @media (max-width: 375px) {
    display: none;
  }
`,Bl=d.span`
  @media (max-width: 510px) {
    display: none;
  }
`,Ro=d(St)`
  @media (max-width: 475px) {
    display: none;
  }
`,Tl=d(Zo)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,Gl=d.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,Vl=({onUpdate:e})=>{const t=_e(),i=cn(),o=Yo(),{activeConfigId:s,activeConfigName:a,configs:l,isPreview:u,renameConfig:m,duplicateConfig:c,deleteConfig:h,savePreviewConfig:b}=t||{},[g,w]=p.useState(!1),[x,f]=p.useState(!1),[y,k]=p.useState(""),I=()=>{a&&s&&(k(a),f(!0))},L=U=>{U&&U.stopPropagation(),!(m&&s&&y.trim()&&!m(s,y.trim()))&&f(!1)},P=U=>{U&&U.stopPropagation(),f(!1)},C=U=>{U.key==="Enter"?L():U.key==="Escape"&&f(!1)},A=U=>{U.stopPropagation(),c&&s&&c(s)},R=U=>{U.stopPropagation(),s&&a&&h&&window.confirm(`Are you sure you want to delete "${a}"?`)&&(h(s),(l&&l.length<=1||s)&&i("/new"))},z=()=>{t==null||t.setShowSettings(!(t!=null&&t.showSettings))},v=()=>{t==null||t.setShowSettings(!1),t==null||t.selectConfig(null),i("/new")},_=nn(t),S=()=>{var U,K,J;!(t!=null&&t.results)||!_||t!=null&&t.isGenerating||t!=null&&t.isJscadConverting||(F("archive_single_downloaded",{has_injections:!!((U=t.injectionInput)!=null&&U.length),injections_count:((K=t.injectionInput)==null?void 0:K.length)||0,stored_configs_count:((J=t.configs)==null?void 0:J.length)||0,source:"header"}),fr(t.results,_,t.injectionInput,t.debug,t.stlPreview))},D=()=>{var U,K;!t||!_||(F("share_button_clicked",{has_injections:!!((U=t.injectionInput)!=null&&U.length),injections_count:((K=t.injectionInput)==null?void 0:K.length)||0,source:"header"}),w(!0))},W=()=>{t==null||t.setShowSideNav(!(t!=null&&t.showSideNav))},M=p.useMemo(()=>un("github:ceoloide/ergogen#v4.3.0"),[]);return n.jsxs(n.Fragment,{children:[g&&n.jsx(kr,{config:_,injections:(t==null?void 0:t.injectionInput)||[],onClose:()=>w(!1),"data-testid":"share-dialog"}),n.jsxs(Al,{children:[n.jsxs(Nl,{children:[n.jsx(Fl,{onClick:W,"aria-label":t!=null&&t.showSideNav?"Hide navigation panel":"Show navigation panel","data-testid":"side-nav-toggle-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"side_navigation"})}),n.jsxs(Wl,{children:[n.jsx(Tl,{to:"/","aria-label":"Go to home page","data-testid":"logo-button",children:n.jsx(Gl,{src:"/ergogen.png",alt:"Ergogen logo"})}),n.jsxs(Ol,{children:["Ergogen",M.isCustom&&n.jsx(vr,{versionInfo:M,"data-testid":"header-dev-chip"})]})]}),a&&n.jsxs(n.Fragment,{children:[n.jsx(ql,{children:"/"}),n.jsxs(Hl,{"data-testid":"header-active-config-name",$isEditing:x,onClick:!x&&!u?I:void 0,children:[u&&n.jsx(Jl,{"data-testid":"header-shared-icon",children:n.jsx("span",{className:"material-symbols-outlined",children:"link"})}),x?n.jsxs(n.Fragment,{children:[n.jsx(Kl,{type:"text",value:y,onChange:U=>k(U.target.value),onBlur:L,onKeyDown:C,autoFocus:!0,"data-testid":"header-config-name-input","aria-label":"Edit configuration name"}),n.jsxs(Vt,{className:"header-actions-always-visible",children:[n.jsx(He,{onMouseDown:U=>{U.preventDefault()},onClick:L,"aria-label":"Confirm rename","data-testid":"header-confirm-rename-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"check"})}),n.jsx(He,{onMouseDown:U=>{U.preventDefault()},onClick:P,"aria-label":"Cancel rename","data-testid":"header-cancel-rename-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]})]}):u?n.jsxs(n.Fragment,{children:[n.jsx(No,{"data-testid":"header-config-name-text",children:a}),n.jsx(Vt,{className:"header-actions-always-visible",children:n.jsx(He,{onClick:U=>{U.stopPropagation(),b==null||b()},"aria-label":"Save preview configuration","data-testid":"header-save-preview-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"save"})})})]}):n.jsxs(n.Fragment,{children:[n.jsx(No,{title:"Click to rename","data-testid":"header-config-name-text",children:a}),n.jsxs(Vt,{className:"header-actions-hover",children:[n.jsx(He,{onClick:I,"aria-label":"Rename configuration","data-testid":"header-rename-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),n.jsx(Ao,{onClick:A,"aria-label":"Duplicate configuration","data-testid":"header-duplicate-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),n.jsx(Ao,{onClick:R,"aria-label":"Delete configuration","data-testid":"header-delete-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})]})]})]}),n.jsxs(Ul,{children:[e&&n.jsx(Rl,{onClick:e,"data-testid":"header-update-chip"}),o.pathname==="/"&&n.jsxs(n.Fragment,{children:[n.jsxs(Ml,{onClick:v,"aria-label":"Start new configuration","data-testid":"new-config-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"add_2"}),n.jsx(Bl,{children:"New"})]}),n.jsx(Ro,{onClick:S,disabled:(t==null?void 0:t.isGenerating)||(t==null?void 0:t.isJscadConverting),"aria-label":"Download archive of all generated files","data-testid":"header-download-outputs-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),n.jsx(Ro,{onClick:D,disabled:!(t!=null&&t.configInput),"aria-label":"Share configuration","data-testid":"header-share-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"share"})})]}),o.pathname!=="/new"&&n.jsx(St,{onClick:z,"aria-label":t!=null&&t.showSettings?"Hide settings panel":"Show settings panel","data-testid":"settings-button",children:n.jsx("span",{className:"material-symbols-outlined",children:t!=null&&t.showSettings?"keyboard_alt":"settings"})})]})]})]})},Hl=d.div`
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
`,Vt=d.div`
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
`,Ao=d(He)`
  @media (max-width: 767px) {
    display: none;
  }
`,ql=d.span`
  color: ${r.colors.textDark};
  font-size: ${r.fontSizes.sm};
  font-weight: ${r.fontWeights.semiBold};
  user-select: none;
  @media (max-width: 639px) {
    display: none;
  }
`,No=d.span`
  font-size: ${r.fontSizes.bodySmall};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  user-select: none;
`,Kl=d.input`
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
`,Jl=d.div`
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
`,Xl=yt`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
`,Yl=d.div`
  position: fixed;
  top: 45px;
  left: 0;
  right: 0;
  width: 100%;
  height: 3px;
  background-color: transparent;
  overflow: hidden;
  z-index: 1000;
`,Zl=d.div`
  height: 100%;
  width: 25%;
  background-color: ${r.colors.accent};
  animation: ${Xl} 1.5s ease-in-out infinite;
`,Ql=({visible:e,"data-testid":t})=>e?n.jsx(Yl,{"data-testid":t,children:n.jsx(Zl,{})}):null,ct={info:{background:r.colors.info,text:r.colors.infoDark},warning:{background:r.colors.warning,text:r.colors.warningDark},error:{background:r.colors.error,text:r.colors.errorDark},success:{background:r.colors.success,text:r.colors.successDark}},dt=d.span.attrs({className:"material-symbols-outlined"})`
  font-size: ${r.fontSizes.iconLarge};
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
  color: ${({type:e})=>ct[e].text};
  background-color: ${({type:e})=>ct[e].background};
  border: 1px solid ${({type:e})=>ct[e].text};

  .material-symbols-outlined {
    color: ${({type:e})=>ct[e].text};
  }
`,ec=d.div`
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
  font-size: ${r.fontSizes.h3};
  cursor: pointer;
  padding: 0;
  line-height: 1;
  margin-left: auto;
  padding-left: 1rem;
`,tc=()=>{const e=_e();if(!e)return null;const{error:t,deprecationWarning:i,skippedWarning:o,info:s,clearError:a,clearWarning:l,clearSkippedWarning:u,clearInfo:m}=e;return n.jsxs(ec,{"data-testid":"banners-container",children:[s&&n.jsxs(ft,{type:"info","data-testid":"info-banner",children:[n.jsxs(ut,{children:[n.jsx(dt,{children:"info"}),n.jsx(pt,{children:s})]}),n.jsx(ht,{onClick:m,"aria-label":"Close info message","data-testid":"close-info-banner",children:"×"})]}),i&&n.jsxs(ft,{type:"warning","data-testid":"warning-banner",children:[n.jsxs(ut,{children:[n.jsx(dt,{children:"warning"}),n.jsx(pt,{children:i})]}),n.jsx(ht,{onClick:l,"aria-label":"Close warning message","data-testid":"close-warning-banner",children:"×"})]}),o&&n.jsxs(ft,{type:"warning","data-testid":"skipped-injections-banner",children:[n.jsxs(ut,{children:[n.jsx(dt,{children:"warning"}),n.jsx(pt,{children:o})]}),n.jsx(ht,{onClick:u,"aria-label":"Close feature warning message","data-testid":"close-skipped-banner",children:"×"})]}),t&&n.jsxs(ft,{type:"error","data-testid":"error-banner",children:[n.jsxs(ut,{children:[n.jsx(dt,{children:"error"}),n.jsx(pt,{children:t})]}),n.jsx(ht,{onClick:a,"aria-label":"Close error message","data-testid":"close-error-banner",children:"×"})]})]})},nc=()=>n.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-discord",viewBox:"0 0 16 16",children:n.jsx("path",{d:"M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"})}),Uo=({label:e,version:t,url:i,isCustom:o=!1,"data-testid":s,devBadgeTestId:a})=>{const l=()=>{window.open(i,"_blank","noopener,noreferrer")};return n.jsxs(oc,{onClick:l,$hasDevBadge:o,"aria-label":`View ${e==="Ergogen"?"Ergogen":`Ergogen ${e}`} ${t} on GitHub`,"data-testid":s,children:[n.jsx(an,{}),n.jsxs(rc,{children:[n.jsx(ic,{children:e}),n.jsx(sc,{$isCustom:o,children:t})]}),o&&n.jsx(ac,{"data-testid":a,children:n.jsx(lc,{children:"DEV"})})]})},oc=d.button`
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
`,rc=d.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  line-height: 1.1;
  min-width: 0;
`,ic=d.span`
  font-size: 10px;
  font-weight: ${r.fontWeights.bold};
  color: ${r.colors.white};
  white-space: nowrap;
`,sc=d.span`
  font-size: 8px;
  color: ${e=>e.$isCustom?r.colors.accent:r.colors.textDark};
  white-space: nowrap;
`,ac=d.div`
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
`,lc=d.span`
  font-size: 8px;
  font-weight: ${r.fontWeights.bold};
  color: ${r.colors.accent};
  transform: rotate(-90deg);
  white-space: nowrap;
  line-height: 1;
`,cc=({isOpen:e,onClose:t,"data-testid":i})=>{const o=p.useRef(e),[s,a]=p.useState(e),[l,u]=p.useState(360),m=p.useRef(!1),c=p.useRef(0),h=p.useRef(360),b=_e(),g=cn(),w=vt.version,{configs:x,activeConfigId:f,selectConfig:y,renameConfig:k,duplicateConfig:I,deleteConfig:L,setIsBulkDownloadOpen:P}=b||{},[C,A]=p.useState(""),[R,z]=p.useState(null),[v,_]=p.useState(""),S=p.useMemo(()=>{if(!x)return[];let O=x;if(C.trim()){const T=C.toLowerCase().split(/\s+/).filter(Boolean);T.length>0&&(O=x.filter(Q=>{const G=Q.name.toLowerCase();return T.some(j=>G.includes(j))}))}return[...O].sort((T,Q)=>{const G=T.updatedAt?new Date(T.updatedAt).getTime():0,j=Q.updatedAt?new Date(Q.updatedAt).getTime():0;if(G!==j)return j-G;const V=T.createdAt?new Date(T.createdAt).getTime():0,H=Q.createdAt?new Date(Q.createdAt).getTime():0;return V!==H?H-V:T.name.localeCompare(Q.name)})},[x,C]),D=()=>{y&&y(null),g("/new"),t()},W=()=>{F("bulk_download_dialog_opened",{stored_configs_count:(x==null?void 0:x.length)||0}),P&&P(!0),t()},M=O=>{y&&(y(O),g("/"),t())},U=(O,T)=>{z(O),_(T)},K=O=>{k&&v.trim()&&!k(O,v.trim())||z(null)},J=O=>{I&&I(O)},ne=(O,T)=>{if(window.confirm(`Are you sure you want to delete "${T}"?`)&&L){L(O);const Q=f===O,G=x&&x.length<=1;(Q||G)&&(g("/new"),t())}};p.useEffect(()=>{const O=o.current;e&&!O?a(!0):!e&&O&&a(!1),e||z(null),o.current=e},[e]),p.useEffect(()=>{if(!C.trim())return;const O=setTimeout(()=>{F("search_performed",{query_length:C.trim().length})},1e3);return()=>clearTimeout(O)},[C]),p.useEffect(()=>{const O=j=>{if(!m.current)return;const V=j.clientX-c.current,H=h.current+V,ee=Math.min(600,window.innerWidth*.9),q=Math.max(360,Math.min(H,ee));u(q)},T=()=>{m.current&&(m.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},Q=j=>{if(!m.current)return;j.preventDefault();const H=j.touches[0].clientX-c.current,ee=h.current+H,q=Math.min(600,window.innerWidth*.9),se=Math.max(360,Math.min(ee,q));u(se)},G=()=>{m.current&&(m.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",O),window.addEventListener("mouseup",T),window.addEventListener("touchmove",Q,{passive:!1}),window.addEventListener("touchend",G),()=>{window.removeEventListener("mousemove",O),window.removeEventListener("mouseup",T),window.removeEventListener("touchmove",Q),window.removeEventListener("touchend",G)}},[]);const Z=O=>{O.preventDefault(),O.stopPropagation(),m.current=!0,h.current=l,"touches"in O?c.current=O.touches[0].clientX:c.current=O.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};p.useEffect(()=>{if(!e)return;const O=T=>{T.key==="Escape"&&t()};return window.addEventListener("keydown",O),()=>{window.removeEventListener("keydown",O)}},[e,t]);const B=p.useMemo(()=>un("github:ceoloide/ergogen#v4.3.0"),[]);return p.useEffect(()=>(e?document.body.style.overflow="hidden":document.body.style.overflow="",()=>{document.body.style.overflow=""}),[e]),n.jsxs(n.Fragment,{children:[n.jsx(dc,{"data-testid":i,onClick:t,$isOpen:e,$isOpening:s}),n.jsxs(uc,{"data-testid":i&&`${i}-panel`,$isOpen:e,$isOpening:s,$width:l,onClick:O=>O.stopPropagation(),children:[n.jsx(Nc,{onMouseDown:Z,onTouchStart:Z,"data-testid":i&&`${i}-resize-handle`}),n.jsxs(pc,{children:[n.jsxs(fc,{children:[n.jsx(hc,{to:"/",onClick:t,"aria-label":"Go to home page","data-testid":"side-nav-logo-button",children:n.jsx(gc,{src:"/ergogen.png",alt:"Ergogen logo"})}),n.jsxs(mc,{onClick:t,children:["Ergogen",B.isCustom&&n.jsx(vr,{versionInfo:B,"data-testid":"sidebar-dev-chip"})]})]}),n.jsx(bc,{onClick:t,"data-testid":i&&`${i}-close`,"aria-label":"Close navigation panel",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),n.jsxs(wc,{children:[n.jsxs(xc,{children:[n.jsxs(yc,{onClick:D,"aria-label":"New","data-testid":"side-nav-new-config-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"add"}),n.jsx("span",{children:"New"})]}),x&&x.length>0&&n.jsxs(kc,{onClick:W,"aria-label":"Download All","data-testid":"side-nav-download-all-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"download"}),n.jsx("span",{children:"Download All"})]})]}),n.jsxs(vc,{children:[n.jsx("span",{className:"material-symbols-outlined search-icon",children:"search"}),n.jsx(_c,{type:"text",placeholder:"Search configurations...",value:C,onChange:O=>A(O.target.value),"aria-label":"Search configurations"}),C&&n.jsx(jc,{onClick:()=>A(""),children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),n.jsxs($c,{children:[n.jsx("span",{children:"Saved Configurations"}),n.jsx(Cc,{children:S.length})]}),n.jsxs(Sc,{children:[S.map(O=>{const T=O.id===f,Q=R===O.id;return n.jsx(Ec,{$isActive:T,"data-testid":`config-item-${O.id}`,children:Q?n.jsxs(Lc,{onSubmit:G=>{G.preventDefault(),K(O.id)},children:[n.jsx(zc,{type:"text",value:v,onChange:G=>_(G.target.value),autoFocus:!0,"aria-label":"Rename input"}),n.jsx(Wo,{type:"submit","aria-label":"Save name",children:n.jsx("span",{className:"material-symbols-outlined",children:"check"})}),n.jsx(Wo,{type:"button",onClick:()=>z(null),"aria-label":"Cancel rename",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}):n.jsxs(n.Fragment,{children:[n.jsxs(Pc,{onClick:()=>M(O.id),$isActive:T,title:O.name,children:[n.jsx("span",{className:"material-symbols-outlined",children:"description"}),n.jsx("span",{className:"config-title-text",children:O.name})]}),n.jsxs(Ic,{$isActive:T,children:[n.jsx(Ht,{onClick:()=>U(O.id,O.name),"aria-label":`Rename configuration ${O.name}`,children:n.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),n.jsx(Ht,{onClick:()=>J(O.id),"aria-label":`Duplicate configuration ${O.name}`,children:n.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),n.jsx(Ht,{onClick:()=>ne(O.id,O.name),"aria-label":`Delete configuration ${O.name}`,children:n.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})},O.id)}),S.length===0&&n.jsx(Dc,{children:"No configurations found"})]})]}),n.jsx(Rc,{children:n.jsxs(Ac,{children:[n.jsxs(Oo,{onClick:()=>{window.open("https://docs.ergogen.xyz/","_blank","noopener,noreferrer")},"aria-label":"Open documentation","data-testid":"side-nav-docs-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"description"}),n.jsx("span",{children:"Docs"})]}),n.jsx(Oo,{onClick:()=>{window.open("https://discord.ergogen.xyz","_blank","noopener,noreferrer")},"aria-label":"Join the Discord community","data-testid":"side-nav-discord-button",children:n.jsx(nc,{})}),n.jsx(Uo,{label:"Web UI",version:w,url:"https://github.com/ceoloide/ergogen-gui","data-testid":"side-nav-gui-version-button"}),n.jsx(Uo,{label:"Ergogen",version:B.displayText,url:B.url,isCustom:B.isCustom,"data-testid":"side-nav-ergogen-version-button",devBadgeTestId:"side-nav-ergogen-dev-badge"})]})})]})]})},dc=d.div`
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
`,uc=d.div`
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
`,pc=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 3em;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
`,fc=d.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`,hc=d(Zo)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,gc=d.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,mc=d.div`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  cursor: pointer;
  display: flex;
  align-items: center;
`,bc=d.button`
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
`,wc=d.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`,xc=d.div`
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
  flex-shrink: 0;
`,yc=d.button`
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
`,kc=d.button`
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
`,vc=d.div`
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
`,_c=d.input`
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
`,jc=d.button`
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
`,$c=d.div`
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
`,Cc=d.span`
  background-color: ${r.colors.border};
  color: ${r.colors.white};
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: ${r.fontWeights.semiBold};
`,Sc=d.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  flex: 1;
`,Ec=d.div`
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
`,Pc=d.button`
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
`,Ic=d.div.attrs({className:"item-actions-hover"})`
  display: flex;
  gap: 4px;
  opacity: ${e=>e.$isActive?1:0};
  transition: opacity 0.15s ease-in-out;

  @media (max-width: 1023px) {
    opacity: 1;
  }
`,Ht=d.button`
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
`,Lc=d.form`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 100%;
`,zc=d.input`
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
`,Wo=d.button`
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
`,Dc=d.div`
  text-align: center;
  color: ${r.colors.textDark};
  font-size: ${r.fontSizes.bodySmall};
  margin-top: 2rem;
  font-style: italic;
`,Rc=d.div`
  padding: 8px 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`,Ac=d.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  width: 100%;
`,Oo=d.button`
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
`,Nc=d.div`
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
`,Uc=({isOpen:e,configs:t,injections:i,debug:o,stlPreview:s,onClose:a,"data-testid":l})=>{const[u,m]=p.useState(new Set),[c,h]=p.useState(!0),[b,g]=p.useState(!1),[w,x]=p.useState(0),[f,y]=p.useState(""),k=p.useRef(!1);if(p.useEffect(()=>{e&&(m(new Set(t.map(R=>R.id))),g(!1),x(0),y(""),k.current=!1)},[e,t]),!e)return null;const I=R=>{m(R?new Set(t.map(z=>z.id)):new Set)},L=(R,z)=>{const v=new Set(u);z?v.add(R):v.delete(R),m(v)},P=async()=>{if(u.size===0)return;g(!0),x(0),y(""),k.current=!1;const R=t.filter(z=>u.has(z.id));F("bulk_download_started",{selected_configs_count:u.size,only_configs:c});try{const z=await Ji(R,i,o,s,c,(v,_,S)=>{x(v),y(S)},()=>k.current);k.current||(z&&z.succeededCount===0&&z.failedCount>0?F("bulk_download_failed",{selected_configs_count:u.size,failed_configs_count:z.failedCount,only_configs:c,error_message:`All ${z.failedCount} selected configuration(s) failed to compile`}):z&&z.failedCount>0?F("bulk_download_partial",{selected_configs_count:u.size,failed_configs_count:z.failedCount,only_configs:c}):F("bulk_download_completed",{selected_configs_count:u.size,only_configs:c}))}catch(z){console.error("Error during bulk download:",z),F("bulk_download_failed",{selected_configs_count:u.size,only_configs:c,error_message:z instanceof Error?z.message:String(z)})}finally{k.current||a()}},C=()=>{b&&!k.current&&F("bulk_download_cancelled",{selected_configs_count:u.size,completed_configs_count:w,only_configs:c}),k.current=!0,a()},A=u.size>0?w/u.size*100:0;return n.jsx(Wc,{"data-testid":l,children:n.jsxs(Oc,{"data-testid":l&&`${l}-box`,children:[n.jsx(Fc,{children:"Download Configurations"}),b?n.jsxs(n.Fragment,{children:[n.jsxs(ed,{children:[n.jsx(td,{children:n.jsx(nd,{style:{width:`${A}%`}})}),n.jsxs(od,{children:[n.jsx(rd,{children:f?f.includes(", ")?n.jsxs("div",{children:["Generating:",n.jsx(id,{children:f.split(", ").map(R=>n.jsx("li",{children:R},R))})]}):n.jsxs(Bo,{children:["Generating ",f]}):n.jsx(Bo,{children:"Preparing..."})}),n.jsxs(sd,{children:[w," / ",u.size]})]})]}),n.jsx(Mo,{children:n.jsx(ad,{onClick:C,size:"medium",children:"Cancel"})})]}):n.jsxs(n.Fragment,{children:[n.jsx(Bc,{children:t.map(R=>{const z=u.has(R.id);return n.jsx(Tc,{children:n.jsxs(_r,{htmlFor:`bulk-check-${R.id}`,children:[n.jsx(Vc,{id:`bulk-check-${R.id}`,checked:z,onChange:v=>L(R.id,v.target.checked)}),n.jsx(Hc,{$checked:z}),n.jsx(Gc,{children:R.name})]})},R.id)})}),n.jsxs(Mc,{children:[n.jsx(Fo,{onClick:()=>I(!0),children:"Select All"}),n.jsx(Fo,{onClick:()=>I(!1),children:"Deselect All"})]}),n.jsxs(qc,{children:[n.jsx(Kc,{children:"Only download configs"}),n.jsxs(Jc,{$checked:c,htmlFor:"only-configs-switch",children:[n.jsx(Xc,{type:"checkbox",id:"only-configs-switch",checked:c,onChange:R=>h(R.target.checked)}),n.jsx(Yc,{$checked:c}),n.jsx(Zc,{$checked:c})]})]}),!c&&n.jsxs(Qc,{children:[n.jsx("span",{className:"material-symbols-outlined",children:"warning"}),n.jsx("span",{children:"Warning: Exporting generated outputs for multiple configurations may take a long time depending on the number of selected configurations, their complexity, and CPU speed."})]}),n.jsxs(Mo,{children:[n.jsx(jr,{onClick:C,size:"medium",children:"Cancel"}),n.jsxs(he,{onClick:P,disabled:u.size===0,size:"medium",children:["Download (",u.size,")"]})]})]})]})})},Wc=d.div`
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
`,Oc=d.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,Fc=d.h2`
  margin: 0 0 1rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
`,Mc=d.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 1.5rem;
`,Fo=d.button`
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
`,Bc=d.div`
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
`,Tc=d.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,Gc=d.span`
  color: ${r.colors.text};
  font-size: 13px;
  user-select: none;
`,_r=d.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  padding: 4px 0;
`,Vc=d.input.attrs({type:"checkbox"})`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`,Hc=d.div`
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

  ${_r}:hover & {
    border-color: ${r.colors.accent};
  }
`,qc=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
`,Kc=d.span`
  color: ${r.colors.text};
  font-size: ${r.fontSizes.base};
  user-select: none;
`,Jc=d.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: pointer;
`,Xc=d.input`
  opacity: 0;
  width: 0;
  height: 0;
`,Yc=d.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${e=>e.$checked?r.colors.accent:r.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`,Zc=d.span`
  position: absolute;
  top: 2px;
  left: ${e=>e.$checked?"18px":"2px"};
  width: 16px;
  height: 16px;
  background-color: ${r.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,Qc=d.div`
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
`,Mo=d.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: auto;
`,ed=d.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`,td=d.div`
  background-color: ${r.colors.border};
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  width: 100%;
`,nd=d.div`
  background-color: ${r.colors.accent};
  height: 100%;
  transition: width 0.15s ease-out;
`,od=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`,rd=d.div`
  color: ${r.colors.text};
  max-width: 80%;
`,Bo=d.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,id=d.ul`
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
`,sd=d.span`
  color: ${r.colors.textDark};
  font-weight: ${r.fontWeights.semiBold};
`,jr=d(he)`
  background-color: ${r.colors.backgroundLighter};
  color: ${r.colors.textDark};

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`,ad=d(jr)`
  width: 100%;
`;function ld(){return!!(window.location.hostname==="localhost"||window.location.hostname==="[::1]"||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))}function cd(e,t,i){e.addEventListener("statechange",()=>{var o,s;e.state==="installed"&&(navigator.serviceWorker.controller?(console.log("[SW] New content is available. Will be used when all existing tabs are closed or you reload."),(o=i==null?void 0:i.onUpdate)==null||o.call(i,t)):(console.log("[SW] Content is cached for offline use."),(s=i==null?void 0:i.onSuccess)==null||s.call(i,t)))})}async function $r(e,t){var i;try{const o=await navigator.serviceWorker.register(e);let s=null;const a=l=>{l===null||l===s||(s=l,cd(l,o,t))};o.addEventListener("updatefound",()=>a(o.installing)),o.waiting&&navigator.serviceWorker.controller?(i=t==null?void 0:t.onUpdate)==null||i.call(t,o):a(o.installing)}catch(o){console.error("[SW] Error during service worker registration:",o)}}async function dd(e,t){try{const i=await fetch(e,{headers:{"Service-Worker":"script"}}),o=i.headers.get("content-type");i.status===404||o!==null&&o.indexOf("javascript")===-1?(await(await navigator.serviceWorker.ready).unregister(),window.location.reload()):await $r(e,t)}catch{console.log("[SW] No internet connection found. App is running in offline mode.")}}function ud(e){!("serviceWorker"in navigator)||new URL("/",window.location.href).origin!==window.location.origin||window.addEventListener("load",()=>{const i="/service-worker.js";ld()?(dd(i,e),navigator.serviceWorker.ready.then(()=>{console.log("[SW] This web app is being served cache-first by a service worker. See https://cra.link/PWA for more details.")})):$r(i,e)})}const pd=({report:e,onAccept:t,onCancel:i,"data-testid":o})=>n.jsx(fd,{"data-testid":o,children:n.jsxs(hd,{"data-testid":o&&`${o}-box`,children:[n.jsx(gd,{children:"Version Compatibility Warning"}),n.jsx(md,{children:"The shared link was created under a different environment. You may experience compatibility issues."}),n.jsxs(bd,{children:[e.guiWarning&&n.jsxs(qt,{"data-testid":o&&`${o}-gui-warning`,children:[n.jsxs(Kt,{children:["GUI Version Mismatch",n.jsx(Jt,{"data-testid":"gui-mismatch-badge",children:"Mismatch"})]}),n.jsxs(Xt,{children:["The shared link was created with a newer version of the GUI (",n.jsxs("strong",{children:["v",e.guiWarning.shared]}),") than your current version (",n.jsxs("strong",{children:["v",e.guiWarning.current]}),"). Some interface options or features may not function as expected."]})]}),e.ergogenWarning&&n.jsxs(qt,{"data-testid":o&&`${o}-ergogen-warning`,children:[n.jsxs(Kt,{children:["Ergogen Version Mismatch",n.jsx(Jt,{"data-testid":"ergogen-mismatch-badge",children:"Mismatch"})]}),n.jsxs(Xt,{children:["The shared link was created with a newer version of Ergogen (",n.jsx("strong",{children:e.ergogenWarning.shared}),") than your current version (",n.jsx("strong",{children:e.ergogenWarning.current}),"). Some features or syntax might not be supported."]})]}),e.customErgogenWarning&&n.jsxs(qt,{"data-testid":o&&`${o}-custom-ergogen-warning`,children:[n.jsxs(Kt,{children:["Custom Ergogen Version Used",n.jsx(Jt,{"data-testid":"custom-version-badge",children:"Custom"})]}),n.jsxs(Xt,{children:["The shared link was created using a custom version of Ergogen:"," ",n.jsx("strong",{children:e.customErgogenWarning.shared}),".",n.jsx("br",{}),"You can investigate the repository used here:",n.jsx("br",{}),n.jsx(wd,{href:e.customErgogenWarning.url,target:"_blank",rel:"noopener noreferrer","data-testid":o&&`${o}-custom-repo-link`,children:e.customErgogenWarning.label})]})]})]}),n.jsxs(xd,{children:[n.jsx(kd,{onClick:i,size:"medium","data-testid":o&&`${o}-cancel`,"aria-label":"Cancel configuration loading",children:"Cancel"}),n.jsx(yd,{onClick:t,size:"medium","data-testid":o&&`${o}-accept`,"aria-label":"Accept and load configuration",children:"Accept and Load"})]})]})}),fd=d.div`
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
`,hd=d.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 550px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,gd=d.h2`
  margin: 0 0 0.5rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.error};
`,md=d.p`
  margin: 0 0 1.5rem 0;
  font-size: ${r.fontSizes.base};
  color: ${r.colors.textDarker};
  line-height: 1.4;
`,bd=d.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`,qt=d.div`
  background-color: ${r.colors.backgroundLighter};
  border-left: 4px solid ${r.colors.warningDark};
  padding: 1rem;
  border-radius: 4px;
`,Kt=d.div`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.bold};
  color: ${r.colors.warningDark};
  margin-bottom: 0.25rem;
`,Jt=d.span`
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
`,Xt=d.div`
  font-size: ${r.fontSizes.bodySmall};
  color: ${r.colors.textDark};
  line-height: 1.5;

  strong {
    color: ${r.colors.text};
  }
`,wd=d.a`
  display: inline-block;
  margin-top: 0.5rem;
  color: ${r.colors.accent};
  text-decoration: underline;
  word-break: break-all;

  &:hover {
    color: ${r.colors.accentSecondary};
  }
`,xd=d.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`,yd=d(he)`
  background-color: ${r.colors.accent};
  color: ${r.colors.white};

  &:hover {
    background-color: ${r.colors.accentDark};
  }
`,kd=d(he)`
  background-color: ${r.colors.backgroundLighter};
  color: ${r.colors.textDark};

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`;let To=null,Go=!1;const vd=()=>{Go||(To=xr(),Go=!0);const e=To,t=[];let i=null;const o=p.useRef(null);if(e)if(e.success){const l=e.config;o.current===null&&(o.current={config:l.config,injections:l.injections,guiVersion:l.guiVersion,ergogenVersion:l.ergogenVersion}),window.history.replaceState(null,"",window.location.pathname+window.location.search)}else i=e.message,console.error("[App] Failed to load shared configuration from hash",{error:e.error,message:e.message,hashLength:window.location.hash.length}),window.history.replaceState(null,"",window.location.pathname+window.location.search);const[s,a]=p.useState(null);return p.useEffect(()=>{o.current&&a(o.current)},[]),n.jsx(os,{initialInjectionInput:t,hashError:i,children:n.jsx($d,{pendingSharedConfig:s})})};function _d(){const[e,t]=p.useState(null),i=new URLSearchParams(window.location.search).has("force_update");if(p.useEffect(()=>{ud({onUpdate:o=>{t(o)}})},[]),i)return()=>{console.log("[SW] Force-update triggered via ?force_update URL parameter."),window.location.reload()};if(e)return()=>{let o;if("serviceWorker"in navigator){let a=!1;navigator.serviceWorker.addEventListener("controllerchange",()=>{a||(a=!0,o&&clearTimeout(o),window.location.reload())})}const s=e.waiting;s?(s.postMessage({type:"SKIP_WAITING"}),o=setTimeout(()=>{window.location.reload()},1e3)):window.location.reload()}}function jd(){const[e,t]=p.useState(null),[i,o]=p.useState(!1),[s,a]=p.useState(!1),l=new URLSearchParams(window.location.search).has("force_install");return p.useEffect(()=>{(()=>{const g=typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches,w=window.navigator.standalone===!0;a(g||w)})();const h=g=>{g.preventDefault(),t(g),console.log("[PWA] beforeinstallprompt event fired and captured.")},b=()=>{console.log("[PWA] appinstalled event fired."),a(!0),o(!1)};return window.addEventListener("beforeinstallprompt",h),window.addEventListener("appinstalled",b),()=>{window.removeEventListener("beforeinstallprompt",h),window.removeEventListener("appinstalled",b)}},[]),{onInstall:()=>{F("pwa_install_click"),o(!0),e?(e.prompt(),e.userChoice.then(c=>{c.outcome==="accepted"?(console.log("[PWA] User accepted the install prompt"),F("pwa_install_accepted"),a(!0)):(console.log("[PWA] User dismissed the install prompt"),F("pwa_install_dismissed")),o(!1),t(null)})):(console.log("[PWA] Install prompt triggered (deferredPrompt is not available on this device/browser)"),alert('PWA installation is not supported by this browser or is restricted on this device. If you are on iOS/iPadOS, please open this site in Safari and select "Add to Home Screen" from the Share menu.'),o(!1))},isAvailable:!!e||l,isInstalled:s,isInstalling:i}}const $d=({pendingSharedConfig:e})=>{var L;const t=_e(),i=t==null?void 0:t.configInput,o=Yo(),s=_d(),a=jd(),l=p.useRef(0);l.current=((L=t==null?void 0:t.configs)==null?void 0:L.length)||0,p.useEffect(()=>{F("page_view",{page_path:o.pathname,stored_configs_count:l.current})},[o.pathname]);const u=p.useRef(!1),m=p.useRef(e);e!==m.current&&(m.current=e);const{currentConflict:c,processInjectionsWithConflictResolution:h,handleConflictResolution:b,handleConflictCancel:g}=Ct({setInjectionInput:P=>t==null?void 0:t.setInjectionInput(P),setConfigInput:P=>t==null?void 0:t.loadPreview(P),generateNow:async(P,C,A)=>{t&&await t.generateNow(P,C,A)},getCurrentInjections:()=>(t==null?void 0:t.injectionInput)||[],onComplete:async(P,C)=>{localStorage.setItem("ergogen:injection",JSON.stringify(C)),t==null||t.loadPreview(P)},setError:P=>t==null?void 0:t.setError(P)}),[w,x]=p.useState(null),f=(P,C)=>{const A=vt.version,R=pn("github:ceoloide/ergogen#v4.3.0");let z=!0,v,_,S;if(P){const D=Ue(A),W=Ue(P);D&&W&&!Yt(D,W)&&(z=!1,v={current:A,shared:P})}if(C){if(Br(C)&&C!==R){z=!1;const M=un(C);S={shared:C,url:M.url,label:M.label}}const D=io(R)||Ze(),W=io(C);if(W){const M=Ue(D),U=Ue(W);M&&U&&!Yt(M,U)&&(z=!1,_={current:D,shared:W})}}return{isCompatible:z,guiWarning:v,ergogenWarning:_,customErgogenWarning:S}},y=p.useCallback((P,C)=>{t&&(C!==void 0&&C.length>0?h(C,P).catch(A=>{console.error("[App] Error processing injections:",A),t.setError(`Failed to process injections: ${A instanceof Error?A.message:"Unknown error"}`)}):(t.loadPreview(P),t.generateNow(P,t.injectionInput,{pointsonly:!1})))},[t,h]),k=()=>{var P;w&&(F("shared_config_accepted",{has_injections:!!(w.injections&&w.injections.length>0),injections_count:((P=w.injections)==null?void 0:P.length)||0}),y(w.config,w.injections),x(null))},I=()=>{var P;w&&F("shared_config_declined",{has_injections:!!(w.injections&&w.injections.length>0),injections_count:((P=w.injections)==null?void 0:P.length)||0}),x(null)};return p.useEffect(()=>{if(!t||!e||u.current)return;u.current=!0;const P=f(e.guiVersion,e.ergogenVersion);P.isCompatible?y(e.config,e.injections):x({config:e.config,injections:e.injections,report:P})},[t,e,y]),p.useEffect(()=>{if(!t)return;const P=()=>{const C=xr();if(C)if(C.success){const A=C.config,R=f(A.guiVersion,A.ergogenVersion);R.isCompatible?y(A.config,A.injections):x({config:A.config,injections:A.injections,report:R}),window.history.replaceState(null,"",window.location.pathname+window.location.search)}else console.error("[App] Failed to load shared configuration from hash (hashchange)",{error:C.error,message:C.message,hashLength:window.location.hash.length}),t.setError(C.message),window.history.replaceState(null,"",window.location.pathname+window.location.search)};return window.addEventListener("hashchange",P),()=>{window.removeEventListener("hashchange",P)}},[t,y]),n.jsxs(n.Fragment,{children:[w&&n.jsx(pd,{report:w.report,onAccept:k,onCancel:I,"data-testid":"share-compatibility-dialog"}),c&&n.jsx($t,{injectionName:c.name,injectionType:c.type,onResolve:b,onCancel:g,"data-testid":"conflict-dialog"}),(t==null?void 0:t.isBulkDownloadOpen)&&n.jsx(Uc,{isOpen:t.isBulkDownloadOpen,configs:t.configs,injections:t.injectionInput,debug:t.debug,stlPreview:t.stlPreview,onClose:()=>t.setIsBulkDownloadOpen(!1),"data-testid":"bulk-download-dialog"}),n.jsx(Vl,{onUpdate:s}),n.jsx(Ql,{visible:(t==null?void 0:t.isGenerating)??!1,"data-testid":"loading-bar"}),n.jsx(tc,{}),n.jsx(cc,{isOpen:(t==null?void 0:t.showSideNav)??!1,onClose:()=>t==null?void 0:t.setShowSideNav(!1),"data-testid":"side-navigation"}),n.jsx(Cd,{children:n.jsxs(Ur,{children:[n.jsx(Dt,{path:"/",element:i?n.jsx(Aa,{pwaState:a}):n.jsx(ro,{to:{pathname:"/new",search:o.search},replace:!0})}),n.jsx(Dt,{path:"/new",element:n.jsx(jl,{})}),n.jsx(Dt,{path:"*",element:n.jsx(ro,{to:"/",replace:!0})})]})})]})},Cd=d.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;let Vo=!1;const Sd=e=>{Vo||(e.editor.defineTheme("ergogen-theme",{base:"vs-dark",inherit:!0,rules:[],colors:{"editor.background":r.colors.backgroundLight}}),Vo=!0)};ir();const Ed=d.div`
  display: flex;
  flex-direction: column;
  color: #ffffff;
  height: 100%;
  width: 100%;
  font-family: 'Roboto', sans-serif;
`,Pd=Wr`
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
`;Qo.config({paths:{vs:"/monaco/vs"}});Qo.init().then(e=>{Sd(e);const t=document.getElementById("root");Or(t).render(n.jsx(Xo.StrictMode,{children:n.jsx(Fr,{basename:("/".startsWith("."),"/"),children:n.jsxs(Ed,{children:[n.jsx(Pd,{}),n.jsx(vd,{})]})})}))});export{bt as a,r as t};
