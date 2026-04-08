const db = require("../config/db").promise();
const chapa = require("./chapaServices");
const { v4: uuidv4 } = require("uuid");

exports.createPayment = async (user, job_id, currency, amount) => {
  try {
    const tx_ref = uuidv4();
    const sql = "INSERT INTO payments set ?";
    const values = {
      job_id,
      client_id: user.id,
      amount,
      transaction_id: tx_ref,
      currency,
      status: "pending",
    };
    await db.query(sql, values);

    const chapaResponse = await chapa.initializePayment({
      amount,
      currency,
      email: user.email,
      first_name: user.company_name,
      last_name: "user",
      tx_ref,
      callback_url: "http://localhost:5000/api/payments/verify",
      return_url: "http://localhost:3000/payment/success",
    });
    return {
      check_url: chapaResponse.data.data.checkout_url,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.verfiyAndUpdateTransaction = async (tx_ref) => {
  const result = await chapa.verifyPayment(tx_ref);
  if (result.status !== "success") {
    const sql =
      "update payments set status = 'failed' where transaction_id = ?";
    await db.query(sql, [tx_ref]);
    throw new Error("Payment failed");
  }

  await db.query(
    "update payments set status = 'success' where transaction_id = ?",
    [tx_ref],
  );

  const [row] = await db.query(
    "select * from payments where transaction_id = ?",
    [tx_ref],
  );
  return row[0];
};
