import { Router } from "express";

import { registerValidator, loginValidator } from '../helpers/validation.js';


import { Signup, Login, getProfile, updateProfile, deleteProfile, getProfileInfo, updateProfileInfo, Logout, firstPage, loginPage, Community, signup, Logoutpage} from "../controller/userController.js";

import authMiddleware from '../middlewares/authmiddleware.js';

import workoutModel from '../model/workoutModel.js';  // import your workout model
import router from "./adminRoute.js";


const route = Router();

// User routes
route.post("/signup", Signup);
route.post("/login", Login);
route.post("/logout", Logout);

route.get("/profile", authMiddleware, getProfile);
route.put('/profile', authMiddleware, updateProfile);
route.delete('/profile', authMiddleware, deleteProfile);

// Profile info routes
route.get('/info', authMiddleware, getProfileInfo);
route.put('/info', authMiddleware, updateProfileInfo);

// CREATE workout (token required + no duplicate names)
route.post('/workouts', authMiddleware, async (req, res) => {
  try {
    const { name, exercises } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Workout name is required' });
    }

    // Check if workout with same name already exists for this user
    const existingWorkout = await workoutModel.findOne({
      userId: req.user.id,
      name: name.trim()
    });

    if (existingWorkout) {
      return res.status(400).json({ message: 'Workout with this name already exists' });
    }

    const newWorkout = new workoutModel({
      userId: req.user.id,
      name: name.trim(),
      exercises
    });

    const savedWorkout = await newWorkout.save();
    res.status(201).json({ message: 'Workout added', workout: savedWorkout });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ all workouts for logged-in user
route.get('/workouts', authMiddleware, async (req, res) => {
  try {
    const workouts = await workoutModel.find({ userId: req.user.id });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE workout by id (only if belongs to logged-in user)
route.put('/workouts/:id', authMiddleware, async (req, res) => {
  try {
    const workoutId = req.params.id;
    const updates = req.body;

    const updatedWorkout = await workoutModel.findOneAndUpdate(
      { _id: workoutId, userId: req.user.id },
      updates,
      { new: true }

    );
    console.log("req.user:", req.user);


    if (!updatedWorkout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json({ message: 'Workout updated', workout: updatedWorkout });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE workout by id (only if belongs to logged-in user)
route.delete('/workouts/:id', authMiddleware, async (req, res) => {
  try {
    const workoutId = req.params.id;

    const deletedWorkout = await workoutModel.findOneAndDelete({
      _id: workoutId,
      userId: req.user.id
    });

    if (!deletedWorkout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json({ message: 'Workout deleted', workout: deletedWorkout });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// app.get("/user_dashboard.html", (req, res) => {
//   if (!req.session.role) return res.redirect("/login.html");
//   res.sendFile(path.join(__dirname, "public/user_dashboard.html"));
// });


//First page route
route.get('/', firstPage);
route.get('/login', loginPage); // shows login page
route.post('/login', Login);         // login POST

route.get('/logout', Logoutpage);

route.get('/community', Community)

route.get('/signup', signup);
route.post('/signup', Signup)


import { userDashboardPage, addWorkout } from '../controller/workoutController.js';
import { verifyToken } from '../middlewares/authmiddleware.js'; // middleware to check JWT


// GET user dashboard page
route.get('/dashboard', verifyToken, userDashboardPage);

// POST new workout
route.post('/dashboard/workouts', verifyToken, addWorkout);


route.get("/dashboard", verifyToken, (req, res) => {
  res.sendFile(path.join(rootDir, "views", "user_dashboard.html"));
});


// userRoute.js
route.get('/user/dashboard', verifyToken, (req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'user_dashboard.html'));
});

// adminRoute.js
route.get('/admin/dashboard', verifyToken, (req, res) => {
  // res.sendFile(path.join(rootDir, 'views', 'admin_dashboard.html'));
  res.render('admin_dashboard');
});


export default route;
