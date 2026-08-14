=== Wp Loop ===

Contributors: mimothemes
Donate link: http://mimo.media/
Tags: grid, masonry,columns,woocommerce masonry, loop,custom post types, infinite scroll,ajax load post, brick layout, grid layout, infinity scroll, jquery masonry plugin, masonry, woocommerce, WooCommerce Product Display, WooCommerce Product, WooCommerce Products, WooCommerce Shop Page,portfolio display, products grid,procuts masonry view,woocommerce masonry,woocommerce grid,custom post types grid, custom port type,category filter, filter, list grid, products filter, tags filter, taxonomy filter
Requires at least: 4.3
Tested up to: 4.5.2
Stable tag: 1.2.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Creates a Widget to display a Masonry, Infinite scroll, filterable loop of posts or whatever custom post type you have. Includes 1-20 columns layout.

== Description ==

This plugin adds a widget to your Wordpress site called Wp Loop, publish this widget wherever needed and set its options, it creates a Wordpress Query Loop that has Grid Layout(Isotope) and can be filtered with ajax(Isotope Filtering), it can display any CPT and has a bunch of design options and loop customizations:

<ul>
	<li>-Title: Title of the widget</li>
	<li>-Categories to show, use slugs separated by commas: Which categories to include in the loop, they can be custom post types categories</li>
	<li>-Categories to hide, use ids separated by commas: The categories to hide, here you need to use id's</li>
	<li>-Filter taxonomyIf you need to filter the loop(ajax filter), write here wchich term you need to filter.</li>

	<li>-Offset, number: Write the number for offset in the loop, this means the number of post you need to jump from beginning.</li>
	<li>-Number of posts to show: Posts per page</li>
	<li>-Image Size to use: This will list all available image sizes in theme, so choose which you prefer</li>
	<li>-Post Type to use: This field will list all available post types in theme for you to choose one</li>
	<li>-Order: Order of loop</li>
	<li>-Order by: Order by</li>
	<li>-Columns to use: You can set here until 20 columns</li>
	<li>-Title Words, number: How many words to show in title of posts</li>
	<li>-Excerpt Words, number: How many words to show in excerpt of posts</li>
	<li>-Infinite Scroll: Choose to No, Button or Auto(the infinite scroll triggers when you scroll down the page)</li>
</ul>



*Note:* This plugin will be discontinued shortly, just changed to construct a loop, but not a masonry. You can continue using this plugin features with my new plugin [Mimo Masonry](https://wordpress.org/plugins/mimo-masonry/)

== Installation ==


1. Upload `wp-loop` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Follow usage instructions, just plublish the Wp Loop Widget and set its options.

== Frequently Asked Questions ==

= Do this plugin work with all kind of custom post types? =

Yes, it is intended to read the post types in your Wordpress site and list them for you to choose in each Wp Loop widget.


== Upgrade Notice == 

No upgrades yet

== Changelog ==

= 1.2.2 =

Filtering issue solved
Order and Orderby issues solved

= 1.2.1 =

Css fixes

= 1.2.0 =

Css fixes

= 1.0.4 =

Fixed bug in widget saving options

= 1.0.3 =

Fixed bug with infinite scroll

= 1.0.2 =

Fixed bug, grid was not working properly with custom post types

= 1.0.1 =

Fixed minor css bug

= 1.0 =

First Version

== Screenshots ==

1. Shows the widget administration options
2. Shows widget Frontend

== Usage instructions ==

Just publish the widget wherever needed. It works great with Site Origin Panels plugin to create full layouts.

== Developer instructions ==

Apart from the options inside widget you can manipulate the before/after loop and articles content with this actions:

do_action('wploop_before_content'); // The beginnning of content inside each article
do_action('wploop_after_content'); // The end of content inside each article
do_action('wploop_before_loop'); // Out of the loop
do_action('wploop_after_loop'); // Out of the loop

Find plugin and issues solved at http://mimo.studio or fork it on Github at https://github.com/mimomedia/wp-loop

