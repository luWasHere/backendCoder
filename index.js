const fs = require("fs");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const handlebars = require("express-handlebars");

app.use(express.json());
app.use(express.static(__dirname + "/public"));

// socket
const { Server } = require("socket.io");
const io = new Server(server);
module.exports = io;

// views
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

// routes
const routeCarts = require("./routes/carts");
const routeProducts = require("./routes/products");
const routeHome = require("./routes/home");
const routeRealTimeProducts = require("./routes/realTimeProducts");

app.use("/api/carts", routeCarts);
app.use("/api/products", routeProducts);
app.use("/home", routeHome);
app.use("/realtimeproducts", routeRealTimeProducts);

// socket on
io.on("connection", (socket) => {
	console.log("user on");
	let products = JSON.parse(fs.readFileSync("data/products.json").toString());

	socket.emit("products", products);
});

server.listen("8080", () => {
	console.log("Server running");
});
