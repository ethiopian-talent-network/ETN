const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/authMiddleWare");
const { authorizeRole } = require("../middlewares/roleMiddleWare");
const {
  talentProfile,
  talentDashBoard,
  updateProfile

} = require("../controllers/talentController");

router.get(
  "/talentProfile",
  authenticate,
  authorizeRole("talent"),
  talentProfile,
);

router.post(
  "/talentDashboard",
  authenticate,
  authorizeRole("talent"),
  talentDashBoard,
);

router.patch(
  "/talentProfile",
  authenticate,
  authorizeRole("talent"),
  updateProfile,
);

module.exports = router;
