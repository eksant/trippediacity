'use strict';
module.exports = (sequelize, DataTypes) => {
  var Log = sequelize.define('Log', {
    username: DataTypes.STRING,
    ip_address: DataTypes.STRING,
    last_login: DataTypes.DATE,
    status: DataTypes.STRING,
    remark: DataTypes.TEXT
  });
  return Log;
};