jQuery(document).ready(function() {
	'use strict';
	//Google Map					
	jQuery('.map-wrapper[id^="delicious_map_"]').each( function() { 

		var $div = jQuery(this);
		var token = $div.data('token');
		var settingObj = window['dt_map_' + token];
		var id = settingObj.id;
		var zoomv = parseInt(settingObj.zoom);

		jQuery("#delicious_map_"+settingObj.id+"").each(function() {
			
			var latlng = new google.maps.LatLng(settingObj.latitude,settingObj.longitude);
			var settings = {
				zoom: zoomv,
				center: new google.maps.LatLng(settingObj.latitude,settingObj.longitude), 
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: false,
				scrollwheel: false,
				draggable: true,
				navigationControl: false,
                styles: [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}]

				};


				
			var map = new google.maps.Map(document.getElementById("google_map_"+settingObj.id+""), settings);
			google.maps.event.addDomListener(window, "resize", function() {
				var center = map.getCenter();
				google.maps.event.trigger(map, "resize");
				map.setCenter(center);
			});
			
			var contentString = '<div class="map-tooltip">'+
				'<h6>'+settingObj.pin_title+'</h6>'+
				'<p>'+settingObj.pin_desc+'</p>'+
				'</div>';
			var infowindow = new google.maps.InfoWindow({
				content: contentString
			});

			var pin = {
				path: 'M75.411,26.226c-0.267-0.588-0.55-1.164-0.859-1.739c-0.104-0.193-0.215-0.381-0.318-0.576    c-0.544-0.951-1.146-1.896-1.817-2.827c-0.085-0.117-0.17-0.233-0.253-0.349c-1.565-2.071-3.409-3.921-5.473-5.492    C61.923,11.601,55.965,9.44,49.503,9.44c-6.443,0-12.382,2.147-17.143,5.763c-1.973,1.501-3.745,3.248-5.272,5.201    c-0.213,0.285-0.427,0.569-0.634,0.854c-0.369,0.518-0.711,1.029-1.035,1.553c-0.11,0.174-0.22,0.356-0.324,0.53    c-0.311,0.511-0.595,1.028-0.86,1.552c-0.104,0.201-0.208,0.408-0.304,0.616c-0.109,0.231-0.22,0.465-0.329,0.705    c-0.117,0.251-0.227,0.51-0.337,0.769c-0.09,0.207-0.174,0.415-0.252,0.628c-0.013,0.033-0.026,0.064-0.039,0.097    c-10.861,27.85,25.333,63.02,26.51,64.152c0.007,0.013,0.013,0.013,0.02,0.019c0.007-0.006,0.007-0.012,0.013-0.019    C50.72,90.702,88.187,54.289,75.411,26.226z M49.49,44.373c-4.341,0-7.854-3.52-7.854-7.854c0-4.341,3.513-7.854,7.854-7.854    c4.334,0,7.854,3.513,7.854,7.854C57.344,40.853,53.824,44.373,49.49,44.373z',
				fillColor: ''+settingObj.pin_color+'',
				fillOpacity: 1,
				scale: 0.8,
				strokeColor: ''+settingObj.pin_color+'',
				strokeWeight: 1,
				anchor: new google.maps.Point(60, 75)
			};			
			
			var companyPos = new google.maps.LatLng(settingObj.latitude,settingObj.longitude);
			
			var companyMarker = new google.maps.Marker({
				position: companyPos,
				map: map,
				icon: pin, 
				zIndex: 3});	
			
			google.maps.event.addListener(companyMarker, 'click', function() {
				infowindow.open(map,companyMarker);
			});

	    });

	});
});		