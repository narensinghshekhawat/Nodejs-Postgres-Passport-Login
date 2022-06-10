const LocalStrategy = require('passport-local').Strategy

const bcrypt = require('bcrypt')

const loginService = require("../services/loginService");

function initialize(passport, findUserByEmail, findUserById) {

    const authenticateUser = async (req,email,password,done) => {
      try{
        //find user by the email address
        await loginService.findUserByEmail(email)
        //had a user ?
        .then((user) =>{
          if(!user) {
            return done(null,false, "Email or Password is incorrect");
          }
          //compare the user's password
          comparePassword(password, user,done);
        }).catch(err =>{
            return done(null, false, err);
        });
      }catch(error){
        return done(null, false, error);
      }  
    }
    const comparePassword = async (password,user,done) => {
        try{//compare the user's password
                let message = await loginService.comparePassword(password, user).then(
                  (isMatch) => {
                      //the password is match ?
                      if(isMatch===true){
                          return done(null, user,null);
                      }else{
                          //return false with error message
                          return done(null, false,"The password that you've entered is incorrect");
                      }
                  }).catch( error => {
                          return done(null, false, error)
                  })
                  
            }catch(error){return false;} 
    }


  passport.use(new LocalStrategy({ usernameField: "email",passwordField: "password",passReqToCallback: true, }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser( (id,done) => {
    loginService.findUserById(id).then( user => {
          return done(null,user);
    }).catch(error => {
          return done(error,null);	
    })
  })
}


module.exports = initialize