var restify = require('restify');
var seemless = require("../src/lib/seemless.js");
var framework = require("./framework.js");
var data = require("./data.js");
var staticserver = require("./staticcontent/staticserver.js");
	
framework._seemless_Init();

var restServer = restify.createServer();
restServer.use(restify.bodyParser());

seemless.autoGenerateRouteAndAPIForObject('/api/framework', framework, "ExportObject", restServer);
seemless.autoGenerateRouteAndAPIForObject('/api/data', data, "Data", restServer);

restServer.get(/^\/.*/, staticserver.getStaticContent);

restServer.listen(4455, function() {
	  console.log('%s listening at %s', restServer.name, restServer.url);
});
