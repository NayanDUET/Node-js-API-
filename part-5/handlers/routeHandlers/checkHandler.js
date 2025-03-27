
const data = require('../../lib/data');
const {hash} = require('../../helperd/utilities');
const {ParseJSON,createRandomString} = require('../../helperd/utilities');
const tokenHander = require('./tokenHandler');
const {maxCheck} = require('../../helperd/environment');
const { method } = require('lodash');


const handler = {};


handler.checkHandler = (requestProperties,callback)=>{
 
    const acceptedMethod = ['get','post','put','delete'];
    if(acceptedMethod.indexOf(requestProperties.method)>-1)
    {
        
         handler._check[requestProperties.method](requestProperties,callback);
    }
    else{
        callback(405);
    }

}


handler._check = {};

handler._check.post =(requestProperties,callback)=>{
      
    //validate inputs

    const protocol = typeof(requestProperties.body.protocol) === 'string' && ['http','https'].includes(requestProperties.body.protocol)> -1 ? requestProperties.body.protocol : false;

    const url = typeof(requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length>0 ? requestProperties.body.url : false;

    const method = typeof(requestProperties.body.method) === 'string' && ['GET','POST','PUT','DELETE'].includes(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    const successCode = typeof(requestProperties.body.successCode) === 'object' && requestProperties.body.successCode instanceof Array ? requestProperties.body.successCode : false;

    const timeoutSeconds = typeof(requestProperties.body.timeoutSeconds) === 'number' && requestProperties.body.timeoutSeconds %1 ===0 &&  requestProperties.body.timeoutSeconds >= 1  && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;

   
     if(protocol && url && method && successCode && timeoutSeconds)
     {

        let token = typeof(requestProperties.headerObject.token) === 'string' ? requestProperties.headerObject.token : false;

        //lookup the user phone by reading the token

        data.read('tokens',token,(err1,tokenData)=>{
             
              if(!err1 && tokenData)
              {
                 let userPhone = ParseJSON(tokenData).phone;
                 // lookup the user data
                 data.read('users',userPhone,(err2,userData)=>{
                     if(!err2 && userData)
                     {
                        tokenHander._token.varify(token,userPhone,(tokenIsValid)=>{
                            
                            if(tokenIsValid)
                            {
                                let userObject = ParseJSON(userData);
                                let userCheck = typeof(userObject.checks) ==='object' && userObject.checks instanceof Array ? userObject.checks : [];

                                if(userCheck.length < maxCheck)
                                {
                                    let checkID = createRandomString(20);
                                    let  checkObject = {
                                         'id':checkID,
                                         userPhone,
                                         protocol,
                                         url,
                                         method,
                                         successCode,
                                         timeoutSeconds

                                    };

                                    //save the data

                                    data.create('checks',checkID,checkObject,(err3)=>{
                                         
                                        if(!err3)
                                        {
                                           //add check id to the user object
                                           userObject.checks = userCheck;
                                           userObject.checks.push(checkID);

                                           //save the new user data

                                           data.update('users',userPhone,userObject,(err4)=>{
                                              if(!err4)
                                              {
                                                //return the data about the new check
                                                callback(200,checkObject);

                                              }
                                              else
                                              {
                                                callback(500,{
                                                    error:'There was a problem in server side',
                                              }); 
                                              }
                                           })

                                        }else
                                        {
                                            callback(500,{
                                                error:'There was a problem in server side',
                                          });  
                                        }
                                    })

                                }
                                else{

                                    callback(403,{
                                        error:'User already reached max check limits!',
                                  });
                                }
                            }
                            else
                            {
                                callback(403,{
                                    error:'User not found!',
                              });
                            }
                        });
                     }
                     else
                     {
                        callback(403,{
                            error:'User not found!',
                      });
                     }
                 });
              }
              else
              {
                callback(403,{
                    error:'Authentication problem!',
              });
              }
        });
         
     }
     else
     {
        callback(400,{
              error:'you have a problem in your request first!',
        });
     }

};

handler._check.get = (requestProperties,callback)=>{
     
    const id = typeof(requestProperties.queryObject.id) === 'string' && requestProperties.queryObject.id.trim().length === 20 ? requestProperties.queryObject.id : false;

    if(id)
    {
        //lookup the check

        data.read('checks',id,(err,checkData)=>{
                 
            if(!err && checkData)
            {
                let token = typeof(requestProperties.headerObject.token) === 'string' ? requestProperties.headerObject.token : false;

                
                tokenHander._token.varify(token,ParseJSON(checkData).userPhone,(tokenIsValid)=>{
                            
                    if(tokenIsValid)
                    {
                          callback(200,ParseJSON(checkData));
                    }
                    else
                    {
                        callback(403,{
                            error:'Authontication faild',
                        });
                    }

                });


            }
            else{

                callback(400,{
                    error:'you have a problem in your request first!',
                });
            }
        });

    }
    else
    {
        callback(400,{
            error:'you have a problem in your request first!',
        });
    }
    
};


handler._check.put =(requestProperties,callback)=>{
     
    const id = typeof(requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;


    const protocol = typeof(requestProperties.body.protocol) === 'string' && ['http','https'].includes(requestProperties.body.protocol)> -1 ? requestProperties.body.protocol : false;

    const url = typeof(requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length>0 ? requestProperties.body.url : false;

    const method = typeof(requestProperties.body.method) === 'string' && ['GET','POST','PUT','DELETE'].includes(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    const successCode = typeof(requestProperties.body.successCode) === 'object' && requestProperties.body.successCode instanceof Array ? requestProperties.body.successCode : false;

    const timeoutSeconds = typeof(requestProperties.body.timeoutSeconds) === 'number' && requestProperties.body.timeoutSeconds %1 ===0 &&  requestProperties.body.timeoutSeconds >= 1  && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;


    if(id)
    {
       if(protocol && url && method && successCode && timeoutSeconds)
       {
           data.read('checks',id,(err1,checkData)=>{
              if(!err1 && checkData)
              {
                 let checkObject = ParseJSON(checkData);
                 let token = typeof(requestProperties.headerObject.token) === 'string' ? requestProperties.headerObject.token : false;

                 tokenHander._token.varify(token,checkObject.userPhone,(tokenIsValid)=>{
                            
                    if(tokenIsValid)
                    {
                        if(protocol)
                        {
                        checkObject.protocol = protocol;
                        }
                        if(url)
                        {
                        checkObject.url = url;
                        }
                        if(method)
                        {
                            checkObject.method = method;
                        }
                        if(successCode)
                        {
                            checkObject.successCode = successCode;
                        }
                        if(timeoutSeconds)
                        {
                            checkObject.timeoutSeconds = timeoutSeconds;
                        }

                        //store the checkObject

                        data.update('checks',id,checkObject,(err2)=>{
                          
                            if(!err2)
                            {
                                callback(200,{
                                    message:'Successfully updated',
                                });
                            }
                            else{

                                callback(500,{
                                    error:'there was a server side error!',
                                });
                            }

                        });
                    }
                    else
                    {
                        callback(403,{
                            error:'Authontication faild',
                        });
                    }

                });


              }
              else
              {
                callback(400,{
                    error:'there was a error in server side!',
                });
              }
           });
       }
       else
       {
        callback(400,{
            error:'you have to update data but may be false data come!',
        });
       }
    }
    else{
        callback(400,{
            error:'id is false so occurs error!',
        });
    }




};


handler._check.delete =(requestProperties,callback)=>{
     

    const id = typeof(requestProperties.queryObject.id) === 'string' && requestProperties.queryObject.id.trim().length === 20 ? requestProperties.queryObject.id : false;

    if(id)
    {
        //lookup the check

        data.read('checks',id,(err1,checkData)=>{
                 
            if(!err1 && checkData)
            {
                let token = typeof(requestProperties.headerObject.token) === 'string' ? requestProperties.headerObject.token : false;

                
                tokenHander._token.varify(token,ParseJSON(checkData).userPhone,(tokenIsValid)=>{
                            
                    if(tokenIsValid)
                    {
                          //delete the check data

                          data.delete('checks',id,(err2)=>{
                            
                            if(!err2)
                            {

                                data.read('users',ParseJSON(checkData).userPhone,(err3,userData)=>{

                                    let userObject = ParseJSON(userData);

                                    if(!err3 && userData)
                                    {

                                        let userCheck = typeof(userObject.checks) =='object' && userObject.checks instanceof Array ? userObject.checks : [];
                                        
                                        //remove the deleted id form user's list of checks

                                        let checkPosition = userCheck.indexOf(id);
                                        if(checkPosition > -1)
                                        {
                                           userCheck.splice(checkPosition,1);
                                           //resave the user data
                                           userObject.checks = userCheck;
                                           data.update('users',userObject.phone,userObject,(err4)=>{

                                            if(!err4)
                                            {
                                                callback(200);
                                            }
                                            else
                                            {
                                                callback(500,{
                                                    error:'serside errors',
                                                });
                                            }

                                           });
                                        }
                                        else
                                        {
                                            callback(500,{
                                                error:'check id that you are trying to remove is not found in user',
                                            });

                                        }
                                         
                                    }
                                    else
                                    {
                                        callback(500,{
                                            error:'serside errors',
                                        });
                                    }

                                });

                            }
                            else
                            {
                                callback(403,{
                                    error:'serside errors',
                                });
                            }

                          });
                    }
                    else
                    {
                        callback(403,{
                            error:'Authontication faild',
                        });
                    }

                });


            }
            else{

                callback(400,{
                    error:'you have a problem in your request first!',
                });
            }
        });

    }
    else
    {
        callback(400,{
            error:'you have a problem in your request first!',
        });
    }

};




module.exports = handler;