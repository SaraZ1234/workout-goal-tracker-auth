import userModel from "../model/userModel.js"

import userrModel from "../model/userProfile.js";  // same model with all fields

import path from 'path';
import rootDir from '../utils/pathUtil.js';


import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

export const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ message: "Please fill out all required fields" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.TOKEN_SECRET, { expiresIn: "1d" });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ message: "Signup successful", success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Please fill out all fields" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ success: false, message: "Password is incorrect" });
    }

    // Create JWT
    const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    // Send success + redirect
    const redirect = user.role === 1
      ? "/api/admin/dashboard"  // admin route
      : "/api/user/dashboard";      // regular user route

    return res.json({
      success: true,
      message: "Login successful",
      role: user.role,
      redirect
    });

  } catch (error) {
    console.log("Login error:", error);
    return res.json({ success: false, message: "Login failed" });
  }
};




export const Logout = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation: check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and password are required to logout" 
      });
    }

    // Optional: You can also verify if the email and password match a user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    // Clear cookie
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updates = req.body; // expect age, weight, height, fitnessLevel, etc.

    const user = await userModel.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Profile updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.body;  // Extract 'id' from request body

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile deleted successfully', user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



// Get profile info (excluding sensitive fields like password)
export const getProfileInfo = async (req, res) => {
  try {
    const profile = await userrModel.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const updateProfileInfo = async (req, res) => {
  try {
    const { age, weight, height, fitnessLevel } = req.body;

    const updates = { age, weight, height, fitnessLevel };

    // Update by userId, not _id
    const profile = await userrModel.findOneAndUpdate(
      { userId: req.user.id },
      updates,
      { new: true, upsert: true } // create if not exists
    ).select('age weight height fitnessLevel');

    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    res.json({ message: 'Profile info updated', profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteProfileInfo = async (req, res) => {
  try {
    const deletedProfile = await userrModel.findOneAndDelete({ userId: req.user.id });
    if (!deletedProfile) return res.status(404).json({ message: 'Profile not found' });
    res.json({ message: 'Profile deleted successfully', profile: deletedProfile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const firstPage = async (req, res) => {
  console.log("The First Page is imported");

  res.sendFile(path.join(rootDir, 'views', 'index.html'));
}

// GET /login → show the login page
export const loginPage = (req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'login.html'));
};

export const Logoutpage = (req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'logout.html'));

}

export const Community = (req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'community.html'));

}

export const signup = (req, res) => {
  res.sendFile(path.join(rootDir, 'views', 'signup.html'));
  
}