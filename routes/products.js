const fs = require("fs");
const express = require("express");
const { Router } = express;
const uuid4 = require("uuid4");

const router = new Router();
const path = "./data/products.json";
const getProducts = () => {
	return JSON.parse(fs.readFileSync(path).toString());
};

router.get("/", (req, res) => {
	const limit = parseInt(req.query.limit);
	let products = getProducts();

	let sendProducts;
	!limit
		? (sendProducts = { data: products })
		: (sendProducts = { data: products.slice(0, limit) });

	res.send(sendProducts);
});

router.get("/:pid", (req, res) => {
	const pid = req.params.pid;
	let products = getProducts();
	let product = products.find((p) => p.id == pid);

	let sendProduct;
	product
		? (sendProduct = { data: product })
		: (sendProduct = "Product not found");

	res.send(sendProduct);
});

router.post("/", async (req, res) => {
	let id = uuid4();
	let reqProduct = req.body;
	let product = {
		title: "",
		description: "",
		code: "",
		price: 0,
		status: true,
		stock: 0,
		category: "",
		thumbnails: [],
		id,
	};

	let productKeys = Object.keys(product);
	let missingKeys = [];

	productKeys.forEach((key) => {
		if (key === "thumbnails" || key === "id") return;

		!reqProduct[key] && missingKeys.push(key);
	});

	if (missingKeys.length == 0) {
		product = { ...product, ...reqProduct };

		let products = getProducts();
		let newProducts = products;
		newProducts.push(product);

		await fs.promises.writeFile(
			path,
			JSON.stringify(newProducts, null, 2),
			(err) => {
				err && console.log(err);
			}
		);
		return res.send("Product saved!");
	} else {
		return res.send("Error: missing " + missingKeys.toString());
	}
});

router.put("/:pid", async (req, res) => {
	let pid = req.params.pid;
	let newProductData = req.body;
	let products = getProducts();

	if (!products.find((p) => p.id == pid)) {
		return res.send("Product not found");
	}

	let newProducts = products.map((p) => {
		if (p.id === pid) {
			return { ...p, ...newProductData };
		}
	});

	await fs.promises.writeFile(
		path,
		JSON.stringify(newProducts, null, 2),
		(err) => {
			err && console.log(err);
		}
	);
	res.send("Product updated!");
});

router.delete("/:pid", async (req, res) => {
	let products = getProducts();
	let pid = req.params.pid;
	let product = products.find((p) => p.id == pid);

	if (!product) {
		return res.send("Product not found");
	} else {
		let newProducts = products.filter((p) => p.id !== pid);
		await fs.promises.writeFile(
			path,
			JSON.stringify(newProducts, null, 2),
			(err) => {
				err && console.log(err);
			}
		);
		return res.send("Product deleted!");
	}
});

module.exports = router;
