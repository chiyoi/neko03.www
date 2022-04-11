"use strict";window.oncontextmenu=function(){return false;};window.onload=function(){htmlinit();main();};function main(){let head=getOrCreate("head");new append(head).tag("title","chiyoi").favicon("/assets/index/icon.png");let icon_frame=getOrCreate("div","icon_frame");new modify(icon_frame).scale("150px","200px").centralize().appendStyle("transform","translate(0, -30%)");new append(neko).child(icon_frame);let icon=getOrCreate("img","icon");new modify(icon).scale("150px","150px").setAttr("src","/assets/index/icon.png").setStyle("clipPath","circle(50%)").disablePointer();let disp=getOrCreate("div","disp");new modify(disp).scale("150px","50px").setContent("CHIYOI").setStyle("textAlign","center").setStyle("fontWeight","400").setStyle("fontSize","200%").setStyle("fontFamily","Menlo").setStyle("letterSpacing","0.3rem").appendStyle("transform","translate(0,30%)").appendStyle("transform","translate(1.5%)").disablePointer();new append(icon_frame).child(icon).child(disp);}
var neko;function htmlinit(){let html=getOrCreate("html");new modify(html).setAttr("lang","en");let head=getOrCreate("head");new append(head).tag("meta",new Map([["charset","utf-8"]]));let body=getOrCreate("body");new modify(body).setStyle("height","100vh").setStyle("margin","0").setStyle("overflow","hidden");new append(html).child(head).child(body);neko=getOrCreate("div","neko");new modify(neko).setStyle("height","100%");new append(body).child(neko);}
function getOrCreate(tagName,id){let node;if(id){let node_=document.getElementById(id);if(!node_){node=document.createElement(tagName);node.id=id;}
else{if(node_.tagName.toLowerCase()!==tagName.toLowerCase()){console.log(node_.tagName,tagName);throw new Error("error tag name");}
node=node_;}}
else{let node_=document.getElementsByTagName(tagName)[0];if(!node_){node=document.createElement(tagName);}
else{node=node_;}}
return node;}
function getMust(id){let node;let node_=document.getElementById(id);if(!node_){throw new Error("attempt to get element not exist.");}
else{node=node_;}
return node;}
function remove(element){if(element.parentNode){element.parentNode.removeChild(element);return true;}
else{return false;}}
class modify{constructor(node){this.node=node;}
setAttr(attribute,value){this.node.setAttribute(attribute,value);return this;}
setStyle(style,value){if(typeof style==="string"){let converted=style.replace(/(?=[A-Z])/g,"-").toLowerCase();if(converted.startsWith("webkit")){converted=`-${converted}`;}
this.node.style.setProperty(converted,value);}
else{throw new Error("wrong style name error");}
return this;}
appendStyle(style,value){if(typeof style==="string"){let current=this.node.style.getPropertyValue(style);this.setStyle(style,current+value);}
else{throw new Error("wrong style name error");}
return this;}
scale(width,height){this.setStyle("width",width).setStyle("height",height);return this;}
offset(x,y){this.setStyle("position","relative").setStyle("top",y).setStyle("left",x);return this;}
position(x,y){this.setStyle("position","absolute").setStyle("top",y).setStyle("left",x);return this;}
setContent(content){this.node.textContent=content;return this;}
transform(value){this.appendStyle("transform",value);return this;}
centralize(){let parentNode=this.node.parentNode;this.setStyle("position","absolute").setStyle("top",`${parentNode.clientHeight/2-this.node.clientHeight/2}`).setStyle("left",`${parentNode.clientWidth/2-this.node.clientWidth/2}`);return this;}
disablePointer(){this.setStyle("pointerEvents","none").setStyle("webkitUserSelect","none");return this;}}
class append{constructor(node){this.node=node;}
tag(tagName,attributeOrContent,content){let child=document.createElement(tagName);if(attributeOrContent){if(typeof attributeOrContent==="string"){child.textContent=attributeOrContent;}
else{attributeOrContent.forEach((value,key)=>child.setAttribute(key,value));content&&(child.textContent=content);}}
else{child.textContent=attributeOrContent;}
this.child(child);return this;}
child(child){this.node.appendChild(child);return this;}
favicon(path){let favicon=document.createElement("link");new modify(favicon).setAttr("rel","icon").setAttr("type","image/png").setAttr("href",path);this.child(favicon);return this;}}