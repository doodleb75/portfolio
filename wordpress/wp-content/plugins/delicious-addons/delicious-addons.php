<?php
/*
Plugin Name: Delicious Addons - Stag Edition
Plugin URI: http://themeforest.net/user/DeliciousThemes
Description: Addons for DeliciousThemes WordPress Themes
Version: 1.3
Author: DeliciousThemes
Author URI: http://themeforest.net/user/DeliciousThemes
Text Domain: delicious
Domain Path: /languages
*/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

include( plugin_dir_path( __FILE__ ) . 'extend-vc/class-delicious-extend-vc.php' );
include( plugin_dir_path( __FILE__ ) . 'delicious-cpt/class-delicious-cpt.php' );
// include( plugin_dir_path( __FILE__ ) . 'admin/class-delicious-admin-page.php' );

add_action('init', 'delicious_load_textdomain');
function delicious_load_textdomain() {
	load_plugin_textdomain( 'delicious', false, plugin_basename( dirname( __FILE__ ) ) . '/languages' );
}
?>