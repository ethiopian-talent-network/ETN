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
  "/portifolio/:id",
  authenticate,
  authorizeRole("talent"),
  updatePortifolio,
);
router.delete(
  "/portifolio/:id",
  authenticate,
  authorizeRole("talent"),
  deletePortifolio,
);
module.exports = router;
