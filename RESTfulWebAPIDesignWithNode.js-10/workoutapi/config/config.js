const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars

const envVarsSchema = Joi.object({
        NODE_ENV: Joi.string().allow(['development', 'production', 'test', 'provision']).default('development'),
        SERVER_PORT: Joi.number().default(3000),
        MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
            is: Joi.string().equal('development'),
            then: Joi.boolean().default(true),
            otherwise: Joi.boolean().default(false)
        }),
        JWT_SECRET: Joi.string().required().description('JWT Secret required to sign'),
        JWT_EXP: Joi.string().required().description('JWT Secret required to sign'),
        MONGO_HOST: Joi.string().required().description('Mongo DB Local host url'),
        MONGO_HOST_SERVER: Joi.string().required().description('Mongo DB mLab host url'),
        MONGODB_CLUTSER_CONNECT: Joi.string().required().description('Mongo DB Cluster host url'),
        MONGO_PORT: Joi.number().default(27017)
    }).unknown()
    .required();

const {
    error,
    value: envVars
} = Joi.validate(process.env, envVarsSchema);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}
const config = {
    env: envVars.NODE_ENV,
    port: envVars.SERVER_PORT,
    mongooseDebug: envVars.MONGOOSE_DEBUG,
    jwtSecret: envVars.JWT_SECRET,
    jwtEXP: envVars.JWT_EXP,
    frontend: envVars.MEAN_FRONTEND || 'angular',
    mongo: {
        host: envVars.MONGO_HOST,
        hostserver: envVars.MONGO_HOST_SERVER,
        hostcluster: envVars.MONGODB_CLUTSER_CONNECT,
        port: envVars.MONGO_PORT
    }
};

module.exports = config;