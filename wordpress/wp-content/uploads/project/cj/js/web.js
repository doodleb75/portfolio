$(document).ready(function(){
closetimer = 0;

	if($("#nav")) {

		$("#nav li div").each(function(i) {
		eheight = $(this).height();
		$(this).children().css("top",-eheight+"px");
		});

		$("#nav li.nosub").mouseover(function() {
			eheight = $("#nav b.clicked").next().children().height()+20;
			$("#nav b.clicked").next().children().animate({"top":-eheight+"px"}, {queue:false,duration:(300)});
			$("#nav b.clicked").next().slideUp(500);
			$("#nav b").removeClass("clicked");
		});

		$("#nav b").mouseover(function() {
		clearTimeout(closetimer);
			if(this.className.indexOf("clicked") != -1) {
				eheight = $(this).next().children().height()+20;
				$(this).next().children().animate({"top": -eheight+"px"}, {queue:false,duration:(300)}, "swing");
				$(this).next().slideUp(500);
				$(this).removeClass("clicked");
				//$(this).({filter:progid:DXImageTransform.Microsoft.BasicImage(grayScale=1)});
			}
			else {
				eheight = $("#nav b.clicked").next().children().height()+20;
				$("#nav b.clicked").next().children().animate({"top": -eheight+"px"}, {queue:false,duration:(300)}, "swing");
				$("#nav b.clicked").next().slideUp(500);
				$("#nav b").removeClass();
				$(this).addClass("clicked");
				$(this).next().slideDown(100);
				eheight = $("#nav b.clicked").next().children().height();
				$(this).next().children().animate({"top":"0px"}, {queue:false,duration:(300)}, "swing");
			}
		});
		$("#nav").mouseover(function() {
		clearTimeout(closetimer);
		});
		$("#nav").mouseout(function() {
			closetimer = window.setTimeout(function(){
			eheight = $("#nav b.clicked").next().children().height()+20;
			$("#nav b.clicked").next().children().animate({"top":-eheight+"px"}, {queue:false,duration:(300)}, "swing");
			$("#nav b.clicked").next().slideUp(500);
			$("#nav b").removeClass("clicked");
			}, 2000);
		}); 
	}
});
