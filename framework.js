var ExportObject = {

	_seemless_Init : function() {

		console.log("Init called");
	},
	//APIObjectName : "ExportObject",
	
	addNumbers : function(x, y) {
		console.log("Called ExportObject.addNumbers(" + x + ", " + y + ")");
		var number = parseInt(x) + parseInt(y);
		return number;
	},

	SubObject : {
	
		subtractNumbers : function(x, y) {
			console.log("calling SubObject.subtractNumbers(" + x + ", " + y + ")");
			var number = parseInt(x) - parseInt(y);
			return number;
		}
	}
}

module.exports = ExportObject;