const Model   = require('../models')
const message = require('./message')
const library = require('./library')
const express = require('express')
const moment  = require('moment')
const Router  = express.Router()

let objAlert  = null

Router.get('/transaction', (req, res) => {
  if (res.locals.userSession.role == 1) {
    var objFilterSale = {
      order: [
        ['createdAt', 'DESC'],
        ['no_invoice', 'ASC'],
      ],
      include: [Model.Purchase, Model.Agent, Model.User, Model.Customer],
    }
  } else {
    var objFilterSale = {
      where: {
        UserId: res.locals.userSession.id,
      },
      order: [
        ['createdAt', 'DESC'],
        ['no_invoice', 'ASC'],
      ],
      include: [Model.Purchase, Model.Agent, Model.User, Model.Customer],
    }
  }
  Model.Sale.findAll(objFilterSale)
  .then(function(sale) {
    Model.Setting.findAll()
    .then(function(setting) {
      res.render('./transaction_report', {
        title       : 'Transaction Report',
        action      : '',
        new_button  : false,
        sale        : sale,
        moment      : moment,
        setting     : setting[0],
        formatMoney : library.formatMoney,
        alert       : objAlert,
      })
      objAlert = null
    })
  })
})

Router.get('/purchase', (req, res) => {
  if (res.locals.userSession.role == 1) {
    var objFilterPurchase = {
      order: [
        ['createdAt', 'DESC'],
        ['no_invoice', 'ASC'],
      ],
      include: [Model.User, Model.Agent],
    }
  } else {
    var objFilterPurchase = {
      where: {
        UserId: res.locals.userSession.id,
      },
      order: [
        ['createdAt', 'DESC'],
        ['no_invoice', 'ASC'],
      ],
      include: [Model.User, Model.Agent],
    }
  }
  Model.Purchase.findAll(objFilterPurchase)
  .then(function(purchase) {
    Model.Setting.findAll()
    .then(function(setting) {
      res.render('./purchase_report', {
        title       : 'Purchase Report',
        action      : '',
        new_button  : false,
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

Router.get('/sale', (req, res) => {
  if (res.locals.userSession.role == 1) {
    var objFilterSale = {
      order: [
        ['createdAt', 'DESC'],
        ['no_invoice', 'ASC'],
      ],
      include: [Model.Purchase, Model.Agent, Model.User, Model.Customer],
    }
  } else {
    var objFilterSale = {
      where: {
        UserId: res.locals.userSession.id,
      },
      order: [
        ['createdAt', 'DESC'],
        ['no_invoice', 'ASC'],
      ],
      include: [Model.Purchase, Model.Agent, Model.User, Model.Customer],
    }
  }
  Model.Sale.findAll(objFilterSale)
  .then(function(sale) {
    Model.Setting.findAll()
    .then(function(setting) {
      res.render('./sale_report', {
        title       : 'Sale Report',
        action      : '',
        new_button  : false,
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

Router.get('/cashflow', (req, res) => {
  let objFilterCashflow = {
    order: [
      ['id', 'DESC'],
      ['createdAt', 'DESC'],
    ],
    include: [Model.User],
  }
  Model.Cashflow.findAll(objFilterCashflow)
  .then(function(cashflow) {
    Model.Setting.findAll()
    .then(function(setting) {
      res.render('./cashflow_report', {
        title       : 'Cashflow Report',
        action      : '',
        new_button  : false,
        cashflow    : cashflow,
        setting     : setting[0],
        moment      : moment,
        formatMoney : library.formatMoney,
        alert       : objAlert,
      })
      objAlert = null
    })
  })
})

Router.get('/profit', (req, res) => {
  if (res.locals.userSession.role == 1) {
    var objFilterProfit = {
      where: {
        status: 3,
      },
      order: [
        ['createdAt', 'ASC'],
        ['no_sale', 'ASC'],
      ],
      include: [Model.User, Model.Sale],
    }
  } else {
    var objFilterProfit = {
      where: {
        UserId: res.locals.userSession.id,
        status: 3,
      },
      order: [
        ['createdAt', 'ASC'],
        ['no_sale', 'ASC'],
      ],
      include: [Model.User, Model.Sale],
    }
  }
  Model.Profit.findAll(objFilterProfit)
  .then(function(profit) {
    Model.Setting.findAll()
    .then(function(setting) {
      res.render('./profit_report', {
        title       : 'Profit Report',
        action      : '',
        new_button  : false,
        profit      : profit,
        setting     : setting[0],
        moment      : moment,
        formatMoney : library.formatMoney,
        alert       : objAlert,
      })
      objAlert = null
    })
  })
})

module.exports = Router;
