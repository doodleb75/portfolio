
jQuery(function($) {
	/*
		jQuery 를 다른 라이브러리와 함께 사용할 경우 이 블럭 안에서 jQuery 만을 위해 '$' 문자가 사용되는 것을 보장받을 수 있습니다.
		여기서는 Prototype이 되겠지만 거기서도 $ 문자가 D$ (으)로 바뀌어 사용중이므로 jQuery의 $ 문자와의 충돌은 없을 것으로 예상합니다.
		기본적으로 이 블럭 안에서 Prototype용 $ 문자는 사용할 수가 없으나, $ 문자 대신 'D$' 처럼 사용할 수 있게 변경됐으므로
		D$ 를 사용한 Prototype 기반 선언도 가능해 보이니 테스트 바랍니다.
		참고 : http://docs.jquery.com/Using_jQuery_with_Other_Libraries
		- 공인식(alcyone@lgcns.com)
	*/

	/* 서비스 운영관리
	--------------------------------------------------------- */
	$('.LpageApproval .sep-doc').click(function(event){
		event.preventDefault();
		if($('.LpageApproval').is('.LpageMgmtApproval')) {
			window.open(this.href,'','width=400,height=200');
		} else {
			window.open(this.href,'','width=640,height=480');
		}
	});

	$('.sep-pop .cancel').click(function(event){
		event.preventDefault();
		if($('.sep-pop').is('.rel-approval')) {
			window.open(this.href,'','width=420,height=200');
		}
	});

	/* 게시판관리
	--------------------------------------------------------- */
	$('.LpageBoardRegular #LblockButton .add').click(function(event){
		event.preventDefault();
		window.open(this.href,'','width=640,height=340');
	});

	/* 사이트관리 > 상품관리
	--------------------------------------------------------- */
	$('.LpageGoodsListEach .related .details, .LpageGoodsListEach .related .add').click(function(event){
		event.preventDefault();
		window.open(this.href,'','width=400,height=250');
	});
	if($.ui.tabs) {
		$('.LcontentTabbed .tabbed').first().tabs();
	}

});