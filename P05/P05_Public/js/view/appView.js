define([ 'jquery', 'backbone', 'view/pageView','model/PresageProxy' ], 
function($, Backbone, pageView, PresageProxy) {
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
			this.collection.bind('add', this.onAdd, this);
		}
	});

	return appView;
});
