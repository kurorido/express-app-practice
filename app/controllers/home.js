var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article');

var passport = require('passport');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/',
  function(req, res) {
    res.render('index', {
      login: req.isAuthenticated()
    });
  });

router.get('/login',
  function(req, res){
    res.render('login');
  });

router.get('/login/facebook',
  passport.authenticate('facebook'));

router.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });