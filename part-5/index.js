
//dependences

const http = require('http');
const {handelreqres} = require('./helperd/handleReqRes');
const enviroment = require('./helperd/environment');
const data = require('./lib/data');



const app = {};

//testing file system (pore muche dibo)


//data.create('test','newFile',{name:'Bangladesh',langulage:'Bangla'},(err)=>{
      // console.log(`error was `,err);
//})

//data.read('test','newFile',(err,data)=>{
  //console.log(err,data);
//})

//data.update('test','file',{name:'India',langulage:'hindi'},(err)=>{
     // console.log(err);
//})

//data.delete('test','file',(err)=>{
  //console.log(err);
//})


app.createServer = ()=>
{
      const server = http.createServer(app.handelreqres);
      server.listen(enviroment.port,()=> {
           
        //console.log(`the enviroment variable is is is ${process.env.NODE_ENV}`) 
        console.log(`listening port ${enviroment.port}`);
    });
}

//handel request and respons

app.handelreqres = handelreqres;    


//start the server

app.createServer();
