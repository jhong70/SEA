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
		- This holds a single function that runs upon the page loading.
		- It initializes the map using the mapbox api and sets the view to some location in New Jersey.
			- It then creates what's called in the Leaflet/Mapbox api as a layer. I called it "userLocLayer."
			- It's a dedicated layer for a marker we place for the user location. When a user enters a query and then decides to enter another query, we need to delete all of the current markers except the user location marker. We can simply choose to delete a layer instead of deleting all markers, which is what the eventslayer is for.
			- We then initialize a mapbox geocoder to obtain the user location.
			- Then we add a UI control for the user to zoom in and out
			- The geocoder then attempts to look for the user's location.
		- Currently we only have one piece of UI (The search bar). So we bind a function whenever a user presses the 'enter' key on the search bar.
			- First, it removes the focus off of the search bar (blur), then zooms the map out. It then prevents any default behavior of the search bar upon an enter key press from happening. Then it clears the events layer to remove any previous event markers. Then it calls the Eventful API to retrieve event data based on the input of the search bar. Upon getting it in JSON format, we retrieve the latitute and longitude and plot them on our map using the eventslayer.
