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
				<h3>판매대행사 등록</h3>
				<span class="navi"><a href="">Home</a> > 판매대행사 등록</span>
			</div>
			<p class="title_bar"></p>
			<!-- 컨텐츠 박스 시작 -->
			<div class="content_box">
			   <fieldset>
				<legend>판매대행사 등록폼</legend>
				<table class="registType1" cellspacing=0 border=0 width=100% >
					<caption>등록 폼</caption>
					<colgroup>
						<col width="121" />
						<col width="" />
						<col width="76" />
						<col width="" />
					</colgroup>
						<tr>
							<th>판매대행사 명</th><td><input type="text" id="" name="" /></td><th>대표자</th><td><input type="text" id="" name="" /></td>
						</tr>
						<tr>
							<th>사업자등록번호</th><td colspan=3><input type="text" id="" name="" size=1/>-<input type="text" id="" name="" size=1/>-<input type="text" id="" name="" size=1/></td>
						</tr>
						<tr>
							<th>주소</th><td colspan=3><input type="text" id="" name="" size=10/></td>
						</tr>
						<tr>
							<th>전화번호</th><td><input type="text" id="" name="" size=1/>-<input type="text" id="" name="" size=1/>-<input type="text" id="" name="" size=1/></td>
							<th>FAX 번호</th><td><input type="text" id="" name="" size=1/>-<input type="text" id="" name="" size=1/>-<input type="text" id="" name="" size=1/></td>
						</tr>
						<tr>
							<th>계약기간</th>
							<td colspan=3>
								<select>
									<option>2012</option>
									<option>2011</option>
									<option>2010</option>
								</select>년
								<select>
									<option>12</option>
									<option>11</option>
									<option>11</option>
								</select>월
								<select>
									<option>12</option>
									<option>11</option>
									<option>11</option>
								</select>일 ~ 
								<select>
									<option>2012</option>
									<option>2011</option>
									<option>2010</option>
								</select>년
								<select>
									<option>12</option>
									<option>11</option>
									<option>11</option>
								</select>월
								<select>
									<option>12</option>
									<option>11</option>
									<option>11</option>
								</select>일					
							</td>
						</tr>
						<tr>
							<th>판매매체</th>
							<td colspan=3>
							<!-- inner Table -->
								<table class="innerTable01" border=0 cellspacing=0 width=100%>
								<colgroup>
									<col width="10%"/>
									<col width="90%"/>
								</colgroup>
									<tr>
										<th class="type_chk">선택</th>
										<th class="type_chk">매채 명</th>
									</tr>
									<tr>
										<td class="type_chk"><input type="checkbox" id="" value="" /></td>
										<td>3호선 전동차(역차,모서리,천정걸이) & 대합실 & 승강장</td>
									</tr>
									<tr>
										<td class="type_chk"><input type="checkbox" id="" value="" /></td>
										<td>전동차내 조명광고</td>
									</tr>
									<tr>
										<td class="type_chk"><input type="checkbox" id="" value="" /></td>
										<td>회전식 기둥조명</td>
									</tr>
								</table>
							<!-- //inner Table -->
							</td>
						</tr>
						<tr>
							<th class="no_border">독점매체</th>
							<td colspan=3 class="no_border">
								<select>
									<option>광고 전단지</option>
									<option>2011</option>
									<option>2010</option>
								</select>년
							</td>
						</tr>
						<tr>
							<th>독점기간</th>
							<td colspan=3>
								<select>
									<option>2012</option>
									<option>2011</option>
									<option>2010</option>
								</select>년
								<select>
									<option>12</option>
									<option>11</option>
									<option>11</option>
								</select>월
								<select>
									<option>12</option>
									<option>11</option>
									<option>11</option>
								</select>일 ~ 
								<select>
									<option>2012</option>
									<option>2011</option>
									<option>2010</option>
								</select>년
								<select>
									<option>12</option>
									<option>11</option>
									<option>11</option>
								</select>월
								<select>
									<option>12</option>
									<option>11</option>
									<option>11</option>
								</select>일		
							</td>
						</tr>
						<tr>
							<th class="no_border">중도해약일</th>
							<td colspan=3 class="no_border">
								<select>
									<option>2012</option>
									<option>2011</option>
									<option>2010</option>
								</select>년
								<select>
									<option>12</option>
									<option>11</option>
									<option>11</option>
								</select>월
								<select>
									<option>12</option>
									<option>11</option>
									<option>11</option>
								</select>일 ~ 
								<select>
									<option>2012</option>
									<option>2011</option>
									<option>2010</option>
								</select>년
								<select>
									<option>12</option>
									<option>11</option>
									<option>11</option>
								</select>월
								<select>
									<option>12</option>
									<option>11</option>
									<option>11</option>
								</select>일		
							</td>
						</tr>
						<tr>
							<th>해약사유</th>
							<td colspan=3>
								<textarea name="causion" rows=2 cols=70>
								</textarea>
							</td>
						</tr>
					</table>
			   </fieldset>				
			</div>
			<div class="Block_alignC">
				<span class="button medium-w strong icon"><span class="confirm"></span><a href="#">저장</a></span>
				<span class="button medium-w strong icon"><span class="cancel"></span><a href="#">취소</a></span>
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
