<?php session_start(); 
header("Cache-Control: no-store, no-cache, must-revalidate");

?>
<!doctype html>
<html>
  <head>
  	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  	<title>Social Events App</title>

  	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" type="text/css" href="css/zocial.css" />
    <link href='http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.css' rel='stylesheet'/>
    <link href='http://api.tiles.mapbox.com/mapbox.js/v1.0.2/mapbox.css' rel='stylesheet' />
    <link href='css/jQm_theme.min.css' rel='stylesheet'/>
    <link href='css/main_style.css' rel='stylesheet' media="screen"/>
    <!--[if lte IE 8]>
    <link href='http://api.tiles.mapbox.com/mapbox.js/v1.0.2/mapbox.ie.css' rel='stylesheet' >
  	<![endif]-->
  </head>

  <body>
    <div id="wrapper" data-role="page" data-theme="a">

    	<div id="header" data-role="header" data-theme="a" data-position="fixed" >
      	<div class="nav-bar">
  		    <span class="brand desktop">Social Events App</span>
          <!--Need some space for mobile-->
          <!--<span class="brand mobile">SEA</span>-->
                  
  		    <form id="search" class="ui-icon-alt">
            <input id="searchInput" type="text" data-clear-btn="true" class="search-query" placeholder="Find me events">
  	      </form>
          <div id="nav-buttons-container">
            <a href="#filterPopup" id="filterButton" class="nav-button" data-inline="true" data-transition="pop" data-iconpos="notext" data-role="button" data-rel="dialog" data-icon="search"></a>
            <a href="#list-panel" class="nav-button" data-inline="true" data-role="button" data-iconpos="notext" data-icon="bars"></a>
            <a href="#nav-panel" id="menuButton" class="nav-button" data-inline="true" data-iconpos="notext" data-icon="arrow-r" data-role="button"></a>
          </div>

        </div>
  		</div>
      	
      <!-- nav panel -->
      <div data-role="panel" data-position="right" data-swipe-close="false" id="nav-panel"  data-display="reveal" data-theme="a">
      	<div id="nav-panel-contents">
          <h3>Social Events App</h3>
          <ul type="none">
          <h4>Share</h4>
            <li><a href="">Upload Photos</a></li>
          <h4>Map</h4>
            <li><a href="">Overlays</a></li>
          <h4>Account</h4>
            <li><a href="">Profile</a></li>
            <li><a href="">Friends</a></li>
            <li><a href="">My Events</a></li>
            <li><a href="">Settings</a></li>
          </ul> 
      	</div>
  		</div>
          
      <div id="content" data-role="content" data-theme="a">

  		  <div id="map" class="map"></div>


        <div class="panel" data-theme="a" data-role="panel" data-dismissible="false" data-swipe-close="false" id="event-panel" data-display="overlay" align="center">
          <a id="event-closebtn" data-role="button">Close</a>
          <div class="panel-result" id="event-result" align="left"></div>
        </div>

        <div class="panel" data-theme="a" data-position="right" data-role="panel" data-dismissible="false" data-swipe-close="false" id="list-panel" data-display="overlay" align="center">
          <a id="list-closebtn" data-role="button">Close</a>
          <div class="panel-result" id="list-result" align="left"></div>
        </div>

  	  </div><!-- /content-->
          
      <div data-role="footer" id="footer">		
  	    <div data-role="navbar">
  		    <ul>
            <li><a href="#">Browse Events</a></li>
  			    <li><a href="#">News Feed</a></li>
  			    <li><a href="account.html">My Events</a></li>
  		    </ul>
  	    </div>
      </div><!-- /footer-->

    </div><!-- /wrapper-->
      






    <div id="filterPopup" data-role="page" data-corners="false" data-shadow="true" data-iconshadow="true" data-theme="a" data-overlay-theme="a">
  		<div data-role="header">
    		<h2>Filter search</h2>
  		</div>
  		<div data-role="content">
  			<fieldset data-role="controlgroup">
    			<legend>Date:</legend>
    			<input type="radio" name="radio-choice" id="radio-choice-1" value="past" checked="checked" />
    				<label for="radio-choice-1">Past</label>
    			<input type="radio" name="radio-choice" id="radio-choice-2" value="today" />
    				<label for="radio-choice-2">Today</label> 
    			<input type="radio" name="radio-choice" id="radio-choice-3" value="week" />
    				<label for="radio-choice-3">This Week</label>
    			<input type="radio" name="radio-choice" id="radio-choice-4" value="future" />
    				<label for="radio-choice-4">Future</label>
          <input type="text" placeholder="Enter a Date"/>
  			</fieldset>
              
        <fieldset data-role="controlgroup">
    			<legend>Parameters:</legend>
    			<input type="checkbox" name="param-choice" id="param-choice-1" value="friends" checked="checked" />
    				<label for="param-choice-1">Friend's Events Only</label>         
  			</fieldset>
              
        <fieldset data-role="controlgroup">
    			<legend>Event type:</legend>
    			<input type="checkbox" name="param-choice" id="sponsor-choice" checked="checked" />
    				<label for="sponsor-choice">Sponsored</label>
    			<input type="checkbox" name="param-choice" id="user-choice" checked="checked"/>
    				<label for="user-choice">User</label>      
  			</fieldset>       
		  </div> 		
	  </div>

      
  	<script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
    <script src='http://api.tiles.mapbox.com/mapbox.js/v1.0.2/mapbox.js'></script>
    <script src="http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.js"></script> 
    <script src="js/EVDB.js"></script>
    <script src="js/scripts.js"></script>
  </body>
</html>
