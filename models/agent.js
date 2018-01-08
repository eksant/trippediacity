'use strict';
const Op      = require('sequelize').Op

module.exports = (sequelize, DataTypes) => {
  var Agent = sequelize.define('Agent', {
    code: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Code must be filled !!'
        },
        isUnique: function(value, next) {
          Agent.findAll({
            where:{
              code: value,
              id: { [Op.ne]: this.id, }
            }
          })
          .then(function(agent) {
            if (agent.length == 0) {
              next()
            } else {
              next('Code already used !!')
            }
          })
          .catch(function(err) {
            next(err)
          })
        },
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Name must be filled !!'
        },
        isUnique: function(value, next) {
          Agent.findAll({
            where:{
              name: value,
              id: { [Op.ne]: this.id, }
            }
          })
          .then(function(agent) {
            if (agent.length == 0) {
              next()
            } else {
              next('Name already used !!')
            }
          })
          .catch(function(err) {
            next(err)
          })
        },
      }
    },
    phone_no: DataTypes.STRING,
    address: DataTypes.TEXT
  });

  Agent.associate = function(models) {
    Agent.hasMany(models.Purchase)
    Agent.hasMany(models.Sale)
  }

  return Agent;
};
