import ContainerMongoDB from "../../containers/ContainerMongoDB.js"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config({
    path: "./keys.env"
})

class CartsDaoMongoDB extends ContainerMongoDB {
    constructor() {
        super(process.env.MONGO_DB)
        this.model = this.createModel()
    }

    createModel() {
        let schemaStructure = {
            products: { type: Object, required: true },
            id: { type: Number, required: true },
            timestamp: { type: String, required: true },
            userEmail: { type: String }
        }
        let schema = new mongoose.Schema(schemaStructure)
        return mongoose.model("carritos", schema)
    }

}

export default CartsDaoMongoDB