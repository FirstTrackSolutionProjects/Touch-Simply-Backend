const express = require("express");
const router = express.Router();

const {
  register,
  login,
  googleLogin,  // ← Added Google Login
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/google-login", googleLogin);  // ← Added Google route

module.exports = router;