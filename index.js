// Import required modules
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;


// Create server instance
const server = http.createServer(serverCommunicationHandler);
server.listen(3000, function() {
    console.log("Node server listenning at port 3000");
});




/**
 * Function handles the server communication
 */
function serverCommunicationHandler(req, res) {
    var parsedUrl = url.parse(req.url, true);
    var pathName = parsedUrl.pathname;
    var trimmedPath = pathName.replace(/\//,"");
    var response = "";
    response += "PathName: " + trimmedPath;
    response += "\n Query String: "+JSON.stringify(parsedUrl.query);
    response += "\n Method: "+req.method;
    response += "\n Headers: "+req.headers;

    var buffer = "";
    var stringDecoder = new StringDecoder("utf-8");
    //req event handlers
    req.on("data", function(data) {
        buffer += stringDecoder.write(data);
    });

    // end event fired when request payload completed.
    req.on("end", function() {
        buffer += stringDecoder.end();
        response += "\nPayload: "+ buffer;

        var selectedRouter = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        var dataToSendToRouter = {
            'trimmedPath': trimmedPath,
            'queryString': parsedUrl.query,
            'method': req.method,
            'headers': req.headers,
            'payload': buffer
        };
        selectedRouter(dataToSendToRouter, function(statusCode, payload) {
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
            payload = typeof(payload) === 'object' ? payload : {};

            var responsePayload = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(responsePayload);
            console.log("Returning this response: "+ responsePayload);
        });
    });  
}


var handlers = {};
handlers.hello = function(data, callback) {
    callback(406, {
        "message": "Hello! You are welcome!"
    });
};
handlers.notFound = function(data, callback) {
    callback(404);
};

var router = {
    "hello": handlers.hello
};