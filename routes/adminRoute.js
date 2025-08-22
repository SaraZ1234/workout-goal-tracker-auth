import { Router } from 'express';
import userModel from '../model/userModel.js';
import userProfileModel from '../model/userProfile.js'; // make sure this is imported
import authMiddleware from '../middlewares/authmiddleware.js';
import adminMiddleware from '../middlewares/adminmiddleware.js';

import { AdminPage} from "../controller/adminController.js";

const router = Router();

// GET all users (API)
router.get('/all-users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
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

    res.json(usersWithProfilesAndWorkouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a user (admin)
router.delete('/user/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "User ID is required" });

    const user = await userModel.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete user's profile too
    await userProfileModel.findOneAndDelete({ userId: id });

    res.json({ message: "User deleted successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// GET admin dashboard (render EJS)
router.get('/dashboard', authMiddleware, adminMiddleware, AdminPage);

router.put("/update/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const updateData = { name, email, role };

    if (password && password.trim() !== "") {
      const bcrypt = await import("bcryptjs");
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
});


export default router;
