import express from "express"
const { Router } = express
import passport from "passport"
import { consoleLogger, fileLogger } from "../../log/logger.js"

const routerLogin = new Router()
const routerFailLogin = new Router()

routerLogin.get("/", (req, res) => {

    const {url, method } = req
    consoleLogger.info(`Route = /login Method ${method}`)
    try {
        res.render("login")
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }
})

routerLogin.post("/", passport.authenticate("login", { failureRedirect: "/fail-login", successRedirect: "/api/productos" }), (req, res) => {

    const { method } = req
    consoleLogger.info(`Route = /login Method ${method}`)

})

routerFailLogin.get("/", (req, res) => {

    const {url, method } = req
    consoleLogger.info(`Route = /login-error Method ${method}`)

    try {
        res.render("login-error")
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }
})

export { routerLogin, routerFailLogin }