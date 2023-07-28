const slugify = require("slugify");

exports.createSlug = (value) => {
	const slug = slugify(value, {
		remove: undefined,
		lower: true,
		strict: true,
	});

	return slug;
};
