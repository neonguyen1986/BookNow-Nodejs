import db from '../models/index'
import bcrypt from 'bcryptjs'
const salt = bcrypt.genSaltSync(10) //genSaltSync là thư viện dùng để hash pass

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
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

//================LOG IN==================
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {

                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                });
                if (user) {//check lại user 1 lần nữa phòng TH data bị thay đổi trong lúc đăng nhậpp
                    //user already exist
                    //compare password
                    let check = bcrypt.compareSync(password, user.password)
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        // console.log(user)
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong Password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = 'User is not found'
                }
            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage = `Your email isn't exist in our system. Please try another email`
            }
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}
//=================================================
//             Sevices for User Manage            |
//=================================================


//================READ==================
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId != 'ALL') {
                users = await db.User.findOne({
                    attributes: {
                        exclude: ['password']
                    },
                    where: { id: userId },
                })
            }
            resolve(users)
        } catch (error) {
            console.log(error)
        }
    })
}

//================CREATE==================
let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email availability
            let check = await checkUserEmail(data.email)
            if (check === true) {//email is exist in db
                resolve({
                    errCode: 1,
                    errMessage: 'This email is already used'
                })
            } else {
                let hashPasswordFromBcrypt = await hasUserPassword(data.password)
                await db.User.create({//create tương đương câu lệnh INSERTINTO USER... của SQL
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.role,
                    positionId: data.position,
                    image: data.avatar,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                });
            }

        } catch (error) {
            reject(error);
        }
    })
}

//================UPDATE==================
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required parameter'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,//thêm vào để tắt raw
            })
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;
                user.gender = data.gender;
                user.positionId = data.position;
                user.roleId = data.role;
                if (data.avatar) {
                    user.image = data.avatar;
                }

                await user.save();
                resolve({
                    errCode: 0,
                    errMessage: "User has been updated"
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: "User is not found"
                });

            }
        } catch (error) {
            reject(error)
        }
    })
}
//================DELETE==================
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId }
        })
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: `The user isn't exist`,
            })
        }
        //await user.destroy();// cách này ko đc
        await db.User.destroy({
            where: { id: userId }
        })
        resolve({
            errCode: 0,
            errMessage: `The user is deleted`
        })
    })
}

//=================================================
//             Sevices for Allcode                |
//=================================================

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters!'
                })
            } else {
                let data = await db.Allcode.findAll({
                    where: { type: typeInput }
                })
                resolve({
                    errCode: 0,
                    data
                });
            }
        } catch (error) {
            reject(error)
        }

    })
}
module.exports = {
    handleUserLogin,
    getAllUsers,
    createNewUser,
    deleteUser,
    updateUserData,
    getAllCodeService,
}