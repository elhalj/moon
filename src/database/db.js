import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`connect to ${connect.connection.host}`);
  } catch (error) {
    console.log("connection error", error.message);
    process.exit(10);
  }
};
