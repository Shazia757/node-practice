import { createServer } from "http";

const server = createServer((req, res) => {
    if (req.url === '/') {
        res.end('Home Page');
    } else if (req.url === '/users') {
        res.end('Users Page');
    } else {
         res.writeHead(404);
        res.end('Not found');


    }
})

server.listen(3000);