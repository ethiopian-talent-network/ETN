const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/auth", require("./routes/authRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/employer", require("./routes/employerRoutes"));
app.use("/talents", require("./routes/talentRoutes"));
app.use("/chat", require("./routes/openaiRoute"));


app.listen(5000, () => {
  console.log("Server is running on port http://localhost:5000");
});
