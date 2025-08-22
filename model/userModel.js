import mongoose from "mongoose";
import { type } from "os";

//creating schema here
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role : {
  type : Number,
  default : 0 , //0 -> Normal, 1 -> Admin
  }
}, { timestamps: true })

//telling MongoDB that we are putting all these entries for user through Model
export default mongoose.model("user", userSchema);