class DBManager {
	constructor(objectModel) {
		this.objectModel = objectModel;
	}

	get(limit = 10, page = 1, sort = null, query = null) {
		sort && (sort = [["price", `${sort}`]]);

		let petition = this.objectModel.paginate(
			{ ...query },
			{ limit, page, sort, query }
		);

		return petition
			.then((objects) => {
				return objects;
			})
			.catch((err) => {
				return err.message;
			});
	}

	getById(id, populate) {
		return this.objectModel
			.findById(id)
			.populate(populate)
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
