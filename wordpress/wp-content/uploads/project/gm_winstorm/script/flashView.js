

function flashview(dirNswf,fwidth,fheight,varvalues,id){
 var flashobjec="";
 flashobjec+="<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0' width='"+fwidth+"' height='"+fheight+"' "+" id='"+id+"'>";
 flashobjec+="<param name='movie' value='"+dirNswf+"'>";
 flashobjec+="<param name='quality' value='high'>";
 flashobjec+="<param name='wmode' value='"+varvalues+"'>";
 flashobjec+="<param name='allowScriptAccess' value='always'>";
 flashobjec+="<embed src='"+dirNswf+"' quality='high' pluginspage='http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash' allowScriptAccess='always' showLiveConnect='true' type='application/x-shockwave-flash' width='"+fwidth+"' height='"+fheight+"'"+" id='"+id+"' name="+id+"'></embed>";
 flashobjec+="</object>";
  document.write(flashobjec);
 }


