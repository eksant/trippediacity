const Model   = require('../models')
const message = require('./message')
const express = require('express')
const Op      = require('sequelize').Op
const Router  = express.Router()
const title   = 'Customer'

let objAlert  = null

Router.get('/', (req, res) => {
  Model.Customer.findAll({
    order: ['name'],
  })
  .then((customer) => {
    Model.Setting.findAll()
    .then(function(setting) {
      res.render('./customer', {
        title       : title,
        action      : '',
        new_button  : true,
        customer    : customer,
        setting     : setting[0],
        alert       : objAlert,
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
      res.redirect('/customer')
    } else {
      res.render('./customer_form', {
        title       : title,
        action      : 'Add',
        new_button  : false,
        customer    : false,
        setting     : setting[0],
        alert       : objAlert,
      })
      objAlert = null
    }
  })
})

Router.post('/add', (req, res) => {
  Model.User.findAll({
    where: {
      [Op.or]: [{username: req.body.username}, {email: req.body.email}]
    }
  })
  .then(function(user) {
    if (user.length == 0) {
      let objCustomer = {
        name            : req.body.name,
        username        : req.body.username,
        password        : req.body.password,
        role            : 4,
        gender          : req.body.gender,
        mobile_no       : req.body.mobile_no,
        email           : req.body.email,
        address         : req.body.address,
        company_name    : req.body.company_name,
        company_phone   : req.body.company_phone,
        company_address : req.body.company_address,
        createdAt       : Date.now(),
        updatedAt       : Date.now(),
      }
      Model.Customer.create(objCustomer)
      .then(function() {
        objAlert = message.success()
        res.redirect('/customer')
      })
      .catch(function(err) {
        objAlert = message.error(err.message)
        res.redirect('/customer/add/')
      })
    } else {
      objAlert = message.error('Username or email already used !!')
      res.redirect('/customer/add/')
    }
  })
})

Router.get('/edit/:id', (req, res) => {
  Model.Customer.findOne({
    where: {
      id: req.params.id
    },
  })
  .then(function(customer) {
    Model.Setting.findAll()
    .then(function(setting) {
      res.render('./customer_form', {
        title       : title,
        action      : 'Edit',
        new_button  : false,
        customer    : customer,
        setting     : setting[0],
        alert       : objAlert,
      })
      objAlert = null
    })
  })
})

Router.post('/edit/:id', (req, res) => {
  Model.User.findAll({
    where: {
      [Op.or]: [{username: req.body.username}, {email: req.body.email}]
    }
  })
  .then(function(user) {
    if (user.length == 0) {
      Model.Customer.findById(req.params.id)
      .then(function(customer) {
        let hooks = true
        let objCustomer = {
          id              : req.params.id,
          name            : req.body.name,
          username        : req.body.username,
          password        : req.body.password,
          role            : 4,
          gender          : req.body.gender,
          mobile_no       : req.body.mobile_no,
          email           : req.body.email,
          address         : req.body.address,
          company_name    : req.body.company_name,
          company_phone   : req.body.company_phone,
          company_address : req.body.company_address,
          updatedAt       : new Date(),
        }
        if (customer.password == req.body.password) {
          hooks = false
        }
        Model.Customer.update(objCustomer, {
          where: {
            id: req.params.id,
          },
          individualHooks: hooks,
        })
        .then(function() {
          objAlert = message.success()
          res.redirect('/customer')
        })
        .catch(function(err) {
          objAlert = message.error(err.message)
          res.redirect('/customer/edit/' + req.params.id)
        })
      })
    } else {
      objAlert = message.error('Username or email already used !!')
      res.redirect('/customer/edit/' + req.params.id)
    }
  })
})

Router.get('/delete/:id', (req, res) => {
  Model.Sale.findOne({
    where: {
      CustomerId: req.params.id,
    }
  })
  .then(function(sale) {
    if (!sale) {
      Model.Customer.destroy({
        where: {
          id: req.params.id,
        }
      })
      .then(function() {
        objAlert = message.success()
        res.redirect('/customer')
      })
      .catch(function(err) {
        objAlert = message.error(err.message)
        res.redirect('/customer/')
      })
    } else {
      objAlert = message.error('Customer cannot to deleted because have another transaction !!')
      res.redirect('/customer/')
    }
  })
})

module.exports = Router;
