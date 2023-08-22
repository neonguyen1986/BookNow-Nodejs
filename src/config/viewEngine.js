// Ta sẽ viết theo ES6
import express from "express";

let configViewEngine = (app) => {
    // arrow function
    app.use('/get-public/', express.static("./src/public")); //nghĩa là ảnh muốn lây trên server chỉ đc lấy ở public
    app.set("view engine", "ejs"); // nghĩa là file view có đuôi ejs. tương đương jsp của Java, blade của PHP
    app.set("views", "./src/views") //tìm ejs phải được tìm trong view
}

module.exports = configViewEngine;