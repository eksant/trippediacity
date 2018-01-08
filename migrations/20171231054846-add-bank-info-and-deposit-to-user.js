'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('Users', 'bank_name', { type: Sequelize.STRING }),
      queryInterface.addColumn('Users', 'bank_account', { type: Sequelize.STRING }),
      queryInterface.addColumn('Users', 'bank_number', { type: Sequelize.STRING }),
      queryInterface.addColumn('Users', 'investment_value', { type: Sequelize.FLOAT }),
      queryInterface.addColumn('Users', 'investment_slot', { type: Sequelize.INTEGER }),
      queryInterface.addColumn('Users', 'investment_total', { type: Sequelize.FLOAT }),
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('Users', 'bank_name'),
      queryInterface.removeColumn('Users', 'bank_account'),
      queryInterface.removeColumn('Users', 'bank_number'),
      queryInterface.removeColumn('Users', 'investment_value'),
      queryInterface.removeColumn('Users', 'investment_slot'),
      queryInterface.removeColumn('Users', 'investment_total'),
    ];
  }
};
