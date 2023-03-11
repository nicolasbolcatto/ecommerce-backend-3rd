import { serviceProfileGet, serviceProfileChangeAvatar } from "../services/serviceProfile.js"
import { consoleLogger, fileLogger } from "../log/logger.js"

async function controllerProfileGet(req,res){
    const {url,method} = req
    consoleLogger.info(`Route = ${url} Method ${method}`)
    const email = req.session.passport.user
    try {
        const {currentUser,currentCart} = await serviceProfileGet(email)
        console.log(currentUser)
        console.log(currentCart)
        res.render("profile", {
            email: currentUser.email,
            name: currentUser.name,
            address: currentUser.address,
            age: currentUser.age,
            phone: currentUser.phone,
            avatarUrl: currentUser.avatarUrl,
            cartId: `/api/carritos/${currentCart.id}/productos`
        })
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }
     
}

async function controllerProfileChangeAvatar(req,res){
    const {url, method} = req
    consoleLogger.info(`Route = ${url} Method ${method}`)
    try {
        const file = req.file
        const email = req.session.passport.user
        if (!file) {
            const error = new Error("Error, no se pudo subir el archivo")
            fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
            res.send(error)
        }
        serviceProfileChangeAvatar(file, email) 
        res.redirect("/profile")
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }

    
}

export {controllerProfileGet,controllerProfileChangeAvatar}