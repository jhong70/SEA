//USE MAPQUEST GEOCODER IF LOCATION NOT ALLOWED OR FOUND
	$('#user-loc-input').keypress(function(e){
		if(event.keyCode==13){
			e.preventDefault();
			if($('#user-loc-input').val().length>0){
				userLocLayer.clearLayers();
				var url = "http://www.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluub2g6zlu%2C7l%3Do5-9ua556&location="+$('#user-loc-input').val();
				$.ajax({
					url: url,
					//dataType: 'json',
					type: 'GET',
					contentType:'json',
					//data: {location: { "postalCode": "30332"}},
					success: function(data) { 
						var lat = data.results[0].locations[0].latLng.lat;
						var lng = data.results[0].locations[0].latLng.lng;
						map.setView([lat,lng],15);
						userLatLng = lat+","+lng;
						var userIcon = L.icon({
							iconUrl: 'http://www.prism.gatech.edu/~jhong70/sea/img/markers/user-marker.png',
							iconAnchor: [12,41]
						});
						//---Create and bind popup
						var popupContent = "Here you are!";
						L.marker([lat, lng], {icon: userIcon}).bindPopup(popupContent,{offset: new L.Point(0,-15)}).addTo(map);
						window.location.hash = '#';
					},
					error: function(data) { console.log( 'error occurred'); }
				});
			}
		}
	});