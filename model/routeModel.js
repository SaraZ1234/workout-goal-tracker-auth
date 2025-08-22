import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  name: String,       // e.g. "Morning Jog"
  type: String,       // e.g. "Running", "Cycling"
  startLat: Number,
  startLng: Number,
  endLat: Number,
  endLng: Number
});

export default mongoose.model("Route", routeSchema);
