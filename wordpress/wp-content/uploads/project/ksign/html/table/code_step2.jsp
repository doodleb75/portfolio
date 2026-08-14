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
	   <p class="title">암호화 옵션설정</p>
	   <p><input type="checkbox" id="" name=""/><label>암호화 적용 실패 시 자동 원복(Auto Rollback)</label></p>
	   <p><input type="checkbox" id="" name=""/><label>암호화 완료 후 원본 테이블 삭제</label></p>
	   <p><input type="checkbox" id="" name=""/><label>테이블에 접근제어 적용</label></p>
	   </div>
<p></p><p></p>
	   <div class="opt_type1">
	   <p class="title">암호화 프로세스 설정</p>
	   <p>암호화 수행 시 사용할 프로세스 개수를 설정할 수  있으며 프로세스 개수에 따라 암호화 속도가 변동됩니다.</p>
		  <div class="opt_box">
			   <p>
			   <label class="bool">시스템 CPU개수</label>
			   <select name="">
				  <option>4개</option>
				  <option>3개</option>
				  <option>2개</option>
				  <option>1개</option>
				</select>
			   </p>

			   <p>
			   <label class="bool">프로세스 개수</label>
			   <select name="">
				  <option>4개</option>
				  <option>3개</option>
				  <option>2개</option>
				  <option>1개</option>  
				</select>		  
			   </p>
			   <div class="comment">
			    <p> - 프로세스 개수가 1인 경우  ☞ 자원 사용률을 최소화하여 암호화를 수행합니다.</p>
				<p> - 프로세스 개수가 2인 경우  ☞ 자원 사용률이 증가되고 암호화 속도가 향상됩니다.</p>
				<p> - 권장 프로세스 개수 = 시스템 CPU 개수 / 2 </p>
			   </div>
		   </div>
	   </div>

	</div>
	<!-- //코드박스 -->
</body>
</html>