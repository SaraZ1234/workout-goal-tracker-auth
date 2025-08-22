import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js"; // import your user model

export default async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token; // ✅ Read token from cookie

    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token is invalid" });
      }

      // Fetch full user info from DB using decoded.id
      const user = await userModel.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user; // ✅ req.user now has full details
      next();
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token; // assuming token is stored in cookie
    if (!token) return res.status(401).send('Access Denied');

    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = { id: verified.id }; // attach user ID to request
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

