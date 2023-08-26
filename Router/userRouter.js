const express = require("express");
const router = express.Router();
const authController = require("../controllers/authContoller");

router.post("/signup", authController.signUp);
router.post("/login", authController.logIn);
router.post(
  "/change-password",
  authController.protect,
  authController.changePassword
);

module.exports = router;
