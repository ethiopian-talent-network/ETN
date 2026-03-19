const express = require('express');
const router = express.Router();

const {employerProfile, employerDashboard} = require('../controllers/employerControllers');

const {authenticate} = require('../middlewares/authMiddleWare');
const {authorizeRole} = require('../middlewares/roleMiddleWare');

router.get('/employerProfile' , authenticate , authorizeRole('employer') , employerProfile);
router.post('/employerDashboard' , authenticate , authorizeRole('employer') ,employerDashboard );


module.exports = router;
