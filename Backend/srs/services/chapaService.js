const axios = require("axios");

exports.initializePayment = async (amount, email, txRef) => {
  const CHAPA_URL = "https://api.chapa.co/v1/transaction/initialize";

  const config = {
    headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` },
  };

  const data = {
    amount: amount,
    currency: "ETB",
    email: email,
    tx_ref: txRef,
    callback_url: "https://your-domain.com/api/payments/webhook",
    return_url: "https://your-domain.com/dashboard",
  };

  const response = await axios.post(CHAPA_URL, data, config);
  return response.data.data.checkout_url; // Returns the Chapa payment page link
};
