import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { generatedToken } from "../utils/utils.js";
import cloudinary from "../lib/cloudnary.js";

export const signUp = async (req, res) => {
  const { email, fullname, password, profilePic } = req.body;
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must greatest 6 characters" });
    }

    const userExit = await User.findOne({ email });

    if (userExit) {
      return res.status(400).json({
        message: "user already exist",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      fullname,
      password: hashPassword,
      profilePic,
    });

    if (user) {
      generatedToken(user._id, res);
      await user.save();
      res.status(201).json({
        message: "user create succefully",
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        password: user.password,
        profilePic: user.profilePic,
      });
      console.log("user create succesfully", user);
    } else {
      res.status(400).json({ message: "invalid user data" });
    }
  } catch (error) {
    res.status(500).json({
      message: "ERROR TO CREATE USER",
      error: error,
    });
    console.log("ERROR", error.message);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        message: "user not exist OR Invalid credential",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userExist.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credential",
      });
    }

    generatedToken(userExist.id, res);

    res.status(201).json({
      _id: userExist._id,
      email: userExist.email,
      fullname: userExist.fullname,
      profilePic: userExist.profilePic,
    });
    console.log("connected successfully", userExist);
  } catch (error) {
    res.status(500).json({ message: "ERROR DATA" });
    console.log("ERROR", error.message);
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout successfully..." });
  } catch (error) {
    console.log("error to logout", error.message);
    res.status(500).json({ message: "internal error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error to checkAuth controller", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "ProfilePic is require" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );


    res.status(200).json(updateUser);
  } catch (error) {
    console.log("error in update profile", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

