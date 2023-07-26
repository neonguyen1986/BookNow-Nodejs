import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB"
import cors from 'cors';
// var cors = require('cors')

require('dotenv').config(); // gọi config của deotenv giúp chạy được process.env

let app = express();
//config app

//cross origin
app.use(cors({
    origin: process.env.URL_REACT,
    credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969;
// Port = undefined -> port = 6969

app.listen(port, () => {
    //callback
    console.log("backend Nodejs is running on the port " + port)
})