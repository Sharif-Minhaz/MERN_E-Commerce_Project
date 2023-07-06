const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.SMTP_USERNAME,
		pass: process.env.SMTP_PASSWORD,
	},
});

const emailWithNodemailer = asyncHandler(async (emailData) => {
	const mailOptions = {
		from: process.env.SMTP_USERNAME, // sender address
		to: emailData.email, // list of receivers
		subject: emailData.subject, // Subject line
		html: emailData.html, // html body
	};

	const info = await transporter.sendMail(mailOptions);

    return info.response;
});

module.exports = emailWithNodemailer;
