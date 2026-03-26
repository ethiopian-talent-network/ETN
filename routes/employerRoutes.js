const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/authMiddleWare");
const { authorizeRole } = require("../middlewares/roleMiddleWare");
const {
  employerProfile,
  employerDashboard,
  categories
} = require("../controllers/employerControllers");

router.get(
  "/employerProfile",
  authenticate,
  authorizeRole("employer"),
  employerProfile,
);
router.post(
  "/employerDashboard",
  authenticate,
  authorizeRole("employer"),
  employerDashboard,
);
router.get("/categories" , categories)

module.exports = router;
