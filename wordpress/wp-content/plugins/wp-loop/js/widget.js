(function($) {
    "use strict";
    $(function() {
        function wploopnewswall() {
            var wploopcontainer = $('.wploop-masonry-widget');
            wploopcontainer.imagesLoaded(function() {
                wploopcontainer.isotope({
                    itemSelector: 'article.wploop-masonry-item'
                }).isotope('layout').css({
                    'visibility': 'visible'
                });
            });
        }
        // Button Infinite Scroll
        function wploopinfinitewall() {
            var wploopcontainer = $('.wploop-infinite-widget');
            wploopcontainer.infinitescroll({
                loading: {
            finished: function() {
                $('nav.wploop-nav-links').show();
                $('.wploop-loading').remove();
            },
            finishedMsg: '',
            msg: $('<div class="wploop-loading"><div></div></div>'),
            msgText: '',
            img:'',
            selector: '.wploop-page-nav',
            speed: 'fast',
            start: undefined
        },
                navSelector: 'nav.wploop-nav-links',
                nextSelector: 'nav.wploop-nav-links   a',
                itemSelector: 'article.wploop-masonry-item', // selector for all items you'll retrieve
                debug: false,
                errorCallback: function(){
                    $('nav.wploop-nav-links').remove();
                $('.wploop-loading').remove();
                $('.wploop-page-nav').addClass('wploop-endofpage').delay(2000).fadeOut();
                }
            }, function(newElements, navSelector) {
                var $newElems = $(newElements);
                $newElems.hide();
               
                
                $newElems.imagesLoaded(function() {
                    if ($('.wploop-masonry-widget').length > 0) {
                        wploopcontainer.isotope('appended', $newElems);
                    }
                    
                    
                    $newElems.show();
                });
            });
            if ($('.wploop-infinite-button').length > 0) {
                $(window).unbind('.infscr');
            }
            if ($('.wploop-infinite-button').length > 0) {
                $('nav.wploop-nav-links a:last').click(function() {
                    
                    var wploopcontainer = $('.wploop-infinite-widget');
                    wploopcontainer.infinitescroll('retrieve');
                    if ($('.wploop-masonry-widget').length > 0) {
                        wploopcontainer.isotope('layout');
                    }
                    
                    $(window).unbind('.infscr');
                    return false;
                });
            }
        }
        //Filter masonry layout
        function wploopfilterelems() {
            $('.wploop-filter').on('click', 'a', function() {
                $('.wploop-filter a').removeClass("selected");
                $(this).addClass('selected');
                var filterValue = $(this).attr('data-filter');
                var wploopcontainer = $('.wploop-masonry-widget');
                wploopcontainer.isotope({
                    filter: filterValue
                });
            });
        }

        


        $(window).load(function() {
            wploopnewswall();
            wploopinfinitewall();
            wploopfilterelems();
        });
        $(window).ajaxComplete(function() {
            wploopnewswall();
        });
        $('body').resize(function() {
            var wploopcontainer = $('.wploop-infinitewidget');
            if ($('.wploop-masonrywidget').length > 0) {
                wploopcontainer.isotope('layout');
            }
        });
    });
}(jQuery));