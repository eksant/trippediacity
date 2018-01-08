'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Sales', 'price', { type: Sequelize.FLOAT });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Sales', 'price');
  }
};
