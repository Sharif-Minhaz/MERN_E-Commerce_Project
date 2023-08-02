const { model, Schema } = require("mongoose");

const productSchema = new Schema(
	{
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category Id is required"]
        },
		name: {
			type: String,
			trim: true,
			unique: true,
			required: [true, "Product name is required"],
			minLength: [2, "Length of product name is can be min 2 chars"],
		},
		slug: {
			type: String,
			trim: true,
			unique: true,
			lowercase: true,
			required: [true, "Slug is required"],
		},
		description: {
			type: String,
			trim: true,
			required: [true, "Product description is required"],
			minLength: [10, "Length of product description is can be min 10 chars"],
		},
		price: {
			type: Number,
			required: [true, "Product price is required"],
			validate: {
				validator: (value) => value > 0,
				message: (props) => `${props.value} is not a valid product price.`,
			},
		},
		quantity: {
			type: Number,
			required: [true, "Product quantity is required"],
			validate: {
				validator: (value) => value > 0,
				message: (props) => `${props.value} is not a valid product quantity.`,
			},
		},
		sold: {
			type: Number,
			default: 0,
		},
		shipping: {
			type: Number,
			default: 0,
		},
        image: {
            type: String,
            required: [true, "Product image required"],
            trim: true,
        },
	},
	{ timestamps: true }
);

//

module.exports = model("Product", productSchema);
