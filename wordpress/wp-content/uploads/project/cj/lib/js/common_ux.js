/**********************************************************************************
 *   Description : UX 정의  ( oBbs ver 1.0 ) 
 *   Author      : credit@mediaset.co.kr
 *   Date        : 2011/09/05
 *   Update      : 
 *   Copyright (C) MEDIASET corporation.  
 **********************************************************************************/

var oBbs = function(opt){ if(opt){this.init(opt);} }
//사용안함 jqGird 대체
oBbs.prototype = {
	aOpt:null,
	initHead:function()
	{
		var $TBL = $("#"+this.aOpt.tableId);
		var OPT  = this.aOpt;
		if($TBL.length > 0)
		{
			var html = "<table><thead><tr>"; 
			var cnt = OPT.colName.length;
			for(var i=0;i<OPT.colName.length;i++)
			{
				var colName = OPT.colName[i];
				html += "<th align=\"center\">"+colName+"</th>";
			}
			 
			html += "</tr></thead>";
			$TBL.html(html);
			this.initContents();
		}
		else
		{
			alert("TABLE이 생성전이거나 테이블 ID가 잘못되었습니다.");
		}
		/* 
		$TBL.html("<table><thead>");
			
				<tr>
					<th>생활정보코드</th>
					<th>생활정보명</th>
					<th>순서</th>
					<th>수집타입</th>
					<th>수집시간(초)</th>
					<th>파일사용유무</th>
					<th>파일확장자명 체크</th>
					<th>금칙어 체크유무</th>
				</tr>

		$TBL = 
			</thead>
			<tbody>
			<div id="bbs_contents"> 
				<td colspan="8" style="text-align:center;" valign="middle">등록된 생활정보 메뉴가 없습니다.</td> 
			</div> 
			</tbody>
		</table>
		*/
	},
	initContents:function()
	{
		var THIS = this;
		var $TBL = $("#"+this.aOpt.tableId).find("table");
		$.ajax({
			url : this.aOpt.url,
			type : "POST",
			data: this.aOpt.data,
			dataType:"json",
			success:function(data)
			{ 
				var html = "<tbody>";
				var colModel = THIS.aOpt.colModel;
				if(data.length > 0)
				{
					for(var i=0;i<data.length;i++)
					{
						var cell = data[i].cell; 
						html += "<tr class=\"odd\">";
						for(var a=0;a<colModel.length;a++)
						{
							var text  = cell[colModel[a]["name"]];
							var align = ( colModel[a]["align"] == undefined)?"center":colModel[a]["align"];
							var content = ( colModel[a]["filter"] == undefined)?text:colModel[a]["filter"][text];
							
							html += "<td align=\""+align+"\">"+content+"</td>";
						}
						html += "</tr>";
					}
				}
				else
				{
					html += "<tr><td colspan='"+THIS.aOpt.colName.length+"'>"+THIS.aOpt.emptymsg+"</td></tr>";
				}
				 
				html += "</tbody>";
				$TBL.append(html);
			}
		});
	},
	initBottom:function()
	{
		
	},
	initPager:function()
	{
		
	},
	tableReload:function()
	{
		this.initHead();
	},
	init:function(opt)
	{
		if(typeof opt != "object")
		{
			alert("옵션 설정이 잘못되었습니다.");
			return;
		}
		if(opt.colModel.length != opt.colName.length)
		{
			alert("colModel["+opt.colModel.length +"] 과 colName["+opt.colName.length+"]이 길이가틀립니다.");
			return;
		}
		if(opt.colModel.length == 0)
		{
			alert("colModel 옵션이 등록되지않았습니다.");
			return;
		}
		if(opt.colName.length == 0)
		{
			alert("colName 옵션이 등록되지않았습니다.");
			return;
		}
		if(opt.url == "")
		{
			alert("url 옵션이 등록되지않았습니다.");
			return;
		}
		this.aOpt = opt;
		this.initHead();
	}
}


