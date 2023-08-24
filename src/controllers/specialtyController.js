import specialtyService from '../services/specialtyService'
import multer from 'multer';

let getAllSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.getAllSpecialtyServiceNode();
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailSpecialtyByIdLocation = async (req, res) => {
    try {
        let data = await specialtyService.getDetailSpecialtyByIdLocationServiceNode(req.query.id, req.query.locationId);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

// ===================CREATE SPECIALTY USING Multer====================
//---- Configure multer storage
const storageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './src/public/SpecialyImage')//null: error can occur
    },
    filename: (req, file, cb) => {
        // console.log(file)
        cb(null, Date.now() + file.originalname)
    }
})
//----file filter: accept image only
const imageFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        //req.fileValidationError = 'Only image files are allowed';
        return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
}
//----Create a singleFileUpload middleware
const singleImageUpload = multer({ storage: storageEngine, fileFilter: imageFilter }).single('fileName');


//----config Multer
let postCreateEditNewSpecialty = (req, res) => {
    //--token from React
    // console.log('---------------req:', req.body)
    let data = {
        id: req.body.id,
        specialtyNameEn: req.body.specialtyNameEn,
        specialtyNameFr: req.body.specialtyNameFr,
        markdownSpecialtyEn: req.body.markdownSpecialtyEn,
        markdownSpecialtyFr: req.body.markdownSpecialtyFr,
        HTMLSpecialtyEn: req.body.HTMLSpecialtyEn,
        HTMLSpecialtyFr: req.body.HTMLSpecialtyFr,
        isEdit: req.body.isEdit,
    }
    singleImageUpload(req, res, async function (err) {
        if (req.fileValidationError) {
            return res.status(400).send(req.fileValidationError);
        } else if (!req.file) {
            return res.status(400).send('Please select an image to upload');
        } else if (req.file instanceof multer.MulterError) {
            return res.status(500).send(req.file);
        } else if (err) {
            return res.status(500).send(err);
        }
        //------Save file to DB------
        try {
            // console.log('---------------req:', req.body)

            let info = await specialtyService.postCreateEditNewSpecialtyServiceNode(req.file, data);
            return res.status(200).json(info)
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                errCode: -1,
                errMessage: 'Error from server'
            })
        }
        //------End save file to DB------
    });
}
// ====================End Upload single file Multer====================
let deleteSpecialtyById = async (req, res) => {
    try {
        // console.log('=============================', req.body)
        let data = await specialtyService.deleteSpecialtyByIdServiceNode(req.body.id);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    postCreateEditNewSpecialty,
    deleteSpecialtyById,
    getAllSpecialty,
    getDetailSpecialtyByIdLocation,
    singleImageUpload,
}