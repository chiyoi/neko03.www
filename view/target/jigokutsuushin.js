"use strict";window.oncontextmenu=function(){return false;};window.onload=function(){htmlinit();main();};function main(){let head=getOrCreate("head");new append(head).tag("title",new Map(),"地獄通信").favicon("/assets/jigokutsuushin/icon.png");let body=getOrCreate("body");new modify(body).setStyle("background","#050006");playopening();}
var timeout;function playopening(){let video=getOrCreate("video","video");new modify(video).setScale("480px","270px").setAttr("muted","").centralize();new append(video).tag("source",new Map([["src","/assets/jigokutsuushin/video.mp4"],["type","video/mp4"]]));let audio=getOrCreate("audio","audio");new append(audio).tag("source",new Map([["src","/assets/jigokutsuushin/audio.wav"],["type","audio/wav"]]));new append(neko).child(video).child(audio);audio.onload=()=>{audio.play();window.setTimeout(()=>{video.play();},500);};video.onended=session1;timeout=window.setTimeout(session1,5000);audio.onended=()=>{remove(audio);};}
function session1(){window.clearTimeout(timeout);let videoframe=getMust("video");remove(videoframe);let formframe=getOrCreate("div","formframe");let formopacity=0;new modify(formframe).setStyle("opacity","0");new append(neko).child(formframe);new modify(formframe).setScale("720px","300px").centralize();let label=getOrCreate("p","label");new modify(label).setScale("720px","50px").setContent("あなたの怨み、晴らします。").setStyle("textAlign","center").setStyle("fontSize","210%").setStyle("letterSpacing","1rem").setStyle("color","#ffffff").setStyle("position","absolute").setStyle("top","0").setStyle("left","50%").transform("translate(-50%, 0)").transform("translate(4%, 0)").disablePointer();let input=getOrCreate("input","input");new modify(input).setScale("400px","40px").setAttr("type","text").setStyle("fontSize","140%").setStyle("border","3px groove").setStyle("borderRadius","4px").centralize().transform("translate(0, -20%)");let submmit=getOrCreate("button","submmit");new modify(submmit).setScale("110px","45px").setStyle("borderRadius","4px").setStyle("textAlign","center").setStyle("position","absolute").setStyle("bottom","0").setStyle("left","50%").transform("translate(-50%, -100%)");let submmitText=getOrCreate("p","submmitText");new modify(submmitText).setContent("送信").setStyle("textAlign","center").setStyle("fontSize","170%").setStyle("letterSpacing","0.4rem").setStyle("color","#000000").centralize().transform("translate(5%, -85%)");new append(submmit).child(submmitText);new append(formframe).child(label).child(input).child(submmit);let formfadein=window.setInterval(()=>{formopacity+=0.01;new modify(formframe).setStyle("opacity",`${formopacity}`);if(Number(formframe.style.opacity)>=1){window.clearInterval(formfadein);}},10);}
var neko;function htmlinit(){let html=getOrCreate("html");new modify(html).setAttr("lang","en");let head=getOrCreate("head");new append(head).tag("meta",new Map([["charset","utf-8"]]));let body=getOrCreate("body");new modify(body).setStyle("height","100vh").setStyle("margin","0");new append(html).child(head).child(body);neko=getOrCreate("div","neko");new modify(neko).setStyle("height","100%");new append(body).child(neko);}
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
setScale(width,height){this.setStyle("width",width).setStyle("height",height);return this;}
setContent(content){this.node.textContent=content;return this;}
transform(value){this.appendStyle("transform",value);return this;}
centralize(){this.setStyle("position","absolute").setStyle("top","50%").setStyle("left","50%").transform("translate(-50%, -50%)");return this;}
disablePointer(){this.setStyle("pointerEvents","none").setStyle("webkitUserSelect","none");return this;}}
class append{constructor(node){this.node=node;}
tag(tagName,attribute,content){let child=document.createElement(tagName);attribute&&attribute.forEach((value,key)=>child.setAttribute(key,value));content&&(child.textContent=content);this.child(child);return this;}
child(child){this.node.appendChild(child);return this;}
favicon(path){let favicon=document.createElement("link");new modify(favicon).setAttr("rel","icon").setAttr("type","image/png").setAttr("href",path);this.child(favicon);return this;}}