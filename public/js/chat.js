console.log("chat js on");

const socket = io();

socket.on("allMsgs", (messages) => {
	renderMsgs(messages);
});

const addMsg = () => {
	const msg = {
		author: document.getElementById("username").value,
		text: document.getElementById("text").value,
	};

	socket.emit("newMsg", msg);
	return false;
};

const renderMsgs = (data) => {
	const html = data
		.map((e) => {
			return `
        <div>
            <p><strong>${e.author}</strong> ${e.text}</p>
        </div>
        `;
		})
		.join(" ");

	document.getElementById("chatContainer").innerHTML = html;
};
