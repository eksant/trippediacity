'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('Settings', 'sales_tax', { type: Sequelize.INTEGER }),
      queryInterface.addColumn('Settings', 'admin_fee', { type: Sequelize.INTEGER }),
      queryInterface.addColumn('Settings', 'operating_costs', { type: Sequelize.INTEGER }),
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('Settings', 'sales_tax'),
      queryInterface.removeColumn('Settings', 'admin_fee'),
      queryInterface.removeColumn('Settings', 'operating_costs'),
    ];
  }
};
