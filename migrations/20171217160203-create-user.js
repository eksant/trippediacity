'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      username: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.INTEGER,
      },
      gender: {
        type: Sequelize.INTEGER,
      },
      mobile_no: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.TEXT,
      },
      photo: {
        type: Sequelize.STRING,
      },
      company_name: {
        type: Sequelize.STRING,
      },
      company_phone: {
        type: Sequelize.STRING,
      },
      company_address: {
        type: Sequelize.TEXT,
      },
      reset_password_token: {
        type: Sequelize.STRING,
      },
      reset_password_expires: {
        type: Sequelize.DATE,
      },
      wallet: {
        type: Sequelize.FLOAT,
      },
      bank_name: {
        type: Sequelize.STRING,
      },
      bank_account: {
        type: Sequelize.STRING,
      },
      bank_number: {
        type: Sequelize.STRING,
      },
      investment_value: {
        type: Sequelize.FLOAT,
      },
      investment_slot: {
        type: Sequelize.INTEGER,
      },
      investment_total: {
        type: Sequelize.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  },
};
