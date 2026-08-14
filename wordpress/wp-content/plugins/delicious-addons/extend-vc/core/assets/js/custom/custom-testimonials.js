// Testimonials Slider
jQuery(window).load(function() {	
	'use strict';
	jQuery('.testimonials-slider[id^="owl-testimonials"]').each( function() { 	

		var $div = jQuery(this);
		var token = $div.data('token');
		var bool = true;
		var rtlbool = true;

		var settingObj = window['dt_testimonials_' + token];	
		if((settingObj.testimonial_speed == '') || (settingObj.testimonial_speed == 'false')) {
			bool = false;
		}
		if(settingObj.dt_rtl != 'true') {
			rtlbool = false;
		}	
		jQuery("#owl-testimonials-"+settingObj.id+"").owlCarousel({
			autoHeight : true,
			items : 1,
			nav: false,
			navText: [
				  "<i class='fa fa-angle-left'></i>",
				  "<i class='fa fa-angle-right'></i>"
				  ],				
			rewind: true,
			rtl: rtlbool,
			autoplay: bool,
			autoplayTimeout: settingObj.testimonial_speed,			
			autoplayHoverPause: true,
			smartSpeed: 800,
			dots: true
		});		

	});
});