import { consoleLogger, fileLogger } from "../../log/logger.js"

async function controllerLoginGet(req,res){
    const {url, method } = req
    consoleLogger.info(`Route = /login Method ${method}`)
    try {
        res.render("login")
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }
}

async function controllerLoginPost(req,res){
    const { method } = req
    consoleLogger.info(`Route = /login Method ${method}`)
}

async function controllerLoginFailGet(req,res){
    const {url, method } = req
    consoleLogger.info(`Route = /login-error Method ${method}`)
    try {
        res.render("login-error")
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }
}

export {controllerLoginGet, controllerLoginPost, controllerLoginFailGet}