import express from "express";
import Stripe from "stripe";
import authenticateJWT from "../utils/authenticateJWT.js";

const router = express.Router();
const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY
);

router.post("/create-checkout-session", authenticateJWT, async (req, res) => {
  try {
    const { products, userId, metadata, customer } = req.body;

    // Create a customer in Stripe
    const stripeCustomer = await stripe.customers.create({
      name: customer.name,
      address: {
        line1: "123 MG Road",
        postal_code: "110001",
        city: "New Delhi", //
        state: "Delhi", //
        country: "IN", //
      },
    });

    const adultQuantity = parseInt(products.tickets.adult);
    const reducedQuantity = parseInt(products.tickets.reduced);
    const totalQuantity = adultQuantity + reducedQuantity;

    const lineItems = [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Tickets",
            description: `Date: ${products.date}, Time: ${products.time}`,
            images: [products.images],
          },
          unit_amount: products.price * 100,
        },
        quantity: totalQuantity,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer: stripeCustomer.id, // Attach the customer to the session
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
      metadata,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ message: "Error creating checkout session" });
  }
});

export default router;
