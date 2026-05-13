const router = require("express").Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createLogo,
  getAllLogos,
  getSingleLogo,
  updateLogo,
  deleteLogo,
} = require("../controllers/logoController");


// CREATE
router.post("/", authMiddleware, createLogo);


// GET ALL
router.get("/", authMiddleware, getAllLogos);


// GET SINGLE
router.get("/:id", authMiddleware, getSingleLogo);


// UPDATE
router.put("/:id", authMiddleware, updateLogo);


// DELETE
router.delete("/:id", authMiddleware, deleteLogo);


module.exports = router;