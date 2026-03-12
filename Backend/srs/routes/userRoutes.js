const express = require("express");
const router = express.Router();
const { getProfile, updateProfile, earnTokens, getTalents } = require("../controllers/userController");
const { protect } = require("../middlewares/auth");

router.route("/profile")
  .get(protect, getProfile)
  .put(protect, updateProfile);

router.post("/earn-tokens", protect, earnTokens);
router.get("/talents", protect, getTalents);

module.exports = router;
