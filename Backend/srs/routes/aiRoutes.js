const express = require("express");
const router = express.Router();
const { createProposal } = require("../controllers/aiController");
const { protect } = require("../middlewares/auth");

// Protected route: Only logged in users can generate AI proposals
router.post("/generate-proposal", protect, createProposal);

module.exports = router;
