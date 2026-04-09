const db = require("../config/db").promise();
const chapa = require("./chapaServices");
const { v4: uuidv4 } = require("uuid");

exports.createPayment = async (user, currency, amount, job_id, method) => {
  const connection = await db.getConnection();

  try {
    if (!user || !user.id) {
      throw new Error("unathorized access");
    }

    if (!currency || !job_id || !amount || !method) {
      throw new Error("invalid payment");
    }

    await connection.beginTransaction();
    const [checkHiredTalent] = await connection.query(
      "SELECT talent_id FROM applications where jod_id = ? and status = 'accepted'",
      [job_id],
    );

    if (checkHiredTalent.length === 0) {
      throw new Error("No hired talent found for this application");
    }

    const talent_id = checkHiredTalent[0].talent_id;

    const tx_ref = uuidv4();

    const sql = "INSERT INTO payments set ?";
    const values = {
      job_id,
      client_id: user.id,
      amount,
      transaction_id: tx_ref,
      currency,
      method,
      status: "pending",
    };
    await connection.query(sql, values);

    await connection.query(
      "INSERT INTO escrow (job_id, talent_id , employer_id , amount , currency , status , treansaction_ref) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [job_id, talent_id, user.id, amount, currency, "pending", tx_ref],
    );

    const chapaResponse = await chapa.initializePayment({
      amount,
      currency,
      method,
      email: user.email,
      first_name: user.company_name,
      last_name: "user",
      tx_ref,
      callback_url: "http://localhost:5000/payments/verify",
      return_url: "http://localhost:3000/payment/success",
    });

    const checkout_url = chapaResponse?.data?.checkout_url;

    if (!checkout_url) {
      console.log("Chapa response:", chapaResponse);
      throw new Error("Failed to get checkout URL from Chapa");
    }

    await connection.commit();

    return { check_url: checkout_url };
  } catch (error) {
    console.log(error);
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

exports.verfiyAndUpdateTransaction = async (tx_ref) => {
  if (!tx_ref) throw new Error("invalid transaction ID");
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

  const [rows] = await db.query(
    "select * from payments where transaction_id = ?",
    [tx_ref],
  );
  return rows[0];
};
