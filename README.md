nodejs / restify / seemless
============

seemless is a nodejs library takes a node.js module and creates a restful API out of it.  It does so by mapping object properties to routes, and executing the associated functions when a particular route is requested.

Sample Code app.js:  
    ```javascript
    var port = 8080;
    var seemless = require("./seemless.js");
    var framework = require("./framework.js");
            
    var srv = http.createServer();

    //Lets start our server
    srv.listen(port, function(){
        //Callback triggered when server is successfully listening.
        console.log("Server listening on: http://localhost:%s", port);
    });

    /// Expose the framework API
    seemless.generateRoutesForClientAPIAccess('/api/framework.js', framework, "ExportObject", srv);

    /// Expose the data object API
    seemless.generateRoutesForClientAPIAccess('/api/data.js', data, "Data", srv);

    ```