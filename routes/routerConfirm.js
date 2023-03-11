import express from "express"
import { requireAuthentication } from "../controllers/auth/controllerRequireAuth.js"
import { controllerConfirmPost } from "../controllers/controllerConfirm.js"

const { Router } = express
const routerConfirm = Router()
routerConfirm.post("/", requireAuthentication, controllerConfirmPost)

export { routerConfirm }