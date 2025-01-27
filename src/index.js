// const { app } = require('@azure/functions');

// app.setup({
//     enableHttpStream: true,
// });

const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = async function (context, req) {
    try {
        // Set up SMTP transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email details
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: req.body.to, // Recipient email from request body
            subject: req.body.subject || "Azure Function Email",
            text: req.body.message || "Hello from Azure Function!"
        };

        // Send email
        let info = await transporter.sendMail(mailOptions);

        // Respond to request
        context.res = {
            status: 200,
            body: `Email sent to ${req.body.to}: ${info.response}`
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: `Error sending email: ${error.message}`
        };
    }
};