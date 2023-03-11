import express from "express"
import { controllerProfileGet, controllerProfileChangeAvatar } from "../controllers/controllerProfile.js";
import { requireAuthentication } from "../controllers/auth/controllerRequireAuth.js";
import multer from "multer";
import { v4 as uuidv4 } from 'uuid';

const { Router } = express
const routerProfile = Router()
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/assets/users")
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}--${uuidv4()}-${file.originalname}`)
    }
})
const upload = multer({ storage: storage })
routerProfile.get("/", requireAuthentication, controllerProfileGet)
routerProfile.post("/", requireAuthentication, upload.single("avatar"), controllerProfileChangeAvatar)

export { routerProfile }