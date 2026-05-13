const router = require("express").Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createPortfolio,
  getAllPortfolios,
  getSinglePortfolio,
  updatePortfolio,
  deletePortfolio,
} = require("../controllers/portfolioController");


// CREATE
router.post("/", authMiddleware, createPortfolio);


// GET ALL
router.get("/", authMiddleware, getAllPortfolios);


// GET SINGLE
router.get("/:id", authMiddleware, getSinglePortfolio);


// UPDATE
router.put("/:id", authMiddleware, updatePortfolio);


// DELETE
router.delete("/:id", authMiddleware, deletePortfolio);


module.exports = router;