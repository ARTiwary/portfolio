const router = require('express').Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // MUST be a 16-char App Password
  },
  // ADD THIS to prevent the server from hanging on network issues
  connectionTimeout: 5000, 
  greetingTimeout: 5000,
});

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // 1. Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // 2. Fire and forget emails (Don't 'await' them to avoid frontend delay)
    // We wrap them in their own async execution so they don't block the response
    const sendEmails = async () => {
      try {
        // Email to You
        await transporter.sendMail({
          from: `"${name}" <${process.env.GMAIL_USER}>`,
          to: process.env.GMAIL_USER,
          subject: `New Portfolio Inquiry: ${name}`,
          text: `From: ${name} (${email})\n\nMessage: ${message}`
        });
        
        // Auto-reply to User
        await transporter.sendMail({
          from: `"Ayush Raj Tiwary" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: "Thanks for reaching out!",
          html: `<p>Hi ${name}, I've received your message!</p>`
        });
      } catch (err) {
        console.error('Email background task failed:', err);
      }
    };

    sendEmails(); // Run in background

    // 3. Respond to frontend immediately after DB save
    res.status(201).json({ success: true, message: 'Message sent successfully!' });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;