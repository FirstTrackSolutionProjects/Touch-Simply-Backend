const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  dashboard,
  getUsers,
} = require("../controllers/adminController");

// ADMIN DASHBOARD
router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  dashboard
);

// GET ALL USERS
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getUsers
);

module.exports = router;