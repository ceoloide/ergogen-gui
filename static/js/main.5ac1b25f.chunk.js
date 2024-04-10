(this["webpackJsonpergogen-gui"]=this["webpackJsonpergogen-gui"]||[]).push([[0],{129:function(n,e,t){},206:function(n,e){},208:function(n,e){},268:function(n,e,t){"use strict";t.r(e);var r,o,i,a,s,c,l,m,u,d,h,p,b,_,g,f,y,w,x,j,k,v,O,P,U,A,z,N,D,C=t(4),S=t(0),G=t.n(S),I=t(115),F=t(6),B=(t(129),t(5)),M=t(123),E=t(13),R=t(7),T=t.n(R),Z=t(121),J=t(1),L=t(40),K=t(32),V=t.n(K),W=t(270),Y=t(2),X=Object(S.createContext)(null),Q=function(n){var e=n.initialInput,t=n.children,r=Object(W.a)("LOCAL_STORAGE_CONFIG",e),o=Object(B.a)(r,2),i=o[0],a=o[1],s=Object(S.useState)(null),c=Object(B.a)(s,2),l=c[0],m=c[1],u=Object(S.useState)(null),d=Object(B.a)(u,2),h=d[0],p=d[1],b=Object(S.useState)(!0),_=Object(B.a)(b,2),g=_[0],f=_[1],y=Object(S.useState)(!0),w=Object(B.a)(y,2),x=w[0],j=w[1],k=Object(S.useState)(!1),v=Object(B.a)(k,2),O=v[0],P=v[1],U=function(n){var e="UNKNOWN",t=null;try{t=JSON.parse(n),e="JSON"}catch(r){}try{t=L.a.load(n),e="YAML"}catch(r){}return[e,t]},A=Object(S.useCallback)(V()(function(){var n=Object(E.a)(T.a.mark((function n(e){var t,r,o,i,a,s,c=arguments;return T.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return t=c.length>1&&void 0!==c[1]?c[1]:{pointsonly:!0},r=null,o=null!==e&&void 0!==e?e:"",i=U(null!==e&&void 0!==e?e:""),a=Object(B.a)(i,2),s=a[1],m(null),null!==s&&void 0!==s&&s.points&&null!==t&&void 0!==t&&t.pointsonly&&(o={points:Object(J.a)({},null===s||void 0===s?void 0:s.points),units:Object(J.a)({},null===s||void 0===s?void 0:s.units),variables:Object(J.a)({},null===s||void 0===s?void 0:s.variables),outlines:Object(J.a)({},null===s||void 0===s?void 0:s.outlines)}),n.prev=6,n.next=9,window.ergogen.process(o,g,(function(n){return console.log(n)}));case 9:r=n.sent,n.next=19;break;case 12:if(n.prev=12,n.t0=n.catch(6),n.t0){n.next=16;break}return n.abrupt("return");case 16:return"string"===typeof n.t0&&m(n.t0),"object"===typeof n.t0&&m(n.t0.toString()),n.abrupt("return");case 19:p(r);case 20:case"end":return n.stop()}}),n,null,[[6,12]])})));return function(e){return n.apply(this,arguments)}}(),300),[window.ergogen]);return Object(S.useEffect)((function(){x&&A(i,{pointsonly:!O})}),[i,A,x,O]),Object(Y.jsx)(X.Provider,{value:{configInput:i,setConfigInput:a,processInput:A,error:l,results:h,debug:g,setDebug:f,autoGen:x,setAutoGen:j,autoGen3D:O,setAutoGen3D:P},children:t})},q=function(){return Object(S.useContext)(X)},H=function(n){var e=n.className,t=q(),r=t.configInput,o=t.setConfigInput,i=function(){var n=Object(E.a)(T.a.mark((function n(e){return T.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(e){n.next=2;break}return n.abrupt("return",null);case 2:o(e);case 3:case"end":return n.stop()}}),n)})));return function(e){return n.apply(this,arguments)}}();return Object(S.useEffect)((function(){i(r)})),Object(Y.jsx)("div",{className:e,children:Object(Y.jsx)(Z.a,{height:"70vh",defaultLanguage:"JSON",onChange:i,value:r,theme:"vs-dark",defaultValue:r})})},$=t(11),nn=["size"],en=F.a.button(r||(r=Object(C.a)(["\n  display: inline-block;\n  border: none;\n  padding: 1rem 2rem;\n  margin: 0;\n  text-decoration: none;\n  background-color: #28a745;\n  border-radius: .25rem;\n  transition: color .15s ease-in-out,\n  background-color .15s ease-in-out,\n  border-color .15s ease-in-out,\n  box-shadow .15s ease-in-out;\n  color: #ffffff;\n  font-family: sans-serif;\n  font-size: 1.2rem;\n  cursor: pointer;\n  text-align: center;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n\n  &:hover {\n    background-color: #218838;\n    border-color: #1e7e34;\n  }\n\n  &:active {\n    transform: scale(0.98);\n    outline: 2px solid #fff;\n    outline-offset: -5px;\n  }\n"]))),tn=Object(F.a)(en)(o||(o=Object(C.a)(["\n    padding: 0.7rem 1.4rem;\n    font-size: 1rem;\n"]))),rn=Object(F.a)(en)(i||(i=Object(C.a)(["\n    padding: 0.4rem 0.8rem;\n    font-size: 0.8rem;\n"]))),on=function(n){var e=n.size,t=Object($.a)(n,nn);switch(e){case"sm":case"small":return Object(Y.jsx)(rn,Object(J.a)({},t));case"md":case"medium":return Object(Y.jsx)(tn,Object(J.a)({},t));default:return Object(Y.jsx)(en,Object(J.a)({},t))}},an=F.a.div(a||(a=Object(C.a)(["\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 0.5em\n"]))),sn=F.a.div(s||(s=Object(C.a)(["\n    overflow: hidden;\n    text-overflow: ellipsis;\n"]))),cn=F.a.div(c||(c=Object(C.a)(["\n    white-space: nowrap;\n"]))),ln=Object(F.a)(on)(l||(l=Object(C.a)(["\nmargin-right: 0.5em;\n"]))),mn=function(n){var e=n.fileName,t=n.extension,r=n.content,o=n.preview,i=n.setPreview,a=n.setTabIndex;return Object(Y.jsxs)(an,{children:[Object(Y.jsxs)(sn,{children:[e,".",t]}),Object(Y.jsxs)(cn,{children:[o&&Object(Y.jsx)(ln,{size:"small",onClick:function(){i(o),null===a||void 0===a||a(0)},children:"Preview"}),Object(Y.jsx)("a",{target:"_blank",rel:"noreferrer",download:"".concat(e,".").concat(t),href:window.URL.createObjectURL(new Blob([r],{type:"octet/stream"})),children:Object(Y.jsx)(on,{size:"small",children:"Download"})})]})]})},un=(F.a.div(m||(m=Object(C.a)(["\n    position: relative;\n    height: 100%;\n"]))),F.a.div(u||(u=Object(C.a)(["\n    display: flex;\n    align-content: space-between;\n    justify-content: space-around;\n    width: 100%;\n    margin-bottom: 1rem;\n    border-radius: 0.25rem;\n    overflow: hidden;\n"]))),F.a.div(d||(d=Object(C.a)(["\n    display: flex;\n    background: #595959;\n    padding: 0.5rem 1rem;\n    flex-grow: 1;\n    justify-content: center;\n    align-content: center;\n    cursor: pointer;\n    transition: background-color 150ms ease-in-out;\n\n    ","\n    &:hover {\n        background: #525252;\n    }\n\n    &:active {\n        background: #595959;\n    }\n"])),(function(n){return null!==n&&void 0!==n&&n.active?"border-bottom: 0.2rem solid #28a745;":""})),Object(S.createContext)(null)),dn=F.a.div(h||(h=Object(C.a)(["\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n"]))),hn=function(n){var e=n.setPreview,t=[],r=q(),o=Object(S.useContext)(un);if(!r)return null;var i,a=r.configInput,s=r.results;null!==s&&void 0!==s&&s.demo&&t.push({fileName:"raw",extension:"txt",content:null!==a&&void 0!==a?a:""},{fileName:"canonical",extension:"yaml",content:L.a.dump(s.points)},{fileName:"demo",extension:"dxf",content:null===s||void 0===s||null===(i=s.demo)||void 0===i?void 0:i.dxf,preview:"demo.svg"},{fileName:"points",extension:"yaml",content:L.a.dump(s.points)},{fileName:"units",extension:"yaml",content:L.a.dump(s.units)});if(null!==s&&void 0!==s&&s.outlines)for(var c=0,l=Object.entries(s.outlines);c<l.length;c++){var m=Object(B.a)(l[c],2),u=m[0],d=m[1];t.push({fileName:u,extension:"dxf",content:d.dxf,preview:"outlines.".concat(u,".svg")})}if(null!==s&&void 0!==s&&s.cases)for(var h=0,p=Object.entries(s.cases);h<p.length;h++){var b=Object(B.a)(p[h],2),_=b[0],g=b[1];t.push({fileName:_,extension:"stl",content:g.stl,preview:"cases.".concat(_,".jscad")})}if(null!==s&&void 0!==s&&s.pcbs)for(var f=0,y=Object.entries(s.pcbs);f<y.length;f++){var w=Object(B.a)(y[f],2),x=w[0],j=w[1];t.push({fileName:x,extension:"kicad_pcb",content:j})}return Object(Y.jsxs)(dn,{children:[Object(Y.jsx)("h3",{children:"Downloads"}),t.map((function(n,t){return!n.fileName.startsWith("_")&&Object(Y.jsx)(mn,Object(J.a)(Object(J.a)({},n),{},{setPreview:e,setTabIndex:null===o||void 0===o?void 0:o.setTabIndex}),t)}))]})},pn=t(119),bn=F.a.img(p||(p=Object(C.a)(["\n      filter: invert();\n      -webkit-user-drag: none;\n      -khtml-user-drag: none;\n      -moz-user-drag: none;\n      -o-user-drag: none;\n      user-drag: none;\n"]))),_n=Object(F.a)(pn.PanZoom)(b||(b=Object(C.a)(["\n  overflow: hidden;\n  height: 100%;\n\n  &:focus-visible {\n    outline: none;\n  }\n"]))),gn=function(n){var e=n.svg,t=n.width,r=n.height;return Object(Y.jsx)(_n,{enableBoundingBox:!0,minZoom:.8,maxZoom:5,children:Object(Y.jsx)(bn,{width:t||"100%",height:r||"100%",src:"data:image/svg+xml;utf8,".concat(encodeURIComponent(e)),alt:"Ergogen SVG Output preview"})})},fn=t(122),yn=Object(F.a)(fn.a)(_||(_=Object(C.a)(["\n  width: 100%;\n  height: 400px;\n"]))),wn=function(n){var e=n.previewContent;return Object(Y.jsx)(yn,{jscadScript:e,style:{wrapperDiv:{height:"100%",width:"100%"},viewerCanvas:{height:"400px",width:"100%"}}})},xn=G.a.memo(wn),jn=function(n){var e=n.previewKey,t=n.previewContent,r=n.width,o=void 0===r?"100%":r,i=n.height,a=void 0===i?"100%":i,s=n.className,c=e.split(".").slice(-1)[0];return Object(Y.jsx)("div",{className:s,children:function(n){switch(n){case"svg":return Object(Y.jsx)(gn,{svg:t,width:o,height:a});case"jscad":return Object(Y.jsx)(xn,{previewContent:t});default:return Object(Y.jsx)(Y.Fragment,{})}}(c)})},kn=t(120),vn=F.a.span(g||(g=Object(C.a)(["\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n"]))),On=function(n){var e=n.optionId,t=n.label,r=n.setSelected,o=n.checked;return Object(Y.jsxs)(vn,{children:[Object(Y.jsx)("input",{type:"checkbox",id:e,checked:o,onChange:function(n){return r(n.target.checked)}}),Object(Y.jsx)("label",{htmlFor:e,children:t})]})},Pn={label:"Absolem (simplified)",author:"MrZealot",value:"points:\n  zones:\n    matrix:\n      anchor:\n        rotate: 5\n      columns:\n        pinky:\n        ring:\n          key.splay: -5\n          key.origin: [-12, -19]\n          key.stagger: 12\n        middle:\n          key.stagger: 5\n        index:\n          key.stagger: -6\n        inner:\n          key.stagger: -2\n      rows:\n        bottom:\n        home:\n        top:\n    thumbfan:\n      anchor:\n        ref: matrix_inner_bottom\n        shift: [-7, -19]\n      columns:\n        near:\n        home:\n          key.spread: 21.25\n          key.splay: -28\n          key.origin: [-11.75, -9]\n        far:\n          key.spread: 21.25\n          key.splay: -28\n          key.origin: [-9.5, -9]\n      rows:\n        thumb:\n  rotate: -20\n  mirror:\n    ref: matrix_pinky_home\n    distance: 223.7529778"},Un=[{label:"Simple (points only)",options:[Pn,{label:"Atreus (simplified)",author:"MrZealot",value:"\npoints:\n  zones:\n    matrix:\n      columns:\n        pinky:\n        ring:\n          key.stagger: 3\n        middle:\n          key.stagger: 5\n        index:\n          key.stagger: -5\n        inner:\n          key.stagger: -6\n        thumb:\n          key.skip: true\n          key.stagger: 10\n          rows:\n            home.skip: false\n      rows:\n        bottom:\n        home:\n        top:\n        num:\n  rotate: -10\n  mirror:\n    ref: matrix_thumb_home\n    distance: 22\n"}]},{label:"Complete (with pcb)",options:[{label:"A. dux",author:"tapioki",value:"\npoints:\n  zones:\n    matrix:\n      columns:\n        pinky:\n          key:\n            spread: 18\n            splay: 15\n            origin: [0, -17]\n          rows:\n            bottom:\n              bind: [5, 0, 0, 0]\n              column_net: P7\n            home:\n              bind: [0, 12, 0, 0]\n              column_net: P6\n            top:\n              bind: [0, 8, 5, 0]\n              column_net: P5 \n        ring:\n          key:\n            spread: 18\n            stagger: 17\n            splay: -10\n            origin: [0, -17]\n          rows:\n            bottom:\n              bind: [0, 0, 2, 10]\n              column_net: P4\n            home:\n              bind: [5, 0, 5, 0]\n              column_net: P3\n            top:\n              bind: [0, 6, 0, 0]\n              column_net: P0\n        middle:\n          key:\n            shift: [0.2, 0]\n            spread: 18\n            stagger: 17/3\n            splay: -5\n            origin: [0, -17]\n          rows:\n            bottom:\n              bind: [0, 10, 0, 5]\n              column_net: P1\n            home:\n              bind: 5\n              column_net: P19\n            top:\n              bind: [0, 0, 0, 0]\n              column_net: P18\n        index:\n          key:\n            spread: 18\n            stagger: -17/3\n            splay: -5\n            origin: [0, -17]\n          rows:\n            bottom:\n              bind: [0, 5, 0, 0]\n              column_net: P15\n            home:\n              bind: [5, 0, 5, 0]\n              column_net: P14\n            top:\n              bind: [0, 0, 0, 6]\n              column_net: P16\n        inner:\n          key:\n            spread: 18\n            stagger: -17/6\n            origin: [0, -17]\n          rows: \n            bottom:\n              bind: [5, 19, 20, 2]\n              column_net: P10\n            home:\n              bind: [0, 27, 0, 5]\n              column_net: P20\n            top:\n              bind: [0, 0, 5, 5]\n              column_net: P21\n      rows:\n        bottom:\n          padding: 17\n        home:\n          padding: 17\n        top:\n    thumb:\n      anchor:\n        ref: matrix_inner_bottom\n        shift: [0,-24]\n      columns:\n        first:\n          key:\n            splay: -15\n          rows:\n            only:\n              column_net: P8\n              bind: [10, 1, 0, 70]\n        second:\n          key:\n            spread: 18\n            splay: -10\n            origin: [-9, -9.5]\n          rows:\n            only:\n              column_net: P9\n              bind: [0, 0, 0, 5]\n      rows:\n        only:\n          padding: 17\n      key:\n        footprints:\noutlines:\n  raw:\n    - what: rectangle\n      where: true\n      bound: true\n      asym: left\n      size: [18,17]\n      corner: 1\n  first:\n    - what: outline\n      name: raw\n      fillet: 3\n  second:\n    - what: outline\n      name: first\n      fillet: 2\n  third:\n    - what: outline\n      name: second\n      fillet: 1\n  panel:\n    - what: outline\n      name: third\n      fillet: 0.5\npcbs:\n  architeuthis_dux:\n    outlines:\n      main:\n        outline: panel\n    footprints:\n      choc_hotswap:\n        what: choc\n        where: true\n        params:\n          from: =column_net\n          to: GND\n          keycaps: true\n          reverse: true\n          hotswap: true\n      choc:\n        what: choc\n        where: true\n        adjust:\n          rotate: 180\n        params:\n          from: =column_net\n          to: GND\n          keycaps: true\n          reverse: true\n      promicro:\n        what: promicro\n        where:\n          ref: matrix_inner_home\n          shift: [19, -8.5]\n          rotate: -90\n        params:\n          orientation: down\n      trrs:\n        what: trrs\n        where:\n          ref: matrix_inner_home\n          shift: [34.75, 6.5]\n        params:\n          A: GND\n          B: GND\n          C: P2\n          D: VCC\n          reverse: true\n          symmetric: true\n"},{label:"Sweep-like (minimal)",author:"jcmkk3",value:'# `U` is a predefined unit of measure that means 19.05mm, which is MX spacing\npoints:\n  zones:\n    matrix:\n      columns:\n        pinky:\n        ring.key.stagger: 0.66U\n        middle.key.stagger: 0.25U\n        index.key.stagger: -0.25U\n        inner.key.stagger: -0.15U\n      rows:\n        bottom.padding: U\n        home.padding: U\n        top.padding: U\n    thumb:\n      anchor:\n        ref: matrix_index_bottom\n        shift: [0.66U, -1.25U]\n        rotate: -10\n      columns:\n        tucky:\n          key.name: thumb_tucky\n        reachy:\n          key.spread: U\n          key.splay: -15\n          key.origin: [-0.5U, -0.5U]\n          key.name: thumb_reachy\npcbs:\n  simple_split:\n    footprints:\n      keys:\n        what: mx\n        where: true\n        params:\n          from: GND\n          to: "{{name}}"\n          reverse: true\n          keycaps: true\n      mcu:\n        what: promicro\n        where:\n          - ref: matrix_inner_home\n            shift: [1U, 0.5U]\n            rotate: -90\n        params:\n          P7: matrix_pinky_top\n          P18: matrix_ring_top\n          P19: matrix_middle_top\n          P20: matrix_index_top\n          P21: matrix_inner_top\n          P15: matrix_pinky_home\n          P14: matrix_ring_home\n          P16: matrix_middle_home\n          P10: matrix_index_home\n          P1: matrix_inner_home\n          P2: matrix_pinky_bottom\n          P3: matrix_ring_bottom\n          P4: matrix_middle_bottom\n          P5: matrix_index_bottom\n          P6: matrix_inner_bottom\n          P8: thumb_tucky\n          P9: thumb_reachy\n'},{label:"Reviung41 (simplified)",author:"jcmkk3",value:'\nunits:\n  # `U` is a predefined unit of measure that means 19.05mm, which is MX spacing\n  angle: -8\npoints:\n  zones:\n    matrix:\n      rotate: angle\n      mirror: &mirror\n        ref: matrix_inner_bottom\n        shift: [0, -U]\n        distance: 2.25U\n      columns:\n        outer:\n          key:\n            column_net: P4\n            mirror.column_net: P9\n        pinky:\n          key:\n            stagger: 0.25U\n            column_net: P5\n            mirror.column_net: P8\n        ring:\n          key:\n            stagger: 0.25U\n            column_net: P6\n            mirror.column_net: P7\n        middle:\n          key:\n            stagger: 0.25U\n            column_net: P7\n            mirror.column_net: P6\n        index:\n          key:\n            stagger: -0.25U\n            column_net: P8\n            mirror.column_net: P5\n        inner:\n          key:\n            stagger: -0.25U\n            column_net: P9\n            mirror.column_net: P4\n      rows:\n        bottom:\n          key:\n            padding: U\n            row_net: P21\n            mirror.row_net: P18\n        home:\n          key:\n            padding: U\n            row_net: P20\n            mirror.row_net: P15\n        top:\n          key:\n            padding: U\n            row_net: P19\n            mirror.row_net: P14\n    thumb_middle:\n      anchor:\n        aggregate.parts:\n          - ref: matrix_inner_bottom\n          - ref: mirror_matrix_inner_bottom\n        shift: [0, -1.15U]\n      key:\n        name: thumb_middle\n        width: 2.25\n        row_net: P16\n        column_net: P6\n    thumb_reachy:\n      mirror: *mirror\n      anchor:\n        ref: thumb_middle\n        shift: [-3.5U / 2 - 2 , 0.12U]\n        rotate: angle\n      key:\n        name: thumb_reachy\n        width: 1.25\n        row_net: P16\n        column_net: P20\n        mirror.column_net: P15\n    thumb_tucky:\n      mirror: *mirror\n      anchor:\n        ref: thumb_reachy\n        shift: [-1.25U - 2, 0.4U]\n        rotate: -angle\n      key:\n        name: thumb_tucky\n        width: 1.25\n        row_net: P16\n        column_net: P21\n        mirror.column_net: P14\npcbs:\n  simple_reviung41:\n    footprints:\n      keys:\n        what: mx\n        where: true\n        params:\n          from: "{{row_net}}"\n          to: "{{column_net}}"\n          keycaps: true\n      diodes:\n        what: diode\n        where: true\n        adjust:\n          shift: [0, -4.7]\n        params:\n          from: "{{row_net}}"\n          to: "{{colrow}}"\n      mcu:\n        what: promicro\n        where:\n          aggregate.parts:\n            - ref: matrix_inner_top\n            - ref: mirror_matrix_inner_top\n          shift: [0, 22]\n          rotate: angle\n'},{label:"Tiny20",author:"enzocoralc",value:'\npoints:\n  zones:\n    matrix:\n      anchor:\n        rotate: 5\n      columns:\n        pinky:\n          key:\n            spread: 18\n            rows:\n              bottom:\n                column_net: P21\n              home:\n                column_net: P20\n        ring:\n          key:\n            spread: 18\n            splay: -5\n            origin: [-12, -19]\n            stagger: 16\n            rows:\n              bottom:\n                column_net: P19\n              home:\n                column_net: P18\n        middle:\n          key:\n            spread: 18\n            stagger: 5\n            rows:\n              bottom:\n                column_net: P15\n              home:\n                column_net: P14\n        index:\n          key:\n            spread: 18\n            stagger: -6\n            rows:\n              bottom:\n                column_net: P26\n              home:\n                column_net: P10\n      rows:\n        bottom:\n          padding: 17\n        home:\n          padding: 17\n    thumb:\n      anchor:\n        ref: matrix_index_bottom\n        shift: [2, -20]\n        rotate: 90\n      columns:\n        near:\n          key:\n            splay: -90\n            origin: [0,0]\n          rows:\n            home:\n              rotate: -90\n              column_net: P8\n        home:\n          key:\n            spread: 17\n            rotate: 90\n            origin: [0,0]\n          rows:\n            home:\n              column_net: P9\n  key:\n    footprints:\n      choc:\n        type: choc\n        nets:\n          from: GND\n          to: "{{column_net}}"\n        params:\n          keycaps: true\n          reverse: true\n          hotswap: false\n\noutlines:\n  plate:\n    - what: rectangle\n      where: true\n      asym: source\n      size: 18\n      corner: 3\n    - what: rectangle\n      where: true\n      asym: source\n      size: 14\n      bound: false\n      operation: subtract\n  pcb_perimeter_raw:\n    - what: rectangle\n      where: true\n      asym: source\n      size: 18\n      corner: 1\n  polygon:\n    - what: polygon # all borders\n      operation: stack\n      points:\n        - ref: matrix_pinky_bottom\n          shift: [-9,-9]\n        - ref: matrix_pinky_home\n          shift: [-9,1.3u]\n        - ref: matrix_middle_home\n          shift: [-9,9]\n        - ref: matrix_middle_home\n          shift: [9,9]\n        - ref: matrix_index_home\n          shift: [1.45u,9]\n        - ref: thumb_home_home\n          shift: [8,-9]\n        - ref: thumb_near_home\n          shift: [9,-9]\n  pcb_perimeter:\n    - what: outline # keys\n      name: pcb_perimeter_raw\n    - what: outline\n      name: polygon\n      operation: add\n\npcbs:\n  tiny20:\n    outlines:\n      main:\n        outline: pcb_perimeter\n    footprints:\n      keys:\n        what: choc\n        where: true\n        params:\n          from: GND\n          to: "{{column_net}}"\n          keycaps: true\n          reverse: true\n          hotswap: false\n      promicro:\n        what: promicro\n        where:\n          ref: matrix_index_home\n          shift: [0.95u, -0.5u]\n          rotate: -90\n        params:\n          orientation: down\n      trrs:\n        what: trrs\n        where:\n          ref: matrix_pinky_home\n          shift: [2, 1.1u]\n          rotate: 0\n        params:\n          A: GND\n          B: GND\n          C: P1\n          D: VCC\n          reverse: true\n          symmetric: true\n      reset:\n        what: button\n        where:\n          ref:\n            - matrix_ring_home\n          shift: [-0.7u, 0]\n          rotate: 90\n        params:\n          from: RST\n          to: GND\n      resetbottom:\n        what: button\n        where:\n          ref:\n            - matrix_ring_home\n          shift: [-0.7u, 0]\n          rotate: 90\n        params:\n          from: RST\n          to: GND\n          side: B\n'}]},{label:"Miscellaneous",options:[{label:"Wubbo (outlines, switchplate)",author:"cache.works",value:'units:\n  # Parameters\n  row_spacing: 1cy\n\n  pinky_rotation: 5 # degrees rotation relative to zone rotation\n  pinky_stagger: 0 # mm, relative to previous column\n  pinky_spread: 1cx # mm, relative to previous column\n\n  ring_rotation: 3\n  ring_stagger: 0.45cy\n  ring_spread: 1.05cx\n\n  middle_rotation: 0\n  middle_stagger: 1\n  middle_spread: 1.1cx\n\n  index_rotation: -1\n  index_stagger: -3\n  index_spread: 1cx\n\n  inner_rotation: -2\n  inner_stagger: -5\n  inner_spread: 1cx\n\n  usb_cutout_x:  51.64\n  usb_cutout_y: 2.10\n  usb_cutout_r: -15.5\n\n  # Constants\n  choc_cap_x: 17.5\n  choc_cap_y: 16.5\n\n  choc_plate_thickness: 1.2\n  mx_plate_thickness: 1.5\n\npoints:\n  rotate: 0\n  key: # each key across all zones will have these properties\n    bind: 5\n    width: choc_cap_x\n    height: choc_cap_y\n    tags:\n      1u: true\n    footprints: # These footprints will be added for each of the points\n      choc_hotswap:\n        type: choc\n        nets:\n          to: "{{key_net}}"\n          from: GND\n        params:\n          reverse: false\n          hotswap: true\n          # Don\'t show a model for this since \'choc\' already loads the model\n          model: false\n          keycaps: false\n      choc:\n        type: choc\n        anchor:\n          rotate: 180\n        nets:\n          to: "{{key_net}}"\n          from: GND\n        params:\n          keycaps: true\n          reverse: false\n  zones:\n    alphas:\n      rows:\n        bottom.padding: row_spacing\n        home.padding: row_spacing\n        top.padding: row_spacing\n      columns:\n        pinkycluster:\n          key:\n            splay: pinky_rotation\n          rows:\n            bottom.skip: true\n            home.key_net: P106\n            top.skip: true\n        pinky:\n          key:\n            splay: pinky_rotation - pinky_rotation\n            stagger: pinky_stagger\n            spread: pinky_spread\n          rows:\n            bottom.key_net: P104\n            home.key_net: P102\n            top.skip: true\n        ring:\n          key:\n            splay: ring_rotation - pinky_rotation\n            stagger: ring_stagger\n            spread: ring_spread\n          rows:\n            bottom.key_net: P101\n            home.key_net: P103\n            top.key_net: P100\n        middle:\n          key:\n            splay: middle_rotation - ring_rotation\n            stagger: middle_stagger\n            spread: middle_spread\n          rows:\n            bottom.key_net: P022\n            home.key_net: P029\n            top.key_net: P030\n        index:\n          key:\n            splay: index_rotation - middle_rotation\n            stagger: index_stagger\n            spread: index_spread\n          rows:\n            bottom.key_net: P031\n            home.key_net: P004\n            top.key_net: P005\n        inner:\n          key:\n            splay: inner_rotation - index_rotation\n            stagger: inner_stagger\n            spread: inner_spread\n          rows:\n            bottom.key_net: P007\n            home.key_net: P109\n            top.key_net: P012\n    thumbkeys:\n      anchor:\n        ref: alphas_index_bottom\n        shift: [ 0.5cx, -1cy - 2]\n      columns:\n        near:\n          key:\n            splay: -10\n            stagger: -5\n            origin: [ 0, -0.5cy ]\n            key_net: P009\n        home:\n          key:\n            spread: 19\n            stagger: 0.25cy # Move up by 0.25cy so a 1.5cy keycap lines up with the bottom\n            splay: -15 # -25 degrees cumulative\n            origin: [-0.5choc_cap_y, -0.75choc_cap_x] # Pivot at the lower left corner of a 1.5u choc key\n            height: choc_cap_x\n            width: 1.5choc_cap_y\n            rotate: 90\n            tags:\n              15u: true\n              1u: false\n            key_net: P010\n      rows:\n        thumb:\n          padding: 0\noutlines:\n  _bottom_arch_circle:\n    - what: circle\n      radius: 500\n      where:\n        ref: alphas_middle_bottom\n        shift: [-95, -525]\n  _top_arch_circle:\n    - what: circle\n      radius: 200\n      where:\n        ref: alphas_middle_bottom\n        shift: [0, -155]\n  _main_body_circle:\n    - what: circle\n      radius: 70\n      where:\n        ref: alphas_middle_bottom\n        shift: [0, 0]\n  _usb_c_cutout:\n    - what: rectangle\n      size: [9.28, 6.67]\n      where: &usbanchor\n        ref: alphas_middle_top\n        shift: [ usb_cutout_x, usb_cutout_y ]\n        rotate: usb_cutout_r\n  # Make a crescent by overlapping two circles then cut the main body with a third circle\n  _main: [\n      +_top_arch_circle,\n      -_bottom_arch_circle,\n      ~_main_body_circle\n  ]\n  _fillet:\n    - what: outline\n      name: _main\n      fillet: 6\n  combined: [\n      _fillet,\n      -_usb_c_cutout\n  ]\n  _switch_cutouts:\n    - what: rectangle\n      where: true\n      asym: source\n      size: 14 # Plate cutouts are 14mm * 14mm for both MX and Choc\n      bound: false\n  switch_plate:\n    [ combined, -_switch_cutouts]\ncases:\n  switchplate:\n    - what: outline\n      name: switch_plate\n      extrude: choc_plate_thickness\n  bottom:\n    - what: outline\n      name: combined\n      extrude: choc_plate_thickness\n'},{label:"Alpha (staggered bottom row)",author:"jcmkk3",value:"\npoints:\n  mirror:\n    ref: ortho_inner_home\n    distance: 1U\n  zones:\n    ortho:\n      columns:\n        pinky:\n        ring:\n        middle:\n        index:\n        inner:\n      rows:\n        home.padding: 1U\n        top.padding: 1U\n    stagger:\n      anchor:\n        ref: ortho_pinky_home\n        shift: [0.5U, -1U]\n      columns:\n        pinky:\n        ring:\n        middle:\n        index:\n          key.asym: left\n        space:\n          key:\n            spread: 0.5U\n            asym: right\n            width: 2*(u-1)\n      rows:\n        bottom.padding: 1U\n"},{label:"Plank (ortholinear, 2u space)",author:"cache.works",value:'\nunits:\n  visual_x: 17.5\n  visual_y: 16.5\npoints:\n  zones:\n    matrix:\n      columns:\n        one:\n          key:\n            column_net: P1\n            column_mark: 1\n        two:\n          key:\n            spread: 1cx\n            column_net: P0\n            column_mark: 2\n        three:\n          key:\n            spread: 1cx\n            column_net: P14\n            column_mark: 3\n        four:\n          key:\n            spread: 1cx\n            column_net: P20\n            column_mark: 4\n        five:\n          key:\n            spread:  1cx\n            column_net: P2\n            column_mark: 5\n        six:\n          key:\n            spread:  1cx\n            column_net: P3\n            column_mark: 6\n        seven:\n          key:\n            spread:  1cx\n            column_net: P4\n            column_mark: 7\n          rows:\n            2uspacebar:\n              skip: false\n              shift: [-0.5cx, 1cy]\n              rotate: 180\n            modrow:\n              shift: [-0.5cx, -1cy]\n              rotate: 180\n        eight:\n          key:\n            spread:  1cx\n            column_net: P5\n            column_mark: 8\n        nine:\n          key:\n            spread:  1cx\n            column_net: P6\n            column_mark: 9\n        ten:\n          key:\n            spread:  1cx\n            column_net: P7\n            column_mark: 10\n        eleven:\n          key:\n            spread:  1cx\n            column_net: P8\n            column_mark: 11\n        twelve:\n          key:\n            spread:  1cx\n            column_net: P9\n            column_mark: 12\n      rows:\n        2uspacebar:\n          padding: 1cy\n          row_net: P19\n          skip: true\n        modrow:\n          padding: 1cy\n          row_net: P19\n        bottom:\n          padding: 1cy\n          row_net: P18\n        home:\n          padding: 1cy\n          row_net: P15\n        top:\n          padding: 1cy\n          row_net: P21\n  key:\n    bind: 2\noutlines:\n  raw:\n    - what: rectangle\n      where: true\n      asym: left\n      size: [1cx,1cy]\n      corner: 1\n  panel:\n    - what: outline\n      name: raw\n      fillet: 0.5\n  switch_cutouts:\n    - what: rectangle\n      where: true\n      asym: left\n      size: 14\n      bound: false\n  switch_plate:\n    main:\n      what: outline\n      name: panel\n      fillet: 0.5\n    keyholes:\n      what: outline\n      name: switch_cutouts\n      operation: subtract\npcbs:\n  plank:\n    outlines:\n      main:\n        outline: panel\n    footprints:\n      choc:\n        what: choc\n        where: true\n        params:\n          from: "{{colrow}}"\n          to: "{{column_net}}"\n          keycaps: true\n      diode:\n        what: diode\n        where: true\n        adjust:\n          rotate: 0\n          shift: [ 0, -4.5 ]\n        params:\n          from: "{{colrow}}"\n          to: "{{row_net}}"\n          # via_in_pad: true\n          # through_hole: false\n      promicro:\n        what: promicro\n        where:\n          ref: matrix_seven_top\n          shift: [-0.5cx, 1]\n        params:\n          orientation: down\n      powerswitch:\n        what: slider\n        where:\n          ref: matrix_four_top\n          shift: [0.5cx, 8.95]\n        params:\n          from: RAW\n          to: BAT\n          side: B\n      jstph:\n        what: jstph\n        where:\n          ref: matrix_four_top\n          shift: [0.5cx, -1.5cy]\n          rotate: 180\n        params:\n          pos: BAT\n          neg: GND\n          side: B\n'}]}],An=F.a.div(f||(f=Object(C.a)(["\n  position: relative;\n  height: 80%;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  flex-grow: 1;\n"]))),zn=F.a.div(y||(y=Object(C.a)(["\n  display: flex;\n  flex-flow: wrap;\n"]))),Nn=F.a.div(w||(w=Object(C.a)(["\n  background: #ff6d6d;\n  color: #a31111;\n  padding: 1em;\n  margin: 0.5em 0 0.5em 0;\n  border: 1px solid #a31111;\n  border-radius: 0.3em;\n"]))),Dn=Object(F.a)(jn)(x||(x=Object(C.a)(["\n  height: 100%;\n"]))),Cn=Object(F.a)(H)(j||(j=Object(C.a)(["\n  position: relative;\n"]))),Sn=F.a.div(k||(k=Object(C.a)(["\n  display: flex;\n  justify-content: space-between;\n"]))),Gn=Object(F.a)(kn.a)(v||(v=Object(C.a)(["\n    color: black;\n    white-space: nowrap;\n"]))),In=Object(F.a)(M.a)(O||(O=Object(C.a)(["\n  width: 100%;\n  height: 100%;\n  display: flex;\n  padding: 1rem;\n\n  .gutter {\n    background-color: #878787;\n    border-radius: 0.15rem;\n\n    background-repeat: no-repeat;\n    background-position: 50%;\n\n    &:hover {\n      background-color: #a0a0a0;\n    }\n\n    &.gutter-horizontal {\n      cursor: col-resize;\n      background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');\n    }\n  }\n"]))),Fn=F.a.div(P||(P=Object(C.a)(["\n    padding-right: 1rem;\n    position: relative;\n"]))),Bn=F.a.div(U||(U=Object(C.a)(["\n    padding-left: 1rem;\n    position: relative;\n"]))),Mn=function(){var n,e=Object(S.useState)("demo.svg"),t=Object(B.a)(e,2),r=t[0],o=t[1],i=Object(S.useState)(null),a=Object(B.a)(i,2),s=a[0],c=a[1],l=q();if(Object(S.useEffect)((function(){null!==s&&void 0!==s&&s.value&&(null===l||void 0===l||l.setConfigInput(s.value))}),[s,l]),!l)return null;var m=null===l||void 0===l?void 0:l.results;r.split(".").forEach((function(n){var e;return m=null===(e=m)||void 0===e?void 0:e[n]}));var u="string"===typeof m?m:"";return Object(Y.jsx)(zn,{children:Object(Y.jsxs)(In,{direction:"horizontal",sizes:[30,70],minSize:100,gutterSize:10,snapOffset:0,children:[Object(Y.jsx)(Fn,{children:Object(Y.jsxs)(An,{children:[Object(Y.jsx)(Gn,{options:Un,value:s,onChange:function(n){return c(n)},placeholder:"Paste your config below, or select an example here!"}),Object(Y.jsx)(Cn,{}),Object(Y.jsx)(on,{onClick:function(){return null===l||void 0===l?void 0:l.processInput(null===l||void 0===l?void 0:l.configInput,{pointsonly:!1})},children:"Generate"}),Object(Y.jsxs)(Sn,{children:[Object(Y.jsx)(On,{optionId:"autogen",label:"Auto-generate",setSelected:null===l||void 0===l?void 0:l.setAutoGen,checked:null===l||void 0===l?void 0:l.autoGen}),Object(Y.jsx)(On,{optionId:"debug",label:"Debug",setSelected:null===l||void 0===l?void 0:l.setDebug,checked:null===l||void 0===l?void 0:l.debug}),Object(Y.jsx)(On,{optionId:"autogen3d",label:Object(Y.jsxs)(Y.Fragment,{children:["Auto-gen 3D ",Object(Y.jsx)("small",{children:"(slow)"})]}),setSelected:null===l||void 0===l?void 0:l.setAutoGen3D,checked:null===l||void 0===l?void 0:l.autoGen3D})]}),(null===l||void 0===l?void 0:l.error)&&Object(Y.jsx)(Nn,{children:null===l||void 0===l||null===(n=l.error)||void 0===n?void 0:n.toString()})]})}),Object(Y.jsx)(Bn,{children:Object(Y.jsxs)(In,{direction:"horizontal",sizes:[70,30],minSize:100,gutterSize:10,snapOffset:0,children:[Object(Y.jsx)(Fn,{children:Object(Y.jsx)(Dn,{previewKey:r,previewContent:u},r)}),Object(Y.jsx)(Bn,{children:Object(Y.jsx)(hn,{setPreview:o})})]})})]})})},En=F.a.div(A||(A=Object(C.a)(["\n      width: 100%;\n      height: 4em;\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      padding: 0 1rem 0 1rem;\n"]))),Rn=F.a.div(z||(z=Object(C.a)(["\n      a {\n        color: white;\n        text-decoration: none;\n        display: inline-block;\n        margin-right: 2em\n      }\n      a:last-of-type{\n        margin-right: 0;\n      }\n    "]))),Tn=function(){return Object(Y.jsxs)(En,{children:[Object(Y.jsx)("div",{children:Object(Y.jsx)("h2",{children:"Ergogen"})}),Object(Y.jsxs)(Rn,{children:[Object(Y.jsx)("a",{href:"https://docs.ergogen.xyz/",target:"_blank",rel:"noreferrer",children:"Docs"}),Object(Y.jsx)("a",{href:"https://discord.gg/nbKcAZB",target:"_blank",rel:"noreferrer",children:"Discord"})]})]})},Zn=F.a.div(N||(N=Object(C.a)(["\n      display: flex;\n      height: 3rem;\n      width: 100%;\n      align-items: center;\n      justify-content: space-between;\n      padding: 0 1rem 0.5rem 1rem;\n      margin-top: auto;\n      color: #FFFFFF;\n\n      a {\n        color: #28a745;\n        text-decoration: none;\n        \n        &:hover {\n          color: #FFF;\n        }\n      }\n"]))),Jn=function(){return Object(Y.jsxs)(Zn,{children:[Object(Y.jsx)("div",{children:Object(Y.jsx)("a",{href:"https://www.github.com/ergogen/ergogen",target:"_blank",rel:"noreferrer",children:"Ergogen by MrZealot"})}),Object(Y.jsxs)("div",{children:["v",window.ergogen.version]}),Object(Y.jsxs)("div",{children:["Powering the ",Object(Y.jsx)("a",{href:"https://zealot.hu/absolem",target:"_blank",rel:"noreferrer",children:"Absolem"})]})]})},Ln=F.a.div(D||(D=Object(C.a)(["\n  display: flex;\n  flex-direction: column;\n  color: #FFFFFF;\n  height: 100%;\n  width: 100%;\n"]))),Kn=document.getElementById("root");Object(I.createRoot)(Kn).render(Object(Y.jsx)(G.a.StrictMode,{children:Object(Y.jsx)(Y.Fragment,{children:Object(Y.jsxs)(Ln,{children:[Object(Y.jsx)(Tn,{}),Object(Y.jsx)(Q,{initialInput:Pn.value,children:Object(Y.jsx)(Mn,{})}),Object(Y.jsx)(Jn,{})]})})}))}},[[268,1,2]]]);
//# sourceMappingURL=main.5ac1b25f.chunk.js.map