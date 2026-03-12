const { User, Talent, Employer } = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { email, password, role, ...rest } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let newUser;
    if (role === "Talent") {
      // Process skills into an array if they are passed as a comma-separated string
      if (rest.skills && typeof rest.skills === "string") {
        rest.skills = rest.skills.split(",").map((s) => s.trim());
      }
      newUser = await Talent.create({ email, passwordHash, ...rest });
    } else if (role === "Employer") {
      newUser = await Employer.create({ email, passwordHash, ...rest });
    }

    res
      .status(201)
      .json({ message: "User created successfully", userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token, role: user.role, email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
