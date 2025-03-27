
const data = require('../../lib/data');
const {hash} = require('../../helperd/utilities');
const {createRandomString} = require('../../helperd/utilities');
const {ParseJSON} = require('../../helperd/utilities');


const handler = {};


handler.tokenHander = (requestProperties,callback)=>{
 
    const acceptedMethod = ['get','post','put','delete'];
    if(acceptedMethod.indexOf(requestProperties.method)>-1)
    {
        
         handler._token[requestProperties.method](requestProperties,callback);
    }
    else{
        callback(405);
    }

}


handler._token = {};

handler._token.post =(requestProperties,callback)=>{
      
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

      const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length >0 ? requestProperties.body.password : false;

      if(phone && password)
      {
          data.read('users',phone,(err,userData)=>{
              
            let hashedPassword = hash(password);
            if(hashedPassword === ParseJSON(userData).password)
            {
                let tokenID = createRandomString(20);
                let expires = Date.now() + 60 * 60 * 1000;
                let tokenObject = {
                    
                    phone,
                    'id':tokenID,
                    expires
                }

                //store the token

                data.create('tokens',tokenID,tokenObject,(err2)=>{
                      
                    if(!err2)
                    {
                        callback(200,tokenObject);
                    }else
                    {
                        callback(500,{
                            error:'there was a problem is serverside!',
                       });
                    }
                })
            }
            else
            {
                callback(400,{
                    error:'password is not valid',
               });
            }
          });
      }
      else
      {
        callback(400,{
             error:'you have a problem in your request',
        });
      }

};

handler._token.get = (requestProperties,callback)=>{
     
    //check the id if valid

        const id = typeof(requestProperties.queryObject.id) === 'string' && requestProperties.queryObject.id.trim().length === 20 ? requestProperties.queryObject.id : false;
        
            
        
            if(id)
            {
                data.read('tokens',id,(err,tokenData)=>{
                     
                    const token = { ...ParseJSON(tokenData)}; //spreed operator 
                    
                    if(!err && token)
                    {
                        
                        callback(200,token);
        
                    }else{
                        callback(404,{
                            error:'Requested token was not found2',
                        });
                    }
                })
            }
            else
            {
                callback(404,{
                    error:'Requested token was not found1',
                });
            }
            
    
};


handler._token.put =(requestProperties,callback)=>{
     

    const id = typeof(requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;

    const extend = typeof(requestProperties.body.extend) === 'boolean' && requestProperties.body.extend === true ? true:false;

    console.log(id);
    console.log(extend);
  
    if(id && extend)
    {
        data.read('tokens',id,(err1,tokenData)=>{
            
            let tokenObject = ParseJSON(tokenData)

            if(tokenObject.expires > Date.now())
            {
              tokenObject.expires = Date.now() + 60 * 60 * 1000;

              //store the updated token
              data.update('tokens',id,tokenObject,(err2)=>{
                
                 if(!err2)
                 {
                     callback(200,{
                         mesage:'successfully undated token',
                     })
                 }
                 else
                 {
                    callback(400,{
                        error:'there was a server side error!',
                    });
                 }

              })
            }
            else{
                callback(400,{
                    error:'Token already expaired!',
                });
            }
        });
    }
    else
    {
        callback(400,{
            error:'there was a problem in yourr request!',
        });
    }
    

};


handler._token.delete =(requestProperties,callback)=>{
     
    const id = typeof(requestProperties.queryObject.id) === 'string' && requestProperties.queryObject.id.trim().length === 20 ? requestProperties.queryObject.id: false;
    
        if(id)
        {
    
            //lookup the user
    
            data.read('tokens',id,(err1,tokenData)=>{
                if(!err1 && tokenData)
                {
                     data.delete('tokens',id,(err2)=>{
                        if(!err2)
                        {
                            callback(200,{
                                message:'token was sucessfully deleted',
                            });
                        }
                        else
                        {
                            callback(500,{
                                error:'there was a server side problem2',
                            });
                        }
    
                     });
                }
                else
                {
                    callback(500,{
                        error:'there was a server side problem',
                    });
                }
            });
    
        }
        else
        {
            callback(400,{
                error:'first problem',
            });
        }
    
};


handler._token.varify = (id,phone,callback)=>{

    data.read('tokens',id,(err,tokenData)=>{
         
        if(!err && tokenData)
        {
          if(ParseJSON(tokenData).phone === phone && ParseJSON(tokenData).expires > Date.now())
          {
            callback(true);
          }
          else {
            callback(false);
          }
        }
        else{
          callback(false);
        }
    })
}




module.exports = handler;