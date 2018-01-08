'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('Profits', 'sales_tax', { type: Sequelize.FLOAT }),
      queryInterface.addColumn('Profits', 'admin_fee', { type: Sequelize.FLOAT }),
      queryInterface.addColumn('Profits', 'operating_costs', { type: Sequelize.FLOAT }),
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('Profits', 'sales_tax'),
      queryInterface.removeColumn('Profits', 'admin_fee'),
      queryInterface.removeColumn('Profits', 'operating_costs'),
    ];
  }
};
