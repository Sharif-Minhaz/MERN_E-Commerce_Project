const userRoute = require("./userRoute");
const authRoute = require("./authRoute")

const routes = [
	{
		path: "/users",
		handler: userRoute,
	},
	{
		path: "/auth",
		handler: authRoute,
	},
];

module.exports = (app) => {
	routes.forEach((route) => {
		app.use("/api" + route.path, route.handler);
	});
};
