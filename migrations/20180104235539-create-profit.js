'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Profits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      SaleId: {
        type: Sequelize.INTEGER
      },
      no_sale: {
        type: Sequelize.STRING
      },
      payment_sale: {
        type: Sequelize.FLOAT
      },
      no_purchase: {
        type: Sequelize.STRING
      },
      payment_purchase: {
        type: Sequelize.FLOAT
      },
      total_profit: {
        type: Sequelize.FLOAT
      },
      total_slot: {
        type: Sequelize.INTEGER
      },
      profit_slot: {
        type: Sequelize.FLOAT
      },
      user_slot: {
        type: Sequelize.INTEGER
      },
      user_profit: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Profits');
  }
};