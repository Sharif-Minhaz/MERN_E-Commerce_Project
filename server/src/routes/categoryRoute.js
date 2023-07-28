const router = require("express").Router();
const {
	createCategoryController,
	getCategoriesController,
	getSingleCategoryController,
	updateCategoryController,
	deleteCategoryController,
} = require("../controllers/categoryController");
const { isLoggedIn, isAdmin } = require("../middlewares/authMiddleware");
const { runValidation } = require("../validators");
const { validateCategory } = require("../validators/categoryValidator");

router.get("/", getCategoriesController);
router.get("/:slug", getSingleCategoryController);

router.post("/", isLoggedIn, isAdmin, validateCategory, runValidation, createCategoryController);

router.patch("/:slug", isLoggedIn, isAdmin, updateCategoryController)

router.delete("/:slug", isLoggedIn, isAdmin, deleteCategoryController)

module.exports = router;
