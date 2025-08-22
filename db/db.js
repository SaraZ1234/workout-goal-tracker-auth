import mongoose from "mongoose";

export const db = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database is connected");


  } catch (error) {
    console.log("The error that occured while connecting db is:", error);


  }
}

