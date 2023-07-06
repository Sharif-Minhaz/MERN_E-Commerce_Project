const userRoute = require("./userRoute");

const routes = [
	{
		path: "/user",
		handler: userRoute,
	},
];

module.exports = (app) => {
	routes.forEach((route) => {
		app.use("/api" + route.path, route.handler);
	});
};
