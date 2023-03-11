import { serviceProductsGetAll,serviceProductsGetOne, serviceProductsCreateProduct,serviceProductsModifyProduct,serviceProductsDeleteProduct } from "../services/serviceProducts.js"
import { v4 as uuidv4 } from 'uuid';
import { consoleLogger, fileLogger } from "../log/logger.js"

//Create boolean variable for administrator rights and assign true
let administrador = true

async function controllerProductsGet(req,res){
    const { id } = req.params
    const { url, method } = req
    consoleLogger.info(`Route = ${url} Method ${method}`)
    const userEmail = req.session.passport.user
    if (id === undefined) {
        const {items,cartId} = await serviceProductsGetAll(userEmail)
        res.render("products", { items: items, cartId: `/api/carritos/${cartId}/productos` })
    } else {
        try {
            const item = await serviceProductsGetOne(id)
            if (item[0] == null) {
                res.send("Product not found")
            } else {
                const {items,cartId} = await serviceProductsGetAll(userEmail)
                item[0].url = "../../assets/products/" + item[0].url
                res.render("products", { items: item, cartId: `/api/carritos/${cartId}/productos` })
            }
        } catch (error) {
            fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
        }
    }  
}

async function controllerProductsPost(req,res){
    const { url, method } = req
    consoleLogger.info(`Route = ${url} Method ${method}`)
    if (!administrador) {
        res.json({ error: -1, descripcion: "Ruta /api/carritos método POST no autorizada" })
        return
    }
    try {
        req.body.timestamp = new Date().toUTCString()
        req.body.code = uuidv4()
        const productId = await serviceProductsCreateProduct(req.body)
        req.body.id = productId
        res.json({ added: req.body, assignedId: productId })
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }
}

async function controllerProductsPut(req,res){
    if (!administrador) {
        res.json({ error: -1, descripcion: `Ruta /api/carritos/${id} método PUT no autorizada` })
        return
    }
    const { url, method } = req
    consoleLogger.info(`Route = ${url} Method ${method}`)
        try {
            let { id } = req.params
            const data = req.body
            let updatedItem = await serviceProductsModifyProduct(id,data)
            res.json({ updated: updatedItem })
        } catch (error) {
            fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
        }
}

async function controllerProductsDelete(req,res){
    const { url, method } = req
    consoleLogger.info(`Route = ${url} Method ${method}`)
    const { id } = req.params
    if (!administrador) {
        res.json({ error: -1, descripcion: `Ruta /api/carritos/${id} método DELETE no autorizada` })
        return
    }
    try {
        const deletedItem = await serviceProductsDeleteProduct(id)
        res.json({ deleted: deletedItem })
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }  
}

export {controllerProductsGet,controllerProductsPost,controllerProductsPut,controllerProductsDelete}