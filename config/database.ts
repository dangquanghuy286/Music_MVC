import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected to Database ");
  } catch (error) {
    console.error("Error connecting to Database:", error);
  }
};
