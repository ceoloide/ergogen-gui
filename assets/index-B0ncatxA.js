const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/PcbPreview-DsKQssW6.js","assets/vendor-C9A_qoZ1.js","assets/StlPreview-BY1EHQ5G.js","assets/three-BJECO8Vk.js","assets/js-yaml-DW8Bub87.js","assets/jszip-cZtdyB0p.js"])))=>i.map(i=>d[i]);
import{f as qe,y as d,j as o,r as f,h as Ye,i as Zo,k as Wn,l as Fn,O as _t,p as Bn,m as Sr,n as Er,o as Mn,q as Tn,t as Pr,v as ao,w as Gn,L as Hn,x as Ir,z as At,N as Qo,A as zr,B as Vn,e as Lr,C as Dr}from"./vendor-C9A_qoZ1.js";import{j as fe}from"./js-yaml-DW8Bub87.js";import{J as Qe}from"./jszip-cZtdyB0p.js";import{_ as qn}from"./three-BJECO8Vk.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function s(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(i){if(i.ep)return;i.ep=!0;const a=s(i);fetch(i.href,a)}})();const Xe=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/ergogen.worker-yOrnwBol.js",import.meta.url),{type:"module"})}catch(e){return console.error("Failed to create worker:",e),null}},lo=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/jscad.worker-C8nLBdOi.js",import.meta.url),{type:"module"})}catch(e){return console.error("Failed to create JSCAD worker:",e),null}},Ar="0.19.3",vt={version:Ar},co=e=>{const t=`v${qe.version}`,s=qe.version,n=qe.repository,i=n.startsWith("github:")?n.replace("github:","https://github.com/"):n.replace(/^git\+/,"").replace(/\.git$/,"");if(!e)return{label:t,url:i,displayText:s,isCustom:!1,isHash:!1,isTag:!1};if(e.includes("@")){const x=e.split("@"),k=x[1]||e;return{label:e,url:e.startsWith("ergogen@")?`${i}/releases/tag/v${k}`:`https://www.npmjs.com/package/${x[0]}`,displayText:k,isCustom:!0,isHash:!1,isTag:!0}}const a=e.startsWith("github:")?e.slice(7):e,[c,p]=a.split("#"),m=c==="ergogen/ergogen",l=`https://github.com/${c}`;if(m){if(!p)return{label:"latest",url:l,displayText:s,isCustom:!1,isHash:!1,isTag:!1};const x=p.length===40&&/^[0-9a-fA-F]{40}$/.test(p),k=x?t:p,u=x?`${l}/commit/${p}`:`${l}/tree/${p}`;return{label:p,url:u,displayText:k,isCustom:!0,isHash:x,isTag:!x}}if(!p)return{label:a,url:l,displayText:s,isCustom:!0,isHash:!1,isTag:!1};const h=p.length===40&&/^[0-9a-fA-F]{40}$/.test(p),b=h?t:p,g=h?`${l}/commit/${p}`:`${l}/tree/${p}`;return{label:a,url:g,displayText:b,isCustom:!0,isHash:h,isTag:!h}},uo=e=>{if(e.includes("@")){const i=e.split("@"),a=i[1]||e,c=i[0];return`github:${c==="ergogen"?"ergogen/ergogen":c}#v${a}`}const t=e.startsWith("github:")?e.slice(7):e,[s,n]=t.split("#");return n?`github:${s}#${n}`:`github:${s}#v${qe.version}`},Ue=e=>{const s=e.replace(/^v/,"").match(/^(\d+)\.(\d+)\.(\d+)/);return s?[Number(s[1]),Number(s[2]),Number(s[3])]:null},Xt=(e,t)=>{for(let s=0;s<3;s++){if(e[s]>t[s])return!0;if(e[s]<t[s])return!1}return!0},en=e=>{const t=e.match(/(?:^|#|@|v)(\d+\.\d+\.\d+)/);return t?t[1]:null},Rr=e=>{const t=e.startsWith("github:")?e.slice(7):e,[s]=t.split("#");return!e.startsWith("github:")&&!e.includes("/")?!1:s!=="ergogen/ergogen"},Jn=()=>{if(typeof window>"u")return!1;const e=window.navigator;return typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches||e.standalone===!0},Kn=e=>{if(typeof window>"u")return!0;if(window.__FORCE_ANALYTICS__===!0||e.startsWith("G-TEST"))return!1;const t=window.location.hostname;return!!(t==="localhost"||t==="127.0.0.1"||t==="[::1]"||t.endsWith(".localhost"))},Nr=()=>{if(typeof document>"u"||!document.cookie)return;const e=document.cookie.split(";");for(const t of e){const s=t.indexOf("="),n=(s>-1?t.substring(0,s):t).trim();if(n.startsWith("_ga")){document.cookie=`${n}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`;const a=window.location.hostname.split(".");for(;a.length>0;){const c=a.join(".");document.cookie=`${n}=; Path=/; Domain=.${c}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`,document.cookie=`${n}=; Path=/; Domain=${c}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`,a.shift()}}}},Ur=()=>{if(!(typeof indexedDB>"u"))try{indexedDB.deleteDatabase("workbox-background-sync")}catch{}},Yn=()=>typeof window>"u"||!window.location?void 0:`${window.location.origin&&window.location.origin!=="null"?window.location.origin:`${window.location.protocol||"https:"}//${window.location.hostname||"localhost"}`}${window.location.pathname||"/"}`,Xn="ergogen:consent:sendUsageMetrics",Or="ergogen:config:sendUsageMetrics",Wr="ergogen:settings";let xt;const tn=e=>{const t=localStorage.getItem(e);if(t!==null)try{const s=JSON.parse(t);return typeof s=="boolean"?s:void 0}catch{return}},Fr=()=>{const e=localStorage.getItem(Wr);if(e!==null)try{const t=JSON.parse(e);return t&&typeof t=="object"&&typeof t.sendUsageMetrics=="boolean"?t.sendUsageMetrics:void 0}catch{return}},jt=()=>{if(typeof window>"u")return!1;if(xt!==void 0)return xt;try{const e=tn(Xn);if(e!==void 0)return e;if(tn(Or)===!1||Fr()===!1)return!1}catch{return!1}return!Jn()},Br=e=>{try{localStorage.setItem(Xn,JSON.stringify(e)),xt=void 0}catch{xt=e}};let Ge=!1;const Zn=()=>{var i;if(typeof window>"u")return;const e=jt(),t="G-46F2L343EK",s=Kn(t),n=document.getElementById("gtag-script");if(n||(Ge=!1),e&&t&&!s){delete window["ga-disable-"+t];const a=window,c={send_page_view:!1,allow_google_signals:!1,allow_ad_personalization_signals:!1},p=()=>{var m;return(m=a.gtag)==null?void 0:m.call(a,"set",{page_location:Yn()})};if(n)Ge&&(p(),(i=a.gtag)==null||i.call(a,"config",t,c),Ge=!1);else{const m=document.createElement("script");m.async=!0,m.src=`https://www.googletagmanager.com/gtag/js?id=${t}`,m.id="gtag-script",document.head.appendChild(m);const l=a.dataLayer||[];a.dataLayer=l,a.gtag=function(){l.push(arguments)},a.gtag("js",new Date),p(),a.gtag("config",t,c),Ge=!1}Kr()}else window["ga-disable-"+t]=!0,n&&(Ge=!0),Nr(),Ur(),Yr()},Mr=new Set(["yaml","yml","json","zip","ekb"]),Tr=e=>{const t=e.lastIndexOf("."),s=t>=0?e.slice(t+1).toLowerCase():"";return Mr.has(s)?s:"other"},Qn=100,Gr=/"[^"\n]*"|'[^'\n]*'|`[^`\n]*`/g,Hr=/^at\s|^[^\s@]*@\S+:\d+:\d+$/,Vr=e=>e.split(`
`)[0].replace(Gr,t=>`${t[0]}*${t[0]}`).trim().slice(0,Qn),qr=e=>{const t=e.split(`
`).map(s=>s.trim()).filter(s=>Hr.test(s));return t.length>0?t.join(" ").slice(0,Qn):void 0},Jr=e=>{const t={...e};for(const s of["error_message","description"]){const n=t[s];typeof n=="string"&&(t[s]=Vr(n))}return typeof t.error_stack=="string"&&(t.error_stack=qr(t.error_stack)),t},B=(e,t)=>{if(jt()&&!Kn("G-46F2L343EK")&&window.gtag){const n=Yn();window.gtag("set",{page_location:n}),window.gtag("event",e,{page_location:n,gui_version:vt.version,ergogen_version:uo("github:ceoloide/ergogen#v4.3.0"),is_pwa:Jn(),...Jr(t??{})})}},Je=(e,t=!1,s)=>{const n=e instanceof Error?e.message:e,i=e instanceof Error?e.stack:void 0;B("exception",{description:s?`[${s}] ${n}`:n,fatal:t,error_stack:i})};let yt=!1;const er=e=>{Je(e.error||e.message,!1,"unhandled_error")},tr=e=>{Je(e.reason||"Unhandled Promise Rejection",!1,"unhandled_rejection")},Kr=()=>{typeof window>"u"||yt||(window.addEventListener("error",er),window.addEventListener("unhandledrejection",tr),yt=!0)},Yr=()=>{typeof window>"u"||yt&&(window.removeEventListener("error",er),window.removeEventListener("unhandledrejection",tr),yt=!1)};function Xr(e){function t(l,h){return l>>>h|l<<32-h}const s=[],n=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],i=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],a=unescape(encodeURIComponent(e));for(let l=0;l<a.length;l++){const h=a.charCodeAt(l);s[l>>2]|=h<<24-l%4*8}const c=a.length;s[c>>2]|=128<<24-c%4*8;const p=(c+8>>6)+1;s[p*16-1]=c*8;for(let l=0;l<p;l++){const h=[];for(let S=0;S<16;S++)h[S]=s[l*16+S]||0;for(let S=16;S<64;S++){const E=t(h[S-15],7)^t(h[S-15],18)^h[S-15]>>>3,$=t(h[S-2],17)^t(h[S-2],19)^h[S-2]>>>10;h[S]=h[S-16]+E+h[S-7]+$|0}let b=n[0],g=n[1],x=n[2],k=n[3],u=n[4],y=n[5],v=n[6],z=n[7];for(let S=0;S<64;S++){const E=t(u,6)^t(u,11)^t(u,25),$=u&y^~u&v,L=z+E+$+i[S]+h[S]|0,D=t(b,2)^t(b,13)^t(b,22),I=b&g^b&x^g&x,w=D+I|0;z=v,v=y,y=u,u=k+L|0,k=x,x=g,g=b,b=L+w|0}n[0]=n[0]+b|0,n[1]=n[1]+g|0,n[2]=n[2]+x|0,n[3]=n[3]+k|0,n[4]=n[4]+u|0,n[5]=n[5]+y|0,n[6]=n[6]+v|0,n[7]=n[7]+z|0}let m="";for(let l=0;l<8;l++){const h=n[l];m+=(h>>>24&255).toString(16).padStart(2,"0"),m+=(h>>>16&255).toString(16).padStart(2,"0"),m+=(h>>>8&255).toString(16).padStart(2,"0"),m+=(h&255).toString(16).padStart(2,"0")}return m}function Zt(e,t){if(!e||typeof e!="object")return!1;const s=e;for(const n of t)if(s[n]===!0)return!0;for(const n of Object.keys(s))if(Zt(s[n],t))return!0;return!1}const Rt=e=>Math.round((e+Number.EPSILON)*100)/100,on=e=>{if(!e||typeof e!="object")return;const t=e.meta;if(!t||typeof t!="object")return;const s=t.zone;if(s){if(typeof s=="object"&&s!==null)return s.name;if(typeof s=="string")return s}};function Zr(e,t,s,n){const i=fe.load(e)||{},a=fe.load(t)||{},c=i.outlines||{},p=Object.keys(c),m=p.filter(Y=>!Y.startsWith("_")).length,l=p.length,h=Object.keys(i.pcbs||{}).length,b=Object.keys(i.cases||{}).length,g=Zt(i.pcbs,["reversible","reverse"]),x=Zt(i.points,["mirror"]),k=i.meta||{},u=k.name??"no_name",y=k.author??"no_author",v=i.points||{},z=Object.keys(v.zones||{}).length,S=v.zones||{},$=Object.keys(S).filter(Y=>{const M=S[Y];return M&&typeof M=="object"&&("columns"in M||"rows"in M)}),L=$.length,D=L>0;let I="",w="",C="",A=0;const R=Object.keys(a);if(D){const Y=[...$].sort(),M=[],W=[],T=[];for(const Z of Y){const G=S[Z],_=Object.keys((G==null?void 0:G.columns)||{}),H=Object.keys((G==null?void 0:G.rows)||{}),V=(G==null?void 0:G.mirror)===!0||typeof(G==null?void 0:G.mirror)=="object"&&(G==null?void 0:G.mirror)!==null,Q=v.mirror===!0||typeof v.mirror=="object"&&v.mirror!==null,q=V||Q;let ie=R.filter(We=>{const de=a[We];if(on(de)!==Z)return!1;if(de&&typeof de=="object"){const ge=de.meta;if(ge&&typeof ge=="object"&&ge.mirrored===!0)return!1}return!We.startsWith("mirror_")}).length;q&&(ie*=2),M.push(_.length),W.push(H.length),T.push(ie),A+=ie}I=M.join(","),w=W.join(","),C=T.join(",")}const O=R.map(Y=>{const M=a[Y],W=on(M),Z=(W?$.includes(W):!1)?"K":"A",G=Rt((M==null?void 0:M.x)??0),_=Rt((M==null?void 0:M.y)??0),H=Rt((M==null?void 0:M.r)??0);return{name:Y,type:Z,x:G,y:_,r:H}});O.sort((Y,M)=>Y.x!==M.x?Y.x-M.x:Y.y!==M.y?Y.y-M.y:Y.r!==M.r?Y.r-M.r:Y.name.localeCompare(M.name));const U=O.map(Y=>`${Y.type}${Y.x.toString()};${Y.y.toString()};${Y.r.toString()}`).join("|"),F=`${u}|${y}|${U}`,X=Xr(F).substring(0,12),ne=!x&&g?A*2:A;return{total_generation_time_ms:s,count_outlines:m,count_raw_outlines:l,count_pcbs:h,count_cases:b,is_reversible:g,is_mirrored:x,count_zones:z,matrix_zones:L,has_matrix:D,matrix_col_counts:I,matrix_row_counts:w,matrix_key_counts:C,matrix_keys:A,keyboard_keys:ne,config_id:X,previous_config_id:n}}const r={colors:{accent:"#28a745",accentDark:"#1e8e1e",accentDarker:"#1e7e34",accentSecondary:"#239923",background:"#222222",backgroundLight:"#2a2a2a",backgroundLighter:"#333333",border:"#3f3f3f",text:"#ffffff",textDark:"#ccc",textDarker:"#aaa",textDarkest:"#666",error:"#ff6d6d",errorDark:"#a31111",warning:"hsl(45, 100%, 90%)",warningDark:"hsl(32, 79%, 40%)",info:"hsl(206, 94%, 92%)",infoDark:"hsl(206, 100%, 30%)",success:"hsl(120, 73%, 92%)",successDark:"hsl(120, 50%, 35%)",white:"#fff",buttonHover:"#3f3f3f"},fonts:{body:"'Roboto', sans-serif",code:"source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"},fontSizes:{xs:"0.4rem",sm:"0.8rem",base:"1rem",lg:"1.2rem",iconMedium:"16px",iconLarge:"24px",bodySmall:"13px",h1:"2.5rem",h2:"2rem",h3:"1.5rem"},fontWeights:{regular:400,semiBold:600,bold:700},buttonSizes:{large:{padding:"1rem 2rem",fontSize:"1rem"},medium:{padding:"0.7rem 1.4rem",fontSize:"1rem"},small:{padding:"8px 12px",fontSize:"0.8rem"},icon:{padding:"8px 12px",fontSize:"0.4rem"}}},$t=d.button`
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
`,Qr=d($t)`
  padding: ${r.buttonSizes.medium.padding};
  font-size: ${r.buttonSizes.medium.fontSize};
`,ei=d($t)`
  padding: ${r.buttonSizes.small.padding};
  font-size: ${r.buttonSizes.small.fontSize};
`,ti=d($t)`
  padding: ${r.buttonSizes.icon.padding};
  font-size: ${r.buttonSizes.icon.fontSize};
`,he=({size:e,...t})=>{switch(e){case"icon":return o.jsx(ti,{...t});case"sm":case"small":return o.jsx(ei,{...t});case"md":case"medium":return o.jsx(Qr,{...t});case"lg":case"large":default:return o.jsx($t,{...t})}},oi=e=>e.charAt(0).toUpperCase()+e.slice(1),Ct=({injectionName:e,injectionType:t,onResolve:s,onCancel:n,"data-testid":i})=>{const[a,c]=f.useState(!1),p=oi(t);return o.jsx(ni,{"data-testid":i,children:o.jsxs(ri,{"data-testid":i&&`${i}-box`,children:[o.jsxs(ii,{children:[p," Conflict"]}),o.jsxs(si,{children:["A ",t," with the name ",o.jsx("strong",{children:e})," ","already exists.",o.jsx("br",{}),"How would you like to resolve this conflict?"]}),o.jsxs(ai,{children:[o.jsx(li,{type:"checkbox",id:"apply-to-all",checked:a,onChange:m=>c(m.target.checked),"data-testid":i&&`${i}-apply-to-all`,"aria-label":"Apply this choice to all conflicts"}),o.jsx(ci,{$checked:a,onClick:()=>c(!a),role:"checkbox","aria-checked":a}),o.jsx("label",{htmlFor:"apply-to-all",children:"Apply to all conflicts"})]}),o.jsxs(di,{children:[o.jsx(he,{onClick:()=>s("skip",a),size:"medium","data-testid":i&&`${i}-skip`,"aria-label":`Skip this ${t}`,children:"Skip"}),o.jsx(he,{onClick:()=>s("overwrite",a),size:"medium","data-testid":i&&`${i}-overwrite`,"aria-label":`Overwrite existing ${t}`,children:"Overwrite"}),o.jsx(he,{onClick:()=>s("keep-both",a),size:"medium","data-testid":i&&`${i}-keep-both`,"aria-label":`Keep both ${t}s`,children:"Keep Both"})]}),o.jsx(ui,{onClick:n,size:"small","data-testid":i&&`${i}-cancel`,"aria-label":"Cancel loading",children:"Cancel"})]})})},ni=d.div`
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
`,ri=d.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`,ii=d.h2`
  margin: 0 0 1rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
`,si=d.p`
  margin: 0 0 1.5rem 0;
  font-size: ${r.fontSizes.base};
  color: ${r.colors.textDark};
  line-height: 1.5;

  strong {
    color: ${r.colors.accent};
  }
`,ai=d.div`
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
`,li=d.input`
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
`,ci=d.div`
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
`,di=d.div`
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  margin-bottom: 1rem;
`,ui=d(he)`
  width: 100%;
  background-color: ${r.colors.backgroundLighter};
  color: ${r.colors.textDark};

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`,Oe=e=>Array.isArray(e)&&e.length===3&&typeof e[0]=="string"&&typeof e[1]=="string"&&typeof e[2]=="string",or=(e,t,s)=>!s||s.length===0?{hasConflict:!1}:s.some(i=>Oe(i)&&i[0]===e&&i[1]===t)?{hasConflict:!0,conflictingName:t}:{hasConflict:!1},pi=(e,t)=>{if(!t||t.length===0)return[];const s=[];for(const n of e){if(!Oe(n))continue;const[i,a]=n,c=or(i,a,t);c.hasConflict&&s.push({injection:n,conflict:c})}return s},nr=(e,t,s)=>{if(!s||s.length===0)return t;const n=new Set(s.filter(c=>Oe(c)&&c[0]===e).map(c=>c[1]));let i=1,a=`${t}_${i}`;for(;n.has(a);)i++,a=`${t}_${i}`;return a},Nt=(e,t,s)=>{const n=t?[...t]:[];for(const i of e){if(!Oe(i)){console.warn("[mergeInjectionArraysWithResolution] Skipping invalid injection format:",i);continue}const[a,c,p]=i;if(!or(a,c,n).hasConflict)n.push([a,c,p]);else{if(s==="skip")continue;if(s==="overwrite"){const l=n.findIndex(h=>Oe(h)&&h[0]===a&&h[1]===c);l!==-1&&(n[l]=[a,c,p])}else if(s==="keep-both"){const l=nr(a,c,n);n.push([a,l,p])}}}return n},St=e=>{const[t,s]=f.useState([]),n=t.length>0?t[0]:null,[i,a]=f.useState(null),[c,p]=f.useState(null),[m,l]=f.useState(null),h=f.useCallback(async(x,k,u=null,y)=>{var L,D,I;const v=y||e.getCurrentInjections();if(x.length===0){e.setInjectionInput(v),e.setConfigInput(k),await e.generateNow(k,v,{pointsonly:!1}),await((L=e.onComplete)==null?void 0:L.call(e,k,v));return}const z=x.filter(w=>Oe(w)?!0:(console.warn("[useInjectionConflictResolution] Skipping invalid injection format:",w),!1));if(z.length===0){e.setInjectionInput(v),e.setConfigInput(k),await e.generateNow(k,v,{pointsonly:!1}),await((D=e.onComplete)==null?void 0:D.call(e,k,v));return}const S=pi(z,v);if(S.length>0&&!u){const w=S.map(C=>({injection:C.injection,conflict:C.conflict}));B("conflict_encountered",{conflict_count:S.length}),s(w),a(z),p(k),l(v);return}const $=Nt(z,v,u||"skip");e.setInjectionInput($),e.setConfigInput(k),await e.generateNow(k,$,{pointsonly:!1}),await((I=e.onComplete)==null?void 0:I.call(e,k,$))},[e]),b=f.useCallback(async(x,k)=>{var u,y;if(!(!i||!c||t.length===0))if(k){B("conflict_resolved",{strategy:x,apply_to_all:!0,remaining_count:t.length});const v=Nt(i,m||e.getCurrentInjections(),x);e.setInjectionInput(v),e.setConfigInput(c),await e.generateNow(c,v,{pointsonly:!1}),await((u=e.onComplete)==null?void 0:u.call(e,c,v)),s([]),a(null),p(null),l(null)}else{B("conflict_resolved",{strategy:x,apply_to_all:!1,remaining_count:t.length});const v=t[0],[z,S]=v.injection,E=v.injection,$=t.slice(1);s($);let L=[...m||e.getCurrentInjections()],D=[...i||[]];if(x==="overwrite")L=L.filter(I=>!(I[0]===z&&I[1]===S));else if(x==="skip")D=D.filter(I=>!(I[0]===z&&I[1]===S&&I[2]===E[2]));else if(x==="keep-both"){const I=nr(z,S,L),w=[z,I,E[2]];L=[...L,w],D=D.filter(C=>!(C[0]===z&&C[1]===S&&C[2]===E[2]))}if(l(L),a(D),$.length===0){const I=Nt(D,L,"skip");e.setInjectionInput(I),e.setConfigInput(c),await e.generateNow(c,I,{pointsonly:!1}),await((y=e.onComplete)==null?void 0:y.call(e,c,I)),a(null),p(null),l(null)}}},[i,c,m,t,e]),g=f.useCallback(()=>{var x;B("conflict_cancelled",{remaining_count:t.length}),s([]),a(null),p(null),l(null),(x=e.setError)==null||x.call(e,"Loading cancelled by user")},[e,t.length]);return{currentConflict:n?{name:n.injection[1],type:n.injection[0]}:null,processInjectionsWithConflictResolution:h,handleConflictResolution:b,handleConflictCancel:g}},fi={templates:"4.3.0",outlines:"4.3.0"},et=()=>qe.version,nn=e=>{const t=e.split("-")[0].replace(/^v/,"").split(".");for(;t.length<3;)t.push("0");return t.length>3||!t.every(s=>/^\d+$/.test(s))?null:[Number(t[0]),Number(t[1]),Number(t[2])]},hi=(e,t)=>{const s=nn(e),n=nn(t);if(!s||!n)return!1;const[i,a,c]=s,[p,m,l]=n;return i===p&&(a>m||a===m&&c>=l)},gi=(e,t)=>{const s=Ue(t),n=Ue(fi[e]);return s!==null&&n!==null?Xt(s,n):!1},mi=()=>({templates:"",outlines:""}),ce=e=>{if(typeof window<"u"&&window.location)try{const n=new URLSearchParams(window.location.search).get(`ff_${e}`);if(n==="true")return!0;if(n==="false")return!1}catch(s){console.warn("[FeatureFlags] Failed to check URL query parameters:",s)}const t=mi()[e];return t==="true"?!0:t==="false"?!1:gi(e,et())},bi=50*1024*1024,wi=10*1024*1024,Ut=(e,t)=>{const s=`${t}/`;let n=e;return n.startsWith(s)&&(n=n.substring(s.length)),n=n.replace(/\.js$/,""),n},xi=e=>{let t=e.file("config.yaml")||e.file("config.yml");if(!t){const s=e.file(/^config\.(yaml|yml)$/i);s&&s.length>0&&(t=s[0])}if(!t)throw new Error("The archive is missing a config.yaml file in the root directory.");return t},Qt=(e,t)=>{if(t&&e>bi)throw new Error(`File exceeds the maximum size limit of 50MB for archives (current size: ${(e/(1024*1024)).toFixed(1)}MB).`);if(!t&&e>wi)throw new Error(`File exceeds the maximum size limit of 10MB for text files (current size: ${(e/(1024*1024)).toFixed(1)}MB).`)},rr=(e,t,s)=>{const n=[];return e.forEach(i=>n.push(["footprint",i.name,i.content])),t.forEach(i=>n.push(["outline",i.name,i.content])),s.forEach(i=>n.push(["template",i.name,i.content])),n},yi=async e=>{let t;try{t=await Qe.loadAsync(e)}catch{throw new Error("The file appears to be corrupted. Please verify the file and try again.")}const n=await xi(t).async("string"),i=[],a=[];return t.forEach((c,p)=>{if(!(p.dir||!c.endsWith(".js"))){if(c.startsWith("footprints/")){const m=p.async("string").then(l=>{const h=Ut(c,"footprints");i.push({type:"footprint",name:h,content:l})});a.push(m)}else if(c.startsWith("outlines/")&&ce("outlines")){const m=p.async("string").then(l=>{const h=Ut(c,"outlines");i.push({type:"outline",name:h,content:l})});a.push(m)}else if(c.startsWith("templates/")&&ce("templates")){const m=p.async("string").then(l=>{const h=Ut(c,"templates");i.push({type:"template",name:h,content:l})});a.push(m)}}}),await Promise.all(a),{config:n,injections:i}},eo="ergogen:config",po="ergogen:multi-config",to="LOCAL_STORAGE_CONFIG",rn=5e3,ki=40,_i=3;class me extends Error{constructor(t){super(t),this.name="RateLimitError"}}class vi{constructor(){this.providers=[]}register(t){this.providers.push(t)}resolve(t){const s=t.trim();for(const n of this.providers)if(n.canHandle(s))return n;return/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(s)&&this.providers[0]||null}}const tt=new vi,ji=e=>{const t=[],s=e.split(`
`);let n={};for(const i of s){const a=i.trim();if(a.startsWith("[submodule"))n.path&&n.url&&t.push({path:n.path,url:n.url}),n={};else{const c=a.indexOf("=");if(c!==-1){const p=a.substring(0,c).trim(),m=a.substring(c+1).trim();p==="path"?n.path=m:p==="url"&&(n.url=m)}}}return n.path&&n.url&&t.push({path:n.path,url:n.url}),t};class ot{async fetchConfig(t){console.log(`[GitHub] Starting fetch from URL: ${t}`);const s=this.parseUrl(t),{owner:n,repo:i,branch:a,filePath:c,isRepoRoot:p}=s,m=s.host,l=[],h=[],b=[],g=async(k,u,y,v,z)=>{console.log("[GitHub] Checking for .gitmodules file");try{const S=await this.fetchFileContent(n,i,".gitmodules",u,m);console.log("[GitHub] .gitmodules found, parsing submodules");const E=ji(S);for(const $ of E)if($.path.includes(y)||$.path.includes(v)&&ce("outlines")||$.path.includes(z)&&ce("templates")){const L=$.path.includes(v),D=$.path.includes(z),I=L?v:D?z:y,w=L?h:D?b:l,C=$.path.substring($.path.indexOf(I)+I.length+1),A=tt.resolve($.url);if(A instanceof ot){const R=A.parseUrl($.url),O=R.host;let U=[];try{U=await A.fetchFootprintsFromDirectory(R.owner,R.repo,"","main",[".js"],O)}catch(ee){if(ee instanceof me)throw ee;try{U=await A.fetchFootprintsFromDirectory(R.owner,R.repo,"","master",[".js"],O)}catch(X){if(X instanceof me)throw X;console.warn(`Failed to fetch submodule footprints from ${$.url}`)}}const F=U.map(ee=>({name:C?`${C}/${ee.name}`:ee.name,content:ee.content}));w.push(...F)}}}catch(S){if(S instanceof me)throw S}};if(!p){if(!c)throw new Error("Invalid URL. File path not specified.");const k=await this.fetchFileContent(n,i,c,a,m);Qt(k.length,!1);const u=c.split("/").pop()||"";if(!(u==="config.yaml"||u==="config.yml"))return{config:k,footprints:[],outlines:[],templates:[],configPath:u};const v=c.substring(0,c.lastIndexOf("/")),z=v?`${v}/footprints`:"footprints",S=v?`${v}/outlines`:"outlines",E=v?`${v}/templates`:"templates";try{const $=await this.fetchFootprintsFromDirectory(n,i,z,a,[".js"],m);l.push(...$)}catch($){if($ instanceof me)throw $}if(ce("outlines"))try{const $=await this.fetchFootprintsFromDirectory(n,i,S,a,[".js",".svg"],m);h.push(...$)}catch($){if($ instanceof me)throw $}if(ce("templates"))try{const $=await this.fetchFootprintsFromDirectory(n,i,E,a,[".js"],m);b.push(...$)}catch($){if($ instanceof me)throw $}return await g(v,a,z,S,E),{config:k,footprints:l,outlines:h,templates:b,configPath:u}}const x=async k=>{var $,L,D,I,w,C,A,R,O,U,F,ee;let u="",y="",v=!0;try{u=await this.fetchFileContent(n,i,"config.yaml",k,m),y=""}catch(X){const ne=X;if(($=ne.message)!=null&&$.includes("allowance")||(L=ne.message)!=null&&L.includes("limit exceeded")||(D=ne.message)!=null&&D.includes("rate limit"))throw ne;try{u=await this.fetchFileContent(n,i,"config.yml",k,m),y=""}catch(Y){const M=Y;if((I=M.message)!=null&&I.includes("allowance")||(w=M.message)!=null&&w.includes("limit exceeded")||(C=M.message)!=null&&C.includes("rate limit"))throw M;try{u=await this.fetchFileContent(n,i,"ergogen/config.yaml",k,m),y="ergogen"}catch(W){const T=W;if((A=T.message)!=null&&A.includes("allowance")||(R=T.message)!=null&&R.includes("limit exceeded")||(O=T.message)!=null&&O.includes("rate limit"))throw T;try{u=await this.fetchFileContent(n,i,"ergogen/config.yml",k,m),y="ergogen"}catch(Z){const G=Z;if((U=G.message)!=null&&U.includes("allowance")||(F=G.message)!=null&&F.includes("limit exceeded")||(ee=G.message)!=null&&ee.includes("rate limit"))throw G;const{configYamls:_,anyYamls:H}=await this.bfsForYamlFiles(n,i,k,m);if(_.length>0){const V=_[0];u=await this.fetchFileContent(n,i,V,k,m),y=V.includes("/")?V.substring(0,V.lastIndexOf("/")):""}else if(H.length>0){const V=H[0];u=await this.fetchFileContent(n,i,V,k,m),y=V.includes("/")?V.substring(0,V.lastIndexOf("/")):"",v=!1}else throw new Error("No YAML configuration files found in repository")}}}}if(Qt(u.length,!1),!v)return{config:u,footprints:[],outlines:[],templates:[],configPath:y};const z=y?`${y}/footprints`:"footprints",S=y?`${y}/outlines`:"outlines",E=y?`${y}/templates`:"templates";try{const X=await this.fetchFootprintsFromDirectory(n,i,z,k,[".js"]);l.push(...X)}catch(X){if(X instanceof me)throw X}if(ce("outlines"))try{const X=await this.fetchFootprintsFromDirectory(n,i,S,k,[".js",".svg"]);h.push(...X)}catch(X){if(X instanceof me)throw X}if(ce("templates"))try{const X=await this.fetchFootprintsFromDirectory(n,i,E,k,[".js"]);b.push(...X)}catch(X){if(X instanceof me)throw X}return await g(y,k,z,S,E),{config:u,footprints:l,outlines:h,templates:b,configPath:y}};if(a!=="main")return await x(a);try{return await x("main")}catch(k){if(k instanceof me)throw k;return await x("master")}}async fetchFootprintsFromDirectory(t,s,n,i,a,c){const p=[],m=async l=>{try{const h=await this.listDirectory(t,s,l,i,c);for(const b of h){const g=b.path.startsWith(l)?b.path:l?`${l}/${b.path}`:b.path;if(b.type==="file"){if(a.some(k=>b.name.endsWith(k)))try{const k=await this.fetchFileContent(t,s,g,i,c),u=n?g.slice(n.length+1).replace(/\.[^/.]+$/,""):g.replace(/\.[^/.]+$/,"");console.log(`[GitHub] Loaded footprint: ${u}`),p.push({name:u,content:k})}catch(k){if(k instanceof me)throw k;const u=k;console.warn(`Failed to fetch file content: ${g}`,u.stack||u)}}else b.type==="dir"&&await m(g)}}catch(h){if(h instanceof me)throw h}};return await m(n),p}async bfsForYamlFiles(t,s,n,i){var h,b,g;const a=[],c=[],p=[{path:"",depth:0}],m=new Set;let l=0;for(;p.length>0&&l<ki;){const{path:x,depth:k}=p.shift();if(!m.has(x)){m.add(x);try{l++;const u=await this.listDirectory(t,s,x,n,i);for(const y of u)if(y.type==="file"){const v=y.name.toLowerCase();(v.endsWith(".yaml")||v.endsWith(".yml"))&&!v.startsWith(".")&&v.replace(/\.(yaml|yml)$/,"")!=="metadata"&&v.replace(/\.(yaml|yml)$/,"")!=="virtual_env"&&(y.name==="config.yaml"||y.name==="config.yml"?a.push(y.path):c.push(y.path))}else y.type==="dir"&&k<_i&&(y.name.startsWith(".")||p.push({path:y.path,depth:k+1}));if(a.length>0||c.length>0&&(p.length===0||p[0].depth>k))break}catch(u){const y=u;if((h=y.message)!=null&&h.includes("allowance")||(b=y.message)!=null&&b.includes("limit exceeded")||(g=y.message)!=null&&g.includes("rate limit"))throw y;continue}}}return{configYamls:a,anyYamls:c}}}const $i=(e,t)=>{var p,m,l,h;if(!e)return{isLimitExceeded:!1,error:null};if(t.includes("raw.githubusercontent.com"))return e.status===429?(console.warn("[GitHub] Raw content rate limit exceeded (429). Please wait 30 minutes and try again."),{isLimitExceeded:!0,error:"You've reached your hourly request allowance for loading content from GitHub. Please wait 30 minutes and try again."}):{isLimitExceeded:!1,error:null};const n=((p=e.headers)==null?void 0:p.get("X-RateLimit-Limit"))||"unknown",i=((m=e.headers)==null?void 0:m.get("X-RateLimit-Remaining"))||"unknown",a=((l=e.headers)==null?void 0:l.get("X-RateLimit-Used"))||"unknown",c=((h=e.headers)==null?void 0:h.get("X-RateLimit-Reset"))||"unknown";if(console.log(`[GitHub Rate Limit] Limit: ${n}, Remaining: ${i}, Used: ${a}, Reset: ${c}`),e.status===403&&i==="0")return console.warn("[GitHub] Rate limit exceeded. Please wait and try again in about an hour."),{isLimitExceeded:!0,error:"Cannot load from GitHub right now. You've used your hourly request allowance. Please wait about an hour and try again."};if(i!=="unknown"&&n!=="unknown"){const b=parseInt(n),g=parseInt(i),x=(b-g)/b*100;if(x>=80&&g>0)return console.warn(`[GitHub] Approaching rate limit: ${x.toFixed(1)}% used`),{isLimitExceeded:!1,error:"Loading from GitHub may become unavailable soon. You've used most of your hourly request allowance. This will reset within an hour."}}return{isLimitExceeded:!1,error:null}};class Ci extends ot{constructor(){super(...arguments),this.rateLimitWarning=null}canHandle(t){const s=t.trim();return s.includes("github.com")||/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(s)}parseUrl(t){const s=t.trim();let n="",i="",a="main",c,p=!0;const m=!s.includes("github.com");if(m){const l=s.split("/").filter(Boolean);if(l.length<2)throw new Error("Invalid GitHub repository format. Must contain owner and repository.");n=l[0],i=l[1],p=l.length===2||l.length===4&&l[2]==="tree",p?l.length===4&&(a=l[3]):l[2]==="blob"||l[2]==="tree"?(a=l[3],c=l.slice(4).join("/")):c=l.slice(2).join("/")}else{let l=s;l.match(/^(https?:\/\/)/i)||(l=`https://${l}`);const h=l.endsWith("/")?l.slice(0,-1):l,g=new URL(h).pathname.split("/").filter(Boolean);if(g.length<2)throw new Error("Invalid GitHub URL. Must contain owner and repository.");n=g[0],i=g[1],p=g.length===2||g.length===4&&g[2]==="tree",p?g.length===4&&(a=g[3]):g[2]==="blob"||g[2]==="tree"?(a=g[3],c=g.slice(4).join("/")):c=g.slice(2).join("/")}return i.endsWith(".git")&&(i=i.slice(0,-4)),{owner:n,repo:i,branch:a,filePath:c,isRepoRoot:p,baseUrl:m?`https://github.com/${n}/${i}`:s}}async fetchFileContent(t,s,n,i){const a=`https://raw.githubusercontent.com/${t}/${s}/${i}/${n}`,c=await fetch(a);if(this.checkRateLimits(c,a),!c.ok)throw new Error(`Failed to fetch file content from GitHub: ${c.status}`);return await c.text()}async listDirectory(t,s,n,i){const a=`https://api.github.com/repos/${t}/${s}/contents/${n}?ref=${i}`,c=await fetch(a);if(this.checkRateLimits(c,a),!c.ok)throw new Error(`Failed to list directory from GitHub: ${c.status}`);const p=await c.json();let m=[];if(Array.isArray(p))m=p;else if(p&&typeof p=="object"&&"tree"in p&&Array.isArray(p.tree))m=p.tree;else throw new Error("Target path is not a directory");return m.map(l=>({name:l.name||l.path.split("/").pop()||"",path:l.path,type:l.type==="tree"?"dir":l.type==="blob"?"file":l.type}))}checkRateLimits(t,s){const n=$i(t,s);if(n.error&&!this.rateLimitWarning&&(this.rateLimitWarning=n.error),n.isLimitExceeded)throw new me(n.error||"Rate limit exceeded")}async fetchConfig(t){this.rateLimitWarning=null;const s=await super.fetchConfig(t);return this.rateLimitWarning&&(s.rateLimitWarning=this.rateLimitWarning),s}}tt.register(new Ci);const ir=async e=>{const t=tt.resolve(e);if(!t)throw new Error(`Unsupported repository provider URL: ${e}`);return t.fetchConfig(e)};class Si extends ot{canHandle(t){return t.includes("codeberg.org")}parseUrl(t){const s=t.trim();let n="",i="",a="main",c,p=!0;const m=!s.includes("codeberg.org");if(m){const l=s.split("/").filter(Boolean);if(l.length<2)throw new Error("Invalid Codeberg repository format. Must contain owner and repository.");n=l[0],i=l[1],p=l.length===2||l.length===5&&l[2]==="src"&&(l[3]==="branch"||l[3]==="commit"),p?l.length===5&&(a=l[4]):l.length>=5&&l[2]==="src"&&(l[3]==="branch"||l[3]==="commit")?(a=l[4],c=l.slice(5).join("/")):c=l.slice(2).join("/")}else{let l=s;l.match(/^(https?:\/\/)/i)||(l=`https://${l}`);const h=l.endsWith("/")?l.slice(0,-1):l,g=new URL(h).pathname.split("/").filter(Boolean);if(g.length<2)throw new Error("Invalid Codeberg URL. Must contain owner and repository name.");n=g[0],i=g[1],p=g.length===2||g.length===5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit"),p?g.length===5&&(a=g[4]):g.length>=5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit")?(a=g[4],c=g.slice(5).join("/")):c=g.slice(2).join("/")}return i.endsWith(".git")&&(i=i.slice(0,-4)),{owner:n,repo:i,branch:a,filePath:c,isRepoRoot:p,baseUrl:m?`https://codeberg.org/${n}/${i}`:s}}async fetchFileContent(t,s,n,i){const a=`https://codeberg.org/api/v1/repos/${t}/${s}/raw/${n}?ref=${i}`,c=await fetch(a);if(!c.ok)throw new Error(`Failed to fetch file content from Codeberg API: ${c.status}`);return await c.text()}async listDirectory(t,s,n,i){const a=n?`/${n}`:"",c=`https://codeberg.org/api/v1/repos/${t}/${s}/contents${a}?ref=${i}`,p=await fetch(c);if(!p.ok)throw new Error(`Failed to list directory from Codeberg API: ${p.status}`);const m=await p.json();if(!Array.isArray(m))throw new Error("Target path is not a directory");return m.map(l=>({name:l.name,path:l.path||l.name,type:l.type}))}}tt.register(new Si);class Ei extends ot{canHandle(t){const s=t.trim();return s.match(/^(https?:\/\/)/i)?!s.includes("github.com")&&!s.includes("codeberg.org"):!1}parseUrl(t){const s=t.trim();let n="",i="",a="main",c,p=!0,m=s;m.match(/^(https?:\/\/)/i)||(m=`https://${m}`);const l=m.endsWith("/")?m.slice(0,-1):m,h=new URL(l),b=h.origin,g=h.pathname.split("/").filter(Boolean);if(g.length<2)throw new Error("Invalid Forgejo/Gitea URL. Must contain owner and repository name.");return n=g[0],i=g[1],p=g.length===2||g.length===5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit"),p?g.length===5&&(a=g[4]):g.length>=5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit")?(a=g[4],c=g.slice(5).join("/")):c=g.slice(2).join("/"),i.endsWith(".git")&&(i=i.slice(0,-4)),{owner:n,repo:i,branch:a,filePath:c,isRepoRoot:p,baseUrl:s,host:b}}async fetchFileContent(t,s,n,i,a){const p=`${a||"https://codeberg.org"}/api/v1/repos/${t}/${s}/raw/${n}?ref=${i}`,m=await fetch(p);if(!m.ok)throw new Error(`Failed to fetch file content from Gitea/Forgejo API: ${m.status}`);return await m.text()}async listDirectory(t,s,n,i,a){const c=a||"https://codeberg.org",p=n?`/${n}`:"",m=`${c}/api/v1/repos/${t}/${s}/contents${p}?ref=${i}`,l=await fetch(m);if(!l.ok)throw new Error(`Failed to list directory from Gitea/Forgejo API: ${l.status}`);const h=await l.json();if(!Array.isArray(h))throw new Error("Target path is not a directory");return h.map(b=>({name:b.name,path:b.path||b.name,type:b.type}))}}const Pi=new Ei;tt.register(Pi);const Ii=({processInjectionsWithConflictResolution:e,setError:t})=>{const[s,n]=f.useState(!1),i=f.useRef(!1);return f.useEffect(()=>{const a=async()=>{const c=new URLSearchParams(window.location.search),p=c.get("github"),m=c.get("codeberg"),l=c.get("forgejo"),h=c.get("gitea");let b=p||m||l||h;if(b){m&&!m.includes("codeberg.org")?b=`https://codeberg.org/${m}`:p&&!p.includes("github.com")&&(b=`https://github.com/${p}`),n(!0),console.log("[useConfigLoader] Loading from URL parameter:",b);try{const g=await ir(b);console.log("[useConfigLoader] Fetch result:",{configLength:g.config.length,footprintsCount:g.footprints.length,outlinesCount:g.outlines.length,configPath:g.configPath,rateLimitWarning:g.rateLimitWarning}),g.rateLimitWarning&&t(g.rateLimitWarning);const x=rr(g.footprints,g.outlines,g.templates);await e(x,g.config)}catch(g){console.error("[useConfigLoader] Failed to load from remote repository:",g),t(`Failed to load from remote repository: ${g instanceof Error?g.message:String(g)}`)}finally{n(!1)}}};i.current||(i.current=!0,a())},[e,t]),{isLoading:s}},Ze=(e,t)=>{const s=new Map;for(const n of t){const[i,a,c]=n;let p="footprints";i==="outline"?p="outlines":i==="template"&&(p="templates");const m=e.folder(p);if(m){const l=a.split("/"),h=l.pop();let b=m,g=p;for(const x of l){const k=`${g}/${x}`;let u=s.get(k);u||(u=b.folder(x)||b,s.set(k,u)),b=u,g=k}h&&b.file(`${h}.js`,c)}}},sr=async(e,t,s,n,i)=>{var h;const a=new Qe;a.file("config.yaml",t);const c=a.folder("outputs");if(c){if((h=e.demo)!=null&&h.svg&&c.file("demo.svg",e.demo.svg),e.outlines){let b=null;for(const[g,x]of Object.entries(e.outlines))(n||!g.startsWith("_"))&&(x.dxf||x.svg)&&(b||(b=c.folder("outlines")),b&&(x.dxf&&b.file(`${g}.dxf`,x.dxf),x.svg&&b.file(`${g}.svg`,x.svg)))}if(e.pcbs&&Object.keys(e.pcbs).length>0){const b=c.folder("pcbs");if(b)for(const[g,x]of Object.entries(e.pcbs)){const k=g.endsWith(".kicad_pcb")?g:`${g}.kicad_pcb`;b.file(k,x)}}if(e.cases){let b=null;for(const[g,x]of Object.entries(e.cases)){const k=!!x.jscad,u=i&&!!x.stl;(k||u)&&(b||(b=c.folder("cases")),b&&(x.jscad&&b.file(`${g}.jscad`,x.jscad),i&&x.stl&&b.file(`${g}.stl`,x.stl)))}}if(n){const b=c.folder("debug");if(b){b.file("raw.txt",t);for(const[g,x]of Object.entries(e))["canonical","points","units"].includes(g)&&b.file(`${g}.yaml`,JSON.stringify(x,null,2))}}}s&&s.length>0&&Ze(a,s);const p=await a.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),l=`ergogen-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Ye.saveAs(p,l)},zi=(e,t)=>new Promise((s,n)=>{const i=Xe();if(!i){n(new Error("Failed to create Ergogen worker"));return}const a=setTimeout(()=>{i.terminate(),n(new Error("Compilation timed out"))},15e3);i.onmessage=p=>{const m=p.data;m.type==="error"?(clearTimeout(a),n(new Error(m.error)),i.terminate()):m.type==="success"&&(clearTimeout(a),s(m.results),i.terminate())},i.onerror=p=>{clearTimeout(a),n(p),i.terminate()};let c;try{c=JSON.parse(e)}catch{try{c=fe.load(e)}catch{c=e}}i.postMessage({type:"generate",inputConfig:c,injectionInput:t,requestId:`export-compile-${Date.now()}`,options:{debug:!0,svg:!0}})}),Li=e=>new Promise(t=>{const s=lo();if(!s){t(e);return}const n=setTimeout(()=>{s.terminate(),t(e)},15e3);s.onmessage=i=>{const a=i.data;a.type==="success"&&a.results?(clearTimeout(n),t(a.results)):(clearTimeout(n),t(e)),s.terminate()},s.onerror=()=>{clearTimeout(n),t(e),s.terminate()},s.postMessage({type:"batch_jscad_to_stl",results:e,configVersion:0})}),Di=async(e,t,s,n)=>{var m;const i=new Qe;for(const l of e){const h=l.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled",b=i.folder(h);if(b)try{const g=await zi(l.config,t);let x=g;n&&g.cases&&Object.keys(g.cases).length>0&&(x=await Li(g)),b.file("config.yaml",l.config);const k=b.folder("outputs");if(k){if((m=x.demo)!=null&&m.svg&&k.file("demo.svg",x.demo.svg),x.outlines){let u=null;for(const[y,v]of Object.entries(x.outlines))(s||!y.startsWith("_"))&&(v.dxf||v.svg)&&(u||(u=k.folder("outlines")),u&&(v.dxf&&u.file(`${y}.dxf`,v.dxf),v.svg&&u.file(`${y}.svg`,v.svg)))}if(x.pcbs&&Object.keys(x.pcbs).length>0){const u=k.folder("pcbs");if(u)for(const[y,v]of Object.entries(x.pcbs)){const z=y.endsWith(".kicad_pcb")?y:`${y}.kicad_pcb`;u.file(z,v)}}if(x.cases){let u=null;for(const[y,v]of Object.entries(x.cases)){const z=!!v.jscad,S=n&&!!v.stl;(z||S)&&(u||(u=k.folder("cases")),u&&(v.jscad&&u.file(`${y}.jscad`,v.jscad),n&&v.stl&&u.file(`${y}.stl`,v.stl)))}}if(s){const u=k.folder("debug");if(u){u.file("raw.txt",l.config);for(const[y,v]of Object.entries(x))["canonical","points","units"].includes(y)&&u.file(`${y}.yaml`,JSON.stringify(v,null,2))}}}t&&t.length>0&&Ze(b,t)}catch(g){console.error(`Failed to compile config ${l.name}:`,g),b.file("config.yaml",l.config),b.file("error.txt",`Compilation failed: ${g instanceof Error?g.message:String(g)}`)}}const a=await i.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),p=`ergogen-export-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Ye.saveAs(a,p)},Ai=async(e,t)=>{const s=new Qe,n=new Set;for(const p of e){const m=p.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled";let l=m,h=1;for(;n.has(l);)l=`${m}_${h}`,h++;n.add(l),s.file(`${l}.yaml`,p.config)}t&&t.length>0&&Ze(s,t);const i=await s.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),c=`ergogen-config-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;Ye.saveAs(i,c)},Ri=async(e,t,s,n,i,a,c)=>{const p=new Qe,m=new Set;if(i){for(let g=0;g<e.length;g++){if(c())return;const x=e[g];a(g,e.length,x.name);const k=x.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled";let u=k,y=1;for(;m.has(u);)u=`${k}_${y}`,y++;m.add(u),p.file(`${u}.yaml`,x.config)}if(t&&t.length>0){if(c())return;Ze(p,t)}if(c())return;a(e.length,e.length,"Creating ZIP...");const l=await p.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),b=`ergogen-config-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;return Ye.saveAs(l,b),{succeededCount:e.length,failedCount:0}}else{const l=new Set,h=(z,S)=>new Promise((E,$)=>{if(c()){$(new Error("Aborted"));return}const L=Xe();if(!L){$(new Error("Failed to create Ergogen worker"));return}l.add(L);const D=setTimeout(()=>{L.terminate(),l.delete(L),$(new Error("Compilation timed out"))},3e4);L.onmessage=w=>{const C=w.data;C.type==="error"?(clearTimeout(D),L.terminate(),l.delete(L),$(new Error(C.error))):C.type==="success"&&(clearTimeout(D),L.terminate(),l.delete(L),E(C.results))},L.onerror=w=>{clearTimeout(D),L.terminate(),l.delete(L),$(w)};let I;try{I=JSON.parse(z)}catch{try{I=fe.load(z)}catch{I=z}}L.postMessage({type:"generate",inputConfig:I,injectionInput:S,requestId:`export-compile-${Date.now()}`})}),b=z=>new Promise(S=>{if(c()||!z.cases||Object.keys(z.cases).length===0){S(z);return}const E=lo();if(!E){S(z);return}l.add(E);const $=setTimeout(()=>{E.terminate(),l.delete(E),S(z)},3e4);E.onmessage=L=>{const D=L.data;D.type==="success"?(clearTimeout($),E.terminate(),l.delete(E),S(D.results)):D.type==="error"&&(clearTimeout($),E.terminate(),l.delete(E),S(z))},E.onerror=()=>{clearTimeout($),E.terminate(),l.delete(E),S(z)},E.postMessage({type:"batch_jscad_to_stl",results:z,configVersion:0})}),g=new Set;let x=0,k=0,u=0;const y=Math.min(4,navigator.hardwareConcurrency||2),v=async z=>{var $;if(c())return;g.add(z.name),a(x,e.length,Array.from(g).join(", "));const S=z.name.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled",E=p.folder(S);if(!E){g.delete(z.name),x++,a(x,e.length,Array.from(g).join(", "));return}try{const L=await h(z.config,t);let D=L;if(L.cases&&Object.keys(L.cases).length>0&&(D=await b(L)),c())return;E.file("config.yaml",z.config);const I=E.folder("outputs");if(I){if(($=D.demo)!=null&&$.svg&&I.file("demo.svg",D.demo.svg),D.outlines){let w=null;for(const[C,A]of Object.entries(D.outlines))(s||!C.startsWith("_"))&&(A.dxf||A.svg)&&(w||(w=I.folder("outlines")),w&&(A.dxf&&w.file(`${C}.dxf`,A.dxf),A.svg&&w.file(`${C}.svg`,A.svg)))}if(D.pcbs&&Object.keys(D.pcbs).length>0){const w=I.folder("pcbs");if(w)for(const[C,A]of Object.entries(D.pcbs)){const R=C.endsWith(".kicad_pcb")?C:`${C}.kicad_pcb`;w.file(R,A)}}if(D.cases){let w=null;for(const[C,A]of Object.entries(D.cases)){const R=!!A.jscad,O=!!A.stl;(R||O)&&(w||(w=I.folder("cases")),w&&(A.jscad&&w.file(`${C}.jscad`,A.jscad),A.stl&&w.file(`${C}.stl`,A.stl)))}}if(s){const w=I.folder("debug");if(w){w.file("raw.txt",z.config);for(const[C,A]of Object.entries(D))["canonical","points","units"].includes(C)&&w.file(`${C}.yaml`,JSON.stringify(A,null,2))}}}t&&t.length>0&&Ze(E,t),k++}catch(L){u++,console.error(`Failed to compile config ${z.name}:`,L),E.file("config.yaml",z.config),E.file("error.txt",`Compilation failed: ${L instanceof Error?L.message:String(L)}`)}finally{g.delete(z.name),x++,a(x,e.length,Array.from(g).join(", "))}};try{const z=[...e],S=[],E=async()=>{if(c()||z.length===0)return;const I=z.shift();await v(I),await E()};for(let I=0;I<Math.min(y,z.length);I++)S.push(E());if(await Promise.all(S),c()){l.forEach(I=>I.terminate()),l.clear();return}a(e.length,e.length,"Creating ZIP...");const $=await p.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),D=`ergogen-export-all-${new Date().toISOString().replace(/[:.]/g,"-").split("T")[0]}.zip`;return Ye.saveAs($,D),{succeededCount:k,failedCount:u}}finally{l.forEach(z=>z.terminate()),l.clear()}}},Ni=e=>!e||!Array.isArray(e)?e:e.filter(t=>{if(!Array.isArray(t)||t.length!==3)return!0;const[s]=t;return!(s==="outline"&&!ce("outlines")||s==="template"&&!ce("templates"))}),Ui=e=>{if(!e||!Array.isArray(e))return null;const t=e.some(a=>Array.isArray(a)&&a[0]==="outline"),s=e.some(a=>Array.isArray(a)&&a[0]==="template"),n=t&&!ce("outlines"),i=s&&!ce("templates");if(n||i){const a=[];return n&&a.push("outlines"),i&&a.push("templates"),`Custom ${a.join(" and ")} were skipped because the respective feature flags are disabled in settings.`}return null},Oi=e=>{if(!e||typeof e!="object")return null;const t=e;if(!t.pcbs||typeof t.pcbs!="object")return null;const s=t.pcbs;for(const n of Object.values(s))if(n&&typeof n=="object"&&(!n.template||n.template==="kicad5")){const i=n.footprints;if(i&&typeof i=="object"){for(const a of Object.values(i))if(a&&typeof a=="object"&&typeof a.what=="string"&&a.what.startsWith("ceoloide"))return'KiCad 5 is deprecated. Please add "template: kicad8" to your PCB definitions to avoid errors when opening PCB files with KiCad 8 or newer.'}}return null},Wi=(e,t)=>{if(e&&typeof e=="object"){const s=e;return s.points&&t?{...s,pcbs:void 0,cases:void 0}:s}return e},He=(e,t)=>{if(typeof window>"u")return t;try{const s=localStorage.getItem(e);return s!==null?JSON.parse(s):t}catch{return t}},sn=()=>({debug:He("ergogen:config:debug",!1),autoGen:He("ergogen:config:autoGen",!0),autoGen3D:He("ergogen:config:autoGen3D",!0),kicanvasPreview:He("ergogen:config:kicanvasPreview",!0),stlPreview:He("ergogen:config:stlPreview",!0),sendUsageMetrics:jt()}),ar=f.createContext(null),Re=()=>typeof window<"u"&&window.crypto&&window.crypto.randomUUID?window.crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,e=>{const t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)}),ct=(e,t)=>{let s=0;for(const n of e){const i=n.name.match(t);if(i){const a=parseInt(i[1],10);!isNaN(a)&&a>s&&(s=a)}}return s+1},kt="ergogen:deleted-config",Fi=e=>{try{const t=localStorage.getItem(kt),s={version:1,configs:[]};if(t){const i=JSON.parse(t);i&&Array.isArray(i.configs)&&(s.configs=i.configs,i.version!==void 0&&(s.version=i.version))}const n={...e,deletedAt:new Date().toISOString()};s.configs.push(n),localStorage.setItem(kt,JSON.stringify(s))}catch(t){console.error("Failed to save deleted config to storage:",t)}},an=()=>{try{const e=localStorage.getItem(kt);if(!e)return;const t=JSON.parse(e);if(!t||!Array.isArray(t.configs))return;let s=t.configs;const n=Date.now(),i=90*24*60*60*1e3;s=s.filter(c=>{const p=new Date(c.deletedAt).getTime();return n-p<=i}),s.length>100&&(s.sort((c,p)=>{const m=new Date(c.updatedAt).getTime(),l=new Date(p.updatedAt).getTime();return m-l}),s=s.slice(s.length-100));const a={version:t.version||1,configs:s};localStorage.setItem(kt,JSON.stringify(a))}catch(e){console.error("Failed to prune deleted configs:",e)}},ln=e=>{if(!e)return;let t="";if(typeof e=="string")t=e;else if(Array.isArray(e))t=e.join("");else return;return t=t.replace(/width="[^"]+"/,'width="284px"').replace(/height="[^"]+"/,'height="134px"'),t=t.replace(/<svg/,'<svg style="background-color: rgb(51,51,51);"'),t=t.replaceAll(/stroke="#000"/g,'stroke="#AAA"'),t=t.replaceAll(/stroke:#000/g,"stroke:#AAA"),t},Bi=()=>{if(typeof window>"u")return{version:2,activeConfigId:null,configs:[]};const e=localStorage.getItem(po);if(e)try{const t=JSON.parse(e);if(t&&typeof t.version=="number"){const s=new Date().toISOString(),n=(t.configs||[]).map(i=>({...i,createdAt:i.createdAt||s,updatedAt:i.updatedAt||s}));return{...t,configs:n}}}catch(t){console.error("Failed to parse multi-config storage:",t)}return{version:2,activeConfigId:null,configs:[]}},pe=(e,t,s=2)=>{if(typeof window>"u")return;const n={version:s,activeConfigId:t,configs:e};localStorage.setItem(po,JSON.stringify(n))},Mi=()=>{const e=Bi();if(typeof window>"u")return e;const t=localStorage.getItem(to),s=localStorage.getItem(eo);let n="";if(t)try{n=JSON.parse(t)}catch{n=t}else if(s)try{n=JSON.parse(s)}catch{n=s}if(n&&n.trim()!==""){if(!e.configs.some(a=>a.name==="Legacy Config")){const a=Re(),c={id:a,name:"Legacy Config",config:n,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};e.configs.push(c),e.activeConfigId=a,pe(e.configs,a,2)}localStorage.removeItem(to),localStorage.removeItem(eo)}return e},Ti=({initialInjectionInput:e,hashError:t,children:s})=>{const[n]=f.useState(()=>{if(typeof window>"u")return!1;const j=localStorage.getItem(to),P=localStorage.getItem(eo);return!!(j||P)}),[i]=f.useState(()=>{if(typeof window>"u")return 2;const j=localStorage.getItem(po);if(j)try{const P=JSON.parse(j);if(P&&typeof P.version=="number")return P.version}catch(P){console.warn("Failed to parse loaded version:",P)}return 1}),[a]=f.useState(()=>Mi()),[c,p]=f.useState(()=>a.configs),[m,l]=f.useState(()=>a.activeConfigId),[h,b]=f.useState(!1),[g,x]=f.useState(null),[k,u]=f.useState(()=>{if(a.activeConfigId){const j=a.configs.find(P=>P.id===a.activeConfigId);return j?j.config:""}return""}),y=f.useRef(c),v=f.useRef(m),z=f.useRef(h),S=f.useRef(g),E=f.useRef(k);f.useEffect(()=>{y.current=c},[c]),f.useEffect(()=>{v.current=m},[m]),f.useEffect(()=>{z.current=h},[h]),f.useEffect(()=>{S.current=g},[g]),f.useEffect(()=>{E.current=k},[k]);const $=f.useRef(k);f.useEffect(()=>{$.current=k},[k]);const L=f.useCallback(j=>{$.current=j},[]),D=f.useCallback(()=>$.current,[]),I=f.useRef(void 0),w=f.useRef(null),C=f.useRef(null),A=f.useCallback(()=>{C.current&&(clearTimeout(C.current.timeoutId),C.current=null)},[]),R=f.useCallback(()=>{const j=C.current;j&&(A(),B(j.name,j.payload))},[A]),O=f.useCallback(()=>{if(R(),w.current){const{timeoutId:j,payload:P,configId:N}=w.current;clearTimeout(j),B("keyboard_generated",P),I.current=N,w.current=null}},[R]),U=f.useCallback(()=>{I.current=void 0,R(),w.current&&(clearTimeout(w.current.timeoutId),w.current=null)},[R]),[F,ee]=Zo("ergogen:injection",e),[X,ne]=f.useState(null),[Y,M]=f.useState(null),[W,T]=f.useState(null),[Z,G]=f.useState(null),[_,H]=f.useState(null),[V,Q]=f.useState(0),q=f.useRef(null),se=f.useCallback(()=>{q.current=null,H(null)},[]),[ie,We]=Zo("ergogen:settings",sn()),de=(ie==null?void 0:ie.debug)??!1,xe=(ie==null?void 0:ie.autoGen)??!0,ge=(ie==null?void 0:ie.autoGen3D)??!0,Fe=(ie==null?void 0:ie.kicanvasPreview)??!0,ve=(ie==null?void 0:ie.stlPreview)??!0,[$e,xr]=f.useState(jt),Pt=f.useRef(ie);Pt.current=ie;const fo=f.useRef(xe);fo.current=xe;const It=f.useRef($e);It.current=$e;const be=f.useCallback(j=>{const P=Pt.current||sn(),N=j(P);Pt.current=N,We(N)},[We]),ho=f.useCallback(j=>{be(P=>{const N=typeof j=="function"?j(P.debug):j;return{...P,debug:N}})},[be]),go=f.useCallback(j=>{be(P=>{const N=typeof j=="function"?j(P.autoGen):j;return{...P,autoGen:N}})},[be]),mo=f.useCallback(j=>{be(P=>{const N=typeof j=="function"?j(P.autoGen3D):j;return{...P,autoGen3D:N}})},[be]),bo=f.useCallback(j=>{be(P=>{const N=typeof j=="function"?j(P.kicanvasPreview):j;return{...P,kicanvasPreview:N}})},[be]),wo=f.useCallback(j=>{be(P=>{const N=typeof j=="function"?j(P.stlPreview):j;return{...P,stlPreview:N}})},[be]),Be=f.useCallback((j,P,N)=>{if(A(),N||!fo.current){B(j,P);return}const K=setTimeout(()=>{C.current=null,B(j,P)},rn);C.current={name:j,payload:P,timeoutId:K}},[A]),xo=f.useCallback(j=>{const P=typeof j=="function"?j(It.current):j;It.current=P,Br(P),xr(P),be(N=>({...N,sendUsageMetrics:P}))},[be]);f.useEffect(()=>{Zn()},[$e]);const[Ce,yo]=f.useState(!1),[ko,yr]=f.useState(!1),[_o,vo]=f.useState(!1),[jo,$o]=f.useState(!0),[Co,So]=f.useState(!0),[Eo,we]=f.useState(!1),[Po,nt]=f.useState(!1),ae=f.useRef(null),ye=f.useRef(null),rt=f.useRef(0),[Io,it]=f.useState(!1),zo=f.useRef(!0),zt=f.useRef(null);f.useEffect(()=>{an()},[]),f.useEffect(()=>{t&&ne(t)},[t]);const Lo=f.useCallback(()=>ne(null),[]),Do=f.useCallback(()=>M(null),[]),Ao=f.useCallback(()=>T(null),[]),Ro=f.useCallback(()=>G(null),[]),st=f.useCallback(j=>{var K,oe,J,re,ue,ke;const P=j.data;if(P.requestId&&P.requestId.startsWith("background-preview-")){const te=P.requestId.substring(19);if(P.type==="success"&&P.results){const Ie=P.results,ze=((oe=(K=Ie.outlines)==null?void 0:K.preview)==null?void 0:oe.svg)||((J=Ie.demo)==null?void 0:J.svg),Se=ln(ze);Se&&p(Me=>{const Te=Me.map(le=>le.id===te?{...le,previewSvg:Se}:le);return pe(Te,v.current,2),Te})}else P.type==="error"&&console.warn(`Background generation failed for config ${te}:`,P.error);return}const N=!!(P.requestId&&P.requestId.startsWith("ergogen-manual-"));if(P.type==="error"){console.error("--- Ergogen worker error:",P.error),ne(P.error),we(!1),it(!1),Be("generation_failed",{error_message:P.error||"Unknown worker error",stored_configs_count:y.current.length,trigger:N?"manual":"auto"},N);return}if(P.type==="success")if(P.warnings&&P.warnings.length>0&&M(te=>(te?te+`
`:"")+P.warnings.join(`
`)),P.results){const te=P.results,Ie=zt.current?performance.now()-zt.current:0;Be("generation_completed",{duration_ms:Math.round(Ie),points_count:te.points?Object.keys(te.points).length:0,pcbs_count:te.pcbs?Object.keys(te.pcbs).length:0,cases_count:te.cases?Object.keys(te.cases).length:0,has_outlines:!!te.outlines,stored_configs_count:y.current.length,trigger:N?"manual":"auto"},N);try{const le=fe.dump(te.canonical||{}),Ee=fe.dump(te.points||{}),je=Zr(le,Ee,Math.round(Ie),I.current);if(je.config_id!==I.current){w.current&&clearTimeout(w.current.timeoutId);const Cr=setTimeout(()=>{B("keyboard_generated",je),I.current=je.config_id,w.current=null},rn);w.current={timeoutId:Cr,payload:je,configId:je.config_id}}}catch(le){console.error("Failed to generate keyboard configuration analytics:",le)}const ze=((ue=(re=te.outlines)==null?void 0:re.preview)==null?void 0:ue.svg)||((ke=te.demo)==null?void 0:ke.svg),Se=ln(ze),Me=v.current;Se&&Me&&p(le=>{const Ee=le.map(je=>je.id===Me?{...je,previewSvg:Se}:je);return pe(Ee,Me,2),Ee});let Te=!1;if(ve&&te.cases&&Object.keys(te.cases).length>0){for(const le of Object.keys(te.cases)){const Ee=te.cases[le];Ee!=null&&Ee.jscad&&(te.cases[le].stl=void 0)}if(ye.current){Te=!0,it(!0);const le={type:"batch_jscad_to_stl",results:te,configVersion:rt.current};ye.current.postMessage(le)}}H(te),Q(le=>le+1),Te||we(!1)}else we(!1);else we(!1)},[ve,Be]),No=f.useCallback(j=>{const P=j.data;P.configVersion===rt.current&&(P.type==="error"?(console.error("--- JSCAD worker error:",P.error),it(!1),we(!1)):P.type==="success"&&P.results&&(H(P.results),Q(N=>N+1),it(!1),we(!1)))},[]);f.useEffect(()=>(ae.current||(ae.current=Xe(),ae.current?(ae.current.onmessage=st,ae.current.onerror=j=>{console.error("Ergogen worker error:",j),Je(j.message||"Worker crash",!1,"ergogen_worker")},nt(!0)):console.warn("Failed to initialize Ergogen worker.")),ye.current||(ye.current=lo(),ye.current?(ye.current.onmessage=No,ye.current.onerror=j=>{console.error("JSCAD worker error:",j),Je(j.message||"Worker crash",!1,"jscad_worker")}):console.warn("Failed to initialize JSCAD worker.")),()=>{ae.current&&(ae.current.terminate(),ae.current=null,nt(!1)),ye.current&&(ye.current.terminate(),ye.current=null)}),[st,No]),f.useEffect(()=>{const j=()=>{document.visibilityState==="hidden"&&O()};return window.addEventListener("visibilitychange",j),window.addEventListener("pagehide",O),()=>{window.removeEventListener("visibilitychange",j),window.removeEventListener("pagehide",O),O()}},[O]);const Lt=f.useRef({debug:de,autoGen:xe,autoGen3D:ge,kicanvasPreview:Fe,stlPreview:ve,sendUsageMetrics:$e});f.useEffect(()=>{const j={debug:de,autoGen:xe,autoGen3D:ge,kicanvasPreview:Fe,stlPreview:ve,sendUsageMetrics:$e},{sendUsageMetrics:P,...N}=j;if(zo.current)zo.current=!1,Lt.current=j,B("settings_loaded",{...N});else{const K=Lt.current,oe=Object.keys(j).find(J=>j[J]!==K[J]);Lt.current=j,B("setting_changed",{...oe?{setting_name:oe,setting_value:j[oe]}:{},...N})}},[de,xe,ge,Fe,ve,$e]);const Uo=f.useCallback(j=>{let P="UNKNOWN",N=null;try{N=JSON.parse(j),P="json"}catch{}try{N=fe.load(j),P="yaml"}catch{}return[P,N]},[]),at=f.useCallback(async(j,P,N={pointsonly:!0})=>{const K=j===void 0||j===E.current?$.current??E.current:j;if(!K)return;const oe=Ni(P),J=JSON.stringify([K,oe,N.pointsonly,de]);if(N.skipIfCurrent&&J===q.current)return;q.current=J;const[,re]=Uo(K);ne(null),M(null),T(null),we(!0),zt.current=performance.now(),rt.current+=1;const ue=Oi(re);ue&&M(ue);const ke=Ui(P);ke&&T(ke);const te=Wi(re,N.pointsonly)||K,Ie=N.isManual?"ergogen-manual":"ergogen-generate";try{ae.current?ae.current.postMessage({type:"generate",inputConfig:te,injectionInput:oe,requestId:`${Ie}-${rt.current}-${Date.now()}`,options:{debug:de,svg:!0}}):console.error("Worker not available for processing request.")}catch(ze){we(!1);const Se=typeof ze=="string"?ze:String(ze);ne(Se),Be("generation_failed",{error_message:Se,stored_configs_count:y.current.length,trigger:N.isManual?"manual":"auto"},!!N.isManual);return}},[Uo,ne,M,T,we,de,Be]),Le=f.useMemo(()=>Wn((j,P,N={pointsonly:!0})=>at(j,P,{...N,skipIfCurrent:!0}),300),[at]),Pe=f.useCallback(async(j,P,N={pointsonly:!0})=>{Le.cancel(),await at(j,P,N)},[Le,at]),lt=f.useCallback(j=>{const P=E.current,N=typeof j=="function"?j(P):j;if(N!==P)if(u(N),z.current){if(N!==S.current){const oe=`Shared Config ${ct(y.current,/^Shared\s+Config\s+(\d+)$/)}`,J=Re(),re=new Date().toISOString(),ue={id:J,name:oe,config:N||"",createdAt:re,updatedAt:re},ke=[...y.current,ue];p(ke),l(J),b(!1),x(null),pe(ke,J)}}else{const K=v.current;if(K){const oe=y.current.map(J=>J.id===K?{...J,config:N||"",updatedAt:new Date().toISOString()}:J);p(oe),pe(oe,K)}else{const J=`Untitled ${ct(y.current,/^Untitled\s+(\d+)$/)}`,re=Re(),ue=new Date().toISOString(),ke={id:re,name:J,config:N||"",createdAt:ue,updatedAt:ue},te=[...y.current,ke];p(te),l(re),pe(te,re)}}},[]),Oo=f.useCallback(j=>{if(U(),se(),j===null)l(null),v.current=null,b(!1),x(null),u(""),E.current="",pe(y.current,null);else{const P=y.current.find(N=>N.id===j);P&&(l(j),v.current=j,b(!1),x(null),u(P.config),E.current=P.config,pe(y.current,j),B("config_selected",{stored_configs_count:y.current.length}))}},[U,se]),Wo=f.useCallback((j,P)=>{U(),se();const N=ct(y.current,/^Untitled\s+(\d+)$/),K=P||`Untitled ${N}`,oe=Re(),J=new Date().toISOString(),re={id:oe,name:K,config:j,createdAt:J,updatedAt:J},ue=[...y.current,re];return p(ue),l(oe),b(!1),x(null),u(j),B("config_created",{stored_configs_count:ue.length}),y.current=ue,v.current=oe,E.current=j,pe(ue,oe),oe},[U,se]),Fo=f.useCallback((j,P)=>{const N=P.trim();if(!N)return ne("Configuration name cannot be empty"),!1;const K=y.current.find(re=>re.id===j);if(!K)return!1;if(K.name===N)return!0;if(y.current.some(re=>re.id!==j&&re.name.trim().toLowerCase()===N.toLowerCase()))return ne(`A configuration named "${N}" already exists.`),!1;const J=y.current.map(re=>re.id===j?{...re,name:N,updatedAt:new Date().toISOString()}:re);return p(J),y.current=J,pe(J,v.current),B("config_renamed",{stored_configs_count:J.length}),!0},[ne]),Bo=f.useCallback(j=>{U(),se();const P=y.current.find(N=>N.id===j);if(P){const N=Re(),K=new Date().toISOString(),oe={id:N,name:`${P.name} (Copy)`,config:P.config,createdAt:K,updatedAt:K},J=[...y.current,oe];p(J),l(N),b(!1),x(null),u(P.config),y.current=J,v.current=N,E.current=P.config,pe(J,N),B("config_duplicated",{stored_configs_count:J.length})}},[U,se]),Mo=f.useCallback(j=>{U();const P=v.current,N=y.current.find(re=>re.id===j),K=y.current.filter(re=>re.id!==j);p(K),y.current=K;const oe=P===j;y.current.length<=1||oe?(se(),l(null),v.current=null,u(""),E.current="",pe(K,null)):pe(K,P),N&&Fi(N),B("config_deleted",{stored_configs_count:K.length})},[U,se]),To=f.useCallback(j=>{U(),se(),b(!0),x(j),u(j)},[U,se]),Go=f.useCallback(()=>{if(!z.current)return;const P=`Shared Config ${ct(y.current,/^Shared\s+Config\s+(\d+)$/)}`,N=Re(),K=new Date().toISOString(),oe={id:N,name:P,config:E.current||"",createdAt:K,updatedAt:K},J=[...y.current,oe];p(J),y.current=J,l(N),v.current=N,b(!1),x(null),pe(J,N)},[]),Ho=f.useCallback(()=>{an()},[]),Vo=f.useCallback(async()=>{await Di(y.current,F,de,ve)},[F,de,ve]),qo=f.useCallback(async()=>{await Ai(y.current,F)},[F]),Jo=f.useMemo(()=>{if(h)return"Shared Config";if(m){const j=c.find(P=>P.id===m);return j?j.name:""}return""},[h,m,c]),kr=f.useMemo(()=>({setInjectionInput:ee,setConfigInput:lt,generateNow:Pe,getCurrentInjections:()=>F||[],setError:ne}),[F,Pe,ee,lt,ne]),{currentConflict:Dt,processInjectionsWithConflictResolution:_r,handleConflictResolution:vr,handleConflictCancel:jr}=St(kr),{isLoading:Ko}=Ii({processInjectionsWithConflictResolution:_r,setError:ne}),Yo=f.useRef(null);f.useEffect(()=>{if(t||Ko)return;!new URLSearchParams(window.location.search).get("github")&&k&&(Yo.current=v.current,Pe(k,F,{pointsonly:!1}))},[Ko]);const Xo=f.useRef(Ce);f.useEffect(()=>{Xo.current&&!Ce&&(console.log("Settings panel closed. Restarting Ergogen worker to clear stale custom libraries..."),ae.current&&(ae.current.terminate(),ae.current=null,nt(!1),console.log("Ergogen worker terminated.")),console.log("Initializing fresh Ergogen worker..."),ae.current=Xe(),ae.current?(ae.current.onmessage=st,ae.current.onerror=j=>{console.error("Ergogen worker error:",j),Je(j.message||"Worker crash",!1,"ergogen_worker")},nt(!0),console.log("Ergogen worker initialized.")):console.warn("Failed to initialize Ergogen worker."),k&&Pe(k,F,{pointsonly:!ge})),Xo.current=Ce},[Ce,k,F,ge,Pe,st]),f.useEffect(()=>{localStorage.setItem("ergogen:injection",JSON.stringify(F)),xe&&!Ce&&Le(k,F,{pointsonly:!ge})},[k,F,xe,ge,Ce,Le]),f.useEffect(()=>{Po&&(i===1||n)&&(console.log("Version 1 or legacy configuration detected on load. Triggering background preview generation for all configs missing a preview SVG..."),pe(y.current,v.current,2),y.current.forEach(j=>{var P;!j.previewSvg&&j.id!==Yo.current&&(console.log(`Triggering background preview generation for: ${j.name}`),(P=ae.current)==null||P.postMessage({type:"generate",inputConfig:j.config,requestId:`background-preview-${j.id}`,options:{debug:!0,svg:!0}}))}))},[Po,i,n]);const $r=f.useMemo(()=>({configInput:k,getRealtimeConfigInput:D,updateRealtimeConfigInput:L,setConfigInput:lt,configs:c,activeConfigId:m,activeConfigName:Jo,isPreview:h,selectConfig:Oo,createNewConfig:Wo,renameConfig:Fo,duplicateConfig:Bo,deleteConfig:Mo,exportAllConfigs:Vo,downloadAllConfigs:qo,loadPreview:To,savePreviewConfig:Go,pruneDeletedConfigs:Ho,injectionInput:F,setInjectionInput:ee,processInput:Le,generateNow:Pe,error:X,setError:ne,clearError:Lo,deprecationWarning:Y,clearWarning:Do,skippedWarning:W,clearSkippedWarning:Ao,info:Z,setInfo:G,clearInfo:Ro,results:_,resultsVersion:V,setResultsVersion:Q,showSettings:Ce,setShowSettings:yo,isBulkDownloadOpen:ko,setIsBulkDownloadOpen:yr,showSideNav:_o,setShowSideNav:vo,showConfig:jo,setShowConfig:$o,showDownloads:Co,setShowDownloads:So,debug:de,setDebug:ho,autoGen:xe,setAutoGen:go,autoGen3D:ge,setAutoGen3D:mo,kicanvasPreview:Fe,setKicanvasPreview:bo,stlPreview:ve,setStlPreview:wo,sendUsageMetrics:$e,setSendUsageMetrics:xo,isGenerating:Eo,setIsGenerating:we,isJscadConverting:Io}),[k,D,L,lt,c,m,Jo,h,Oo,Wo,Fo,Bo,Mo,Vo,qo,ko,To,Go,Ho,F,ee,Le,Pe,X,ne,Lo,Y,Do,W,Ao,Z,G,Ro,_,V,Q,Ce,yo,_o,vo,jo,$o,Co,So,de,ho,xe,go,ge,mo,Fe,bo,ve,wo,$e,xo,Eo,we,Io]);return o.jsxs(ar.Provider,{value:$r,children:[s,Dt&&o.jsx(Ct,{injectionName:Dt.name,injectionType:Dt.type,onResolve:vr,onCancel:jr,"data-testid":"conflict-resolution-dialog"})]})},_e=()=>f.useContext(ar),Gi=({className:e,options:t,"data-testid":s,"aria-label":n})=>{const i=_e(),a=f.useRef(null),c={configInput:void 0,setConfigInput:y=>{},updateRealtimeConfigInput:y=>{},injectionInput:void 0,generateNow:async()=>{},activeConfigId:null},{configInput:p,updateRealtimeConfigInput:m,setConfigInput:l,injectionInput:h,generateNow:b,activeConfigId:g}=i??c,x=f.useRef(Wn(y=>{l(y)},500)).current;f.useEffect(()=>()=>{x.cancel()},[x]),f.useEffect(()=>{if(a.current){if(a.current.hasTextFocus())return;const y=a.current.getValue();p!==void 0&&p!==y&&a.current.setValue(p)}},[p]);const k=f.useCallback(y=>{y!==void 0&&(m(y),x(y))},[x,m]),u=(y,v)=>{a.current=y,y.onDidBlurEditorText(()=>{x.flush()}),y.addAction({id:"generate-config",label:"Generate",keybindings:[v.KeyMod.CtrlCmd|v.KeyCode.Enter],run:()=>{const z=y.getValue();x.cancel(),m(z),l(z),b(z,h,{pointsonly:!1,isManual:!0})}})};return i?o.jsx("div",{className:e,"data-testid":s,"aria-label":n,children:o.jsx(Fn,{height:"100%",defaultLanguage:"yaml",language:"yaml",onChange:k,onMount:u,defaultValue:p,theme:"ergogen-theme",options:t||void 0},g||"preview")}):null},Hi=({className:e,options:t,injection:s,setInjection:n,"data-testid":i,"aria-label":a})=>{const c=_e(),p=async m=>{if(!m)return null;const l={...s,content:m};n(l)};return c?o.jsx(Vi,{className:e,"data-testid":i,"aria-label":a,children:o.jsx(Fn,{height:"100%",defaultLanguage:"javascript",language:"javascript",onChange:p,value:s.content,theme:"ergogen-theme",options:t||void 0})}):null},Vi=d.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: 0.5rem;
`,qi=_t`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Ji=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;

  @media (max-width: 639px) {
    padding-bottom: 0.75rem;
  }
`,Ki=d.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${r.fontSizes.bodySmall};
  cursor: ${e=>e.$hasPreview?"pointer":"default"};
  border-bottom: ${e=>e.$active?`2px solid ${r.colors.accent}`:"2px solid transparent"};
  border-top: 2px solid transparent;
  opacity: ${e=>e.$disabled?.5:1};
  color: ${e=>e.$disabled?r.colors.textDarker:r.colors.white};
`,Yi=d.div`
  white-space: nowrap;
  display: flex;
  gap: 10px;
  align-items: center;
`,Xi=d.a`
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
`,Zi=d.a`
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
    animation: ${qi} 1s linear infinite;
  }
`,Qi=({fileName:e,extension:t,content:s,preview:n,setPreview:i,previewKey:a,"data-testid":c})=>{const p=t==="stl"&&!s||t==="kicad_pcb"&&!n,m=t==="stl"&&!s,l=()=>{if(m)return;B("download_button_clicked",{download_type:t,source:"downloads_panel"});const g=document.createElement("a"),x=new Blob([s],{type:"octet/stream"});g.href=URL.createObjectURL(x),g.download=`${e}.${t}`,document.body.appendChild(g),g.click()},h=()=>{n&&!p&&i(n)},b=c?`${c}-${t}`:void 0;return o.jsxs(Ji,{"data-testid":b,children:[o.jsxs(Ki,{$active:a===(n==null?void 0:n.key),$hasPreview:!!n,$disabled:p,onClick:h,"data-testid":b&&`${b}-preview`,children:[e,".",t]}),o.jsx(Yi,{children:m?o.jsx(Zi,{"aria-label":`Generating ${e}.${t}`,"data-testid":b&&`${b}-loading`,children:o.jsx("span",{className:"material-symbols-outlined",children:"progress_activity"})}):o.jsx(Xi,{onClick:l,"aria-label":`Download ${e}.${t}`,"data-testid":b&&`${b}-download`,children:o.jsx("span",{className:"material-symbols-outlined",children:"download"})})})]})},es=d.h3`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  margin: 0 0 1rem;

  @media (max-width: 639px) {
    display: none;
  }
`,ts=d.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;

  @media (max-width: 639px) {
    padding: 0.5rem;
  }
`,os=d.div`
  font-size: ${r.fontSizes.sm};
  color: ${r.colors.textDarkest};
  font-style: italic;
  padding: 0.5rem 0;
`,ns=({setPreview:e,previewKey:t,"data-testid":s})=>{var m,l;const n=[],i=_e();if(!i)return null;const{configInput:a,results:c}=i;if(c!=null&&c.demo&&n.push({fileName:"raw",extension:"txt",content:a??"",previewKey:"raw",preview:{key:"raw",extension:"txt",content:a??""}},{fileName:"canonical",extension:"yaml",content:fe.dump(c.canonical),previewKey:"canonical",preview:{key:"canonical",extension:"yaml",content:fe.dump(c.canonical)}},{fileName:"demo",extension:"dxf",content:((m=c.demo)==null?void 0:m.dxf)??"",previewKey:"demo.svg",preview:{key:"demo.svg",extension:"svg",content:((l=c.demo)==null?void 0:l.svg)??""}},{fileName:"points",extension:"yaml",content:fe.dump(c.points),previewKey:"points",preview:{key:"points",extension:"yaml",content:fe.dump(c.points)}},{fileName:"units",extension:"yaml",content:fe.dump(c.units),previewKey:"units",preview:{key:"units",extension:"yaml",content:fe.dump(c.units)}}),c!=null&&c.outlines)for(const[h,b]of Object.entries(c.outlines))n.push({fileName:h,extension:"dxf",content:b.dxf??"",previewKey:`outlines.${h}.svg`,preview:{key:`outlines.${h}.svg`,extension:"svg",content:b.svg??""}});if(c!=null&&c.cases){for(const[h,b]of Object.entries(c.cases))if(n.push({fileName:h,extension:"jscad",content:b.jscad??"",previewKey:`cases.${h}`,preview:{key:`cases.${h}`,extension:"jscad",content:b.jscad??""}}),i.stlPreview&&b.jscad){const g=!!b.stl;n.push({fileName:h,extension:"stl",content:b.stl??"",previewKey:g?`cases.${h}.stl`:"",preview:g?{key:`cases.${h}.stl`,extension:"stl",content:b.stl??""}:void 0})}}if(c!=null&&c.pcbs)for(const[h,b]of Object.entries(c.pcbs)){const x=String(b).match(/version "?([0-9]+)"?/),k=x&&x.length>1?Number(x[1]):-1;n.push({fileName:h,extension:"kicad_pcb",content:b,previewKey:i.kicanvasPreview&&k>20240101?`pcbs.${h}`:"",preview:i.kicanvasPreview&&k>20240101?{key:`pcbs.${h}`,extension:"kicad_pcb",content:b}:void 0})}const p=n.filter(h=>!(!i.debug&&(h.fileName.startsWith("_")||{units:"yaml",points:"yaml",canonical:"yaml",raw:"txt"}[h.fileName]===h.extension||i.stlPreview&&h.extension==="jscad")));return o.jsxs(ts,{"data-testid":s,children:[o.jsx(es,{children:"Outputs"}),p.length>0?p.map((h,b)=>o.jsx(Qi,{...h,setPreview:e,previewKey:t,"data-testid":s&&`${s}-${h.fileName}`},b)):o.jsx(os,{children:"No outputs"})]})},rs=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
`,is=d.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${r.fontSizes.bodySmall};
  cursor: pointer;
  border-bottom: ${e=>e.$active?`2px solid ${r.colors.accent}`:"2px solid transparent"};
  border-top: 2px solid transparent;
`,ss=d.div`
  white-space: nowrap;
  display: flex;
  gap: 6px;
  align-items: center;
`,lr=Bn`
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
`,cn=d.a`
  ${lr}
`,as=d.a`
  ${lr}

  @media (min-width: 640px) {
    display: none;
  }
`,Ot=({injection:e,setInjectionToEdit:t,deleteInjection:s,previewKey:n,"data-testid":i})=>o.jsxs(rs,{"data-testid":i,children:[o.jsx(is,{"data-testid":i&&`${i}-name`,$active:n===e.name,onClick:()=>t(e),children:e.name}),o.jsxs(ss,{children:[o.jsx(as,{href:"#",onClick:a=>{a.preventDefault(),t(e)},"aria-label":`edit injection ${e.name}`,"data-testid":i&&`${i}-edit`,children:o.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),o.jsx(cn,{href:"#",onClick:a=>{a.preventDefault(),s(e)},"aria-label":`delete injection ${e.name}`,"data-testid":i&&`${i}-delete`,children:o.jsx("span",{className:"material-symbols-outlined",children:"delete"})}),o.jsx(cn,{target:"_blank",rel:"noopener noreferrer",download:`${e.name.split("/").reverse()[0]}.js`,href:window.URL.createObjectURL(new Blob([e.content],{type:"octet/stream"})),"aria-label":`download injection ${e.name}`,"data-testid":i&&`${i}-download`,children:o.jsx("span",{className:"material-symbols-outlined",children:"download"})})]})]}),Ke=d.button`
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
`,wt=d.h3`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  margin: 1.5rem 0.5rem 1rem 0.5rem;
`,dn=e=>{const n=new DOMParser().parseFromString(e,"image/svg+xml").querySelectorAll("path"),i=[];return n.forEach(a=>{const c=a.getAttribute("d");if(c&&c.trim()){const p=c.replace(/\\/g,"\\\\").replace(/"/g,'\\"');i.push(`        "${p}"`)}}),`const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
${i.join(`,
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
`,ls=d.div`
  display: flex;
  margin-left: 0.5rem;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.5rem;
`,cs=d.div`
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
`,ds=({setInjectionToEdit:e,deleteInjection:t,injectionToEdit:s,onInjectionSelect:n,"data-testid":i})=>{const a=[],c=[],p=[],m=f.useRef(null),l=f.useRef(null),h=_e(),[b,g]=f.useState("footprint"),[x,k]=f.useState("footprints"),{currentConflict:u,processInjectionsWithConflictResolution:y,handleConflictResolution:v,handleConflictCancel:z}=St({setInjectionInput:w=>h==null?void 0:h.setInjectionInput(w),setConfigInput:w=>h==null?void 0:h.setConfigInput(w),generateNow:async(w,C,A)=>{await(h==null?void 0:h.generateNow(w,C,A))},getCurrentInjections:()=>(h==null?void 0:h.injectionInput)||[],setError:w=>h==null?void 0:h.setError(w)});if(!h)return null;const{injectionInput:S}=h;if(S&&Array.isArray(S)&&S.length>0)for(let w=0;w<S.length;w++){const C=S[w];if(C.length===3){let A=p;C[0]==="footprint"?A=a:C[0]==="outline"?A=c:C[0]==="template"&&(A=p),A.push({key:w,type:C[0],name:C[1],content:C[2]})}}const E=()=>{var A;const w=((A=h==null?void 0:h.injectionInput)==null?void 0:A.length)||0,C={key:w,type:"footprint",name:`custom_footprint_${w+1}`,content:`module.exports = {
  params: {
    designator: '',
  },
  body: p => \`\`
}`};B("injection_created",{injection_type:"footprint"}),e(C),n&&n()},$=()=>{var A;const w=((A=h==null?void 0:h.injectionInput)==null?void 0:A.length)||0,C={key:w,type:"outline",name:`custom_outline_${w+1}`,content:`const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
        ""  // Add your SVG path(s) here
    ];
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
};`};B("injection_created",{injection_type:"outline"}),e(C),n&&n()},L=()=>{var A;const w=((A=h==null?void 0:h.injectionInput)==null?void 0:A.length)||0,C={key:w,type:"template",name:`custom_template_${w+1}`,content:`const m = require('makerjs')
const version = require('../../package.json').version

module.exports = {
    convert_outline: (model, layer) => {
        return \`\`;  // Return your converted outlines
    },
    body: params => {
        return \`\`;  // Add your template text here
    }
}`};B("injection_created",{injection_type:"template"}),e(C),n&&n()},D=async w=>{const C=w.target.files;if(!C||C.length===0)return;const A=[];for(let R=0;R<C.length;R++){const O=C[R];if(O.name.endsWith(".js")){const U=await O.text(),F=O.name.replace(/\.js$/,"");A.push([b,F,U])}else if(b==="outline"&&O.name.endsWith(".svg")){const U=await O.text(),F=dn(U),ee=O.name.replace(/\.svg$/,"");A.push([b,ee,F])}}A.length>0&&(B("injection_uploaded",{injection_type:b,source:"file",file_count:A.length}),await y(A,h.configInput||"")),w.target.value=""},I=async w=>{const C=w.target.files;if(!C||C.length===0)return;const A=[];for(let R=0;R<C.length;R++){const O=C[R];if(O.name.endsWith(".js")){const U=await O.text(),F=O.webkitRelativePath.split("/");F.shift();const ee=F.join("/").replace(/\.js$/,"");A.push([b,ee,U])}else if(b==="outline"&&O.name.endsWith(".svg")){const U=await O.text(),F=O.webkitRelativePath.split("/");F.shift();const ee=F.join("/").replace(/\.svg$/,""),X=dn(U);A.push([b,ee,X])}}A.length>0&&(B("injection_uploaded",{injection_type:b,source:"folder",file_count:A.length}),await y(A,h.configInput||"")),w.target.value=""};return o.jsxs(ls,{"data-testid":i,children:[u&&o.jsx(Ct,{injectionName:u.name,injectionType:u.type,onResolve:v,onCancel:z,"data-testid":"conflict-resolution-dialog"}),o.jsx(wt,{children:"Custom Libraries"}),o.jsxs(cs,{children:[o.jsx(Ft,{$active:x==="footprints",onClick:()=>{k("footprints"),g("footprint")},"data-testid":"tab-footprints",children:"Footprints"}),ce("outlines")&&o.jsx(Ft,{$active:x==="outlines",onClick:()=>{k("outlines"),g("outline")},"data-testid":"tab-outlines",children:"Outlines"}),ce("templates")&&o.jsx(Ft,{$active:x==="templates",onClick:()=>{k("templates"),g("template")},"data-testid":"tab-templates",children:"Templates"})]}),x==="footprints"&&o.jsxs(o.Fragment,{children:[a.map(w=>o.jsx(Ot,{injection:w,setInjectionToEdit:C=>{B("injection_editor_opened",{injection_type:C.type}),e(C),n&&n()},deleteInjection:t,previewKey:s.name,"data-testid":i&&`${i}-${w.name}`},w.key)),o.jsxs(Wt,{children:[o.jsx(Ke,{onClick:E,"data-testid":"add-footprint","aria-label":"Add new custom footprint",title:"Add footprint",children:o.jsx("span",{className:"material-symbols-outlined",children:"add"})}),o.jsx(De,{onClick:()=>{g("footprint"),setTimeout(()=>{var w;return(w=m.current)==null?void 0:w.click()},0)},"data-testid":"load-footprint-files","aria-label":"Load custom footprint files",title:"Load footprint files",children:o.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),o.jsx(De,{onClick:()=>{g("footprint"),setTimeout(()=>{var w;return(w=l.current)==null?void 0:w.click()},0)},"data-testid":"load-footprint-folder","aria-label":"Load custom footprint folder",title:"Load footprint folder",children:o.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),x==="outlines"&&ce("outlines")&&o.jsxs(o.Fragment,{children:[c.map(w=>o.jsx(Ot,{injection:w,setInjectionToEdit:C=>{B("injection_editor_opened",{injection_type:C.type}),e(C),n&&n()},deleteInjection:t,previewKey:s.name,"data-testid":i&&`${i}-${w.name}`},w.key)),o.jsxs(Wt,{children:[o.jsx(Ke,{onClick:$,"data-testid":"add-outline","aria-label":"Add new custom outline",title:"Add outline",children:o.jsx("span",{className:"material-symbols-outlined",children:"add"})}),o.jsx(De,{onClick:()=>{g("outline"),setTimeout(()=>{var w;return(w=m.current)==null?void 0:w.click()},0)},"data-testid":"load-outline-files","aria-label":"Load custom outline files",title:"Load outline files",children:o.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),o.jsx(De,{onClick:()=>{g("outline"),setTimeout(()=>{var w;return(w=l.current)==null?void 0:w.click()},0)},"data-testid":"load-outline-folder","aria-label":"Load custom outline folder",title:"Load outline folder",children:o.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),x==="templates"&&ce("templates")&&o.jsxs(o.Fragment,{children:[p.map(w=>o.jsx(Ot,{injection:w,setInjectionToEdit:C=>{B("injection_editor_opened",{injection_type:C.type}),e(C),n&&n()},deleteInjection:t,previewKey:s.name,"data-testid":i&&`${i}-${w.name}`},w.key)),o.jsxs(Wt,{children:[o.jsx(Ke,{onClick:L,"data-testid":"add-template","aria-label":"Add new custom template",title:"Add template",children:o.jsx("span",{className:"material-symbols-outlined",children:"add"})}),o.jsx(De,{onClick:()=>{g("template"),setTimeout(()=>{var w;return(w=m.current)==null?void 0:w.click()},0)},"data-testid":"load-template-files","aria-label":"Load custom template files",title:"Load template files",children:o.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),o.jsx(De,{onClick:()=>{g("template"),setTimeout(()=>{var w;return(w=l.current)==null?void 0:w.click()},0)},"data-testid":"load-template-folder","aria-label":"Load custom template folder",title:"Load template folder",children:o.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),o.jsx("input",{type:"file",ref:m,onChange:D,accept:b==="outline"?".js,.svg":".js",multiple:!0,style:{display:"none"}}),o.jsx("input",{type:"file",ref:l,onChange:I,accept:b==="outline"?".js,.svg":".js",style:{display:"none"},webkitdirectory:"",directory:""})]})},us=d.img`
  filter: invert();
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
`,ps=d(Sr.PanZoom)`
  overflow: hidden;
  height: 100%;

  &:focus-visible {
    outline: none;
  }
`,fs=({svg:e,width:t,height:s,"aria-label":n,"data-testid":i})=>o.jsx(ps,{enableBoundingBox:!0,minZoom:.8,maxZoom:5,"aria-label":n,"data-testid":i,children:o.jsx(us,{width:t||"100%",height:s||"100%",src:`data:image/svg+xml;utf8,${encodeURIComponent(e)}`,alt:"Ergogen SVG Output preview",draggable:"false"})}),Bt=({content:e,language:t,className:s,height:n,options:i,"aria-label":a,"data-testid":c})=>o.jsx("div",{className:s,"aria-label":a,"data-testid":c,children:o.jsx(Er,{height:n||"80vh",language:t,value:e,theme:"ergogen-theme",options:i||{readOnly:!0}})}),hs=f.lazy(()=>qn(()=>import("./PcbPreview-DsKQssW6.js"),__vite__mapDeps([0,1]))),gs=f.lazy(()=>qn(()=>import("./StlPreview-BY1EHQ5G.js"),__vite__mapDeps([2,1,3,4,5]))),cr=d.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: ${r.colors.background};
`,dr=d.img`
  width: 96px;
  height: 96px;
  opacity: 0.12;
  filter: grayscale(100%);
  -webkit-user-drag: none;
  user-drag: none;
`,ms=d.span`
  color: ${r.colors.textDarkest};
  font-size: ${r.fontSizes.sm};
  margin-top: 1rem;
  font-family: ${r.fonts.body};
  user-select: none;
`,un=()=>o.jsxs(cr,{children:[o.jsx(dr,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"}),o.jsx(ms,{children:"Loading preview..."})]}),bs=({previewExtension:e,previewContent:t,previewKey:s,width:n="100%",height:i="100%",className:a,"data-testid":c,"aria-label":p})=>{if(!t||typeof t=="string"&&t===""||t instanceof ArrayBuffer&&t.byteLength===0||ArrayBuffer.isView(t)&&t.byteLength===0)return o.jsx(cr,{className:a,"data-testid":c,"aria-label":p,children:o.jsx(dr,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"})});const l=h=>{switch(h){case"svg":return o.jsx(fs,{svg:t,width:n,height:i,"aria-label":p||`SVG preview for ${s}`,"data-testid":c&&`${c}-svg`});case"yaml":return o.jsx(Bt,{language:"yaml",content:t,"aria-label":p||`YAML preview for ${s}`,"data-testid":c&&`${c}-yaml`});case"txt":return o.jsx(Bt,{language:"text",content:t,"aria-label":p||`Text preview for ${s}`,"data-testid":c&&`${c}-txt`});case"jscad":return o.jsx(Bt,{language:"javascript",content:t,"aria-label":p||`JSCAD code preview for ${s}`,"data-testid":c&&`${c}-jscad-text`});case"kicad_pcb":return o.jsx(f.Suspense,{fallback:o.jsx(un,{}),children:o.jsx(hs,{pcb:t,previewKey:s,"aria-label":p||`PCB preview for ${s}`,"data-testid":c&&`${c}-pcb`},s)});case"stl":return o.jsx(f.Suspense,{fallback:o.jsx(un,{}),children:o.jsx(gs,{stl:t,"aria-label":p||`STL preview for ${s}`,"data-testid":c&&`${c}-stl`})});default:return"No preview available"}};return o.jsx("div",{className:a,"data-testid":c,"aria-label":p,children:l(e)})},Mt=({children:e,initialWidth:t=300,minWidth:s=10,maxWidth:n="100%",side:i="left",style:a,"data-testid":c})=>{const[p,m]=f.useState(t),l=f.useRef(!1),h=f.useRef(0),b=f.useRef(t),g=f.useRef(null),x=u=>{if(typeof u=="string"&&u.includes("%")){const y=parseFloat(u)/100;return window.innerWidth*y}else return typeof u=="string"&&u.includes("px")?parseFloat(u):typeof u=="number"?u:1/0};f.useEffect(()=>{const u=S=>{if(!l.current)return;const E=i==="left"?S.clientX-h.current:h.current-S.clientX,$=b.current+E,L=x(n),D=Math.max(s,Math.min($,L));m(D)},y=()=>{l.current&&(l.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},v=S=>{if(!l.current)return;S.preventDefault();const E=S.touches[0],$=i==="left"?E.clientX-h.current:h.current-E.clientX,L=b.current+$,D=x(n),I=Math.max(s,Math.min(L,D));m(I)},z=()=>{l.current&&(l.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",u),window.addEventListener("mouseup",y),window.addEventListener("touchmove",v,{passive:!1}),window.addEventListener("touchend",z),()=>{window.removeEventListener("mousemove",u),window.removeEventListener("mouseup",y),window.removeEventListener("touchmove",v),window.removeEventListener("touchend",z)}},[s,n,i]);const k=u=>{u.preventDefault(),u.stopPropagation(),l.current=!0,b.current=p,"touches"in u?h.current=u.touches[0].clientX:h.current=u.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};return o.jsxs(ws,{ref:g,$side:i,style:{width:`${p}px`,...a},"data-testid":c,children:[e,o.jsx(xs,{$side:i,onMouseDown:k,onTouchStart:k,"data-testid":c&&`${c}-resize-handle`})]})},ws=d.div`
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
`,xs=d.div`
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
`,oo=(e,t)=>{if(t===null)return null;if(e==="")return t;if(typeof t!="object")return;const s=e.split("."),n=s[0],i=s.slice(1).join(".");return Object.prototype.hasOwnProperty.call(t,n)?oo(i,t[n]):void 0};function ur(){if(typeof navigator<"u"){if("userAgentData"in navigator&&navigator.userAgentData){const e=navigator.userAgentData;if(e.platform&&/mac/i.test(e.platform))return!0}if(/Mac|iPhone|iPad|iPod/i.test(navigator.userAgent))return!0}return!1}const ys=d.input.attrs(e=>({type:"text",$size:e.$size||"0.5em"}))`
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
`,ks=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`,_s=d.label`
  display: flex;
  flex-direction: column;
  flex: 1;
  cursor: ${e=>e.$disabled?"not-allowed":"pointer"};
  user-select: none;
  text-align: left;
`,vs=d.span`
  color: ${r.colors.text};
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
`,js=d.span`
  color: ${r.colors.textDarker};
  font-size: ${r.fontSizes.sm};
  margin-top: 0.25rem;
  line-height: 1.4;
`,$s=d.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`,Cs=d.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: ${e=>e.$disabled?"not-allowed":"pointer"};
  opacity: ${e=>e.$disabled?.5:1};
`,Ss=d.input`
  opacity: 0;
  width: 0;
  height: 0;
`,Es=d.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${e=>e.$checked?r.colors.accent:r.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`,Ps=d.span`
  position: absolute;
  top: 2px;
  left: ${e=>e.$checked?"18px":"2px"};
  width: 16px;
  height: 16px;
  background-color: ${r.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,Ae=({optionId:e,label:t,description:s,setSelected:n,checked:i,disabled:a=!1,"aria-label":c})=>o.jsxs(ks,{children:[o.jsxs(_s,{htmlFor:e,$disabled:a,children:[o.jsx(vs,{children:t}),s&&o.jsx(js,{children:s})]}),o.jsx($s,{children:o.jsxs(Cs,{$disabled:a,htmlFor:e,children:[o.jsx(Ss,{type:"checkbox",id:e,checked:i,disabled:a,onChange:p=>n(p.target.checked),"data-testid":`option-${e}`,"aria-label":c}),o.jsx(Es,{$checked:i}),o.jsx(Ps,{$checked:i})]})})]}),Ne=d.button`
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
`,dt=d.h4`
  font-size: ${r.fontSizes.sm};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.textDarker};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 1.5rem 0.5rem 0.5rem 0.5rem;

  &:first-of-type {
    margin-top: 0.5rem;
  }
`,ut=d.div`
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
`,Is=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`,zs=d.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  user-select: none;
  text-align: left;
`,Ls=d.span`
  color: ${r.colors.text};
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
`,no=d.span`
  color: ${r.colors.textDarker};
  font-size: ${r.fontSizes.sm};
  margin-top: 0.25rem;
  line-height: 1.4;
`,Ds=d(no)`
  color: ${r.colors.warningDark};
`,As=d.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`,Rs=({isAvailable:e,isInstalled:t,isInstalling:s,onInstall:n})=>{let i,a;return t?(i=o.jsx(no,{children:"The application is installed and available offline."}),a=o.jsx(he,{size:"sm",disabled:!0,"data-testid":"pwa-installed-button",children:"Installed"})):e?(i=o.jsx(no,{children:"Install the app locally to access it offline without network connectivity."}),s?a=o.jsx(he,{size:"sm",disabled:!0,"data-testid":"pwa-installing-button",children:"Installing..."}):a=o.jsx(he,{size:"sm",onClick:n,"data-testid":"pwa-install-button",children:"Install App"})):(i=o.jsx(Ds,{children:"PWA installation is not supported by your browser or environment."}),a=o.jsx(he,{size:"sm",disabled:!0,"data-testid":"pwa-unavailable-button",children:"Unavailable"})),o.jsxs(Is,{children:[o.jsxs(zs,{children:[o.jsx(Ls,{children:"Offline App"}),i]}),o.jsx(As,{children:a})]})},Ns=(e,t,s,n)=>{const i={config:e,...t&&t.length>0?{injections:t}:{},guiVersion:vt.version,ergogenVersion:uo("github:ceoloide/ergogen#v4.3.0")},a=JSON.stringify(i);return Mn.compressToEncodedURIComponent(a)},Us=()=>new URLSearchParams(window.location.search).get("debug")!==null,Os=e=>{var s;const t=Us();try{const n=Mn.decompressFromEncodedURIComponent(e);if(!n)return console.error("[Share] DECODE_ERROR: Failed to decompress encoded string"),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The encoded data could not be decompressed."};let i;try{i=JSON.parse(n)}catch(c){return console.error("[Share] DECODE_ERROR: Failed to parse decompressed JSON",{parseError:c,decompressedLength:n.length,decompressedPreview:n.substring(0,100)}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The decompressed data is not valid JSON."}}if(!i||typeof i!="object"||!("config"in i)||typeof i.config!="string")return console.error("[Share] VALIDATION_ERROR: Invalid object structure",{parsed:i,hasConfig:i&&typeof i=="object"&&"config"in i,configType:i&&typeof i=="object"&&"config"in i?typeof i.config:"N/A"}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link does not contain a valid configuration. The decoded data is missing required fields or has an invalid structure."};const a=i;return(!a.guiVersion||typeof a.guiVersion!="string")&&(a.guiVersion="0.9.0"),(!a.ergogenVersion||typeof a.ergogenVersion!="string")&&(a.ergogenVersion="github:ergogen/ergogen#v4.2.1"),"injections"in a&&a.injections!==void 0&&(!Array.isArray(a.injections)||!a.injections.every(c=>Array.isArray(c)&&c.length===3&&typeof c[0]=="string"&&typeof c[1]=="string"&&typeof c[2]=="string"))?(console.error("[Share] VALIDATION_ERROR: Invalid injections structure",{injections:a.injections,isArray:Array.isArray(a.injections)}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link contains invalid injections data. Injections must be an array of [type, name, content] tuples."}):(t&&console.log("[Share] DEBUG: Decoded configuration object",{configLength:a.config.length,hasInjections:a.injections!==void 0,injectionsCount:((s=a.injections)==null?void 0:s.length)??0,fullObject:a}),{success:!0,config:a})}catch(n){return console.error("[Share] DECODE_ERROR: Unexpected error during decoding",{error:n,errorMessage:n instanceof Error?n.message:String(n),errorStack:n instanceof Error?n.stack:void 0}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. An unexpected error occurred while decoding."}}},Ws=e=>{const{config:t,injections:s,canonical:n}=e;let i=s;if(n&&s&&s.length>0){const m=fr(n);i=Fs(s,m)}const a=i&&i.length>0?i:void 0,c=Ns(t,a);return`${window.location.origin+window.location.pathname}#${c}`},pr=()=>{const e=window.location.hash;if(!e||e.length<=1)return null;const t=e.substring(1);return Os(t)},fr=e=>{const t=new Set,s=new Set,n=new Set;if(!e||typeof e!="object")return{footprints:t,templates:s,outlines:n};const i=e;if(i.pcbs&&typeof i.pcbs=="object"){for(const a of Object.values(i.pcbs))if(!(!a||typeof a!="object")&&(typeof a.template=="string"&&s.add(a.template),a.footprints&&typeof a.footprints=="object"))for(const c of Object.values(a.footprints))c&&typeof c.what=="string"&&t.add(c.what)}if(i.outlines&&typeof i.outlines=="object")for(const a of Object.values(i.outlines)){if(!a||typeof a!="object")continue;const c=Array.isArray(a)?a:Object.values(a);for(const p of c){const m=p;m&&typeof m.what=="string"&&n.add(m.what)}}return{footprints:t,templates:s,outlines:n}},Fs=(e,t)=>!e||e.length===0?[]:e.filter(s=>{const[n,i]=s;return n==="footprint"?t.footprints.has(i):n==="template"?t.templates.has(i):n==="outline"?t.outlines.has(i):!0}),pn=async(e,t,s,n)=>{try{await navigator.clipboard.writeText(e),t(!0),n==null||n(),s.current&&clearTimeout(s.current),s.current=setTimeout(()=>{t(!1)},2500)}catch(i){console.error("Failed to copy shareable URI to clipboard:",i);try{const a=document.createElement("textarea");a.value=e,a.style.position="fixed",a.style.opacity="0",document.body.appendChild(a),a.select();const c=document.execCommand("copy");if(document.body.removeChild(a),!c){console.error("Fallback copy method was rejected by the browser.");return}t(!0),n==null||n(),s.current&&clearTimeout(s.current),s.current=setTimeout(()=>{t(!1)},2500)}catch(a){console.error("Fallback copy method also failed:",a)}}},hr=({config:e,injections:t,onClose:s,"data-testid":n})=>{const i=Tn.useMemo(()=>t||[],[t]),[a,c]=f.useState(1),[p,m]=f.useState(!0),[l,h]=f.useState(!1),[b,g]=f.useState(null),[x,k]=f.useState(""),[u,y]=f.useState([]),[v,z]=f.useState(!1),[S,E]=f.useState(!1),$=f.useRef(null),L=f.useRef(null);f.useEffect(()=>{if(!p||v||i.length===0||a!==1)return;let R=!0;h(!0),g(null);const O=Xe();if(!O){g("Could not initialize background worker."),h(!1);return}return O.onmessage=U=>{var ee;if(!R)return;const F=U.data;if(F.type==="success"){const X=(ee=F.results)==null?void 0:ee.canonical,{footprints:ne,templates:Y,outlines:M}=fr(X),W=i.map(([T,Z,G])=>{let _;return T==="footprint"?_=ne.has(Z):T==="template"?_=Y.has(Z):T==="outline"?_=M.has(Z):_=!0,{type:T,name:Z,content:G,checked:_,isEligible:_}}).filter(T=>T.isEligible).map(({type:T,name:Z,content:G,checked:_})=>({type:T,name:Z,content:G,checked:_}));y(W),z(!0)}else F.type==="error"&&g(F.error||"Failed to analyze configuration.");h(!1),O.terminate()},O.onerror=()=>{R&&(g("Worker encountered an error during analysis."),h(!1),O.terminate())},O.postMessage({type:"generate",inputConfig:e,injectionInput:i,requestId:`share-analysis-${Date.now()}`,options:{debug:!0}}),()=>{R=!1,O.terminate()}},[p,v,i,e,a]);const D=f.useRef(0);D.current=p?u.filter(R=>R.checked).length:0;const I=f.useCallback(R=>{B("share_link_copied",{has_injections:D.current>0,injections_count:D.current,source:R})},[]);f.useEffect(()=>{a===2&&x&&pn(x,E,L,()=>{I("auto")})},[x,a,I]),f.useEffect(()=>{const R=O=>{O.key==="Escape"&&s()};return window.addEventListener("keydown",R),()=>{window.removeEventListener("keydown",R)}},[s]),f.useEffect(()=>{a===2&&$.current&&($.current.focus(),$.current.select())},[a]),f.useEffect(()=>{const R=L;return()=>{R.current&&clearTimeout(R.current)}},[]);const w=R=>{y(O=>O.map((U,F)=>F===R?{...U,checked:!U.checked}:U))},C=()=>{const R=p?u.filter(F=>F.checked):[],O=R.length>0?R.map(F=>[F.type,F.name,F.content]):void 0,U=Ws({config:e,injections:O});k(U),c(2)},A=()=>{pn(x,E,L,()=>{I("button")})};return o.jsx(Bs,{"data-testid":n,onClick:R=>{R.target===R.currentTarget&&s()},children:o.jsxs(Ms,{"data-testid":n&&`${n}-box`,onClick:R=>R.stopPropagation(),children:[o.jsx(Ts,{onClick:s,"data-testid":n&&`${n}-close`,"aria-label":"Close dialog",children:o.jsx("span",{className:"material-symbols-outlined",children:"close"})}),a===1?o.jsxs(o.Fragment,{children:[o.jsx(fn,{children:"Share Configuration"}),o.jsx(hn,{children:"Configure what content should be included when sharing your keyboard design."}),o.jsx(Gs,{children:o.jsxs(Hs,{htmlFor:"include-libraries-toggle",children:[o.jsx(Vs,{id:"include-libraries-toggle",type:"checkbox",checked:p,onChange:R=>{const O=R.target.checked;m(O),O||(h(!1),g(null))},"aria-label":"Include custom libraries"}),o.jsx(qs,{$checked:p}),o.jsx("span",{children:"Include custom libraries"})]})}),p&&o.jsxs(o.Fragment,{children:[l&&o.jsxs(Js,{children:[o.jsx(Ks,{}),o.jsx("span",{children:"Analyzing configuration..."})]}),b&&o.jsx(Ys,{children:b}),!l&&!b&&i.length===0&&o.jsx(gn,{children:"No custom libraries loaded."}),!l&&!b&&i.length>0&&u.length===0&&o.jsx(gn,{children:"No custom footprints or libraries are used in this configuration."}),!l&&!b&&u.length>0&&o.jsx(Xs,{children:u.map((R,O)=>o.jsxs(Zs,{children:[o.jsx(Qs,{id:`injection-${R.name}`,type:"checkbox",checked:R.checked,onChange:()=>w(O),"aria-label":R.name}),o.jsx(ta,{$type:R.type,children:R.type}),o.jsx(ea,{htmlFor:`injection-${R.name}`,children:R.name})]},`${R.type}-${R.name}`))})]}),o.jsx(mn,{children:o.jsx(oa,{onClick:C,disabled:l,children:"Share"})})]}):o.jsxs(o.Fragment,{children:[o.jsx(fn,{children:"Shareable Configuration Link"}),o.jsx(hn,{children:"Share this link with others to let them view and use your keyboard configuration, including all of your custom footprints."}),o.jsxs(na,{children:[o.jsx(ra,{ref:$,type:"text",value:x,readOnly:!0,"data-testid":n&&`${n}-input`,"aria-label":"Share link"}),o.jsx(mn,{children:o.jsxs(ia,{onClick:A,"data-testid":n&&`${n}-copy`,"aria-label":S?"Link copied":"Copy link",children:[o.jsx("span",{className:"material-symbols-outlined",children:S?"check":"content_copy"}),S?"Link copied":"Copy link"]})})]})]})]})})},Bs=d.div`
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
`,Ms=d.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: relative;
`,Ts=d.button`
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
`,fn=d.h2`
  margin: 0 0 1rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
  padding-right: 3rem;
`,hn=d.p`
  margin: 0 0 1.5rem 0;
  font-size: ${r.fontSizes.base};
  color: ${r.colors.textDark};
  line-height: 1.5;
`,Gs=d.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`,Hs=d.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  font-family: ${r.fonts.body};
  font-size: ${r.fontSizes.base};
  color: ${r.colors.text};
`,Vs=d.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`,qs=d.span`
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
`,Js=d.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.5rem 0;
  color: ${r.colors.textDark};
`,Ks=d.div`
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
`,Ys=d.p`
  color: ${r.colors.error};
  font-size: ${r.fontSizes.sm};
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: ${r.colors.errorDark}22;
  border: 1px solid ${r.colors.error};
  border-radius: 6px;
`,gn=d.p`
  color: ${r.colors.textDarker};
  font-size: ${r.fontSizes.sm};
  margin: 1rem 0;
  font-style: italic;
`,Xs=d.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${r.colors.border};
  border-radius: 6px;
  background-color: ${r.colors.backgroundLighter};
  margin: 1rem 0 1.5rem 0;
  padding: 0.5rem;
`,Zs=d.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${r.colors.backgroundLight};
  }
`,Qs=d.input`
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: ${r.colors.accent};
`,ea=d.label`
  cursor: pointer;
  flex: 1;
  color: ${r.colors.text};
  font-size: ${r.fontSizes.sm};
  user-select: none;
`,ta=d.span`
  font-size: ${r.fontSizes.xs};
  font-weight: ${r.fontWeights.bold};
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  color: ${r.colors.white};
  background-color: ${e=>{switch(e.$type){case"footprint":return"#007bff";case"outline":return"#e83e8c";case"template":return"#fd7e14";default:return r.colors.border}}};
`,oa=d.button`
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
`,na=d.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: stretch;
`,mn=d.div`
  display: flex;
  justify-content: center;
  width: 100%;

  @media (min-width: 500px) {
    width: auto;
  }
`,ra=d.input`
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
`,ia=d.button`
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
`,sa=d.span`
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
`;function aa(){return o.jsx(o.Fragment,{children:o.jsxs("span",{children:[ur()?"⌘":"Ctrl"," ⏎"]})})}const la=d.div`
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
`,ca=d.div`
  flex-grow: 1;
`,bn=d(Ne)`
  display: none;

  @media (max-width: 475px) {
    display: flex;
  }
`,da=d.button`
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
`,wn=d.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
`,ua=d.div`
  display: flex;
  gap: 10px;
  align-items: stretch;
  padding: 10px;

  @media (max-width: 639px) {
    display: none;
  }
`,pa=d.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
  padding: 0;
`,xn=d(bs)`
  height: 100%;
`,fa=d.div`
  height: 100%;
  overflow-y: auto;
`,ha=d(Gi)`
  position: relative;
  flex-grow: 1;
  min-height: 0;
`,ga=d.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`,ma=d.div`
  height: 100%;
  overflow-y: auto;
  padding: 0.5rem;

  @media (min-width: 640px) {
    padding: 1rem;
  }
`,ba=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 640px) {
    display: none;
  }
`,wa=d.button`
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
`,yn=d.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: row;

  @media (max-width: 639px) {
    width: ${e=>e.$fullWidth?"100%":"auto"};
  }
`,kn=d.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
`,xa=d.div`
  display: flex;
  height: 100%;
  width: 100%;
`,ya=({pwaState:e})=>{const t=()=>Math.max(200,window.innerWidth*.33),s=()=>Math.max(150,window.innerWidth*.15),n=()=>Math.max(350,window.innerWidth*.15),[i,a]=f.useState({key:"demo.svg",extension:"svg",content:""}),[c,p]=f.useState(!1),m=w=>{a(w),u!=null&&u.showConfig||u==null||u.setShowDownloads(!1)},[l,h]=f.useState({key:-1,type:"",name:"",content:""}),[b,g]=f.useState(!1),[x,k]=f.useState(window.innerWidth<=639),u=_e(),y=!0;f.useEffect(()=>{const w=()=>{k(window.innerWidth<=639)};return window.addEventListener("resize",w),()=>window.removeEventListener("resize",w)},[]),Pr(ur()?"meta+enter":"ctrl+enter",()=>{u&&(B("shortcut_used",{action:"generate"}),u.generateNow(u.configInput,u.injectionInput,{pointsonly:!1,isManual:!0}))},{enableOnFormTags:!0,preventDefault:!0}),f.useEffect(()=>{if(l.key===-1||l.name===""||l.content==="")return;const w=[l.type,l.name,l.content];let C=[];Array.isArray(u==null?void 0:u.injectionInput)&&(C=[...u.injectionInput]);const A=C.length;if(A===0||A===l.key)C.push(w),h({...l,key:A});else{const R=C[l.key];if(R[0]===l.type&&R[1]===l.name&&R[2]===l.content)return;C=C.map((O,U)=>U===l.key?w:O)}u==null||u.setInjectionInput(C)},[u,l]);const v=f.useRef(null),z=!!(u!=null&&u.results);if(f.useEffect(()=>{if(!z){v.current=null;return}if(!i.key||!i.extension)return;const w=`${i.key}|${i.extension}`;v.current!==w&&(v.current=w,B("preview_loaded",{preview_type:i.extension,preview_key:i.key}))},[i.key,i.extension,z]),!u)return null;let S=null;switch(u.results&&(S=oo(i.key,u.results),S===void 0&&i.key!=="demo.svg"&&(i.key="demo.svg",i.extension="svg",S=oo(i.key,u.results))),i.extension){case"svg":case"kicad_pcb":i.content=typeof S=="string"?S:"";break;case"stl":i.content=typeof S=="string"||S instanceof ArrayBuffer||ArrayBuffer.isView(S)?S:"";break;case"jscad":i.content=typeof(S==null?void 0:S.jscad)=="string"?S.jscad:"";break;case"yaml":i.content=fe.dump(S);break;case"txt":i.content=u.configInput||"";break;default:i.content=""}const E=w=>{const C={...l,name:w.target.value};h(C)},$=w=>{if(!Array.isArray(u==null?void 0:u.injectionInput))return;B("injection_deleted",{injection_type:w.type});const C=[...u.injectionInput].filter((A,R)=>R!==w.key);if(u.setInjectionInput(C),l.key===w.key)h({key:-1,type:"",name:"",content:""});else if(l.key>=w.key){const A={...l,key:l.key-1};h(A)}},L=()=>{var R;const w=((R=u.getRealtimeConfigInput)==null?void 0:R.call(u))??u.configInput;if(w===void 0)return;B("download_button_clicked",{download_type:"yaml",source:"editor"});const C=document.createElement("a"),A=new Blob([w],{type:"text/yaml"});C.href=URL.createObjectURL(A),C.download="config.yaml",document.body.appendChild(C),C.click(),URL.revokeObjectURL(C.href),document.body.removeChild(C)},D=()=>{var w,C;u.configInput&&(B("share_button_clicked",{has_injections:!!((w=u.injectionInput)!=null&&w.length),injections_count:((C=u.injectionInput)==null?void 0:C.length)||0,source:"subheader"}),p(!0))},I=()=>{var w,C,A;!u.results||!u.configInput||u.isGenerating||u.isJscadConverting||(B("archive_single_downloaded",{has_injections:!!((w=u.injectionInput)!=null&&w.length),injections_count:((C=u.injectionInput)==null?void 0:C.length)||0,stored_configs_count:((A=u.configs)==null?void 0:A.length)||0,source:"subheader"}),sr(u.results,u.configInput,u.injectionInput,u.debug,u.stlPreview))};return o.jsxs(o.Fragment,{children:[c&&o.jsx(hr,{config:u.configInput||"",injections:u.injectionInput||[],onClose:()=>p(!1)}),o.jsxs(pa,{children:[!u.showSettings&&o.jsxs(la,{children:[o.jsx(Ne,{className:u.showConfig?"active":"",onClick:()=>u.setShowConfig(!0),"aria-label":"Show configuration panel","data-testid":"mobile-config-button",children:"Config"}),o.jsx(Ne,{className:u.showConfig?"":"active",onClick:()=>u.setShowConfig(!1),"aria-label":"Show outputs panel","data-testid":"mobile-outputs-button",children:"Outputs"}),o.jsx(ca,{}),u.showConfig&&o.jsxs(o.Fragment,{children:[o.jsx(da,{onClick:()=>u.generateNow(u.configInput,u.injectionInput,{pointsonly:!1,isManual:!0}),"aria-label":"Generate configuration","data-testid":"mobile-generate-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"refresh"})}),o.jsx(bn,{onClick:D,disabled:!u.configInput,"aria-label":"Share configuration","data-testid":"mobile-share-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"share"})}),o.jsx(Ne,{onClick:L,"aria-label":"Download configuration","data-testid":"mobile-download-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"download"})})]}),!u.showConfig&&o.jsxs(o.Fragment,{children:[o.jsx(bn,{onClick:I,disabled:u.isGenerating||u.isJscadConverting,"aria-label":"Download archive of all generated files","data-testid":"mobile-download-outputs-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),o.jsx(Ne,{onClick:()=>u.setShowDownloads(!u.showDownloads),"aria-label":u.showDownloads?"Hide downloads panel":"Show downloads panel","data-testid":"mobile-downloads-toggle-button",children:o.jsx("span",{className:"material-symbols-outlined",children:u.showDownloads?"expand_content":"collapse_content"})})]})]}),o.jsx(xa,{children:u.showSettings?o.jsxs(o.Fragment,{children:[o.jsx(Mt,{initialWidth:n(),minWidth:150,maxWidth:"70%",side:"left","data-testid":"settings-panel",style:{display:b&&x?"none":void 0},children:o.jsxs(ma,{children:[o.jsxs(ga,{children:[o.jsx(dt,{children:"General"}),o.jsxs(ut,{children:[o.jsx(Ae,{optionId:"autogen",label:"Auto-generate",description:"Automatically generate new outputs and update previews on changes.",setSelected:u.setAutoGen,checked:u.autoGen,"aria-label":"Enable auto-generate"}),o.jsx(Ae,{optionId:"autogen3d",label:"Auto-generate PCB & 3D",description:"Build 3D models and PCB files during generation (can be slow).",setSelected:u.setAutoGen3D,checked:u.autoGen3D,"aria-label":"Enable auto-generate PCB and 3D (slow)"}),o.jsx(Ae,{optionId:"debug",label:"Debug",description:"Include debug files in the outputs.",setSelected:u.setDebug,checked:u.debug,"aria-label":"Enable debug mode"})]}),o.jsx(dt,{children:"Previews (Experimental)"}),o.jsxs(ut,{children:[o.jsx(Ae,{optionId:"kicanvasPreview",label:"KiCad Preview",description:"Render interactive PCB layouts using KiCanvas.",setSelected:u.setKicanvasPreview,checked:u.kicanvasPreview,"aria-label":"Enable KiCad preview (experimental)"}),o.jsx(Ae,{optionId:"stlPreview",label:"STL Preview",description:"Render 3D preview of generated cases.",setSelected:u.setStlPreview,checked:u.stlPreview,"aria-label":"Enable STL preview (experimental)"})]}),o.jsx(dt,{children:"Privacy"}),o.jsx(ut,{children:o.jsx(Ae,{optionId:"sendUsageMetrics",label:"Send Usage Metrics",description:y?"Help improve Ergogen Web UI by sharing anonymous usage statistics.":"Unavailable: this copy of Ergogen Web UI was built without an analytics tag ID, so no usage statistics are sent.",setSelected:u.setSendUsageMetrics,checked:y&&u.sendUsageMetrics,disabled:!y,"aria-label":"Send usage metrics"})}),e&&o.jsxs(o.Fragment,{children:[o.jsx(dt,{children:"Offline"}),o.jsx(ut,{children:o.jsx(Rs,{isAvailable:e.isAvailable,isInstalled:e.isInstalled,isInstalling:e.isInstalling,onInstall:e.onInstall})})]})]}),o.jsx(ds,{setInjectionToEdit:h,deleteInjection:$,injectionToEdit:l,onInjectionSelect:()=>g(!0),"data-testid":"injections-container"})]})}),o.jsx(yn,{$fullWidth:b&&x,children:o.jsxs(wn,{children:[x&&o.jsxs(ba,{children:[o.jsxs(wt,{as:"h4",style:{marginTop:0},children:[l.type?l.type.charAt(0).toUpperCase()+l.type.slice(1):"Footprint"," ","name"]}),o.jsx(wa,{onClick:()=>{g(!1),h({key:-1,type:"",name:"",content:""})},"aria-label":"Close editor","data-testid":"mobile-editor-close",children:o.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),!x&&o.jsxs(wt,{as:"h4",children:[l.type?l.type.charAt(0).toUpperCase()+l.type.slice(1):"Footprint"," ","name"]}),o.jsx(ys,{value:l.name,onChange:E,disabled:l.key===-1,"aria-label":`${l.type?l.type.charAt(0).toUpperCase()+l.type.slice(1):"Footprint"} name`,"data-testid":"footprint-name-input"}),o.jsxs(wt,{as:"h4",children:[l.type?l.type.charAt(0).toUpperCase()+l.type.slice(1):"Footprint"," ","code"]}),o.jsx(Hi,{injection:l,setInjection:h,options:{readOnly:l.key===-1}})]})})]}):o.jsxs(o.Fragment,{children:[u.showConfig&&o.jsx(Mt,{initialWidth:t(),minWidth:250,maxWidth:"60%",side:"left","data-testid":"config-panel",children:o.jsxs(wn,{children:[o.jsx(ha,{"data-testid":"config-editor"}),o.jsxs(ua,{children:[o.jsx(Ke,{onClick:()=>u.generateNow(u.configInput,u.injectionInput,{pointsonly:!1,isManual:!0}),"aria-label":"Generate configuration","data-testid":"generate-button",children:o.jsxs("span",{style:{display:"flex",alignItems:"center",width:"100%",justifyContent:"center"},children:[o.jsx("span",{children:"Generate"}),o.jsx(sa,{children:aa()})]})}),o.jsx(Ne,{onClick:L,"aria-label":"Download configuration","data-testid":"download-config-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"download"})})]})]})}),o.jsx(yn,{$fullWidth:!u.showConfig,children:u.showDownloads?o.jsxs(o.Fragment,{children:[o.jsx(kn,{children:o.jsx(xn,{"data-testid":`${i.key}-file-preview`,previewExtension:i.extension,previewKey:`${i.key}-${u.resultsVersion}`,previewContent:i.content})}),o.jsx(Mt,{initialWidth:s(),minWidth:105,maxWidth:"30%",side:"right","data-testid":"downloads-panel",children:o.jsx(fa,{children:o.jsx(ns,{setPreview:m,previewKey:i.key,"data-testid":"downloads-container"})})})]}):o.jsx(kn,{children:o.jsx(xn,{"data-testid":`${i.key}-file-preview`,previewExtension:i.extension,previewKey:`${i.key}-${u.resultsVersion}`,previewContent:i.content})})})]})})]})]})},ka={label:"Absolem",author:"MrZealot",value:`meta:
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
    distance: 223.7529778`},_a={label:"Atreus",author:"MrZealot",value:`points:
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
`},va={label:"A. Dux",author:"tapioki",value:`meta:
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
`},ja={label:"Corney Island",author:"ceoloide",value:`points:
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
          rotate: 90`},ro={label:"Empty YAML configuration",author:"ceoloide",value:`meta:
  engine: 4.1.0
units:
points:
  zones:
    matrix:
outlines:
pcbs:
cases:
`},$a={label:"Wubbo",author:"cache.works",value:`meta:
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
`},Ca={label:"Sweep-like",author:"jcmkk3",value:`meta:
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
`},Sa={label:"Reviung41",author:"jcmkk3",value:`meta:
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
`},Ea={label:"Tiny20",author:"enzocoralc",value:`meta:
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
`},Pa={label:"Alpha",author:"jcmkk3",value:`points:
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
`},Ia={label:"Plank",author:"cache.works",value:`meta:
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
`},za={label:"Curly-45",author:"peterjc",value:`meta:
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
`},La={label:"Briefs 56",author:"ceoloide",value:`# Inspired by the Dygma Sonsei
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
`},Da={label:"Willy 50",author:"ceoloide",value:`# Inspired by the Keychron Orca Echo
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
`},Aa=[ro],Ra=[ka,_a],Na=[va,ja,Ca,Sa,Ea],Ua=[$a,Pa,Ia,za,La,Da],Oa=[{label:"Empty configurations",options:Aa},{label:"Simple (points only)",options:Ra},{label:"Complete (with pcb)",options:Na},{label:"Miscellaneous",options:Ua}],Wa=e=>{var n;const t=fe.load(e.value),s=((n=t==null?void 0:t.meta)==null?void 0:n.engine)??(t==null?void 0:t["meta.engine"]);return s===null?void 0:s},Fa=(e,t=et())=>{const s=Wa(e);return s===void 0?!0:typeof s=="string"&&hi(t,s)},Ba=(e=et())=>Oa.map(t=>({...t,options:t.options.filter(s=>Fa(s,e))})).filter(t=>t.options.length>0),Ma=async e=>new Promise((t,s)=>{const n=new FileReader;n.onload=i=>{var a;(a=i.target)!=null&&a.result&&typeof i.target.result=="string"?t(i.target.result):s(new Error("Failed to read file as text"))},n.onerror=()=>s(new Error("Failed to read file")),n.readAsText(e)}),Ta=async e=>{const s=e.name.toLowerCase().split(".").pop(),n=s==="zip"||s==="ekb";if(Qt(e.size,n),s==="yaml"||s==="yml"||s==="json")return{config:await Ma(e),footprints:[],outlines:[],templates:[]};if(n){const i=await e.arrayBuffer(),a=await yi(i),c=a.injections.filter(l=>l.type==="footprint").map(l=>({name:l.name,content:l.content})),p=a.injections.filter(l=>l.type==="outline").map(l=>({name:l.name,content:l.content})),m=a.injections.filter(l=>l.type==="template").map(l=>({name:l.name,content:l.content}));return{config:a.config,footprints:c,outlines:p,templates:m}}else throw new Error("Unsupported file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")},io=()=>o.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-github",viewBox:"0 0 98 96",children:o.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z",fill:"currentColor"})}),_n=()=>o.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 4.2333332 4.2333335",version:"1.1",fill:"currentColor",children:[o.jsxs("defs",{children:[o.jsxs("linearGradient",{id:"linearGradient6924-6",children:[o.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:0},offset:"0"}),o.jsx("stop",{offset:"0.49517274",style:{stopColor:"#ffffff",stopOpacity:.3}}),o.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:.3},offset:"1"})]}),o.jsx("linearGradient",{id:"linearGradient6918-3",x1:"42519.285",y1:"-7078.7891",x2:"42575.336",y2:"-6966.9307",gradientUnits:"userSpaceOnUse",href:"#linearGradient6924-6"})]}),o.jsxs("g",{transform:"matrix(0.06551432,0,0,0.06551432,-2.232417,-1.431776)",children:[o.jsx("path",{id:"path6733-5",style:{fontVariationSettings:"normal",opacity:1,vectorEffect:"none",fill:"url(#linearGradient6918-3)",fillOpacity:1,stroke:"none",strokeWidth:3.67846,strokeLinecap:"butt",strokeLinejoin:"miter",strokeMiterlimit:2,strokeDashoffset:0,strokeOpacity:1,paintOrder:"stroke markers fill",stopColor:"#000000",stopOpacity:1},d:"m 42519.285,-7078.7891 a 0.76086879,0.56791688 0 0 0 -0.738,0.6739 l 33.586,125.8886 a 87.182358,87.182358 0 0 0 39.381,-33.7636 l -71.565,-92.5196 a 0.76086879,0.56791688 0 0 0 -0.664,-0.2793 z",transform:"matrix(0.37058478,0,0,0.37058478,-15690.065,2662.0533)"}),o.jsx("path",{id:"path360787",style:{opacity:1,fill:"#ffffff",fillOpacity:1,strokeWidth:17.0055,paintOrder:"markers fill stroke",stopColor:"#000000"},d:"m 11249.461,-1883.6961 c -12.74,0 -23.067,10.3275 -23.067,23.0671 0,4.3335 1.22,8.5795 3.522,12.2514 l 19.232,-24.8636 c 0.138,-0.1796 0.486,-0.1796 0.624,0 l 19.233,24.8646 c 2.302,-3.6721 3.523,-7.9185 3.523,-12.2524 0,-12.7396 -10.327,-23.0671 -23.067,-23.0671 z",transform:"matrix(1.4006354,0,0,1.4006354,-15690.065,2662.0533)"})]})]}),vn=()=>o.jsx("svg",{width:"16",height:"16",viewBox:"0 0 212 212",fill:"none",stroke:"currentColor",children:o.jsxs("g",{transform:"translate(6,6)",children:[o.jsx("path",{d:"M58 168 v-98 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),o.jsx("path",{d:"M58 168 v-30 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),o.jsx("circle",{cx:"142",cy:"20",r:"18",strokeWidth:"15"}),o.jsx("circle",{cx:"142",cy:"88",r:"18",strokeWidth:"15"}),o.jsx("circle",{cx:"58",cy:"180",r:"18",strokeWidth:"15"})]})}),so=d.div`
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
`,Ga=d.div`
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
`,Ha=d.div`
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
`,Va=d.div`
  background-color: ${r.colors.backgroundLight};
  border: 3px dashed ${r.colors.accent};
  border-radius: 8px;
  padding: 2rem;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
  text-align: center;
`,qa=d.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 640px) {
    padding: 1rem 0.5rem;
  }
`,Ja=d.h1`
  font-size: ${r.fontSizes.h1};
  text-align: center;
  margin-bottom: 1rem;
`,Ka=d.p`
  font-size: ${r.fontSizes.lg};
  text-align: center;
  margin-bottom: 3rem;
  color: ${r.colors.textDark};
`,Ya=d.div`
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
`,Xa=d.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;

  button {
    flex-shrink: 0;
  }
`,Za=d.div`
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
`,Qa=d.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  user-select: none;
`,el=d.button`
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
`,tl=d.div`
  width: 1px;
  background-color: ${r.colors.border};
  margin: 0.75rem 0;
  flex-shrink: 0;
`,ol=d.input`
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
`,nl=d.div`
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
`,rl=d(he)`
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

  ${so} {
    margin-right: 0;
  }
`,il=d.input`
  display: none;
`,jn=d.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`,$n=d.div`
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
`,sl=d.img`
  width: 100%;
  height: 150px;
  object-fit: contain;
  padding: 8px;
  box-sizing: border-box;
  background-color: ${r.colors.backgroundLighter};
`,Cn=d.div`
  padding: 1rem;
  font-weight: ${r.fontWeights.semiBold};
  text-align: center;
`,al=d.div`
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
`,ll=d.div`
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
`,cl=()=>{const e=et(),t=f.useMemo(()=>Ba(e).flatMap(_=>_.options).filter(_=>_.label!=="Empty YAML configuration"),[e]),s=ao(),n=_e(),[i,a]=f.useState(""),[c,p]=f.useState("github"),[m,l]=f.useState(!1),[h,b]=f.useState(!1),g=m||h,[x,k]=f.useState(!1),u=f.useRef(null),[y,v]=f.useState(!1);f.useEffect(()=>{const _=H=>{u.current&&!u.current.contains(H.target)&&v(!1)};return document.addEventListener("mousedown",_),()=>document.removeEventListener("mousedown",_)},[]);const[z,S]=f.useState(!1),E=_=>{a(_),_.includes("github.com/")?p("github"):_.includes("codeberg.org/")?p("codeberg"):(_.startsWith("http://")||_.startsWith("https://")||_.includes("/")&&!_.includes("github.com/")&&!_.includes("codeberg.org/")&&_.split("/")[0].includes("."))&&p("forgejo")},{currentConflict:$,processInjectionsWithConflictResolution:L,handleConflictResolution:D,handleConflictCancel:I}=St({setInjectionInput:_=>n==null?void 0:n.setInjectionInput(_),setConfigInput:_=>n==null?void 0:n.setConfigInput(_),generateNow:async(_,H,V)=>{n&&await n.generateNow(_,H,V)},getCurrentInjections:()=>(n==null?void 0:n.injectionInput)||[],onComplete:async()=>{k(!0)},setError:_=>n==null?void 0:n.setError(_)});f.useEffect(()=>{const _=new URLSearchParams(window.location.search),H=_.has("github")||_.has("codeberg")||_.has("forgejo")||_.has("gitea");(x||H)&&(n!=null&&n.configInput)&&(s("/"),k(!1))},[x,n==null?void 0:n.configInput,s]),f.useEffect(()=>{var _;(_=n==null?void 0:n.pruneDeletedConfigs)==null||_.call(n)},[n]);const w=async _=>{if(n){const H=_===ro.value;let V="unknown";if(H)V="empty_configuration";else{const Q=t.find(q=>q.value===_);Q&&(V=Q.label.toLowerCase().replace(/\s+/g,"_"))}B("example_loaded",{example_name:V,is_empty:H}),n.createNewConfig(_),await n.generateNow(_,n.injectionInput,{pointsonly:!1}),k(!0)}},C=async _=>{if(n){const H=n.configs.find(V=>V.id===_);H&&(n.selectConfig(_),B("saved_config_loaded",{stored_configs_count:n.configs.length}),await n.generateNow(H.config,n.injectionInput,{pointsonly:!1}),k(!0))}},R=[...(n==null?void 0:n.configs)||[]].sort((_,H)=>new Date(H.updatedAt).getTime()-new Date(_.updatedAt).getTime()).slice(0,4),O=async(_,H,V,Q,q=null,se)=>{if(!n)throw new Error("Configuration context not available");const ie=rr(_,H,V);await L(ie,Q,q,se)},U=async(_,H)=>{await D(_,H)},F=()=>{I(),l(!1),b(!1),n==null||n.setIsGenerating(!1)},ee=()=>{if(!i||!n)return;const{setError:_,clearError:H,setIsGenerating:V}=n;b(!0),V(!0),H(),B("repo_loaded",{provider:c});let Q=i.trim();if(!Q.includes("://")&&!Q.includes("github.com")&&!Q.includes("codeberg.org"))if(c==="codeberg")Q=`https://codeberg.org/${Q}`;else if(c==="forgejo"){const q=Q.split("/");if(q.length>=2&&q[0].includes("."))Q=`https://${Q}`;else{_("Forgejo/Gitea requires a URL including the host (e.g., host/owner/repo)"),b(!1),V(!1);return}}else Q=`https://github.com/${Q}`;ir(Q).then(async q=>{if(n){q.rateLimitWarning&&_(q.rateLimitWarning);try{n.createNewConfig(q.config),await O(q.footprints,q.outlines,q.templates||[],q.config)}catch(se){throw new Error(`Failed to process footprints: ${se instanceof Error?se.message:"Unknown error"}`)}}}).catch(q=>{_(`Failed to load from ${c==="github"?"GitHub":c==="codeberg"?"Codeberg":"Forgejo/Gitea"} repository: ${q.message}`),n==null||n.setInfo(null),b(!1),V(!1)}).finally(()=>{b(!1)})},X=f.useRef(null),ne=()=>{var _;(_=X.current)==null||_.click()},Y=async _=>{if(!n)return;const{setError:H,clearError:V,setIsGenerating:Q}=n;l(!0),Q(!0),V(),B("local_file_loaded",{file_type:Tr(_.name),file_size:_.size});try{const q=await Ta(_);n.createNewConfig(q.config),await O(q.footprints,q.outlines,q.templates||[],q.config)}catch(q){H(`Failed to load local file: ${q instanceof Error?q.message:"Unknown error"}`),n.setInfo(null),l(!1),Q(!1)}finally{l(!1)}},M=async _=>{var V;const H=(V=_.target.files)==null?void 0:V[0];H&&(_.target.value="",await Y(H))},W=_=>{_.preventDefault(),_.stopPropagation(),!g&&S(!0)},T=_=>{_.preventDefault(),_.stopPropagation()},Z=_=>{if(_.preventDefault(),_.stopPropagation(),g)return;const H=_.currentTarget,V=_.relatedTarget;(!V||!H.contains(V))&&S(!1)},G=async _=>{if(_.preventDefault(),_.stopPropagation(),g)return;S(!1);const H=Array.from(_.dataTransfer.files),V=[".yaml",".yml",".json",".zip",".ekb"],Q=H.find(q=>{const se=q.name.toLowerCase();return V.some(ie=>se.endsWith(ie))});Q?await Y(Q):H.length>0&&n&&n.setError("Invalid file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")};return o.jsxs(Ga,{$isDragging:z,onDragEnter:W,onDragOver:T,onDragLeave:Z,onDrop:G,"data-testid":"welcome-page-wrapper",children:[o.jsx(Ha,{$isVisible:z,children:o.jsx(Va,{children:"Drop file here to load configuration"})}),$&&o.jsx(Ct,{injectionName:$.name,injectionType:$.type,onResolve:U,onCancel:F,"data-testid":"conflict-dialog"}),o.jsxs(qa,{children:[o.jsx(Ja,{children:"Ergogen Web UI"}),o.jsxs(Ka,{children:["A web-based interface for Ergogen, the ergonomic keyboard generator.",o.jsx("br",{}),"Start a new design below."]}),o.jsxs(Ya,{children:[o.jsxs(Tt,{children:[o.jsx("h2",{children:"Start Fresh"}),o.jsx("p",{children:"Begin with a completely blank slate."}),o.jsx(he,{onClick:()=>w(ro.value),"aria-label":"Start with empty configuration","data-testid":"empty-config-button",children:"Empty Configuration"})]}),o.jsxs(Tt,{children:[o.jsx("h2",{children:"From Local File"}),o.jsx("p",{children:"Load a configuration from your computer. Supports *.yaml, *.json, *.zip, and *.ekb files."}),o.jsx(il,{ref:X,type:"file",accept:".yaml,.yml,.json,.zip,.ekb",onChange:M,disabled:g,"aria-label":"Select local file to load","data-testid":"local-file-input"}),o.jsx(he,{onClick:ne,disabled:g,"aria-label":"Select local file to load","data-testid":"local-file-button",children:m?o.jsxs(o.Fragment,{children:[o.jsx(so,{})," Loading..."]}):"Choose File"})]}),o.jsxs(Tt,{children:[o.jsx("h2",{children:"From Repo"}),o.jsx("p",{children:'Link to a YAML config file on a Git provider (e.g. GitHub, Codeberg, Forgejo), or simply a repository name like "user/repo".'}),o.jsx(Xa,{children:o.jsxs(Za,{children:[o.jsxs(Qa,{ref:u,children:[o.jsxs(el,{type:"button",onClick:()=>v(!y),disabled:g,"aria-label":"Repository provider source","data-testid":"repo-provider-trigger",children:[c==="github"?o.jsx(io,{}):c==="codeberg"?o.jsx(_n,{}):o.jsx(vn,{}),o.jsx("span",{className:"material-symbols-outlined",children:"arrow_drop_down"})]}),y&&o.jsxs(nl,{children:[o.jsxs(Gt,{$active:c==="github",onClick:()=>{p("github"),v(!1)},children:[o.jsx(io,{}),"GitHub"]}),o.jsxs(Gt,{$active:c==="codeberg",onClick:()=>{p("codeberg"),v(!1)},children:[o.jsx(_n,{}),"Codeberg"]}),o.jsxs(Gt,{$active:c==="forgejo",onClick:()=>{p("forgejo"),v(!1)},children:[o.jsx(vn,{}),"Forgejo"]})]})]}),o.jsx(tl,{}),o.jsx(ol,{placeholder:c==="forgejo"?"host/user/repo":"user/repo",value:i,onChange:_=>E(_.target.value),onKeyDown:_=>{_.key==="Enter"&&!g&&i.trim()!==""&&(_.preventDefault(),ee())},disabled:g,"aria-label":"Repository URL or path","data-testid":"repo-input"}),o.jsx(rl,{onClick:ee,disabled:g||!i,"aria-label":"Load configuration from repository","data-testid":"repo-load-button",children:h?o.jsx(so,{}):o.jsx("span",{className:"material-symbols-outlined",style:{display:"block"},children:"cloud_download"})})]})})]})]}),R.length>0&&o.jsxs(o.Fragment,{children:[o.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:r.fontSizes.h2},children:"Pick up where you left"}),o.jsx(jn,{style:{marginBottom:"3rem"},children:R.map(_=>o.jsxs($n,{onClick:()=>C(_.id),"aria-label":`Load ${_.name} configuration`,"data-testid":`saved-config-${_.name.toLowerCase().replace(/\s+/g,"-")}`,children:[_.previewSvg?o.jsx(al,{dangerouslySetInnerHTML:{__html:_.previewSvg}}):o.jsx(ll,{children:o.jsx("span",{className:"material-symbols-outlined",children:"keyboard_off"})}),o.jsx(Cn,{children:_.name})]},_.id))})]}),o.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:r.fontSizes.h2},children:"Or start from an example"}),o.jsx(jn,{children:t.map(_=>o.jsxs($n,{onClick:()=>w(_.value),"aria-label":`Load ${_.label} example`,"data-testid":`example-${_.label.toLowerCase().replace(/\s+/g,"-")}`,children:[o.jsx(sl,{src:`/images/previews/${_.label.toLowerCase().replace(/[\s()]/g,"_")}.svg`,alt:`${_.label} preview`}),o.jsx(Cn,{children:_.label})]},_.label))})]})]})},gr=({versionInfo:e,"data-testid":t})=>{const[s,n]=f.useState(!1),i=f.useRef(null),a=()=>{i.current&&clearTimeout(i.current),n(!0)},c=()=>{i.current=setTimeout(()=>{n(!1)},250)},p=()=>{i.current&&clearTimeout(i.current)},m=()=>{i.current=setTimeout(()=>{n(!1)},250)},l=h=>{h.stopPropagation(),n(b=>!b)};return f.useEffect(()=>{if(!s)return;const h=()=>{n(!1)};return window.addEventListener("click",h),()=>{window.removeEventListener("click",h)}},[s]),f.useEffect(()=>()=>{i.current&&clearTimeout(i.current)},[]),o.jsxs(dl,{onMouseEnter:a,onMouseLeave:c,"data-testid":t,children:[o.jsx(ul,{onClick:l,"data-testid":t&&`${t}-badge`,"aria-label":"Custom Ergogen version indicator",children:o.jsx("span",{className:"material-symbols-outlined",children:"science"})}),s&&o.jsxs(pl,{onMouseEnter:p,onMouseLeave:m,onClick:h=>h.stopPropagation(),"data-testid":t&&`${t}-popover`,children:[o.jsx(fl,{children:"Custom Ergogen Version"}),o.jsx(hl,{children:"This website is running a custom version of Ergogen for development and preview purposes."}),o.jsxs(gl,{href:e.url,target:"_blank",rel:"noopener noreferrer","data-testid":t&&`${t}-link`,children:[o.jsx("span",{children:e.label}),o.jsx("span",{className:"material-symbols-outlined open-icon",children:"open_in_new"})]})]})]})},dl=d.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  transform: translateY(-5px);
`,ul=d.span`
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
`,pl=d.div`
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
`,fl=d.div`
  font-size: 12px;
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
`,hl=d.div`
  font-size: 11px;
  color: ${r.colors.textDark};
  line-height: 1.4;
`,gl=d.a`
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
`,ml=_t`
  0%   { box-shadow: 0 0 0 0   ${r.colors.accent}99; }
  70%  { box-shadow: 0 0 0 6px ${r.colors.accent}00; }
  100% { box-shadow: 0 0 0 0   ${r.colors.accent}00; }
`,bl=_t`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`,wl=d.button`
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
  animation: ${ml} ${e=>e.$isUpdating?"0.6s":"2s"}
    ease-out infinite;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  .material-symbols-outlined {
    font-size: 14px !important;
    ${e=>e.$isUpdating&&Bn`
        animation: ${bl} 1s linear infinite;
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
`,xl=({onClick:e,"data-testid":t})=>{const[s,n]=f.useState(!1),i=()=>{n(!0),e()};return o.jsxs(wl,{onClick:i,disabled:s,$isUpdating:s,"aria-label":s?"Updating version...":"Update available — click to reload and apply","data-testid":t??"update-chip",children:[o.jsx("span",{className:"material-symbols-outlined","aria-hidden":"true",children:s?"sync":"update"}),s?"Updating version...":"Update Available"]})},yl=d.header`
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
`,kl=d.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: row;
  flex-grow: 1;
  min-width: 0;
  width: 100%;
`,_l=d.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,vl=d.div`
  display: flex;
  align-items: center;
  gap: 6px;
`,jl=d.div`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  display: flex;
  align-items: center;
  @media (max-width: 639px) {
    display: none;
  }
`,Et=d.button`
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
`,$l=d(Et)`
  flex-shrink: 0;
`,Cl=d(Et)`
  background-color: ${r.colors.accent};
  border-color: ${r.colors.accent};

  &:hover {
    background-color: ${r.colors.accentDark};
    border-color: ${r.colors.accentDarker};
  }

  @media (max-width: 375px) {
    display: none;
  }
`,Sl=d.span`
  @media (max-width: 510px) {
    display: none;
  }
`,Sn=d(Et)`
  @media (max-width: 475px) {
    display: none;
  }
`,El=d(Hn)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,Pl=d.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,Il=({onUpdate:e})=>{const t=_e(),s=ao(),n=Gn(),{activeConfigId:i,activeConfigName:a,configs:c,isPreview:p,renameConfig:m,duplicateConfig:l,deleteConfig:h,savePreviewConfig:b}=t||{},[g,x]=f.useState(!1),[k,u]=f.useState(!1),[y,v]=f.useState(""),z=()=>{a&&i&&(v(a),u(!0))},S=U=>{U&&U.stopPropagation(),!(m&&i&&y.trim()&&!m(i,y.trim()))&&u(!1)},E=U=>{U&&U.stopPropagation(),u(!1)},$=U=>{U.key==="Enter"?S():U.key==="Escape"&&u(!1)},L=U=>{U.stopPropagation(),l&&i&&l(i)},D=U=>{U.stopPropagation(),i&&a&&h&&window.confirm(`Are you sure you want to delete "${a}"?`)&&(h(i),(c&&c.length<=1||i)&&s("/new"))},I=()=>{t==null||t.setShowSettings(!(t!=null&&t.showSettings))},w=()=>{t==null||t.setShowSettings(!1),t==null||t.selectConfig(null),s("/new")},C=()=>{var U,F,ee;!(t!=null&&t.results)||!(t!=null&&t.configInput)||t!=null&&t.isGenerating||t!=null&&t.isJscadConverting||(B("archive_single_downloaded",{has_injections:!!((U=t.injectionInput)!=null&&U.length),injections_count:((F=t.injectionInput)==null?void 0:F.length)||0,stored_configs_count:((ee=t.configs)==null?void 0:ee.length)||0,source:"header"}),sr(t.results,t.configInput,t.injectionInput,t.debug,t.stlPreview))},A=()=>{var U,F;t!=null&&t.configInput&&(B("share_button_clicked",{has_injections:!!((U=t.injectionInput)!=null&&U.length),injections_count:((F=t.injectionInput)==null?void 0:F.length)||0,source:"header"}),x(!0))},R=()=>{t==null||t.setShowSideNav(!(t!=null&&t.showSideNav))},O=f.useMemo(()=>co("github:ceoloide/ergogen#v4.3.0"),[]);return o.jsxs(o.Fragment,{children:[g&&o.jsx(hr,{config:(t==null?void 0:t.configInput)||"",injections:(t==null?void 0:t.injectionInput)||[],onClose:()=>x(!1),"data-testid":"share-dialog"}),o.jsxs(yl,{children:[o.jsxs(kl,{children:[o.jsx($l,{onClick:R,"aria-label":t!=null&&t.showSideNav?"Hide navigation panel":"Show navigation panel","data-testid":"side-nav-toggle-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"side_navigation"})}),o.jsxs(vl,{children:[o.jsx(El,{to:"/","aria-label":"Go to home page","data-testid":"logo-button",children:o.jsx(Pl,{src:"/ergogen.png",alt:"Ergogen logo"})}),o.jsxs(jl,{children:["Ergogen",O.isCustom&&o.jsx(gr,{versionInfo:O,"data-testid":"header-dev-chip"})]})]}),a&&o.jsxs(o.Fragment,{children:[o.jsx(Ll,{children:"/"}),o.jsxs(zl,{"data-testid":"header-active-config-name",$isEditing:k,onClick:!k&&!p?z:void 0,children:[p&&o.jsx(Al,{"data-testid":"header-shared-icon",children:o.jsx("span",{className:"material-symbols-outlined",children:"link"})}),k?o.jsxs(o.Fragment,{children:[o.jsx(Dl,{type:"text",value:y,onChange:U=>v(U.target.value),onBlur:S,onKeyDown:$,autoFocus:!0,"data-testid":"header-config-name-input","aria-label":"Edit configuration name"}),o.jsxs(Ht,{className:"header-actions-always-visible",children:[o.jsx(Ve,{onMouseDown:U=>{U.preventDefault()},onClick:S,"aria-label":"Confirm rename","data-testid":"header-confirm-rename-btn",children:o.jsx("span",{className:"material-symbols-outlined",children:"check"})}),o.jsx(Ve,{onMouseDown:U=>{U.preventDefault()},onClick:E,"aria-label":"Cancel rename","data-testid":"header-cancel-rename-btn",children:o.jsx("span",{className:"material-symbols-outlined",children:"close"})})]})]}):p?o.jsxs(o.Fragment,{children:[o.jsx(Pn,{"data-testid":"header-config-name-text",children:a}),o.jsx(Ht,{className:"header-actions-always-visible",children:o.jsx(Ve,{onClick:U=>{U.stopPropagation(),b==null||b()},"aria-label":"Save preview configuration","data-testid":"header-save-preview-btn",children:o.jsx("span",{className:"material-symbols-outlined",children:"save"})})})]}):o.jsxs(o.Fragment,{children:[o.jsx(Pn,{title:"Click to rename","data-testid":"header-config-name-text",children:a}),o.jsxs(Ht,{className:"header-actions-hover",children:[o.jsx(Ve,{onClick:z,"aria-label":"Rename configuration","data-testid":"header-rename-btn",children:o.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),o.jsx(En,{onClick:L,"aria-label":"Duplicate configuration","data-testid":"header-duplicate-btn",children:o.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),o.jsx(En,{onClick:D,"aria-label":"Delete configuration","data-testid":"header-delete-btn",children:o.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})]})]})]}),o.jsxs(_l,{children:[e&&o.jsx(xl,{onClick:e,"data-testid":"header-update-chip"}),n.pathname==="/"&&o.jsxs(o.Fragment,{children:[o.jsxs(Cl,{onClick:w,"aria-label":"Start new configuration","data-testid":"new-config-button",children:[o.jsx("span",{className:"material-symbols-outlined",children:"add_2"}),o.jsx(Sl,{children:"New"})]}),o.jsx(Sn,{onClick:C,disabled:(t==null?void 0:t.isGenerating)||(t==null?void 0:t.isJscadConverting),"aria-label":"Download archive of all generated files","data-testid":"header-download-outputs-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),o.jsx(Sn,{onClick:A,disabled:!(t!=null&&t.configInput),"aria-label":"Share configuration","data-testid":"header-share-button",children:o.jsx("span",{className:"material-symbols-outlined",children:"share"})})]}),n.pathname!=="/new"&&o.jsx(Et,{onClick:I,"aria-label":t!=null&&t.showSettings?"Hide settings panel":"Show settings panel","data-testid":"settings-button",children:o.jsx("span",{className:"material-symbols-outlined",children:t!=null&&t.showSettings?"keyboard_alt":"settings"})})]})]})]})},zl=d.div`
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
`,Ht=d.div`
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
`,Ve=d.button`
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
`,En=d(Ve)`
  @media (max-width: 767px) {
    display: none;
  }
`,Ll=d.span`
  color: ${r.colors.textDark};
  font-size: ${r.fontSizes.sm};
  font-weight: ${r.fontWeights.semiBold};
  user-select: none;
  @media (max-width: 639px) {
    display: none;
  }
`,Pn=d.span`
  font-size: ${r.fontSizes.bodySmall};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  user-select: none;
`,Dl=d.input`
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
`,Al=d.div`
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
`,Rl=_t`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
`,Nl=d.div`
  position: fixed;
  top: 45px;
  left: 0;
  right: 0;
  width: 100%;
  height: 3px;
  background-color: transparent;
  overflow: hidden;
  z-index: 1000;
`,Ul=d.div`
  height: 100%;
  width: 25%;
  background-color: ${r.colors.accent};
  animation: ${Rl} 1.5s ease-in-out infinite;
`,Ol=({visible:e,"data-testid":t})=>e?o.jsx(Nl,{"data-testid":t,children:o.jsx(Ul,{})}):null,pt={info:{background:r.colors.info,text:r.colors.infoDark},warning:{background:r.colors.warning,text:r.colors.warningDark},error:{background:r.colors.error,text:r.colors.errorDark},success:{background:r.colors.success,text:r.colors.successDark}},ft=d.span.attrs({className:"material-symbols-outlined"})`
  font-size: ${r.fontSizes.iconLarge};
  margin-right: 1rem;
`,ht=d.div`
  display: flex;
  align-items: center;
`,gt=d.p`
  margin: 0;
`,mt=d.div`
  padding: 1rem 1.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: ${({type:e})=>pt[e].text};
  background-color: ${({type:e})=>pt[e].background};
  border: 1px solid ${({type:e})=>pt[e].text};

  .material-symbols-outlined {
    color: ${({type:e})=>pt[e].text};
  }
`,Wl=d.div`
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
`,bt=d.button`
  background: none;
  border: none;
  color: inherit;
  font-size: ${r.fontSizes.h3};
  cursor: pointer;
  padding: 0;
  line-height: 1;
  margin-left: auto;
  padding-left: 1rem;
`,Fl=()=>{const e=_e();if(!e)return null;const{error:t,deprecationWarning:s,skippedWarning:n,info:i,clearError:a,clearWarning:c,clearSkippedWarning:p,clearInfo:m}=e;return o.jsxs(Wl,{"data-testid":"banners-container",children:[i&&o.jsxs(mt,{type:"info","data-testid":"info-banner",children:[o.jsxs(ht,{children:[o.jsx(ft,{children:"info"}),o.jsx(gt,{children:i})]}),o.jsx(bt,{onClick:m,"aria-label":"Close info message","data-testid":"close-info-banner",children:"×"})]}),s&&o.jsxs(mt,{type:"warning","data-testid":"warning-banner",children:[o.jsxs(ht,{children:[o.jsx(ft,{children:"warning"}),o.jsx(gt,{children:s})]}),o.jsx(bt,{onClick:c,"aria-label":"Close warning message","data-testid":"close-warning-banner",children:"×"})]}),n&&o.jsxs(mt,{type:"warning","data-testid":"skipped-injections-banner",children:[o.jsxs(ht,{children:[o.jsx(ft,{children:"warning"}),o.jsx(gt,{children:n})]}),o.jsx(bt,{onClick:p,"aria-label":"Close feature warning message","data-testid":"close-skipped-banner",children:"×"})]}),t&&o.jsxs(mt,{type:"error","data-testid":"error-banner",children:[o.jsxs(ht,{children:[o.jsx(ft,{children:"error"}),o.jsx(gt,{children:t})]}),o.jsx(bt,{onClick:a,"aria-label":"Close error message","data-testid":"close-error-banner",children:"×"})]})]})},Bl=()=>o.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-discord",viewBox:"0 0 16 16",children:o.jsx("path",{d:"M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"})}),In=({label:e,version:t,url:s,isCustom:n=!1,"data-testid":i,devBadgeTestId:a})=>{const c=()=>{window.open(s,"_blank","noopener,noreferrer")};return o.jsxs(Ml,{onClick:c,$hasDevBadge:n,"aria-label":`View ${e==="Ergogen"?"Ergogen":`Ergogen ${e}`} ${t} on GitHub`,"data-testid":i,children:[o.jsx(io,{}),o.jsxs(Tl,{children:[o.jsx(Gl,{children:e}),o.jsx(Hl,{$isCustom:n,children:t})]}),n&&o.jsx(Vl,{"data-testid":a,children:o.jsx(ql,{children:"DEV"})})]})},Ml=d.button`
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
`,Tl=d.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  line-height: 1.1;
  min-width: 0;
`,Gl=d.span`
  font-size: 10px;
  font-weight: ${r.fontWeights.bold};
  color: ${r.colors.white};
  white-space: nowrap;
`,Hl=d.span`
  font-size: 8px;
  color: ${e=>e.$isCustom?r.colors.accent:r.colors.textDark};
  white-space: nowrap;
`,Vl=d.div`
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
`,ql=d.span`
  font-size: 8px;
  font-weight: ${r.fontWeights.bold};
  color: ${r.colors.accent};
  transform: rotate(-90deg);
  white-space: nowrap;
  line-height: 1;
`,Jl=({isOpen:e,onClose:t,"data-testid":s})=>{const n=f.useRef(e),[i,a]=f.useState(e),[c,p]=f.useState(360),m=f.useRef(!1),l=f.useRef(0),h=f.useRef(360),b=_e(),g=ao(),x=vt.version,{configs:k,activeConfigId:u,selectConfig:y,renameConfig:v,duplicateConfig:z,deleteConfig:S,setIsBulkDownloadOpen:E}=b||{},[$,L]=f.useState(""),[D,I]=f.useState(null),[w,C]=f.useState(""),A=f.useMemo(()=>{if(!k)return[];let W=k;if($.trim()){const T=$.toLowerCase().split(/\s+/).filter(Boolean);T.length>0&&(W=k.filter(Z=>{const G=Z.name.toLowerCase();return T.some(_=>G.includes(_))}))}return[...W].sort((T,Z)=>{const G=T.updatedAt?new Date(T.updatedAt).getTime():0,_=Z.updatedAt?new Date(Z.updatedAt).getTime():0;if(G!==_)return _-G;const H=T.createdAt?new Date(T.createdAt).getTime():0,V=Z.createdAt?new Date(Z.createdAt).getTime():0;return H!==V?V-H:T.name.localeCompare(Z.name)})},[k,$]),R=()=>{y&&y(null),g("/new"),t()},O=()=>{B("bulk_download_dialog_opened",{stored_configs_count:(k==null?void 0:k.length)||0}),E&&E(!0),t()},U=W=>{y&&(y(W),g("/"),t())},F=(W,T)=>{I(W),C(T)},ee=W=>{v&&w.trim()&&!v(W,w.trim())||I(null)},X=W=>{z&&z(W)},ne=(W,T)=>{if(window.confirm(`Are you sure you want to delete "${T}"?`)&&S){S(W);const Z=u===W,G=k&&k.length<=1;(Z||G)&&(g("/new"),t())}};f.useEffect(()=>{const W=n.current;e&&!W?a(!0):!e&&W&&a(!1),e||I(null),n.current=e},[e]),f.useEffect(()=>{if(!$.trim())return;const W=setTimeout(()=>{B("search_performed",{query_length:$.trim().length})},1e3);return()=>clearTimeout(W)},[$]),f.useEffect(()=>{const W=_=>{if(!m.current)return;const H=_.clientX-l.current,V=h.current+H,Q=Math.min(600,window.innerWidth*.9),q=Math.max(360,Math.min(V,Q));p(q)},T=()=>{m.current&&(m.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},Z=_=>{if(!m.current)return;_.preventDefault();const V=_.touches[0].clientX-l.current,Q=h.current+V,q=Math.min(600,window.innerWidth*.9),se=Math.max(360,Math.min(Q,q));p(se)},G=()=>{m.current&&(m.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",W),window.addEventListener("mouseup",T),window.addEventListener("touchmove",Z,{passive:!1}),window.addEventListener("touchend",G),()=>{window.removeEventListener("mousemove",W),window.removeEventListener("mouseup",T),window.removeEventListener("touchmove",Z),window.removeEventListener("touchend",G)}},[]);const Y=W=>{W.preventDefault(),W.stopPropagation(),m.current=!0,h.current=c,"touches"in W?l.current=W.touches[0].clientX:l.current=W.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};f.useEffect(()=>{if(!e)return;const W=T=>{T.key==="Escape"&&t()};return window.addEventListener("keydown",W),()=>{window.removeEventListener("keydown",W)}},[e,t]);const M=f.useMemo(()=>co("github:ceoloide/ergogen#v4.3.0"),[]);return f.useEffect(()=>(e?document.body.style.overflow="hidden":document.body.style.overflow="",()=>{document.body.style.overflow=""}),[e]),o.jsxs(o.Fragment,{children:[o.jsx(Kl,{"data-testid":s,onClick:t,$isOpen:e,$isOpening:i}),o.jsxs(Yl,{"data-testid":s&&`${s}-panel`,$isOpen:e,$isOpening:i,$width:c,onClick:W=>W.stopPropagation(),children:[o.jsx(kc,{onMouseDown:Y,onTouchStart:Y,"data-testid":s&&`${s}-resize-handle`}),o.jsxs(Xl,{children:[o.jsxs(Zl,{children:[o.jsx(Ql,{to:"/",onClick:t,"aria-label":"Go to home page","data-testid":"side-nav-logo-button",children:o.jsx(ec,{src:"/ergogen.png",alt:"Ergogen logo"})}),o.jsxs(tc,{onClick:t,children:["Ergogen",M.isCustom&&o.jsx(gr,{versionInfo:M,"data-testid":"sidebar-dev-chip"})]})]}),o.jsx(oc,{onClick:t,"data-testid":s&&`${s}-close`,"aria-label":"Close navigation panel",children:o.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),o.jsxs(nc,{children:[o.jsxs(rc,{children:[o.jsxs(ic,{onClick:R,"aria-label":"New","data-testid":"side-nav-new-config-button",children:[o.jsx("span",{className:"material-symbols-outlined",children:"add"}),o.jsx("span",{children:"New"})]}),k&&k.length>0&&o.jsxs(sc,{onClick:O,"aria-label":"Download All","data-testid":"side-nav-download-all-button",children:[o.jsx("span",{className:"material-symbols-outlined",children:"download"}),o.jsx("span",{children:"Download All"})]})]}),o.jsxs(ac,{children:[o.jsx("span",{className:"material-symbols-outlined search-icon",children:"search"}),o.jsx(lc,{type:"text",placeholder:"Search configurations...",value:$,onChange:W=>L(W.target.value),"aria-label":"Search configurations"}),$&&o.jsx(cc,{onClick:()=>L(""),children:o.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),o.jsxs(dc,{children:[o.jsx("span",{children:"Saved Configurations"}),o.jsx(uc,{children:A.length})]}),o.jsxs(pc,{children:[A.map(W=>{const T=W.id===u,Z=D===W.id;return o.jsx(fc,{$isActive:T,"data-testid":`config-item-${W.id}`,children:Z?o.jsxs(mc,{onSubmit:G=>{G.preventDefault(),ee(W.id)},children:[o.jsx(bc,{type:"text",value:w,onChange:G=>C(G.target.value),autoFocus:!0,"aria-label":"Rename input"}),o.jsx(zn,{type:"submit","aria-label":"Save name",children:o.jsx("span",{className:"material-symbols-outlined",children:"check"})}),o.jsx(zn,{type:"button",onClick:()=>I(null),"aria-label":"Cancel rename",children:o.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}):o.jsxs(o.Fragment,{children:[o.jsxs(hc,{onClick:()=>U(W.id),$isActive:T,title:W.name,children:[o.jsx("span",{className:"material-symbols-outlined",children:"description"}),o.jsx("span",{className:"config-title-text",children:W.name})]}),o.jsxs(gc,{$isActive:T,children:[o.jsx(Vt,{onClick:()=>F(W.id,W.name),"aria-label":`Rename configuration ${W.name}`,children:o.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),o.jsx(Vt,{onClick:()=>X(W.id),"aria-label":`Duplicate configuration ${W.name}`,children:o.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),o.jsx(Vt,{onClick:()=>ne(W.id,W.name),"aria-label":`Delete configuration ${W.name}`,children:o.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})},W.id)}),A.length===0&&o.jsx(wc,{children:"No configurations found"})]})]}),o.jsx(xc,{children:o.jsxs(yc,{children:[o.jsxs(Ln,{onClick:()=>{window.open("https://docs.ergogen.xyz/","_blank","noopener,noreferrer")},"aria-label":"Open documentation","data-testid":"side-nav-docs-button",children:[o.jsx("span",{className:"material-symbols-outlined",children:"description"}),o.jsx("span",{children:"Docs"})]}),o.jsx(Ln,{onClick:()=>{window.open("https://discord.ergogen.xyz","_blank","noopener,noreferrer")},"aria-label":"Join the Discord community","data-testid":"side-nav-discord-button",children:o.jsx(Bl,{})}),o.jsx(In,{label:"Web UI",version:x,url:"https://github.com/ceoloide/ergogen-gui","data-testid":"side-nav-gui-version-button"}),o.jsx(In,{label:"Ergogen",version:M.displayText,url:M.url,isCustom:M.isCustom,"data-testid":"side-nav-ergogen-version-button",devBadgeTestId:"side-nav-ergogen-dev-badge"})]})})]})]})},Kl=d.div`
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
`,Yl=d.div`
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
`,Xl=d.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 3em;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
`,Zl=d.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`,Ql=d(Hn)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,ec=d.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,tc=d.div`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  cursor: pointer;
  display: flex;
  align-items: center;
`,oc=d.button`
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
`,nc=d.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`,rc=d.div`
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
  flex-shrink: 0;
`,ic=d.button`
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
`,sc=d.button`
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
`,ac=d.div`
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
`,lc=d.input`
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
`,cc=d.button`
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
`,dc=d.div`
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
`,uc=d.span`
  background-color: ${r.colors.border};
  color: ${r.colors.white};
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: ${r.fontWeights.semiBold};
`,pc=d.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  flex: 1;
`,fc=d.div`
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
`,hc=d.button`
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
`,gc=d.div.attrs({className:"item-actions-hover"})`
  display: flex;
  gap: 4px;
  opacity: ${e=>e.$isActive?1:0};
  transition: opacity 0.15s ease-in-out;

  @media (max-width: 1023px) {
    opacity: 1;
  }
`,Vt=d.button`
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
`,mc=d.form`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 100%;
`,bc=d.input`
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
`,zn=d.button`
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
`,wc=d.div`
  text-align: center;
  color: ${r.colors.textDark};
  font-size: ${r.fontSizes.bodySmall};
  margin-top: 2rem;
  font-style: italic;
`,xc=d.div`
  padding: 8px 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`,yc=d.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  width: 100%;
`,Ln=d.button`
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
`,kc=d.div`
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
`,_c=({isOpen:e,configs:t,injections:s,debug:n,stlPreview:i,onClose:a,"data-testid":c})=>{const[p,m]=f.useState(new Set),[l,h]=f.useState(!0),[b,g]=f.useState(!1),[x,k]=f.useState(0),[u,y]=f.useState(""),v=f.useRef(!1);if(f.useEffect(()=>{e&&(m(new Set(t.map(D=>D.id))),g(!1),k(0),y(""),v.current=!1)},[e,t]),!e)return null;const z=D=>{m(D?new Set(t.map(I=>I.id)):new Set)},S=(D,I)=>{const w=new Set(p);I?w.add(D):w.delete(D),m(w)},E=async()=>{if(p.size===0)return;g(!0),k(0),y(""),v.current=!1;const D=t.filter(I=>p.has(I.id));B("bulk_download_started",{selected_configs_count:p.size,only_configs:l});try{const I=await Ri(D,s,n,i,l,(w,C,A)=>{k(w),y(A)},()=>v.current);v.current||(I&&I.succeededCount===0&&I.failedCount>0?B("bulk_download_failed",{selected_configs_count:p.size,failed_configs_count:I.failedCount,only_configs:l,error_message:`All ${I.failedCount} selected configuration(s) failed to compile`}):I&&I.failedCount>0?B("bulk_download_partial",{selected_configs_count:p.size,failed_configs_count:I.failedCount,only_configs:l}):B("bulk_download_completed",{selected_configs_count:p.size,only_configs:l}))}catch(I){console.error("Error during bulk download:",I),B("bulk_download_failed",{selected_configs_count:p.size,only_configs:l,error_message:I instanceof Error?I.message:String(I)})}finally{v.current||a()}},$=()=>{b&&!v.current&&B("bulk_download_cancelled",{selected_configs_count:p.size,completed_configs_count:x,only_configs:l}),v.current=!0,a()},L=p.size>0?x/p.size*100:0;return o.jsx(vc,{"data-testid":c,children:o.jsxs(jc,{"data-testid":c&&`${c}-box`,children:[o.jsx($c,{children:"Download Configurations"}),b?o.jsxs(o.Fragment,{children:[o.jsxs(Wc,{children:[o.jsx(Fc,{children:o.jsx(Bc,{style:{width:`${L}%`}})}),o.jsxs(Mc,{children:[o.jsx(Tc,{children:u?u.includes(", ")?o.jsxs("div",{children:["Generating:",o.jsx(Gc,{children:u.split(", ").map(D=>o.jsx("li",{children:D},D))})]}):o.jsxs(Rn,{children:["Generating ",u]}):o.jsx(Rn,{children:"Preparing..."})}),o.jsxs(Hc,{children:[x," / ",p.size]})]})]}),o.jsx(An,{children:o.jsx(Vc,{onClick:$,size:"medium",children:"Cancel"})})]}):o.jsxs(o.Fragment,{children:[o.jsx(Sc,{children:t.map(D=>{const I=p.has(D.id);return o.jsx(Ec,{children:o.jsxs(mr,{htmlFor:`bulk-check-${D.id}`,children:[o.jsx(Ic,{id:`bulk-check-${D.id}`,checked:I,onChange:w=>S(D.id,w.target.checked)}),o.jsx(zc,{$checked:I}),o.jsx(Pc,{children:D.name})]})},D.id)})}),o.jsxs(Cc,{children:[o.jsx(Dn,{onClick:()=>z(!0),children:"Select All"}),o.jsx(Dn,{onClick:()=>z(!1),children:"Deselect All"})]}),o.jsxs(Lc,{children:[o.jsx(Dc,{children:"Only download configs"}),o.jsxs(Ac,{$checked:l,htmlFor:"only-configs-switch",children:[o.jsx(Rc,{type:"checkbox",id:"only-configs-switch",checked:l,onChange:D=>h(D.target.checked)}),o.jsx(Nc,{$checked:l}),o.jsx(Uc,{$checked:l})]})]}),!l&&o.jsxs(Oc,{children:[o.jsx("span",{className:"material-symbols-outlined",children:"warning"}),o.jsx("span",{children:"Warning: Exporting generated outputs for multiple configurations may take a long time depending on the number of selected configurations, their complexity, and CPU speed."})]}),o.jsxs(An,{children:[o.jsx(br,{onClick:$,size:"medium",children:"Cancel"}),o.jsxs(he,{onClick:E,disabled:p.size===0,size:"medium",children:["Download (",p.size,")"]})]})]})]})})},vc=d.div`
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
`,jc=d.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,$c=d.h2`
  margin: 0 0 1rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
`,Cc=d.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 1.5rem;
`,Dn=d.button`
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
`,Sc=d.div`
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
`,Ec=d.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,Pc=d.span`
  color: ${r.colors.text};
  font-size: 13px;
  user-select: none;
`,mr=d.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  padding: 4px 0;
`,Ic=d.input.attrs({type:"checkbox"})`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`,zc=d.div`
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

  ${mr}:hover & {
    border-color: ${r.colors.accent};
  }
`,Lc=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
`,Dc=d.span`
  color: ${r.colors.text};
  font-size: ${r.fontSizes.base};
  user-select: none;
`,Ac=d.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: pointer;
`,Rc=d.input`
  opacity: 0;
  width: 0;
  height: 0;
`,Nc=d.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${e=>e.$checked?r.colors.accent:r.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`,Uc=d.span`
  position: absolute;
  top: 2px;
  left: ${e=>e.$checked?"18px":"2px"};
  width: 16px;
  height: 16px;
  background-color: ${r.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,Oc=d.div`
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
`,An=d.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: auto;
`,Wc=d.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`,Fc=d.div`
  background-color: ${r.colors.border};
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  width: 100%;
`,Bc=d.div`
  background-color: ${r.colors.accent};
  height: 100%;
  transition: width 0.15s ease-out;
`,Mc=d.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`,Tc=d.div`
  color: ${r.colors.text};
  max-width: 80%;
`,Rn=d.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,Gc=d.ul`
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
`,Hc=d.span`
  color: ${r.colors.textDark};
  font-weight: ${r.fontWeights.semiBold};
`,br=d(he)`
  background-color: ${r.colors.backgroundLighter};
  color: ${r.colors.textDark};

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`,Vc=d(br)`
  width: 100%;
`;function qc(){return!!(window.location.hostname==="localhost"||window.location.hostname==="[::1]"||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))}function Jc(e,t,s){e.addEventListener("statechange",()=>{var n,i;e.state==="installed"&&(navigator.serviceWorker.controller?(console.log("[SW] New content is available. Will be used when all existing tabs are closed or you reload."),(n=s==null?void 0:s.onUpdate)==null||n.call(s,t)):(console.log("[SW] Content is cached for offline use."),(i=s==null?void 0:s.onSuccess)==null||i.call(s,t)))})}async function wr(e,t){var s;try{const n=await navigator.serviceWorker.register(e);let i=null;const a=c=>{c===null||c===i||(i=c,Jc(c,n,t))};n.addEventListener("updatefound",()=>a(n.installing)),n.waiting&&navigator.serviceWorker.controller?(s=t==null?void 0:t.onUpdate)==null||s.call(t,n):a(n.installing)}catch(n){console.error("[SW] Error during service worker registration:",n)}}async function Kc(e,t){try{const s=await fetch(e,{headers:{"Service-Worker":"script"}}),n=s.headers.get("content-type");s.status===404||n!==null&&n.indexOf("javascript")===-1?(await(await navigator.serviceWorker.ready).unregister(),window.location.reload()):await wr(e,t)}catch{console.log("[SW] No internet connection found. App is running in offline mode.")}}function Yc(e){!("serviceWorker"in navigator)||new URL("/",window.location.href).origin!==window.location.origin||window.addEventListener("load",()=>{const s="/service-worker.js";qc()?(Kc(s,e),navigator.serviceWorker.ready.then(()=>{console.log("[SW] This web app is being served cache-first by a service worker. See https://cra.link/PWA for more details.")})):wr(s,e)})}const Xc=({report:e,onAccept:t,onCancel:s,"data-testid":n})=>o.jsx(Zc,{"data-testid":n,children:o.jsxs(Qc,{"data-testid":n&&`${n}-box`,children:[o.jsx(ed,{children:"Version Compatibility Warning"}),o.jsx(td,{children:"The shared link was created under a different environment. You may experience compatibility issues."}),o.jsxs(od,{children:[e.guiWarning&&o.jsxs(qt,{"data-testid":n&&`${n}-gui-warning`,children:[o.jsxs(Jt,{children:["GUI Version Mismatch",o.jsx(Kt,{"data-testid":"gui-mismatch-badge",children:"Mismatch"})]}),o.jsxs(Yt,{children:["The shared link was created with a newer version of the GUI (",o.jsxs("strong",{children:["v",e.guiWarning.shared]}),") than your current version (",o.jsxs("strong",{children:["v",e.guiWarning.current]}),"). Some interface options or features may not function as expected."]})]}),e.ergogenWarning&&o.jsxs(qt,{"data-testid":n&&`${n}-ergogen-warning`,children:[o.jsxs(Jt,{children:["Ergogen Version Mismatch",o.jsx(Kt,{"data-testid":"ergogen-mismatch-badge",children:"Mismatch"})]}),o.jsxs(Yt,{children:["The shared link was created with a newer version of Ergogen (",o.jsx("strong",{children:e.ergogenWarning.shared}),") than your current version (",o.jsx("strong",{children:e.ergogenWarning.current}),"). Some features or syntax might not be supported."]})]}),e.customErgogenWarning&&o.jsxs(qt,{"data-testid":n&&`${n}-custom-ergogen-warning`,children:[o.jsxs(Jt,{children:["Custom Ergogen Version Used",o.jsx(Kt,{"data-testid":"custom-version-badge",children:"Custom"})]}),o.jsxs(Yt,{children:["The shared link was created using a custom version of Ergogen:"," ",o.jsx("strong",{children:e.customErgogenWarning.shared}),".",o.jsx("br",{}),"You can investigate the repository used here:",o.jsx("br",{}),o.jsx(nd,{href:e.customErgogenWarning.url,target:"_blank",rel:"noopener noreferrer","data-testid":n&&`${n}-custom-repo-link`,children:e.customErgogenWarning.label})]})]})]}),o.jsxs(rd,{children:[o.jsx(sd,{onClick:s,size:"medium","data-testid":n&&`${n}-cancel`,"aria-label":"Cancel configuration loading",children:"Cancel"}),o.jsx(id,{onClick:t,size:"medium","data-testid":n&&`${n}-accept`,"aria-label":"Accept and load configuration",children:"Accept and Load"})]})]})}),Zc=d.div`
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
`,Qc=d.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 550px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,ed=d.h2`
  margin: 0 0 0.5rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.error};
`,td=d.p`
  margin: 0 0 1.5rem 0;
  font-size: ${r.fontSizes.base};
  color: ${r.colors.textDarker};
  line-height: 1.4;
`,od=d.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`,qt=d.div`
  background-color: ${r.colors.backgroundLighter};
  border-left: 4px solid ${r.colors.warningDark};
  padding: 1rem;
  border-radius: 4px;
`,Jt=d.div`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.bold};
  color: ${r.colors.warningDark};
  margin-bottom: 0.25rem;
`,Kt=d.span`
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
`,Yt=d.div`
  font-size: ${r.fontSizes.bodySmall};
  color: ${r.colors.textDark};
  line-height: 1.5;

  strong {
    color: ${r.colors.text};
  }
`,nd=d.a`
  display: inline-block;
  margin-top: 0.5rem;
  color: ${r.colors.accent};
  text-decoration: underline;
  word-break: break-all;

  &:hover {
    color: ${r.colors.accentSecondary};
  }
`,rd=d.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`,id=d(he)`
  background-color: ${r.colors.accent};
  color: ${r.colors.white};

  &:hover {
    background-color: ${r.colors.accentDark};
  }
`,sd=d(he)`
  background-color: ${r.colors.backgroundLighter};
  color: ${r.colors.textDark};

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`;let Nn=null,Un=!1;const ad=()=>{Un||(Nn=pr(),Un=!0);const e=Nn,t=[];let s=null;const n=f.useRef(null);if(e)if(e.success){const c=e.config;n.current===null&&(n.current={config:c.config,injections:c.injections,guiVersion:c.guiVersion,ergogenVersion:c.ergogenVersion}),window.history.replaceState(null,"",window.location.pathname+window.location.search)}else s=e.message,console.error("[App] Failed to load shared configuration from hash",{error:e.error,message:e.message,hashLength:window.location.hash.length}),window.history.replaceState(null,"",window.location.pathname+window.location.search);const[i,a]=f.useState(null);return f.useEffect(()=>{n.current&&a(n.current)},[]),o.jsx(Ti,{initialInjectionInput:t,hashError:s,children:o.jsx(dd,{pendingSharedConfig:i})})};function ld(){const[e,t]=f.useState(null),s=new URLSearchParams(window.location.search).has("force_update");if(f.useEffect(()=>{Yc({onUpdate:n=>{t(n)}})},[]),s)return()=>{console.log("[SW] Force-update triggered via ?force_update URL parameter."),window.location.reload()};if(e)return()=>{let n;if("serviceWorker"in navigator){let a=!1;navigator.serviceWorker.addEventListener("controllerchange",()=>{a||(a=!0,n&&clearTimeout(n),window.location.reload())})}const i=e.waiting;i?(i.postMessage({type:"SKIP_WAITING"}),n=setTimeout(()=>{window.location.reload()},1e3)):window.location.reload()}}function cd(){const[e,t]=f.useState(null),[s,n]=f.useState(!1),[i,a]=f.useState(!1),c=new URLSearchParams(window.location.search).has("force_install");return f.useEffect(()=>{(()=>{const g=typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches,x=window.navigator.standalone===!0;a(g||x)})();const h=g=>{g.preventDefault(),t(g),console.log("[PWA] beforeinstallprompt event fired and captured.")},b=()=>{console.log("[PWA] appinstalled event fired."),a(!0),n(!1)};return window.addEventListener("beforeinstallprompt",h),window.addEventListener("appinstalled",b),()=>{window.removeEventListener("beforeinstallprompt",h),window.removeEventListener("appinstalled",b)}},[]),{onInstall:()=>{B("pwa_install_click"),n(!0),e?(e.prompt(),e.userChoice.then(l=>{l.outcome==="accepted"?(console.log("[PWA] User accepted the install prompt"),B("pwa_install_accepted"),a(!0)):(console.log("[PWA] User dismissed the install prompt"),B("pwa_install_dismissed")),n(!1),t(null)})):(console.log("[PWA] Install prompt triggered (deferredPrompt is not available on this device/browser)"),alert('PWA installation is not supported by this browser or is restricted on this device. If you are on iOS/iPadOS, please open this site in Safari and select "Add to Home Screen" from the Share menu.'),n(!1))},isAvailable:!!e||c,isInstalled:i,isInstalling:s}}const dd=({pendingSharedConfig:e})=>{var S;const t=_e(),s=t==null?void 0:t.configInput,n=Gn(),i=ld(),a=cd(),c=f.useRef(0);c.current=((S=t==null?void 0:t.configs)==null?void 0:S.length)||0,f.useEffect(()=>{B("page_view",{page_path:n.pathname,stored_configs_count:c.current})},[n.pathname]);const p=f.useRef(!1),m=f.useRef(e);e!==m.current&&(m.current=e);const{currentConflict:l,processInjectionsWithConflictResolution:h,handleConflictResolution:b,handleConflictCancel:g}=St({setInjectionInput:E=>t==null?void 0:t.setInjectionInput(E),setConfigInput:E=>t==null?void 0:t.loadPreview(E),generateNow:async(E,$,L)=>{t&&await t.generateNow(E,$,L)},getCurrentInjections:()=>(t==null?void 0:t.injectionInput)||[],onComplete:async(E,$)=>{localStorage.setItem("ergogen:injection",JSON.stringify($)),t==null||t.loadPreview(E)},setError:E=>t==null?void 0:t.setError(E)}),[x,k]=f.useState(null),u=(E,$)=>{const L=vt.version,D=uo("github:ceoloide/ergogen#v4.3.0");let I=!0,w,C,A;if(E){const R=Ue(L),O=Ue(E);R&&O&&!Xt(R,O)&&(I=!1,w={current:L,shared:E})}if($){if(Rr($)&&$!==D){I=!1;const U=co($);A={shared:$,url:U.url,label:U.label}}const R=en(D)||et(),O=en($);if(O){const U=Ue(R),F=Ue(O);U&&F&&!Xt(U,F)&&(I=!1,C={current:R,shared:O})}}return{isCompatible:I,guiWarning:w,ergogenWarning:C,customErgogenWarning:A}},y=f.useCallback((E,$)=>{t&&($!==void 0&&$.length>0?h($,E).catch(L=>{console.error("[App] Error processing injections:",L),t.setError(`Failed to process injections: ${L instanceof Error?L.message:"Unknown error"}`)}):(t.loadPreview(E),t.generateNow(E,t.injectionInput,{pointsonly:!1})))},[t,h]),v=()=>{var E;x&&(B("shared_config_accepted",{has_injections:!!(x.injections&&x.injections.length>0),injections_count:((E=x.injections)==null?void 0:E.length)||0}),y(x.config,x.injections),k(null))},z=()=>{var E;x&&B("shared_config_declined",{has_injections:!!(x.injections&&x.injections.length>0),injections_count:((E=x.injections)==null?void 0:E.length)||0}),k(null)};return f.useEffect(()=>{if(!t||!e||p.current)return;p.current=!0;const E=u(e.guiVersion,e.ergogenVersion);E.isCompatible?y(e.config,e.injections):k({config:e.config,injections:e.injections,report:E})},[t,e,y]),f.useEffect(()=>{if(!t)return;const E=()=>{const $=pr();if($)if($.success){const L=$.config,D=u(L.guiVersion,L.ergogenVersion);D.isCompatible?y(L.config,L.injections):k({config:L.config,injections:L.injections,report:D}),window.history.replaceState(null,"",window.location.pathname+window.location.search)}else console.error("[App] Failed to load shared configuration from hash (hashchange)",{error:$.error,message:$.message,hashLength:window.location.hash.length}),t.setError($.message),window.history.replaceState(null,"",window.location.pathname+window.location.search)};return window.addEventListener("hashchange",E),()=>{window.removeEventListener("hashchange",E)}},[t,y]),o.jsxs(o.Fragment,{children:[x&&o.jsx(Xc,{report:x.report,onAccept:v,onCancel:z,"data-testid":"share-compatibility-dialog"}),l&&o.jsx(Ct,{injectionName:l.name,injectionType:l.type,onResolve:b,onCancel:g,"data-testid":"conflict-dialog"}),(t==null?void 0:t.isBulkDownloadOpen)&&o.jsx(_c,{isOpen:t.isBulkDownloadOpen,configs:t.configs,injections:t.injectionInput,debug:t.debug,stlPreview:t.stlPreview,onClose:()=>t.setIsBulkDownloadOpen(!1),"data-testid":"bulk-download-dialog"}),o.jsx(Il,{onUpdate:i}),o.jsx(Ol,{visible:(t==null?void 0:t.isGenerating)??!1,"data-testid":"loading-bar"}),o.jsx(Fl,{}),o.jsx(Jl,{isOpen:(t==null?void 0:t.showSideNav)??!1,onClose:()=>t==null?void 0:t.setShowSideNav(!1),"data-testid":"side-navigation"}),o.jsx(ud,{children:o.jsxs(Ir,{children:[o.jsx(At,{path:"/",element:s?o.jsx(ya,{pwaState:a}):o.jsx(Qo,{to:{pathname:"/new",search:n.search},replace:!0})}),o.jsx(At,{path:"/new",element:o.jsx(cl,{})}),o.jsx(At,{path:"*",element:o.jsx(Qo,{to:"/",replace:!0})})]})})]})},ud=d.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;let On=!1;const pd=e=>{On||(e.editor.defineTheme("ergogen-theme",{base:"vs-dark",inherit:!0,rules:[],colors:{"editor.background":r.colors.backgroundLight}}),On=!0)};Zn();const fd=d.div`
  display: flex;
  flex-direction: column;
  color: #ffffff;
  height: 100%;
  width: 100%;
  font-family: 'Roboto', sans-serif;
`,hd=zr`
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
`;Vn.config({paths:{vs:"/monaco/vs"}});Vn.init().then(e=>{pd(e);const t=document.getElementById("root");Lr(t).render(o.jsx(Tn.StrictMode,{children:o.jsx(Dr,{basename:("/".startsWith("."),"/"),children:o.jsxs(fd,{children:[o.jsx(hd,{}),o.jsx(ad,{})]})})}))});export{Je as a,r as t};
