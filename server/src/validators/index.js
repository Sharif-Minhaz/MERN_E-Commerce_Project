const { validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

const runValidation = asyncHandler(async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			message: "Input validation failed",
			inputErrors: errors,
		});
	}

	next();
});

module.exports = { runValidation };
