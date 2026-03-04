const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

dotenv.config({ path: "./.env" });
const db = require("../config/db");

const nodemailer = require("nodemailer");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aberashtolesab@gmail.com",
    pass: "rbcabdrxmnmjdnqf",
  },
});

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

exports.register = (req, res) => {
  console.log(req.body);

  const { name, surname, email, password, passwordConfirm, message } = req.body;

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
      const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

      const sql = "insert into users set ?";
      const values = {
        name: name,
        surname: surname,
        email: email,
        password: hashedPassword,
        message: message,
        otp: otp,
        otpExpiry: otpExpiry,
      };

      db.query(sql, values, (error, results) => {
        if (error) {
          return res.status(500).send({
            message: "Internal server error",
          });
        }
        if (results) {
          transporter.sendMail({
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

exports.verifyOTP = (req, res) => {
  try {
    const { email, otp } = req.body;

    const sql = "select * from users where email = ?";
    const values = [email];

    db.query(sql, values, (error, results) => {
      const user = results[0];
      const now = new Date();

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
      if (user.otp !== otp || user.otpExpiry < now) {
        return res.status(400).send({
          message: "Invalid OTP or OTP expired",
        });
      }
      const updateSql =
        "update users set isVerified = ?, otp = ?, otpExpiry = ? where email = ?";
      const updateValues = [true, null, null, email];

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

exports.resendOTP = (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  const sql = "select * from users where email = ?";
  db.query(sql, [email], (error, results) => {
    const user = results[0];
    user.otp = otp;
    user.otpExpiry = otpExpiry;

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
      const updateSql =
        "update users set otp = ?, otpExpiry = ? where email = ?";
      const updateValues = [otp, otpExpiry, email];

      db.query(updateSql, updateValues, (error, results) => {
        if (error) {
          return res.status(500).send({
            message: "Internal server error",
          });
        }
        if (results) {
          transporter.sendMail({
            from: "aberashtolesab@gmail.com",
            to: email,
            subject: "OTP",
            text: otp,
          });

          return res.status(200).send({
            message: "OTP re-sent successfully",
          });
        }
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
