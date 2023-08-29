import db from '../models/index'
import _, { includes, reject } from 'lodash'
import emailService from './emailService'
require('dotenv').config();
import fs from 'fs'
import path from 'path'

let postCreateEditNewSpecialtyServiceNode = async (file, data) => {
    // console.log('============================file,', file)
    // console.log('============================data', data)
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.specialtyNameEn ||
                !data.specialtyNameFr ||
                !data.markdownSpecialtyEn ||
                !data.markdownSpecialtyFr ||
                !data.HTMLSpecialtyEn ||
                !data.HTMLSpecialtyFr ||
                !file
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameters'
                })
            }
            else {
                //CREATE NEW SPECIALTY
                if (data.isEdit === undefined && data.id === undefined) {
                    let createNew = await db.Specialty.findOrCreate({
                        where: {
                            nameEn: data.specialtyNameEn,
                            nameFr: data.specialtyNameFr
                        },
                        defaults: {
                            nameEn: data.specialtyNameEn,
                            nameFr: data.specialtyNameFr,
                            descriptionMarkdown_En: data.markdownSpecialtyEn,
                            descriptionMarkdown_Fr: data.markdownSpecialtyFr,
                            descriptionHTML_En: data.HTMLSpecialtyEn,
                            descriptionHTML_Fr: data.HTMLSpecialtyFr,
                            image: file.filename
                        },
                        raw: true,
                    })
                    // console.log('check createNew,=========', createNew[1])
                    if (createNew[1] === true) {
                        resolve({
                            errCode: 0,
                            errMessage: 'Save Specialty info succeed',
                        })
                    } else {
                        resolve({
                            errCode: 2,
                            errMessage: 'Failure! This specialty is already had in Database',
                        })
                    }
                }
                else {
                    //EDIT SPECIALTIES
                    if (!data.id) {
                        resolve({
                            errCode: 1,
                            errMessage: 'Missing Parameters'
                        })
                    } else {
                        let editSpecialty = await db.Specialty.findOne({
                            where: {
                                id: data.id
                            },
                            raw: false,
                        })
                        //Remove image file in Public\specialty\
                        const filePath = path.join(__dirname, '..', 'public', 'SpecialyImage', editSpecialty.image)
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.log('Error deleteing file', err);
                            } else {
                                console.log('File deleted successfully')
                            }
                        })

                        //edit Specialty
                        if (editSpecialty) {
                            editSpecialty.nameEn = data.specialtyNameEn;
                            editSpecialty.nameFr = data.specialtyNameFr;
                            editSpecialty.descriptionMarkdown_En = data.markdownSpecialtyEn;
                            editSpecialty.descriptionMarkdown_Fr = data.markdownSpecialtyFr;
                            editSpecialty.descriptionHTML_En = data.HTMLSpecialtyEn;
                            editSpecialty.descriptionHTML_Fr = data.HTMLSpecialtyFr;
                            editSpecialty.image = file.filename;
                            await editSpecialty.save();

                            resolve({
                                errCode: 0,
                                errMessage: 'Edit specialties success',
                            })
                        } else {
                            resolve({
                                errCode: 2,
                                errMessage: 'Failure! This specialty is already had in Database',
                            })
                        }
                    }
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
            specialties = specialties.map(item => {
                return {
                    ...item,
                    image: `${process.env.URL_NODE}/get-public/SpecialyImage/${item.image}`
                }
            })
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
                    where: { id: id }, attributes: ['id', 'nameEn', 'nameFr', 'descriptionHTML_En', 'descriptionHTML_Fr', 'descriptionMarkdown_En', 'descriptionMarkdown_Fr']
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
let deleteSpecialtyByIdServiceNode = async (id) => {
    // console.log('============================')
    // console.log('check id', id)
    // console.log('============================')
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameters'
                })
            } else {
                let specialty = await db.Specialty.findOne({
                    where: { id: id }
                })
                //Remove image file in Public\specialty\
                if (specialty) {
                    const filePath = path.join(__dirname, '..', 'public', 'SpecialyImage', specialty.image)
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.log('Error deleteing file', err);
                        } else {
                            console.log('File deleted successfully')
                        }
                    })
                }
                await db.Specialty.destroy({
                    where: { id: id }
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Delete Specialties success',
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    postCreateEditNewSpecialtyServiceNode,
    getAllSpecialtyServiceNode,
    getDetailSpecialtyByIdLocationServiceNode,
    deleteSpecialtyByIdServiceNode,
}