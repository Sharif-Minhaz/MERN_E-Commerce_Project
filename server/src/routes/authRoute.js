const router = require("express").Router();
const { loginController, logoutController } = require("../controllers/authController");
const runValidation = require('../validators')

router.post("/login", loginController)
router.post("/logout", logoutController)

module.exports = router;