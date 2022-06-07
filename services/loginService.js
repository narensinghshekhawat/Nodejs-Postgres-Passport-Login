const bcrypt = require("bcrypt");
const sequelize = require("../database");

const User = require("../models/user");

let findUserByEmail = (emailInput) => {
     return new Promise(async(resolve, reject) => {
      try{
        console.log('In findUserByEmail ...'+emailInput);
          
	       // let user = await sequelize.User.findOne({
            let user = await User.findOne({
                where : {
                    email: emailInput
                }
	        });
            if(!user) {
                console.log('user Not found');
                reject(`We can't find a user with the email "${emailInput}"`);
            }
	        
            resolve(user);
            console.log('resolve executed');
	    }catch(e){
            console.log('In findUserByEmail CATCH block...');
		    reject(e);
	    }
      });
};

let comparePassword = (password, userObject) => {
	return new Promise(async(resolve, reject) => {
	try{
        console.log('In loginservice >> comparePassword method ...'+password);
	     let isMatch = await bcrypt.compare(password, userObject.password);
         console.log('isMatch ==== '+isMatch);
         if(isMatch) resolve(true);
	     else {
	       resolve("The password that you've entered is incorrect");
	     }
    }catch(e){}
})
};

let findUserById = (idInput) => {
     return new Promise(async(resolve, reject) => {
      try{
        console.log('In findUserById ...'+idInput);
        
        //let user = await sequelize.User.findOne({
            let user = await User.findOne({
                where : {
                    id: idInput
                }
	        });
            if(!user) {
                console.log(`User not found by the id: ${idInput}`);
                reject(`User not found by the id: ${idInput}`);
            }
	        resolve(user);

        }catch(err){
		    reject(err);
	    }
      });
};

module.exports = {
	findUserByEmail: findUserByEmail ,
	comparePassword : comparePassword,
    findUserById: findUserById
}