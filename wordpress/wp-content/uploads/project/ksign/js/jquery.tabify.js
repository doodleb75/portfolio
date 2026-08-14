/**
*	@name							Tabify
*	@descripton						Tabbed content with ease
*	@version						1.5
*	@requires						Jquery 1.3.2
*
*	@author							Jan Jarfalk
*	@author-email					jan.jarfalk@unwrongest.com
*	@author-twitter					janjarfalk
*	@author-website					http://www.unwrongest.com
*
*	@licens							MIT License - http://www.opensource.org/licenses/mit-license.php
*/

(function($){ 
     $.fn.extend({  
         tabify: function( callback ) {
         	
			function getHref(el){
				hash = $(el).find('a').attr('href');
				hash = hash.substring(0,hash.length-4);
				return hash;
			}
			
		 	function setActive( tab, ul ){
		 		
				$(tab).addClass('active');
				$(getHref(tab)).show();
				$(tab).siblings('li:not(.blank)').each(function(){
					$(this).removeClass('active');
					$(getHref(this)).hide();
				});

				$(tab).trigger('tab-active.tabify');
				$(ul).trigger('tab-change.tabify');
				
			}
			
			return this.each(function() {
			
				var self = this;
				var oldHash;
				var	callbackArguments 	=	{'ul':$(self)};
					
				$(this).find('li:not(.blank) a').each(function(){
					$(this).attr('href',$(this).attr('href') + '-tab');
				});
				
				function handleHash(){
					
					if(location.hash && location.hash !== oldHash && $(self).find('a[href=' + location.hash + ']').length > 0){
						oldHash = location.hash;				
						setActive($(self).find('a[href=' + location.hash + ']').parent(), self);
					}
				}
				
				if(location.hash){
					handleHash();
				}
					
				setInterval(handleHash,100);
				
				$(this).find('li:not(.blank)').each(function(){
					if($(this).hasClass('active')){
						$(getHref(this)).show();
					} else {
						$(getHref(this)).hide();
					}
				});
				
				if(callback){
					callback(callbackArguments);
				}	
				
            }); 
        } 
    }); 
})(jQuery);