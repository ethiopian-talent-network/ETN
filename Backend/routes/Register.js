const express = require('express');
const router = express.Router();

const RegisterController = require('../controllers/register');


router.post('/register', RegisterController.register)
router.post('/verify-otp', RegisterController.verifyOTP)
router.post('/resend-otp', RegisterController.resendOTP)
router.post('/login', RegisterController.login)



module.exports = router;