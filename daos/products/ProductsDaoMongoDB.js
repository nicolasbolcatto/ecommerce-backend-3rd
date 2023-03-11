import ContainerMongoDB from "../../containers/ContainerMongoDB.js"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config({
    path: "./keys.env"
})

class ProductsDaoMongoDB extends ContainerMongoDB {
    constructor() {
        super(process.env.MONGO_DB)
        this.model = this.createModel()
    }

    createModel() {
        let schemaStructure = {
            category: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            description: { type: String, required: true },
            standards: { type: String },
            unit: { type: String, required: true },
            url: { type: String, required: true },
            result: { type: String, required: true },
            materialRequired: { type: String },
            stock: { type: Number, required: true },
            timestamp: { type: String, required: true },
            code: { type: String, required: true },
            id: {type: Number, required: true}
        }
        let schema = new mongoose.Schema(schemaStructure)
        return mongoose.model("productos", schema)
    }
}

export default ProductsDaoMongoDB