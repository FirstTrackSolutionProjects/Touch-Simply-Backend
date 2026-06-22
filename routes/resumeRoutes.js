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
  createResumeProjectWithTemplate,
  compileResume,
  getResume,
  getResumeFileUrl,
  getFileTreeHash,
} = require("../controllers/resumeController");


// CREATE
// router.post("/", authMiddleware, createResume);

router.post("/template/:templateId", authMiddleware, createResumeProjectWithTemplate);

router.patch('/:resumeId/compile', authMiddleware, compileResume);

router.get('/:resumeId/file', authMiddleware, getResumeFileUrl);

// GET USER RESUMES
router.get("/user", authMiddleware, getUserResumes);

// GET SINGLE
router.get('/:resumeId', authMiddleware, getResume)
// router.get("/:id", authMiddleware, getResumeById);

router.get('/:resumeId/hash', authMiddleware, getFileTreeHash)

// UPDATE
router.put("/:id", authMiddleware, updateResume);


// DELETE
router.delete("/:id", authMiddleware, deleteResume);


// GET ALL
router.get("/", authMiddleware, adminMiddleware, getAllResumes);

// ADD RESUME FILE URL
router.post("/:resumeId/file", authMiddleware, addResumeFileUrl);

// DELETE RESUME FILE
router.delete("/:resumeId/file", authMiddleware, deleteResumeFile);




module.exports = router;

