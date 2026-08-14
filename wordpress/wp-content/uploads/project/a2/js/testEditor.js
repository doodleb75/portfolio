////////////////////////////////////////////////
// G-Editor ver. 1.0.0
//
// GPL License / www.sir.co.kr / 2007-11-13
////////////////////////////////////////////////
geditor = function(name) {

/////////////// 사용자 설정 시작 ///////////////

// geditor.js 파일 경로
var ge_path             = '/A2/js';

// 상단 툴바 이미지 경로
var ge_icon_path        = '/A2/images/icons';

// 이모티콘 이미지 경로
var ge_emoticon_path    = '/A2/images/editor/emoticons';

// 이모티콘 갯수
var ge_emoticon_count   = 15;

/////////////// 사용자 설정 끝 ///////////////

var winObj				=	null;

var ge_empty_path       = ge_icon_path + '/empty.gif';

var IS_IE               = true;

var _WYSIWYG            = 'WYSIWYG';
var _TEXT               = 'TEXT';
var _HTML               = 'HTML';

var ge_name             = 'geditor_'+name;
var ge_content          = name;
var ge_mode             = _WYSIWYG;
var ge_code             = '';
var ge_editor           = null;
var ge_width            = 0;
var ge_height           = 0;
var ge_image_width      = 0;
var ge_iframe           = ge_name+'_frame';
var ge_textarea         = ge_name+'_textarea';
var ge_source           = ge_name+'_source';

var ge_table_rows       = 3;
var ge_table_cols       = 3;
var ge_table_x          = 0;
var ge_table_y          = 0;

var ge_is_empty         = null;
var ge_range            = null;
var ge_image_preview    = null;
var ge_is_image         = false;

var ge_img_width        = null;

var ge_notag            = false;
var ge_nomode           = false;
var ge_noimg            = false;
var ge_nomovie          = false;

var ge_color = [ 
"#FFFFFF","#FFCCCC","#FFCC99","#FFFF99","#FFFFCC",
"#99FF99","#99FFFF","#CCFFFF","#CCCCFF","#FFCCFF",
"#CCCCCC","#FF6666","#FF9966","#FFFF66","#FFFF33",
"#66FF99","#33FFFF","#66FFFF","#9999FF","#FF99FF",
"#C0C0C0","#FF0000","#FF9900","#FFCC66","#FFFF00",
"#33FF33","#66CCCC","#33CCFF","#6666CC","#CC66CC",
"#999999","#CC0000","#FF6600","#FFCC33","#FFCC00",
"#33CC00","#00CCCC","#3366FF","#6633FF","#CC33CC",
"#666666","#990000","#CC6600","#CC9933","#999900",
"#009900","#339999","#3333FF","#6600CC","#993399",
"#333333","#660000","#993300","#996633","#666600",
"#006600","#336666","#000099","#333399","#663366",
"#000000","#330000","#663300","#663333","#333300",
"#003300","#003333","#000066","#330099","#330033"];


this.notag = function() {
    ge_notag = true;
}

this.nomode = function() {
    ge_nomode = true;
}

this.noimg = function() {
    ge_noimg = true;
}

this.nomovie = function() {
    ge_nomovie = true;
}

this.get_mode = function() {
    return ge_mode;
}

this.init = function() {
    ge_editor = document.getElementById(ge_iframe).contentWindow.document;
    ge_editor.designMode = "on";
    ge_editor.write("<html>");
    ge_editor.write("<head>");
    ge_editor.write("<style type=\"text/css\">")
    ge_editor.write("body { padding:0px; margin:5px; font-size:10pt; font-family:Dotum; }");
    ge_editor.write("td { font-size:10pt; font-family:Dotum; }");
    ge_editor.write("</style>");
    ge_editor.write("</head><body>");
    ge_editor.write(ge_code);
    ge_editor.write("</body></html>");
    ge_editor.close();

    if (navigator.appName.indexOf("Microsoft") != -1) 
        IS_IE = true; 
    else 
        IS_IE = false;

    var self    = this;
    var editor  = ge_editor;
    var name    = ge_name;

    if (IS_IE) {
        ge_editor.attachEvent("onclick", function(event) { self.eventHandler(event, editor, name); });
        ge_editor.attachEvent("onkeypress", function(event) { self.eventHandler(event, editor, name); });
        ge_editor.attachEvent("onkeyup", function(event) { self.eventHandler(event, editor, name); });

        document.getElementById(ge_iframe).contentWindow.attachEvent("onblur", function(event) { self.eventHandler(event, editor, name); });

        document.getElementById(ge_textarea).attachEvent("onchange", this.update);
        document.getElementById(ge_source).attachEvent("onchange", this.update);
    } else {
        ge_editor.addEventListener("click", function(event) { self.eventHandler(event, editor, name); }, false);
        ge_editor.addEventListener("blur",    function(event) { self.eventHandler(event, editor, name); }, false);

        document.getElementById(ge_textarea).addEventListener("change", this.update, false);
        document.getElementById(ge_source).addEventListener("change", this.update, false);
    }

    if (ge_nomode == false)
    document.getElementById(ge_name+"_geditor_html_source_button").checked = false;

    ge_editor.body.focus();

    ge_range = this.get_range();
}

this.update = function() {
    switch(ge_mode) {
        case _WYSIWYG   : ge_code = ge_editor.body.innerHTML; break;
        case _TEXT      : ge_code = document.getElementById(ge_textarea).value; break;
        case _HTML      : ge_code = document.getElementById(ge_source).value; break;
    }
    document.getElementById(ge_content).style.backgroundImage = '';
    document.getElementById(ge_content).value = ge_code;
}

this.getStrLen = function(str){
    if(str==null || str=='') return 0;
    var strlen=0;
    for(var i=0; i<str.length; i++){
        var c=str.charCodeAt(i);
        if( c < 0xac00 || 0xd7a3 < c ) strlen++;
        else strlen+=2; 
    }
    return strlen;
}

this.eventHandler = function(event, editor, ge_name) {

    if (event.type == "click")  {
        eval(ge_name + ".clear_option()");
        eval(ge_name + ".get_tags()");
    }

    if (event.type == "keypress" && IS_IE) { 
        // IE 의 경우 엔터를 입력하면 <p> 가 입력되기 때문에 이를 <br> 로 변경한다.
        var range = editor.selection.createRange();
        if (event.keyCode == 13 && range.parentElement().tagName != "LI") {
            event.returnValue = false;
            event.cancelBubble = true;
            range.pasteHTML("<br />");
            range.collapse(false);
            range.select();
        }
    }

    if (event.type == "blur")
        eval(ge_name + ".update()");

    if (event.type == "keyup") {
		switch (event.keyCode) {
			case 37:
			case 38:
			case 39:
			case 40:
			case 8:
                eval(ge_name + ".get_tags()");
		 }
    }
}

this.get_range = function() {
    ge_editor.body.focus();
    if (IS_IE)
        ge_range = ge_editor.selection.createRange();
}

this.get_tags = function() {
    var _parent = null;
    var ancestors = [];

    if (IS_IE) 
    {
        var sel = ge_editor.selection;
        var rng = sel.createRange();

        if (sel.type == "Text" || sel.type == "None")
            _parent = rng.parentElement();
        else if (sel.type == "Control")
            _parent = rng.item(0);
        else
            _parent = ge_editor.document.body;
    } 
    else
    {
        var sel = document.getElementById(ge_iframe).contentWindow.getSelection();
        var rng = sel.getRangeAt(0);

        _parent = rng.commonAncestorContainer;
        if (!rng.collapsed && rng.startContainer == rng.endContainer &&
            rng.startOffset - rng.endOffset < 2 && rng.startContainer.hasChildNodes())
        {
            _parent = rng.startContainer.childNodes[rng.startOffset];
        }

        while (_parent.nodeType == 3) {
            _parent = _parent.parentNode;
        }
    }
    while (_parent && (_parent.nodeType == 1) && (_parent.tagName.toLowerCase() != 'body')) {
        ancestors.push(_parent);
        _parent = _parent.parentNode;
    }

    ancestors.push(ge_editor.body);

    var path = '&nbsp;&lt;BODY&gt; ';

    for (var i = ancestors.length; --i >= 0;) {
        el = ancestors[i];
        if (!el || el.tagName.toUpperCase() == 'HTML' || el.tagName.toUpperCase() == 'BODY') 
            continue;
        path += '&lt;<span style="text-decoration:underline">'+el.tagName.toUpperCase()+'</span>&gt; ';
    }

    if (ge_notag == false)
        document.getElementById("geditor_"+ge_name+"_path").innerHTML = path;
}

this.edit = function(key, value) {

    if (ge_mode!=_WYSIWYG) 
        return;

    if (typeof value == 'undefined') 
        value = null;

    ge_editor.body.focus();
    ge_editor.execCommand(key, false, value);

    this.update();
    this.get_tags();
}

this.text2html = function() {
    ge_code = document.getElementById(ge_textarea).value;
    ge_code = ge_code.replace(new RegExp("", "gi"), "<br />");
    ge_code = ge_code.replace(new RegExp("<br /><TBODY", "gi"), "<TBODY");
    ge_code = ge_code.replace(new RegExp("<br /></TBODY", "gi"), "</TBODY");
    ge_code = ge_code.replace(new RegExp("<br /><TR", "gi"), "<TR");
    ge_code = ge_code.replace(new RegExp("<br /></TR", "gi"), "</TR");
    ge_code = ge_code.replace(new RegExp("<br /><TD", "gi"), "<TD");
    ge_code = ge_code.replace(new RegExp("<br /></TD", "gi"), "</TD");
}

this.html2text = function(html) {
    ge_code = html;
    ge_code = ge_code.replace(new RegExp("<P>&nbsp;</P>", "gi"), "<br />");
    ge_code = ge_code.replace(new RegExp("<P>", "gi"), "");
    ge_code = ge_code.replace(new RegExp("</P>", "gi"), "<br />");
    ge_code = ge_code.replace(new RegExp("<br>", "gi"), "<br />");
    ge_code = ge_code.replace(new RegExp("<br />", "gi"), "");
    ge_code = ge_code.replace(new RegExp("<br>", "gi"), "");
    ge_code = ge_code.replace(new RegExp("\r", "gi"), "");
}

this.mode_change = function() {

    this.clear_option();

    switch(ge_mode) {

        case _WYSIWYG:
            ge_mode = _TEXT;
            this.html2text(ge_editor.body.innerHTML); 
            document.getElementById(ge_iframe).style.display = 'none';
            document.getElementById(ge_iframe).style.display = 'none';
            document.getElementById(ge_source).style.display = 'none';
            document.getElementById(ge_textarea).style.display = 'block';
            document.getElementById(ge_textarea).value = ge_code;
            document.getElementById(ge_name+"_geditor_html_source_button").checked = false;
            document.getElementById(ge_name+"_geditor_html_source_div").style.display = 'none';
            document.getElementById(ge_name+"_geditor_status").value = _TEXT;
            document.getElementById(ge_name+"_geditor_toolbar").style.visibility = 'hidden';
            break;

        case _TEXT:
            ge_mode = _WYSIWYG;
            this.text2html();
            document.getElementById(ge_textarea).value = '';
            document.getElementById(ge_iframe).style.display = 'block';
            document.getElementById(ge_source).style.display = 'none';
            document.getElementById(ge_textarea).style.display = 'none';
            document.getElementById(ge_name+"_geditor_html_source_div").style.display = 'block';
            document.getElementById(ge_name+"_geditor_html_source_button").checked = false;
            document.getElementById(ge_name+"_geditor_status").value = _WYSIWYG;
            document.getElementById(ge_name+"_geditor_toolbar").style.visibility = 'visible';
            this.init();
            break;

        case _HTML: 
            ge_mode = _TEXT;
            this.html2text(document.getElementById(ge_source).value); 
            document.getElementById(ge_source).value = '';
            document.getElementById(ge_iframe).style.display = 'none';
            document.getElementById(ge_source).style.display = 'none';
            document.getElementById(ge_textarea).style.display = 'block';
            document.getElementById(ge_textarea).value = ge_code;
            document.getElementById(ge_name+"_geditor_html_source_button").checked = false;
            document.getElementById(ge_name+"_geditor_html_source_div").style.display = 'none';
            document.getElementById(ge_name+"_geditor_status").value = _TEXT;
            document.getElementById(ge_name+"_geditor_toolbar").style.visibility = 'hidden';
            break;
    }
}

this.html_source = function(code) {
    code = code.replace(new RegExp("<P>&nbsp;</P>", "gi"), "<br />");
    code = code.replace(new RegExp("<P>", "gi"), "");
    code = code.replace(new RegExp("</P>", "gi"), "<br />");
    code = code.replace(new RegExp("<br>", "gi"), "<br />");
    return code;
}

this.mode_source = function(flag) {
    if (flag==true) {
        ge_code = this.html_source(ge_editor.body.innerHTML);
        document.getElementById(ge_iframe).style.display = 'none';
        document.getElementById(ge_source).style.display = 'block';
        document.getElementById(ge_source).value = ge_code;
        document.getElementById(ge_name+"_geditor_status").value = _WYSIWYG;
        document.getElementById(ge_name+"_geditor_toolbar").style.visibility = 'hidden';
        ge_mode = _HTML;
    } else {
        ge_code = document.getElementById(ge_source).value;
        ge_mode = _WYSIWYG;
        document.getElementById(ge_source).value = '';
        document.getElementById(ge_iframe).style.display = 'block';
        document.getElementById(ge_source).style.display = 'none';
        document.getElementById(ge_name+"_geditor_toolbar").style.visibility = 'visible';
        this.init();
    }
}

this.run = function() {

    var content = document.getElementById(ge_content);

    if (content.style.width)
        ge_width = content.style.width;
    else if (content.offsetWidth)
        ge_width = content.offsetWidth;
    else if (content.cols)
        ge_width = content.cols*6.5;

    if (content.style.height)
        ge_height = content.style.height;
    else if (content.offsetHeight)
        ge_height = content.offsetHeight;
    else if (content.cols)
        ge_height = content.rows*20;

    ge_code = content.value;

    var div = document.createElement('div');
    draw = "<table id="+ge_name+"_outline border=0 cellpadding=0 cellspacing=0 width="+ge_width+"><tr><td valign=top>";
    draw += "<div>";
    draw += "<span style='cursor:pointer;' onclick=\""+ge_name+".height_decrease(100);\"><img src=\""+ge_icon_path+"/up.gif\" border=0></span>";
    draw += "<span style='cursor:pointer; margin-left:2px;' onclick=\""+ge_name+".height_original();\"><img src=\""+ge_icon_path+"/start.gif\" border=0></span>";
    draw += "<span style='cursor:pointer; margin-left:2px;' onclick=\""+ge_name+".height_increase(100);\"><img src=\""+ge_icon_path+"/down.gif\" border=0></span>";
    draw += "</div>";
    draw += "<div id="+ge_name+"_geditor_toolbar style=\"width:"+ge_width+"\">";
    draw += "<span title=\"글꼴\" style=\"cursor:pointer;\" onclick=\""+ge_name+".font_family(this)\"><img src=\""+ge_icon_path+"/font.gif\" align=\"absmiddle\" width=\"30\" height=\"20\"></span>";
    draw += "<span title=\"크기\" style=\"cursor:pointer;\" onclick=\""+ge_name+".font_size(this)\"><img src=\""+ge_icon_path+"/size.gif\" align=\"absmiddle\" width=\"30\" height=\"20\"></span>";
    draw += "<span title=\"글자색\" style=\"cursor:pointer;\" onclick=\""+ge_name+".insert_color(this,'fore')\"><img src=\""+ge_icon_path+"/forecolor.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
    draw += "<span title=\"배경색\" style=\"cursor:pointer;\" onclick=\""+ge_name+".insert_color(this,'back')\"><img src=\""+ge_icon_path+"/backcolor.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
    draw += "<span title=\"박스넣기\" style=\"cursor:pointer;\" onclick=\""+ge_name+".insert_box(this)\"><img src=\""+ge_icon_path+"/box.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
	draw += "<span title=\"특수기호\" style=\"cursor:pointer;\" onclick=\""+ge_name+".insert_scharter(this)\"><img src=\""+ge_icon_path+"/media.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
    draw += "<span title=\"굵게\" style=\"cursor:pointer;\" onclick=\""+ge_name+".edit('bold')\"><img src=\""+ge_icon_path+"/bold.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
    draw += "<span title=\"기울기\" style=\"cursor:pointer;\" onclick=\""+ge_name+".edit('italic')\"><img src=\""+ge_icon_path+"/italic.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
    draw += "<span title=\"밑줄\" style=\"cursor:pointer;\" onclick=\""+ge_name+".edit('underline')\"><img src=\""+ge_icon_path+"/underline.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
    draw += "<span title=\"가운데줄\" style=\"cursor:pointer;\" onclick=\""+ge_name+".edit('strikethrough')\"><img src=\""+ge_icon_path+"/strike.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
    draw += "<span title=\"왼쪽 정렬\" style=\"cursor:pointer;\" onclick=\""+ge_name+".edit('JustifyLeft')\"><img src=\""+ge_icon_path+"/justifyleft.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
    draw += "<span title=\"가운데 정렬\" style=\"cursor:pointer;\" onclick=\""+ge_name+".edit('JustifyCenter')\"><img src=\""+ge_icon_path+"/justifycenter.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
    draw += "<span title=\"오른쪽 정렬\" style=\"cursor:pointer;\" onclick=\""+ge_name+".edit('JustifyRight')\"><img src=\""+ge_icon_path+"/justifyright.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
    draw += "<span title=\"양쪽 정렬\" style=\"cursor:pointer;\" onclick=\""+ge_name+".edit('JustifyFull')\"><img src=\""+ge_icon_path+"/justifyfull.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
    draw += "<span title=\"숫자 목록\" style=\"cursor:pointer;\" onclick=\""+ge_name+".edit('insertorderedlist')\"><img src=\""+ge_icon_path+"/orderedlist.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
    draw += "<span title=\"점 목록\" style=\"cursor:pointer;\" onclick=\""+ge_name+".edit('insertunorderedlist')\"><img src=\""+ge_icon_path+"/unorderedlist.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
    draw += "<span title=\"들여쓰기\" style=\"cursor:pointer;\" onclick=\""+ge_name+".edit('Indent')\"><img src=\""+ge_icon_path+"/indent.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
    draw += "<span title=\"내어쓰기\" style=\"cursor:pointer;\" onclick=\""+ge_name+".edit('Outdent')\"><img src=\""+ge_icon_path+"/outdent.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
    draw += "<span title=\"링크넣기\" style=\"cursor:pointer;\" onclick=\""+ge_name+".insert_link(this)\"><img src=\""+ge_icon_path+"/link.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
    draw += "<span title=\"링크삭제\" style=\"cursor:pointer;\" onclick=\""+ge_name+".edit('UnLink')\"><img src=\""+ge_icon_path+"/unlink.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
	draw += "<span title=\"위첨자\" style=\"cursor:pointer;\" onclick=\""+ge_name+".insert_sup(this)\"><img src=\""+ge_icon_path+"/media.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
	draw += "<span title=\"아래첨자\" style=\"cursor:pointer;\" onclick=\""+ge_name+".insert_sub(this)\"><img src=\""+ge_icon_path+"/media.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
	if (ge_nomovie == true)	{
    draw += "<span title=\"미디어\" style=\"cursor:pointer;\" onclick=\""+ge_name+".insert_movie(this)\"><img src=\""+ge_icon_path+"/media.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";	
	}
    if (ge_noimg == false) {
    draw += "<span title=\"그림넣기\" style=\"cursor:pointer;\" onclick=\""+ge_name+".insert_image(this)\"><img src=\""+ge_icon_path+"/image.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
    }
    draw += "<span title=\"테이블 만들기\" style=\"cursor:pointer;\" onclick=\""+ge_name+".insert_table(this)\"><img src=\""+ge_icon_path+"/table.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
//    draw += "<span title=\"이모티콘\" style=\"cursor:pointer;\" onclick=\""+ge_name+".insert_emoticon(this)\"><img src=\""+ge_icon_path+"/em.gif\" align=\"absmiddle\" width=\"19\" height=\"20\"></span>";
    draw += "</div>";
    draw += "<div id=geditor_"+ge_name+" style=\"width:"+ge_width+";height:"+(parseInt(ge_height)+5)+"px;border:1px solid #ccc;\">";
    draw += "<iframe id=\""+ge_iframe+"\" style=\"width:100%;height:"+ge_height+";border:0;padding:0px;margin:0px;\" frameborder=0></iframe>";
    draw += "<textarea id=\""+ge_textarea+"\" style=\"width:100%;height:"+ge_height+";display:none;border:0;padding:5px;margin:0px;font-size:12px;font-family:Gulim;line-height:20px;word-break:break-all;\"></textarea>";
    draw += "<textarea id=\""+ge_source+"\" style=\"width:100%;height:"+ge_height+";display:none;border:0;padding:5px;margin:0px;font-size:12px;font-family:Gulim;line-height:20px;word-break:break-all;\"></textarea>";
    draw += "</div>";
    if (ge_notag == false) {
		draw += "<div id=geditor_"+ge_name+"_path style=\"overflow:hidden;line-height:25px;font-size:11px;margin-top:5px;width:"+ge_width+";height:25px;border:1px solid #ccc;\"></div>";
    }
    if (ge_nomode == false) {
    draw += "<table border=0 cellpadding=0 cellspacing=0 width=100% height=30 style=\"margin-top:5px;margin-bottom:5px;border:1px solid #ccc;background-color:#efefef;\"><tr>";
    draw += "<td style=\"font-size:12px;padding-left:10px;\" width=180><b>에디터 상태</b> : <select id="+ge_name+"_geditor_status onchange="+ge_name+".mode_change()><option value=WYSIWYG>HTML</option><option value=TEXT>TEXT</option></select></td>";
    draw += "<td style=\"font-size:12px;padding-left:10px;\"><span onclick=\""+ge_name+".html_preview()\" style=\"cursor:pointer\">[미리보기]</span></td>";
    draw += "<td align=right style=\"padding-right:10px;\"><span id="+ge_name+"_geditor_html_source_div style=\"font-size:12px;\"><input type=checkbox id="+ge_name+"_geditor_html_source_button onclick=\""+ge_name+".mode_source(this.checked)\">HTML Source</span></td>";
    draw += "</tr></table>";
    }
    draw += "</td></tr></table>";
    draw += "<iframe name=\"geditor_"+ge_name+"_hidden_frame\" border=0 frameborder=0 width=0 height=0></iframe>";
    draw += "</div>";
    div.innerHTML = draw;
    document.getElementById(ge_content).parentNode.insertBefore(div, document.getElementById(ge_content));
    document.getElementById(ge_content).style.backgroundImage = '';
    document.getElementById(ge_content).style.display = 'none';
    this.init();
}

this.insert_scharter = function(obj) {

	var sCharMenu  = ['일반기호','숫자와 단위','원,괄호','한글','그리스,라틴어','일본어'];
	var charSet = [6];

    charSet[0] = ["FF5B","FF5D","3014","3015","3008","3009","300A","300B","300C","300D","300E","300F","3010","3011","2018","2019","201C","201D","3001","3002","%B7","2025","2026","%A7","203B","2606","2605","25CB","25CF","25CE","25C7","25C6","25A1","25A0","25B3","25B2","25BD","25BC","25C1","25C0","25B7","25B6","2664","2660","2661","2665","2667","2663","2299","25C8","25A3","25D0","25D1","2592","25A4","25A5","25A8","25A7","25A6","25A9","%B1","%D7","%F7","2260","2264","2265","221E","2234","%B0","2032","2033","2220","22A5","2312","2202","2261","2252","226A","226B","221A","223D","221D","2235","222B","222C","2208","220B","2286","2287","2282","2283","222A","2229","2227","2228","FFE2","21D2","21D4","2200","2203","%B4","FF5E","02C7","02D8","02DD","02DA","02D9","%B8","02DB","%A1","%BF","02D0","222E","2211","220F","266D","2669","266A","266C","327F","2192","2190","2191","2193","2194","2195","2197","2199","2196","2198","321C","2116","33C7","2122","33C2","33D8","2121","2668","260F","260E","261C","261E","%B6","2020","2021","%AE","%AA","%BA","2642","2640"];
    charSet[1] = ["%BD","2153","2154","%BC","%BE","215B","215C","215D","215E","%B9","%B2","%B3","2074","207F","2081","2082","2083","2084","2160","2161","2162","2163","2164","2165","2166","2167","2168","2169","2170","2171","2172","2173","2174","2175","2176","2177","2178","2179","FFE6","%24","FFE5","FFE1","20AC","2103","212B","2109","FFE0","%A4","2030","3395","3396","3397","2113","3398","33C4","33A3","33A4","33A5","33A6","3399","339A","339B","339C","339D","339E","339F","33A0","33A1","33A2","33CA","338D","338E","338F","33CF","3388","3389","33C8","33A7","33A8","33B0","33B1","33B2","33B3","33B4","33B5","33B6","33B7","33B8","33B9","3380","3381","3382","3383","3384","33BA","33BB","33BC","33BD","33BE","33BF","3390","3391","3392","3393","3394","2126","33C0","33C1","338A","338B","338C","33D6","33C5","33AD","33AE","33AF","33DB","33A9","33AA","33AB","33AC","33DD","33D0","33D3","33C3","33C9","33DC","33C6"];
    charSet[2] = ["3260","3261","3262","3263","3264","3265","3266","3267","3268","3269","326A","326B","326C","326D","326E","326F","3270","3271","3272","3273","3274","3275","3276","3277","3278","3279","327A","327B","24D0","24D1","24D2","24D3","24D4","24D5","24D6","24D7","24D8","24D9","24DA","24DB","24DC","24DD","24DE","24DF","24E0","24E1","24E2","24E3","24E4","24E5","24E6","24E7","24E8","24E9","2460","2461","2462","2463","2464","2465","2466","2467","2468","2469","246A","246B","246C","246D","246E","3200","3201","3202","3203","3204","3205","3206","3207","3208","3209","320A","320B","320C","320D","320E","320F","3210","3211","3212","3213","3214","3215","3216","3217","3218","3219","321A","321B","249C","249D","249E","249F","24A0","24A1","24A2","24A3","24A4","24A5","24A6","24A7","24A8","24A9","24AA","24AB","24AC","24AD","24AE","24AF","24B0","24B1","24B2","24B3","24B4","24B5","2474","2475","2476","2477","2478","2479","247A","247B","247C","247D","247E","247F","2480","2481","2482"];
	charSet[3] = ["3131","3132","3133","3134","3135","3136","3137","3138","3139","313A","313B","313C","313D","313E","313F","3140","3141","3142","3143","3144","3145","3146","3147","3148","3149","314A","314B","314C","314D","314E","314F","3150","3151","3152","3153","3154","3155","3156","3157","3158","3159","315A","315B","315C","315D","315E","315F","3160","3161","3162","3163","3165","3166","3167","3168","3169","316A","316B","316C","316D","316E","316F","3170","3171","3172","3173","3174","3175","3176","3177","3178","3179","317A","317B","317C","317D","317E","317F","3180","3181","3182","3183","3184","3185","3186","3187","3188","3189","318A","318B","318C","318D","318E"];
	charSet[4] = ["0391","0392","0393","0394","0395","0396","0397","0398","0399","039A","039B","039C","039D","039E","039F","03A0","03A1","03A3","03A4","03A5","03A6","03A7","03A8","03A9","03B1","03B2","03B3","03B4","03B5","03B6","03B7","03B8","03B9","03BA","03BB","03BC","03BD","03BE","03BF","03C0","03C1","03C3","03C4","03C5","03C6","03C7","03C8","03C9","%C6","%D0","0126","0132","013F","0141","%D8","0152","%DE","0166","014A","%E6","0111","%F0","0127","I","0133","0138","0140","0142","0142","0153","%DF","%FE","0167","014B","0149","0411","0413","0414","0401","0416","0417","0418","0419","041B","041F","0426","0427","0428","0429","042A","042B","042C","042D","042E","042F","0431","0432","0433","0434","0451","0436","0437","0438","0439","043B","043F","0444","0446","0447","0448","0449","044A","044B","044C","044D","044E","044F"];
	charSet[5] = ["3041","3042","3043","3044","3045","3046","3047","3048","3049","304A","304B","304C","304D","304E","304F","3050","3051","3052","3053","3054","3055","3056","3057","3058","3059","305A","305B","305C","305D","305E","305F","3060","3061","3062","3063","3064","3065","3066","3067","3068","3069","306A","306B","306C","306D","306E","306F","3070","3071","3072","3073","3074","3075","3076","3077","3078","3079","307A","307B","307C","307D","307E","307F","3080","3081","3082","3083","3084","3085","3086","3087","3088","3089","308A","308B","308C","308D","308E","308F","3090","3091","3092","3093","30A1","30A2","30A3","30A4","30A5","30A6","30A7","30A8","30A9","30AA","30AB","30AC","30AD","30AE","30AF","30B0","30B1","30B2","30B3","30B4","30B5","30B6","30B7","30B8","30B9","30BA","30BB","30BC","30BD","30BE","30BF","30C0","30C1","30C2","30C3","30C4","30C5","30C6","30C7","30C8","30C9","30CA","30CB","30CC","30CD","30CE","30CF","30D0","30D1","30D2","30D3","30D4","30D5","30D6","30D7","30D8","30D9","30DA","30DB","30DC","30DD","30DE","30DF","30E0","30E1","30E2","30E3","30E4","30E5","30E6","30E7","30E8","30E9","30EA","30EB","30EC","30ED","30EE","30EF","30F0","30F1","30F2","30F3","30F4","30F5","30F6"];

    this.get_range();
    this.clear_option();

    var div = this.get_option_div(obj , 100);
    div.id = "geditor_option_div";

	var table = document.createElement('table');
	var tbody = document.createElement('tbody');
	var tr = document.createElement('tr');

    for(var i=0; i<sCharMenu.length; i++) {
		var td = document.createElement('td');
        var btn = this.charter_button()
        btn.style.fontFamily = sCharMenu[i];
        btn.onclick = new Function(ge_name + ".refresh_charter('" + i + "')");
        btn.value = sCharMenu[i];
        td.appendChild(btn);
		tr.appendChild(td);
    }

	tbody.appendChild(tr);
	table.appendChild(tbody);
	div.appendChild(table);

	table =  document.createElement('table');
	tbody = document.createElement('tbody');

	for(var i=0; i< charSet[0].length; i++){
		if(i == 0 || (i+1) % 20 == 0)
			tr = document.createElement('tr');
		var td = document.createElement('td');
		var btn = document.createElement('input');
		btn.type = 'button';
		btn.style.cursor = 'pointer';
		btn.style.border = '0';
		btn.style.width = '20px';
		btn.style.backgroundColor = '#ffffff';
		btn.onmouseover = function() { this.style.backgroundColor = '#efefef'; }
		btn.onmouseout = function() { this.style.backgroundColor = '#ffffff'; }
		btn.value = unescape(charSet[0][i].replace(/(\S{4})/g, function(a){return "%u"+a}));
		td.appendChild(btn);
		tr.appendChild(td);
		if((i+1) % 20 == 0)
			tbody.appendChild(tr);
	}
	table.appendChild(tbody);
	div.appendChild(table);

    document.body.appendChild(div);
}

this.charter_button = function() {
    var btn = document.createElement('input');
    btn.type = 'button';
    btn.style.fontSize = '11px';
    btn.style.cursor = 'pointer';
    btn.style.border = '0';
    btn.style.backgroundColor = '#ffffff';
    btn.style.textAlign = 'center';
    btn.style.height = '12px';
    btn.onmouseover = function() { this.style.backgroundColor = '#efefef'; }
    btn.onmouseout = function() { this.style.backgroundColor = '#ffffff'; }
    return btn;
}

this.font_family = function(obj) {
    var font_kor  = ['Gulim', 'GulimChe', 'Dotum', 'DotumChe', 'Batang', 'BatangChe', 'Gungsuh', 'GungsuhChe'];
    var font_kori = ['굴림', '굴림체', '돋움', '돋움체', '바탕', '바탕체', '궁서', '궁서체'];
    var font_eng  = ['Verdana', 'Tahoma', 'Arial', 'Arial Black', 'Courier', 'Times New Roman'];

    var kor = '가나다라마바사';
    var eng = 'ABCDEFGHIJKLMN';

    this.get_range();
    this.clear_option();

    var div = this.get_option_div(obj);
    div.id = "geditor_option_div";

    for(var i=0; i<font_kor.length; i++) {
        var list = document.createElement('div');
        var btn = this.font_family_button()
        btn.style.fontFamily = font_kor[i];
        btn.onclick = new Function(ge_name + ".font_family_change('" + font_kor[i] + "')");
        btn.value = kor + " (" + font_kori[i] + ")";
        list.appendChild(btn);
        div.appendChild(list);
    }
    for(var i=0; i<font_eng.length; i++) {
        var list = document.createElement('div');
        var btn = this.font_family_button()
        btn.style.fontFamily = font_eng[i];
        btn.onclick = new Function(ge_name + ".font_family_change('" + font_eng[i] + "')");
        btn.value = eng + " (" + font_eng[i] + ")";
        list.appendChild(btn);
        div.appendChild(list);
    }
    document.body.appendChild(div);
}

this.font_family_button = function() {
    var btn = document.createElement('input');
    btn.type = 'button';
    btn.style.fontSize = '12px';
    btn.style.cursor = 'pointer';
    btn.style.border = '0';
    btn.style.backgroundColor = '#ffffff';
    btn.style.textAlign = 'center';
    btn.style.width = '250px';
    btn.style.height = '20px';
    btn.onmouseover = function() { this.style.backgroundColor = '#efefef'; }
    btn.onmouseout = function() { this.style.backgroundColor = '#ffffff'; }
    return btn;
}

this.font_family_change = function(font) {
    this.edit('fontName', font);
    this.clear_option();
}

this.font_size = function(obj) {
    this.get_range();
    this.clear_option();

    var div = this.get_option_div(obj);
    div.id = "geditor_option_div";

    var size_pt = [8, 10, 12, 14, 18, 24, 36];

    for(var i=1; i<7; i++) {
        var list = document.createElement('div');
        var btn = this.font_size_button()
        btn.onclick = new Function(ge_name + ".font_size_change('" + i + "')");
        btn.value = size_pt[i-1] + " pt";
        list.appendChild(btn);
        div.appendChild(list);
    }
    document.body.appendChild(div);
}

this.font_size_button = function() {
    var btn = document.createElement('input');
    btn.type = 'button';
    btn.style.fontSize = '12px';
    btn.style.cursor = 'pointer';
    btn.style.border = '0';
    btn.style.backgroundColor = '#ffffff';
    btn.style.textAlign = 'center';
    btn.style.width = '50px';
    btn.style.height = '20px';
    btn.onmouseover = function() { this.style.backgroundColor = '#efefef'; }
    btn.onmouseout = function() { this.style.backgroundColor = '#ffffff'; }
    return btn;
}

this.font_size_change = function(size) {
    this.edit('fontSize', size);
    this.clear_option();
}

this.insert_image = function(obj) {
    var file = "";
    this.clear_option();
    this.get_range();

    var self = this;

    var div = this.get_option_div(obj, 200);
    div.id = "geditor_option_image_div";
    div.innerHTML = '<div><b>이미지 파일 입력</b></div>';

    ge_is_empty = document.createElement('input');
    ge_is_empty.type = 'hidden';
    ge_is_empty.id = 'ge_is_empty';
    ge_is_empty.value = 'true';

    div.appendChild(ge_is_empty);

    var img_div = document.createElement("div");
    img_div.style.width = '300px';
    img_div.style.height = '100px';
    img_div.style.border = '1px solid #ccc';
    img_div.style.paddingTop = '10px';
    img_div.style.paddingBottom = '10px';
    img_div.style.marginBottom = '10px';
    img_div.style.textAlign = 'center';
    img_div.style.backgroundColor = '#ccc';

    ge_image_preview = document.createElement("img");
    ge_image_preview.id = ge_name + '_image';
    ge_image_preview.style.width = '100px';
    ge_image_preview.style.height = '100px';
    ge_image_preview.style.backgroundColor = '#fff';
    ge_image_preview.src = ge_empty_path;
    ge_image_preview.onerror = function() { this.src = ge_empty_path; ge_is_empty.value = 'true'; }
    
    ge_img_width = document.createElement("img");
    ge_img_width.style.display = 'none';

    img_div.appendChild(ge_image_preview);

    var file_div = document.createElement("div");

    var form = document.createElement('form');
    form.id = "geditor_image_form";
    form.name = "inputform";
    form.method = 'post';
    form.encoding = 'multipart/form-data';
    form.target = 'geditor_'+ge_name+'_hidden_frame';
    form.action = '/A2/geditor/upload.jsp';
    form.style.margin = '0';
    form.style.padding = '0';
    form.style.fontSize = 12;
    form.innerHTML = '파일 : ';

    var obj = document.createElement('input');
    obj.type = 'hidden';
    obj.name = 'obj';
    obj.value = ge_name;
    form.appendChild(obj);

    var token = document.createElement('input');
    token.type = 'hidden';
    token.name = 'token';
    token.value = Math.floor(Math.random()*10000);
    form.appendChild(token);

    var work = document.createElement('input');
    work.id = "geditor_image_form_work";
    work.type = 'hidden';
    work.name = 'actionName';
    work.value = 'imgUpload';
    form.appendChild(work);

    var input_file = document.createElement("input");
    input_file.type = 'file';
    input_file.name = 'image';
    input_file.style.height = '22px';
    input_file.size = 15;
    input_file.onchange = function() {
        if (this.value) {
            ge_is_empty.value = 'false';
            input_addr.value = 'http://';
            work.value = 'imgUpload';
            form.submit();
        }
    }
    form.appendChild(input_file)

    var input = document.createElement("input");
    input.type = 'button';
    input.value = '삭제';
    input.onclick = function() {
        work.value = 'imgDelete';
        form.submit();
        ge_image_preview.src = ge_empty_path;
        ge_is_empty.value = 'true';
        input_addr.value = 'http://';
    }
    form.appendChild(input);

    file_div.appendChild(form);

    var addr_div = document.createElement("div");
    addr_div.style.fontSize = 12;
    addr_div.innerHTML = '주소 : ';

    var pre = null;

    var input_addr = document.createElement("input");
    input_addr.type = 'text';
    input_addr.style.height = '22px';
    input_addr.size = 30;
    input_addr.value = 'http://';
    input_addr.onkeyup = function() {
        clearTimeout(pre);
        pre = setTimeout(function() {
            if (input_file.value && ge_image_preview.src) {
                work.value = 'delete';
                form.submit();
            }
            ge_image_preview.src = input_addr.value;
            ge_is_empty.value = 'false';
        }, 1000);
    }

    addr_div.appendChild(input_addr);

    var align_div = document.createElement("div");
    align_div.style.fontSize = 12;
    align_div.innerHTML = '정렬 : ';

    var align_select = document.createElement("select");

    align_option_items = ['기본', '좌측정렬', '중앙정렬', '우측정렬'];
    align_option_value = ['', 'left', 'center', 'right'];

    for (i=0; i<align_option_items.length; i++) {
        var align_option = document.createElement("option");
        align_option.value = align_option_value[i];
        align_option.innerHTML = align_option_items[i];
        align_select.appendChild(align_option);
    }
    align_div.appendChild(align_select);

    var info_div = document.createElement('div');
    info_div.style.paddingTop = '10px';
    info_div.style.paddingBottom = '5px';
    info_div.style.color = '#717171';
    //info_div.innerHTML = '파일업로드가 주소입력보다 우선합니다.';

    var button_div = document.createElement('div');
    button_div.style.width = '300px';
    button_div.style.textAlign = 'center';
    button_div.style.paddingTop = '10px';
    button_div.style.paddingBottom = '10px';

    var submit = this.button('확인');
    submit.onclick  = function() {
        if (ge_is_empty.value != 'true') {
            file  = ge_image_preview.src;
            var imgWidth = '';
            maxWidth = 700;
            if ( ge_img_width.width > maxWidth )
            	imgWidth = maxWidth;
            else
            	imgWidth = ge_img_width.width;

            where = align_select.value;
            html  = "<img src=\"" + file + "\" width=\""+imgWidth+"\" align=\"" + where + "\"><br/>";
            if (where == 'center')
                html = "<div align=\"center\">" + html + "</div>";
            ge_is_image = true;
            self.insert_editor(html);
        } else {
            self.clear_option();
        }
    }

    var close = this.button('닫기');
    close.onclick = function() {
        self.clear_option();
    }

    button_div.appendChild(submit);
    button_div.appendChild(close);

    div.appendChild(img_div);
    div.appendChild(file_div);
    div.appendChild(addr_div);
    div.appendChild(align_div);
    div.appendChild(info_div);
    div.appendChild(button_div);
    document.body.appendChild(div);
}

this.button = function(text) {
    var btn = document.createElement("input");
    btn.type = 'button';
    btn.value = text;
    btn.style.backgroundColor = '#ffffff';
    btn.style.border = '1px solid #ccc';
    btn.style.width = '40px';
    btn.style.height = '22px';
    btn.style.marginLeft = '10px';
    return btn;
}

this.insert_image_preview = function(file) {
    ge_image_preview.src = file;
    ge_img_width.src = file;
}

this.insert_emoticon = function(obj) {

    this.clear_option();
    this.get_range();

    var div = this.get_option_div(obj, 250);
    div.id = "geditor_option_div";
    div.style.width = '300px';

    var info = document.createElement("div");
    info.style.fontSize = 12;
    info.innerHTML = "<b>이모티콘</b> <a href=\"javascript:"+ge_name+".clear_option();\" style=\"color:#ccc;\">[닫기]</a>";

    var emoticons = document.createElement("div");

    for (var i=1; i<=ge_emoticon_count; i++) {
        var span = document.createElement("span");
        span.style.paddingRight = '5px';

        var img = document.createElement("img");
        img.src = ge_emoticon_path + "/" + i + ".gif";
        img.style.cursor = 'pointer';
        img.onclick = new Function(ge_name+".insert_emoticon_to_editor(\""+img.src+"\")");

        span.appendChild(img)
        emoticons.appendChild(span);
    }
    div.appendChild(info);
    div.appendChild(emoticons);
    document.body.appendChild(div);
}

this.insert_emoticon_to_editor = function(file) {
    this.insert_editor("<img src=\""+file+"\" border=0>");
}

this.insert_box = function(obj) {

    this.clear_option();
    this.get_range();

    var self = this;

    var div = this.get_option_div(obj);
    div.id = "geditor_option_div";
    div.style.width = '200px';

    var info = document.createElement("div");
    info.style.fontSize = 12;
    info.innerHTML = "<b>박스</b> <a href=\"javascript:"+ge_name+".clear_option();\" style=\"color:#ccc;\">[닫기]</a>";

    div.appendChild(info);

    var bgcolor     = [ "#FFDAED","#C9EDFF","#D0FF9D","#FAFFA9","#E4E4E4" ];
    var bordercolor = [ "#FF80C2","#71D0FF","#6FD200","#CED900","#919191" ];

    for (var i=0; i<5; i++) {
        var color = bgcolor[i];
        var box_div = document.createElement("div");
        var box = document.createElement("input");
        box.type = 'button';
        box.style.border = '1px solid ' + bordercolor[i];
        box.style.backgroundColor = bgcolor[i];
        box.style.height = '10px';
        box.style.marginBottom = '5px';
        box.style.cursor = 'pointer';
        box.style.width = '200px';
        box.style.height = '20px';
        box.value = "";
        box.onclick = new Function(ge_name+".insert_box_to_editor(\""+bgcolor[i]+"\", \""+bordercolor[i]+"\")");
        box_div.appendChild(box)
        div.appendChild(box_div);
    }
    document.body.appendChild(div);
}

this.insert_box_to_editor = function(bgcolor, bordercolor) {
    this.insert_editor("<div style=\"background-color:" + bgcolor + "; padding:5px; border:1px solid " + bordercolor + "\">", "<br/></div><br/>");
}

this.insert_movie = function(obj) {

    this.clear_option();
    this.get_range();

    var self = this;
    var div = this.get_option_div(obj, 100);
    div.id = "geditor_option_div";

    var info = document.createElement("div");
    info.style.fontSize = '12px';
    info.style.border = '1px solid #ccc';
    info.style.padding = '5px';
	info.style.marginBottom = '10px';
    info.innerHTML = '<b>무비클립 HTML 넣기</b>';

    var input_div = document.createElement("div");

    var input = document.createElement("textarea");
    input.cols = 30;
    input.rows = 3;
    input.style.fontSize = '12px';

    input_div.appendChild(input);

    var button = document.createElement("div");
    button.style.paddingTop = '10px';
    button.style.paddingBottom = '5px';
    button.style.textAlign = 'center';

    var submit = this.button('확인');
    submit.onclick  = function() {
        alert("위지윅 에디터에서는 정상적으로 보이지 않을 수 있습니다.미디어 삽입시 HTML source 모드 혹은 TEXT 모드로 꼭 확인해주세요.");
        self.insert_editor(input.value);
    }

    var close = this.button('닫기');
    close.onclick = function() { self.clear_option(); }

    button.appendChild(submit);
    button.appendChild(close);
    
    info.appendChild(input_div);
    info.appendChild(button);

    div.appendChild(info);

	/*
	 * 무비클립 업로드 하기
	*/
	var info = document.createElement("div");
    info.style.fontSize = '12px';
    info.style.border = '1px solid #ccc';
    info.style.padding = '5px';
    info.innerHTML = '<b>무비클립 업로드</b>';

    var src_div = document.createElement("div");

	var form = document.createElement('form');
    form.id = "geditor_image_form";
    form.name = "inputform";
    form.method = 'post';
    form.encoding = 'multipart/form-data';
    form.target = 'geditor_'+ge_name+'_hidden_frame';
//	form.target = '_new';
    form.action = '/A2/geditor/movieUpload.jsp';
    form.style.margin = '0';
    form.style.padding = '0';
    form.style.fontSize = 12;
    form.innerHTML = '파일 : ';

    var obj = document.createElement('input');
    obj.type = 'hidden';
    obj.name = 'obj';
    obj.value = ge_name;
    form.appendChild(obj);

	var hObj1 = document.createElement('input');
    hObj1.type = 'hidden';
    hObj1.name = 'movieWidth';
    form.appendChild(hObj1);

	var hObj2 = document.createElement('input');
    hObj2.type = 'hidden';
    hObj2.name = 'movieHeight';
    form.appendChild(hObj2);

    var input_file = document.createElement("input");
    input_file.type = 'file';
    input_file.name = 'movie';
    input_file.style.height = '22px';
    input_file.size = 15;

    form.appendChild(input_file);

	var size_div = document.createElement("div");
    var info3 = document.createElement("span");
    info3.innerHTML = '가로 : ';

    var info4 = document.createElement("span");
    info4.innerHTML = '세로 : ';
    info4.style.marginLeft = '10px';

	var info5 = document.createElement("span");
    info5.innerHTML = '&nbsp;&nbsp;pixel';

	var info6 = document.createElement("span");
    info6.innerHTML = '&nbsp;&nbsp;pixel';

    var width = document.createElement("input");
    width.size = 5;
    width.id = 'geditor_' + ge_name + '_insert_movie_width';

    var height = document.createElement("input");
    height.size = 5;
    height.id = 'geditor_' + ge_name + '_insert_movie_height';

    size_div.appendChild(info3);
    size_div.appendChild(width);
	size_div.appendChild(info5);
    size_div.appendChild(info4);
    size_div.appendChild(height);
	size_div.appendChild(info6);

	form.appendChild(size_div);
	src_div.appendChild(form);

	var info_div = document.createElement("div");
    var info7 = document.createElement("span");
    info7.innerHTML = '<font color="#D90000">권장사이즈는 가로 700 * 세로 600 입니다.</font>';

	info_div.appendChild(info7);
	src_div.appendChild(info_div);

    var button = document.createElement("div");
    button.style.paddingTop = '10px';
    button.style.paddingBottom = '5px';
    button.style.textAlign = 'center';

    var submit = this.button('확인');
    submit.onclick  = function()
    {
		if(width.value == '0' || width.value == ''){
			alert('가로를 입력 해 주세요.');
			return;
		}

		if(height.value == '0' || height.value == ''){
			alert('세로를 입력 해 주세요.');
			return;
		}

		if(input_file.value == ''){
			alert('파일을 선택 해 주세요.');
			return;
		}

		if((input_file.value).substring((input_file.value).lastIndexOf('.') + 1) != 'asf' && 
			(input_file.value).substring((input_file.value).lastIndexOf('.') + 1) != 'wmv'){
			alert('동영상 파일은 asf 또는 wmv 파일만 지원 가능합니다.');
			return;
		}

		hObj1.value = width.value;
		hObj2.value = height.value;
        if(confirm("위지윅 에디터에서는 정상적으로 보이지 않을 수 있습니다.\n미디어 삽입시 HTML source 모드 혹은 TEXT 모드로 꼭 확인해주세요.\n미디어의 용량 및 전송 속도에 따라 시간이 오래 걸릴 수 있습니다.")){
	        form.submit();
		}
    }
    var close = this.button('닫기');
    close.onclick  = function() { self.clear_option(); }

    button.appendChild(submit);
    button.appendChild(close);

    info.appendChild(src_div);
    info.appendChild(button);

    div.appendChild(info);

    document.body.appendChild(div);
}

this.insert_movie_to_editor = function(src , width , height) {
    var html = "<embed src=\""+src+"\" autostart=\"true\" loop=\"false\" width=\""+width+"\" height=\""+height+"\"></embed>";
	alert("위지윅 에디터에서는 정상적으로 보이지 않을 수 있습니다.미디어 삽입시 HTML source 모드 혹은 TEXT 모드로 꼭 확인해주세요.");
    this.insert_editor(html);
}

this.insert_link = function(obj) {

    this.clear_option();
    this.get_range();

    var self = this;

    var div = this.get_option_div(obj, 100);
    div.id = "geditor_option_div";

    var info = document.createElement("div");
    info.style.fontSize = 12;
    info.innerHTML = '<b>링크 넣기</b>';

    var select = document.createElement("select");

    var option = document.createElement("option");
    option.value = '_blank';
    option.innerHTML = '새창';
    select.appendChild(option);

    var option = document.createElement("option");
    option.value = '_self';
    option.innerHTML = '현재창';
    select.appendChild(option);

    var protocol = document.createElement("select");

    var protocol_list = ['http://', 'ftp://', 'mailto:']
    for (i=0; i<protocol_list.length; i++) {
        var option = document.createElement("option");
        option.value = protocol_list[i];
        option.innerHTML = protocol_list[i];
        protocol.appendChild(option);
    }

    var input = document.createElement("input");
    input.size = 20;
    input.type = _TEXT;

    var submit = this.button('확인');
    submit.onclick = function() {
        self.insert_editor("<a href=\"" + protocol.value + input.value + "\" target=\"" + select.value + "\">", "</a>");
    }

    var close = this.button('닫기');
    close.onclick  = function() { self.clear_option(); }

    div.appendChild(info);
    div.appendChild(select);
    div.appendChild(protocol);
    div.appendChild(input);
    div.appendChild(submit);
    div.appendChild(close);
    document.body.appendChild(div);
}

this.insert_table = function(obj) {

    this.clear_option();
    this.get_range();

    var self = this;
    var div = this.get_option_div(obj, 50);
    div.id = "geditor_option_div";

    var info = document.createElement("div");
    info.style.fontSize = 12;
    info.innerHTML = "<b>테이블</b> <a href=\"javascript:"+ge_name+".clear_option();\" style=\"color:#ccc;\">[닫기]</a>";

    var table = document.createElement("table");
    table.border = 0;
    table.cellSpacing = 2;
    table.id = 'geditor_insert_table_table';
    table.unselectable = "on";
    table.style.cursor = 'pointer';

    var tbody = document.createElement("tbody");
    tbody.id = 'geditor_insert_table_tbody';

    for (var i=0; i<ge_table_rows; i++){
        var tr = document.createElement("tr");
        tr.height = 10;
        tr.id = "tr"+i;
        for (var j=0; j<ge_table_cols; j++) {
            var td = document.createElement("td");
            td.style.width = '20px';
            td.style.height = '20px';
            td.style.border = '1px solid #ccc';
            td.style.fontSize = '10px';
            td.onmouseover = new Function(ge_name+".insert_table_mouse_over("+(i+1)+","+(j+1)+")");
            td.id = "td"+i+""+j;

            var img = document.createElement("img");
            img.src = ge_empty_path;
            img.style.width = '20px';
            img.style.height = '20px';
            img.onclick = new Function(ge_name+".insert_table_mouse_click("+(i+1)+","+(j+1)+")");
            td.appendChild(img);

            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);

    div.appendChild(info);
    div.appendChild(table);
    document.body.appendChild(div);
}

this.insert_table_mouse_click = function(row,col) 
{
    var table = "<table width=\"100%\" cellspacing=\"0\" cellpadding=\"2\" border=\"1\">";
    var width = Math.floor(100/col);
    for (var i=0; i<row; i++) {
        table += "<tr>";
        for (var j=0; j<col; j++) {
            table += "<td width=\""+width+"%\">&nbsp;</td>";
        }
        table += "</tr>";
    }
    table += "</table><br/>";

    this.insert_editor(table);
}

this.insert_table_mouse_over = function(row,col) 
{
    var table = document.getElementById("geditor_insert_table_table");
    var rows = table.firstChild.childNodes;
    for (var a=0; a<rows.length; a++) {
        for (var b=0; b<rows[a].childNodes.length; b++) {
            rows[a].childNodes[b].bgColor = a < row && b < col ? '#EFEFEF' : '#FFFFFF';
        }
    }
    if (row == rows.length) {
        var tr = document.createElement("tr");
        tr.style.height = '10px';
        tr.id = "tr"+row;
        for (var j=0; j<rows[0].childNodes.length; j++) {
            var td = document.createElement("td");
            td.style.width = '20px';
            td.style.height = '20px';
            td.style.border = '1px solid #ccc';
            td.style.fontSize = '10px';
            td.onmouseover = new Function(ge_name+".insert_table_mouse_over("+(row+1)+","+(j+1)+")");
            td.id = "td"+row+j;

            var img = document.createElement("img");
            img.src = ge_empty_path;
            img.style.width = '20px';
            img.style.height = '20px';
            img.onclick = new Function(ge_name+".insert_table_mouse_click("+(row+1)+","+(j+1)+")");
            td.appendChild(img);

            tr.appendChild(td);
        }
        document.getElementById("geditor_insert_table_tbody").appendChild(tr);
    }
    else if (row >= ge_table_rows-1) {
        for (var i=rows.length-1; i>row; i--) {
            document.getElementById("geditor_insert_table_tbody").removeChild(document.getElementById("tr"+i));
        }
    }

    if (col == rows[0].childNodes.length) 
    {
        for (var i=0; i<rows.length; i++) {
            var td = document.createElement("td");
            td.style.width = '20px';
            td.style.height = '20px';
            td.style.border = '1px solid #ccc';
            td.style.fontSize = '10px';
            td.onmouseover = new Function(ge_name+".insert_table_mouse_over("+(i+1)+","+(col+1)+")");
            td.id = "td"+i+col;

            var img = document.createElement("img");
            img.src = ge_empty_path;
            img.style.width = '20px';
            img.style.height = '20px';
            img.onclick = new Function(ge_name+".insert_table_mouse_click("+(i+1)+","+(col+1)+")");
            td.appendChild(img);

            rows[i].appendChild(td);
        }
    } 
    else if (col >= ge_table_cols-1 && this.table_x > col) 
    {
        for (var i=0; i<rows.length; i++) {
            id = "td"+i+""+(rows[i].childNodes.length-1);
            id = document.getElementById(id);
            document.getElementById("tr"+i).removeChild(id);
        }
    }
    this.table_x = col;
    this.table_y = row;
}

this.insert_color = function(obj, flag) {

    this.clear_option();
    this.get_range();

    var self = this;
    var div = this.get_option_div(obj);
    div.id = "geditor_option_div";

    var info = document.createElement("div");
    info.style.fontSize = 12;
    if (flag=='fore')
        info.innerHTML = "<b>글자색</b> <a href=\"javascript:"+ge_name+".clear_option();\" style=\"color:#ccc;\">[닫기]</a>";
    else
        info.innerHTML = "<b>배경색</b> <a href=\"javascript:"+ge_name+".clear_option();\" style=\"color:#ccc;\">[닫기]</a>";

    var table = document.createElement("table");
    table.border = 0;
    table.cellSpacing = 2;
    table.unselectable = "on";
    table.style.cursor = 'pointer';

    var tbody = document.createElement("tbody");

    fi = 0;
    for (var i=0; i<7; i++) {
        var tr = document.createElement("tr");
        tr.height = 10;
        tr.id = "tr"+i;
        for (var j=0; j<10; j++) {
            var td = document.createElement("td");
            td.width = 10;
            td.style.border = '1px solid #ccc';
            td.style.fontSize = '10px';
            td.style.backgroundColor = ge_color[fi];
            td.innerHTML = '&nbsp;';
            td.unselectable = "on";
            td.onclick = new Function(ge_name+"."+flag+"color(\""+ge_color[fi]+"\")");
            td.id = "td"+i+""+j;
            tr.appendChild(td);
            fi++;
        }
        tbody.appendChild(tr);
    }

    table.appendChild(tbody)

    div.appendChild(info);
    div.appendChild(table);
    document.body.appendChild(div);
}

this.forecolor = function(color) {
    this.edit('forecolor',color);
    this.clear_option();
}

this.backcolor = function(color) {
    if (IS_IE)
        this.edit('BackColor',color);
    else
        this.edit('Hilitecolor',color);

    this.clear_option();
}

this.insert_editor = function(begin, end) {

    switch(ge_mode) {

        case _WYSIWYG:
            if (typeof end == 'undefined') end = '';

            if (IS_IE)
                ge_range.pasteHTML(begin + ge_range.htmlText + end);
            else 
            {
                var editor = document.getElementById(ge_iframe);
                var range  = editor.contentWindow.getSelection();

                if (range.focusNode.tagName == 'HTML') {

                    var range = editor.contentDocument.createRange();
                    range.setStart(editor.contentDocument.body,0);
                    range.setEnd(editor.contentDocument.body,0);

                    var tmp = document.createElement("div");
                    tmp.appendChild(range.extractContents());

                    range.insertNode(range.createContextualFragment(begin + tmp.innerHTML + end));

                } else {
                    var range = range.getRangeAt(0);
                    var tmp = document.createElement("div");

                    tmp.appendChild(range.extractContents());

                    range.insertNode(range.createContextualFragment(begin + tmp.innerHTML + end));
                }
            }
            this.update();

            break;

        case _TEXT:
            document.getElementById(ge_textarea).value += html;
            break;

        case _HTML:
            document.getElementById(ge_source).value += html;
            break;
    }
    this.clear_option();
}

this.get_option_div = function(obj, left) {

    if (IS_IE) height = -1; else height = 5;

    if (typeof left == 'undefined') left = 0;

    var div = document.createElement("div");
    div.style.border = "#CCCCCC 1px solid";
    div.style.padding = "10px";
    div.style.display = "block";
    div.style.position = "absolute";
    div.style.zIndex = 1;
    div.style.backgroundColor = "#FFFFFF";
    div.style.top = this.get_top(obj) + obj.offsetHeight + height;
    div.style.left = this.get_left(obj) - left;
    div.style.textAlign = "left";
    div.style.fontSize = '12px';
    div.unselectable = "on";
    return div;
}

this.html_preview = function() {
    switch(ge_mode) {
        case _WYSIWYG:
            ge_code = ge_editor.body.innerHTML;
            break;
        case _TEXT:
            this.text2html();
            break;
        case _HTML: 
            ge_code = document.getElementById(ge_name+"_source").value;
            break;
    }
    var pre = window.open('', 'pre', 'scrollbars=yes,width=600,height=500');
    pre.document.write(ge_code);
}

this.get_content = function() {

    switch(ge_mode) {

        case _WYSIWYG:
            return ge_editor.body.innerHTML; 
            break;

        case _TEXT:
            this.text2html();
            this.init();
            return ge_editor.body.innerHTML; 
            break;

        case _HTML: 
            ge_mode = _TEXT;
            return document.getElementById(ge_name+"_source").value;
            break;
    }
}

this.clear_option = function () {
    if (document.getElementById("geditor_option_div") != null)  {
        document.body.removeChild(document.getElementById("geditor_option_div"));
        this.get_tags();
    }

	if (document.getElementById("geditor_option_research_div") != null)  {
        document.body.removeChild(document.getElementById("geditor_option_research_div"));
        this.get_tags();
    }

    if (document.getElementById("geditor_option_image_div") != null) {
        if (ge_is_image == false) {
            if (document.getElementById('ge_is_empty') != null) {
                if (document.getElementById('ge_is_empty').value == 'false') {
                    document.getElementById("geditor_image_form_work").value = 'delete';
                    document.getElementById("geditor_image_form").submit();
                }
            }
        }
        document.body.removeChild(document.getElementById("geditor_option_image_div"));
        ge_is_image = false;
    }
}

this.get_ext = function(file) {
    var ext = '';
    ext = file.split(".");
    ext = ext[ext.length-1].toLowerCase();
    return ext;
}

this.get_image_size = function(path) {
    var size    = new Array();
    var image   = new Image();
    image.src   = path;
    size[0]     = image.width > 700?700:image.width;
    size[1]     = image.height;
    return size;
}

this.get_top = function(obj) {
    var top = obj.offsetTop;
    var parent = obj.offsetParent;
    while(parent) {
        top += parent.offsetTop;
        parent = parent.offsetParent;
    }
    return top;
}

this.get_left = function(obj) {
    var left = obj.offsetLeft;
    var parent = obj.offsetParent;
    while(parent) {
        left += parent.offsetLeft;
        parent = parent.offsetParent;
    }
    return left;
}


this.height_decrease = function(row)
{
    o = parseInt(document.getElementById(ge_iframe).offsetHeight);
    h = o - row;

    if (h > 0) {
        document.getElementById("geditor_"+ge_name).style.height = h + 5 + 'px';
        document.getElementById(ge_iframe).style.height = h + 'px';
        document.getElementById(ge_textarea).style.height = h + 'px';
        document.getElementById(ge_source).style.height = h + 'px';
    }
}

this.height_original = function()
{
    document.getElementById("geditor_"+ge_name).style.height = parseInt(ge_height) + 5 + 'px';
    document.getElementById(ge_iframe).style.height = ge_height;
    document.getElementById(ge_textarea).style.height = ge_height;
    document.getElementById(ge_source).style.height = ge_height;
}

this.height_increase = function(row)
{
    h = parseInt(document.getElementById(ge_iframe).offsetHeight) + row;
    document.getElementById("geditor_"+ge_name).style.height = h + 5 + 'px';
    document.getElementById(ge_iframe).style.height = h + 'px';
    document.getElementById(ge_textarea).style.height = h + 'px';
    document.getElementById(ge_source).style.height = h + 'px';
}


} // end class geditor


var geditor_textareas = document.getElementsByTagName("textarea");

for (i=0; i<geditor_textareas.length; i++)
{
    geditor_run = geditor_textareas[i];


    if (geditor_run.getAttribute("geditor") != null && geditor_run.style.display.toLowerCase() != 'none' && geditor_run.style.visibility.toLowerCase() != 'hidden' && !geditor_run.readOnly && !geditor_run.disabled)
    {
        if (!geditor_run.id)
                geditor_run.id = geditor_run.name;

        gtag = geditor_run.getAttribute("gtag");
        gmode = geditor_run.getAttribute("gmode");
        gimg = geditor_run.getAttribute("gimg");
		gmovie = geditor_run.getAttribute("gmovie");

        eval("var geditor_" + geditor_run.id + " = new geditor('" + geditor_run.id + "');");

        if (gtag == 'off')
            eval("geditor_" + geditor_run.id + ".notag();");

        if (gmode == 'off')
            eval("geditor_" + geditor_run.id + ".nomode();");

        if (gimg == 'off')
            eval("geditor_" + geditor_run.id + ".noimg();");

		if (gmovie == 'off')
			eval("geditor_" + geditor_run.id + ".nomovie();");

        eval("geditor_" + geditor_run.id + ".run();");
    }
}