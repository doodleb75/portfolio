var isNav, isIE;
var width;	  //트랙포지션
var height;	  //트랙포지션
//var width2;   //볼륨
//var height2;  //볼륨

var offsetX;

var pVol_top;
//var vminX;
//var vmaxX;
var cPos_top;
var cminX;
var cmaxX;

var selectedObj;

var Volumn_ID;

width = 28;
height = 10;

//width2 = 8;
//height2 = 18;

//pVol_top = 470;
//vminX    = 822;
//vmaxX    = 917;

cPos_top = 10;
cminX    = 243;
cmaxX    = 520;   

if (parseInt(navigator.appVersion) >= 4) 
{	if (navigator.appName == "Netscape") 
	{	sNav = true; 	} 
	else 
	{	isIE = true;	}
}


/*function volChange(UpDown)
{	
	if ((navigator.userAgent.indexOf("IE") > -1) && (navigator.platform == "Win32"))
	{	
		var curVol = MediaPlayer1.Volume;	
	} 
	else 
	{	
		var curVol = document.MediaPlayer1.GetVolume();		
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
		MediaPlayer1.Volume = curVol;
	} 
	else 
	{	
		document.MediaPlayer1.SetVolume(curVol);	
	}
}
*/

function funcInit()
{
	//Volumn_ID = window.setInterval ("volumPosition()", 200);
	Position_ID = window.setInterval ("CurrentPosition()", 200); 
	//setInterval("alert(MediaPlayer1.Volume)", 2000);
}

function CurrentPosition() {
    if (MediaPlayer1.PlayState != 2) return;
    pTrc.style.pixelLeft = ToBarPosition(MediaPlayer1.CurrentPosition); 
}

/*
function volumPosition() {
  if (MediaPlayer1.PlayState != 2) return;
 	pVol.style.pixelLeft = ToVolumeLevel(MediaPlayer1.Volume);
}
*/

function ToBarPosition(pos)
{  	var level;

	level = ((cmaxX - cminX) * pos) / MediaPlayer1.Duration;
  	level = parseInt(level) + cminX;
  	return level;
}

/*
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
*/

/*
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
*/


function ToPlayerPosition(pos)
{	var level;
  	var barpos = (pos-cminX);
  	var barlen = (cmaxX-cminX) ;
  	
  	level = (MediaPlayer1.Duration * barpos) / barlen;
  	level = parseInt(level);
  	return level;
}


function getVolObject(i)
{  	switch (i)
	{	/*case 0:
    			if (isNav)
    			{	return document.layers["pVol"];	} 
			else 
			{	return document.all.pVol.style;	}
    			break;
  		*/
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
	if (obj == getVolObject(1)) 
	{	
	  	minX = cminX;
		maxX = cmaxX;
	}
/*  else
  { 
		minX = vminX;
		maxX = vmaxX;
  }		
*/

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
	  if (obj == getVolObject(1)) 
	  {	
	  	x1 = ToPlayerPosition(x);
	    MediaPlayer1.CurrentPosition = x1;
	  }
/*
	  else 
	  {	
		x1 = ToPlayerVolume(x);
	  	MediaPlayer1.Volume = x1;
	  }
*/
	}	  
}


function hitTest(x, y)
{	
/*	if ( x >= vminX && x <= vmaxX + width2)
	{	if ( y >= pVol_top && y <= pVol_top + height2)
		{ 	return getVolObject(0);	}
  	}
*/
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
    	setZIndex(selectedObj,100);
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
	  if (selectedObj.width == "38px")
	  {
		  if(window.event.button==1)
		  {
			if (isNav) 
			{	shiftTo(selectedObj, (evt.pageX - offsetX),true);	} 
			else 
			{	shiftTo(selectedObj, (window.event.clientX - offsetX),true); 
	      			return false;
			}
		  }
	  }
  	}

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
  	alert('마우스 오른쪽 버튼은 사용할수 없습니다.');
  }
  else {
    if((event.ctrlKey) || (event.shiftKey) || (event.altKey)) {
      alert('키를 사용할 수 없습니다.');
    }
  }
  return false;  
  
}

function release(evt) 
{	if (selectedObj) 
	{	setZIndex(selectedObj, 10);
    		selectedObj = null;
  	}
}

	
document.onmousedown = engage;
document.onkeydown=engage;
document.onmousemove = dragIt;
document.onmouseup = release;

