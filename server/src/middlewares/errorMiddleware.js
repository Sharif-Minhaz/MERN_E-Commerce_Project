const logger = require("../controllers/loggerController");

exports.errorMiddleware = async (err, req, res, next) => {
	const statusCode = res.statusCode || 500;

	logger.log("error", err.message);

	res.json({
		statusCode,
		message: err.message,
		stack: process.env.NODE_ENV === "production" ? null : err.stack,
	});
};
