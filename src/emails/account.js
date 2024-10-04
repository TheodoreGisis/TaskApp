const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    const msg = {
        to: email,
        from: "teo-otenet@hotmail.com",
        subject: "Hello to the Task Application",
        text: `Hello ${name}, welcome to your task application!` 
    };

    sgMail.send(msg)
        .then(() => {
            console.log('Email sent successfully');
        })
        .catch((error) => {
            console.error('Error sending email:', error.response.body); 
        });
};

module.exports = sendWelcomeEmail;
