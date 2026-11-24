const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/PcbPreview-BI1R2Mfv.js","assets/vendor-DNe9Y6n2.js","assets/StlPreview-C8ErO2qZ.js","assets/three-Dk8hj5rH.js","assets/js-yaml-DW8Bub87.js","assets/jszip-CyTxqeGV.js"])))=>i.map(i=>d[i]);
import{f as qe,r as p,h as no,i as Ho,j as n,k as qo,y as u,O as wt,p as Ko,l as Nr,m as Ur,n as Jo,o as Xo,q as Wr,t as Or,v as sn,w as Yo,L as Zo,x as Fr,z as Et,N as oo,A as Mr,B as Qo,e as Br,C as Tr}from"./vendor-DNe9Y6n2.js";import{j as fe}from"./js-yaml-DW8Bub87.js";import{J as an}from"./jszip-CyTxqeGV.js";import{_ as er}from"./three-Dk8hj5rH.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&o(l)}).observe(document,{childList:!0,subtree:!0});function i(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(s){if(s.ep)return;s.ep=!0;const a=i(s);fetch(s.href,a)}})();const ln=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/ergogen.worker-yOrnwBol.js",import.meta.url),{type:"module"})}catch(e){return console.error("Failed to create worker:",e),null}},tr=()=>{if(typeof window>"u"||!("Worker"in window))return null;try{return new Worker(new URL("/assets/jscad.worker-C8nLBdOi.js",import.meta.url),{type:"module"})}catch(e){return console.error("Failed to create JSCAD worker:",e),null}},Gr="0.19.3",xt={version:Gr},cn=e=>{const t=`v${qe.version}`,i=qe.version,o=qe.repository,s=o.startsWith("github:")?o.replace("github:","https://github.com/"):o.replace(/^git\+/,"").replace(/\.git$/,"");if(!e)return{label:t,url:s,displayText:i,isCustom:!1,isHash:!1,isTag:!1};if(e.includes("@")){const S=e.split("@"),w=S[1]||e;return{label:e,url:e.startsWith("ergogen@")?`${s}/releases/tag/v${w}`:`https://www.npmjs.com/package/${S[0]}`,displayText:w,isCustom:!0,isHash:!1,isTag:!0}}const a=e.startsWith("github:")?e.slice(7):e,[l,d]=a.split("#"),h=l==="ergogen/ergogen",c=`https://github.com/${l}`;if(h){if(!d)return{label:"latest",url:c,displayText:i,isCustom:!1,isHash:!1,isTag:!1};const S=d.length===40&&/^[0-9a-fA-F]{40}$/.test(d),w=S?t:d,f=S?`${c}/commit/${d}`:`${c}/tree/${d}`;return{label:d,url:f,displayText:w,isCustom:!0,isHash:S,isTag:!S}}if(!d)return{label:a,url:c,displayText:i,isCustom:!0,isHash:!1,isTag:!1};const m=d.length===40&&/^[0-9a-fA-F]{40}$/.test(d),b=m?t:d,g=m?`${c}/commit/${d}`:`${c}/tree/${d}`;return{label:a,url:g,displayText:b,isCustom:!0,isHash:m,isTag:!m}},dn=e=>{if(e.includes("@")){const s=e.split("@"),a=s[1]||e,l=s[0];return`github:${l==="ergogen"?"ergogen/ergogen":l}#v${a}`}const t=e.startsWith("github:")?e.slice(7):e,[i,o]=t.split("#");return o?`github:${i}#${o}`:`github:${i}#v${qe.version}`},Ue=e=>{const i=e.replace(/^v/,"").match(/^(\d+)\.(\d+)\.(\d+)/);return i?[Number(i[1]),Number(i[2]),Number(i[3])]:null},Ht=(e,t)=>{for(let i=0;i<3;i++){if(e[i]>t[i])return!0;if(e[i]<t[i])return!1}return!0},ro=e=>{const t=e.match(/(?:^|#|@|v)(\d+\.\d+\.\d+)/);return t?t[1]:null},Vr=e=>{const t=e.startsWith("github:")?e.slice(7):e,[i]=t.split("#");return!e.startsWith("github:")&&!e.includes("/")?!1:i!=="ergogen/ergogen"},nr=()=>{if(typeof window>"u")return!1;const e=window.navigator;return typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches||e.standalone===!0},or=e=>{if(typeof window>"u")return!0;if(window.__FORCE_ANALYTICS__===!0||e.startsWith("G-TEST"))return!1;const t=window.location.hostname;return!!(t==="localhost"||t==="127.0.0.1"||t==="[::1]"||t.endsWith(".localhost"))},Hr=()=>{if(typeof document>"u"||!document.cookie)return;const e=document.cookie.split(";");for(const t of e){const i=t.indexOf("="),o=(i>-1?t.substring(0,i):t).trim();if(o.startsWith("_ga")){document.cookie=`${o}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`;const a=window.location.hostname.split(".");for(;a.length>0;){const l=a.join(".");document.cookie=`${o}=; Path=/; Domain=.${l}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`,document.cookie=`${o}=; Path=/; Domain=${l}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`,a.shift()}}}},qr=()=>{if(!(typeof indexedDB>"u"))try{indexedDB.deleteDatabase("workbox-background-sync")}catch{}},rr=()=>typeof window>"u"||!window.location?void 0:`${window.location.origin&&window.location.origin!=="null"?window.location.origin:`${window.location.protocol||"https:"}//${window.location.hostname||"localhost"}`}${window.location.pathname||"/"}`,ir="ergogen:consent:sendUsageMetrics",Kr="ergogen:config:sendUsageMetrics",Jr="ergogen:settings";let ft;const io=e=>{const t=localStorage.getItem(e);if(t!==null)try{const i=JSON.parse(t);return typeof i=="boolean"?i:void 0}catch{return}},Xr=()=>{const e=localStorage.getItem(Jr);if(e!==null)try{const t=JSON.parse(e);return t&&typeof t=="object"&&typeof t.sendUsageMetrics=="boolean"?t.sendUsageMetrics:void 0}catch{return}},yt=()=>{if(typeof window>"u")return!1;if(ft!==void 0)return ft;try{const e=io(ir);if(e!==void 0)return e;if(io(Kr)===!1||Xr()===!1)return!1}catch{return!1}return!nr()},Yr=e=>{try{localStorage.setItem(ir,JSON.stringify(e)),ft=void 0}catch{ft=e}};let Ge=!1;const sr=()=>{var s;if(typeof window>"u")return;const e=yt(),t="G-46F2L343EK",i=or(t),o=document.getElementById("gtag-script");if(o||(Ge=!1),e&&t&&!i){delete window["ga-disable-"+t];const a=window,l={send_page_view:!1,allow_google_signals:!1,allow_ad_personalization_signals:!1},d=()=>{var h;return(h=a.gtag)==null?void 0:h.call(a,"set",{page_location:rr()})};if(o)Ge&&(d(),(s=a.gtag)==null||s.call(a,"config",t,l),Ge=!1);else{const h=document.createElement("script");h.async=!0,h.src=`https://www.googletagmanager.com/gtag/js?id=${t}`,h.id="gtag-script",document.head.appendChild(h);const c=a.dataLayer||[];a.dataLayer=c,a.gtag=function(){c.push(arguments)},a.gtag("js",new Date),d(),a.gtag("config",t,l),Ge=!1}ii()}else window["ga-disable-"+t]=!0,o&&(Ge=!0),Hr(),qr(),si()},Zr=new Set(["yaml","yml","json","zip","ekb"]),Qr=e=>{const t=e.lastIndexOf("."),i=t>=0?e.slice(t+1).toLowerCase():"";return Zr.has(i)?i:"other"},ar=100,ei=/"[^"\n]*"|'[^'\n]*'|`[^`\n]*`/g,ti=/^at\s|^[^\s@]*@\S+:\d+:\d+$/,ni=e=>e.split(`
`)[0].replace(ei,t=>`${t[0]}*${t[0]}`).trim().slice(0,ar),oi=e=>{const t=e.split(`
`).map(i=>i.trim()).filter(i=>ti.test(i));return t.length>0?t.join(" ").slice(0,ar):void 0},ri=e=>{const t={...e};for(const i of["error_message","description"]){const o=t[i];typeof o=="string"&&(t[i]=ni(o))}return typeof t.error_stack=="string"&&(t.error_stack=oi(t.error_stack)),t},M=(e,t)=>{if(yt()&&!or("G-46F2L343EK")&&window.gtag){const o=rr();window.gtag("set",{page_location:o}),window.gtag("event",e,{page_location:o,gui_version:xt.version,ergogen_version:dn("github:ceoloide/ergogen#v4.3.0"),is_pwa:nr(),...ri(t??{})})}},ht=(e,t=!1,i)=>{const o=e instanceof Error?e.message:e,s=e instanceof Error?e.stack:void 0;M("exception",{description:i?`[${i}] ${o}`:o,fatal:t,error_stack:s})};let gt=!1;const lr=e=>{ht(e.error||e.message,!1,"unhandled_error")},cr=e=>{ht(e.reason||"Unhandled Promise Rejection",!1,"unhandled_rejection")},ii=()=>{typeof window>"u"||gt||(window.addEventListener("error",lr),window.addEventListener("unhandledrejection",cr),gt=!0)},si=()=>{typeof window>"u"||gt&&(window.removeEventListener("error",lr),window.removeEventListener("unhandledrejection",cr),gt=!1)};function ai(e){function t(c,m){return c>>>m|c<<32-m}const i=[],o=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],s=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],a=unescape(encodeURIComponent(e));for(let c=0;c<a.length;c++){const m=a.charCodeAt(c);i[c>>2]|=m<<24-c%4*8}const l=a.length;i[l>>2]|=128<<24-l%4*8;const d=(l+8>>6)+1;i[d*16-1]=l*8;for(let c=0;c<d;c++){const m=[];for(let L=0;L<16;L++)m[L]=i[c*16+L]||0;for(let L=16;L<64;L++){const I=t(m[L-15],7)^t(m[L-15],18)^m[L-15]>>>3,v=t(m[L-2],17)^t(m[L-2],19)^m[L-2]>>>10;m[L]=m[L-16]+I+m[L-7]+v|0}let b=o[0],g=o[1],S=o[2],w=o[3],f=o[4],k=o[5],C=o[6],P=o[7];for(let L=0;L<64;L++){const I=t(f,6)^t(f,11)^t(f,25),v=f&k^~f&C,W=P+I+v+s[L]+m[L]|0,R=t(b,2)^t(b,13)^t(b,22),A=b&g^b&S^g&S,O=R+A|0;P=C,C=k,k=f,f=w+W|0,w=S,S=g,g=b,b=W+O|0}o[0]=o[0]+b|0,o[1]=o[1]+g|0,o[2]=o[2]+S|0,o[3]=o[3]+w|0,o[4]=o[4]+f|0,o[5]=o[5]+k|0,o[6]=o[6]+C|0,o[7]=o[7]+P|0}let h="";for(let c=0;c<8;c++){const m=o[c];h+=(m>>>24&255).toString(16).padStart(2,"0"),h+=(m>>>16&255).toString(16).padStart(2,"0"),h+=(m>>>8&255).toString(16).padStart(2,"0"),h+=(m&255).toString(16).padStart(2,"0")}return h}function qt(e,t){if(!e||typeof e!="object")return!1;const i=e;for(const o of t)if(i[o]===!0)return!0;for(const o of Object.keys(i))if(qt(i[o],t))return!0;return!1}const Pt=e=>Math.round((e+Number.EPSILON)*100)/100,so=e=>{if(!e||typeof e!="object")return;const t=e.meta;if(!t||typeof t!="object")return;const i=t.zone;if(i){if(typeof i=="object"&&i!==null)return i.name;if(typeof i=="string")return i}};function li(e,t,i,o){const s=fe.load(e)||{},a=fe.load(t)||{},l=s.outlines||{},d=Object.keys(l),h=d.filter(Z=>!Z.startsWith("_")).length,c=d.length,m=Object.keys(s.pcbs||{}).length,b=Object.keys(s.cases||{}).length,g=qt(s.pcbs,["reversible","reverse"]),S=qt(s.points,["mirror"]),w=s.meta||{},f=w.name??"no_name",k=w.author??"no_author",C=s.points||{},P=Object.keys(C.zones||{}).length,L=C.zones||{},v=Object.keys(L).filter(Z=>{const B=L[Z];return B&&typeof B=="object"&&("columns"in B||"rows"in B)}),W=v.length,R=W>0;let A="",O="",x="",E=0;const j=Object.keys(a);if(R){const Z=[...v].sort(),B=[],N=[],T=[];for(const Q of Z){const G=L[Q],y=Object.keys((G==null?void 0:G.columns)||{}),V=Object.keys((G==null?void 0:G.rows)||{}),H=(G==null?void 0:G.mirror)===!0||typeof(G==null?void 0:G.mirror)=="object"&&(G==null?void 0:G.mirror)!==null,ee=C.mirror===!0||typeof C.mirror=="object"&&C.mirror!==null,q=H||ee;let ie=j.filter(Oe=>{const he=a[Oe];if(so(he)!==Q)return!1;if(he&&typeof he=="object"){const ge=he.meta;if(ge&&typeof ge=="object"&&ge.mirrored===!0)return!1}return!Oe.startsWith("mirror_")}).length;q&&(ie*=2),B.push(y.length),N.push(V.length),T.push(ie),E+=ie}A=B.join(","),O=N.join(","),x=T.join(",")}const U=j.map(Z=>{const B=a[Z],N=so(B),Q=(N?v.includes(N):!1)?"K":"A",G=Pt((B==null?void 0:B.x)??0),y=Pt((B==null?void 0:B.y)??0),V=Pt((B==null?void 0:B.r)??0);return{name:Z,type:Q,x:G,y,r:V}});U.sort((Z,B)=>Z.x!==B.x?Z.x-B.x:Z.y!==B.y?Z.y-B.y:Z.r!==B.r?Z.r-B.r:Z.name.localeCompare(B.name));const F=U.map(Z=>`${Z.type}${Z.x.toString()};${Z.y.toString()};${Z.r.toString()}`).join("|"),D=`${f}|${k}|${F}`,J=ai(D).substring(0,12),ne=!S&&g?E*2:E;return{total_generation_time_ms:i,count_outlines:h,count_raw_outlines:c,count_pcbs:m,count_cases:b,is_reversible:g,is_mirrored:S,count_zones:P,matrix_zones:W,has_matrix:R,matrix_col_counts:A,matrix_row_counts:O,matrix_key_counts:x,matrix_keys:E,keyboard_keys:ne,config_id:J,previous_config_id:o}}const We=e=>Array.isArray(e)&&e.length===3&&typeof e[0]=="string"&&typeof e[1]=="string"&&typeof e[2]=="string",dr=(e,t,i)=>!i||i.length===0?{hasConflict:!1}:i.some(s=>We(s)&&s[0]===e&&s[1]===t)?{hasConflict:!0,conflictingName:t}:{hasConflict:!1},ci=(e,t)=>{if(!t||t.length===0)return[];const i=[];for(const o of e){if(!We(o))continue;const[s,a]=o,l=dr(s,a,t);l.hasConflict&&i.push({injection:o,conflict:l})}return i},ur=(e,t,i)=>{if(!i||i.length===0)return t;const o=new Set(i.filter(l=>We(l)&&l[0]===e).map(l=>l[1]));let s=1,a=`${t}_${s}`;for(;o.has(a);)s++,a=`${t}_${s}`;return a},It=(e,t,i)=>{const o=t?[...t]:[];for(const s of e){if(!We(s)){console.warn("[mergeInjectionArraysWithResolution] Skipping invalid injection format:",s);continue}const[a,l,d]=s;if(!dr(a,l,o).hasConflict)o.push([a,l,d]);else{if(i==="skip")continue;if(i==="overwrite"){const c=o.findIndex(m=>We(m)&&m[0]===a&&m[1]===l);c!==-1&&(o[c]=[a,l,d])}else if(i==="keep-both"){const c=ur(a,l,o);o.push([a,c,d])}}}return o},kt=e=>{const[t,i]=p.useState([]),o=t.length>0?t[0]:null,[s,a]=p.useState(null),[l,d]=p.useState(null),[h,c]=p.useState(null),m=p.useCallback(async(w,f,k=null,C)=>{var R,A,O;const P=C||e.getCurrentInjections();if(w.length===0){e.setInjectionInput(P),e.setConfigInput(f),await e.generateNow(f,P,{pointsonly:!1}),await((R=e.onComplete)==null?void 0:R.call(e,f,P));return}const L=w.filter(x=>We(x)?!0:(console.warn("[useInjectionConflictResolution] Skipping invalid injection format:",x),!1));if(L.length===0){e.setInjectionInput(P),e.setConfigInput(f),await e.generateNow(f,P,{pointsonly:!1}),await((A=e.onComplete)==null?void 0:A.call(e,f,P));return}const I=ci(L,P);if(I.length>0&&!k){const x=I.map(E=>({injection:E.injection,conflict:E.conflict}));M("conflict_encountered",{conflict_count:I.length}),i(x),a(L),d(f),c(P);return}const W=It(L,P,k||"skip");e.setInjectionInput(W),e.setConfigInput(f),await e.generateNow(f,W,{pointsonly:!1}),await((O=e.onComplete)==null?void 0:O.call(e,f,W))},[e]),b=p.useCallback(async(w,f)=>{var k,C;if(!(!s||!l||t.length===0))if(f){M("conflict_resolved",{strategy:w,apply_to_all:!0,remaining_count:t.length});const P=It(s,h||e.getCurrentInjections(),w);e.setInjectionInput(P),e.setConfigInput(l),await e.generateNow(l,P,{pointsonly:!1}),await((k=e.onComplete)==null?void 0:k.call(e,l,P)),i([]),a(null),d(null),c(null)}else{M("conflict_resolved",{strategy:w,apply_to_all:!1,remaining_count:t.length});const P=t[0],[L,I]=P.injection,v=P.injection,W=t.slice(1);i(W);let R=[...h||e.getCurrentInjections()],A=[...s||[]];if(w==="overwrite")R=R.filter(O=>!(O[0]===L&&O[1]===I));else if(w==="skip")A=A.filter(O=>!(O[0]===L&&O[1]===I&&O[2]===v[2]));else if(w==="keep-both"){const O=ur(L,I,R),x=[L,O,v[2]];R=[...R,x],A=A.filter(E=>!(E[0]===L&&E[1]===I&&E[2]===v[2]))}if(c(R),a(A),W.length===0){const O=It(A,R,"skip");e.setInjectionInput(O),e.setConfigInput(l),await e.generateNow(l,O,{pointsonly:!1}),await((C=e.onComplete)==null?void 0:C.call(e,l,O)),a(null),d(null),c(null)}}},[s,l,h,t,e]),g=p.useCallback(()=>{var w;M("conflict_cancelled",{remaining_count:t.length}),i([]),a(null),d(null),c(null),(w=e.setError)==null||w.call(e,"Loading cancelled by user")},[e,t.length]);return{currentConflict:p.useMemo(()=>o?{name:o.injection[1],type:o.injection[0]}:null,[o]),processInjectionsWithConflictResolution:m,handleConflictResolution:b,handleConflictCancel:g}},di={templates:"4.3.0",outlines:"4.3.0"},Je=()=>qe.version,ao=e=>{const t=e.split("-")[0].replace(/^v/,"").split(".");for(;t.length<3;)t.push("0");return t.length>3||!t.every(i=>/^\d+$/.test(i))?null:[Number(t[0]),Number(t[1]),Number(t[2])]},ui=(e,t)=>{const i=ao(e),o=ao(t);if(!i||!o)return!1;const[s,a,l]=i,[d,h,c]=o;return s===d&&(a>h||a===h&&l>=c)},pi=(e,t)=>{const i=Ue(t),o=Ue(di[e]);return i!==null&&o!==null?Ht(i,o):!1},fi=()=>({templates:"",outlines:""}),ce=e=>{if(typeof window<"u"&&window.location)try{const o=new URLSearchParams(window.location.search).get(`ff_${e}`);if(o==="true")return!0;if(o==="false")return!1}catch(i){console.warn("[FeatureFlags] Failed to check URL query parameters:",i)}const t=fi()[e];return t==="true"?!0:t==="false"?!1:pi(e,Je())},hi=50*1024*1024,gi=10*1024*1024,Lt=(e,t)=>{const i=`${t}/`;let o=e;return o.startsWith(i)&&(o=o.substring(i.length)),o=o.replace(/\.js$/,""),o},mi=e=>{let t=e.file("config.yaml")||e.file("config.yml");if(!t){const i=e.file(/^config\.(yaml|yml)$/i);i&&i.length>0&&(t=i[0])}if(!t)throw new Error("The archive is missing a config.yaml file in the root directory.");return t},Kt=(e,t)=>{if(t&&e>hi)throw new Error(`File exceeds the maximum size limit of 50MB for archives (current size: ${(e/(1024*1024)).toFixed(1)}MB).`);if(!t&&e>gi)throw new Error(`File exceeds the maximum size limit of 10MB for text files (current size: ${(e/(1024*1024)).toFixed(1)}MB).`)},pr=(e,t,i)=>{const o=[];return e.forEach(s=>o.push(["footprint",s.name,s.content])),t.forEach(s=>o.push(["outline",s.name,s.content])),i.forEach(s=>o.push(["template",s.name,s.content])),o},bi=async e=>{let t;try{t=await an.loadAsync(e)}catch{throw new Error("The file appears to be corrupted. Please verify the file and try again.")}const o=await mi(t).async("string"),s=[],a=[];return t.forEach((l,d)=>{if(!(d.dir||!l.endsWith(".js"))){if(l.startsWith("footprints/")){const h=d.async("string").then(c=>{const m=Lt(l,"footprints");s.push({type:"footprint",name:m,content:c})});a.push(h)}else if(l.startsWith("outlines/")&&ce("outlines")){const h=d.async("string").then(c=>{const m=Lt(l,"outlines");s.push({type:"outline",name:m,content:c})});a.push(h)}else if(l.startsWith("templates/")&&ce("templates")){const h=d.async("string").then(c=>{const m=Lt(l,"templates");s.push({type:"template",name:m,content:c})});a.push(h)}}}),await Promise.all(a),{config:o,injections:s}},wi=40,xi=3;class me extends Error{constructor(t){super(t),this.name="RateLimitError"}}class yi{constructor(){this.providers=[]}register(t){this.providers.push(t)}resolve(t){const i=t.trim();for(const o of this.providers)if(o.canHandle(i))return o;return/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(i)&&this.providers[0]||null}}const Xe=new yi,ki=e=>{const t=[],i=e.split(`
`);let o={};for(const s of i){const a=s.trim();if(a.startsWith("[submodule"))o.path&&o.url&&t.push({path:o.path,url:o.url}),o={};else{const l=a.indexOf("=");if(l!==-1){const d=a.substring(0,l).trim(),h=a.substring(l+1).trim();d==="path"?o.path=h:d==="url"&&(o.url=h)}}}return o.path&&o.url&&t.push({path:o.path,url:o.url}),t};class Ye{async fetchConfig(t){console.log(`[GitHub] Starting fetch from URL: ${t}`);const i=this.parseUrl(t),{owner:o,repo:s,branch:a,filePath:l,isRepoRoot:d}=i,h=i.host,c=[],m=[],b=[],g=async(w,f,k,C,P)=>{console.log("[GitHub] Checking for .gitmodules file");try{const L=await this.fetchFileContent(o,s,".gitmodules",f,h);console.log("[GitHub] .gitmodules found, parsing submodules");const I=ki(L);for(const v of I)if(v.path.includes(k)||v.path.includes(C)&&ce("outlines")||v.path.includes(P)&&ce("templates")){const W=v.path.includes(C),R=v.path.includes(P),A=W?C:R?P:k,O=W?m:R?b:c,x=v.path.substring(v.path.indexOf(A)+A.length+1),E=Xe.resolve(v.url);if(E instanceof Ye){const j=E.parseUrl(v.url),U=j.host;let F=[];try{F=await E.fetchFootprintsFromDirectory(j.owner,j.repo,"","main",[".js"],U)}catch(K){if(K instanceof me)throw K;try{F=await E.fetchFootprintsFromDirectory(j.owner,j.repo,"","master",[".js"],U)}catch(J){if(J instanceof me)throw J;console.warn(`Failed to fetch submodule footprints from ${v.url}`)}}const D=F.map(K=>({name:x?`${x}/${K.name}`:K.name,content:K.content}));O.push(...D)}}}catch(L){if(L instanceof me)throw L}};if(!d){if(!l)throw new Error("Invalid URL. File path not specified.");const w=await this.fetchFileContent(o,s,l,a,h);Kt(w.length,!1);const f=l.split("/").pop()||"";if(!(f==="config.yaml"||f==="config.yml"))return{config:w,footprints:[],outlines:[],templates:[],configPath:f};const C=l.substring(0,l.lastIndexOf("/")),P=C?`${C}/footprints`:"footprints",L=C?`${C}/outlines`:"outlines",I=C?`${C}/templates`:"templates";try{const v=await this.fetchFootprintsFromDirectory(o,s,P,a,[".js"],h);c.push(...v)}catch(v){if(v instanceof me)throw v}if(ce("outlines"))try{const v=await this.fetchFootprintsFromDirectory(o,s,L,a,[".js",".svg"],h);m.push(...v)}catch(v){if(v instanceof me)throw v}if(ce("templates"))try{const v=await this.fetchFootprintsFromDirectory(o,s,I,a,[".js"],h);b.push(...v)}catch(v){if(v instanceof me)throw v}return await g(C,a,P,L,I),{config:w,footprints:c,outlines:m,templates:b,configPath:f}}const S=async w=>{var v,W,R,A,O,x,E,j,U,F,D,K;let f="",k="",C=!0;try{f=await this.fetchFileContent(o,s,"config.yaml",w,h),k=""}catch(J){const ne=J;if((v=ne.message)!=null&&v.includes("allowance")||(W=ne.message)!=null&&W.includes("limit exceeded")||(R=ne.message)!=null&&R.includes("rate limit"))throw ne;try{f=await this.fetchFileContent(o,s,"config.yml",w,h),k=""}catch(Z){const B=Z;if((A=B.message)!=null&&A.includes("allowance")||(O=B.message)!=null&&O.includes("limit exceeded")||(x=B.message)!=null&&x.includes("rate limit"))throw B;try{f=await this.fetchFileContent(o,s,"ergogen/config.yaml",w,h),k="ergogen"}catch(N){const T=N;if((E=T.message)!=null&&E.includes("allowance")||(j=T.message)!=null&&j.includes("limit exceeded")||(U=T.message)!=null&&U.includes("rate limit"))throw T;try{f=await this.fetchFileContent(o,s,"ergogen/config.yml",w,h),k="ergogen"}catch(Q){const G=Q;if((F=G.message)!=null&&F.includes("allowance")||(D=G.message)!=null&&D.includes("limit exceeded")||(K=G.message)!=null&&K.includes("rate limit"))throw G;const{configYamls:y,anyYamls:V}=await this.bfsForYamlFiles(o,s,w,h);if(y.length>0){const H=y[0];f=await this.fetchFileContent(o,s,H,w,h),k=H.includes("/")?H.substring(0,H.lastIndexOf("/")):""}else if(V.length>0){const H=V[0];f=await this.fetchFileContent(o,s,H,w,h),k=H.includes("/")?H.substring(0,H.lastIndexOf("/")):"",C=!1}else throw new Error("No YAML configuration files found in repository")}}}}if(Kt(f.length,!1),!C)return{config:f,footprints:[],outlines:[],templates:[],configPath:k};const P=k?`${k}/footprints`:"footprints",L=k?`${k}/outlines`:"outlines",I=k?`${k}/templates`:"templates";try{const J=await this.fetchFootprintsFromDirectory(o,s,P,w,[".js"]);c.push(...J)}catch(J){if(J instanceof me)throw J}if(ce("outlines"))try{const J=await this.fetchFootprintsFromDirectory(o,s,L,w,[".js",".svg"]);m.push(...J)}catch(J){if(J instanceof me)throw J}if(ce("templates"))try{const J=await this.fetchFootprintsFromDirectory(o,s,I,w,[".js"]);b.push(...J)}catch(J){if(J instanceof me)throw J}return await g(k,w,P,L,I),{config:f,footprints:c,outlines:m,templates:b,configPath:k}};if(a!=="main")return await S(a);try{return await S("main")}catch(w){if(w instanceof me)throw w;return await S("master")}}async fetchFootprintsFromDirectory(t,i,o,s,a,l){const d=[],h=async c=>{try{const m=await this.listDirectory(t,i,c,s,l);for(const b of m){const g=b.path.startsWith(c)?b.path:c?`${c}/${b.path}`:b.path;if(b.type==="file"){if(a.some(w=>b.name.endsWith(w)))try{const w=await this.fetchFileContent(t,i,g,s,l),f=o?g.slice(o.length+1).replace(/\.[^/.]+$/,""):g.replace(/\.[^/.]+$/,"");console.log(`[GitHub] Loaded footprint: ${f}`),d.push({name:f,content:w})}catch(w){if(w instanceof me)throw w;const f=w;console.warn(`Failed to fetch file content: ${g}`,f.stack||f)}}else b.type==="dir"&&await h(g)}}catch(m){if(m instanceof me)throw m}};return await h(o),d}async bfsForYamlFiles(t,i,o,s){var m,b,g;const a=[],l=[],d=[{path:"",depth:0}],h=new Set;let c=0;for(;d.length>0&&c<wi;){const{path:S,depth:w}=d.shift();if(!h.has(S)){h.add(S);try{c++;const f=await this.listDirectory(t,i,S,o,s);for(const k of f)if(k.type==="file"){const C=k.name.toLowerCase();(C.endsWith(".yaml")||C.endsWith(".yml"))&&!C.startsWith(".")&&C.replace(/\.(yaml|yml)$/,"")!=="metadata"&&C.replace(/\.(yaml|yml)$/,"")!=="virtual_env"&&(k.name==="config.yaml"||k.name==="config.yml"?a.push(k.path):l.push(k.path))}else k.type==="dir"&&w<xi&&(k.name.startsWith(".")||d.push({path:k.path,depth:w+1}));if(a.length>0||l.length>0&&(d.length===0||d[0].depth>w))break}catch(f){const k=f;if((m=k.message)!=null&&m.includes("allowance")||(b=k.message)!=null&&b.includes("limit exceeded")||(g=k.message)!=null&&g.includes("rate limit"))throw k;continue}}}return{configYamls:a,anyYamls:l}}}const _i=(e,t)=>{var d,h,c,m;if(!e)return{isLimitExceeded:!1,error:null};if(t.includes("raw.githubusercontent.com"))return e.status===429?(console.warn("[GitHub] Raw content rate limit exceeded (429). Please wait 30 minutes and try again."),{isLimitExceeded:!0,error:"You've reached your hourly request allowance for loading content from GitHub. Please wait 30 minutes and try again."}):{isLimitExceeded:!1,error:null};const o=((d=e.headers)==null?void 0:d.get("X-RateLimit-Limit"))||"unknown",s=((h=e.headers)==null?void 0:h.get("X-RateLimit-Remaining"))||"unknown",a=((c=e.headers)==null?void 0:c.get("X-RateLimit-Used"))||"unknown",l=((m=e.headers)==null?void 0:m.get("X-RateLimit-Reset"))||"unknown";if(console.log(`[GitHub Rate Limit] Limit: ${o}, Remaining: ${s}, Used: ${a}, Reset: ${l}`),e.status===403&&s==="0")return console.warn("[GitHub] Rate limit exceeded. Please wait and try again in about an hour."),{isLimitExceeded:!0,error:"Cannot load from GitHub right now. You've used your hourly request allowance. Please wait about an hour and try again."};if(s!=="unknown"&&o!=="unknown"){const b=parseInt(o),g=parseInt(s),S=(b-g)/b*100;if(S>=80&&g>0)return console.warn(`[GitHub] Approaching rate limit: ${S.toFixed(1)}% used`),{isLimitExceeded:!1,error:"Loading from GitHub may become unavailable soon. You've used most of your hourly request allowance. This will reset within an hour."}}return{isLimitExceeded:!1,error:null}};class vi extends Ye{constructor(){super(...arguments),this.rateLimitWarning=null}canHandle(t){const i=t.trim();return i.includes("github.com")||/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(i)}parseUrl(t){const i=t.trim();let o="",s="",a="main",l,d=!0;const h=!i.includes("github.com");if(h){const c=i.split("/").filter(Boolean);if(c.length<2)throw new Error("Invalid GitHub repository format. Must contain owner and repository.");o=c[0],s=c[1],d=c.length===2||c.length===4&&c[2]==="tree",d?c.length===4&&(a=c[3]):c[2]==="blob"||c[2]==="tree"?(a=c[3],l=c.slice(4).join("/")):l=c.slice(2).join("/")}else{let c=i;c.match(/^(https?:\/\/)/i)||(c=`https://${c}`);const m=c.endsWith("/")?c.slice(0,-1):c,g=new URL(m).pathname.split("/").filter(Boolean);if(g.length<2)throw new Error("Invalid GitHub URL. Must contain owner and repository.");o=g[0],s=g[1],d=g.length===2||g.length===4&&g[2]==="tree",d?g.length===4&&(a=g[3]):g[2]==="blob"||g[2]==="tree"?(a=g[3],l=g.slice(4).join("/")):l=g.slice(2).join("/")}return s.endsWith(".git")&&(s=s.slice(0,-4)),{owner:o,repo:s,branch:a,filePath:l,isRepoRoot:d,baseUrl:h?`https://github.com/${o}/${s}`:i}}async fetchFileContent(t,i,o,s){const a=`https://raw.githubusercontent.com/${t}/${i}/${s}/${o}`,l=await fetch(a);if(this.checkRateLimits(l,a),!l.ok)throw new Error(`Failed to fetch file content from GitHub: ${l.status}`);return await l.text()}async listDirectory(t,i,o,s){const a=`https://api.github.com/repos/${t}/${i}/contents/${o}?ref=${s}`,l=await fetch(a);if(this.checkRateLimits(l,a),!l.ok)throw new Error(`Failed to list directory from GitHub: ${l.status}`);const d=await l.json();let h=[];if(Array.isArray(d))h=d;else if(d&&typeof d=="object"&&"tree"in d&&Array.isArray(d.tree))h=d.tree;else throw new Error("Target path is not a directory");return h.map(c=>({name:c.name||c.path.split("/").pop()||"",path:c.path,type:c.type==="tree"?"dir":c.type==="blob"?"file":c.type}))}checkRateLimits(t,i){const o=_i(t,i);if(o.error&&!this.rateLimitWarning&&(this.rateLimitWarning=o.error),o.isLimitExceeded)throw new me(o.error||"Rate limit exceeded")}async fetchConfig(t){this.rateLimitWarning=null;const i=await super.fetchConfig(t);return this.rateLimitWarning&&(i.rateLimitWarning=this.rateLimitWarning),i}}Xe.register(new vi);const fr=async e=>{const t=Xe.resolve(e);if(!t)throw new Error(`Unsupported repository provider URL: ${e}`);return t.fetchConfig(e)};class ji extends Ye{canHandle(t){return t.includes("codeberg.org")}parseUrl(t){const i=t.trim();let o="",s="",a="main",l,d=!0;const h=!i.includes("codeberg.org");if(h){const c=i.split("/").filter(Boolean);if(c.length<2)throw new Error("Invalid Codeberg repository format. Must contain owner and repository.");o=c[0],s=c[1],d=c.length===2||c.length===5&&c[2]==="src"&&(c[3]==="branch"||c[3]==="commit"),d?c.length===5&&(a=c[4]):c.length>=5&&c[2]==="src"&&(c[3]==="branch"||c[3]==="commit")?(a=c[4],l=c.slice(5).join("/")):l=c.slice(2).join("/")}else{let c=i;c.match(/^(https?:\/\/)/i)||(c=`https://${c}`);const m=c.endsWith("/")?c.slice(0,-1):c,g=new URL(m).pathname.split("/").filter(Boolean);if(g.length<2)throw new Error("Invalid Codeberg URL. Must contain owner and repository name.");o=g[0],s=g[1],d=g.length===2||g.length===5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit"),d?g.length===5&&(a=g[4]):g.length>=5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit")?(a=g[4],l=g.slice(5).join("/")):l=g.slice(2).join("/")}return s.endsWith(".git")&&(s=s.slice(0,-4)),{owner:o,repo:s,branch:a,filePath:l,isRepoRoot:d,baseUrl:h?`https://codeberg.org/${o}/${s}`:i}}async fetchFileContent(t,i,o,s){const a=`https://codeberg.org/api/v1/repos/${t}/${i}/raw/${o}?ref=${s}`,l=await fetch(a);if(!l.ok)throw new Error(`Failed to fetch file content from Codeberg API: ${l.status}`);return await l.text()}async listDirectory(t,i,o,s){const a=o?`/${o}`:"",l=`https://codeberg.org/api/v1/repos/${t}/${i}/contents${a}?ref=${s}`,d=await fetch(l);if(!d.ok)throw new Error(`Failed to list directory from Codeberg API: ${d.status}`);const h=await d.json();if(!Array.isArray(h))throw new Error("Target path is not a directory");return h.map(c=>({name:c.name,path:c.path||c.name,type:c.type}))}}Xe.register(new ji);class $i extends Ye{canHandle(t){const i=t.trim();return i.match(/^(https?:\/\/)/i)?!i.includes("github.com")&&!i.includes("codeberg.org"):!1}parseUrl(t){const i=t.trim();let o="",s="",a="main",l,d=!0,h=i;h.match(/^(https?:\/\/)/i)||(h=`https://${h}`);const c=h.endsWith("/")?h.slice(0,-1):h,m=new URL(c),b=m.origin,g=m.pathname.split("/").filter(Boolean);if(g.length<2)throw new Error("Invalid Forgejo/Gitea URL. Must contain owner and repository name.");return o=g[0],s=g[1],d=g.length===2||g.length===5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit"),d?g.length===5&&(a=g[4]):g.length>=5&&g[2]==="src"&&(g[3]==="branch"||g[3]==="commit")?(a=g[4],l=g.slice(5).join("/")):l=g.slice(2).join("/"),s.endsWith(".git")&&(s=s.slice(0,-4)),{owner:o,repo:s,branch:a,filePath:l,isRepoRoot:d,baseUrl:i,host:b}}async fetchFileContent(t,i,o,s,a){const d=`${a||"https://codeberg.org"}/api/v1/repos/${t}/${i}/raw/${o}?ref=${s}`,h=await fetch(d);if(!h.ok)throw new Error(`Failed to fetch file content from Gitea/Forgejo API: ${h.status}`);return await h.text()}async listDirectory(t,i,o,s,a){const l=a||"https://codeberg.org",d=o?`/${o}`:"",h=`${l}/api/v1/repos/${t}/${i}/contents${d}?ref=${s}`,c=await fetch(h);if(!c.ok)throw new Error(`Failed to list directory from Gitea/Forgejo API: ${c.status}`);const m=await c.json();if(!Array.isArray(m))throw new Error("Target path is not a directory");return m.map(b=>({name:b.name,path:b.path||b.name,type:b.type}))}}const Ci=new $i;Xe.register(Ci);const Si=({processInjectionsWithConflictResolution:e,setError:t})=>{const[i,o]=p.useState(!1),s=p.useRef(!1);return p.useEffect(()=>{const a=async()=>{const l=new URLSearchParams(window.location.search),d=l.get("github"),h=l.get("codeberg"),c=l.get("forgejo"),m=l.get("gitea");let b=d||h||c||m;if(b){h&&!h.includes("codeberg.org")?b=`https://codeberg.org/${h}`:d&&!d.includes("github.com")&&(b=`https://github.com/${d}`),o(!0),console.log("[useConfigLoader] Loading from URL parameter:",b);try{const g=await fr(b);console.log("[useConfigLoader] Fetch result:",{configLength:g.config.length,footprintsCount:g.footprints.length,outlinesCount:g.outlines.length,configPath:g.configPath,rateLimitWarning:g.rateLimitWarning}),g.rateLimitWarning&&t(g.rateLimitWarning);const S=pr(g.footprints,g.outlines,g.templates);await e(S,g.config)}catch(g){console.error("[useConfigLoader] Failed to load from remote repository:",g),t(`Failed to load from remote repository: ${g instanceof Error?g.message:String(g)}`)}finally{o(!1)}}};s.current||(s.current=!0,a())},[e,t]),{isLoading:i}},lo="background-preview-",Ei=()=>({version:0,active:null,settledVersion:null,settledRequestKey:null}),Pi=e=>!e||!e.startsWith(lo)?null:e.slice(lo.length),Ii=(e,t,i,o)=>JSON.stringify([e,t,i,o]),Li=(e,t,i)=>{var s;return i?(((s=e.active)==null?void 0:s.requestKey)??e.settledRequestKey)===t:!1},zi=(e,t)=>{e.version+=1;const o={requestId:`${t.isManual?"ergogen-manual":"ergogen-generate"}-${e.version}-${t.now??Date.now()}`,version:e.version,targetConfigId:t.targetConfigId,requestKey:t.requestKey,isManual:t.isManual};return e.active=o,e.settledVersion=null,e.settledRequestKey=null,o},Ri=(e,t)=>{const i=Pi(t.requestId);if(i!==null)return{kind:"background-preview",configId:i};if(!e.active||t.requestId!==e.active.requestId)return{kind:"stale"};const o=e.active;return e.active=null,t.type==="error"?(e.settledVersion=null,e.settledRequestKey=null,{kind:"active-error",isManual:o.isManual}):t.type==="success"?(e.settledVersion=o.version,e.settledRequestKey=o.requestKey,{kind:"active-success",version:o.version,targetConfigId:o.targetConfigId,isManual:o.isManual}):(e.settledVersion=null,e.settledRequestKey=null,{kind:"active-unknown",isManual:o.isManual})},Di=(e,t)=>e.active===null&&e.settledVersion!==null&&t===e.settledVersion,zt=e=>{e.active=null,e.settledVersion=null,e.settledRequestKey=null},co=e=>{e.version+=1,e.active=null,e.settledVersion=null,e.settledRequestKey=null},Jt="ergogen:config",un="ergogen:multi-config",Xt="LOCAL_STORAGE_CONFIG",uo=5e3,hr=e=>!e||!Array.isArray(e)?e:e.filter(t=>{if(!Array.isArray(t)||t.length!==3)return!0;const[i]=t;return!(i==="outline"&&!ce("outlines")||i==="template"&&!ce("templates"))}),Ai=e=>{if(!e||!Array.isArray(e))return null;const t=e.some(a=>Array.isArray(a)&&a[0]==="outline"),i=e.some(a=>Array.isArray(a)&&a[0]==="template"),o=t&&!ce("outlines"),s=i&&!ce("templates");if(o||s){const a=[];return o&&a.push("outlines"),s&&a.push("templates"),`Custom ${a.join(" and ")} were skipped because the respective feature flags are disabled in settings.`}return null},Ni=e=>{if(!e||typeof e!="object")return null;const t=e;if(!t.pcbs||typeof t.pcbs!="object")return null;const i=t.pcbs;for(const o of Object.values(i))if(o&&typeof o=="object"&&(!o.template||o.template==="kicad5")){const s=o.footprints;if(s&&typeof s=="object"){for(const a of Object.values(s))if(a&&typeof a=="object"&&typeof a.what=="string"&&a.what.startsWith("ceoloide"))return'KiCad 5 is deprecated. Please add "template: kicad8" to your PCB definitions to avoid errors when opening PCB files with KiCad 8 or newer.'}}return null},Ui=(e,t)=>{if(e&&typeof e=="object"){const i=e;return i.points&&t?{...i,pcbs:void 0,cases:void 0}:i}return e},Yt=e=>{var t;return((t=e==null?void 0:e.getRealtimeConfigInput)==null?void 0:t.call(e))??(e==null?void 0:e.configInput)??""},Ve=(e,t)=>{if(typeof window>"u")return t;try{const i=localStorage.getItem(e);return i!==null?JSON.parse(i):t}catch{return t}},po=()=>({debug:Ve("ergogen:config:debug",!1),autoGen:Ve("ergogen:config:autoGen",!0),autoGen3D:Ve("ergogen:config:autoGen3D",!0),kicanvasPreview:Ve("ergogen:config:kicanvasPreview",!0),stlPreview:Ve("ergogen:config:stlPreview",!0),sendUsageMetrics:yt()}),gr=p.createContext(null),Ae=()=>typeof window<"u"&&window.crypto&&window.crypto.randomUUID?window.crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,e=>{const t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)}),ot=(e,t)=>{let i=0;for(const o of e){const s=o.name.match(t);if(s){const a=parseInt(s[1],10);!isNaN(a)&&a>i&&(i=a)}}return i+1},mt="ergogen:deleted-config",Wi=e=>{try{const t=localStorage.getItem(mt),i={version:1,configs:[]};if(t){const s=JSON.parse(t);s&&Array.isArray(s.configs)&&(i.configs=s.configs,s.version!==void 0&&(i.version=s.version))}const o={...e,deletedAt:new Date().toISOString()};i.configs.push(o),localStorage.setItem(mt,JSON.stringify(i))}catch(t){console.error("Failed to save deleted config to storage:",t)}},fo=()=>{try{const e=localStorage.getItem(mt);if(!e)return;const t=JSON.parse(e);if(!t||!Array.isArray(t.configs))return;let i=t.configs;const o=Date.now(),s=90*24*60*60*1e3;i=i.filter(l=>{const d=new Date(l.deletedAt).getTime();return o-d<=s}),i.length>100&&(i.sort((l,d)=>{const h=new Date(l.updatedAt).getTime(),c=new Date(d.updatedAt).getTime();return h-c}),i=i.slice(i.length-100));const a={version:t.version||1,configs:i};localStorage.setItem(mt,JSON.stringify(a))}catch(e){console.error("Failed to prune deleted configs:",e)}},ho=e=>{if(!e)return;let t="";if(typeof e=="string")t=e;else if(Array.isArray(e))t=e.join("");else return;return t=t.replace(/width="[^"]+"/,'width="284px"').replace(/height="[^"]+"/,'height="134px"'),t=t.replace(/<svg/,'<svg style="background-color: rgb(51,51,51);"'),t=t.replaceAll(/stroke="#000"/g,'stroke="#AAA"'),t=t.replaceAll(/stroke:#000/g,"stroke:#AAA"),t},Oi=()=>{if(typeof window>"u")return{version:2,activeConfigId:null,configs:[]};const e=localStorage.getItem(un);if(e)try{const t=JSON.parse(e);if(t&&typeof t.version=="number"){const i=new Date().toISOString(),o=(t.configs||[]).map(s=>({...s,createdAt:s.createdAt||i,updatedAt:s.updatedAt||i}));return{...t,configs:o}}}catch(t){console.error("Failed to parse multi-config storage:",t)}return{version:2,activeConfigId:null,configs:[]}},ue=(e,t,i=2)=>{if(typeof window>"u")return;const o={version:i,activeConfigId:t,configs:e};localStorage.setItem(un,JSON.stringify(o))},Fi=()=>{const e=Oi();if(typeof window>"u")return e;const t=localStorage.getItem(Xt),i=localStorage.getItem(Jt);let o="";if(t)try{o=JSON.parse(t)}catch{o=t}else if(i)try{o=JSON.parse(i)}catch{o=i}if(o&&o.trim()!==""){if(!e.configs.some(a=>a.name==="Legacy Config")){const a=Ae(),l={id:a,name:"Legacy Config",config:o,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};e.configs.push(l),e.activeConfigId=a,ue(e.configs,a,2)}localStorage.removeItem(Xt),localStorage.removeItem(Jt)}return e},Mi=({initialInjectionInput:e,hashError:t,children:i})=>{const[o]=p.useState(()=>{if(typeof window>"u")return!1;const _=localStorage.getItem(Xt),$=localStorage.getItem(Jt);return!!(_||$)}),[s]=p.useState(()=>{if(typeof window>"u")return 2;const _=localStorage.getItem(un);if(_)try{const $=JSON.parse(_);if($&&typeof $.version=="number")return $.version}catch($){console.warn("Failed to parse loaded version:",$)}return 1}),[a]=p.useState(()=>Fi()),[l,d]=p.useState(()=>a.configs),[h,c]=p.useState(()=>a.activeConfigId),[m,b]=p.useState(!1),[g,S]=p.useState(null),[w,f]=p.useState(()=>{if(a.activeConfigId){const _=a.configs.find($=>$.id===a.activeConfigId);return _?_.config:""}return""}),k=p.useRef(l),C=p.useRef(h),P=p.useRef(m),L=p.useRef(g),I=p.useRef(w);p.useEffect(()=>{k.current=l},[l]),p.useEffect(()=>{C.current=h},[h]),p.useEffect(()=>{P.current=m},[m]),p.useEffect(()=>{L.current=g},[g]),p.useEffect(()=>{I.current=w},[w]);const v=p.useRef(w);p.useEffect(()=>{v.current=w},[w]);const W=p.useCallback(_=>{v.current=_},[]),R=p.useCallback(()=>v.current,[]),A=p.useRef(void 0),O=p.useRef(null),x=p.useRef(null),E=p.useCallback(()=>{x.current&&(clearTimeout(x.current.timeoutId),x.current=null)},[]),j=p.useCallback(()=>{const _=x.current;_&&(E(),M(_.name,_.payload))},[E]),U=p.useCallback(()=>{if(j(),O.current){const{timeoutId:_,payload:$,configId:z}=O.current;clearTimeout(_),M("keyboard_generated",$),A.current=z,O.current=null}},[j]),F=p.useCallback(()=>{A.current=void 0,j(),O.current&&(clearTimeout(O.current.timeoutId),O.current=null)},[j]),[D,K]=no("ergogen:injection",e),[J,ne]=p.useState(null),[Z,B]=p.useState(null),[N,T]=p.useState(null),[Q,G]=p.useState(null),[y,V]=p.useState(null),[H,ee]=p.useState(0),q=p.useRef(Ei()),se=p.useCallback(()=>{co(q.current),V(null),ae(!1),xe(!1)},[]),[ie,Oe]=no("ergogen:settings",po()),he=(ie==null?void 0:ie.debug)??!1,ke=(ie==null?void 0:ie.autoGen)??!0,ge=(ie==null?void 0:ie.autoGen3D)??!0,Fe=(ie==null?void 0:ie.kicanvasPreview)??!0,Ee=(ie==null?void 0:ie.stlPreview)??!0,pn=p.useRef(Ee);pn.current=Ee;const[$e,Ir]=p.useState(yt),jt=p.useRef(ie);jt.current=ie;const fn=p.useRef(ke);fn.current=ke;const $t=p.useRef($e);$t.current=$e;const be=p.useCallback(_=>{const $=jt.current||po(),z=_($);jt.current=z,Oe(z)},[Oe]),hn=p.useCallback(_=>{be($=>{const z=typeof _=="function"?_($.debug):_;return{...$,debug:z}})},[be]),gn=p.useCallback(_=>{be($=>{const z=typeof _=="function"?_($.autoGen):_;return{...$,autoGen:z}})},[be]),mn=p.useCallback(_=>{be($=>{const z=typeof _=="function"?_($.autoGen3D):_;return{...$,autoGen3D:z}})},[be]),bn=p.useCallback(_=>{be($=>{const z=typeof _=="function"?_($.kicanvasPreview):_;return{...$,kicanvasPreview:z}})},[be]),wn=p.useCallback(_=>{be($=>{const z=typeof _=="function"?_($.stlPreview):_;return{...$,stlPreview:z}})},[be]),Me=p.useCallback((_,$,z)=>{if(E(),z||!fn.current){M(_,$);return}const X=setTimeout(()=>{x.current=null,M(_,$)},uo);x.current={name:_,payload:$,timeoutId:X}},[E]),xn=p.useCallback(_=>{const $=typeof _=="function"?_($t.current):_;$t.current=$,Yr($),Ir($),be(z=>({...z,sendUsageMetrics:$}))},[be]);p.useEffect(()=>{sr()},[$e]);const[Ce,yn]=p.useState(!1),[kn,Lr]=p.useState(!1),[_n,vn]=p.useState(!1),[jn,$n]=p.useState(!0),[Cn,Sn]=p.useState(!0),[En,ae]=p.useState(!1),[Pn,Ze]=p.useState(!1),we=p.useRef(null),Pe=p.useRef(null),[In,xe]=p.useState(!1),Ln=p.useRef(!0),Ct=p.useRef(null);p.useEffect(()=>{fo()},[]),p.useEffect(()=>{t&&ne(t)},[t]);const zn=p.useCallback(()=>ne(null),[]),Rn=p.useCallback(()=>B(null),[]),Dn=p.useCallback(()=>T(null),[]),An=p.useCallback(()=>G(null),[]),Nn=p.useCallback(_=>{var X,oe,Y,re,de,_e;const $=_.data,z=Ri(q.current,$);if(z.kind==="background-preview"){const te=z.configId;if($.type==="success"&&$.results){const ye=$.results,ze=((oe=(X=ye.outlines)==null?void 0:X.preview)==null?void 0:oe.svg)||((Y=ye.demo)==null?void 0:Y.svg),Be=ho(ze);Be&&d(nt=>{const Te=nt.map(le=>le.id===te?{...le,previewSvg:Be}:le);return ue(Te,C.current,2),Te})}else $.type==="error"&&console.warn(`Background generation failed for config ${te}:`,$.error);return}if(z.kind!=="stale"){if(z.kind==="active-error"){const te=$.type==="error"&&$.error||"Unknown worker error";console.error("--- Ergogen worker error:",te),ne(te),ae(!1),xe(!1),Me("generation_failed",{error_message:te,stored_configs_count:k.current.length,trigger:z.isManual?"manual":"auto"},z.isManual);return}if(z.kind==="active-success")if($.type==="success"&&$.warnings&&$.warnings.length>0&&B(te=>(te?te+`
`:"")+$.warnings.join(`
`)),$.type==="success"&&$.results){const te=$.results,ye=Ct.current?performance.now()-Ct.current:0;Me("generation_completed",{duration_ms:Math.round(ye),points_count:te.points?Object.keys(te.points).length:0,pcbs_count:te.pcbs?Object.keys(te.pcbs).length:0,cases_count:te.cases?Object.keys(te.cases).length:0,has_outlines:!!te.outlines,stored_configs_count:k.current.length,trigger:z.isManual?"manual":"auto"},z.isManual);try{const le=fe.dump(te.canonical||{}),Se=fe.dump(te.points||{}),je=li(le,Se,Math.round(ye),A.current);if(je.config_id!==A.current){O.current&&clearTimeout(O.current.timeoutId);const Ar=setTimeout(()=>{M("keyboard_generated",je),A.current=je.config_id,O.current=null},uo);O.current={timeoutId:Ar,payload:je,configId:je.config_id}}}catch(le){console.error("Failed to generate keyboard configuration analytics:",le)}const ze=((de=(re=te.outlines)==null?void 0:re.preview)==null?void 0:de.svg)||((_e=te.demo)==null?void 0:_e.svg),Be=ho(ze),nt=z.targetConfigId;Be&&nt&&d(le=>{const Se=le.map(je=>je.id===nt?{...je,previewSvg:Be}:je);return ue(Se,C.current,2),Se});let Te=!1;if(pn.current&&te.cases&&Object.keys(te.cases).length>0){for(const le of Object.keys(te.cases)){const Se=te.cases[le];Se!=null&&Se.jscad&&(te.cases[le].stl=void 0)}if(Pe.current){Te=!0,xe(!0);const le={type:"batch_jscad_to_stl",results:te,configVersion:z.version};Pe.current.postMessage(le)}}V(te),ee(le=>le+1),Te||ae(!1)}else ae(!1);else ae(!1),xe(!1)}},[Me]),Un=p.useRef(Nn);Un.current=Nn;const Wn=p.useCallback(_=>{const $=_.data;Di(q.current,$.configVersion)&&($.type==="error"?(console.error("--- JSCAD worker error:",$.error),xe(!1),ae(!1)):$.type==="success"&&$.results&&(V($.results),ee(z=>z+1),xe(!1),ae(!1)))},[]),On=p.useRef(Wn);On.current=Wn;const Qe=p.useCallback(()=>{we.current&&(we.current.terminate(),we.current=null,Ze(!1));const _=ln();return _?(_.onmessage=$=>Un.current($),_.onerror=$=>{console.error("Ergogen worker error:",$);const z=$.message||"Ergogen worker error";zt(q.current),ne(z),ae(!1),xe(!1),ht($.message||"Worker crash",!1,"ergogen_worker")},we.current=_,Ze(!0)):(Ze(!1),console.warn("Failed to initialize Ergogen worker.")),_},[]);p.useEffect(()=>{if(we.current||Qe(),!Pe.current){const _=tr();_?(_.onmessage=$=>On.current($),_.onerror=$=>{console.error("JSCAD worker error:",$),xe(!1),ae(!1),ht($.message||"Worker crash",!1,"jscad_worker")},Pe.current=_):console.warn("Failed to initialize JSCAD worker.")}return()=>{we.current&&(we.current.terminate(),we.current=null,Ze(!1)),Pe.current&&(Pe.current.terminate(),Pe.current=null)}},[Qe]),p.useEffect(()=>{const _=()=>{document.visibilityState==="hidden"&&U()};return window.addEventListener("visibilitychange",_),window.addEventListener("pagehide",U),()=>{window.removeEventListener("visibilitychange",_),window.removeEventListener("pagehide",U),U()}},[U]);const St=p.useRef({debug:he,autoGen:ke,autoGen3D:ge,kicanvasPreview:Fe,stlPreview:Ee,sendUsageMetrics:$e});p.useEffect(()=>{const _={debug:he,autoGen:ke,autoGen3D:ge,kicanvasPreview:Fe,stlPreview:Ee,sendUsageMetrics:$e},{sendUsageMetrics:$,...z}=_;if(Ln.current)Ln.current=!1,St.current=_,M("settings_loaded",{...z});else{const X=St.current,oe=Object.keys(_).find(Y=>_[Y]!==X[Y]);St.current=_,M("setting_changed",{...oe?{setting_name:oe,setting_value:_[oe]}:{},...z})}},[he,ke,ge,Fe,Ee,$e]);const Fn=p.useCallback(_=>{let $="UNKNOWN",z=null;try{z=JSON.parse(_),$="json"}catch{}try{z=fe.load(_),$="yaml"}catch{}return[$,z]},[]),et=p.useCallback(async(_,$,z={pointsonly:!0})=>{const X=_===void 0||_===I.current?v.current??I.current:_;if(!X)return;const oe=hr($),Y=Ii(X,oe,!!z.pointsonly,he);if(Li(q.current,Y,z.skipIfCurrent))return;const[,re]=Fn(X);ne(null),B(null),T(null),ae(!0),Ct.current=performance.now();const de=Ni(re);de&&B(de);const _e=Ai($);_e&&T(_e);const te=Ui(re,z.pointsonly)||X;try{if(!we.current){console.error("Worker not available for processing request."),zt(q.current),ae(!1),xe(!1),ne("Worker not available for processing request.");return}const ye=zi(q.current,{requestKey:Y,targetConfigId:C.current,isManual:!!z.isManual});we.current.postMessage({type:"generate",inputConfig:te,injectionInput:oe,requestId:ye.requestId,options:{debug:he,svg:!0}})}catch(ye){zt(q.current),ae(!1),xe(!1);const ze=typeof ye=="string"?ye:String(ye);ne(ze),Me("generation_failed",{error_message:ze,stored_configs_count:k.current.length,trigger:z.isManual?"manual":"auto"},!!z.isManual);return}},[Fn,ne,B,T,ae,he,Me]),Le=p.useMemo(()=>Ho((_,$,z={pointsonly:!0})=>et(_,$,{...z,skipIfCurrent:!0}),300),[et]),Ie=p.useCallback(async(_,$,z={pointsonly:!0})=>{Le.cancel(),await et(_,$,z)},[Le,et]),tt=p.useCallback(_=>{const $=I.current,z=typeof _=="function"?_($):_;if(z!==$)if(f(z),P.current){if(z!==L.current){const oe=`Shared Config ${ot(k.current,/^Shared\s+Config\s+(\d+)$/)}`,Y=Ae(),re=new Date().toISOString(),de={id:Y,name:oe,config:z||"",createdAt:re,updatedAt:re},_e=[...k.current,de];d(_e),c(Y),b(!1),S(null),ue(_e,Y)}}else{const X=C.current;if(X){const oe=k.current.map(Y=>Y.id===X?{...Y,config:z||"",updatedAt:new Date().toISOString()}:Y);d(oe),ue(oe,X)}else{const Y=`Untitled ${ot(k.current,/^Untitled\s+(\d+)$/)}`,re=Ae(),de=new Date().toISOString(),_e={id:re,name:Y,config:z||"",createdAt:de,updatedAt:de},te=[...k.current,_e];d(te),c(re),ue(te,re)}}},[]),Mn=p.useCallback(_=>{if(F(),se(),_===null)c(null),C.current=null,b(!1),S(null),f(""),I.current="",ue(k.current,null);else{const $=k.current.find(z=>z.id===_);$&&(c(_),C.current=_,b(!1),S(null),f($.config),I.current=$.config,ue(k.current,_),M("config_selected",{stored_configs_count:k.current.length}))}},[F,se]),Bn=p.useCallback((_,$)=>{F(),se();const z=ot(k.current,/^Untitled\s+(\d+)$/),X=$||`Untitled ${z}`,oe=Ae(),Y=new Date().toISOString(),re={id:oe,name:X,config:_,createdAt:Y,updatedAt:Y},de=[...k.current,re];return d(de),c(oe),b(!1),S(null),f(_),M("config_created",{stored_configs_count:de.length}),k.current=de,C.current=oe,I.current=_,ue(de,oe),oe},[F,se]),Tn=p.useCallback((_,$)=>{const z=$.trim();if(!z)return ne("Configuration name cannot be empty"),!1;const X=k.current.find(re=>re.id===_);if(!X)return!1;if(X.name===z)return!0;if(k.current.some(re=>re.id!==_&&re.name.trim().toLowerCase()===z.toLowerCase()))return ne(`A configuration named "${z}" already exists.`),!1;const Y=k.current.map(re=>re.id===_?{...re,name:z,updatedAt:new Date().toISOString()}:re);return d(Y),k.current=Y,ue(Y,C.current),M("config_renamed",{stored_configs_count:Y.length}),!0},[ne]),Gn=p.useCallback(_=>{F(),se();const $=k.current.find(z=>z.id===_);if($){const z=Ae(),X=new Date().toISOString(),oe={id:z,name:`${$.name} (Copy)`,config:$.config,createdAt:X,updatedAt:X},Y=[...k.current,oe];d(Y),c(z),b(!1),S(null),f($.config),k.current=Y,C.current=z,I.current=$.config,ue(Y,z),M("config_duplicated",{stored_configs_count:Y.length})}},[F,se]),Vn=p.useCallback(_=>{F();const $=C.current,z=k.current.find(re=>re.id===_),X=k.current.filter(re=>re.id!==_);d(X),k.current=X;const oe=$===_;X.length===0||oe?(se(),c(null),C.current=null,f(""),I.current="",ue(X,null)):ue(X,$),z&&Wi(z),M("config_deleted",{stored_configs_count:X.length})},[F,se]),Hn=p.useCallback(_=>{F(),se(),b(!0),S(_),f(_)},[F,se]),qn=p.useCallback(()=>{if(!P.current)return;const $=`Shared Config ${ot(k.current,/^Shared\s+Config\s+(\d+)$/)}`,z=Ae(),X=new Date().toISOString(),oe={id:z,name:$,config:I.current||"",createdAt:X,updatedAt:X},Y=[...k.current,oe];d(Y),k.current=Y,c(z),C.current=z,b(!1),S(null),ue(Y,z)},[]),Kn=p.useCallback(()=>{fo()},[]),Jn=p.useMemo(()=>{if(m)return"Shared Config";if(h){const _=l.find($=>$.id===h);return _?_.name:""}return""},[m,h,l]),zr=p.useMemo(()=>({setInjectionInput:K,setConfigInput:tt,generateNow:Ie,getCurrentInjections:()=>D||[],setError:ne}),[D,Ie,K,tt,ne]),{currentConflict:Xn,processInjectionsWithConflictResolution:Rr,handleConflictResolution:Yn,handleConflictCancel:Zn}=kt(zr),{isLoading:Qn}=Si({processInjectionsWithConflictResolution:Rr,setError:ne}),eo=p.useRef(null);p.useEffect(()=>{if(t||Qn)return;!new URLSearchParams(window.location.search).get("github")&&w&&(eo.current=C.current,Ie(w,D,{pointsonly:!1}))},[Qn]);const to=p.useRef(Ce);p.useEffect(()=>{to.current&&!Ce&&(co(q.current),ae(!1),xe(!1),Qe(),w&&Ie(w,D,{pointsonly:!ge})),to.current=Ce},[Ce,w,D,ge,Ie,Qe]),p.useEffect(()=>{localStorage.setItem("ergogen:injection",JSON.stringify(D)),ke&&!Ce&&Le(w,D,{pointsonly:!ge})},[w,D,ke,ge,Ce,Le]),p.useEffect(()=>{Pn&&(s===1||o)&&(console.log("Version 1 or legacy configuration detected on load. Triggering background preview generation for all configs missing a preview SVG..."),ue(k.current,C.current,2),k.current.forEach(_=>{var $;!_.previewSvg&&_.id!==eo.current&&(console.log(`Triggering background preview generation for: ${_.name}`),($=we.current)==null||$.postMessage({type:"generate",inputConfig:_.config,requestId:`background-preview-${_.id}`,options:{debug:!0,svg:!0}}))}))},[Pn,s,o]);const Dr=p.useMemo(()=>({configInput:w,getRealtimeConfigInput:R,updateRealtimeConfigInput:W,setConfigInput:tt,configs:l,activeConfigId:h,activeConfigName:Jn,isPreview:m,selectConfig:Mn,createNewConfig:Bn,renameConfig:Tn,duplicateConfig:Gn,deleteConfig:Vn,loadPreview:Hn,savePreviewConfig:qn,pruneDeletedConfigs:Kn,injectionInput:D,setInjectionInput:K,processInput:Le,generateNow:Ie,error:J,setError:ne,clearError:zn,deprecationWarning:Z,clearWarning:Rn,skippedWarning:N,clearSkippedWarning:Dn,info:Q,setInfo:G,clearInfo:An,results:y,resultsVersion:H,setResultsVersion:ee,showSettings:Ce,setShowSettings:yn,isBulkDownloadOpen:kn,setIsBulkDownloadOpen:Lr,showSideNav:_n,setShowSideNav:vn,showConfig:jn,setShowConfig:$n,showDownloads:Cn,setShowDownloads:Sn,debug:he,setDebug:hn,autoGen:ke,setAutoGen:gn,autoGen3D:ge,setAutoGen3D:mn,kicanvasPreview:Fe,setKicanvasPreview:bn,stlPreview:Ee,setStlPreview:wn,sendUsageMetrics:$e,setSendUsageMetrics:xn,isGenerating:En,setIsGenerating:ae,isJscadConverting:In,currentConflict:Xn,handleConflictResolution:Yn,handleConflictCancel:Zn}),[w,R,W,tt,l,h,Jn,m,Mn,Bn,Tn,Gn,Vn,kn,Hn,qn,Kn,D,K,Le,Ie,J,ne,zn,Z,Rn,N,Dn,Q,G,An,y,H,ee,Ce,yn,_n,vn,jn,$n,Cn,Sn,he,hn,ke,gn,ge,mn,Fe,bn,Ee,wn,$e,xn,En,ae,In,Xn,Yn,Zn]);return n.jsx(gr.Provider,{value:Dr,children:i})},ve=()=>p.useContext(gr),Bi=({className:e,options:t,"data-testid":i,"aria-label":o})=>{const s=ve(),a=p.useRef(null),l={configInput:void 0,setConfigInput:C=>{},updateRealtimeConfigInput:C=>{},injectionInput:void 0,generateNow:async()=>{},activeConfigId:null},{configInput:d,updateRealtimeConfigInput:h,setConfigInput:c,injectionInput:m,generateNow:b,activeConfigId:g}=s??l,S=p.useRef({updateRealtimeConfigInput:h,setConfigInput:c,injectionInput:m,generateNow:b});S.current={updateRealtimeConfigInput:h,setConfigInput:c,injectionInput:m,generateNow:b};const w=p.useRef(Ho(C=>{c(C)},500)).current;p.useEffect(()=>()=>{w.cancel()},[w]),p.useEffect(()=>{if(a.current){if(a.current.hasTextFocus())return;const C=a.current.getValue();d!==void 0&&d!==C&&a.current.setValue(d)}},[d]);const f=p.useCallback(C=>{C!==void 0&&(h(C),w(C))},[w,h]),k=(C,P)=>{a.current=C,C.onDidBlurEditorText(()=>{w.flush()}),C.addAction({id:"generate-config",label:"Generate",keybindings:[P.KeyMod.CtrlCmd|P.KeyCode.Enter],run:()=>{const{updateRealtimeConfigInput:L,setConfigInput:I,injectionInput:v,generateNow:W}=S.current,R=C.getValue();w.cancel(),L(R),I(R),M("shortcut_used",{action:"generate"}),W(R,v,{pointsonly:!1,isManual:!0})}})};return s?n.jsx("div",{className:e,"data-testid":i,"aria-label":o,children:n.jsx(qo,{height:"100%",defaultLanguage:"yaml",language:"yaml",onChange:f,onMount:k,defaultValue:d,theme:"ergogen-theme",options:t||void 0},g||"preview")}):null},Ti=({className:e,options:t,injection:i,setInjection:o,"data-testid":s,"aria-label":a})=>{const l=ve(),d=async h=>{if(!h)return null;const c={...i,content:h};o(c)};return l?n.jsx(Gi,{className:e,"data-testid":s,"aria-label":a,children:n.jsx(qo,{height:"100%",defaultLanguage:"javascript",language:"javascript",onChange:d,value:i.content,theme:"ergogen-theme",options:t||void 0})}):null},Gi=u.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: 0.5rem;
`,r={colors:{accent:"#28a745",accentDark:"#1e8e1e",accentDarker:"#1e7e34",accentSecondary:"#239923",background:"#222222",backgroundLight:"#2a2a2a",backgroundLighter:"#333333",border:"#3f3f3f",text:"#ffffff",textDark:"#ccc",textDarker:"#aaa",textDarkest:"#666",error:"#ff6d6d",errorDark:"#a31111",warning:"hsl(45, 100%, 90%)",warningDark:"hsl(32, 79%, 40%)",info:"hsl(206, 94%, 92%)",infoDark:"hsl(206, 100%, 30%)",success:"hsl(120, 73%, 92%)",successDark:"hsl(120, 50%, 35%)",white:"#fff",buttonHover:"#3f3f3f"},fonts:{body:"'Roboto', sans-serif",code:"source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace"},fontSizes:{xs:"0.4rem",sm:"0.8rem",base:"1rem",lg:"1.2rem",iconMedium:"16px",iconLarge:"24px",bodySmall:"13px",h1:"2.5rem",h2:"2rem",h3:"1.5rem"},fontWeights:{regular:400,semiBold:600,bold:700},buttonSizes:{large:{padding:"1rem 2rem",fontSize:"1rem"},medium:{padding:"0.7rem 1.4rem",fontSize:"1rem"},small:{padding:"8px 12px",fontSize:"0.8rem"},icon:{padding:"8px 12px",fontSize:"0.4rem"}}},Vi=wt`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Hi=u.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;

  @media (max-width: 639px) {
    padding-bottom: 0.75rem;
  }
`,qi=u.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${r.fontSizes.bodySmall};
  cursor: ${e=>e.$hasPreview?"pointer":"default"};
  border-bottom: ${e=>e.$active?`2px solid ${r.colors.accent}`:"2px solid transparent"};
  border-top: 2px solid transparent;
  opacity: ${e=>e.$disabled?.5:1};
  color: ${e=>e.$disabled?r.colors.textDarker:r.colors.white};
`,Ki=u.div`
  white-space: nowrap;
  display: flex;
  gap: 10px;
  align-items: center;
`,Ji=u.a`
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
`,Xi=u.a`
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
    animation: ${Vi} 1s linear infinite;
  }
`,Yi=({fileName:e,extension:t,content:i,preview:o,setPreview:s,previewKey:a,"data-testid":l})=>{const d=t==="stl"&&!i||t==="kicad_pcb"&&!o,h=t==="stl"&&!i,c=()=>{if(h)return;M("download_button_clicked",{download_type:t,source:"downloads_panel"});const g=document.createElement("a"),S=new Blob([i],{type:"octet/stream"}),w=URL.createObjectURL(S);g.href=w,g.download=`${e}.${t}`,document.body.appendChild(g);try{g.click()}finally{document.body.removeChild(g),URL.revokeObjectURL(w)}},m=()=>{o&&!d&&s(o)},b=l?`${l}-${t}`:void 0;return n.jsxs(Hi,{"data-testid":b,children:[n.jsxs(qi,{$active:a===(o==null?void 0:o.key),$hasPreview:!!o,$disabled:d,onClick:m,"data-testid":b&&`${b}-preview`,children:[e,".",t]}),n.jsx(Ki,{children:h?n.jsx(Xi,{"aria-label":`Generating ${e}.${t}`,"data-testid":b&&`${b}-loading`,children:n.jsx("span",{className:"material-symbols-outlined",children:"progress_activity"})}):n.jsx(Ji,{onClick:c,"aria-label":`Download ${e}.${t}`,"data-testid":b&&`${b}-download`,children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})})]})},Zi=u.h3`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  margin: 0 0 1rem;

  @media (max-width: 639px) {
    display: none;
  }
`,Qi=u.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 1rem;

  @media (max-width: 639px) {
    padding: 0.5rem;
  }
`,es=u.div`
  font-size: ${r.fontSizes.sm};
  color: ${r.colors.textDarkest};
  font-style: italic;
  padding: 0.5rem 0;
`,ts=({setPreview:e,previewKey:t,"data-testid":i})=>{var h,c;const o=[],s=ve();if(!s)return null;const{configInput:a,results:l}=s;if(l!=null&&l.demo&&o.push({fileName:"raw",extension:"txt",content:a??"",previewKey:"raw",preview:{key:"raw",extension:"txt",content:a??""}},{fileName:"canonical",extension:"yaml",content:fe.dump(l.canonical),previewKey:"canonical",preview:{key:"canonical",extension:"yaml",content:fe.dump(l.canonical)}},{fileName:"demo",extension:"dxf",content:((h=l.demo)==null?void 0:h.dxf)??"",previewKey:"demo.svg",preview:{key:"demo.svg",extension:"svg",content:((c=l.demo)==null?void 0:c.svg)??""}},{fileName:"points",extension:"yaml",content:fe.dump(l.points),previewKey:"points",preview:{key:"points",extension:"yaml",content:fe.dump(l.points)}},{fileName:"units",extension:"yaml",content:fe.dump(l.units),previewKey:"units",preview:{key:"units",extension:"yaml",content:fe.dump(l.units)}}),l!=null&&l.outlines)for(const[m,b]of Object.entries(l.outlines))o.push({fileName:m,extension:"dxf",content:b.dxf??"",previewKey:`outlines.${m}.svg`,preview:{key:`outlines.${m}.svg`,extension:"svg",content:b.svg??""}});if(l!=null&&l.cases){for(const[m,b]of Object.entries(l.cases))if(o.push({fileName:m,extension:"jscad",content:b.jscad??"",previewKey:`cases.${m}`,preview:{key:`cases.${m}`,extension:"jscad",content:b.jscad??""}}),s.stlPreview&&b.jscad){const g=!!b.stl;o.push({fileName:m,extension:"stl",content:b.stl??"",previewKey:g?`cases.${m}.stl`:"",preview:g?{key:`cases.${m}.stl`,extension:"stl",content:b.stl??""}:void 0})}}if(l!=null&&l.pcbs)for(const[m,b]of Object.entries(l.pcbs)){const S=String(b).match(/version "?([0-9]+)"?/),w=S&&S.length>1?Number(S[1]):-1;o.push({fileName:m,extension:"kicad_pcb",content:b,previewKey:s.kicanvasPreview&&w>20240101?`pcbs.${m}`:"",preview:s.kicanvasPreview&&w>20240101?{key:`pcbs.${m}`,extension:"kicad_pcb",content:b}:void 0})}const d=o.filter(m=>!(!s.debug&&(m.fileName.startsWith("_")||{units:"yaml",points:"yaml",canonical:"yaml",raw:"txt"}[m.fileName]===m.extension||s.stlPreview&&m.extension==="jscad")));return n.jsxs(Qi,{"data-testid":i,children:[n.jsx(Zi,{children:"Outputs"}),d.length>0?d.map((m,b)=>n.jsx(Yi,{...m,setPreview:e,previewKey:t,"data-testid":i&&`${i}-${m.fileName}`},b)):n.jsx(es,{children:"No outputs"})]})},ns=u.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
`,os=u.div`
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${r.fontSizes.bodySmall};
  cursor: pointer;
  border-bottom: ${e=>e.$active?`2px solid ${r.colors.accent}`:"2px solid transparent"};
  border-top: 2px solid transparent;
`,rs=u.div`
  white-space: nowrap;
  display: flex;
  gap: 6px;
  align-items: center;
`,mr=Ko`
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
`,go=u.a`
  ${mr}
`,is=u.a`
  ${mr}

  @media (min-width: 640px) {
    display: none;
  }
`,Rt=({injection:e,setInjectionToEdit:t,deleteInjection:i,previewKey:o,"data-testid":s})=>{const[a,l]=p.useState("");return p.useEffect(()=>{const d=window.URL.createObjectURL(new Blob([e.content],{type:"octet/stream"}));return l(d),()=>{window.URL.revokeObjectURL(d)}},[e.content]),n.jsxs(ns,{"data-testid":s,children:[n.jsx(os,{"data-testid":s&&`${s}-name`,$active:o===e.name,onClick:()=>t(e),children:e.name}),n.jsxs(rs,{children:[n.jsx(is,{href:"#",onClick:d=>{d.preventDefault(),t(e)},"aria-label":`edit injection ${e.name}`,"data-testid":s&&`${s}-edit`,children:n.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),n.jsx(go,{href:"#",onClick:d=>{d.preventDefault(),i(e)},"aria-label":`delete injection ${e.name}`,"data-testid":s&&`${s}-delete`,children:n.jsx("span",{className:"material-symbols-outlined",children:"delete"})}),n.jsx(go,{target:"_blank",rel:"noopener noreferrer",download:`${e.name.split("/").reverse()[0]}.js`,href:a||void 0,"aria-label":`download injection ${e.name}`,"data-testid":s&&`${s}-download`,children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})]})]})},Ke=u.button`
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
`,_t=u.button`
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
`,ss=u(_t)`
  padding: ${r.buttonSizes.medium.padding};
  font-size: ${r.buttonSizes.medium.fontSize};
`,as=u(_t)`
  padding: ${r.buttonSizes.small.padding};
  font-size: ${r.buttonSizes.small.fontSize};
`,ls=u(_t)`
  padding: ${r.buttonSizes.icon.padding};
  font-size: ${r.buttonSizes.icon.fontSize};
`,pe=({size:e,...t})=>{switch(e){case"icon":return n.jsx(ls,{...t});case"sm":case"small":return n.jsx(as,{...t});case"md":case"medium":return n.jsx(ss,{...t});case"lg":case"large":default:return n.jsx(_t,{...t})}},cs=e=>e.charAt(0).toUpperCase()+e.slice(1),bt=({injectionName:e,injectionType:t,onResolve:i,onCancel:o,"data-testid":s})=>{const[a,l]=p.useState(!1),d=cs(t);return n.jsx(ds,{"data-testid":s,children:n.jsxs(us,{"data-testid":s&&`${s}-box`,children:[n.jsxs(ps,{children:[d," Conflict"]}),n.jsxs(fs,{children:["A ",t," with the name ",n.jsx("strong",{children:e})," ","already exists.",n.jsx("br",{}),"How would you like to resolve this conflict?"]}),n.jsxs(hs,{children:[n.jsx(gs,{type:"checkbox",id:"apply-to-all",checked:a,onChange:h=>l(h.target.checked),"data-testid":s&&`${s}-apply-to-all`,"aria-label":"Apply this choice to all conflicts"}),n.jsx(ms,{$checked:a,onClick:()=>l(!a),role:"checkbox","aria-checked":a}),n.jsx("label",{htmlFor:"apply-to-all",children:"Apply to all conflicts"})]}),n.jsxs(bs,{children:[n.jsx(pe,{onClick:()=>i("skip",a),size:"medium","data-testid":s&&`${s}-skip`,"aria-label":`Skip this ${t}`,children:"Skip"}),n.jsx(pe,{onClick:()=>i("overwrite",a),size:"medium","data-testid":s&&`${s}-overwrite`,"aria-label":`Overwrite existing ${t}`,children:"Overwrite"}),n.jsx(pe,{onClick:()=>i("keep-both",a),size:"medium","data-testid":s&&`${s}-keep-both`,"aria-label":`Keep both ${t}s`,children:"Keep Both"})]}),n.jsx(ws,{onClick:o,size:"small","data-testid":s&&`${s}-cancel`,"aria-label":"Cancel loading",children:"Cancel"})]})})},ds=u.div`
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
`,us=u.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`,ps=u.h2`
  margin: 0 0 1rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
`,fs=u.p`
  margin: 0 0 1.5rem 0;
  font-size: ${r.fontSizes.base};
  color: ${r.colors.textDark};
  line-height: 1.5;

  strong {
    color: ${r.colors.accent};
  }
`,hs=u.div`
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
`,gs=u.input`
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
`,ms=u.div`
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
`,bs=u.div`
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  margin-bottom: 1rem;
`,ws=u(pe)`
  width: 100%;
  background-color: ${r.colors.backgroundLighter};
  color: ${r.colors.textDark};

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`,pt=u.h3`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  margin: 1.5rem 0.5rem 1rem 0.5rem;
`,mo=e=>{const o=new DOMParser().parseFromString(e,"image/svg+xml").querySelectorAll("path"),s=[];return o.forEach(a=>{const l=a.getAttribute("d");if(l&&l.trim()){const d=l.replace(/\\/g,"\\\\").replace(/"/g,'\\"');s.push(`        "${d}"`)}}),`const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
${s.join(`,
`)}
    ];
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
};`},Dt=u.div`
  display: flex;
  margin-left: 0.5rem;
  margin-left: 0.5rem;
  gap: 8px;
  margin-top: 0.5rem;
`,Re=u(Ke)`
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
`,At=u.button`
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
`,ks=({setInjectionToEdit:e,deleteInjection:t,injectionToEdit:i,onInjectionSelect:o,"data-testid":s})=>{const a=[],l=[],d=[],h=p.useRef(null),c=p.useRef(null),m=p.useCallback(x=>{c.current=x,x&&(x.setAttribute("webkitdirectory",""),x.setAttribute("directory",""))},[]),b=ve(),[g,S]=p.useState("footprint"),[w,f]=p.useState("footprints"),{currentConflict:k,processInjectionsWithConflictResolution:C,handleConflictResolution:P,handleConflictCancel:L}=kt({setInjectionInput:x=>b==null?void 0:b.setInjectionInput(x),setConfigInput:x=>b==null?void 0:b.setConfigInput(x),generateNow:async(x,E,j)=>{await(b==null?void 0:b.generateNow(x,E,j))},getCurrentInjections:()=>(b==null?void 0:b.injectionInput)||[],setError:x=>b==null?void 0:b.setError(x)});if(!b)return null;const{injectionInput:I}=b;if(I&&Array.isArray(I)&&I.length>0)for(let x=0;x<I.length;x++){const E=I[x];if(E.length===3){let j=d;E[0]==="footprint"?j=a:E[0]==="outline"?j=l:E[0]==="template"&&(j=d),j.push({key:x,type:E[0],name:E[1],content:E[2]})}}const v=()=>{var j;const x=((j=b==null?void 0:b.injectionInput)==null?void 0:j.length)||0,E={key:x,type:"footprint",name:`custom_footprint_${x+1}`,content:`module.exports = {
  params: {
    designator: '',
  },
  body: p => \`\`
}`};M("injection_created",{injection_type:"footprint"}),e(E),o&&o()},W=()=>{var j;const x=((j=b==null?void 0:b.injectionInput)==null?void 0:j.length)||0,E={key:x,type:"outline",name:`custom_outline_${x+1}`,content:`const u = require('../utils');

module.exports = (config, name, points, outlines, units) => {
    const paths = [
        ""  // Add your SVG path(s) here
    ];
    return u.svg_paths_to_outline(paths, config, name, points, outlines, units);
};`};M("injection_created",{injection_type:"outline"}),e(E),o&&o()},R=()=>{var j;const x=((j=b==null?void 0:b.injectionInput)==null?void 0:j.length)||0,E={key:x,type:"template",name:`custom_template_${x+1}`,content:`const m = require('makerjs')
const version = require('../../package.json').version

module.exports = {
    convert_outline: (model, layer) => {
        return \`\`;  // Return your converted outlines
    },
    body: params => {
        return \`\`;  // Add your template text here
    }
}`};M("injection_created",{injection_type:"template"}),e(E),o&&o()},A=async x=>{const E=x.target.files;if(!E||E.length===0)return;const j=[];for(let U=0;U<E.length;U++){const F=E[U];if(F.name.endsWith(".js")){const D=await F.text(),K=F.name.replace(/\.js$/,"");j.push([g,K,D])}else if(g==="outline"&&F.name.endsWith(".svg")){const D=await F.text(),K=mo(D),J=F.name.replace(/\.svg$/,"");j.push([g,J,K])}}j.length>0&&(M("injection_uploaded",{injection_type:g,source:"file",file_count:j.length}),await C(j,b.configInput||"")),x.target.value=""},O=async x=>{const E=x.target.files;if(!E||E.length===0)return;const j=[];for(let U=0;U<E.length;U++){const F=E[U];if(F.name.endsWith(".js")){const D=await F.text(),K=F.webkitRelativePath.split("/");K.shift();const J=K.join("/").replace(/\.js$/,"");j.push([g,J,D])}else if(g==="outline"&&F.name.endsWith(".svg")){const D=await F.text(),K=F.webkitRelativePath.split("/");K.shift();const J=K.join("/").replace(/\.svg$/,""),ne=mo(D);j.push([g,J,ne])}}j.length>0&&(M("injection_uploaded",{injection_type:g,source:"folder",file_count:j.length}),await C(j,b.configInput||"")),x.target.value=""};return n.jsxs(xs,{"data-testid":s,children:[k&&n.jsx(bt,{injectionName:k.name,injectionType:k.type,onResolve:P,onCancel:L,"data-testid":"conflict-resolution-dialog"}),n.jsx(pt,{children:"Custom Libraries"}),n.jsxs(ys,{children:[n.jsx(At,{$active:w==="footprints",onClick:()=>{f("footprints"),S("footprint")},"data-testid":"tab-footprints",children:"Footprints"}),ce("outlines")&&n.jsx(At,{$active:w==="outlines",onClick:()=>{f("outlines"),S("outline")},"data-testid":"tab-outlines",children:"Outlines"}),ce("templates")&&n.jsx(At,{$active:w==="templates",onClick:()=>{f("templates"),S("template")},"data-testid":"tab-templates",children:"Templates"})]}),w==="footprints"&&n.jsxs(n.Fragment,{children:[a.map(x=>n.jsx(Rt,{injection:x,setInjectionToEdit:E=>{M("injection_editor_opened",{injection_type:E.type}),e(E),o&&o()},deleteInjection:t,previewKey:i.name,"data-testid":s&&`${s}-${x.name}`},x.key)),n.jsxs(Dt,{children:[n.jsx(Ke,{onClick:v,"data-testid":"add-footprint","aria-label":"Add new custom footprint",title:"Add footprint",children:n.jsx("span",{className:"material-symbols-outlined",children:"add"})}),n.jsx(Re,{onClick:()=>{S("footprint"),setTimeout(()=>{var x;return(x=h.current)==null?void 0:x.click()},0)},"data-testid":"load-footprint-files","aria-label":"Load custom footprint files",title:"Load footprint files",children:n.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),n.jsx(Re,{onClick:()=>{S("footprint"),setTimeout(()=>{var x;return(x=c.current)==null?void 0:x.click()},0)},"data-testid":"load-footprint-folder","aria-label":"Load custom footprint folder",title:"Load footprint folder",children:n.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),w==="outlines"&&ce("outlines")&&n.jsxs(n.Fragment,{children:[l.map(x=>n.jsx(Rt,{injection:x,setInjectionToEdit:E=>{M("injection_editor_opened",{injection_type:E.type}),e(E),o&&o()},deleteInjection:t,previewKey:i.name,"data-testid":s&&`${s}-${x.name}`},x.key)),n.jsxs(Dt,{children:[n.jsx(Ke,{onClick:W,"data-testid":"add-outline","aria-label":"Add new custom outline",title:"Add outline",children:n.jsx("span",{className:"material-symbols-outlined",children:"add"})}),n.jsx(Re,{onClick:()=>{S("outline"),setTimeout(()=>{var x;return(x=h.current)==null?void 0:x.click()},0)},"data-testid":"load-outline-files","aria-label":"Load custom outline files",title:"Load outline files",children:n.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),n.jsx(Re,{onClick:()=>{S("outline"),setTimeout(()=>{var x;return(x=c.current)==null?void 0:x.click()},0)},"data-testid":"load-outline-folder","aria-label":"Load custom outline folder",title:"Load outline folder",children:n.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),w==="templates"&&ce("templates")&&n.jsxs(n.Fragment,{children:[d.map(x=>n.jsx(Rt,{injection:x,setInjectionToEdit:E=>{M("injection_editor_opened",{injection_type:E.type}),e(E),o&&o()},deleteInjection:t,previewKey:i.name,"data-testid":s&&`${s}-${x.name}`},x.key)),n.jsxs(Dt,{children:[n.jsx(Ke,{onClick:R,"data-testid":"add-template","aria-label":"Add new custom template",title:"Add template",children:n.jsx("span",{className:"material-symbols-outlined",children:"add"})}),n.jsx(Re,{onClick:()=>{S("template"),setTimeout(()=>{var x;return(x=h.current)==null?void 0:x.click()},0)},"data-testid":"load-template-files","aria-label":"Load custom template files",title:"Load template files",children:n.jsx("span",{className:"material-symbols-outlined",children:"upload_file"})}),n.jsx(Re,{onClick:()=>{S("template"),setTimeout(()=>{var x;return(x=c.current)==null?void 0:x.click()},0)},"data-testid":"load-template-folder","aria-label":"Load custom template folder",title:"Load template folder",children:n.jsx("span",{className:"material-symbols-outlined",children:"drive_folder_upload"})})]})]}),n.jsx("input",{type:"file",ref:h,onChange:A,accept:g==="outline"?".js,.svg":".js",multiple:!0,style:{display:"none"}}),n.jsx("input",{type:"file",ref:m,onChange:O,accept:g==="outline"?".js,.svg":".js",style:{display:"none"}})]})},_s=u.img`
  filter: invert();
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
`,vs=u(Nr.PanZoom)`
  overflow: hidden;
  height: 100%;

  &:focus-visible {
    outline: none;
  }
`,js=({svg:e,width:t,height:i,"aria-label":o,"data-testid":s})=>n.jsx(vs,{enableBoundingBox:!0,minZoom:.8,maxZoom:5,"aria-label":o,"data-testid":s,children:n.jsx(_s,{width:t||"100%",height:i||"100%",src:`data:image/svg+xml;utf8,${encodeURIComponent(e)}`,alt:"Ergogen SVG Output preview",draggable:"false"})}),Nt=({content:e,language:t,className:i,height:o,options:s,"aria-label":a,"data-testid":l})=>n.jsx("div",{className:i,"aria-label":a,"data-testid":l,children:n.jsx(Ur,{height:o||"80vh",language:t,value:e,theme:"ergogen-theme",options:s||{readOnly:!0}})}),$s=p.lazy(()=>er(()=>import("./PcbPreview-BI1R2Mfv.js"),__vite__mapDeps([0,1]))),Cs=p.lazy(()=>er(()=>import("./StlPreview-C8ErO2qZ.js"),__vite__mapDeps([2,1,3,4,5]))),br=u.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: ${r.colors.background};
`,wr=u.img`
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
`,bo=()=>n.jsxs(br,{children:[n.jsx(wr,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"}),n.jsx(Ss,{children:"Loading preview..."})]}),Es=({previewExtension:e,previewContent:t,previewKey:i,width:o="100%",height:s="100%",className:a,"data-testid":l,"aria-label":d})=>{if(!t||typeof t=="string"&&t===""||t instanceof ArrayBuffer&&t.byteLength===0||ArrayBuffer.isView(t)&&t.byteLength===0)return n.jsx(br,{className:a,"data-testid":l,"aria-label":d,children:n.jsx(wr,{src:"/ergogen.png",alt:"Ergogen Logo",draggable:"false"})});const c=m=>{switch(m){case"svg":return n.jsx(js,{svg:t,width:o,height:s,"aria-label":d||`SVG preview for ${i}`,"data-testid":l&&`${l}-svg`});case"yaml":return n.jsx(Nt,{language:"yaml",content:t,"aria-label":d||`YAML preview for ${i}`,"data-testid":l&&`${l}-yaml`});case"txt":return n.jsx(Nt,{language:"text",content:t,"aria-label":d||`Text preview for ${i}`,"data-testid":l&&`${l}-txt`});case"jscad":return n.jsx(Nt,{language:"javascript",content:t,"aria-label":d||`JSCAD code preview for ${i}`,"data-testid":l&&`${l}-jscad-text`});case"kicad_pcb":return n.jsx(p.Suspense,{fallback:n.jsx(bo,{}),children:n.jsx($s,{pcb:t,previewKey:i,"aria-label":d||`PCB preview for ${i}`,"data-testid":l&&`${l}-pcb`},i)});case"stl":return n.jsx(p.Suspense,{fallback:n.jsx(bo,{}),children:n.jsx(Cs,{stl:t,"aria-label":d||`STL preview for ${i}`,"data-testid":l&&`${l}-stl`})});default:return"No preview available"}};return n.jsx("div",{className:a,"data-testid":l,"aria-label":d,children:c(e)})},Ut=({children:e,initialWidth:t=300,minWidth:i=10,maxWidth:o="100%",side:s="left",style:a,"data-testid":l})=>{const[d,h]=p.useState(t),c=p.useRef(!1),m=p.useRef(0),b=p.useRef(t),g=p.useRef(null),S=f=>{if(typeof f=="string"&&f.includes("%")){const k=parseFloat(f)/100;return window.innerWidth*k}else return typeof f=="string"&&f.includes("px")?parseFloat(f):typeof f=="number"?f:1/0};p.useEffect(()=>{const f=L=>{if(!c.current)return;const I=s==="left"?L.clientX-m.current:m.current-L.clientX,v=b.current+I,W=S(o),R=Math.max(i,Math.min(v,W));h(R)},k=()=>{c.current&&(c.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},C=L=>{if(!c.current)return;L.preventDefault();const I=L.touches[0],v=s==="left"?I.clientX-m.current:m.current-I.clientX,W=b.current+v,R=S(o),A=Math.max(i,Math.min(W,R));h(A)},P=()=>{c.current&&(c.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",f),window.addEventListener("mouseup",k),window.addEventListener("touchmove",C,{passive:!1}),window.addEventListener("touchend",P),()=>{window.removeEventListener("mousemove",f),window.removeEventListener("mouseup",k),window.removeEventListener("touchmove",C),window.removeEventListener("touchend",P)}},[i,o,s]);const w=f=>{f.preventDefault(),f.stopPropagation(),c.current=!0,b.current=d,"touches"in f?m.current=f.touches[0].clientX:m.current=f.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};return n.jsxs(Ps,{ref:g,$side:s,style:{width:`${d}px`,...a},"data-testid":l,children:[e,n.jsx(Is,{$side:s,onMouseDown:w,onTouchStart:w,"data-testid":l&&`${l}-resize-handle`})]})},Ps=u.div`
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
`,Zt=(e,t)=>{if(t===null)return null;if(e==="")return t;if(typeof t!="object")return;const i=e.split("."),o=i[0],s=i.slice(1).join(".");return Object.prototype.hasOwnProperty.call(t,o)?Zt(s,t[o]):void 0},Ls=(e,t,i,o="")=>{let s=t,a=i,l=null;e&&(l=Zt(s,e),l===void 0&&s!=="demo.svg"&&(s="demo.svg",a="svg",l=Zt(s,e)));let d="";switch(a){case"svg":case"kicad_pcb":d=typeof l=="string"?l:"";break;case"stl":d=typeof l=="string"||l instanceof ArrayBuffer||ArrayBuffer.isView(l)?l:"";break;case"jscad":d=typeof(l==null?void 0:l.jscad)=="string"?l.jscad:"";break;case"yaml":d=fe.dump(l);break;case"txt":d=o;break;default:d=""}return{key:s,extension:a,content:d}};function xr(){if(typeof navigator<"u"){if("userAgentData"in navigator&&navigator.userAgentData){const e=navigator.userAgentData;if(e.platform&&/mac/i.test(e.platform))return!0}if(/Mac|iPhone|iPad|iPod/i.test(navigator.userAgent))return!0}return!1}const zs=u.input.attrs(e=>({type:"text",$size:e.$size||"0.5em"}))`
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
`,Qt=u.span`
  color: ${r.colors.textDarker};
  font-size: ${r.fontSizes.sm};
  margin-top: 0.25rem;
  line-height: 1.4;
`,Vs=u(Qt)`
  color: ${r.colors.warningDark};
`,Hs=u.div`
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
`,qs=({isAvailable:e,isInstalled:t,isInstalling:i,onInstall:o})=>{let s,a;return t?(s=n.jsx(Qt,{children:"The application is installed and available offline."}),a=n.jsx(pe,{size:"sm",disabled:!0,"data-testid":"pwa-installed-button",children:"Installed"})):e?(s=n.jsx(Qt,{children:"Install the app locally to access it offline without network connectivity."}),i?a=n.jsx(pe,{size:"sm",disabled:!0,"data-testid":"pwa-installing-button",children:"Installing..."}):a=n.jsx(pe,{size:"sm",onClick:o,"data-testid":"pwa-install-button",children:"Install App"})):(s=n.jsx(Vs,{children:"PWA installation is not supported by your browser or environment."}),a=n.jsx(pe,{size:"sm",disabled:!0,"data-testid":"pwa-unavailable-button",children:"Unavailable"})),n.jsxs(Bs,{children:[n.jsxs(Ts,{children:[n.jsx(Gs,{children:"Offline App"}),s]}),n.jsx(Hs,{children:a})]})},Ks=(e,t,i,o)=>{const s={config:e,...t&&t.length>0?{injections:t}:{},guiVersion:xt.version,ergogenVersion:dn("github:ceoloide/ergogen#v4.3.0")},a=JSON.stringify(s);return Jo.compressToEncodedURIComponent(a)},Js=()=>new URLSearchParams(window.location.search).get("debug")!==null,Xs=e=>{var i;const t=Js();try{const o=Jo.decompressFromEncodedURIComponent(e);if(!o)return console.error("[Share] DECODE_ERROR: Failed to decompress encoded string"),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The encoded data could not be decompressed."};let s;try{s=JSON.parse(o)}catch(l){return console.error("[Share] DECODE_ERROR: Failed to parse decompressed JSON",{parseError:l,decompressedLength:o.length,decompressedPreview:o.substring(0,100)}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. The decompressed data is not valid JSON."}}if(!s||typeof s!="object"||!("config"in s)||typeof s.config!="string")return console.error("[Share] VALIDATION_ERROR: Invalid object structure",{parsed:s,hasConfig:s&&typeof s=="object"&&"config"in s,configType:s&&typeof s=="object"&&"config"in s?typeof s.config:"N/A"}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link does not contain a valid configuration. The decoded data is missing required fields or has an invalid structure."};const a=s;return(!a.guiVersion||typeof a.guiVersion!="string")&&(a.guiVersion="0.9.0"),(!a.ergogenVersion||typeof a.ergogenVersion!="string")&&(a.ergogenVersion="github:ergogen/ergogen#v4.2.1"),"injections"in a&&a.injections!==void 0&&(!Array.isArray(a.injections)||!a.injections.every(l=>Array.isArray(l)&&l.length===3&&typeof l[0]=="string"&&typeof l[1]=="string"&&typeof l[2]=="string"))?(console.error("[Share] VALIDATION_ERROR: Invalid injections structure",{injections:a.injections,isArray:Array.isArray(a.injections)}),{success:!1,error:"VALIDATION_ERROR",message:"The shared configuration link contains invalid injections data. Injections must be an array of [type, name, content] tuples."}):(t&&console.log("[Share] DEBUG: Decoded configuration object",{configLength:a.config.length,hasInjections:a.injections!==void 0,injectionsCount:((i=a.injections)==null?void 0:i.length)??0,fullObject:a}),{success:!0,config:a})}catch(o){return console.error("[Share] DECODE_ERROR: Unexpected error during decoding",{error:o,errorMessage:o instanceof Error?o.message:String(o),errorStack:o instanceof Error?o.stack:void 0}),{success:!1,error:"DECODE_ERROR",message:"The shared configuration link is invalid or corrupted. An unexpected error occurred while decoding."}}},Ys=e=>{const{config:t,injections:i,canonical:o}=e;let s=i;if(o&&i&&i.length>0){const h=kr(o);s=Zs(i,h)}const a=s&&s.length>0?s:void 0,l=Ks(t,a);return`${window.location.origin+window.location.pathname}#${l}`},yr=()=>{const e=window.location.hash;if(!e||e.length<=1)return null;const t=e.substring(1);return Xs(t)},kr=e=>{const t=new Set,i=new Set,o=new Set;if(!e||typeof e!="object")return{footprints:t,templates:i,outlines:o};const s=e;if(s.pcbs&&typeof s.pcbs=="object"){for(const a of Object.values(s.pcbs))if(!(!a||typeof a!="object")&&(typeof a.template=="string"&&i.add(a.template),a.footprints&&typeof a.footprints=="object"))for(const l of Object.values(a.footprints))l&&typeof l.what=="string"&&t.add(l.what)}if(s.outlines&&typeof s.outlines=="object")for(const a of Object.values(s.outlines)){if(!a||typeof a!="object")continue;const l=Array.isArray(a)?a:Object.values(a);for(const d of l){const h=d;h&&typeof h.what=="string"&&o.add(h.what)}}return{footprints:t,templates:i,outlines:o}},Zs=(e,t)=>!e||e.length===0?[]:e.filter(i=>{const[o,s]=i;return o==="footprint"?t.footprints.has(s):o==="template"?t.templates.has(s):o==="outline"?t.outlines.has(s):!0}),wo=async(e,t,i,o)=>{try{await navigator.clipboard.writeText(e),t(!0),o==null||o(),i.current&&clearTimeout(i.current),i.current=setTimeout(()=>{t(!1)},2500)}catch(s){console.error("Failed to copy shareable URI to clipboard:",s);try{const a=document.createElement("textarea");a.value=e,a.style.position="fixed",a.style.opacity="0",document.body.appendChild(a),a.select();const l=document.execCommand("copy");if(document.body.removeChild(a),!l){console.error("Fallback copy method was rejected by the browser.");return}t(!0),o==null||o(),i.current&&clearTimeout(i.current),i.current=setTimeout(()=>{t(!1)},2500)}catch(a){console.error("Fallback copy method also failed:",a)}}},_r=({config:e,injections:t,onClose:i,"data-testid":o})=>{const s=Xo.useMemo(()=>t||[],[t]),[a,l]=p.useState(1),[d,h]=p.useState(!0),[c,m]=p.useState(!1),[b,g]=p.useState(null),[S,w]=p.useState(""),[f,k]=p.useState([]),[C,P]=p.useState(!1),[L,I]=p.useState(!1),v=p.useRef(null),W=p.useRef(null);p.useEffect(()=>{if(!d||C||s.length===0||a!==1)return;let j=!0;m(!0),g(null);const U=ln();if(!U){g("Could not initialize background worker."),m(!1);return}return U.onmessage=F=>{var K;if(!j)return;const D=F.data;if(D.type==="success"){const J=(K=D.results)==null?void 0:K.canonical,{footprints:ne,templates:Z,outlines:B}=kr(J),N=s.map(([T,Q,G])=>{let y;return T==="footprint"?y=ne.has(Q):T==="template"?y=Z.has(Q):T==="outline"?y=B.has(Q):y=!0,{type:T,name:Q,content:G,checked:y,isEligible:y}}).filter(T=>T.isEligible).map(({type:T,name:Q,content:G,checked:y})=>({type:T,name:Q,content:G,checked:y}));k(N),P(!0)}else D.type==="error"&&g(D.error||"Failed to analyze configuration.");m(!1),U.terminate()},U.onerror=()=>{j&&(g("Worker encountered an error during analysis."),m(!1),U.terminate())},U.postMessage({type:"generate",inputConfig:e,injectionInput:s,requestId:`share-analysis-${Date.now()}`,options:{debug:!0}}),()=>{j=!1,U.terminate()}},[d,C,s,e,a]);const R=p.useRef(0);R.current=d?f.filter(j=>j.checked).length:0;const A=p.useCallback(j=>{M("share_link_copied",{has_injections:R.current>0,injections_count:R.current,source:j})},[]);p.useEffect(()=>{a===2&&S&&wo(S,I,W,()=>{A("auto")})},[S,a,A]),p.useEffect(()=>{const j=U=>{U.key==="Escape"&&i()};return window.addEventListener("keydown",j),()=>{window.removeEventListener("keydown",j)}},[i]),p.useEffect(()=>{a===2&&v.current&&(v.current.focus(),v.current.select())},[a]),p.useEffect(()=>{const j=W;return()=>{j.current&&clearTimeout(j.current)}},[]);const O=j=>{k(U=>U.map((F,D)=>D===j?{...F,checked:!F.checked}:F))},x=()=>{const j=d?f.filter(D=>D.checked):[],U=j.length>0?j.map(D=>[D.type,D.name,D.content]):void 0,F=Ys({config:e,injections:U});w(F),l(2)},E=()=>{wo(S,I,W,()=>{A("button")})};return n.jsx(Qs,{"data-testid":o,onClick:j=>{j.target===j.currentTarget&&i()},children:n.jsxs(ea,{"data-testid":o&&`${o}-box`,onClick:j=>j.stopPropagation(),children:[n.jsx(ta,{onClick:i,"data-testid":o&&`${o}-close`,"aria-label":"Close dialog",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})}),a===1?n.jsxs(n.Fragment,{children:[n.jsx(xo,{children:"Share Configuration"}),n.jsx(yo,{children:"Configure what content should be included when sharing your keyboard design."}),n.jsx(na,{children:n.jsxs(oa,{htmlFor:"include-libraries-toggle",children:[n.jsx(ra,{id:"include-libraries-toggle",type:"checkbox",checked:d,onChange:j=>{const U=j.target.checked;h(U),U||(m(!1),g(null))},"aria-label":"Include custom libraries"}),n.jsx(ia,{$checked:d}),n.jsx("span",{children:"Include custom libraries"})]})}),d&&n.jsxs(n.Fragment,{children:[c&&n.jsxs(sa,{children:[n.jsx(aa,{}),n.jsx("span",{children:"Analyzing configuration..."})]}),b&&n.jsx(la,{children:b}),!c&&!b&&s.length===0&&n.jsx(ko,{children:"No custom libraries loaded."}),!c&&!b&&s.length>0&&f.length===0&&n.jsx(ko,{children:"No custom footprints or libraries are used in this configuration."}),!c&&!b&&f.length>0&&n.jsx(ca,{children:f.map((j,U)=>n.jsxs(da,{children:[n.jsx(ua,{id:`injection-${j.name}`,type:"checkbox",checked:j.checked,onChange:()=>O(U),"aria-label":j.name}),n.jsx(fa,{$type:j.type,children:j.type}),n.jsx(pa,{htmlFor:`injection-${j.name}`,children:j.name})]},`${j.type}-${j.name}`))})]}),n.jsx(_o,{children:n.jsx(ha,{onClick:x,disabled:c,children:"Share"})})]}):n.jsxs(n.Fragment,{children:[n.jsx(xo,{children:"Shareable Configuration Link"}),n.jsx(yo,{children:"Share this link with others to let them view and use your keyboard configuration, including all of your custom footprints."}),n.jsxs(ga,{children:[n.jsx(ma,{ref:v,type:"text",value:S,readOnly:!0,"data-testid":o&&`${o}-input`,"aria-label":"Share link"}),n.jsx(_o,{children:n.jsxs(ba,{onClick:E,"data-testid":o&&`${o}-copy`,"aria-label":L?"Link copied":"Copy link",children:[n.jsx("span",{className:"material-symbols-outlined",children:L?"check":"content_copy"}),L?"Link copied":"Copy link"]})})]})]})]})})},Qs=u.div`
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
`,xo=u.h2`
  margin: 0 0 1rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
  padding-right: 3rem;
`,yo=u.p`
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
`,ko=u.p`
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
`,_o=u.div`
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
`,wa=e=>e.replace(/[/\\?%*:|"<>]/g,"_")||"Untitled",vo=(e,t)=>{const i=wa(t);let o=i,s=1;for(;e.has(o);)o=`${i}_${s}`,s++;return e.add(o),o},en=(e,t)=>{const i=new Map;for(const o of t){const[s,a,l]=o;let d="footprints";s==="outline"?d="outlines":s==="template"&&(d="templates");const h=e.folder(d);if(h){const c=a.split("/"),m=c.pop();let b=h,g=d;for(const S of c){const w=`${g}/${S}`;let f=i.get(w);f||(f=b.folder(S)||b,i.set(w,f)),b=f,g=w}m&&b.file(`${m}.js`,l)}}},vr=(e,t,i,o,s)=>{var a;if((a=i.demo)!=null&&a.svg&&e.file("demo.svg",i.demo.svg),i.outlines){let l=null;for(const[d,h]of Object.entries(i.outlines))(o||!d.startsWith("_"))&&(h.dxf||h.svg)&&(l||(l=e.folder("outlines")),l&&(h.dxf&&l.file(`${d}.dxf`,h.dxf),h.svg&&l.file(`${d}.svg`,h.svg)))}if(i.pcbs&&Object.keys(i.pcbs).length>0){const l=e.folder("pcbs");if(l)for(const[d,h]of Object.entries(i.pcbs)){const c=d.endsWith(".kicad_pcb")?d:`${d}.kicad_pcb`;l.file(c,h)}}if(i.cases){let l=null;for(const[d,h]of Object.entries(i.cases)){const c=!!h.jscad,m=s&&!!h.stl;(c||m)&&(l||(l=e.folder("cases")),l&&(h.jscad&&l.file(`${d}.jscad`,h.jscad),m&&h.stl&&l.file(`${d}.stl`,h.stl)))}}if(o){const l=e.folder("debug");if(l){l.file("raw.txt",t);for(const[d,h]of Object.entries(i))["canonical","points","units"].includes(d)&&l.file(`${d}.yaml`,JSON.stringify(h,null,2))}}},tn=async(e,t)=>{const i=await e.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:9}}),o=new Date().toISOString().replace(/[:.]/g,"-").split("T")[0];Wr.saveAs(i,`${t}-${o}.zip`)},jr=async(e,t,i,o,s)=>{const a=new an;a.file("config.yaml",t);const l=a.folder("outputs");l&&vr(l,t,e,o,s),i&&i.length>0&&en(a,i),await tn(a,"ergogen")},xa=u.span`
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
`;function ya(){return n.jsx(n.Fragment,{children:n.jsxs("span",{children:[xr()?"⌘":"Ctrl"," ⏎"]})})}const ka=u.div`
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
`,_a=u.div`
  flex-grow: 1;
`,jo=u(Ne)`
  display: none;

  @media (max-width: 475px) {
    display: flex;
  }
`,va=u.button`
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
`,$o=u.div`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
`,ja=u.div`
  display: flex;
  gap: 10px;
  align-items: stretch;
  padding: 10px;

  @media (max-width: 639px) {
    display: none;
  }
`,$a=u.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  overflow: hidden;
  padding: 0;
`,Co=u(Es)`
  height: 100%;
`,Ca=u.div`
  height: 100%;
  overflow-y: auto;
`,Sa=u(Bi)`
  position: relative;
  flex-grow: 1;
  min-height: 0;
`,Ea=u.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`,Pa=u.div`
  height: 100%;
  overflow-y: auto;
  padding: 0.5rem;

  @media (min-width: 640px) {
    padding: 1rem;
  }
`,Ia=u.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 640px) {
    display: none;
  }
`,La=u.button`
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
`,So=u.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: row;

  @media (max-width: 639px) {
    width: ${e=>e.$fullWidth?"100%":"auto"};
  }
`,Eo=u.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
`,za=u.div`
  display: flex;
  height: 100%;
  width: 100%;
`,Ra=({pwaState:e})=>{const t=()=>Math.max(200,window.innerWidth*.33),i=()=>Math.max(150,window.innerWidth*.15),o=()=>Math.max(350,window.innerWidth*.15),[s,a]=p.useState({key:"demo.svg",extension:"svg",content:""}),[l,d]=p.useState(!1),h=x=>{a(x),f!=null&&f.showConfig||f==null||f.setShowDownloads(!1)},[c,m]=p.useState({key:-1,type:"",name:"",content:""}),[b,g]=p.useState(!1),[S,w]=p.useState(window.innerWidth<=639),f=ve(),k=!0;p.useEffect(()=>{const x=()=>{w(window.innerWidth<=639)};return window.addEventListener("resize",x),()=>window.removeEventListener("resize",x)},[]),Or(xr()?"meta+enter":"ctrl+enter",x=>{var E,j;(j=(E=x==null?void 0:x.target)==null?void 0:E.closest)!=null&&j.call(E,".monaco-editor")||f&&(M("shortcut_used",{action:"generate"}),f.generateNow(Yt(f),f.injectionInput,{pointsonly:!1,isManual:!0}))},{enableOnFormTags:!0,preventDefault:!0,ignoreEventWhen:x=>{var E,j;return!!((j=(E=x.target)==null?void 0:E.closest)!=null&&j.call(E,".monaco-editor"))}}),p.useEffect(()=>{if(c.key===-1||c.name===""||c.content==="")return;const x=[c.type,c.name,c.content];let E=[];Array.isArray(f==null?void 0:f.injectionInput)&&(E=[...f.injectionInput]);const j=E.length;if(j===0||j===c.key)E.push(x),m({...c,key:j});else{const U=E[c.key];if(U[0]===c.type&&U[1]===c.name&&U[2]===c.content)return;E=E.map((F,D)=>D===c.key?x:F)}f==null||f.setInjectionInput(E)},[f,c]);const C=Yt(f),P=Ls(f==null?void 0:f.results,s.key,s.extension,C),L=p.useRef(null),I=!!(f!=null&&f.results);if(p.useEffect(()=>{if(!I){L.current=null;return}if(!P.key||!P.extension)return;const x=`${P.key}|${P.extension}`;L.current!==x&&(L.current=x,M("preview_loaded",{preview_type:P.extension,preview_key:P.key}))},[P.key,P.extension,I]),!f)return null;const v=x=>{const E={...c,name:x.target.value};m(E)},W=x=>{if(!Array.isArray(f==null?void 0:f.injectionInput))return;M("injection_deleted",{injection_type:x.type});const E=[...f.injectionInput].filter((j,U)=>U!==x.key);if(f.setInjectionInput(E),c.key===x.key)m({key:-1,type:"",name:"",content:""});else if(c.key>=x.key){const j={...c,key:c.key-1};m(j)}},R=()=>{var U;const x=((U=f.getRealtimeConfigInput)==null?void 0:U.call(f))??f.configInput;if(x===void 0)return;M("download_button_clicked",{download_type:"yaml",source:"editor"});const E=document.createElement("a"),j=new Blob([x],{type:"text/yaml"});E.href=URL.createObjectURL(j),E.download="config.yaml",document.body.appendChild(E),E.click(),URL.revokeObjectURL(E.href),document.body.removeChild(E)},A=()=>{var x,E;C&&(M("share_button_clicked",{has_injections:!!((x=f.injectionInput)!=null&&x.length),injections_count:((E=f.injectionInput)==null?void 0:E.length)||0,source:"subheader"}),d(!0))},O=()=>{var x,E,j;!f.results||!C||f.isGenerating||f.isJscadConverting||(M("archive_single_downloaded",{has_injections:!!((x=f.injectionInput)!=null&&x.length),injections_count:((E=f.injectionInput)==null?void 0:E.length)||0,stored_configs_count:((j=f.configs)==null?void 0:j.length)||0,source:"subheader"}),jr(f.results,C,f.injectionInput,f.debug,f.stlPreview))};return n.jsxs(n.Fragment,{children:[l&&n.jsx(_r,{config:C,injections:f.injectionInput||[],onClose:()=>d(!1)}),n.jsxs($a,{children:[!f.showSettings&&n.jsxs(ka,{children:[n.jsx(Ne,{className:f.showConfig?"active":"",onClick:()=>f.setShowConfig(!0),"aria-label":"Show configuration panel","data-testid":"mobile-config-button",children:"Config"}),n.jsx(Ne,{className:f.showConfig?"":"active",onClick:()=>f.setShowConfig(!1),"aria-label":"Show outputs panel","data-testid":"mobile-outputs-button",children:"Outputs"}),n.jsx(_a,{}),f.showConfig&&n.jsxs(n.Fragment,{children:[n.jsx(va,{onClick:()=>f.generateNow(C,f.injectionInput,{pointsonly:!1,isManual:!0}),"aria-label":"Generate configuration","data-testid":"mobile-generate-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"refresh"})}),n.jsx(jo,{onClick:A,disabled:!C,"aria-label":"Share configuration","data-testid":"mobile-share-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"share"})}),n.jsx(Ne,{onClick:R,"aria-label":"Download configuration","data-testid":"mobile-download-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})]}),!f.showConfig&&n.jsxs(n.Fragment,{children:[n.jsx(jo,{onClick:O,disabled:f.isGenerating||f.isJscadConverting,"aria-label":"Download archive of all generated files","data-testid":"mobile-download-outputs-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),n.jsx(Ne,{onClick:()=>f.setShowDownloads(!f.showDownloads),"aria-label":f.showDownloads?"Hide downloads panel":"Show downloads panel","data-testid":"mobile-downloads-toggle-button",children:n.jsx("span",{className:"material-symbols-outlined",children:f.showDownloads?"expand_content":"collapse_content"})})]})]}),n.jsx(za,{children:f.showSettings?n.jsxs(n.Fragment,{children:[n.jsx(Ut,{initialWidth:o(),minWidth:150,maxWidth:"70%",side:"left","data-testid":"settings-panel",style:{display:b&&S?"none":void 0},children:n.jsxs(Pa,{children:[n.jsxs(Ea,{children:[n.jsx(rt,{children:"General"}),n.jsxs(it,{children:[n.jsx(De,{optionId:"autogen",label:"Auto-generate",description:"Automatically generate new outputs and update previews on changes.",setSelected:f.setAutoGen,checked:f.autoGen,"aria-label":"Enable auto-generate"}),n.jsx(De,{optionId:"autogen3d",label:"Auto-generate PCB & 3D",description:"Build 3D models and PCB files during generation (can be slow).",setSelected:f.setAutoGen3D,checked:f.autoGen3D,"aria-label":"Enable auto-generate PCB and 3D (slow)"}),n.jsx(De,{optionId:"debug",label:"Debug",description:"Include debug files in the outputs.",setSelected:f.setDebug,checked:f.debug,"aria-label":"Enable debug mode"})]}),n.jsx(rt,{children:"Previews (Experimental)"}),n.jsxs(it,{children:[n.jsx(De,{optionId:"kicanvasPreview",label:"KiCad Preview",description:"Render interactive PCB layouts using KiCanvas.",setSelected:f.setKicanvasPreview,checked:f.kicanvasPreview,"aria-label":"Enable KiCad preview (experimental)"}),n.jsx(De,{optionId:"stlPreview",label:"STL Preview",description:"Render 3D preview of generated cases.",setSelected:f.setStlPreview,checked:f.stlPreview,"aria-label":"Enable STL preview (experimental)"})]}),n.jsx(rt,{children:"Privacy"}),n.jsx(it,{children:n.jsx(De,{optionId:"sendUsageMetrics",label:"Send Usage Metrics",description:k?"Help improve Ergogen Web UI by sharing anonymous usage statistics.":"Unavailable: this copy of Ergogen Web UI was built without an analytics tag ID, so no usage statistics are sent.",setSelected:f.setSendUsageMetrics,checked:k&&f.sendUsageMetrics,disabled:!k,"aria-label":"Send usage metrics"})}),e&&n.jsxs(n.Fragment,{children:[n.jsx(rt,{children:"Offline"}),n.jsx(it,{children:n.jsx(qs,{isAvailable:e.isAvailable,isInstalled:e.isInstalled,isInstalling:e.isInstalling,onInstall:e.onInstall})})]})]}),n.jsx(ks,{setInjectionToEdit:m,deleteInjection:W,injectionToEdit:c,onInjectionSelect:()=>g(!0),"data-testid":"injections-container"})]})}),n.jsx(So,{$fullWidth:b&&S,children:n.jsxs($o,{children:[S&&n.jsxs(Ia,{children:[n.jsxs(pt,{as:"h4",style:{marginTop:0},children:[c.type?c.type.charAt(0).toUpperCase()+c.type.slice(1):"Footprint"," ","name"]}),n.jsx(La,{onClick:()=>{g(!1),m({key:-1,type:"",name:"",content:""})},"aria-label":"Close editor","data-testid":"mobile-editor-close",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),!S&&n.jsxs(pt,{as:"h4",children:[c.type?c.type.charAt(0).toUpperCase()+c.type.slice(1):"Footprint"," ","name"]}),n.jsx(zs,{value:c.name,onChange:v,disabled:c.key===-1,"aria-label":`${c.type?c.type.charAt(0).toUpperCase()+c.type.slice(1):"Footprint"} name`,"data-testid":"footprint-name-input"}),n.jsxs(pt,{as:"h4",children:[c.type?c.type.charAt(0).toUpperCase()+c.type.slice(1):"Footprint"," ","code"]}),n.jsx(Ti,{injection:c,setInjection:m,options:{readOnly:c.key===-1}})]})})]}):n.jsxs(n.Fragment,{children:[f.showConfig&&n.jsx(Ut,{initialWidth:t(),minWidth:250,maxWidth:"60%",side:"left","data-testid":"config-panel",children:n.jsxs($o,{children:[n.jsx(Sa,{"data-testid":"config-editor"}),n.jsxs(ja,{children:[n.jsx(Ke,{onClick:()=>f.generateNow(C,f.injectionInput,{pointsonly:!1,isManual:!0}),"aria-label":"Generate configuration","data-testid":"generate-button",children:n.jsxs("span",{style:{display:"flex",alignItems:"center",width:"100%",justifyContent:"center"},children:[n.jsx("span",{children:"Generate"}),n.jsx(xa,{children:ya()})]})}),n.jsx(Ne,{onClick:R,"aria-label":"Download configuration","data-testid":"download-config-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"download"})})]})]})}),n.jsx(So,{$fullWidth:!f.showConfig,children:f.showDownloads?n.jsxs(n.Fragment,{children:[n.jsx(Eo,{children:n.jsx(Co,{"data-testid":`${P.key}-file-preview`,previewExtension:P.extension,previewKey:`${P.key}-${f.resultsVersion}`,previewContent:P.content})}),n.jsx(Ut,{initialWidth:i(),minWidth:105,maxWidth:"30%",side:"right","data-testid":"downloads-panel",children:n.jsx(Ca,{children:n.jsx(ts,{setPreview:h,previewKey:P.key,"data-testid":"downloads-container"})})})]}):n.jsx(Eo,{children:n.jsx(Co,{"data-testid":`${P.key}-file-preview`,previewExtension:P.extension,previewKey:`${P.key}-${f.resultsVersion}`,previewContent:P.content})})})]})})]})]})},Da={label:"Absolem",author:"MrZealot",value:`meta:
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
    distance: 223.7529778`},Aa={label:"Atreus",author:"MrZealot",value:`points:
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
          rotate: 90`},nn={label:"Empty YAML configuration",author:"ceoloide",value:`meta:
  engine: 4.1.0
units:
points:
  zones:
    matrix:
outlines:
pcbs:
cases:
`},Wa={label:"Wubbo",author:"cache.works",value:`meta:
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
`},Oa={label:"Sweep-like",author:"jcmkk3",value:`meta:
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
`},qa=[nn],Ka=[Da,Aa],Ja=[Na,Ua,Oa,Fa,Ma],Xa=[Wa,Ba,Ta,Ga,Va,Ha],Ya=[{label:"Empty configurations",options:qa},{label:"Simple (points only)",options:Ka},{label:"Complete (with pcb)",options:Ja},{label:"Miscellaneous",options:Xa}],Za=e=>{var o;const t=fe.load(e.value),i=((o=t==null?void 0:t.meta)==null?void 0:o.engine)??(t==null?void 0:t["meta.engine"]);return i===null?void 0:i},Qa=(e,t=Je())=>{const i=Za(e);return i===void 0?!0:typeof i=="string"&&ui(t,i)},el=(e=Je())=>Ya.map(t=>({...t,options:t.options.filter(i=>Qa(i,e))})).filter(t=>t.options.length>0),tl=async e=>new Promise((t,i)=>{const o=new FileReader;o.onload=s=>{var a;(a=s.target)!=null&&a.result&&typeof s.target.result=="string"?t(s.target.result):i(new Error("Failed to read file as text"))},o.onerror=()=>i(new Error("Failed to read file")),o.readAsText(e)}),nl=async e=>{const i=e.name.toLowerCase().split(".").pop(),o=i==="zip"||i==="ekb";if(Kt(e.size,o),i==="yaml"||i==="yml"||i==="json")return{config:await tl(e),footprints:[],outlines:[],templates:[]};if(o){const s=await e.arrayBuffer(),a=await bi(s),l=a.injections.filter(c=>c.type==="footprint").map(c=>({name:c.name,content:c.content})),d=a.injections.filter(c=>c.type==="outline").map(c=>({name:c.name,content:c.content})),h=a.injections.filter(c=>c.type==="template").map(c=>({name:c.name,content:c.content}));return{config:a.config,footprints:l,outlines:d,templates:h}}else throw new Error("Unsupported file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")},on=()=>n.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-github",viewBox:"0 0 98 96",children:n.jsx("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z",fill:"currentColor"})}),Po=()=>n.jsxs("svg",{width:"16",height:"16",viewBox:"0 0 4.2333332 4.2333335",version:"1.1",fill:"currentColor",children:[n.jsxs("defs",{children:[n.jsxs("linearGradient",{id:"linearGradient6924-6",children:[n.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:0},offset:"0"}),n.jsx("stop",{offset:"0.49517274",style:{stopColor:"#ffffff",stopOpacity:.3}}),n.jsx("stop",{style:{stopColor:"#ffffff",stopOpacity:.3},offset:"1"})]}),n.jsx("linearGradient",{id:"linearGradient6918-3",x1:"42519.285",y1:"-7078.7891",x2:"42575.336",y2:"-6966.9307",gradientUnits:"userSpaceOnUse",href:"#linearGradient6924-6"})]}),n.jsxs("g",{transform:"matrix(0.06551432,0,0,0.06551432,-2.232417,-1.431776)",children:[n.jsx("path",{id:"path6733-5",style:{fontVariationSettings:"normal",opacity:1,vectorEffect:"none",fill:"url(#linearGradient6918-3)",fillOpacity:1,stroke:"none",strokeWidth:3.67846,strokeLinecap:"butt",strokeLinejoin:"miter",strokeMiterlimit:2,strokeDashoffset:0,strokeOpacity:1,paintOrder:"stroke markers fill",stopColor:"#000000",stopOpacity:1},d:"m 42519.285,-7078.7891 a 0.76086879,0.56791688 0 0 0 -0.738,0.6739 l 33.586,125.8886 a 87.182358,87.182358 0 0 0 39.381,-33.7636 l -71.565,-92.5196 a 0.76086879,0.56791688 0 0 0 -0.664,-0.2793 z",transform:"matrix(0.37058478,0,0,0.37058478,-15690.065,2662.0533)"}),n.jsx("path",{id:"path360787",style:{opacity:1,fill:"#ffffff",fillOpacity:1,strokeWidth:17.0055,paintOrder:"markers fill stroke",stopColor:"#000000"},d:"m 11249.461,-1883.6961 c -12.74,0 -23.067,10.3275 -23.067,23.0671 0,4.3335 1.22,8.5795 3.522,12.2514 l 19.232,-24.8636 c 0.138,-0.1796 0.486,-0.1796 0.624,0 l 19.233,24.8646 c 2.302,-3.6721 3.523,-7.9185 3.523,-12.2524 0,-12.7396 -10.327,-23.0671 -23.067,-23.0671 z",transform:"matrix(1.4006354,0,0,1.4006354,-15690.065,2662.0533)"})]})]}),Io=()=>n.jsx("svg",{width:"16",height:"16",viewBox:"0 0 212 212",fill:"none",stroke:"currentColor",children:n.jsxs("g",{transform:"translate(6,6)",children:[n.jsx("path",{d:"M58 168 v-98 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),n.jsx("path",{d:"M58 168 v-30 a50 50 0 0 1 50-50 h20",strokeWidth:"25"}),n.jsx("circle",{cx:"142",cy:"20",r:"18",strokeWidth:"15"}),n.jsx("circle",{cx:"142",cy:"88",r:"18",strokeWidth:"15"}),n.jsx("circle",{cx:"58",cy:"180",r:"18",strokeWidth:"15"})]})}),rn=u.div`
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
`,ol=u.div`
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
`,rl=u.div`
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
`,il=u.div`
  background-color: ${r.colors.backgroundLight};
  border: 3px dashed ${r.colors.accent};
  border-radius: 8px;
  padding: 2rem;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
  text-align: center;
`,sl=u.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 640px) {
    padding: 1rem 0.5rem;
  }
`,al=u.h1`
  font-size: ${r.fontSizes.h1};
  text-align: center;
  margin-bottom: 1rem;
`,ll=u.p`
  font-size: ${r.fontSizes.lg};
  text-align: center;
  margin-bottom: 3rem;
  color: ${r.colors.textDark};
`,cl=u.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`,Wt=u.div`
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
`,dl=u.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;

  button {
    flex-shrink: 0;
  }
`,ul=u.div`
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
`,pl=u.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  user-select: none;
`,fl=u.button`
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
`,hl=u.div`
  width: 1px;
  background-color: ${r.colors.border};
  margin: 0.75rem 0;
  flex-shrink: 0;
`,gl=u.input`
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
`,ml=u.div`
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
`,Ot=u.div`
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
`,bl=u(pe)`
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

  ${rn} {
    margin-right: 0;
  }
`,wl=u.input`
  display: none;
`,Lo=u.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`,zo=u.div`
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
`,xl=u.img`
  width: 100%;
  height: 150px;
  object-fit: contain;
  padding: 8px;
  box-sizing: border-box;
  background-color: ${r.colors.backgroundLighter};
`,Ro=u.div`
  padding: 1rem;
  font-weight: ${r.fontWeights.semiBold};
  text-align: center;
`,yl=u.div`
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
`,kl=u.div`
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
`,_l=()=>{const e=Je(),t=p.useMemo(()=>el(e).flatMap(y=>y.options).filter(y=>y.label!=="Empty YAML configuration"),[e]),i=sn(),o=ve(),[s,a]=p.useState(""),[l,d]=p.useState("github"),[h,c]=p.useState(!1),[m,b]=p.useState(!1),g=h||m,[S,w]=p.useState(!1),f=p.useRef(null),[k,C]=p.useState(!1);p.useEffect(()=>{const y=V=>{f.current&&!f.current.contains(V.target)&&C(!1)};return document.addEventListener("mousedown",y),()=>document.removeEventListener("mousedown",y)},[]);const[P,L]=p.useState(!1),I=y=>{a(y),y.includes("github.com/")?d("github"):y.includes("codeberg.org/")?d("codeberg"):(y.startsWith("http://")||y.startsWith("https://")||y.includes("/")&&!y.includes("github.com/")&&!y.includes("codeberg.org/")&&y.split("/")[0].includes("."))&&d("forgejo")},{currentConflict:v,processInjectionsWithConflictResolution:W,handleConflictResolution:R,handleConflictCancel:A}=kt({setInjectionInput:y=>o==null?void 0:o.setInjectionInput(y),setConfigInput:y=>o==null?void 0:o.setConfigInput(y),generateNow:async(y,V,H)=>{o&&await o.generateNow(y,V,H)},getCurrentInjections:()=>(o==null?void 0:o.injectionInput)||[],onComplete:async()=>{w(!0)},setError:y=>o==null?void 0:o.setError(y)});p.useEffect(()=>{const y=new URLSearchParams(window.location.search),V=y.has("github")||y.has("codeberg")||y.has("forgejo")||y.has("gitea");(S||V)&&(o!=null&&o.configInput)&&(i("/"),w(!1))},[S,o==null?void 0:o.configInput,i]),p.useEffect(()=>{var y;(y=o==null?void 0:o.pruneDeletedConfigs)==null||y.call(o)},[o]);const O=async y=>{if(o){const V=y===nn.value;let H="unknown";if(V)H="empty_configuration";else{const ee=t.find(q=>q.value===y);ee&&(H=ee.label.toLowerCase().replace(/\s+/g,"_"))}M("example_loaded",{example_name:H,is_empty:V}),o.createNewConfig(y),await o.generateNow(y,o.injectionInput,{pointsonly:!1}),w(!0)}},x=async y=>{if(o){const V=o.configs.find(H=>H.id===y);V&&(o.selectConfig(y),M("saved_config_loaded",{stored_configs_count:o.configs.length}),await o.generateNow(V.config,o.injectionInput,{pointsonly:!1}),w(!0))}},j=[...(o==null?void 0:o.configs)||[]].sort((y,V)=>new Date(V.updatedAt).getTime()-new Date(y.updatedAt).getTime()).slice(0,4),U=async(y,V,H,ee,q=null,se)=>{if(!o)throw new Error("Configuration context not available");const ie=pr(y,V,H);await W(ie,ee,q,se)},F=async(y,V)=>{await R(y,V)},D=()=>{A(),c(!1),b(!1),o==null||o.setIsGenerating(!1)},K=()=>{if(!s||!o)return;const{setError:y,clearError:V,setIsGenerating:H}=o;b(!0),H(!0),V(),M("repo_loaded",{provider:l});let ee=s.trim();if(!ee.includes("://")&&!ee.includes("github.com")&&!ee.includes("codeberg.org"))if(l==="codeberg")ee=`https://codeberg.org/${ee}`;else if(l==="forgejo"){const q=ee.split("/");if(q.length>=2&&q[0].includes("."))ee=`https://${ee}`;else{y("Forgejo/Gitea requires a URL including the host (e.g., host/owner/repo)"),b(!1),H(!1);return}}else ee=`https://github.com/${ee}`;fr(ee).then(async q=>{if(o){q.rateLimitWarning&&y(q.rateLimitWarning);try{o.createNewConfig(q.config),await U(q.footprints,q.outlines,q.templates||[],q.config)}catch(se){throw new Error(`Failed to process footprints: ${se instanceof Error?se.message:"Unknown error"}`)}}}).catch(q=>{y(`Failed to load from ${l==="github"?"GitHub":l==="codeberg"?"Codeberg":"Forgejo/Gitea"} repository: ${q.message}`),o==null||o.setInfo(null),b(!1),H(!1)}).finally(()=>{b(!1)})},J=p.useRef(null),ne=()=>{var y;(y=J.current)==null||y.click()},Z=async y=>{if(!o)return;const{setError:V,clearError:H,setIsGenerating:ee}=o;c(!0),ee(!0),H(),M("local_file_loaded",{file_type:Qr(y.name),file_size:y.size});try{const q=await nl(y);o.createNewConfig(q.config),await U(q.footprints,q.outlines,q.templates||[],q.config)}catch(q){V(`Failed to load local file: ${q instanceof Error?q.message:"Unknown error"}`),o.setInfo(null),c(!1),ee(!1)}finally{c(!1)}},B=async y=>{var H;const V=(H=y.target.files)==null?void 0:H[0];V&&(y.target.value="",await Z(V))},N=y=>{y.preventDefault(),y.stopPropagation(),!g&&L(!0)},T=y=>{y.preventDefault(),y.stopPropagation()},Q=y=>{if(y.preventDefault(),y.stopPropagation(),g)return;const V=y.currentTarget,H=y.relatedTarget;(!H||!V.contains(H))&&L(!1)},G=async y=>{if(y.preventDefault(),y.stopPropagation(),g)return;L(!1);const V=Array.from(y.dataTransfer.files),H=[".yaml",".yml",".json",".zip",".ekb"],ee=V.find(q=>{const se=q.name.toLowerCase();return H.some(ie=>se.endsWith(ie))});ee?await Z(ee):V.length>0&&o&&o.setError("Invalid file type. Accepted formats: *.yaml, *.json, *.zip, *.ekb")};return n.jsxs(ol,{$isDragging:P,onDragEnter:N,onDragOver:T,onDragLeave:Q,onDrop:G,"data-testid":"welcome-page-wrapper",children:[n.jsx(rl,{$isVisible:P,children:n.jsx(il,{children:"Drop file here to load configuration"})}),v&&n.jsx(bt,{injectionName:v.name,injectionType:v.type,onResolve:F,onCancel:D,"data-testid":"conflict-dialog"}),n.jsxs(sl,{children:[n.jsx(al,{children:"Ergogen Web UI"}),n.jsxs(ll,{children:["A web-based interface for Ergogen, the ergonomic keyboard generator.",n.jsx("br",{}),"Start a new design below."]}),n.jsxs(cl,{children:[n.jsxs(Wt,{children:[n.jsx("h2",{children:"Start Fresh"}),n.jsx("p",{children:"Begin with a completely blank slate."}),n.jsx(pe,{onClick:()=>O(nn.value),"aria-label":"Start with empty configuration","data-testid":"empty-config-button",children:"Empty Configuration"})]}),n.jsxs(Wt,{children:[n.jsx("h2",{children:"From Local File"}),n.jsx("p",{children:"Load a configuration from your computer. Supports *.yaml, *.json, *.zip, and *.ekb files."}),n.jsx(wl,{ref:J,type:"file",accept:".yaml,.yml,.json,.zip,.ekb",onChange:B,disabled:g,"aria-label":"Select local file to load","data-testid":"local-file-input"}),n.jsx(pe,{onClick:ne,disabled:g,"aria-label":"Select local file to load","data-testid":"local-file-button",children:h?n.jsxs(n.Fragment,{children:[n.jsx(rn,{})," Loading..."]}):"Choose File"})]}),n.jsxs(Wt,{children:[n.jsx("h2",{children:"From Repo"}),n.jsx("p",{children:'Link to a YAML config file on a Git provider (e.g. GitHub, Codeberg, Forgejo), or simply a repository name like "user/repo".'}),n.jsx(dl,{children:n.jsxs(ul,{children:[n.jsxs(pl,{ref:f,children:[n.jsxs(fl,{type:"button",onClick:()=>C(!k),disabled:g,"aria-label":"Repository provider source","data-testid":"repo-provider-trigger",children:[l==="github"?n.jsx(on,{}):l==="codeberg"?n.jsx(Po,{}):n.jsx(Io,{}),n.jsx("span",{className:"material-symbols-outlined",children:"arrow_drop_down"})]}),k&&n.jsxs(ml,{children:[n.jsxs(Ot,{$active:l==="github",onClick:()=>{d("github"),C(!1)},children:[n.jsx(on,{}),"GitHub"]}),n.jsxs(Ot,{$active:l==="codeberg",onClick:()=>{d("codeberg"),C(!1)},children:[n.jsx(Po,{}),"Codeberg"]}),n.jsxs(Ot,{$active:l==="forgejo",onClick:()=>{d("forgejo"),C(!1)},children:[n.jsx(Io,{}),"Forgejo"]})]})]}),n.jsx(hl,{}),n.jsx(gl,{placeholder:l==="forgejo"?"host/user/repo":"user/repo",value:s,onChange:y=>I(y.target.value),onKeyDown:y=>{y.key==="Enter"&&!g&&s.trim()!==""&&(y.preventDefault(),K())},disabled:g,"aria-label":"Repository URL or path","data-testid":"repo-input"}),n.jsx(bl,{onClick:K,disabled:g||!s,"aria-label":"Load configuration from repository","data-testid":"repo-load-button",children:m?n.jsx(rn,{}):n.jsx("span",{className:"material-symbols-outlined",style:{display:"block"},children:"cloud_download"})})]})})]})]}),j.length>0&&n.jsxs(n.Fragment,{children:[n.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:r.fontSizes.h2},children:"Pick up where you left"}),n.jsx(Lo,{style:{marginBottom:"3rem"},children:j.map(y=>n.jsxs(zo,{onClick:()=>x(y.id),"aria-label":`Load ${y.name} configuration`,"data-testid":`saved-config-${y.name.toLowerCase().replace(/\s+/g,"-")}`,children:[y.previewSvg?n.jsx(yl,{dangerouslySetInnerHTML:{__html:y.previewSvg}}):n.jsx(kl,{children:n.jsx("span",{className:"material-symbols-outlined",children:"keyboard_off"})}),n.jsx(Ro,{children:y.name})]},y.id))})]}),n.jsx("h2",{style:{textAlign:"center",marginBottom:"2rem",fontSize:r.fontSizes.h2},children:"Or start from an example"}),n.jsx(Lo,{children:t.map(y=>n.jsxs(zo,{onClick:()=>O(y.value),"aria-label":`Load ${y.label} example`,"data-testid":`example-${y.label.toLowerCase().replace(/\s+/g,"-")}`,children:[n.jsx(xl,{src:`/images/previews/${y.label.toLowerCase().replace(/[\s()]/g,"_")}.svg`,alt:`${y.label} preview`}),n.jsx(Ro,{children:y.label})]},y.label))})]})]})},$r=({versionInfo:e,"data-testid":t})=>{const[i,o]=p.useState(!1),s=p.useRef(null),a=()=>{s.current&&clearTimeout(s.current),o(!0)},l=()=>{s.current=setTimeout(()=>{o(!1)},250)},d=()=>{s.current&&clearTimeout(s.current)},h=()=>{s.current=setTimeout(()=>{o(!1)},250)},c=m=>{m.stopPropagation(),o(b=>!b)};return p.useEffect(()=>{if(!i)return;const m=()=>{o(!1)};return window.addEventListener("click",m),()=>{window.removeEventListener("click",m)}},[i]),p.useEffect(()=>()=>{s.current&&clearTimeout(s.current)},[]),n.jsxs(vl,{onMouseEnter:a,onMouseLeave:l,"data-testid":t,children:[n.jsx(jl,{onClick:c,"data-testid":t&&`${t}-badge`,"aria-label":"Custom Ergogen version indicator",children:n.jsx("span",{className:"material-symbols-outlined",children:"science"})}),i&&n.jsxs($l,{onMouseEnter:d,onMouseLeave:h,onClick:m=>m.stopPropagation(),"data-testid":t&&`${t}-popover`,children:[n.jsx(Cl,{children:"Custom Ergogen Version"}),n.jsx(Sl,{children:"This website is running a custom version of Ergogen for development and preview purposes."}),n.jsxs(El,{href:e.url,target:"_blank",rel:"noopener noreferrer","data-testid":t&&`${t}-link`,children:[n.jsx("span",{children:e.label}),n.jsx("span",{className:"material-symbols-outlined open-icon",children:"open_in_new"})]})]})]})},vl=u.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  transform: translateY(-5px);
`,jl=u.span`
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
`,$l=u.div`
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
`,Cl=u.div`
  font-size: 12px;
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
`,Sl=u.div`
  font-size: 11px;
  color: ${r.colors.textDark};
  line-height: 1.4;
`,El=u.a`
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
`,Pl=wt`
  0%   { box-shadow: 0 0 0 0   ${r.colors.accent}99; }
  70%  { box-shadow: 0 0 0 6px ${r.colors.accent}00; }
  100% { box-shadow: 0 0 0 0   ${r.colors.accent}00; }
`,Il=wt`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`,Ll=u.button`
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
    ${e=>e.$isUpdating&&Ko`
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
`,zl=({onClick:e,"data-testid":t})=>{const[i,o]=p.useState(!1),s=()=>{o(!0),e()};return n.jsxs(Ll,{onClick:s,disabled:i,$isUpdating:i,"aria-label":i?"Updating version...":"Update available — click to reload and apply","data-testid":t??"update-chip",children:[n.jsx("span",{className:"material-symbols-outlined","aria-hidden":"true",children:i?"sync":"update"}),i?"Updating version...":"Update Available"]})},Rl=u.header`
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
`,Dl=u.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: row;
  flex-grow: 1;
  min-width: 0;
  width: 100%;
`,Al=u.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,Nl=u.div`
  display: flex;
  align-items: center;
  gap: 6px;
`,Ul=u.div`
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
`,Wl=u(vt)`
  flex-shrink: 0;
`,Ol=u(vt)`
  background-color: ${r.colors.accent};
  border-color: ${r.colors.accent};

  &:hover {
    background-color: ${r.colors.accentDark};
    border-color: ${r.colors.accentDarker};
  }

  @media (max-width: 375px) {
    display: none;
  }
`,Fl=u.span`
  @media (max-width: 510px) {
    display: none;
  }
`,Do=u(vt)`
  @media (max-width: 475px) {
    display: none;
  }
`,Ml=u(Zo)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,Bl=u.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,Tl=({onUpdate:e})=>{const t=ve(),i=sn(),o=Yo(),{activeConfigId:s,activeConfigName:a,configs:l,isPreview:d,renameConfig:h,duplicateConfig:c,deleteConfig:m,savePreviewConfig:b}=t||{},[g,S]=p.useState(!1),[w,f]=p.useState(!1),[k,C]=p.useState(""),P=()=>{a&&s&&(C(a),f(!0))},L=D=>{D&&D.stopPropagation(),!(h&&s&&k.trim()&&!h(s,k.trim()))&&f(!1)},I=D=>{D&&D.stopPropagation(),f(!1)},v=D=>{D.key==="Enter"?L():D.key==="Escape"&&f(!1)},W=D=>{D.stopPropagation(),c&&s&&c(s)},R=D=>{D.stopPropagation(),s&&a&&m&&window.confirm(`Are you sure you want to delete "${a}"?`)&&(m(s),(l&&l.length<=1||s)&&i("/new"))},A=()=>{t==null||t.setShowSettings(!(t!=null&&t.showSettings))},O=()=>{t==null||t.setShowSettings(!1),t==null||t.selectConfig(null),i("/new")},x=Yt(t),E=()=>{var D,K,J;!(t!=null&&t.results)||!x||t!=null&&t.isGenerating||t!=null&&t.isJscadConverting||(M("archive_single_downloaded",{has_injections:!!((D=t.injectionInput)!=null&&D.length),injections_count:((K=t.injectionInput)==null?void 0:K.length)||0,stored_configs_count:((J=t.configs)==null?void 0:J.length)||0,source:"header"}),jr(t.results,x,t.injectionInput,t.debug,t.stlPreview))},j=()=>{var D,K;!t||!x||(M("share_button_clicked",{has_injections:!!((D=t.injectionInput)!=null&&D.length),injections_count:((K=t.injectionInput)==null?void 0:K.length)||0,source:"header"}),S(!0))},U=()=>{t==null||t.setShowSideNav(!(t!=null&&t.showSideNav))},F=p.useMemo(()=>cn("github:ceoloide/ergogen#v4.3.0"),[]);return n.jsxs(n.Fragment,{children:[g&&n.jsx(_r,{config:x,injections:(t==null?void 0:t.injectionInput)||[],onClose:()=>S(!1),"data-testid":"share-dialog"}),n.jsxs(Rl,{children:[n.jsxs(Dl,{children:[n.jsx(Wl,{onClick:U,"aria-label":t!=null&&t.showSideNav?"Hide navigation panel":"Show navigation panel","data-testid":"side-nav-toggle-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"side_navigation"})}),n.jsxs(Nl,{children:[n.jsx(Ml,{to:"/","aria-label":"Go to home page","data-testid":"logo-button",children:n.jsx(Bl,{src:"/ergogen.png",alt:"Ergogen logo"})}),n.jsxs(Ul,{children:["Ergogen",F.isCustom&&n.jsx($r,{versionInfo:F,"data-testid":"header-dev-chip"})]})]}),a&&n.jsxs(n.Fragment,{children:[n.jsx(Vl,{children:"/"}),n.jsxs(Gl,{"data-testid":"header-active-config-name",$isEditing:w,onClick:!w&&!d?P:void 0,children:[d&&n.jsx(ql,{"data-testid":"header-shared-icon",children:n.jsx("span",{className:"material-symbols-outlined",children:"link"})}),w?n.jsxs(n.Fragment,{children:[n.jsx(Hl,{type:"text",value:k,onChange:D=>C(D.target.value),onBlur:L,onKeyDown:v,autoFocus:!0,"data-testid":"header-config-name-input","aria-label":"Edit configuration name"}),n.jsxs(Ft,{className:"header-actions-always-visible",children:[n.jsx(He,{onMouseDown:D=>{D.preventDefault()},onClick:L,"aria-label":"Confirm rename","data-testid":"header-confirm-rename-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"check"})}),n.jsx(He,{onMouseDown:D=>{D.preventDefault()},onClick:I,"aria-label":"Cancel rename","data-testid":"header-cancel-rename-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]})]}):d?n.jsxs(n.Fragment,{children:[n.jsx(No,{"data-testid":"header-config-name-text",children:a}),n.jsx(Ft,{className:"header-actions-always-visible",children:n.jsx(He,{onClick:D=>{D.stopPropagation(),b==null||b()},"aria-label":"Save preview configuration","data-testid":"header-save-preview-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"save"})})})]}):n.jsxs(n.Fragment,{children:[n.jsx(No,{title:"Click to rename","data-testid":"header-config-name-text",children:a}),n.jsxs(Ft,{className:"header-actions-hover",children:[n.jsx(He,{onClick:P,"aria-label":"Rename configuration","data-testid":"header-rename-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),n.jsx(Ao,{onClick:W,"aria-label":"Duplicate configuration","data-testid":"header-duplicate-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),n.jsx(Ao,{onClick:R,"aria-label":"Delete configuration","data-testid":"header-delete-btn",children:n.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})]})]})]}),n.jsxs(Al,{children:[e&&n.jsx(zl,{onClick:e,"data-testid":"header-update-chip"}),o.pathname==="/"&&n.jsxs(n.Fragment,{children:[n.jsxs(Ol,{onClick:O,"aria-label":"Start new configuration","data-testid":"new-config-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"add_2"}),n.jsx(Fl,{children:"New"})]}),n.jsx(Do,{onClick:E,disabled:(t==null?void 0:t.isGenerating)||(t==null?void 0:t.isJscadConverting),"aria-label":"Download archive of all generated files","data-testid":"header-download-outputs-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"archive"})}),n.jsx(Do,{onClick:j,disabled:!(t!=null&&t.configInput),"aria-label":"Share configuration","data-testid":"header-share-button",children:n.jsx("span",{className:"material-symbols-outlined",children:"share"})})]}),o.pathname!=="/new"&&n.jsx(vt,{onClick:A,"aria-label":t!=null&&t.showSettings?"Hide settings panel":"Show settings panel","data-testid":"settings-button",children:n.jsx("span",{className:"material-symbols-outlined",children:t!=null&&t.showSettings?"keyboard_alt":"settings"})})]})]})]})},Gl=u.div`
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
`,Ft=u.div`
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
`,Ao=u(He)`
  @media (max-width: 767px) {
    display: none;
  }
`,Vl=u.span`
  color: ${r.colors.textDark};
  font-size: ${r.fontSizes.sm};
  font-weight: ${r.fontWeights.semiBold};
  user-select: none;
  @media (max-width: 639px) {
    display: none;
  }
`,No=u.span`
  font-size: ${r.fontSizes.bodySmall};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  user-select: none;
`,Hl=u.input`
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
`,ql=u.div`
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
`,Kl=wt`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
`,Jl=u.div`
  position: fixed;
  top: 45px;
  left: 0;
  right: 0;
  width: 100%;
  height: 3px;
  background-color: transparent;
  overflow: hidden;
  z-index: 1000;
`,Xl=u.div`
  height: 100%;
  width: 25%;
  background-color: ${r.colors.accent};
  animation: ${Kl} 1.5s ease-in-out infinite;
`,Yl=({visible:e,"data-testid":t})=>e?n.jsx(Jl,{"data-testid":t,children:n.jsx(Xl,{})}):null,st={info:{background:r.colors.info,text:r.colors.infoDark},warning:{background:r.colors.warning,text:r.colors.warningDark},error:{background:r.colors.error,text:r.colors.errorDark},success:{background:r.colors.success,text:r.colors.successDark}},at=u.span.attrs({className:"material-symbols-outlined"})`
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
`,Zl=u.div`
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
`,Ql=()=>{const e=ve();if(!e)return null;const{error:t,deprecationWarning:i,skippedWarning:o,info:s,clearError:a,clearWarning:l,clearSkippedWarning:d,clearInfo:h}=e;return n.jsxs(Zl,{"data-testid":"banners-container",children:[s&&n.jsxs(dt,{type:"info","data-testid":"info-banner",children:[n.jsxs(lt,{children:[n.jsx(at,{children:"info"}),n.jsx(ct,{children:s})]}),n.jsx(ut,{onClick:h,"aria-label":"Close info message","data-testid":"close-info-banner",children:"×"})]}),i&&n.jsxs(dt,{type:"warning","data-testid":"warning-banner",children:[n.jsxs(lt,{children:[n.jsx(at,{children:"warning"}),n.jsx(ct,{children:i})]}),n.jsx(ut,{onClick:l,"aria-label":"Close warning message","data-testid":"close-warning-banner",children:"×"})]}),o&&n.jsxs(dt,{type:"warning","data-testid":"skipped-injections-banner",children:[n.jsxs(lt,{children:[n.jsx(at,{children:"warning"}),n.jsx(ct,{children:o})]}),n.jsx(ut,{onClick:d,"aria-label":"Close feature warning message","data-testid":"close-skipped-banner",children:"×"})]}),t&&n.jsxs(dt,{type:"error","data-testid":"error-banner",children:[n.jsxs(lt,{children:[n.jsx(at,{children:"error"}),n.jsx(ct,{children:t})]}),n.jsx(ut,{onClick:a,"aria-label":"Close error message","data-testid":"close-error-banner",children:"×"})]})]})},ec=()=>n.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-discord",viewBox:"0 0 16 16",children:n.jsx("path",{d:"M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"})}),Uo=({label:e,version:t,url:i,isCustom:o=!1,"data-testid":s,devBadgeTestId:a})=>{const l=()=>{window.open(i,"_blank","noopener,noreferrer")};return n.jsxs(tc,{onClick:l,$hasDevBadge:o,"aria-label":`View ${e==="Ergogen"?"Ergogen":`Ergogen ${e}`} ${t} on GitHub`,"data-testid":s,children:[n.jsx(on,{}),n.jsxs(nc,{children:[n.jsx(oc,{children:e}),n.jsx(rc,{$isCustom:o,children:t})]}),o&&n.jsx(ic,{"data-testid":a,children:n.jsx(sc,{children:"DEV"})})]})},tc=u.button`
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
`,nc=u.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  line-height: 1.1;
  min-width: 0;
`,oc=u.span`
  font-size: 10px;
  font-weight: ${r.fontWeights.bold};
  color: ${r.colors.white};
  white-space: nowrap;
`,rc=u.span`
  font-size: 8px;
  color: ${e=>e.$isCustom?r.colors.accent:r.colors.textDark};
  white-space: nowrap;
`,ic=u.div`
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
`,sc=u.span`
  font-size: 8px;
  font-weight: ${r.fontWeights.bold};
  color: ${r.colors.accent};
  transform: rotate(-90deg);
  white-space: nowrap;
  line-height: 1;
`,ac=({isOpen:e,onClose:t,"data-testid":i})=>{const o=p.useRef(e),[s,a]=p.useState(e),[l,d]=p.useState(360),h=p.useRef(!1),c=p.useRef(0),m=p.useRef(360),b=ve(),g=sn(),S=xt.version,{configs:w,activeConfigId:f,selectConfig:k,renameConfig:C,duplicateConfig:P,deleteConfig:L,setIsBulkDownloadOpen:I}=b||{},[v,W]=p.useState(""),[R,A]=p.useState(null),[O,x]=p.useState(""),E=p.useMemo(()=>{if(!w)return[];let N=w;if(v.trim()){const T=v.toLowerCase().split(/\s+/).filter(Boolean);T.length>0&&(N=w.filter(Q=>{const G=Q.name.toLowerCase();return T.some(y=>G.includes(y))}))}return[...N].sort((T,Q)=>{const G=T.updatedAt?new Date(T.updatedAt).getTime():0,y=Q.updatedAt?new Date(Q.updatedAt).getTime():0;if(G!==y)return y-G;const V=T.createdAt?new Date(T.createdAt).getTime():0,H=Q.createdAt?new Date(Q.createdAt).getTime():0;return V!==H?H-V:T.name.localeCompare(Q.name)})},[w,v]),j=()=>{k&&k(null),g("/new"),t()},U=()=>{M("bulk_download_dialog_opened",{stored_configs_count:(w==null?void 0:w.length)||0}),I&&I(!0),t()},F=N=>{k&&(k(N),g("/"),t())},D=(N,T)=>{A(N),x(T)},K=N=>{C&&O.trim()&&!C(N,O.trim())||A(null)},J=N=>{P&&P(N)},ne=(N,T)=>{if(window.confirm(`Are you sure you want to delete "${T}"?`)&&L){L(N);const Q=f===N,G=w&&w.length<=1;(Q||G)&&(g("/new"),t())}};p.useEffect(()=>{const N=o.current;e&&!N?a(!0):!e&&N&&a(!1),e||A(null),o.current=e},[e]),p.useEffect(()=>{if(!v.trim())return;const N=setTimeout(()=>{M("search_performed",{query_length:v.trim().length})},1e3);return()=>clearTimeout(N)},[v]),p.useEffect(()=>{const N=y=>{if(!h.current)return;const V=y.clientX-c.current,H=m.current+V,ee=Math.min(600,window.innerWidth*.9),q=Math.max(360,Math.min(H,ee));d(q)},T=()=>{h.current&&(h.current=!1,document.body.style.cursor="",document.body.style.userSelect="")},Q=y=>{if(!h.current)return;y.preventDefault();const H=y.touches[0].clientX-c.current,ee=m.current+H,q=Math.min(600,window.innerWidth*.9),se=Math.max(360,Math.min(ee,q));d(se)},G=()=>{h.current&&(h.current=!1,document.body.style.cursor="",document.body.style.userSelect="")};return window.addEventListener("mousemove",N),window.addEventListener("mouseup",T),window.addEventListener("touchmove",Q,{passive:!1}),window.addEventListener("touchend",G),()=>{window.removeEventListener("mousemove",N),window.removeEventListener("mouseup",T),window.removeEventListener("touchmove",Q),window.removeEventListener("touchend",G)}},[]);const Z=N=>{N.preventDefault(),N.stopPropagation(),h.current=!0,m.current=l,"touches"in N?c.current=N.touches[0].clientX:c.current=N.clientX,document.body.style.cursor="col-resize",document.body.style.userSelect="none"};p.useEffect(()=>{if(!e)return;const N=T=>{T.key==="Escape"&&t()};return window.addEventListener("keydown",N),()=>{window.removeEventListener("keydown",N)}},[e,t]);const B=p.useMemo(()=>cn("github:ceoloide/ergogen#v4.3.0"),[]);return p.useEffect(()=>(e?document.body.style.overflow="hidden":document.body.style.overflow="",()=>{document.body.style.overflow=""}),[e]),n.jsxs(n.Fragment,{children:[n.jsx(lc,{"data-testid":i,onClick:t,$isOpen:e,$isOpening:s}),n.jsxs(cc,{"data-testid":i&&`${i}-panel`,$isOpen:e,$isOpening:s,$width:l,onClick:N=>N.stopPropagation(),children:[n.jsx(Dc,{onMouseDown:Z,onTouchStart:Z,"data-testid":i&&`${i}-resize-handle`}),n.jsxs(dc,{children:[n.jsxs(uc,{children:[n.jsx(pc,{to:"/",onClick:t,"aria-label":"Go to home page","data-testid":"side-nav-logo-button",children:n.jsx(fc,{src:"/ergogen.png",alt:"Ergogen logo"})}),n.jsxs(hc,{onClick:t,children:["Ergogen",B.isCustom&&n.jsx($r,{versionInfo:B,"data-testid":"sidebar-dev-chip"})]})]}),n.jsx(gc,{onClick:t,"data-testid":i&&`${i}-close`,"aria-label":"Close navigation panel",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),n.jsxs(mc,{children:[n.jsxs(bc,{children:[n.jsxs(wc,{onClick:j,"aria-label":"New","data-testid":"side-nav-new-config-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"add"}),n.jsx("span",{children:"New"})]}),w&&w.length>0&&n.jsxs(xc,{onClick:U,"aria-label":"Download All","data-testid":"side-nav-download-all-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"download"}),n.jsx("span",{children:"Download All"})]})]}),n.jsxs(yc,{children:[n.jsx("span",{className:"material-symbols-outlined search-icon",children:"search"}),n.jsx(kc,{type:"text",placeholder:"Search configurations...",value:v,onChange:N=>W(N.target.value),"aria-label":"Search configurations"}),v&&n.jsx(_c,{onClick:()=>W(""),children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}),n.jsxs(vc,{children:[n.jsx("span",{children:"Saved Configurations"}),n.jsx(jc,{children:E.length})]}),n.jsxs($c,{children:[E.map(N=>{const T=N.id===f,Q=R===N.id;return n.jsx(Cc,{$isActive:T,"data-testid":`config-item-${N.id}`,children:Q?n.jsxs(Pc,{onSubmit:G=>{G.preventDefault(),K(N.id)},children:[n.jsx(Ic,{type:"text",value:O,onChange:G=>x(G.target.value),autoFocus:!0,"aria-label":"Rename input"}),n.jsx(Wo,{type:"submit","aria-label":"Save name",children:n.jsx("span",{className:"material-symbols-outlined",children:"check"})}),n.jsx(Wo,{type:"button",onClick:()=>A(null),"aria-label":"Cancel rename",children:n.jsx("span",{className:"material-symbols-outlined",children:"close"})})]}):n.jsxs(n.Fragment,{children:[n.jsxs(Sc,{onClick:()=>F(N.id),$isActive:T,title:N.name,children:[n.jsx("span",{className:"material-symbols-outlined",children:"description"}),n.jsx("span",{className:"config-title-text",children:N.name})]}),n.jsxs(Ec,{$isActive:T,children:[n.jsx(Mt,{onClick:()=>D(N.id,N.name),"aria-label":`Rename configuration ${N.name}`,children:n.jsx("span",{className:"material-symbols-outlined",children:"edit"})}),n.jsx(Mt,{onClick:()=>J(N.id),"aria-label":`Duplicate configuration ${N.name}`,children:n.jsx("span",{className:"material-symbols-outlined",children:"content_copy"})}),n.jsx(Mt,{onClick:()=>ne(N.id,N.name),"aria-label":`Delete configuration ${N.name}`,children:n.jsx("span",{className:"material-symbols-outlined",children:"delete"})})]})]})},N.id)}),E.length===0&&n.jsx(Lc,{children:"No configurations found"})]})]}),n.jsx(zc,{children:n.jsxs(Rc,{children:[n.jsxs(Oo,{onClick:()=>{window.open("https://docs.ergogen.xyz/","_blank","noopener,noreferrer")},"aria-label":"Open documentation","data-testid":"side-nav-docs-button",children:[n.jsx("span",{className:"material-symbols-outlined",children:"description"}),n.jsx("span",{children:"Docs"})]}),n.jsx(Oo,{onClick:()=>{window.open("https://discord.ergogen.xyz","_blank","noopener,noreferrer")},"aria-label":"Join the Discord community","data-testid":"side-nav-discord-button",children:n.jsx(ec,{})}),n.jsx(Uo,{label:"Web UI",version:S,url:"https://github.com/ceoloide/ergogen-gui","data-testid":"side-nav-gui-version-button"}),n.jsx(Uo,{label:"Ergogen",version:B.displayText,url:B.url,isCustom:B.isCustom,"data-testid":"side-nav-ergogen-version-button",devBadgeTestId:"side-nav-ergogen-dev-badge"})]})})]})]})},lc=u.div`
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
`,cc=u.div`
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
`,dc=u.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 3em;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
`,uc=u.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
`,pc=u(Zo)`
  display: block;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
`,fc=u.img`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`,hc=u.div`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.semiBold};
  color: ${r.colors.white};
  cursor: pointer;
  display: flex;
  align-items: center;
`,gc=u.button`
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
`,mc=u.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`,bc=u.div`
  display: flex;
  gap: 10px;
  margin-bottom: 1rem;
  flex-shrink: 0;
`,wc=u.button`
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
`,xc=u.button`
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
`,yc=u.div`
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
`,kc=u.input`
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
`,_c=u.button`
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
`,vc=u.div`
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
`,jc=u.span`
  background-color: ${r.colors.border};
  color: ${r.colors.white};
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: ${r.fontWeights.semiBold};
`,$c=u.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  flex: 1;
`,Cc=u.div`
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
`,Sc=u.button`
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
`,Ec=u.div.attrs({className:"item-actions-hover"})`
  display: flex;
  gap: 4px;
  opacity: ${e=>e.$isActive?1:0};
  transition: opacity 0.15s ease-in-out;

  @media (max-width: 1023px) {
    opacity: 1;
  }
`,Mt=u.button`
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
`,Pc=u.form`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  height: 100%;
`,Ic=u.input`
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
`,Wo=u.button`
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
`,Lc=u.div`
  text-align: center;
  color: ${r.colors.textDark};
  font-size: ${r.fontSizes.bodySmall};
  margin-top: 2rem;
  font-style: italic;
`,zc=u.div`
  padding: 8px 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`,Rc=u.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  width: 100%;
`,Oo=u.button`
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
`,Dc=u.div`
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
`,Cr=3e4,Ac=e=>{try{const t=JSON.parse(e);if(t&&typeof t=="object")return t}catch{try{const t=fe.load(e);if(t&&typeof t=="object")return t}catch{return e}}return e},Nc=(e,t,i,o,s)=>new Promise((a,l)=>{if(s()){l(new Error("Aborted"));return}const d=ln();if(!d){l(new Error("Failed to create Ergogen worker"));return}o.add(d);const h=()=>{clearTimeout(c),d.terminate(),o.delete(d)},c=setTimeout(()=>{h(),l(new Error("Compilation timed out"))},Cr);d.onmessage=b=>{const g=b.data;g.type==="error"?(h(),l(new Error(g.error))):g.type==="success"&&(h(),a(g.results))},d.onerror=b=>{h(),l(b)};const m={type:"generate",inputConfig:Ac(e),injectionInput:t,requestId:`export-compile-${Date.now()}`,options:{debug:i}};d.postMessage(m)}),Uc=(e,t,i)=>new Promise(o=>{if(i()||!e.cases||Object.keys(e.cases).length===0){o(e);return}const s=tr();if(!s){o(e);return}t.add(s);const a=()=>{clearTimeout(l),s.terminate(),t.delete(s)},l=setTimeout(()=>{a(),o(e)},Cr);s.onmessage=d=>{const h=d.data;h.type==="success"?(a(),o(h.results)):h.type==="error"&&(a(),o(e))},s.onerror=()=>{a(),o(e)},s.postMessage({type:"batch_jscad_to_stl",results:e,configVersion:0})}),Wc=async(e,t,i,o,s,a,l)=>{const d=new an,h=new Set;if(s){for(let P=0;P<e.length;P++){if(l())return;const L=e[P];a(P,e.length,L.name);const I=vo(h,L.name);d.file(`${I}.yaml`,L.config)}if(t&&t.length>0){if(l())return;en(d,t)}return l()?void 0:(a(e.length,e.length,"Creating ZIP..."),await tn(d,"ergogen-config-all"),{succeededCount:e.length,failedCount:0})}const c=hr(t),m=e.map(P=>({configRecord:P,folderName:vo(h,P.name)})),b=new Set,g=new Set;let S=0,w=0,f=0;const k=Math.min(4,navigator.hardwareConcurrency||2),C=async({configRecord:P,folderName:L})=>{if(l())return;g.add(P.name),a(S,e.length,Array.from(g).join(", "));const I=d.folder(L);if(!I){g.delete(P.name),S++,a(S,e.length,Array.from(g).join(", "));return}try{const v=await Nc(P.config,c,i,b,l);let W=v;if(o&&v.cases&&Object.keys(v.cases).length>0&&(W=await Uc(v,b,l)),l())return;I.file("config.yaml",P.config);const R=I.folder("outputs");R&&vr(R,P.config,W,i,o),t&&t.length>0&&en(I,t),w++}catch(v){f++,console.error(`Failed to compile config ${P.name}:`,v),I.file("config.yaml",P.config),I.file("error.txt",`Compilation failed: ${v instanceof Error?v.message:String(v)}`)}finally{g.delete(P.name),S++,a(S,e.length,Array.from(g).join(", "))}};try{const P=[...m],L=[],I=async()=>{if(l()||P.length===0)return;const v=P.shift();await C(v),await I()};for(let v=0;v<Math.min(k,P.length);v++)L.push(I());if(await Promise.all(L),l()){b.forEach(v=>v.terminate()),b.clear();return}return a(e.length,e.length,"Creating ZIP..."),await tn(d,"ergogen-export-all"),{succeededCount:w,failedCount:f}}finally{b.forEach(P=>P.terminate()),b.clear()}},Oc=({isOpen:e,configs:t,injections:i,debug:o,stlPreview:s,onClose:a,"data-testid":l})=>{const[d,h]=p.useState(new Set),[c,m]=p.useState(!0),[b,g]=p.useState(!1),[S,w]=p.useState(0),[f,k]=p.useState(""),C=p.useRef(!1);if(p.useEffect(()=>{e&&(h(new Set(t.map(R=>R.id))),g(!1),w(0),k(""),C.current=!1)},[e,t]),!e)return null;const P=R=>{h(R?new Set(t.map(A=>A.id)):new Set)},L=(R,A)=>{const O=new Set(d);A?O.add(R):O.delete(R),h(O)},I=async()=>{if(d.size===0)return;g(!0),w(0),k(""),C.current=!1;const R=t.filter(A=>d.has(A.id));M("bulk_download_started",{selected_configs_count:d.size,only_configs:c});try{const A=await Wc(R,i,o,s,c,(O,x,E)=>{w(O),k(E)},()=>C.current);C.current||(A&&A.succeededCount===0&&A.failedCount>0?M("bulk_download_failed",{selected_configs_count:d.size,failed_configs_count:A.failedCount,only_configs:c,error_message:`All ${A.failedCount} selected configuration(s) failed to compile`}):A&&A.failedCount>0?M("bulk_download_partial",{selected_configs_count:d.size,failed_configs_count:A.failedCount,only_configs:c}):M("bulk_download_completed",{selected_configs_count:d.size,only_configs:c}))}catch(A){console.error("Error during bulk download:",A),M("bulk_download_failed",{selected_configs_count:d.size,only_configs:c,error_message:A instanceof Error?A.message:String(A)})}finally{C.current||a()}},v=()=>{b&&!C.current&&M("bulk_download_cancelled",{selected_configs_count:d.size,completed_configs_count:S,only_configs:c}),C.current=!0,a()},W=d.size>0?S/d.size*100:0;return n.jsx(Fc,{"data-testid":l,children:n.jsxs(Mc,{"data-testid":l&&`${l}-box`,children:[n.jsx(Bc,{children:"Download Configurations"}),b?n.jsxs(n.Fragment,{children:[n.jsxs(nd,{children:[n.jsx(od,{children:n.jsx(rd,{style:{width:`${W}%`}})}),n.jsxs(id,{children:[n.jsx(sd,{children:f?f.includes(", ")?n.jsxs("div",{children:["Generating:",n.jsx(ad,{children:f.split(", ").map(R=>n.jsx("li",{children:R},R))})]}):n.jsxs(Bo,{children:["Generating ",f]}):n.jsx(Bo,{children:"Preparing..."})}),n.jsxs(ld,{children:[S," / ",d.size]})]})]}),n.jsx(Mo,{children:n.jsx(cd,{onClick:v,size:"medium",children:"Cancel"})})]}):n.jsxs(n.Fragment,{children:[n.jsx(Gc,{children:t.map(R=>{const A=d.has(R.id);return n.jsx(Vc,{children:n.jsxs(Sr,{htmlFor:`bulk-check-${R.id}`,children:[n.jsx(qc,{id:`bulk-check-${R.id}`,checked:A,onChange:O=>L(R.id,O.target.checked)}),n.jsx(Kc,{$checked:A}),n.jsx(Hc,{children:R.name})]})},R.id)})}),n.jsxs(Tc,{children:[n.jsx(Fo,{onClick:()=>P(!0),children:"Select All"}),n.jsx(Fo,{onClick:()=>P(!1),children:"Deselect All"})]}),n.jsxs(Jc,{children:[n.jsx(Xc,{children:"Only download configs"}),n.jsxs(Yc,{$checked:c,htmlFor:"only-configs-switch",children:[n.jsx(Zc,{type:"checkbox",id:"only-configs-switch",checked:c,onChange:R=>m(R.target.checked)}),n.jsx(Qc,{$checked:c}),n.jsx(ed,{$checked:c})]})]}),!c&&n.jsxs(td,{children:[n.jsx("span",{className:"material-symbols-outlined",children:"warning"}),n.jsx("span",{children:"Warning: Exporting generated outputs for multiple configurations may take a long time depending on the number of selected configurations, their complexity, and CPU speed."})]}),n.jsxs(Mo,{children:[n.jsx(Er,{onClick:v,size:"medium",children:"Cancel"}),n.jsxs(pe,{onClick:I,disabled:d.size===0,size:"medium",children:["Download (",d.size,")"]})]})]})]})})},Fc=u.div`
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
`,Mc=u.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,Bc=u.h2`
  margin: 0 0 1rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.text};
`,Tc=u.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 1.5rem;
`,Fo=u.button`
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
`,Gc=u.div`
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
`,Vc=u.div`
  display: flex;
  align-items: center;
  gap: 8px;
`,Hc=u.span`
  color: ${r.colors.text};
  font-size: 13px;
  user-select: none;
`,Sr=u.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  padding: 4px 0;
`,qc=u.input.attrs({type:"checkbox"})`
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

  ${Sr}:hover & {
    border-color: ${r.colors.accent};
  }
`,Jc=u.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
`,Xc=u.span`
  color: ${r.colors.text};
  font-size: ${r.fontSizes.base};
  user-select: none;
`,Yc=u.label`
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
  flex-shrink: 0;
  cursor: pointer;
`,Zc=u.input`
  opacity: 0;
  width: 0;
  height: 0;
`,Qc=u.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${e=>e.$checked?r.colors.accent:r.colors.border};
  border-radius: 20px;
  transition: background-color 0.2s ease-in-out;
`,ed=u.span`
  position: absolute;
  top: 2px;
  left: ${e=>e.$checked?"18px":"2px"};
  width: 16px;
  height: 16px;
  background-color: ${r.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,td=u.div`
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
`,Mo=u.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: auto;
`,nd=u.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`,od=u.div`
  background-color: ${r.colors.border};
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  width: 100%;
`,rd=u.div`
  background-color: ${r.colors.accent};
  height: 100%;
  transition: width 0.15s ease-out;
`,id=u.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
`,sd=u.div`
  color: ${r.colors.text};
  max-width: 80%;
`,Bo=u.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,ad=u.ul`
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
`,ld=u.span`
  color: ${r.colors.textDark};
  font-weight: ${r.fontWeights.semiBold};
`,Er=u(pe)`
  background-color: ${r.colors.backgroundLighter};
  color: ${r.colors.textDark};

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`,cd=u(Er)`
  width: 100%;
`;function dd(){return!!(window.location.hostname==="localhost"||window.location.hostname==="[::1]"||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))}function ud(e,t,i){e.addEventListener("statechange",()=>{var o,s;e.state==="installed"&&(navigator.serviceWorker.controller?(console.log("[SW] New content is available. Will be used when all existing tabs are closed or you reload."),(o=i==null?void 0:i.onUpdate)==null||o.call(i,t)):(console.log("[SW] Content is cached for offline use."),(s=i==null?void 0:i.onSuccess)==null||s.call(i,t)))})}async function Pr(e,t){var i;try{const o=await navigator.serviceWorker.register(e);let s=null;const a=l=>{l===null||l===s||(s=l,ud(l,o,t))};o.addEventListener("updatefound",()=>a(o.installing)),o.waiting&&navigator.serviceWorker.controller?(i=t==null?void 0:t.onUpdate)==null||i.call(t,o):a(o.installing)}catch(o){console.error("[SW] Error during service worker registration:",o)}}async function pd(e,t){try{const i=await fetch(e,{headers:{"Service-Worker":"script"}}),o=i.headers.get("content-type");i.status===404||o!==null&&o.indexOf("javascript")===-1?(await(await navigator.serviceWorker.ready).unregister(),window.location.reload()):await Pr(e,t)}catch{console.log("[SW] No internet connection found. App is running in offline mode.")}}function fd(e){!("serviceWorker"in navigator)||new URL("/",window.location.href).origin!==window.location.origin||window.addEventListener("load",()=>{const i="/service-worker.js";dd()?(pd(i,e),navigator.serviceWorker.ready.then(()=>{console.log("[SW] This web app is being served cache-first by a service worker. See https://cra.link/PWA for more details.")})):Pr(i,e)})}const hd=({report:e,onAccept:t,onCancel:i,"data-testid":o})=>n.jsx(gd,{"data-testid":o,children:n.jsxs(md,{"data-testid":o&&`${o}-box`,children:[n.jsx(bd,{children:"Version Compatibility Warning"}),n.jsx(wd,{children:"The shared link was created under a different environment. You may experience compatibility issues."}),n.jsxs(xd,{children:[e.guiWarning&&n.jsxs(Bt,{"data-testid":o&&`${o}-gui-warning`,children:[n.jsxs(Tt,{children:["GUI Version Mismatch",n.jsx(Gt,{"data-testid":"gui-mismatch-badge",children:"Mismatch"})]}),n.jsxs(Vt,{children:["The shared link was created with a newer version of the GUI (",n.jsxs("strong",{children:["v",e.guiWarning.shared]}),") than your current version (",n.jsxs("strong",{children:["v",e.guiWarning.current]}),"). Some interface options or features may not function as expected."]})]}),e.ergogenWarning&&n.jsxs(Bt,{"data-testid":o&&`${o}-ergogen-warning`,children:[n.jsxs(Tt,{children:["Ergogen Version Mismatch",n.jsx(Gt,{"data-testid":"ergogen-mismatch-badge",children:"Mismatch"})]}),n.jsxs(Vt,{children:["The shared link was created with a newer version of Ergogen (",n.jsx("strong",{children:e.ergogenWarning.shared}),") than your current version (",n.jsx("strong",{children:e.ergogenWarning.current}),"). Some features or syntax might not be supported."]})]}),e.customErgogenWarning&&n.jsxs(Bt,{"data-testid":o&&`${o}-custom-ergogen-warning`,children:[n.jsxs(Tt,{children:["Custom Ergogen Version Used",n.jsx(Gt,{"data-testid":"custom-version-badge",children:"Custom"})]}),n.jsxs(Vt,{children:["The shared link was created using a custom version of Ergogen:"," ",n.jsx("strong",{children:e.customErgogenWarning.shared}),".",n.jsx("br",{}),"You can investigate the repository used here:",n.jsx("br",{}),n.jsx(yd,{href:e.customErgogenWarning.url,target:"_blank",rel:"noopener noreferrer","data-testid":o&&`${o}-custom-repo-link`,children:e.customErgogenWarning.label})]})]})]}),n.jsxs(kd,{children:[n.jsx(vd,{onClick:i,size:"medium","data-testid":o&&`${o}-cancel`,"aria-label":"Cancel configuration loading",children:"Cancel"}),n.jsx(_d,{onClick:t,size:"medium","data-testid":o&&`${o}-accept`,"aria-label":"Accept and load configuration",children:"Accept and Load"})]})]})}),gd=u.div`
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
`,md=u.div`
  background-color: ${r.colors.backgroundLight};
  border: 1px solid ${r.colors.border};
  border-radius: 8px;
  padding: 2rem;
  max-width: 550px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
`,bd=u.h2`
  margin: 0 0 0.5rem 0;
  font-size: ${r.fontSizes.h3};
  color: ${r.colors.error};
`,wd=u.p`
  margin: 0 0 1.5rem 0;
  font-size: ${r.fontSizes.base};
  color: ${r.colors.textDarker};
  line-height: 1.4;
`,xd=u.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`,Bt=u.div`
  background-color: ${r.colors.backgroundLighter};
  border-left: 4px solid ${r.colors.warningDark};
  padding: 1rem;
  border-radius: 4px;
`,Tt=u.div`
  font-size: ${r.fontSizes.base};
  font-weight: ${r.fontWeights.bold};
  color: ${r.colors.warningDark};
  margin-bottom: 0.25rem;
`,Gt=u.span`
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
`,Vt=u.div`
  font-size: ${r.fontSizes.bodySmall};
  color: ${r.colors.textDark};
  line-height: 1.5;

  strong {
    color: ${r.colors.text};
  }
`,yd=u.a`
  display: inline-block;
  margin-top: 0.5rem;
  color: ${r.colors.accent};
  text-decoration: underline;
  word-break: break-all;

  &:hover {
    color: ${r.colors.accentSecondary};
  }
`,kd=u.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`,_d=u(pe)`
  background-color: ${r.colors.accent};
  color: ${r.colors.white};

  &:hover {
    background-color: ${r.colors.accentDark};
  }
`,vd=u(pe)`
  background-color: ${r.colors.backgroundLighter};
  color: ${r.colors.textDark};

  &:hover {
    background-color: ${r.colors.buttonHover};
  }
`;let To=null,Go=!1;const jd=()=>{Go||(To=yr(),Go=!0);const e=To,t=[];let i=null;const o=p.useRef(null);if(e)if(e.success){const l=e.config;o.current===null&&(o.current={config:l.config,injections:l.injections,guiVersion:l.guiVersion,ergogenVersion:l.ergogenVersion}),window.history.replaceState(null,"",window.location.pathname+window.location.search)}else i=e.message,console.error("[App] Failed to load shared configuration from hash",{error:e.error,message:e.message,hashLength:window.location.hash.length}),window.history.replaceState(null,"",window.location.pathname+window.location.search);const[s,a]=p.useState(null);return p.useEffect(()=>{o.current&&a(o.current)},[]),n.jsx(Mi,{initialInjectionInput:t,hashError:i,children:n.jsx(Sd,{pendingSharedConfig:s})})};function $d(){const[e,t]=p.useState(null),i=new URLSearchParams(window.location.search).has("force_update");if(p.useEffect(()=>{fd({onUpdate:o=>{t(o)}})},[]),i)return()=>{console.log("[SW] Force-update triggered via ?force_update URL parameter."),window.location.reload()};if(e)return()=>{let o;if("serviceWorker"in navigator){let a=!1;navigator.serviceWorker.addEventListener("controllerchange",()=>{a||(a=!0,o&&clearTimeout(o),window.location.reload())})}const s=e.waiting;s?(s.postMessage({type:"SKIP_WAITING"}),o=setTimeout(()=>{window.location.reload()},1e3)):window.location.reload()}}function Cd(){const[e,t]=p.useState(null),[i,o]=p.useState(!1),[s,a]=p.useState(!1),l=new URLSearchParams(window.location.search).has("force_install");return p.useEffect(()=>{(()=>{const g=typeof window<"u"&&typeof window.matchMedia=="function"&&window.matchMedia("(display-mode: standalone)").matches,S=window.navigator.standalone===!0;a(g||S)})();const m=g=>{g.preventDefault(),t(g),console.log("[PWA] beforeinstallprompt event fired and captured.")},b=()=>{console.log("[PWA] appinstalled event fired."),a(!0),o(!1)};return window.addEventListener("beforeinstallprompt",m),window.addEventListener("appinstalled",b),()=>{window.removeEventListener("beforeinstallprompt",m),window.removeEventListener("appinstalled",b)}},[]),{onInstall:()=>{M("pwa_install_click"),o(!0),e?(e.prompt(),e.userChoice.then(c=>{c.outcome==="accepted"?(console.log("[PWA] User accepted the install prompt"),M("pwa_install_accepted"),a(!0)):(console.log("[PWA] User dismissed the install prompt"),M("pwa_install_dismissed")),o(!1),t(null)})):(console.log("[PWA] Install prompt triggered (deferredPrompt is not available on this device/browser)"),alert('PWA installation is not supported by this browser or is restricted on this device. If you are on iOS/iPadOS, please open this site in Safari and select "Add to Home Screen" from the Share menu.'),o(!1))},isAvailable:!!e||l,isInstalled:s,isInstalling:i}}const Sd=({pendingSharedConfig:e})=>{var L;const t=ve(),i=t==null?void 0:t.configInput,o=Yo(),s=$d(),a=Cd(),l=p.useRef(0);l.current=((L=t==null?void 0:t.configs)==null?void 0:L.length)||0,p.useEffect(()=>{M("page_view",{page_path:o.pathname,stored_configs_count:l.current})},[o.pathname]);const d=p.useRef(!1),h=p.useRef(e);e!==h.current&&(h.current=e);const{currentConflict:c,processInjectionsWithConflictResolution:m,handleConflictResolution:b,handleConflictCancel:g}=kt({setInjectionInput:I=>t==null?void 0:t.setInjectionInput(I),setConfigInput:I=>t==null?void 0:t.loadPreview(I),generateNow:async(I,v,W)=>{t&&await t.generateNow(I,v,W)},getCurrentInjections:()=>(t==null?void 0:t.injectionInput)||[],onComplete:async(I,v)=>{localStorage.setItem("ergogen:injection",JSON.stringify(v)),t==null||t.loadPreview(I)},setError:I=>t==null?void 0:t.setError(I)}),[S,w]=p.useState(null),f=(I,v)=>{const W=xt.version,R=dn("github:ceoloide/ergogen#v4.3.0");let A=!0,O,x,E;if(I){const j=Ue(W),U=Ue(I);j&&U&&!Ht(j,U)&&(A=!1,O={current:W,shared:I})}if(v){if(Vr(v)&&v!==R){A=!1;const F=cn(v);E={shared:v,url:F.url,label:F.label}}const j=ro(R)||Je(),U=ro(v);if(U){const F=Ue(j),D=Ue(U);F&&D&&!Ht(F,D)&&(A=!1,x={current:j,shared:U})}}return{isCompatible:A,guiWarning:O,ergogenWarning:x,customErgogenWarning:E}},k=p.useCallback((I,v)=>{t&&(v!==void 0&&v.length>0?m(v,I).catch(W=>{console.error("[App] Error processing injections:",W),t.setError(`Failed to process injections: ${W instanceof Error?W.message:"Unknown error"}`)}):(t.loadPreview(I),t.generateNow(I,t.injectionInput,{pointsonly:!1})))},[t,m]),C=()=>{var I;S&&(M("shared_config_accepted",{has_injections:!!(S.injections&&S.injections.length>0),injections_count:((I=S.injections)==null?void 0:I.length)||0}),k(S.config,S.injections),w(null))},P=()=>{var I;S&&M("shared_config_declined",{has_injections:!!(S.injections&&S.injections.length>0),injections_count:((I=S.injections)==null?void 0:I.length)||0}),w(null)};return p.useEffect(()=>{if(!t||!e||d.current)return;d.current=!0;const I=f(e.guiVersion,e.ergogenVersion);I.isCompatible?k(e.config,e.injections):w({config:e.config,injections:e.injections,report:I})},[t,e,k]),p.useEffect(()=>{if(!t)return;const I=()=>{const v=yr();if(v)if(v.success){const W=v.config,R=f(W.guiVersion,W.ergogenVersion);R.isCompatible?k(W.config,W.injections):w({config:W.config,injections:W.injections,report:R}),window.history.replaceState(null,"",window.location.pathname+window.location.search)}else console.error("[App] Failed to load shared configuration from hash (hashchange)",{error:v.error,message:v.message,hashLength:window.location.hash.length}),t.setError(v.message),window.history.replaceState(null,"",window.location.pathname+window.location.search)};return window.addEventListener("hashchange",I),()=>{window.removeEventListener("hashchange",I)}},[t,k]),n.jsxs(n.Fragment,{children:[S&&n.jsx(hd,{report:S.report,onAccept:C,onCancel:P,"data-testid":"share-compatibility-dialog"}),c&&n.jsx(bt,{injectionName:c.name,injectionType:c.type,onResolve:b,onCancel:g,"data-testid":"conflict-dialog"}),(t==null?void 0:t.isBulkDownloadOpen)&&n.jsx(Oc,{isOpen:t.isBulkDownloadOpen,configs:t.configs,injections:t.injectionInput,debug:t.debug,stlPreview:t.stlPreview,onClose:()=>t.setIsBulkDownloadOpen(!1),"data-testid":"bulk-download-dialog"}),n.jsx(Tl,{onUpdate:s}),n.jsx(Yl,{visible:(t==null?void 0:t.isGenerating)??!1,"data-testid":"loading-bar"}),n.jsx(Ql,{}),n.jsx(ac,{isOpen:(t==null?void 0:t.showSideNav)??!1,onClose:()=>t==null?void 0:t.setShowSideNav(!1),"data-testid":"side-navigation"}),n.jsx(Ed,{children:n.jsxs(Fr,{children:[n.jsx(Et,{path:"/",element:i?n.jsx(Ra,{pwaState:a}):n.jsx(oo,{to:{pathname:"/new",search:o.search},replace:!0})}),n.jsx(Et,{path:"/new",element:n.jsx(_l,{})}),n.jsx(Et,{path:"*",element:n.jsx(oo,{to:"/",replace:!0})})]})}),(t==null?void 0:t.currentConflict)&&n.jsx(bt,{injectionName:t.currentConflict.name,injectionType:t.currentConflict.type,onResolve:t.handleConflictResolution,onCancel:t.handleConflictCancel,"data-testid":"conflict-resolution-dialog"})]})},Ed=u.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
`;let Vo=!1;const Pd=e=>{Vo||(e.editor.defineTheme("ergogen-theme",{base:"vs-dark",inherit:!0,rules:[],colors:{"editor.background":r.colors.backgroundLight}}),Vo=!0)};sr();const Id=u.div`
  display: flex;
  flex-direction: column;
  color: #ffffff;
  height: 100%;
  width: 100%;
  font-family: 'Roboto', sans-serif;
`,Ld=Mr`
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
`;Qo.config({paths:{vs:"/monaco/vs"}});Qo.init().then(e=>{Pd(e);const t=document.getElementById("root");Br(t).render(n.jsx(Xo.StrictMode,{children:n.jsx(Tr,{basename:("/".startsWith("."),"/"),children:n.jsxs(Id,{children:[n.jsx(Ld,{}),n.jsx(jd,{})]})})}))});export{ht as a,r as t};
