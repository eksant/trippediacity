'use strict';
const Op      = require('sequelize').Op

module.exports = (sequelize, DataTypes) => {
  var Profile = sequelize.define('Profile', {
    UserId: DataTypes.INTEGER,
    mobile_no: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Mobile no. must be filled !!'
        },
      }
    },
    phone_no: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Email must be filled !!'
        },
        isUnique: function(value, next) {
          Profile.findAll({
            where:{
              email: value,
              id: { [Op.ne]: this.id, }
            }
          })
          .then(function(row) {
            if (row.length == 0) {
              next()
            } else {
              next('Email already used !')
            }
          })
          .catch(function(err) {
            next(err)
          })
        }
      }
    },
    address: DataTypes.STRING,
    distric: DataTypes.INTEGER,
    province: DataTypes.INTEGER,
    postal_code: DataTypes.INTEGER,
    company_name: DataTypes.STRING,
    company_phone: DataTypes.STRING,
    photo_profile: DataTypes.STRING,
  });

  return Profile;
};
