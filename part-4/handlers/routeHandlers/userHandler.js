
const data = require('../../lib/data');
const {hash} = require('../../helperd/utilities');
const {ParseJSON} = require('../../helperd/utilities');
const tokenHander = require('./tokenHandler')


const handler = {};


handler.userHander = (requestProperties,callback)=>{
 
    const acceptedMethod = ['get','post','put','delete'];
    if(acceptedMethod.indexOf(requestProperties.method)>-1)
    {
        
         handler._users[requestProperties.method](requestProperties,callback);
    }
    else{
        callback(405);
    }

}


handler._users = {};

handler._users.post =(requestProperties,callback)=>{
      
      const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length>0 ? requestProperties.body.firstName : false;

      const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length>0 ? requestProperties.body.lastName : false;


      const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

      const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length >0 ? requestProperties.body.password : false;

      const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'boolean' ? requestProperties.body.tosAgreement : false;


      if(firstName && lastName && phone && password && tosAgreement)
      {
        //make sure that the user doesn't exist

        data.read('users',phone,(err1)=>{
             
            if(err1)
            {
               let userObject = {
                  firstName,
                  lastName,
                  phone,
                  password: hash(password),
                  tosAgreement
               };
              
               data.create('users',phone,userObject,(err2)=>{
                   if(!err2)
                   {
                     callback(200,{
                          message:'user was created successfully!',
                     });
                   }
                   else
                   {
                     callback(500,{error:'could not create user !'});
                   }
               });

            }else
            {
                callback(500,{
                    error:'There was a problem in server side',
                });
            }
            
        });
      }else{
         callback(400,{
              error:'you have a problem in your request',
         });
      }



};

handler._users.get = (requestProperties,callback)=>{
     
    const phone = typeof(requestProperties.queryObject.phone) === 'string' && requestProperties.queryObject.phone.trim().length === 11 ? requestProperties.queryObject.phone: false;

    

    if(phone)
    {
        //varity token
        
         let token = typeof(requestProperties.headerObject.token) === 'string' ? requestProperties.headerObject.token : false;

         tokenHander._token.varify(token,phone,(tokenID)=>{
              
            if(tokenID)
            { 
                data.read('users',phone,(err,u)=>{
             
                    const user = { ...ParseJSON(u)}; //spreed operator 
                    /* 
        
                      {name:'nayan',age:23,gender:'male'}
        
                    */
                    if(!err && user)
                    {
                        delete user.password;
                        callback(200,user);
        
                    }else{
                        callback(404,{
                            error:'Requested user was not found2',
                        });
                    }
                });     
                
            }else
            {
                callback(404,{
                     error:'Authontication faild!',
                });
            }
         });

        
    }
    else
    {
        callback(404,{
            error:'when phone will be false',
        });
    }
    
};


handler._users.put =(requestProperties,callback)=>{
     
    const phone = typeof(requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;


    const firstName = typeof(requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length>0 ? requestProperties.body.firstName : false;

    const lastName = typeof(requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length>0 ? requestProperties.body.lastName : false;


    const password = typeof(requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length >0 ? requestProperties.body.password : false;
    

    if(phone)
    {
        if(firstName || lastName || password)
        {

            //lookup the user

            let token = typeof(requestProperties.headerObject.token) === 'string' ? requestProperties.headerObject.token : false;

            tokenHander._token.varify(token,phone,(tokenID)=>{
                 
               if(tokenID)
               { 
                data.read('users',phone,(err,uData)=>{

                    const userData = {...ParseJSON(uData)};
    
                    if(!err && userData)
                    {
                        if(firstName)
                        {
                            userData.firstName = firstName;
                        }
                        if(lastName)
                        {
                            userData.lastName = lastName;
                        }
                        if(password)
                        {
                            userData.password = hash(password);
                        }
    
                        data.update('users',phone,userData,(err)=>{
                             
                            if(!err)
                            {
                                 callback(200,{
                                     message:'User was updated successfully',
                                 });
                            }else
                            {
                                callback(500,{
                                    error:'updating problem showing!',
                                }); 
                            }
                        });
                        
                    }
                    else
                    {
                        callback(400,{
                            error:'you have a problem on your request2!',
                        });
                    }
                });   
                   
               }else
               {
                   callback(404,{
                        error:'Authontication faild!',
                   });
               }
            });

            

        }
        else
        {
            callback(400,{
                error:'you have a problem on your request1!',
            });
        }

    }
    else
    {
        callback(400,{
            error:'Invalid phone number. Please try again!',
        });
    }


};


handler._users.delete =(requestProperties,callback)=>{
     
    const phone = typeof(requestProperties.queryObject.phone) === 'string' && requestProperties.queryObject.phone.trim().length === 11 ? requestProperties.queryObject.phone: false;

    if(phone)
    {

        //lookup the user
        let token = typeof(requestProperties.headerObject.token) === 'string' ? requestProperties.headerObject.token : false;

        tokenHander._token.varify(token,phone,(tokenID)=>{
             
           if(tokenID)
           { 
            data.read('users',phone,(err1,userData)=>{
                if(!err1 && userData)
                {
                     data.delete('users',phone,(err2)=>{
                        if(!err2)
                        {
                            callback(200,{
                                message:'User was sucessfully deleted',
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
               
           }else
           {
               callback(404,{
                    error:'Authontication faild!',
               });
           }
        });


        

    }
    else
    {
        callback(400,{
            error:'there was an problem in your request!',
        });
    }
};




module.exports = handler;