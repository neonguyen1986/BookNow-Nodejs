import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
require('dotenv').config(); // gọi config của deotenv giúp chạy được process.env

let app = express();
//config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRoutes(app);

let port = process.env.PORT || 6969;
// Port = undefined -> port = 6969

app.listen(port, () => {
    //callback
    console.log("backend Nodejs is running on the port " + port)
})