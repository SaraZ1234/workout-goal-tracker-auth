import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },          // workout name, e.g. "Chest Day"
  exercises: [{                                    // array of exercises in the workout
    name: String,
    reps: Number,
    sets: Number,
    weight: Number,
    goals: [{ type: String, required: true }],       // workout goals (multiple allowed)

  }],
  createdAt: { type: Date, default: Date.now }
});

const workoutModel = mongoose.model('Workout', workoutSchema);

export default workoutModel;
