
//dependences

const http = require('http');
const {handelreqres} = require('./helperd/handleReqRes');



const app = {};

app.config = {
    port :3000
};

app.createServer = ()=>
{
      const server = http.createServer(app.handelreqres);
      server.listen(app.config.port,()=> {
          
        console.log(`listening port ${app.config.port}`);
    });
}

//handel request and respons

app.handelreqres = handelreqres;    


//start the server

app.createServer();
