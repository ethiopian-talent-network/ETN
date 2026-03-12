const express = require("express");
const router = express.Router();
const { getMessages } = require("../controllers/messageController");
const { protect } = require("../middlewares/auth");

router.get("/:peerId", protect, getMessages);

module.exports = router;
