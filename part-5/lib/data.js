

//dependencess

const { dir } = require('console');
const fs = require('fs');
const path = require('path');

const lib = {};

//base diretory of the data folder

lib.basedir = path.join(__dirname,'/../.data/');

lib.create = (dir,file,data,callback)=>{
      //opne file for writing

      fs.open(`${lib.basedir+dir}/${file}.json`,'wx',(err,fileDescriptor)=>{
           
        if(!err && fileDescriptor)
        {
            const stringData = JSON.stringify(data);
            //write the data to file and close it

            fs.writeFile(fileDescriptor,stringData,(err2)=>{
                   if(!err2)
                   {
                    fs.close(fileDescriptor,(err3)=>{
                          if(!err3)
                          {
                              callback(false);
                          }
                          else
                          {
                             callback('Error closing the new file');
                          }
                    })

                   }
                   else{
                       callback('error to writing to new file');
                   }
            })
             
        }else{
            callback('could not create new file or already exists');
        }
           
      })
}

lib.read = (dir,file,callback)=>{
    
   fs.readFile(`${lib.basedir+dir}/${file}.json`,'utf-8',(err,data)=>{
       
      callback(err,data);

   })
}

//update existing file

lib.update = (dir,file,data,callback)=>{
      //file open for writing

      fs.open(`${lib.basedir+dir}/${file}.json`,'r+',(err,fileDescriptor)=>{
          
        if(!err && fileDescriptor)
        {
            const stringData = JSON.stringify(data);
            //truncate the file
            fs.ftruncate(fileDescriptor,(err)=>{
                  if(!err)
                  {
                        //write the file and close it
                        fs.writeFile(fileDescriptor,stringData,(err2)=>
                        {
                             if(!err2)
                                {
                                  //file close
                                  fs.close(fileDescriptor,(err3)=>{
                                      if(!err3)
                                      {
                                         callback(false);
                                      }
                                      else{
                                         callback('Error closing file');
                                      }
                                  })
                                } else{

                                    callback('Error writing to file');
                                }
                        });
                  }
                  else
                  {
                    callback('Error truncate file');
                  }
            });
        }
        else{
            callback('Error while file truncate ');
        }
      }); 
}

//delete existing file

lib.delete = (dir,file,callback)=>
{
     //unlik file

     fs.unlink(`${lib.basedir+dir}/${file}.json`,(err)=>{
        
         if(!err)
         {
            callback(false);
         }
         else
         {
             callback('Error Deleting file');
         }

     });
}



module.exports = lib;