// ------------------------------
// Import des modules nécessaires
// ------------------------------
const express = require("express");
const app = express();
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
const env = require("dotenv").config();
const UserRouter = require("./routes/User");
const SauceRouter = require("./routes/sauces");
const path = require("path");

// -----------------------
// Initialisation de l'API
// -----------------------
app.use(cors());
app.use(express.json());
app.use(helmet({ crossOriginResourcePolicy: false }));

// ------------------
// START SERVER + DB
// ------------------
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`MongoDB > connection successful !`))
  .catch(() => {
    console.log(`Server connection failed !`);
    process.exit(1);
  });

app.use("/api/auth", UserRouter);
app.use("/api/sauces", SauceRouter);
app.use("/images", express.static(path.join(__dirname, "images")));
module.exports = app;
