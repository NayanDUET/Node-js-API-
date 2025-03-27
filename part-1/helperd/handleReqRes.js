

//dependacy
const url = require('url');
const {StringDecoder} = require('string_decoder');
const routes = require('../routes');
const {notFoundHandler} = require('../handlers/routeHandlers/notFound');

handler = {};

handler.handelreqres = (req,res)=>{

     const parseUrl = url.parse(req.url,true);
     const path = parseUrl.pathname;
     const trimmepath = path.replace(/^\/+|\/+$/g,'');
     const methodd = req.method.tolowerCase;
     const queryObject = parseUrl.query;
     const headerObject = req.headers;

     const requestProperties = {

           parseUrl,
           path,
           trimmepath,
           methodd,
           queryObject,
           headerObject,

     }
      
     const decoder = new StringDecoder('utf-8');

     let realData = '';

     const chosenHandler = routes[trimmepath] ? routes[trimmepath]:notFoundHandler;

     chosenHandler(requestProperties,(statusCode, payload)=> {
              
        statusCode = typeof statusCode === 'number' ? statusCode:500;
        payload = typeof payload === 'object' ? payload : {};

        const payloadString = JSON.stringify(payload);

        //returen the final response

        res.writeHead(statusCode);
        res.end(payloadString);

     })

     req.on('data',(buffer)=> {
         
        realData += decoder.write(buffer);
     });

     req.on('end',()=>{
         
        realData += decoder.end();
        console.log(realData);
        res.end('hello world');

     });
    
}


module.exports = handler;