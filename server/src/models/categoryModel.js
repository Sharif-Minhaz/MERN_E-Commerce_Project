const { model, Schema } = require("mongoose");

const categorySchema = new Schema(
	{
		name: {
			type: String,
			trim: true,
			unique: true,
			required: [true, "Category name is required"],
			minLength: [2, "Length of category name is can be min 2 chars"],
		},
		slug: {
			type: String,
			trim: true,
			unique: true,
			lowercase: true,
			required: [true, "Slug is required"],
		},
	},
	{ timestamps: true }
);

module.exports = model("Category", categorySchema);
