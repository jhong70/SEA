<?php 
    ob_start(); 
    session_start(); 
    header("Cache-Control: no-store, no-cache, must-revalidate");
    // Check, if user is already logged in, jump to the main page
if (isset($_SESSION['userprofile']) ) {
    header('Location: http://seaapp.netne.net/main.php');
}
?>
<!doctype html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Social Events App</title>

    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" type="text/css" href="css/zocial.css" />
    <link href='http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.css' rel='stylesheet'/>
    <link href='css/jQm_theme.min.css' rel='stylesheet'/>
    <link href='css/index_style.css' rel='stylesheet'/>
    <!--[if lte IE 8]>
    <link href='http://api.tiles.mapbox.com/mapbox.js/v1.0.2/mapbox.ie.css' rel='stylesheet' >
    <![endif]-->

</head>

<body>
    
    <div id="wrapper" data-role="page" data-theme="a">

        <div id="header" data-role="header" data-theme="a" data-position="fixed">
            <h1>Welcome</h1>
        </div>
        
        <div id="content" data-role="content" align="center">
            <!--spacer-->
            <div style="padding-top:15%;"></div>
            
            <h1 id="banner">Social Events App</h1>

            <!--spacer-->
            <div style="padding-top:6%;"></div>
            <fieldset>
                <a class="ctr_button zocial facebook" href="auth/login.php?app=facebook" data-rel="external" data-ajax="false" style="color:white;"><span>facebook</span></a>
                <a class="zocial google" href="auth/login.php?app=google" data-rel="external" data-ajax="false" style="color:white;"><span>Google+</span></a><br />
                <div style="padding-top:4%;"></div>
                <a class="ctr_button" href="main.php" data-rel="external" data-ajax="false" data-role="button" data-theme="a">Continue without an account</a>
            </fieldset>
            
        </div>
        
        
    </div>

    
    <script src="http://code.jquery.com/jquery-1.9.1.min.js"></script>
    <script src="http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.js"></script> 
    
</body>
</html>
