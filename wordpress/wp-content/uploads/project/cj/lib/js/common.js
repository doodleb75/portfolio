/**********************************************************************************
 *   Description : 통합 함수 정의
 *   Author      : credit@mediaset.co.kr
 *   Date        : 2011/09/05
 *   Update      :
 *   Copyright (C) MEDIASET corporation.  
 **********************************************************************************/
//콘솔 DEBUG
var debug = function(){
  // check browser has console
  if(typeof console != 'undefined' && typeof console.log != 'undefined'){
	if($.browser.msie)
	{
		console['log'](arguments); // call IE's console
	}
	else 
	{
		console['info'](arguments); // call Firebug's console	
	}
  }
}
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

String.prototype.trim = function() { //전체공백제거
       return this.replace(/^\s+|\s+$/g,"");
}
String.prototype.ltrim = function() { //좌측공백제거
       return this.replace(/^\s+/,"");    
} 
String.prototype.rtrim = function() { //우측공백제거
       return this.replace(/\s+$/,"");   
}

// Zero-Fill
String.prototype.zf = function(l) { return '0'.string(l - this.length) + this; }

//As you can see, it depends on the string prototype, an VB-like string concatenator:

// VB-like string
String.prototype.string = function(l) { var s = '', i = 0; while (i++ < l) { s += this; } return s; }

/*
Just bear in mind there's no check for the l (length) parameter, so you must always provide a number, and finally, you must create a number prototype for it (kind of an override) in order to use it directly on numbers:
*/
Number.prototype.zf = function(l) { return this.toString().zf(l); }


// a global month names array
var gsMonthNames = new Array(
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
);
// a global day names array
var gsDayNames = new Array(
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
);
// the date format prototype
Date.prototype.format = function(f)
{
    if (!this.valueOf())
        return '&nbsp;';
 
    var d = this;
 
    return f.replace(/(yyyy|mmmm|mmm|mm|dddd|ddd|dd|hh|nn|ss|a\/p)/gi,

        function($1)
        {
            switch ($1)
            {
            case 'yyyy': return d.getFullYear();
            case 'mmmm': return gsMonthNames[d.getMonth()];
            case 'mmm':  return gsMonthNames[d.getMonth()].substr(0, 3);
            case 'mm':   return (d.getMonth() + 1).zf(2);
            case 'dddd': return gsDayNames[d.getDay()];
            case 'ddd':  return gsDayNames[d.getDay()].substr(0, 3);
            case 'dd':   return d.getDate().zf(2);
            case 'hh':   return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case 'nn':   return d.getMinutes().zf(2);
            case 'ss':   return d.getSeconds().zf(2);
            case 'a/p':  return d.getHours() < 12 ? 'a' : 'p';
            }
        }  
    );
}
/* Slide Click Event  Slide 처리할 El*/
$.fn.slideEvent = function(hid)
{

	$(this).click(function() {
		var el = $("#"+hid);
		if ($(this).hasClass('hidden')){
			$(this).removeClass('hidden').addClass('visible'); 
			el.slideDown(300);
		} else {
			$(this).removeClass('visible').addClass('hidden');
			el.slideUp(1300);
		}
		//e.preventDefault();
	});
}
/** 
 * Input 태그 달력변경
 * @param {String} dataId
 * @param {Date} fromdate
 * Exmp : oDate.datepicker("{INPUT ID}",{YYYYMMDD});  지정된 날짜
 * Exmp : oDate.datepicker("{INPUT ID}",""); 현재날짜
 */
var oDate = {
	convertDate:function(date)
	{
		year = date.getFullYear();
		month = date.getMonth()+1;
		day = date.getDate();
		if( (year+"").length < 4 ) year += 1900;		// Firefox인 경우 1900을 더해줘야 한다		
		month = (month < 10 ? "0"+month : month );
		day   = (day   < 10 ? "0"+day   : day   );
		return ""+year+""+month+""+day;
	},	
	convertYMD:function(ymd)
	{
		return new Date(ymd.substr(0,4), ymd.substr(4,2)-1, ymd.substr(6,2));
	},
	datepicker:function(dataId,fromdate)
	{
		var from_date = this.convertDate(new Date());;
		if(fromdate){
			from_date = fromdate;
		}
		$("#"+dataId).datepicker(
		{
			showButtonPanel: true,
			changeMonth: false,
			changeYear: true,
			showWeek: false,
			firstDay: 1,
			autoSize:true,
			showOn: "button",						
			buttonImage: "/images/calendar.png",
			buttonImageOnly: true								
		});
		$("#"+dataId).datepicker( "option", "dateFormat", "yy/mm/dd" );
		$("#"+dataId).datepicker( "option", $.datepicker.regional[ "ko" ] );
		$("#"+dataId).datepicker( "option", "showAnim", "slideDown" );	
		$("#"+dataId).datepicker( "setDate", this.convertYMD(from_date));	
	}
}
$.fn.msDate = function(fromdate)
{
	function convertDate(date)
	{
		year = date.getFullYear();
		month = date.getMonth()+1;
		day = date.getDate();
		if( (year+"").length < 4 ) year += 1900;		// Firefox인 경우 1900을 더해줘야 한다		
		month = (month < 10 ? "0"+month : month );
		day   = (day   < 10 ? "0"+day   : day   );
		return ""+year+""+month+""+day;
	}
	function convertYMD(ymd)
	{
		return new Date(ymd.substr(0,4), ymd.substr(4,2)-1, ymd.substr(6,2));
	} 
		var from_date = convertDate(new Date());;
		if(fromdate){
			from_date = fromdate;
		} 
		
		$(this).datepicker(
		{
			showButtonPanel: true,
			changeMonth: false,
			changeYear: true,
			showWeek: false,
			firstDay: 1,
			autoSize:true,
			showOn: "button",						
			buttonImage: "/images/calendar.png",
			buttonImageOnly: true								
		});
		$(this).datepicker( "option", "dateFormat", "yy/mm/dd" );
		$(this).datepicker( "option", $.datepicker.regional[ "ko" ] );
		$(this).datepicker( "option", "showAnim", "slideDown" );	
		$(this).datepicker( "setDate", convertYMD(from_date));	
		return;
}
$.fn.maxHeight = function() {
	var max = 0;
	this.each(function() {
	  max = Math.max( max, $(this).height() );
	});
	return max;
};
$.fn.maxWidth = function() {
	var max = 0;
	this.each(function() {
	  max = Math.max( max, $(this).width() );
	});
	return max;
};
$.fn.onlynum = function()
{
	$(this).css({"ime-mode":"disabled"});
	$(this).keyup(function(){
	   $(this).val( $(this).val().replace(/[^0-9]/g, '') );
	});
};
/**
 *  <form id="frm">~~~~~~~~ ~~input ~~~ </form>
 *  <input type='text' id='id' class="empty" emptyMsg="아이디를 입력하세요.">
 */
$.fn.emptyChk = function()
{
	var res = true;
	$(this).find(".empty").each(function(){
		if($.trim($(this).val()) == "")
		{
			res = $(this).attr("emptyMsg");	
			return false;
		}
		return true;
	});
	return res;	
}
$(document).ready(function($){
	//datepicker 한글처리
	$.datepicker.regional['ko'] = {
        closeText: '닫기',
        prevText: '이전달',
        nextText: '다음달',
        currentText: '오늘',
        monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        dayNames: ['일','월','화','수','목','금','토'],
        dayNamesShort: ['일','월','화','수','목','금','토'],
        dayNamesMin: ['일','월','화','수','목','금','토'],
        weekHeader: 'Wk',
        dateFormat: 'yy-mm-dd',
        firstDay: 0,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ' 년'};
$.datepicker.setDefaults($.datepicker.regional['ko']);
	
	
	//팝업 이벤트 jquery plugin 처리 
	$.extend({
		/**
		 * @param {String} 비교할값 
		 * @param {Array} 배열
		 * @param {Boolean} true,false
		 * 사용법
		 * $.in_array('van', ['Kevin', 'van', 'Zonneveld']); 결과값 true
		 * $.in_array('van2', ['Kevin', 'van', 'Zonneveld']); 결과값 false
		 * $.in_array(1, ['1', '2', '3'], false); 결과값 true
		 * $.in_array(1, ['1', '2', '3'], true); 결과값 false
		 */
	    in_array:function (needle, haystack, argStrict) {
		    var key = '',
		        strict = !! argStrict;
		    if (strict) {
		        for (key in haystack) {
		            if (haystack[key] === needle) {
		                return true;
		            }
		        }
		    } else {
		        for (key in haystack) {
		            if (haystack[key] == needle) {
		                return true;
		            }
		        }
		    }
	   	 return false;
	   },
	  /**
	   * @param {String} 구분자
	   * @param {String} 구분할 문자
	   * @param {Object} limit
	   * explode(' ', 'A B C');
       * 결과 : 0:A,1:b,2:c
       * explode(' ', 'A B C',2);
       * 결과 : 0:A,1:BC  
	   */
	   explode:function  (delimiter, string, limit) {
		    var emptyArray = {
		        0: ''
		    };
		    // third argument is not required
		    if (arguments.length < 2 || typeof arguments[0] == 'undefined' || typeof arguments[1] == 'undefined') {
		        return null;
		    }
		
		    if (delimiter === '' || delimiter === false || delimiter === null) {
		        return false;
		    }
		
		    if (typeof delimiter == 'function' || typeof delimiter == 'object' || typeof string == 'function' || typeof string == 'object') {
		        return emptyArray;
		    }
		
		    if (delimiter === true) {
		        delimiter = '1';
		    }
		
		    if (!limit) {
		        return string.toString().split(delimiter.toString());
		    } else {
		        // support for limit argument
		        var splitted = string.toString().split(delimiter.toString());
		        var partA = splitted.splice(0, limit - 1);
		        var partB = splitted.join(delimiter.toString());
		        partA.push(partB);
		        return partA;
		    }
		},
		/**
		 * 
		 * @param {String} 구분
		 * @param {Object} 배열값
		 * implode(' ', ['A', 'B', 'C']);
		 * 결과 : A B C
		 */
		implode:function(glue,pieces)
		{
			var i='',retVal='',tGlue='';
			if(arguments.length===1)
			{
				pieces=glue;glue='';
			}
			if(typeof(pieces)==='object')
			{
				if(pieces instanceof Array){
					return pieces.join(glue);
				}
				else
				{
					for(i in pieces)
					{
						retVal+=tGlue+pieces[i];tGlue=glue;
					}
				return retVal;
				}
			}
			else
			{
				return pieces;
			}
		},
		/**
		 * JSON 데이터 String으로 변환
		 * @param {Object} arg
		 */
	 	JSONtoString:function(arg) {
			var rtStr = "";
			var flagStart = true;
			if (typeof(arg) == "object"){
				if (typeof(arg.length) == "number") {
					rtStr = "[";
					for (name in arg) {
						if (flagStart) {
							flagStart = false;
						} else {
							rtStr = rtStr + ","
						}
						rtStr = rtStr + JSONtoString(arg[name]);
					}
					rtStr = rtStr + "]";
				} else {
					rtStr = "{";
					for (name in arg) {
						if (flagStart) {
							flagStart = false;
						} else {
							rtStr = rtStr + ","
						}
						rtStr = rtStr + '"' + name + '":';
						rtStr = rtStr + JSONtoString(arg[name]);
					}
					rtStr = rtStr + "}";
				}
			} else {
				return '"' + arg + '"';
			}
			return rtStr;
		}
  });
  /**
   * Ajax 처리시 종료시 상태바 / 엘러메시지 알람팝업
   */
  $(".md_main_loadding").ajaxStart(function() {
    	$(".ajax_event").hide();
    	$(this).show();
  }).ajaxStop(function() {
  	$(".ajax_event").show();
    	$(this).hide(); 
  }).ajaxError(function(e,req,set){
	$("#error_msg").html("<iframe src='/form/common/error_msg.html' id='error_iframe' style='width:100%;height:500px;'/>",function(){debug("kjs")});
  	$("#error_iframe").load(function(){
  		/*
  		$("#error_msg").msPopup("init"); 		
  		$("#error_iframe").contents().find("#error_log").html(req.responseText);
  		$("#error_msg").msPopup("open");
  		$("#error_iframe").contents().find("#error_close").one("click",function(){
  			$("#error_msg").msPopup("close");
  		});
  		*/
  	});
  });
});
