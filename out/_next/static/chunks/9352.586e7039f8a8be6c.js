"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9352],{60391:(e,t,a)=>{a.d(t,{A:()=>v});var r=a(12115),i=a(43463),n=a(7123),o=a(79251),l=a(9561),s=a(72762),d=a(89142),c=a(12567),h=a(28005),p=a(48827),u=a(95155);let m=e=>{let{classes:t,inset:a,primary:r,secondary:i,dense:o}=e;return(0,n.A)({root:["root",a&&"inset",o&&"dense",r&&i&&"multiline"],primary:["primary"],secondary:["secondary"]},h.b,t)},y=(0,d.Ay)("div",{name:"MuiListItemText",slot:"Root",overridesResolver:(e,t)=>{let{ownerState:a}=e;return[{["& .".concat(h.A.primary)]:t.primary},{["& .".concat(h.A.secondary)]:t.secondary},t.root,a.inset&&t.inset,a.primary&&a.secondary&&t.multiline,a.dense&&t.dense]}})({flex:"1 1 auto",minWidth:0,marginTop:4,marginBottom:4,[".".concat(o.A.root,":where(& .").concat(h.A.primary,")")]:{display:"block"},[".".concat(o.A.root,":where(& .").concat(h.A.secondary,")")]:{display:"block"},variants:[{props:e=>{let{ownerState:t}=e;return t.primary&&t.secondary},style:{marginTop:6,marginBottom:6}},{props:e=>{let{ownerState:t}=e;return t.inset},style:{paddingLeft:56}}]}),v=r.forwardRef(function(e,t){let a=(0,c.b)({props:e,name:"MuiListItemText"}),{children:n,className:o,disableTypography:d=!1,inset:h=!1,primary:v,primaryTypographyProps:w,secondary:f,secondaryTypographyProps:x,slots:b={},slotProps:A={},...g}=a,{dense:j}=r.useContext(s.A),D=null!=v?v:n,k=f,C={...a,disableTypography:d,inset:h,primary:!!D,secondary:!!k,dense:j},T=m(C),P={slots:b,slotProps:{primary:w,secondary:x,...A}},[L,S]=(0,p.A)("primary",{className:T.primary,elementType:l.A,externalForwardedProps:P,ownerState:C}),[R,z]=(0,p.A)("secondary",{className:T.secondary,elementType:l.A,externalForwardedProps:P,ownerState:C});return null==D||D.type===l.A||d||(D=(0,u.jsx)(L,{variant:j?"body2":"body1",component:(null==S?void 0:S.variant)?void 0:"span",...S,children:D})),null==k||k.type===l.A||d||(k=(0,u.jsx)(R,{variant:"body2",color:"textSecondary",...z,children:k})),(0,u.jsxs)(y,{className:(0,i.A)(T.root,o),ownerState:C,ref:t,...g,children:[D,k]})})},18561:(e,t,a)=>{a.r(t),a.d(t,{default:()=>x});var r=a(95155),i=a(12115),n=a(68998),o=a(26603),l=a(33894),s=a(9561),d=a(80005),c=a(21735),h=a(22678),p=a(83774),u=a(91888),m=a(60391),y=a(45704),v=a(89262),w=a(70750),f=a(83391);let x=e=>{let{htmlContent:t,isIconButton:a,id:x,organization_id:b,subcategories:A}=e,[g,j]=(0,i.useState)(!1),[D,k]=(0,i.useState)(!1),C=(0,i.useRef)(null),[T,P]=(0,i.useState)(t),[L,S]=(0,i.useState)(""),[R,z]=(0,i.useState)("withoutData"),[E,M]=(0,i.useState)(!1),[N,_]=(0,i.useState)(""),[B,I]=(0,i.useState)(A||[]),[U,H]=(0,i.useState)([]),{token:F}=(0,f.d4)(e=>e.session),O=()=>{j(!1),setTimeout(()=>URL.revokeObjectURL(L),0),M(!1),z("withoutData"),_(""),k(!1),H([])},W=async()=>{if(x&&F){k(!0);try{let e=await (0,v.YC)(x,b,F,U);if(200==e.status){let{pdf:t}=e.data,a=await V(t);a&&(S(a),g||j(!0))}k(!1)}catch(e){console.log(e),_("PDF generation failed. Please try again later."),k(!1)}}},V=e=>{try{let t=atob(e),a=t.length,r=new Uint8Array(a);for(let e=0;e<a;e++)r[e]=t.charCodeAt(e);let i=new Blob([r],{type:"application/pdf"});return URL.createObjectURL(i)}catch(e){return console.error("Error preparing PDF for preview:",e),null}};return(0,i.useEffect)(()=>{"withoutData"==R||E||(W(),M(!0))},[R,U]),(0,i.useEffect)(()=>{P(t)},[g]),(0,r.jsxs)(n.A,{children:[a?(0,r.jsx)(w.A,{onClick:()=>{x&&F&&(k(!0),(async()=>{try{let t=await (0,v.Vd)(x,F);if(200==t.status){var e;t=t.data,P('<div className="ck ck-editor__main">\n                                    <div class="ck ck-content">\n                                    <div>'.concat(t.data.headerContent,"</div>\n                                    ").concat(t.data.bodyContent,"\n                                    ").concat(t.data.sections?t.data.sections.map(e=>e.htmlContent):"","\n                                    <footer>").concat(t.data.footerContent,"</footer>\n                                    </div>\n                                    </div>\n                            ")),I((null===(e=t.data.subcategories)||void 0===e?void 0:e.map(e=>e.name))||[]),j(!0)}}catch(e){console.error("Error fetching data for edit mode:",e)}finally{k(!1)}})())},sx:{cursor:"pointer"}}):(0,r.jsx)(o.A,{variant:"outlined",color:"primary",onClick:()=>j(!0),disabled:!T,size:"small",children:"Preview HTML"}),(0,r.jsx)(l.A,{open:g,onClose:O,"aria-labelledby":"pdf-preview-title","aria-describedby":"pdf-preview-description",children:(0,r.jsxs)(n.A,{sx:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:"80%",height:"80%",bgcolor:"background.paper",p:4,pb:15,overflow:"hidden"},children:[(0,r.jsxs)(n.A,{sx:{display:"flex",mb:2},children:[(0,r.jsx)(s.A,{id:"pdf-preview-title",variant:"h5",component:"h2",gutterBottom:!0,children:"HTML Preview"}),x&&(0,r.jsxs)(d.A,{value:R,exclusive:!0,onChange:(e,a)=>{z(e=>a!==e?a:e),x||P(t)},"aria-label":"preview mode",sx:{ml:2,mt:.6,"& .MuiToggleButton-root":{width:125,height:25}},children:[(0,r.jsx)(c.A,{size:"small",id:"withoutData",value:"withoutData","aria-label":"Preview without Data",children:"Without Data"}),(0,r.jsx)(c.A,{size:"small",id:"withData",value:"withData","aria-label":"Preview with Data",children:"With Data"})]}),"withoutData"!=R&&(0,r.jsx)(h.A,{variant:"standard",sx:{ml:1,width:200},size:"small",children:(0,r.jsx)(p.A,{labelId:"demo-multiple-checkbox-label",id:"demo-multiple-checkbox",multiple:!0,value:U,onChange:e=>{let{target:{value:t}}=e;H(()=>"string"==typeof t?t.split(","):t),M(!1)},renderValue:e=>e.join(", "),size:"small",children:null==B?void 0:B.map(e=>(0,r.jsx)(u.A,{value:e,children:(0,r.jsx)(m.A,{primary:e})},e))})})]}),D&&(0,r.jsx)(n.A,{display:"flex",justifyContent:"center",alignItems:"center",height:"100%",top:0,left:0,width:"100%",zIndex:1,children:(0,r.jsx)(y.A,{variant:"rectangular",width:"90%",height:"90%"})}),"withoutData"!=R&&!D&&L&&(0,r.jsx)("iframe",{src:L,title:"PDF Preview",width:"100%",height:"100%",style:{border:"none"}}),"withoutData"!=R&&N&&!D&&(0,r.jsx)(s.A,{id:"pdf-preview-description",color:"error",align:"center",variant:"h6",children:N}),T?(0,r.jsx)(n.A,{sx:{opacity:"withoutData"==R?1:0,height:"100%",width:"100%",position:"withoutData"==R?"relative":"absolute",mt:"withoutData"==R?0:1500},children:(0,r.jsx)("iframe",{ref:C,width:"100%",height:"100%",title:"HTML Preview",style:{border:"none"},srcDoc:'\n                                    <!DOCTYPE html>\n                                    <html lang="en">\n                                    <head>\n                                    <link rel="stylesheet" href="https://cdn.ckeditor.com/ckeditor5/44.1.0/ckeditor5.css">\n                                        <style>\n                                            body {\n                                                margin: 0;\n                                                padding: 0;\n                                            },\n                                            .ck-content {\n                                                 margin: 0 auto;\n                                            }\n                                        </style>\n                                    </head>\n                                    <body>\n                                    '.concat(T,"\n                                    </body>\n                                    </html>\n                                ")})}):(0,r.jsx)(s.A,{id:"pdf-preview-description",color:"error",align:"center",variant:"h6",children:"withoutData"!=R||D?"":"No HTML content available."}),(0,r.jsx)(o.A,{variant:"outlined",color:"info",onClick:O,sx:{mt:2,float:"right"},size:"small",children:"Close"})]})})]})}}}]);
//# sourceMappingURL=9352.586e7039f8a8be6c.js.map