import userService from '../services/userService'
//================LOG IN==================
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
            errMessage: 'Missing input parameters'
        })
    }
    let userData = await userService.handleUserLogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}
//=================================================
//           API for  user manage                 |
//=================================================
//================READ==================
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
//================CREATE==================
let handleCreateNewUsers = async (req, res) => {
    let message = await userService.createNewUser(req.body);
    // console.log(message)
    return res.status(200).json(message);
}
//================UPDATE==================
let handleEditUsers = async (req, res) => {
    let data = req.body;
    console.log('>>>check data:', data)
    let message = await userService.updateUserData(data);
    return res.status(200).json(message)
}
//================DELETE==================
let handleDeleteUsers = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameter"
        })
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
}

//=================================================
//               API for Allcodes                 |
//=================================================

let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type)
        // console.log('Allcode data', data)
        return res.status(200).json(data)
    } catch (error) {
        console.log("Get Allcode error:", error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server"
        })
    }
}



module.exports = {
    handleLogin,
    handleGetAllUsers,
    handleCreateNewUsers,
    handleEditUsers,
    handleDeleteUsers,
    getAllCode,
}