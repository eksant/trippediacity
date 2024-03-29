'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.APP_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// fs.readdirSync(__dirname)
//   .filter((file) => {
//     return (
//       file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
//     );
//   })
//   .forEach((file) => {
//     var model = sequelize['import'](path.join(__dirname, file));
//     db[model.name] = model;
//   });

// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Agent = require('./agent')(sequelize, Sequelize);
db.Cashflow = require('./cashflow')(sequelize, Sequelize);
db.Customer = require('./customer')(sequelize, Sequelize);
db.Log = require('./log')(sequelize, Sequelize);
db.Profile = require('./profile')(sequelize, Sequelize);
db.Profit = require('./profit')(sequelize, Sequelize);
db.Purchase = require('./purchase')(sequelize, Sequelize);
db.Sale = require('./sale')(sequelize, Sequelize);
db.Setting = require('./setting')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
