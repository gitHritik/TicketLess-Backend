import express from "express";
import passport from "passport";
import axios from "axios";
import User from "../models/userSchema.js";
import generateToken from "../utils/generateToken.js";
import dotenv from "dotenv";
import authenticateJWT from "../utils/authenticateJWT.js";

dotenv.config();

const router = express.Router();

// Authenticate the user using Google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: `${process.env.CLIENT_URL}/login/failed`,
  })
);

// Forward the request to Google's authentication server
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(403).json({ message: "Not Authorized User" });
};

// Register or login user to DB
router.get("/login/success", isAuthenticated, async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      return res.status(403).json({
        message: "Not Authorized User",
      });
    }

    // Check if user exists in the database
    let userExists = await User.findOne({ email: req.user.email });

    if (!userExists) {
      // If user does not exist, create a new user
      const newUser = new User({
        name: req.user.name,
        email: req.user.email,
        password: Date.now().toString(), // This should not be a random password, but for demonstration purposes
      });
      userExists = await newUser.save();
    }

    // Generate token and send response
    generateToken(userExists._id, res);

    res.status(200).json({
      user: { ...req.user },
      message: "Successfully logged in",
      _id: userExists._id,
    });
  } catch (error) {
    console.error("Error in login success route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login failed
router.get("/login/failed", (req, res) => {
  res.status(401);
  throw new Error("Login Failed");
});

router.get("/validate-token", authenticateJWT, (req, res) => {
  res.status(200).send({ userId: req.userId });
});

// Logout
router.get("/logout", (req, res) => {
  req.logout(); // Logout the user from Passport session

  // Clear the authentication token (if using tokens stored in cookies)
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  // Clear userInfo from local storage
  localStorage.removeItem("userInfo");

  res.redirect("/");
});

export default router;
