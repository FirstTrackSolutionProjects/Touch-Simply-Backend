const Portfolio = require("../models/Portfolio");


// CREATE PORTFOLIO
exports.createPortfolio = async (req, res) => {
  try {

    const {
      title,
      image,
      data,
      desc,
      template,
    } = req.body;

    const portfolio = await Portfolio.create({
      title,
      image,
      data,
      desc,
      template,
      UserId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Portfolio Created Successfully",
      portfolio,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// GET ALL PORTFOLIOS
exports.getAllPortfolios = async (req, res) => {
  try {

    const portfolios = await Portfolio.findAll({
      where: {
        UserId: req.user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      portfolios,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// GET SINGLE PORTFOLIO
exports.getSinglePortfolio = async (req, res) => {
  try {

    const portfolio = await Portfolio.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio Not Found",
      });
    }

    res.status(200).json({
      success: true,
      portfolio,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// UPDATE PORTFOLIO
exports.updatePortfolio = async (req, res) => {
  try {

    const portfolio = await Portfolio.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio Not Found",
      });
    }

    await portfolio.update(req.body);

    res.status(200).json({
      success: true,
      message: "Portfolio Updated Successfully",
      portfolio,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// DELETE PORTFOLIO
exports.deletePortfolio = async (req, res) => {
  try {

    const portfolio = await Portfolio.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio Not Found",
      });
    }

    await portfolio.destroy();

    res.status(200).json({
      success: true,
      message: "Portfolio Deleted Successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};