/**********************************************************************************
 *   Description : jQuery msPopup Plugin
 *   Author      : credit@mediaset.co.kr
 *   Date        : 2011/11/10
 *   Update      : ver1.0 (2011-11-10) 
 *   Copyright (C) MEDIASET corporation.  
 **********************************************************************************
 * CSS 등록
	.popup_back{
		display:none;
		position:fixed;
		_position:absolute; 
		height:100%;
		width:100%;
		top:0;
		left:0;
		background:#000000;
		border:1px solid #cecece;
	}
	.popup_layer{
		display:none;
		position:fixed;
		_position:absolute;
		border:1px solid #cecece;
		padding:10px 10px 10px 10px;   
		font-size:13px;
		background:#FFFFFF;
		box-sizing: border-box; 
		border-radius: 20px;
		border: 2px solid #fff; 
	}
	Example :
	<div id="hv_mjoin_form"></div>
	$("#hv_mjoin_form").msPopup("init");  CSS 적용, background div 생성 
	$("#hv_mjoin_form").msPopup("open");  팝업 오픈
	$("#hv_mjoin_form").msPopup("close"); 팝업 닫기 
 */
(function($){
	var msPopupConf = {
		init:function()
		{
			var $this = $(this);
			var $id = $this.attr("id");
			$this.addClass("popup_layer");
			if($("#"+$id+"_back").length == 0)
			{
				$this.before("<div id='"+$id+"_back' class='popup_back'></div>",function(){debug(this)});	
			}
		},
		open:function()
		{
			msPopupConf.centerPopup(this); 
			msPopupConf.loadPopup(this);
		},
		centerPopup:function(THIS) 
		{
			var $this = $(THIS);
			var $id   = $this.attr("id");
			var $this_bak = $("#"+$id+"_back");
			var nTop = ($(window).height()/2) - ($this.height()/2) + $(window).scrollTop() ;
			var nLeft = ($(window).width()/2) - ($this.width()/2) + $(window).scrollLeft() ;
			
			if($(window).maxHeight() < $this.height())
			{ 
				$this.height(($(window).maxHeight()- 100))
				nTop = ($(window).height()/2) - ($this.height()/2) + $(window).scrollTop() ;
			}
			$this_bak.height($(window).maxHeight());  
			$this.css({ "position": 'absolute', "top": nTop+'px',"left": nLeft+'px'});
			$(window).resize(function(){
				msPopupConf.actResize($this); 
			}).scroll(function(){
				msPopupConf.actScroll($this);  
			});
		},
		actScroll:function(THIS)
		{ 
			var $this = $(THIS);
			var $id   = $this.attr("id");
			var $this_bak = $("#"+$id+"_back");
			if(!$this.is(":hidden"))
			{
				$this_bak.height($(window).maxHeight()); 
				var yPos = 0;
           	 	 //
           	 	 yPos = ( ($(window).height()/2) - ($this.height()/2) + $(window).scrollTop() );	
           	 	 /*
				 if($.browser.webkit === true)
				 {
					yPos = ( ($(window).height()/2) - ($this.height()/2) + document.body.scrollTop );
				 } 
				 else
				 {
				 	
				 } 
				 */
				$this.animate({  "top":yPos }, {duration:300, easing:'linear', queue:false});	
			}
		},	
		actResize:function(THIS)
		{
			var $this = $(THIS);
			var $id   = $this.attr("id");
			var $this_bak = $("#"+$id+"_back");
			if(!$this.is(":hidden"))
			{
				$this_bak.height($(window).maxHeight());
				//easing type : linear, swing  
				var nTop = ($(window).height()/2) - ($this.height()/2) + $(window).scrollTop() ;
				var nLeft = ($(window).width()/2) - ($this.width()/2) + $(window).scrollLeft() ;
				$this.css({ "position": 'absolute', "top": nTop+'px',"left": nLeft+'px'});
			}
		},
		loadPopup:function(THIS)
		{
			var $this = $(THIS);
			var $id   = $this.attr("id");
			var $this_bak = $("#"+$id+"_back");
			var $len = 0;
			$len =  $(".popup_layer").not(":hidden").length;
			//$len =  $(".popup_layer").length;
			$this.css("z-index",Number($len+"01"));
			$this_bak.css("z-index",Number($len+"00"));
			$this_bak.css({ "opacity": "0.3" });
			$this_bak.show();
			$this.show();
		},  
		close:function()
		{
			var $this = $(this);
			var $id   = $this.attr("id");
			var $this_bak = $("#"+$id+"_back");
			$this.unbind("scroll",msPopupConf.actScroll(this));
	 		$this_bak.hide();
			$this.hide(); 
		}
	}
	$.fn.msPopup = function(method) { 
		if ( msPopupConf[method] ) 
		{
	      return msPopupConf[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } 
		else if ( typeof method === 'object' || ! method ) 
		{
	      return methods.init.apply( this, arguments );
	    } 
		else 
		{
	      $.error( 'Method ' +  method + ' does not exist on jQuery.msPopup' );
	    }  
	}
})(jQuery);