const router = require("express").Router();
const {
	addProductController,
	deleteProductController,
	getProductsController,
	getSingleProductController,
	updateProductController,
} = require("../controllers/productController");
const upload = require("../middlewares/upload");
const { isLoggedIn, isAdmin } = require("../middlewares/authMiddleware");
const { runValidation } = require("../validators");
const { validateProduct } = require("../validators/productValidator");

router.get("/", getProductsController);
router.get("/:slug", getSingleProductController);

router.post(
	"/",
	isLoggedIn,
	isAdmin,
	upload.single("product"),
	validateProduct,
	runValidation,
	addProductController
);

router.patch("/:slug", isLoggedIn, isAdmin, upload.single("product"), updateProductController);

router.delete("/:slug", isLoggedIn, isAdmin, deleteProductController);

module.exports = router;
