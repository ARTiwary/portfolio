const router = require('express').Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Use a persistent transporter (defined outside the route)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // MUST be a 16-char App Password
  },
});

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // 1. Save to MongoDB first
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // 2. Respond immediately to the frontend
    res.status(201).json({ success: true, message: 'Message sent successfully!' });

    // 3. Send emails in the background (DO NOT 'await' these)
    // This makes the API call feel instant to the user
    transporter.sendMail({
      from: `"Portfolio" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `📩 New Message from ${name}`,
      html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`
    }).catch(err => console.error('Email 1 Error:', err));

    transporter.sendMail({
      from: `"Ayush" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Thanks for reaching out, ${name}!`,
      html: `<p>Hey ${name}, thanks for your message! I will get back to you soon.</p>`
    }).catch(err => console.error('Email 2 Error:', err));

  } catch (err) {
    console.error('Route error:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

module.exports = router;