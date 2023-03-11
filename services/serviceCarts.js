import { daoCarts, daoProducts } from "../daos/index.js"
import { fileLogger } from "../log/logger.js"

async function createCart(){
    try {
        return daoCarts.addCart()
    } catch (error) {
        fileLogger.warn(`Error en la función createCart`)
    }
    
}

async function deleteCart(id){
    try {
        return await daoCarts.deleteById(Number(id))
    } catch (error) {
        fileLogger.warn(`Error en la función deleteCart`)
    }
    
}

async function getProductsInCart(id){
    try {
        const cart = await daoCarts.getById(Number(id))
        return cart[0].products 
    } catch (error) {
        fileLogger.warn(`Error en la función getProductsInCart`)
    }
    
}

async function addProductToCart(idProd,idCart) {
    try {
        let product = await daoProducts.getById(idProd)
        await daoCarts.addItemToCart(product, idCart)
        return { added: product, cartId: `${idCart}` }
    } catch (error) {
        fileLogger.warn(`Error en la función addProductToCart`)
    }
}

async function deleteProductFromCart(idProd,idCart) {
    try {
        await daoCarts.deleteItemFromCart(idProd, idCart)
        return { deletedIdProd: `${idProd}`, cartId: `${idCart}` }
    } catch (error) {
        fileLogger.warn(`Error en la función deleteProductFromCart`)
    }
}

export {createCart, deleteCart, getProductsInCart, addProductToCart, deleteProductFromCart}