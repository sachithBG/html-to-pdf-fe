"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6971],{45704:(t,e,n)=>{n.d(e,{A:()=>D});var a=n(20698),i=n(12115),r=n(43463),o=n(7123),l=n(17280),s=n(71987),d=n(89142),c=n(98330),h=n(12567),u=n(81045),p=n(37157);function f(t){return(0,p.Ay)("MuiSkeleton",t)}(0,u.A)("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);var m=n(95155);function v(){let t=(0,a._)(["\n  0% {\n    opacity: 1;\n  }\n\n  50% {\n    opacity: 0.4;\n  }\n\n  100% {\n    opacity: 1;\n  }\n"]);return v=function(){return t},t}function w(){let t=(0,a._)(["\n  0% {\n    transform: translateX(-100%);\n  }\n\n  50% {\n    /* +0.5s of delay between each loop */\n    transform: translateX(100%);\n  }\n\n  100% {\n    transform: translateX(100%);\n  }\n"]);return w=function(){return t},t}function g(){let t=(0,a._)(["\n        animation: "," 2s ease-in-out 0.5s infinite;\n      "]);return g=function(){return t},t}function b(){let t=(0,a._)(["\n        &::after {\n          animation: "," 2s linear 0.5s infinite;\n        }\n      "]);return b=function(){return t},t}let y=t=>{let{classes:e,variant:n,animation:a,hasChildren:i,width:r,height:l}=t;return(0,o.A)({root:["root",n,a,i&&"withChildren",i&&!r&&"fitContent",i&&!l&&"heightAuto"]},f,e)},x=(0,s.i7)(v()),A=(0,s.i7)(w()),k="string"!=typeof x?(0,s.AH)(g(),x):null,C="string"!=typeof A?(0,s.AH)(b(),A):null,j=(0,d.Ay)("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(t,e)=>{let{ownerState:n}=t;return[e.root,e[n.variant],!1!==n.animation&&e[n.animation],n.hasChildren&&e.withChildren,n.hasChildren&&!n.width&&e.fitContent,n.hasChildren&&!n.height&&e.heightAuto]}})((0,c.A)(t=>{let{theme:e}=t,n=String(e.shape.borderRadius).match(/[\d.\-+]*\s*(.*)/)[1]||"px",a=parseFloat(e.shape.borderRadius);return{display:"block",backgroundColor:e.vars?e.vars.palette.Skeleton.bg:(0,l.X4)(e.palette.text.primary,"light"===e.palette.mode?.11:.13),height:"1.2em",variants:[{props:{variant:"text"},style:{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:"".concat(a).concat(n,"/").concat(Math.round(a/.6*10)/10).concat(n),"&:empty:before":{content:'"\\00a0"'}}},{props:{variant:"circular"},style:{borderRadius:"50%"}},{props:{variant:"rounded"},style:{borderRadius:(e.vars||e).shape.borderRadius}},{props:t=>{let{ownerState:e}=t;return e.hasChildren},style:{"& > *":{visibility:"hidden"}}},{props:t=>{let{ownerState:e}=t;return e.hasChildren&&!e.width},style:{maxWidth:"fit-content"}},{props:t=>{let{ownerState:e}=t;return e.hasChildren&&!e.height},style:{height:"auto"}},{props:{animation:"pulse"},style:k||{animation:"".concat(x," 2s ease-in-out 0.5s infinite")}},{props:{animation:"wave"},style:{position:"relative",overflow:"hidden",WebkitMaskImage:"-webkit-radial-gradient(white, black)","&::after":{background:"linear-gradient(\n                90deg,\n                transparent,\n                ".concat((e.vars||e).palette.action.hover,",\n                transparent\n              )"),content:'""',position:"absolute",transform:"translateX(-100%)",bottom:0,left:0,right:0,top:0}}},{props:{animation:"wave"},style:C||{"&::after":{animation:"".concat(A," 2s linear 0.5s infinite")}}}]}})),D=i.forwardRef(function(t,e){let n=(0,h.b)({props:t,name:"MuiSkeleton"}),{animation:a="pulse",className:i,component:o="span",height:l,style:s,variant:d="text",width:c,...u}=n,p={...n,animation:a,component:o,variant:d,hasChildren:!!u.children},f=y(p);return(0,m.jsx)(j,{as:o,ref:e,className:(0,r.A)(f.root,i),ownerState:p,...u,style:{width:c,height:l,...s}})})},18561:(t,e,n)=>{n.r(e),n.d(e,{default:()=>b});var a=n(95155),i=n(12115),r=n(68998),o=n(26603),l=n(33894),s=n(9561),d=n(80005),c=n(21735),h=n(22678),u=n(83774),p=n(91888),f=n(60391),m=n(45704),v=n(89262),w=n(70750),g=n(83391);let b=t=>{let{htmlContent:e,isIconButton:n,id:b,organization_id:y,subcategories:x}=t,[A,k]=(0,i.useState)(!1),[C,j]=(0,i.useState)(!1),D=(0,i.useRef)(null),[S,R]=(0,i.useState)(e),[M,P]=(0,i.useState)(""),[_,L]=(0,i.useState)("withoutData"),[T,z]=(0,i.useState)(!1),[E,H]=(0,i.useState)(""),[N,U]=(0,i.useState)(x||[]),[X,B]=(0,i.useState)([]),{token:F}=(0,g.d4)(t=>t.session),I=()=>{k(!1),setTimeout(()=>URL.revokeObjectURL(M),0),z(!1),L("withoutData"),H(""),j(!1),B([])},O=async()=>{if(b&&F){j(!0);try{let t=await (0,v.YC)(b,y,F,X);if(200==t.status){let{pdf:e}=t.data,n=await W(e);n&&(P(n),A||k(!0))}j(!1)}catch(t){console.log(t),H("PDF generation failed. Please try again later."),j(!1)}}},W=t=>{try{let e=atob(t),n=e.length,a=new Uint8Array(n);for(let t=0;t<n;t++)a[t]=e.charCodeAt(t);let i=new Blob([a],{type:"application/pdf"});return URL.createObjectURL(i)}catch(t){return console.error("Error preparing PDF for preview:",t),null}};return(0,i.useEffect)(()=>{"withoutData"==_||T||(O(),z(!0))},[_,X]),(0,i.useEffect)(()=>{R(e)},[A]),(0,a.jsxs)(r.A,{children:[n?(0,a.jsx)(w.A,{onClick:()=>{b&&F&&(j(!0),(async()=>{try{let e=await (0,v.Vd)(b,F);if(200==e.status){var t;e=e.data,R('<div className="ck ck-editor__main">\n                                    <div class="ck ck-content">\n                                    <div>'.concat(e.data.headerContent,"</div>\n                                    ").concat(e.data.bodyContent,"\n                                    ").concat(e.data.sections?e.data.sections.map(t=>t.htmlContent):"","\n                                    <footer>").concat(e.data.footerContent,"</footer>\n                                    </div>\n                                    </div>\n                            ")),U((null===(t=e.data.subcategories)||void 0===t?void 0:t.map(t=>t.name))||[]),k(!0)}}catch(t){console.error("Error fetching data for edit mode:",t)}finally{j(!1)}})())},sx:{cursor:"pointer"}}):(0,a.jsx)(o.A,{variant:"outlined",color:"primary",onClick:()=>k(!0),disabled:!S,size:"small",children:"Preview HTML"}),(0,a.jsx)(l.A,{open:A,onClose:I,"aria-labelledby":"pdf-preview-title","aria-describedby":"pdf-preview-description",children:(0,a.jsxs)(r.A,{sx:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:"80%",height:"80%",bgcolor:"background.paper",p:4,pb:15,overflow:"hidden"},children:[(0,a.jsxs)(r.A,{sx:{display:"flex",mb:2},children:[(0,a.jsx)(s.A,{id:"pdf-preview-title",variant:"h5",component:"h2",gutterBottom:!0,children:"HTML Preview"}),b&&(0,a.jsxs)(d.A,{value:_,exclusive:!0,onChange:(t,n)=>{L(t=>n!==t?n:t),b||R(e)},"aria-label":"preview mode",sx:{ml:2,mt:.6,"& .MuiToggleButton-root":{width:125,height:25}},children:[(0,a.jsx)(c.A,{size:"small",id:"withoutData",value:"withoutData","aria-label":"Preview without Data",children:"Without Data"}),(0,a.jsx)(c.A,{size:"small",id:"withData",value:"withData","aria-label":"Preview with Data",children:"With Data"})]}),"withoutData"!=_&&(0,a.jsx)(h.A,{variant:"standard",sx:{ml:1,width:200},size:"small",children:(0,a.jsx)(u.A,{labelId:"demo-multiple-checkbox-label",id:"demo-multiple-checkbox",multiple:!0,value:X,onChange:t=>{let{target:{value:e}}=t;B(()=>"string"==typeof e?e.split(","):e),z(!1)},renderValue:t=>t.join(", "),size:"small",children:null==N?void 0:N.map(t=>(0,a.jsx)(p.A,{value:t,children:(0,a.jsx)(f.A,{primary:t})},t))})})]}),C&&(0,a.jsx)(r.A,{display:"flex",justifyContent:"center",alignItems:"center",height:"100%",top:0,left:0,width:"100%",zIndex:1,children:(0,a.jsx)(m.A,{variant:"rectangular",width:"90%",height:"90%"})}),"withoutData"!=_&&!C&&M&&(0,a.jsx)("iframe",{src:M,title:"PDF Preview",width:"100%",height:"100%",style:{border:"none"}}),"withoutData"!=_&&E&&!C&&(0,a.jsx)(s.A,{id:"pdf-preview-description",color:"error",align:"center",variant:"h6",children:E}),S?(0,a.jsx)(r.A,{sx:{opacity:"withoutData"==_?1:0,height:"100%",width:"100%",position:"withoutData"==_?"relative":"absolute",mt:"withoutData"==_?0:1500},children:(0,a.jsx)("iframe",{ref:D,width:"100%",height:"100%",title:"HTML Preview",style:{border:"none"},srcDoc:'\n                                    <!DOCTYPE html>\n                                    <html lang="en">\n                                    <head>\n                                    <link rel="stylesheet" href="https://cdn.ckeditor.com/ckeditor5/44.1.0/ckeditor5.css">\n                                        <style>\n                                            body {\n                                                margin: 0;\n                                                padding: 0;\n                                            },\n                                            .ck-content {\n                                                 margin: 0 auto;\n                                            }\n                                        </style>\n                                    </head>\n                                    <body>\n                                    '.concat(S,"\n                                    </body>\n                                    </html>\n                                ")})}):(0,a.jsx)(s.A,{id:"pdf-preview-description",color:"error",align:"center",variant:"h6",children:"withoutData"!=_||C?"":"No HTML content available."}),(0,a.jsx)(o.A,{variant:"outlined",color:"info",onClick:I,sx:{mt:2,float:"right"},size:"small",children:"Close"})]})})]})}}}]);
//# sourceMappingURL=6971.9e8c93fef5db8426.js.map