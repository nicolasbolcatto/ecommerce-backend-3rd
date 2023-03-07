import express from "express"
const { Router } = express
import passport from "passport"
import { consoleLogger, fileLogger } from "../../log/logger.js"

const routerRegister = new Router()
const routerFailRegister = new Router()

routerRegister.get("/", (req, res) => {

    const { method } = req
    consoleLogger.info(`Route = /register Method ${method}`)

    try {
        res.render("register")
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }
})

routerRegister.post("/", passport.authenticate("register", { failureRedirect: "/fail-register", successRedirect: "/" }), (req, res) => {
    const { url, method } = req
    try {
        consoleLogger.info(`Route = /register Method ${method}`)
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }
    
})

routerFailRegister.get("/", (req, res) => {

    const { url, method } = req
    consoleLogger.info(`Route /register-error Method ${method}`)

    try {
        res.render("register-error")
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }
})

export { routerRegister, routerFailRegister }