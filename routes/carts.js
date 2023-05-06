const fs = require("fs");
const express = require("express");
const { Router } = express;
const uuid4 = require("uuid4");

const router = new Router();
const path = "./data/carts.json";
const getCarts = () => {
	return JSON.parse(fs.readFileSync(path).toString());
};
const getProducts = () => {
	return JSON.parse(fs.readFileSync("./data/products.json").toString());
};

router.get("/", (req, res) => {
	let carts = getCarts();
	res.send({ data: carts });
});

router.post("/", async (req, res) => {
	let id = uuid4();
	let carts = getCarts();
	carts.push({ cid: id, products: [] });

	await fs.promises.writeFile(path, JSON.stringify(carts, null, 2), (err) => {
		err && console.log(err);
	});
	res.send("A new cart has been created with id " + id);
});

router.post("/:cid/product/:pid", async (req, res) => {
	let cid = req.params.cid;
	let pid = req.params.pid;

	let carts = getCarts();
	let cart = carts.find((c) => c.cid == cid);

	let products = getProducts();
	let product = products.find((p) => p.id == pid)

	if (!product) {
		return res.send("Error: There is no product with that ID")
	}

	if (cart) {
		cartProduct = cart["products"].find((p) => p.pid == pid);

		if (cartProduct) {
			cartProduct.quantity += 1;
		} else {
			cart["products"].push({ pid, quantity: 1 });
		}

		await fs.promises.writeFile(path, JSON.stringify(carts, null, 2), (err) => {
			err && console.log(err);
		});

		return res.send("Product added to cart!");
	} else {
		return res.send("Error: Cart not found");
	}
});

module.exports = router;
