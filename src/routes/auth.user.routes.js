import express from "express";
import {
  checkAuth,
  login,
  logout,
  signUp,
  updateProfile,
} from "../controller/User.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

export const routesAuth = express.Router();

routesAuth.post("/signUp", signUp);
routesAuth.post("/login", login);
routesAuth.post("/logout", logout);

routesAuth.put("/update-profile", protectRoute, updateProfile);

routesAuth.get("/check", protectRoute, checkAuth);
