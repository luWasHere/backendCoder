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
		.getById(id, "products.product")
		.then((c) => {
			res.send({
				msg: "Cart by ID",
				data: c,
			});
		})
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

const updateCartProduct = async (req, res, method, msg) => {
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

	let updated = {};

	if (method === "post") {
		let productExists = cart["_doc"].products.find(
			(p) => p.product["_id"].toString() === pid
		);

		if (productExists) {
			productExists.quantity += 1;

			cart.products.map((p) => {
				if (p.product.toString() === pid) {
					return productExists;
				}
			});

			updated = cart;
		} else {
			cart.products.push({ product: pid, quantity: 1 });
			updated = cart;
		}

		return cDBManager
			.update(cid, updated)
			.then((c) => {
				res.status(200).send({
					msg: msg,
					data: c,
				});
			})
			.catch((err) => {
				res.status(500).send({
					msg: "Error",
					data: err.message,
				});
			});
	} else if (method === "delete") {
		let newProductArray = cart.products.filter((p) => p.id.toString() !== pid);
		updated = {
			...cart["_doc"],
			products: newProductArray,
		};

		return cDBManager
			.update(cid, updated)
			.then((c) => {
				res.status(200).send({
					msg: msg,
					data: c,
				});
			})
			.catch((err) => {
				res.status(500).send({
					msg: "Error",
					data: err.message,
				});
			});
	} else if (method === "deleteall") {
		updated = {
			...cart["_doc"],
			products: [],
		};
		return cDBManager
			.update(cid, updated)
			.then((c) => {
				res.status(200).send({
					msg: msg,
					data: c,
				});
			})
			.catch((err) => {
				res.status(500).send({
					msg: "Error",
					data: err.message,
				});
			});
	}
};

router.post("/:cid/product/:pid", async (req, res) => {
	await updateCartProduct(req, res, "post", "Product added to cart!");
});

router.delete("/:cid/product/:pid", async (req, res) => {
	await updateCartProduct(req, res, "delete", "Product deleted from cart!");
});

router.delete("/:cid", async (req, res) => {
	await updateCartProduct(
		req,
		res,
		"deleteall",
		"All cart products have been removed"
	);
});

module.exports = router;
