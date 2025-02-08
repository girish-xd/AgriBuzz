const express = require("express");
const router = express.Router();
const {
  homeController,
  contactController,
  sendVerificationEmail,
} = require("../controllers/home.controller");

router.get("/", homeController);
router.get("/contact", contactController);
router.post("/contact/submit", sendVerificationEmail);

module.exports = router;
