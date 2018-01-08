const Model       = require('../models')
const getDesc     = require('../helpers/getCashflow')
const library     = require('./library')
const message     = require('./message')
const send        = require('./notification')
const express     = require('express')
const moment      = require('moment')
const Router      = express.Router()
const title       = 'Purchase'

let objAlert  = null

Router.get('/', (req, res) => {
  if (res.locals.userSession.role == 1) {
    var objFilterPurchase = {
      order: [
        ['status', 'DESC'],
        ['no_invoice', 'ASC'],
        ['createdAt', 'DESC'],
      ],
      include: [Model.User, Model.Agent],
    }
  } else {
    var objFilterPurchase = {
      where: {
        UserId: res.locals.userSession.id,
      },
      order: [
        ['status', 'DESC'],
        ['no_invoice', 'ASC'],
        ['createdAt', 'DESC'],
      ],
      include: [Model.User, Model.Agent],
    }
  }
  Model.Purchase.findAll(objFilterPurchase)
  .then(function(purchase) {
    Model.Setting.findAll()
    .then(function(setting) {
      res.render('./purchase', {
        title       : title,
        action      : '',
        new_button  : true,
        purchase    : purchase,
        setting     : setting[0],
        moment      : moment,
        formatMoney : library.formatMoney,
        alert       : objAlert,
      })
      objAlert = null
    })
  })
})

Router.get('/add', (req, res) => {
  Model.Agent.findAll({
    order: ['name'],
  })
  .then(function(agent) {
    Model.Setting.findAll()
    .then(function(setting) {
      res.render('./purchase_form', {
        title       : title,
        action      : 'Add',
        new_button  : false,
        purchase    : false,
        agent       : agent,
        setting     : setting[0],
        moment      : moment,
        alert       : objAlert,
      })
      objAlert = null
    })
  })
})

Router.post('/add', (req, res) => {
  let payment_method  = req.body.payment_method
  let total_payment   = req.body.total_payment
  let total_purchase  = req.body.total_purchase
  let purchase        = req.body.purchase
  let status          = 1
  let total_day       = 0

  if (payment_method == '') {
    payment_method = null
  }

  if (total_payment != '') {
    total_payment = total_payment.replace(/,/g, '')
    status = 2
  } else {
    total_payment = null
    status = 1
  }

  if (total_purchase != '') {
    total_purchase = total_purchase.replace(/,/g, '')
  } else {
    total_purchase = null
  }

  if (purchase != '') {
    purchase = purchase.replace(/,/g, '')
  } else {
    purchase = null
  }

  if (req.body.hotel_startdate != '' && req.body.hotel_enddate != '') {
    total_day = library.dayDiff(req.body.hotel_startdate, req.body.hotel_enddate) + 1
  } else if (req.body.flightdeparture_startdate != '' && req.body.flightdeparture_enddate != '') {
    total_day = (req.body.flightreturn_airlinebook == '') ? 1 : 2
  }

  Model.Cashflow.findAll({
    limit: 1,
    order: [['id', 'DESC']],
  })
  .then(function(cashflow) {
    let lastSaldo = cashflow[0].saldo
    if (lastSaldo > total_payment) {
      let objPurchase = {
        UserId                      : res.locals.userSession.id,
        AgentId                     : req.body.agentid,
        no_invoice                  : req.body.no_invoice,
        category                    : req.body.category,
        booking_id                  : req.body.booking_id,
        hotel_name                  : req.body.hotel_name,
        hotel_address               : req.body.hotel_address,
        hotel_phone                 : req.body.hotel_phone,
        hotel_note                  : req.body.hotel_note,
        hotel_startdate             : library.getMomentDate(req.body.hotel_startdate) || null,
        hotel_enddate               : library.getMomentDate(req.body.hotel_enddate) || null,
        flightdeparture_airlinebook : req.body.flightdeparture_airlinebook,
        flightdeparture_airlinename : req.body.flightdeparture_airlinename,
        flightdeparture_startdate   : library.getMomentDateTime(req.body.flightdeparture_startdate) || null,
        flightdeparture_enddate     : library.getMomentDateTime(req.body.flightdeparture_enddate) || null,
        flightdeparture_airportfrom : req.body.flightdeparture_airportfrom,
        flightdeparture_airportto   : req.body.flightdeparture_airportto,
        flightdeparture_terminal    : req.body.flightdeparture_terminal,
        flightdeparture_note        : req.body.flightdeparture_note,
        flightreturn_airlinebook    : req.body.flightreturn_airlinebook,
        flightreturn_airlinename    : req.body.flightreturn_airlinename,
        flightreturn_startdate      : library.getMomentDateTime(req.body.flightreturn_startdate) || null,
        flightreturn_enddate        : library.getMomentDateTime(req.body.flightreturn_enddate) || null,
        flightreturn_airportfrom    : req.body.flightreturn_airportfrom,
        flightreturn_airportto      : req.body.flightreturn_airportto,
        flightreturn_terminal       : req.body.flightreturn_terminal,
        flightreturn_note           : req.body.flightreturn_note,
        total_day                   : total_day,
        purchase                    : purchase,
        total_purchase              : total_purchase,
        payment_method              : payment_method,
        payment_date                : library.getMomentDate(req.body.payment_date) || null,
        total_payment               : total_payment,
        status                      : status,
        remark                      : req.body.remark,
      }
      console.log('objPurchase ==========', objPurchase);
      Model.Purchase.create(objPurchase)
      .then(function() {
        if (status == 2) {
          Model.Purchase.findOne({
            where: {
              no_invoice: req.body.no_invoice,
              UserId    : res.locals.userSession.id,
            }
          })
          .then(function(purchase) {
            let objCashflow = {
              UserId          : res.locals.userSession.id,
              code            : 2,
              description     : getDesc(2),
              no_transaction  : req.body.no_invoice,
              value           : total_payment,
              saldo           : Number(lastSaldo) - Number(total_payment),
              deduct_profit   : null,
              table_id        : purchase.id,
            }
            Model.Cashflow.create(objCashflow)
            .then(function() {
              Model.User.findAll({
                where: {
                  role: 2,
                }
              })
              .then(function(investor) {
                let totalSlot = 0
                for (let i = 0; i < investor.length; i++) {
                  totalSlot += investor[i].investment_slot
                }

                let arrProfit = []
                for (let i = 0; i < investor.length; i++) {
                  let promiseProfit = new Promise(function(resolve, reject) {
                    let objProfit = {
                      UserId            : investor[i].id,
                      SaleId            : null,
                      no_sale           : null,
                      payment_sale      : null,
                      no_purchase       : purchase.no_invoice,
                      payment_purchase  : purchase.total_payment,
                      total_profit      : null,
                      total_slot        : totalSlot,
                      profit_slot       : null,
                      user_slot         : investor[i].investment_slot,
                      user_profit       : null,
                      status            : status,
                      sales_tax         : null,
                      admin_fee         : null,
                      operating_costs   : null,
                      total_netprofit   : null,
                    }
                    Model.Profit.create(objProfit)
                    .then(function() {
                      resolve()
                    })
                    .catch(function(err) {
                      reject(err)
                    })
                  })
                  arrProfit.push(promiseProfit)
                }
                Promise.all(arrProfit)
                .then(function() {
                  objAlert = message.success()
                  res.redirect('/purchase')
                })
                .catch(function(err) {
                  Model.Cashflow.destroy({
                    where: {
                      code      : 2,
                      table_id  : purchase.id,
                    }
                  })
                  Model.Purchase.destroy({
                    where: {
                      id        : purchase.id,
                      no_invoice: req.body.no_invoice,
                      UserId    : res.locals.userSession.id,
                    }
                  })
                  objAlert = message.error(err.message)
                  res.redirect('/purchase/add/')
                })
              })
            })
            .catch(function(err) {
              Model.Purchase.destroy({
                where: {
                  no_invoice: req.body.no_invoice,
                  UserId    : res.locals.userSession.id,
                }
              })
              objAlert = message.error(err.message)
              res.redirect('/purchase/add/')
            })
          })
        } else {
          objAlert = message.success()
          res.redirect('/purchase')
        }
      })
      .catch(function(err) {
        objAlert = message.error(err.message)
        res.redirect('/purchase/add/')
      })
    } else {
      objAlert = message.error('The remaining balance insufficient for payment !!')
      res.redirect('/purchase/add/')
    }
  })
})

Router.get('/edit/:id', (req, res) => {
  Model.Purchase.findOne({
    where: {
      id: req.params.id,
    },
    include: [Model.User, Model.Agent],
  })
  .then(function(purchase) {
    Model.Agent.findAll({
      order: ['name'],
    })
    .then(function(agent) {
      Model.Setting.findAll()
      .then(function(setting) {
        res.render('./purchase_form', {
          title       : title,
          action      : 'Edit',
          new_button  : false,
          purchase    : purchase,
          setting     : setting[0],
          agent       : agent,
          moment      : moment,
          alert       : objAlert,
        })
        objAlert = null
      })
    })
  })
})

Router.post('/edit/:id', (req, res) => {
  let payment_method  = req.body.payment_method
  let total_payment   = req.body.total_payment
  let total_purchase  = req.body.total_purchase
  let input_purchase  = req.body.purchase
  let status          = 1
  let total_day       = 0

  if (payment_method == '') {
    payment_method = null
  }

  if (total_payment != '') {
    total_payment = total_payment.replace(/,/g, '')
    status = 2
  } else {
    total_payment = null
    status = 1
  }

  if (total_purchase != '') {
    total_purchase = total_purchase.replace(/,/g, '')
  } else {
    total_purchase = null
  }

  if (input_purchase != '') {
    input_purchase = input_purchase.replace(/,/g, '')
  } else {
    input_purchase = null
  }

  if (req.body.hotel_startdate != '' && req.body.hotel_enddate != '') {
    total_day = library.dayDiff(req.body.hotel_startdate, req.body.hotel_enddate) + 1
  } else if (req.body.flightdeparture_startdate != '' && req.body.flightdeparture_enddate != '') {
    total_day = library.dayDiff(req.body.hotel_startdate, req.body.hotel_enddate) + 1
  } else if (req.body.flightreturn_startdate != '' && req.body.flightreturn_enddate != '') {
    total_day = library.dayDiff(req.body.hotel_startdate, req.body.hotel_enddate) + 1
  }

  Model.Cashflow.destroy({
    where: {
      code      : 2,
      table_id  : req.params.id,
    }
  })
  .then(function() {
    Model.Cashflow.findAll({
      limit: 1,
      order: [['id', 'DESC']],
    })
    .then(function(cashflow) {
      let lastSaldo = cashflow[0].saldo
      if (lastSaldo > total_payment) {
        Model.Purchase.findOne({
          where: {
            id: req.params.id,
          }
        })
        .then(function(purchase) {
          let objPurchase = {
            id                          : req.params.id,
            UserId                      : res.locals.userSession.id,
            AgentId                     : req.body.agentid,
            no_invoice                  : req.body.no_invoice,
            category                    : req.body.category,
            booking_id                  : req.body.booking_id,
            hotel_name                  : req.body.hotel_name,
            hotel_address               : req.body.hotel_address,
            hotel_phone                 : req.body.hotel_phone,
            hotel_note                  : req.body.hotel_note,
            hotel_startdate             : library.getMomentDate(req.body.hotel_startdate),
            hotel_enddate               : library.getMomentDate(req.body.hotel_enddate),
            flightdeparture_airlinebook : req.body.flightdeparture_airlinebook,
            flightdeparture_airlinename : req.body.flightdeparture_airlinename,
            flightdeparture_startdate   : library.getMomentDateTime(req.body.flightdeparture_startdate),
            flightdeparture_enddate     : library.getMomentDateTime(req.body.flightdeparture_enddate),
            flightdeparture_airportfrom : req.body.flightdeparture_airportfrom,
            flightdeparture_airportto   : req.body.flightdeparture_airportto,
            flightdeparture_terminal    : req.body.flightdeparture_terminal,
            flightdeparture_note        : req.body.flightdeparture_note,
            flightreturn_airlinebook    : req.body.flightreturn_airlinebook,
            flightreturn_airlinename    : req.body.flightreturn_airlinename,
            flightreturn_startdate      : library.getMomentDateTime(req.body.flightreturn_startdate),
            flightreturn_enddate        : library.getMomentDateTime(req.body.flightreturn_enddate),
            flightreturn_airportfrom    : req.body.flightreturn_airportfrom,
            flightreturn_airportto      : req.body.flightreturn_airportto,
            flightreturn_terminal       : req.body.flightreturn_terminal,
            flightreturn_note           : req.body.flightreturn_note,
            total_day                   : total_day,
            purchase                    : input_purchase,
            total_purchase              : total_purchase,
            payment_method              : payment_method,
            payment_date                : library.getMomentDate(req.body.payment_date),
            total_payment               : total_payment,
            status                      : status,
            remark                      : req.body.remark,
          }
          Model.Purchase.update(objPurchase, {
            where: {
              id: req.params.id,
            },
            individualHooks: true,
          })
          .then(function() {
            let arrProfitCashflow = []
            let promiseCashflow = new Promise(function(resolve, reject) {
              if (status == 1) {
                Model.Cashflow.destroy({
                  where: {
                    code      : 2,
                    table_id  : req.params.id,
                  }
                })
                .then(function() {
                  resolve()
                })
                .catch(function(err) {
                  reject(err)
                })
              } else if (status == 2) {
                let objCashflow = {
                  UserId          : res.locals.userSession.id,
                  code            : 2,
                  description     : getDesc(2),
                  no_transaction  : req.body.no_invoice,
                  value           : total_payment,
                  saldo           : Number(lastSaldo) - Number(total_payment),
                  deduct_profit   : null,
                  table_id        : purchase.id,
                }
                Model.Cashflow.create(objCashflow)
                .then(function() {
                  resolve()
                })
                .catch(function(err) {
                  reject(err)
                })
              }
              // LOOPING UPDATE SALDO KARENA CASHFLOW DIHAPUS ATAU DI EDIT........................
            })
            arrProfitCashflow.push(promiseCashflow)

            let promiseProfit = new Promise(function(resolve, reject) {
              let objProfit = {
                no_purchase       : req.body.no_invoice,
                payment_purchase  : total_payment,
                status            : status,
              }
              Model.Profit.update(objProfit, {
                where: {
                  no_purchase : purchase.no_invoice,
                }
              })
              .then(function() {
                resolve()
              })
              .catch(function(err) {
                reject(err)
              })
            })
            arrProfitCashflow.push(promiseProfit)

            Promise.all(arrProfitCashflow)
            .then(function() {
              objAlert = message.success()
              res.redirect('/purchase')
            })
            .catch(function(err) {
              objAlert = message.error(err.message)
              res.redirect('/purchase/edit/' + req.params.id)
            })
          })
          .catch(function(err) {
            objAlert = message.error(err.message)
            res.redirect('/purchase/edit/' + req.params.id)
          })
        })
      } else {
        objAlert = message.error('The remaining balance insufficient for payment !!')
        res.redirect('/purchase/edit/' + req.params.id)
      }
    })
  })
  .catch(function(err) {
    objAlert = message.error(err.message)
    res.redirect('/purchase/edit/' + req.params.id)
  })
})

Router.get('/delete/:id', (req, res) => {
  Model.Purchase.findOne({
    where: {
      id: req.params.id,
    },
    include: [Model.User, Model.Agent],
  })
  .then(function(purchase) {
    Model.Sale.findOne({
      where: {
        PurchaseId: purchase.id,
      }
    })
    .then(function(sale) {
      if (!sale || purchase.status < 3) {
        Model.Profit.destroy({
          where: {
            no_purchase  : purchase.no_invoice,
          }
        })
        .then(function() {
          Model.Cashflow.destroy({
            where: {
              code      : 2,
              table_id  : req.params.id,
            }
          })
          .then(function() {
            // LOOPING UPDATE SALDO KARENA CASHFLOW DIHAPUS........................
            Model.Purchase.destroy({
              where: {
                id: req.params.id,
              }
            })
            .then(function() {
              objAlert = message.success('The record has been successfully deleted.')
              res.redirect('/purchase')
            })
            .catch(function(err) {
              objAlert = message.error(err.message)
              res.redirect('/purchase')
            })
          })
          .catch(function(err) {
            objAlert = message.error(err.message)
            res.redirect('/purchase')
          })
        })
        .catch(function(err) {
          objAlert = message.error(err.message)
          res.redirect('/purchase')
        })
      } else {
        objAlert = message.error('Transaction rejected because has been used in another transaction !!')
        res.redirect('/purchase')
      }
    })
  })
})

module.exports = Router;
