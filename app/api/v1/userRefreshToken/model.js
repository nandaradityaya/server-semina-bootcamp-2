const mongoose = require("mongoose");

const userRefreshTokenSchema = new mongoose.Schema(
  {
    refreshToken: {
      type: String,
    },
    // double cek di sini, apakah bener user tersebut yang login
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserRefreshToken", userRefreshTokenSchema);
