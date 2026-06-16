const router = require('express').Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Define transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    // 1. Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // 2. Respond to user
    res.status(201).json({ success: true, message: 'Message sent!' });

    // 3. Send email with verification log
    console.log(`Attempting to send email to: ${process.env.GMAIL_USER}`);
    
    transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `New Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    })
    .then(info => console.log('Email sent successfully:', info.messageId))
    .catch(err => console.error('EMAIL ERROR DETAILED:', err));

  } catch (err) {
    console.error('DATABASE ERROR:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;