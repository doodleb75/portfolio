<?php
/**
 * Plugin Name: Experience Post Type
 * Plugin URI: http://themepicasso.com/
 * Description: Experience Post Type
 * Version: 1.0
 * Author: Muntasir Mahmud Aumio
 * Author URI: http://themepicasso.com/
 * Text Domain: stain
 */

if ( ! function_exists('experience_post_type') ) {

// Register Custom Post Type
function experience_post_type() {

    $labels = array(
        'name'                => _x( 'Experiences', 'Post Type General Name', 'stain' ),
        'singular_name'       => _x( 'Experience', 'Post Type Singular Name', 'stain' ),
        'menu_name'           => __( 'Experience', 'stain' ),
        'parent_item_colon'   => __( 'Parent Item:', 'stain' ),
        'all_items'           => __( 'All Experiences', 'stain' ),
        'view_item'           => __( 'View Experience', 'stain' ),
        'add_new_item'        => __( 'Add Experience', 'stain' ),
        'add_new'             => __( 'Add Experience', 'stain' ),
        'edit_item'           => __( 'Edit Experience', 'stain' ),
        'update_item'         => __( 'Update Experience', 'stain' ),
        'search_items'        => __( 'Search Experience', 'stain' ),
        'not_found'           => __( 'Experience Not found', 'stain' ),
        'not_found_in_trash'  => __( 'Experience Not found in Trash', 'stain' ),
    );
    $args = array(
        'label'               => __( 'experience', 'stain' ),
        'description'         => __( 'Experience Post Type', 'stain' ),
        'labels'              => $labels,
        'supports'            => array( 'title', 'page-attributes', ),
        'hierarchical'        => false,
        'public'              => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_nav_menus'   => true,
        'show_in_admin_bar'   => true,
        'menu_position'       => 5,
        'menu_icon'           => 'dashicons-awards',
        'can_export'          => true,
        'has_archive'         => true,
        'exclude_from_search' => false,
        'publicly_queryable'  => true,
        'capability_type'     => 'page',
    );
    register_post_type( 'experience', $args );

}

// Hook into the 'init' action
add_action( 'init', 'experience_post_type', 0 );

}