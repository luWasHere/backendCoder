const fs = require("fs");

class FSManager {
	constructor(filePath) {
		this.filePath = filePath;
	}

	get(limit) {
		try {
			const jsonData = fs.readFileSync(this.filePath, "utf8");
			const objects = JSON.parse(jsonData);

			if (limit) {
				return objects.slice(0, limit);
			}

			return objects;
		} catch (error) {
			console.error("Error reading file:", error);
			return [];
		}
	}

	getById(id) {
		try {
			const jsonData = fs.readFileSync(filePath, "utf8");
			const objects = JSON.parse(jsonData);
			return objects.find((object) => object.id === id);
		} catch (error) {
			console.error("Error reading file:", error);
			return null;
		}
	}

	add(object) {
		const objects = this.get();
		objects.push(object);
		this.writeData(objects);
	}

	delete(id) {
		let objects = this.get();
		objects = objects.filter((object) => object.id !== id);
		this.writeData(objects);
	}

	update(id, updatedObject) {
		let objects = this.get();
		objects = objects.map((object) => {
			if (object.id === id) {
				return { ...object, ...updatedObject };
			}
			return object;
		});
		this.writeData(objects);
	}
}

module.exports = FSManager;
