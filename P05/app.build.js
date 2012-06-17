// t1$ java -classpath js.jar org.mozilla.javascript.tools.shell.Main r.js -o app.build.js

({
	appDir: 'P05_Public/',
	baseUrl: 'js',
	dir: 'P05_Public/build',
	preserveLicenseComments: false,
	paths: {
		'requiredLib' : 'lib/almond-0.1.1'
	},
	name: 'main',
	include: 'requiredLib',
	
	//mainConfigFile necessary to load dependencies specified in shim 
	mainConfigFile: 'P05_Public/js/main.js'
	
})
