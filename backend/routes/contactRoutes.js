const router = require('express').Router();
const Contact = require('../models/Contact');
const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // 1. Save to Database
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // 2. Send via HTTP API (Not SMTP - won't be blocked)
    // We send this as a background task
    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: process.env.GMAIL_USER, // Your email
      subject: `New Portfolio Inquiry: ${name}`,
      text: `From: ${name} (${email})\n\nMessage: ${message}`
    }).catch(err => console.error('Resend Error:', err));

    // 3. Auto-reply to user
    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: "Thanks for reaching out!",
      html: `<p>Hi ${name}, thanks for your message!</p>`
    }).catch(err => console.error('Auto-reply Error:', err));

    res.status(201).json({ success: true, message: 'Message sent!' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Failed to process request.' });
  }
});

module.exports = router;