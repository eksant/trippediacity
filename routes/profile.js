const Model   = require('../models')
const message = require('./message')
const multer  = require('multer')
const express = require('express')
const Router  = express.Router()
const title   = 'Profile'

let objAlert  = null

Router.get('/', (req, res) => {
  Model.User.findOne({
    where: {
      id: res.locals.userSession.id
    },
  })
  .then(function(user) {
    Model.Log.findAll({
      order: [
        ['last_login', 'DESC']
      ],
      limit: 5,
      where: {
        username: user.username,
      }
    })
    .then(function(log) {
      Model.Setting.findAll()
      .then(function(setting) {
        res.render('./profile', {
          title       : title,
          action      : '',
          new_button  : false,
          user        : user,
          setting     : setting[0],
          log         : log,
          alert       : objAlert,
        })
        objAlert = null
      })
    })
  })
})

Router.post('/upload', (req, res) => {
  Model.User.findOne({
    where: {id: res.locals.userSession.id},
  })
  .then(function(user) {
    const fileName = 'photo_' + Date.now() + '_'
    const Storage = multer.diskStorage({
      destination: function(req, file, callback) {
        callback(null, "./public/uploads/profile/");
      },
      filename: function(req, file, callback) {
        callback(null, fileName + file.originalname.split(' ').join('_').toLowerCase());
      }
    });

    var upload = multer({ storage: Storage }).single('photo_profile')
    upload(req, res, function(err) {
      if (!err) {
        let objProfile = {
          photo     : fileName + req.file.originalname.split(' ').join('_').toLowerCase(),
          updatedAt : new Date(),
        }
        Model.User.update(objProfile, {
          where: {
            id: user.id,
          }
        })
        .then(function() {
          objAlert = message.success()
          res.redirect('/profile')
        })
        .catch(function(err) {
          objAlert = message.error(err.message)
          res.redirect('/profile')
        })
      } else {
        objAlert = message.error(err.message)
        res.redirect('/profile')
      }
    })
  })
})

Router.post('/edit', (req, res) => {
  if (req.body.new_password != '') {
    if (req.body.new_password != req.body.new_password_repeat) {
      objAlert = message.error('Incorrect your repeat new password !!')
      res.redirect('/profile')
    }
  }

  var hooks = true
  if (req.body.new_password == '') {
    hooks = false
    var objUser = {
      id            : res.locals.userSession.id,
      name          : req.body.name,
      company_name  : req.body.company_name,
      company_phone : req. body.company_phone,
      email         : req.body.email,
      mobile_no     : req.body.mobile_no,
      address       : req.body.address,
      updatedAt     : new Date(),
    }
  } else {
    var objUser = {
      id            : res.locals.userSession.id,
      name          : req.body.name,
      password      : req.body.new_password,
      company_name  : req.body.company_name,
      company_phone : req. body.company_phone,
      email         : req.body.email,
      mobile_no     : req.body.mobile_no,
      address       : req.body.address,
      updatedAt     : new Date(),
    }
  }
  Model.User.update(objUser, {
    where: {
      id: res.locals.userSession.id,
    },
    individualHooks: hooks,
  })
  .then(function() {
    objAlert = message.success()
    res.redirect('/profile')
  })
  .catch(function(err) {
    objAlert = message.error(err.message)
    res.redirect('/profile')
  })
})

module.exports = Router;
