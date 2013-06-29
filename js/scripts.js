//JavaScript Document

$(document).ready(function() {
	var event_boiler_plate;
	$.get('js/event_plate.txt', function(data){
		event_boiler_plate = data;
	});
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
		//Add a marker on users' location
		var userIcon = L.icon({
			iconUrl: 'http://www.prism.gatech.edu/~jhong70/sea/img/markers/user-marker.png',
			iconAnchor: [12,41]
		});
		//Create and bind popup
		var popupContent = "Here you are!";
		L.marker([e.latlng.lat, e.latlng.lng], {icon: userIcon}).bindPopup(popupContent,{offset: new L.Point(0,-15)}).addTo(map).openPopup();
	});
	
	map.on('locationerror', function(e) {
		console.log(e);
		alert('Could not track your location');
	});
	
	//Upon pressing enter while search bar is focused, do a search and move the map accordingly
	$('#searchInput').keypress(function(e) {
		if(event.keyCode == 13){
			e.preventDefault();
			if($('#searchInput').val().length>0){
				$('#searchInput').blur();
				$( "#panel" ).panel( "close" );
				map.setZoom(12);
				eventsLayer.clearLayers();
				var oArgs = { app_key: "sj98RZjS2GJJGhhH", keywords: $('#searchInput').val(), page_size: 200, location:latlng, within:5}; 
				EVDB.API.call("/events/search", oArgs, function(oData) {
					
					console.log(oData.total_items);
					if(oData.total_items<200)
					for (i=0;i<((oData.total_items<200) ? oData.total_items : 200);i++){
						try{
							var evIcon = L.icon({
								iconUrl: 'http://www.prism.gatech.edu/~jhong70/sea/img/markers/event-marker.png',
								iconAnchor: [12,41]
							});
							var venue_address = (oData.events.event[i].venue_address) ? oData.events.event[i].venue_address : 'Not Defined';
							var event_title = (oData.events.event[i].title) ? oData.events.event[i].title : 'Not Defined';
							var start_time = (oData.events.event[i].start_time) ? oData.events.event[i].start_time : 'Not Defined';
							var end_time = (oData.events.event[i].end_time) ? oData.events.event[i].end_time : 'Not Defined';
							var description = (oData.events.event[i].description) ? oData.events.event[i].description : 'No Description';
							var cal_count = (oData.events.event[i].calendar_count) ? oData.events.event[i].calendar_count : 0;
						
							var eventDesc = "<strong>"+event_title+"</strong></br>"+
											   "<strong>Address:</strong> "+venue_address+"</br>";
							var eventButton;
							
							//I have to pass in the current venue_address, event_title, etc. into a function so that the popups don't all share the same values for those variables and instead we get deep copies. Some OP stuff right here...
							(function(title,address,desc,s_time,e_time,c_count){
							eventButton = $("<button type='button' data-role='button'>Event Page</button>").click(function(e){
									$('#panel').panel('open');
									$('#panel-result').empty();
									$('#panel-result').append(event_boiler_plate);
									//$('#panel-result').append('<p><strong>Event</strong>: '+title+'</p><p><strong>Address</strong>: '+address+'</p><p><strong>Description</strong>: '+desc+'</p><p><strong>Starting time</strong>: '+s_time+'</p><p><strong>Ending time:</strong>: '+e_time+'</p><p><strong>Calendar count</strong>: '+c_count+'</p><button data-role="button">Check in</button>');
									//Update the panel so that the event info can appear
									$('#event_title').html(title);
									$('#event_description').html(desc);
									$( "#panel" ).trigger( "updatelayout" );
									//Re-initialize the panel-result div so that jQuery mobile can apply its styling for the contents within
									$('#panel-result').trigger("create");
								})[0];
							
							var div = $('<div />').html(eventDesc).append(eventButton)[0];
							L.marker([oData.events.event[i].latitude, oData.events.event[i].longitude], {icon: evIcon}).bindPopup(div,{offset: new L.Point(0,-15)}).addTo(eventsLayer);
							
							})(event_title,venue_address,description,start_time,end_time,cal_count);
							
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
		}
	});
	
	//This is Paul trying to get the List View to work
	$("#listView").click(function(){
		//var anything = 'Displaying Something';
		//will need to use the .each(function(){}) loop at some point
		alert("Handler for .click() called");
	});
	
	$('#panel-close-button').click(function(e) {
		$( "#panel" ).panel("close");
	});
	
	$('#panel-result').height($(window).height()-$('#header').outerHeight()-$('#panel-close-button').outerHeight()-20);
	$('#nav-panel').height($(window).height());
	$('#nav-panel-contents').height($(window).height()-20);
	
	
	//jQM and Leaflet do not play well... This resizes the map to display correctly 
	if ( map ) // if started
    {
    	if($('#map').is(':visible') ) { //just security
        	$('#map').height( $(window).height()-$('#header').outerHeight()-$('#footer').outerHeight() - $('#top-nav').outerHeight() ); 
        	$('#map').width( $(window).width() ); // as well as height
        	map.invalidateSize(); // here it comes
    	}
    }
	
	//We have to readjust the size when the user resizes the window.
	$(window).resize(function() {
		$('#nav-panel-contents').height($(window).height()-20);
		$('#nav-panel').height($(window).height());
        $('#map').height( $(window).height()-$('#header').outerHeight()-$('#footer').outerHeight() - $('#top-nav').outerHeight());
        $('#map').width( $(window).width() ); 
		$('#panel-result').height($(window).height()-$('#header').outerHeight()-$('#panel-close-button').outerHeight()-20);
    });
		
});

