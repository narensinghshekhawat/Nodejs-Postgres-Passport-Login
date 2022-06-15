const bcrypt = require("bcrypt");
const sequelize = require("../database")

const User = require("../models/user")

let findAllUserByRoleType = (roleType) => {
     return new Promise(async(resolve, reject) => {
        try{
            const rows = await User.findAll({
                    where : {
                        role: roleType
                    }
            }).then((rows) => {
                return rows.map((r) => {
                return r.dataValues;
                });
            });
            if(rows.count==0){
                reject(`We can't find any employee with the role type "${roleType}"`);
            }
            resolve(rows);
        }catch(e){
            reject(e);
	    }
      });
};

// let getCountByRoleType = (roleType) => {
//     return new Promise(async(resolve, reject) => {
//        try{
//            const count = await User.count({
//                    where : {
//                        role: roleType
//                    }
//            }).then((count) => {
//                return count;
//            });
//            resolve(count);
//        }catch(e){
//            reject(e);
//        }
//      });
// };


let getCountByRoleType = () => {
    return new Promise(async(resolve, reject) => {
       try{
           const count = await User.findAll({   group : [ 'role','"User".id' ] }).then(
                (rows) => {
                    return rows.map((r) => {
                        return r.dataValues;
                    });
                }
           );
           resolve(count);
       }catch(e){
           reject(e);
       }
     });
};


module.exports = {
	findAllUserByRoleType: findAllUserByRoleType,
    getCountByRoleType: getCountByRoleType
}