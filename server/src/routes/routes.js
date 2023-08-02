const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const categoryRoute = require("./categoryRoute");
const productRoute = require("./productRoute");

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
	},
	{
		path: "/products",
		handler: productRoute,
	}
];

module.exports = (app) => {
	routes.forEach((route) => {
		app.use("/api" + route.path, route.handler);
	});
};
