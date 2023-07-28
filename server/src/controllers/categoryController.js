const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");
const { createSlug } = require("../helper/createSlug");

exports.createCategoryController = asyncHandler(async (req, res) => {
	const { name } = req.body;

	const newCategory = await Category.create({ name, slug: createSlug(name) });

	if (newCategory) {
		return res.status(201).json({
			success: true,
			message: "Category created successfully",
			category: newCategory,
		});
	}

	res.status(500).json({
		success: false,
		message: "Category creation failed",
	});
});

exports.getCategoriesController = asyncHandler(async (req, res) => {
	const categories = await Category.find().lean();

	if (categories.length) {
		return res.status(200).json({
			success: true,
			message: "Categories found",
			categories,
		});
	}
	res.status(500).json({
		success: false,
		message: "Categories not found",
	});
});

exports.getSingleCategoryController = asyncHandler(async (req, res) => {
	const { slug } = req.params;
	const categories = await Category.find({ slug }).lean();

	if (categories.length) {
		return res.status(200).json({
			success: true,
			message: "Categories found",
			categories,
		});
	}
	res.status(500).json({
		success: false,
		message: "Categories not found",
	});
});

exports.updateCategoryController = asyncHandler(async (req, res) => {
	const { slug } = req.params;
	const { name } = req.body;

	const category = await Category.findOneAndUpdate(
		{ slug },
		{ name, slug: createSlug(name) },
		{ new: true, runValidators: true, context: "document" }
	);

	if (category) {
		return res.status(200).json({
			success: true,
			message: "Category updated",
			category,
		});
	}
	res.status(500).json({
		success: false,
		message: "Category not updated",
	});
});

exports.deleteCategoryController = asyncHandler(async (req, res) => {
	const { slug } = req.params;

	const deletedCategory = await Category.findOneAndDelete({ slug });

	if (deletedCategory) {
		return res.status(200).json({
			success: true,
			message: "Category deleted successfully",
		});
	}

	res.status(500).json({
		success: false,
		message: "Category not deleted",
	});
});
