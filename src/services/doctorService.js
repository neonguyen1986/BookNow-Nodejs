import { resolveInclude } from 'ejs'
import db from '../models/index'
import _ from 'lodash'

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
//===================CREATE DOCTOR IN MARKDOWN DB====================
let postDoctorsInfoServiceNode = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.HTMLContent || !inputData.markdownContent) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameter'
                })
            } else {
                await db.Markdown.create({
                    HTMLContent: inputData.HTMLContent,
                    markdownContent: inputData.markdownContent,
                    description: inputData.description,
                    doctorId: inputData.doctorId,
                })
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
//===================GET DOCTORS WITH USER INFO; MARKDOWN; POSITION NAME====================
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
                        {
                            model: db.Markdown,
                            attributes: ['description', 'HTMLContent', 'markdownContent']
                        },
                        {
                            model: db.Allcode, as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
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

                //convert date
                if (existing?.length > 0) {
                    existing = existing.map(item => {
                        item.date = new Date(item.date).getTime();
                        return item
                    })
                }

                //compare data from DB and React
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && a.date === b.date;
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
module.exports = {
    getTopDoctorServiceNode,
    getAllDoctorsSeviceNode,
    postDoctorsInfoServiceNode,
    getDoctorsDetailByIdServiceNode,
    editDoctorMarkdownServiceNode,
    bulkCreateScheduleServiceNode,
}