function checkSession(req, res, next) {
  let login = req.session.isLogin
  if (login) {
    next(res.path)
  } else {
    res.redirect('/login')
  }
}

module.exports = {
  checkSession: checkSession,
};
