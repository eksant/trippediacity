const Model     = require('../models')
const moment    = require('moment')


function getDate(date) {
  return moment(date).format('D MMM Y')
}

function getTime(str) {
  if (str == '' || str == null) {
    return ''
  }
  let dmy = str.trim().substring(str.indexOf('T')+1, str.indexOf('T')+6);
  return dmy;
}

function parseDate(str) {
  if (str == '' || str == null) {
    return ''
  }
  let xstr = moment(str).format('D-M-YYYY')
  let dmy = xstr.split('-');
  return new Date(dmy[2], dmy[1]-1, dmy[0])
}

function dayDiff(start, end) {
  if (start == '' || start == null || end == '' || end == null) {
    return ''
  }
  return Math.round((end - start)/(1000 * 60 * 60 * 24))
}

function formatMoney(number, places = 0, symbol = '', thousand, decimal) {
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


exports.sale = function(setting, trx, purchase, customer, sale) {
  var getGender         = 'Mr.'
  var getStatusPayment  = 'Pending'
  var getDescription_1  = ''
  var getDescription_2  = ''
  var getDescription_3  = ''
  var getDescription_4  = ''
  var getDescription_5  = ''
  var getDescription_6  = ''
  var getQty            = ''
  var getRemark         = ''

  if (customer.gender == 2) {
    getGender = 'Mrs.'
  }

  if (sale.status == 3) {
    getStatusPayment = 'Paid'
    getDescription_6 = `Payment Date: ${getDate(sale.payment_date)}<br>`
  }

  if (purchase.category == 1) {
    getDescription_1  = `Check-in: ${getDate(purchase.hotel_startdate)} - Check-out: ${getDate(purchase.hotel_enddate)}`
    getDescription_2  = purchase.hotel_name
    getDescription_3  = `Address: ${purchase.hotel_address}`
    getDescription_4  = `Phone: +62${purchase.hotel_phone}`
    getDescription_5  = (purchase.hotel_note != '') ? `Note: ${purchase.hotel_note}` : ''
    getQty            = dayDiff(parseDate(purchase.hotel_startdate), parseDate(purchase.hotel_enddate))
  } else {
    getDescription_1  = `Departure Date: ${getDate(purchase.flightdeparture_startdate)} ${getTime(purchase.flightdeparture_starttime)}`
    getDescription_2  = `${purchase.flightdeparture_airlinename} - ${purchase.flightdeparture_airlinebook}`
    getDescription_3  = `Origin: ${purchase.flightdeparture_airportfrom}`
    getDescription_4  = `Destination: ${purchase.flightdeparture_airportto}`
    getDescription_5  = (purchase.flightdeparture_note != '') ? `Note: ${purchase.flightdeparture_note}` : ''
    getQty            = 1
  }

  if (sale.remark != undefined) {
    getRemark = `Note: ${sale.remark}`
  }

  return `
  <!DOCTYPE html>
  <html>
  <head>
  	<title>HTML to API - Invoice</title>
  	<link href='https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,300,700&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
  	<meta content="width=device-width, initial-scale=1.0" name="viewport">
  	<meta http-equiv="content-type" content="text-html; charset=utf-8">
  	<style type="text/css">
  		html, body, div, span, applet, object, iframe,
  		h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  		a, abbr, acronym, address, big, cite, code,
  		del, dfn, em, img, ins, kbd, q, s, samp,
  		small, strike, strong, sub, sup, tt, var,
  		b, u, i, center,
  		dl, dt, dd, ol, ul, li,
  		fieldset, form, label, legend,
  		table, caption, tbody, tfoot, thead, tr, th, td,
  		article, aside, canvas, details, embed,
  		figure, figcaption, footer, header, hgroup,
  		menu, nav, output, ruby, section, summary,
  		time, mark, audio, video {
  			margin: 0;
  			padding: 0;
  			border: 0;
  			font: inherit;
  			font-size: 100%;
  			vertical-align: baseline;
  		}

  		html {
  			line-height: 1;
  		}

  		ol, ul {
  			list-style: none;
  		}

  		table {
  			border-collapse: collapse;
  			border-spacing: 0;
  		}

  		caption, th, td {
  			text-align: left;
  			font-weight: normal;
  			vertical-align: middle;
  		}

  		q, blockquote {
  			quotes: none;
  		}
  		q:before, q:after, blockquote:before, blockquote:after {
  			content: "";
  			content: none;
  		}

  		a img {
  			border: none;
  		}

  		article, aside, details, figcaption, figure, footer, header, hgroup, main, menu, nav, section, summary {
  			display: block;
  		}

  		body {
  			font-family: 'Source Sans Pro', sans-serif;
  			font-weight: 500;
  			font-size: 5px !important;
  			margin: 0;
  			padding: 0;
  		}
  		body a {
  			text-decoration: none;
  			color: inherit;
  		}
  		body a:hover {
  			color: inherit;
  			opacity: 0.7;
  		}
  		body .container {
  			min-width: 500px;
  			margin: 0 auto;
  			padding: 0 20px;
  		}
  		body .clearfix:after {
  			content: "";
  			display: table;
  			clear: both;
  		}
  		body .left {
  			float: left;
  		}
  		body .middle {
  			float: middle;
  		}
  		body .right {
  			float: right;
  		}
  		body .helper {
  			display: inline-block;
  			height: 100%;
  			vertical-align: middle;
  		}
  		body .no-break {
  			page-break-inside: avoid;
  		}

  		header {
  			margin-top: 20px;
  			margin-bottom: 10px;
  		}
  		header figure {
  			float: left;
  			width: 48px;
  			height: 27px;
  			margin-right: 10px;
  			border-radius: 50%;
  			text-align: center;
  		}
  		header figure img {
  			margin-top: 0px;
  			width: 54px;
  			height: 20px;
  		}
  		header .company-address {
  			float: left;
  			max-width: 100px;
  			line-height: 1.7em;
  			font-size: 5px;
  		}
  		header .company-address .title {
  			color: #FF9933;
  			font-weight: 400;
  			font-size: 5px;
  			text-transform: uppercase;
  		}
  		header .company-contact {
  			float: right;
  			height: 30px;
  			padding: 0 10px;
  			background-color: #FF9933;
  			color: white;
  			max-width: 300px;
  		}
  		header .company-contact span {
  			display: inline-block;
  			vertical-align: middle;
  		}
  		header .company-contact .circle {
  			width: 15px;
  			height: 15px;
  			background-color: white;
  			border-radius: 50%;
  			text-align: center;
  		}
  		header .company-contact .circle img {
  			vertical-align: middle;
  		}
  		header .company-contact .website {
  			height: 100%;
  			margin-right: 10px;
  			font-size: 5px;
  		}
  		header .company-contact .email {
  			height: 100%;
  			margin-right: 10px;
  			font-size: 5px;
  		}
  		header .company-contact .phone {
  			height: 100%;
  			font-size: 5px;
  		}

  		section .details {
  			margin-bottom: 10px;
  		}
  		section .details .client {
  			font-size: 6px;
  			width: 50%;
  			line-height: 10px;
  		}
  		section .details .client .name {
  			color: #FF9933;
  			font-weight: 600;
  		}
  		section .details .data {
  			font-size: 6px;
  			width: 50%;
  			text-align: right;
  		}
  		section .details .title {
  			margin-bottom: 5px;
  			color: #FF9933;
  			font-size: 7px;
  			font-weight: 600;
  			text-transform: uppercase;
  		}
  		section table {
  			width: 100%;
  			border-collapse: collapse;
  			border-spacing: 0;
  			font-size: 6px;
  			font-weight: 600;
  		}
  		section table .qty {
  			width: 5%;
  			vertical-align: top;
  		}
  		section table .unit, section table .total {
  			width: 15%;
  			vertical-align: top;
  		}
  		section table .desc {
  			width: 65%;
  			vertical-align: top;
  		}
  		section table thead {
  			display: table-header-group;
  			vertical-align: middle;
  			border-color: inherit;
  		}
  		section table thead th {
  			padding: 5px 10px;
  			background: #FF9933;
  			border-bottom: 2px solid #FFFFFF;
  			border-right: 2px solid #FFFFFF;
  			text-align: right;
  			color: white;
  			font-weight: 600;
  			text-transform: uppercase;
  		}
  		section table thead th:last-child {
  			border-right: none;
  		}
  		section table thead .desc {
  			text-align: left;
  		}
  		section table thead .qty {
  			text-align: center;
  		}
  		section table tbody td {
  			padding: 10px;
  			background: #f2f2f2;
  			color: #777777;
  			text-align: right;
  			border-bottom: 2px solid #FFFFFF;
  			border-right: 2px solid #f2f2f2	;
        font-size: 5px;
        line-height: 8px;
  		}
  		section table tbody td:last-child {
  			border-right: none;
  		}
  		section table tbody h3 {
  			margin-bottom: 5px;
  			color: #FF9933;
  			font-weight: 600;
        font-size: 6px;
  		}
  		section table tbody .desc {
  			text-align: left;
  		}
  		section table tbody .qty {
  			text-align: center;
  		}
  		section table.grand-total {
  			margin-bottom: 5px;
  		}
  		section table.grand-total td {
  			padding: 5px 10px;
  			border: none;
  			color: #777777;
  			text-align: right;
  			font-weight: 600;
  		}
  		section table.grand-total .desc {
  			background-color: transparent;
  		}
  		section table.grand-total tr:last-child td {
  			font-weight: 600;
  			color: #FF9933;
  		}

  		footer {
  			margin-bottom: 20px;
  		}
  		footer .notice {
  			margin-bottom: 45px;
  			font-size: 5px;
  		}
  		footer .thanks {
  			margin-bottom: 10px;
  			color: #FF9933;
  			font-size: 5px;
  		}
  		footer .end {
  			padding-top: 5px;
  			border-top: 1px solid #FF9933;
  			text-align: center;
  			font-size: 5px;
        font-weight: 400;
  		}
  	</style>
  </head>

  <body>
  	<header class="clearfix">
  		<div class="container">
  			<figure>
  				<img class="logo" src="data:image/png;base64,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" alt="">
  			</figure>
  			<div class="company-address">
  				<h2 class="title">PT. Buana Amalia Mandiri</h2>
  				<p>
  					Jl. Sentosa Barat Blok HG No. 30, Bekasi<br>
  					+6221 2210-4683
  				</p>
  			</div>
  			<div class="company-contact">
  				<div class="website left">
  					<span class="circle"><img height="15" width="15"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAQK0lEQVRYCQEgEN/vAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8QAAAAUQAAAEwAAAAlAAAAFAAAABEAAAAAAAAA7wAAAOwAAADbAAAAtAAAAK8BAQHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////J////7P////6//////////////////////////////////////////////////////////r///+z////JgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wr///+e////+v//////////////////////////////////////////////////////////////////////////////+v///57///8KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAA////HgAAALcAAAAqAAAAAAAAAAAAAAAAAAAAAAD+/QAA7dkAAO/eAAD48QAAAAAAAAgPAAASJAAAEyYAAAECAAAAAAAAAAAAAAAAAAAAAAAAAADWAAAASQEBAeIAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAD///84AAAAsgAAABUAAAAAAAAAAAAAAAAA7doAANWpAADduwAA+/YAAAAAAAAAAAAABgwAAAECAAD58gAABg0AACNFAAArVgAAEiQAAAAAAAAAAAAAAAAAAAAA6wAAAE4BAQHIAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAP///x8AAADMAAAAFAAAAAAAAAAAAPv2AADHjQAA3LoAAPz3AAAAAAAAAAAAAAAAAAAPHgAAM2UAABo1AADy5QAAzpsAAOTIAAABAgAAKFAAADlyAAAECAAAAAAAAAAAAAAAAOsAAAA0AQEB4gAAAAAAAAAAAQAAAAAAAAAA////CgAAAMwAAAApAAAAAAAAAAAA9+4AAMePAAAoTgAAFi4AANGhAADfvwAA9ekA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AADcugAA+vMAAAAAAAAAAAAABAcAADZtAADKlQAAAQEAACNGAAArVgAAEyYAAAAAAAAAAAAAAAAAAAAA6wAAAE4BAQHIAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAA////HgAAALcAAAAqAAAAAAAAAAAAAAAAAAAAAAD//gAA7dsAAO7cAAD48AAAAAAAAAgQAAASIgAAEiYAAAIDAAAAAAAAAAAAAAAAAAAAAAAAAADVAAAASgEBAeIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wr///+d////+v//////////////////////////////////////////////////////////////////////////////+v///53///8JAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Jv///7P////6//////////////////////////////////////////////////////////r///+z////JgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8OAAAAUgAAAE0AAAAkAAAAFAAAABIAAAAAAAAA7gAAAOwAAADcAAAAswAAAK4BAQHyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWJ661w4HaXoAAAAASUVORK5CYII=" alt=""><span class="helper"></span></span>
  					<a href="http://wwww.trippediacity.com"> http://wwww.trippediacity.com</a>
  					<span class="helper"></span>
  				</div>
  				<div class="email left">
  					<span class="circle"><img height="15" width="15"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAQK0lEQVRYCQEgEN/vAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8QAAAAUQAAAEwAAAAlAAAAFAAAABEAAAAAAAAA7wAAAOwAAADbAAAAtAAAAK8BAQHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////J////7P////6//////////////////////////////////////////////////////////r///+z////JgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wr///+e////+v//////////////////////////////////////////////////////////////////////////////+v///57///8KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Hv///9X////////////////////////////////////////////////////////////////////////////////////////////////////V////HgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///84////6v//////////////////////////////////////////////////////////////////////////////////////////////////////////////6v///zgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///x/////r/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+r///8eAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Cv///9b/////////////////////////////////////////////////////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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzpwAAODBAABKlAAABw4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC0BAAAAK4AAACaAAAABQAAAAAAAQEAAAAAAAAAAgAAx48AAOzXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANy3AADw4AAAAQMAAAAAAAABAgAAAAAAAAAAAAAAAPoAAACuAgEBAfIAAAC3AAAAAAAAAAAAESMAAAAAAAD47wAA7NcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADs1wAA+O8AAAAAAAASIwAAAAAAAAAAAAAAALgBAQHyAQAAAAD///8lAAAA1AAAAAYA/v0AANCgAADozwAA//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQIAABgxAAAwYAAAAgMAAAAA+gAAACwBAQHbAAAAAAAAAAAA////m///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////mwAAAAAAAAAAAAAAAAAAAAAA////Cf///9P////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////T////CQAAAAAAAAAAAAAAAAAAAAAAAAAAAP///x7////q/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+r///8dAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///84////6v//////////////////////////////////////////////////////////////////////////////////////////////////////////////6v///zgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Hv///9X////////////////////////////////////////////////////////////////////////////////////////////////////U////HgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wr///+d////+v//////////////////////////////////////////////////////////////////////////////+v///53///8JAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Jv///7P////6//////////////////////////////////////////////////////////r///+z////JgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8OAAAAUgAAAE0AAAAkAAAAFAAAABIAAAAAAAAA7gAAAOwAAADcAAAAswAAAK4BAQHyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+shihkPaoY0AAAAASUVORK5CYII=" alt=""><span class="helper"></span></span>
  					<a href="mailto:services@trippediacity.com"> services@trippediacity.com</a>
  					<span class="helper"></span>
  				</div>
  				<div class="phone right">
  					<span class="circle"><img height="15" width="15" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAQK0lEQVRYCQEgEN/vAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8QAAAAUQAAAEwAAAAlAAAAFAAAABEAAAAAAAAA7wAAAOwAAADbAAAAtAAAAK8BAQHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////J////7P////6//////////////////////////////////////////////////////////r///+z////JgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wr///+e////+v//////////////////////////////////////////////////////////////////////////////+v///57///8KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Hv///9X////////////////////////////////////////////////////////////////////////////////////////////////////V////HgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///84////6v//////////////////////////////////////////////////////////////////////////////////////////////////////////////6v///zgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///x/////r/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+r///8eAAAAAAAAAAAAAAAAAQAAAAAAAAAA////CgAAAMwAAAApAAAAAAD79gAA160AAPHjAAAAAAAAAAAAAAkRAAApUwAACxYA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dAAA+vQAAAAAAAAAAAAAJUoAAPPnAADozwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMGEAADZrAAAAAAAAAAAAAAAAAAAAAAAAAABhAf///w4AAADsAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADw4AAAuHEAAPLjAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKVIAAD16AAAAAAAAAAAAAAAAAAAAAPoAAAAVAgEBAfIAAAC3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQIAAAUaEAACFCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALgBAQHyAgAAAAAAAAB0AAAA+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABw4AAEWKAABOnAAAFi0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+gAAAHQAAAAAAgAAAAABAQHbAAAAogAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYMAAAUJ8AAEuWAAAqVQAACxYAAAAAAAAAAAAAAAAAAAAAAAAAAAAADx4AAAAAAAAAAAAAAAAAAAAAogEBAdsAAAAAAQAAAAAAAAAA////CQAAAMoAAAAsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO3aAADy5AAA9esAAPbsAAAIDwAAKVIAAAUKAAAAAAAAAADUAAAANgEBAfcAAAAAAAAAAAAAAAAAAAAAAP///x7////q/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+r///8dAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///84////6v//////////////////////////////////////////////////////////////////////////////////////////////////////////////6v///zgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Hv///9X////////////////////////////////////////////////////////////////////////////////////////////////////U////HgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wr///+d////+v//////////////////////////////////////////////////////////////////////////////+v///53///8JAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Jv///7P////6//////////////////////////////////////////////////////////r///+z////JgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8OAAAAUgAAAE0AAAAkAAAAFAAAABIAAAAAAAAA7gAAAOwAAADcAAAAswAAAK4BAQHyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJzzrsrL/j50AAAAASUVORK5CYII=" alt=""><span class="helper"></span></span>
  					<label>+6221 519-0450</label>
  					<span class="helper"></span>
  				</div>
  			</div>
  		</div>
  	</header>

  	<section>
  		<div class="container">
  			<div class="details clearfix">
  				<div class="client left">
  					<p>INVOICE TO:</p>
  					<p class="name">${getGender} ${customer.name}</p>
  					<p>Mobile No. +62${customer.mobile_no}</p>
  					<a href="mailto:${customer.email}">Email: ${customer.email}</a>
  				</div>
  				<div class="data right">
  					<div class="title">Invoice #${sale.no_invoice}</div>
  					<div class="date">
  						Date of Invoice: ${getDate(sale.createdAt)}<br>
              ${getDescription_6}
  						Status: ${getStatusPayment}<br>
  					</div>
  				</div>
  			</div>

  			<table border="1" cellspacing="0" cellpadding="0">
  				<thead>
  					<tr>
  						<th class="desc">Description</th>
  						<th class="qty">Qty</th>
  						<th class="unit">Unit price (IDR)</th>
  						<th class="total">Total (IDR)</th>
  					</tr>
  				</thead>
  				<tbody>
  					<tr>
  						<td class="desc"><h3>${trx.toUpperCase()}</h3>${getDescription_1}<br />${getDescription_2}<br />${getDescription_3}<br />${getDescription_4}<br />${getDescription_5}</td>
  						<td class="qty">${getQty}</td>
  						<td class="unit">${formatMoney(sale.price)}</td>
  						<td class="total">${formatMoney(sale.total_sale)}</td>
  					</tr>
  				</tbody>
  			</table>
  			<div class="no-break">
  				<table class="grand-total">
  					<tbody>
  						<tr>
  							<td class="desc"></td>
  							<td class="qty"></td>
  							<td class="unit">SUBTOTAL:</td>
  							<td class="total">${formatMoney(sale.total_sale)}</td>
  						</tr>
  						<tr>
  							<td class="desc"></td>
  							<td class="qty"></td>
  							<td class="unit">ADMIN FEE:</td>
  							<td class="total">${formatMoney(setting.fee_sale)}</td>
  						</tr>
  						<tr>
  							<td class="desc"></td>
  							<td class="unit" colspan="2">GRAND TOTAL:</td>
  							<td class="total">${formatMoney(sale.total_sale)}</td>
  						</tr>
  					</tbody>
  				</table>
  			</div>
  		</div>
  	</section>

  	<footer>
  		<div class="container">
  			<div class="notice">
  				<div>${getRemark}</div>
  			</div>
  			<div class="thanks">Bank Information<br />Bank BCA: 522 111 3048<br />PT. Buana Amalia Mandiri</div>
  			<div class="end">&copy; 2017 Trippediacity. Invoice was created on a computer and is valid without the signature and seal.</div>
  		</div>
  	</footer>

  </body>

  </html>
`
}
