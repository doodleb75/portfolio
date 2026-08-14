=== Easy Flash Embed ===
Contributors: vincent-boiardt
Tags: flash, embed, embedding, swfobject, swf, shortcode
Requires at least: 2.9
Tested up to: 2.9.2
Stable tag: 1.0

Embed Flash easily and standard compliant with SWFObject using only a [swf] shortcode!

== Description ==

Embed Flash easily and standard compliant with SWFObject using only a [swf] shortcode!

In the text editor simply write something like:

[swf src="http://www.example.com/my-flash-file.swf" width=300 height=100]

The attributes *src*, *width* and *height* are **required**

Additional attributes includes:

* *params*
* *flashvars*
* *version*

The attributes *params*, and *flashvars* should be written like "flashvar1=value&flashvar2=value" to function properly. If you want to specify a Flash version use *version* attribute. **Default is 9**.

To provide alternative content for people without Flash, simply put some text between the [swf] brackets, e.g.

[swf src="http://www.example.com/my-flash-file.swf" width=300 height=100]You must have Flash to view this file[/swf]

== Installation ==

1. Upload `/easy-flash-embed/` to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Use the [swf] shortcode in the text editor as described in the description

`<?php code(); // goes in backticks ?>`