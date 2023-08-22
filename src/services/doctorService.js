import { resolveInclude } from 'ejs'
import db from '../models/index'
import _, { includes } from 'lodash'
import emailService from '../services/emailService'
import path from 'path'
import { Op } from 'sequelize'

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
        // console.log('====================')
        // console.log(inputData)
        try {
            let check = true;
            let errValue = '';
            let tempArr = [
                inputData.doctorId, 'doctorID',
                inputData.HTMLContent, 'HTMLContent',
                inputData.markdownContent, 'markdownContent',
                inputData.selectedPrice, 'Price',
                inputData.selectedPayment, 'Payment',
                inputData.selectedProvince, 'Province',
                inputData.clinicName, 'clinicName',
                inputData.clinicAddress, 'clinicAddress',
                inputData.note, 'note',
                inputData.selectedSpecialty, 'Specialty'
            ]
            //text element for Missing display
            for (let i = 0; i < tempArr.length; i = i + 2) {
                if (!tempArr[i]) {
                    check = false;
                    errValue = tempArr[i + 1]
                    break;
                }
            }
            if (check === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing Parameter ${errValue}`
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
                // console.log('>>>doctorInfo', doctorInfo)
                if (doctorInfo) {
                    //update
                    doctorInfo.doctorId = inputData.doctorId;
                    doctorInfo.priceId = inputData.selectedPrice;
                    doctorInfo.provinceId = inputData.selectedProvince;
                    doctorInfo.paymentId = inputData.selectedPayment;
                    doctorInfo.nameClinic = inputData.clinicName;
                    doctorInfo.addressClinic = inputData.clinicAddress;
                    doctorInfo.note = inputData.note;
                    doctorInfo.specialtyId = inputData.selectedSpecialty;
                    doctorInfo.clinicId = inputData.selectedClinic;
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
                        specialtyId: inputData.selectedSpecialty,
                        clinicId: inputData.selectedClinic,
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
                                { model: db.Specialty, as: 'specialtyName', attributes: ['name'] },
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
    // console.log('>>>check doctorId, date:', doctorId, date)
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
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'fullName', attributes: ['firstName', 'lastName'] },
                    ],
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
let getDoctorsMoreInfoByIdServiceNode = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameters'
                })
            } else {
                let data = await db.Doctor_Info.findOne({
                    where: { doctorId: inputId },
                    attributes: { exclude: ['id', 'doctorId'] },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: true,
                    nest: true,
                })
                if (!data) data = {}
                else
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
let getDoctorsProfileByIdServiceNode = (inputId) => {
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
                if (!data) data = {};
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

let getListPatientsbyIdDateServiceNode = (doctorId, date) => {
    // console.log('==================================')
    // console.log('check patient:', doctorId, date)
    // console.log('==================================')

    return new Promise(async (resolve, reject) => {
        //get date, ID from 'bookings'
        //get patients info from User
        //get date from Allcode
        //date, time type (link AllCode), 
        //user:email, firstName, address, gender (link with Allcode),phoneNumb,
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameters'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        [Op.or]: [
                            { statusId: 'S2' },
                            { statusId: 'S3' }
                        ],

                        doctorId: doctorId,
                        date: date
                    },
                    order: [
                        ['statusId', 'ASC'], // ASCending order for column1
                    ],
                    attributes: { exclude: ['id'] },
                    include: [
                        { model: db.Allcode, as: 'timeBooking', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.User, as: 'patientInfo', attributes: ['email', 'firstName', 'gender', 'address', 'phoneNumber'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
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
let postFileToDBServiceNode = (file, data) => {
    // console.log('==================================')
    // console.log('check data SaveFileToDB:', data, token)
    // console.log('==================================')

    return new Promise(async (resolve, reject) => {
        console.log('++++++++', file)
        try {
            if (!data.token ||
                !data.patientName ||
                !data.docFirstName ||
                !data.docLastName ||
                !data.email ||
                !file.path) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameters'
                })
            } else {

                let booked = await db.Booking.findOne({
                    where: { token: data.token },
                    raw: false
                })

                if (booked) {
                    const filePath = `/${file.path.replace(/\\/g, '/')}`;
                    //path: 'src\\assets\\DoctorPrescription\\16921328071982. Dermatology.jpg',

                    //======save file to DB=======
                    await emailService.sendSimpleEmail({
                        EMAIL_TYPE: 'BookingConfirm',
                        receiverEmail: data.email,
                        patientName: data.patientName,
                        docFirstName: data.docFirstName,
                        date: data.dateBooked,
                        docLastName: data.docLastName,
                        language: data.language,
                        fileName: `Doctor ${data.docFirstName}'s Prescription.pdf`,
                        path: path.join(__dirname, '..', '..', filePath),
                    })
                    //======save file to DB=======
                    booked.statusId = 'S3';
                    booked.fileLink = file.filename
                    await booked.save()

                    resolve({
                        errCode: 0,
                        errMessage: 'Prescription has been sent to patient'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Missing data from server'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getFileDownloadServiceNode = (token) => {
    // console.log('==================================')
    // console.log('check data SaveFileToDB:', data, token)
    // console.log('==================================')

    return new Promise(async (resolve, reject) => {
        console.log('=========check token:', token)
        try {
            if (!token) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameters'
                })
            } else {
                let booked = await db.Booking.findOne({
                    where: { token: token }
                })

                if (booked) {
                    resolve({
                        errCode: 0,
                        errMessage: 'Get data from DB success',
                        'fileName': `${process.env.URL_NODE}/get-public/DoctorPrescription/${booked.fileLink}`
                    })
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: 'Token not found in server',
                    })
                }

            }
        }
        catch (error) {
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
    getDoctorsMoreInfoByIdServiceNode,
    getDoctorsProfileByIdServiceNode,
    getListPatientsbyIdDateServiceNode,
    postFileToDBServiceNode,
    getFileDownloadServiceNode,
}