const { APP_ENV = 'test' } = process.env;
const envConfig = require(`./${APP_ENV}.json`);

module.exports = envConfig;
