const mongoose = require("mongoose");

module.exports = {
	connect: () => {
		return mongoose
			.connect(
				"mongodb+srv://jm248g:123abc@cluster0.qybo9ig.mongodb.net/ecommerce",
				{
					useUnifiedTopology: true,
					useNewUrlParser: true,
				}
			)
			.then((connect) => {
				console.log("db conected");
			})
			.catch((err) => {
				console.log(err);
			});
	},
};
