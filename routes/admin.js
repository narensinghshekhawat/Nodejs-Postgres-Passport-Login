  const express = require('express');
  const router = express.Router();
  const passport = require('passport');
  const csrf = require('csurf');
  const csrfProtection = csrf();
  const config_passport = require('../config/passport-config');
  const User = require('../models/user');
  const userService = require("../services/userService");
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

  router.get('/view-all-user-by-type/:type', async (req, res, next)=> {
    var userChunks = [];
    var chunkSize = 3;
    var userType = req.params.type;
    userService.findAllUserByRoleType(userType).then(
      (rows) => {
        for (var i = 0; i < rows.length; i++) {
          userChunks.push(rows[i]);
          console.log('In view-all-trainees allEmployees.dataValues[i] === '+rows[i])
        }
        res.render('admin/viewAllUserByType.ejs', {
            title: (userType=='employee') ? 'All Employees' : 'All Trainees',
            csrfToken: req.csrfToken(),
            users: userChunks,
            userName: req.session.user.name
        });
      }
    ).catch();
  });

  
  module.exports = router;