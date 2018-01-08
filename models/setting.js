'use strict';
module.exports = (sequelize, DataTypes) => {
  var Setting = sequelize.define('Setting', {
    app_name: DataTypes.STRING,
    app_logo: DataTypes.STRING,
    app_favicon: DataTypes.STRING,
    app_copyright: DataTypes.STRING,
    app_license: DataTypes.STRING,
    mail_host: DataTypes.STRING,
    mail_port: DataTypes.INTEGER,
    mail_secure: DataTypes.INTEGER,
    mail_username: DataTypes.STRING,
    mail_password: DataTypes.STRING,
    sms_apikey: DataTypes.STRING,
    sms_apisecret: DataTypes.STRING,
    fee_sale: DataTypes.FLOAT,
    investment_value: DataTypes.FLOAT,
    theme: DataTypes.STRING,
    sales_tax: DataTypes.INTEGER,
    admin_fee: DataTypes.INTEGER,
    operating_costs: DataTypes.INTEGER,
  });

  return Setting;
};
