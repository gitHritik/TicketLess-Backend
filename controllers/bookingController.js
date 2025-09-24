import mongoose from "mongoose";
import bookingModel from "../models/bookingSchema.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const bookTickets = async (req, res, next) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const { userId, location, museumName, locationImage, date, time, tickets } =
      session.metadata;
    const booking = new bookingModel({
      userId,
      location,
      museumName,
      locationImage,
      date,
      Time: time,
      People: JSON.parse(tickets),
      Status: "confirmed",
    });

    const savedBooking = await booking.save();

    res
      .status(200)
      .json({ message: "Booking saved successfully", booking: savedBooking });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ message: "Error saving booking", error });
  }
};

export const bookedTickets = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const userBookings = await bookingModel.find({ userId });
    res.status(200).json(userBookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Error fetching user bookings", error });
  }
};

export const cancelTickets = async (req, res, next) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const booking = await bookingModel.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.Status = status;
    await booking.save();

    res
      .status(200)
      .json({ message: "Booking status updated successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking status", error });
  }
};
