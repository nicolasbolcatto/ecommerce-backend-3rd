import mongoose from "mongoose";
mongoose.set('strictQuery', false)

class ContainerMongoDB {

    constructor(URL) {
        this.URL = URL
    }

    async connect() {
        await mongoose.connect(this.URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }

    async insertItems(object) {
        this.connect()
        let count = await this.model.count()
        object.id = count + 1
        await this.model.create(object)
        return object.id
    }

    async getById(id) {
        this.connect()
        return await this.model.find({ id: id })
    }

    async getAll() {
        this.connect()
        return await this.model.find({})
    }

    async updateItemById(id, data) {
        this.connect()
        let filter = { id: id }
        return await this.model.findOneAndUpdate(filter, data)

    }

    async deleteById(id) {
        this.connect()
        return await this.model.deleteOne({ id: id })
    }

    async deleteAll() {
        this.connect()
        return await this.model.deleteMany({})
    }

    async addCart(userEmail) {
        this.connect()
        let count = await this.model.count()
        let id = count + 1
        return await this.model.create({ products: [], id: id, timestamp: new Date().toUTCString(), userEmail: userEmail })
    }

    async addItemToCart(item, idCart) {
        this.connect()
        let filter = { id: idCart }
        return await this.model.findOneAndUpdate(filter, { $push: { products: item[0] } })
    }

    async deleteItemFromCart(idProd, idCart) {
        this.connect()
        await this.model.updateOne({ id: idCart }, { $pull: { products: { id: idProd } } })
    }

    async modifyUserByEmail(email, data) {
        this.connect()
        let filter = { email: email }
        await this.model.findOneAndUpdate(filter, data)
    }

    disconnect() {
        mongoose.disconnect()
    }

}

export default ContainerMongoDB