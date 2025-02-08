const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format."],
    },
    dob: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const today = new Date();
          return value <= today; // Ensure DOB is not in the future
        },
        message: "Date of birth cannot be in the future.",
      },
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String, //cloudinary Url
    },
    firstNameChanged: {
      type: Boolean,
      default: false,
    },
    lastNameChanged: {
      type: Boolean,
      default: false,
    },
    emailChanged: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//For password verification
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
