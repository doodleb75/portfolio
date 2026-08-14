
/* 변수로 활성화 설정 네비게이션 시작 -------------------------------------------------*/

function NaviGnb(){
	$("#gnb>li").hover(function(){
		clearGnb();

		$(this).addClass("on");
		var gnb_img = $(this).find(".gnb_menu img");
		gnb_img.attr("src", function(){
			return this.src.replace("_off.gif", "_on.gif");
		});
	},function(){
		$("#gnb>li").removeClass("on");
		var gnb_img = $(this).find(".gnb_menu img");
		gnb_img.attr("src", function(){
			return this.src.replace("_on.gif", "_off.gif");
		});
		
		gnbInit();
	});

	$("#gnb li ul li img").filter(function(){
		if(this.src.substr((this.src.length)-8) == "_off.gif"){
			$(this).hover(function(){
				this.src = this.src.replace("_off.gif", "_on.gif");
			},
			function(){
				this.src = this.src.replace("_on.gif", "_off.gif");
			});
		}
	});
}

function NaviLnb(){
	/*$("#lnb li").click(function(){
		$("#lnb li ul").removeClass("on");
		$("#lnb li img").not($("#lnb li ul li img")).attr("src", function(){
			return this.src.replace("_on.gif", "_off.gif");
		});

		$(this).children("ul").addClass("on");
		$(this).find("a>img").not($("#lnb li ul li img")).attr("src", function(){
			return this.src.replace("_off.gif", "_on.gif");
		});
	})*/

	$("#lnb img").each(function(n){
		if(n==gnb_depth2){
			this.src = this.src.replace("_off.gif", "_on.gif");
		}
		if(this.src.substr((this.src.length)-8) == "_off.gif"){
			$(this).hover(function(){
				this.src = this.src.replace("_off.gif", "_on.gif");
			},
			function(){
				this.src = this.src.replace("_on.gif", "_off.gif");
			});
		}
	});
}

function clearGnb(){
	$("#gnb>li").each(function(index) {
		$(this).removeClass("on");
		var gnb_img = $(this).find(".gnb_menu img");
		gnb_img.attr("src", function(){
			return this.src.replace("_on.gif", "_off.gif");
		});
	});
}

function gnbInit(){
	$("#gnb>li").each(function(n) {
		if( n == gnb_depth1)
		{
			$(this).addClass("on");
			$(this).find(".gnb_menu img").attr("src", function(){
				return this.src.replace("_off.gif", "_on.gif");
			});

			$(this).find("ul li img").each(function(n){
				if(n==gnb_depth2){
					$(this).attr("src", function(){
						return this.src.replace("_off.gif", "_on.gif");
					});
				}
			});
		}
	});
}

/* 끝 --------------------------------------------------------------------- */


/* 단순한 오버 이벤트 네비게이션 시작 -----------------------------------------------*/

function GnbEvent(){
	var depth1 = $("#gnb > li");
	var depth2 = $("#gnb li div.depth2");
	depth2.hide();

	depth1.each(function(n){
		$(this).find("div.depth2").hide();
		$(this).mouseenter(function(){
			$(this).find(">a img").attr("src", function(){
				return this.src.replace("_off.gif", "_on.gif");
			});
			$(this).find("div.depth2").show();
		});
		$(this).mouseleave(function(){
			$(this).find("img").attr("src", function(){
				return this.src.replace("_on.gif", "_off.gif");
			});
			$(this).find("div.depth2").hide();
		});
	});

	depth2.find("img").filter(function(){
		if(this.src.substr((this.src.length)-8) == "_off.gif"){
			$(this).hover(function(){
				this.src = this.src.replace("_off.gif", "_on.gif");
			},
			function(){
				this.src = this.src.replace("_on.gif", "_off.gif");
			});
		}
	});
}

function GnbActive(d1,d2){
	var subBg = $("#gnbWrap .bg_gnb_d2");
	var depth1 = $("#gnb li:eq("+d1+") a");
	var depth2 = $("#gnb li ul li:eq("+d2+") a");
	depth1.mouseenter();
	depth1.addClass("on");
	depth2.addClass("on");
}

function LnbEvent(){
	var article = $('#lnb li');
	var overObj = $('#lnb li a');
	article.attr("status","hide");
	article.find('ul').hide();

	$('#lnb li a.d1').click(function(){
		var myArticle = $(this).parents('li:first');
		if(myArticle.attr("status") == "hide"){
			article.attr("status","hide"); // 아코디언 효과를 원치 않으면 이 라인을 지우세요
			article.find('ul').hide(); // 아코디언 효과를 원치 않으면 이 라인을 지우세요
			myArticle.attr("status","show");
			myArticle.find('ul').show();
		} else {
			myArticle.attr("status","hide");
			myArticle.find('ul').hide();
		}
	});

	overObj.mouseover(function(){
		$(this).find("img").attr("src",($(this).find("img").attr("src")).replace("_off","_on"));
	});

	overObj.mouseout(function(){
		$(this).find("img").attr("src",($(this).find("img").attr("src")).replace("_on","_off"));
	});
}

/* 끝 --------------------------------------------------------------------- */


/* FAQ 탭메뉴 */
function tabMenu(index){
	var tabBtn = $(".tabMenu img");

	tabBtn.each(function(n){
		if(n==index){
			this.src = this.src.replace("_off.gif","_on.gif");
			$(this).attr("status","on");
		}
		$(this).click(function(){
			tabBtn.each(function(n){
				this.src = this.src.replace("_on.gif","_off.gif");
				$(this).attr("status", "off");
			});
			if ($(this).attr("status") == "off") {
				this.src = this.src.replace("_off.gif","_on.gif");
				$(this).attr("status", "on");
			}
		});
	})
}

/* FAQ 리스트 */
function faqList(){
	var article = $('.faqList .article');
	var overObj = $('.faqList .article .faqQ');
	article.attr("status","hide");
	article.find('.faqA').hide();

	overObj.click(function(){
		var myArticle = $(this).parents('.article:first');
		if(myArticle.attr("status") == "hide"){
			article.attr("status","hide"); // 아코디언 효과를 원치 않으면 이 라인을 지우세요
			article.find('.faqA').hide(); // 아코디언 효과를 원치 않으면 이 라인을 지우세요
			article.find('td').removeClass("brdB");
			myArticle.attr("status","show");
			myArticle.find('.faqA').show();
			myArticle.find('td').addClass("brdB");
		} else {
			myArticle.attr("status","hide");
			myArticle.find('.faqA').hide();
			myArticle.find('td').removeClass("brdB");
		}
	});
}

/* 서비스개요 탭메뉴*/
function tabMenu2(index){
	var tabBtn = $(".tabMenu2 li");

	tabBtn.each(function(n){
		if(n==index){
			$(this).addClass("on");
			$(this).attr("status","on");
		}
		$(this).click(function(){
			tabBtn.each(function(n){
				$(this).removeClass("on");
				$(this).attr("status", "off");
			});
			if ($(this).attr("status") == "off") {
				$(this).addClass("on");
				$(this).attr("status", "on");
			}
		});
	})
}




/* 함수실행 */
jQuery(document).ready(function(){
	//NaviGnb();
	NaviLnb();
	GnbEvent();
	tabMenu(0);
	faqList();
	tabMenu2(0);

});
