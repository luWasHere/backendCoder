const express = require("express");
const { Router } = express;
const DBManager = require("../daos/mongo/dbManager");
const cartModel = require("../daos/mongo/models/cart");
const cDBManager = new DBManager(cartModel);
const productModel = require("../daos/mongo/models/product");
const pDBManager = new DBManager(productModel);

const router = new Router();

router.get("/", (req, res) => {
	let limit = req.query.limit;

	cDBManager
		.get(limit)
		.then((c) =>
			res.send({
				msg: "All carts",
				data: c,
			})
		)
		.catch((err) => res.send(err));
});

router.get("/:cid", (req, res) => {
	let id = req.params.cid;

	cDBManager
		.getById(id)
		.then((c) =>
			res.send({
				msg: "Cart by ID",
				data: c,
			})
		)
		.catch((err) => res.send(err));
});

router.post("/", (req, res) => {
	let newC = req.body;
	cDBManager
		.add(newC)
		.then((c) => {
			res.status(200).send({
				msg: "Cart added!",
				data: c,
			});
		})
		.catch((err) => {
			res.status(500).send({
				msg: "Error",
				data: err.message,
			});
		});
});

router.post("/:cid/product/:pid", async (req, res) => {
	let cid = req.params.cid;
	let pid = req.params.pid;
	let cart = null;
	let product = null;

	await cDBManager
		.getById(cid)
		.then((c) => {
			cart = c;
		})
		.catch((err) => res.send(err.message));
	await pDBManager
		.getById(pid)
		.then((pr) => {
			product = pr;
		})
		.catch((err) => res.send(err.message));

	console.log(cart);
	console.log(product);

	let updated = {
		...cart,
		products: cart.products.push({ title: product.title, id: product["_id"] }),
	};

	cDBManager
		.update(cid, updated)
		.then((c) => {
			res.status(200).send({
				msg: "Product added to cart!",
				data: c,
			});
		})
		.catch((err) => {
			res.status(500).send({
				msg: "Error",
				data: err.message,
			});
		});
});

module.exports = router;
