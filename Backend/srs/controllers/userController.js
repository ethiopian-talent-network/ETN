const { User, Talent, Employer } = require("../models/User");

// @desc    Get current user profile
// @route   GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, skills, portfolioUrl, companyName, industry } = req.body;
    let updateFields = {};

    // Fields relevant for Talent
    if (req.user.role === "Talent") {
      if (fullName) updateFields.fullName = fullName;
      if (skills) updateFields.skills = Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim());
      if (portfolioUrl !== undefined) updateFields.portfolioUrl = portfolioUrl;
    }
    // Fields relevant for Employer
    else if (req.user.role === "Employer") {
      if (companyName) updateFields.companyName = companyName;
      if (industry) updateFields.industry = industry;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    ).select("-passwordHash");

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Earn Tokens (E.g. from tests)
// @route   POST /api/users/earn-tokens
exports.earnTokens = async (req, res) => {
  try {
    const { tokensToEarn } = req.body;
    if (req.user.role !== "Talent") {
      return res.status(403).json({ success: false, message: "Only Talents can earn tokens" });
    }

    const value = parseInt(tokensToEarn) || 0;
    const updatedUser = await Talent.findByIdAndUpdate(
      req.user.id,
      { $inc: { tokenBalance: value } },
      { new: true }
    ).select("-passwordHash");

    res.status(200).json({ success: true, data: updatedUser, message: `Successfully earned ${value} tokens` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all talents for networking
// @route   GET /api/users/talents
exports.getTalents = async (req, res) => {
  try {
    // Return all talents except the requesting user
    const talents = await Talent.find({ _id: { $ne: req.user.id } })
                                .select("fullName skills portfolioUrl email tokenBalance");
    res.status(200).json({ success: true, data: talents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
