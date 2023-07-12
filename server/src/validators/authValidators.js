const { body } = require("express-validator");

// registration validation
const validateUserReg = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Name is required")
		.isLength({ min: 3, max: 31 })
		.withMessage("Name should be at least 3-31 chars"),
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Invalid email address"),
	body("password")
		.trim()
		.isLength({ min: 6 })
		.withMessage("Password should be 6 characters long")
		.notEmpty()
		.withMessage("Password is required")
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?:=&-])[A-Za-z\d@$!%*#?:=&-]+$/)
		.withMessage(
			"Password should minimum 8 characters, at least 1 Uppercase, 1 Lowercase, 1 number and 1 special character"
		),
	body("address").trim(),
	body("phone").trim().isMobilePhone().withMessage("Invalid mobile phone number"),
	body("image").optional(),
];

// login validation
const validateUserLogin = [
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Invalid email address"),
	body("password").trim().notEmpty().withMessage("Password is required"),
];


module.exports = { validateUserReg, validateUserLogin };
