const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { createSlug } = require("../helper/createSlug");
const { deleteImage } = require("../helper/deleteImage");

exports.addProductController = asyncHandler(async (req, res) => {
	const { name, description, price, quantity, shipping, category } = req.body;
	const image = req.file?.filename || "default-product.png";

	const isExist = await Product.exists({ name });

	if (isExist) {
		deleteImage(`public/images/products/${image}`);
		return res.status(409).json({ success: false, message: "Product already exist" });
	}

	const newProduct = await Product.create({
		name,
		description,
		price,
		quantity,
		shipping,
		category,
		image,
		slug: createSlug(name),
	});

	if (newProduct) {
		return res.status(200).json({
			success: true,
			product: newProduct,
			message: "New product created successfully",
		});
	}

	deleteImage(`public/images/products/${image}`);

	res.status(500).json({
		success: false,
		message: "New product creation failed",
	});
});

exports.getProductsController = asyncHandler(async (req, res) => {
	const { search = "" } = req.query;
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 4;

	const searchRegExp = new RegExp(`.*${search}.*`, "i");

	const filter = {
		$or: [{ name: { $regex: searchRegExp } }, { slug: { $regex: searchRegExp } }],
	};

	const products = await Product.find(filter)
		.populate("category")
		.skip((page - 1) * limit)
		.limit(limit)
		.sort({ createdAt: -1 })
		.lean();

	const count = await Product.countDocuments(filter);

	if (products.length) {
		return res.status(200).json({
			success: true,
			message: "Products found",
			products,
			pagination: {
				totalProducts: count,
				totalPages: Math.ceil(count / limit),
				currentPage: page,
				prevPage: page - 1,
				nextPage: page + 1,
			},
		});
	}

	res.status(404).json({
		success: false,
		message: "Products not found",
	});
});

exports.getSingleProductController = asyncHandler(async (req, res) => {
	const { slug } = req.params;

	const product = await Product.findOne({ slug }).populate("category").lean();

	if (product) {
		return res.status(200).json({
			success: true,
			message: "Product found",
			product,
		});
	}

	res.status(404).json({
		success: false,
		message: "Product not found",
	});
});

exports.updateProductController = asyncHandler(async (req, res) => {
	const { slug } = req.params;

	const singleProduct = await Product.findOne({ slug });

	if (!singleProduct)
		return res.status(404).json({ success: false, message: "Product not found to update" });

	const updatedPayload = {
		...req.body,
	};

	if (req.file) {
		updatedPayload.image = req.file?.filename;
		deleteImage(`public/images/products/${singleProduct.image}`);
	} else {
		updatedPayload.image = singleProduct.image || "default-product.png";
	}

	if (req.body.name) updatedPayload.slug = createSlug(req.body.name);

	const product = await Product.findOneAndUpdate({ slug }, updatedPayload, {
		new: true,
		runValidators: true,
		context: "document",
	});

	if (product) {
		return res.status(200).json({
			success: true,
			message: "Product updated",
			product,
		});
	}
	res.status(500).json({
		success: false,
		message: "Product not updated",
	});
});

exports.deleteProductController = asyncHandler(async (req, res) => {
	const { slug } = req.params;

	const isExist = await Product.exists({ slug });

	if (!isExist)
		return res.status(404).json({ message: "Product not found to delete", success: false });

	const deleteProduct = await Product.findOneAndDelete({ slug });

	if (deleteProduct) {
		deleteImage(`public/images/products/${deleteProduct.image}`);
		return res.status(200).json({
			success: true,
			message: "Product deleted successfully",
		});
	}

	res.status(500).json({
		success: false,
		message: "Product not deleted",
	});
});
