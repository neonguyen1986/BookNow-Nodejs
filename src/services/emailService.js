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
        let tempSubject = '';
        let tempHTML = '';
        switch (dataSend.EMAIL_TYPE) {
            case 'BookingInfo':
                tempSubject = dataSend.language === 'vi' ? "Thông tin đặt lịch khám" : "Booking information",
                    tempHTML = getBodyHTMLBookingInfo(dataSend)
                break;
            case 'BookingConfirm':
                tempSubject = dataSend.language === 'vi' ? "Đơn thuốc từ bác sĩ" : "Doctor's Prescription",
                    tempHTML = getBodyHTMLBookingConfirm(dataSend)
                break;
            default:
                console.log('Missing Parameters');
        }

        const info = await transporter.sendMail({
            from: '"Nam Tran 👻" <trannam.shop@gmail.com', // sender address
            to: dataSend.receiverEmail,//"bar@example.com, baz@example.com", // list of receivers
            subject: tempSubject,
            //text: , // plain text body
            html: tempHTML, // html body
            attachments: [{
                filename: dataSend.fileName,
                path: dataSend.path,
            }],
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
let getBodyHTMLBookingInfo = (dataSend) => {
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

let getBodyHTMLBookingConfirm = (dataSend) => {
    let result = ''
    if (dataSend.language === 'en') {
        result =
            ` 
        <h3>Dear ${dataSend.patientName}</h3>
        <p>Below are the results of your medical examination<p>
        <div><b>Doctor:${dataSend.docFirstName} ${dataSend.docLastName}</b></div>
        <p>Please check the attachment for Doctor's Prescription</p>
        <div> Thank you for choosing Booking Care</div>
        `
    } else {
        result =
            ` 
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Dưới đây là thông tin kết quả khám bệnh của bạn<p>
        <div><b>Bác sĩ:${dataSend.docLastName} ${dataSend.docFirstName}</b></div>
        <p>Xin vui lòng kiểm tra toa thuốc của bác sĩ bên dưới</p>
        <div> Cám ơn bạn vì đã lựa chọn Booking Care</div>
        `
    }
    return result
}

module.exports = {
    sendSimpleEmail,
}