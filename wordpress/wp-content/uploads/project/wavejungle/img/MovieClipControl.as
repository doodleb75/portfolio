// MovieClipControl.as

/***********************************************************
* MovieClipControl, Version 0.5 beta
* Updates at: http://www.typographist.com
*
* @Author: Rotaercz
* @Last Update: 2006-08-21
* @Flash Version: 8
***********************************************************/

class MovieClipControl extends MovieClip {
 public function MovieClipControl() {
  super();
 }
 
 private var tempEaseOut:MovieClip;
 private var tempElastic:MovieClip;
 private var tempFade:MovieClip;
 private var tempresizeOut:MovieClip;
 private var onEnterFrame:Function;
 
 public function easeOut(xloc:Number, yloc:Number, vel:Number):Void {
  if (xloc == undefined || yloc == undefined || vel == undefined) { return; }
  
  var dx:Number;
  var dy:Number;
  var ss:Number;
  
  this.createEmptyMovieClip("tempEaseOut", 10000);
  tempEaseOut.onEnterFrame = function() {
   dx = Math.round(((xloc-this._parent._x)/vel)*100)/100;
   dy = Math.round(((yloc-this._parent._y)/vel)*100)/100;
   this._parent._x += dx;
   this._parent._y += dy;
   ss = Math.sqrt(Math.pow((xloc-this._parent._x), 2)+Math.pow((yloc-this._parent._y), 2));
   if (Math.abs(dx)<.1) { this._parent._x = xloc; }
   if (Math.abs(dy)<.1) { this._parent._y = yloc; }
   if (ss == 0) { delete this.onEnterFrame; }
  };
 }
 
 public function elastic(destX:Number, destY:Number, ratio:Number, friction:Number) {
  if (destX == undefined || destY == undefined || ratio == undefined || friction == undefined) { return; }
  
  var dx:Number = 0;
  var dy:Number = 0;
  var ss:Number;
  
  this.createEmptyMovieClip("tempElastic", 10001);
  tempElastic.onEnterFrame = function() { 
   dx = ((destX - this._parent._x) * ratio) + (dx * friction);
   dy = ((destY - this._parent._y) * ratio) + (dy * friction);
  
   this._parent._x += dx;
   this._parent._y += dy;
   
   ss = Math.sqrt(Math.pow((destX-this._parent._x), 2)+Math.pow((destY-this._parent._y), 2));
   if (Math.abs(ss)<.1) { 
    this._parent._x = destX;
    this._parent._y = destY;
    delete this.onEnterFrame; 
   }
  }
 }
 
 public function fade(sAlpha:Number, eAlpha:Number, vel:Number):Void {
  if (sAlpha == undefined || eAlpha == undefined || vel == undefined) { return; }
  
  if(vel == undefined) { vel = 5; } // set Default speed value if needed
  this._alpha = sAlpha; // init
    
  this.createEmptyMovieClip("tempFade", 10002);    
  tempFade.onEnterFrame = function() {
   if(sAlpha < eAlpha) { // fade in
    if(this._parent._alpha < eAlpha){
     this._parent._alpha += vel;
    }else{
     this._parent._alpha = eAlpha;
     delete this.onEnterFrame;
    }
    
   }else{ // fade out
    if(this._parent._alpha > eAlpha){ 
     this._parent._alpha -= vel;
    }else{
     this._parent._alpha = eAlpha;
     delete this.onEnterFrame;
    }
   }
  }
 }
 
 public function resizeOut(nWidth:Number, nHeight:Number, vel:Number):Void {
  if (nWidth == undefined || nHeight == undefined || vel == undefined) { return; }
  
  var dx:Number;
  var dy:Number;
  var ss:Number;
  
  this.createEmptyMovieClip("tempresizeOut", 10003);
  tempresizeOut.onEnterFrame = function() {
   dx = Math.round(((nWidth-this._parent._width)/vel)*100)/100;
   dy = Math.round(((nHeight-this._parent._height)/vel)*100)/100;
   this._parent._width += dx;
   this._parent._height += dy;
   ss = Math.sqrt(Math.pow((nWidth-this._parent._width), 2)+Math.pow((nHeight-this._parent._height), 2));
   if (Math.abs(dx)<.1) { this._parent._width = nWidth; }
   if (Math.abs(dy)<.1) { this._parent._height = nHeight; }
   if (ss == 0) { delete this.onEnterFrame; }
  };
 }
}



 

 

