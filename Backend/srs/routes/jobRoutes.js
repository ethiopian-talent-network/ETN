const express = require("express");
const router = express.Router();
const { getJobs, getJob, createJob } = require("../controllers/jobController");
const { protect } = require("../middlewares/auth");

router.route("/")
  .get(getJobs)
  .post(protect, createJob);

router.route("/:id")
  .get(getJob);

module.exports = router;
