class DBManager {
	constructor(objectModel) {
		this.objectModel = objectModel;
	}

	get(limit) {
		let query = this.objectModel.find();

		if (limit) {
			query = query.limit(limit);
		}

		return query
			.exec()
			.then((objects) => {
				return objects;
			})
			.catch((err) => {
				return err.message;
			});
	}

	getById(id) {
		return this.objectModel
			.findById(id)
			.exec()
			.then((object) => {
				if (!object) {
					return null;
				}
				return object;
			})
			.catch((err) => {
				return err.message;
			});
	}

	add(object) {
		const newObject = new this.objectModel(object);
		return newObject.save();
	}

	delete(id) {
		return this.objectModel.findOneAndDelete({ _id: id }).exec();
	}

	update(id, updatedObject) {
		return this.objectModel
			.findByIdAndUpdate(id, updatedObject, { new: true })
			.exec();
	}
}

module.exports = DBManager;
