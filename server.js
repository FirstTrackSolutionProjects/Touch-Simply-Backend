require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");


const { sequelize }  = require("./models/index.js");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const logoRoutes = require("./routes/logoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/logo", logoRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const startServer = async () => {
  try {

    // Create Database if it doesn't exist

    // const connection =
    //   await mysql.createConnection({
    //     host: process.env.DB_HOST,
    //     user: process.env.DB_USER,
    //     password: process.env.DB_PASSWORD,
    //     port: process.env.DB_PORT,
    //   });

    // await connection.query(
    //   `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
    // );

    // await connection.end();

    // console.log(
    //   `Database verified: ${process.env.DB_NAME}`
    // );


    // Database Connection

    await sequelize.authenticate();

    console.log(
      "Database connected ✅"
    );

    // await sequelize.sync({ alter: true });
    // console.log("Database synced");


    app.listen(process.env.PORT, () => {
      console.log(
        `Server running on port ${process.env.PORT}`
      );
    });

  } catch (err) {

    console.error(
      "Unable to start the server:",
      err
    );

    process.exit(1);
  }
};

startServer();