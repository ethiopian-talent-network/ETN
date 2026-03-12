const dotenv = require("dotenv").config();
const express = require('express');
const path = require('path');   


const app = express();


app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.use('/auth', require('./routes/authRoutes'));
app.use('/user', require('./routes/userRoutes'))
console.log("JWT_SECRET:", process.env.JWT_SECRET)
app.listen(5000, () => {
  console.log("Server is running on port http://localhost:5000");
});