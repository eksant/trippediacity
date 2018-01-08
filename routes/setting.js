const Model   = require('../models')
const message = require('./message')
const express = require('express')
const Router  = express.Router()
const title   = 'Setting'

let objAlert  = null

Router.get('/', (req, res) => {
  Model.Setting.findAll()
  .then(function(setting) {
    if (!setting) {
      let objSetting = {
        app_name      : null,
        app_logo      : null,
        app_favicon   : null,
        app_copyright : null,
        app_license   : null,
        mail_host     : null,
        mail_port     : null,
        mail_secure   : null,
        mail_username : null,
        mail_password : null,
        sms_apikey    : null,
        sms_apisecret : null,
        theme         : null,
      }
      Model.Setting.create(objSetting)
      .then(function() {
        Model.Setting.findAll()
        .then(function(setting) {
          res.render('./setting_form', {
            title       : title,
            action      : '',
            new_button  : false,
            setting     : setting[0],
            alert       : objAlert,
          })
          objAlert = null
        })
      })
    } else {
      res.render('./setting_form', {
        title       : title,
        action      : '',
        new_button  : false,
        setting     : setting[0],
        alert       : objAlert,
      })
      objAlert = null
    }
  })
})

Router.post('/', (req, res) => {
  Model.Setting.findAll()
  .then(function(setting) {
    let mail_secure       = (req.body.mail_secure == undefined) ? 1 : req.body.mail_secure
    let fee_sale          = req.body.fee_sale
    let investment_value  = req.body.investment_value

    fee_sale          = 0   //(fee_sale == '') ? null : fee_sale.replace(/,/g, '')
    investment_value  = (investment_value == '') ? null : investment_value.replace(/,/g, '')

    let objSetting = {
      app_name          : req.body.app_name,
      app_logo          : null,
      app_favicon       : null,
      app_copyright     : req.body.app_copyright,
      app_license       : null,
      mail_host         : req.body.mail_host,
      mail_port         : req.body.mail_port,
      mail_secure       : mail_secure,
      mail_username     : req.body.mail_username,
      mail_password     : req.body.mail_password,
      sms_apikey        : req.body.sms_apikey,
      sms_apisecret     : req.body.sms_apisecret,
      fee_sale          : fee_sale,
      investment_value  : investment_value,
      theme             : req.body.theme,
      sales_tax         : req.body.sales_tax || null,
      admin_fee         : req.body.admin_fee || null,
      operating_costs   : req.body.operating_costs || null,
    }
    Model.Setting.update(objSetting, {
      where: {
        id: setting[0].id,
      }
    })
    .then(function() {
      objAlert = message.success()
      res.redirect('/setting')
    })
    .catch(function(err) {
      objAlert = message.error(err.message)
      res.redirect('/setting')
    })
  })
})

module.exports = Router;
