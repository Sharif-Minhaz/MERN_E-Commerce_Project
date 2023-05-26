require("dotenv").config();

module.exports = {
	connectionString: process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceDB",
};
