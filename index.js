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
const routeRealTimeProducts = require("./routes/realTimeProducts");
const routeChat = require("./routes/chat");

app.use("/api/carts", routeCarts);
app.use("/api/products", routeProducts);
app.use("/home", routeHome);
app.use("/realtimeproducts", routeRealTimeProducts);
app.use("/chat", routeChat);

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
