import express from "express"
import passport from "passport"
import { controllerRegisterGet,controllerRegisterPost,controllerRegisterFailGet } from "../../controllers/auth/controllerRegister.js"

const { Router } = express
const routerRegister = new Router()
const routerFailRegister = new Router()
routerRegister.get("/", controllerRegisterGet)
routerRegister.post("/", passport.authenticate("register", { failureRedirect: "/fail-register", successRedirect: "/" }), controllerRegisterPost)
routerFailRegister.get("/", controllerRegisterFailGet)

export { routerRegister, routerFailRegister }