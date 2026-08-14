	/**
	 #####################################################################################################################
	 #  이벤트 생성 
	 #####################################################################################################################
     **/
	var oEvt = {
    	memberFrm:function()
    	{
    		$("#hv_mjoin_form").msPopup("open"); 
    		$("#hv_mem_cancle").click(function() {
				$("#hv_mjoin_form").msPopup("close");
			});
			$("#hv_mem_init").click(function() {
				debug("ajax")
				$("#hv_mjoin_form").msPopup("close");
			});
    	} 
   } 
	/**
	 #####################################################################################################################
	 #  메인 스크립트 생성 
	 #####################################################################################################################
     **/
    
    var oMain = {
    	/* 로그인 체크 영역 */
    	loginChk:function()
    	{
    		$("#hv_member_join").click(function(){
	    		$("#hv_mjoin_form").msPopup("init"); 
	    		$("#hv_mjoin_form").load("form/main/member_join.html",function(){
	    			oEvt.memberFrm();
	    		});
    		});
    	}, 
    	init:function()
    	{
    		this.loginChk();   
       	}
    }
	$(function($) {
		oMain.init();			
	});