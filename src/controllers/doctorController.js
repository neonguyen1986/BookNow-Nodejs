import doctorService from '../services/doctorService'
import multer from 'multer';
const fs = require('fs').promises;


let getTopDoctor = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 20;
    try {
        let response = await doctorService.getTopDoctorServiceNode(+limit);
        // console.log('>>>check res:', res)
        // console.log('>>>>check response:', response)
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })
    }
}

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctorsSeviceNode()
        return res.status(200).json(doctors)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let postDoctorsInfo = async (req, res) => {
    try {
        let response = await doctorService.postDoctorsInfoServiceNode(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDoctorsDetailById = async (req, res) => {
    try {
        let info = await doctorService.getDoctorsDetailByIdServiceNode(req.query.id);
        return res.status(200).json(info)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let putDoctorsInfo = async (req, res) => {
    try {
        let user = await doctorService.editDoctorMarkdownServiceNode(req.body)
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let schedule = await doctorService.bulkCreateScheduleServiceNode(req.body)
        return res.status(200).json(schedule)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getScheduleByDate = async (req, res) => {
    try {
        let data = await doctorService.getScheduleByDateServiceNode(req.query.doctorId, req.query.date)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getDoctorMoreInfoById = async (req, res) => {
    try {
        let info = await doctorService.getDoctorsMoreInfoByIdServiceNode(req.query.doctorId);
        return res.status(200).json(info)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDoctorProfileById = async (req, res) => {
    try {
        let info = await doctorService.getDoctorsProfileByIdServiceNode(req.query.doctorId);
        return res.status(200).json(info)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getListPatientsbyIdDate = async (req, res) => {
    try {
        let info = await doctorService.getListPatientsbyIdDateServiceNode(req.query.doctorId, req.query.date);
        return res.status(200).json(info)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

// ====================Upload single file Multer====================
//---- Configure multer storage 
const storageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/public/DoctorPrescription')//null: error can occur
    },
    filename: (req, file, cb) => {
        // console.log(file)
        cb(null, Date.now() + file.originalname)
    }
})
//----file filter: accept image only
const fileTypeFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|PDF|pdf)$/)) {
        //req.fileValidationError = 'Only image files are allowed';
        return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
}
//----Create a singleFileUpload middleware
const singleFileUpload = multer({ storage: storageEngine, fileFilter: fileTypeFilter }).single('fileName');

//----config Multer
let postUploadSingleFile = (req, res) => {
    //--token from React
    let data = req.body
    singleFileUpload(req, res, async function (err) {
        if (req.fileValidationError) {
            return res.status(400).send(req.fileValidationError);
        } else if (!req.file) {
            return res.status(400).send('Please select an image to upload');
        } else if (req.file instanceof multer.MulterError) {
            return res.status(500).send(req.file);
        } else if (err) {
            return res.status(500).send(err);
        }
        // console.log('=====================req:', req.file)
        //------Save file to DB------
        try {
            let info = await doctorService.postFileToDBServiceNode(req.file, data);
            return res.status(200).json(info)
        } catch (error) {
            console.log(error)
            return res.status(200).json({
                errCode: -1,
                errMessage: 'Error from server'
            })
        }
        //------End save file to DB------
    });
}
// ====================End Upload single file Multer====================

// ====================Get Download files from Server======================
let getFileDownload = async (req, res) => {
    try {
        let info = await doctorService.getFileDownloadServiceNode(req.query.token);
        return res.status(200).json(info)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}



module.exports = {
    getTopDoctor,
    getAllDoctors,
    postDoctorsInfo,
    getDoctorsDetailById,
    putDoctorsInfo,
    bulkCreateSchedule,
    getScheduleByDate,
    getDoctorMoreInfoById,
    getDoctorProfileById,
    getListPatientsbyIdDate,
    singleFileUpload,
    postUploadSingleFile,
    getFileDownload,
}