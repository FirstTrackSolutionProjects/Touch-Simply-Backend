const router = require("express").Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  register,
  login,
  googleLogin,
} = require("../controllers/authController");


// REGISTER
router.post("/register", register);


// LOGIN
router.post("/login", login);

// GOOGLE LOGIN
router.post("/google-login", googleLogin);

module.exports = router;