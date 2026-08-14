// Portfolio Gallery Slider
jQuery(window).load(function() {	
	'use strict';
	jQuery('.portfolio-slider[id^="owl-slider-"]').each( function() { 	

		var $div = jQuery(this);
		var token = $div.data('token');
		var bool = true;
		var rtlbool = true;

		var settingObj = window['dt_slider_' + token];	
		if(settingObj.slider_speed == 'false') {
			bool = false;
		}		
		if(settingObj.dt_rtl != 'true') {
			rtlbool = false;
		}			

		var mg = settingObj.dt_margin;

		jQuery("#owl-slider-"+settingObj.id+"").owlCarousel({
			autoHeight : true,
		    responsiveClass:true,
		    responsive:{
		        0:{
		            items:settingObj.mobile_slides,
		            nav:true
		        },
		        640:{
		            items:settingObj.tablet_slides,
		            nav:true
		        },
		        1024:{
		            items:settingObj.desktop_slides,
		            nav:true
		        }
		    },			
			navText: [
				  "<i class='fa fa-angle-left'></i>",
				  "<i class='fa fa-angle-right'></i>"
				  ],				
			rewind: true,
			autoplay: bool,
			rtl: rtlbool,
			autoplayTimeout: settingObj.slider_speed,	
			lazyLoad: settingObj.lazyload,		
			autoplayHoverPause: true,
			dots: true,
			smartSpeed: 800
		});		

	});
});