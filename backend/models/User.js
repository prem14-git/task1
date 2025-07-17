import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  }
});

const User = mongoose.model("User", userSchema);
export default User;
