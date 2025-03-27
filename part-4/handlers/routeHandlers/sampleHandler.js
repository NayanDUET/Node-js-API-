
const handler = {};


handler.sampleHander = (requestProperties,calback)=>{
 
    console.log(requestProperties);
    calback(200,{

         message: 'this is a sample url',
    })

}



module.exports = handler;