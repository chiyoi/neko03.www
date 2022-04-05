"use strict";window.oncontextmenu=function(){return false;};window.onload=function(){_init();_start();};var neko;function _start(){let icon_frame=getOrCreate("div","icon_frame");new modify(icon_frame).setScale("150px","200px").centralize();new append(neko).child(icon_frame);let icon=getOrCreate("img","icon");new modify(icon).setScale("150px","150px").setAttr("src","/assets/icon.png").setStyle("clipPath","circle(50%)").disablePointer();let disp=getOrCreate("div","disp");new modify(disp).setScale("150px","50px").setContent("CHIYOI").setStyle("textAlign","center").setStyle("fontWeight","400").setStyle("fontSize","200%").setStyle("fontFamily","Menlo").setStyle("letterSpacing","0.3rem").appendStyle("transform","translate(0,30%)").appendStyle("transform","translate(1.5%)").disablePointer();new append(icon_frame).child(icon).child(disp);}
function _init(){let html=getOrCreate("html");new modify(html).setAttr("lang","en");let head=getOrCreate("head");new append(head).tag("meta",new Map([["charset","utf-8"]])).tag("title",undefined,"chiyoi");let body=getOrCreate("body");new modify(body).setStyle("height","100vh").setStyle("margin","0");new append(html).child(head).child(body);neko=getOrCreate("div","neko");new modify(neko).setStyle("height","100%");new append(body).child(neko);}
function getOrCreate(tagName,id){let node;if(id){let node_=document.getElementById(id);if(!node_){node=document.createElement(tagName);node.id=id;}
else{if(node_.tagName.toLowerCase()!==tagName.toLowerCase()){throw new Error("error tag name");}
node=node_;}}
else{let node_=document.getElementsByTagName(tagName)[0];if(!node_){node=document.createElement(tagName);}
else{node=node_;}}
return node;}
class modify{constructor(node){this.node=node;}
setAttr(attribute,value){this.node.setAttribute(attribute,value);return this;}
setStyle(style,value){if(typeof style==="string"){this.node.style.setProperty(style.replace(/(?=[A-Z])/,"-").toLowerCase(),value);}
else{throw new Error("wrong style name error");}
return this;}
appendStyle(style,value){if(typeof style==="string"){let current=this.node.style.getPropertyValue(style);this.setStyle(style,current+value);}
else{throw new Error("wrong style name error");}
return this;}
setScale(width,height){this.setStyle("width",width).setStyle("height",height);return this;}
setContent(content){this.node.textContent=content;return this;}
centralize(){this.setStyle("position","relative").setStyle("top","50%").setStyle("left","50%").appendStyle("transform","translate(-50%,-50%)");return this;}
disablePointer(){this.setStyle("pointerEvents","node").setStyle("webkitUserSelect","none");return this;}}
class append{constructor(node){this.node=node;}
tag(tagName,attribute,content){let child=document.createElement(tagName);attribute&&attribute.forEach((value,key)=>child.setAttribute(key,value));content&&(child.textContent=content);this.node.appendChild(child);return this;}
child(child){this.node.appendChild(child);return this;}}