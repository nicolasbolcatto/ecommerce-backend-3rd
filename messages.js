import nodemailer from "nodemailer"
import dotenv from "dotenv"
import twilio from 'twilio'

dotenv.config();

//Email sending

export async function sendMailRegister(emailSender,passwordSender,emailReceiver,data){
    try {
        
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: emailSender,
                pass: passwordSender
            }
        });

        const emailContent = {
            from: `no-reply <ecommerce@no-reply.com>`,
            to: `<${emailReceiver}>`,
            subject: "New register",
            text: `A new user was successfully registered with the following data:
            E-mail: ${data.email}
            Name: ${data.title}
            Address: ${data.address}
            Phone: ${data.phone}
            Age: ${data.age}`,
        };
    
        return await transporter.sendMail(emailContent)

    } catch (error) {
        console.log(error)
    }
    
    
    
    
    

}

export async function sendMailOrder(emailSender,passwordSender,emailReceiver,currentCart,currentUser){
    try {
        
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: emailSender,
                pass: passwordSender
            }
        });

        
        const productList = currentCart.products.map(product => {
            return `<li class="mt-3"><b>${product.name}</b><p>${product.description}</p><b>Price: ${product.price}</b> </li>`
        })

        const emailContent = {
            from: `no-reply <ecommerce@no-reply.com>`,
            to: `<${emailReceiver}>`,
            subject: `Order confirmed for ${currentUser.name} - <${emailReceiver}>`,
            html: `Your order is confirmed and ready to be prepared with the following detail:
            <ul>${productList}</ul>`,
        };
    
        return await transporter.sendMail(emailContent)


    } catch (error) {
        console.log(error)
    }
    
    
    
    
    

}

//Message sending

export async function sendMessage(currentUser, phone){
    const accountSid = process.env.TWILIO_ACCOUNT
    const authToken = process.env.TWILIO_TOKEN
    
    const client = twilio(accountSid, authToken)
    
    try {
       const message = await client.messages.create({
          body: `Hi ${currentUser.name}! Your order has been confirmed with your email address: <${currentUser.email}> and is ready to be prepared`,
          from: "whatsapp:+14155238886",
          to: phone,
       })
       console.log(message)
    } catch (error) {
       console.log(error)
    }
}




