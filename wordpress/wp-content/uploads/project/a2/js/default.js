// For Iframe Resizing
var iframeids=["comment","adkData","a2StoryBlog","winnerGall","comment_view_1","comment_view_2","comment_view_3","comment_view_4","comment_view_5","comment_modify_1","comment_modify_2","comment_modify_3","comment_modify_4","comment_modify_5"] // iframe 에 사용할 ID 를 지정 해 주세요

var iframehide="yes"

function resizeCaller() {
var dyniframe=new Array()
for (i=0; i<iframeids.length; i++){
if (document.getElementById)
resizeIframe(iframeids[i])
if ((document.all || document.getElementById) && iframehide=="no"){
var tempobj=document.all? document.all[iframeids[i]] : document.getElementById(iframeids[i])
tempobj.style.display="block"
}
}
}

function resizeIframe(frameid){
var currentfr=document.getElementById(frameid)
if (currentfr && !window.opera){
currentfr.style.display="block"
if (currentfr.contentDocument && currentfr.contentDocument.body.offsetHeight) //ns6 syntax
currentfr.height = currentfr.contentDocument.body.offsetHeight; 
else if (currentfr.Document && currentfr.Document.body.scrollHeight) //ie5+ syntax
currentfr.height = currentfr.Document.body.scrollHeight;
if (currentfr.addEventListener)
currentfr.addEventListener("load", readjustIframe, false)
else if (currentfr.attachEvent)
currentfr.attachEvent("onload", readjustIframe)
}
}

function readjustIframe(loadevt) {
var crossevt=(window.event)? event : loadevt
var iframeroot=(crossevt.currentTarget)? crossevt.currentTarget : crossevt.srcElement
if (iframeroot)
resizeIframe(iframeroot.id);
}

function loadintoIframe(iframeid, url){
if (document.getElementById)
document.getElementById(iframeid).src=url
}

if (window.addEventListener)
window.addEventListener("load", resizeCaller, false)
else if (window.attachEvent)
window.attachEvent("onload", resizeCaller)
else
window.onload=resizeCaller

// image rollover
function MM_swapImgRestore() { //v3.0
	var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_preloadImages() { //v3.0
	var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
	var i,j=d.MM_p.length,a=MM_preloadImages.arguments; 
	
	for(i=0; i<a.length; i++)
		if (a[i].indexOf("#")!=0) { 
			d.MM_p[j]=new Image; 
			d.MM_p[j++].src=a[i];
		}
	}
}

function MM_findObj(n, d) { //v4.01
	var p,i,x;  

	if(!d) 
		d=document; 

	if((p=n.indexOf("?"))>0&&parent.frames.length) {
		d=parent.frames[n.substring(p+1)].document; 
		n=n.substring(0,p);
	}

	if(!(x=d[n])&&d.all) 
		x=d.all[n]; 
	
	for (i=0;!x&&i<d.forms.length;i++) 
		x=d.forms[i][n];
  
	for(i=0;!x&&d.layers&&i<d.layers.length;i++) 
		x=MM_findObj(n,d.layers[i].document);
 
	if(!x && d.getElementById) 
		x=d.getElementById(n); 

	return x;
}

function MM_swapImage() { //v3.0
	var i,j=0,x,a=MM_swapImage.arguments; 
	document.MM_sr=new Array; 

	for(i=0;i<(a.length-2);i+=3)
	{
		if ((x=MM_findObj(a[i]))!=null) { 
			document.MM_sr[j++]=x; 
			if(!x.oSrc) 
				x.oSrc=x.src; 

			x.src=a[i+2];
		}
	}
}

// png image transform
function setPng24(obj){
        obj.width = obj.height = 1;
        obj.className = obj.className.replace(/\bpng24\b/i,'');
        obj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+ obj.src +"',sizingMethod = 'image');"
        obj.src='/images/common/blank.gif';
        return '';
}

