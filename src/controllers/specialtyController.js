import specialtyService from '../services/specialtyService'

let postCreateNewSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.postCreateNewSpecialtyServiceNode(req.body);
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

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

module.exports = {
    postCreateNewSpecialty,
    getAllSpecialty,
}