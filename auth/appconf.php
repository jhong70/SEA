<?php
/*==========================================*\
|| ##########################################||
|| # SONHLAB.com - SONHlab Social Auth v1 #
|| ##########################################||
\*==========================================*/

// Set the page will be returned
$index = '../main.php';

if ( $app == 'facebook' ) { // Facebook App
	$facebook = new Facebook(array(
		'appId'  => '312157992253389',
		'secret' => 'ab492dfe3bea0715cf037381feff1ac3',
	));
}
elseif ( $app == 'twitter' ) { // Twitter App
	$tmhOAuth = new tmhOAuth(array(
	  'consumer_key'    => 'NJtRYEU7YJ3DnGufRP5A',
	  'consumer_secret' => '1dR3opE3Dk9RGcUTo38YtbL8aUekzHRPVLZaYxMhXnw',
	));
}
elseif ( $app == 'google' ) { // Google App
	$GoogleApiConfig = array(
		// The application_name is included in the User-Agent HTTP header.
		'application_name' => 'Sea',
		
		// OAuth2 Settings, you can get these keys at https://code.google.com/apis/console
		'oauth2_client_id' => '15674763153.apps.googleusercontent.com',
		'oauth2_client_secret' => 'CcgxszB-BvHNtlkiK8LA7mGB',
		'oauth2_redirect_uri' => 'http://seaapp.netne.net/main.php',

	);
}