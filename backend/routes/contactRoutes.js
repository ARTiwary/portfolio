const router = require('express').Router();
const Contact = require('../models/Contact');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save(); //[cite: 1]

    // Send Admin Notification
    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'ayushrajtiwary07@gmail.com',
      subject: `New Portfolio Inquiry: ${name}`,
      text: `From: ${name} (${email})\n\nMessage: ${message}`
    }).catch(err => console.error('Resend Error:', err));

    // Send Auto-Reply
    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: "Thanks for reaching out!",
      html: `<p>Hi ${name}, thanks for reaching out to Ayush!</p>`
    }).catch(err => console.error('Auto-reply Error:', err));

    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;