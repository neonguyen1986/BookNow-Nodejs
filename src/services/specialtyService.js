import db from '../models/index'
import _, { includes } from 'lodash'
import emailService from './emailService'
require('dotenv').config();
import { v4 as uuidv4 } from 'uuid'
import { asIs } from 'sequelize';

let postCreateNewSpecialtyServiceNode = async (data) => {
    // console.log('============================')
    // console.log('check data:', data)
    // console.log('============================')
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.specialtyName ||
                !data.markdownSpecialty ||
                !data.HTMLSpecialty ||
                !data.specialtyImage
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameters'
                })
            } else {
                let createNew = await db.Specialty.findOrCreate({
                    where: {
                        name: data.specialtyName
                    },
                    defaults: {
                        name: data.specialtyName,
                        descriptionMarkdown: data.markdownSpecialty,
                        descriptionHTML: data.HTMLSpecialty,
                        image: data.specialtyImage,
                    },
                    raw: true,
                })
                // console.log('check createNew,=========', createNew[1])
                if (createNew[1] === true) {
                    resolve({
                        errCode: 0,
                        errMessage: 'Save patient info succeed',
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Failure! This specialty is already had in Database',
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}

let getAllSpecialtyServiceNode = async () => {
    // console.log('============================')
    // console.log('check data:', data)
    // console.log('============================')
    return new Promise(async (resolve, reject) => {
        try {
            let specialties = await db.Specialty.findAll()
            // console.log('=========check Specialty:', specialties)
            if (specialties?.length > 0) {
                resolve({
                    errCode: 0,
                    errMessage: 'Get specialty success',
                    data: specialties
                })
            } else {
                resolve({
                    errCode: 2,
                    errMessage: 'Fail to get specialty',
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailSpecialtyByIdLocationServiceNode = async (id, locationId) => {
    //id of Specialty; locationId from doctor_info

    // console.log('============================')
    // console.log('check id, location', id, locationId)
    // console.log('============================')
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !locationId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameters'
                })
            } else {
                let data = [];
                let dataSpecialty = await db.Specialty.findOne({
                    where: { id: id }, attributes: ['descriptionHTML', 'descriptionMarkdown']
                }
                )
                data.push(dataSpecialty)
                if (locationId === "ALL") {
                    let dataAllLocation = await db.Doctor_Info.findAll(
                        { where: { specialtyId: id }, attributes: ['provinceId', 'doctorId'] }
                    )
                    data.push(dataAllLocation)
                    resolve({
                        errCode: 0,
                        errMessage: 'Get doctors in all province success',
                        data: data
                    })
                } else {
                    let dataOneLocation = await db.Doctor_Info.findAll({
                        where: {
                            specialtyId: id,
                            provinceId: locationId,
                        }, attributes: ['provinceId', 'doctorId']
                    }
                    )
                    console.log(dataOneLocation)
                    data.push(dataOneLocation)
                    resolve({
                        errCode: 0,
                        errMessage: 'Get doctors in same province success',
                        data: data
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    postCreateNewSpecialtyServiceNode,
    getAllSpecialtyServiceNode,
    getDetailSpecialtyByIdLocationServiceNode,
}