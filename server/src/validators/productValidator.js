const { body } = require("express-validator");

const validateProduct = [
	body("category").trim().notEmpty().withMessage("Category id is required"),
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Product name is required.")
		.isLength({ min: 2 })
		.withMessage("Product name should be at least 2 characters long."),
	body("description")
		.trim()
		.notEmpty()
		.withMessage("Product description is required")
		.isLength({ min: 10 })
		.withMessage("Length of product description is can be min 10 chars"),
	body("price")
		.trim()
		.notEmpty()
		.withMessage("Product price is required")
		.custom((value) => {
			if (value <= 0) {
				throw new Error("Product price must be higher than 0");
			}
			return true;
		}),
	body("quantity")
		.trim()
		.notEmpty()
		.withMessage("Product quantity is required")
		.custom((value) => {
			if (value <= 0) {
				throw new Error("Product quantity must be higher than 0");
			}
			return true;
		}),
];

module.exports = { validateProduct };
