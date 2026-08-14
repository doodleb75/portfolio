<?php 

	$custom_query_args = wp_parse_args(array( 
		'posts_per_page' => $showposts,  
		'nopaging' => 0,  
		'post_status' => 'publish', 
		'ignore_sticky_posts' => true, 
		'category_name' => $ntax, 
		'category__not_in' => array($exclude), 
		'offset' => $offset, 
		'order'             => $order,
		'post_type' => $posttype ,
		'orderby' => $orderby
		));

	

	// Get current page and append to custom query parameters array
	if ( get_query_var( 'paged' ) ) {
	    $custom_query_args['paged'] = get_query_var( 'paged' );
	} elseif ( get_query_var( 'page' ) ) {
	    $custom_query_args['paged'] = get_query_var( 'page' );
	} else {
	    $custom_query_args['paged'] = 1;
	}

	// Instantiate custom query
	$custom_query = new WP_Query( $custom_query_args );



	$terms1 = get_terms($terms, array(
				 	'hide_empty' => 1,
					'orderby'  => 'count', 
					'order'             => $order,
					'number' => $filter,
					'parent' => 0,
					'hide_empty' => true,
				 )); 
		       	$count = count($terms1); 
		        if($hide_filter !== 'yes'): 
				echo '<div class="wploop-filter"><ul class="wploop-filter-ul">';  
		        echo '<li ><a class="selected"  href="#" data-filter="*" title=".post">All</a></li>';  
		        if ( $count > 0 ){  
					$replaced = array(' ', '<', '>', '&', '{', '}', '*', 'amp;');
		            foreach ( $terms1 as $term ) {  
		  				$termname = strtolower($term->slug);  
		                echo '<li class="'.esc_html($termname).'"><a href="#" title=".post" data-filter=".'.esc_html($termname).'">'.esc_html($term->name).'</a></li>';  
		            }  
		        }  
		        echo '</ul><div class="clear"></div></div>'; 
		    	endif;

// Output custom query loop
if ( $custom_query->have_posts() ) :  ?>
<div class="wploop-container wploop-<?php echo esc_html($posttype); ?>">
	<div class="wploop-masonry-widget wploop-masonry-<?php echo esc_html($columns); ?> <?php if($infinite == 'auto' || $infinite == 'button') : ?> wploop-infinite-widget<?php endif; ?> <?php if($infinite == 'auto' ) : ?>wploop-infinite-auto<?php endif; ?> <?php if($infinite == 'button' ) : ?>wploop-infinite-button<?php endif; ?>">
		<?php 
			do_action('wploop_before_loop'); 
			while ( $custom_query->have_posts() ) :

		        $custom_query->the_post(); 
		    	$wploop_classes = WpLoop::wploop_get_cat_slug($terms);
		    	$wploop_classes .= ' wploop-masonry-item';


		    	  ?>
					<article id="post-<?php the_ID(); ?>"  <?php post_class($wploop_classes); ?>>
					<div class="wploop-post-container" >
						<div class="wploop-inside-post-container " >
						<?php do_action('wploop_before_content'); ?>
							<?php if(is_sticky( ) && ! is_single() ) : ?>
								<div class="wploop-sticky"><i class="fa fa-star"></i></div>
							<?php endif;  ?>

							<?php if($hide_image == 'no') : WpLoop::wploop_blog_slider($imagesize); endif; ?>

							<div class="wploop-all<?php if ( has_post_thumbnail() && ! post_password_required() ) :  ?>-content content<?php endif; ?> <?php if ( ! has_post_thumbnail() && ! post_password_required() ) :  ?>wploop-top-border<?php endif; ?>">
								<div class="wploop-inside-content">
								<?php if($hide_meta == 'no') : ?>

										<div class="wploop-meta-top">
											<?php 	$category = get_the_terms(get_the_id(), $terms); 
											if($category):
													$term = array_pop($category);
													if($term ){
														echo '<a href="'.esc_url( get_term_link($term->slug , $terms ) ).'">'.esc_html($term->name).'</a>';
													}; 
											endif;	 ?>
										</div>

									<?php endif; ?>
									<!-- Show title -->
									<?php if($hide_title == 'no'): ?>
												<div class="wploop-entry-header">
													<h2 class="wploop-entry-title">
														<a href="<?php the_permalink(); ?>" rel="bookmark"><?php echo wp_trim_words( get_the_title(), $title_number ); ?></a>
													</h2>
												</div>

									<?php endif; 
									//Show Excerpt
									if($hide_excerpt == 'no') :
										?><div class="wploop-excerpt">
											<?php echo wp_trim_words(get_the_excerpt(),$excerpt_number); ?>
										</div> <?php	
									endif; ?>
									<!-- Show meta -->
									
									
									
								</div>
								<div class="clear"></div>
							</div>
							<div class="clear"></div>
							<?php do_action('wploop_after_content'); ?>
						</div>
					</div>
				</article><!-- #post -->

				<?php endwhile; 
				do_action('wploop_after_loop'); ?>
    </div>
    
    </div>		
    <?php endif;  ?>
    <?php if($hide_pagination !== 'yes') : ?>
    <div class="wploop-page-nav" role="navigation">
		<span class="screen-reader-text"><?php __( 'Posts navigation', 'wp-loop' ); ?></span>
		<nav class="wploop-nav-links">

			<?php previous_posts_link( 'Previous Posts' ); ?>
			<?php 	next_posts_link( 'Next Posts', $custom_query->max_num_pages ); ?>
		</nav><!-- .nav-links -->
		<div class="clear"></div>
		<Div class="wploop-no-more-posts"><em><?php esc_html_e( 'No more posts, sorry', 'wp-loop' ); ?></em></Div>
	</div><!-- .navigation -->
	<?php endif;  ?>
<?php  wp_reset_postdata(); ?>