import doctorService from '../services/doctorService'
let getTopDoctor = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
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
}