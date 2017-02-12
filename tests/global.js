
var testAPI = {


}

module.exports = testAPI;

function getAPIObject() {

  function buildAPI() {
    return {
      Math: {
        add: function(a,b) {
          return a + b;
        },
        multiple: function(a, b) {
          return a * b;
        }
      },
      Strings: {
        concat: function(a, b) {
          return a + b;
        }
      },
      Objects: {
        getgenericobject: function() {
          return {"name": "object"};
        }
      }
    }
  };

  // Insert your fixture code here.
  // Make sure you're creating fresh objects each
  // time setup() is called.
  return buildAPI();
};

function createHTTTPServer(port, assert, callBack) {
  const http = require('http');
  if(port === undefined) { port = 8080; }

  // Create an HTTP server
  var srv = http.createServer();

  //Lets start our server
  srv.listen(port, function(){
      //Callback triggered when server is successfully listening.
      if(assert) { assert.comment("Server listening on port", port); }
      if(callBack) {
        callBack();
      }
  });
  return srv;
}

function closeHTTPServer(server, assert) {
  if(assert) { assert.comment("Closed Server"); }
  server.close();
}

function getURL(options, assert, callBack) {
    if(assert) { assert.comment("Getitng URL: " + options); }
    var http = require('http');
    http.get(options, (res) => {
      const statusCode = res.statusCode;
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode !== 200) {
        error = new Error(`Request Failed.\n` +
                          `Status Code: ${statusCode}`);
      }
      if (error) {
        callBack(error);
        // consume response data to free up memory
        res.resume();
        return;
      }

      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => rawData += chunk);
      res.on('end', () => {
        try {
          let parsedData = JSON.parse(rawData);
          callBack(null, parsedData);
        } catch (e) {
          callBack(e);
        }
      });
    }).on('error', (e) => {
      callBack(e);
    });
};