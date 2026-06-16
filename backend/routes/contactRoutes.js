const router = require('express').Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Initialize transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // Ensure this is a 16-character App Password
  },
});

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // 1. Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // 2. Send email notification to YOU
    try {
      await transporter.sendMail({
        from: `"${name}" <${process.env.GMAIL_USER}>`, // Sender address
        to: process.env.GMAIL_USER,
        subject: `New Portfolio Inquiry: ${name}`,
        text: `From: ${name} (${email})\n\nMessage: ${message}`
      });
    } catch (adminEmailErr) {
      console.error('Admin email failed:', adminEmailErr);
      // We don't throw here so the user still gets the auto-reply/success
    }

    // 3. Send AUTO-REPLY to the SENDER
    try {
      await transporter.sendMail({
        from: `"Ayush Raj Tiwary" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Thanks for reaching out!",
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <h2>Hi ${name},</h2>
            <p>Thanks for visiting my portfolio and reaching out!</p>
            <p>I have received your message and will get back to you as soon as possible.</p>
            <br>
            <p>Best regards,<br>
            <strong>Ayush Raj Tiwary</strong></p>
          </div>
        `
      });
    } catch (userEmailErr) {
      console.error('Auto-reply failed:', userEmailErr);
    }

    // Respond success
    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });

  } catch (err) {
    console.error('Database/Server error:', err);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
});

module.exports = router;