const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const cartSchema = new mongoose.Schema({
	products: {
		type: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
				},
				quantity: {
					type: Number,
					required: true,
				},
			},
		],
		required: true,
	},
});

cartSchema.plugin(mongoosePaginate);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
