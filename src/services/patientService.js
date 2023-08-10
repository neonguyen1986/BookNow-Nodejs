import db from '../models/index'
import _, { includes } from 'lodash'
require('dotenv').config();

let postBookAppointmentServiceNode = async (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.email ||
                !inputData.doctorId ||
                !inputData.timeType ||
                !inputData.date
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameters'
                })
            } else {
                //find or create of sequelize
                //nếu ko tìm thấy email thì trả về default
                //nếu tạo thành công thì data trả về sẽ là 1 array gồm {objData, true}, ngược lại {objectData, false}

                //update patient data vào user
                let user = await db.User.findOrCreate({
                    where: { email: inputData.email },
                    defaults: {
                        email: inputData.email,
                        roleId: 'R3'
                    },
                    raw: true
                })

                //Ta sẽ cần user ID để dùng cho bảng này booking table
                console.log('check user:', user[0])
                //create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: inputData.doctorId,
                            patientId: user[0].id,
                            date: inputData.date,
                            timeType: inputData.timeType,
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
module.exports = {
    postBookAppointmentServiceNode,
}