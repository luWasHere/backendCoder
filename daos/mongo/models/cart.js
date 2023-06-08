const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
	products: {
		type: Array,
		required: true,
	},
});

const Cart = mongoose.model("cart", CartSchema);
module.exports = Cart;
