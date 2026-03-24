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

    const [rows] = await db.query(sql, values);

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

exports.createPortifolio = async (req, res) => {
  const {
    title,
    description,
    technologies,
    github_url,
    image_url,
    project_url,
  } = req.body;
  try {
    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }
    const [row0] = await db.query(
      "Select * from Protifolio where user_id = ?",
      [req.user.id],
    );

    if (row0.length > 0) {
      return res.status(400).json({
        message: "You already have a portifolio",
      });
    }
    const values = {
      title,
      description,
      technologies,
      github_url,
      image_url,
      project_url,
      user_id: req.user.id,
    };
    const [row1] = await db.query("INSERT INTO Protifolio SET ?", values);

    return res.status(201).json({
      message: "Portifolio created successfully",
      data: row1,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred while creating your portifolio.",
      error,
    });
  }
};

const getPOrtifoilioById = async (id) => {
  const query = "select * from Protifolio where user_id = ?";

  const [row] = await db.query(query, [id]);
  return row;
};

exports.getPortifolio = async (req, res) => {
  try {
    const portifolio = await getPOrtifoilioById(req.user.id);
    if (!portifolio) {
      return res.status(404).json({
        message: "Portifolio not found",
      });
    }
    return res.status(200).json({
      message: "Portifolio retrieved successfully",
      data: portifolio,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred while retrieving your portifolio.",
      error,
    });
  }
};

exports.updatePortifolio = async (req, res) => {
  const updateData = {
    title,
    description,
    technologies,
    github_url,
    image_url,
    project_url,
  };
  try {
    const fields = [];
    const values = [];

    for (let key in updateData) {
      if (updateData.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(req.body[key]);
      }
    }

    fields.push("updated_at = NOW()");

    const sql = `update portifolio set ${fields.join(", ")} where user_id = ?`;
    values.push(req.user.id);

    const [row] = await db.query(sql, values);

    if (!row) {
      return res.status(404).json({
        message: "Portifolio not found",
      });
    }
    return res.status(200).json({
      message: "Portifolio updated successfully",
      data: row,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred while updating your portifolio.",
      error,
    });
  }
};

exports.deletePortifolio = async (req, res) => {
  try {
    const [row] = await db.query(
      "DELETE FROM portifolio WHERE user_id = ? and id = ?",
      [req.user.id, req.params.id],
    );
    if (!row) {
      return res.status(404).json({
        message: "Portifolio not found",
      });
    }
    return res.status(200).json({
      message: "Portifolio deleted successfully",
      data: row,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred while deleting your portifolio.",
      error,
    });
  }
};
