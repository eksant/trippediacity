'use strict';

exports.null = function () {
  return null
}

exports.success = function (text = '') {
  let msg = 'The record has been successfully updated.'
  if (text != '') {
    msg = text
  }
  return {
    msg   : msg,
    type  : 'success',
  }
}

exports.error = function (err) {
  return {
    msg   : err,
    type  : 'danger',
  }
}
