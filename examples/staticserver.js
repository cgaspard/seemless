var fs = require('fs');
var mime = require("mime");
var configOptions = {};

module.exports = {
	
	init: function(options) {
		configOptions = options;
	},

	getStaticContent : function(req, res, next) {
		//console.log("getStaticContent Serving Content From: " + __dirname + "; URL: " + req.url);
		
		if(req.url == "/") { req.url = "/index.htm"; }
		//console.log("reading file: " + __dirname + configOptions.prefix + req.url);
		fs.readFile(__dirname + configOptions.prefix + req.url, function (err, data) {
			if (err) {
				//res.send(500);
				return;
			}
			var myMimeType = mime.lookup(req.url);
			var myCharSet = mime.charsets.lookup(myMimeType);
			
			
			res.setHeader('Content-Type', myMimeType + (myCharSet === undefined ? "" : ";charset=" + myCharSet));
			
			res.writeHead(200);
			res.write(data);
			res.end();
			if(next) { next(); }
		});
		
	}
}