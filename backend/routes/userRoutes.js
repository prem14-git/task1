import express from "express";
import User from "../models/User.js";
import ClaimHistory from "../models/ClaimHistory.js";

const router = express.Router();

// GET all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

// POST add new user
router.post("/users", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Name is required" });

    const newUser = new User({ name: name.trim() });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: "Error adding user", error: err.message });
  }
});

// POST claim points
router.post("/claim", async (req, res) => {
  try {
    const { userId } = req.body;
    const points = Math.floor(Math.random() * 10) + 1;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.totalPoints += points;
    await user.save();

    const history = new ClaimHistory({ userId, pointsClaimed: points });
    await history.save();

    res.json({ user, points });
  } catch (err) {
    res.status(500).json({ message: "Error claiming points", error: err.message });
  }
});

// GET leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find().sort({ totalPoints: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching leaderboard", error: err.message });
  }
});

// GET claim history
router.get("/history", async (req, res) => {
  try {
    const history = await ClaimHistory.find()
      .populate("userId", "name")
      .sort({ claimedAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: "Error fetching history", error: err.message });
  }
});

export default router;