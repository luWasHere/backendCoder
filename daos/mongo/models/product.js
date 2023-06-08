const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	code: {
		type: String,
		required: true,
		unique: true,
	},
	price: {
		type: Number,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
});

const Product = mongoose.model("product", ProductSchema);
module.exports = Product;
