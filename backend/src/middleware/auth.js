import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return res.status(401).json({
        success: false,
        message: "Not authorized - No token provided.",
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded)
      return res.status(401).json({
        success: false,
        message: "Not authorized - Invalid token.",
      });

    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in auth middleware: ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
