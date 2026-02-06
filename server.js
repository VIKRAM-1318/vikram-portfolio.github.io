require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Use App Password, not regular password
    }
});

// Verify transporter connection
transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Email server connection failed:', error.message);
        console.log('Please check your EMAIL_USER and EMAIL_PASS in .env file');
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'Please provide name, email, and message'
        });
    }

    // Email content
    const mailOptions = {
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        to: 'rv367629@gmail.com',
        replyTo: email,
        subject: `New Portfolio Message from ${name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px;">
                <div style="background: white; padding: 30px; border-radius: 8px;">
                    <h2 style="color: #667eea; margin-top: 0;">📧 New Contact Form Submission</h2>
                    <hr style="border: none; border-top: 2px solid #eee; margin: 20px 0;">
                    
                    <div style="margin-bottom: 15px;">
                        <strong style="color: #333;">👤 Name:</strong>
                        <p style="margin: 5px 0; color: #555;">${name}</p>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <strong style="color: #333;">📮 Email:</strong>
                        <p style="margin: 5px 0; color: #555;"><a href="mailto:${email}" style="color: #667eea;">${email}</a></p>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <strong style="color: #333;">💬 Message:</strong>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 5px; color: #555; border-left: 4px solid #667eea;">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                    </div>
                    
                    <hr style="border: none; border-top: 2px solid #eee; margin: 20px 0;">
                    <p style="color: #888; font-size: 12px; text-align: center;">
                        This message was sent from your portfolio contact form.<br>
                        Sent at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </p>
                </div>
            </div>
        `,
        text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Message: ${message}

Sent at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent successfully from ${name} (${email})`);
        res.status(200).json({
            success: true,
            message: 'Message sent successfully! I will get back to you soon.'
        });
    } catch (error) {
        console.error('❌ Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Info endpoint for /api/contact GET requests
app.get('/api/contact', (req, res) => {
    res.json({
        message: 'This endpoint accepts POST requests only. Please use the contact form on the portfolio website.',
        usage: 'POST /api/contact with JSON body: { name, email, message }'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Contact form endpoint: http://localhost:${PORT}/api/contact`);
});
