jQuery.logThis = function( text ){
	'use strict';
    if( (window['console'] !== undefined) ){
        console.log( text );
    }
}

// Counting Numbers
function counts() {
	'use strict';
	if(!( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )) {	
		jQuery('.counter-wrapper').waypoint(function() {
			jQuery('.counter-number').countTo();	
		}, 
		{ 
			offset: '95%',
			triggerOnce: true
		});
	}

	else {
		jQuery('.counter-number').countTo();	
	}
}

jQuery(window).load(function() {
	'use strict';
	// Fixes some Waypoint issues
	jQuery('body').waypoint(function() {
		jQuery.logThis('ready to go');
	}, 
	{ 
		triggerOnce: true
	});
});

jQuery(document).ready(function() {
	counts();
});