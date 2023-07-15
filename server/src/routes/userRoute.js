const router = require("express").Router();

const {
	getAllUsersController,
	addUserController,
	getSingleUserController,
	deleteUserController,
	registerUserController,
	activateUserAccount,
	updateUserController,
	banUserController,
	unBanUserController,
	updatePasswordController,
	forgetPasswordController,
	resetPasswordController,
} = require("../controllers/userController");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { runValidation } = require("../validators");
const { validateUserReg } = require("../validators/authValidators");
const { updatePassword, forgetPassword, resetPassword } = require("../validators/userValidators");

router.get("/", isLoggedIn, isAdmin, getAllUsersController);
router.post("/:id([0-9a-fA-F]{24})", isLoggedIn, addUserController);
router.get("/:id([0-9a-fA-F]{24})", isLoggedIn, getSingleUserController);
router.delete("/:id([0-9a-fA-F]{24})", isLoggedIn, isAdmin, deleteUserController);

router.post(
	"/register",
	isLoggedOut,
	upload.single("image"),
	validateUserReg,
	runValidation,
	registerUserController
);
router.post("/activate", isLoggedOut, activateUserAccount);

router.patch("/:id([0-9a-fA-F]{24})", isLoggedIn, upload.single("image"), updateUserController);

router.patch("/:id([0-9a-fA-F]{24})", isLoggedIn, isAdmin, banUserController);
router.patch("/unban-user/:id([0-9a-fA-F]{24})", isLoggedIn, isAdmin, unBanUserController);
router.patch(
	"/update-password/info",
	updatePassword,
	runValidation,
	isLoggedIn,
	updatePasswordController
);

router.post(
	"/forget-password",
	forgetPassword,
	runValidation,
	isLoggedIn,
	forgetPasswordController
);

router.patch(
	"/reset-password/info",
	resetPassword,
	runValidation,
	isLoggedIn,
	resetPasswordController
);

module.exports = router;
