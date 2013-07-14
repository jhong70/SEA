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
  var rendered = false;

Template.page.rendered = function(){




  //MAP AND USER LOCATION INITIALIZATION
  if(!rendered) {
      rendered = true;
      map = L.mapbox.map('map', 'examples.map-vyofok3q', { zoomControl: false }).setView([40, -74.50], 9);
      console.log('Template onLoad');

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
        userLocFound = 1;
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

      });
      //END MAP AND USER LOCATION INITIALIZATION


      $('#list-button').click(function(){
        function displayNone(){
          $('#map').css("display","none");
        }
        setTimeout(displayNone,500);        
      });

      $('#list-closebtn').click(function(){
        $('#map').css("display","block");
      });


      //SEARCH FUNCTION

      //---Upon pressing enter while search bar is focused, do a search and move the map accordingly
      $('#searchInput').keypress(function(e) {
        if(event.keyCode == 13){
          e.preventDefault();
          if($('#searchInput').val().length>0){
            $('#searchInput').blur();
            
            
          }
        }
      });
      //END SEARCH
      
      //PANEL HEIGHT ADJUSTMENTS
      $('.panel-result').height($(window).height()-$('#header').outerHeight()-$('#event-closebtn').outerHeight()-20);
      $('#nav-panel').height($(window).height());
      $('#nav-panel-contents').height($(window).height()-22);
      
      
      //JQM AND LEAFLET (MAP) DO NOT PLAY WELL. MAKE HEIGHT ADJUSTMENTS
      if ( map ){
        if($('#map').is(':visible') ) { //just security
            $('#map').height( $(window).height()-$('#header').outerHeight()-$('#footer').outerHeight() ); 
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
  }
  
  
};

Template.nav_user_info.events({
  "click #login_github": function (e,tmpl) {
    Meteor.loginWithGithub({
      requestPermissions: ['user','public_repo']
    }, function(err){
      if (err){}
    });
  }
});

Template.nav_user_info.events({
  "click #logout": function(e,tmpl){
    Meteor.logout(function(err){
      if(err){

      }else {
        //show logged out
      }
    });
  }
});
