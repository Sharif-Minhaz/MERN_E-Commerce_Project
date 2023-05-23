require("dotenv").config();

const connectionString = process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceDB";

module.exports = { connectionString };
