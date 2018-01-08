'use strict';
const helper  = require('../helpers/getPurchase')
const Op      = require('sequelize').Op

module.exports = (sequelize, DataTypes) => {
  var Purchase = sequelize.define('Purchase', {
    UserId: DataTypes.INTEGER,
    AgentId: DataTypes.INTEGER,
    no_invoice: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'No. Invoice must be filled !!'
        },
        isUnique: function(value, next) {
          Purchase.findAll({
            where:{
              no_invoice: value,
              id: { [Op.ne]: this.id, }
            }
          })
          .then(function(purchase) {
            if (purchase.length == 0) {
              next()
            } else {
              next('No. Invoice already used !!')
            }
          })
          .catch(function(err) {
            next(err)
          })
        },
      }
    },
    category: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Category must be filled !!'
        },
      }
    },
    booking_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Booking ID must be filled !!'
        },
        isUnique: function(value, next) {
          Purchase.findAll({
            where:{
              booking_id: value,
              id: { [Op.ne]: this.id, }
            }
          })
          .then(function(purchase) {
            if (purchase.length == 0) {
              next()
            } else {
              next('No. Booking already used !!')
            }
          })
          .catch(function(err) {
            next(err)
          })
        },
      }
    },
    hotel_name: DataTypes.STRING,
    hotel_address: DataTypes.TEXT,
    hotel_phone: DataTypes.STRING,
    hotel_note: DataTypes.TEXT,
    hotel_startdate: DataTypes.DATE,
    hotel_enddate: DataTypes.DATE,
    flightdeparture_airlinebook: DataTypes.STRING,
    flightdeparture_airlinename: DataTypes.STRING,
    flightdeparture_startdate: DataTypes.DATE,
    flightdeparture_enddate: DataTypes.DATE,
    flightdeparture_airportfrom: DataTypes.STRING,
    flightdeparture_airportto: DataTypes.STRING,
    flightdeparture_terminal: DataTypes.STRING,
    flightdeparture_note: DataTypes.TEXT,
    flightreturn_airlinebook: DataTypes.STRING,
    flightreturn_airlinename: DataTypes.STRING,
    flightreturn_startdate: DataTypes.DATE,
    flightreturn_enddate: DataTypes.DATE,
    flightreturn_airportfrom: DataTypes.STRING,
    flightreturn_airportto: DataTypes.STRING,
    flightreturn_terminal: DataTypes.STRING,
    flightreturn_note: DataTypes.TEXT,
    total_day: DataTypes.INTEGER,
    purchase: {
      type: DataTypes.FLOAT,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Purchase must be filled !!'
        },
      }
    },
    total_purchase: {
      type: DataTypes.FLOAT,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Total purchase must be filled !!'
        },
      }
    },
    payment_method: DataTypes.INTEGER,
    payment_date: DataTypes.DATE,
    total_payment: {
      type: DataTypes.FLOAT,
      validate: {
        customValidation: function(value, next) {
          if (value != '') {
            if (value != this.total_purchase) {
              next('Total payment must be equal than total purchase !!')
            } else {
              next()
            }
          } else {
            next()
          }
        }
      }
    },
    status: DataTypes.INTEGER,
    remark: DataTypes.TEXT
  });

  Purchase.prototype.getCategory = function() {
    return helper.getCategory(this.category)
  }

  Purchase.prototype.getStatus = function() {
    return helper.getStatus(this.status)
  }

  Purchase.prototype.getPaymentMethod = function() {
    return helper.getPaymentMethod(this.payment_method)
  }
  
  Purchase.associate = function(models) {
    Purchase.belongsTo(models.Agent)
    Purchase.belongsTo(models.User)
    Purchase.hasOne(models.Sale)
  }

  return Purchase;
};
