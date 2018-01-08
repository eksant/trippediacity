const Model   = require('../models')
const getDesc = require('../helpers/getCashflow')
const library = require('./library')
const message = require('./message')
const send    = require('./notification')
const email   = require('./templateemail')
const express = require('express')
const Op      = require('sequelize').Op
const Router  = express.Router()
const title   = 'User'

let objAlert  = null

Router.get('/', (req, res) => {
  Model.User.findAll({
    order: [['role', 'ASC'], ['name', 'ASC']],
  })
  .then((user) => {
    Model.Setting.findAll()
    .then(function(setting) {
      res.render('./user', {
        title           : title,
        action          : '',
        new_button      : true,
        user            : user,
        setting         : setting[0],
        alert           : objAlert,
      })
      objAlert = null
    })
  })
})

Router.get('/add', (req, res) => {
  Model.Setting.findAll()
  .then(function(setting) {
    if (setting[0].app_name == undefined) {
      objAlert = message.error('Please complete your setting application !!')
      res.redirect('/user')
    } else {
      res.render('./user_form', {
        title           : title,
        action          : 'Add',
        new_button      : false,
        user            : false,
        purchase        : false,
        setting         : setting[0],
        alert           : objAlert,
      })
      objAlert = null
    }
  })
})

Router.post('/add', (req, res) => {
  Model.Customer.findAll({
    where: {
      [Op.or]: [{username: req.body.username}, {email: req.body.email}]
    }
  })
  .then(function(customer) {
    if (customer.length == 0) {
      Model.Setting.findAll()
      .then(function(setting) {
        let objUser = {
          name              : req.body.name,
          username          : req.body.username,
          password          : req.body.password,
          role              : req.body.role,
          gender            : req.body.gender,
          mobile_no         : req.body.mobile_no,
          email             : req.body.email,
          address           : req.body.address,
          company_name      : req.body.company_name,
          company_phone     : req.body.company_phone,
          company_address   : req.body.company_address,
          bank_name         : req.body.bank_name || null,
          bank_account      : req.body.bank_account || null,
          bank_number       : req.body.bank_number || null,
          investment_value  : req.body.investment_value || null,
          investment_slot   : req.body.investment_slot || null,
          investment_total  : req.body.investment_total || null,
          createdAt         : Date.now(),
          updatedAt         : Date.now(),
        }
        Model.User.create(objUser)
        .then(function() {
          if (req.body.role == 2) {
            Model.User.findOne({
              where: {
                username: req.body.username,
              }
            })
            .then(function(user) {
              Model.Cashflow.findAll({
                limit: 1,
                order: [['id', 'DESC']],
              })
              .then(function(cashflow) {
                let lastSaldo = 0
                if (cashflow.length > 0) {
                  lastSaldo = cashflow[0].saldo
                }

                let objCashflow = {
                  UserId          : res.locals.userSession.id,
                  code            : 1,
                  description     : getDesc(1),
                  no_transaction  : `${req.body.investment_value}x${req.body.investment_slot}`,
                  value           : req.body.investment_total,
                  saldo           : Number(lastSaldo) + Number(req.body.investment_total),
                  table_id        : user.id,
                  createdAt       : Date.now(),
                  updatedAt       : Date.now(),
                }
                Model.Cashflow.create(objCashflow)
              })
            })
          }

          if (req.body.notification != undefined) {
            let role  = ''
            let login = req.headers.host + '/login'
            if (req.body.role == 2) {
              role = 'Investor'
            } else if (req.body.role == 3) {
              role = 'Admin'
            }

            // sending sms
            let objSms = {
              to    : `62${req.body.mobile_no}`,
              text  : `[Trippediacity] Welcome ${req.body.name}, you are registered as ${role}. Now you can login at ${login}`,
            }
            send.sms(objSms, function(err, responseData) {
              if (!err) {
                let msg = `send SMS notification to ${req.body.name} (+62${req.body.mobile_no}), `
                console.log(msg);
              } else {
                objAlert = message.error('Fail to send SMS, please try again !!')
                console.log(err);
              }
            })

            // send email notification
            // let arrAttachments = [{
            //   filename    : pdfInvoice.replace('.pdf', ''),
            //   path        : path + pdfInvoice,
            //   contentType : 'application/pdf',
            // }]
            let objMail = {
              to          : req.body.email,
              subject     : `[Trippediacity] Welcome ${req.body.name}, you are successfully to registered.`,
              body        : email.registered_success(setting, objUser, login),
              // attachments : arrAttachments,
            }
            send.email(objMail, function(error, info) {
              if (!error) {
                let msg = `send email notification registered to ${req.body.name} (${req.body.email})`
                console.log(msg);
              } else {
                objAlert = message.error('Fail to send email, please try again !!')
                console.log(error);
              }
            })
          }

          objAlert = message.success()
          res.redirect('/user')
        })
        .catch(function(err) {
          objAlert = message.error(err.message)
          res.redirect('/user/add/')
        })
      })
    } else {
      objAlert = message.error('Username or email already used !!')
      res.redirect('/user/add/')
    }
  })
})

Router.get('/edit/:id', (req, res) => {
  Model.User.findById(req.params.id)
  .then(function(user) {
    Model.Setting.findAll()
    .then(function(setting) {
      Model.Purchase.findAll()
      .then(function(purchase) {
        res.render('./user_form', {
          title           : title,
          action          : 'Edit',
          new_button      : false,
          user            : user,
          purchase        : purchase,
          setting         : setting[0],
          alert           : objAlert,
        })
        objAlert = null
      })
    })
  })
})

Router.post('/edit/:id', (req, res) => {
  Model.Customer.findAll({
    where: {
      [Op.or]: [{username: req.body.username}, {email: req.body.email}]
    }
  })
  .then(function(customer) {
    if (customer.length == 0) {
      Model.User.findById(req.params.id)
      .then(function(user) {
        let hooks = true
        let objUser = {
          id                : req.params.id,
          name              : req.body.name,
          username          : req.body.username,
          password          : req.body.password,
          role              : req.body.role,
          gender            : req.body.gender,
          mobile_no         : req.body.mobile_no,
          email             : req.body.email,
          address           : req.body.address,
          company_name      : req.body.company_name,
          company_phone     : req.body.company_phone,
          company_address   : req.body.company_address,
          bank_name         : req.body.bank_name || null,
          bank_account      : req.body.bank_account || null,
          bank_number       : req.body.bank_number || null,
          investment_value  : req.body.investment_value || null,
          investment_slot   : req.body.investment_slot || null,
          investment_total  : req.body.investment_total || null,
          updatedAt         : new Date(),
        }
        if (user.password == req.body.password) {
          hooks = false
        }
        Model.User.update(objUser, {
          where: {
            id: req.params.id,
          },
          individualHooks: hooks,
        })
        .then(function() {
          if (req.body.role == 2) {
            Model.Cashflow.destroy({
              where: {
                code      : 1,
                table_id  : req.params.id,
              }
            })
            .then(function() {
              Model.Cashflow.findAll({
                limit: 1,
                order: [['id', 'DESC']],
              })
              .then(function(cashflow) {
                let lastSaldo = 0
                if (cashflow.length > 0) {
                  lastSaldo = cashflow[0].saldo
                }

                let objCashflow = {
                  UserId          : res.locals.userSession.id,
                  code            : 1,
                  description     : getDesc(1),
                  no_transaction  : `${req.body.investment_value}x${req.body.investment_slot}`,
                  value           : req.body.investment_total,
                  saldo           : Number(lastSaldo) + Number(req.body.investment_total),
                  table_id        : user.id,
                  createdAt       : Date.now(),
                  updatedAt       : Date.now(),
                }
                Model.Cashflow.create(objCashflow)
              })
            })
          }
          objAlert = message.success()
          res.redirect('/user')
        })
        .catch(function(err) {
          objAlert = message.error(err.message)
          res.redirect('/user/edit/' + req.params.id)
        })
      })
    } else {
      objAlert = message.error('Username or email already used !!')
      res.redirect('/user/edit/' + req.params.id)
    }
  })
})

Router.get('/delete/:id', (req, res) => {
  Model.Purchase.findOne({
    where: {
      UserId: req.params.id,
    }
  })
  .then(function(purchase) {
    if (!purchase) {
      Model.User.destroy({
        where: {
          id: req.params.id,
        }
      })
      .then(function() {
        Model.Cashflow.destroy({
          where: {
            code      : 1,
            table_id  : req.params.id,
          }
        })
        .then(function() {
          objAlert = message.success()
          res.redirect('/user')
        })
      })
      .catch(function(err) {
        objAlert = message.error(err.message)
        res.redirect('/user/')
      })
    } else {
      objAlert = message.error('User cannot to deleted because have another transaction !!')
      res.redirect('/user/')
    }
  })
})

module.exports = Router;
