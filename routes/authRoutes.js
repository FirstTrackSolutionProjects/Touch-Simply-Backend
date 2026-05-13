const router = require("express").Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  register,
  login,
} = require("../controllers/authController");


// REGISTER
router.post("/register", register);


// LOGIN
router.post("/login", login);

module.exports = router;