import { consoleLogger, fileLogger } from "../../log/logger.js"

async function controllerRegisterGet(req,res){
    const { method } = req
    consoleLogger.info(`Route = /register Method ${method}`)
    try {
        res.render("register")
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }
}

async function controllerRegisterPost(req,res){
    const { url, method } = req
    try {
        consoleLogger.info(`Route = /register Method ${method}`)
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }
}

async function controllerRegisterFailGet(req,res){
    const { url, method } = req
    consoleLogger.info(`Route /register-error Method ${method}`)
    try {
        res.render("register-error")
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }
}

export{controllerRegisterGet,controllerRegisterPost,controllerRegisterFailGet}