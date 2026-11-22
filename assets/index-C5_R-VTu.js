const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/PcbPreview-DsKQssW6.js","assets/vendor-C9A_qoZ1.js","assets/StlPreview-Eh3W8k1x.js","assets/three-BJECO8Vk.js","assets/js-yaml-DW8Bub87.js","assets/jszip-cZtdyB0p.js"])))=>i.map(i=>d[i]);
import{f as qe,y as d,j as n,r as f,h as Je,i as no,k as Vo,l as Ho,O as yt,p as qo,m as Dr,n as Ar,o as Ko,q as Jo,t as Rr,v as ln,w as Xo,L as Yo,x as Nr,z as Dt,N as oo,A as Ur,B as Zo,e as Or,C as Wr}from"./vendor-C9A_qoZ1.js";import{j as fe}from"./js-yaml-DW8Bub87.js";import{J as Ye}from"./jszip-cZtdyB0p.js";import{_ as Qo}from"./three-BJECO8Vk.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&o(c)}).observe(document,{childList:!0,subtree:!0});function i(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(s){if(s.ep)return;s.ep=!0;const a=i(s);fetch(s.href,a)}})();const kt=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/ergogen.worker-yOrnwBol.js",import.meta.url),{type:"module"})}catch(e){return console.error("Failed to create worker:",e),null}},cn=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/jscad.worker-C8nLBdOi.js",import.meta.url),{type:"module"})}catch(e){return console.error("Failed to create JSCAD worker:",e),null}},Fr="0.19.3",vt={version:Fr},dn=e=>{const t=`v${qe.version}`,i=qe.version,o=qe.repository,s=o.startsWith("github:")?o.replace("github:","https://github.com/"):o.replace(/^git\+/,"").replace(/\.git$/,"");if(!e)return{label:t,url:s,displayText:i,isCustom:!1,isHash:!1,isTag:!1};if(e.includes("@")){const x=e.split("@"),k=x[1]||e;return{label:e,url:e.startsWith("ergogen@")?`${s}/releases/tag/v${k}`:`https://www.npmjs.com/package/${x[0]}`,displayText:k,isCustom:!0,isHash:!1,isTag:!0}}const a=e.startsWith("github:")?e.slice(7):e,[c,u]=a.split("#"),m=c==="ergogen/ergogen",l=`https://github.com/${c}`;if(m){if(!u)return{label:"latest",url:l,displayText:i,isCustom:!1,isHash:!1,isTag:!1};const x=u.length===40&&/^[0-9a-fA-F]{40}$/.test(u),k=x?t:u,p=x?`${l}/commit/${u}`:`${l}/tree/${u}`;return{label:u,url:p,displayText:k,isCustom:!0,isHash:x,isTag:!x}}if(!u)return{label:a,url:l,displayText:i,isCustom:!0,isHash:!1,isTag:!1};const g=u.length===40&&/^[0-9a-fA-F]{40}$/.test(u),b=g?t:u,h=g?`${l}/commit/${u}`:`${l}/tree/${u}`;return{label:a,url:h,displayText:b,isCustom:!0,isHash:g,isTag:!g}},un=e=>{if(e.includes("@")){const s=e.split("@"),a=s[1]||e,c=s[0];return`github:${c==="ergogen"?"ergogen/ergogen":c}#v${a}`}const t=e.startsWith("github:")?e.slice(7):e,[i,o]=t.split("#");return o?`github:${i}#${o}`:`github:${i}#v${qe.version}`},Ue=e=>{const i=e.replace(/^v/,"").match(/^(\d+)\.(\d+)\.(\d+)/);return i?[Number(i[1]),Number(i[2]),Number(i[3])]:null},Yt=(e,t)=>{for(let i=0;i<3;i++){if(e[i]>t[i])return!0;if(e[i]<t[i])return!1}return!0},ro=e=>{const t=e.match(/(?:^|#|@|v)(\d+\.\d+\.\d+)/);return t?t[1]:null},Mr=e=>{const t=e.startsWith("github:")?e.slice(7):e,[i]=t.split("#");return!e.startsWith("github:")&&!e.includes("/")?!1:i!=="ergogen/ergogen"},er=()=>{if(typeof window>"u")return!1;const e=window.navigator;return typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches||e.standalone===!0},tr=e=>{if(typeof window>"u")return!0;if(window.__FORCE_ANALYTICS__===!0||e.startsWith("G-TEST"))return!1;const t=window.location.hostname;return!!(t==="localhost"||t==="127.0.0.1"||t==="[::1]"||t.endsWith(".localhost"))},Br=()=>{if(typeof document>"u"||!document.cookie)return;const e=document.cookie.split(";");for(const t of e){const i=t.indexOf("="),o=(i>-1?t.substring(0,i):t).trim();if(o.startsWith("_ga")){document.cookie=`${o}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`;const a=window.location.hostname.split(".");for(;a.length>0;){const c=a.join(".");document.cookie=`${o}=; Path=/; Domain=.${c}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`,document.cookie=`${o}=; Path=/; Domain=${c}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`,a.shift()}}}},Tr=()=>{if(!(typeof indexedDB>"u"))try{indexedDB.deleteDatabase("workbox-background-sync")}catch{}},nr=()=>typeof window>"u"||!window.location?void 0:`${window.location.origin&&window.location.origin!=="null"?window.location.origin:`${window.location.protocol||"https:"}//${window.location.hostname||"localhost"}`}${window.location.pathname||"/"}`,or="ergogen:consent:sendUsageMetrics",Gr="ergogen:config:sendUsageMetrics",Vr="ergogen:settings";let mt;const io=e=>{const t=localStorage.getItem(e);if(t!==null)try{const i=JSON.parse(t);return typeof i=="boolean"?i:void 0}catch{return}},Hr=()=>{const e=localStorage.getItem(Vr);if(e!==null)try{const t=JSON.parse(e);return t&&typeof t=="object"&&typeof t.sendUsageMetrics=="boolean"?t.sendUsageMetrics:void 0}catch{return}},_t=()=>{if(typeof window>"u")return!1;if(mt!==void 0)return mt;try{const e=io(or);if(e!==void 0)return e;if(io(Gr)===!1||Hr()===!1)return!1}catch{return!1}return!er()},qr=e=>{try{localStorage.setItem(or,JSON.stringify(e)),mt=void 0}catch{mt=e}};let Ge=!1;const rr=()=>{var s;if(typeof window>"u")return;const e=_t(),t="G-46F2L343EK",i=tr(t),o=document.getElementById("gtag-script");if(o||(Ge=!1),e&&t&&!i){delete window["ga-disable-"+t];const a=window,c={send_page_view:!1,allow_google_signals:!1,allow_ad_personalization_signals:!1},u=()=>{var m;return(m=a.gtag)==null?void 0:m.call(a,"set",{page_location:nr()})};if(o)Ge&&(u(),(s=a.gtag)==null||s.call(a,"config",t,c),Ge=!1);else{const m=document.createElement("script");m.async=!0,m.src=`https://www.googletagmanager.com/gtag/js?id=${t}`,m.id="gtag-script",document.head.appendChild(m);const l=a.dataLayer||[];a.dataLayer=l,a.gtag=function(){l.push(arguments)},a.gtag("js",new Date),u(),a.gtag("config",t,c),Ge=!1}ti()}else window["ga-disable-"+t]=!0,o&&(Ge=!0),Br(),Tr(),ni()},Kr=new Set(["yaml","yml","json","zip","ekb"]),Jr=e=>{const t=e.lastIndexOf("."),i=t>=0?e.slice(t+1).toLowerCase():"";return Kr.has(i)?i:"other"},ir=100,Xr=/"[^"\n]*"|'[^'\n]*'|`[^`\n]*`/g,Yr=/^at\s|^[^\s@]*@\S+:\d+:\d+$/,Zr=e=>e.split(`
`)[0].replace(Xr,t=>`${t[0]}*${t[0]}`).trim().slice(0,ir),Qr=e=>{const t=e.split(`
`).map(i=>i.trim()).filter(i=>Yr.test(i));return t.length>0?t.join(" ").slice(0,ir):void 0},ei=e=>{const t={...e};for(const i of["error_message","description"]){const o=t[i];typeof o=="string"&&(t[i]=Zr(o))}return typeof t.error_stack=="string"&&(t.error_stack=Qr(t.error_stack)),t},M=(e,t)=>{if(_t()&&!tr("G-46F2L343EK")&&window.gtag){const o=nr();window.gtag("set",{page_location:o}),window.gtag("event",e,{page_location:o,gui_version:vt.version,ergogen_version:un("github:ceoloide/ergogen#v4.3.0"),is_pwa:er(),...ei(t??{})})}},bt=(e,t=!1,i)=>{const o=e instanceof Error?e.message:e,s=e instanceof Error?e.stack:void 0;M("exception",{description:i?`[${i}] ${o}`:o,fatal:t,error_stack:s})};let wt=!1;const sr=e=>{bt(e.error||e.message,!1,"unhandled_error")},ar=e=>{bt(e.reason||"Unhandled Promise Rejection",!1,"unhandled_rejection")},ti=()=>{typeof window>"u"||wt||(window.addEventListener("error",sr),window.addEventListener("unhandledrejection",ar),wt=!0)},ni=()=>{typeof window>"u"||wt&&(window.removeEventListener("error",sr),window.removeEventListener("unhandledrejection",ar),wt=!1)};function oi(e){function t(l,g){return l>>>g|l<<32-g}const i=[],o=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],s=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],a=unescape(encodeURIComponent(e));for(let l=0;l<a.length;l++){const g=a.charCodeAt(l);i[l>>2]|=g<<24-l%4*8}const c=a.length;i[c>>2]|=128<<24-c%4*8;const u=(c+8>>6)+1;i[u*16-1]=c*8;for(let l=0;l<u;l++){const g=[];for(let S=0;S<16;S++)g[S]=i[l*16+S]||0;for(let S=16;S<64;S++){const P=t(g[S-15],7)^t(g[S-15],18)^g[S-15]>>>3,$=t(g[S-2],17)^t(g[S-2],19)^g[S-2]>>>10;g[S]=g[S-16]+P+g[S-7]+$|0}let b=o[0],h=o[1],x=o[2],k=o[3],p=o[4],y=o[5],_=o[6],L=o[7];for(let S=0;S<64;S++){const P=t(p,6)^t(p,11)^t(p,25),$=p&y^~p&_,z=L+P+$+s[S]+g[S]|0,D=t(b,2)^t(b,13)^t(b,22),I=b&h^b&x^h&x,w=D+I|0;L=_,_=y,y=p,p=k+z|0,k=x,x=h,h=b,b=z+w|0}o[0]=o[0]+b|0,o[1]=o[1]+h|0,o[2]=o[2]+x|0,o[3]=o[3]+k|0,o[4]=o[4]+p|0,o[5]=o[5]+y|0,o[6]=o[6]+_|0,o[7]=o[7]+L|0}let m="";for(let l=0;l<8;l++){const g=o[l];m+=(g>>>24&255).toString(16).padStart(2,"0"),m+=(g>>>16&255).toString(16).padStart(2,"0"),m+=(g>>>8&255).toString(16).padStart(2,"0"),m+=(g&255).toString(16).padStart(2,"0")}return m}function Zt(e,t){if(!e||typeof e!="object")return!1;const i=e;for(const o of t)if(i[o]===!0)return!0;for(const o of Object.keys(i))if(Zt(i[o],t))return!0;return!1}const At=e=>Math.round((e+Number.EPSILON)*100)/100,so=e=>{if(!e||typeof e!="object")return;const t=e.meta;if(!t||typeof t!="object")return;const i=t.zone;if(i){if(typeof i=="object"&&i!==null)return i.name;if(typeof i=="string")return i}};function ri(e,t,i,o){const s=fe.load(e)||{},a=fe.load(t)||{},c=s.outlines||{},u=Object.keys(c),m=u.filter(X=>!X.startsWith("_")).length,l=u.length,g=Object.keys(s.pcbs||{}).length,b=Object.keys(s.cases||{}).length,h=Zt(s.pcbs,["reversible","reverse"]),x=Zt(s.points,["mirror"]),k=s.meta||{},p=k.name??"no_name",y=k.author??"no_author",_=s.points||{},L=Object.keys(_.zones||{}).length,S=_.zones||{},$=Object.keys(S).filter(X=>{const B=S[X];return B&&typeof B=="object"&&("columns"in B||"rows"in B)}),z=$.length,D=z>0;let I="",w="",C="",A=0;const R=Object.keys(a);if(D){const X=[...$].sort(),B=[],W=[],T=[];for(const Z of X){const G=S[Z],v=Object.keys((G==null?void 0:G.columns)||{}),V=Object.keys((G==null?void 0:G.rows)||{}),H=(G==null?void 0:G.mirror)===!0||typeof(G==null?void 0:G.mirror)=="object"&&(G==null?void 0:G.mirror)!==null,Q=_.mirror===!0||typeof _.mirror=="object"&&_.mirror!==null,q=H||Q;let ie=R.filter(We=>{const de=a[We];if(so(de)!==Z)return!1;if(de&&typeof de=="object"){const ge=de.meta;if(ge&&typeof ge=="object"&&ge.mirrored===!0)return!1}return!We.startsWith("mirror_")}).length;q&&(ie*=2),B.push(v.length),W.push(V.length),T.push(ie),A+=ie}I=B.join(","),w=W.join(","),C=T.join(",")}const O=R.map(X=>{const B=a[X],W=so(B),Z=(W?$.includes(W):!1)?"K":"A",G=At((B==null?void 0:B.x)??0),v=At((B==null?void 0:B.y)??0),V=At((B==null?void 0:B.r)??0);return{name:X,type:Z,x:G,y:v,r:V}});O.sort((X,B)=>X.x!==B.x?X.x-B.x:X.y!==B.y?X.y-B.y:X.r!==B.r?X.r-B.r:X.name.localeCompare(B.name));const U=O.map(X=>`${X.type}${X.x.toString()};${X.y.toString()};${X.r.toString()}`).join("|"),F=`${p}|${y}|${U}`,Y=oi(F).substring(0,12),ne=!x&&h?A*2:A;return{total_generation_time_ms:i,count_outlines:m,count_raw_outlines:l,count_pcbs:g,count_cases:b,is_reversible:h,is_mirrored:x,count_zones:L,matrix_zones:z,has_matrix:D,matrix_col_counts:I,matrix_row_counts:w,matrix_key_counts:C,matrix_keys:A,keyboard_keys:ne,config_id:Y,previous_config_id:o}}const r={colors:{accent:"#28a745",accentDark:"#1e8e1e",accentDarker:"#1e7e34",accentSecondary:"#239923",background:"#222222",backgroundLight:"#2a2a2a",backgroundLighter:"#333333",border:"#3f3f3f",text:"#ffffff",textDark:"#ccc",textDarker:"#aaa",textDarkest:"#666",error:"#ff6d6d",errorDark:"#a31111",warning:"hsl(45, 100%, 90%)",warningDark:"hsl(32, 79%, 40%)",info:"hsl(206, 94%, 92%)",infoDark:"hsl(206, 100%, 30%)",success:"hsl(120, 73%, 92%)",successDark:"hsl(120, 50%, 35%)",white:"#fff",buttonHover:"#3f3f3f"},fonts:{body:"'Roboto', sans-serif",code:"source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"},fontSizes:{xs:"0.4rem",sm:"0.8rem",base:"1rem",lg:"1.2rem",iconMedium:"16px",iconLarge:"24px",bodySmall:"13px",h1:"2.5rem",h2:"2rem",h3:"1.5rem"},fontWeights:{regular:400,semiBold:600,bold:700},buttonSizes:{large:{padding:"1rem 2rem",fontSize:"1rem"},medium:{padding:"0.7rem 1.4rem",fontSize:"1rem"},small:{padding:"8px 12px",fontSize:"0.8rem"},icon:{padding:"8px 12px",fontSize:"0.4rem"}}},jt=d.button`
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
`,ii=d(jt)`
  padding: ${r.buttonSizes.medium.padding};
  font-size: ${r.buttonSizes.medium.fontSize};
`,si=d(jt)`
  padding: ${r.buttonSizes.small.padding};
  font-size: ${r.buttonSizes.small.fontSize};
`,ai=d(jt)`
  padding: ${r.buttonSizes.icon.padding};
  font-size: ${r.buttonSizes.icon.fontSize};
`,he=({size:e,...t})=>{switch(e){case"icon":return n.jsx(ai,{...t});case"sm":case"small":return n.jsx(si,{...t});case"md":case"medium":return n.jsx(ii,{...t});case"lg":case"large":default:return n.jsx(jt,{...t})}},li=e=>e.charAt(0).toUpperCase()+e.slice(1),$t=({injectionName:e,injectionType:t,onResolve:i,onCancel:o,"data-testid":s})=>{const[a,c]=f.useState(!1),u=li(t);return n.jsx(ci,{"data-testid":s,children:n.jsxs(di,{"data-testid":s&&`${s}-box`,children:[n.jsxs(ui,{children:[u," Conflict"]}),n.jsxs(pi,{children:["A ",t," with the name ",n.jsx("strong",{children:e})," ","already exists.",n.jsx("br",{}),"How would you like to resolve this conflict?"]}),n.jsxs(fi,{children:[n.jsx(hi,{type:"checkbox",id:"apply-to-all",checked:a,onChange:m=>c(m.target.checked),"data-testid":s&&`${s}-apply-to-all`,"aria-label":"Apply this choice to all conflicts"}),n.jsx(gi,{$checked:a,onClick:()=>c(!a),role:"checkbox","aria-checked":a}),n.jsx("label",{htmlFor:"apply-to-all",children:"Apply to all conflicts"})]}),n.jsxs(mi,{children:[n.jsx(he,{onClick:()=>i("skip",a),size:"medium","data-testid":s&&`${s}-skip`,"aria-label":`Skip this ${t}`,children:"Skip"}),n.jsx(he,{onClick:()=>i("overwrite",a),size:"medium","data-testid":s&&`${s}-overwrite`,"aria-label":`Overwrite existing ${t}`,children:"Overwrite"}),n.jsx(he,{onClick:()=>i("keep-both",a),size:"medium","data-testid":s&&`${s}-keep-both`,"aria-label":`Keep both ${t}s`,children:"Keep Both"})]}),n.jsx(bi,{onClick:o,size:"small","data-testid":s&&`${s}-cancel`,"aria-label":"Cancel loading",children:"Cancel"})]})})},ci=d.div`
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
`,di=d.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`,ui=d.h2`
  margin: 0 0 1rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
`,pi=d.p`
  margin: 0 0 1.5rem 0;
  font-size: ${r.fontSizes.base};
  color: ${r.colors.textDark};
  line-height: 1.5;

  strong {
    color: ${r.colors.accent};
  }
`,fi=d.div`
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
`,hi=d.input`
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
`,gi=d.div`
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
`,mi=d.div`
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  margin-bottom: 1rem;
`,bi=d(he)`
  width: 100%;
  background-color: ${r.colors.backgroundLighter};
  color: ${r.colors.textDark};

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`,Oe=e=>Array.isArray(e)&&e.length===3&&typeof e[0]=="string"&&typeof e[1]=="string"&&typeof e[2]=="string",lr=(e,t,i)=>!i||i.length===0?{hasConflict:!1}:i.some(s=>Oe(s)&&s[0]===e&&s[1]===t)?{hasConflict:!0,conflictingName:t}:{hasConflict:!1},wi=(e,t)=>{if(!t||t.length===0)return[];const i=[];for(const o of e){if(!Oe(o))continue;const[s,a]=o,c=lr(s,a,t);c.hasConflict&&i.push({injection:o,conflict:c})}return i},cr=(e,t,i)=>{if(!i||i.length===0)return t;const o=new Set(i.filter(c=>Oe(c)&&c[0]===e).map(c=>c[1]));let s=1,a=`${t}_${s}`;for(;o.has(a);)s++,a=`${t}_${s}`;return a},Rt=(e,t,i)=>{const o=t?[...t]:[];for(const s of e){if(!Oe(s)){console.warn("[mergeInjectionArraysWithResolution] Skipping invalid injection format:",s);continue}const[a,c,u]=s;if(!lr(a,c,o).hasConflict)o.push([a,c,u]);else{if(i==="skip")continue;if(i==="overwrite"){const l=o.findIndex(g=>Oe(g)&&g[0]===a&&g[1]===c);l!==-1&&(o[l]=[a,c,u])}else if(i==="keep-both"){const l=cr(a,c,o);o.push([a,l,u])}}}return o},Ct=e=>{const[t,i]=f.useState([]),o=t.length>0?t[0]:null,[s,a]=f.useState(null),[c,u]=f.useState(null),[m,l]=f.useState(null),g=f.useCallback(async(x,k,p=null,y)=>{var z,D,I;const _=y||e.getCurrentInjections();if(x.length===0){e.setInjectionInput(_),e.setConfigInput(k),await e.generateNow(k,_,{pointsonly:!1}),await((z=e.onComplete)==null?void 0:z.call(e,k,_));return}const L=x.filter(w=>Oe(w)?!0:(console.warn("[useInjectionConflictResolution] Skipping invalid injection format:",w),!1));if(L.length===0){e.setInjectionInput(_),e.setConfigInput(k),await e.generateNow(k,_,{pointsonly:!1}),await((D=e.onComplete)==null?void 0:D.call(e,k,_));return}const S=wi(L,_);if(S.length>0&&!p){const w=S.map(C=>({injection:C.injection,conflict:C.conflict}));M("conflict_encountered",{conflict_count:S.length}),i(w),a(L),u(k),l(_);return}const $=Rt(L,_,p||"skip");e.setInjectionInput($),e.setConfigInput(k),await e.generateNow(k,$,{pointsonly:!1}),await((I=e.onComplete)==null?void 0:I.call(e,k,$))},[e]),b=f.useCallback(async(x,k)=>{var p,y;if(!(!s||!c||t.length===0))if(k){M("conflict_resolved",{strategy:x,apply_to_all:!0,remaining_count:t.length});const _=Rt(s,m||e.getCurrentInjections(),x);e.setInjectionInput(_),e.setConfigInput(c),await e.generateNow(c,_,{pointsonly:!1}),await((p=e.onComplete)==null?void 0:p.call(e,c,_)),i([]),a(null),u(null),l(null)}else{M("conflict_resolved",{strategy:x,apply_to_all:!1,remaining_count:t.length});const _=t[0],[L,S]=_.injection,P=_.injection,$=t.slice(1);i($);let z=[...m||e.getCurrentInjections()],D=[...s||[]];if(x==="overwrite")z=z.filter(I=>!(I[0]===L&&I[1]===S));else if(x==="skip")D=D.filter(I=>!(I[0]===L&&I[1]===S&&I[2]===P[2]));else if(x==="keep-both"){const I=cr(L,S,z),w=[L,I,P[2]];z=[...z,w],D=D.filter(C=>!(C[0]===L&&C[1]===S&&C[2]===P[2]))}if(l(z),a(D),$.length===0){const I=Rt(D,z,"skip");e.setInjectionInput(I),e.setConfigInput(c),await e.generateNow(c,I,{pointsonly:!1}),await((y=e.onComplete)==null?void 0:y.call(e,c,I)),a(null),u(null),l(null)}}},[s,c,m,t,e]),h=f.useCallback(()=>{var x;M("conflict_cancelled",{remaining_count:t.length}),i([]),a(null),u(null),l(null),(x=e.setError)==null||x.call(e,"Loading cancelled by user")},[e,t.length]);return{currentConflict:o?{name:o.injection[1],type:o.injection[0]}:null,processInjectionsWithConflictResolution:g,handleConflictResolution:b,handleConflictCancel:h}},xi={templates:"4.3.0",outlines:"4.3.0"},Ze=()=>qe.version,ao=e=>{const t=e.split("-")[0].replace(/^v/,"").split(".");for(;t.length<3;)t.push("0");return t.length>3||!t.every(i=>/^\d+$/.test(i))?null:[Number(t[0]),Number(t[1]),Number(t[2])]},yi=(e,t)=>{const i=ao(e),o=ao(t);if(!i||!o)return!1;const[s,a,c]=i,[u,m,l]=o;return s===u&&(a>m||a===m&&c>=l)},ki=(e,t)=>{const i=Ue(t),o=Ue(xi[e]);return i!==null&&o!==null?Yt(i,o):!1},vi=()=>({templates:"",outlines:""}),ce=e=>{if(typeof window<"u"&&window.location)try{const o=new URLSearchParams(window.location.search).get(`ff_${e}`);if(o==="true")return!0;if(o==="false")return!1}catch(i){console.warn("[FeatureFlags] Failed to check URL query parameters:",i)}const t=vi()[e];return t==="true"?!0:t==="false"?!1:ki(e,Ze())},_i=50*1024*1024,ji=10*1024*1024,Nt=(e,t)=>{const i=`${t}/`;let o=e;return o.startsWith(i)&&(o=o.substring(i.length)),o=o.replace(/\.js$/,""),o},$i=e=>{let t=e.file("config.yaml")||e.file("config.yml");if(!t){const i=e.file(/^config\.(yaml|yml)$/i);i&&i.length>0&&(t=i[0])}if(!t)throw new Error("The archive is missing a config.yaml file in the root directory.");return t},Qt=(e,t)=>{if(t&&e>_i)throw new Error(`File exceeds the maximum size limit of 50MB for archives (current size: ${(e/(1024*1024)).toFixed(1)}MB).`);if(!t&&e>ji)throw new Error(`File exceeds the maximum size limit of 10MB for text files (current size: ${(e/(1024*1024)).toFixed(1)}MB).`)},dr=(e,t,i)=>{const o=[];return e.forEach(s=>o.push(["footprint",s.name,s.content])),t.forEach(s=>o.push(["outline",s.name,s.content])),i.forEach(s=>o.push(["template",s.name,s.content])),o},Ci=async e=>{let t;try{t=await Ye.loadAsync(e)}catch{throw new Error("The file appears to be corrupted. Please verify the file and try again.")}const o=await $i(t).async("string"),s=[],a=[];return t.forEach((c,u)=>{if(!(u.dir||!c.endsWith(".js"))){if(c.startsWith("footprints/")){const m=u.async("string").then(l=>{const g=Nt(c,"footprints");s.push({type:"footprint",name:g,content:l})});a.push(m)}else if(c.startsWith("outlines/")&&ce("outlines")){const m=u.async("string").then(l=>{const g=Nt(c,"outlines");s.push({type:"outline",name:g,content:l})});a.push(m)}else if(c.startsWith("templates/")&&ce("templates")){const m=u.async("string").then(l=>{const g=Nt(c,"templates");s.push({type:"template",name:g,content:l})});a.push(m)}}}),await Promise.all(a),{config:o,injections:s}},en="ergogen:config",pn="ergogen:multi-config",tn="LOCAL_STORAGE_CONFIG",lo=5e3,Si=40,Ei=3;class me extends Error{constructor(t){super(t),this.name="RateLimitError"}}class Pi{constructor(){this.providers=[]}register(t){this.providers.push(t)}resolve(t){const i=t.trim();for(const o of this.providers)if(o.canHandle(i))return o;return/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(i)&&this.providers[0]||null}}const Qe=new Pi,Ii=e=>{const t=[],i=e.split(`
`);let o={};for(const s of i){const a=s.trim();if(a.startsWith("[submodule"))o.path&&o.url&&t.push({path:o.path,url:o.url}),o={};else{const c=a.indexOf("=");if(c!==-1){const u=a.substring(0,c).trim(),m=a.substring(c+1).trim();u==="path"?o.path=m:u==="url"&&(o.url=m)}}}return o.path&&o.url&&t.push({path:o.path,url:o.url}),t};class et{async fetchConfig(t){console.log(`[GitHub] Starting fetch from URL: ${t}`);const i=this.parseUrl(t),{owner:o,repo:s,branch:a,filePath:c,isRepoRoot:u}=i,m=i.host,l=[],g=[],b=[],h=async(k,p,y,_,L)=>{console.log("[GitHub] Checking for .gitmodules file");try{const S=await this.fetchFileContent(o,s,".gitmodules",p,m);console.log("[GitHub] .gitmodules found, parsing submodules");const P=Ii(S);for(const $ of P)if($.path.includes(y)||$.path.includes(_)&&ce("outlines")||$.path.includes(L)&&ce("templates")){const z=$.path.includes(_),D=$.path.includes(L),I=z?_:D?L:y,w=z?g:D?b:l,C=$.path.substring($.path.indexOf(I)+I.length+1),A=Qe.resolve($.url);if(A instanceof et){const R=A.parseUrl($.url),O=R.host;let U=[];try{U=await A.fetchFootprintsFromDirectory(R.owner,R.repo,"","main",[".js"],O)}catch(te){if(te instanceof me)throw te;try{U=await A.fetchFootprintsFromDirectory(R.owner,R.repo,"","master",[".js"],O)}catch(Y){if(Y instanceof me)throw Y;console.warn(`Failed to fetch submodule footprints from ${$.url}`)}}const F=U.map(te=>({name:C?`${C}/${te.name}`:te.name,content:te.content}));w.push(...F)}}}catch(S){if(S instanceof me)throw S}};if(!u){if(!c)throw new Error("Invalid URL. File path not specified.");const k=await this.fetchFileContent(o,s,c,a,m);Qt(k.length,!1);const p=c.split("/").pop()||"";if(!(p==="config.yaml"||p==="config.yml"))return{config:k,footprints:[],outlines:[],templates:[],configPath:p};const _=c.substring(0,c.lastIndexOf("/")),L=_?`${_}/footprints`:"footprints",S=_?`${_}/outlines`:"outlines",P=_?`${_}/templates`:"templates";try{const $=await this.fetchFootprintsFromDirectory(o,s,L,a,[".js"],m);l.push(...$)}catch($){if($ instanceof me)throw $}if(ce("outlines"))try{const $=await this.fetchFootprintsFromDirectory(o,s,S,a,[".js",".svg"],m);g.push(...$)}catch($){if($ instanceof me)throw $}if(ce("templates"))try{const $=await this.fetchFootprintsFromDirectory(o,s,P,a,[".js"],m);b.push(...$)}catch($){if($ instanceof me)throw $}return await h(_,a,L,S,P),{config:k,footprints:l,outlines:g,templates:b,configPath:p}}const x=async k=>{var $,z,D,I,w,C,A,R,O,U,F,te;let p="",y="",_=!0;try{p=await this.fetchFileContent(o,s,"config.yaml",k,m),y=""}catch(Y){const ne=Y;if(($=ne.message)!=null&&$.includes("allowance")||(z=ne.message)!=null&&z.includes("limit exceeded")||(D=ne.message)!=null&&D.includes("rate limit"))throw ne;try{p=await this.fetchFileContent(o,s,"config.yml",k,m),y=""}catch(X){const B=X;if((I=B.message)!=null&&I.includes("allowance")||(w=B.message)!=null&&w.includes("limit exceeded")||(C=B.message)!=null&&C.includes("rate limit"))throw B;try{p=await this.fetchFileContent(o,s,"ergogen/config.yaml",k,m),y="ergogen"}catch(W){const T=W;if((A=T.message)!=null&&A.includes("allowance")||(R=T.message)!=null&&R.includes("limit exceeded")||(O=T.message)!=null&&O.includes("rate limit"))throw T;try{p=await this.fetchFileContent(o,s,"ergogen/config.yml",k,m),y="ergogen"}catch(Z){const G=Z;if((U=G.message)!=null&&U.includes("allowance")||(F=G.message)!=null&&F.includes("limit exceeded")||(te=G.message)!=null&&te.includes("rate limit"))throw G;const{configYamls:v,anyYamls:V}=await this.bfsForYamlFiles(o,s,k,m);if(v.length>0){const H=v[0];p=await this.fetchFileContent(o,s,H,k,m),y=H.includes("/")?H.substring(0,H.lastIndexOf("/")):""}else if(V.length>0){const H=V[0];p=await this.fetchFileContent(o,s,H,k,m),y=H.includes("/")?H.substring(0,H.lastIndexOf("/")):"",_=!1}else throw new Error("No YAML configuration files found in repository")}}}}if(Qt(p.length,!1),!_)return{config:p,footprints:[],outlines:[],templates:[],configPath:y};const L=y?`${y}/footprints`:"footprints",S=y?`${y}/outlines`:"outlines",P=y?`${y}/templates`:"templates";try{const Y=await this.fetchFootprintsFromDirectory(o,s,L,k,[".js"]);l.push(...Y)}catch(Y){if(Y instanceof me)throw Y}if(ce("outlines"))try{const Y=await this.fetchFootprintsFromDirectory(o,s,S,k,[".js",".svg"]);g.push(...Y)}catch(Y){if(Y instanceof me)throw Y}if(ce("templates"))try{const Y=await this.fetchFootprintsFromDirectory(o,s,P,k,[".js"]);b.push(...Y)}catch(Y){if(Y instanceof me)throw Y}return await h(y,k,L,S,P),{config:p,footprints:l,outlines:g,templates:b,configPath:y}};if(a!=="main")return await x(a);try{return await x("main")}catch(k){if(k instanceof me)throw k;return await x("master")}}async fetchFootprintsFromDirectory(t,i,o,s,a,c){const u=[],m=async l=>{try{const g=await this.listDirectory(t,i,l,s,c);for(const b of g){const h=b.path.startsWith(l)?b.path:l?`${l}/${b.path}`:b.path;if(b.type==="file"){if(a.some(k=>b.name.endsWith(k)))try{const k=await this.fetchFileContent(t,i,h,s,c),p=o?h.slice(o.length+1).replace(/\.[^/.]+$/,""):h.replace(/\.[^/.]+$/,"");console.log(`[GitHub] Loaded footprint: ${p}`),u.push({name:p,content:k})}catch(k){if(k instanceof me)throw k;const p=k;console.warn(`Failed to fetch file content: ${h}`,p.stack||p)}}else b.type==="dir"&&await m(h)}}catch(g){if(g instanceof me)throw g}};return await m(o),u}async bfsForYamlFiles(t,i,o,s){var g,b,h;const a=[],c=[],u=[{path:"",depth:0}],m=new Set;let l=0;for(;u.length>0&&l<Si;){const{path:x,depth:k}=u.shift();if(!m.has(x)){m.add(x);try{l++;const p=await this.listDirectory(t,i,x,o,s);for(const y of p)if(y.type==="file"){const _=y.name.toLowerCase();(_.endsWith(".yaml")||_.endsWith(".yml"))&&!_.startsWith(".")&&_.replace(/\.(yaml|yml)$/,"")!=="metadata"&&_.replace(/\.(yaml|yml)$/,"")!=="virtual_env"&&(y.name==="config.yaml"||y.name==="config.yml"?a.push(y.path):c.push(y.path))}else y.type==="dir"&&k<Ei&&(y.name.startsWith(".")||u.push({path:y.path,depth:k+1}));if(a.length>0||c.length>0&&(u.length===0||u[0].depth>k))break}catch(p){const y=p;if((g=y.message)!=null&&g.includes("allowance")||(b=y.message)!=null&&b.includes("limit exceeded")||(h=y.message)!=null&&h.includes("rate limit"))throw y;continue}}}return{configYamls:a,anyYamls:c}}}const Li=(e,t)=>{var u,m,l,g;if(!e)return{isLimitExceeded:!1,error:null};if(t.includes("raw.githubusercontent.com"))return e.status===429?(console.warn("[GitHub] Raw content rate limit exceeded (429). Please wait 30 minutes and try again."),{isLimitExceeded:!0,error:"You've reached your hourly request allowance for loading content from GitHub. Please wait 30 minutes and try again."}):{isLimitExceeded:!1,error:null};const o=((u=e.headers)==null?void 0:u.get("X-RateLimit-Limit"))||"unknown",s=((m=e.headers)==null?void 0:m.get("X-RateLimit-Remaining"))||"unknown",a=((l=e.headers)==null?void 0:l.get("X-RateLimit-Used"))||"unknown",c=((g=e.headers)==null?void 0:g.get("X-RateLimit-Reset"))||"unknown";if(console.log(`[GitHub Rate Limit] Limit: ${o}, Remaining: ${s}, Used: ${a}, Reset: ${c}`),e.status===403&&s==="0")return console.warn("[GitHub] Rate limit exceeded. Please wait and try again in about an hour."),{isLimitExceeded:!0,error:"Cannot load from GitHub right now. You've used your hourly request allowance. Please wait about an hour and try again."};if(s!=="unknown"&&o!=="unknown"){const b=parseInt(o),h=parseInt(s),x=(b-h)/b*100;if(x>=80&&h>0)return console.warn(`[GitHub] Approaching rate limit: ${x.toFixed(1)}% used`),{isLimitExceeded:!1,error:"Loading from GitHub may become unavailable soon. You've used most of your hourly request allowance. This will reset within an hour."}}return{isLimitExceeded:!1,error:null}};class zi extends et{constructor(){super(...arguments),this.rateLimitWarning=null}canHandle(t){const i=t.trim();return i.includes("github.com")||/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(i)}parseUrl(t){const i=t.trim();let o="",s="",a="main",c,u=!0;const m=!i.includes("github.com");if(m){const l=i.split("/").filter(Boolean);if(l.length<2)throw new Error("Invalid GitHub repository format. Must contain owner and repository.");o=l[0],s=l[1],u=l.length===2||l.length===4&&l[2]==="tree",u?l.length===4&&(a=l[3]):l[2]==="blob"||l[2]==="tree"?(a=l[3],c=l.slice(4).join("/")):c=l.slice(2).join("/")}else{let l=i;l.match(/^(https?:\/\/)/i)||(l=`https://${l}`);const g=l.endsWith("/")?l.slice(0,-1):l,h=new URL(g).pathname.split("/").filter(Boolean);if(h.length<2)throw new Error("Invalid GitHub URL. Must contain owner and repository.");o=h[0],s=h[1],u=h.length===2||h.length===4&&h[2]==="tree",u?h.length===4&&(a=h[3]):h[2]==="blob"||h[2]==="tree"?(a=h[3],c=h.slice(4).join("/")):c=h.slice(2).join("/")}return s.endsWith(".git")&&(s=s.slice(0,-4)),{owner:o,repo:s,branch:a,filePath:c,isRepoRoot:u,baseUrl:m?`https://github.com/${o}/${s}`:i}}async fetchFileContent(t,i,o,s){const a=`https://raw.githubusercontent.com/${t}/${i}/${s}/${o}`,c=await fetch(a);if(this.checkRateLimits(c,a),!c.ok)throw new Error(`Failed to fetch file content from GitHub: ${c.status}`);return await c.text()}async listDirectory(t,i,o,s){const a=`https://api.github.com/repos/${t}/${i}/contents/${o}?ref=${s}`,c=await fetch(a);if(this.checkRateLimits(c,a),!c.ok)throw new Error(`Failed to list directory from GitHub: ${c.status}`);const u=await c.json();let m=[];if(Array.isArray(u))m=u;else if(u&&typeof u=="object"&&"tree"in u&&Array.isArray(u.tree))m=u.tree;else throw new Error("Target path is not a directory");return m.map(l=>({name:l.name||l.path.split("/").pop()||"",path:l.path,type:l.type==="tree"?"dir":l.type==="blob"?"file":l.type}))}checkRateLimits(t,i){const o=Li(t,i);if(o.error&&!this.rateLimitWarning&&(this.rateLimitWarning=o.error),o.isLimitExceeded)throw new me(o.error||"Rate limit exceeded")}async fetchConfig(t){this.rateLimitWarning=null;const i=await super.fetchConfig(t);return this.rateLimitWarning&&(i.rateLimitWarning=this.rateLimitWarning),i}}Qe.register(new zi);const ur=async e=>{const t=Qe.resolve(e);if(!t)throw new Error(`Unsupported repository provider URL: ${e}`);return t.fetchConfig(e)};class Di extends et{canHandle(t){return t.includes("codeberg.org")}parseUrl(t){const i=t.trim();let o="",s="",a="main",c,u=!0;const m=!i.includes("codeberg.org");if(m){const l=i.split("/").filter(Boolean);if(l.length<2)throw new Error("Invalid Codeberg repository format. Must contain owner and repository.");o=l[0],s=l[1],u=l.length===2||l.length===5&&l[2]==="src"&&(l[3]==="branch"||l[3]==="commit"),u?l.length===5&&(a=l[4]):l.length>=5&&l[2]==="src"&&(l[3]==="branch"||l[3]==="commit")?(a=l[4],c=l.slice(5).join("/")):c=l.slice(2).join("/")}else{let l=i;l.match(/^(https?:\/\/)/i)||(l=`https://${l}`);const g=l.endsWith("/")?l.slice(0,-1):l,h=new URL(g).pathname.split("/").filter(Boolean);if(h.length<2)throw new Error("Invalid Codeberg URL. Must contain owner and repository name.");o=h[0],s=h[1],u=h.length===2||h.length===5&&h[2]==="src"&&(h[3]==="branch"||h[3]==="commit"),u?h.length===5&&(a=h[4]):h.length>=5&&h[2]==="src"&&(h[3]==="branch"||h[3]==="commit")?(a=h[4],c=h.slice(5).join("/")):c=h.slice(2).join("/")}return s.endsWith(".git")&&(s=s.slice(0,-4)),{owner:o,repo:s,branch:a,filePath:c,isRepoRoot:u,baseUrl:m?`https://codeberg.org/${o}/${s}`:i}}async fetchFileContent(t,i,o,s){const a=`https://codeberg.org/api/v1/repos/${t}/${i}/raw/${o}?ref=${s}`,c=await fetch(a);if(!c.ok)throw new Error(`Failed to fetch file content from Codeberg API: ${c.status}`);return await c.text()}async listDirectory(t,i,o,s){const a=o?`/${o}`:"",c=`https://codeberg.org/api/v1/repos/${t}/${i}/contents${a}?ref=${s}`,u=await fetch(c);if(!u.ok)throw new Error(`Failed to list directory from Codeberg API: ${u.status}`);const m=await u.json();if(!Array.isArray(m))throw new Error("Target path is not a directory");return m.map(l=>({name:l.name,path:l.path||l.name,type:l.type}))}}Qe.register(new Di);class Ai extends et{canHandle(t){const i=t.trim();return i.match(/^(https?:\/\/)/i)?!i.includes("github.com")&&!i.includes("codeberg.org"):!1}parseUrl(t){const i=t.trim();let o="",s="",a="main",c,u=!0,m=i;m.match(/^(https?:\/\/)/i)||(m=`https://${m}`);const l=m.endsWith("/")?m.slice(0,-1):m,g=new URL(l),b=g.origin,h=g.pathname.split("/").filter(Boolean);if(h.length<2)throw new Error("Invalid Forgejo/Gitea URL. Must contain owner and repository name.");return o=h[0],s=h[1],u=h.length===2||h.length===5&&h[2]==="src"&&(h[3]==="branch"||h[3]==="commit"),u?h.length===5&&(a=h[4]):h.length>=5&&h[2]==="src"&&(h[3]==="branch"||h[3]==="commit")?(a=h[4],c=h.slice(5).join("/")):c=h.slice(2).join("/"),s.endsWith(".git")&&(s=s.slice(0,-4)),{owner:o,repo:s,branch:a,filePath:c,isRepoRoot:u,baseUrl:i,host:b}}async fetchFileContent(t,i,o,s,a){const u=`${a||"https://codeberg.org"}/api/v1/repos/${t}/${i}/raw/${o}?ref=${s}`,m=await fetch(u);if(!m.ok)throw new Error(`Failed to fetch file content from Gitea/Forgejo API: ${m.status}`);return await m.text()}async listDirectory(t,i,o,s,a){const c=a||"https://codeberg.org",u=o?`/${o}`:"",m=`${c}/api/v1/repos/${t}/${i}/contents${u}?ref=${s}`,l=await fetch(m);if(!l.ok)throw new Error(`Failed to list directory from Gitea/Forgejo API: ${l.status}`);const g=await l.json();if(!Array.isArray(g))throw new Error("Target path is not a directory");return g.map(b=>({name:b.name,path:b.path||b.name,type:b.type}))}}const Ri=new Ai;Qe.register(Ri);const Ni=({processInjectionsWithConflictResolution:e,setError:t})=>{const[i,o]=f.useState(!1),s=f.useRef(!1);return f.useEffect(()=>{const a=async()=>{const c=new URLSearchParams(window.location.search),u=c.get("github"),m=c.get("codeberg"),l=c.get("forgejo"),g=c.get("gitea");let b=u||m||l||g;if(b){m&&!m.includes("codeberg.org")?b=`https://codeberg.org/${m}`:u&&!u.includes("github.com")&&(b=`https://github.com/${u}`),o(!0),console.log("[useConfigLoader] Loading from URL parameter:",b);try{const h=await ur(b);console.log("[useConfigLoader] Fetch result:",{configLength:h.config.length,footprintsCount:h.footprints.length,outlinesCount:h.outlines.length,configPath:h.configPath,rateLimitWarning:h.rateLimitWarning}),h.rateLimitWarning&&t(h.rateLimitWarning);const x=dr(h.footprints,h.outlines,h.templates);await e(x,h.config)}catch(h){console.error("[useConfigLoader] Failed to load from remote repository:",h),t(`Failed to load from remote repository: ${h instanceof Error?h.message:String(h)}`)}finally{o(!1)}}};s.current||(s.current=!0,a())},[e,t]),{isLoading:i}},co="background-preview-",Ui=()=>({version:0,active:null,settledVersion:null,settledRequestKey:null}),Oi=e=>!e||!e.startsWith(co)?null:e.slice(co.length),Wi=(e,t,i,o)=>JSON.stringify([e,t,i,o]),Fi=(e,t,i)=>{var s;return i?(((s=e.active)==null?void 0:s.requestKey)??e.settledRequestKey)===t:!1},Mi=(e,t)=>{e.version+=1;const o={requestId:`${t.isManual?"ergogen-manual":"ergogen-generate"}-${e.version}-${t.now??Date.now()}`,version:e.version,targetConfigId:t.targetConfigId,requestKey:t.requestKey,isManual:t.isManual};return e.active=o,e.settledVersion=null,e.settledRequestKey=null,o},Bi=(e,t)=>{const i=Oi(t.requestId);if(i!==null)return{kind:"background-preview",configId:i};if(!e.active||t.requestId!==e.active.requestId)return{kind:"stale"};const o=e.active;return e.active=null,t.type==="error"?(e.settledVersion=null,e.settledRequestKey=null,{kind:"active-error",isManual:o.isManual}):t.type==="success"?(e.settledVersion=o.version,e.settledRequestKey=o.requestKey,{kind:"active-success",version:o.version,targetConfigId:o.targetConfigId,isManual:o.isManual}):(e.settledVersion=null,e.settledRequestKey=null,{kind:"active-unknown",isManual:o.isManual})},Ti=(e,t)=>e.active===null&&e.settledVersion!==null&&t===e.settledVersion,Ut=e=>{e.active=null,e.settledVersion=null,e.settledRequestKey=null},uo=e=>{e.version+=1,e.active=null,e.settledVersion=null,e.settledRequestKey=null},Xe=(e,t)=>{const i=new Map;for(const o of t){const[s,a,c]=o;let u="footprints";s==="outline"?u="outlines":s==="template"&&(u="templates");const m=e.folder(u);if(m){const l=a.split("/"),g=l.pop();let b=m,h=u;for(const x of l){const k=`${h}/${x}`;let p=i.get(k);p||(p=b.folder(x)||b,i.set(k,p)),b=p,h=k}g&&b.file(`${g}.js`,c)}}},pr=async(e,t,i,o,s)=>{var g;const a=new Ye;a.file("config.yaml",t);const c=a.folder("outputs");if(c){if((g=e.demo)!=null&&g.svg&&c.file("demo.svg",e.demo.svg),e.outlines){let b=null;for(const[h,x]of Object.entries(e.outlines))(o||!h.startsWith("_"))&&(x.dxf||x.svg)&&(b||(b=c.folder("outlines")),b&&(x.dxf&&b.file(`${h}.dxf`,x.dxf),x.svg&&b.file(`${h}.svg`,x.svg)))}if(e.pcbs&&Object.keys(e.pcbs).length>0){const b=c.folder("pcbs");if(b)for(const[h,x]of Object.entries(e.pcbs)){const k=h.endsWith(".kicad_pcb")?h:`${h}.kicad_pcb`;b.file(k,x)}}if(e.cases){let b=null;for(const[h,x]of Object.entries(e.cases)){const k=!!x.jscad,p=s&&!!x.stl;(k||p)&&(b||(b=c.folder("cases")),b&&(x.jscad&&b.file(`${h}.jscad`,x.jscad),s&&x.stl&&b.file(`${h}.stl`,x.stl)))}}if(o){const b=c.folder("debug");if(b){b.file("raw.txt",t);for(const[h,x]of Object.entries(e))["canonical","points","units"].includes(h)&&b.file(`${h}.yaml`,JSON.stringify(x,null,2))}}}i&&i.length>0&&Xe(a,i);const u=await a.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),l=`ergogen-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Je.saveAs(u,l)},Gi=(e,t)=>new Promise((i,o)=>{const s=kt();if(!s){o(new Error("Failed to create Ergogen worker"));return}const a=setTimeout(()=>{s.terminate(),o(new Error("Compilation timed out"))},15e3);s.onmessage=u=>{const m=u.data;m.type==="error"?(clearTimeout(a),o(new Error(m.error)),s.terminate()):m.type==="success"&&(clearTimeout(a),i(m.results),s.terminate())},s.onerror=u=>{clearTimeout(a),o(u),s.terminate()};let c;try{c=JSON.parse(e)}catch{try{c=fe.load(e)}catch{c=e}}s.postMessage({type:"generate",inputConfig:c,injectionInput:t,requestId:`export-compile-${Date.now()}`,options:{debug:!0,svg:!0}})}),Vi=e=>new Promise(t=>{const i=cn();if(!i){t(e);return}const o=setTimeout(()=>{i.terminate(),t(e)},15e3);i.onmessage=s=>{const a=s.data;a.type==="success"&&a.results?(clearTimeout(o),t(a.results)):(clearTimeout(o),t(e)),i.terminate()},i.onerror=()=>{clearTimeout(o),t(e),i.terminate()},i.postMessage({type:"batch_jscad_to_stl",results:e,configVersion:0})}),Hi=async(e,t,i,o)=>{var m;const s=new Ye;for(const l of e){const g=l.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled",b=s.folder(g);if(b)try{const h=await Gi(l.config,t);let x=h;o&&h.cases&&Object.keys(h.cases).length>0&&(x=await Vi(h)),b.file("config.yaml",l.config);const k=b.folder("outputs");if(k){if((m=x.demo)!=null&&m.svg&&k.file("demo.svg",x.demo.svg),x.outlines){let p=null;for(const[y,_]of Object.entries(x.outlines))(i||!y.startsWith("_"))&&(_.dxf||_.svg)&&(p||(p=k.folder("outlines")),p&&(_.dxf&&p.file(`${y}.dxf`,_.dxf),_.svg&&p.file(`${y}.svg`,_.svg)))}if(x.pcbs&&Object.keys(x.pcbs).length>0){const p=k.folder("pcbs");if(p)for(const[y,_]of Object.entries(x.pcbs)){const L=y.endsWith(".kicad_pcb")?y:`${y}.kicad_pcb`;p.file(L,_)}}if(x.cases){let p=null;for(const[y,_]of Object.entries(x.cases)){const L=!!_.jscad,S=o&&!!_.stl;(L||S)&&(p||(p=k.folder("cases")),p&&(_.jscad&&p.file(`${y}.jscad`,_.jscad),o&&_.stl&&p.file(`${y}.stl`,_.stl)))}}if(i){const p=k.folder("debug");if(p){p.file("raw.txt",l.config);for(const[y,_]of Object.entries(x))["canonical","points","units"].includes(y)&&p.file(`${y}.yaml`,JSON.stringify(_,null,2))}}}t&&t.length>0&&Xe(b,t)}catch(h){console.error(`Failed to compile config ${l.name}:`,h),b.file("config.yaml",l.config),b.file("error.txt",`Compilation failed: ${h instanceof Error?h.message:String(h)}`)}}const a=await s.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),u=`ergogen-export-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Je.saveAs(a,u)},qi=async(e,t)=>{const i=new Ye,o=new Set;for(const u of e){const m=u.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled";let l=m,g=1;for(;o.has(l);)l=`${m}_${g}`,g++;o.add(l),i.file(`${l}.yaml`,u.config)}t&&t.length>0&&Xe(i,t);const s=await i.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),c=`ergogen-config-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Je.saveAs(s,c)},Ki=async(e,t,i,o,s,a,c)=>{const u=new Ye,m=new Set;if(s){for(let h=0;h<e.length;h++){if(c())return;const x=e[h];a(h,e.length,x.name);const k=x.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled";let p=k,y=1;for(;m.has(p);)p=`${k}_${y}`,y++;m.add(p),u.file(`${p}.yaml`,x.config)}if(t&&t.length>0){if(c())return;Xe(u,t)}if(c())return;a(e.length,e.length,"Creating ZIP...");const l=await u.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),b=`ergogen-config-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;return Je.saveAs(l,b),{succeededCount:e.length,failedCount:0}}else{const l=new Set,g=(L,S)=>new Promise((P,$)=>{if(c()){$(new Error("Aborted"));return}const z=kt();if(!z){$(new Error("Failed to create Ergogen worker"));return}l.add(z);const D=setTimeout(()=>{z.terminate(),l.delete(z),$(new Error("Compilation timed out"))},3e4);z.onmessage=w=>{const C=w.data;C.type==="error"?(clearTimeout(D),z.terminate(),l.delete(z),$(new Error(C.error))):C.type==="success"&&(clearTimeout(D),z.terminate(),l.delete(z),P(C.results))},z.onerror=w=>{clearTimeout(D),z.terminate(),l.delete(z),$(w)};let I;try{I=JSON.parse(L)}catch{try{I=fe.load(L)}catch{I=L}}z.postMessage({type:"generate",inputConfig:I,injectionInput:S,requestId:`export-compile-${Date.now()}`})}),b=L=>new Promise(S=>{if(c()||!L.cases||Object.keys(L.cases).length===0){S(L);return}const P=cn();if(!P){S(L);return}l.add(P);const $=setTimeout(()=>{P.terminate(),l.delete(P),S(L)},3e4);P.onmessage=z=>{const D=z.data;D.type==="success"?(clearTimeout($),P.terminate(),l.delete(P),S(D.results)):D.type==="error"&&(clearTimeout($),P.terminate(),l.delete(P),S(L))},P.onerror=()=>{clearTimeout($),P.terminate(),l.delete(P),S(L)},P.postMessage({type:"batch_jscad_to_stl",results:L,configVersion:0})}),h=new Set;let x=0,k=0,p=0;const y=Math.min(4,navigator.hardwareConcurrency||2),_=async L=>{var $;if(c())return;h.add(L.name),a(x,e.length,Array.from(h).join(", "));const S=L.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled",P=u.folder(S);if(!P){h.delete(L.name),x++,a(x,e.length,Array.from(h).join(", "));return}try{const z=await g(L.config,t);let D=z;if(z.cases&&Object.keys(z.cases).length>0&&(D=await b(z)),c())return;P.file("config.yaml",L.config);const I=P.folder("outputs");if(I){if(($=D.demo)!=null&&$.svg&&I.file("demo.svg",D.demo.svg),D.outlines){let w=null;for(const[C,A]of Object.entries(D.outlines))(i||!C.startsWith("_"))&&(A.dxf||A.svg)&&(w||(w=I.folder("outlines")),w&&(A.dxf&&w.file(`${C}.dxf`,A.dxf),A.svg&&w.file(`${C}.svg`,A.svg)))}if(D.pcbs&&Object.keys(D.pcbs).length>0){const w=I.folder("pcbs");if(w)for(const[C,A]of Object.entries(D.pcbs)){const R=C.endsWith(".kicad_pcb")?C:`${C}.kicad_pcb`;w.file(R,A)}}if(D.cases){let w=null;for(const[C,A]of Object.entries(D.cases)){const R=!!A.jscad,O=!!A.stl;(R||O)&&(w||(w=I.folder("cases")),w&&(A.jscad&&w.file(`${C}.jscad`,A.jscad),A.stl&&w.file(`${C}.stl`,A.stl)))}}if(i){const w=I.folder("debug");if(w){w.file("raw.txt",L.config);for(const[C,A]of Object.entries(D))["canonical","points","units"].includes(C)&&w.file(`${C}.yaml`,JSON.stringify(A,null,2))}}}t&&t.length>0&&Xe(P,t),k++}catch(z){p++,console.error(`Failed to compile config ${L.name}:`,z),P.file("config.yaml",L.config),P.file("error.txt",`Compilation failed: ${z instanceof Error?z.message:String(z)}`)}finally{h.delete(L.name),x++,a(x,e.length,Array.from(h).join(", "))}};try{const L=[...e],S=[],P=async()=>{if(c()||L.length===0)return;const I=L.shift();await _(I),await P()};for(let I=0;I<Math.min(y,L.length);I++)S.push(P());if(await Promise.all(S),c()){l.forEach(I=>I.terminate()),l.clear();return}a(e.length,e.length,"Creating ZIP...");const $=await u.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),D=`ergogen-export-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;return Je.saveAs($,D),{succeededCount:k,failedCount:p}}finally{l.forEach(L=>L.terminate()),l.clear()}}},Ji=e=>!e||!Array.isArray(e)?e:e.filter(t=>{if(!Array.isArray(t)||t.length!==3)return!0;const[i]=t;return!(i==="outline"&&!ce("outlines")||i==="template"&&!ce("templates"))}),Xi=e=>{if(!e||!Array.isArray(e))return null;const t=e.some(a=>Array.isArray(a)&&a[0]==="outline"),i=e.some(a=>Array.isArray(a)&&a[0]==="template"),o=t&&!ce("outlines"),s=i&&!ce("templates");if(o||s){const a=[];return o&&a.push("outlines"),s&&a.push("templates"),`Custom ${a.join(" and ")} were skipped because the respective feature flags are disabled in settings.`}return null},Yi=e=>{if(!e||typeof e!="object")return null;const t=e;if(!t.pcbs||typeof t.pcbs!="object")return null;const i=t.pcbs;for(const o of Object.values(i))if(o&&typeof o=="object"&&(!o.template||o.template==="kicad5")){const s=o.footprints;if(s&&typeof s=="object"){for(const a of Object.values(s))if(a&&typeof a=="object"&&typeof a.what=="string"&&a.what.startsWith("ceoloide"))return'KiCad 5 is deprecated. Please add "template: kicad8" to your PCB definitions to avoid errors when opening PCB files with KiCad 8 or newer.'}}return null},Zi=(e,t)=>{if(e&&typeof e=="object"){const i=e;return i.points&&t?{...i,pcbs:void 0,cases:void 0}:i}return e},Ve=(e,t)=>{if(typeof window>"u")return t;try{const i=localStorage.getItem(e);return i!==null?JSON.parse(i):t}catch{return t}},po=()=>({debug:Ve("ergogen:config:debug",!1),autoGen:Ve("ergogen:config:autoGen",!0),autoGen3D:Ve("ergogen:config:autoGen3D",!0),kicanvasPreview:Ve("ergogen:config:kicanvasPreview",!0),stlPreview:Ve("ergogen:config:stlPreview",!0),sendUsageMetrics:_t()}),fr=f.createContext(null),Re=()=>typeof window<"u"&&window.crypto&&window.crypto.randomUUID?window.crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,e=>{const t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)}),st=(e,t)=>{let i=0;for(const o of e){const s=o.name.match(t);if(s){const a=parseInt(s[1],10);!isNaN(a)&&a>i&&(i=a)}}return i+1},xt="ergogen:deleted-config",Qi=e=>{try{const t=localStorage.getItem(xt),i={version:1,configs:[]};if(t){const s=JSON.parse(t);s&&Array.isArray(s.configs)&&(i.configs=s.configs,s.version!==void 0&&(i.version=s.version))}const o={...e,deletedAt:new Date().toISOString()};i.configs.push(o),localStorage.setItem(xt,JSON.stringify(i))}catch(t){console.error("Failed to save deleted config to storage:",t)}},fo=()=>{try{const e=localStorage.getItem(xt);if(!e)return;const t=JSON.parse(e);if(!t||!Array.isArray(t.configs))return;let i=t.configs;const o=Date.now(),s=90*24*60*60*1e3;i=i.filter(c=>{const u=new Date(c.deletedAt).getTime();return o-u<=s}),i.length>100&&(i.sort((c,u)=>{const m=new Date(c.updatedAt).getTime(),l=new Date(u.updatedAt).getTime();return m-l}),i=i.slice(i.length-100));const a={version:t.version||1,configs:i};localStorage.setItem(xt,JSON.stringify(a))}catch(e){console.error("Failed to prune deleted configs:",e)}},ho=e=>{if(!e)return;let t="";if(typeof e=="string")t=e;else if(Array.isArray(e))t=e.join("");else return;return t=t.replace(/width="[^"]+"/,'width="284px"').replace(/height="[^"]+"/,'height="134px"'),t=t.replace(/<svg/,'<svg style="background-color: rgb(51,51,51);"'),t=t.replaceAll(/stroke="#000"/g,'stroke="#AAA"'),t=t.replaceAll(/stroke:#000/g,"stroke:#AAA"),t},es=()=>{if(typeof window>"u")return{version:2,activeConfigId:null,configs:[]};const e=localStorage.getItem(pn);if(e)try{const t=JSON.parse(e);if(t&&typeof t.version=="number"){const i=new Date().toISOString(),o=(t.configs||[]).map(s=>({...s,createdAt:s.createdAt||i,updatedAt:s.updatedAt||i}));return{...t,configs:o}}}catch(t){console.error("Failed to parse multi-config storage:",t)}return{version:2,activeConfigId:null,configs:[]}},pe=(e,t,i=2)=>{if(typeof window>"u")return;const o={version:i,activeConfigId:t,configs:e};localStorage.setItem(pn,JSON.stringify(o))},ts=()=>{const e=es();if(typeof window>"u")return e;const t=localStorage.getItem(tn),i=localStorage.getItem(en);let o="";if(t)try{o=JSON.parse(t)}catch{o=t}else if(i)try{o=JSON.parse(i)}catch{o=i}if(o&&o.trim()!==""){if(!e.configs.some(a=>a.name==="Legacy Config")){const a=Re(),c={id:a,name:"Legacy Config",config:o,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};e.configs.push(c),e.activeConfigId=a,pe(e.configs,a,2)}localStorage.removeItem(tn),localStorage.removeItem(en)}return e},ns=({initialInjectionInput:e,hashError:t,children:i})=>{const[o]=f.useState(()=>{if(typeof window>"u")return!1;const j=localStorage.getItem(tn),E=localStorage.getItem(en);return!!(j||E)}),[s]=f.useState(()=>{if(typeof window>"u")return 2;const j=localStorage.getItem(pn);if(j)try{const E=JSON.parse(j);if(E&&typeof E.version=="number")return E.version}catch(E){console.warn("Failed to parse loaded version:",E)}return 1}),[a]=f.useState(()=>ts()),[c,u]=f.useState(()=>a.configs),[m,l]=f.useState(()=>a.activeConfigId),[g,b]=f.useState(!1),[h,x]=f.useState(null),[k,p]=f.useState(()=>{if(a.activeConfigId){const j=a.configs.find(E=>E.id===a.activeConfigId);return j?j.config:""}return""}),y=f.useRef(c),_=f.useRef(m),L=f.useRef(g),S=f.useRef(h),P=f.useRef(k);f.useEffect(()=>{y.current=c},[c]),f.useEffect(()=>{_.current=m},[m]),f.useEffect(()=>{L.current=g},[g]),f.useEffect(()=>{S.current=h},[h]),f.useEffect(()=>{P.current=k},[k]);const $=f.useRef(k);f.useEffect(()=>{$.current=k},[k]);const z=f.useCallback(j=>{$.current=j},[]),D=f.useCallback(()=>$.current,[]),I=f.useRef(void 0),w=f.useRef(null),C=f.useRef(null),A=f.useCallback(()=>{C.current&&(clearTimeout(C.current.timeoutId),C.current=null)},[]),R=f.useCallback(()=>{const j=C.current;j&&(A(),M(j.name,j.payload))},[A]),O=f.useCallback(()=>{if(R(),w.current){const{timeoutId:j,payload:E,configId:N}=w.current;clearTimeout(j),M("keyboard_generated",E),I.current=N,w.current=null}},[R]),U=f.useCallback(()=>{I.current=void 0,R(),w.current&&(clearTimeout(w.current.timeoutId),w.current=null)},[R]),[F,te]=no("ergogen:injection",e),[Y,ne]=f.useState(null),[X,B]=f.useState(null),[W,T]=f.useState(null),[Z,G]=f.useState(null),[v,V]=f.useState(null),[H,Q]=f.useState(0),q=f.useRef(Ui()),se=f.useCallback(()=>{uo(q.current),V(null),ae(!1),xe(!1)},[]),[ie,We]=no("ergogen:settings",po()),de=(ie==null?void 0:ie.debug)??!1,ke=(ie==null?void 0:ie.autoGen)??!0,ge=(ie==null?void 0:ie.autoGen3D)??!0,Fe=(ie==null?void 0:ie.kicanvasPreview)??!0,je=(ie==null?void 0:ie.stlPreview)??!0,fn=f.useRef(je);fn.current=je;const[Ce,$r]=f.useState(_t),Et=f.useRef(ie);Et.current=ie;const hn=f.useRef(ke);hn.current=ke;const Pt=f.useRef(Ce);Pt.current=Ce;const be=f.useCallback(j=>{const E=Et.current||po(),N=j(E);Et.current=N,We(N)},[We]),gn=f.useCallback(j=>{be(E=>{const N=typeof j=="function"?j(E.debug):j;return{...E,debug:N}})},[be]),mn=f.useCallback(j=>{be(E=>{const N=typeof j=="function"?j(E.autoGen):j;return{...E,autoGen:N}})},[be]),bn=f.useCallback(j=>{be(E=>{const N=typeof j=="function"?j(E.autoGen3D):j;return{...E,autoGen3D:N}})},[be]),wn=f.useCallback(j=>{be(E=>{const N=typeof j=="function"?j(E.kicanvasPreview):j;return{...E,kicanvasPreview:N}})},[be]),xn=f.useCallback(j=>{be(E=>{const N=typeof j=="function"?j(E.stlPreview):j;return{...E,stlPreview:N}})},[be]),Me=f.useCallback((j,E,N)=>{if(A(),N||!hn.current){M(j,E);return}const K=setTimeout(()=>{C.current=null,M(j,E)},lo);C.current={name:j,payload:E,timeoutId:K}},[A]),yn=f.useCallback(j=>{const E=typeof j=="function"?j(Pt.current):j;Pt.current=E,qr(E),$r(E),be(N=>({...N,sendUsageMetrics:E}))},[be]);f.useEffect(()=>{rr()},[Ce]);const[Se,kn]=f.useState(!1),[vn,Cr]=f.useState(!1),[_n,jn]=f.useState(!1),[$n,Cn]=f.useState(!0),[Sn,En]=f.useState(!0),[Pn,ae]=f.useState(!1),[In,tt]=f.useState(!1),we=f.useRef(null),Pe=f.useRef(null),[Ln,xe]=f.useState(!1),zn=f.useRef(!0),It=f.useRef(null);f.useEffect(()=>{fo()},[]),f.useEffect(()=>{t&&ne(t)},[t]);const Dn=f.useCallback(()=>ne(null),[]),An=f.useCallback(()=>B(null),[]),Rn=f.useCallback(()=>T(null),[]),Nn=f.useCallback(()=>G(null),[]),Un=f.useCallback(j=>{var K,oe,J,re,ue,ve;const E=j.data,N=Bi(q.current,E);if(N.kind==="background-preview"){const ee=N.configId;if(E.type==="success"&&E.results){const ye=E.results,ze=((oe=(K=ye.outlines)==null?void 0:K.preview)==null?void 0:oe.svg)||((J=ye.demo)==null?void 0:J.svg),Be=ho(ze);Be&&u(it=>{const Te=it.map(le=>le.id===ee?{...le,previewSvg:Be}:le);return pe(Te,_.current,2),Te})}else E.type==="error"&&console.warn(`Background generation failed for config ${ee}:`,E.error);return}if(N.kind!=="stale"){if(N.kind==="active-error"){const ee=E.type==="error"&&E.error||"Unknown worker error";console.error("--- Ergogen worker error:",ee),ne(ee),ae(!1),xe(!1),Me("generation_failed",{error_message:ee,stored_configs_count:y.current.length,trigger:N.isManual?"manual":"auto"},N.isManual);return}if(N.kind==="active-success")if(E.type==="success"&&E.warnings&&E.warnings.length>0&&B(ee=>(ee?ee+`
`:"")+E.warnings.join(`
`)),E.type==="success"&&E.results){const ee=E.results,ye=It.current?performance.now()-It.current:0;Me("generation_completed",{duration_ms:Math.round(ye),points_count:ee.points?Object.keys(ee.points).length:0,pcbs_count:ee.pcbs?Object.keys(ee.pcbs).length:0,cases_count:ee.cases?Object.keys(ee.cases).length:0,has_outlines:!!ee.outlines,stored_configs_count:y.current.length,trigger:N.isManual?"manual":"auto"},N.isManual);try{const le=fe.dump(ee.canonical||{}),Ee=fe.dump(ee.points||{}),$e=ri(le,Ee,Math.round(ye),I.current);if($e.config_id!==I.current){w.current&&clearTimeout(w.current.timeoutId);const zr=setTimeout(()=>{M("keyboard_generated",$e),I.current=$e.config_id,w.current=null},lo);w.current={timeoutId:zr,payload:$e,configId:$e.config_id}}}catch(le){console.error("Failed to generate keyboard configuration analytics:",le)}const ze=((ue=(re=ee.outlines)==null?void 0:re.preview)==null?void 0:ue.svg)||((ve=ee.demo)==null?void 0:ve.svg),Be=ho(ze),it=N.targetConfigId;Be&&it&&u(le=>{const Ee=le.map($e=>$e.id===it?{...$e,previewSvg:Be}:$e);return pe(Ee,_.current,2),Ee});let Te=!1;if(fn.current&&ee.cases&&Object.keys(ee.cases).length>0){for(const le of Object.keys(ee.cases)){const Ee=ee.cases[le];Ee!=null&&Ee.jscad&&(ee.cases[le].stl=void 0)}if(Pe.current){Te=!0,xe(!0);const le={type:"batch_jscad_to_stl",results:ee,configVersion:N.version};Pe.current.postMessage(le)}}V(ee),Q(le=>le+1),Te||ae(!1)}else ae(!1);else ae(!1),xe(!1)}},[Me]),On=f.useRef(Un);On.current=Un;const Wn=f.useCallback(j=>{const E=j.data;Ti(q.current,E.configVersion)&&(E.type==="error"?(console.error("--- JSCAD worker error:",E.error),xe(!1),ae(!1)):E.type==="success"&&E.results&&(V(E.results),Q(N=>N+1),xe(!1),ae(!1)))},[]),Fn=f.useRef(Wn);Fn.current=Wn;const nt=f.useCallback(()=>{we.current&&(we.current.terminate(),we.current=null,tt(!1));const j=kt();return j?(j.onmessage=E=>On.current(E),j.onerror=E=>{console.error("Ergogen worker error:",E);const N=E.message||"Ergogen worker error";Ut(q.current),ne(N),ae(!1),xe(!1),bt(E.message||"Worker crash",!1,"ergogen_worker")},we.current=j,tt(!0)):(tt(!1),console.warn("Failed to initialize Ergogen worker.")),j},[]);f.useEffect(()=>{if(we.current||nt(),!Pe.current){const j=cn();j?(j.onmessage=E=>Fn.current(E),j.onerror=E=>{console.error("JSCAD worker error:",E),xe(!1),ae(!1),bt(E.message||"Worker crash",!1,"jscad_worker")},Pe.current=j):console.warn("Failed to initialize JSCAD worker.")}return()=>{we.current&&(we.current.terminate(),we.current=null,tt(!1)),Pe.current&&(Pe.current.terminate(),Pe.current=null)}},[nt]),f.useEffect(()=>{const j=()=>{document.visibilityState==="hidden"&&O()};return window.addEventListener("visibilitychange",j),window.addEventListener("pagehide",O),()=>{window.removeEventListener("visibilitychange",j),window.removeEventListener("pagehide",O),O()}},[O]);const Lt=f.useRef({debug:de,autoGen:ke,autoGen3D:ge,kicanvasPreview:Fe,stlPreview:je,sendUsageMetrics:Ce});f.useEffect(()=>{const j={debug:de,autoGen:ke,autoGen3D:ge,kicanvasPreview:Fe,stlPreview:je,sendUsageMetrics:Ce},{sendUsageMetrics:E,...N}=j;if(zn.current)zn.current=!1,Lt.current=j,M("settings_loaded",{...N});else{const K=Lt.current,oe=Object.keys(j).find(J=>j[J]!==K[J]);Lt.current=j,M("setting_changed",{...oe?{setting_name:oe,setting_value:j[oe]}:{},...N})}},[de,ke,ge,Fe,je,Ce]);const Mn=f.useCallback(j=>{let E="UNKNOWN",N=null;try{N=JSON.parse(j),E="json"}catch{}try{N=fe.load(j),E="yaml"}catch{}return[E,N]},[]),ot=f.useCallback(async(j,E,N={pointsonly:!0})=>{const K=j===void 0||j===P.current?$.current??P.current:j;if(!K)return;const oe=Ji(E),J=Wi(K,oe,!!N.pointsonly,de);if(Fi(q.current,J,N.skipIfCurrent))return;const[,re]=Mn(K);ne(null),B(null),T(null),ae(!0),It.current=performance.now();const ue=Yi(re);ue&&B(ue);const ve=Xi(E);ve&&T(ve);const ee=Zi(re,N.pointsonly)||K;try{if(!we.current){console.error("Worker not available for processing request."),Ut(q.current),ae(!1),xe(!1),ne("Worker not available for processing request.");return}const ye=Mi(q.current,{requestKey:J,targetConfigId:_.current,isManual:!!N.isManual});we.current.postMessage({type:"generate",inputConfig:ee,injectionInput:oe,requestId:ye.requestId,options:{debug:de,svg:!0}})}catch(ye){Ut(q.current),ae(!1),xe(!1);const ze=typeof ye=="string"?ye:String(ye);ne(ze),Me("generation_failed",{error_message:ze,stored_configs_count:y.current.length,trigger:N.isManual?"manual":"auto"},!!N.isManual);return}},[Mn,ne,B,T,ae,de,Me]),Le=f.useMemo(()=>Vo((j,E,N={pointsonly:!0})=>ot(j,E,{...N,skipIfCurrent:!0}),300),[ot]),Ie=f.useCallback(async(j,E,N={pointsonly:!0})=>{Le.cancel(),await ot(j,E,N)},[Le,ot]),rt=f.useCallback(j=>{const E=P.current,N=typeof j=="function"?j(E):j;if(N!==E)if(p(N),L.current){if(N!==S.current){const oe=`Shared Config ${st(y.current,/^Shared\s+Config\s+(\d+)$/)}`,J=Re(),re=new Date().toISOString(),ue={id:J,name:oe,config:N||"",createdAt:re,updatedAt:re},ve=[...y.current,ue];u(ve),l(J),b(!1),x(null),pe(ve,J)}}else{const K=_.current;if(K){const oe=y.current.map(J=>J.id===K?{...J,config:N||"",updatedAt:new Date().toISOString()}:J);u(oe),pe(oe,K)}else{const J=`Untitled ${st(y.current,/^Untitled\s+(\d+)$/)}`,re=Re(),ue=new Date().toISOString(),ve={id:re,name:J,config:N||"",createdAt:ue,updatedAt:ue},ee=[...y.current,ve];u(ee),l(re),pe(ee,re)}}},[]),Bn=f.useCallback(j=>{if(U(),se(),j===null)l(null),_.current=null,b(!1),x(null),p(""),P.current="",pe(y.current,null);else{const E=y.current.find(N=>N.id===j);E&&(l(j),_.current=j,b(!1),x(null),p(E.config),P.current=E.config,pe(y.current,j),M("config_selected",{stored_configs_count:y.current.length}))}},[U,se]),Tn=f.useCallback((j,E)=>{U(),se();const N=st(y.current,/^Untitled\s+(\d+)$/),K=E||`Untitled ${N}`,oe=Re(),J=new Date().toISOString(),re={id:oe,name:K,config:j,createdAt:J,updatedAt:J},ue=[...y.current,re];return u(ue),l(oe),b(!1),x(null),p(j),M("config_created",{stored_configs_count:ue.length}),y.current=ue,_.current=oe,P.current=j,pe(ue,oe),oe},[U,se]),Gn=f.useCallback((j,E)=>{const N=E.trim();if(!N)return ne("Configuration name cannot be empty"),!1;const K=y.current.find(re=>re.id===j);if(!K)return!1;if(K.name===N)return!0;if(y.current.some(re=>re.id!==j&&re.name.trim().toLowerCase()===N.toLowerCase()))return ne(`A configuration named "${N}" already exists.`),!1;const J=y.current.map(re=>re.id===j?{...re,name:N,updatedAt:new Date().toISOString()}:re);return u(J),y.current=J,pe(J,_.current),M("config_renamed",{stored_configs_count:J.length}),!0},[ne]),Vn=f.useCallback(j=>{U(),se();const E=y.current.find(N=>N.id===j);if(E){const N=Re(),K=new Date().toISOString(),oe={id:N,name:`${E.name} (Copy)`,config:E.config,createdAt:K,updatedAt:K},J=[...y.current,oe];u(J),l(N),b(!1),x(null),p(E.config),y.current=J,_.current=N,P.current=E.config,pe(J,N),M("config_duplicated",{stored_configs_count:J.length})}},[U,se]),Hn=f.useCallback(j=>{U();const E=_.current,N=y.current.find(re=>re.id===j),K=y.current.filter(re=>re.id!==j);u(K),y.current=K;const oe=E===j;K.length===0||oe?(se(),l(null),_.current=null,p(""),P.current="",pe(K,null)):pe(K,E),N&&Qi(N),M("config_deleted",{stored_configs_count:K.length})},[U,se]),qn=f.useCallback(j=>{U(),se(),b(!0),x(j),p(j)},[U,se]),Kn=f.useCallback(()=>{if(!L.current)return;const E=`Shared Config ${st(y.current,/^Shared\s+Config\s+(\d+)$/)}`,N=Re(),K=new Date().toISOString(),oe={id:N,name:E,config:P.current||"",createdAt:K,updatedAt:K},J=[...y.current,oe];u(J),y.current=J,l(N),_.current=N,b(!1),x(null),pe(J,N)},[]),Jn=f.useCallback(()=>{fo()},[]),Xn=f.useCallback(async()=>{await Hi(y.current,F,de,je)},[F,de,je]),Yn=f.useCallback(async()=>{await qi(y.current,F)},[F]),Zn=f.useMemo(()=>{if(g)return"Shared Config";if(m){const j=c.find(E=>E.id===m);return j?j.name:""}return""},[g,m,c]),Sr=f.useMemo(()=>({setInjectionInput:te,setConfigInput:rt,generateNow:Ie,getCurrentInjections:()=>F||[],setError:ne}),[F,Ie,te,rt,ne]),{currentConflict:zt,processInjectionsWithConflictResolution:Er,handleConflictResolution:Pr,handleConflictCancel:Ir}=Ct(Sr),{isLoading:Qn}=Ni({processInjectionsWithConflictResolution:Er,setError:ne}),eo=f.useRef(null);f.useEffect(()=>{if(t||Qn)return;!new URLSearchParams(window.location.search).get("github")&&k&&(eo.current=_.current,Ie(k,F,{pointsonly:!1}))},[Qn]);const to=f.useRef(Se);f.useEffect(()=>{to.current&&!Se&&(uo(q.current),ae(!1),xe(!1),nt(),k&&Ie(k,F,{pointsonly:!ge})),to.current=Se},[Se,k,F,ge,Ie,nt]),f.useEffect(()=>{localStorage.setItem("ergogen:injection",JSON.stringify(F)),ke&&!Se&&Le(k,F,{pointsonly:!ge})},[k,F,ke,ge,Se,Le]),f.useEffect(()=>{In&&(s===1||o)&&(console.log("Version 1 or legacy configuration detected on load. Triggering background preview generation for all configs missing a preview SVG..."),pe(y.current,_.current,2),y.current.forEach(j=>{var E;!j.previewSvg&&j.id!==eo.current&&(console.log(`Triggering background preview generation for: ${j.name}`),(E=we.current)==null||E.postMessage({type:"generate",inputConfig:j.config,requestId:`background-preview-${j.id}`,options:{debug:!0,svg:!0}}))}))},[In,s,o]);const Lr=f.useMemo(()=>({configInput:k,getRealtimeConfigInput:D,updateRealtimeConfigInput:z,setConfigInput:rt,configs:c,activeConfigId:m,activeConfigName:Zn,isPreview:g,selectConfig:Bn,createNewConfig:Tn,renameConfig:Gn,duplicateConfig:Vn,deleteConfig:Hn,exportAllConfigs:Xn,downloadAllConfigs:Yn,loadPreview:qn,savePreviewConfig:Kn,pruneDeletedConfigs:Jn,injectionInput:F,setInjectionInput:te,processInput:Le,generateNow:Ie,error:Y,setError:ne,clearError:Dn,deprecationWarning:X,clearWarning:An,skippedWarning:W,clearSkippedWarning:Rn,info:Z,setInfo:G,clearInfo:Nn,results:v,resultsVersion:H,setResultsVersion:Q,showSettings:Se,setShowSettings:kn,isBulkDownloadOpen:vn,setIsBulkDownloadOpen:Cr,showSideNav:_n,setShowSideNav:jn,showConfig:$n,setShowConfig:Cn,showDownloads:Sn,setShowDownloads:En,debug:de,setDebug:gn,autoGen:ke,setAutoGen:mn,autoGen3D:ge,setAutoGen3D:bn,kicanvasPreview:Fe,setKicanvasPreview:wn,stlPreview:je,setStlPreview:xn,sendUsageMetrics:Ce,setSendUsageMetrics:yn,isGenerating:Pn,setIsGenerating:ae,isJscadConverting:Ln}),[k,D,z,rt,c,m,Zn,g,Bn,Tn,Gn,Vn,Hn,Xn,Yn,vn,qn,Kn,Jn,F,te,Le,Ie,Y,ne,Dn,X,An,W,Rn,Z,G,Nn,v,H,Q,Se,kn,_n,jn,$n,Cn,Sn,En,de,gn,ke,mn,ge,bn,Fe,wn,je,xn,Ce,yn,Pn,ae,Ln]);return n.jsxs(fr.Provider,{value:Lr,children:[i,zt&&n.jsx($t,{injectionName:zt.name,injectionType:zt.type,onResolve:Pr,onCancel:Ir,"data-testid":"conflict-resolution-dialog"})]})},_e=()=>f.useContext(fr),os=({className:e,options:t,"data-testid":i,"aria-label":o})=>{const s=_e(),a=f.useRef(null),c={configInput:void 0,setConfigInput:y=>{},updateRealtimeConfigInput:y=>{},injectionInput:void 0,generateNow:async()=>{},activeConfigId:null},{configInput:u,updateRealtimeConfigInput:m,setConfigInput:l,injectionInput:g,generateNow:b,activeConfigId:h}=s??c,x=f.useRef(Vo(y=>{l(y)},500)).current;f.useEffect(()=>()=>{x.cancel()},[x]),f.useEffect(()=>{if(a.current){if(a.current.hasTextFocus())return;const y=a.current.getValue();u!==void 0&&u!==y&&a.current.setValue(u)}},[u]);const k=f.useCallback(y=>{y!==void 0&&(m(y),x(y))},[x,m]),p=(y,_)=>{a.current=y,y.onDidBlurEditorText(()=>{x.flush()}),y.addAction({id:"generate-config",label:"Generate",keybindings:[_.KeyMod.CtrlCmd|_.KeyCode.Enter],run:()=>{const L=y.getValue();x.cancel(),m(L),l(L),b(L,g,{pointsonly:!1,isManual:!0})}})};return s?n.jsx("div",{className:e,"data-testid":i,"aria-label":o,children:n.jsx(Ho,{height:"100%",defaultLanguage:"yaml",language:"yaml",onChange:k,onMount:p,defaultValue:u,theme:"ergogen-theme",options:t||void 0},h||"preview")}):null},rs=({className:e,options:t,injection:i,setInjection:o,"data-testid":s,"aria-label":a})=>{const c=_e(),u=async m=>{if(!m)return null;const l={...i,content:m};o(l)};return c?n.jsx(is,{className:e,"data-testid":s,"aria-label":a,children:n.jsx(Ho,{height:"100%",defaultLanguage:"javascript",language:"javascript",onChange:u,value:i.content,theme:"ergogen-theme",options:t||void 0})}):null},is=d.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: 0.5rem;
`,ss=yt`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,as=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;

  @media (max-width: 639px) {
    padding-bottom: 0.75rem;
  }
`,ls=d.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${r.fontSizes.bodySmall};
  cursor: ${e=>e.$hasPreview?"pointer":"default"};
  border-bottom: ${e=>e.$active?`2px solid ${r.colors.accent}`:"2px solid transparent"};
  border-top: 2px solid transparent;
  opacity: ${e=>e.$disabled?.5:1};
  color: ${e=>e.$disabled?r.colors.textDarker:r.colors.white};
`,cs=d.div`
  white-space: nowrap;
  display: flex;
  gap: 10px;
  align-items: center;
`,ds=d.a`
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
`,us=d.a`
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
    animation: ${ss} 1s linear infinite;
  }
`,ps=({fileName:e,extension:t,content:i,preview:o,setPreview:s,previewKey:a,"data-testid":c})=>{const u=t==="stl"&&!i||t==="kicad_pcb"&&!o,m=t==="stl"&&!i,l=()=>{if(m)return;M("download_button_clicked",{download_type:t,source:"downloads_panel"});const h=document.createElement("a"),x=new Blob([i],{type:"octet/stream"}),k=URL.createObjectURL(x);h.href=k,h.download=`${e}.${t}`,document.body.appendChild(h);try{h.click()}finally{document.body.removeChild(h),URL.revokeObjectURL(k)}},g=()=>{o&&!u&&s(o)},b=c?`${c}-${t}`:void 0;return n.jsxs(as,{"data-testid":b,children:[n.jsxs(ls,{$active:a===(o==null?void 0:o.key),$hasPreview:!!o,$disabled:u,onClick:g,"data-testid":b&&`${b}-preview`,children:[e,".",t]}),n.jsx(cs,{children:m?n.jsx(us,{"aria-label":`Generating ${e}.${t}`,"data-testid":b&&`${b}-loading`,children:n.jsx("span",{className:"material-symbols-outlined",children:"progress_activity"})}):n.jsx(ds,{onClick:l,"aria-label":`Download ${e}.${t}`,"data-testid":b&&`${b}-download`,children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})})]})},fs=d.h3`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  margin: 0 0 1rem;

  @media (max-width: 639px) {
    display: none;
  }
`,hs=d.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;

  @media (max-width: 639px) {
    padding: 0.5rem;
  }
`,gs=d.div`
  font-size: ${r.fontSizes.sm};
  color: ${r.colors.textDarkest};
  font-style: italic;
  padding: 0.5rem 0;
`,ms=({setPreview:e,previewKey:t,"data-testid":i})=>{var m,l;const o=[],s=_e();if(!s)return null;const{configInput:a,results:c}=s;if(c!=null&&c.demo&&o.push({fileName:"raw",extension:"txt",content:a??"",previewKey:"raw",preview:{key:"raw",extension:"txt",content:a??""}},{fileName:"canonical",extension:"yaml",content:fe.dump(c.canonical),previewKey:"canonical",preview:{key:"canonical",extension:"yaml",content:fe.dump(c.canonical)}},{fileName:"demo",extension:"dxf",content:((m=c.demo)==null?void 0:m.dxf)??"",previewKey:"demo.svg",preview:{key:"demo.svg",extension:"svg",content:((l=c.demo)==null?void 0:l.svg)??""}},{fileName:"points",extension:"yaml",content:fe.dump(c.points),previewKey:"points",preview:{key:"points",extension:"yaml",content:fe.dump(c.points)}},{fileName:"units",extension:"yaml",content:fe.dump(c.units),previewKey:"units",preview:{key:"units",extension:"yaml",content:fe.dump(c.units)}}),c!=null&&c.outlines)for(const[g,b]of Object.entries(c.outlines))o.push({fileName:g,extension:"dxf",content:b.dxf??"",previewKey:`outlines.${g}.svg`,preview:{key:`outlines.${g}.svg`,extension:"svg",content:b.svg??""}});if(c!=null&&c.cases){for(const[g,b]of Object.entries(c.cases))if(o.push({fileName:g,extension:"jscad",content:b.jscad??"",previewKey:`cases.${g}`,preview:{key:`cases.${g}`,extension:"jscad",content:b.jscad??""}}),s.stlPreview&&b.jscad){const h=!!b.stl;o.push({fileName:g,extension:"stl",content:b.stl??"",previewKey:h?`cases.${g}.stl`:"",preview:h?{key:`cases.${g}.stl`,extension:"stl",content:b.stl??""}:void 0})}}if(c!=null&&c.pcbs)for(const[g,b]of Object.entries(c.pcbs)){const x=String(b).match(/version "?([0-9]+)"?/),k=x&&x.length>1?Number(x[1]):-1;o.push({fileName:g,extension:"kicad_pcb",content:b,previewKey:s.kicanvasPreview&&k>20240101?`pcbs.${g}`:"",preview:s.kicanvasPreview&&k>20240101?{key:`pcbs.${g}`,extension:"kicad_pcb",content:b}:void 0})}const u=o.filter(g=>!(!s.debug&&(g.fileName.startsWith("_")||{units:"yaml",points:"yaml",canonical:"yaml",raw:"txt"}[g.fileName]===g.extension||s.stlPreview&&g.extension==="jscad")));return n.jsxs(hs,{"data-testid":i,children:[n.jsx(fs,{children:"Outputs"}),u.length>0?u.map((g,b)=>n.jsx(ps,{...g,setPreview:e,previewKey:t,"data-testid":i&&`${i}-${g.fileName}`},b)):n.jsx(gs,{children:"No outputs"})]})},bs=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
`,ws=d.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${r.fontSizes.bodySmall};
  cursor: pointer;
  border-bottom: ${e=>e.$active?`2px solid ${r.colors.accent}`:"2px solid transparent"};
  border-top: 2px solid transparent;
`,xs=d.div`
  white-space: nowrap;
  display: flex;
  gap: 6px;
  align-items: center;
`,hr=qo`
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
`,go=d.a`
  ${hr}
`,ys=d.a`
  ${hr}

  @media (min-width: 640px) {
    display: none;
  }
`,Ot=({injection:e,setInjectionToEdit:t,deleteInjection:i,previewKey:o,"data-testid":s})=>{const[a,c]=f.useState("");return f.useEffect(()=>{const u=window.URL.createObjectURL(new Blob([e.content],{type:"octet/stream"}));return c(u),()=>{window.URL.revokeObjectURL(u)}},[e.content]),n.jsxs(bs,{"data-testid":s,children:[n.jsx(ws,{"data-testid":s&&`${s}-name`,$active:o===e.name,onClick:()=>t(e),children:e.name}),n.jsxs(xs,{children:[n.jsx(ys,{href:"#",onClick:u=>{u.preventDefault(),t(e)},"aria-label":`edit injection ${e.name}`,"data-testid":s&&`${s}-edit`,children:n.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),n.jsx(go,{href:"#",onClick:u=>{u.preventDefault(),i(e)},"aria-label":`delete injection ${e.name}`,"data-testid":s&&`${s}-delete`,children:n.jsx("span",{className:"material-symbols-outlined",children:"delete"})}),n.jsx(go,{target:"_blank",rel:"noopener noreferrer",download:`${e.name.split("/").reverse()[0]}.js`,href:a||void 0,"aria-label":`download injection ${e.name}`,"data-testid":s&&`${s}-download`,children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})]})]})},Ke=d.button`
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
`,mo=e=>{const o=new DOMParser().parseFromString(e,"image/svg+xml").querySelectorAll("path"),s=[];return o.forEach(a=>{const c=a.getAttribute("d");if(c&&c.trim()){const u=c.replace(/\\/g,"\\\\").replace(/"/g,'\\"');s.push(`        "${u}"`)}}),`const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
${s.join(`,
`)}
    ];
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
};`},Wt=d.div`
  display: flex;
  margin-left: 0.5rem;
  margin-left: 0.5rem;
  gap: 8px;
  margin-top: 0.5rem;
`,De=d(Ke)`
  flex-grow: 0;
  width: 34px;
  padding: 0;
`,ks=d.div`
  display: flex;
  margin-left: 0.5rem;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.5rem;
`,vs=d.div`
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
`,_s=({setInjectionToEdit:e,deleteInjection:t,injectionToEdit:i,onInjectionSelect:o,"data-testid":s})=>{const a=[],c=[],u=[],m=f.useRef(null),l=f.useRef(null),g=_e(),[b,h]=f.useState("footprint"),[x,k]=f.useState("footprints"),{currentConflict:p,processInjectionsWithConflictResolution:y,handleConflictResolution:_,handleConflictCancel:L}=Ct({setInjectionInput:w=>g==null?void 0:g.setInjectionInput(w),setConfigInput:w=>g==null?void 0:g.setConfigInput(w),generateNow:async(w,C,A)=>{await(g==null?void 0:g.generateNow(w,C,A))},getCurrentInjections:()=>(g==null?void 0:g.injectionInput)||[],setError:w=>g==null?void 0:g.setError(w)});if(!g)return null;const{injectionInput:S}=g;if(S&&Array.isArray(S)&&S.length>0)for(let w=0;w<S.length;w++){const C=S[w];if(C.length===3){let A=u;C[0]==="footprint"?A=a:C[0]==="outline"?A=c:C[0]==="template"&&(A=u),A.push({key:w,type:C[0],name:C[1],content:C[2]})}}const P=()=>{var A;const w=((A=g==null?void 0:g.injectionInput)==null?void 0:A.length)||0,C={key:w,type:"footprint",name:`custom_footprint_${w+1}`,content:`module.exports = {
  params: {
    designator: '',
  },
  body: p => \`\`
}`};M("injection_created",{injection_type:"footprint"}),e(C),o&&o()},$=()=>{var A;const w=((A=g==null?void 0:g.injectionInput)==null?void 0:A.length)||0,C={key:w,type:"outline",name:`custom_outline_${w+1}`,content:`const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
        ""  // Add your SVG path(s) here
    ];
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
};`};M("injection_created",{injection_type:"outline"}),e(C),o&&o()},z=()=>{var A;const w=((A=g==null?void 0:g.injectionInput)==null?void 0:A.length)||0,C={key:w,type:"template",name:`custom_template_${w+1}`,content:`const m = require('makerjs')
const version = require('../../package.json').version

module.exports = {
    convert_outline: (model, layer) => {
        return \`\`;  // Return your converted outlines
    },
    body: params => {
        return \`\`;  // Add your template text here
    }
}`};M("injection_created",{injection_type:"template"}),e(C),o&&o()},D=async w=>{const C=w.target.files;if(!C||C.length===0)return;const A=[];for(let R=0;R<C.length;R++){const O=C[R];if(O.name.endsWith(".js")){const U=await O.text(),F=O.name.replace(/\.js$/,"");A.push([b,F,U])}else if(b==="outline"&&O.name.endsWith(".svg")){const U=await O.text(),F=mo(U),te=O.name.replace(/\.svg$/,"");A.push([b,te,F])}}A.length>0&&(M("injection_uploaded",{injection_type:b,source:"file",file_count:A.length}),await y(A,g.configInput||"")),w.target.value=""},I=async w=>{const C=w.target.files;if(!C||C.length===0)return;const A=[];for(let R=0;R<C.length;R++){const O=C[R];if(O.name.endsWith(".js")){const U=await O.text(),F=O.webkitRelativePath.split("/");F.shift();const te=F.join("/").replace(/\.js$/,"");A.push([b,te,U])}else if(b==="outline"&&O.name.endsWith(".svg")){const U=await O.text(),F=O.webkitRelativePath.split("/");F.shift();const te=F.join("/").replace(/\.svg$/,""),Y=mo(U);A.push([b,te,Y])}}A.length>0&&(M("injection_uploaded",{injection_type:b,source:"folder",file_count:A.length}),await y(A,g.configInput||"")),w.target.value=""};return n.jsxs(ks,{"data-testid":s,children:[p&&n.jsx($t,{injectionName:p.name,injectionType:p.type,onResolve:_,onCancel:L,"data-testid":"conflict-resolution-dialog"}),n.jsx(gt,{children:"Custom Libraries"}),n.jsxs(vs,{children:[n.jsx(Ft,{$active:x==="footprints",onClick:()=>{k("footprints"),h("footprint")},"data-testid":"tab-footprints",children:"Footprints"}),ce("outlines")&&n.jsx(Ft,{$active:x==="outlines",onClick:()=>{k("outlines"),h("outline")},"data-testid":"tab-outlines",children:"Outlines"}),ce("templates")&&n.jsx(Ft,{$active:x==="templates",onClick:()=>{k("templates"),h("template")},"data-testid":"tab-templates",children:"Templates"})]}),x==="footprints"&&n.jsxs(n.Fragment,{children:[a.map(w=>n.jsx(Ot,{injection:w,setInjectionToEdit:C=>{M("injection_editor_opened",{injection_type:C.type}),e(C),o&&o()},deleteInjection:t,previewKey:i.name,"data-testid":s&&`${s}-${w.name}`},w.key)),n.jsxs(Wt,{children:[n.jsx(Ke,{onClick:P,"data-testid":"add-footprint","aria-label":"Add new custom footprint",title:"Add footprint",children:n.jsx("span",{className:"material-symbols-outlined",children:"add"})}),n.jsx(De,{onClick:()=>{h("footprint"),setTimeout(()=>{var w;return(w=m.current)==null?void 0:w.click()},0)},"data-testid":"load-footprint-files","aria-label":"Load custom footprint files",title:"Load footprint files",children:n.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),n.jsx(De,{onClick:()=>{h("footprint"),setTimeout(()=>{var w;return(w=l.current)==null?void 0:w.click()},0)},"data-testid":"load-footprint-folder","aria-label":"Load custom footprint folder",title:"Load footprint folder",children:n.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),x==="outlines"&&ce("outlines")&&n.jsxs(n.Fragment,{children:[c.map(w=>n.jsx(Ot,{injection:w,setInjectionToEdit:C=>{M("injection_editor_opened",{injection_type:C.type}),e(C),o&&o()},deleteInjection:t,previewKey:i.name,"data-testid":s&&`${s}-${w.name}`},w.key)),n.jsxs(Wt,{children:[n.jsx(Ke,{onClick:$,"data-testid":"add-outline","aria-label":"Add new custom outline",title:"Add outline",children:n.jsx("span",{className:"material-symbols-outlined",children:"add"})}),n.jsx(De,{onClick:()=>{h("outline"),setTimeout(()=>{var w;return(w=m.current)==null?void 0:w.click()},0)},"data-testid":"load-outline-files","aria-label":"Load custom outline files",title:"Load outline files",children:n.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),n.jsx(De,{onClick:()=>{h("outline"),setTimeout(()=>{var w;return(w=l.current)==null?void 0:w.click()},0)},"data-testid":"load-outline-folder","aria-label":"Load custom outline folder",title:"Load outline folder",children:n.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),x==="templates"&&ce("templates")&&n.jsxs(n.Fragment,{children:[u.map(w=>n.jsx(Ot,{injection:w,setInjectionToEdit:C=>{M("injection_editor_opened",{injection_type:C.type}),e(C),o&&o()},deleteInjection:t,previewKey:i.name,"data-testid":s&&`${s}-${w.name}`},w.key)),n.jsxs(Wt,{children:[n.jsx(Ke,{onClick:z,"data-testid":"add-template","aria-label":"Add new custom template",title:"Add template",children:n.jsx("span",{className:"material-symbols-outlined",children:"add"})}),n.jsx(De,{onClick:()=>{h("template"),setTimeout(()=>{var w;return(w=m.current)==null?void 0:w.click()},0)},"data-testid":"load-template-files","aria-label":"Load custom template files",title:"Load template files",children:n.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),n.jsx(De,{onClick:()=>{h("template"),setTimeout(()=>{var w;return(w=l.current)==null?void 0:w.click()},0)},"data-testid":"load-template-folder","aria-label":"Load custom template folder",title:"Load template folder",children:n.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),n.jsx("input",{type:"file",ref:m,onChange:D,accept:b==="outline"?".js,.svg":".js",multiple:!0,style:{display:"none"}}),n.jsx("input",{type:"file",ref:l,onChange:I,accept:b==="outline"?".js,.svg":".js",style:{display:"none"},webkitdirectory:"",directory:""})]})},js=d.img`
  filter: invert();
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
`,$s=d(Dr.PanZoom)`
  overflow: hidden;
  height: 100%;

  &:focus-visible {
    outline: none;
  }
`,Cs=({svg:e,width:t,height:i,"aria-label":o,"data-testid":s})=>n.jsx($s,{enableBoundingBox:!0,minZoom:.8,maxZoom:5,"aria-label":o,"data-testid":s,children:n.jsx(js,{width:t||"100%",height:i||"100%",src:`data:image/svg+xml;utf8,${encodeURIComponent(e)}`,alt:"Ergogen SVG Output preview",draggable:"false"})}),Mt=({content:e,language:t,className:i,height:o,options:s,"aria-label":a,"data-testid":c})=>n.jsx("div",{className:i,"aria-label":a,"data-testid":c,children:n.jsx(Ar,{height:o||"80vh",language:t,value:e,theme:"ergogen-theme",options:s||{readOnly:!0}})}),Ss=f.lazy(()=>Qo(()=>import("./PcbPreview-DsKQssW6.js"),__vite__mapDeps([0,1]))),Es=f.lazy(()=>Qo(()=>import("./StlPreview-Eh3W8k1x.js"),__vite__mapDeps([2,1,3,4,5]))),gr=d.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: ${r.colors.background};
`,mr=d.img`
  width: 96px;
  height: 96px;
  opacity: 0.12;
  filter: grayscale(100%);
  -webkit-user-drag: none;
  user-drag: none;
`,Ps=d.span`
  color: ${r.colors.textDarkest};
  font-size: ${r.fontSizes.sm};
  margin-top: 1rem;
  font-family: ${r.fonts.body};
  user-select: none;
`,bo=()=>n.jsxs(gr,{children:[n.jsx(mr,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"}),n.jsx(Ps,{children:"Loading preview..."})]}),Is=({previewExtension:e,previewContent:t,previewKey:i,width:o="100%",height:s="100%",className:a,"data-testid":c,"aria-label":u})=>{if(!t||typeof t=="string"&&t===""||t instanceof ArrayBuffer&&t.byteLength===0||ArrayBuffer.isView(t)&&t.byteLength===0)return n.jsx(gr,{className:a,"data-testid":c,"aria-label":u,children:n.jsx(mr,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"})});const l=g=>{switch(g){case"svg":return n.jsx(Cs,{svg:t,width:o,height:s,"aria-label":u||`SVG preview for ${i}`,"data-testid":c&&`${c}-svg`});case"yaml":return n.jsx(Mt,{language:"yaml",content:t,"aria-label":u||`YAML preview for ${i}`,"data-testid":c&&`${c}-yaml`});case"txt":return n.jsx(Mt,{language:"text",content:t,"aria-label":u||`Text preview for ${i}`,"data-testid":c&&`${c}-txt`});case"jscad":return n.jsx(Mt,{language:"javascript",content:t,"aria-label":u||`JSCAD code preview for ${i}`,"data-testid":c&&`${c}-jscad-text`});case"kicad_pcb":return n.jsx(f.Suspense,{fallback:n.jsx(bo,{}),children:n.jsx(Ss,{pcb:t,previewKey:i,"aria-label":u||`PCB preview for ${i}`,"data-testid":c&&`${c}-pcb`},i)});case"stl":return n.jsx(f.Suspense,{fallback:n.jsx(bo,{}),children:n.jsx(Es,{stl:t,"aria-label":u||`STL preview for ${i}`,"data-testid":c&&`${c}-stl`})});default:return"No preview available"}};return n.jsx("div",{className:a,"data-testid":c,"aria-label":u,children:l(e)})},Bt=({children:e,initialWidth:t=300,minWidth:i=10,maxWidth:o="100%",side:s="left",style:a,"data-testid":c})=>{const[u,m]=f.useState(t),l=f.useRef(!1),g=f.useRef(0),b=f.useRef(t),h=f.useRef(null),x=p=>{if(typeof p=="string"&&p.includes("%")){const y=parseFloat(p)/100;return window.innerWidth*y}else return typeof p=="string"&&p.includes("px")?parseFloat(p):typeof p=="number"?p:1/0};f.useEffect(()=>{const p=S=>{if(!l.current)return;const P=s==="left"?S.clientX-g.current:g.current-S.clientX,$=b.current+P,z=x(o),D=Math.max(i,Math.min($,z));m(D)},y=()=>{l.current&&(l.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},_=S=>{if(!l.current)return;S.preventDefault();const P=S.touches[0],$=s==="left"?P.clientX-g.current:g.current-P.clientX,z=b.current+$,D=x(o),I=Math.max(i,Math.min(z,D));m(I)},L=()=>{l.current&&(l.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",p),window.addEventListener("mouseup",y),window.addEventListener("touchmove",_,{passive:!1}),window.addEventListener("touchend",L),()=>{window.removeEventListener("mousemove",p),window.removeEventListener("mouseup",y),window.removeEventListener("touchmove",_),window.removeEventListener("touchend",L)}},[i,o,s]);const k=p=>{p.preventDefault(),p.stopPropagation(),l.current=!0,b.current=u,"touches"in p?g.current=p.touches[0].clientX:g.current=p.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};return n.jsxs(Ls,{ref:h,$side:s,style:{width:`${u}px`,...a},"data-testid":c,children:[e,n.jsx(zs,{$side:s,onMouseDown:k,onTouchStart:k,"data-testid":c&&`${c}-resize-handle`})]})},Ls=d.div`
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
`,zs=d.div`
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
`,nn=(e,t)=>{if(t===null)return null;if(e==="")return t;if(typeof t!="object")return;const i=e.split("."),o=i[0],s=i.slice(1).join(".");return Object.prototype.hasOwnProperty.call(t,o)?nn(s,t[o]):void 0};function br(){if(typeof navigator<"u"){if("userAgentData"in navigator&&navigator.userAgentData){const e=navigator.userAgentData;if(e.platform&&/mac/i.test(e.platform))return!0}if(/Mac|iPhone|iPad|iPod/i.test(navigator.userAgent))return!0}return!1}const Ds=d.input.attrs(e=>({type:"text",$size:e.$size||"0.5em"}))`
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
`,As=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`,Rs=d.label`
  display: flex;
  flex-direction: column;
  flex: 1;
  cursor: ${e=>e.$disabled?"not-allowed":"pointer"};
  user-select: none;
  text-align: left;
`,Ns=d.span`
  color: ${r.colors.text};
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
`,Us=d.span`
  color: ${r.colors.textDarker};
  font-size: ${r.fontSizes.sm};
  margin-top: 0.25rem;
  line-height: 1.4;
`,Os=d.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`,Ws=d.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: ${e=>e.$disabled?"not-allowed":"pointer"};
  opacity: ${e=>e.$disabled?.5:1};
`,Fs=d.input`
  opacity: 0;
  width: 0;
  height: 0;
`,Ms=d.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${e=>e.$checked?r.colors.accent:r.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`,Bs=d.span`
  position: absolute;
  top: 2px;
  left: ${e=>e.$checked?"18px":"2px"};
  width: 16px;
  height: 16px;
  background-color: ${r.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,Ae=({optionId:e,label:t,description:i,setSelected:o,checked:s,disabled:a=!1,"aria-label":c})=>n.jsxs(As,{children:[n.jsxs(Rs,{htmlFor:e,$disabled:a,children:[n.jsx(Ns,{children:t}),i&&n.jsx(Us,{children:i})]}),n.jsx(Os,{children:n.jsxs(Ws,{$disabled:a,htmlFor:e,children:[n.jsx(Fs,{type:"checkbox",id:e,checked:s,disabled:a,onChange:u=>o(u.target.checked),"data-testid":`option-${e}`,"aria-label":c}),n.jsx(Ms,{$checked:s}),n.jsx(Bs,{$checked:s})]})})]}),Ne=d.button`
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
`,Ts=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`,Gs=d.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  user-select: none;
  text-align: left;
`,Vs=d.span`
  color: ${r.colors.text};
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
`,on=d.span`
  color: ${r.colors.textDarker};
  font-size: ${r.fontSizes.sm};
  margin-top: 0.25rem;
  line-height: 1.4;
`,Hs=d(on)`
  color: ${r.colors.warningDark};
`,qs=d.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`,Ks=({isAvailable:e,isInstalled:t,isInstalling:i,onInstall:o})=>{let s,a;return t?(s=n.jsx(on,{children:"The application is installed and available offline."}),a=n.jsx(he,{size:"sm",disabled:!0,"data-testid":"pwa-installed-button",children:"Installed"})):e?(s=n.jsx(on,{children:"Install the app locally to access it offline without network connectivity."}),i?a=n.jsx(he,{size:"sm",disabled:!0,"data-testid":"pwa-installing-button",children:"Installing..."}):a=n.jsx(he,{size:"sm",onClick:o,"data-testid":"pwa-install-button",children:"Install App"})):(s=n.jsx(Hs,{children:"PWA installation is not supported by your browser or environment."}),a=n.jsx(he,{size:"sm",disabled:!0,"data-testid":"pwa-unavailable-button",children:"Unavailable"})),n.jsxs(Ts,{children:[n.jsxs(Gs,{children:[n.jsx(Vs,{children:"Offline App"}),s]}),n.jsx(qs,{children:a})]})},Js=(e,t,i,o)=>{const s={config:e,...t&&t.length>0?{injections:t}:{},guiVersion:vt.version,ergogenVersion:un("github:ceoloide/ergogen#v4.3.0")},a=JSON.stringify(s);return Ko.compressToEncodedURIComponent(a)},Xs=()=>new URLSearchParams(window.location.search).get("debug")!==null,Ys=e=>{var i;const t=Xs();try{const o=Ko.decompressFromEncodedURIComponent(e);if(!o)return console.error("[Share] DECODE_ERROR: Failed to decompress encoded string"),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The encoded data could not be decompressed."};let s;try{s=JSON.parse(o)}catch(c){return console.error("[Share] DECODE_ERROR: Failed to parse decompressed JSON",{parseError:c,decompressedLength:o.length,decompressedPreview:o.substring(0,100)}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The decompressed data is not valid JSON."}}if(!s||typeof s!="object"||!("config"in s)||typeof s.config!="string")return console.error("[Share] VALIDATION_ERROR: Invalid object structure",{parsed:s,hasConfig:s&&typeof s=="object"&&"config"in s,configType:s&&typeof s=="object"&&"config"in s?typeof s.config:"N/A"}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link does not contain a valid configuration. The decoded data is missing required fields or has an invalid structure."};const a=s;return(!a.guiVersion||typeof a.guiVersion!="string")&&(a.guiVersion="0.9.0"),(!a.ergogenVersion||typeof a.ergogenVersion!="string")&&(a.ergogenVersion="github:ergogen/ergogen#v4.2.1"),"injections"in a&&a.injections!==void 0&&(!Array.isArray(a.injections)||!a.injections.every(c=>Array.isArray(c)&&c.length===3&&typeof c[0]=="string"&&typeof c[1]=="string"&&typeof c[2]=="string"))?(console.error("[Share] VALIDATION_ERROR: Invalid injections structure",{injections:a.injections,isArray:Array.isArray(a.injections)}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link contains invalid injections data. Injections must be an array of [type, name, content] tuples."}):(t&&console.log("[Share] DEBUG: Decoded configuration object",{configLength:a.config.length,hasInjections:a.injections!==void 0,injectionsCount:((i=a.injections)==null?void 0:i.length)??0,fullObject:a}),{success:!0,config:a})}catch(o){return console.error("[Share] DECODE_ERROR: Unexpected error during decoding",{error:o,errorMessage:o instanceof Error?o.message:String(o),errorStack:o instanceof Error?o.stack:void 0}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. An unexpected error occurred while decoding."}}},Zs=e=>{const{config:t,injections:i,canonical:o}=e;let s=i;if(o&&i&&i.length>0){const m=xr(o);s=Qs(i,m)}const a=s&&s.length>0?s:void 0,c=Js(t,a);return`${window.location.origin+window.location.pathname}#${c}`},wr=()=>{const e=window.location.hash;if(!e||e.length<=1)return null;const t=e.substring(1);return Ys(t)},xr=e=>{const t=new Set,i=new Set,o=new Set;if(!e||typeof e!="object")return{footprints:t,templates:i,outlines:o};const s=e;if(s.pcbs&&typeof s.pcbs=="object"){for(const a of Object.values(s.pcbs))if(!(!a||typeof a!="object")&&(typeof a.template=="string"&&i.add(a.template),a.footprints&&typeof a.footprints=="object"))for(const c of Object.values(a.footprints))c&&typeof c.what=="string"&&t.add(c.what)}if(s.outlines&&typeof s.outlines=="object")for(const a of Object.values(s.outlines)){if(!a||typeof a!="object")continue;const c=Array.isArray(a)?a:Object.values(a);for(const u of c){const m=u;m&&typeof m.what=="string"&&o.add(m.what)}}return{footprints:t,templates:i,outlines:o}},Qs=(e,t)=>!e||e.length===0?[]:e.filter(i=>{const[o,s]=i;return o==="footprint"?t.footprints.has(s):o==="template"?t.templates.has(s):o==="outline"?t.outlines.has(s):!0}),wo=async(e,t,i,o)=>{try{await navigator.clipboard.writeText(e),t(!0),o==null||o(),i.current&&clearTimeout(i.current),i.current=setTimeout(()=>{t(!1)},2500)}catch(s){console.error("Failed to copy shareable URI to clipboard:",s);try{const a=document.createElement("textarea");a.value=e,a.style.position="fixed",a.style.opacity="0",document.body.appendChild(a),a.select();const c=document.execCommand("copy");if(document.body.removeChild(a),!c){console.error("Fallback copy method was rejected by the browser.");return}t(!0),o==null||o(),i.current&&clearTimeout(i.current),i.current=setTimeout(()=>{t(!1)},2500)}catch(a){console.error("Fallback copy method also failed:",a)}}},yr=({config:e,injections:t,onClose:i,"data-testid":o})=>{const s=Jo.useMemo(()=>t||[],[t]),[a,c]=f.useState(1),[u,m]=f.useState(!0),[l,g]=f.useState(!1),[b,h]=f.useState(null),[x,k]=f.useState(""),[p,y]=f.useState([]),[_,L]=f.useState(!1),[S,P]=f.useState(!1),$=f.useRef(null),z=f.useRef(null);f.useEffect(()=>{if(!u||_||s.length===0||a!==1)return;let R=!0;g(!0),h(null);const O=kt();if(!O){h("Could not initialize background worker."),g(!1);return}return O.onmessage=U=>{var te;if(!R)return;const F=U.data;if(F.type==="success"){const Y=(te=F.results)==null?void 0:te.canonical,{footprints:ne,templates:X,outlines:B}=xr(Y),W=s.map(([T,Z,G])=>{let v;return T==="footprint"?v=ne.has(Z):T==="template"?v=X.has(Z):T==="outline"?v=B.has(Z):v=!0,{type:T,name:Z,content:G,checked:v,isEligible:v}}).filter(T=>T.isEligible).map(({type:T,name:Z,content:G,checked:v})=>({type:T,name:Z,content:G,checked:v}));y(W),L(!0)}else F.type==="error"&&h(F.error||"Failed to analyze configuration.");g(!1),O.terminate()},O.onerror=()=>{R&&(h("Worker encountered an error during analysis."),g(!1),O.terminate())},O.postMessage({type:"generate",inputConfig:e,injectionInput:s,requestId:`share-analysis-${Date.now()}`,options:{debug:!0}}),()=>{R=!1,O.terminate()}},[u,_,s,e,a]);const D=f.useRef(0);D.current=u?p.filter(R=>R.checked).length:0;const I=f.useCallback(R=>{M("share_link_copied",{has_injections:D.current>0,injections_count:D.current,source:R})},[]);f.useEffect(()=>{a===2&&x&&wo(x,P,z,()=>{I("auto")})},[x,a,I]),f.useEffect(()=>{const R=O=>{O.key==="Escape"&&i()};return window.addEventListener("keydown",R),()=>{window.removeEventListener("keydown",R)}},[i]),f.useEffect(()=>{a===2&&$.current&&($.current.focus(),$.current.select())},[a]),f.useEffect(()=>{const R=z;return()=>{R.current&&clearTimeout(R.current)}},[]);const w=R=>{y(O=>O.map((U,F)=>F===R?{...U,checked:!U.checked}:U))},C=()=>{const R=u?p.filter(F=>F.checked):[],O=R.length>0?R.map(F=>[F.type,F.name,F.content]):void 0,U=Zs({config:e,injections:O});k(U),c(2)},A=()=>{wo(x,P,z,()=>{I("button")})};return n.jsx(ea,{"data-testid":o,onClick:R=>{R.target===R.currentTarget&&i()},children:n.jsxs(ta,{"data-testid":o&&`${o}-box`,onClick:R=>R.stopPropagation(),children:[n.jsx(na,{onClick:i,"data-testid":o&&`${o}-close`,"aria-label":"Close dialog",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})}),a===1?n.jsxs(n.Fragment,{children:[n.jsx(xo,{children:"Share Configuration"}),n.jsx(yo,{children:"Configure what content should be included when sharing your keyboard design."}),n.jsx(oa,{children:n.jsxs(ra,{htmlFor:"include-libraries-toggle",children:[n.jsx(ia,{id:"include-libraries-toggle",type:"checkbox",checked:u,onChange:R=>{const O=R.target.checked;m(O),O||(g(!1),h(null))},"aria-label":"Include custom libraries"}),n.jsx(sa,{$checked:u}),n.jsx("span",{children:"Include custom libraries"})]})}),u&&n.jsxs(n.Fragment,{children:[l&&n.jsxs(aa,{children:[n.jsx(la,{}),n.jsx("span",{children:"Analyzing configuration..."})]}),b&&n.jsx(ca,{children:b}),!l&&!b&&s.length===0&&n.jsx(ko,{children:"No custom libraries loaded."}),!l&&!b&&s.length>0&&p.length===0&&n.jsx(ko,{children:"No custom footprints or libraries are used in this configuration."}),!l&&!b&&p.length>0&&n.jsx(da,{children:p.map((R,O)=>n.jsxs(ua,{children:[n.jsx(pa,{id:`injection-${R.name}`,type:"checkbox",checked:R.checked,onChange:()=>w(O),"aria-label":R.name}),n.jsx(ha,{$type:R.type,children:R.type}),n.jsx(fa,{htmlFor:`injection-${R.name}`,children:R.name})]},`${R.type}-${R.name}`))})]}),n.jsx(vo,{children:n.jsx(ga,{onClick:C,disabled:l,children:"Share"})})]}):n.jsxs(n.Fragment,{children:[n.jsx(xo,{children:"Shareable Configuration Link"}),n.jsx(yo,{children:"Share this link with others to let them view and use your keyboard configuration, including all of your custom footprints."}),n.jsxs(ma,{children:[n.jsx(ba,{ref:$,type:"text",value:x,readOnly:!0,"data-testid":o&&`${o}-input`,"aria-label":"Share link"}),n.jsx(vo,{children:n.jsxs(wa,{onClick:A,"data-testid":o&&`${o}-copy`,"aria-label":S?"Link copied":"Copy link",children:[n.jsx("span",{className:"material-symbols-outlined",children:S?"check":"content_copy"}),S?"Link copied":"Copy link"]})})]})]})]})})},ea=d.div`
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
`,ta=d.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: relative;
`,na=d.button`
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
`,xo=d.h2`
  margin: 0 0 1rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
  padding-right: 3rem;
`,yo=d.p`
  margin: 0 0 1.5rem 0;
  font-size: ${r.fontSizes.base};
  color: ${r.colors.textDark};
  line-height: 1.5;
`,oa=d.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`,ra=d.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  font-family: ${r.fonts.body};
  font-size: ${r.fontSizes.base};
  color: ${r.colors.text};
`,ia=d.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`,sa=d.span`
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
`,aa=d.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.5rem 0;
  color: ${r.colors.textDark};
`,la=d.div`
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
`,ca=d.p`
  color: ${r.colors.error};
  font-size: ${r.fontSizes.sm};
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: ${r.colors.errorDark}22;
  border: 1px solid ${r.colors.error};
  border-radius: 6px;
`,ko=d.p`
  color: ${r.colors.textDarker};
  font-size: ${r.fontSizes.sm};
  margin: 1rem 0;
  font-style: italic;
`,da=d.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${r.colors.border};
  border-radius: 6px;
  background-color: ${r.colors.backgroundLighter};
  margin: 1rem 0 1.5rem 0;
  padding: 0.5rem;
`,ua=d.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${r.colors.backgroundLight};
  }
`,pa=d.input`
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: ${r.colors.accent};
`,fa=d.label`
  cursor: pointer;
  flex: 1;
  color: ${r.colors.text};
  font-size: ${r.fontSizes.sm};
  user-select: none;
`,ha=d.span`
  font-size: ${r.fontSizes.xs};
  font-weight: ${r.fontWeights.bold};
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  color: ${r.colors.white};
  background-color: ${e=>{switch(e.$type){case"footprint":return"#007bff";case"outline":return"#e83e8c";case"template":return"#fd7e14";default:return r.colors.border}}};
`,ga=d.button`
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
`,ma=d.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: stretch;
`,vo=d.div`
  display: flex;
  justify-content: center;
  width: 100%;

  @media (min-width: 500px) {
    width: auto;
  }
`,ba=d.input`
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
`,wa=d.button`
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
`,xa=d.span`
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
`;function ya(){return n.jsx(n.Fragment,{children:n.jsxs("span",{children:[br()?"⌘":"Ctrl"," ⏎"]})})}const ka=d.div`
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
`,va=d.div`
  flex-grow: 1;
`,_o=d(Ne)`
  display: none;

  @media (max-width: 475px) {
    display: flex;
  }
`,_a=d.button`
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
`,jo=d.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
`,ja=d.div`
  display: flex;
  gap: 10px;
  align-items: stretch;
  padding: 10px;

  @media (max-width: 639px) {
    display: none;
  }
`,$a=d.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
  padding: 0;
`,$o=d(Is)`
  height: 100%;
`,Ca=d.div`
  height: 100%;
  overflow-y: auto;
`,Sa=d(os)`
  position: relative;
  flex-grow: 1;
  min-height: 0;
`,Ea=d.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`,Pa=d.div`
  height: 100%;
  overflow-y: auto;
  padding: 0.5rem;

  @media (min-width: 640px) {
    padding: 1rem;
  }
`,Ia=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 640px) {
    display: none;
  }
`,La=d.button`
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
`,Co=d.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: row;

  @media (max-width: 639px) {
    width: ${e=>e.$fullWidth?"100%":"auto"};
  }
`,So=d.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
`,za=d.div`
  display: flex;
  height: 100%;
  width: 100%;
`,Da=({pwaState:e})=>{const t=()=>Math.max(200,window.innerWidth*.33),i=()=>Math.max(150,window.innerWidth*.15),o=()=>Math.max(350,window.innerWidth*.15),[s,a]=f.useState({key:"demo.svg",extension:"svg",content:""}),[c,u]=f.useState(!1),m=w=>{a(w),p!=null&&p.showConfig||p==null||p.setShowDownloads(!1)},[l,g]=f.useState({key:-1,type:"",name:"",content:""}),[b,h]=f.useState(!1),[x,k]=f.useState(window.innerWidth<=639),p=_e(),y=!0;f.useEffect(()=>{const w=()=>{k(window.innerWidth<=639)};return window.addEventListener("resize",w),()=>window.removeEventListener("resize",w)},[]),Rr(br()?"meta+enter":"ctrl+enter",()=>{p&&(M("shortcut_used",{action:"generate"}),p.generateNow(p.configInput,p.injectionInput,{pointsonly:!1,isManual:!0}))},{enableOnFormTags:!0,preventDefault:!0}),f.useEffect(()=>{if(l.key===-1||l.name===""||l.content==="")return;const w=[l.type,l.name,l.content];let C=[];Array.isArray(p==null?void 0:p.injectionInput)&&(C=[...p.injectionInput]);const A=C.length;if(A===0||A===l.key)C.push(w),g({...l,key:A});else{const R=C[l.key];if(R[0]===l.type&&R[1]===l.name&&R[2]===l.content)return;C=C.map((O,U)=>U===l.key?w:O)}p==null||p.setInjectionInput(C)},[p,l]);const _=f.useRef(null),L=!!(p!=null&&p.results);if(f.useEffect(()=>{if(!L){_.current=null;return}if(!s.key||!s.extension)return;const w=`${s.key}|${s.extension}`;_.current!==w&&(_.current=w,M("preview_loaded",{preview_type:s.extension,preview_key:s.key}))},[s.key,s.extension,L]),!p)return null;let S=null;switch(p.results&&(S=nn(s.key,p.results),S===void 0&&s.key!=="demo.svg"&&(s.key="demo.svg",s.extension="svg",S=nn(s.key,p.results))),s.extension){case"svg":case"kicad_pcb":s.content=typeof S=="string"?S:"";break;case"stl":s.content=typeof S=="string"||S instanceof ArrayBuffer||ArrayBuffer.isView(S)?S:"";break;case"jscad":s.content=typeof(S==null?void 0:S.jscad)=="string"?S.jscad:"";break;case"yaml":s.content=fe.dump(S);break;case"txt":s.content=p.configInput||"";break;default:s.content=""}const P=w=>{const C={...l,name:w.target.value};g(C)},$=w=>{if(!Array.isArray(p==null?void 0:p.injectionInput))return;M("injection_deleted",{injection_type:w.type});const C=[...p.injectionInput].filter((A,R)=>R!==w.key);if(p.setInjectionInput(C),l.key===w.key)g({key:-1,type:"",name:"",content:""});else if(l.key>=w.key){const A={...l,key:l.key-1};g(A)}},z=()=>{var R;const w=((R=p.getRealtimeConfigInput)==null?void 0:R.call(p))??p.configInput;if(w===void 0)return;M("download_button_clicked",{download_type:"yaml",source:"editor"});const C=document.createElement("a"),A=new Blob([w],{type:"text/yaml"});C.href=URL.createObjectURL(A),C.download="config.yaml",document.body.appendChild(C),C.click(),URL.revokeObjectURL(C.href),document.body.removeChild(C)},D=()=>{var w,C;p.configInput&&(M("share_button_clicked",{has_injections:!!((w=p.injectionInput)!=null&&w.length),injections_count:((C=p.injectionInput)==null?void 0:C.length)||0,source:"subheader"}),u(!0))},I=()=>{var w,C,A;!p.results||!p.configInput||p.isGenerating||p.isJscadConverting||(M("archive_single_downloaded",{has_injections:!!((w=p.injectionInput)!=null&&w.length),injections_count:((C=p.injectionInput)==null?void 0:C.length)||0,stored_configs_count:((A=p.configs)==null?void 0:A.length)||0,source:"subheader"}),pr(p.results,p.configInput,p.injectionInput,p.debug,p.stlPreview))};return n.jsxs(n.Fragment,{children:[c&&n.jsx(yr,{config:p.configInput||"",injections:p.injectionInput||[],onClose:()=>u(!1)}),n.jsxs($a,{children:[!p.showSettings&&n.jsxs(ka,{children:[n.jsx(Ne,{className:p.showConfig?"active":"",onClick:()=>p.setShowConfig(!0),"aria-label":"Show configuration panel","data-testid":"mobile-config-button",children:"Config"}),n.jsx(Ne,{className:p.showConfig?"":"active",onClick:()=>p.setShowConfig(!1),"aria-label":"Show outputs panel","data-testid":"mobile-outputs-button",children:"Outputs"}),n.jsx(va,{}),p.showConfig&&n.jsxs(n.Fragment,{children:[n.jsx(_a,{onClick:()=>p.generateNow(p.configInput,p.injectionInput,{pointsonly:!1,isManual:!0}),"aria-label":"Generate configuration","data-testid":"mobile-generate-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"refresh"})}),n.jsx(_o,{onClick:D,disabled:!p.configInput,"aria-label":"Share configuration","data-testid":"mobile-share-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"share"})}),n.jsx(Ne,{onClick:z,"aria-label":"Download configuration","data-testid":"mobile-download-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})]}),!p.showConfig&&n.jsxs(n.Fragment,{children:[n.jsx(_o,{onClick:I,disabled:p.isGenerating||p.isJscadConverting,"aria-label":"Download archive of all generated files","data-testid":"mobile-download-outputs-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),n.jsx(Ne,{onClick:()=>p.setShowDownloads(!p.showDownloads),"aria-label":p.showDownloads?"Hide downloads panel":"Show downloads panel","data-testid":"mobile-downloads-toggle-button",children:n.jsx("span",{className:"material-symbols-outlined",children:p.showDownloads?"expand_content":"collapse_content"})})]})]}),n.jsx(za,{children:p.showSettings?n.jsxs(n.Fragment,{children:[n.jsx(Bt,{initialWidth:o(),minWidth:150,maxWidth:"70%",side:"left","data-testid":"settings-panel",style:{display:b&&x?"none":void 0},children:n.jsxs(Pa,{children:[n.jsxs(Ea,{children:[n.jsx(at,{children:"General"}),n.jsxs(lt,{children:[n.jsx(Ae,{optionId:"autogen",label:"Auto-generate",description:"Automatically generate new outputs and update previews on changes.",setSelected:p.setAutoGen,checked:p.autoGen,"aria-label":"Enable auto-generate"}),n.jsx(Ae,{optionId:"autogen3d",label:"Auto-generate PCB & 3D",description:"Build 3D models and PCB files during generation (can be slow).",setSelected:p.setAutoGen3D,checked:p.autoGen3D,"aria-label":"Enable auto-generate PCB and 3D (slow)"}),n.jsx(Ae,{optionId:"debug",label:"Debug",description:"Include debug files in the outputs.",setSelected:p.setDebug,checked:p.debug,"aria-label":"Enable debug mode"})]}),n.jsx(at,{children:"Previews (Experimental)"}),n.jsxs(lt,{children:[n.jsx(Ae,{optionId:"kicanvasPreview",label:"KiCad Preview",description:"Render interactive PCB layouts using KiCanvas.",setSelected:p.setKicanvasPreview,checked:p.kicanvasPreview,"aria-label":"Enable KiCad preview (experimental)"}),n.jsx(Ae,{optionId:"stlPreview",label:"STL Preview",description:"Render 3D preview of generated cases.",setSelected:p.setStlPreview,checked:p.stlPreview,"aria-label":"Enable STL preview (experimental)"})]}),n.jsx(at,{children:"Privacy"}),n.jsx(lt,{children:n.jsx(Ae,{optionId:"sendUsageMetrics",label:"Send Usage Metrics",description:y?"Help improve Ergogen Web UI by sharing anonymous usage statistics.":"Unavailable: this copy of Ergogen Web UI was built without an analytics tag ID, so no usage statistics are sent.",setSelected:p.setSendUsageMetrics,checked:y&&p.sendUsageMetrics,disabled:!y,"aria-label":"Send usage metrics"})}),e&&n.jsxs(n.Fragment,{children:[n.jsx(at,{children:"Offline"}),n.jsx(lt,{children:n.jsx(Ks,{isAvailable:e.isAvailable,isInstalled:e.isInstalled,isInstalling:e.isInstalling,onInstall:e.onInstall})})]})]}),n.jsx(_s,{setInjectionToEdit:g,deleteInjection:$,injectionToEdit:l,onInjectionSelect:()=>h(!0),"data-testid":"injections-container"})]})}),n.jsx(Co,{$fullWidth:b&&x,children:n.jsxs(jo,{children:[x&&n.jsxs(Ia,{children:[n.jsxs(gt,{as:"h4",style:{marginTop:0},children:[l.type?l.type.charAt(0).toUpperCase()+l.type.slice(1):"Footprint"," ","name"]}),n.jsx(La,{onClick:()=>{h(!1),g({key:-1,type:"",name:"",content:""})},"aria-label":"Close editor","data-testid":"mobile-editor-close",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),!x&&n.jsxs(gt,{as:"h4",children:[l.type?l.type.charAt(0).toUpperCase()+l.type.slice(1):"Footprint"," ","name"]}),n.jsx(Ds,{value:l.name,onChange:P,disabled:l.key===-1,"aria-label":`${l.type?l.type.charAt(0).toUpperCase()+l.type.slice(1):"Footprint"} name`,"data-testid":"footprint-name-input"}),n.jsxs(gt,{as:"h4",children:[l.type?l.type.charAt(0).toUpperCase()+l.type.slice(1):"Footprint"," ","code"]}),n.jsx(rs,{injection:l,setInjection:g,options:{readOnly:l.key===-1}})]})})]}):n.jsxs(n.Fragment,{children:[p.showConfig&&n.jsx(Bt,{initialWidth:t(),minWidth:250,maxWidth:"60%",side:"left","data-testid":"config-panel",children:n.jsxs(jo,{children:[n.jsx(Sa,{"data-testid":"config-editor"}),n.jsxs(ja,{children:[n.jsx(Ke,{onClick:()=>p.generateNow(p.configInput,p.injectionInput,{pointsonly:!1,isManual:!0}),"aria-label":"Generate configuration","data-testid":"generate-button",children:n.jsxs("span",{style:{display:"flex",alignItems:"center",width:"100%",justifyContent:"center"},children:[n.jsx("span",{children:"Generate"}),n.jsx(xa,{children:ya()})]})}),n.jsx(Ne,{onClick:z,"aria-label":"Download configuration","data-testid":"download-config-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})]})]})}),n.jsx(Co,{$fullWidth:!p.showConfig,children:p.showDownloads?n.jsxs(n.Fragment,{children:[n.jsx(So,{children:n.jsx($o,{"data-testid":`${s.key}-file-preview`,previewExtension:s.extension,previewKey:`${s.key}-${p.resultsVersion}`,previewContent:s.content})}),n.jsx(Bt,{initialWidth:i(),minWidth:105,maxWidth:"30%",side:"right","data-testid":"downloads-panel",children:n.jsx(Ca,{children:n.jsx(ms,{setPreview:m,previewKey:s.key,"data-testid":"downloads-container"})})})]}):n.jsx(So,{children:n.jsx($o,{"data-testid":`${s.key}-file-preview`,previewExtension:s.extension,previewKey:`${s.key}-${p.resultsVersion}`,previewContent:s.content})})})]})})]})]})},Aa={label:"Absolem",author:"MrZealot",value:`meta:
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
    distance: 223.7529778`},Ra={label:"Atreus",author:"MrZealot",value:`points:
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
`},Na={label:"A. Dux",author:"tapioki",value:`meta:
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
`},Ua={label:"Corney Island",author:"ceoloide",value:`points:
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
          rotate: 90`},rn={label:"Empty YAML configuration",author:"ceoloide",value:`meta:
  engine: 4.1.0
units:
points:
  zones:
    matrix:
outlines:
pcbs:
cases:
`},Oa={label:"Wubbo",author:"cache.works",value:`meta:
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
`},Wa={label:"Sweep-like",author:"jcmkk3",value:`meta:
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
`},Fa={label:"Reviung41",author:"jcmkk3",value:`meta:
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
`},Ma={label:"Tiny20",author:"enzocoralc",value:`meta:
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
`},Ba={label:"Alpha",author:"jcmkk3",value:`points:
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
`},Ta={label:"Plank",author:"cache.works",value:`meta:
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
`},Ga={label:"Curly-45",author:"peterjc",value:`meta:
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
`},Va={label:"Briefs 56",author:"ceoloide",value:`# Inspired by the Dygma Sonsei
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
`},Ha={label:"Willy 50",author:"ceoloide",value:`# Inspired by the Keychron Orca Echo
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
`},qa=[rn],Ka=[Aa,Ra],Ja=[Na,Ua,Wa,Fa,Ma],Xa=[Oa,Ba,Ta,Ga,Va,Ha],Ya=[{label:"Empty configurations",options:qa},{label:"Simple (points only)",options:Ka},{label:"Complete (with pcb)",options:Ja},{label:"Miscellaneous",options:Xa}],Za=e=>{var o;const t=fe.load(e.value),i=((o=t==null?void 0:t.meta)==null?void 0:o.engine)??(t==null?void 0:t["meta.engine"]);return i===null?void 0:i},Qa=(e,t=Ze())=>{const i=Za(e);return i===void 0?!0:typeof i=="string"&&yi(t,i)},el=(e=Ze())=>Ya.map(t=>({...t,options:t.options.filter(i=>Qa(i,e))})).filter(t=>t.options.length>0),tl=async e=>new Promise((t,i)=>{const o=new FileReader;o.onload=s=>{var a;(a=s.target)!=null&&a.result&&typeof s.target.result=="string"?t(s.target.result):i(new Error("Failed to read file as text"))},o.onerror=()=>i(new Error("Failed to read file")),o.readAsText(e)}),nl=async e=>{const i=e.name.toLowerCase().split(".").pop(),o=i==="zip"||i==="ekb";if(Qt(e.size,o),i==="yaml"||i==="yml"||i==="json")return{config:await tl(e),footprints:[],outlines:[],templates:[]};if(o){const s=await e.arrayBuffer(),a=await Ci(s),c=a.injections.filter(l=>l.type==="footprint").map(l=>({name:l.name,content:l.content})),u=a.injections.filter(l=>l.type==="outline").map(l=>({name:l.name,content:l.content})),m=a.injections.filter(l=>l.type==="template").map(l=>({name:l.name,content:l.content}));return{config:a.config,footprints:c,outlines:u,templates:m}}else throw new Error("Unsupported file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")},sn=()=>n.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-github",viewBox:"0 0 98 96",children:n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z",fill:"currentColor"})}),Eo=()=>n.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 4.2333332 4.2333335",version:"1.1",fill:"currentColor",children:[n.jsxs("defs",{children:[n.jsxs("linearGradient",{id:"linearGradient6924-6",children:[n.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:0},offset:"0"}),n.jsx("stop",{offset:"0.49517274",style:{stopColor:"#ffffff",stopOpacity:.3}}),n.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:.3},offset:"1"})]}),n.jsx("linearGradient",{id:"linearGradient6918-3",x1:"42519.285",y1:"-7078.7891",x2:"42575.336",y2:"-6966.9307",gradientUnits:"userSpaceOnUse",href:"#linearGradient6924-6"})]}),n.jsxs("g",{transform:"matrix(0.06551432,0,0,0.06551432,-2.232417,-1.431776)",children:[n.jsx("path",{id:"path6733-5",style:{fontVariationSettings:"normal",opacity:1,vectorEffect:"none",fill:"url(#linearGradient6918-3)",fillOpacity:1,stroke:"none",strokeWidth:3.67846,strokeLinecap:"butt",strokeLinejoin:"miter",strokeMiterlimit:2,strokeDashoffset:0,strokeOpacity:1,paintOrder:"stroke markers fill",stopColor:"#000000",stopOpacity:1},d:"m 42519.285,-7078.7891 a 0.76086879,0.56791688 0 0 0 -0.738,0.6739 l 33.586,125.8886 a 87.182358,87.182358 0 0 0 39.381,-33.7636 l -71.565,-92.5196 a 0.76086879,0.56791688 0 0 0 -0.664,-0.2793 z",transform:"matrix(0.37058478,0,0,0.37058478,-15690.065,2662.0533)"}),n.jsx("path",{id:"path360787",style:{opacity:1,fill:"#ffffff",fillOpacity:1,strokeWidth:17.0055,paintOrder:"markers fill stroke",stopColor:"#000000"},d:"m 11249.461,-1883.6961 c -12.74,0 -23.067,10.3275 -23.067,23.0671 0,4.3335 1.22,8.5795 3.522,12.2514 l 19.232,-24.8636 c 0.138,-0.1796 0.486,-0.1796 0.624,0 l 19.233,24.8646 c 2.302,-3.6721 3.523,-7.9185 3.523,-12.2524 0,-12.7396 -10.327,-23.0671 -23.067,-23.0671 z",transform:"matrix(1.4006354,0,0,1.4006354,-15690.065,2662.0533)"})]})]}),Po=()=>n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 212 212",fill:"none",stroke:"currentColor",children:n.jsxs("g",{transform:"translate(6,6)",children:[n.jsx("path",{d:"M58 168 v-98 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),n.jsx("path",{d:"M58 168 v-30 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),n.jsx("circle",{cx:"142",cy:"20",r:"18",strokeWidth:"15"}),n.jsx("circle",{cx:"142",cy:"88",r:"18",strokeWidth:"15"}),n.jsx("circle",{cx:"58",cy:"180",r:"18",strokeWidth:"15"})]})}),an=d.div`
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
`,ol=d.div`
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
`,rl=d.div`
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
`,il=d.div`
  background-color: ${r.colors.backgroundLight};
  border: 3px dashed ${r.colors.accent};
  border-radius: 8px;
  padding: 2rem;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
  text-align: center;
`,sl=d.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 640px) {
    padding: 1rem 0.5rem;
  }
`,al=d.h1`
  font-size: ${r.fontSizes.h1};
  text-align: center;
  margin-bottom: 1rem;
`,ll=d.p`
  font-size: ${r.fontSizes.lg};
  text-align: center;
  margin-bottom: 3rem;
  color: ${r.colors.textDark};
`,cl=d.div`
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
`,dl=d.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;

  button {
    flex-shrink: 0;
  }
`,ul=d.div`
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
`,pl=d.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  user-select: none;
`,fl=d.button`
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
`,hl=d.div`
  width: 1px;
  background-color: ${r.colors.border};
  margin: 0.75rem 0;
  flex-shrink: 0;
`,gl=d.input`
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
`,ml=d.div`
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
`,bl=d(he)`
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

  ${an} {
    margin-right: 0;
  }
`,wl=d.input`
  display: none;
`,Io=d.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`,Lo=d.div`
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
`,xl=d.img`
  width: 100%;
  height: 150px;
  object-fit: contain;
  padding: 8px;
  box-sizing: border-box;
  background-color: ${r.colors.backgroundLighter};
`,zo=d.div`
  padding: 1rem;
  font-weight: ${r.fontWeights.semiBold};
  text-align: center;
`,yl=d.div`
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
`,kl=d.div`
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
`,vl=()=>{const e=Ze(),t=f.useMemo(()=>el(e).flatMap(v=>v.options).filter(v=>v.label!=="Empty YAML configuration"),[e]),i=ln(),o=_e(),[s,a]=f.useState(""),[c,u]=f.useState("github"),[m,l]=f.useState(!1),[g,b]=f.useState(!1),h=m||g,[x,k]=f.useState(!1),p=f.useRef(null),[y,_]=f.useState(!1);f.useEffect(()=>{const v=V=>{p.current&&!p.current.contains(V.target)&&_(!1)};return document.addEventListener("mousedown",v),()=>document.removeEventListener("mousedown",v)},[]);const[L,S]=f.useState(!1),P=v=>{a(v),v.includes("github.com/")?u("github"):v.includes("codeberg.org/")?u("codeberg"):(v.startsWith("http://")||v.startsWith("https://")||v.includes("/")&&!v.includes("github.com/")&&!v.includes("codeberg.org/")&&v.split("/")[0].includes("."))&&u("forgejo")},{currentConflict:$,processInjectionsWithConflictResolution:z,handleConflictResolution:D,handleConflictCancel:I}=Ct({setInjectionInput:v=>o==null?void 0:o.setInjectionInput(v),setConfigInput:v=>o==null?void 0:o.setConfigInput(v),generateNow:async(v,V,H)=>{o&&await o.generateNow(v,V,H)},getCurrentInjections:()=>(o==null?void 0:o.injectionInput)||[],onComplete:async()=>{k(!0)},setError:v=>o==null?void 0:o.setError(v)});f.useEffect(()=>{const v=new URLSearchParams(window.location.search),V=v.has("github")||v.has("codeberg")||v.has("forgejo")||v.has("gitea");(x||V)&&(o!=null&&o.configInput)&&(i("/"),k(!1))},[x,o==null?void 0:o.configInput,i]),f.useEffect(()=>{var v;(v=o==null?void 0:o.pruneDeletedConfigs)==null||v.call(o)},[o]);const w=async v=>{if(o){const V=v===rn.value;let H="unknown";if(V)H="empty_configuration";else{const Q=t.find(q=>q.value===v);Q&&(H=Q.label.toLowerCase().replace(/\s+/g,"_"))}M("example_loaded",{example_name:H,is_empty:V}),o.createNewConfig(v),await o.generateNow(v,o.injectionInput,{pointsonly:!1}),k(!0)}},C=async v=>{if(o){const V=o.configs.find(H=>H.id===v);V&&(o.selectConfig(v),M("saved_config_loaded",{stored_configs_count:o.configs.length}),await o.generateNow(V.config,o.injectionInput,{pointsonly:!1}),k(!0))}},R=[...(o==null?void 0:o.configs)||[]].sort((v,V)=>new Date(V.updatedAt).getTime()-new Date(v.updatedAt).getTime()).slice(0,4),O=async(v,V,H,Q,q=null,se)=>{if(!o)throw new Error("Configuration context not available");const ie=dr(v,V,H);await z(ie,Q,q,se)},U=async(v,V)=>{await D(v,V)},F=()=>{I(),l(!1),b(!1),o==null||o.setIsGenerating(!1)},te=()=>{if(!s||!o)return;const{setError:v,clearError:V,setIsGenerating:H}=o;b(!0),H(!0),V(),M("repo_loaded",{provider:c});let Q=s.trim();if(!Q.includes("://")&&!Q.includes("github.com")&&!Q.includes("codeberg.org"))if(c==="codeberg")Q=`https://codeberg.org/${Q}`;else if(c==="forgejo"){const q=Q.split("/");if(q.length>=2&&q[0].includes("."))Q=`https://${Q}`;else{v("Forgejo/Gitea requires a URL including the host (e.g., host/owner/repo)"),b(!1),H(!1);return}}else Q=`https://github.com/${Q}`;ur(Q).then(async q=>{if(o){q.rateLimitWarning&&v(q.rateLimitWarning);try{o.createNewConfig(q.config),await O(q.footprints,q.outlines,q.templates||[],q.config)}catch(se){throw new Error(`Failed to process footprints: ${se instanceof Error?se.message:"Unknown error"}`)}}}).catch(q=>{v(`Failed to load from ${c==="github"?"GitHub":c==="codeberg"?"Codeberg":"Forgejo/Gitea"} repository: ${q.message}`),o==null||o.setInfo(null),b(!1),H(!1)}).finally(()=>{b(!1)})},Y=f.useRef(null),ne=()=>{var v;(v=Y.current)==null||v.click()},X=async v=>{if(!o)return;const{setError:V,clearError:H,setIsGenerating:Q}=o;l(!0),Q(!0),H(),M("local_file_loaded",{file_type:Jr(v.name),file_size:v.size});try{const q=await nl(v);o.createNewConfig(q.config),await O(q.footprints,q.outlines,q.templates||[],q.config)}catch(q){V(`Failed to load local file: ${q instanceof Error?q.message:"Unknown error"}`),o.setInfo(null),l(!1),Q(!1)}finally{l(!1)}},B=async v=>{var H;const V=(H=v.target.files)==null?void 0:H[0];V&&(v.target.value="",await X(V))},W=v=>{v.preventDefault(),v.stopPropagation(),!h&&S(!0)},T=v=>{v.preventDefault(),v.stopPropagation()},Z=v=>{if(v.preventDefault(),v.stopPropagation(),h)return;const V=v.currentTarget,H=v.relatedTarget;(!H||!V.contains(H))&&S(!1)},G=async v=>{if(v.preventDefault(),v.stopPropagation(),h)return;S(!1);const V=Array.from(v.dataTransfer.files),H=[".yaml",".yml",".json",".zip",".ekb"],Q=V.find(q=>{const se=q.name.toLowerCase();return H.some(ie=>se.endsWith(ie))});Q?await X(Q):V.length>0&&o&&o.setError("Invalid file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")};return n.jsxs(ol,{$isDragging:L,onDragEnter:W,onDragOver:T,onDragLeave:Z,onDrop:G,"data-testid":"welcome-page-wrapper",children:[n.jsx(rl,{$isVisible:L,children:n.jsx(il,{children:"Drop file here to load configuration"})}),$&&n.jsx($t,{injectionName:$.name,injectionType:$.type,onResolve:U,onCancel:F,"data-testid":"conflict-dialog"}),n.jsxs(sl,{children:[n.jsx(al,{children:"Ergogen Web UI"}),n.jsxs(ll,{children:["A web-based interface for Ergogen, the ergonomic keyboard generator.",n.jsx("br",{}),"Start a new design below."]}),n.jsxs(cl,{children:[n.jsxs(Tt,{children:[n.jsx("h2",{children:"Start Fresh"}),n.jsx("p",{children:"Begin with a completely blank slate."}),n.jsx(he,{onClick:()=>w(rn.value),"aria-label":"Start with empty configuration","data-testid":"empty-config-button",children:"Empty Configuration"})]}),n.jsxs(Tt,{children:[n.jsx("h2",{children:"From Local File"}),n.jsx("p",{children:"Load a configuration from your computer. Supports *.yaml, *.json, *.zip, and *.ekb files."}),n.jsx(wl,{ref:Y,type:"file",accept:".yaml,.yml,.json,.zip,.ekb",onChange:B,disabled:h,"aria-label":"Select local file to load","data-testid":"local-file-input"}),n.jsx(he,{onClick:ne,disabled:h,"aria-label":"Select local file to load","data-testid":"local-file-button",children:m?n.jsxs(n.Fragment,{children:[n.jsx(an,{})," Loading..."]}):"Choose File"})]}),n.jsxs(Tt,{children:[n.jsx("h2",{children:"From Repo"}),n.jsx("p",{children:'Link to a YAML config file on a Git provider (e.g. GitHub, Codeberg, Forgejo), or simply a repository name like "user/repo".'}),n.jsx(dl,{children:n.jsxs(ul,{children:[n.jsxs(pl,{ref:p,children:[n.jsxs(fl,{type:"button",onClick:()=>_(!y),disabled:h,"aria-label":"Repository provider source","data-testid":"repo-provider-trigger",children:[c==="github"?n.jsx(sn,{}):c==="codeberg"?n.jsx(Eo,{}):n.jsx(Po,{}),n.jsx("span",{className:"material-symbols-outlined",children:"arrow_drop_down"})]}),y&&n.jsxs(ml,{children:[n.jsxs(Gt,{$active:c==="github",onClick:()=>{u("github"),_(!1)},children:[n.jsx(sn,{}),"GitHub"]}),n.jsxs(Gt,{$active:c==="codeberg",onClick:()=>{u("codeberg"),_(!1)},children:[n.jsx(Eo,{}),"Codeberg"]}),n.jsxs(Gt,{$active:c==="forgejo",onClick:()=>{u("forgejo"),_(!1)},children:[n.jsx(Po,{}),"Forgejo"]})]})]}),n.jsx(hl,{}),n.jsx(gl,{placeholder:c==="forgejo"?"host/user/repo":"user/repo",value:s,onChange:v=>P(v.target.value),onKeyDown:v=>{v.key==="Enter"&&!h&&s.trim()!==""&&(v.preventDefault(),te())},disabled:h,"aria-label":"Repository URL or path","data-testid":"repo-input"}),n.jsx(bl,{onClick:te,disabled:h||!s,"aria-label":"Load configuration from repository","data-testid":"repo-load-button",children:g?n.jsx(an,{}):n.jsx("span",{className:"material-symbols-outlined",style:{display:"block"},children:"cloud_download"})})]})})]})]}),R.length>0&&n.jsxs(n.Fragment,{children:[n.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:r.fontSizes.h2},children:"Pick up where you left"}),n.jsx(Io,{style:{marginBottom:"3rem"},children:R.map(v=>n.jsxs(Lo,{onClick:()=>C(v.id),"aria-label":`Load ${v.name} configuration`,"data-testid":`saved-config-${v.name.toLowerCase().replace(/\s+/g,"-")}`,children:[v.previewSvg?n.jsx(yl,{dangerouslySetInnerHTML:{__html:v.previewSvg}}):n.jsx(kl,{children:n.jsx("span",{className:"material-symbols-outlined",children:"keyboard_off"})}),n.jsx(zo,{children:v.name})]},v.id))})]}),n.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:r.fontSizes.h2},children:"Or start from an example"}),n.jsx(Io,{children:t.map(v=>n.jsxs(Lo,{onClick:()=>w(v.value),"aria-label":`Load ${v.label} example`,"data-testid":`example-${v.label.toLowerCase().replace(/\s+/g,"-")}`,children:[n.jsx(xl,{src:`/images/previews/${v.label.toLowerCase().replace(/[\s()]/g,"_")}.svg`,alt:`${v.label} preview`}),n.jsx(zo,{children:v.label})]},v.label))})]})]})},kr=({versionInfo:e,"data-testid":t})=>{const[i,o]=f.useState(!1),s=f.useRef(null),a=()=>{s.current&&clearTimeout(s.current),o(!0)},c=()=>{s.current=setTimeout(()=>{o(!1)},250)},u=()=>{s.current&&clearTimeout(s.current)},m=()=>{s.current=setTimeout(()=>{o(!1)},250)},l=g=>{g.stopPropagation(),o(b=>!b)};return f.useEffect(()=>{if(!i)return;const g=()=>{o(!1)};return window.addEventListener("click",g),()=>{window.removeEventListener("click",g)}},[i]),f.useEffect(()=>()=>{s.current&&clearTimeout(s.current)},[]),n.jsxs(_l,{onMouseEnter:a,onMouseLeave:c,"data-testid":t,children:[n.jsx(jl,{onClick:l,"data-testid":t&&`${t}-badge`,"aria-label":"Custom Ergogen version indicator",children:n.jsx("span",{className:"material-symbols-outlined",children:"science"})}),i&&n.jsxs($l,{onMouseEnter:u,onMouseLeave:m,onClick:g=>g.stopPropagation(),"data-testid":t&&`${t}-popover`,children:[n.jsx(Cl,{children:"Custom Ergogen Version"}),n.jsx(Sl,{children:"This website is running a custom version of Ergogen for development and preview purposes."}),n.jsxs(El,{href:e.url,target:"_blank",rel:"noopener noreferrer","data-testid":t&&`${t}-link`,children:[n.jsx("span",{children:e.label}),n.jsx("span",{className:"material-symbols-outlined open-icon",children:"open_in_new"})]})]})]})},_l=d.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  transform: translateY(-5px);
`,jl=d.span`
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
`,$l=d.div`
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
`,Cl=d.div`
  font-size: 12px;
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
`,Sl=d.div`
  font-size: 11px;
  color: ${r.colors.textDark};
  line-height: 1.4;
`,El=d.a`
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
`,Pl=yt`
  0%   { box-shadow: 0 0 0 0   ${r.colors.accent}99; }
  70%  { box-shadow: 0 0 0 6px ${r.colors.accent}00; }
  100% { box-shadow: 0 0 0 0   ${r.colors.accent}00; }
`,Il=yt`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`,Ll=d.button`
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
  animation: ${Pl} ${e=>e.$isUpdating?"0.6s":"2s"}
    ease-out infinite;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  .material-symbols-outlined {
    font-size: 14px !important;
    ${e=>e.$isUpdating&&qo`
        animation: ${Il} 1s linear infinite;
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
`,zl=({onClick:e,"data-testid":t})=>{const[i,o]=f.useState(!1),s=()=>{o(!0),e()};return n.jsxs(Ll,{onClick:s,disabled:i,$isUpdating:i,"aria-label":i?"Updating version...":"Update available — click to reload and apply","data-testid":t??"update-chip",children:[n.jsx("span",{className:"material-symbols-outlined","aria-hidden":"true",children:i?"sync":"update"}),i?"Updating version...":"Update Available"]})},Dl=d.header`
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
`,Al=d.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: row;
  flex-grow: 1;
  min-width: 0;
  width: 100%;
`,Rl=d.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,Nl=d.div`
  display: flex;
  align-items: center;
  gap: 6px;
`,Ul=d.div`
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
`,Ol=d(St)`
  flex-shrink: 0;
`,Wl=d(St)`
  background-color: ${r.colors.accent};
  border-color: ${r.colors.accent};

  &:hover {
    background-color: ${r.colors.accentDark};
    border-color: ${r.colors.accentDarker};
  }

  @media (max-width: 375px) {
    display: none;
  }
`,Fl=d.span`
  @media (max-width: 510px) {
    display: none;
  }
`,Do=d(St)`
  @media (max-width: 475px) {
    display: none;
  }
`,Ml=d(Yo)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,Bl=d.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,Tl=({onUpdate:e})=>{const t=_e(),i=ln(),o=Xo(),{activeConfigId:s,activeConfigName:a,configs:c,isPreview:u,renameConfig:m,duplicateConfig:l,deleteConfig:g,savePreviewConfig:b}=t||{},[h,x]=f.useState(!1),[k,p]=f.useState(!1),[y,_]=f.useState(""),L=()=>{a&&s&&(_(a),p(!0))},S=U=>{U&&U.stopPropagation(),!(m&&s&&y.trim()&&!m(s,y.trim()))&&p(!1)},P=U=>{U&&U.stopPropagation(),p(!1)},$=U=>{U.key==="Enter"?S():U.key==="Escape"&&p(!1)},z=U=>{U.stopPropagation(),l&&s&&l(s)},D=U=>{U.stopPropagation(),s&&a&&g&&window.confirm(`Are you sure you want to delete "${a}"?`)&&(g(s),(c&&c.length<=1||s)&&i("/new"))},I=()=>{t==null||t.setShowSettings(!(t!=null&&t.showSettings))},w=()=>{t==null||t.setShowSettings(!1),t==null||t.selectConfig(null),i("/new")},C=()=>{var U,F,te;!(t!=null&&t.results)||!(t!=null&&t.configInput)||t!=null&&t.isGenerating||t!=null&&t.isJscadConverting||(M("archive_single_downloaded",{has_injections:!!((U=t.injectionInput)!=null&&U.length),injections_count:((F=t.injectionInput)==null?void 0:F.length)||0,stored_configs_count:((te=t.configs)==null?void 0:te.length)||0,source:"header"}),pr(t.results,t.configInput,t.injectionInput,t.debug,t.stlPreview))},A=()=>{var U,F;t!=null&&t.configInput&&(M("share_button_clicked",{has_injections:!!((U=t.injectionInput)!=null&&U.length),injections_count:((F=t.injectionInput)==null?void 0:F.length)||0,source:"header"}),x(!0))},R=()=>{t==null||t.setShowSideNav(!(t!=null&&t.showSideNav))},O=f.useMemo(()=>dn("github:ceoloide/ergogen#v4.3.0"),[]);return n.jsxs(n.Fragment,{children:[h&&n.jsx(yr,{config:(t==null?void 0:t.configInput)||"",injections:(t==null?void 0:t.injectionInput)||[],onClose:()=>x(!1),"data-testid":"share-dialog"}),n.jsxs(Dl,{children:[n.jsxs(Al,{children:[n.jsx(Ol,{onClick:R,"aria-label":t!=null&&t.showSideNav?"Hide navigation panel":"Show navigation panel","data-testid":"side-nav-toggle-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"side_navigation"})}),n.jsxs(Nl,{children:[n.jsx(Ml,{to:"/","aria-label":"Go to home page","data-testid":"logo-button",children:n.jsx(Bl,{src:"/ergogen.png",alt:"Ergogen logo"})}),n.jsxs(Ul,{children:["Ergogen",O.isCustom&&n.jsx(kr,{versionInfo:O,"data-testid":"header-dev-chip"})]})]}),a&&n.jsxs(n.Fragment,{children:[n.jsx(Vl,{children:"/"}),n.jsxs(Gl,{"data-testid":"header-active-config-name",$isEditing:k,onClick:!k&&!u?L:void 0,children:[u&&n.jsx(ql,{"data-testid":"header-shared-icon",children:n.jsx("span",{className:"material-symbols-outlined",children:"link"})}),k?n.jsxs(n.Fragment,{children:[n.jsx(Hl,{type:"text",value:y,onChange:U=>_(U.target.value),onBlur:S,onKeyDown:$,autoFocus:!0,"data-testid":"header-config-name-input","aria-label":"Edit configuration name"}),n.jsxs(Vt,{className:"header-actions-always-visible",children:[n.jsx(He,{onMouseDown:U=>{U.preventDefault()},onClick:S,"aria-label":"Confirm rename","data-testid":"header-confirm-rename-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"check"})}),n.jsx(He,{onMouseDown:U=>{U.preventDefault()},onClick:P,"aria-label":"Cancel rename","data-testid":"header-cancel-rename-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]})]}):u?n.jsxs(n.Fragment,{children:[n.jsx(Ro,{"data-testid":"header-config-name-text",children:a}),n.jsx(Vt,{className:"header-actions-always-visible",children:n.jsx(He,{onClick:U=>{U.stopPropagation(),b==null||b()},"aria-label":"Save preview configuration","data-testid":"header-save-preview-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"save"})})})]}):n.jsxs(n.Fragment,{children:[n.jsx(Ro,{title:"Click to rename","data-testid":"header-config-name-text",children:a}),n.jsxs(Vt,{className:"header-actions-hover",children:[n.jsx(He,{onClick:L,"aria-label":"Rename configuration","data-testid":"header-rename-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),n.jsx(Ao,{onClick:z,"aria-label":"Duplicate configuration","data-testid":"header-duplicate-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),n.jsx(Ao,{onClick:D,"aria-label":"Delete configuration","data-testid":"header-delete-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})]})]})]}),n.jsxs(Rl,{children:[e&&n.jsx(zl,{onClick:e,"data-testid":"header-update-chip"}),o.pathname==="/"&&n.jsxs(n.Fragment,{children:[n.jsxs(Wl,{onClick:w,"aria-label":"Start new configuration","data-testid":"new-config-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"add_2"}),n.jsx(Fl,{children:"New"})]}),n.jsx(Do,{onClick:C,disabled:(t==null?void 0:t.isGenerating)||(t==null?void 0:t.isJscadConverting),"aria-label":"Download archive of all generated files","data-testid":"header-download-outputs-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),n.jsx(Do,{onClick:A,disabled:!(t!=null&&t.configInput),"aria-label":"Share configuration","data-testid":"header-share-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"share"})})]}),o.pathname!=="/new"&&n.jsx(St,{onClick:I,"aria-label":t!=null&&t.showSettings?"Hide settings panel":"Show settings panel","data-testid":"settings-button",children:n.jsx("span",{className:"material-symbols-outlined",children:t!=null&&t.showSettings?"keyboard_alt":"settings"})})]})]})]})},Gl=d.div`
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
`,Vl=d.span`
  color: ${r.colors.textDark};
  font-size: ${r.fontSizes.sm};
  font-weight: ${r.fontWeights.semiBold};
  user-select: none;
  @media (max-width: 639px) {
    display: none;
  }
`,Ro=d.span`
  font-size: ${r.fontSizes.bodySmall};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  user-select: none;
`,Hl=d.input`
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
`,ql=d.div`
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
`,Kl=yt`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
`,Jl=d.div`
  position: fixed;
  top: 45px;
  left: 0;
  right: 0;
  width: 100%;
  height: 3px;
  background-color: transparent;
  overflow: hidden;
  z-index: 1000;
`,Xl=d.div`
  height: 100%;
  width: 25%;
  background-color: ${r.colors.accent};
  animation: ${Kl} 1.5s ease-in-out infinite;
`,Yl=({visible:e,"data-testid":t})=>e?n.jsx(Jl,{"data-testid":t,children:n.jsx(Xl,{})}):null,ct={info:{background:r.colors.info,text:r.colors.infoDark},warning:{background:r.colors.warning,text:r.colors.warningDark},error:{background:r.colors.error,text:r.colors.errorDark},success:{background:r.colors.success,text:r.colors.successDark}},dt=d.span.attrs({className:"material-symbols-outlined"})`
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
`,Zl=d.div`
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
`,Ql=()=>{const e=_e();if(!e)return null;const{error:t,deprecationWarning:i,skippedWarning:o,info:s,clearError:a,clearWarning:c,clearSkippedWarning:u,clearInfo:m}=e;return n.jsxs(Zl,{"data-testid":"banners-container",children:[s&&n.jsxs(ft,{type:"info","data-testid":"info-banner",children:[n.jsxs(ut,{children:[n.jsx(dt,{children:"info"}),n.jsx(pt,{children:s})]}),n.jsx(ht,{onClick:m,"aria-label":"Close info message","data-testid":"close-info-banner",children:"×"})]}),i&&n.jsxs(ft,{type:"warning","data-testid":"warning-banner",children:[n.jsxs(ut,{children:[n.jsx(dt,{children:"warning"}),n.jsx(pt,{children:i})]}),n.jsx(ht,{onClick:c,"aria-label":"Close warning message","data-testid":"close-warning-banner",children:"×"})]}),o&&n.jsxs(ft,{type:"warning","data-testid":"skipped-injections-banner",children:[n.jsxs(ut,{children:[n.jsx(dt,{children:"warning"}),n.jsx(pt,{children:o})]}),n.jsx(ht,{onClick:u,"aria-label":"Close feature warning message","data-testid":"close-skipped-banner",children:"×"})]}),t&&n.jsxs(ft,{type:"error","data-testid":"error-banner",children:[n.jsxs(ut,{children:[n.jsx(dt,{children:"error"}),n.jsx(pt,{children:t})]}),n.jsx(ht,{onClick:a,"aria-label":"Close error message","data-testid":"close-error-banner",children:"×"})]})]})},ec=()=>n.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-discord",viewBox:"0 0 16 16",children:n.jsx("path",{d:"M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"})}),No=({label:e,version:t,url:i,isCustom:o=!1,"data-testid":s,devBadgeTestId:a})=>{const c=()=>{window.open(i,"_blank","noopener,noreferrer")};return n.jsxs(tc,{onClick:c,$hasDevBadge:o,"aria-label":`View ${e==="Ergogen"?"Ergogen":`Ergogen ${e}`} ${t} on GitHub`,"data-testid":s,children:[n.jsx(sn,{}),n.jsxs(nc,{children:[n.jsx(oc,{children:e}),n.jsx(rc,{$isCustom:o,children:t})]}),o&&n.jsx(ic,{"data-testid":a,children:n.jsx(sc,{children:"DEV"})})]})},tc=d.button`
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
`,nc=d.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  line-height: 1.1;
  min-width: 0;
`,oc=d.span`
  font-size: 10px;
  font-weight: ${r.fontWeights.bold};
  color: ${r.colors.white};
  white-space: nowrap;
`,rc=d.span`
  font-size: 8px;
  color: ${e=>e.$isCustom?r.colors.accent:r.colors.textDark};
  white-space: nowrap;
`,ic=d.div`
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
`,sc=d.span`
  font-size: 8px;
  font-weight: ${r.fontWeights.bold};
  color: ${r.colors.accent};
  transform: rotate(-90deg);
  white-space: nowrap;
  line-height: 1;
`,ac=({isOpen:e,onClose:t,"data-testid":i})=>{const o=f.useRef(e),[s,a]=f.useState(e),[c,u]=f.useState(360),m=f.useRef(!1),l=f.useRef(0),g=f.useRef(360),b=_e(),h=ln(),x=vt.version,{configs:k,activeConfigId:p,selectConfig:y,renameConfig:_,duplicateConfig:L,deleteConfig:S,setIsBulkDownloadOpen:P}=b||{},[$,z]=f.useState(""),[D,I]=f.useState(null),[w,C]=f.useState(""),A=f.useMemo(()=>{if(!k)return[];let W=k;if($.trim()){const T=$.toLowerCase().split(/\s+/).filter(Boolean);T.length>0&&(W=k.filter(Z=>{const G=Z.name.toLowerCase();return T.some(v=>G.includes(v))}))}return[...W].sort((T,Z)=>{const G=T.updatedAt?new Date(T.updatedAt).getTime():0,v=Z.updatedAt?new Date(Z.updatedAt).getTime():0;if(G!==v)return v-G;const V=T.createdAt?new Date(T.createdAt).getTime():0,H=Z.createdAt?new Date(Z.createdAt).getTime():0;return V!==H?H-V:T.name.localeCompare(Z.name)})},[k,$]),R=()=>{y&&y(null),h("/new"),t()},O=()=>{M("bulk_download_dialog_opened",{stored_configs_count:(k==null?void 0:k.length)||0}),P&&P(!0),t()},U=W=>{y&&(y(W),h("/"),t())},F=(W,T)=>{I(W),C(T)},te=W=>{_&&w.trim()&&!_(W,w.trim())||I(null)},Y=W=>{L&&L(W)},ne=(W,T)=>{if(window.confirm(`Are you sure you want to delete "${T}"?`)&&S){S(W);const Z=p===W,G=k&&k.length<=1;(Z||G)&&(h("/new"),t())}};f.useEffect(()=>{const W=o.current;e&&!W?a(!0):!e&&W&&a(!1),e||I(null),o.current=e},[e]),f.useEffect(()=>{if(!$.trim())return;const W=setTimeout(()=>{M("search_performed",{query_length:$.trim().length})},1e3);return()=>clearTimeout(W)},[$]),f.useEffect(()=>{const W=v=>{if(!m.current)return;const V=v.clientX-l.current,H=g.current+V,Q=Math.min(600,window.innerWidth*.9),q=Math.max(360,Math.min(H,Q));u(q)},T=()=>{m.current&&(m.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},Z=v=>{if(!m.current)return;v.preventDefault();const H=v.touches[0].clientX-l.current,Q=g.current+H,q=Math.min(600,window.innerWidth*.9),se=Math.max(360,Math.min(Q,q));u(se)},G=()=>{m.current&&(m.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",W),window.addEventListener("mouseup",T),window.addEventListener("touchmove",Z,{passive:!1}),window.addEventListener("touchend",G),()=>{window.removeEventListener("mousemove",W),window.removeEventListener("mouseup",T),window.removeEventListener("touchmove",Z),window.removeEventListener("touchend",G)}},[]);const X=W=>{W.preventDefault(),W.stopPropagation(),m.current=!0,g.current=c,"touches"in W?l.current=W.touches[0].clientX:l.current=W.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};f.useEffect(()=>{if(!e)return;const W=T=>{T.key==="Escape"&&t()};return window.addEventListener("keydown",W),()=>{window.removeEventListener("keydown",W)}},[e,t]);const B=f.useMemo(()=>dn("github:ceoloide/ergogen#v4.3.0"),[]);return f.useEffect(()=>(e?document.body.style.overflow="hidden":document.body.style.overflow="",()=>{document.body.style.overflow=""}),[e]),n.jsxs(n.Fragment,{children:[n.jsx(lc,{"data-testid":i,onClick:t,$isOpen:e,$isOpening:s}),n.jsxs(cc,{"data-testid":i&&`${i}-panel`,$isOpen:e,$isOpening:s,$width:c,onClick:W=>W.stopPropagation(),children:[n.jsx(Ac,{onMouseDown:X,onTouchStart:X,"data-testid":i&&`${i}-resize-handle`}),n.jsxs(dc,{children:[n.jsxs(uc,{children:[n.jsx(pc,{to:"/",onClick:t,"aria-label":"Go to home page","data-testid":"side-nav-logo-button",children:n.jsx(fc,{src:"/ergogen.png",alt:"Ergogen logo"})}),n.jsxs(hc,{onClick:t,children:["Ergogen",B.isCustom&&n.jsx(kr,{versionInfo:B,"data-testid":"sidebar-dev-chip"})]})]}),n.jsx(gc,{onClick:t,"data-testid":i&&`${i}-close`,"aria-label":"Close navigation panel",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),n.jsxs(mc,{children:[n.jsxs(bc,{children:[n.jsxs(wc,{onClick:R,"aria-label":"New","data-testid":"side-nav-new-config-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"add"}),n.jsx("span",{children:"New"})]}),k&&k.length>0&&n.jsxs(xc,{onClick:O,"aria-label":"Download All","data-testid":"side-nav-download-all-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"download"}),n.jsx("span",{children:"Download All"})]})]}),n.jsxs(yc,{children:[n.jsx("span",{className:"material-symbols-outlined search-icon",children:"search"}),n.jsx(kc,{type:"text",placeholder:"Search configurations...",value:$,onChange:W=>z(W.target.value),"aria-label":"Search configurations"}),$&&n.jsx(vc,{onClick:()=>z(""),children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),n.jsxs(_c,{children:[n.jsx("span",{children:"Saved Configurations"}),n.jsx(jc,{children:A.length})]}),n.jsxs($c,{children:[A.map(W=>{const T=W.id===p,Z=D===W.id;return n.jsx(Cc,{$isActive:T,"data-testid":`config-item-${W.id}`,children:Z?n.jsxs(Pc,{onSubmit:G=>{G.preventDefault(),te(W.id)},children:[n.jsx(Ic,{type:"text",value:w,onChange:G=>C(G.target.value),autoFocus:!0,"aria-label":"Rename input"}),n.jsx(Uo,{type:"submit","aria-label":"Save name",children:n.jsx("span",{className:"material-symbols-outlined",children:"check"})}),n.jsx(Uo,{type:"button",onClick:()=>I(null),"aria-label":"Cancel rename",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}):n.jsxs(n.Fragment,{children:[n.jsxs(Sc,{onClick:()=>U(W.id),$isActive:T,title:W.name,children:[n.jsx("span",{className:"material-symbols-outlined",children:"description"}),n.jsx("span",{className:"config-title-text",children:W.name})]}),n.jsxs(Ec,{$isActive:T,children:[n.jsx(Ht,{onClick:()=>F(W.id,W.name),"aria-label":`Rename configuration ${W.name}`,children:n.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),n.jsx(Ht,{onClick:()=>Y(W.id),"aria-label":`Duplicate configuration ${W.name}`,children:n.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),n.jsx(Ht,{onClick:()=>ne(W.id,W.name),"aria-label":`Delete configuration ${W.name}`,children:n.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})},W.id)}),A.length===0&&n.jsx(Lc,{children:"No configurations found"})]})]}),n.jsx(zc,{children:n.jsxs(Dc,{children:[n.jsxs(Oo,{onClick:()=>{window.open("https://docs.ergogen.xyz/","_blank","noopener,noreferrer")},"aria-label":"Open documentation","data-testid":"side-nav-docs-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"description"}),n.jsx("span",{children:"Docs"})]}),n.jsx(Oo,{onClick:()=>{window.open("https://discord.ergogen.xyz","_blank","noopener,noreferrer")},"aria-label":"Join the Discord community","data-testid":"side-nav-discord-button",children:n.jsx(ec,{})}),n.jsx(No,{label:"Web UI",version:x,url:"https://github.com/ceoloide/ergogen-gui","data-testid":"side-nav-gui-version-button"}),n.jsx(No,{label:"Ergogen",version:B.displayText,url:B.url,isCustom:B.isCustom,"data-testid":"side-nav-ergogen-version-button",devBadgeTestId:"side-nav-ergogen-dev-badge"})]})})]})]})},lc=d.div`
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
`,cc=d.div`
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
`,dc=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 3em;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
`,uc=d.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`,pc=d(Yo)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,fc=d.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,hc=d.div`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  cursor: pointer;
  display: flex;
  align-items: center;
`,gc=d.button`
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
`,mc=d.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`,bc=d.div`
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
  flex-shrink: 0;
`,wc=d.button`
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
`,xc=d.button`
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
`,yc=d.div`
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
`,kc=d.input`
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
`,vc=d.button`
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
`,_c=d.div`
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
`,jc=d.span`
  background-color: ${r.colors.border};
  color: ${r.colors.white};
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: ${r.fontWeights.semiBold};
`,$c=d.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  flex: 1;
`,Cc=d.div`
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
`,Sc=d.button`
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
`,Ec=d.div.attrs({className:"item-actions-hover"})`
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
`,Pc=d.form`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 100%;
`,Ic=d.input`
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
`,Uo=d.button`
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
`,Lc=d.div`
  text-align: center;
  color: ${r.colors.textDark};
  font-size: ${r.fontSizes.bodySmall};
  margin-top: 2rem;
  font-style: italic;
`,zc=d.div`
  padding: 8px 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`,Dc=d.div`
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
`,Ac=d.div`
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
`,Rc=({isOpen:e,configs:t,injections:i,debug:o,stlPreview:s,onClose:a,"data-testid":c})=>{const[u,m]=f.useState(new Set),[l,g]=f.useState(!0),[b,h]=f.useState(!1),[x,k]=f.useState(0),[p,y]=f.useState(""),_=f.useRef(!1);if(f.useEffect(()=>{e&&(m(new Set(t.map(D=>D.id))),h(!1),k(0),y(""),_.current=!1)},[e,t]),!e)return null;const L=D=>{m(D?new Set(t.map(I=>I.id)):new Set)},S=(D,I)=>{const w=new Set(u);I?w.add(D):w.delete(D),m(w)},P=async()=>{if(u.size===0)return;h(!0),k(0),y(""),_.current=!1;const D=t.filter(I=>u.has(I.id));M("bulk_download_started",{selected_configs_count:u.size,only_configs:l});try{const I=await Ki(D,i,o,s,l,(w,C,A)=>{k(w),y(A)},()=>_.current);_.current||(I&&I.succeededCount===0&&I.failedCount>0?M("bulk_download_failed",{selected_configs_count:u.size,failed_configs_count:I.failedCount,only_configs:l,error_message:`All ${I.failedCount} selected configuration(s) failed to compile`}):I&&I.failedCount>0?M("bulk_download_partial",{selected_configs_count:u.size,failed_configs_count:I.failedCount,only_configs:l}):M("bulk_download_completed",{selected_configs_count:u.size,only_configs:l}))}catch(I){console.error("Error during bulk download:",I),M("bulk_download_failed",{selected_configs_count:u.size,only_configs:l,error_message:I instanceof Error?I.message:String(I)})}finally{_.current||a()}},$=()=>{b&&!_.current&&M("bulk_download_cancelled",{selected_configs_count:u.size,completed_configs_count:x,only_configs:l}),_.current=!0,a()},z=u.size>0?x/u.size*100:0;return n.jsx(Nc,{"data-testid":c,children:n.jsxs(Uc,{"data-testid":c&&`${c}-box`,children:[n.jsx(Oc,{children:"Download Configurations"}),b?n.jsxs(n.Fragment,{children:[n.jsxs(Zc,{children:[n.jsx(Qc,{children:n.jsx(ed,{style:{width:`${z}%`}})}),n.jsxs(td,{children:[n.jsx(nd,{children:p?p.includes(", ")?n.jsxs("div",{children:["Generating:",n.jsx(od,{children:p.split(", ").map(D=>n.jsx("li",{children:D},D))})]}):n.jsxs(Mo,{children:["Generating ",p]}):n.jsx(Mo,{children:"Preparing..."})}),n.jsxs(rd,{children:[x," / ",u.size]})]})]}),n.jsx(Fo,{children:n.jsx(id,{onClick:$,size:"medium",children:"Cancel"})})]}):n.jsxs(n.Fragment,{children:[n.jsx(Fc,{children:t.map(D=>{const I=u.has(D.id);return n.jsx(Mc,{children:n.jsxs(vr,{htmlFor:`bulk-check-${D.id}`,children:[n.jsx(Tc,{id:`bulk-check-${D.id}`,checked:I,onChange:w=>S(D.id,w.target.checked)}),n.jsx(Gc,{$checked:I}),n.jsx(Bc,{children:D.name})]})},D.id)})}),n.jsxs(Wc,{children:[n.jsx(Wo,{onClick:()=>L(!0),children:"Select All"}),n.jsx(Wo,{onClick:()=>L(!1),children:"Deselect All"})]}),n.jsxs(Vc,{children:[n.jsx(Hc,{children:"Only download configs"}),n.jsxs(qc,{$checked:l,htmlFor:"only-configs-switch",children:[n.jsx(Kc,{type:"checkbox",id:"only-configs-switch",checked:l,onChange:D=>g(D.target.checked)}),n.jsx(Jc,{$checked:l}),n.jsx(Xc,{$checked:l})]})]}),!l&&n.jsxs(Yc,{children:[n.jsx("span",{className:"material-symbols-outlined",children:"warning"}),n.jsx("span",{children:"Warning: Exporting generated outputs for multiple configurations may take a long time depending on the number of selected configurations, their complexity, and CPU speed."})]}),n.jsxs(Fo,{children:[n.jsx(_r,{onClick:$,size:"medium",children:"Cancel"}),n.jsxs(he,{onClick:P,disabled:u.size===0,size:"medium",children:["Download (",u.size,")"]})]})]})]})})},Nc=d.div`
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
`,Uc=d.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,Oc=d.h2`
  margin: 0 0 1rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
`,Wc=d.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 1.5rem;
`,Wo=d.button`
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
`,Fc=d.div`
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
`,Mc=d.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,Bc=d.span`
  color: ${r.colors.text};
  font-size: 13px;
  user-select: none;
`,vr=d.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  padding: 4px 0;
`,Tc=d.input.attrs({type:"checkbox"})`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`,Gc=d.div`
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

  ${vr}:hover & {
    border-color: ${r.colors.accent};
  }
`,Vc=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
`,Hc=d.span`
  color: ${r.colors.text};
  font-size: ${r.fontSizes.base};
  user-select: none;
`,qc=d.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: pointer;
`,Kc=d.input`
  opacity: 0;
  width: 0;
  height: 0;
`,Jc=d.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${e=>e.$checked?r.colors.accent:r.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`,Xc=d.span`
  position: absolute;
  top: 2px;
  left: ${e=>e.$checked?"18px":"2px"};
  width: 16px;
  height: 16px;
  background-color: ${r.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,Yc=d.div`
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
`,Fo=d.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: auto;
`,Zc=d.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`,Qc=d.div`
  background-color: ${r.colors.border};
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  width: 100%;
`,ed=d.div`
  background-color: ${r.colors.accent};
  height: 100%;
  transition: width 0.15s ease-out;
`,td=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`,nd=d.div`
  color: ${r.colors.text};
  max-width: 80%;
`,Mo=d.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,od=d.ul`
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
`,rd=d.span`
  color: ${r.colors.textDark};
  font-weight: ${r.fontWeights.semiBold};
`,_r=d(he)`
  background-color: ${r.colors.backgroundLighter};
  color: ${r.colors.textDark};

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`,id=d(_r)`
  width: 100%;
`;function sd(){return!!(window.location.hostname==="localhost"||window.location.hostname==="[::1]"||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))}function ad(e,t,i){e.addEventListener("statechange",()=>{var o,s;e.state==="installed"&&(navigator.serviceWorker.controller?(console.log("[SW] New content is available. Will be used when all existing tabs are closed or you reload."),(o=i==null?void 0:i.onUpdate)==null||o.call(i,t)):(console.log("[SW] Content is cached for offline use."),(s=i==null?void 0:i.onSuccess)==null||s.call(i,t)))})}async function jr(e,t){var i;try{const o=await navigator.serviceWorker.register(e);let s=null;const a=c=>{c===null||c===s||(s=c,ad(c,o,t))};o.addEventListener("updatefound",()=>a(o.installing)),o.waiting&&navigator.serviceWorker.controller?(i=t==null?void 0:t.onUpdate)==null||i.call(t,o):a(o.installing)}catch(o){console.error("[SW] Error during service worker registration:",o)}}async function ld(e,t){try{const i=await fetch(e,{headers:{"Service-Worker":"script"}}),o=i.headers.get("content-type");i.status===404||o!==null&&o.indexOf("javascript")===-1?(await(await navigator.serviceWorker.ready).unregister(),window.location.reload()):await jr(e,t)}catch{console.log("[SW] No internet connection found. App is running in offline mode.")}}function cd(e){!("serviceWorker"in navigator)||new URL("/",window.location.href).origin!==window.location.origin||window.addEventListener("load",()=>{const i="/service-worker.js";sd()?(ld(i,e),navigator.serviceWorker.ready.then(()=>{console.log("[SW] This web app is being served cache-first by a service worker. See https://cra.link/PWA for more details.")})):jr(i,e)})}const dd=({report:e,onAccept:t,onCancel:i,"data-testid":o})=>n.jsx(ud,{"data-testid":o,children:n.jsxs(pd,{"data-testid":o&&`${o}-box`,children:[n.jsx(fd,{children:"Version Compatibility Warning"}),n.jsx(hd,{children:"The shared link was created under a different environment. You may experience compatibility issues."}),n.jsxs(gd,{children:[e.guiWarning&&n.jsxs(qt,{"data-testid":o&&`${o}-gui-warning`,children:[n.jsxs(Kt,{children:["GUI Version Mismatch",n.jsx(Jt,{"data-testid":"gui-mismatch-badge",children:"Mismatch"})]}),n.jsxs(Xt,{children:["The shared link was created with a newer version of the GUI (",n.jsxs("strong",{children:["v",e.guiWarning.shared]}),") than your current version (",n.jsxs("strong",{children:["v",e.guiWarning.current]}),"). Some interface options or features may not function as expected."]})]}),e.ergogenWarning&&n.jsxs(qt,{"data-testid":o&&`${o}-ergogen-warning`,children:[n.jsxs(Kt,{children:["Ergogen Version Mismatch",n.jsx(Jt,{"data-testid":"ergogen-mismatch-badge",children:"Mismatch"})]}),n.jsxs(Xt,{children:["The shared link was created with a newer version of Ergogen (",n.jsx("strong",{children:e.ergogenWarning.shared}),") than your current version (",n.jsx("strong",{children:e.ergogenWarning.current}),"). Some features or syntax might not be supported."]})]}),e.customErgogenWarning&&n.jsxs(qt,{"data-testid":o&&`${o}-custom-ergogen-warning`,children:[n.jsxs(Kt,{children:["Custom Ergogen Version Used",n.jsx(Jt,{"data-testid":"custom-version-badge",children:"Custom"})]}),n.jsxs(Xt,{children:["The shared link was created using a custom version of Ergogen:"," ",n.jsx("strong",{children:e.customErgogenWarning.shared}),".",n.jsx("br",{}),"You can investigate the repository used here:",n.jsx("br",{}),n.jsx(md,{href:e.customErgogenWarning.url,target:"_blank",rel:"noopener noreferrer","data-testid":o&&`${o}-custom-repo-link`,children:e.customErgogenWarning.label})]})]})]}),n.jsxs(bd,{children:[n.jsx(xd,{onClick:i,size:"medium","data-testid":o&&`${o}-cancel`,"aria-label":"Cancel configuration loading",children:"Cancel"}),n.jsx(wd,{onClick:t,size:"medium","data-testid":o&&`${o}-accept`,"aria-label":"Accept and load configuration",children:"Accept and Load"})]})]})}),ud=d.div`
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
`,pd=d.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 550px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,fd=d.h2`
  margin: 0 0 0.5rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.error};
`,hd=d.p`
  margin: 0 0 1.5rem 0;
  font-size: ${r.fontSizes.base};
  color: ${r.colors.textDarker};
  line-height: 1.4;
`,gd=d.div`
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
`,md=d.a`
  display: inline-block;
  margin-top: 0.5rem;
  color: ${r.colors.accent};
  text-decoration: underline;
  word-break: break-all;

  &:hover {
    color: ${r.colors.accentSecondary};
  }
`,bd=d.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`,wd=d(he)`
  background-color: ${r.colors.accent};
  color: ${r.colors.white};

  &:hover {
    background-color: ${r.colors.accentDark};
  }
`,xd=d(he)`
  background-color: ${r.colors.backgroundLighter};
  color: ${r.colors.textDark};

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`;let Bo=null,To=!1;const yd=()=>{To||(Bo=wr(),To=!0);const e=Bo,t=[];let i=null;const o=f.useRef(null);if(e)if(e.success){const c=e.config;o.current===null&&(o.current={config:c.config,injections:c.injections,guiVersion:c.guiVersion,ergogenVersion:c.ergogenVersion}),window.history.replaceState(null,"",window.location.pathname+window.location.search)}else i=e.message,console.error("[App] Failed to load shared configuration from hash",{error:e.error,message:e.message,hashLength:window.location.hash.length}),window.history.replaceState(null,"",window.location.pathname+window.location.search);const[s,a]=f.useState(null);return f.useEffect(()=>{o.current&&a(o.current)},[]),n.jsx(ns,{initialInjectionInput:t,hashError:i,children:n.jsx(_d,{pendingSharedConfig:s})})};function kd(){const[e,t]=f.useState(null),i=new URLSearchParams(window.location.search).has("force_update");if(f.useEffect(()=>{cd({onUpdate:o=>{t(o)}})},[]),i)return()=>{console.log("[SW] Force-update triggered via ?force_update URL parameter."),window.location.reload()};if(e)return()=>{let o;if("serviceWorker"in navigator){let a=!1;navigator.serviceWorker.addEventListener("controllerchange",()=>{a||(a=!0,o&&clearTimeout(o),window.location.reload())})}const s=e.waiting;s?(s.postMessage({type:"SKIP_WAITING"}),o=setTimeout(()=>{window.location.reload()},1e3)):window.location.reload()}}function vd(){const[e,t]=f.useState(null),[i,o]=f.useState(!1),[s,a]=f.useState(!1),c=new URLSearchParams(window.location.search).has("force_install");return f.useEffect(()=>{(()=>{const h=typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches,x=window.navigator.standalone===!0;a(h||x)})();const g=h=>{h.preventDefault(),t(h),console.log("[PWA] beforeinstallprompt event fired and captured.")},b=()=>{console.log("[PWA] appinstalled event fired."),a(!0),o(!1)};return window.addEventListener("beforeinstallprompt",g),window.addEventListener("appinstalled",b),()=>{window.removeEventListener("beforeinstallprompt",g),window.removeEventListener("appinstalled",b)}},[]),{onInstall:()=>{M("pwa_install_click"),o(!0),e?(e.prompt(),e.userChoice.then(l=>{l.outcome==="accepted"?(console.log("[PWA] User accepted the install prompt"),M("pwa_install_accepted"),a(!0)):(console.log("[PWA] User dismissed the install prompt"),M("pwa_install_dismissed")),o(!1),t(null)})):(console.log("[PWA] Install prompt triggered (deferredPrompt is not available on this device/browser)"),alert('PWA installation is not supported by this browser or is restricted on this device. If you are on iOS/iPadOS, please open this site in Safari and select "Add to Home Screen" from the Share menu.'),o(!1))},isAvailable:!!e||c,isInstalled:s,isInstalling:i}}const _d=({pendingSharedConfig:e})=>{var S;const t=_e(),i=t==null?void 0:t.configInput,o=Xo(),s=kd(),a=vd(),c=f.useRef(0);c.current=((S=t==null?void 0:t.configs)==null?void 0:S.length)||0,f.useEffect(()=>{M("page_view",{page_path:o.pathname,stored_configs_count:c.current})},[o.pathname]);const u=f.useRef(!1),m=f.useRef(e);e!==m.current&&(m.current=e);const{currentConflict:l,processInjectionsWithConflictResolution:g,handleConflictResolution:b,handleConflictCancel:h}=Ct({setInjectionInput:P=>t==null?void 0:t.setInjectionInput(P),setConfigInput:P=>t==null?void 0:t.loadPreview(P),generateNow:async(P,$,z)=>{t&&await t.generateNow(P,$,z)},getCurrentInjections:()=>(t==null?void 0:t.injectionInput)||[],onComplete:async(P,$)=>{localStorage.setItem("ergogen:injection",JSON.stringify($)),t==null||t.loadPreview(P)},setError:P=>t==null?void 0:t.setError(P)}),[x,k]=f.useState(null),p=(P,$)=>{const z=vt.version,D=un("github:ceoloide/ergogen#v4.3.0");let I=!0,w,C,A;if(P){const R=Ue(z),O=Ue(P);R&&O&&!Yt(R,O)&&(I=!1,w={current:z,shared:P})}if($){if(Mr($)&&$!==D){I=!1;const U=dn($);A={shared:$,url:U.url,label:U.label}}const R=ro(D)||Ze(),O=ro($);if(O){const U=Ue(R),F=Ue(O);U&&F&&!Yt(U,F)&&(I=!1,C={current:R,shared:O})}}return{isCompatible:I,guiWarning:w,ergogenWarning:C,customErgogenWarning:A}},y=f.useCallback((P,$)=>{t&&($!==void 0&&$.length>0?g($,P).catch(z=>{console.error("[App] Error processing injections:",z),t.setError(`Failed to process injections: ${z instanceof Error?z.message:"Unknown error"}`)}):(t.loadPreview(P),t.generateNow(P,t.injectionInput,{pointsonly:!1})))},[t,g]),_=()=>{var P;x&&(M("shared_config_accepted",{has_injections:!!(x.injections&&x.injections.length>0),injections_count:((P=x.injections)==null?void 0:P.length)||0}),y(x.config,x.injections),k(null))},L=()=>{var P;x&&M("shared_config_declined",{has_injections:!!(x.injections&&x.injections.length>0),injections_count:((P=x.injections)==null?void 0:P.length)||0}),k(null)};return f.useEffect(()=>{if(!t||!e||u.current)return;u.current=!0;const P=p(e.guiVersion,e.ergogenVersion);P.isCompatible?y(e.config,e.injections):k({config:e.config,injections:e.injections,report:P})},[t,e,y]),f.useEffect(()=>{if(!t)return;const P=()=>{const $=wr();if($)if($.success){const z=$.config,D=p(z.guiVersion,z.ergogenVersion);D.isCompatible?y(z.config,z.injections):k({config:z.config,injections:z.injections,report:D}),window.history.replaceState(null,"",window.location.pathname+window.location.search)}else console.error("[App] Failed to load shared configuration from hash (hashchange)",{error:$.error,message:$.message,hashLength:window.location.hash.length}),t.setError($.message),window.history.replaceState(null,"",window.location.pathname+window.location.search)};return window.addEventListener("hashchange",P),()=>{window.removeEventListener("hashchange",P)}},[t,y]),n.jsxs(n.Fragment,{children:[x&&n.jsx(dd,{report:x.report,onAccept:_,onCancel:L,"data-testid":"share-compatibility-dialog"}),l&&n.jsx($t,{injectionName:l.name,injectionType:l.type,onResolve:b,onCancel:h,"data-testid":"conflict-dialog"}),(t==null?void 0:t.isBulkDownloadOpen)&&n.jsx(Rc,{isOpen:t.isBulkDownloadOpen,configs:t.configs,injections:t.injectionInput,debug:t.debug,stlPreview:t.stlPreview,onClose:()=>t.setIsBulkDownloadOpen(!1),"data-testid":"bulk-download-dialog"}),n.jsx(Tl,{onUpdate:s}),n.jsx(Yl,{visible:(t==null?void 0:t.isGenerating)??!1,"data-testid":"loading-bar"}),n.jsx(Ql,{}),n.jsx(ac,{isOpen:(t==null?void 0:t.showSideNav)??!1,onClose:()=>t==null?void 0:t.setShowSideNav(!1),"data-testid":"side-navigation"}),n.jsx(jd,{children:n.jsxs(Nr,{children:[n.jsx(Dt,{path:"/",element:i?n.jsx(Da,{pwaState:a}):n.jsx(oo,{to:{pathname:"/new",search:o.search},replace:!0})}),n.jsx(Dt,{path:"/new",element:n.jsx(vl,{})}),n.jsx(Dt,{path:"*",element:n.jsx(oo,{to:"/",replace:!0})})]})})]})},jd=d.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;let Go=!1;const $d=e=>{Go||(e.editor.defineTheme("ergogen-theme",{base:"vs-dark",inherit:!0,rules:[],colors:{"editor.background":r.colors.backgroundLight}}),Go=!0)};rr();const Cd=d.div`
  display: flex;
  flex-direction: column;
  color: #ffffff;
  height: 100%;
  width: 100%;
  font-family: 'Roboto', sans-serif;
`,Sd=Ur`
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
`;Zo.config({paths:{vs:"/monaco/vs"}});Zo.init().then(e=>{$d(e);const t=document.getElementById("root");Or(t).render(n.jsx(Jo.StrictMode,{children:n.jsx(Wr,{basename:("/".startsWith("."),"/"),children:n.jsxs(Cd,{children:[n.jsx(Sd,{}),n.jsx(yd,{})]})})}))});export{bt as a,r as t};
