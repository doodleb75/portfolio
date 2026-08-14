<?php

/*
  Plugin Name: Responsive Lightbox2
  Version: 1.0.1
  Plugin URI: https://noorsplugin.com/2016/05/20/responsive-lightbox2-plugin-for-wordpress/
  Author: naa986
  Author URI: https://noorsplugin.com/
  Description: Add Lightbox2 popup style to your WordPress site to open images in lightbox
  Text Domain: responsive-lightbox2
  Domain Path: /languages
 */

if (!defined('ABSPATH'))
    exit;
if (!class_exists('RESPONSIVE_LIGHTBOX2')) {

    class RESPONSIVE_LIGHTBOX2 {

        var $plugin_version = '1.0.1';
        var $plugin_url;
        var $plugin_path;

        function __construct() {
            define('RESPONSIVE_LIGHTBOX2_VERSION', $this->plugin_version);
            define('RESPONSIVE_LIGHTBOX2_SITE_URL', site_url());
            define('RESPONSIVE_LIGHTBOX2_URL', $this->plugin_url());
            define('RESPONSIVE_LIGHTBOX2_PATH', $this->plugin_path());
            define('RESPONSIVE_LIGHTBOX2_LIBRARY_VERSION', '2.8.2');
            $this->plugin_includes();
            add_action('wp_enqueue_scripts', array(&$this, 'plugin_scripts'), 0);
        }

        function plugin_includes() {
            if (is_admin()) {
                add_filter('plugin_action_links', array($this, 'add_plugin_action_links'), 10, 2);
            }
            add_action('plugins_loaded', array($this, 'plugins_loaded_handler'));
            add_action('admin_menu', array($this, 'add_options_menu'));
            add_shortcode('lightbox2', array($this, 'shortcode_handler'));
            //allows shortcode execution in the widget, excerpt and content
            add_filter('widget_text', 'do_shortcode');
            add_filter('the_excerpt', 'do_shortcode', 11);
            add_filter('the_content', 'do_shortcode', 11);
        }

        function plugin_scripts() {
            if (!is_admin()) {
                wp_enqueue_script('jquery');
                wp_register_script('lightbox2', RESPONSIVE_LIGHTBOX2_URL . '/js/lightbox.js', array('jquery'), RESPONSIVE_LIGHTBOX2_VERSION);
                wp_enqueue_script('lightbox2');
                wp_register_style('lightbox2', RESPONSIVE_LIGHTBOX2_URL . '/css/lightbox.css');
                wp_enqueue_style('lightbox2');
            }
        }

        function plugin_url() {
            if ($this->plugin_url)
                return $this->plugin_url;
            return $this->plugin_url = plugins_url(basename(plugin_dir_path(__FILE__)), basename(__FILE__));
        }

        function plugin_path() {
            if ($this->plugin_path)
                return $this->plugin_path;
            return $this->plugin_path = untrailingslashit(plugin_dir_path(__FILE__));
        }

        function add_plugin_action_links($links, $file) {
            if ($file == plugin_basename(dirname(__FILE__) . '/main.php')) {
                $links[] = '<a href="options-general.php?page=responsive-lightbox2-settings">' . __('Settings', 'responsive-lightbox2') . '</a>';
            }
            return $links;
        }

        function plugins_loaded_handler() {
            load_plugin_textdomain('responsive-lightbox2', false, dirname(plugin_basename(__FILE__)) . '/languages/');
        }

        function add_options_menu() {
            if (is_admin()) {
                add_options_page(__('Lightbox2', 'responsive-lightbox2'), __('Lightbox2', 'responsive-lightbox2'), 'manage_options', 'responsive-lightbox2-settings', array($this, 'options_page'));
            }
        }

        function options_page() {
            $url = "https://noorsplugin.com/2016/05/20/responsive-lightbox2-plugin-for-wordpress/";
            $link_text = sprintf(wp_kses(__('Please visit the <a target="_blank" href="%s">Responsive Lightbox2</a> documentation page for usage instructions.', 'responsive-lightbox2'), array('a' => array('href' => array(), 'target' => array()))), esc_url($url));
            echo '<div class="wrap">';
            echo '<h2>Responsive Lightbox2 - v' . $this->plugin_version . '</h2>';
            echo '<div class="update-nag">' . $link_text . '</div>';
            echo '</div>';
        }

        function shortcode_handler($atts) {
            extract(shortcode_atts(array(
                'url' => '',
                'title' => '',
                'hyperlink' => 'Click Here',
                'rel' => '',
            ), $atts));
            if (empty($url)) {
                return __('Please specify the URL of your image file that you wish to pop up in lightbox', 'responsive-lightbox2');
            }
            if (strpos($hyperlink, 'http') !== false) {
                $hyperlink = '<img src="' . $hyperlink . '">';
            }
            if (!empty($title)) {
                $title = ' title="' . $title . '"';
            }
            $data_lightbox = ' '.uniqid();
            if(!empty($rel)){
                $data_lightbox = ' '.$rel;
            }
            $output = <<<EOT
            <a href="$url"{$title}{$data_lightbox}>$hyperlink</a>
EOT;
            return $output;
        }

    }

    $GLOBALS['responsive_lightbox2'] = new RESPONSIVE_LIGHTBOX2();
}
