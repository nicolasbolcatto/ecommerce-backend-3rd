import { consoleLogger, fileLogger } from "../log/logger.js"
import { createCart, deleteCart,getProductsInCart, addProductToCart, deleteProductFromCart } from "../services/serviceCarts.js"

async function controllerCreateCart(req,res){
    try {
        const { url, method } = req
        consoleLogger.info(`Route = ${url} Method ${method}`)
        const cart = await createCart()
        cart.userEmail = req.session.passport.user
        res.json({ added: await cart })

    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }
}

async function controllerDeleteCart(req,res){
    const { url, method } = req
    consoleLogger.info(`Route = ${url} Method ${method}`)
        try {
            const { id } = req.params
            const cart = await deleteCart(id)
            res.json({ deleted: cart })

        } catch (error) {
            fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
        }
}

async function controllerGetProductsInCart(req,res){
    const { url, method } = req
    consoleLogger.info(`Route = ${url} Method ${method}`)
    try {
        const { id } = req.params
        const products = await getProductsInCart(id)
        res.render("cart", { cart: products })
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }
}

async function controllerAddProductToCart(req,res){
    const { url, method } = req
    consoleLogger.info(`Route = ${url} Method ${method}`)
    try {
        const params = req.params
        const idCart = Number(params.id)
        const idProd = Number(params.id_prod)
        const response = await addProductToCart(idProd,idCart)
        res.json(response)

    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }
}

async function controllerDeleteProductFromCart(req,res){
    const { url, method } = req
    consoleLogger.info(`Route = ${url} Method ${method}`)
    try {
        const params = req.params
        const idCart = Number(params.id)
        const idProd = Number(params.id_prod)
        const response = await deleteProductFromCart(idProd,idCart)
        res.json(response)
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }
}

export {
    controllerCreateCart,
    controllerDeleteCart,
    controllerGetProductsInCart,
    controllerAddProductToCart, 
    controllerDeleteProductFromCart}