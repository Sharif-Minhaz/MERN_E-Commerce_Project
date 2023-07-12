const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createJsonWebToken, verifyJsonWebToken } = require("../helper/jsonwebtoken");

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

	const accessToken = createJsonWebToken(
		{ _id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin },
		process.env.JWT_ACCESS_TOKEN_SECRET,
		"15m"
	);

	res.cookie("access_token", accessToken, {
		maxAge: 15 * 60 * 1000,
		httpOnly: true,
		secure: true,
		sameSite: "none",
	});

	const refreshToken = createJsonWebToken(
		{ _id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin },
		process.env.JWT_REFRESH_TOKEN_SECRET,
		"7d"
	);

	res.cookie("refresh_token", refreshToken, {
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		httpOnly: true,
		secure: true,
		sameSite: "none",
	});

	delete user._doc?.password;

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

exports.handleRefreshTokenController = asyncHandler(async (req, res) => {
	const { refresh_token } = req.cookies;

	const decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_TOKEN_SECRET);
	const { _id, email, name, isAdmin } = decoded;

	if (!refresh_token) throw new Error("Refresh token missing. Refresh token is required.");

	const accessToken = createJsonWebToken(
		{ _id, email, name, isAdmin },
		process.env.JWT_ACCESS_TOKEN_SECRET,
		"15m"
	);

	res.cookie("access_token", accessToken, {
		maxAge: 15 * 60 * 1000,
		httpOnly: true,
		secure: true,
		sameSite: "none",
	});

	if (accessToken)
		return res.status(200).json({
			success: true,
			message: "New access token generated",
		});

	res.status(500).json({
		success: false,
		message: "New access token generation failed",
	});
});

exports.handleProtectedController = asyncHandler(async (req, res) => {
	const token = req.cookies.access_token;

	if (token) {
		const decoded = verifyJsonWebToken(token, process.env.JWT_ACCESS_TOKEN_SECRET);

		req.decoded = decoded;
		if (!decoded) res.status(401).json({ success: false, message: "Token expired" });
		return res.status(200).json({ success: true, message: "Token verified", token });
	}

	res.status(401).json({
		success: false,
		message: "Unauthorized, Login required",
	});
});
