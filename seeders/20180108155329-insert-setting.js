'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Settings', [{
      app_name: 'Trippediacity',
      app_copyright: '© 2017 Trippediacity',
      fee_sale:0,
      investment_value: 5000000,
      theme: 'theme-white',
      sales_tax: 0,
      admin_fee: 0,
      operating_costs: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
