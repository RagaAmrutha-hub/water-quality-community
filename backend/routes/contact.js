const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/send', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // Create transporter using Gmail SMTP
        // IMPORTANT: The user needs to set GMAIL_USER and GMAIL_PASS in the .env file
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        // Email configuration
        // We set 'to' to ragaamrutha3@gmail.com, and send it from the user's gmail (which needs to be authorized)
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: 'ragaamrutha3@gmail.com', // Explicitly setting this as requested
            subject: `New Support Message from ${name} (AB Community Portal)`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>New Support Request</h2>
                    <p><strong>From:</strong> ${name} (${email})</p>
                    <p><strong>Message:</strong></p>
                    <div style="background-color: #f4f4f4; padding: 15px; border-left: 4px solid #0284c7; margin-top: 10px;">
                        ${message.replace(/\n/g, '<br/>')}
                    </div>
                    <p style="margin-top: 30px; font-size: 0.9em; color: #888;">This message was generated automatically from the AB Community Portal.</p>
                </div>
            `
        };

        // Send mail
        await transporter.sendMail(mailOptions);
        
        res.json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Nodemailer Error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email. Check backend configuration.', error: error.message });
    }
});

module.exports = router;
