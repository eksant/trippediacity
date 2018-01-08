'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
  return queryInterface.addColumn('Profits', 'total_netprofit', { type: Sequelize.FLOAT });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Profits', 'total_netprofit');
  }
};
