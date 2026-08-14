function dt_item_on_hover() {
	// Portfolio Grid In and Out Effect //
	var portfoliohover = jQuery('.grid-item a');
	portfoliohover.on({
	    mouseenter: function() {
	       jQuery(this).find('.grid-item-on-hover').animate({ opacity: 1 }, 350);
	    },
	    mouseleave: function() {
	       jQuery(this).find('.grid-item-on-hover').animate({ opacity: 0 }, 350);
	    }
	})	
}

function dt_portfolio_grid_lightboxes() {
	var mfpgallery = jQuery('.mfp-gallery');
	mfpgallery.each(function() {
	    jQuery(this).find('.dt-lightbox-gallery').magnificPopup({
	    	type: 'image',
	        gallery: {
	          enabled:true,
	          preload: [0,1]
	        }
	    });
	});				

	var dtgallery = jQuery('.dt-gallery-trigger');
	jQuery('.dt-gallery-trigger').on('click', function () {
	    jQuery(this).next().magnificPopup('open');
	});

	jQuery('.dt-single-gallery').each(function () {
	    jQuery(this).magnificPopup({
	        delegate: 'a',
	        type: 'image',
	        gallery: {
	            enabled: true,
	            navigateByImgClick: true
	        },
	        fixedContentPos: false
	    });
	});	

}

jQuery(window).load(function() {
	'use strict';
	dt_item_on_hover();
	// Isotope for Portfolio

jQuery('.delicious-grid[id^="gridwrapper_"]').each( function() { 

	var $div = jQuery(this);
	var token = $div.data('token');
	var settingObj = window['dt_grid_' + token];	
	
	var $container = '';
	var $optionSets = '';

	var $initial_filter = '';

	if (typeof settingObj === 'undefined') {
		$container = jQuery(" .grid_portfolio");
		$optionSets = jQuery('#gridwrapper_portfolio #filter_options .option-set');
	}
	else {
		if(settingObj.initial_word != '') {
			$initial_filter = '.'+settingObj.initial_word+'';
		}			
		$container = jQuery(".grid_"+settingObj.id+"");
		$optionSets = jQuery('#gridwrapper_'+settingObj.id+'  #filter_options .option-set');
	}


	var $del_grid = $container.imagesLoaded().done( function() {
		$del_grid.isotope({
			masonry: {
			  columnWidth: '.grid-item.item-small',
			},
			itemSelector: '.grid-item',
			filter: $initial_filter,
			percentPosition: true
		});	
	});	

	var $optionLinks = $optionSets.find('a');
	
	if($initial_filter != '') {
		$optionLinks.each(function(){
			var $this = jQuery(this);
			if ( $this.hasClass('selected') ) {
				$this.removeClass('selected');
			}
			if($this.attr('data-filter') == $initial_filter) {
				$this.addClass('selected');
			}
		});
	}	

	// bind filter button click
	$optionSets.on( 'click', 'li a', function() {
		var filterValue = jQuery( this ).attr('data-filter');
		// use filterFn if matches value
		$del_grid.isotope({ filter: filterValue });
	});
	// change selected class on buttons
	$optionSets.each( function( i, buttonGroup ) {
		var $buttonGroup = jQuery( buttonGroup );
		$buttonGroup.on( 'click', 'li a', function() {
		  $buttonGroup.find('.selected').removeClass('selected');
		  jQuery( this ).addClass('selected');
		});
	});	

	if(settingObj.cat_trigger != "") {
		var open = false;
		var trigger = jQuery('.cat-trigger');
		if(trigger.hasClass('active')) {
			open = true;
		}
	    trigger.on('click', function() {
	        if (open == false) {
	            jQuery('#filter_options').slideDown(400);
	            jQuery(this).removeClass("idle").addClass('active');
	            open = true;
	        } else {
	            jQuery('#filter_options').slideUp(400);
	            jQuery(this).removeClass('active').addClass('idle');
	            open = false;
	        }   
	    });
	}

	if(settingObj.distyle != 'all') {
		// load more btn
	    var ias = jQuery.ias({
	      container: ".portfolio",
	      item: ".grid-item",
	      pagination: ".dt_pagination",
	      next: ".next",
	      delay: 1200
	    });

	    ias.on('render', function(items) {
	      jQuery(items).css({ opacity: 0 });
	      jQuery(items).removeClass('wow');
	    });    


	    ias.on('rendered', function(items) {
			$del_grid.imagesLoaded().done(function() {
				$del_grid.append( items ).isotope( 'appended', items );
				$del_grid.isotope('layout');
				$del_grid.isotope();
			});
	   	 	jQuery('.to-hide').remove(); 	
			dt_item_on_hover();	    
			dt_portfolio_grid_lightboxes();
	    });

	    ias.on('loaded', function(data, items) {
	    	$del_grid.isotope();
	    	jQuery(items).css({ opacity: 1 });
	     	jQuery(items).addClass('wow');
	    });

		ias.on('noneLeft', function() {	
		    $del_grid.isotope();
		});	    		

		// load more btn
		if(settingObj.distyle == 'load-more-btn') { 
		    ias.extension(new IASTriggerExtension({
			    text: settingObj.dt_load_more,
			    html: '<div class="ias-wrapper"><div class="ias-trigger ias-trigger-next"><a class="dt-button black alt to-trigger">{text}</a></div></div>'
			}));
		}

		// load more infinite
		if(settingObj.distyle == 'load-more-infinite') { 
			ias.extension(new IASSpinnerExtension({
				html: '<div class="ias-wrapper"><div class="ias-infinite-loader">'+settingObj.dt_infinite_loader+'</div></div>'
			}));
		}
	    ias.extension(new IASNoneLeftExtension({html: '<div class="ias-noneleft" style="text-align:center"><p>'+settingObj.dt_no_projects_left+'</p></div>'}));	


	}
	});
});