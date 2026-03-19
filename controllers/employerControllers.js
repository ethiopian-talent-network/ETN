const db = require("../config/db").promise();

exports.employerDashboard = async (req, res) => {
  const { company_name, company_discription, website, location, username } = req.body;

  if (!company_name || !company_discription || !location || !username) {
    return res.status(400).json({ message: "please fill required fields" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM employers WHERE username = ?", [username]);
    if (rows.length > 0) {
      return res.status(400).send({ message: "Username already exists" });
    }

    const values = { company_name, company_discription, website, location, username, user_id: req.user.id };
    const [result] = await db.query("INSERT INTO employers SET ?", [values]);

    if (result.affectedRows > 0) {
      return res.status(200).send({ message: "Employer registered successfully" });
    } else {
      return res.status(500).send({ message: "Failed to register employer" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error", error });
  }
};

exports.employerProfile = async (req, res) => {
    
  const sql =
    "select  u.name , u.email ,e.company_name, e.company_discription, e.website, e.location , e.username from employers e join users u on e.user_id = u.id where e.user_id = ?";
try{
    const [rows] = await db.query(sql, [req.user.id]);

    if (rows.length === 0) {
        return res.status(404).send({ message: "Employer profile not found" });
    }

    return res.status(200).send({ message: "Employer profile", data: rows[0] });


}catch(error){
    return res.status(500).send({ message: "Internal server error", error });
}


}