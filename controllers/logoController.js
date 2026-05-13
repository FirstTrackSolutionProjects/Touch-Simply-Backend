const Logo = require("../models/Logo");


// CREATE LOGO
exports.createLogo = async (req, res) => {
  try {

    const {
      title,
      image,
      template,
    } = req.body;

    const logo = await Logo.create({
      title,
      image,
      template,
      UserId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Logo Created Successfully",
      logo,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// GET ALL LOGOS
exports.getAllLogos = async (req, res) => {
  try {

    const logos = await Logo.findAll({
      where: {
        UserId: req.user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      logos,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// GET SINGLE LOGO
exports.getSingleLogo = async (req, res) => {
  try {

    const logo = await Logo.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
    });

    if (!logo) {
      return res.status(404).json({
        success: false,
        message: "Logo Not Found",
      });
    }

    res.status(200).json({
      success: true,
      logo,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// UPDATE LOGO
exports.updateLogo = async (req, res) => {
  try {

    const logo = await Logo.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
    });

    if (!logo) {
      return res.status(404).json({
        success: false,
        message: "Logo Not Found",
      });
    }

    await logo.update(req.body);

    res.status(200).json({
      success: true,
      message: "Logo Updated Successfully",
      logo,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// DELETE LOGO
exports.deleteLogo = async (req, res) => {
  try {

    const logo = await Logo.findOne({
      where: {
        id: req.params.id,
        UserId: req.user.id,
      },
    });

    if (!logo) {
      return res.status(404).json({
        success: false,
        message: "Logo Not Found",
      });
    }

    await logo.destroy();

    res.status(200).json({
      success: true,
      message: "Logo Deleted Successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};