const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { createJsonWebToken } = require("../helper/jsonwebtoken");

exports.loginController = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email }).select(
		"_id name email image +password isAdmin isBanned"
	);

	if (!user) return res.status(401).json({ success: false, message: "Credential error" });

	const isPasswordMatch = await bcrypt.compare(password, user.password);

	if (!isPasswordMatch)
		return res.status(401).json({ success: false, message: "Credential error" });

	if (user.isBanned)
		return res.status(403).json({
			message: "You are banned, please contact with the support team.",
			success: false,
		});

	delete user._doc.password;

	const token = createJsonWebToken(user._doc, process.env.JWT_ACCESS_TOKEN_SECRET, "10m");

	res.cookie("access_token", token, {
		maxAge: 15 * 60 * 1000,
		httpOnly: true,
		secure: true,
		sameSite: "none",
	});

	res.status(200).json({
		success: true,
		message: "Login successful",
		user,
	});
});

exports.logoutController = asyncHandler(async (req, res) => {
	res.clearCookie("access_token");

	res.status(200).json({
		success: true,
		message: "User logout successfully",
	});
});
