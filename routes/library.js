'uses strict'
const moment  = require('moment')

exports.parseDate = function(str) {
  console.log('parseDate ===========', str);
  if (str == '') {
    return ''
  }
  let xstr = moment(str).format('D-M-YYYY')
  let dmy = xstr.split('-');
  return new Date(dmy[2], dmy[1]-1, dmy[0])
}

exports.dayDiff = function(start, end) {
  console.log('dayDiff start ===========', start);
  console.log('dayDiff end ===========', end);
  if (start == '' || end == '') {
    return null
  }
  let start_dmy   = start.split('-')
  let end_dmy     = end.split('-')
  let start_date  = new Date(start_dmy[2], start_dmy[1]-1, start_dmy[0])
  let end_date    = new Date(end_dmy[2], end_dmy[1]-1, end_dmy[0])
  return Math.round((end_date - start_date)/(1000 * 60 * 60 * 24))
}

exports.getMomentDate = function(str) {
  console.log('getMomentDate ===========', str);
  if (str == '') {
    return null
  }
  let dmy = str.split('-')
  let res = dmy[2].trim() + '-' + dmy[1].trim() + '-' + dmy[0].trim()
  return res.trim()
}

exports.getMomentDateTime = function(str) {
  let res = null
  if (str.trim() != '') {
    console.log('getMomentDateTime str ===========', str);
    let dmy = str.split('-')
    let hms = dmy[2].split(' ')
    res = hms[0].trim() + '-' + dmy[1].trim() + '-' + dmy[0].trim() + ' ' + hms[1].trim() + ':00.000 +00:00'
  }
  console.log('getMomentDateTime ===========', res);
  return res
}

exports.getTime = function(str) {
  console.log('getTime ===========', str);
  if (str == '') {
    return null
  }
  let dmy = str.trim().substring(str.indexOf('T')+1, str.indexOf('T')+6);
  return dmy;
}

exports.formatMoney = function(number, places = 0, symbol = '', thousand, decimal) {
	number = number || 0;
	places = !isNaN(places = Math.abs(places)) ? places : 2;
	symbol = symbol !== undefined ? symbol : "IDR";
	thousand = thousand || ",";
	decimal = decimal || ".";
	var negative = number < 0 ? "-" : "",
	    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
	    j = (j = i.length) > 3 ? j % 3 : 0;
	var result = symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
  return (result != 0) ? result : ""
}
