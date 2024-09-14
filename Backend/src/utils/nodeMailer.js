// Import the required modules
import nodemailer from 'nodemailer';

// Function to send email
async function sendbookingEmail(receiverEmail, emailData) {
    try {
       
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dragonaticprince7045@gmail.com',
                pass: 'eeog bgsw fufs ewuz' 
            }
        });

        // Email options
        let mailOptions = {
            from: 'dragonaticprince7045@gmail.com', 
            to: receiverEmail, 
            subject: 'Parkivia', 
            html: `<p>Hi, parkivia here your booking is done at lot no ${emailData}.</p>` 
        };

        // Send email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return { success: true, message: 'Email sent successfully.' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: 'Failed to send email.' };
    }
}
async function sendexitEmail(receiverEmail, emailData,data) {
    try {
        // Create a transporter with Gmail SMTP settings
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dragonaticprince7045@gmail.com', // Your Gmail email address
                pass: 'eeog bgsw fufs ewuz' // Your Gmail password
            }
        });

        // Email options
        let mailOptions = {
            from: 'dragonaticprince7045@gmail.com', // Sender email address
            to: receiverEmail, // Receiver email address
            subject: 'Parkivia', // Subject line
            html: `<p>Hi, parkivia here your booking is over  Your bill is Rs ${data}.</p>` // HTML body
        };

        // Send email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return { success: true, message: 'Email sent successfully.' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: 'Failed to send email.' };
    }
}
async function sendEmail(receiverEmail,data) {
    
    try {
        // Create a transporter with Gmail SMTP settings
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dragonaticprince7045@gmail.com', // Your Gmail email address
                pass: 'eeog bgsw fufs ewuz' // Your Gmail password
            }
        });

        // Email options
        let mailOptions = {
            from: 'dragonaticprince7045@gmail.com', // Sender email address
            to: receiverEmail, // Receiver email address
            subject: 'Parkivia', // Subject line
            html: ` ${data}.</p>` // HTML body
        };

        // Send email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return { success: true, message: 'Email sent successfully.' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: 'Failed to send email.' };
    }
}
export  {sendbookingEmail,sendexitEmail,sendEmail};