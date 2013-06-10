// JavaScript Document

$(document).ready(function() {
	
		//Initialize map and geocoder 
     	map = L.mapbox.map('map', 'examples.map-vyofok3q', { zoomControl: false }).setView([40, -74.50], 9);
		userLocLayer = L.geoJson().addTo(map);
		eventsLayer = L.geoJson().addTo(map);
		geocoder = L.mapbox.geocoder('examples.map-vyofok3q');
		new L.Control.Zoom({ position: 'topright' }).addTo(map);
		
		//Ask for users' location
		if (!navigator.geolocation) {
    		alert('geolocation is not available');
		} else {
        	map.locate({setView:true});
		}
		//On location found move and focus the map on users' location
		latlng = "";
		map.on('locationfound', function(e) {
    		map.fitBounds(e.bounds).setZoom(15);
			latlng = e.latlng.lat+","+e.latlng.lng;
			console.log("User Location: "+latlng);
			//Add a marker on users' location
			var userIcon = L.icon({
				iconUrl: 'http://www.prism.gatech.edu/~jhong70/sea/img/markers/user-marker.png',
				iconAnchor: [12,41]
			});
			L.marker([e.latlng.lat, e.latlng.lng], {icon: userIcon}).addTo(map);
		});
		
		map.on('locationerror', function(e) {
			console.log(e);
		});

		//Upon pressing enter while search bar is focused, do a search and move the map accordingly
		$('#searchInput').keypress(function(e) {
			if(event.keyCode == 13){
				$('#searchInput').blur();
				map.setZoom(12);
				e.preventDefault();
				eventsLayer .clearLayers();
				var oArgs = { app_key: "sj98RZjS2GJJGhhH", keywords: $('#searchInput').val(), page_size: 200, location:latlng, within:5}; 
				EVDB.API.call("/events/search", oArgs, function(oData) {
					console.log(oData.total_items);
					if(oData.total_items<200)
					for (i=0;i<((oData.total_items<200) ? oData.total_items : 200);i++){
						try{
							var evIcon = L.icon({
								iconUrl: 'http://www.prism.gatech.edu/~jhong70/sea/img/markers/user-marker.png',
								iconAnchor: [12,41]
							});
							L.marker([oData.events.event[i].latitude, oData.events.event[i].longitude], {icon: evIcon}).addTo(eventsLayer);
						}catch(e){
							/*Despite the event count returned from the Eventful API, some events are undefined. 
							I thought they might have venue address information so I implemented MapQuest's geocoder 
							to return coordinates given an address. MapBox's geocoder currently doesn't do street level.
							var url = "http://www.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluub2g6zlu%2C7l%3Do5-9ua556&location="+oData.events.event[i].venue_address;
							$.ajax({
    							url: url,
    							//dataType: 'json',
    							type: 'GET',
    							contentType:'json',
    							//data: {location: { "postalCode": "30332"}},
    							success: function(data) { 
									eventsLayer.addData({
        								type: "Feature",
        								geometry: {
            								type: "Point",
            								coordinates: [data.results[0].locations[0].latLng.lng, data.results[0].locations[0].latLng.lat]
        								}
    								});
								},
    							error: function(data) { console.log( 'error occurred'); }
							});*/
							
						}
					}
				});
			}
        });
});

