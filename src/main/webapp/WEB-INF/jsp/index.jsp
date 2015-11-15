<!doctype html>
<html class="no-js">

<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
    <!-- build:css(.) styles/vendor.css -->
    <!-- bower:css -->
    <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="bower_components/font-awesome/css/font-awesome.min.css" type="text/css">
    <link rel="stylesheet" href="bower_components/ng-table/ng-table.css" />
    <link rel="stylesheet" href="bower_components/AngularJS-Toaster/toaster.css" />
    <link rel="stylesheet" href="bower_components/select2/select2.css" />
    <link rel="stylesheet" href="bower_components/select2/select2-bootstrap3.css">
    <link rel="stylesheet" href="bower_components/angular-motion/dist/angular-motion.css" />
    <link rel="stylesheet" href="bower_components/angular-loading-bar/build/loading-bar.css" />

    <link rel="stylesheet" href="bower_components/fullcalendar/dist/fullcalendar.css" />
    <link rel="stylesheet" href="bower_components/bootstrap-markdown/css/bootstrap-markdown.min.css" />
    <link rel="stylesheet" href="bower_components/datetimepicker/jquery.datetimepicker.css" />
    <link rel="stylesheet" href="bower_components/ngQuickDate/dist/ng-quick-date.css" />
    <link rel="stylesheet" href="bower_components/ngQuickDate/dist/ng-quick-date-default-theme.css" />
    <link rel="stylesheet" href="bower_components/ngQuickDate/dist/ng-quick-date-plus-default-theme.css">

    <link rel="stylesheet" href="css/famfamfam-flags.css">


    <!-- endbower -->
    <!-- endbuild -->
    <!-- build:css(.tmp) styles/main.css -->
    <link rel="stylesheet" href="css/main.css">
    <!-- endbuild -->

    <script type="text/javascript">
    var _contextPath = "${pageContext.request.contextPath}";
    </script>
</head>
<!-- 
  ng-app is directive that declares that the element 
  and its children will be handled by angular.js 
-->

<body ng-app="eAuction">
    <!--[if lt IE 7]>
  <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade
      your browser</a> to improve your experience.</p>
  <![endif]-->

	<ng-include src="'menu/dynamic.html'"></ng-include>
    

    <div class="container">
      	<div ng-view autoscroll="true"></div>
    </div> <!-- /container -->


    
    <toaster-container toaster-options="{'time-out': 3000}"></toaster-container>

    <!-- build:js(.) scripts/oldieshim.js -->
    <!--[if lt IE 9]>
      <script src="bower_components/es5-shim/es5-shim.js"></script>
      <script src="bower_components/json3/lib/json3.js"></script>
    <![endif]-->
    <!-- endbuild -->

    <!-- build:js(.) scripts/vendor.js -->
    <!-- bower:js -->
    <script src="bower_components/jquery/jquery.js"></script>
    <script src="bower_components/angular/angular.js"></script>
    <script src="bower_components/angular-route/angular-route.js"></script>
    <script src="bower_components/angular-resource/angular-resource.js"></script>
    <script src="bower_components/angular-cookies/angular-cookies.js"></script>
    <script src="bower_components/angular-animate/angular-animate.js"></script>
    <script src="bower_components/angular-sanitize/angular-sanitize.js"></script>
    <script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>
    <script src="bower_components/jquery-cookie/jquery.cookie.js"></script>
    <script src="bower_components/jquery-ui/jquery-ui.js"></script>
    <script src="bower_components/angular-bootstrap/ui-bootstrap-tpls.js"></script>
    <script src="bower_components/angular-strap/dist/angular-strap.min.js"></script>
    <script src="bower_components/angular-strap/dist/angular-strap.tpl.min.js"></script>
    <script src="bower_components/AngularJS-Toaster/toaster.js"></script>
    <script src="bower_components/angular-loading-bar/build/loading-bar.js"></script>
    <script src="bower_components/angular-translate/angular-translate.js"></script>
    <script src="bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js"></script>
    <script src="bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js"></script>
    <script src="bower_components/moment/moment.js"></script>
    <script src="bower_components/fullcalendar/dist/fullcalendar.js"></script>
    <script src="bower_components/angular-ui-calendar/src/calendar.js"></script>
    <script src="bower_components/select2/select2.js"></script>
    <script src="bower_components/angular-ui-select2/src/select2.js"></script>
    <script src="bower_components/bootstrap-markdown/js/bootstrap-markdown.js"></script>
    <script src="bower_components/datetimepicker/jquery.datetimepicker.js"></script>
    <script src="bower_components/jquery-textcomplete/dist/jquery.textcomplete.min.js"></script>
    <script src="bower_components/momentjs/moment.js"></script>
    <script src="bower_components/ng-file-upload/angular-file-upload.js"></script>
    <script src="bower_components/ng-table/ng-table.js"></script>
    <script src="bower_components/ng-table-export/ng-table-export.js"></script>
    <script src="bower_components/ngQuickDate/dist/ng-quick-date.js"></script>
    <!-- endbower -->
    <!-- endbuild -->

    <!-- These scripts hold the code of the application -->
    <!-- build:js({.tmp,app}) scripts/scripts.js -->
    <!-- The definition and the configuration of the application module -->

    <script src="scripts/app.js"></script>
    <!-- The route configuration -->
    <script src="scripts/config.js"></script>
    <script src="scripts/router.js"></script>

    <!-- filters definition -->
    <script src="scripts/filters/filters.js"></script>
    <script src="scripts/filters/cfilter.js"></script>

    <!-- directives definition -->
    <script src="scripts/directives/simple.js"></script>
    <script src="scripts/directives/combo.js"></script>
    <script src="scripts/directives/crud-directive.js"></script>
    <script src="scripts/directives/sub-crud.js"></script>
    <script src="scripts/directives/date-field.js"></script>
    <script src="scripts/directives/datetime-field.js"></script>
    <script src="scripts/directives/input-field.js"></script>
    <script src="scripts/directives/insert-combo.js"></script>
    <script src="scripts/directives/radio.js"></script>
    <script src="scripts/directives/uploadPanel.js"></script>
    <!-- Services definition -->
    <script src="scripts/services/crud.js"></script>
    <script src="scripts/services/services.js"></script>
    <script src="scripts/services/fa.js"></script>
    <script src="scripts/services/auth.js"></script>
    <script src="scripts/services/misc.js"></script>
    <script src="scripts/services/user.js"></script>

    <!-- controllers definition -->
    <script src="scripts/controllers/general.js"></script>
    <script src="scripts/controllers/navigation.js"></script>
    <script src="scripts/controllers/auth.js"></script>
    <script src="scripts/controllers/misc.js"></script>

    <!-- endbuild -->
</body>

</html>
