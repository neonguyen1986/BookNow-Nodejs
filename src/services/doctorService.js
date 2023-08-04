import { resolveInclude } from 'ejs'
import db from '../models/index'

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
                        exclude: ['password', 'image']
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
module.exports = {
    getTopDoctorServiceNode,
    getAllDoctorsSeviceNode,
    postDoctorsInfoServiceNode,
    getDoctorsDetailByIdServiceNode,
}