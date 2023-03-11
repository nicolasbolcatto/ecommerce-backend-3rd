import express from "express"
import passport from "passport"
import { controllerLoginGet, controllerLoginPost, controllerLoginFailGet } from "../../controllers/auth/controllerLogin.js"

const { Router } = express
const routerLogin = new Router()
const routerFailLogin = new Router()
routerLogin.get("/", controllerLoginGet)
routerLogin.post("/", passport.authenticate("login", { failureRedirect: "/fail-login", successRedirect: "/api/productos" }), controllerLoginPost)
routerFailLogin.get("/", controllerLoginFailGet)

export { routerLogin, routerFailLogin }