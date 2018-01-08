'use strict';
const getRole = require('../helpers/getRole')
const Op      = require('sequelize').Op
const bcrypt  = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
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
          User.findAll({
            where:{
              username: value,
              id: { [Op.ne]: this.id, }
            }
          })
          .then(function(user) {
            if (user.length == 0) {
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
          User.findAll({
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
    wallet: DataTypes.FLOAT,
    bank_name: DataTypes.STRING,
    bank_account: DataTypes.STRING,
    bank_number: DataTypes.STRING,
    investment_value: DataTypes.FLOAT,
    investment_slot: DataTypes.INTEGER,
    investment_total: DataTypes.FLOAT,
  }, {
    hooks: {
      beforeCreate: (user, options) => {
        return bcrypt.hash(user.password, 10)
        .then((hash) => {
          user.password = hash
        })
      },
      beforeUpdate: (user, options) => {
        return bcrypt.hash(user.password, 10)
        .then((hash) => {
          user.password = hash
        })
      }
    },
    instanceMethods: {
      comparePassword: function (userPassword, callback) {
        bcrypt.compare(userPassword, this.password)
        .then((isMatch) => {
          callback(isMatch)
        })
      }
    }
  });

  User.prototype.check_password = function (userPassword, callback) {
    bcrypt.compare(userPassword, this.password)
    .then((isMatch) => {
      callback(isMatch)
    })
    .catch((err) => {
      callback(err)
    })
  }

  User.prototype.getRole = function() {
    return getRole(this.role)
  }

  User.prototype.getTotalSlot = function() {
    User.findAll({
      attributes: [[sequelize.fn('COUNT', sequelize.col('investment_slot')), 'total_slot']],
      where: {
        role: 2,
      }
    })
    .then(function(user) {
      if (user) {
        return user.total_slot
      }
      return 0
    })
  }

  User.associate = function(models) {
    User.hasMany(models.Purchase)
  }

  return User;
};
