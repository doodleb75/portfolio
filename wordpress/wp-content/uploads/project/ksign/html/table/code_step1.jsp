<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko">
<head>
<link rel="stylesheet" href="/css/iframe_default.css" media="screen" type="text/css">
<script type="text/javascript">
 /* $(document).ready(function() {
    	$(".targetwindow").click(function(){
		window.parent.location.href = $(this).attr("href");
		return false;
	});	 
	 if (parent) {
        var oHead = document.getElementsByTagName("head")[0];
        var arrStyleSheets = parent.document.getElementsByTagName("style");
        for (var i = 0; i < arrStyleSheets.length; i++)
            oHead.appendChild(arrStyleSheets[i].cloneNode(true));
    }
	$("link[rel=stylesheet]",parent.document).each(function(){
		var cssLink = document.createElement("link") 
		cssLink.href = "http://"+parent.document.domain+$(this).attr("href"); 
		alert(parent.document.domain);
		cssLink .rel = "stylesheet"; 
		cssLink .type = "text/css"; 
		document.body.appendChild(cssLink);
	});	
  });*/
</script>

</head>
<body>
	<!-- 코드헤드 -->
	<!--div class="code_head">
	   <ul>
		  <li><span><a href="">테이블정보</a></span></li>
		  <li><span><a href="">암호화 옵션정보</a></span></li>
		  <li><span><a href="">PFK스크립터 정보</a></span></li>
		  <li><span><a href="">트리거 정보</a></span></li>
		  <li><span><a href="">인덱스 정보</a></span></li>
		  <li><span><a href="">스크립트 정보</a></span></li>
		  <li><span><a href="">세그먼트 정보</a></span></li>
	   </ul>
	</div-->
	<div class="if_TblockTab">
	  <ul>
		<li class="Lcurrent"><!--ins></ins--><span><a href="code_step1.jsp" target="_self">테이블정보</a></span></li>
		<li><span><a href="/html/table/code_step2.jsp" target="_self">암호화 옵션정보</a></span></li>
		<li><span><a href="/html/table/code_step3.jsp" target="_self">PFK 스크립트정보</a></span></li>
		<li><span><a href="/html/table/code_step4.jsp" target="_self">트리거 정보</a></span></li>
		<li><span><a href="/html/table/code_step5.jsp" target="_self">인덱스 옵션정보</a></span></li>
		<li><span><a href="/html/table/code_step6.jsp" target="_self">스크립트 옵션정보</a></span></li>
		<li><span><a href="/html/table/code_step7.jsp" target="_self">세그먼트 옵션정보</a></span></li>
	  </ul>
	</div>
	<!-- //코드헤드 -->
	<!-- 코드박스 -->
	<div class="code_body">
	   <p class="type1">
	   <span><label>스키머</label><input type="text" id="" name=""/></span>
	   <span><label>테이블</label><input type="text" id="" name=""/></span>
	   </p>

	   <div class="passcode_sel">
		   <span>암호화 테이블</span>
		   <input type="radio" id="" name="code_category"/> <label>SDB_A1</label>
		   <input type="radio" id="" name="code_category"/> <label>SDBS_$01</label>
		   <input type="radio" id="" name="code_category"/> <label>직접입력</label>
			   <!--ul>
				 <li><a href="">SDB_A1</a><span></span></li>
				 <li><a href="">SDB_A1</a><span></span></li>
				 <li><a href="">SDB_A1</a><span></span></li>
			   </ul-->
		</div>
		<div class="column_list">
		   <p>암호화를 적용할 컬럼 리스트</p>
			<div class="">
					<table summary="최근 작업내역" class="columnTable" style="width:730px;">
						<caption>최근 작업내역</caption>
						<colgroup>
							<col width="416" />
							<col width="" />
							<col width="14" />
						</colgroup>
						<tbody>
							<tr>
								<th>컬럼 이름</th>
								<th style="border-right:0;">데이타 타입</th>
								<th class="th_empty" style="border-left:0;"></th>
							</tr>
						</tbody>
					</table>
					  <div class="pop_table_sc2" style="width:100%;">
						 <table style="width:100%;" class="columnTable ruler">
						<colgroup>
							<col width="416" />
							<col width="" />
						</colgroup>
						  <tbody>
							<tr>
								<td>CUSTOMERS</td>
								<td>Table</td>
							</tr>
							<tr>
								<td>CUSTOMERS</td>
								<td>Table</td>
							</tr>
							<tr>
								<td>CUSTOMERS</td>
								<td>Table</td>
							</tr>
							<tr>
								<td>CUSTOMERS</td>
								<td>Table</td>
							</tr>
							<tr>
								<td>CUSTOMERS</td>
								<td>Table</td>
							</tr>
							<tr>
								<td>CUSTOMERS</td>
								<td>Table</td>
							</tr>
							<tr>
								<td>CUSTOMERS</td>
								<td>Table</td>
							</tr>
						</tbody>
					</table>
			</div>
		</div>

	</div>
	<!-- //코드박스 -->
</body>
</html>