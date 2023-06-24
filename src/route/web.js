import express from "express";
import homeController, { getAboutPage } from "../controllers/homeController";


let router = express.Router();

let initWebRoutes = (app) => {
    //router bên dưới viết theo chuẩn rest API
    router.get('/', homeController.getHomePage);

    router.get('/about', homeController.getAboutPage);

    return app.use("/", router)
}

module.exports = initWebRoutes;