
//dependencies

const {sampleHander} = require('./handlers/routeHandlers/sampleHandler');
const {userHander} = require('./handlers/routeHandlers/userHandler');


const routes = {
  
     sample : sampleHander,
     user   :userHander
     
    
}

module.exports = routes;