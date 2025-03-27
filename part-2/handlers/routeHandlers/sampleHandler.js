
const handler = {};


handler.sampleHander = (requestProperties,calback)=>{
 
    console.log(requestProperties);
    calback(200,{

         message: 'this is a sample url',
    })

}

handler.aboutHandler = (requestProperties,calback)=>{
 
    console.log(requestProperties);
    calback(200,{

         message: 'this is a about page',
    })

}

module.exports = handler;