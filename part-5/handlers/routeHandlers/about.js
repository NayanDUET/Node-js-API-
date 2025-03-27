
const handler = {};


handler.about = (requestProperties,calback)=>{
 
    console.log(requestProperties);
    calback(200,{

         message: 'this is a about page',
    })

}

module.exports = handler;