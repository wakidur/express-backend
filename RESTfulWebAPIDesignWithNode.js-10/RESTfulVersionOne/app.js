const http = require('http');
http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type' : 'text/plain'
    });
    res.end(`Hello from Node.JS`);
    console.log(`Hello handler requested`);
}).listen(3000, "127.0.0.1", () => {
    console.log(`Started Node.js http server at http://127.0.0.1:3000`);
});