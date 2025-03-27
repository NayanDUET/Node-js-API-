
const handler = {};


handler.notFoundHandler = (requestProperties,calback)=>{
 

     calback(404,
        {
             message:'404 not found',
});

}

module.exports = handler;