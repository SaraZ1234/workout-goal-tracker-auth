import userModel from "../model/userModel.js";

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user || user.role !== 1) {  // Check if role is 1 (admin)
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export default adminMiddleware;
