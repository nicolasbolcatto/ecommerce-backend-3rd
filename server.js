import express from "express"
import session from 'express-session'
import MongoStore from "connect-mongo"
import cookieParser from "cookie-parser"
import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import os from "os"
import cluster from "cluster"
import { consoleLogger, fileLogger } from "./log/logger.js"
import { routerProducts } from "./routes/routerProducts.js"
import { routerCarts } from "./routes/routerCarts.js"
import { routerLogin, routerFailLogin } from "./routes/auth/login.js"
import { routerFailRegister, routerRegister } from "./routes/auth/register.js"
import { routerProfile } from "./routes/routerProfile.js"
import {routerConfirm} from "./routes/routerConfirm.js"
import { daoUsers, daoCarts } from "./daos/index.js"
import { requireAuthentication } from "./controllers/auth/controllerRequireAuth.js" 
import { sendMailRegister } from "./messages.js"

//Get enviroment variables
dotenv.config({
    path: "./keys.env"
})

//Start express app
const app = express()

//Configure app
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//Create session
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_DB,
        mongoOptions: advancedOptions,
        ttl: 300,
        autoRemove: "native"
    }),
    secret: process.env.SESSION_PASSWORD,
    resave: false,
    saveUninitialized: false
}))

//Create template engine
app.set("view engine", "hbs");
app.set("views", "./public/views")

//Indicate static files in public folder
app.use(express.static("./public"))


//-------------------------------------------------------------------------
//AUTH STRATEGIES
app.use(passport.initialize())
app.use(passport.session())

//Get data
async function getData() {
    return await daoUsers.getAll()
}

passport.use("register", new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'emailId',
    passwordField: 'password'
    }, (req, email, password, done) => {

    //Get request body
    const name = req.body.title
    const address = req.body.address
    const age = req.body.age
    const phone = req.body.phone
    const avatarUrl = `../assets/users/avatar.png`

    getData().then((users) => {
        const currentUser = users.find(user => user.email == email)

        if (currentUser) {
            return done(null, false)
        }

        const cart = daoCarts.addCart(email)
        const cartId = cart.id

        //Encrypt password
        const saltRounds = 10;

        bcrypt.hash(password, saltRounds, function(err, hash) {
            const newUser = {
                email,
                hash,
                name,
                address,
                age,
                phone,
                avatarUrl,
                cartId
            }
            daoUsers.insertItems(newUser)


            const emailSender = process.env.EMAIL_ADDRESS_SENDER
            const passwordSender = process.env.EMAIL_PASSWORD_SENDER
            const emailReceiver = process.env.EMAIL_ADMIN

            sendMailRegister(emailSender, passwordSender,emailReceiver, newUser)

            done(null, newUser)
        });
    })
}))

passport.use("login", new LocalStrategy({
    usernameField: 'emailId',
    passwordField: 'password'
}, (email, password, done) => {
    getData().then((users) => {

        const currentUser = users.find(user => user.email == email)
        if (!currentUser) {
            return done(null, false)
        }

        bcrypt.compare(password, currentUser.hash, function(err, result) {
            if (result) {
                return done(null, currentUser)
            } else {
                return done(null, false)
            }
        });

    })
}))

passport.serializeUser((err, user, done) => {
    //console.log(err)
    done(null, user.email)
})

passport.deserializeUser((err, email, done) => {
    //console.log(err)
    getData().then((users) => {
        const currentUser = users.find(user => user.email == email)
        done(null, currentUser)
    })
})

//----------------------------------------ROUTES

app.get("/", (req, res) => {
    const { url, method } = req
    consoleLogger.info(`Route = ${url} Method ${method}`)
    try {
        res.redirect("/login")
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }

})

app.use("/login", routerLogin)

app.use("/fail-login", routerFailLogin)

app.use("/register", routerRegister)

app.use("/fail-register", routerFailRegister)

app.use("/confirm-order", routerConfirm)

app.get("/bye", (req, res) => {
    const { url, method } = req
    consoleLogger.info(`Route = ${url} Method ${method}`)
    try {
        setTimeout(() => {
            res.redirect("/login")
        }, 2000)
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }
})

app.get("/confirm-success", (req,res) =>{
    try {
        setTimeout(() => {
            res.redirect("/api/productos")
        }, 2000)
    } catch (error) {
        fileLogger.warn(`Error en ruta ${method} ${url}: ${error}`)
    }
})

app.use("/profile", routerProfile)
app.use("/api/productos", routerProducts)
app.use("/api/carritos", routerCarts)

app.get('*', requireAuthentication, (req, res) => {
    const { url, method } = req
    fileLogger.warn(`Ruta ${method} ${url} no esta implementada`)
    res.send(`Ruta ${method} ${url} no esta implementada`)
})

//-------------------------------------------------------------------------

//Select mode FORK or CLUSTER and run server

const PORT = process.env.PORT || 8080
const MODE = "FORK"

if (MODE == "FORK" || undefined) {
    //Start listening to server in FORK mode
    app.listen(PORT, () => {
        console.log(`Server listening in port ${PORT} in mode ${MODE}`)
    })

    //Indicate error if server fails
    app.on("error", error => console.log(`Error on server: ${error}`))

} else if (MODE == "CLUSTER") {

    const numCPUs = os.cpus().length
    if (cluster.isPrimary) {

        for (let i = 0; i < numCPUs; i++) {
            cluster.fork()
        }

        cluster.on("exit", worker => {
            console.log(`Worker ${worker.process.pid} died: ${new Date().toLocaleString()}`)
            cluster.fork
        })
    } else {

        //Start listening to server in CLUSTER mode

        app.listen(PORT, () => {
            console.log(`Server listening in port ${PORT} in mode ${MODE}`)
        })

        //Indicate error if server fails
        app.on("error", error => {
          
            fileLogger.warn(`Server error: ${error}`)
            console.log(`Error on server: ${error}`)

        })
    }
}