import userService from '../services/userService'
import jwt from 'jsonwebtoken'

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
    // console.log('========userData', userData)
    res.cookie('refreshTokenCookie', userData.refreshToken, {
        httpOnly: true,
        secure: false,   //when deploy change it to true
        path: '/',
        sameSite: 'strict',
    })

    return res.status(200).json({
        errCode: userData.errCode,
        errMessage: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}
//================ REQUEST REFRESH TOKEN ==================
let requestRefreshToken = async (req, res) => {
    console.log('============requestRefreshToken:', req.cookies)
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
    //Take current refresh token from user then create a new accesstoken
    const refreshToken = req.cookies.refreshTokenCookie
    // console.log('refreshTokenCookie======', refreshToken)
    if (!refreshToken) return res.status(401).json("You're not authenticated")
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
        if (err) {
            console.log(err)
        }
        else {
            //create new refreshToken, accessToken
            const newAccessToken = generateAccessToken(user);
            const newRefreshToken = generateRefreshToken(user);

            //save newRefreshToken in cookies
            res.cookie('refreshTokenCookie', newRefreshToken, {
                httpOnly: true,
                secure: false,   //when deploy change it to true
                path: '/',
                sameSite: 'strict',
            })
            res.status(200).json({ accessToken: newAccessToken, })
        }
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
    // console.log('>>>check user', user)
    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        user
    })
}
//================CREATE==================
let handleCreateNewUsers = async (req, res) => {
    console.log('=======req.body:', req.body)
    try {
        let message = await userService.createNewUser(req.body);
        return res.status(200).json(message);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let postDoctorsInfo = async (req, res) => {
    try {
        let response = await doctorService.postDoctorsInfoServiceNode(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
//================UPDATE==================
let handleEditUsers = async (req, res) => {
    let data = req.body;
    // console.log('>>>check data:', data)
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
        setTimeout(async () => {
            let data = await userService.getAllCodeService(req.query.type)
            // console.log('Allcode data', data)
            return res.status(200).json(data)
        }, 100)

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
    requestRefreshToken,
    handleGetAllUsers,
    handleCreateNewUsers,
    handleEditUsers,
    handleDeleteUsers,
    getAllCode,
}