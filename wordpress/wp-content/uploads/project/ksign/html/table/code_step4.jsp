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
	   <div class="opt_type1">
		   <p class="title">암호화 완료 후 생성 할 트리거를 선택한 후 수정하여</p>

		   <p>ㆍ테이블 트리거 : BEFORE/ALTER -> INSTEAD OF로 변경</p>
		   <p>ㆍ컬럼 트리거 : EMPLOYEE -> SDB92$6074$01 로 테이블 이름 변경</p>
	   </div>
		<p></p><p></p>

	<!-- 트리거 -->
		<div class="triger">
		<!-- 트리거 테이블영역 -->
			<div class="trigerTable">
					<table summary="최근 작업내역" class="columnTable" style="width:320px;">
						<caption>최근 작업내역</caption>
						<colgroup>
							<col width="50px" />
							<col width="150px" />
							<col width="" />
							<col width="14" />
						</colgroup>
						<tbody>
							<tr>
								<th>선택</th>
								<th>데이블명</th>
								<th style="border-right:0;">트리거명</th>
								<th class="th_empty" style="border-left:0;"></th>
							</tr>
						</tbody>
					</table>
					  <div class="pop_table_sc2" style="width:320px;height:180px !important;">
						 <table style="width:;" class="columnTable ruler">
						<colgroup>
							<col width="50px" />
							<col width="150px" />
							<col width="" />
						</colgroup>
						  <tbody>
							<tr>
								<td class="chk"><input type="checkbox" id="" name="" /></td>
								<td>CUSTOMERS</td>
								<td>Table</td>
							</tr>
							<tr>
								<td class="chk"><input type="checkbox" id="" name="" /></td>
								<td>CUSTOMERS</td>
								<td>Table</td>
							</tr>
							<tr>
								<td class="chk"><input type="checkbox" id="" name="" /></td>
								<td>CUSTOMERS</td>
								<td>Table</td>
							</tr>
							<tr>
								<td class="chk"><input type="checkbox" id="" name="" /></td>
								<td>CUSTOMERS</td>
								<td>Table</td>
							</tr>
							<tr>
								<td class="chk"><input type="checkbox" id="" name="" /></td>
								<td>CUSTOMERS</td>
								<td>Table</td>
							</tr>
							<tr>
								<td class="chk"><input type="checkbox" id="" name="" /></td>
								<td>CUSTOMERS</td>
								<td>Table</td>
							</tr>
							<tr>
								<td class="chk"><input type="checkbox" id="" name="" /></td>
								<td>CUSTOMERS</td>
								<td>Table</td>
							</tr>
						</tbody>
					</table>
			</div>
		<!-- //트리거 테이블영역 -->
		</div>
		  
		   <div class="scriptEdit">
		       <p>ㆍ트리거 스크립트 편집</p>
			   <textarea rows=8 cols=48>
				CREATE OR REPLACE TRIGGER YOUNGLEE.EMP_TRG INSTEAD OF
				INSERT OR UPDATE OR DELETE ON YOUNGLEE.EMPLOYEE FOR EACH
				ROW DECLARE

				BEGIN

				  if (inserting) then 
					 insert into EMPLOYEE_DUMP(USERID, PASSAWORD, NAME, SSN,
					 SALART, DEPTNO)
			   </textarea>
			
				<div class="iframeBtn">
					<ul>
					  <li><span><a href="">수정</a></span></li>
					</ul>
				</div>

		   </div>


		<div class="b_clear"></div>
	<!-- //트리거 -->
	</div>
	<!-- //코드박스 -->
</body>
</html>