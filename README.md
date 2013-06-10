SEA
===

CS 4261 Social Events App

Development Platform:
  -HTML5 / PHP / mySQL / jQuery

Databases/APIs:
	-Eventful (api.eventful.com) [Retrieve event information]
	-Facebook [login credentials, check ins, pictures, posting ability]
	-Instagram [login credentials, pictures, posting ability]
-Mapquest Geocoder (might need this for more accurate geocoding)
-Mapbox
	-Leaflet (uses Open Street Maps)

Misc. Architecture related services:
	-Twitter Bootstrap (responsive UI)

Prototype:
	www.prism.gatech.edu/~jhong70/sea
	- Uses so far....
		- Twitter Bootstrap
		- Mapbox/Leaflet
		- Eventful API
		- Mapquest Geocoder implemented but not used.
	- Need to implement
		- Facebook
		- Instagram
		- 
File Descriptions:

	-index.html
		-This is the front end of the web app. It essentially holds a static nav-bar div from Twitter's Bootstrap
		which contains a form input for querying into the Eventful API. 
		-Below that is a div clas="map" that acts as the container for the map. It's empty because the mapbox.js
		in /js automatically generates the map within the div when the page loads.
		
	-/js/scripts.js
		-This holds a single function that runs upon the page loading
