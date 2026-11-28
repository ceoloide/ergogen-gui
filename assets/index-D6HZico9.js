const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/PcbPreview-BI1R2Mfv.js","assets/vendor-DNe9Y6n2.js","assets/StlPreview-G-ZWo7Lw.js","assets/three-Dk8hj5rH.js","assets/js-yaml-DW8Bub87.js","assets/jszip-CyTxqeGV.js"])))=>i.map(i=>d[i]);
var Br=Object.defineProperty;var Tr=(e,n,r)=>n in e?Br(e,n,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[n]=r;var ot=(e,n,r)=>Tr(e,typeof n!="symbol"?n+"":n,r);import{f as Je,r as p,h as so,i as Zo,j as t,k as Qo,y as u,O as yt,p as er,l as Gr,m as Hr,n as tr,o as nr,q as Vr,t as Kr,v as dn,w as or,L as rr,x as qr,z as It,N as ao,A as Jr,B as ir,e as Yr,C as Xr}from"./vendor-DNe9Y6n2.js";import{j as fe}from"./js-yaml-DW8Bub87.js";import{J as un}from"./jszip-CyTxqeGV.js";import{_ as sr}from"./three-Dk8hj5rH.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function r(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(s){if(s.ep)return;s.ep=!0;const a=r(s);fetch(s.href,a)}})();const pn=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/ergogen.worker-yOrnwBol.js",import.meta.url),{type:"module"})}catch(e){return console.error("Failed to create worker:",e),null}},ar=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/jscad.worker-C8nLBdOi.js",import.meta.url),{type:"module"})}catch(e){return console.error("Failed to create JSCAD worker:",e),null}},Zr="0.19.3",kt={version:Zr},fn={GENERATION_WORKER_FAILED:{kind:"app",message:"The generation worker failed to load or threw an uncaught error.",fix:"Reload the page. If the error comes back, report it with this console output."},STL_WORKER_FAILED:{kind:"app",message:"The STL conversion worker failed to load or threw an uncaught error.",fix:"Reload the page. If the error comes back, turn off STL Preview in the settings and report the error with this console output."},STL_PREVIEW_FAILED:{kind:"app",message:"The 3D preview of a case failed to render.",fix:"Check that the browser has WebGL turned on. If the error comes back, turn off STL Preview in the settings and report the error with this console output."},UNCLASSIFIED:{kind:"app",message:"The app caught an error that has no diagnostic code.",fix:"Report the error with this console output, so that a maintainer can give it a code."}};class Qr extends Error{constructor(r,o){super(fn[r].message,o);ot(this,"code");this.name="DiagnosticError",this.code=r}}const ei="https://github.com/ceoloide/ergogen-gui/blob/main/docs/diagnostics.md",ti=".agents/skills/ergogen-gui-diagnostics/SKILL.md",ni=e=>e.toLowerCase(),oi=(e,n,r)=>{const o=fn[e],s=ni(e);return[`${e}: ${o.message}`,...r===o.message?[]:[`Error: ${r}`],`Location: ${n}`,`Fix: ${o.fix}`,`Docs: ${ei}#${s}`,`Agents: ${ti}#${s}`].join(`
`)},hn=e=>{const n=`v${Je.version}`,r=Je.version,o=Je.repository,s=o.startsWith("github:")?o.replace("github:","https://github.com/"):o.replace(/^git\+/,"").replace(/\.git$/,"");if(!e)return{label:n,url:s,displayText:r,isCustom:!1,isHash:!1,isTag:!1};if(e.includes("@")){const v=e.split("@"),x=v[1]||e;return{label:e,url:e.startsWith("ergogen@")?`${s}/releases/tag/v${x}`:`https://www.npmjs.com/package/${v[0]}`,displayText:x,isCustom:!0,isHash:!1,isTag:!0}}const a=e.startsWith("github:")?e.slice(7):e,[l,c]=a.split("#"),h=l==="ergogen/ergogen",d=`https://github.com/${l}`;if(h){if(!c)return{label:"latest",url:d,displayText:r,isCustom:!1,isHash:!1,isTag:!1};const v=c.length===40&&/^[0-9a-fA-F]{40}$/.test(c),x=v?n:c,f=v?`${d}/commit/${c}`:`${d}/tree/${c}`;return{label:c,url:f,displayText:x,isCustom:!0,isHash:v,isTag:!v}}if(!c)return{label:a,url:d,displayText:r,isCustom:!0,isHash:!1,isTag:!1};const g=c.length===40&&/^[0-9a-fA-F]{40}$/.test(c),m=g?n:c,b=g?`${d}/commit/${c}`:`${d}/tree/${c}`;return{label:a,url:b,displayText:m,isCustom:!0,isHash:g,isTag:!g}},gn=e=>{if(e.includes("@")){const s=e.split("@"),a=s[1]||e,l=s[0];return`github:${l==="ergogen"?"ergogen/ergogen":l}#v${a}`}const n=e.startsWith("github:")?e.slice(7):e,[r,o]=n.split("#");return o?`github:${r}#${o}`:`github:${r}#v${Je.version}`},We=e=>{const r=e.replace(/^v/,"").match(/^(\d+)\.(\d+)\.(\d+)/);return r?[Number(r[1]),Number(r[2]),Number(r[3])]:null},Yt=(e,n)=>{for(let r=0;r<3;r++){if(e[r]>n[r])return!0;if(e[r]<n[r])return!1}return!0},lo=e=>{const n=e.match(/(?:^|#|@|v)(\d+\.\d+\.\d+)/);return n?n[1]:null},ri=e=>{const n=e.startsWith("github:")?e.slice(7):e,[r]=n.split("#");return!e.startsWith("github:")&&!e.includes("/")?!1:r!=="ergogen/ergogen"},lr=()=>{if(typeof window>"u")return!1;const e=window.navigator;return typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches||e.standalone===!0},cr=e=>{if(typeof window>"u")return!0;if(window.__FORCE_ANALYTICS__===!0||e.startsWith("G-TEST"))return!1;const n=window.location.hostname;return!!(n==="localhost"||n==="127.0.0.1"||n==="[::1]"||n.endsWith(".localhost"))},ii=()=>{if(typeof document>"u"||!document.cookie)return;const e=document.cookie.split(";");for(const n of e){const r=n.indexOf("="),o=(r>-1?n.substring(0,r):n).trim();if(o.startsWith("_ga")){document.cookie=`${o}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`;const a=window.location.hostname.split(".");for(;a.length>0;){const l=a.join(".");document.cookie=`${o}=; Path=/; Domain=.${l}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`,document.cookie=`${o}=; Path=/; Domain=${l}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`,a.shift()}}}},si=()=>{if(!(typeof indexedDB>"u"))try{indexedDB.deleteDatabase("workbox-background-sync")}catch{}},dr=()=>typeof window>"u"||!window.location?void 0:`${window.location.origin&&window.location.origin!=="null"?window.location.origin:`${window.location.protocol||"https:"}//${window.location.hostname||"localhost"}`}${window.location.pathname||"/"}`,ur="ergogen:consent:sendUsageMetrics",ai="ergogen:config:sendUsageMetrics",li="ergogen:settings";let ht;const co=e=>{const n=localStorage.getItem(e);if(n!==null)try{const r=JSON.parse(n);return typeof r=="boolean"?r:void 0}catch{return}},ci=()=>{const e=localStorage.getItem(li);if(e!==null)try{const n=JSON.parse(e);return n&&typeof n=="object"&&typeof n.sendUsageMetrics=="boolean"?n.sendUsageMetrics:void 0}catch{return}},_t=()=>{if(typeof window>"u")return!1;if(ht!==void 0)return ht;try{const e=co(ur);if(e!==void 0)return e;if(co(ai)===!1||ci()===!1)return!1}catch{return!1}return!lr()},di=e=>{try{localStorage.setItem(ur,JSON.stringify(e)),ht=void 0}catch{ht=e}};let Ve=!1;const pr=()=>{var s;if(typeof window>"u")return;const e=_t(),n="G-46F2L343EK",r=cr(n),o=document.getElementById("gtag-script");if(o||(Ve=!1),e&&n&&!r){delete window["ga-disable-"+n];const a=window,l={send_page_view:!1,allow_google_signals:!1,allow_ad_personalization_signals:!1},c=()=>{var h;return(h=a.gtag)==null?void 0:h.call(a,"set",{page_location:dr()})};if(o)Ve&&(c(),(s=a.gtag)==null||s.call(a,"config",n,l),Ve=!1);else{const h=document.createElement("script");h.async=!0,h.src=`https://www.googletagmanager.com/gtag/js?id=${n}`,h.id="gtag-script",document.head.appendChild(h);const d=a.dataLayer||[];a.dataLayer=d,a.gtag=function(){d.push(arguments)},a.gtag("js",new Date),c(),a.gtag("config",n,l),Ve=!1}wi()}else window["ga-disable-"+n]=!0,o&&(Ve=!0),ii(),si(),xi()},ui=new Set(["yaml","yml","json","zip","ekb"]),pi=e=>{const n=e.lastIndexOf("."),r=n>=0?e.slice(n+1).toLowerCase():"";return ui.has(r)?r:"other"},fr=100,fi=/"[^"\n]*"|'[^'\n]*'|`[^`\n]*`/g,hi=/^at\s|^[^\s@]*@\S+:\d+:\d+$/,gi=e=>e.split(`
`)[0].replace(fi,n=>`${n[0]}*${n[0]}`).trim().slice(0,fr),mi=e=>{const n=e.split(`
`).map(r=>r.trim()).filter(r=>hi.test(r));return n.length>0?n.join(" ").slice(0,fr):void 0},bi=e=>{const n={...e};for(const r of["error_message","description"]){const o=n[r];typeof o=="string"&&(n[r]=gi(o))}return typeof n.error_stack=="string"&&(n.error_stack=mi(n.error_stack)),n},O=(e,n)=>{if(_t()&&!cr("G-46F2L343EK")&&window.gtag){const o=dr();window.gtag("set",{page_location:o}),window.gtag("event",e,{page_location:o,gui_version:kt.version,ergogen_version:gn("github:ceoloide/ergogen#v4.3.0"),is_pwa:lr(),...bi(n??{})})}},gt=(e,n,r,o="UNCLASSIFIED")=>{const s=e instanceof Error?e.message:e,a=e instanceof Error?e.stack:void 0,l=e instanceof Qr?e.code:o;console.error(oi(l,r,s)),O("exception",{description:`[${r}] ${s}`,fatal:n,error_stack:a,error_code:l,error_kind:fn[l].kind,error_location:r})};let mt=!1;const hr=e=>{gt(e.error||e.message,!1,"unhandled_error")},gr=e=>{gt(e.reason||"Unhandled Promise Rejection",!1,"unhandled_rejection")},wi=()=>{typeof window>"u"||mt||(window.addEventListener("error",hr),window.addEventListener("unhandledrejection",gr),mt=!0)},xi=()=>{typeof window>"u"||mt&&(window.removeEventListener("error",hr),window.removeEventListener("unhandledrejection",gr),mt=!1)};function yi(e){function n(d,g){return d>>>g|d<<32-g}const r=[],o=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],s=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],a=unescape(encodeURIComponent(e));for(let d=0;d<a.length;d++){const g=a.charCodeAt(d);r[d>>2]|=g<<24-d%4*8}const l=a.length;r[l>>2]|=128<<24-l%4*8;const c=(l+8>>6)+1;r[c*16-1]=l*8;for(let d=0;d<c;d++){const g=[];for(let L=0;L<16;L++)g[L]=r[d*16+L]||0;for(let L=16;L<64;L++){const N=n(g[L-15],7)^n(g[L-15],18)^g[L-15]>>>3,I=n(g[L-2],17)^n(g[L-2],19)^g[L-2]>>>10;g[L]=g[L-16]+N+g[L-7]+I|0}let m=o[0],b=o[1],v=o[2],x=o[3],f=o[4],_=o[5],j=o[6],E=o[7];for(let L=0;L<64;L++){const N=n(f,6)^n(f,11)^n(f,25),I=f&_^~f&j,M=E+N+I+s[L]+g[L]|0,P=n(m,2)^n(m,13)^n(m,22),z=m&b^m&v^b&v,A=P+z|0;E=j,j=_,_=f,f=x+M|0,x=v,v=b,b=m,m=M+A|0}o[0]=o[0]+m|0,o[1]=o[1]+b|0,o[2]=o[2]+v|0,o[3]=o[3]+x|0,o[4]=o[4]+f|0,o[5]=o[5]+_|0,o[6]=o[6]+j|0,o[7]=o[7]+E|0}let h="";for(let d=0;d<8;d++){const g=o[d];h+=(g>>>24&255).toString(16).padStart(2,"0"),h+=(g>>>16&255).toString(16).padStart(2,"0"),h+=(g>>>8&255).toString(16).padStart(2,"0"),h+=(g&255).toString(16).padStart(2,"0")}return h}function Xt(e,n){if(!e||typeof e!="object")return!1;const r=e;for(const o of n)if(r[o]===!0)return!0;for(const o of Object.keys(r))if(Xt(r[o],n))return!0;return!1}const Lt=e=>Math.round((e+Number.EPSILON)*100)/100,uo=e=>{if(!e||typeof e!="object")return;const n=e.meta;if(!n||typeof n!="object")return;const r=n.zone;if(r){if(typeof r=="object"&&r!==null)return r.name;if(typeof r=="string")return r}};function ki(e,n,r,o){const s=fe.load(e)||{},a=fe.load(n)||{},l=s.outlines||{},c=Object.keys(l),h=c.filter(Q=>!Q.startsWith("_")).length,d=c.length,g=Object.keys(s.pcbs||{}).length,m=Object.keys(s.cases||{}).length,b=Xt(s.pcbs,["reversible","reverse"]),v=Xt(s.points,["mirror"]),x=s.meta||{},f=x.name??"no_name",_=x.author??"no_author",j=s.points||{},E=Object.keys(j.zones||{}).length,L=j.zones||{},I=Object.keys(L).filter(Q=>{const T=L[Q];return T&&typeof T=="object"&&("columns"in T||"rows"in T)}),M=I.length,P=M>0;let z="",A="",w="",$=0;const C=Object.keys(a);if(P){const Q=[...I].sort(),T=[],U=[],G=[];for(const ee of Q){const V=L[ee],y=Object.keys((V==null?void 0:V.columns)||{}),K=Object.keys((V==null?void 0:V.rows)||{}),q=(V==null?void 0:V.mirror)===!0||typeof(V==null?void 0:V.mirror)=="object"&&(V==null?void 0:V.mirror)!==null,te=j.mirror===!0||typeof j.mirror=="object"&&j.mirror!==null,J=q||te;let ie=C.filter(Fe=>{const he=a[Fe];if(uo(he)!==ee)return!1;if(he&&typeof he=="object"){const ge=he.meta;if(ge&&typeof ge=="object"&&ge.mirrored===!0)return!1}return!Fe.startsWith("mirror_")}).length;J&&(ie*=2),T.push(y.length),U.push(K.length),G.push(ie),$+=ie}z=T.join(","),A=U.join(","),w=G.join(",")}const W=C.map(Q=>{const T=a[Q],U=uo(T),ee=(U?I.includes(U):!1)?"K":"A",V=Lt((T==null?void 0:T.x)??0),y=Lt((T==null?void 0:T.y)??0),K=Lt((T==null?void 0:T.r)??0);return{name:Q,type:ee,x:V,y,r:K}});W.sort((Q,T)=>Q.x!==T.x?Q.x-T.x:Q.y!==T.y?Q.y-T.y:Q.r!==T.r?Q.r-T.r:Q.name.localeCompare(T.name));const F=W.map(Q=>`${Q.type}${Q.x.toString()};${Q.y.toString()};${Q.r.toString()}`).join("|"),D=`${f}|${_}|${F}`,H=yi(D).substring(0,12),Z=!v&&b?$*2:$;return{total_generation_time_ms:r,count_outlines:h,count_raw_outlines:d,count_pcbs:g,count_cases:m,is_reversible:b,is_mirrored:v,count_zones:E,matrix_zones:M,has_matrix:P,matrix_col_counts:z,matrix_row_counts:A,matrix_key_counts:w,matrix_keys:$,keyboard_keys:Z,config_id:H,previous_config_id:o}}const Oe=e=>Array.isArray(e)&&e.length===3&&typeof e[0]=="string"&&typeof e[1]=="string"&&typeof e[2]=="string",mr=(e,n,r)=>!r||r.length===0?{hasConflict:!1}:r.some(s=>Oe(s)&&s[0]===e&&s[1]===n)?{hasConflict:!0,conflictingName:n}:{hasConflict:!1},_i=(e,n)=>{if(!n||n.length===0)return[];const r=[];for(const o of e){if(!Oe(o))continue;const[s,a]=o,l=mr(s,a,n);l.hasConflict&&r.push({injection:o,conflict:l})}return r},br=(e,n,r)=>{if(!r||r.length===0)return n;const o=new Set(r.filter(l=>Oe(l)&&l[0]===e).map(l=>l[1]));let s=1,a=`${n}_${s}`;for(;o.has(a);)s++,a=`${n}_${s}`;return a},zt=(e,n,r)=>{const o=n?[...n]:[];for(const s of e){if(!Oe(s)){console.warn("[mergeInjectionArraysWithResolution] Skipping invalid injection format:",s);continue}const[a,l,c]=s;if(!mr(a,l,o).hasConflict)o.push([a,l,c]);else{if(r==="skip")continue;if(r==="overwrite"){const d=o.findIndex(g=>Oe(g)&&g[0]===a&&g[1]===l);d!==-1&&(o[d]=[a,l,c])}else if(r==="keep-both"){const d=br(a,l,o);o.push([a,d,c])}}}return o},vt=e=>{const[n,r]=p.useState([]),o=n.length>0?n[0]:null,[s,a]=p.useState(null),[l,c]=p.useState(null),[h,d]=p.useState(null),g=p.useCallback(async(x,f,_=null,j)=>{var P,z,A;const E=j||e.getCurrentInjections();if(x.length===0){e.setInjectionInput(E),e.setConfigInput(f),await e.generateNow(f,E,{pointsonly:!1}),await((P=e.onComplete)==null?void 0:P.call(e,f,E));return}const L=x.filter(w=>Oe(w)?!0:(console.warn("[useInjectionConflictResolution] Skipping invalid injection format:",w),!1));if(L.length===0){e.setInjectionInput(E),e.setConfigInput(f),await e.generateNow(f,E,{pointsonly:!1}),await((z=e.onComplete)==null?void 0:z.call(e,f,E));return}const N=_i(L,E);if(N.length>0&&!_){const w=N.map($=>({injection:$.injection,conflict:$.conflict}));O("conflict_encountered",{conflict_count:N.length}),r(w),a(L),c(f),d(E);return}const M=zt(L,E,_||"skip");e.setInjectionInput(M),e.setConfigInput(f),await e.generateNow(f,M,{pointsonly:!1}),await((A=e.onComplete)==null?void 0:A.call(e,f,M))},[e]),m=p.useCallback(async(x,f)=>{var _,j;if(!(!s||!l||n.length===0))if(f){O("conflict_resolved",{strategy:x,apply_to_all:!0,remaining_count:n.length});const E=zt(s,h||e.getCurrentInjections(),x);e.setInjectionInput(E),e.setConfigInput(l),await e.generateNow(l,E,{pointsonly:!1}),await((_=e.onComplete)==null?void 0:_.call(e,l,E)),r([]),a(null),c(null),d(null)}else{O("conflict_resolved",{strategy:x,apply_to_all:!1,remaining_count:n.length});const E=n[0],[L,N]=E.injection,I=E.injection,M=n.slice(1);r(M);let P=[...h||e.getCurrentInjections()],z=[...s||[]];if(x==="overwrite")P=P.filter(A=>!(A[0]===L&&A[1]===N));else if(x==="skip")z=z.filter(A=>!(A[0]===L&&A[1]===N&&A[2]===I[2]));else if(x==="keep-both"){const A=br(L,N,P),w=[L,A,I[2]];P=[...P,w],z=z.filter($=>!($[0]===L&&$[1]===N&&$[2]===I[2]))}if(d(P),a(z),M.length===0){const A=zt(z,P,"skip");e.setInjectionInput(A),e.setConfigInput(l),await e.generateNow(l,A,{pointsonly:!1}),await((j=e.onComplete)==null?void 0:j.call(e,l,A)),a(null),c(null),d(null)}}},[s,l,h,n,e]),b=p.useCallback(()=>{var x;O("conflict_cancelled",{remaining_count:n.length}),r([]),a(null),c(null),d(null),(x=e.setError)==null||x.call(e,"Loading cancelled by user")},[e,n.length]);return{currentConflict:p.useMemo(()=>o?{name:o.injection[1],type:o.injection[0]}:null,[o]),processInjectionsWithConflictResolution:g,handleConflictResolution:m,handleConflictCancel:b}},vi={templates:"4.3.0",outlines:"4.3.0"},Xe=()=>Je.version,po=e=>{const n=e.split("-")[0].replace(/^v/,"").split(".");for(;n.length<3;)n.push("0");return n.length>3||!n.every(r=>/^\d+$/.test(r))?null:[Number(n[0]),Number(n[1]),Number(n[2])]},ji=(e,n)=>{const r=po(e),o=po(n);if(!r||!o)return!1;const[s,a,l]=r,[c,h,d]=o;return s===c&&(a>h||a===h&&l>=d)},$i=(e,n)=>{const r=We(n),o=We(vi[e]);return r!==null&&o!==null?Yt(r,o):!1},Ci=()=>({templates:"",outlines:""}),ce=e=>{if(typeof window<"u"&&window.location)try{const o=new URLSearchParams(window.location.search).get(`ff_${e}`);if(o==="true")return!0;if(o==="false")return!1}catch(r){console.warn("[FeatureFlags] Failed to check URL query parameters:",r)}const n=Ci()[e];return n==="true"?!0:n==="false"?!1:$i(e,Xe())},Si=50*1024*1024,Ei=10*1024*1024,Rt=(e,n)=>{const r=`${n}/`;let o=e;return o.startsWith(r)&&(o=o.substring(r.length)),o=o.replace(/\.js$/,""),o},Pi=e=>{let n=e.file("config.yaml")||e.file("config.yml");if(!n){const r=e.file(/^config\.(yaml|yml)$/i);r&&r.length>0&&(n=r[0])}if(!n)throw new Error("The archive is missing a config.yaml file in the root directory.");return n},Zt=(e,n)=>{if(n&&e>Si)throw new Error(`File exceeds the maximum size limit of 50MB for archives (current size: ${(e/(1024*1024)).toFixed(1)}MB).`);if(!n&&e>Ei)throw new Error(`File exceeds the maximum size limit of 10MB for text files (current size: ${(e/(1024*1024)).toFixed(1)}MB).`)},wr=(e,n,r)=>{const o=[];return e.forEach(s=>o.push(["footprint",s.name,s.content])),n.forEach(s=>o.push(["outline",s.name,s.content])),r.forEach(s=>o.push(["template",s.name,s.content])),o},Ii=async e=>{let n;try{n=await un.loadAsync(e)}catch{throw new Error("The file appears to be corrupted. Please verify the file and try again.")}const o=await Pi(n).async("string"),s=[],a=[];return n.forEach((l,c)=>{if(!(c.dir||!l.endsWith(".js"))){if(l.startsWith("footprints/")){const h=c.async("string").then(d=>{const g=Rt(l,"footprints");s.push({type:"footprint",name:g,content:d})});a.push(h)}else if(l.startsWith("outlines/")&&ce("outlines")){const h=c.async("string").then(d=>{const g=Rt(l,"outlines");s.push({type:"outline",name:g,content:d})});a.push(h)}else if(l.startsWith("templates/")&&ce("templates")){const h=c.async("string").then(d=>{const g=Rt(l,"templates");s.push({type:"template",name:g,content:d})});a.push(h)}}}),await Promise.all(a),{config:o,injections:s}},Li=40,zi=3;class be extends Error{constructor(n){super(n),this.name="RateLimitError"}}class Ri{constructor(){ot(this,"providers",[])}register(n){this.providers.push(n)}resolve(n){const r=n.trim();for(const o of this.providers)if(o.canHandle(r))return o;return/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(r)&&this.providers[0]||null}}const Ze=new Ri,Di=e=>{const n=[],r=e.split(`
`);let o={};for(const s of r){const a=s.trim();if(a.startsWith("[submodule"))o.path&&o.url&&n.push({path:o.path,url:o.url}),o={};else{const l=a.indexOf("=");if(l!==-1){const c=a.substring(0,l).trim(),h=a.substring(l+1).trim();c==="path"?o.path=h:c==="url"&&(o.url=h)}}}return o.path&&o.url&&n.push({path:o.path,url:o.url}),n};class Qe{async fetchConfig(n){console.log(`[GitHub] Starting fetch from URL: ${n}`);const r=this.parseUrl(n),{owner:o,repo:s,branch:a,filePath:l,isRepoRoot:c}=r,h=r.host,d=[],g=[],m=[],b=async(x,f,_,j,E)=>{console.log("[GitHub] Checking for .gitmodules file");try{const L=await this.fetchFileContent(o,s,".gitmodules",f,h);console.log("[GitHub] .gitmodules found, parsing submodules");const N=Di(L);for(const I of N)if(I.path.includes(_)||I.path.includes(j)&&ce("outlines")||I.path.includes(E)&&ce("templates")){const M=I.path.includes(j),P=I.path.includes(E),z=M?j:P?E:_,A=M?g:P?m:d,w=I.path.substring(I.path.indexOf(z)+z.length+1),$=Ze.resolve(I.url);if($ instanceof Qe){const C=$.parseUrl(I.url),W=C.host;let F=[];try{F=await $.fetchFootprintsFromDirectory(C.owner,C.repo,"","main",[".js"],W)}catch(B){if(B instanceof be)throw B;try{F=await $.fetchFootprintsFromDirectory(C.owner,C.repo,"","master",[".js"],W)}catch(H){if(H instanceof be)throw H;console.warn(`Failed to fetch submodule footprints from ${I.url}`)}}const D=F.map(B=>({name:w?`${w}/${B.name}`:B.name,content:B.content}));A.push(...D)}}}catch(L){if(L instanceof be)throw L}};if(!c){if(!l)throw new Error("Invalid URL. File path not specified.");const x=await this.fetchFileContent(o,s,l,a,h);Zt(x.length,!1);const f=l.split("/").pop()||"";if(!(f==="config.yaml"||f==="config.yml"))return{config:x,footprints:[],outlines:[],templates:[],configPath:f};const j=l.substring(0,l.lastIndexOf("/")),E=j?`${j}/footprints`:"footprints",L=j?`${j}/outlines`:"outlines",N=j?`${j}/templates`:"templates";try{const I=await this.fetchFootprintsFromDirectory(o,s,E,a,[".js"],h);d.push(...I)}catch(I){if(I instanceof be)throw I}if(ce("outlines"))try{const I=await this.fetchFootprintsFromDirectory(o,s,L,a,[".js",".svg"],h);g.push(...I)}catch(I){if(I instanceof be)throw I}if(ce("templates"))try{const I=await this.fetchFootprintsFromDirectory(o,s,N,a,[".js"],h);m.push(...I)}catch(I){if(I instanceof be)throw I}return await b(j,a,E,L,N),{config:x,footprints:d,outlines:g,templates:m,configPath:f}}const v=async x=>{var I,M,P,z,A,w,$,C,W,F,D,B;let f="",_="",j=!0;try{f=await this.fetchFileContent(o,s,"config.yaml",x,h),_=""}catch(H){const Z=H;if((I=Z.message)!=null&&I.includes("allowance")||(M=Z.message)!=null&&M.includes("limit exceeded")||(P=Z.message)!=null&&P.includes("rate limit"))throw Z;try{f=await this.fetchFileContent(o,s,"config.yml",x,h),_=""}catch(Q){const T=Q;if((z=T.message)!=null&&z.includes("allowance")||(A=T.message)!=null&&A.includes("limit exceeded")||(w=T.message)!=null&&w.includes("rate limit"))throw T;try{f=await this.fetchFileContent(o,s,"ergogen/config.yaml",x,h),_="ergogen"}catch(U){const G=U;if(($=G.message)!=null&&$.includes("allowance")||(C=G.message)!=null&&C.includes("limit exceeded")||(W=G.message)!=null&&W.includes("rate limit"))throw G;try{f=await this.fetchFileContent(o,s,"ergogen/config.yml",x,h),_="ergogen"}catch(ee){const V=ee;if((F=V.message)!=null&&F.includes("allowance")||(D=V.message)!=null&&D.includes("limit exceeded")||(B=V.message)!=null&&B.includes("rate limit"))throw V;const{configYamls:y,anyYamls:K}=await this.bfsForYamlFiles(o,s,x,h);if(y.length>0){const q=y[0];f=await this.fetchFileContent(o,s,q,x,h),_=q.includes("/")?q.substring(0,q.lastIndexOf("/")):""}else if(K.length>0){const q=K[0];f=await this.fetchFileContent(o,s,q,x,h),_=q.includes("/")?q.substring(0,q.lastIndexOf("/")):"",j=!1}else throw new Error("No YAML configuration files found in repository")}}}}if(Zt(f.length,!1),!j)return{config:f,footprints:[],outlines:[],templates:[],configPath:_};const E=_?`${_}/footprints`:"footprints",L=_?`${_}/outlines`:"outlines",N=_?`${_}/templates`:"templates";try{const H=await this.fetchFootprintsFromDirectory(o,s,E,x,[".js"]);d.push(...H)}catch(H){if(H instanceof be)throw H}if(ce("outlines"))try{const H=await this.fetchFootprintsFromDirectory(o,s,L,x,[".js",".svg"]);g.push(...H)}catch(H){if(H instanceof be)throw H}if(ce("templates"))try{const H=await this.fetchFootprintsFromDirectory(o,s,N,x,[".js"]);m.push(...H)}catch(H){if(H instanceof be)throw H}return await b(_,x,E,L,N),{config:f,footprints:d,outlines:g,templates:m,configPath:_}};if(a!=="main")return await v(a);try{return await v("main")}catch(x){if(x instanceof be)throw x;return await v("master")}}async fetchFootprintsFromDirectory(n,r,o,s,a,l){const c=[],h=async d=>{try{const g=await this.listDirectory(n,r,d,s,l);for(const m of g){const b=m.path.startsWith(d)?m.path:d?`${d}/${m.path}`:m.path;if(m.type==="file"){if(a.some(x=>m.name.endsWith(x)))try{const x=await this.fetchFileContent(n,r,b,s,l),f=o?b.slice(o.length+1).replace(/\.[^/.]+$/,""):b.replace(/\.[^/.]+$/,"");console.log(`[GitHub] Loaded footprint: ${f}`),c.push({name:f,content:x})}catch(x){if(x instanceof be)throw x;const f=x;console.warn(`Failed to fetch file content: ${b}`,f.stack||f)}}else m.type==="dir"&&await h(b)}}catch(g){if(g instanceof be)throw g}};return await h(o),c}async bfsForYamlFiles(n,r,o,s){var g,m,b;const a=[],l=[],c=[{path:"",depth:0}],h=new Set;let d=0;for(;c.length>0&&d<Li;){const{path:v,depth:x}=c.shift();if(!h.has(v)){h.add(v);try{d++;const f=await this.listDirectory(n,r,v,o,s);for(const _ of f)if(_.type==="file"){const j=_.name.toLowerCase();(j.endsWith(".yaml")||j.endsWith(".yml"))&&!j.startsWith(".")&&j.replace(/\.(yaml|yml)$/,"")!=="metadata"&&j.replace(/\.(yaml|yml)$/,"")!=="virtual_env"&&(_.name==="config.yaml"||_.name==="config.yml"?a.push(_.path):l.push(_.path))}else _.type==="dir"&&x<zi&&(_.name.startsWith(".")||c.push({path:_.path,depth:x+1}));if(a.length>0||l.length>0&&(c.length===0||c[0].depth>x))break}catch(f){const _=f;if((g=_.message)!=null&&g.includes("allowance")||(m=_.message)!=null&&m.includes("limit exceeded")||(b=_.message)!=null&&b.includes("rate limit"))throw _;continue}}}return{configYamls:a,anyYamls:l}}}const Ai=(e,n)=>{var c,h,d,g;if(!e)return{isLimitExceeded:!1,error:null};if(n.includes("raw.githubusercontent.com"))return e.status===429?(console.warn("[GitHub] Raw content rate limit exceeded (429). Please wait 30 minutes and try again."),{isLimitExceeded:!0,error:"You've reached your hourly request allowance for loading content from GitHub. Please wait 30 minutes and try again."}):{isLimitExceeded:!1,error:null};const o=((c=e.headers)==null?void 0:c.get("X-RateLimit-Limit"))||"unknown",s=((h=e.headers)==null?void 0:h.get("X-RateLimit-Remaining"))||"unknown",a=((d=e.headers)==null?void 0:d.get("X-RateLimit-Used"))||"unknown",l=((g=e.headers)==null?void 0:g.get("X-RateLimit-Reset"))||"unknown";if(console.log(`[GitHub Rate Limit] Limit: ${o}, Remaining: ${s}, Used: ${a}, Reset: ${l}`),e.status===403&&s==="0")return console.warn("[GitHub] Rate limit exceeded. Please wait and try again in about an hour."),{isLimitExceeded:!0,error:"Cannot load from GitHub right now. You've used your hourly request allowance. Please wait about an hour and try again."};if(s!=="unknown"&&o!=="unknown"){const m=parseInt(o),b=parseInt(s),v=(m-b)/m*100;if(v>=80&&b>0)return console.warn(`[GitHub] Approaching rate limit: ${v.toFixed(1)}% used`),{isLimitExceeded:!1,error:"Loading from GitHub may become unavailable soon. You've used most of your hourly request allowance. This will reset within an hour."}}return{isLimitExceeded:!1,error:null}};class Ni extends Qe{constructor(){super(...arguments);ot(this,"rateLimitWarning",null)}canHandle(r){const o=r.trim();return o.includes("github.com")||/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(o)}parseUrl(r){const o=r.trim();let s="",a="",l="main",c,h=!0;const d=!o.includes("github.com");if(d){const g=o.split("/").filter(Boolean);if(g.length<2)throw new Error("Invalid GitHub repository format. Must contain owner and repository.");s=g[0],a=g[1],h=g.length===2||g.length===4&&g[2]==="tree",h?g.length===4&&(l=g[3]):g[2]==="blob"||g[2]==="tree"?(l=g[3],c=g.slice(4).join("/")):c=g.slice(2).join("/")}else{let g=o;g.match(/^(https?:\/\/)/i)||(g=`https://${g}`);const m=g.endsWith("/")?g.slice(0,-1):g,v=new URL(m).pathname.split("/").filter(Boolean);if(v.length<2)throw new Error("Invalid GitHub URL. Must contain owner and repository.");s=v[0],a=v[1],h=v.length===2||v.length===4&&v[2]==="tree",h?v.length===4&&(l=v[3]):v[2]==="blob"||v[2]==="tree"?(l=v[3],c=v.slice(4).join("/")):c=v.slice(2).join("/")}return a.endsWith(".git")&&(a=a.slice(0,-4)),{owner:s,repo:a,branch:l,filePath:c,isRepoRoot:h,baseUrl:d?`https://github.com/${s}/${a}`:o}}async fetchFileContent(r,o,s,a){const l=`https://raw.githubusercontent.com/${r}/${o}/${a}/${s}`,c=await fetch(l);if(this.checkRateLimits(c,l),!c.ok)throw new Error(`Failed to fetch file content from GitHub: ${c.status}`);return await c.text()}async listDirectory(r,o,s,a){const l=`https://api.github.com/repos/${r}/${o}/contents/${s}?ref=${a}`,c=await fetch(l);if(this.checkRateLimits(c,l),!c.ok)throw new Error(`Failed to list directory from GitHub: ${c.status}`);const h=await c.json();let d=[];if(Array.isArray(h))d=h;else if(h&&typeof h=="object"&&"tree"in h&&Array.isArray(h.tree))d=h.tree;else throw new Error("Target path is not a directory");return d.map(g=>({name:g.name||g.path.split("/").pop()||"",path:g.path,type:g.type==="tree"?"dir":g.type==="blob"?"file":g.type}))}checkRateLimits(r,o){const s=Ai(r,o);if(s.error&&!this.rateLimitWarning&&(this.rateLimitWarning=s.error),s.isLimitExceeded)throw new be(s.error||"Rate limit exceeded")}async fetchConfig(r){this.rateLimitWarning=null;const o=await super.fetchConfig(r);return this.rateLimitWarning&&(o.rateLimitWarning=this.rateLimitWarning),o}}Ze.register(new Ni);const xr=async e=>{const n=Ze.resolve(e);if(!n)throw new Error(`Unsupported repository provider URL: ${e}`);return n.fetchConfig(e)};class Ui extends Qe{canHandle(n){return n.includes("codeberg.org")}parseUrl(n){const r=n.trim();let o="",s="",a="main",l,c=!0;const h=!r.includes("codeberg.org");if(h){const d=r.split("/").filter(Boolean);if(d.length<2)throw new Error("Invalid Codeberg repository format. Must contain owner and repository.");o=d[0],s=d[1],c=d.length===2||d.length===5&&d[2]==="src"&&(d[3]==="branch"||d[3]==="commit"),c?d.length===5&&(a=d[4]):d.length>=5&&d[2]==="src"&&(d[3]==="branch"||d[3]==="commit")?(a=d[4],l=d.slice(5).join("/")):l=d.slice(2).join("/")}else{let d=r;d.match(/^(https?:\/\/)/i)||(d=`https://${d}`);const g=d.endsWith("/")?d.slice(0,-1):d,b=new URL(g).pathname.split("/").filter(Boolean);if(b.length<2)throw new Error("Invalid Codeberg URL. Must contain owner and repository name.");o=b[0],s=b[1],c=b.length===2||b.length===5&&b[2]==="src"&&(b[3]==="branch"||b[3]==="commit"),c?b.length===5&&(a=b[4]):b.length>=5&&b[2]==="src"&&(b[3]==="branch"||b[3]==="commit")?(a=b[4],l=b.slice(5).join("/")):l=b.slice(2).join("/")}return s.endsWith(".git")&&(s=s.slice(0,-4)),{owner:o,repo:s,branch:a,filePath:l,isRepoRoot:c,baseUrl:h?`https://codeberg.org/${o}/${s}`:r}}async fetchFileContent(n,r,o,s){const a=`https://codeberg.org/api/v1/repos/${n}/${r}/raw/${o}?ref=${s}`,l=await fetch(a);if(!l.ok)throw new Error(`Failed to fetch file content from Codeberg API: ${l.status}`);return await l.text()}async listDirectory(n,r,o,s){const a=o?`/${o}`:"",l=`https://codeberg.org/api/v1/repos/${n}/${r}/contents${a}?ref=${s}`,c=await fetch(l);if(!c.ok)throw new Error(`Failed to list directory from Codeberg API: ${c.status}`);const h=await c.json();if(!Array.isArray(h))throw new Error("Target path is not a directory");return h.map(d=>({name:d.name,path:d.path||d.name,type:d.type}))}}Ze.register(new Ui);class Wi extends Qe{canHandle(n){const r=n.trim();return r.match(/^(https?:\/\/)/i)?!r.includes("github.com")&&!r.includes("codeberg.org"):!1}parseUrl(n){const r=n.trim();let o="",s="",a="main",l,c=!0,h=r;h.match(/^(https?:\/\/)/i)||(h=`https://${h}`);const d=h.endsWith("/")?h.slice(0,-1):h,g=new URL(d),m=g.origin,b=g.pathname.split("/").filter(Boolean);if(b.length<2)throw new Error("Invalid Forgejo/Gitea URL. Must contain owner and repository name.");return o=b[0],s=b[1],c=b.length===2||b.length===5&&b[2]==="src"&&(b[3]==="branch"||b[3]==="commit"),c?b.length===5&&(a=b[4]):b.length>=5&&b[2]==="src"&&(b[3]==="branch"||b[3]==="commit")?(a=b[4],l=b.slice(5).join("/")):l=b.slice(2).join("/"),s.endsWith(".git")&&(s=s.slice(0,-4)),{owner:o,repo:s,branch:a,filePath:l,isRepoRoot:c,baseUrl:r,host:m}}async fetchFileContent(n,r,o,s,a){const c=`${a||"https://codeberg.org"}/api/v1/repos/${n}/${r}/raw/${o}?ref=${s}`,h=await fetch(c);if(!h.ok)throw new Error(`Failed to fetch file content from Gitea/Forgejo API: ${h.status}`);return await h.text()}async listDirectory(n,r,o,s,a){const l=a||"https://codeberg.org",c=o?`/${o}`:"",h=`${l}/api/v1/repos/${n}/${r}/contents${c}?ref=${s}`,d=await fetch(h);if(!d.ok)throw new Error(`Failed to list directory from Gitea/Forgejo API: ${d.status}`);const g=await d.json();if(!Array.isArray(g))throw new Error("Target path is not a directory");return g.map(m=>({name:m.name,path:m.path||m.name,type:m.type}))}}const Oi=new Wi;Ze.register(Oi);const Fi=({processInjectionsWithConflictResolution:e,setError:n})=>{const[r,o]=p.useState(!1),s=p.useRef(!1);return p.useEffect(()=>{const a=async()=>{const l=new URLSearchParams(window.location.search),c=l.get("github"),h=l.get("codeberg"),d=l.get("forgejo"),g=l.get("gitea");let m=c||h||d||g;if(m){h&&!h.includes("codeberg.org")?m=`https://codeberg.org/${h}`:c&&!c.includes("github.com")&&(m=`https://github.com/${c}`),o(!0),console.log("[useConfigLoader] Loading from URL parameter:",m);try{const b=await xr(m);console.log("[useConfigLoader] Fetch result:",{configLength:b.config.length,footprintsCount:b.footprints.length,outlinesCount:b.outlines.length,configPath:b.configPath,rateLimitWarning:b.rateLimitWarning}),b.rateLimitWarning&&n(b.rateLimitWarning);const v=wr(b.footprints,b.outlines,b.templates);await e(v,b.config)}catch(b){console.error("[useConfigLoader] Failed to load from remote repository:",b),n(`Failed to load from remote repository: ${b instanceof Error?b.message:String(b)}`)}finally{o(!1)}}};s.current||(s.current=!0,a())},[e,n]),{isLoading:r}},fo="background-preview-",Mi=()=>({version:0,active:null,settledVersion:null,settledRequestKey:null}),Bi=e=>!e||!e.startsWith(fo)?null:e.slice(fo.length),Ti=(e,n,r,o)=>JSON.stringify([e,n,r,o]),Gi=(e,n,r)=>{var s;return r?(((s=e.active)==null?void 0:s.requestKey)??e.settledRequestKey)===n:!1},Hi=(e,n)=>{e.version+=1;const o={requestId:`${n.isManual?"ergogen-manual":"ergogen-generate"}-${e.version}-${n.now??Date.now()}`,version:e.version,targetConfigId:n.targetConfigId,requestKey:n.requestKey,isManual:n.isManual};return e.active=o,e.settledVersion=null,e.settledRequestKey=null,o},Vi=(e,n)=>{const r=Bi(n.requestId);if(r!==null)return{kind:"background-preview",configId:r};if(!e.active||n.requestId!==e.active.requestId)return{kind:"stale"};const o=e.active;return e.active=null,n.type==="error"?(e.settledVersion=null,e.settledRequestKey=null,{kind:"active-error",isManual:o.isManual}):n.type==="success"?(e.settledVersion=o.version,e.settledRequestKey=o.requestKey,{kind:"active-success",version:o.version,targetConfigId:o.targetConfigId,isManual:o.isManual}):(e.settledVersion=null,e.settledRequestKey=null,{kind:"active-unknown",isManual:o.isManual})},Ki=(e,n)=>e.active===null&&e.settledVersion!==null&&n===e.settledVersion,Dt=e=>{e.active=null,e.settledVersion=null,e.settledRequestKey=null},ho=e=>{e.version+=1,e.active=null,e.settledVersion=null,e.settledRequestKey=null},Qt="ergogen:config",bt="ergogen:multi-config",en="LOCAL_STORAGE_CONFIG",go=5e3,yr=e=>!e||!Array.isArray(e)?e:e.filter(n=>{if(!Array.isArray(n)||n.length!==3)return!0;const[r]=n;return!(r==="outline"&&!ce("outlines")||r==="template"&&!ce("templates"))}),qi=e=>{if(!e||!Array.isArray(e))return null;const n=e.some(a=>Array.isArray(a)&&a[0]==="outline"),r=e.some(a=>Array.isArray(a)&&a[0]==="template"),o=n&&!ce("outlines"),s=r&&!ce("templates");if(o||s){const a=[];return o&&a.push("outlines"),s&&a.push("templates"),`Custom ${a.join(" and ")} were skipped because the respective feature flags are disabled in settings.`}return null},Ji=e=>{if(!e||typeof e!="object")return null;const n=e;if(!n.pcbs||typeof n.pcbs!="object")return null;const r=n.pcbs;for(const o of Object.values(r))if(o&&typeof o=="object"&&(!o.template||o.template==="kicad5")){const s=o.footprints;if(s&&typeof s=="object"){for(const a of Object.values(s))if(a&&typeof a=="object"&&typeof a.what=="string"&&a.what.startsWith("ceoloide"))return'KiCad 5 is deprecated. Please add "template: kicad8" to your PCB definitions to avoid errors when opening PCB files with KiCad 8 or newer.'}}return null},Yi=(e,n)=>{if(e&&typeof e=="object"){const r=e;return r.points&&n?{...r,pcbs:void 0,cases:void 0}:r}return e},tn=e=>{var n;return((n=e==null?void 0:e.getRealtimeConfigInput)==null?void 0:n.call(e))??(e==null?void 0:e.configInput)??""},mo="Legacy Config",Xi="Legacy Config (older)",At=()=>({version:2,activeConfigId:null,configs:[]}),Zi=(e,n)=>{if(!e)return{container:At()};try{const r=JSON.parse(e);if(r&&typeof r.version=="number"){const o=(r.configs||[]).map(s=>({...s,createdAt:s.createdAt||n,updatedAt:s.updatedAt||n}));return{container:{...r,configs:o}}}}catch(r){return{container:At(),readError:r}}return{container:At()}},bo=e=>{if(e===null)return"";let n;try{n=JSON.parse(e)}catch{return e}return typeof n=="string"?n:e},Nt=e=>e.trim()==="",Qi=(e,n,r)=>{const{container:o,readError:s}=Zi(e.multiConfig,n),a=bo(e.legacyConfig),l=bo(e.singleConfig),c=Nt(l)?a:l;if(Nt(c))return{container:o,stored:e,readError:s};const h={...e,legacyConfig:null,singleConfig:null};if(o.configs.some(v=>v.name===mo))return{container:o,stored:h,readError:s};const d=(v,x)=>({id:r(),name:v,config:x,createdAt:n,updatedAt:n}),g=Nt(a)||a===c?[]:[d(Xi,a)],m=d(mo,c),b={version:2,activeConfigId:m.id,configs:[...o.configs,...g,m]};return{container:b,stored:{...h,multiConfig:JSON.stringify(b)},readError:s}},Ke=(e,n)=>{if(typeof window>"u")return n;try{const r=localStorage.getItem(e);return r!==null?JSON.parse(r):n}catch{return n}},wo=()=>({debug:Ke("ergogen:config:debug",!1),autoGen:Ke("ergogen:config:autoGen",!0),autoGen3D:Ke("ergogen:config:autoGen3D",!0),kicanvasPreview:Ke("ergogen:config:kicanvasPreview",!0),stlPreview:Ke("ergogen:config:stlPreview",!0),sendUsageMetrics:_t()}),kr=p.createContext(null),Ne=()=>typeof window<"u"&&window.crypto&&window.crypto.randomUUID?window.crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,e=>{const n=Math.random()*16|0;return(e==="x"?n:n&3|8).toString(16)}),rt=(e,n)=>{let r=0;for(const o of e){const s=o.name.match(n);if(s){const a=parseInt(s[1],10);!isNaN(a)&&a>r&&(r=a)}}return r+1},wt="ergogen:deleted-config",es=e=>{try{const n=localStorage.getItem(wt),r={version:1,configs:[]};if(n){const s=JSON.parse(n);s&&Array.isArray(s.configs)&&(r.configs=s.configs,s.version!==void 0&&(r.version=s.version))}const o={...e,deletedAt:new Date().toISOString()};r.configs.push(o),localStorage.setItem(wt,JSON.stringify(r))}catch(n){console.error("Failed to save deleted config to storage:",n)}},xo=()=>{try{const e=localStorage.getItem(wt);if(!e)return;const n=JSON.parse(e);if(!n||!Array.isArray(n.configs))return;let r=n.configs;const o=Date.now(),s=90*24*60*60*1e3;r=r.filter(l=>{const c=new Date(l.deletedAt).getTime();return o-c<=s}),r.length>100&&(r.sort((l,c)=>{const h=new Date(l.updatedAt).getTime(),d=new Date(c.updatedAt).getTime();return h-d}),r=r.slice(r.length-100));const a={version:n.version||1,configs:r};localStorage.setItem(wt,JSON.stringify(a))}catch(e){console.error("Failed to prune deleted configs:",e)}},yo=e=>{if(!e)return;let n="";if(typeof e=="string")n=e;else if(Array.isArray(e))n=e.join("");else return;return n=n.replace(/width="[^"]+"/,'width="284px"').replace(/height="[^"]+"/,'height="134px"'),n=n.replace(/<svg/,'<svg style="background-color: rgb(51,51,51);"'),n=n.replaceAll(/stroke="#000"/g,'stroke="#AAA"'),n=n.replaceAll(/stroke:#000/g,"stroke:#AAA"),n},pe=(e,n,r=2)=>{if(typeof window>"u")return;const o={version:r,activeConfigId:n,configs:e};localStorage.setItem(bt,JSON.stringify(o))},ts=()=>{if(typeof window>"u")return{version:2,activeConfigId:null,configs:[]};const e={multiConfig:localStorage.getItem(bt),legacyConfig:localStorage.getItem(en),singleConfig:localStorage.getItem(Qt)},n=Qi(e,new Date().toISOString(),Ne);n.readError&&console.error("Failed to parse multi-config storage:",n.readError);const r=[[bt,"multiConfig"],[en,"legacyConfig"],[Qt,"singleConfig"]];for(const[o,s]of r){const a=n.stored[s];a!==e[s]&&(a===null?localStorage.removeItem(o):localStorage.setItem(o,a))}return n.container},ns=({initialInjectionInput:e,hashError:n,children:r})=>{const[o]=p.useState(()=>{if(typeof window>"u")return!1;const k=localStorage.getItem(en),S=localStorage.getItem(Qt);return!!(k||S)}),[s]=p.useState(()=>{if(typeof window>"u")return 2;const k=localStorage.getItem(bt);if(k)try{const S=JSON.parse(k);if(S&&typeof S.version=="number")return S.version}catch(S){console.warn("Failed to parse loaded version:",S)}return 1}),[a]=p.useState(()=>ts()),[l,c]=p.useState(()=>a.configs),[h,d]=p.useState(()=>a.activeConfigId),[g,m]=p.useState(!1),[b,v]=p.useState(null),[x,f]=p.useState(()=>{if(a.activeConfigId){const k=a.configs.find(S=>S.id===a.activeConfigId);return k?k.config:""}return""}),_=p.useRef(l),j=p.useRef(h),E=p.useRef(g),L=p.useRef(b),N=p.useRef(x);p.useEffect(()=>{_.current=l},[l]),p.useEffect(()=>{j.current=h},[h]),p.useEffect(()=>{E.current=g},[g]),p.useEffect(()=>{L.current=b},[b]),p.useEffect(()=>{N.current=x},[x]);const I=p.useRef(x);p.useEffect(()=>{I.current=x},[x]);const M=p.useCallback(k=>{I.current=k},[]),P=p.useCallback(()=>I.current,[]),z=p.useRef(void 0),A=p.useRef(null),w=p.useRef(null),$=p.useCallback(()=>{w.current&&(clearTimeout(w.current.timeoutId),w.current=null)},[]),C=p.useCallback(()=>{const k=w.current;k&&($(),O(k.name,k.payload))},[$]),W=p.useCallback(()=>{if(C(),A.current){const{timeoutId:k,payload:S,configId:R}=A.current;clearTimeout(k),O("keyboard_generated",S),z.current=R,A.current=null}},[C]),F=p.useCallback(()=>{z.current=void 0,C(),A.current&&(clearTimeout(A.current.timeoutId),A.current=null)},[C]),[D,B]=so("ergogen:injection",e),[H,Z]=p.useState(null),[Q,T]=p.useState(null),[U,G]=p.useState(null),[ee,V]=p.useState(null),[y,K]=p.useState(null),[q,te]=p.useState(0),J=p.useRef(Mi()),se=p.useCallback(()=>{ho(J.current),K(null),ae(!1),ye(!1)},[]),[ie,Fe]=so("ergogen:settings",wo()),he=(ie==null?void 0:ie.debug)??!1,ke=(ie==null?void 0:ie.autoGen)??!0,ge=(ie==null?void 0:ie.autoGen3D)??!0,Me=(ie==null?void 0:ie.kicanvasPreview)??!0,Pe=(ie==null?void 0:ie.stlPreview)??!0,mn=p.useRef(Pe);mn.current=Pe;const[$e,Nr]=p.useState(_t),Ct=p.useRef(ie);Ct.current=ie;const bn=p.useRef(ke);bn.current=ke;const St=p.useRef($e);St.current=$e;const we=p.useCallback(k=>{const S=Ct.current||wo(),R=k(S);Ct.current=R,Fe(R)},[Fe]),wn=p.useCallback(k=>{we(S=>{const R=typeof k=="function"?k(S.debug):k;return{...S,debug:R}})},[we]),xn=p.useCallback(k=>{we(S=>{const R=typeof k=="function"?k(S.autoGen):k;return{...S,autoGen:R}})},[we]),yn=p.useCallback(k=>{we(S=>{const R=typeof k=="function"?k(S.autoGen3D):k;return{...S,autoGen3D:R}})},[we]),kn=p.useCallback(k=>{we(S=>{const R=typeof k=="function"?k(S.kicanvasPreview):k;return{...S,kicanvasPreview:R}})},[we]),_n=p.useCallback(k=>{we(S=>{const R=typeof k=="function"?k(S.stlPreview):k;return{...S,stlPreview:R}})},[we]),Be=p.useCallback((k,S,R)=>{if($(),R||!bn.current){O(k,S);return}const Y=setTimeout(()=>{w.current=null,O(k,S)},go);w.current={name:k,payload:S,timeoutId:Y}},[$]),vn=p.useCallback(k=>{const S=typeof k=="function"?k(St.current):k;St.current=S,di(S),Nr(S),we(R=>({...R,sendUsageMetrics:S}))},[we]);p.useEffect(()=>{pr()},[$e]);const[Ce,jn]=p.useState(!1),[$n,Ur]=p.useState(!1),[Cn,Sn]=p.useState(!1),[En,Pn]=p.useState(!0),[In,Ln]=p.useState(!0),[zn,ae]=p.useState(!1),[Rn,Te]=p.useState(!1),me=p.useRef(null),Ie=p.useRef(null),[Dn,ye]=p.useState(!1),An=p.useRef(!0),Et=p.useRef(null);p.useEffect(()=>{xo()},[]),p.useEffect(()=>{n&&Z(n)},[n]);const Nn=p.useCallback(()=>Z(null),[]),Un=p.useCallback(()=>T(null),[]),Wn=p.useCallback(()=>G(null),[]),On=p.useCallback(()=>V(null),[]),Fn=p.useCallback(k=>{var Y,oe,X,re,de,_e;const S=k.data,R=Vi(J.current,S);if(R.kind==="background-preview"){const ne=R.configId;if(S.type==="success"&&S.results){const xe=S.results,Se=((oe=(Y=xe.outlines)==null?void 0:Y.preview)==null?void 0:oe.svg)||((X=xe.demo)==null?void 0:X.svg),Ge=yo(Se);Ge&&c(nt=>{const He=nt.map(le=>le.id===ne?{...le,previewSvg:Ge}:le);return pe(He,j.current,2),He})}else S.type==="error"&&console.warn(`Background generation failed for config ${ne}:`,S.error);return}if(R.kind!=="stale"){if(R.kind==="active-error"){const ne=S.type==="error"&&S.error||"Unknown worker error";console.error("--- Ergogen worker error:",ne),Z(ne),ae(!1),ye(!1),Be("generation_failed",{error_message:ne,stored_configs_count:_.current.length,trigger:R.isManual?"manual":"auto"},R.isManual);return}if(R.kind==="active-success")if(S.type==="success"&&S.warnings&&S.warnings.length>0&&T(ne=>(ne?ne+`
`:"")+S.warnings.join(`
`)),S.type==="success"&&S.results){const ne=S.results,xe=Et.current?performance.now()-Et.current:0;Be("generation_completed",{duration_ms:Math.round(xe),points_count:ne.points?Object.keys(ne.points).length:0,pcbs_count:ne.pcbs?Object.keys(ne.pcbs).length:0,cases_count:ne.cases?Object.keys(ne.cases).length:0,has_outlines:!!ne.outlines,stored_configs_count:_.current.length,trigger:R.isManual?"manual":"auto"},R.isManual);try{const le=fe.dump(ne.canonical||{}),Ee=fe.dump(ne.points||{}),je=ki(le,Ee,Math.round(xe),z.current);if(je.config_id!==z.current){A.current&&clearTimeout(A.current.timeoutId);const Mr=setTimeout(()=>{O("keyboard_generated",je),z.current=je.config_id,A.current=null},go);A.current={timeoutId:Mr,payload:je,configId:je.config_id}}}catch(le){console.error("Failed to generate keyboard configuration analytics:",le)}const Se=((de=(re=ne.outlines)==null?void 0:re.preview)==null?void 0:de.svg)||((_e=ne.demo)==null?void 0:_e.svg),Ge=yo(Se),nt=R.targetConfigId;Ge&&nt&&c(le=>{const Ee=le.map(je=>je.id===nt?{...je,previewSvg:Ge}:je);return pe(Ee,j.current,2),Ee});let He=!1;if(mn.current&&ne.cases&&Object.keys(ne.cases).length>0){for(const le of Object.keys(ne.cases)){const Ee=ne.cases[le];Ee!=null&&Ee.jscad&&(ne.cases[le].stl=void 0)}if(Ie.current){He=!0,ye(!0);const le={type:"batch_jscad_to_stl",results:ne,configVersion:R.version};Ie.current.postMessage(le)}}K(ne),te(le=>le+1),He||ae(!1)}else ae(!1);else ae(!1),ye(!1)}},[Be]),Mn=p.useRef(Fn);Mn.current=Fn;const Bn=p.useCallback(k=>{const S=k.data;Ki(J.current,S.configVersion)&&(S.type==="error"?(console.error("--- JSCAD worker error:",S.error),ye(!1),ae(!1)):S.type==="success"&&S.results&&(K(S.results),te(R=>R+1),ye(!1),ae(!1)))},[]),Tn=p.useRef(Bn);Tn.current=Bn;const ze=p.useCallback(()=>{me.current&&(me.current.terminate(),me.current=null,Te(!1));const k=pn();return k?(k.onmessage=S=>Mn.current(S),k.onerror=S=>{k.terminate(),me.current===k&&(me.current=null,Te(!1));const R=S.message||"Ergogen worker error";Dt(J.current),Z(R),ae(!1),ye(!1),gt(S.message||"Worker crash",!1,"ergogen_worker","GENERATION_WORKER_FAILED")},me.current=k,Te(!0)):(Te(!1),console.warn("Failed to initialize Ergogen worker.")),k},[]);p.useEffect(()=>{if(me.current||ze(),!Ie.current){const k=ar();k?(k.onmessage=S=>Tn.current(S),k.onerror=S=>{ye(!1),ae(!1),gt(S.message||"Worker crash",!1,"jscad_worker","STL_WORKER_FAILED")},Ie.current=k):console.warn("Failed to initialize JSCAD worker.")}return()=>{me.current&&(me.current.terminate(),me.current=null,Te(!1)),Ie.current&&(Ie.current.terminate(),Ie.current=null)}},[ze]),p.useEffect(()=>{const k=()=>{document.visibilityState==="hidden"&&W()};return window.addEventListener("visibilitychange",k),window.addEventListener("pagehide",W),()=>{window.removeEventListener("visibilitychange",k),window.removeEventListener("pagehide",W),W()}},[W]);const Pt=p.useRef({debug:he,autoGen:ke,autoGen3D:ge,kicanvasPreview:Me,stlPreview:Pe,sendUsageMetrics:$e});p.useEffect(()=>{const k={debug:he,autoGen:ke,autoGen3D:ge,kicanvasPreview:Me,stlPreview:Pe,sendUsageMetrics:$e},{sendUsageMetrics:S,...R}=k;if(An.current)An.current=!1,Pt.current=k,O("settings_loaded",{...R});else{const Y=Pt.current,oe=Object.keys(k).find(X=>k[X]!==Y[X]);Pt.current=k,O("setting_changed",{...oe?{setting_name:oe,setting_value:k[oe]}:{},...R})}},[he,ke,ge,Me,Pe,$e]);const Gn=p.useCallback(k=>{let S="UNKNOWN",R=null;try{R=JSON.parse(k),S="json"}catch{}try{R=fe.load(k),S="yaml"}catch{}return[S,R]},[]),et=p.useCallback(async(k,S,R={pointsonly:!0})=>{const Y=k===void 0||k===N.current?I.current??N.current:k;if(!Y)return;const oe=yr(S),X=Ti(Y,oe,!!R.pointsonly,he);if(Gi(J.current,X,R.skipIfCurrent))return;const[,re]=Gn(Y);Z(null),T(null),G(null),ae(!0),Et.current=performance.now();const de=Ji(re);de&&T(de);const _e=qi(S);_e&&G(_e);const ne=Yi(re,R.pointsonly)||Y;try{const xe=me.current??ze();if(!xe){console.error("Worker not available for processing request."),Dt(J.current),ae(!1),ye(!1),Z("Worker not available for processing request.");return}const Se=Hi(J.current,{requestKey:X,targetConfigId:j.current,isManual:!!R.isManual});xe.postMessage({type:"generate",inputConfig:ne,injectionInput:oe,requestId:Se.requestId,options:{debug:he,svg:!0}})}catch(xe){Dt(J.current),ae(!1),ye(!1);const Se=typeof xe=="string"?xe:String(xe);Z(Se),Be("generation_failed",{error_message:Se,stored_configs_count:_.current.length,trigger:R.isManual?"manual":"auto"},!!R.isManual);return}},[Gn,Z,T,G,ae,he,Be,ze]),Re=p.useMemo(()=>Zo((k,S,R={pointsonly:!0})=>{if(me.current)return et(k,S,{...R,skipIfCurrent:!0})},300),[et]),Le=p.useCallback(async(k,S,R={pointsonly:!0})=>{Re.cancel(),await et(k,S,R)},[Re,et]),tt=p.useCallback(k=>{const S=N.current,R=typeof k=="function"?k(S):k;if(R!==S)if(f(R),E.current){if(R!==L.current){const oe=`Shared Config ${rt(_.current,/^Shared\s+Config\s+(\d+)$/)}`,X=Ne(),re=new Date().toISOString(),de={id:X,name:oe,config:R||"",createdAt:re,updatedAt:re},_e=[..._.current,de];c(_e),d(X),m(!1),v(null),pe(_e,X)}}else{const Y=j.current;if(Y){const oe=_.current.map(X=>X.id===Y?{...X,config:R||"",updatedAt:new Date().toISOString()}:X);c(oe),pe(oe,Y)}else{const X=`Untitled ${rt(_.current,/^Untitled\s+(\d+)$/)}`,re=Ne(),de=new Date().toISOString(),_e={id:re,name:X,config:R||"",createdAt:de,updatedAt:de},ne=[..._.current,_e];c(ne),d(re),pe(ne,re)}}},[]),Hn=p.useCallback(k=>{if(F(),se(),k===null)d(null),j.current=null,m(!1),v(null),f(""),N.current="",pe(_.current,null);else{const S=_.current.find(R=>R.id===k);S&&(d(k),j.current=k,m(!1),v(null),f(S.config),N.current=S.config,pe(_.current,k),O("config_selected",{stored_configs_count:_.current.length}))}},[F,se]),Vn=p.useCallback((k,S)=>{F(),se();const R=rt(_.current,/^Untitled\s+(\d+)$/),Y=S||`Untitled ${R}`,oe=Ne(),X=new Date().toISOString(),re={id:oe,name:Y,config:k,createdAt:X,updatedAt:X},de=[..._.current,re];return c(de),d(oe),m(!1),v(null),f(k),O("config_created",{stored_configs_count:de.length}),_.current=de,j.current=oe,N.current=k,pe(de,oe),oe},[F,se]),Kn=p.useCallback((k,S)=>{const R=S.trim();if(!R)return Z("Configuration name cannot be empty"),!1;const Y=_.current.find(re=>re.id===k);if(!Y)return!1;if(Y.name===R)return!0;if(_.current.some(re=>re.id!==k&&re.name.trim().toLowerCase()===R.toLowerCase()))return Z(`A configuration named "${R}" already exists.`),!1;const X=_.current.map(re=>re.id===k?{...re,name:R,updatedAt:new Date().toISOString()}:re);return c(X),_.current=X,pe(X,j.current),O("config_renamed",{stored_configs_count:X.length}),!0},[Z]),qn=p.useCallback(k=>{F(),se();const S=_.current.find(R=>R.id===k);if(S){const R=Ne(),Y=new Date().toISOString(),oe={id:R,name:`${S.name} (Copy)`,config:S.config,createdAt:Y,updatedAt:Y},X=[..._.current,oe];c(X),d(R),m(!1),v(null),f(S.config),_.current=X,j.current=R,N.current=S.config,pe(X,R),O("config_duplicated",{stored_configs_count:X.length})}},[F,se]),Jn=p.useCallback(k=>{F();const S=j.current,R=_.current.find(re=>re.id===k),Y=_.current.filter(re=>re.id!==k);c(Y),_.current=Y;const oe=S===k;Y.length===0||oe?(se(),d(null),j.current=null,f(""),N.current="",pe(Y,null)):pe(Y,S),R&&es(R),O("config_deleted",{stored_configs_count:Y.length})},[F,se]),Yn=p.useCallback(k=>{F(),se(),m(!0),v(k),f(k)},[F,se]),Xn=p.useCallback(()=>{if(!E.current)return;const S=`Shared Config ${rt(_.current,/^Shared\s+Config\s+(\d+)$/)}`,R=Ne(),Y=new Date().toISOString(),oe={id:R,name:S,config:N.current||"",createdAt:Y,updatedAt:Y},X=[..._.current,oe];c(X),_.current=X,d(R),j.current=R,m(!1),v(null),pe(X,R)},[]),Zn=p.useCallback(()=>{xo()},[]),Qn=p.useMemo(()=>{if(g)return"Shared Config";if(h){const k=l.find(S=>S.id===h);return k?k.name:""}return""},[g,h,l]),Wr=p.useMemo(()=>({setInjectionInput:B,setConfigInput:tt,generateNow:Le,getCurrentInjections:()=>D||[],setError:Z}),[D,Le,B,tt,Z]),{currentConflict:eo,processInjectionsWithConflictResolution:Or,handleConflictResolution:to,handleConflictCancel:no}=vt(Wr),{isLoading:oo}=Fi({processInjectionsWithConflictResolution:Or,setError:Z}),ro=p.useRef(null);p.useEffect(()=>{if(n||oo)return;!new URLSearchParams(window.location.search).get("github")&&x&&(ro.current=j.current,Le(x,D,{pointsonly:!1}))},[oo]);const io=p.useRef(Ce);p.useEffect(()=>{io.current&&!Ce&&(ho(J.current),ae(!1),ye(!1),ze(),x&&Le(x,D,{pointsonly:!ge})),io.current=Ce},[Ce,x,D,ge,Le,ze]),p.useEffect(()=>{localStorage.setItem("ergogen:injection",JSON.stringify(D)),ke&&!Ce&&Re(x,D,{pointsonly:!ge})},[x,D,ke,ge,Ce,Re]),p.useEffect(()=>{Rn&&(s===1||o)&&(console.log("Version 1 or legacy configuration detected on load. Triggering background preview generation for all configs missing a preview SVG..."),pe(_.current,j.current,2),_.current.forEach(k=>{var S;!k.previewSvg&&k.id!==ro.current&&(console.log(`Triggering background preview generation for: ${k.name}`),(S=me.current)==null||S.postMessage({type:"generate",inputConfig:k.config,requestId:`background-preview-${k.id}`,options:{debug:!0,svg:!0}}))}))},[Rn,s,o]);const Fr=p.useMemo(()=>({configInput:x,getRealtimeConfigInput:P,updateRealtimeConfigInput:M,setConfigInput:tt,configs:l,activeConfigId:h,activeConfigName:Qn,isPreview:g,selectConfig:Hn,createNewConfig:Vn,renameConfig:Kn,duplicateConfig:qn,deleteConfig:Jn,loadPreview:Yn,savePreviewConfig:Xn,pruneDeletedConfigs:Zn,injectionInput:D,setInjectionInput:B,processInput:Re,generateNow:Le,error:H,setError:Z,clearError:Nn,deprecationWarning:Q,clearWarning:Un,skippedWarning:U,clearSkippedWarning:Wn,info:ee,setInfo:V,clearInfo:On,results:y,resultsVersion:q,setResultsVersion:te,showSettings:Ce,setShowSettings:jn,isBulkDownloadOpen:$n,setIsBulkDownloadOpen:Ur,showSideNav:Cn,setShowSideNav:Sn,showConfig:En,setShowConfig:Pn,showDownloads:In,setShowDownloads:Ln,debug:he,setDebug:wn,autoGen:ke,setAutoGen:xn,autoGen3D:ge,setAutoGen3D:yn,kicanvasPreview:Me,setKicanvasPreview:kn,stlPreview:Pe,setStlPreview:_n,sendUsageMetrics:$e,setSendUsageMetrics:vn,isGenerating:zn,setIsGenerating:ae,isJscadConverting:Dn,currentConflict:eo,handleConflictResolution:to,handleConflictCancel:no}),[x,P,M,tt,l,h,Qn,g,Hn,Vn,Kn,qn,Jn,$n,Yn,Xn,Zn,D,B,Re,Le,H,Z,Nn,Q,Un,U,Wn,ee,V,On,y,q,te,Ce,jn,Cn,Sn,En,Pn,In,Ln,he,wn,ke,xn,ge,yn,Me,kn,Pe,_n,$e,vn,zn,ae,Dn,eo,to,no]);return t.jsx(kr.Provider,{value:Fr,children:r})},ve=()=>p.useContext(kr),os=({className:e,options:n,"data-testid":r,"aria-label":o})=>{const s=ve(),a=p.useRef(null),l={configInput:void 0,setConfigInput:j=>{},updateRealtimeConfigInput:j=>{},injectionInput:void 0,generateNow:async()=>{},activeConfigId:null},{configInput:c,updateRealtimeConfigInput:h,setConfigInput:d,injectionInput:g,generateNow:m,activeConfigId:b}=s??l,v=p.useRef({updateRealtimeConfigInput:h,setConfigInput:d,injectionInput:g,generateNow:m});v.current={updateRealtimeConfigInput:h,setConfigInput:d,injectionInput:g,generateNow:m};const x=p.useRef(Zo(j=>{d(j)},500)).current;p.useEffect(()=>()=>{x.cancel()},[x]),p.useEffect(()=>{if(a.current){if(a.current.hasTextFocus())return;const j=a.current.getValue();c!==void 0&&c!==j&&a.current.setValue(c)}},[c]);const f=p.useCallback(j=>{j!==void 0&&(h(j),x(j))},[x,h]),_=(j,E)=>{a.current=j,j.onDidBlurEditorText(()=>{x.flush()}),j.addAction({id:"generate-config",label:"Generate",keybindings:[E.KeyMod.CtrlCmd|E.KeyCode.Enter],run:()=>{const{updateRealtimeConfigInput:L,setConfigInput:N,injectionInput:I,generateNow:M}=v.current,P=j.getValue();x.cancel(),L(P),N(P),O("shortcut_used",{action:"generate"}),M(P,I,{pointsonly:!1,isManual:!0})}})};return s?t.jsx("div",{className:e,"data-testid":r,"aria-label":o,children:t.jsx(Qo,{height:"100%",defaultLanguage:"yaml",language:"yaml",onChange:f,onMount:_,defaultValue:c,theme:"ergogen-theme",options:n||void 0},b||"preview")}):null},rs=({className:e,options:n,injection:r,setInjection:o,"data-testid":s,"aria-label":a})=>{const l=ve(),c=async h=>{if(!h)return null;const d={...r,content:h};o(d)};return l?t.jsx(is,{className:e,"data-testid":s,"aria-label":a,children:t.jsx(Qo,{height:"100%",defaultLanguage:"javascript",language:"javascript",onChange:c,value:r.content,theme:"ergogen-theme",options:n||void 0})}):null},is=u.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: 0.5rem;
`,i={colors:{accent:"#28a745",accentDark:"#1e8e1e",accentDarker:"#1e7e34",accentSecondary:"#239923",background:"#222222",backgroundLight:"#2a2a2a",backgroundLighter:"#333333",border:"#3f3f3f",text:"#ffffff",textDark:"#ccc",textDarker:"#aaa",textDarkest:"#666",error:"#ff6d6d",errorDark:"#a31111",warning:"hsl(45, 100%, 90%)",warningDark:"hsl(32, 79%, 40%)",info:"hsl(206, 94%, 92%)",infoDark:"hsl(206, 100%, 30%)",success:"hsl(120, 73%, 92%)",successDark:"hsl(120, 50%, 35%)",white:"#fff",buttonHover:"#3f3f3f"},fonts:{body:"'Roboto', sans-serif",code:"source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"},fontSizes:{xs:"0.4rem",sm:"0.8rem",base:"1rem",lg:"1.2rem",iconMedium:"16px",iconLarge:"24px",bodySmall:"13px",h1:"2.5rem",h2:"2rem",h3:"1.5rem"},fontWeights:{regular:400,semiBold:600,bold:700},buttonSizes:{large:{padding:"1rem 2rem",fontSize:"1rem"},medium:{padding:"0.7rem 1.4rem",fontSize:"1rem"},small:{padding:"8px 12px",fontSize:"0.8rem"},icon:{padding:"8px 12px",fontSize:"0.4rem"}}},ss=yt`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,as=u.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;

  @media (max-width: 639px) {
    padding-bottom: 0.75rem;
  }
`,ls=u.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${i.fontSizes.bodySmall};
  cursor: ${e=>e.$hasPreview?"pointer":"default"};
  border-bottom: ${e=>e.$active?`2px solid ${i.colors.accent}`:"2px solid transparent"};
  border-top: 2px solid transparent;
  opacity: ${e=>e.$disabled?.5:1};
  color: ${e=>e.$disabled?i.colors.textDarker:i.colors.white};
`,cs=u.div`
  white-space: nowrap;
  display: flex;
  gap: 10px;
  align-items: center;
`,ds=u.a`
  background-color: ${i.colors.background};
  border: none;
  border-radius: 6px;
  color: ${i.colors.white};
  display: flex;
  align-items: center;
  padding: 4px 6px;
  text-decoration: none;
  cursor: pointer;
  font-size: ${i.fontSizes.bodySmall};
  line-height: 16px;
  height: 28px;

  .material-symbols-outlined {
    font-size: ${i.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${i.colors.buttonHover};
  }
`,us=u.a`
  background-color: ${i.colors.background};
  border: none;
  border-radius: 6px;
  color: ${i.colors.white};
  display: flex;
  align-items: center;
  padding: 4px 6px;
  text-decoration: none;
  cursor: not-allowed;
  font-size: ${i.fontSizes.bodySmall};
  line-height: 16px;
  height: 28px;
  opacity: 0.5;

  .material-symbols-outlined {
    font-size: ${i.fontSizes.iconMedium} !important;
    animation: ${ss} 1s linear infinite;
  }
`,ps=({fileName:e,extension:n,content:r,preview:o,setPreview:s,previewKey:a,"data-testid":l})=>{const c=n==="stl"&&!r||n==="kicad_pcb"&&!o,h=n==="stl"&&!r,d=()=>{if(h)return;O("download_button_clicked",{download_type:n,source:"downloads_panel"});const b=document.createElement("a"),v=new Blob([r],{type:"octet/stream"}),x=URL.createObjectURL(v);b.href=x,b.download=`${e}.${n}`,document.body.appendChild(b);try{b.click()}finally{document.body.removeChild(b),URL.revokeObjectURL(x)}},g=()=>{o&&!c&&s(o)},m=l?`${l}-${n}`:void 0;return t.jsxs(as,{"data-testid":m,children:[t.jsxs(ls,{$active:a===(o==null?void 0:o.key),$hasPreview:!!o,$disabled:c,onClick:g,"data-testid":m&&`${m}-preview`,children:[e,".",n]}),t.jsx(cs,{children:h?t.jsx(us,{"aria-label":`Generating ${e}.${n}`,"data-testid":m&&`${m}-loading`,children:t.jsx("span",{className:"material-symbols-outlined",children:"progress_activity"})}):t.jsx(ds,{onClick:d,"aria-label":`Download ${e}.${n}`,"data-testid":m&&`${m}-download`,children:t.jsx("span",{className:"material-symbols-outlined",children:"download"})})})]})},fs=u.h3`
  font-size: ${i.fontSizes.base};
  font-weight: ${i.fontWeights.semiBold};
  color: ${i.colors.white};
  margin: 0 0 1rem;

  @media (max-width: 639px) {
    display: none;
  }
`,hs=u.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;

  @media (max-width: 639px) {
    padding: 0.5rem;
  }
`,gs=u.div`
  font-size: ${i.fontSizes.sm};
  color: ${i.colors.textDarkest};
  font-style: italic;
  padding: 0.5rem 0;
`,ms=({setPreview:e,previewKey:n,"data-testid":r})=>{var h,d;const o=[],s=ve();if(!s)return null;const{configInput:a,results:l}=s;if(l!=null&&l.demo&&o.push({fileName:"raw",extension:"txt",content:a??"",previewKey:"raw",preview:{key:"raw",extension:"txt",content:a??""}},{fileName:"canonical",extension:"yaml",content:fe.dump(l.canonical),previewKey:"canonical",preview:{key:"canonical",extension:"yaml",content:fe.dump(l.canonical)}},{fileName:"demo",extension:"dxf",content:((h=l.demo)==null?void 0:h.dxf)??"",previewKey:"demo.svg",preview:{key:"demo.svg",extension:"svg",content:((d=l.demo)==null?void 0:d.svg)??""}},{fileName:"points",extension:"yaml",content:fe.dump(l.points),previewKey:"points",preview:{key:"points",extension:"yaml",content:fe.dump(l.points)}},{fileName:"units",extension:"yaml",content:fe.dump(l.units),previewKey:"units",preview:{key:"units",extension:"yaml",content:fe.dump(l.units)}}),l!=null&&l.outlines)for(const[g,m]of Object.entries(l.outlines))o.push({fileName:g,extension:"dxf",content:m.dxf??"",previewKey:`outlines.${g}.svg`,preview:{key:`outlines.${g}.svg`,extension:"svg",content:m.svg??""}});if(l!=null&&l.cases){for(const[g,m]of Object.entries(l.cases))if(o.push({fileName:g,extension:"jscad",content:m.jscad??"",previewKey:`cases.${g}`,preview:{key:`cases.${g}`,extension:"jscad",content:m.jscad??""}}),s.stlPreview&&m.jscad){const b=!!m.stl;o.push({fileName:g,extension:"stl",content:m.stl??"",previewKey:b?`cases.${g}.stl`:"",preview:b?{key:`cases.${g}.stl`,extension:"stl",content:m.stl??""}:void 0})}}if(l!=null&&l.pcbs)for(const[g,m]of Object.entries(l.pcbs)){const v=String(m).match(/version "?([0-9]+)"?/),x=v&&v.length>1?Number(v[1]):-1;o.push({fileName:g,extension:"kicad_pcb",content:m,previewKey:s.kicanvasPreview&&x>20240101?`pcbs.${g}`:"",preview:s.kicanvasPreview&&x>20240101?{key:`pcbs.${g}`,extension:"kicad_pcb",content:m}:void 0})}const c=o.filter(g=>!(!s.debug&&(g.fileName.startsWith("_")||{units:"yaml",points:"yaml",canonical:"yaml",raw:"txt"}[g.fileName]===g.extension||s.stlPreview&&g.extension==="jscad")));return t.jsxs(hs,{"data-testid":r,children:[t.jsx(fs,{children:"Outputs"}),c.length>0?c.map((g,m)=>t.jsx(ps,{...g,setPreview:e,previewKey:n,"data-testid":r&&`${r}-${g.fileName}`},m)):t.jsx(gs,{children:"No outputs"})]})},bs=u.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
`,ws=u.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${i.fontSizes.bodySmall};
  cursor: pointer;
  border-bottom: ${e=>e.$active?`2px solid ${i.colors.accent}`:"2px solid transparent"};
  border-top: 2px solid transparent;
`,xs=u.div`
  white-space: nowrap;
  display: flex;
  gap: 6px;
  align-items: center;
`,_r=er`
  background-color: ${i.colors.background};
  border: none;
  border-radius: 6px;
  color: ${i.colors.white};
  display: flex;
  align-items: center;
  padding: 4px 6px;
  text-decoration: none;
  cursor: pointer;
  font-size: ${i.fontSizes.bodySmall};
  line-height: 16px;
  gap: 6px;

  .material-symbols-outlined {
    font-size: ${i.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${i.colors.buttonHover};
  }
`,ko=u.a`
  ${_r}
`,ys=u.a`
  ${_r}

  @media (min-width: 640px) {
    display: none;
  }
`,Ut=({injection:e,setInjectionToEdit:n,deleteInjection:r,previewKey:o,"data-testid":s})=>{const[a,l]=p.useState("");return p.useEffect(()=>{const c=window.URL.createObjectURL(new Blob([e.content],{type:"octet/stream"}));return l(c),()=>{window.URL.revokeObjectURL(c)}},[e.content]),t.jsxs(bs,{"data-testid":s,children:[t.jsx(ws,{"data-testid":s&&`${s}-name`,$active:o===e.name,onClick:()=>n(e),children:e.name}),t.jsxs(xs,{children:[t.jsx(ys,{href:"#",onClick:c=>{c.preventDefault(),n(e)},"aria-label":`edit injection ${e.name}`,"data-testid":s&&`${s}-edit`,children:t.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),t.jsx(ko,{href:"#",onClick:c=>{c.preventDefault(),r(e)},"aria-label":`delete injection ${e.name}`,"data-testid":s&&`${s}-delete`,children:t.jsx("span",{className:"material-symbols-outlined",children:"delete"})}),t.jsx(ko,{target:"_blank",rel:"noopener noreferrer",download:`${e.name.split("/").reverse()[0]}.js`,href:a||void 0,"aria-label":`download injection ${e.name}`,"data-testid":s&&`${s}-download`,children:t.jsx("span",{className:"material-symbols-outlined",children:"download"})})]})]})},Ye=u.button`
  background-color: ${i.colors.accentSecondary};
  transition: background-color 0.15s ease-in-out;
  border: none;
  border-radius: 6px;
  color: ${i.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  cursor: pointer;
  height: 34px;
  font-family: ${i.fonts.body};
  flex-grow: 1;

  .material-symbols-outlined {
    font-size: ${i.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${i.colors.accentDark};
  }
`,jt=u.button`
  display: inline-block;
  border: none;
  padding: ${i.buttonSizes.large.padding};
  margin: 0;
  text-decoration: none;
  background-color: ${i.colors.accent};
  border-radius: 0.25rem;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  color: ${i.colors.white};
  font-family: ${i.fonts.body};
  font-size: ${i.buttonSizes.large.fontSize};
  cursor: pointer;
  text-align: center;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:hover {
    background-color: ${i.colors.accentDark};
    border-color: ${i.colors.accentDarker};
  }

  &:active {
    transform: scale(0.98);
    outline: 2px solid ${i.colors.white};
    outline-offset: -5px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,ks=u(jt)`
  padding: ${i.buttonSizes.medium.padding};
  font-size: ${i.buttonSizes.medium.fontSize};
`,_s=u(jt)`
  padding: ${i.buttonSizes.small.padding};
  font-size: ${i.buttonSizes.small.fontSize};
`,vs=u(jt)`
  padding: ${i.buttonSizes.icon.padding};
  font-size: ${i.buttonSizes.icon.fontSize};
`,ue=({size:e,...n})=>{switch(e){case"icon":return t.jsx(vs,{...n});case"sm":case"small":return t.jsx(_s,{...n});case"md":case"medium":return t.jsx(ks,{...n});case"lg":case"large":default:return t.jsx(jt,{...n})}},js=e=>e.charAt(0).toUpperCase()+e.slice(1),xt=({injectionName:e,injectionType:n,onResolve:r,onCancel:o,"data-testid":s})=>{const[a,l]=p.useState(!1),c=js(n);return t.jsx($s,{"data-testid":s,children:t.jsxs(Cs,{"data-testid":s&&`${s}-box`,children:[t.jsxs(Ss,{children:[c," Conflict"]}),t.jsxs(Es,{children:["A ",n," with the name ",t.jsx("strong",{children:e})," ","already exists.",t.jsx("br",{}),"How would you like to resolve this conflict?"]}),t.jsxs(Ps,{children:[t.jsx(Is,{type:"checkbox",id:"apply-to-all",checked:a,onChange:h=>l(h.target.checked),"data-testid":s&&`${s}-apply-to-all`,"aria-label":"Apply this choice to all conflicts"}),t.jsx(Ls,{$checked:a,onClick:()=>l(!a),role:"checkbox","aria-checked":a}),t.jsx("label",{htmlFor:"apply-to-all",children:"Apply to all conflicts"})]}),t.jsxs(zs,{children:[t.jsx(ue,{onClick:()=>r("skip",a),size:"medium","data-testid":s&&`${s}-skip`,"aria-label":`Skip this ${n}`,children:"Skip"}),t.jsx(ue,{onClick:()=>r("overwrite",a),size:"medium","data-testid":s&&`${s}-overwrite`,"aria-label":`Overwrite existing ${n}`,children:"Overwrite"}),t.jsx(ue,{onClick:()=>r("keep-both",a),size:"medium","data-testid":s&&`${s}-keep-both`,"aria-label":`Keep both ${n}s`,children:"Keep Both"})]}),t.jsx(Rs,{onClick:o,size:"small","data-testid":s&&`${s}-cancel`,"aria-label":"Cancel loading",children:"Cancel"})]})})},$s=u.div`
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
`,Cs=u.div`
  background-color: ${i.colors.backgroundLight};
  border: 1px solid ${i.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`,Ss=u.h2`
  margin: 0 0 1rem 0;
  font-size: ${i.fontSizes.h3};
  color: ${i.colors.text};
`,Es=u.p`
  margin: 0 0 1.5rem 0;
  font-size: ${i.fontSizes.base};
  color: ${i.colors.textDark};
  line-height: 1.5;

  strong {
    color: ${i.colors.accent};
  }
`,Ps=u.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 0.75rem;

  label {
    cursor: pointer;
    font-size: ${i.fontSizes.base};
    color: ${i.colors.textDark};
    user-select: none;
  }
`,Is=u.input`
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
`,Ls=u.div`
  position: relative;
  width: 44px;
  height: 22px;
  background-color: ${e=>e.$checked?i.colors.accent:i.colors.backgroundLighter};
  border: 1px solid ${i.colors.border};
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
    background-color: ${i.colors.text};
    border-radius: 50%;
    transition: left 0.2s ease-in-out;
  }
`,zs=u.div`
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  margin-bottom: 1rem;
`,Rs=u(ue)`
  width: 100%;
  background-color: ${i.colors.backgroundLighter};
  color: ${i.colors.textDark};

  &:hover {
    background-color: ${i.colors.buttonHover};
  }
`,ft=u.h3`
  font-size: ${i.fontSizes.base};
  font-weight: ${i.fontWeights.semiBold};
  color: ${i.colors.white};
  margin: 1.5rem 0.5rem 1rem 0.5rem;
`,_o=e=>{const o=new DOMParser().parseFromString(e,"image/svg+xml").querySelectorAll("path"),s=[];return o.forEach(a=>{const l=a.getAttribute("d");if(l&&l.trim()){const c=l.replace(/\\/g,"\\\\").replace(/"/g,'\\"');s.push(`        "${c}"`)}}),`const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
${s.join(`,
`)}
    ];
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
};`},Wt=u.div`
  display: flex;
  margin-left: 0.5rem;
  margin-left: 0.5rem;
  gap: 8px;
  margin-top: 0.5rem;
`,De=u(Ye)`
  flex-grow: 0;
  width: 34px;
  padding: 0;
`,Ds=u.div`
  display: flex;
  margin-left: 0.5rem;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.5rem;
`,As=u.div`
  display: flex;
  margin-left: 0.5rem;
  border-bottom: 1px solid ${i.colors.border};
  margin-left: 0.5rem;
  gap: 16px;
`,Ot=u.button`
  background: none;
  border: none;
  color: ${e=>e.$active?i.colors.text:i.colors.textDark};
  padding: 0.75rem 0;
  cursor: pointer;
  font-size: ${i.fontSizes.bodySmall};
  font-weight: ${i.fontWeights.semiBold};
  border-bottom: 2px solid
    ${e=>e.$active?i.colors.accent:"transparent"};
  transition: all 0.2s ease-in-out;

  &:hover {
    color: ${i.colors.text};
  }
`,Ns=({setInjectionToEdit:e,deleteInjection:n,injectionToEdit:r,onInjectionSelect:o,"data-testid":s})=>{const a=[],l=[],c=[],h=p.useRef(null),d=p.useRef(null),g=p.useCallback(w=>{d.current=w,w&&(w.setAttribute("webkitdirectory",""),w.setAttribute("directory",""))},[]),m=ve(),[b,v]=p.useState("footprint"),[x,f]=p.useState("footprints"),{currentConflict:_,processInjectionsWithConflictResolution:j,handleConflictResolution:E,handleConflictCancel:L}=vt({setInjectionInput:w=>m==null?void 0:m.setInjectionInput(w),setConfigInput:w=>m==null?void 0:m.setConfigInput(w),generateNow:async(w,$,C)=>{await(m==null?void 0:m.generateNow(w,$,C))},getCurrentInjections:()=>(m==null?void 0:m.injectionInput)||[],setError:w=>m==null?void 0:m.setError(w)});if(!m)return null;const{injectionInput:N}=m;if(N&&Array.isArray(N)&&N.length>0)for(let w=0;w<N.length;w++){const $=N[w];if($.length===3){let C=c;$[0]==="footprint"?C=a:$[0]==="outline"?C=l:$[0]==="template"&&(C=c),C.push({key:w,type:$[0],name:$[1],content:$[2]})}}const I=()=>{var C;const w=((C=m==null?void 0:m.injectionInput)==null?void 0:C.length)||0,$={key:w,type:"footprint",name:`custom_footprint_${w+1}`,content:`module.exports = {
  params: {
    designator: '',
  },
  body: p => \`\`
}`};O("injection_created",{injection_type:"footprint"}),e($),o&&o()},M=()=>{var C;const w=((C=m==null?void 0:m.injectionInput)==null?void 0:C.length)||0,$={key:w,type:"outline",name:`custom_outline_${w+1}`,content:`const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
        ""  // Add your SVG path(s) here
    ];
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
};`};O("injection_created",{injection_type:"outline"}),e($),o&&o()},P=()=>{var C;const w=((C=m==null?void 0:m.injectionInput)==null?void 0:C.length)||0,$={key:w,type:"template",name:`custom_template_${w+1}`,content:`const m = require('makerjs')
const version = require('../../package.json').version

module.exports = {
    convert_outline: (model, layer) => {
        return \`\`;  // Return your converted outlines
    },
    body: params => {
        return \`\`;  // Add your template text here
    }
}`};O("injection_created",{injection_type:"template"}),e($),o&&o()},z=async w=>{const $=w.target.files;if(!$||$.length===0)return;const C=[];for(let W=0;W<$.length;W++){const F=$[W];if(F.name.endsWith(".js")){const D=await F.text(),B=F.name.replace(/\.js$/,"");C.push([b,B,D])}else if(b==="outline"&&F.name.endsWith(".svg")){const D=await F.text(),B=_o(D),H=F.name.replace(/\.svg$/,"");C.push([b,H,B])}}C.length>0&&(O("injection_uploaded",{injection_type:b,source:"file",file_count:C.length}),await j(C,m.configInput||"")),w.target.value=""},A=async w=>{const $=w.target.files;if(!$||$.length===0)return;const C=[];for(let W=0;W<$.length;W++){const F=$[W];if(F.name.endsWith(".js")){const D=await F.text(),B=F.webkitRelativePath.split("/");B.shift();const H=B.join("/").replace(/\.js$/,"");C.push([b,H,D])}else if(b==="outline"&&F.name.endsWith(".svg")){const D=await F.text(),B=F.webkitRelativePath.split("/");B.shift();const H=B.join("/").replace(/\.svg$/,""),Z=_o(D);C.push([b,H,Z])}}C.length>0&&(O("injection_uploaded",{injection_type:b,source:"folder",file_count:C.length}),await j(C,m.configInput||"")),w.target.value=""};return t.jsxs(Ds,{"data-testid":s,children:[_&&t.jsx(xt,{injectionName:_.name,injectionType:_.type,onResolve:E,onCancel:L,"data-testid":"conflict-resolution-dialog"}),t.jsx(ft,{children:"Custom Libraries"}),t.jsxs(As,{children:[t.jsx(Ot,{$active:x==="footprints",onClick:()=>{f("footprints"),v("footprint")},"data-testid":"tab-footprints",children:"Footprints"}),ce("outlines")&&t.jsx(Ot,{$active:x==="outlines",onClick:()=>{f("outlines"),v("outline")},"data-testid":"tab-outlines",children:"Outlines"}),ce("templates")&&t.jsx(Ot,{$active:x==="templates",onClick:()=>{f("templates"),v("template")},"data-testid":"tab-templates",children:"Templates"})]}),x==="footprints"&&t.jsxs(t.Fragment,{children:[a.map(w=>t.jsx(Ut,{injection:w,setInjectionToEdit:$=>{O("injection_editor_opened",{injection_type:$.type}),e($),o&&o()},deleteInjection:n,previewKey:r.name,"data-testid":s&&`${s}-${w.name}`},w.key)),t.jsxs(Wt,{children:[t.jsx(Ye,{onClick:I,"data-testid":"add-footprint","aria-label":"Add new custom footprint",title:"Add footprint",children:t.jsx("span",{className:"material-symbols-outlined",children:"add"})}),t.jsx(De,{onClick:()=>{v("footprint"),setTimeout(()=>{var w;return(w=h.current)==null?void 0:w.click()},0)},"data-testid":"load-footprint-files","aria-label":"Load custom footprint files",title:"Load footprint files",children:t.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),t.jsx(De,{onClick:()=>{v("footprint"),setTimeout(()=>{var w;return(w=d.current)==null?void 0:w.click()},0)},"data-testid":"load-footprint-folder","aria-label":"Load custom footprint folder",title:"Load footprint folder",children:t.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),x==="outlines"&&ce("outlines")&&t.jsxs(t.Fragment,{children:[l.map(w=>t.jsx(Ut,{injection:w,setInjectionToEdit:$=>{O("injection_editor_opened",{injection_type:$.type}),e($),o&&o()},deleteInjection:n,previewKey:r.name,"data-testid":s&&`${s}-${w.name}`},w.key)),t.jsxs(Wt,{children:[t.jsx(Ye,{onClick:M,"data-testid":"add-outline","aria-label":"Add new custom outline",title:"Add outline",children:t.jsx("span",{className:"material-symbols-outlined",children:"add"})}),t.jsx(De,{onClick:()=>{v("outline"),setTimeout(()=>{var w;return(w=h.current)==null?void 0:w.click()},0)},"data-testid":"load-outline-files","aria-label":"Load custom outline files",title:"Load outline files",children:t.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),t.jsx(De,{onClick:()=>{v("outline"),setTimeout(()=>{var w;return(w=d.current)==null?void 0:w.click()},0)},"data-testid":"load-outline-folder","aria-label":"Load custom outline folder",title:"Load outline folder",children:t.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),x==="templates"&&ce("templates")&&t.jsxs(t.Fragment,{children:[c.map(w=>t.jsx(Ut,{injection:w,setInjectionToEdit:$=>{O("injection_editor_opened",{injection_type:$.type}),e($),o&&o()},deleteInjection:n,previewKey:r.name,"data-testid":s&&`${s}-${w.name}`},w.key)),t.jsxs(Wt,{children:[t.jsx(Ye,{onClick:P,"data-testid":"add-template","aria-label":"Add new custom template",title:"Add template",children:t.jsx("span",{className:"material-symbols-outlined",children:"add"})}),t.jsx(De,{onClick:()=>{v("template"),setTimeout(()=>{var w;return(w=h.current)==null?void 0:w.click()},0)},"data-testid":"load-template-files","aria-label":"Load custom template files",title:"Load template files",children:t.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),t.jsx(De,{onClick:()=>{v("template"),setTimeout(()=>{var w;return(w=d.current)==null?void 0:w.click()},0)},"data-testid":"load-template-folder","aria-label":"Load custom template folder",title:"Load template folder",children:t.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),t.jsx("input",{type:"file",ref:h,onChange:z,accept:b==="outline"?".js,.svg":".js",multiple:!0,style:{display:"none"}}),t.jsx("input",{type:"file",ref:g,onChange:A,accept:b==="outline"?".js,.svg":".js",style:{display:"none"}})]})},Us=u.img`
  filter: invert();
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
`,Ws=u(Gr.PanZoom)`
  overflow: hidden;
  height: 100%;

  &:focus-visible {
    outline: none;
  }
`,Os=({svg:e,width:n,height:r,"aria-label":o,"data-testid":s})=>t.jsx(Ws,{enableBoundingBox:!0,minZoom:.8,maxZoom:5,"aria-label":o,"data-testid":s,children:t.jsx(Us,{width:n||"100%",height:r||"100%",src:`data:image/svg+xml;utf8,${encodeURIComponent(e)}`,alt:"Ergogen SVG Output preview",draggable:"false"})}),Ft=({content:e,language:n,className:r,height:o,options:s,"aria-label":a,"data-testid":l})=>t.jsx("div",{className:r,"aria-label":a,"data-testid":l,children:t.jsx(Hr,{height:o||"80vh",language:n,value:e,theme:"ergogen-theme",options:s||{readOnly:!0}})}),Fs=p.lazy(()=>sr(()=>import("./PcbPreview-BI1R2Mfv.js"),__vite__mapDeps([0,1]))),Ms=p.lazy(()=>sr(()=>import("./StlPreview-G-ZWo7Lw.js"),__vite__mapDeps([2,1,3,4,5]))),vr=u.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: ${i.colors.background};
`,jr=u.img`
  width: 96px;
  height: 96px;
  opacity: 0.12;
  filter: grayscale(100%);
  -webkit-user-drag: none;
  user-drag: none;
`,Bs=u.span`
  color: ${i.colors.textDarkest};
  font-size: ${i.fontSizes.sm};
  margin-top: 1rem;
  font-family: ${i.fonts.body};
  user-select: none;
`,vo=()=>t.jsxs(vr,{children:[t.jsx(jr,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"}),t.jsx(Bs,{children:"Loading preview..."})]}),Ts=({previewExtension:e,previewContent:n,previewKey:r,width:o="100%",height:s="100%",className:a,"data-testid":l,"aria-label":c})=>{if(!n||typeof n=="string"&&n===""||n instanceof ArrayBuffer&&n.byteLength===0||ArrayBuffer.isView(n)&&n.byteLength===0)return t.jsx(vr,{className:a,"data-testid":l,"aria-label":c,children:t.jsx(jr,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"})});const d=g=>{switch(g){case"svg":return t.jsx(Os,{svg:n,width:o,height:s,"aria-label":c||`SVG preview for ${r}`,"data-testid":l&&`${l}-svg`});case"yaml":return t.jsx(Ft,{language:"yaml",content:n,"aria-label":c||`YAML preview for ${r}`,"data-testid":l&&`${l}-yaml`});case"txt":return t.jsx(Ft,{language:"text",content:n,"aria-label":c||`Text preview for ${r}`,"data-testid":l&&`${l}-txt`});case"jscad":return t.jsx(Ft,{language:"javascript",content:n,"aria-label":c||`JSCAD code preview for ${r}`,"data-testid":l&&`${l}-jscad-text`});case"kicad_pcb":return t.jsx(p.Suspense,{fallback:t.jsx(vo,{}),children:t.jsx(Fs,{pcb:n,previewKey:r,"aria-label":c||`PCB preview for ${r}`,"data-testid":l&&`${l}-pcb`},r)});case"stl":return t.jsx(p.Suspense,{fallback:t.jsx(vo,{}),children:t.jsx(Ms,{stl:n,"aria-label":c||`STL preview for ${r}`,"data-testid":l&&`${l}-stl`})});default:return"No preview available"}};return t.jsx("div",{className:a,"data-testid":l,"aria-label":c,children:d(e)})},Mt=({children:e,initialWidth:n=300,minWidth:r=10,maxWidth:o="100%",side:s="left",style:a,"data-testid":l})=>{const[c,h]=p.useState(n),d=p.useRef(!1),g=p.useRef(0),m=p.useRef(n),b=p.useRef(null),v=f=>{if(typeof f=="string"&&f.includes("%")){const _=parseFloat(f)/100;return window.innerWidth*_}else return typeof f=="string"&&f.includes("px")?parseFloat(f):typeof f=="number"?f:1/0};p.useEffect(()=>{const f=L=>{if(!d.current)return;const N=s==="left"?L.clientX-g.current:g.current-L.clientX,I=m.current+N,M=v(o),P=Math.max(r,Math.min(I,M));h(P)},_=()=>{d.current&&(d.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},j=L=>{if(!d.current)return;L.preventDefault();const N=L.touches[0],I=s==="left"?N.clientX-g.current:g.current-N.clientX,M=m.current+I,P=v(o),z=Math.max(r,Math.min(M,P));h(z)},E=()=>{d.current&&(d.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",f),window.addEventListener("mouseup",_),window.addEventListener("touchmove",j,{passive:!1}),window.addEventListener("touchend",E),()=>{window.removeEventListener("mousemove",f),window.removeEventListener("mouseup",_),window.removeEventListener("touchmove",j),window.removeEventListener("touchend",E)}},[r,o,s]);const x=f=>{f.preventDefault(),f.stopPropagation(),d.current=!0,m.current=c,"touches"in f?g.current=f.touches[0].clientX:g.current=f.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};return t.jsxs(Gs,{ref:b,$side:s,style:{width:`${c}px`,...a},"data-testid":l,children:[e,t.jsx(Hs,{$side:s,onMouseDown:x,onTouchStart:x,"data-testid":l&&`${l}-resize-handle`})]})},Gs=u.div`
  position: relative;
  flex-shrink: 0;
  flex-grow: 0;
  height: 100%;
  overflow: visible;
  border-right: ${e=>e.$side==="left"?`1px solid ${i.colors.border}`:"none"};
  border-left: ${e=>e.$side==="right"?`1px solid ${i.colors.border}`:"none"};

  @media (max-width: 639px) {
    width: 100% !important;
    border-right: none;
    border-left: none;
  }
`,Hs=u.div`
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
  --active-color: ${i.colors.accent};
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
      0 -8px 0 0 ${i.colors.backgroundLight},
      0 8px 0 0 ${i.colors.backgroundLight};
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
`,nn=(e,n)=>{if(n===null)return null;if(e==="")return n;if(typeof n!="object")return;const r=e.split("."),o=r[0],s=r.slice(1).join(".");return Object.prototype.hasOwnProperty.call(n,o)?nn(s,n[o]):void 0},Vs=(e,n,r,o="")=>{let s=n,a=r,l=null;e&&(l=nn(s,e),l===void 0&&s!=="demo.svg"&&(s="demo.svg",a="svg",l=nn(s,e)));let c="";switch(a){case"svg":case"kicad_pcb":c=typeof l=="string"?l:"";break;case"stl":c=typeof l=="string"||l instanceof ArrayBuffer||ArrayBuffer.isView(l)?l:"";break;case"jscad":c=typeof(l==null?void 0:l.jscad)=="string"?l.jscad:"";break;case"yaml":c=fe.dump(l);break;case"txt":c=o;break;default:c=""}return{key:s,extension:a,content:c}};function $r(){if(typeof navigator<"u"){if("userAgentData"in navigator&&navigator.userAgentData){const e=navigator.userAgentData;if(e.platform&&/mac/i.test(e.platform))return!0}if(/Mac|iPhone|iPad|iPod/i.test(navigator.userAgent))return!0}return!1}const Ks=u.input.attrs(e=>({type:"text",$size:e.$size||"0.5em"}))`
  font-size: ${i.fontSizes.base};
  background-color: ${i.colors.backgroundLighter};
  border: 1px solid ${i.colors.border};
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: ${i.colors.text};
  font-family: ${i.fonts.body};
  outline: none;
  transition: border-color 0.15s ease-in-out;
  /* here we use the dynamically computed prop */
  margin: ${e=>e.$size};

  &:focus {
    border-color: ${i.colors.accent};
  }

  &::selection {
    background-color: ${i.colors.accent};
    color: ${i.colors.white};
  }
`,qs=u.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`,Js=u.label`
  display: flex;
  flex-direction: column;
  flex: 1;
  cursor: ${e=>e.$disabled?"not-allowed":"pointer"};
  user-select: none;
  text-align: left;
`,Ys=u.span`
  color: ${i.colors.text};
  font-size: ${i.fontSizes.base};
  font-weight: ${i.fontWeights.semiBold};
`,Xs=u.span`
  color: ${i.colors.textDarker};
  font-size: ${i.fontSizes.sm};
  margin-top: 0.25rem;
  line-height: 1.4;
`,Zs=u.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`,Qs=u.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: ${e=>e.$disabled?"not-allowed":"pointer"};
  opacity: ${e=>e.$disabled?.5:1};
`,ea=u.input`
  opacity: 0;
  width: 0;
  height: 0;
`,ta=u.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${e=>e.$checked?i.colors.accent:i.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`,na=u.span`
  position: absolute;
  top: 2px;
  left: ${e=>e.$checked?"18px":"2px"};
  width: 16px;
  height: 16px;
  background-color: ${i.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,Ae=({optionId:e,label:n,description:r,setSelected:o,checked:s,disabled:a=!1,"aria-label":l})=>t.jsxs(qs,{children:[t.jsxs(Js,{htmlFor:e,$disabled:a,children:[t.jsx(Ys,{children:n}),r&&t.jsx(Xs,{children:r})]}),t.jsx(Zs,{children:t.jsxs(Qs,{$disabled:a,htmlFor:e,children:[t.jsx(ea,{type:"checkbox",id:e,checked:s,disabled:a,onChange:c=>o(c.target.checked),"data-testid":`option-${e}`,"aria-label":l}),t.jsx(ta,{$checked:s}),t.jsx(na,{$checked:s})]})})]}),Ue=u.button`
  background-color: transparent;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  border: 1px solid ${i.colors.border};
  border-radius: 6px;
  color: ${i.colors.white};
  display: flex;
  align-items: center;
  padding: 8px 12px;
  text-decoration: none;
  cursor: pointer;
  font-size: ${i.fontSizes.bodySmall};
  line-height: 16px;
  gap: 6px;
  height: 34px;
  font-family: ${i.fonts.body};

  .material-symbols-outlined {
    font-size: ${i.fontSizes.iconMedium} !important;
  }

  &:hover,
  &.active {
    background-color: ${i.colors.buttonHover};
  }
`,it=u.h4`
  font-size: ${i.fontSizes.sm};
  font-weight: ${i.fontWeights.semiBold};
  color: ${i.colors.textDarker};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 1.5rem 0.5rem 0.5rem 0.5rem;

  &:first-of-type {
    margin-top: 0.5rem;
  }
`,st=u.div`
  background-color: ${i.colors.backgroundLight};
  border: 1px solid ${i.colors.border};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 1rem;
  width: 100%;

  & > div {
    border-bottom: 1px solid ${i.colors.border};
    &:last-child {
      border-bottom: none;
    }
  }
`,oa=u.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`,ra=u.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  user-select: none;
  text-align: left;
`,ia=u.span`
  color: ${i.colors.text};
  font-size: ${i.fontSizes.base};
  font-weight: ${i.fontWeights.semiBold};
`,on=u.span`
  color: ${i.colors.textDarker};
  font-size: ${i.fontSizes.sm};
  margin-top: 0.25rem;
  line-height: 1.4;
`,sa=u(on)`
  color: ${i.colors.warningDark};
`,aa=u.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`,la=({isAvailable:e,isInstalled:n,isInstalling:r,onInstall:o})=>{let s,a;return n?(s=t.jsx(on,{children:"The application is installed and available offline."}),a=t.jsx(ue,{size:"sm",disabled:!0,"data-testid":"pwa-installed-button",children:"Installed"})):e?(s=t.jsx(on,{children:"Install the app locally to access it offline without network connectivity."}),r?a=t.jsx(ue,{size:"sm",disabled:!0,"data-testid":"pwa-installing-button",children:"Installing..."}):a=t.jsx(ue,{size:"sm",onClick:o,"data-testid":"pwa-install-button",children:"Install App"})):(s=t.jsx(sa,{children:"PWA installation is not supported by your browser or environment."}),a=t.jsx(ue,{size:"sm",disabled:!0,"data-testid":"pwa-unavailable-button",children:"Unavailable"})),t.jsxs(oa,{children:[t.jsxs(ra,{children:[t.jsx(ia,{children:"Offline App"}),s]}),t.jsx(aa,{children:a})]})},ca=(e,n,r,o)=>{const s={config:e,...n&&n.length>0?{injections:n}:{},guiVersion:kt.version,ergogenVersion:gn("github:ceoloide/ergogen#v4.3.0")},a=JSON.stringify(s);return tr.compressToEncodedURIComponent(a)},da=()=>new URLSearchParams(window.location.search).get("debug")!==null,ua=e=>{var r;const n=da();try{const o=tr.decompressFromEncodedURIComponent(e);if(!o)return console.error("[Share] DECODE_ERROR: Failed to decompress encoded string"),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The encoded data could not be decompressed."};let s;try{s=JSON.parse(o)}catch(l){return console.error("[Share] DECODE_ERROR: Failed to parse decompressed JSON",{parseError:l,decompressedLength:o.length,decompressedPreview:o.substring(0,100)}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The decompressed data is not valid JSON."}}if(!s||typeof s!="object"||!("config"in s)||typeof s.config!="string")return console.error("[Share] VALIDATION_ERROR: Invalid object structure",{parsed:s,hasConfig:s&&typeof s=="object"&&"config"in s,configType:s&&typeof s=="object"&&"config"in s?typeof s.config:"N/A"}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link does not contain a valid configuration. The decoded data is missing required fields or has an invalid structure."};const a=s;return(!a.guiVersion||typeof a.guiVersion!="string")&&(a.guiVersion="0.9.0"),(!a.ergogenVersion||typeof a.ergogenVersion!="string")&&(a.ergogenVersion="github:ergogen/ergogen#v4.2.1"),"injections"in a&&a.injections!==void 0&&(!Array.isArray(a.injections)||!a.injections.every(l=>Array.isArray(l)&&l.length===3&&typeof l[0]=="string"&&typeof l[1]=="string"&&typeof l[2]=="string"))?(console.error("[Share] VALIDATION_ERROR: Invalid injections structure",{injections:a.injections,isArray:Array.isArray(a.injections)}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link contains invalid injections data. Injections must be an array of [type, name, content] tuples."}):(n&&console.log("[Share] DEBUG: Decoded configuration object",{configLength:a.config.length,hasInjections:a.injections!==void 0,injectionsCount:((r=a.injections)==null?void 0:r.length)??0,fullObject:a}),{success:!0,config:a})}catch(o){return console.error("[Share] DECODE_ERROR: Unexpected error during decoding",{error:o,errorMessage:o instanceof Error?o.message:String(o),errorStack:o instanceof Error?o.stack:void 0}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. An unexpected error occurred while decoding."}}},pa=e=>{const{config:n,injections:r,canonical:o}=e;let s=r;if(o&&r&&r.length>0){const h=Sr(o);s=fa(r,h)}const a=s&&s.length>0?s:void 0,l=ca(n,a);return`${window.location.origin+window.location.pathname}#${l}`},Cr=()=>{const e=window.location.hash;if(!e||e.length<=1)return null;const n=e.substring(1);return ua(n)},Sr=e=>{const n=new Set,r=new Set,o=new Set;if(!e||typeof e!="object")return{footprints:n,templates:r,outlines:o};const s=e;if(s.pcbs&&typeof s.pcbs=="object"){for(const a of Object.values(s.pcbs))if(!(!a||typeof a!="object")&&(typeof a.template=="string"&&r.add(a.template),a.footprints&&typeof a.footprints=="object"))for(const l of Object.values(a.footprints))l&&typeof l.what=="string"&&n.add(l.what)}if(s.outlines&&typeof s.outlines=="object")for(const a of Object.values(s.outlines)){if(!a||typeof a!="object")continue;const l=Array.isArray(a)?a:Object.values(a);for(const c of l){const h=c;h&&typeof h.what=="string"&&o.add(h.what)}}return{footprints:n,templates:r,outlines:o}},fa=(e,n)=>!e||e.length===0?[]:e.filter(r=>{const[o,s]=r;return o==="footprint"?n.footprints.has(s):o==="template"?n.templates.has(s):o==="outline"?n.outlines.has(s):!0}),jo=async(e,n,r,o)=>{try{await navigator.clipboard.writeText(e),n(!0),o==null||o(),r.current&&clearTimeout(r.current),r.current=setTimeout(()=>{n(!1)},2500)}catch(s){console.error("Failed to copy shareable URI to clipboard:",s);try{const a=document.createElement("textarea");a.value=e,a.style.position="fixed",a.style.opacity="0",document.body.appendChild(a),a.select();const l=document.execCommand("copy");if(document.body.removeChild(a),!l){console.error("Fallback copy method was rejected by the browser.");return}n(!0),o==null||o(),r.current&&clearTimeout(r.current),r.current=setTimeout(()=>{n(!1)},2500)}catch(a){console.error("Fallback copy method also failed:",a)}}},Er=({config:e,injections:n,onClose:r,"data-testid":o})=>{const s=nr.useMemo(()=>n||[],[n]),[a,l]=p.useState(1),[c,h]=p.useState(!0),[d,g]=p.useState(!1),[m,b]=p.useState(null),[v,x]=p.useState(""),[f,_]=p.useState([]),[j,E]=p.useState(!1),[L,N]=p.useState(!1),I=p.useRef(null),M=p.useRef(null);p.useEffect(()=>{if(!c||j||s.length===0||a!==1)return;let C=!0;g(!0),b(null);const W=pn();if(!W){b("Could not initialize background worker."),g(!1);return}return W.onmessage=F=>{var B;if(!C)return;const D=F.data;if(D.type==="success"){const H=(B=D.results)==null?void 0:B.canonical,{footprints:Z,templates:Q,outlines:T}=Sr(H),U=s.map(([G,ee,V])=>{let y;return G==="footprint"?y=Z.has(ee):G==="template"?y=Q.has(ee):G==="outline"?y=T.has(ee):y=!0,{type:G,name:ee,content:V,checked:y,isEligible:y}}).filter(G=>G.isEligible).map(({type:G,name:ee,content:V,checked:y})=>({type:G,name:ee,content:V,checked:y}));_(U),E(!0)}else D.type==="error"&&b(D.error||"Failed to analyze configuration.");g(!1),W.terminate()},W.onerror=()=>{C&&(b("Worker encountered an error during analysis."),g(!1),W.terminate())},W.postMessage({type:"generate",inputConfig:e,injectionInput:s,requestId:`share-analysis-${Date.now()}`,options:{debug:!0}}),()=>{C=!1,W.terminate()}},[c,j,s,e,a]);const P=p.useRef(0);P.current=c?f.filter(C=>C.checked).length:0;const z=p.useCallback(C=>{O("share_link_copied",{has_injections:P.current>0,injections_count:P.current,source:C})},[]);p.useEffect(()=>{a===2&&v&&jo(v,N,M,()=>{z("auto")})},[v,a,z]),p.useEffect(()=>{const C=W=>{W.key==="Escape"&&r()};return window.addEventListener("keydown",C),()=>{window.removeEventListener("keydown",C)}},[r]),p.useEffect(()=>{a===2&&I.current&&(I.current.focus(),I.current.select())},[a]),p.useEffect(()=>{const C=M;return()=>{C.current&&clearTimeout(C.current)}},[]);const A=C=>{_(W=>W.map((F,D)=>D===C?{...F,checked:!F.checked}:F))},w=()=>{const C=c?f.filter(D=>D.checked):[],W=C.length>0?C.map(D=>[D.type,D.name,D.content]):void 0,F=pa({config:e,injections:W});x(F),l(2)},$=()=>{jo(v,N,M,()=>{z("button")})};return t.jsx(ha,{"data-testid":o,onClick:C=>{C.target===C.currentTarget&&r()},children:t.jsxs(ga,{"data-testid":o&&`${o}-box`,onClick:C=>C.stopPropagation(),children:[t.jsx(ma,{onClick:r,"data-testid":o&&`${o}-close`,"aria-label":"Close dialog",children:t.jsx("span",{className:"material-symbols-outlined",children:"close"})}),a===1?t.jsxs(t.Fragment,{children:[t.jsx($o,{children:"Share Configuration"}),t.jsx(Co,{children:"Configure what content should be included when sharing your keyboard design."}),t.jsx(ba,{children:t.jsxs(wa,{htmlFor:"include-libraries-toggle",children:[t.jsx(xa,{id:"include-libraries-toggle",type:"checkbox",checked:c,onChange:C=>{const W=C.target.checked;h(W),W||(g(!1),b(null))},"aria-label":"Include custom libraries"}),t.jsx(ya,{$checked:c}),t.jsx("span",{children:"Include custom libraries"})]})}),c&&t.jsxs(t.Fragment,{children:[d&&t.jsxs(ka,{children:[t.jsx(_a,{}),t.jsx("span",{children:"Analyzing configuration..."})]}),m&&t.jsx(va,{children:m}),!d&&!m&&s.length===0&&t.jsx(So,{children:"No custom libraries loaded."}),!d&&!m&&s.length>0&&f.length===0&&t.jsx(So,{children:"No custom footprints or libraries are used in this configuration."}),!d&&!m&&f.length>0&&t.jsx(ja,{children:f.map((C,W)=>t.jsxs($a,{children:[t.jsx(Ca,{id:`injection-${C.name}`,type:"checkbox",checked:C.checked,onChange:()=>A(W),"aria-label":C.name}),t.jsx(Ea,{$type:C.type,children:C.type}),t.jsx(Sa,{htmlFor:`injection-${C.name}`,children:C.name})]},`${C.type}-${C.name}`))})]}),t.jsx(Eo,{children:t.jsx(Pa,{onClick:w,disabled:d,children:"Share"})})]}):t.jsxs(t.Fragment,{children:[t.jsx($o,{children:"Shareable Configuration Link"}),t.jsx(Co,{children:"Share this link with others to let them view and use your keyboard configuration, including all of your custom footprints."}),t.jsxs(Ia,{children:[t.jsx(La,{ref:I,type:"text",value:v,readOnly:!0,"data-testid":o&&`${o}-input`,"aria-label":"Share link"}),t.jsx(Eo,{children:t.jsxs(za,{onClick:$,"data-testid":o&&`${o}-copy`,"aria-label":L?"Link copied":"Copy link",children:[t.jsx("span",{className:"material-symbols-outlined",children:L?"check":"content_copy"}),L?"Link copied":"Copy link"]})})]})]})]})})},ha=u.div`
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
`,ga=u.div`
  background-color: ${i.colors.backgroundLight};
  border: 1px solid ${i.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: relative;
`,ma=u.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${i.colors.textDark};
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
    font-size: ${i.fontSizes.iconLarge};
  }

  &:hover {
    background-color: ${i.colors.buttonHover};
    color: ${i.colors.text};
  }
`,$o=u.h2`
  margin: 0 0 1rem 0;
  font-size: ${i.fontSizes.h3};
  color: ${i.colors.text};
  padding-right: 3rem;
`,Co=u.p`
  margin: 0 0 1.5rem 0;
  font-size: ${i.fontSizes.base};
  color: ${i.colors.textDark};
  line-height: 1.5;
`,ba=u.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`,wa=u.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  font-family: ${i.fonts.body};
  font-size: ${i.fontSizes.base};
  color: ${i.colors.text};
`,xa=u.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`,ya=u.span`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 22px;
  background-color: ${e=>e.$checked?i.colors.accent:i.colors.backgroundLighter};
  border: 1px solid ${i.colors.border};
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
    background-color: ${i.colors.white};
    border-radius: 50%;
    transition: transform 0.2s ease;
    transform: ${e=>e.$checked?"translateX(22px)":"translateX(0)"};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }
`,ka=u.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.5rem 0;
  color: ${i.colors.textDark};
`,_a=u.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${i.colors.border};
  border-top: 2px solid ${i.colors.accent};
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
`,va=u.p`
  color: ${i.colors.error};
  font-size: ${i.fontSizes.sm};
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: ${i.colors.errorDark}22;
  border: 1px solid ${i.colors.error};
  border-radius: 6px;
`,So=u.p`
  color: ${i.colors.textDarker};
  font-size: ${i.fontSizes.sm};
  margin: 1rem 0;
  font-style: italic;
`,ja=u.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${i.colors.border};
  border-radius: 6px;
  background-color: ${i.colors.backgroundLighter};
  margin: 1rem 0 1.5rem 0;
  padding: 0.5rem;
`,$a=u.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${i.colors.backgroundLight};
  }
`,Ca=u.input`
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: ${i.colors.accent};
`,Sa=u.label`
  cursor: pointer;
  flex: 1;
  color: ${i.colors.text};
  font-size: ${i.fontSizes.sm};
  user-select: none;
`,Ea=u.span`
  font-size: ${i.fontSizes.xs};
  font-weight: ${i.fontWeights.bold};
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  color: ${i.colors.white};
  background-color: ${e=>{switch(e.$type){case"footprint":return"#007bff";case"outline":return"#e83e8c";case"template":return"#fd7e14";default:return i.colors.border}}};
`,Pa=u.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: ${i.colors.accent};
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  color: ${i.colors.white};
  font-family: ${i.fonts.body};
  font-size: ${i.fontSizes.base};
  font-weight: ${i.fontWeights.semiBold};
  cursor: pointer;
  transition:
    background-color 0.15s ease-in-out,
    transform 0.15s ease-in-out;
  margin-top: 1rem;

  &:hover {
    background-color: ${i.colors.accentDark};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,Ia=u.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: stretch;
`,Eo=u.div`
  display: flex;
  justify-content: center;
  width: 100%;

  @media (min-width: 500px) {
    width: auto;
  }
`,La=u.input`
  flex: 1;
  background-color: ${i.colors.backgroundLighter};
  border: 1px solid ${i.colors.border};
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: ${i.colors.text};
  font-family: ${i.fonts.body};
  font-size: ${i.fontSizes.base};
  outline: none;
  transition: border-color 0.15s ease-in-out;

  &:focus {
    border-color: ${i.colors.accent};
  }

  &::selection {
    background-color: ${i.colors.accent};
    color: ${i.colors.white};
  }
`,za=u.button`
  white-space: nowrap;
  flex-shrink: 0;
  width: 125px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background-color: ${i.colors.accent};
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: ${i.colors.white};
  font-family: ${i.fonts.body};
  font-size: ${i.fontSizes.base};
  cursor: pointer;
  transition:
    background-color 0.15s ease-in-out,
    transform 0.15s ease-in-out;

  .material-symbols-outlined {
    font-size: ${i.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${i.colors.accentDark};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,Ra=e=>e.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled",Po=(e,n)=>{const r=Ra(n);let o=r,s=1;for(;e.has(o);)o=`${r}_${s}`,s++;return e.add(o),o},rn=(e,n)=>{const r=new Map;for(const o of n){const[s,a,l]=o;let c="footprints";s==="outline"?c="outlines":s==="template"&&(c="templates");const h=e.folder(c);if(h){const d=a.split("/"),g=d.pop();let m=h,b=c;for(const v of d){const x=`${b}/${v}`;let f=r.get(x);f||(f=m.folder(v)||m,r.set(x,f)),m=f,b=x}g&&m.file(`${g}.js`,l)}}},Pr=(e,n,r,o,s)=>{var a;if((a=r.demo)!=null&&a.svg&&e.file("demo.svg",r.demo.svg),r.outlines){let l=null;for(const[c,h]of Object.entries(r.outlines))(o||!c.startsWith("_"))&&(h.dxf||h.svg)&&(l||(l=e.folder("outlines")),l&&(h.dxf&&l.file(`${c}.dxf`,h.dxf),h.svg&&l.file(`${c}.svg`,h.svg)))}if(r.pcbs&&Object.keys(r.pcbs).length>0){const l=e.folder("pcbs");if(l)for(const[c,h]of Object.entries(r.pcbs)){const d=c.endsWith(".kicad_pcb")?c:`${c}.kicad_pcb`;l.file(d,h)}}if(r.cases){let l=null;for(const[c,h]of Object.entries(r.cases)){const d=!!h.jscad,g=s&&!!h.stl;(d||g)&&(l||(l=e.folder("cases")),l&&(h.jscad&&l.file(`${c}.jscad`,h.jscad),g&&h.stl&&l.file(`${c}.stl`,h.stl)))}}if(o){const l=e.folder("debug");if(l){l.file("raw.txt",n);for(const[c,h]of Object.entries(r))["canonical","points","units"].includes(c)&&l.file(`${c}.yaml`,JSON.stringify(h,null,2))}}},sn=async(e,n)=>{const r=await e.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),o=new Date().toISOString().replace(/[:.]/g,"-").split("T")[0];Vr.saveAs(r,`${n}-${o}.zip`)},Ir=async(e,n,r,o,s)=>{const a=new un;a.file("config.yaml",n);const l=a.folder("outputs");l&&Pr(l,n,e,o,s),r&&r.length>0&&rn(a,r),await sn(a,"ergogen")},Da=u.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${i.colors.accentSecondary};
  border-radius: 6px;
  padding: 0 0.5em;
  margin-left: 1em;
  font-family: ${i.fonts.body};
  font-size: ${i.fontSizes.bodySmall};
  height: 1.7em;
  min-width: 2.2em;
  color: ${i.colors.white};
  box-sizing: border-box;
  user-select: none;
`;function Aa(){return t.jsx(t.Fragment,{children:t.jsxs("span",{children:[$r()?"⌘":"Ctrl"," ⏎"]})})}const Na=u.div`
  width: 100%;
  height: 3em;
  display: none;
  align-items: center;
  border-bottom: 1px solid ${i.colors.border};
  flex-direction: row;
  gap: 10px;
  padding: 0 1rem;
  flex-shrink: 0;

  @media (max-width: 639px) {
    display: flex;
    padding: 0 0.5rem;
  }
`,Ua=u.div`
  flex-grow: 1;
`,Io=u(Ue)`
  display: none;

  @media (max-width: 475px) {
    display: flex;
  }
`,Wa=u.button`
  background-color: ${i.colors.accentSecondary};
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
  font-family: ${i.fonts.body};
  padding: 8px 12px !important;

  .material-symbols-outlined {
    font-size: ${i.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${i.colors.accentDark};
  }
`,Lo=u.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
`,Oa=u.div`
  display: flex;
  gap: 10px;
  align-items: stretch;
  padding: 10px;

  @media (max-width: 639px) {
    display: none;
  }
`,Fa=u.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
  padding: 0;
`,zo=u(Ts)`
  height: 100%;
`,Ma=u.div`
  height: 100%;
  overflow-y: auto;
`,Ba=u(os)`
  position: relative;
  flex-grow: 1;
  min-height: 0;
`,Ta=u.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`,Ga=u.div`
  height: 100%;
  overflow-y: auto;
  padding: 0.5rem;

  @media (min-width: 640px) {
    padding: 1rem;
  }
`,Ha=u.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 640px) {
    display: none;
  }
`,Va=u.button`
  background: none;
  border: none;
  color: ${i.colors.textDark};
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
    font-size: ${i.fontSizes.iconLarge};
  }

  &:hover {
    background-color: ${i.colors.buttonHover};
    color: ${i.colors.text};
  }

  @media (min-width: 640px) {
    display: none;
  }
`,Ro=u.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: row;

  @media (max-width: 639px) {
    width: ${e=>e.$fullWidth?"100%":"auto"};
  }
`,Do=u.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
`,Ka=u.div`
  display: flex;
  height: 100%;
  width: 100%;
`,qa=({pwaState:e})=>{const n=()=>Math.max(200,window.innerWidth*.33),r=()=>Math.max(150,window.innerWidth*.15),o=()=>Math.max(350,window.innerWidth*.15),[s,a]=p.useState({key:"demo.svg",extension:"svg",content:""}),[l,c]=p.useState(!1),h=w=>{a(w),f!=null&&f.showConfig||f==null||f.setShowDownloads(!1)},[d,g]=p.useState({key:-1,type:"",name:"",content:""}),[m,b]=p.useState(!1),[v,x]=p.useState(window.innerWidth<=639),f=ve(),_=!0;p.useEffect(()=>{const w=()=>{x(window.innerWidth<=639)};return window.addEventListener("resize",w),()=>window.removeEventListener("resize",w)},[]),Kr($r()?"meta+enter":"ctrl+enter",w=>{var $,C;(C=($=w==null?void 0:w.target)==null?void 0:$.closest)!=null&&C.call($,".monaco-editor")||f&&(O("shortcut_used",{action:"generate"}),f.generateNow(tn(f),f.injectionInput,{pointsonly:!1,isManual:!0}))},{enableOnFormTags:!0,preventDefault:!0,ignoreEventWhen:w=>{var $,C;return!!((C=($=w.target)==null?void 0:$.closest)!=null&&C.call($,".monaco-editor"))}}),p.useEffect(()=>{if(d.key===-1||d.name===""||d.content==="")return;const w=[d.type,d.name,d.content];let $=[];Array.isArray(f==null?void 0:f.injectionInput)&&($=[...f.injectionInput]);const C=$.length;if(C===0||C===d.key)$.push(w),g({...d,key:C});else{const W=$[d.key];if(W[0]===d.type&&W[1]===d.name&&W[2]===d.content)return;$=$.map((F,D)=>D===d.key?w:F)}f==null||f.setInjectionInput($)},[f,d]);const j=tn(f),E=Vs(f==null?void 0:f.results,s.key,s.extension,j),L=p.useRef(null),N=!!(f!=null&&f.results);if(p.useEffect(()=>{if(!N){L.current=null;return}if(!E.key||!E.extension)return;const w=`${E.key}|${E.extension}`;L.current!==w&&(L.current=w,O("preview_loaded",{preview_type:E.extension,preview_key:E.key}))},[E.key,E.extension,N]),!f)return null;const I=w=>{const $={...d,name:w.target.value};g($)},M=w=>{if(!Array.isArray(f==null?void 0:f.injectionInput))return;O("injection_deleted",{injection_type:w.type});const $=[...f.injectionInput].filter((C,W)=>W!==w.key);if(f.setInjectionInput($),d.key===w.key)g({key:-1,type:"",name:"",content:""});else if(d.key>=w.key){const C={...d,key:d.key-1};g(C)}},P=()=>{var W;const w=((W=f.getRealtimeConfigInput)==null?void 0:W.call(f))??f.configInput;if(w===void 0)return;O("download_button_clicked",{download_type:"yaml",source:"editor"});const $=document.createElement("a"),C=new Blob([w],{type:"text/yaml"});$.href=URL.createObjectURL(C),$.download="config.yaml",document.body.appendChild($),$.click(),URL.revokeObjectURL($.href),document.body.removeChild($)},z=()=>{var w,$;j&&(O("share_button_clicked",{has_injections:!!((w=f.injectionInput)!=null&&w.length),injections_count:(($=f.injectionInput)==null?void 0:$.length)||0,source:"subheader"}),c(!0))},A=()=>{var w,$,C;!f.results||!j||f.isGenerating||f.isJscadConverting||(O("archive_single_downloaded",{has_injections:!!((w=f.injectionInput)!=null&&w.length),injections_count:(($=f.injectionInput)==null?void 0:$.length)||0,stored_configs_count:((C=f.configs)==null?void 0:C.length)||0,source:"subheader"}),Ir(f.results,j,f.injectionInput,f.debug,f.stlPreview))};return t.jsxs(t.Fragment,{children:[l&&t.jsx(Er,{config:j,injections:f.injectionInput||[],onClose:()=>c(!1)}),t.jsxs(Fa,{children:[!f.showSettings&&t.jsxs(Na,{children:[t.jsx(Ue,{className:f.showConfig?"active":"",onClick:()=>f.setShowConfig(!0),"aria-label":"Show configuration panel","data-testid":"mobile-config-button",children:"Config"}),t.jsx(Ue,{className:f.showConfig?"":"active",onClick:()=>f.setShowConfig(!1),"aria-label":"Show outputs panel","data-testid":"mobile-outputs-button",children:"Outputs"}),t.jsx(Ua,{}),f.showConfig&&t.jsxs(t.Fragment,{children:[t.jsx(Wa,{onClick:()=>f.generateNow(j,f.injectionInput,{pointsonly:!1,isManual:!0}),"aria-label":"Generate configuration","data-testid":"mobile-generate-button",children:t.jsx("span",{className:"material-symbols-outlined",children:"refresh"})}),t.jsx(Io,{onClick:z,disabled:!j,"aria-label":"Share configuration","data-testid":"mobile-share-button",children:t.jsx("span",{className:"material-symbols-outlined",children:"share"})}),t.jsx(Ue,{onClick:P,"aria-label":"Download configuration","data-testid":"mobile-download-button",children:t.jsx("span",{className:"material-symbols-outlined",children:"download"})})]}),!f.showConfig&&t.jsxs(t.Fragment,{children:[t.jsx(Io,{onClick:A,disabled:f.isGenerating||f.isJscadConverting,"aria-label":"Download archive of all generated files","data-testid":"mobile-download-outputs-button",children:t.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),t.jsx(Ue,{onClick:()=>f.setShowDownloads(!f.showDownloads),"aria-label":f.showDownloads?"Hide downloads panel":"Show downloads panel","data-testid":"mobile-downloads-toggle-button",children:t.jsx("span",{className:"material-symbols-outlined",children:f.showDownloads?"expand_content":"collapse_content"})})]})]}),t.jsx(Ka,{children:f.showSettings?t.jsxs(t.Fragment,{children:[t.jsx(Mt,{initialWidth:o(),minWidth:150,maxWidth:"70%",side:"left","data-testid":"settings-panel",style:{display:m&&v?"none":void 0},children:t.jsxs(Ga,{children:[t.jsxs(Ta,{children:[t.jsx(it,{children:"General"}),t.jsxs(st,{children:[t.jsx(Ae,{optionId:"autogen",label:"Auto-generate",description:"Automatically generate new outputs and update previews on changes.",setSelected:f.setAutoGen,checked:f.autoGen,"aria-label":"Enable auto-generate"}),t.jsx(Ae,{optionId:"autogen3d",label:"Auto-generate PCB & 3D",description:"Build 3D models and PCB files during generation (can be slow).",setSelected:f.setAutoGen3D,checked:f.autoGen3D,"aria-label":"Enable auto-generate PCB and 3D (slow)"}),t.jsx(Ae,{optionId:"debug",label:"Debug",description:"Include debug files in the outputs.",setSelected:f.setDebug,checked:f.debug,"aria-label":"Enable debug mode"})]}),t.jsx(it,{children:"Previews (Experimental)"}),t.jsxs(st,{children:[t.jsx(Ae,{optionId:"kicanvasPreview",label:"KiCad Preview",description:"Render interactive PCB layouts using KiCanvas.",setSelected:f.setKicanvasPreview,checked:f.kicanvasPreview,"aria-label":"Enable KiCad preview (experimental)"}),t.jsx(Ae,{optionId:"stlPreview",label:"STL Preview",description:"Render 3D preview of generated cases.",setSelected:f.setStlPreview,checked:f.stlPreview,"aria-label":"Enable STL preview (experimental)"})]}),t.jsx(it,{children:"Privacy"}),t.jsx(st,{children:t.jsx(Ae,{optionId:"sendUsageMetrics",label:"Send Usage Metrics",description:_?"Help improve Ergogen Web UI by sharing anonymous usage statistics.":"Unavailable: this copy of Ergogen Web UI was built without an analytics tag ID, so no usage statistics are sent.",setSelected:f.setSendUsageMetrics,checked:_&&f.sendUsageMetrics,disabled:!_,"aria-label":"Send usage metrics"})}),e&&t.jsxs(t.Fragment,{children:[t.jsx(it,{children:"Offline"}),t.jsx(st,{children:t.jsx(la,{isAvailable:e.isAvailable,isInstalled:e.isInstalled,isInstalling:e.isInstalling,onInstall:e.onInstall})})]})]}),t.jsx(Ns,{setInjectionToEdit:g,deleteInjection:M,injectionToEdit:d,onInjectionSelect:()=>b(!0),"data-testid":"injections-container"})]})}),t.jsx(Ro,{$fullWidth:m&&v,children:t.jsxs(Lo,{children:[v&&t.jsxs(Ha,{children:[t.jsxs(ft,{as:"h4",style:{marginTop:0},children:[d.type?d.type.charAt(0).toUpperCase()+d.type.slice(1):"Footprint"," ","name"]}),t.jsx(Va,{onClick:()=>{b(!1),g({key:-1,type:"",name:"",content:""})},"aria-label":"Close editor","data-testid":"mobile-editor-close",children:t.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),!v&&t.jsxs(ft,{as:"h4",children:[d.type?d.type.charAt(0).toUpperCase()+d.type.slice(1):"Footprint"," ","name"]}),t.jsx(Ks,{value:d.name,onChange:I,disabled:d.key===-1,"aria-label":`${d.type?d.type.charAt(0).toUpperCase()+d.type.slice(1):"Footprint"} name`,"data-testid":"footprint-name-input"}),t.jsxs(ft,{as:"h4",children:[d.type?d.type.charAt(0).toUpperCase()+d.type.slice(1):"Footprint"," ","code"]}),t.jsx(rs,{injection:d,setInjection:g,options:{readOnly:d.key===-1}})]})})]}):t.jsxs(t.Fragment,{children:[f.showConfig&&t.jsx(Mt,{initialWidth:n(),minWidth:250,maxWidth:"60%",side:"left","data-testid":"config-panel",children:t.jsxs(Lo,{children:[t.jsx(Ba,{"data-testid":"config-editor"}),t.jsxs(Oa,{children:[t.jsx(Ye,{onClick:()=>f.generateNow(j,f.injectionInput,{pointsonly:!1,isManual:!0}),"aria-label":"Generate configuration","data-testid":"generate-button",children:t.jsxs("span",{style:{display:"flex",alignItems:"center",width:"100%",justifyContent:"center"},children:[t.jsx("span",{children:"Generate"}),t.jsx(Da,{children:Aa()})]})}),t.jsx(Ue,{onClick:P,"aria-label":"Download configuration","data-testid":"download-config-button",children:t.jsx("span",{className:"material-symbols-outlined",children:"download"})})]})]})}),t.jsx(Ro,{$fullWidth:!f.showConfig,children:f.showDownloads?t.jsxs(t.Fragment,{children:[t.jsx(Do,{children:t.jsx(zo,{"data-testid":`${E.key}-file-preview`,previewExtension:E.extension,previewKey:`${E.key}-${f.resultsVersion}`,previewContent:E.content})}),t.jsx(Mt,{initialWidth:r(),minWidth:105,maxWidth:"30%",side:"right","data-testid":"downloads-panel",children:t.jsx(Ma,{children:t.jsx(ms,{setPreview:h,previewKey:E.key,"data-testid":"downloads-container"})})})]}):t.jsx(Do,{children:t.jsx(zo,{"data-testid":`${E.key}-file-preview`,previewExtension:E.extension,previewKey:`${E.key}-${f.resultsVersion}`,previewContent:E.content})})})]})})]})]})},Ja={label:"Absolem",author:"MrZealot",value:`meta:
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
    distance: 223.7529778`},Ya={label:"Atreus",author:"MrZealot",value:`points:
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
`},Xa={label:"A. Dux",author:"tapioki",value:`meta:
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
`},Za={label:"Corney Island",author:"ceoloide",value:`points:
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
          rotate: 90`},an={label:"Empty YAML configuration",author:"ceoloide",value:`meta:
  engine: 4.1.0
units:
points:
  zones:
    matrix:
outlines:
pcbs:
cases:
`},Qa={label:"Wubbo",author:"cache.works",value:`meta:
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
`},el={label:"Sweep-like",author:"jcmkk3",value:`meta:
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
`},tl={label:"Reviung41",author:"jcmkk3",value:`meta:
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
`},nl={label:"Tiny20",author:"enzocoralc",value:`meta:
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
`},ol={label:"Alpha",author:"jcmkk3",value:`points:
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
`},rl={label:"Plank",author:"cache.works",value:`meta:
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
`},il={label:"Curly-45",author:"peterjc",value:`meta:
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
`},sl={label:"Briefs 56",author:"ceoloide",value:`# Inspired by the Dygma Sonsei
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
`},al={label:"Willy 50",author:"ceoloide",value:`# Inspired by the Keychron Orca Echo
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
`},ll=[an],cl=[Ja,Ya],dl=[Xa,Za,el,tl,nl],ul=[Qa,ol,rl,il,sl,al],pl=[{label:"Empty configurations",options:ll},{label:"Simple (points only)",options:cl},{label:"Complete (with pcb)",options:dl},{label:"Miscellaneous",options:ul}],fl=e=>{var o;const n=fe.load(e.value),r=((o=n==null?void 0:n.meta)==null?void 0:o.engine)??(n==null?void 0:n["meta.engine"]);return r===null?void 0:r},hl=(e,n=Xe())=>{const r=fl(e);return r===void 0?!0:typeof r=="string"&&ji(n,r)},gl=(e=Xe())=>pl.map(n=>({...n,options:n.options.filter(r=>hl(r,e))})).filter(n=>n.options.length>0),ml=async e=>new Promise((n,r)=>{const o=new FileReader;o.onload=s=>{var a;(a=s.target)!=null&&a.result&&typeof s.target.result=="string"?n(s.target.result):r(new Error("Failed to read file as text"))},o.onerror=()=>r(new Error("Failed to read file")),o.readAsText(e)}),bl=async e=>{const r=e.name.toLowerCase().split(".").pop(),o=r==="zip"||r==="ekb";if(Zt(e.size,o),r==="yaml"||r==="yml"||r==="json")return{config:await ml(e),footprints:[],outlines:[],templates:[]};if(o){const s=await e.arrayBuffer(),a=await Ii(s),l=a.injections.filter(d=>d.type==="footprint").map(d=>({name:d.name,content:d.content})),c=a.injections.filter(d=>d.type==="outline").map(d=>({name:d.name,content:d.content})),h=a.injections.filter(d=>d.type==="template").map(d=>({name:d.name,content:d.content}));return{config:a.config,footprints:l,outlines:c,templates:h}}else throw new Error("Unsupported file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")},ln=()=>t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-github",viewBox:"0 0 98 96",children:t.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z",fill:"currentColor"})}),Ao=()=>t.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 4.2333332 4.2333335",version:"1.1",fill:"currentColor",children:[t.jsxs("defs",{children:[t.jsxs("linearGradient",{id:"linearGradient6924-6",children:[t.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:0},offset:"0"}),t.jsx("stop",{offset:"0.49517274",style:{stopColor:"#ffffff",stopOpacity:.3}}),t.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:.3},offset:"1"})]}),t.jsx("linearGradient",{id:"linearGradient6918-3",x1:"42519.285",y1:"-7078.7891",x2:"42575.336",y2:"-6966.9307",gradientUnits:"userSpaceOnUse",href:"#linearGradient6924-6"})]}),t.jsxs("g",{transform:"matrix(0.06551432,0,0,0.06551432,-2.232417,-1.431776)",children:[t.jsx("path",{id:"path6733-5",style:{fontVariationSettings:"normal",opacity:1,vectorEffect:"none",fill:"url(#linearGradient6918-3)",fillOpacity:1,stroke:"none",strokeWidth:3.67846,strokeLinecap:"butt",strokeLinejoin:"miter",strokeMiterlimit:2,strokeDashoffset:0,strokeOpacity:1,paintOrder:"stroke markers fill",stopColor:"#000000",stopOpacity:1},d:"m 42519.285,-7078.7891 a 0.76086879,0.56791688 0 0 0 -0.738,0.6739 l 33.586,125.8886 a 87.182358,87.182358 0 0 0 39.381,-33.7636 l -71.565,-92.5196 a 0.76086879,0.56791688 0 0 0 -0.664,-0.2793 z",transform:"matrix(0.37058478,0,0,0.37058478,-15690.065,2662.0533)"}),t.jsx("path",{id:"path360787",style:{opacity:1,fill:"#ffffff",fillOpacity:1,strokeWidth:17.0055,paintOrder:"markers fill stroke",stopColor:"#000000"},d:"m 11249.461,-1883.6961 c -12.74,0 -23.067,10.3275 -23.067,23.0671 0,4.3335 1.22,8.5795 3.522,12.2514 l 19.232,-24.8636 c 0.138,-0.1796 0.486,-0.1796 0.624,0 l 19.233,24.8646 c 2.302,-3.6721 3.523,-7.9185 3.523,-12.2524 0,-12.7396 -10.327,-23.0671 -23.067,-23.0671 z",transform:"matrix(1.4006354,0,0,1.4006354,-15690.065,2662.0533)"})]})]}),No=()=>t.jsx("svg",{width:"16",height:"16",viewBox:"0 0 212 212",fill:"none",stroke:"currentColor",children:t.jsxs("g",{transform:"translate(6,6)",children:[t.jsx("path",{d:"M58 168 v-98 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),t.jsx("path",{d:"M58 168 v-30 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),t.jsx("circle",{cx:"142",cy:"20",r:"18",strokeWidth:"15"}),t.jsx("circle",{cx:"142",cy:"88",r:"18",strokeWidth:"15"}),t.jsx("circle",{cx:"58",cy:"180",r:"18",strokeWidth:"15"})]})}),cn=u.div`
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid ${i.colors.accent};
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
`,wl=u.div`
  background-color: ${i.colors.background};
  color: ${i.colors.white};
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: border-color 0.2s ease;

  ${e=>e.$isDragging&&`
    border: 3px dashed ${i.colors.accent};
    border-radius: 8px;
  `}
`,xl=u.div`
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
`,yl=u.div`
  background-color: ${i.colors.backgroundLight};
  border: 3px dashed ${i.colors.accent};
  border-radius: 8px;
  padding: 2rem;
  font-size: ${i.fontSizes.h3};
  color: ${i.colors.text};
  text-align: center;
`,kl=u.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 640px) {
    padding: 1rem 0.5rem;
  }
`,_l=u.h1`
  font-size: ${i.fontSizes.h1};
  text-align: center;
  margin-bottom: 1rem;
`,vl=u.p`
  font-size: ${i.fontSizes.lg};
  text-align: center;
  margin-bottom: 3rem;
  color: ${i.colors.textDark};
`,jl=u.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`,Bt=u.div`
  background-color: ${i.colors.backgroundLight};
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid ${i.colors.border};
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
    color: ${i.colors.textDarker};
    margin-bottom: 1.5rem;
    flex-grow: 1;
  }
`,$l=u.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;

  button {
    flex-shrink: 0;
  }
`,Cl=u.div`
  display: flex;
  align-items: stretch;
  flex: 1;
  min-width: 0;
  background-color: ${i.colors.backgroundLighter};
  border: 1px solid ${i.colors.border};
  border-radius: 6px;
  box-sizing: border-box;
  transition: border-color 0.15s ease-in-out;

  &:focus-within {
    border-color: ${i.colors.accent};
  }
`,Sl=u.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  user-select: none;
`,El=u.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: transparent;
  border: none;
  padding: 0 0.5rem 0 0.75rem;
  cursor: pointer;
  height: 100%;
  color: ${i.colors.white};

  transition: background-color 0.15s ease-in-out;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;

  &:hover {
    background-color: ${i.colors.buttonHover};
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
    color: ${i.colors.textDarker};
    display: block;
    margin-right: -0.15rem;
  }
`,Pl=u.div`
  width: 1px;
  background-color: ${i.colors.border};
  margin: 0.75rem 0;
  flex-shrink: 0;
`,Il=u.input`
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  padding: 1rem 1rem 1rem 0.5rem;
  color: ${i.colors.text};
  font-family: ${i.fonts.body};
  font-size: ${i.fontSizes.base};
  outline: none;

  &::selection {
    background-color: ${i.colors.accent};
    color: ${i.colors.white};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`,Ll=u.div`
  position: absolute;
  top: 105%;
  left: 0;
  background-color: ${i.colors.backgroundLight};
  border: 1px solid ${i.colors.border};
  border-radius: 6px;
  padding: 0.25rem 0;
  min-width: 130px;
  z-index: 105;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
`,Tt=u.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  font-size: ${i.fontSizes.bodySmall};
  color: ${({$active:e})=>e?i.colors.white:i.colors.textDark};
  background-color: ${({$active:e})=>e?i.colors.accent:"transparent"};
  cursor: pointer;

  &:hover {
    background-color: ${({$active:e})=>e?i.colors.accent:i.colors.backgroundLighter};
    color: ${i.colors.white};
  }

  svg {
    width: 16px;
    height: 16px;
    color: currentColor;
    display: block;
  }
`,zl=u(ue)`
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

  ${cn} {
    margin-right: 0;
  }
`,Rl=u.input`
  display: none;
`,Uo=u.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`,Wo=u.div`
  background-color: ${i.colors.backgroundLight};
  border-radius: 8px;
  border: 1px solid ${i.colors.border};
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
`,Dl=u.img`
  width: 100%;
  height: 150px;
  object-fit: contain;
  padding: 8px;
  box-sizing: border-box;
  background-color: ${i.colors.backgroundLighter};
`,Oo=u.div`
  padding: 1rem;
  font-weight: ${i.fontWeights.semiBold};
  text-align: center;
`,Al=u.div`
  width: 100%;
  height: 150px;
  padding: 8px;
  box-sizing: border-box;
  background-color: ${i.colors.backgroundLighter};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`,Nl=u.div`
  width: 100%;
  height: 150px;
  box-sizing: border-box;
  background-color: ${i.colors.backgroundLighter};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${i.colors.textDarker};

  .material-symbols-outlined {
    font-size: 4rem;
  }
`,Ul=()=>{const e=Xe(),n=p.useMemo(()=>gl(e).flatMap(y=>y.options).filter(y=>y.label!=="Empty YAML configuration"),[e]),r=dn(),o=ve(),[s,a]=p.useState(""),[l,c]=p.useState("github"),[h,d]=p.useState(!1),[g,m]=p.useState(!1),b=h||g,[v,x]=p.useState(!1),f=p.useRef(null),[_,j]=p.useState(!1);p.useEffect(()=>{const y=K=>{f.current&&!f.current.contains(K.target)&&j(!1)};return document.addEventListener("mousedown",y),()=>document.removeEventListener("mousedown",y)},[]);const[E,L]=p.useState(!1),N=y=>{a(y),y.includes("github.com/")?c("github"):y.includes("codeberg.org/")?c("codeberg"):(y.startsWith("http://")||y.startsWith("https://")||y.includes("/")&&!y.includes("github.com/")&&!y.includes("codeberg.org/")&&y.split("/")[0].includes("."))&&c("forgejo")},{currentConflict:I,processInjectionsWithConflictResolution:M,handleConflictResolution:P,handleConflictCancel:z}=vt({setInjectionInput:y=>o==null?void 0:o.setInjectionInput(y),setConfigInput:y=>o==null?void 0:o.setConfigInput(y),generateNow:async(y,K,q)=>{o&&await o.generateNow(y,K,q)},getCurrentInjections:()=>(o==null?void 0:o.injectionInput)||[],onComplete:async()=>{x(!0)},setError:y=>o==null?void 0:o.setError(y)});p.useEffect(()=>{const y=new URLSearchParams(window.location.search),K=y.has("github")||y.has("codeberg")||y.has("forgejo")||y.has("gitea");(v||K)&&(o!=null&&o.configInput)&&(r("/"),x(!1))},[v,o==null?void 0:o.configInput,r]),p.useEffect(()=>{var y;(y=o==null?void 0:o.pruneDeletedConfigs)==null||y.call(o)},[o]);const A=async y=>{if(o){const K=y===an.value;let q="unknown";if(K)q="empty_configuration";else{const te=n.find(J=>J.value===y);te&&(q=te.label.toLowerCase().replace(/\s+/g,"_"))}O("example_loaded",{example_name:q,is_empty:K}),o.createNewConfig(y),await o.generateNow(y,o.injectionInput,{pointsonly:!1}),x(!0)}},w=async y=>{if(o){const K=o.configs.find(q=>q.id===y);K&&(o.selectConfig(y),O("saved_config_loaded",{stored_configs_count:o.configs.length}),await o.generateNow(K.config,o.injectionInput,{pointsonly:!1}),x(!0))}},C=[...(o==null?void 0:o.configs)||[]].sort((y,K)=>new Date(K.updatedAt).getTime()-new Date(y.updatedAt).getTime()).slice(0,4),W=async(y,K,q,te,J=null,se)=>{if(!o)throw new Error("Configuration context not available");const ie=wr(y,K,q);await M(ie,te,J,se)},F=async(y,K)=>{await P(y,K)},D=()=>{z(),d(!1),m(!1),o==null||o.setIsGenerating(!1)},B=()=>{if(!s||!o)return;const{setError:y,clearError:K,setIsGenerating:q}=o;m(!0),q(!0),K(),O("repo_loaded",{provider:l});let te=s.trim();if(!te.includes("://")&&!te.includes("github.com")&&!te.includes("codeberg.org"))if(l==="codeberg")te=`https://codeberg.org/${te}`;else if(l==="forgejo"){const J=te.split("/");if(J.length>=2&&J[0].includes("."))te=`https://${te}`;else{y("Forgejo/Gitea requires a URL including the host (e.g., host/owner/repo)"),m(!1),q(!1);return}}else te=`https://github.com/${te}`;xr(te).then(async J=>{if(o){J.rateLimitWarning&&y(J.rateLimitWarning);try{o.createNewConfig(J.config),await W(J.footprints,J.outlines,J.templates||[],J.config)}catch(se){throw new Error(`Failed to process footprints: ${se instanceof Error?se.message:"Unknown error"}`)}}}).catch(J=>{y(`Failed to load from ${l==="github"?"GitHub":l==="codeberg"?"Codeberg":"Forgejo/Gitea"} repository: ${J.message}`),o==null||o.setInfo(null),m(!1),q(!1)}).finally(()=>{m(!1)})},H=p.useRef(null),Z=()=>{var y;(y=H.current)==null||y.click()},Q=async y=>{if(!o)return;const{setError:K,clearError:q,setIsGenerating:te}=o;d(!0),te(!0),q(),O("local_file_loaded",{file_type:pi(y.name),file_size:y.size});try{const J=await bl(y);o.createNewConfig(J.config),await W(J.footprints,J.outlines,J.templates||[],J.config)}catch(J){K(`Failed to load local file: ${J instanceof Error?J.message:"Unknown error"}`),o.setInfo(null),d(!1),te(!1)}finally{d(!1)}},T=async y=>{var q;const K=(q=y.target.files)==null?void 0:q[0];K&&(y.target.value="",await Q(K))},U=y=>{y.preventDefault(),y.stopPropagation(),!b&&L(!0)},G=y=>{y.preventDefault(),y.stopPropagation()},ee=y=>{if(y.preventDefault(),y.stopPropagation(),b)return;const K=y.currentTarget,q=y.relatedTarget;(!q||!K.contains(q))&&L(!1)},V=async y=>{if(y.preventDefault(),y.stopPropagation(),b)return;L(!1);const K=Array.from(y.dataTransfer.files),q=[".yaml",".yml",".json",".zip",".ekb"],te=K.find(J=>{const se=J.name.toLowerCase();return q.some(ie=>se.endsWith(ie))});te?await Q(te):K.length>0&&o&&o.setError("Invalid file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")};return t.jsxs(wl,{$isDragging:E,onDragEnter:U,onDragOver:G,onDragLeave:ee,onDrop:V,"data-testid":"welcome-page-wrapper",children:[t.jsx(xl,{$isVisible:E,children:t.jsx(yl,{children:"Drop file here to load configuration"})}),I&&t.jsx(xt,{injectionName:I.name,injectionType:I.type,onResolve:F,onCancel:D,"data-testid":"conflict-dialog"}),t.jsxs(kl,{children:[t.jsx(_l,{children:"Ergogen Web UI"}),t.jsxs(vl,{children:["A web-based interface for Ergogen, the ergonomic keyboard generator.",t.jsx("br",{}),"Start a new design below."]}),t.jsxs(jl,{children:[t.jsxs(Bt,{children:[t.jsx("h2",{children:"Start Fresh"}),t.jsx("p",{children:"Begin with a completely blank slate."}),t.jsx(ue,{onClick:()=>A(an.value),"aria-label":"Start with empty configuration","data-testid":"empty-config-button",children:"Empty Configuration"})]}),t.jsxs(Bt,{children:[t.jsx("h2",{children:"From Local File"}),t.jsx("p",{children:"Load a configuration from your computer. Supports *.yaml, *.json, *.zip, and *.ekb files."}),t.jsx(Rl,{ref:H,type:"file",accept:".yaml,.yml,.json,.zip,.ekb",onChange:T,disabled:b,"aria-label":"Select local file to load","data-testid":"local-file-input"}),t.jsx(ue,{onClick:Z,disabled:b,"aria-label":"Select local file to load","data-testid":"local-file-button",children:h?t.jsxs(t.Fragment,{children:[t.jsx(cn,{})," Loading..."]}):"Choose File"})]}),t.jsxs(Bt,{children:[t.jsx("h2",{children:"From Repo"}),t.jsx("p",{children:'Link to a YAML config file on a Git provider (e.g. GitHub, Codeberg, Forgejo), or simply a repository name like "user/repo".'}),t.jsx($l,{children:t.jsxs(Cl,{children:[t.jsxs(Sl,{ref:f,children:[t.jsxs(El,{type:"button",onClick:()=>j(!_),disabled:b,"aria-label":"Repository provider source","data-testid":"repo-provider-trigger",children:[l==="github"?t.jsx(ln,{}):l==="codeberg"?t.jsx(Ao,{}):t.jsx(No,{}),t.jsx("span",{className:"material-symbols-outlined",children:"arrow_drop_down"})]}),_&&t.jsxs(Ll,{children:[t.jsxs(Tt,{$active:l==="github",onClick:()=>{c("github"),j(!1)},children:[t.jsx(ln,{}),"GitHub"]}),t.jsxs(Tt,{$active:l==="codeberg",onClick:()=>{c("codeberg"),j(!1)},children:[t.jsx(Ao,{}),"Codeberg"]}),t.jsxs(Tt,{$active:l==="forgejo",onClick:()=>{c("forgejo"),j(!1)},children:[t.jsx(No,{}),"Forgejo"]})]})]}),t.jsx(Pl,{}),t.jsx(Il,{placeholder:l==="forgejo"?"host/user/repo":"user/repo",value:s,onChange:y=>N(y.target.value),onKeyDown:y=>{y.key==="Enter"&&!b&&s.trim()!==""&&(y.preventDefault(),B())},disabled:b,"aria-label":"Repository URL or path","data-testid":"repo-input"}),t.jsx(zl,{onClick:B,disabled:b||!s,"aria-label":"Load configuration from repository","data-testid":"repo-load-button",children:g?t.jsx(cn,{}):t.jsx("span",{className:"material-symbols-outlined",style:{display:"block"},children:"cloud_download"})})]})})]})]}),C.length>0&&t.jsxs(t.Fragment,{children:[t.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:i.fontSizes.h2},children:"Pick up where you left"}),t.jsx(Uo,{style:{marginBottom:"3rem"},children:C.map(y=>t.jsxs(Wo,{onClick:()=>w(y.id),"aria-label":`Load ${y.name} configuration`,"data-testid":`saved-config-${y.name.toLowerCase().replace(/\s+/g,"-")}`,children:[y.previewSvg?t.jsx(Al,{dangerouslySetInnerHTML:{__html:y.previewSvg}}):t.jsx(Nl,{children:t.jsx("span",{className:"material-symbols-outlined",children:"keyboard_off"})}),t.jsx(Oo,{children:y.name})]},y.id))})]}),t.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:i.fontSizes.h2},children:"Or start from an example"}),t.jsx(Uo,{children:n.map(y=>t.jsxs(Wo,{onClick:()=>A(y.value),"aria-label":`Load ${y.label} example`,"data-testid":`example-${y.label.toLowerCase().replace(/\s+/g,"-")}`,children:[t.jsx(Dl,{src:`/images/previews/${y.label.toLowerCase().replace(/[\s()]/g,"_")}.svg`,alt:`${y.label} preview`}),t.jsx(Oo,{children:y.label})]},y.label))})]})]})},Lr=({versionInfo:e,"data-testid":n})=>{const[r,o]=p.useState(!1),s=p.useRef(null),a=()=>{s.current&&clearTimeout(s.current),o(!0)},l=()=>{s.current=setTimeout(()=>{o(!1)},250)},c=()=>{s.current&&clearTimeout(s.current)},h=()=>{s.current=setTimeout(()=>{o(!1)},250)},d=g=>{g.stopPropagation(),o(m=>!m)};return p.useEffect(()=>{if(!r)return;const g=()=>{o(!1)};return window.addEventListener("click",g),()=>{window.removeEventListener("click",g)}},[r]),p.useEffect(()=>()=>{s.current&&clearTimeout(s.current)},[]),t.jsxs(Wl,{onMouseEnter:a,onMouseLeave:l,"data-testid":n,children:[t.jsx(Ol,{onClick:d,"data-testid":n&&`${n}-badge`,"aria-label":"Custom Ergogen version indicator",children:t.jsx("span",{className:"material-symbols-outlined",children:"science"})}),r&&t.jsxs(Fl,{onMouseEnter:c,onMouseLeave:h,onClick:g=>g.stopPropagation(),"data-testid":n&&`${n}-popover`,children:[t.jsx(Ml,{children:"Custom Ergogen Version"}),t.jsx(Bl,{children:"This website is running a custom version of Ergogen for development and preview purposes."}),t.jsxs(Tl,{href:e.url,target:"_blank",rel:"noopener noreferrer","data-testid":n&&`${n}-link`,children:[t.jsx("span",{children:e.label}),t.jsx("span",{className:"material-symbols-outlined open-icon",children:"open_in_new"})]})]})]})},Wl=u.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  transform: translateY(-5px);
`,Ol=u.span`
  background-color: ${i.colors.accent};
  color: ${i.colors.white};
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
    background-color: ${i.colors.accentDark};
  }
`,Fl=u.div`
  position: absolute;
  top: 100%;
  left: 4px;
  margin-top: 6px;
  background-color: ${i.colors.backgroundLight};
  border: 1px solid ${i.colors.border};
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
`,Ml=u.div`
  font-size: 12px;
  font-weight: ${i.fontWeights.semiBold};
  color: ${i.colors.white};
`,Bl=u.div`
  font-size: 11px;
  color: ${i.colors.textDark};
  line-height: 1.4;
`,Tl=u.a`
  font-size: 11px;
  color: ${i.colors.accent};
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
  font-weight: ${i.fontWeights.semiBold};
  align-self: flex-start;
  word-break: break-all;

  .open-icon {
    font-size: 11px !important;
  }

  &:hover {
    color: ${i.colors.accentDark};
    text-decoration: underline;
  }
`,Gl=yt`
  0%   { box-shadow: 0 0 0 0   ${i.colors.accent}99; }
  70%  { box-shadow: 0 0 0 6px ${i.colors.accent}00; }
  100% { box-shadow: 0 0 0 0   ${i.colors.accent}00; }
`,Hl=yt`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`,Vl=u.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  height: 28px;
  background-color: ${i.colors.backgroundLight};
  border: 1px solid ${i.colors.border};
  border-radius: 6px;
  color: ${i.colors.white};
  font-size: 11px;
  font-weight: ${i.fontWeights.semiBold};
  cursor: pointer;
  white-space: nowrap;
  animation: ${Gl} ${e=>e.$isUpdating?"0.6s":"2s"}
    ease-out infinite;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  .material-symbols-outlined {
    font-size: 14px !important;
    ${e=>e.$isUpdating&&er`
        animation: ${Hl} 1s linear infinite;
      `}
  }

  &:hover {
    background-color: ${i.colors.backgroundLighter};
  }

  &:disabled {
    cursor: default;
    background-color: ${i.colors.backgroundLight};
    opacity: 0.95;
  }
`,Kl=({onClick:e,"data-testid":n})=>{const[r,o]=p.useState(!1),s=()=>{o(!0),e()};return t.jsxs(Vl,{onClick:s,disabled:r,$isUpdating:r,"aria-label":r?"Updating version...":"Update available — click to reload and apply","data-testid":n??"update-chip",children:[t.jsx("span",{className:"material-symbols-outlined","aria-hidden":"true",children:r?"sync":"update"}),r?"Updating version...":"Update Available"]})},ql=u.header`
  width: 100%;
  height: 3em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  background-color: ${i.colors.background};
  flex-shrink: 0;
  position: relative;
  z-index: 100;
  border-bottom: 1px solid ${i.colors.border};

  @media (max-width: 639px) {
    padding: 0 0.5rem;
    border-bottom: none;
  }
`,Jl=u.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: row;
  flex-grow: 1;
  min-width: 0;
  width: 100%;
`,Yl=u.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,Xl=u.div`
  display: flex;
  align-items: center;
  gap: 6px;
`,Zl=u.div`
  font-size: ${i.fontSizes.base};
  font-weight: ${i.fontWeights.semiBold};
  color: ${i.colors.white};
  display: flex;
  align-items: center;
  @media (max-width: 639px) {
    display: none;
  }
`,$t=u.button`
  background-color: transparent;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  border: 1px solid ${i.colors.border};
  border-radius: 6px;
  color: ${i.colors.white};
  display: flex;
  align-items: center;
  padding: 8px 12px;
  text-decoration: none;
  cursor: pointer;
  font-size: ${i.fontSizes.bodySmall};
  line-height: 16px;
  gap: 6px;
  height: 34px;

  .material-symbols-outlined {
    font-size: ${i.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${i.colors.buttonHover};
  }
`,Ql=u($t)`
  flex-shrink: 0;
`,ec=u($t)`
  background-color: ${i.colors.accent};
  border-color: ${i.colors.accent};

  &:hover {
    background-color: ${i.colors.accentDark};
    border-color: ${i.colors.accentDarker};
  }

  @media (max-width: 375px) {
    display: none;
  }
`,tc=u.span`
  @media (max-width: 510px) {
    display: none;
  }
`,Fo=u($t)`
  @media (max-width: 475px) {
    display: none;
  }
`,nc=u(rr)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,oc=u.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,rc=({onUpdate:e})=>{const n=ve(),r=dn(),o=or(),{activeConfigId:s,activeConfigName:a,configs:l,isPreview:c,renameConfig:h,duplicateConfig:d,deleteConfig:g,savePreviewConfig:m}=n||{},[b,v]=p.useState(!1),[x,f]=p.useState(!1),[_,j]=p.useState(""),E=()=>{a&&s&&(j(a),f(!0))},L=D=>{D&&D.stopPropagation(),!(h&&s&&_.trim()&&!h(s,_.trim()))&&f(!1)},N=D=>{D&&D.stopPropagation(),f(!1)},I=D=>{D.key==="Enter"?L():D.key==="Escape"&&f(!1)},M=D=>{D.stopPropagation(),d&&s&&d(s)},P=D=>{D.stopPropagation(),s&&a&&g&&window.confirm(`Are you sure you want to delete "${a}"?`)&&(g(s),(l&&l.length<=1||s)&&r("/new"))},z=()=>{n==null||n.setShowSettings(!(n!=null&&n.showSettings))},A=()=>{n==null||n.setShowSettings(!1),n==null||n.selectConfig(null),r("/new")},w=tn(n),$=()=>{var D,B,H;!(n!=null&&n.results)||!w||n!=null&&n.isGenerating||n!=null&&n.isJscadConverting||(O("archive_single_downloaded",{has_injections:!!((D=n.injectionInput)!=null&&D.length),injections_count:((B=n.injectionInput)==null?void 0:B.length)||0,stored_configs_count:((H=n.configs)==null?void 0:H.length)||0,source:"header"}),Ir(n.results,w,n.injectionInput,n.debug,n.stlPreview))},C=()=>{var D,B;!n||!w||(O("share_button_clicked",{has_injections:!!((D=n.injectionInput)!=null&&D.length),injections_count:((B=n.injectionInput)==null?void 0:B.length)||0,source:"header"}),v(!0))},W=()=>{n==null||n.setShowSideNav(!(n!=null&&n.showSideNav))},F=p.useMemo(()=>hn("github:ceoloide/ergogen#v4.3.0"),[]);return t.jsxs(t.Fragment,{children:[b&&t.jsx(Er,{config:w,injections:(n==null?void 0:n.injectionInput)||[],onClose:()=>v(!1),"data-testid":"share-dialog"}),t.jsxs(ql,{children:[t.jsxs(Jl,{children:[t.jsx(Ql,{onClick:W,"aria-label":n!=null&&n.showSideNav?"Hide navigation panel":"Show navigation panel","data-testid":"side-nav-toggle-button",children:t.jsx("span",{className:"material-symbols-outlined",children:"side_navigation"})}),t.jsxs(Xl,{children:[t.jsx(nc,{to:"/","aria-label":"Go to home page","data-testid":"logo-button",children:t.jsx(oc,{src:"/ergogen.png",alt:"Ergogen logo"})}),t.jsxs(Zl,{children:["Ergogen",F.isCustom&&t.jsx(Lr,{versionInfo:F,"data-testid":"header-dev-chip"})]})]}),a&&t.jsxs(t.Fragment,{children:[t.jsx(sc,{children:"/"}),t.jsxs(ic,{"data-testid":"header-active-config-name",$isEditing:x,onClick:!x&&!c?E:void 0,children:[c&&t.jsx(lc,{"data-testid":"header-shared-icon",children:t.jsx("span",{className:"material-symbols-outlined",children:"link"})}),x?t.jsxs(t.Fragment,{children:[t.jsx(ac,{type:"text",value:_,onChange:D=>j(D.target.value),onBlur:L,onKeyDown:I,autoFocus:!0,"data-testid":"header-config-name-input","aria-label":"Edit configuration name"}),t.jsxs(Gt,{className:"header-actions-always-visible",children:[t.jsx(qe,{onMouseDown:D=>{D.preventDefault()},onClick:L,"aria-label":"Confirm rename","data-testid":"header-confirm-rename-btn",children:t.jsx("span",{className:"material-symbols-outlined",children:"check"})}),t.jsx(qe,{onMouseDown:D=>{D.preventDefault()},onClick:N,"aria-label":"Cancel rename","data-testid":"header-cancel-rename-btn",children:t.jsx("span",{className:"material-symbols-outlined",children:"close"})})]})]}):c?t.jsxs(t.Fragment,{children:[t.jsx(Bo,{"data-testid":"header-config-name-text",children:a}),t.jsx(Gt,{className:"header-actions-always-visible",children:t.jsx(qe,{onClick:D=>{D.stopPropagation(),m==null||m()},"aria-label":"Save preview configuration","data-testid":"header-save-preview-btn",children:t.jsx("span",{className:"material-symbols-outlined",children:"save"})})})]}):t.jsxs(t.Fragment,{children:[t.jsx(Bo,{title:"Click to rename","data-testid":"header-config-name-text",children:a}),t.jsxs(Gt,{className:"header-actions-hover",children:[t.jsx(qe,{onClick:E,"aria-label":"Rename configuration","data-testid":"header-rename-btn",children:t.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),t.jsx(Mo,{onClick:M,"aria-label":"Duplicate configuration","data-testid":"header-duplicate-btn",children:t.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),t.jsx(Mo,{onClick:P,"aria-label":"Delete configuration","data-testid":"header-delete-btn",children:t.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})]})]})]}),t.jsxs(Yl,{children:[e&&t.jsx(Kl,{onClick:e,"data-testid":"header-update-chip"}),o.pathname==="/"&&t.jsxs(t.Fragment,{children:[t.jsxs(ec,{onClick:A,"aria-label":"Start new configuration","data-testid":"new-config-button",children:[t.jsx("span",{className:"material-symbols-outlined",children:"add_2"}),t.jsx(tc,{children:"New"})]}),t.jsx(Fo,{onClick:$,disabled:(n==null?void 0:n.isGenerating)||(n==null?void 0:n.isJscadConverting),"aria-label":"Download archive of all generated files","data-testid":"header-download-outputs-button",children:t.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),t.jsx(Fo,{onClick:C,disabled:!(n!=null&&n.configInput),"aria-label":"Share configuration","data-testid":"header-share-button",children:t.jsx("span",{className:"material-symbols-outlined",children:"share"})})]}),o.pathname!=="/new"&&t.jsx($t,{onClick:z,"aria-label":n!=null&&n.showSettings?"Hide settings panel":"Show settings panel","data-testid":"settings-button",children:t.jsx("span",{className:"material-symbols-outlined",children:n!=null&&n.showSettings?"keyboard_alt":"settings"})})]})]})]})},ic=u.div`
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
    ${e=>e.$isEditing?i.colors.accent:"transparent"};
  background-color: ${e=>e.$isEditing?i.colors.backgroundLight:"transparent"};
  width: 220px;
  box-sizing: border-box;

  &:hover {
    background-color: ${e=>e.$isEditing?i.colors.backgroundLight:i.colors.buttonHover};
    .header-actions-hover {
      opacity: 1;
    }
  }

  @media (max-width: 767px) {
    width: 160px;
    border-color: ${e=>e.$isEditing?i.colors.accent:i.colors.border};
  }
`,Gt=u.div`
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
`,qe=u.button`
  background: none;
  border: none;
  color: ${i.colors.textDark};
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
    background-color: ${i.colors.buttonHover};
    color: ${i.colors.white};
  }
`,Mo=u(qe)`
  @media (max-width: 767px) {
    display: none;
  }
`,sc=u.span`
  color: ${i.colors.textDark};
  font-size: ${i.fontSizes.sm};
  font-weight: ${i.fontWeights.semiBold};
  user-select: none;
  @media (max-width: 639px) {
    display: none;
  }
`,Bo=u.span`
  font-size: ${i.fontSizes.bodySmall};
  font-weight: ${i.fontWeights.semiBold};
  color: ${i.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  user-select: none;
`,ac=u.input`
  background: transparent;
  border: none;
  color: ${i.colors.white};
  font-size: ${i.fontSizes.bodySmall};
  font-weight: ${i.fontWeights.semiBold};
  padding: 0;
  flex: 1;
  outline: none;
  height: 100%;
  min-width: 0;
`,lc=u.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${i.colors.accent};
  color: ${i.colors.white};
  padding: 4px;
  border-radius: 4px;
  flex-shrink: 0;
  user-select: none;

  .material-symbols-outlined {
    font-size: 16px !important;
  }
`,cc=yt`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
`,dc=u.div`
  position: fixed;
  top: 45px;
  left: 0;
  right: 0;
  width: 100%;
  height: 3px;
  background-color: transparent;
  overflow: hidden;
  z-index: 1000;
`,uc=u.div`
  height: 100%;
  width: 25%;
  background-color: ${i.colors.accent};
  animation: ${cc} 1.5s ease-in-out infinite;
`,pc=({visible:e,"data-testid":n})=>e?t.jsx(dc,{role:"progressbar","aria-label":"Loading","data-testid":n,children:t.jsx(uc,{})}):null,at={info:{background:i.colors.info,text:i.colors.infoDark},warning:{background:i.colors.warning,text:i.colors.warningDark},error:{background:i.colors.error,text:i.colors.errorDark},success:{background:i.colors.success,text:i.colors.successDark}},lt=u.span.attrs({className:"material-symbols-outlined"})`
  font-size: ${i.fontSizes.iconLarge};
  margin-right: 1rem;
`,ct=u.div`
  display: flex;
  align-items: center;
`,dt=u.p`
  margin: 0;
`,ut=u.div`
  padding: 1rem 1.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: ${({type:e})=>at[e].text};
  background-color: ${({type:e})=>at[e].background};
  border: 1px solid ${({type:e})=>at[e].text};

  .material-symbols-outlined {
    color: ${({type:e})=>at[e].text};
  }
`,fc=u.div`
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
`,pt=u.button`
  background: none;
  border: none;
  color: inherit;
  font-size: ${i.fontSizes.h3};
  cursor: pointer;
  padding: 0;
  line-height: 1;
  margin-left: auto;
  padding-left: 1rem;
`,hc=()=>{const e=ve();if(!e)return null;const{error:n,deprecationWarning:r,skippedWarning:o,info:s,clearError:a,clearWarning:l,clearSkippedWarning:c,clearInfo:h}=e;return t.jsxs(fc,{"data-testid":"banners-container",children:[s&&t.jsxs(ut,{type:"info","data-testid":"info-banner",children:[t.jsxs(ct,{children:[t.jsx(lt,{children:"info"}),t.jsx(dt,{children:s})]}),t.jsx(pt,{onClick:h,"aria-label":"Close info message","data-testid":"close-info-banner",children:"×"})]}),r&&t.jsxs(ut,{type:"warning","data-testid":"warning-banner",children:[t.jsxs(ct,{children:[t.jsx(lt,{children:"warning"}),t.jsx(dt,{children:r})]}),t.jsx(pt,{onClick:l,"aria-label":"Close warning message","data-testid":"close-warning-banner",children:"×"})]}),o&&t.jsxs(ut,{type:"warning","data-testid":"skipped-injections-banner",children:[t.jsxs(ct,{children:[t.jsx(lt,{children:"warning"}),t.jsx(dt,{children:o})]}),t.jsx(pt,{onClick:c,"aria-label":"Close feature warning message","data-testid":"close-skipped-banner",children:"×"})]}),n&&t.jsxs(ut,{type:"error","data-testid":"error-banner",children:[t.jsxs(ct,{children:[t.jsx(lt,{children:"error"}),t.jsx(dt,{children:n})]}),t.jsx(pt,{onClick:a,"aria-label":"Close error message","data-testid":"close-error-banner",children:"×"})]})]})},gc=()=>t.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-discord",viewBox:"0 0 16 16",children:t.jsx("path",{d:"M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"})}),To=({label:e,version:n,url:r,isCustom:o=!1,"data-testid":s,devBadgeTestId:a})=>{const l=()=>{window.open(r,"_blank","noopener,noreferrer")};return t.jsxs(mc,{onClick:l,$hasDevBadge:o,"aria-label":`View ${e==="Ergogen"?"Ergogen":`Ergogen ${e}`} ${n} on GitHub`,"data-testid":s,children:[t.jsx(ln,{}),t.jsxs(bc,{children:[t.jsx(wc,{children:e}),t.jsx(xc,{$isCustom:o,children:n})]}),o&&t.jsx(yc,{"data-testid":a,children:t.jsx(kc,{children:"DEV"})})]})},mc=u.button`
  background-color: transparent;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  border: 1px solid ${i.colors.border};
  border-radius: 6px;
  color: ${i.colors.white};
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
    background-color: ${i.colors.buttonHover};
  }
`,bc=u.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  line-height: 1.1;
  min-width: 0;
`,wc=u.span`
  font-size: 10px;
  font-weight: ${i.fontWeights.bold};
  color: ${i.colors.white};
  white-space: nowrap;
`,xc=u.span`
  font-size: 8px;
  color: ${e=>e.$isCustom?i.colors.accent:i.colors.textDark};
  white-space: nowrap;
`,yc=u.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 16px;
  background-color: ${i.colors.backgroundLighter};
  border-left: 1px solid ${i.colors.border};
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
`,kc=u.span`
  font-size: 8px;
  font-weight: ${i.fontWeights.bold};
  color: ${i.colors.accent};
  transform: rotate(-90deg);
  white-space: nowrap;
  line-height: 1;
`,_c=({isOpen:e,onClose:n,"data-testid":r})=>{const o=p.useRef(e),[s,a]=p.useState(e),[l,c]=p.useState(360),h=p.useRef(!1),d=p.useRef(0),g=p.useRef(360),m=ve(),b=dn(),v=kt.version,{configs:x,activeConfigId:f,selectConfig:_,renameConfig:j,duplicateConfig:E,deleteConfig:L,setIsBulkDownloadOpen:N}=m||{},[I,M]=p.useState(""),[P,z]=p.useState(null),[A,w]=p.useState(""),$=p.useMemo(()=>{if(!x)return[];let U=x;if(I.trim()){const G=I.toLowerCase().split(/\s+/).filter(Boolean);G.length>0&&(U=x.filter(ee=>{const V=ee.name.toLowerCase();return G.some(y=>V.includes(y))}))}return[...U].sort((G,ee)=>{const V=G.updatedAt?new Date(G.updatedAt).getTime():0,y=ee.updatedAt?new Date(ee.updatedAt).getTime():0;if(V!==y)return y-V;const K=G.createdAt?new Date(G.createdAt).getTime():0,q=ee.createdAt?new Date(ee.createdAt).getTime():0;return K!==q?q-K:G.name.localeCompare(ee.name)})},[x,I]),C=()=>{_&&_(null),b("/new"),n()},W=()=>{O("bulk_download_dialog_opened",{stored_configs_count:(x==null?void 0:x.length)||0}),N&&N(!0),n()},F=U=>{_&&(_(U),b("/"),n())},D=(U,G)=>{z(U),w(G)},B=U=>{j&&A.trim()&&!j(U,A.trim())||z(null)},H=U=>{E&&E(U)},Z=(U,G)=>{if(window.confirm(`Are you sure you want to delete "${G}"?`)&&L){L(U);const ee=f===U,V=x&&x.length<=1;(ee||V)&&(b("/new"),n())}};p.useEffect(()=>{const U=o.current;e&&!U?a(!0):!e&&U&&a(!1),e||z(null),o.current=e},[e]),p.useEffect(()=>{if(!I.trim())return;const U=setTimeout(()=>{O("search_performed",{query_length:I.trim().length})},1e3);return()=>clearTimeout(U)},[I]),p.useEffect(()=>{const U=y=>{if(!h.current)return;const K=y.clientX-d.current,q=g.current+K,te=Math.min(600,window.innerWidth*.9),J=Math.max(360,Math.min(q,te));c(J)},G=()=>{h.current&&(h.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},ee=y=>{if(!h.current)return;y.preventDefault();const q=y.touches[0].clientX-d.current,te=g.current+q,J=Math.min(600,window.innerWidth*.9),se=Math.max(360,Math.min(te,J));c(se)},V=()=>{h.current&&(h.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",U),window.addEventListener("mouseup",G),window.addEventListener("touchmove",ee,{passive:!1}),window.addEventListener("touchend",V),()=>{window.removeEventListener("mousemove",U),window.removeEventListener("mouseup",G),window.removeEventListener("touchmove",ee),window.removeEventListener("touchend",V)}},[]);const Q=U=>{U.preventDefault(),U.stopPropagation(),h.current=!0,g.current=l,"touches"in U?d.current=U.touches[0].clientX:d.current=U.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};p.useEffect(()=>{if(!e)return;const U=G=>{G.key==="Escape"&&n()};return window.addEventListener("keydown",U),()=>{window.removeEventListener("keydown",U)}},[e,n]);const T=p.useMemo(()=>hn("github:ceoloide/ergogen#v4.3.0"),[]);return p.useEffect(()=>(e?document.body.style.overflow="hidden":document.body.style.overflow="",()=>{document.body.style.overflow=""}),[e]),t.jsxs(t.Fragment,{children:[t.jsx(vc,{"data-testid":r,onClick:n,$isOpen:e,$isOpening:s}),t.jsxs(jc,{"data-testid":r&&`${r}-panel`,$isOpen:e,$isOpening:s,$width:l,onClick:U=>U.stopPropagation(),children:[t.jsx(Jc,{onMouseDown:Q,onTouchStart:Q,"data-testid":r&&`${r}-resize-handle`}),t.jsxs($c,{children:[t.jsxs(Cc,{children:[t.jsx(Sc,{to:"/",onClick:n,"aria-label":"Go to home page","data-testid":"side-nav-logo-button",children:t.jsx(Ec,{src:"/ergogen.png",alt:"Ergogen logo"})}),t.jsxs(Pc,{onClick:n,children:["Ergogen",T.isCustom&&t.jsx(Lr,{versionInfo:T,"data-testid":"sidebar-dev-chip"})]})]}),t.jsx(Ic,{onClick:n,"data-testid":r&&`${r}-close`,"aria-label":"Close navigation panel",children:t.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),t.jsxs(Lc,{children:[t.jsxs(zc,{children:[t.jsxs(Rc,{onClick:C,"aria-label":"New","data-testid":"side-nav-new-config-button",children:[t.jsx("span",{className:"material-symbols-outlined",children:"add"}),t.jsx("span",{children:"New"})]}),x&&x.length>0&&t.jsxs(Dc,{onClick:W,"aria-label":"Download All","data-testid":"side-nav-download-all-button",children:[t.jsx("span",{className:"material-symbols-outlined",children:"download"}),t.jsx("span",{children:"Download All"})]})]}),t.jsxs(Ac,{children:[t.jsx("span",{className:"material-symbols-outlined search-icon",children:"search"}),t.jsx(Nc,{type:"text",placeholder:"Search configurations...",value:I,onChange:U=>M(U.target.value),"aria-label":"Search configurations"}),I&&t.jsx(Uc,{onClick:()=>M(""),children:t.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),t.jsxs(Wc,{children:[t.jsx("span",{children:"Saved Configurations"}),t.jsx(Oc,{children:$.length})]}),t.jsxs(Fc,{children:[$.map(U=>{const G=U.id===f,ee=P===U.id;return t.jsx(Mc,{$isActive:G,"data-testid":`config-item-${U.id}`,children:ee?t.jsxs(Gc,{onSubmit:V=>{V.preventDefault(),B(U.id)},children:[t.jsx(Hc,{type:"text",value:A,onChange:V=>w(V.target.value),autoFocus:!0,"aria-label":"Rename input"}),t.jsx(Go,{type:"submit","aria-label":"Save name",children:t.jsx("span",{className:"material-symbols-outlined",children:"check"})}),t.jsx(Go,{type:"button",onClick:()=>z(null),"aria-label":"Cancel rename",children:t.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}):t.jsxs(t.Fragment,{children:[t.jsxs(Bc,{onClick:()=>F(U.id),$isActive:G,title:U.name,children:[t.jsx("span",{className:"material-symbols-outlined",children:"description"}),t.jsx("span",{className:"config-title-text",children:U.name})]}),t.jsxs(Tc,{$isActive:G,children:[t.jsx(Ht,{onClick:()=>D(U.id,U.name),"aria-label":`Rename configuration ${U.name}`,children:t.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),t.jsx(Ht,{onClick:()=>H(U.id),"aria-label":`Duplicate configuration ${U.name}`,children:t.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),t.jsx(Ht,{onClick:()=>Z(U.id,U.name),"aria-label":`Delete configuration ${U.name}`,children:t.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})},U.id)}),$.length===0&&t.jsx(Vc,{children:"No configurations found"})]})]}),t.jsx(Kc,{children:t.jsxs(qc,{children:[t.jsxs(Ho,{onClick:()=>{window.open("https://docs.ergogen.xyz/","_blank","noopener,noreferrer")},"aria-label":"Open documentation","data-testid":"side-nav-docs-button",children:[t.jsx("span",{className:"material-symbols-outlined",children:"description"}),t.jsx("span",{children:"Docs"})]}),t.jsx(Ho,{onClick:()=>{window.open("https://discord.ergogen.xyz","_blank","noopener,noreferrer")},"aria-label":"Join the Discord community","data-testid":"side-nav-discord-button",children:t.jsx(gc,{})}),t.jsx(To,{label:"Web UI",version:v,url:"https://github.com/ceoloide/ergogen-gui","data-testid":"side-nav-gui-version-button"}),t.jsx(To,{label:"Ergogen",version:T.displayText,url:T.url,isCustom:T.isCustom,"data-testid":"side-nav-ergogen-version-button",devBadgeTestId:"side-nav-ergogen-dev-badge"})]})})]})]})},vc=u.div`
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
`,jc=u.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: ${e=>e.$width}px;
  max-width: min(600px, 90vw);
  background-color: ${i.colors.backgroundLight};
  border-right: 1px solid ${i.colors.border};
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
`,$c=u.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 3em;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
`,Cc=u.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`,Sc=u(rr)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,Ec=u.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,Pc=u.div`
  font-size: ${i.fontSizes.base};
  font-weight: ${i.fontWeights.semiBold};
  color: ${i.colors.white};
  cursor: pointer;
  display: flex;
  align-items: center;
`,Ic=u.button`
  background: none;
  border: none;
  color: ${i.colors.textDark};
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
    font-size: ${i.fontSizes.iconLarge};
  }

  &:hover {
    background-color: ${i.colors.buttonHover};
    color: ${i.colors.text};
  }
`,Lc=u.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`,zc=u.div`
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
  flex-shrink: 0;
`,Rc=u.button`
  flex: 1;
  background-color: ${i.colors.accent};
  color: ${i.colors.white};
  border: none;
  border-radius: 6px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: ${i.fontSizes.bodySmall};
  font-weight: ${i.fontWeights.regular};
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
  padding: 0 6px;

  .material-symbols-outlined {
    font-size: 20px;
  }

  &:hover {
    background-color: ${i.colors.accentDark};
  }
`,Dc=u.button`
  flex: 1;
  background-color: transparent;
  color: ${i.colors.white};
  border: 1px solid ${i.colors.border};
  border-radius: 6px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: ${i.fontSizes.bodySmall};
  font-weight: ${i.fontWeights.regular};
  cursor: pointer;
  transition: background-color 0.15s ease-in-out;
  padding: 0 6px;

  .material-symbols-outlined {
    font-size: 20px;
  }

  &:hover {
    background-color: ${i.colors.buttonHover};
  }
`,Ac=u.div`
  position: relative;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  flex-shrink: 0;

  .search-icon {
    position: absolute;
    left: 8px;
    color: ${i.colors.textDark};
    pointer-events: none;
    font-size: 18px;
  }
`,Nc=u.input`
  width: 100%;
  background-color: ${i.colors.backgroundLighter};
  border: 1px solid ${i.colors.border};
  border-radius: 6px;
  height: 36px;
  padding: 0 34px;
  color: ${i.colors.white};
  font-size: ${i.fontSizes.bodySmall};

  &:focus {
    outline: none;
    border-color: ${i.colors.accent};
  }
`,Uc=u.button`
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: ${i.colors.textDark};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;

  .material-symbols-outlined {
    font-size: 16px;
  }

  &:hover {
    color: ${i.colors.white};
  }
`,Wc=u.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: ${i.fontSizes.bodySmall};
  color: ${i.colors.textDark};
  font-weight: ${i.fontWeights.semiBold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
`,Oc=u.span`
  background-color: ${i.colors.border};
  color: ${i.colors.white};
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: ${i.fontWeights.semiBold};
`,Fc=u.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  flex: 1;
`,Mc=u.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 6px;
  background-color: transparent;
  border: 1px solid
    ${e=>e.$isActive?i.colors.accent:"transparent"};
  padding: 2px 6px;
  height: 38px;
  min-width: 0;
  flex-shrink: 0;

  &:hover {
    background-color: ${i.colors.buttonHover};

    /* Show action buttons on hover */
    .item-actions-hover {
      opacity: 1;
    }
  }
`,Bc=u.button`
  flex: 1;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${e=>e.$isActive?i.colors.white:i.colors.textDark};
  font-weight: ${e=>e.$isActive?i.fontWeights.semiBold:i.fontWeights.regular};
  font-size: ${i.fontSizes.bodySmall};
  text-align: left;
  cursor: pointer;
  min-width: 0;
  padding: 0;
  height: 100%;

  .material-symbols-outlined {
    font-size: 18px;
    color: ${e=>e.$isActive?i.colors.accent:i.colors.textDark};
  }

  .config-title-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    color: ${i.colors.white};
  }
`,Tc=u.div.attrs({className:"item-actions-hover"})`
  display: flex;
  gap: 4px;
  opacity: ${e=>e.$isActive?1:0};
  transition: opacity 0.15s ease-in-out;

  @media (max-width: 1023px) {
    opacity: 1;
  }
`,Ht=u.button`
  background: none;
  border: none;
  color: ${i.colors.textDark};
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
    background-color: ${i.colors.border};
    color: ${i.colors.white};
  }
`,Gc=u.form`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 100%;
`,Hc=u.input`
  flex: 1;
  background: transparent;
  border: none;
  height: 100%;
  padding: 0;
  color: ${i.colors.white};
  font-size: ${i.fontSizes.bodySmall};
  font-weight: ${i.fontWeights.semiBold};

  &:focus {
    outline: none;
  }
`,Go=u.button`
  background: none;
  border: none;
  color: ${i.colors.textDark};
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
    color: ${i.colors.white};
  }
`,Vc=u.div`
  text-align: center;
  color: ${i.colors.textDark};
  font-size: ${i.fontSizes.bodySmall};
  margin-top: 2rem;
  font-style: italic;
`,Kc=u.div`
  padding: 8px 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`,qc=u.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  width: 100%;
`,Ho=u.button`
  background-color: transparent;
  transition:
    color 0.15s ease-in-out,
    background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  border: 1px solid ${i.colors.border};
  border-radius: 6px;
  color: ${i.colors.white};
  display: flex;
  align-items: center;
  padding: 8px 12px;
  text-decoration: none;
  cursor: pointer;
  font-size: ${i.fontSizes.bodySmall};
  line-height: 16px;
  gap: 6px;
  height: 34px;

  .material-symbols-outlined {
    font-size: ${i.fontSizes.iconMedium} !important;
  }

  &:hover {
    background-color: ${i.colors.buttonHover};
  }
`,Jc=u.div`
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
    background-color: ${i.colors.accent};
  }

  @media (max-width: 639px) {
    display: none;
  }
`,zr=3e4,Yc=e=>{try{const n=JSON.parse(e);if(n&&typeof n=="object")return n}catch{try{const n=fe.load(e);if(n&&typeof n=="object")return n}catch{return e}}return e},Xc=(e,n,r,o,s)=>new Promise((a,l)=>{if(s()){l(new Error("Aborted"));return}const c=pn();if(!c){l(new Error("Failed to create Ergogen worker"));return}o.add(c);const h=()=>{clearTimeout(d),c.terminate(),o.delete(c)},d=setTimeout(()=>{h(),l(new Error("Compilation timed out"))},zr);c.onmessage=m=>{const b=m.data;b.type==="error"?(h(),l(new Error(b.error))):b.type==="success"&&(h(),a(b.results))},c.onerror=m=>{h(),l(m)};const g={type:"generate",inputConfig:Yc(e),injectionInput:n,requestId:`export-compile-${Date.now()}`,options:{debug:r}};c.postMessage(g)}),Zc=(e,n,r)=>new Promise(o=>{if(r()||!e.cases||Object.keys(e.cases).length===0){o(e);return}const s=ar();if(!s){o(e);return}n.add(s);const a=()=>{clearTimeout(l),s.terminate(),n.delete(s)},l=setTimeout(()=>{a(),o(e)},zr);s.onmessage=c=>{const h=c.data;h.type==="success"?(a(),o(h.results)):h.type==="error"&&(a(),o(e))},s.onerror=()=>{a(),o(e)},s.postMessage({type:"batch_jscad_to_stl",results:e,configVersion:0})}),Qc=async(e,n,r,o,s,a,l)=>{const c=new un,h=new Set;if(s){for(let E=0;E<e.length;E++){if(l())return;const L=e[E];a(E,e.length,L.name);const N=Po(h,L.name);c.file(`${N}.yaml`,L.config)}if(n&&n.length>0){if(l())return;rn(c,n)}return l()?void 0:(a(e.length,e.length,"Creating ZIP..."),await sn(c,"ergogen-config-all"),{succeededCount:e.length,failedCount:0})}const d=yr(n),g=e.map(E=>({configRecord:E,folderName:Po(h,E.name)})),m=new Set,b=new Set;let v=0,x=0,f=0;const _=Math.min(4,navigator.hardwareConcurrency||2),j=async({configRecord:E,folderName:L})=>{if(l())return;b.add(E.name),a(v,e.length,Array.from(b).join(", "));const N=c.folder(L);if(!N){b.delete(E.name),v++,a(v,e.length,Array.from(b).join(", "));return}try{const I=await Xc(E.config,d,r,m,l);let M=I;if(o&&I.cases&&Object.keys(I.cases).length>0&&(M=await Zc(I,m,l)),l())return;N.file("config.yaml",E.config);const P=N.folder("outputs");P&&Pr(P,E.config,M,r,o),n&&n.length>0&&rn(N,n),x++}catch(I){f++,console.error(`Failed to compile config ${E.name}:`,I),N.file("config.yaml",E.config),N.file("error.txt",`Compilation failed: ${I instanceof Error?I.message:String(I)}`)}finally{b.delete(E.name),v++,a(v,e.length,Array.from(b).join(", "))}};try{const E=[...g],L=[],N=async()=>{if(l()||E.length===0)return;const I=E.shift();await j(I),await N()};for(let I=0;I<Math.min(_,E.length);I++)L.push(N());if(await Promise.all(L),l()){m.forEach(I=>I.terminate()),m.clear();return}return a(e.length,e.length,"Creating ZIP..."),await sn(c,"ergogen-export-all"),{succeededCount:x,failedCount:f}}finally{m.forEach(E=>E.terminate()),m.clear()}},ed=({isOpen:e,configs:n,injections:r,debug:o,stlPreview:s,onClose:a,"data-testid":l})=>{const[c,h]=p.useState(new Set),[d,g]=p.useState(!0),[m,b]=p.useState(!1),[v,x]=p.useState(0),[f,_]=p.useState(""),j=p.useRef(!1);if(p.useEffect(()=>{e&&(h(new Set(n.map(P=>P.id))),b(!1),x(0),_(""),j.current=!1)},[e,n]),!e)return null;const E=P=>{h(P?new Set(n.map(z=>z.id)):new Set)},L=(P,z)=>{const A=new Set(c);z?A.add(P):A.delete(P),h(A)},N=async()=>{if(c.size===0)return;b(!0),x(0),_(""),j.current=!1;const P=n.filter(z=>c.has(z.id));O("bulk_download_started",{selected_configs_count:c.size,only_configs:d});try{const z=await Qc(P,r,o,s,d,(A,w,$)=>{x(A),_($)},()=>j.current);j.current||(z&&z.succeededCount===0&&z.failedCount>0?O("bulk_download_failed",{selected_configs_count:c.size,failed_configs_count:z.failedCount,only_configs:d,error_message:`All ${z.failedCount} selected configuration(s) failed to compile`}):z&&z.failedCount>0?O("bulk_download_partial",{selected_configs_count:c.size,failed_configs_count:z.failedCount,only_configs:d}):O("bulk_download_completed",{selected_configs_count:c.size,only_configs:d}))}catch(z){console.error("Error during bulk download:",z),O("bulk_download_failed",{selected_configs_count:c.size,only_configs:d,error_message:z instanceof Error?z.message:String(z)})}finally{j.current||a()}},I=()=>{m&&!j.current&&O("bulk_download_cancelled",{selected_configs_count:c.size,completed_configs_count:v,only_configs:d}),j.current=!0,a()},M=c.size>0?v/c.size*100:0;return t.jsx(td,{"data-testid":l,children:t.jsxs(nd,{"data-testid":l&&`${l}-box`,children:[t.jsx(od,{children:"Download Configurations"}),m?t.jsxs(t.Fragment,{children:[t.jsxs(bd,{children:[t.jsx(wd,{children:t.jsx(xd,{style:{width:`${M}%`}})}),t.jsxs(yd,{children:[t.jsx(kd,{children:f?f.includes(", ")?t.jsxs("div",{children:["Generating:",t.jsx(_d,{children:f.split(", ").map(P=>t.jsx("li",{children:P},P))})]}):t.jsxs(qo,{children:["Generating ",f]}):t.jsx(qo,{children:"Preparing..."})}),t.jsxs(vd,{children:[v," / ",c.size]})]})]}),t.jsx(Ko,{children:t.jsx(jd,{onClick:I,size:"medium",children:"Cancel"})})]}):t.jsxs(t.Fragment,{children:[t.jsx(id,{children:n.map(P=>{const z=c.has(P.id);return t.jsx(sd,{children:t.jsxs(Rr,{htmlFor:`bulk-check-${P.id}`,children:[t.jsx(ld,{id:`bulk-check-${P.id}`,checked:z,onChange:A=>L(P.id,A.target.checked)}),t.jsx(cd,{$checked:z}),t.jsx(ad,{children:P.name})]})},P.id)})}),t.jsxs(rd,{children:[t.jsx(Vo,{onClick:()=>E(!0),children:"Select All"}),t.jsx(Vo,{onClick:()=>E(!1),children:"Deselect All"})]}),t.jsxs(dd,{children:[t.jsx(ud,{children:"Only download configs"}),t.jsxs(pd,{$checked:d,htmlFor:"only-configs-switch",children:[t.jsx(fd,{type:"checkbox",id:"only-configs-switch",checked:d,onChange:P=>g(P.target.checked)}),t.jsx(hd,{$checked:d}),t.jsx(gd,{$checked:d})]})]}),!d&&t.jsxs(md,{children:[t.jsx("span",{className:"material-symbols-outlined",children:"warning"}),t.jsx("span",{children:"Warning: Exporting generated outputs for multiple configurations may take a long time depending on the number of selected configurations, their complexity, and CPU speed."})]}),t.jsxs(Ko,{children:[t.jsx(Dr,{onClick:I,size:"medium",children:"Cancel"}),t.jsxs(ue,{onClick:N,disabled:c.size===0,size:"medium",children:["Download (",c.size,")"]})]})]})]})})},td=u.div`
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
`,nd=u.div`
  background-color: ${i.colors.backgroundLight};
  border: 1px solid ${i.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,od=u.h2`
  margin: 0 0 1rem 0;
  font-size: ${i.fontSizes.h3};
  color: ${i.colors.text};
`,rd=u.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 1.5rem;
`,Vo=u.button`
  background: none;
  border: none;
  color: ${i.colors.textDark};
  font-size: 11px;
  font-weight: ${i.fontWeights.regular};
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${i.colors.border};
    color: ${i.colors.white};
  }
`,id=u.div`
  border: 1px solid ${i.colors.border};
  background-color: ${i.colors.background};
  border-radius: 6px;
  padding: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
`,sd=u.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,ad=u.span`
  color: ${i.colors.text};
  font-size: 13px;
  user-select: none;
`,Rr=u.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  padding: 4px 0;
`,ld=u.input.attrs({type:"checkbox"})`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`,cd=u.div`
  width: 16px;
  height: 16px;
  background-color: ${e=>e.$checked?i.colors.accent:"transparent"};
  border: 2px solid
    ${e=>e.$checked?i.colors.accent:i.colors.border};
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
    border: solid ${i.colors.white};
    border-width: 0 2px 2px 0;
    transform: rotate(45deg) translate(-0.5px, -1px);
  }

  ${Rr}:hover & {
    border-color: ${i.colors.accent};
  }
`,dd=u.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
`,ud=u.span`
  color: ${i.colors.text};
  font-size: ${i.fontSizes.base};
  user-select: none;
`,pd=u.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: pointer;
`,fd=u.input`
  opacity: 0;
  width: 0;
  height: 0;
`,hd=u.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${e=>e.$checked?i.colors.accent:i.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`,gd=u.span`
  position: absolute;
  top: 2px;
  left: ${e=>e.$checked?"18px":"2px"};
  width: 16px;
  height: 16px;
  background-color: ${i.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,md=u.div`
  background-color: ${i.colors.warning};
  border: 1px solid ${i.colors.warningDark};
  border-radius: 6px;
  padding: 10px 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: ${i.colors.warningDark};
  font-size: 13px;
  line-height: 1.4;

  .material-symbols-outlined {
    font-size: 18px;
    flex-shrink: 0;
    margin-top: 1px;
    color: ${i.colors.warningDark};
  }
`,Ko=u.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: auto;
`,bd=u.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`,wd=u.div`
  background-color: ${i.colors.border};
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  width: 100%;
`,xd=u.div`
  background-color: ${i.colors.accent};
  height: 100%;
  transition: width 0.15s ease-out;
`,yd=u.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`,kd=u.div`
  color: ${i.colors.text};
  max-width: 80%;
`,qo=u.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,_d=u.ul`
  margin: 4px 0 0 16px;
  padding: 0;
  list-style-type: disc;
  color: ${i.colors.textDark};
  font-size: 13px;
  text-align: left;
  max-height: 80px;
  overflow-y: auto;

  li {
    margin-bottom: 2px;
  }
`,vd=u.span`
  color: ${i.colors.textDark};
  font-weight: ${i.fontWeights.semiBold};
`,Dr=u(ue)`
  background-color: ${i.colors.backgroundLighter};
  color: ${i.colors.textDark};

  &:hover {
    background-color: ${i.colors.buttonHover};
  }
`,jd=u(Dr)`
  width: 100%;
`;function $d(){return!!(window.location.hostname==="localhost"||window.location.hostname==="[::1]"||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))}function Cd(e,n,r){e.addEventListener("statechange",()=>{var o,s;e.state==="installed"&&(navigator.serviceWorker.controller?(console.log("[SW] New content is available. Will be used when all existing tabs are closed or you reload."),(o=r==null?void 0:r.onUpdate)==null||o.call(r,n)):(console.log("[SW] Content is cached for offline use."),(s=r==null?void 0:r.onSuccess)==null||s.call(r,n)))})}async function Ar(e,n){var r;try{const o=await navigator.serviceWorker.register(e);let s=null;const a=l=>{l===null||l===s||(s=l,Cd(l,o,n))};o.addEventListener("updatefound",()=>a(o.installing)),o.waiting&&navigator.serviceWorker.controller?(r=n==null?void 0:n.onUpdate)==null||r.call(n,o):a(o.installing)}catch(o){console.error("[SW] Error during service worker registration:",o)}}async function Sd(e,n){try{const r=await fetch(e,{headers:{"Service-Worker":"script"}}),o=r.headers.get("content-type");r.status===404||o!==null&&o.indexOf("javascript")===-1?(await(await navigator.serviceWorker.ready).unregister(),window.location.reload()):await Ar(e,n)}catch{console.log("[SW] No internet connection found. App is running in offline mode.")}}function Ed(e){!("serviceWorker"in navigator)||new URL("/",window.location.href).origin!==window.location.origin||window.addEventListener("load",()=>{const r="/service-worker.js";$d()?(Sd(r,e),navigator.serviceWorker.ready.then(()=>{console.log("[SW] This web app is being served cache-first by a service worker. See https://cra.link/PWA for more details.")})):Ar(r,e)})}const Pd=({report:e,onAccept:n,onCancel:r,"data-testid":o})=>t.jsx(Id,{"data-testid":o,children:t.jsxs(Ld,{"data-testid":o&&`${o}-box`,children:[t.jsx(zd,{children:"Version Compatibility Warning"}),t.jsx(Rd,{children:"The shared link was created under a different environment. You may experience compatibility issues."}),t.jsxs(Dd,{children:[e.guiWarning&&t.jsxs(Vt,{"data-testid":o&&`${o}-gui-warning`,children:[t.jsxs(Kt,{children:["GUI Version Mismatch",t.jsx(qt,{"data-testid":"gui-mismatch-badge",children:"Mismatch"})]}),t.jsxs(Jt,{children:["The shared link was created with a newer version of the GUI (",t.jsxs("strong",{children:["v",e.guiWarning.shared]}),") than your current version (",t.jsxs("strong",{children:["v",e.guiWarning.current]}),"). Some interface options or features may not function as expected."]})]}),e.ergogenWarning&&t.jsxs(Vt,{"data-testid":o&&`${o}-ergogen-warning`,children:[t.jsxs(Kt,{children:["Ergogen Version Mismatch",t.jsx(qt,{"data-testid":"ergogen-mismatch-badge",children:"Mismatch"})]}),t.jsxs(Jt,{children:["The shared link was created with a newer version of Ergogen (",t.jsx("strong",{children:e.ergogenWarning.shared}),") than your current version (",t.jsx("strong",{children:e.ergogenWarning.current}),"). Some features or syntax might not be supported."]})]}),e.customErgogenWarning&&t.jsxs(Vt,{"data-testid":o&&`${o}-custom-ergogen-warning`,children:[t.jsxs(Kt,{children:["Custom Ergogen Version Used",t.jsx(qt,{"data-testid":"custom-version-badge",children:"Custom"})]}),t.jsxs(Jt,{children:["The shared link was created using a custom version of Ergogen:"," ",t.jsx("strong",{children:e.customErgogenWarning.shared}),".",t.jsx("br",{}),"You can investigate the repository used here:",t.jsx("br",{}),t.jsx(Ad,{href:e.customErgogenWarning.url,target:"_blank",rel:"noopener noreferrer","data-testid":o&&`${o}-custom-repo-link`,children:e.customErgogenWarning.label})]})]})]}),t.jsxs(Nd,{children:[t.jsx(Wd,{onClick:r,size:"medium","data-testid":o&&`${o}-cancel`,"aria-label":"Cancel configuration loading",children:"Cancel"}),t.jsx(Ud,{onClick:n,size:"medium","data-testid":o&&`${o}-accept`,"aria-label":"Accept and load configuration",children:"Accept and Load"})]})]})}),Id=u.div`
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
`,Ld=u.div`
  background-color: ${i.colors.backgroundLight};
  border: 1px solid ${i.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 550px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,zd=u.h2`
  margin: 0 0 0.5rem 0;
  font-size: ${i.fontSizes.h3};
  color: ${i.colors.error};
`,Rd=u.p`
  margin: 0 0 1.5rem 0;
  font-size: ${i.fontSizes.base};
  color: ${i.colors.textDarker};
  line-height: 1.4;
`,Dd=u.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`,Vt=u.div`
  background-color: ${i.colors.backgroundLighter};
  border-left: 4px solid ${i.colors.warningDark};
  padding: 1rem;
  border-radius: 4px;
`,Kt=u.div`
  font-size: ${i.fontSizes.base};
  font-weight: ${i.fontWeights.bold};
  color: ${i.colors.warningDark};
  margin-bottom: 0.25rem;
`,qt=u.span`
  background-color: ${i.colors.warningDark};
  color: ${i.colors.white};
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
  font-weight: ${i.fontWeights.semiBold};
  text-transform: uppercase;
  display: inline-block;
  vertical-align: middle;
`,Jt=u.div`
  font-size: ${i.fontSizes.bodySmall};
  color: ${i.colors.textDark};
  line-height: 1.5;

  strong {
    color: ${i.colors.text};
  }
`,Ad=u.a`
  display: inline-block;
  margin-top: 0.5rem;
  color: ${i.colors.accent};
  text-decoration: underline;
  word-break: break-all;

  &:hover {
    color: ${i.colors.accentSecondary};
  }
`,Nd=u.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`,Ud=u(ue)`
  background-color: ${i.colors.accent};
  color: ${i.colors.white};

  &:hover {
    background-color: ${i.colors.accentDark};
  }
`,Wd=u(ue)`
  background-color: ${i.colors.backgroundLighter};
  color: ${i.colors.textDark};

  &:hover {
    background-color: ${i.colors.buttonHover};
  }
`;let Jo=null,Yo=!1;const Od=()=>{Yo||(Jo=Cr(),Yo=!0);const e=Jo,n=[];let r=null;const o=e!=null&&e.success?e.config:null,[s,a]=p.useState(null);return p.useEffect(()=>{a(o)},[o]),e&&(e.success||(r=e.message,console.error("[App] Failed to load shared configuration from hash",{error:e.error,message:e.message,hashLength:window.location.hash.length})),window.history.replaceState(null,"",window.location.pathname+window.location.search)),t.jsx(ns,{initialInjectionInput:n,hashError:r,children:t.jsx(Bd,{hasInitialSharedConfig:o!==null,pendingSharedConfig:s})})};function Fd(){const[e,n]=p.useState(null),r=new URLSearchParams(window.location.search).has("force_update");if(p.useEffect(()=>{Ed({onUpdate:o=>{n(o)}})},[]),r)return()=>{console.log("[SW] Force-update triggered via ?force_update URL parameter."),window.location.reload()};if(e)return()=>{let o;if("serviceWorker"in navigator){let a=!1;navigator.serviceWorker.addEventListener("controllerchange",()=>{a||(a=!0,o&&clearTimeout(o),window.location.reload())})}const s=e.waiting;s?(s.postMessage({type:"SKIP_WAITING"}),o=setTimeout(()=>{window.location.reload()},1e3)):window.location.reload()}}function Md(){const[e,n]=p.useState(null),[r,o]=p.useState(!1),[s,a]=p.useState(!1),l=new URLSearchParams(window.location.search).has("force_install");return p.useEffect(()=>{(()=>{const b=typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches,v=window.navigator.standalone===!0;a(b||v)})();const g=b=>{b.preventDefault(),n(b),console.log("[PWA] beforeinstallprompt event fired and captured.")},m=()=>{console.log("[PWA] appinstalled event fired."),a(!0),o(!1)};return window.addEventListener("beforeinstallprompt",g),window.addEventListener("appinstalled",m),()=>{window.removeEventListener("beforeinstallprompt",g),window.removeEventListener("appinstalled",m)}},[]),{onInstall:()=>{O("pwa_install_click"),o(!0),e?(e.prompt(),e.userChoice.then(d=>{d.outcome==="accepted"?(console.log("[PWA] User accepted the install prompt"),O("pwa_install_accepted"),a(!0)):(console.log("[PWA] User dismissed the install prompt"),O("pwa_install_dismissed")),o(!1),n(null)})):(console.log("[PWA] Install prompt triggered (deferredPrompt is not available on this device/browser)"),alert('PWA installation is not supported by this browser or is restricted on this device. If you are on iOS/iPadOS, please open this site in Safari and select "Add to Home Screen" from the Share menu.'),o(!1))},isAvailable:!!e||l,isInstalled:s,isInstalling:r}}const Bd=({hasInitialSharedConfig:e,pendingSharedConfig:n})=>{var M;const r=ve(),o=r==null?void 0:r.configInput,s=or(),a=Fd(),l=Md(),c=p.useRef(0);c.current=((M=r==null?void 0:r.configs)==null?void 0:M.length)||0,p.useEffect(()=>{O("page_view",{page_path:s.pathname,stored_configs_count:c.current})},[s.pathname]);const h=p.useRef(!1),[d,g]=p.useState(e),{currentConflict:m,processInjectionsWithConflictResolution:b,handleConflictResolution:v,handleConflictCancel:x}=vt({setInjectionInput:P=>r==null?void 0:r.setInjectionInput(P),setConfigInput:P=>r==null?void 0:r.loadPreview(P),generateNow:async(P,z,A)=>{r&&await r.generateNow(P,z,A)},getCurrentInjections:()=>(r==null?void 0:r.injectionInput)||[],onComplete:async(P,z)=>{localStorage.setItem("ergogen:injection",JSON.stringify(z)),r==null||r.loadPreview(P)},setError:P=>r==null?void 0:r.setError(P)}),[f,_]=p.useState(null),j=(P,z)=>{const A=kt.version,w=gn("github:ceoloide/ergogen#v4.3.0");let $=!0,C,W,F;if(P){const D=We(A),B=We(P);D&&B&&!Yt(D,B)&&($=!1,C={current:A,shared:P})}if(z){if(ri(z)&&z!==w){$=!1;const H=hn(z);F={shared:z,url:H.url,label:H.label}}const D=lo(w)||Xe(),B=lo(z);if(B){const H=We(D),Z=We(B);H&&Z&&!Yt(H,Z)&&($=!1,W={current:D,shared:B})}}return{isCompatible:$,guiWarning:C,ergogenWarning:W,customErgogenWarning:F}},E=p.useCallback((P,z)=>{r&&(z!==void 0&&z.length>0?b(z,P).catch(A=>{console.error("[App] Error processing injections:",A),r.setError(`Failed to process injections: ${A instanceof Error?A.message:"Unknown error"}`)}):(r.loadPreview(P),r.generateNow(P,r.injectionInput,{pointsonly:!1})))},[r,b]),L=()=>{var P;f&&(O("shared_config_accepted",{has_injections:!!(f.injections&&f.injections.length>0),injections_count:((P=f.injections)==null?void 0:P.length)||0}),E(f.config,f.injections),_(null))},N=()=>{var P;f&&O("shared_config_declined",{has_injections:!!(f.injections&&f.injections.length>0),injections_count:((P=f.injections)==null?void 0:P.length)||0}),_(null)};p.useEffect(()=>{if(!r||!n||h.current)return;h.current=!0,g(!1);const P=j(n.guiVersion,n.ergogenVersion);P.isCompatible?E(n.config,n.injections):_({config:n.config,injections:n.injections,report:P})},[r,n,E]),p.useEffect(()=>{if(!r)return;const P=()=>{const z=Cr();if(z)if(z.success){const A=z.config,w=j(A.guiVersion,A.ergogenVersion);w.isCompatible?E(A.config,A.injections):_({config:A.config,injections:A.injections,report:w}),window.history.replaceState(null,"",window.location.pathname+window.location.search)}else console.error("[App] Failed to load shared configuration from hash (hashchange)",{error:z.error,message:z.message,hashLength:window.location.hash.length}),r.setError(z.message),window.history.replaceState(null,"",window.location.pathname+window.location.search)};return window.addEventListener("hashchange",P),()=>{window.removeEventListener("hashchange",P)}},[r,E]);const I=d||f!==null||m!==null;return t.jsxs(t.Fragment,{children:[f&&t.jsx(Pd,{report:f.report,onAccept:L,onCancel:N,"data-testid":"share-compatibility-dialog"}),m&&t.jsx(xt,{injectionName:m.name,injectionType:m.type,onResolve:v,onCancel:x,"data-testid":"conflict-dialog"}),(r==null?void 0:r.isBulkDownloadOpen)&&t.jsx(ed,{isOpen:r.isBulkDownloadOpen,configs:r.configs,injections:r.injectionInput,debug:r.debug,stlPreview:r.stlPreview,onClose:()=>r.setIsBulkDownloadOpen(!1),"data-testid":"bulk-download-dialog"}),t.jsx(rc,{onUpdate:a}),t.jsx(pc,{visible:(r==null?void 0:r.isGenerating)??!1,"data-testid":"loading-bar"}),t.jsx(hc,{}),t.jsx(_c,{isOpen:(r==null?void 0:r.showSideNav)??!1,onClose:()=>r==null?void 0:r.setShowSideNav(!1),"data-testid":"side-navigation"}),t.jsx(Td,{children:t.jsxs(qr,{children:[t.jsx(It,{path:"/",element:o?t.jsx(qa,{pwaState:l}):I?null:t.jsx(ao,{to:{pathname:"/new",search:s.search},replace:!0})}),t.jsx(It,{path:"/new",element:t.jsx(Ul,{})}),t.jsx(It,{path:"*",element:t.jsx(ao,{to:"/",replace:!0})})]})}),(r==null?void 0:r.currentConflict)&&t.jsx(xt,{injectionName:r.currentConflict.name,injectionType:r.currentConflict.type,onResolve:r.handleConflictResolution,onCancel:r.handleConflictCancel,"data-testid":"conflict-resolution-dialog"})]})},Td=u.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;let Xo=!1;const Gd=e=>{Xo||(e.editor.defineTheme("ergogen-theme",{base:"vs-dark",inherit:!0,rules:[],colors:{"editor.background":i.colors.backgroundLight}}),Xo=!0)};pr();const Hd=u.div`
  display: flex;
  flex-direction: column;
  color: #ffffff;
  height: 100%;
  width: 100%;
  font-family: 'Roboto', sans-serif;
`,Vd=Jr`
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
    font-family: ${i.fonts.body};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: ${i.colors.text};
  }

  code {
    font-family: ${i.fonts.code};
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
`;ir.config({paths:{vs:"/monaco/vs"}});ir.init().then(e=>{Gd(e);const n=document.getElementById("root");Yr(n).render(t.jsx(nr.StrictMode,{children:t.jsx(Xr,{basename:("/".startsWith("."),"/"),children:t.jsxs(Hd,{children:[t.jsx(Vd,{}),t.jsx(Od,{})]})})}))});export{gt as a,i as t};
