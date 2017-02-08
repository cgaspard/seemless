const http = require('http');
const port = 8080;
const staticPrefix = "/staticcontent";

var seemless = require("../src/lib/seemless.js");
seemless.debug = true;

/// These object are application objects
var framework = require("./framework.js");
var data = require("./data.js");
var staticserver = require("./staticserver.js");

/// Tell http where to find the static files
staticserver.init({"prefix": staticPrefix});

// Create an HTTP server
var srv = http.createServer(function(req, res, body) {
    /// server static files
    if(req.url.match(/^\/.*/)) {
        staticserver.getStaticContent(req, res, body);
    }
});

//Lets start our server
srv.listen(port, function(){
    //Callback triggered when server is successfully listening.
    console.log("Server listening on: http://localhost:%s", port);
});


/// Expose the framework API
seemless.generateRoutesForClientAPIAccess('/api/framework', framework, "ExportObject", srv);

/// Expose the data object
seemless.generateRoutesForClientAPIAccess('/api/data', data, "Data", srv);