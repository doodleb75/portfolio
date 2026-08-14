//SSN 유효성 체크 
function CheckSSN(jumin1,jumin2) {
	var today = new Date();
	var chkYear1 = today.getYear();
	var chkYear2 = 0;
	if (chkYear1 < 2000) chkYear1 += 1900;
	var chk = 0;
	var chk2 = 0;
	var chk3 = 0;
	var yy = jumin1.substring(0,2);
	var mm = jumin1.substring(2,4);
	var dd = jumin1.substring(4,6);
	var chkSex = jumin2.substring(0,1); 
	if ((jumin1.length != 6) || (mm<1 || mm>12 || dd<1 || dd>31 )) return false;
	if ((chkSex != 1 && chkSex !=2 && chkSex !=3 && chkSex !=4) || (jumin2.length != 7)) return false;
	chkYear2 = parseInt(yy,10);
	if (chkSex <=2) chkYear2 += 1900;
	else chkYear2 += 2000;

	for (var i = 0; i <=5 ; i++) chk = chk + ((i%8+2) * parseInt(jumin1.substring(i,i+1)));
	for (var i = 6; i <=11 ; i++) chk = chk + ((i%8+2) * parseInt(jumin2.substring(i-6,i-5)));
	chk = 11 - (chk %11);
	chk = chk % 10;
	if (chk != jumin2.substring(6,7)) return false; 
	return true;
}
//E-mail 유효성 체크
function isValidEmail(email_address)  
{  
	// 이메일 주소를 판별하기 위한 정규식  
	var format = /^[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+)*@[0-9a-zA-Z-]+(\[0-9a-zA-Z-]+)*$/;  

	// 인자 email_address를 정규식 format 으로 검색  
	if (email_address.search(format) != -1)  
	{  
		// 정규식과 일치하는 문자가 있으면 true  
		return true;  
	}  
	else  
	{  
		// 없으면 false  
		return false;  
	}  
}
//한글 유효성 체크
function isValidHan(obj)  
{  
	var intLength = obj.value.length ;
	for (var i = 0 ; i < intLength ; i++) {
		var charCode = obj.value.charCodeAt(i); 
		//한글 확인
		if (charCode > 128)  return false ;
	}
	return true ;
}

//유형 비교 체크
function containsCharsOnly(input,chars) {
    for (var inx = 0; inx < input.value.length; inx++) {
       if (chars.indexOf(input.value.charAt(inx)) == -1)
           return false;
    }
    return true;
}
//숫자 유효성 체크
function isNumDash(input) {
    var chars = "0123456789";
    return containsCharsOnly(input,chars);
}