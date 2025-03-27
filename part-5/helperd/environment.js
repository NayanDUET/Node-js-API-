
const enviroments = {};

enviroments.staging = {

    port:3000,
    envName:'staging',
    secretkey:'skdurefjsdlfjdls',
    maxCheck :5
}

enviroments.production = {

    port:5000,
    envName:'production',
    secretkey:'akruelsdjfieflsd',
    maxCheck :5
}

//determind which evironment will be passed

const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.trim():'staging';

//export corrosponding environment object

const enviromentToExport = typeof(enviroments[currentEnvironment]) ==='object' ? enviroments[currentEnvironment]:enviroments.staging;

//export module
module.exports = enviromentToExport;