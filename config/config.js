module.exports = {
  development: {
    username: 'postgres',
    password: 'P@ssw0rd',
    database: 'trippediacity',
    host: '127.0.0.1',
    dialect: 'postgres',
    pool: {
      min: 0,
      max: 5,
      acquire: 3000,
      idle: 1000,
    },
  },
  production: {
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    dialect: 'postgres',
    ssl: true,
    dialectOptions: { ssl: { require: true } },
    pool: {
      min: 0,
      max: 5,
      acquire: 3000,
      idle: 1000,
    },
  },
};
