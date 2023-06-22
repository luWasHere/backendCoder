const fs = require("fs");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const handlebars = require("express-handlebars");

const db = require("./daos/mongo/db");

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
const routeChat = require("./routes/chat");
const routeViewProducts = require("./routes/viewProducts");

app.use("/api/carts", routeCarts);
app.use("/api/products", routeProducts);
app.use("/home", routeHome);
app.use("/chat", routeChat);
app.use("/products", routeViewProducts);

let messages = [];
// socket on
io.on("connection", (socket) => {
	console.log("socket user on");

	let products = JSON.parse(fs.readFileSync("data/products.json").toString());
	socket.emit("products", products);

	socket.on("newMsg", (msg) => {
		messages.push(msg);
		io.sockets.emit("allMsgs", messages);
	});
});

server.listen("8080", () => {
	console.log("Server running");
	db.connect();
});
