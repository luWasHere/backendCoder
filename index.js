const express = require("express");
const app = express();

app.use(express.json());
app.use("/static", express.static(__dirname + "public"));

const routeUsers = require("./routes/users");
const routeCarts = require("./routes/carts");
const routeProducts = require("./routes/products");

app.use("/api/users", routeUsers);
app.use("/api/carts", routeCarts);
app.use("/api/products", routeProducts);

app.listen("8080", () => {
	console.log("Server running");
});
