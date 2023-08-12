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
            console.log('=========check Specialty:', specialties)
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
module.exports = {
    postCreateNewSpecialtyServiceNode,
    getAllSpecialtyServiceNode,
}