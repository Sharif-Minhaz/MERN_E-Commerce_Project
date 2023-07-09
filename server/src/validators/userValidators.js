const { body } = require("express-validator");

const updatePassword = [
	body("oldPassword").trim().notEmpty().withMessage("Password is required"),
	body("password")
		.trim()
		.isLength({ min: 6 })
		.withMessage("New password should be 6 characters long")
		.notEmpty()
		.withMessage("New password is required")
		.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?:=&-])[A-Za-z\d@$!%*#?:=&-]+$/)
		.withMessage(
			"New Password should minimum 8 characters, at least 1 Uppercase, 1 Lowercase, 1 number and 1 special character"
		),
	body("confirmPassword")
		.trim()
		.notEmpty()
		.withMessage("Confirm password is required")
		.custom((value, { req }) => {
			if (value !== req.body?.password) {
				throw new Error("Password doesn't matched with new password");
			}
			return true;
		}),
];

module.exports = {
	updatePassword,
};
