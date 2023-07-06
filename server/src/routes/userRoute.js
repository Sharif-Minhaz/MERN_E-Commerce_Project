const router = require("express").Router();

const {
	getAllUsersController,
	addUserController,
	getSingleUserController,
	deleteUserController,
	registerUserController,
	activateUserAccount,
} = require("../controllers/userController");
const upload = require("../middlewares/upload");

router.get("/", getAllUsersController);
router.post("/", addUserController);
router.get("/:id", getSingleUserController);
router.delete("/:id", deleteUserController);

router.post("/register", upload.single("image"), registerUserController);
router.post("/activate", activateUserAccount);

module.exports = router;
