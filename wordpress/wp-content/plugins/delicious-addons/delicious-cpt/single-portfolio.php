<?php get_header(); ?>
	<?php
	$dt_data = delicious_del_data();
	?>

	<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
	
	<?php get_template_part( 'inc/page-title' ); ?>
	

		<section class="portfolio-single container">
			<article id="post-<?php esc_attr(the_ID()); ?>" class="begin-content">

			<div class="clear"></div>

			<?php the_content(); ?>		
		
			</article>
		</section>
		
		<div class="clear"></div>

	<div class="space"></div>

<?php if(isset($dt_data['stag_proj_nav_enabled'])&& ($dt_data['stag_proj_nav_enabled'] == 1)) { ?>
	<div class="projnav-wrapper">
		<ul class="projnav container">

			<li class="previous">
				<?php 
					if(isset($dt_data['stag_portfolio_nav_behaviour'])&& ($dt_data['stag_portfolio_nav_behaviour'] == 'same-category')) { 

						next_post_link('%link', '<em>'. esc_html__('Previous Project', 'delicious').'</em><span>%title</span>', TRUE, ' ', 'portfolio_cats'); 
					} else {
						next_post_link('%link', '<em>'. esc_html__('Previous Project', 'delicious').'</em><span>%title</span>'); 
					}
				?>
			</li>
			<li>
				<a href="<?php if((isset($dt_data['stag_portfolio_back_link'])) && ($dt_data['stag_portfolio_back_link'] !='')) { echo esc_url($dt_data['stag_portfolio_back_link']); } else {  echo esc_url(home_url('/')); } ?>"><img src="<?php echo get_template_directory_uri() ?>/assets/images/grid.svg" alt=""/></a>
			</li>
			<li class="next">

				<?php 
					if(isset($dt_data['stag_portfolio_nav_behaviour'])&& ($dt_data['stag_portfolio_nav_behaviour'] == 'same-category')) { 

						previous_post_link('%link', '<em>'. esc_html__('Next Project', 'delicious').'</em><span>%title</span>', TRUE, ' ', 'portfolio_cats'); 
					} else {
						previous_post_link('%link', '<em>'. esc_html__('Next Project', 'delicious').'</em><span>%title</span>');
					}
				?>
			</li>				
		</ul>		
	</div>
<?php } ?>

	<?php endwhile; endif; ?>	

<?php get_footer(); ?>