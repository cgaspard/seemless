var restify = require('restify');
var seemless = require("./seemless.js");
var framework = require("./framework.js");
var staticserver = require("./staticcontent/staticserver.js");
	
var restServer = restify.createServer();
restServer.use(restify.bodyParser());
seemless.generateRoutesForClientAPIAccess(framework, restServer);

restServer.get('/api/framework', getFrameworkAPI);
restServer.get(/^\/.*/, staticserver.getStaticContent);

restServer.listen(4455, function() {
	  console.log('%s listening at %s', restServer.name, restServer.url);
});

function getFrameworkAPI(req, res, next) {
	res.setHeader('Content-Type', 'text/javascript');
	res.writeHead(200);
	res.write(seemless.generateAPIForObject(framework));
	res.end();
	next();
}