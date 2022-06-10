const bcrypt = require("bcrypt");
const sequelize = require("../database")

const User = require("../models/user")

let findUserByEmail = (emailInput) => {
     return new Promise(async(resolve, reject) => {
      try{
            let user = await User.findOne({
                where : {
                    email: emailInput
                }
	        });
            if(!user){
                reject(`We can't find a user with the email "${emailInput}"`);
            }
	        resolve(user);
        }catch(e){
            reject(e);
	    }
      });
};

let comparePassword = (password, userObject) => {
	return new Promise(async(resolve, reject) => {
        try{
            let isMatch = await bcrypt.compare(password, userObject.password);
            if(isMatch) resolve(true);
            else {
                resolve("The password that you've entered is incorrect");
            }
        }catch(e){}
    });
};

let findUserById = (idInput) => {
     return new Promise(async(resolve, reject) => {
      try{
            let user = await User.findOne({
                where : {
                    id: idInput
                }
	        });
            if(!user){
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