var Seemless = {

	routes : [],
	apisCallbacks : [],
	parentObjects : [],

	generateAPIForObject : function(objectToGenerate) {
		console.log("calling generateAPIForObject");
		var returnString = "var " + objectToGenerate.APIObjectName + " = " + Seemless.ObjectToClientSideAPI(objectToGenerate);
		return returnString;
	},
	
	generateRoutesForClientAPIAccess : function(objectToGenerate, restServer) {
		console.log("calling generateRoutesForClientAPIAccess");
		Seemless.BuildRoutesForObjectWithRestify(objectToGenerate, restServer);
	},

	ObjectToClientSideAPI : function(objectToBuild, parentRouteName) {
		var objectRouteName = "";
		
		for (var propName in objectToBuild) {
			switch(typeof(objectToBuild[propName])){
				case "string" : {
					console.log("Checking " + propName);
					if(propName == "APIObjectName") {
						objectRouteName = "/" + objectToBuild[propName];
					}
					break;       
				}
			}
		}
		
		if(parentRouteName !== undefined) {
			objectRouteName = parentRouteName  + objectRouteName
		}
		
		console.log("Should be route " + objectRouteName);

		var returnObject = addTabs(tabCounter) + "{\r\n";
		tabCounter += 1;
		console.log("tabcount = " + tabCounter);
		for (var name in objectToBuild) {
			tabCounter += 1;
			switch(typeof(objectToBuild[name])){
				case "string": {
					if(propName == "APIObjectName") { break; }
					returnObject += addTabs(tabCounter) + "\"" + name + "\":\"" + objectToBuild[name] + "\"";
					break;
				}
				case "function" : {
					var functionParams = getParamNames(objectToBuild[name]);
					returnObject += addTabs(tabCounter) + "\"" + name + "\": function(" + (functionParams == null ? "" : functionParams + ", ") + " successCallback, errorCallback) {\r\n";
					tabCounter += 1;
					returnObject += addTabs(tabCounter) + "var ajaxURL = \"" + objectRouteName + "/" + name + "\";\r\n";
					//returnObject += addTabs(tabCounter) + generateParameterReplace(functionParams);
					var ajaxFixed = ajaxJqueryString;
					ajaxFixed = ajaxFixed.replace("$URL$", "/" + name);
					ajaxFixed = ajaxFixed.replace("$PARAMS$", generatePostString(functionParams));
					ajaxFixed = ajaxFixed.replace("$SUCCESSCALLBACK$", "successCallback");
					ajaxFixed = ajaxFixed.replace("$ERRORCALLBACK$", "errorCallback");
					returnObject += ajaxFixed;
					returnObject += "}"
					tabCounter -= 1;
					break;
				}
				case "object" : {
					returnObject += addTabs(tabCounter) + "\"" + name + "\" : " + Seemless.ObjectToClientSideAPI(objectToBuild[name], objectRouteName);
					break;
				}
				tabCounter -= 1;
			}
			returnObject += ",\r\n";
			//alert(returnObject);
			//alert(typeof(buz[name]));
		}
		returnObject += addTabs(tabCounter) + "}";

		return returnObject;
	},

	BuildRoutesForObjectWithRestify : function(objectToRoute, restServer, parentRouteName) {
		//console.log("calling BuildRoutesForObjectWithRestify");
		//console.log(JSON.stringify(objectToRoute));
		var objectToRouteName, routeString;
		for (var propName in objectToRoute) {
			switch(typeof(objectToRoute[propName])){
				case "string" : {
					if(propName == "APIObjectName") {
						objectToRouteName = "/" + objectToRoute[propName];
					}
					break;       
				}
			}
		}
		if(parentRouteName !== undefined) {
			objectToRouteName = parentRouteName + objectToRouteName
		}
		
		for (var propName in objectToRoute) {
			routeString = "";
			switch(typeof(objectToRoute[propName])){
				case "function": {
					routeString =  objectToRouteName + "/" + propName;
					//restServer.post(routeString, objectToRoute[propName]);
					Seemless.routes.push(routeString);
					Seemless.apisCallbacks.push(objectToRoute[propName]);
					Seemless.parentObjects.push(objectToRouteName);
					restServer.post(routeString, function(req, res, body) {
						console.log(req.url);
						for(var rt = 0; rt < Seemless.routes.length; rt++) {
							if(Seemless.routes[rt] == req.url) {
								console.log("Calling function  with (" + JSON.stringify(req.params)  +")");
								var params = new Array();
								for(paramName in req.params) {
									params.push(req.params[paramName]);
								}

								var callResult = Seemless.apisCallbacks[rt].apply(Seemless.parentObjects[rt], params);
								//var callResult = Seemless.apisCallbacks[rt].call(Seemless.parentObjects[rt], params);
								//var callResult = Seemless.apisCallbacks[rt](4, 2);
								console.log(callResult);
								res.send(callResult.toString());
							}

						}
					});
					console.log("Adding post route " + routeString + " for " + objectToRoute[propName]);

					var functionParams = getParamNames(objectToRoute[propName]);
					restServer.get(routeString + getNodeParams(functionParams), function(req, res) {
						console.log(req.url);
						for(var rt = 0; rt < Seemless.routes.length; rt++) {
							if(Seemless.routes[rt] == req.url) {
								//console.log("Calling function  with (" + JSON.stringify(req.params)  +")");
								var params = req.params;
								//var callResult = Seemless.apisCallbacks[rt].apply(Seemless.parentObjects[rt], [4, 2]);
								//var callResult = Seemless.apisCallbacks[rt].call(Seemless.parentObjects[rt], 4, 2);
								var callResult = Seemless.apisCallbacks[rt](4, 2);
								console.log(Seemless.apisCallbacks[rt]);
								res.send(callResult).toString();
							}
						}
					});
					console.log("Adding post route " + routeString + getNodeParams(functionParams) + " for " + objectToRoute[propName]);

					
					break;
				}
				case "object" : {
					Seemless.BuildRoutesForObjectWithRestify(objectToRoute[propName], restServer, objectToRouteName);
					break;
				}
			}
		}
	}
}

module.exports = Seemless;

var tabCounter = 0;

function getParamNames(func) {
	var funStr = func.toString();
	return funStr.slice(funStr.indexOf('(')+1, funStr.indexOf(')')).match(/([^\s,]+)/g);
}

function generateParameterReplace(params) {
	
	if(params == null) return "";
	
	var paramString = "";
	for(i = 0; i < params.length; i++) {
		paramString += "ajaxURL = ajaxURL.replace(\"/:" + params[i] + "\", " + params[i] + ");\r\n";
	}
	return paramString;
}

function generatePostString(params) {
	
	if(params == null) return "{}";
	
	var postString = "{";
	for(i = 0; i < params.length; i++) {
		postString += "\"" + params[i] + "\" : " + params[i] + ", ";
	}
	postString += "}";
	//postString = "JSON.stringify" + postString + ")";
	return postString;
}

function getNodeParams(paramsArray) {
	var paramString = "";
	for(i = 0; i < paramsArray.length; i++) {
		paramString += "/:" + paramsArray[i];
	}
	return paramString;
}

function addTabs(counter) {
	var tabRet = "";
	for(var t = 0; t < counter.length; t++) {
	 tabRet += "\t";   
	}
	return tabRet;
}

var ajaxJqueryString = "$.ajax({ " +
		"type: \"POST\"," +
		"url: ajaxURL," +
		"data: $PARAMS$," +
		"success: $SUCCESSCALLBACK$," +
		"error: $ERRORCALLBACK$" +
	"});\r\n";

function test(x, y) {
	console.log("in text function");
	return 12;
}