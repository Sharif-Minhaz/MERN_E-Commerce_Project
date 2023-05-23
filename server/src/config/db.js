const mongoose = require("mongoose");
const { connectionString } = require("../secret");

const connectDB = async (options = {}) => {
	try {
		await mongoose.connect(connectionString, options);
		console.log("MongoDB connected successfully!");

		mongoose.connection.on("error", (error) => {
			console.error(`MongoDB connection failed - ${error}`);
		});
	} catch (error) {
		console.error(error.toString());
	}
};

module.exports = connectDB;
