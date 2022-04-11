"use strict";window.oncontextmenu=function(){return false;};window.onload=function(){htmlinit();main();};function main(){let head=getOrCreate("head");new append(head).tag("title","地獄通信").favicon("/assets/jigokutsuushin/icon.png");let body=getOrCreate("body");new modify(body).setStyle("background","#050006");playopening();}
var timeout;function playopening(){let video=getOrCreate("video","video");new modify(video).scale("480px","270px").setAttr("muted","").centralize();new append(video).tag("source",new Map([["src","/assets/jigokutsuushin/video.mp4"],["type","video/mp4"]]));let audio=getOrCreate("audio","audio");new append(audio).tag("source",new Map([["src","/assets/jigokutsuushin/audio.mp3"],["type","audio/mpeg"]]));new append(neko).child(video).child(audio);video.onloadeddata=()=>{audio.play();video.play();};video.onended=session1;timeout=window.setTimeout(session1,5000);audio.onended=()=>{remove(audio);};}
function session1(){window.clearTimeout(timeout);let video=getMust("video");remove(video);let formframe=getOrCreate("div","formframe");new append(neko).child(formframe);new modify(formframe).setStyle("opacity","0");new modify(formframe).scale("720px","300px").centralize();let label=getOrCreate("p","label");let input=getOrCreate("input","input");let submmit=getOrCreate("button","submmit");new append(formframe).child(label).child(input).child(submmit);new modify(label).scale("720px","50px").setContent("あなたの怨み、晴らします。").setStyle("textAlign","center").setStyle("fontSize","210%").setStyle("letterSpacing","1rem").setStyle("color","#ffffff").setStyle("position","absolute").setStyle("top","0").setStyle("left","50%").transform("translate(-50%, 0)").transform("translate(4%, 0)").disablePointer();new modify(input).scale("400px","40px").setAttr("type","text").setStyle("fontSize","140%").setStyle("border","3px groove").setStyle("borderRadius","4px").centralize().transform("translate(0, -20%)");new modify(submmit).scale("110px","45px").setContent("送信").setStyle("textAlign","center").setStyle("fontSize","20").setStyle("letterSpacing","0.4rem").setStyle("color","#000000").setStyle("borderRadius","4px").setStyle("textAlign","center").setStyle("position","absolute").setStyle("bottom","0").setStyle("left","50%").transform("translate(-50%, -100%)");let formopacity=0;let formfadein=window.setInterval(()=>{formopacity+=0.01;new modify(formframe).setStyle("opacity",`${formopacity}`);if(Number(formframe.style.opacity)>=1){window.clearInterval(formfadein);}},10);submmit.onclick=session2;}
function session2(){let formframe=getOrCreate("div","formframe");let formopacity=1;let formfadeout=window.setInterval(()=>{formopacity-=0.01;new modify(formframe).setStyle("opacity",`${formopacity}`);if(Number(formframe.style.opacity)<=0){window.clearInterval(formfadeout);remove(formframe);session2_1();}},1);}
function session2_1(){window.setTimeout(()=>{popup();},2000);}
function popup(){let popupframe=getOrCreate("div","popupframe");new append(neko).child(popupframe);new modify(popupframe).scale("480px","180px").setStyle("background","#d6d6d6").setStyle("border","groove 2px").setStyle("borderRadius","3px").centralize();let popupprop=getOrCreate("p","popupprop");let button=getOrCreate("button","button");new append(popupframe).child(popupprop).child(button);new modify(popupprop).scale("480px","45px").setContent("強い怨念が無ければ、受けいれない。").setStyle("color","#000000").setStyle("textAlign","center").setStyle("fontSize","23").centralize().transform("translate(0, -100%)");new modify(button).scale("50px","31px").setContent("確認").setStyle("fontSize","15").setStyle("borderRadius","2px").setStyle("position","absolute").setStyle("color","#000000").setStyle("bottom","0%").setStyle("left","50%").transform("translate(-50%, 0)").transform("translate(0, -80%)");button.onclick=session3;timeout=window.setTimeout(session3,8000);}
function session3(){window.clearTimeout(timeout);window.location.pathname+="/404";}
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