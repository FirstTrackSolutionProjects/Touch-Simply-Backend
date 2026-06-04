// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const User = require("../models/User");
// const { OAuth2Client } = require("google-auth-library");

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


// // REGISTER USER
// exports.register = async (req, res) => {
//   try {

//     const {
//       name,
//       email,
//       password,
//       phone,
//     } = req.body;


//     // CHECK USER EXISTS
//     const existingUser = await User.findOne({
//       where: { email },
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User Already Exists",
//       });
//     }


//     // HASH PASSWORD
//     const hashedPassword = await bcrypt.hash(
//       password,
//       10
//     );


//     // CREATE USER
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       phone,
//     });


//     // GENERATE TOKEN
//     const token = jwt.sign(
//       { id: user.id },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d",
//       }
//     );


//     res.status(201).json({
//       success: true,
//       message: "User Registered Successfully",
//       token,
//       user,
//     });

//   } catch (error) {

//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };




// // LOGIN USER
// exports.login = async (req, res) => {
//   try {

//     const {
//       email,
//       password,
//     } = req.body;


//     // FIND USER
//     const user = await User.findOne({
//       where: { email },
//     });

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User Not Found",
//       });
//     }


//     // CHECK PASSWORD
//     const isMatch = await bcrypt.compare(
//       password,
//       user.password
//     );

//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Password",
//       });
//     }


//     // GENERATE TOKEN
//     const token = jwt.sign(
//       { id: user.id },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d",
//       }
//     );


//     res.status(200).json({
//       success: true,
//       message: "Login Successful",
//       token,
//       user,
//     });

//   } catch (error) {

//     console.log(error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

// // GOOGLE LOGIN
// exports.googleLogin = async (req, res) => {
//   try {
//     const { tokenId } = req.body;

//     const ticket = await client.verifyIdToken({
//       idToken: tokenId,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const { name, email } = ticket.getPayload();

//     let user = await User.findOne({ where: { email } });

//     if (!user) {
//       user = await User.create({
//         name,
//         email,
//         password: null, // Password is null for Google users
//       });
//     }

//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.status(200).json({
//       success: true,
//       message: "Google Login Successful",
//       token,
//       user,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Google Login Failed",
//     });
//   }
// };

const bcrypt = require("bcryptjs");

const { User } = require("../models");

const generateToken = require("../services/jwtService");


// REGISTER
exports.register = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      phone,

    } = req.body;

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // BLOCK CHECK
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      
      },
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};