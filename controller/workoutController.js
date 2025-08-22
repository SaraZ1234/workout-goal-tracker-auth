import path from 'path';
import rootDir from '../utils/pathUtil.js';
import workoutModel from '../model/workoutModel.js';

// Serve dashboard HTML page
export const userDashboardPage = (req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'user_dashboard.html'));
};

// Add new workout
export const addWorkout = async (req, res) => {
  try {
    const { name, exercises } = req.body;

    if (!name || !exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({ message: 'Please provide workout name and exercises' });
    }

    const newWorkout = new workoutModel({
      userId: req.user.id,
      name,
      exercises
    });

    await newWorkout.save();
    console.log("req.user:", req.user);

    res.json({ success: true, message: 'Workout added successfully', workout: newWorkout });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to add workout' });
  }
};
