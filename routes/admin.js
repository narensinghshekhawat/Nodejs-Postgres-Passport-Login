  var express = require('express');
  var router = express.Router();
  var passport = require('passport');
  var csrf = require('csurf');
  var csrfProtection = csrf();
  var config_passport = require('../config/passport-config');
  router.use(csrfProtection);


  const checkAuthenticated = (req, res, next) =>{
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/')
  }

  const checkNotAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next()  
    }
    return res.redirect('/')
  }

  router.use('/', checkAuthenticated, function isAuthenticated(req, res, next) {
      next();
  });

  /***  Description : Displays home page to the admin ***/
  router.get('/', function viewHome(req, res, next) {
      res.render('admin/adminHome.ejs', {
          title: 'Admin Home',
          csrfToken: req.csrfToken(),
          userName: req.session.user.name
      });
  });

  module.exports = router;