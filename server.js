require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const sequelize = require("./config/config");

const authRoutes = require("./routes/authRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const logoRoutes = require("./routes/logoRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/logo", logoRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});

sequelize.sync({alter:true}).then(() => {
    console.log("Database synced");
    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
})
    .catch((err) => console.error(err));
