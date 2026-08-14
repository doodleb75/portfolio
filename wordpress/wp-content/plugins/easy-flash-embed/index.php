<?php
/*
Plugin Name: Easy Flash Embed
Description: Embed Flash easily and standard compliant with SWFObject using only a [swf] shortcode!
Version: 1.0
Author: Vincent Boiardt
Author URI: http://www.boiardt.se
Plugin URI: http://wpquicktips.wordpress.com/easy-flash-embedding
*/

function efe_setup_globals($atts){
	global $efe;
	
	$efe = array(
		"css_class" => "efe-flash",
		"css_id" => "efe-swf-",
		"count" => 1,
		"swfs" => array()
	);
	$efe = (object)$efe;
}
add_action("plugins_loaded", "efe_setup_globals", 1);
add_action("admin_menu", "efe_setup_globals", 1);

function efe_init(){
	wp_enqueue_script("swfobject");
}
add_action("init", "efe_init");

function efe_wp_footer(){
	global $efe;
	echo "<script type=\"text/javascript\">\n";
	echo "//<![CDATA[\n";
	foreach($efe->swfs as $swf){
		echo "swfobject.embedSWF(\"" . $swf->src . "\", \"" . $swf->replace_id . "\", \"" . $swf->width . "\", \"" . $swf->height . "\", \"" . $swf->version . "\", false, " . ( $swf->flashvars ? json_encode($swf->flashvars) : "false" ) . ", " . ( $swf->params ? json_encode($swf->params) : "false" ) . ");\n";
	}
	echo "//]]>\n";
	echo "</script>";
}
add_action("wp_footer", "efe_wp_footer");

function efe_shortcode($atts, $content = false){
	global $efe;
	
	$args = shortcode_atts(array(
		"src" => false,
		"width" => false,
		"height" => false,
		"flashvars" => false,
		"params" => false,
		"version" => "9"
	), $atts);
	
	extract($args);
	
	if(!$src || !$width || !$height)
		return "";
	
	if($params) $args["params"] = wp_parse_args(html_entity_decode($params), false);
	if($flashvars) $args["flashvars"] = wp_parse_args(html_entity_decode($flashvars), false);
	
	$id = $efe->css_id . $efe->count;
	$efe->swfs[] = (object)array_merge($args, array(
		"replace_id" => $id
	));
	
	$efe->count++;
	
	return "<div id=\"" . $id . "\" class=\"" . $efe->css_class . "\">" . ($content ? $content : "<!-- -->") . "</div>";
}
add_shortcode("swf", "efe_shortcode");
?>