/**
	 #####################################################################################################################
	 #  메인 스크립트 생성 
	 #####################################################################################################################
     * 헬로비전 양천 생활정보 구조
     * 1. top menu 생활정보 선택
     *  - 선택된 생활정보 대분류의 코드로 중분류 리스트 가져와 중분류 Select Box option 값 등록
     *  - 중분류를 선택시 중분류의 코드로 소분류 리스트 가져와 소분류 Select Box option 값 등록
     * 2. top menu 선택
     *  - 선택된 생활정보를 가져와 승인,미승인,승인실패,취소 건수를 검색조건에 맞게 조회하여 건수를 가져온다.
     *  - 선택된 생활정보의 승인 데이터를 가져와 tabs body에 데이터를 넣는다.
     * 3. 검색 조건 선택후 검색
     *  - 선택된 검색조건으로 조회하여 승인,미승인,승인실패,취소 건수를 가져온다.
     *  - 선택된 생활정보의 승인 데이터를 가져와 tabs body에 데이터를 넣는다.
     * 4. 새로고침 클릭
     *  - 검색조건으로 조회하여 데이터가져오기
     * 5. 생활정보 등록,수정,취소,삭제 처리
     *  - 삭제는 미승인건만 삭제가 가능하다.
     * 6. 승인타입 Tabs 선택
     *  - 선택된 승인타입의 데이터를 가져온다.
     * 7. 더보기 클릭
     *  - 검색조건의 출력수 갯수만큼 생활정보를 가져와서 마지막 생활정보 데이터 뒤에 등록한다.
     *
     * 처리 순서 : 검색조건(생활정보코드, 조회일,승인타입,출력수) 가지고 데이터를 Tabs Body에 등록한다. 
     *  
     **/
    var tabsIndex = 0;
	var pageIndex = 1;
	var oLife = { 
    	actEvent:function()
    	{
    		$("#hv_toggle-search").slideEvent("hv_search");  
			//Tabs 생성
			$( "#hv_tabs" ).tabs({ 
				cache: false,  //true이면 한번 가져온 페이지는 다시 요청하지않는다.
				select: function(evt, ui) {
			        var url = $.data(ui.tab, 'load.tabs');
			        tabsIndex = ui.index;
			        return true;
			    },
				ajaxOptions: {
					error: function( xhr, status, index, anchor ) {
						$( anchor.hash ).html(
							"정보가 없습니다." );
					}
				},
				fxFade: true, 
				fxSpeed: 'slow', 
				spinner:"Retrieving data", 
				create: function(evt, ui) {
					var options = "";
					    options += "출력수 : <select id=\"hv_print_cnt\"><option value=\"10\">10</option><option  value=\"20\">20</option><option  value=\"40\">40</option></select> ";
						options	+= "<span class=\"button black\"><button id=\"hv_reflash\"> 새로고침 </button></span> ";
						options	+= "<span class=\"button black\"><button id=\"hv_write\"> 생활정보등록 </button></span> ";
					$("#hv_tabs").find("ul").append("<li style='float:right;margin-top:5px;'>"+options+"</li>");
					$("#hv_reflash").click(function(){
						var life_option_id = "";      //생활정보 옵션 아이디 값
						// pageIndex 페이지 값
						var s_date = $("#hv_s_date").val();  //조회 시작일 
						var e_date = $("#hv_e_date").val()   //조회 종료일 
						var search_type = $("#search_type").val();  //검색 조건 ( 글쓴이, 내용 )
						var search_text = $("#search_text").val();  //검색 TEXT 
						var list_type   = "success";         //생활정보 정보 타입(승인,미승인,취소,실패)
						switch(tabsIndex)
						{
							case 1: list_type = "nosuccess"; break;
							case 2: list_type = "fail"; break;
							case 3: list_type = "cancle"; break;
						}
						
						debug(pageIndex)
						debug("화면 새로고침"+tabsIndex);
					});
					$("#hv_write").click(function(){
						var life_option_id = "";      //생활정보 옵션 아이디 값

					});
					/**
					 * 출력수 변경시 !!
					 * 1. 승인,미승인,승인실패,취소 검색조건의 의거하여 건수 가져오기 
					 * 2. 선택된 승인타입의 데이터 가져오기.
					 * 3. 하단 더보기 건수 변경하기.
					 * */
					$("#hv_print_cnt").change(function(){
						$t = $(this);
						$("#hv_life_list_cnt").html($t.val());
						
					});
				}
			});
           /* 페이지 맨위로 이동*/
           $("#hv_top_move").click(function(){
           	 // webkit ( 크롬, 사파리 ) 일경우 scrolTop이 0이기때문에  body.scrollTop 처리해야지 좌표가 이동된다 .
           	 if($.browser.webkit === true)
           	 {
           	 	document.body.scrollTop = 0;	
           	 }
			 else
			 {
			 	$("html,bodye").animate( { scrollTop: 0 }, 0 );	
			 }
           });
		   /* 생활정보 등록 */
           $("#hv_life_add").click(function(){
           		
           });
    	},
    	loadEvent:function()
    	{

    	},
    	init:function()
    	{
			//TOP NAVIGATER 이벤트 생성
			$("#hv_nav").droppy({speed: 300});
			//달력생성
    		$("#hv_s_date").msDate();  
			$("#hv_e_date").msDate();
			
    		this.loadEvent();
    		this.actEvent();
    	}
    } 
	$(function($) {
		oLife.init();			
	});