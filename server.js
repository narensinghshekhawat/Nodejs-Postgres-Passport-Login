if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const port = process.env.SERVER_PORT;
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const User = require("./models/user");

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//TODO: Need to refactor below code 

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

// app.post('/login', checkNotAuthenticated, (req, res) => {
//   let user = {
//     email : req.body.email,
//     password : req.body.password
//   }
//   console.log(user)
// })



app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

// --------------------- In-Memory User Register Code <---START---> ------------------
// app.post('/register', checkNotAuthenticated, async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10)
//     console.log('hashedPassword == '+hashedPassword)
//     users.push({
//       //Id to uniquely identify the user, when we will integrate database in project this Id will be generated automatically
//       id: Date.now().toString(),
//       name: req.body.name,
//       email: req.body.email,
//       password: hashedPassword
//     })
//     res.redirect('/login')
//   } catch {
//     res.redirect('/register')
//   }
// })
// --------------------- In-Memory User Register Code <---END---> ------------------

  app.post("/register",checkNotAuthenticated, async (req, res) => {
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
      //TODO: Will remove temp code,implemented using database
      try {users.push({ id: Date.now().toString(),name: req.body.name,
            email: req.body.email,password: hashedPassword
          })} catch {res.redirect('/register')}

      const newUser = new User({ name, email, password : hashedPassword,role });
      const savedUser = await newUser.save().catch((err) => {
          console.log("Error: ", err);
          res.redirect('/register');
          //res.status(500).json({ error: "Cannot register user at the moment!" });
      });

      if (savedUser) {
        res.redirect('/login');
        //res.json({ message: "Thanks for registering" });
      }
  });


  app.get('/forgot-password', (req, res) => {
    res.render('forgot-password.ejs')
  })

// app.delete('/logout', (req, res) => {
//   req.logOut()
//   res.redirect('/login')
// })

app.delete('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})



function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

//app.listen(8080)

app.listen(port, () => {
  console.log(`App is running on ${port} `);
})