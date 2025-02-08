const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const userModel = require("../models/user.model");
const passport = require("passport");
const uploadOnCloudinary = require("../utils/cloudinary");

module.exports.renderSignUpPage = asyncHandler(async (req, res) => {
  res.render("signUp");
});

module.exports.registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, dob, gender, password, confirmPassword } =
    req.body;

  if (password != confirmPassword) {
    req.flash("error", "Password does not match!");
    return res.redirect("/user/registerUser");
  }
  const existedUser = await userModel.findOne({ email });
  if (existedUser) {
    req.flash("error", "Email already exists!");
    return res.redirect("/user/registerUser");
  }
  const avatarLocalPath = req.file?.path;
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const user = await userModel.create({
    firstName,
    lastName,
    email,
    dob,
    gender,
    password,
    avatar:
      avatar?.url ||
      "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?w=826&t=st=1723037395~exp=1723037995~hmac=88fe535ef9ac7e7658d485f74eaf8ffe444366fb43fb67ba7719c1969f068fad",
  });

  if (!user) {
    throw new ApiError(500, "User not created!");
  }
  req.login(user, (err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", `Welcome to AgriBuzz ${firstName}`);
    res.redirect("/agribuzz"); //Redirect to home page
  });
});

module.exports.renderLoginPage = asyncHandler(async (req, res) => {
  res.render("login");
});

module.exports.loginUser = asyncHandler(async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    } // Handle any errors

    if (!user) {
      req.flash("error", info.message || "Login failed.");
      return res.redirect("/agribuzz");
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      req.flash("success", `Welcome Back ${user.firstName}`);
      res.redirect("/agribuzz"); //Redirect to home page
    });
  })(req, res, next); // Call the passport middleware
});

module.exports.logoutUser = asyncHandler(async (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Error logging out:", err);
      return res.status(500).send("Error logging out.");
    }
    req.flash("success", "You have been logged out successfully.");
    res.redirect("/user/loginUser");
  });
});

module.exports.renderDashBoard = asyncHandler(async (req, res) => {
  res.render("dashboard", { user: req.user });
});

module.exports.crops = asyncHandler(async (req, res) => {
  res.render("crops");
});

module.exports.cropMap = asyncHandler(async (req, res) => {
  res.render("cropMap");
});

module.exports.renderUpdateUserInfo = asyncHandler(async (req, res) => {
  res.render("userUpdateForm");
});

module.exports.updatedUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const { firstName, lastName, email } = req.body;

    // Fetch the user from the database
    const user = await userModel.findById(id);

    if (!userModel) {
      req.flash("error", "User not found.");
      return res.redirect(`/user/${id}/editUserProfile`);
    }

    // Check if the email already exists
    const existingEmail = await userModel.findOne({ email });
    if (existingEmail && existingEmail._id.toString() !== id) {
      req.flash("error", "User with this email already exists.");
      return res.redirect(`/user/${id}/setting`);
    }

    if (user.emailChanged && email !== user.email) {
      req.flash("error", "Email can only be changed once.");
      return res.redirect(`/user/${id}/setting`);
    }
    // Update flags if username or email is being changed for the first time
    if (
      firstName !== user.firstName ||
      lastName !== user.lastName ||
      email !== user.email
    ) {
      await userModel.findByIdAndUpdate(id, {
        firstNameChanged: true,
        lastNameChanged: true,
        emailChanged: true,
      });
    }

    // Update user information
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new ApiError(500, "Failed to update user");
    }

    req.flash("success", "User Profile Updated Successfully!");
    res.redirect(`/user/${id}/dashboard`);
  } catch (error) {
    console.error(error); // Log the error for debugging
    req.flash("error", "An error occurred while updating the user profile.");
    res.redirect(`/user/${id}/setting`);
  }
});

module.exports.calendar = asyncHandler(async (req, res) => {
  res.render("calendar");
});

module.exports.market = asyncHandler(async (req, res) => {
  res.render("market");
});

module.exports.weather = asyncHandler(async (req, res) => {
  res.render("weather");
});
