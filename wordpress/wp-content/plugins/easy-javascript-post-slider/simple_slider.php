<?php
/*
Plugin Name: Simple Slider
Plugin URI: http://www.perceptionsystem.com/plugins.html
Description: A Simple Image Slider plugin
Version: 1.0
Author: Perception System
Author URI: http://www.perceptionsystem.com
Contributors: CMS Team
*/
?>

<?php 

function simple_slider_activation() {
}
register_activation_hook(__FILE__, 'simple_slider_activation');

function simple_slider_deactivation() {
}
register_deactivation_hook(__FILE__, 'simple_slider_deactivation');

add_action('wp_enqueue_scripts', 'simple_slider_scripts');
function simple_slider_scripts() {
	wp_enqueue_script('jquery');
	wp_register_script('slidesjs_core', plugins_url('js/jquery.slides.min.js', __FILE__),array("jquery"));
	wp_enqueue_script('slidesjs_core');
	
	wp_register_script('slidesjs_init', plugins_url('js/slidesjs.initialize.js', __FILE__));
	wp_enqueue_script('slidesjs_init');
	
}

add_action('wp_enqueue_scripts', 'simple_slider_styles');
function simple_slider_styles() {
	wp_register_style('easy-slider', plugins_url('css/easy-slider.css', __FILE__));
	wp_enqueue_style('easy-slider');	
	
}

add_shortcode("simple_image_slider", "simple_display_slider");
function simple_display_slider($attr,$content) {
	extract(shortcode_atts(array(
			'id' => ''
			), $attr));
		$args = array(
			'post_type' => 'attachment',
			'numberposts' => -1,
			'post_parent' => $id
		);
		$attachments = get_posts( $args );
	 
		if ( $attachments ){
			$html = '<div class="container"><div class="easy-slides">';
        	foreach ( $attachments as $attachment ){
				//echo $attachment->ID;
				$gallery_images = wp_get_attachment_image( $attachment->ID, 'full' );
				$html .= $gallery_images;
			}
			$html .= '</div></div>';  
		}
		return $html;
}

add_action('init', 'simple_register_slider');
function simple_register_slider() {
	$labels = array(
		'name' => 'All Slide',
		'menu_name' => 'Simple Slider',
		'add_new' => 'Add New Slide',
        'add_new_item' => 'Add New Slide',
        'edit_item' => 'Edit Slide'
        
	);
	$args = array(
		
		'labels' => $labels,
		'hierarchical' => true,
		'description' => 'Slideshows',
		'supports' => array('title', 'editor'),
		'public' => true,
		'show_ui' => true,
		'show_in_menu' => true,
		'show_in_nav_menus' => true,
		'publicly_queryable' => true,
		'exclude_from_search' => false,
		'has_archive' => true,
		'query_var' => true,
		'can_export' => true,
		'rewrite' => true,
		'capability_type' => 'post'
	);
	register_post_type('slider', $args);
}

add_filter('manage_edit-slider_columns', 'simple_set_custom_edit_slider_columns');
add_action('manage_slider_posts_custom_column', 'simple_custom_slider_column', 10, 2);

function simple_set_custom_edit_slider_columns($columns) {
	return $columns
	+ array('slider_shortcode' => __('Shortcode'));
}

function simple_custom_slider_column($column, $post_id) {
	$slider_meta = get_post_meta($post_id, "_simple_slider_meta", true);
	$slider_meta = ($slider_meta != '') ? json_decode($slider_meta) : array();

	switch ($column){
		case 'slider_shortcode':
			echo "[simple_image_slider id=$post_id]";
		break;
    }
}

add_action('save_post', 'simple_save_slider_info');
function simple_save_slider_info($post_id) {
	if(isset($_POST['simple_slider_box_nonce']) && $_POST['post_type'])
	{		
		if (!wp_verify_nonce($_POST['simple_slider_box_nonce'], basename(__FILE__))){
			return $post_id;
		}
	
		if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE){
			return $post_id;
		}
		if ('slider' == $_POST['post_type'] && current_user_can('edit_post', $post_id)){
			$gallery_images = (isset($_POST['gallery_img']) ? $_POST['gallery_img'] : '');
			$gallery_images = strip_tags(json_encode($gallery_images));
			update_post_meta($post_id, "_simple_gallery_images", $gallery_images);
		}else{
			return $post_id;
		}
	}
 
}
?>
