const express = require("express");
const router = express.Router();
const { 
  searchNetwork, 
  getSuggestions, 
  sendRequest, 
  respondRequest, 
  getConnections, 
  getPendingRequests, 
  endorseSkill 
} = require("../controllers/networkController");
const { protect } = require("../middlewares/auth");

router.get("/search", protect, searchNetwork);
router.get("/suggestions", protect, getSuggestions);
router.post("/request/:userId", protect, sendRequest);
router.put("/request/:connId", protect, respondRequest);
router.get("/connections", protect, getConnections);
router.get("/pending", protect, getPendingRequests);
router.post("/endorse/:userId", protect, endorseSkill);

module.exports = router;
