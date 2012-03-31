define([ 'jquery', 'underscore', 'backbone', 'view/pageView',
		'model/ImgDataCollection' ], function($, _, Backbone, pageView,
		imgDataCollection) {
	// Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
	"use strict";

	var gridView = Backbone.View.extend({
		onAdd : function(m) {
			var pView = new pageView({
				model : m,
				collection : this.collection,
				id : m.get('cellId')
			});

			pView.on("pageRendered", this.onPageRender);
			// end pView.on("pageRendered"

		},// end on add

		onPageRender : function(cell) {

			this.collection.incrementCellLoaded();

		},
		initialize : function() {
			this.collection.bind('add', this.onAdd, this);

			// here because the view need to be ready to catch the add events
			//View is ready, load images
			this.collection.loadImg();

		}
	});

	return gridView;
});
