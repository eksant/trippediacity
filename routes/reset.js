const Model       = require('../models')
const message     = require('./message')
const send        = require('./notification')
const email       = require('./templateemail')
const crypto      = require('crypto')
const express     = require('express')
const Router      = express.Router()
const title       = 'Reset Password'

function randomValueBase64 (len) {
  return 'TPC-' + crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')   // convert to base64 format
        .slice(0, len)        // return required number of characters
        .replace(/\+/g, '0')  // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
}

Router.post('/', (req, res) => {
  Model.User.findOne({
    where: {
      email: req.body.email,
    }
  })
  .then(function(user) {
    if (user) {
      let link  = req.headers.host + '/reset/'
      let token = randomValueBase64(64)
      let objMail = {
        to      : user.email,
        subject : '[Trippediacity] Request Reset Your Password',
        body    : email.reset_password(user, link + token),
      }

      send.email(objMail, function(error, info) {
        if (!error) {
          let objReset = {
            reset_password_token    : token,
            reset_password_expires  : Date.now() + 3600000,
          }
          Model.User.update(objReset, {
            where: {
              id: user.id,
            },
          })
          .then(function() {
            res.render('./login', {
              title         : title,
              message_login : null,
              message_reset : null,
              success_reset : 'Great. We have sent you an email. Please check your email !!',
            })
          })
        } else {
          res.render('./login', {
            title         : title,
            message_login : null,
            message_reset : error,
            success_reset : null,
          })
        }
      })
    } else {
      res.render('./login', {
        title         : title,
        message_login : null,
        message_reset : 'Incorrect Email !!',
        success_reset : null,
      })
    }
  })
})

Router.get('/:token', (req, res) => {
  Model.User.findOne({
    where: {
      reset_password_token  : req.params.token,
    }
  })
  .then(function(user) {
    if (user) {
      console.log('user.reset_password_expires ============', user.reset_password_expires);
      console.log('Date.now() ==========================', Date.now());
      if (user.reset_password_expires >= Date.now()) {
        res.render('./reset_form', {
          title   : title,
          message : null,
          type    : null,
        })
      } else {
        res.render('./login', {
          title         : title,
          message_login : null,
          message_reset : 'The password reset link was invalid / expired (valid for 1 hours), possibly because it has already been used. Please request a new password reset.',
          success_reset : null,
        })
      }
    } else {
      res.render('./login', {
        title         : title,
        message_login : null,
        message_reset : 'The password reset link was invalid / expired (valid for 1 hours), possibly because it has already been used. Please request a new password reset.',
        success_reset : null,
      })
    }
  })
})

Router.post('/:token', (req, res) => {
  if (req.body.new_password == '') {
    res.render('./reset_form', {
      title   : title,
      message : 'Please enter your new password !!',
      type    : 'danger',
    })
  } else if (req.body.confirm_password == '') {
    res.render('./reset_form', {
      title   : title,
      message : 'Please enter your password confirmation !!',
      type    : 'danger',
    })
  } else if (req.body.new_password != req.body.confirm_password) {
    res.render('./reset_form', {
      title   : title,
      message : 'Confirm password is not same with new password !!',
      type    : 'danger',
    })
  } else {
    Model.User.findOne({
      where: {
        reset_password_token  : req.params.token,
      }
    })
    .then(function(user) {
      if (user) {
        if (user.reset_password_expires >= Date.now()) {
          let objResetPassword = {
            password                : req.body.new_password,
            reset_password_token    : null,
            reset_password_expires  : null,
            updatedAt               : new Date(),
          }
          Model.User.update(objResetPassword, {
            where: {
              id: user.id
            },
            individualHooks: true,
          })
          .then(function() {
            res.render('./reset_form', {
              title   : title,
              message : 'New Password successfully to updated.',
              type    : 'success',
            })
          })
        } else {
          res.render('./login', {
            title         : title,
            message_login : null,
            message_reset : 'The password reset link was invalid / expired (valid for 1 hours), possibly because it has already been used. Please request a new password reset.',
            success_reset : null,
          })
        }
      } else {
        res.redirect('/login')
      }
    })
  }
})

module.exports = Router;
