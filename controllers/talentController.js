const db = require("../config/db").promise();

exports.talentDashBoard = async (req, res) => {
  console.log("🔥 THIS CONTROLLER IS HIT");
  const {
    skills,
    education,
    experience,
    languages,

    linkedin,
    github,
    resume_url,
  } = req.body;
  if (!skills) {
    return res.status(400).send({ message: "Skills are required" });
  }
  try {
    const query = "SELECT * FROM talents where user_id = ?";
    const [row0] = await db.query(query, [req.user.id]);

    if (row0.length > 0) {
      return res.status(400).send({ message: "Talent already exists" });
    }

    const values = {
      user_id: req.user.id,
      skills,
      education,
      experience,
      languages,

      linkedin,
      github,
      resume_url,
    };
    const insertquery = "INSERT INTO talents SET ?";
    const [row1] = await db.query(insertquery, values);

    if (row1.affectedRows > 0) {
      return res
        .status(201)
        .send({ message: "Talent registered successfully" });
    } else {
      return res.status(500).send({ message: "Failed to register talent" });
    }
  } catch (error) {
    res.status(500).send({
      message: "An unexpected error occurred while saving your profile.",
      error,
    });
  }
};

exports.talentProfile = async (req, res) => {
  const fetchQuery =
    "select u.name , u.email , t.skills , t.education , t.experience , t.languages , t.linkedin , t.github , t.resume_url from talents t join users u on t.user_id = u.id where t.user_id = ?";

  try {
    const [rows] = await db.query(fetchQuery, [req.user.id]);

    if (rows.length === 0) {
      return res.status(404).send({ message: "Talent profile not found" });
    }

    return res.status(200).send({ message: "Talent profile", data: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "An unexpected error occurred while fetching your profile.",
      error,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updateData = [
      "skills",
      "education",
      "experience",
      "languages",

      "linkedin",
      "github",
      "resume_url",
    ];

    let fields = [];
    let values = [];

    for (let key in req.body) {
      if (updateData.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(req.body[key]);
      }
    }

    if (fields.length === 0) {
      return res.status(400).send({ message: "No fields to update" });
    }

    fields.push("updated_at = NOW()");
    const sql = `UPDATE talents SET ${fields.join(" ,")} where user_id = ?`;
    values.push(req.user.id);

    [rows] = await db.query(sql, values);

    if (rows.affectedRows === 0) {
      return res.status(404).send({ message: "Talent profile not found" });
    }

    if (rows.affectedRows > 0) {
      return res.status(200).send({ message: "Profile updated successfully" });
    } else {
      return res.status(500).send({ message: "Failed to update profile" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "An unexpected error occurred while updating your profile.",
      error,
    });
  }
};
