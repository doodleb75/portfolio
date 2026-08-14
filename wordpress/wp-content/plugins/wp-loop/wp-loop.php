<?php
/**
 * 
 *
 * @package   Mm_Wp_Loop
 * @author    Mimo <mimocontact@gmail.com>
 * @license   GPL-2.0+
 * @link      http://mimo.media
 * @copyright 2014 Mimo
 *
 * @wordpress-plugin
 * Plugin Name:       Wp Loop
 * Plugin URI:        http://mimo.media
 * Description:       Create a loop of posts, pages or whatever Custom Post Type you have
 * Version:           1.2.2
 * Author:            mimothemes
 * Author URI:        http://mimo.media
 * Text Domain:       wp-loop
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Domain Path:       /lang
 */
 
 // Prevent direct file access
if ( ! defined ( 'ABSPATH' ) ) {
	exit;
}


class WpLoop extends WP_Widget {

    /**
     * 
     *
     *
     * The variable name is used as the text domain when internationalizing strings
     * of text. Its value should match the Text Domain file header in the main
     * widget file.
     *
     * @since    1.0.0
     *
     * @var      string
     */
    protected $widget_slug = 'wploop';
   
   

	/*--------------------------------------------------*/
	/* Constructor
	/*--------------------------------------------------*/

	/**
	 * Specifies the classname and description, instantiates the widget,
	 * loads localization files, and includes necessary stylesheets and JavaScript.
	 */
	public function __construct() {

		// load plugin text domain
		add_action( 'init', array( $this, 'widget_textdomain' ) );

		// Hooks fired when the Widget is activated and deactivated
		register_activation_hook( __FILE__, array( $this, 'activate' ) );
		register_deactivation_hook( __FILE__, array( $this, 'deactivate' ) );

		
		parent::__construct(
			$this->get_widget_slug(),
			__( 'Wp Loop', 'wp-loop' ),
			array(
				'classname'  => $this->get_widget_slug().'-class',
				'description' => __( 'Create a loop of any Post, page or Custom Post Type with a lot of options.', 'wp-loop' )
			)
		);

		// Register admin styles and scripts
		add_action( 'admin_print_styles', array( $this, 'register_admin_styles' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'register_admin_scripts' ) );

		// Register site styles and scripts
		add_action( 'wp_enqueue_scripts', array( $this, 'register_widget_styles' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'register_widget_scripts' ) );

		// Refreshing the widget's cached output with each new post
		add_action( 'save_post',    array( $this, 'flush_widget_cache' ) );
		add_action( 'deleted_post', array( $this, 'flush_widget_cache' ) );
		add_action( 'switch_theme', array( $this, 'flush_widget_cache' ) );

	} // end constructor


    /**
     * Return the widget slug.
     *
     * @since    1.0.0
     *
     * @return    Plugin slug variable.
     */
    public function get_widget_slug() {
        return $this->widget_slug;
    }

    public function get_widget_id() {
        return $this->id;
    }

    public static function get_defaults(){

    	$defaults = array(
                'title' => '' , 
                'columns' => '4' ,
                'offset' => '',
                'ntax' => '' ,
                'showposts' => '12' ,
                'imagesize' => 'medium' ,
                'posttype' => 'post' ,
                'exclude' => '' ,
                'terms' => 'category' ,
                'filter' => '10' ,
                'title_number' => '5',
                'excerpt_number' => '10',
                'infinite' => 'auto',
                'hide_filter' => 'no',
                'hide_title' => 'no',

                'hide_image' => 'no',
                'hide_excerpt' => 'no',
                'hide_meta' => 'no',
                'hide_pagination' => 'no',
                'order' => 'DESC',
                'orderby' => 'date'

            );

    	return $defaults;
    }


	/*--------------------------------------------------*/
	/* Widget API Functions
	/*--------------------------------------------------*/

	/**
	 * Outputs the content of the widget.
	 *
	 * @param array args  The array of form elements
	 * @param array instance The current instance of the widget
	 */
	public function widget( $args, $instance ) {

		
		// Check if there is a cached output
		$cache = wp_cache_get( $this->get_widget_slug(), 'widget' );

		if ( !is_array( $cache ) )
			$cache = array();

		if ( ! isset ( $args['widget_id'] ) )
			$args['widget_id'] = $this->id;

		if ( isset ( $cache[ $args['widget_id'] ] ) )
			return print $cache[ $args['widget_id'] ];
		
		// go on with your widget logic, put everything into a string and …


		extract( $args, EXTR_SKIP );

		$widget_string = $before_widget;


		$wploopdefaults = $this->get_defaults();
		foreach($wploopdefaults as $value => $defaultvalue){
			$$value = empty($instance[$value]) ? $defaultvalue : apply_filters($value, $instance[$value]);
		}

		ob_start();
		include( plugin_dir_path( __FILE__ ) . 'views/widget.php' );
		$widget_string .= ob_get_clean();
		$widget_string .= $after_widget;


		$cache[ $args['widget_id'] ] = $widget_string;

		wp_cache_set( $this->get_widget_slug(), $cache, 'widget' );
		$wploop_widget_id = $args['widget_id'];
		           

		print $widget_string;

	} // end widget

	
	public static function wploop_get_cat_slug($taxonomy = 'category') {
	
		$all_categories = get_the_terms(get_the_id(),$taxonomy );
	 	$i = 0;
	 	$wploop_cats_slugs = '';
	 	if($all_categories) :
		 	foreach ($all_categories as $cat) {
		    	$wploop_cats_slugs .= ' ' .  $cat->slug ; 
		    	$i++;
		    	
		        
		          
			}
			return $wploop_cats_slugs;
		endif;
}
	
	public function flush_widget_cache() 
	{
    	wp_cache_delete( $this->get_widget_slug(), 'widget' );
	}
	/**
	 * Processes the widget's options to be saved.
	 *
	 * @param array new_instance The new instance of values to be generated via the update.
	 * @param array old_instance The previous instance of values before the update.
	 */
	public function update( $new_instance, $old_instance ) {

		$instance = $old_instance;
		$instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
		$instance['columns'] = ( ! empty( $new_instance['columns'] ) ) ? strip_tags( $new_instance['columns'] ) : '4';
		$instance['offset'] = ( ! empty( $new_instance['offset'] ) ) ? strip_tags( $new_instance['offset'] ) : '';
		$instance['ntax'] = ( ! empty( $new_instance['ntax'] ) ) ? strip_tags( $new_instance['ntax'] ) : '';
		$instance['showposts'] = ( ! empty( $new_instance['showposts'] ) ) ? strip_tags( $new_instance['showposts'] ) : '12';
		$instance['imagesize'] = ( ! empty( $new_instance['imagesize'] ) ) ? strip_tags( $new_instance['imagesize'] ) : 'medium';
		$instance['posttype'] = ( ! empty( $new_instance['posttype'] ) ) ? strip_tags( $new_instance['posttype'] ) : 'post';
		$instance['exclude'] = ( ! empty( $new_instance['exclude'] ) ) ? strip_tags( $new_instance['exclude'] ) : '';
		$instance['terms'] = ( ! empty( $new_instance['terms'] ) ) ? strip_tags( $new_instance['terms'] ) : 'category';
		$instance['filter'] = ( ! empty( $new_instance['filter'] ) ) ? strip_tags( $new_instance['filter'] ) : '10';
		$instance['title_number'] = ( ! empty( $new_instance['title_number'] ) ) ? strip_tags( $new_instance['title_number'] ) : '5';
		$instance['excerpt_number'] = ( ! empty( $new_instance['excerpt_number'] ) ) ? strip_tags( $new_instance['excerpt_number'] ) : '10';
		$instance['infinite'] = ( ! empty( $new_instance['infinite'] ) ) ? strip_tags( $new_instance['infinite'] ) : 'auto';
		$instance['hide_filter'] = ( ! empty( $new_instance['hide_filter'] ) ) ? strip_tags( $new_instance['hide_filter'] ) : 'no';
		$instance['hide_title'] = ( ! empty( $new_instance['hide_title'] ) ) ? strip_tags( $new_instance['hide_title'] ) : 'no';
		$instance['hide_image'] = ( ! empty( $new_instance['hide_image'] ) ) ? strip_tags( $new_instance['hide_image'] ) : 'no';
		$instance['hide_excerpt'] = ( ! empty( $new_instance['hide_excerpt'] ) ) ? strip_tags( $new_instance['hide_excerpt'] ) : 'no';
		$instance['hide_meta'] = ( ! empty( $new_instance['hide_meta'] ) ) ? strip_tags( $new_instance['hide_meta'] ) : 'no';
		$instance['hide_pagination'] = ( ! empty( $new_instance['hide_pagination'] ) ) ? strip_tags( $new_instance['hide_pagination'] ) : 'no';
		$instance['order'] = ( ! empty( $new_instance['order'] ) ) ? strip_tags( $new_instance['order'] ) : 'DESC';
		$instance['orderby'] = ( ! empty( $new_instance['orderby'] ) ) ? strip_tags( $new_instance['orderby'] ) : 'date';




		return $instance;

	} // end widget

	/**
	 * Generates the administration form for the widget.
	 *
	 * @param array instance The array of keys and values for the widget.
	 */
	public function form( $instance ) {

		$wploopdefaults = $this->get_defaults();

		foreach($wploopdefaults as $value => $defaultvalue){
			if ( isset( $instance[ $value ] ) ) { $$value = $instance[ $value ]; }	else { $$value = $defaultvalue;};
		}

		$instance = wp_parse_args(
            (array)$instance, $wploopdefaults
        );

		

		// Display the admin form
		include( plugin_dir_path(__FILE__) . 'views/admin.php' );
		

	} // end form

	/*--------------------------------------------------*/
	/* Public Functions
	/*--------------------------------------------------*/
	

	


	public function wploop_blog_slider($wploop_image_size){ ?>
			<div class="wploop-blog-slider">
				<div class="wploop-entry-thumbnail ">
					<div class="wploop-in-entry-thumbnail">
						<a data-rel="<?php the_ID(); ?>" class="wploop-post-sharer" href="<?php the_permalink(); ?>">
							<i class="fa fa-plus"></i>
						</a>
							<?php if ( has_post_thumbnail() && ! post_password_required() ) {    
									$image_src = wp_get_attachment_image_src( get_post_thumbnail_id(),$wploop_image_size ); 
									$image_full_src = wp_get_attachment_image_src( get_post_thumbnail_id(),$wploop_image_size ); ?>
							<img  class="showed" src="<?php  echo esc_url($image_src[0])  ?>" alt="" />
							<?php } else { ?>
							<img  class="showed" src="<?php  echo esc_url(plugins_url( 'img/img-placeholder.jpg', __FILE__ ) )  ?>" alt="" />
							<?php	} ?>
						
					</div>
				</div>
			</div>
		
				
	
	<?php }

	

	/**
	 * Loads the Widget's text domain for localization and translation.
	 */
	public function widget_textdomain() {

		
		load_plugin_textdomain( 'wp-loop', false, plugin_dir_path( __FILE__ ) . 'lang/' );

	} // end widget_textdomain

	/**
	 * Fired when the plugin is activated.
	 *
	 * @param  boolean $network_wide True if WPMU superadmin uses "Network Activate" action, false if WPMU is disabled or plugin is activated on an individual blog.
	 */
	public function activate( $network_wide ) {
		
	} // end activate

	/**
	 * Fired when the plugin is deactivated.
	 *
	 * @param boolean $network_wide True if WPMU superadmin uses "Network Activate" action, false if WPMU is disabled or plugin is activated on an individual blog
	 */
	public function deactivate( $network_wide ) {
		
	} // end deactivate

	/**
	*Loads custom inline styles
	*
	*
	*/

	public function include_template(){

		//Load template files
		include( plugin_dir_path(__FILE__) . 'inc/template.php' );
	}



	/**
	* Registers and enqueues admin-specific styles.
	*/
	public function register_admin_styles() {

		wp_enqueue_style( $this->get_widget_slug().'-admin-styles', plugins_url( 'css/admin.css', __FILE__ ) );

	} // end register_admin_styles

	/**
	 * Registers and enqueues admin-specific JavaScript.
	 */
	public function register_admin_scripts() {

		wp_enqueue_script( $this->get_widget_slug().'-admin-script', plugins_url( 'js/admin.js', __FILE__ ), array('jquery') );

	} // end register_admin_scripts

	/**
	 * Registers and enqueues widget-specific styles.
	 */
	public function register_widget_styles() {

		if ( is_active_widget( false, false, $this->get_widget_slug(), true ) ) :

		wp_enqueue_style( $this->get_widget_slug().'_widget_styles', plugins_url( 'css/widget.css', __FILE__ ) );
		wp_enqueue_style( $this->get_widget_slug().'_widget_custom_styles', plugins_url( 'css/custom.css', __FILE__ ) );
		$wploop_columns_array = array( '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' , '10' , '11' , '12' , '13' , '14' , '15' , '16' , '17' , '18' , '19' , '20');
		$columns = 1;
		$wploop_css = '';
		    foreach($wploop_columns_array as $value){
		      $wploop_css .= '.wploop-masonry-';
		      $wploop_css .= $value;
		      $wploop_css .= ' article {
		        width: calc(1/';
		          $wploop_css .= $value;
		          $wploop_css .= ' * 100%);
		}';
		$columns++;
		if($columns == 10) break;
};
		wp_add_inline_style( $this->get_widget_slug().'_widget_custom_styles', $wploop_css );

		endif;

	} // end register_widget_styles

	/**
	 * Registers and enqueues widget-specific scripts.
	 */
	public function register_widget_scripts() {
		
		if ( is_active_widget( false, false, $this->get_widget_slug(), true ) ) :
		
		wp_enqueue_script( $this->get_widget_slug().'-script-isotope', plugins_url( 'js/isotope.js', __FILE__ ), array('jquery') );

		wp_enqueue_script( $this->get_widget_slug().'-script-imagesloaded', plugins_url( 'js/jquery.imagesloaded.js', __FILE__ ), array('jquery' ));

		wp_enqueue_script( $this->get_widget_slug().'-script-infinite', plugins_url( 'js/jquery.infinitescroll.min.js', __FILE__ ), array('jquery'));

		wp_enqueue_script( $this->get_widget_slug().'-script', plugins_url( 'js/widget.js', __FILE__ ), array('jquery')) ;
		
		endif;
		

	} // end register_widget_scripts

} // end class


add_action( 'widgets_init', create_function( '', 'register_widget("WpLoop");' ) );
