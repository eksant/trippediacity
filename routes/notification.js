const Model       = require('../models')
const nodemailer  = require('nodemailer')
const Nexmo       = require('nexmo')

exports.email = function(obj, callback) {
  Model.Setting.findByPk(1)
  .then(function(setting) {
    if (setting.mail_host != '' && setting.mail_username != '') {
      let secure = true
      if (setting.mail_secure == 2) {
        secure = false
      }
      let transporter = nodemailer.createTransport({
        poll  : true,
        host  : setting.mail_host,
        port  : setting.mail_port,
        secure: secure, // true for 465, false for other ports
        auth: {
            user: setting.mail_username, // generated ethereal user
            pass: setting.mail_password,  // generated ethereal password
        }
      })
      let mailOptions = {
        from        : 'Trippediacity <services@trippediacity.com>', // sender address
        to          : obj.to, //profile.email, // list of receivers
        subject     : obj.subject, //'[Trippediacity] Request Reset Your Password', // Subject line
        html        : obj.body, //htmlmail.EmailBody(req.headers.host + '/reset/' + token), // html body
        attachments : obj.attachments,
      }
      transporter.sendMail(mailOptions, (error, info) => {
        callback(error, info)
      })
    }
  })
}

exports.sms = function(obj, callback) {
  Model.Setting.findByPk(1)
  .then(function(setting) {
    if (setting.sms_apikey != '' && setting.sms_apisecret != '') {
      const nexmo = new Nexmo({
        apiKey    : setting.sms_apikey,
        apiSecret : setting.sms_apisecret,
      })

      let from  = 'NEXMO';
      let to    = obj.to;
      let text  = obj.text;
      nexmo.message.sendSms(from, to, text, {type: 'unicode'}, function(err, responseData) {
        callback(err, responseData)
      })
    }
  })
}
