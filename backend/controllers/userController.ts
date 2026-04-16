import User from "../models/user";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { requireEnv } from "../config/env";

// User Routes
const userSignup = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, username, password: hashedPassword });
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup failed:", error);
    res.status(500).json({ error: "Database connection error" });
  }
};

const userSignin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User does not exist!" });
    }

    const passwordValidates = await bcrypt.compare(
      password,
      user.password as string
    );

    if (passwordValidates) {
      try {
        const token = jwt.sign({ email }, requireEnv("JWT_SECRET"));
        res.status(200).json({ token });
      } catch (error) {
        console.error("JWT setup error:", error);
        return res.status(500).json({ error: "Server configuration error" });
      }
    } else {
      return res.status(401).json({ error: "Wrong email or password" });
    }
  } catch (error) {
    console.error("Signin failed:", error);
    res.status(500).json({ error: "Database connection error" });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    if (req.body.email) {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(200)
          .json({ email: req.body.email, username: user.username });
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    }
    return res.status(401).json({ error: "Unauthorized" });
  } catch (error) {
    console.error("Get user failed:", error);
    if (error instanceof Error && error.message.startsWith("Missing required environment variable")) {
      return res.status(500).json({ error: "Server configuration error" });
    }

    return res.status(500).json({ error: "Database connection error" });
  }
};

export { userSignup, userSignin, getUser };
