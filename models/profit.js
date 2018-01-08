'use strict';
module.exports = (sequelize, DataTypes) => {
  var Profit = sequelize.define('Profit', {
    UserId: DataTypes.INTEGER,
    SaleId: DataTypes.INTEGER,
    no_sale: DataTypes.STRING,
    payment_sale: DataTypes.FLOAT,
    no_purchase: DataTypes.STRING,
    payment_purchase: DataTypes.FLOAT,
    total_profit: DataTypes.FLOAT,
    total_slot: DataTypes.INTEGER,
    profit_slot: DataTypes.FLOAT,
    user_slot: DataTypes.INTEGER,
    user_profit: DataTypes.FLOAT,
    status: DataTypes.INTEGER,
    sales_tax: DataTypes.FLOAT,
    admin_fee: DataTypes.FLOAT,
    operating_costs: DataTypes.FLOAT,
    total_netprofit: DataTypes.FLOAT,
  });

  Profit.associate = function(models) {
    Profit.belongsTo(models.User)
    Profit.belongsTo(models.Sale)
  }

  return Profit;
};
