
//dependencies

const {sampleHander} = require('./handlers/routeHandlers/sampleHandler');
const {userHander} = require('./handlers/routeHandlers/userHandler');
const {tokenHander} = require('./handlers/routeHandlers/tokenHandler');
const {checkHandler} = require('./handlers/routeHandlers/checkHandler.js');




const routes = {
  
     sample : sampleHander,
     user   : userHander,
     token  : tokenHander,
     check  : checkHandler
     
    
};

module.exports = routes;