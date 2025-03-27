
const http = require('http');
const { chunk } = require('lodash');

const server = http.createServer((req,res)=>
{

           if(req.url === '/')
           {
              
            res.write('<html><head><title></title></head></html>');
            res.write('<body><form method = "post" action = "/about"> <input name = "message"></form></body>');
              res.end();
           }
           else if(req.url == '/about' && req.method === 'POST')
           {

            req.on('data',(chunk)=>
            {
                console.log(chunk.toString());
            })
            res.write("Thanks for submetting");
            res.end();
           }
           else 
           {
            res.write("Not found");
           res.end();
           }


});
server.listen(3000);
console.log("lisinig on port 3000");








