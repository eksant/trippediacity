const Model = require('../models');
const express = require('express');
const Sequelize = require('sequelize');
const Router = express.Router();
const title = 'Trippediacity';

let message_login = null;
let message_reset = null;
let success_reset = null;

function getClientIp(req) {
  var ipAddress;
  var forwardedIpsStr = req.header('x-forwarded-for');

  if (forwardedIpsStr) {
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    ipAddress = req.connection.remoteAddress;
  }
  if (ipAddress == '::1' || ipAddress == '::ffff:127.0.0.1') {
    ipAddress = '127.0.0.1';
  }

  return ipAddress;
}

Router.get('/', (req, res) => {
  res.render('./login', {
    title: title,
    message_login: message_login,
    message_reset: message_reset,
    success_reset: success_reset,
  });
  message_login = null;
  message_reset = null;
  success_reset = null;
});

Router.post('/verification', (req, res) => {
  Model.User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (user == null) {
        message_login = 'Incorrect Username or Password !!';
        res.redirect('/login');
      } else {
        user.check_password(req.body.password, (isMatch) => {
          if (isMatch) {
            req.session.isLogin = true;
            req.session.user = user;
            let objLog = {
              UserId: user.id,
              username: user.username,
              ip_address: getClientIp(req),
              last_login: Date.now(),
              status: 'success',
            };
            Model.Log.create(objLog);
            res.redirect('/');
          } else {
            req.session.isLogin = false;
            req.session.user = undefined;
            message_login = 'Incorrect Username or Password !!';
            let objLog = {
              UserId: user.id,
              username: user.username,
              ip_address: getClientIp(req),
              last_login: Date.now(),
              status: 'danger',
              information: message_login,
            };
            Model.Log.create(objLog);
            res.redirect('/login');
          }
        });
      }
    })
    .catch((err) => {
      message_login = err.message;
      res.redirect('/login');
    });
});

module.exports = Router;
