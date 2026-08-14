// Blog Carousel
jQuery(window).load(function() {	
	'use strict';
	jQuery('.dt-blog-carousel[id^="owl-blog-carousel-"]').each( function() { 	

		var $div = jQuery(this);
		var token = $div.data('token');
		var rtlbool = true;

		var settingObj = window['dt_bc_' + token];	
		if(settingObj.dt_rtl != 'true') {
			rtlbool = false;
		}	

		jQuery("#owl-blog-carousel-"+settingObj.id+"").owlCarousel({
			autoHeight : true,				
			rewind: true,
			nav: false,
		    responsive:{
		        0:{
		            items:1,
		        },
		        640:{
		            items:2,
		        },
		        1024:{
		            items:settingObj.columns,
		        }
		    },				
			margin: 30,
			autoplay: false,
			rtl: rtlbool,
			dots: true,
			smartSpeed: 800
		});		

	});
});
