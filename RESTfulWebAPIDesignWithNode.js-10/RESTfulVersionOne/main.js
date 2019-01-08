const http = require('http');

const port = 3000;
const localhost = '127.0.0.1';
const httpModule = require('./http-module');

http.createServer(httpModule.handleRequest).listen(port, localhost, () => {
    console.log(`Started Node.js http server at http://${localhost}:${port}`);
})
