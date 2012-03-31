define([ 'jquery', 'underscore', 'backbone',
		'text!../../html/pageView_tpl.html' ], function($, _, Backbone, tpl) {
	// Using ECMAScript 5 strict mode during development. By default r.js will ignore that.
	"use strict";
	var pageView = Backbone.View.extend({


		onModelRemove : function() {
			console.log("removing view");
			//remove this view
			this.remove();
			//remove the HTML div
			$("#"+this.divId).remove();

		},

		render : function() {
			console.log("rendering model with memory: "
					+ this.collection.getHistory());

			// the actual id that is not going to be used outside this render function
			// cellId stays 4 alphanumeric reference to the position (top left is r1c1 etc)
			// getHistory is holding past positions. Every cell need to hold the whole history, in order to differenciate to consequtive move in the same direction

			var realCurrentId = this.collection.getHistory()
					+ this.model.get('cellId');

			var vars = {};

			//add "-r2c2" at the end of the id: every cell is meant to become center (r2c2),
			//so if it's set now there is no need to update this value once they are displayed
			//(the visible page always ends by r2c2, the naming of the target pages is an anticipation
			// so as not to have to chance the id once it's displayed)
			// set the divId on the model so as to be able in the Collection to avoid generating doubles
			
			this.divId = realCurrentId + "-r2c2";
			
			// set the divId on the model so as to be able in the Collection to avoid generating doubles
			console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ........... ?????? "+this.divId);
			console.log("model cellId >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   "+this.model.get("cellId"));

			
			
			
			//check if divId already exists
			for ( var a in this.collection.models) {
				console.log("divId "+ this.collection.models[a].get("divId"));
				if (this.divId == this.collection.models[a].get("divId")){
					
					this.collection.remove(this.model);
					
				}
			}
			this.model.set("divId", this.divId);
			//
			
			
			//
			console.log("divId                   "+this.model.get("divId"));
			
			vars.cell = this.divId;
			vars.depth = this.collection.getDepth();

			console.log("vars.cell: ", vars.cell, "  depth: ", this.collection
					.getDepth());
			if(this.collection.getDepth()==1) console.log(" 1 !!!!!!!!!!!!!!!!!")
			vars.url = this.model.get('imgUrl');

			//define the links to the next pages
			vars.topNav = realCurrentId + "-r1c2-r2c2";
			vars.rightNav = realCurrentId + "-r2c3-r2c2";
			vars.bottomNav = realCurrentId + "-r3c2-r2c2";
			vars.leftNav = realCurrentId + "-r2c1-r2c2";

			// change the link pointing to the page we are coming from 
			//TODO keep memory of all pages visited
			console.log("[pageView] this.collection.getHistory() ::::::: >>>>> " +this.collection.getHistory());
			console.log("[pageView] this.collection.getHistory().lenght ::::::: >>>>> " +this.collection.getHistory().length);
			var prevLink = this.collection.getDepth() == 1 ? "r2c2-r2c2" : this.collection.getHistory()+"r2c2";
			
			switch(this.model.get('cellId')){
			case "r1c2":
				vars.bottomNav= prevLink;
				break;
			case "r2c3":
				vars.leftNav= prevLink;
				break;
			case "r3c2":
				vars.topNav= prevLink;
				break;
			case "r2c1":
				vars.rightNav= prevLink;
				break;
			
			};
			
			
			//TODO and fixe going back when level == 2

			var template = _.template(tpl, vars);

			if (this.collection.getDepth() == 0) {
				this.el = $("#" + vars.cell);

				this.el.replaceWith(template);
			} else {
				var foundAvailDiv =false;
				var availableDiv1 = $("[data-role]='page'").filter(
						":not(.ui-page-active)").filter(":not[id]=''");

				for ( var a = 0; a < availableDiv1.length; a++) {
					console.log("  available div  ------>  " + availableDiv1[a].id);

					// replace the existing div until all are replaced, then add new ones
					//TODO see if I can always add DIV, and not replace
					//TODO once the binding of the removing of the model and the removing of the html DIV
					// is implemented: remove the replace mechanism
					if ($(availableDiv1[a]).attr("depth") == this.collection
							.getDepth() - 1
							&& this.collection.getDepth() < 5) {

						this.el = $(availableDiv1[a]);
						this.el.replaceWith(template);
						foundAvailDiv = true;
						break;
					}
				}
				if(!foundAvailDiv){
					var availableDiv2 = $("[data-role]='page'").filter("[depth]="+this.collection.getDepth()).filter(
					":not(.ui-page-active)").filter(":not[id]=''");
					for ( var a2 = 0; a2 < availableDiv2.length; a2++) {
						this.el = $(availableDiv1[a]);
						this.el.replaceWith(template);
						break;
					}
				}
					if(!foundAvailDiv){
					console.log("this.collection.getDepth() >= 5  cell:  ====>>> "+ vars.cell);
					this.el = $("#container");
					this.el.append(template);
					}

			}

			this.el.swiperight(function() { 

			document.location.href="#/page/"+vars.leftNav;
			});
			
			this.el.swipeleft(function() { 

			document.location.href="#/page/"+vars.rightNav;
				});
			
			
			
			
			this.el.swipeup(function() { 

			document.location.href="#/page/"+vars.bottomNav;
			});
			
			this.el.swipedown(function() { 

			document.location.href="#/page/"+vars.topNav;
				});
				
			
			this.trigger("pageRendered", vars.cell);

		},
		initialize : function() {
			this.model.on("remove", this.onModelRemove, this);
			this.model.on("idChange", this.onIdChange, this);
			this.model.on("renderEvent", this.render, this);
			
			//divId is the id of the html Div that is bound to occurrence this view
			this.divId = "";
		}
	});

	return pageView;
});
