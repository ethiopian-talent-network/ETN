require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { User, Talent, Employer } = require("./srs/models/User");
const Job = require("./srs/models/Job");

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for Seeding...");

    // Create a hashed password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("password123", salt);

    // 1. Create Mock Employer
    let employer = await Employer.findOne({ email: "employer@etn.com" });
    if (!employer) {
      employer = await Employer.create({
        email: "employer@etn.com",
        passwordHash,
        companyName: "Commercial Bank of Ethiopia",
        taxId: "CBE-987654",
        industry: "Finance"
      });
      console.log("Created Mock Employer.");
    }

    // 2. Create Mock Talent
    let talent = await Talent.findOne({ email: "talent@etn.com" });
    if (!talent) {
      talent = await Talent.create({
        email: "talent@etn.com",
        passwordHash,
        fullName: "Abebe Bikila",
        skills: ["React", "Node.js", "MongoDB", "Express", "TailwindCSS"],
        portfolioUrl: "https://abebe.dev",
        age: 26,
        experience: 4,
        bio: "Passionate Fullstack Engineer focused on building scalable MERN web applications.",
        tokenBalance: 450
      });
      console.log("Created Mock Talent.");
    }

    // 3. Create Mock Jobs
    const jobCount = await Job.countDocuments();
    if (jobCount === 0) {
      await Job.insertMany([
        {
          employerId: employer._id,
          title: "Senior React Developer",
          description: "We are looking for an experienced React developer to lead our frontend architecture. Must have deep understanding of React Hooks and context API.",
          skillsRequired: ["React", "JavaScript", "TailwindCSS"],
          budget: 2500,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        {
          employerId: employer._id,
          title: "Backend Node Engineer",
          description: "Looking for an expert Node.js engineer to scale our financial systems. Heavy emphasis on secure API development and MongoDB performance.",
          skillsRequired: ["Node.js", "Express", "MongoDB", "REST APIs"],
          budget: 3200,
          deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        },
        {
          employerId: employer._id,
          title: "UI/UX Product Designer",
          description: "Design the next generation of banking apps for the Ethiopian market. Needs strong Figma skills and understanding of mobile-first design.",
          skillsRequired: ["Figma", "UI/UX", "Mobile Design"],
          budget: 2000,
          deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
        }
      ]);
      console.log("Created Mock Jobs.");
    }

    console.log("Database Seeding Completed Successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed: ", error);
    process.exit(1);
  }
};

seedDatabase();
