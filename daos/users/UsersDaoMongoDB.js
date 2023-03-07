import ContainerMongoDB from "../../containers/ContainerMongoDB.js"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config({
    path: "./keys.env"
})

class UsersDaoMongoDB extends ContainerMongoDB {
    constructor() {
        super(process.env.MONGO_DB)
        this.model = this.createModel()
    }

    createModel() {
        let schemaStructure = {
            email: { type: String, required: true },
            hash: { type: String, required: true },
            name: { type: String, required: true },
            address: { type: String, required: true },
            age: { type: Number, required: true },
            phone: { type: Number, required: true },
            avatarUrl: { type: String, required: true }
        }
        let schema = new mongoose.Schema(schemaStructure)
        return mongoose.model("users", schema)
    }
}

export default UsersDaoMongoDB