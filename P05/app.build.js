//CadavreExquis t1$ java -classpath js.jar org.mozilla.javascript.tools.shell.Main r.js -o app.build.js
({
	appDir: 'P05_Public/',
	baseUrl: 'js',
	dir: 'P05_Public/build',
	preserveLicenseComments: false,
	paths: {
    	'requiredLib' : 'lib/require',
    	'jquery': 'lib/jquery-1.7.1.min',
      	'jqueryMobile': 'lib/jquery.mobile-1.1.0.min',
        'underscore': 'lib/underscoreAmd-min',
        'backbone': 'lib/backboneAmd-min',
        'order': 'lib/order',
        'text': 'lib/text'
	},
	name: 'main',
	include:'requiredLib'
})
