import express from "express"
import { requireAuthentication } from "../controllers/auth/controllerRequireAuth.js";
import { controllerProductsGet,controllerProductsPost,controllerProductsPut,controllerProductsDelete } from "../controllers/controllerProducts.js";

const { Router } = express
const routerProducts = Router()
routerProducts.get("/:id?", requireAuthentication, controllerProductsGet)
routerProducts.post("/", requireAuthentication, controllerProductsPost)
routerProducts.put("/:id", requireAuthentication, controllerProductsPut)
routerProducts.delete("/:id", requireAuthentication, controllerProductsDelete)

export { routerProducts }