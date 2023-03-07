import express from "express"
const { Router } = express
import { requireAuthentication } from "./auth/require-auth.js"
import { sendMailOrder, sendMessage } from "../messages.js"
import { consoleLogger, fileLogger } from "../log/logger.js"
import { daoCarts, daoUsers } from "../daos/index.js"

const routerConfirm = Router()

//POST order

routerConfirm.post("/", requireAuthentication, (req,res) => {

    const email = req.session.passport.user
    const {url, method} = req
    consoleLogger.info(`Route = ${url} Method ${method}`)


    try {
        async function getData() {
            return await daoUsers.getAll()
        }
    
        async function getCarts() {
            return await daoCarts.getAll()
        }
    
        getCarts().then((carts) => {
            const currentCart = carts.find(cart => cart.userEmail == email)
    
            getData().then((users) => {
    
                const currentUser = users.find(user => user.email == email)

                const emailSender = process.env.EMAIL_ADDRESS_SENDER
                const passwordSender = process.env.EMAIL_PASSWORD_SENDER
                const emailReceiver = email

                sendMailOrder(emailSender, passwordSender,emailReceiver, currentCart, currentUser)

                const phoneString = "whatsapp:+" + currentUser.phone.toString()
                sendMessage(currentUser, phoneString)

                res.redirect("/confirm-success")
                
            })
        })
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }

    
})

export { routerConfirm }