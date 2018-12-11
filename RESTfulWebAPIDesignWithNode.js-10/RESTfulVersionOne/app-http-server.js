const http = require('http');
const port = 3001;
const localhost = '127.0.0.1';

// Get Request
function handleGetRequest(req, res) {
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });
    res.end("Get action was requested");
}

// Post Request
function handlePostRequest(req, res) {
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });
    res.end("Post action was requested");
}

// Put Request
function handlePutRequest(req, res) {
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });
    res.end('Put action was requested');
}

// Delete Request
function handleDeleteRequest(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end('Delete action was requested');
}

// Bad Request
function handleBadRequest(req, res) {
    console.log('Unsupported http mehtod');
    res.writeHead(400, {
        'Content-Type': 'text/plain'
    });
    res.end('Bad request');
}

function handleRequest(req, res) {
    switch (req.method) {
        case "GET":
            handleGetRequest(res);
            break;
        case "POST":
            handlePostRequest(res);
            break;
        case "PUT":
            handlePutRequest(res);
            break;
        case "DELETE":
            handleDeleteRequest(res);
            break;

        default:
            handleBadRequest(res);
            break;
    }
    console.log('Request processing completed');
}

http.createServer(handleRequest).listen(port, localhost, () => {
    console.log(`Started Node.js http server at http://${localhost}:${port}`);
})
