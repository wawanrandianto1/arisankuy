require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      timezone: '+07:00',
      decimalNumbers: true,
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false, // <<<<<<< YOU NEED THIS
      // },
    },
    connectionTimeout: 0,
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: {
      timezone: '+07:00',
      decimalNumbers: true,
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false, // <<<<<<< YOU NEED THIS
      // },
    },
    connectionTimeout: 0,
  },
};
