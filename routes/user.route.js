const express = require("express");
const router = express.Router();
const {
  renderSignUpPage,
  renderLoginPage,
  registerUser,
  loginUser,
  logoutUser,
  renderDashBoard,
  crops,
  cropMap,
  renderUpdateUserInfo,
  updatedUser,
  calendar,
  market,
  weather,
} = require("../controllers/user.controller");
const validateSignUpUser = require("../middlewares/validateSignUpUser.middleware");
const validateLoginUser = require("../middlewares/validateLoginUser.middleware");
const upload = require("../middlewares/multer.middleware");

router.get("/registerUser", renderSignUpPage);
router.post(
  "/register",
  upload.single("avatar"),
  validateSignUpUser,
  registerUser
);
router.get("/:id/setting", renderUpdateUserInfo);
router.put("/:id/updateUser", updatedUser);
router.get("/:id/dashboard", renderDashBoard);
router.get("/crops", crops);
router.get("/crops/:crop", cropMap);
router.get("/loginUser", renderLoginPage);
router.post("/login", validateLoginUser, loginUser);
router.get("/logout", logoutUser);
router.get("/:id/dashboard/weather", weather);
router.get("/:id/dashboard/calendar", calendar);
router.get("/:id/dashboard/market", market);

module.exports = router;
