'use strict';
const getRole = require('../helpers/getRole');
const Op      = require('sequelize').Op
const bcrypt  = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  var Customer = sequelize.define('Customer', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Name must be filled !!'
        },
      }
    },
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Username must be filled !!'
        },
        isUnique: function(value, next) {
          Customer.findAll({
            where:{
              username: value,
              id: { [Op.ne]: this.id, }
            }
          })
          .then(function(customer) {
            if (customer.length == 0) {
              next()
            } else {
              next('Username already used !!')
            }
          })
          .catch(function(err) {
            next(err)
          })
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Password must be filled !!'
        },
        len: {
          args: [6, 255],
          msg: 'Password at least 6 characters !!'
        }
      }
    },
    role: {
      type: DataTypes.INTEGER,
      validate: {
        customValidation: function(value, next) {
          if (value == '') {
            next('Please choose a role !!')
          } else {
            next()
          }
        }
      }
    },
    role: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Role must be filled !!'
        },
      }
    },
    gender: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Gender must be filled !!'
        },
      }
    },
    mobile_no: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Mobile no. must be filled !!'
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Email must be filled !!'
        },
        isUnique: function(value, next) {
          Customer.findAll({
            where:{
              email: value,
              id: { [Op.ne]: this.id, }
            }
          })
          .then(function(row) {
            if (row.length == 0) {
              next()
            } else {
              next('Email already used !!')
            }
          })
          .catch(function(err) {
            next(err)
          })
        }
      }
    },
    address: DataTypes.TEXT,
    photo: DataTypes.STRING,
    company_name: DataTypes.STRING,
    company_phone: DataTypes.STRING,
    company_address: DataTypes.TEXT,
    reset_password_token: DataTypes.STRING,
    reset_password_expires: DataTypes.DATE,
    wallet: DataTypes.FLOAT
  }, {
    hooks: {
      beforeCreate: (customer, options) => {
        return bcrypt.hash(customer.password, 10)
        .then((hash) => {
          customer.password = hash
        })
      },
      beforeUpdate: (customer, options) => {
        return bcrypt.hash(customer.password, 10)
        .then((hash) => {
          customer.password = hash
        })
      }
    },
    instanceMethods: {
      comparePassword: function (customerPassword, callback) {
        bcrypt.compare(customerPassword, this.password)
        .then((isMatch) => {
          callback(isMatch)
        })
      }
    }
  });

  Customer.prototype.check_password = function (customerPassword, callback) {
    bcrypt.compare(customerPassword, this.password)
    .then((isMatch) => {
      callback(isMatch)
    })
    .catch((err) => {
      callback(err)
    })
  }

  Customer.prototype.getRole = function() {
    return getRole(this.role)
  }

  Customer.associate = function(models) {
    Customer.hasMany(models.Sale)
  }

  return Customer;
};
