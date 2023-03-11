import express from "express"
import { requireAuthentication } from "../controllers/auth/controllerRequireAuth.js"
import { controllerCreateCart, controllerDeleteCart, controllerGetProductsInCart,controllerAddProductToCart,controllerDeleteProductFromCart } from "../controllers/controllerCarts.js"

const { Router } = express
const routerCarts = Router()
routerCarts.post("/", requireAuthentication, controllerCreateCart)
routerCarts.delete("/:id", requireAuthentication, controllerDeleteCart)
routerCarts.get("/:id/productos", requireAuthentication, controllerGetProductsInCart)
routerCarts.post("/:id/productos/:id_prod", requireAuthentication, controllerAddProductToCart)
routerCarts.delete("/:id/productos/:id_prod", requireAuthentication, controllerDeleteProductFromCart)

export { routerCarts }