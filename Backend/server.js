const express = require('express');
const mysql = require("mysql2");
 const path = require('path');   
 const db = require("./config/db")


const app = express();


const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.use('/auth', require('./routes/authRoutes'));

app.listen(5000, () => {
  console.log("Server is running on port http://localhost:5000");
});