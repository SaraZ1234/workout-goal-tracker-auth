import express from 'express';
import workoutModel from '../model/workoutModel.js';

const router = express.Router();

// Add new workout
router.post('/workouts', async (req, res) => {
  try {
    const { name, exercises, userId } = req.body;
    console.log("BODY RECEIVED:", req.body);


    if (!name || !exercises || !userId) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const workout = await workoutModel.create({ name, exercises, userId });
    res.status(201).json({ message: 'Workout added', workout });
    console.log("The Workout added is:", req.body);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Update workout
// PUT: Update workout by ID
router.put("/workouts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ update with new values, not replacing with old ones
    const updatedWorkout = await workoutModel.findByIdAndUpdate(
      id,
      { $set: req.body },   // make sure new values are set
      { new: true, runValidators: true }
    );

    if (!updatedWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    res.json(updatedWorkout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// Delete workout
router.delete('/workouts/:id', async (req, res) => {
  try {
    const workout = await workoutModel.findByIdAndDelete(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
