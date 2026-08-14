<?php
if(!class_exists("DeliciousCPT")){

class DeliciousCPT {
    
    public function __construct()
    {

        add_action( 'init', array( $this, 'delicious_register_post_type'));
        add_action( 'init', array( $this, 'delicious_taxonomies'));
        add_action( 'init', array( $this, 'delicious_link_to_cpt'));
        add_action( 'admin_menu', array( $this, 'delicious_remove_meta_boxes') );

        add_filter( 'single_template', array( $this, 'delicious_portfolio_single'));    
        register_activation_hook( __FILE__, array( $this,'delicious_flush_rewrite_rules') );
        register_deactivation_hook( __FILE__, array( $this,'delicious_flush_rewrite_rules') );
    }

    public function delicious_register_post_type()
    {
        $args = array();
        $dt_data = delicious_del_data();
        // Portfolio
        $args['post-type-portfolio'] = array(
            'labels' => array(
                'name' => esc_html__( 'Projects', 'delicious' ),
                'singular_name' => esc_html__( 'Portfolio', 'delicious' ),
                'all_items' => esc_html__( 'Projects', 'delicious' ),
                'add_new' => esc_html__( 'Add New', 'delicious' ),
                'add_new_item' => esc_html__( 'Add New Portfolio Item', 'delicious' ),
                'edit_item' => esc_html__( 'Edit Project', 'delicious' ),
                'new_item' => esc_html__( 'New Project', 'delicious' ),
                'view_item' => esc_html__( 'View Project', 'delicious' ),
                'search_items' => esc_html__( 'Search Projects', 'delicious' ),
                'not_found' => esc_html__( 'No projects found', 'delicious' ),
                'not_found_in_trash' => esc_html__( 'No projects found in Trash', 'delicious' ),
                'parent_item_colon' => esc_html__( 'Parent Portfolio:', 'delicious' ),
                'menu_name' => esc_html__( 'Portfolio', 'delicious' ),
            ),        
            'hierarchical' => false,
            'description' => esc_html__( 'Add your Projects', 'delicious' ),
            'supports' => array( 'title', 'editor', 'thumbnail', 'revisions' ),
            'taxonomies' => array('portfolio_cats'),
            'menu_icon' =>  'dashicons-portfolio',
            'show_ui' => true,
            'public' => true,
            'publicly_queryable' => true,
            'exclude_from_search' => false,
            'query_var' => 'portfolio',
            'rewrite' => array('slug' => $dt_data['stag_portfolio_slug'], 'with_front' => false)
            );


        // Register post type: name, arguments
        register_post_type('portfolio', $args['post-type-portfolio']);
    }

    public function delicious_taxonomies() {
        $taxonomies = array();

        $taxonomies['taxonomy-portfolio_cats'] = array(
            'labels' => array(
                'name' => esc_html__( 'Portfolio Categories', 'delicious' ),
                'singular_name' => esc_html__( 'Portfolio Category', 'delicious' ),
                'search_items' =>  esc_html__( 'Search Portfolio Categories', 'delicious' ),
                'all_items' => esc_html__( 'All Portfolio Categories', 'delicious' ),
                'parent_item' => esc_html__( 'Parent Portfolio Category', 'delicious' ),
                'parent_item_colon' => esc_html__( 'Parent Portfolio Category:', 'delicious' ),
                'edit_item' => esc_html__( 'Edit Portfolio Category', 'delicious' ),
                'update_item' => esc_html__( 'Update Portfolio Category', 'delicious' ),
                'add_new_item' => esc_html__( 'Add New Portfolio Category', 'delicious' ),
                'new_item_name' => esc_html__( 'New Portfolio Category Name', 'delicious' ),
                'choose_from_most_used' => esc_html__( 'Choose from the most used portfolio categories', 'delicious' )
            ),
            'hierarchical' => true,
            'query_var' => true,
            'rewrite' => array( 'slug' => 'portfolio-category' )
        );

        // Register taxonomy: name, cpt, arguments
        register_taxonomy('portfolio_cats', array('portfolio'), $taxonomies['taxonomy-portfolio_cats']);
    }

    public function delicious_flush_rewrite_rules() {
        delicious_register_post_type();
        flush_rewrite_rules();
    }

    // Link taxonomy to cpt
    public function delicious_link_to_cpt() {
        register_taxonomy_for_object_type('portfolio_cats', 'portfolio');
    }   

    // Remove Tags Meta Boxes from Project Pages
    public function delicious_remove_meta_boxes() {
            if (is_admin()) :
                remove_meta_box('tagsdiv-portfolio_cats', 'portfolio', 'side');
            endif;
        }

    // Create Portfolio Template
    function delicious_portfolio_single($single_template) {
         global $post;

         if ($post->post_type == 'portfolio') {
              $single_template = plugin_dir_path( __FILE__ ) . '/single-portfolio.php';
         }
         return $single_template;
    }     

}

new DeliciousCPT();

// Get Portfolio category ID
function delicious_get_taxonomy_cat_ID( $cat_name='General' ) {
    $cat = get_term_by( 'name', $cat_name, 'portfolio_cats' );
    if ( $cat )
        return $cat->term_id;
    return 0;
}

}
?>