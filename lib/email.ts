import nodemailer from "nodemailer"
import { env } from "@/lib/env"

export const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
})

interface SendEmailOptions {
    to: string
    subject: string
    html: string
    text?: string
}

export const sendEmail = async ({ to, subject, html, text }: SendEmailOptions) => {
    try {
        const info = await transporter.sendMail({
            from: env.EMAIL_FROM,
            to,
            subject,
            html,
            text,
        })
        console.log("Message sent: %s", info.messageId)
        return info
    } catch (error) {
        console.error("Error sending email:", error)
        throw error
    }
}
