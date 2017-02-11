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
	
		subtractNumbers : function(x, y, _request, _respone, _callBack) {
			console.log("Is this.callBack == _callBack:", this.callBack == _callBack);
			console.log("Called SubObject.subtractNumbers(" + x + ", " + y + ")");
			var number = parseInt(x) - parseInt(y);
			return number;
		}
	}
}

module.exports = ExportObject;