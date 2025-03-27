
//dependencies

const {sampleHander} = require('./handlers/routeHandlers/sampleHandler');
const {userHander} = require('./handlers/routeHandlers/userHandler');
const {tokenHander} = require('./handlers/routeHandlers/tokenHandler');



const routes = {
  
     sample : sampleHander,
     user   : userHander,
     token  : tokenHander
     
    
};

module.exports = routes;