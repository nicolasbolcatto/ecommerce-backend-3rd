import express from "express"
const { Router } = express
import { daoCarts, daoProducts } from "../daos/index.js"
import { v4 as uuidv4 } from 'uuid';
import { requireAuthentication } from "./auth/require-auth.js"
import { consoleLogger, fileLogger } from "../log/logger.js"

//Create boolean variable for administrator rights and assign true
let administrador = true

//Create routers

const routerProducts = Router()

//GET specific product by id or every product
routerProducts.get("/:id?", requireAuthentication, (req, res) => {
    const { id } = req.params

    const { url, method } = req
    consoleLogger.info(`Route = ${url} Method ${method}`)

    const userEmail = req.session.passport.user

    async function get() {
        const carts = await daoCarts.getAll()
        const currentCart = carts.find(cart => cart.userEmail == userEmail)
        const cartId = currentCart.id
        try {
            if (id === undefined) {
                let items = await daoProducts.getAll()
                items.forEach(item => {
                    item.url = "../../assets/products/" + item.url
                })
                res.render("products", { items: items, cartId: `/api/carritos/${cartId}/productos` })
            } else {
                try {
                    let item = await daoProducts.getById(Number(id))
                    if (item == null) {
                        res.send("Product not found")
                    } else {
                        item[0].url = "../../assets/products/" + item[0].url
                        res.render("products", { items: item })
                    }

                } catch (error) {
                    fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
                }
            }
        } catch (error) {
            fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
        }
    }

    get()

})

//POST new product
routerProducts.post("/", requireAuthentication, (req, res) => {

    const { url, method } = req
    consoleLogger.info(`Route = ${url} Method ${method}`)

    async function pushProduct() {
        try {
            const product = {
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                foto: req.body.foto,
                precio: req.body.precio,
                stock: req.body.stock,
                timestamp: new Date().toUTCString(),
                codigo: uuidv4()
            }
            const productId = await daoProducts.insertItems(product)
            product.id = productId
            res.json({ added: product, assignedId: productId })
        } catch (error) {
            fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
        }
    }

    if (!administrador) {
        res.json({ error: -1, descripcion: "Ruta /api/carritos método POST no autorizada" })
        return
    }

    pushProduct()
})

//PUT change details of specific product by id
routerProducts.put("/:id", requireAuthentication, (req, res) => {

    const { url, method } = req
    consoleLogger.info(`Route = ${url} Method ${method}`)

    async function editProduct() {
        try {
            let { id } = req.params
            const data = req.body
            let updatedItem = await daoProducts.updateItemById(Number(id), data)
            res.json({ updated: updatedItem })


        } catch (error) {
            fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
        }
    }

    if (!administrador) {
        res.json({ error: -1, descripcion: `Ruta /api/carritos/${id} método PUT no autorizada` })
        return
    }

    editProduct()
})

//DELETE product by id
routerProducts.delete("/:id", requireAuthentication, (req, res) => {

    const { url, method } = req
    consoleLogger.info(`Route = ${url} Method ${method}`)

    const { id } = req.params

    async function deleteProduct() {
        try {

            const deletedItem = await daoProducts.deleteById(Number(id))

            res.json({ deleted: deletedItem })
        } catch (error) {
            const fileLogger = buildFileLogger()
            fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
        }
    }

    if (!administrador) {
        res.json({ error: -1, descripcion: `Ruta /api/carritos/${id} método DELETE no autorizada` })
        return
    }
    deleteProduct()
})

export { routerProducts }