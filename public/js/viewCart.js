const cartContainer = document.getElementById("cartContainer");

(async () => {
	let data;
	let url = window.location.href;
	let urlArray = url.split("/");
	let cid = urlArray[4];

	console.log(cid);

	await fetch(`http://localhost:8080/api/carts/${cid}`)
		.then((res) => res.json())
		.then((d) => {
			data = d.data;
		})
		.catch((error) => {
			console.error("Error en la solicitud:", error);
		});

	let html;

	(() => {
		let array = [];

		data.products.forEach((p) => {
			array.push(
				`<div class="cartProduct"><h3>${p.product.title}</h3><h3>$${p.product.price}</h3><div><p>quantity: ${p.quantity}</p></div></div>`
			);
		});

		html = array.join("");
	})();

	cartContainer.innerHTML = html;
})();
