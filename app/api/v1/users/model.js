const mongoose = require("mongoose");
const { model, Schema } = mongoose;
// const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs"); // librabry utk nge-hash password

let userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Nama harus diisi"],
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email harus diisi"],
    },
    password: {
      type: String,
      required: [true, "Password harus diisi"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "organizer", "owner"],
      default: "admin",
    },
    organizer: {
      type: mongoose.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },
  },
  { timestamps: true } // tiap kali ngecreate bakal ada waktunya ky create at
);

// .pre ini hooksnya mongoose, jadi sebelum semuanya di save dia Modified password dlu
userSchema.pre("save", async function (next) {
  const User = this;
  if (User.isModified("password")) {
    User.password = await bcrypt.hash(User.password, 12);
  }
  next();
});

// method comparePassword ini buat ngecek passwordnya sama atau ngga sama
userSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password); // compare passwordnya di sini, cek sama atau ngga dengan database
  return isMatch;
};

module.exports = model("User", userSchema);
