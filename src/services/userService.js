import db from '../models/index'
import bcrypt from 'bcryptjs'
const salt = bcrypt.genSaltSync(10) //genSaltSync là thư viện dùng để hash pass
import jwt from 'jsonwebtoken'
require('dotenv').config()

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
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let testEmail = false;
            if (emailRegex.test(userEmail)) {
                testEmail = true
            }
            resolve(testEmail)
        } catch (e) {
            reject(e)
        }
    })
}

//================LOG IN==================
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            //GENERATE ACCESS TOKEN
            const generateAccessToken = (user) => {
                return jwt.sign({
                    id: user.id,
                    roleId: user.roleId,
                },
                    process.env.JWT_ACCESS_KEY,//secret key to add to token
                    { expiresIn: '30s' },//after 30s, the token will be expired, user have to login again
                );
            };
            //GENERATE REFRESH TOKEN
            const generateRefreshToken = (user) => {
                return jwt.sign({
                    id: user.id,
                    roleId: user.roleId,
                },
                    process.env.JWT_REFRESH_KEY,//secret key to add to token
                    { expiresIn: '1d' },//after 1d minutes, the token will be expired
                );
            };

            let userData = {};
            let isEmail = await checkUserEmail(email);
            if (isEmail) {
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
                    raw: true
                });
                if (user) {//check lại user 1 lần nữa phòng TH data bị thay đổi trong lúc đăng nhập
                    //user already exist
                    //compare password
                    let check = bcrypt.compareSync(password, user.password)
                    if (check) {
                        const accessToken = generateAccessToken(user);
                        const refreshToken = generateRefreshToken(user);
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        // console.log(user)
                        // delete user.password;
                        const { id, password, roleId, ...others } = user//remove id, password, roleId
                        userData.user = { ...others, accessToken: accessToken };
                        userData.refreshToken = refreshToken;

                        console.log('==================check user:', userData.user)
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
                userData.errMessage = `Wrong email !!!`
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
    console.log('======check data', data)
    return new Promise(async (resolve, reject) => {
        try {
            //check email availability
            let isEmail = await checkUserEmail(data.email)
            console.log('======test1')

            if (isEmail === false) {
                console.log('======test2')
                resolve({
                    errCode: 1,
                    errMessage: 'Wrong Email !!!'
                })
            } else {
                console.log('======test3')

                let hashPasswordFromBcrypt = await hasUserPassword(data.password)
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
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
                    }
                })
                if (user[1] === true) {
                    resolve({
                        errCode: 0,
                        errMessage: `You've just create a new user`,
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: `This email is already used`,
                    });
                }
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