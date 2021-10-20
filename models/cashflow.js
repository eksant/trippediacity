'use strict';
const getDescription = require('../helpers/getCashflow');

module.exports = (sequelize, DataTypes) => {
  var Cashflow = sequelize.define('Cashflow', {
    UserId: DataTypes.INTEGER,
    code: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    no_transaction: DataTypes.STRING,
    value: DataTypes.FLOAT,
    saldo: DataTypes.FLOAT,
    deduct_profit: DataTypes.FLOAT,
    table_id: DataTypes.INTEGER,
  });

  Cashflow.prototype.getDescription = function () {
    return getDescription(this.code);
  };

  Cashflow.associate = function (models) {
    Cashflow.belongsTo(models.User);
  };

  return Cashflow;
};
