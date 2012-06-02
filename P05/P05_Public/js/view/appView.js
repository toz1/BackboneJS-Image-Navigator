define([ 'jquery', 'underscore', 'backbone', 'view/pageView','model/PresageProxy' ], 
function($, _, Backbone, pageView, PresageProxy) {
	// Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
	"use strict";

	var appView = Backbone.View.extend({
		el:  $( "#container" ),
		  events: {
			    "change #searchInput"                : "searchHandler"
			  },
		router : {},
	
		searchHandler : function(e){
			
		console.log("search: "+e.target.value);
		this.collection.search(e.target.value);
		},
		setRouter : function(r){
			console.log("[appView] router is set");
			this.router = r;
			//!!!!!!!!!!!!!!!!!!! LOAD INIT IMAGES ON INPUT !!!!!!!!!!!!!
			// here because the view need to be ready to catch the add events
			//View is ready, load images
			//this.collection.loadInitImgs();
		},
		onAdd : function(m) {
			var pView = new pageView({
				model : m,
				collection : this.collection,
				id : m.get('cellId')
			});
			pView.setRouter(this.router);
			pView.on("pageRendered", this.onPageRender);

		},// end on add

		onPageRender : function(cell) {

			this.collection.incrementCellLoaded();

		},

		
		initialize : function() {
			console.log("INIT appView");
			this.collection.bind('add', this.onAdd, this);
		}
	});

	return appView;
});
