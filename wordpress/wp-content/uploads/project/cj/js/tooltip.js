/* 2008-01-31 UI.js */
var UI={};
Object.extend=function(a, b){
  for (var property in b) a[property] = b[property];
  return a;
 };
UI.$=function(s) { return document.getElementById(s) };
UI.trim=function(s) {return s.replace(/(^\s*)|(\s*$)/g, "") };
UI.toogle=function(id) { UI.$(id).style.display=(UI.getStyle(UI.$(id),'display')=='none') ? 'block':'none' };
UI.getEl=function(e){var E=UI.getE(e);return E.target || E.srcElement}
UI.getE=function(e){return e || window.event}
UI.random=function(min, max){ return Math.floor(Math.random() * (max - min + 1) + min) };
UI.addEvent=function(object, type, listener) {	
	if(object.addEventListener) {if(type=='mousewheel')type='DOMMouseScroll'; object.addEventListener(type, listener, false)}
	else { object.attachEvent("on"+type, listener); }
};
UI.delEvent=function(object, type, listener){
	if (object.removeEventListener) {if(type=='mousewheel')type='DOMMouseScroll'; object.removeEventListener(type, listener, false)}
	else object.detachEvent('on'+type, listener);
};
UI.stopEvent=function(event) {
	var e=event || window.event;
	if(e.preventDefault) {e.preventDefault(); e.stopPropagation(); }
	else {e.returnValue = false; e.cancelBubble = true;}
};
UI.getEventWheel=function(e){
	var delta=0;
	if(e.wheelDelta) delta=e.wheelDelta/120;
	else if(e.detail) delta=-e.detail/3;
	return delta;
};
UI.getBrowser=function(){
	var ua=navigator.userAgent.toLowerCase();
	var opera=/opera/.test(ua)
	UI._browser={
		ie:!opera && /msie/.test(ua),
		ie_ver: parseFloat(((ua.split('; '))[1].split(' '))[1]),
		opera:opera,
		ff:/firefox/.test(ua),
		gecko:/gecko/.test(ua)		
	};
	return UI._browser;
};
UI.resizeIframe=function(iframe_id) {
	var h = (self.innerHeight) ? document.documentElement.offsetHeight : document.body.scrollHeight;
	try{parent.UI.$(iframe_id).style.height = h+"px";}catch(e){}
};
UI.rollOver=function(s) {
	var img=(typeof(s)=="string") ? img=UI.$(s):s;
	img.onmouseover=function() { UI.rollOver.over(img) }
	img.onmouseout=function() { UI.rollOver.out(img) }
}
UI.rollOver.over=function(img){ var src=img.src; img.src=src.replace("_off.","_on."); }
UI.rollOver.out=function(img){ var src=img.src; img.src=src.replace("_on.","_off."); };
UI.popUp=function(url,name,w,h,scroll,resize,status,center){
	if(!scroll) scroll=0;
	if(!resize) resize=0;
	if(!status) status=1;
	if(center){
		var x = (screen.width - w) / 2;
		var y = (screen.height - h) / 2;
		center = ",top="+y+",left="+x;
	}
	return window.open(url,name,"width="+w+",height="+h+",status="+status+",resizable="+resize+",scrollbars="+scroll+center);
};
UI.setCookie=function(name, value, expires, path, domain, secure){
	if(expires){
		var d=new Date(); d.setDate(d.getDate()+expires);
		expires = d.toGMTString();
	}
	document.cookie = name + "=" + escape(value) +
	  ((expires) ? "; expires=" + expires : "") +
	  ((path) ? "; path=" + path : "") +
	  ((domain) ? "; domain=" + domain : "") +
	  ((secure) ? "; secure" : "");
};
 
UI.getPosition=function(el)
{
	var left=0,top=0;
	while(el){
		left+=el.offsetLeft || 0;
		top+=el.offsetTop || 0;
		el=el.offsetParent;
	}
	return {'x': left, 'y': top}
};
UI.getScroll=function () {
	if(document.all && typeof document.body.scrollTop != "undefined"){
		var cont=document.compatMode!="CSS1Compat"?document.body:document.documentElement;
		return {left:cont.scrollLeft, top:cont.scrollTop, width:cont.clientWidth, height:cont.clientHeight}
	}else 
		return {left:window.pageXOffset, top:window.pageYOffset, width:window.innerWidth, height:window.innerHeight}
};
 
UI.length=function(str,len,tail){
	if(!tail) tail="";
	var l=0, c=0, l2=0, u="", s="";
	if(len>0) l2=len;	
	for(var i=0;u=str.charCodeAt(i);i++){
		if (u>127) l+=2;
		else l++;
		if(l2) {
			s+=str.charAt(i); 
			if(l>=l2){
				if(l>l2) s=s.slice(0,-1);
				return s+tail;
			}
		}		
	}
	return l2 ? s:l;
};
UI.html2str=function(s,m){
	var s1=["&amp;","&#39;","&quot;","&lt;","&gt;"];
	var s2=["&","'","\"","<",">"];
	var s3=[];
	if(m) {s3=s1;s1=s2;s2=s3;}
	for(var i in s1) s=s.replace(new RegExp(s1[i],"g"), s2[i]);
	return s;
};
UI.setOpacity=function(el,value){
	el.style.filter="alpha(opacity="+value+")";
	el.style.opacity=(value/100);
	el.style.MozOpacity=(value/100);
	el.style.KhtmlOpacity=(value/100);
};
UI.indexOf=function(arr,s){
	for(var i=0;i<arr.length; i++) if(arr[i]==s) return i;
	return -1;
};
UI.resizeImage=function(img,w,h){
	var t = new Image();
	t.src=img.src;	
	if(t.width==0 || t.height==0) return;
	if(t.width>w || t.height >h){
		img.width=w;img.height=h;
		if((t.width/w) > (t.height/h) )	img.height=Math.round(t.height * (w / t.width));
		else img.width = Math.round(t.width *  (h / t.height));
	}else{
		img.width=t.width;
		img.height=t.height;
	}
	if(img.width==0 || img.height==0) setTimeout(function(){UI.resizeImage(img,w,h)},500);
};
UI.StringBuffer=function(){this.buffer=new Array()}
UI.StringBuffer.prototype={append:function(s){this.buffer.push(s)},toString:function(){return this.buffer.join("")}};
UI.parseQuery=function(s){
	var str=s||location.search.substr(1);
	var r={},t=[];
	var a=str.split('&');
	for(var i=0;i<a.length;i++){t=a[i].split("=");r[t[0]] = t[1];}
	return r;
};

/* 2008-01-31 UI.Drag.js */
UI.Drag=function(drag, options){
	var el=UI.$(drag);
	el.options={
		handle:'',
		container:'',
		move_mode:'',	//1:horizontal 2,vertical
		limit_top:-1,
		limit_bottom:-1,
		limit_left:-1,
		limit_right:-1,
		onStart:null,
		onStop:null,
		onDrag:null
	}
	Object.extend(el, el.options);
	Object.extend(el, options);
	el.isdrag=true;
	el.width=0;el.height=0;
	el.area_width=0;el.area_height=0;
	UI.Drag.setXY(el);
	if(el.handle){
		el.handle=UI.$(el.handle);
		el.isdrag=false;
		el.handle.isdrag=true;
		el.handle.target=el;
	}
	if(el.container){
		UI.$(el.container).style.position="relative";
		el.width=parseInt(UI.getStyle(el,"width")) || el.offsetWidth;
		el.height=parseInt(UI.getStyle(el,"height")) || el.offsetHeight;
		el.area_width=parseInt(UI.getStyle(UI.$(el.container),"width")) || UI.$(el.container).offsetWidth;
		el.area_height=parseInt(UI.getStyle(UI.$(el.container),"height")) || UI.$(el.container).offsetHeight;	
	}
	this.obj=el;
};
UI.Drag.setXY=function(el){
	var pos=UI.getPosition(el);
	el.x=parseInt(UI.getStyle(el,"left"));
	el.y=parseInt(UI.getStyle(el,"top"));
	if(isNaN(el.x)) el.x=pos.x;
	if(isNaN(el.y)) el.y=pos.y;
};
UI.Drag.start=function(event){
	var e=event || window.event; var el=e.target || e.srcElement;	
	if(el.sliderKnob) el=UI.$(el.sliderKnob);//UI.Slider
	if(!el.isdrag) return;
	if(el.target) el=el.target;
	_uiDrag.obj=el;
	UI.Drag.setXY(el);
	_uiDrag.gx = e.clientX;
	_uiDrag.gy = e.clientY;
	if(el.onStart) el.onStart.call(el);
	if(el.onStop) _uiDrag.onStop=el.onStop;
	if(el.onDrag) _uiDrag.onDrag=el.onDrag;
};
UI.Drag.move=function(event){	
	var drag=_uiDrag.obj;
	if(!drag) return;
	var e=event || window.event; var el=e.target || e.srcElement;
	var top =drag.y + e.clientY - _uiDrag.gy;
	var left=drag.x + e.clientX - _uiDrag.gx;
	if(drag.area_width && drag.area_height){
		if(top<=0) top=0;
		else if(top >= drag.area_height-drag.height) top=drag.area_height-drag.height; 
		if(left<=0) left=0;
		else if(left >= drag.area_width-drag.width) left=drag.area_width-drag.width; 
	}
	if(drag.limit_top>-1 && top<drag.limit_top) top=drag.limit_top;
	if(drag.limit_bottom>-1 && top>drag.limit_bottom) top=drag.limit_bottom;
	if(drag.limit_left>-1 && left<drag.limit_left) left=drag.limit_left;
	if(drag.limit_right>-1 && left>drag.limit_right) left=drag.limit_right;	
	if(!drag.move_mode || drag.move_mode==2) drag.style.top = top+"px";
	if(!drag.move_mode || drag.move_mode==1) drag.style.left = left+"px";	
	if(_uiDrag.onDrag) _uiDrag.onDrag.call(drag);
};
UI.Drag.end=function(event){
	if(_uiDrag.onStop) _uiDrag.onStop.call(_uiDrag.obj);
	_uiDrag.obj=null;	
	_uiDrag.onStop=null;
	_uiDrag.onDrag=null;
};
 
 
/* 2008-01-31 UI.Move.js */
UI.Move=function(id) {
	this.id=id;
	this.div=UI.$(id);
	this.x= parseInt(UI.getStyle(this.div,'left'))||0;
	this.y= parseInt(UI.getStyle(this.div,'top'))||0;
};
UI.Move.prototype={
	slide : function(pos) {
		this.pos = pos;
		this.pos_n = 0;
		this.speed=0.3;
		this.inteval = 20;
		this.setPos();
		this.playing =true;
		var self=this;
		this.tid=setInterval(function(){self.play()}, this.inteval);
	},
	play : function() {
		this.x += (this.x2-this.x)*this.speed;		
		this.y += (this.y2-this.y)*this.speed;
		this.set(this.x,this.y);
		if(Math.round(this.x)==this.x2 && Math.round(this.y)==this.y2){
			this.x=Math.round(this.x);
			this.y=Math.round(this.y);
			this.set(this.x,this.y);
			if(this.pos_n>=this.pos.length)	{this.playing=false; clearInterval(this.tid)}
			else this.setPos();
		}
	},
	setPos:function(){
		var arr=this.pos[this.pos_n].split(",");
		this.x2 = arr[0];
		this.y2 = arr[1];
		this.pos_n++;
	},
	set:function(x,y){
		this.div.style.left = x+"px";
		this.div.style.top = y+"px";
	}
};

UI.DynamicScript=function(url,enc){
	this.url=url||'';
	this.enc=enc||'';
	this.head=document.getElementsByTagName("head").item(0);
	if(this.url) this.call(this.url);
};
UI.DynamicScript.prototype={
	noCacheParam:function(){
		var b=(this.url.indexOf('?')==-1) ? '?':'&';
		return b+'nOcAchE='+(new Date()).getTime();
	},
	call:function(url){
		try{this.head.removeChild(this.script)}catch(e){};
		this.url=url;
		this.script = document.createElement("script");
		this.script.setAttribute("type", "text/javascript");   
		this.script.setAttribute("src", this.url+this.noCacheParam());
		if(this.enc) this.script.setAttribute("charset", this.enc);
		this.head.appendChild(this.script);
	}
};

UI.toolTip=function(event, options) {
    var e=event || window.event;
    var el= e.target || e.srcElement;
    el.options={
        className:'UItoolTip',
        mousemove:UI.toolTip.mousemove
    };
    Object.extend(el.options, options);
    if(!el.UItoolTip) {
        el.stitle = el.alt || el.title || el.stitle;
        el.title = el.alt = "";
        if(!el.stitle) return;
        var d = document.createElement("DIV");		
        d.className = el.options.className;
        d.style.position="absolute";	
        UI.$('JESToolTip').appendChild(d);
        el.UItoolTip=d;
        el.UItoolTip.innerHTML=el.stitle;
    }
    var scroll = UI.getScroll();
    var x = (e.clientX+scroll.left+10) + "px";
    var y = (e.clientY+scroll.top+10) + "px";
    el.UItoolTip.style.left = x;
    el.UItoolTip.style.top =  y;
    el.UItoolTip.style.visibility="visible";
    UI.addEvent(el,'mouseout',UI.toolTip.mouseout);
    if(el.options.mousemove) UI.addEvent(document, "mousemove", el.options.mousemove);
}
document.write('<div id="JESToolTip"></div>');
UI.toolTip.seq = 1;
UI.toolTip.mousemove=function(event){
    var e=event || window.event; var el= e.target || e.srcElement;
    var scroll = UI.getScroll();
    el.UItoolTip.style.left=(e.clientX+scroll.left)+"px";
    el.UItoolTip.style.top=(e.clientY+scroll.top+20)+"px";
};
UI.toolTip.mouseout=function(event){
    var e=event || window.event; var el= e.target || e.srcElement;
    if(!el.UItoolTip) return;
    el.UItoolTip.style.visibility="hidden";
    if(el.options.mousemove) UI.delEvent(document, "mousemove",  el.options.mousemove);	
};