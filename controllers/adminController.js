const {User} = require("../models");


// ADMIN DASHBOARD
exports.dashboard = async (req, res) => {
  try {

    const totalUsers = await User.count();

    const totalAdmins = await User.count({
      where: {
        role: "admin",
      },
    });

    res.status(200).json({
      success: true,
      totalUsers,
      totalAdmins,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {

    const users = await User.findAll({
      attributes: {
        exclude: ["password"],
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      users,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};