const Message = require("../models/Message");

// @desc    Get chat history between current user and peer
// @route   GET /api/messages/:peerId
exports.getMessages = async (req, res) => {
  try {
    const peerId = req.params.peerId;
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: peerId },
        { sender: peerId, receiver: req.user.id }
      ]
    }).sort("createdAt"); // Oldest first

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
