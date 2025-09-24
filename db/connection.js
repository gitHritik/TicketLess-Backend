// db/connection.js
import mongoose from "mongoose";

let isConnected = false; // track connection across serverless invocations

export const connectDB = async () => {
    if (isConnected) {
        console.log("Already connected to database");
        return;
    }

    if (!process.env.DATABASE) {
        throw new Error("DATABASE environment variable not set");
    }

    try {
        await mongoose.connect(process.env.DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log("Database connected");
    } catch (err) {
        console.error("Error connecting to database:", err);
        throw err;
    }
};
