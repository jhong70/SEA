//global variables
var event_boiler_plate;
var list_element_plate;
var map;
var userLocLayer;
var eventsLayer;
var userLatLng;
var sponsored_results = [];
var user_results = [];
var rendered = false;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SUBSCRIBE TO OUR DATABASES//////////////////////////////////////////////////////////////////////////////////
Meteor.subscribe("directory");
Meteor.subscribe("parties");

Template.page.rendered = function(){
  
  if(!rendered) {
      rendered = true;
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //MAP AND USER LOCATION INITIALIZATION////////////////////////////////////////////////////////////////////////
      map = L.map('map');
      map._layersMaxZoom=15;
      var osmUrl='http://129.206.74.245:8001/tms_r.ashx?x={x}&y={y}&z={z}';
      var osmAttrib='';
      var osm = new L.TileLayer(osmUrl, {minZoom: 4, maxZoom: 18, attribution: osmAttrib}); 
      userLocLayer = L.geoJson().addTo(map);
      map.addLayer(osm);
      //eventsLayer = L.geoJson().addTo(map);
      
      userEventsLayer = (new L.markerClusterGroup({removeOutsideVisibleBounds:true})).addTo(map);
      sponsoredEventsLayer = (new L.markerClusterGroup({removeOutsideVisibleBounds:true})).addTo(map);

      //---Ask for users' location
      if (!navigator.geolocation) {
        alert('geolocation is not available');
      } else {
        map.locate({setView:true});
        $.mobile.showPageLoadingMsg("a","Finding your location...");
      }
      //---On location found move and focus the map on users' location
      map.on('locationfound', function(e) {
        $.mobile.hidePageLoadingMsg();
        map.fitBounds(e.bounds).setZoom(15);
        //Add a marker on users' location
        var userIcon = L.icon({
          iconUrl: 'user_marker.png',
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
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //END MAP AND USER LOCATION INITIALIZATION////////////////////////////////////////////////////////////////////



      //////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //UI FUNCTION BINDS///////////////////////////////////////////////////////////////////////////////////////////
      $('#list-button').click(function(){
        function displayNone(){
          $('#map').css("display","none");
        }
        setTimeout(displayNone,500);        
      });

      $('#list-closebtn').click(function(){
        $('#map').css("display","block");
      });




      //////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //CREATE NEW EVENT FROM POPUP/////////////////////////////////////////////////////////////////////////////////
      $('#create-event-btn').click(function(){
        var title = $('#create-event-title').val();
        var address = $('#create-event-address').val();
        var description = $('#create-event-desc').val();
        var tags = $('#create-event-tags').val();
        var lat = 0;
        var lng = 0;

        if(title.length == 0){
          alert("Please enter a title");
          return;
        }
        if(description.length == 0){
          alert("Please enter a brief description");
          return;
        }
        if(tags.length == 0){
          alert("Please enter at least 1 tag");
          return;
        }
        
        //---Process the address using the Mapquest API and insert event to our database
        var url = "http://www.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluub2g6zlu%2C7l%3Do5-9ua556&location="+address;
        $.ajax({
          url: url,
          //dataType: 'json',
          type: 'GET',
          contentType:'json',
          //data: {location: { "postalCode": "30332"}},
          success: function(data) { 
            lat = data.results[0].locations[0].latLng.lat;
            lng = data.results[0].locations[0].latLng.lng;
            Parties.insert({title:title, address:address, description:description, tags: tags, lat:lat, lng:lng});
          },
          error: function(data) { console.log( 'error occurred while requesting coordinates for event creation'); }
        });

      });

      $.get('quick_event.html', function(data){
        event_boiler_plate = data;
      });
      $.get('list_element.html', function(data){
        list_element_plate = data;
      });
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //SEARCH FUNCTION --NOT YET IMPLEMENTED///////////////////////////////////////////////////////////////////////

      //---Upon pressing enter while search bar is focused, do a search and move the map accordingly
      $('#searchInput').keypress(function(e) {
        if(event.keyCode == 13){
          e.preventDefault();
          if($('#searchInput').val().length>0){
            $('#searchInput').blur();
            $('#event-panel').panel( "close" );
            map.setZoom(10);
            //Clear any event markers from previous searches
            sponsoredEventsLayer.clearLayers();
            $('#list-result').empty();
            //---Eventful query parameters
            userLatLng = map.getCenter().lat+","+map.getCenter().lng;
            var oArgs = { app_key: "sj98RZjS2GJJGhhH", keywords: $('#searchInput').val(), page_size: 200, location:userLatLng, within:5}; 
            //---Make an Eventful API call and process the data in the callback function
            EVDB.API.call("/events/search", oArgs, function(oData) {          
              console.log(oData.total_items);
              if(oData.total_items<200)
              for (i=0;i<((oData.total_items<200) ? oData.total_items : 200);i++){
                try{
                  var evIcon = L.icon({
                    iconUrl: 'sponsored_event_marker.png',
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
                  L.marker([event_lat, event_long], {icon: evIcon}).bindPopup(div,{offset: new L.Point(0,-15)}).addTo(sponsoredEventsLayer);

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
      //////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //END SEARCH//////////////////////////////////////////////////////////////////////////////////////////////////
      


      //////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //DOM HEIGHT ADJUSTMENTS//////////////////////////////////////////////////////////////////////////////////////
      $('.panel-result').height($(window).height()-$('#header').outerHeight()-$('#event-closebtn').outerHeight()-20);
      $('#nav-panel').height($(window).height());
      $('#nav-panel-contents').height($(window).height()-22);
      $('.popup').width($(window).width()-50);
      
      

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //JQM AND LEAFLET (MAP) DO NOT PLAY WELL. MAKE HEIGHT ADJUSTMENTS/////////////////////////////////////////////
      if ( map ){
        if($('#map').is(':visible') ) { //just security
            $('#map').height( $(window).height()-$('#header').outerHeight()-$('#footer').outerHeight() ); 
            $('#map').width( $(window).width() ); // as well as height
            map.invalidateSize(); // here it comes
        }
      }
      

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //BIND PANEL AND MAP RESIZE FUNCTIONS/////////////////////////////////////////////////////////////////////////
      $(window).resize(function(){
        $('#nav-panel-contents').height($(window).height()-20);
        $('#nav-panel').height($(window).height());
            $('#map').height( $(window).height()-$('#header').outerHeight()-$('#footer').outerHeight() - $('#top-nav').outerHeight());
            $('#map').width( $(window).width() ); 
        $('.panel-result').height($(window).height()-$('#header').outerHeight()-$('#event-closebtn').outerHeight()-20);
        $('.popup').width($(window).width()-50);
      });

  }

  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //METEOR DEPENDENCY AUTORUNS (WILL REFRESH WHEN DATA HAS CHANGED ON THE SERVER. IT WILL SHOW EVENTS AS THEY ARE ADDED)
  var userIcon = L.icon({
          iconUrl: 'user_event_marker.png',
          iconAnchor: [12,41]
  });
  Deps.autorun(function(){
    userEventsLayer.clearLayers();
    events = Parties.find().fetch();
    for(var i=0;i<events.length;i++){
      //Add marker to the map
      var popupDesc = "<strong>"+events[i].title+"</strong></br>"+
                         "<strong>Address:</strong> "+events[i].address+"</br>";

      (function(eventData){
        eventButton = $("<button type='button' data-role='button'>Event Page</button>").click(function(e){
          $('#event-panel').panel('open');
          $('#event-result').empty();
          $('#event-result').append(event_boiler_plate);
          //---Update the panel so that the event info can appear
          $('#event_title').html(eventData.title);
          $('#event_description').html(eventData.description);

          $('#event-panel').trigger( "updatelayout" );
          //---Re-initialize the panel-result div so that jQuery mobile can apply its styling for the contents within
          $('#event-result').trigger("create");
        
        })[0];
      })(events[i]);

      var div = $('<div />').html(popupDesc).append(eventButton)[0];


      var ev = L.marker([events[i].lat, events[i].lng], {icon: userIcon}).bindPopup(div,{offset: new L.Point(0,-15)}).addTo(userEventsLayer);
      //Add some attributes to our event on the map for reference later
      ev["title"] = events[i].title;
      ev["lat"] = events[i].lat;
      ev["lng"] = events[i].lng;
    }
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
  
  
};



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//LOGIN UI BINDS FOR LOGIN////////////////////////////////////////////////////////////////////////////////////
Template.nav_user_info.events({
  "click #login_github": function (e,tmpl) {
    Meteor.loginWithGithub({
      requestPermissions: ['user','public_repo']
    }, function(err){
      if (err){}
    });
  },
  "click #login_fb": function (e,tmpl) {
    Meteor.loginWithFacebook({
      requestPermissions: []
    }, function(err){
      if (err){}
    });
  },
  "click #login_google": function (e,tmpl) {
    Meteor.loginWithGoogle({
      requestPermissions: []
    }, function(err){
      if (err){}
    });
  },
  "click #login_twitter": function (e,tmpl) {
    Meteor.loginWithTwitter({
      requestPermissions: []
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



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//HANDLEBAR HELPERS//////////////////////////////////////////////////////////////////////////////////////////

/*Handle bars dynamically injects html. jQuery mobile doesn't apply css styles after the page has been initially loaded.
We need to refresh the the elements after handlebars injects*/
Handlebars.registerHelper("refreshElement", function(id) {
  setTimeout(function(){$(id).trigger('create');},100);
});


