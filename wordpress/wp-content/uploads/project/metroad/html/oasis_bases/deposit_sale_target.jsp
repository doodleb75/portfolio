<%@ page language="java"  pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="../../inc/metro_dtype.jsp" %>

<body>

<div id="popBox" style="width:500px;">
	<!-- popupBox 헤더 -->
	<div class="pop_header">
		<h1>판매목표금액 등록</h1>
		<span class="p_close"><a href=""><img src="../../images/common/b_pop_close.png" alt="닫기버튼" title="닫기"/></a></span>
	</div>
	<!-- //popupBox 헤더 -->
	<!-- popupBox 컨텐츠 -->
	<div class="pop_body">
		<p class="dateInfo">[<img src="../../images/common/calendar-medium.png" alt="" title=""/>2012년 2월]</p>
		<div class="purposeMoney_regist">
			<p class=""><label>판매목표금액</label><input type="text" size=13> <span>원(VAT별도)</span></p>
			<p class=""><label>최소보장금액</label><input type="text" size=13> <span>원 <em>* 판매목표금액 x<input type=text id="" name="" size=1/>%</em></span></p>
			<p class=""><label>최소보장금액</label><input type="text" size=13> <span>원 <em>* 판매목표금액 x VAT x<input type=text id="" name="" size=1/>개월</em></span></p>
			<p class=""><label>최소보장금액</label><input type="text" size=13> <span>원 <em>* 지금이행보증금 x <input type=text id="" name="" size=1/>%</em></span></p>
		</div>
			<div class="Block_alignC">
				<span class="button small-g strong icon"><span class="confirm"></span><a href="#" title="저장">저장</a></span>
				<span class="button small-g strong icon"><span class="cancel"></span><a href="#" title="취소">취소</a></span>
			</div>
	</div>
	<!-- //popupBox 컨텐츠 -->
</div>
</body>
</html>
