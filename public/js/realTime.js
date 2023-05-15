let socket = io();
let rtpContainer = document.getElementById("realTimeProductsContainer");

const renderProducts = (data) => {
	let arr = [];
	data.forEach((p) => {
		arr.push(`
			<div class="product">
				<h2>${p.title}</h2>
				<h3>$${p.price}</h3>
				<p>${p.description}</p>
				<br>
			</div>
		`);
	});
	return arr.join(" ");
};

socket.on("products", (products) => {
	console.log(products);
	rtpContainer.innerHTML = renderProducts(products);
});
