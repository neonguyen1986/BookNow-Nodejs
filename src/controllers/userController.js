import userService from '../services/userService'
let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    //check email exist?
    //compare password from UI
    //return userInfo
    //return: access_token:JWT (json web token)
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input parameters'
        })
    }
    let userData = await userService.handleUserLogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; //ALL: get all users, ID: get 1 user
    if (!id) {
        return res.status(200).json({
            errCode: 0,
            errMessage: 'Missing Required parameter',
            user: []
        })
    }
    let user = await userService.getAllUsers(id);
    console.log('>>>check user', user)
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        user
    })
}

module.exports = {
    handleLogin,
    handleGetAllUsers,
}