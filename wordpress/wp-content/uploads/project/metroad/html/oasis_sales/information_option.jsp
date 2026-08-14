<%@ page language="java"  pageEncoding="UTF-8" contentType="text/html;charset=UTF-8" %>
<%@ include file="../../inc/metro_dtype.jsp" %>

<body>

<!-- wrapper -->
<div id="b_wrap">
	<!-- header -->
	<%@ include file="../../inc/header.jsp" %>
	<!-- //header -->

	<!-- container -->
	<div id="container">
		<!-- 레프트 영역 -->
		<%@ include file="../../inc/lnb.jsp" %>
		<!-- //레프트 영역 -->
		<!-- 컨텐츠 영역 -->
		<div class="contents">
			<div class="page_location">
				<h3>광고매체 요금관리</h3>
				<span class="navi"><a href="">Home</a> > 기본정보 및 이력관리</span>
			</div>
			<p class="title_bar"></p>
			<!-- 컨텐츠 박스 시작 -->
			<div class="content_box">
					<!-- 판매조건 설정 -->
					<span class="btn2" style="float:right;position:relative;right:14px;clear:both;">
						<span class="button medium-w strong icon" id="searchHideToggle"><span class="search"></span><a href="#">검색조건설정</a></span>
					</span>
					<div class="roundedBox" id="roundB01" style="width:710px;float:left;clear:both;">
					<div class="innerBox">
						<div class="box1">
							<p class="lineNum_sel">
										<select>
											<option>3호선</option>
											<option>4호선</option>
											<option>5호선</option>
											<option>6호선</option>
										</select>
									</p>
									<p class="st_list">
										<table border=0 cellspacing=0 width=100% class="popSearch_Table01">
										<colgroup>
											<col width="30%" />
											<col width="70%" />
										</colgroup>
											<tr>
												<th>선택</th>
												<th>역사명</th>
											</tr>
											<tr>
												<td><input type="checkbox" id="" /></td>
												<td class="st_name">대화</td>
											</tr>
											<tr>
												<td><input type="checkbox" id="" /></td>
												<td class="st_name">대화</td>
											</tr>
											<tr>
												<td><input type="checkbox" id="" /></td>
												<td class="st_name">대화</td>
											</tr>
											<tr>
												<td><input type="checkbox" id="" /></td>
												<td class="st_name">대화</td>
											</tr>
											<tr>
												<td><input type="checkbox" id="" /></td>
												<td class="st_name">대화</td>
											</tr>

											<tr>
												<td><input type="checkbox" id="" /></td>
												<td class="st_name">대화</td>
											</tr>
											<tr>
												<td><input type="checkbox" id="" /></td>
												<td class="st_name">대화</td>
											</tr>
											<tr>
												<td><input type="checkbox" id="" /></td>
												<td class="st_name">대화</td>
											</tr>
											<tr>
												<td><input type="checkbox" id="" /></td>
												<td class="st_name">대화</td>
											</tr>
											<tr>
												<td><input type="checkbox" id="" /></td>
												<td class="st_name">대화</td>
											</tr>

											<tr>
												<td><input type="checkbox" id="" /></td>
												<td class="st_name">대화</td>
											</tr>
											<tr>
												<td><input type="checkbox" id="" /></td>
												<td class="st_name">대화</td>
											</tr>
											<tr>
												<td><input type="checkbox" id="" /></td>
												<td class="st_name">대화</td>
											</tr>
										</table>
									</p>
								</div>
								<div class="box2">
								<!-- 전동차 -->
									<p class="t_title"><input type="checkbox" id="" name="" /><label>전동차</label></p>
									<p class="t_list">
										<span class=""><input type="checkbox" id="" name="" /><label>전동차</label></span>
										<span class=""><input type="checkbox" id="" name="" /><label>모서리광고</label></span>
										<span class=""><input type="checkbox" id="" name="" /><label>천정걸이</label></span>
										<span class=""><input type="checkbox" id="" name="" /><label>조명</label></span>
										<span class=""><input type="checkbox" id="" name="" /><label>프로모션</label></span>
									</p>

								<!-- 대합실 -->
									<p class="t_title"><input type="checkbox" id="" name="" /><label>대합실</label></p>
									<p class="t_list">
										<span class=""><input type="checkbox" id="" name="" /><label>조명</label></span>
										<span class=""><input type="checkbox" id="" name="" /><label>포스터</label></span>
										<span class=""><input type="checkbox" id="" name="" /><label>프로모션</label></span>
										<span class=""><input type="checkbox" id="" name="" /><label>종합안내도안내표기</label></span>
										<span class=""><input type="checkbox" id="" name="" /><label>회전식기둥조명</label></span>
										<span class=""><input type="checkbox" id="" name="" /><label>디지털스테이션광고</label></span>
									</p>

								<!-- 승강장 -->
									<p class="t_title"><input type="checkbox" id="" name="" /><label>승강장</label></p>
									<p class="t_list">
										<span class=""><input type="checkbox" id="" name="" /><label>조명</label></span>
										<span class=""><input type="checkbox" id="" name="" /><label>포스터</label></span>
										<span class=""><input type="checkbox" id="" name="" /><label>스크린도어</label></span>
										<span class=""><input type="checkbox" id="" name="" /><label>프로모션</label></span>
										<span class=""><input type="checkbox" id="" name="" /><label>회전식기둥조명</label></span>
										<span class=""><input type="checkbox" id="" name="" /><label>종합안내도안내표기</label></span>
										<span class=""><input type="checkbox" id="" name="" /><label>디지털스테이션광고</label></span>
									</p>

									<div class="Block_alignC">
										<span class="button medium-w strong icon"><span class="confirm"></span><a href="#">설정</a></span>
										<span class="button medium-w strong icon"><span class="cancel"></span><a href="#">취소</a></span>
									</div>

								</div>
						</div>
						<div class="corner topLeft"></div><div class="corner topRight"></div><div class="corner bottomLeft"></div><div class="corner bottomRight"></div>
					</div>
					<!-- //판매조건 설정 -->
			</div>
			<!-- 컨텐츠 박스 끝-->
		</div>
		<!-- //컨텐츠 영역 -->
	</div>
	<!-- container -->
</div>
<!-- //wrapper -->

<!-- footer -->
	<%@ include file="../../inc/footer.jsp" %>
<!-- //footer -->

</body>
</html>
