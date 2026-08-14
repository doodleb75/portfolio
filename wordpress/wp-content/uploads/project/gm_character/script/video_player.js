var isNav, isIE;
var width; 
var height;
var offsetX;

var pVol_top;
var vminX;
var vmaxX;
var cPos_top;
var cminX;
var cmaxX;

var selectedObj;

var Volumn_ID;

width = 9;
height = 7;
offsetX;

pVol_top = 300;
vminX    = 457;
vmaxX    = 500;

cPos_top = 40;
cminX    = 60;
cmaxX    = 395;

if (parseInt(navigator.appVersion) >= 4) 
{	if (navigator.appName == "Netscape") 
	{	sNav = true; 	} 
	else 
	{	isIE = true;	}
}


function volChange(UpDown)
{	
	if ((navigator.userAgent.indexOf("IE") > -1) && (navigator.platform == "Win32"))
	{	
		var curVol = Player1.Volume;	
	} 
	else 
	{	
		var curVol = Player1.GetVolume();		
	}
	
	if (UpDown == "up") 
	{	
		//curVol = -((Math.abs(curVol))/AUDIOSTEP);
		curVol = -(Math.abs(curVol) - 200);
		if (curVol > -1) 
		{	
			curVol = -1;	
		}		
	} 
	else if (UpDown == "down") 
	{	
		//curVol = -((Math.abs(curVol) + 1)*AUDIOSTEP);
		curVol = -(Math.abs(curVol) + 200);
		if (curVol < -10000) 
		{	
			curVol = -10000;	
		}
	} 
	else 
	{	
		if ( vol == -10000 ) {  vol = curVol; curVol = -10000; }
		else {  curVol = vol; vol = -10000; }		
	}	
	
	curVol = Math.floor(curVol);
	if ((navigator.userAgent.indexOf("IE") > -1) && (navigator.platform == "Win32"))
	{	
		Player1.Volume = curVol;
	} 
	else 
	{	
		Player1.SetVolume(curVol);	
	}
}

function funcInit()
{
	Volumn_ID = window.setInterval ("volumPosition()", 200);
	Position_ID = window.setInterval ("CurrentPosition()", 200); 
	//setInterval("alert(Player1.Volume)", 2000);
	setTimeout( "play_movie()", 500 );

	funcStart();
}

function CurrentPosition() {
    if (Player1.PlayState != 2) return;
    pTrc.style.pixelLeft = ToBarPosition(Player1.CurrentPosition); 
}

function volumPosition() {
  if (Player1.PlayState != 2) return;
 	pVol.style.pixelLeft = ToVolumeLevel(Player1.Volume);
}

function ToBarPosition(pos)
{  	var level;

	level = ((cmaxX - cminX) * pos) / Player1.Duration;
  	level = parseInt(level) + cminX;
  	return level;
}


function ToVolumeLevel(vol) {	
	var level;

	if ( vol <= -10000 ) return vminX;

	level = Math.pow(10,vol/2000);
	level = level * ( vmaxX - vminX ) + vminX;
	return level;
	
	//if ( vol < -4000 ) return vminX;
	//else if ( vol > 0 ) return vmaxX;
	//else {
	//	level = ((vmaxX - vminX)/10000)*(10000 + vol);
	//	return level;
	//}
}

function ToPlayerVolume(vol)
{	var level;

	level = (vol - vminX) / (vmaxX - vminX);
	if ( level == 0 )
		return -10000;
	level = Math.log(level)/Math.log(10) * 2000;
	if ( level > 0 )
		level = 0;
	if ( level < -10000 )
		level = -10000;
	level = parseInt(level);
	return level;
}


function ToPlayerPosition(pos)
{	var level;
  	var barpos = (pos-cminX);
  	var barlen = (cmaxX-cminX) ;
  	
  	level = (Player1.Duration * barpos) / barlen;
  	level = parseInt(level);
  	return level;
}

function ToBarPosition(pos)
{  	var level;

	level = ((cmaxX - cminX) * pos) / Player1.Duration;
  	level = parseInt(level) + cminX;
  	return level;
}

function getVolObject(i)
{  	switch (i)
	{	case 0:
    			if (isNav)
    			{	return document.layers["pVol"];	} 
			else 
			{	return document.all.pVol.style;	}
    			break;
  		case 1:
    			if (isNav)
    			{	return document.layers["pTrc"];	} 
    			else 
    			{	return document.all.pTrc.style;	}
    			break;
  	}
}

function shiftTo(obj, x, setVolume) 
{	
	var minX;
	var maxX;
	if (obj == getVolObject(0)) 
	{	
		minX = vminX;
		maxX = vmaxX;
	}
  else
  { 
   	minX = cminX;
		maxX = cmaxX;
  }		

  if ( x < minX) x = minX;
  if ( x > maxX) x = maxX;

  if (isNav) 
  {	
  	obj.moveTo(x,obj.top);
  } 
  else 
  {   	
  	obj.pixelLeft = x;
  }

 	if (setVolume)
	{	
		var x1;
	  if (obj == getVolObject(0)) 
	  {	
	  	x1 = ToPlayerVolume(x);
	  	Player1.Volume = x1;
	  }
	  else 
	  {	
	  	x1 = ToPlayerPosition(x);
	    Player1.CurrentPosition = x1;
	  }
	}	  
}

function hitTest(x, y)
{	if ( x >= vminX && x <= vmaxX + width)
	{	if ( y >= pVol_top && y <= pVol_top + height)
		{ 	return getVolObject(0);	}
  	}

  	if ( x >= cminX && x <= cmaxX + width)
  	{	if ( y >= cPos_top && y <= cPos_top + height)
  		{	return getVolObject(1); }
  	}
  	return null;
}

function setZIndex(obj, zOrder) 
{	
	obj.zIndex = zOrder;
}

function setSelectedElem(evt) 
{	
	if (isNav) 
	{	
		var clickX = evt.pageX;
		var clickY = evt.pageY;
		var testObj;

		for (var i = document.layers.length - 1; i >= 0; i--) 
		{	
			testObj = document.layers[i];
  		if ((clickX > testObj.left) && 
    	   (clickX < testObj.left + testObj.clip.width) && 
    	   (clickY > testObj.top) && 
    	   (clickY < testObj.top + testObj.clip.height)) 
    	{	
    		selectedObj = testObj;
    		if (selectedObj) 
    		{	
    			setZIndex(selectedObj, 100);
      		return;
    		}
  		}
		}
		selectedObj = hitTest(evt.pageX , evt.pageY);
		
		if (selectedObj)
		{ 
			offsetX = 5;
    	setZIndex(selectedObj,3);
    	shiftTo(selectedObj, evt.pageX - 5, true);
    	return;
		}
	} 
	else 
	{	
		var imgObj = window.event.srcElement;
    selectedObj = imgObj.parentElement.style;
    if (selectedObj && imgObj.parentElement.id != "") 
    {	
    	offsetX = window.event.offsetX;
      setZIndex(selectedObj,100);
      return;
    }
    selectedObj = hitTest(window.event.clientX , window.event.clientY);
    if (selectedObj)
    {
    	offsetX = width/2;
      setZIndex(selectedObj,100);
      shiftTo(selectedObj, window.event.clientX - width/2, true);
      return;
    }
  }
  selectedObj = null;
  return;
}

function dragIt(evt) 
{	
	if (selectedObj) 
	{	
		if (isNav) 
		{	
			shiftTo(selectedObj, (evt.pageX - offsetX),true);	
		} 
		else 
		{	
			shiftTo(selectedObj, (window.event.clientX - offsetX),true); 
   	}
  }
  return false;
}

function engage(evt) 
{	
  setSelectedElem(evt);
  if (selectedObj) 
  {	
  	if (isNav) 
  	{	
  		offsetX = evt.pageX - selectedObj.left;    
  	} 
		else 
		{
		}
  }
  
  if ((event.button==2) || (event.button==3) || (event.keyCode == 93)) {
  	//alert('마우스 오른쪽 버튼은 사용할수 없습니다.');
	return false;
  }
  else {
    if((event.ctrlKey) || (event.shiftKey) || (event.altKey)) {
      //alert('키를 사용할 수 없습니다.');
	return false;
    }
  }
  return false;  
  
}

function release(evt) 
{	if (selectedObj) 
	{	setZIndex(selectedObj, 0);
    		selectedObj = null;
  	}
}

function volsilent()
{
	if(Player1.Mute == 0) {
		Player1.Mute = 1;
		document.volumn.src = "img/mute_btn.png";
	}
	else {
		Player1.Mute = 0;
		document.volumn.src = "img/mute_btn_r.png";
	}
}
	
	
document.onmousedown = engage;
document.onmousemove = dragIt;
document.onmouseup = release;


flagPos = 0;
flagCheck = 0;

function CurrentTime()
{
	var currentPosition = Player1.CurrentPosition;
	var totalPosition   = Player1.Duration;
	if(flagPos == 1)
	{
		setTimeout("CurrentTime()", 1000)		
		var min = currentPosition / 60;
		min = parseInt(min);
		var sec = currentPosition % 60;
		sec = parseInt(sec);
		
		if ( 10 > min) min="0" + min;  // 현재 시작 시간 : 분
		if ( 10 > sec) sec="0" + sec;  // 현재 시작 시간 : 초	
		
		var currePos = min + ":" + sec;
		
		min = totalPosition / 60;
		min = parseInt(min);
		//alert(min);
		if ( 10 > min) min="0" + min;  // 현재 시작 시간 : 
		
		sec = totalPosition % 60;
		sec = parseInt(sec);
		//alert(sec);
		if ( 10 > sec) sec="0" + sec;		
		
//		if(sec < 0)
//			document.all("oL_pos").innerHTML = "<font size=2 color=#FFFFFF>" + currePos + "</font>";
//		else {
//			var totalPos = min + ":" + sec;
//			document.all("oL_pos").innerHTML = "<font size=2 color=#FFFFFF>" + currePos + "/" + totalPos + "</font>";
//		}
	}
}


//**************************************************************
// 시작 - 플레이어 onmouse 이미지 스크립트
//**************************************************************
function MM_swapImgRestore() 
{ 	var i,x,a=document.MM_sr;
	
	for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++)
	 	x.src=x.oSrc;
}

function MM_preloadImages() 
{	var d=document; 
	
	if(d.images)
	{ 	if(!d.MM_p) d.MM_p=new Array();
    		
    		var i,j=d.MM_p.length,a=MM_preloadImages.arguments; 
    		for(i=0; i<a.length; i++)
    			if (a[i].indexOf("#")!=0)
    			{ 	d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];	}
    	}
}

function MM_findObj(n, d) 
{ 	var p,i,x;  

	if(!d) d=document; 
	if((p=n.indexOf("?"))>0&&parent.frames.length) 
	{	d = parent.frames[n.substring(p+1)].document;
		n = n.substring(0,p);
	}
  	if(!(x=d[n])&&d.all) x=d.all[n]; 
  	for(i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  	for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  	if(!x && document.getElementById) x=document.getElementById(n); return x;
}

function MM_swapImage() 
{ 	var i,j=0,x,a=MM_swapImage.arguments; 

	document.MM_sr=new Array; 
	for(i=0;i<(a.length-2);i+=3)
   		if ((x=MM_findObj(a[i]))!=null)
   		{	document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];	}
}
//**************************************************************
// 끝 - 플레이어 onmouse 이미지 스크립트
//**************************************************************




function help() {
 window.open("pop_01.html","help","width=900,height=650")   
}

 function dic() {
 window.open("pop_02.html","help","width=900,height=650")   
}









