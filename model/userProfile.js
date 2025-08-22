import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"  // optional but good for population
  },
  age: { type: Number },
  weight: { type: Number },
  height: { type: Number },
  fitnessLevel: { type: String },
}, { timestamps: true });

export default mongoose.model("UserProfile", userProfileSchema);
