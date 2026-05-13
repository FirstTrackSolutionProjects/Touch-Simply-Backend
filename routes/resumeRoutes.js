// const router = require("express").Router();

// const authMiddleware = require("../middleware/authMiddleware");

// const {
//   createResume,
//   getAllResumes,
//   getSingleResume,
//   updateResume,
//   deleteResume,
// } = require("../controllers/resumeController");


// // CREATE
// router.post("/", authMiddleware, createResume);


// // GET ALL
// router.get("/", authMiddleware, getAllResumes);


// // GET SINGLE
// router.get("/:id", authMiddleware, getSingleResume);


// // UPDATE
// router.put("/:id", authMiddleware, updateResume);


// // DELETE
// router.delete("/:id", authMiddleware, deleteResume);


// module.exports = router;

const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");

router.post(
  "/create",
  authMiddleware,
  createResume
);

router.get(
  "/user",
  authMiddleware,
  getUserResumes
);

router.get(
  "/:id",
  authMiddleware,
  getResumeById
);

router.put(
  "/:id",
  authMiddleware,
  updateResume
);

router.delete(
  "/:id",
  authMiddleware,
  deleteResume
);

module.exports = router;