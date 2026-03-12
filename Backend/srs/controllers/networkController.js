const mongoose = require("mongoose");
const { User, Talent } = require("../models/User");
const Connection = require("../models/Connection");

// @desc    Get Network (Peers, Searches, People You May Know)
// @route   GET /api/network/search
exports.searchNetwork = async (req, res) => {
  try {
    const { skills, role, location } = req.query;
    let query = { _id: { $ne: req.user.id } }; // Exclude current user

    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim());
      query.skills = { $in: skillsArray };     
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    // Note: Assuming 'role' refers to 'Talent' or 'Employer'. Usually you search other talents
    if (role && role !== 'Talent') {
       query.role = role;
    } else {
       query.role = "Talent"; // Default searching for peers
    }

    const peers = await User.find(query).select("fullName skills location bio email");
    res.status(200).json({ success: true, data: peers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get "People You May Know"
// @route   GET /api/network/suggestions
exports.getSuggestions = async (req, res) => {
  try {
    const currentUser = await Talent.findById(req.user.id);
    if (!currentUser || currentUser.role !== "Talent") {
       return res.status(400).json({ success: false, message: "Only Talents have suggestions" });
    }

    // Find other talents with overlapping skills
    const suggestions = await Talent.find({
      _id: { $ne: req.user.id },
      skills: { $in: currentUser.skills }
    }).limit(10).select("fullName skills location bio email");

    res.status(200).json({ success: true, data: suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send Connection Request
// @route   POST /api/network/request/:userId
exports.sendRequest = async (req, res) => {
  try {
    const recipientId = req.params.userId;
    if (recipientId === req.user.id) return res.status(400).json({ success: false, message: "Cannot connect with yourself." });

    const existing = await Connection.findOne({
      $or: [
        { requester: req.user.id, recipient: recipientId },
        { requester: recipientId, recipient: req.user.id }
      ]
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "Connection already exists or is pending." });
    }

    const conn = await Connection.create({ requester: req.user.id, recipient: recipientId });
    res.status(201).json({ success: true, data: conn, message: "Request sent." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Respond to Connection Request (Accept/Ignore)
// @route   PUT /api/network/request/:connId
exports.respondRequest = async (req, res) => {
  try {
    const { status } = req.body; // "accepted" or "ignored"
    if (!["accepted", "ignored"].includes(status)) {
       return res.status(400).json({ success: false, message: "Invalid status." });
    }

    const conn = await Connection.findOne({ _id: req.params.connId, recipient: req.user.id, status: "pending" });
    if (!conn) return res.status(404).json({ success: false, message: "Pending request not found." });

    conn.status = status;
    await conn.save();

    res.status(200).json({ success: true, data: conn, message: `Request ${status}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get My Connections (Accepted)
// @route   GET /api/network/connections
exports.getConnections = async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [{ requester: req.user.id }, { recipient: req.user.id }],
      status: "accepted"
    }).populate("requester", "fullName email skills").populate("recipient", "fullName email skills");
    
    // Map to get the *other* person's details
    const connectedPeers = connections.map(c => 
      c.requester._id.toString() === req.user.id ? c.recipient : c.requester
    );

    res.status(200).json({ success: true, data: connectedPeers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Pending Requests
// @route   GET /api/network/pending
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await Connection.find({ recipient: req.user.id, status: "pending" })
                                     .populate("requester", "fullName email skills location");
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Endorse a skill of a connected peer
// @route   POST /api/network/endorse/:userId
exports.endorseSkill = async (req, res) => {
  try {
    const peerId = req.params.userId;
    const { skill } = req.body;

    // Check if connected
    const conn = await Connection.findOne({
      $or: [
        { requester: req.user.id, recipient: peerId },
        { requester: peerId, recipient: req.user.id }
      ],
      status: "accepted"
    });

    if (!conn) {
      return res.status(403).json({ success: false, message: "You must be connected to endorse." });
    }

    const peer = await Talent.findById(peerId);
    if (!peer) return res.status(404).json({ success: false, message: "Peer not found." });

    // Check if valid skill
    if (!peer.skills.includes(skill)) {
       return res.status(400).json({ success: false, message: "Peer does not have this skill listed." });
    }

    // Check if already endorsed
    const alreadyEndorsed = peer.endorsements.find(
       e => e.skill === skill && e.endorserId.toString() === req.user.id
    );

    if (alreadyEndorsed) {
       return res.status(400).json({ success: false, message: "Already endorsed this skill." });
    }

    peer.endorsements.push({ skill, endorserId: req.user.id });
    await peer.save();

    res.status(200).json({ success: true, message: `Successfully endorsed ${skill}.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
