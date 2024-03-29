require('dotenv').config();
// const ejs = require('ejs');
const path = require('path');
const express = require('express');
const favicon = require('express-favicon');
const session = require('express-session');
// const multer = require('multer');
// const Model = require('./models');
const authSession = require('./helpers/authLogin');

const app = express();
const port = process.env.PORT || 3000;

// app.engine('html', ejs.renderFile);

app.set('view engine', 'ejs');
// app.set('views', './views');
app.set('views', path.join(__dirname, 'views'));
app.set('view cache', false);

// app.use('/public', express.static(process.cwd() + '/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/assets/img/favicon.ico'));
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 },
  })
);

app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/reset', require('./routes/reset'));
app.use('/reset/:token', require('./routes/reset'));

app.use((req, res, next) => {
  res.locals.userSession = req.session.user;
  next();
});

app.use('/', authSession.checkSession, require('./routes/index'));
app.use('/setting', authSession.checkSession, require('./routes/setting'));
app.use('/profile', authSession.checkSession, require('./routes/profile'));
app.use('/user', authSession.checkSession, require('./routes/user'));
app.use('/customer', authSession.checkSession, require('./routes/customer'));
app.use('/agent', authSession.checkSession, require('./routes/agent'));
app.use('/purchase', authSession.checkSession, require('./routes/purchase'));
app.use('/sale', authSession.checkSession, require('./routes/sale'));
app.use('/report', authSession.checkSession, require('./routes/report'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
