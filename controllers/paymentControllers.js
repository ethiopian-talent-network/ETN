const paymentServices = require("../services/paymentervice");

exports.createPayment = async (req, res) => {
  try {
    const { job_id, currency, amount } = req.body;
    const user = req.user;

    const result = await paymentServices.createPayment(
      job_id,
      currency,
      amount,
      user,
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verfiyTransaction = async (req, res) => {
  try {
    const { tx_ref } = req.query;
    const payment = await paymentServices.verfiyAndUpdateTransaction(tx_ref);
    res.redirect("http://localhost:3000/payment-success");
  } catch (error) {
    res.redirect("http://localhost:3000/payment-failed");
  }
};
