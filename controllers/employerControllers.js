const db = require("../config/db").promise();

exports.employerDashboard = async (req, res) => {
  const { company_name, company_discription, website, location, username } =
    req.body;

  if (!company_name || !company_discription || !location || !username) {
    return res.status(400).json({ message: "please fill required fields" });
  }
  if (!req.user || !req.user.id) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  try {
    const [rows] = await db.query(
      "SELECT * FROM employers WHERE username = ?",
      [username],
    );
    if (rows.length > 0) {
      return res.status(400).send({ message: "username already exists" });
    }

    const [exstingEmployer] = await db.query(
      "SELECT * FROM employers where user_id = ?",
      [req.user.id],
    );
    if (exstingEmployer.length > 0) {
      return res
        .status(400)
        .json({ message: "employer profile already exist" });
    }

    const values = {
      company_name,
      company_discription,
      website,
      location,
      username,
      user_id: req.user.id,
    };
    const [result] = await db.query("INSERT INTO employers SET ?", [values]);

    if (result.affectedRows > 0) {
      return res
        .status(200)
        .send({ message: "Employer registered successfully" });
    } else {
      return res.status(500).send({ message: "Failed to register employer" });
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).send({ message: "Username already exists" });
    }

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).send({ message: "User not found" });
    }

    console.error(error);
    return res.status(500).send({
      message: "An unexpected error occurred while saving your profile.",
      error,
    });
  }
};

exports.employerProfile = async (req, res) => {
  const sql =
    "select  u.name , u.email ,e.company_name, e.company_discription, e.website, e.location , e.username from employers e join users u on e.user_id = u.id where e.user_id = ?";
  try {
    const [rows] = await db.query(sql, [req.user.id]);

    if (rows.length === 0) {
      return res.status(404).send({ message: "Employer profile not found" });
    }

    return res.status(200).send({ message: "Employer profile", data: rows[0] });
  } catch (error) {
    return res.status(500).send({
      message: "An unexpected error occurred while fetching your profile.",
      error,
    });
  }
};

exports.categories = async (req, res) => {
  try {
    const sql = "select * from categories";

    const [rows] = await db.query(sql);

    return res.status(200).json({ message: "Categories", data: rows });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred while fetching categories.",
      error,
    });
  }
};

exports.postJobs = async (req, res) => {
  try {
    const {
      title,
      discription,
      salary,
      budget_type,
      experience_level,
      status,
      category_id,
    } = req.body;

    if (
      !title ||
      !discription ||
      !salary ||
      !budget_type ||
      !experience_level ||
      !status ||
      !category_id
    ) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const [emploterRow] = await db.query(
      "select * from employers where user_id = ?",
      [req.user.id],
    );

    if (emploterRow.length === 0) {
      return res.status(404).send({ message: "Employer not found" });
    }

    const employer_id = emploterRow[0].id;

    await db.query(
      "insert into jobs (title, discription, salary, budget_type, experience_level, status, category_id, employer_id) values (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        discription,
        salary,
        budget_type,
        experience_level,
        status,
        category_id,
        employer_id,
      ],
    );

    return res.status(201).send({ message: "Job posted successfully" });
  } catch (error) {
    return res.status(500).send({
      message: "An unexpected error occurred while posting the job.",
      error,
    });
  }
};

exports.getAppliedJobs = async (req, res) => {
  try {
    const [appliedJobs] = await db.query(
      "select a.cover_letter , u.name  , u.email from applications a join users u on a.id = u.id ",
    );
    if (!appliedJobs || appliedJobs.length === 0) {
      return res.status(404).json({ message: "No applied jobs found" });
    }

    return res.status(200).json({ message: "Applied jobs", data: appliedJobs });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred while fetching applied jobs.",
      error,
    });
  }
};

exports.shorListTalents = async (req, res) => {
  const { applicationID } = req.body;
  try {
    const [application] = await db.query(
      "update applications set status = 'shortlisted' where id = ? and status = 'pending'",
      [applicationID],
    );

    if (application.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Application not found or already processed" });
    }

    return res.status(200).json({
      message: "Talent shortlisted successfully",
      data: application,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred while shortlisting talents.",
      error,
    });
  }
};

exports.hireTalents = async (req, res) => {
  const connection = await db.getConnection();
  const { jobId, talentId } = req.body;
  try {
    await connection.beginTransaction();
    const [applications] = await connection.query(
      "select * from applications where jod_id = ? and talent_id = ?",
      [jobId, talentId],
    );
    if (applications.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Application not found" });
    }

    const application = applications[0].id;

    await connection.query(
      "update applications set status = 'accepted' where id = ?",
      [application],
    );
    await connection.query(
      "update applications set status = 'rejected' where id != ? and jod_id = ?",
      [application, jobId],
    );

    await connection.commit();
    return res.status(200).json({ message: "Talent hired successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred while hiring talent.",
      error,
    });
  } finally {
    connection.release();
  }
};

exports.getJobApplicantsForEmployer = async (req, res) => {
  const { jobId } = req.params;
  const employerId = req.user.id;
  try {
    const [applicants] = await db.query(
      "SELECT a.id AS applicationID , a.status , a.cover_letter , a.applied_at , u.name , u.email from applications a JOIN users u ON a.talent_id = u.id JOIN jobs j ON a.jod_id = j.id WHERE a.jod_id = ? AND j.employer_id = ? ORDER BY a.applied_at DESC",
      [jobId, employerId],
    );
    return res.status(200).json(applicants);
  } catch (error) {
    return res.status(500).json({
      message: "An unexpected error occurred while retrieving applicants.",
      error,
    });
  }
};
