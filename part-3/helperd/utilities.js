
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



//exports module
module.exports = utilities;