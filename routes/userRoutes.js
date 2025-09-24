import express from "express";
import {
  forgotPassword,
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/").get(getUsers);
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/logout").get(logoutUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:resetToken").patch(resetPassword);

export default router;
