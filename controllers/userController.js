import asyncHandler from "express-async-handler";
import User from "../models/userSchema.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmial.js";
import passportUser from "../config/passportUser.js";
import passport from "passport";
const loginUser = asyncHandler(async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    try {
      if (err) {
        console.error("Error during authentication:", err);
        return next(err);
      }

      if (!user) {
        console.warn("Invalid email or password");
        return res.status(401).json({ message: "Invalid email or password" });
      }

      req.login(user, async (err) => {
        if (err) {
          console.error("Error during login:", err);
          return next(err);
        }

        // Generate token and send response

        generateToken(user._id, res);
        return res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          message: "Logged in successfully",
        });
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      return next(err);
    }
  })(req, res, next);
});

// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({ name, email, password });

    // Generate token and send response
    generateToken(newUser._id, res);
    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      message: "User registered successfully",
    });
  } catch (err) {
    return res.status(400).json({ message: "Invalid user data" });
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User Not Found");
  }

  const resetToken = user.createPasswordResetToken();
  user.save();

  const resetUrl = `${req.protocol}://localhost:5173/reset-password/${resetToken}`;

  const message = `Forgot Password? Click on this this link to reset your Password: ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password reset token. (valid for 10mins)",
      message,
    });

    res.status(200).json({
      message: "Token Sent to email!",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save();
    console.log(error);

    res.status(500).json({
      status: "error",
      message:
        "There was an error in sending the email. Please Try again later",
    });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400).json({
      status: "fail",
      message: "Token is invalid or has expired",
    });
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.save();

  generateToken(user._id, res);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("auth_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie("connect.sid", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    message: "Logged Out Successfully",
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});

export {
  loginUser,
  registerUser,
  logoutUser,
  getUsers,
  forgotPassword,
  resetPassword,
};
