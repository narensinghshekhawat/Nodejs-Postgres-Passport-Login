if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
  const express = require('express')
  const router =  express.Router()

  const bcrypt = require('bcrypt')
  const passport = require('passport')
  const morgan = require("morgan");
  const helmet = require("helmet");
  const cors = require("cors");
  const bodyParser = require("body-parser")
  const flash = require('express-flash')
  const session = require('express-session')
  const methodOverride = require('method-override')
  const User = require("./models/user")
  const emailService = require("./services/emailService");

  // const { checkAuthenticated , checkNotAuthenticated } = require('./middleware')
  // router.use(checkAuthenticated);
  // router.use(checkNotAuthenticated);
  
  const initializePassport = require('./passport-config')
  initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  )

  const users = []
  
  router.use(express.urlencoded({ extended: false }))
  router.use(flash())
  router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))
  router.use(passport.initialize())
  router.use(passport.session())
  router.use(methodOverride('_method'))

  

  const checkAuthenticated = (req, res, next) =>{
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  }
  
  const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

  router.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
  })

  router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
  })

  router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))

  router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
  })

  router.post("/register",checkNotAuthenticated, async (req, res) => {
      const { name, email, password,role } = req.body;
      const alreadyExistsUser = await User.findOne({ where: { email } }).catch(
        (err) => {
          console.log("Error: ", err);
        }
      );
      if (alreadyExistsUser) {
        return res.status(409).json({ message: "User with email already exists!" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password : hashedPassword,role });
      const savedUser = await newUser.save().catch((err) => {
          res.redirect('/register');
      });

      if (savedUser) {
        console.log(process.env.EMAIL);
        console.log(email);

        var mailOptions = {
          from : process.env.EMAIL,
          to : email,
          subject : 'Welcome Email',
          text: `Welcome to the Attendence Management System ${name}`
        }
        emailService.sendWelcomeEmail(mailOptions);
        res.redirect('/login');
      }
  });

  router.get('/forgot-password', (req, res) => {
    res.render('forgot-password.ejs')
  })

  router.delete('/logout', function(req, res, next) {
    req.logout(function(err){
      if (err) { return next(err); }
      res.redirect('/');
    });
  })


module.exports = router;
