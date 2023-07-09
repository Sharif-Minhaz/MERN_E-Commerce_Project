const router = require("express").Router();
const { loginController, logoutController } = require("../controllers/authController");
const { isLoggedIn, isLoggedOut } = require("../middlewares/authMiddleware");
const { runValidation } = require("../validators");
const { validateUserLogin } = require("../validators/authValidators");

router.post("/login", isLoggedOut, validateUserLogin, runValidation, loginController);
router.post("/logout", isLoggedIn, logoutController);

module.exports = router;
