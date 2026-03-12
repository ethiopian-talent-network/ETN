const Job = require("../models/Job");

// @desc    Get all jobs
// @route   GET /api/jobs
exports.getJobs = async (req, res) => {
  try {
    const { skills, search } = req.query;
    let query = {};
    
    // If skills query passed, filter jobs that match the talent's skills
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      // Match jobs where at least one of the job's required skills is in the user's skillset
      // Using $in on skillsRequired array
      query.skillsRequired = { $in: skillsArray };
    }

    // If search query passed, filter by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const jobs = await Job.find(query).populate("employerId", "companyName fullName");
    res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("employerId", "companyName fullName");
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== "Employer") {
      return res.status(403).json({ success: false, message: "Only employers can create jobs" });
    }

    const jobData = { ...req.body, employerId: req.user.id };
    const job = await Job.create(jobData);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
