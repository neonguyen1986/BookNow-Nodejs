import db from '../models/index';
import CRUDservice from '../services/CRUDservice';

let getHomePage = async (req, res) => { //async: đồng bộ
    try {
        let data = await db.User.findAll();
        //await phải được map theo Model name
        //User ko có s bởi vì trong file user thì User là của Model Name chứ ko phải users trong migration
        // console.log('==================')
        // console.log(data)
        // console.log('==================')
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e)
    }
}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async (req, res) => {
    let message = await CRUDservice.createNewUser(req.body);
    // console.log(message);
    return res.send('post CRUD from server');
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDservice.getAllUser();
    // console.log(data)
    return res.render('displayCRUD.ejs', {
        dataTable: data //Điều này giúp ta hiểu dataTable sẽ được truyền sang displayCRUD chính là biến data trên
    })
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id; //nghĩa là gọi userId = id từ link được tạo ra khi nhấn edit localhost:8080/get-crud?id=2
    if (userId) {
        let userData = await CRUDservice.getUserInfoById(userId);
        // console.log('================')
        // console.log(userData)
        // console.log('================')
        return res.render('editCRUD.ejs', {
            user: userData
        });
    }
    else {
        return res.send('User not found')
    }
    return res.send('this is Edit Page')

}

let putCRUD = async (req, res) => {
    let data = req.body;
    let allUser = await CRUDservice.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        dataTable: allUser
    })
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    //khi viết ...8080/delete-crud?id=2 thì ? này sẽ được tìm thấy bởi req.query
    //tiếp theo sau dấu ? thì nó sẽ hiểu id là thứ ta tìm kiếm

    if (id) {
        await CRUDservice.deleteUserById(id);
        return res.send('user deleted!');
    }
    else {
        res.send('user not found!')
    }
}


// một object cần key và value
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}