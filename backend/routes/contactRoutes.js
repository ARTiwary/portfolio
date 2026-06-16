const router = require('express').Router();
const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS.replace(/\s+/g, ''), // Removes spaces from your 16-char App Password
  },
  // Added timeouts to prevent the server from hanging
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // 1. Save to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save(); //[cite: 1, 3]

    // 2. Trigger emails in the background (do not 'await' these)
    const sendEmails = async () => {
      try {
        // Email to You
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: process.env.GMAIL_USER,
          subject: `New Portfolio Inquiry: ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        });

        // Auto-reply to User
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: email,
          subject: "Thanks for reaching out!",
          html: `<p>Hi ${name}, I have received your message and will get back to you soon.</p>`
        });
      } catch (err) {
        console.error('Background email task failed:', err);
      }
    };

    sendEmails(); 

    // 3. Respond immediately to the frontend
    res.status(201).json({ success: true, message: 'Message sent successfully!' });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Server error, please try again.' });
  }
});

module.exports = router;