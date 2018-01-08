'use strict';
const helper  = require('../helpers/getSale')
const Op      = require('sequelize').Op

module.exports = (sequelize, DataTypes) => {
  var Sale = sequelize.define('Sale', {
    PurchaseId: DataTypes.INTEGER,
    AgentId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    CustomerId: DataTypes.INTEGER,
    no_invoice: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'No. Invoice must be filled !!'
        },
        isUnique: function(value, next) {
          Sale.findAll({
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
    price: {
      type: DataTypes.FLOAT,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Price must be filled !!'
        },
      }
    },
    total_sale: {
      type: DataTypes.FLOAT,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Total sale must be filled !!'
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
            if (value != this.total_sale) {
              next('Total payment must be equal than total sale !!')
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

  Sale.associate = function(models) {
    Sale.belongsTo(models.Purchase)
    Sale.belongsTo(models.Agent)
    Sale.belongsTo(models.User)
    Sale.belongsTo(models.Customer)
  }

  Sale.prototype.getStatus = function() {
    return helper.getStatus(this.status)
  }

  Sale.prototype.getPaymentMethod = function() {
    return helper.getPaymentMethod(this.payment_method)
  }

  return Sale;
};
