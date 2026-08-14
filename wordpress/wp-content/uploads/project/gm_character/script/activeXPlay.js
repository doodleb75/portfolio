document.attachEvent( "onreadystatechange", function()
{
	if( document.readyState=="complete" )
	{
		if( window.objectPatch )	window.objectPatch();
	}
})


function objectPatch()
{
	var os = document.getElementsByTagName("object");
	for( var idx = 0; idx < os.length; idx++ )
	{
		var peer  = os[idx];
		var clsid = peer.getAttribute("classid");

		if( !clsid )  continue;

		switch( clsid.toLowerCase() )
		{
			case "clsid:bb4533a0-85e0-4657-9bf2-e8e7b100d47e" :  // Combo Box
			case "clsid:71e7aca0-ef63-4055-9894-229b056e9c31" :  // Grid
			case "clsid:6bf52a52-394a-11d3-b153-00c04f79faa6" :  // Media Player
		 // case "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" :  // Flash
						var html = peer.outerHTML;
						peer.outerHTML = html;
						break;
			default:
						break;
		}
	}
}


function objectWrite( strTag )
{
	document.write( strTag );
}
function nextEnabled(){
top.bottomFrame.next_Enabled=null;

}