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

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {

                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password'],
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

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email availability
            let check = await checkUserEmail(data.email)
            if (check === true) {//email is exist in db
                resolve({
                    errCode: 0,
                    message: 'This email is already used'
                })
            }
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
            resolve({
                errCode: 0,
                message: 'OK',
            });


        } catch (error) {

        }
    })
}
module.exports = {
    handleUserLogin,
    getAllUsers,
    createNewUser,
}