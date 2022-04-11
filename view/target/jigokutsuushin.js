"use strict";window.oncontextmenu=function(){return false;};window.onload=function(){htmlinit();main();};function main(){new append("head").tag("title","地獄通信").favicon("/assets/jigokutsuushin/icon.png");new modify(neko).setStyle("background","#050006");playopening();}
var timeout;function playopening(){let video=createOn(neko,"video","video");new modify(video).scale("480px","270px").setAttr("muted","").centralize();new append(video).tag("source",new Map([["src","/assets/jigokutsuushin/video.mp4"],["type","video/mp4"]]));let audio=createOn(neko,"audio","audio");new append(audio).tag("source",new Map([["src","/assets/jigokutsuushin/audio.mp3"],["type","audio/mpeg"]]));video.onloadeddata=()=>{audio.play();video.play();};video.onended=session1;timeout=window.setTimeout(session1,5000);audio.onended=()=>{remove(audio);};}
function session1(){window.clearTimeout(timeout);remove(getElement("video","video"));let formframe=createOn(neko,"formframe");new modify(formframe).setStyle("opacity","0").scale("720px","300px").centralize();let label=createOn(formframe,"label","p");new modify(label).scale("720px","50px").setContent("あなたの怨み、晴らします。").setStyles({textAlign:"center",fontSize:"210%",letterSpacing:"1rem",color:"#ffffff",}).anchor("top").position("50%","0").translate("4%","0").disablePointer();let input=createOn(formframe,"input","input");new modify(input).scale("400px","40px").setAttr("type","text").setStyles({fontSize:"140%",borderWidth:"3px",borderStyle:"groove",borderRadius:"4px",}).centralize().translate("0","-20%");let submmit=createOn(formframe,"submmit","button");new modify(submmit).scale("110px","45px").setContent("送信").setStyles({textAlign:"center",fontSize:"20",letterSpacing:"0.4rem",color:"#000000",borderRadius:"4px",}).anchor("top").position("50%","67%");let formopacity=0;let formfadein=window.setInterval(()=>{formopacity+=0.01;new modify(formframe).setStyle("opacity",`${formopacity}`);if(Number(formframe.style.opacity)>=1){window.clearInterval(formfadein);}},10);submmit.onclick=session2;}
function session2(){let formframe=getElement("formframe");let formopacity=1;let formfadeout=window.setInterval(()=>{formopacity-=0.01;new modify(formframe).setStyle("opacity",`${formopacity}`);if(Number(formframe.style.opacity)<=0){window.clearInterval(formfadeout);remove(formframe);session2_1();}},1);}
function session2_1(){window.setTimeout(()=>{popup();},2000);}
function popup(){let popupframe=createOn(neko,"popupframe");new modify(popupframe).scale("480px","180px").setStyles({background:"#d6d6d6",border:"groove 2px",borderRadius:"3px",}).centralize();let popupprop=createOn(popupframe,"popupprop","p");new modify(popupprop).scale("480px","45px").setContent("強い怨念が無ければ、受けいれない。").setStyles({color:"#000000",textAlign:"center",fontSize:"23",}).centralize().translate("0","-100%");let button=createOn(popupframe,"button","button");new modify(button).scale("50px","31px").setContent("確認").setStyles({fontSize:"15",borderRadius:"2px",}).anchor("top").position("50%","67%").setStyle("color","#000000");button.onclick=session3;timeout=window.setTimeout(session3,8000);}
function session3(){window.clearTimeout(timeout);window.location.pathname+="/404";}
var neko;function htmlinit(){function getOrCreate(tagName){let node;let node_=document.getElementsByTagName(tagName)[0];if(!node_){node=document.createElement(tagName);}
else{node=node_;}
return node;}
let html=getOrCreate("html");new modify(html).setAttr("lang","en");let head=getOrCreate("head");html.appendChild(head);new append(head).tag("meta",new Map([["charset","utf-8"]]));let body=getOrCreate("body");html.append(body);new modify(body).setStyle("height","100vh").setStyle("margin","0").setStyle("overflow","hidden");neko=createOn(body,"neko");new modify(neko).setStyle("height","100%");}
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
class modify{constructor(node){if(node==="head"){this.node=document.getElementsByTagName("head")[0];}
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