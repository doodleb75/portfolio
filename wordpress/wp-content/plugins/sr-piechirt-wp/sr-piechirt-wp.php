<?php

  /*
Plugin Name:sr-piechirt-wp
Plugin URI:http://sohelrazzaque.com/plugins/sr-piechirt-wp
Description:This plugin will added to your wordPress side a nice and easy pie chart.you can change pie chart total area width,total area background colour,pie chart circle text colour and also change text colour  & other setting from <a href="edit.php?post_type=pie_chart">"pie_chart"</a>  menu in dashboard.This plugin will enable pie chart your wordpress theme. You can embed pie chart via shortcode in everywhere you want, even in theme files.
Author:<a href="http://sohelrazzaque.com/pf">sohel razzaque</a>

Author URI:http://sohelrazzaque.com/pf
Version:1.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

 /* Adding Latest jQuery from Wordpress */
function sohel_pie_chart_latest_jquery() {
	wp_enqueue_script('jquery');
}
add_action('init', 'sohel_pie_chart_latest_jquery');


   /*Some Set-up*/
define('SOHEL_PIE_CHART_WP', WP_PLUGIN_URL . '/' . plugin_basename( dirname(__FILE__) ) . '/' );


/* Including all files */
function sohel_pie_file() {
	// wp_enqueue_script('sohel-buttom-jquery', SOHEL_PIE_CHART_WP.'js/circles.js', array('jquery'), 1.0, true);
	wp_enqueue_style('sohel-pie-chart-style-css', SOHEL_PIE_CHART_WP.'pie.css');
	
	wp_enqueue_script('sohel-sohel-pie-jquery', SOHEL_PIE_CHART_WP.'circles.js', array('jquery'),0.1,true);
	wp_enqueue_script('sohel-shoel-pie-jquery', SOHEL_PIE_CHART_WP.'circle_control.js', array('jquery'),0.1,true);
}
add_action( 'wp_enqueue_scripts', 'sohel_pie_file' );



     /*pie_chart short code      */
	 
	 
	   function pie_chart_list_shortcode($atts){
	extract( shortcode_atts( array(
		'category' => '',
		'width' => 'col-lg-12',
	), $atts, 'wishlist' ) );
	
    $q = new WP_Query(
        array('posts_per_page' => -1, 'post_type' => 'pie_chart', 'pie_chart_cat' => $category , 'order' => 'ASC')
        );		
		
		
	$list = '<div class="pie">
					<div id="canvas">';
	while($q->have_posts()) : $q->the_post();
		$idd = get_the_ID();
			$pie_circles = get_post_meta($idd, 'pie_circles', true); 
			
		
		
		
		$list .= '
								<div class="cercle_text">
								<h2><div class="circles" id="'.get_the_content().'"></div>'.get_the_title().'</h2>
								
								</div>
		      
		
		';        
	endwhile;
	$list.= '</div></div>';
	wp_reset_query();
	return $list;
}
add_shortcode('pie_chart_list', 'pie_chart_list_shortcode');



           /*custom post for pie_chart;*/

add_action( 'init', 'sohel_pie_chart_post_type' );
            function sohel_pie_chart_post_type() {
                    register_post_type( 'pie_chart',
                            array(
                                    'labels' => array(
                                            'name' => __( 'pie_charts' ),
                                            'singular_name' => __( 'pie_chart' ),
                                            'add_new' => __( 'Add New' ),
                                            'add_new_item' => __( 'Add New pie_chart' ),
                                            'edit_item' => __( 'Edit pie_chart' ),
                                            'new_item' => __( 'New pie_chart' ),
                                            'view_item' => __( 'View pie_chart' ),
                                            'not_found' => __( 'Sorry, we couldn\'t find the pie_chart you are looking for.' )
                                    ),
                            'public' => true,
                            'publicly_queryable' => false,
                            'exclude_from_search' => true,
                            'menu_position' => 15,
                            'has_archive' => true,
                            'hierarchical' => false,
                            'capability_type' => 'post','page',
                            'rewrite' => array( 'slug' => 'pie_chart' ),
                            'supports' => array( 'title', 'editor', 'custom-fields','thumbnail','page-attributes' )
                            )
                    );
            }

        /*pie_chart taxonomy   */

function pie_chart_taxonomy() {
	register_taxonomy(
		'pie_chart_cat',  //The name of the taxonomy. Name should be in slug form (must not contain capital letters or spaces).
		'pie_chart',                  //post type name
		array(
			'hierarchical'          => true,
			'label'                         => 'pie chart category',  //Display name
			'query_var'             => true,
			'show_admin_column'			=> true,
			'rewrite'                       => array(
				'slug'                  => 'pie_chart', // This controls the base slug that will display before each term
				'with_front'    => true // Don't display the category base before
				)
			)
	);
}
add_action( 'init', 'pie_chart_taxonomy'); 



	  /*setting manu*/

function pie_chart_options_framwrork()  
{  
	add_submenu_page('edit.php?post_type=pie_chart','pie chart settings', 'pie settings', 'manage_options', 'piechart-settings','piechart_options_framwrork');  
}  
add_action('admin_menu', 'pie_chart_options_framwrork');


/*end setting manu */



	/*	color picker */

add_action( 'admin_enqueue_scripts', 'wptuts_add_color_picker' );
function wptuts_add_color_picker( $hook ) {
 
    if( is_admin() ) {
     
        // Add the color picker css file      
        wp_enqueue_style( 'wp-color-picker' );
         
        // Include our custom jQuery file with WordPress Color Picker dependency
        wp_enqueue_script( 'custom-script-handle', plugins_url( '/inc/color-pickr.js', __FILE__ ), array( 'wp-color-picker' ), false, true );
    }
}

      /*end	color picker */
	  
   /* end register_setting   */
   
   // Default options values
   $sohel_piechart_options = array(
	'pie_chart_bg' => '#cc0000',
	'pie_chart_circles_text_color' => '#000',
	'pie_chart_total_width' => '100%',
	'pie_chart_background_color' => '#000',
	'single_pie_width' => '189px',

);	  



  	/*register_setting   */
	
if ( is_admin() ) : // Load only if we are viewing an admin page


function sohel_piechart_register_settings() {
	// Register settings and call sanitation functions
	register_setting( 'sohel_piechart_p_options', 'sohel_piechart_options', 'sohel_piechart_validate_options' );
}

add_action( 'admin_init', 'sohel_piechart_register_settings' );



   
   
   
   
   // Function to generate options page
function piechart_options_framwrork() {
	global $sohel_piechart_options, $auto_hide_mode, $where_visible_scrollbar;

	if ( ! isset( $_REQUEST['updated'] ) )
		$_REQUEST['updated'] = false; // This checks whether the form has just been submitted. ?>

	<div class="wrap">

	
	<h2>Custom pie chart Options</h2>

	<?php if ( false !== $_REQUEST['updated'] ) : ?>
	<div class="updated fade"><p><strong><?php _e( 'Options saved' ); ?></strong></p></div>
	<?php endif; // If the form has just been submitted, this shows the notification ?>

	<form method="post" action="options.php">

	<?php $settings = get_option( 'sohel_piechart_options', $sohel_piechart_options ); ?>
	
	<?php settings_fields( 'sohel_piechart_p_options' );
	/* This function outputs some hidden fields required by the form,
	including a nonce, a unique number used to ensure the form has been submitted from the admin page
	and not somewhere else, very important for security */ ?>

	   
	
	<table class="form-table"><!-- Grab a hot cup of coffee, yes we're using tables! -->
	
	


		<tr valign="top">
			<th scope="row"><label for="single_pie_width">single pie width</label></th>
			<td>
				<input id="single_pie_width" type="text" name="sohel_piechart_options[single_pie_width]" value="<?php echo stripslashes($settings['single_pie_width']); ?>" class="description" /><p class="description">you can set single pie area width.like 130px,150px,180px,100%,50% etc.</p>
			</td>
		</tr>
		
		<tr valign="top">
			<th scope="row"><label for="pie_chart_bg">Pie chart Text color</label></th>
			<td>
				<input id="pie_chart_bg" type="text" name="sohel_piechart_options[pie_chart_bg]" value="<?php echo stripslashes($settings['pie_chart_bg']); ?>" class="color-field" /><p class="description">Select pie chart text color here. You can also add html HEX color code.</p>
			</td>
		</tr>
		
		<tr valign="top">
			<th scope="row"><label for="pie_chart_circles_text_color">Pie chart circles Text color</label></th>
			<td>
				<input id="pie_chart_circles_text_color" type="text" name="sohel_piechart_options[pie_chart_circles_text_color]" value="<?php echo stripslashes($settings['pie_chart_circles_text_color']); ?>" class="color-field" /><p class="description">Select pie chart circles text color here. You can also add html HEX color code.</p>
			</td>
		</tr>	
		
		<tr valign="top">
			<th scope="row"><label for="pie_chart_total_width">Pie chart Total area width</label></th>
			<td>
				<input id="pie_chart_total_width" type="text" name="sohel_piechart_options[pie_chart_total_width]" value="<?php echo stripslashes($settings['pie_chart_total_width']); ?>" class="description" /><p class="description">you can set your pie chart total area width like 100%,50%,25%.also fix the px like 960px, 1000px,1024px,1170px etc</p>
			</td>
		</tr>	
		
		<tr valign="top">
			<th scope="row"><label for="pie_chart_background_color">Pie chart Total background color</label></th>
			<td>
				<input id="pie_chart_background_color" type="text" name="sohel_piechart_options[pie_chart_background_color]" value="<?php echo stripslashes($settings['pie_chart_background_color']); ?>" class="color-field" /><p class="description">you can set your pie chart total  background area color.You can also add html HEX color code.</p>
			</td>
		</tr>	
		
		

			

			
	</table>

	<p class="submit"><input type="submit" class="button-primary" value="Save Options" /></p>

	</form>

	</div>

	<?php
}

 // end Function to generate options page
 
 
function sohel_piechart_validate_options( $input ) {
	global $sohel_piechart_options, $auto_hide_mode;

	$settings = get_option( 'sohel_piechart_options', $sohel_piechart_options );
	
	// We strip all tags from the text field, to avoid vulnerablilties like XSS

	$input['pie_chart_bg'] = wp_filter_post_kses( $input['pie_chart_bg'] );
	$input['pie_chart_total_width'] = wp_filter_post_kses( $input['pie_chart_total_width'] );
	$input['pie_chart_background_color'] = wp_filter_post_kses( $input['pie_chart_background_color'] );
	$input['pie_chart_circles_text_color'] = wp_filter_post_kses( $input['pie_chart_circles_text_color'] );
	$input['single_pie_width'] = wp_filter_post_kses( $input['single_pie_width'] );



		
		
	
	return $input;
}
   
   
   
   
	
	
endif;  // EndIf is_admin()


	 // 8.data danamic
		
	function piechart_activator(){?>
	<?php global $sohel_piechart_options;
	
	$piechart_settings=get_option('sohel_piechart_options','$sohel_piechart_options'); ?>
	
	
	  <style type="text/css">
	div.cercle_text h2 {color:<?php echo $piechart_settings['pie_chart_bg']; ?> !important}
	</style>    
	
	
    <?php
	}
	
    add_action('wp_head','piechart_activator');
	
	/* pie chart circle text color   */
	
	
		function piechart_circle_text_color(){?>
	<?php global $sohel_piechart_options;
	
	$piechart_cicrel_text_color_settings=get_option('sohel_piechart_options','$sohel_piechart_options'); ?>
	
	
	  <style type="text/css">
	  
	  .circles-number{color:<?php echo $piechart_cicrel_text_color_settings['pie_chart_circles_text_color']; ?>!important}
	  .circles-text{color:<?php echo $piechart_cicrel_text_color_settings['pie_chart_circles_text_color']; ?>!important}
	  
	
	</style>    
	
	
    <?php
	}
	
    add_action('wp_head','piechart_circle_text_color');
	
	
	/*pie chart width area     */
	
	function piechart_weight_activator(){?>
	<?php global $sohel_piechart_options;
	
	$piechart_width_settings=get_option('sohel_piechart_options','$sohel_piechart_options'); ?>
	
	
	  <style type="text/css">
	  div.pie{width:<?php echo $piechart_width_settings['pie_chart_total_width']; ?>;background:<?php echo $piechart_width_settings['pie_chart_background_color']; ?>}
	
	</style>    
	
	
    <?php
	}
	
    add_action('wp_head','piechart_weight_activator');
	
	
	/*single pie chart width area     */
	
	function single_piechart_weight_activator(){?>
	<?php global $sohel_piechart_options;
	
	$single_piechart_width_settings=get_option('sohel_piechart_options','$sohel_piechart_options'); ?>
	
	
	  <style type="text/css">
	  div.cercle_text{width:<?php echo $single_piechart_width_settings['single_pie_width']; ?>}
	
	</style>    
	
	
    <?php
	}
	
    add_action('wp_head','single_piechart_weight_activator');
	

	


?>