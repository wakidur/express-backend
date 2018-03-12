
/*
// Load HTTP module 

var http = require("http");

// Create HTTP server and listen on port 3300 for requests
http.createServer((request, response) => {
    // set the response HTTP header with HTTP status and content type
    response.writeHead(200, {'Content-Type' : 'text/plain'});

    // send the respons body 'Hello world'
    response.end("Hello World\n");

}).listen(3300);

// Print URL for sccessing server

console.log("Server running at http://127.0.0.1:3300");
*/

// Load HTTP module
var http = require("http");

// Create HTTP server and listen on port 8000 for requests
http.createServer(function(request, response) {

   // Set the response HTTP header with HTTP status and Content type
   response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body "Hello World"
   response.end('Hello World\n');
}).listen(8000);

// Print URL for accessing server
console.log('Server running at http://127.0.0.1:8000/');
