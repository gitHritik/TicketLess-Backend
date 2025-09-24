import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import passportUtil from "./utils/passport.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import unleaseRoutes from "./routes/unleaseRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import bookRoutes from "./routes/bookingRoutes.js";
import passportUser from "./config/passportUser.js";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import { connectDB } from "./db/connection.js"; // renamed

dotenv.config();
const app = express();

// Middleware
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  cors({
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
    methods: "GET, POST, PATCH, DELETE, PUT",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

passportUser();
app.use(passport.initialize());
app.use(passport.session());

await connectDB(); // Connect DB once

passportUtil(app);

app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/images", unleaseRoutes);
app.use("/api", paymentRoutes);
app.use("/api", bookRoutes);

// Export for Vercel serverless
export default app;
