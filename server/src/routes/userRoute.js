const router = require("express").Router();

const {
	getAllUsersController,
	addUserController,
	getSingleUserController,
	deleteUserController,
	registerUserController,
	activateUserAccount,
	updateUserController,
} = require("../controllers/userController");
const upload = require("../middlewares/upload");
const { runValidation } = require("../validators");
const { validateUserReg } = require("../validators/authValidators");

router.get("/", getAllUsersController);
router.post("/", addUserController);
router.get("/:id", getSingleUserController);
router.delete("/:id", deleteUserController);

router.post(
	"/register",
	upload.single("image"),
	validateUserReg,
	runValidation,
	registerUserController
);
router.post("/activate", activateUserAccount);

router.patch("/:id", upload.single("image"), updateUserController);

module.exports = router;
