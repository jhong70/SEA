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


To run the project you need to install Meteor.js. Go to Meteor.com and find instructions to do this.
1. From your command line or terminal (Meteor works in OSX but I'm not sure about Windows) cd into the project directory.
2. Now type meteor
	(this will run the project under http://localhost:3000. Open your browser and enter that address to check. Note that the login system is set up to only work for http://sea.meteor.com. This is defined by those APIs. To test correctly you need to deploy the project to sea.meteor.com. No ssh or ftp client is necessary to do this. Look below)
3. Open a new terminal tab or window.
4. type meteor deploy sea.meteor.com
5. Note that this will replace whatever is on there.. Just let everyone know when you deploy. I wouldn't deploy if its not necessary. For example, I need to deploy to test the login system but UI changes should be done under localhost please...
6. When you make changes to the files in the project, the website or localhost should automatically refresh. This is also another powerful aspect of Meteor and convenient..


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
