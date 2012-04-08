define([ 'jquery', 'underscore', 'backbone', 'view/pageView',
		'model/ImgDataCollection', 'router/appRouter' ], function($, _, Backbone, pageView,
		imgDataCollection, _router) {
	// Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
	"use strict";

	var gridView = Backbone.View.extend({
		router : {},
		setRouter : function(r){
			
			this.router = r;
			// here because the view need to be ready to catch the add events
			//View is ready, load images
			this.collection.loadImgs();
		},
		onAdd : function(m) {
			var pView = new pageView({
				model : m,
				collection : this.collection,
				//router : this.router,
				id : m.get('cellId')
			});
			pView.setRouter(this.router);
			//pView.router =  this.router;
			pView.on("pageRendered", this.onPageRender);
			// end pView.on("pageRendered"

		},// end on add

		onPageRender : function(cell) {

			this.collection.incrementCellLoaded();

		},
		initialize : function() {
			this.collection.bind('add', this.onAdd, this);
			console.log("rROUTER in GridView: "+this.router);


		}
	});

	return gridView;
});
