const http = require('http');
const staticPrefix = "/staticcontent";
var port = 8080;

/// check for the port env variable
if(process.env !== undefined && process.env.HTTP_PORT !== undefined) {
    port = process.env.HTTP_PORT;
    console.log("Running on port ", port);
}


/// check for the port param
for(var i = 0; i < process.argv.length; i++) {
    var arg = process.argv[i];
    if(arg.indexOf("--port:") === 0) {
        port = arg.split(":")[1];
        // console.log("Running on port ", port);
    }
}

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
seemless.generateRoutesForClientAPIAccess('/api/framework', framework, "ExportObject", srv, "/tst");

/// Expose the data object
seemless.generateRoutesForClientAPIAccess('/api/data', data, "Data", srv);