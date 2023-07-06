const jwt = require("jsonwebtoken");

exports.createJsonWebToken = (payload, secretKey, expiresIn) => {
	const token = jwt.sign(payload, secretKey, { expiresIn });

	return token;
};

exports.verifyJsonWebToken = (token, secretKey) => {
	const decoded = jwt.verify(token, secretKey);

	return decoded;
}