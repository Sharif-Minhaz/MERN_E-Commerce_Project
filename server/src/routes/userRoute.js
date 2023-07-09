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
} = require("../controllers/userController");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const { runValidation } = require("../validators");
const { validateUserReg } = require("../validators/authValidators");
const { updatePassword } = require("../validators/userValidators");

router.get("/", isLoggedIn, isAdmin, getAllUsersController);
router.post("/", isLoggedIn, addUserController);
router.get("/:id", isLoggedIn, getSingleUserController);
router.delete("/:id", isLoggedIn, isAdmin, deleteUserController);

router.post(
	"/register",
	isLoggedOut,
	upload.single("image"),
	validateUserReg,
	runValidation,
	registerUserController
);
router.post("/activate", isLoggedOut, activateUserAccount);

router.patch("/:id", isLoggedIn, upload.single("image"), updateUserController);

router.patch("/ban-user/:id", isLoggedIn, isAdmin, banUserController);
router.patch("/unban-user/:id", isLoggedIn, isAdmin, unBanUserController);
router.patch(
	"/update-password/info",
	updatePassword,
	runValidation,
	isLoggedIn,
	updatePasswordController
);

module.exports = router;
