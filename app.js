var restify = require('restify');
var seemless = require("./seemless.js");
var framework = require("./framework.js");
var data = require("./data.js");
var staticserver = require("./staticcontent/staticserver.js");
	
var restServer = restify.createServer();
restServer.use(restify.bodyParser());

seemless.generateRoutesForClientAPIAccess(framework, "ExportObject", restServer);
seemless.addObjectRoute('/api/framework', framework, "ExportObject", restServer);

seemless.generateRoutesForClientAPIAccess(data, "Data", restServer);
seemless.addObjectRoute('/api/data', data, "Data", restServer);

restServer.get(/^\/.*/, staticserver.getStaticContent);

restServer.listen(4455, function() {
	  console.log('%s listening at %s', restServer.name, restServer.url);
});
