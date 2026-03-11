const aiService = require("../services/aiService");
const { Talent } = require("../models/User");

exports.createProposal = async (req, res) => {
  const { jobDescription } = req.body;
  const userId = req.user.id;

  try {
    const talent = await Talent.findById(userId);

    // Token Implementation (Deduct token for AI generation)
    if (talent.tokenBalance < 1) {
      return res
        .status(403)
        .json({ message: "Insufficient Tokens. Please recharge." });
    }

    // Generate Letter
    const skillsString = talent.skills.join(", ");
    const letter = await aiService.generateMotivationLetter(
      skillsString,
      jobDescription
    );

    // Consume Token
    talent.tokenBalance -= 1;
    await talent.save();

    res.json({
      success: true,
      remainingTokens: talent.tokenBalance,
      draft: letter,
    });
  } catch (error) {
    res.status(500).json({ message: "AI Generation Failed" });
  }
};
