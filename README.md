SEA
===

CS 4261 Social Events App

Development Platform:
  -HTML5 / Meteor.js / Mongodb / jQuery mobile / zocial (social media login buttons) 

Databases/APIs:
	-Eventful (api.eventful.com) [Retrieve event information]
	-Facebook / Google / Github / Twitter
-Mapbox
	-Leaflet (uses Open Street Maps)

Misc. Architecture related services:
	-jQuery mobile for UI
	-Handlebars for inserting html templates

Prototype:
	htttp://sea.meteor.com
	- Uses so far....
		- jQuery mobile
		- Mapbox/Leaflet
		- Zocial
		- Meteor.js for Reactivity and Mongodb implementaiton (Meteor.com)
	- Need to implement
		- Event creation (publishing from server and subscribing from client)
		- UI forms for inputting new events
File Descriptions:

	-index.html
		- The html contains templates
			- There's a page template that holds everything
			- nav_user_info for the sliding navigational panel
				- This panel adjusts its content depending on whether the user is logged in
				- It uses the currentUser variable that's defined in the Meteor.js library
				- Please please please! use Meteor.com documentation for this
				- Also look into Handlebars

	-oAuth.js
		- This is the function that handles user creation that's typically already defined in Meteor.js
		- I made custom implementations to get more information from the multiple social media interfaces and to support the custom UI I made for the login system. (list of buttons in the nav panel)

	-render.js
		- This file is responsible for rendering the page correctly as well as resizing the page elements correctly.
		- This file also handles functions binded to the buttons and UI elements
		- This is binded to Template.page.rendered because we need to wait for the templates in our index.html to render first to do any jquery with the elements on the page.
		- We also have a initialized global variable because binding the function to rendered means that the functions' contents are automatically refreshed if Meteor detects any changes to the database, server queries, or any elements that dynamically changes. This is the power of Meteor.js. We don't want to keep unecessarily rendering and initializing the page with map elements. This will make the Leaflet (Mapbox) map to break because for everytime the page automatically refreshes, it will try to reinitialize the map variable with another map.. Leaflet will complain that the map div container has already been initialized. What's there (initialize variable) is my temporary fix that seems to work.
