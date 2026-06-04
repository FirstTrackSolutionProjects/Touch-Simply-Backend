const router = require("express").Router();

const authMiddleware = require("../middleware/authMiddleware");

const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createResume,
  getUserResumes,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");


// CREATE
router.post("/", authMiddleware, createResume);

// GET USER RESUMES
router.get("/user", authMiddleware, getUserResumes);

// GET SINGLE
router.get("/:id", authMiddleware, getResumeById);

// UPDATE
router.put("/:id", authMiddleware, updateResume);


// DELETE
router.delete("/:id", authMiddleware, deleteResume);


// GET ALL
router.get("/", authMiddleware, adminMiddleware, getAllResumes);


module.exports = router;

