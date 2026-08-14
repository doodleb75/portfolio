	/**
	 #####################################################################################################################
	 #  메뉴 스크립트 생성 
	 #####################################################################################################################
     **/
    var nav_top = "";
    var oMenu = {
    	actEvent:function()
    	{
    		$(".tmenu").click(function(){
    			var nav = $(this).attr("nav");
    			$(this).addClass("navActive");
    			//생활 정보 옵션
    			if(nav == "life_option_reg")
    			{ 
    				$("#alert_title").html("생활정보");
					$("#md_body").load(nav_top+"nav_life_option_reg.html",function(){
						$("#md_life_opt").msPopup("init");
						oEvt.navLifeOpt();
						oEvt.lifeTBL();
					});
    			}
    		}); 
    	},
    	init:function()
    	{
    		this.actEvent();
    	}
    }
    /**
	 #####################################################################################################################
	 #  이벤트 스크립트  
	 #####################################################################################################################
     **/
    var oEvt = {
    	lBbs:null,
    	lifeTBL:function()
    	{
    		var opt = {
    			url:"/list/codeList.json",
    			tableId:"life_option_tables",
				colName:['생활정보코드', '생활정보명', '순서', '수집타입', '수집시간(초)', '파일사용유무','파일확장자명 체크','금칙어체크유무'],
				colModel:[
					{name:'life_code' , align:'center'},
			   		{name:'life_name', align:'center'},
			   		{name:'display_index' , align:'center'},
			   		{name:'life_coll_gubun' , align:'center', filter : {A:"자동",S:"수동" } },
			   		{name:'life_auto_time'  , align:'center'},
			   		{name:'life_file_yn' , align:'center' , filter : {Y:"사용함",N:"사용안함"} },
			   		{name:'life_file_chk' , align:'center' },		
					{name:'filtering_yn' , align:'center' , filter : {Y:"사용함",N:"사용안함"}
				}
			  ],
			  emptymsg:"등록된 생활정보 메뉴가 없습니다."
			} 
    		this.lBbs = new oBbs(opt);
    	},
    	navLifeOpt:function()
    	{ 
    	
    		$("#md_life_opt").load("/form/mediaset/life_option_reg.html",function(){
				 $("#display_index").onlynum(); 
				 $("#life_auto_time").onlynum();
				oEvt.lifeOptEvent();  
				$("#md_life_opt_reg").click(function() {
					$("#actType").val("INSERT");
					$("#lifeOptFrm").clearForm();
					$("#life_coll_gubun > option[value=S]").attr("selected",true);
					$("#cate1 > option[value=NULL]").attr("selected",true);
					$("#cate2 > option[value=NULL]").attr("selected",true);
					$("#life_file_chk").attr("disabled",true); 
					$("#filtering_yn").attr("checked",true);
					$("#chkMsg").html("코드 3자리를 입력하세요.");
					$("#md_life_opt").msPopup("open");
				});
			});
    	},
    	lifeOptEvent:function()
    	{ 
    		var THIS = this;
    		$("#life_file_yn").click(function(){
				if(this.checked)
				{
					$("#life_file_chk").attr("disabled",false);
				}
				else
				{
					$("#life_file_chk").attr("disabled",true);
					$("#life_file_chk").val("");
				}
    		});  
    		/**
    		 *   생활정보 옵션 등록 
    		 */
    		$("#md_life_opt_reg_init").click(function(){
    			var queryString = $("#lifeOptFrm").formSerialize(); 
    			var emptyChk = $("#lifeOptFrm").emptyChk();
    			var THIS =  this;
    			
    			
    			if( emptyChk == true)
    			{
    				if($("#codeChk").val() == "N")
    				{
    					$("#alert_msg").html("생활정보 코드를 확인하여주세요.");
						$("#md_alert").msPopup("open");	
						$("#alert_close").one("click",function(){
							$("#md_alert").msPopup("close");
						});   
    					return;
    				}
    				$.ajax({
    					url : "/proc/LifeOptionReg.md",
    					type : "POST",
    					data: queryString,
    					dataType:"json", 
    					success:function(data)
    					{
    						if(data.result == "FAIL")
    						{
    						
    							$("#alert_msg").html(data.msg);
								$("#md_alert").msPopup("open");	
								$("#alert_close").one("click",function(){
									$("#md_alert").msPopup("close");
								});  				
    						}
    						else 
    						{
    							$("#alert_msg").html(data.msg);
								$("#md_alert").msPopup("open");	
								$("#alert_close").one("click",function(){
									$("#md_alert").msPopup("close");
									$("#md_life_opt").msPopup("close");
									//테이블 리로드
									oEvt.lBbs.tableReload();
									
								});   
    						}
    					}
    				})
    			}
    			else
    			{
    				$("#alert_msg").html(emptyChk);
					$("#md_alert").msPopup("open");	
					$("#alert_close").one("click",function(){
						$("#md_alert").msPopup("close");
					});  				
    			}
    		});
    		/**
    		 *     생활정보 팝업창 닫기
    		 **/
    		$("#md_life_opt_reg_cancle").click(function(){
    			 $("#md_life_opt").msPopup("close");
    		});
    		/**
    		 *    수집타입 선택 
    		 */
    		$("#life_coll_gubun").change(function(){
    			if($(this).val() == "A")
    			{
    				$("#life_auto_time").attr("disabled",false);
    			}
    			else
    			{
    				$("#life_auto_time").attr("disabled",true);
    			}
    		});
    		/**
    		 *	LIFE 코드 체크 이벤트
    		 */
    		$("#life_code").keyup(function(){
    			if($(this).val().trim())
				{
					var codeChkRes = true;
					var life_code = $(this).val().trim();
					
					
					$.getJSON("/list/codeChk.json",function(data){
						for(var i=0;i<data.length;i++)
						{
							var cells = data[i].cell;
							 
							if(cells["life_code"] == life_code)
							{
								debug(cells["life_code"]+" == "+life_code);
								codeChkRes = false;
								break;
							} 
						}
						if(codeChkRes)
						{
							$("#chkMsg").html("<font color='blue'> 사용하셔도 되는 코드입니다.</font>");
							$("#codeChk").val("Y");	
						}
						else 
						{ 
							$("#chkMsg").html("<font color='red'> 이미 등록된 생활정보 코드입니다.</font>");
							$("#codeChk").val("N");
						}
					});
				}
				else
				{
					$("#chkMsg").html(" 코드 4자리를 입력하세요.");
					$("#codeChk").val("N");
				}
    		});
    	}
    }
    /**
	 #####################################################################################################################
	 #  메인 스크립트  
	 #####################################################################################################################
     **/ 
    var oMain = {
    	init:function()
    	{
    		$("#md_alert").msPopup("init");
    		$("#md_alert").load("/form/common/alert.html");
    	}
    }
	$(function($) {
		oMain.init();
		oMenu.init();
		//디폴트 설정 
		$(".navActive").click();
	});