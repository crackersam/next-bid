import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [
      6,
      "Password must be at least 6 characters",
    ],
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  verifyTokenExpires: {
    type: Date,
  },
  avatar: {
    type: Buffer,
  },
});
userSchema.virtual("bids", {
  ref: "Bid",
  localField: "_id",
  foreignField: "bidder",
});

const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);

export default User;
