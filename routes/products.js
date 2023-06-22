const express = require("express");
const { Router } = express;
const router = new Router();
const DBManager = require("../daos/mongo/dbManager");
const productModel = require("../daos/mongo/models/product");
const pDBManager = new DBManager(productModel);

router.get("/", (req, res) => {
	const query = req.query;
	const url = req.url.substring(1);
	const params = new URLSearchParams(`${url}`);

	const hasPage = (position, obj) => {
		if (position === "prev") {
			if (obj.hasPrevPage === true) {
				params.set("page", obj.prevPage);
				return `http://localhost:8080/api/products?${params.toString()}`;
			} else return "no previous page";
		} else {
			if (obj.hasNextPage === true) {
				params.set("page", obj.nextPage);
				return `http://localhost:8080/api/products?${params.toString()}`;
			} else return "no next page";
		}
	};

	pDBManager
		.get(query.limit, query.page, query.sort, query.query)
		.then((pr) =>
			res.send({
				msg: "Products",
				data: {
					...pr,
					prevLink: `${hasPage("prev", pr)}`,
					nextLink: `${hasPage("next", pr)}`,
				},
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
