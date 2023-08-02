import doctorService from '../services/doctorService'
let getTopDoctor = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await doctorService.getTopDoctorServiceNode(+limit);
        console.log('>>>check res:', res)
        console.log('>>>>check response:', response)
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })
    }
}

module.exports = {
    getTopDoctor,
}