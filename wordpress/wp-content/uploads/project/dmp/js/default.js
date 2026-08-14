// For Iframe Resizing
var domain_name = document.domain;
domain_name = domain_name.replace("html.", "");
document.domain = domain_name;

// var mainFrame = parent.document.getElementById('contentFrame');
var mainFrame = null;
try {
	mainFrame = parent.document.getElementById('contentFrame');
	mainFrame.scrolling = 'no';
	mainFrame.style.overflow = 'visible';
} catch (e) {
	
}

window.onload = function(){
	if(mainFrame != null){
		mainFrame.width = "100%";
		mainFrame.height = document.body.scrollHeight + 60 + "px";
	}
}

function autoResize(obj)
{
	var theHeight= obj.contentWindow.document.body.scrollHeight;
	obj.height = theHeight + "px";
}

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

//FAQ-customer
	function toggleD(obj) {
	 if (obj.style.display == 'none')
		obj.style.display = '';
	 else
		obj.style.display = 'none';
	}
	function toggleAll() {
	 var obj ;
	 for(var i = 1 ; i <= 13 ; i++ ){
		obj = document.getElementById('open'+i) ;
		if (obj.style.display == 'none')
		obj.style.display = '';
		else
		obj.style.display = 'none';
	 }
	 for(var i = 1 ; i <= 29 ; i++ ){
		obj = document.getElementById('open'+i+'a') ;
		if (obj.style.display == 'none')
		obj.style.display = '';
		else
		obj.style.display = 'none';
	 }
	}


function ShowLayer(SL){

	var DivCnt = 2 ;
	var ChkDiv ;

	for(i=1;i<=DivCnt;i++){														
		ChkDiv = eval('document.all.tab'+i);
		ChkDiv.style.display='none';														
	}

	ChkDiv = eval('document.all.tab'+SL);
	ChkDiv.style.display='';		
	if (SL == 2 ) {
		obj = document.getElementById('page') ;
		obj.style.display = '' ;
	} else {
		obj = document.getElementById('page') ;
		obj.style.display = 'none' ;
	}
}										  

function page1(){
	var obj ;
	 for(var i = 1 ; i <= 10 ; i++ ){
		obj = document.getElementById('page1-'+i+'a') ;
		obj.style.display = '' ;
		obj = document.getElementById('page1-'+i+'q') ;
		obj.style.display = '' ;
	 }
	 for(var i = 1 ; i <= 10 ; i++ ){
		obj = document.getElementById('page2-'+i+'a') ;
		obj.style.display = 'none' ;
		obj = document.getElementById('page2-'+i+'q') ;
		obj.style.display = 'none' ;
	 }
	 for(var i = 1 ; i <= 9 ; i++ ){
		obj = document.getElementById('page3-'+i+'a') ;
		obj.style.display = 'none' ;
		obj = document.getElementById('page3-'+i+'q') ;
		obj.style.display = 'none' ;
	 }
	 obj = document.getElementById('page1') ;
	 obj.className='pageOn' ;
	 obj = document.getElementById('page2') ;
	 obj.className='pageOff' ;
	 obj = document.getElementById('page3') ;
	 obj.className='pageOff' ;
}
function page2(){
	var obj ;
	 for(var i = 1 ; i <= 10 ; i++ ){
		obj = document.getElementById('page1-'+i+'a') ;
		obj.style.display = 'none' ;
		obj = document.getElementById('page1-'+i+'q') ;
		obj.style.display = 'none' ;
	 }
	 for(var i = 1 ; i <= 10 ; i++ ){
		obj = document.getElementById('page2-'+i+'a') ;
		obj.style.display = '' ;
		obj = document.getElementById('page2-'+i+'q') ;
		obj.style.display = '' ;
	 }
	 for(var i = 1 ; i <= 9 ; i++ ){
		obj = document.getElementById('page3-'+i+'a') ;
		obj.style.display = 'none' ;
		obj = document.getElementById('page3-'+i+'q') ;
		obj.style.display = 'none' ;
	 }
	 obj = document.getElementById('page1') ;
	 obj.className='pageOff' ;
	 obj = document.getElementById('page2') ;
	 obj.className='pageOn' ;
	 obj = document.getElementById('page3') ;
	 obj.className='pageOff' ;
}
function page3(){
	var obj ;
	 for(var i = 1 ; i <= 10 ; i++ ){
		obj = document.getElementById('page1-'+i+'a') ;
		obj.style.display = 'none' ;
		obj = document.getElementById('page1-'+i+'q') ;
		obj.style.display = 'none' ;
	 }
	 for(var i = 1 ; i <= 10 ; i++ ){
		obj = document.getElementById('page2-'+i+'a') ;
		obj.style.display = 'none' ;
		obj = document.getElementById('page2-'+i+'q') ;
		obj.style.display = 'none' ;
	 }
	 for(var i = 1 ; i <= 9 ; i++ ){
		obj = document.getElementById('page3-'+i+'a') ;
		obj.style.display = '' ;
		obj = document.getElementById('page3-'+i+'q') ;
		obj.style.display = '' ;
	 }
	 obj = document.getElementById('page1') ;
	 obj.className='pageOff' ;
	 obj = document.getElementById('page2') ;
	 obj.className='pageOff' ;
	 obj = document.getElementById('page3') ;
	 obj.className='pageOn' ;
}
