const Model   = require('../models')
const express = require('express')
const Router  = express.Router()

Router.get('/', (req, res) => {
  Model.Setting.findAll()
  .then(function(setting) {
    res.render('index', {
      title       : 'Dashboard',
      action      : '',
      new_button  : false,
      alert       : null,
      setting     : setting[0],
    })
  })
})

module.exports = Router;
