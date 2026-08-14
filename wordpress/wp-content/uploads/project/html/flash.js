function flash_load(swf,w,h){
str  = '' 
str += '<object classid=clsid:D27CDB6E-AE6D-11cf-96B8-444553540000 codebase=http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0 width='+w+' height='+h+'>'
str += '<param name=movie value='+swf+'>'
str += '<param name=quality value=high>'
str += '<param name=wmode value=transparent>'
str += '<param name=wmode value=opaque>'
str += '<embed src='+swf+' quality=high pluginspage=http://www.macromedia.com/go/getflashplayer type=application/x-shockwave-flash width='+w+' height='+h+'></embed>' 
str += '</object>'

document.write( str ); 
}

function wmv_load(src,w,h){
hstr = "<embed type='application/x-mplayer2' pluginspage='http://www.microsoft.com/windows/mediaplayer/download/default.asp' " ;
hstr +="src=\""+src+"\"  ";
hstr +="width="+w+" height="+h+"  "; 
//hstr +="SHOWCONTROLS=1 SHOWSTATUSBAR=1 SHOWDISPLAY=1 SHOWGOTOBAR=1 AUTOSTART=1  showpositioncontrols=\"1\" showcontrols=\"1\"   ";
//hstr +="EnableContextMenu=\"false\"    transparentatstart=\"0\"  "; 
hstr +="autosize=\"0\" autostart=\"-1\" animationatstart=\"0\" ShowCaptioning=\"false\"  ";
//hstr +="showcontrols=\"false\"  ";//동영상컨트롤바 없게
hstr +="volume=\"90\" loop=false> ";

document.write( hstr ); 
}