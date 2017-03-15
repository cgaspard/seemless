var test = require('tape');

// const before = test;
// const after = test;

// test('Create Create API Objects With All Parameters', function (assert) {
//   var seemless = require("../src/lib/seemless.js");
//   var api = getAPIObject();
//   var srv = createHTTTPServer(8080, assert, function () {
//     try {
//       seemless.generateRoutesForClientAPIAccess('/api/framework', api, "api", srv, "/api/");
//     } catch (ex) {
//       assert.fail("Failed to create routes on http server:", ex);
//       srv.close();
//       assert.end();
//     }
//     srv.close();
//     assert.pass();
//     assert.end();
//   });
// });

// test('Create Create API Objects With No Prefix', function (assert) {
//   var seemless = require("../src/lib/seemless.js");
//   var api = getAPIObject();
//   var srv = createHTTTPServer(8080, assert, function () {
//     try {
//       seemless.generateRoutesForClientAPIAccess('/api/framework', api, "api", srv);
//     } catch (ex) {
//       srv.close();
//       assert.fail("Failed to create routes on http server:", ex);
//       assert.end();
//     }

//     srv.close();
//     assert.pass();
//     assert.end();
//   });
// });

// test('Client Side API File Created', function (assert) {
//   var seemless = require("../src/lib/seemless.js");
//   var api = getAPIObject();
//   var srv = createHTTTPServer(8080, assert, function () {
//     try {
//       // assert.comment(srv);
//       seemless.generateRoutesForClientAPIAccess('/api/framework', api, "api", srv, "/test");
//       getURL("http://localhost:8080/api/framework", assert, function (err, result) {
//         assert.comment("Done Making URL Request");
//         if (err) {
//           assert.fail(err);
//         } else {
//           if (result.length > 0) {
//             assert.pass();
//           } else {
//             assert.fail("Nothing was returned.");
//           }
//         }
//         srv.close();
//         assert.end();
//       });
//     } catch (ex) {
//       srv.close();
//       assert.fail(ex);
//       assert.end()
//     }
//   });
// });

  test('Failure example', function (assert) {
      assert.fail("Failed for testing");
      assert.end();
  });


function getAPIObject() {

  function buildAPI() {
    return {
      Math: {
        add: function (a, b) {
          return a + b;
        },
        multiple: function (a, b) {
          return a * b;
        }
      },
      Strings: {
        concat: function (a, b) {
          return a + b;
        }
      },
      Objects: {
        getgenericobject: function () {
          return { "name": "object" };
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
  if (port === undefined) { port = 8080; }

  // Create an HTTP server
  var srv = http.createServer();

  //Lets start our server
  srv.listen(port, function (innerCallBack) {
    return function () {
      //Callback triggered when server is successfully listening.
      if (assert) { assert.comment("Server listening on port " + port); }
      if (innerCallBack) {
        innerCallBack();
      }
    }
  }(callBack));
  return srv;
}

function closeHTTPServer(server, assert) {
  if (assert) { assert.comment("Closed Server"); }
  server.close();
}

function destructor(params) {
  for (var i = 0; i < params.length; i++) {
    params[i] = null;
  }
}

function getURL(options, assert, callBack) {
  // if(assert) { assert.comment("Getitng URL: " + options); }
  var http = require('http');
  http.get(options, function (res) {
    if (assert) { assert.comment("Getting Response: " + options); }
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
    res.on('data', function (chunk) {
      rawData += chunk;
    });
    res.on('end', () => {
      try {
        // let parsedData = JSON.parse(rawData);
        callBack(null, rawData);
      } catch (e) {
        callBack(e);
      }
    });
  }).on('error', (e) => {
    callBack(e);
  }).end();
};