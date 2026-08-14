<?php
/*-----------------------------------------------------------------------------------*/
/*	Delicious Addons - Stag Edition
/*-----------------------------------------------------------------------------------*/

/*-----------------------------------------------------------------------------------*/
/*	Buttons
/*-----------------------------------------------------------------------------------*/

function dt_button_shortcode( $atts, $content = null ) {
	extract( shortcode_atts( array(
      'btn_color' => 'orange',
      'style' => '',
      'text' => 'Button Text',
	  'size' => '',
      'url' => '',
      'icon' => '',
      'target' => '',
      'icon_right' => ''
      ), $atts ) );
	$dt_alt = ($style != '') ? 'alt' : '';
	$dt_icon_i = ($icon != '') ? '<i class="fa '.$icon.'"></i>' : '';
	$dt_icon_p = ($icon_right != '') ? 'icon-right' : 'icon-left';
	$dt_b_target = ($target != '') ? 'target="_blank"' : '';

	if($url) {
      return '<a '.$dt_b_target.' class="dt-button ' . $btn_color .' '. $size . ' ' . $dt_alt . ' ' . $dt_icon_p . '" href="' . esc_url($url) . '">'.$dt_icon_i.'' . $text . $content . '</a>';
	} else {
		return '<a class="dt-button ' . $btn_color . '" href="">' . esc_html($text) . $content . '</a>';
	}
}

add_shortcode('dt-button', 'dt_button_shortcode');


/*-----------------------------------------------------------------------------------*/
/*	Clear
/*-----------------------------------------------------------------------------------*/

function dt_clear_shortcode() {
   return '<div class="clear"></div>';
}

add_shortcode( 'dt-clear', 'dt_clear_shortcode' );



/*-----------------------------------------------------------------------------------*/
/*	Separator
/*-----------------------------------------------------------------------------------*/

function dt_separator_shortcode() {
   return '<div class="separator"></div>';
}

add_shortcode( 'dt-separator', 'dt_separator_shortcode' );



/*-----------------------------------------------------------------------------------*/
/*	Space
/*-----------------------------------------------------------------------------------*/

function dt_space_shortcode( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'height' => '60'
    ), $atts ) );
   return '<div style="clear:both; width:100%; height:'.$height.'px"></div>';
}

add_shortcode( 'dt-space', 'dt_space_shortcode' );



/*-----------------------------------------------------------------------------------*/
/*	Line Break
/*-----------------------------------------------------------------------------------*/

function dt_line_break_shortcode() {
	return '<br />';
}
add_shortcode( 'dt-br', 'dt_line_break_shortcode' );



/*-----------------------------------------------------------------------------------*/
/*	Lists
/*-----------------------------------------------------------------------------------*/

function dt_list_shortcode( $atts, $content = null )
{
	extract( shortcode_atts( array(
		'icon' => 'ok'
    ), $atts ) );
	
	return '<div class="customlist list-icon-fa-'.$icon.'">'.do_shortcode($content).'</div>';
}

add_shortcode('dt-list', 'dt_list_shortcode');


/*-----------------------------------------------------------------------------------*/
/*	Dropcaps
/*-----------------------------------------------------------------------------------*/

function dt_dropcap_shortcode( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'style' => '1',
		'text' => ''
    ), $atts ) );
	  
	return '<span class="dropcap' . $style . '">' . $text . $content .'</span>';
}

add_shortcode('dt-dropcap', 'dt_dropcap_shortcode');



/*-----------------------------------------------------------------------------------*/
/*	Highlighted text
/*-----------------------------------------------------------------------------------*/

function dt_highlighted_shortcode( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'color' => 'dark',
		'text' => ''
    ), $atts ) );
	  
	return '<span class="highlight ' . $color . '">' . $text . $content .'</span>';
}

add_shortcode('dt-highlighted', 'dt_highlighted_shortcode');



/*-----------------------------------------------------------------------------------*/
/*	Interest Tab
/*-----------------------------------------------------------------------------------*/

function dt_interest_shortcode( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'title' => '',
		'subtitle' => '',
		'link' => '#',
		'bg_color' => '#444444',
		'class' => '',
		'color_scheme' => 'light-tab'
    ), $atts ) );

	
	$output = '';
	$output .= '<a href="'.$link.'" class="dt-interest-tab '.$class.' '.$color_scheme.'" style="background-color: '.$bg_color.'">';
		$output .= '<h3>' . wp_kses_post($title).'</h3>'; 
		$output .= '<span>' . wp_kses_post($subtitle).'</span>'; 		
	$output .= '</a>';

	return $output;
}

add_shortcode('dt-interest', 'dt_interest_shortcode');


/*-----------------------------------------------------------------------------------*/
/*	Quote Shortcode
/*-----------------------------------------------------------------------------------*/

function dt_quote_shortcode( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'text' => '',
		'author' => '',
		'size' => 'small',
		'alignment' => 'left'
    ), $atts ) );

    wp_enqueue_style( 'dt-quote-font', "//fonts.googleapis.com/css?family=Droid+Serif:400italic,700italic");
	
	$output = '';
	$output .= '<div class="quote-size-'.$size.' align-'.$alignment.'">';
		$output .= '<span class="quote-author">' . esc_html($author).'</span>'; 
		$output .= '<h2 class="parallax-quote">"' . wp_kses_post($text).'"</h2>'; 		
	$output .= '</div>';

	return $output;
}

add_shortcode('dt-quote', 'dt_quote_shortcode');


/*-----------------------------------------------------------------------------------*/
/*	Process Item Shortcode
/*-----------------------------------------------------------------------------------*/

function dt_process_item_shortcode( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'title' => '',
		'symbol' => '',
		'style' => 'normal',
		'dt_animation' => '',
		'dt_animation_delay' => ''
    ), $atts ) );

    $dt_animation_delay_output = ($dt_animation_delay != '') ? 'data-wow-delay="'.$dt_animation_delay.'s"' : '';

    $allowedtags = array(
    'a' => array(
        'href' => true,
        'title' => true,
    ),
    'abbr' => array(
        'title' => true,
    ),
    'acronym' => array(
        'title' => true,
    ),
    'b' => array(),
    'blockquote' => array(
        'cite' => true,
    ),
    'cite' => array(),
    'code' => array(),
    'del' => array(
        'datetime' => true,
    ),
    'em' => array(),
    'i' => array(
    	'class' => true
    ),
    'span' => array(
    	'class' => true
    ),    
    'q' => array(
        'cite' => true,
    ),
    'strike' => array(),
    'strong' => array(),
);


	$output = '';

    if($style == 'normal') {
		$output .= '<div class="process-item-wrapper '.$style.' '.$dt_animation.'" '.$dt_animation_delay_output.'>';
		$output .= '<h3 class="process-item-title"><span class="pi-title">' . esc_html($title).'</span><span class="process-item-symbol"><span>'.wp_kses($symbol, $allowedtags).'</span></span></h3>'; 
		$output .= '<div class="process-item-content">' . do_shortcode($content).'</div>'; 
		$output .= '</div>';	
    }
    else {
		$output .= '<div class="process-item-wrapper '.$style.' '.$dt_animation.'" '.$dt_animation_delay_output.'>';
		$output .= '<span class="process-item-symbol"><span>'.wp_kses($symbol, $allowedtags).'</span></span>';
		$output .= '<h3 class="process-item-title"><span class="pi-title">' . esc_html($title).'</span></h3>'; 
		$output .= '<div class="process-item-content">' . do_shortcode($content).'</div>'; 
		$output .= '</div>';	   	
    }

	return $output;
}

add_shortcode('dt-process-item', 'dt_process_item_shortcode');




/*-----------------------------------------------------------------------------------*/
/*	Fun Fact Shortcode
/*-----------------------------------------------------------------------------------*/

function dt_funfact_shortcode( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'data_to' => '34',
		'data_speed' => '2000',
		'data_decimals' => 0,
		'funfact_text' => 'Winning Awards',
		'border_left' => 0
    ), $atts ) );
	
	wp_enqueue_script('dt-waypoints');
	wp_enqueue_script('dt-count-to');
	wp_enqueue_script('dt-custom-waypoints');

	$output = '';

	$dt_border = '';
	if($border_left == 1) {
		$dt_border = 'with-border';
	}
	else if ($border_left == 0) {
		$dt_border = 'no-border';
	}

	$output .= '<div class="counter-wrapper">'; 
		$output .= '<div class="counter-item '.$dt_border.'">'; 
			$output .= '<span class="counter-number" data-decimals="'.$data_decimals.'" data-from="1" data-to="'.$data_to.'" data-speed="'.$data_speed.'"></span>'; 
			$output .= '<span class="counter-text">'.esc_html($funfact_text).'</span>'; 
		$output .= '</div>'; 
		$output .= '<div class="clear"></div>'; 
	$output .= '</div>'; 


	return $output;
}

add_shortcode('dt-funfact', 'dt_funfact_shortcode');



/*-----------------------------------------------------------------------------------*/
/*	Section Title Shortcode
/*-----------------------------------------------------------------------------------*/

function dt_stitle_shortcode( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'title' => '',
		'subtitle' => '',
		'alignment' => ''
    ), $atts ) );
	
	$output = '';
	if($alignment == 'title-center') {
		$output .= '<div class="title-center">';
	}
	$output .= '<div class="dt-title-wrapper">';
	$output .= '<h2 class="section-title">' . wp_kses_post($title).'</h2>'; 
	if($subtitle != "") {
		$output .= '<h4 class="section-tagline">' . wp_kses_post($subtitle).'</h4>'; 
	}
	$output .= '</div>';
	if($alignment == 'title-center') {
		$output .= '</div>';
	}	

	return $output;
}

add_shortcode('dt-section-title', 'dt_stitle_shortcode');



/*-----------------------------------------------------------------------------------*/
/*	Skillbar Shortcode
/*-----------------------------------------------------------------------------------*/

function dt_skillbar_shortcode( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'values' => '90|Development',
		'units' => '%',
		'class' => ''
    ), $atts ) );

	wp_enqueue_script('dt-waypoints');
	wp_enqueue_script('dt-custom-skills');


    $dt_array_values = explode(",", $values);
	
	$output = '';

	foreach($dt_array_values as $dt_skill_value) {
		$data = explode("|", $dt_skill_value);
		$output .= '<div class="skillbar clearfix '.$class.'" data-percent="'.$data['0'] . $units.'">';
			$output .= '<div class="skillbar-title"><span>'.$data['1'].'</span></div>';
			$output .= '<div class="skillbar-bar"></div>';
		$output .= '</div>';
	}


	return $output;
}

add_shortcode('dt-skillbar', 'dt_skillbar_shortcode');



/*-----------------------------------------------------------------------------------*/
/*	Social Share Blog
/*-----------------------------------------------------------------------------------*/

function delicious_social_shortcode( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'title' => ''
    ), $atts ) );

    wp_enqueue_script('dt-social');
	  
	$output = '';
	
	$output .= '<div class="share-options align-center">';
		if(!empty($title)) { $output .= '<h6>'.esc_html($title).'</h6>'; }
		$output .= '<a href="" class="twitter-sharer" onClick="twitterSharer()"><i class="fa fa-twitter"></i></a>';
		$output .= '<a href="" class="facebook-sharer" onClick="facebookSharer()"><i class="fa fa-facebook"></i></a>';
		$output .= '<a href="" class="pinterest-sharer" onClick="pinterestSharer()"><i class="fa fa-pinterest"></i></a>';
		$output .= '<a href="" class="google-sharer" onClick="googleSharer()"><i class="fa fa-google-plus"></i></a>';
		$output .= '<a href="" class="delicious-sharer" onClick="deliciousSharer()"><i class="fa fa-share"></i></a>';
		$output .= '<a href="" class="linkedin-sharer" onClick="linkedinSharer()"><i class="fa fa-linkedin"></i></a>';
	$output .= '</div>';
	$output .= '<p></p>';
	
	return $output;
}

add_shortcode('dt-social-block', 'delicious_social_shortcode');



/*-----------------------------------------------------------------------------------*/
/*	Columns
/*-----------------------------------------------------------------------------------*/

function delicious_column_shortcode( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'size' => 'one-half',
		'text' => '',
		'position' => ''
    ), $atts ) );

	if(!empty($position)) {
		return '<div class="dt-' . $size . ' column-' . $position . '"> '.do_shortcode($content).'</div>';
	} else {
		return '<div class="dt-' . $size . '"> ' .do_shortcode($content). '</div>';
	}
}

add_shortcode('dt-column', 'delicious_column_shortcode');



/*-----------------------------------------------------------------------------------*/
/*	Pricing Table
/*-----------------------------------------------------------------------------------*/

// Pricing Table Column
function delicious_shortcode_pricing_column( $atts, $content = null ) {
	global $dt_table;
	extract(shortcode_atts(array(
		'pricing_title' => 'Basic',
		'pricing_price' => '19',
		'pricing_currency' => '$',
		'pricing_interval' => 'month',
		'pricing_tagline' => '*perfect for personal usage and testing',
		'dt_pricing_list' => '24/7 Support,Free 10GB Storage,Documentation & Tutorials,Up to 10 Projects,Up to 3 Users',
		'pricing_cta' => 'Sign Up',
		'pricing_cta_link' => '#',
		'pricing_featured' => ''
    ), $atts));

    $retour = '';

   $array_flist = explode(",", $dt_pricing_list);
	
	$output = '';

	$cta_class = ($pricing_featured == 'featured-column') ? 'featured' : 'gray';

    $retour .= '<div class="pricing-column '.$pricing_featured.'">';
	    $retour .= '<div class="pricing-header">';
	    	$retour .= '<div class="package-title">'.esc_html($pricing_title).'</div>';
	    	$retour .= '<div class="package-value">';
    			$retour .= '<span class="package-currency">'.esc_html($pricing_currency).'</span>';
    			$retour .= '<span class="package-price">'.esc_html($pricing_price).'</span>';
    			$retour .= '<span class="package-time">'.esc_html($pricing_interval).'</span>';
    			$retour .= '<span class="package-info">'.esc_html($pricing_tagline).'</span>';
    		$retour .= '</div>';
    	$retour .= '</div>';

    	$retour .= '<ul class="package-features">';
			foreach($array_flist as $flist) {
				$retour .= '<li>'. $flist.'</li>';
			}    
    	$retour .= '</ul>';

    	$retour .= '<div class="signup">';
    		$retour .= '<a href="'.esc_url($pricing_cta_link).'" class="dt-button '.$cta_class.'">'.esc_html($pricing_cta).'</a>';
    	$retour .= '</div>';    	

    $retour .= '</div>';
	
    return $retour;
	
}

add_shortcode('dt-pricing-column', 'delicious_shortcode_pricing_column');



/*-----------------------------------------------------------------------------------*/
/*	Clients Shortcode
/*-----------------------------------------------------------------------------------*/

function delicious_clients( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'images' => '',
		'title' => '',
		'links' => '',
		'thumb_size' => 'thumbnail',
		'mobile_items' => 2,
		'big_mobile_items' => 2,
		'tablet_items' => 3,
		'small_desktop_items' => 4,
		'desktop_items' => 6,
		'big_desktop_items' => 6,
		'rows' => 1,
		'speed' => 5000,
		"dt_rtl" => 'false',
		"dt_dots" => 'true'
    ), $atts ) );

		$dt_array_images = explode(",", $images);
		$dt_array_links = explode(",", $links);
		$dt_client_item = '';




		$dt_rnd_id = '';
		if(function_exists('dt_random_id')) {
			$dt_rnd_id = dt_random_id(3);   
		}
		$dt_token = wp_generate_password(5, false, false);
		
		wp_enqueue_script('dt-custom-clients');	
		wp_localize_script( 'dt-custom-clients', 'dt_clients_' . $dt_token, array( 'id' => $dt_rnd_id, 'mobile' => $mobile_items, 'big_mobile' => $big_mobile_items, 'tablet' => $tablet_items,'small_desktop' => $small_desktop_items, 'desktop' => $desktop_items, 'big_desktop' => $big_desktop_items, 'clients_speed' => $speed, 'dt_dots' => $dt_dots, 'dt_rtl' => $dt_rtl) );		

		$dt_client_item .= '<div class="clients-carousel">';
		if(!empty($title)) { 
			$dt_client_item .= '<h2>'.esc_html($title).'</h2>';
		}
		$dt_client_item .= '<div id="owl-clients-'.$dt_rnd_id.'" class="owl-carousel carousel-clients" data-token="' . $dt_token .'">';
		
			$i = 0;
			foreach (array_chunk($dt_array_images, $rows, true) as $array)
			{	
				$dt_client_item .= '<div class="clients-bulk">';
				foreach($array as $single_image) {

					$dt_img_size = '';
					if (function_exists('wpb_getImageBySize')) {
						$dt_img_size = wpb_getImageBySize(array('attach_id' => (int)$single_image, 'thumb_size' => $thumb_size));
					}				

					$dt_client_link = ($dt_array_links['0'] != '') ? $dt_array_links[$i] : '#' ;

					$dt_client_item .='<div class="client-item">';
								$dt_client_item .='<a target="_blank" href="'.esc_url($dt_client_link).'">';
								$dt_client_item .= $dt_img_size['thumbnail'];
								$dt_client_item .='</a>';
					$dt_client_item .='</div>';

					$i++;
				}
				$dt_client_item .= '</div>';
			}
		$dt_client_item .= '</div>'; 
		$dt_client_item .= '</div>'; 
	
	return $dt_client_item;
	
}

add_shortcode('dt-clients', 'delicious_clients');


/*-----------------------------------------------------------------------------------*/
/*	Portfolio Grid Shortcode
/*-----------------------------------------------------------------------------------*/

function delicious_portfolio_grid($atts, $content = null) {
	extract(shortcode_atts(array(
		"grid_title" => "",
		"grid_meta_alignment" => "align-center",
		"dt_grid_style" => "portfolio-layout-regular",
		"dt_columns" => "3",
		"dt_caption_style" => "text-under-thumbnail",
		"dt_on_style" => "style-1",
		"dt_gap" => "15",
		"number" => "-1",
		"categories" => "",
		"cat_trigger" => "",
		"cat_trigger_state" => "",
		"cat_trigger_keyword" => "Filter",
		"distyle" => "all",
		"dt_load_more" => "Load More +",
		"dt_loading" => "Loading...",
		"dt_infinite_loader" => "Loading...",
		"dt_no_projects_left" => "No more projects to show",
		"allword" => "All",
		"initial_word" => "",
		"dt_orderby"	=> "date",
		"dt_order"	=> "DESC",
		"hide_filters" => "",
		"allbam" => ""
	), $atts));
	
	global $post;
	$dt_data = delicious_del_data();
	
	//setting a random id
	$dt_rnd_id = '';
	$dt_rnd_id2 = '';
	if(function_exists('dt_random_id')) {
		$dt_rnd_id = dt_random_id(3);   
	}

	$dt_token = wp_generate_password(5, false, false);
	
	wp_enqueue_script('isotope');	
	if($distyle != "all") {
		wp_enqueue_script('dt-ias');
		wp_localize_script( 'dt-ias', 'dt_ias', array( 'dt_loading' => $dt_loading));	
	}
		
	wp_enqueue_script('dt-custom-isotope-portfolio');
	
	wp_localize_script( 'dt-custom-isotope-portfolio', 'dt_grid_' .$dt_token, array( 'id' => $dt_rnd_id, 'initial_word' => $initial_word, 'distyle' => $distyle, 'dt_load_more' => $dt_load_more, 'dt_infinite_loader' => $dt_infinite_loader, 'dt_no_projects_left' => $dt_no_projects_left, 'cat_trigger' => $cat_trigger));	
			
		$dt_cats = explode(",", $categories);
		
	if ( post_type_exists( 'portfolio' ) ) {		
		$dt_portfolio_categs = get_terms('portfolio_cats', array('hide_empty' => false));
		$dt_categ_list = '';

		foreach ($dt_cats as $categ) {
			foreach($dt_portfolio_categs as $portfolio_categ) {
				if($categ === $portfolio_categ->name) {
					$dt_categ_list .= $portfolio_categ->slug . ', ';
				}
			}
		}
			
		//fallback categories
			$args = array(
				'post_type'=>'portfolio',
				'taxonomy' => 'portfolio_cats'
			);		
			$dt_categ_fall = get_categories( $args );
			$dt_categ_use = array();
			$i = 0;
			foreach($dt_categ_fall as $cate) {
				$dt_categ_use[$i] = $cate->name; 
				$i++;
			}
			$dt_cats = array_filter($dt_cats);
			if(empty($dt_cats)) {
				$dt_cats = array_merge($dt_cats, $dt_categ_use);
			}			
			
			
			$dt_term_list = '';
			$dt_list = '';
			
			foreach ($dt_cats as $dt_cat) {
				$to_replace = array(' ', '/', '&');
				$intermediate_replace = strtolower(str_replace($to_replace, '-', $dt_cat));
				$str = preg_replace('/--+/', '-', $intermediate_replace);
				if (function_exists('icl_t')) { 
				$dt_term_list .= '<li><a data-filter=".'. delicious_get_taxonomy_cat_ID($dt_cat) .'">' . icl_t('Portfolio Category', 'Term '.delicious_get_taxonomy_cat_ID( $dt_cat ).'', $dt_cat) . '</a></li>';
				}
				else 
				$dt_term_list .= '<li><a data-filter=".'. delicious_get_taxonomy_cat_ID($dt_cat) .'">' . esc_html($dt_cat) . '</a></li>';
				$dt_list .= $dt_cat . ', ';
			}		
			
		
		$output = '';
			$output .= '<section class="delicious-grid '.$cat_trigger.' trigger-'.$cat_trigger_state.'" id="gridwrapper_'.$dt_rnd_id.'" data-token="' . $dt_token .'">';
				$output .= '<div class="grid-meta '.esc_attr($grid_meta_alignment).'">';
				if($grid_title != "") {
					$output .= '<h2 class="grid-title">'.esc_html($grid_title).'</h2>';
				}
				if($cat_trigger != "") { 
					$output .= '<a class="cat-trigger '.$cat_trigger_state.'">'.esc_html($cat_trigger_keyword).'</a>';
				}
				$output .= '<section id="filter_options" class="centered-wrapper '.$hide_filters.'">';
						$output .= '<ul id="filters" class="option-set clearfix" data-option-key="filter">';
							if($allbam == "") { 
								$output .= '<li class="all-projects"><a data-filter="*" class="selected">'.$allword.'</a></li>';
								$output .= $dt_term_list;
							}
							else {
								$output .= $dt_term_list;	
								$output .= '<li class="all-projects"><a data-filter="*" class="selected">'.$allword.'</a></li>';						
							}
						$output .= '</ul>';
					$output .= '</section>';
				$output .= '</div>';
				$output .= '<div class="half-space"></div>';
				
				$clout = '';
				if(($dt_grid_style == 'portfolio-layout-regular') || ($dt_grid_style == 'portfolio-layout-masonry') || ($dt_grid_style == 'portfolio-layout-horizontal-masonry')) {
					$clout = 'dt-gap-'.$dt_gap.' grid isotope grid-columns-'.$dt_columns.' ';
				}

				$output .= '<section id="portfolio-wrapper">';
					$output .= '<ul class="portfolio '.$clout.' style-'.$distyle.' mfp-gallery grid_'.$dt_rnd_id.' '.$dt_grid_style.'">';

				$icount = 0;

				if($distyle != "all") {
					//pagination
					if ( get_query_var('paged') ) {
						$paged = get_query_var('paged');

					} elseif ( get_query_var('page') ) {
						$paged = get_query_var('page');

					} else {
						$paged = 1;
					}			
					$portf_grid_args = array(
						'post_type'=>'portfolio',
						'posts_per_page' => $number,
						'paged' => $paged,
						'term' => 'portfolio_cats',
						'orderby' => $dt_orderby,
						'order'   => $dt_order,
						'portfolio_cats' => $dt_categ_list
					);
				}

				else {
					$portf_grid_args = array(
						'post_type'=>'portfolio',
						'posts_per_page' => $number,
						'term' => 'portfolio_cats',
						'orderby' => $dt_orderby,
						'order'   => $dt_order,
						'portfolio_cats' => $dt_categ_list
					);					
				}
					
					$portf_grid_query = new WP_Query($portf_grid_args);
					if( $portf_grid_query->have_posts() ) {
						while ($portf_grid_query->have_posts()) : $portf_grid_query->the_post();

						$icount++;

						$dt_terms = get_the_terms( get_the_ID(), 'portfolio_cats' );
						$dt_term_val = '';
						if($dt_terms) { foreach ($dt_terms as $term) { $dt_term_val .=delicious_get_taxonomy_cat_ID($term->name) .' '; } }
						
						$dt_portf_icon = get_post_meta($post->ID,'stag_portf_icon',true);						
						$dt_portf_thumbnail = get_post_meta($post->ID,'stag_portf_thumbnail',true);	
						$dt_portf_link = get_post_meta($post->ID,'stag_portf_link',true);
						$dt_portf_video = get_post_meta($post->ID,'stag_portf_video',true);

						
						if(class_exists('RW_Meta_Box')) {
							$dt_lgal = rwmb_meta( 'stag_portf_gallery', 'type=image_advanced&size=full', $post->ID );
						}
						$dt_gal_output = '';
						if(!empty($dt_lgal)) { 
							$dt_gal_output .= '<div class="dt-single-gallery">';
							
							foreach($dt_lgal as $dt_gal_item) {
								$dt_gal_output .= '<a href="'.esc_url($dt_gal_item['url']).'" title="'.esc_attr($dt_gal_item['title']).'"></a>';
							}
							$dt_gal_output .= '</div>';
						}

						$dt_thumb_id = get_post_thumbnail_id($post->ID);
						$dt_alt = get_post_meta($dt_thumb_id, '_wp_attachment_image_alt', true);

						$dt_image_url = wp_get_attachment_url($dt_thumb_id);
						
						$dt_grid_thumbnail = $dt_image_url;
						$dt_item_class = 'item-small';

						if($dt_grid_style === 'portfolio-layout-horizontal-masonry') {
							switch ($dt_portf_thumbnail) {
								case 'landscape':
									$dt_grid_thumbnail = aq_resize($dt_image_url, 640 - $dt_gap , 400 - $dt_gap, true, true, true);
									$dt_item_class = 'item-wide';
									break;
								case 'portrait':
										$dt_grid_thumbnail = aq_resize($dt_image_url, 320 - ($dt_gap / 2), 400 + ($dt_gap / 2), true, true, true);
									$dt_item_class = 'item-small';
									break;								
							}
						}			

						else if(($dt_grid_style === 'portfolio-layout-masonry') || ($dt_grid_style === 'portfolio-layout-parallax')) {		
						
							switch ($dt_portf_thumbnail) {
								case 'landscape':
									$dt_grid_thumbnail = aq_resize($dt_image_url, 640, 480, true, true, true);
									$dt_item_class = 'item-wide';
									break;
								case 'portrait':
									$dt_grid_thumbnail = aq_resize($dt_image_url, 640, 853, true, true, true);
									$dt_item_class = 'item-small';
									break;								
							}		
						}
						else if($dt_grid_style === 'portfolio-layout-mosaic') {
							$dt_grid_thumbnail = aq_resize($dt_image_url, 640, 395, true, true, true);
						}
						else {
							$dt_grid_thumbnail = aq_resize($dt_image_url, 640, 480, true, true, true);
						}

						$dt_copy = $dt_terms;
						$dt_res = '';
						if($dt_terms) {
							foreach ( $dt_terms as $term ) {
								if (function_exists('icl_t')) { 
									$dt_res .= icl_t('Portfolio Category', 'Term '.delicious_get_taxonomy_cat_ID( $term->name ).'', $term->name);
								}
								else $dt_res .= $term->name;
								if (next($dt_copy )) {
									$dt_res .=  ', ';
								}
							}
						}		

						// lazyload replacement
						$dt_lazyrep = '';
						if(isset($dt_data['lazyload']) && ($dt_data['lazyload'] =='1')) {
							$dt_lazyrep = 'class="lazy" data-original';
						}
						else {
							$dt_lazyrep = 'src';
						}

					if(($dt_grid_style == 'portfolio-layout-regular') || ($dt_grid_style == 'portfolio-layout-masonry') || ($dt_grid_style == 'portfolio-layout-horizontal-masonry')) {

						$output .= '<li class="wow fadeInUp grid-item dt-project-'.$post->ID.' '.$dt_term_val.' '.$dt_item_class.' '.$dt_caption_style.'">';

						switch ($dt_caption_style) {
							case 'text-under-thumbnail':

								$inner_output = '';
								$inner_output .= '<div class="grid-item-on-hover">';
									$inner_output .= '<div class="grid-text">';
									if($dt_portf_icon == 'link_to_link') {
										$inner_output .= '<h3><a href="'.esc_url($dt_portf_link).'">'.get_the_title().'</a></h3>';
									} else {
										$inner_output .= '<h3><a href="'.get_the_permalink().'">'.get_the_title().'</a></h3>';
									}
									$inner_output .= '<div class="grid-item-cat">';	
										$inner_output .= $dt_res;
									$inner_output	.='</div>';
									$inner_output .= '</div>';
								$inner_output .= '</div>';										
								
								$test_link = '';
								if($dt_portf_icon == 'link_to_page') {
									$test_link = '<a class="img-anchor" href="'.get_permalink($post->ID).'">';
									$test_link .= '<div class="project-hover"><i class="fa fa-external-link"></i></div>';
									$test_link .= '<img '.$dt_lazyrep.'="'. esc_url($dt_grid_thumbnail).'" alt="'.esc_attr($dt_alt).'" />';
									$test_link .='</a>';
								} else if($dt_portf_icon == 'link_to_link') {
									$test_link = '<a class="img-anchor" href="'.esc_url($dt_portf_link).'">';
									$test_link .= '<div class="project-hover"><i class="fa fa-external-link"></i></div>';
									$test_link .= '<img '.$dt_lazyrep.'="'. esc_url($dt_grid_thumbnail).'" alt="'.esc_attr($dt_alt).'" />';
									$test_link .='</a>';									
								}
								else if($dt_portf_icon == 'lightbox_to_image') {
									$test_link = '<a class="img-anchor not-link dt-lightbox-gallery mfp-image" href="'. esc_url(wp_get_attachment_url($dt_thumb_id)) .'">';
									$test_link .= '<div class="project-hover"><i class="fa fa-search"></i></div>';
									$test_link .= '<img '.$dt_lazyrep.'="'. esc_url($dt_grid_thumbnail).'" alt="'.esc_attr($dt_alt).'" />';
									$test_link .='</a>';									
								}
								else if($dt_portf_icon == 'lightbox_to_video') {
									$test_link = '<a class="img-anchor not-link dt-lightbox-gallery mfp-iframe" href="'. esc_url($dt_portf_video) .'">';
									$test_link .= '<div class="project-hover"><i class="fa fa-play-circle"></i></div>';
									$test_link .= '<img '.$dt_lazyrep.'="'. esc_url($dt_grid_thumbnail).'" alt="'.esc_attr($dt_alt).'" />';
									$test_link .='</a>';									
								} 	
								else if ($dt_portf_icon == 'lightbox_to_gallery') {  $test_link = '<a class="not-link img-anchor dt-gallery-trigger" title="'. get_post($dt_thumb_id)->post_excerpt .'" >';
									$test_link .= '<div class="project-hover"><i class="fa fa-picture-o"></i></div>';
									$test_link .= '<img '.$dt_lazyrep.'="'. esc_url($dt_grid_thumbnail).'" alt="'.esc_attr($dt_alt).'" />';
									$test_link .='</a>' . $dt_gal_output; }														
								
								$output .= $test_link;
								$output .= $inner_output;

								break;

								
							case 'text-on-thumbnail':

								$inner_output = '';
								$inner_output .= '<img '.$dt_lazyrep.'="'. esc_url($dt_grid_thumbnail).'" alt="'.esc_attr($dt_alt).'" />';
								$inner_output .= '<div class="grid-item-on-hover '.$dt_on_style.'">';
									$inner_output .= '<div class="grid-text">';
										$inner_output .= '<h3>'.get_the_title().'</h3>';
									$inner_output .= '<div class="grid-item-cat">';	
										$inner_output .= $dt_res;
									$inner_output	.='</div>';
									$inner_output .= '</div>';
								$inner_output .= '</div>';										
								
								$test_link = '';
								if($dt_portf_icon == 'link_to_page') {
										$test_link = '<a class="img-anchor" href="'.get_permalink($post->ID).'">'.$inner_output.'</a>';
								} else if($dt_portf_icon == 'link_to_link') {
									$test_link = '<a class="img-anchor" href="'.esc_url($dt_portf_link).'">'.$inner_output.'</a>';
								}
								else if($dt_portf_icon == 'lightbox_to_image') {
									$test_link = '<a href="'. esc_url(wp_get_attachment_url($dt_thumb_id)) .'" class="img-anchor not-link dt-lightbox-gallery mfp-image" title="'. get_the_title() .'">'.$inner_output.'</a>';
								}
								else if($dt_portf_icon == 'lightbox_to_video') {
									$test_link = '<a href="'. esc_url($dt_portf_video) .'" class="not-link img-anchor dt-lightbox-gallery mfp-iframe" title="'. get_the_title() .'">'.$inner_output.'</a>';
								} 	
								else if ($dt_portf_icon == 'lightbox_to_gallery') {  $test_link = '<a class="not-link img-anchor dt-gallery-trigger" title="'. get_post($dt_thumb_id)->post_excerpt .'" >'.$inner_output.'</a>' . $dt_gal_output; }														
								
								$output .= $test_link;

								break;						
						}	
			
						$output .= '</li>';

					}

					else {

						$is_parallax = '';
						if($dt_grid_style == 'portfolio-layout-parallax') {
							$is_parallax = 'is-parallax';
						}

						$output .= '<li class="wow count-'.$icount.' '.$is_parallax.' fadeInUp grid-item dt-project-'.$post->ID.' '.$dt_term_val.' '.$dt_item_class.' isotope-visible">';

						if(class_exists('RW_Meta_Box')) {
							$dt_small_pr_description = rwmb_meta( 'stag_small_pr_description');
						}						


						$inner_output = '';
						$inner_output .= '<div class="dt-awesome-project">';
						$inner_output .= '<div class="dt-box-stripes"></div>';
							$inner_output .= '<div class="dt-awesome-project-inner">';
								$inner_output .= '<div class="grid-awesome-text">';
								if($dt_portf_icon == 'link_to_link') {
									$inner_output .= '<h3><a href="'.esc_url($dt_portf_link).'">'.get_the_title().'</a></h3>';
								} else {
									$inner_output .= '<h3><a href="'.get_the_permalink().'">'.get_the_title().'</a></h3>';
								}
								$inner_output .= '<div class="grid-awesome-desc">'.$dt_small_pr_description.'</div>';										
								$inner_output .= '<div class="grid-item-awesome-cat">';	
									$inner_output .= $dt_res;
								$inner_output	.='</div>';
								$inner_output .= '</div>';
							$inner_output .= '</div>';
						$inner_output .= '</div>';										
						
						$test_link = '';
						if($dt_portf_icon == 'link_to_page') {
							$test_link = '<a class="img-anchor" href="'.get_permalink($post->ID).'">';
							$test_link .= '<div class="project-hover"><i class="fa fa-external-link"></i></div>';
							$test_link .= '<img '.$dt_lazyrep.'="'. esc_url($dt_grid_thumbnail).'" alt="'.esc_attr($dt_alt).'" />';
							$test_link .='</a>';
						} else if($dt_portf_icon == 'link_to_link') {
							$test_link = '<a class="img-anchor" href="'.esc_url($dt_portf_link).'">';
							$test_link .= '<div class="project-hover"><i class="fa fa-external-link"></i></div>';
							$test_link .= '<img '.$dt_lazyrep.'="'. esc_url($dt_grid_thumbnail).'" alt="'.esc_attr($dt_alt).'" />';
							$test_link .='</a>';									
						}
						else if($dt_portf_icon == 'lightbox_to_image') {
							$test_link = '<a class="img-anchor not-link dt-lightbox-gallery mfp-image" href="'. esc_url(wp_get_attachment_url($dt_thumb_id)) .'">';
							$test_link .= '<div class="project-hover"><i class="fa fa-search"></i></div>';
							$test_link .= '<img '.$dt_lazyrep.'="'. esc_url($dt_grid_thumbnail).'" alt="'.esc_attr($dt_alt).'" />';
							$test_link .='</a>';									
						}
						else if($dt_portf_icon == 'lightbox_to_video') {
							$test_link = '<a class="img-anchor not-link dt-lightbox-gallery mfp-iframe" href="'. esc_url($dt_portf_video) .'">';
							$test_link .= '<div class="project-hover"><i class="fa fa-play-circle"></i></div>';
							$test_link .= '<img '.$dt_lazyrep.'="'. esc_url($dt_grid_thumbnail).'" alt="'.esc_attr($dt_alt).'" />';
							$test_link .='</a>';									
						} 	
						else if ($dt_portf_icon == 'lightbox_to_gallery') {  $test_link = '<a class="not-link img-anchor dt-gallery-trigger" title="'. get_post($dt_thumb_id)->post_excerpt .'" >';
							$test_link .= '<div class="project-hover"><i class="fa fa-picture-o"></i></div>';
							$test_link .= '<img '.$dt_lazyrep.'="'. esc_url($dt_grid_thumbnail).'" alt="'.esc_attr($dt_alt).'" />';
							$test_link .='</a>' . $dt_gal_output; }														
						
						$output .= $test_link;
						$output .= $inner_output;

			
						$output .= '</li>';													
					}

					endwhile; 
					}

					$output .= '</ul>';

				$output .= '</section>';
			
				if($distyle != "all") {
					$paginated_args = array('query' => $portf_grid_query);
					$output .= delicious_get_paginated_numbers( $paginated_args );
				}

					wp_reset_postdata(); 
		$output .= '</section>';

		return $output;
	}
}

add_shortcode("dt-portfolio-grid", "delicious_portfolio_grid");	




/*-----------------------------------------------------------------------------------*/
/*	Blog Carousel Shortcode
/*-----------------------------------------------------------------------------------*/

function delicious_blog_grid($atts, $content = null) {
	extract(shortcode_atts(array(
		"number" => "6", 
		"columns" => "",
		"categories" => "",
		"dt_rtl" => "false"
		
	), $atts));
	
	global $post;

	$blog_class = 'on-three-columns';	
	
	if($columns === '2') {
		$blog_class = 'on-two-columns';
	} else
	if($columns === '3') {
		$blog_class = 'on-three-columns';
	}
	else
	if($columns === '1') {
		$blog_class = 'on-one-column';
	}	


	$dt_rnd_id = '';
	if(function_exists('dt_random_id')) {
		$dt_rnd_id = dt_random_id(3);   
	}
	$dt_token = wp_generate_password(5, false, false);

	wp_enqueue_script('dt-custom-blog-carousel');	
	wp_localize_script( 'dt-custom-blog-carousel', 'dt_bc_' . $dt_token, array( 'id' => $dt_rnd_id, 'columns' => $columns, "dt_rtl" => $dt_rtl) );		
	
	$output = '';
		$blog_array_cats = get_terms('category', array('hide_empty' => false));
		if(empty($categories)) {
			foreach($blog_array_cats as $blog__array_cat) {
				if (function_exists('icl_t')) { 
					$blog__array_cat->slug = str_replace('-'.ICL_LANGUAGE_CODE, NULL, $blog__array_cat->slug);
				}				
				$categories .= $blog__array_cat->slug .', ';
			}
		}
		
		$args = array(
			'orderby'=> 'post_date',
			'order' => 'date',
			'post_type' => 'post',
			'category_name' => $categories,
			'posts_per_page' => $number
		);
		
		$dt_blog_grid_query = new WP_Query($args);
		if( $dt_blog_grid_query->have_posts() ) {
		
			$output .= '<div class="dt-blog-shortcode">';
				$output .= '<section id="owl-blog-carousel-'.$dt_rnd_id.'" class="dt-blog-carousel owl-carousel '. $blog_class.' " data-token="' . $dt_token .'">';	
		
				while ($dt_blog_grid_query->have_posts()) : $dt_blog_grid_query->the_post();
			
					ob_start();  
					get_template_part( 'template-parts/content-blog-shortcode' );
					$result = ob_get_contents();  
					ob_end_clean();
					$output .= $result;
			
				endwhile; 
			
				$output .= '</section>';
			$output .= '</div>';	
			}
		wp_reset_postdata(); 
	return $output;
}

add_shortcode("dt-blog-grid", "delicious_blog_grid");	




/*-----------------------------------------------------------------------------------*/
/*	Text with Icon
/*-----------------------------------------------------------------------------------*/

function delicious_text_with_icon( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'align' => 'left',
		'media_type' => 'icon-type',
		'dicon' 	=> 'fa-camera',
		'img'	=> '',
		'istyle' => 'bold',
		'ishape' => 'square',
		'title' => 'Awesome Title',
		'tbold' => '',
		'dt_animation' => '',
		'dt_animation_delay' => ''
    ), $atts ) );

	$dt_animation_delay_output = ($dt_animation_delay != '') ? 'data-wow-delay="'.$dt_animation_delay.'s"' : '';	    

    $title_bold = ($tbold != '') ? 'bold-title' : '';

	$calign = '';
	if($align == 'left')   { $calign = 'content-left';}
	else if($align == 'center') { $calign = 'content-center';}
	else if($align == 'right')  { $calign = 'content-right';}

	$cstyle  = '';
	if($istyle == 'bold') { $cstyle = 'bold-fill';}	
	else if($istyle == 'thin')   { $cstyle = 'thin-fill';}
	else if($istyle == 'free')  { $cstyle = 'no-fill';}

	$icon_format = '';
	if(substr( $dicon, 0, 3 ) === "fa-") {
		$icon_format = '<i class="fa '.esc_attr($dicon).'"></i>';
	}
	else {
		$icon_format = '<span class="'.esc_attr($dicon).'"></span>';
	}

	$output = '';
	$output .= '<div class="dt-service-elem '.$calign.' '.$ishape.' '. $cstyle.' '.$dt_animation.'" '.$dt_animation_delay_output.'>';
		$output .= '<div class="dt-service-icon">';
			if($media_type == 'icon-type') { $output .= $icon_format; }
			else 
			if($media_type == 'img-type') { 
				$img_val = '';
				if (function_exists('wpb_getImageBySize')) {
					$img_val = wpb_getImageBySize(array('attach_id' => (int)$img, 'thumb_size' => 'full'));
				}				

				$output .= $img_val['thumbnail']; 
			}
		$output .= '</div>';
	
		$output .= '<div class="dt-service-content">';
			if($title != '') {
				$output .= '<h4 class="dt-service-title '.$title_bold.'">'.wp_kses_post($title).'</h4>';
			}
			if(!empty($content)) {
				$output .= '<p>'.do_shortcode($content).'</p>';
			}
		$output .= '</div>';
	
	$output .= '</div>';
	return $output;

}

add_shortcode('dt-text-icon', 'delicious_text_with_icon');



/*-----------------------------------------------------------------------------------*/
/*	Team Member
/*-----------------------------------------------------------------------------------*/

function delicious_member($atts, $content = null) {
	extract(shortcode_atts(array(
		"style" => "normal",
		"member_thumbnail" => "",
		"member_thumb_size" => 'dt-member-thumb',
		"member_title" => "",
		"member_position" => "",
		"member_mail" => "",
		"member_twitter" => "",
		"member_facebook" => "",
		"member_linkedin" => "",
		"member_google" => "",
		"member_pinterest" => "",
		"member_instagram" => "",
		"member_custom" => "",
	), $atts));

	$retour = '';

	$retour_info = '';
	$retour_social = '';
	$dt_img_size = '';
	if (function_exists('wpb_getImageBySize')) {
		$dt_img_size = wpb_getImageBySize(array('attach_id' => (int)$member_thumbnail, 'thumb_size' => $member_thumb_size));
	}

	$retour_info .='<div class="member-meta">';
		$retour_info .= '<h4>'.esc_html($member_title).'</h4>';
		$retour_info .= '<span>'.esc_html($member_position).'</span>';
	$retour_info .='</div>';	

	$retour_social .='<div class="member-social">';
		$retour_social .='<ul>';
			if($member_twitter != '') { 
				$retour_social .='<li><a target="_blank" href="'.esc_url($member_twitter).'"><i class="fa fa-twitter"></i></a></li>'; }
			if($member_facebook != '') { 
				$retour_social .='<li><a target="_blank" href="'.esc_url($member_facebook).'"><i class="fa fa-facebook"></i></a></li>'; }
			if($member_linkedin != '') { 
			$retour_social .='<li><a target="_blank" href="'.esc_url($member_linkedin).'"><i class="fa fa-linkedin"></i></a></li>'; }
			if($member_google != '') { 
			$retour_social .='<li><a target="_blank" href="'.esc_url($member_google).'"><i class="fa fa-google-plus"></i></a></li>'; }
			if($member_pinterest != '') { 
			$retour_social .='<li><a target="_blank" href="'.esc_url($member_pinterest).'"><i class="fa fa-pinterest"></i></a></li>'; }
			if($member_instagram != '') { 
			$retour_social .='<li><a target="_blank" href="'.esc_url($member_instagram).'"><i class="fa fa-instagram"></i></a></li>'; }
			if($member_mail != '') { 
			$retour_social .='<li><a target="_blank" href="mailto:'.is_email($member_mail).'"><i class="fa fa-envelope-o"></i></a></li>'; }
			if($member_custom != '') { 
			$retour_social .='<li><a target="_blank" href="'.esc_url($member_custom).'"><i class="fa fa-external-link"></i></a></li>'; }
		$retour_social .='</ul>';	
	$retour_social .='</div>';		


	if($style == 'normal') {
		$retour .= '<div class="member-wrapper '.esc_attr($style).'">';
			$retour .= '<div class="thumbnail-wrapper">';
				$retour .= $dt_img_size['thumbnail'];
			$retour .= '</div>';

			$retour .= '<div class="member-info">';

			$retour .= $retour_info;

			$retour .= $retour_social;

			$retour .= '</div>';
		$retour .= '</div>';
	}
	else {
		$retour .= '<div class="member-wrapper '.esc_attr($style).'">';
			$retour .= '<div class="thumbnail-wrapper">';
				$retour .= $dt_img_size['thumbnail'];
				$retour .= '<div class="member-info">';
				$retour .= $retour_social;
			$retour .= '</div>';				
			$retour .= '</div>';

			$retour .= $retour_info;

		$retour .= '</div>';		
	}

	return $retour;
}
add_shortcode("dt-team-member", "delicious_member");

/*-----------------------------------------------------------------------------------*/
/*	Hexagons Wrapper
/*-----------------------------------------------------------------------------------*/

function delicious_hexagons($atts, $content = null) {
	extract(shortcode_atts(array(), $atts));

	$output = '';
	$output .= '<div class="hexagons-wrapper container">';
		$output .= do_shortcode($content);
	$output .= '</div>';
	return $output;
}
add_shortcode("dt_hexagons", "delicious_hexagons");

/*-----------------------------------------------------------------------------------*/
/*	Hexagon Item
/*-----------------------------------------------------------------------------------*/

function delicious_hexagon($atts, $content = null) {
	extract(shortcode_atts(array(
		"icon" => '',
		"tooltip_text" => '',
		"link"	=> '',
		"vertical_position" => '0',
		"dt_animation" => '',
		"dt_animation_delay" => ''		
	), $atts));

	$dt_animation_delay_output = ($dt_animation_delay != '') ? 'data-wow-delay="'.$dt_animation_delay.'s"' : '';	

	$icon_format = '';
	if(substr( $icon, 0, 3 ) === "fa-") {
		$icon_format = '<i class="fa '.esc_attr($icon).'"></i>';
	}
	else {
		$icon_format = '<span class="'.esc_attr($icon).'"></span>';
	}	

	$link_output = ($link != '') ? '<a href="'.esc_url($link).'">'.$icon_format.'</a>' : $icon_format ;

	$retour ='';
	
	$retour .='<div class="dt-hexagon-container '.$dt_animation.'" '.$dt_animation_delay_output.' style="margin-top: calc(55px + '.esc_attr($vertical_position).'px);">';
		$retour .= '<div class="dt-hexagon" title="'.esc_attr($tooltip_text).'">'.$link_output.'</div>';
	$retour .='</div>';

	return $retour;
}

add_shortcode("dt_hexagon", "delicious_hexagon");



/*-----------------------------------------------------------------------------------*/
/*	Testimonials Wrapper
/*-----------------------------------------------------------------------------------*/

function delicious_testimonials_slider($atts, $content = null) {
	extract(shortcode_atts(array(
		"speed" => '',
		"dt_alignment" => 'testimonials-center',
		"dt_rtl" => 'false'
	), $atts));

	$dt_rnd_id = '';
	if(function_exists('dt_random_id')) {
		$dt_rnd_id = dt_random_id(3);   
	}
	$dt_token = wp_generate_password(5, false, false);
	
	wp_enqueue_script('dt-custom-testimonials');	
	wp_localize_script( 'dt-custom-testimonials', 'dt_testimonials_' . $dt_token, array( 'id' => $dt_rnd_id, 'testimonial_speed' => $speed, "dt_rtl" => $dt_rtl) );		

	$output = '';
	$output .= '<div class="testimonials-carousel '.$dt_alignment.'">';
		$output .= '<div id="owl-testimonials-'.$dt_rnd_id.'" class="owl-carousel testimonials-slider" data-token="' . $dt_token .'">';

		$output .= do_shortcode($content);
	
		$output .= '</div>';
	$output .= '</div>';
	return $output;
}
add_shortcode("dt_testimonials_slider", "delicious_testimonials_slider");

/*-----------------------------------------------------------------------------------*/
/*	Testimonial Item
/*-----------------------------------------------------------------------------------*/

function delicious_testimonials($atts, $content = null) {
	extract(shortcode_atts(array(
		"client_name" => '',
		"client_company" => ''
	), $atts));

	$retour ='';
	
	$retour .='<div class="testimonial-item">';
	$retour .='<p>'.do_shortcode($content).'</p>';
	$retour .='<span class="line-separator"></span>';
	$retour .='<p>';
	$retour .='<span class="testimonial-name">'.esc_html($client_name).'</span><em>,</em> <span class="testimonial-position">'.esc_html($client_company).'</span>';
	$retour .='</p>';
	$retour .='</div>';

	return $retour;
}

add_shortcode("dt_testimonial", "delicious_testimonials");



/*-----------------------------------------------------------------------------------*/
/*	Process Tabs
/*-----------------------------------------------------------------------------------*/

function delicious_process_tabs($atts, $content = null) {
	extract(shortcode_atts(array(
		"css_class" => '',
	), $atts));

	global $ptab_content;

	$output = '';
	$output .= '<div class="dt-process-tabs '.$css_class.'">';
		$output .= '<ul class="dt-tabs">'.do_shortcode($content).'</ul>';
		$output .= $ptab_content;
	$output .= '</div>';
	return $output;
}
add_shortcode("dt_process_tabs", "delicious_process_tabs");



/*-----------------------------------------------------------------------------------*/
/*	Service Item
/*-----------------------------------------------------------------------------------*/

function delicious_process_tab($atts, $content = null) {

	global $ptab_content;

	extract(shortcode_atts(array(
		"tab_order_no" => '',
		"id" => '',
		"tab_title" => '',
		"process_title" => '',
		"current" => ''

	), $atts));


    if(empty($id))
        $id = 'tab-'.rand(100,999);	

	$output ='';
	$output .= '<li class="dt-tab-link '.$current.' tab-no-'.$tab_order_no.'" data-tab="'.$id.'"><span class="dt-tab-count">'.$tab_order_no.'</span><span class="dt-tab-title">'.$tab_title.'</span></li>';


	$ptab_content .= '<div id="'.$id.'" class="dt-tab-content '.$current.' tab-no-'.$tab_order_no.'">';
		$ptab_content .= '<h2>'.$process_title.'</h2>';
		$ptab_content .= do_shortcode($content) .'<span class="dt-tab-content-no animated fadeInUp">'.$tab_order_no.'</span>';
	$ptab_content .= '</div>';

	return $output;
}

add_shortcode("dt_process_tab", "delicious_process_tab");


/*-----------------------------------------------------------------------------------*/
/*	Services Grid
/*-----------------------------------------------------------------------------------*/

function delicious_services_grid($atts, $content = null) {
	extract(shortcode_atts(array(
		"items_per_row" => '',
		"css_class" => '',
	), $atts));


	$output = '';
	$output .= '<div class="dt-services-grid serv-cols-'.$items_per_row.' '.$css_class.'">';
		$output .= do_shortcode($content);
	$output .= '</div>';
	return $output;
}
add_shortcode("dt_services_grid", "delicious_services_grid");



/*-----------------------------------------------------------------------------------*/
/*	Service Item
/*-----------------------------------------------------------------------------------*/

function delicious_service($atts, $content = null) {
	extract(shortcode_atts(array(
		"title" => '',
		"media_type" => 'icon-type',
		"dicon" => 'fa-camera',
		"img" => ''

	), $atts));

	$output ='';

	$icon_format = '';
	if(substr( $dicon, 0, 3 ) === "fa-") {
		$icon_format = '<i class="fa '.$dicon.'"></i>';
	}
	else {
		$icon_format = '<span class="'.$dicon.'"></span>';
	}	

	$output .= '<div class="delicious-service">';

		//hover
		$output .= '<div class="delicious-service-hover">';
		$output .= '<div class="delicious-service-icon-hover">';
			if($media_type == 'icon-type') { $output .= $icon_format; }
			else 
			if($media_type == 'img-type') { 
				$img_val = '';
				if (function_exists('wpb_getImageBySize')) {
					$img_val = wpb_getImageBySize(array('attach_id' => (int)$img, 'thumb_size' => 'full'));
				}				

				$output .= $img_val['thumbnail']; 
			}
		$output .= '</div>';		
			if($title != '') {
				$output .= '<h4 class="delicious-service-title-hover">'.wp_kses_post($title).'</h4>';
			}		
			if(!empty($content)) {
				$output .= '<p>'.do_shortcode($content).'</p>';
			}
		$output .= '</div>';

		$output .= '<div class="delicious-service-icon">';
			if($media_type == 'icon-type') { $output .= $icon_format; }
			else 
			if($media_type == 'img-type') { 
				$img_val = '';
				if (function_exists('wpb_getImageBySize')) {
					$img_val = wpb_getImageBySize(array('attach_id' => (int)$img, 'thumb_size' => 'full'));
				}				

				$output .= $img_val['thumbnail']; 
			}
		$output .= '</div>';
	
		$output .= '<div class="delicious-service-content">';
			if($title != '') {
				$output .= '<h4 class="delicious-service-title">'.wp_kses_post($title).'</h4>';
			}
		$output .= '</div>';
	$output .= '</div>';	

	return $output;
}

add_shortcode("dt_service", "delicious_service");


/*-----------------------------------------------------------------------------------*/
/*	Delicious Slider for Visual Composer
/*-----------------------------------------------------------------------------------*/

function delicious_portfolio_slider($atts, $content = null) {
	extract(shortcode_atts(array(
		"images" => '',
		'thumb_size' => 'dt-gallery-thumb',
		'slider_lightbox' => 'yes',
		'lazyload' => 'false',
		'mobile_slides' => 1,
		'tablet_slides' => 1,
		'desktop_slides' => 1,
		'speed' => 8000,
		'dt_rtl' => 'false'
	), $atts));

	$portfolio_images = explode(",", $images);

	$dt_rnd_id = '';
	if(function_exists('dt_random_id')) {
		$dt_rnd_id = dt_random_id(3);   
	}
	$dt_token = wp_generate_password(5, false, false);

	wp_enqueue_script('dt-custom-portfolio-slider');	
	wp_localize_script( 'dt-custom-portfolio-slider', 'dt_slider_' . $dt_token, array( 'id' => $dt_rnd_id, 'slider_speed' => $speed, 'lazyload' => $lazyload, 'mobile_slides' => $mobile_slides, 'tablet_slides' => $tablet_slides, 'desktop_slides' => $desktop_slides, 'dt_rtl' => $dt_rtl) );		

	$output = '';
	$output .= '<div class="portfolio-slider-wrapper">';
		$output .= '<div id="owl-slider-'.$dt_rnd_id.'" class="owl-carousel portfolio-slider mfp-gallery" data-token="' . $dt_token .'">';

		foreach($portfolio_images as $single_image) {
			
			$dt_img_size = '';
			$dt_alt = trim(strip_tags( get_post_meta($single_image, '_wp_attachment_image_alt', true) ));
			if (function_exists('wpb_getImageBySize')) {
				$dt_img_size = wpb_getImageBySize(array('attach_id' => (int)$single_image, 'thumb_size' => $thumb_size));
			}

			$output .='<div class="slider-item">';
			if($lazyload != 'false') { 
				if($slider_lightbox === 'yes') { 
					$output .='<a class="not-link dt-lightbox-gallery" title="'.esc_attr($dt_alt).'" href="'.esc_url($dt_img_size['p_img_large']['0']).'">';
					$output .= '<img class="owl-lazy" data-src="'.esc_url($dt_img_size['p_img_large']['0']).'" alt="'.esc_attr($dt_alt).'" />';
					$output .='</a>';				
				} else {
					$output .= '<img class="owl-lazy" data-src="'.esc_url($dt_img_size['p_img_large']['0']).'" alt="'.esc_attr($dt_alt).'" />';
				}
			} else {
				if($slider_lightbox === 'yes') { 
					$output .='<a title="'.esc_attr($dt_alt).'" href="'.esc_url($dt_img_size['p_img_large']['0']).'" class="not-link dt-lightbox-gallery">';
					$output .= $dt_img_size['thumbnail'];
					$output .='</a>';				
				} else {
					$output .= $dt_img_size['thumbnail'];
				}				
			}

			$output .='</div>';
		}

		$output .= '</div>';
	$output .= '</div>';
	return $output;
}

add_shortcode("dt-portfolio-slider", "delicious_portfolio_slider");




/*-----------------------------------------------------------------------------------*/
/*	Google Map Shortcode
/*-----------------------------------------------------------------------------------*/
function delicious_map_shortcode($atts, $content = null) {
	extract(shortcode_atts(array(
		"latitude" => '37.422117',
		"longitude" => '-122.084053',
		'pin_title' => 'Company Headquarters',
		'pin_desc' => 'Now that you visited our website, how about <br/> checking out our office too?',
		'pin_color'=> '#3e8a6c',
		'zoom' => 15,
		'height' => '100%'
	), $atts));

	$dt_rnd_id = '';
	if(function_exists('dt_random_id')) {
		$dt_rnd_id = dt_random_id(3);   
	}
	
	$dt_token = wp_generate_password(5, false, false);

	wp_enqueue_script('dt-api-map', '//maps.google.com/maps/api/js?sensor=false', false );	
	wp_enqueue_script('dt-custom-map');	
	wp_localize_script( 'dt-custom-map', 'dt_map_'. $dt_token, array( 'id' => $dt_rnd_id, 'latitude' => $latitude, 'longitude' => $longitude, 'pin_title' => $pin_title, 'pin_desc' => $pin_desc, 'pin_color' => $pin_color, 'height' => $height, 'zoom' => $zoom) );		

	$output = '';
	$output .= '<div class="map-wrapper"  style="min-height: '.$height.'" id="delicious_map_'.$dt_rnd_id.'" data-token="' . $dt_token .'">';
		$output .='<div id="google_map_'.$dt_rnd_id.'"></div>';
	$output .='</div>';

	return $output;
}

add_shortcode("dt-google-map", "delicious_map_shortcode");



/*-----------------------------------------------------------------------------------*/
/*	CF7 Shortcode Hack
/*-----------------------------------------------------------------------------------*/

add_filter( 'wpcf7_form_elements', 'delicious_wpcf7_form_elements' );

function delicious_wpcf7_form_elements( $form ) {
$form = do_shortcode( $form );

return $form;
}



/*-----------------------------------------------------------------------------------*/
/*	Shortcodes Filter
/*-----------------------------------------------------------------------------------*/
add_filter("the_content", "dt_the_content_filter");
 
function dt_the_content_filter($content) {
 
	// array of custom shortcodes
	$block = join("|",array("dt-portfolio-grid", "dt-pricing-column", "dt-button", "dt-funfact", "dt-skillbar", "dt-column", "dt_process_tab"));
 
	// opening tag
	$rep = preg_replace("/(<p>)?\[($block)(\s[^\]]+)?\](<\/p>|<br \/>)?/","[$2$3]",$content);
		
	// closing tag
	$rep = preg_replace("/(<p>)?\[\/($block)](<\/p>|<br \/>)?/","[/$2]",$rep);
 
	return $rep;

}

// enable shortcodes in widgets
add_filter('widget_text', 'do_shortcode');


/*-----------------------------------------------------------------------------------*/
/*	Helper Functions
/*-----------------------------------------------------------------------------------*/

	//setting a random id
	if(!function_exists('dt_random_id')) { 
		function dt_random_id($id_length) {
		$random_id_length = $id_length; 
		$dt_rnd_id = md5(uniqid(rand(),1)); 
		$dt_rnd_id = strip_tags(stripslashes($dt_rnd_id)); 
		$dt_rnd_id = str_replace(".","",$dt_rnd_id); 
		$dt_rnd_id = strrev(str_replace("/","",$dt_rnd_id)); 
		$dt_rnd_id = str_replace(range(0,9),"",$dt_rnd_id); 
		$dt_rnd_id = substr($dt_rnd_id,0,$random_id_length); 
		$dt_rnd_id = strtolower($dt_rnd_id);  

		return $dt_rnd_id;
		}
	}

if(!class_exists('Aq_Resize')) {
    class Aq_Exception extends Exception {}

    class Aq_Resize
    {
        /**
         * The singleton instance
         */
        static private $instance = null;

        /**
         * Should an Aq_Exception be thrown on error?
         * If false (default), then the error will just be logged.
         */
        public $throwOnError = false;

        /**
         * No initialization allowed
         */
        private function __construct() {}

        /**
         * No cloning allowed
         */
        private function __clone() {}

        /**
         * For your custom default usage you may want to initialize an Aq_Resize object by yourself and then have own defaults
         */
        static public function getInstance() {
            if(self::$instance == null) {
                self::$instance = new self;
            }

            return self::$instance;
        }

        /**
         * Run, forest.
         */
        public function process( $url, $width = null, $height = null, $crop = null, $single = true, $upscale = false ) {
            try {
                // Validate inputs.
                if (!$url)
                    throw new Aq_Exception('$url parameter is required');
                if (!$width)
                    throw new Aq_Exception('$width parameter is required');
                if (!$height)
                    throw new Aq_Exception('$height parameter is required');

                // Caipt'n, ready to hook.
                if ( true === $upscale ) add_filter( 'image_resize_dimensions', array($this, 'aq_upscale'), 10, 6 );

                // Define upload path & dir.
                $upload_info = wp_upload_dir();
                $upload_dir = $upload_info['basedir'];
                $upload_url = $upload_info['baseurl'];
                
                $http_prefix = "http://";
                $https_prefix = "https://";
                $relative_prefix = "//"; // The protocol-relative URL
                
                /* if the $url scheme differs from $upload_url scheme, make them match 
                   if the schemes differe, images don't show up. */
                if(!strncmp($url,$https_prefix,strlen($https_prefix))){ //if url begins with https:// make $upload_url begin with https:// as well
                    $upload_url = str_replace($http_prefix,$https_prefix,$upload_url);
                }
                elseif(!strncmp($url,$http_prefix,strlen($http_prefix))){ //if url begins with http:// make $upload_url begin with http:// as well
                    $upload_url = str_replace($https_prefix,$http_prefix,$upload_url);      
                }
                elseif(!strncmp($url,$relative_prefix,strlen($relative_prefix))){ //if url begins with // make $upload_url begin with // as well
                    $upload_url = str_replace(array( 0 => "$http_prefix", 1 => "$https_prefix"),$relative_prefix,$upload_url);
                }
                

                // Check if $img_url is local.
                if ( false === strpos( $url, $upload_url ) )
                    throw new Aq_Exception('Image must be local: ' . $url);

                // Define path of image.
                $rel_path = str_replace( $upload_url, '', $url );
                $img_path = $upload_dir . $rel_path;

                // Check if img path exists, and is an image indeed.
                if ( ! file_exists( $img_path ) or ! getimagesize( $img_path ) )
                    throw new Aq_Exception('Image file does not exist (or is not an image): ' . $img_path);

                // Get image info.
                $info = pathinfo( $img_path );
                $ext = $info['extension'];
                list( $orig_w, $orig_h ) = getimagesize( $img_path );

                // Get image size after cropping.
                $dims = image_resize_dimensions( $orig_w, $orig_h, $width, $height, $crop );
                $dst_w = $dims[4];
                $dst_h = $dims[5];

                // Return the original image only if it exactly fits the needed measures.
                if ( ! $dims && ( ( ( null === $height && $orig_w == $width ) xor ( null === $width && $orig_h == $height ) ) xor ( $height == $orig_h && $width == $orig_w ) ) ) {
                    $img_url = $url;
                    $dst_w = $orig_w;
                    $dst_h = $orig_h;
                } else {
                    // Use this to check if cropped image already exists, so we can return that instead.
                    $suffix = "{$dst_w}x{$dst_h}";
                    $dst_rel_path = str_replace( '.' . $ext, '', $rel_path );
                    $destfilename = "{$upload_dir}{$dst_rel_path}-{$suffix}.{$ext}";

                    if ( ! $dims || ( true == $crop && false == $upscale && ( $dst_w < $width || $dst_h < $height ) ) ) {
                        // Can't resize, so return false saying that the action to do could not be processed as planned.
                        throw new Aq_Exception('Unable to resize image because image_resize_dimensions() failed');
                    }
                    // Else check if cache exists.
                    elseif ( file_exists( $destfilename ) && getimagesize( $destfilename ) ) {
                        $img_url = "{$upload_url}{$dst_rel_path}-{$suffix}.{$ext}";
                    }
                    // Else, we resize the image and return the new resized image url.
                    else {

                        $editor = wp_get_image_editor( $img_path );

                        if ( is_wp_error( $editor ) || is_wp_error( $editor->resize( $width, $height, $crop ) ) ) {
                            throw new Aq_Exception('Unable to get WP_Image_Editor: ' . 
                                                   $editor->get_error_message() . ' (is GD or ImageMagick installed?)');
                        }

                        $resized_file = $editor->save();

                        if ( ! is_wp_error( $resized_file ) ) {
                            $resized_rel_path = str_replace( $upload_dir, '', $resized_file['path'] );
                            $img_url = $upload_url . $resized_rel_path;
                        } else {
                            throw new Aq_Exception('Unable to save resized image file: ' . $editor->get_error_message());
                        }

                    }
                }

                // Okay, leave the ship.
                if ( true === $upscale ) remove_filter( 'image_resize_dimensions', array( $this, 'aq_upscale' ) );

                // Return the output.
                if ( $single ) {
                    // str return.
                    $image = $img_url;
                } else {
                    // array return.
                    $image = array (
                        0 => $img_url,
                        1 => $dst_w,
                        2 => $dst_h
                    );
                }

                return $image;
            }
            catch (Aq_Exception $ex) {
                error_log('Aq_Resize.process() error: ' . $ex->getMessage());

                if ($this->throwOnError) {
                    // Bubble up exception.
                    throw $ex;
                }
                else {
                    // Return false, so that this patch is backwards-compatible.
                    return false;
                }
            }
        }

        /**
         * Callback to overwrite WP computing of thumbnail measures
         */
        function aq_upscale( $default, $orig_w, $orig_h, $dest_w, $dest_h, $crop ) {
            if ( ! $crop ) return null; // Let the wordpress default function handle this.

            // Here is the point we allow to use larger image size than the original one.
            $aspect_ratio = $orig_w / $orig_h;
            $new_w = $dest_w;
            $new_h = $dest_h;

            if ( ! $new_w ) {
                $new_w = intval( $new_h * $aspect_ratio );
            }

            if ( ! $new_h ) {
                $new_h = intval( $new_w / $aspect_ratio );
            }

            $size_ratio = max( $new_w / $orig_w, $new_h / $orig_h );

            $crop_w = round( $new_w / $size_ratio );
            $crop_h = round( $new_h / $size_ratio );

            $s_x = floor( ( $orig_w - $crop_w ) / 2 );
            $s_y = floor( ( $orig_h - $crop_h ) / 2 );

            return array( 0, 0, (int) $s_x, (int) $s_y, (int) $new_w, (int) $new_h, (int) $crop_w, (int) $crop_h );
        }
    }
}





if(!function_exists('aq_resize')) {

    /**
     * This is just a tiny wrapper function for the class above so that there is no
     * need to change any code in your own WP themes. Usage is still the same :)
     */
    function aq_resize( $url, $width = null, $height = null, $crop = null, $single = true, $upscale = false ) {
        /* WPML Fix */
        if ( defined( 'ICL_SITEPRESS_VERSION' ) ){
            global $sitepress;
            $url = $sitepress->convert_url( $url, $sitepress->get_default_language() );
        }
        /* WPML Fix */

        $aq_resize = Aq_Resize::getInstance();
        return $aq_resize->process( $url, $width, $height, $crop, $single, $upscale );
    }
}


?>