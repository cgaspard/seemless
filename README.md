seemless restful API module
============
At its core, seemless takes on the task of making restful APIs out of javascript objects.   It does this by enumerating the object and linking routes to functions inside the node http server.  In addition, seemless also creates a client side javascript file that maps to the same server side REST API.

### Sample Setup Code:  

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