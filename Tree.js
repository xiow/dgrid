define(["dojo/_base/declare"], function(declare){

return declare([], {
	constructor: function(mixin){
		for(var i in mixin){
			this[i] = mixin[i];
		}
	},
	renderCell: function(data, td, options){
		// summary:
		//		Renders a cell that can be expanded, creating more rows
		var level = options.query.level + 1;
		var table = this.table;
		// create the expando
		var expando = td.appendChild(document.createElement("div"));
		expando.level = isNaN(level) ? 0 : level;
		if(this.field){
			td.appendChild(document.createTextNode(data));
		}
		expando.className = "dojoxGridxExpando ui-icon ui-icon-triangle-1-e";
		expando.setAttribute("style", "margin-left: " + (expando.level * 19) + "px; float: left");
		var tr, query;

		if(!table._hasTreeListener){
			// just setup the event listener once and use event delegation for better memory use
			table._hasTreeListener = true;
			this.table.on(".dojoxGridxExpando:click", function(event){
				// on click we toggle expanding and collapsing
				var expanded = this.expanded = !this.expanded;
				// update the expando display
				this.className = "dojoxGridxExpando ui-icon ui-icon-triangle-1-" + (expanded ? "se" : "e"); 
				var preloadNode = this.preloadNode;
				var row = table.getRowNode(table.getObjectId(this));
				if(!preloadNode){
					// if the children have not been created, create a preload node and do the 
					// query for the children
					preloadNode = this.preloadNode = document.createElement("div");
					var query = function(options){
						return table.store.getChildren(object, options);
					};
					query.level = this.level;
					row.parentNode.insertBefore(preloadNode, row.nextSibling);
					var object = table.getObject(row);
					table.renderQuery(query, preloadNode);
				}
				// show or hide all the children
				var styleDisplay = expanded ? "" : "none";
				var childTr = row;
				do{
					childTr = childTr.nextSibling;
					if(childTr){
						childTr.style.display = styleDisplay;
					} 
				}while(childTr && (childTr != preloadNode));
			});
		};
	}
});
});