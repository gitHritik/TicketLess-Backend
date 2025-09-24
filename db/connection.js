import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const DB = process.env.DATABASE;

let isConnected = false;



const connections = async () => {
  if (isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    await mongoose.connect(DB);
    isConnected = true;
    console.log("Database connected");
  } catch (error) {
    console.log("Error connecting to database:", error);
  }
};


export default connections;
