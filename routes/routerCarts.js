import express from "express"
import { daoCarts } from "../daos/index.js"
import { daoProducts } from "../daos/index.js"
const { Router } = express
import { requireAuthentication } from "./auth/require-auth.js"
import { consoleLogger, fileLogger } from "../log/logger.js"

//Create routers

const routerCarts = Router()

//Create API connections

//POST new cart
routerCarts.post("/", requireAuthentication, (req, res) => {
    async function pushCart() {
        try {
            const { url, method } = req
            consoleLogger.info(`Route = ${url} Method ${method}`)
            const cart = daoCarts.addCart()
            cart.userEmail = req.session.passport.user

            res.json({ added: await cart })

        } catch (error) {
            fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
        }
    }

    pushCart()
})

//DELETE cart by id
routerCarts.delete("/:id", requireAuthentication, (req, res) => {

    const { url, method } = req
    consoleLogger.info(`Route = ${url} Method ${method}`)

    async function deleteCart() {
        try {

            const { id } = req.params
            const cart = await daoCarts.deleteById(Number(id))
            res.json({ deleted: cart })

        } catch (error) {
            fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
        }
    }

    deleteCart()
})

//GET products in cart
routerCarts.get("/:id/productos", requireAuthentication, (req, res) => {
    const { url, method } = req
    consoleLogger.info(`Route = ${url} Method ${method}`)
    async function getCart() {
        try {
            const { id } = req.params
            const cart = await daoCarts.getById(Number(id))
            const products = cart[0].products
            res.render("cart", { cart: products })
        } catch (error) {
            fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
        }

    }
    getCart()

})

//POST products in cart
routerCarts.post("/:id/productos/:id_prod", requireAuthentication, (req, res) => {
    const { url, method } = req
    consoleLogger.info(`Route = ${url} Method ${method}`)
    try {
        const params = req.params
        const idCart = Number(params.id)
        const idProd = Number(params.id_prod)
        async function postProductToCart() {
            let product = await daoProducts.getById(idProd)
            daoCarts.addItemToCart(product, idCart)
            res.json({ added: product, cartId: `${idCart}` })
        }
        postProductToCart()

    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }
})

//DELETE products in cart
routerCarts.delete("/:id/productos/:id_prod", requireAuthentication, (req, res) => {

    const { url, method } = req
    consoleLogger.info(`Route = ${url} Method ${method}`)
    try {
        const params = req.params
        const idCart = Number(params.id)
        const idProd = Number(params.id_prod)

        async function deleteProductFromCart() {
            try {
                let response = await daoCarts.deleteItemFromCart(idProd, idCart)
                res.json({ deletedIdProd: `${idProd}`, cartId: `${idCart}` })
            } catch (error) {
                fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
            }
        }
        deleteProductFromCart()

    } catch (error) {

        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }

})

export { routerCarts }