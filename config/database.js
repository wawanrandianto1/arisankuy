require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    // dialectOptions: {
    //   timezone: '+07:00',
    //   decimalNumbers: true,
    // },
    connectionTimeout: 0,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    // dialectOptions: {
    //   timezone: '+07:00',
    //   decimalNumbers: true,
    // },
    connectionTimeout: 0,
  },
};
