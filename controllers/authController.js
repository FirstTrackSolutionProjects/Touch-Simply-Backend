const bcrypt = require("bcryptjs");
const { User } = require("../models");
const generateToken = require("../services/jwtService");
const { OAuth2Client } = require("google-auth-library");
const { Op } = require("sequelize");

// Initialize Google OAuth Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "user",
      isBlocked: false,
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
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

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

    const isMatch = await bcrypt.compare(password, user.password);

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

// GOOGLE LOGIN
exports.googleLogin = async (req, res) => {
  try {
    // 1. Check if token is provided
    const { tokenId } = req.body;

    if (!tokenId) {
      return res.status(400).json({
        success: false,
        message: "Google token is required",
      });
    }

    // 2. Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // 3. Extract payload with all required fields
    const payload = ticket.getPayload();
    const {
      sub: googleId,
      email,
      name,
      picture,
      email_verified,
    } = payload;

    // 4. Verify email is confirmed by Google
    if (!email_verified) {
      return res.status(400).json({
        success: false,
        message: "Google email is not verified. Please verify your email with Google.",
      });
    }

    // 5. Check if user exists by email or googleId
    let user = await User.findOne({
      where: {
        [Op.and]: [{ email }, { googleId }],
      },
    });

    if (!user) {
      // 6. Create new user with Google data
      user = await User.create({
        name: name,
        email: email,
        googleId: googleId,
        provider: "google",
        password: null, // No password for Google users
        phone: null,
        role: "user",
        isBlocked: false,
        googlePicture: picture || null,
      });
    } else {
      // 7. Update existing user if needed
      const updates = {};

      // If user exists by email but doesn't have googleId, link the Google account
      if (!user.googleId) {
        updates.googleId = googleId;
        updates.provider = "google";
      }

      // Update name if empty or different (optional - only if you want to sync)
      if (!user.name || user.name === "User") {
        updates.name = name;
      }

      // Update profile picture if not set
      if (!user.googlePicture && picture) {
        updates.googlePicture = picture;
      }

      if (Object.keys(updates).length > 0) {
        await user.update(updates);
      }
    }

    // 8. Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked. Please contact support.",
      });
    }

    // 9. Generate JWT token
    const token = generateToken(user);

    // 10. Return success response
    res.status(200).json({
      success: true,
      message: "Google Login Successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        picture: user.googlePicture || picture || null,
      },
    });
  } catch (error) {
    console.error("Google Login Error:", error);

    // 11. Better error handling
    if (error.message && error.message.includes("Token")) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Google token",
      });
    }

    if (error.message && error.message.includes("audience")) {
      return res.status(401).json({
        success: false,
        message: "Invalid Google client ID configuration",
      });
    }

    res.status(500).json({
      success: false,
      message: "Google Login Failed. Please try again later.",
    });
  }
};