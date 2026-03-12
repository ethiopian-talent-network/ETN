const dotenv = require("dotenv").config;
const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "access denied , no token provided!" });
  }

  const token = authHeader.split(" ")[1];
  console.log({msg: "token revived", token});
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log({msg: "token verified", decode});
    req.user = decode;
    next();
  } catch (error) {
    console.log({msg: "invalid token", error});
  }
};
