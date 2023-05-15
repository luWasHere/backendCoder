const fs = require("fs");
const express = require("express");
const { Router } = express;
const router = new Router();
const io = require("../index");

router.get("/", (req, res) => {
	res.render("realTimeProducts", {});

	// monitoreando el archivo products.json para actualizar la lista de productos en caso de que haya cambios
	let lastModification = null;

	setInterval(() => {
		fs.stat("./data/products.json", (err, stats) => {
			if (err) {
				console.error(err);
				return;
			}

			if (
				lastModification &&
				lastModification.getTime() !== stats.mtime.getTime()
			) {
				let products = JSON.parse(
					fs.readFileSync("./data/products.json").toString()
				);
				io.emit("products", products);
			}

			lastModification = stats.mtime;
		});
	}, 1000);
});

module.exports = router;
