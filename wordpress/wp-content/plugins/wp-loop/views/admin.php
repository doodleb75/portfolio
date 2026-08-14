<p>
		<label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:','wploop-loop' ); ?></label> 
		<input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>" />
	</p>
	<p>
		<label for="<?php echo $this->get_field_id( 'ntax' ); ?>"><?php _e( 'Categories to show, use slugs separated by commas:(Only works when Post Type to use = post)','wploop-loop' ); ?></label>
		<input class="widefat" id="<?php echo $this->get_field_id( 'ntax' ); ?>" name="<?php echo $this->get_field_name( 'ntax' ); ?>" type="text" value="<?php echo esc_attr( $ntax ); ?>" />
	</p>
	<p>
		<label for="<?php echo $this->get_field_id( 'exclude' ); ?>"><?php _e( 'Categories to hide, use ids separated by commas:(Only works when Post Type to use = post)','wploop-loop' ); ?></label> 
		<input class="widefat" id="<?php echo $this->get_field_id( 'exclude' ); ?>" name="<?php echo $this->get_field_name( 'exclude' ); ?>" type="text" value="<?php echo esc_attr( $exclude ); ?>" />
	</p>
	<p>
		<label for="<?php echo $this->get_field_id( 'terms' ); ?>"><?php _e( 'Filter taxonomy','wploop-loop' ); ?></label> 
		<input class="widefat" id="<?php echo $this->get_field_id( 'terms' ); ?>" name="<?php echo $this->get_field_name( 'terms' ); ?>" type="text" value="<?php echo esc_attr( $terms ); ?>" />
	</p>
	<p>
		<label for="<?php echo $this->get_field_id( 'offset' ); ?>"><?php _e( 'Offset, number:','wploop-loop' ); ?></label> 
		<input class="widefat" id="<?php echo $this->get_field_id( 'offset' ); ?>" name="<?php echo $this->get_field_name( 'offset' ); ?>" type="number" value="<?php echo esc_attr( $offset ); ?>" />
	</p>

	<p>
		<label for="<?php echo $this->get_field_id( 'showposts' ); ?>"><?php _e( 'Number of posts to show:','wploop-loop' ); ?></label> 
		<input class="widefat" id="<?php echo $this->get_field_id( 'showposts' ); ?>" name="<?php echo $this->get_field_name( 'showposts' ); ?>"  type="number" value="<?php echo esc_attr( $showposts ); ?>" />
	</p>
	<p>
		<label for="<?php echo $this->get_field_id( 'imagesize' ); ?> "><?php _e('Image Size to use:', 'wploop-loop'); ?></label>
		<select id="<?php echo $this->get_field_id( 'imagesize' ); ?>" name="<?php echo $this->get_field_name( 'imagesize' ); ?>" value="<?php echo esc_attr( $imagesize ); ?>" type="select">
		      <?php $imageoptions = get_intermediate_image_sizes();
				  foreach ($imageoptions as $option) {
					  
					  echo '<option value="' . $option . '" id="' . $option . '"', $imagesize == $option ? ' selected="selected"' : '', '>', $option, '</option>'; } ?>

		</select>
	</p>
	<p>
		<label for="<?php echo $this->get_field_id( 'posttype' ); ?> "><?php _e('Post Type to use:', 'wploop-loop'); ?></label>
		<select id="<?php echo $this->get_field_id( 'posttype' ); ?>" name="<?php echo $this->get_field_name( 'posttype' ); ?>" value="<?php echo esc_attr( $posttype ); ?>" type="select">
		      <?php $mmargs = array(
				   'public'   => true,
				   '_builtin' => false
				);

				$output = 'names'; // names or objects, note names is the default
				$operator = 'and'; // 'and' or 'or'

				$posttypes = get_post_types( $mmargs, $output, $operator );
				array_unshift($posttypes, 'post'); 
				$imageoptions = $posttypes;
				  foreach ($imageoptions as $option) {
					  
					  echo '<option value="' . $option . '" id="' . $option . '"', $posttype == $option ? ' selected="selected"' : '', '>', $option, '</option>'; } ?>

		</select>
	</p>

	<p>
		<label for="<?php echo $this->get_field_id( 'order' ); ?> "><?php _e('Order:', 'wploop-loop'); ?></label>
		<select id="<?php echo $this->get_field_id( 'order' ); ?>" name="<?php echo $this->get_field_name( 'order' ); ?>" value="<?php echo esc_attr( $order ); ?>" type="select">
		      <?php  // 'and' or 'or'

				$orders = array('ASC' => 'Ascendent', 'DESC' => 'Descendant');
				$imageoptions = $orders;
				  foreach ($imageoptions as $option => $value) {
					  
					  echo '<option value="' . $option . '" id="' . $option . '"', $order == $option ? ' selected="selected"' : '', '>', $value, '</option>'; } ?>

		</select>
	</p>

	<p>
		<label for="<?php echo $this->get_field_id( 'orderby' ); ?> "><?php _e('Order by:', 'wploop-loop'); ?></label>
		<select id="<?php echo $this->get_field_id( 'orderby' ); ?>" name="<?php echo $this->get_field_name( 'orderby' ); ?>" value="<?php echo esc_attr( $orderby ); ?>" type="select">
		      <?php  // 'and' or 'or'

				$ordersby = array(
					'none' => 'None', 
					'ID' => 'Id',
					'author' => 'Author',
					'title' => 'Title',
					'name' => 'Name',
					'type'=> 'Type',
					'date'=> 'Date',
					'modified'=> 'Modified',
					'parent'=> 'Parent',
					'rand'=> 'Random',
					'comment_count'=> 'Comment count',
					'menu_order'=> 'Menu order',
					'meta_value' => 'Meta value',
					'meta_value_num'=> 'Meta value number',
					'post_in' => 'Post in'
					);
				foreach ($ordersby as $option => $value) {
					  
					  echo '<option value="' . $option . '" id="' . $option . '"', $orderby == $option ? ' selected="selected"' : '', '>', $value, '</option>'; } ?>

		</select>
	</p>
	<p>
		<label for="<?php echo $this->get_field_id( 'columns' ); ?> "><?php _e('Columns to use:', 'wploop-loop'); ?></label>
		<input  id="<?php echo $this->get_field_id( 'columns' ); ?>" name="<?php echo $this->get_field_name( 'columns' ); ?>" min="1"  type="number" value="<?php echo esc_attr( $columns ); ?>" />
	</p>

	<p>
		<label for="<?php echo $this->get_field_id( 'filter' ); ?>"><?php _e( 'Filter, number:','wploop-loop' ); ?></label> 
		<input class="widefat" id="<?php echo $this->get_field_id( 'filter' ); ?>" name="<?php echo $this->get_field_name( 'filter' ); ?>" type="number" value="<?php echo esc_attr( $filter ); ?>" />
	</p>
	<p>
		<label for="<?php echo $this->get_field_id( 'title_number' ); ?>"><?php _e( 'Title Words, number:','wploop-loop' ); ?></label> 
		<input class="widefat" id="<?php echo $this->get_field_id( 'title_number' ); ?>" name="<?php echo $this->get_field_name( 'title_number' ); ?>" type="number" value="<?php echo esc_attr( $title_number ); ?>" />
	</p>
	<p>
		<label for="<?php echo $this->get_field_id( 'excerpt_number' ); ?>"><?php _e( 'Excerpt Words, number:','wploop-loop' ); ?></label> 
		<input class="widefat" id="<?php echo $this->get_field_id( 'excerpt_number' ); ?>" name="<?php echo $this->get_field_name( 'excerpt_number' ); ?>" type="number" value="<?php echo esc_attr( $excerpt_number ); ?>" />
	</p>
	<p>
		<label for="<?php echo $this->get_field_id( 'infinite' ); ?> "><?php _e('Infinite Scroll:', 'wploop-loop'); ?></label>
		<select id="<?php echo $this->get_field_id( 'infinite' ); ?>" name="<?php echo $this->get_field_name( 'infinite' ); ?>" value="<?php echo esc_attr( $infinite ); ?>" type="select">
		      <?php $imageoptions = array(
		      	'no' => 'no',
		      	'button' => 'button',
		      	'auto' => 'auto');
				  foreach ($imageoptions as $option) {
					  
					  echo '<option value="' . $option . '" id="' . $option . '"', $infinite == $option ? ' selected="selected"' : '', '>', $option, '</option>'; } ?>

		</select>
	</p>
	<p>
		<label ><?php _e( 'Widget Design Options','wploop-loop' ); ?></label> 
	</p>
	<p>
		<label for="<?php echo $this->get_field_id( 'hide_filter' ); ?> "><?php _e('Hide Categories Filter:', 'wploop-loop'); ?></label>
		<select id="<?php echo $this->get_field_id( 'hide_filter' ); ?>" name="<?php echo $this->get_field_name( 'hide_filter' ); ?>" value="<?php echo esc_attr( $hide_filter ); ?>" type="select">
		      <?php $imageoptions = array('yes' => 'yes',
		      								'no' => 'no');
				  foreach ($imageoptions as $option) {
					  
					  echo '<option value="' . $option . '" id="' . $option . '"', $hide_filter == $option ? ' selected="selected"' : '', '>', $option, '</option>'; } ?>

		</select>
	</p>

	
	<p>
		<label for="<?php echo $this->get_field_id( 'hide_title' ); ?> "><?php _e('Hide Title:', 'wploop-loop'); ?></label>
		<select id="<?php echo $this->get_field_id( 'hide_title' ); ?>" name="<?php echo $this->get_field_name( 'hide_title' ); ?>" value="<?php echo esc_attr( $hide_title ); ?>" type="select">
		      <?php $imageoptions = array('yes' => 'yes',
		      								'no' => 'no');
				  foreach ($imageoptions as $option) {
					  
					  echo '<option value="' . $option . '" id="' . $option . '"', $hide_title == $option ? ' selected="selected"' : '', '>', $option, '</option>'; } ?>

		</select>
	</p>
	<p>
		<label for="<?php echo $this->get_field_id( 'hide_image' ); ?> "><?php _e('Hide Image:', 'wploop-loop'); ?></label>
		<select id="<?php echo $this->get_field_id( 'hide_image' ); ?>" name="<?php echo $this->get_field_name( 'hide_image' ); ?>" value="<?php echo esc_attr( $hide_image ); ?>" type="select">
		      <?php $imageoptions = array('yes' => 'yes',
		      								'no' => 'no');
				  foreach ($imageoptions as $option) {
					  
					  echo '<option value="' . $option . '" id="' . $option . '"', $hide_image == $option ? ' selected="selected"' : '', '>', $option, '</option>'; } ?>

		</select>
	</p>
	<p>
		<label for="<?php echo $this->get_field_id( 'hide_excerpt' ); ?> "><?php _e('Hide Excerpt:', 'wploop-loop'); ?></label>
		<select id="<?php echo $this->get_field_id( 'hide_excerpt' ); ?>" name="<?php echo $this->get_field_name( 'hide_excerpt' ); ?>" value="<?php echo esc_attr( $hide_excerpt ); ?>" type="select">
		      <?php $imageoptions = array('yes' => 'yes',
		      								'no' => 'no');
				  foreach ($imageoptions as $option) {
					  
					  echo '<option value="' . $option . '" id="' . $option . '"', $hide_excerpt == $option ? ' selected="selected"' : '', '>', $option, '</option>'; } ?>

		</select>
	</p>
	<p>
		<label for="<?php echo $this->get_field_id( 'hide_meta' ); ?> "><?php _e('Hide Meta:', 'wploop-loop'); ?></label>
		<select id="<?php echo $this->get_field_id( 'hide_meta' ); ?>" name="<?php echo $this->get_field_name( 'hide_meta' ); ?>" value="<?php echo esc_attr( $hide_meta ); ?>" type="select">
		      <?php $imageoptions = array('yes' => 'yes',
		      								'no' => 'no');
				  foreach ($imageoptions as $option) {
					  
					  echo '<option value="' . $option . '" id="' . $option . '"', $hide_meta == $option ? ' selected="selected"' : '', '>', $option, '</option>'; } ?>

		</select>
	</p>

	<p>
		<label for="<?php echo $this->get_field_id( 'hide_pagination' ); ?> "><?php _e('Hide Pagination:', 'wploop-loop'); ?></label>
		<select id="<?php echo $this->get_field_id( 'hide_pagination' ); ?>" name="<?php echo $this->get_field_name( 'hide_pagination' ); ?>" value="<?php echo esc_attr( $hide_pagination ); ?>" type="select">
		      <?php $imageoptions = array('yes' => 'yes',
		      								'no' => 'no');
				  foreach ($imageoptions as $option) {
					  
					  echo '<option value="' . $option . '" id="' . $option . '"', $hide_pagination == $option ? ' selected="selected"' : '', '>', $option, '</option>'; } ?>

		</select>
	</p>