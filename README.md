nodejs / restify / seemless
============

seemless is a nodejs library that works in conjunction with restify to build client side apis to access objects as restfull web services

Requires client side jQuery, and restify on the server.

Sample Code app.js:

    var restify = require('restify');
    var seemless = require("./seemless.js");
    var framework = require("./framework.js");
        
    var restServer = restify.createServer();
    restServer.use(restify.bodyParser());

    seemless.generateRoutesForClientAPIAccess(framework, restServer);
    seemless.addObjectRoute('/api/framework', framework, restServer);

    restServer.listen(4455, function() {
          console.log('%s listening at %s', restServer.name, restServer.url);
    });

Sample Code framework.js

    var ExportObject = {

        APIObjectName : "ExportObject",
        
        addNumbers : function(x, y) {
            console.log("Called ExportObject.addNumbers(" + x + ", " + y + ")");
            var number = parseInt(x) + parseInt(y);
            return number;
        },

        SubObject : {
        
            APIObjectName : "SubObject",
        
            subtractNumbers : function(x, y) {
                console.log("calling SubObject.subtrackNumbers(" + x + ", " + y + ")");
                var number = parseInt(x) - parseInt(y);
                return number;
            }
        }
    }

    module.exports = ExportObject;

Explanation:

The following two examples will generate a restify routes to point to "/ExportObject/addNumbers & /ExportObject.SubObject/subtractNumbers"

To access the restify services include /api/framework script in your html.

After doing this, the following is avilable on the client side javascript: ExportObject.addNumbers(x, y) & ExportObject.SubObject.subtractNumbers(x, y);

Calling the functions on the client side will invoke the /ExportObject/addNumbers web service which will call ExportObject.addNumbers() form framework.js
