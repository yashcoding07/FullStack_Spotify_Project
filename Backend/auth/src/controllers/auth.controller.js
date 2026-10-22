import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import _config from "../config/config.js";
import { publishToQueue } from "../broker/rabbit.js";

export async function register(req, res) {
  const {
    email,
    password,
    fullName: { firstName, lastName },
  } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email });

  if (isUserAlreadyExists) {
    return res.status(400).json({ message: "User already exists." });
  }

  const hash = await bcryptjs.hash(password, 10);

  const user = await userModel.create({
    email,
    password: hash,
    fullName: {
      firstName,
      lastName,
    },
  });

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    _config.JWT_SECRET,
    { expiresIn: "2d" },
  );

  await publishToQueue("user_created", {
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  });

  res.cookie("token", token);

  res.status(201).json({
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  });
}

export async function googleAuthCallback(req, res) {
  const user = req.user;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email: user.emails[0].value }, { googleId: user.id }],
  });

  if (isUserAlreadyExists) {
    const token = jwt.sign(
      {
        id: isUserAlreadyExists._id,
        role: isUserAlreadyExists.role,
      },
      _config.JWT_SECRET,
      { expiresIn: "2d" },
    );

    res.cookie("token", token);

    return res.redirect("http://localhost:5173");
  }

  const newUser = await userModel.create({
    googleId: user.id,
    email: user.emails[0].value,
    fullName: {
      firstName: user.name.givenName,
      lastName: user.name.familyName,
    },
  });

  const token = jwt.sign(
    {
      id: newUser._id,
      role: newUser.role,
    },
    _config.JWT_SECRET,
    { expiresIn: "2d" },
  );

  await publishToQueue("user_created", {
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  });

  res.cookie("token", token);

  res.redirect("http://localhost:5173");
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json({ message: "Please register first. User not found." });
  }

  const isPasswordValid = bcryptjs.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Unauthorized: invalid password." });
  }

  return res
    .status(200)
    .json({
      message: "User Logged in Successfully",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
}
