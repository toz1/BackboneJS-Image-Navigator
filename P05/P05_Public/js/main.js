require.config({
	baseUrl: "js",
  paths: {
  	jquery: 'lib/jquery-1.7.2',
  	jqueryMobile: 'lib/jquery.mobile-1.1.0-rc.1',
    underscore: 'lib/underscoreAmd-min',
    backbone: 'lib/backboneAmd-min',
    order: 'lib/order',
    text: 'lib/text'
  }

});

require(['app'],
        function(App) {

             App.init();
        } );