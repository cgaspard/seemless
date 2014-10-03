var Seemless = {

  routes: [],
  childObjects: [],
  parentObjects: [],
  serverRootPath: "",

  /// This caling this function will 
  autoGenerateRouteAndAPIForObject: function (clientAPIRoute, objectToRoute, rootObjectName, restServer) {
    Seemless.addObjectRoute(clientAPIRoute, objectToRoute, rootObjectName, restServer);
    Seemless.generateRoutesForClientAPIAccess(objectToRoute, rootObjectName, restServer);
  },

  addObjectRoute: function (route, routeObj, rootObjectname, restServer) {
    console.log("addObjectRoute " + route);
    restServer.get(route, function (req, res, next) {
      res.setHeader('Content-Type', 'text/javascript');
      res.writeHead(200);
      res.write(Seemless.generateAPIForObject(routeObj, rootObjectname));
      res.end();
      next();
    });
  },

  generateAPIForObject: function (objectToGenerate, rootObjectname) {
    var returnString = "var " + rootObjectname + " = " + Seemless.ObjectToClientSideAPI(objectToGenerate, rootObjectname);
    return returnString;
  },

  generateRoutesForClientAPIAccess: function (objectToGenerate, rootObjectname, restServer) {
    console.log("calling generateRoutesForClientAPIAccess");
    Seemless.BuildRoutesForObjectWithRestify(objectToGenerate, restServer, rootObjectname);
  },

  dispatchClientAPICall: function (req, res, body) {
    console.log(req.url);
    for (var rt = 0; rt < Seemless.routes.length; rt++) {
      if (Seemless.routes[rt] == req.url) {

        var params = new Array();
        for (paramName in req.params) {
          params.push(req.params[paramName]);
        }

        params.push(function (err, returnValue) {
          console.log("AsyncCallResult: " + returnValue);
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "X-Requested-With");
          res.send(JSON.stringify(returnValue));
        });

        console.log("Calling function  with (" + JSON.stringify(req.params) + ")");

        var callResult = JSON.stringify(Seemless.childObjects[rt].apply(Seemless.parentObjects[rt], params));

        console.log("SyncCallResult: " + callResult);

        if (callResult !== undefined) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "X-Requested-With");
          res.send(callResult.toString());
        }
      }

    }
  },

  /// Property was set on the client, so update the node version of it
  dispatchClientAPIPropertyCall: function (req, res, body) {
    console.log(req.url);
    for (var rt = 0; rt < Seemless.routes.length; rt++) {
      if (Seemless.routes[rt] == req.url) {
        console.log("Going to set property value for route " + Seemless.routes[rt]);

        if (req.params.hasOwnProperty("postValue")) {
          console.log("Proeprty value set to " + req.params.postValue);
          ///Set Value
          Seemless.parentObjects[rt][Seemless.childObjects[rt]] = req.params.postValue;
        }

        console.log("Property api call result:" + Seemless.parentObjects[rt][Seemless.childObjects[rt]]);

        res.send(Seemless.parentObjects[rt][Seemless.childObjects[rt]]);
      }

    }
  },

  ObjectToClientSideAPI: function (objectToBuild, objectRouteName, parentRouteName) {


    if (parentRouteName !== undefined) {
      objectRouteName = parentRouteName + "." + objectRouteName
    } else {
      objectRouteName = "/" + objectRouteName;
    }

    var returnObject = addTabs(tabCounter) + "{\r\n";
    tabCounter += 1
    for (var name in objectToBuild) {
      switch (typeof (objectToBuild[name])) {
      case "string":
        {
          //returnObject += addTabs(tabCounter) + "\"" + name + "\":\"" + objectToBuild[name] + "\",\r\n";
          var functionParams = getParamNames(objectToBuild[name]);
          returnObject += addTabs(tabCounter) + "get " + name + "() { ";
          tabCounter += 1;
          returnObject += addTabs(tabCounter) + "var ajaxURL = \"" + Seemless.serverRootPath + objectRouteName + "/" + name + "_get\";\r\n";
          //returnObject += addTabs(tabCounter) + generateParameterReplace(functionParams);
          var ajaxFixed = addTabs(tabCounter) + "return " + ajaxJquerySyncString;
          ajaxFixed = ajaxFixed.replace("$URL$", "/" + name);
          ajaxFixed = ajaxFixed.replace("$PARAMS$", "{}");
          returnObject += ajaxFixed;
          tabCounter -= 1;
          returnObject += addTabs(tabCounter) + "},\r\n"

          returnObject += addTabs(tabCounter) + "set " + name + "(setValue) { ";
          tabCounter += 1;
          returnObject += addTabs(tabCounter) + "var ajaxURL = \"" + Seemless.serverRootPath + objectRouteName + "/" + name + "_set\";\r\n";
          //returnObject += addTabs(tabCounter) + generateParameterReplace(functionParams);
          var ajaxFixed = addTabs(tabCounter) + "return " + ajaxJquerySyncString;
          ajaxFixed = ajaxFixed.replace("$URL$", "/" + name);
          ajaxFixed = ajaxFixed.replace("$PARAMS$", "{ postValue : setValue }");
          returnObject += ajaxFixed;
          tabCounter -= 1;
          returnObject += addTabs(tabCounter) + "},\r\n"

          break;
          break;
        }
      case "function":
        {

          if (name.match(/_seemless_/)) continue;
          var functionParams = getParamNames(objectToBuild[name]);
          returnObject += addTabs(tabCounter) + "\"" + name + "\": function(" + (functionParams == null ? "" : functionParams.join(", ") + ", ") + "successCallback, errorCallback) {\r\n";
          tabCounter += 1;
          returnObject += addTabs(tabCounter) + "var ajaxURL = \"" + Seemless.serverRootPath + objectRouteName + "/" + name + "\";\r\n";
          //returnObject += addTabs(tabCounter) + generateParameterReplace(functionParams);
          var ajaxFixed = addTabs(tabCounter) + ajaxJqueryString;
          ajaxFixed = ajaxFixed.replace("$URL$", "/" + name);
          ajaxFixed = ajaxFixed.replace("$PARAMS$", generatePostString(functionParams));
          ajaxFixed = ajaxFixed.replace("$SUCCESSCALLBACK$", "successCallback");
          ajaxFixed = ajaxFixed.replace("$ERRORCALLBACK$", "errorCallback");
          returnObject += ajaxFixed;
          tabCounter -= 1;
          returnObject += addTabs(tabCounter) + "},\r\n"

          break;
        }
      case "object":
        {
          returnObject += addTabs(tabCounter) + "\"" + name + "\" : " + Seemless.ObjectToClientSideAPI(objectToBuild[name], name, objectRouteName) + ",\r\n";
          break;
        }
      }

      //alert(returnObject);
      //alert(typeof(buz[name]));
    }
    tabCounter -= 1
    returnObject += addTabs(tabCounter) + "}";
    //console.log("Sending API To Client " + returnObject);
    return returnObject;
  },

  BuildRoutesForObjectWithRestify: function (objectToRoute, restServer, objectToRouteName, parentRouteName) {
    var routeString;

    if (parentRouteName !== undefined) {
      objectToRouteName = parentRouteName + "." + objectToRouteName
    } else {
      objectToRouteName = "/" + objectToRouteName;
    }

    for (var propName in objectToRoute) {
      routeString = "";
      switch (typeof (objectToRoute[propName])) {
      case "string":
        {
          routeString = objectToRouteName + "/" + propName + "_get";
          //restServer.post(routeString, objectToRoute[propName]);
          Seemless.routes.push(routeString);
          Seemless.childObjects.push(propName);
          Seemless.parentObjects.push(objectToRoute);
          restServer.post(routeString, Seemless.dispatchClientAPIPropertyCall);
          console.log("Added post route " + routeString + " for " + objectToRouteName + "." + propName);


          routeString = objectToRouteName + "/" + propName + "_set";
          //restServer.post(routeString, objectToRoute[propName]);
          Seemless.routes.push(routeString);
          Seemless.childObjects.push(propName);
          Seemless.parentObjects.push(objectToRoute);
          restServer.post(routeString, Seemless.dispatchClientAPIPropertyCall);
          console.log("Added post route " + routeString + " for " + objectToRouteName + "." + propName);

          break;

        }
      case "function":
        {
          if (propName.match(/_seemless_/)) continue;
          routeString = objectToRouteName + "/" + propName;
          //restServer.post(routeString, objectToRoute[propName]);
          Seemless.routes.push(routeString);
          Seemless.childObjects.push(objectToRoute[propName]);
          Seemless.parentObjects.push(objectToRouteName);
          restServer.post(routeString, Seemless.dispatchClientAPICall);
          console.log("Added post route " + routeString + " for " + objectToRouteName + "." + propName + "()");

          break;
        }
      case "object":
        {
          Seemless.BuildRoutesForObjectWithRestify(objectToRoute[propName], restServer, propName, objectToRouteName);
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
  return funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).match(/([^\s,]+)/g);
}

function generateParameterReplace(params) {

  if (params == null) return "";

  var paramString = "";
  for (i = 0; i < params.length; i++) {
    paramString += "ajaxURL = ajaxURL.replace(\"/:" + params[i] + "\", " + params[i] + ");\r\n";
  }
  return paramString;
}

function generatePostString(params) {

  if (params == null) return "{}";

  var postString = "{";
  for (i = 0; i < params.length; i++) {
    postString += "\"" + params[i] + "\" : " + params[i] + ", ";
  }
  postString += "}";
  //postString = "JSON.stringify" + postString + ")";
  return postString;
}

function getNodeParams(paramsArray) {
  if (paramsArray === null) return "";
  var paramString = "";
  for (i = 0; i < paramsArray.length; i++) {
    paramString += "/:" + paramsArray[i];
  }
  return paramString;
}

function addTabs(counter) {
  var tabRet = "";
  for (var t = 0; t < counter; t++) {
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

var ajaxJquerySyncString = "$.ajax({ " +
  "type: \"POST\"," +
  "url: ajaxURL," +
  "data: $PARAMS$," +
  "async: false" +
  "}).responseText;\r\n";

function test(x, y) {
  console.log("in text function");
  return 12;
}