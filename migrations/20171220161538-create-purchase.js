'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Purchases', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        type: Sequelize.INTEGER,
      },
      AgentId: {
        type: Sequelize.INTEGER,
      },
      no_invoice: {
        type: Sequelize.STRING,
      },
      category: {
        type: Sequelize.INTEGER,
      },
      booking_id: {
        type: Sequelize.STRING,
      },
      hotel_name: {
        type: Sequelize.STRING,
      },
      hotel_address: {
        type: Sequelize.TEXT,
      },
      hotel_phone: {
        type: Sequelize.STRING,
      },
      hotel_note: {
        type: Sequelize.TEXT,
      },
      hotel_startdate: {
        type: Sequelize.DATE,
      },
      hotel_enddate: {
        type: Sequelize.DATE,
      },
      flightdeparture_airlinebook: {
        type: Sequelize.STRING,
      },
      flightdeparture_airlinename: {
        type: Sequelize.STRING,
      },
      flightdeparture_startdate: {
        type: Sequelize.DATE,
      },
      flightdeparture_enddate: {
        type: Sequelize.DATE,
      },
      flightdeparture_airportfrom: {
        type: Sequelize.STRING,
      },
      flightdeparture_airportto: {
        type: Sequelize.STRING,
      },
      flightdeparture_terminal: {
        type: Sequelize.STRING,
      },
      flightdeparture_note: {
        type: Sequelize.TEXT,
      },
      flightreturn_airlinebook: {
        type: Sequelize.STRING,
      },
      flightreturn_airlinename: {
        type: Sequelize.STRING,
      },
      flightreturn_startdate: {
        type: Sequelize.DATE,
      },
      flightreturn_enddate: {
        type: Sequelize.DATE,
      },
      flightreturn_airportfrom: {
        type: Sequelize.STRING,
      },
      flightreturn_airportto: {
        type: Sequelize.STRING,
      },
      flightreturn_terminal: {
        type: Sequelize.STRING,
      },
      flightreturn_note: {
        type: Sequelize.TEXT,
      },
      total_day: {
        type: Sequelize.INTEGER,
      },
      purchase: {
        type: Sequelize.FLOAT,
      },
      total_purchase: {
        type: Sequelize.FLOAT,
      },
      payment_method: {
        type: Sequelize.INTEGER,
      },
      payment_date: {
        type: Sequelize.DATE,
      },
      total_payment: {
        type: Sequelize.FLOAT,
      },
      status: {
        type: Sequelize.INTEGER,
      },
      remark: {
        type: Sequelize.TEXT,
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
    return queryInterface.dropTable('Purchases');
  },
};
