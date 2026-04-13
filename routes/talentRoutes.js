const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/authMiddleWare");
const { authorizeRole } = require("../middlewares/roleMiddleWare");
const {
  talentProfile,
  talentDashBoard,
  updateProfile,
  createPortifolio,
  getPortifolio,
  updatePortifolio,
  deletePortifolio,
  applyForJob,
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

router.get("/portifolio", authenticate, authorizeRole("talent"), getPortifolio);
router.post(
  "/portifolio",
  authenticate,
  authorizeRole("talent"),
  createPortifolio,
);
router.patch(
  "/updatePortifolio",
  authenticate,
  authorizeRole("talent"),
  updatePortifolio,
);
router.delete(
  "/deletePortifolio",
  authenticate,
  authorizeRole("talent"),
  deletePortifolio,
);

router.post("/applyForJob", authenticate, authorizeRole("talent"), applyForJob);

module.exports = router;
