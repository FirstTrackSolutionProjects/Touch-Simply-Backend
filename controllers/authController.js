const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


// REGISTER USER
exports.register = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      phone,
    } = req.body;


    // CHECK USER EXISTS
    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }


    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );


    // CREATE USER
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });


    // GENERATE TOKEN
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );


    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      token,
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};




// LOGIN USER
exports.login = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;


    // FIND USER
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }


    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }


    // GENERATE TOKEN
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );


    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

