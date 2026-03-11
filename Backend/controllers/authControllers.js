const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

dotenv.config({ path: "./.env" });
const db = require("../config/db");
const redis = require("../config/redis");

const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

exports.signup = async (req, res) => {
  console.log(req.body);

  const { name, email, password, passwordConfirm } = req.body;

  db.query(
    "select email from users where email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        return res.status(400).send({
          message: "That email is already in use",
        });
      } else if (password !== passwordConfirm) {
        return res.status(400).send({
          message: "Passwords do not match",
        });
      }
      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      const otp = generateOTP();
      await redis.set(`otp:${email}`, otp, "EX", 300);

      const sql = "insert into users set ?";
      const values = {
        name: name,
        email: email,
        password: hashedPassword,
      };

      db.query(sql, values, async (error, results) => {
        if (error) {
          return res.status(500).send({
            message: "Internal server error",
          });
        }
        if (results) {
          await transporter.sendMail({
            from: "aberashtolesab@gmail.com",
            to: email,
            subject: "OTP",
            text: otp,
          });
          return res.status(200).send({
            message: "User registered successfully",
          });
        }
      });
    },
  );
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const redisOtp = await redis.get(`otp:${email}`);

    const sql = "select * from users where email = ?";
    const values = [email];

    db.query(sql, values, async (error, results) => {
      const user = results[0];

      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      }

      if (user.isVerified) {
        return res.status(400).send({
          message: "User already verified",
        });
      }
      if (otp !== redisOtp) {
        return res.status(400).send({
          message: "Invalid OTP or expired",
        });
      }
      await redis.del(`otp:${email}`);

      const updateSql = "update users set is_verified = ? where email = ?";
      const updateValues = [true, email];

      db.query(updateSql, updateValues, (error, results) => {
        if (error) {
          return res.status(500).send({
            message: "Failed to verify OTP",
          });
        }
        if (results) {
          return res.status(200).send({
            message: "OTP verified successfully",
          });
        }
      });
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
      error,
    });
  }
};



exports.resendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  const sql = "select * from users where email = ?";
  db.query(sql, [email], async (error, results) => {
    if (error) {
      return res.status(500).send({
        message: "Internal server error",
      });
    }
    const user = results[0];

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    if (user.isVerified) {
      return res.status(400).send({
        message: "User already verified",
      });
    }
    if (results) {
      const otp = generateOTP();
      await redis.set(`otp:${email}`, otp, "EX", 300);

      await transporter.sendMail({
        from: "aberashtolesab@gmail.com",
        to: email,
        subject: "OTP",
        text: `Your OTP is ${otp}`,
      });
    }
  });
};

exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    const sql = "select * from users where email = ?";

    db.query(sql, [email], async (error, results) => {
      if (error) {
        return res.status(500).send({
          message: "Internal server error",
        });
      }

      const user = results[0];

      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      }

      const Match = await bcrypt.compare(password, user.password);

      if (!Match) {
        return res.status(400).send({
          message: "Invalid password",
        });
      }

      if (!user.isVerified) {
        return res.status(400).send({
          message: "User not verified, please verify your email",
        });
      }
      return res.status(200).send({
        message: "User logged in successfully",
      });
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error",
      error,
    });
  }
};
