const router = require("express").Router();

const { getAllUsersController, addUserController, getSingleUserController } = require("../controllers/userController");

router.get("/", getAllUsersController);
router.get("/:id", getSingleUserController)
router.post("/", addUserController);

module.exports = router;
