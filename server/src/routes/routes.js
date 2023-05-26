const userRoute = require("./userRoute");

const routes = [
	{
		path: "/api/users",
		handler: userRoute,
	},
];

module.exports = (app) => {
	routes.forEach((route) => {
		app.use(route.path, route.handler);
	});
};
