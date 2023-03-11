import { daoCarts, daoUsers } from "../daos/index.js"
import { fileLogger } from "../log/logger.js"

async function serviceProfileGet(email){
    try {
        const carts = await daoCarts.getAll()
        const users = await daoUsers.getAll()
        const currentCart = carts.find(cart => cart.userEmail == email)
        const currentUser = users.find(user => user.email == email)
        return {currentUser,currentCart}
    } catch (error) {
        fileLogger.warn(`Error en la función serviceProfileGet`)
    }
}

async function serviceProfileChangeAvatar(file,email){
    try {
        const avatarUrl = `./assets/users/${ file.filename }`
        async function getData() {
            return await daoUsers.getAll()
        }
        getData().then((users) => {
            const currentUser = users.find(user => user.email == email)
            currentUser.avatarUrl = avatarUrl
            daoUsers.modifyUserByEmail(email, currentUser)
        }) 
    } catch (error) {
        fileLogger.warn(`Error en la función serviceProfileChangeAvatar`)
    }
    
}

export {serviceProfileGet,serviceProfileChangeAvatar}