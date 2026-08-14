// Portfolio Gallery Slider
jQuery(window).load(function() {	
	'use strict';
	jQuery('.carousel-clients[id^="owl-clients-"]').each( function() { 	

		var $div = jQuery(this);
		var token = $div.data('token');
		var bool = true;
		var rtlbool = true;		
		var dotsbool = true;

		var settingObj = window['dt_clients_' + token];	
		if(settingObj.clients_speed == 'false') {
			bool = false;
		}
		if(settingObj.dt_rtl != 'true') {
			rtlbool = false;
		}			
		if(settingObj.dt_dots != 'true') {
			dotsbool = false;
		}	

		jQuery("#owl-clients-"+settingObj.id+"").owlCarousel({
			autoHeight : true,
		    responsive:{
		        0:{
		            items:settingObj.mobile
		        },		        
		        480:{
		            items:settingObj.big_mobile
		        },
		        768:{
		            items:settingObj.tablet
		        },
		        1024:{
		            items: settingObj.small_desktop
		        },
		        1280:{
		            items: settingObj.desktop
		        },	
		        1600:{
		            items: settingObj.big_desktop
		        }			        		        	
		    },
			nav: false,
			rewind: true,
			rtl: rtlbool,
			autoplay: bool,
			autoplayTimeout: settingObj.clients_speed,
			autoplayHoverPause: true,
			dots: dotsbool,
			smartSpeed: 800			
		});	
	});

	var clientitemanchor = jQuery('.client-item a[href="#"]');
	clientitemanchor.on('click', function(e) {
	  	e.preventDefault();
	  });

});