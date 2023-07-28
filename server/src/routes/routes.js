const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const categoryRoute = require("./categoryRoute");

const routes = [
	{
		path: "/users",
		handler: userRoute,
	},
	{
		path: "/auth",
		handler: authRoute,
	},
	{
		path: "/categories",
		handler: categoryRoute,
	}
];

module.exports = (app) => {
	routes.forEach((route) => {
		app.use("/api" + route.path, route.handler);
	});
};
