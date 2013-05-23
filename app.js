var restify = require('restify');
var seemless = require("./seemless.js");
var framework = require("./framework.js");
var data = require("./data.js");
var staticserver = require("./staticcontent/staticserver.js");
	
var restServer = restify.createServer();
restServer.use(restify.bodyParser());

seemless.generateRoutesForClientAPIAccess(framework, restServer);
seemless.addObjectRoute('/api/framework', framework, restServer);

seemless.generateRoutesForClientAPIAccess(data, restServer);
seemless.addObjectRoute('/api/data', data, restServer);

restServer.get(/^\/.*/, staticserver.getStaticContent);

restServer.listen(4455, function() {
	  console.log('%s listening at %s', restServer.name, restServer.url);
});
