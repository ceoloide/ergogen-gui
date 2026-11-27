const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/PcbPreview-BI1R2Mfv.js","assets/vendor-DNe9Y6n2.js","assets/StlPreview-C8fX9xJp.js","assets/three-Dk8hj5rH.js","assets/js-yaml-DW8Bub87.js","assets/jszip-CyTxqeGV.js"])))=>i.map(i=>d[i]);
var Wr=Object.defineProperty;var Or=(e,t,i)=>t in e?Wr(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i;var ot=(e,t,i)=>Or(e,typeof t!="symbol"?t+"":t,i);import{f as Ke,r as p,h as ro,i as qo,j as n,k as Jo,y as u,O as xt,p as Xo,l as Fr,m as Mr,n as Yo,o as Zo,q as Br,t as Tr,v as an,w as Qo,L as er,x as Gr,z as Pt,N as io,A as Vr,B as tr,e as Hr,C as Kr}from"./vendor-DNe9Y6n2.js";import{j as fe}from"./js-yaml-DW8Bub87.js";import{J as ln}from"./jszip-CyTxqeGV.js";import{_ as nr}from"./three-Dk8hj5rH.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function i(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(s){if(s.ep)return;s.ep=!0;const a=i(s);fetch(s.href,a)}})();const cn=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/ergogen.worker-yOrnwBol.js",import.meta.url),{type:"module"})}catch(e){return console.error("Failed to create worker:",e),null}},or=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/jscad.worker-C8nLBdOi.js",import.meta.url),{type:"module"})}catch(e){return console.error("Failed to create JSCAD worker:",e),null}},qr="0.19.3",yt={version:qr},dn={GENERATION_WORKER_FAILED:{kind:"app",message:"The generation worker failed to load or threw an uncaught error.",fix:"Reload the page. If the error comes back, report it with this console output."},STL_WORKER_FAILED:{kind:"app",message:"The STL conversion worker failed to load or threw an uncaught error.",fix:"Reload the page. If the error comes back, turn off STL Preview in the settings and report the error with this console output."},STL_PREVIEW_FAILED:{kind:"app",message:"The 3D preview of a case failed to render.",fix:"Check that the browser has WebGL turned on. If the error comes back, turn off STL Preview in the settings and report the error with this console output."},UNCLASSIFIED:{kind:"app",message:"The app caught an error that has no diagnostic code.",fix:"Report the error with this console output, so that a maintainer can give it a code."}};class Jr extends Error{constructor(i,o){super(dn[i].message,o);ot(this,"code");this.name="DiagnosticError",this.code=i}}const Xr="https://github.com/ceoloide/ergogen-gui/blob/main/docs/diagnostics.md",Yr=".agents/skills/ergogen-gui-diagnostics/SKILL.md",Zr=e=>e.toLowerCase(),Qr=(e,t,i)=>{const o=dn[e],s=Zr(e);return[`${e}: ${o.message}`,...i===o.message?[]:[`Error: ${i}`],`Location: ${t}`,`Fix: ${o.fix}`,`Docs: ${Xr}#${s}`,`Agents: ${Yr}#${s}`].join(`
`)},un=e=>{const t=`v${Ke.version}`,i=Ke.version,o=Ke.repository,s=o.startsWith("github:")?o.replace("github:","https://github.com/"):o.replace(/^git\+/,"").replace(/\.git$/,"");if(!e)return{label:t,url:s,displayText:i,isCustom:!1,isHash:!1,isTag:!1};if(e.includes("@")){const k=e.split("@"),w=k[1]||e;return{label:e,url:e.startsWith("ergogen@")?`${s}/releases/tag/v${w}`:`https://www.npmjs.com/package/${k[0]}`,displayText:w,isCustom:!0,isHash:!1,isTag:!0}}const a=e.startsWith("github:")?e.slice(7):e,[l,c]=a.split("#"),f=l==="ergogen/ergogen",d=`https://github.com/${l}`;if(f){if(!c)return{label:"latest",url:d,displayText:i,isCustom:!1,isHash:!1,isTag:!1};const k=c.length===40&&/^[0-9a-fA-F]{40}$/.test(c),w=k?t:c,h=k?`${d}/commit/${c}`:`${d}/tree/${c}`;return{label:c,url:h,displayText:w,isCustom:!0,isHash:k,isTag:!k}}if(!c)return{label:a,url:d,displayText:i,isCustom:!0,isHash:!1,isTag:!1};const g=c.length===40&&/^[0-9a-fA-F]{40}$/.test(c),m=g?t:c,b=g?`${d}/commit/${c}`:`${d}/tree/${c}`;return{label:a,url:b,displayText:m,isCustom:!0,isHash:g,isTag:!g}},pn=e=>{if(e.includes("@")){const s=e.split("@"),a=s[1]||e,l=s[0];return`github:${l==="ergogen"?"ergogen/ergogen":l}#v${a}`}const t=e.startsWith("github:")?e.slice(7):e,[i,o]=t.split("#");return o?`github:${i}#${o}`:`github:${i}#v${Ke.version}`},Ue=e=>{const i=e.replace(/^v/,"").match(/^(\d+)\.(\d+)\.(\d+)/);return i?[Number(i[1]),Number(i[2]),Number(i[3])]:null},Kt=(e,t)=>{for(let i=0;i<3;i++){if(e[i]>t[i])return!0;if(e[i]<t[i])return!1}return!0},so=e=>{const t=e.match(/(?:^|#|@|v)(\d+\.\d+\.\d+)/);return t?t[1]:null},ei=e=>{const t=e.startsWith("github:")?e.slice(7):e,[i]=t.split("#");return!e.startsWith("github:")&&!e.includes("/")?!1:i!=="ergogen/ergogen"},rr=()=>{if(typeof window>"u")return!1;const e=window.navigator;return typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches||e.standalone===!0},ir=e=>{if(typeof window>"u")return!0;if(window.__FORCE_ANALYTICS__===!0||e.startsWith("G-TEST"))return!1;const t=window.location.hostname;return!!(t==="localhost"||t==="127.0.0.1"||t==="[::1]"||t.endsWith(".localhost"))},ti=()=>{if(typeof document>"u"||!document.cookie)return;const e=document.cookie.split(";");for(const t of e){const i=t.indexOf("="),o=(i>-1?t.substring(0,i):t).trim();if(o.startsWith("_ga")){document.cookie=`${o}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`;const a=window.location.hostname.split(".");for(;a.length>0;){const l=a.join(".");document.cookie=`${o}=; Path=/; Domain=.${l}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`,document.cookie=`${o}=; Path=/; Domain=${l}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`,a.shift()}}}},ni=()=>{if(!(typeof indexedDB>"u"))try{indexedDB.deleteDatabase("workbox-background-sync")}catch{}},sr=()=>typeof window>"u"||!window.location?void 0:`${window.location.origin&&window.location.origin!=="null"?window.location.origin:`${window.location.protocol||"https:"}//${window.location.hostname||"localhost"}`}${window.location.pathname||"/"}`,ar="ergogen:consent:sendUsageMetrics",oi="ergogen:config:sendUsageMetrics",ri="ergogen:settings";let ht;const ao=e=>{const t=localStorage.getItem(e);if(t!==null)try{const i=JSON.parse(t);return typeof i=="boolean"?i:void 0}catch{return}},ii=()=>{const e=localStorage.getItem(ri);if(e!==null)try{const t=JSON.parse(e);return t&&typeof t=="object"&&typeof t.sendUsageMetrics=="boolean"?t.sendUsageMetrics:void 0}catch{return}},kt=()=>{if(typeof window>"u")return!1;if(ht!==void 0)return ht;try{const e=ao(ar);if(e!==void 0)return e;if(ao(oi)===!1||ii()===!1)return!1}catch{return!1}return!rr()},si=e=>{try{localStorage.setItem(ar,JSON.stringify(e)),ht=void 0}catch{ht=e}};let Ge=!1;const lr=()=>{var s;if(typeof window>"u")return;const e=kt(),t="G-46F2L343EK",i=ir(t),o=document.getElementById("gtag-script");if(o||(Ge=!1),e&&t&&!i){delete window["ga-disable-"+t];const a=window,l={send_page_view:!1,allow_google_signals:!1,allow_ad_personalization_signals:!1},c=()=>{var f;return(f=a.gtag)==null?void 0:f.call(a,"set",{page_location:sr()})};if(o)Ge&&(c(),(s=a.gtag)==null||s.call(a,"config",t,l),Ge=!1);else{const f=document.createElement("script");f.async=!0,f.src=`https://www.googletagmanager.com/gtag/js?id=${t}`,f.id="gtag-script",document.head.appendChild(f);const d=a.dataLayer||[];a.dataLayer=d,a.gtag=function(){d.push(arguments)},a.gtag("js",new Date),c(),a.gtag("config",t,l),Ge=!1}hi()}else window["ga-disable-"+t]=!0,o&&(Ge=!0),ti(),ni(),gi()},ai=new Set(["yaml","yml","json","zip","ekb"]),li=e=>{const t=e.lastIndexOf("."),i=t>=0?e.slice(t+1).toLowerCase():"";return ai.has(i)?i:"other"},cr=100,ci=/"[^"\n]*"|'[^'\n]*'|`[^`\n]*`/g,di=/^at\s|^[^\s@]*@\S+:\d+:\d+$/,ui=e=>e.split(`
`)[0].replace(ci,t=>`${t[0]}*${t[0]}`).trim().slice(0,cr),pi=e=>{const t=e.split(`
`).map(i=>i.trim()).filter(i=>di.test(i));return t.length>0?t.join(" ").slice(0,cr):void 0},fi=e=>{const t={...e};for(const i of["error_message","description"]){const o=t[i];typeof o=="string"&&(t[i]=ui(o))}return typeof t.error_stack=="string"&&(t.error_stack=pi(t.error_stack)),t},M=(e,t)=>{if(kt()&&!ir("G-46F2L343EK")&&window.gtag){const o=sr();window.gtag("set",{page_location:o}),window.gtag("event",e,{page_location:o,gui_version:yt.version,ergogen_version:pn("github:ceoloide/ergogen#v4.3.0"),is_pwa:rr(),...fi(t??{})})}},gt=(e,t,i,o="UNCLASSIFIED")=>{const s=e instanceof Error?e.message:e,a=e instanceof Error?e.stack:void 0,l=e instanceof Jr?e.code:o;console.error(Qr(l,i,s)),M("exception",{description:`[${i}] ${s}`,fatal:t,error_stack:a,error_code:l,error_kind:dn[l].kind,error_location:i})};let mt=!1;const dr=e=>{gt(e.error||e.message,!1,"unhandled_error")},ur=e=>{gt(e.reason||"Unhandled Promise Rejection",!1,"unhandled_rejection")},hi=()=>{typeof window>"u"||mt||(window.addEventListener("error",dr),window.addEventListener("unhandledrejection",ur),mt=!0)},gi=()=>{typeof window>"u"||mt&&(window.removeEventListener("error",dr),window.removeEventListener("unhandledrejection",ur),mt=!1)};function mi(e){function t(d,g){return d>>>g|d<<32-g}const i=[],o=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],s=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],a=unescape(encodeURIComponent(e));for(let d=0;d<a.length;d++){const g=a.charCodeAt(d);i[d>>2]|=g<<24-d%4*8}const l=a.length;i[l>>2]|=128<<24-l%4*8;const c=(l+8>>6)+1;i[c*16-1]=l*8;for(let d=0;d<c;d++){const g=[];for(let L=0;L<16;L++)g[L]=i[d*16+L]||0;for(let L=16;L<64;L++){const I=t(g[L-15],7)^t(g[L-15],18)^g[L-15]>>>3,j=t(g[L-2],17)^t(g[L-2],19)^g[L-2]>>>10;g[L]=g[L-16]+I+g[L-7]+j|0}let m=o[0],b=o[1],k=o[2],w=o[3],h=o[4],_=o[5],C=o[6],P=o[7];for(let L=0;L<64;L++){const I=t(h,6)^t(h,11)^t(h,25),j=h&_^~h&C,W=P+I+j+s[L]+g[L]|0,R=t(m,2)^t(m,13)^t(m,22),A=m&b^m&k^b&k,O=R+A|0;P=C,C=_,_=h,h=w+W|0,w=k,k=b,b=m,m=W+O|0}o[0]=o[0]+m|0,o[1]=o[1]+b|0,o[2]=o[2]+k|0,o[3]=o[3]+w|0,o[4]=o[4]+h|0,o[5]=o[5]+_|0,o[6]=o[6]+C|0,o[7]=o[7]+P|0}let f="";for(let d=0;d<8;d++){const g=o[d];f+=(g>>>24&255).toString(16).padStart(2,"0"),f+=(g>>>16&255).toString(16).padStart(2,"0"),f+=(g>>>8&255).toString(16).padStart(2,"0"),f+=(g&255).toString(16).padStart(2,"0")}return f}function qt(e,t){if(!e||typeof e!="object")return!1;const i=e;for(const o of t)if(i[o]===!0)return!0;for(const o of Object.keys(i))if(qt(i[o],t))return!0;return!1}const It=e=>Math.round((e+Number.EPSILON)*100)/100,lo=e=>{if(!e||typeof e!="object")return;const t=e.meta;if(!t||typeof t!="object")return;const i=t.zone;if(i){if(typeof i=="object"&&i!==null)return i.name;if(typeof i=="string")return i}};function bi(e,t,i,o){const s=fe.load(e)||{},a=fe.load(t)||{},l=s.outlines||{},c=Object.keys(l),f=c.filter(Z=>!Z.startsWith("_")).length,d=c.length,g=Object.keys(s.pcbs||{}).length,m=Object.keys(s.cases||{}).length,b=qt(s.pcbs,["reversible","reverse"]),k=qt(s.points,["mirror"]),w=s.meta||{},h=w.name??"no_name",_=w.author??"no_author",C=s.points||{},P=Object.keys(C.zones||{}).length,L=C.zones||{},j=Object.keys(L).filter(Z=>{const B=L[Z];return B&&typeof B=="object"&&("columns"in B||"rows"in B)}),W=j.length,R=W>0;let A="",O="",x="",E=0;const $=Object.keys(a);if(R){const Z=[...j].sort(),B=[],N=[],T=[];for(const Q of Z){const G=L[Q],y=Object.keys((G==null?void 0:G.columns)||{}),V=Object.keys((G==null?void 0:G.rows)||{}),H=(G==null?void 0:G.mirror)===!0||typeof(G==null?void 0:G.mirror)=="object"&&(G==null?void 0:G.mirror)!==null,ee=C.mirror===!0||typeof C.mirror=="object"&&C.mirror!==null,K=H||ee;let ie=$.filter(Oe=>{const he=a[Oe];if(lo(he)!==Q)return!1;if(he&&typeof he=="object"){const ge=he.meta;if(ge&&typeof ge=="object"&&ge.mirrored===!0)return!1}return!Oe.startsWith("mirror_")}).length;K&&(ie*=2),B.push(y.length),N.push(V.length),T.push(ie),E+=ie}A=B.join(","),O=N.join(","),x=T.join(",")}const U=$.map(Z=>{const B=a[Z],N=lo(B),Q=(N?j.includes(N):!1)?"K":"A",G=It((B==null?void 0:B.x)??0),y=It((B==null?void 0:B.y)??0),V=It((B==null?void 0:B.r)??0);return{name:Z,type:Q,x:G,y,r:V}});U.sort((Z,B)=>Z.x!==B.x?Z.x-B.x:Z.y!==B.y?Z.y-B.y:Z.r!==B.r?Z.r-B.r:Z.name.localeCompare(B.name));const F=U.map(Z=>`${Z.type}${Z.x.toString()};${Z.y.toString()};${Z.r.toString()}`).join("|"),D=`${h}|${_}|${F}`,J=mi(D).substring(0,12),ne=!k&&b?E*2:E;return{total_generation_time_ms:i,count_outlines:f,count_raw_outlines:d,count_pcbs:g,count_cases:m,is_reversible:b,is_mirrored:k,count_zones:P,matrix_zones:W,has_matrix:R,matrix_col_counts:A,matrix_row_counts:O,matrix_key_counts:x,matrix_keys:E,keyboard_keys:ne,config_id:J,previous_config_id:o}}const We=e=>Array.isArray(e)&&e.length===3&&typeof e[0]=="string"&&typeof e[1]=="string"&&typeof e[2]=="string",pr=(e,t,i)=>!i||i.length===0?{hasConflict:!1}:i.some(s=>We(s)&&s[0]===e&&s[1]===t)?{hasConflict:!0,conflictingName:t}:{hasConflict:!1},wi=(e,t)=>{if(!t||t.length===0)return[];const i=[];for(const o of e){if(!We(o))continue;const[s,a]=o,l=pr(s,a,t);l.hasConflict&&i.push({injection:o,conflict:l})}return i},fr=(e,t,i)=>{if(!i||i.length===0)return t;const o=new Set(i.filter(l=>We(l)&&l[0]===e).map(l=>l[1]));let s=1,a=`${t}_${s}`;for(;o.has(a);)s++,a=`${t}_${s}`;return a},Lt=(e,t,i)=>{const o=t?[...t]:[];for(const s of e){if(!We(s)){console.warn("[mergeInjectionArraysWithResolution] Skipping invalid injection format:",s);continue}const[a,l,c]=s;if(!pr(a,l,o).hasConflict)o.push([a,l,c]);else{if(i==="skip")continue;if(i==="overwrite"){const d=o.findIndex(g=>We(g)&&g[0]===a&&g[1]===l);d!==-1&&(o[d]=[a,l,c])}else if(i==="keep-both"){const d=fr(a,l,o);o.push([a,d,c])}}}return o},_t=e=>{const[t,i]=p.useState([]),o=t.length>0?t[0]:null,[s,a]=p.useState(null),[l,c]=p.useState(null),[f,d]=p.useState(null),g=p.useCallback(async(w,h,_=null,C)=>{var R,A,O;const P=C||e.getCurrentInjections();if(w.length===0){e.setInjectionInput(P),e.setConfigInput(h),await e.generateNow(h,P,{pointsonly:!1}),await((R=e.onComplete)==null?void 0:R.call(e,h,P));return}const L=w.filter(x=>We(x)?!0:(console.warn("[useInjectionConflictResolution] Skipping invalid injection format:",x),!1));if(L.length===0){e.setInjectionInput(P),e.setConfigInput(h),await e.generateNow(h,P,{pointsonly:!1}),await((A=e.onComplete)==null?void 0:A.call(e,h,P));return}const I=wi(L,P);if(I.length>0&&!_){const x=I.map(E=>({injection:E.injection,conflict:E.conflict}));M("conflict_encountered",{conflict_count:I.length}),i(x),a(L),c(h),d(P);return}const W=Lt(L,P,_||"skip");e.setInjectionInput(W),e.setConfigInput(h),await e.generateNow(h,W,{pointsonly:!1}),await((O=e.onComplete)==null?void 0:O.call(e,h,W))},[e]),m=p.useCallback(async(w,h)=>{var _,C;if(!(!s||!l||t.length===0))if(h){M("conflict_resolved",{strategy:w,apply_to_all:!0,remaining_count:t.length});const P=Lt(s,f||e.getCurrentInjections(),w);e.setInjectionInput(P),e.setConfigInput(l),await e.generateNow(l,P,{pointsonly:!1}),await((_=e.onComplete)==null?void 0:_.call(e,l,P)),i([]),a(null),c(null),d(null)}else{M("conflict_resolved",{strategy:w,apply_to_all:!1,remaining_count:t.length});const P=t[0],[L,I]=P.injection,j=P.injection,W=t.slice(1);i(W);let R=[...f||e.getCurrentInjections()],A=[...s||[]];if(w==="overwrite")R=R.filter(O=>!(O[0]===L&&O[1]===I));else if(w==="skip")A=A.filter(O=>!(O[0]===L&&O[1]===I&&O[2]===j[2]));else if(w==="keep-both"){const O=fr(L,I,R),x=[L,O,j[2]];R=[...R,x],A=A.filter(E=>!(E[0]===L&&E[1]===I&&E[2]===j[2]))}if(d(R),a(A),W.length===0){const O=Lt(A,R,"skip");e.setInjectionInput(O),e.setConfigInput(l),await e.generateNow(l,O,{pointsonly:!1}),await((C=e.onComplete)==null?void 0:C.call(e,l,O)),a(null),c(null),d(null)}}},[s,l,f,t,e]),b=p.useCallback(()=>{var w;M("conflict_cancelled",{remaining_count:t.length}),i([]),a(null),c(null),d(null),(w=e.setError)==null||w.call(e,"Loading cancelled by user")},[e,t.length]);return{currentConflict:p.useMemo(()=>o?{name:o.injection[1],type:o.injection[0]}:null,[o]),processInjectionsWithConflictResolution:g,handleConflictResolution:m,handleConflictCancel:b}},xi={templates:"4.3.0",outlines:"4.3.0"},Je=()=>Ke.version,co=e=>{const t=e.split("-")[0].replace(/^v/,"").split(".");for(;t.length<3;)t.push("0");return t.length>3||!t.every(i=>/^\d+$/.test(i))?null:[Number(t[0]),Number(t[1]),Number(t[2])]},yi=(e,t)=>{const i=co(e),o=co(t);if(!i||!o)return!1;const[s,a,l]=i,[c,f,d]=o;return s===c&&(a>f||a===f&&l>=d)},ki=(e,t)=>{const i=Ue(t),o=Ue(xi[e]);return i!==null&&o!==null?Kt(i,o):!1},_i=()=>({templates:"",outlines:""}),ce=e=>{if(typeof window<"u"&&window.location)try{const o=new URLSearchParams(window.location.search).get(`ff_${e}`);if(o==="true")return!0;if(o==="false")return!1}catch(i){console.warn("[FeatureFlags] Failed to check URL query parameters:",i)}const t=_i()[e];return t==="true"?!0:t==="false"?!1:ki(e,Je())},vi=50*1024*1024,ji=10*1024*1024,zt=(e,t)=>{const i=`${t}/`;let o=e;return o.startsWith(i)&&(o=o.substring(i.length)),o=o.replace(/\.js$/,""),o},$i=e=>{let t=e.file("config.yaml")||e.file("config.yml");if(!t){const i=e.file(/^config\.(yaml|yml)$/i);i&&i.length>0&&(t=i[0])}if(!t)throw new Error("The archive is missing a config.yaml file in the root directory.");return t},Jt=(e,t)=>{if(t&&e>vi)throw new Error(`File exceeds the maximum size limit of 50MB for archives (current size: ${(e/(1024*1024)).toFixed(1)}MB).`);if(!t&&e>ji)throw new Error(`File exceeds the maximum size limit of 10MB for text files (current size: ${(e/(1024*1024)).toFixed(1)}MB).`)},hr=(e,t,i)=>{const o=[];return e.forEach(s=>o.push(["footprint",s.name,s.content])),t.forEach(s=>o.push(["outline",s.name,s.content])),i.forEach(s=>o.push(["template",s.name,s.content])),o},Ci=async e=>{let t;try{t=await ln.loadAsync(e)}catch{throw new Error("The file appears to be corrupted. Please verify the file and try again.")}const o=await $i(t).async("string"),s=[],a=[];return t.forEach((l,c)=>{if(!(c.dir||!l.endsWith(".js"))){if(l.startsWith("footprints/")){const f=c.async("string").then(d=>{const g=zt(l,"footprints");s.push({type:"footprint",name:g,content:d})});a.push(f)}else if(l.startsWith("outlines/")&&ce("outlines")){const f=c.async("string").then(d=>{const g=zt(l,"outlines");s.push({type:"outline",name:g,content:d})});a.push(f)}else if(l.startsWith("templates/")&&ce("templates")){const f=c.async("string").then(d=>{const g=zt(l,"templates");s.push({type:"template",name:g,content:d})});a.push(f)}}}),await Promise.all(a),{config:o,injections:s}},Si=40,Ei=3;class me extends Error{constructor(t){super(t),this.name="RateLimitError"}}class Pi{constructor(){ot(this,"providers",[])}register(t){this.providers.push(t)}resolve(t){const i=t.trim();for(const o of this.providers)if(o.canHandle(i))return o;return/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(i)&&this.providers[0]||null}}const Xe=new Pi,Ii=e=>{const t=[],i=e.split(`
`);let o={};for(const s of i){const a=s.trim();if(a.startsWith("[submodule"))o.path&&o.url&&t.push({path:o.path,url:o.url}),o={};else{const l=a.indexOf("=");if(l!==-1){const c=a.substring(0,l).trim(),f=a.substring(l+1).trim();c==="path"?o.path=f:c==="url"&&(o.url=f)}}}return o.path&&o.url&&t.push({path:o.path,url:o.url}),t};class Ye{async fetchConfig(t){console.log(`[GitHub] Starting fetch from URL: ${t}`);const i=this.parseUrl(t),{owner:o,repo:s,branch:a,filePath:l,isRepoRoot:c}=i,f=i.host,d=[],g=[],m=[],b=async(w,h,_,C,P)=>{console.log("[GitHub] Checking for .gitmodules file");try{const L=await this.fetchFileContent(o,s,".gitmodules",h,f);console.log("[GitHub] .gitmodules found, parsing submodules");const I=Ii(L);for(const j of I)if(j.path.includes(_)||j.path.includes(C)&&ce("outlines")||j.path.includes(P)&&ce("templates")){const W=j.path.includes(C),R=j.path.includes(P),A=W?C:R?P:_,O=W?g:R?m:d,x=j.path.substring(j.path.indexOf(A)+A.length+1),E=Xe.resolve(j.url);if(E instanceof Ye){const $=E.parseUrl(j.url),U=$.host;let F=[];try{F=await E.fetchFootprintsFromDirectory($.owner,$.repo,"","main",[".js"],U)}catch(q){if(q instanceof me)throw q;try{F=await E.fetchFootprintsFromDirectory($.owner,$.repo,"","master",[".js"],U)}catch(J){if(J instanceof me)throw J;console.warn(`Failed to fetch submodule footprints from ${j.url}`)}}const D=F.map(q=>({name:x?`${x}/${q.name}`:q.name,content:q.content}));O.push(...D)}}}catch(L){if(L instanceof me)throw L}};if(!c){if(!l)throw new Error("Invalid URL. File path not specified.");const w=await this.fetchFileContent(o,s,l,a,f);Jt(w.length,!1);const h=l.split("/").pop()||"";if(!(h==="config.yaml"||h==="config.yml"))return{config:w,footprints:[],outlines:[],templates:[],configPath:h};const C=l.substring(0,l.lastIndexOf("/")),P=C?`${C}/footprints`:"footprints",L=C?`${C}/outlines`:"outlines",I=C?`${C}/templates`:"templates";try{const j=await this.fetchFootprintsFromDirectory(o,s,P,a,[".js"],f);d.push(...j)}catch(j){if(j instanceof me)throw j}if(ce("outlines"))try{const j=await this.fetchFootprintsFromDirectory(o,s,L,a,[".js",".svg"],f);g.push(...j)}catch(j){if(j instanceof me)throw j}if(ce("templates"))try{const j=await this.fetchFootprintsFromDirectory(o,s,I,a,[".js"],f);m.push(...j)}catch(j){if(j instanceof me)throw j}return await b(C,a,P,L,I),{config:w,footprints:d,outlines:g,templates:m,configPath:h}}const k=async w=>{var j,W,R,A,O,x,E,$,U,F,D,q;let h="",_="",C=!0;try{h=await this.fetchFileContent(o,s,"config.yaml",w,f),_=""}catch(J){const ne=J;if((j=ne.message)!=null&&j.includes("allowance")||(W=ne.message)!=null&&W.includes("limit exceeded")||(R=ne.message)!=null&&R.includes("rate limit"))throw ne;try{h=await this.fetchFileContent(o,s,"config.yml",w,f),_=""}catch(Z){const B=Z;if((A=B.message)!=null&&A.includes("allowance")||(O=B.message)!=null&&O.includes("limit exceeded")||(x=B.message)!=null&&x.includes("rate limit"))throw B;try{h=await this.fetchFileContent(o,s,"ergogen/config.yaml",w,f),_="ergogen"}catch(N){const T=N;if((E=T.message)!=null&&E.includes("allowance")||($=T.message)!=null&&$.includes("limit exceeded")||(U=T.message)!=null&&U.includes("rate limit"))throw T;try{h=await this.fetchFileContent(o,s,"ergogen/config.yml",w,f),_="ergogen"}catch(Q){const G=Q;if((F=G.message)!=null&&F.includes("allowance")||(D=G.message)!=null&&D.includes("limit exceeded")||(q=G.message)!=null&&q.includes("rate limit"))throw G;const{configYamls:y,anyYamls:V}=await this.bfsForYamlFiles(o,s,w,f);if(y.length>0){const H=y[0];h=await this.fetchFileContent(o,s,H,w,f),_=H.includes("/")?H.substring(0,H.lastIndexOf("/")):""}else if(V.length>0){const H=V[0];h=await this.fetchFileContent(o,s,H,w,f),_=H.includes("/")?H.substring(0,H.lastIndexOf("/")):"",C=!1}else throw new Error("No YAML configuration files found in repository")}}}}if(Jt(h.length,!1),!C)return{config:h,footprints:[],outlines:[],templates:[],configPath:_};const P=_?`${_}/footprints`:"footprints",L=_?`${_}/outlines`:"outlines",I=_?`${_}/templates`:"templates";try{const J=await this.fetchFootprintsFromDirectory(o,s,P,w,[".js"]);d.push(...J)}catch(J){if(J instanceof me)throw J}if(ce("outlines"))try{const J=await this.fetchFootprintsFromDirectory(o,s,L,w,[".js",".svg"]);g.push(...J)}catch(J){if(J instanceof me)throw J}if(ce("templates"))try{const J=await this.fetchFootprintsFromDirectory(o,s,I,w,[".js"]);m.push(...J)}catch(J){if(J instanceof me)throw J}return await b(_,w,P,L,I),{config:h,footprints:d,outlines:g,templates:m,configPath:_}};if(a!=="main")return await k(a);try{return await k("main")}catch(w){if(w instanceof me)throw w;return await k("master")}}async fetchFootprintsFromDirectory(t,i,o,s,a,l){const c=[],f=async d=>{try{const g=await this.listDirectory(t,i,d,s,l);for(const m of g){const b=m.path.startsWith(d)?m.path:d?`${d}/${m.path}`:m.path;if(m.type==="file"){if(a.some(w=>m.name.endsWith(w)))try{const w=await this.fetchFileContent(t,i,b,s,l),h=o?b.slice(o.length+1).replace(/\.[^/.]+$/,""):b.replace(/\.[^/.]+$/,"");console.log(`[GitHub] Loaded footprint: ${h}`),c.push({name:h,content:w})}catch(w){if(w instanceof me)throw w;const h=w;console.warn(`Failed to fetch file content: ${b}`,h.stack||h)}}else m.type==="dir"&&await f(b)}}catch(g){if(g instanceof me)throw g}};return await f(o),c}async bfsForYamlFiles(t,i,o,s){var g,m,b;const a=[],l=[],c=[{path:"",depth:0}],f=new Set;let d=0;for(;c.length>0&&d<Si;){const{path:k,depth:w}=c.shift();if(!f.has(k)){f.add(k);try{d++;const h=await this.listDirectory(t,i,k,o,s);for(const _ of h)if(_.type==="file"){const C=_.name.toLowerCase();(C.endsWith(".yaml")||C.endsWith(".yml"))&&!C.startsWith(".")&&C.replace(/\.(yaml|yml)$/,"")!=="metadata"&&C.replace(/\.(yaml|yml)$/,"")!=="virtual_env"&&(_.name==="config.yaml"||_.name==="config.yml"?a.push(_.path):l.push(_.path))}else _.type==="dir"&&w<Ei&&(_.name.startsWith(".")||c.push({path:_.path,depth:w+1}));if(a.length>0||l.length>0&&(c.length===0||c[0].depth>w))break}catch(h){const _=h;if((g=_.message)!=null&&g.includes("allowance")||(m=_.message)!=null&&m.includes("limit exceeded")||(b=_.message)!=null&&b.includes("rate limit"))throw _;continue}}}return{configYamls:a,anyYamls:l}}}const Li=(e,t)=>{var c,f,d,g;if(!e)return{isLimitExceeded:!1,error:null};if(t.includes("raw.githubusercontent.com"))return e.status===429?(console.warn("[GitHub] Raw content rate limit exceeded (429). Please wait 30 minutes and try again."),{isLimitExceeded:!0,error:"You've reached your hourly request allowance for loading content from GitHub. Please wait 30 minutes and try again."}):{isLimitExceeded:!1,error:null};const o=((c=e.headers)==null?void 0:c.get("X-RateLimit-Limit"))||"unknown",s=((f=e.headers)==null?void 0:f.get("X-RateLimit-Remaining"))||"unknown",a=((d=e.headers)==null?void 0:d.get("X-RateLimit-Used"))||"unknown",l=((g=e.headers)==null?void 0:g.get("X-RateLimit-Reset"))||"unknown";if(console.log(`[GitHub Rate Limit] Limit: ${o}, Remaining: ${s}, Used: ${a}, Reset: ${l}`),e.status===403&&s==="0")return console.warn("[GitHub] Rate limit exceeded. Please wait and try again in about an hour."),{isLimitExceeded:!0,error:"Cannot load from GitHub right now. You've used your hourly request allowance. Please wait about an hour and try again."};if(s!=="unknown"&&o!=="unknown"){const m=parseInt(o),b=parseInt(s),k=(m-b)/m*100;if(k>=80&&b>0)return console.warn(`[GitHub] Approaching rate limit: ${k.toFixed(1)}% used`),{isLimitExceeded:!1,error:"Loading from GitHub may become unavailable soon. You've used most of your hourly request allowance. This will reset within an hour."}}return{isLimitExceeded:!1,error:null}};class zi extends Ye{constructor(){super(...arguments);ot(this,"rateLimitWarning",null)}canHandle(i){const o=i.trim();return o.includes("github.com")||/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(o)}parseUrl(i){const o=i.trim();let s="",a="",l="main",c,f=!0;const d=!o.includes("github.com");if(d){const g=o.split("/").filter(Boolean);if(g.length<2)throw new Error("Invalid GitHub repository format. Must contain owner and repository.");s=g[0],a=g[1],f=g.length===2||g.length===4&&g[2]==="tree",f?g.length===4&&(l=g[3]):g[2]==="blob"||g[2]==="tree"?(l=g[3],c=g.slice(4).join("/")):c=g.slice(2).join("/")}else{let g=o;g.match(/^(https?:\/\/)/i)||(g=`https://${g}`);const m=g.endsWith("/")?g.slice(0,-1):g,k=new URL(m).pathname.split("/").filter(Boolean);if(k.length<2)throw new Error("Invalid GitHub URL. Must contain owner and repository.");s=k[0],a=k[1],f=k.length===2||k.length===4&&k[2]==="tree",f?k.length===4&&(l=k[3]):k[2]==="blob"||k[2]==="tree"?(l=k[3],c=k.slice(4).join("/")):c=k.slice(2).join("/")}return a.endsWith(".git")&&(a=a.slice(0,-4)),{owner:s,repo:a,branch:l,filePath:c,isRepoRoot:f,baseUrl:d?`https://github.com/${s}/${a}`:o}}async fetchFileContent(i,o,s,a){const l=`https://raw.githubusercontent.com/${i}/${o}/${a}/${s}`,c=await fetch(l);if(this.checkRateLimits(c,l),!c.ok)throw new Error(`Failed to fetch file content from GitHub: ${c.status}`);return await c.text()}async listDirectory(i,o,s,a){const l=`https://api.github.com/repos/${i}/${o}/contents/${s}?ref=${a}`,c=await fetch(l);if(this.checkRateLimits(c,l),!c.ok)throw new Error(`Failed to list directory from GitHub: ${c.status}`);const f=await c.json();let d=[];if(Array.isArray(f))d=f;else if(f&&typeof f=="object"&&"tree"in f&&Array.isArray(f.tree))d=f.tree;else throw new Error("Target path is not a directory");return d.map(g=>({name:g.name||g.path.split("/").pop()||"",path:g.path,type:g.type==="tree"?"dir":g.type==="blob"?"file":g.type}))}checkRateLimits(i,o){const s=Li(i,o);if(s.error&&!this.rateLimitWarning&&(this.rateLimitWarning=s.error),s.isLimitExceeded)throw new me(s.error||"Rate limit exceeded")}async fetchConfig(i){this.rateLimitWarning=null;const o=await super.fetchConfig(i);return this.rateLimitWarning&&(o.rateLimitWarning=this.rateLimitWarning),o}}Xe.register(new zi);const gr=async e=>{const t=Xe.resolve(e);if(!t)throw new Error(`Unsupported repository provider URL: ${e}`);return t.fetchConfig(e)};class Ri extends Ye{canHandle(t){return t.includes("codeberg.org")}parseUrl(t){const i=t.trim();let o="",s="",a="main",l,c=!0;const f=!i.includes("codeberg.org");if(f){const d=i.split("/").filter(Boolean);if(d.length<2)throw new Error("Invalid Codeberg repository format. Must contain owner and repository.");o=d[0],s=d[1],c=d.length===2||d.length===5&&d[2]==="src"&&(d[3]==="branch"||d[3]==="commit"),c?d.length===5&&(a=d[4]):d.length>=5&&d[2]==="src"&&(d[3]==="branch"||d[3]==="commit")?(a=d[4],l=d.slice(5).join("/")):l=d.slice(2).join("/")}else{let d=i;d.match(/^(https?:\/\/)/i)||(d=`https://${d}`);const g=d.endsWith("/")?d.slice(0,-1):d,b=new URL(g).pathname.split("/").filter(Boolean);if(b.length<2)throw new Error("Invalid Codeberg URL. Must contain owner and repository name.");o=b[0],s=b[1],c=b.length===2||b.length===5&&b[2]==="src"&&(b[3]==="branch"||b[3]==="commit"),c?b.length===5&&(a=b[4]):b.length>=5&&b[2]==="src"&&(b[3]==="branch"||b[3]==="commit")?(a=b[4],l=b.slice(5).join("/")):l=b.slice(2).join("/")}return s.endsWith(".git")&&(s=s.slice(0,-4)),{owner:o,repo:s,branch:a,filePath:l,isRepoRoot:c,baseUrl:f?`https://codeberg.org/${o}/${s}`:i}}async fetchFileContent(t,i,o,s){const a=`https://codeberg.org/api/v1/repos/${t}/${i}/raw/${o}?ref=${s}`,l=await fetch(a);if(!l.ok)throw new Error(`Failed to fetch file content from Codeberg API: ${l.status}`);return await l.text()}async listDirectory(t,i,o,s){const a=o?`/${o}`:"",l=`https://codeberg.org/api/v1/repos/${t}/${i}/contents${a}?ref=${s}`,c=await fetch(l);if(!c.ok)throw new Error(`Failed to list directory from Codeberg API: ${c.status}`);const f=await c.json();if(!Array.isArray(f))throw new Error("Target path is not a directory");return f.map(d=>({name:d.name,path:d.path||d.name,type:d.type}))}}Xe.register(new Ri);class Di extends Ye{canHandle(t){const i=t.trim();return i.match(/^(https?:\/\/)/i)?!i.includes("github.com")&&!i.includes("codeberg.org"):!1}parseUrl(t){const i=t.trim();let o="",s="",a="main",l,c=!0,f=i;f.match(/^(https?:\/\/)/i)||(f=`https://${f}`);const d=f.endsWith("/")?f.slice(0,-1):f,g=new URL(d),m=g.origin,b=g.pathname.split("/").filter(Boolean);if(b.length<2)throw new Error("Invalid Forgejo/Gitea URL. Must contain owner and repository name.");return o=b[0],s=b[1],c=b.length===2||b.length===5&&b[2]==="src"&&(b[3]==="branch"||b[3]==="commit"),c?b.length===5&&(a=b[4]):b.length>=5&&b[2]==="src"&&(b[3]==="branch"||b[3]==="commit")?(a=b[4],l=b.slice(5).join("/")):l=b.slice(2).join("/"),s.endsWith(".git")&&(s=s.slice(0,-4)),{owner:o,repo:s,branch:a,filePath:l,isRepoRoot:c,baseUrl:i,host:m}}async fetchFileContent(t,i,o,s,a){const c=`${a||"https://codeberg.org"}/api/v1/repos/${t}/${i}/raw/${o}?ref=${s}`,f=await fetch(c);if(!f.ok)throw new Error(`Failed to fetch file content from Gitea/Forgejo API: ${f.status}`);return await f.text()}async listDirectory(t,i,o,s,a){const l=a||"https://codeberg.org",c=o?`/${o}`:"",f=`${l}/api/v1/repos/${t}/${i}/contents${c}?ref=${s}`,d=await fetch(f);if(!d.ok)throw new Error(`Failed to list directory from Gitea/Forgejo API: ${d.status}`);const g=await d.json();if(!Array.isArray(g))throw new Error("Target path is not a directory");return g.map(m=>({name:m.name,path:m.path||m.name,type:m.type}))}}const Ai=new Di;Xe.register(Ai);const Ni=({processInjectionsWithConflictResolution:e,setError:t})=>{const[i,o]=p.useState(!1),s=p.useRef(!1);return p.useEffect(()=>{const a=async()=>{const l=new URLSearchParams(window.location.search),c=l.get("github"),f=l.get("codeberg"),d=l.get("forgejo"),g=l.get("gitea");let m=c||f||d||g;if(m){f&&!f.includes("codeberg.org")?m=`https://codeberg.org/${f}`:c&&!c.includes("github.com")&&(m=`https://github.com/${c}`),o(!0),console.log("[useConfigLoader] Loading from URL parameter:",m);try{const b=await gr(m);console.log("[useConfigLoader] Fetch result:",{configLength:b.config.length,footprintsCount:b.footprints.length,outlinesCount:b.outlines.length,configPath:b.configPath,rateLimitWarning:b.rateLimitWarning}),b.rateLimitWarning&&t(b.rateLimitWarning);const k=hr(b.footprints,b.outlines,b.templates);await e(k,b.config)}catch(b){console.error("[useConfigLoader] Failed to load from remote repository:",b),t(`Failed to load from remote repository: ${b instanceof Error?b.message:String(b)}`)}finally{o(!1)}}};s.current||(s.current=!0,a())},[e,t]),{isLoading:i}},uo="background-preview-",Ui=()=>({version:0,active:null,settledVersion:null,settledRequestKey:null}),Wi=e=>!e||!e.startsWith(uo)?null:e.slice(uo.length),Oi=(e,t,i,o)=>JSON.stringify([e,t,i,o]),Fi=(e,t,i)=>{var s;return i?(((s=e.active)==null?void 0:s.requestKey)??e.settledRequestKey)===t:!1},Mi=(e,t)=>{e.version+=1;const o={requestId:`${t.isManual?"ergogen-manual":"ergogen-generate"}-${e.version}-${t.now??Date.now()}`,version:e.version,targetConfigId:t.targetConfigId,requestKey:t.requestKey,isManual:t.isManual};return e.active=o,e.settledVersion=null,e.settledRequestKey=null,o},Bi=(e,t)=>{const i=Wi(t.requestId);if(i!==null)return{kind:"background-preview",configId:i};if(!e.active||t.requestId!==e.active.requestId)return{kind:"stale"};const o=e.active;return e.active=null,t.type==="error"?(e.settledVersion=null,e.settledRequestKey=null,{kind:"active-error",isManual:o.isManual}):t.type==="success"?(e.settledVersion=o.version,e.settledRequestKey=o.requestKey,{kind:"active-success",version:o.version,targetConfigId:o.targetConfigId,isManual:o.isManual}):(e.settledVersion=null,e.settledRequestKey=null,{kind:"active-unknown",isManual:o.isManual})},Ti=(e,t)=>e.active===null&&e.settledVersion!==null&&t===e.settledVersion,Rt=e=>{e.active=null,e.settledVersion=null,e.settledRequestKey=null},po=e=>{e.version+=1,e.active=null,e.settledVersion=null,e.settledRequestKey=null},Xt="ergogen:config",fn="ergogen:multi-config",Yt="LOCAL_STORAGE_CONFIG",fo=5e3,mr=e=>!e||!Array.isArray(e)?e:e.filter(t=>{if(!Array.isArray(t)||t.length!==3)return!0;const[i]=t;return!(i==="outline"&&!ce("outlines")||i==="template"&&!ce("templates"))}),Gi=e=>{if(!e||!Array.isArray(e))return null;const t=e.some(a=>Array.isArray(a)&&a[0]==="outline"),i=e.some(a=>Array.isArray(a)&&a[0]==="template"),o=t&&!ce("outlines"),s=i&&!ce("templates");if(o||s){const a=[];return o&&a.push("outlines"),s&&a.push("templates"),`Custom ${a.join(" and ")} were skipped because the respective feature flags are disabled in settings.`}return null},Vi=e=>{if(!e||typeof e!="object")return null;const t=e;if(!t.pcbs||typeof t.pcbs!="object")return null;const i=t.pcbs;for(const o of Object.values(i))if(o&&typeof o=="object"&&(!o.template||o.template==="kicad5")){const s=o.footprints;if(s&&typeof s=="object"){for(const a of Object.values(s))if(a&&typeof a=="object"&&typeof a.what=="string"&&a.what.startsWith("ceoloide"))return'KiCad 5 is deprecated. Please add "template: kicad8" to your PCB definitions to avoid errors when opening PCB files with KiCad 8 or newer.'}}return null},Hi=(e,t)=>{if(e&&typeof e=="object"){const i=e;return i.points&&t?{...i,pcbs:void 0,cases:void 0}:i}return e},Zt=e=>{var t;return((t=e==null?void 0:e.getRealtimeConfigInput)==null?void 0:t.call(e))??(e==null?void 0:e.configInput)??""},Ve=(e,t)=>{if(typeof window>"u")return t;try{const i=localStorage.getItem(e);return i!==null?JSON.parse(i):t}catch{return t}},ho=()=>({debug:Ve("ergogen:config:debug",!1),autoGen:Ve("ergogen:config:autoGen",!0),autoGen3D:Ve("ergogen:config:autoGen3D",!0),kicanvasPreview:Ve("ergogen:config:kicanvasPreview",!0),stlPreview:Ve("ergogen:config:stlPreview",!0),sendUsageMetrics:kt()}),br=p.createContext(null),Ae=()=>typeof window<"u"&&window.crypto&&window.crypto.randomUUID?window.crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,e=>{const t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)}),rt=(e,t)=>{let i=0;for(const o of e){const s=o.name.match(t);if(s){const a=parseInt(s[1],10);!isNaN(a)&&a>i&&(i=a)}}return i+1},bt="ergogen:deleted-config",Ki=e=>{try{const t=localStorage.getItem(bt),i={version:1,configs:[]};if(t){const s=JSON.parse(t);s&&Array.isArray(s.configs)&&(i.configs=s.configs,s.version!==void 0&&(i.version=s.version))}const o={...e,deletedAt:new Date().toISOString()};i.configs.push(o),localStorage.setItem(bt,JSON.stringify(i))}catch(t){console.error("Failed to save deleted config to storage:",t)}},go=()=>{try{const e=localStorage.getItem(bt);if(!e)return;const t=JSON.parse(e);if(!t||!Array.isArray(t.configs))return;let i=t.configs;const o=Date.now(),s=90*24*60*60*1e3;i=i.filter(l=>{const c=new Date(l.deletedAt).getTime();return o-c<=s}),i.length>100&&(i.sort((l,c)=>{const f=new Date(l.updatedAt).getTime(),d=new Date(c.updatedAt).getTime();return f-d}),i=i.slice(i.length-100));const a={version:t.version||1,configs:i};localStorage.setItem(bt,JSON.stringify(a))}catch(e){console.error("Failed to prune deleted configs:",e)}},mo=e=>{if(!e)return;let t="";if(typeof e=="string")t=e;else if(Array.isArray(e))t=e.join("");else return;return t=t.replace(/width="[^"]+"/,'width="284px"').replace(/height="[^"]+"/,'height="134px"'),t=t.replace(/<svg/,'<svg style="background-color: rgb(51,51,51);"'),t=t.replaceAll(/stroke="#000"/g,'stroke="#AAA"'),t=t.replaceAll(/stroke:#000/g,"stroke:#AAA"),t},qi=()=>{if(typeof window>"u")return{version:2,activeConfigId:null,configs:[]};const e=localStorage.getItem(fn);if(e)try{const t=JSON.parse(e);if(t&&typeof t.version=="number"){const i=new Date().toISOString(),o=(t.configs||[]).map(s=>({...s,createdAt:s.createdAt||i,updatedAt:s.updatedAt||i}));return{...t,configs:o}}}catch(t){console.error("Failed to parse multi-config storage:",t)}return{version:2,activeConfigId:null,configs:[]}},ue=(e,t,i=2)=>{if(typeof window>"u")return;const o={version:i,activeConfigId:t,configs:e};localStorage.setItem(fn,JSON.stringify(o))},Ji=()=>{const e=qi();if(typeof window>"u")return e;const t=localStorage.getItem(Yt),i=localStorage.getItem(Xt);let o="";if(t)try{o=JSON.parse(t)}catch{o=t}else if(i)try{o=JSON.parse(i)}catch{o=i}if(o&&o.trim()!==""){if(!e.configs.some(a=>a.name==="Legacy Config")){const a=Ae(),l={id:a,name:"Legacy Config",config:o,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};e.configs.push(l),e.activeConfigId=a,ue(e.configs,a,2)}localStorage.removeItem(Yt),localStorage.removeItem(Xt)}return e},Xi=({initialInjectionInput:e,hashError:t,children:i})=>{const[o]=p.useState(()=>{if(typeof window>"u")return!1;const v=localStorage.getItem(Yt),S=localStorage.getItem(Xt);return!!(v||S)}),[s]=p.useState(()=>{if(typeof window>"u")return 2;const v=localStorage.getItem(fn);if(v)try{const S=JSON.parse(v);if(S&&typeof S.version=="number")return S.version}catch(S){console.warn("Failed to parse loaded version:",S)}return 1}),[a]=p.useState(()=>Ji()),[l,c]=p.useState(()=>a.configs),[f,d]=p.useState(()=>a.activeConfigId),[g,m]=p.useState(!1),[b,k]=p.useState(null),[w,h]=p.useState(()=>{if(a.activeConfigId){const v=a.configs.find(S=>S.id===a.activeConfigId);return v?v.config:""}return""}),_=p.useRef(l),C=p.useRef(f),P=p.useRef(g),L=p.useRef(b),I=p.useRef(w);p.useEffect(()=>{_.current=l},[l]),p.useEffect(()=>{C.current=f},[f]),p.useEffect(()=>{P.current=g},[g]),p.useEffect(()=>{L.current=b},[b]),p.useEffect(()=>{I.current=w},[w]);const j=p.useRef(w);p.useEffect(()=>{j.current=w},[w]);const W=p.useCallback(v=>{j.current=v},[]),R=p.useCallback(()=>j.current,[]),A=p.useRef(void 0),O=p.useRef(null),x=p.useRef(null),E=p.useCallback(()=>{x.current&&(clearTimeout(x.current.timeoutId),x.current=null)},[]),$=p.useCallback(()=>{const v=x.current;v&&(E(),M(v.name,v.payload))},[E]),U=p.useCallback(()=>{if($(),O.current){const{timeoutId:v,payload:S,configId:z}=O.current;clearTimeout(v),M("keyboard_generated",S),A.current=z,O.current=null}},[$]),F=p.useCallback(()=>{A.current=void 0,$(),O.current&&(clearTimeout(O.current.timeoutId),O.current=null)},[$]),[D,q]=ro("ergogen:injection",e),[J,ne]=p.useState(null),[Z,B]=p.useState(null),[N,T]=p.useState(null),[Q,G]=p.useState(null),[y,V]=p.useState(null),[H,ee]=p.useState(0),K=p.useRef(Ui()),se=p.useCallback(()=>{po(K.current),V(null),ae(!1),xe(!1)},[]),[ie,Oe]=ro("ergogen:settings",ho()),he=(ie==null?void 0:ie.debug)??!1,ke=(ie==null?void 0:ie.autoGen)??!0,ge=(ie==null?void 0:ie.autoGen3D)??!0,Fe=(ie==null?void 0:ie.kicanvasPreview)??!0,Ee=(ie==null?void 0:ie.stlPreview)??!0,hn=p.useRef(Ee);hn.current=Ee;const[$e,zr]=p.useState(kt),$t=p.useRef(ie);$t.current=ie;const gn=p.useRef(ke);gn.current=ke;const Ct=p.useRef($e);Ct.current=$e;const be=p.useCallback(v=>{const S=$t.current||ho(),z=v(S);$t.current=z,Oe(z)},[Oe]),mn=p.useCallback(v=>{be(S=>{const z=typeof v=="function"?v(S.debug):v;return{...S,debug:z}})},[be]),bn=p.useCallback(v=>{be(S=>{const z=typeof v=="function"?v(S.autoGen):v;return{...S,autoGen:z}})},[be]),wn=p.useCallback(v=>{be(S=>{const z=typeof v=="function"?v(S.autoGen3D):v;return{...S,autoGen3D:z}})},[be]),xn=p.useCallback(v=>{be(S=>{const z=typeof v=="function"?v(S.kicanvasPreview):v;return{...S,kicanvasPreview:z}})},[be]),yn=p.useCallback(v=>{be(S=>{const z=typeof v=="function"?v(S.stlPreview):v;return{...S,stlPreview:z}})},[be]),Me=p.useCallback((v,S,z)=>{if(E(),z||!gn.current){M(v,S);return}const X=setTimeout(()=>{x.current=null,M(v,S)},fo);x.current={name:v,payload:S,timeoutId:X}},[E]),kn=p.useCallback(v=>{const S=typeof v=="function"?v(Ct.current):v;Ct.current=S,si(S),zr(S),be(z=>({...z,sendUsageMetrics:S}))},[be]);p.useEffect(()=>{lr()},[$e]);const[Ce,_n]=p.useState(!1),[vn,Rr]=p.useState(!1),[jn,$n]=p.useState(!1),[Cn,Sn]=p.useState(!0),[En,Pn]=p.useState(!0),[In,ae]=p.useState(!1),[Ln,Ze]=p.useState(!1),we=p.useRef(null),Pe=p.useRef(null),[zn,xe]=p.useState(!1),Rn=p.useRef(!0),St=p.useRef(null);p.useEffect(()=>{go()},[]),p.useEffect(()=>{t&&ne(t)},[t]);const Dn=p.useCallback(()=>ne(null),[]),An=p.useCallback(()=>B(null),[]),Nn=p.useCallback(()=>T(null),[]),Un=p.useCallback(()=>G(null),[]),Wn=p.useCallback(v=>{var X,oe,Y,re,de,_e;const S=v.data,z=Bi(K.current,S);if(z.kind==="background-preview"){const te=z.configId;if(S.type==="success"&&S.results){const ye=S.results,ze=((oe=(X=ye.outlines)==null?void 0:X.preview)==null?void 0:oe.svg)||((Y=ye.demo)==null?void 0:Y.svg),Be=mo(ze);Be&&c(nt=>{const Te=nt.map(le=>le.id===te?{...le,previewSvg:Be}:le);return ue(Te,C.current,2),Te})}else S.type==="error"&&console.warn(`Background generation failed for config ${te}:`,S.error);return}if(z.kind!=="stale"){if(z.kind==="active-error"){const te=S.type==="error"&&S.error||"Unknown worker error";console.error("--- Ergogen worker error:",te),ne(te),ae(!1),xe(!1),Me("generation_failed",{error_message:te,stored_configs_count:_.current.length,trigger:z.isManual?"manual":"auto"},z.isManual);return}if(z.kind==="active-success")if(S.type==="success"&&S.warnings&&S.warnings.length>0&&B(te=>(te?te+`
`:"")+S.warnings.join(`
`)),S.type==="success"&&S.results){const te=S.results,ye=St.current?performance.now()-St.current:0;Me("generation_completed",{duration_ms:Math.round(ye),points_count:te.points?Object.keys(te.points).length:0,pcbs_count:te.pcbs?Object.keys(te.pcbs).length:0,cases_count:te.cases?Object.keys(te.cases).length:0,has_outlines:!!te.outlines,stored_configs_count:_.current.length,trigger:z.isManual?"manual":"auto"},z.isManual);try{const le=fe.dump(te.canonical||{}),Se=fe.dump(te.points||{}),je=bi(le,Se,Math.round(ye),A.current);if(je.config_id!==A.current){O.current&&clearTimeout(O.current.timeoutId);const Ur=setTimeout(()=>{M("keyboard_generated",je),A.current=je.config_id,O.current=null},fo);O.current={timeoutId:Ur,payload:je,configId:je.config_id}}}catch(le){console.error("Failed to generate keyboard configuration analytics:",le)}const ze=((de=(re=te.outlines)==null?void 0:re.preview)==null?void 0:de.svg)||((_e=te.demo)==null?void 0:_e.svg),Be=mo(ze),nt=z.targetConfigId;Be&&nt&&c(le=>{const Se=le.map(je=>je.id===nt?{...je,previewSvg:Be}:je);return ue(Se,C.current,2),Se});let Te=!1;if(hn.current&&te.cases&&Object.keys(te.cases).length>0){for(const le of Object.keys(te.cases)){const Se=te.cases[le];Se!=null&&Se.jscad&&(te.cases[le].stl=void 0)}if(Pe.current){Te=!0,xe(!0);const le={type:"batch_jscad_to_stl",results:te,configVersion:z.version};Pe.current.postMessage(le)}}V(te),ee(le=>le+1),Te||ae(!1)}else ae(!1);else ae(!1),xe(!1)}},[Me]),On=p.useRef(Wn);On.current=Wn;const Fn=p.useCallback(v=>{const S=v.data;Ti(K.current,S.configVersion)&&(S.type==="error"?(console.error("--- JSCAD worker error:",S.error),xe(!1),ae(!1)):S.type==="success"&&S.results&&(V(S.results),ee(z=>z+1),xe(!1),ae(!1)))},[]),Mn=p.useRef(Fn);Mn.current=Fn;const Qe=p.useCallback(()=>{we.current&&(we.current.terminate(),we.current=null,Ze(!1));const v=cn();return v?(v.onmessage=S=>On.current(S),v.onerror=S=>{const z=S.message||"Ergogen worker error";Rt(K.current),ne(z),ae(!1),xe(!1),gt(S.message||"Worker crash",!1,"ergogen_worker","GENERATION_WORKER_FAILED")},we.current=v,Ze(!0)):(Ze(!1),console.warn("Failed to initialize Ergogen worker.")),v},[]);p.useEffect(()=>{if(we.current||Qe(),!Pe.current){const v=or();v?(v.onmessage=S=>Mn.current(S),v.onerror=S=>{xe(!1),ae(!1),gt(S.message||"Worker crash",!1,"jscad_worker","STL_WORKER_FAILED")},Pe.current=v):console.warn("Failed to initialize JSCAD worker.")}return()=>{we.current&&(we.current.terminate(),we.current=null,Ze(!1)),Pe.current&&(Pe.current.terminate(),Pe.current=null)}},[Qe]),p.useEffect(()=>{const v=()=>{document.visibilityState==="hidden"&&U()};return window.addEventListener("visibilitychange",v),window.addEventListener("pagehide",U),()=>{window.removeEventListener("visibilitychange",v),window.removeEventListener("pagehide",U),U()}},[U]);const Et=p.useRef({debug:he,autoGen:ke,autoGen3D:ge,kicanvasPreview:Fe,stlPreview:Ee,sendUsageMetrics:$e});p.useEffect(()=>{const v={debug:he,autoGen:ke,autoGen3D:ge,kicanvasPreview:Fe,stlPreview:Ee,sendUsageMetrics:$e},{sendUsageMetrics:S,...z}=v;if(Rn.current)Rn.current=!1,Et.current=v,M("settings_loaded",{...z});else{const X=Et.current,oe=Object.keys(v).find(Y=>v[Y]!==X[Y]);Et.current=v,M("setting_changed",{...oe?{setting_name:oe,setting_value:v[oe]}:{},...z})}},[he,ke,ge,Fe,Ee,$e]);const Bn=p.useCallback(v=>{let S="UNKNOWN",z=null;try{z=JSON.parse(v),S="json"}catch{}try{z=fe.load(v),S="yaml"}catch{}return[S,z]},[]),et=p.useCallback(async(v,S,z={pointsonly:!0})=>{const X=v===void 0||v===I.current?j.current??I.current:v;if(!X)return;const oe=mr(S),Y=Oi(X,oe,!!z.pointsonly,he);if(Fi(K.current,Y,z.skipIfCurrent))return;const[,re]=Bn(X);ne(null),B(null),T(null),ae(!0),St.current=performance.now();const de=Vi(re);de&&B(de);const _e=Gi(S);_e&&T(_e);const te=Hi(re,z.pointsonly)||X;try{if(!we.current){console.error("Worker not available for processing request."),Rt(K.current),ae(!1),xe(!1),ne("Worker not available for processing request.");return}const ye=Mi(K.current,{requestKey:Y,targetConfigId:C.current,isManual:!!z.isManual});we.current.postMessage({type:"generate",inputConfig:te,injectionInput:oe,requestId:ye.requestId,options:{debug:he,svg:!0}})}catch(ye){Rt(K.current),ae(!1),xe(!1);const ze=typeof ye=="string"?ye:String(ye);ne(ze),Me("generation_failed",{error_message:ze,stored_configs_count:_.current.length,trigger:z.isManual?"manual":"auto"},!!z.isManual);return}},[Bn,ne,B,T,ae,he,Me]),Le=p.useMemo(()=>qo((v,S,z={pointsonly:!0})=>et(v,S,{...z,skipIfCurrent:!0}),300),[et]),Ie=p.useCallback(async(v,S,z={pointsonly:!0})=>{Le.cancel(),await et(v,S,z)},[Le,et]),tt=p.useCallback(v=>{const S=I.current,z=typeof v=="function"?v(S):v;if(z!==S)if(h(z),P.current){if(z!==L.current){const oe=`Shared Config ${rt(_.current,/^Shared\s+Config\s+(\d+)$/)}`,Y=Ae(),re=new Date().toISOString(),de={id:Y,name:oe,config:z||"",createdAt:re,updatedAt:re},_e=[..._.current,de];c(_e),d(Y),m(!1),k(null),ue(_e,Y)}}else{const X=C.current;if(X){const oe=_.current.map(Y=>Y.id===X?{...Y,config:z||"",updatedAt:new Date().toISOString()}:Y);c(oe),ue(oe,X)}else{const Y=`Untitled ${rt(_.current,/^Untitled\s+(\d+)$/)}`,re=Ae(),de=new Date().toISOString(),_e={id:re,name:Y,config:z||"",createdAt:de,updatedAt:de},te=[..._.current,_e];c(te),d(re),ue(te,re)}}},[]),Tn=p.useCallback(v=>{if(F(),se(),v===null)d(null),C.current=null,m(!1),k(null),h(""),I.current="",ue(_.current,null);else{const S=_.current.find(z=>z.id===v);S&&(d(v),C.current=v,m(!1),k(null),h(S.config),I.current=S.config,ue(_.current,v),M("config_selected",{stored_configs_count:_.current.length}))}},[F,se]),Gn=p.useCallback((v,S)=>{F(),se();const z=rt(_.current,/^Untitled\s+(\d+)$/),X=S||`Untitled ${z}`,oe=Ae(),Y=new Date().toISOString(),re={id:oe,name:X,config:v,createdAt:Y,updatedAt:Y},de=[..._.current,re];return c(de),d(oe),m(!1),k(null),h(v),M("config_created",{stored_configs_count:de.length}),_.current=de,C.current=oe,I.current=v,ue(de,oe),oe},[F,se]),Vn=p.useCallback((v,S)=>{const z=S.trim();if(!z)return ne("Configuration name cannot be empty"),!1;const X=_.current.find(re=>re.id===v);if(!X)return!1;if(X.name===z)return!0;if(_.current.some(re=>re.id!==v&&re.name.trim().toLowerCase()===z.toLowerCase()))return ne(`A configuration named "${z}" already exists.`),!1;const Y=_.current.map(re=>re.id===v?{...re,name:z,updatedAt:new Date().toISOString()}:re);return c(Y),_.current=Y,ue(Y,C.current),M("config_renamed",{stored_configs_count:Y.length}),!0},[ne]),Hn=p.useCallback(v=>{F(),se();const S=_.current.find(z=>z.id===v);if(S){const z=Ae(),X=new Date().toISOString(),oe={id:z,name:`${S.name} (Copy)`,config:S.config,createdAt:X,updatedAt:X},Y=[..._.current,oe];c(Y),d(z),m(!1),k(null),h(S.config),_.current=Y,C.current=z,I.current=S.config,ue(Y,z),M("config_duplicated",{stored_configs_count:Y.length})}},[F,se]),Kn=p.useCallback(v=>{F();const S=C.current,z=_.current.find(re=>re.id===v),X=_.current.filter(re=>re.id!==v);c(X),_.current=X;const oe=S===v;X.length===0||oe?(se(),d(null),C.current=null,h(""),I.current="",ue(X,null)):ue(X,S),z&&Ki(z),M("config_deleted",{stored_configs_count:X.length})},[F,se]),qn=p.useCallback(v=>{F(),se(),m(!0),k(v),h(v)},[F,se]),Jn=p.useCallback(()=>{if(!P.current)return;const S=`Shared Config ${rt(_.current,/^Shared\s+Config\s+(\d+)$/)}`,z=Ae(),X=new Date().toISOString(),oe={id:z,name:S,config:I.current||"",createdAt:X,updatedAt:X},Y=[..._.current,oe];c(Y),_.current=Y,d(z),C.current=z,m(!1),k(null),ue(Y,z)},[]),Xn=p.useCallback(()=>{go()},[]),Yn=p.useMemo(()=>{if(g)return"Shared Config";if(f){const v=l.find(S=>S.id===f);return v?v.name:""}return""},[g,f,l]),Dr=p.useMemo(()=>({setInjectionInput:q,setConfigInput:tt,generateNow:Ie,getCurrentInjections:()=>D||[],setError:ne}),[D,Ie,q,tt,ne]),{currentConflict:Zn,processInjectionsWithConflictResolution:Ar,handleConflictResolution:Qn,handleConflictCancel:eo}=_t(Dr),{isLoading:to}=Ni({processInjectionsWithConflictResolution:Ar,setError:ne}),no=p.useRef(null);p.useEffect(()=>{if(t||to)return;!new URLSearchParams(window.location.search).get("github")&&w&&(no.current=C.current,Ie(w,D,{pointsonly:!1}))},[to]);const oo=p.useRef(Ce);p.useEffect(()=>{oo.current&&!Ce&&(po(K.current),ae(!1),xe(!1),Qe(),w&&Ie(w,D,{pointsonly:!ge})),oo.current=Ce},[Ce,w,D,ge,Ie,Qe]),p.useEffect(()=>{localStorage.setItem("ergogen:injection",JSON.stringify(D)),ke&&!Ce&&Le(w,D,{pointsonly:!ge})},[w,D,ke,ge,Ce,Le]),p.useEffect(()=>{Ln&&(s===1||o)&&(console.log("Version 1 or legacy configuration detected on load. Triggering background preview generation for all configs missing a preview SVG..."),ue(_.current,C.current,2),_.current.forEach(v=>{var S;!v.previewSvg&&v.id!==no.current&&(console.log(`Triggering background preview generation for: ${v.name}`),(S=we.current)==null||S.postMessage({type:"generate",inputConfig:v.config,requestId:`background-preview-${v.id}`,options:{debug:!0,svg:!0}}))}))},[Ln,s,o]);const Nr=p.useMemo(()=>({configInput:w,getRealtimeConfigInput:R,updateRealtimeConfigInput:W,setConfigInput:tt,configs:l,activeConfigId:f,activeConfigName:Yn,isPreview:g,selectConfig:Tn,createNewConfig:Gn,renameConfig:Vn,duplicateConfig:Hn,deleteConfig:Kn,loadPreview:qn,savePreviewConfig:Jn,pruneDeletedConfigs:Xn,injectionInput:D,setInjectionInput:q,processInput:Le,generateNow:Ie,error:J,setError:ne,clearError:Dn,deprecationWarning:Z,clearWarning:An,skippedWarning:N,clearSkippedWarning:Nn,info:Q,setInfo:G,clearInfo:Un,results:y,resultsVersion:H,setResultsVersion:ee,showSettings:Ce,setShowSettings:_n,isBulkDownloadOpen:vn,setIsBulkDownloadOpen:Rr,showSideNav:jn,setShowSideNav:$n,showConfig:Cn,setShowConfig:Sn,showDownloads:En,setShowDownloads:Pn,debug:he,setDebug:mn,autoGen:ke,setAutoGen:bn,autoGen3D:ge,setAutoGen3D:wn,kicanvasPreview:Fe,setKicanvasPreview:xn,stlPreview:Ee,setStlPreview:yn,sendUsageMetrics:$e,setSendUsageMetrics:kn,isGenerating:In,setIsGenerating:ae,isJscadConverting:zn,currentConflict:Zn,handleConflictResolution:Qn,handleConflictCancel:eo}),[w,R,W,tt,l,f,Yn,g,Tn,Gn,Vn,Hn,Kn,vn,qn,Jn,Xn,D,q,Le,Ie,J,ne,Dn,Z,An,N,Nn,Q,G,Un,y,H,ee,Ce,_n,jn,$n,Cn,Sn,En,Pn,he,mn,ke,bn,ge,wn,Fe,xn,Ee,yn,$e,kn,In,ae,zn,Zn,Qn,eo]);return n.jsx(br.Provider,{value:Nr,children:i})},ve=()=>p.useContext(br),Yi=({className:e,options:t,"data-testid":i,"aria-label":o})=>{const s=ve(),a=p.useRef(null),l={configInput:void 0,setConfigInput:C=>{},updateRealtimeConfigInput:C=>{},injectionInput:void 0,generateNow:async()=>{},activeConfigId:null},{configInput:c,updateRealtimeConfigInput:f,setConfigInput:d,injectionInput:g,generateNow:m,activeConfigId:b}=s??l,k=p.useRef({updateRealtimeConfigInput:f,setConfigInput:d,injectionInput:g,generateNow:m});k.current={updateRealtimeConfigInput:f,setConfigInput:d,injectionInput:g,generateNow:m};const w=p.useRef(qo(C=>{d(C)},500)).current;p.useEffect(()=>()=>{w.cancel()},[w]),p.useEffect(()=>{if(a.current){if(a.current.hasTextFocus())return;const C=a.current.getValue();c!==void 0&&c!==C&&a.current.setValue(c)}},[c]);const h=p.useCallback(C=>{C!==void 0&&(f(C),w(C))},[w,f]),_=(C,P)=>{a.current=C,C.onDidBlurEditorText(()=>{w.flush()}),C.addAction({id:"generate-config",label:"Generate",keybindings:[P.KeyMod.CtrlCmd|P.KeyCode.Enter],run:()=>{const{updateRealtimeConfigInput:L,setConfigInput:I,injectionInput:j,generateNow:W}=k.current,R=C.getValue();w.cancel(),L(R),I(R),M("shortcut_used",{action:"generate"}),W(R,j,{pointsonly:!1,isManual:!0})}})};return s?n.jsx("div",{className:e,"data-testid":i,"aria-label":o,children:n.jsx(Jo,{height:"100%",defaultLanguage:"yaml",language:"yaml",onChange:h,onMount:_,defaultValue:c,theme:"ergogen-theme",options:t||void 0},b||"preview")}):null},Zi=({className:e,options:t,injection:i,setInjection:o,"data-testid":s,"aria-label":a})=>{const l=ve(),c=async f=>{if(!f)return null;const d={...i,content:f};o(d)};return l?n.jsx(Qi,{className:e,"data-testid":s,"aria-label":a,children:n.jsx(Jo,{height:"100%",defaultLanguage:"javascript",language:"javascript",onChange:c,value:i.content,theme:"ergogen-theme",options:t||void 0})}):null},Qi=u.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: 0.5rem;
`,r={colors:{accent:"#28a745",accentDark:"#1e8e1e",accentDarker:"#1e7e34",accentSecondary:"#239923",background:"#222222",backgroundLight:"#2a2a2a",backgroundLighter:"#333333",border:"#3f3f3f",text:"#ffffff",textDark:"#ccc",textDarker:"#aaa",textDarkest:"#666",error:"#ff6d6d",errorDark:"#a31111",warning:"hsl(45, 100%, 90%)",warningDark:"hsl(32, 79%, 40%)",info:"hsl(206, 94%, 92%)",infoDark:"hsl(206, 100%, 30%)",success:"hsl(120, 73%, 92%)",successDark:"hsl(120, 50%, 35%)",white:"#fff",buttonHover:"#3f3f3f"},fonts:{body:"'Roboto', sans-serif",code:"source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"},fontSizes:{xs:"0.4rem",sm:"0.8rem",base:"1rem",lg:"1.2rem",iconMedium:"16px",iconLarge:"24px",bodySmall:"13px",h1:"2.5rem",h2:"2rem",h3:"1.5rem"},fontWeights:{regular:400,semiBold:600,bold:700},buttonSizes:{large:{padding:"1rem 2rem",fontSize:"1rem"},medium:{padding:"0.7rem 1.4rem",fontSize:"1rem"},small:{padding:"8px 12px",fontSize:"0.8rem"},icon:{padding:"8px 12px",fontSize:"0.4rem"}}},es=xt`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,ts=u.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;

  @media (max-width: 639px) {
    padding-bottom: 0.75rem;
  }
`,ns=u.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${r.fontSizes.bodySmall};
  cursor: ${e=>e.$hasPreview?"pointer":"default"};
  border-bottom: ${e=>e.$active?`2px solid ${r.colors.accent}`:"2px solid transparent"};
  border-top: 2px solid transparent;
  opacity: ${e=>e.$disabled?.5:1};
  color: ${e=>e.$disabled?r.colors.textDarker:r.colors.white};
`,os=u.div`
  white-space: nowrap;
  display: flex;
  gap: 10px;
  align-items: center;
`,rs=u.a`
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
`,is=u.a`
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
    animation: ${es} 1s linear infinite;
  }
`,ss=({fileName:e,extension:t,content:i,preview:o,setPreview:s,previewKey:a,"data-testid":l})=>{const c=t==="stl"&&!i||t==="kicad_pcb"&&!o,f=t==="stl"&&!i,d=()=>{if(f)return;M("download_button_clicked",{download_type:t,source:"downloads_panel"});const b=document.createElement("a"),k=new Blob([i],{type:"octet/stream"}),w=URL.createObjectURL(k);b.href=w,b.download=`${e}.${t}`,document.body.appendChild(b);try{b.click()}finally{document.body.removeChild(b),URL.revokeObjectURL(w)}},g=()=>{o&&!c&&s(o)},m=l?`${l}-${t}`:void 0;return n.jsxs(ts,{"data-testid":m,children:[n.jsxs(ns,{$active:a===(o==null?void 0:o.key),$hasPreview:!!o,$disabled:c,onClick:g,"data-testid":m&&`${m}-preview`,children:[e,".",t]}),n.jsx(os,{children:f?n.jsx(is,{"aria-label":`Generating ${e}.${t}`,"data-testid":m&&`${m}-loading`,children:n.jsx("span",{className:"material-symbols-outlined",children:"progress_activity"})}):n.jsx(rs,{onClick:d,"aria-label":`Download ${e}.${t}`,"data-testid":m&&`${m}-download`,children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})})]})},as=u.h3`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  margin: 0 0 1rem;

  @media (max-width: 639px) {
    display: none;
  }
`,ls=u.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;

  @media (max-width: 639px) {
    padding: 0.5rem;
  }
`,cs=u.div`
  font-size: ${r.fontSizes.sm};
  color: ${r.colors.textDarkest};
  font-style: italic;
  padding: 0.5rem 0;
`,ds=({setPreview:e,previewKey:t,"data-testid":i})=>{var f,d;const o=[],s=ve();if(!s)return null;const{configInput:a,results:l}=s;if(l!=null&&l.demo&&o.push({fileName:"raw",extension:"txt",content:a??"",previewKey:"raw",preview:{key:"raw",extension:"txt",content:a??""}},{fileName:"canonical",extension:"yaml",content:fe.dump(l.canonical),previewKey:"canonical",preview:{key:"canonical",extension:"yaml",content:fe.dump(l.canonical)}},{fileName:"demo",extension:"dxf",content:((f=l.demo)==null?void 0:f.dxf)??"",previewKey:"demo.svg",preview:{key:"demo.svg",extension:"svg",content:((d=l.demo)==null?void 0:d.svg)??""}},{fileName:"points",extension:"yaml",content:fe.dump(l.points),previewKey:"points",preview:{key:"points",extension:"yaml",content:fe.dump(l.points)}},{fileName:"units",extension:"yaml",content:fe.dump(l.units),previewKey:"units",preview:{key:"units",extension:"yaml",content:fe.dump(l.units)}}),l!=null&&l.outlines)for(const[g,m]of Object.entries(l.outlines))o.push({fileName:g,extension:"dxf",content:m.dxf??"",previewKey:`outlines.${g}.svg`,preview:{key:`outlines.${g}.svg`,extension:"svg",content:m.svg??""}});if(l!=null&&l.cases){for(const[g,m]of Object.entries(l.cases))if(o.push({fileName:g,extension:"jscad",content:m.jscad??"",previewKey:`cases.${g}`,preview:{key:`cases.${g}`,extension:"jscad",content:m.jscad??""}}),s.stlPreview&&m.jscad){const b=!!m.stl;o.push({fileName:g,extension:"stl",content:m.stl??"",previewKey:b?`cases.${g}.stl`:"",preview:b?{key:`cases.${g}.stl`,extension:"stl",content:m.stl??""}:void 0})}}if(l!=null&&l.pcbs)for(const[g,m]of Object.entries(l.pcbs)){const k=String(m).match(/version "?([0-9]+)"?/),w=k&&k.length>1?Number(k[1]):-1;o.push({fileName:g,extension:"kicad_pcb",content:m,previewKey:s.kicanvasPreview&&w>20240101?`pcbs.${g}`:"",preview:s.kicanvasPreview&&w>20240101?{key:`pcbs.${g}`,extension:"kicad_pcb",content:m}:void 0})}const c=o.filter(g=>!(!s.debug&&(g.fileName.startsWith("_")||{units:"yaml",points:"yaml",canonical:"yaml",raw:"txt"}[g.fileName]===g.extension||s.stlPreview&&g.extension==="jscad")));return n.jsxs(ls,{"data-testid":i,children:[n.jsx(as,{children:"Outputs"}),c.length>0?c.map((g,m)=>n.jsx(ss,{...g,setPreview:e,previewKey:t,"data-testid":i&&`${i}-${g.fileName}`},m)):n.jsx(cs,{children:"No outputs"})]})},us=u.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
`,ps=u.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${r.fontSizes.bodySmall};
  cursor: pointer;
  border-bottom: ${e=>e.$active?`2px solid ${r.colors.accent}`:"2px solid transparent"};
  border-top: 2px solid transparent;
`,fs=u.div`
  white-space: nowrap;
  display: flex;
  gap: 6px;
  align-items: center;
`,wr=Xo`
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
`,bo=u.a`
  ${wr}
`,hs=u.a`
  ${wr}

  @media (min-width: 640px) {
    display: none;
  }
`,Dt=({injection:e,setInjectionToEdit:t,deleteInjection:i,previewKey:o,"data-testid":s})=>{const[a,l]=p.useState("");return p.useEffect(()=>{const c=window.URL.createObjectURL(new Blob([e.content],{type:"octet/stream"}));return l(c),()=>{window.URL.revokeObjectURL(c)}},[e.content]),n.jsxs(us,{"data-testid":s,children:[n.jsx(ps,{"data-testid":s&&`${s}-name`,$active:o===e.name,onClick:()=>t(e),children:e.name}),n.jsxs(fs,{children:[n.jsx(hs,{href:"#",onClick:c=>{c.preventDefault(),t(e)},"aria-label":`edit injection ${e.name}`,"data-testid":s&&`${s}-edit`,children:n.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),n.jsx(bo,{href:"#",onClick:c=>{c.preventDefault(),i(e)},"aria-label":`delete injection ${e.name}`,"data-testid":s&&`${s}-delete`,children:n.jsx("span",{className:"material-symbols-outlined",children:"delete"})}),n.jsx(bo,{target:"_blank",rel:"noopener noreferrer",download:`${e.name.split("/").reverse()[0]}.js`,href:a||void 0,"aria-label":`download injection ${e.name}`,"data-testid":s&&`${s}-download`,children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})]})]})},qe=u.button`
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
`,vt=u.button`
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
`,gs=u(vt)`
  padding: ${r.buttonSizes.medium.padding};
  font-size: ${r.buttonSizes.medium.fontSize};
`,ms=u(vt)`
  padding: ${r.buttonSizes.small.padding};
  font-size: ${r.buttonSizes.small.fontSize};
`,bs=u(vt)`
  padding: ${r.buttonSizes.icon.padding};
  font-size: ${r.buttonSizes.icon.fontSize};
`,pe=({size:e,...t})=>{switch(e){case"icon":return n.jsx(bs,{...t});case"sm":case"small":return n.jsx(ms,{...t});case"md":case"medium":return n.jsx(gs,{...t});case"lg":case"large":default:return n.jsx(vt,{...t})}},ws=e=>e.charAt(0).toUpperCase()+e.slice(1),wt=({injectionName:e,injectionType:t,onResolve:i,onCancel:o,"data-testid":s})=>{const[a,l]=p.useState(!1),c=ws(t);return n.jsx(xs,{"data-testid":s,children:n.jsxs(ys,{"data-testid":s&&`${s}-box`,children:[n.jsxs(ks,{children:[c," Conflict"]}),n.jsxs(_s,{children:["A ",t," with the name ",n.jsx("strong",{children:e})," ","already exists.",n.jsx("br",{}),"How would you like to resolve this conflict?"]}),n.jsxs(vs,{children:[n.jsx(js,{type:"checkbox",id:"apply-to-all",checked:a,onChange:f=>l(f.target.checked),"data-testid":s&&`${s}-apply-to-all`,"aria-label":"Apply this choice to all conflicts"}),n.jsx($s,{$checked:a,onClick:()=>l(!a),role:"checkbox","aria-checked":a}),n.jsx("label",{htmlFor:"apply-to-all",children:"Apply to all conflicts"})]}),n.jsxs(Cs,{children:[n.jsx(pe,{onClick:()=>i("skip",a),size:"medium","data-testid":s&&`${s}-skip`,"aria-label":`Skip this ${t}`,children:"Skip"}),n.jsx(pe,{onClick:()=>i("overwrite",a),size:"medium","data-testid":s&&`${s}-overwrite`,"aria-label":`Overwrite existing ${t}`,children:"Overwrite"}),n.jsx(pe,{onClick:()=>i("keep-both",a),size:"medium","data-testid":s&&`${s}-keep-both`,"aria-label":`Keep both ${t}s`,children:"Keep Both"})]}),n.jsx(Ss,{onClick:o,size:"small","data-testid":s&&`${s}-cancel`,"aria-label":"Cancel loading",children:"Cancel"})]})})},xs=u.div`
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
`,ys=u.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`,ks=u.h2`
  margin: 0 0 1rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
`,_s=u.p`
  margin: 0 0 1.5rem 0;
  font-size: ${r.fontSizes.base};
  color: ${r.colors.textDark};
  line-height: 1.5;

  strong {
    color: ${r.colors.accent};
  }
`,vs=u.div`
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
`,js=u.input`
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
`,$s=u.div`
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
`,Cs=u.div`
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  margin-bottom: 1rem;
`,Ss=u(pe)`
  width: 100%;
  background-color: ${r.colors.backgroundLighter};
  color: ${r.colors.textDark};

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`,ft=u.h3`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  margin: 1.5rem 0.5rem 1rem 0.5rem;
`,wo=e=>{const o=new DOMParser().parseFromString(e,"image/svg+xml").querySelectorAll("path"),s=[];return o.forEach(a=>{const l=a.getAttribute("d");if(l&&l.trim()){const c=l.replace(/\\/g,"\\\\").replace(/"/g,'\\"');s.push(`        "${c}"`)}}),`const u = require('../utils');

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
`,Es=u.div`
  display: flex;
  margin-left: 0.5rem;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.5rem;
`,Ps=u.div`
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
`,Is=({setInjectionToEdit:e,deleteInjection:t,injectionToEdit:i,onInjectionSelect:o,"data-testid":s})=>{const a=[],l=[],c=[],f=p.useRef(null),d=p.useRef(null),g=p.useCallback(x=>{d.current=x,x&&(x.setAttribute("webkitdirectory",""),x.setAttribute("directory",""))},[]),m=ve(),[b,k]=p.useState("footprint"),[w,h]=p.useState("footprints"),{currentConflict:_,processInjectionsWithConflictResolution:C,handleConflictResolution:P,handleConflictCancel:L}=_t({setInjectionInput:x=>m==null?void 0:m.setInjectionInput(x),setConfigInput:x=>m==null?void 0:m.setConfigInput(x),generateNow:async(x,E,$)=>{await(m==null?void 0:m.generateNow(x,E,$))},getCurrentInjections:()=>(m==null?void 0:m.injectionInput)||[],setError:x=>m==null?void 0:m.setError(x)});if(!m)return null;const{injectionInput:I}=m;if(I&&Array.isArray(I)&&I.length>0)for(let x=0;x<I.length;x++){const E=I[x];if(E.length===3){let $=c;E[0]==="footprint"?$=a:E[0]==="outline"?$=l:E[0]==="template"&&($=c),$.push({key:x,type:E[0],name:E[1],content:E[2]})}}const j=()=>{var $;const x=(($=m==null?void 0:m.injectionInput)==null?void 0:$.length)||0,E={key:x,type:"footprint",name:`custom_footprint_${x+1}`,content:`module.exports = {
  params: {
    designator: '',
  },
  body: p => \`\`
}`};M("injection_created",{injection_type:"footprint"}),e(E),o&&o()},W=()=>{var $;const x=(($=m==null?void 0:m.injectionInput)==null?void 0:$.length)||0,E={key:x,type:"outline",name:`custom_outline_${x+1}`,content:`const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
        ""  // Add your SVG path(s) here
    ];
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
};`};M("injection_created",{injection_type:"outline"}),e(E),o&&o()},R=()=>{var $;const x=(($=m==null?void 0:m.injectionInput)==null?void 0:$.length)||0,E={key:x,type:"template",name:`custom_template_${x+1}`,content:`const m = require('makerjs')
const version = require('../../package.json').version

module.exports = {
    convert_outline: (model, layer) => {
        return \`\`;  // Return your converted outlines
    },
    body: params => {
        return \`\`;  // Add your template text here
    }
}`};M("injection_created",{injection_type:"template"}),e(E),o&&o()},A=async x=>{const E=x.target.files;if(!E||E.length===0)return;const $=[];for(let U=0;U<E.length;U++){const F=E[U];if(F.name.endsWith(".js")){const D=await F.text(),q=F.name.replace(/\.js$/,"");$.push([b,q,D])}else if(b==="outline"&&F.name.endsWith(".svg")){const D=await F.text(),q=wo(D),J=F.name.replace(/\.svg$/,"");$.push([b,J,q])}}$.length>0&&(M("injection_uploaded",{injection_type:b,source:"file",file_count:$.length}),await C($,m.configInput||"")),x.target.value=""},O=async x=>{const E=x.target.files;if(!E||E.length===0)return;const $=[];for(let U=0;U<E.length;U++){const F=E[U];if(F.name.endsWith(".js")){const D=await F.text(),q=F.webkitRelativePath.split("/");q.shift();const J=q.join("/").replace(/\.js$/,"");$.push([b,J,D])}else if(b==="outline"&&F.name.endsWith(".svg")){const D=await F.text(),q=F.webkitRelativePath.split("/");q.shift();const J=q.join("/").replace(/\.svg$/,""),ne=wo(D);$.push([b,J,ne])}}$.length>0&&(M("injection_uploaded",{injection_type:b,source:"folder",file_count:$.length}),await C($,m.configInput||"")),x.target.value=""};return n.jsxs(Es,{"data-testid":s,children:[_&&n.jsx(wt,{injectionName:_.name,injectionType:_.type,onResolve:P,onCancel:L,"data-testid":"conflict-resolution-dialog"}),n.jsx(ft,{children:"Custom Libraries"}),n.jsxs(Ps,{children:[n.jsx(Nt,{$active:w==="footprints",onClick:()=>{h("footprints"),k("footprint")},"data-testid":"tab-footprints",children:"Footprints"}),ce("outlines")&&n.jsx(Nt,{$active:w==="outlines",onClick:()=>{h("outlines"),k("outline")},"data-testid":"tab-outlines",children:"Outlines"}),ce("templates")&&n.jsx(Nt,{$active:w==="templates",onClick:()=>{h("templates"),k("template")},"data-testid":"tab-templates",children:"Templates"})]}),w==="footprints"&&n.jsxs(n.Fragment,{children:[a.map(x=>n.jsx(Dt,{injection:x,setInjectionToEdit:E=>{M("injection_editor_opened",{injection_type:E.type}),e(E),o&&o()},deleteInjection:t,previewKey:i.name,"data-testid":s&&`${s}-${x.name}`},x.key)),n.jsxs(At,{children:[n.jsx(qe,{onClick:j,"data-testid":"add-footprint","aria-label":"Add new custom footprint",title:"Add footprint",children:n.jsx("span",{className:"material-symbols-outlined",children:"add"})}),n.jsx(Re,{onClick:()=>{k("footprint"),setTimeout(()=>{var x;return(x=f.current)==null?void 0:x.click()},0)},"data-testid":"load-footprint-files","aria-label":"Load custom footprint files",title:"Load footprint files",children:n.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),n.jsx(Re,{onClick:()=>{k("footprint"),setTimeout(()=>{var x;return(x=d.current)==null?void 0:x.click()},0)},"data-testid":"load-footprint-folder","aria-label":"Load custom footprint folder",title:"Load footprint folder",children:n.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),w==="outlines"&&ce("outlines")&&n.jsxs(n.Fragment,{children:[l.map(x=>n.jsx(Dt,{injection:x,setInjectionToEdit:E=>{M("injection_editor_opened",{injection_type:E.type}),e(E),o&&o()},deleteInjection:t,previewKey:i.name,"data-testid":s&&`${s}-${x.name}`},x.key)),n.jsxs(At,{children:[n.jsx(qe,{onClick:W,"data-testid":"add-outline","aria-label":"Add new custom outline",title:"Add outline",children:n.jsx("span",{className:"material-symbols-outlined",children:"add"})}),n.jsx(Re,{onClick:()=>{k("outline"),setTimeout(()=>{var x;return(x=f.current)==null?void 0:x.click()},0)},"data-testid":"load-outline-files","aria-label":"Load custom outline files",title:"Load outline files",children:n.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),n.jsx(Re,{onClick:()=>{k("outline"),setTimeout(()=>{var x;return(x=d.current)==null?void 0:x.click()},0)},"data-testid":"load-outline-folder","aria-label":"Load custom outline folder",title:"Load outline folder",children:n.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),w==="templates"&&ce("templates")&&n.jsxs(n.Fragment,{children:[c.map(x=>n.jsx(Dt,{injection:x,setInjectionToEdit:E=>{M("injection_editor_opened",{injection_type:E.type}),e(E),o&&o()},deleteInjection:t,previewKey:i.name,"data-testid":s&&`${s}-${x.name}`},x.key)),n.jsxs(At,{children:[n.jsx(qe,{onClick:R,"data-testid":"add-template","aria-label":"Add new custom template",title:"Add template",children:n.jsx("span",{className:"material-symbols-outlined",children:"add"})}),n.jsx(Re,{onClick:()=>{k("template"),setTimeout(()=>{var x;return(x=f.current)==null?void 0:x.click()},0)},"data-testid":"load-template-files","aria-label":"Load custom template files",title:"Load template files",children:n.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),n.jsx(Re,{onClick:()=>{k("template"),setTimeout(()=>{var x;return(x=d.current)==null?void 0:x.click()},0)},"data-testid":"load-template-folder","aria-label":"Load custom template folder",title:"Load template folder",children:n.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),n.jsx("input",{type:"file",ref:f,onChange:A,accept:b==="outline"?".js,.svg":".js",multiple:!0,style:{display:"none"}}),n.jsx("input",{type:"file",ref:g,onChange:O,accept:b==="outline"?".js,.svg":".js",style:{display:"none"}})]})},Ls=u.img`
  filter: invert();
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
`,zs=u(Fr.PanZoom)`
  overflow: hidden;
  height: 100%;

  &:focus-visible {
    outline: none;
  }
`,Rs=({svg:e,width:t,height:i,"aria-label":o,"data-testid":s})=>n.jsx(zs,{enableBoundingBox:!0,minZoom:.8,maxZoom:5,"aria-label":o,"data-testid":s,children:n.jsx(Ls,{width:t||"100%",height:i||"100%",src:`data:image/svg+xml;utf8,${encodeURIComponent(e)}`,alt:"Ergogen SVG Output preview",draggable:"false"})}),Ut=({content:e,language:t,className:i,height:o,options:s,"aria-label":a,"data-testid":l})=>n.jsx("div",{className:i,"aria-label":a,"data-testid":l,children:n.jsx(Mr,{height:o||"80vh",language:t,value:e,theme:"ergogen-theme",options:s||{readOnly:!0}})}),Ds=p.lazy(()=>nr(()=>import("./PcbPreview-BI1R2Mfv.js"),__vite__mapDeps([0,1]))),As=p.lazy(()=>nr(()=>import("./StlPreview-C8fX9xJp.js"),__vite__mapDeps([2,1,3,4,5]))),xr=u.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: ${r.colors.background};
`,yr=u.img`
  width: 96px;
  height: 96px;
  opacity: 0.12;
  filter: grayscale(100%);
  -webkit-user-drag: none;
  user-drag: none;
`,Ns=u.span`
  color: ${r.colors.textDarkest};
  font-size: ${r.fontSizes.sm};
  margin-top: 1rem;
  font-family: ${r.fonts.body};
  user-select: none;
`,xo=()=>n.jsxs(xr,{children:[n.jsx(yr,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"}),n.jsx(Ns,{children:"Loading preview..."})]}),Us=({previewExtension:e,previewContent:t,previewKey:i,width:o="100%",height:s="100%",className:a,"data-testid":l,"aria-label":c})=>{if(!t||typeof t=="string"&&t===""||t instanceof ArrayBuffer&&t.byteLength===0||ArrayBuffer.isView(t)&&t.byteLength===0)return n.jsx(xr,{className:a,"data-testid":l,"aria-label":c,children:n.jsx(yr,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"})});const d=g=>{switch(g){case"svg":return n.jsx(Rs,{svg:t,width:o,height:s,"aria-label":c||`SVG preview for ${i}`,"data-testid":l&&`${l}-svg`});case"yaml":return n.jsx(Ut,{language:"yaml",content:t,"aria-label":c||`YAML preview for ${i}`,"data-testid":l&&`${l}-yaml`});case"txt":return n.jsx(Ut,{language:"text",content:t,"aria-label":c||`Text preview for ${i}`,"data-testid":l&&`${l}-txt`});case"jscad":return n.jsx(Ut,{language:"javascript",content:t,"aria-label":c||`JSCAD code preview for ${i}`,"data-testid":l&&`${l}-jscad-text`});case"kicad_pcb":return n.jsx(p.Suspense,{fallback:n.jsx(xo,{}),children:n.jsx(Ds,{pcb:t,previewKey:i,"aria-label":c||`PCB preview for ${i}`,"data-testid":l&&`${l}-pcb`},i)});case"stl":return n.jsx(p.Suspense,{fallback:n.jsx(xo,{}),children:n.jsx(As,{stl:t,"aria-label":c||`STL preview for ${i}`,"data-testid":l&&`${l}-stl`})});default:return"No preview available"}};return n.jsx("div",{className:a,"data-testid":l,"aria-label":c,children:d(e)})},Wt=({children:e,initialWidth:t=300,minWidth:i=10,maxWidth:o="100%",side:s="left",style:a,"data-testid":l})=>{const[c,f]=p.useState(t),d=p.useRef(!1),g=p.useRef(0),m=p.useRef(t),b=p.useRef(null),k=h=>{if(typeof h=="string"&&h.includes("%")){const _=parseFloat(h)/100;return window.innerWidth*_}else return typeof h=="string"&&h.includes("px")?parseFloat(h):typeof h=="number"?h:1/0};p.useEffect(()=>{const h=L=>{if(!d.current)return;const I=s==="left"?L.clientX-g.current:g.current-L.clientX,j=m.current+I,W=k(o),R=Math.max(i,Math.min(j,W));f(R)},_=()=>{d.current&&(d.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},C=L=>{if(!d.current)return;L.preventDefault();const I=L.touches[0],j=s==="left"?I.clientX-g.current:g.current-I.clientX,W=m.current+j,R=k(o),A=Math.max(i,Math.min(W,R));f(A)},P=()=>{d.current&&(d.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",h),window.addEventListener("mouseup",_),window.addEventListener("touchmove",C,{passive:!1}),window.addEventListener("touchend",P),()=>{window.removeEventListener("mousemove",h),window.removeEventListener("mouseup",_),window.removeEventListener("touchmove",C),window.removeEventListener("touchend",P)}},[i,o,s]);const w=h=>{h.preventDefault(),h.stopPropagation(),d.current=!0,m.current=c,"touches"in h?g.current=h.touches[0].clientX:g.current=h.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};return n.jsxs(Ws,{ref:b,$side:s,style:{width:`${c}px`,...a},"data-testid":l,children:[e,n.jsx(Os,{$side:s,onMouseDown:w,onTouchStart:w,"data-testid":l&&`${l}-resize-handle`})]})},Ws=u.div`
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
`,Os=u.div`
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
`,Qt=(e,t)=>{if(t===null)return null;if(e==="")return t;if(typeof t!="object")return;const i=e.split("."),o=i[0],s=i.slice(1).join(".");return Object.prototype.hasOwnProperty.call(t,o)?Qt(s,t[o]):void 0},Fs=(e,t,i,o="")=>{let s=t,a=i,l=null;e&&(l=Qt(s,e),l===void 0&&s!=="demo.svg"&&(s="demo.svg",a="svg",l=Qt(s,e)));let c="";switch(a){case"svg":case"kicad_pcb":c=typeof l=="string"?l:"";break;case"stl":c=typeof l=="string"||l instanceof ArrayBuffer||ArrayBuffer.isView(l)?l:"";break;case"jscad":c=typeof(l==null?void 0:l.jscad)=="string"?l.jscad:"";break;case"yaml":c=fe.dump(l);break;case"txt":c=o;break;default:c=""}return{key:s,extension:a,content:c}};function kr(){if(typeof navigator<"u"){if("userAgentData"in navigator&&navigator.userAgentData){const e=navigator.userAgentData;if(e.platform&&/mac/i.test(e.platform))return!0}if(/Mac|iPhone|iPad|iPod/i.test(navigator.userAgent))return!0}return!1}const Ms=u.input.attrs(e=>({type:"text",$size:e.$size||"0.5em"}))`
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
`,Bs=u.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`,Ts=u.label`
  display: flex;
  flex-direction: column;
  flex: 1;
  cursor: ${e=>e.$disabled?"not-allowed":"pointer"};
  user-select: none;
  text-align: left;
`,Gs=u.span`
  color: ${r.colors.text};
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
`,Vs=u.span`
  color: ${r.colors.textDarker};
  font-size: ${r.fontSizes.sm};
  margin-top: 0.25rem;
  line-height: 1.4;
`,Hs=u.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`,Ks=u.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: ${e=>e.$disabled?"not-allowed":"pointer"};
  opacity: ${e=>e.$disabled?.5:1};
`,qs=u.input`
  opacity: 0;
  width: 0;
  height: 0;
`,Js=u.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${e=>e.$checked?r.colors.accent:r.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`,Xs=u.span`
  position: absolute;
  top: 2px;
  left: ${e=>e.$checked?"18px":"2px"};
  width: 16px;
  height: 16px;
  background-color: ${r.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,De=({optionId:e,label:t,description:i,setSelected:o,checked:s,disabled:a=!1,"aria-label":l})=>n.jsxs(Bs,{children:[n.jsxs(Ts,{htmlFor:e,$disabled:a,children:[n.jsx(Gs,{children:t}),i&&n.jsx(Vs,{children:i})]}),n.jsx(Hs,{children:n.jsxs(Ks,{$disabled:a,htmlFor:e,children:[n.jsx(qs,{type:"checkbox",id:e,checked:s,disabled:a,onChange:c=>o(c.target.checked),"data-testid":`option-${e}`,"aria-label":l}),n.jsx(Js,{$checked:s}),n.jsx(Xs,{$checked:s})]})})]}),Ne=u.button`
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
`,it=u.h4`
  font-size: ${r.fontSizes.sm};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.textDarker};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 1.5rem 0.5rem 0.5rem 0.5rem;

  &:first-of-type {
    margin-top: 0.5rem;
  }
`,st=u.div`
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
`,Ys=u.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  gap: 1.5rem;
  width: 100%;
  box-sizing: border-box;
`,Zs=u.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  user-select: none;
  text-align: left;
`,Qs=u.span`
  color: ${r.colors.text};
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
`,en=u.span`
  color: ${r.colors.textDarker};
  font-size: ${r.fontSizes.sm};
  margin-top: 0.25rem;
  line-height: 1.4;
`,ea=u(en)`
  color: ${r.colors.warningDark};
`,ta=u.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`,na=({isAvailable:e,isInstalled:t,isInstalling:i,onInstall:o})=>{let s,a;return t?(s=n.jsx(en,{children:"The application is installed and available offline."}),a=n.jsx(pe,{size:"sm",disabled:!0,"data-testid":"pwa-installed-button",children:"Installed"})):e?(s=n.jsx(en,{children:"Install the app locally to access it offline without network connectivity."}),i?a=n.jsx(pe,{size:"sm",disabled:!0,"data-testid":"pwa-installing-button",children:"Installing..."}):a=n.jsx(pe,{size:"sm",onClick:o,"data-testid":"pwa-install-button",children:"Install App"})):(s=n.jsx(ea,{children:"PWA installation is not supported by your browser or environment."}),a=n.jsx(pe,{size:"sm",disabled:!0,"data-testid":"pwa-unavailable-button",children:"Unavailable"})),n.jsxs(Ys,{children:[n.jsxs(Zs,{children:[n.jsx(Qs,{children:"Offline App"}),s]}),n.jsx(ta,{children:a})]})},oa=(e,t,i,o)=>{const s={config:e,...t&&t.length>0?{injections:t}:{},guiVersion:yt.version,ergogenVersion:pn("github:ceoloide/ergogen#v4.3.0")},a=JSON.stringify(s);return Yo.compressToEncodedURIComponent(a)},ra=()=>new URLSearchParams(window.location.search).get("debug")!==null,ia=e=>{var i;const t=ra();try{const o=Yo.decompressFromEncodedURIComponent(e);if(!o)return console.error("[Share] DECODE_ERROR: Failed to decompress encoded string"),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The encoded data could not be decompressed."};let s;try{s=JSON.parse(o)}catch(l){return console.error("[Share] DECODE_ERROR: Failed to parse decompressed JSON",{parseError:l,decompressedLength:o.length,decompressedPreview:o.substring(0,100)}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The decompressed data is not valid JSON."}}if(!s||typeof s!="object"||!("config"in s)||typeof s.config!="string")return console.error("[Share] VALIDATION_ERROR: Invalid object structure",{parsed:s,hasConfig:s&&typeof s=="object"&&"config"in s,configType:s&&typeof s=="object"&&"config"in s?typeof s.config:"N/A"}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link does not contain a valid configuration. The decoded data is missing required fields or has an invalid structure."};const a=s;return(!a.guiVersion||typeof a.guiVersion!="string")&&(a.guiVersion="0.9.0"),(!a.ergogenVersion||typeof a.ergogenVersion!="string")&&(a.ergogenVersion="github:ergogen/ergogen#v4.2.1"),"injections"in a&&a.injections!==void 0&&(!Array.isArray(a.injections)||!a.injections.every(l=>Array.isArray(l)&&l.length===3&&typeof l[0]=="string"&&typeof l[1]=="string"&&typeof l[2]=="string"))?(console.error("[Share] VALIDATION_ERROR: Invalid injections structure",{injections:a.injections,isArray:Array.isArray(a.injections)}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link contains invalid injections data. Injections must be an array of [type, name, content] tuples."}):(t&&console.log("[Share] DEBUG: Decoded configuration object",{configLength:a.config.length,hasInjections:a.injections!==void 0,injectionsCount:((i=a.injections)==null?void 0:i.length)??0,fullObject:a}),{success:!0,config:a})}catch(o){return console.error("[Share] DECODE_ERROR: Unexpected error during decoding",{error:o,errorMessage:o instanceof Error?o.message:String(o),errorStack:o instanceof Error?o.stack:void 0}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. An unexpected error occurred while decoding."}}},sa=e=>{const{config:t,injections:i,canonical:o}=e;let s=i;if(o&&i&&i.length>0){const f=vr(o);s=aa(i,f)}const a=s&&s.length>0?s:void 0,l=oa(t,a);return`${window.location.origin+window.location.pathname}#${l}`},_r=()=>{const e=window.location.hash;if(!e||e.length<=1)return null;const t=e.substring(1);return ia(t)},vr=e=>{const t=new Set,i=new Set,o=new Set;if(!e||typeof e!="object")return{footprints:t,templates:i,outlines:o};const s=e;if(s.pcbs&&typeof s.pcbs=="object"){for(const a of Object.values(s.pcbs))if(!(!a||typeof a!="object")&&(typeof a.template=="string"&&i.add(a.template),a.footprints&&typeof a.footprints=="object"))for(const l of Object.values(a.footprints))l&&typeof l.what=="string"&&t.add(l.what)}if(s.outlines&&typeof s.outlines=="object")for(const a of Object.values(s.outlines)){if(!a||typeof a!="object")continue;const l=Array.isArray(a)?a:Object.values(a);for(const c of l){const f=c;f&&typeof f.what=="string"&&o.add(f.what)}}return{footprints:t,templates:i,outlines:o}},aa=(e,t)=>!e||e.length===0?[]:e.filter(i=>{const[o,s]=i;return o==="footprint"?t.footprints.has(s):o==="template"?t.templates.has(s):o==="outline"?t.outlines.has(s):!0}),yo=async(e,t,i,o)=>{try{await navigator.clipboard.writeText(e),t(!0),o==null||o(),i.current&&clearTimeout(i.current),i.current=setTimeout(()=>{t(!1)},2500)}catch(s){console.error("Failed to copy shareable URI to clipboard:",s);try{const a=document.createElement("textarea");a.value=e,a.style.position="fixed",a.style.opacity="0",document.body.appendChild(a),a.select();const l=document.execCommand("copy");if(document.body.removeChild(a),!l){console.error("Fallback copy method was rejected by the browser.");return}t(!0),o==null||o(),i.current&&clearTimeout(i.current),i.current=setTimeout(()=>{t(!1)},2500)}catch(a){console.error("Fallback copy method also failed:",a)}}},jr=({config:e,injections:t,onClose:i,"data-testid":o})=>{const s=Zo.useMemo(()=>t||[],[t]),[a,l]=p.useState(1),[c,f]=p.useState(!0),[d,g]=p.useState(!1),[m,b]=p.useState(null),[k,w]=p.useState(""),[h,_]=p.useState([]),[C,P]=p.useState(!1),[L,I]=p.useState(!1),j=p.useRef(null),W=p.useRef(null);p.useEffect(()=>{if(!c||C||s.length===0||a!==1)return;let $=!0;g(!0),b(null);const U=cn();if(!U){b("Could not initialize background worker."),g(!1);return}return U.onmessage=F=>{var q;if(!$)return;const D=F.data;if(D.type==="success"){const J=(q=D.results)==null?void 0:q.canonical,{footprints:ne,templates:Z,outlines:B}=vr(J),N=s.map(([T,Q,G])=>{let y;return T==="footprint"?y=ne.has(Q):T==="template"?y=Z.has(Q):T==="outline"?y=B.has(Q):y=!0,{type:T,name:Q,content:G,checked:y,isEligible:y}}).filter(T=>T.isEligible).map(({type:T,name:Q,content:G,checked:y})=>({type:T,name:Q,content:G,checked:y}));_(N),P(!0)}else D.type==="error"&&b(D.error||"Failed to analyze configuration.");g(!1),U.terminate()},U.onerror=()=>{$&&(b("Worker encountered an error during analysis."),g(!1),U.terminate())},U.postMessage({type:"generate",inputConfig:e,injectionInput:s,requestId:`share-analysis-${Date.now()}`,options:{debug:!0}}),()=>{$=!1,U.terminate()}},[c,C,s,e,a]);const R=p.useRef(0);R.current=c?h.filter($=>$.checked).length:0;const A=p.useCallback($=>{M("share_link_copied",{has_injections:R.current>0,injections_count:R.current,source:$})},[]);p.useEffect(()=>{a===2&&k&&yo(k,I,W,()=>{A("auto")})},[k,a,A]),p.useEffect(()=>{const $=U=>{U.key==="Escape"&&i()};return window.addEventListener("keydown",$),()=>{window.removeEventListener("keydown",$)}},[i]),p.useEffect(()=>{a===2&&j.current&&(j.current.focus(),j.current.select())},[a]),p.useEffect(()=>{const $=W;return()=>{$.current&&clearTimeout($.current)}},[]);const O=$=>{_(U=>U.map((F,D)=>D===$?{...F,checked:!F.checked}:F))},x=()=>{const $=c?h.filter(D=>D.checked):[],U=$.length>0?$.map(D=>[D.type,D.name,D.content]):void 0,F=sa({config:e,injections:U});w(F),l(2)},E=()=>{yo(k,I,W,()=>{A("button")})};return n.jsx(la,{"data-testid":o,onClick:$=>{$.target===$.currentTarget&&i()},children:n.jsxs(ca,{"data-testid":o&&`${o}-box`,onClick:$=>$.stopPropagation(),children:[n.jsx(da,{onClick:i,"data-testid":o&&`${o}-close`,"aria-label":"Close dialog",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})}),a===1?n.jsxs(n.Fragment,{children:[n.jsx(ko,{children:"Share Configuration"}),n.jsx(_o,{children:"Configure what content should be included when sharing your keyboard design."}),n.jsx(ua,{children:n.jsxs(pa,{htmlFor:"include-libraries-toggle",children:[n.jsx(fa,{id:"include-libraries-toggle",type:"checkbox",checked:c,onChange:$=>{const U=$.target.checked;f(U),U||(g(!1),b(null))},"aria-label":"Include custom libraries"}),n.jsx(ha,{$checked:c}),n.jsx("span",{children:"Include custom libraries"})]})}),c&&n.jsxs(n.Fragment,{children:[d&&n.jsxs(ga,{children:[n.jsx(ma,{}),n.jsx("span",{children:"Analyzing configuration..."})]}),m&&n.jsx(ba,{children:m}),!d&&!m&&s.length===0&&n.jsx(vo,{children:"No custom libraries loaded."}),!d&&!m&&s.length>0&&h.length===0&&n.jsx(vo,{children:"No custom footprints or libraries are used in this configuration."}),!d&&!m&&h.length>0&&n.jsx(wa,{children:h.map(($,U)=>n.jsxs(xa,{children:[n.jsx(ya,{id:`injection-${$.name}`,type:"checkbox",checked:$.checked,onChange:()=>O(U),"aria-label":$.name}),n.jsx(_a,{$type:$.type,children:$.type}),n.jsx(ka,{htmlFor:`injection-${$.name}`,children:$.name})]},`${$.type}-${$.name}`))})]}),n.jsx(jo,{children:n.jsx(va,{onClick:x,disabled:d,children:"Share"})})]}):n.jsxs(n.Fragment,{children:[n.jsx(ko,{children:"Shareable Configuration Link"}),n.jsx(_o,{children:"Share this link with others to let them view and use your keyboard configuration, including all of your custom footprints."}),n.jsxs(ja,{children:[n.jsx($a,{ref:j,type:"text",value:k,readOnly:!0,"data-testid":o&&`${o}-input`,"aria-label":"Share link"}),n.jsx(jo,{children:n.jsxs(Ca,{onClick:E,"data-testid":o&&`${o}-copy`,"aria-label":L?"Link copied":"Copy link",children:[n.jsx("span",{className:"material-symbols-outlined",children:L?"check":"content_copy"}),L?"Link copied":"Copy link"]})})]})]})]})})},la=u.div`
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
`,ca=u.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: relative;
`,da=u.button`
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
`,ko=u.h2`
  margin: 0 0 1rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
  padding-right: 3rem;
`,_o=u.p`
  margin: 0 0 1.5rem 0;
  font-size: ${r.fontSizes.base};
  color: ${r.colors.textDark};
  line-height: 1.5;
`,ua=u.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`,pa=u.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  font-family: ${r.fonts.body};
  font-size: ${r.fontSizes.base};
  color: ${r.colors.text};
`,fa=u.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`,ha=u.span`
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
`,ga=u.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.5rem 0;
  color: ${r.colors.textDark};
`,ma=u.div`
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
`,ba=u.p`
  color: ${r.colors.error};
  font-size: ${r.fontSizes.sm};
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: ${r.colors.errorDark}22;
  border: 1px solid ${r.colors.error};
  border-radius: 6px;
`,vo=u.p`
  color: ${r.colors.textDarker};
  font-size: ${r.fontSizes.sm};
  margin: 1rem 0;
  font-style: italic;
`,wa=u.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${r.colors.border};
  border-radius: 6px;
  background-color: ${r.colors.backgroundLighter};
  margin: 1rem 0 1.5rem 0;
  padding: 0.5rem;
`,xa=u.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${r.colors.backgroundLight};
  }
`,ya=u.input`
  cursor: pointer;
  width: 16px;
  height: 16px;
  accent-color: ${r.colors.accent};
`,ka=u.label`
  cursor: pointer;
  flex: 1;
  color: ${r.colors.text};
  font-size: ${r.fontSizes.sm};
  user-select: none;
`,_a=u.span`
  font-size: ${r.fontSizes.xs};
  font-weight: ${r.fontWeights.bold};
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  color: ${r.colors.white};
  background-color: ${e=>{switch(e.$type){case"footprint":return"#007bff";case"outline":return"#e83e8c";case"template":return"#fd7e14";default:return r.colors.border}}};
`,va=u.button`
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
`,ja=u.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: stretch;
`,jo=u.div`
  display: flex;
  justify-content: center;
  width: 100%;

  @media (min-width: 500px) {
    width: auto;
  }
`,$a=u.input`
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
`,Ca=u.button`
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
`,Sa=e=>e.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled",$o=(e,t)=>{const i=Sa(t);let o=i,s=1;for(;e.has(o);)o=`${i}_${s}`,s++;return e.add(o),o},tn=(e,t)=>{const i=new Map;for(const o of t){const[s,a,l]=o;let c="footprints";s==="outline"?c="outlines":s==="template"&&(c="templates");const f=e.folder(c);if(f){const d=a.split("/"),g=d.pop();let m=f,b=c;for(const k of d){const w=`${b}/${k}`;let h=i.get(w);h||(h=m.folder(k)||m,i.set(w,h)),m=h,b=w}g&&m.file(`${g}.js`,l)}}},$r=(e,t,i,o,s)=>{var a;if((a=i.demo)!=null&&a.svg&&e.file("demo.svg",i.demo.svg),i.outlines){let l=null;for(const[c,f]of Object.entries(i.outlines))(o||!c.startsWith("_"))&&(f.dxf||f.svg)&&(l||(l=e.folder("outlines")),l&&(f.dxf&&l.file(`${c}.dxf`,f.dxf),f.svg&&l.file(`${c}.svg`,f.svg)))}if(i.pcbs&&Object.keys(i.pcbs).length>0){const l=e.folder("pcbs");if(l)for(const[c,f]of Object.entries(i.pcbs)){const d=c.endsWith(".kicad_pcb")?c:`${c}.kicad_pcb`;l.file(d,f)}}if(i.cases){let l=null;for(const[c,f]of Object.entries(i.cases)){const d=!!f.jscad,g=s&&!!f.stl;(d||g)&&(l||(l=e.folder("cases")),l&&(f.jscad&&l.file(`${c}.jscad`,f.jscad),g&&f.stl&&l.file(`${c}.stl`,f.stl)))}}if(o){const l=e.folder("debug");if(l){l.file("raw.txt",t);for(const[c,f]of Object.entries(i))["canonical","points","units"].includes(c)&&l.file(`${c}.yaml`,JSON.stringify(f,null,2))}}},nn=async(e,t)=>{const i=await e.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),o=new Date().toISOString().replace(/[:.]/g,"-").split("T")[0];Br.saveAs(i,`${t}-${o}.zip`)},Cr=async(e,t,i,o,s)=>{const a=new ln;a.file("config.yaml",t);const l=a.folder("outputs");l&&$r(l,t,e,o,s),i&&i.length>0&&tn(a,i),await nn(a,"ergogen")},Ea=u.span`
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
`;function Pa(){return n.jsx(n.Fragment,{children:n.jsxs("span",{children:[kr()?"⌘":"Ctrl"," ⏎"]})})}const Ia=u.div`
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
`,La=u.div`
  flex-grow: 1;
`,Co=u(Ne)`
  display: none;

  @media (max-width: 475px) {
    display: flex;
  }
`,za=u.button`
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
`,So=u.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
`,Ra=u.div`
  display: flex;
  gap: 10px;
  align-items: stretch;
  padding: 10px;

  @media (max-width: 639px) {
    display: none;
  }
`,Da=u.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
  padding: 0;
`,Eo=u(Us)`
  height: 100%;
`,Aa=u.div`
  height: 100%;
  overflow-y: auto;
`,Na=u(Yi)`
  position: relative;
  flex-grow: 1;
  min-height: 0;
`,Ua=u.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`,Wa=u.div`
  height: 100%;
  overflow-y: auto;
  padding: 0.5rem;

  @media (min-width: 640px) {
    padding: 1rem;
  }
`,Oa=u.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 640px) {
    display: none;
  }
`,Fa=u.button`
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
`,Po=u.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: row;

  @media (max-width: 639px) {
    width: ${e=>e.$fullWidth?"100%":"auto"};
  }
`,Io=u.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
`,Ma=u.div`
  display: flex;
  height: 100%;
  width: 100%;
`,Ba=({pwaState:e})=>{const t=()=>Math.max(200,window.innerWidth*.33),i=()=>Math.max(150,window.innerWidth*.15),o=()=>Math.max(350,window.innerWidth*.15),[s,a]=p.useState({key:"demo.svg",extension:"svg",content:""}),[l,c]=p.useState(!1),f=x=>{a(x),h!=null&&h.showConfig||h==null||h.setShowDownloads(!1)},[d,g]=p.useState({key:-1,type:"",name:"",content:""}),[m,b]=p.useState(!1),[k,w]=p.useState(window.innerWidth<=639),h=ve(),_=!0;p.useEffect(()=>{const x=()=>{w(window.innerWidth<=639)};return window.addEventListener("resize",x),()=>window.removeEventListener("resize",x)},[]),Tr(kr()?"meta+enter":"ctrl+enter",x=>{var E,$;($=(E=x==null?void 0:x.target)==null?void 0:E.closest)!=null&&$.call(E,".monaco-editor")||h&&(M("shortcut_used",{action:"generate"}),h.generateNow(Zt(h),h.injectionInput,{pointsonly:!1,isManual:!0}))},{enableOnFormTags:!0,preventDefault:!0,ignoreEventWhen:x=>{var E,$;return!!(($=(E=x.target)==null?void 0:E.closest)!=null&&$.call(E,".monaco-editor"))}}),p.useEffect(()=>{if(d.key===-1||d.name===""||d.content==="")return;const x=[d.type,d.name,d.content];let E=[];Array.isArray(h==null?void 0:h.injectionInput)&&(E=[...h.injectionInput]);const $=E.length;if($===0||$===d.key)E.push(x),g({...d,key:$});else{const U=E[d.key];if(U[0]===d.type&&U[1]===d.name&&U[2]===d.content)return;E=E.map((F,D)=>D===d.key?x:F)}h==null||h.setInjectionInput(E)},[h,d]);const C=Zt(h),P=Fs(h==null?void 0:h.results,s.key,s.extension,C),L=p.useRef(null),I=!!(h!=null&&h.results);if(p.useEffect(()=>{if(!I){L.current=null;return}if(!P.key||!P.extension)return;const x=`${P.key}|${P.extension}`;L.current!==x&&(L.current=x,M("preview_loaded",{preview_type:P.extension,preview_key:P.key}))},[P.key,P.extension,I]),!h)return null;const j=x=>{const E={...d,name:x.target.value};g(E)},W=x=>{if(!Array.isArray(h==null?void 0:h.injectionInput))return;M("injection_deleted",{injection_type:x.type});const E=[...h.injectionInput].filter(($,U)=>U!==x.key);if(h.setInjectionInput(E),d.key===x.key)g({key:-1,type:"",name:"",content:""});else if(d.key>=x.key){const $={...d,key:d.key-1};g($)}},R=()=>{var U;const x=((U=h.getRealtimeConfigInput)==null?void 0:U.call(h))??h.configInput;if(x===void 0)return;M("download_button_clicked",{download_type:"yaml",source:"editor"});const E=document.createElement("a"),$=new Blob([x],{type:"text/yaml"});E.href=URL.createObjectURL($),E.download="config.yaml",document.body.appendChild(E),E.click(),URL.revokeObjectURL(E.href),document.body.removeChild(E)},A=()=>{var x,E;C&&(M("share_button_clicked",{has_injections:!!((x=h.injectionInput)!=null&&x.length),injections_count:((E=h.injectionInput)==null?void 0:E.length)||0,source:"subheader"}),c(!0))},O=()=>{var x,E,$;!h.results||!C||h.isGenerating||h.isJscadConverting||(M("archive_single_downloaded",{has_injections:!!((x=h.injectionInput)!=null&&x.length),injections_count:((E=h.injectionInput)==null?void 0:E.length)||0,stored_configs_count:(($=h.configs)==null?void 0:$.length)||0,source:"subheader"}),Cr(h.results,C,h.injectionInput,h.debug,h.stlPreview))};return n.jsxs(n.Fragment,{children:[l&&n.jsx(jr,{config:C,injections:h.injectionInput||[],onClose:()=>c(!1)}),n.jsxs(Da,{children:[!h.showSettings&&n.jsxs(Ia,{children:[n.jsx(Ne,{className:h.showConfig?"active":"",onClick:()=>h.setShowConfig(!0),"aria-label":"Show configuration panel","data-testid":"mobile-config-button",children:"Config"}),n.jsx(Ne,{className:h.showConfig?"":"active",onClick:()=>h.setShowConfig(!1),"aria-label":"Show outputs panel","data-testid":"mobile-outputs-button",children:"Outputs"}),n.jsx(La,{}),h.showConfig&&n.jsxs(n.Fragment,{children:[n.jsx(za,{onClick:()=>h.generateNow(C,h.injectionInput,{pointsonly:!1,isManual:!0}),"aria-label":"Generate configuration","data-testid":"mobile-generate-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"refresh"})}),n.jsx(Co,{onClick:A,disabled:!C,"aria-label":"Share configuration","data-testid":"mobile-share-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"share"})}),n.jsx(Ne,{onClick:R,"aria-label":"Download configuration","data-testid":"mobile-download-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})]}),!h.showConfig&&n.jsxs(n.Fragment,{children:[n.jsx(Co,{onClick:O,disabled:h.isGenerating||h.isJscadConverting,"aria-label":"Download archive of all generated files","data-testid":"mobile-download-outputs-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),n.jsx(Ne,{onClick:()=>h.setShowDownloads(!h.showDownloads),"aria-label":h.showDownloads?"Hide downloads panel":"Show downloads panel","data-testid":"mobile-downloads-toggle-button",children:n.jsx("span",{className:"material-symbols-outlined",children:h.showDownloads?"expand_content":"collapse_content"})})]})]}),n.jsx(Ma,{children:h.showSettings?n.jsxs(n.Fragment,{children:[n.jsx(Wt,{initialWidth:o(),minWidth:150,maxWidth:"70%",side:"left","data-testid":"settings-panel",style:{display:m&&k?"none":void 0},children:n.jsxs(Wa,{children:[n.jsxs(Ua,{children:[n.jsx(it,{children:"General"}),n.jsxs(st,{children:[n.jsx(De,{optionId:"autogen",label:"Auto-generate",description:"Automatically generate new outputs and update previews on changes.",setSelected:h.setAutoGen,checked:h.autoGen,"aria-label":"Enable auto-generate"}),n.jsx(De,{optionId:"autogen3d",label:"Auto-generate PCB & 3D",description:"Build 3D models and PCB files during generation (can be slow).",setSelected:h.setAutoGen3D,checked:h.autoGen3D,"aria-label":"Enable auto-generate PCB and 3D (slow)"}),n.jsx(De,{optionId:"debug",label:"Debug",description:"Include debug files in the outputs.",setSelected:h.setDebug,checked:h.debug,"aria-label":"Enable debug mode"})]}),n.jsx(it,{children:"Previews (Experimental)"}),n.jsxs(st,{children:[n.jsx(De,{optionId:"kicanvasPreview",label:"KiCad Preview",description:"Render interactive PCB layouts using KiCanvas.",setSelected:h.setKicanvasPreview,checked:h.kicanvasPreview,"aria-label":"Enable KiCad preview (experimental)"}),n.jsx(De,{optionId:"stlPreview",label:"STL Preview",description:"Render 3D preview of generated cases.",setSelected:h.setStlPreview,checked:h.stlPreview,"aria-label":"Enable STL preview (experimental)"})]}),n.jsx(it,{children:"Privacy"}),n.jsx(st,{children:n.jsx(De,{optionId:"sendUsageMetrics",label:"Send Usage Metrics",description:_?"Help improve Ergogen Web UI by sharing anonymous usage statistics.":"Unavailable: this copy of Ergogen Web UI was built without an analytics tag ID, so no usage statistics are sent.",setSelected:h.setSendUsageMetrics,checked:_&&h.sendUsageMetrics,disabled:!_,"aria-label":"Send usage metrics"})}),e&&n.jsxs(n.Fragment,{children:[n.jsx(it,{children:"Offline"}),n.jsx(st,{children:n.jsx(na,{isAvailable:e.isAvailable,isInstalled:e.isInstalled,isInstalling:e.isInstalling,onInstall:e.onInstall})})]})]}),n.jsx(Is,{setInjectionToEdit:g,deleteInjection:W,injectionToEdit:d,onInjectionSelect:()=>b(!0),"data-testid":"injections-container"})]})}),n.jsx(Po,{$fullWidth:m&&k,children:n.jsxs(So,{children:[k&&n.jsxs(Oa,{children:[n.jsxs(ft,{as:"h4",style:{marginTop:0},children:[d.type?d.type.charAt(0).toUpperCase()+d.type.slice(1):"Footprint"," ","name"]}),n.jsx(Fa,{onClick:()=>{b(!1),g({key:-1,type:"",name:"",content:""})},"aria-label":"Close editor","data-testid":"mobile-editor-close",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),!k&&n.jsxs(ft,{as:"h4",children:[d.type?d.type.charAt(0).toUpperCase()+d.type.slice(1):"Footprint"," ","name"]}),n.jsx(Ms,{value:d.name,onChange:j,disabled:d.key===-1,"aria-label":`${d.type?d.type.charAt(0).toUpperCase()+d.type.slice(1):"Footprint"} name`,"data-testid":"footprint-name-input"}),n.jsxs(ft,{as:"h4",children:[d.type?d.type.charAt(0).toUpperCase()+d.type.slice(1):"Footprint"," ","code"]}),n.jsx(Zi,{injection:d,setInjection:g,options:{readOnly:d.key===-1}})]})})]}):n.jsxs(n.Fragment,{children:[h.showConfig&&n.jsx(Wt,{initialWidth:t(),minWidth:250,maxWidth:"60%",side:"left","data-testid":"config-panel",children:n.jsxs(So,{children:[n.jsx(Na,{"data-testid":"config-editor"}),n.jsxs(Ra,{children:[n.jsx(qe,{onClick:()=>h.generateNow(C,h.injectionInput,{pointsonly:!1,isManual:!0}),"aria-label":"Generate configuration","data-testid":"generate-button",children:n.jsxs("span",{style:{display:"flex",alignItems:"center",width:"100%",justifyContent:"center"},children:[n.jsx("span",{children:"Generate"}),n.jsx(Ea,{children:Pa()})]})}),n.jsx(Ne,{onClick:R,"aria-label":"Download configuration","data-testid":"download-config-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})]})]})}),n.jsx(Po,{$fullWidth:!h.showConfig,children:h.showDownloads?n.jsxs(n.Fragment,{children:[n.jsx(Io,{children:n.jsx(Eo,{"data-testid":`${P.key}-file-preview`,previewExtension:P.extension,previewKey:`${P.key}-${h.resultsVersion}`,previewContent:P.content})}),n.jsx(Wt,{initialWidth:i(),minWidth:105,maxWidth:"30%",side:"right","data-testid":"downloads-panel",children:n.jsx(Aa,{children:n.jsx(ds,{setPreview:f,previewKey:P.key,"data-testid":"downloads-container"})})})]}):n.jsx(Io,{children:n.jsx(Eo,{"data-testid":`${P.key}-file-preview`,previewExtension:P.extension,previewKey:`${P.key}-${h.resultsVersion}`,previewContent:P.content})})})]})})]})]})},Ta={label:"Absolem",author:"MrZealot",value:`meta:
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
    distance: 223.7529778`},Ga={label:"Atreus",author:"MrZealot",value:`points:
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
`},Va={label:"A. Dux",author:"tapioki",value:`meta:
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
`},Ha={label:"Corney Island",author:"ceoloide",value:`points:
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
`},Ka={label:"Wubbo",author:"cache.works",value:`meta:
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
`},qa={label:"Sweep-like",author:"jcmkk3",value:`meta:
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
`},Ja={label:"Reviung41",author:"jcmkk3",value:`meta:
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
`},Xa={label:"Tiny20",author:"enzocoralc",value:`meta:
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
`},Ya={label:"Alpha",author:"jcmkk3",value:`points:
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
`},Za={label:"Plank",author:"cache.works",value:`meta:
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
`},Qa={label:"Curly-45",author:"peterjc",value:`meta:
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
`},el={label:"Briefs 56",author:"ceoloide",value:`# Inspired by the Dygma Sonsei
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
`},tl={label:"Willy 50",author:"ceoloide",value:`# Inspired by the Keychron Orca Echo
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
`},nl=[on],ol=[Ta,Ga],rl=[Va,Ha,qa,Ja,Xa],il=[Ka,Ya,Za,Qa,el,tl],sl=[{label:"Empty configurations",options:nl},{label:"Simple (points only)",options:ol},{label:"Complete (with pcb)",options:rl},{label:"Miscellaneous",options:il}],al=e=>{var o;const t=fe.load(e.value),i=((o=t==null?void 0:t.meta)==null?void 0:o.engine)??(t==null?void 0:t["meta.engine"]);return i===null?void 0:i},ll=(e,t=Je())=>{const i=al(e);return i===void 0?!0:typeof i=="string"&&yi(t,i)},cl=(e=Je())=>sl.map(t=>({...t,options:t.options.filter(i=>ll(i,e))})).filter(t=>t.options.length>0),dl=async e=>new Promise((t,i)=>{const o=new FileReader;o.onload=s=>{var a;(a=s.target)!=null&&a.result&&typeof s.target.result=="string"?t(s.target.result):i(new Error("Failed to read file as text"))},o.onerror=()=>i(new Error("Failed to read file")),o.readAsText(e)}),ul=async e=>{const i=e.name.toLowerCase().split(".").pop(),o=i==="zip"||i==="ekb";if(Jt(e.size,o),i==="yaml"||i==="yml"||i==="json")return{config:await dl(e),footprints:[],outlines:[],templates:[]};if(o){const s=await e.arrayBuffer(),a=await Ci(s),l=a.injections.filter(d=>d.type==="footprint").map(d=>({name:d.name,content:d.content})),c=a.injections.filter(d=>d.type==="outline").map(d=>({name:d.name,content:d.content})),f=a.injections.filter(d=>d.type==="template").map(d=>({name:d.name,content:d.content}));return{config:a.config,footprints:l,outlines:c,templates:f}}else throw new Error("Unsupported file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")},rn=()=>n.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-github",viewBox:"0 0 98 96",children:n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z",fill:"currentColor"})}),Lo=()=>n.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 4.2333332 4.2333335",version:"1.1",fill:"currentColor",children:[n.jsxs("defs",{children:[n.jsxs("linearGradient",{id:"linearGradient6924-6",children:[n.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:0},offset:"0"}),n.jsx("stop",{offset:"0.49517274",style:{stopColor:"#ffffff",stopOpacity:.3}}),n.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:.3},offset:"1"})]}),n.jsx("linearGradient",{id:"linearGradient6918-3",x1:"42519.285",y1:"-7078.7891",x2:"42575.336",y2:"-6966.9307",gradientUnits:"userSpaceOnUse",href:"#linearGradient6924-6"})]}),n.jsxs("g",{transform:"matrix(0.06551432,0,0,0.06551432,-2.232417,-1.431776)",children:[n.jsx("path",{id:"path6733-5",style:{fontVariationSettings:"normal",opacity:1,vectorEffect:"none",fill:"url(#linearGradient6918-3)",fillOpacity:1,stroke:"none",strokeWidth:3.67846,strokeLinecap:"butt",strokeLinejoin:"miter",strokeMiterlimit:2,strokeDashoffset:0,strokeOpacity:1,paintOrder:"stroke markers fill",stopColor:"#000000",stopOpacity:1},d:"m 42519.285,-7078.7891 a 0.76086879,0.56791688 0 0 0 -0.738,0.6739 l 33.586,125.8886 a 87.182358,87.182358 0 0 0 39.381,-33.7636 l -71.565,-92.5196 a 0.76086879,0.56791688 0 0 0 -0.664,-0.2793 z",transform:"matrix(0.37058478,0,0,0.37058478,-15690.065,2662.0533)"}),n.jsx("path",{id:"path360787",style:{opacity:1,fill:"#ffffff",fillOpacity:1,strokeWidth:17.0055,paintOrder:"markers fill stroke",stopColor:"#000000"},d:"m 11249.461,-1883.6961 c -12.74,0 -23.067,10.3275 -23.067,23.0671 0,4.3335 1.22,8.5795 3.522,12.2514 l 19.232,-24.8636 c 0.138,-0.1796 0.486,-0.1796 0.624,0 l 19.233,24.8646 c 2.302,-3.6721 3.523,-7.9185 3.523,-12.2524 0,-12.7396 -10.327,-23.0671 -23.067,-23.0671 z",transform:"matrix(1.4006354,0,0,1.4006354,-15690.065,2662.0533)"})]})]}),zo=()=>n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 212 212",fill:"none",stroke:"currentColor",children:n.jsxs("g",{transform:"translate(6,6)",children:[n.jsx("path",{d:"M58 168 v-98 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),n.jsx("path",{d:"M58 168 v-30 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),n.jsx("circle",{cx:"142",cy:"20",r:"18",strokeWidth:"15"}),n.jsx("circle",{cx:"142",cy:"88",r:"18",strokeWidth:"15"}),n.jsx("circle",{cx:"58",cy:"180",r:"18",strokeWidth:"15"})]})}),sn=u.div`
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
`,pl=u.div`
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
`,fl=u.div`
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
`,hl=u.div`
  background-color: ${r.colors.backgroundLight};
  border: 3px dashed ${r.colors.accent};
  border-radius: 8px;
  padding: 2rem;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
  text-align: center;
`,gl=u.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 640px) {
    padding: 1rem 0.5rem;
  }
`,ml=u.h1`
  font-size: ${r.fontSizes.h1};
  text-align: center;
  margin-bottom: 1rem;
`,bl=u.p`
  font-size: ${r.fontSizes.lg};
  text-align: center;
  margin-bottom: 3rem;
  color: ${r.colors.textDark};
`,wl=u.div`
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
`,xl=u.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;

  button {
    flex-shrink: 0;
  }
`,yl=u.div`
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
`,kl=u.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  user-select: none;
`,_l=u.button`
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
`,vl=u.div`
  width: 1px;
  background-color: ${r.colors.border};
  margin: 0.75rem 0;
  flex-shrink: 0;
`,jl=u.input`
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
`,$l=u.div`
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
`,Cl=u(pe)`
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
`,Sl=u.input`
  display: none;
`,Ro=u.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`,Do=u.div`
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
`,El=u.img`
  width: 100%;
  height: 150px;
  object-fit: contain;
  padding: 8px;
  box-sizing: border-box;
  background-color: ${r.colors.backgroundLighter};
`,Ao=u.div`
  padding: 1rem;
  font-weight: ${r.fontWeights.semiBold};
  text-align: center;
`,Pl=u.div`
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
`,Il=u.div`
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
`,Ll=()=>{const e=Je(),t=p.useMemo(()=>cl(e).flatMap(y=>y.options).filter(y=>y.label!=="Empty YAML configuration"),[e]),i=an(),o=ve(),[s,a]=p.useState(""),[l,c]=p.useState("github"),[f,d]=p.useState(!1),[g,m]=p.useState(!1),b=f||g,[k,w]=p.useState(!1),h=p.useRef(null),[_,C]=p.useState(!1);p.useEffect(()=>{const y=V=>{h.current&&!h.current.contains(V.target)&&C(!1)};return document.addEventListener("mousedown",y),()=>document.removeEventListener("mousedown",y)},[]);const[P,L]=p.useState(!1),I=y=>{a(y),y.includes("github.com/")?c("github"):y.includes("codeberg.org/")?c("codeberg"):(y.startsWith("http://")||y.startsWith("https://")||y.includes("/")&&!y.includes("github.com/")&&!y.includes("codeberg.org/")&&y.split("/")[0].includes("."))&&c("forgejo")},{currentConflict:j,processInjectionsWithConflictResolution:W,handleConflictResolution:R,handleConflictCancel:A}=_t({setInjectionInput:y=>o==null?void 0:o.setInjectionInput(y),setConfigInput:y=>o==null?void 0:o.setConfigInput(y),generateNow:async(y,V,H)=>{o&&await o.generateNow(y,V,H)},getCurrentInjections:()=>(o==null?void 0:o.injectionInput)||[],onComplete:async()=>{w(!0)},setError:y=>o==null?void 0:o.setError(y)});p.useEffect(()=>{const y=new URLSearchParams(window.location.search),V=y.has("github")||y.has("codeberg")||y.has("forgejo")||y.has("gitea");(k||V)&&(o!=null&&o.configInput)&&(i("/"),w(!1))},[k,o==null?void 0:o.configInput,i]),p.useEffect(()=>{var y;(y=o==null?void 0:o.pruneDeletedConfigs)==null||y.call(o)},[o]);const O=async y=>{if(o){const V=y===on.value;let H="unknown";if(V)H="empty_configuration";else{const ee=t.find(K=>K.value===y);ee&&(H=ee.label.toLowerCase().replace(/\s+/g,"_"))}M("example_loaded",{example_name:H,is_empty:V}),o.createNewConfig(y),await o.generateNow(y,o.injectionInput,{pointsonly:!1}),w(!0)}},x=async y=>{if(o){const V=o.configs.find(H=>H.id===y);V&&(o.selectConfig(y),M("saved_config_loaded",{stored_configs_count:o.configs.length}),await o.generateNow(V.config,o.injectionInput,{pointsonly:!1}),w(!0))}},$=[...(o==null?void 0:o.configs)||[]].sort((y,V)=>new Date(V.updatedAt).getTime()-new Date(y.updatedAt).getTime()).slice(0,4),U=async(y,V,H,ee,K=null,se)=>{if(!o)throw new Error("Configuration context not available");const ie=hr(y,V,H);await W(ie,ee,K,se)},F=async(y,V)=>{await R(y,V)},D=()=>{A(),d(!1),m(!1),o==null||o.setIsGenerating(!1)},q=()=>{if(!s||!o)return;const{setError:y,clearError:V,setIsGenerating:H}=o;m(!0),H(!0),V(),M("repo_loaded",{provider:l});let ee=s.trim();if(!ee.includes("://")&&!ee.includes("github.com")&&!ee.includes("codeberg.org"))if(l==="codeberg")ee=`https://codeberg.org/${ee}`;else if(l==="forgejo"){const K=ee.split("/");if(K.length>=2&&K[0].includes("."))ee=`https://${ee}`;else{y("Forgejo/Gitea requires a URL including the host (e.g., host/owner/repo)"),m(!1),H(!1);return}}else ee=`https://github.com/${ee}`;gr(ee).then(async K=>{if(o){K.rateLimitWarning&&y(K.rateLimitWarning);try{o.createNewConfig(K.config),await U(K.footprints,K.outlines,K.templates||[],K.config)}catch(se){throw new Error(`Failed to process footprints: ${se instanceof Error?se.message:"Unknown error"}`)}}}).catch(K=>{y(`Failed to load from ${l==="github"?"GitHub":l==="codeberg"?"Codeberg":"Forgejo/Gitea"} repository: ${K.message}`),o==null||o.setInfo(null),m(!1),H(!1)}).finally(()=>{m(!1)})},J=p.useRef(null),ne=()=>{var y;(y=J.current)==null||y.click()},Z=async y=>{if(!o)return;const{setError:V,clearError:H,setIsGenerating:ee}=o;d(!0),ee(!0),H(),M("local_file_loaded",{file_type:li(y.name),file_size:y.size});try{const K=await ul(y);o.createNewConfig(K.config),await U(K.footprints,K.outlines,K.templates||[],K.config)}catch(K){V(`Failed to load local file: ${K instanceof Error?K.message:"Unknown error"}`),o.setInfo(null),d(!1),ee(!1)}finally{d(!1)}},B=async y=>{var H;const V=(H=y.target.files)==null?void 0:H[0];V&&(y.target.value="",await Z(V))},N=y=>{y.preventDefault(),y.stopPropagation(),!b&&L(!0)},T=y=>{y.preventDefault(),y.stopPropagation()},Q=y=>{if(y.preventDefault(),y.stopPropagation(),b)return;const V=y.currentTarget,H=y.relatedTarget;(!H||!V.contains(H))&&L(!1)},G=async y=>{if(y.preventDefault(),y.stopPropagation(),b)return;L(!1);const V=Array.from(y.dataTransfer.files),H=[".yaml",".yml",".json",".zip",".ekb"],ee=V.find(K=>{const se=K.name.toLowerCase();return H.some(ie=>se.endsWith(ie))});ee?await Z(ee):V.length>0&&o&&o.setError("Invalid file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")};return n.jsxs(pl,{$isDragging:P,onDragEnter:N,onDragOver:T,onDragLeave:Q,onDrop:G,"data-testid":"welcome-page-wrapper",children:[n.jsx(fl,{$isVisible:P,children:n.jsx(hl,{children:"Drop file here to load configuration"})}),j&&n.jsx(wt,{injectionName:j.name,injectionType:j.type,onResolve:F,onCancel:D,"data-testid":"conflict-dialog"}),n.jsxs(gl,{children:[n.jsx(ml,{children:"Ergogen Web UI"}),n.jsxs(bl,{children:["A web-based interface for Ergogen, the ergonomic keyboard generator.",n.jsx("br",{}),"Start a new design below."]}),n.jsxs(wl,{children:[n.jsxs(Ot,{children:[n.jsx("h2",{children:"Start Fresh"}),n.jsx("p",{children:"Begin with a completely blank slate."}),n.jsx(pe,{onClick:()=>O(on.value),"aria-label":"Start with empty configuration","data-testid":"empty-config-button",children:"Empty Configuration"})]}),n.jsxs(Ot,{children:[n.jsx("h2",{children:"From Local File"}),n.jsx("p",{children:"Load a configuration from your computer. Supports *.yaml, *.json, *.zip, and *.ekb files."}),n.jsx(Sl,{ref:J,type:"file",accept:".yaml,.yml,.json,.zip,.ekb",onChange:B,disabled:b,"aria-label":"Select local file to load","data-testid":"local-file-input"}),n.jsx(pe,{onClick:ne,disabled:b,"aria-label":"Select local file to load","data-testid":"local-file-button",children:f?n.jsxs(n.Fragment,{children:[n.jsx(sn,{})," Loading..."]}):"Choose File"})]}),n.jsxs(Ot,{children:[n.jsx("h2",{children:"From Repo"}),n.jsx("p",{children:'Link to a YAML config file on a Git provider (e.g. GitHub, Codeberg, Forgejo), or simply a repository name like "user/repo".'}),n.jsx(xl,{children:n.jsxs(yl,{children:[n.jsxs(kl,{ref:h,children:[n.jsxs(_l,{type:"button",onClick:()=>C(!_),disabled:b,"aria-label":"Repository provider source","data-testid":"repo-provider-trigger",children:[l==="github"?n.jsx(rn,{}):l==="codeberg"?n.jsx(Lo,{}):n.jsx(zo,{}),n.jsx("span",{className:"material-symbols-outlined",children:"arrow_drop_down"})]}),_&&n.jsxs($l,{children:[n.jsxs(Ft,{$active:l==="github",onClick:()=>{c("github"),C(!1)},children:[n.jsx(rn,{}),"GitHub"]}),n.jsxs(Ft,{$active:l==="codeberg",onClick:()=>{c("codeberg"),C(!1)},children:[n.jsx(Lo,{}),"Codeberg"]}),n.jsxs(Ft,{$active:l==="forgejo",onClick:()=>{c("forgejo"),C(!1)},children:[n.jsx(zo,{}),"Forgejo"]})]})]}),n.jsx(vl,{}),n.jsx(jl,{placeholder:l==="forgejo"?"host/user/repo":"user/repo",value:s,onChange:y=>I(y.target.value),onKeyDown:y=>{y.key==="Enter"&&!b&&s.trim()!==""&&(y.preventDefault(),q())},disabled:b,"aria-label":"Repository URL or path","data-testid":"repo-input"}),n.jsx(Cl,{onClick:q,disabled:b||!s,"aria-label":"Load configuration from repository","data-testid":"repo-load-button",children:g?n.jsx(sn,{}):n.jsx("span",{className:"material-symbols-outlined",style:{display:"block"},children:"cloud_download"})})]})})]})]}),$.length>0&&n.jsxs(n.Fragment,{children:[n.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:r.fontSizes.h2},children:"Pick up where you left"}),n.jsx(Ro,{style:{marginBottom:"3rem"},children:$.map(y=>n.jsxs(Do,{onClick:()=>x(y.id),"aria-label":`Load ${y.name} configuration`,"data-testid":`saved-config-${y.name.toLowerCase().replace(/\s+/g,"-")}`,children:[y.previewSvg?n.jsx(Pl,{dangerouslySetInnerHTML:{__html:y.previewSvg}}):n.jsx(Il,{children:n.jsx("span",{className:"material-symbols-outlined",children:"keyboard_off"})}),n.jsx(Ao,{children:y.name})]},y.id))})]}),n.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:r.fontSizes.h2},children:"Or start from an example"}),n.jsx(Ro,{children:t.map(y=>n.jsxs(Do,{onClick:()=>O(y.value),"aria-label":`Load ${y.label} example`,"data-testid":`example-${y.label.toLowerCase().replace(/\s+/g,"-")}`,children:[n.jsx(El,{src:`/images/previews/${y.label.toLowerCase().replace(/[\s()]/g,"_")}.svg`,alt:`${y.label} preview`}),n.jsx(Ao,{children:y.label})]},y.label))})]})]})},Sr=({versionInfo:e,"data-testid":t})=>{const[i,o]=p.useState(!1),s=p.useRef(null),a=()=>{s.current&&clearTimeout(s.current),o(!0)},l=()=>{s.current=setTimeout(()=>{o(!1)},250)},c=()=>{s.current&&clearTimeout(s.current)},f=()=>{s.current=setTimeout(()=>{o(!1)},250)},d=g=>{g.stopPropagation(),o(m=>!m)};return p.useEffect(()=>{if(!i)return;const g=()=>{o(!1)};return window.addEventListener("click",g),()=>{window.removeEventListener("click",g)}},[i]),p.useEffect(()=>()=>{s.current&&clearTimeout(s.current)},[]),n.jsxs(zl,{onMouseEnter:a,onMouseLeave:l,"data-testid":t,children:[n.jsx(Rl,{onClick:d,"data-testid":t&&`${t}-badge`,"aria-label":"Custom Ergogen version indicator",children:n.jsx("span",{className:"material-symbols-outlined",children:"science"})}),i&&n.jsxs(Dl,{onMouseEnter:c,onMouseLeave:f,onClick:g=>g.stopPropagation(),"data-testid":t&&`${t}-popover`,children:[n.jsx(Al,{children:"Custom Ergogen Version"}),n.jsx(Nl,{children:"This website is running a custom version of Ergogen for development and preview purposes."}),n.jsxs(Ul,{href:e.url,target:"_blank",rel:"noopener noreferrer","data-testid":t&&`${t}-link`,children:[n.jsx("span",{children:e.label}),n.jsx("span",{className:"material-symbols-outlined open-icon",children:"open_in_new"})]})]})]})},zl=u.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  transform: translateY(-5px);
`,Rl=u.span`
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
`,Dl=u.div`
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
`,Al=u.div`
  font-size: 12px;
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
`,Nl=u.div`
  font-size: 11px;
  color: ${r.colors.textDark};
  line-height: 1.4;
`,Ul=u.a`
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
`,Wl=xt`
  0%   { box-shadow: 0 0 0 0   ${r.colors.accent}99; }
  70%  { box-shadow: 0 0 0 6px ${r.colors.accent}00; }
  100% { box-shadow: 0 0 0 0   ${r.colors.accent}00; }
`,Ol=xt`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`,Fl=u.button`
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
  animation: ${Wl} ${e=>e.$isUpdating?"0.6s":"2s"}
    ease-out infinite;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  .material-symbols-outlined {
    font-size: 14px !important;
    ${e=>e.$isUpdating&&Xo`
        animation: ${Ol} 1s linear infinite;
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
`,Ml=({onClick:e,"data-testid":t})=>{const[i,o]=p.useState(!1),s=()=>{o(!0),e()};return n.jsxs(Fl,{onClick:s,disabled:i,$isUpdating:i,"aria-label":i?"Updating version...":"Update available — click to reload and apply","data-testid":t??"update-chip",children:[n.jsx("span",{className:"material-symbols-outlined","aria-hidden":"true",children:i?"sync":"update"}),i?"Updating version...":"Update Available"]})},Bl=u.header`
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
`,Tl=u.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: row;
  flex-grow: 1;
  min-width: 0;
  width: 100%;
`,Gl=u.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,Vl=u.div`
  display: flex;
  align-items: center;
  gap: 6px;
`,Hl=u.div`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  display: flex;
  align-items: center;
  @media (max-width: 639px) {
    display: none;
  }
`,jt=u.button`
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
`,Kl=u(jt)`
  flex-shrink: 0;
`,ql=u(jt)`
  background-color: ${r.colors.accent};
  border-color: ${r.colors.accent};

  &:hover {
    background-color: ${r.colors.accentDark};
    border-color: ${r.colors.accentDarker};
  }

  @media (max-width: 375px) {
    display: none;
  }
`,Jl=u.span`
  @media (max-width: 510px) {
    display: none;
  }
`,No=u(jt)`
  @media (max-width: 475px) {
    display: none;
  }
`,Xl=u(er)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,Yl=u.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,Zl=({onUpdate:e})=>{const t=ve(),i=an(),o=Qo(),{activeConfigId:s,activeConfigName:a,configs:l,isPreview:c,renameConfig:f,duplicateConfig:d,deleteConfig:g,savePreviewConfig:m}=t||{},[b,k]=p.useState(!1),[w,h]=p.useState(!1),[_,C]=p.useState(""),P=()=>{a&&s&&(C(a),h(!0))},L=D=>{D&&D.stopPropagation(),!(f&&s&&_.trim()&&!f(s,_.trim()))&&h(!1)},I=D=>{D&&D.stopPropagation(),h(!1)},j=D=>{D.key==="Enter"?L():D.key==="Escape"&&h(!1)},W=D=>{D.stopPropagation(),d&&s&&d(s)},R=D=>{D.stopPropagation(),s&&a&&g&&window.confirm(`Are you sure you want to delete "${a}"?`)&&(g(s),(l&&l.length<=1||s)&&i("/new"))},A=()=>{t==null||t.setShowSettings(!(t!=null&&t.showSettings))},O=()=>{t==null||t.setShowSettings(!1),t==null||t.selectConfig(null),i("/new")},x=Zt(t),E=()=>{var D,q,J;!(t!=null&&t.results)||!x||t!=null&&t.isGenerating||t!=null&&t.isJscadConverting||(M("archive_single_downloaded",{has_injections:!!((D=t.injectionInput)!=null&&D.length),injections_count:((q=t.injectionInput)==null?void 0:q.length)||0,stored_configs_count:((J=t.configs)==null?void 0:J.length)||0,source:"header"}),Cr(t.results,x,t.injectionInput,t.debug,t.stlPreview))},$=()=>{var D,q;!t||!x||(M("share_button_clicked",{has_injections:!!((D=t.injectionInput)!=null&&D.length),injections_count:((q=t.injectionInput)==null?void 0:q.length)||0,source:"header"}),k(!0))},U=()=>{t==null||t.setShowSideNav(!(t!=null&&t.showSideNav))},F=p.useMemo(()=>un("github:ceoloide/ergogen#v4.3.0"),[]);return n.jsxs(n.Fragment,{children:[b&&n.jsx(jr,{config:x,injections:(t==null?void 0:t.injectionInput)||[],onClose:()=>k(!1),"data-testid":"share-dialog"}),n.jsxs(Bl,{children:[n.jsxs(Tl,{children:[n.jsx(Kl,{onClick:U,"aria-label":t!=null&&t.showSideNav?"Hide navigation panel":"Show navigation panel","data-testid":"side-nav-toggle-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"side_navigation"})}),n.jsxs(Vl,{children:[n.jsx(Xl,{to:"/","aria-label":"Go to home page","data-testid":"logo-button",children:n.jsx(Yl,{src:"/ergogen.png",alt:"Ergogen logo"})}),n.jsxs(Hl,{children:["Ergogen",F.isCustom&&n.jsx(Sr,{versionInfo:F,"data-testid":"header-dev-chip"})]})]}),a&&n.jsxs(n.Fragment,{children:[n.jsx(ec,{children:"/"}),n.jsxs(Ql,{"data-testid":"header-active-config-name",$isEditing:w,onClick:!w&&!c?P:void 0,children:[c&&n.jsx(nc,{"data-testid":"header-shared-icon",children:n.jsx("span",{className:"material-symbols-outlined",children:"link"})}),w?n.jsxs(n.Fragment,{children:[n.jsx(tc,{type:"text",value:_,onChange:D=>C(D.target.value),onBlur:L,onKeyDown:j,autoFocus:!0,"data-testid":"header-config-name-input","aria-label":"Edit configuration name"}),n.jsxs(Mt,{className:"header-actions-always-visible",children:[n.jsx(He,{onMouseDown:D=>{D.preventDefault()},onClick:L,"aria-label":"Confirm rename","data-testid":"header-confirm-rename-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"check"})}),n.jsx(He,{onMouseDown:D=>{D.preventDefault()},onClick:I,"aria-label":"Cancel rename","data-testid":"header-cancel-rename-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]})]}):c?n.jsxs(n.Fragment,{children:[n.jsx(Wo,{"data-testid":"header-config-name-text",children:a}),n.jsx(Mt,{className:"header-actions-always-visible",children:n.jsx(He,{onClick:D=>{D.stopPropagation(),m==null||m()},"aria-label":"Save preview configuration","data-testid":"header-save-preview-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"save"})})})]}):n.jsxs(n.Fragment,{children:[n.jsx(Wo,{title:"Click to rename","data-testid":"header-config-name-text",children:a}),n.jsxs(Mt,{className:"header-actions-hover",children:[n.jsx(He,{onClick:P,"aria-label":"Rename configuration","data-testid":"header-rename-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),n.jsx(Uo,{onClick:W,"aria-label":"Duplicate configuration","data-testid":"header-duplicate-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),n.jsx(Uo,{onClick:R,"aria-label":"Delete configuration","data-testid":"header-delete-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})]})]})]}),n.jsxs(Gl,{children:[e&&n.jsx(Ml,{onClick:e,"data-testid":"header-update-chip"}),o.pathname==="/"&&n.jsxs(n.Fragment,{children:[n.jsxs(ql,{onClick:O,"aria-label":"Start new configuration","data-testid":"new-config-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"add_2"}),n.jsx(Jl,{children:"New"})]}),n.jsx(No,{onClick:E,disabled:(t==null?void 0:t.isGenerating)||(t==null?void 0:t.isJscadConverting),"aria-label":"Download archive of all generated files","data-testid":"header-download-outputs-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),n.jsx(No,{onClick:$,disabled:!(t!=null&&t.configInput),"aria-label":"Share configuration","data-testid":"header-share-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"share"})})]}),o.pathname!=="/new"&&n.jsx(jt,{onClick:A,"aria-label":t!=null&&t.showSettings?"Hide settings panel":"Show settings panel","data-testid":"settings-button",children:n.jsx("span",{className:"material-symbols-outlined",children:t!=null&&t.showSettings?"keyboard_alt":"settings"})})]})]})]})},Ql=u.div`
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
`,Uo=u(He)`
  @media (max-width: 767px) {
    display: none;
  }
`,ec=u.span`
  color: ${r.colors.textDark};
  font-size: ${r.fontSizes.sm};
  font-weight: ${r.fontWeights.semiBold};
  user-select: none;
  @media (max-width: 639px) {
    display: none;
  }
`,Wo=u.span`
  font-size: ${r.fontSizes.bodySmall};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  user-select: none;
`,tc=u.input`
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
`,nc=u.div`
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
`,oc=xt`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
`,rc=u.div`
  position: fixed;
  top: 45px;
  left: 0;
  right: 0;
  width: 100%;
  height: 3px;
  background-color: transparent;
  overflow: hidden;
  z-index: 1000;
`,ic=u.div`
  height: 100%;
  width: 25%;
  background-color: ${r.colors.accent};
  animation: ${oc} 1.5s ease-in-out infinite;
`,sc=({visible:e,"data-testid":t})=>e?n.jsx(rc,{"data-testid":t,children:n.jsx(ic,{})}):null,at={info:{background:r.colors.info,text:r.colors.infoDark},warning:{background:r.colors.warning,text:r.colors.warningDark},error:{background:r.colors.error,text:r.colors.errorDark},success:{background:r.colors.success,text:r.colors.successDark}},lt=u.span.attrs({className:"material-symbols-outlined"})`
  font-size: ${r.fontSizes.iconLarge};
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
`,ac=u.div`
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
  font-size: ${r.fontSizes.h3};
  cursor: pointer;
  padding: 0;
  line-height: 1;
  margin-left: auto;
  padding-left: 1rem;
`,lc=()=>{const e=ve();if(!e)return null;const{error:t,deprecationWarning:i,skippedWarning:o,info:s,clearError:a,clearWarning:l,clearSkippedWarning:c,clearInfo:f}=e;return n.jsxs(ac,{"data-testid":"banners-container",children:[s&&n.jsxs(ut,{type:"info","data-testid":"info-banner",children:[n.jsxs(ct,{children:[n.jsx(lt,{children:"info"}),n.jsx(dt,{children:s})]}),n.jsx(pt,{onClick:f,"aria-label":"Close info message","data-testid":"close-info-banner",children:"×"})]}),i&&n.jsxs(ut,{type:"warning","data-testid":"warning-banner",children:[n.jsxs(ct,{children:[n.jsx(lt,{children:"warning"}),n.jsx(dt,{children:i})]}),n.jsx(pt,{onClick:l,"aria-label":"Close warning message","data-testid":"close-warning-banner",children:"×"})]}),o&&n.jsxs(ut,{type:"warning","data-testid":"skipped-injections-banner",children:[n.jsxs(ct,{children:[n.jsx(lt,{children:"warning"}),n.jsx(dt,{children:o})]}),n.jsx(pt,{onClick:c,"aria-label":"Close feature warning message","data-testid":"close-skipped-banner",children:"×"})]}),t&&n.jsxs(ut,{type:"error","data-testid":"error-banner",children:[n.jsxs(ct,{children:[n.jsx(lt,{children:"error"}),n.jsx(dt,{children:t})]}),n.jsx(pt,{onClick:a,"aria-label":"Close error message","data-testid":"close-error-banner",children:"×"})]})]})},cc=()=>n.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-discord",viewBox:"0 0 16 16",children:n.jsx("path",{d:"M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"})}),Oo=({label:e,version:t,url:i,isCustom:o=!1,"data-testid":s,devBadgeTestId:a})=>{const l=()=>{window.open(i,"_blank","noopener,noreferrer")};return n.jsxs(dc,{onClick:l,$hasDevBadge:o,"aria-label":`View ${e==="Ergogen"?"Ergogen":`Ergogen ${e}`} ${t} on GitHub`,"data-testid":s,children:[n.jsx(rn,{}),n.jsxs(uc,{children:[n.jsx(pc,{children:e}),n.jsx(fc,{$isCustom:o,children:t})]}),o&&n.jsx(hc,{"data-testid":a,children:n.jsx(gc,{children:"DEV"})})]})},dc=u.button`
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
`,uc=u.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  line-height: 1.1;
  min-width: 0;
`,pc=u.span`
  font-size: 10px;
  font-weight: ${r.fontWeights.bold};
  color: ${r.colors.white};
  white-space: nowrap;
`,fc=u.span`
  font-size: 8px;
  color: ${e=>e.$isCustom?r.colors.accent:r.colors.textDark};
  white-space: nowrap;
`,hc=u.div`
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
`,gc=u.span`
  font-size: 8px;
  font-weight: ${r.fontWeights.bold};
  color: ${r.colors.accent};
  transform: rotate(-90deg);
  white-space: nowrap;
  line-height: 1;
`,mc=({isOpen:e,onClose:t,"data-testid":i})=>{const o=p.useRef(e),[s,a]=p.useState(e),[l,c]=p.useState(360),f=p.useRef(!1),d=p.useRef(0),g=p.useRef(360),m=ve(),b=an(),k=yt.version,{configs:w,activeConfigId:h,selectConfig:_,renameConfig:C,duplicateConfig:P,deleteConfig:L,setIsBulkDownloadOpen:I}=m||{},[j,W]=p.useState(""),[R,A]=p.useState(null),[O,x]=p.useState(""),E=p.useMemo(()=>{if(!w)return[];let N=w;if(j.trim()){const T=j.toLowerCase().split(/\s+/).filter(Boolean);T.length>0&&(N=w.filter(Q=>{const G=Q.name.toLowerCase();return T.some(y=>G.includes(y))}))}return[...N].sort((T,Q)=>{const G=T.updatedAt?new Date(T.updatedAt).getTime():0,y=Q.updatedAt?new Date(Q.updatedAt).getTime():0;if(G!==y)return y-G;const V=T.createdAt?new Date(T.createdAt).getTime():0,H=Q.createdAt?new Date(Q.createdAt).getTime():0;return V!==H?H-V:T.name.localeCompare(Q.name)})},[w,j]),$=()=>{_&&_(null),b("/new"),t()},U=()=>{M("bulk_download_dialog_opened",{stored_configs_count:(w==null?void 0:w.length)||0}),I&&I(!0),t()},F=N=>{_&&(_(N),b("/"),t())},D=(N,T)=>{A(N),x(T)},q=N=>{C&&O.trim()&&!C(N,O.trim())||A(null)},J=N=>{P&&P(N)},ne=(N,T)=>{if(window.confirm(`Are you sure you want to delete "${T}"?`)&&L){L(N);const Q=h===N,G=w&&w.length<=1;(Q||G)&&(b("/new"),t())}};p.useEffect(()=>{const N=o.current;e&&!N?a(!0):!e&&N&&a(!1),e||A(null),o.current=e},[e]),p.useEffect(()=>{if(!j.trim())return;const N=setTimeout(()=>{M("search_performed",{query_length:j.trim().length})},1e3);return()=>clearTimeout(N)},[j]),p.useEffect(()=>{const N=y=>{if(!f.current)return;const V=y.clientX-d.current,H=g.current+V,ee=Math.min(600,window.innerWidth*.9),K=Math.max(360,Math.min(H,ee));c(K)},T=()=>{f.current&&(f.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},Q=y=>{if(!f.current)return;y.preventDefault();const H=y.touches[0].clientX-d.current,ee=g.current+H,K=Math.min(600,window.innerWidth*.9),se=Math.max(360,Math.min(ee,K));c(se)},G=()=>{f.current&&(f.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",N),window.addEventListener("mouseup",T),window.addEventListener("touchmove",Q,{passive:!1}),window.addEventListener("touchend",G),()=>{window.removeEventListener("mousemove",N),window.removeEventListener("mouseup",T),window.removeEventListener("touchmove",Q),window.removeEventListener("touchend",G)}},[]);const Z=N=>{N.preventDefault(),N.stopPropagation(),f.current=!0,g.current=l,"touches"in N?d.current=N.touches[0].clientX:d.current=N.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};p.useEffect(()=>{if(!e)return;const N=T=>{T.key==="Escape"&&t()};return window.addEventListener("keydown",N),()=>{window.removeEventListener("keydown",N)}},[e,t]);const B=p.useMemo(()=>un("github:ceoloide/ergogen#v4.3.0"),[]);return p.useEffect(()=>(e?document.body.style.overflow="hidden":document.body.style.overflow="",()=>{document.body.style.overflow=""}),[e]),n.jsxs(n.Fragment,{children:[n.jsx(bc,{"data-testid":i,onClick:t,$isOpen:e,$isOpening:s}),n.jsxs(wc,{"data-testid":i&&`${i}-panel`,$isOpen:e,$isOpening:s,$width:l,onClick:N=>N.stopPropagation(),children:[n.jsx(Tc,{onMouseDown:Z,onTouchStart:Z,"data-testid":i&&`${i}-resize-handle`}),n.jsxs(xc,{children:[n.jsxs(yc,{children:[n.jsx(kc,{to:"/",onClick:t,"aria-label":"Go to home page","data-testid":"side-nav-logo-button",children:n.jsx(_c,{src:"/ergogen.png",alt:"Ergogen logo"})}),n.jsxs(vc,{onClick:t,children:["Ergogen",B.isCustom&&n.jsx(Sr,{versionInfo:B,"data-testid":"sidebar-dev-chip"})]})]}),n.jsx(jc,{onClick:t,"data-testid":i&&`${i}-close`,"aria-label":"Close navigation panel",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),n.jsxs($c,{children:[n.jsxs(Cc,{children:[n.jsxs(Sc,{onClick:$,"aria-label":"New","data-testid":"side-nav-new-config-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"add"}),n.jsx("span",{children:"New"})]}),w&&w.length>0&&n.jsxs(Ec,{onClick:U,"aria-label":"Download All","data-testid":"side-nav-download-all-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"download"}),n.jsx("span",{children:"Download All"})]})]}),n.jsxs(Pc,{children:[n.jsx("span",{className:"material-symbols-outlined search-icon",children:"search"}),n.jsx(Ic,{type:"text",placeholder:"Search configurations...",value:j,onChange:N=>W(N.target.value),"aria-label":"Search configurations"}),j&&n.jsx(Lc,{onClick:()=>W(""),children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),n.jsxs(zc,{children:[n.jsx("span",{children:"Saved Configurations"}),n.jsx(Rc,{children:E.length})]}),n.jsxs(Dc,{children:[E.map(N=>{const T=N.id===h,Q=R===N.id;return n.jsx(Ac,{$isActive:T,"data-testid":`config-item-${N.id}`,children:Q?n.jsxs(Wc,{onSubmit:G=>{G.preventDefault(),q(N.id)},children:[n.jsx(Oc,{type:"text",value:O,onChange:G=>x(G.target.value),autoFocus:!0,"aria-label":"Rename input"}),n.jsx(Fo,{type:"submit","aria-label":"Save name",children:n.jsx("span",{className:"material-symbols-outlined",children:"check"})}),n.jsx(Fo,{type:"button",onClick:()=>A(null),"aria-label":"Cancel rename",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}):n.jsxs(n.Fragment,{children:[n.jsxs(Nc,{onClick:()=>F(N.id),$isActive:T,title:N.name,children:[n.jsx("span",{className:"material-symbols-outlined",children:"description"}),n.jsx("span",{className:"config-title-text",children:N.name})]}),n.jsxs(Uc,{$isActive:T,children:[n.jsx(Bt,{onClick:()=>D(N.id,N.name),"aria-label":`Rename configuration ${N.name}`,children:n.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),n.jsx(Bt,{onClick:()=>J(N.id),"aria-label":`Duplicate configuration ${N.name}`,children:n.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),n.jsx(Bt,{onClick:()=>ne(N.id,N.name),"aria-label":`Delete configuration ${N.name}`,children:n.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})},N.id)}),E.length===0&&n.jsx(Fc,{children:"No configurations found"})]})]}),n.jsx(Mc,{children:n.jsxs(Bc,{children:[n.jsxs(Mo,{onClick:()=>{window.open("https://docs.ergogen.xyz/","_blank","noopener,noreferrer")},"aria-label":"Open documentation","data-testid":"side-nav-docs-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"description"}),n.jsx("span",{children:"Docs"})]}),n.jsx(Mo,{onClick:()=>{window.open("https://discord.ergogen.xyz","_blank","noopener,noreferrer")},"aria-label":"Join the Discord community","data-testid":"side-nav-discord-button",children:n.jsx(cc,{})}),n.jsx(Oo,{label:"Web UI",version:k,url:"https://github.com/ceoloide/ergogen-gui","data-testid":"side-nav-gui-version-button"}),n.jsx(Oo,{label:"Ergogen",version:B.displayText,url:B.url,isCustom:B.isCustom,"data-testid":"side-nav-ergogen-version-button",devBadgeTestId:"side-nav-ergogen-dev-badge"})]})})]})]})},bc=u.div`
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
`,wc=u.div`
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
`,xc=u.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 3em;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
`,yc=u.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`,kc=u(er)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,_c=u.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,vc=u.div`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  cursor: pointer;
  display: flex;
  align-items: center;
`,jc=u.button`
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
`,$c=u.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`,Cc=u.div`
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
  flex-shrink: 0;
`,Sc=u.button`
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
`,Ec=u.button`
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
`,Pc=u.div`
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
`,Ic=u.input`
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
`,Lc=u.button`
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
`,zc=u.div`
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
`,Rc=u.span`
  background-color: ${r.colors.border};
  color: ${r.colors.white};
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: ${r.fontWeights.semiBold};
`,Dc=u.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  flex: 1;
`,Ac=u.div`
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
`,Nc=u.button`
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
`,Uc=u.div.attrs({className:"item-actions-hover"})`
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
`,Wc=u.form`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 100%;
`,Oc=u.input`
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
`,Fo=u.button`
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
`,Fc=u.div`
  text-align: center;
  color: ${r.colors.textDark};
  font-size: ${r.fontSizes.bodySmall};
  margin-top: 2rem;
  font-style: italic;
`,Mc=u.div`
  padding: 8px 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`,Bc=u.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  width: 100%;
`,Mo=u.button`
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
`,Tc=u.div`
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
`,Er=3e4,Gc=e=>{try{const t=JSON.parse(e);if(t&&typeof t=="object")return t}catch{try{const t=fe.load(e);if(t&&typeof t=="object")return t}catch{return e}}return e},Vc=(e,t,i,o,s)=>new Promise((a,l)=>{if(s()){l(new Error("Aborted"));return}const c=cn();if(!c){l(new Error("Failed to create Ergogen worker"));return}o.add(c);const f=()=>{clearTimeout(d),c.terminate(),o.delete(c)},d=setTimeout(()=>{f(),l(new Error("Compilation timed out"))},Er);c.onmessage=m=>{const b=m.data;b.type==="error"?(f(),l(new Error(b.error))):b.type==="success"&&(f(),a(b.results))},c.onerror=m=>{f(),l(m)};const g={type:"generate",inputConfig:Gc(e),injectionInput:t,requestId:`export-compile-${Date.now()}`,options:{debug:i}};c.postMessage(g)}),Hc=(e,t,i)=>new Promise(o=>{if(i()||!e.cases||Object.keys(e.cases).length===0){o(e);return}const s=or();if(!s){o(e);return}t.add(s);const a=()=>{clearTimeout(l),s.terminate(),t.delete(s)},l=setTimeout(()=>{a(),o(e)},Er);s.onmessage=c=>{const f=c.data;f.type==="success"?(a(),o(f.results)):f.type==="error"&&(a(),o(e))},s.onerror=()=>{a(),o(e)},s.postMessage({type:"batch_jscad_to_stl",results:e,configVersion:0})}),Kc=async(e,t,i,o,s,a,l)=>{const c=new ln,f=new Set;if(s){for(let P=0;P<e.length;P++){if(l())return;const L=e[P];a(P,e.length,L.name);const I=$o(f,L.name);c.file(`${I}.yaml`,L.config)}if(t&&t.length>0){if(l())return;tn(c,t)}return l()?void 0:(a(e.length,e.length,"Creating ZIP..."),await nn(c,"ergogen-config-all"),{succeededCount:e.length,failedCount:0})}const d=mr(t),g=e.map(P=>({configRecord:P,folderName:$o(f,P.name)})),m=new Set,b=new Set;let k=0,w=0,h=0;const _=Math.min(4,navigator.hardwareConcurrency||2),C=async({configRecord:P,folderName:L})=>{if(l())return;b.add(P.name),a(k,e.length,Array.from(b).join(", "));const I=c.folder(L);if(!I){b.delete(P.name),k++,a(k,e.length,Array.from(b).join(", "));return}try{const j=await Vc(P.config,d,i,m,l);let W=j;if(o&&j.cases&&Object.keys(j.cases).length>0&&(W=await Hc(j,m,l)),l())return;I.file("config.yaml",P.config);const R=I.folder("outputs");R&&$r(R,P.config,W,i,o),t&&t.length>0&&tn(I,t),w++}catch(j){h++,console.error(`Failed to compile config ${P.name}:`,j),I.file("config.yaml",P.config),I.file("error.txt",`Compilation failed: ${j instanceof Error?j.message:String(j)}`)}finally{b.delete(P.name),k++,a(k,e.length,Array.from(b).join(", "))}};try{const P=[...g],L=[],I=async()=>{if(l()||P.length===0)return;const j=P.shift();await C(j),await I()};for(let j=0;j<Math.min(_,P.length);j++)L.push(I());if(await Promise.all(L),l()){m.forEach(j=>j.terminate()),m.clear();return}return a(e.length,e.length,"Creating ZIP..."),await nn(c,"ergogen-export-all"),{succeededCount:w,failedCount:h}}finally{m.forEach(P=>P.terminate()),m.clear()}},qc=({isOpen:e,configs:t,injections:i,debug:o,stlPreview:s,onClose:a,"data-testid":l})=>{const[c,f]=p.useState(new Set),[d,g]=p.useState(!0),[m,b]=p.useState(!1),[k,w]=p.useState(0),[h,_]=p.useState(""),C=p.useRef(!1);if(p.useEffect(()=>{e&&(f(new Set(t.map(R=>R.id))),b(!1),w(0),_(""),C.current=!1)},[e,t]),!e)return null;const P=R=>{f(R?new Set(t.map(A=>A.id)):new Set)},L=(R,A)=>{const O=new Set(c);A?O.add(R):O.delete(R),f(O)},I=async()=>{if(c.size===0)return;b(!0),w(0),_(""),C.current=!1;const R=t.filter(A=>c.has(A.id));M("bulk_download_started",{selected_configs_count:c.size,only_configs:d});try{const A=await Kc(R,i,o,s,d,(O,x,E)=>{w(O),_(E)},()=>C.current);C.current||(A&&A.succeededCount===0&&A.failedCount>0?M("bulk_download_failed",{selected_configs_count:c.size,failed_configs_count:A.failedCount,only_configs:d,error_message:`All ${A.failedCount} selected configuration(s) failed to compile`}):A&&A.failedCount>0?M("bulk_download_partial",{selected_configs_count:c.size,failed_configs_count:A.failedCount,only_configs:d}):M("bulk_download_completed",{selected_configs_count:c.size,only_configs:d}))}catch(A){console.error("Error during bulk download:",A),M("bulk_download_failed",{selected_configs_count:c.size,only_configs:d,error_message:A instanceof Error?A.message:String(A)})}finally{C.current||a()}},j=()=>{m&&!C.current&&M("bulk_download_cancelled",{selected_configs_count:c.size,completed_configs_count:k,only_configs:d}),C.current=!0,a()},W=c.size>0?k/c.size*100:0;return n.jsx(Jc,{"data-testid":l,children:n.jsxs(Xc,{"data-testid":l&&`${l}-box`,children:[n.jsx(Yc,{children:"Download Configurations"}),m?n.jsxs(n.Fragment,{children:[n.jsxs(ud,{children:[n.jsx(pd,{children:n.jsx(fd,{style:{width:`${W}%`}})}),n.jsxs(hd,{children:[n.jsx(gd,{children:h?h.includes(", ")?n.jsxs("div",{children:["Generating:",n.jsx(md,{children:h.split(", ").map(R=>n.jsx("li",{children:R},R))})]}):n.jsxs(Go,{children:["Generating ",h]}):n.jsx(Go,{children:"Preparing..."})}),n.jsxs(bd,{children:[k," / ",c.size]})]})]}),n.jsx(To,{children:n.jsx(wd,{onClick:j,size:"medium",children:"Cancel"})})]}):n.jsxs(n.Fragment,{children:[n.jsx(Qc,{children:t.map(R=>{const A=c.has(R.id);return n.jsx(ed,{children:n.jsxs(Pr,{htmlFor:`bulk-check-${R.id}`,children:[n.jsx(nd,{id:`bulk-check-${R.id}`,checked:A,onChange:O=>L(R.id,O.target.checked)}),n.jsx(od,{$checked:A}),n.jsx(td,{children:R.name})]})},R.id)})}),n.jsxs(Zc,{children:[n.jsx(Bo,{onClick:()=>P(!0),children:"Select All"}),n.jsx(Bo,{onClick:()=>P(!1),children:"Deselect All"})]}),n.jsxs(rd,{children:[n.jsx(id,{children:"Only download configs"}),n.jsxs(sd,{$checked:d,htmlFor:"only-configs-switch",children:[n.jsx(ad,{type:"checkbox",id:"only-configs-switch",checked:d,onChange:R=>g(R.target.checked)}),n.jsx(ld,{$checked:d}),n.jsx(cd,{$checked:d})]})]}),!d&&n.jsxs(dd,{children:[n.jsx("span",{className:"material-symbols-outlined",children:"warning"}),n.jsx("span",{children:"Warning: Exporting generated outputs for multiple configurations may take a long time depending on the number of selected configurations, their complexity, and CPU speed."})]}),n.jsxs(To,{children:[n.jsx(Ir,{onClick:j,size:"medium",children:"Cancel"}),n.jsxs(pe,{onClick:I,disabled:c.size===0,size:"medium",children:["Download (",c.size,")"]})]})]})]})})},Jc=u.div`
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
`,Xc=u.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,Yc=u.h2`
  margin: 0 0 1rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
`,Zc=u.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 1.5rem;
`,Bo=u.button`
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
`,Qc=u.div`
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
`,ed=u.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,td=u.span`
  color: ${r.colors.text};
  font-size: 13px;
  user-select: none;
`,Pr=u.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  padding: 4px 0;
`,nd=u.input.attrs({type:"checkbox"})`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`,od=u.div`
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

  ${Pr}:hover & {
    border-color: ${r.colors.accent};
  }
`,rd=u.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
`,id=u.span`
  color: ${r.colors.text};
  font-size: ${r.fontSizes.base};
  user-select: none;
`,sd=u.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: pointer;
`,ad=u.input`
  opacity: 0;
  width: 0;
  height: 0;
`,ld=u.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${e=>e.$checked?r.colors.accent:r.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`,cd=u.span`
  position: absolute;
  top: 2px;
  left: ${e=>e.$checked?"18px":"2px"};
  width: 16px;
  height: 16px;
  background-color: ${r.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,dd=u.div`
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
`,To=u.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: auto;
`,ud=u.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`,pd=u.div`
  background-color: ${r.colors.border};
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  width: 100%;
`,fd=u.div`
  background-color: ${r.colors.accent};
  height: 100%;
  transition: width 0.15s ease-out;
`,hd=u.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`,gd=u.div`
  color: ${r.colors.text};
  max-width: 80%;
`,Go=u.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,md=u.ul`
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
`,bd=u.span`
  color: ${r.colors.textDark};
  font-weight: ${r.fontWeights.semiBold};
`,Ir=u(pe)`
  background-color: ${r.colors.backgroundLighter};
  color: ${r.colors.textDark};

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`,wd=u(Ir)`
  width: 100%;
`;function xd(){return!!(window.location.hostname==="localhost"||window.location.hostname==="[::1]"||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))}function yd(e,t,i){e.addEventListener("statechange",()=>{var o,s;e.state==="installed"&&(navigator.serviceWorker.controller?(console.log("[SW] New content is available. Will be used when all existing tabs are closed or you reload."),(o=i==null?void 0:i.onUpdate)==null||o.call(i,t)):(console.log("[SW] Content is cached for offline use."),(s=i==null?void 0:i.onSuccess)==null||s.call(i,t)))})}async function Lr(e,t){var i;try{const o=await navigator.serviceWorker.register(e);let s=null;const a=l=>{l===null||l===s||(s=l,yd(l,o,t))};o.addEventListener("updatefound",()=>a(o.installing)),o.waiting&&navigator.serviceWorker.controller?(i=t==null?void 0:t.onUpdate)==null||i.call(t,o):a(o.installing)}catch(o){console.error("[SW] Error during service worker registration:",o)}}async function kd(e,t){try{const i=await fetch(e,{headers:{"Service-Worker":"script"}}),o=i.headers.get("content-type");i.status===404||o!==null&&o.indexOf("javascript")===-1?(await(await navigator.serviceWorker.ready).unregister(),window.location.reload()):await Lr(e,t)}catch{console.log("[SW] No internet connection found. App is running in offline mode.")}}function _d(e){!("serviceWorker"in navigator)||new URL("/",window.location.href).origin!==window.location.origin||window.addEventListener("load",()=>{const i="/service-worker.js";xd()?(kd(i,e),navigator.serviceWorker.ready.then(()=>{console.log("[SW] This web app is being served cache-first by a service worker. See https://cra.link/PWA for more details.")})):Lr(i,e)})}const vd=({report:e,onAccept:t,onCancel:i,"data-testid":o})=>n.jsx(jd,{"data-testid":o,children:n.jsxs($d,{"data-testid":o&&`${o}-box`,children:[n.jsx(Cd,{children:"Version Compatibility Warning"}),n.jsx(Sd,{children:"The shared link was created under a different environment. You may experience compatibility issues."}),n.jsxs(Ed,{children:[e.guiWarning&&n.jsxs(Tt,{"data-testid":o&&`${o}-gui-warning`,children:[n.jsxs(Gt,{children:["GUI Version Mismatch",n.jsx(Vt,{"data-testid":"gui-mismatch-badge",children:"Mismatch"})]}),n.jsxs(Ht,{children:["The shared link was created with a newer version of the GUI (",n.jsxs("strong",{children:["v",e.guiWarning.shared]}),") than your current version (",n.jsxs("strong",{children:["v",e.guiWarning.current]}),"). Some interface options or features may not function as expected."]})]}),e.ergogenWarning&&n.jsxs(Tt,{"data-testid":o&&`${o}-ergogen-warning`,children:[n.jsxs(Gt,{children:["Ergogen Version Mismatch",n.jsx(Vt,{"data-testid":"ergogen-mismatch-badge",children:"Mismatch"})]}),n.jsxs(Ht,{children:["The shared link was created with a newer version of Ergogen (",n.jsx("strong",{children:e.ergogenWarning.shared}),") than your current version (",n.jsx("strong",{children:e.ergogenWarning.current}),"). Some features or syntax might not be supported."]})]}),e.customErgogenWarning&&n.jsxs(Tt,{"data-testid":o&&`${o}-custom-ergogen-warning`,children:[n.jsxs(Gt,{children:["Custom Ergogen Version Used",n.jsx(Vt,{"data-testid":"custom-version-badge",children:"Custom"})]}),n.jsxs(Ht,{children:["The shared link was created using a custom version of Ergogen:"," ",n.jsx("strong",{children:e.customErgogenWarning.shared}),".",n.jsx("br",{}),"You can investigate the repository used here:",n.jsx("br",{}),n.jsx(Pd,{href:e.customErgogenWarning.url,target:"_blank",rel:"noopener noreferrer","data-testid":o&&`${o}-custom-repo-link`,children:e.customErgogenWarning.label})]})]})]}),n.jsxs(Id,{children:[n.jsx(zd,{onClick:i,size:"medium","data-testid":o&&`${o}-cancel`,"aria-label":"Cancel configuration loading",children:"Cancel"}),n.jsx(Ld,{onClick:t,size:"medium","data-testid":o&&`${o}-accept`,"aria-label":"Accept and load configuration",children:"Accept and Load"})]})]})}),jd=u.div`
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
`,$d=u.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 550px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,Cd=u.h2`
  margin: 0 0 0.5rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.error};
`,Sd=u.p`
  margin: 0 0 1.5rem 0;
  font-size: ${r.fontSizes.base};
  color: ${r.colors.textDarker};
  line-height: 1.4;
`,Ed=u.div`
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
`,Pd=u.a`
  display: inline-block;
  margin-top: 0.5rem;
  color: ${r.colors.accent};
  text-decoration: underline;
  word-break: break-all;

  &:hover {
    color: ${r.colors.accentSecondary};
  }
`,Id=u.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`,Ld=u(pe)`
  background-color: ${r.colors.accent};
  color: ${r.colors.white};

  &:hover {
    background-color: ${r.colors.accentDark};
  }
`,zd=u(pe)`
  background-color: ${r.colors.backgroundLighter};
  color: ${r.colors.textDark};

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`;let Vo=null,Ho=!1;const Rd=()=>{Ho||(Vo=_r(),Ho=!0);const e=Vo,t=[];let i=null;const o=p.useRef(null);if(e)if(e.success){const l=e.config;o.current===null&&(o.current={config:l.config,injections:l.injections,guiVersion:l.guiVersion,ergogenVersion:l.ergogenVersion}),window.history.replaceState(null,"",window.location.pathname+window.location.search)}else i=e.message,console.error("[App] Failed to load shared configuration from hash",{error:e.error,message:e.message,hashLength:window.location.hash.length}),window.history.replaceState(null,"",window.location.pathname+window.location.search);const[s,a]=p.useState(null);return p.useEffect(()=>{o.current&&a(o.current)},[]),n.jsx(Xi,{initialInjectionInput:t,hashError:i,children:n.jsx(Nd,{pendingSharedConfig:s})})};function Dd(){const[e,t]=p.useState(null),i=new URLSearchParams(window.location.search).has("force_update");if(p.useEffect(()=>{_d({onUpdate:o=>{t(o)}})},[]),i)return()=>{console.log("[SW] Force-update triggered via ?force_update URL parameter."),window.location.reload()};if(e)return()=>{let o;if("serviceWorker"in navigator){let a=!1;navigator.serviceWorker.addEventListener("controllerchange",()=>{a||(a=!0,o&&clearTimeout(o),window.location.reload())})}const s=e.waiting;s?(s.postMessage({type:"SKIP_WAITING"}),o=setTimeout(()=>{window.location.reload()},1e3)):window.location.reload()}}function Ad(){const[e,t]=p.useState(null),[i,o]=p.useState(!1),[s,a]=p.useState(!1),l=new URLSearchParams(window.location.search).has("force_install");return p.useEffect(()=>{(()=>{const b=typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches,k=window.navigator.standalone===!0;a(b||k)})();const g=b=>{b.preventDefault(),t(b),console.log("[PWA] beforeinstallprompt event fired and captured.")},m=()=>{console.log("[PWA] appinstalled event fired."),a(!0),o(!1)};return window.addEventListener("beforeinstallprompt",g),window.addEventListener("appinstalled",m),()=>{window.removeEventListener("beforeinstallprompt",g),window.removeEventListener("appinstalled",m)}},[]),{onInstall:()=>{M("pwa_install_click"),o(!0),e?(e.prompt(),e.userChoice.then(d=>{d.outcome==="accepted"?(console.log("[PWA] User accepted the install prompt"),M("pwa_install_accepted"),a(!0)):(console.log("[PWA] User dismissed the install prompt"),M("pwa_install_dismissed")),o(!1),t(null)})):(console.log("[PWA] Install prompt triggered (deferredPrompt is not available on this device/browser)"),alert('PWA installation is not supported by this browser or is restricted on this device. If you are on iOS/iPadOS, please open this site in Safari and select "Add to Home Screen" from the Share menu.'),o(!1))},isAvailable:!!e||l,isInstalled:s,isInstalling:i}}const Nd=({pendingSharedConfig:e})=>{var L;const t=ve(),i=t==null?void 0:t.configInput,o=Qo(),s=Dd(),a=Ad(),l=p.useRef(0);l.current=((L=t==null?void 0:t.configs)==null?void 0:L.length)||0,p.useEffect(()=>{M("page_view",{page_path:o.pathname,stored_configs_count:l.current})},[o.pathname]);const c=p.useRef(!1),f=p.useRef(e);e!==f.current&&(f.current=e);const{currentConflict:d,processInjectionsWithConflictResolution:g,handleConflictResolution:m,handleConflictCancel:b}=_t({setInjectionInput:I=>t==null?void 0:t.setInjectionInput(I),setConfigInput:I=>t==null?void 0:t.loadPreview(I),generateNow:async(I,j,W)=>{t&&await t.generateNow(I,j,W)},getCurrentInjections:()=>(t==null?void 0:t.injectionInput)||[],onComplete:async(I,j)=>{localStorage.setItem("ergogen:injection",JSON.stringify(j)),t==null||t.loadPreview(I)},setError:I=>t==null?void 0:t.setError(I)}),[k,w]=p.useState(null),h=(I,j)=>{const W=yt.version,R=pn("github:ceoloide/ergogen#v4.3.0");let A=!0,O,x,E;if(I){const $=Ue(W),U=Ue(I);$&&U&&!Kt($,U)&&(A=!1,O={current:W,shared:I})}if(j){if(ei(j)&&j!==R){A=!1;const F=un(j);E={shared:j,url:F.url,label:F.label}}const $=so(R)||Je(),U=so(j);if(U){const F=Ue($),D=Ue(U);F&&D&&!Kt(F,D)&&(A=!1,x={current:$,shared:U})}}return{isCompatible:A,guiWarning:O,ergogenWarning:x,customErgogenWarning:E}},_=p.useCallback((I,j)=>{t&&(j!==void 0&&j.length>0?g(j,I).catch(W=>{console.error("[App] Error processing injections:",W),t.setError(`Failed to process injections: ${W instanceof Error?W.message:"Unknown error"}`)}):(t.loadPreview(I),t.generateNow(I,t.injectionInput,{pointsonly:!1})))},[t,g]),C=()=>{var I;k&&(M("shared_config_accepted",{has_injections:!!(k.injections&&k.injections.length>0),injections_count:((I=k.injections)==null?void 0:I.length)||0}),_(k.config,k.injections),w(null))},P=()=>{var I;k&&M("shared_config_declined",{has_injections:!!(k.injections&&k.injections.length>0),injections_count:((I=k.injections)==null?void 0:I.length)||0}),w(null)};return p.useEffect(()=>{if(!t||!e||c.current)return;c.current=!0;const I=h(e.guiVersion,e.ergogenVersion);I.isCompatible?_(e.config,e.injections):w({config:e.config,injections:e.injections,report:I})},[t,e,_]),p.useEffect(()=>{if(!t)return;const I=()=>{const j=_r();if(j)if(j.success){const W=j.config,R=h(W.guiVersion,W.ergogenVersion);R.isCompatible?_(W.config,W.injections):w({config:W.config,injections:W.injections,report:R}),window.history.replaceState(null,"",window.location.pathname+window.location.search)}else console.error("[App] Failed to load shared configuration from hash (hashchange)",{error:j.error,message:j.message,hashLength:window.location.hash.length}),t.setError(j.message),window.history.replaceState(null,"",window.location.pathname+window.location.search)};return window.addEventListener("hashchange",I),()=>{window.removeEventListener("hashchange",I)}},[t,_]),n.jsxs(n.Fragment,{children:[k&&n.jsx(vd,{report:k.report,onAccept:C,onCancel:P,"data-testid":"share-compatibility-dialog"}),d&&n.jsx(wt,{injectionName:d.name,injectionType:d.type,onResolve:m,onCancel:b,"data-testid":"conflict-dialog"}),(t==null?void 0:t.isBulkDownloadOpen)&&n.jsx(qc,{isOpen:t.isBulkDownloadOpen,configs:t.configs,injections:t.injectionInput,debug:t.debug,stlPreview:t.stlPreview,onClose:()=>t.setIsBulkDownloadOpen(!1),"data-testid":"bulk-download-dialog"}),n.jsx(Zl,{onUpdate:s}),n.jsx(sc,{visible:(t==null?void 0:t.isGenerating)??!1,"data-testid":"loading-bar"}),n.jsx(lc,{}),n.jsx(mc,{isOpen:(t==null?void 0:t.showSideNav)??!1,onClose:()=>t==null?void 0:t.setShowSideNav(!1),"data-testid":"side-navigation"}),n.jsx(Ud,{children:n.jsxs(Gr,{children:[n.jsx(Pt,{path:"/",element:i?n.jsx(Ba,{pwaState:a}):n.jsx(io,{to:{pathname:"/new",search:o.search},replace:!0})}),n.jsx(Pt,{path:"/new",element:n.jsx(Ll,{})}),n.jsx(Pt,{path:"*",element:n.jsx(io,{to:"/",replace:!0})})]})}),(t==null?void 0:t.currentConflict)&&n.jsx(wt,{injectionName:t.currentConflict.name,injectionType:t.currentConflict.type,onResolve:t.handleConflictResolution,onCancel:t.handleConflictCancel,"data-testid":"conflict-resolution-dialog"})]})},Ud=u.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;let Ko=!1;const Wd=e=>{Ko||(e.editor.defineTheme("ergogen-theme",{base:"vs-dark",inherit:!0,rules:[],colors:{"editor.background":r.colors.backgroundLight}}),Ko=!0)};lr();const Od=u.div`
  display: flex;
  flex-direction: column;
  color: #ffffff;
  height: 100%;
  width: 100%;
  font-family: 'Roboto', sans-serif;
`,Fd=Vr`
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
`;tr.config({paths:{vs:"/monaco/vs"}});tr.init().then(e=>{Wd(e);const t=document.getElementById("root");Hr(t).render(n.jsx(Zo.StrictMode,{children:n.jsx(Kr,{basename:("/".startsWith("."),"/"),children:n.jsxs(Od,{children:[n.jsx(Fd,{}),n.jsx(Rd,{})]})})}))});export{gt as a,r as t};
