const express = require("express");
const { Router } = express;
const uuid4 = require("uuid4");

const router = new Router();

let users = [];

router.get("/", (req, res) => {
	res.send({ data: users });
});

router.post("/", (req, res) => {
	let user = req.body;
	let id = uuid4();
	users.push({ ...user, id });

	res.send("User saved!");
});

module.exports = router;
