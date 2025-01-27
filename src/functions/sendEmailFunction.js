const { app } = require('@azure/functions');

app.http('sendEmailFunction', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        context.log(`Request: ${JSON.stringify(request)}`);

        const name = request.query.get('name') || await request.text() || 'world';

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
                    to: request.body.email, // Recipient email from request body
                    subject: request.body.subject || "Azure Function Email",
                    text: request.body.message || "Hello from Azure Function!"
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

        return { body: `Email Sent!` };
    }
});
