
//dependency

const crypto = require('crypto');
const enviroments = require('./environment');

const utilities = {};

//parse json to string to object

utilities.ParseJSON = (jsonString)=>
{
      let outPut = {};

      try {
        outPut = JSON.parse(jsonString);
      } catch (error) {
        outPut = {};
      }

      return outPut;
}

utilities.hash = (str)=>
{
      if(typeof str === 'string' && str.length >0)
      {
        const hash = crypto
                  .createHmac('sha256',enviroments.secretkey)
                  .update(str)
                  .digest('hex');
        return hash
      }
      return false;
}

utilities.createRandomString = (strlength)=>
  {
        let length = strlength;
        length = typeof(strlength) == 'number' && strlength>0 ? strlength:false;

        if (length) {
          let possibleChar = 'abcdefghijklmnopqrstuvwxyz0123456789';
          let output = '';
  
          for (let i = 1; i <= length; i++) {
              let randomChar = possibleChar.charAt(Math.floor(Math.random() * possibleChar.length));
              output += randomChar;
          }
  
          return output;
      }
        else{
          return false;
        }
  }



//exports module
module.exports = utilities;