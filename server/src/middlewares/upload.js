const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, process.env.UPLOAD_FOLDER);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname +
				"-" +
				file.originalname +
				uniqueSuffix +
				path.extname(file.originalname)
		);
	},
});

const upload = multer({
	storage: storage,
	fileFilter: function (req, file, callback) {
		const ext = path.extname(file.originalname);
		if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
			return callback(new Error("Only images are allowed"));
		}
		callback(null, true);
	},
	limits: {
		fileSize: 1024 * 1024,
	},
});

module.exports = upload;
