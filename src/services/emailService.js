import moment from 'moment';
require('dotenv').config();
// import nodemailer from 'nodemailer'
const nodemailer = require("nodemailer");

let sendSimpleEmail = (dataSend) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,//true for 465, false for another ports
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        }
    });

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Nam Tran 👻" <trannam.shop@gmail.com', // sender address
            to: dataSend.receiverEmail,//"bar@example.com, baz@example.com", // list of receivers
            subject: dataSend.language === 'vi' ? "Thông tin đặt lịch khám" : "Booking information", // Subject line
            //text: , // plain text body
            html: getBodyHTML(dataSend), // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        //
        // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
        //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
        //       <https://github.com/forwardemail/preview-email>
        //
    }
    main().catch(console.error);
}
let getBodyHTML = (dataSend) => {
    let result = ''
    if (dataSend.language === 'en') {
        let date = moment.unix(+dataSend.date / 1000).locale('en').format('ddd-MM/DD/YYYY')
        result =
            ` 
        <h3>Hello ${dataSend.patientName}</h3>
        <p>You received this email because you booked a medical appointment on Bookingcare</p>
        <p>Schedule information:</p>
        <div><b>Time:${dataSend.time} - ${date}</b></div>
        <div><b>Doctor:${dataSend.doctorName.firstName} ${dataSend.doctorName.lastName}</b></div>
        <p>Confirm your appointment with the link below</p>
        <div>
            <a href='${dataSend.redirectLink}' target='_blank'>Click here</a>
        </div>
        <div> Thank you for booking an appointment</div>
        `
    } else {
        let date = moment.unix(+dataSend.date / 1000).locale('vi').format('ddd - DD/MM/YYYY')
        result =
            ` 
        <h3>Xin chào ${dataSend.patientName}</h3> 
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên Bookingcare</p>
        <p>Thông tin đặt lịch:</p>
        <div><b>Thời gian:${dataSend.time} - ${date}</b></div>
        <div><b>Bác sĩ:${dataSend.doctorName.lastName} ${dataSend.doctorName.firstName}</b></div>
        <p>Xác nhận thủ tục đặt lịch khám với đường link bên dưới</p>
        <div>
            <a href='${dataSend.redirectLink}' target='_blank'>Click here</a>
        </div>
        <div> Cảm ơn bạn đã đặt lịch khám bệnh</div>
        `
    }
    return result
}

module.exports = {
    sendSimpleEmail,
}