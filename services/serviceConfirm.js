import { daoCarts, daoUsers } from "../daos/index.js"
import {fileLogger} from "../log/logger.js"

async function serviceConfirmPost(email){
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
                const phoneString = "whatsapp:+" + currentUser.phone.toString()
                return {emailSender,emailReceiver,passwordSender,currentUser,phoneString, currentCart}
            })
        })
        }
    catch (error) {
            fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
        }
}

export {serviceConfirmPost}

