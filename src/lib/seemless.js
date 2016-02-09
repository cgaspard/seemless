/*jslint node: true, -W083, -W098 */
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
    //console.log("addObjectRoute " + route);
    restServer.get(route, function (req, res, next) {
      res.setHeader('Content-Type', 'text/javascript');
      res.writeHead(200);
      res.write(Seemless.generateAPIForObject(routeObj, rootObjectname));
      res.end();
      next();
    });
  },

  generateAPIForObject: function (objectToGenerate, rootObjectname) {

    /*!
     * Reqwest! A general purpose XHR connection manager
     * license MIT (c) Dustin Diaz 2015
     * https://github.com/ded/reqwest
     */
    var ajaxLibrary = "https://github.com/ded/reqwest\r\n\r\n!function(e,t,n){typeof module!=\"undefined\"&&module.exports?module.exports=n():typeof define==\"function\"&&define.amd?define(n):t[e]=n()}(\"reqwest\",this,function(){function succeed(e){var t=protocolRe.exec(e.url);return t=t&&t[1]||context.location.protocol,httpsRe.test(t)?twoHundo.test(e.request.status):!!e.request.response}function handleReadyState(e,t,n){return function(){if(e._aborted)return n(e.request);if(e._timedOut)return n(e.request,\"Request is aborted: timeout\");e.request&&e.request[readyState]==4&&(e.request.onreadystatechange=noop,succeed(e)?t(e.request):n(e.request))}}function setHeaders(e,t){var n=t.headers||{},r;n.Accept=n.Accept||defaultHeaders.accept[t.type]||defaultHeaders.accept[\"*\"];var i=typeof FormData==\"function\"&&t.data instanceof FormData;!t.crossOrigin&&!n[requestedWith]&&(n[requestedWith]=defaultHeaders.requestedWith),!n[contentType]&&!i&&(n[contentType]=t.contentType||defaultHeaders.contentType);for(r in n)n.hasOwnProperty(r)&&\"setRequestHeader\"in e&&e.setRequestHeader(r,n[r])}function setCredentials(e,t){typeof t.withCredentials!=\"undefined\"&&typeof e.withCredentials!=\"undefined\"&&(e.withCredentials=!!t.withCredentials)}function generalCallback(e){lastValue=e}function urlappend(e,t){return e+(\/\\?\/.test(e)?\"&\":\"?\")+t}function handleJsonp(e,t,n,r){var i=uniqid++,s=e.jsonpCallback||\"callback\",o=e.jsonpCallbackName||reqwest.getcallbackPrefix(i),u=new RegExp(\"((^|\\\\?|&)\"+s+\")=([^&]+)\"),a=r.match(u),f=doc.createElement(\"script\"),l=0,c=navigator.userAgent.indexOf(\"MSIE 10.0\")!==-1;return a?a[3]===\"?\"?r=r.replace(u,\"$1=\"+o):o=a[3]:r=urlappend(r,s+\"=\"+o),context[o]=generalCallback,f.type=\"text\/javascript\",f.src=r,f.async=!0,typeof f.onreadystatechange!=\"undefined\"&&!c&&(f.htmlFor=f.id=\"_reqwest_\"+i),f.onload=f.onreadystatechange=function(){if(f[readyState]&&f[readyState]!==\"complete\"&&f[readyState]!==\"loaded\"||l)return!1;f.onload=f.onreadystatechange=null,f.onclick&&f.onclick(),t(lastValue),lastValue=undefined,head.removeChild(f),l=1},head.appendChild(f),{abort:function(){f.onload=f.onreadystatechange=null,n({},\"Request is aborted: timeout\",{}),lastValue=undefined,head.removeChild(f),l=1}}}function getRequest(e,t){var n=this.o,r=(n.method||\"GET\").toUpperCase(),i=typeof n==\"string\"?n:n.url,s=n.processData!==!1&&n.data&&typeof n.data!=\"string\"?reqwest.toQueryString(n.data):n.data||null,o,u=!1;return(n[\"type\"]==\"jsonp\"||r==\"GET\")&&s&&(i=urlappend(i,s),s=null),n[\"type\"]==\"jsonp\"?handleJsonp(n,e,t,i):(o=n.xhr&&n.xhr(n)||xhr(n),o.open(r,i,n.async===!1?!1:!0),setHeaders(o,n),setCredentials(o,n),context[xDomainRequest]&&o instanceof context[xDomainRequest]?(o.onload=e,o.onerror=t,o.onprogress=function(){},u=!0):o.onreadystatechange=handleReadyState(this,e,t),n.before&&n.before(o),u?setTimeout(function(){o.send(s)},200):o.send(s),o)}function Reqwest(e,t){this.o=e,this.fn=t,init.apply(this,arguments)}function setType(e){if(e===null)return undefined;if(e.match(\"json\"))return\"json\";if(e.match(\"javascript\"))return\"js\";if(e.match(\"text\"))return\"html\";if(e.match(\"xml\"))return\"xml\"}function init(o,fn){function complete(e){o.timeout&&clearTimeout(self.timeout),self.timeout=null;while(self._completeHandlers.length>0)self._completeHandlers.shift()(e)}function success(resp){var type=o.type||resp&&setType(resp.getResponseHeader(\"Content-Type\"));resp=type!==\"jsonp\"?self.request:resp;var filteredResponse=globalSetupOptions.dataFilter(resp.responseText,type),r=filteredResponse;try{resp.responseText=r}catch(e){}if(r)switch(type){case\"json\":try{resp=context.JSON?context.JSON.parse(r):eval(\"(\"+r+\")\")}catch(err){return error(resp,\"Could not parse JSON in response\",err)}break;case\"js\":resp=eval(r);break;case\"html\":resp=r;break;case\"xml\":resp=resp.responseXML&&resp.responseXML.parseError&&resp.responseXML.parseError.errorCode&&resp.responseXML.parseError.reason?null:resp.responseXML}self._responseArgs.resp=resp,self._fulfilled=!0,fn(resp),self._successHandler(resp);while(self._fulfillmentHandlers.length>0)resp=self._fulfillmentHandlers.shift()(resp);complete(resp)}function timedOut(){self._timedOut=!0,self.request.abort()}function error(e,t,n){e=self.request,self._responseArgs.resp=e,self._responseArgs.msg=t,self._responseArgs.t=n,self._erred=!0;while(self._errorHandlers.length>0)self._errorHandlers.shift()(e,t,n);complete(e)}this.url=typeof o==\"string\"?o:o.url,this.timeout=null,this._fulfilled=!1,this._successHandler=function(){},this._fulfillmentHandlers=[],this._errorHandlers=[],this._completeHandlers=[],this._erred=!1,this._responseArgs={};var self=this;fn=fn||function(){},o.timeout&&(this.timeout=setTimeout(function(){timedOut()},o.timeout)),o.success&&(this._successHandler=function(){o.success.apply(o,arguments)}),o.error&&this._errorHandlers.push(function(){o.error.apply(o,arguments)}),o.complete&&this._completeHandlers.push(function(){o.complete.apply(o,arguments)}),this.request=getRequest.call(this,success,error)}function reqwest(e,t){return new Reqwest(e,t)}function normalize(e){return e?e.replace(\/\\r?\\n\/g,\"\\r\\n\"):\"\"}function serial(e,t){var n=e.name,r=e.tagName.toLowerCase(),i=function(e){e&&!e.disabled&&t(n,normalize(e.attributes.value&&e.attributes.value.specified?e.value:e.text))},s,o,u,a;if(e.disabled||!n)return;switch(r){case\"input\":\/reset|button|image|file\/i.test(e.type)||(s=\/checkbox\/i.test(e.type),o=\/radio\/i.test(e.type),u=e.value,(!s&&!o||e.checked)&&t(n,normalize(s&&u===\"\"?\"on\":u)));break;case\"textarea\":t(n,normalize(e.value));break;case\"select\":if(e.type.toLowerCase()===\"select-one\")i(e.selectedIndex>=0?e.options[e.selectedIndex]:null);else for(a=0;e.length&&a<e.length;a++)e.options[a].selected&&i(e.options[a])}}function eachFormElement(){var e=this,t,n,r=function(t,n){var r,i,s;for(r=0;r<n.length;r++){s=t[byTag](n[r]);for(i=0;i<s.length;i++)serial(s[i],e)}};for(n=0;n<arguments.length;n++)t=arguments[n],\/input|select|textarea\/i.test(t.tagName)&&serial(t,e),r(t,[\"input\",\"select\",\"textarea\"])}function serializeQueryString(){return reqwest.toQueryString(reqwest.serializeArray.apply(null,arguments))}function serializeHash(){var e={};return eachFormElement.apply(function(t,n){t in e?(e[t]&&!isArray(e[t])&&(e[t]=[e[t]]),e[t].push(n)):e[t]=n},arguments),e}function buildParams(e,t,n,r){var i,s,o,u=\/\\[\\]$\/;if(isArray(t))for(s=0;t&&s<t.length;s++)o=t[s],n||u.test(e)?r(e,o):buildParams(e+\"[\"+(typeof o==\"object\"?s:\"\")+\"]\",o,n,r);else if(t&&t.toString()===\"[object Object]\")for(i in t)buildParams(e+\"[\"+i+\"]\",t[i],n,r);else r(e,t)}var context=this;if(\"window\"in context)var doc=document,byTag=\"getElementsByTagName\",head=doc[byTag](\"head\")[0];else{var XHR2;try{var xhr2=\"xhr2\";XHR2=require(xhr2)}catch(ex){throw new Error(\"Peer dependency `xhr2` required! Please npm install xhr2\")}}var httpsRe=\/^http\/,protocolRe=\/(^\\w+):\\\/\\\/\/,twoHundo=\/^(20\\d|1223)$\/,readyState=\"readyState\",contentType=\"Content-Type\",requestedWith=\"X-Requested-With\",uniqid=0,callbackPrefix=\"reqwest_\"+ +(new Date),lastValue,xmlHttpRequest=\"XMLHttpRequest\",xDomainRequest=\"XDomainRequest\",noop=function(){},isArray=typeof Array.isArray==\"function\"?Array.isArray:function(e){return e instanceof Array},defaultHeaders={contentType:\"application\/x-www-form-urlencoded\",requestedWith:xmlHttpRequest,accept:{\"*\":\"text\/javascript, text\/html, application\/xml, text\/xml, *\/*\",xml:\"application\/xml, text\/xml\",html:\"text\/html\",text:\"text\/plain\",json:\"application\/json, text\/javascript\",js:\"application\/javascript, text\/javascript\"}},xhr=function(e){if(e.crossOrigin===!0){var t=context[xmlHttpRequest]?new XMLHttpRequest:null;if(t&&\"withCredentials\"in t)return t;if(context[xDomainRequest])return new XDomainRequest;throw new Error(\"Browser does not support cross-origin requests\")}return context[xmlHttpRequest]?new XMLHttpRequest:XHR2?new XHR2:new ActiveXObject(\"Microsoft.XMLHTTP\")},globalSetupOptions={dataFilter:function(e){return e}};return Reqwest.prototype={abort:function(){this._aborted=!0,this.request.abort()},retry:function(){init.call(this,this.o,this.fn)},then:function(e,t){return e=e||function(){},t=t||function(){},this._fulfilled?this._responseArgs.resp=e(this._responseArgs.resp):this._erred?t(this._responseArgs.resp,this._responseArgs.msg,this._responseArgs.t):(this._fulfillmentHandlers.push(e),this._errorHandlers.push(t)),this},always:function(e){return this._fulfilled||this._erred?e(this._responseArgs.resp):this._completeHandlers.push(e),this},fail:function(e){return this._erred?e(this._responseArgs.resp,this._responseArgs.msg,this._responseArgs.t):this._errorHandlers.push(e),this},\"catch\":function(e){return this.fail(e)}},reqwest.serializeArray=function(){var e=[];return eachFormElement.apply(function(t,n){e.push({name:t,value:n})},arguments),e},reqwest.serialize=function(){if(arguments.length===0)return\"\";var e,t,n=Array.prototype.slice.call(arguments,0);return e=n.pop(),e&&e.nodeType&&n.push(e)&&(e=null),e&&(e=e.type),e==\"map\"?t=serializeHash:e==\"array\"?t=reqwest.serializeArray:t=serializeQueryString,t.apply(null,n)},reqwest.toQueryString=function(e,t){var n,r,i=t||!1,s=[],o=encodeURIComponent,u=function(e,t){t=\"function\"==typeof t?t():t==null?\"\":t,s[s.length]=o(e)+\"=\"+o(t)};if(isArray(e))for(r=0;e&&r<e.length;r++)u(e[r].name,e[r].value);else for(n in e)e.hasOwnProperty(n)&&buildParams(n,e[n],i,u);return s.join(\"&\").replace(\/%20\/g,\"+\")},reqwest.getcallbackPrefix=function(){return callbackPrefix},reqwest.compat=function(e,t){return e&&(e.type&&(e.method=e.type)&&delete e.type,e.dataType&&(e.type=e.dataType),e.jsonpCallback&&(e.jsonpCallbackName=e.jsonpCallback)&&delete e.jsonpCallback,e.jsonp&&(e.jsonpCallback=e.jsonp)),new Reqwest(e,t)},reqwest.ajaxSetup=function(e){e=e||{};for(var t in e)globalSetupOptions[t]=e[t]},reqwest})";

    var returnString = ajaxLibrary + "\r\n\r\nvar " + rootObjectname + " = " + Seemless.ObjectToClientSideAPI(objectToGenerate, rootObjectname);
    return returnString;
  },

  generateRoutesForClientAPIAccess: function (objectToGenerate, rootObjectname, restServer) {
    //console.log("calling generateRoutesForClientAPIAccess");
    Seemless.BuildRoutesForObjectWithRestify(objectToGenerate, restServer, rootObjectname);
  },

  dispatchClientAPICall: function (req, res, body) {
    //console.log(req.url);
    for (var rt = 0; rt < Seemless.routes.length; rt++) {
      if (Seemless.routes[rt] == req.url) {

        var params = [];
        for (var paramName in req.params) {
          params.push(req.params[paramName]);
        }

        params.push(function (err, returnValue) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "X-Requested-With");
          var jsonString = JSON.stringify(returnValue);
          if (err) {
            throw err.message;
          } else {
            //console.log("AsyncCallResult: " + jsonString);
            res.send(jsonString);
          }
        });

        //console.log("Calling function  with (" + JSON.stringify(req.params) + ")");

        var callResult = JSON.stringify(Seemless.childObjects[rt].apply(Seemless.parentObjects[rt], params));

        //console.log("SyncCallResult: " + callResult);

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
    //console.log(req.url);
    for (var rt = 0; rt < Seemless.routes.length; rt++) {
      if (Seemless.routes[rt] == req.url) {
        //console.log("Going to set property value for route " + Seemless.routes[rt]);

        if (req.params.hasOwnProperty("postValue")) {
          //console.log("Proeprty value set to " + req.params.postValue);
          ///Set Value
          Seemless.parentObjects[rt][Seemless.childObjects[rt]] = req.params.postValue;
        }

        //console.log("Property api call result:" + Seemless.parentObjects[rt][Seemless.childObjects[rt]]);

        res.send(Seemless.parentObjects[rt][Seemless.childObjects[rt]]);
      }

    }
  },

  ObjectToClientSideAPI: function (objectToBuild, objectRouteName, parentRouteName) {


    if (parentRouteName !== undefined) {
      objectRouteName = parentRouteName + "." + objectRouteName;
    } else {
      objectRouteName = "/" + objectRouteName;
    }

    var returnObject = addTabs(tabCounter) + "{\r\n";
    var functionParams = "";
    var ajaxFixed = "";
    tabCounter += 1;
    for (var name in objectToBuild) {
      switch (typeof (objectToBuild[name])) {
      case "string":
        {
          //returnObject += addTabs(tabCounter) + "\"" + name + "\":\"" + objectToBuild[name] + "\",\r\n";
          functionParams = getParamNames(objectToBuild[name]);
          returnObject += addTabs(tabCounter) + "get " + name + "() { ";
          tabCounter += 1;
          returnObject += addTabs(tabCounter) + "var ajaxURL = \"" + Seemless.serverRootPath + objectRouteName + "/" + name + "_get\";\r\n";
          //returnObject += addTabs(tabCounter) + generateParameterReplace(functionParams);
          ajaxFixed = addTabs(tabCounter) + "return " + ajaxJquerySyncString;
          ajaxFixed = ajaxFixed.replace("$URL$", "/" + name);
          ajaxFixed = ajaxFixed.replace("$PARAMS$", "{}");
          returnObject += ajaxFixed;
          tabCounter -= 1;
          returnObject += addTabs(tabCounter) + "},\r\n";

          returnObject += addTabs(tabCounter) + "set " + name + "(setValue) { ";
          tabCounter += 1;
          returnObject += addTabs(tabCounter) + "var ajaxURL = \"" + Seemless.serverRootPath + objectRouteName + "/" + name + "_set\";\r\n";
          ajaxFixed = addTabs(tabCounter) + "return " + ajaxJquerySyncString;
          ajaxFixed = ajaxFixed.replace("$URL$", "/" + name);
          ajaxFixed = ajaxFixed.replace("$PARAMS$", "{ postValue : setValue }");
          returnObject += ajaxFixed;
          tabCounter -= 1;
          returnObject += addTabs(tabCounter) + "},\r\n";

          break;
        }
      case "function":
        {

          if (name.match(/_seemless_/)) {
            continue;
          }
          functionParams = getParamNames(objectToBuild[name]);
          returnObject += addTabs(tabCounter) + "\"" + name + "\": function(" + (functionParams === null ? "" : functionParams.join(", ") + ", ") + "successCallback, errorCallback) {\r\n";
          tabCounter += 1;
          returnObject += addTabs(tabCounter) + "var ajaxURL = \"" + Seemless.serverRootPath + objectRouteName + "/" + name + "\";\r\n";
          ajaxFixed = addTabs(tabCounter) + ajaxJqueryString;
          ajaxFixed = ajaxFixed.replace("$URL$", "/" + name);
          ajaxFixed = ajaxFixed.replace("$PARAMS$", generatePostString(functionParams));
          ajaxFixed = ajaxFixed.replace("$SUCCESSCALLBACK$", "successCallback");
          ajaxFixed = ajaxFixed.replace("$ERRORCALLBACK$", "errorCallback");
          returnObject += ajaxFixed;
          tabCounter -= 1;
          returnObject += addTabs(tabCounter) + "},\r\n";

          break;
        }
      case "object":
        {
          returnObject += addTabs(tabCounter) + "\"" + name + "\" : " + Seemless.ObjectToClientSideAPI(objectToBuild[name], name, objectRouteName) + ",\r\n";
          break;
        }
      }
    }
    tabCounter -= 1;
    returnObject += addTabs(tabCounter) + "}";
    return returnObject;
  },

  BuildRoutesForObjectWithRestify: function (objectToRoute, restServer, objectToRouteName, parentRouteName) {
    var routeString;

    if (parentRouteName !== undefined) {
      objectToRouteName = parentRouteName + "." + objectToRouteName;
    } else {
      objectToRouteName = "/" + objectToRouteName;
    }

    for (var propName in objectToRoute) {
      routeString = "";
      switch (typeof (objectToRoute[propName])) {
      case "string":
        {
          routeString = objectToRouteName + "/" + propName + "_get";
          Seemless.routes.push(routeString);
          Seemless.childObjects.push(propName);
          Seemless.parentObjects.push(objectToRoute);
          restServer.post(routeString, Seemless.dispatchClientAPIPropertyCall);
          //console.log("Added post route " + routeString + " for " + objectToRouteName + "." + propName);

          routeString = objectToRouteName + "/" + propName + "_set";
          Seemless.routes.push(routeString);
          Seemless.childObjects.push(propName);
          Seemless.parentObjects.push(objectToRoute);
          restServer.post(routeString, Seemless.dispatchClientAPIPropertyCall);
          //console.log("Added post route " + routeString + " for " + objectToRouteName + "." + propName);

          break;

        }
      case "function":
        {
          if (propName.match(/_seemless_/)) {
            continue;
          }
          routeString = objectToRouteName + "/" + propName;
          Seemless.routes.push(routeString);
          Seemless.childObjects.push(objectToRoute[propName]);
          Seemless.parentObjects.push(objectToRouteName);
          restServer.post(routeString, Seemless.dispatchClientAPICall);
          //console.log("Added post route " + routeString + " for " + objectToRouteName + "." + propName + "()");

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
};

module.exports = Seemless;

var tabCounter = 0;

function getParamNames(func) {
  var funStr = func.toString();
  return funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).match(/([^\s,]+)/g);
}

function generateParameterReplace(params) {

  if (params === null) {
    return "";
  }

  var paramString = "";
  for (var i = 0; i < params.length; i++) {
    paramString += "ajaxURL = ajaxURL.replace(\"/:" + params[i] + "\", " + params[i] + ");\r\n";
  }
  return paramString;
}

function generatePostString(params) {

  if (params === null) {
    return "{}";
  }

  var postString = "{";
  for (var i = 0; i < params.length; i++) {
    postString += "\"" + params[i] + "\" : " + params[i] + ", ";
  }
  postString += "}";
  return postString;
}

function getNodeParams(paramsArray) {
  if (paramsArray === null) {
    return "";
  }
  var paramString = "";
  for (var i = 0; i < paramsArray.length; i++) {
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

var ajaxJqueryString = "reqwest({ " +
  "method: \"POST\"," +
  "url: ajaxURL," +
  "type: \"json\"," +
  "contentType: \"application/json; charset=utf-8\"," +
  "data: JSON.stringify($PARAMS$, null, 2)," +
  "success: $SUCCESSCALLBACK$," +
  "error: $ERRORCALLBACK$" +
  "});\r\n";

var ajaxJquerySyncString = "reqwest({ " +
  "method: \"POST\"," +
  "url: ajaxURL," +
  "type: \"json\"," +
  "contentType: \"application/json; charset=utf-8\"," +
  "data: $PARAMS$," +
  "async: false" +
  "}).request.responseText;\r\n";

function test(x, y) {
  //console.log("in text function");
  return 12;
}
