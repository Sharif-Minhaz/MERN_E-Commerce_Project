const fs = require("fs").promises;

exports.deleteImage = (path) => {
	fs.access(path)
		.then(() => fs.unlink(path))
		.then(() => console.log("Image deleted successfully"))
		.catch((err) => console.error(err.message));
};
