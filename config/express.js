'use strict'

var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compress = require('compression');
var methodOverride = require('method-override');

var mongoose = require('mongoose');
var User = mongoose.model('User');

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: '',
    clientSecret: '',
    callbackURL: 'http://localhost:3000/login/facebook/return'
  },
function(accessToken, refreshToken, profile, done) {
  // In this example, the user's Facebook profile is supplied as the user
  // record.  In a production-quality application, the Facebook profile should
  // be associated with a user record in the application's database, which
  // allows for account linking and authentication with other identity
  // providers.

  // ``` Facebook Profile Example:
  // { id: '1266237686724270',
  //   username: undefined,
  //   displayName: 'Roliroli Roli',
  //   name:
  //    { familyName: undefined,
  //      givenName: undefined,
  //      middleName: undefined },
  //   gender: undefined,
  //   profileUrl: undefined,
  //   provider: 'facebook',
  //   _raw: '{"name":"Roliroli Roli","id":"1266237686724270"}',
  //   _json: { name: 'Roliroli Roli', id: '1266237686724270' } }
  // ``` End Facebook Profile Example

  // console.log('accessToken: ' + accessToken);
  // console.log('refreshToken: ' + refreshToken);
  // console.log(profile);

  User.findOne({ facebook: profile.id }, function(err, existingUser) {
    if(existingUser) {

      // TODO, Update Facebook Profile

      return done(null, profile);
    } else {

      // Signup User or just signin user without other information
      let user = new User();
      user.facebook = profile.id;
      user.save(function(err) {
        return done(err, user);
      });
    }
  });

  return done(null, profile);
}));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

module.exports = function(app, config) {
  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  app.set('views', config.root + '/app/views');
  app.set('view engine', 'ejs');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser());
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());
  app.use(require('express-session')(
    { secret: 'keyboard cat', resave: true, saveUninitialized: true }
  ));

  // Initialize Passport and restore authentication state, if any, from the
  // session.
  app.use(passport.initialize());
  app.use(passport.session());

  var controllers = glob.sync(config.root + '/app/controllers/*.js');
  controllers.forEach(function (controller) {
    require(controller)(app);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

};
