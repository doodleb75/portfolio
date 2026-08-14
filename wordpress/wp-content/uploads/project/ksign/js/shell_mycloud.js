
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
	$('.LpageServiceDetail .sep-doc').click(function(event){
		event.preventDefault();
		window.open(this.href,'','width=640,height=480');
	});

	/* 서비스 운영 가이드, 서비스 신청 가이드
	--------------------------------------------------------- */
	$('.LpageVMConfiguration .lead-page .guide, .LpageApply .lead-page .guide').click(function(event){
		event.preventDefault();
		window.open(this.href,'','width=616,height=700');
	});

	/* 서비스 신청
	--------------------------------------------------------- */
	$('.LpageApply .pod-tabbed .cont').css('overflow', 'hidden');
	$('.LpageApply .pod-tabbed .cont').tabs({
		show: function(event, ui) {
			$(ui.panel).parent().css('overflow', 'auto')
		}
	});

	$('.LpageApply #pod-agreed input').click(function(){
		$(this).parents('.cont').find('.each').removeClass('checked').end().end().parent().addClass('checked');
	}).filter(':checked').parent().addClass('checked');

	$('.LpageApply .pod-tabbed input').click(function(){
		$(this).parents('.cont').find('li').removeClass('checked').end().end().parent().addClass('checked');
	}).filter(':checked').parent().addClass('checked');

	$('.LpageApply .pod-options input').click(function(){
		$(this).parent().toggleClass('checked', function(){
			if($(this).is(':checked')) {
				return true;
			} else {
				return false;
			}
		});
	}).filter(':checked').parent().addClass(function(){
		if(!$(this).children().eq(0).attr('disabled')) return 'checked';
	});

	/* 신청버튼 클릭 - 참조용
	$('.LpageApply #submit-form .trigger').click(function(){
		var val, svc_options = [];
		$('.LpageApply .pod-options input[name="svc_options"]:checked').each(function(){
			svc_options.push($(this).val());
		});
		val = '서비스명 = ' + '"'+ $('#svc-name').val() + '"\n';
		val += '약정 = ' + '"'+ $('#pod-agreed input[name="svc_agreement"]:checked').val() + '"\n';
		val += 'OS 이미지 = ' + '"'+ $('#pod-os input[name="svc_os"]:checked').val() + '"\n';
		if($('.LpageApply').is('.LpageApply-dbsecurity')) val += 'DBMS = ' + '"'+ $('#pod-dbms input[name="svc_dbms"]:checked').val() + '"\n';
		val += '선택사양 = ' + '"'+ svc_options.join() + '"';
		alert(val);
	}); */

	/* 회원정보관리
	--------------------------------------------------------- */
	$('.LpageEditCompanyInfo .sep-doc').click(function(event){
		event.preventDefault();
		window.open(this.href,'','width=800,height=620');
	});
	$('.LpageEditCompanyInfo-Sep .certify').click(function(event){
		event.preventDefault();
		window.open(this.href,'','width=480,height=300');
	});
	$('.LpageEditSubsInfo .sep-doc').click(function(event){
		event.preventDefault();
		window.open(this.href,'','width=800,height=350');
	});

	$('.LpageTransfer-Sep, .LpageEditSubsInfo-Payment-Sep').find('.radio-select').each(function(){
		var _parent = $(this).parent();
		function showSelected(e){
			_parent.find('.form-section').hide();
			$('#'+e).show();
		}
		function getTarget(src){
			// 클래스가 여러개일 수 있으니 배열을 만든다.
			// 배열 중 'sel-' 문자열을 가진 요소를 찾아 found 변수에 넣는다.
			// 찾은 문자열이 원하는 것으로 대체된 새로운 found 를 반환한다.
			var arr = src.split(/\s+/), found;
			$.each(arr, function(index, item){
				if (item.indexOf('sel-') > -1) {
					found = item;
				}
			});
			return found.replace('sel', 'forms-for');
		}

		$(this).find('input[type="radio"]').click(function(){
			showSelected(getTarget(this.id));
		}).filter(':checked').each(function(){
			showSelected(getTarget(this.id));
		});
	});

	$('.LpageQuit .confirm').click(function(event){
		event.preventDefault();
		window.open(this.href,'','width=640,height=610');
	});
});