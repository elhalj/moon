import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    // Ajoutez un log pour vérifier que req.user._id est défini
    // console.log("Authenticated user ID:", req.user._id);
    next();
  } catch (error) {
    console.log("Error in protect route middleware", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
