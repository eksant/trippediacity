'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Settings', 'fee_sale', { type: Sequelize.FLOAT });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Settings', 'fee_sale');
  }
};
