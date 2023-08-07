import express from "express";
import homeController, { getAboutPage } from "../controllers/homeController";
import userController from '../controllers/userController';
import doctorController from '../controllers/doctorController'

let router = express.Router();

let initWebRoutes = (app) => {
    //router bên dưới viết theo chuẩn rest API
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.displayGetCRUD);

    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);

    router.get('/delete-crud', homeController.deleteCRUD);

    router.post('/api/login', userController.handleLogin)

    //READ
    router.get('/api/get-all-users', userController.handleGetAllUsers)
    //CREATE
    router.post('/api/create-new-users', userController.handleCreateNewUsers)
    //UPDATE
    router.put('/api/edit-user', userController.handleEditUsers)
    //DELETE
    router.delete('/api/delete-user', userController.handleDeleteUsers)

    //API for GETALLCODES
    router.get('/api/allcodes', userController.getAllCode)

    //Doctor API for homepage
    router.get('/api/homepage-top-doctor', doctorController.getTopDoctor)
    router.get('/api/get-all-doctors', doctorController.getAllDoctors)

    //Doctor API for Manage Doctor
    router.post('/api/save-doctors-info', doctorController.postDoctorsInfo)
    router.put('/api/update-doctors-info', doctorController.putDoctorsInfo)
    //Doctor API for DoctorDetail page
    router.get('/api/get-doctors-detail-by-id', doctorController.getDoctorsDetailById)
    router.get('/api/get-doctor-schedule-by-date', doctorController.getScheduleByDate)

    //API for doctor schedule
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule)



    return app.use("/", router)
}

module.exports = initWebRoutes;