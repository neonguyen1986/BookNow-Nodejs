import { resolveInclude } from 'ejs'
import db from '../models/index'
import _, { includes } from 'lodash'

require('dotenv').config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;


//===================GET DOCTORS FOR OUSTANDING DOCTORS====================

let getTopDoctorServiceNode = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                order: [['createdAt', 'ASC']],//DESC
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                where: {
                    roleId: 'R2',
                },
                raw: true,
                nest: true,
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error)
        }
    })
}
//===================GET DOCTORS WITH USER INFO====================

let getAllDoctorsSeviceNode = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                }
            })
            resolve({
                errCode: 0,
                data: doctors,
            })
        } catch (error) {
            reject(error)//khi reject sẽ tự động chạy vào catch của getAllDoctors
        }
    })
}
//===================CREATE DOCTOR IN MARKDOWN + DOCTOR_INFO DB====================

let postDoctorsInfoServiceNode = (inputData) => {
    return new Promise(async (resolve, reject) => {
        console.log('====================')
        console.log(inputData)
        try {
            if (!inputData.doctorId ||
                !inputData.HTMLContent ||
                !inputData.markdownContent ||
                !inputData.selectedPrice ||
                !inputData.selectedPayment ||
                !inputData.selectedProvince ||
                !inputData.clinicName ||
                !inputData.clinicAddress ||
                !inputData.note
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameter'
                })
            } else {
                //update data to Markdown
                let markdownInfo = await db.Markdown.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false
                })
                if (markdownInfo) {
                    //update
                    markdownInfo.doctorId = inputData.doctorId;
                    markdownInfo.HTMLContent = inputData.HTMLContent;
                    markdownInfo.markdownContent = inputData.markdownContent;
                    markdownInfo.description = inputData.description;
                    await markdownInfo.save()
                } else {
                    //create
                    await db.Markdown.create({
                        doctorId: inputData.doctorId,
                        HTMLContent: inputData.HTMLContent,
                        markdownContent: inputData.markdownContent,
                        description: inputData.description,
                    })
                }

                //update data to doctor_info
                let doctorInfo = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false

                })
                console.log('>>>doctorInfo', doctorInfo)
                if (doctorInfo) {
                    //update
                    doctorInfo.doctorId = inputData.doctorId;
                    doctorInfo.priceId = inputData.selectedPrice;
                    doctorInfo.provinceId = inputData.selectedProvince;
                    doctorInfo.paymentId = inputData.selectedPayment;
                    doctorInfo.nameClinic = inputData.clinicName;
                    doctorInfo.addressClinic = inputData.clinicAddress;
                    doctorInfo.note = inputData.note;
                    await doctorInfo.save()
                } else {
                    //create
                    await db.Doctor_Info.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        nameClinic: inputData.clinicName,
                        addressClinic: inputData.clinicAddress,
                        note: inputData.note,
                    })
                }


                resolve({
                    errCode: 0,
                    errMessage: 'Save doctors info success'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
//===================GET DOCTORS WITH USER INFO; MARKDOWN; POSITION NAME - DOCTOR INFO====================
let getDoctorsDetailByIdServiceNode = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameters'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['description', 'HTMLContent', 'markdownContent'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Info,
                            // attributes: { exclude: ['id', 'doctorId'] },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            ]

                        },

                    ],
                    raw: true,
                    nest: true,
                })
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let editDoctorMarkdownServiceNode = (data) => {
    console.log('>>>check data:', data)
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameters'
                })
            } else {
                let userToEdit = await db.Markdown.findOne({
                    where: { doctorId: data.doctorId },
                    raw: false,
                })
                console.log('>>>user', userToEdit)
                if (!userToEdit) {
                    resolve({
                        errCode: 2,
                        errMessage: 'User is not found'
                    })
                } else {
                    userToEdit.HTMLContent = data.HTMLContent;
                    userToEdit.markdownContent = data.markdownContent;
                    userToEdit.description = data.description;
                    await userToEdit.save()
                    resolve({
                        errCode: 0,
                        errMessage: "User has been updated"
                    });
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let bulkCreateScheduleServiceNode = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log('check data', data)
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameter'
                })
            } else {
                let schedule = data.arrSchedule
                if (schedule?.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                //get existing in DB
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatedDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber']
                })

                //compare data from DB and React
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                })
                // console.log('check toCreate:', toCreate)
                if (toCreate?.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }

                //Bulk schedule
                resolve({
                    errCode: 0,
                    errMessage: 'create successful'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getScheduleByDateServiceNode = (doctorId, date) => {
    console.log('>>>check doctorId, date:', doctorId, date)
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameter'
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                    },
                    include: [{
                        model: db.Allcode, as: 'timeTypeData',
                        attributes: ['valueEn', 'valueVi']
                    }],
                    raw: true,
                    nest: true
                })
                if (!dataSchedule) dataSchedule = []
                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    getTopDoctorServiceNode,
    getAllDoctorsSeviceNode,
    postDoctorsInfoServiceNode,
    getDoctorsDetailByIdServiceNode,
    editDoctorMarkdownServiceNode,
    bulkCreateScheduleServiceNode,
    getScheduleByDateServiceNode,
}