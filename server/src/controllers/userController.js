const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

exports.getAllUsersController = asyncHandler(async (req, res) => {
	const { search = "" } = req.query;
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 5;

	const searchRegExp = new RegExp(`.*${search}.*`, "i");

	const filter = {
		// isAdmin: { $ne: true },
		$or: [
			{ name: { $regex: searchRegExp } },
			{ email: { $regex: searchRegExp } },
			{ phone: { $regex: searchRegExp } },
		],
	};

	const users = await User.find(filter)
		.limit(limit)
		.skip((page - 1) * limit);

	if (users.length) {
		return res.status(200).json({
			success: true,
			message: "Users found",
			users,
			pagination: {
				totalPages: Math.ceil(users.length / limit),
				currentPage: page,
				previousPage: page - 1 > 0 ? page - 1 : null,
				nextPage: page + 1 < Math.ceil(users.length / limit) ? page + 1 : null,
			},
		});
	}

	res.status(404).json({
		success: false,
		message: "Users not found",
		users: [],
		totalUsers: 0,
		pagination: {},
	});
});

exports.getSingleUserController = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const user = await User.findById(id);

	if (user) {
		return res.status(200).json({
			success: true,
			message: "User found",
			user,
		});
	}

	res.status(404).json({
		success: false,
		message: "User not found",
		user: {},
	});
});

exports.addUserController = asyncHandler(async (req, res) => {
	const newUser = await new User(req.body).save();

	if (newUser) {
		return res.status(201).json({
			success: true,
			message: "User added",
			user: newUser,
		});
	}

	res.status(500).json({
		success: false,
		message: "User not added",
		user: {},
	});
});
