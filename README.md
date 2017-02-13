seemless restful API module
============
At its core, seemless takes on the task of making restful APIs out of javascript objects.   It does this by enumerating the object and linking routes to functions inside the node http server.  In addition, seemless also creates a client side javascript file that maps to the same server side REST API.

Seemless works with node.js http server.  However, it can work side by side with expresss and resitfy node.js modules.   See compatibilty notes at the end of the README.

Install seemless using npm, or package.json dependancy
```
npm install seemless
```

## Steps to setup seemless

### Step 1: Create a Nodejs module for your API

Here is an example of a node module, that seemless will turn into a restful API module.

```
var MyAPI = {
    /// This function will be exposed at http://[serverip]/MyAPI/add
    add: function(a, b, _request, _response, _callback) {
        return a + b;
    },

    /// This function will be exposed at http://[serverip]/MyAPI/sub
    sub: function(a, b _request, _response, _callback) {
        return a - b;
    },

    /// To create a private function, prefix it with an underscore and seemless will ignore it
    _privateFunction: function(_request, _response, _callback) {

    }
}

module.exports = MyAPI;
```

### Step 2: Create an instance of an http server, require the API module, and tell seemless to make an API out of it.

```
const http = require('http');
const port = 8080;

var MyAPI = require('myapi.js'); /// This is the module we created in Step 1

var seemless = require("seemless");
/// Add debug=true if you want to see console messages about how seemless creates its routes and when the restful API functions are called
seemless.debug = true;  

// Create an HTTP server
var server = http.createServer();

// Start http server listening on port
server.listen(port, function(){ console.log("Server listening on: http://localhost:%s", port); });

/// Expose the restful API on the webserver
seemless.generateRoutesForClientAPIAccess('/path/to/client.js', MyAPI, "MyAPI", server, "/v1/");
```

### Step 3: Use the API

After step 2, seemless does two things.   

First it adds routes into our http server that when called will execute the function that route is registered to.   So in the example above, the following routes will map to the function that generated them.

```
/v1/MyAPI/add => MyAPI.add();
/v1/MyAPI/sub => MyAPI.sub();
```

The second thing seemless does is generate a client side JS file that can be used in browser to call the API using the same object structure that resides in node.js application. 

In our case we would use:

```
<script src="/path/to/client.js"></script>
```

The first parameter in the generateRoutesForClientAPIAccess call tells seemless the location to expose this Javascript file.  From there we could utilize the API on the client like so:

```
document.addEventListener("load", function() {
    MyAPI.add(1, 2, addDone, addError);

    function addDone(result) {
        alert(result);  /// In this case it should alert 3;
    }
    function addError(err) {
        alert("We had an error calling our API:" + err.message);
    }
});
```

### API Reference

    There is only one function call to get seemless to expose the restful API.

    ### generateRoutesForClientAPIAccess: function (clientURL, apiObject, namespace, httpServer, apiURLPrefix)

    ### Paramters Definition

        clientURL (string) - This parameter is the location at which the client side javascript file will be exposed.

        apiObject (object) - This is the modules we will be exposing as a restfulAPI.

        namespace (string) - On the client side, this string will be the name of the variable that you use to access the API.

        httpServer (object) - This is the node http server to expose the API on.

        apiURLPrefix (optional, string) - If you want to prefix all of you restulf API with a string, use this parameter to specify the prefix location.

### Restify Compatibilty

In order for seemless to expose and API object along side restify server make sure you have at least one post route setup.  Otherwise all post request will be rejected by restify before seemless can respond.  If you have no other post routes in restify add a post route that does nothing to make sure seemless can operate..

``` 
restServer.post(/\.*/, function (req, res, next) { next(); });
```
