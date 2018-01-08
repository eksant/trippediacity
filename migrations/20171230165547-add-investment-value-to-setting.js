'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
  return queryInterface.addColumn('Settings', 'investment_value', { type: Sequelize.FLOAT });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Settings', 'investment_value');
  }
};
