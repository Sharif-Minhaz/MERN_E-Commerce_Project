const app = require("./app");
const connectDB = require("./config/db");

const port = process.env.PORT || 8080;

app.listen(port, async () => {
	console.info(`Server is running at http://localhost:${port}`);
	await connectDB();
});
