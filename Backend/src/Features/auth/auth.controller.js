import User from "../users/user.model.js";
import { generateToken } from "../../utils/generateToken.js";
import { jwtVerify } from "jose";
import { JWT_SECRET } from "../../utils/getJWTSecret.js";

// Register
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Check if user already exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password, role: role || "Viewer" });
    const payload = { userId: user._id.toString(), role: user.role };

    // Generate tokens
    const accessToken = await generateToken(payload, "15m");
    const refreshToken = await generateToken(payload, "7d");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered",
      accessToken,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { userId: user._id.toString(), role: user.role };
    const accessToken = await generateToken(payload, "15m");
    const refreshToken = await generateToken(payload, "7d");

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      accessToken,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const accessToken = await generateToken(
      { userId: payload.userId, role: payload.role },
      "15m"
    );

    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// Logout
export const logoutUser = (req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, sameSite: "strict" });
  res.json({ message: "Logged out" });
};
