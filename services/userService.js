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

let getCountByRoleType = (roleType) => {
    var count = async (req, res, roleType) => {
        const count = await User.count({
            where: { role: roleType }
        });
    };
    return count;
};


module.exports = {
	findAllUserByRoleType: findAllUserByRoleType,
    getCountByRoleType: getCountByRoleType
}