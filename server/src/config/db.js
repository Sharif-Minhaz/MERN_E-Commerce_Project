const mongoose = require("mongoose");
const { connectionString } = require("../secret");
const logger = require("../controllers/loggerController");

const connectDB = async (options = {}) => {
	try {
		await mongoose.connect(connectionString, options);
		logger.log("info", "MongoDB connected successfully!");

		mongoose.connection.on("error", (error) => {
			logger.log("error", `MongoDB connection failed - ${error}`);
			console.error(`MongoDB connection failed - ${error}`);
		});
	} catch (error) {
		logger.log("error", error.toString());
		console.error(error.toString());
	}
};

module.exports = connectDB;
