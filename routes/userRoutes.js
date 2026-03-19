const express = require('express');

const router = express.Router();


const { authenticate } = require('../middlewares/authMiddleWare');
const {authorizeRole} = require('../middlewares/roleMiddleWare')

router.get('/profile' , authenticate, (req , res) => {
    return res.status(200).json({
        success: true,
        message: 'Profile'
    });
})


router.get('/adminDashboard', authenticate, authorizeRole('admin'), (req , res) => {
    return res.status(200).json({
        success: true,
        message: 'Admin Dashboard'
    });
});

module.exports = router;

