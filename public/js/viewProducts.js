const nextPage = document.getElementById("nextPage");
const prevPage = document.getElementById("prevPage");
const actualPage = document.getElementById("actualPage");
const productsContainer = document.getElementById("productsContainer");
const cidContainer = document.getElementById("cartId");
const cartBtn = document.getElementById("cartBtn");
let cid = null;

const addToCart = async (pid) => {
	if (cid) {
		await fetch(`http://localhost:8080/api/carts/${cid}/product/${pid}`, {
			method: "POST",
		})
			.then((res) => {
				return res.json();
			})
			.then((resData) => {
				console.log(resData);
				alert(resData.msg);
			})
			.catch((err) => console.log(err));
	} else {
		await fetch(`http://localhost:8080/api/carts`, { method: "POST" })
			.then((res) => {
				return res.json();
			})
			.then((resData) => {
				cidContainer.innerHTML = resData.data["_id"].toString();
				cid = resData.data["_id"].toString();
			})
			.catch((err) => console.log(err));
		await fetch(`http://localhost:8080/api/carts/${cid}/product/${pid}`, {
			method: "POST",
		})
			.then((res) => {
				return res.json();
			})
			.then((resData) => {
				console.log(resData);
				alert(resData.msg);
			})
			.catch((err) => console.log(err));
	}
	cartBtn.setAttribute("href", `http://localhost:8080/cart/${cid}`);
	cartBtn.setAttribute("style", `display: flex`);
};

(async () => {
	let data;
	let actualLink = "http://localhost:8080/api/products?limit=3&page=1";

	await fetch(actualLink)
		.then((res) => res.json())
		.then((d) => {
			data = d.data;
		})
		.catch((error) => {
			console.error("Error en la solicitud:", error);
		});

	console.log(data);

	const renderProducts = (prods) => {
		let productsOnPage = prods;

		let html = [];

		productsOnPage.forEach((p) => {
			html.push(`
            <span class="product" id=${p["_id"].toString()}>
                <div>
                <P>${p.title}</P>       
                </div>
                <div>
                <P>$${p.price}</P>       
                </div>
                <div>
                <button
                style="cursor:pointer"
                onclick="addToCart('${p["_id"].toString()}')">agregar</button>
                </div>            
            </span>
            `);
		});

		productsContainer.innerHTML = html.join("");
		actualPage.innerHTML = `${data.page}`;
	};
	renderProducts(data.docs);

	nextPage.addEventListener("click", async (c) => {
		if (data.hasNextPage === true) {
			actualLink = actualLink.slice(0, -1) + `${data.nextPage}`;
		}
		await fetch(actualLink)
			.then((res) => res.json())
			.then((d) => {
				data = d.data;
			})
			.catch((error) => {
				console.error("Error en la solicitud:", error);
			});
		renderProducts(data.docs);
	});

	prevPage.addEventListener("click", async (c) => {
		if (data.hasPrevPage === true) {
			actualLink = actualLink.slice(0, -1) + `${data.prevPage}`;
		}
		await fetch(actualLink)
			.then((res) => res.json())
			.then((d) => {
				data = d.data;
			})
			.catch((error) => {
				console.error("Error en la solicitud:", error);
			});
		renderProducts(data.docs);
	});
})();
