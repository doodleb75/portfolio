// Skills - Percent Bar
function delicious_skills() {
	'use strict';
	var skill = jQuery('.skillbar');
	skill.each(function(){
		var barwidth = jQuery(this).attr('data-percent');


		jQuery(this).waypoint(function() {
		
			jQuery(this).find('.skillbar-bar').animate({
				width: barwidth
			},2000);
			jQuery(this).find('.skill-bar-percent').animate({
				'left':barwidth,
				'margin-left': '-19px',
				'opacity': 1
			}, 2000);	
		}, 
		{ 
			offset: '90%',
			triggerOnce: true
		});		
	});	
}

jQuery(document).ready(function() {
	delicious_skills();
});
