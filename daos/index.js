//import CartsDaoFileSystem from "./carts/CartsDaoFileSystem.js"
import CartsDaoMongoDB from "./carts/CartsDaoMongoDB.js"
//import CartsDaoFirebase from "./carts/CartsDaoFirebase.js"
//import CartsDaoMemory from "./carts/CartsDaoMemory.js"
//import ProductsDaoFileSystem from "./products/ProductsDaoFileSystem.js"
//import ProductsDaoFirebase from "./products/ProductsDaoFirebase.js"
import ProductsDaoMongoDB from "./products/ProductsDaoMongoDB.js"
//import ProductsDaoMemory from "./products/ProductsDaoMemory.js"
//import AuthMongoDao from "./users/UsersDaoMongoDB.js"
import UsersDaoMongoDB from "./users/UsersDaoMongoDB.js"

//Here the file system should be selected
export const daoProducts = new ProductsDaoMongoDB()
export const daoCarts = new CartsDaoMongoDB()
export const daoUsers = new UsersDaoMongoDB()

//Only for MongoDB
daoProducts.connect()
daoCarts.connect()
daoUsers.connect()