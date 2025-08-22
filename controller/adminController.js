import userModel from "../model/userModel.js";
import userProfileModel from "../model/userProfile.js";  

// Admin dashboard
export const AdminPage = async (req, res) => {
  try {
    const user = req.user; // logged-in admin

    const usersWithProfilesAndWorkouts = await userModel.aggregate([
      {
        $lookup: {
          from: 'userprofiles',
          localField: '_id',
          foreignField: 'userId',
          as: 'profile'
        }
      },
      { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'workouts',
          localField: '_id',
          foreignField: 'userId',
          as: 'workouts'
        }
      },
      { $project: { password: 0, '__v': 0, 'profile.__v': 0, 'workouts.__v': 0 } }
    ]);

    res.render('admin_dashboard', { user, users: usersWithProfilesAndWorkouts });
  } catch (error) {
    console.error("AdminPage error:", error);
    res.status(500).send("Error loading admin dashboard");
  }
};

import workoutModel from "../model/workoutModel.js";

