const fs = require("fs");
const express = require("express");
const { Router } = express;
const router = new Router();

const getProducts = () => {
	return JSON.parse(fs.readFileSync("./data/products.json").toString());
};

router.get("/", (req, res) => {
	let products = getProducts();

	const renderProducts = () => {
		let arr = [];
		products.forEach((p) => {
			arr.push(`
				<div class="product">
					<h2>${p.title}</h2>
					<h3>$${p.price}</h3>
					<p>${p.description}</p>
					<br>
				</div>
			`);
		});
		return arr.join(" ");
	};

	let html = `
	<div>
		<h1>Productos</h1>
		<div>
			${renderProducts()}
		</div>
	</div>
	`;

	fs.writeFileSync("./views/home.handlebars", html);

	res.render("home", {});
});

module.exports = router;
