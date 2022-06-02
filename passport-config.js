const LocalStrategy = require('passport-local').Strategy

const bcrypt = require('bcrypt')

const loginService = require("./services/loginService");

function initialize(passport, getUserByEmail, getUserById) {

    const authenticateUser = async (req,email,password,done) => {
      try{
        //find user by the email address
        await loginService.findUserByEmail(email)
        //had a user ?
        .then((user) =>{
          if(!user) return done(null,false, "Email or Password is incorrect");
          //compare the user's password
          let message = loginService.comparePassword(password, user);  // need to confirm if await required
          //the password is match ?
          if(message===true){
             return done(null, user, null);
          }else{
          //return false with error message
            return done(null, false, message);
          }
        }).catch(err =>{
            return done(null, false, err);
        });
      }catch(error){
        return done(null, false, error);
      }  
    }

  passport.use(new LocalStrategy({ usernameField: "email",passwordField: "password",passReqToCallback: true, }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser( (user,done) => {
    loginService.findUserById(id).then( user => {
          return done(null,user);
    }).catch(error => {
          return done(error,null);	
    })
  })
}


module.exports = initialize