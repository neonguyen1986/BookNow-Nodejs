import db from '../models/index'
import _, { includes } from 'lodash'
import emailService from './emailService'
require('dotenv').config();
import { v4 as uuidv4 } from 'uuid'
import { asIs } from 'sequelize';


let buildURLForEmail = (doctorId, tokenUUID) => {
    let result = ''
    result = `${process.env.URL_REACT}/verify-booking?token=${tokenUUID}&doctorid=${doctorId}`
    return result
}
let postBookAppointmentServiceNode = async (inputData) => {
    // console.log('==================================')
    // console.log('check inputData', inputData)
    // console.log('==================================')
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.email ||
                !inputData.doctorId ||
                !inputData.timeType ||
                !inputData.birthday ||
                !inputData.fullName ||
                !inputData.selectedGender ||
                !inputData.address ||
                !inputData.timeBooked ||
                !inputData.dateBooked ||
                !inputData.doctorName
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameters'
                })
            } else {
                //gọi hàm gởi email
                let tokenUUID = uuidv4();
                await emailService.sendSimpleEmail({
                    receiverEmail: inputData.email,
                    patientName: inputData.fullName,
                    time: inputData.timeBooked,
                    date: inputData.dateBooked,
                    doctorName: inputData.doctorName,
                    language: inputData.language,
                    redirectLink: buildURLForEmail(inputData.doctorId, tokenUUID),
                })

                //find or create of sequelize
                //nếu ko tìm thấy email thì trả về default
                //nếu tạo thành công thì data trả về sẽ là 1 array gồm {objData, true}, ngược lại {objectData, false}

                //update patient data vào user
                let user = await db.User.findOrCreate({
                    where: {
                        email: inputData.email,
                    },
                    defaults: {
                        email: inputData.email,
                        roleId: 'R3',
                        firstName: inputData.fullName,
                        gender: inputData.selectedGender,
                        address: inputData.address,
                        phoneNumber: inputData.phoneNumber,
                    },
                    raw: true
                })
                console.log('-------------check user:', user)
                //Ta sẽ cần user ID để dùng cho bảng này booking table
                // console.log('check user:', user[0])
                //create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                            doctorId: inputData.doctorId,
                            timeType: inputData.timeType,//remove later
                            //tạm thời để hiển thị data, sẽ bỏ đi trong tương lai
                        },
                        defaults: {
                            statusId: 'S1',
                            doctorId: inputData.doctorId,
                            patientId: user[0].id,
                            date: inputData.date,
                            timeType: inputData.timeType,
                            date: inputData.dateBooked,
                            token: tokenUUID,
                        }
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save patient info succeed',
                    // data: user,
                    //ý nghĩa dùng data:user: khi ko tìm thấy thì ta sẽ create vào User
                    //Nếu tìm thấy thì data được tìm thấy sẽ trả vào đây
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let postVerifyBookAppointmentServiceNode = async (data) => {
    // console.log('============================')
    // console.log('check data:', data)
    // console.log('============================')
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameters'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false //dùng raw:false mới dùng đc hàm update
                })
                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Save patient info succeed',
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'This appointment is already booked or does not exist!!!',
                    })
                }



            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    postBookAppointmentServiceNode,
    postVerifyBookAppointmentServiceNode,
}