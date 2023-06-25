import db from '../models/index';

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

// một object cần key và value
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
}