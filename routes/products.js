const express = require("express");
const { Router } = express;
const router = new Router();
const DBManager = require("../daos/mongo/dbManager");
const productModel = require("../daos/mongo/models/product");
const pDBManager = new DBManager(productModel);



router.get("/", (req, res) => {
	let limit = req.query.limit;

	pDBManager
		.get(limit)
		.then((pr) =>
			res.send({
				msg: "All products",
				data: pr,
			})
		)
		.catch((err) => res.send(err));
});

router.get("/:pid", (req, res) => {
	let id = req.params.pid;

	pDBManager
		.getById(id)
		.then((pr) =>
			res.send({
				msg: "Product by ID",
				data: pr,
			})
		)
		.catch((err) => res.send(err));
});

router.post("/", (req, res) => {
	let newPr = req.body;
	pDBManager
		.add(newPr)
		.then((pr) => {
			res.status(200).send({
				msg: "Product added!",
				data: pr,
			});
		})
		.catch((err) => {
			res.status(500).send({
				msg: "Error",
				data: err.message,
			});
		});
});

router.put("/:pid", (req, res) => {
	let id = req.params.pid;
	let updated = req.body;

	pDBManager
		.update(id, updated)
		.then((pr) =>
			res.send({
				msg: "Product updated",
				data: pr,
			})
		)
		.catch((err) => res.send(err.message));
});

router.delete("/:pid", (req, res) => {
	let id = req.params.pid;

	pDBManager
		.delete(id)
		.then((pr) =>
			res.send({
				msg: "Product deleted!",
				data: pr,
			})
		)
		.catch((err) => res.send(err.message));
});

module.exports = router;
