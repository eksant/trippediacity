const Model   = require('../models')
const message = require('./message')
const express = require('express')
const Router  = express.Router()
const title   = 'Agent'

let objAlert  = null

Router.get('/', (req, res) => {
  Model.Agent.findAll({
    order: ['name'],
  })
  .then(function(agent) {
    Model.Setting.findAll()
    .then(function(setting) {
      res.render('./agent', {
        title       : title,
        action      : '',
        new_button  : true,
        agent       : agent,
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
      res.redirect('/agent')
    } else {
      res.render('./agent_form', {
        title       : title,
        action      : 'Add',
        new_button  : false,
        agent       : false,
        setting     : setting[0],
        alert       : objAlert,
      })
      objAlert = null
    }
  })
})

Router.post('/add', (req, res) => {
  let objAgent = {
    code      : req.body.code,
    name      : req.body.name,
    phone_no  : req.body.phone_no,
    address   : req.body.address,
    createdAt : Date.now(),
    updatedAt : Date.now(),
  }
  Model.Agent.create(objAgent)
  .then(function() {
    objAlert = message.success()
    res.redirect('/agent')
  })
  .catch(function(err) {
    objAlert = message.error(err.message)
    res.redirect('/agent/add')
  })
})

Router.get('/edit/:id', (req, res) => {
  Model.Agent.findById(req.params.id)
  .then(function(agent) {
    Model.Setting.findAll()
    .then(function(setting) {
      res.render('./agent_form', {
        title       : title,
        action      : 'Edit',
        new_button  : false,
        agent       : agent,
        setting     : setting[0],
        alert       : objAlert,
      })
      objAlert = null
    })
  })
})

Router.post('/edit/:id', (req, res) => {
  let objAgent = {
    id        : req.params.id,
    code      : req.body.code,
    name      : req.body.name,
    phone_no  : req.body.phone_no,
    address   : req.body.address,
    updatedAt : new Date(),
  }
  Model.Agent.update(objAgent, {
    where: {
      id: req.params.id,
    }
  })
  .then(function() {
    objAlert = message.success()
    res.redirect('/agent')
  })
  .catch(function(err) {
    objAlert = message.error(err.message)
    res.redirect(`/agent/edit/${req.params.id}`)
  })
})

Router.get('/delete/:id', (req, res) => {
  Model.Purchase.findOne({
    where: {
      AgentId: req.params.id,
    }
  })
  .then(function(purchase) {
    console.log(purchase);
    if (!purchase) {
      Model.Agent.destroy({
        where: {
          id: req.params.id,
        }
      })
      .then(function() {
        objAlert = message.success()
        res.redirect('/agent')
      })
      .catch(function(err) {
        objAlert = message.error(err.message)
        res.redirect('/agent/')
      })
    } else {
      objAlert = message.error('Agent cannot to deleted because have another transaction !!')
      res.redirect('/agent/')
    }
  })
})

module.exports = Router;
