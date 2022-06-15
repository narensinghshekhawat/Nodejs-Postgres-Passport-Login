  const express = require('express');
  const router = express.Router();
  const passport = require('passport');
  const csrf = require('csurf');
  const csrfProtection = csrf();
  const config_passport = require('../config/passport-config');
  //A JavaScript date library for parsing, validating, manipulating, and formatting dates.
  const moment = require('moment');
  const User = require('../models/user');
  const userService = require("../services/userService");
  const { resolve } = require('path');
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
      userService.getCountByRoleType().then(
        (rows) => {
          let noOfEmployees =0;
          let noOfTrainees =0;
          for (var i = 0; i < rows.length; i++) {
            if(rows[i].role=='employee') noOfEmployees++;
            if(rows[i].role=='trainee') noOfTrainees++;
          }
          req.session.empCount = noOfEmployees;
          req.session.traineeCount = noOfTrainees;

          res.render('admin/adminHome.ejs', {
              empCount : noOfEmployees,
              traineeCount: noOfTrainees,
              title : 'Admin Home',
              csrfToken: req.csrfToken(),
              userName: req.session.user.name
          });
        }
      ).catch();
      
      
  });

  router.get('/view-all-user-by-type/:type', async (req, res, next)=> {
    var userChunks = [];
    var chunkSize = 3;
    var userType = req.params.type;
    userService.findAllUserByRoleType(userType).then(
      (rows) => {
        for (var i = 0; i < rows.length; i++) {
          userChunks.push(rows[i]);
        }
        res.render('admin/viewAllUserByType.ejs', {
            empCount : req.session.empCount,
            traineeCount: req.session.traineeCount,
            title: (userType=='employee') ? 'All Employees' : 'All Trainees',
            csrfToken: req.csrfToken(),
            users: userChunks,
            userName: req.session.user.name
        });
      }
    ).catch();
  });

  router.get('/view-profile', async(req, res, next)=> {
    const user = await User.findByPk(req.session.user.id);
    res.render('admin/viewProfile.ejs', {
      empCount : req.session.empCount,
      traineeCount: req.session.traineeCount,
      title: 'Profile',
      csrfToken: req.csrfToken(),
      employee: user,
      moment: moment,
      userName: req.session.user.name
  });
});

  
  module.exports = router;