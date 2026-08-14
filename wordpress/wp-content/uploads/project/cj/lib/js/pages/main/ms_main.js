	/**
	 #####################################################################################################################
	 #  이벤트 생성 
	 #####################################################################################################################
     **/
	var oMain = {
		confirm:function()
		{
			//로그아웃 이벤트
			$("#hv_logout").click(function(){
				$("#confirm_title").html("로그아웃");
				$("#confirm__msg").html("생활정보 관리시스템을 로그아웃 하시겠습니까?");
				$("#hv_confirm").msPopup("open");
				$("#confirm__ok").one("click",function(){
					$("#hv_confirm").msPopup("close");
					/* 
					  로그아웃 처리 
					  1. 페이지 location 
					  2. 세션 초기화 
					  3. 초기 로그인화면으로 이동 
					*/
				});
				$("#confirm__can").one("click",function(){
					$("#hv_confirm").msPopup("close");
				});
			});
		},
		alert:function()
		{
			
		},
		loadEvent:function()
		{
			var THIS = this;
			$("#hv_confirm").msPopup("init");  //confirm 창 환경적용
     		$("#hv_alert").msPopup("init");   //alert 창 환경적용
    		$("#hv_confirm").load("form/common/confirm.html",function(){
				THIS.confirm();    			
    		});
    		$("#hv_alert").load("form/common/alert.html",function(){
    			THIS.alert();
    		});	
		},
		init:function()
		{
			this.loadEvent();
		}
	}
$(function($) {
	oMain.init();			
});