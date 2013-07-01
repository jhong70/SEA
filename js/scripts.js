//JavaScript Document

//global variables
var event_boiler_plate;
var list_element_plate;
var map;
var userLocLayer;
var eventsLayer;
var geocoder;
var userLatLng;
var sponsored_results = [];
var user_results = [];

$(document).ready(function() {

	//MAP AND USER LOCATION INITIALIZATION
	map = L.mapbox.map('map', 'examples.map-vyofok3q', { zoomControl: false }).setView([40, -74.50], 9);
	userLocLayer = L.geoJson().addTo(map);
	eventsLayer = L.geoJson().addTo(map);
	geocoder = L.mapbox.geocoder('examples.map-vyofok3q');
	new L.Control.Zoom({ position: 'topright' }).addTo(map);

	//---Ask for users' location
	if (!navigator.geolocation) {
		alert('geolocation is not available');
	} else {
		map.locate({setView:true});
		$.mobile.showPageLoadingMsg("a","Finding your location...");
	}
	//---On location found move and focus the map on users' location
	userLatLng = "";
	map.on('locationfound', function(e) {
		$.mobile.hidePageLoadingMsg();
		map.fitBounds(e.bounds).setZoom(15);
		userLatLng = e.latlng.lat+","+e.latlng.lng;
		//Add a marker on users' location
		var userIcon = L.icon({
			iconUrl: 'http://www.prism.gatech.edu/~jhong70/sea/img/markers/user-marker.png',
			iconAnchor: [12,41]
		});
		//---Create and bind popup
		var popupContent = "Here you are!";
		L.marker([e.latlng.lat, e.latlng.lng], {icon: userIcon}).bindPopup(popupContent,{offset: new L.Point(0,-15)}).addTo(map).openPopup();
	});
	//---On location error, alert the user
	map.on('locationerror', function(e) {
		console.log(e);
		$.mobile.hidePageLoadingMsg();
		$("#loc-error-link").click();
	});
	//END MAP AND USER LOCATION INITIALIZATION

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


	//SEARCH FUNCTION
	//---We load the quick event html for sponsored events
	$.get('js/sponsor_event.txt', function(data){
		event_boiler_plate = data;
	});
	$.get('js/list_element.txt', function(data){
		list_element_plate = data;
	});
	//---Upon pressing enter while search bar is focused, do a search and move the map accordingly
	$('#searchInput').keypress(function(e) {
		if(event.keyCode == 13){
			e.preventDefault();
			if($('#searchInput').val().length>0){
				$('#searchInput').blur();
				$('#event-panel').panel( "close" );
				map.setZoom(12);
				//Clear any event markers from previous searches
				eventsLayer.clearLayers();
				$('#list-result').empty();
				//---Eventful query parameters
				var oArgs = { app_key: "sj98RZjS2GJJGhhH", keywords: $('#searchInput').val(), page_size: 200, location:userLatLng, within:5}; 
				//---Make an Eventful API call and process the data in the callback function
				if($('#sponsor-choice').is(":checked"))
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
							var event_lat = oData.events.event[i].latitude;
							var event_long = oData.events.event[i].longitude;
							var popupDesc = "<strong>"+event_title+"</strong></br>"+
											   "<strong>Address:</strong> "+venue_address+"</br>";
							var eventButton;
							
							//---I have to pass in the current venue_address, event_title, etc. into a function so that the popups don't all share the same values for those variables and instead we get deep copies. Some OP stuff right here...
							(function(eventData){
								eventButton = $("<button type='button' data-role='button'>Event Page</button>").click(function(e){
									displayEvent(event_boiler_plate,eventData,'#event-panel','#event-result');
								})[0];
							})(oData.events.event[i]);
							
							var div = $('<div />').html(popupDesc).append(eventButton)[0];
							L.marker([event_lat, event_long], {icon: evIcon}).bindPopup(div,{offset: new L.Point(0,-15)}).addTo(eventsLayer);

							sponsored_results.push(oData.events.event[i]);
							addListEvent(list_element_plate,oData.events.event[i],'#list-panel','#list-result',i);
							
						}catch(e){
							console.log("Eventful oData item processing error.")
						}
					}
				});
			}
		}
	});
	//END SEARCH
	
	//QUICK EVENT CLOSE BUTTON FUNCTION
	$('#event-closebtn').click(function(e) {
		$('#event-panel').panel("close");
	});
	$('#list-closebtn').click(function(e) {
		$('#list-panel').panel("close");
	});
	
	//PANEL HEIGHT ADJUSTMENTS
	$('.panel-result').height($(window).height()-$('#header').outerHeight()-$('#event-closebtn').outerHeight()-20);
	$('#nav-panel').height($(window).height());
	$('#nav-panel-contents').height($(window).height()-20);
	
	
	//JQM AND LEAFLET (MAP) DO NOT PLAY WELL. MAKE HEIGHT ADJUSTMENTS
	if ( map ) //---if initialized
    {
    	if($('#map').is(':visible') ) { //just security
        	$('#map').height( $(window).height()-$('#header').outerHeight()-$('#footer').outerHeight() - $('#top-nav').outerHeight() ); 
        	$('#map').width( $(window).width() ); // as well as height
        	map.invalidateSize(); // here it comes
    	}
    }
	

	//BIND PANEL AND MAP RESIZE FUNCTIONS
	$(window).resize(function(){
		$('#nav-panel-contents').height($(window).height()-20);
		$('#nav-panel').height($(window).height());
        $('#map').height( $(window).height()-$('#header').outerHeight()-$('#footer').outerHeight() - $('#top-nav').outerHeight());
        $('#map').width( $(window).width() ); 
		$('.panel-result').height($(window).height()-$('#header').outerHeight()-$('#event-closebtn').outerHeight()-20);
    });
		
});


function displayEvent(html_plate,eventData,panel,panel_content){
	var venue_address = (eventData.venue_address) ? eventData.venue_address : 'Not Defined';
	var event_title = (eventData.title) ? eventData.title : 'Not Defined';
	var start_time = (eventData.start_time) ? eventData.start_time : 'Not Defined';
	var end_time = (eventData.end_time) ? eventData.end_time : 'Not Defined';
	var description = (eventData.description) ? eventData.description : 'No Description';
	var cal_count = (eventData.calendar_count) ? eventData.calendar_count : 0;
	var url = (eventData.url) ? eventData.url : 0;
	$(panel).panel('open');
	$(panel_content).empty();
	$(panel_content).append(html_plate);

	//---Update the panel so that the event info can appear
	$('#event_title').html(event_title);
	$('#event_description').html(description);

	$(panel).trigger( "updatelayout" );
	//---Re-initialize the panel-result div so that jQuery mobile can apply its styling for the contents within
	$(panel_content).trigger("create");

}

function addListEvent(html_plate,eventData,panel,panel_content,id){
	var venue_address = (eventData.venue_address) ? eventData.venue_address : 'Not Defined';
	var event_title = (eventData.title) ? eventData.title : 'Not Defined';
	var start_time = (eventData.start_time) ? eventData.start_time : 'Not Defined';
	var end_time = (eventData.end_time) ? eventData.end_time : 'Not Defined';
	var description = (eventData.description) ? eventData.description : 'No Description';
	var cal_count = (eventData.calendar_count) ? eventData.calendar_count : 0;
	var city_name = (eventData.city_name) ? eventData.city_name : 'Note Defined';
	var url = (eventData.url) ? eventData.url : 0;
	$(panel_content).append(html_plate);
	$('#event_card').attr("href",url);
	$('#event_card').attr('id',id);
	var currCard = '#'+id;

	//---Update the panel so that the event info can appear
	$(currCard).find('#list_title').html(event_title);
	$(currCard).find('#list_description').append(venue_address);
	$(currCard).find('#list_description').append(', '+city_name);
	$(currCard).find('#list_description').append('</br>Cal count: '+ cal_count);
	$(panel).trigger( "updatelayout" );
	//---Re-initialize the panel-result div so that jQuery mobile can apply its styling for the contents within
	$(panel_content).trigger("create");
	
}

