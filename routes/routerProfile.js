import express from "express"
const { Router } = express
import { daoCarts, daoUsers } from "../daos/index.js"
import { v4 as uuidv4 } from 'uuid';
import { requireAuthentication } from "./auth/require-auth.js"
import { consoleLogger, fileLogger } from "../log/logger.js"
import multer from "multer";

//Create router

const routerProfile = Router()

//GET Profile

routerProfile.get("/", requireAuthentication, (req, res) => {

    const {url,method} = req
    consoleLogger.info(`Route = ${url} Method ${method}`)

    const email = req.session.passport.user
    try {
    //Get data
    async function getData() {
        return await daoUsers.getAll()
    }

    async function getCarts() {
        return await daoCarts.getAll()
    }

    getCarts().then((carts) => {
        const currentCart = carts.find(cart => cart.userEmail == email)
        const cartId = currentCart.id

        getData().then((users) => {

            const currentUser = users.find(user => user.email == email)
            res.render("profile", {
                email: currentUser.email,
                name: currentUser.name,
                address: currentUser.address,
                age: currentUser.age,
                phone: currentUser.phone,
                avatarUrl: currentUser.avatarUrl,
                cartId: `/api/carritos/${cartId}/productos`
            })
        })
    })
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }   

})

//POST avatar image

//Config multer

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/assets/users")
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}--${uuidv4()}-${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

routerProfile.post("/", requireAuthentication, upload.single("avatar"), (req, res) => {
    const {url, method} = req

    consoleLogger.info(`Route = ${url} Method ${method}`)

    const file = req.file
    if (!file) {
        const error = new Error("Error, no se pudo subir el archivo")
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
        res.send(error)
    }

    const avatarUrl = `./assets/users/${ file.filename }`

    async function getData() {
        return await daoUsers.getAll()
    }

    async function modifyData() {
        const email = req.session.passport.user
        getData().then((users) => {
            const currentUser = users.find(user => user.email == email)
            currentUser.avatarUrl = avatarUrl
            daoUsers.modifyUserByEmail(email, currentUser)
        })

    }
    modifyData()

    res.redirect("/profile")

})

export { routerProfile }