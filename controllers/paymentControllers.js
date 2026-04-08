const paymentServices = require("../services/paymentervice");
const db = require("../config/db").promise();

exports.createPayment = async (req, res) => {
  try {
    const { currency, amount, job_id, method } = req.body;
    const user = req.user;

    const [rows] = await db.query("SELECT * FROM jobs WHERE id = ?", [job_id]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "jod is not found" });
    }

    const result = await paymentServices.createPayment(
      user,
      currency,
      amount,
      job_id,
      method,
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      context: "just the controller is wrong",
    });
  }
};

exports.verfiyTransaction = async (req, res) => {
  try {
    const { tx_ref } = req.query;
    const payment = await paymentServices.verfiyAndUpdateTransaction(tx_ref);
    res.redirect("http://localhost:5000/payment-success");
  } catch (error) {
    res.redirect("http://localhost:3000/payment-failed");
  }
};
