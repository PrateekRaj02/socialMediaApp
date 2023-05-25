const router = require("express").Router();
const {
  signupController,
  loginController,
  refreshAccessTokenController,
  logoutController,
} = require("../controller/authController");

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/refresh", refreshAccessTokenController);
router.post("/logout", logoutController);

module.exports = router;
