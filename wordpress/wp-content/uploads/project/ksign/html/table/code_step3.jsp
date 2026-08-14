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
		   <p class="title">PK, FK, PFK, UK에 대한 정보를 확인하여 주십시오.</p>
		   <p>ㆍ암호화 컬럼이 FK 혹은 PFK 이거나, 암호화 컬럼을 다른 테이블에서 참조할 경우 참조 관계에 있는 테이블을 암호화 한 후Constraint를 다시 적용해야 합니다.</p>
		   <br/>
		   <p>ㆍ원본 테이블 : A1</p>
		   <p>ㆍ암호화 적용 후 테이블 : SDB_A1</p>
	   </div>
		<p></p><p></p>

		<div class="use_protocol">
		   <dl>
		      <dt>1. A1 : Constraints</dt>
			  <dd>ALTER TABLE TESTUSER.A1. ADD PRIMARY KEY (C1) USING INDEX TABLESPACE USERSALTER TABLE TESTUSER.A1. ADD PRIMARY KEY (C1) USING INDEX TABLESPACE USERSALTER TABLE TESTUSER.A1. ADD PRIMARY KEY (C1) USING INDEX TABLESPACE USERS</dd>
		      <dt>1. A1 : Constraints</dt>
			  <dd>ALTER TABLE TESTUSER.A1. ADD PRIMARY KEY (C1) USING INDEX TABLESPACE USERSALTER TABLE TESTUSER.A1. ADD PRIMARY KEY (C1) USING INDEX TABLESPACE USERSALTER TABLE TESTUSER.A1. ADD PRIMARY KEY (C1) USING INDEX TABLESPACE USERS</dd>
		      <dt>1. A1 : Constraints</dt>
			  <dd>ALTER TABLE TESTUSER.A1. ADD PRIMARY KEY (C1) USING INDEX TABLESPACE USERSALTER TABLE TESTUSER.A1. ADD PRIMARY KEY (C1) USING INDEX TABLESPACE USERSALTER TABLE TESTUSER.A1. ADD PRIMARY KEY (C1) USING INDEX TABLESPACE USERS</dd>
		      <dt>1. A1 : Constraints</dt>
			  <dd>ALTER TABLE TESTUSER.A1. ADD PRIMARY KEY (C1) USING INDEX TABLESPACE USERSALTER TABLE TESTUSER.A1. ADD PRIMARY KEY (C1) USING INDEX TABLESPACE USERSALTER TABLE TESTUSER.A1. ADD PRIMARY KEY (C1) USING INDEX TABLESPACE USERS</dd>
		      <dt>1. A1 : Constraints</dt>
			  <dd>ALTER TABLE TESTUSER.A1. ADD PRIMARY KEY (C1) USING INDEX TABLESPACE USERSALTER TABLE TESTUSER.A1. ADD PRIMARY KEY (C1) USING INDEX TABLESPACE USERSALTER TABLE TESTUSER.A1. ADD PRIMARY KEY (C1) USING INDEX TABLESPACE USERS</dd>
		   </dl>
		</div>
	
	</div>
	<!-- //코드박스 -->
</body>
</html>