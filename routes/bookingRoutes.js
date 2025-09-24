import express from "express";
import {
  bookTickets,
  bookedTickets,
  cancelTickets,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/booking", bookTickets);
router.get("/booking/:userId", bookedTickets);
router.patch("/:bookingId", cancelTickets);

export default router;
