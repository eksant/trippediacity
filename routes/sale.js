const Model       = require('../models')
const getDesc     = require('../helpers/getCashflow')
const library     = require('./library')
const message     = require('./message')
const send        = require('./notification')
const email       = require('./templateemail')
const invoice     = require('./templateinvoice')
const booking     = require('./templatebooking')
const express     = require('express')
const moment      = require('moment')
const pdf         = require('html-pdf')
const Promise     = require('promise')
const Router      = express.Router()
const path        = 'public/attachments/'
const title       = 'Sale'

let objAlert  = null

Router.get('/', (req, res) => {
  if (res.locals.userSession.role == 1) {
    var objFilterSale = {
      order: [
        ['status', 'DESC'],
        ['no_invoice', 'ASC'],
        ['createdAt', 'DESC'],
      ],
      include: [Model.Purchase, Model.Agent, Model.User, Model.Customer],
    }
  } else {
    var objFilterSale = {
      where: {
        UserId: res.locals.userSession.id,
      },
      order: [
        ['status', 'DESC'],
        ['no_invoice', 'ASC'],
        ['createdAt', 'DESC'],
      ],
      include: [Model.Purchase, Model.Agent, Model.User, Model.Customer],
    }
  }
  Model.Sale.findAll(objFilterSale)
  .then(function(sale) {
    Model.Setting.findAll()
    .then(function(setting) {
      res.render('./sale', {
        title       : title,
        action      : '',
        new_button  : true,
        sale        : sale,
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
  Model.Customer.findAll({
    order: ['name'],
  })
  .then(function(customer) {
    Model.Purchase.findAll({
      where: {
        status: 2,
      },
      include: [Model.User, Model.Agent],
      order: ['no_invoice'],
    })
    .then(function(purchase) {
      Model.Setting.findAll()
      .then(function(setting) {
        res.render('./sale_form', {
          title       : title,
          action      : 'Add',
          new_button  : false,
          sale        : false,
          customer    : customer,
          purchase    : purchase,
          setting     : setting[0],
          moment      : moment,
          alert       : objAlert,
        })
        objAlert = null
      })
    })
  })
})

Router.post('/add', (req, res) => {
  let payment_method  = req.body.payment_method
  let total_payment   = req.body.total_payment
  let price           = req.body.price
  let total_sale      = req.body.total_sale
  let status          = 1
  let invoice_status  = ''

  if (payment_method == '') {
    payment_method = null
  }

  if (total_payment != '') {
    total_payment = total_payment.replace(/,/g, '')
    status = 3
    invoice_status = 'paid'
  } else {
    total_payment = null
    status = 1
    invoice_status = 'pending'
  }

  Model.Purchase.findOne({
    where: {
      id: req.body.purchaseid,
    },
    include: [Model.Agent, Model.User],
  })
  .then(function(purchase) {
    price       = price.replace(/,/g, '')
    total_sale  = total_sale.replace(/,/g, '')

    if (price > total_sale) {
      objAlert = message.error('Price must be greater than total sale !!')
      res.redirect('/sale/add/')
    } else if (total_sale < purchase.total_purchase) {
      objAlert = message.error('Total sale must be greater than total purchase !!')
      res.redirect('/sale/add/')
    } else {
      Model.Customer.findOne({
        where: {
          id: req.body.customerid,
        }
      })
      .then(function(customer) {
        Model.Setting.findAll()
        .then(function(setting) {
          let trx         = ''
          let trxName     = ''
          let trxRound    = ''
          let htmlReturn  = ''
          let pdfReturn   = ''
          let objSale     = {
            PurchaseId      : req.body.purchaseid,
            AgentId         : purchase.AgentId,
            UserId          : res.locals.userSession.id,
            CustomerId      : req.body.customerid,
            no_invoice      : req.body.no_invoice,
            price           : price,
            total_sale      : total_sale,
            payment_method  : payment_method,
            payment_date    : library.getMomentDate(req.body.payment_date),
            total_payment   : total_payment,
            status          : status,
            remark          : req.body.remark,
            createdAt       : Date.now(),
          }

          if (purchase.category == 1) {
            trx       = 'Voucher ' + purchase.getCategory()
            trxName   = `at ${purchase.hotel_name}`
          } else {
            trx       = 'Ticket ' + purchase.getCategory()
            trxName   = `${purchase.flightdeparture_airlinename} (${purchase.flightdeparture_airlinebook})`
            trxRound  = 'departure-'

            if (purchase.flightreturn_airlinebook != '') {
              htmlReturn = booking.letter(trx.toLowerCase(), purchase, customer, objSale, true)
              pdfReturn  = 'return-' + trx.toLowerCase().replace(' ', '-') + '-' + customer.name.replace(' ', '-') + '-' + purchase.booking_id + '.pdf'
            }
          }

          let isCreatePdf = true
          let htmlInvoice = invoice.sale(setting[0], trx.toLowerCase(), purchase, customer, objSale)
          let pdfInvoice  = 'invoice-' + customer.name.replace(' ', '-') + '-' + purchase.booking_id + '-' + invoice_status + '.pdf'
          let htmlBooking = booking.letter(trx.toLowerCase(), purchase, customer, objSale, false)
          let pdfBooking  = trxRound + trx.toLowerCase().replace(' ', '-') + '-' + customer.name.replace(' ', '-') + '-' + purchase.booking_id + '.pdf'
          let pdfOptions  = { format: 'Letter', orientation: 'portrait', border: '1cm', }
          let msg         = 'The system has been successfully execute: '

          // html-pdf-invoice
          pdf.create(htmlInvoice, pdfOptions)
          .toFile(path + pdfInvoice, function(err, res) {
            if (!err) {
              msg += 'create invoice, '
            } else {
              isCreatePdf = false
              objAlert    = message.error('Fail to create invoice, please try again !!')
            }
          })

          // html-pdf-voucher/ticket-departure
          pdf.create(htmlBooking, pdfOptions)
          .toFile(path + pdfBooking, function(err, res) {
            if (!err) {
              msg += `create ${trx.toLowerCase()} departure, `
            } else {
              isCreatePdf = false
              objAlert    = message.error(`Fail to create ${trx.toLowerCase()} departure, please try again !!`)
            }
          })

          // html-pdf-voucher/ticket-return
          if (pdfReturn != '') {
            pdf.create(htmlReturn, pdfOptions)
            .toFile(path + pdfReturn, function(err, res) {
              if (!err) {
                msg += `create ${trx.toLowerCase()} return, `
              } else {
                isCreatePdf = false
                objAlert    = message.error(`Fail to create ${trx.toLowerCase()} return, please try again !!`)
              }
            })
          }

          if (isCreatePdf) {
            if (req.body.notification != undefined) {
              // sending sms
              let objSms = {
                to    : `62${customer.mobile_no}`,
                text  : `[Trippediacity] Your ${trx} ${trxName} - Booking ID ${purchase.booking_id}. Please check your email for detail information.`,
              }
              send.sms(objSms, function(err, responseData) {
                if (!err) {
                  msg += `send SMS notification to ${customer.name} (+62${customer.mobile_no}), `
                  console.log(`send SMS notification to ${customer.name} (+62${customer.mobile_no})`);
                } else {
                  objAlert = message.error('Fail to send SMS, please try again !!')
                  console.log(err);
                }
              })

              // send email notification
              let arrAttachments = [{
                filename    : pdfInvoice.replace('.pdf', ''),
                path        : path + pdfInvoice,
                contentType : 'application/pdf',
              }, {
                filename    : pdfBooking.replace('.pdf', ''),
                path        : path + pdfBooking,
                contentType : 'application/pdf',
              }]
              if (pdfReturn != '') {
                arrAttachments.push({
                  filename    : pdfReturn.replace('.pdf', ''),
                  path        : path + pdfReturn,
                  contentType : 'application/pdf',
                })
              }
              let objMail = {
                to          : customer.email,
                subject     : `[Trippediacity] Your ${trx} ${trxName} - Booking ID ${purchase.booking_id}`,
                body        : email.booking_success(trx.toLowerCase(), purchase, customer),
                attachments : arrAttachments,
              }
              send.email(objMail, function(error, info) {
                if (!error) {
                  msg += `send email for invoice and ${trx.toLowerCase()} to ${customer.name} (${customer.email}) `
                  console.log(`send email for invoice and ${trx.toLowerCase()} to ${customer.name} (${customer.email})`);
                } else {
                  objAlert = message.error('Fail to send email, please try again !!')
                  console.log(error);
                }
              })
            }

            Model.Sale.create(objSale)
            .then(function() {
              Model.Purchase.update({status: 3}, {
                where: {
                  id: purchase.id,
                },
              })
              .then(function() {
                if (status == 3) {
                  Model.Sale.findOne({
                    where: {
                      UserId          : res.locals.userSession.id,
                      no_invoice      : req.body.no_invoice,
                    }
                  })
                  .then(function(sale) {
                    let profit            = Number(total_payment) - Number(purchase.total_payment)
                    let arrProfitCashflow = []

                    let promiseCashflow = new Promise(function(resolve, reject) {
                      Model.Cashflow.findAll({
                        limit: 1,
                        order: [['id', 'DESC']],
                      })
                      .then(function(cashflow) {
                        let lastSaldo = cashflow[0].saldo

                        let objCashflow = {
                          UserId          : res.locals.userSession.id,
                          code            : 3,
                          description     : getDesc(3),
                          no_transaction  : req.body.no_invoice,
                          value           : total_payment,
                          saldo           : Number(lastSaldo) + (Number(total_payment) - Number(profit)),
                          deduct_profit   : profit,
                          table_id        : sale.id,
                        }
                        Model.Cashflow.create(objCashflow)
                        .then(function() {
                          resolve()
                        })
                        .catch(function(err) {
                          reject(err)
                        })
                      })
                    })
                    arrProfitCashflow.push(promiseCashflow)

                    Model.Profit.findAll({
                      where: {
                        no_purchase : purchase.no_invoice,
                        status      : 2,
                      }
                    })
                    .then(function(findProfit) {
                      let totalSlot = 0
                      for (let i = 0; i < findProfit.length; i++) {
                        totalSlot += findProfit[i].user_slot
                      }

                      let adminFee        = (setting[0].admin_fee == '') ? 0 : (Number(setting[0].admin_fee) / 100) * Number(profit)
                      let optCosts        = (setting[0].operating_costs == '') ? 0 : (Number(setting[0].operating_costs) / 100) * Number(profit)
                      let totalNetProfit  = Number(profit) - (Number(adminFee) + Number(optCosts))
                      let profitSlot      = Number(totalNetProfit) / Number(totalSlot)
                      for (let i = 0; i < findProfit.length; i++) {
                        let promiseProfit = new Promise(function(resolve, reject) {
                          let objProfit = {
                            SaleId            : sale.id,
                            no_sale           : sale.no_invoice,
                            payment_sale      : sale.total_payment,
                            total_profit      : profit,
                            profit_slot       : profitSlot,
                            user_profit       : Number(profitSlot) * Number(findProfit[i].user_slot),
                            status            : status,
                            sales_tax         : null,
                            admin_fee         : adminFee,
                            operating_costs   : optCosts,
                            total_netprofit   : totalNetProfit,
                          }
                          Model.Profit.update(objProfit, {
                            where: {
                              id: findProfit[i].id,
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
                      }
                    })

                    Promise.all(arrProfitCashflow)
                    .then(function() {
                      objAlert = message.success(msg)
                      res.redirect('/sale')
                    })
                    .catch(function(err) {
                      Model.Cashflow.destroy({
                        where: {
                          code      : 3,
                          table_id  : sale.id,
                        }
                      })
                      Model.Sale.destroy({
                        where: {
                          no_invoice: req.body.no_invoice,
                          UserId    : res.locals.userSession.id,
                        }
                      })
                      objAlert = message.error(err.message)
                      res.redirect('/sale/add/')
                    })
                  })
                } else {
                  objAlert = message.success(msg)
                  res.redirect('/sale')
                }
              })
              .catch(function(err) {
                objAlert = message.error(err.message)
                res.redirect('/sale/add/')
              })
            })
            .catch(function(err) {
              objAlert = message.error(err.message)
              res.redirect('/sale/add/')
            })
          } else {
            res.redirect('/sale/add/')
          }
        })
      })
    }
  })
})

Router.get('/print/:id', (req, res) => {
  Model.Sale.findOne({
    where: {
      id: req.params.id,
    },
    include: [Model.Purchase, Model.Agent, Model.User, Model.Customer],
  })
  .then(function(sale) {
    Model.Setting.findAll()
    .then(function(setting) {
      res.render('./sale_print', {
        title       : title,
        action      : 'Invoice',
        new_button  : false,
        sale        : sale,
        setting     : setting[0],
        moment      : moment,
        alert       : objAlert,
      })
      objAlert = null
    })
  })
})

Router.get('/payment/:id', (req, res) => {
  Model.Sale.findOne({
    where: {
      id: req.params.id,
    },
    include: [Model.Purchase, Model.Agent, Model.User, Model.Customer],
  })
  .then(function(sale) {
    Model.Setting.findAll()
    .then(function(setting) {
      res.render('./sale_form', {
        title       : title,
        action      : 'Payment',
        new_button  : false,
        sale        : sale,
        customer    : sale.Customer,
        purchase    : sale.Purchase,
        setting     : setting[0],
        moment      : moment,
        alert       : objAlert,
      })
      objAlert = null
    })
  })
})

Router.post('/payment/:id', (req, res) => {
  let status          = 3
  let payment_method  = req.body.payment_method
  let total_payment   = req.body.total_payment

  if (payment_method == '' || total_payment == '') {
    objAlert = message.error('Payment must be filled !!')
    res.redirect('/sale/payment/' + req.params.id)
  } else {
    Model.Sale.findOne({
      where: {
        id: req.params.id,
      },
      include: [Model.Purchase, Model.Agent, Model.User, Model.Customer],
    })
    .then(function(sale) {
      Model.Setting.findAll()
      .then(function(setting) {
        total_payment = total_payment.replace(/,/g, '')

        let objSale     = {
          id              : req.params.id,
          no_invoice      : sale.no_invoice,
          price           : sale.price,
          total_sale      : sale.total_sale,
          payment_method  : payment_method,
          payment_date    : library.getMomentDate(req.body.payment_date),
          total_payment   : total_payment,
          status          : status,
          updatedAt       : Date.now(),
        }

        if (sale.Purchase.category == 1) {
          trx = 'Voucher ' + sale.Purchase.getCategory()
        } else {
          trx = 'Ticket ' + sale.Purchase.getCategory()
        }

        // html-pdf-invoice
        let msg         = 'The record has been successfully updated.'
        let isCreatePdf = true
        let htmlInvoice = invoice.sale(setting[0], trx.toLowerCase(), sale.Purchase, sale.Customer, objSale)
        let pdfInvoice  = 'invoice-' + sale.Customer.name.replace(' ', '-') + '-' + sale.Purchase.booking_id + '-paid.pdf'
        let pdfOptions  = { format: 'Letter', orientation: 'portrait', border: '1cm', }
        pdf.create(htmlInvoice, pdfOptions)
        .toFile(path + pdfInvoice, function(err, res) {
          if (!err) {
            msg += 'create paid invoice, '
          } else {
            isCreatePdf = false
            objAlert    = message.error('Fail to create paid invoice, please try again !!')
          }
        })

        if (isCreatePdf) {
          if (req.body.notification != undefined) {
            // send email notification
            let objMail = {
              to          : sale.Customer.email,
              subject     : `[Trippediacity] Your payment ${sale.no_invoice} - Booking ID ${sale.Purchase.booking_id} is successfully`,
              body        : email.payment_success(trx.toLowerCase(), sale, objSale),
              attachments : [{
                filename    : pdfInvoice.replace('.pdf', ''),
                path        : path + pdfInvoice,
                contentType : 'application/pdf',
              }],
            }
            send.email(objMail, function(error, info) {
              if (!error) {
                msg += `send email for invoice and ${trx.toLowerCase()} to ${sale.Customer.name} (${sale.Customer.email}) `
                console.log(`send email for invoice and ${trx.toLowerCase()} to ${sale.Customer.name} (${sale.Customer.email})`);
              } else {
                objAlert = message.error('Fail to send email, please try again !!')
                console.log(error);
              }
            })
          }

          Model.Sale.update(objSale, {
            where: {
              id: req.params.id,
            }
          })
          .then(function() {
            Model.Purchase.update({status: 3}, {
              where: {
                id: sale.Purchase.id,
              },
            })
            .then(function() {
              if (status == 3) {
                let profit            = Number(total_payment) - Number(sale.Purchase.total_payment)
                let arrProfitCashflow = []

                let promiseCashflow = new Promise(function(resolve, reject) {
                  Model.Cashflow.findAll({
                    limit: 1,
                    order: [['id', 'DESC']],
                  })
                  .then(function(cashflow) {
                    let lastSaldo = cashflow[0].saldo

                    let objCashflow = {
                      UserId          : res.locals.userSession.id,
                      code            : 3,
                      description     : getDesc(3),
                      no_transaction  : sale.no_invoice,
                      value           : total_payment,
                      saldo           : Number(lastSaldo) + (Number(total_payment) - Number(profit)),
                      deduct_profit   : profit,
                      table_id        : sale.id,
                    }
                    Model.Cashflow.create(objCashflow)
                    .then(function() {
                      resolve()
                    })
                    .catch(function(err) {
                      reject(err)
                    })
                  })
                })
                arrProfitCashflow.push(promiseCashflow)

                Model.Profit.findAll({
                  where: {
                    no_purchase : sale.Purchase.no_invoice,
                    status      : 2,
                  }
                })
                .then(function(findProfit) {
                  let totalSlot = 0
                  for (let i = 0; i < findProfit.length; i++) {
                    totalSlot += findProfit[i].user_slot
                  }

                  let adminFee        = (setting[0].admin_fee == '') ? 0 : (Number(setting[0].admin_fee) / 100) * Number(profit)
                  let optCosts        = (setting[0].operating_costs == '') ? 0 : (Number(setting[0].operating_costs) / 100) * Number(profit)
                  let totalNetProfit  = Number(profit) - (Number(adminFee) + Number(optCosts))
                  let profitSlot      = Number(totalNetProfit) / Number(totalSlot)
                  for (let i = 0; i < findProfit.length; i++) {
                    let promiseProfit = new Promise(function(resolve, reject) {
                      let objProfit = {
                        SaleId            : sale.id,
                        no_sale           : sale.no_invoice,
                        payment_sale      : total_payment,
                        total_profit      : profit,
                        profit_slot       : profitSlot,
                        user_profit       : Number(profitSlot) * Number(findProfit[i].user_slot),
                        status            : status,
                        sales_tax         : null,
                        admin_fee         : adminFee,
                        operating_costs   : optCosts,
                        total_netprofit   : totalNetProfit,
                      }
                      Model.Profit.update(objProfit, {
                        where: {
                          id: findProfit[i].id,
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
                  }
                })

                Promise.all(arrProfitCashflow)
                .then(function() {
                  objAlert = message.success(msg)
                  res.redirect('/sale')
                })
                .catch(function(err) {
                  Model.Cashflow.destroy({
                    where: {
                      code      : 3,
                      table_id  : sale.id,
                    }
                  })
                  Model.Sale.destroy({
                    where: {
                      no_invoice: req.body.no_invoice,
                      UserId    : res.locals.userSession.id,
                    }
                  })
                  objAlert = message.error(err.message)
                  res.redirect('/sale/add/')
                })
              } else {
                objAlert = message.success(msg)
                res.redirect('/sale')
              }
            })
            .catch(function(err) {
              objAlert = message.error(err.message)
              res.redirect('/sale/payment/' + req.params.id)
            })
          })
          .catch(function(err) {
            objAlert = message.error(err.message)
            res.redirect('/sale/payment/' + req.params.id)
          })
        } else {
          objAlert = message.error(msg)
          res.redirect('/sale/payment/' + req.params.id)
        }
      })
    })
  }
})

Router.get('/delete/:id', (req, res) => {
  Model.Sale.findByPk(req.params.id)
  .then(function(sale) {
    if (res.locals.userSession.role == 1 || sale.status < 3) {
      Model.Purchase.findOne({
        where: {
          id: sale.PurchaseId,
        }
      })
      .then(function(purchase) {
        let status = 1
        if (purchase.total_payment != '') {
          status = 2
        }

        let objProfit = {
          SaleId            : null,
          no_sale           : null,
          payment_sale      : null,
          total_profit      : null,
          profit_slot       : null,
          user_profit       : null,
          status            : status,
          sales_tax         : null,
          admin_fee         : null,
          operating_costs   : null,
          total_netprofit   : null,
        }
        Model.Profit.update(objProfit, {
          where: {
            SaleId      : sale.id,
            no_sale     : sale.no_invoice,
            no_purchase : purchase.no_invoice,
          }
        })
        .then(function() {
          Model.Cashflow.destroy({
            where: {
              code      : 3,
              table_id  : sale.id,
            }
          })
          .then(function() {
            // LOOPING UPDATE SALDO KARENA CASHFLOW DIHAPUS ATAU DI EDIT........................

            let objPurchase = {
              status : status,
            }
            Model.Purchase.update(objPurchase, {
              where: {
                id: sale.PurchaseId,
              },
            })
            .then(function() {
              Model.Sale.destroy({
                where: {
                  id: req.params.id,
                }
              })
              .then(function() {
                objAlert = message.success()
                res.redirect('/sale')
              })
              .catch(function(err) {
                objAlert = message.error(err.message)
                res.redirect('/sale')
              })
            })
          })
          .catch(function(err) {
            objAlert = message.error(err.message)
            res.redirect('/sale')
          })
        })
        .catch(function(err) {
          objAlert = message.error(err.message)
          res.redirect('/sale')
        })
      })
    } else {
      objAlert = message.error('Transaction rejected because has been used in another transaction !!')
      res.redirect('/sale')
    }
  })
})


module.exports = Router;
