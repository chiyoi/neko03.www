"use strict";window.oncontextmenu=function(){return false;};window.onload=function(){htmlinit();main();};function main(){new append("head").tag("title","chiyoi").favicon("/assets/index/icon.png");let icon_frame=createOn(neko,"icon_frame");new modify(icon_frame).scale("150px","200px").centralize().translate("0","-30%");let icon=createOn(icon_frame,"icon","img");new modify(icon).scale("150px","150px").setAttr("src","/assets/index/icon.png").setStyle("clipPath","circle(50%)").disablePointer();let disp=createOn(icon_frame,"disp");new modify(disp).scale("150px","50px").setContent("CHIYOI").setStyles({textAlign:"center",fontWeight:"400",fontSize:"200%",fontFamily:"Menlo",letterSpacing:"0.3rem",}).translate("1.5%","30%").disablePointer();}
var neko;function htmlinit(){function getOrCreate(tagName){let node;let node_=document.getElementsByTagName(tagName)[0];if(!node_){node=document.createElement(tagName);}
else{node=node_;}
return node;}
remove(getElement("noscript"));let html=getOrCreate("html");new modify(html).setAttr("lang","en");let head=getOrCreate("head");html.appendChild(head);new append(head).tag("meta",new Map([["charset","utf-8"]]));let body=getOrCreate("body");html.append(body);new modify(body).setStyle("height","100vh").setStyle("margin","0").setStyle("overflow","hidden");neko=createOn(body,"neko");new modify(neko).setStyle("height","100%");}
function createOn(parentNode,id,tagName){let node;if(tagName){node=document.createElement(tagName);node.id=id;}
else{node=document.createElement("div");node.id=id;}
parentNode.appendChild(node);return node;}
function getElement(id,tagName){let node;let node_=document.getElementById(id);let tagName_;if(tagName){tagName_=tagName;}
else{tagName_="div";}
if(node_&&node_.tagName.toLowerCase()===tagName_.toLowerCase()){node=node_;}
else{throw new Error(`element not exist:${tagName_}#${id}.`);}
return node;}
function remove(element){if(element.parentNode){element.parentNode.removeChild(element);}
else{throw new Error(`cannot remove ${element}`);}}
class modify{constructor(node){if(node==="body"){this.node=document.getElementsByTagName("body")[0];}
else{this.node=node;}}
setAttr(attribute,value){this.node.setAttribute(attribute,value);return this;}
setContent(content){this.node.textContent=content;return this;}
setStyle(style,value){this.node.style[style]=value;return this;}
setStyles(styles){let key;for(key in styles){this.node.style[key]=styles[key];}
return this;}
appendStyle(style,value){this.node.style[style]+=value;return this;}
scale(width,height){this.setStyle("width",width).setStyle("height",height);return this;}
anchor(pos){switch(pos){case"middle":this.translate("-50%","-50%");break;case"top":this.translate("-50%","0");break;case"left":this.translate("0","-50%");break;case"right":this.translate("0","-100%");break;case"bottom":this.translate("-100%","0");break;}
return this;}
offset(x,y){this.setStyle("position","relative").setStyle("top",y).setStyle("left",x);return this;}
position(x,y){this.setStyle("position","absolute").setStyle("top",y).setStyle("left",x);return this;}
translate(x,y){this.appendStyle("transform",`translate(${x},${y})`);return this;}
centralize(){this.anchor("middle").position("50%","50%");return this;}
disablePointer(){this.setStyle("pointerEvents","none").setStyle("webkitUserSelect","none");return this;}}
class append{constructor(node){if(node==="head"){this.node=document.getElementsByTagName("head")[0];}
else{this.node=node;}}
tag(tagName,attributeOrContent,content){let child=document.createElement(tagName);if(attributeOrContent){if(typeof attributeOrContent==="string"){child.textContent=attributeOrContent;}
else{attributeOrContent.forEach((value,key)=>child.setAttribute(key,value));content&&(child.textContent=content);}}
else{child.textContent=attributeOrContent;}
this.node.appendChild(child);return this;}
favicon(path){let favicon=document.createElement("link");new modify(favicon).setAttr("rel","icon").setAttr("type","image/png").setAttr("href",path);this.node.appendChild(favicon);return this;}}