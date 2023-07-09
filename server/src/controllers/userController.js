const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { deleteImage } = require("../helper/deleteImage");
const { createJsonWebToken, verifyJsonWebToken } = require("../helper/jsonwebtoken");
const emailWithNodemailer = require("../helper/email");

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

exports.deleteUserController = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const user = await User.exists({ _id: id });
	if (!user) {
		return res.status(404).json({
			success: false,
			message: "User not found",
		});
	}

	const deletedUser = await User.findByIdAndDelete({ _id: id, isAdmin: false });

	const userImagePath = deletedUser.image;

	deleteImage(userImagePath);

	if (deletedUser) {
		return res.status(200).json({
			success: true,
			message: "User deleted",
			user: deletedUser,
		});
	}

	res.status(404).json({
		success: false,
		message: "User not found",
		user: {},
	});
});

exports.registerUserController = asyncHandler(async (req, res) => {
	const { name, email, password, phone, address } = req.body;

	const image = req.file?.filename || "default.png";

	const usersExists = await User.exists({ email });

	if (usersExists) {
		return res.status(409).json({
			success: false,
			message: "User already exits",
		});
	}

	const token = createJsonWebToken(
		{ name, email, password, phone, address, image },
		process.env.JWT_ACTIVATION_SECRET,
		"10m"
	);

	// prepare email
	const emailData = {
		email,
		subject: "Account activation mail",
		html: `
			<h2>Hello ${name},</h2>
			<p>Please click here to <a target="_blank" href='${process.env.CLIENT_URL}/user/activate?token=${token}'>active your account</a> </p>
		`,
	};

	// send mail
	const emailRes = await emailWithNodemailer(emailData);

	if (emailRes) {
		return res.status(201).json({
			success: true,
			message: `Please go to your ${email} to active your account.`,
			token,
		});
	}

	res.status(500).json({
		success: false,
		message: "Failed to send mail",
	});
});

exports.activateUserAccount = asyncHandler(async (req, res) => {
	const { token } = req.body;

	if (!token) throw new Error("Invalid or empty token", token);

	const decoded = verifyJsonWebToken(token, process.env.JWT_ACTIVATION_SECRET);

	if (!decoded) throw new Error("User verification failed!");

	const usersExists = await User.exists({ email: decoded.email });

	if (usersExists) {
		return res.status(409).json({
			success: false,
			message: "User already exits",
		});
	}

	const newUser = await new User({ ...decoded }).save();

	if (newUser) {
		return res.status(201).json({
			success: true,
			message: `User added`,
			user: newUser,
		});
	}

	res.status(500).json({
		success: false,
		message: "User not added",
	});
});

exports.updateUserController = asyncHandler(async (req, res) => {
	const userId = req.params.id;

	const user = await User.findOne({ _id: userId, isAdmin: false });

	if (!user) return res.status(404).json({ success: false, message: "User not found to update" });

	const updatedPayload = {
		...req.body,
	};

	if (req.file) {
		updatedPayload.image = req.file?.filename;
		deleteImage(`public/images/users/${user.image}`);
	} else {
		updatedPayload.image = user.image || "default.png";
	}

	const updatedUser = await User.findOneAndUpdate(
		{ _id: userId, isAdmin: false },
		updatedPayload,
		{
			new: true,
			runValidators: true,
		}
	);

	if (updatedUser) {
		return res.status(200).json({
			success: true,
			message: "User is updated successfully",
			user: updatedUser,
		});
	}

	res.status(500).json({
		success: false,
		message: "Can't updated right now",
	});
});

exports.banUserController = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const user = await User.findOneAndUpdate(
		{ _id: id, isAdmin: false },
		{ isBanned: true },
		{ new: true }
	);

	if (user) {
		return res.status(200).json({
			success: true,
			message: "User banned successfully!",
			user,
		});
	}

	res.status(500).json({
		success: false,
		message: "User banned failed!",
	});
});

exports.unBanUserController = asyncHandler(async (req, res) => {
	const { id } = req.params;

	const user = await User.findOneAndUpdate(
		{ _id: id, isAdmin: false },
		{ isBanned: false },
		{ new: true }
	);

	if (user) {
		return res.status(200).json({
			success: true,
			message: "User un-banned successfully!",
			user,
		});
	}

	res.status(500).json({
		success: false,
		message: "User un-banned failed!",
	});
});
