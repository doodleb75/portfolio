<?php
if(!class_exists("DeliciousExtendsVC")){
class DeliciousExtendsVC {
    function __construct() {

        add_action( 'init', array( $this, 'delicious_vc_map'), 99 );
        add_action( 'init', array( $this, 'dt_image_sizes'));
        add_action( 'init', array( $this, 'delicious_init'));
        add_action('after_setup_theme',array($this,'delicious_vc_shortcodes'));
        add_action( 'vc_before_init', array($this,'dt_disable_vc'), 9);

        add_action( 'wp_enqueue_scripts', array( $this, 'delicious_load_css_and_js' ) );
        add_action( 'admin_init', array($this, 'delicious_allow_vc_update_via_tgm') );
    }

    public function delicious_init() {
         include( plugin_dir_path( __FILE__ ) . 'core/includes/dt_navigation.php' );
    }
 
    public function delicious_vc_map() {
        // Check if Visual Composer is installed
        if ( ! defined( 'WPB_VC_VERSION' ) ) {
            add_action('admin_notices', array( $this, 'delicious_show_vc_version_notice' ));
            return;
        }
        include( plugin_dir_path( __FILE__ ) . 'core/delicious-vc-map.php' );
    }

    public function delicious_vc_shortcodes() {
        include( plugin_dir_path( __FILE__ ) . 'core/delicious-vc-shortcodes.php' );
    }

    public function dt_disable_vc() {
        if(function_exists('vc_set_as_theme')) { 
            vc_set_as_theme($disable_updater = true);
        }
    }    

    public function dt_image_sizes() {
        add_image_size( 'dt-gallery-thumb', 1120, 9999, false );   // Gallery thumbnails
        add_image_size( 'dt-member-thumb', 640, 640, true);        // Team Member thumbnails
    }
  
    /*
    Load plugin css and javascript files which you may need on front end of your site
    */
    public function delicious_load_css_and_js() {
        global $post;
        $dt_data = delicious_del_data();
        wp_register_style('dt-extend-vc', plugins_url('core/assets/css/delicious-extend-vc.css', __FILE__) );
        wp_register_style('dt-css-plugins', plugins_url('core/assets/css/delicious-plugins.css', __FILE__) );
        wp_enqueue_style('dt-extend-vc');
        wp_enqueue_style('dt-css-plugins');

        // Styles for IE7
        wp_enqueue_style('dt-ie-hacks', plugins_url('core/assets/css/ie.css', __FILE__) );
        global $wp_styles;
        $wp_styles->add_data( 'dt-ie-hacks', 'conditional', 'lte IE 10' );   


        wp_enqueue_script('dt-magnific-popup', plugins_url('core/assets/js/jquery.magnificpopup.min.js', __FILE__), array('jquery'), '1.0', true );
        wp_enqueue_script('owlcarousel', plugins_url('core/assets/js/owlcarousel.js', __FILE__), array('jquery'), '2.0', true );
        wp_register_script('dt-waypoints', plugins_url('core/assets/js/waypoints.min.js', __FILE__), array('jquery'), '2.0.4', true );
        wp_register_script('dt-count-to', plugins_url('core/assets/js/jquery.countTo.js', __FILE__), array('jquery'), 'false', true );
        wp_register_script('isotope', plugins_url('core/assets/js/jquery.isotope.min.js', __FILE__), array('jquery'), '1.0', true );
        wp_register_script('dt-ias', plugins_url('core/assets/js/jquery-ias.min.js', __FILE__), array('jquery'), '1.0', true );
        wp_register_script('dt-custom-isotope-portfolio', plugins_url('core/assets/js/custom/custom-isotope-portfolio.js', __FILE__), array('jquery', 'isotope'), '1.0', true );
  
        wp_register_script('dt-custom-waypoints', plugins_url('core/assets/js/custom/custom-waypoints.js', __FILE__), array('jquery'), false, true );        
        wp_register_script('dt-custom-skills', plugins_url('core/assets/js/custom/custom-skills.js', __FILE__), array('jquery'), false, true );        
        wp_register_script('dt-custom-clients', plugins_url('core/assets/js/custom/custom-clients.js', __FILE__), array('jquery'), false, true );        
        wp_register_script('dt-custom-testimonials', plugins_url('core/assets/js/custom/custom-testimonials.js', __FILE__), array('jquery'), false, true );        
        wp_register_script('dt-custom-blog-carousel', plugins_url('core/assets/js/custom/custom-blog-carousel.js', __FILE__), array('jquery'), false, true );        
        wp_register_script('dt-custom-portfolio-slider', plugins_url('core/assets/js/custom/custom-slider.js', __FILE__), array('jquery'), false, true );        
        wp_register_script('dt-custom-map', plugins_url('core/assets/js/custom/custom-map.js', __FILE__), array('jquery'), false, true );        
        wp_register_script('dt-social', plugins_url('core/assets/js/custom/custom-social.js', __FILE__), array('jquery'), false, true );        
        wp_enqueue_script('dt-custom-dt', plugins_url('core/assets/js/custom/custom-dt.js', __FILE__), array('jquery'), false, true );        

    }

    /*
    Show notice if plugin is activated but Visual Composer is not
    */
    public function delicious_show_vc_version_notice() {
        echo '
        <div class="updated">
          <p>'.wp_kses_post(__('<strong>Delicious Addons</strong> requires <strong><a href="http://goo.gl/wteqRM" target="_blank">Visual Composer</a></strong> plugin to be installed and activated on your site.', 'delicious')).'</p>
        </div>';
    }

    public function delicious_allow_vc_update_via_tgm() {
        global $pagenow;
        if(class_exists('Vc_Updater')) { 
            if ( 'themes.php' === $pagenow && isset( $_GET['page'] ) && 'tgmpa-install-plugins' === $_GET['page'] ) {
                delicious_rm_filter( 'upgrader_pre_download', array( 'Vc_Updater', 'preUpgradeFilter' ), 10 );
            }
        }
    }

}
// Finally initialize code
new DeliciousExtendsVC();
}

    function delicious_del_data() {
        global $stag_redux_data;
        return $stag_redux_data;
    }


    function delicious_rm_filter( $tag, $remove, $priority = 10 ) {
        global $wp_filter;

        if ( ! is_array( $remove ) ) {
            return remove_filter( $tag, $remove, $priority );
        }

        // Extract class and method name.
        list( $class, $method ) = $remove;

        if ( isset( $wp_filter[ $tag ][ $priority ] ) ) {
            $k =& $wp_filter[ $tag ][ $priority ];

            foreach ( $k as $id => $filter ) {
                if ( isset( $filter['function'] ) && is_array( $filter['function'] ) ) {
                    if ( is_a( $filter['function'][0], $class ) && $method === $filter['function'][1] ) {
                        unset( $k[ $id ] );
                        return true;
                    }
                }
            }
        }

        return false;
    }

?>