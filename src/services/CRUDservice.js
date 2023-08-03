import db from '../models'
import bcrypt from 'bcryptjs'
const salt = bcrypt.genSaltSync(10) //genSaltSync là thư viện dùng để hash pass


let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hasUserPassword(data.password)
            await db.User.create({//create tương đương câu lệnh INSERTINTO USER... của SQL
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === 1 ? true : false,
                roleId: data.roleId,
            })
            resolve("Create a new user successfully");
        } catch (e) {
            reject(e);
        }

    })


    // console.log('===data from service===');
    // console.log(data);
    // console.log(hashPasswordFromBcrypt)
}

let hasUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword); // trong Promise resolve tương đương return
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = db.User.findAll({ //chú ý: db.User là modelName: 'User' trong users.js
                raw: true, //dòng này nghĩa là chỉ log ra array gồm toàn db data
            });
            resolve(users)
        } catch (e) {
            reject(e)
        }
    })
}

let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true,
            })
            if (user) {
                resolve(user)
            }
            else {
                resolve({})
            }
        } catch (e) {
            reject(e)
        }
    });
}

let updateUserData = (data) => {
    // console.log('==data from service==')
    // console.log(data)
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id }
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();

                let allUser = db.User.findAll();
                resolve(allUser);
            } else {
                resolve();
            }

        }
        catch (e) {
            console.log(e)
        }
    })
}

let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId }
            })

            if (user) {
                await user.destroy();
            }
            resolve();
        } catch (e) {
            reject(e)

        }
    })
}


module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
}